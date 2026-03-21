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
  const { user, loading: authLoading } = useAuth()
  const [state, setState] = useState<ProfileState>({
    profile: null,
    loading: true, // reste true jusqu'à ce qu'on ait une réponse définitive
    error: null,
  })

  useEffect(() => {
    // Attendre que l'auth soit résolue avant de décider
    if (authLoading) return

    if (!user) {
      setState({ profile: null, loading: false, error: null })
      return
    }

    // L'user est disponible — relancer le fetch et marquer comme loading
    setState(prev => ({ ...prev, loading: true, error: null }))

    supabase
      .from('profiles')
      .select('id, onboarding_completed, onboarding_data')
      .eq('id', user.id)
      .single()
      .then(({ data, error }) => {
        if (error && error.code !== 'PGRST116') {
          // PGRST116 = no rows found — on traite ça comme profil null
          setState({ profile: null, loading: false, error: error.message })
        } else {
          setState({ profile: data as Profile | null, loading: false, error: null })
        }
      })
  }, [user?.id, authLoading]) // dépend de authLoading pour éviter la race condition

  const completeOnboarding = async (onboardingData: Record<string, string>) => {
    if (!user) return { error: new Error('Non connecté') }

    const { data, error } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        onboarding_data: onboardingData,
        onboarding_completed: true,
      }, { onConflict: 'id' })
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
