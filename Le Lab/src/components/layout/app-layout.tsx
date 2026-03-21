import { useEffect } from 'react'
import { Outlet, useParams, useNavigate } from 'react-router'
import { AppSidebar } from './app-sidebar'
import { AppHeader } from './app-header'
import { useAuth } from '@/hooks/use-auth'
import { useProfile } from '@/hooks/use-profile'

/**
 * Layout LIGHT — dashboard et pages authentifiées.
 * Fond #F8F9FC, sidebar blanche, header blanc.
 * Redirections :
 *   - non connecté → /login
 *   - onboarding non complété → /onboarding
 */
function AppLayout() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, loading: authLoading } = useAuth()
  const { profile, loading: profileLoading } = useProfile()

  // Redirection : non connecté
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login', { replace: true })
    }
  }, [user, authLoading, navigate])

  // Redirection : onboarding non complété
  useEffect(() => {
    if (!authLoading && !profileLoading && user) {
      if (!profile || !profile.onboarding_completed) {
        navigate('/onboarding', { replace: true })
      }
    }
  }, [user, authLoading, profile, profileLoading, navigate])

  const loading = authLoading || (!!user && profileLoading)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9FC]">
        <div className="w-5 h-5 rounded-full border-2 border-[#3279F9] border-t-transparent animate-spin" />
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen flex bg-[#F8F9FC]">
      <AppSidebar currentProjectId={id} />
      <div className="flex-1 flex flex-col min-w-0">
        <AppHeader />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export { AppLayout }
