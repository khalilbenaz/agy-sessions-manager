'use strict';
// Accès distant via la commande Antigravity Remote Control (--remote-control).
module.exports = function (ctx) {
  const { route, json, readBody, sessions, publicView, persist, broadcast } = ctx;

  // Arguments ajoutés au lancement d'une session (lu par spawnSession).
  ctx.remoteArgs = s => {
    const all = ctx.getSettings?.().remoteAll;
    if (!(s.remote || (all && s.remote !== false))) return [];
    return ['--remote-control'];
  };

  route('POST', /^\/api\/sessions\/(\w+)\/remote$/, async ({ req, res, m }) => {
    const s = sessions.get(m[1]); if (!s) return json(res, 404, { error: 'session inconnue' });
    const { on } = await readBody(req);
    s.remote = !!on;
    persist(); broadcast({ t: 'session', s: publicView(s) });
    json(res, 200, publicView(s));
  });
};
