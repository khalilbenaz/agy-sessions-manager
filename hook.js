'use strict';
// Hook Antigravity (agy) -> AGY Sessions Manager. Ne doit jamais bloquer ni faire échouer la session agy.
const http = require('http');
const [, , rawEvent] = process.argv;
const ASM_ID = process.env.ASM_ID;
const ASM_PORT = process.env.ASM_PORT || '7892';
const ASM_TOKEN = process.env.ASM_TOKEN || '';

let input = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', c => { input += c; });
process.stdin.on('end', send);
setTimeout(send, 2500); // Filet de sécurité si stdin ne se ferme pas

let sent = false;
function send() {
  if (sent) return; sent = true;
  let data = {};
  try { data = JSON.parse(input || '{}'); } catch { }

  let event = rawEvent || 'working';
  if (rawEvent === 'PreInvocation') event = 'working';
  else if (rawEvent === 'PreToolUse') event = 'working';
  else if (rawEvent === 'Stop') event = 'idle';
  else if (rawEvent === 'SessionStart') event = 'start';

  const toolName = data.toolCall?.name || data.tool_name || '';
  const conversationId = data.conversationId || data.session_id || '';

  const body = JSON.stringify({
    asm: ASM_ID || conversationId,
    event,
    data: {
      conversationId,
      session_id: conversationId,
      message: data.message || '',
      tool_name: toolName
    },
  });

  const req = http.request({
    host: '127.0.0.1', port: Number(ASM_PORT), path: '/api/hook', method: 'POST', timeout: 4000,
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(body),
      'X-ASM-Token': ASM_TOKEN,
      Host: `127.0.0.1:${ASM_PORT}`
    },
  }, res => {
    res.resume();
    res.on('end', finish);
  });
  req.on('error', finish);
  req.on('timeout', () => { req.destroy(); finish(); });
  req.end(body);
}

function finish() {
  // Répond au contrat JSON attendu par agy
  if (rawEvent === 'PreToolUse') {
    process.stdout.write(JSON.stringify({ decision: 'allow' }) + '\n');
  } else {
    process.stdout.write('{}\n');
  }
  process.exit(0);
}
