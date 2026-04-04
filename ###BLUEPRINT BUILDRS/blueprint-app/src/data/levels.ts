export type BuildrsLevel = 'explorer' | 'builder' | 'launcher' | 'scaler'

export const LEVELS: { key: BuildrsLevel; label: string; minXP: number; color: string }[] = [
  { key: 'explorer', label: 'Explorateur', minXP: 0,    color: '#6b7280' },
  { key: 'builder',  label: 'Builder',     minXP: 100,  color: '#3b82f6' },
  { key: 'launcher', label: 'Launcher',    minXP: 500,  color: '#8b5cf6' },
  { key: 'scaler',   label: 'Scaler',      minXP: 1000, color: '#f59e0b' },
]

export const XP_REWARDS = {
  brick_complete:     5,
  bloc_complete:      25,
  milestone_done:     30,
  community_post:     5,
  win_share:          10,
  help_comment:       10,
  project_launched:   200,
} as const

export function getLevelFromXP(xp: number): BuildrsLevel {
  if (xp >= 1000) return 'scaler'
  if (xp >= 500)  return 'launcher'
  if (xp >= 100)  return 'builder'
  return 'explorer'
}

export function getLevelInfo(level: BuildrsLevel) {
  return LEVELS.find(l => l.key === level) ?? LEVELS[0]
}

export function getXPProgress(xp: number): { level: BuildrsLevel; label: string; current: number; next: number; percent: number } {
  const level = getLevelFromXP(xp)
  const info = getLevelInfo(level)
  const nextLevel = LEVELS.find(l => l.minXP > info.minXP)
  const nextXP = nextLevel?.minXP ?? info.minXP + 1
  const current = xp - info.minXP
  const range = nextXP - info.minXP
  return {
    level,
    label: info.label,
    current,
    next: nextXP,
    percent: nextLevel ? Math.min(100, Math.round((current / range) * 100)) : 100,
  }
}
