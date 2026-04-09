import { useState, useEffect } from 'react'
import {
  Check, ArrowRight, Paperclip, Globe, Code2, Mic,
  Terminal, Database, Server, Mail, CreditCard, Github,
  Zap, Play, Bot, Sparkles,
} from 'lucide-react'
import { supabase } from '../../lib/supabase'
import type { AccessContext } from '../../hooks/useAccess'
import type { BuildrsProfile } from '../../hooks/useProfile'
import { CURRICULUM } from '../../data/curriculum'
import { getXPProgress, getLevelInfo } from '../../data/levels'
import { useMilestones } from '../../hooks/useMilestones'
import { useMissions } from '../../hooks/useMissions'
import { MissionCard } from './MissionCard'
import { ScoreModal } from './ScoreModal'
import type { MissionId } from '../../hooks/useMissions'

// ── V3 Countdown ────────────────────────────────────────────────────────────

const V3_TARGET = new Date('2026-04-07T00:00:00+02:00').getTime()

function computeV3Time() {
  const diff = V3_TARGET - Date.now()
  if (diff <= 0) return null
  return {
    days:  Math.floor(diff / 86_400_000),
    hours: Math.floor((diff % 86_400_000) / 3_600_000),
    mins:  Math.floor((diff % 3_600_000) / 60_000),
    secs:  Math.floor((diff % 60_000) / 1_000),
  }
}

function useV3Countdown() {
  const [time, setTime] = useState(computeV3Time)
  useEffect(() => {
    const id = setInterval(() => setTime(computeV3Time()), 1_000)
    return () => clearInterval(id)
  }, [])
  return time
}

const V3_FEATURES = [
  { Icon: Bot,      label: 'Tous les agents déployés' },
  { Icon: Terminal, label: 'Plugin Claude Code' },
  { Icon: Play,     label: 'Modules vidéo inclus' },
  { Icon: Sparkles, label: 'Modules de génération IA' },
]

function V3AnnouncementBlock() {
  const time = useV3Countdown()
  if (!time) return null

  const pad = (n: number) => String(n).padStart(2, '0')

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ background: 'hsl(var(--foreground))', border: '1px solid rgba(139,92,246,0.35)' }}
    >
      {/* Top bar */}
      <div
        className="flex items-center gap-2.5 px-5 py-2.5"
        style={{ background: 'rgba(139,92,246,0.08)', borderBottom: '1px solid rgba(139,92,246,0.15)' }}
      >
        <Zap size={11} strokeWidth={2} style={{ color: '#a78bfa' }} />
        <span className="text-[9px] font-bold uppercase tracking-[0.14em]" style={{ color: '#a78bfa' }}>
          V3 — 07 Avril 2026 · 00h00
        </span>

        {/* Live countdown */}
        <div className="ml-auto flex items-center gap-1.5">
          {time.days > 0 && (
            <span
              className="text-[11px] font-extrabold tabular-nums"
              style={{ color: 'hsl(var(--background) / 0.85)', letterSpacing: '-0.02em' }}
            >
              {time.days}j
            </span>
          )}
          <span
            className="text-[11px] font-extrabold tabular-nums"
            style={{ color: 'hsl(var(--background) / 0.85)', letterSpacing: '-0.02em' }}
          >
            {pad(time.hours)}h{pad(time.mins)}m{pad(time.secs)}s
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="px-5 py-4">
        <h3
          className="text-[15px] font-extrabold mb-1"
          style={{ letterSpacing: '-0.03em', color: 'hsl(var(--background))' }}
        >
          La V3 arrive. Et ça change tout.
        </h3>
        <p className="text-[12px] mb-4 leading-relaxed" style={{ color: 'hsl(var(--background) / 0.6)' }}>
          Tous les agents déployés, branchés directement dans Claude Code. Plus les vidéos et les modules de génération IA.
        </p>

        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          {V3_FEATURES.map(({ Icon, label }) => (
            <div key={label} className="flex items-center gap-2">
              <Icon size={11} strokeWidth={1.5} style={{ color: '#8b5cf6' }} />
              <span className="text-[11px]" style={{ color: 'hsl(var(--background) / 0.65)' }}>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Types ──────────────────────────────────────────────────────────────────

interface StackStatus {
  claude: boolean; supabase: boolean; vercel: boolean
  resend: boolean; hostinger: boolean; stripe: boolean; github: boolean
}

const DEFAULT_STACK: StackStatus = {
  claude: false, supabase: false, vercel: false,
  resend: false, hostinger: false, stripe: false, github: false,
}

const STACK_ITEMS: { key: keyof StackStatus; label: string; Icon: React.ComponentType<{ size?: number; strokeWidth?: number }> }[] = [
  { key: 'claude',    label: 'Claude Code', Icon: Terminal  },
  { key: 'supabase',  label: 'Supabase',    Icon: Database  },
  { key: 'vercel',    label: 'Vercel',      Icon: Globe     },
  { key: 'resend',    label: 'Resend',      Icon: Mail      },
  { key: 'hostinger', label: 'Hostinger',   Icon: Server    },
  { key: 'stripe',    label: 'Stripe',      Icon: CreditCard },
  { key: 'github',    label: 'GitHub',      Icon: Github    },
]

interface DailyIdea { id: string; slug: string; title: string; difficulty: number }

// ── RobotJarvis ────────────────────────────────────────────────────────────

function RobotJarvis({ size = 28 }: { size?: number }) {
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

// ── Contextual Jarvis messages ────────────────────────────────────────────

function getJarvisMessage(missionId: MissionId | null, allCompleted: boolean): string {
  if (allCompleted || !missionId) return 'Ton environnement est prêt. Sur quoi tu veux bosser aujourd\'hui ?'
  switch (missionId) {
    case 'profile':        return 'Commence par te présenter. Dis-moi ton objectif et je t\'accompagne pas à pas.'
    case 'community':      return 'Rejoins la communauté. Un premier post — victoire, idée ou question. Je suis là si tu bloques.'
    case 'environment':    return 'Ton environnement est à configurer. Quel outil tu veux ouvrir en premier ?'
    case 'find_idea':      return 'On cherche ton idée de SaaS ? Décris-moi ce qui t\'intéresse, ou explore la marketplace.'
    case 'create_project': return 'Crée ton premier projet. Donne-lui un nom et je l\'analyse avec toi.'
    case 'validate':       return 'Ton projet est créé. Décris-le moi et je te donne un score de viabilité 0-100.'
    default:               return 'Bonjour ! Je suis Jarvis, ton copilote IA. Dis-moi où tu en es.'
  }
}

// ── Checklist groups ──────────────────────────────────────────────────────

const CHECKLIST_GROUPS = [
  { label: 'Trouver & Valider',    ids: ['00', 'setup', '01', 'valider'] },
  { label: 'Préparer & Designer',  ids: ['offre', '02'] },
  { label: 'Construire',           ids: ['03', '04'] },
  { label: 'Déployer & Monétiser', ids: ['05', '06', 'scaler'] },
]

function getGroupStatus(ids: string[], moduleProgress: (id: string, total: number) => number): 'done' | 'in_progress' | 'pending' {
  const percents = ids.map(id => {
    const mod = CURRICULUM.find(m => m.id === id)
    return mod ? moduleProgress(id, mod.lessons.length) : 0
  })
  const done = percents.filter(p => p === 100).length
  if (done === percents.length) return 'done'
  if (done > 0 || percents.some(p => p > 0)) return 'in_progress'
  return 'pending'
}

// ── Props ─────────────────────────────────────────────────────────────────

interface Props {
  navigate: (hash: string) => void
  userId: string | undefined
  userFirstName?: string
  globalPercent: number
  moduleProgress: (id: string, total: number) => number
  hasPack?: boolean
  access?: AccessContext
  profile?: BuildrsProfile | null
}

// ── Component ─────────────────────────────────────────────────────────────

export function HomePage({
  navigate, userId, userFirstName, moduleProgress,
  hasPack: _hasPack = false, access, profile,
}: Props) {
  const [validatorScore, setValidatorScore] = useState<string | null>(null)
  const [mrrEstimate,    setMrrEstimate]    = useState<string | null>(null)
  const [stack,          setStack]          = useState<StackStatus>(DEFAULT_STACK)
  const [dailyIdea,      setDailyIdea]      = useState<DailyIdea | null>(null)
  const [loading,        setLoading]        = useState(true)
  const [scoreModalOpen, setScoreModalOpen] = useState(false)
  const [jarvisInput,    setJarvisInput]    = useState('')

  const { milestones } = useMilestones(userId)
  const missions       = useMissions(userId, access)
  const doneCount      = milestones.filter(m => m.kanban_status === 'done').length

  useEffect(() => {
    if (!userId) { setLoading(false); return }
    Promise.all([
      supabase.auth.getUser(),
      supabase.from('saas_ideas').select('id,slug,title,difficulty').limit(30),
    ]).then(([{ data: authData }, { data: ideasData }]) => {
      const meta = authData.user?.user_metadata ?? {}
      if (meta.buildrs_validator_score != null) setValidatorScore(String(meta.buildrs_validator_score))
      if (meta.buildrs_mrr_estimate)            setMrrEstimate(meta.buildrs_mrr_estimate)
      if (meta.buildrs_stack)                   setStack(meta.buildrs_stack)
      if (ideasData && ideasData.length > 0)    setDailyIdea(ideasData[new Date().getDate() % ideasData.length] as DailyIdea)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [userId])

  const toggleStack = async (key: keyof StackStatus) => {
    const updated = { ...stack, [key]: !stack[key] }
    setStack(updated)
    await supabase.auth.updateUser({ data: { buildrs_stack: updated } })
  }

  const handleJarvis = (msg?: string) => {
    const text = msg ?? jarvisInput.trim()
    if (text) sessionStorage.setItem('jarvis_prefill', text)
    setJarvisInput('')
    navigate('#/dashboard/autopilot')
  }

  const xp        = profile?.xp_points ?? 0
  const xpInfo    = getXPProgress(xp)
  const levelMeta = getLevelInfo(xpInfo.level)
  const name      = userFirstName || 'toi'

  const allModuleIds  = CHECKLIST_GROUPS.flatMap(g => g.ids)
  const completedMods = allModuleIds.filter(id => {
    const mod = CURRICULUM.find(m => m.id === id)
    return mod && moduleProgress(id, mod.lessons.length) === 100
  }).length

  if (loading || missions.loading) return (
    <div className="flex-1 flex items-center justify-center">
      <div className="w-5 h-5 rounded-full border-2 border-foreground/20 border-t-foreground animate-spin" />
    </div>
  )

  const currentMissionId = missions.currentDef?.id ?? null
  const jarvisMessage    = getJarvisMessage(currentMissionId, missions.allCompleted)

  // ── Header ──────────────────────────────────────────────────────────────
  const Header = (
    <div>
      <div className="flex items-center gap-2 mb-0.5">
        <h1
          className="text-2xl font-extrabold text-foreground tracking-tight leading-tight"
          style={{ letterSpacing: '-0.03em' }}
        >
          Salut, {name}
        </h1>
        {profile && (
          <span
            className="text-[9px] font-bold px-2 py-0.5 rounded-full"
            style={{
              background: `${levelMeta.color}20`,
              color: levelMeta.color,
              border: `1px solid ${levelMeta.color}40`,
            }}
          >
            {xpInfo.label.toUpperCase()}
          </span>
        )}
      </div>
      <p className="text-sm text-muted-foreground">Prêt à propulser ton projet ?</p>
      {profile && (
        <div className="mt-2.5 flex items-center gap-2">
          <div className="flex-1 h-1.5 rounded-full bg-border overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${xpInfo.percent}%`,
                background: `linear-gradient(90deg, ${levelMeta.color}, ${levelMeta.color}99)`,
              }}
            />
          </div>
          <span className="text-[10px] text-muted-foreground/60 tabular-nums flex-shrink-0">{xp} XP</span>
        </div>
      )}
    </div>
  )

  // ── Mission section ──────────────────────────────────────────────────────
  const MissionSection = missions.allCompleted ? (
    <div className="border border-border rounded-xl p-4 bg-card">
      <div className="flex items-center justify-between mb-3">
        <p className="text-[9.5px] font-bold uppercase tracking-[0.08em] text-muted-foreground/60">Missions</p>
        <span
          className="text-[8px] font-bold px-1.5 py-0.5 rounded"
          style={{ background: 'rgba(34,197,94,0.12)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.25)' }}
        >
          TOUTES COMPLÉTÉES
        </span>
      </div>
      <div className="flex items-center gap-0.5">
        {missions.adaptedDefs.map((def, i) => (
          <div key={def.id} className="flex items-center flex-1">
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: '#22c55e' }}
            >
              <Check size={9} strokeWidth={2.5} className="text-white" />
            </div>
            {i < missions.adaptedDefs.length - 1 && (
              <div className="flex-1 h-px" style={{ background: 'rgba(34,197,94,0.3)' }} />
            )}
          </div>
        ))}
      </div>
    </div>
  ) : missions.currentDef ? (
    <MissionCard
      currentDef={missions.currentDef}
      currentIndex={missions.currentIndex}
      progress={missions.progress}
      total={missions.adaptedDefs.length}
      defs={missions.adaptedDefs}
      completedIds={new Set(missions.missions.filter(m => m.completed).map(m => m.mission_id))}
      navigate={navigate}
    />
  ) : null

  // ── Metrics row ──────────────────────────────────────────────────────────
  const MetricsRow = (
    <div className="grid grid-cols-3 gap-3">
      <div className="border border-border rounded-xl p-4 text-center bg-card">
        <p
          className="text-[22px] font-extrabold text-foreground tabular-nums leading-none"
          style={{ letterSpacing: '-0.04em' }}
        >
          {completedMods}/{allModuleIds.length}
        </p>
        <p className="text-[9px] font-bold uppercase tracking-[0.08em] text-muted-foreground/60 mt-2">Modules</p>
      </div>

      <div className="border border-border rounded-xl p-4 text-center bg-card">
        <p
          className="text-[22px] font-extrabold text-foreground tabular-nums leading-none"
          style={{ letterSpacing: '-0.04em' }}
        >
          {doneCount}
        </p>
        <p className="text-[9px] font-bold uppercase tracking-[0.08em] text-muted-foreground/60 mt-2">Tâches</p>
      </div>

      <button
        onClick={() => setScoreModalOpen(true)}
        className="border border-border rounded-xl p-4 text-center bg-card hover:border-foreground/20 transition-colors"
      >
        {validatorScore ? (
          <p
            className="text-[22px] font-extrabold tabular-nums leading-none"
            style={{
              letterSpacing: '-0.04em',
              color: Number(validatorScore) >= 70 ? '#22c55e' : Number(validatorScore) >= 45 ? '#eab308' : '#ef4444',
            }}
          >
            {validatorScore}
          </p>
        ) : (
          <p
            className="text-[22px] font-extrabold text-muted-foreground/30 tabular-nums leading-none"
            style={{ letterSpacing: '-0.04em' }}
          >
            —
          </p>
        )}
        <p className="text-[9px] font-bold uppercase tracking-[0.08em] text-muted-foreground/60 mt-2">Score</p>
      </button>
    </div>
  )

  // ── Jarvis block ─────────────────────────────────────────────────────────
  const JarvisBlock = (
    <div className="border border-border rounded-xl overflow-hidden bg-card">
      {/* Header */}
      <div className="flex items-center gap-2.5 px-4 pt-4 pb-3">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.2)' }}
        >
          <RobotJarvis size={22} />
        </div>
        <span className="text-[13px] font-bold" style={{ color: '#8b5cf6' }}>Jarvis</span>
        <span
          className="ml-auto text-[8px] font-bold px-1.5 py-0.5 rounded"
          style={{ background: 'rgba(34,197,94,0.12)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.25)' }}
        >
          EN LIGNE
        </span>
      </div>

      {/* Message */}
      <div className="px-4 pb-4">
        <p className="text-[13px] text-foreground leading-relaxed">
          {jarvisMessage}
        </p>
      </div>

      {/* Input */}
      <div className="mx-4 mb-4 border border-border rounded-xl overflow-hidden">
        <textarea
          value={jarvisInput}
          onChange={e => setJarvisInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleJarvis() }
          }}
          placeholder="Parle à Jarvis..."
          rows={2}
          className="w-full px-4 py-3 bg-secondary/30 text-sm text-foreground placeholder:text-muted-foreground/40 outline-none resize-none"
        />
        <div className="flex items-center gap-1.5 px-3 py-2 border-t border-border bg-secondary/20">
          <button
            type="button"
            className="p-1.5 rounded-lg text-muted-foreground/50 hover:text-muted-foreground hover:bg-secondary transition-colors"
          >
            <Paperclip size={13} strokeWidth={1.5} />
          </button>
          <button
            type="button"
            className="p-1.5 rounded-lg text-muted-foreground/50 hover:text-muted-foreground hover:bg-secondary transition-colors"
          >
            <Globe size={13} strokeWidth={1.5} />
          </button>
          <button
            type="button"
            className="p-1.5 rounded-lg text-muted-foreground/50 hover:text-muted-foreground hover:bg-secondary transition-colors"
          >
            <Code2 size={13} strokeWidth={1.5} />
          </button>
          <button
            type="button"
            onClick={() => handleJarvis()}
            className="ml-auto w-8 h-8 rounded-full flex items-center justify-center transition-opacity hover:opacity-85"
            style={{ background: '#6366f1' }}
          >
            <Mic size={14} strokeWidth={2} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  )

  // ── Checklist ────────────────────────────────────────────────────────────
  const Checklist = (
    <div className="border border-border rounded-xl p-4 bg-card">
      <p className="text-[9.5px] font-bold uppercase tracking-[0.08em] text-muted-foreground/60 mb-3">
        Checklist en cours
      </p>
      <div className="flex flex-col gap-1">
        {CHECKLIST_GROUPS.map(({ label, ids }) => {
          const status = getGroupStatus(ids, moduleProgress)
          const firstPending = ids.find(id => {
            const mod = CURRICULUM.find(m => m.id === id)
            return mod && moduleProgress(id, mod.lessons.length) < 100
          })
          return (
            <button
              key={label}
              onClick={() => navigate(firstPending ? `#/dashboard/module/${firstPending}` : '#/dashboard/module/00')}
              className={`flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-lg transition-colors ${
                status === 'in_progress'
                  ? 'bg-secondary/60'
                  : 'hover:bg-secondary/40'
              }`}
            >
              {/* Status dot */}
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 border"
                style={
                  status === 'done'
                    ? { background: '#22c55e', borderColor: '#22c55e' }
                    : status === 'in_progress'
                      ? { background: 'transparent', borderColor: 'hsl(var(--foreground) / 0.3)' }
                      : { background: 'transparent', borderColor: 'hsl(var(--border))' }
                }
              >
                {status === 'done' && <Check size={10} strokeWidth={2.5} className="text-white" />}
                {status === 'in_progress' && (
                  <div className="w-2 h-2 rounded-full" style={{ background: 'hsl(var(--foreground) / 0.5)' }} />
                )}
              </div>

              {/* Label */}
              <span
                className={`text-[13px] flex-1 ${
                  status === 'done'
                    ? 'line-through text-muted-foreground/35'
                    : status === 'in_progress'
                      ? 'text-foreground font-semibold'
                      : 'text-muted-foreground'
                }`}
              >
                {label}
              </span>

              {/* Badge */}
              {status === 'in_progress' && (
                <span
                  className="text-[8px] font-bold px-1.5 py-0.5 rounded flex-shrink-0"
                  style={{ background: 'rgba(234,179,8,0.15)', color: '#eab308', border: '1px solid rgba(234,179,8,0.3)' }}
                >
                  EN COURS
                </span>
              )}
              {status === 'pending' && (
                <ArrowRight size={11} strokeWidth={1.5} className="text-muted-foreground/30 flex-shrink-0" />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )

  // ── Sidebar ──────────────────────────────────────────────────────────────
  const SidebarContent = (
    <div className="flex flex-col gap-3">
      {/* Score */}
      <div className="border border-border rounded-xl p-4 bg-card">
        <p className="text-[9px] font-bold uppercase tracking-[0.09em] text-muted-foreground mb-2">
          Score de viabilité
        </p>
        {validatorScore ? (
          <>
            <p
              className="text-foreground tabular-nums font-extrabold"
              style={{ fontSize: 36, letterSpacing: '-0.04em', lineHeight: 1 }}
            >
              {validatorScore}
            </p>
            <p className="text-[10px] text-muted-foreground mt-1.5">
              {Number(validatorScore) >= 70
                ? 'Idée fortement validée'
                : Number(validatorScore) >= 45
                  ? 'Idée prometteuse'
                  : 'À affiner'}
            </p>
          </>
        ) : (
          <button
            onClick={() => handleJarvis('Je veux valider mon idée SaaS')}
            className="text-[11px] text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2 text-left"
          >
            Valider ton idée →
          </button>
        )}
      </div>

      {/* Stack */}
      <div className="border border-border rounded-xl p-4 bg-card">
        <p className="text-[9px] font-bold uppercase tracking-[0.09em] text-muted-foreground mb-3">Stack</p>
        <div className="flex flex-col gap-2">
          {STACK_ITEMS.map(({ key, label, Icon }) => (
            <button
              key={key}
              onClick={() => toggleStack(key)}
              className="flex items-center justify-between w-full group"
            >
              <div className="flex items-center gap-1.5">
                <Icon size={10} strokeWidth={1.5} className="text-muted-foreground" />
                <span className="text-[11px] text-muted-foreground group-hover:text-foreground transition-colors">
                  {label}
                </span>
              </div>
              <span
                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ background: stack[key] ? '#22c55e' : 'hsl(var(--border))' }}
              />
            </button>
          ))}
        </div>
      </div>

      {/* MRR */}
      <div className="border border-border rounded-xl p-4 bg-card">
        <p className="text-[9px] font-bold uppercase tracking-[0.09em] text-muted-foreground mb-2">MRR estimé</p>
        {mrrEstimate ? (
          <>
            <p className="text-foreground font-extrabold" style={{ fontSize: 20, letterSpacing: '-0.04em' }}>
              {mrrEstimate}
            </p>
            <p className="text-[10px] text-muted-foreground mt-1">Modèle abonnement</p>
          </>
        ) : (
          <button
            onClick={() => handleJarvis('Calcule mon MRR estimé')}
            className="text-[11px] text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2 text-left"
          >
            Calculer →
          </button>
        )}
      </div>
    </div>
  )

  // ── Extra blocks (Mode B only) ────────────────────────────────────────────
  const ExtraBlocks = (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {dailyIdea && (
        <button
          onClick={() => navigate(`#/dashboard/marketplace/${dailyIdea!.slug}`)}
          className="group text-left border border-border rounded-xl p-4 bg-card hover:border-foreground/25 transition-all"
        >
          <p className="text-[9.5px] font-bold uppercase tracking-[0.08em] text-muted-foreground/60 mb-2">Idée du jour</p>
          <p className="text-[13px] font-semibold text-foreground leading-snug mb-3 line-clamp-2">
            {dailyIdea!.title}
          </p>
          <div className="flex items-center gap-1 text-[10px] font-medium text-muted-foreground group-hover:text-foreground transition-colors">
            Explorer <ArrowRight size={9} strokeWidth={2} />
          </div>
        </button>
      )}
      <button
        onClick={() => navigate('#/dashboard/community')}
        className="group text-left border border-border rounded-xl p-4 bg-card hover:border-foreground/25 transition-all"
      >
        <p className="text-[9.5px] font-bold uppercase tracking-[0.08em] text-muted-foreground/60 mb-2">Feed communauté</p>
        <p className="text-[13px] font-semibold text-foreground leading-snug mb-3">
          Voir ce que builden les autres
        </p>
        <div className="flex items-center gap-1 text-[10px] font-medium text-muted-foreground group-hover:text-foreground transition-colors">
          Voir le feed <ArrowRight size={9} strokeWidth={2} />
        </div>
      </button>
    </div>
  )

  // ── Layout ───────────────────────────────────────────────────────────────
  return (
    <div className="max-w-5xl mx-auto px-4 py-6">

      <div className="flex gap-5 items-start">

        {/* ── Main column ── */}
        <div className="flex-1 min-w-0 flex flex-col gap-5">
          {Header}
          <V3AnnouncementBlock />
          {MissionSection}
          {MetricsRow}
          {JarvisBlock}
          {Checklist}
          {missions.allCompleted && ExtraBlocks}
        </div>

        {/* ── Sidebar — desktop ── */}
        <div className="hidden lg:block w-[220px] flex-shrink-0">
          {SidebarContent}
        </div>

      </div>

      {/* ── Sidebar — mobile (stacks below) ── */}
      <div className="lg:hidden mt-5">
        {SidebarContent}
      </div>

      <ScoreModal userId={userId} open={scoreModalOpen} onClose={() => setScoreModalOpen(false)} />
    </div>
  )
}
