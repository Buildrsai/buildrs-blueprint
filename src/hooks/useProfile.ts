import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { getLevelFromXP, XP_REWARDS, type BuildrsLevel } from '../data/levels'

export interface BuildrsProfile {
  user_id: string
  display_name: string | null
  project_idea: string | null
  stage: 'idea' | 'exploring' | 'building' | 'launched' | null
  goal: 'mrr' | 'flip' | 'client' | null
  tech_level: 'zero' | 'basic' | 'advanced' | null
  level: BuildrsLevel
  xp_points: number
  onboarding_completed: boolean
  created_at: string
  updated_at: string
}

export function useProfile(userId: string | undefined) {
  const [profile, setProfile] = useState<BuildrsProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) { setLoading(false); return }
    supabase
      .from('user_profiles_buildrs')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle()
      .then(({ data }) => {
        setProfile(data ?? null)
        setLoading(false)
      })
  }, [userId])

  const updateProfile = useCallback(async (updates: Partial<Omit<BuildrsProfile, 'user_id' | 'created_at' | 'updated_at'>>) => {
    if (!userId) return
    const { data, error } = await supabase
      .from('user_profiles_buildrs')
      .upsert({ user_id: userId, ...updates, updated_at: new Date().toISOString() }, { onConflict: 'user_id' })
      .select()
      .single()
    if (!error && data) setProfile(data as BuildrsProfile)
  }, [userId])

  const addXP = useCallback(async (action: keyof typeof XP_REWARDS) => {
    if (!userId) return
    const reward = XP_REWARDS[action]
    const currentXP = profile?.xp_points ?? 0
    const newXP = currentXP + reward
    const newLevel = getLevelFromXP(newXP)
    await updateProfile({ xp_points: newXP, level: newLevel })
  }, [userId, profile, updateProfile])

  return { profile, loading, updateProfile, addXP }
}
