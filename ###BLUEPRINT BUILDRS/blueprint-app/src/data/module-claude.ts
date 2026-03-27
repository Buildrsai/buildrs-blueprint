import type { Module } from './curriculum'

export const MODULE_CLAUDE: Module = {
  id: 'claude',
  title: 'Claude 360°',
  description: 'Configure Claude comme un pro du VibeCoding et multiplie ta vitesse de build par 10.',
  icon: 'Brain',
  lessons: [

    // ─────────────────────────────────────────────────────────────────────────
    // C.1 — Pourquoi configurer Claude change tout
    // ─────────────────────────────────────────────────────────────────────────
    {
      id: 'c.1',
      title: 'Claude basique vs Claude Buildrs',
      duration: '5 min',
      body: [],
      blocks: [
        { type: 'text', content: "La plupart des gens utilisent Claude comme un moteur de recherche amélioré. Ils posent une question, ils copient la réponse. C'est inefficace, impersonnel, et ça produit des résultats génériques." },
        { type: 'text', content: "Un Claude configuré, c'est autre chose : il connaît ton projet, ton stack, ton style de code, tes préférences. Chaque réponse est ajustée à ta réalité. La différence de productivité est radicale — on parle d'un facteur 5 à 10x." },
        {
          type: 'diagram-cards',
          title: 'Ce que ça change concrètement',
          items: [
            { icon: 'zap',         label: 'Contexte permanent',   desc: 'Claude sait que tu travailles sur un SaaS React + Supabase + Stripe — tu n\'as plus à le répéter à chaque session.', color: '#22c55e' },
            { icon: 'brain',       label: 'Ton style de code',    desc: 'Il respecte tes conventions : Tailwind, TypeScript strict, pas d\'emoji dans le code, strokeWidth 1.5 partout.', color: '#4d96ff' },
            { icon: 'target',      label: 'Ta façon de penser',   desc: 'Il sait que tu es non-développeur, que tu veux des explications courtes, et que tu valides par le navigateur.', color: '#cc5de8' },
            { icon: 'rocket',      label: 'Tes outils spécifiques', desc: 'Il connaît ton stack exact et ne te suggère pas des alternatives incompatibles avec ce que tu as déjà.', color: '#eab308' },
          ],
        },
        {
          type: 'callout',
          variant: 'tip',
          title: 'La règle des 20 minutes',
          content: "20 minutes pour configurer ton Claude = des centaines d'heures de friction éliminées sur la durée. C'est l'investissement avec le meilleur ROI de tout ce module.",
        },
        {
          type: 'quiz-inline',
          question: "Quel est le principal problème d'utiliser Claude sans configuration ?",
          options: [
            'Claude répond trop lentement',
            "Claude produit des réponses génériques qui ne tiennent pas compte de ton projet",
            "Claude ne parle pas français",
            'Claude ne connaît pas React',
          ],
          correctIndex: 1,
          explanation: "Sans configuration, Claude répond comme si tu étais n'importe qui. Avec un système prompt et un CLAUDE.md bien fait, il répond comme un senior dev qui connaît ton projet depuis 6 mois.",
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────────────────
    // C.2 — Choisir son modèle Claude
    // ─────────────────────────────────────────────────────────────────────────
    {
      id: 'c.2',
      title: 'Choisir son modèle Claude',
      duration: '6 min',
      body: [],
      blocks: [
        { type: 'text', content: "Anthropic propose plusieurs modèles Claude avec des profils différents. Choisir le bon modèle pour la bonne tâche, c'est comme utiliser le bon outil dans une boîte à outils. Un marteau pour planter un clou, pas une scie." },
        {
          type: 'list',
          title: 'Les 3 modèles principaux',
          style: 'cards',
          items: [
            {
              icon: 'zap',
              label: 'Claude Haiku',
              desc: "Rapide et économique. Idéal pour les tâches simples : corriger un bug, reformuler un texte, générer 5 idées de noms. Ne pas l'utiliser pour de l'architecture complexe.",
              accent: '#22c55e',
            },
            {
              icon: 'brain',
              label: 'Claude Sonnet',
              desc: "L'équilibre parfait vitesse/intelligence. C'est ton modèle principal pour 90% des tâches : générer du code, rédiger du contenu, analyser un problème. C'est le modèle de Claude Code par défaut.",
              accent: '#4d96ff',
            },
            {
              icon: 'sparkles',
              label: 'Claude Opus',
              desc: "Le plus puissant, le plus lent, le plus cher. Réservé aux décisions stratégiques, à l'architecture complexe, ou quand Sonnet donne des résultats décevants. Utilise-le avec parcimonie.",
              accent: '#cc5de8',
            },
          ],
        },
        { type: 'heading', level: 2, content: 'Pro vs Max : quelle formule choisir ?' },
        { type: 'text', content: "L'abonnement Claude Pro (20€/mois) est suffisant pour commencer. Claude Max (100€/mois) est utile si tu utilises Claude Code intensément — il débloque une limite de tokens beaucoup plus haute, ce qui évite les interruptions en cours de build." },
        {
          type: 'list',
          style: 'bullets',
          items: [
            { label: 'Claude Pro (20€/mois)', desc: "Claude.ai illimité (avec pauses), accès aux Projets, priorité réseau. Suffisant pour débuter et valider ton MVP." },
            { label: 'Claude Max 5x (50€/mois)', desc: "5x la limite de tokens de Pro. Idéal si tu utilises Claude Code régulièrement et que tu rencontres des interruptions." },
            { label: 'Claude Max 20x (100€/mois)', desc: "20x la limite de tokens. Pour les sessions de build intensives de plusieurs heures sans interruption." },
          ],
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'Recommandation Buildrs',
          content: "Commence avec Claude Pro. Si tu fais des sessions de code de plus de 2h/jour avec Claude Code, passe à Max 5x. Le coût est largement compensé par la productivité gagnée.",
        },
        {
          type: 'quiz-inline',
          question: "Tu dois créer toute l'architecture de ta base de données Supabase avec 8 tables liées. Quel modèle utilises-tu ?",
          options: [
            'Haiku — c\'est rapide et gratuit',
            'Sonnet — c\'est le modèle par défaut',
            'Opus — c\'est une décision complexe qui nécessite le meilleur raisonnement',
            "Peu importe, tous les modèles font pareil",
          ],
          correctIndex: 2,
          explanation: "L'architecture de la base de données est une décision structurante. Une erreur là coûte cher. Opus a un raisonnement supérieur pour les tâches complexes avec beaucoup d'interdépendances.",
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────────────────
    // C.3 — Les 6 interfaces Claude
    // ─────────────────────────────────────────────────────────────────────────
    {
      id: 'c.3',
      title: 'Les 6 interfaces Claude',
      duration: '7 min',
      body: [],
      blocks: [
        { type: 'text', content: "Claude existe sous 6 formes différentes. Chacune a un rôle précis dans ton workflow. Les connaître toutes, c'est savoir lequel utiliser au bon moment — et gagner du temps à chaque étape de ton build." },
        {
          type: 'list',
          style: 'cards',
          items: [
            {
              icon: 'monitor',
              label: 'Claude.ai (Web)',
              desc: "L'interface principale. Idéal pour les conversations longues, la rédaction, la stratégie, et les Projets. Supporte les fichiers, images, et PDFs.",
              accent: '#4d96ff',
            },
            {
              icon: 'code',
              label: 'Claude Code (CLI)',
              desc: "L'outil de développement. S'intègre dans ton terminal et ton éditeur. Lit et modifie directement tes fichiers. C'est là que tu builds ton SaaS.",
              accent: '#cc5de8',
            },
            {
              icon: 'layers2',
              label: 'Claude Projects',
              desc: "Dans Claude.ai — crée un espace dédié à ton projet avec contexte permanent, fichiers de référence, et instructions custom. Ton \"bureau\" Claude pour un produit.",
              accent: '#22c55e',
            },
            {
              icon: 'zap',
              label: 'Claude API',
              desc: "L'accès direct via code. Pour intégrer Claude dans ton SaaS (génération de contenu, analyse, chatbot). Paiement à l'usage, pas d'abonnement.",
              accent: '#eab308',
            },
            {
              icon: 'globe',
              label: 'Extension Chrome',
              desc: "Claude directement dans ton navigateur. Analyse une page web, résume un article, aide sur n'importe quelle interface — sans changer d'onglet.",
              accent: '#4d96ff',
            },
            {
              icon: 'message-square',
              label: 'Claude Mobile (iOS/Android)',
              desc: "Pour les idées en déplacement, les révisions rapides, les sessions de brainstorming vocales. Synchronisé avec ton historique claude.ai.",
              accent: '#cc5de8',
            },
          ],
        },
        {
          type: 'diagram-flow',
          title: 'Quel outil pour quelle situation ?',
          steps: [
            { label: 'Stratégie & architecture → Claude.ai + Projects', sub: "Long contexte, fichiers de référence, conversation en profondeur.", color: '#4d96ff' },
            { label: 'Build & code → Claude Code (CLI)', sub: "Écriture et modification de fichiers directement dans ton projet.", color: '#cc5de8' },
            { label: 'Intégration IA dans ton SaaS → API Claude', sub: "Tu appelles Claude depuis ton backend pour des fonctionnalités IA.", color: '#eab308' },
            { label: 'Recherche & inspiration → Extension Chrome', sub: "Analyser des concurrents, résumer de la doc, extraire des insights.", color: '#22c55e' },
            { label: 'Idées en mobilité → Mobile', sub: "Brainstorm vocal, révision rapide, questions express.", color: '#71717a' },
          ],
        },
        {
          type: 'checklist',
          title: 'Setup à faire maintenant',
          items: [
            "Installer Claude Code : npm install -g @anthropic-ai/claude-code",
            "Créer un Projet dans Claude.ai pour ton SaaS (bouton + dans la sidebar)",
            "Installer l'extension Chrome Claude (cherche 'Claude for Chrome' sur le Chrome Web Store)",
            "Télécharger Claude Mobile sur ton téléphone",
            "Connecter Claude Code à ton compte : claude auth login",
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────────────────
    // C.4 — Paramétrer son Claude Buildrs
    // ─────────────────────────────────────────────────────────────────────────
    {
      id: 'c.4',
      title: 'Paramétrer son Claude Buildrs',
      duration: '10 min',
      body: [],
      blocks: [
        { type: 'text', content: "La configuration de Claude se fait à 3 niveaux : le Projet (contexte global), les instructions personnalisées (comportement), et la mémoire (faits permanents). Ensemble, ils transforment Claude en un assistant qui te connaît." },
        { type: 'heading', level: 2, content: '1. Créer ton Projet Claude' },
        { type: 'text', content: "Dans Claude.ai, crée un nouveau Projet pour chacun de tes produits. Donne-lui le nom de ton SaaS. Ajoute tes fichiers clés : architecture, design brief, user stories. Claude les lit à chaque conversation dans ce projet." },
        {
          type: 'checklist',
          title: 'Fichiers à ajouter à ton Projet',
          items: [
            "Le brief de ton produit (nom, problème, cible, stack)",
            "Le schéma de ta base de données",
            "Tes couleurs et tokens de design",
            "Un export de tes tables Supabase (si existantes)",
            "Tes règles de code (conventions, patterns à suivre)",
          ],
        },
        { type: 'heading', level: 2, content: '2. Les instructions personnalisées' },
        { type: 'text', content: "Les instructions personnalisées (dans Paramètres > Profil > Instructions Claude) s'appliquent à TOUTES tes conversations. C'est le premier endroit à configurer. Copie ce prompt et adapte-le à ta situation :" },
        {
          type: 'prompt',
          label: 'Instructions personnalisées Claude — Profil Buildrs',
          content: `Je suis un fondateur solo non-technique qui construit des micro-SaaS avec le VibeCoding. Mon stack principal est React + TypeScript + Vite + Tailwind CSS + Supabase + Stripe + Vercel.

Quand tu m'aides à coder :
- Donne des solutions complètes et directement utilisables, pas des fragments
- Respecte mes conventions : composants fonctionnels TypeScript, Tailwind pour tous les styles, icônes Lucide avec strokeWidth={1.5}, jamais d'emoji dans le code
- Explique brièvement ce que tu fais AVANT le code, et les points importants APRÈS
- Si tu identifies un bug ou une amélioration évidente, signale-le en une phrase
- Préfère modifier des fichiers existants plutôt que créer de nouveaux

Quand tu m'aides sur la stratégie ou le contenu :
- Réponds en français, tutoiement, ton direct et concret
- Évite le jargon inutile — si un mot simple existe, utilise-le
- Donne des exemples concrets, pas des généralités

Mon objectif : lancer un MVP monétisé en 72h. Chaque réponse doit me rapprocher de ce but.`,
        },
        { type: 'heading', level: 2, content: '3. La mémoire Claude' },
        { type: 'text', content: "Claude peut mémoriser des faits sur toi entre les sessions. Active-la dans Paramètres > Mémoire. Puis dis-lui explicitement ce qu'il doit retenir. Claude stocke ces infos et les utilise automatiquement." },
        {
          type: 'prompt',
          label: 'Prompt pour initialiser la mémoire',
          content: `Mémorise les informations suivantes sur moi :
- Mon prénom : [TON PRÉNOM]
- Mon SaaS actuel : [NOM DU PRODUIT] — [DESCRIPTION EN 1 PHRASE]
- Mon stack : React + TypeScript + Vite + Tailwind + Supabase + Stripe + Vercel
- Mon niveau technique : débutant en code, je comprends la logique mais pas la syntaxe
- Ma priorité : aller vite, tester, itérer — pas la perfection
- Mon objectif : premier paiement d'ici [DÉLAI]

Confirme que tu as bien mémorisé ces informations.`,
        },
        {
          type: 'callout',
          variant: 'tip',
          title: 'Astuce pro',
          content: "Crée un Project dans Claude.ai spécifiquement appelé 'Buildrs OS'. Ajoute-y toutes tes infos business (offres, cibles, stack, contenus). C'est ton cerveau externalisé — pour tout le contenu marketing, tu travailles depuis ce projet.",
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────────────────
    // C.5 — Le CLAUDE.md
    // ─────────────────────────────────────────────────────────────────────────
    {
      id: 'c.5',
      title: 'Le CLAUDE.md — ton fichier de référence',
      duration: '8 min',
      body: [],
      blocks: [
        { type: 'text', content: "Le CLAUDE.md est le fichier le plus important de ton projet. Claude Code le lit automatiquement au démarrage de chaque session. C'est là où tu décris ton projet, ton stack, tes règles de code, et tes conventions." },
        { type: 'text', content: "Sans CLAUDE.md, Claude Code commence chaque session sans contexte. Avec un bon CLAUDE.md, il sait exactement dans quel projet il est, ce qu'il peut et ne peut pas faire, et comment tu veux que le code soit écrit." },
        {
          type: 'callout',
          variant: 'info',
          title: 'Où placer le fichier',
          content: "Le CLAUDE.md se place à la racine de ton projet (même niveau que package.json). Claude Code le détecte et le charge automatiquement. Tu peux aussi en avoir un par sous-dossier pour des règles spécifiques.",
        },
        { type: 'heading', level: 2, content: 'Template CLAUDE.md pour ton SaaS' },
        { type: 'text', content: "Copie ce template et adapte les sections entre crochets à ton projet. Plus tu es précis, plus Claude Code sera efficace." },
        {
          type: 'prompt',
          label: 'Template CLAUDE.md — À copier et adapter',
          content: `# CLAUDE.md — [NOM DE TON SAAS]

## Identité du projet
**Produit :** [NOM]
**Problème résolu :** [UNE PHRASE]
**Cible :** [QUI UTILISE CE PRODUIT]
**Modèle de revenus :** [ABONNEMENT / ONE-SHOT / FREEMIUM]

## Stack technique
- **Frontend :** React 18 + TypeScript + Vite
- **CSS :** Tailwind CSS v3 + CSS Variables HSL
- **UI Components :** shadcn/ui pattern dans src/components/ui/
- **Icons :** Lucide React (strokeWidth={1.5} OBLIGATOIRE, taille 16-20px)
- **Base de données :** Supabase (PostgreSQL + Auth + Storage)
- **Paiements :** Stripe Checkout
- **Déploiement :** Vercel
- **Auth :** Supabase Auth (email + Google)

## Règles absolues
- PAS d'emoji dans le code JSX ou les composants
- Toujours Tailwind CSS pour les styles — jamais de style inline sauf pour des valeurs dynamiques
- Composants fonctionnels TypeScript uniquement
- Props typées avec interface, jamais type inline
- Les icônes Lucide ont TOUJOURS strokeWidth={1.5}

## Design system
- Fond : bg-background (variable CSS HSL)
- Texte : text-foreground / text-muted-foreground
- Cartes : border border-border rounded-xl p-5
- Bouton principal : bg-foreground text-background rounded-xl
- Hover : hover:opacity-90 ou hover:bg-secondary/60

## Workflow de preview
\`\`\`bash
# JAMAIS npm run dev — utiliser toujours :
npx vite build && npx serve dist --listen 4000 &
open http://localhost:4000
\`\`\`

## Structure des fichiers
src/
  components/
    ui/           ← composants réutilisables
    dashboard/    ← pages du dashboard
    auth/         ← pages d'auth
  data/           ← données statiques et curriculum
  hooks/          ← hooks React custom
  lib/            ← utilitaires (supabase, stripe, etc.)

## Ce que Claude Code peut faire sans demander
- Modifier des fichiers existants
- Créer des composants dans les bons dossiers
- Ajouter des imports
- Corriger des bugs

## Ce que Claude Code doit TOUJOURS demander avant de faire
- Supprimer un fichier
- Modifier le schéma de la base de données
- Changer la logique de paiement Stripe
- Modifier la configuration Vite ou Tailwind`,
        },
        {
          type: 'checklist',
          title: 'Checklist CLAUDE.md parfait',
          items: [
            "Nom et description du projet en haut",
            "Stack complet avec versions",
            "Règles de code non-négociables",
            "Conventions de design (couleurs, typographie, composants)",
            "Structure des dossiers expliquée",
            "Ce que Claude peut faire seul vs ce qu'il doit demander",
            "Commandes importantes (build, preview, déploiement)",
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────────────────
    // C.6 — Les Skills
    // ─────────────────────────────────────────────────────────────────────────
    {
      id: 'c.6',
      title: 'Les Skills — agents IA spécialisés',
      duration: '8 min',
      body: [],
      blocks: [
        { type: 'text', content: "Les Skills sont des instructions spécialisées que tu installes dans Claude Code. Quand tu tapes une commande comme /commit ou /review, Claude Code charge le Skill correspondant et l'applique exactement comme un expert dans ce domaine le ferait." },
        { type: 'text', content: "Pense aux Skills comme des collègues virtuels spécialisés : l'un est expert en commits Git, l'autre en code review, l'autre en debugging. Tu les appelles quand tu en as besoin. Ils ne coûtent rien — ils sont inclus dans Claude Code." },
        {
          type: 'diagram-flow',
          title: 'Comment fonctionnent les Skills',
          steps: [
            { label: 'Tu installes un Skill', sub: "Via /install ou en copiant le fichier dans .claude/skills/", color: '#4d96ff' },
            { label: 'Tu appelles le Skill', sub: "En tapant /nom-du-skill dans Claude Code.", color: '#cc5de8' },
            { label: 'Claude charge les instructions', sub: "Le fichier skill.md est lu et appliqué automatiquement.", color: '#eab308' },
            { label: 'Claude agit en expert', sub: "Il suit le processus défini dans le Skill, étape par étape.", color: '#22c55e' },
          ],
        },
        {
          type: 'list',
          title: 'Les Skills essentiels pour le build SaaS',
          style: 'cards',
          items: [
            { icon: 'git-branch',   label: 'commit',          desc: "Génère des commits Git clairs, structurés et descriptifs. Format : type(scope): message.", accent: '#22c55e' },
            { icon: 'eye',          label: 'code-reviewer',   desc: "Analyse ton code pour les bugs, failles de sécurité et problèmes de performance avant de déployer.", accent: '#ef4444' },
            { icon: 'search',       label: 'debugging',       desc: "Process de debugging méthodique : identifie la cause racine, propose des solutions, vérifie la correction.", accent: '#4d96ff' },
            { icon: 'layers2',      label: 'frontend-design', desc: "Applique les bonnes pratiques UI/UX React, vérifie l'accessibilité et la cohérence du design system.", accent: '#cc5de8' },
            { icon: 'database',     label: 'supabase',        desc: "Expert Supabase : schéma, RLS policies, Edge Functions, Storage. Génère le SQL correct du premier coup.", accent: '#22c55e' },
            { icon: 'rocket',       label: 'deployment',      desc: "Gère le déploiement Vercel : build, env vars, domaine, preview vs prod.", accent: '#eab308' },
          ],
        },
        {
          type: 'callout',
          variant: 'action',
          title: 'Skills Buildrs inclus dans le pack',
          content: "Le Pack Buildrs (leçon C.10) inclut une collection de Skills préconfigurés pour ton workflow : CLAUDE.md, skills de build, skills de debugging, et skills spécifiques au stack Supabase + Vercel. Tu copies un dossier, et tu as tout.",
        },
        {
          type: 'prompt',
          label: 'Comment installer un Skill manuellement',
          content: `# 1. Crée le dossier skills dans ton projet
mkdir -p .claude/skills

# 2. Crée un fichier skill (exemple : commit.md)
cat > .claude/skills/commit.md << 'EOF'
---
name: commit
description: Génère un commit Git propre et descriptif
---

Analyse les changements stagés et crée un commit avec ce format :
type(scope): description courte en français

Types : feat, fix, docs, style, refactor, test, chore
Scope : le composant ou module modifié
Description : max 50 caractères, verbe à l'impératif

Exemple : feat(auth): ajouter login Google OAuth
EOF

# 3. Utilise le skill dans Claude Code
/commit`,
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────────────────
    // C.7 — Les MCP Servers
    // ─────────────────────────────────────────────────────────────────────────
    {
      id: 'c.7',
      title: 'Les MCP Servers — brancher tes outils',
      duration: '10 min',
      body: [],
      blocks: [
        { type: 'text', content: "MCP (Model Context Protocol) est le système qui permet à Claude Code de parler directement à tes outils. Plutôt que toi faire le lien entre Claude et Supabase, ou Claude et Stripe, les MCP Servers créent une connexion directe." },
        { type: 'text', content: "Concrètement : avec le MCP Supabase, Claude Code peut lire tes tables, exécuter du SQL, créer des migrations — directement, sans que tu aies à copier-coller. Avec le MCP GitHub, il peut créer des branches, des PRs. C'est une révolution dans le workflow." },
        {
          type: 'list',
          title: 'Les MCP essentiels pour le stack Buildrs',
          style: 'cards',
          items: [
            { icon: 'database',    label: 'Supabase MCP',    desc: "Lire/modifier tes tables, exécuter du SQL, gérer le Storage, voir les logs Edge Functions — tout sans quitter Claude.", accent: '#22c55e' },
            { icon: 'credit-card', label: 'Stripe MCP',      desc: "Voir tes produits, clients, paiements. Créer des prix et des coupons. Analyser les revenus en temps réel.", accent: '#4d96ff' },
            { icon: 'git-branch',  label: 'GitHub MCP',      desc: "Créer des branches, des commits, des PRs directement depuis Claude. Voir les issues et les reviews.", accent: '#71717a' },
            { icon: 'cloud',       label: 'Vercel MCP',      desc: "Voir tes déploiements, logs de fonctions, variables d'environnement. Déclencher des redéploiements.", accent: '#71717a' },
            { icon: 'globe',       label: 'Cloudflare MCP',  desc: "Gérer ton DNS, tes règles de sécurité, et voir les analytics de trafic.", accent: '#eab308' },
            { icon: 'mail',        label: 'Resend MCP',      desc: "Voir les emails envoyés, les bounces, les clics. Créer et tester des templates.", accent: '#ef4444' },
            { icon: 'palette',     label: 'Figma MCP',       desc: "Lire les composants et tokens de design depuis Figma. Importer des specs directement dans le code.", accent: '#cc5de8' },
            { icon: 'mail',        label: 'Gmail MCP',       desc: "Lire et envoyer des emails, gérer des labels, trier les retours utilisateurs.", accent: '#4d96ff' },
          ],
        },
        { type: 'heading', level: 2, content: 'Installer un MCP Server' },
        { type: 'text', content: "Les MCP Servers se configurent dans le fichier .claude/mcp.json à la racine de ton projet, ou via la commande claude mcp add. Voici comment brancher les plus importants :" },
        {
          type: 'prompt',
          label: 'Commandes d\'installation MCP — À exécuter dans ton terminal',
          content: `# Supabase MCP
claude mcp add @supabase/mcp-server-supabase --env SUPABASE_URL=https://[ID].supabase.co --env SUPABASE_SERVICE_ROLE_KEY=[KEY]

# GitHub MCP
claude mcp add @github/mcp-server-github --env GITHUB_TOKEN=[TON_GITHUB_TOKEN]

# Vercel MCP (Streamable HTTP)
claude mcp add vercel --transport http https://mcp.vercel.com

# Stripe MCP
claude mcp add @stripe/agent-toolkit --env STRIPE_SECRET_KEY=[SK_LIVE_...]

# Pour voir tous tes MCP installés :
claude mcp list`,
        },
        {
          type: 'callout',
          variant: 'tip',
          title: 'Sécurité : variables d\'environnement',
          content: "Ne mets jamais tes clés API directement dans les commandes si quelqu'un peut voir ton écran. Utilise plutôt des variables d'environnement (.env.local) et référence-les avec $VARIABLE_NAME dans les commandes MCP.",
        },
        {
          type: 'checklist',
          title: 'MCP à installer en priorité',
          items: [
            "MCP Supabase — indispensable pour gérer ta DB depuis Claude",
            "MCP GitHub — pour versionner ton code sans quitter Claude",
            "MCP Vercel — pour voir tes déploiements et logs en direct",
            "MCP Stripe — pour analyser tes revenus pendant le build",
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────────────────
    // C.8 — Les commandes Claude Code
    // ─────────────────────────────────────────────────────────────────────────
    {
      id: 'c.8',
      title: 'Les commandes Claude Code',
      duration: '7 min',
      body: [],
      blocks: [
        { type: 'text', content: "Claude Code dispose d'un ensemble de commandes slash qui déclenchent des comportements spécifiques. Les connaître, c'est aller 3x plus vite. Pas besoin de tout mémoriser — garde cette leçon comme référence." },
        {
          type: 'glossary',
          categories: [
            {
              title: 'Commandes de navigation',
              items: [
                { term: '/help', def: "Affiche toutes les commandes disponibles avec une description." },
                { term: '/clear', def: "Efface le contexte de la conversation actuelle. Utile pour repartir sur un nouveau sujet sans confusion." },
                { term: '/compact', def: "Compresse l'historique de conversation pour libérer du contexte. Garde l'essentiel, supprime les détails." },
                { term: '/cost', def: "Affiche le coût en tokens de la session actuelle. Utile pour surveiller ta consommation." },
              ],
            },
            {
              title: 'Commandes de développement',
              items: [
                { term: '/add [fichiers]', def: "Ajoute des fichiers spécifiques au contexte de la conversation sans les lire intégralement." },
                { term: '/review', def: "Lance une code review complète du code modifié dans la session. Utilise le skill code-reviewer si installé." },
                { term: '/commit', def: "Crée un commit Git des changements stagés. Utilise le skill commit si installé." },
                { term: '/pr', def: "Crée une Pull Request GitHub avec le MCP GitHub. Résume automatiquement les changements." },
                { term: '/init', def: "Initialise un nouveau projet avec la structure de base. Lit le CLAUDE.md pour appliquer tes conventions." },
              ],
            },
            {
              title: 'Commandes de contrôle',
              items: [
                { term: '/undo', def: "Annule la dernière action de Claude Code (modification de fichier). Utilise Git en interne." },
                { term: '/diff', def: "Affiche les différences entre l'état actuel et le dernier commit." },
                { term: '/permissions', def: "Affiche ce que Claude Code est autorisé à faire dans ce projet." },
                { term: '/model', def: "Change le modèle Claude utilisé pour la session (haiku / sonnet / opus)." },
              ],
            },
          ],
        },
        { type: 'heading', level: 2, content: 'Créer tes propres commandes Buildrs' },
        { type: 'text', content: "Tu peux créer des commandes personnalisées en ajoutant des fichiers .md dans le dossier .claude/commands/. Ces commandes seront disponibles avec /nom-de-la-commande dans toutes tes sessions Claude Code." },
        {
          type: 'prompt',
          label: 'Commande custom /build-preview — Copier dans .claude/commands/build-preview.md',
          content: `---
name: build-preview
description: Build le projet et lance le serveur de preview
---

Exécute les commandes suivantes dans l'ordre :
1. npx vite build
2. pkill -f "serve dist" 2>/dev/null || true
3. npx serve dist --listen 4000 &

Puis confirme que le serveur est démarré sur http://localhost:4000.
Si le build échoue, analyse l'erreur et propose une correction.`,
        },
        {
          type: 'prompt',
          label: 'Commande custom /deploy — Copier dans .claude/commands/deploy.md',
          content: `---
name: deploy
description: Déploie en production sur Vercel
---

Avant de déployer :
1. Vérifie qu'il n'y a pas d'erreur TypeScript avec : npx tsc --noEmit
2. Lance un build de test : npx vite build
3. Si les deux passent, déploie avec : vercel --prod --yes

Après le déploiement, affiche l'URL de production et confirme que le déploiement est réussi.`,
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────────────────
    // C.9 — Les sub-agents parallèles
    // ─────────────────────────────────────────────────────────────────────────
    {
      id: 'c.9',
      title: 'Les sub-agents parallèles',
      duration: '6 min',
      body: [],
      blocks: [
        { type: 'text', content: "Les sub-agents sont l'une des fonctionnalités les plus puissantes de Claude Code. Au lieu d'exécuter les tâches une par une, Claude Code peut lancer plusieurs agents en parallèle, chacun travaillant sur une partie différente de ton projet simultanément." },
        { type: 'text', content: "Exemple concret : tu veux créer 3 nouvelles pages dans ton SaaS. Sans sub-agents, Claude crée la page 1, puis la 2, puis la 3 — en série. Avec sub-agents, il travaille sur les 3 en même temps. Un build de 15 minutes devient 5 minutes." },
        {
          type: 'diagram-flow',
          title: 'Comment fonctionnent les sub-agents',
          steps: [
            { label: 'Tu donnes une tâche complexe', sub: "Exemple : 'Crée les pages Dashboard, Profil et Paramètres avec les composants nécessaires'", color: '#4d96ff' },
            { label: 'Claude décompose en sous-tâches', sub: "Il identifie les parties indépendantes qui peuvent être faites en parallèle.", color: '#cc5de8' },
            { label: '3 agents travaillent en même temps', sub: "Agent 1 : Dashboard. Agent 2 : Profil. Agent 3 : Paramètres. Simultanément.", color: '#eab308' },
            { label: 'Résultats consolidés', sub: "Claude intègre le travail des 3 agents, résout les conflits si nécessaire.", color: '#22c55e' },
          ],
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'Quand utiliser les sub-agents',
          content: "Les sub-agents sont utiles pour les tâches qui peuvent être découpées en parties indépendantes : créer plusieurs composants, rédiger du contenu pour plusieurs pages, refactoriser plusieurs fichiers en même temps. Pour les tâches séquentielles (où B dépend de A), travailler en série est plus sûr.",
        },
        {
          type: 'prompt',
          label: 'Exemple de prompt pour déclencher des sub-agents',
          content: `Utilise des sub-agents en parallèle pour créer ces 3 composants simultanément :

Agent 1 — DashboardStats.tsx :
- Affiche 4 métriques clés (MRR, utilisateurs actifs, taux de conversion, churn)
- Utilise les données mockées pour l'instant (on branchera Supabase après)
- Design : 4 cards en grille, valeurs en font-mono, tendance avec flèche verte/rouge

Agent 2 — RecentActivity.tsx :
- Liste des 10 dernières actions utilisateurs
- Format : avatar + nom + action + date relative
- Skeleton loading state inclus

Agent 3 — QuickActions.tsx :
- 4 boutons d'action rapide : Nouveau projet, Inviter un membre, Voir la facture, Support
- Icônes Lucide, style secondaire (border + hover)

Assure-toi que les 3 composants respectent le design system (Tailwind + CSS Variables) et s'exportent correctement depuis leur fichier.`,
        },
        {
          type: 'list',
          title: 'Tâches idéales pour les sub-agents',
          style: 'bullets',
          items: [
            { label: 'Création de contenu multi-pages', desc: "Rédiger les leçons de 3 modules en même temps" },
            { label: 'Migration de composants', desc: "Mettre à jour 10 composants vers un nouveau design system" },
            { label: 'Tests parallèles', desc: "Écrire les tests pour 5 fonctions indépendantes simultanément" },
            { label: 'Traduction/localisation', desc: "Traduire le contenu en plusieurs langues en même temps" },
            { label: 'Analyse de code', desc: "Auditer la sécurité, la performance et l'accessibilité en parallèle" },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────────────────
    // C.10 — Le Pack Buildrs téléchargeable
    // ─────────────────────────────────────────────────────────────────────────
    {
      id: 'c.10',
      title: 'Le Pack Buildrs — tout en un clic',
      duration: '5 min',
      body: [],
      blocks: [
        { type: 'text', content: "Tu as maintenant tout le savoir pour configurer Claude comme un pro. Le Pack Buildrs rassemble tous les fichiers préconfigurés en un seul téléchargement. Tu copies, tu adaptes les valeurs personnelles, et tu es opérationnel en 10 minutes." },
        {
          type: 'list',
          title: 'Ce que contient le Pack Buildrs',
          style: 'cards',
          items: [
            { icon: 'file-text', label: 'CLAUDE.md',              desc: "Template complet avec toutes les sections : stack, règles, design system, workflow. À personnaliser en 5 min.", accent: '#4d96ff' },
            { icon: 'brain',     label: 'Prompt Mémoire',          desc: "Le prompt exact à coller dans Claude pour initialiser ta mémoire personnelle une fois pour toutes.", accent: '#22c55e' },
            { icon: 'zap',       label: '8 Skills prêts',          desc: "commit, code-review, debugging, deploy, supabase, stripe, frontend-design, content. Installables en 1 commande.", accent: '#cc5de8' },
            { icon: 'globe',     label: 'Config MCP',              desc: "Fichier mcp.json préconfiguré pour Supabase, GitHub, Vercel et Stripe. Tu remplaces tes clés et c'est parti.", accent: '#eab308' },
            { icon: 'code',      label: '4 Commandes custom',      desc: "/build-preview, /deploy, /check, /audit — tes raccourcis de workflow Buildrs.", accent: '#4d96ff' },
            { icon: 'sparkles',  label: 'Prompt System Buildrs',   desc: "Le prompt d'instructions personnalisées optimisé pour le VibeCoding. Copie-colle dans tes paramètres Claude.", accent: '#22c55e' },
          ],
        },
        { type: 'heading', level: 2, content: 'Comment installer le Pack' },
        {
          type: 'diagram-flow',
          title: 'Installation en 4 étapes',
          steps: [
            { label: 'Télécharge le zip buildrs-claude-pack.zip', sub: "Lien ci-dessous. Dézippe dans un dossier temporaire.", color: '#4d96ff' },
            { label: 'Copie le dossier .claude/ dans ton projet', sub: "Il contient déjà les skills, commandes et la config MCP structurés.", color: '#cc5de8' },
            { label: 'Copie CLAUDE.md à la racine de ton projet', sub: "Ouvre-le et remplace les [valeurs] par les infos de ton SaaS.", color: '#eab308' },
            { label: 'Configure tes clés dans .claude/mcp.json', sub: "Remplace les placeholders [KEY] par tes vraies clés API.", color: '#22c55e' },
          ],
        },
        {
          type: 'links',
          title: 'Ressources du Pack Buildrs',
          items: [
            {
              label: 'buildrs-claude-pack.zip',
              url: 'https://buildrs.fr/pack-claude',
              desc: "Le pack complet : CLAUDE.md + 8 Skills + Config MCP + 4 commandes custom",
              icon: 'package',
              tag: 'TÉLÉCHARGER',
            },
            {
              label: 'Mises à jour du Pack',
              url: 'https://buildrs.fr/pack-claude/updates',
              desc: "Changelog des nouvelles versions. Le Pack évolue avec les nouvelles fonctionnalités Claude.",
              icon: 'refresh-cw',
              tag: 'SUIVRE',
            },
          ],
        },
        {
          type: 'callout',
          variant: 'tip',
          title: 'Mis à jour automatiquement',
          content: "Le Pack Buildrs est mis à jour à chaque évolution majeure de Claude Code. En tant que détenteur du Module Claude, tu as accès à vie à toutes les mises à jour. Reviens sur cette page ou consulte le changelog pour voir les nouveautés.",
        },
        {
          type: 'checklist',
          title: 'Checklist finale — Claude 360° configuré',
          items: [
            "Abonnement Claude Pro ou Max activé",
            "Projet Claude.ai créé pour ton SaaS avec tes fichiers",
            "Instructions personnalisées copiées dans les paramètres Claude",
            "Mémoire Claude initialisée avec ton profil",
            "Claude Code installé : npm install -g @anthropic-ai/claude-code",
            "CLAUDE.md placé à la racine de ton projet (personnalisé)",
            "Pack Buildrs téléchargé et .claude/ copié dans ton projet",
            "MCP Supabase + GitHub configurés avec tes clés",
            "Première session Claude Code lancée avec /help",
          ],
        },
      ],
    },
  ],

  quizQuestions: [
    {
      id: 'qclaude-1',
      question: "Quel est le rôle principal du CLAUDE.md ?",
      options: [
        "Stocker tes clés API Supabase",
        "Expliquer à Claude Code le contexte de ton projet, ton stack et tes règles à chaque session",
        "Configurer le thème dark/light de Claude",
        "Activer les sub-agents automatiquement",
      ],
      correctIndex: 1,
      explanation: "Le CLAUDE.md est lu automatiquement par Claude Code au démarrage. Il contient tout ce que Claude doit savoir : ton projet, ton stack, tes conventions de code. Sans lui, Claude repart de zéro à chaque session.",
    },
    {
      id: 'qclaude-2',
      question: "Tu dois créer 5 composants UI indépendants. Quelle est la stratégie optimale ?",
      options: [
        "Créer les composants un par un pour éviter les conflits",
        "Utiliser des sub-agents pour créer les 5 composants en parallèle",
        "Créer un seul composant générique qui gère les 5 cas",
        "Télécharger un template plutôt que de les créer",
      ],
      correctIndex: 1,
      explanation: "Les sub-agents permettent de travailler en parallèle sur des tâches indépendantes. 5 composants indépendants sont parfaits pour des sub-agents — tu divises le temps de création par ~5.",
    },
  ],
}
