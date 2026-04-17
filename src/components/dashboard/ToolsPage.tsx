import { ExternalLink, ArrowRight, TrendingUp, Layout, Wand2, DollarSign } from 'lucide-react'
import { BrandIcons } from '../ui/icons'

// ── Jarvis mini robot (couleurs intactes) ─────────────────────────────────────
function JarvisIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <rect x="7" y="0" width="2" height="3" fill="#818cf8"/>
      <rect x="15" y="0" width="2" height="3" fill="#818cf8"/>
      <rect x="5" y="2" width="2" height="2" fill="#818cf8"/>
      <rect x="17" y="2" width="2" height="2" fill="#818cf8"/>
      <rect x="3" y="4" width="18" height="12" rx="2" fill="#6366f1"/>
      <rect x="6" y="7" width="4" height="4" rx="1" fill="#c7d2fe"/>
      <rect x="14" y="7" width="4" height="4" rx="1" fill="#c7d2fe"/>
      <rect x="7" y="8" width="2" height="2" fill="#312e81"/>
      <rect x="15" y="8" width="2" height="2" fill="#312e81"/>
      <rect x="9" y="13" width="6" height="2" rx="1" fill="#4338ca"/>
      <rect x="5" y="17" width="4" height="4" rx="1" fill="#4338ca"/>
      <rect x="15" y="17" width="4" height="4" rx="1" fill="#4338ca"/>
    </svg>
  )
}

// ── Icon helpers ──────────────────────────────────────────────────────────────

function iconBrand(
  Icon: (props: React.SVGProps<SVGSVGElement>) => React.ReactElement,
  color: string,
  bg: string,
) {
  return (
    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: bg }}>
      <Icon width={20} height={20} style={{ color }} />
    </div>
  )
}

function iconMono(Icon: (props: React.SVGProps<SVGSVGElement>) => React.ReactElement) {
  return (
    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-secondary">
      <Icon width={20} height={20} className="text-foreground" />
    </div>
  )
}

function iconLucide(
  Icon: React.ComponentType<{ size?: number; strokeWidth?: number; style?: React.CSSProperties }>,
  color: string,
  bg: string,
) {
  return (
    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: bg }}>
      <Icon size={20} strokeWidth={1.5} style={{ color }} />
    </div>
  )
}

function iconImg(src: string, bg?: string) {
  return (
    <div className="w-10 h-10 rounded-xl flex-shrink-0 overflow-hidden flex items-center justify-center" style={{ background: bg ?? 'transparent' }}>
      <img src={src} alt="" className="w-10 h-10 object-cover" />
    </div>
  )
}

// ── Badge presets ─────────────────────────────────────────────────────────────

const BADGE_FREE   = { label: 'Gratuit',               color: '#22c55e', bg: 'rgba(34,197,94,0.1)'   }
const BADGE_SEARCH = { label: 'Recherche',              color: '#3b82f6', bg: 'rgba(59,130,246,0.1)'  }
const BADGE_SELL   = { label: 'Valorisation & Revente', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' }

// ── Types ─────────────────────────────────────────────────────────────────────

interface ToolBadge {
  label: string
  color: string
  bg: string
}

interface Tool {
  name: string
  desc: string
  url: string
  internal?: boolean
  icon: React.ReactNode
  badge?: ToolBadge
}

interface Section {
  id: string
  n: number
  title: string
  subtitle: string
  accent: string
  tools: Tool[]
}

// ── Data ──────────────────────────────────────────────────────────────────────

const SECTIONS: Section[] = [
  // ── 1. Tes IAs ───────────────────────────────────────────────────────────
  {
    id: 'ia',
    n: 1,
    title: 'Tes IAs',
    subtitle: 'Configure tes copilotes en premier — ils vont avec toi sur tous tes projets.',
    accent: '#a78bfa',
    tools: [
      {
        name: 'Claude',
        desc: "L'IA principale. Code, architecture, debug, copy — ton partenaire numéro 1.",
        url: 'https://claude.ai',
        icon: iconBrand(BrandIcons.claude, '#D97757', 'rgba(217,119,87,0.1)'),
      },
      {
        name: 'Jarvis',
        desc: "Ton copilote Buildrs intégré. Il connaît le Blueprint, le curriculum et ton avancement.",
        url: '#/dashboard/autopilot',
        internal: true,
        icon: (
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(99,102,241,0.12)' }}>
            <JarvisIcon size={22} />
          </div>
        ),
      },
      {
        name: 'Perplexity',
        desc: "Recherche IA avec sources citées — valide tes niches, analyse la concurrence en temps réel.",
        url: 'https://perplexity.ai',
        icon: iconBrand(BrandIcons.perplexity, '#20808D', 'rgba(32,128,141,0.1)'),
        badge: BADGE_FREE,
      },
      {
        name: 'Gemma 4',
        desc: "Le modèle open-weight de Google. Léger, rapide, idéal pour les tâches analytiques et les intégrations locales.",
        url: 'https://ai.google.dev/gemma',
        icon: iconBrand(BrandIcons.gemini, '#4285F4', 'rgba(66,133,244,0.1)'),
      },
    ],
  },

  // ── 2. Ouvrir tes comptes ─────────────────────────────────────────────────
  {
    id: 'comptes',
    n: 2,
    title: 'Ouvrir tes comptes',
    subtitle: "Ces outils seront au cœur de toutes tes apps. Ouvre les comptes maintenant — avant de coder la première ligne.",
    accent: '#22c55e',
    tools: [
      {
        name: 'Supabase',
        desc: "Le back-end pour ton app — base de données PostgreSQL, auth, stockage et edge functions. Tout en un.",
        url: 'https://supabase.com',
        icon: iconBrand(BrandIcons.supabase, '#3FCF8E', 'rgba(63,207,142,0.1)'),
        badge: BADGE_FREE,
      },
      {
        name: 'Vercel',
        desc: "Déploiement instantané. Connecte GitHub → ton app est live en 2 minutes.",
        url: 'https://vercel.com',
        icon: iconMono(BrandIcons.vercel),
        badge: BADGE_FREE,
      },
      {
        name: 'GitHub',
        desc: "Versioning du code. Sauvegarde tous tes projets. Connecté à Vercel pour le deploy automatique.",
        url: 'https://github.com',
        icon: iconMono(BrandIcons.github),
        badge: BADGE_FREE,
      },
      {
        name: 'Resend',
        desc: "Emails transactionnels — bienvenue, confirmation de paiement, relance. 3 000 emails/mois gratuits.",
        url: 'https://resend.com',
        icon: iconMono(BrandIcons.resend),
        badge: BADGE_FREE,
      },
      {
        name: 'Notion',
        desc: "Notes, briefs produits et documentation. Garde une trace de toutes tes idées et décisions clés.",
        url: 'https://notion.so',
        icon: iconMono(BrandIcons.notion),
        badge: BADGE_FREE,
      },
      {
        name: 'Obsidian',
        desc: "Tout le cerveau de ton projet et de ton SaaS. Stocke tes prompts, patterns, décisions et briefs dans une base de connaissance locale — 100% à toi.",
        url: 'https://obsidian.md',
        icon: iconImg('/obsidian.svg', 'rgba(124,58,237,0.1)'),
        badge: BADGE_FREE,
      },
      {
        name: 'Stripe',
        desc: "Paiements en ligne. Crée tes produits, configure tes prix et commence à encaisser dès le premier jour.",
        url: 'https://stripe.com',
        icon: iconBrand(BrandIcons.stripe, '#635BFF', 'rgba(99,91,255,0.1)'),
        badge: BADGE_FREE,
      },
      {
        name: 'Hostinger',
        desc: "Achète ton nom de domaine et configure tes zones DNS. La porte d'entrée de ton projet sur le web.",
        url: 'https://hostinger.fr',
        icon: iconBrand(BrandIcons.hostinger, '#673DE6', 'rgba(103,61,230,0.1)'),
      },
    ],
  },

  // ── 3. Configurer ton environnement ──────────────────────────────────────
  {
    id: 'env',
    n: 3,
    title: 'Configurer ton environnement',
    subtitle: "Ton espace de travail. L'éditeur de code + tes agents dans le terminal.",
    accent: '#60a5fa',
    tools: [
      {
        name: 'VS Code',
        desc: "L'éditeur pour ton code. Installe les extensions Claude Code et Wispr Flow — et pilote tout depuis ton terminal.",
        url: 'https://code.visualstudio.com',
        icon: iconBrand(BrandIcons.vscode, '#007ACC', 'rgba(0,122,204,0.1)'),
        badge: BADGE_FREE,
      },
      {
        name: 'Wispr Flow',
        desc: "Dicte tes prompts à la voix dans n'importe quelle app. Tu parles en langage naturel — Wispr traduit en texte instantanément.",
        url: 'https://wispr.dev',
        icon: iconImg('/Wispr-flow.png', 'rgba(245,158,11,0.08)'),
        badge: BADGE_FREE,
      },
      {
        name: 'Claude Code',
        desc: "Claude dans ton terminal. Modifie, déploie et debug ton code en langage naturel.",
        url: '#/dashboard/claude-os/apprendre/claude-code',
        internal: true,
        icon: iconImg('/Claude Code Logo.png'),
        badge: BADGE_FREE,
      },
      {
        name: 'Claude Cowork',
        desc: "L'agent desktop visuel. Automatise tes tâches et navigue sur le web à ta place.",
        url: '#/dashboard/claude-os/apprendre/claude-cowork',
        internal: true,
        icon: iconImg('/Claude Cowork Logo.jpg'),
        badge: BADGE_FREE,
      },
    ],
  },

  // ── 4. Trouver & Valider une idée ─────────────────────────────────────────
  {
    id: 'valider',
    n: 4,
    title: 'Trouver & Valider une idée',
    subtitle: "90% des MVPs échouent parce qu'ils résolvent un problème imaginaire. Ces outils te donnent de la vraie donnée marché.",
    accent: '#f87171',
    tools: [
      {
        name: 'Product Hunt',
        desc: "Vois ce qui cartonne aujourd'hui. Analyse les votes, commentaires et niches sous-exploitées.",
        url: 'https://producthunt.com',
        icon: iconBrand(BrandIcons.producthunt, '#DA552F', 'rgba(218,85,47,0.1)'),
        badge: BADGE_SEARCH,
      },
      {
        name: 'Indie Hackers',
        desc: "Les fondateurs partagent leurs MRR réels, leurs stratégies et leurs erreurs. Une mine d'or.",
        url: 'https://indiehackers.com',
        icon: iconBrand(BrandIcons.indiehackers, '#4169E1', 'rgba(65,105,225,0.1)'),
        badge: BADGE_SEARCH,
      },
      {
        name: 'Reddit',
        desc: "Valide là où les vrais problèmes sont exprimés. Cherche ta niche + \"pain\" ou \"looking for\".",
        url: 'https://reddit.com',
        icon: iconBrand(BrandIcons.reddit, '#FF4500', 'rgba(255,69,0,0.1)'),
        badge: BADGE_SEARCH,
      },
      {
        name: 'App Store',
        desc: "Analyse les reviews négatives des apps concurrentes. C'est là que se cachent les meilleures opportunités.",
        url: 'https://apps.apple.com',
        icon: iconBrand(BrandIcons.appstore, '#0D96F6', 'rgba(13,150,246,0.1)'),
        badge: BADGE_SEARCH,
      },
      {
        name: 'TrustMRR',
        desc: "Annuaire de SaaS avec leurs MRR vérifiés. Repère les niches rentables avant de te lancer.",
        url: 'https://trustmrr.com',
        icon: iconLucide(TrendingUp, '#22c55e', 'rgba(34,197,94,0.1)'),
        badge: BADGE_SEARCH,
      },
      {
        name: 'Flippa',
        desc: "Marketplace de SaaS à vendre. Achète un projet existant ou vends le tien une fois rentable.",
        url: 'https://flippa.com',
        icon: iconBrand(BrandIcons.flippa, '#FF6B35', 'rgba(255,107,53,0.1)'),
        badge: BADGE_SELL,
      },
      {
        name: 'Acquire.com',
        desc: "Revente de SaaS premium. Acheteurs plus sérieux et mieux capitalisés que Flippa.",
        url: 'https://acquire.com',
        icon: iconLucide(DollarSign, '#0EA5E9', 'rgba(14,165,233,0.1)'),
        badge: BADGE_SELL,
      },
    ],
  },

  // ── 5. Designer ton app ───────────────────────────────────────────────────
  {
    id: 'design',
    n: 5,
    title: 'Designer ton app',
    subtitle: "Composants, UI, inspiration flows et icônes — tu donnes forme à ton produit avant de coder.",
    accent: '#ec4899',
    tools: [
      {
        name: 'Mobbin',
        desc: "Bibliothèque de captures d'écrans d'apps réelles. Tous les éléments UI — onboarding, paywall, pricing, CTA — vus sur les meilleures apps du monde.",
        url: 'https://mobbin.com',
        icon: iconImg('/mobbin-logo.png', 'rgba(107,33,168,0.1)'),
      },
      {
        name: 'PagesFlow',
        desc: "User flows complets de SaaS et apps qui marchent. Vérifie la logique d'onboarding, les pages, les CTAs et les paywalls — avant d'écrire une ligne.",
        url: 'https://pagesflow.com',
        icon: iconLucide(Layout, '#3B82F6', 'rgba(59,130,246,0.1)'),
      },
      {
        name: 'Magic UI',
        desc: "Composants animés React + Tailwind. Pour des interfaces premium sans effort — copy, paste, done.",
        url: 'https://magicui.design',
        icon: iconLucide(Wand2, '#7C3AED', 'rgba(124,58,237,0.1)'),
      },
      {
        name: '21st.dev',
        desc: "Composants React prêts à l'emploi. Cherche \"pricing table\" ou \"hero\" et colle dans ton app.",
        url: 'https://21st.dev',
        icon: iconMono(BrandIcons.twentyOneDev),
      },
      {
        name: 'Shadcn/ui',
        desc: "Bibliothèque UI accessible et personnalisable. La base de tous les design systems modernes.",
        url: 'https://ui.shadcn.com',
        icon: iconMono(BrandIcons.shadcn),
      },
      {
        name: 'Lucide Icons',
        desc: "Bibliothèque d'icônes SVG fines et cohérentes. Disponibles directement dans React.",
        url: 'https://lucide.dev',
        icon: iconBrand(BrandIcons.lucideicons, '#F97316', 'rgba(249,115,22,0.1)'),
      },
      {
        name: 'Superwall',
        desc: "Paywalls optimisés pour maximiser les conversions. A/B teste tes offres et tarifs en temps réel.",
        url: 'https://superwall.com',
        icon: iconLucide(TrendingUp, '#10B981', 'rgba(16,185,129,0.1)'),
      },
      {
        name: 'Draftly',
        desc: "Composants 3D prêts pour React. Ajoute des éléments visuels 3D dans ton app sans Three.js.",
        url: 'https://www.draftly.space/',
        icon: iconImg('/draftly.png', 'rgba(139,92,246,0.1)'),
      },
    ],
  },

  // ── 6. Outils d'analyse ───────────────────────────────────────────────────
  {
    id: 'analyse',
    n: 6,
    title: "Outils d'analyse",
    subtitle: "Suis les comportements, comprends ce qui marche et optimise en continu.",
    accent: '#fb923c',
    tools: [
      {
        name: 'PostHog',
        desc: "Analytics produit open-source. Suis les parcours utilisateurs, les funnels et les conversions.",
        url: 'https://posthog.com',
        icon: iconBrand(BrandIcons.posthog, '#F54E00', 'rgba(245,78,0,0.1)'),
        badge: BADGE_FREE,
      },
      {
        name: 'Google Analytics 4',
        desc: "GA4 — analyse le trafic de ton site. Comprends d'où viennent tes visiteurs et ce qui convertit.",
        url: 'https://analytics.google.com',
        icon: iconBrand(BrandIcons.googleanalytics, '#E37400', 'rgba(227,116,0,0.1)'),
        badge: BADGE_FREE,
      },
    ],
  },
]

// ── Tool Card ─────────────────────────────────────────────────────────────────

function ToolCard({ tool, navigate }: { tool: Tool; navigate: (h: string) => void }) {
  const cls =
    'group flex items-start gap-3 border border-border rounded-xl p-4 hover:border-foreground/15 hover:bg-secondary/30 transition-all duration-150 text-left'

  const inner = (
    <>
      {tool.icon}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-0.5">
          <div className="flex items-center gap-1.5 flex-wrap min-w-0">
            <span className="text-[13px] font-bold text-foreground tracking-[-0.01em] leading-tight">
              {tool.name}
            </span>
            {tool.badge && (
              <span
                className="text-[9px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0"
                style={{ color: tool.badge.color, background: tool.badge.bg, border: `1px solid ${tool.badge.color}40` }}
              >
                {tool.badge.label}
              </span>
            )}
          </div>
          {tool.internal
            ? <ArrowRight size={11} strokeWidth={1.5} className="text-muted-foreground/30 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity mt-0.5" />
            : <ExternalLink size={11} strokeWidth={1.5} className="text-muted-foreground/30 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity mt-0.5" />
          }
        </div>
        <p className="text-[11px] text-muted-foreground leading-relaxed">{tool.desc}</p>
      </div>
    </>
  )

  if (tool.internal) {
    return (
      <button onClick={() => navigate(tool.url)} className={`${cls} w-full`}>
        {inner}
      </button>
    )
  }

  return (
    <a href={tool.url} target="_blank" rel="noopener noreferrer" className={cls}>
      {inner}
    </a>
  )
}

// ── Section ───────────────────────────────────────────────────────────────────

function SectionBlock({ section, navigate }: { section: Section; navigate: (h: string) => void }) {
  return (
    <div className="mb-12">
      <div className="flex items-start gap-3 mb-5">
        <div className="w-[26px] h-[26px] rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0 mt-0.5 tabular-nums bg-secondary border border-border text-foreground">
          {section.n}
        </div>
        <div>
          <h2
            className="text-foreground"
            style={{ fontSize: 15, fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.2 }}
          >
            {section.title}
          </h2>
          <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed max-w-[480px]">
            {section.subtitle}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {section.tools.map(tool => (
          <ToolCard key={`${section.id}-${tool.name}`} tool={tool} navigate={navigate} />
        ))}
      </div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

interface Props {
  navigate: (hash: string) => void
}

export function ToolsPage({ navigate }: Props) {
  return (
    <div className="px-8 py-10 max-w-4xl mx-auto w-full">
      {/* Header */}
      <div className="mb-8">
        <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground mb-2">
          Boîte à outils
        </p>
        <h1
          className="text-foreground mb-2"
          style={{ fontSize: 'clamp(26px, 3vw, 38px)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.1 }}
        >
          Les outils qu'on utilise tous les jours
        </h1>
        <p className="text-[13px] text-muted-foreground leading-relaxed">
          33 outils · 6 catégories — dans l'ordre où tu en auras besoin.
        </p>
      </div>

      {/* Outil de la semaine */}
      <div className="mb-10 border border-border rounded-2xl overflow-hidden">
        <div className="flex flex-col sm:flex-row">
          <div className="flex-1 p-6 flex flex-col justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[9px] font-black uppercase tracking-[0.12em] px-2.5 py-1 rounded-full bg-foreground text-background">
                  Outil de la semaine
                </span>
              </div>
              <h2
                className="text-foreground mb-2"
                style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.2 }}
              >
                Draftly
              </h2>
              <p className="text-[12px] text-muted-foreground leading-relaxed">
                Composants 3D web-ready pour React. Donne un aspect futuriste à n'importe quelle app en quelques lignes — sans Three.js ni shaders. Des dizaines d'éléments visuels 3D prêts à coller dans ton interface.
              </p>
            </div>
            <a
              href="https://www.draftly.space/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[12px] font-semibold px-4 py-2 rounded-lg self-start border border-border hover:bg-secondary transition-colors text-foreground"
            >
              Découvrir Draftly
              <ExternalLink size={12} strokeWidth={1.5} />
            </a>
          </div>
          <div
            className="sm:w-[260px] lg:w-[300px] flex-shrink-0 overflow-hidden flex items-center justify-center bg-secondary/40"
            style={{ minHeight: 200 }}
          >
            <img
              src="/draftly-preview.png"
              alt="Draftly — composants 3D"
              className="w-full h-full object-cover"
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
            />
          </div>
        </div>
      </div>

      {SECTIONS.map(section => (
        <SectionBlock key={section.id} section={section} navigate={navigate} />
      ))}
    </div>
  )
}
