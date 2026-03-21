import { createContext, useContext } from 'react'
import type { Project, Phase } from '@/hooks/use-project'

interface ProjectContextValue {
  project: Project | null
  phases: Phase[]
  loading: boolean
  error: string | null
  refetch: () => void
}

const ProjectContext = createContext<ProjectContextValue>({
  project: null,
  phases: [],
  loading: false,
  error: null,
  refetch: () => {},
})

function useProjectContext() {
  return useContext(ProjectContext)
}

export { ProjectContext, useProjectContext }
export type { ProjectContextValue }
