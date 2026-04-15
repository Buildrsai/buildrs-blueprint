import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export interface Project {
  id: string
  name: string
  problem: string
  target: string
  price: string
  feature: string
  status: 'idea' | 'building' | 'live'
  created_at: string
}

export interface ActiveProjectState {
  projects: Project[]
  activeProject: Project | null
  validatorScore: string | null
  mrrEstimate: string | null
  setActiveProject: (p: Project) => Promise<void>
  loading: boolean
}

/** Formats project data as a context block for Claude system prompts */
export function buildProjectContext(
  project: Project | null,
  validatorScore?: string | null,
  mrrEstimate?: string | null,
): string {
  if (!project?.name) return ''
  const lines: string[] = [
    '--- CONTEXTE PROJET ACTIF ---',
    `Nom : ${project.name}`,
  ]
  if (project.problem) lines.push(`Problème résolu : ${project.problem}`)
  if (project.target)  lines.push(`Cible : ${project.target}`)
  if (project.feature) lines.push(`Feature principale : ${project.feature}`)
  if (project.price)   lines.push(`Prix / modèle : ${project.price}`)
  if (validatorScore)  lines.push(`Score de viabilité : ${validatorScore}/100`)
  if (mrrEstimate)     lines.push(`MRR estimé : ${mrrEstimate}`)
  lines.push(`Statut : ${
    project.status === 'idea'     ? 'En phase idée' :
    project.status === 'building' ? 'En construction' :
    'Live et actif'
  }`)
  lines.push('---')
  return lines.join('\n')
}

export function useActiveProject(userId: string | undefined): ActiveProjectState {
  const [projects, setProjects] = useState<Project[]>([])
  const [activeProject, setActiveProjectState] = useState<Project | null>(null)
  const [validatorScore, setValidatorScore] = useState<string | null>(null)
  const [mrrEstimate, setMrrEstimate] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) { setLoading(false); return }
    Promise.all([
      supabase.from('projects').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
      supabase.auth.getUser(),
    ]).then(([{ data: projectsData }, { data: authData }]) => {
      const list = (projectsData ?? []) as Project[]
      setProjects(list)

      const meta = authData.user?.user_metadata ?? {}
      const activeId: string | undefined = meta.active_project_id
      const active = list.find(p => p.id === activeId) ?? list[0] ?? null
      setActiveProjectState(active)

      if (meta.buildrs_validator_score != null) setValidatorScore(String(meta.buildrs_validator_score))
      if (meta.buildrs_mrr_estimate)            setMrrEstimate(meta.buildrs_mrr_estimate)
    }).catch(console.error)
    .finally(() => setLoading(false))
  }, [userId])

  const setActiveProject = useCallback(async (project: Project) => {
    setActiveProjectState(project)
    await supabase.auth.updateUser({ data: { active_project_id: project.id } })
  }, [])

  return { projects, activeProject, validatorScore, mrrEstimate, setActiveProject, loading }
}
