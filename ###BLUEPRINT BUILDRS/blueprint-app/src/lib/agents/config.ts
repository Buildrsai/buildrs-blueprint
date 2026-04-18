export type AgentSlug =
  | 'jarvis'
  | 'planner'
  | 'designer'
  | 'db-architect'
  | 'builder'
  | 'connector'
  | 'launcher';

export interface AgentInputField {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'select';
  required: boolean;
  placeholder?: string;
  options?: string[];
  helperText?: string;
}

export interface AgentConfig {
  slug: AgentSlug;
  name: string;
  role: string;
  promiseShort: string;
  promiseLong: string;
  logoPath: string;
  accentColor: string;
  bgAccentColor: string;
  phase: string;
  inputFields: AgentInputField[];
  outputFormat: 'markdown' | 'sql' | 'zip' | 'json';
  usesProjectContext: AgentSlug[];
  promptFile: string;
}

export const AGENTS_CONFIG: Record<AgentSlug, AgentConfig> = {
  jarvis: {
    slug: 'jarvis',
    name: 'Jarvis',
    role: 'Orchestrateur',
    promiseShort: 'Le chef de projet. Il te dit par quel agent commencer.',
    promiseLong: "Tu lui parles de ton idée, il te livre un plan d'action complet avec l'ordre d'activation des 6 autres agents.",
    logoPath: '/agents-logos/jarvis.svg',
    accentColor: 'text-violet-400',
    bgAccentColor: 'bg-violet-500/10',
    phase: 'Toutes les phases',
    inputFields: [
      { name: 'idea_description', label: 'Décris ton idée en 2-5 phrases', type: 'textarea', required: true, placeholder: 'Un SaaS qui aide les coachs à automatiser leurs comptes-rendus de séances...' },
      { name: 'target_audience', label: 'Qui est ta cible ?', type: 'text', required: true, placeholder: 'Coachs indépendants francophones' },
      { name: 'preferred_stack', label: 'Stack préférée (optionnel)', type: 'text', required: false, placeholder: 'React + Supabase par défaut' },
      { name: 'mrr_goal', label: 'Objectif MRR sur 90 jours', type: 'text', required: true, placeholder: '3 000€/mois' }
    ],
    outputFormat: 'markdown',
    usesProjectContext: [],
    promptFile: 'jarvis.md'
  },
  planner: {
    slug: 'planner',
    name: 'Planner',
    role: 'Architecte produit',
    promiseShort: 'Il transforme ton idée en spec technique complète.',
    promiseLong: "Stack, pages, user flows, endpoints API, schéma général. Tout ce qu'il faut pour passer au build sans hésitation.",
    logoPath: '/agents-logos/planner.svg',
    accentColor: 'text-sky-400',
    bgAccentColor: 'bg-sky-500/10',
    phase: 'Modules 01 + 04',
    inputFields: [
      { name: 'detailed_idea', label: 'Description détaillée du produit', type: 'textarea', required: true, helperText: 'Plus tu es précis, mieux Planner structure ton projet.' },
      { name: 'main_feature', label: 'Fonctionnalité principale en 1 phrase', type: 'text', required: true },
      { name: 'target_users_count', label: 'Cibles de users (ex: 100 en 3 mois)', type: 'text', required: false }
    ],
    outputFormat: 'markdown',
    usesProjectContext: ['jarvis'],
    promptFile: 'planner.md'
  },
  designer: {
    slug: 'designer',
    name: 'Designer',
    role: 'Identité & interface',
    promiseShort: 'Il crée l\'identité visuelle de ton SaaS.',
    promiseLong: 'Palette, typo, composants, layouts — tout prêt à implémenter dans Claude Code.',
    logoPath: '/agents-logos/designer.svg',
    accentColor: 'text-pink-400',
    bgAccentColor: 'bg-pink-500/10',
    phase: 'Module 04',
    inputFields: [
      { name: 'brand_vibe', label: 'Vibe de ta marque', type: 'select', required: true, options: ['Premium / Sobre', 'Tech / Cyber', 'Chaleureux / Humain', 'Minimaliste / Neutre', 'Bold / Créatif'] },
      { name: 'inspiration_apps', label: 'Apps que tu trouves belles (2-3)', type: 'text', required: false, placeholder: 'Linear, Notion, Vercel...' },
      { name: 'dark_mode', label: 'Dark mode obligatoire ?', type: 'select', required: true, options: ['Oui, dark only', 'Les deux (toggle)', 'Light only'] }
    ],
    outputFormat: 'markdown',
    usesProjectContext: ['jarvis', 'planner'],
    promptFile: 'designer.md'
  },
  'db-architect': {
    slug: 'db-architect',
    name: 'DB Architect',
    role: 'Base de données',
    promiseShort: 'Il conçoit ta base Supabase sécurisée.',
    promiseLong: 'Schema, RLS, triggers, index. Chaque user ne voit que ses données. Sécurité automatique sur chaque table.',
    logoPath: '/agents-logos/db-architect.svg',
    accentColor: 'text-amber-400',
    bgAccentColor: 'bg-amber-500/10',
    phase: 'Module 05 (data)',
    inputFields: [
      { name: 'entities_list', label: 'Liste des entités principales', type: 'textarea', required: true, placeholder: 'users, projects, tasks, subscriptions...', helperText: "Laisse vide si tu veux que DB Architect infère depuis l'architecture du Planner." },
      { name: 'has_payments', label: 'Gère les paiements Stripe ?', type: 'select', required: true, options: ['Oui, abonnement', 'Oui, one-shot', 'Non, gratuit'] }
    ],
    outputFormat: 'sql',
    usesProjectContext: ['jarvis', 'planner'],
    promptFile: 'db-architect.md'
  },
  builder: {
    slug: 'builder',
    name: 'Builder',
    role: 'Constructeur',
    promiseShort: 'Il génère le méga-prompt de build pour Claude Code.',
    promiseLong: 'Tu copies, Claude Code construit ton app complète. Contexte, conventions, instructions step-by-step.',
    logoPath: '/agents-logos/builder.svg',
    accentColor: 'text-purple-400',
    bgAccentColor: 'bg-purple-500/10',
    phase: 'Module 05 (code)',
    inputFields: [
      { name: 'priority_features', label: 'Features à builder en priorité (MVP)', type: 'textarea', required: true, helperText: '3-5 features max pour rester dans les 6 jours.' }
    ],
    outputFormat: 'markdown',
    usesProjectContext: ['jarvis', 'planner', 'designer', 'db-architect'],
    promptFile: 'builder.md'
  },
  connector: {
    slug: 'connector',
    name: 'Connector',
    role: 'Intégrations & paiements',
    promiseShort: 'Il branche Stripe, Resend, Supabase Auth.',
    promiseLong: "Tout le plumbing qui te fait perdre des heures. Snippets prêts à coller, variables d'env, webhooks.",
    logoPath: '/agents-logos/connector.svg',
    accentColor: 'text-cyan-400',
    bgAccentColor: 'bg-cyan-500/10',
    phase: 'Module 06',
    inputFields: [
      { name: 'integrations_needed', label: 'Services à brancher', type: 'textarea', required: true, placeholder: 'Stripe (checkout + webhooks), Resend (welcome + transactional), Supabase Auth (email + Google)' }
    ],
    outputFormat: 'markdown',
    usesProjectContext: ['jarvis', 'planner', 'db-architect'],
    promptFile: 'connector.md'
  },
  launcher: {
    slug: 'launcher',
    name: 'Launcher',
    role: 'Mise en marché',
    promiseShort: 'Il génère ta landing page, tes posts, ta première campagne.',
    promiseLong: 'Kit de lancement complet. Lance dans les 24h qui suivent ton déploiement.',
    logoPath: '/agents-logos/launcher.svg',
    accentColor: 'text-orange-400',
    bgAccentColor: 'bg-orange-500/10',
    phase: 'Module 07',
    inputFields: [
      { name: 'positioning', label: 'Positionnement en 1 phrase', type: 'text', required: true, placeholder: 'Le CRM vocal pour coachs indépendants' },
      { name: 'pricing', label: 'Prix que tu vas pratiquer', type: 'text', required: true, placeholder: '29€/mois' },
      { name: 'launch_channels', label: 'Canaux de lancement prévus', type: 'text', required: true, placeholder: 'Meta Ads, LinkedIn, Product Hunt' }
    ],
    outputFormat: 'markdown',
    usesProjectContext: ['jarvis', 'planner', 'designer'],
    promptFile: 'launcher.md'
  }
};

export function getAgentConfig(slug: AgentSlug): AgentConfig {
  const config = AGENTS_CONFIG[slug];
  if (!config) throw new Error(`Unknown agent: ${slug}`);
  return config;
}
