import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { supabase } from '@/lib/supabase'

/**
 * Page de redirection après OAuth ou magic link.
 * Supabase redirige vers /auth/callback avec le token dans l'URL.
 * On échange le token contre une session, puis on redirige vers /dashboard.
 */
function AuthCallbackPage() {
  const navigate = useNavigate()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate('/dashboard', { replace: true })
      } else {
        navigate('/login', { replace: true })
      }
    })
  }, [navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F9FC]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-5 h-5 rounded-full border-2 border-[#3279F9] border-t-transparent animate-spin" />
        <p className="text-sm text-[#45474D]">Connexion en cours…</p>
      </div>
    </div>
  )
}

export { AuthCallbackPage }
