import { useState, useEffect } from 'react'
import type { User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

interface AuthState {
  user: User | null
  loading: boolean
}

interface AuthActions {
  signUpEmail: (email: string, password: string, firstName?: string) => Promise<{ error: string | null }>
  signInEmail: (email: string, password: string) => Promise<{ error: string | null }>
  signInGoogle: () => void
  signInGitHub: () => void
  signOut: () => void
}

export function useAuth(): AuthState & AuthActions {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signUpEmail = async (email: string, password: string, firstName?: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: firstName ? { data: { first_name: firstName } } : undefined,
    })
    return { error: error?.message ?? null }
  }

  const signInEmail = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error: error?.message ?? null }
  }

  const signInGoogle = () => {
    supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/#/onboarding` },
    })
  }

  const signInGitHub = () => {
    supabase.auth.signInWithOAuth({
      provider: 'github',
      options: { redirectTo: `${window.location.origin}/#/onboarding` },
    })
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    window.location.hash = '/'
  }

  return { user, loading, signUpEmail, signInEmail, signInGoogle, signInGitHub, signOut }
}
