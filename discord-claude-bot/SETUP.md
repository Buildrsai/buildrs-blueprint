# Discord Claude Bot - Guide de Setup

## Prérequis

- Node.js 18+
- Un bot Discord créé sur [Discord Developer Portal](https://discord.com/developers/applications)
- Une clé API Anthropic depuis [console.anthropic.com](https://console.anthropic.com)

## 1. Configuration Discord Developer Portal

Dans ton application Discord, assure-toi que :

**Bot > Privileged Gateway Intents :**
- ✅ MESSAGE CONTENT INTENT (obligatoire pour lire les messages)
- ✅ SERVER MEMBERS INTENT (recommandé)

**OAuth2 > URL Generator :**
- Scopes : `bot`, `applications.commands`
- Bot Permissions : `Send Messages`, `Read Message History`, `Use Slash Commands`, `Embed Links`

Utilise l'URL générée pour inviter le bot sur ton serveur.

## 2. Installation

```bash
cd discord-claude-bot
npm install
```

## 3. Configuration

```bash
cp .env.example .env
```

Remplis le fichier `.env` :

| Variable | Où la trouver |
|----------|--------------|
| `DISCORD_TOKEN` | Developer Portal > Bot > Token |
| `DISCORD_CLIENT_ID` | Developer Portal > General Information > Application ID |
| `ANTHROPIC_API_KEY` | console.anthropic.com > API Keys |
| `CLAUDE_CHANNEL_ID` | Clic droit sur le channel > Copier l'identifiant du salon |

> Pour copier un Channel ID, active le mode développeur dans Discord : Paramètres > Avancés > Mode développeur.

## 4. Lancement

```bash
npm start
```

Ou en mode développement (auto-reload) :

```bash
npm run dev
```

## 5. Utilisation

### Chat libre
Écris directement dans le channel `#claude` — le bot répond automatiquement avec mémoire de conversation.

### Commandes slash

| Commande | Description |
|----------|-------------|
| `/ask [question]` | Question one-shot (sans historique) |
| `/code [prompt] [language?]` | Génération de code |
| `/analyse [texte] [type?]` | Analyse de texte (général, sentiment, résumé, stratégie) |
| `/reset` | Efface ton historique de conversation |
| `/status` | Infos sur le bot (modèle, uptime, mémoire) |

## 6. Déploiement (optionnel)

Pour un déploiement permanent, utilise PM2 :

```bash
npm install -g pm2
pm2 start index.js --name discord-claude
pm2 save
pm2 startup
```
