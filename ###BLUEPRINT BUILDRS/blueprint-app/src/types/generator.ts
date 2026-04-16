// blueprint-app/src/types/generator.ts

export interface IdeaResult {
  title: string
  target_niche: string
  problem_solved: string
  current_friction?: string
  market_proof?: string
  traction_score: number
  traction_explanation: string
  buildability_score: number
  buildability_explanation: string
  monetization_score: number
  monetization_explanation: string
  build_score: number
  recommended_stack: string[]
  mvp_features: string[]
  pricing_suggestion: string
  estimated_build_time: string
  acquisition_channel: string
  why_now: string
}
