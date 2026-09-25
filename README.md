# AGY Sessions

Une seule fenêtre pour piloter plusieurs sessions **Antigravity CLI (`agy`)** au lieu d'une pile d'onglets de terminal. **macOS et Windows · libre (MIT).**

**Dépôt GitHub : [github.com/khalilbenaz/agy-sessions-manager](https://github.com/khalilbenaz/agy-sessions-manager)**

---

## Fonctionnalités clés

- 🪐 **Sessions Antigravity simultanées** : chaque session s'exécute dans un pseudo-terminal (PTY) complet avec émulateur `xterm.js`, support ANSI / truecolor et raccourcis interactifs.
- ⚡ **Persistance & reprise** : fermer la fenêtre ou redémarrer le serveur ne coupe rien ; les sessions continuent de tourner en tâche de fond et reviennent au lancement via `agy --conversation <id>`.
- 🟢 **État en direct (Hooks de cycle de vie)** : intégration native avec les hooks Antigravity (`PreInvocation`, `PreToolUse`, `Stop`) et détection d'activité pour savoir instantanément quelle session travaille, laquelle attend votre réponse ou laquelle est prête.
- 🎯 **Sélection de modèles & modes** : choix simple du modèle (`gemini-3.8-flash`, `gemini-3.1-pro`, `claude-sonnet-4-6`, etc.), du niveau de raisonnement (effort low/medium/high/max) et du mode d'exécution (`accept-edits`, `plan`, `dangerously-skip-permissions`).
- 🌿 **Worktrees Git dédiés** : faites travailler plusieurs sessions sur le même dépôt Git sans conflit de branches, avec panneau de modifications (diff) et commit intégré.
- ⏳ **File d'attente & envoi groupé** : empilez des prompts pour qu'ils s'exécutent dès que la session a fini son tour, ou diffusez un prompt à plusieurs sessions à la fois.
- 🔒 **Verrouillage par mot de passe** : protégez l'affichage et la saisie de sessions confidentielles.
- 🔍 **Palette de commandes (<kbd>Ctrl+K</kbd> / <kbd>Cmd+K</kbd>)** : navigation rapide, recherche textuelle et bibliothèque de prompts réutilisables.
- 📱 **Remote Control** : option `--remote-control` en un clic.
- 💻 **CLI `asm` incluse** : démarrez le serveur, contrôlez le statut et lancez l'application en ligne de commande.

---

## 1. Installation

### Prérequis
- **Antigravity CLI (`agy`)** installé et accessible dans votre terminal.
- **Node.js >= 18** (si vous lancez le serveur ou développez).

### Lancement direct
```bash
git clone https://github.com/khalilbenaz/agy-sessions-manager.git
cd agy-sessions-manager
npm install
npm start
```
Puis ouvrez `http://127.0.0.1:7892/` dans votre navigateur ou lancez l'application de bureau :
```bash
npm run app
```

### Installation du service & raccourci CLI (`asm`)
```bash
node bin/asm.js install
```
Sous macOS, cela configure un LaunchAgent pour lancer le serveur automatiquement en tâche de fond et place un raccourci dans `~/Applications`.

---

## 2. Guide d'utilisation

### Créer une nouvelle session
1. Cliquez sur **+ Nouvelle** ou utilisez le raccourci <kbd>Ctrl+Alt+N</kbd> (<kbd>Cmd+Alt+N</kbd> sur Mac).
2. Choisissez le **dossier de travail** (bouton *Parcourir…*).
3. Sélectionnez le **modèle** souhaité (ex. *Gemini 3.8 Flash*, *Gemini 3.1 Pro*), le mode et l'effort.
4. Optionnellement, cochez **Travailler dans un worktree git dédié** pour créer une branche isolée sans toucher à votre copie de travail principale.
5. Cliquez sur **Lancer**.

### Raccourcis clavier essentiels

| Raccourci | Action |
|---|---|
| <kbd>Ctrl+Alt+N</kbd> / <kbd>Cmd+Alt+N</kbd> | Nouvelle session |
| <kbd>Ctrl+K</kbd> / <kbd>Cmd+K</kbd> | Palette de commandes |
| <kbd>Ctrl+Alt+H</kbd> / <kbd>Cmd+Alt+H</kbd> | Historique des conversations |
| <kbd>Ctrl+Alt+G</kbd> / <kbd>Cmd+Alt+G</kbd> | Panneau des modifications Git |
| <kbd>Ctrl+Alt+Q</kbd> / <kbd>Cmd+Alt+Q</kbd> | File d'attente de prompts |
| <kbd>Ctrl+Alt+B</kbd> / <kbd>Cmd+Alt+B</kbd> | Envoi groupé à plusieurs sessions |
| <kbd>Ctrl+,</kbd> / <kbd>Cmd+,</kbd> | Réglages |

---

## 3. Architecture

```
agy-sessions-manager/
├── bin/
│   └── asm.js            # CLI de pilotage (daemon, open, install, status)
├── lib/
│   ├── config.js         # Résolution du binaire agy, ports et chemins
│   ├── git.js            # Gestion des dépôts, worktrees et statuts git
│   ├── lock.js           # Verrouillage sécurisé des sessions par mot de passe
│   ├── queue.js          # File d'attente de prompts et envoi direct
│   ├── remote.js         # Intégration agy --remote-control
│   ├── settings.js       # Réglages, templates et bibliothèque de prompts
│   ├── tools.js          # Diagnostics, logs et ouverture dans éditeurs
│   └── usage.js          # Timeline des outils, historique et export markdown
├── public/               # Frontend web léger (vanilla JS + CSS + xterm.js)
├── electron/             # Enveloppe application de bureau (macOS / Windows)
├── hook.js               # Script de hook récepteur pour le cycle de vie agy
└── server.js             # Serveur local Node.js (PTY, WebSocket, HTTP)
```

---

## 4. Tests

Une suite de tests d'intégration complète avec simulation d'agent CLI est incluse :
```bash
npm test
```

---

## Licence

MIT © [Khalil Benazzouz](https://github.com/khalilbenaz)
