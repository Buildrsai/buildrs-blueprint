import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'

interface Phase {
  id: string
  phase_number: number
  status: string
  generated_content: Record<string, unknown>
  steps_completed: unknown[]
  completed_at: string | null
}

interface Project {
  id: string
  name: string
  description: string | null
  current_phase: number
  status: string
  idea_data: Record<string, string>
  structure_data: Record<string, unknown> | null
  branding_data: Record<string, unknown> | null
  build_kit_data: Record<string, unknown> | null
  created_at: string
  updated_at: string
}

interface ProjectState {
  project: Project | null
  phases: Phase[]
  loading: boolean
  error: string | null
}

function useProject(id: string | undefined) {
  const [state, setState] = useState<ProjectState>({
    project: null,
    phases: [],
    loading: !!id,
    error: null,
  })

  const fetchProject = useCallback(async () => {
    if (!id) {
      setState({ project: null, phases: [], loading: false, error: null })
      return
    }
    setState(prev => ({ ...prev, loading: true, error: null }))
    const { data, error } = await supabase
      .from('projects')
      .select('*, project_phases(*)')
      .eq('id', id)
      .single()

    if (error) {
      setState({ project: null, phases: [], loading: false, error: error.message })
    } else if (data) {
      const { project_phases, ...project } = data as Project & { project_phases: Phase[] }
      setState({
        project,
        phases: project_phases ?? [],
        loading: false,
        error: null,
      })
    }
  }, [id])

  useEffect(() => {
    fetchProject()
  }, [fetchProject])

  return { ...state, refetch: fetchProject }
}

export { useProject }
export type { Project, Phase }
