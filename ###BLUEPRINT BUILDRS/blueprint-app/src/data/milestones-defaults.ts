export interface MilestoneDefault {
  title: string
  description: string
  sort_order: number
  linked_agent?: string
}

export const DEFAULT_MILESTONES: MilestoneDefault[] = [
  {
    title: 'Idee validee',
    description: 'Valider le probleme, la cible et la concurrence. Avoir 3+ personnes qui confirment le probleme.',
    sort_order: 0,
    linked_agent: 'jarvis',
  },
  {
    title: 'Architecture definie',
    description: 'Definir les pages, les fonctionnalites MVP, la base de donnees et le stack technique.',
    sort_order: 1,
    linked_agent: 'architect',
  },
  {
    title: 'Branding & Design',
    description: 'Choisir le nom, les couleurs, la typo. Creer le logo. Definir la DA de l\'app.',
    sort_order: 2,
    linked_agent: 'copywriter',
  },
  {
    title: 'Installation environnement',
    description: 'Configurer Claude Code, VS Code, Supabase, Stripe, Vercel, GitHub. Pret a coder.',
    sort_order: 3,
  },
  {
    title: 'Build MVP',
    description: 'Construire la structure de l\'app : auth, dashboard, pages principales.',
    sort_order: 4,
    linked_agent: 'architect',
  },
  {
    title: 'Feature core fonctionnelle',
    description: 'La fonctionnalite principale qui justifie le paiement est live et testee.',
    sort_order: 5,
    linked_agent: 'jarvis',
  },
  {
    title: 'Deploiement live',
    description: 'App deployee sur Vercel avec domaine perso, Supabase prod, Stripe live.',
    sort_order: 6,
  },
  {
    title: 'Lancement & Monetisation',
    description: 'Landing page live, premiers utilisateurs, premiere vente. Let\'s go.',
    sort_order: 7,
    linked_agent: 'copywriter',
  },
]
