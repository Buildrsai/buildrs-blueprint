import { useState, useEffect } from 'react'
import {
  Layers, Search, Palette, Building2, Hammer, Rocket, DollarSign,
  TrendingUp, Check, Zap, ChevronDown, Bot, Home, Lock,
  Settings, CheckCircle, Tag, FolderOpen, LayoutGrid, Target,
  ShoppingBag, Wrench, Users, MessageSquare, Trophy, Flag,
  HelpCircle, Paperclip, Globe, Code2, Mic, Star, Pin,
} from 'lucide-react'
import { BuildrsIcon, ClaudeIcon, WhatsAppIcon } from './icons'

// ── Types & Tabs ──────────────────────────────────────────────────────────────

type Tab = 'accueil' | 'parcours' | 'communaute' | 'jarvis'

const TABS: { id: Tab; label: string; short: string }[] = [
  { id: 'accueil',    label: 'Accueil',       short: 'Accueil'  },
  { id: 'parcours',   label: 'Mon Parcours',  short: 'Parcours' },
  { id: 'communaute', label: 'Communauté',    short: 'Commu'    },
  { id: 'jarvis',     label: 'Jarvis',        short: 'Jarvis'   },
]

// ── Data constants ─────────────────────────────────────────────────────────────

const MINI_MODULES = [
  { num: '00', label: 'Fondations',          Icon: Layers,      pct: 100, status: 'done'        },
  { num: '01', label: 'Configuration',       Icon: Settings,    pct: 100, status: 'done'        },
  { num: '02', label: 'Trouver mon idée',    Icon: Search,      pct: 100, status: 'done'        },
  { num: '03', label: 'Valider mon produit', Icon: CheckCircle, pct: 30,  status: 'in_progress' },
  { num: '04', label: 'Structurer mon offre',Icon: Tag,         pct: 0,   status: 'pending'     },
  { num: '05', label: 'Designer',            Icon: Palette,     pct: 0,   status: 'pending'     },
  { num: '06', label: 'Architecturer',       Icon: Building2,   pct: 0,   status: 'pending'     },
  { num: '07', label: 'Construire',          Icon: Hammer,      pct: 0,   status: 'pending'     },
  { num: '08', label: 'Déployer',            Icon: Rocket,      pct: 0,   status: 'pending'     },
  { num: '09', label: 'Monétiser',           Icon: DollarSign,  pct: 0,   status: 'pending'     },
  { num: '10', label: 'Scaler',              Icon: TrendingUp,  pct: 0,   status: 'pending'     },
]

const ACCUEIL_STACK = [
  'Claude Code', 'Supabase', 'Vercel', 'Resend', 'Hostinger', 'Stripe', 'GitHub',
]

const ACCUEIL_CHECKLIST = [
  { label: 'Trouver & Valider',     status: 'done'        },
  { label: 'Préparer & Designer',   status: 'done'        },
  { label: 'Construire',            status: 'in_progress' },
  { label: 'Déployer & Monétiser',  status: 'pending'     },
]

const COMMUNITY_POSTS = [
  {
    author: 'Thomas', initials: 'T', color: '#4d96ff',
    type: 'win', typeLabel: 'Win', TypeIcon: Trophy, typeBg: 'rgba(34,197,94,0.12)', typeColor: '#22c55e',
    content: 'Je viens de déployer mon premier SaaS ! Premier paiement Stripe reçu ce matin. 🎉',
    time: '2h',
    reactions: [{ emoji: '🔥', count: 3 }, { emoji: '👏', count: 5 }, { emoji: '🚀', count: 2 }],
  },
  {
    author: 'Marie', initials: 'M', color: '#cc5de8',
    type: 'milestone', typeLabel: 'Avancement', TypeIcon: Flag, typeBg: 'rgba(99,102,241,0.12)', typeColor: '#818cf8',
    content: 'Module 03 terminé — validation produit faite avec le score viabilité à 78/100. ON Y VA.',
    time: '5h',
    reactions: [{ emoji: '🔥', count: 2 }, { emoji: '👏', count: 3 }, { emoji: '💡', count: 1 }],
  },
  {
    author: 'Lucas', initials: 'L', color: '#22c55e',
    type: 'question', typeLabel: 'Question', TypeIcon: HelpCircle, typeBg: 'rgba(234,179,8,0.12)', typeColor: '#eab308',
    content: 'Quel hébergeur vous conseillez pour un SaaS qui démarre à ~100 users ? Vercel ou Hostinger ?',
    time: '1j',
    reactions: [{ emoji: '💡', count: 4 }, { emoji: '🚀', count: 1 }],
  },
]

// ── Jarvis pixel-art avatar ────────────────────────────────────────────────────

function JarvisAvatar({ size = 28 }: { size?: number }) {
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
      <rect x="4" y="20" width="3" height="2" rx="1" fill="#4338ca"/>
      <rect x="17" y="20" width="3" height="2" rx="1" fill="#4338ca"/>
    </svg>
  )
}

// ── MiniSidebar ───────────────────────────────────────────────────────────────

function MiniSidebar({ tab, onTabChange }: { tab: Tab; onTabChange: (t: Tab) => void }) {
  const [parcoursOpen, setParcoursOpen] = useState(true)
  const [saasOpen, setSaasOpen]         = useState(false)
  const [outilsOpen, setOutilsOpen]     = useState(false)
  const [commOpen, setCommOpen]         = useState(false)
  const [accesOpen, setAccesOpen]       = useState(false)

  const sidebarItem = (
    label: string,
    IconEl: React.ReactNode,
    active: boolean,
    onClick?: () => void,
    badge?: React.ReactNode,
    dimmed?: boolean,
  ) => (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-1.5 rounded-md px-1.5 py-[3px] text-left transition-colors"
      style={{
        background: active ? 'rgba(255,255,255,0.08)' : 'transparent',
        opacity: dimmed ? 0.35 : 1,
        cursor: onClick ? 'pointer' : 'default',
      }}
    >
      <span className="shrink-0" style={{ color: active ? '#fff' : 'rgba(255,255,255,0.45)' }}>{IconEl}</span>
      <span className="flex-1 truncate text-[7.5px] font-medium"
        style={{ color: active ? '#fff' : 'rgba(255,255,255,0.45)' }}>
        {label}
      </span>
      {badge}
    </button>
  )

  const sectionHeader = (label: string, open: boolean, onToggle: () => void) => (
    <button
      onClick={onToggle}
      className="flex w-full items-center justify-between px-1.5 pb-0.5 pt-2"
    >
      <span className="text-[6.5px] font-bold uppercase tracking-[0.1em]" style={{ color: 'rgba(255,255,255,0.25)' }}>
        {label}
      </span>
      <ChevronDown size={8} strokeWidth={2} style={{
        color: 'rgba(255,255,255,0.25)',
        transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
        transition: 'transform 0.15s',
      }} />
    </button>
  )

  const greenDot = <div className="ml-auto h-1.5 w-1.5 rounded-full shrink-0" style={{ background: '#22c55e' }} />
  const grayDot  = <div className="ml-auto h-1.5 w-1.5 rounded-full shrink-0" style={{ background: 'rgba(255,255,255,0.15)' }} />
  const actifBadge = (
    <span className="ml-auto shrink-0 rounded-full px-1 text-[6px] font-bold uppercase"
      style={{ background: 'rgba(34,197,94,0.15)', color: '#22c55e', border: '0.5px solid rgba(34,197,94,0.3)' }}>
      ACTIF
    </span>
  )
  const lockIcon = <Lock size={7} strokeWidth={2} style={{ color: 'rgba(255,255,255,0.3)', marginLeft: 'auto', flexShrink: 0 }} />

  return (
    <div className="flex flex-col bg-[#0a0b0e]" style={{ width: 145, borderRight: '0.5px solid rgba(255,255,255,0.07)', flexShrink: 0, overflow: 'hidden' }}>

      {/* Logo */}
      <div className="flex items-center gap-1.5 px-2.5 py-2" style={{ borderBottom: '0.5px solid rgba(255,255,255,0.07)' }}>
        <BuildrsIcon color="#fff" size={11} />
        <span className="text-[10px] font-extrabold text-white" style={{ letterSpacing: '-0.04em' }}>Buildrs</span>
      </div>

      {/* XP bar */}
      <div className="px-2.5 py-1.5" style={{ borderBottom: '0.5px solid rgba(255,255,255,0.07)' }}>
        <div className="flex items-center gap-1 mb-0.5">
          <Star size={7} strokeWidth={1.5} style={{ color: '#4d96ff' }} />
          <span className="text-[6.5px] font-bold uppercase tracking-wider" style={{ color: '#4d96ff' }}>EXPLORER</span>
          <span className="ml-auto text-[6.5px] font-bold" style={{ color: 'rgba(255,255,255,0.5)' }}>42 XP</span>
        </div>
        <div className="h-[2px] w-full rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
          <div className="h-full rounded-full" style={{ width: '35%', background: 'linear-gradient(90deg, #4d96ff, #8b5cf6)' }} />
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-1.5 py-1" style={{ scrollbarWidth: 'none' }}>

        {/* Standalone items */}
        {sidebarItem('Accueil', <Home size={9} strokeWidth={1.5} />, tab === 'accueil', () => onTabChange('accueil'))}
        {sidebarItem('Claude OS', <ClaudeIcon size={9} className="" />, false)}

        {/* MON PARCOURS */}
        {sectionHeader('MON PARCOURS', parcoursOpen, () => setParcoursOpen(o => !o))}
        {parcoursOpen && (
          <div className="flex flex-col gap-[1px]">
            {MINI_MODULES.map(({ num, label, Icon: ModIcon, status }) => (
              <button
                key={num}
                className="flex w-full items-center gap-1 rounded-md px-1 py-[2px]"
                style={{ background: num === '03' && tab === 'parcours' ? 'rgba(255,255,255,0.07)' : 'transparent' }}
                onClick={() => onTabChange('parcours')}
              >
                <span className="shrink-0 flex h-3.5 w-3.5 items-center justify-center rounded text-[6px] font-bold"
                  style={{
                    background: status === 'done' ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.06)',
                    color: status === 'done' ? '#22c55e' : 'rgba(255,255,255,0.4)',
                  }}>
                  {num === '03' && tab === 'parcours'
                    ? <ModIcon size={7} strokeWidth={2} style={{ color: '#fff' }} />
                    : num
                  }
                </span>
                <span className="flex-1 truncate text-[7px]"
                  style={{ color: num === '03' && tab === 'parcours' ? '#fff' : 'rgba(255,255,255,0.4)' }}>
                  {label}
                </span>
                {status === 'done' && greenDot}
                {status === 'in_progress' && grayDot}
              </button>
            ))}
          </div>
        )}

        {/* MON SAAS IA */}
        {sectionHeader('MON SAAS IA', saasOpen, () => setSaasOpen(o => !o))}
        {saasOpen && (
          <div className="flex flex-col gap-[1px]">
            {sidebarItem('Fiche projet', <FolderOpen size={9} strokeWidth={1.5} />, false)}
            {sidebarItem('Mon Pipeline', <LayoutGrid size={9} strokeWidth={1.5} />, false)}
          </div>
        )}

        {/* OUTILS */}
        {sectionHeader('OUTILS', outilsOpen, () => setOutilsOpen(o => !o))}
        {outilsOpen && (
          <div className="flex flex-col gap-[1px]">
            {sidebarItem('Jarvis IA',       <Zap size={9} strokeWidth={1.5} />,         tab === 'jarvis', () => onTabChange('jarvis'), actifBadge)}
            {sidebarItem('Agents IA',       <Bot size={9} strokeWidth={1.5} />,         false, undefined, lockIcon, true)}
            {sidebarItem('Valider mon SaaS',<Target size={9} strokeWidth={1.5} />,      false, undefined, lockIcon, true)}
            {sidebarItem('Idées SaaS',      <ShoppingBag size={9} strokeWidth={1.5} />, false, undefined, lockIcon, true)}
            {sidebarItem('Boîte à outils',  <Wrench size={9} strokeWidth={1.5} />,      false)}
          </div>
        )}

        {/* COMMUNAUTÉ */}
        {sectionHeader('COMMUNAUTÉ', commOpen, () => setCommOpen(o => !o))}
        {commOpen && (
          <div className="flex flex-col gap-[1px]">
            {sidebarItem('Feed',    <MessageSquare size={9} strokeWidth={1.5} />, tab === 'communaute', () => onTabChange('communaute'))}
            {sidebarItem('Membres', <Users size={9} strokeWidth={1.5} />,         false)}
          </div>
        )}

        {/* ACCÈS BUILDRS */}
        {sectionHeader('ACCÈS BUILDRS', accesOpen, () => setAccesOpen(o => !o))}
        {accesOpen && (
          <div className="flex flex-col gap-[1px]">
            {sidebarItem('WhatsApp Buildrs', <WhatsAppIcon size={9} className="" />, false)}
          </div>
        )}
      </div>

      {/* Bottom CTA */}
      <div className="px-2.5 py-2" style={{ borderTop: '0.5px solid rgba(255,255,255,0.07)' }}>
        <span className="text-[7px] font-semibold" style={{ color: 'rgba(255,255,255,0.35)' }}>
          Sprint & Cohorte avec Alfred →
        </span>
      </div>
    </div>
  )
}

// ── AccueilContent ────────────────────────────────────────────────────────────

function AccueilContent() {
  return (
    <div className="flex flex-1 min-w-0 overflow-hidden">
      {/* Main */}
      <div className="flex flex-1 flex-col gap-2 p-3 overflow-y-auto min-w-0" style={{ scrollbarWidth: 'none' }}>

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[9px] font-extrabold text-white" style={{ letterSpacing: '-0.02em' }}>Salut, Alex 👋</p>
            <p className="text-[6.5px]" style={{ color: 'rgba(255,255,255,0.35)' }}>Voici ton cockpit Buildrs</p>
          </div>
          <span className="rounded-full px-1.5 py-0.5 text-[6px] font-bold uppercase tracking-wider"
            style={{ background: 'rgba(77,150,255,0.12)', color: '#4d96ff', border: '0.5px solid rgba(77,150,255,0.25)' }}>
            EXPLORER
          </span>
        </div>

        {/* Metrics */}
        <div className="flex items-center gap-1.5">
          {[
            { label: 'Modules', value: '3/14' },
            { label: 'Tâches',  value: '8'    },
            { label: 'Score',   value: '72',  color: '#22c55e' },
          ].map(({ label, value, color }) => (
            <div key={label} className="flex-1 rounded-lg px-2 py-1.5"
              style={{ background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.07)' }}>
              <p className="text-[11px] font-extrabold leading-none" style={{ color: color ?? '#fff', letterSpacing: '-0.03em' }}>{value}</p>
              <p className="text-[6px] uppercase tracking-wider mt-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>{label}</p>
            </div>
          ))}
        </div>

        {/* Jarvis block */}
        <div className="rounded-xl p-2.5" style={{ background: 'rgba(255,255,255,0.03)', border: '0.5px solid rgba(255,255,255,0.08)' }}>
          <div className="flex items-center gap-1.5 mb-2">
            <JarvisAvatar size={18} />
            <div>
              <div className="flex items-center gap-1">
                <span className="text-[7.5px] font-bold" style={{ background: 'linear-gradient(90deg, #818cf8, #4d96ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Jarvis</span>
                <span className="rounded-full px-1 py-[1px] text-[5.5px] font-bold"
                  style={{ background: 'rgba(34,197,94,0.12)', color: '#22c55e', border: '0.5px solid rgba(34,197,94,0.3)' }}>
                  EN LIGNE
                </span>
              </div>
            </div>
          </div>
          <div className="rounded-lg px-2 py-1.5 mb-2"
            style={{ background: 'rgba(99,102,241,0.08)', border: '0.5px solid rgba(99,102,241,0.2)' }}>
            <p className="text-[7px] leading-[1.5]" style={{ color: 'rgba(255,255,255,0.7)' }}>
              Ton environnement est prêt. Sur quoi tu veux bosser aujourd'hui ?
            </p>
          </div>
          <div className="rounded-lg px-2 py-1.5" style={{ background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.08)' }}>
            <p className="text-[7px] mb-1.5" style={{ color: 'rgba(255,255,255,0.2)' }}>Parle à Jarvis...</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                {[Paperclip, Globe, Code2].map((Icon, i) => (
                  <Icon key={i} size={8} strokeWidth={1.5} style={{ color: 'rgba(255,255,255,0.25)' }} />
                ))}
              </div>
              <div className="flex h-4 w-4 items-center justify-center rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
                <Mic size={7} strokeWidth={1.5} style={{ color: 'rgba(255,255,255,0.4)' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Checklist */}
        <div>
          <p className="text-[6.5px] font-bold uppercase tracking-[0.1em] mb-1.5" style={{ color: 'rgba(255,255,255,0.3)' }}>
            Checklist en cours
          </p>
          <div className="flex flex-col gap-1">
            {ACCUEIL_CHECKLIST.map(({ label, status }) => (
              <div key={label} className="flex items-center gap-1.5">
                <div className="shrink-0 h-3 w-3 rounded-full flex items-center justify-center"
                  style={{
                    background: status === 'done' ? 'rgba(34,197,94,0.15)' : status === 'in_progress' ? 'rgba(255,255,255,0.06)' : 'transparent',
                    border: status === 'done' ? 'none' : '0.5px solid rgba(255,255,255,0.12)',
                  }}>
                  {status === 'done' && <Check size={6} strokeWidth={2.5} style={{ color: '#22c55e' }} />}
                </div>
                <span className="flex-1 text-[7px]"
                  style={{ color: status === 'done' ? 'rgba(255,255,255,0.35)' : status === 'in_progress' ? '#fff' : 'rgba(255,255,255,0.25)', textDecoration: status === 'done' ? 'line-through' : 'none' }}>
                  {label}
                </span>
                {status === 'in_progress' && (
                  <span className="shrink-0 rounded-full px-1 py-[1px] text-[5.5px] font-bold uppercase"
                    style={{ background: 'rgba(234,179,8,0.12)', color: '#eab308', border: '0.5px solid rgba(234,179,8,0.25)' }}>
                    EN COURS
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — desktop only */}
      <div className="hidden md:flex flex-col gap-2 p-2 overflow-y-auto" style={{ width: 100, borderLeft: '0.5px solid rgba(255,255,255,0.07)', scrollbarWidth: 'none', flexShrink: 0 }}>

        {/* Score */}
        <div className="rounded-lg p-2" style={{ background: 'rgba(255,255,255,0.03)', border: '0.5px solid rgba(255,255,255,0.07)' }}>
          <p className="text-[6px] font-bold uppercase tracking-wider mb-1" style={{ color: 'rgba(255,255,255,0.3)' }}>Score viabilité</p>
          <p className="text-[22px] font-extrabold leading-none" style={{ color: '#22c55e', letterSpacing: '-0.04em' }}>72</p>
          <p className="text-[6px] mt-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>Idée fortement validée</p>
        </div>

        {/* Stack */}
        <div className="rounded-lg p-2" style={{ background: 'rgba(255,255,255,0.03)', border: '0.5px solid rgba(255,255,255,0.07)' }}>
          <p className="text-[6px] font-bold uppercase tracking-wider mb-1.5" style={{ color: 'rgba(255,255,255,0.3)' }}>Stack</p>
          <div className="flex flex-col gap-1">
            {ACCUEIL_STACK.map(name => (
              <div key={name} className="flex items-center justify-between">
                <span className="text-[7px]" style={{ color: 'rgba(255,255,255,0.5)' }}>{name}</span>
                <div className="h-1.5 w-1.5 rounded-full" style={{ background: '#22c55e' }} />
              </div>
            ))}
          </div>
        </div>

        {/* MRR */}
        <div className="rounded-lg p-2" style={{ background: 'rgba(255,255,255,0.03)', border: '0.5px solid rgba(255,255,255,0.07)' }}>
          <p className="text-[6px] font-bold uppercase tracking-wider mb-1" style={{ color: 'rgba(255,255,255,0.3)' }}>MRR estimé</p>
          <p className="text-[11px] font-extrabold leading-none text-white" style={{ letterSpacing: '-0.03em' }}>2 400€</p>
          <p className="text-[6px] mt-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>/mois</p>
        </div>
      </div>
    </div>
  )
}

// ── ParcoursContent ───────────────────────────────────────────────────────────

function ParcoursContent() {
  return (
    <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2" style={{ scrollbarWidth: 'none' }}>
      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <p className="text-[9px] font-extrabold text-white" style={{ letterSpacing: '-0.02em' }}>Mon Parcours</p>
          <span className="text-[7px] font-bold" style={{ color: 'rgba(255,255,255,0.4)' }}>42%</span>
        </div>
        <div className="h-[3px] w-full rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
          <div className="h-full rounded-full" style={{ width: '42%', background: 'linear-gradient(90deg, #4d96ff, #8b5cf6)' }} />
        </div>
      </div>

      {/* Module list */}
      <div className="flex flex-col gap-1">
        {MINI_MODULES.map(({ num, label, Icon: ModIcon, pct, status }) => {
          const isActive = num === '03'
          return (
            <div key={num} className="flex items-center gap-2 rounded-lg px-2 py-1.5"
              style={{
                background: isActive ? 'rgba(77,150,255,0.06)' : 'rgba(255,255,255,0.02)',
                border: isActive ? '0.5px solid rgba(77,150,255,0.2)' : '0.5px solid rgba(255,255,255,0.05)',
              }}>
              {/* Num badge */}
              <span className="shrink-0 flex h-4 w-4 items-center justify-center rounded text-[6.5px] font-bold"
                style={{
                  background: status === 'done' ? 'rgba(34,197,94,0.15)' : isActive ? 'rgba(77,150,255,0.15)' : 'rgba(255,255,255,0.06)',
                  color: status === 'done' ? '#22c55e' : isActive ? '#4d96ff' : 'rgba(255,255,255,0.4)',
                }}>
                {status === 'done' ? <Check size={7} strokeWidth={2.5} /> : num}
              </span>
              {/* Icon */}
              <ModIcon size={8} strokeWidth={1.5} style={{ color: isActive ? '#4d96ff' : 'rgba(255,255,255,0.3)', flexShrink: 0 }} />
              {/* Label */}
              <span className="flex-1 truncate text-[7.5px] font-medium"
                style={{ color: isActive ? '#fff' : status === 'done' ? 'rgba(255,255,255,0.45)' : 'rgba(255,255,255,0.35)' }}>
                {label}
              </span>
              {/* Right side */}
              {isActive && (
                <span className="shrink-0 rounded-full px-1.5 py-[1px] text-[5.5px] font-bold uppercase"
                  style={{ background: 'rgba(234,179,8,0.12)', color: '#eab308', border: '0.5px solid rgba(234,179,8,0.25)' }}>
                  EN COURS
                </span>
              )}
              {pct === 100 && (
                <span className="text-[6.5px] font-bold" style={{ color: '#22c55e' }}>100%</span>
              )}
              {pct > 0 && pct < 100 && (
                <span className="text-[6.5px] font-bold" style={{ color: '#eab308' }}>{pct}%</span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── CommunauteContent ─────────────────────────────────────────────────────────

function CommunauteContent() {
  const filters = ['Tout', 'Wins', 'Avan.', 'Idées', 'Quest.']

  return (
    <div className="flex flex-1 min-w-0 overflow-hidden">
      {/* Main feed */}
      <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2 min-w-0" style={{ scrollbarWidth: 'none' }}>

        {/* Header */}
        <div>
          <p className="text-[9px] font-extrabold text-white" style={{ letterSpacing: '-0.02em' }}>Communauté</p>
          <p className="text-[6.5px]" style={{ color: 'rgba(255,255,255,0.35)' }}>Partage tes wins, avance avec les builders.</p>
        </div>

        {/* Filter pills */}
        <div className="flex items-center gap-1 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          {filters.map((f, i) => (
            <button key={f} className="shrink-0 rounded-full px-2 py-0.5 text-[6.5px] font-semibold"
              style={{
                background: i === 0 ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.04)',
                color: i === 0 ? '#fff' : 'rgba(255,255,255,0.4)',
                border: i === 0 ? '0.5px solid rgba(255,255,255,0.2)' : '0.5px solid rgba(255,255,255,0.07)',
              }}>
              {f}
            </button>
          ))}
        </div>

        {/* Composer */}
        <div className="rounded-lg px-2 py-1.5" style={{ background: 'rgba(255,255,255,0.03)', border: '0.5px solid rgba(255,255,255,0.08)' }}>
          <p className="text-[7px]" style={{ color: 'rgba(255,255,255,0.2)' }}>Partage ton dernier win...</p>
        </div>

        {/* Posts */}
        {COMMUNITY_POSTS.map(post => (
          <div key={post.author} className="rounded-lg p-2" style={{ background: 'rgba(255,255,255,0.03)', border: '0.5px solid rgba(255,255,255,0.07)' }}>
            <div className="flex items-center gap-1.5 mb-1.5">
              {/* Avatar */}
              <div className="shrink-0 flex h-4 w-4 items-center justify-center rounded-full text-[6px] font-bold text-white"
                style={{ background: post.color }}>
                {post.initials}
              </div>
              <span className="text-[7.5px] font-bold text-white">{post.author}</span>
              <span className="rounded-full px-1.5 py-[1px] text-[5.5px] font-bold flex items-center gap-0.5"
                style={{ background: post.typeBg, color: post.typeColor, border: `0.5px solid ${post.typeColor}40` }}>
                <post.TypeIcon size={5} strokeWidth={2} />
                {post.typeLabel}
              </span>
              <span className="ml-auto text-[6px]" style={{ color: 'rgba(255,255,255,0.25)' }}>{post.time}</span>
            </div>
            <p className="text-[7px] leading-[1.5] mb-1.5" style={{ color: 'rgba(255,255,255,0.65)' }}>{post.content}</p>
            <div className="flex items-center gap-2">
              {post.reactions.map(r => (
                <button key={r.emoji} className="flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[6px]"
                  style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)', border: '0.5px solid rgba(255,255,255,0.08)' }}>
                  {r.emoji} {r.count}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Pinned sidebar — desktop only */}
      <div className="hidden md:flex flex-col gap-1.5 p-2 overflow-y-auto" style={{ width: 90, borderLeft: '0.5px solid rgba(255,255,255,0.07)', scrollbarWidth: 'none', flexShrink: 0 }}>
        <div className="flex items-center gap-1 mb-0.5">
          <Pin size={7} strokeWidth={1.5} style={{ color: 'rgba(255,255,255,0.3)' }} />
          <span className="text-[6px] font-bold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.3)' }}>Épinglés</span>
        </div>
        {[
          { author: 'Alfred', content: 'Bienvenue dans la communauté Buildrs. Posez vos questions ici.', time: '7j' },
          { author: 'Jarvis', content: 'Rappel : le Score de viabilité est disponible sur l\'accueil.', time: '3j' },
        ].map(p => (
          <div key={p.author} className="rounded-lg p-1.5" style={{ background: 'rgba(255,255,255,0.03)', border: '0.5px solid rgba(255,255,255,0.07)' }}>
            <div className="flex items-center justify-between mb-0.5">
              <span className="text-[6.5px] font-bold text-white">{p.author}</span>
              <span className="text-[5.5px]" style={{ color: 'rgba(255,255,255,0.25)' }}>{p.time}</span>
            </div>
            <p className="text-[6.5px] leading-[1.4]" style={{ color: 'rgba(255,255,255,0.45)' }}>{p.content}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── JarvisContent ─────────────────────────────────────────────────────────────

function JarvisContent() {
  const messages = [
    { role: 'jarvis', content: 'Bonjour ! Je suis Jarvis, ton copilote IA. Dis-moi où tu en es — je te guide pour la prochaine étape.' },
    { role: 'user',   content: 'Je veux valider mon idée de SaaS pour les freelances.' },
    { role: 'jarvis', content: 'Super ! Décris-moi ton idée en 2-3 phrases. Je vais analyser le marché, la concurrence et te donner un score de viabilité /100.' },
  ]

  return (
    <div className="flex-1 overflow-hidden flex flex-col p-3 gap-2">
      {/* Header */}
      <div className="flex items-center justify-between shrink-0">
        <p className="text-[9px] font-extrabold text-white" style={{ letterSpacing: '-0.02em' }}>Jarvis IA</p>
        <span className="flex items-center gap-1 rounded-full px-2 py-0.5 text-[6px] font-bold"
          style={{ background: 'rgba(34,197,94,0.12)', color: '#22c55e', border: '0.5px solid rgba(34,197,94,0.3)' }}>
          <span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ background: '#22c55e' }} />
          CLAUDE ACTIF
        </span>
      </div>

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-2" style={{ scrollbarWidth: 'none' }}>
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-1.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            {msg.role === 'jarvis' && (
              <div className="shrink-0 mt-0.5"><JarvisAvatar size={16} /></div>
            )}
            {msg.role === 'user' && (
              <div className="shrink-0 flex h-4 w-4 items-center justify-center rounded-full text-[6px] font-bold text-white mt-0.5"
                style={{ background: '#4d96ff' }}>A</div>
            )}
            <div className="max-w-[75%] rounded-lg px-2 py-1.5"
              style={{
                background: msg.role === 'jarvis' ? 'rgba(99,102,241,0.08)' : 'rgba(77,150,255,0.1)',
                border: msg.role === 'jarvis' ? '0.5px solid rgba(99,102,241,0.2)' : '0.5px solid rgba(77,150,255,0.2)',
              }}>
              {msg.role === 'jarvis' && (
                <p className="text-[6.5px] font-bold mb-0.5" style={{ background: 'linear-gradient(90deg, #818cf8, #4d96ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Jarvis</p>
              )}
              <p className="text-[7px] leading-[1.5]" style={{ color: 'rgba(255,255,255,0.75)' }}>{msg.content}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="shrink-0 rounded-xl px-2 py-1.5" style={{ background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.1)' }}>
        <p className="text-[7px] mb-1.5" style={{ color: 'rgba(255,255,255,0.2)' }}>Parle à Jarvis...</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {[Paperclip, Globe, Code2].map((Icon, i) => (
              <Icon key={i} size={8} strokeWidth={1.5} style={{ color: 'rgba(255,255,255,0.25)' }} />
            ))}
          </div>
          <div className="flex h-4 w-4 items-center justify-center rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
            <Mic size={7} strokeWidth={1.5} style={{ color: 'rgba(255,255,255,0.4)' }} />
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Main DashboardPreview ─────────────────────────────────────────────────────

export function DashboardPreview({ windowHeight = 460, mobileHeight = 260, hideTabs = false }: {
  windowHeight?: number
  mobileHeight?: number
  hideTabs?: boolean
}) {
  const [tab, setTab] = useState<Tab>('accueil')

  const tabContent = () => {
    if (tab === 'accueil')    return <AccueilContent />
    if (tab === 'parcours')   return <ParcoursContent />
    if (tab === 'communaute') return <CommunauteContent />
    return <JarvisContent />
  }

  return (
    <div className="w-full select-none">
      {/* Tab switcher */}
      {!hideTabs && (
        <div className="hidden sm:flex relative mb-4 justify-center">
          <div className="relative flex items-center gap-1 rounded-full border border-border bg-card px-1.5 py-1.5 overflow-x-auto max-w-full"
            style={{ scrollbarWidth: 'none' }}>
            {TABS.map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className="shrink-0 rounded-full px-4 py-1.5 text-[13px] font-semibold transition-all"
                style={{
                  background: tab === t.id ? 'hsl(var(--foreground))' : 'transparent',
                  color: tab === t.id ? 'hsl(var(--background))' : 'hsl(var(--muted-foreground))',
                }}
              >
                <span className="hidden sm:inline">{t.label}</span>
                <span className="sm:hidden">{t.short}</span>
              </button>
            ))}
          </div>
          {/* Fade right edge on mobile */}
          <div className="sm:hidden absolute right-0 top-0 bottom-0 w-8 pointer-events-none"
            style={{ background: 'linear-gradient(to right, transparent, hsl(var(--background)))' }} />
        </div>
      )}

      {/* Desktop window */}
      <div className="hidden sm:block w-full" style={{ perspective: '1400px' }}>
        <div className="relative w-full overflow-hidden rounded-2xl"
          style={{
            border: '1px solid rgba(255,255,255,0.08)',
            background: '#09090b',
            height: windowHeight,
            transform: 'rotateX(3deg) rotateY(-1deg)',
            boxShadow: '0 40px 80px rgba(0,0,0,0.6)',
          }}>

          {/* Window chrome */}
          <div className="flex items-center gap-1.5 px-3 py-2.5" style={{ background: '#0a0b0e', borderBottom: '0.5px solid rgba(255,255,255,0.07)' }}>
            <div className="h-2.5 w-2.5 rounded-full" style={{ background: '#ef4444' }} />
            <div className="h-2.5 w-2.5 rounded-full" style={{ background: '#eab308' }} />
            <div className="h-2.5 w-2.5 rounded-full" style={{ background: '#22c55e' }} />
            <div className="mx-auto flex items-center gap-1.5 rounded-md px-3 py-1"
              style={{ background: 'rgba(255,255,255,0.05)', border: '0.5px solid rgba(255,255,255,0.08)' }}>
              <div className="h-1.5 w-1.5 rounded-full" style={{ background: '#22c55e' }} />
              <span className="text-[10px] font-medium" style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'Geist Mono, monospace' }}>
                app.buildrs.fr/dashboard
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="flex" style={{ height: windowHeight - 38 }}>
            <MiniSidebar tab={tab} onTabChange={setTab} />
            {tabContent()}
          </div>
        </div>
      </div>

      {/* Mobile window */}
      <div className="sm:hidden w-full overflow-hidden rounded-xl"
        style={{
          border: '1px solid rgba(255,255,255,0.08)',
          background: '#09090b',
          height: mobileHeight,
          boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
        }}>

        {/* Chrome */}
        <div className="flex items-center gap-1 px-2.5 py-1.5" style={{ background: '#0a0b0e', borderBottom: '0.5px solid rgba(255,255,255,0.07)' }}>
          {['#ef4444','#eab308','#22c55e'].map(c => (
            <div key={c} className="h-2 w-2 rounded-full" style={{ background: c }} />
          ))}
          <div className="mx-auto flex items-center gap-1 rounded px-2 py-0.5"
            style={{ background: 'rgba(255,255,255,0.05)' }}>
            <span className="text-[8px]" style={{ color: 'rgba(255,255,255,0.3)', fontFamily: 'Geist Mono, monospace' }}>
              app.buildrs.fr
            </span>
          </div>
        </div>

        {/* Content — mobile: features list */}
        <div className="flex flex-col px-5 pt-5 pb-4" style={{ height: mobileHeight - 28 }}>
          <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 14 }}>Inclus dans le dashboard</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              'Le système complet en 4 phases',
              'Générateurs IA intégrés',
              'Dashboard de pilotage',
              'Ressources Claude + Communauté',
            ].map((item) => (
              <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 18, height: 18, borderRadius: 5, background: 'rgba(34,197,94,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '0.5px solid rgba(34,197,94,0.25)' }}>
                  <Check size={10} color="#22c55e" strokeWidth={2.5} />
                </div>
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', fontWeight: 500 }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── DashboardPreviewV2 — Cockpit 4-onglets ────────────────────────────────────

const V2_TABS = ['Dashboard', 'Explorer', 'Construire', 'Monétiser'] as const
type V2Tab = typeof V2_TABS[number]

const V2_CHECKLIST = [
  { label: 'Idée trouvée',       status: 'done'        },
  { label: 'Idée validée',       status: 'done'        },
  { label: 'Offre structurée',   status: 'done'        },
  { label: 'MVP déployé',        status: 'done'        },
  { label: 'Premiers clients',   status: 'done'        },
  { label: 'Monétisation active',status: 'in_progress' },
]

const SPARKLINE_BARS = [8, 14, 12, 21, 28, 35, 47]

function V2Sidebar() {
  return (
    <div
      className="flex flex-col shrink-0 h-full"
      style={{ width: 200, borderRight: '0.5px solid rgba(255,255,255,0.07)', background: '#0a0b0e' }}
    >
      {/* Mon SaaS IA */}
      <div className="px-3 pt-3 pb-2.5" style={{ borderBottom: '0.5px solid rgba(255,255,255,0.06)' }}>
        <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.10em', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginBottom: 6 }}>
          Mon SaaS IA
        </p>
        <p style={{ fontSize: 13, fontWeight: 600, color: '#fafafa', marginBottom: 4 }}>PriceFlow</p>
        <span style={{
          display: 'inline-block', fontSize: 9, fontWeight: 600,
          background: 'rgba(99,102,241,0.15)', color: '#818cf8',
          border: '0.5px solid rgba(99,102,241,0.3)',
          borderRadius: 20, padding: '2px 7px', marginBottom: 7,
        }}>
          Phase : Lancement
        </span>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
          <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)' }}>Score viabilité</span>
          <span style={{ fontSize: 10, fontWeight: 700, color: '#22c55e' }}>78%</span>
        </div>
        <div style={{ height: 3, borderRadius: 99, background: 'rgba(255,255,255,0.06)' }}>
          <div style={{ height: '100%', width: '78%', borderRadius: 99, background: '#22c55e' }} />
        </div>
      </div>

      {/* Progression projet */}
      <div className="flex-1 px-3 py-2.5 overflow-hidden">
        <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.10em', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginBottom: 8 }}>
          Progression projet
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {V2_CHECKLIST.map(({ label, status }) => {
            const isDone = status === 'done'
            const isInProgress = status === 'in_progress'
            const isLocked = status === 'locked'
            return (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                {/* Indicator */}
                {isDone && (
                  <div style={{ width: 14, height: 14, borderRadius: 99, background: 'rgba(34,197,94,0.15)', border: '0.5px solid rgba(34,197,94,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>
                  </div>
                )}
                {isInProgress && (
                  <div style={{ width: 14, height: 14, borderRadius: 99, background: 'rgba(234,179,8,0.15)', border: '0.5px solid rgba(234,179,8,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <div style={{ width: 5, height: 5, borderRadius: 99, background: '#eab308' }} />
                  </div>
                )}
                {isLocked && (
                  <div style={{ width: 14, height: 14, borderRadius: 99, background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="6" height="6" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="2.5" strokeLinecap="round"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>
                  </div>
                )}
                <span style={{ fontSize: 10, color: isDone ? '#fafafa' : isInProgress ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.25)', fontWeight: isDone || isInProgress ? 500 : 400 }}>
                  {label}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Accordéons Outils / Communauté */}
      <div style={{ borderTop: '0.5px solid rgba(255,255,255,0.06)', padding: '8px 12px' }}>
        {['Outils', 'Communauté'].map(item => (
          <div key={item} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '5px 0', cursor: 'default' }}>
            <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)' }}>{item}</span>
            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2.5" strokeLinecap="round"><path d="M6 9l6 6 6-6"/></svg>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{ borderTop: '0.5px solid rgba(255,255,255,0.06)', padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 7 }}>
        <div style={{ width: 20, height: 20, borderRadius: 99, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <span style={{ fontSize: 9, fontWeight: 700, color: '#fff' }}>A</span>
        </div>
        <div>
          <p style={{ fontSize: 10, fontWeight: 600, color: '#fafafa' }}>Alfred</p>
          <p style={{ fontSize: 8, color: 'rgba(255,255,255,0.35)' }}>Pro</p>
        </div>
      </div>
    </div>
  )
}

// ── Animated counter ─────────────────────────────────────────────────────────

function AnimatedValue({ target, suffix = '', duration = 1400 }: { target: number; suffix?: string; duration?: number }) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    const start = performance.now()
    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setVal(Math.round(eased * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    const raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [target, duration])
  return <>{val.toLocaleString('fr-FR')}{suffix}</>
}

function V2CockpitContent() {
  const maxBar = Math.max(...SPARKLINE_BARS)
  const metrics = [
    { label: 'Visiteurs', target: 1247, suffix: '',  sub: '+18% cette semaine', color: '#4d96ff' },
    { label: 'Signups',   target: 38,   suffix: '',  sub: '+5 nouveaux',        color: '#22c55e' },
    { label: 'MRR',       target: 340,  suffix: ' €',sub: '+60€ ce mois',       color: '#eab308' },
  ]
  return (
    <div className="flex-1 overflow-hidden" style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10, minWidth: 0 }}>
      {/* Header */}
      <div>
        <p style={{ fontSize: 15, fontWeight: 700, color: '#fafafa', marginBottom: 2 }}>Bon retour, Alfred</p>
        <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>Voici où en est ton projet aujourd'hui</p>
      </div>

      {/* Row 1 — Progression globale */}
      <div style={{ background: '#111113', border: '0.5px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '10px 12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 7 }}>
          <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.09em', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' }}>Progression globale</p>
          <span style={{ fontSize: 9, fontWeight: 600, background: 'rgba(34,197,94,0.12)', color: '#22c55e', border: '0.5px solid rgba(34,197,94,0.3)', borderRadius: 20, padding: '1px 7px' }}>Phase : Lancement</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ flex: 1, height: 4, borderRadius: 99, background: 'rgba(255,255,255,0.06)' }}>
            <div style={{ height: '100%', width: '83%', borderRadius: 99, background: 'linear-gradient(90deg,#22c55e,#4d96ff)' }} />
          </div>
          <span style={{ fontSize: 10, fontWeight: 700, color: '#fafafa', flexShrink: 0 }}>83%</span>
          <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', flexShrink: 0 }}>5/6 étapes</span>
        </div>
      </div>

      {/* Row 2 — Prochaine action */}
      <div style={{ background: '#111113', border: '0.5px solid rgba(234,179,8,0.25)', borderRadius: 10, padding: '10px 12px', display: 'flex', alignItems: 'flex-start', gap: 8 }}>
        <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(234,179,8,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#eab308" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 3 }}>Prochaine action</p>
          <p style={{ fontSize: 11, fontWeight: 600, color: '#fafafa', marginBottom: 5 }}>Activer ta première campagne Meta Ads</p>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 9, fontWeight: 600, color: '#eab308', cursor: 'default' }}>
            Ouvrir le générateur
            <svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="#eab308" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </div>
        </div>
      </div>

      {/* Row 3 — Métriques SaaS animées */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 7 }}>
        {metrics.map(({ label, target, suffix, sub, color }) => (
          <div key={label} style={{ background: '#111113', border: `0.5px solid ${color}22`, borderRadius: 10, padding: '8px 10px' }}>
            <p style={{ fontSize: 8, color: 'rgba(255,255,255,0.3)', marginBottom: 3, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase' }}>{label}</p>
            <p style={{ fontSize: 16, fontWeight: 700, color, marginBottom: 1, letterSpacing: '-0.02em' }}>
              <AnimatedValue target={target} suffix={suffix} />
            </p>
            <p style={{ fontSize: 8, color: 'rgba(255,255,255,0.35)' }}>{sub}</p>
          </div>
        ))}
      </div>

      {/* Row 4 — Sparkline trafic */}
      <div style={{ background: '#111113', border: '0.5px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '10px 12px', flex: 1, minHeight: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' }}>
            Trafic — 7 derniers jours
          </p>
          <span style={{ fontSize: 9, fontWeight: 700, color: '#22c55e' }}>+47% ↑</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 28 }}>
          {SPARKLINE_BARS.map((v, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                height: `${Math.round((v / maxBar) * 100)}%`,
                borderRadius: 3,
                background: i === SPARKLINE_BARS.length - 1
                  ? 'linear-gradient(180deg,#22c55e,#4d96ff)'
                  : `rgba(77,150,255,${0.15 + (i / SPARKLINE_BARS.length) * 0.35})`,
                minHeight: 3,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function V2ExplorerContent() {
  const ideas = [
    { name: 'FactureAI', niche: 'Compta IA', score: 91, est: '1 800 €/mois' },
    { name: 'SchedulrPro', niche: 'Planning SaaS', score: 87, est: '1 200 €/mois' },
    { name: 'SupportBot', niche: 'Support IA', score: 84, est: '900 €/mois' },
  ]
  return (
    <div style={{ flex: 1, overflow: 'hidden', padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10, minWidth: 0 }}>
      <div>
        <p style={{ fontSize: 15, fontWeight: 700, color: '#fafafa', marginBottom: 2 }}>Marketplace d'idées</p>
        <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>Projets validés — score de viabilité IA</p>
      </div>
      {ideas.map(({ name, niche, score, est }) => (
        <div key={name} style={{ background: '#111113', border: '0.5px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '10px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontSize: 12, fontWeight: 600, color: '#fafafa', marginBottom: 3 }}>{name}</p>
            <span style={{ fontSize: 9, fontWeight: 600, background: 'rgba(99,102,241,0.12)', color: '#818cf8', border: '0.5px solid rgba(99,102,241,0.25)', borderRadius: 20, padding: '1px 7px' }}>{niche}</span>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: '#22c55e', marginBottom: 1 }}>{score}/100</p>
            <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)' }}>~{est}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

function V2ConstruireContent() {
  const tools = [
    { label: 'Générateur de prompts', sub: '50+ prompts testés prêts à copier', color: '#6366f1' },
    { label: 'Architecte de stack', sub: 'Claude Code + Supabase + Vercel', color: '#22c55e' },
    { label: 'Validateur de MVP', sub: 'Score de viabilité + retours IA', color: '#f97316' },
    { label: 'Estimateur de revenus', sub: 'MRR potentiel selon ta niche', color: '#eab308' },
  ]
  return (
    <div style={{ flex: 1, overflow: 'hidden', padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10, minWidth: 0 }}>
      <div>
        <p style={{ fontSize: 15, fontWeight: 700, color: '#fafafa', marginBottom: 2 }}>Outils de construction</p>
        <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>Générateurs IA intégrés au cockpit</p>
      </div>
      {tools.map(({ label, sub, color }) => (
        <div key={label} style={{ background: '#111113', border: '0.5px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 8, height: 8, borderRadius: 2, background: color, flexShrink: 0 }} />
          <div>
            <p style={{ fontSize: 12, fontWeight: 600, color: '#fafafa', marginBottom: 2 }}>{label}</p>
            <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)' }}>{sub}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

function V2MonetiserContent() {
  const plans = [
    { name: 'Solo', price: '9 €/mois', users: '1 utilisateur', highlight: false },
    { name: 'Pro', price: '29 €/mois', users: '5 utilisateurs', highlight: true },
    { name: 'Team', price: '79 €/mois', users: 'Illimité', highlight: false },
  ]
  return (
    <div style={{ flex: 1, overflow: 'hidden', padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10, minWidth: 0 }}>
      <div>
        <p style={{ fontSize: 15, fontWeight: 700, color: '#fafafa', marginBottom: 2 }}>Stratégie de prix</p>
        <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>Modèle recommandé pour PriceFlow</p>
      </div>
      {plans.map(({ name, price, users, highlight }) => (
        <div key={name} style={{ background: highlight ? 'rgba(99,102,241,0.1)' : '#111113', border: `0.5px solid ${highlight ? 'rgba(99,102,241,0.35)' : 'rgba(255,255,255,0.08)'}`, borderRadius: 10, padding: '10px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontSize: 12, fontWeight: 600, color: '#fafafa', marginBottom: 2 }}>{name}</p>
            <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)' }}>{users}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: highlight ? '#818cf8' : '#fafafa' }}>{price}</p>
            {highlight && <span style={{ fontSize: 8, fontWeight: 700, color: '#818cf8', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Recommandé</span>}
          </div>
        </div>
      ))}
    </div>
  )
}

function V2TabContent({ tab }: { tab: V2Tab }) {
  if (tab === 'Explorer')   return <V2ExplorerContent />
  if (tab === 'Construire') return <V2ConstruireContent />
  if (tab === 'Monétiser')  return <V2MonetiserContent />
  return <V2CockpitContent />
}

const CHROME_H = 36
const TABBAR_H = 28
const SCALE    = 0.50

export function DashboardPreviewV2({ windowHeight = 560, mobileHeight = 340 }: {
  windowHeight?: number
  mobileHeight?: number
}) {
  const [activeTab, setActiveTab] = useState<V2Tab>('Dashboard')

  const TabBar = ({ mobile = false }: { mobile?: boolean }) => (
    <div style={{
      display: 'flex', alignItems: 'center', gap: mobile ? 0 : 2,
      padding: mobile ? '0 8px' : '0 16px',
      background: '#0a0b0e',
      borderBottom: '0.5px solid rgba(255,255,255,0.07)',
      overflowX: 'auto', scrollbarWidth: 'none' as const,
    }}>
      {V2_TABS.map((label) => {
        const isActive = label === activeTab
        return (
          <button
            key={label}
            onClick={() => setActiveTab(label)}
            style={{
              padding: mobile ? '5px 10px' : '7px 14px',
              fontSize: mobile ? 9 : 11,
              fontWeight: isActive ? 600 : 500,
              color: isActive ? '#fafafa' : 'rgba(255,255,255,0.3)',
              borderBottom: isActive ? '1.5px solid #6366f1' : '1.5px solid transparent',
              cursor: 'pointer',
              background: 'none',
              border: 'none',
              borderBottomWidth: '1.5px',
              borderBottomStyle: 'solid',
              borderBottomColor: isActive ? '#6366f1' : 'transparent',
              whiteSpace: 'nowrap',
              flexShrink: 0,
              outline: 'none',
            }}
          >
            {label}
          </button>
        )
      })}
    </div>
  )

  const ChromeBar = ({ mobile = false }: { mobile?: boolean }) => (
    <div
      style={{
        display: 'flex', alignItems: 'center',
        gap: mobile ? 4 : 6,
        padding: mobile ? '0 10px' : '0 12px',
        height: CHROME_H,
        background: '#0a0b0e',
        borderBottom: '0.5px solid rgba(255,255,255,0.07)',
        flexShrink: 0,
      }}
    >
      {(['#ef4444', '#eab308', '#22c55e'] as const).map(c => (
        <div key={c} style={{ width: mobile ? 7 : 10, height: mobile ? 7 : 10, borderRadius: 99, background: c, flexShrink: 0 }} />
      ))}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(255,255,255,0.05)', border: '0.5px solid rgba(255,255,255,0.08)', borderRadius: 6, padding: '3px 10px' }}>
          <div style={{ width: 5, height: 5, borderRadius: 99, background: '#22c55e', flexShrink: 0 }} />
          <span style={{ fontSize: mobile ? 7 : 10, color: 'rgba(255,255,255,0.35)', fontFamily: 'Geist Mono, monospace' }}>
            app.buildrs.fr/dashboard
          </span>
        </div>
      </div>
    </div>
  )

  return (
    <div className="w-full select-none">

      {/* ── Desktop window ── */}
      <div className="hidden sm:block w-full" style={{ perspective: '1400px' }}>
        <div
          className="relative w-full overflow-hidden rounded-2xl"
          style={{
            border: '1px solid rgba(255,255,255,0.08)',
            background: '#09090b',
            height: windowHeight,
            transform: 'rotateX(3deg) rotateY(-1deg)',
            boxShadow: '0 40px 80px rgba(0,0,0,0.6)',
          }}
        >
          <ChromeBar />
          <TabBar />
          <div className="flex" style={{ height: windowHeight - CHROME_H - TABBAR_H }}>
            <V2Sidebar />
            <V2TabContent tab={activeTab} />
          </div>
        </div>
      </div>

      {/* ── Mobile window ── */}
      <div className="sm:hidden w-full overflow-hidden rounded-xl"
        style={{
          border: '1px solid rgba(255,255,255,0.08)',
          background: '#09090b',
          height: mobileHeight,
          boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
        }}
      >
        <ChromeBar mobile />
        <TabBar mobile />

        {/* Scaled full layout — same as desktop */}
        <div style={{ position: 'relative', height: mobileHeight - CHROME_H - TABBAR_H, overflow: 'hidden' }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: `${100 / SCALE}%`,
            height: `${100 / SCALE}%`,
            transform: `scale(${SCALE})`,
            transformOrigin: 'top left',
            display: 'flex',
          }}>
            <V2Sidebar />
            <V2TabContent tab={activeTab} />
          </div>
        </div>
      </div>

    </div>
  )
}
