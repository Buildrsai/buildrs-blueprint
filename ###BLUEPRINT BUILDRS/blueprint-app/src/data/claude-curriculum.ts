/**
 * claude-curriculum.ts
 *
 * Curriculum du sous-dashboard "Claude 360° by Buildrs".
 * Contient les 7 modules avec leurs leçons et blocks de contenu.
 * Distinct de curriculum.ts (le parcours Blueprint principal).
 *
 * Types de blocks supportés (même renderer que LessonPage.tsx) :
 *   text, heading, prompt, checklist, callout, list, diagram-flow,
 *   diagram-cards, quiz-inline, links, template, glossary
 *
 * Plus un block spécifique Claude :
 *   ob-gate → mur d'upsell Order Bump Code ou Cowork
 */

// ─────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────

export interface ClaudeLesson {
  id: string         // ex: '1.1', '1.2'
  title: string
  duration?: string  // ex: '5 min'
  blocks: ClaudeBlock[]
}

export interface ClaudeModule {
  id: string          // ex: 'claude-1'
  title: string
  subtitle: string
  etapeLabel: string  // ex: 'Étape 1 — Configurer'
  frameworkSteps: number[]  // étapes du framework couvertes (1-10)
  duration: string    // ex: '45 min'
  isBonus?: boolean   // true pour OB Code (claude-5) et OB Cowork (claude-6)
  obType?: 'code' | 'cowork'
  lessons: ClaudeLesson[]
}

export type ClaudeBlock =
  | { type: 'heading';      level?: 2 | 3; text: string }
  | { type: 'text';         text: string }
  | { type: 'callout';      variant: 'framework' | 'buildrs' | 'warning' | 'tip'; title?: string; text: string }
  | { type: 'prompt';       title?: string; text: string; copyable?: boolean }
  | { type: 'checklist';    items: string[] }
  | { type: 'list';         style?: 'bullet' | 'numbered'; items: string[] }
  | { type: 'links';        items: { label: string; url: string; desc?: string }[] }
  | { type: 'template';     title: string; content: string; language?: string }
  | { type: 'diagram-cards'; cards: { icon?: string; title: string; desc: string; badge?: string }[] }
  | { type: 'ob-gate';      obType: 'code' | 'cowork'; title: string; price: string }
  | { type: 'glossary';     items: { term: string; def: string }[] }

// ─────────────────────────────────────────────────────────────────
// Framework Buildrs — 10 étapes (fil rouge)
// ─────────────────────────────────────────────────────────────────

export const FRAMEWORK_STEPS = [
  { step: 1,  label: 'Configurer son environnement',         shortLabel: 'Config' },
  { step: 2,  label: 'Trouver une idée',                     shortLabel: 'Idée' },
  { step: 3,  label: 'Valider l\'idée',                      shortLabel: 'Validation' },
  { step: 4,  label: 'Définir la monétisation',              shortLabel: 'Monétisation' },
  { step: 5,  label: 'Créer la fiche produit',               shortLabel: 'Fiche produit' },
  { step: 6,  label: 'Designer',                             shortLabel: 'Design' },
  { step: 7,  label: 'Architecturer',                        shortLabel: 'Architecture' },
  { step: 8,  label: 'Construire',                           shortLabel: 'Build' },
  { step: 9,  label: 'Déployer & monétiser',                 shortLabel: 'Deploy' },
  { step: 10, label: 'Analyser & itérer',                    shortLabel: 'Analytics' },
]

// ─────────────────────────────────────────────────────────────────
// MODULE 1 — TON POSTE DE COMMANDE
// Framework : Étape 1 — Configurer son environnement
// ─────────────────────────────────────────────────────────────────

const MODULE_1: ClaudeModule = {
  id: 'claude-1',
  title: 'Ton Poste de Commande',
  subtitle: 'Claude tourne sur tous tes devices, configuré comme un pro.',
  etapeLabel: 'Étape 1 — Configurer',
  frameworkSteps: [1],
  duration: '45 min',
  lessons: [

    // 1.1 — Choisir son plan Claude
    {
      id: '1.1',
      title: 'Choisir son plan Claude',
      duration: '5 min',
      blocks: [
        {
          type: 'callout',
          variant: 'framework',
          title: 'Pourquoi c\'est important',
          text: 'Sans le bon plan, tu seras bloqué en plein build : limite de tokens, pas d\'accès aux modèles avancés. C\'est ton investissement #1 dans la recette Buildrs.',
        },
        {
          type: 'diagram-cards',
          cards: [
            { title: 'Free',   badge: '0€/mois',    desc: 'Conversations limitées, pas d\'accès à Opus. Pour tester uniquement.' },
            { title: 'Pro',    badge: '18€/mois',   desc: 'Sonnet 4.6 illimité, Projects, mémoire, Extended Thinking. Recommandé pour démarrer.' },
            { title: 'Max',    badge: '90€/mois',   desc: '5x plus de tokens que Pro. Opus 4.6 illimité. Passe ici quand tu ships tous les jours.' },
            { title: 'Max 5x', badge: '180€/mois',  desc: 'Pour les power users qui font tourner des agents en parallèle non-stop.' },
          ],
        },
        {
          type: 'callout',
          variant: 'buildrs',
          title: 'Chez Buildrs',
          text: 'On commence sur Pro. On passe à Max quand on lance notre premier SaaS et qu\'on code tous les jours. Le ROI est immédiat : un SaaS à 97€/mois rentabilise Max en 1 client.',
        },
        {
          type: 'links',
          items: [{ label: 'Voir les plans Claude', url: 'https://claude.ai/upgrade', desc: 'Ouvre dans un nouvel onglet — plans et tarifs officiels' }],
        },
        {
          type: 'checklist',
          items: ['Plan Pro ou Max activé'],
        },
      ],
    },

    // 1.2 — Installer Claude partout
    {
      id: '1.2',
      title: 'Installer Claude partout',
      duration: '10 min',
      blocks: [
        {
          type: 'text',
          text: 'La synchro c\'est le pouvoir : tu commences une conversation dans le métro, tu continues au bureau. Tes projets et ta mémoire sont accessibles partout.',
        },
        {
          type: 'list',
          style: 'numbered',
          items: [
            'Desktop Mac → claude.ai/download → télécharge le .dmg → drag vers Applications',
            'Desktop Windows → claude.ai/download → télécharge le .exe → installe normalement',
            'Mobile iOS → App Store → cherche "Claude" → télécharge l\'app officielle Anthropic',
            'Mobile Android → Google Play Store → cherche "Claude" → télécharge l\'app officielle',
            'Web → claude.ai → backup si tu es sur un ordi sans app installée',
          ],
        },
        {
          type: 'callout',
          variant: 'tip',
          title: 'Astuce',
          text: 'Sur mobile, active les notifications pour les tâches longues (Deep Research, extended thinking). Claude te notifie quand c\'est prêt pendant que tu fais autre chose.',
        },
        {
          type: 'checklist',
          items: [
            'Claude Desktop installé (Mac ou Windows)',
            'Claude Mobile installé (iOS ou Android)',
            'Accès Web vérifié (claude.ai connecté)',
          ],
        },
      ],
    },

    // 1.3 — Configurer les préférences profil
    {
      id: '1.3',
      title: 'Configurer les préférences profil',
      duration: '5 min',
      blocks: [
        {
          type: 'text',
          text: 'Les préférences profil, c\'est ce que Claude lit AVANT chaque conversation. Plus c\'est précis, plus il te connaît — sans que tu aies à te re-présenter à chaque nouveau chat.',
        },
        {
          type: 'list',
          style: 'numbered',
          items: [
            'Va sur claude.ai',
            'Clique sur ton avatar (en bas à gauche)',
            'Settings → Profile → "User Preferences" (ou "How would you like Claude to respond?")',
            'Colle le template ci-dessous et personnalise les [placeholders]',
          ],
        },
        {
          type: 'template',
          title: 'Template Préférences Buildrs',
          language: 'text',
          content: `Je suis [ton prénom], [ton âge] ans, [ta ville].
Je construis [type de projets — ex: des micro-SaaS IA pour les indépendants].
Mon niveau technique : [débutant / intermédiaire / j'ai déjà codé].

Ce que tu dois savoir sur ma façon de travailler :
- Je préfère les réponses directes et concrètes, pas académiques
- Tutoiement uniquement
- Quand je te donne un problème, propose une solution — ne me demande pas de clarifier sauf si vraiment nécessaire
- Si tu n'es pas sûr, dis-le — mais donne quand même une option

Mon contexte business :
- Objectif : [ex: lancer mon premier SaaS IA d'ici 3 mois]
- Stack préféré : React, Supabase, Vercel, Stripe
- Budget mensuel outils : environ [ton budget]

Format de réponse préféré :
- Listes à puces pour les étapes
- Blocs de code formatés pour le code
- Pas de blabla introductif — va directement au point`,
        },
        {
          type: 'callout',
          variant: 'buildrs',
          title: 'Chez Buildrs',
          text: 'On met à jour nos préférences tous les 2-3 mois quand notre focus change. Les préférences s\'empilent sur le style de réponse — pense à ne pas mettre les deux en contradiction.',
        },
        {
          type: 'checklist',
          items: ['Préférences profil configurées'],
        },
      ],
    },

    // 1.4 — Créer son style personnalisé
    {
      id: '1.4',
      title: 'Créer son style personnalisé',
      duration: '5 min',
      blocks: [
        {
          type: 'text',
          text: 'Les styles, c\'est comme choisir le mode de Claude selon la tâche. "Builder Mode" pour le développement quotidien, "Copywriter" pour le marketing, "Stratège" pour les décisions business.',
        },
        {
          type: 'list',
          style: 'numbered',
          items: [
            'Dans claude.ai, clique sur l\'icône stylo/style en bas du chat (ou dans Settings → Styles)',
            'Clique sur "Create custom style"',
            'Donne-lui un nom : "Builder Mode"',
            'Colle le template ci-dessous',
            'Sauvegarde',
          ],
        },
        {
          type: 'template',
          title: 'Style "Builder Mode" Buildrs',
          language: 'text',
          content: `Mode : Product Builder
Contexte : je construis des SaaS IA en mode solopreneur

Comportement attendu :
- Réponds en francais, tutoiement systématique
- Direct, opérationnel — pas de théorie inutile
- Longueur : suffisante pour être utile, pas plus
- Format : markdown structuré avec headers et listes
- Pour le code : TypeScript/React avec Tailwind, Supabase pour le backend
- Pour les décisions : propose une option recommandée, pas une liste exhaustive

Ce que tu évites :
- Les formulations d'excuse ("Je suis désolé mais...")
- Les introductions longues avant d'arriver au sujet
- Les alternatives inutiles quand une option est clairement meilleure
- Les mises en garde excessives`,
        },
        {
          type: 'callout',
          variant: 'tip',
          title: 'Autres styles utiles',
          text: '"Copywriter" — pour les landings, emails, posts. "Stratège" — pour les décisions business importantes, use Extended Thinking par défaut.',
        },
        {
          type: 'checklist',
          items: ['Style "Builder Mode" créé'],
        },
      ],
    },

    // 1.5 — Activer et structurer la mémoire
    {
      id: '1.5',
      title: 'Activer et structurer la mémoire',
      duration: '8 min',
      blocks: [
        {
          type: 'heading',
          level: 3,
          text: 'Les 3 couches de mémoire Claude',
        },
        {
          type: 'diagram-cards',
          cards: [
            { title: 'Mémoire globale', badge: 'Claude.ai', desc: 'Ce que Claude retient sur toi entre toutes les conversations. Activée dans Settings → Capabilities.' },
            { title: 'Mémoire projet', badge: 'Projects', desc: 'Isolée par projet. Ce que Claude apprend dans un projet ne sort pas vers un autre projet.' },
            { title: 'Recherche contextuelle', badge: 'Pro+', desc: 'Claude peut rechercher dans tes conversations passées pour retrouver un contexte.' },
          ],
        },
        {
          type: 'list',
          style: 'numbered',
          items: [
            'Va dans Settings → Capabilities (ou "Memory")',
            'Active "Memory" si pas déjà fait',
            'Lance une nouvelle conversation',
            'Colle le prompt d\'initialisation ci-dessous',
          ],
        },
        {
          type: 'prompt',
          title: 'Prompt d\'initialisation mémoire',
          copyable: true,
          text: `Voici les informations que tu dois mémoriser sur moi pour toutes nos futures conversations :

NOM : [ton prénom]
PROJET PRINCIPAL : [nom de ton projet / SaaS en cours]
STACK TECH : React + TypeScript + Supabase + Vercel + Stripe
NIVEAU : [débutant / intermédiaire / avancé]
OBJECTIF 90 JOURS : [ex: lancer et monétiser mon SaaS avant fin [mois]]

MES HABITUDES DE TRAVAIL :
- Je travaille [matin / soir / le week-end]
- Je préfère des sessions de [durée] max
- Quand je suis bloqué, commence par diagnostiquer avant de proposer une solution

CE QUE JE NE VEUX PAS :
- Pas d'emojis dans les réponses techniques
- Pas de "N'hésitez pas à me demander si..."
- Pas de résumés en fin de réponse si je n'en ai pas demandé

Mémorise tout ça et confirme en disant : "Contexte mémorisé. Je te connais maintenant, [prénom]."`,
        },
        {
          type: 'callout',
          variant: 'buildrs',
          title: 'Chez Buildrs',
          text: 'On nettoie notre mémoire Claude 1 fois par mois — on supprime ce qui est obsolète et on réinitialise avec le contexte du mois en cours. Traite-la comme le onboarding d\'un nouvel employé : à jour, précis, actionnable.',
        },
        {
          type: 'checklist',
          items: ['Mémoire activée et initialisée avec le prompt'],
        },
      ],
    },

    // 1.6 — Configurer la confidentialité
    {
      id: '1.6',
      title: 'Configurer la confidentialité',
      duration: '3 min',
      blocks: [
        {
          type: 'text',
          text: 'Par défaut, Claude peut utiliser tes conversations pour améliorer ses modèles. Si tu travailles sur des projets clients ou des données sensibles, désactive ça immédiatement.',
        },
        {
          type: 'list',
          style: 'numbered',
          items: [
            'Settings → Privacy',
            '"Help improve Claude" → désactiver',
            'Pour les conversations sensibles : Cmd+Shift+I (Mac) ou Ctrl+Shift+I (Windows) → mode Incognito',
            'En mode Incognito : la conversation n\'est PAS sauvegardée, pas mémorisée, pas utilisée pour l\'entraînement',
          ],
        },
        {
          type: 'callout',
          variant: 'buildrs',
          title: 'Chez Buildrs',
          text: 'On désactive "Help improve Claude" systématiquement. On utilise le mode Incognito pour les conversations avec des données clients (coordonnées, financières, stratégiques).',
        },
        {
          type: 'checklist',
          items: ['Confidentialité configurée (aide à l\'amélioration désactivée)'],
        },
      ],
    },

    // 1.7 — Les 3 modes : Chat / Cowork / Code
    {
      id: '1.7',
      title: 'Les 3 modes : Chat / Cowork / Code',
      duration: '5 min',
      blocks: [
        {
          type: 'text',
          text: 'Claude n\'est pas juste un chatbot. C\'est une plateforme avec 3 modes d\'utilisation distincts — chacun adapté à un type de travail.',
        },
        {
          type: 'diagram-cards',
          cards: [
            { title: 'Mode Chat',   badge: '70% du temps', desc: 'Conversation, réflexion, rédaction, recherche, analyse. Le mode par défaut. Parfait pour toutes les étapes du framework.' },
            { title: 'Mode Code',   badge: '20% du temps', desc: 'Agent de développement qui lit et modifie TES fichiers directement. Pour construire ton SaaS (étapes 7-8).' },
            { title: 'Mode Cowork', badge: '10% du temps', desc: 'Agent desktop qui automatise des tâches répétitives sur ton ordinateur. Pour l\'automation (étapes 9-10).' },
          ],
        },
        {
          type: 'callout',
          variant: 'buildrs',
          title: 'Chez Buildrs',
          text: 'Le 10% de Cowork nous fait gagner 10h/semaine : triage inbox du matin, rapport MRR hebdo, veille concurrents — tout ça tourne pendant qu\'on dort ou qu\'on code.',
        },
        {
          type: 'callout',
          variant: 'tip',
          title: 'Note sur Code et Cowork',
          text: 'Ces deux modes sont approfondis dans les Modules 5 (Claude Code) et 6 (Cowork) de ce parcours. Ici, on comprend juste la logique d\'ensemble.',
        },
        {
          type: 'checklist',
          items: ['Les 3 modes compris'],
        },
      ],
    },

    // 1.8 — Les outils complémentaires du framework Buildrs
    {
      id: '1.8',
      title: 'Les outils complémentaires',
      duration: '15 min',
      blocks: [
        {
          type: 'callout',
          variant: 'framework',
          title: 'Étape 1 du framework',
          text: 'Ces outils sont la couche autour de Claude. Ils démultiplient son impact — VS Code lui donne accès à ton code, Whispr Flow lui permet de t\'entendre, Notion centralise ta KB projet.',
        },

        { type: 'heading', level: 3, text: 'VS Code — ton atelier de code' },
        {
          type: 'text',
          text: 'VS Code, c\'est ton atelier. Claude Code travaille dedans. L\'installer c\'est 5 minutes — sans ça, Claude Code n\'a nulle part où agir.',
        },
        {
          type: 'links',
          items: [
            { label: 'Télécharger VS Code', url: 'https://code.visualstudio.com/', desc: 'Gratuit — macOS, Windows, Linux' },
          ],
        },
        {
          type: 'list',
          style: 'bullet',
          items: [
            'Extensions à installer (Extensions panel → chercher et installer) :',
            '→ Claude Code (by Anthropic) — l\'extension officielle',
            '→ Tailwind CSS IntelliSense — autocompletion des classes Tailwind',
            '→ ES7+ React/Redux Snippets — snippets React rapides',
            '→ Error Lens — erreurs TypeScript affichées en ligne',
          ],
        },

        { type: 'heading', level: 3, text: 'Whispr Flow — parle à Claude' },
        {
          type: 'text',
          text: 'Whispr te permet de PARLER à Claude au lieu de taper. Tu dictes ton prompt, l\'IA transcrit. Tu gagnes 3x en vitesse sur chaque interaction — plus besoin de chercher tes mots sur un clavier.',
        },
        {
          type: 'links',
          items: [
            { label: 'Whispr Flow', url: 'https://whisprflow.com', desc: 'App Mac uniquement — transcription IA ultra-rapide' },
          ],
        },
        {
          type: 'list',
          style: 'bullet',
          items: [
            '1. Installe Whispr Flow (app Mac)',
            '2. Configure le modèle : Groq Whisper Large v3 (le plus rapide)',
            '3. Crée un raccourci clavier global (ex: Option+Espace)',
            '4. Configure des "prompt snippets" : des raccourcis pour tes prompts fréquents',
            '5. Dans n\'importe quelle app — appuie sur ton raccourci, parle, Whispr transcrit direct dans le champ',
          ],
        },

        { type: 'heading', level: 3, text: 'Notion — ton wiki projet' },
        {
          type: 'text',
          text: 'Notion, c\'est ton wiki. Idées, notes, specs, infos clients — tout au même endroit. Claude peut s\'y connecter via le connecteur natif (Module 4) et lire tes documents directement.',
        },
        {
          type: 'links',
          items: [{ label: 'Notion', url: 'https://notion.so', desc: 'Gratuit pour usage personnel' }],
        },

        { type: 'heading', level: 3, text: 'NotebookLM — l\'outil de recherche' },
        {
          type: 'text',
          text: 'NotebookLM de Google transforme n\'importe quel document en source de connaissance interrogeable. Tu uploades la doc d\'un concurrent — NotebookLM la résume et tu la donnes à Claude comme contexte.',
        },
        {
          type: 'links',
          items: [{ label: 'NotebookLM', url: 'https://notebooklm.google.com', desc: 'Gratuit — recherche sur tes propres documents' }],
        },

        {
          type: 'checklist',
          items: [
            'VS Code installé avec les 4 extensions',
            'Whispr Flow installé et configuré (optionnel mais recommandé)',
            'Notion ou outil de notes configuré',
          ],
        },
      ],
    },
  ],
}

// ─────────────────────────────────────────────────────────────────
// MODULE 2 — TON CERVEAU PROJET
// ─────────────────────────────────────────────────────────────────

const MODULE_2: ClaudeModule = {
  id: 'claude-2',
  title: 'Ton Cerveau Projet',
  subtitle: 'Une architecture de projets qui structure tout ton business dans Claude.',
  etapeLabel: 'Étapes 1-3 — Organiser',
  frameworkSteps: [1, 2, 3],
  duration: '35 min',
  lessons: [
    {
      id: '2.1',
      title: 'La logique des Projets Claude',
      duration: '5 min',
      blocks: [
        {
          type: 'text',
          text: '1 Projet = 1 contexte business isolé. Il contient ses propres instructions, sa Knowledge Base, sa mémoire et ses conversations. Ce qui se passe dans un projet reste dans ce projet.',
        },
        {
          type: 'callout',
          variant: 'buildrs',
          title: 'Chez Buildrs',
          text: 'On a 8 projets actifs en ce moment — pas 50. Pas un projet par conversation. Un projet par CONTEXTE business : développement produit, marketing, clients, etc. La discipline des projets c\'est la clé pour ne pas se noyer.',
        },
        {
          type: 'diagram-cards',
          cards: [
            { title: 'Projet Chat',   badge: 'claude.ai', desc: 'Instructions + Knowledge Base + conversations. Le projet de référence.' },
            { title: 'Projet Code',   badge: 'Claude Code', desc: 'Même concept, mais lié à un repo local. Le CLAUDE.md joue le rôle des instructions.' },
            { title: 'Projet Cowork', badge: 'Cowork', desc: 'Avec mémoire persistante + tâches planifiées. Différent d\'un projet Chat.' },
          ],
        },
        { type: 'checklist', items: ['Logique des projets comprise'] },
      ],
    },

    {
      id: '2.2',
      title: 'Créer son premier Projet',
      duration: '5 min',
      blocks: [
        {
          type: 'list',
          style: 'numbered',
          items: [
            'Va sur claude.ai',
            'Menu latéral gauche → "Projects" → "+ New Project"',
            'Donne-lui un nom : "Business Core" ou "[nom de ton SaaS] Dev"',
            'Clique sur "Set project instructions" (ou "Edit instructions")',
            'Colle le template ci-dessous et adapte les [placeholders]',
          ],
        },
        {
          type: 'template',
          title: 'Template instructions projet Buildrs',
          language: 'text',
          content: `CONTEXTE DU PROJET
Projet : [nom du projet]
Objectif : [en 1 phrase — ce qu'on cherche à accomplir]
Phase actuelle : [ex: MVP, v1, croissance]

STACK TECHNIQUE
Frontend : React + TypeScript + Vite + Tailwind
Backend : Supabase (PostgreSQL + Auth + Edge Functions)
Paiements : Stripe
Déploiement : Vercel
Emails : Resend

CONVENTIONS ET RÈGLES
- TypeScript strict, pas de any implicite
- Composants React en fonctions avec hooks
- CSS via Tailwind classes uniquement
- Variables d'environnement pour tous les secrets
- Commits en anglais, code en anglais, commentaires en français

CE QUE TU DOIS SAVOIR
[informations clés sur le projet que Claude doit garder en tête]

INTERDITS
- Ne jamais exposer de clés API côté client
- Ne jamais supprimer de données sans confirmation explicite
- Ne jamais simplifier la logique de sécurité`,
        },
        { type: 'checklist', items: ['Premier projet créé'] },
      ],
    },

    {
      id: '2.3',
      title: 'Les instructions projet parfaites',
      duration: '8 min',
      blocks: [
        {
          type: 'text',
          text: 'Les instructions projet s\'empilent par-dessus tes préférences profil. Tu n\'as pas besoin de te re-présenter — le projet a son propre contexte.',
        },
        {
          type: 'diagram-cards',
          cards: [
            { title: 'Identité',     desc: 'Qui tu es dans ce contexte, ce que tu construis, pour qui.' },
            { title: 'Stack',        desc: 'Technologies, outils, versions. Claude ne devine pas — dis-lui explicitement.' },
            { title: 'Règles',       desc: 'Conventions de code, interdits absolus. Ce qui ne change jamais.' },
            { title: 'Design tokens',desc: 'Couleurs, typographie, composants UI. Si c\'est un projet front-end.' },
            { title: 'Workflow',     desc: 'Comment tu travailles : cycles de sprint, process de commit, déploiement.' },
            { title: 'Permissions',  desc: 'Ce que Claude peut faire seul vs ce qui nécessite ta validation.' },
          ],
        },
        {
          type: 'callout',
          variant: 'tip',
          title: 'Le test des instructions',
          text: 'Tes instructions sont bonnes si Claude peut répondre à ces 3 questions sans que tu les poses : Qu\'est-ce qu\'on construit ? Avec quoi ? Comment ? Si une réponse manque dans tes instructions, ajoute-la.',
        },
        { type: 'checklist', items: ['Instructions projet rédigées'] },
      ],
    },

    {
      id: '2.4',
      title: 'La Knowledge Base projet',
      duration: '5 min',
      blocks: [
        {
          type: 'heading', level: 3, text: 'Quoi uploader dans la KB',
        },
        {
          type: 'list',
          style: 'bullet',
          items: [
            'Brief produit (problème, cible, MVP)',
            'Schéma de base de données (tables, relations)',
            'Design tokens (couleurs, typographie, composants)',
            'Exemples de livrables de qualité (pour aligner le style)',
            'Contraintes métier ou légales',
          ],
        },
        {
          type: 'heading', level: 3, text: 'Quoi NE PAS uploader',
        },
        {
          type: 'list',
          style: 'bullet',
          items: [
            'Fichiers qui changent tous les jours (log, export dynamique)',
            'Données sensibles (clés API, mots de passe, données clients)',
            'Fichiers massifs (+500KB) — ça consomme des tokens inutilement',
            'Docs génériques (la doc Supabase en entier — utilise le MCP Context7 à la place)',
          ],
        },
        {
          type: 'callout',
          variant: 'buildrs',
          title: 'Chez Buildrs',
          text: 'Notre règle : qualité > quantité. 3 bons fichiers valent mieux que 20 fichiers inutiles. On maintient la KB légère — c\'est plus rapide et Claude s\'en sert mieux.',
        },
        { type: 'checklist', items: ['Knowledge Base configurée'] },
      ],
    },

    {
      id: '2.5',
      title: 'Le système 5 fichiers Buildrs',
      duration: '8 min',
      blocks: [
        {
          type: 'text',
          text: 'Les 5 fichiers qu\'on met dans la KB de CHAQUE projet. Ce sont les 5 documents qui donnent à Claude le contexte complet pour travailler efficacement.',
        },
        {
          type: 'diagram-cards',
          cards: [
            { title: 'CONTEXT.md',  badge: 'Mis à jour / projet', desc: 'Qui on est, ce qu\'on fait, objectifs, cibles, positionnement.' },
            { title: 'STACK.md',    badge: 'Stable',              desc: 'Stack technique, outils, architecture, dépendances clés.' },
            { title: 'RULES.md',    badge: 'Stable',              desc: 'Conventions, interdits absolus, standards de qualité.' },
            { title: 'CURRENT.md',  badge: 'Chaque lundi',        desc: 'Sprint en cours, priorités de la semaine, tâches actives. MIS À JOUR chaque lundi matin.' },
            { title: 'HISTORY.md',  badge: 'Chaque sprint',       desc: 'Décisions passées et leurs justifications. Résumé, pas journal.' },
          ],
        },
        {
          type: 'callout',
          variant: 'buildrs',
          title: 'Notre routine lundi matin',
          text: 'Chaque lundi à 9h : 10 minutes pour mettre à jour CURRENT.md. On écrit les 3 priorités de la semaine. Claude lit ça en premier dans chaque session. C\'est la différence entre un assistant qui comprend où on en est et un qui repart de zéro.',
        },
        { type: 'checklist', items: ['5 fichiers créés dans le premier projet'] },
      ],
    },

    {
      id: '2.6',
      title: 'Organiser ses projets',
      duration: '5 min',
      blocks: [
        {
          type: 'text',
          text: 'L\'architecture de projets Buildrs. Simple, scalable, claire.',
        },
        {
          type: 'diagram-cards',
          cards: [
            { title: 'Business Core',      badge: 'Projet 1', desc: 'Stratégie, offres, pricing, positionnement. Le projet "tête".' },
            { title: 'Dev Produit',         badge: 'Projet 2', desc: 'Stack, specs, architecture, code. Un projet par SaaS actif.' },
            { title: 'Marketing & Ventes',  badge: 'Projet 3', desc: 'Copies, tunnels, emails, ads, landing pages.' },
            { title: 'Contenu',             badge: 'Projet 4', desc: 'Piliers éditoriaux, scripts, calendrier. Si tu fais du contenu.' },
            { title: 'Client [nom]',        badge: 'Projet 5+', desc: 'Un projet par client actif en mission. Contexte isolé.' },
          ],
        },
        {
          type: 'callout',
          variant: 'tip',
          title: 'Action maintenant',
          text: 'Crée au minimum les Projets 1 (Business Core) et 2 (Dev Produit). Les autres peuvent attendre que tu en aies besoin.',
        },
        { type: 'checklist', items: ['Architecture de projets en place (min. 2 projets)'] },
      ],
    },

    {
      id: '2.7',
      title: 'Mémoire projet vs mémoire globale',
      duration: '3 min',
      blocks: [
        {
          type: 'text',
          text: 'La distinction la plus importante à comprendre pour ne pas se perdre.',
        },
        {
          type: 'diagram-cards',
          cards: [
            { title: 'Mémoire globale', badge: 'Partout', desc: 'Ce que Claude sait sur toi en dehors de tout projet. Tes préférences, ton contexte perso, ton style.' },
            { title: 'Mémoire projet',  badge: 'Isolée',  desc: 'Ce que Claude apprend dans ce projet précis. Les décisions, les conventions, les spécificités. Ne sort pas du projet.' },
          ],
        },
        {
          type: 'callout',
          variant: 'buildrs',
          title: 'La règle d\'or',
          text: 'Tout ce qui est spécifique à un SaaS va dans la mémoire projet (ou la KB). Tout ce qui est vrai pour tous tes projets va dans la mémoire globale ou les préférences profil.',
        },
        { type: 'checklist', items: ['Distinction mémoire projet / globale comprise'] },
      ],
    },
  ],
}

// ─────────────────────────────────────────────────────────────────
// MODULE 3 — TES ARMES DE CRÉATION
// ─────────────────────────────────────────────────────────────────

const MODULE_3: ClaudeModule = {
  id: 'claude-3',
  title: 'Tes Armes de Création',
  subtitle: 'Les fonctionnalités avancées de Claude pour produire plus vite.',
  etapeLabel: 'Étapes 4-5 — Créer',
  frameworkSteps: [4, 5],
  duration: '40 min',
  lessons: [
    {
      id: '3.1',
      title: 'Les Artifacts',
      duration: '5 min',
      blocks: [
        { type: 'text', text: 'Les Artifacts, c\'est le panneau séparé qui s\'ouvre à droite quand Claude génère du code ou un document. Au lieu d\'avoir le résultat dans le chat, tu as un aperçu interactif.' },
        {
          type: 'diagram-cards',
          cards: [
            { title: 'Code React interactif', badge: 'Top usage', desc: 'Claude génère un composant ou une page entière — tu la vois fonctionner immédiatement dans le panneau.' },
            { title: 'Documents Markdown',    badge: 'Fréquent',  desc: 'Specs, cahier des charges, emails, landing pages — formatés et lisibles.' },
            { title: 'SVG / Diagrammes',      badge: 'Pratique',  desc: 'Mermaid pour les flow, diagrammes d\'architecture, user journeys visuels.' },
          ],
        },
        {
          type: 'callout',
          variant: 'buildrs',
          title: 'Chez Buildrs',
          text: 'On utilise les Artifacts pour prototyper VISUELLEMENT avant d\'implémenter. Tu vois si l\'UX a du sens en 2 minutes — sans avoir touché à ton repo. C\'est le workflow Artifact → Code (leçon 3.2).',
        },
        { type: 'checklist', items: ['Artifacts maîtrisés'] },
      ],
    },

    {
      id: '3.2',
      title: 'Le workflow Artifact → Code',
      duration: '5 min',
      blocks: [
        {
          type: 'list',
          style: 'numbered',
          items: [
            'Étape 1 — Prototyper dans Artifact (Chat) : "Génère un dashboard admin React avec Tailwind — sidebar, table utilisateurs, graphique revenus"',
            'Étape 2 — Valider l\'UX dans le panneau : est-ce que ça ressemble à ce que tu veux ?',
            'Étape 3 — Itérer rapidement dans Chat (pas de fichiers, pas de déploiement)',
            'Étape 4 — Passer à Claude Code pour implémenter proprement dans le repo',
            'Étape 5 — Déployer',
          ],
        },
        {
          type: 'callout',
          variant: 'framework',
          title: 'Étape 6 du framework (Design)',
          text: 'L\'Artifact est ton outil de design. Au lieu de passer 2h sur Figma, tu prototypes en 10 minutes avec Claude. Si ça ne te convient pas, tu modifies le prompt — pas un fichier Figma.',
        },
        { type: 'checklist', items: ['Workflow Artifact → Code compris'] },
      ],
    },

    {
      id: '3.3',
      title: 'Extended Thinking',
      duration: '5 min',
      blocks: [
        { type: 'text', text: 'Extended Thinking, c\'est le mode où Claude réfléchit à haute voix avant de te répondre. Tu vois ses étapes de raisonnement. Les réponses sont plus profondes, plus fiables pour les problèmes complexes.' },
        {
          type: 'list',
          style: 'bullet',
          items: [
            'Quand l\'utiliser : architecture technique complexe, décisions stratégiques, problèmes avec plusieurs contraintes',
            'Sur plan Pro/Max : activé automatiquement sur les modèles qui le supportent',
            'Pour encourager : ajoute "Prends le temps de bien réfléchir avant de répondre" à ton prompt',
            'Quand ne PAS l\'utiliser : questions simples, tâches répétitives — ça consomme plus de tokens pour peu de gain',
          ],
        },
        {
          type: 'callout',
          variant: 'buildrs',
          title: 'Chez Buildrs',
          text: 'On utilise Extended Thinking pour les décisions d\'architecture (quand on hésite entre 2 approches), pour les specs produit complexes, et pour les analyses stratégiques. Pas pour générer du code standard.',
        },
        { type: 'checklist', items: ['Extended Thinking compris'] },
      ],
    },

    {
      id: '3.4',
      title: 'Deep Research',
      duration: '5 min',
      blocks: [
        { type: 'text', text: 'Deep Research, c\'est Claude qui fait plusieurs recherches web, synthétise les résultats, et produit un rapport structuré. Ça prend 3-10 minutes, mais le livrable est une analyse professionnelle.' },
        {
          type: 'callout',
          variant: 'framework',
          title: 'Étapes 2-3 du framework (Trouver & Valider)',
          text: 'Deep Research est ton meilleur outil pour l\'étape de validation. Tu lui demandes d\'analyser 5 concurrents dans ton marché — il te livre un rapport complet en moins de 5 minutes. Ce qui te prendrait une journée, lui le fait en quelques minutes.',
        },
        {
          type: 'prompt',
          title: 'Exemple de prompt Deep Research',
          copyable: true,
          text: `Fais une analyse approfondie du marché des [catégorie de SaaS] en France.

Je veux un rapport sur :
1. Les 5 concurrents principaux avec leurs modèles de prix et fonctionnalités clés
2. Les gaps et problèmes non résolus dans ce marché
3. Les arguments de vente qui reviennent dans leurs marketings
4. Une opportunité de positionnement différenciant pour un nouvel entrant

Cible : solopreneurs et PME françaises.
Profondeur demandée : un vrai rapport, pas un résumé superficiel.`,
        },
        { type: 'checklist', items: ['Deep Research testé sur ton marché'] },
      ],
    },

    {
      id: '3.5',
      title: 'Choisir le bon modèle',
      duration: '5 min',
      blocks: [
        {
          type: 'diagram-cards',
          cards: [
            { title: 'Sonnet 4.6', badge: '90% du temps', desc: 'Rapide, intelligent, excellent rapport qualité/coût. Le modèle par défaut pour tout.' },
            { title: 'Opus 4.6',   badge: '10% du temps',  desc: 'Le plus puissant. Pour les décisions complexes, l\'architecture, les analyses stratégiques.' },
            { title: 'Haiku 4.5',  badge: 'Automation',    desc: 'Ultra-rapide, économique. Pour les tâches simples en volume ou les agents automatisés.' },
          ],
        },
        {
          type: 'callout',
          variant: 'framework',
          title: 'Mapping modèle → étape framework',
          text: 'Opus pour strategiser (étapes 3-4). Sonnet pour exécuter (étapes 5-9). Haiku pour automatiser (étape 10). Dans Claude Code : /model opus pour planifier, /model sonnet pour coder.',
        },
        { type: 'checklist', items: ['Choix de modèle maîtrisé'] },
      ],
    },

    {
      id: '3.6',
      title: 'Le prompting Buildrs',
      duration: '10 min',
      blocks: [
        { type: 'heading', level: 3, text: 'Les 5 principes du bon prompt' },
        {
          type: 'list',
          style: 'numbered',
          items: [
            'Contexte d\'abord — qui tu es, sur quel projet, dans quel état',
            'Rôle explicite — "Tu es un expert Supabase", "Tu es un copywriter spécialisé SaaS"',
            'Format demandé — "Réponds avec une liste numérotée", "En 3 paragraphes max"',
            'Exemples — si tu veux un style particulier, montre-lui un exemple',
            'Itération — le premier prompt est rarement parfait. Affine.',
          ],
        },
        { type: 'heading', level: 3, text: 'Les 10 prompts du framework Buildrs' },
        {
          type: 'text',
          text: 'Un prompt par étape du framework. Copie, remplace les [placeholders], lance.',
        },
        {
          type: 'prompt',
          title: 'Étape 2 — Trouver une idée de SaaS',
          copyable: true,
          text: `Tu es un expert en détection d'opportunités SaaS.

Mon profil : [ton parcours en 2 lignes — ex: freelance en marketing digital depuis 5 ans]
Ce que je fais bien : [tes compétences / ton domaine d'expertise]
Ce qui me frustre dans mon travail : [problèmes récurrents]
Budget développement : [ex: 0€ — je code avec Claude / ex: 500€ pour un développeur]

Génère 5 idées de micro-SaaS pour mon profil. Pour chaque idée :
- Le problème résolu en 1 phrase
- La cible précise (pas "les entreprises" — sois spécifique)
- Le modèle de prix suggéré
- Pourquoi je suis bien placé pour le construire
- Le risque principal`,
        },
        {
          type: 'prompt',
          title: 'Étape 3 — Valider mon idée',
          copyable: true,
          text: `Je veux valider l'idée de SaaS suivante : [description de ton idée en 2-3 phrases]

Fais une analyse de validation approfondie :
1. Concurrents directs (3-5 max) — prix, forces, faiblesses
2. Taille du marché estimée (volontairement rough — ordre de grandeur suffit)
3. Signaux de demande (où sont les gens qui ont ce problème ?)
4. Obstacles principaux (technique, réglementation, distribution)
5. MVP minimum viable (qu'est-ce que je dois construire pour avoir le premier oui payant ?)

Conclus avec un verdict : GO / NO-GO / GO SI [condition].`,
        },
        {
          type: 'prompt',
          title: 'Étape 7 — Architecturer mon produit',
          copyable: true,
          text: `Tu es un architecte SaaS expert React/Supabase.

Produit : [nom et description en 2 phrases]
Fonctionnalités clés : [liste des features principales du MVP]
Utilisateurs cibles : [nombre estimé au lancement, type]

Génère l'architecture complète :
1. Structure des tables Supabase (avec types de colonnes et relations)
2. Politiques RLS pour chaque table
3. Liste des Edge Functions nécessaires
4. Arborescence des fichiers React suggérée
5. Points d'attention sécurité

Format : markdown structuré, prêt à copier dans un CLAUDE.md.`,
        },
        { type: 'checklist', items: ['Prompts framework sauvegardés dans tes projets Claude'] },
      ],
    },

    {
      id: '3.7',
      title: 'Gestion de la fenêtre de contexte',
      duration: '5 min',
      blocks: [
        { type: 'text', text: 'La fenêtre de contexte, c\'est la mémoire de travail de Claude dans UNE conversation. Quand elle se remplit, Claude oublie le début. Si ses réponses deviennent incohérentes ou qu\'il ne "se souvient" plus de quelque chose que tu as dit — c\'est le signe que la fenêtre est saturée.' },
        {
          type: 'list',
          style: 'bullet',
          items: [
            '1 conversation = 1 sujet — ne mélange pas 5 sujets différents dans un seul thread',
            'Conversations courtes et ciblées — mieux que des mega-threads',
            'Fichiers KB sélectifs — n\'uploade que ce qui est vraiment utile au projet en cours',
            'Si la fenêtre sature → nouvelle conversation en résumant le contexte en 3 lignes',
            'Dans Claude Code : utilise /compact pour compresser le contexte (leçon 5.13)',
          ],
        },
        {
          type: 'callout',
          variant: 'tip',
          title: 'Astuce pratique',
          text: 'Garde un fichier "CONTEXT_HANDOFF.md" dans tes projets : 5-10 lignes résumant l\'état du travail en cours. Quand tu ouvres une nouvelle conversation, tu colles ce fichier — et Claude repart exactement où tu t\'étais arrêté.',
        },
        { type: 'checklist', items: ['Gestion du contexte maîtrisée'] },
      ],
    },
  ],
}

// ─────────────────────────────────────────────────────────────────
// MODULE 4 — TES CONNECTEURS
// ─────────────────────────────────────────────────────────────────

const MODULE_4: ClaudeModule = {
  id: 'claude-4',
  title: 'Tes Connecteurs',
  subtitle: 'Claude accède à tes outils et tes données en temps réel.',
  etapeLabel: 'Transversal — Toutes étapes',
  frameworkSteps: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  duration: '35 min',
  lessons: [
    {
      id: '4.1',
      title: 'Les 3 types de connecteurs',
      duration: '5 min',
      blocks: [
        {
          type: 'diagram-cards',
          cards: [
            { title: 'Connecteurs Web',      badge: 'claude.ai + Desktop', desc: 'Google Drive, Notion, Slack, Gmail, Calendar. Activés dans Settings → Connected Apps.' },
            { title: 'Connecteurs Mobile',   badge: 'App mobile',           desc: 'Maps, iMessage. Accès aux apps natives de ton téléphone.' },
            { title: 'MCP Servers',          badge: 'Protocole ouvert',     desc: 'Connexion directe à N\'IMPORTE QUEL outil. Le niveau supérieur — Module 4.4 à 4.7.' },
          ],
        },
        { type: 'checklist', items: ['Types de connecteurs compris'] },
      ],
    },

    {
      id: '4.2',
      title: 'Connecteurs essentiels à activer',
      duration: '8 min',
      blocks: [
        {
          type: 'list',
          style: 'numbered',
          items: [
            'Va sur claude.ai → Settings → Connected Apps',
            'Recherche Web — TOUJOURS activé. C\'est la base. Ne jamais désactiver.',
            'Google Drive — si tu utilises Google Docs/Sheets/Slides pour tes specs et notes',
            'Notion — si tu as ton wiki projet dans Notion',
            'Gmail + Calendar — si tu veux que Claude lise tes emails et accède à ton agenda',
          ],
        },
        {
          type: 'callout',
          variant: 'tip',
          title: 'Recherche web : indispensable',
          text: 'Avec la recherche web activée, Claude ne t\'invente pas des infos obsolètes. Il cherche en temps réel. C\'est crucial pour la validation de marché (étape 3) et la veille concurrentielle (étape 10).',
        },
        {
          type: 'links',
          items: [{ label: 'Connecteurs Claude', url: 'https://claude.ai/settings/connectors', desc: 'Ouvre tes paramètres de connecteurs' }],
        },
        { type: 'checklist', items: ['Connecteurs essentiels activés (Recherche web + tes outils)'] },
      ],
    },

    {
      id: '4.3',
      title: 'Claude in Chrome',
      duration: '5 min',
      blocks: [
        { type: 'text', text: 'Claude in Chrome, c\'est l\'extension navigateur qui donne à Claude la capacité d\'analyser une page web, de cliquer, de remplir des formulaires — depuis le navigateur.' },
        {
          type: 'callout',
          variant: 'framework',
          title: 'Utilisation dans le framework',
          text: 'Étape 2 (Trouver une idée) : tu lui envoies les URLs des landing pages concurrentes — il les analyse et extrait les arguments de vente. Étape 10 (Analyser) : il audite ta propre app et te donne les points d\'amélioration UX.',
        },
        {
          type: 'links',
          items: [{ label: 'Extension Claude pour Chrome', url: 'https://chromewebstore.google.com/detail/claude-by-anthropic/ghbhccmlpfmfccbgjajmgjpaaclmfocd', desc: 'Chrome Web Store — officielle Anthropic' }],
        },
        { type: 'checklist', items: ['Claude in Chrome installé'] },
      ],
    },

    {
      id: '4.4',
      title: 'Introduction aux MCP Servers',
      duration: '5 min',
      blocks: [
        { type: 'text', text: 'MCP (Model Context Protocol) — c\'est le protocole ouvert qui permet à Claude de PARLER directement à tes outils. Pas de copier-coller entre Claude et Supabase — Claude lit tes tables directement. Pas de passer l\'erreur GitHub à la main — Claude lit le repo.' },
        {
          type: 'diagram-cards',
          cards: [
            { title: 'Sans MCP',  badge: 'Avant', desc: 'Tu exportes les données → tu les colles dans le chat → Claude répond → tu retournes implémenter. 5 aller-retours.' },
            { title: 'Avec MCP',  badge: 'Après', desc: 'Claude accède directement. Il lit, analyse, modifie et te donne le résultat. 1 seul échange.' },
          ],
        },
        {
          type: 'callout',
          variant: 'buildrs',
          title: 'Chez Buildrs',
          text: 'On utilise 3 MCPs au quotidien : Context7 (docs à jour), Supabase (accès BDD direct) et GitHub (lecture des repos). Ces 3 MCPs seuls font économiser 2h par jour de copier-coller.',
        },
        { type: 'checklist', items: ['MCP Servers compris'] },
      ],
    },

    {
      id: '4.5',
      title: 'Le stack MCP Buildrs',
      duration: '5 min',
      blocks: [
        {
          type: 'diagram-cards',
          cards: [
            { title: 'Context7',  badge: 'Essentiel',  desc: 'Docs à jour de React, Supabase, Stripe, Tailwind. Claude ne travaille plus avec des docs périmées. Étapes 7-8.' },
            { title: 'Supabase',  badge: 'Essentiel',  desc: 'Accès direct à ta BDD — lire les tables, créer des migrations, tester des requêtes. Étapes 7-8.' },
            { title: 'GitHub',    badge: 'Important',  desc: 'Lecture des repos, fichiers, branches. Claude peut voir ton code sans que tu lui colles. Étapes 7-9.' },
            { title: 'Stripe',    badge: 'Important',  desc: 'Lecture des clients, paiements, abonnements. Pour l\'analytique et le support. Étapes 9-10.' },
            { title: 'Vercel',    badge: 'Utile',      desc: 'Accès aux déploiements, logs, projets. Pour débugger en production. Étape 9.' },
            { title: 'Resend',    badge: 'Optionnel',  desc: 'Gestion des emails, templates, domaines. Si tu fais des campagnes email. Étape 8.' },
          ],
        },
        { type: 'checklist', items: ['Stack MCP compris'] },
      ],
    },

    {
      id: '4.6',
      title: 'Installer un MCP pas à pas',
      duration: '8 min',
      blocks: [
        { type: 'text', text: 'On installe Context7 — le plus simple et le plus utile pour commencer. Les MCPs s\'installent dans Claude Code (pas dans claude.ai Chat).' },
        {
          type: 'template',
          title: 'Installation Context7',
          language: 'bash',
          content: `# Dans ton terminal, dans n'importe quel projet :
claude mcp add context7 -- npx -y @upstash/context7-mcp@latest

# Vérifie l'installation :
claude mcp list

# Test : dans une conversation Claude Code, tape :
# "Quelle est la syntaxe pour une Edge Function Supabase ?"
# Il cherche dans la doc à jour — pas dans sa mémoire d'entraînement`,
        },
        {
          type: 'template',
          title: 'Installation Supabase MCP',
          language: 'bash',
          content: `# Remplace [TON_PROJECT_REF] par ton ref Supabase (dans Settings → General → Reference ID)
# Et [TON_ACCESS_TOKEN] par ton personal access token (supabase.com → Account → Access Tokens)

claude mcp add supabase -- npx -y @supabase/mcp-server-supabase@latest \\
  --project-ref [TON_PROJECT_REF] \\
  --access-token [TON_ACCESS_TOKEN]`,
        },
        {
          type: 'callout',
          variant: 'tip',
          title: 'Config globale vs projet',
          text: 'Par défaut, les MCPs s\'installent pour le projet courant. Pour les rendre disponibles partout, utilise --global : claude mcp add --global context7 ...',
        },
        { type: 'checklist', items: ['Context7 MCP installé et fonctionnel'] },
      ],
    },

    {
      id: '4.7',
      title: 'Mapping framework → connecteurs',
      duration: '5 min',
      blocks: [
        {
          type: 'text',
          text: 'Pour chaque étape du framework, les connecteurs et MCPs qui font la différence.',
        },
        {
          type: 'diagram-cards',
          cards: [
            { title: 'Étapes 1-3',  badge: 'Trouver & Valider', desc: 'Recherche web, Chrome in Browser, Deep Research, Perplexity.' },
            { title: 'Étape 4-5',   badge: 'Stratégie & Specs', desc: 'Claude Projects + KB. Notion connecteur pour la doc.' },
            { title: 'Étape 6',     badge: 'Design',            desc: '21st.dev MCP pour les composants UI. Figma MCP pour les design tokens.' },
            { title: 'Étapes 7-8',  badge: 'Archi & Build',     desc: 'Context7 + Supabase MCP + GitHub MCP. Le trio essentiel.' },
            { title: 'Étape 9',     badge: 'Deploy & Ventes',   desc: 'Vercel MCP + Stripe MCP.' },
            { title: 'Étape 10',    badge: 'Analytics',         desc: 'Stripe MCP (données revenus) + outils analytics.' },
          ],
        },
        { type: 'checklist', items: ['Mapping framework → connecteurs compris'] },
      ],
    },
  ],
}

// ─────────────────────────────────────────────────────────────────
// MODULE 5 — CLAUDE CODE (OB Code)
// ─────────────────────────────────────────────────────────────────

const MODULE_5: ClaudeModule = {
  id: 'claude-5',
  title: 'Claude Code',
  subtitle: 'Construis ton SaaS avec Claude Code comme un pro.',
  etapeLabel: 'Étapes 6-7-8 — Construire',
  frameworkSteps: [6, 7, 8],
  duration: '60 min',
  isBonus: true,
  obType: 'code',
  lessons: [
    {
      id: '5.1',
      title: 'C\'est quoi Claude Code',
      duration: '5 min',
      blocks: [
        { type: 'text', text: 'Claude Code, c\'est un agent de développement — pas un chatbot. Il lit tes fichiers, modifie ton code, exécute des commandes terminales, directement dans ton projet.' },
        {
          type: 'diagram-cards',
          cards: [
            { title: 'Claude Chat',  badge: 'Conversation', desc: 'Répond à tes questions. Génère du texte et du code dans le chat. Ne touche pas à tes fichiers.' },
            { title: 'Claude Code',  badge: 'Action',       desc: 'Lit tes fichiers. Modifie ton code. Lance des commandes. Teste. Commit. Déploie. Il agit.' },
          ],
        },
        { type: 'checklist', items: ['Claude Code compris'] },
      ],
    },

    {
      id: '5.2',
      title: 'Les 3 façons d\'utiliser Claude Code',
      duration: '5 min',
      blocks: [
        {
          type: 'diagram-cards',
          cards: [
            { title: 'Desktop — onglet Code', badge: 'Recommandé débutant', desc: 'Le plus simple. Onglet "Code" dans l\'app Claude Desktop. Zéro configuration, zéro terminal.' },
            { title: 'Extension VS Code',     badge: 'Recommandé usage quotidien', desc: 'Panneau Claude intégré dans VS Code. Tu vois le code et Claude en même temps.' },
            { title: 'CLI Terminal',          badge: 'Power users', desc: 'Commande "claude" dans le terminal. Le plus puissant — accès à toutes les options.' },
          ],
        },
        {
          type: 'callout',
          variant: 'buildrs',
          title: 'Chez Buildrs',
          text: 'On utilise le CLI + VS Code ensemble. Desktop pour les sessions courtes et les tests rapides. Tu commenceras probablement par Desktop — c\'est parfait pour apprendre.',
        },
        { type: 'checklist', items: ['Mode d\'utilisation choisi'] },
      ],
    },

    {
      id: '5.3',
      title: 'Installer Claude Code',
      duration: '8 min',
      blocks: [
        { type: 'heading', level: 3, text: 'Option 1 — Via Claude Desktop (recommandé)' },
        { type: 'list', style: 'numbered', items: [
          'Ouvre Claude Desktop',
          'Clique sur l\'onglet "Code" en bas de l\'interface',
          'Suit les instructions d\'installation à l\'écran',
          'C\'est tout — pas besoin de Node.js ni de terminal',
        ]},
        { type: 'heading', level: 3, text: 'Option 2 — Via Terminal (CLI)' },
        {
          type: 'template',
          title: 'Installation CLI Mac',
          language: 'bash',
          content: `# Installation Claude Code CLI
curl -fsSL https://claude.ai/install.sh | bash

# Vérification
claude --version

# Si claude n'est pas trouvé, relance ton terminal ou ajoute à PATH :
# export PATH="$HOME/.claude/bin:$PATH"`,
        },
        {
          type: 'template',
          title: 'Installation Extension VS Code',
          language: 'text',
          content: `1. Ouvre VS Code
2. Extensions panel (Cmd+Shift+X ou Ctrl+Shift+X)
3. Cherche "Claude" dans la barre de recherche
4. Installe "Claude Code" (by Anthropic — vérifier l'éditeur)
5. Recharge VS Code si demandé
6. Un panneau Claude apparaît dans la sidebar`,
        },
        { type: 'checklist', items: ['Claude Code installé (Desktop, CLI ou VS Code)'] },
      ],
    },

    {
      id: '5.4',
      title: 'Le CLAUDE.md parfait',
      duration: '12 min',
      blocks: [
        {
          type: 'callout',
          variant: 'framework',
          title: 'La leçon la plus importante du module',
          text: 'Le CLAUDE.md se place à la racine de ton projet. Claude Code le lit automatiquement au démarrage de chaque session. Sans lui, Claude repart de zéro à chaque fois et tu perds 10 minutes à te ré-expliquer.',
        },
        {
          type: 'template',
          title: 'Template CLAUDE.md Buildrs (production)',
          language: 'markdown',
          content: `# CLAUDE.md — [Nom du Projet]

## Identité du projet
**Projet :** [nom]
**Description :** [en 1 phrase — ce que ça fait, pour qui]
**Phase :** [MVP / v1 / scaling]
**URL prod :** [url si déjà déployé]

## Stack technique
- **Frontend :** React 18 + TypeScript + Vite + Tailwind CSS v3
- **Backend :** Supabase (PostgreSQL + Auth + Edge Functions)
- **Paiements :** Stripe (Checkout + Webhooks)
- **Déploiement :** Vercel
- **Emails :** Resend

## Règles absolues
- TypeScript strict — aucun "any" implicite
- Variables d'environnement pour TOUS les secrets (jamais hardcodé)
- RLS activé sur toutes les tables Supabase
- Commits en anglais
- Pas de console.log() en production

## Design system
- Palette : [tes tokens CSS — ex: --primary: #09090b]
- Font : [ex: Geist Sans + Geist Mono]
- Components : Shadcn/ui pattern
- Icons : Lucide React (strokeWidth 1.5 obligatoire)

## Workflow
1. Explore → Plan → Code → Test → Commit → Deploy
2. Toujours utiliser /plan avant de coder une feature complexe
3. Tests manuels sur localhost avant tout commit
4. Vercel preview automatique sur chaque PR

## Permissions Claude Code
- Peut lire et modifier tous les fichiers du projet
- Peut créer des fichiers dans src/
- Peut exécuter npm/pnpm install, vite build, supabase commands
- Ne peut PAS pousser sur main directement
- Ne peut PAS supprimer de données en production sans confirmation`,
        },
        {
          type: 'callout',
          variant: 'tip',
          title: 'CLAUDE.md vs CLAUDE.local.md',
          text: 'CLAUDE.md = partagé dans le repo (règles d\'équipe, conventions). CLAUDE.local.md = ignoré par git (tes préférences perso, tokens locaux). Les deux sont lus automatiquement.',
        },
        { type: 'checklist', items: ['CLAUDE.md créé et personnalisé à la racine du projet'] },
      ],
    },

    {
      id: '5.5',
      title: 'Le workflow fondamental',
      duration: '8 min',
      blocks: [
        {
          type: 'text',
          text: 'La méthode Buildrs pour ne jamais partir en mode "coding sauvage". Avant de coder, Claude explore. Puis il planifie. Puis il code. Tu valides chaque étape.',
        },
        {
          type: 'list',
          style: 'numbered',
          items: [
            'EXPLORE — "Explore le projet et comprends l\'architecture existante avant de faire quoi que ce soit"',
            'PLAN — "Planifie l\'implémentation de [feature]. Donne-moi une liste d\'étapes avant de coder"',
            'CODE — Claude exécute le plan étape par étape',
            'COMMIT — "/commit — résume ce qui a été fait en un message clair"',
            'DEPLOY — "Vérifie que le build passe, puis déploie sur Vercel preview"',
          ],
        },
        {
          type: 'callout',
          variant: 'buildrs',
          title: 'Chez Buildrs',
          text: '"Tu es le chef de projet, Claude est l\'exécutant." On ne laisse jamais Claude coder en roue libre sur une feature complexe. Plan d\'abord, code ensuite. C\'est ce qui évite les mauvaises surprises à 2h du matin.',
        },
        { type: 'checklist', items: ['Workflow fondamental compris'] },
      ],
    },

    // Gate OB Code pour les leçons 5.6+
    {
      id: '5.6',
      title: 'Les commandes essentielles',
      duration: '10 min',
      blocks: [
        { type: 'ob-gate', obType: 'code', title: 'Claude Code by Buildrs', price: '37€' },
        { type: 'heading', level: 3, text: 'Navigation et contexte' },
        {
          type: 'list',
          style: 'bullet',
          items: [
            '/help — liste toutes les commandes disponibles',
            '/clear — vider le contexte de la conversation (nouvelle session propre)',
            '/compact — compresser le contexte quand la fenêtre sature',
            '/cost — voir le coût en tokens de la session en cours',
            '/status — état du projet (fichiers modifiés, git status)',
          ],
        },
        { type: 'heading', level: 3, text: 'Développement' },
        {
          type: 'list',
          style: 'bullet',
          items: [
            '/add [fichier] — ajouter un fichier au contexte',
            '/review — code review des fichiers modifiés',
            '/commit — créer un commit avec message automatique',
            '/pr — créer une pull request',
            '/init — initialiser CLAUDE.md dans un nouveau projet',
          ],
        },
        { type: 'heading', level: 3, text: 'Contrôle' },
        {
          type: 'list',
          style: 'bullet',
          items: [
            '/undo — annuler la dernière action de Claude',
            '/diff — voir les changements en attente',
            '/model [nom] — changer de modèle (opus, sonnet, haiku)',
            '/plan — passer en mode planification (BONUS — voir leçon 5.7)',
            '! [commande] — exécuter une commande terminal directement',
          ],
        },
        { type: 'checklist', items: ['Commandes principales connues'] },
      ],
    },

    {
      id: '5.7',
      title: 'Le mode Plan et l\'économie de tokens',
      duration: '8 min',
      blocks: [
        { type: 'ob-gate', obType: 'code', title: 'Claude Code by Buildrs', price: '37€' },
        {
          type: 'callout',
          variant: 'buildrs',
          title: 'Le bonus le plus important du module',
          text: '/plan est la technique #1 pour économiser des tokens et payer moins. Claude réfléchit d\'abord, tu valides le plan, puis il exécute — zéro gaspillage de tokens sur des tentatives ratées.',
        },
        {
          type: 'template',
          title: 'Workflow /plan optimal Buildrs',
          language: 'bash',
          content: `# Étape 1 : Forcer Opus pour la planification (meilleur raisonnement)
/model opus

# Étape 2 : Lancer le mode Plan
/plan

# Étape 3 : Décrire la feature à implementer
"Je veux ajouter un système de notifications email avec Resend.
Quand un utilisateur s'inscrit, il reçoit un email de bienvenue.
Quand il upgrade, un email de confirmation."

# Claude produit un plan structuré — lit, valide, corrige si nécessaire

# Étape 4 : Passer à Sonnet pour l'exécution (moins cher, assez puissant)
/model sonnet

# Étape 5 : "Exécute le plan"
# Claude code exactement ce qui était planifié`,
        },
        { type: 'heading', level: 3, text: 'Les Hooks — automatise sans consommer de tokens' },
        { type: 'text', text: 'Les Hooks dans Claude Code s\'exécutent automatiquement à certains moments (avant un commit, après une modification de fichier) sans consommer un seul token. Parfait pour le formatage, les checks TypeScript, les tests.' },
        {
          type: 'template',
          title: 'Hook exemple — pre-commit TypeScript check',
          language: 'json',
          content: `// Dans .claude/settings.json
{
  "hooks": {
    "PreCommit": [{
      "type": "command",
      "command": "npx tsc --noEmit && npm run lint",
      "description": "TypeScript check + lint avant chaque commit"
    }]
  }
}`,
        },
        { type: 'checklist', items: ['Mode Plan maîtrisé', 'Hooks configurés'] },
      ],
    },

    {
      id: '5.8',
      title: 'Les Skills — structure et création',
      duration: '8 min',
      blocks: [
        { type: 'ob-gate', obType: 'code', title: 'Claude Code by Buildrs', price: '37€' },
        { type: 'text', text: 'Un Skill, c\'est un ensemble d\'instructions spécialisées pour Claude Code. Au lieu de lui expliquer comment faire une code review à chaque fois, tu as un skill /code-reviewer que tu invoques en une commande.' },
        {
          type: 'template',
          title: 'Structure officielle d\'un SKILL.md',
          language: 'markdown',
          content: `---
name: mon-skill
description: Ce que le skill fait en 1 ligne (utilisé pour la sélection automatique)
---

## Quand utiliser ce skill
[Dans quel contexte déclencher ce skill]

## Ce que je fais
[Les étapes que Claude suit quand ce skill est actif]

## Format de sortie attendu
[Comment structurer la réponse]

## Exemples
[Optionnel mais très utile pour aligner le comportement]`,
        },
        {
          type: 'list',
          style: 'bullet',
          items: [
            'Skill "on-demand" : invoqué avec /nom-du-skill — tu l\'appelles quand tu en as besoin',
            'Instructions CLAUDE.md : toujours actives — pour les règles permanentes du projet',
            'Installation : place ton skill dans .claude/skills/ (projet) ou ~/.claude/skills/ (global)',
          ],
        },
        { type: 'checklist', items: ['Structure SKILL.md comprise'] },
      ],
    },

    {
      id: '5.9',
      title: 'Les 12 Skills Buildrs',
      duration: '10 min',
      blocks: [
        { type: 'ob-gate', obType: 'code', title: 'Claude Code by Buildrs', price: '37€' },
        { type: 'text', text: 'Les 12 skills que l\'équipe Buildrs utilise au quotidien. Chacun est testé, affiné, documenté. Tu les installes en 1 commande via le plugin Superpowers.' },
        {
          type: 'diagram-cards',
          cards: [
            { title: 'brainstorming',         badge: '/brainstorming',         desc: 'Idéation et exploration de marché. Étapes 2-3.' },
            { title: 'writing-plans',          badge: '/writing-plans',         desc: 'Planification technique structurée. Étape 5.' },
            { title: 'executing-plans',        badge: '/executing-plans',       desc: 'Exécution pas à pas d\'un plan. Étapes 7-8.' },
            { title: 'code-reviewer',          badge: '/code-reviewer',         desc: 'Revue de code et détection de bugs. Étape 8.' },
            { title: 'code-architect',         badge: '/code-architect',        desc: 'Architecture d\'un SaaS complet. Étape 7.' },
            { title: 'code-explorer',          badge: '/code-explorer',         desc: 'Navigation et compréhension de codebase. Étape 8.' },
            { title: 'debugging',              badge: '/debugging',             desc: 'Résolution de bugs step by step. Étape 8.' },
            { title: 'react-best-practices',   badge: '/react-best-practices',  desc: 'Standards React / TypeScript / UI. Étape 8.' },
            { title: 'commit',                 badge: '/commit',                desc: 'Commits Git clairs et structurés. Étape 8.' },
            { title: 'frontend-design',        badge: '/frontend-design',       desc: 'Bonnes pratiques UI/UX. Étape 6.' },
            { title: 'deployment',             badge: '/deployment',            desc: 'Déploiement Vercel avec vérifications. Étape 9.' },
            { title: 'supabase',               badge: '/supabase',              desc: 'Expert Supabase — schéma, RLS, Edge Functions. Étapes 7-8.' },
          ],
        },
        {
          type: 'template',
          title: 'Installer tous les skills Buildrs',
          language: 'bash',
          content: `# Le plugin Superpowers installe les 12 skills d'un coup
claude plugin install superpowers

# Vérifier l'installation
claude plugin list

# Utiliser un skill
/code-reviewer  # dans une session Claude Code`,
        },
        { type: 'checklist', items: ['Skills Buildrs installés'] },
      ],
    },

    {
      id: '5.10',
      title: 'Les Plugins',
      duration: '5 min',
      blocks: [
        { type: 'ob-gate', obType: 'code', title: 'Claude Code by Buildrs', price: '37€' },
        { type: 'text', text: 'Les Plugins, c\'est des packs de skills. Au lieu d\'installer les skills un par un, tu installes un plugin et tu as tout d\'un coup. Superpowers est notre plugin de référence — 12 skills d\'un coup.' },
        {
          type: 'template',
          title: 'Commandes plugins',
          language: 'bash',
          content: `# Marketplace
claude plugin marketplace

# Installer un plugin
claude plugin install superpowers

# Mettre à jour
claude plugin update superpowers

# Lister les plugins installés
claude plugin list`,
        },
        { type: 'checklist', items: ['Plugins configurés'] },
      ],
    },

    {
      id: '5.11',
      title: 'Les Sub-agents parallèles',
      duration: '5 min',
      blocks: [
        { type: 'ob-gate', obType: 'code', title: 'Claude Code by Buildrs', price: '37€' },
        { type: 'text', text: 'Au lieu de faire les tâches 1 par 1, Claude lance plusieurs agents en parallèle. Tu lui demandes de construire 3 composants React — au lieu de les faire en séquence, il les fait simultanément. 3x plus rapide.' },
        {
          type: 'callout',
          variant: 'tip',
          title: 'Quand utiliser les sub-agents',
          text: 'Tâches INDÉPENDANTES uniquement. 3 composants visuels sans dépendances = parfait pour les sub-agents. Une feature avec une BDD + un frontend + des emails = séquentiel car les étapes dépendent les unes des autres.',
        },
        {
          type: 'prompt',
          title: 'Prompt pour déclencher des sub-agents',
          copyable: true,
          text: `Crée ces 3 composants React en parallèle. Ils sont indépendants l'un de l'autre :

1. /src/components/ui/PricingCard.tsx
   - Props : plan (string), price (number), features (string[]), isPopular (boolean)
   - Style : Tailwind, design clean avec border-radius

2. /src/components/ui/TestimonialCard.tsx
   - Props : name (string), role (string), text (string), avatar (string)
   - Style : Tailwind, fond secondaire, quote icon

3. /src/components/ui/StatBadge.tsx
   - Props : value (string | number), label (string), trend? ('up' | 'down')
   - Style : Tailwind, couleur conditionnelle selon trend

Lance 3 sub-agents en parallèle pour les créer simultanément.`,
        },
        { type: 'checklist', items: ['Sub-agents compris'] },
      ],
    },

    {
      id: '5.12',
      title: 'MCP Servers pour Claude Code',
      duration: '5 min',
      blocks: [
        { type: 'ob-gate', obType: 'code', title: 'Claude Code by Buildrs', price: '37€' },
        { type: 'text', text: 'Les MCPs dans Claude Code se configurent dans le fichier settings.json. La console MCP du Module 4 te donne le template complet.' },
        {
          type: 'template',
          title: 'Config MCP complète Buildrs (.claude/settings.json)',
          language: 'json',
          content: `{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp@latest"]
    },
    "supabase": {
      "command": "npx",
      "args": [
        "-y", "@supabase/mcp-server-supabase@latest",
        "--project-ref", "[TON_PROJECT_REF]",
        "--access-token", "[TON_SUPABASE_ACCESS_TOKEN]"
      ]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "[TON_GITHUB_TOKEN]"
      }
    }
  }
}`,
        },
        { type: 'checklist', items: ['MCPs configurés dans Claude Code'] },
      ],
    },

    {
      id: '5.13',
      title: 'Économie de tokens avancée',
      duration: '8 min',
      blocks: [
        { type: 'ob-gate', obType: 'code', title: 'Claude Code by Buildrs', price: '37€' },
        {
          type: 'list',
          style: 'bullet',
          items: [
            '/compact — compresser le contexte quand la fenêtre sature (garde l\'essentiel, retire la verbosité)',
            'CLAUDE.md léger — sous 200 lignes. Ce qui est dans les skills n\'a pas besoin d\'être dans le CLAUDE.md',
            'Conversations courtes — nouvelle session plutôt que thread infini. 1 session = 1 feature.',
            'Sub-agents pour protéger le contexte principal — le contexte de chaque sub-agent est séparé',
            'Modèle adapté : Haiku pour les tâches simples, Sonnet pour le dev, Opus pour l\'architecture',
            'Hooks pour automatiser sans tokens : formatting, lint, TypeScript check',
          ],
        },
        {
          type: 'callout',
          variant: 'buildrs',
          title: 'Notre règle des 80/20',
          text: '80% de nos tokens vont sur Claude Code avec Sonnet. 20% sur Opus pour les sessions d\'architecture importantes. On n\'utilise Haiku que pour les agents automatisés. /plan + sous-agents = -40% de tokens sur les grosses features.',
        },
        { type: 'checklist', items: ['Stratégie tokens en place'] },
      ],
    },

    {
      id: '5.14',
      title: 'Le workflow Build complet Buildrs',
      duration: '8 min',
      blocks: [
        { type: 'ob-gate', obType: 'code', title: 'Claude Code by Buildrs', price: '37€' },
        { type: 'text', text: 'De l\'init au deploy — le workflow complet de l\'équipe Buildrs. Tu peux le coller dans ton CLAUDE.md comme référence.' },
        {
          type: 'list',
          style: 'numbered',
          items: [
            'Crée le repo GitHub + clone local',
            '/init — Claude génère un CLAUDE.md adapté à ton projet',
            'Installe les MCPs : claude mcp add context7 ... && claude mcp add supabase ...',
            '/plan — planifier l\'architecture complète avant de coder la première ligne',
            'Build par composants — sous-agents pour les éléments indépendants',
            '/review — code review automatique avant chaque commit',
            '/commit — commits structurés et clairs',
            'Tests manuels + corrections avec /debugging si besoin',
            'vercel --prod ou /deployment — déploiement Vercel avec vérifications',
          ],
        },
        { type: 'checklist', items: ['Workflow build complet maîtrisé'] },
      ],
    },
  ],
}

// ─────────────────────────────────────────────────────────────────
// MODULE 6 — CLAUDE COWORK (OB Cowork)
// ─────────────────────────────────────────────────────────────────

const MODULE_6: ClaudeModule = {
  id: 'claude-6',
  title: 'Claude Cowork',
  subtitle: 'Claude travaille pour toi même quand tu n\'es pas là.',
  etapeLabel: 'Étapes 8-9-10 — Automatiser',
  frameworkSteps: [8, 9, 10],
  duration: '40 min',
  isBonus: true,
  obType: 'cowork',
  lessons: [
    {
      id: '6.1',
      title: 'C\'est quoi Cowork',
      duration: '5 min',
      blocks: [
        { type: 'text', text: 'Cowork, c\'est l\'agent desktop. Il peut créer des fichiers, exécuter du code, naviguer le web, travailler sur des tâches longues — sur ton ordinateur, pendant que tu fais autre chose. La limite : ton ordi doit être allumé et l\'app ouverte.' },
        {
          type: 'diagram-cards',
          cards: [
            { title: 'Claude Chat',  badge: 'Conversation',   desc: 'Répond à tes questions. Génère du contenu. Limité à la conversation.' },
            { title: 'Claude Code',  badge: 'Dev sur fichiers', desc: 'Lit et modifie tes fichiers. Pour construire ton SaaS.' },
            { title: 'Cowork',       badge: 'Automation',      desc: 'Travaille en autonomie sur ton PC. Tâches longues, multi-étapes, répétitives.' },
          ],
        },
        {
          type: 'callout',
          variant: 'buildrs',
          title: 'Chez Buildrs',
          text: '10% de notre temps Claude = Cowork. Ça représente 10h/semaine économisées : triage inbox du matin, rapport MRR hebdo, veille concurrents automatisée. Ces tâches tournent pendant qu\'on code ou qu\'on dort.',
        },
        { type: 'checklist', items: ['Cowork compris'] },
      ],
    },

    {
      id: '6.2',
      title: 'Projets Cowork + mémoire persistante',
      duration: '8 min',
      blocks: [
        { type: 'text', text: 'Un Projet Cowork est différent d\'un Projet Chat. Il a une mémoire persistante qui survit entre les sessions, un dossier local associé, et peut avoir des tâches planifiées.' },
        {
          type: 'list',
          style: 'numbered',
          items: [
            'Ouvre Claude Desktop',
            'Onglet "Cowork" (en bas)',
            '"+ New Project"',
            'Connecte un dossier local (ton repo ou un dossier de travail)',
            'Rédige les instructions du projet Cowork (template ci-dessous)',
          ],
        },
        {
          type: 'template',
          title: 'Template instructions Projet Cowork Buildrs',
          language: 'text',
          content: `PROJET COWORK — [nom]
DOSSIER : [chemin vers le dossier local]

MISSION
[Ce que ce projet Cowork fait en autonomie]

RÈGLES DE SÉCURITÉ
- Ne jamais supprimer un fichier sans le mentionner d'abord
- Ne jamais envoyer d'email sans confirmation explicite
- Ne jamais accéder à des dossiers hors de [dossier autorisé]
- Si en doute : demander avant d'agir

TÂCHES RÉCURRENTES
[Liste des tâches que tu veux automatiser]

FORMAT DE RAPPORT
[Comment rapporter les résultats à chaque session]`,
        },
        { type: 'checklist', items: ['Premier projet Cowork créé'] },
      ],
    },

    // Gate OB Cowork pour les leçons 6.3+
    {
      id: '6.3',
      title: 'Dispatch mobile (BONUS)',
      duration: '10 min',
      blocks: [
        { type: 'ob-gate', obType: 'cowork', title: 'Claude Cowork by Buildrs', price: '37€' },
        {
          type: 'callout',
          variant: 'buildrs',
          title: 'Le bonus Cowork le plus puissant',
          text: 'Dispatch = la télécommande mobile pour Cowork. Tu envoies des tâches depuis ton téléphone via Discord ou Telegram, Cowork les exécute sur ton ordi. Tu es en déplacement — tu envoies "Prépare le brief pour la réunion de 14h" — Cowork te prépare ça pendant le trajet.',
        },
        { type: 'heading', level: 3, text: 'Configuration Discord' },
        {
          type: 'list',
          style: 'numbered',
          items: [
            'Crée un bot Discord sur discord.com/developers/applications',
            'Copie le token du bot',
            'Dans Claude Cowork : Settings → Plugins → Discord → Colle le token',
            'Scan le QR code pour le pairing',
            'Configure l\'allowlist (ton user ID uniquement — sécurité)',
            'Test : envoie "hello" dans ton canal Discord → Cowork répond',
          ],
        },
        { type: 'heading', level: 3, text: 'Cas d\'usage Buildrs' },
        {
          type: 'list',
          style: 'bullet',
          items: [
            'Depuis le mobile le matin : "Fais le triage de ma boîte mail et résume les urgences"',
            'Depuis le métro : "Prépare un résumé des ventes de la semaine depuis Stripe"',
            'En déplacement : "Analyse les derniers tickets de support et identifie les patterns"',
          ],
        },
        { type: 'checklist', items: ['Dispatch configuré (Discord ou Telegram)'] },
      ],
    },

    {
      id: '6.4',
      title: 'Tâches planifiées',
      duration: '5 min',
      blocks: [
        { type: 'ob-gate', obType: 'cowork', title: 'Claude Cowork by Buildrs', price: '37€' },
        { type: 'text', text: 'Cowork peut exécuter des tâches automatiquement selon un schedule — chaque lundi matin, chaque vendredi à 18h, chaque jour à 8h. Ton ordi doit être allumé et l\'app ouverte au moment de l\'exécution.' },
        {
          type: 'diagram-cards',
          cards: [
            { title: 'Rapport MRR hebdo',  badge: 'Chaque lundi', desc: 'Cowork récupère les données Stripe, calcule le MRR, génère un résumé et l\'enregistre.' },
            { title: 'Veille concurrents', badge: 'Chaque vendredi', desc: 'Analyse les LP et changelogs de 5 concurrents, note les changements.' },
            { title: 'Triage inbox',       badge: 'Chaque matin',  desc: 'Lit les emails, catégorise, marque les urgences, draft les réponses.' },
          ],
        },
        { type: 'checklist', items: ['Première tâche planifiée créée'] },
      ],
    },

    {
      id: '6.5',
      title: 'Computer Use',
      duration: '5 min',
      blocks: [
        { type: 'ob-gate', obType: 'cowork', title: 'Claude Cowork by Buildrs', price: '37€' },
        { type: 'text', text: 'Computer Use, c\'est Cowork qui prend le contrôle de ton écran : il clique, remplit des formulaires, navigue dans n\'importe quelle app comme si c\'était toi.' },
        {
          type: 'list',
          style: 'bullet',
          items: [
            'Remplir un formulaire administratif complexe',
            'Tester le parcours utilisateur de ton propre SaaS',
            'Naviguer dans un dashboard (Stripe, Supabase) pour extraire des données',
            'Poster du contenu sur des plateformes sans API',
          ],
        },
        {
          type: 'callout',
          variant: 'tip',
          title: 'Toujours superviser',
          text: 'Pour Computer Use, reste dans la pièce les premières fois. C\'est puissant mais il peut faire des erreurs sur des interfaces complexes. Définis des règles de sécurité claires dans les instructions du projet.',
        },
        { type: 'checklist', items: ['Computer Use testé'] },
      ],
    },

    {
      id: '6.6',
      title: 'Les 5 Workflows Buildrs',
      duration: '10 min',
      blocks: [
        { type: 'ob-gate', obType: 'cowork', title: 'Claude Cowork by Buildrs', price: '37€' },
        { type: 'text', text: 'Les 5 workflows Cowork que l\'équipe Buildrs utilise le plus. Chacun est un template d\'instructions Cowork prêt à copier.' },
        {
          type: 'diagram-cards',
          cards: [
            { title: 'Lancer un SaaS IA',         badge: '8 étapes',  desc: 'Du brief produit au déploiement — orchestré par Cowork.' },
            { title: 'Rédiger une landing page',   badge: '6 étapes',  desc: 'Copywriting + structure + CTA + variantes.' },
            { title: 'Debugger en production',     badge: '5 étapes',  desc: 'Analyser les logs, identifier, corriger, déployer.' },
            { title: 'Architecture BDD Supabase',  badge: '4 étapes',  desc: 'Schema + migrations + RLS + Edge Functions.' },
            { title: 'Créer un agent autonome',    badge: '7 étapes',  desc: 'Agent avec mémoire, outils, handoff et monitoring.' },
          ],
        },
        { type: 'checklist', items: ['Au moins 1 workflow testé'] },
      ],
    },

    {
      id: '6.7',
      title: 'Bonnes pratiques et sécurité',
      duration: '5 min',
      blocks: [
        { type: 'ob-gate', obType: 'cowork', title: 'Claude Cowork by Buildrs', price: '37€' },
        {
          type: 'list',
          style: 'bullet',
          items: [
            'Instructions globales : "jamais supprimer sans confirmation" — toujours dans les instructions projet',
            'Isolation : plusieurs projets Cowork peuvent tourner simultanément sans interférence',
            'Allowlist Dispatch : uniquement ton user ID dans l\'allowlist — jamais plus',
            'Secrets : utilise des variables d\'environnement — jamais écrire une clé API dans les instructions',
            'Test d\'abord : teste chaque nouveau workflow en supervision avant de le planifier',
          ],
        },
        { type: 'checklist', items: ['Règles de sécurité en place'] },
      ],
    },
  ],
}

// ─────────────────────────────────────────────────────────────────
// MODULE 7 — LA RECETTE COMPLETE
// ─────────────────────────────────────────────────────────────────

const MODULE_7: ClaudeModule = {
  id: 'claude-7',
  title: 'La Recette Complète',
  subtitle: 'Les 10 étapes de A à Z avec Claude comme moteur.',
  etapeLabel: 'Les 10 étapes',
  frameworkSteps: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  duration: '30 min',
  lessons: [
    {
      id: '7.1',
      title: 'Le framework Buildrs (diagramme complet)',
      duration: '8 min',
      blocks: [
        {
          type: 'diagram-cards',
          cards: [
            { title: 'Étape 1 — Config',          badge: 'Module 1', desc: 'Claude + VS Code + Whispr Flow + Notion. Outils en place, mémoire initialisée.' },
            { title: 'Étape 2 — Idée',             badge: 'Module 3', desc: 'Deep Research + Artifacts + Product Hunt. L\'idée validée par des données.' },
            { title: 'Étape 3 — Validation',       badge: 'Module 3', desc: 'Analyse concurrentielle, taille de marché, premier oui payant.' },
            { title: 'Étape 4 — Monétisation',     badge: 'Module 2', desc: 'Model pricing, projet "Business Core" + KB stratégie.' },
            { title: 'Étape 5 — Fiche produit',    badge: 'Module 3', desc: 'Artifacts pour les specs visuelles. Prompt "Architecte" pour les specs techniques.' },
            { title: 'Étape 6 — Design',           badge: 'Module 3', desc: 'Artifacts React + 21st.dev MCP + Mobbin pour l\'inspiration.' },
            { title: 'Étape 7 — Architecture',     badge: 'Module 4-5', desc: 'Context7 + Supabase MCP. CLAUDE.md + /plan pour le schéma BDD.' },
            { title: 'Étape 8 — Build',            badge: 'Module 5', desc: 'Claude Code + Skills + Sub-agents. Workflow Explore → Plan → Code → Commit.' },
            { title: 'Étape 9 — Deploy',           badge: 'Module 5-6', desc: 'Vercel MCP + Stripe + /deployment skill. Go live en moins d\'1h.' },
            { title: 'Étape 10 — Analytics',       badge: 'Module 6', desc: 'Cowork pour les rapports automatiques. PostHog + GA4 + Claude Research.' },
          ],
        },
        { type: 'checklist', items: ['Framework complet compris'] },
      ],
    },

    {
      id: '7.2',
      title: 'Matrice étape → outil → ressource',
      duration: '5 min',
      blocks: [
        {
          type: 'text',
          text: 'La matrice complète : pour chaque étape du framework, quel mode Claude utiliser, quel modèle, quels MCPs, quels skills.',
        },
        {
          type: 'diagram-cards',
          cards: [
            { title: 'Étapes 1-3',   badge: 'Mode Chat + Opus', desc: 'Deep Research, Artifacts. Pas de MCP nécessaire. Skills : brainstorming.' },
            { title: 'Étapes 4-5',   badge: 'Mode Chat + Sonnet', desc: 'Projets Claude + KB. Skills : writing-plans.' },
            { title: 'Étape 6',      badge: 'Mode Chat + Code', desc: 'Artifacts React + 21st.dev MCP. Skills : frontend-design.' },
            { title: 'Étapes 7-8',   badge: 'Mode Code + Sonnet', desc: 'Context7 + Supabase + GitHub MCP. Skills : code-architect, code-reviewer, debugging.' },
            { title: 'Étape 9',      badge: 'Mode Code + Cowork', desc: 'Vercel + Stripe MCP. Skills : deployment, commit.' },
            { title: 'Étape 10',     badge: 'Mode Cowork + Haiku', desc: 'Tâches planifiées. Stripe MCP. Skills : pas nécessaire — automation.' },
          ],
        },
        { type: 'checklist', items: ['Matrice consultée'] },
      ],
    },

    {
      id: '7.3',
      title: 'Les prompts système parfaits',
      duration: '5 min',
      blocks: [
        {
          type: 'text',
          text: 'Les prompts système sont les instructions permanentes d\'un Projet Claude. Tu les rédiges une fois — ils s\'appliquent à toutes les conversations du projet. Voici les prompts système Buildrs pour les étapes clés.',
        },
        {
          type: 'prompt',
          title: 'Prompt système — Projet Business Core (Étapes 2-4)',
          copyable: true,
          text: `Tu es mon stratège business. Tu connais tout de mon projet : [description].

Ton rôle dans ce projet :
- M'aider à trouver et valider des opportunités de marché
- Analyser la concurrence et détecter les gaps
- Structurer ma stratégie de monétisation
- Challenger mes hypothèses (sois honnête, même si c'est inconfortable)

Ce que tu sais sur mon business :
- Profil : [ton background]
- Objectif : [ton objectif 90 jours]
- Contraintes : [temps disponible, budget, compétences]

Format de réponse :
- Direct, sans détour
- Recommandations concrètes avec raisons
- Si tu vois un risque majeur, mets-le en premier`,
        },
        {
          type: 'prompt',
          title: 'Prompt système — Projet Dev Produit (Étapes 7-8)',
          copyable: true,
          text: `Tu es mon senior developer sur le projet [nom du SaaS].

Stack : React + TypeScript + Supabase + Vercel + Stripe
Architecture : voir STACK.md dans la KB

Règles de développement :
- TypeScript strict — aucun any implicite
- Composants fonctionnels React avec hooks
- Tailwind CSS uniquement pour le styling
- Variables d'environnement pour les secrets

Avant de coder :
1. Explore la structure existante
2. Planifie avec /plan
3. Code proprement
4. Review avec /code-reviewer avant de commit

Ce que tu évites :
- Over-engineering sur un MVP
- Ajouter des dépendances inutiles
- Modifier des fichiers hors scope de la tâche`,
        },
        { type: 'checklist', items: ['Prompts système sauvegardés dans les projets'] },
      ],
    },

    {
      id: '7.4',
      title: 'Les 5 modèles de monétisation avec Claude',
      duration: '5 min',
      blocks: [
        {
          type: 'diagram-cards',
          cards: [
            { title: 'SaaS / Micro-SaaS',     badge: 'MRR récurrent',  desc: 'Abonnements mensuels. Claude construit le produit en 72h, tu le monétises à vie.' },
            { title: 'Services augmentés',    badge: 'x3 capacité',    desc: 'Tu es freelance — Claude te permet de livrer 3x plus vite et de prendre 3x plus de clients.' },
            { title: 'Contenu IA',            badge: '3-4 contenus/j', desc: 'Claude génère le contenu structuré, tu valides et publies. Personal brand à grande échelle.' },
            { title: 'Produits digitaux',     badge: 'Passif',         desc: 'Ebooks, templates, kits, cours. Claude génère les premiers drafts.' },
            { title: 'Agents IA',             badge: '500-2000€/agent',desc: 'Tu construis des agents sur mesure pour des entreprises avec Claude Code.' },
          ],
        },
        { type: 'checklist', items: ['Modèle de monétisation identifié'] },
      ],
    },

    {
      id: '7.5',
      title: 'Le stack complet Buildrs',
      duration: '3 min',
      blocks: [
        {
          type: 'diagram-cards',
          cards: [
            { title: 'Claude',      badge: 'IA moteur',     desc: 'Pro ou Max. Le cerveau de tout — réflexion, code, contenu, automation.' },
            { title: 'React',       badge: 'Frontend',      desc: 'TypeScript + Vite + Tailwind. La stack frontend la plus répandue des SaaS IA.' },
            { title: 'Supabase',    badge: 'Backend',       desc: 'PostgreSQL + Auth + Edge Functions. Tout-en-un pour le backend sans ops.' },
            { title: 'Vercel',      badge: 'Déploiement',   desc: 'CI/CD automatique sur GitHub push. Preview URLs + prod en 1 commande.' },
            { title: 'Stripe',      badge: 'Paiements',     desc: 'Checkout, subscriptions, webhooks. Le standard incontournable.' },
            { title: 'Resend',      badge: 'Emails',        desc: 'Transactionnel et marketing. API simple, delivrability excellente.' },
          ],
        },
        { type: 'checklist', items: ['Stack compris'] },
      ],
    },

    {
      id: '7.6',
      title: 'Plan d\'action 7 jours',
      duration: '5 min',
      blocks: [
        {
          type: 'list',
          style: 'numbered',
          items: [
            'Jour 1 — Module 1 complet : Claude installé, configuré, mémoire initialisée',
            'Jour 2 — Module 2 : 2 projets Claude créés (Business Core + Dev Produit)',
            'Jour 3 — Module 3 : Deep Research sur ton idée, prompts framework testés',
            'Jour 4 — Module 4 : Context7 + Supabase MCP installés, connecteurs activés',
            'Jour 5 — Premier build : lance Claude Code sur un projet réel (même petit)',
            'Jour 6 — Landing page : génère la LP de ton SaaS avec Claude Artifacts',
            'Jour 7 — Lancer. Pas "préparer". Lancer. Même si c\'est imparfait.',
          ],
        },
        {
          type: 'callout',
          variant: 'buildrs',
          title: 'Le jour 7 c\'est le plus important',
          text: '"Lancer" ne veut pas dire que le produit est fini. Ça veut dire qu\'une page existe avec un moyen de payer. Le reste arrive après. Les gens qui préparent pendant 3 mois avant de lancer n\'obtiennent pas de feedback. Ceux qui lancent en 7 jours, si.',
        },
        { type: 'checklist', items: ['Plan d\'action défini'] },
      ],
    },

    {
      id: '7.7',
      title: 'La suite Buildrs',
      duration: '3 min',
      blocks: [
        {
          type: 'text',
          text: 'L\'environnement que tu viens de configurer est la fondation de tout. Sans lui, les étapes suivantes sont 10x moins efficaces. Avec lui, tu es prêt pour la suite.',
        },
        {
          type: 'diagram-cards',
          cards: [
            { title: 'Pack Agents IA',   badge: '197€', desc: '5 agents spécialisés (Planner, Designer, Architect, Builder, Launcher). Déjà dans ton dashboard.' },
            { title: 'Sprint 72h',       badge: '497€', desc: 'Ton MVP livré par l\'équipe Buildrs en 72h. Appel de cadrage + DA + code + landing.' },
            { title: 'Cohorte 60j',      badge: '1 497€', desc: '60 jours d\'accompagnement. 4 sessions live/semaine. 12 places max. Garantie 1k€/mois.' },
          ],
        },
        {
          type: 'callout',
          variant: 'framework',
          title: 'Tu as la fondation',
          text: 'Module 1-4 = ton environnement. Module 5-6 = tes super-pouvoirs. Module 7 = ta vision. Maintenant : exécuter. La prochaine ligne de code que tu écris avec Claude est la première ligne de ton produit.',
        },
        { type: 'checklist', items: ['Prochaine étape identifiée'] },
      ],
    },
  ],
}

// ─────────────────────────────────────────────────────────────────
// Export — Curriculum complet
// ─────────────────────────────────────────────────────────────────

export const CLAUDE_CURRICULUM: ClaudeModule[] = [
  MODULE_1,
  MODULE_2,
  MODULE_3,
  MODULE_4,
  MODULE_5,
  MODULE_6,
  MODULE_7,
]

export const getClaudeModule = (id: string) => CLAUDE_CURRICULUM.find(m => m.id === id)

export const getClaudeLesson = (modId: string, lessonId: string) =>
  getClaudeModule(modId)?.lessons.find(l => l.id === lessonId)

export const getClaudeNextLesson = (modId: string, lessonId: string) => {
  const mod = getClaudeModule(modId)
  if (!mod) return null
  const idx = mod.lessons.findIndex(l => l.id === lessonId)
  if (idx === -1 || idx === mod.lessons.length - 1) {
    // Dernier module ?
    const modIdx = CLAUDE_CURRICULUM.findIndex(m => m.id === modId)
    if (modIdx === CLAUDE_CURRICULUM.length - 1) return null
    return { modId: CLAUDE_CURRICULUM[modIdx + 1].id, lessonId: CLAUDE_CURRICULUM[modIdx + 1].lessons[0].id }
  }
  return { modId, lessonId: mod.lessons[idx + 1].id }
}

export const getClaudePrevLesson = (modId: string, lessonId: string) => {
  const mod = getClaudeModule(modId)
  if (!mod) return null
  const idx = mod.lessons.findIndex(l => l.id === lessonId)
  if (idx <= 0) {
    const modIdx = CLAUDE_CURRICULUM.findIndex(m => m.id === modId)
    if (modIdx === 0) return null
    const prevMod = CLAUDE_CURRICULUM[modIdx - 1]
    return { modId: prevMod.id, lessonId: prevMod.lessons[prevMod.lessons.length - 1].id }
  }
  return { modId, lessonId: mod.lessons[idx - 1].id }
}
