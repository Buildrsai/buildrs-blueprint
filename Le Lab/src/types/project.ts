// Types du projet Buildrs Lab

export type ProjectStatus =
  | 'idea'
  | 'validating'
  | 'structuring'
  | 'branding'
  | 'building'
  | 'deploying'
  | 'launched'

export type MonetizationType = 'subscription' | 'one_time' | 'freemium'

export type Verdict = 'go' | 'refine' | 'pivot'

export interface Project {
  id: string
  user_id: string
  name: string
  description: string
  status: ProjectStatus
  current_phase: number
  niche: string
  audience: string
  problem: string
  created_at: string
}

export interface ProjectValidation {
  id: string
  project_id: string
  market_score: number
  competition_score: number
  monetization_score: number
  buildability_score: number
  total_score: number
  sources: Record<string, string>[]
  verdict: Verdict
}

export interface ProjectStructure {
  id: string
  project_id: string
  pages: { name: string; description: string; route: string }[]
  features: { name: string; description: string; priority: 'must' | 'should' | 'could' }[]
  data_model: Record<string, unknown>
  monetization_type: MonetizationType
  pricing: { monthly?: number; yearly?: number; one_time?: number }
}

export interface ProjectBranding {
  id: string
  project_id: string
  name_options: { name: string; domain_available: boolean; tagline: string }[]
  colors: { primary: string; secondary: string; accent: string; background: string; text: string }
  typography: { heading: string; body: string; code: string }
  style: string
  design_system_summary: string
}

export interface ProjectBuildKit {
  id: string
  project_id: string
  claude_md: string
  mcp_json: Record<string, unknown>
  skills: { name: string; install_command: string; description: string }[]
  connectors: { name: string; purpose: string }[]
  build_prompts: { order: number; prompt: string; expected_result: string; common_issues: string[] }[]
}

export interface ProjectProgress {
  id: string
  project_id: string
  phase: number
  step_number: number
  completed: boolean
  completed_at: string | null
}

export type PhaseNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8

export interface Phase {
  number: PhaseNumber
  name: string
  description: string
  icon: string
  unlocked: boolean
  completed: boolean
  current: boolean
}
