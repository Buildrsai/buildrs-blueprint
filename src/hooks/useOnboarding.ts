import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export interface OnboardingData {
  strategie: 'problem' | 'copy' | 'discover' | null
  objectif: 'mrr' | 'flip' | 'client' | null
  niveau: 'beginner' | 'tools' | 'launched' | null
  onboarding_completed: boolean
}

const DEFAULT: OnboardingData = {
  strategie: null,
  objectif: null,
  niveau: null,
  onboarding_completed: false,
}

export function useOnboarding(userId: string | undefined) {
  const [data, setData] = useState<OnboardingData>(DEFAULT)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) { setLoading(false); return }

    supabase
      .from('onboarding')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle()
      .then(({ data: row }) => {
        if (row) setData(row as OnboardingData)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [userId])

  const save = async (updates: Partial<OnboardingData>) => {
    if (!userId) return
    const merged = { ...data, ...updates }
    const { error } = await supabase
      .from('onboarding')
      .upsert({ user_id: userId, ...merged, updated_at: new Date().toISOString() })
    if (!error) setData(merged)
  }

  const complete = async () => save({ onboarding_completed: true })

  return { data, loading, save, complete }
}
