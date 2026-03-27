import { useState } from 'react'
import {
  Layers, Search, Palette, Building2, Hammer, Rocket, DollarSign,
  ShieldCheck, TrendingUp, Check, Copy, Zap, ChevronRight,
  BookOpen, CheckSquare, Wrench, ExternalLink,
} from 'lucide-react'
import { BuildrsIcon, BrandIcons } from './icons'

// ── Types ─────────────────────────────────────────────────────────────────────

type Tab = 'autopilot' | 'parcours' | 'generator' | 'bibliotheque' | 'checklist' | 'outils'

const TABS: { id: Tab; label: string; short: string }[] = [
  { id: 'autopilot',    label: 'Autopilot IA',   short: 'Autopilot'  },
  { id: 'parcours',     label: 'Mon Parcours',    short: 'Parcours'   },
  { id: 'generator',    label: 'Générateurs IA',  short: 'Génér.'     },
  { id: 'bibliotheque', label: 'Bibliothèque',    short: 'Biblio'     },
  { id: 'checklist',    label: 'Checklist',       short: 'Check'      },
  { id: 'outils',       label: 'Boîte à outils',  short: 'Outils'     },
]

// ── Mini sidebar ──────────────────────────────────────────────────────────────

function MiniSidebar({ tab }: { tab: Tab }) {
  const active = (id: Tab) => tab === id
  return (
    <div className="w-[165px] flex-shrink-0 border-r border-border flex flex-col overflow-hidden bg-background">
      <div className="flex items-center gap-2 px-3.5 h-[38px] border-b border-border flex-shrink-0">
        <BuildrsIcon color="currentColor" size={13} className="text-foreground" />
        <span className="font-extrabold text-[11px] text-foreground" style={{ letterSpacing: '-0.04em' }}>Buildrs</span>
      </div>

      <div className="px-2.5 pt-2 pb-1 border-b border-border">
        <div className="flex justify-between items-center mb-1">
          <span className="text-[7px] font-bold uppercase tracking-widest text-muted-foreground">Progression</span>
          <span className="text-[8px] font-extrabold text-foreground">42%</span>
        </div>
        <div className="h-[2px] rounded-full overflow-hidden bg-border">
          <div className="h-full rounded-full bg-foreground" style={{ width: '42%' }} />
        </div>
      </div>

      {/* CONSTRUIRE */}
      <div className="px-2 pt-2.5">
        <p className="text-[7px] font-bold uppercase tracking-[0.08em] text-muted-foreground/50 px-1 mb-1">Construire</p>
        {([
          { id: 'autopilot' as Tab, icon: Zap,      label: 'Autopilot IA',  badge: 'ACTIF' },
          { id: 'parcours'  as Tab, icon: BookOpen,  label: 'Mon Parcours',  badge: null    },
        ]).map(({ id, icon: Icon, label, badge }) => (
          <div key={id} className={`flex items-center gap-1.5 px-2 py-1.5 rounded-md mb-0.5 ${active(id) ? 'bg-foreground text-background' : 'text-muted-foreground'}`}>
            <Icon size={9} strokeWidth={1.5} className="flex-shrink-0" />
            <span className="text-[8px] font-medium flex-1 truncate">{label}</span>
            {badge && (
              <span className="text-[6px] font-bold px-1 py-0.5 rounded flex-shrink-0" style={{ background: 'rgba(34,197,94,0.15)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.3)' }}>
                {badge}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* OUTILS IA */}
      <div className="px-2 pt-2">
        <p className="text-[7px] font-bold uppercase tracking-[0.08em] text-muted-foreground/50 px-1 mb-1">Outils IA</p>
        {([
          { id: 'generator'    as Tab, Icon: ShieldCheck, label: "Validateur d'idée" },
          { id: null,                  Icon: TrendingUp,  label: 'Calc. MRR'         },
        ] as const).map(({ id, Icon, label }, i) => (
          <div key={i} className={`flex items-center gap-1.5 px-2 py-1.5 rounded-md mb-0.5 ${id && active(id) ? 'bg-foreground text-background' : 'text-muted-foreground'}`}>
            <Icon size={9} strokeWidth={1.5} className="flex-shrink-0" />
            <span className="text-[8px] font-medium truncate">{label}</span>
          </div>
        ))}
      </div>

      {/* RESSOURCES */}
      <div className="px-2 pt-2">
        <p className="text-[7px] font-bold uppercase tracking-[0.08em] text-muted-foreground/50 px-1 mb-1">Ressources</p>
        {([
          { id: 'bibliotheque' as Tab, Icon: BookOpen,    label: 'Bibliothèque'    },
          { id: 'checklist'    as Tab, Icon: CheckSquare, label: 'Checklist'       },
          { id: 'outils'       as Tab, Icon: Wrench,      label: 'Boîte à outils'  },
        ] as const).map(({ id, Icon, label }) => (
          <div key={id} className={`flex items-center gap-1.5 px-2 py-1.5 rounded-md mb-0.5 ${active(id) ? 'bg-foreground text-background' : 'text-muted-foreground'}`}>
            <Icon size={9} strokeWidth={1.5} className="flex-shrink-0" />
            <span className="text-[8px] font-medium truncate">{label}</span>
          </div>
        ))}
      </div>

      <div className="mt-auto p-2.5">
        <div className="rounded-lg bg-foreground p-2">
          <p className="text-[6px] font-bold uppercase tracking-widest mb-0.5" style={{ color: 'rgba(250,250,250,0.45)' }}>Envie d'aller + vite ?</p>
          <p className="text-[8px] font-semibold text-background">Rejoindre la Cohorte →</p>
        </div>
      </div>
    </div>
  )
}

// ── Content: Autopilot ────────────────────────────────────────────────────────

const TIMELINE_STEPS = [
  { n: 1, label: 'Idée validée',               done: true,  current: false },
  { n: 2, label: 'Architecture définie',        done: true,  current: false },
  { n: 3, label: 'Design & branding validés',   done: false, current: true  },
  { n: 4, label: 'Build en cours',              done: false, current: false },
  { n: 5, label: 'Déploiement & Monétisation',  done: false, current: false },
]

const STACK_ITEMS = [
  { Icon: BrandIcons.claude,   label: 'Claude',   active: true  },
  { Icon: BrandIcons.supabase, label: 'Supabase', active: true  },
  { Icon: BrandIcons.vercel,   label: 'Vercel',   active: true  },
  { Icon: BrandIcons.stripe,   label: 'Stripe',   active: true  },
  { Icon: BrandIcons.resend,   label: 'Resend',   active: false },
  { Icon: BrandIcons.github,   label: 'GitHub',   active: true  },
]

function AutopilotContent() {
  return (
    <div className="flex-1 flex overflow-hidden">
      <div className="flex-1 p-4 flex flex-col gap-3 overflow-hidden">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-foreground flex-shrink-0" style={{ animation: 'autopilot-pulse 2s ease-in-out infinite' }} />
          <span className="text-[7.5px] font-bold uppercase tracking-[0.1em] text-foreground">CLAUDE ACTIF</span>
          <span className="ml-auto text-[13px] font-extrabold text-foreground" style={{ letterSpacing: '-0.03em' }}>FactureAI</span>
        </div>

        <div className="border border-border rounded-lg p-3 bg-secondary/50">
          <p className="text-[7px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Brief produit</p>
          <p className="text-[10px] font-semibold text-foreground mb-0.5">FactureAI</p>
          <p className="text-[8.5px] text-muted-foreground leading-relaxed">Créer et envoyer des factures pro en 30s grâce à l'IA</p>
        </div>

        <div className="flex flex-col gap-1.5 flex-1">
          {TIMELINE_STEPS.map(({ n, label, done, current }) => (
            <div key={n} className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg ${current ? 'bg-foreground' : 'border border-border'}`}>
              <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${done ? 'bg-foreground text-background' : current ? 'bg-background text-foreground' : 'border border-border text-muted-foreground'}`}>
                {done ? <Check size={7} strokeWidth={3} className="text-background" /> : <span className="text-[7px] font-bold">{n}</span>}
              </div>
              <span className={`text-[8.5px] font-medium flex-1 ${current ? 'text-background' : done ? 'text-muted-foreground line-through' : 'text-foreground'}`}>{label}</span>
              {current && <span className="text-[6.5px] font-bold text-background/60 tracking-wider">EN COURS</span>}
            </div>
          ))}
        </div>
      </div>

      <div className="w-[120px] flex-shrink-0 border-l border-border p-3 flex flex-col gap-3">
        <div>
          <p className="text-[7px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">Score viabilité</p>
          <div className="text-center border border-border rounded-lg py-2">
            <span className="text-2xl font-extrabold text-foreground" style={{ letterSpacing: '-0.04em', lineHeight: 1 }}>74</span>
            <span className="text-[9px] text-muted-foreground">/100</span>
          </div>
        </div>

        <div>
          <p className="text-[7px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">Stack</p>
          <div className="flex flex-wrap gap-1">
            {STACK_ITEMS.map(({ Icon, label, active }) => (
              <div key={label} className={`flex items-center gap-0.5 px-1 py-0.5 rounded text-[7px] ${active ? 'bg-foreground text-background' : 'border border-border text-muted-foreground'}`}>
                <Icon className="w-2.5 h-2.5" />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="text-[7px] font-bold uppercase tracking-wider text-muted-foreground mb-1">MRR cible</p>
          <p className="text-[18px] font-extrabold text-foreground" style={{ letterSpacing: '-0.04em', lineHeight: 1 }}>1 000€</p>
          <p className="text-[7px] text-muted-foreground mt-0.5">~83 clients à 12€/mois</p>
        </div>
      </div>
    </div>
  )
}

// ── Content: Parcours ─────────────────────────────────────────────────────────

const MODULES_TREE = [
  {
    id: '00', label: 'Fondations', Icon: Layers, pct: 100, done: 7, total: 7,
    lessons: ['Le vibecoding, c\'est quoi ?', 'Devenir product builder', 'Les 3 stratégies', 'Les modèles de monétisation', 'Glossaire'],
  },
  {
    id: '01', label: 'Trouver & Valider', Icon: Search, pct: 50, done: 2, total: 4,
    lessons: ['Trouver ton idée', 'Générer 5 idées avec l\'IA', 'Valider en 30 min', 'Le brief produit'],
  },
  {
    id: '02', label: 'Préparer & Designer', Icon: Palette, pct: 0, done: 0, total: 4,
    lessons: ['Configurer l\'environnement', 'S\'inspirer et designer', 'Le branding express', 'Le user flow'],
  },
  {
    id: '03', label: 'L\'Architecture', Icon: Building2, pct: 0, done: 0, total: 4,
    lessons: ['Planifier avant de coder', 'La base de données', 'L\'authentification', 'La sécurité'],
  },
  {
    id: '04', label: 'Construire', Icon: Hammer, pct: 0, done: 0, total: 6,
    lessons: [],
  },
  {
    id: '05', label: 'Déployer', Icon: Rocket, pct: 0, done: 0, total: 5,
    lessons: [],
  },
  {
    id: '06', label: 'Monétiser & Lancer', Icon: DollarSign, pct: 0, done: 0, total: 7,
    lessons: [],
  },
]

function ParcoursContent() {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="px-4 pt-3 pb-2.5 border-b border-border flex-shrink-0">
        <div className="flex items-center justify-between mb-1.5">
          <p className="text-[8px] font-bold uppercase tracking-[0.1em] text-muted-foreground">Mon Parcours — Module 02</p>
          <span className="text-[8px] font-extrabold text-foreground">42%</span>
        </div>
        <div className="h-1 rounded-full overflow-hidden bg-border">
          <div className="h-full bg-foreground rounded-full" style={{ width: '42%' }} />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Fake video thumbnail */}
        <div className="relative mx-3 mt-3 rounded-xl overflow-hidden flex-shrink-0" style={{ height: 100, background: '#09090b' }}>
          {/* Blurred silhouette */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-16 rounded-full opacity-20" style={{ background: '#fff', filter: 'blur(8px)', transform: 'translateY(4px)' }} />
            <div className="absolute bottom-0 w-24 h-8 opacity-15" style={{ background: '#fff', filter: 'blur(10px)' }} />
          </div>
          {/* Subtle scan lines */}
          <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.3) 3px, rgba(255,255,255,0.3) 4px)' }} />
          {/* Play button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.25)' }}>
              <div className="w-0 h-0" style={{ borderTop: '4px solid transparent', borderBottom: '4px solid transparent', borderLeft: '7px solid rgba(255,255,255,0.9)', marginLeft: 2 }} />
            </div>
          </div>
          {/* Label */}
          <div className="absolute bottom-0 left-0 right-0 px-3 py-1.5" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)' }}>
            <p className="text-[7px] font-semibold text-white/80">Leçon 2.2 — Design & Architecture avec Claude</p>
          </div>
          {/* Progress bar */}
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/10">
            <div className="h-full bg-white/60" style={{ width: '35%' }} />
          </div>
        </div>

        {/* Module list */}
        <div className="p-3 flex flex-col gap-1">
          <p className="text-[7px] font-bold uppercase tracking-[0.08em] text-muted-foreground/60 mb-1">Tous les modules</p>
          {MODULES_TREE.map(({ id, label, Icon, pct, done, total }) => (
            <div key={id} className={`flex items-center gap-2 px-2 py-1.5 rounded-lg ${id === '02' ? 'bg-foreground text-background' : ''}`}>
              <div className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 ${id === '02' ? 'bg-background/15' : pct === 100 ? 'bg-foreground' : 'bg-secondary'}`}>
                {pct === 100
                  ? <Check size={8} strokeWidth={2.5} className="text-background" />
                  : <Icon size={8} strokeWidth={1.5} className={id === '02' ? 'text-background' : 'text-muted-foreground'} />
                }
              </div>
              <span className={`text-[8px] font-medium flex-1 truncate ${id === '02' ? 'text-background' : pct === 100 ? 'text-muted-foreground' : 'text-foreground'}`}>{label}</span>
              <span className={`text-[7px] tabular-nums flex-shrink-0 ${id === '02' ? 'text-background/60' : 'text-muted-foreground'}`}>{done}/{total}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Content: Générateurs ──────────────────────────────────────────────────────

const IDEA_RESULTS = [
  { name: 'ReviewGen',  niche: 'Avis Google auto',      price: '47€/mois', days: '4j', color: '#4d96ff' },
  { name: 'FacturAI',  niche: 'Facturation intelligente', price: '29€/mois', days: '5j', color: '#22c55e' },
  { name: 'LegalSnap', niche: 'CGV & contrats IA',      price: '59€/mois', days: '6j', color: '#cc5de8' },
]

function GeneratorContent() {
  const [generated, setGenerated] = useState(false)

  return (
    <div className="flex-1 flex flex-col overflow-hidden p-4">
      <div className="mb-3 flex-shrink-0">
        <p className="text-[7.5px] font-bold uppercase tracking-[0.1em] text-muted-foreground mb-0.5">Générateur IA</p>
        <p className="text-[14px] font-extrabold text-foreground" style={{ letterSpacing: '-0.03em' }}>5 idées de SaaS sur mesure</p>
        <p className="text-[8.5px] text-muted-foreground mt-0.5">Configure et génère tes idées en 10 secondes.</p>
      </div>

      {!generated ? (
        <div className="flex flex-col gap-2 flex-1">
          {/* Fields */}
          {[
            { label: 'Domaine', value: 'B2B / PME et freelances' },
            { label: 'Budget client', value: '20–100€ / mois' },
            { label: 'Profil', value: 'Débutant complet' },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="text-[7px] font-bold uppercase tracking-[0.08em] text-muted-foreground mb-1">{label}</p>
              <div className="rounded-lg border border-border px-2.5 py-1.5 flex items-center justify-between bg-secondary/50">
                <span className="text-[8.5px] text-foreground">{value}</span>
                <ChevronRight size={8} strokeWidth={1.5} className="text-muted-foreground rotate-90" />
              </div>
            </div>
          ))}

          <button
            onClick={() => setGenerated(true)}
            className="mt-auto w-full py-2 rounded-xl text-[9px] font-bold text-background transition-opacity hover:opacity-85"
            style={{ background: 'hsl(var(--foreground))' }}
          >
            Générer mes 5 idées →
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-2 flex-1">
          <p className="text-[7px] font-bold uppercase tracking-[0.08em] text-muted-foreground mb-0.5">Résultats générés</p>
          {IDEA_RESULTS.map(({ name, niche, price, days, color }) => (
            <div key={name} className="rounded-lg border border-border p-2.5 flex items-center gap-2">
              <div className="w-1.5 h-8 rounded-full flex-shrink-0" style={{ background: color }} />
              <div className="flex-1 min-w-0">
                <p className="text-[9px] font-bold text-foreground">{name}</p>
                <p className="text-[7.5px] text-muted-foreground truncate">{niche}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-[9px] font-bold" style={{ color }}>{price}</p>
                <p className="text-[7px] text-muted-foreground">Build : {days}</p>
              </div>
            </div>
          ))}
          <button
            onClick={() => setGenerated(false)}
            className="mt-auto text-[7.5px] text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Modifier les critères
          </button>
        </div>
      )}
    </div>
  )
}

// ── Content: Bibliothèque ─────────────────────────────────────────────────────

const PROMPTS_LIB = [
  { module: 'Mod. 03', tag: 'Architecture', title: 'Structurer ma base de données',   preview: 'Tu es architecte Supabase. Génère le schéma complet (tables, colonnes, types, relations) pour mon SaaS...' },
  { module: 'Mod. 03', tag: 'Sécurité',     title: 'Sécuriser les accès avec RLS',    preview: 'Active et configure les Row Level Security policies Supabase pour que chaque user accède uniquement à ses données...' },
  { module: 'Mod. 04', tag: 'Build',        title: 'Créer mon schéma d\'API REST',    preview: 'Génère la structure d\'API complète pour mon SaaS : routes, méthodes HTTP, payloads, codes retour...' },
  { module: 'Mod. 05', tag: 'Déploiement',  title: 'Générer mes emails automatiques', preview: 'Crée les templates d\'emails transactionnels avec Resend : bienvenue, confirmation de paiement, relance...' },
  { module: 'Mod. 04', tag: 'Build',        title: 'Optimiser mes requêtes SQL',      preview: 'Audite et optimise ces requêtes Supabase. Identifie les indexes manquants et les N+1...' },
]

const TAG_COLORS: Record<string, string> = {
  Architecture: '#cc5de8', Sécurité: '#ff6b6b', Build: '#eab308', Déploiement: '#4d96ff', Lancement: '#22c55e',
}

function BibliothequeContent() {
  const [copied, setCopied] = useState<number | null>(null)

  const handleCopy = (i: number, preview: string) => {
    navigator.clipboard.writeText(preview).then(() => {
      setCopied(i)
      setTimeout(() => setCopied(null), 1500)
    })
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="px-4 pt-3 pb-2.5 border-b border-border flex-shrink-0">
        <p className="text-[7.5px] font-bold uppercase tracking-[0.1em] text-muted-foreground mb-0.5">Bibliothèque de prompts</p>
        <p className="text-[11px] font-bold text-foreground" style={{ letterSpacing: '-0.02em' }}>100+ prompts prêts à copier</p>
      </div>

      <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
        {PROMPTS_LIB.map(({ module, tag, title, preview }, i) => (
          <div key={i} className="rounded-lg border border-border bg-secondary/40 overflow-hidden">
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 border-b border-border">
              <span className="text-[6.5px] font-bold text-muted-foreground/60 uppercase tracking-[0.1em]">{module}</span>
              <span className="text-[6.5px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: `${TAG_COLORS[tag]}18`, color: TAG_COLORS[tag] }}>{tag}</span>
              <span className="flex-1 text-[8px] font-semibold text-foreground truncate">{title}</span>
              <button
                onClick={() => handleCopy(i, preview)}
                className="flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[7px] font-semibold transition-colors flex-shrink-0"
                style={{
                  background: copied === i ? 'rgba(34,197,94,0.12)' : 'hsl(var(--background))',
                  color: copied === i ? '#22c55e' : 'hsl(var(--muted-foreground))',
                  border: `1px solid ${copied === i ? 'rgba(34,197,94,0.3)' : 'hsl(var(--border))'}`,
                }}
              >
                <Copy size={7} strokeWidth={1.5} />
                {copied === i ? 'OK' : 'Copier'}
              </button>
            </div>
            <p className="px-2.5 py-1.5 text-[8px] text-muted-foreground leading-relaxed line-clamp-2">{preview}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Content: Checklist ────────────────────────────────────────────────────────

const CHECKLIST_GROUPS = [
  {
    label: 'Avant de coder',
    items: [
      { text: 'Idée validée (score viabilité > 60)', done: true  },
      { text: 'Brief produit rédigé',                done: true  },
      { text: 'Architecture validée',                done: true  },
      { text: 'Environnement configuré',             done: false },
    ],
  },
  {
    label: 'Build',
    items: [
      { text: 'Feature principale fonctionnelle',    done: false },
      { text: 'Auth utilisateur opérationnelle',     done: false },
      { text: 'Onboarding intégré',                  done: false },
    ],
  },
  {
    label: 'Déploiement',
    items: [
      { text: 'App déployée sur Vercel',             done: false },
      { text: 'Domaine personnalisé connecté',       done: false },
      { text: 'Stripe branché et testé',             done: false },
    ],
  },
  {
    label: 'Lancement',
    items: [
      { text: 'Landing page publiée',                done: false },
      { text: '5 contenus de lancement prêts',       done: false },
      { text: 'Premiers clients contactés',          done: false },
    ],
  },
]

function ChecklistContent() {
  const all = CHECKLIST_GROUPS.flatMap(g => g.items)
  const done = all.filter(i => i.done).length

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="px-4 pt-3 pb-2.5 border-b border-border flex-shrink-0">
        <div className="flex items-center justify-between mb-1">
          <p className="text-[7.5px] font-bold uppercase tracking-[0.1em] text-muted-foreground">Checklist de lancement</p>
          <span className="text-[8px] font-extrabold text-foreground">{done}/{all.length}</span>
        </div>
        <div className="h-1 rounded-full overflow-hidden bg-border">
          <div className="h-full bg-foreground rounded-full transition-all" style={{ width: `${(done / all.length) * 100}%` }} />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-3">
        {CHECKLIST_GROUPS.map(({ label, items }) => (
          <div key={label}>
            <p className="text-[7px] font-bold uppercase tracking-[0.08em] text-muted-foreground/60 mb-1.5">{label}</p>
            <div className="flex flex-col gap-1">
              {items.map(({ text, done }, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className={`w-3.5 h-3.5 rounded flex items-center justify-center flex-shrink-0 border ${done ? 'bg-foreground border-foreground' : 'border-border'}`}>
                    {done && <Check size={7} strokeWidth={3} className="text-background" />}
                  </div>
                  <span className={`text-[8.5px] ${done ? 'text-muted-foreground line-through' : 'text-foreground'}`}>{text}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Content: Outils ───────────────────────────────────────────────────────────

const TOOLS_LIST = [
  { Icon: BrandIcons.claude,         label: 'Claude',       desc: 'Moteur IA principal',    status: 'Configuré'      },
  { Icon: BrandIcons.vscode,         label: 'VS Code',      desc: 'IDE de développement',   status: 'Configuré'      },
  { Icon: BrandIcons.supabase,       label: 'Supabase',     desc: 'Base de données + Auth', status: 'Configuré'      },
  { Icon: BrandIcons.vercel,         label: 'Vercel',       desc: 'Déploiement web',        status: 'Configuré'      },
  { Icon: BrandIcons.stripe,         label: 'Stripe',       desc: 'Paiements',              status: 'À configurer'   },
  { Icon: BrandIcons.resend,         label: 'Resend',       desc: 'Emails transactionnels', status: 'À configurer'   },
  { Icon: BrandIcons.github,         label: 'GitHub',       desc: 'Versioning du code',     status: 'Configuré'      },
  { Icon: BrandIcons.cloudflare,     label: 'Cloudflare',   desc: 'DNS + CDN',              status: 'À configurer'   },
]

function OutilsContent() {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="px-4 pt-3 pb-2.5 border-b border-border flex-shrink-0">
        <p className="text-[7.5px] font-bold uppercase tracking-[0.1em] text-muted-foreground mb-0.5">Boîte à outils</p>
        <p className="text-[11px] font-bold text-foreground" style={{ letterSpacing: '-0.02em' }}>Ton stack complet, prêt à configurer</p>
      </div>

      <div className="flex-1 overflow-y-auto p-3 grid grid-cols-2 gap-2 content-start">
        {TOOLS_LIST.map(({ Icon, label, desc, status }) => (
          <div key={label} className="rounded-lg border border-border bg-secondary/40 p-2.5 flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <Icon className="w-4 h-4 text-foreground" />
              <ExternalLink size={7} strokeWidth={1.5} className="text-muted-foreground/40" />
            </div>
            <div>
              <p className="text-[9px] font-bold text-foreground leading-none">{label}</p>
              <p className="text-[7.5px] text-muted-foreground mt-0.5 leading-tight">{desc}</p>
            </div>
            <span
              className="text-[6.5px] font-bold px-1.5 py-0.5 rounded-full w-fit"
              style={status === 'Configuré'
                ? { background: 'rgba(34,197,94,0.12)', color: '#22c55e' }
                : { background: 'hsl(var(--border))', color: 'hsl(var(--muted-foreground))' }
              }
            >
              {status}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Main export ───────────────────────────────────────────────────────────────

export function DashboardPreview() {
  const [tab, setTab] = useState<Tab>('autopilot')

  return (
    <div>
      {/* Tab switcher — scrollable, full labels always */}
      <div className="relative mb-8">
        <div className="flex items-center justify-start sm:justify-center gap-1 overflow-x-auto pb-1 -mx-2 px-2 sm:mx-0 sm:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-3 sm:px-4 py-1.5 rounded-full text-[12px] sm:text-[13px] font-medium transition-colors whitespace-nowrap flex-shrink-0 ${
                tab === t.id ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        {/* Fade right — mobile only */}
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-background to-transparent sm:hidden" />
      </div>

      {/* Window — desktop */}
      <div className="hidden sm:block" style={{ perspective: '1400px' }}>
        <div style={{ transform: 'rotateX(3deg) rotateY(-1deg)', transformOrigin: 'center top', transition: 'transform 0.4s ease' }}>
          <div className="rounded-2xl overflow-hidden border border-border mx-auto" style={{ maxWidth: 900, boxShadow: '0 32px 80px rgba(0,0,0,0.12), 0 4px 16px rgba(0,0,0,0.06)' }}>
            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border bg-secondary">
              <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
              <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
              <div className="w-3 h-3 rounded-full bg-[#28c840]" />
              <div className="flex-1 mx-3 flex justify-center">
                <div className="bg-background rounded px-4 py-0.5 border border-border">
                  <span className="text-[10px] text-muted-foreground">app.buildrs.fr/dashboard</span>
                </div>
              </div>
              <div className="w-16" />
            </div>
            <div className="flex bg-background overflow-hidden" style={{ height: 460 }}>
              <MiniSidebar tab={tab} />
              {tab === 'autopilot'    && <AutopilotContent />}
              {tab === 'parcours'     && <ParcoursContent />}
              {tab === 'generator'    && <GeneratorContent />}
              {tab === 'bibliotheque' && <BibliothequeContent />}
              {tab === 'checklist'    && <ChecklistContent />}
              {tab === 'outils'       && <OutilsContent />}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile */}
      <div className="sm:hidden rounded-2xl overflow-hidden border border-border" style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }}>
        <div className="flex items-center gap-1.5 px-3 py-2 border-b border-border bg-secondary">
          <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
          <div className="flex-1 mx-2 flex justify-center">
            <div className="bg-background rounded px-3 py-0.5 border border-border">
              <span className="text-[9px] text-muted-foreground">app.buildrs.fr/dashboard</span>
            </div>
          </div>
        </div>
        <div className="bg-background" style={{ minHeight: 360 }}>
          {tab === 'autopilot'    && <AutopilotContent />}
          {tab === 'parcours'     && <ParcoursContent />}
          {tab === 'generator'    && <GeneratorContent />}
          {tab === 'bibliotheque' && <BibliothequeContent />}
          {tab === 'checklist'    && <ChecklistContent />}
          {tab === 'outils'       && <OutilsContent />}
        </div>
      </div>
    </div>
  )
}
