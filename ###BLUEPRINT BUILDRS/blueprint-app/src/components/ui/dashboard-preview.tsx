import { useState } from 'react'
import {
  Layers, Search, Palette, Building2, Hammer, Rocket, DollarSign,
  Lightbulb, ShieldCheck, TrendingUp, Check,
  Zap, ChevronRight, Database, Globe, Mail, CreditCard, Terminal,
  FolderOpen, BookOpen, CheckSquare, Wrench,
} from 'lucide-react'
import { BuildrsIcon } from './icons'
import { Github } from 'lucide-react'

// ── Types ─────────────────────────────────────────────────────────────────────

type Tab = 'autopilot' | 'parcours' | 'generator'

const TABS: { id: Tab; label: string; labelMobile: string }[] = [
  { id: 'autopilot',  label: 'Autopilot IA',    labelMobile: 'Autopilot' },
  { id: 'parcours',   label: 'Mon Parcours',     labelMobile: 'Parcours'  },
  { id: 'generator',  label: 'Générateurs IA',   labelMobile: 'Générateurs' },
]

// ── Mini sidebar — nouvelle structure ─────────────────────────────────────────

function MiniSidebar({ tab }: { tab: Tab }) {
  return (
    <div
      className="w-[175px] flex-shrink-0 border-r border-border flex flex-col overflow-hidden"
      style={{ background: 'hsl(var(--background))' }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2 px-3.5 h-[38px] border-b border-border flex-shrink-0">
        <BuildrsIcon color="currentColor" size={13} className="text-foreground" />
        <span className="font-extrabold text-[11px] text-foreground" style={{ letterSpacing: '-0.04em' }}>Buildrs</span>
      </div>

      {/* Progress */}
      <div className="px-3 py-2 border-b border-border">
        <div className="flex justify-between items-center mb-1">
          <span className="text-[7px] font-bold uppercase tracking-widest text-muted-foreground">Progression</span>
          <span className="text-[8px] font-extrabold text-foreground">42%</span>
        </div>
        <div className="h-[2px] rounded-full overflow-hidden" style={{ background: 'hsl(var(--border))' }}>
          <div className="h-full rounded-full bg-foreground" style={{ width: '42%' }} />
        </div>
      </div>

      {/* CONSTRUIRE */}
      <div className="px-2.5 pt-2.5 pb-0">
        <p className="text-[7px] font-bold uppercase tracking-[0.08em] text-muted-foreground/60 px-1 mb-1">Construire</p>

        {/* Autopilot IA */}
        <div className={`flex items-center gap-1.5 px-2 py-1.5 rounded-md mb-0.5 ${tab === 'autopilot' ? 'bg-foreground text-background' : 'text-muted-foreground'}`}>
          <Zap size={9} strokeWidth={1.5} className="flex-shrink-0" />
          <span className="text-[8px] font-medium flex-1">Autopilot IA</span>
          <span
            className="text-[6px] font-bold px-1 py-0.5 rounded flex-shrink-0"
            style={{ background: 'rgba(34,197,94,0.15)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.3)' }}
          >
            ACTIF
          </span>
        </div>

        {/* Mon Parcours — collapsible */}
        <div className={`flex items-center gap-1.5 px-2 py-1.5 rounded-md mb-0.5 ${tab === 'parcours' ? 'bg-foreground text-background' : 'text-muted-foreground'}`}>
          <BookOpen size={9} strokeWidth={1.5} className="flex-shrink-0" />
          <span className="text-[8px] font-medium flex-1">Mon Parcours</span>
          <ChevronRight
            size={7}
            strokeWidth={1.5}
            style={{ transform: tab === 'parcours' ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
          />
        </div>

        {/* Sub-modules when parcours active */}
        {tab === 'parcours' && (
          <div className="ml-2 flex flex-col gap-0.5 mb-0.5">
            {[
              { label: 'Fondations', pct: 100 },
              { label: 'Trouver & Valider', pct: 50 },
              { label: 'Préparer & Designer', pct: 0 },
            ].map(({ label, pct }) => (
              <div key={label} className="flex items-center gap-1.5 px-1.5 py-1 text-muted-foreground">
                <span className="text-[7.5px] flex-1 truncate">{label}</span>
                <div
                  className="w-1 h-1 rounded-full flex-shrink-0"
                  style={{ background: pct === 100 ? '#22c55e' : pct > 0 ? 'hsl(var(--foreground) / 0.4)' : 'transparent' }}
                />
              </div>
            ))}
          </div>
        )}

        {/* Mes Idées */}
        <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-md mb-2 text-muted-foreground">
          <Lightbulb size={9} strokeWidth={1.5} />
          <span className="text-[8px] font-medium">Mes Idées</span>
        </div>
      </div>

      {/* OUTILS IA */}
      <div className="px-2.5 pb-1.5">
        <p className="text-[7px] font-bold uppercase tracking-[0.08em] text-muted-foreground/60 px-1 mb-1">Outils IA</p>
        {([
          { label: 'Idées de SaaS',      Icon: Lightbulb,   active: tab === 'generator' },
          { label: "Validateur d'idée",  Icon: ShieldCheck, active: false },
          { label: 'Calc. MRR',          Icon: TrendingUp,  active: false },
        ] as const).map(({ label, Icon, active }) => (
          <div key={label} className={`flex items-center gap-1.5 px-2 py-1.5 rounded-md mb-0.5 ${active ? 'bg-foreground text-background' : 'text-muted-foreground'}`}>
            <Icon size={9} strokeWidth={1.5} className="flex-shrink-0" />
            <span className="text-[8px] font-medium truncate">{label}</span>
          </div>
        ))}
      </div>

      {/* RESSOURCES */}
      <div className="px-2.5 pb-1.5">
        <p className="text-[7px] font-bold uppercase tracking-[0.08em] text-muted-foreground/60 px-1 mb-1">Ressources</p>
        {([
          { label: 'Mes Projets',    Icon: FolderOpen  },
          { label: 'Bibliothèque',   Icon: BookOpen    },
          { label: 'Checklist',      Icon: CheckSquare },
          { label: 'Boîte à outils', Icon: Wrench      },
        ] as const).map(({ label, Icon }) => (
          <div key={label} className="flex items-center gap-1.5 px-2 py-1.5 rounded-md mb-0.5 text-muted-foreground">
            <Icon size={9} strokeWidth={1.5} className="flex-shrink-0" />
            <span className="text-[8px] font-medium truncate">{label}</span>
          </div>
        ))}
      </div>

      {/* CTA Cohorte */}
      <div className="mt-auto p-2.5">
        <div className="rounded-lg bg-foreground p-2">
          <p className="text-[6px] font-bold uppercase tracking-widest mb-0.5" style={{ color: 'rgba(250,250,250,0.45)' }}>
            Envie d'aller + vite ?
          </p>
          <p className="text-[8px] font-semibold text-background">Rejoindre la Cohorte →</p>
        </div>
      </div>
    </div>
  )
}

// ── Content: Autopilot IA ─────────────────────────────────────────────────────

const STACK_ITEMS = [
  { Icon: Terminal,   label: 'Claude Code', active: true  },
  { Icon: Database,   label: 'Supabase',    active: true  },
  { Icon: Globe,      label: 'Vercel',      active: true  },
  { Icon: Mail,       label: 'Resend',      active: false },
  { Icon: CreditCard, label: 'Stripe',      active: true  },
  { Icon: Github,     label: 'GitHub',      active: true  },
]

const TIMELINE_STEPS = [
  { n: 1, label: 'Idée validée',                    done: true,  current: false },
  { n: 2, label: 'Architecture définie',             done: true,  current: false },
  { n: 3, label: 'Design & branding validés',        done: false, current: true  },
  { n: 4, label: 'Build en cours',                   done: false, current: false },
  { n: 5, label: 'Déploiement & Monétisation',       done: false, current: false },
]

function AutopilotContent() {
  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Main */}
      <div className="flex-1 p-5 overflow-hidden flex flex-col gap-3">
        {/* Header */}
        <div className="flex items-center gap-2">
          <div
            className="w-1.5 h-1.5 rounded-full bg-foreground flex-shrink-0"
            style={{ animation: 'autopilot-pulse 2s ease-in-out infinite' }}
          />
          <span className="text-[7.5px] font-bold uppercase tracking-[0.1em] text-foreground">CLAUDE ACTIF</span>
          <span className="ml-auto text-[12px] font-extrabold text-foreground" style={{ letterSpacing: '-0.03em' }}>FactureAI</span>
        </div>

        {/* Brief */}
        <div className="border border-border rounded-lg p-3" style={{ background: 'hsl(var(--secondary) / 0.5)' }}>
          <p className="text-[7.5px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Brief produit</p>
          <p className="text-[10px] font-semibold text-foreground mb-0.5">FactureAI</p>
          <p className="text-[8.5px] text-muted-foreground leading-relaxed">
            Créer et envoyer des factures professionnelles en 30s grâce à l'IA
          </p>
        </div>

        {/* Timeline */}
        <div className="flex flex-col gap-1.5 flex-1">
          {TIMELINE_STEPS.map(({ n, label, done, current }) => (
            <div
              key={n}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg ${current ? 'bg-foreground' : 'border border-border'}`}
            >
              <div
                className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${
                  done    ? 'bg-foreground text-background'
                  : current ? 'bg-background text-foreground'
                  : 'border border-border text-muted-foreground'
                }`}
              >
                {done
                  ? <Check size={7} strokeWidth={3} className="text-background" />
                  : <span className="text-[7px] font-bold">{n}</span>
                }
              </div>
              <span className={`text-[8.5px] font-medium flex-1 ${current ? 'text-background' : done ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                {label}
              </span>
              {current && <span className="text-[6.5px] font-bold text-background/60 tracking-wider">EN COURS</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="w-[130px] flex-shrink-0 border-l border-border p-3 flex flex-col gap-3 overflow-hidden">
        {/* Score */}
        <div>
          <p className="text-[7px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">Score viabilité</p>
          <div className="text-center border border-border rounded-lg py-2">
            <span className="text-2xl font-extrabold text-foreground" style={{ letterSpacing: '-0.04em', lineHeight: 1 }}>74</span>
            <span className="text-[9px] text-muted-foreground">/100</span>
          </div>
        </div>

        {/* Stack */}
        <div>
          <p className="text-[7px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">Stack</p>
          <div className="flex flex-wrap gap-1">
            {STACK_ITEMS.map(({ Icon, label, active }) => (
              <div
                key={label}
                className={`flex items-center gap-0.5 px-1 py-0.5 rounded text-[7px] ${
                  active ? 'bg-foreground text-background' : 'border border-border text-muted-foreground'
                }`}
              >
                <Icon size={7} strokeWidth={1.5} />
                <span className="truncate" style={{ maxWidth: 40 }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* MRR */}
        <div>
          <p className="text-[7px] font-bold uppercase tracking-wider text-muted-foreground mb-1">MRR cible</p>
          <p className="text-[20px] font-extrabold text-foreground" style={{ letterSpacing: '-0.04em', lineHeight: 1 }}>1 000€</p>
          <p className="text-[7px] text-muted-foreground mt-0.5">~83 clients à 12€/mois</p>
        </div>
      </div>
    </div>
  )
}

// ── Content: Mon Parcours ─────────────────────────────────────────────────────

const MODULES_LIST = [
  { id: '00', label: 'Fondations',         Icon: Layers,     lessons: 7, done: 7,  pct: 100 },
  { id: '01', label: 'Trouver & Valider',  Icon: Search,     lessons: 4, done: 2,  pct: 50  },
  { id: '02', label: 'Préparer & Designer',Icon: Palette,    lessons: 4, done: 0,  pct: 0   },
  { id: '03', label: "L'Architecture",     Icon: Building2,  lessons: 4, done: 0,  pct: 0   },
  { id: '04', label: 'Construire',         Icon: Hammer,     lessons: 6, done: 0,  pct: 0   },
  { id: '05', label: 'Déployer',           Icon: Rocket,     lessons: 5, done: 0,  pct: 0   },
  { id: '06', label: 'Monétiser & Lancer', Icon: DollarSign, lessons: 7, done: 0,  pct: 0   },
]

function ParcoursContent() {
  return (
    <div className="flex-1 p-5 overflow-hidden">
      <div className="mb-4">
        <p className="text-[8px] font-bold uppercase tracking-widest text-muted-foreground mb-0.5">Mon Parcours</p>
        <h2 className="text-[15px] font-extrabold text-foreground" style={{ letterSpacing: '-0.03em' }}>
          7 modules · 33 leçons
        </h2>
        <p className="text-[9px] text-muted-foreground mt-0.5">De l'idée au MVP monétisé</p>
      </div>

      <div className="flex flex-col gap-2 overflow-hidden">
        {MODULES_LIST.map(({ id, label, Icon, lessons, done, pct }) => (
          <div
            key={id}
            className={`flex items-center gap-3 border border-border rounded-xl px-3.5 py-2.5 ${pct === 100 ? 'bg-secondary/40' : ''}`}
          >
            <div className={`w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 ${pct === 100 ? 'bg-foreground' : 'bg-secondary'}`}>
              <Icon size={10} strokeWidth={1.5} className={pct === 100 ? 'text-background' : 'text-muted-foreground'} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[9.5px] font-semibold text-foreground truncate leading-tight">{label}</p>
              <p className="text-[8px] text-muted-foreground">{done}/{lessons} leçons</p>
            </div>
            <div className="w-10 flex-shrink-0">
              <div className="flex justify-end mb-0.5">
                <span className="text-[7.5px] font-bold tabular-nums text-muted-foreground">{pct}%</span>
              </div>
              <div className="h-1 rounded-full overflow-hidden" style={{ background: 'hsl(var(--border))' }}>
                <div className="h-full rounded-full bg-foreground" style={{ width: `${pct}%` }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Content: Générateurs ──────────────────────────────────────────────────────

const CRITERIA = [
  { label: 'Taille de marché', val: 8, color: '#4d96ff' },
  { label: 'Concurrence',      val: 7, color: '#cc5de8' },
  { label: 'Buildabilité 72h', val: 9, color: '#22c55e' },
  { label: 'Monétisation',     val: 7, color: '#eab308' },
  { label: 'Timing IA',        val: 6, color: '#ff6b6b' },
]

function GeneratorContent() {
  const score = CRITERIA.reduce((a, c) => a + c.val, 0) * 2

  return (
    <div className="flex-1 p-6 overflow-hidden">
      <div className="mb-4">
        <p className="text-[8.5px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">Générateur</p>
        <h2 className="text-[17px] font-extrabold text-foreground" style={{ letterSpacing: '-0.03em' }}>
          Validation de SaaS
        </h2>
        <p className="text-[11px] text-muted-foreground mt-0.5">Score ton idée sur 5 critères. Résultat instantané.</p>
      </div>

      <div
        className="rounded-xl p-4 mb-4 text-center border"
        style={{ borderColor: '#4d96ff30', background: '#4d96ff08' }}
      >
        <p
          className="font-extrabold tabular-nums mb-0.5"
          style={{ fontSize: 36, letterSpacing: '-0.04em', color: '#4d96ff', lineHeight: 1 }}
        >
          {score}<span className="text-xl opacity-40">/100</span>
        </p>
        <p className="text-[12px] font-bold" style={{ color: '#4d96ff' }}>Prometteur</p>
        <p className="text-[10px] text-muted-foreground mt-0.5">Bonne base. Quelques points à valider avant de coder.</p>
      </div>

      <div className="flex flex-col gap-2.5">
        {CRITERIA.map(({ label, val, color }) => (
          <div key={label} className="flex items-center gap-3">
            <span className="text-[10px] text-muted-foreground w-28 truncate flex-shrink-0">{label}</span>
            <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'hsl(var(--border))' }}>
              <div className="h-1.5 rounded-full" style={{ width: `${(val / 10) * 100}%`, background: color }} />
            </div>
            <span className="text-[10px] font-bold tabular-nums w-8 text-right" style={{ color }}>{val}/10</span>
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
      {/* Tab switcher */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-3 sm:px-4 py-1.5 rounded-full text-[12px] sm:text-[13px] font-medium transition-colors ${
              tab === t.id
                ? 'bg-foreground text-background'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <span className="sm:hidden">{t.labelMobile}</span>
            <span className="hidden sm:inline">{t.label}</span>
          </button>
        ))}
      </div>

      {/* Window — desktop */}
      <div className="hidden sm:block" style={{ perspective: '1400px' }}>
        <div style={{ transform: 'rotateX(3deg) rotateY(-1deg)', transformOrigin: 'center top', transition: 'transform 0.4s ease' }}>
          <div
            className="rounded-2xl overflow-hidden border border-border mx-auto"
            style={{ maxWidth: 900, boxShadow: '0 32px 80px rgba(0,0,0,0.12), 0 4px 16px rgba(0,0,0,0.06)' }}
          >
            {/* Title bar */}
            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border" style={{ background: 'hsl(var(--secondary))' }}>
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
              {tab === 'autopilot' && <AutopilotContent />}
              {tab === 'parcours'  && <ParcoursContent />}
              {tab === 'generator' && <GeneratorContent />}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile — flat, sans sidebar */}
      <div
        className="sm:hidden rounded-2xl overflow-hidden border border-border"
        style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }}
      >
        <div className="flex items-center gap-1.5 px-3 py-2 border-b border-border" style={{ background: 'hsl(var(--secondary))' }}>
          <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
          <div className="flex-1 mx-2 flex justify-center">
            <div className="bg-background rounded px-3 py-0.5 border border-border">
              <span className="text-[9px] text-muted-foreground">app.buildrs.fr/dashboard</span>
            </div>
          </div>
        </div>
        <div className="bg-background">
          {tab === 'autopilot' && <AutopilotContent />}
          {tab === 'parcours'  && <ParcoursContent />}
          {tab === 'generator' && <GeneratorContent />}
        </div>
      </div>
    </div>
  )
}
