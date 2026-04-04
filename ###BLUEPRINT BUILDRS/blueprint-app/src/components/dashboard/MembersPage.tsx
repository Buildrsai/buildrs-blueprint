import { useState, useEffect } from 'react'
import { Users, Star } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { getLevelInfo, type BuildrsLevel } from '../../data/levels'

interface MemberProfile {
  user_id: string
  display_name: string | null
  stage: string | null
  level: BuildrsLevel
  xp_points: number
  created_at: string
}

const STAGE_LABELS: Record<string, string> = {
  idea:      'A l\'idee',
  exploring: 'En exploration',
  building:  'En construction',
  launched:  'Lance',
}

function MemberCard({ member }: { member: MemberProfile }) {
  const name    = member.display_name?.trim() || 'Builder anonyme'
  const initial = name[0]?.toUpperCase() ?? 'B'
  const lvlInfo = getLevelInfo(member.level)
  const stage   = member.stage ? STAGE_LABELS[member.stage] ?? member.stage : null

  return (
    <div className="border border-border rounded-xl p-4 hover:border-foreground/20 transition-colors bg-card">
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold text-background"
          style={{ background: lvlInfo.color }}
        >
          {initial}
        </div>

        <div className="flex-1 min-w-0">
          {/* Name + level badge */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-foreground truncate">{name}</span>
            <span
              className="text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wide flex-shrink-0"
              style={{ background: lvlInfo.color + '20', color: lvlInfo.color }}
            >
              {lvlInfo.label}
            </span>
          </div>

          {/* Stage */}
          {stage && (
            <p className="text-xs text-muted-foreground mt-0.5">{stage}</p>
          )}

          {/* XP */}
          <div className="flex items-center gap-1 mt-1.5">
            <Star size={10} strokeWidth={1.5} className="text-muted-foreground/40" />
            <span className="text-[10px] text-muted-foreground/60">{member.xp_points} XP</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Fake builders (social proof) ─────────────────────────────────────────────
const MOCK_MEMBERS: MemberProfile[] = [
  // 5 × Builder (100–499 XP)
  { user_id: 'm-01', display_name: 'Thomas R.',    stage: 'building',  level: 'builder', xp_points: 280, created_at: '2026-03-01' },
  { user_id: 'm-02', display_name: 'Emma L.',      stage: 'launched',  level: 'builder', xp_points: 215, created_at: '2026-03-03' },
  { user_id: 'm-03', display_name: null,            stage: 'building',  level: 'builder', xp_points: 190, created_at: '2026-03-05' },
  { user_id: 'm-04', display_name: 'Hugo M.',      stage: 'building',  level: 'builder', xp_points: 155, created_at: '2026-03-07' },
  { user_id: 'm-05', display_name: null,            stage: 'exploring', level: 'builder', xp_points: 120, created_at: '2026-03-08' },
  // 25 × Explorateur (0–99 XP)
  { user_id: 'm-06', display_name: 'Léa D.',       stage: 'exploring', level: 'explorer', xp_points: 95, created_at: '2026-03-10' },
  { user_id: 'm-07', display_name: 'Maxime P.',    stage: 'idea',      level: 'explorer', xp_points: 85, created_at: '2026-03-10' },
  { user_id: 'm-08', display_name: null,            stage: 'exploring', level: 'explorer', xp_points: 80, created_at: '2026-03-11' },
  { user_id: 'm-09', display_name: 'Camille V.',   stage: 'building',  level: 'explorer', xp_points: 75, created_at: '2026-03-11' },
  { user_id: 'm-10', display_name: 'Antoine F.',   stage: 'exploring', level: 'explorer', xp_points: 70, created_at: '2026-03-12' },
  { user_id: 'm-11', display_name: null,            stage: 'idea',      level: 'explorer', xp_points: 65, created_at: '2026-03-12' },
  { user_id: 'm-12', display_name: 'Sarah B.',     stage: 'exploring', level: 'explorer', xp_points: 60, created_at: '2026-03-13' },
  { user_id: 'm-13', display_name: null,            stage: 'exploring', level: 'explorer', xp_points: 55, created_at: '2026-03-13' },
  { user_id: 'm-14', display_name: 'Julien C.',    stage: 'idea',      level: 'explorer', xp_points: 50, created_at: '2026-03-14' },
  { user_id: 'm-15', display_name: 'Marie T.',     stage: 'exploring', level: 'explorer', xp_points: 50, created_at: '2026-03-14' },
  { user_id: 'm-16', display_name: null,            stage: 'building',  level: 'explorer', xp_points: 45, created_at: '2026-03-15' },
  { user_id: 'm-17', display_name: 'Romain G.',    stage: 'exploring', level: 'explorer', xp_points: 40, created_at: '2026-03-16' },
  { user_id: 'm-18', display_name: null,            stage: 'idea',      level: 'explorer', xp_points: 35, created_at: '2026-03-17' },
  { user_id: 'm-19', display_name: 'Clara N.',     stage: 'exploring', level: 'explorer', xp_points: 35, created_at: '2026-03-17' },
  { user_id: 'm-20', display_name: 'Nicolas A.',   stage: 'idea',      level: 'explorer', xp_points: 30, created_at: '2026-03-18' },
  { user_id: 'm-21', display_name: null,            stage: 'exploring', level: 'explorer', xp_points: 25, created_at: '2026-03-19' },
  { user_id: 'm-22', display_name: 'Pauline H.',   stage: 'idea',      level: 'explorer', xp_points: 25, created_at: '2026-03-19' },
  { user_id: 'm-23', display_name: null,            stage: 'exploring', level: 'explorer', xp_points: 20, created_at: '2026-03-20' },
  { user_id: 'm-24', display_name: 'Alexis W.',    stage: 'idea',      level: 'explorer', xp_points: 20, created_at: '2026-03-20' },
  { user_id: 'm-25', display_name: null,            stage: 'exploring', level: 'explorer', xp_points: 15, created_at: '2026-03-21' },
  { user_id: 'm-26', display_name: 'Chloé S.',     stage: 'idea',      level: 'explorer', xp_points: 15, created_at: '2026-03-22' },
  { user_id: 'm-27', display_name: 'Baptiste K.',  stage: 'exploring', level: 'explorer', xp_points: 10, created_at: '2026-03-23' },
  { user_id: 'm-28', display_name: null,            stage: 'idea',      level: 'explorer', xp_points: 10, created_at: '2026-03-24' },
  { user_id: 'm-29', display_name: 'Laura M.',     stage: 'exploring', level: 'explorer', xp_points:  5, created_at: '2026-03-25' },
  { user_id: 'm-30', display_name: null,            stage: 'idea',      level: 'explorer', xp_points:  5, created_at: '2026-03-26' },
]

interface Props {
  navigate: (hash: string) => void
}

export function MembersPage({ navigate: _navigate }: Props) {
  const [members, setMembers] = useState<MemberProfile[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('user_profiles_buildrs')
      .select('user_id, display_name, stage, level, xp_points, created_at')
      .order('xp_points', { ascending: false })
      .limit(50)
      .then(({ data }) => {
        const real = (data ?? []) as MemberProfile[]
        // Merge real + mock, deduplicate by user_id, sort by XP desc
        const realIds = new Set(real.map(m => m.user_id))
        const merged = [...real, ...MOCK_MEMBERS.filter(m => !realIds.has(m.user_id))]
        merged.sort((a, b) => b.xp_points - a.xp_points)
        setMembers(merged)
        setLoading(false)
      })
  }, [])

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-foreground tracking-tight" style={{ letterSpacing: '-0.03em' }}>
          Membres
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {loading ? 'Chargement...' : `${members.length} builder${members.length !== 1 ? 's' : ''} dans la communaute Buildrs`}
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="border border-border rounded-xl p-4 animate-pulse">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-secondary flex-shrink-0" />
                <div className="flex-1">
                  <div className="h-3.5 bg-secondary rounded w-24 mb-2" />
                  <div className="h-2.5 bg-secondary rounded w-16" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : members.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-border rounded-xl">
          <Users size={32} strokeWidth={1} className="text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-sm font-medium text-foreground mb-1">Repertoire des membres</p>
          <p className="text-xs text-muted-foreground">
            La communaute est en train de se constituer.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {members.map(m => (
            <MemberCard key={m.user_id} member={m} />
          ))}
        </div>
      )}
    </div>
  )
}
