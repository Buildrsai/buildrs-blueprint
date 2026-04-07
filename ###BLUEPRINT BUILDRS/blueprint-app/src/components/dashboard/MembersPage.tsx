import { useState, useEffect, useMemo } from 'react'
import { Users, Star, LayoutGrid, BarChart2, Zap } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { getLevelInfo, type BuildrsLevel } from '../../data/levels'
import { BuilderAvatar } from '../ui/BuilderAvatar'
import { BuildrsIcon } from '../ui/icons'

// ── Types ─────────────────────────────────────────────────────────────────────
interface MemberProfile {
  id: string
  display_name: string | null
  level: BuildrsLevel
  xp_points: number
  project_name?: string | null
  stage?: string | null
}

// ── Podium data (Buildrs team) ────────────────────────────────────────────────
const PODIUM = [
  { rank: 1, name: 'Alfred & Jarvis', level: 'scaler' as BuildrsLevel, xp: 1850, accent: '#fbbf24', project: 'Buildrs' },
  { rank: 2, name: 'Chris',           level: 'scaler' as BuildrsLevel, xp: 1200, accent: '#94a3b8', project: 'DataPulse' },
  { rank: 3, name: 'Tim',             level: 'scaler' as BuildrsLevel, xp: 1420, accent: '#d97706', project: 'InvoiceFlow AI' },
]

const LEVEL_ORDER: Record<string, number> = { scaler: 4, launcher: 3, builder: 2, explorer: 1 }

const STAGE_LABELS: Record<string, string> = {
  idea: "A l'idée", exploring: 'En exploration',
  building: 'En construction', launched: 'Lancé', scaling: 'En scaling',
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function RankBadge({ rank }: { rank: number }) {
  const colors: Record<number, { bg: string; text: string; label: string }> = {
    1: { bg: '#fbbf2418', text: '#fbbf24', label: '1' },
    2: { bg: '#94a3b818', text: '#94a3b8', label: '2' },
    3: { bg: '#d9770618', text: '#d97706', label: '3' },
  }
  const style = colors[rank] ?? { bg: 'transparent', text: 'hsl(var(--muted-foreground))', label: String(rank) }
  return (
    <div
      className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold"
      style={{ background: style.bg, color: style.text, border: `1px solid ${style.text}33` }}
    >
      {style.label}
    </div>
  )
}

// ── Podium card ───────────────────────────────────────────────────────────────
function PodiumCard({
  member, isFirst,
}: {
  member: typeof PODIUM[number]
  isFirst: boolean
}) {
  const lvlInfo = getLevelInfo(member.level)
  const isAlfred = member.name === 'Alfred & Jarvis'

  return (
    <div
      className={`relative flex flex-col items-center rounded-2xl px-4 transition-all ${isFirst ? 'py-6' : 'py-4'}`}
      style={{
        border:     `1px solid ${member.accent}40`,
        background: `${member.accent}08`,
        minWidth:   isFirst ? 160 : 132,
      }}
    >
      {/* Rank number */}
      <div
        className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-extrabold"
        style={{ background: member.accent, color: '#09090b' }}
      >
        {member.rank}
      </div>

      {/* Avatar */}
      <div className="relative mt-2 mb-2">
        <BuilderAvatar level={member.level} size={isFirst ? 52 : 40} />
        {isAlfred && (
          <div
            className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
            style={{ background: '#22c55e18', border: '1px solid #22c55e55' }}
          >
            <Zap size={10} strokeWidth={1.5} style={{ color: '#22c55e' }} />
          </div>
        )}
      </div>

      {/* Name */}
      <p className={`font-bold text-foreground text-center leading-tight mb-1 ${isFirst ? 'text-[13px]' : 'text-[11px]'}`}>
        {member.name}
      </p>

      {/* Level badge */}
      <span
        className="text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider mb-1.5"
        style={{ background: lvlInfo.color + '22', color: lvlInfo.color }}
      >
        {lvlInfo.label}
      </span>

      {/* XP */}
      <div className="flex items-center gap-0.5">
        <Star size={9} strokeWidth={1.5} style={{ color: member.accent }} />
        <span className="text-[10px] font-bold" style={{ color: member.accent }}>{member.xp} XP</span>
      </div>

      {/* Project */}
      {member.project && (
        <p className="text-[9px] text-muted-foreground/50 mt-0.5 truncate max-w-full">{member.project}</p>
      )}
    </div>
  )
}

// ── Leaderboard row ───────────────────────────────────────────────────────────
function LeaderboardRow({
  member, rank, isCurrentUser,
}: {
  member: MemberProfile | typeof PODIUM[number]
  rank: number
  isCurrentUser?: boolean
}) {
  const isPodium  = 'accent' in member
  const lvlInfo   = getLevelInfo(member.level)
  const name      = member.display_name ?? ('name' in member ? (member as any).name : 'Builder anonyme')
  const xp        = member.xp_points ?? ('xp' in member ? (member as any).xp : 0)
  const project   = (member as any).project_name ?? (member as any).project ?? null
  const accentCol = isPodium ? (member as any).accent : null

  return (
    <div
      className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-colors ${
        isCurrentUser
          ? 'border border-green-500/30 bg-green-500/5'
          : rank <= 3
          ? 'border border-transparent'
          : 'hover:bg-secondary/40'
      }`}
      style={rank <= 3 && accentCol ? { background: `${accentCol}06`, borderColor: `${accentCol}20` } : undefined}
    >
      <RankBadge rank={rank} />

      <BuilderAvatar level={member.level} size={28} />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[12px] font-semibold text-foreground truncate">{name}</span>
          {isCurrentUser && (
            <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: '#22c55e20', color: '#22c55e' }}>Toi</span>
          )}
        </div>
        {project && <p className="text-[10px] text-muted-foreground/50 truncate">{project}</p>}
      </div>

      <span
        className="text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wide flex-shrink-0"
        style={{ background: lvlInfo.color + '22', color: lvlInfo.color }}
      >
        {lvlInfo.label}
      </span>

      <div className="flex items-center gap-0.5 w-16 justify-end flex-shrink-0">
        <Star size={9} strokeWidth={1.5} className="text-muted-foreground/30" />
        <span className="text-[11px] font-bold text-foreground">{xp}</span>
        <span className="text-[9px] text-muted-foreground/40">XP</span>
      </div>
    </div>
  )
}

// ── Member card (grid view) ───────────────────────────────────────────────────
function MemberCard({ member }: { member: MemberProfile }) {
  const name    = member.display_name?.trim() || 'Builder anonyme'
  const lvlInfo = getLevelInfo(member.level)
  const stage   = member.stage ? STAGE_LABELS[member.stage] ?? member.stage : null

  return (
    <div className="border border-border rounded-xl p-4 hover:border-foreground/20 transition-colors bg-card">
      <div className="flex items-start gap-3">
        <BuilderAvatar level={member.level} size={40} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-foreground truncate">{name}</span>
            <span
              className="text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wide flex-shrink-0"
              style={{ background: lvlInfo.color + '22', color: lvlInfo.color }}
            >
              {lvlInfo.label}
            </span>
          </div>
          {member.project_name && (
            <p className="text-[11px] text-muted-foreground mt-0.5 truncate">{member.project_name}</p>
          )}
          <div className="flex items-center gap-3 mt-1.5">
            <div className="flex items-center gap-1">
              <Star size={10} strokeWidth={1.5} className="text-muted-foreground/40" />
              <span className="text-[10px] text-muted-foreground/60">{member.xp_points} XP</span>
            </div>
            {stage && <span className="text-[9px] text-muted-foreground/50">{stage}</span>}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
const PAGE_SIZE = 24

interface Props {
  navigate: (hash: string) => void
  userId?: string
}

export function MembersPage({ navigate: _navigate, userId }: Props) {
  const [members,  setMembers]  = useState<MemberProfile[]>([])
  const [total,    setTotal]    = useState(0)
  const [loading,  setLoading]  = useState(true)
  const [visible,  setVisible]  = useState(PAGE_SIZE)
  const [view,     setView]     = useState<'leaderboard' | 'grid'>('leaderboard')

  // Current user's display_name (to find their rank)
  const [currentUserDisplayName, setCurrentUserDisplayName] = useState<string | null>(null)

  useEffect(() => {
    ;(async () => {
      // Fetch current user display_name
      if (userId) {
        supabase
          .from('user_profiles_buildrs')
          .select('display_name')
          .eq('user_id', userId)
          .maybeSingle()
          .then(({ data }) => setCurrentUserDisplayName(data?.display_name ?? null))
      }

      const [{ data: realData }, { data: seedData }] = await Promise.all([
        supabase
          .from('user_profiles_buildrs')
          .select('user_id, display_name, level, xp_points, stage, project_idea'),
        supabase
          .from('seed_members')
          .select('id, display_name, level, xp_points, project_name, stage'),
      ])

      const real: MemberProfile[] = (realData ?? []).map((r: any) => ({
        id:           `real-${r.user_id}`,
        display_name: r.display_name,
        level:        r.level as BuildrsLevel,
        xp_points:    r.xp_points,
        project_name: r.project_idea,
        stage:        r.stage,
      }))

      const seeds: MemberProfile[] = (seedData ?? []).map((s: any) => ({
        id:           `seed-${s.id}`,
        display_name: s.display_name,
        level:        s.level as BuildrsLevel,
        xp_points:    s.xp_points,
        project_name: s.project_name || null,
        stage:        s.stage,
      }))

      const all = [...real, ...seeds].sort((a, b) => {
        if (b.xp_points !== a.xp_points) return b.xp_points - a.xp_points
        return (LEVEL_ORDER[b.level] ?? 0) - (LEVEL_ORDER[a.level] ?? 0)
      })

      setMembers(all)
      setTotal(all.length)
      setLoading(false)
    })()
  }, [userId])

  // Leaderboard: podium entries + fetched members (offset by 3)
  const leaderboardRows = useMemo(() => {
    return [
      ...PODIUM.map((p, i) => ({ ...p, _rankOverride: i + 1 })),
      ...members,
    ]
  }, [members])

  // Find current user's position in the combined leaderboard
  const currentUserRank = useMemo(() => {
    if (!currentUserDisplayName && !userId) return null
    const idx = leaderboardRows.findIndex(r => {
      const name = (r as any).display_name ?? (r as any).name ?? ''
      return name === currentUserDisplayName
    })
    return idx >= 0 ? idx + 1 : null
  }, [leaderboardRows, currentUserDisplayName, userId])

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">

      {/* ── Header ── */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight" style={{ letterSpacing: '-0.03em' }}>
            Membres
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {loading
              ? 'Chargement...'
              : `${total + PODIUM.length} builder${total + PODIUM.length > 1 ? 's' : ''} dans la communauté Buildrs`
            }
          </p>
        </div>
        {/* Toggle view */}
        <div className="flex items-center gap-1 border border-border rounded-lg p-1">
          <button
            onClick={() => setView('leaderboard')}
            className={`flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-md transition-colors ${
              view === 'leaderboard' ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <BarChart2 size={12} strokeWidth={1.5} />
            Classement
          </button>
          <button
            onClick={() => setView('grid')}
            className={`flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-md transition-colors ${
              view === 'grid' ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <LayoutGrid size={12} strokeWidth={1.5} />
            Grille
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-5 h-5 rounded-full border-2 border-foreground/20 border-t-foreground animate-spin" />
        </div>
      ) : view === 'leaderboard' ? (
        <>
          {/* ── PODIUM ── */}
          <div className="mb-8">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50 mb-4 text-center">
              Top 3 — Classement par XP
            </p>
            {/* Podium: 2nd left, 1st center, 3rd right */}
            <div className="flex items-end justify-center gap-3">
              {/* 2nd */}
              <div className="flex flex-col items-center" style={{ marginBottom: 0 }}>
                <PodiumCard member={PODIUM[1]} isFirst={false} />
                <div className="w-full h-10 rounded-b-lg mt-0.5" style={{ background: '#94a3b810', border: '1px solid #94a3b820' }} />
              </div>
              {/* 1st */}
              <div className="flex flex-col items-center" style={{ marginBottom: 0 }}>
                <PodiumCard member={PODIUM[0]} isFirst={true} />
                <div className="w-full h-16 rounded-b-lg mt-0.5" style={{ background: '#fbbf2410', border: '1px solid #fbbf2420' }} />
              </div>
              {/* 3rd */}
              <div className="flex flex-col items-center" style={{ marginBottom: 0 }}>
                <PodiumCard member={PODIUM[2]} isFirst={false} />
                <div className="w-full h-6 rounded-b-lg mt-0.5" style={{ background: '#d9770610', border: '1px solid #d9770620' }} />
              </div>
            </div>
          </div>

          {/* ── LEADERBOARD TABLE ── */}
          <div className="border border-border rounded-xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-2 border-b border-border bg-secondary/30">
              <div className="w-6" />
              <div className="w-7" />
              <span className="flex-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">Builder</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50 hidden sm:block">Niveau</span>
              <span className="w-16 text-right text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">XP</span>
            </div>

            {/* Podium rows (top 3) */}
            {PODIUM.map((p, i) => (
              <LeaderboardRow key={`podium-${p.rank}`} member={p as any} rank={i + 1} />
            ))}

            {/* Divider */}
            <div className="h-px bg-border mx-4" />

            {/* Rest of members */}
            {members.slice(0, visible).map((m, i) => {
              const rank = i + 4 // 1-3 are podium
              const isCurrentUser = !!userId && m.id.startsWith('real-') && !!currentUserDisplayName && m.display_name === currentUserDisplayName
              return (
                <LeaderboardRow
                  key={m.id}
                  member={m}
                  rank={rank}
                  isCurrentUser={isCurrentUser}
                />
              )
            })}

            {visible < members.length && (
              <div className="border-t border-border">
                <button
                  onClick={() => setVisible(v => v + PAGE_SIZE)}
                  className="w-full py-3 text-[12px] font-medium text-muted-foreground hover:text-foreground transition-colors hover:bg-secondary/30"
                >
                  Voir plus · {members.length - visible} builders restants
                </button>
              </div>
            )}
          </div>

          {/* Current user rank indicator */}
          {currentUserRank && currentUserRank > 3 && (
            <div
              className="mt-4 flex items-center gap-2 px-4 py-2.5 rounded-xl text-[12px]"
              style={{ background: '#22c55e08', border: '1px solid #22c55e25' }}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
              <span className="text-muted-foreground">Ta position dans le classement :</span>
              <span className="font-bold text-foreground">#{currentUserRank}</span>
            </div>
          )}
        </>
      ) : (
        /* ── GRID VIEW ── */
        members.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-border rounded-xl">
            <Users size={32} strokeWidth={1} className="text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm font-medium text-foreground mb-1">Répertoire des membres</p>
            <p className="text-xs text-muted-foreground">La communauté est en train de se constituer.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {members.slice(0, visible).map(m => (
                <MemberCard key={m.id} member={m} />
              ))}
            </div>
            {visible < members.length && (
              <button
                onClick={() => setVisible(v => v + PAGE_SIZE)}
                className="mt-6 w-full py-3 rounded-xl text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors border border-border hover:border-foreground/20"
              >
                Voir plus · {members.length - visible} builders restants
              </button>
            )}
          </>
        )
      )}
    </div>
  )
}
