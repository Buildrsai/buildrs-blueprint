import { useEffect } from 'react'
import { Outlet, useParams, useNavigate } from 'react-router'
import { AppSidebar } from './app-sidebar'
import { AppHeader } from './app-header'
import { useAuth } from '@/hooks/use-auth'
import { useProfile } from '@/hooks/use-profile'
import { useProject } from '@/hooks/use-project'
import { ProjectContext } from '@/contexts/project-context'

/**
 * Layout LIGHT — dashboard et pages authentifiées.
 * Fond #F8F9FC, sidebar blanche, header blanc.
 * Fetche le projet courant (si route /project/:id) et le fournit via ProjectContext.
 */
function AppLayout() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, loading: authLoading } = useAuth()
  const { profile, loading: profileLoading } = useProfile()
  const projectData = useProject(id) // no-op quand id est undefined

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

  const completedPhaseNumbers = projectData.phases
    .filter(p => p.status === 'completed')
    .map(p => p.phase_number)

  return (
    <ProjectContext.Provider value={projectData}>
      <div className="min-h-screen flex bg-[#F8F9FC]">
        <AppSidebar
          currentProjectId={id}
          currentPhase={projectData.project?.current_phase}
          completedPhases={completedPhaseNumbers}
        />
        <div className="flex-1 flex flex-col min-w-0">
          <AppHeader />
          <main className="flex-1 overflow-y-auto p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </ProjectContext.Provider>
  )
}

export { AppLayout }
