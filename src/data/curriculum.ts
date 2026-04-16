export interface Prompt {
  label: string
  content: string
}

// ── Rich content blocks ───────────────────────────────────────────────────────
export type ContentBlock =
  | { type: 'text'; content: string }
  | { type: 'heading'; level: 2 | 3; content: string }
  | { type: 'divider' }
  | { type: 'callout'; variant?: 'tip' | 'info' | 'action'; title?: string; content: string }
  | { type: 'prompt'; label: string; content: string }
  | { type: 'checklist'; title?: string; items: string[] }
  | { type: 'list'; title?: string; style: 'cards' | 'bullets'; items: Array<{ icon?: string; label: string; desc?: string; accent?: string }> }
  | { type: 'glossary'; categories: Array<{ title: string; items: Array<{ term: string; def: string }> }> }
  | { type: 'diagram-flow'; title?: string; steps: Array<{ label: string; sub?: string; color?: string }> }
  | { type: 'diagram-cards'; title?: string; items: Array<{ icon: string; label: string; desc: string; color?: string }> }
  | { type: 'quiz-inline'; question: string; options: string[]; correctIndex: number; explanation: string; reflective?: boolean; reflections?: string[] }
  | { type: 'links'; title?: string; items: Array<{ label: string; url: string; desc: string; icon?: string; tag?: string }> }
  | { type: 'template'; title?: string; sections: Array<{ label: string; icon?: string; fields: Array<{ name: string; placeholder: string; example?: string }> }> }
  | { type: 'cal-booking'; title?: string; subtitle?: string; calUrl: string }
  | { type: 'cohorte-cta'; title?: string; description?: string; price?: string; features?: string[] }

export interface Lesson {
  id: string
  title: string
  duration: string
  body: string[]
  blocks?: ContentBlock[]
  prompts?: Prompt[]
  checklist?: string[]
}

export interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctIndex: number
  explanation: string
}

export interface Module {
  id: string
  title: string
  description: string
  icon: string
  lessons: Lesson[]
  quizQuestions?: QuizQuestion[]
}

export const CURRICULUM: Module[] = [
  {
    id: '00',
    title: 'Fondations',
    description: 'Comprendre pourquoi tu es au bon endroit, au bon moment.',
    icon: 'Layers',
    lessons: [
      {
        id: '0.1',
        title: 'Bienvenue dans Buildrs Blueprint',
        duration: '3 min',
        body: [],
        blocks: [
          { type: 'text', content: "Tu viens de prendre la meilleure décision de ta semaine. Dans les 72 prochaines heures, tu vas construire quelque chose de concret — un produit digital qui peut te rapporter tes premiers euros dès ce mois-ci." },
          { type: 'text', content: "Ce dashboard est ton système opérationnel. Chaque module = une étape. Chaque leçon = une action concrète à réaliser. Pas de théorie inutile, pas de blabla — on va droit au but, avec les bons outils." },
          { type: 'diagram-cards', title: 'Ton arsenal technologique', items: [
            { icon: 'brain',        label: 'Claude Code',  desc: "L'IA qui construit ton produit ligne par ligne.",       color: '#cc5de8' },
            { icon: 'database',     label: 'Supabase',     desc: 'Base de données, auth et API en temps réel.',           color: '#4d96ff' },
            { icon: 'credit-card',  label: 'Stripe',       desc: 'Paiements en ligne sans friction.',                     color: '#22c55e' },
            { icon: 'cloud',        label: 'Vercel',       desc: 'Déploiement instantané, 0 configuration.',              color: '#71717a' },
            { icon: 'mail',         label: 'Resend',       desc: 'Emails transactionnels modernes et fiables.',           color: '#4d96ff' },
            { icon: 'git-branch',   label: 'GitHub',       desc: 'Versioning et sauvegarde de tout ton code.',            color: '#eab308' },
          ]},
          { type: 'text', content: "Comment utiliser ce dashboard : commence par le Module 00 pour poser les fondations mentales. Ensuite, chaque module est une phase concrète de ton sprint. Les leçons se débloquent progressivement — avance à ton rythme, coche ce que tu fais, et utilise les prompts directement dans Claude." },
          { type: 'checklist', title: 'Tes premiers pas', items: [
            "Explorer le dashboard — navigation, modules, outils",
            "Rejoindre le canal WhatsApp Buildrs (lien dans la sidebar)",
            "Choisir ta stratégie de départ (Module 0.6)",
            "Définir ton objectif de monétisation (Module 0.7)",
          ]},
        ],
      },
      {
        id: '0.2',
        title: 'Pourquoi les micro-SaaS en 2026',
        duration: '5 min',
        body: [],
        blocks: [
          { type: 'text', content: "Un micro-SaaS = un petit logiciel en ligne que des gens paient chaque mois pour résoudre un problème précis. Pas d'entrepôt, pas d'employés, pas d'investisseurs. Juste toi, un ordinateur, et des clients qui paient automatiquement." },
          { type: 'text', content: "Ce qui a tout changé en 2026 : l'IA permet à une seule personne de construire ce qui nécessitait une équipe entière il y a 3 ans. Tu n'as plus besoin de savoir coder pour lancer un produit tech. Tu dois juste savoir diriger." },
          { type: 'diagram-cards', title: 'Pourquoi c\'est le meilleur business aujourd\'hui', items: [
            { icon: 'package',      label: 'Zéro stock',            desc: "Ton produit = du code. Aucun entrepôt, aucune logistique à gérer.",        color: '#22c55e' },
            { icon: 'globe',        label: 'Travail de partout',    desc: "Un ordinateur + internet = ton bureau complet, partout dans le monde.",     color: '#4d96ff' },
            { icon: 'refresh-cw',   label: 'Duplication infinie',   desc: "1 client ou 10 000 = le même code. Coût marginal supplémentaire : 0€.",     color: '#cc5de8' },
            { icon: 'trending-up',  label: 'Revenus récurrents',    desc: "Abonnements mensuels : l'argent arrive tous les 1er du mois, automatiquement.", color: '#22c55e' },
            { icon: 'zap',          label: 'Propulsé par l\'IA',    desc: "Tu construis avec Claude ce qui nécessitait 5 développeurs avant.",         color: '#eab308' },
            { icon: 'brain',        label: 'Optimisation continue', desc: "Lance, mesure, améliore. Pas besoin d'être parfait au départ.",             color: '#4d96ff' },
          ]},
          { type: 'callout', variant: 'tip', title: 'Le modèle économique en une phrase', content: "Tu construis une fois, tu optimises régulièrement, et tes clients paient chaque mois. C'est la définition du revenu passif à l'ère de l'IA." },
        ],
      },
      {
        id: '0.3',
        title: "C'est quoi le vibe coding ?",
        duration: '4 min',
        body: [],
        blocks: [
          { type: 'text', content: "Le vibe coding est une nouvelle façon de construire des produits digitaux : tu décris ce que tu veux construire en français naturel, et l'IA génère le code pour toi. Pas de syntaxe à mémoriser. Pas de Stack Overflow. Juste une conversation." },
          { type: 'text', content: "Ce n'est pas de la magie — c'est une compétence. La compétence de savoir décrire précisément ce qu'on veut, de décomposer un problème en petites étapes, et de guider l'IA vers le résultat souhaité." },
          { type: 'diagram-flow', title: 'Le processus vibe coding', steps: [
            { label: 'Tu imagines',      sub: "Une idée, un problème, une fonctionnalité à construire — même floue.", color: '#4d96ff' },
            { label: 'Tu décris',        sub: "Tu expliques à Claude en français ce que tu veux obtenir.", color: '#cc5de8' },
            { label: 'Claude construit', sub: "L'IA génère le code, les interfaces, la logique — en secondes.", color: '#eab308' },
            { label: 'Tu révises',       sub: "Tu testes dans le navigateur, tu ajustes, tu itères avec Claude.", color: '#4d96ff' },
            { label: 'Tu livres',        sub: "L'app est en ligne. Tes premiers utilisateurs peuvent l'utiliser.", color: '#22c55e' },
          ]},
          { type: 'text', content: "La différence fondamentale avec la programmation classique : un développeur pense en termes de code. Un vibecoder pense en termes de résultat utilisateur. L'un écrit des lignes de code, l'autre dirige un outil qui écrit les lignes à sa place." },
          { type: 'checklist', title: 'Le nouveau mindset à adopter', items: [
            "Je pense comme un chef de produit, pas comme un développeur",
            "Je décris le 'quoi' et le 'pourquoi' — Claude s'occupe du 'comment'",
            "Je teste vite plutôt que de chercher la perfection avant de lancer",
            "Chaque bug est une conversation : je décris le problème à Claude",
            "Je construis la feature minimale qui prouve que ça marche",
          ]},
        ],
      },
      {
        id: '0.4',
        title: "C'est quoi un product builder ?",
        duration: '3 min',
        body: [],
        blocks: [
          { type: 'text', content: "Un product builder, c'est quelqu'un qui sait transformer une idée en produit fonctionnel — sans forcément écrire une seule ligne de code lui-même. Ce n'est ni un développeur, ni un designer, ni un marketeur. C'est les trois à la fois, avec l'IA comme main d'œuvre." },
          { type: 'list', title: 'Les 4 compétences clés', style: 'cards', items: [
            { icon: 'lightbulb',    label: 'Vision produit',         desc: "Identifier un problème réel et imaginer la solution minimale qui le résout.",           accent: '#eab308' },
            { icon: 'brain',        label: 'Orchestration IA',       desc: "Savoir diriger Claude pour obtenir exactement ce qu'on veut construire.",               accent: '#cc5de8' },
            { icon: 'trending-up',  label: 'Compréhension marché',   desc: "Valider qu'il y a un marché avant de construire. Des gens paient-ils déjà pour ça ?",   accent: '#22c55e' },
            { icon: 'refresh-cw',   label: 'Itération rapide',       desc: "Lancer vite, mesurer, corriger. Pas attendre d'avoir tout parfait pour montrer.",       accent: '#4d96ff' },
          ]},
          { type: 'text', content: "C'est le profil le plus recherché en 2026. Les startups, les PME, et même les grandes entreprises cherchent des gens capables de construire des outils internes, des MVPs clients, des automatisations — sans mobiliser une équipe de développeurs." },
          { type: 'callout', variant: 'tip', title: 'À retenir', content: "Tu n'as pas besoin de savoir coder. Tu dois savoir diriger. La différence : un développeur pense en code, un product builder pense en valeur utilisateur. L'IA fait la traduction." },
        ],
      },
      {
        id: '0.5',
        title: 'Glossaire',
        duration: '8 min',
        body: [],
        blocks: [
          { type: 'text', content: "Tous les termes que tu vas croiser dans ce blueprint — et dans l'écosystème SaaS en général. Chaque définition tient en une phrase claire, sans jargon inutile." },
          { type: 'glossary', categories: [
            {
              title: 'Business SaaS',
              items: [
                { term: 'SaaS',          def: "Software as a Service — logiciel hébergé dans le cloud, accessible via navigateur, vendu par abonnement." },
                { term: 'Micro-SaaS',    def: "SaaS ciblé sur un seul problème précis, géré par 1 à 5 personnes, sans levée de fonds." },
                { term: 'MVP',           def: "Minimum Viable Product — version minimale qui résout le problème principal et peut être vendue dès aujourd'hui." },
                { term: 'MRR',           def: "Monthly Recurring Revenue — tes revenus abonnements récurrents par mois. 100 clients × 29€ = 2 900€ MRR." },
                { term: 'ARR',           def: "Annual Recurring Revenue — MRR × 12. Indicateur utilisé lors des levées de fonds et des ventes." },
                { term: 'Churn',         def: "Taux de résiliation mensuel. 5% de churn = 5% de tes abonnés qui annulent chaque mois." },
                { term: 'LTV',           def: "Lifetime Value — revenu total généré par un client sur toute sa durée d'abonnement. LTV = MRR ÷ churn." },
                { term: 'CAC',           def: "Customer Acquisition Cost — coût moyen pour acquérir un nouveau client (pub + temps + outils)." },
                { term: 'Valorisation',  def: "Valeur de revente estimée d'un SaaS. En général 2-4× ARR pour un SaaS stable, ou 30-50× MRR pour un micro-SaaS." },
                { term: 'Flip',          def: "Construire un SaaS, l'amener à un MRR stable, puis le revendre sur Flippa ou Acquire.com." },
                { term: 'B2B',           def: "Business to Business — tu vends à des entreprises ou professionnels. Panier plus élevé, churn plus faible." },
                { term: 'B2C',           def: "Business to Consumer — tu vends à des particuliers. Volume plus fort, tickets plus petits." },
              ],
            },
            {
              title: 'Produit & Stratégie',
              items: [
                { term: 'Product-Market Fit', def: "Quand ton produit répond exactement à un besoin réel du marché. Signe : les gens seraient déçus s'il disparaissait." },
                { term: 'Problème-Solution',  def: "Toujours partir d'un problème concret avant de construire. Pas d'idée sans douleur réelle derrière." },
                { term: 'Core Feature',       def: "La fonctionnalité principale qui justifie le paiement. Tout le reste est secondaire au lancement." },
                { term: 'User Flow',          def: "Le chemin qu'un utilisateur emprunte dans ton app, de l'inscription jusqu'à l'action clé." },
                { term: 'Onboarding',         def: "Process d'activation des nouveaux utilisateurs. Un bon onboarding = ils arrivent à la valeur en moins de 5 minutes." },
                { term: 'Pain Point',         def: "Point de douleur — le problème précis, récurrent et frustrant que ressent ton utilisateur cible." },
                { term: 'Brief produit',      def: "Document de référence décrivant le produit : problème, cible, features, stack, modèle de prix. Tu le donnes à Claude." },
              ],
            },
            {
              title: 'Stack technique',
              items: [
                { term: 'Front-end',    def: "La partie visible de l'app — interfaces, boutons, formulaires, pages. Ce que l'utilisateur voit et touche." },
                { term: 'Back-end',     def: "La partie invisible — serveur, base de données, logique métier. Ce qui tourne en coulisses." },
                { term: 'API',          def: "Application Programming Interface — pont de communication entre deux logiciels. Stripe utilise une API pour traiter les paiements." },
                { term: 'Base de données', def: "Où sont stockées toutes les données de ton app — utilisateurs, abonnements, contenu. Buildrs utilise Supabase (PostgreSQL)." },
                { term: 'Auth',         def: "Système d'authentification — inscription, connexion, gestion des sessions et des permissions." },
                { term: 'Edge Function',def: "Fonction serveur qui s'exécute dans le cloud, proche de l'utilisateur. Utilisée pour la logique sensible (paiements, IA)." },
                { term: 'Webhook',      def: "Notification automatique envoyée par un service tiers (ex: Stripe te prévient quand un paiement réussit)." },
                { term: 'Deploy',       def: "Rendre ton app accessible en ligne. Sur Vercel : push sur GitHub → deploy automatique en moins de 30 secondes." },
                { term: 'Stack',        def: "L'ensemble des technologies utilisées pour construire ton produit. Ex: React + Supabase + Stripe + Vercel." },
                { term: 'Repo',         def: "Repository — ton dossier de code versionné sur GitHub. C'est la sauvegarde et l'historique de tout ton projet." },
                { term: 'Env vars',     def: "Variables d'environnement — clés secrètes de ton app (API keys, mots de passe). Jamais dans le code, toujours dans les settings." },
                { term: 'RLS',          def: "Row Level Security — système de Supabase qui sécurise les données : chaque utilisateur ne voit que ses propres données." },
              ],
            },
            {
              title: 'IA & Agents',
              items: [
                { term: 'LLM',               def: "Large Language Model — modèle d'IA entraîné sur des milliards de textes. Claude, GPT, Gemini sont des LLMs." },
                { term: 'IA générative',     def: "IA capable de créer du contenu nouveau — texte, code, images, vidéo — à partir d'une instruction." },
                { term: 'Prompt',            def: "Instruction donnée à l'IA pour obtenir un résultat précis. La qualité du prompt détermine la qualité de la réponse." },
                { term: 'Agent autonome',    def: "IA qui exécute une série d'actions de façon autonome pour atteindre un objectif — sans intervention humaine à chaque étape." },
                { term: 'Orchestrateur',     def: "Système qui coordonne plusieurs agents IA entre eux. Ex: un agent cherche, un autre analyse, un troisième rédige." },
                { term: 'MCP',               def: "Model Context Protocol — protocole permettant à une IA de se connecter à des outils externes (GitHub, Supabase, Stripe...)." },
                { term: 'RAG',               def: "Retrieval-Augmented Generation — technique pour enrichir les réponses d'une IA avec tes propres données ou documents." },
                { term: 'Token',             def: "Unité de base traitée par un LLM. Environ 0,75 mot. Claude Sonnet traite 200 000 tokens de contexte en une fois." },
                { term: 'Context window',    def: "Quantité maximale d'information qu'un LLM peut traiter en une conversation. Plus c'est grand, plus il peut tenir compte de l'historique." },
                { term: 'Claude Code',       def: "Interface en ligne de commande d'Anthropic. Permet à Claude de lire, écrire et exécuter du code directement sur ton ordinateur." },
                { term: 'Vibe Coding',       def: "Méthode de développement où tu décris en langage naturel ce que tu veux construire, et l'IA génère le code." },
              ],
            },
          ]},
        ],
      },
      {
        id: '0.6',
        title: 'Les 3 stratégies de départ',
        duration: '8 min',
        body: [],
        blocks: [
          { type: 'text', content: "Avant de construire quoi que ce soit, tu dois choisir ta stratégie. Ce choix détermine comment tu vas trouver ton idée, comment tu vas la valider, et combien de temps ça va prendre. Il n'y a pas de mauvaise stratégie — juste celle qui correspond à ta situation." },
          { type: 'list', title: 'Les 3 stratégies', style: 'cards', items: [
            { icon: 'refresh-cw',  label: 'Copier & adapter',          desc: "Prends un SaaS qui marche à l'étranger, reproduis-le pour le marché français avec moins de features.",  accent: '#4d96ff' },
            { icon: 'briefcase',   label: 'Créer pour soi ou un client',desc: "Construis un logiciel pour ton entreprise ou celui d'un client — et facture-le.",                      accent: '#cc5de8' },
            { icon: 'lightbulb',   label: 'Partir d\'un problème',      desc: "Tu vis un problème récurrent dans ton quotidien ou ton job. Tu construis la solution.",                  accent: '#22c55e' },
          ]},
          { type: 'heading', level: 2, content: 'Stratégie 1 — Copier & adapter' },
          { type: 'text', content: "C'est la stratégie la plus rapide et la moins risquée. Le marché est déjà validé — quelqu'un paie déjà pour ça ailleurs. Tu n'as pas besoin de convaincre les gens qu'ils ont un problème : ils le savent déjà." },
          { type: 'text', content: "Le process : repère un SaaS B2B américain avec de bons revenus (Product Hunt, Indie Hackers), vérifie qu'il n'a pas encore d'équivalent sérieux en France, analyse ses avis négatifs sur G2 ou Trustpilot pour trouver ses failles, et construis une version française qui corrige exactement ces problèmes." },
          { type: 'prompt', label: 'Exemple de prompt Claude — Stratégie 1', content: "Analyse le SaaS [URL] : modèle économique, fonctionnalités principales, pricing, avis clients négatifs. Ensuite, dis-moi comment adapter ce produit au marché français : quelles fonctionnalités garder, lesquelles simplifier, et quel angle différenciant utiliser. Donne-moi aussi 3 noms de domaine disponibles en .fr." },
          { type: 'heading', level: 2, content: 'Stratégie 2 — Créer pour soi ou un client' },
          { type: 'text', content: "Tu connais un métier, une industrie, une façon de travailler. Et tu vois des process manuels, répétitifs, inefficaces. Tu construis l'outil qui automatise ça — d'abord pour toi ou ton entreprise, puis tu le vends à d'autres professionnels du même secteur." },
          { type: 'text', content: "Variante client : un patron de PME, un artisan, un indépendant te dit 'j'aimerais bien avoir un outil qui fait X'. Tu construis pour lui, tu factures le projet, et tu réutilises le même outil avec d'autres clients similaires." },
          { type: 'callout', variant: 'action', title: 'Cash immédiat', content: "Cette stratégie génère du cash rapidement. Un projet sur commande peut se facturer entre 2 000 et 10 000€. Idéal pour financer les autres projets en parallèle." },
          { type: 'heading', level: 2, content: 'Stratégie 3 — Partir d\'un problème' },
          { type: 'text', content: "C'est la stratégie la plus engageante psychologiquement — tu es ton propre utilisateur numéro 1. Tu vis le problème tous les jours. Tu connais exactement la douleur. Et tu construis exactement la solution que tu voudrais avoir." },
          { type: 'text', content: "L'avantage : tu ne construis pas à l'aveugle. Chaque feature que tu crées, tu sais si elle résout vraiment le problème ou non. Le risque : te lancer sur un problème que tu es le seul à ressentir. D'où l'importance du Module 1 — Valider." },
          { type: 'list', title: 'Outils pour sourcer et valider les idées', style: 'bullets', items: [
            { label: 'Product Hunt',  desc: "Les SaaS qui cartonnent en ce moment, classés par upvotes et MRR." },
            { label: 'Indie Hackers', desc: "Des fondateurs qui partagent leurs revenus réels et leur parcours." },
            { label: 'Reddit',        desc: "Subreddits de niche où les gens se plaignent de leurs problèmes quotidiens." },
            { label: 'App Store',     desc: "Avis des apps mobiles — une mine d'or de douleurs non résolues." },
            { label: 'Flippa',        desc: "Marketplace de SaaS à vendre. Tu vois exactement ce qui rapporte." },
            { label: 'Acquire.com',   desc: "Même logique que Flippa, mais pour des SaaS plus matures (50k€+ ARR)." },
            { label: 'TrustMRR',      desc: "Annuaire de SaaS avec leurs MRR vérifiés. Repère les niches rentables et vois exactement ce que rapportent les produits existants avant de te lancer." },
          ]},
          { type: 'quiz-inline',
            question: "Quelle stratégie correspond le mieux à ta situation actuelle ?",
            options: [
              "Copier & adapter — je veux aller vite avec un marché déjà validé",
              "Créer pour un client — j'ai déjà quelqu'un qui voudrait payer pour ça",
              "Partir d'un problème — j'ai une douleur concrète que je vis tous les jours",
            ],
            correctIndex: 0,
            explanation: '',
            reflective: true,
            reflections: [
              "Parfait. Le marché est déjà validé, tu minimises les risques. Rends-toi sur Product Hunt ou Indie Hackers, repère 3 SaaS dans ta niche, et analyse leurs avis négatifs. C'est ton cahier des charges.",
              "Excellent point de départ pour générer du cash immédiat. Commence par définir précisément le problème du client, le livrable attendu, et le prix. Puis construis le MVP en 72h.",
              "La stratégie la plus motivante sur le long terme. Tu connais le problème mieux que quiconque. Va valider que tu n'es pas le seul à le ressentir — Module 1 t'explique comment.",
            ],
          },
        ],
      },
      {
        id: '0.7',
        title: 'Les modèles de monétisation',
        duration: '5 min',
        body: [],
        blocks: [
          { type: 'text', content: "Avant de construire quoi que ce soit, tu dois savoir ce que tu veux en faire. Un side business à 500€/mois ? Un SaaS à revendre dans 18 mois ? Une commande client pour financer d'autres projets ? Chaque objectif implique des décisions différentes à la construction." },
          { type: 'list', title: 'Les 5 modèles', style: 'cards', items: [
            { icon: 'trending-up',  label: 'Side business stable',    desc: "500-3 000€/mois de MRR, géré seul, revenu passif complémentaire à ton activité principale.",       accent: '#22c55e' },
            { icon: 'rocket',       label: 'SaaS scale',              desc: "MVP → product-market fit → croissance → éventuellement levée de fonds. Projet long terme.",        accent: '#4d96ff' },
            { icon: 'refresh-cw',   label: 'Flip rapide',             desc: "Atteindre 2 000-5 000€/mois de MRR, revendre 30-50× sur Flippa. Horizon 6-18 mois.",              accent: '#cc5de8' },
            { icon: 'briefcase',    label: 'Commande client',         desc: "2 000-10 000€ par projet sur commande. Cash immédiat, sans attendre les abonnements.",              accent: '#eab308' },
            { icon: 'dollar-sign',  label: 'Produit interne',         desc: "Automatiser ses propres process. Pas forcément monétisé directement, mais économise du temps.",    accent: '#71717a' },
          ]},
          { type: 'callout', variant: 'info', title: 'Comment calculer une valorisation', content: "La règle du marché pour un micro-SaaS : entre 30× et 50× le MRR mensuel. Un SaaS à 3 000€/mois peut se vendre entre 90 000€ et 150 000€ sur Flippa ou Acquire.com. Plus le churn est bas et les revenus stables, plus le multiplicateur est élevé." },
          { type: 'text', content: "Le modèle que tu choisis va influencer tes décisions techniques : un SaaS à flip doit être construit proprement pour passer une due diligence. Un produit interne n'a pas besoin d'un onboarding soigné. Une commande client doit être livrable en moins d'une semaine." },
          { type: 'quiz-inline',
            question: "Quel modèle correspond à ce que tu veux faire ?",
            options: [
              "Side business stable — je veux un revenu passif complémentaire",
              "SaaS scale — je vise un vrai produit tech à forte croissance",
              "Flip rapide — construire, monétiser, revendre",
              "Commande client — cash immédiat sur des projets précis",
              "Produit interne — automatiser mes propres process",
            ],
            correctIndex: 0,
            explanation: '',
            reflective: true,
            reflections: [
              "Parfait objectif. Concentre-toi sur un seul problème précis, une niche étroite, un pricing simple. La récurrence avant tout. Vise les 500€/mois en 30 jours.",
              "Ambition forte. Assure-toi de valider le product-market fit avant de scaler. Le Module 1 est crucial pour toi — ne passe pas à la construction sans validation solide.",
              "Stratégie claire et lucrative. Construis proprement depuis le début : code documenté, comptabilité en ordre, métriques visibles. L'acheteur va tout auditer.",
              "Cash rapide et expérience concrète. Chaque projet = une nouvelle compétence + un cas client + potentiellement un produit réutilisable.",
              "Le point de départ de beaucoup de SaaS. Construis pour toi, optimise, puis demande-toi si d'autres ont le même problème. Souvent le meilleur chemin vers un vrai produit.",
            ],
          },
        ],
      },
    ],
    quizQuestions: [
      {
        id: 'q00-1',
        question: "Qu'est-ce qu'un micro-SaaS ?",
        options: [
          'Un grand logiciel enterprise',
          'Un petit logiciel en ligne à abonnement mensuel ciblé sur un seul problème',
          'Une application mobile gratuite',
          'Un site e-commerce',
        ],
        correctIndex: 1,
        explanation: 'Un micro-SaaS est un petit logiciel en ligne que des gens paient chaque mois pour résoudre un problème précis — géré par 1 à 5 personnes.',
      },
      {
        id: 'q00-2',
        question: "Le vibe coding, c'est quoi ?",
        options: [
          'Coder en musique',
          "Construire un produit en décrivant ce qu'on veut à l'IA, sans écrire de code soi-même",
          'Un langage de programmation visuel',
          'Un style de design minimaliste',
        ],
        correctIndex: 1,
        explanation: "Le vibe coding = tu décris, l'IA construit. Tu diriges comme un chef de produit — l'IA s'occupe du code.",
      },
      {
        id: 'q00-3',
        question: 'Comment se calcule la valorisation d\'un micro-SaaS pour une vente ?',
        options: [
          '10× le MRR mensuel',
          '100× le MRR mensuel',
          '30 à 50× le MRR mensuel',
          'Uniquement basée sur le nombre d\'utilisateurs',
        ],
        correctIndex: 2,
        explanation: 'La règle du marché : 30 à 50× le MRR mensuel pour un micro-SaaS stable. Un SaaS à 3 000€/mois peut se vendre 90 000 à 150 000€.',
      },
    ],
  },
  // ── MODULE SETUP — Installer ton environnement ───────────────────────────
  {
    id: 'setup',
    title: 'Configuration',
    description: 'Configure tous tes outils avant de lancer le build.',
    icon: 'Wrench',
    lessons: [
      {
        id: 'setup.1',
        title: 'Claude & Claude Code — ton IA principale',
        duration: '5 min',
        body: [],
        blocks: [
          { type: 'text', content: "Claude est le moteur central de tout ce que tu vas construire. Il y a deux façons de l'utiliser : l'interface web (claude.ai) pour les conversations et la génération de contenu, et Claude Code (l'extension terminal) pour coder directement dans ton projet." },
          { type: 'heading', level: 2, content: 'Configuration pas à pas' },
          {
            type: 'list',
            style: 'bullets',
            items: [
              { label: 'Créer un compte claude.ai', desc: 'Va sur claude.ai → Créer un compte. Choisis le plan Pro (20$/mois) pour un accès illimité à Claude Opus et Sonnet — obligatoire pour coder sérieusement.' },
              { label: 'Installer Claude Code', desc: 'Dans ton terminal : npm install -g @anthropic-ai/claude-code. Puis dans VS Code, installe l\'extension Claude depuis le marketplace.' },
              { label: 'Tester la connexion', desc: 'Ouvre un terminal, tape claude. Tu dois voir une interface de chat directement dans le terminal. C\'est ton nouveau copilote.' },
            ],
          },
          { type: 'callout', variant: 'tip', title: 'Conseil Pro', content: "Garde toujours un onglet claude.ai ouvert pendant que tu codes. Tu vas l'utiliser pour tout : rédiger des prompts, débugger, générer du contenu, planifier." },
          {
            type: 'links',
            items: [
              { label: 'Claude AI', url: 'https://claude.ai', icon: 'brain', desc: 'L\'interface web principale — conversations, génération de contenu, analyse.' },
              { label: 'Claude Code', url: 'https://claude.ai/claude-code', icon: 'terminal', desc: 'L\'outil CLI pour coder depuis le terminal.' },
            ],
          },
          { type: 'checklist', items: [
            'Créer un compte claude.ai (plan Pro recommandé)',
            'Installer Claude Code : npm install -g @anthropic-ai/claude-code',
            'Tester la connexion en tapant claude dans le terminal',
          ]},
          { type: 'prompt', label: 'Premier prompt de démarrage', content: "Je commence un nouveau projet SaaS. Aide-moi à préparer le terrain.\n\nMon idée : [DÉCRIS TON IDÉE EN 2 PHRASES]\n\nCe que je veux :\n1. Un plan d'action pour les prochaines 72h\n2. Les premières étapes concrètes à faire aujourd'hui\n3. Les outils que je vais utiliser et pourquoi\n\nSois direct, concret, commence par ce qui a le plus d'impact." },
        ],
      },
      {
        id: 'setup.2',
        title: 'VS Code — ton éditeur de code',
        duration: '4 min',
        body: [],
        blocks: [
          { type: 'text', content: "VS Code est l'éditeur de code utilisé par 70% des développeurs dans le monde. Il est gratuit, ultra-personnalisable, et s'intègre parfaitement avec Claude Code et GitHub." },
          {
            type: 'list',
            style: 'bullets',
            items: [
              { label: 'Télécharger VS Code', desc: 'Va sur code.visualstudio.com → Download. Installe la version pour ton OS (Mac, Windows ou Linux).' },
              { label: 'Installer les extensions essentielles', desc: 'Dans VS Code, ouvre le marketplace (Ctrl+Shift+X) et installe : ESLint, Prettier, Tailwind CSS IntelliSense, GitLens.' },
              { label: 'Configurer l\'autosave', desc: 'File → Auto Save. Ton code sera sauvegardé automatiquement à chaque modification.' },
            ],
          },
          { type: 'callout', variant: 'info', title: 'Alternative', content: "Si tu préfères travailler directement dans le navigateur, tu peux utiliser StackBlitz ou CodeSandbox — pas besoin d'installation locale." },
          {
            type: 'links',
            items: [
              { label: 'VS Code', url: 'https://code.visualstudio.com', icon: 'code', desc: 'L\'éditeur de code de référence — gratuit et open-source.' },
            ],
          },
          { type: 'checklist', items: [
            'Télécharger et installer VS Code (code.visualstudio.com)',
            'Installer l\'extension ESLint',
            'Installer l\'extension Prettier',
            'Installer l\'extension Tailwind CSS IntelliSense',
            'Activer l\'autosave (File → Auto Save)',
          ]},
        ],
      },
      {
        id: 'setup.3',
        title: 'GitHub — versioning et sauvegarde',
        duration: '5 min',
        body: [],
        blocks: [
          { type: 'text', content: "GitHub = ton Google Drive pour le code. Il garde une copie de tout ton travail, te permet de revenir en arrière en cas d'erreur, et se connecte directement à Vercel pour le déploiement automatique." },
          {
            type: 'list',
            style: 'bullets',
            items: [
              { label: 'Créer un compte GitHub', desc: 'Va sur github.com → Sign up. Choisis un username professionnel — il sera visible dans l\'URL de ton code.' },
              { label: 'Installer Git', desc: 'Sur Mac : brew install git. Sur Windows : télécharge Git from git-scm.com. Vérifie avec git --version dans le terminal.' },
              { label: 'Créer ton premier repository', desc: 'Sur GitHub → New Repository → Donne-lui le nom de ton projet → Create. Copie l\'URL SSH pour l\'utiliser avec VS Code.' },
              { label: 'Connecter VS Code', desc: 'Dans VS Code, ouvre le Source Control panel (Ctrl+Shift+G). Suis les instructions pour lier ton repository local à GitHub.' },
            ],
          },
          { type: 'callout', variant: 'tip', title: 'Astuce', content: "Claude Code peut gérer tous tes commits automatiquement. Tu n'as jamais besoin de taper git add / git commit / git push — Claude le fait pour toi." },
          {
            type: 'links',
            items: [
              { label: 'GitHub', url: 'https://github.com', icon: 'git-branch', desc: 'Versioning du code — crée un compte gratuit.' },
            ],
          },
          { type: 'checklist', items: [
            'Créer un compte GitHub (github.com)',
            'Installer Git localement (brew install git sur Mac)',
            'Créer un repository pour ton projet',
            'Connecter VS Code au repository GitHub',
          ]},
        ],
      },
      {
        id: 'setup.4',
        title: 'Supabase — ton backend clé en main',
        duration: '6 min',
        body: [],
        blocks: [
          { type: 'text', content: "Supabase = PostgreSQL + Auth + Stockage + API en temps réel, le tout clé en main. C'est le cerveau de ton app : il stocke les données, gère les utilisateurs, et expose une API sécurisée automatiquement." },
          {
            type: 'list',
            style: 'bullets',
            items: [
              { label: 'Créer un compte Supabase', desc: 'Va sur supabase.com → Start for free. Connecte-toi avec ton compte GitHub pour simplifier.' },
              { label: 'Créer un nouveau projet', desc: 'New Project → Donne un nom → Choisis une région EU (West) pour des latences optimales en Europe → Génère et note le mot de passe de la base de données.' },
              { label: 'Récupérer tes clés API', desc: 'Settings → API → Copie ta Project URL et ton anon public key. Tu en auras besoin dans les variables d\'environnement de ton app.' },
              { label: 'Tester la connexion', desc: 'Dans l\'interface Supabase, va dans le SQL Editor et exécute : SELECT now(); → Si tu vois une date/heure, tout fonctionne.' },
            ],
          },
          { type: 'callout', variant: 'action', title: 'Variables d\'environnement', content: "Crée un fichier .env.local à la racine de ton projet avec : VITE_SUPABASE_URL=ta_url et VITE_SUPABASE_ANON_KEY=ta_clé. Ne commite jamais ce fichier sur GitHub." },
          {
            type: 'links',
            items: [
              { label: 'Supabase', url: 'https://supabase.com', icon: 'database', desc: 'Le backend clé en main — gratuit jusqu\'à 500 Mo.' },
            ],
          },
          { type: 'checklist', items: [
            'Créer un compte Supabase (supabase.com)',
            'Créer un projet avec la région EU West',
            'Copier la Project URL et l\'anon key',
            'Créer le fichier .env.local avec VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY',
          ]},
          { type: 'prompt', label: 'Configurer Supabase dans mon projet', content: "Configure Supabase dans mon projet React + Vite.\n\nMon projet :\n- Framework : React 18 + TypeScript + Vite\n- Variables déjà créées : VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY dans .env.local\n\nCe que je veux :\n1. Installer @supabase/supabase-js\n2. Créer src/lib/supabase.ts avec le client initialisé\n3. Créer une table users avec : id (uuid), email (text), created_at (timestamptz), plan (text default 'free')\n4. Activer Row Level Security sur la table users\n5. Politique RLS : les utilisateurs ne voient que leur propre ligne\n\nGénère tout le code et les migrations SQL." },
        ],
      },
      {
        id: 'setup.5',
        title: 'Vercel — déploiement en 2 minutes',
        duration: '4 min',
        body: [],
        blocks: [
          { type: 'text', content: "Vercel = déploiement instantané. Tu connectes ton repository GitHub → Vercel surveille chaque push → ton app est automatiquement mise à jour en production. Zéro configuration." },
          {
            type: 'list',
            style: 'bullets',
            items: [
              { label: 'Créer un compte Vercel', desc: 'Va sur vercel.com → Continue with GitHub. C\'est l\'option la plus simple — tes repositories sont directement visibles.' },
              { label: 'Importer ton projet', desc: 'Add New → Project → Sélectionne ton repository GitHub → Import. Vercel détecte automatiquement ton framework (React/Vite).' },
              { label: 'Configurer les variables d\'environnement', desc: 'Project Settings → Environment Variables → Ajoute tes variables Supabase (URL + ANON_KEY). Elles seront disponibles en production.' },
              { label: 'Déployer', desc: 'Clique Deploy. Ton app sera live sur une URL Vercel en moins de 2 minutes. Pour un domaine custom, va dans Settings → Domains.' },
            ],
          },
          { type: 'callout', variant: 'tip', title: 'Preview deployments', content: "Chaque pull request GitHub génère automatiquement une Preview URL. Tu peux tester une nouvelle feature sans toucher la production." },
          {
            type: 'links',
            items: [
              { label: 'Vercel', url: 'https://vercel.com', icon: 'cloud', desc: 'Déploiement instantané — gratuit pour les projets personnels.' },
            ],
          },
          { type: 'checklist', items: [
            'Créer un compte Vercel (vercel.com) avec GitHub',
            'Importer le repository GitHub dans Vercel',
            'Configurer les variables d\'environnement Supabase dans Vercel',
            'Déployer et vérifier que l\'app est live sur l\'URL Vercel',
          ]},
        ],
      },
      {
        id: 'setup.6',
        title: 'Stripe — paiements en 30 minutes',
        duration: '5 min',
        body: [],
        blocks: [
          { type: 'text', content: "Stripe = le standard mondial des paiements en ligne. 99.99% d'uptime, conforme PCI DSS, disponible dans 135 pays. Tu peux accepter des paiements et créer des abonnements en moins de 30 minutes." },
          {
            type: 'list',
            style: 'bullets',
            items: [
              { label: 'Créer un compte Stripe', desc: 'Va sur stripe.com → Start now. Complète ton inscription avec les informations de ta micro-entreprise.' },
              { label: 'Activer le mode test', desc: 'En haut à droite, assure-toi que "Test mode" est activé. Tu peux faire des paiements factices avec la carte 4242 4242 4242 4242.' },
              { label: 'Créer un produit', desc: 'Products → Add Product → Renseigne le nom, prix et type (paiement unique ou abonnement). Copie le Price ID généré.' },
              { label: 'Récupérer les clés API', desc: 'Developers → API Keys → Copie ta Publishable Key et ta Secret Key. La Secret Key ne va JAMAIS côté client — uniquement dans les variables d\'environnement serveur.' },
            ],
          },
          { type: 'callout', variant: 'action', title: 'Checklist avant de passer en production', content: "1. Test un paiement complet avec la carte test 4242\n2. Vérifie que le webhook reçoit les événements\n3. Configure les emails de confirmation Stripe\n4. Passe en mode live dans le dashboard Stripe" },
          {
            type: 'links',
            items: [
              { label: 'Stripe', url: 'https://stripe.com', icon: 'credit-card', desc: 'Paiements en ligne — 1.4% + 0.25€ par transaction en Europe.' },
              { label: 'Stripe Docs', url: 'https://docs.stripe.com', icon: 'book-open', desc: 'Documentation officielle avec exemples de code React/Node.' },
            ],
          },
          { type: 'checklist', items: [
            'Créer un compte Stripe (stripe.com)',
            'Activer le mode test dans le dashboard',
            'Créer un produit avec son prix (paiement unique ou abonnement)',
            'Copier la Publishable Key et la Secret Key',
            'Tester un paiement avec la carte 4242 4242 4242 4242',
          ]},
          { type: 'prompt', label: 'Intégrer Stripe dans mon app', content: "Intègre Stripe dans mon app pour gérer les paiements.\n\nMon setup :\n- App : React + Supabase + Vercel\n- Plan : [NOM DU PLAN] à [PRIX]€/mois\n- Price ID Stripe : [STRIPE_PRICE_ID]\n- Stripe Secret Key : dans les variables d'env (jamais côté client)\n\nCe que tu dois créer :\n1. Supabase Edge Function `create-checkout` : crée une session Stripe Checkout et retourne l'URL\n2. Supabase Edge Function `stripe-webhook` : écoute checkout.session.completed et met à jour le plan de l'utilisateur\n3. Page /pricing dans React avec bouton CTA qui appelle la Edge Function\n4. Hook usePlan() qui lit user.plan depuis Supabase\n\nLa clé secrète Stripe ne touche jamais le navigateur — uniquement dans les Edge Functions." },
        ],
      },
      {
        id: 'setup.7',
        title: 'Resend — emails transactionnels',
        duration: '3 min',
        body: [],
        blocks: [
          { type: 'text', content: "Resend = les emails de ton app : bienvenue, confirmation de paiement, relance, réinitialisation de mot de passe. API simple, excellent taux de délivrabilité, et 3 000 emails/mois gratuits." },
          {
            type: 'list',
            style: 'bullets',
            items: [
              { label: 'Créer un compte Resend', desc: 'Va sur resend.com → Sign up. Connecte-toi avec GitHub pour simplifier.' },
              { label: 'Vérifier ton domaine', desc: 'Domains → Add Domain → Entre ton domaine (ex: tondomaine.fr) → Suis les instructions DNS dans Cloudflare ou Hostinger.' },
              { label: 'Créer une clé API', desc: 'API Keys → Create API Key → Copie la clé générée. Elle va dans tes variables d\'environnement serveur (jamais côté client).' },
              { label: 'Envoyer un email test', desc: 'Dans le dashboard Resend, utilise le playground pour envoyer un email test à ton adresse. Vérifie qu\'il arrive (y compris dans les spams).' },
            ],
          },
          { type: 'callout', variant: 'tip', title: 'Integration Supabase', content: "Supabase peut utiliser Resend comme provider SMTP pour les emails d'auth (confirmation d'email, reset mot de passe). Configure-le dans Supabase → Settings → Auth → SMTP Settings." },
          {
            type: 'links',
            items: [
              { label: 'Resend', url: 'https://resend.com', icon: 'mail', desc: 'Emails transactionnels — 3 000 emails/mois gratuits.' },
            ],
          },
          { type: 'checklist', items: [
            'Créer un compte Resend (resend.com)',
            'Vérifier le domaine dans les DNS (Cloudflare ou Hostinger)',
            'Créer une clé API Resend',
            'Envoyer un email test depuis le dashboard',
            'Configurer Resend comme SMTP dans Supabase Auth',
          ]},
          { type: 'prompt', label: 'Créer les emails transactionnels', content: "Crée les emails transactionnels pour mon SaaS avec Resend.\n\nMon stack : React + Supabase + Vercel + Resend\nNom du produit : [NOM DE TON APP]\nDomaine : [TON-DOMAINE.FR]\n\nEmails à créer (sous forme de Supabase Edge Functions) :\n1. Email de bienvenue — envoyé à l'inscription\n2. Confirmation de paiement — envoyé après Stripe checkout.session.completed\n3. Réinitialisation de mot de passe\n\nPour chaque email :\n- Template HTML responsive et professionnel\n- Variables dynamiques : prénom, email, lien d'action\n- Sender : noreply@[ton-domaine]\n- La clé API Resend dans les variables d'env serveur uniquement\n\nGénère le code complet des Edge Functions et les templates HTML." },
        ],
      },
    ],
    quizQuestions: [
      {
        id: 'setup-q1',
        question: "Quelle est la différence entre Claude AI (claude.ai) et Claude Code ?",
        options: [
          "Ce sont deux IA différentes",
          "Claude AI est l'interface web, Claude Code est l'outil terminal pour coder directement dans les projets",
          "Claude Code est payant, Claude AI est gratuit",
          "Il n'y a aucune différence",
        ],
        correctIndex: 1,
        explanation: "Claude AI (claude.ai) est l'interface web pour les conversations et la génération de contenu. Claude Code est l'outil CLI qui s'intègre directement dans ton terminal et ton éditeur pour modifier, refactoriser et débugger ton code.",
      },
      {
        id: 'setup-q2',
        question: "Où doit-on mettre la Stripe Secret Key ?",
        options: [
          "Dans le code frontend directement",
          "Dans localStorage du navigateur",
          "Dans les variables d'environnement serveur uniquement — jamais côté client",
          "Dans le repository GitHub",
        ],
        correctIndex: 2,
        explanation: "La Stripe Secret Key ne doit JAMAIS être exposée côté client — elle donne accès complet à ton compte Stripe. Elle va uniquement dans les variables d'environnement serveur (Vercel, Edge Functions Supabase). La Publishable Key, elle, peut être côté client.",
      },
    ],
  },

  {
    id: '01',
    title: 'Trouver mon idée',
    description: "L'idée qui va devenir ton produit.",
    icon: 'Search',
    lessons: [
      // ── 1.1 — Trouver ton idée ─────────────────────────────────────────────
      {
        id: '1.1',
        title: 'Trouver ton idée',
        duration: '8 min',
        body: [],
        blocks: [
          { type: 'text', content: "90% des gens qui veulent lancer un SaaS restent bloqués ici. Pas parce qu'il n'y a pas d'idées — mais parce qu'ils cherchent au mauvais endroit, de la mauvaise façon." },
          { type: 'text', content: "La vraie méthode : tu ne cherches pas une idée géniale. Tu cherches un problème récurrent que des gens paient déjà pour résoudre — et que tu peux faire mieux, plus vite, ou sur une niche plus précise." },
          {
            type: 'diagram-flow',
            title: 'La méthode Buildrs — 5 étapes',
            steps: [
              { label: 'Observer', sub: "Quels problèmes répétitifs vois-tu autour de toi ? Quels outils t'énervent au quotidien ?", color: '#4d96ff' },
              { label: 'Analyser', sub: 'Ces problèmes ont-ils des solutions existantes ? Des gens paient-ils pour les résoudre ?', color: '#22c55e' },
              { label: 'Filtrer', sub: 'Est-ce buildable en 72h avec Claude Code + le stack Buildrs (Supabase, Stripe, Vercel) ?', color: '#cc5de8' },
              { label: 'Choisir', sub: "Une seule idée. La plus concrète, la plus proche de toi, la mieux validée.", color: '#f59e0b' },
              { label: 'Documenter', sub: 'Brief produit complet avant d\'écrire la première ligne de code.', color: '#22c55e' },
            ],
          },
          {
            type: 'heading', level: 2, content: 'Les 5 meilleures sources d\'idées',
          },
          {
            type: 'links',
            items: [
              {
                label: 'Product Hunt',
                url: 'https://www.producthunt.com',
                icon: 'trending-up',
                desc: 'Vois ce qui cartonne aujourd\'hui. Note les apps avec 500+ upvotes — ce sont des problèmes validés par des milliers d\'utilisateurs.',
                tag: 'Trending',
              },
              {
                label: 'App Store — Avis 1-2 étoiles',
                url: 'https://apps.apple.com',
                icon: 'star',
                desc: 'Les avis négatifs = douleurs non résolues. Chaque plainte "manque de X" ou "impossible de faire Y" est une opportunité directe.',
                tag: 'Douleurs',
              },
              {
                label: 'Reddit — r/SaaS & r/entrepreneur',
                url: 'https://www.reddit.com/r/SaaS',
                icon: 'search',
                desc: 'Les threads "What tools do you wish existed?" et "I hate that no tool does X" sont une mine d\'or d\'idées non saturées.',
                tag: 'Communauté',
              },
              {
                label: 'Flippa — SaaS à vendre',
                url: 'https://flippa.com',
                icon: 'dollar-sign',
                desc: 'Un SaaS vendu 30k€ = preuve que le marché est réel et que des gens paient. Analyse le modèle, adapte-le au marché français ou à une niche précise.',
                tag: 'Validation MRR',
              },
              {
                label: 'Acquire.com — Acquisitions SaaS',
                url: 'https://acquire.com',
                icon: 'briefcase',
                desc: 'Vois les SaaS rachetés par des investisseurs. Analyse leur MRR, leur modèle de revenus, leur niche — tout est affiché publiquement.',
                tag: 'Marché validé',
              },
            ],
          },
          {
            type: 'callout',
            variant: 'tip',
            title: 'La règle d\'or',
            content: "Trouver des concurrents est une BONNE nouvelle, pas une mauvaise. Ça prouve que le marché est réel et que des gens paient. Si un SaaS génère du MRR sur Flippa ou Acquire, tu as la preuve que le modèle fonctionne. Ton job : identifier leur point faible et être meilleur sur ce point précis.",
          },
          {
            type: 'diagram-cards',
            title: '3 angles pour trouver ton idée',
            items: [
              { icon: 'copy',      label: 'Copier & Adapter',            desc: 'Un SaaS US qui marche → version française ou niche plus précise. Moins de risque, marché déjà validé.', color: '#4d96ff' },
              { icon: 'lightbulb', label: 'Résoudre ton propre problème', desc: 'Tu vis le problème = tu es ton meilleur client. Tu valides naturellement à chaque étape du build.', color: '#22c55e' },
              { icon: 'eye',       label: 'Observer les douleurs',        desc: 'Reviews App Store, threads Reddit, commentaires Product Hunt — identifier les frustrations récurrentes.', color: '#cc5de8' },
            ],
          },
          {
            type: 'prompt',
            label: 'Prompt Claude — Brainstorming 10 idées',
            content: "Tu es un expert en micro-SaaS. Je te présente ma situation : [qui tu es, ton domaine, tes compétences, ton expérience]. Génère 10 idées de micro-SaaS que je pourrais lancer en 72h avec Claude Code + Supabase + Vercel. Pour chaque idée : nom, problème résolu en 1 phrase, cible principale, prix mensuel suggéré (9-99€), et pourquoi ça marcherait maintenant. Filtre les idées trop complexes, trop généralistes ou qui nécessitent plus de 2 semaines à builder.",
          },
          {
            type: 'checklist',
            title: 'Actions à faire maintenant',
            items: [
              'Visiter Product Hunt — noter 3 SaaS inspirants dans ta niche ou domaine',
              'Lire 10 avis 1-2 étoiles sur App Store sur des apps de ta niche',
              'Explorer Flippa et Acquire — regarder les SaaS vendus ces 6 derniers mois',
              'Parcourir r/SaaS et r/entrepreneur — noter les douleurs répétitives',
              'Lancer le prompt Claude ci-dessus avec ta situation réelle',
              'Sauvegarder tes 5 meilleures idées dans "Mes Idées" (sidebar)',
            ],
          },
        ],
      },

      // ── 1.2 — Valider avant de construire ────────────────────────────────
      {
        id: '1.2',
        title: 'Valider avant de construire',
        duration: '7 min',
        body: [],
        blocks: [
          { type: 'text', content: "Tu as plusieurs idées. Avant d'ouvrir Claude Code, tu dois répondre à 4 questions simples. Cette étape te fait économiser des semaines de travail sur un produit que personne ne veut." },
          {
            type: 'diagram-flow',
            title: 'Les 4 filtres de validation',
            steps: [
              { label: 'Filtre paiement', sub: 'Des gens paient déjà pour résoudre ce problème — même imparfaitement ?', color: '#22c55e' },
              { label: 'Filtre clarté', sub: "Tu peux décrire ton app en 1 phrase à quelqu'un qui ne connaît pas la tech ?", color: '#4d96ff' },
              { label: 'Filtre marché', sub: 'Il y a au moins 1 000 clients potentiels accessibles en ligne ?', color: '#cc5de8' },
              { label: 'Filtre build', sub: "UNE seule feature core, buildable en 72h. Pas 10 features — une seule.", color: '#f59e0b' },
            ],
          },
          { type: 'heading', level: 2, content: 'Le test des 3 questions' },
          {
            type: 'list',
            style: 'cards',
            items: [
              { icon: 'dollar-sign', label: 'Des gens paient déjà ?',  desc: "S'il existe des concurrents → validation du marché. S'il n'y en a pas → danger ou opportunité rare. Cherche des preuves concrètes de paiement (Flippa, G2, App Store).", accent: '#22c55e' },
              { icon: 'target',      label: 'Explicable en 1 phrase ?', desc: '"C\'est un outil qui aide [cible] à [résultat] sans [douleur principale]." Si tu n\'arrives pas à formuler ça — l\'idée n\'est pas encore assez claire.', accent: '#4d96ff' },
              { icon: 'package',     label: 'Buildable en 72h ?',       desc: 'UNE seule feature core. Pas 15. Si tu as besoin de 3 semaines — c\'est un produit trop complexe pour un premier lancement. Réduis le scope.', accent: '#cc5de8' },
            ],
          },
          {
            type: 'callout',
            variant: 'info',
            title: 'La règle des concurrents',
            content: "Trouver des concurrents est une BONNE nouvelle. Ça prouve que le marché existe et que des gens paient. Sur Flippa et Acquire, tu vois exactement ce que le marché est prêt à acheter — et à quel prix. Utilise ça comme validation, pas comme raison de renoncer.",
          },
          { type: 'heading', level: 2, content: 'La validation sans coder' },
          { type: 'text', content: "Avant d'écrire la première ligne de code, teste ton idée avec une simple conversation. Envoie un message à 3-5 personnes dans ta cible cible. Décris le problème (pas ta solution). Demande : 'Tu paierais X€/mois pour ça ?' Si 3 sur 5 disent oui — tu construis. Si personne n'est enthousiaste — tu affines ou tu pivotes." },
          {
            type: 'prompt',
            label: 'Prompt Claude — Validation en mode avocat du diable',
            content: "Analyse cette idée de micro-SaaS en mode avocat du diable : [ton idée en 2-3 phrases]. Évalue précisément : 1) Taille du marché (ordre de grandeur réaliste), 2) Concurrents existants (nomme-en 3 avec leur pricing), 3) Les 3 vraies raisons pour lesquelles ça pourrait échouer, 4) Ce qui manque aux solutions actuelles que je pourrais exploiter, 5) Avis sur mon pricing suggéré de [X€/mois] — est-ce trop bas, trop haut ? Sois honnête, pas optimiste.",
          },
          {
            type: 'quiz-inline',
            question: "Ton idée, tu pourrais l'expliquer à quelqu'un qui ne connaît pas la tech en moins de 10 secondes ?",
            options: [
              "Oui, facilement — j'ai une phrase claire",
              "Ça prend 30 secondes mais c'est compréhensible",
              "J'ai besoin de donner du contexte pour que ce soit clair",
              "Honnêtement non, c'est encore flou",
            ],
            correctIndex: 0,
            explanation: "",
            reflective: true,
            reflections: [
              "Parfait. Une idée claire = un pitch clair = une landing page qui convertit = des ventes. Tu es prêt pour le brief produit.",
              "Bon signe. Prends 15 minutes pour reformuler. Une idée forte se dit en 10 mots. Essaie : 'C'est un outil qui aide [X] à [Y] sans [Z].'",
              "Signal d'alerte. Si toi tu as du mal à l'expliquer, imagine ton client potentiel. Reformule l'idée jusqu'à ce qu'elle soit limpide — avant de coder quoi que ce soit.",
              "Stop. Avant de construire quoi que ce soit, reformule l'idée jusqu'à ce qu'elle soit limpide. C'est la base de tout. Une idée floue = un produit flou = zéro vente.",
            ],
          },
          {
            type: 'checklist',
            title: 'Checklist de validation',
            items: [
              'Appliquer les 4 filtres à chacune de tes 3 idées candidates',
              'Lancer le prompt de validation dans Claude pour l\'idée principale',
              'Chercher 3 concurrents existants (Product Hunt, Google, App Store)',
              'Envoyer un message à 3-5 personnes dans ta cible pour valider',
              'Choisir UNE idée — la plus validée, la plus claire, la plus proche de toi',
              'Écrire l\'idée choisie en une seule phrase (modèle ci-dessus)',
            ],
          },
        ],
      },

      // ── 1.3 — Le Brief Produit ────────────────────────────────────────────
      {
        id: '1.3',
        title: 'Le Brief Produit',
        duration: '10 min',
        body: [],
        blocks: [
          { type: 'text', content: "Le brief produit, c'est le document que tu vas donner à Claude pour construire ton app. Plus il est précis, meilleur sera le résultat — et moins tu auras d'allers-retours inutiles." },
          {
            type: 'callout',
            variant: 'tip',
            title: 'Pourquoi le brief change tout',
            content: "20 minutes sur ce document = des heures de build économisées. Claude a besoin d'un contexte très précis pour générer un code pertinent. Sans brief → résultat générique. Avec brief bien rempli → produit sur mesure dès la première version.",
          },
          {
            type: 'diagram-flow',
            title: 'Du brief au produit live',
            steps: [
              { label: 'Remplis le framework ci-dessous', sub: 'Section par section — prends le temps de tout préciser. Chaque champ compte.', color: '#4d96ff' },
              { label: 'Colle le brief complet dans Claude Code', sub: '"Je veux créer ce micro-SaaS. Voici mon brief complet : [colle ici]"', color: '#22c55e' },
              { label: 'Claude génère l\'architecture', sub: 'Tables Supabase, pages React, logique auth + paiement, structure du code.', color: '#cc5de8' },
              { label: 'Tu build, tu itères, tu deploy', sub: "Module 2 → 5 : construction pas à pas avec les bons prompts à chaque étape.", color: '#f59e0b' },
            ],
          },
          { type: 'heading', level: 2, content: 'Le Framework Brief Produit Buildrs' },
          {
            type: 'template',
            title: 'Document à compléter',
            sections: [
              {
                label: 'Identité produit',
                icon: 'tag',
                fields: [
                  { name: 'Nom du produit',  placeholder: '[Nom accrocheur, mémorable — disponible en .fr ou .com]', example: 'Ex : TaskFlow, AuditAI, RelancePro, InvoiceBot' },
                  { name: 'Tagline',         placeholder: '[Ce que ça fait en moins de 10 mots]', example: 'Ex : "Transforme tes emails en tâches en 1 clic"' },
                  { name: 'URL cible',       placeholder: '[monproduit.fr ou monproduit.io]', example: '' },
                ],
              },
              {
                label: 'Problème & Cible',
                icon: 'target',
                fields: [
                  { name: 'Problème résolu',    placeholder: '[Décris le problème en 1 phrase — du point de vue du client, pas du tien]', example: 'Ex : "Les freelances perdent 3h/semaine à relancer leurs clients par email manuellement"' },
                  { name: 'Cible principale',   placeholder: '[Qui exactement ? Sois précis : métier, taille, contexte d\'usage]', example: 'Ex : "Freelances web designers avec 5-20 clients actifs, basés en France"' },
                  { name: 'Douleur principale', placeholder: '[Ce qui énerve le plus ta cible avec les solutions actuelles]', example: 'Ex : "Relances manuelles chronophages, oublis fréquents, image peu professionnelle"' },
                ],
              },
              {
                label: 'Solution & Features',
                icon: 'package',
                fields: [
                  { name: 'Feature core (1 seule)',    placeholder: '[La SEULE chose que l\'app doit faire parfaitement — ce qui justifie le paiement]', example: 'Ex : "Générer et envoyer automatiquement des relances personnalisées aux clients en retard"' },
                  { name: 'Features V1 (max 5)',       placeholder: '[Liste tes 5 fonctionnalités minimum viables — pas plus]', example: '1/ Auth email 2/ Dashboard clients 3/ Relance automatique 4/ Suivi statut 5/ Historique' },
                  { name: 'Exclu de la V1 (scope)',    placeholder: '[Les features tentantes que tu REFUSES de coder en V1 — discipline de scope]', example: 'Ex : Pas de comptabilité, pas d\'app mobile, pas d\'IA générative, pas d\'intégrations tierces' },
                ],
              },
              {
                label: 'Monétisation & Pricing',
                icon: 'dollar-sign',
                fields: [
                  { name: 'Modèle',              placeholder: '[Abonnement mensuel / Paiement unique / Freemium + upgrade / Usage-based]', example: 'Abonnement mensuel recommandé — prévisible, récurrent, scalable' },
                  { name: 'Prix mensuel',         placeholder: '[Entre 9€ et 99€ selon la valeur créée — règle : 1/10 de la valeur générée pour le client]', example: 'Ex : Si tu fais économiser 300€/mois de temps → prix entre 19 et 49€/mois' },
                  { name: 'Période d\'essai',     placeholder: '[Gratuit X jours / Freemium limité / Demo sans CB requise]', example: 'Ex : 14 jours gratuits, aucune CB requise — friction minimale à l\'inscription' },
                  { name: 'Objectif MRR 90j',    placeholder: '[Objectif réaliste — 100 à 1 000€ pour un premier produit]', example: 'Ex : 500€ MRR = ~20 clients à 25€/mois ou ~10 clients à 49€/mois' },
                ],
              },
              {
                label: 'Stack technique',
                icon: 'code',
                fields: [
                  { name: 'Frontend',    placeholder: 'React + TypeScript + Vite + Tailwind CSS', example: '' },
                  { name: 'Backend/BDD', placeholder: 'Supabase (PostgreSQL + Auth + Storage + Edge Functions)', example: '' },
                  { name: 'Paiements',   placeholder: 'Stripe (Checkout + Webhooks + Customer Portal)', example: '' },
                  { name: 'Déploiement', placeholder: 'Vercel (frontend) + Supabase (API + DB)', example: '' },
                ],
              },
            ],
          },
          {
            type: 'callout',
            variant: 'action',
            title: 'Étape suivante',
            content: "Une fois toutes les sections remplies : copie l'intégralité du brief et colle-le dans Claude avec le prompt ci-dessous. Claude va générer l'architecture complète et le code de démarrage pour ton produit.",
          },
          {
            type: 'prompt',
            label: 'Prompt Claude — Génération du brief complet',
            content: "Je veux créer un micro-SaaS. Voici mon brief produit complet :\n\nNOM : [...]\nTAGLINE : [...]\nPROBLÈME : [...]\nCIBLE : [...]\nDOULEUR PRINCIPALE : [...]\nFEATURE CORE (1 seule) : [...]\nFEATURES V1 : [...]\nEXCLU DE LA V1 : [...]\nPRIX : [...€/mois]\nSTACK : React + TypeScript + Supabase + Stripe + Vercel\n\nGénère : 1/ Architecture complète des tables Supabase avec les colonnes et types, 2/ Structure des pages React (liste des routes et leur rôle), 3/ Logique de l'auth et du paiement Stripe, 4/ Le prompt de lancement complet à utiliser dans Claude Code pour scaffolder le projet. Sois précis et technique — je lance le build immédiatement après.",
          },
          {
            type: 'checklist',
            title: 'Avant de passer au Module 2',
            items: [
              'Remplir les 5 sections du Framework Brief Produit',
              'Vérifier que la feature core est vraiment UNE seule fonctionnalité',
              'Vérifier le pricing (règle du 1/10 de la valeur créée pour le client)',
              'Lancer le prompt de génération dans Claude et sauvegarder le résultat',
              'Sauvegarder le brief complet dans "Mes Idées" (sidebar)',
              'Partager ton brief dans le canal WhatsApp Buildrs pour avoir un retour',
            ],
          },
        ],
      },
    ],
    quizQuestions: [
      {
        id: 'q01-1',
        question: 'Pourquoi la plupart des MVP échouent ?',
        options: [
          'Mauvais design',
          'Ils résolvent un problème imaginaire',
          'Trop chers à construire',
          'Manque de marketing',
        ],
        correctIndex: 1,
        explanation: "90% des MVP échouent parce qu'ils résolvent un problème que personne ne ressent vraiment — ou que personne ne paierait pour résoudre. La validation avant le build est non négociable.",
      },
      {
        id: 'q01-2',
        question: "Trouver des concurrents à ton idée, c'est...",
        options: [
          'Une mauvaise nouvelle — le marché est saturé',
          'Une bonne nouvelle — ça prouve que le marché existe et que des gens paient',
          'Un signe qu\'il faut changer d\'idée',
          'Sans importance pour le lancement',
        ],
        correctIndex: 1,
        explanation: "Des concurrents = validation de marché. S'il n'y avait pas de marché, il n'y aurait pas de concurrents. Ton job : être meilleur sur UN point précis.",
      },
      {
        id: 'q01-3',
        question: 'À quoi sert le brief produit avant de coder ?',
        options: [
          "C'est juste de la documentation — optionnel",
          "C'est le document que tu donnes à Claude pour générer l'architecture et le code de départ",
          "C'est un plan marketing",
          "C'est pour les investisseurs",
        ],
        correctIndex: 1,
        explanation: "Le brief produit = le contexte précis que Claude a besoin pour générer un code pertinent. Plus il est détaillé, plus le résultat est précis et immédiatement utilisable.",
      },
    ],
  },
  {
    id: '02',
    title: 'Designer mon produit',
    description: 'Donne forme à ton produit avant de le construire.',
    icon: 'Palette',
    lessons: [

      // ── 2.1 — L'arsenal créatif ──────────────────────────────────────────
      {
        id: '2.1',
        title: "L'arsenal créatif — tes outils de design",
        duration: '8 min',
        body: [],
        blocks: [
          { type: 'text', content: "Avant d'écrire la première ligne de code, tu dois voir ton produit. Les meilleurs product builders ne partent pas d'une feuille blanche — ils s'inspirent, assemblent, et donnent un brief visuel précis à leur IA. Ce module = ton workflow de design complet." },
          { type: 'text', content: "Chez Buildrs, on utilise exactement ce stack pour chaque nouveau produit : inspiration → maquette → DA → composants premium → visuels IA. C'est ce workflow qui te permet de livrer un produit pro en 72h." },
          {
            type: 'diagram-cards',
            title: "Les 5 catégories d'outils",
            items: [
              { icon: 'eye',           label: 'Inspiration',     desc: 'Mobbin, PagesFlow — les meilleures interfaces du monde classées par catégorie.',         color: '#4d96ff' },
              { icon: 'layout',        label: 'Maquettes',       desc: 'Stitch — assembler des interfaces réelles pour créer ses wireframes en minutes.',         color: '#22c55e' },
              { icon: 'book-open',     label: 'Architecture',    desc: 'Notion — organiser son user flow, ses pages, ses user stories avant de coder.',           color: '#f59e0b' },
              { icon: 'palette',       label: 'Direction artis.', desc: 'ui-ux-pro-max skill + Superpowers brainstorm — définir couleurs, typo, style système.', color: '#cc5de8' },
              { icon: 'sparkles',      label: 'Composants & IA', desc: 'Magic UI, 21st.dev, Nano Banana, Google AI Studio — du code et des visuels pro-level.',   color: '#ef4444' },
            ],
          },
          { type: 'heading', level: 2, content: 'Tous les outils — liens directs' },
          {
            type: 'links',
            items: [
              { label: 'Mobbin',             url: 'https://mobbin.com',                      icon: 'eye',          desc: '50 000+ screenshots d\'apps iOS et Android classés par type d\'écran (onboarding, pricing, dashboard…). La référence absolue pour l\'inspiration UI.', tag: 'Inspiration' },
              { label: 'PagesFlow',          url: 'https://pagesflow.io',                    icon: 'layout',       desc: 'Inspiration pour les landing pages, flows d\'onboarding, pages de pricing des meilleures startups. Parfait pour le web.',                           tag: 'LP & Web' },
              { label: 'Stitch',             url: 'https://stitch.withgoogle.com',           icon: 'pen-tool',     desc: 'Outil Google pour assembler et générer des maquettes UI par description ou en combinant des screenshots. Connecté à Gemini.',                      tag: 'Maquettes' },
              { label: 'Notion',             url: 'https://notion.so',                       icon: 'file-text',    desc: 'Pour créer ton architecture produit : liste des pages, user flow, user stories, tableau de features. Le doc de référence avant le build.',          tag: 'Architecture' },
              { label: 'Whispr Flow',        url: 'https://whisprflow.com',                  icon: 'mic',          desc: 'Dicte à Claude au lieu de taper. Tu parles, Whispr transcrit et envoie directement dans Claude Code ou claude.ai. Gain de temps énorme.',            tag: 'Voix → IA' },
              { label: 'Magic UI',           url: 'https://magicui.design',                  icon: 'sparkles',     desc: 'Composants React animés premium — cards, hero sections, marquees, animations Framer Motion. Copie le code directement.',                           tag: 'Composants' },
              { label: '21st.dev',           url: 'https://21st.dev',                        icon: 'code',         desc: 'Registry de composants UI de startup-grade. Intégrable en MCP dans Claude Code — tu demandes un composant, il l\'installe directement.',             tag: 'MCP Ready' },
              { label: 'Google AI Studio',   url: 'https://aistudio.google.com',             icon: 'image',        desc: 'Générer des images, des maquettes et des visuels avec Gemini directement. Utile pour créer des assets, des illustrations, des mockups.',            tag: 'Visuels IA' },
              { label: 'Nano Banana',        url: 'https://nanobananai.com',                 icon: 'wand2',        desc: 'Générateur d\'images optimisé pour les assets de SaaS (icônes, illustrations, hero images). Les outputs sont directement réutilisables dans Claude Code.', tag: 'Images SaaS' },
              { label: 'Screenlane',         url: 'https://screenlane.com',                  icon: 'monitor',      desc: 'Galerie d\'animations et de micro-interactions UI. Parfait pour trouver l\'inspiration pour les transitions et les états hover/loading.',            tag: 'Animations' },
            ],
          },
          {
            type: 'checklist',
            title: 'Setup initial — à faire une seule fois',
            items: [
              'Créer un compte Mobbin (version gratuite suffisante pour commencer)',
              'Bookmarker PagesFlow dans ton navigateur',
              'Créer un compte Stitch (Google Account requis)',
              'Créer une page Notion dédiée à ton produit (template dans leçon 2.3)',
              'Installer Whispr Flow — testé sur Mac et Windows',
              'Bookmarker Magic UI et 21st.dev — tu y reviendras à chaque build',
            ],
          },
        ],
      },

      // ── 2.2 — S'inspirer intelligemment ─────────────────────────────────
      {
        id: '2.2',
        title: "S'inspirer intelligemment — Mobbin & PagesFlow",
        duration: '10 min',
        body: [],
        blocks: [
          { type: 'text', content: "Ne pars JAMAIS d'une feuille blanche. Les meilleures startups ne réinventent pas la roue — elles copient les patterns qui marchent et les adaptent. Ton job : trouver les meilleurs exemples dans ta catégorie, les analyser, et extraire ce qui fonctionne." },
          {
            type: 'diagram-flow',
            title: 'Workflow inspiration → brief visuel',
            steps: [
              { label: 'Chercher',  sub: 'Mobbin → filtre par type d\'écran (onboarding, pricing, dashboard). PagesFlow → filtre par type de page LP.', color: '#4d96ff' },
              { label: 'Capturer', sub: 'Sauvegarde 10-15 screenshots qui te plaisent. Note ce qui t\'attire : couleurs, disposition, typographie, CTA.', color: '#22c55e' },
              { label: 'Analyser', sub: 'Pour chaque screenshot : qu\'est-ce qui fonctionne ? Pourquoi ? Quel pattern revient dans les meilleures apps ?', color: '#cc5de8' },
              { label: 'Donner à Claude', sub: 'Copie les images dans Claude avec le prompt d\'analyse ci-dessous. Claude extrait les patterns et génère un brief visuel.', color: '#f59e0b' },
              { label: 'Construire sur cette base', sub: 'Utilise le brief visuel comme référence dans tous tes prompts de build.', color: '#22c55e' },
            ],
          },
          { type: 'heading', level: 2, content: 'Comment utiliser Mobbin efficacement' },
          {
            type: 'list',
            style: 'bullets',
            items: [
              { label: 'Filtre par flux (Flows)',   desc: 'Cherche "onboarding", "pricing", "empty states", "dashboard" pour voir exactement comment les meilleures apps traitent chaque écran' },
              { label: 'Filtre par app similaire',  desc: 'Tape le nom d\'un concurrent ou d\'une app que tu admires — vois TOUS leurs écrans dans l\'ordre' },
              { label: 'Compare plusieurs apps',    desc: 'Mets côte à côte 3 apps similaires — les patterns qui se répètent sont les standards UX à respecter' },
              { label: 'Sauvegarde en collections', desc: 'Crée une collection "Mon Produit" et sauvegarde les écrans qui t\'inspirent — tu les donneras à Claude' },
            ],
          },
          { type: 'heading', level: 2, content: 'Ce que tu cherches sur PagesFlow' },
          {
            type: 'list',
            style: 'bullets',
            items: [
              { label: 'Landing pages SaaS',     desc: 'Note la structure : hero → problème → solution → pricing → FAQ → footer. C\'est le standard qui convertit' },
              { label: 'Pages de pricing',       desc: 'Observe comment les meilleurs positionnent les tiers, mettent en valeur le plan recommandé, et construisent la confiance' },
              { label: 'Flows d\'onboarding',   desc: 'Nombre d\'étapes, questions posées, progression — l\'onboarding détermine le taux d\'activation' },
              { label: 'Dashboards app',         desc: 'Organisation de la sidebar, hiérarchie des informations, empty states — l\'UX qui garde les utilisateurs actifs' },
            ],
          },
          {
            type: 'callout',
            variant: 'tip',
            title: 'La méthode Buildrs',
            content: "Chez Buildrs, on passe 30 minutes sur Mobbin avant chaque build. On cherche 3 apps qui font quelque chose de similaire, on capture 10-15 écrans, et on les donne directement à Claude avec un prompt d'analyse. Résultat : Claude comprend exactement le niveau de qualité visuelle attendu et génère du code qui s'en approche dès la première version.",
          },
          {
            type: 'prompt',
            label: "Prompt Claude — Analyse d'interfaces concurrentes",
            content: "Voici [X] screenshots d'apps similaires à mon projet [nom de ton app] : [colle les images]. Analyse ce qui fonctionne dans ces interfaces : 1/ Les patterns UX récurrents (navigation, formulaires, CTA, progression), 2/ Le design system utilisé (couleurs dominantes, typographie, spacing, radius des éléments), 3/ Ce que ces apps font mieux que la moyenne, 4/ Ce que je pourrais faire MIEUX ou différemment pour me différencier. Génère ensuite une description détaillée du design system que je devrais adopter pour mon app, inspiré de ces références.",
          },
          {
            type: 'checklist',
            title: 'À faire pour cette leçon',
            items: [
              'Ouvrir Mobbin — chercher 2-3 apps similaires à ton projet',
              'Sauvegarder 10-15 screenshots inspirants (onboarding, dashboard, pricing)',
              'Ouvrir PagesFlow — capturer 3 landing pages dans ta catégorie',
              'Lancer le prompt Claude avec tes captures pour générer le brief visuel',
              'Sauvegarder le brief visuel dans ta page Notion produit',
            ],
          },
        ],
      },

      // ── 2.3 — Maquetter avec Stitch & Notion ────────────────────────────
      {
        id: '2.3',
        title: 'Maquetter avec Stitch, Notion & Whispr Flow',
        duration: '12 min',
        body: [],
        blocks: [
          { type: 'text', content: "Maintenant que tu as tes inspirations, il faut matérialiser ton produit avant de le coder. On ne parle pas de Figma ou de wireframes complexes — on parle d'une maquette fonctionnelle en 30 minutes que tu donnes directement à Claude." },
          {
            type: 'diagram-flow',
            title: 'Le workflow maquette → architecture → build',
            steps: [
              { label: 'Stitch — Assembler les écrans',    sub: 'Combine tes screenshots d\'inspiration pour créer les 3-5 écrans clés de ton app. Pas de dessin — du collage intelligent.', color: '#4d96ff' },
              { label: 'Notion — Structurer l\'architecture', sub: 'Liste toutes les pages, user flows, et user stories. Le "cahier des charges" léger que Claude va suivre.', color: '#22c55e' },
              { label: 'Whispr Flow — Dicter à Claude', sub: 'Au lieu de taper, tu parles. Décris tes maquettes, ton architecture, tes idées. Whispr transcrit et envoie à Claude Code.', color: '#cc5de8' },
              { label: 'Claude — Générer le code de départ', sub: 'Avec le brief visuel + l\'architecture Notion + tes maquettes Stitch, Claude génère une V1 qui ressemble déjà à quelque chose.', color: '#f59e0b' },
            ],
          },
          { type: 'heading', level: 2, content: 'Stitch — Créer sa maquette en 20 minutes' },
          { type: 'text', content: "Stitch (Google Labs) te permet de décrire un écran en langage naturel ou de combiner des éléments de design existants. Tu n'as pas besoin de savoir dessiner ou utiliser Figma." },
          {
            type: 'list',
            style: 'bullets',
            items: [
              { label: 'Mode Description',   desc: 'Tu décris l\'écran en texte → Stitch génère une maquette HTML/CSS que tu peux affiner. Parfait pour les non-designers.' },
              { label: 'Mode Combinaison',   desc: 'Tu importes des screenshots (de Mobbin par exemple) et Stitch les combine intelligemment en un écran cohérent.' },
              { label: 'Export direct',      desc: 'Le code HTML/CSS généré par Stitch peut être donné directement à Claude Code comme référence visuelle.' },
              { label: 'Les 3 écrans clés', desc: 'Tu as juste besoin de 3 maquettes : landing page / dashboard principal / page de pricing. Pas plus.' },
            ],
          },
          { type: 'heading', level: 2, content: "Notion — L'architecture produit en 10 minutes" },
          {
            type: 'template',
            title: 'Template Architecture Produit — à dupliquer dans Notion',
            sections: [
              {
                label: 'Pages de l\'app (routes)',
                icon: 'layout',
                fields: [
                  { name: '/',            placeholder: 'Landing page — présentation du produit, pricing, CTA inscription',  example: 'Public — non authentifié' },
                  { name: '/signup',      placeholder: 'Inscription — email + mot de passe (ou magic link)',                 example: 'Public' },
                  { name: '/dashboard',  placeholder: 'Dashboard principal — vue principale après connexion',               example: 'Privé — auth requise' },
                  { name: '/settings',   placeholder: 'Paramètres compte — profil, abonnement, billing',                   example: 'Privé — auth requise' },
                  { name: '/[feature]',  placeholder: '[Ta feature principale] — la page de valeur core',                  example: 'Privé — auth requise' },
                ],
              },
              {
                label: 'User Flow principal',
                icon: 'trending-up',
                fields: [
                  { name: 'Étape 1 — Découverte', placeholder: 'Visiteur arrive sur la LP → lit la proposition de valeur → clique sur CTA', example: '' },
                  { name: 'Étape 2 — Signup',     placeholder: 'Formulaire inscription → email de confirmation → connexion', example: '' },
                  { name: 'Étape 3 — Onboarding', placeholder: '3-5 questions clés → personnalisation → arrivée sur dashboard', example: '' },
                  { name: 'Étape 4 — Activation', placeholder: 'L\'utilisateur accomplit l\'action principale pour la 1ère fois → moment "aha !"', example: '' },
                  { name: 'Étape 5 — Conversion', placeholder: 'Fin de période d\'essai → upgrade vers plan payant', example: '' },
                ],
              },
              {
                label: 'User Stories (les 5 essentielles)',
                icon: 'users',
                fields: [
                  { name: 'US 1',  placeholder: 'En tant que visiteur, je veux comprendre ce que fait l\'app en moins de 10 secondes', example: '' },
                  { name: 'US 2',  placeholder: 'En tant que nouvel utilisateur, je veux m\'inscrire en moins de 60 secondes', example: '' },
                  { name: 'US 3',  placeholder: 'En tant qu\'utilisateur, je veux [action principale] en moins de 3 clics', example: '' },
                  { name: 'US 4',  placeholder: 'En tant qu\'utilisateur, je veux voir mes résultats clairement dans le dashboard', example: '' },
                  { name: 'US 5',  placeholder: 'En tant qu\'utilisateur premium, je veux gérer mon abonnement facilement', example: '' },
                ],
              },
            ],
          },
          { type: 'heading', level: 2, content: "Whispr Flow — Dicter à Claude au lieu de taper" },
          {
            type: 'callout',
            variant: 'info',
            title: 'Pourquoi Whispr Flow change tout',
            content: "Taper des prompts longs dans Claude prend du temps et freine ta créativité. Whispr Flow transcrit ta voix en temps réel et l'envoie directement dans Claude Code ou claude.ai. Tu parles naturellement — 3x plus vite qu'en tapant — et Claude reçoit un prompt riche et détaillé. Chez Buildrs, c'est l'outil numéro 1 pour gagner en vitesse sur les phases créatives.",
          },
          {
            type: 'list',
            style: 'bullets',
            items: [
              { label: 'Installation',        desc: 'Télécharger sur whisprflow.com → activer le raccourci global (cmd+espace ou personnalisé)' },
              { label: 'Utilisation design',  desc: 'Ouvre Claude Code → active Whispr → décris ta maquette à voix haute → Whispr transcrit directement dans le prompt' },
              { label: 'Cas d\'usage idéal', desc: 'Décrire un composant complexe, expliquer une correction de bug, dicter l\'architecture d\'une page complète' },
              { label: 'Astuce pro',          desc: 'Parle lentement et clairement. Commence par "Dans mon app React, je veux que tu..." pour que le contexte soit clair' },
            ],
          },
          {
            type: 'checklist',
            title: 'Livrables de cette leçon',
            items: [
              'Ouvrir Stitch et créer la maquette de ton dashboard principal',
              'Créer la maquette de ta landing page',
              'Dupliquer le template Notion ci-dessus et remplir tes pages + user flow',
              'Installer Whispr Flow et faire un test vocal avec Claude',
              'Rassembler : maquettes Stitch + architecture Notion + brief visuel (leçon 2.2) → prêt pour le build',
            ],
          },
        ],
      },

      // ── 2.4 — Ta Direction Artistique ────────────────────────────────────
      {
        id: '2.4',
        title: 'Ta Direction Artistique & ton CLAUDE.md',
        duration: '12 min',
        body: [],
        blocks: [
          { type: 'text', content: "Ta DA (Direction Artistique) = l'identité visuelle de ton produit. Couleurs, typographie, style général — c'est ce qui fait que ton app semble pro ou générique. Et ton CLAUDE.md = le document que Claude lit en premier à chaque session. Bien fait, il t'économise 10 minutes d'explications à chaque fois." },
          {
            type: 'diagram-cards',
            title: 'Les 5 éléments d\'une DA complète',
            items: [
              { icon: 'palette',   label: 'Couleurs',       desc: 'Primaire (CTA, liens) + Fond (background) + Texte + Bordures + Accents. Max 5 couleurs.', color: '#cc5de8' },
              { icon: 'file-text', label: 'Typographie',    desc: 'Titre (display, bold) + Corps (regular, lisible) + Mono (code, chiffres). Max 2 fonts.', color: '#4d96ff' },
              { icon: 'layout',    label: 'Style visuel',   desc: 'Minimal ? Dark ? Coloré ? Glassmorphism ? Le style définit l\'émotion que tu veux créer.', color: '#22c55e' },
              { icon: 'sparkles',  label: 'Composants',     desc: 'Radius des boutons, taille des cards, espacement — le langage visuel cohérent de l\'app.', color: '#f59e0b' },
              { icon: 'tag',       label: 'Ton de marque',  desc: 'Direct ? Amical ? Expert ? La voix de ta marque dans les textes et messages d\'interface.', color: '#ef4444' },
            ],
          },
          { type: 'heading', level: 2, content: 'Définir sa DA avec le skill ui-ux-pro-max' },
          { type: 'text', content: "Dans Claude Code, le skill ui-ux-pro-max est un guide de design intelligence. Il contient 50+ styles, 161 palettes de couleurs, 57 combinaisons de fonts, et les meilleures pratiques UX par type de produit. Utilise-le AVANT de coder ton premier composant." },
          {
            type: 'callout',
            variant: 'tip',
            title: 'Comment utiliser le skill dans Claude Code',
            content: "Dans Claude Code, tape : /ui-ux-pro-max. Claude va te proposer un système de design complet basé sur ton type de produit. Tu peux aussi taper /brainstorming pour co-concevoir ta DA avec Superpowers — Claude te pose des questions, tu réponds, et vous arrivez ensemble à une DA cohérente et mémorable.",
          },
          {
            type: 'prompt',
            label: 'Prompt Claude — Définir sa Direction Artistique',
            content: "Je construis [nom de ton app], un micro-SaaS pour [cible] qui [résout quoi]. C'est un produit [B2B/B2C], [simple/puissant], [sérieux/accessible]. Mon inspiration visuelle vient de ces apps : [liste 3 apps que tu admires]. Génère pour moi : 1/ Une palette de couleurs complète (primary, background, text, border, accent) avec les valeurs hex, 2/ Une combinaison de 2 fonts Google optimale pour ce type de produit, 3/ Le style visuel recommandé (minimal / dark / coloré / corporate), 4/ Les règles de base du design system (radius, spacing, taille des boutons), 5/ Un exemple de code CSS pour les tokens de design. Sois précis et opiniâtre — pas d'options multiples.",
          },
          {
            type: 'prompt',
            label: 'Prompt Claude — Créer son logo en ASCII/SVG',
            content: "Génère un logo pour mon app [nom] qui [fait quoi] pour [cible]. Style : [minimal / géométrique / lettres / symbole]. Couleurs : [ta couleur primaire]. Contraintes : fonctionne en petit (32x32px) et en grand, lisible en dark et light mode. Génère : 1/ Le logo en SVG inline, 2/ Une version icône (24x24px), 3/ Une version texte + icône côte à côte. Format React component TypeScript.",
          },
          { type: 'heading', level: 2, content: 'Ton CLAUDE.md — Le fichier de contexte permanent' },
          { type: 'text', content: "CLAUDE.md est le fichier que Claude Code lit automatiquement au début de chaque session. Il contient le contexte de ton projet — stack, DA, règles, conventions. Plus il est précis, moins tu répètes les mêmes explications à chaque fois. Note : c'est le cœur de ce qu'on appelle les \"Super Pouvoirs Claude\" — une fonctionnalité avancée couverte dans l'Order Bump." },
          {
            type: 'callout',
            variant: 'info',
            title: 'Où placer CLAUDE.md',
            content: "À la racine de ton projet, dans le même dossier que package.json. Claude Code le détecte automatiquement. Tu peux aussi avoir un CLAUDE.md par dossier pour des contextes spécifiques (frontend, backend, etc.).",
          },
          {
            type: 'prompt',
            label: 'Template CLAUDE.md — Starter minimal à copier',
            content: "# CLAUDE.md — [Nom de ton app]\n\n## Produit\n[Nom] : [description en 1 phrase — ce que ça fait pour qui]\nDomaine : [ton-domaine.fr]\n\n## Stack\n- Frontend : React 18 + TypeScript + Vite\n- CSS : Tailwind CSS v3 + CSS variables HSL\n- Backend : Supabase (PostgreSQL + Auth + Edge Functions)\n- Paiements : Stripe (Checkout + Webhooks)\n- Deploy : Vercel\n- Icons : Lucide React (strokeWidth={1.5} obligatoire)\n\n## Direction Artistique\n- Mode : [dark / light]\n- Fond : [couleur hex]\n- Primaire (CTA) : [couleur hex]\n- Font : [Font display] + [Font corps]\n- Style : [minimal / coloré / corporate]\n- Radius : [4px / 8px / 12px]\n\n## Règles absolues\n- Zéro emoji dans le code — uniquement icônes SVG Lucide\n- Toujours TypeScript strict — pas de `any`\n- Variables d'environnement dans .env.local — jamais en dur\n- Supabase RLS activé sur toutes les tables\n- Mobile-first responsive\n\n## Commandes utiles\n```bash\nnpx vite build && npx serve dist --listen 3000  # Preview local\nsupabase db push                                 # Pousser les migrations\nvercel --prod                                    # Deploy production\n```",
          },
          {
            type: 'checklist',
            title: 'Livrables de cette leçon',
            items: [
              'Lancer le prompt DA dans Claude et valider les couleurs + fonts',
              'Générer ton logo avec le prompt SVG',
              'Créer le fichier CLAUDE.md à la racine de ton projet',
              'Remplir la section DA de ton CLAUDE.md avec les valeurs générées',
              'Tester : ouvre Claude Code, tape @CLAUDE.md — Claude devrait répondre avec le contexte',
            ],
          },
        ],
      },

      // ── 2.5 — Composants premium & visuels IA ────────────────────────────
      {
        id: '2.5',
        title: "Composants premium & visuels IA",
        duration: '10 min',
        body: [],
        blocks: [
          { type: 'text', content: "Tu as ta DA. Tu as tes maquettes. Maintenant on passe à l'exécution. Au lieu de coder tes composants de zéro, tu vas les récupérer depuis les meilleures bibliothèques du marché — et générer tes visuels directement avec l'IA." },
          { type: 'text', content: "C'est exactement ce qu'on fait chez Buildrs sur chaque produit : Magic UI pour les animations, 21st.dev via MCP pour les composants, Nano Banana pour les images. Résultat : un produit qui ressemble à une startup financée dès la V1." },
          { type: 'heading', level: 2, content: 'Magic UI — Composants animés React' },
          {
            type: 'list',
            style: 'bullets',
            items: [
              { label: 'Ce que c\'est',    desc: 'Bibliothèque de composants React animés avec Framer Motion. Hero sections, cartes, marquees, typing effects, shimmer — le niveau visuel des meilleures startups.' },
              { label: 'Comment utiliser', desc: 'Va sur magicui.design → parcours le catalogue → clique sur le composant → copie le code → colle dans Claude Code en disant "intègre ce composant dans mon app en respectant ma DA".' },
              { label: 'Les essentiels',   desc: 'AnimatedBeam (diagrammes), BorderBeam (glow), MorphingCard (transforms), WordRotate (hero), Marquee (logos), NumberTicker (stats), BlurFade (transitions).' },
              { label: 'Astuce Buildrs',   desc: 'On copie 3-5 composants Magic UI dans Claude en une seule fois avec le prompt "adapte ces composants à ma DA : [CLAUDE.md]". Résultat en 2 minutes.' },
            ],
          },
          { type: 'heading', level: 2, content: '21st.dev — Composants en MCP dans Claude Code' },
          { type: 'text', content: "21st.dev est encore plus puissant : c'est un registre de composants UI de startup-grade, directement intégré dans Claude Code via le protocole MCP. Tu ne quittes plus ton terminal — tu demandes un composant, il l'installe." },
          {
            type: 'diagram-flow',
            title: 'Setup 21st.dev MCP — 3 étapes',
            steps: [
              { label: 'Installer le MCP',       sub: 'Dans Claude Code : Settings → MCP Servers → Ajouter "21st.dev" → récupérer ton API key sur 21st.dev/mcp', color: '#4d96ff' },
              { label: 'Demander un composant',  sub: 'Dans Claude Code : "/21 [description du composant]" → Claude cherche dans le registre et propose les meilleurs résultats', color: '#22c55e' },
              { label: 'Installer et adapter',   sub: 'Claude installe le composant dans ton projet et l\'adapte automatiquement à ta DA (couleurs, fonts, style)', color: '#cc5de8' },
            ],
          },
          {
            type: 'callout',
            variant: 'tip',
            title: 'Exemples de commandes 21st.dev dans Claude Code',
            content: '"/21 pricing table with 3 tiers" — "/21 dashboard sidebar with navigation" — "/21 hero section with CTA and gradient" — "/21 onboarding steps component". Claude trouve, installe, et adapte à ton projet en quelques secondes.',
          },
          { type: 'heading', level: 2, content: 'Google AI Studio & Nano Banana — Visuels générés par IA' },
          {
            type: 'diagram-cards',
            title: 'Deux outils, deux usages',
            items: [
              { icon: 'image', label: 'Google AI Studio', desc: 'Gemini 2.0 Flash Image pour générer illustrations, hero images, mockups d\'app, icônes customisées. Qualité studio en quelques secondes.', color: '#4d96ff' },
              { icon: 'wand2', label: 'Nano Banana',      desc: 'Spécialisé SaaS assets : icônes app, screenshots stylisés, illustrations product. Les outputs sont directement exploitables dans Claude Code.', color: '#22c55e' },
            ],
          },
          {
            type: 'prompt',
            label: 'Prompt Google AI Studio — Hero image SaaS',
            content: "Génère une hero image pour une app SaaS appelée [nom] qui aide [cible] à [résoudre quoi]. Style : [minimal / futuriste / professionnel]. Palette : [tes couleurs DA]. L'image doit contenir : une interface de dashboard épurée en perspective 3D légère, fond dégradé de [couleur fond] à [couleur secondaire], aucun texte dans l'image, format 16:9, qualité maximale.",
          },
          {
            type: 'prompt',
            label: 'Prompt Claude Code — Intégrer un asset généré',
            content: "J'ai généré cette image [colle l'image] avec Google AI Studio pour la hero section de mon app [nom]. Intègre-la dans ma landing page React comme hero background avec : 1/ Un overlay gradient léger pour assurer la lisibilité du texte, 2/ Un effet de parallax léger au scroll (CSS only), 3/ Un fallback pour les connexions lentes. Respecte ma DA : fond [couleur], texte [couleur], font [font name].",
          },
          {
            type: 'callout',
            variant: 'action',
            title: 'Récapitulatif du workflow Module 02',
            content: "Inspiration (Mobbin + PagesFlow) → Maquettes (Stitch) → Architecture (Notion) → Voix IA (Whispr Flow) → DA (ui-ux-pro-max + prompts) → CLAUDE.md → Composants (Magic UI + 21st.dev MCP) → Visuels (Google AI Studio + Nano Banana) → Build (Module 03). Tu as maintenant tout ce qu'il faut pour que Claude construise exactement ce que tu as en tête.",
          },
          {
            type: 'checklist',
            title: 'Avant de passer au Module 3',
            items: [
              'Récupérer 3-5 composants Magic UI adaptés à ton projet',
              'Configurer le MCP 21st.dev dans Claude Code',
              'Générer au moins une image/illustration avec Google AI Studio ou Nano Banana',
              'Ton CLAUDE.md est complet avec DA + stack + règles',
              'Tes maquettes Stitch + architecture Notion sont prêtes',
              'Tu as un brief visuel complet = tu es prêt à builder au Module 3',
            ],
          },
          {
            type: 'quiz-inline',
            question: "Parmi ces approches, laquelle est la plus efficace pour avoir un produit pro en 72h ?",
            options: [
              "Coder tous les composants de zéro pour avoir quelque chose d'unique",
              "Copier des composants depuis Magic UI / 21st.dev et les adapter à sa DA",
              "Utiliser un template Tailwind générique sans personnalisation",
              "Ne pas se préoccuper du design avant que le produit fonctionne",
            ],
            correctIndex: 1,
            explanation: "Les meilleurs product builders utilisent des composants éprouvés et les adaptent à leur DA. Coder de zéro = perdre 80% du temps sur le design au lieu des fonctionnalités. L'adaptation intelligente est la compétence clé.",
          },
        ],
      },
    ],
    quizQuestions: [
      {
        id: 'q02-1',
        question: 'À quoi sert CLAUDE.md dans ton projet ?',
        options: [
          "C'est de la documentation pour les autres développeurs",
          "C'est le fichier que Claude lit à chaque session pour comprendre le contexte de ton projet",
          "C'est le fichier de configuration Vite",
          "C'est pour les tests automatisés",
        ],
        correctIndex: 1,
        explanation: "CLAUDE.md est le fichier de contexte permanent que Claude lit au début de chaque session. Il contient ton stack, ta DA, tes règles. Plus il est précis, moins tu répètes les mêmes explications.",
      },
      {
        id: 'q02-2',
        question: 'Pourquoi utiliser Mobbin avant de coder ?',
        options: [
          "Pour copier exactement le design d'une autre app",
          "Pour identifier les patterns UX qui marchent et donner à Claude des références visuelles précises",
          "Pour trouver des idées de fonctionnalités",
          "Pour éviter d'utiliser Figma",
        ],
        correctIndex: 1,
        explanation: "Mobbin te permet d'identifier les standards UX de ta catégorie de produit et de donner à Claude des références visuelles précises — ce qui améliore drastiquement la qualité du code généré.",
      },
      {
        id: 'q02-3',
        question: "Quelle est la règle d'or pour une DA de SaaS ?",
        options: [
          "Plus de couleurs = plus de personnalité",
          "Maximum 5 couleurs, 2 fonts, un style cohérent — la clarté prime sur la créativité",
          "Toujours utiliser du violet car c'est la couleur des startups",
          "Copier exactement la DA d'une app existante",
        ],
        correctIndex: 1,
        explanation: "Une DA efficace = max 5 couleurs, max 2 fonts, un style visuel cohérent. La clarté et la cohérence créent la perception de qualité, pas la quantité d'éléments visuels.",
      },
    ],
  },
  {
    id: '03',
    title: 'Architecturer mon produit',
    description: 'Les fondations solides de ton produit.',
    icon: 'Building2',
    lessons: [
      {
        id: '3.1',
        title: 'Planifier avant de coder',
        duration: '10 min',
        body: [],
        blocks: [
          { type: 'text', content: "20 minutes de planification = 5 heures de gagnées. C'est la règle d'or chez Buildrs. Avant d'ouvrir Claude Code, tu dois savoir exactement ce que tu construis : quelles pages, quelle base de données, quel flux utilisateur. Claude a besoin d'un contexte précis pour générer du code pertinent." },
          {
            type: 'diagram-cards',
            title: "Les 4 composantes d'une bonne architecture",
            items: [
              { icon: 'layout',      label: 'Les pages',    desc: 'Liste exhaustive des routes et leur rôle : landing, auth, dashboard, pricing, settings, API...', color: '#4d96ff' },
              { icon: 'database',    label: 'La BDD',       desc: 'Schéma Supabase : tables, colonnes, types, relations. La structure de tes données.',             color: '#22c55e' },
              { icon: 'user',        label: "L'auth",       desc: 'Comment les users se connectent. Email, Google, magic link. Qui voit quoi (RLS).',               color: '#cc5de8' },
              { icon: 'credit-card', label: 'Le paiement',  desc: 'Produits Stripe, webhooks, gestion des abonnements. Qui peut accéder à quoi selon le plan.',     color: '#f59e0b' },
            ],
          },
          {
            type: 'diagram-flow',
            title: 'Le workflow de planification Buildrs',
            steps: [
              { label: 'Brief produit',    sub: "Tu as déjà ton brief du Module 1. C'est ta base.",                        color: '#4d96ff' },
              { label: 'Liste des pages',  sub: "Toutes les routes de l'app + leur rôle exact.",                           color: '#22c55e' },
              { label: 'Schéma BDD',       sub: 'Tables Supabase avec colonnes et types.',                                 color: '#cc5de8' },
              { label: 'Flux utilisateur', sub: "De l'inscription au paiement : chaque étape.",                            color: '#f59e0b' },
              { label: 'Prompt architecte',sub: "Donne tout ça à Claude → il génère le code de départ.",                  color: '#22c55e' },
            ],
          },
          {
            type: 'prompt',
            label: 'Prompt Architecte — le prompt de base',
            content: "Tu es un architecte senior full-stack. Je veux construire [TON PRODUIT].\n\nBrief : [colle ton brief produit complet]\n\nGénère :\n1. PAGES : Liste exhaustive des routes React avec leur rôle (ex: /dashboard - vue principale connectée)\n2. BDD SUPABASE : Toutes les tables avec colonnes, types et relations. Format :\n   - table_name : col1 (type), col2 (type), user_id (uuid, FK→auth.users)\n3. RLS SUPABASE : Politiques de sécurité (qui peut lire/écrire quoi)\n4. AUTH FLOW : Méthodes d'auth + redirect après login\n5. STRIPE : Produits, prix, webhooks nécessaires\n6. STRUCTURE DU PROJET : Arborescence des fichiers principaux\n\nSois précis et complet — je lance le build immédiatement après.",
          },
          {
            type: 'template',
            title: 'Template Notion — Architecture produit',
            sections: [
              {
                label: 'Pages & Routes',
                icon: 'layout',
                fields: [
                  { name: 'Page publique (landing)',  placeholder: 'Route : / — Visible par tous — CTA vers inscription',           example: '/ — Landing page avec hero, features, pricing, CTA' },
                  { name: 'Auth',                     placeholder: 'Routes : /login /signup /reset-password',                       example: '/login — Connexion email + Google OAuth' },
                  { name: 'Dashboard',                placeholder: 'Route : /dashboard — Accessible connectés uniquement',          example: '/dashboard — Vue principale post-auth' },
                  { name: 'Settings',                 placeholder: 'Route : /settings — Profil + abonnement + billing',             example: '/settings — Gérer son compte et son plan' },
                ],
              },
              {
                label: 'Base de données',
                icon: 'database',
                fields: [
                  { name: 'Table users (extended)',   placeholder: 'id, email, full_name, avatar_url, plan, stripe_customer_id, created_at', example: 'Extension du auth.users Supabase' },
                  { name: 'Table principale',         placeholder: '[nom_table] : id, user_id (FK), data_principale, created_at, updated_at', example: 'Ex: table "projects" pour un générateur de projets' },
                  { name: 'Table subscriptions',      placeholder: 'id, user_id (FK), stripe_sub_id, status, plan, current_period_end',       example: 'Pour tracker les abonnements Stripe' },
                ],
              },
              {
                label: 'Auth & Sécurité',
                icon: 'shield',
                fields: [
                  { name: "Méthodes d'auth",          placeholder: 'Email + password / Google OAuth / Magic link',                  example: 'Email + Google OAuth (les 2 les plus courants)' },
                  { name: 'RLS principal',             placeholder: 'USERS CAN ONLY SEE THEIR OWN DATA',                            example: 'auth.uid() = user_id pour toutes les tables' },
                  { name: 'Redirect post-auth',        placeholder: 'Après login → /dashboard. Après signup → /onboarding',         example: 'Nouvel user → onboarding → dashboard' },
                ],
              },
            ],
          },
          { type: 'callout', variant: 'tip', title: "Règle d'or", content: "Écris l'architecture dans Notion AVANT de la donner à Claude. Le process de rédaction t'oblige à clarifier ce que tu veux vraiment. Les zones floues dans ton doc = les bugs dans le code." },
          {
            type: 'checklist',
            title: 'Avant de passer au Module 4',
            items: [
              "Lancer le Prompt Architecte dans Claude avec ton brief complet",
              "Sauvegarder l'architecture générée dans Notion",
              "Vérifier que toutes les pages sont listées",
              "Vérifier que le schéma BDD couvre tous les besoins",
              "Confirmer les méthodes d'auth (email + Google = recommandé)",
              "Lister les produits Stripe et leurs prix",
            ],
          },
          {
            type: 'cohorte-cta',
            title: 'Ton architecture est complexe ?',
            description: "La cohorte Buildrs, c'est 30 jours pour construire et lancer ton premier SaaS avec Alfred et l'équipe. Architecture, code, deploy, clients — on fait tout ensemble.",
            price: '797€',
            features: [
              'Architecture revue par Alfred personnellement',
              "Accès direct à l'équipe Buildrs par WhatsApp",
              'Séances live hebdomadaires (4 par mois)',
              "Templates d'apps prêts à forker",
              'Accès à vie au Buildrs Lab',
            ],
          },
          {
            type: 'cal-booking',
            title: 'Une question sur ton architecture ?',
            subtitle: "Réserve 15 minutes avec l'équipe Buildrs — on regarde ça ensemble.",
            calUrl: 'https://cal.com/buildrs/15min',
          },
        ],
      },
    ],
    quizQuestions: [
      {
        id: 'q03-1',
        question: 'Pourquoi planifier avant de coder ?',
        options: [
          'Pour faire plaisir au prof',
          "20 minutes de planification = 5 heures gagnées — Claude code mieux avec un contexte précis",
          "C'est optionnel si tu es rapide",
          "Pour créer de la documentation",
        ],
        correctIndex: 1,
        explanation: "Le contexte précis que tu donnes à Claude détermine la qualité du code généré. Une architecture floue = du code flou = des heures de debug.",
      },
    ],
  },
  {
    id: '04',
    title: 'Construire le MVP',
    description: "On code. Enfin, Claude code. Toi tu diriges.",
    icon: 'Hammer',
    lessons: [

      // ── 4.1 — VS Code + Claude Code + GitHub ─────────────────────────────
      {
        id: '4.1',
        title: 'VS Code + Claude Code + GitHub — ton cockpit',
        duration: '12 min',
        body: [],
        blocks: [
          { type: 'text', content: "Chez Buildrs, on ne code pas dans une interface web — on code depuis le terminal, avec Claude Code comme copilote. C'est plus rapide, plus précis, et tu gardes le contrôle total de ton projet. Ce setup est exactement ce qu'on utilise pour chaque produit qu'on lance." },
          {
            type: 'diagram-flow',
            title: 'Le pipeline de développement Buildrs',
            steps: [
              { label: 'VS Code',      sub: "Ton IDE. Tu vois le code, tu navigues dans les fichiers, tu exécutes les commandes.", color: '#4d96ff' },
              { label: 'Claude Code',  sub: "L'IA qui code pour toi depuis le terminal. Intégré dans VS Code.",                    color: '#cc5de8' },
              { label: 'GitHub',       sub: "Sauvegarde en temps réel. Chaque étape du build = un commit.",                       color: '#71717a' },
              { label: 'Vercel',       sub: "Chaque push GitHub = preview automatique. Prod en 1 clic.",                          color: '#22c55e' },
            ],
          },
          {
            type: 'links',
            title: 'Les 3 outils à installer maintenant',
            items: [
              { label: 'VS Code',        url: 'https://code.visualstudio.com/download', icon: 'monitor',     desc: "L'IDE de référence. Gratuit, puissant, compatible avec tous les plugins. Télécharge la version stable.", tag: 'Installer' },
              { label: 'Claude Code',    url: 'https://claude.ai/code',                 icon: 'brain',        desc: "L'agent IA de build. S'installe via npm : `npm install -g @anthropic-ai/claude-code`. Lance depuis le terminal dans ton dossier projet.", tag: 'npm install' },
              { label: 'GitHub Desktop', url: 'https://desktop.github.com',             icon: 'git-branch',   desc: "Interface visuelle pour Git. Crée un repo, commit, push — sans ligne de commande si tu débutes.", tag: 'Interface' },
            ],
          },
          {
            type: 'list',
            title: 'Extensions VS Code recommandées',
            style: 'bullets',
            items: [
              { label: 'Tailwind CSS IntelliSense', desc: 'Autocomplétion des classes Tailwind. Indispensable.' },
              { label: 'ESLint + Prettier',         desc: 'Formatage automatique du code. Évite les bugs de syntaxe.' },
              { label: 'Supabase (officiel)',        desc: "Connexion directe à ta BDD depuis VS Code." },
              { label: 'GitLens',                   desc: "Voir qui a écrit quoi, historique complet dans l'éditeur." },
            ],
          },
          {
            type: 'prompt',
            label: 'Prompt Claude Code — Initialiser le projet',
            content: "Initialise un nouveau projet React TypeScript avec Vite pour [NOM DE TON APP].\n\nConfiguration :\n- React 18 + TypeScript strict\n- Tailwind CSS v3\n- React Router v6 (routes : /, /login, /dashboard, /settings)\n- Supabase client (@supabase/supabase-js)\n- Structure de dossiers : src/components/, src/pages/, src/lib/, src/hooks/\n- Variables d'environnement : .env.local avec VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY\n- Package.json avec scripts : dev, build, preview\n\nCrée tous les fichiers de base avec le boilerplate minimal. Génère aussi un README avec les étapes de setup.",
          },
          { type: 'callout', variant: 'tip', title: 'La méthode Buildrs pour GitHub', content: "1 feature = 1 commit. Dès que tu as quelque chose qui fonctionne — même petit — tu commites. Ça te donne des points de retour en cas de bug, et ça montre la progression à Vercel pour les previews automatiques." },
          {
            type: 'prompt',
            label: 'Prompt Claude Code — Premier commit GitHub',
            content: "Mon projet est initialisé. Aide-moi à :\n1. Initialiser git dans ce dossier\n2. Créer un .gitignore complet (node_modules, .env*, dist/, .DS_Store)\n3. Faire le premier commit avec le message 'init: scaffold React + Vite + Tailwind'\n4. Connecter au repo GitHub [URL DU REPO]\n5. Pousser sur la branche main\n\nEnsuite, explique-moi le workflow : à quel moment commiter pendant le build ?",
          },
          {
            type: 'checklist',
            title: 'Setup terminé quand :',
            items: [
              'VS Code installé avec les extensions recommandées',
              'Claude Code installé (`claude --version` dans le terminal)',
              'Repo GitHub créé (public ou privé)',
              'Projet initialisé et premier commit fait',
              'Vercel connecté au repo GitHub (preview automatique actif)',
            ],
          },
        ],
      },

      // ── 4.2 — Supabase Auth + MCP ─────────────────────────────────────────
      {
        id: '4.2',
        title: 'Supabase Auth + MCP — la base de ton app',
        duration: '15 min',
        body: [],
        blocks: [
          { type: 'text', content: "Supabase = le backend complet de ton SaaS. Base de données PostgreSQL, auth, storage, edge functions — tout en un. Et le MCP Supabase permet à Claude Code de se connecter DIRECTEMENT à ta base depuis le terminal. Plus besoin de copier-coller les schémas : Claude les lit et les modifie en direct." },
          {
            type: 'diagram-flow',
            title: 'Flow complet Supabase dans ton app',
            steps: [
              { label: 'Créer le projet',   sub: 'supabase.com → New Project. Copie l\'URL et l\'anon key dans .env.local.',      color: '#22c55e' },
              { label: "Configurer l'auth", sub: 'Authentication → Providers → activer Email + Google OAuth.',                    color: '#4d96ff' },
              { label: 'Créer les tables',  sub: 'Depuis le dashboard OU via Claude Code avec le MCP branché.',                   color: '#cc5de8' },
              { label: 'Configurer RLS',    sub: 'Row Level Security sur chaque table : les users ne voient que leurs données.',   color: '#f59e0b' },
              { label: 'Brancher React',    sub: "supabaseClient.ts → hooks d'auth → protection des routes.",                     color: '#22c55e' },
            ],
          },
          {
            type: 'links',
            title: 'Liens Supabase essentiels',
            items: [
              { label: 'Supabase Dashboard', url: 'https://supabase.com/dashboard',                             icon: 'database', desc: 'Ton interface de gestion BDD. Crée tes tables, gère l\'auth, vois les logs.',                                                               tag: 'Dashboard' },
              { label: 'MCP Supabase',       url: 'https://supabase.com/docs/guides/getting-started/mcp',       icon: 'brain',    desc: 'Configure le MCP pour que Claude Code se connecte directement à ta base. 3 lignes dans settings.json.',                                   tag: 'MCP' },
              { label: 'Supabase Auth',      url: 'https://supabase.com/docs/guides/auth',                      icon: 'shield',   desc: 'Documentation officielle pour l\'authentification. Email, OAuth, magic link.',                                                           tag: 'Docs' },
            ],
          },
          {
            type: 'prompt',
            label: 'Prompt Claude Code — Configurer le MCP Supabase',
            content: "Configure le MCP Supabase dans Claude Code pour ce projet.\n\nMes credentials Supabase :\n- Project URL : [SUPABASE_URL]\n- Service Role Key : [SERVICE_ROLE_KEY] (dans Settings → API)\n\nÉtapes :\n1. Modifier ~/.claude/settings.json pour ajouter le MCP Supabase\n2. Vérifier la connexion avec une requête test\n3. Lister les tables existantes\n\nUne fois le MCP actif, on pourra créer les tables directement depuis ici sans passer par le dashboard.",
          },
          {
            type: 'prompt',
            label: 'Prompt Claude Code — Auth complète + tables',
            content: "Avec le MCP Supabase connecté, configure l'auth et crée les tables pour mon app.\n\nMon architecture (depuis le Module 3) :\n[COLLE TON ARCHITECTURE ICI]\n\nFais :\n1. Activer Email + Google OAuth dans Supabase Auth\n2. Créer la table `profiles` liée à auth.users avec RLS\n3. Créer les tables de mon app (selon l'architecture)\n4. Configurer les policies RLS sur chaque table\n5. Générer le client Supabase TypeScript (src/lib/supabase.ts)\n6. Créer le hook useAuth (src/hooks/useAuth.ts) avec signIn, signUp, signOut, user\n7. Créer le composant ProtectedRoute qui redirige si non connecté\n\nTest en temps réel depuis le MCP.",
          },
          { type: 'callout', variant: 'info', title: 'Co-work avec Claude Code', content: "Claude Code peut effectuer plusieurs tâches en parallèle. Pendant qu'il crée tes tables Supabase, demande-lui aussi de générer les hooks React — il jongle entre les deux contextes. Tu diriges, il exécute." },
          {
            type: 'checklist',
            title: 'Supabase configuré quand :',
            items: [
              'Projet Supabase créé avec URL et anon key dans .env.local',
              'MCP Supabase connecté dans Claude Code (testé avec requête)',
              'Auth activée : Email + Google OAuth',
              'Table profiles créée avec trigger sur auth.users',
              'Toutes les tables de l\'architecture créées',
              'RLS activé et policies configurées sur chaque table',
              'Hook useAuth fonctionnel avec signIn/signOut/user',
              'ProtectedRoute en place sur les routes privées',
            ],
          },
        ],
      },

      // ── 4.3 — Feature core — méthode Buildrs ─────────────────────────────
      {
        id: '4.3',
        title: 'La feature core — méthode Buildrs',
        duration: '20 min',
        body: [],
        blocks: [
          { type: 'text', content: "Tu as ton setup, ton auth, ta BDD. Maintenant on construit LA feature qui justifie le paiement. Pas 10 fonctionnalités — une seule, parfaite. C'est la règle des 72h : une feature core irréprochable vaut mieux qu'une app de 20 features médiocres." },
          { type: 'text', content: "Chez Buildrs, on travaille en boucles courtes. Chaque boucle = 1 fonctionnalité. On demande, Claude construit, on teste, on valide, on commit. Puis on passe à la suivante. Jamais plus d'une heure sans un preview fonctionnel." },
          {
            type: 'diagram-flow',
            title: 'La méthode build Buildrs — boucles courtes',
            steps: [
              { label: 'Définir la boucle',  sub: "1 fonctionnalité précise. Ex: \"L'user peut créer un projet avec nom + description\".",     color: '#4d96ff' },
              { label: 'Prompt Claude Code', sub: "Contexte complet (architecture + code existant) + demande précise de la feature.",           color: '#cc5de8' },
              { label: 'Tester',             sub: "`npx vite preview` → ouvrir dans le nav → tester le flux complet.",                          color: '#22c55e' },
              { label: 'Corriger',           sub: "Bug ou UX issue → prompt de correction immédiat. Jamais \"je verrai plus tard\".",            color: '#ef4444' },
              { label: 'Commit + suivante',  sub: "git commit + push. Vercel génère un preview. On continue.",                                  color: '#22c55e' },
            ],
          },
          {
            type: 'prompt',
            label: 'Prompt Claude Code — La feature core complète',
            content: "Construis la feature principale de mon app.\n\nMon app : [DESCRIPTION]\nFeature core : [TA FEATURE — ex: \"L'user peut générer un rapport PDF depuis son dashboard\"]\n\nContexte technique :\n- Stack : React 18 + TypeScript + Tailwind + Supabase\n- Tables concernées : [liste les tables]\n- L'user est déjà connecté (useAuth hook disponible)\n\nCe que tu dois créer :\n1. La page/composant principal de la feature\n2. La logique métier (hooks ou service)\n3. Les appels Supabase (CRUD)\n4. L'UI complète avec états loading/error/empty\n5. La validation des formulaires si applicable\n6. Connecter à la navigation existante\n\nSois précis, utilise TypeScript strict, et génère du code production-ready.",
          },
          {
            type: 'prompt',
            label: 'Prompt Claude Code — Multi-agent co-work',
            content: "On va travailler sur plusieurs parties en parallèle.\n\nTask 1 (prioritaire) : Construire [FEATURE A]\nTask 2 (pendant ce temps) : Générer les types TypeScript pour [FEATURE B]\nTask 3 (background) : Optimiser les requêtes Supabase dans [FICHIER]\n\nPour chaque task :\n- Commence par Task 1\n- Quand tu attends une réponse Supabase, avance sur Task 2\n- Commite chaque task séparément avec un message clair\n\nSignale quand une task est terminée avant de passer à la suivante.",
          },
          {
            type: 'prompt',
            label: 'Prompt Claude Code — Debug et polish',
            content: "Analyse le code actuel de mon app et :\n\n1. BUGS : Identifie les potentiels bugs (async/await manquants, null checks, types incorrects)\n2. UX : Identifie les états manquants (loading, error, empty state, mobile)\n3. PERFORMANCE : Identifie les requêtes Supabase inefficaces (N+1, select *)\n4. SÉCURITÉ : Vérifie que les données utilisateur sont bien protégées côté client\n\nPour chaque problème trouvé : explique le problème + propose le fix + applique-le.\n\nTermine par une checklist des points restants à améliorer avant le déploiement.",
          },
          { type: 'callout', variant: 'action', title: 'Checkpoint 72h', content: "À ce stade, ton app doit avoir : l'auth qui fonctionne, les tables créées, et la feature core buildable et testable. Si tu es là, tu es dans les temps. Concentre-toi sur la feature core uniquement — le reste peut attendre la V2." },
          {
            type: 'checklist',
            title: 'Module 4 terminé quand :',
            items: [
              'Feature core complète et fonctionnelle (pas parfaite — fonctionnelle)',
              'Auth signup/login/logout testé avec un vrai compte',
              'Données bien sauvegardées en BDD (vérifier dans Supabase dashboard)',
              'Tous les états UI présents : loading, error, empty, success',
              'Mobile responsive testé (Chrome DevTools → iPhone 375px)',
              'Au moins 5 commits propres sur GitHub',
              'Preview Vercel fonctionnel avec les vraies features',
            ],
          },
          {
            type: 'cohorte-cta',
            title: 'Tu veux aller 10x plus vite ?',
            description: "La cohorte Build in 30 Days, c'est Alfred et l'équipe Buildrs qui construisent avec toi pendant 30 jours. Tu livres un produit live et monétisé — pas seul, avec nous.",
            price: '797€',
            features: [
              'Review de code chaque semaine avec Alfred',
              'Sessions live de build (on code ensemble)',
              'Support direct sur ta feature core',
              "Templates d'apps prêts à forker et modifier",
              "Accès à toute la stack Buildrs (outils + workflows)",
              "Accès à vie au Buildrs Lab et à la communauté",
            ],
          },
          {
            type: 'cal-booking',
            title: 'Une question sur ton build ?',
            subtitle: "Réserve 15 minutes avec l'équipe Buildrs. On regarde ton code ensemble.",
            calUrl: 'https://cal.com/buildrs/15min',
          },
        ],
      },
      // ── 4.4 — Intégrer des agents IA dans ton produit ────────────────────
      {
        id: '4.4',
        title: 'Intégrer des agents IA — le SaaS 2.0',
        duration: '12 min',
        body: [],
        blocks: [
          { type: 'text', content: "Un SaaS classique vend de l'accès à un outil. Un SaaS IA vend du travail accompli. La différence : à l'intérieur du produit, des agents agissent pour chaque utilisateur, 24h/24. Ce n'est pas une feature en plus — c'est un changement de paradigme complet sur ce que ton produit délivre." },
          { type: 'text', content: "Concrètement : ton user arrive sur ton app, décrit ce qu'il veut obtenir, et un agent Claude prend en charge l'exécution. Analyse, rédaction, recherche, transformation de données — le travail est fait, pas juste facilité. C'est ça la valeur perçue incomparable." },
          {
            type: 'diagram-cards',
            title: 'SaaS classique vs SaaS IA',
            items: [
              { icon: 'mouse-pointer', label: 'SaaS classique',    desc: "L'user utilise l'outil. Il fait le travail lui-même, l'app est le support.",       color: '#71717a' },
              { icon: 'brain',         label: 'SaaS IA',           desc: "L'agent fait le travail. L'user dirige, l'IA exécute. Le produit délivre un résultat.", color: '#cc5de8' },
              { icon: 'trending-up',   label: 'Valeur perçue',     desc: "Multiplier par 3 à 5 la valeur perçue sans changer le prix. La rétention explose.", color: '#22c55e' },
              { icon: 'repeat',        label: 'Rétention',         desc: "Un agent qui devient indispensable au quotidien = churn proche de zéro.",           color: '#4d96ff' },
            ],
          },
          {
            type: 'diagram-flow',
            title: "Architecture d'un agent dans ton SaaS",
            steps: [
              { label: "User donne l'input",    sub: "Formulaire, prompt, upload fichier — l'user définit ce qu'il veut obtenir.",                   color: '#4d96ff' },
              { label: 'Edge Function Supabase', sub: "La requête passe par ton backend sécurisé. Ta clé Anthropic n'est jamais exposée côté client.", color: '#f59e0b' },
              { label: 'Claude API traite',      sub: "L'agent analyse, génère, transforme — avec le contexte de l'user stocké en BDD.",              color: '#cc5de8' },
              { label: 'Résultat en BDD',        sub: "Le résultat est sauvegardé dans Supabase, consultable à tout moment.",                         color: '#22c55e' },
              { label: "User reçoit le travail", sub: "Rapport, contenu, données — livré directement dans l'interface. Travail fait.",                color: '#22c55e' },
            ],
          },
          { type: 'callout', variant: 'info', title: 'Règle absolue — sécurité', content: "Ta clé Anthropic (ANTHROPIC_API_KEY) ne doit JAMAIS être dans le code frontend. Toujours dans une Edge Function Supabase côté serveur. Si elle est exposée côté client, elle peut être volée et utilisée à tes frais." },
          {
            type: 'prompt',
            label: 'Prompt Claude Code — Edge Function avec Claude API',
            content: "Crée une Edge Function Supabase qui appelle l'API Claude pour ma feature IA.\n\nMa feature : [DESCRIPTION — ex: \"L'user soumet une description de son business et reçoit 5 idées de SaaS adaptées\"]\n\nCe que la fonction doit faire :\n1. Recevoir la requête de l'user (POST avec JSON body)\n2. Vérifier l'auth Supabase (JWT token dans le header)\n3. Construire le prompt avec le contexte de l'user\n4. Appeler claude-sonnet-4-6 via l'API Anthropic\n5. Sauvegarder le résultat dans la table [NOM TABLE]\n6. Retourner le résultat au frontend\n\nContraintes :\n- ANTHROPIC_API_KEY uniquement en Deno.env.get() — jamais exposée\n- Gestion d'erreurs complète avec codes HTTP appropriés\n- Streaming si la réponse est longue (>2 secondes d'attente)\n- Rate limiting simple : max 10 appels/jour par user\n\nStack : Deno + Supabase Edge Functions.",
          },
          {
            type: 'prompt',
            label: 'Prompt Claude Code — Brancher le frontend à la Edge Function',
            content: "Crée le composant React qui appelle ma Edge Function IA et affiche le résultat.\n\nMa Edge Function : [NOM]\nEndpoint : [SUPABASE_URL]/functions/v1/[NOM]\n\nCe que le composant doit faire :\n1. Formulaire d'input (champs : [liste les champs])\n2. Appel à la Edge Function avec le JWT de l'user (useAuth hook)\n3. État loading avec skeleton ou spinner\n4. Affichage du résultat en temps réel si streaming\n5. Sauvegarde locale du résultat (pour affichage ultérieur)\n6. Gestion des erreurs avec message clair pour l'user\n\nUtilise le système de design Buildrs : Tailwind, rounded-2xl, bg-card, text-foreground.",
          },
          {
            type: 'list',
            title: "Types d'agents à intégrer selon ton SaaS",
            style: 'cards',
            items: [
              { icon: 'file-text',   label: 'Agent générateur',    desc: "Génère du contenu à partir d'un input user : textes, rapports, scripts, emails, briefs.",       accent: '#4d96ff' },
              { icon: 'search',      label: 'Agent analyseur',     desc: "Analyse des données, un document, un marché — et retourne des insights structurés.",             accent: '#cc5de8' },
              { icon: 'zap',         label: 'Agent automatiseur',  desc: "Prend des décisions et déclenche des actions : trier, classer, envoyer, alerter.",                accent: '#eab308' },
              { icon: 'message-square', label: 'Agent assistant', desc: "Répond aux questions de l'user avec le contexte de SON compte. RAG sur ses données.",             accent: '#22c55e' },
            ],
          },
          { type: 'callout', variant: 'tip', title: 'Par où commencer', content: "Commence par un agent générateur — c'est le plus simple à brancher et le plus visible pour l'user. 1 input → 1 output généré par Claude. Une fois ce pattern maîtrisé, tu peux complexifier vers des agents qui enchaînent plusieurs actions." },
          {
            type: 'checklist',
            title: 'Intégration agent IA terminée quand :',
            items: [
              'Edge Function créée avec ANTHROPIC_API_KEY en variable secrète (jamais dans le code)',
              'Auth vérifiée dans la fonction (JWT Supabase)',
              "L'agent appelle claude-sonnet-4-6 avec un prompt contextuel",
              'Résultat sauvegardé en BDD et affiché dans l\'interface',
              'États loading/error/success présents côté frontend',
              'Testé avec un vrai compte — l\'agent délivre un vrai résultat',
            ],
          },
        ],
      },
    ],
    quizQuestions: [
      {
        id: 'q04-1',
        question: 'Quelle est la règle des 72h pour la feature core ?',
        options: [
          'Construire le maximum de features possible',
          'Une seule feature core, parfaite, qui justifie le paiement',
          'Copier une app existante',
          "Attendre d'avoir le design parfait",
        ],
        correctIndex: 1,
        explanation: 'Une feature core irréprochable crée plus de valeur que 20 features médiocres. Le focus = la clé du lancement rapide.',
      },
    ],
  },
  {
    id: '05',
    title: 'Déployer et lancer',
    description: 'Ton app est live. Accessible au monde entier.',
    icon: 'Rocket',
    lessons: [

      // ── 5.1 — Vercel ──────────────────────────────────────────────────────
      {
        id: '5.1',
        title: 'Vercel — en ligne en 5 minutes',
        duration: '8 min',
        body: [],
        blocks: [
          { type: 'text', content: "Vercel = la façon la plus rapide de mettre une app React en production. Connecte ton repo GitHub et chaque push devient automatiquement un déploiement. Chez Buildrs, on déploie dès le premier commit — pas la peine d'attendre que ce soit parfait pour avoir un vrai URL." },
          {
            type: 'diagram-flow',
            title: 'Deploy Vercel en 5 étapes',
            steps: [
              { label: 'Connecter GitHub',  sub: 'vercel.com → New Project → Import ton repo GitHub.',                                       color: '#22c55e' },
              { label: 'Configurer build',  sub: 'Framework = Vite. Build command = `npm run build`. Output = dist.',                        color: '#4d96ff' },
              { label: "Variables d'env",   sub: 'Coller VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, VITE_STRIPE_PK dans Vercel.',            color: '#cc5de8' },
              { label: 'Deploy',            sub: 'Vercel build et déploie en ~2 minutes. URL auto générée.',                                  color: '#22c55e' },
              { label: 'Domaine custom',    sub: 'Settings → Domains → Ajouter ton domaine Hostinger.',                                      color: '#f59e0b' },
            ],
          },
          {
            type: 'links',
            items: [
              { label: 'Vercel Dashboard', url: 'https://vercel.com/dashboard',                                         icon: 'cloud',        desc: 'Ton dashboard de déploiement. Chaque projet, chaque deploy, chaque preview.',                                               tag: 'Dashboard' },
              { label: 'Vercel Docs',      url: 'https://vercel.com/docs/projects/environment-variables',               icon: 'shield',       desc: "Comment configurer les variables d'environnement de prod vs preview vs dev.",                                              tag: 'Docs' },
              { label: 'Hostinger',        url: 'https://www.hostinger.fr/nom-de-domaine',                              icon: 'globe',        desc: "Achète ton domaine .fr ou .com à partir de 0.99€/an. Configure le DNS pour pointer vers Vercel.",                          tag: 'Domaine' },
            ],
          },
          {
            type: 'prompt',
            label: "Prompt Claude Code — Variables d'environnement",
            content: "Génère le fichier .env.example complet pour mon app avec toutes les variables nécessaires.\n\nMon stack : React + Vite + Supabase + Stripe + Resend\n\nPour chaque variable :\n- Nom en SCREAMING_SNAKE_CASE\n- Description commentée\n- Où trouver la valeur (ex: Supabase dashboard → Settings → API)\n- Si elle est publique (préfixe VITE_) ou privée (côté serveur uniquement)\n\nAussi : génère la documentation dans README.md sur comment setup les variables en local et dans Vercel.",
          },
          { type: 'callout', variant: 'tip', title: 'DNS Hostinger → Vercel (2 min)', content: "Dans Hostinger → DNS → ajoute un enregistrement CNAME : name = www → value = cname.vercel-dns.com. Et un A record : name = @ → value = 76.76.21.21. Vercel détecte et génère le certificat SSL automatiquement. Gratuit, auto-renouvelé." },
          {
            type: 'checklist',
            title: 'App en ligne quand :',
            items: [
              'Repo GitHub connecté à Vercel',
              'Build réussi sans erreurs dans Vercel',
              "Variables d'environnement Supabase configurées dans Vercel",
              'Preview URL accessible et fonctionnelle',
              'Domaine custom connecté (DNS propagé ~15min)',
              'HTTPS actif (certificat SSL auto par Vercel)',
            ],
          },
        ],
      },

      // ── 5.2 — Stripe ──────────────────────────────────────────────────────
      {
        id: '5.2',
        title: 'Stripe — encaisser les premiers paiements',
        duration: '15 min',
        body: [],
        blocks: [
          { type: 'text', content: "Stripe = l'infrastructure de paiement que toutes les startups utilisent. L'intégration est propre, les docs sont excellentes, et le test mode te permet de tester sans vrai argent. Objectif : ton app encaisse un paiement en moins d'une heure." },
          {
            type: 'diagram-flow',
            title: 'Flow paiement Stripe complet',
            steps: [
              { label: 'Compte Stripe',   sub: 'stripe.com → créer un compte → renseigner les infos business.',                    color: '#22c55e' },
              { label: 'Créer les produits', sub: 'Dashboard → Products → créer ton plan (nom, prix, récurrence).',               color: '#4d96ff' },
              { label: 'Checkout',        sub: 'Stripe Checkout dans ton app → formulaire de paiement hébergé par Stripe.',       color: '#cc5de8' },
              { label: 'Webhooks',        sub: 'Stripe → Vercel → ta DB. checkout.completed → mettre à jour le statut user.',    color: '#f59e0b' },
              { label: 'Test → Live',     sub: 'Mode test avec carte 4242... → passer en live quand tout fonctionne.',            color: '#22c55e' },
            ],
          },
          {
            type: 'links',
            items: [
              { label: 'Stripe Dashboard', url: 'https://dashboard.stripe.com',                       icon: 'credit-card', desc: 'Crée tes produits, gère les paiements, vois les revenus en temps réel.',              tag: 'Dashboard' },
              { label: 'Stripe Checkout',  url: 'https://stripe.com/docs/payments/checkout',          icon: 'package',     desc: 'La page de paiement hébergée par Stripe. Zéro code côté front pour les infos CB.',      tag: 'Docs' },
              { label: 'Stripe Webhooks',  url: 'https://stripe.com/docs/webhooks',                   icon: 'zap',         desc: "Écouter les événements Stripe (paiement réussi, abonnement annulé...) dans ton backend.", tag: 'Docs' },
            ],
          },
          {
            type: 'template',
            title: 'Structure produits Stripe recommandée',
            sections: [
              {
                label: 'Plan Solo / Pro',
                icon: 'trending-up',
                fields: [
                  { name: 'Nom Stripe',  placeholder: 'Ex: "Blueprint Pro Monthly"',                          example: 'Visible sur la facture Stripe' },
                  { name: 'Prix',        placeholder: 'Ex: 19€/mois ou 149€/an (2 mois offerts)',              example: 'Créer les 2 dans Stripe avec le même product ID' },
                  { name: 'Price ID',    placeholder: 'price_xxx — copier depuis Stripe',                      example: 'Stocker dans STRIPE_PRICE_MONTHLY et STRIPE_PRICE_YEARLY' },
                ],
              },
              {
                label: 'Webhooks à écouter',
                icon: 'zap',
                fields: [
                  { name: 'checkout.session.completed',       placeholder: 'Paiement réussi → mettre user.plan = "pro" en BDD', example: 'Upsert dans table subscriptions' },
                  { name: 'customer.subscription.deleted',    placeholder: 'Annulation → mettre user.plan = "free"',           example: 'Update dans table subscriptions' },
                  { name: 'invoice.payment_failed',           placeholder: "Échec paiement → notifier l'user + gérer la grâce", example: 'Envoyer email Resend + flag en BDD' },
                ],
              },
            ],
          },
          {
            type: 'prompt',
            label: 'Prompt Claude Code — Intégration Stripe complète',
            content: "Intègre Stripe dans mon app pour gérer les abonnements.\n\nMon setup :\n- App : React + Supabase + Vercel\n- Plan : [NOM DU PLAN] à [PRIX]€/mois\n- Price ID Stripe : [STRIPE_PRICE_ID]\n- Stripe Secret Key : dans les variables d'env (jamais côté client)\n\nCe que tu dois créer :\n1. Supabase Edge Function `create-checkout` : crée une session Stripe Checkout + redirige vers Stripe\n2. Supabase Edge Function `stripe-webhook` : écoute checkout.completed et subscription.deleted, met à jour la table users\n3. Page /pricing dans React avec bouton CTA qui appelle la Edge Function\n4. Hook usePlan() qui lit user.plan depuis Supabase\n5. Composant PlanGate qui bloque les features pro pour les users gratuits\n\nLe secret Stripe ne touche jamais le navigateur — uniquement dans les Edge Functions.",
          },
          { type: 'callout', variant: 'tip', title: 'Carte de test Stripe', content: "4242 4242 4242 4242 — expiry : n'importe quelle date future — CVV : n'importe quel 3 chiffres. Mode test = aucun vrai argent. Passe en mode live uniquement quand tout est validé end-to-end." },
          {
            type: 'checklist',
            title: 'Stripe intégré quand :',
            items: [
              'Compte Stripe créé avec produit et prix configurés',
              'Variables STRIPE_SECRET_KEY et STRIPE_WEBHOOK_SECRET dans Vercel',
              'Edge Function create-checkout déployée et testée',
              'Edge Function stripe-webhook déployée avec le bon endpoint Stripe',
              'Paiement test réussi avec carte 4242...',
              'Webhook reçu et BDD mise à jour (user.plan = "pro")',
              'Feature pro bloquée pour les users gratuits (PlanGate testé)',
            ],
          },
        ],
      },

      // ── 5.3 — Resend ──────────────────────────────────────────────────────
      {
        id: '5.3',
        title: "Resend — séquences d'emails qui convertissent",
        duration: '12 min',
        body: [],
        blocks: [
          { type: 'text', content: "L'email reste le canal de conversion le plus rentable. Un user qui s'inscrit et reçoit un email de bienvenue bien écrit dans la minute convertit 3x plus qu'un user qui n'en reçoit pas. Resend = l'infrastructure email moderne, pensée pour les développeurs." },
          {
            type: 'diagram-flow',
            title: 'Séquence email post-inscription recommandée',
            steps: [
              { label: 'J+0 : Bienvenue',  sub: "Immédiat après inscription. Confirme, accueille, donne les prochaines étapes.",     color: '#22c55e' },
              { label: 'J+1 : Quick win',  sub: "24h après. Guide vers la première action concrète dans l'app.",                     color: '#4d96ff' },
              { label: 'J+3 : Valeur',     sub: 'Partage un conseil, un cas d\'usage, un success story. Build la confiance.',       color: '#cc5de8' },
              { label: 'J+7 : Upgrade',    sub: 'Si pas converti en pro : propose l\'upgrade avec le bon angle.',                   color: '#f59e0b' },
              { label: 'J+14 : Dernier',   sub: 'Dernier email de conversion. Offre spéciale ou deadline réelle.',                  color: '#ef4444' },
            ],
          },
          {
            type: 'links',
            items: [
              { label: 'Resend Dashboard', url: 'https://resend.com',         icon: 'mail',     desc: "Crée ton compte, génère ta clé API, vérifie ton domaine. 3 000 emails gratuits/mois.", tag: 'Dashboard' },
              { label: 'React Email',      url: 'https://react.email',        icon: 'layers2',  desc: 'Templates d\'emails en JSX. Copie-colle les templates dans Claude Code pour les styliser.', tag: 'Templates' },
            ],
          },
          {
            type: 'template',
            title: "Templates des 4 emails essentiels",
            sections: [
              {
                label: 'Email 1 — Bienvenue (J+0)',
                icon: 'mail',
                fields: [
                  { name: 'Objet',      placeholder: 'Bienvenue dans [TON APP] — voici comment démarrer',                               example: '"Bienvenue dans Buildrs Blueprint — ton plan d\'action 72h"' },
                  { name: 'Ouverture',  placeholder: 'Hey [prénom], tu viens de prendre la meilleure décision de ta semaine.',          example: 'Personnel, direct, affirmatif' },
                  { name: 'Corps',      placeholder: 'Voici les 3 premières choses à faire dans [APP] : [étape 1], [étape 2], [étape 3]', example: 'Action immédiate, pas de blabla' },
                  { name: 'CTA',        placeholder: 'Lien direct vers la première action dans l\'app',                                 example: '"Commence maintenant →" → /dashboard/onboarding' },
                ],
              },
              {
                label: 'Email 2 — Upgrade (J+7)',
                icon: 'trending-up',
                fields: [
                  { name: 'Objet',          placeholder: 'Tu es toujours en version gratuite — voici ce que tu rates',                 example: 'Angle FOMO, pas agressif' },
                  { name: 'Corps',          placeholder: 'Liste des features pro. Social proof. Lève l\'objection principale.',         example: '"379 users ont passé au plan Pro ce mois-ci"' },
                  { name: 'CTA + offre',    placeholder: 'Upgrade maintenant → [lien pricing]',                                        example: '"Essai 7 jours gratuit → puis 19€/mois"' },
                ],
              },
              {
                label: 'Email 3 — Confirmation paiement',
                icon: 'credit-card',
                fields: [
                  { name: 'Objet',          placeholder: 'Paiement confirmé — bienvenue dans [PLAN PRO]',                              example: 'Déclenché par webhook Stripe checkout.completed' },
                  { name: 'Corps',          placeholder: 'Confirme l\'accès, liste les nouvelles features débloquées.',                example: 'Rassurer + exciter + orienter vers les features pro' },
                  { name: 'Portail',        placeholder: 'Lien vers le portail Stripe pour gérer l\'abonnement',                       example: 'stripe.com/billing-portal (configurable dans Stripe)' },
                ],
              },
            ],
          },
          {
            type: 'prompt',
            label: 'Prompt Claude Code — Séquence Resend complète',
            content: "Intègre Resend dans mon app pour envoyer les emails transactionnels.\n\nSetup :\n- Resend API Key dans les variables d'env (RESEND_API_KEY)\n- Domaine vérifié : [TON_DOMAINE]\n- From : team@[TON_DOMAINE]\n\nCrée :\n1. Supabase Edge Function `send-email` : prend { to, template, data } et envoie via Resend API\n2. Template HTML email de bienvenue (sobre, mobile-friendly, couleurs de ta DA)\n3. Trigger sur inscription : après signup Supabase → appeler send-email avec template 'welcome'\n4. Template email confirmation paiement\n5. Trigger sur webhook Stripe checkout.completed → envoyer email confirmation",
          },
          {
            type: 'checklist',
            title: 'Resend configuré quand :',
            items: [
              'Compte Resend créé et domaine vérifié',
              'RESEND_API_KEY dans les variables Vercel',
              'Email de bienvenue envoyé automatiquement après inscription',
              'Email de confirmation paiement envoyé après checkout Stripe',
              'Test des 2 emails réussi sur un vrai compte',
            ],
          },
        ],
      },

      // ── 5.4 — Sécurité + checklist pré-lancement ─────────────────────────
      {
        id: '5.4',
        title: 'Sécurité & checklist pré-lancement',
        duration: '10 min',
        body: [],
        blocks: [
          { type: 'callout', variant: 'info', title: 'Les 2 failles qui coûtent le plus cher', content: "1. Exposer sa clé Supabase Service Role côté client (n'importe qui peut tout lire et écrire). 2. Ne pas activer RLS sur les tables (un user peut lire les données de tous les autres). Ces 2 erreurs = violation de données + perte de confiance + problème légal potentiel." },
          {
            type: 'diagram-cards',
            title: 'Les 5 points de sécurité non négociables',
            items: [
              { icon: 'shield',       label: "Variables d'env",   desc: "Jamais de clé secrète dans le code. Tout dans .env.local (local) et Vercel (prod). Jamais dans un commit.", color: '#ef4444' },
              { icon: 'database',     label: 'RLS Supabase',      desc: "Row Level Security activé sur chaque table. auth.uid() = user_id sur toutes les policies.",                color: '#f59e0b' },
              { icon: 'lock',         label: 'HTTPS',             desc: "Vercel + domaine custom = HTTPS auto gratuit. Vérifier que le redirect HTTP → HTTPS est actif.",           color: '#22c55e' },
              { icon: 'zap',          label: 'Stripe côté serveur', desc: "Le secret Stripe ne touche jamais le navigateur. Uniquement dans les Edge Functions Supabase.",          color: '#4d96ff' },
              { icon: 'file-text',    label: 'Mentions légales',  desc: "CGV, politique de confidentialité, mentions légales. Obligatoires légalement. Claude les génère en 2 min.", color: '#cc5de8' },
            ],
          },
          {
            type: 'prompt',
            label: 'Prompt Claude Code — Audit sécurité complet',
            content: "Effectue un audit de sécurité complet de mon app avant le lancement.\n\nVérifie :\n1. VARIABLES D'ENV : Y a-t-il des clés secrètes dans le code source (src/) ? (cherche STRIPE_, SUPABASE_SERVICE_ROLE, API keys)\n2. RLS : Est-ce que toutes les tables Supabase ont RLS activé ? Liste celles qui ne l'ont pas.\n3. CLIENT SIDE : Est-ce que des opérations sensibles sont faites côté client ?\n4. INPUTS : Y a-t-il des formulaires sans validation (XSS potential) ?\n5. CORS : La config Supabase autorise-t-elle des origins inconnues ?\n\nPour chaque problème : critique/important/mineur + comment le corriger.",
          },
          {
            type: 'prompt',
            label: 'Prompt Claude — Mentions légales complètes',
            content: "Génère les 3 documents légaux nécessaires pour mon SaaS :\n\n1. MENTIONS LÉGALES (Article L.111-7 Code de la consommation)\nInfos : Nom : [TON NOM]. SIRET : [SIRET ou en cours]. Email : [EMAIL]. Hébergeur : Vercel Inc, San Francisco.\n\n2. POLITIQUE DE CONFIDENTIALITÉ (RGPD)\nDonnées collectées : email, nom, historique d'usage. Finalité : service + emails transactionnels. Durée : 3 ans post-résiliation. Droit d'accès/suppression : email.\n\n3. CONDITIONS GÉNÉRALES DE VENTE\nProduit : [DESCRIPTION]. Prix : [PRIX]. Paiement : Stripe. Remboursement : 14 jours. Résiliation : fin de période.\n\nFormate en HTML propre pour intégration dans les pages /legal /privacy /terms.",
          },
          {
            type: 'checklist',
            title: 'Checklist pré-lancement — 15 points obligatoires',
            items: [
              'Paiement Stripe testé end-to-end (test + webhook + BDD mise à jour)',
              'Email de bienvenue reçu après inscription',
              'Email de confirmation paiement reçu',
              'Auth signup → login → logout testé sur mobile',
              "Feature core testée avec un vrai utilisateur (pas toi)",
              'Tous les états UI présents : loading, error, empty, success',
              'Mobile responsive testé (iPhone + Android)',
              "Aucune clé secrète dans le code (audit sécurité fait)",
              'RLS Supabase activé sur toutes les tables',
              'HTTPS actif sur le domaine custom',
              'Mentions légales + CGV + Politique de confidentialité en ligne',
              'PostHog ou Google Analytics installé',
              'Favicon + meta description + og:image configurés',
              'Page 404 personnalisée',
              "Test de charge basique : 3 onglets simultanés sans crash",
            ],
          },
          {
            type: 'cohorte-cta',
            title: 'Prêt à lancer mais tu veux du soutien ?',
            description: "Le lancement est le moment le plus critique. Dans la cohorte, Alfred et l'équipe Buildrs sont là pour chaque étape — du setup Stripe au premier client. 30 jours pour sortir quelque chose de réel.",
            price: '797€',
            features: [
              'Review pré-lancement par Alfred',
              "Présence dans la communauté Buildrs (founders actifs)",
              "Stratégie acquisition personnalisée pour ton produit",
              '4 sessions live mensuelles — code + marketing + sales',
              "Accès à tous les templates et workflows Buildrs",
            ],
          },
          {
            type: 'cal-booking',
            title: 'Une question avant de lancer ?',
            subtitle: "Réserve 15 minutes avec l'équipe Buildrs — on passe en revue ton app ensemble.",
            calUrl: 'https://cal.com/buildrs/15min',
          },
        ],
      },
    ],
    quizQuestions: [
      {
        id: 'q05-1',
        question: 'Quelle est la faille de sécurité la plus critique ?',
        options: [
          'Avoir un mot de passe trop court',
          "Exposer la clé Supabase Service Role côté client ou ne pas activer RLS",
          "Ne pas avoir de favicon",
          'Utiliser HTTP au lieu de HTTPS',
        ],
        correctIndex: 1,
        explanation: "La clé Service Role côté client = n'importe qui peut tout lire/écrire dans ta base. Et sans RLS, un user peut accéder aux données de tous les autres. Ces 2 erreurs sont les plus courantes et les plus dangereuses.",
      },
    ],
  },
  {
    id: '06',
    title: 'Monétiser',
    description: 'Tes premiers utilisateurs. Tes premiers euros.',
    icon: 'DollarSign',
    lessons: [

      // ── 6.1 — La landing page ─────────────────────────────────────────────
      {
        id: '6.1',
        title: 'Ta landing page — le commercial 24h/24',
        duration: '15 min',
        body: [],
        blocks: [
          { type: 'text', content: "Ta landing page = ton seul vendeur qui travaille sans pause. Elle a 8 secondes pour convaincre. Si le visiteur ne comprend pas ce que tu fais et pourquoi ça le concerne dans les 8 premières secondes — il part. Chez Buildrs, on construit la LP avec Claude Code directement : plus rapide, plus cohérente avec le design de l'app." },
          {
            type: 'diagram-flow',
            title: 'Structure LP qui convertit — les 7 sections',
            steps: [
              { label: 'Hero',          sub: "Problème en 1 ligne. Bénéfice immédiat. CTA visible. Aucune distraction.",                          color: '#4d96ff' },
              { label: 'Problem',       sub: "La douleur que tu ressens. Le visiteur doit se dire \"c'est exactement ça\".",                       color: '#ef4444' },
              { label: 'Solution',      sub: "Ton produit en 1-2 lignes. Une capture d'écran vaut 1000 mots.",                                    color: '#22c55e' },
              { label: 'Features',      sub: "3-5 fonctionnalités clés. Bénéfice d'abord, feature ensuite.",                                      color: '#4d96ff' },
              { label: 'Social Proof',  sub: "Témoignages, logos, chiffres. 1 vrai témoignage > 10 faux.",                                        color: '#cc5de8' },
              { label: 'Pricing',       sub: "Clair, simple, sans ambiguïté. 1-2 plans max. CTA sur chaque plan.",                                color: '#f59e0b' },
              { label: 'CTA Final',     sub: "Dernier rappel du bénéfice principal + CTA fort.",                                                   color: '#22c55e' },
            ],
          },
          {
            type: 'template',
            title: 'Framework copy — les 7 sections',
            sections: [
              {
                label: 'Hero',
                icon: 'star',
                fields: [
                  { name: 'H1 — accroche',   placeholder: '[Résultat que le user veut] sans [friction principale]',                          example: '"Lance ton SaaS en 72h sans savoir coder"' },
                  { name: 'Sous-titre',       placeholder: 'Pour [cible] qui [problème]. [TON PRODUIT] fait [solution].',                    example: '"Pour les solopreneurs qui veulent un revenu passif. Buildrs Blueprint te donne le système complet."' },
                  { name: 'CTA principal',    placeholder: 'Verbe d\'action + valeur + prix si applicable',                                  example: '"Commencer pour 27€ →" ou "Essai gratuit 14 jours"' },
                ],
              },
              {
                label: 'Problem (la douleur)',
                icon: 'alert-triangle',
                fields: [
                  { name: 'Douleur principale', placeholder: 'Tu [situation frustrante] mais tu [résultat pas obtenu]',                      example: '"Tu vois des micro-SaaS rapporter 5K/mois mais tu ne sais pas par où commencer."' },
                  { name: 'Coût du statu quo',  placeholder: 'Et en attendant... [coût de ne rien faire]',                                  example: '"Pendant ce temps, des gens sans expérience lancent des produits chaque semaine avec Claude."' },
                ],
              },
              {
                label: 'Solution + Features',
                icon: 'check-circle',
                fields: [
                  { name: 'Promise',        placeholder: '[TON PRODUIT] = [transformation] en [temps/effort]',                              example: '"Buildrs Blueprint = ton plan d\'action complet pour lancer en 72h."' },
                  { name: 'Feature 1',      placeholder: '[Feature] → [bénéfice direct pour le user]',                                      example: '"6 modules step-by-step → tu ne bloques jamais sur quoi faire ensuite"' },
                  { name: 'Feature 2',      placeholder: '[Feature] → [bénéfice]',                                                          example: '"Prompts prêts à copier → Claude code à ta place dès la première minute"' },
                ],
              },
              {
                label: 'Social Proof',
                icon: 'users',
                fields: [
                  { name: 'Témoignage fort', placeholder: '"[Résultat concret obtenu grâce à TON PRODUIT]" — Prénom, contexte',             example: '"J\'ai lancé mon premier SaaS en 4 jours et eu mon premier paiement le lendemain." — Sarah M.' },
                  { name: 'Stats',           placeholder: 'X users / Y€ de revenus générés / Z% de satisfaction',                           example: '"127 solopreneurs ont lancé leur produit avec Buildrs Blueprint"' },
                ],
              },
            ],
          },
          {
            type: 'prompt',
            label: 'Prompt Claude Code — LP complète avec Tailwind',
            content: "Construis ma landing page complète en React + Tailwind.\n\nMon produit : [DESCRIPTION]\nMa cible : [CIBLE]\nPrix : [PRIX]\nDA : [DESCRIPTION DE TA DA — couleurs, fonts, style]\n\nFramework des sections :\n[COLLE TON FRAMEWORK COPY REMPLI]\n\nCe que tu dois créer :\n1. Page / avec toutes les sections (Hero, Problem, Solution, Features, Social Proof, Pricing, CTA Final)\n2. Navigation sticky avec CTA\n3. Footer minimal (mentions légales, réseaux sociaux, email)\n4. Animations subtiles au scroll (Framer Motion ou CSS)\n5. Mobile-first (tester sur 375px)\n6. Meta tags SEO (title, description, og:image)",
          },
          {
            type: 'links',
            title: 'Skills marketing à activer dans Claude Code',
            items: [
              { label: 'Skill ad-creative',    url: 'https://claude.ai/code', icon: 'sparkles',     desc: "Génère des créas publicitaires, headlines, primary text pour Meta Ads et LinkedIn directement depuis Claude Code.", tag: 'Marketing' },
              { label: 'Skill copywriting',    url: 'https://claude.ai/code', icon: 'pen-tool',     desc: "Optimise le copy de ta LP, tes CTAs, tes emails pour maximiser les conversions.",                                  tag: 'Copy' },
              { label: 'Skill page-cro',       url: 'https://claude.ai/code', icon: 'trending-up',  desc: "Audit de ta LP pour maximiser le taux de conversion. Identifie les frictions et propose des fixes.",               tag: 'CRO' },
            ],
          },
          {
            type: 'checklist',
            title: 'LP prête quand :',
            items: [
              'Les 7 sections présentes et complètes',
              'Hero testé : le visiteur comprend en 8 secondes ce que tu fais',
              'CTA visible above the fold (sans scroller)',
              'Mobile parfait (testé sur 375px)',
              'Page de paiement Stripe fonctionnelle depuis le CTA',
              'Meta tags OG configurés (partage propre sur LinkedIn)',
              'Analytics installé (PostHog ou Google Analytics)',
            ],
          },
        ],
      },

      // ── 6.2 — UX review ───────────────────────────────────────────────────
      {
        id: '6.2',
        title: 'UX review — tester avant de lancer',
        duration: '10 min',
        body: [],
        blocks: [
          { type: 'text', content: "Tu ne peux pas voir les bugs de ton propre produit. Tu l'as trop vu. L'UX review = faire tester par d'autres avant le lancement. 5 personnes qui testent = 80% des problèmes identifiés. Ça te coûte 2 heures et ça peut te sauver un lancement raté." },
          {
            type: 'diagram-flow',
            title: 'Processus UX review Buildrs',
            steps: [
              { label: 'Auto-audit Claude',    sub: "Donne ton URL à Claude + le prompt d'audit UX. Il liste tous les problèmes.",             color: '#4d96ff' },
              { label: '5 tests utilisateurs', sub: "Envoie le lien à 5 personnes qui correspondent à ta cible. Observe, ne guide pas.",       color: '#22c55e' },
              { label: 'Collecter les frictions', sub: "Où est-ce qu'ils bloquent ? Qu'est-ce qui les confond ?",                             color: '#cc5de8' },
              { label: 'Trier et prioriser',   sub: "Problème critique (bloque le paiement) → fix immédiat. Mineur → V2.",                    color: '#f59e0b' },
              { label: 'Corriger + re-tester', sub: "Fix les critiques. Re-tester les 2 flows principaux. Puis lancer.",                       color: '#22c55e' },
            ],
          },
          {
            type: 'prompt',
            label: 'Prompt Claude — Audit UX automatique',
            content: "Effectue un audit UX complet de mon app [NOM].\n\nContexte : SaaS [DESCRIPTION] pour [CIBLE]. Flow principal : inscription → onboarding → feature core → paiement.\n\nAudit ces 6 dimensions :\n1. FIRST IMPRESSION : Comprend-on ce que fait l'app en 8 secondes sur la LP ?\n2. ONBOARDING : Le chemin vers la première valeur est-il clair et rapide ?\n3. FEATURE CORE : La feature principale est-elle intuitive sans aide ?\n4. FRICTION : Y a-t-il des étapes inutiles qui ralentissent l'utilisateur ?\n5. MOBILE : L'expérience est-elle bonne sur mobile ?\n6. PAIEMENT : Le flow de paiement est-il rassurant et sans friction ?\n\nPour chaque problème : niveau (bloquant/important/mineur) + recommandation précise.",
          },
          { type: 'callout', variant: 'tip', title: 'Script pour tes 5 testeurs', content: "Dis-leur : \"Tu es [cible]. Tu cherches à résoudre [problème]. Visite cette URL et fais ce que tu ferais naturellement. Dis à voix haute ce que tu penses.\" NE les aide pas. NE leur dis pas où cliquer. Contente-toi d'observer et noter. Les 3 premières minutes sont les plus riches." },
          {
            type: 'checklist',
            title: 'UX review terminée quand :',
            items: [
              'Audit UX Claude fait — tous les problèmes critiques résolus',
              "5 personnes de ta cible ont testé l'app",
              "Flow inscription → feature core → paiement testé sans bug",
              "Aucun utilisateur test n'a été bloqué sur une étape critique",
              'Mobile testé sur iOS et Android',
              "Temps moyen du signup au premier usage < 3 minutes",
            ],
          },
        ],
      },

      // ── 6.3 — Lancement ───────────────────────────────────────────────────
      {
        id: '6.3',
        title: 'Lancement — tes premiers clients',
        duration: '15 min',
        body: [],
        blocks: [
          { type: 'text', content: "Le jour J. Ton produit est live, testé, prêt. Maintenant tu dois aller chercher tes premiers clients — pas attendre qu'ils viennent. Chez Buildrs, la règle du lancement : 3 canaux le même jour, contenu prêt à l'avance, et DM direct à tes 20 premiers contacts qui correspondent à ta cible." },
          {
            type: 'diagram-cards',
            title: "Les 3 canaux d'acquisition du lancement",
            items: [
              { icon: 'share-2',       label: 'LinkedIn',    desc: "Ton réseau d'abord. 5 posts d'angles différents sur 5 jours. Story, before/after, résultat chiffré.",          color: '#4d96ff' },
              { icon: 'message-square', label: 'DM direct',  desc: "20 contacts qui correspondent exactement à ta cible. Message personnel, pas du spam. 1 question, pas un pitch.", color: '#22c55e' },
              { icon: 'target',        label: 'Communautés', desc: "Les groupes où se trouve ta cible. Partage un insight, pas une pub. Value first, produit après.",               color: '#cc5de8' },
            ],
          },
          {
            type: 'prompt',
            label: 'Prompt Claude — 5 posts LinkedIn de lancement',
            content: "Je lance [NOM DU PRODUIT] aujourd'hui. Génère 5 posts LinkedIn d'angles différents.\n\nMon produit : [DESCRIPTION]\nMa cible : [CIBLE]\nPrix : [PRIX]\nRésultat que ça donne : [TRANSFORMATION]\n\nPost 1 : Ma story — pourquoi j'ai créé ce produit (1ère personne, authentique)\nPost 2 : Before/After — la vie avant vs la vie après [TON PRODUIT]\nPost 3 : Chiffre/stat choc — quelque chose d'inattendu sur le marché\nPost 4 : Démonstration — montre ce que fait le produit en 3 bullets\nPost 5 : Invitation directe — pour qui c'est fait, pourquoi maintenant\n\nChaque post : max 8 lignes. Pas de hashtags flooders. 1 CTA simple à la fin.",
          },
          {
            type: 'prompt',
            label: 'Prompt Claude — Email de lancement',
            content: "Je lance [NOM DU PRODUIT] et je dois envoyer un email à ma liste.\n\nContexte : [NOM DU PRODUIT] aide [CIBLE] à [TRANSFORMATION] en [DURÉE]. Prix de lancement : [PRIX] (remontera à [PRIX NORMAL] dans 72h).\n\nGénère un email de lancement :\n- Objet : percutant, crée l'urgence sans clickbait\n- Ouverture : le problème en 1-2 phrases (ils doivent se reconnaître)\n- Corps : ce que je lance + 3 bénéfices clés + preuve sociale\n- Offre de lancement : prix + deadline réelle\n- CTA : lien direct vers la page de paiement\n- Closing : personnel, signé de mon prénom\n\nTon : direct, chaleureux, jamais agressif.",
          },
          {
            type: 'prompt',
            label: 'Prompt Claude — Message DM de lancement',
            content: "Rédige un message de DM pour contacter directement des personnes qui correspondent à ma cible.\n\nMa cible : [DESCRIPTION PRÉCISE — ex: freelances qui veulent du revenu passif]\nMon produit : [NOM + 1 phrase]\nLe lien : [URL]\n\nRègles du DM qui convertit :\n- Max 3 lignes\n- 1 question sur leur situation (pas un pitch)\n- Pas de \"bonjour je me permets de...\"\n- Propose de la valeur avant de parler du produit\n\nGénère 3 versions différentes à tester.",
          },
          { type: 'callout', variant: 'action', title: 'Objectif Jour 1', content: "3 posts LinkedIn publiés + 20 DMs envoyés + email de lancement envoyé. Pas besoin de Meta Ads pour le premier mois. Tes premiers clients viennent de ton réseau et de ta cohérence. Les Ads viennent après que tu as validé que ton produit convertit organiquement." },
          {
            type: 'checklist',
            title: 'Tu es lancé quand :',
            items: [
              'Premier post LinkedIn publié le jour du lancement',
              'Email de lancement envoyé',
              '20 DMs envoyés à des contacts pertinents',
              'Partagé dans 2-3 communautés où se trouve ta cible',
              'Analytics en place pour tracker les visiteurs et les sources',
              'Premier paiement reçu (même 1 suffit pour valider)',
              'Process de feedback en place : comment les users peuvent te contacter',
            ],
          },
          { type: 'callout', variant: 'tip', title: 'Mesurer avant de scaler', content: "Attends 50 visiteurs avant de juger le taux de conversion. Attends 5 conversations avant de juger ton angle. Attends 2 semaines avant de tout changer. La seule métrique qui compte la semaine 1 : est-ce que quelqu'un a payé ?" },
          {
            type: 'cohorte-cta',
            title: 'Tu as un produit. Maintenant tu veux des clients.',
            description: "La vraie question après le lancement : comment scaler ? Comment passer de 5 clients à 50, puis à 500 ? Dans la cohorte Buildrs, Alfred t'accompagne non seulement pour construire, mais pour acquérir. Stratégie, Meta Ads, contenu organique, funnel — tout y est.",
            price: '797€',
            features: [
              "Stratégie d'acquisition personnalisée pour ton produit",
              "Revue de ta LP + copy avec Alfred",
              "Setup Meta Ads en live (campagne réelle, pas théorique)",
              "Accès à la communauté Buildrs (founders qui s'entraident)",
              "4 sessions mensuelles + support continu par WhatsApp",
              "Templates de contenu organique prêts à poster",
            ],
          },
          {
            type: 'cal-booking',
            title: 'Tu veux de l\'aide pour ton lancement ?',
            subtitle: 'Réserve 15 minutes avec Alfred — on parle stratégie de lancement pour ton produit.',
            calUrl: 'https://cal.com/buildrs/15min',
          },
        ],
      },
    ],
    quizQuestions: [
      {
        id: 'q06-1',
        question: 'Quelle est la règle du lancement chez Buildrs ?',
        options: [
          'Attendre que le produit soit parfait avant de lancer',
          '3 canaux le même jour + contenu prêt à l\'avance + DM direct',
          'Lancer des Meta Ads dès le premier jour',
          "Attendre d'avoir 1000 followers",
        ],
        correctIndex: 1,
        explanation: "3 canaux simultanés (LinkedIn + DMs + communautés) créent un effet de présence qui donne de la crédibilité. Le contenu préparé à l'avance évite le vide le jour J. Les DMs directs convertissent mieux que tout autre canal à froid.",
      },
      {
        id: 'q06-2',
        question: 'Quelle métrique compte vraiment la semaine 1 ?',
        options: [
          'Le nombre de visiteurs',
          'Le nombre de followers gagnés',
          "Est-ce que quelqu'un a payé ?",
          'Le score de performance Google',
        ],
        correctIndex: 2,
        explanation: "Un paiement = validation réelle. Tout le reste (visiteurs, likes, followers) est vanity metric. La semaine 1 : un seul objectif — obtenir le premier paiement d'un inconnu.",
      },
    ],
  },
  // ── MODULE VALIDER ────────────────────────────────────────────────────────────
  {
    id: 'valider',
    title: 'Valider mon produit',
    description: "Confirme que ton idée vaut la peine d'être construite avant d'écrire la première ligne de code.",
    icon: 'CheckCircle',
    lessons: [

      // ── valider.1 ─────────────────────────────────────────────────────────
      {
        id: 'valider.1',
        title: 'Le framework de validation Buildrs',
        duration: '8 min',
        body: [],
        blocks: [
          { type: 'text', content: "90% des MVP échouent parce qu'ils résolvent un problème imaginaire. Pas un manque de code, pas un manque de design — un manque de validation. Ce module t'empêche de faire cette erreur." },
          { type: 'heading', level: 2, content: 'Les 5 critères de viabilité' },
          { type: 'text', content: "Le Score de viabilité IA disponible sur la page d'accueil évalue ton idée sur 5 critères, notés /20 chacun. Voici ce que chaque critère mesure — et comment l'améliorer si ton score est faible." },
          { type: 'diagram-cards', items: [
            { icon: 'users',        label: 'Marché',        desc: "Taille du marché accessible, nombre de clients potentiels, et preuve que des gens sont prêts à payer pour ce problème.",           color: '#22c55e' },
            { icon: 'search',       label: 'Concurrence',   desc: "Nombre et force des concurrents existants, tes différenciateurs clairs, et l'espace que tu peux occuper face à eux.",              color: '#4d96ff' },
            { icon: 'hammer',       label: 'Faisabilité',   desc: "Buildable en 72h avec Claude : une seule feature core, pas 15. Complexité technique accessible avec le stack Buildrs.",             color: '#cc5de8' },
            { icon: 'dollar-sign',  label: 'Monétisation',  desc: "Modèle de revenus clair, prix justifiable par le marché, et evidence que ta cible a un budget pour ce type de solution.",          color: '#eab308' },
            { icon: 'clock',        label: 'Timing',        desc: "Tendance de marché favorable, fenêtre d'opportunité ouverte, et urgence réelle du problème pour ta cible aujourd'hui.",            color: '#ef4444' },
          ]},
          { type: 'callout', variant: 'tip', title: 'Utilise le Score de viabilité IA', content: "La page d'accueil du dashboard contient le Score de viabilité IA — il utilise exactement ces 5 critères. Lance-le sur chacune de tes idées pour obtenir un score /100 et un verdict GO / PIVOT / STOP avec une analyse détaillée." },
          { type: 'heading', level: 2, content: 'Comment interpréter ton score' },
          { type: 'list', style: 'cards', items: [
            { icon: 'check-circle', label: 'GO — 70 à 100',    desc: "Feu vert. Le marché existe, la concurrence est gérable, le build est faisable. Lance le module Architecture — tu construis.", accent: '#22c55e' },
            { icon: 'alert-circle', label: 'PIVOT — 45 à 69',  desc: "L'idée a du potentiel mais un ou deux critères sont faibles. Identifie le point rouge et ajuste l'angle avant de coder.", accent: '#eab308' },
            { icon: 'x-circle',     label: 'STOP — 0 à 44',    desc: "Trop de signaux rouges simultanés. Pivote vers une autre idée — tu en as d'autres dans Mes Idées. Ce n'est pas un échec, c'est du temps économisé.", accent: '#ef4444' },
          ]},
          { type: 'heading', level: 2, content: 'La validation manuelle en 20 minutes' },
          { type: 'text', content: "Le score IA est un premier filtre algorithmique. La validation manuelle confirme avec tes propres yeux. Ces deux étapes ensemble couvrent 95% des risques." },
          { type: 'checklist', title: 'Checklist de validation rapide', items: [
            "Chercher 3 concurrents existants sur Product Hunt, Google, App Store ou G2",
            "Confirmer que des gens paient déjà pour ce type de solution (concurrents avec du MRR = bonne nouvelle)",
            "Lire 5 avis négatifs sur les concurrents (G2, Trustpilot, App Store) — noter les frustrations répétées",
            "Formuler ton idée en 1 phrase : \"C'est un outil qui aide [cible] à [résultat] sans [douleur]\"",
            "Estimer un prix en t'alignant sur le pricing des concurrents les plus proches",
          ]},
          { type: 'prompt', label: 'Prompt Claude — Analyse concurrentielle express', content: "Analyse ces 3 concurrents pour mon idée de micro-SaaS : [description de ton idée]. Concurrents : [concurrent 1], [concurrent 2], [concurrent 3]. Pour chacun, donne : 1) leur pricing exact, 2) leurs 3 forces principales, 3) leurs 3 faiblesses ou angles morts, 4) ce que leurs users reprochent le plus (cherche dans les avis publics). Puis recommande-moi UN angle de différenciation concret que je pourrais exploiter pour me positionner face à eux." },
          { type: 'quiz-inline',
            question: "Ton idée vient d'obtenir un score de 58/100 — verdict PIVOT. Quelle est la bonne réaction ?",
            options: [
              "Identifier quel critère est faible et ajuster l'angle de l'idée",
              "Abandonner et chercher une autre idée complètement",
              "Lancer le build quand même — 58 c'est pas si mal",
              "Relancer le score jusqu'à obtenir GO",
            ],
            correctIndex: 0,
            explanation: "PIVOT signifie que le potentiel est là mais un critère bloque. Identifie lequel (marché trop petit ? prix trop faible ? trop complexe à builder ?) et ajuste avant de coder. Ce n'est pas un stop — c'est une invitation à affiner.",
          },
        ],
      },

      // ── valider.2 ─────────────────────────────────────────────────────────
      {
        id: 'valider.2',
        title: 'Valider avec de vrais humains',
        duration: '7 min',
        body: [],
        blocks: [
          { type: 'text', content: "Le score IA + l'analyse concurrentielle couvrent 80% de la validation. Les 20% restants viennent de vrais humains. Pas 100 interviews — 5 conversations suffisent pour obtenir un signal clair." },
          { type: 'heading', level: 2, content: 'La méthode des 5 conversations' },
          { type: 'diagram-flow', steps: [
            { label: 'Identifier 5 personnes',       sub: "LinkedIn, groupes Facebook, Reddit, entourage pro. Pas des amis — des gens qui ont réellement ce problème dans leur quotidien.", color: '#4d96ff' },
            { label: 'Décrire le problème',          sub: "\"Tu rencontres [X] dans ton quotidien ?\" — Parle du problème, pas de ta solution. Laisse-les réagir naturellement.", color: '#cc5de8' },
            { label: 'Écouter leur douleur',         sub: "Note les mots exacts qu'ils utilisent. Ce sont les mots de ta landing page future. Plus ils sont précis, mieux c'est.", color: '#eab308' },
            { label: 'Tester le willingness-to-pay', sub: "\"Si un outil résolvait ça pour X€/mois, tu t'abonnerais ?\" La réponse (et surtout le ton) dit tout.", color: '#22c55e' },
          ]},
          { type: 'callout', variant: 'action', title: 'La règle des 3/5', content: "Si 3 personnes sur 5 répondent oui spontanément — tu as une validation humaine solide, lance le build. Si personne ne réagit avec enthousiasme — c'est un signal de pivot, pas un échec. Mieux vaut savoir maintenant que dans 3 semaines de code." },
          { type: 'heading', level: 2, content: 'Le pré-sell sans produit' },
          { type: 'text', content: "Méthode avancée pour les plus pressés : crée une landing page en 2h (headline + description du problème résolu + bouton \"Je veux ça\"). Partage-la dans 3 communautés. Mesure les clics. Tu n'as même pas besoin que le produit existe — si 10 personnes cliquent sur \"Je veux ça\", tu as une validation concrète." },
          { type: 'prompt', label: 'Prompt Claude — Script de validation DM', content: "Écris-moi 3 messages courts et naturels pour contacter des [profil cible] sur [LinkedIn/Reddit/Instagram] afin de valider mon idée de micro-SaaS : [description]. Le message doit : 1) ouvrir sur LEUR problème (pas mon produit), 2) être naturel, pas commercial, 3) finir par une question ouverte qui invite à répondre. Pas de pitch, pas de lien — juste une conversation sincère pour comprendre leur situation." },
          { type: 'heading', level: 2, content: "Les 5 signaux d'une idée validée" },
          { type: 'list', style: 'cards', items: [
            { icon: 'dollar-sign',   label: 'Des gens paient déjà',        desc: "Des concurrents existent avec du MRR. C'est la preuve la plus forte que le marché existe et que les gens ouvrent leur portefeuille.", accent: '#22c55e' },
            { icon: 'message-square', label: 'Explicable en 10 secondes',  desc: "\"Ah oui je vois\" — si les gens comprennent immédiatement sans que tu doives expliquer, le concept est clair et le pitch va suivre.",  accent: '#4d96ff' },
            { icon: 'alert-triangle', label: 'Douleur urgente et verbalisée', desc: "Les gens le mentionnent spontanément, sans que tu aies à les y amener. Le meilleur signe qu'un problème est réel.", accent: '#ef4444' },
            { icon: 'zap',            label: 'Buildable en 72h',           desc: "Une seule feature core identifiable, réalisable avec Claude Code en un sprint. Si ça prend 3 semaines — réduis le scope.", accent: '#eab308' },
            { icon: 'check-circle',   label: 'Score IA ≥ 70',             desc: "La validation algorithmique et la validation humaine convergent. Tu as le feu vert sur les deux fronts. C'est le moment de construire.", accent: '#22c55e' },
          ]},
          { type: 'checklist', title: "Actions finales avant de passer à l'étape suivante", items: [
            "Lancer le Score de viabilité IA sur tes 2-3 meilleures idées (page d'accueil)",
            "Avoir au moins 3 conversations réelles avec des personnes dans ta cible",
            "Pouvoir formuler ton idée en 1 phrase claire en moins de 10 secondes",
            "Choisir UNE seule idée — la plus validée et la plus proche de toi",
            "Passer au module suivant : Structurer ton offre",
          ]},
          { type: 'quiz-inline',
            question: "Combien de personnes faut-il convaincre avec la méthode des 5 conversations pour avoir une validation humaine solide ?",
            options: [
              "3 personnes sur 5 qui disent oui spontanément",
              "50 personnes — les 5 c'est trop peu",
              "1 seule — si ton meilleur ami est enthousiaste",
              "Les 5 sur 5 — sinon c'est trop risqué",
            ],
            correctIndex: 0,
            explanation: "3/5 est le seuil. En dessous : signal faible, affine l'angle. Au-dessus : feu vert humain confirmé. 5/5 est rare et souvent signe que tu as posé une question biaisée ou parlé à des gens trop proches de toi.",
          },
        ],
      },
    ],
    quizQuestions: [
      {
        id: 'qv-1',
        question: "Quel score de viabilité justifie de lancer le build ?",
        options: ['70 ou plus — verdict GO', '50 — c\'est suffisant', '90 minimum — on ne prend pas de risque', "N'importe quel score — l'action prime"],
        correctIndex: 0,
        explanation: "Le seuil GO est 70/100. Entre 45 et 69, c'est PIVOT — tu affines avant de construire. En dessous de 45, c'est STOP — tu changes d'idée. Lancer en dessous de 70 sans ajuster, c'est construire sur des fondations fragiles.",
      },
      {
        id: 'qv-2',
        question: "Quel est le meilleur signal qu'une idée de SaaS est réellement viable ?",
        options: ["Des concurrents existent et ont du MRR", "L'idée est originale — personne ne la fait encore", "Personne ne fait ça encore — opportunité vierge", "Tu trouves ça passionnant personnellement"],
        correctIndex: 0,
        explanation: "Des concurrents avec du MRR = preuve que le marché existe et que des gens paient. C'est contre-intuitif mais c'est la règle numéro 1 : pas de concurrents = pas de marché prouvé. L'originalité n'est pas une validation.",
      },
      {
        id: 'qv-3',
        question: "Tu contactes 5 personnes dans ta cible pour valider ton idée. 1 sur 5 est enthousiaste. Que fais-tu ?",
        options: ["Tu affines l'angle ou l'idée avant de construire", "Tu lances quand même — 1 c'est déjà bien", "Tu abandonnes définitivement l'idée", "Tu contactes 50 autres personnes"],
        correctIndex: 0,
        explanation: "1/5 est un signal trop faible pour valider. Le seuil est 3/5. Avant de tout abandonner ou de lancer quand même, comprends pourquoi les 4 autres ne réagissent pas. Souvent, ce n'est pas l'idée qui pose problème — c'est l'angle ou la cible.",
      },
    ],
  },

  // ── MODULE OFFRE ──────────────────────────────────────────────────────────────
  {
    id: 'offre',
    title: 'Structurer mon offre',
    description: "Définis ton pricing, ta proposition de valeur et ton offre irrésistible.",
    icon: 'Tag',
    lessons: [

      // ── offre.1 ───────────────────────────────────────────────────────────
      {
        id: 'offre.1',
        title: 'Choisir le bon modèle de pricing',
        duration: '7 min',
        body: [],
        blocks: [
          { type: 'text', content: "Ton pricing n'est pas un détail — c'est la deuxième décision la plus importante après le choix du problème. Un mauvais prix tue plus de SaaS que le mauvais code. Voici les 4 modèles qui existent et lequel choisir pour ton premier lancement." },
          { type: 'heading', level: 2, content: 'Les 4 modèles de monétisation' },
          { type: 'diagram-cards', items: [
            { icon: 'refresh-cw',   label: 'Abonnement mensuel',  desc: "Revenu récurrent (MRR). Le gold standard SaaS. Tu factures chaque mois pour un accès continu à la valeur. Prévisible, scalable, valorisable.", color: '#22c55e' },
            { icon: 'credit-card',  label: 'Paiement unique',     desc: "1 paiement, accès à vie. Plus simple à vendre (pas de friction d'abonnement), mais pas de MRR. Idéal pour outils, templates, ou ressources.", color: '#4d96ff' },
            { icon: 'unlock',       label: 'Freemium',            desc: "Version gratuite limitée + plan payant. Volume fort, conversion 2-5%. Nécessite beaucoup de trafic. Complexe à équilibrer en early stage.", color: '#cc5de8' },
            { icon: 'bar-chart-2',  label: 'Usage-based',         desc: "Tu factures à l'utilisation (crédits IA, appels API, tokens). Aligne parfaitement revenus et valeur perçue. Idéal si ta feature est une consommation.", color: '#eab308' },
          ]},
          { type: 'callout', variant: 'tip', title: 'Pour ton premier SaaS', content: "Commence par un abonnement mensuel entre 9 et 49€/mois. C'est le modèle le plus prévisible, le plus facile à optimiser, et celui que les investisseurs valorisent le mieux si tu veux revendre un jour. Un seul plan au lancement — pas de tiers compliqués." },
          { type: 'heading', level: 2, content: 'La formule de pricing en 3 étapes' },
          { type: 'diagram-flow', steps: [
            { label: 'Regarde les concurrents',    sub: "Note les 3 à 5 prix du marché dans ta niche. Ça définit l'ancrage psychologique de ta cible — le \"prix normal\" dans leur tête.", color: '#4d96ff' },
            { label: 'Choisis ton positionnement', sub: "Même prix = différenciation par feature. Prix plus bas = volume. Prix plus haut = premium. Chaque choix est valide — l'important est d'assumer.", color: '#cc5de8' },
            { label: 'Teste vite',                 sub: "Lance avec UN seul plan. Ajuste après tes 50 premiers clients. Le bon prix se découvre avec des vrais clients, pas avant.", color: '#22c55e' },
          ]},
          { type: 'prompt', label: 'Prompt Claude — Définir mon pricing', content: "Je construis un micro-SaaS pour [cible] qui résout ce problème : [description]. Mes concurrents et leurs prix : [concurrent 1] à [prix], [concurrent 2] à [prix], [concurrent 3] à [prix]. Recommande-moi : 1) Le meilleur modèle de monétisation pour ce type de SaaS, 2) Un prix de lancement précis et justifié, 3) Ce qui doit être inclus dans le plan payant pour justifier ce prix, 4) À quel moment (nombre de clients, MRR) je devrais considérer d'augmenter le prix." },
          { type: 'callout', variant: 'action', title: "L'erreur à ne pas faire", content: "Passer 3 semaines à hésiter sur le pricing avant de lancer. Le bon prix se découvre avec de vrais clients — pas avec une feuille Excel. Lance à un prix raisonnable et ajuste. Aucun fondateur n'a trouvé le prix parfait du premier coup." },
          { type: 'quiz-inline',
            question: "Quel modèle de pricing choisirais-tu pour un premier SaaS ciblant des freelances designers ?",
            options: [
              "Abonnement mensuel à 19€/mois — simple, prévisible, MRR",
              "Freemium — pour maximiser le nombre d'inscriptions",
              "Usage-based — on facture uniquement ce qu'ils consomment",
              "Paiement unique à 99€ — évite la friction d'abonnement",
            ],
            correctIndex: 0,
            explanation: "L'abonnement mensuel est le meilleur choix pour un premier SaaS. Il génère du MRR prévisible, est facile à communiquer, et peut être optimisé facilement. Le freemium et l'usage-based sont complexes à opérer seul. Le paiement unique ne génère pas de récurrence.",
          },
        ],
      },

      // ── offre.2 ───────────────────────────────────────────────────────────
      {
        id: 'offre.2',
        title: 'Ta proposition de valeur',
        duration: '6 min',
        body: [],
        blocks: [
          { type: 'text', content: "Ton produit résout un problème. Ta proposition de valeur explique POURQUOI quelqu'un devrait te choisir TOI — plutôt que les alternatives existantes, ou même ne rien faire. C'est la phrase qui va sur ta landing page, dans tes pubs, dans ta bio LinkedIn." },
          { type: 'heading', level: 2, content: 'La formule en 1 phrase' },
          { type: 'text', content: "\"[Produit] aide [cible précise] à [résultat concret] sans [douleur principale].\" — Si tu ne peux pas compléter cette phrase clairement, ton offre n'est pas encore assez définie. Retravaille-la jusqu'à ce qu'elle soit limpide." },
          { type: 'template', title: 'Ta proposition de valeur', sections: [
            { label: 'Construis ta phrase', fields: [
              { name: 'Nom du produit',       placeholder: 'MonSaaS',                              example: 'Buildrs Blueprint' },
              { name: 'Cible précise',        placeholder: 'les freelances designers',              example: 'les solopreneurs non-techniques' },
              { name: 'Résultat concret',     placeholder: 'trouver 3 clients par mois',            example: 'lancer un MVP monétisé en 72h' },
              { name: 'Douleur éliminée',     placeholder: 'sans passer 10h/semaine sur LinkedIn',  example: 'sans savoir coder' },
            ]},
          ]},
          { type: 'heading', level: 2, content: 'Les 3 niveaux de différenciation' },
          { type: 'list', style: 'cards', items: [
            { icon: 'star',      label: 'Feature unique',          desc: "Tu fais 1 chose que personne d'autre ne fait — ou tu la fais nettement mieux. Ex : scoring IA en temps réel, intégration native avec un outil précis.",    accent: '#eab308' },
            { icon: 'sparkles', label: 'Expérience supérieure',    desc: "Mêmes features que les concurrents mais UX 10x plus simple, plus rapide, plus belle. Les gens paient pour la facilité autant que pour la fonctionnalité.", accent: '#cc5de8' },
            { icon: 'target',   label: 'Niche ultra-spécifique',   desc: "Tu sers UN segment ignoré par les généralistes. \"Le CRM pour les coachs sportifs\" bat \"le CRM pour tout le monde\" — à chaque fois, pour ce segment.", accent: '#22c55e' },
          ]},
          { type: 'callout', variant: 'tip', title: "La niche est ta meilleure arme", content: "Les gros acteurs ne peuvent pas se spécialiser autant que toi. \"L'outil de facturation pour les traducteurs freelance\" bat \"l'outil de facturation pour tout le monde\" pour les traducteurs — systématiquement. Plus la niche est précise, moins tu as de concurrence et plus tu peux charger cher." },
          { type: 'prompt', label: 'Prompt Claude — Proposition de valeur', content: "Mon produit [nom] aide [cible] à [résultat]. Mes concurrents principaux : [liste des concurrents]. Génère-moi : 1) 3 propositions de valeur différentes (1 phrase chacune), en variant l'angle de différenciation (feature unique / UX supérieure / niche spécifique), 2) Pour chacune, explique quel angle est utilisé et pourquoi il pourrait resonner, 3) Indique laquelle est la plus forte pour un lancement à froid et pourquoi." },
          { type: 'checklist', title: 'Actions avant la prochaine leçon', items: [
            "Formuler ta proposition de valeur en 1 phrase complète (modèle ci-dessus)",
            "Identifier ton angle de différenciation principal (feature, UX ou niche)",
            "Tester la phrase sur 3 personnes extérieures : comprennent-elles immédiatement ?",
          ]},
          { type: 'quiz-inline',
            question: "Quelle stratégie de différenciation est la plus puissante pour un solopreneur face à des concurrents établis ?",
            options: [
              "La niche ultra-spécifique — servir un segment ignoré par les grands",
              "La feature unique — faire quelque chose que personne ne fait",
              "Le prix le plus bas — être moins cher que tout le monde",
              "Le plus de features — être le plus complet du marché",
            ],
            correctIndex: 0,
            explanation: "La niche spécifique est imbattable pour un solopreneur. Un grand acteur généraliste ne peut pas se spécialiser autant. En te concentrant sur un segment précis, tu peux dominer ce marché, charger plus cher, et fidéliser mieux — sans avoir une équipe entière.",
          },
        ],
      },

      // ── offre.3 ───────────────────────────────────────────────────────────
      {
        id: 'offre.3',
        title: 'Construire une offre irrésistible',
        duration: '8 min',
        body: [],
        blocks: [
          { type: 'text', content: "Un bon produit à un bon prix ne suffit pas. Il faut que l'offre GLOBALE soit irrésistible — que le client se dise \"je serais stupide de ne pas prendre ça\". Voici l'anatomie d'une offre qui convertit." },
          { type: 'heading', level: 2, content: "L'anatomie d'une offre qui convertit" },
          { type: 'diagram-flow', steps: [
            { label: 'Le résultat principal',   sub: "Ce que le client obtient concrètement — formulé comme un résultat, pas une liste de features.", color: '#22c55e' },
            { label: 'Les bonus',               sub: "Ce qui augmente massivement la valeur perçue sans te coûter plus en temps ou en argent.", color: '#4d96ff' },
            { label: 'La garantie',             sub: "Ce qui élimine le risque et la dernière hésitation côté client.", color: '#cc5de8' },
            { label: "L'urgence",               sub: "Ce qui crée une raison légitime d'agir maintenant plutôt que demain.", color: '#eab308' },
            { label: 'Le CTA',                  sub: "Un seul bouton, une seule action. Jamais deux options concurrentes sur la même page.", color: '#ef4444' },
          ]},
          { type: 'heading', level: 2, content: 'Créer des bonus à coût zéro' },
          { type: 'list', style: 'cards', items: [
            { icon: 'file-text',      label: 'Templates et prompts',       desc: "Docs, prompts Claude, checklists que tu as créés pour toi-même. Tu les as déjà — il suffit de les packager.", accent: '#4d96ff' },
            { icon: 'users',          label: 'Accès communauté',           desc: "Un canal WhatsApp ou Discord privé = valeur perçue immense pour le client, coût opérationnel quasi nul pour toi.", accent: '#22c55e' },
            { icon: 'book-open',      label: 'Contenu exclusif',           desc: "Un guide PDF, une vidéo tutoriel, un cas d'étude détaillé. Crée une fois, livre automatiquement à chaque client.", accent: '#cc5de8' },
            { icon: 'message-circle', label: 'Accès direct au fondateur',  desc: "\"Accès email direct\" est un différenciant fort en early stage. Les grandes entreprises ne peuvent pas offrir ça.", accent: '#eab308' },
          ]},
          { type: 'callout', variant: 'tip', title: 'La règle de la valeur perçue', content: "La valeur perçue totale de tes bonus doit être supérieure au prix du produit. Si ton SaaS est à 29€/mois et tes bonus \"valent\" 200€, le client sent qu'il fait une affaire. Ce n'est pas de la manipulation — c'est présenter honnêtement ce que tu livres." },
          { type: 'heading', level: 2, content: "La garantie qui supprime l'objection" },
          { type: 'text', content: "Pour un SaaS : \"7 jours d'essai gratuit\" ou \"Remboursé sous 14 jours si tu n'es pas satisfait\". Pour un produit unique : \"Satisfait ou remboursé 30 jours\". La garantie coûte presque rien (taux de remboursement réel < 5%) mais elle lève la dernière barrière psychologique." },
          { type: 'prompt', label: "Prompt Claude — Offre irrésistible", content: "Je lance [nom du produit] à [prix]/mois. Ma cible : [description précise]. Construis-moi une offre irrésistible complète avec : 1) Le produit formulé comme un résultat (pas une liste de features), 2) 3 à 4 bonus à coût zéro que je peux créer en moins de 2h, 3) Une garantie qui élimine le risque perçu, 4) Un élément d'urgence crédible (pas du faux scarcity — quelque chose de réel), 5) Le texte exact du CTA principal." },
          { type: 'checklist', title: 'Checklist offre complète', items: [
            "Pricing défini et justifié par rapport au marché",
            "Proposition de valeur en 1 phrase, testée sur 3 personnes",
            "Au moins 2 bonus à coût zéro préparés et prêts à livrer",
            "Garantie définie (essai gratuit ou remboursement)",
            "CTA clair et unique sur ta landing page",
            "Passer au module Scaler — tu as tout pour lancer",
          ]},
          { type: 'quiz-inline',
            question: "La valeur perçue de tes bonus par rapport au prix de ton SaaS doit être :",
            options: [
              "Supérieure au prix du produit — le client doit sentir qu'il fait une affaire",
              "Exactement égale au prix — ni plus, ni moins",
              "Inférieure — ne pas surcharger l'offre",
              "Ça n'a pas d'importance — les gens achètent le produit, pas les bonus",
            ],
            correctIndex: 0,
            explanation: "Quand la valeur perçue des bonus dépasse le prix, le client sent qu'il fait une affaire. C'est la mécanique psychologique derrière toutes les grandes offres. Les bonus coûtent peu à créer mais changent radicalement le ratio valeur/prix perçu.",
          },
        ],
      },
    ],
    quizQuestions: [
      {
        id: 'qo-1',
        question: "Quel est le meilleur modèle de pricing pour un premier SaaS ?",
        options: ['Abonnement mensuel — MRR prévisible et optimisable', 'Paiement unique — plus simple à vendre', 'Freemium — maximum de trafic et d\'inscriptions', 'Usage-based — alignement parfait valeur/prix'],
        correctIndex: 0,
        explanation: "L'abonnement mensuel génère du MRR prévisible, est valorisable si tu revends, et est facile à optimiser. Le freemium nécessite un volume massif de trafic. L'usage-based est complexe à opérer seul. Le paiement unique n'a pas de récurrence.",
      },
      {
        id: 'qo-2',
        question: "Tu veux te différencier face à 3 concurrents établis avec beaucoup plus de features que toi. Quelle est la meilleure stratégie ?",
        options: ['Cibler une niche ultra-spécifique ignorée par les grands', 'Copier toutes leurs features pour être au niveau', 'Casser le prix pour attirer leurs clients', 'Créer une campagne publicitaire pour les faire connaître'],
        correctIndex: 0,
        explanation: "La niche spécifique est ta seule arme réelle face à des concurrents établis. Tu ne peux pas les battre sur le nombre de features ou le budget marketing. Mais sur une niche précise, tu peux les dépasser parce qu'ils ne peuvent pas se spécialiser autant.",
      },
      {
        id: 'qo-3',
        question: "Quel est le taux de remboursement réel sur une garantie 30 jours pour un SaaS bien conçu ?",
        options: ['Moins de 5% — la garantie coûte très peu', 'Environ 20-30% — un risque significatif', 'Plus de 50% — les gens en abusent', 'Impossible à estimer — trop variable'],
        correctIndex: 0,
        explanation: "En pratique, un SaaS qui résout un vrai problème a un taux de remboursement inférieur à 5% même avec une garantie généreuse. La garantie lève un frein psychologique fort — et la plupart des clients satisfaits n'ont aucune raison de demander un remboursement.",
      },
    ],
  },

  // ── MODULE SCALER ─────────────────────────────────────────────────────────────
  {
    id: 'scaler',
    title: 'Scaler',
    description: "Fais passer ton SaaS de 0 à 10k MRR et au-delà.",
    icon: 'TrendingUp',
    lessons: [

      // ── scaler.1 ──────────────────────────────────────────────────────────
      {
        id: 'scaler.1',
        title: 'Le Blueprint des 100 premiers users',
        duration: '10 min',
        body: [],
        blocks: [
          { type: 'text', content: "Les 100 premiers utilisateurs sont les plus difficiles à obtenir et les plus importants de ton histoire. Ils valident ton produit, génèrent tes premiers revenus, et deviennent tes premiers ambassadeurs. Voici le blueprint exact — phase par phase." },
          { type: 'heading', level: 2, content: 'Phase 1 — Les 10 premiers (semaine 1)' },
          { type: 'text', content: "Tes 10 premiers users ne viennent JAMAIS d'une pub ou du SEO. Ils viennent de conversations directes et manuelles. C'est lent, c'est un peu gênant — et c'est incontournable. C'est ce qu'a fait Airbnb. C'est ce qu'a fait Stripe. Tu ne fais pas exception." },
          { type: 'diagram-flow', steps: [
            { label: 'Lister 30 contacts dans ta cible',     sub: "LinkedIn, groupes Facebook, Reddit, entourage professionnel. Pas des amis proches — des gens qui ont réellement ce problème.", color: '#4d96ff' },
            { label: 'Envoyer un DM personnalisé',           sub: "\"J'ai construit [X] qui résout [Y]. Je cherche 10 bêta-testeurs — accès gratuit 30 jours. Ça t'intéresse ?\"", color: '#cc5de8' },
            { label: 'Onboarder personnellement',            sub: "Appel de 15min ou message vocal. Montre le produit. Note chaque friction, chaque \"je comprends pas\" — c'est ta feuille de route.", color: '#eab308' },
            { label: 'Collecter un feedback structuré',      sub: "3 questions : qu'est-ce qui marche ? qu'est-ce qui manque ? tu paierais combien ? Les réponses valent de l'or.", color: '#22c55e' },
          ]},
          { type: 'callout', variant: 'action', title: 'Objectif semaine 1', content: "30 DMs envoyés, 10 réponses, 5 à 10 users actifs. Si tu n'atteins pas 10 users en 7 jours — le problème n'est pas le marketing. C'est le product-market fit. Retourne au module Valider et affine l'angle." },
          { type: 'heading', level: 2, content: 'Phase 2 — De 10 à 50 (semaines 2 à 4)' },
          { type: 'list', style: 'cards', items: [
            { icon: 'users',       label: 'Communautés ciblées',   desc: "Poste dans 3 à 5 groupes où ta cible traîne. Règle absolue : apporte de la valeur d'abord (conseil, ressource), mentionne ton outil naturellement ensuite.", accent: '#22c55e' },
            { icon: 'rocket',      label: 'Lancement Product Hunt', desc: "1 lancement bien préparé. Teaser J-7, trouver un hunter actif, screenshots soignés, description claire. Peut générer 100 à 500 visites en 24h.", accent: '#cc5de8' },
            { icon: 'pen-tool',    label: 'Build in public LinkedIn', desc: "1 post par jour pendant 2 semaines. Raconte le build en temps réel — les coulisses, les galères, les victoires. Les gens adorent suivre.", accent: '#4d96ff' },
            { icon: 'share-2',     label: 'Programme de referral',   desc: "Demande à chaque user satisfait de recommander à 2 personnes. Offre 1 mois gratuit par referral converti. Ton meilleur canal à ce stade.", accent: '#eab308' },
          ]},
          { type: 'heading', level: 2, content: 'Phase 3 — De 50 à 100 (mois 2)' },
          { type: 'text', content: "À partir de 50 users, tu commences à avoir des données réelles. C'est le moment de tester tes premiers canaux payants — de façon mesurée, avec un petit budget, en mesurant chaque euro dépensé." },
          { type: 'list', style: 'cards', items: [
            { icon: 'megaphone', label: 'Micro-budget Meta Ads',   desc: "5 à 10€/jour, 1 pub simple vers ta landing. Mesure le CPA (coût par acquisition). Si CPA < prix du 1er mois d'abonnement → scale.", accent: '#ef4444' },
            { icon: 'mail',      label: 'Cold email ciblé',         desc: "50 emails/jour à ta cible. Objet court, message personnalisé, 1 seul CTA. Outils : Instantly ou Lemlist. Taux de réponse visé : 5 à 10%.", accent: '#4d96ff' },
            { icon: 'link',      label: 'Partenariats affiliés',    desc: "Propose à un créateur ou influenceur de ta niche un deal affiliation (20 à 30% récurrent). Coût nul si ça ne convertit pas, que du variable.", accent: '#22c55e' },
          ]},
          { type: 'prompt', label: "Prompt Claude — Plan d'acquisition 100 users", content: "Mon SaaS [nom] aide [cible précise] à [résultat] pour [prix]/mois. J'ai actuellement [X] users. Crée-moi un plan d'action précis pour atteindre 100 users en 60 jours avec : 1) Les 3 canaux d'acquisition prioritaires pour cette niche et cette cible, 2) Un calendrier semaine par semaine avec les actions concrètes, 3) Les métriques à suivre chaque semaine, 4) Le budget minimum recommandé pour les canaux payants, 5) Des exemples de messages/posts adaptés à chaque canal." },
          { type: 'checklist', title: 'Le blueprint en actions concrètes', items: [
            "Lister 30 contacts dans ta cible (LinkedIn, Reddit, groupes FB)",
            "Envoyer 10 DMs personnalisés cette semaine",
            "Onboarder les 5 à 10 premiers users avec un appel ou message vocal",
            "Poster dans 3 communautés en apportant de la valeur en premier",
            "Préparer un lancement Product Hunt (J-7 : teaser, screenshots, hunter)",
            "Mettre en place un mécanisme de referral simple (1 mois gratuit par referral)",
            "Tester une micro-campagne Meta Ads à 5€/jour quand tu es à 30+ users",
          ]},
          { type: 'quiz-inline',
            question: "Quel est le meilleur canal pour tes 10 premiers users ?",
            options: [
              "DMs personnalisés à des personnes dans ta cible",
              "Meta Ads — le trafic payant convertit mieux",
              "SEO — du trafic organique dès le premier jour",
              "Pub YouTube — la vidéo convertit le mieux",
            ],
            correctIndex: 0,
            explanation: "Les 10 premiers users viennent toujours de conversations directes. Le trafic payant et le SEO ne fonctionnent que quand tu as déjà prouvé que ton produit convertit. Sans conversion prouvée, chaque euro de pub est gaspillé. La séquence : DMs manuels → communautés → Product Hunt → puis seulement pub payante.",
          },
        ],
      },

      // ── scaler.2 ──────────────────────────────────────────────────────────
      {
        id: 'scaler.2',
        title: 'Les métriques qui comptent',
        duration: '6 min',
        body: [],
        blocks: [
          { type: 'text', content: "Tu as des users. Maintenant il faut mesurer — les bonnes choses. 90% des fondateurs suivent des vanity metrics (visiteurs, likes, inscriptions) et passent à côté des signaux qui comptent vraiment." },
          { type: 'heading', level: 2, content: 'Les 5 métriques essentielles' },
          { type: 'diagram-cards', items: [
            { icon: 'dollar-sign',  label: 'MRR',        desc: "Monthly Recurring Revenue. LE chiffre. Ce que tu gagnes chaque mois de façon récurrente. Tout le reste en découle.",                                                    color: '#22c55e' },
            { icon: 'user-minus',   label: 'Churn',      desc: "% d'users qui annulent chaque mois. Objectif : < 5%. Au-dessus de 10% → urgence produit. Un SaaS qui fuit ne se remplit jamais.",                                         color: '#ef4444' },
            { icon: 'target',       label: 'CAC',        desc: "Coût d'Acquisition Client. Combien tu dépenses pour obtenir 1 client payant. Doit être inférieur à LTV / 3 au minimum.",                                                   color: '#4d96ff' },
            { icon: 'trending-up',  label: 'LTV',        desc: "Lifetime Value. Combien un client te rapporte en moyenne sur toute sa durée. Règle d'or : LTV > 3x CAC. Sinon tu perds de l'argent à chaque acquisition.",               color: '#cc5de8' },
            { icon: 'zap',          label: 'Activation', desc: "% d'inscrits qui réalisent l'action clé (créer un projet, connecter un outil, etc.). Si < 30% → ton onboarding est cassé. C'est prioritaire à réparer.", color: '#eab308' },
          ]},
          { type: 'callout', variant: 'tip', title: 'La seule métrique de la semaine 1', content: "Est-ce que quelqu'un a payé ? Pas les visiteurs, pas les inscrits gratuits, pas les likes sur ton post LinkedIn. Un paiement d'un inconnu = validation réelle de ton modèle. Tout le reste peut attendre la semaine 2." },
          { type: 'heading', level: 2, content: 'Le tableau de bord minimum' },
          { type: 'text', content: "Pas besoin de Mixpanel ou Amplitude en early stage. Un Google Sheet mis à jour chaque lundi suffit pour prendre les bonnes décisions." },
          { type: 'template', title: 'Tracking hebdomadaire', sections: [
            { label: 'Métriques clés à suivre chaque lundi', fields: [
              { name: 'MRR ce mois',        placeholder: '290€',              example: '1 450€' },
              { name: 'Nouveaux clients',   placeholder: '4',                 example: '12' },
              { name: 'Clients perdus',     placeholder: '1',                 example: '2' },
              { name: 'Churn rate',         placeholder: '2.5%',              example: '4.1%' },
              { name: 'CAC moyen',          placeholder: '8€',                example: '23€' },
              { name: 'Canal source n°1',   placeholder: 'LinkedIn DMs',      example: 'Product Hunt' },
            ]},
          ]},
          { type: 'prompt', label: 'Prompt Claude — Diagnostic métriques', content: "Mon SaaS a [X] users payants, [Y]€ de MRR, et un churn de [Z]% mensuel. Mon CAC moyen est de [C]€ et mon abonnement est à [P]€/mois. Analyse ces métriques et dis-moi : 1) Est-ce que mon ratio LTV/CAC est sain ? 2) Quel est mon problème le plus urgent ? 3) Sur quoi dois-je me concentrer ce mois pour améliorer significativement mon MRR ?" },
          { type: 'quiz-inline',
            question: "Ton churn mensuel est à 15%. Quelle est ta priorité absolue ?",
            options: [
              "Réparer le produit — un churn à 15% signifie que le produit ne délivre pas la promesse",
              "Augmenter le budget acquisition pour compenser les départs",
              "Lancer une campagne de communication pour améliorer l'image",
              "Baisser le prix pour réduire les annulations",
            ],
            correctIndex: 0,
            explanation: "Un churn à 15% signifie que tu perds 15% de ta base chaque mois. Même avec une acquisition parfaite, tu vides un seau percé. La priorité : comprendre pourquoi les gens partent (formulaire à l'annulation), puis réparer. Augmenter l'acquisition avec un churn élevé, c'est courir plus vite en arrière.",
          },
        ],
      },

      // ── scaler.3 ──────────────────────────────────────────────────────────
      {
        id: 'scaler.3',
        title: 'Rétention : garder ses users',
        duration: '7 min',
        body: [],
        blocks: [
          { type: 'text', content: "Acquérir un user coûte 5 fois plus cher que d'en garder un existant. La rétention est la métrique silencieuse qui fait ou défait un SaaS. Un churn de 2% vs 10% sur 12 mois, c'est la différence entre un SaaS qui croît et un SaaS qui stagne." },
          { type: 'heading', level: 2, content: 'Les 3 leviers de rétention' },
          { type: 'list', style: 'cards', items: [
            { icon: 'play-circle',  label: 'Onboarding court',          desc: "Les 5 premières minutes décident de tout. Guide l'user vers sa première victoire (\"first value\") en moins de 2 minutes. Si c'est trop long — ils ne reviennent pas.", accent: '#22c55e' },
            { icon: 'refresh-cw',   label: 'Engagement loops',          desc: "Emails automatiques, récaps hebdomadaires, notifications pertinentes. Rappelle à l'user que ton produit existe et lui apporte de la valeur concrète.", accent: '#4d96ff' },
            { icon: 'anchor',       label: 'Feature stickiness',        desc: "Plus l'user stocke des données, crée du contenu, ou connecte des outils dans ton app — plus c'est difficile de partir. C'est le meilleur verrou naturel.", accent: '#cc5de8' },
          ]},
          { type: 'heading', level: 2, content: "L'email anti-churn" },
          { type: 'text', content: "Quand un user n'est pas revenu depuis 7 jours — envoie un email automatique. Court, personnel, utile. Pas un \"Tu nous manques\" générique — un rappel de valeur concret avec un tip d'utilisation ou un nouveau cas d'usage." },
          { type: 'prompt', label: 'Prompt Claude — Séquence emails rétention', content: "Mon SaaS [nom] a un churn de [X]%/mois. Crée-moi une séquence de 3 emails automatiques pour réduire ce churn : 1) Email J+3 d'inactivité — rappel de valeur concret + tip d'utilisation pratique, 2) Email J+7 — ton personnel \"tu as un problème ? je suis disponible\" (signe par le fondateur), 3) Email J+14 — dernière chance, offre exclusive ou demande de feedback. Ton : personnel, direct, pas corporate. Tutoiement. Zéro emoji. Jamais plus de 5 phrases par email." },
          { type: 'heading', level: 2, content: 'Quand un user annule' },
          { type: 'text', content: "Ne laisse jamais partir un user sans savoir pourquoi. Ajoute un formulaire de 1 question dans le flow de désabonnement : \"Quelle est la raison principale de ton départ ?\" avec 4 choix : trop cher / pas assez utile / trouvé une alternative / besoin terminé. Ces données = ta roadmap produit la plus précieuse." },
          { type: 'checklist', title: 'Actions rétention prioritaires', items: [
            "Mesurer le temps entre l'inscription et la première action clé (\"first value\")",
            "Configurer au moins 1 email automatique (J+3 inactivité)",
            "Ajouter un formulaire 1 question dans le flow d'annulation",
            "Réduire le time-to-first-value à moins de 2 minutes",
            "Identifier les features les plus \"collantes\" (celles que les users actifs utilisent le plus)",
          ]},
          { type: 'quiz-inline',
            question: "Quand envoyer le premier email anti-churn à un user inactif ?",
            options: [
              "Après 3 jours d'inactivité",
              "Après 30 jours — on ne veut pas être intrusif",
              "Uniquement quand l'user clique sur \"Annuler\"",
              "Jamais — c'est perçu comme du spam",
            ],
            correctIndex: 0,
            explanation: "J+3 est le bon timing. Assez tôt pour rattraper un user avant qu'il ait complètement décroche, assez tard pour ne pas paraître désespéré. Après 30 jours sans connexion, 80% des users sont déjà partis mentalement même s'ils n'ont pas annulé.",
          },
        ],
      },

      // ── scaler.4 ──────────────────────────────────────────────────────────
      {
        id: 'scaler.4',
        title: 'De 100 à 1000 users',
        duration: '8 min',
        body: [],
        blocks: [
          { type: 'text', content: "100 users = product-market fit confirmé. Tu sais que ton produit résout un vrai problème, que des gens paient pour ça, et que ton churn est gérable. Maintenant tu scales. Les règles changent : tu passes du \"faire des choses qui ne scalent pas\" à la systématisation." },
          { type: 'heading', level: 2, content: 'Les 3 moteurs de croissance' },
          { type: 'diagram-cards', items: [
            { icon: 'megaphone',  label: 'Paid',    desc: "Meta Ads, Google Ads, sponsoring newsletters. Tu paies pour chaque user. Fonctionne si LTV > 3x CAC. Mesurable, rapide, scalable à l'infini si les chiffres sont bons.",     color: '#ef4444' },
            { icon: 'pen-tool',   label: 'Organic', desc: "SEO, contenu LinkedIn/X, YouTube, blog. Gratuit mais lent. Le compounding effect est énorme après 3 à 6 mois — chaque contenu continue de travailler pour toi.",               color: '#22c55e' },
            { icon: 'share-2',    label: 'Viral',   desc: "Referral, word-of-mouth, build in public. Le plus puissant quand ça prend — coût quasi nul. Chaque client satisfait en amène d'autres sans que tu fasses quoi que ce soit.", color: '#4d96ff' },
          ]},
          { type: 'callout', variant: 'tip', title: 'La règle du 70/20/10', content: "Consacre 70% de tes efforts au canal qui marche le mieux, 20% au deuxième, 10% à expérimenter de nouveaux canaux. Ne dilue pas sur 8 canaux en parallèle — tu n'auras que des résultats médiocres partout." },
          { type: 'heading', level: 2, content: "Automatiser l'acquisition" },
          { type: 'text', content: "À partir de 100 users, automatise tout ce qui est répétitif : emails de bienvenue, séquences de nurturing, relances anti-churn. Utilise Resend pour le transactionnel. Ton temps doit aller sur le produit et la stratégie — pas sur des tâches manuelles répétées chaque semaine." },
          { type: 'heading', level: 2, content: 'Objectifs par palier' },
          { type: 'list', style: 'cards', items: [
            { icon: 'flag',       label: '100 users',     desc: "Product-market fit confirmé. Tu sais qui achète, pourquoi, et par quel canal. C'est la fin du mode \"survie\" et le début du mode \"construction\".",                   accent: '#4d96ff' },
            { icon: 'trending-up', label: '500 users',   desc: "Channel-market fit. Tu as 1 à 2 canaux d'acquisition prévisibles et mesurables. Tu peux doubler le budget sur ces canaux avec confiance.",                              accent: '#22c55e' },
            { icon: 'award',      label: '1 000 users',  desc: "Revenu à plein temps possible. 1 000 users à 29€/mois = 29 000€ MRR. Tu peux envisager de quitter ton emploi ou d'investir dans un poste de support.", accent: '#cc5de8' },
            { icon: 'globe',      label: '5 000+ users', desc: "Ton SaaS vaut 30 à 50x le MRR sur Flippa ou Acquire.com. À 29 000€ MRR → valorisation entre 870k€ et 1,45M€. Tu peux construire, garder ou revendre.", accent: '#eab308' },
          ]},
          { type: 'prompt', label: 'Prompt Claude — Plan de scaling', content: "Mon SaaS a 100 users payants et [X]€ de MRR. Mon meilleur canal d'acquisition est [canal]. Mon churn mensuel est de [Y]%. Mon abonnement est à [Z]€/mois. Crée-moi un plan pour passer à 1 000 users en 6 mois avec : 1) Comment doubler l'efficacité de mon canal principal, 2) 1 nouveau canal à tester ce mois avec un mini-budget, 3) Les 3 bottlenecks probables à anticiper, 4) À quel MRR je peux considérer ça comme revenu principal ou quitter mon emploi si c'est mon objectif." },
          { type: 'cohorte-cta',
            title: "Tu veux aller plus vite ?",
            description: "La Cohorte Buildrs : 60 jours d'accompagnement pour passer de l'idée à ton premier MRR. Sessions live 4x/semaine, support WhatsApp direct, et on construit ensemble.",
            price: "1 497€",
            features: [
              "4 sessions live par semaine avec Alfred et Chris",
              "Support WhatsApp illimité — réponse en moins de 24h",
              "Review de ton produit et de ta stratégie par l'équipe",
              "Garantie : 1 000€/mois en 90 jours ou remboursé",
            ],
          },
          { type: 'checklist', title: "Plan d'action scaling — à faire maintenant", items: [
            "Identifier ton canal d'acquisition n°1 (meilleur ratio effort/résultat)",
            "Automatiser les emails clés : bienvenue, onboarding J+3, anti-churn J+7",
            "Mettre en place un programme de referral simple (1 mois gratuit = 1 referral)",
            "Fixer un objectif MRR à 90 jours et les actions concrètes pour l'atteindre",
            "Décider : je garde et scale / je construis pour revendre / je passe au prochain",
          ]},
          { type: 'quiz-inline',
            question: "Tu as 100 users et 2 900€ de MRR. Quel est ton meilleur levier pour atteindre 1 000 users ?",
            options: [
              "Doubler le budget sur ton canal d'acquisition qui fonctionne déjà",
              "Lancer 5 canaux différents en même temps pour maximiser les chances",
              "Baisser le prix pour attirer plus de monde",
              "Arrêter l'acquisition et se concentrer sur le produit d'abord",
            ],
            correctIndex: 0,
            explanation: "À 100 users avec un canal prouvé, la meilleure action est de doubler la mise sur ce qui marche déjà. Lancer 5 canaux en parallèle dilue tes ressources et tes apprentissages. Baisser le prix détruit ta marge. Le produit est déjà prouvé — c'est le moment d'accélérer l'acquisition, pas de freiner.",
          },
        ],
      },
    ],
    quizQuestions: [
      {
        id: 'qs-1',
        question: "Quel est le meilleur canal pour obtenir tes 10 premiers users payants ?",
        options: ['DMs personnalisés à des personnes dans ta cible', 'Meta Ads — le trafic payant convertit mieux', 'SEO — du trafic organique qualifié', 'Une campagne d\'emailing massive'],
        correctIndex: 0,
        explanation: "Les 10 premiers users viennent toujours de conversations directes. La pub payante ne fonctionne que quand tu as déjà prouvé que ton produit convertit. Sans cette preuve, chaque euro est gaspillé. Séquence : DMs → communautés → Product Hunt → pub payante.",
      },
      {
        id: 'qs-2',
        question: "Quel ratio LTV/CAC est considéré comme sain pour un SaaS ?",
        options: ['LTV > 3x CAC', 'LTV = CAC — on récupère juste son investissement', 'LTV > 10x CAC — ça ne doit pas coûter cher d\'acquérir', 'Ce ratio n\'a pas d\'importance en early stage'],
        correctIndex: 0,
        explanation: "LTV > 3x CAC est le seuil de santé standard. En dessous, tu perds de l'argent à chaque acquisition à l'échelle. Au-dessus de 5x, tu peux aggressivement accélérer l'acquisition. Le ratio s'améliore en réduisant le churn (augmente LTV) ou en optimisant les canaux (réduit CAC).",
      },
      {
        id: 'qs-3',
        question: "À quel palier un SaaS peut-il être envisagé comme revenu principal à plein temps ?",
        options: ['1 000 users payants — ~29 000€ MRR à 29€/mois', '10 users — dès les premières ventes', '10 000 users — la sécurité avant tout', 'Jamais — trop risqué'],
        correctIndex: 0,
        explanation: "1 000 users à 29€/mois = 29 000€ MRR. C'est un revenu significatif qui permet d'envisager une transition à plein temps dans la plupart des situations. Le seuil exact dépend de tes charges personnelles — mais c'est un repère concret et atteignable.",
      },
    ],
  },
]

export const getTotalLessons = () =>
  CURRICULUM.reduce((acc, m) => acc + m.lessons.length, 0)

export const getModule = (id: string) => CURRICULUM.find(m => m.id === id)

export const getLesson = (moduleId: string, lessonId: string) =>
  getModule(moduleId)?.lessons.find(l => l.id === lessonId)

export const getNextLesson = (moduleId: string, lessonId: string) => {
  const mod = getModule(moduleId)
  if (!mod) return null
  const idx = mod.lessons.findIndex(l => l.id === lessonId)
  return mod.lessons[idx + 1] ?? null
}

export const getPrevLesson = (moduleId: string, lessonId: string) => {
  const mod = getModule(moduleId)
  if (!mod) return null
  const idx = mod.lessons.findIndex(l => l.id === lessonId)
  return mod.lessons[idx - 1] ?? null
}
