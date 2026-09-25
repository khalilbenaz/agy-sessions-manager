'use strict';
// Consommation, chronologie des outils et export de conversation pour Antigravity (agy).
const fs = require('fs');
const path = require('path');
const os = require('os');
const { BRAIN_DIR, HISTORY_FILE } = require('./config');

// Tarifs indicatifs des modèles ($ par million de tokens)
const PRICES = [
  [/gemini-.*flash/, 0.15, 0.60],
  [/gemini-.*pro/, 1.25, 5.00],
  [/claude-.*opus/, 5.00, 25.00],
  [/claude-.*sonnet/, 3.00, 15.00],
  [/gpt-oss/, 0, 0],
];

function price(model) {
  for (const [re, i, o] of PRICES) if (re.test(model || '')) return { i, o };
  return { i: 0.5, o: 2.0 };
}

function cost(model, u) {
  const p = price(model);
  return ((u.in || 0) * p.i + (u.out || 0) * p.o + (u.cr || 0) * p.i * 0.1 + (u.cw || 0) * p.i * 1.25) / 1e6;
}

// ---------------------------------------------------------------- lecture incrémentale
const cache = new Map();
function fresh() { return { size: 0, offset: 0, rest: '', ids: new Set(), models: {}, hours: {}, tools: [], first: 0, last: 0 }; }

function target(input) {
  if (!input || typeof input !== 'object') return '';
  return String(input.file_path || input.path || input.DirectoryPath || input.CommandLine || input.Url || input.query || input.toolAction || input.toolSummary || '').slice(0, 300);
}

function ingest(st, line) {
  if (!line.startsWith('{')) return;
  let o; try { o = JSON.parse(line); } catch { return; }
  const ts = o.created_at ? Date.parse(o.created_at) : (o.timestamp || 0);
  if (ts) { st.first = st.first || ts; st.last = Math.max(st.last, ts); }

  if (Array.isArray(o.tool_calls)) {
    for (const tc of o.tool_calls) {
      st.tools.push({ ts, name: tc.name, target: target(tc.args) });
      if (st.tools.length > 2000) st.tools.splice(0, st.tools.length - 2000);
    }
  }
}

function read(file) {
  let stat; try { stat = fs.statSync(file); } catch { return null; }
  let st = cache.get(file);
  if (!st || stat.size < st.size) { st = fresh(); cache.set(file, st); }
  if (stat.size > st.offset) {
    const fd = fs.openSync(file, 'r');
    try {
      const CH = 4 * 1024 * 1024;
      while (st.offset < stat.size) {
        const len = Math.min(CH, stat.size - st.offset);
        const buf = Buffer.alloc(len);
        fs.readSync(fd, buf, 0, len, st.offset);
        st.offset += len;
        const lines = (st.rest + buf.toString('utf8')).split('\n');
        st.rest = lines.pop();
        for (const l of lines) ingest(st, l);
      }
    } finally { fs.closeSync(fd); }
  }
  st.size = stat.size;
  return st;
}

function totals(st, since = 0) {
  const t = { in: 0, out: 0, cr: 0, cw: 0, cost: 0 };
  for (const [h, b] of Object.entries(st.hours)) if (+h + 3600e3 > since) for (const k in t) t[k] += b[k];
  return t;
}

function findTranscript(id) {
  if (!/^[\w-]+$/.test(id || '')) return null;
  const f = path.join(BRAIN_DIR, id, '.system_generated', 'logs', 'transcript.jsonl');
  if (fs.existsSync(f)) return f;
  return null;
}

// ---------------------------------------------------------------- export Markdown
function exportMarkdown(file, title) {
  const out = [`# ${title || 'Conversation Antigravity (agy)'}`, ''];
  let last = '';
  for (const line of fs.readFileSync(file, 'utf8').split('\n')) {
    if (!line.startsWith('{')) continue;
    let o; try { o = JSON.parse(line); } catch { continue; }
    if (o.type === 'USER_INPUT' && o.content) {
      let t = o.content;
      const m = t.match(/<USER_REQUEST>([\s\S]*?)<\/USER_REQUEST>/);
      if (m) t = m[1].trim();
      out.push('## 🧑 Vous', '', t, '');
      last = 'user';
    } else if (o.type === 'PLANNER_RESPONSE') {
      const parts = [];
      if (o.content && o.content.trim()) parts.push(o.content.trim());
      if (Array.isArray(o.tool_calls)) {
        for (const tc of o.tool_calls) {
          parts.push(`- 🔧 **${tc.name}** ${target(tc.args) ? '`' + target(tc.args).replace(/`/g, "'").slice(0, 160) + '`' : ''}`);
        }
      }
      if (parts.length) {
        if (last !== 'agy') out.push('## 🪐 Antigravity', '');
        out.push(parts.join('\n\n'), '');
        last = 'agy';
      }
    }
  }
  return out.join('\n');
}

module.exports = function (ctx) {
  const { route, json, sessions, history } = ctx;

  route('GET', /^\/api\/sessions\/(\w+)\/usage$/, async ({ res, m }) => {
    const s = sessions.get(m[1]); if (!s) return json(res, 404, { error: 'session inconnue' });
    const f = findTranscript(s.conversationId || s.id);
    if (!f) return json(res, 200, { total: { in: 0, out: 0, cr: 0, cw: 0, cost: 0 }, models: {} });
    const st = read(f);
    const models = Object.fromEntries(Object.entries(st.models).map(([k, v]) => [k, { ...v, cost: cost(k, v) }]));
    json(res, 200, { total: totals(st), models, since: st.first, last: st.last });
  });

  // Vue globale
  route('GET', /^\/api\/usage$/, async ({ res }) => {
    const now = Date.now(), weekAgo = now - 7 * 86400e3;
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const agg = { h5: { in: 0, out: 0, cr: 0, cw: 0, cost: 0 }, today: { in: 0, out: 0, cr: 0, cw: 0, cost: 0 }, d7: { in: 0, out: 0, cr: 0, cw: 0, cost: 0 } };
    const perDay = {}, top = [];
    const hist = history();
    const titles = new Map(hist.map(h => [h.id, h.title]));
    const managed = new Map([...sessions.values()].filter(s => s.conversationId).map(s => [s.conversationId, s.name]));

    try {
      if (fs.existsSync(BRAIN_DIR)) {
        const dirs = fs.readdirSync(BRAIN_DIR);
        for (const id of dirs) {
          const file = path.join(BRAIN_DIR, id, '.system_generated', 'logs', 'transcript.jsonl');
          let stat; try { stat = fs.statSync(file); } catch { continue; }
          if (stat.mtimeMs < weekAgo) continue;
          const st = read(file); if (!st) continue;
          const add = (a, b) => { for (const k in a) a[k] += b[k]; };
          add(agg.h5, totals(st, now - 5 * 3600e3)); add(agg.today, totals(st, +today)); add(agg.d7, totals(st, weekAgo));
          const w = totals(st, weekAgo);
          top.push({ id, name: managed.get(id) || titles.get(id) || id.slice(0, 8), ...w });
        }
      }
    } catch { }

    top.sort((a, b) => b.cost - a.cost);
    json(res, 200, { ...agg, perDay, top: top.slice(0, 15), note: 'Coût estimé indicatif pour les modèles Antigravity / Gemini.' });
  });

  route('GET', /^\/api\/sessions\/(\w+)\/timeline$/, async ({ res, m }) => {
    const s = sessions.get(m[1]); if (!s) return json(res, 404, { error: 'session inconnue' });
    const f = findTranscript(s.conversationId || s.id);
    json(res, 200, f ? read(f).tools.slice(-500) : []);
  });

  route('GET', /^\/api\/history\/([\w-]+)\/export$/, async ({ res, m }) => {
    const f = findTranscript(m[1]); if (!f) return json(res, 404, { error: 'conversation introuvable' });
    const title = (history().find(h => h.id === m[1]) || {}).title;
    json(res, 200, { title: title || m[1], markdown: exportMarkdown(f, title) });
  });
};
module.exports.cost = cost;
