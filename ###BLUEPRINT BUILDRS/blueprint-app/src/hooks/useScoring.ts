import { useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'

// ── Types ──────────────────────────────────────────────────────────────────

export interface ScoreCriterion {
  label: string
  score: number   // 0-20
  comment: string
}

export interface Competitor {
  name: string
  url?: string
  differentiator: string
}

export interface ViabilityReport {
  score: number          // 0-100
  verdict: 'GO' | 'PIVOT' | 'STOP'
  summary: string        // 2-3 phrases
  strengths: string[]
  warnings: string[]
  criteria: ScoreCriterion[]
  competitors: Competitor[]
  mrr_estimate: { low: number; high: number; currency: string }
  next_step: string
}

export interface ScoringState {
  score: number | null
  report: ViabilityReport | null
  loading: boolean
  error: string | null
}

// ── Hook ───────────────────────────────────────────────────────────────────

export function useScoring(userId: string | undefined) {
  const [state, setState] = useState<ScoringState>({
    score: null,
    report: null,
    loading: false,
    error: null,
  })

  const runScoring = useCallback(async (projectId: string, projectName: string, problem: string) => {
    if (!userId) return
    setState(prev => ({ ...prev, loading: true, error: null }))

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) throw new Error('Non authentifié')

      const res = await supabase.functions.invoke('score-project', {
        body: { project_id: projectId, project_name: projectName, problem },
      })

      if (res.error) throw new Error(res.error.message ?? 'Erreur serveur')

      const report = res.data as ViabilityReport
      setState({ score: report.score, report, loading: false, error: null })
      return report
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erreur inconnue'
      setState(prev => ({ ...prev, loading: false, error: msg }))
      return null
    }
  }, [userId])

  const loadFromProject = useCallback(async (projectId: string) => {
    const { data } = await supabase
      .from('projects')
      .select('viability_score, viability_report')
      .eq('id', projectId)
      .maybeSingle()
    if (data?.viability_score != null) {
      setState({
        score: data.viability_score,
        report: data.viability_report as ViabilityReport ?? null,
        loading: false,
        error: null,
      })
    }
  }, [])

  const reset = useCallback(() => {
    setState({ score: null, report: null, loading: false, error: null })
  }, [])

  return { ...state, runScoring, loadFromProject, reset }
}
