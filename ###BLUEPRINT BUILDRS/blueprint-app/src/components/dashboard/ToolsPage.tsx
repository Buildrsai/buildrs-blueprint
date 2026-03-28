import {
  ExternalLink, Terminal, Mic, BookOpen, Wand2, Layers, Palette,
  Layout, Paintbrush2, Scissors, Grid3x3, TrendingUp, Shield,
  BarChart3, Search, ShoppingBag, DollarSign, Sparkles, Server, CreditCard,
} from 'lucide-react'
import type { SVGProps } from 'react'
import { BrandIcons } from '../ui/icons'

// ── Types ─────────────────────────────────────────────────────────────────

interface Tool {
  name: string
  desc: string
  url: string
  icon: (className: string) => React.ReactNode
}

interface Category {
  id: string
  label: string
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>
  tools: Tool[]
}

// ── Icon renderer helpers ─────────────────────────────────────────────────

const brand = (
  Icon: (props: SVGProps<SVGSVGElement>) => React.ReactElement,
) => (cls: string) => (
  <Icon className={cls} />
)

const lucide = (
  Icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>,
) => (cls: string) => (
  <Icon size={18} strokeWidth={1.5} className={cls} />
)

// ── Tool catalogue ────────────────────────────────────────────────────────

const CATEGORIES: Category[] = [
  {
    id: 'ai',
    label: 'IA & Productivité',
    icon: Sparkles,
    tools: [
      {
        name: 'Claude',
        desc: "L'IA principale du Blueprint. Code, architecture, debug, rédaction — ton associé IA au quotidien.",
        url: 'https://claude.ai',
        icon: brand(BrandIcons.anthropic),
      },
      {
        name: 'Claude Code',
        desc: 'Claude directement dans ton terminal. Modifie, refactorise et répare ton code en une commande.',
        url: 'https://claude.ai/claude-code',
        icon: lucide(Terminal),
      },
      {
        name: 'Wispr Flow',
        desc: 'Parle au lieu de taper. Dicte tes prompts à la voix dans n\'importe quelle app. Gain de temps massif.',
        url: 'https://whispr.dev',
        icon: lucide(Mic),
      },
      {
        name: 'VS Code',
        desc: "L'éditeur de code de référence. Installe l'extension Claude pour l'assistance en live.",
        url: 'https://code.visualstudio.com',
        icon: brand(BrandIcons.vscode),
      },
      {
        name: 'Notion',
        desc: 'Organisation, notes et documentation. Garde une trace de tes idées, briefs produits et décisions.',
        url: 'https://notion.so',
        icon: lucide(BookOpen),
      },
    ],
  },
  {
    id: 'design',
    label: 'Design & Inspiration',
    icon: Palette,
    tools: [
      {
        name: 'Magic UI',
        desc: 'Composants animés React + Tailwind. Pour des interfaces premium sans effort.',
        url: 'https://magicui.design',
        icon: lucide(Wand2),
      },
      {
        name: '21st.dev',
        desc: 'Composants React prêts à l\'emploi. Cherche "pricing table" ou "hero" et colle dans ton app.',
        url: 'https://21st.dev',
        icon: brand(BrandIcons.twentyOneDev),
      },
      {
        name: 'Shadcn/ui',
        desc: 'Bibliothèque UI accessible et personnalisable. La base de tous les design systems modernes.',
        url: 'https://ui.shadcn.com',
        icon: lucide(Layers),
      },
      {
        name: 'Mobbin',
        desc: "Bibliothèque de captures d'écrans d'apps réelles. Cherche une feature, copie le meilleur design.",
        url: 'https://mobbin.com',
        icon: brand(BrandIcons.mobbin),
      },
      {
        name: 'PagesFlow',
        desc: 'Inspiration UI pour les flows et parcours utilisateurs. Vois comment les meilleures apps structurent leurs écrans.',
        url: 'https://pagesflow.com',
        icon: lucide(Layout),
      },
      {
        name: 'Dribbble',
        desc: "Inspiration design des meilleurs créateurs du monde. Pour trouver ton style et te démarquer.",
        url: 'https://dribbble.com',
        icon: lucide(Paintbrush2),
      },
      {
        name: 'Stitch',
        desc: "Assemble des interfaces en combinant des blocs visuels. Idéal pour maquetter rapidement.",
        url: 'https://stitch.withgoogle.com',
        icon: brand(BrandIcons.stitch),
      },
      {
        name: 'Lucide Icons',
        desc: "Bibliothèque d'icônes SVG fines et cohérentes. Disponibles directement dans React.",
        url: 'https://lucide.dev',
        icon: lucide(Grid3x3),
      },
      {
        name: 'Superwall',
        desc: 'Paywalls optimisés pour maximiser les conversions. A/B test tes offres en temps réel.',
        url: 'https://superwall.com',
        icon: lucide(TrendingUp),
      },
    ],
  },
  {
    id: 'infra',
    label: 'Infrastructure & Déploiement',
    icon: Server,
    tools: [
      {
        name: 'Supabase',
        desc: 'Base de données PostgreSQL + auth + stockage + edge functions. Le backend clé en main de ton app.',
        url: 'https://supabase.com',
        icon: brand(BrandIcons.supabase),
      },
      {
        name: 'Vercel',
        desc: 'Déploiement instantané. Connecte ton GitHub → ton app est live en 2 minutes.',
        url: 'https://vercel.com',
        icon: brand(BrandIcons.vercel),
      },
      {
        name: 'Hostinger',
        desc: 'Hébergement web alternatif. Idéal pour les sites vitrine ou si tu cherches un hébergeur simple et pas cher.',
        url: 'https://hostinger.fr',
        icon: brand(BrandIcons.hostinger),
      },
      {
        name: 'GitHub',
        desc: 'Versioning de ton code. Connecté à Vercel pour le déploiement automatique à chaque push.',
        url: 'https://github.com',
        icon: brand(BrandIcons.github),
      },
    ],
  },
  {
    id: 'payments',
    label: 'Paiements & Auth',
    icon: CreditCard,
    tools: [
      {
        name: 'Stripe',
        desc: 'Paiements en ligne, abonnements, checkout. Le standard mondial, intégrable en moins de 30 min.',
        url: 'https://stripe.com',
        icon: brand(BrandIcons.stripe),
      },
      {
        name: 'Auth0',
        desc: 'Authentification clé en main : email, Google, GitHub, SSO. Sécurisé, rapide à brancher.',
        url: 'https://auth0.com',
        icon: lucide(Shield),
      },
    ],
  },
  {
    id: 'comms',
    label: 'Communication & Analytics',
    icon: BarChart3,
    tools: [
      {
        name: 'Resend',
        desc: 'Emails transactionnels (bienvenue, confirmation, relance). Simple, rapide, avec un excellent taux de délivrabilité.',
        url: 'https://resend.com',
        icon: brand(BrandIcons.resend),
      },
      {
        name: 'PostHog',
        desc: 'Analytics produit open-source. Suis les parcours utilisateurs, les funnels et les conversions.',
        url: 'https://posthog.com',
        icon: lucide(BarChart3),
      },
    ],
  },
  {
    id: 'research',
    label: 'Recherche & Revente',
    icon: Search,
    tools: [
      {
        name: 'Product Hunt',
        desc: 'Découvre les SaaS qui cartonnent. Cherche ta niche, analyse les votes et les commentaires.',
        url: 'https://producthunt.com',
        icon: brand(BrandIcons.producthunt),
      },
      {
        name: 'Indie Hackers',
        desc: 'Communauté de solopreneurs. Les fondateurs partagent leurs MRR, leurs stratégies et leurs erreurs.',
        url: 'https://indiehackers.com',
        icon: lucide(Search),
      },
      {
        name: 'Reddit',
        desc: 'Valide tes idées là où les vrais problèmes sont exprimés. Cherche ta niche + "pain" ou "looking for".',
        url: 'https://reddit.com',
        icon: brand(BrandIcons.reddit),
      },
      {
        name: 'App Store',
        desc: "Analyse les reviews négatives des apps concurrentes. C'est là que se cachent les meilleures opportunités.",
        url: 'https://apps.apple.com',
        icon: lucide(ShoppingBag),
      },
      {
        name: 'Flippa',
        desc: "Marketplace de revente de SaaS. Vends ton app quand elle tourne ou achète des projets existants à scaler.",
        url: 'https://flippa.com',
        icon: brand(BrandIcons.flippa),
      },
      {
        name: 'Acquire.com',
        desc: 'Revente de SaaS premium. Meilleure qualité que Flippa, acheteurs plus sérieux et mieux capitalisés.',
        url: 'https://acquire.com',
        icon: lucide(DollarSign),
      },
      {
        name: 'TrustMRR',
        desc: 'Annuaire de SaaS avec leurs MRR vérifiés. Trouve les niches rentables et analyse les revenus réels avant de te lancer.',
        url: 'https://trustmrr.com',
        icon: lucide(TrendingUp),
      },
    ],
  },
]

// ── Tool card ─────────────────────────────────────────────────────────────

function ToolCard({ tool }: { tool: Tool }) {
  return (
    <a
      href={tool.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-start gap-4 border border-border rounded-xl px-5 py-4 hover:border-foreground/20 hover:bg-secondary/30 transition-all duration-150"
    >
      {/* Icon */}
      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-secondary group-hover:bg-background transition-colors border border-border">
        {tool.icon('w-[18px] h-[18px] text-foreground')}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5">
          <span className="text-sm font-bold text-foreground">{tool.name}</span>
          <ExternalLink
            size={11}
            strokeWidth={1.5}
            className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
          />
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">{tool.desc}</p>
      </div>
    </a>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────

interface Props {
  navigate: (hash: string) => void
}

export function ToolsPage({ navigate: _navigate }: Props) {
  const totalTools = CATEGORIES.reduce((acc, c) => acc + c.tools.length, 0)

  return (
    <div className="p-7 max-w-3xl">

      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">Outils</p>
        <h1 className="text-3xl font-extrabold text-foreground" style={{ letterSpacing: '-0.03em' }}>
          La boîte à outils du vibe coder
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {totalTools} outils — tout ce qu'il faut pour construire, déployer et monétiser.
        </p>
      </div>

      {/* Categories */}
      <div className="flex flex-col gap-10">
        {CATEGORIES.map(cat => {
          const CatIcon = cat.icon
          return (
            <div key={cat.id}>
              <div className="flex items-center gap-2 mb-3">
                <CatIcon size={13} strokeWidth={2} className="text-muted-foreground" />
                <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground">
                  {cat.label}
                </p>
              </div>
              <div className="flex flex-col gap-2">
                {cat.tools.map(tool => (
                  <ToolCard key={tool.name} tool={tool} />
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
