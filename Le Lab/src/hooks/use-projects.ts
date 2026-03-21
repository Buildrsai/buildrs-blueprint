import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from './use-auth'

interface PhaseInfo {
  phase_number: number
  status: string
  generated_content: Record<string, unknown>
}

interface ProjectWithPhases {
  id: string
  name: string
  description: string | null
  current_phase: number
  status: string
  idea_data: Record<string, string>
  created_at: string
  updated_at: string
  project_phases: PhaseInfo[]
}

interface ProjectsState {
  projects: ProjectWithPhases[]
  loading: boolean
  error: string | null
}

function useProjects() {
  const { user, loading: authLoading } = useAuth()
  const [state, setState] = useState<ProjectsState>({
    projects: [],
    loading: true,
    error: null,
  })

  const fetchProjects = useCallback(async () => {
    if (!user) return
    setState(prev => ({ ...prev, loading: true, error: null }))
    const { data, error } = await supabase
      .from('projects')
      .select('*, project_phases(phase_number, status, generated_content)')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })

    if (error) {
      setState({ projects: [], loading: false, error: error.message })
    } else {
      setState({ projects: (data as ProjectWithPhases[]) ?? [], loading: false, error: null })
    }
  }, [user])

  useEffect(() => {
    if (authLoading) return
    if (!user) {
      setState({ projects: [], loading: false, error: null })
      return
    }
    fetchProjects()
  }, [user?.id, authLoading, fetchProjects])

  return { ...state, refetch: fetchProjects }
}

export { useProjects }
export type { ProjectWithPhases, PhaseInfo }
