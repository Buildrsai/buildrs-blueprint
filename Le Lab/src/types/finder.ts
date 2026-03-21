// Types du Buildrs Finder

export type FinderMode = 'find' | 'validate' | 'copy'

export interface FinderSearch {
  id: string
  user_id: string | null
  mode: FinderMode
  input: string
  result: FinderResult[] | ValidationResult | CopyResult
  score: number | null
  created_at: string
}

export interface FinderResult {
  title: string
  problem: string
  audience: string
  competition: string
  competitors: { name: string; weaknesses: string[] }[]
  pricing_estimate: string
  build_time: string
  sources: { name: string; url: string }[]
  score: number
  verdict: 'GO' | 'À AFFINER' | 'PIVOT'
}

export interface ValidationResult {
  title: string
  market_score: number
  competition_score: number
  monetization_score: number
  buildability_score: number
  total_score: number
  verdict: 'GO' | 'À AFFINER' | 'PIVOT'
  recommendations: string[]
  sources: { name: string; url: string }[]
}

export interface CopyAngle {
  title: string
  niche: string
  description: string
  score: number
  verdict: 'GO' | 'À AFFINER' | 'PIVOT'
}

export interface CopyResult {
  product_name: string
  what_it_does: string
  pricing: string
  weaknesses: string[]
  angles: CopyAngle[]
  mvp_scope: string
}
