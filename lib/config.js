'use strict';
// Emplacements et réglages communs au serveur et à la CLI, par OS.
const fs = require('fs');
const path = require('path');
const os = require('os');
const { execFileSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
// --port=N (utilisé par la tâche planifiée / le LaunchAgent, qui ne transmettent pas d'environnement) ou ASM_PORT.
const argPort = (process.argv.find(a => a.startsWith('--port=')) || '').slice(7);
const PORT = Number(argPort || process.env.ASM_PORT || 7892);
const IS_WIN = process.platform === 'win32';
const IS_MAC = process.platform === 'darwin';

function defaultDataDir() {
  if (IS_WIN) return path.join(process.env.APPDATA || path.join(os.homedir(), 'AppData', 'Roaming'), 'agy-sessions');
  if (IS_MAC) return path.join(os.homedir(), 'Library', 'Application Support', 'agy-sessions');
  return path.join(process.env.XDG_DATA_HOME || path.join(os.homedir(), '.local', 'share'), 'agy-sessions');
}
// Un port non standard a ses propres données (permet de tester sans toucher l'instance principale).
const DATA = process.env.ASM_DATA || (PORT === 7892 ? defaultDataDir() : `${defaultDataDir()}-${PORT}`);
const LEGACY_DATA = path.join(ROOT, 'data');

// Même nom d'instance pour la tâche planifiée / le LaunchAgent / le raccourci.
const SUFFIX = PORT === 7892 ? '' : ` ${PORT}`;
const TASK_NAME = `AGY Sessions Manager${SUFFIX}`;
const LAUNCHD_LABEL = PORT === 7892 ? 'com.agy-sessions.server' : `com.agy-sessions.server.${PORT}`;
const APP_NAME = `AGY Sessions${SUFFIX}`;

// Répertoire des données et historiques d'Antigravity (agy)
const BRAIN_DIR = path.join(os.homedir(), '.gemini', 'antigravity-cli', 'brain');
const HISTORY_FILE = path.join(os.homedir(), '.gemini', 'antigravity-cli', 'history.jsonl');
const GEMINI_CONFIG_DIR = path.join(os.homedir(), '.gemini', 'config');

function which(cmd) {
  try {
    const out = execFileSync(IS_WIN ? 'where' : 'which', [cmd], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
    return out.split(/\r?\n/).map(s => s.trim()).find(Boolean) || null;
  } catch { return null; }
}

function stablePath(p) {
  if (!p || !/fnm_multishells/.test(p)) return p;
  try { return path.join(fs.realpathSync(path.dirname(p)), path.basename(p)); } catch { return p; }
}

// agy peut ne pas être dans le PATH d'un service (launchd a un PATH minimal) : emplacements usuels en secours.
function resolveAgy() {
  if (process.env.ASM_AGY) return process.env.ASM_AGY;
  const found = which('agy');
  if (found) return stablePath(found);
  const home = os.homedir();
  const candidates = IS_WIN
    ? [path.join(home, '.local', 'bin', 'agy.exe'), path.join(process.env.APPDATA || '', 'npm', 'agy.cmd'),
      path.join(process.env.LOCALAPPDATA || '', 'Programs', 'agy', 'agy.exe')]
    : [path.join(home, '.local', 'bin', 'agy'), '/opt/homebrew/bin/agy', '/usr/local/bin/agy'];
  return candidates.find(p => { try { return fs.statSync(p).isFile(); } catch { return false; } }) || 'agy';
}

module.exports = {
  stablePath, ROOT, PORT, IS_WIN, IS_MAC, DATA, LEGACY_DATA,
  TASK_NAME, LAUNCHD_LABEL, APP_NAME, which, resolveAgy,
  BRAIN_DIR, HISTORY_FILE, GEMINI_CONFIG_DIR
};
