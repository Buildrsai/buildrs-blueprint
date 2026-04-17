import { useState, useEffect, useCallback, useRef } from 'react'
import {
  Layers, Search, Palette, Building2, Hammer, Rocket, DollarSign,
  FolderOpen, Wrench, Zap, ChevronDown, Settings, Bot, Lock,
  RefreshCw, Home, LayoutGrid, TrendingUp, Users, MessageSquare,
  ShoppingBag, Star, CheckCircle, Tag, Target, Sparkles,
  LogOut, Calendar, ArrowUpRight,
} from 'lucide-react'
import { BuildrsIcon, WhatsAppIcon, ClaudeIcon } from '../ui/icons'
import { UserAvatarWithFallback } from '../ui/UserAvatar'

// ── V3 countdown ──────────────────────────────────────────────────────────────
const V3_UNLOCK = new Date('2026-04-07T00:00:00+02:00').getTime()

function computeV3Label(): string {
  const diff = V3_UNLOCK - Date.now()
  if (diff <= 0) return 'V3 Bientôt'
  const days  = Math.floor(diff / 86_400_000)
  const hours = Math.floor((diff % 86_400_000) / 3_600_000)
  const mins  = Math.floor((diff % 3_600_000) / 60_000)
  if (days > 0) return `V3 · ${days}j${hours}h`
  if (hours > 0) return `V3 · ${hours}h${String(mins).padStart(2,'0')}`
  return `V3 · ${mins}min`
}

function useV3Countdown() {
  const [label, setLabel] = useState(computeV3Label)
  useEffect(() => {
    const id = setInterval(() => setLabel(computeV3Label()), 60_000)
    return () => clearInterval(id)
  }, [])
  return label
}
import { CURRICULUM } from '../../data/curriculum'
import type { AccessContext } from '../../hooks/useAccess'
import type { BuildrsProfile } from '../../hooks/useProfile'
import { getXPProgress } from '../../data/levels'

// ── Ordered display config for MON PARCOURS (11 modules, num = display label) ──
const SIDEBAR_MODULES = [
  { id: '00',      num: '00' },
  { id: 'setup',   num: '01' },
  { id: '01',      num: '02' },
  { id: 'valider', num: '03' },
  { id: 'offre',   num: '04' },
  { id: '02',      num: '05' },
  { id: '03',      num: '06' },
  { id: '04',      num: '07' },
  { id: '05',      num: '08' },
  { id: '06',      num: '09' },
  { id: 'scaler',  num: '10' },
]

const MODULE_ICONS: Record<string, React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>> = {
  '00': Layers, 'setup': Settings, '01': Search, '02': Palette, '03': Building2,
  '04': Hammer, '05': Rocket, '06': DollarSign,
  'valider': CheckCircle, 'offre': Tag, 'scaler': TrendingUp,
}


interface Props {
  currentPath: string
  navigate: (hash: string) => void
  globalPercent: number
  moduleProgress: (id: string, total: number) => number
  journalCount: number
  isDark: boolean
  onToggleDark: () => void
  hasPack?: boolean
  access?: AccessContext
  contentRows?: { brick_id: string; completed: boolean }[]
  onRequestPurchase?: (slug: string) => void
  profile?: BuildrsProfile | null
  userEmail?: string
  userFirstName?: string
  userAvatarUrl?: string
  onSignOut?: () => void
}

function getActiveIdeaName(): string | null {
  try { return JSON.parse(localStorage.getItem('buildrs_active_idea') ?? 'null')?.name ?? null } catch { return null }
}

function useSectionOpen(key: string, def = false) {
  const storageKey = `sidebar_${key}`
  const [open, setOpen] = useState<boolean>(() => {
    try { return JSON.parse(localStorage.getItem(storageKey) ?? String(def)) } catch { return def }
  })
  const toggle = () => setOpen(o => {
    localStorage.setItem(storageKey, String(!o))
    return !o
  })
  return [open, toggle] as const
}

// ── UserProfile widget ────────────────────────────────────────────────────────

function getInitials(name?: string, email?: string): string {
  if (name) {
    const parts = name.trim().split(/\s+/)
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    return parts[0].slice(0, 2).toUpperCase()
  }
  if (email) return email.slice(0, 2).toUpperCase()
  return '?'
}

function UserProfileWidget({
  userEmail, userFirstName, userAvatarUrl, onSignOut, navigate, profile,
}: {
  userEmail?: string
  userFirstName?: string
  userAvatarUrl?: string
  onSignOut?: () => void
  navigate: (hash: string) => void
  profile?: BuildrsProfile | null
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const displayName = userFirstName || userEmail?.split('@')[0] || 'Mon compte'
  const initials = getInitials(userFirstName, userEmail)

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  return (
    <div ref={ref} className="relative">

      {/* Popover */}
      {open && (
        <div
          className="absolute bottom-full left-0 mb-2 w-[252px] rounded-2xl overflow-hidden z-50"
          style={{
            background: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            boxShadow: '0 -8px 32px rgba(0,0,0,0.12), 0 0 0 0.5px hsl(var(--border))',
          }}
        >
          {/* ── Identité ── */}
          <div className="px-4 py-3.5 border-b border-border">
            <div className="flex items-center gap-3">
              <UserAvatarWithFallback avatarUrl={userAvatarUrl} firstName={userFirstName} email={userEmail} size={36} />
              <div className="min-w-0">
                <p className="text-[13px] font-semibold text-foreground leading-tight truncate">{displayName}</p>
                {userEmail && (
                  <p className="text-[11px] text-muted-foreground truncate">{userEmail}</p>
                )}
              </div>
            </div>
          </div>

          {/* ── Actions rapides ── */}
          <div className="px-2 py-1.5 border-b border-border">
            <a
              href="https://wa.me/33744755735"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 w-full text-left px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors"
            >
              <WhatsAppIcon size={13} className="flex-shrink-0" />
              <span className="text-[12px] font-medium flex-1">WhatsApp Buildrs</span>
              <ArrowUpRight size={11} strokeWidth={1.5} className="flex-shrink-0 opacity-40" />
            </a>
            <a
              href="https://cal.com/team-buildrs/secret"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 w-full text-left px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors"
            >
              <Calendar size={13} strokeWidth={1.5} className="flex-shrink-0" />
              <span className="text-[12px] font-medium flex-1">Prendre RDV avec l'équipe</span>
              <ArrowUpRight size={11} strokeWidth={1.5} className="flex-shrink-0 opacity-40" />
            </a>
            <button
              onClick={() => { setOpen(false); navigate('#/dashboard/settings') }}
              className="flex items-center gap-2.5 w-full text-left px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors"
            >
              <Settings size={13} strokeWidth={1.5} className="flex-shrink-0" />
              <span className="text-[12px] font-medium flex-1">Paramètres</span>
            </button>
          </div>

          {/* ── Passer à l'action ── */}
          <div className="px-3 py-2.5 border-b border-border flex flex-col gap-2">
            <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-muted-foreground/50 px-1">Aller plus vite avec l'équipe</p>

            {/* Sprint */}
            <button
              onClick={() => { setOpen(false); navigate('#/dashboard/offers') }}
              className="group w-full text-left rounded-xl p-3 transition-all hover:border-foreground/20"
              style={{ background: 'hsl(var(--secondary) / 0.5)', border: '1px solid hsl(var(--border))' }}
            >
              <div className="mb-1">
                <span
                  className="text-[8.5px] font-bold uppercase tracking-[0.1em] px-1.5 py-0.5 rounded"
                  style={{ background: 'rgba(77,150,255,0.15)', color: '#4d96ff', border: '1px solid rgba(77,150,255,0.3)' }}
                >
                  Sprint 72h
                </span>
              </div>
              <p className="text-[11px] font-semibold text-foreground leading-snug">Délègue ton MVP à Buildrs</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">MVP livré en 72h · Landing · GitHub</p>
            </button>

            {/* Cohorte */}
            <button
              onClick={() => { setOpen(false); navigate('#/dashboard/offers') }}
              className="group w-full text-left rounded-xl p-3 transition-all hover:border-foreground/20"
              style={{ background: 'hsl(var(--secondary) / 0.5)', border: '1px solid hsl(var(--border))' }}
            >
              <div className="mb-1">
                <span
                  className="text-[8.5px] font-bold uppercase tracking-[0.1em] px-1.5 py-0.5 rounded"
                  style={{ background: 'rgba(139,92,246,0.15)', color: '#8b5cf6', border: '1px solid rgba(139,92,246,0.3)' }}
                >
                  Cohorte 60j
                </span>
              </div>
              <p className="text-[11px] font-semibold text-foreground leading-snug">Construis avec l'équipe Buildrs</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">4 sessions live/semaine · 12 places max</p>
            </button>
          </div>

          {/* ── Déconnexion ── */}
          <div className="px-2 py-1.5">
            <button
              onClick={() => { setOpen(false); onSignOut?.() }}
              className="flex items-center gap-2.5 w-full text-left px-3 py-2 rounded-lg transition-colors hover:bg-secondary/60"
              style={{ color: '#ef4444' }}
            >
              <LogOut size={13} strokeWidth={1.5} className="flex-shrink-0" />
              <span className="text-[12px] font-medium">Se déconnecter</span>
            </button>
          </div>
        </div>
      )}

      {/* ── Trigger strip ── */}
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl transition-all hover:bg-secondary/60 group"
        style={{
          background: open ? 'hsl(var(--secondary))' : 'transparent',
          border: `1px solid ${open ? 'hsl(var(--border))' : 'transparent'}`,
        }}
      >
        <UserAvatarWithFallback avatarUrl={userAvatarUrl} firstName={userFirstName} email={userEmail} size={28} />
        <div className="flex-1 min-w-0 text-left">
          <p className="text-[12px] font-semibold text-foreground truncate leading-tight">{displayName}</p>
          <p className="text-[9.5px] text-muted-foreground truncate leading-tight">Buildrs Blueprint</p>
        </div>
        <ChevronDown
          size={11} strokeWidth={2}
          className="text-muted-foreground/40 flex-shrink-0 transition-transform duration-200"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
        />
      </button>
    </div>
  )
}

export function Sidebar({
  currentPath, navigate, globalPercent, moduleProgress, isDark, onToggleDark,
  hasPack = false, access, contentRows = [], onRequestPurchase, profile,
  userEmail, userFirstName, userAvatarUrl, onSignOut,
}: Props) {
  // Sections
  const [parcoursOpen, toggleParcours] = useSectionOpen('parcours', true)
  const [projetOpen,  toggleProjet]  = useSectionOpen('projet',   false)

  const v3Label = useV3Countdown()
  const [activeIdeaName, setActiveIdeaName] = useState<string | null>(() => getActiveIdeaName())

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<{ name: string }>).detail
      setActiveIdeaName(detail?.name ?? null)
    }
    window.addEventListener('buildrs:active-idea', handler)
    return () => window.removeEventListener('buildrs:active-idea', handler)
  }, [])

  const isActive = (hash: string) => currentPath === hash
  const isPrefix = (prefix: string) => currentPath.startsWith(prefix)

  const xpInfo = profile ? getXPProgress(profile.xp_points) : null

  // ── Reusable nav button ───────────────────────────────────────────────────
  const navItem = (
    hash: string,
    label: string,
    Icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>,
    opts?: { badge?: React.ReactNode; locked?: boolean; onClickOverride?: () => void }
  ) => {
    const active = isActive(hash)
    return (
      <button
        key={hash}
        onClick={opts?.onClickOverride ?? (() => navigate(hash))}
        className={`flex items-center gap-2.5 w-full text-left px-3 py-[7px] rounded-lg transition-all duration-150 ${
          active ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
        }`}
      >
        <Icon size={13} strokeWidth={1.5} className="flex-shrink-0" />
        <span className="text-[12px] font-medium flex-1 truncate tracking-[-0.01em]">{label}</span>
        {opts?.badge}
        {opts?.locked && <Lock size={10} strokeWidth={1.5} className="text-muted-foreground/40 flex-shrink-0" />}
      </button>
    )
  }

  // ── Collapsible section header ────────────────────────────────────────────
  const sectionHeader = (
    label: string,
    isOpen: boolean,
    onToggle: () => void,
    opts?: { icon?: React.ReactNode; sublabel?: string }
  ) => (
    <button
      onClick={onToggle}
      className="flex items-center justify-between w-full px-1 mb-1.5 group"
    >
      <div className="flex items-center gap-1.5 min-w-0">
        {opts?.icon && (
          <span className="text-muted-foreground/50 flex-shrink-0 group-hover:text-muted-foreground transition-colors">
            {opts.icon}
          </span>
        )}
        <p className="text-[9.5px] font-bold uppercase tracking-[0.08em] text-muted-foreground/60 group-hover:text-muted-foreground transition-colors whitespace-nowrap">
          {label}
        </p>
        {opts?.sublabel && (
          <span className="text-[9px] text-muted-foreground/40 truncate">— {opts.sublabel}</span>
        )}
      </div>
      <ChevronDown
        size={10} strokeWidth={2}
        className="text-muted-foreground/40 transition-transform duration-200 flex-shrink-0"
        style={{ transform: isOpen ? 'rotate(0deg)' : 'rotate(-90deg)' }}
      />
    </button>
  )

  // ── Static (non-collapsible) section label ────────────────────────────────
  const staticLabel = (label: string, icon?: React.ReactNode) => (
    <div className="flex items-center gap-1.5 px-1 mb-1.5">
      {icon && <span className="text-muted-foreground/50 flex-shrink-0">{icon}</span>}
      <p className="text-[9.5px] font-bold uppercase tracking-[0.08em] text-muted-foreground/60">
        {label}
      </p>
    </div>
  )

  // ── Progress badge helper ─────────────────────────────────────────────────
  const progressBadge = (done: number, total: number) => (
    <span className="text-[8px] font-bold tabular-nums flex-shrink-0 px-1.5 py-0.5 rounded"
      style={{
        background: done > 0 ? 'rgba(34,197,94,0.12)' : 'hsl(var(--secondary))',
        color: done > 0 ? '#22c55e' : 'hsl(var(--muted-foreground) / 0.5)',
        border: `1px solid ${done > 0 ? 'rgba(34,197,94,0.25)' : 'transparent'}`,
      }}>
      {done}/{total}
    </span>
  )

  // ── V3 locked item ──────────────────────────────────────────────────────────
  const v3Item = useCallback((
    label: string,
    Icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>
  ) => (
    <div
      key={label}
      className="flex items-center gap-2.5 w-full text-left px-3 py-[7px] rounded-lg cursor-not-allowed select-none"
      style={{ opacity: 0.4 }}
    >
      <Icon size={13} strokeWidth={1.5} className="flex-shrink-0" />
      <span className="text-[12px] font-medium flex-1 truncate tracking-[-0.01em]">{label}</span>
      <span
        className="text-[7.5px] font-bold px-1.5 py-0.5 rounded flex-shrink-0 tabular-nums"
        style={{ background: 'rgba(139,92,246,0.12)', color: '#8b5cf6', border: '1px solid rgba(139,92,246,0.25)', whiteSpace: 'nowrap' }}
      >
        {v3Label}
      </span>
      <Lock size={9} strokeWidth={1.5} className="flex-shrink-0 text-muted-foreground" />
    </div>
  ), [v3Label])

  // ── CTA dynamique ─────────────────────────────────────────────────────────
  const renderCTA = () => (
    <button
      onClick={() => navigate('#/dashboard/offers')}
      className="text-[10px] text-muted-foreground/45 hover:text-muted-foreground transition-colors text-center py-0.5"
    >
      Sprint &amp; Cohorte avec Alfred →
    </button>
  )

  return (
    <div className="hidden lg:flex w-[220px] border-r border-border flex-col flex-shrink-0 bg-background">

      {/* ── Logo ── */}
      <div className="flex items-center px-4 h-[52px] border-b border-border flex-shrink-0">
        <button
          onClick={() => navigate('#/dashboard')}
          className="flex items-center gap-2 hover:opacity-75 transition-opacity"
        >
          <BuildrsIcon color={isDark ? '#fafafa' : '#09090b'} size={18} />
          <span className="font-extrabold text-[14px] text-foreground" style={{ letterSpacing: '-0.04em' }}>Buildrs</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0">
      {/* ── XP / Niveau bar ── */}
      {xpInfo ? (
        <div className="px-4 py-3 border-b border-border">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5">
              <Star size={10} strokeWidth={1.5} className="text-muted-foreground" />
              <span className="text-[10px] font-bold uppercase tracking-[0.06em] text-muted-foreground">{xpInfo.label}</span>
            </div>
            <span className="text-[10px] font-extrabold text-foreground tabular-nums" style={{ letterSpacing: '-0.02em' }}>
              {profile!.xp_points} XP
            </span>
          </div>
          <div className="h-[3px] rounded-full bg-border overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${xpInfo.percent}%`, background: 'linear-gradient(90deg, #4d96ff, #8b5cf6)' }}
            />
          </div>
        </div>
      ) : (
        <div className="px-4 py-3.5 border-b border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">Progression</span>
            <span className="text-[11px] font-extrabold text-foreground tabular-nums" style={{ letterSpacing: '-0.02em' }}>{globalPercent}%</span>
          </div>
          <div className="h-[3px] rounded-full bg-border overflow-hidden">
            <div className="h-full rounded-full bg-foreground transition-all duration-500" style={{ width: `${Math.max(globalPercent, 2)}%` }} />
          </div>
        </div>
      )}

      {/* ── Accueil — bouton sans label section ────────────────────────────── */}
      <div className="px-3 pt-4 pb-1 flex flex-col gap-0.5">
        <button
          onClick={() => navigate('#/dashboard')}
          className={`flex items-center gap-2.5 w-full text-left px-3 py-[7px] rounded-lg transition-all duration-150 ${
            isActive('#/dashboard') ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
          }`}
        >
          <Home size={13} strokeWidth={1.5} className="flex-shrink-0" />
          <span className="text-[12px] font-medium flex-1 tracking-[-0.01em]">Accueil</span>
        </button>
        <button
          onClick={() => navigate('#/dashboard/claude-os')}
          className={`flex items-center gap-2.5 w-full text-left px-3 py-[7px] rounded-lg transition-all duration-150 ${
            isPrefix('#/dashboard/claude-os') ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
          }`}
        >
          <ClaudeIcon size={13} strokeWidth={1.5} className="flex-shrink-0" />
          <span className="text-[12px] font-medium flex-1 tracking-[-0.01em]">Claude OS</span>
        </button>
      </div>

      {/* ── 1. MON PARCOURS ─ ouvert par défaut, pliable ─────────────────── */}
      <div className="px-3 pt-2 pb-1">
        {sectionHeader('Mon Parcours', parcoursOpen, toggleParcours)}
        {parcoursOpen && <div className="flex flex-col gap-0.5">
          {SIDEBAR_MODULES.map(({ id, num }) => {
            const mod = CURRICULUM.find(m => m.id === id)
            if (!mod) return null
            const Icon = MODULE_ICONS[id] ?? Layers
            const active = isPrefix(`#/dashboard/module/${id}`)
            const pct = moduleProgress(id, mod.lessons.length)
            const done = pct === 100
            const inProgress = pct > 0 && pct < 100
            return (
              <button
                key={id}
                onClick={() => navigate(`#/dashboard/module/${id}`)}
                className={`flex items-center gap-2 w-full text-left px-2.5 py-[6px] rounded-lg transition-all duration-150 ${
                  active ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
                }`}
              >
                <span
                  className="text-[8px] font-black tabular-nums flex-shrink-0 rounded px-1 py-px leading-none"
                  style={{
                    background: active
                      ? 'hsl(var(--background) / 0.25)'
                      : done
                        ? 'rgba(34,197,94,0.15)'
                        : inProgress
                          ? 'hsl(var(--foreground) / 0.08)'
                          : 'hsl(var(--border))',
                    color: active ? 'hsl(var(--background))' : done ? '#22c55e' : 'hsl(var(--muted-foreground))',
                  }}
                >
                  {num}
                </span>
                <Icon size={10} strokeWidth={1.5} className="flex-shrink-0" />
                <span className="text-[11px] font-medium flex-1 truncate tracking-[-0.01em]">{mod.title}</span>
                {done && <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#22c55e' }} />}
                {inProgress && !active && <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'hsl(var(--foreground) / 0.35)' }} />}
              </button>
            )
          })}

          {/* ── Bonus : 100 premiers users ─────────────────────────────────── */}
          {(() => {
            const active = isPrefix('#/dashboard/acquisition-bonus')
            return (
              <button
                onClick={() => navigate('#/dashboard/acquisition-bonus')}
                className={`flex items-center gap-2 w-full text-left px-2.5 py-[6px] rounded-lg transition-all duration-150 ${
                  active ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
                }`}
              >
                <Target size={10} strokeWidth={1.5} className="flex-shrink-0" />
                <span className="text-[11px] font-medium flex-1 truncate tracking-[-0.01em]">100 premiers users</span>
                <span
                  className="text-[7px] font-bold px-1.5 py-0.5 rounded flex-shrink-0"
                  style={{
                    background: active ? 'rgba(245,158,11,0.25)' : 'rgba(245,158,11,0.12)',
                    color: active ? '#fff' : '#f59e0b',
                    border: '1px solid rgba(245,158,11,0.3)',
                  }}
                >
                  BONUS
                </span>
              </button>
            )
          })()}
        </div>}
      </div>

      {/* ── 2. MON SAAS IA ─ fermé par défaut ─────────────────────────────── */}
      <div className="px-3 pt-3 pb-1">
        {sectionHeader('Mon SaaS IA', projetOpen, toggleProjet, { sublabel: activeIdeaName?.slice(0, 18) ?? undefined })}
        {projetOpen && (
          <div className="flex flex-col gap-0.5">
            {navItem('#/dashboard/project', 'Fiche projet', FolderOpen)}
            {navItem('#/dashboard/kanban',  'Mon Pipeline', LayoutGrid)}
          </div>
        )}
      </div>

      {/* ── Pages libres bas ────────────────────────────────────────────────── */}
      <div className="px-3 pt-3 pb-2 flex flex-col gap-0.5">
        {v3Item('Agents IA', Bot)}
        <button
          onClick={() => navigate('#/dashboard/generateur-ia')}
          className={`flex items-center gap-2.5 w-full text-left px-3 py-[7px] rounded-lg transition-all duration-150 ${
            isActive('#/dashboard/generateur-ia') ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
          }`}
        >
          <Sparkles size={13} strokeWidth={1.5} className="flex-shrink-0" />
          <span className="text-[12px] font-medium flex-1 tracking-[-0.01em]">Générateurs IA</span>
        </button>
        <button
          onClick={() => navigate('#/dashboard/marketplace')}
          className={`flex items-center gap-2.5 w-full text-left px-3 py-[7px] rounded-lg transition-all duration-150 ${
            isActive('#/dashboard/marketplace') ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
          }`}
        >
          <ShoppingBag size={13} strokeWidth={1.5} className="flex-shrink-0" />
          <span className="text-[12px] font-medium flex-1 tracking-[-0.01em]">Marketplace</span>
        </button>
        <button
          onClick={() => navigate('#/dashboard/tools')}
          className={`flex items-center gap-2.5 w-full text-left px-3 py-[7px] rounded-lg transition-all duration-150 ${
            isActive('#/dashboard/tools') ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
          }`}
        >
          <Wrench size={13} strokeWidth={1.5} className="flex-shrink-0" />
          <span className="text-[12px] font-medium flex-1 tracking-[-0.01em]">Mes outils IA</span>
        </button>
        <button
          onClick={() => navigate('#/dashboard/community')}
          className={`flex items-center gap-2.5 w-full text-left px-3 py-[7px] rounded-lg transition-all duration-150 ${
            isPrefix('#/dashboard/community') ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
          }`}
        >
          <Users size={13} strokeWidth={1.5} className="flex-shrink-0" />
          <span className="text-[12px] font-medium flex-1 tracking-[-0.01em]">Communauté</span>
        </button>
        <a
          href="https://wa.me/33744755735"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2.5 w-full text-left px-3 py-[7px] rounded-lg transition-all duration-150 text-muted-foreground hover:text-foreground hover:bg-secondary/60"
        >
          <WhatsAppIcon size={13} className="flex-shrink-0" />
          <span className="text-[12px] font-medium flex-1 tracking-[-0.01em]">WhatsApp Privé</span>
        </a>
      </div>
      </div>{/* end scrollable nav */}

      {/* ── User profile widget ── */}
      <div className="mt-auto px-3 pb-3 pt-2 border-t border-border">
        <UserProfileWidget
          userEmail={userEmail}
          userFirstName={userFirstName}
          userAvatarUrl={userAvatarUrl}
          onSignOut={onSignOut}
          navigate={navigate}
          profile={profile}
        />
      </div>

    </div>
  )
}
