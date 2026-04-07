import {
  ExternalLink, Terminal, Mic, Wand2,
  Layout, TrendingUp, DollarSign, Search, ArrowRight, ChevronRight,
} from 'lucide-react'
import type { SVGProps } from 'react'
import { BrandIcons } from '../ui/icons'

// ── Types ─────────────────────────────────────────────────────────────────────

interface Tool {
  name: string
  desc: string
  url: string
  icon: (className: string) => React.ReactNode
  internal?: boolean
}

interface JourneyStep {
  id: string
  number: number
  title: string
  description: string
  color: string
  colorBg: string
  tools: Tool[]
}

// ── Icon helpers ──────────────────────────────────────────────────────────────

const brand = (
  Icon: (props: SVGProps<SVGSVGElement>) => React.ReactElement,
) => (cls: string) => <Icon className={cls} />

const lucide = (
  Icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>,
) => (cls: string) => <Icon size={18} strokeWidth={1.5} className={cls} />

// ── Journey data ──────────────────────────────────────────────────────────────

const JOURNEY: JourneyStep[] = [
  {
    id: 'ia',
    number: 1,
    title: "Parler à l'IA",
    description: "Avant tout, tu configures tes copilotes. Ce sont tes associés au quotidien — pour réfléchir, rédiger, analyser, décider.",
    color: '#a78bfa',
    colorBg: 'rgba(139,92,246,0.12)',
    tools: [
      { name: 'Claude', desc: "L'IA principale du Blueprint. Code, architecture, debug, rédaction — ton partenaire de pensée numéro 1.", url: 'https://claude.ai', icon: brand(BrandIcons.claude) },
      { name: 'Jarvis', desc: "Ton copilote Buildrs intégré au dashboard. Il connaît le Blueprint, le curriculum et ton avancement.", url: '#/dashboard/autopilot', icon: lucide(Terminal), internal: true },
      { name: 'Wispr Flow', desc: "Parle au lieu de taper. Dicte tes prompts à la voix dans n'importe quelle app. Gain de temps massif.", url: 'https://whispr.dev', icon: lucide(Mic) },
      { name: 'Perplexity', desc: 'Moteur de recherche IA avec sources citées — idéal pour valider des niches et analyser la concurrence.', url: 'https://perplexity.ai', icon: brand(BrandIcons.perplexity) },
      { name: 'NotebookLM', desc: "Analyse tes documents avec l'IA Google. Charge tes PDFs, notes et briefs — puis interroge-les.", url: 'https://notebooklm.google.com', icon: brand(BrandIcons.notebooklm) },
    ],
  },
  {
    id: 'env',
    number: 2,
    title: 'Configurer ton environnement',
    description: "Tu mets en place ton espace de travail. L'éditeur de code, l'agent IA dans le terminal, et le bureau IA pour automatiser.",
    color: '#4ade80',
    colorBg: 'rgba(74,222,128,0.12)',
    tools: [
      { name: 'VS Code', desc: "L'éditeur de code de référence. Installe l'extension Claude pour l'assistance en live.", url: 'https://code.visualstudio.com', icon: brand(BrandIcons.vscode) },
      { name: 'Claude Code', desc: 'Claude directement dans ton terminal. Modifie, refactorise et répare ton code en une commande naturelle.', url: '#/dashboard/claude-os/claude-code', icon: lucide(Terminal), internal: true },
      { name: 'Claude Cowork', desc: "L'agent desktop visuel. Automatise tes tâches répétitives, planifie et navigue sur le web à ta place.", url: '#/dashboard/claude-os/claude-cowork', icon: lucide(Terminal), internal: true },
    ],
  },
  {
    id: 'infra',
    number: 3,
    title: 'Installer tes bases',
    description: "Tu mets en place l'infrastructure : base de données, versioning — les fondations solides avant de construire.",
    color: '#22d3ee',
    colorBg: 'rgba(34,211,238,0.12)',
    tools: [
      { name: 'Supabase', desc: 'Base de données PostgreSQL + auth + stockage + edge functions. Le backend clé en main de ton app.', url: 'https://supabase.com', icon: brand(BrandIcons.supabase) },
      { name: 'GitHub', desc: 'Versioning de ton code. Sauvegarde chaque version et connecte à Vercel pour le déploiement automatique.', url: 'https://github.com', icon: brand(BrandIcons.github) },
    ],
  },
  {
    id: 'orga',
    number: 4,
    title: 'Organiser ton projet',
    description: "Tu structures tes idées, notes et briefs. Tout documenter = aller deux fois plus vite avec l'IA.",
    color: '#fbbf24',
    colorBg: 'rgba(251,191,36,0.12)',
    tools: [
      { name: 'Notion', desc: 'Organisation, notes et documentation. Garde une trace de tes idées, briefs produits et décisions clés.', url: 'https://notion.so', icon: brand(BrandIcons.notion) },
      { name: 'Obsidian', desc: 'Knowledge base locale. Structure ta base de connaissances — prompts, patterns, briefs — liée à ta façon de penser.', url: 'https://obsidian.md', icon: lucide(Search) },
    ],
  },
  {
    id: 'valider',
    number: 5,
    title: 'Trouver et valider ton idée',
    description: "Tu étudies le marché avant de construire. 90% des MVP échouent parce qu'ils résolvent un problème imaginaire.",
    color: '#f87171',
    colorBg: 'rgba(239,68,68,0.12)',
    tools: [
      { name: 'Product Hunt', desc: 'Découvre les SaaS qui cartonnent. Analyse les votes, les commentaires et les niches sous-exploitées.', url: 'https://producthunt.com', icon: brand(BrandIcons.producthunt) },
      { name: 'Indie Hackers', desc: 'Communauté de solopreneurs. Les fondateurs partagent leurs MRR, leurs stratégies et leurs erreurs.', url: 'https://indiehackers.com', icon: brand(BrandIcons.indiehackers) },
      { name: 'Reddit', desc: 'Valide tes idées là où les vrais problèmes sont exprimés. Cherche ta niche + "pain" ou "looking for".', url: 'https://reddit.com', icon: brand(BrandIcons.reddit) },
      { name: 'App Store', desc: "Analyse les reviews négatives des apps concurrentes. C'est là que se cachent les meilleures opportunités.", url: 'https://apps.apple.com', icon: brand(BrandIcons.appstore) },
      { name: 'Mobbin', desc: "Bibliothèque de captures d'écrans d'apps réelles. Cherche une feature, analyse comment les concurrents l'ont faite.", url: 'https://mobbin.com', icon: brand(BrandIcons.mobbin) },
      { name: 'TrustMRR', desc: 'Annuaire de SaaS avec leurs MRR vérifiés. Trouve les niches rentables avant de te lancer.', url: 'https://trustmrr.com', icon: lucide(TrendingUp) },
    ],
  },
  {
    id: 'design',
    number: 6,
    title: 'Designer ton app',
    description: "Tu donnes forme à ton produit. Composants, UI, icônes, inspiration — tu construis le visuel avant de coder.",
    color: '#ec4899',
    colorBg: 'rgba(236,72,153,0.12)',
    tools: [
      { name: 'Magic UI', desc: 'Composants animés React + Tailwind. Pour des interfaces premium sans effort — copy, paste, done.', url: 'https://magicui.design', icon: lucide(Wand2) },
      { name: '21st.dev', desc: "Composants React prêts à l'emploi. Cherche \"pricing table\" ou \"hero\" et colle dans ton app.", url: 'https://21st.dev', icon: brand(BrandIcons.twentyOneDev) },
      { name: 'Shadcn/ui', desc: 'Bibliothèque UI accessible et personnalisable. La base de tous les design systems modernes.', url: 'https://ui.shadcn.com', icon: brand(BrandIcons.shadcn) },
      { name: 'Lucide Icons', desc: "Bibliothèque d'icônes SVG fines et cohérentes. Disponibles directement dans React.", url: 'https://lucide.dev', icon: brand(BrandIcons.lucideicons) },
      { name: 'Stitch', desc: 'Assemble des interfaces en combinant des blocs visuels. Idéal pour maquetter rapidement.', url: 'https://stitch.withgoogle.com', icon: brand(BrandIcons.stitch) },
      { name: 'PagesFlow', desc: "Inspiration UI pour les flows utilisateurs. Vois comment les meilleures apps structurent leurs écrans.", url: 'https://pagesflow.com', icon: lucide(Layout) },
      { name: 'Dribbble', desc: "Inspiration design des meilleurs créateurs du monde. Pour trouver ton style visuel avant de coder.", url: 'https://dribbble.com', icon: brand(BrandIcons.dribbble) },
      { name: 'Superwall', desc: 'Paywalls optimisés pour maximiser les conversions. A/B teste tes offres et tarifs en temps réel.', url: 'https://superwall.com', icon: lucide(TrendingUp) },
    ],
  },
  {
    id: 'build',
    number: 7,
    title: 'Construire ton produit',
    description: "Tu codes. Claude code, toi tu diriges. Tu assembles les briques, tu branches les paiements, tu pousses sur GitHub.",
    color: '#60a5fa',
    colorBg: 'rgba(96,165,250,0.12)',
    tools: [
      { name: 'Claude Code', desc: "Claude dans ton terminal pour construire feature par feature. Tu décris — il code, corrige et explique.", url: '#/dashboard/claude-os/claude-code', icon: lucide(Terminal), internal: true },
      { name: 'Stripe', desc: 'Paiements en ligne, abonnements, checkout. Le standard mondial, intégrable en moins de 30 minutes.', url: 'https://stripe.com', icon: brand(BrandIcons.stripe) },
      { name: 'Hostinger', desc: 'Hébergement web alternatif. Idéal pour les sites vitrine ou si tu cherches un hébergeur simple et pas cher.', url: 'https://hostinger.fr', icon: brand(BrandIcons.hostinger) },
      { name: 'GitHub', desc: 'Versionne ton code à chaque étape. Connecté à Vercel pour le déploiement automatique à chaque push.', url: 'https://github.com', icon: brand(BrandIcons.github) },
    ],
  },
  {
    id: 'deploy',
    number: 8,
    title: 'Communiquer avec tes users',
    description: "Ton app est live. Tu suis les comportements, tu envoies les bons emails, tu comprends ce qui marche.",
    color: '#fb923c',
    colorBg: 'rgba(251,146,60,0.12)',
    tools: [
      { name: 'PostHog', desc: 'Analytics produit open-source. Suis les parcours utilisateurs, les funnels et les conversions.', url: 'https://posthog.com', icon: brand(BrandIcons.posthog) },
      { name: 'Google Analytics', desc: "Analyse le trafic de ton site. Comprends d'où viennent tes visiteurs et quelles pages convertissent.", url: 'https://analytics.google.com', icon: brand(BrandIcons.googleanalytics) },
      { name: 'Resend', desc: 'Emails transactionnels (bienvenue, confirmation, relance). Simple, rapide, excellent taux de délivrabilité.', url: 'https://resend.com', icon: brand(BrandIcons.resend) },
    ],
  },
  {
    id: 'revendre',
    number: 9,
    title: 'Revendre ton app',
    description: "Ton app tourne. Tu veux passer à autre chose ou encaisser une plus-value ? Ces plateformes te mettent en contact avec des acheteurs sérieux.",
    color: '#a3e635',
    colorBg: 'rgba(163,230,53,0.12)',
    tools: [
      { name: 'Flippa', desc: 'Marketplace de revente de SaaS. Vends ton app quand elle tourne ou achète des projets existants à scaler.', url: 'https://flippa.com', icon: brand(BrandIcons.flippa) },
      { name: 'Acquire.com', desc: 'Revente de SaaS premium. Meilleure qualité que Flippa, acheteurs plus sérieux et mieux capitalisés.', url: 'https://acquire.com', icon: lucide(DollarSign) },
    ],
  },
]

// ── Tool card ─────────────────────────────────────────────────────────────────

function ToolCard({ tool, navigate }: { tool: Tool; navigate: (hash: string) => void }) {
  const inner = (
    <>
      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-secondary group-hover:bg-background transition-colors border border-border">
        {tool.icon('w-[18px] h-[18px] text-foreground')}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5">
          <span className="text-sm font-bold text-foreground">{tool.name}</span>
          {tool.internal
            ? <ArrowRight size={11} strokeWidth={1.5} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            : <ExternalLink size={11} strokeWidth={1.5} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          }
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">{tool.desc}</p>
      </div>
    </>
  )

  if (tool.internal) {
    return (
      <button
        onClick={() => navigate(tool.url)}
        className="group flex items-start gap-4 border border-border rounded-xl px-5 py-4 hover:border-foreground/20 hover:bg-secondary/30 transition-all duration-150 w-full text-left"
      >
        {inner}
      </button>
    )
  }

  return (
    <a
      href={tool.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-start gap-4 border border-border rounded-xl px-5 py-4 hover:border-foreground/20 hover:bg-secondary/30 transition-all duration-150"
    >
      {inner}
    </a>
  )
}

// ── Journey step ──────────────────────────────────────────────────────────────

function JourneyStep({
  step, isLast, navigate,
}: {
  step: JourneyStep
  isLast: boolean
  navigate: (hash: string) => void
}) {
  return (
    <div id={`step-${step.id}`} className="flex gap-5">
      {/* Left: number + connector */}
      <div className="flex flex-col items-center flex-shrink-0" style={{ width: 32 }}>
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-bold flex-shrink-0 z-10"
          style={{ background: step.colorBg, color: step.color, border: `1.5px solid ${step.color}50` }}
        >
          {step.number}
        </div>
        {!isLast && (
          <div
            className="flex-1 w-px mt-2"
            style={{ background: `linear-gradient(to bottom, ${step.color}30, transparent)`, minHeight: 24 }}
          />
        )}
      </div>

      {/* Right: content */}
      <div className="flex-1 pb-10 min-w-0">
        <h3 className="text-[16px] font-extrabold text-foreground mb-0.5" style={{ letterSpacing: '-0.02em' }}>
          {step.title}
        </h3>
        <p className="text-xs text-muted-foreground leading-relaxed mb-4">
          {step.description}
        </p>
        <div className="flex flex-col gap-2">
          {step.tools.map(tool => (
            <ToolCard key={`${step.id}-${tool.name}`} tool={tool} navigate={navigate} />
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Sidebar: compact index of all tools ──────────────────────────────────────

function ToolsSidebar({ navigate }: { navigate: (hash: string) => void }) {
  const scrollTo = (id: string) => {
    const el = document.getElementById(`step-${id}`)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="sticky top-4 flex flex-col gap-0.5 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 48px)' }}>
      <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground px-2 pb-2">
        Index — {JOURNEY.reduce((a, s) => a + s.tools.length, 0)} outils
      </p>

      {JOURNEY.map(step => (
        <div key={step.id} className="mb-1">
          {/* Step label — clickable */}
          <button
            onClick={() => scrollTo(step.id)}
            className="group flex items-center gap-1.5 w-full px-2 py-1 rounded-md hover:bg-secondary/60 transition-colors text-left"
          >
            <div
              className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold flex-shrink-0"
              style={{ background: step.colorBg, color: step.color }}
            >
              {step.number}
            </div>
            <span className="text-[11px] font-semibold text-foreground/70 group-hover:text-foreground transition-colors leading-tight truncate">
              {step.title}
            </span>
            <ChevronRight size={9} strokeWidth={2} className="text-muted-foreground/40 ml-auto opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
          </button>

          {/* Tools list */}
          <div className="pl-7 flex flex-col gap-px mt-0.5">
            {step.tools.map(tool => (
              tool.internal ? (
                <button
                  key={tool.name}
                  onClick={() => navigate(tool.url)}
                  className="group flex items-center gap-1.5 py-0.5 rounded hover:bg-secondary/40 transition-colors px-1 text-left"
                >
                  <div className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0 bg-secondary border border-border/50">
                    {tool.icon('w-2.5 h-2.5 text-foreground/60')}
                  </div>
                  <span className="text-[11px] text-muted-foreground group-hover:text-foreground transition-colors truncate">
                    {tool.name}
                  </span>
                </button>
              ) : (
                <a
                  key={tool.name}
                  href={tool.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-1.5 py-0.5 rounded hover:bg-secondary/40 transition-colors px-1"
                >
                  <div className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0 bg-secondary border border-border/50">
                    {tool.icon('w-2.5 h-2.5 text-foreground/60')}
                  </div>
                  <span className="text-[11px] text-muted-foreground group-hover:text-foreground transition-colors truncate">
                    {tool.name}
                  </span>
                </a>
              )
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

interface Props {
  navigate: (hash: string) => void
}

export function ToolsPage({ navigate }: Props) {
  return (
    <div className="p-7 flex gap-8 max-w-full">

      {/* ── Main journey — left ── */}
      <div className="flex-1 min-w-0">
        {/* Header */}
        <div className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">Boîte à outils</p>
          <h1 className="text-3xl font-extrabold text-foreground" style={{ letterSpacing: '-0.03em' }}>
            De 0 au live — quel outil à quel moment
          </h1>
          <p className="text-sm text-muted-foreground mt-1.5">
            {JOURNEY.reduce((a, s) => a + s.tools.length, 0)} outils · 9 étapes · Le chemin complet du vibe coder.
          </p>
        </div>

        {/* Journey */}
        <div>
          {JOURNEY.map((step, i) => (
            <JourneyStep
              key={step.id}
              step={step}
              isLast={i === JOURNEY.length - 1}
              navigate={navigate}
            />
          ))}
        </div>
      </div>

      {/* ── Sidebar — right, sticky ── */}
      <div className="hidden lg:block w-52 flex-shrink-0">
        <ToolsSidebar navigate={navigate} />
      </div>
    </div>
  )
}
