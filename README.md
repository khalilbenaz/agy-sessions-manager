# AGY Sessions

Une seule fenêtre pour piloter plusieurs sessions [Antigravity CLI](https://github.com/google/antigravity) (`agy`) au lieu d'une pile d'onglets de terminal. **Windows et macOS · libre (MIT).**

**Site et guide : https://khalilbenaz.github.io/agy-sessions-manager/** · [Guide détaillé en ligne](https://khalilbenaz.github.io/agy-sessions-manager/guide.html) · [Journal des versions](CHANGELOG.md)

## Sommaire

1. [Installation](#1-installation)
2. [Premiers pas](#2-premiers-pas)
3. [L'écran principal](#3-lécran-principal)
4. [Les sessions](#4-les-sessions)
5. [Ranger : groupes, épinglage, couleurs](#5-ranger--groupes-épinglage-couleurs)
6. [Vue partagée](#6-vue-partagée)
7. [Worktrees git : plusieurs AGY sur le même dépôt](#7-worktrees-git--plusieurs-agy-sur-le-même-dépôt)
8. [Panneau Modifications, Chronologie, Consommation](#8-panneau-modifications-chronologie-consommation)
9. [Historique et sessions ouvertes dans un terminal](#9-historique-et-sessions-ouvertes-dans-un-terminal)
10. [Images et fichiers](#10-images-et-fichiers)
11. [Palette, recherche, prompts, file d'attente, envoi groupé](#11-palette-recherche-prompts-file-dattente-envoi-groupé)
12. [Modèles de session](#12-modèles-de-session)
13. [Verrouiller une session par mot de passe](#13-verrouiller-une-session-par-mot-de-passe)
14. [Notifications, zone de notification, arrière-plan](#14-notifications-zone-de-notification-arrière-plan)
15. [Thème clair / sombre, langue](#15-thème-clair--sombre-langue)
16. [Réglages](#16-réglages)
17. [Mises à jour](#17-mises-à-jour)
18. [Raccourcis clavier](#18-raccourcis-clavier)
19. [Données, sécurité, confidentialité](#19-données-sécurité-confidentialité)
20. [Dépannage](#20-dépannage)
21. [Ligne de commande `asm` (sans l'application)](#21-ligne-de-commande-asm-sans-lapplication)
22. [Développement](#22-développement)

---

<a id="installation"></a><a id="application-recommandé"></a>
## 1. Installation

Seul prérequis : **Antigravity CLI** installé (la commande `agy` fonctionne dans un terminal). Node.js n'est pas nécessaire pour utiliser l'application de bureau.

| Système | Fichier ([dernière version](https://github.com/khalilbenaz/agy-sessions-manager/releases/latest)) | Installation |
|---|---|---|
| Windows 10 / 11 | `AGY-Sessions-Setup-x.y.z.exe` | double-clic ; installation en un clic, sans droits administrateur |
| Mac Apple Silicon (M1…M4) | `AGY-Sessions-x.y.z-arm64.dmg` | ouvrir, glisser **AGY Sessions** dans Applications |
| Mac Intel | `AGY-Sessions-x.y.z-x64.dmg` | idem |

L'application n'est pas encore signée par un certificat éditeur, chaque système prévient donc au premier lancement :
- **Windows** : « Windows a protégé votre ordinateur » → *Informations complémentaires* → *Exécuter quand même*.
- **macOS** : au premier lancement, macOS bloque l'app (« impossible de vérifier le développeur »). Ouvre **Réglages Système › Confidentialité et sécurité**, descends jusqu'au message sur AGY Sessions et clique **Ouvrir quand même** (puis confirme). Sur les macOS récents, « clic droit › Ouvrir » ne suffit plus. Autre possibilité, dans le Terminal : `xattr -cr "/Applications/AGY Sessions.app"`.

Ensuite, les nouvelles versions s'installent toutes seules sous Windows (§ 17).

## 2. Premiers pas

1. Lance **AGY Sessions**. Au premier lancement, un assistant vérifie que `agy` et `git` sont installés et propose de créer ta première session.
2. **+ Nouvelle** (<kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>N</kbd> ou <kbd>⌥</kbd>+<kbd>⌃</kbd>+<kbd>N</kbd>) : choisis un **dossier de travail** (*Parcourir…*), éventuellement un nom et un groupe, le modèle (gemini-2.5-pro, claude-3-7-sonnet, etc.), le niveau de réflexion (*effort*), puis **Lancer**.
3. La session démarre : c'est un vrai Antigravity CLI, avec tes règles, tes skills, tes hooks personnalisés, tes serveurs MCP et tes slash commands (`/goal`, `/plan`, `/schedule`, `/browser`, etc.). Tu tapes comme dans un terminal.
4. Crée d'autres sessions de la même façon : elles apparaissent dans la barre latérale et tournent **toutes en même temps**.

Tu peux fermer la fenêtre à tout moment : les sessions continuent en arrière-plan et reviennent même après un redémarrage de l'ordinateur.

## 3. L'écran principal

```
┌─ barre latérale ──────┬─ barre de la session active ────────────────────────────────────────┐
│ + Nouvelle            │ ● nom ✎  ⎇ branche  dossier  état   ▢◫⊟⊞  ± Modifications  ↗ Ouvrir │
│ Rechercher…   Ctrl+K  │                                    Joindre  Relancer  ⋯  Fermer     │
│ ─ ÉPINGLÉES ─     1   ├──────────────────────────────────────────────────┬──────────────────┤
│ ● session A           │                                                  │ panneau latéral  │
│ ─ PROJET X ─      2   │   terminal de la session (ou 2 / 4 panneaux)     │  Modifications   │
│ ● session B           │                                                  │  Chronologie     │
│ ● session C           │                                                  │  Consommation    │
│ ─ SANS GROUPE ─   1   │                                                  │                  │
│ ● session D (verrou)  │                                                  │                  │
│ Dans un terminal (2)  │                                                  │                  │
│ Historique   ⚙   ⇤    │                                                  │                  │
└───────────────────────┴──────────────────────────────────────────────────┴──────────────────┘
```

- **Barre latérale** : tes sessions, rangées par groupe, avec leur état en direct. En bas : l'historique des conversations, les réglages (⚙) et le mode compact (⇤).
- **Barre de la session active** : nom (✎ renommer), branche si c'est un worktree, dossier, état ; à droite la disposition (1, 2 ou 4 panneaux), le panneau Modifications, « Ouvrir dans… », joindre un fichier (📎), relancer, le menu **⋯** (toutes les actions de la session) et Fermer.
- **Clic droit** partout : menu adapté (session, terminal, champ de saisie, historique, icône de la zone de notification).

### États d'une session

| Pastille | État | Signification |
|---|---|---|
| 🟠 orange (clignote) | travaille | Antigravity répond, réfléchit ou exécute un outil (commandes, lecture/écriture de code, MCP) |
| 🔴 rouge (pulse) | attend une réponse | Antigravity a besoin de toi (question, confirmation, clarification) : notification et son |
| 🟢 vert | prêt | Antigravity a terminé (« terminé » tant que tu n'as pas regardé la session) |
| ⚪ cercle | arrêtée | le processus est arrêté ; « Reprendre » relance la conversation (`agy --conversation <id>`) |

Après <kbd>Ctrl</kbd>+<kbd>C</kbd> ou <kbd>Échap</kbd> pendant une réponse, la session repasse à « prêt (interrompu) ». Une session **rouge** le reste tant qu'Antigravity attend vraiment : l'afficher ne suffit pas, il faut lui répondre.

L'état vient directement des hooks du cycle de vie Antigravity (`PreInvocation`, `PreToolUse`, `Stop` configurés automatiquement dans `~/.gemini/config/hooks.json`) : il est exact même fenêtre fermée.

<a id="fonctionnement"></a><a id="persistance"></a>
## 4. Les sessions

| Action | Où | Effet |
|---|---|---|
| **Nouvelle** | + Nouvelle, <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>N</kbd>, palette | dossier, nom, groupe, modèle, mode, worktree, premier prompt, arguments |
| **Renommer** | ✎, double-clic sur le nom, <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>R</kbd> | le nom est aussi mémorisé et affiché dans l'historique Antigravity |
| **Relancer / Reprendre** | bouton ou ⋯ | relance Antigravity dans la **même conversation** (`--conversation <id>`) |
| **Arrêter** | ⋯ › Arrêter | arrête le processus ; la session reste dans la liste |
| **Fermer** | Fermer, <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>W</kbd> | arrête et retire la session ; la conversation reste dans l'Historique |
| **Changer de session** | clic, <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>1</kbd>…<kbd>9</kbd>, <kbd>↑</kbd>/<kbd>↓</kbd> | <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>A</kbd> : prochaine session qui t'attend |
| **Réordonner** | glisser-déposer dans la liste | ordre mémorisé |
| **Ouvrir dans…** | ↗ Ouvrir, <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>E</kbd> | le dossier dans ton éditeur (VS Code, Antigravity IDE, Cursor, Windsurf, Zed, IntelliJ, Sublime ou commande personnalisée), le Finder / l'Explorateur, un terminal |

**Persistance** : chaque session ouverte (dossier, nom, modèle, groupe, ordre, identifiant de conversation) est mémorisée. Après un redémarrage de l'ordinateur ou de l'app, toutes celles qui tournaient sont relancées dans leur conversation. Seules celles que tu as arrêtées ou fermées restent arrêtées.

## 5. Ranger : groupes, épinglage, couleurs

Un **groupe** est une étiquette libre qui sert à **ranger tes sessions par projet dans la barre latérale** — par exemple « Backend », « Frontend », « Client X », « Expérimentations ». Il n'a aucun effet sur le fonctionnement des sessions : c'est de l'organisation visuelle.

- **Définir le groupe** : champ *Groupe* dans « Nouvelle session » (les groupes existants sont proposés), ou plus tard ⋯ › **Groupe…** (taper `-` pour retirer la session de son groupe).
- **Affichage** : chaque groupe a un en-tête (nom + nombre de sessions) ; **clic sur l'en-tête = replier / déplier**. Les sessions sans groupe sont sous « Sans groupe ».
- **Épingler** (⋯ › Épingler en haut) : la session passe dans « Épinglées », tout en haut, quel que soit son groupe.
- **Couleur** : liseré à gauche de la session pour la repérer d'un coup d'œil.
- Un **modèle de session** peut fixer le groupe (§ 12).

## 6. Vue partagée

Pour **suivre plusieurs sessions en même temps** : boutons de disposition dans la barre (▢ une, ◫ deux colonnes, ⊟ deux lignes, ⊞ grille 2×2) ou palette.

- **Placer une session** : glisse-la depuis la barre latérale sur un panneau, ou clique-la (elle va dans le panneau actif, surligné en cyan/indigo).
- **Changer de panneau** : clic dans le panneau ou <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>←</kbd>/<kbd>→</kbd> ; ✕ en haut d'un panneau le vide.
- Chaque terminal garde sa propre taille ; la disposition est mémorisée.
- **Mode focus** (<kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>F</kbd>) : masque la barre latérale.

## 7. Worktrees git : plusieurs AGY sur le même dépôt

Deux sessions qui modifient le même dépôt au même moment se marchent dessus. Un **worktree git** donne à une session **son propre dossier et sa propre branche**, à côté du dépôt principal, sans y toucher.

1. « Nouvelle session » dans un dépôt git → cocher **Travailler dans un worktree git dédié**. Une branche est proposée (`asm/<nom>`), modifiable.
2. La session travaille dans `<dépôt>.worktrees/<branche>` ; son badge **⎇ branche** apparaît dans la liste et la barre.
3. Travail prêt : panneau **Modifications** → commit, puis **Fusionner dans `<branche de base>`**.
4. En fermant la session : **garder** le worktree (y revenir plus tard), **fusionner puis supprimer**, ou **supprimer** (abandonner la branche).

La fusion est refusée s'il reste des modifications non commitées, si le dépôt principal n'est pas sur la branche de base, ou en cas de conflit (la fusion est alors annulée proprement).

## 8. Panneau Modifications, Chronologie, Consommation

Bouton **± Modifications** (<kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>G</kbd>) ou ⋯ : panneau latéral à trois onglets pour la session active.

- **Modifications** : fichiers modifiés dans le dossier de la session (git) avec leur état (M modifié, N nouveau, S supprimé). Clic = **diff coloré** ; ↺ = annuler un fichier ; **commit** avec « Proposer un message » et « Committer tout ». Rafraîchi quand Antigravity a fini un tour.
- **Chronologie** : les actions d'Antigravity (📖 lecture de fichier, ✏️ écriture de code, ▶ commande terminal, 🔎 recherche web ou de code…) avec l'heure exacte.
- **Consommation** : tokens d'entrée / sortie et **coût estimé** de la session, puis de toutes les sessions sur 5 h, aujourd'hui et 7 jours ; graphique par jour ; sessions les plus coûteuses. Estimation calculée à partir des transcripts d'Antigravity.

**Exporter une conversation** : ⋯ › Exporter → Markdown (fichier ou presse-papiers) ou impression / PDF.

## 9. Historique et sessions ouvertes dans un terminal

- **Historique** (🕘, <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>H</kbd>) : toutes tes conversations Antigravity de cet ordinateur (titre, dossier, branche, dernier message, transcript complet), filtrables. Clic = reprendre la conversation dans une nouvelle session, dans son dossier. Clic droit : renommer, copier le chemin ou l'identifiant.
- **Dans un terminal** (bas de la barre latérale) : les sessions `agy` lancées dans des terminaux externes apparaissent toutes seules grâce aux hooks. Clic → **Déplacer** (la session s'arrête dans le terminal et reprend ici, même conversation) ou **Copier** (le terminal continue, une copie s'ouvre ici). **Tout ramener** les déplace toutes.

## 10. Images et fichiers

Comme dans un terminal natif, Antigravity reçoit images et fichiers :
- **glisser-déposer** un fichier sur le terminal ;
- **coller** une capture d'écran (<kbd>Ctrl</kbd>+<kbd>V</kbd> / <kbd>⌘</kbd>+<kbd>V</kbd>) ;
- bouton **📎**, ou clic droit › Joindre un fichier… / Coller.

Le fichier est copié dans un dossier temporaire et son chemin collé dans ta ligne de saisie : Antigravity reçoit le lien direct vers le fichier ou l'image et l'intègre dans le tour suivant. Les copies sont effacées automatiquement après 7 jours.

## 11. Palette, recherche, prompts, file d'attente, envoi groupé

- **Palette de commandes** (<kbd>Ctrl</kbd>/<kbd>⌘</kbd>+<kbd>K</kbd>) : quelques lettres pour aller à une session, reprendre une conversation, lancer un modèle, insérer un prompt ou exécuter une action (disposition, thème, réglages, diagnostic, verrouillage…). Les actions récentes remontent en tête.
- **Rechercher dans les sessions** (<kbd>Ctrl</kbd>/<kbd>⌘</kbd>+<kbd>Maj</kbd>+<kbd>F</kbd>) : un texte dans le contenu de tous les terminaux ouverts ; clic = y aller.
- **Bibliothèque de prompts** (⋯ › Insérer un prompt…, palette, Réglages › Prompts) : tes demandes réutilisables. Elle démarre avec 8 prompts prêts à l'emploi (relire les modifications, écrire les tests, expliquer du code, préparer un commit, corriger un bug, proposer un plan avec `/plan`, documenter, résumer), modifiables et supprimables ; **+ Nouveau** pour ajouter les tiens. **Insérer** les place dans la ligne de saisie ; **Envoyer** les soumet directement. Variables : `{dossier}`, `{branche}`, `{nom}`, `{selection}` (texte sélectionné dans le terminal).
- **File d'attente** (⋯ › File d'attente…, <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>Q</kbd>) : des prompts envoyés **un par un, automatiquement, chaque fois qu'Antigravity a fini** le précédent — « implémente », puis « ajoute les tests », puis « relis ». Le badge ⏳ indique le nombre en attente.
- **Envoi groupé** (<kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>B</kbd>) : le même prompt à plusieurs sessions cochées, tout de suite ou en file d'attente si elles travaillent.

## 12. Modèles de session

Un **modèle** mémorise une session type : dossier, nom, groupe, modèle d'IA, effort, worktree, arguments et **premier prompt** (envoyé dès que la session est prête).

- **Créer** : sur une session existante, ⋯ ou clic droit › **Enregistrer comme modèle…** (reprend son dossier, son groupe, son modèle et ses paramètres) ; ou remplis « Nouvelle session » puis **Enregistrer comme modèle**.
- **Utiliser** : liste *Modèle de session* en haut de « Nouvelle session », ou palette › « Lancer le modèle : … ».
- **Gérer** : Réglages › Modèles de session (lancer, renommer, supprimer).

## 13. Verrouiller une session par mot de passe

Pour masquer une session sensible (écran partagé, démonstration en direct, poste laissé ouvert) : ⋯ ou clic droit › **Verrouiller par mot de passe…** (<kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>L</kbd>), avec un indice facultatif.

- La session **continue de tourner**, mais son contenu est masqué et la saisie bloquée : un écran 🔒 demande le mot de passe. Dans la liste, 🔒 = verrouillée, 🔓 = déverrouillée dans cette fenêtre.
- Le verrou est **appliqué par le serveur** : une fenêtre non déverrouillée ne reçoit ni l'affichage de la session ni son historique, et les actions sensibles (modifications, export, chronologie, consommation, file d'attente, fermeture) sont refusées ; son titre est masqué dans l'Historique.
- Déverrouiller ne vaut que pour **la fenêtre** où tu as tapé le mot de passe. Le verrou revient quand la fenêtre est réduite ou masquée, après une inactivité (Réglages › Sécurité), au redémarrage de l'app, ou tout de suite avec ⋯ › **Verrouiller maintenant**.
- ⋯ › **Changer le mot de passe…** / **Retirer le mot de passe…**
- Mot de passe haché (scrypt), tentatives protégées. **Il ne peut pas être récupéré** : si tu l'oublies, ferme la session (la conversation reste intacte dans les fichiers d'Antigravity).
- Limite : le verrou protège ce qu'affiche l'application ; les conversations enregistrées par Antigravity (`~/.gemini/antigravity-cli/brain/`) restent des fichiers locaux sur ton disque.

## 14. Notifications, zone de notification, arrière-plan

- **Notifications système** quand une session attend ta réponse ou a fini (seulement si tu ne la regardes pas), avec un **son** au choix. **Ne pas déranger** coupe tout ; ⋯ › Couper les alertes le fait pour une seule session.
- **Rappels** si une session attend depuis X minutes ou travaille depuis plus de Y minutes (Réglages › Notifications).
- **Pastille** sur l'icône de l'app (Dock / barre des tâches) avec le nombre de sessions en attente. Sur macOS, notification système et point rouge sur l'icône du Dock.
- **Zone de notification** (Windows, près de l'horloge) / **barre de menus** (macOS) : **réduire ou fermer la fenêtre l'y envoie**, les sessions continuent. Clic sur l'icône = afficher / masquer ; **clic droit** = la **liste des sessions et leur état** (🟠 travaille, 🔴 attend, 🟢 prête ; clic pour y aller), nouvelle session, historique, réglages, lancer au démarrage, redémarrer le serveur, quitter. Un **point rouge** sur l'icône signale une session qui t'attend.
- **Quitter** : « Quitter (les sessions continuent) » ferme l'app ; « Quitter et arrêter toutes les sessions » arrête aussi le serveur (elles reviendront au prochain lancement).
- **Lancement au démarrage** de l'ordinateur : configurable et géré par LaunchAgent sur macOS et le Planificateur de tâches sur Windows.

## 15. Thème clair / sombre, langue

- **Thème** : **Système** (par défaut) suit automatiquement le mode clair ou sombre de Windows / macOS, y compris quand il change en cours de journée ; ou forcer **Clair** / **Sombre** (Réglages › Général, ou palette › « Thème »). Le terminal adapte sa palette de couleurs au thème sélectionné.
- **Langue** : français ou anglais, automatiquement selon la langue du système, ou sélectionnée manuellement dans Réglages › Général.

## 16. Réglages

⚙ en bas de la barre latérale, ou <kbd>Ctrl</kbd>/<kbd>⌘</kbd>+<kbd>,</kbd>.

| Onglet | Contenu |
|---|---|
| **Général** | thème (système, clair, sombre), langue, modèle et mode par défaut, worktree proposé par défaut, éditeur pour « Ouvrir dans », mises à jour automatiques, barre latérale compacte, réduire / fermer dans la zone de notification |
| **Terminal** | taille et police du texte, options de défilement et curseur |
| **Notifications** | notifications système, son (avec test d'écoute), ne pas déranger, rappels d'attente et d'exécution prolongée |
| **Sécurité** | reverrouiller quand la fenêtre est masquée, délai d'inactivité |
| **Modèles de session** | lancer, renommer, supprimer |
| **Prompts** | gérer la bibliothèque de prompts réutilisables |
| **Diagnostic** | versions, `agy` et `git` détectés, hooks installés, dossiers de données, dernières lignes du journal ; **Copier le rapport** pour une issue |
| **Journaux** | le journal d'activité du serveur en direct, filtrable |
| **À propos** | version installée, recherche de mises à jour, liens utiles |

## 17. Mises à jour

- **Windows** : l'app vérifie les nouvelles versions, les télécharge en arrière-plan et affiche un bandeau **Redémarrer pour mettre à jour**. Le serveur est relancé avec le nouveau code et **tes sessions reviennent toutes seules**.
- **macOS** : l'app te prévient lorsqu'une mise à jour est disponible et ouvre la page de téléchargement de la version correspondante.
- Réglages › À propos › **Rechercher des mises à jour** pour vérifier immédiatement.
- Bandeau jaune **« le serveur tourne une ancienne version »** : clique **Redémarrer le serveur** pour recharger la dernière version du code sans perdre tes sessions.

<a id="raccourcis"></a><a id="raccourcis-ctrlalt"></a><a id="raccourcis-ctrlalt--sur-mac--ctrloption"></a>
## 18. Raccourcis clavier

| Raccourci | Action |
|---|---|
| <kbd>Ctrl</kbd>/<kbd>⌘</kbd>+<kbd>K</kbd> | palette de commandes |
| <kbd>Ctrl</kbd>/<kbd>⌘</kbd>+<kbd>,</kbd> | réglages |
| <kbd>Ctrl</kbd>/<kbd>⌘</kbd>+<kbd>Maj</kbd>+<kbd>F</kbd> | rechercher dans toutes les sessions actives |
| <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>N</kbd> | nouvelle session |
| <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>H</kbd> | historique des conversations |
| <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>1</kbd>…<kbd>9</kbd> / <kbd>↑</kbd> <kbd>↓</kbd> | changer de session (compatible AZERTY et QWERTY) |
| <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>←</kbd> <kbd>→</kbd> | changer de panneau en vue partagée |
| <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>A</kbd> | basculer vers la prochaine session qui attend une réponse |
| <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>G</kbd> | ouvrir le panneau Modifications (git) |
| <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>E</kbd> | ouvrir le dossier de travail dans l'éditeur configuré |
| <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>Q</kbd> | ouvrir la file d'attente de la session |
| <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>B</kbd> | diffusion de prompt à plusieurs sessions |
| <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>L</kbd> | verrouiller la session par mot de passe |
| <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>F</kbd> | mode focus (masquer / afficher la barre latérale) |
| <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>R</kbd> / <kbd>W</kbd> | renommer / fermer la session active |

Sur Mac, <kbd>Ctrl</kbd>+<kbd>Alt</kbd> correspond aux touches <kbd>⌃</kbd>+<kbd>⌥</kbd> (<kbd>Control</kbd>+<kbd>Option</kbd>). Dans le terminal :
- Windows : <kbd>Ctrl</kbd>+<kbd>C</kbd> avec sélection copie, <kbd>Ctrl</kbd>+<kbd>V</kbd> colle, <kbd>Ctrl</kbd>+<kbd>+</kbd>/<kbd>−</kbd>/<kbd>0</kbd> zoome.
- macOS : <kbd>⌘</kbd>+<kbd>C</kbd>/<kbd>V</kbd>/<kbd>+</kbd>/<kbd>−</kbd>/<kbd>0</kbd> ; <kbd>Ctrl</kbd>+<kbd>C</kbd> envoie l'interruption à Antigravity.

## 19. Données, sécurité, confidentialité

- **Tout reste sur ta machine.** Le serveur de l'application écoute exclusivement sur `127.0.0.1` (inaccessible depuis le réseau extérieur), exige un jeton d'accès aléatoire et valide l'en-tête Host. Aucune télémétrie ni pistage : seules tes sessions `agy` communiquent avec leurs API habituelles. [Politique de confidentialité](https://khalilbenaz.github.io/agy-sessions-manager/privacy.html).
- **Fenêtre isolée** : bac à sable Electron, aucun accès Node.js direct depuis le moteur de rendu, navigation restreinte au serveur local, liens externes ouverts dans ton navigateur par défaut, permissions strictes et Content Security Policy (CSP).
- **Données de l'app** : `%APPDATA%\agy-sessions` (Windows), `~/Library/Application Support/agy-sessions` (macOS) — sessions ouvertes, réglages, modèles, bibliothèque de prompts, jeton et journaux. Désinstaller l'app ne supprime pas tes données personnelles.
- **Conversations** : ce sont les conversations Antigravity natives stockées dans `~/.gemini/antigravity-cli/brain/` ; AGY Sessions les lit pour l'historique et la reprise, sans jamais altérer le contenu des transcripts.

## 20. Dépannage

| Problème | Solution |
|---|---|
| Glisser une image affiche « Échec : route », ou une fonction récente n'apparaît pas | Le serveur tourne un ancien code : clique sur le bandeau jaune **Redémarrer le serveur** (ou via l'icône de la barre des tâches). Tes sessions reprennent automatiquement. |
| « Antigravity CLI introuvable » / la session s'arrête aussitôt | Vérifie que `agy --version` fonctionne dans un terminal ordinaire ; Réglages › Diagnostic indique le chemin détecté. Sur Mac : lance une première fois `open -a "AGY Sessions"` depuis le Terminal. |
| Worktrees / Panneau Modifications indisponibles | `git` n'est pas détecté dans le PATH système (vérifier dans l'onglet Diagnostic). |
| L'icône n'apparaît pas près de l'horloge (Windows 11) | Elle est masquée sous la flèche **^** ; glisse-la dans la zone toujours visible de la barre des tâches. |
| macOS : l'app ne s'ouvre pas (« développeur non vérifié ») | Ouvre Réglages Système › Confidentialité et sécurité › **Ouvrir quand même** ; ou exécute `xattr -cr "/Applications/AGY Sessions.app"` dans le Terminal puis relance. |
| Mot de passe de verrouillage oublié | Non récupérable : ferme la session ; l'historique de la conversation reste accessible dans les fichiers d'Antigravity CLI. |
| Autre souci | Ouvre Réglages › Diagnostic › **Copier le rapport**, puis [ouvre une issue sur GitHub](https://github.com/khalilbenaz/agy-sessions-manager/issues). |

<a id="installation-en-ligne-de-commande-sans-application"></a><a id="commandes"></a><a id="options"></a>
## 21. Ligne de commande `asm` (sans l'application)

Pour utiliser AGY Sessions directement dans ton navigateur préféré, sans l'application Electron de bureau (prérequis : [Node.js](https://nodejs.org) 18+) :

```sh
git clone https://github.com/khalilbenaz/agy-sessions-manager.git ~/agy-sessions-manager
cd ~/agy-sessions-manager
npm ci && npm install -g .   # installe la commande globale « asm » (et son alias « agys »)
asm install                  # configure le démarrage automatique + lanceur système
asm                          # démarre et ouvre l'interface dans ton navigateur
```

Autres commandes disponibles :
- `asm status` : affiche l'état d'exécution et l'URL du serveur (`http://127.0.0.1:7892/`).
- `asm stop` : arrête le serveur (toutes les sessions actives seront restaurées au prochain lancement).
- `asm restart` : redémarre le serveur et relance les sessions.
- `asm log` : affiche les 60 dernières lignes du journal du serveur.
- `asm where` : affiche les chemins du code source, du dossier de données et de l'exécutable Node.js.
- `asm uninstall` : supprime le LaunchAgent / la tâche planifiée et le raccourci applicatif.

Variables d'environnement :
- `ASM_PORT` (défaut `7892` ; spécifier un autre port permet d'isoler des environnements distincts).
- `ASM_DATA` : dossier de stockage des données de session.
- `ASM_AGY` : chemin explicite vers l'exécutable `agy`.

## 22. Développement

```sh
npm ci
npm test            # tests d'intégration du serveur (mock agy, profil temporaire isolé)
npm run test:app    # tests de l'application Electron avec Playwright
npm run app         # lancer l'application en mode développement
npm run dist:win    # générer l'installeur Windows (dist/AGY-Sessions-Setup-x.y.z.exe)
npm run dist:mac    # générer les installeurs macOS (dist/AGY-Sessions-x.y.z-arm64.dmg et x64.dmg)
```

Architecture du projet :
- `server.js` : serveur HTTP et WebSocket local, gestion des processus pseudo-terminaux (`node-pty`) pour chaque session, injection et surveillance des hooks d'état du cycle de vie `agy`.
- `hook.js` : script de hook notifiant le serveur des événements `PreInvocation`, `PreToolUse` et `Stop`.
- `lib/` : modules modulaires (gestion des worktrees git, consommation de tokens, verrous par mot de passe, réglages utilisateurs, file d'attente de prompts, outils système).
- `public/` : interface web monopage (SPA), moteur de rendu de terminal xterm.js avec WebGL, gestion i18n FR/EN.
- `electron/` : application de bureau, intégration système (icône barre des tâches / barre des menus, raccourcis globaux, fenêtrage natif).

## Licence

[MIT](LICENSE) — logiciel libre. Projet indépendant, non affilié à Google ; « Antigravity » et « Gemini » sont des marques de Google LLC.

## Code signing policy

Windows builds are intended to be signed through the [SignPath Foundation](https://signpath.org) free code signing program for open-source projects (application pending).

- Builds are produced only by the public GitHub Actions workflow [`.github/workflows/release.yml`](.github/workflows/release.yml) from tagged commits of this repository; no locally built binary is ever signed.
- Committers and reviewers: [@khalilbenaz](https://github.com/khalilbenaz)
- Approvers (release signing): [@khalilbenaz](https://github.com/khalilbenaz)

## Privacy policy

This program will not transfer any information to other networked systems unless specifically requested by the user or the person installing or operating it. Full policy: https://khalilbenaz.github.io/agy-sessions-manager/privacy.html

AGY Sessions runs a local server bound to `127.0.0.1` only (not reachable from the network) and stores its data locally (`%APPDATA%\agy-sessions`, `~/Library/Application Support/agy-sessions`). It collects zero telemetry. Network traffic comes only from the Antigravity sessions the user starts, which communicate with their standard configured AI models and services.
