import { useState } from 'react'
import {
  Layers, Search, Palette, Building2, Hammer, Rocket, DollarSign,
  ShieldCheck, TrendingUp, Check, Copy, Zap, ChevronRight, Bot,
  BookOpen, CheckSquare, Wrench, ExternalLink, Lightbulb, FolderOpen,
} from 'lucide-react'
import { BuildrsIcon, BrandIcons, ClaudeIcon, WhatsAppIcon } from './icons'

// ── Types ─────────────────────────────────────────────────────────────────────

type Tab = 'autopilot' | 'parcours' | 'generator' | 'bibliotheque' | 'checklist' | 'outils'

const TABS: { id: Tab; label: string; short: string }[] = [
  { id: 'autopilot',    label: 'Jarvis IA',      short: 'Jarvis'     },
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
          { id: 'autopilot' as Tab, icon: Zap,      label: 'Jarvis IA',     badge: 'ACTIF', badgeColor: '#22c55e' },
          { id: 'parcours'  as Tab, icon: BookOpen,  label: 'Mon Parcours',  badge: null,    badgeColor: '' },
        ]).map(({ id, icon: Icon, label, badge, badgeColor }) => (
          <div key={id} className={`flex items-center gap-1.5 px-2 py-1.5 rounded-md mb-0.5 ${active(id) ? 'bg-foreground text-background' : 'text-muted-foreground'}`}>
            <Icon size={9} strokeWidth={1.5} className="flex-shrink-0" />
            <span className="text-[8px] font-medium flex-1 truncate">{label}</span>
            {badge && (
              <span className="text-[6px] font-bold px-1 py-0.5 rounded flex-shrink-0" style={{ background: `${badgeColor}26`, color: badgeColor, border: `1px solid ${badgeColor}4d` }}>
                {badge}
              </span>
            )}
          </div>
        ))}
        {/* Mes agents IA */}
        <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-md mb-0.5 text-muted-foreground">
          <Bot size={9} strokeWidth={1.5} className="flex-shrink-0" />
          <span className="text-[8px] font-medium flex-1 truncate">Mes agents IA</span>
          <span className="text-[6px] font-bold px-1 py-0.5 rounded flex-shrink-0" style={{ background: 'rgba(77,150,255,0.15)', color: '#4d96ff', border: '1px solid rgba(77,150,255,0.3)' }}>NEW</span>
        </div>
      </div>

      {/* OUTILS IA */}
      <div className="px-2 pt-2">
        <p className="text-[7px] font-bold uppercase tracking-[0.08em] text-muted-foreground/50 px-1 mb-1">Outils IA</p>
        {([
          { id: 'generator' as Tab, Icon: Lightbulb,   label: 'NicheFinder'  },
          { id: null,               Icon: ShieldCheck,  label: 'MarketPulse'  },
          { id: null,               Icon: TrendingUp,   label: 'FlipCalc'     },
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
          { id: null,                  Icon: FolderOpen,   label: 'Mes Projets'     },
          { id: 'bibliotheque' as Tab, Icon: BookOpen,     label: 'Bibliothèque'    },
          { id: 'checklist'    as Tab, Icon: CheckSquare,  label: 'Checklist'       },
          { id: 'outils'       as Tab, Icon: Wrench,       label: 'Boîte à outils'  },
        ] as const).map(({ id, Icon, label }, i) => (
          <div key={i} className={`flex items-center gap-1.5 px-2 py-1.5 rounded-md mb-0.5 ${id && active(id) ? 'bg-foreground text-background' : 'text-muted-foreground'}`}>
            <Icon size={9} strokeWidth={1.5} className="flex-shrink-0" />
            <span className="text-[8px] font-medium truncate">{label}</span>
          </div>
        ))}
      </div>

      {/* BONUS */}
      <div className="px-2 pt-2">
        <p className="text-[7px] font-bold uppercase tracking-[0.08em] text-muted-foreground/50 px-1 mb-1">Bonus</p>

        {/* Claude 360° */}
        <div
          className="flex items-center gap-1.5 px-2 py-1.5 rounded-md mb-0.5 text-muted-foreground"
          style={{ background: 'rgba(204,93,232,0.08)' }}
        >
          <ClaudeIcon size={9} className="flex-shrink-0" style={{ color: '#cc5de8' }} />
          <span className="text-[8px] font-medium flex-1 truncate" style={{ color: '#cc5de8' }}>Claude 360°</span>
          <span className="text-[5.5px] font-bold px-1 py-0.5 rounded" style={{ background: 'rgba(204,93,232,0.15)', color: '#cc5de8', border: '1px solid rgba(204,93,232,0.3)' }}>BONUS</span>
        </div>

        {/* WhatsApp */}
        <div
          className="flex items-center gap-1.5 px-2 py-1.5 rounded-md mb-0.5 text-muted-foreground"
          style={{ background: 'rgba(37,211,102,0.08)' }}
        >
          <WhatsAppIcon size={9} className="flex-shrink-0" style={{ color: '#25D366' }} />
          <span className="text-[8px] font-medium flex-1 truncate" style={{ color: '#25D366' }}>WhatsApp Buildrs</span>
          <span className="text-[5.5px] font-bold px-1 py-0.5 rounded" style={{ background: 'rgba(37,211,102,0.15)', color: '#25D366', border: '1px solid rgba(37,211,102,0.3)' }}>BONUS</span>
        </div>
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

const AUTOPILOT_STACK = [
  { Icon: BrandIcons.anthropic, label: 'Claude Code' },
  { Icon: BrandIcons.supabase,  label: 'Supabase'    },
  { Icon: BrandIcons.vercel,    label: 'Vercel'      },
  { Icon: BrandIcons.resend,    label: 'Resend'      },
  { Icon: BrandIcons.hostinger, label: 'Hostinger'   },
  { Icon: BrandIcons.stripe,    label: 'Stripe'      },
  { Icon: BrandIcons.github,    label: 'GitHub'      },
]

function AutopilotContent() {
  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Main — colonne principale */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-4 pt-3 pb-2.5 border-b border-border flex items-center justify-between flex-shrink-0">
          <div>
            <p className="text-[9px] font-extrabold text-foreground" style={{ letterSpacing: '-0.02em' }}>Mon Parcours</p>
            <p className="text-[6.5px] text-muted-foreground">Voici ta progression Blueprint</p>
          </div>
          <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)' }}>
            <div className="w-1 h-1 rounded-full bg-green-400" style={{ animation: 'autopilot-pulse 2s ease-in-out infinite' }} />
            <span className="text-[6px] font-bold" style={{ color: '#22c55e' }}>CLAUDE ACTIF</span>
          </div>
        </div>

        <div className="flex-1 overflow-hidden px-3 py-2.5 flex flex-col gap-2.5">
          {/* Stat bar */}
          <div className="flex items-center rounded-lg px-3 py-2 border border-border bg-secondary">
            {[
              { label: 'Modules', value: '4/6' },
              { label: 'Tâches',  value: '24'  },
              { label: 'Score',   value: '72%' },
            ].map(({ label, value }, i) => (
              <div key={label} className="flex-1 flex flex-col items-center" style={{ borderRight: i < 2 ? '1px solid hsl(var(--border))' : 'none' }}>
                <p className="text-[13px] font-extrabold text-foreground leading-none" style={{ letterSpacing: '-0.03em' }}>{value}</p>
                <p className="text-[6px] uppercase tracking-wider mt-0.5 text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>

          {/* Jarvis greeting */}
          <div className="flex items-start gap-1.5">
            <div className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #cc5de8, #4d96ff)', boxShadow: '0 0 8px rgba(204,93,232,0.35)' }}>
              <Zap size={9} strokeWidth={2} className="text-white" />
            </div>
            <div className="flex-1 rounded-xl rounded-tl-sm px-2.5 py-2" style={{ background: 'hsl(var(--secondary))', border: '1px solid hsl(var(--border))' }}>
              <p className="text-[7px] font-bold mb-0.5" style={{ background: 'linear-gradient(90deg, #cc5de8, #4d96ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Jarvis</p>
              <p className="text-[8px] text-foreground leading-relaxed">Bonjour ! Je suis Jarvis, ton copilote IA. Dis-moi où tu en es — je te guide pour la prochaine étape.</p>
            </div>
          </div>

          {/* Chat input */}
          <div className="rounded-xl px-3 py-2 border border-border bg-secondary">
            <p className="text-[8px] text-muted-foreground mb-2">Parle à Jarvis...</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted-foreground">
                {[
                  <svg key="attach" width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"/></svg>,
                  <svg key="globe" width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20"/></svg>,
                  <svg key="code"  width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>,
                ].map((icon, i) => (
                  <div key={i} className="w-5 h-5 rounded-full flex items-center justify-center">{icon}</div>
                ))}
              </div>
              <div className="w-5 h-5 rounded-full flex items-center justify-center bg-foreground">
                <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--background))" strokeWidth="2.5"><path d="M12 2a3 3 0 00-3 3v7a3 3 0 006 0V5a3 3 0 00-3-3z"/><path d="M19 10v2a7 7 0 01-14 0v-2M12 19v3"/></svg>
              </div>
            </div>
          </div>

          {/* Checklist */}
          <div>
            <p className="text-[6.5px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">Checklist en cours</p>
            <div className="flex flex-col gap-1">
              {[
                { label: 'Trouver & Valider',    done: true,  active: false },
                { label: 'Préparer & Designer',  done: true,  active: false },
                { label: 'Construire',           done: false, active: true  },
                { label: 'Déployer & Monétiser', done: false, active: false },
              ].map(({ label, done, active }) => (
                <div key={label} className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg" style={{ background: active ? 'hsl(var(--secondary))' : 'transparent', border: active ? '1px solid hsl(var(--border))' : '1px solid transparent' }}>
                  <div className="w-3 h-3 rounded flex items-center justify-center flex-shrink-0" style={{ background: done ? 'hsl(var(--foreground))' : 'hsl(var(--border))' }}>
                    {done && <Check size={5} strokeWidth={3} className="text-background" />}
                  </div>
                  <span className="text-[7.5px] flex-1" style={{ color: done ? 'hsl(var(--muted-foreground))' : 'hsl(var(--foreground))', textDecoration: done ? 'line-through' : 'none' }}>{label}</span>
                  {active && <span className="text-[5.5px] font-bold px-1 py-0.5 rounded-full" style={{ background: 'rgba(234,179,8,0.12)', color: '#eab308', border: '1px solid rgba(234,179,8,0.25)' }}>EN COURS</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right panel — desktop only */}
      <div className="hidden sm:flex w-[115px] flex-shrink-0 border-l border-border p-3 flex-col gap-3">
        <div>
          <p className="text-[6.5px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">Score de viabilité</p>
          <div className="text-center border border-border rounded-lg py-2.5" style={{ background: 'hsl(var(--secondary))' }}>
            <span className="text-[26px] font-extrabold text-foreground leading-none" style={{ letterSpacing: '-0.04em' }}>50</span>
            <p className="text-[6.5px] text-muted-foreground mt-0.5">Idée fortement validée</p>
          </div>
        </div>
        <div>
          <p className="text-[6.5px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">Stack</p>
          <div className="flex flex-col gap-1">
            {AUTOPILOT_STACK.map(({ Icon, label }) => (
              <div key={label} className="flex items-center justify-between px-1.5 py-1 rounded border border-border" style={{ background: 'hsl(var(--secondary))' }}>
                <div className="flex items-center gap-1">
                  <Icon className="w-2.5 h-2.5 flex-shrink-0 text-muted-foreground" />
                  <span className="text-[7px] text-muted-foreground">{label}</span>
                </div>
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'rgba(74,222,128,0.85)' }} />
              </div>
            ))}
          </div>
        </div>
        <div>
          <p className="text-[6.5px] font-bold uppercase tracking-wider text-muted-foreground mb-1">MRR estimé</p>
          <div className="h-px w-8 mb-1.5 bg-border" />
          <span className="text-[7px] text-muted-foreground underline cursor-pointer">Calculer →</span>
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
  { module: 'Mod. 01', tag: 'Idée',        title: 'Trouver mon idée de SaaS',         preview: 'Donne-moi 10 idées de micro-SaaS que je peux construire ce week-end, adaptées au marché français...' },
  { module: 'Mod. 02', tag: 'Design',      title: 'Créer mon branding en 5 minutes',  preview: 'Génère un nom, une couleur principale et un slogan pour mon SaaS qui [problème résolu]...' },
  { module: 'Mod. 03', tag: 'Architecture','title': 'Expliquer comment mon app fonctionne', preview: 'Décris comment construire [mon SaaS] étape par étape, sans jargon technique. Quelles pages, quels boutons...' },
  { module: 'Mod. 04', tag: 'Build',       title: 'Construire ma page principale',    preview: 'Crée le code de ma page d\'accueil. Elle doit avoir : une accroche, un bouton s\'inscrire, et une liste de fonctionnalités...' },
  { module: 'Mod. 06', tag: 'Lancement',   title: 'Rédiger mes 5 premiers posts',     preview: 'Écris 5 posts LinkedIn pour lancer mon SaaS. Ton direct, sans jargon. Commence par le problème que je résous...' },
]

const TAG_COLORS: Record<string, string> = {
  Idée: '#4d96ff', Design: '#cc5de8', Architecture: '#cc5de8', Build: '#eab308', Déploiement: '#4d96ff', Lancement: '#22c55e',
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

export function DashboardPreview({ windowHeight = 460, mobileHeight = 220, hideTabs = false }: { windowHeight?: number; mobileHeight?: number; hideTabs?: boolean }) {
  const [tab, setTab] = useState<Tab>('autopilot')

  return (
    <div>
      {/* Tab switcher — scrollable, full labels always */}
      <div className={`relative mb-8 ${hideTabs ? 'hidden' : ''}`}>
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
            <div className="flex bg-background overflow-hidden" style={{ height: windowHeight }}>
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
        <div className="flex bg-background overflow-hidden" style={{ minHeight: mobileHeight }}>
          <MiniSidebar tab={tab} />
          <div className="flex-1 overflow-hidden">
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
  )
}
