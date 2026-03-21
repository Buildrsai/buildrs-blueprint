import { useEffect } from 'react'
import { Outlet, useParams, useNavigate } from 'react-router'
import { AppSidebar } from './app-sidebar'
import { AppHeader } from './app-header'
import { useAuth } from '@/hooks/use-auth'

/**
 * Layout DARK — dashboard et pages authentifiées
 * Fond #050508, sidebar #0A0A0F, cockpit immersif
 * Redirige vers /login si l'utilisateur n'est pas connecté.
 */
function AppLayout() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login', { replace: true })
    }
  }, [user, loading, navigate])

  // Pendant la vérification de session
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#000000]">
        <div className="w-5 h-5 rounded-full border-2 border-[#3279F9] border-t-transparent animate-spin" />
      </div>
    )
  }

  // Non connecté — sera redirigé par le useEffect
  if (!user) return null

  return (
    <div className="min-h-screen flex bg-[#050508] dark">
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
