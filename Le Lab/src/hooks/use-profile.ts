import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from './use-auth'

interface Profile {
  id: string
  onboarding_completed: boolean
  onboarding_data: Record<string, string> | null
}

interface ProfileState {
  profile: Profile | null
  loading: boolean
  error: string | null
}

function useProfile() {
  const { user } = useAuth()
  const [state, setState] = useState<ProfileState>({
    profile: null,
    loading: true,
    error: null,
  })

  useEffect(() => {
    if (!user) {
      setState({ profile: null, loading: false, error: null })
      return
    }

    supabase
      .from('profiles')
      .select('id, onboarding_completed, onboarding_data')
      .eq('id', user.id)
      .single()
      .then(({ data, error }) => {
        if (error && error.code !== 'PGRST116') {
          // PGRST116 = no rows found (profil pas encore créé)
          setState({ profile: null, loading: false, error: error.message })
        } else {
          setState({ profile: data as Profile | null, loading: false, error: null })
        }
      })
  }, [user?.id])

  const completeOnboarding = async (onboardingData: Record<string, string>) => {
    if (!user) return { error: new Error('Non connecté') }

    const { data, error } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        onboarding_data: onboardingData,
        onboarding_completed: true,
        updated_at: new Date().toISOString(),
      })
      .select('id, onboarding_completed, onboarding_data')
      .single()

    if (!error && data) {
      setState(prev => ({ ...prev, profile: data as Profile }))
    }
    return { error }
  }

  return { ...state, completeOnboarding }
}

export { useProfile }
export type { Profile }
