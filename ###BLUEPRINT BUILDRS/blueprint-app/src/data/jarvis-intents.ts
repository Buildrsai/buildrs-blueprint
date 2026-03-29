// ── Jarvis Intent Engine ───────────────────────────────────────────────────
// Local intelligence layer : ~25 intents couvrant curriculum, outils,
// navigation et motivation. Réponse instantanée (~80% des cas d'usage).
// Les questions sans match sont renvoyées à l'Edge Function Claude.

export interface JarvisLink {
  label: string
  route: string
}

export interface JarvisIntent {
  id: string
  patterns: RegExp[]
  response: string
  links?: JarvisLink[]
  category: 'curriculum' | 'tools' | 'navigation' | 'motivation' | 'general'
}

// Normalise le message : minuscules + suppression des accents
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
}

export function matchIntent(message: string): JarvisIntent | null {
  const n = normalizeText(message)
  for (const intent of JARVIS_INTENTS) {
    for (const pattern of intent.patterns) {
      if (pattern.test(n)) return intent
    }
  }
  return null
}

// ── Intents ────────────────────────────────────────────────────────────────
export const JARVIS_INTENTS: JarvisIntent[] = [

  // ── GÉNÉRAL ───────────────────────────────────────────────────────────────

  {
    id: 'greeting',
    category: 'general',
    patterns: [
      /^(salut|bonjour|bonsoir|coucou|hello|hey|yo|hi)\b/,
    ],
    response: 'Quoi de neuf ! Dis-moi où tu en es dans ton projet — je peux t\'aider à avancer sur n\'importe quelle étape.',
  },

  {
    id: 'who_are_you',
    category: 'general',
    patterns: [
      /qui es.?tu/,
      /c.?est quoi jarvis/,
      /tu fais quoi/,
      /comment tu fonctionnes/,
      /a quoi tu sers/,
    ],
    response: 'Je suis **Jarvis**, ton copilote IA intégré au dashboard Blueprint.\n\nJe connais le curriculum complet (7 modules), tous les outils du stack, et les plugins IA. Pose-moi n\'importe quelle question sur ton projet — je te redirige vers la bonne ressource ou je t\'explique le concept.',
  },

  {
    id: 'how_it_works',
    category: 'general',
    patterns: [
      /comment ca marche/,
      /comment utiliser blueprint/,
      /comment utiliser ce dashboard/,
      /par ou je commence/,
      /ou est.?ce que je commence/,
      /comment commencer/,
      /premier pas/,
      /premiers pas/,
      /debut/,
    ],
    response: 'Le parcours Blueprint se divise en **7 modules** :\n\n**Module 00** — Fondations (comprendre le contexte)\n**Module 01** — Trouver & Valider ton idée\n**Module 02** — Design & Branding\n**Module 03** — Architecture technique\n**Module 04** — Construire avec Claude\n**Module 05** — Déployer en ligne\n**Module 06** — Monétiser & Lancer\n\nCommence par les Fondations si tu débutes, ou saute directement au module qui correspond à où tu en es.',
    links: [
      { label: 'Module 00 — Fondations', route: '#/dashboard/module/00' },
      { label: 'Module 01 — Trouver & Valider', route: '#/dashboard/module/01' },
    ],
  },

  // ── CURRICULUM ────────────────────────────────────────────────────────────

  {
    id: 'module_00',
    category: 'curriculum',
    patterns: [
      /module 00/,
      /module zero/,
      /fondations/,
      /c.?est quoi un saas/,
      /micro.?saas/,
      /vibe.?coding/,
      /product builder/,
      /strategie de depart/,
    ],
    response: '**Module 00 — Fondations** pose les bases mentales et stratégiques.\n\nTu y trouveras :\n— C\'est quoi un micro-SaaS et pourquoi c\'est le meilleur business en 2026\n— C\'est quoi le vibe coding (tu décris, l\'IA construit)\n— Les 3 stratégies de départ (copier, résoudre, découvrir)\n— Les 3 modèles de monétisation (MRR, flip, commande)\n— Le glossaire complet (MVP, API, Auth, etc.)\n\nC\'est le module "mindset" — il te donne le cadre pour tout ce qui suit.',
    links: [{ label: 'Module 00 — Fondations', route: '#/dashboard/module/00' }],
  },

  {
    id: 'module_01',
    category: 'curriculum',
    patterns: [
      /module 01/,
      /module 1\b/,
      /trouver.*(une )?idee/,
      /valider.*(mon )?idee/,
      /comment (trouver|avoir|generer) (une )?idee/,
      /j.ai pas d.idee/,
      /pas d.idee/,
      /idee de saas/,
    ],
    response: '**Module 01 — Trouver & Valider** t\'aide à trouver une idée solide ET à la valider avant de coder.\n\nLes étapes clés :\n1. Générer des idées avec **NicheFinder** (plugin IA intégré)\n2. Analyser la concurrence sur Product Hunt, Indie Hackers, Acquire.com\n3. Valider avec **MarketPulse** — il te donne un score sur 100 et analyse le marché\n4. Créer ton brief produit (nom, problème, cible, feature core, prix)\n\n**Règle d\'or :** 90% des MVP échouent parce qu\'ils résolvent un problème imaginaire. Valide avant de construire.',
    links: [
      { label: 'Module 01 — Trouver & Valider', route: '#/dashboard/module/01' },
      { label: 'NicheFinder™ — Génère des idées', route: '#/dashboard/generator/ideas' },
      { label: 'MarketPulse™ — Valide ton idée', route: '#/dashboard/generator/validate' },
    ],
  },

  {
    id: 'module_02',
    category: 'curriculum',
    patterns: [
      /module 02/,
      /module 2\b/,
      /design/,
      /branding/,
      /interface/,
      /ui\b/,
      /moodboard/,
      /couleurs/,
      /logo/,
      /preparer/,
    ],
    response: '**Module 02 — Préparer & Designer** transforme ton idée en identité visuelle.\n\nCe que tu fais ici :\n— Configurer ton environnement (Claude Code, VS Code, Supabase, Stripe, Vercel, GitHub)\n— Trouver l\'inspiration sur Mobbin, 21st.dev, Magic UI\n— Créer ton branding en 15 min (nom, couleurs, typo) avec un prompt Claude\n— Définir le parcours utilisateur (de l\'inscription au paiement)\n\nAstuce : cherche 3-5 apps similaires sur Mobbin, capture les meilleures interfaces, et donne-les à Claude comme référence.',
    links: [{ label: 'Module 02 — Design & Branding', route: '#/dashboard/module/02' }],
  },

  {
    id: 'module_03',
    category: 'curriculum',
    patterns: [
      /module 03/,
      /module 3\b/,
      /architecture/,
      /base de donnees/,
      /schema/,
      /tables/,
      /auth(entification)?/,
      /securite/,
      /rls/,
    ],
    response: '**Module 03 — Architecture** définit les fondations techniques de ton app.\n\nLes 3 éléments essentiels :\n1. **Base de données Supabase** — le prompt "Architecte" génère le schéma complet (tables, relations, colonnes)\n2. **Auth** — connexion email / Google via Supabase Auth, prête en 10 min\n3. **Sécurité** — RLS Supabase, variables d\'environnement, HTTPS\n\n**Règle d\'or :** 20 min de planification = 5h de développement économisées. Ne saute pas cette étape.',
    links: [{ label: 'Module 03 — Architecture', route: '#/dashboard/module/03' }],
  },

  {
    id: 'module_04',
    category: 'curriculum',
    patterns: [
      /module 04/,
      /module 4\b/,
      /construire/,
      /comment coder/,
      /comment builder/,
      /comment creer (mon |une )?app/,
      /scaffolding/,
      /feature principale/,
      /build/,
    ],
    response: '**Module 04 — Construire** c\'est là que l\'IA code pour toi.\n\nLe process :\n1. Un prompt complet pour initialiser le projet (Claude Code + Vite)\n2. **LA feature core** — une seule, celle qui justifie le paiement\n3. Les pages essentielles (accueil, auth, dashboard, pricing)\n4. Intégration IA si ton SaaS en a besoin (Claude API)\n5. L\'onboarding utilisateur\n6. Debug + Polish avec des prompts dédiés\n\n**Mindset :** Tu ne codes pas, tu décris. Claude construit, tu valides. C\'est le vibe coding.',
    links: [{ label: 'Module 04 — Construire', route: '#/dashboard/module/04' }],
  },

  {
    id: 'module_05',
    category: 'curriculum',
    patterns: [
      /module 05/,
      /module 5\b/,
      /deployer/,
      /mise en ligne/,
      /comment mettre en ligne/,
      /lancer (mon )?app/,
      /domaine/,
      /dns/,
      /passer en production/,
      /live\b/,
    ],
    response: '**Module 05 — Déployer** met ton app en ligne pour le monde entier.\n\nLes étapes :\n1. **Vercel** — connecte GitHub, push ton code, l\'app est live en 2 min\n2. **Domaine** — connecte ton nom de domaine (DNS en 10 min)\n3. **Stripe** — crée tes produits, prix et checkout en live\n4. **Emails** — templates de bienvenue et confirmation via Resend\n5. **Checklist pré-lancement** — 10 vérifications avant d\'annoncer\n\n**Astuce :** GitHub → Vercel = déploiement automatique à chaque push.',
    links: [{ label: 'Module 05 — Déployer', route: '#/dashboard/module/05' }],
  },

  {
    id: 'module_06',
    category: 'curriculum',
    patterns: [
      /module 06/,
      /module 6\b/,
      /monetiser/,
      /monetisation/,
      /premiers clients/,
      /premiere vente/,
      /page de vente/,
      /landing page/,
      /meta ads/,
      /acquisition/,
      /lancement/,
    ],
    response: '**Module 06 — Monétiser & Lancer** t\'amène à tes premiers euros.\n\nLe plan :\n1. **Page de vente** — un prompt Claude génère ta landing complète\n2. **Stratégie de prix** — paiement unique vs abonnement vs freemium\n3. **Mentions légales** — CGV, politique de confidentialité générées par Claude\n4. **Contenu de lancement** — 5 posts LinkedIn + 3 posts X + 1 email prêts à copier\n5. **Meta Ads** — première campagne simple avec budget minimum\n6. **Métriques** — visiteurs, inscriptions, MRR à suivre dès le jour 1',
    links: [{ label: 'Module 06 — Monétiser & Lancer', route: '#/dashboard/module/06' }],
  },

  // ── OUTILS ────────────────────────────────────────────────────────────────

  {
    id: 'tool_claude_code',
    category: 'tools',
    patterns: [
      /claude code/,
      /comment utiliser claude/,
      /prompts (de |pour )?(claude|ia)/,
      /c.?est quoi claude code/,
      /vscode/,
      /vs code/,
      /terminal ia/,
    ],
    response: '**Claude Code** est l\'outil principal pour construire ton SaaS.\n\nC\'est une extension VS Code + terminal qui te permet de décrire ce que tu veux en langage naturel et d\'obtenir du code immédiatement.\n\n**Comment l\'utiliser :**\n1. Installe VS Code + l\'extension Claude Code\n2. Ouvre ton projet dans VS Code\n3. Tape `/` dans le terminal Claude pour accéder aux commandes\n4. Décris ta feature en français — Claude construit, tu valides\n\n**Tous les prompts optimisés** sont dans la Bibliothèque, organisés par module.',
    links: [
      { label: 'Module Claude 360°', route: '#/dashboard/module/claude' },
      { label: 'Bibliothèque des prompts', route: '#/dashboard/library' },
    ],
  },

  {
    id: 'tool_supabase',
    category: 'tools',
    patterns: [
      /supabase/,
      /base de donnees/,
      /postgresql/,
      /c.?est quoi supabase/,
      /auth supabase/,
      /supabase auth/,
      /rls\b/,
    ],
    response: '**Supabase** est le backend de ton SaaS — base de données, authentification et API en temps réel, tout en un.\n\n**Ce que tu utilises :**\n— **PostgreSQL** : ta base de données relationnelle\n— **Auth** : connexion email / Google / Magic Link sans code\n— **Storage** : upload de fichiers et images\n— **Edge Functions** : logique serveur (Deno)\n— **Row Level Security (RLS)** : chaque utilisateur ne voit que ses données\n\nSuivre le Module 03 pour configurer ton schéma Supabase avec Claude.',
    links: [{ label: 'Module 03 — Architecture', route: '#/dashboard/module/03' }],
  },

  {
    id: 'tool_stripe',
    category: 'tools',
    patterns: [
      /stripe/,
      /paiement/,
      /checkout/,
      /abonnement/,
      /subscription/,
      /comment encaisser/,
      /comment recevoir (de l.)?argent/,
    ],
    response: '**Stripe** gère tous tes paiements — c\'est la référence mondiale, utilisé par Airbnb, Shopify, et des milliers de SaaS.\n\n**Setup rapide :**\n1. Crée un compte Stripe (gratuit)\n2. Crée un produit + un prix (abonnement ou one-shot)\n3. Génère un lien Checkout ou intègre le formulaire Stripe dans ton app\n4. Les paiements arrivent directement sur ton compte bancaire\n\n**Commissions :** 1.5% + 0.25€ par transaction en Europe. Pas de frais fixes.\n\nLe Module 05 contient le prompt complet pour brancher Stripe dans ton app.',
    links: [{ label: 'Module 05 — Déployer', route: '#/dashboard/module/05' }],
  },

  {
    id: 'tool_vercel',
    category: 'tools',
    patterns: [
      /vercel/,
      /deployment/,
      /deploiement/,
      /hosting/,
      /hebergement/,
      /c.?est quoi vercel/,
    ],
    response: '**Vercel** est la plateforme de déploiement — ton app passe de ton ordinateur à Internet en moins de 2 minutes.\n\n**Comment ça marche :**\n1. Connecte ton repo GitHub à Vercel\n2. Chaque push sur `main` = déploiement automatique\n3. Tu as une URL publique immédiatement\n4. Connecte ton domaine en quelques clics\n\n**Gratuit** pour les projets solo. Aucune configuration serveur nécessaire.',
    links: [{ label: 'Module 05 — Déployer', route: '#/dashboard/module/05' }],
  },

  {
    id: 'tool_resend',
    category: 'tools',
    patterns: [
      /resend/,
      /emails/,
      /email transactionnel/,
      /envoyer (des )?emails/,
      /email de bienvenue/,
      /notification (par )?email/,
    ],
    response: '**Resend** envoie les emails transactionnels de ton SaaS — bienvenue, confirmation de paiement, réinitialisation de mot de passe.\n\n**Setup en 10 min :**\n1. Crée un compte Resend (gratuit jusqu\'à 3 000 emails/mois)\n2. Vérifie ton domaine (DNS)\n3. Utilise l\'API Resend depuis tes Edge Functions Supabase\n4. Crée tes templates avec le prompt du Module 05\n\n**Conseil :** commence avec les 3 emails essentiels — bienvenue, confirmation, relance.',
    links: [{ label: 'Module 05 — Déployer', route: '#/dashboard/module/05' }],
  },

  {
    id: 'tool_github',
    category: 'tools',
    patterns: [
      /github/,
      /git\b/,
      /versioning/,
      /sauvegarder (le )?code/,
      /c.?est quoi git/,
    ],
    response: '**GitHub** sauvegarde et versionne ton code — c\'est le filet de sécurité indispensable.\n\n**Utilisation basique :**\n1. Crée un repo pour ton projet\n2. `git add .` → `git commit -m "description"` → `git push`\n3. Ton code est sauvegardé et historisé\n4. Connecté à Vercel = déploiement automatique à chaque push\n\nClaude Code gère les commits automatiquement si tu lui demandes.',
    links: [{ label: 'Module 02 — Configurer l\'env', route: '#/dashboard/module/02' }],
  },

  // ── PLUGINS IA ────────────────────────────────────────────────────────────

  {
    id: 'plugin_nichefinder',
    category: 'tools',
    patterns: [
      /nichefinder/,
      /generateur d.idee/,
      /generateur d.idees/,
      /trouver une niche/,
      /idees de saas/,
      /quelles idees/,
    ],
    response: '**NicheFinder™** est le générateur d\'idées de micro-SaaS intégré.\n\nRemplis ton profil (secteur, compétences, budget) et il génère des idées de SaaS adaptées à ton contexte — avec le marché cible, le modèle de prix suggéré et le niveau de difficulté.\n\nUtilise-le comme point de départ, puis valide les meilleures idées avec MarketPulse.',
    links: [{ label: 'NicheFinder™ — Générer des idées', route: '#/dashboard/generator/ideas' }],
  },

  {
    id: 'plugin_marketpulse',
    category: 'tools',
    patterns: [
      /marketpulse/,
      /validateur/,
      /valider (mon |une )?idee/,
      /score de viabilite/,
      /analyser (le )?marche/,
      /concurrence/,
    ],
    response: '**MarketPulse™** analyse ton idée et te donne un score sur 100 en quelques secondes.\n\nIl évalue :\n— La taille du marché\n— La concurrence existante\n— Le potentiel de monétisation\n— Les risques principaux\n\n**Score > 70** = idée solide, tu peux passer au Module 02.\n**Score < 50** = affine l\'idée ou change de niche.',
    links: [{ label: 'MarketPulse™ — Valider ton idée', route: '#/dashboard/generator/validate' }],
  },

  {
    id: 'plugin_flipcalc',
    category: 'tools',
    patterns: [
      /flipcalc/,
      /mrr/,
      /revenu mensuel/,
      /combien (je )?peux gagner/,
      /projection (de )?revenus/,
      /valorisation/,
      /revente/,
      /flippa/,
      /arr\b/,
    ],
    response: '**FlipCalc™** projette tes revenus sur 12 mois et calcule la valorisation de revente de ton SaaS.\n\nTu rentres :\n— Prix mensuel par utilisateur\n— Nombre d\'utilisateurs actuels\n— Taux de croissance mensuel (%)\n— Churn mensuel (%)\n\nIl te donne le **MRR mois 12**, l\'**ARR** et trois estimations de valorisation (Flippa 30× / Standard 40× / Premium 55× le MRR).',
    links: [{ label: 'FlipCalc™ — Calculer ton MRR', route: '#/dashboard/generator/mrr' }],
  },

  // ── NAVIGATION ────────────────────────────────────────────────────────────

  {
    id: 'nav_project',
    category: 'navigation',
    patterns: [
      /mon projet/,
      /modifier (le )?projet/,
      /definir (mon )?projet/,
      /ou est (mon )?projet/,
    ],
    response: 'Ton espace projet est ici — tu peux définir ou modifier le nom, le problème, la cible, la feature principale et le statut.',
    links: [{ label: 'Mes Projets', route: '#/dashboard/project' }],
  },

  {
    id: 'nav_checklist',
    category: 'navigation',
    patterns: [
      /checklist/,
      /ma progression/,
      /ou en suis.?je/,
      /ce que j.ai fait/,
      /ce qui reste/,
      /cocher/,
    ],
    response: 'Ta checklist suit ta progression globale étape par étape — coche chaque action accomplie pour visualiser ton avancement.',
    links: [{ label: 'Checklist', route: '#/dashboard/checklist' }],
  },

  {
    id: 'nav_library',
    category: 'navigation',
    patterns: [
      /bibliotheque/,
      /ou sont les prompts/,
      /trouver (un )?prompt/,
      /templates/,
      /ressources/,
    ],
    response: 'La Bibliothèque regroupe tous les prompts organisés par module, les templates (brief produit, emails, landing page) et les liens vers tous les outils.',
    links: [{ label: 'Bibliothèque', route: '#/dashboard/library' }],
  },

  {
    id: 'nav_tools',
    category: 'navigation',
    patterns: [
      /boite a outils/,
      /liste (des )?outils/,
      /tous les outils/,
      /toolbox/,
    ],
    response: 'La Boîte à outils liste tous les outils du stack avec leur rôle et les liens de configuration.',
    links: [{ label: 'Boîte à outils', route: '#/dashboard/tools' }],
  },

  // ── MOTIVATION & DÉBLOCAGE ────────────────────────────────────────────────

  {
    id: 'blocked',
    category: 'motivation',
    patterns: [
      /je suis bloque/,
      /je sais pas quoi faire/,
      /j.avance pas/,
      /aide.?moi/,
      /help\b/,
      /j.ai besoin d.aide/,
      /que faire/,
    ],
    response: 'Aucun problème — dis-moi exactement où tu es bloqué et on débloque ça ensemble.\n\nQuelques questions pour cibler :\n— Est-ce que tu as déjà une idée de SaaS ?\n— Est-ce que tu as déjà commencé à configurer les outils ?\n— Est-ce que c\'est plutôt une question technique ou de stratégie ?\n\nPartage-moi le contexte et je t\'oriente vers la bonne ressource.',
  },

  {
    id: 'too_technical',
    category: 'motivation',
    patterns: [
      /trop technique/,
      /je sais pas coder/,
      /je ne sais pas coder/,
      /pas developpeur/,
      /pas technique/,
      /je comprends pas/,
      /trop complique/,
    ],
    response: '**Tu n\'as pas besoin de savoir coder.** C\'est exactement l\'objet de Blueprint.\n\nLe vibe coding, c\'est ça : tu décris ce que tu veux en langage naturel, Claude construit le code. Ton rôle = diriger, valider, décider. Pas écrire du code.\n\nLa plupart des membres de la communauté Blueprint ont lancé leur premier SaaS sans aucune expérience technique. Le Module 00 explique exactement ce mindset.',
    links: [{ label: 'Module 00 — Fondations', route: '#/dashboard/module/00' }],
  },

  {
    id: 'fear_doubt',
    category: 'motivation',
    patterns: [
      /j.ai peur/,
      /pas sur/,
      /pas confiant/,
      /doute/,
      /ca va pas marcher/,
      /c.?est pas pour moi/,
      /decourage/,
      /abandonne/,
    ],
    response: 'Le doute est normal — c\'est même bon signe, ça veut dire que tu prends ça au sérieux.\n\nCe qui fonctionne : **un petit pas concret maintenant**. Pas besoin d\'avoir tout prévu.\n\nSi tu n\'as pas encore d\'idée → ouvre NicheFinder.\nSi tu as une idée → valide-la avec MarketPulse (5 min).\nSi tu as validé → définis ton projet dans l\'espace Projets.\n\nLe momentum se construit action par action.',
    links: [
      { label: 'NicheFinder™ — Trouver une idée', route: '#/dashboard/generator/ideas' },
      { label: 'MarketPulse™ — Valider', route: '#/dashboard/generator/validate' },
    ],
  },

  {
    id: 'monetization',
    category: 'curriculum',
    patterns: [
      /comment gagner de l.argent/,
      /combien peut.?on gagner/,
      /modele de prix/,
      /abonnement ou paiement unique/,
      /freemium/,
      /comment fixer le prix/,
      /tarification/,
    ],
    response: 'Il y a **3 modèles de monétisation** dans Blueprint :\n\n**1. MRR (abonnement mensuel)** — tu gardes et développes ton SaaS. Revenus récurrents et prévisibles.\n\n**2. Flip (revente)** — tu construis vite, tu vends sur Flippa ou Acquire.com. Un SaaS avec 1k€/mois de MRR vaut 30-55× son MRR à la revente.\n\n**3. Commande client** — tu construis pour quelqu\'un d\'autre. Facturation 2 000-10 000€ par projet.\n\nLe Module 06 couvre en détail la stratégie de prix et les erreurs classiques.',
    links: [
      { label: 'Module 06 — Monétiser & Lancer', route: '#/dashboard/module/06' },
      { label: 'FlipCalc™ — Projeter les revenus', route: '#/dashboard/generator/mrr' },
    ],
  },
]
