// blueprint-app/src/hooks/useOpportunities.ts
import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export interface SaasOpportunity {
  id: string
  name: string
  slug: string
  tagline: string
  problem_solved: string
  source: string
  source_url: string | null
  website_url: string | null
  category: string
  mrr_estimated: number | null
  mrr_confidence: number | null
  traction_score: number
  cloneability_score: number
  monetization_score: number
  build_score: number
  why_reproducible: string | null
  recommended_stack: string[] | null
  differentiation_angle: string | null
  mvp_features: string[] | null
  pain_points: string[] | null
  niche_suggestions: string[] | null
  acquisition_channels: string[] | null
  pricing_suggestion: string | null
  status: string
  scored_at: string | null
  created_at: string
}

export interface OpportunityFilters {
  category?: string | null
  source?: string | null
  buildScoreMin?: number
  search?: string
  sortBy?: 'build_score' | 'created_at' | 'traction_score'
}

const PAGE_SIZE = 20

export function useOpportunities(userId: string | undefined) {
  const [opportunities, setOpportunities] = useState<SaasOpportunity[]>([])
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [offset, setOffset] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)
  const [filters, setFiltersState] = useState<OpportunityFilters>({
    buildScoreMin: 0,
    sortBy: 'build_score',
  })

  const buildQuery = useCallback((currentOffset: number) => {
    let q = supabase
      .from('saas_opportunities')
      .select('*', { count: 'exact' })
      .eq('status', 'active')
      .range(currentOffset, currentOffset + PAGE_SIZE - 1)

    if (filters.category) q = q.eq('category', filters.category)
    if (filters.source) q = q.eq('source', filters.source)
    if (filters.buildScoreMin) q = q.gte('build_score', filters.buildScoreMin)
    if (filters.search && filters.search.trim()) {
      q = q.textSearch('search_vector', filters.search.trim(), { type: 'websearch', config: 'french' })
    }

    const sortCol = filters.sortBy ?? 'build_score'
    q = q.order(sortCol, { ascending: false })

    return q
  }, [filters])

  // Charger la page initiale
  useEffect(() => {
    setLoading(true)
    setOffset(0)
    buildQuery(0).then(({ data, count, error }) => {
      if (error) { console.error(error); setLoading(false); return }
      setOpportunities((data as SaasOpportunity[]) ?? [])
      setTotal(count ?? 0)
      setHasMore((count ?? 0) > PAGE_SIZE)
      setLoading(false)
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters])

  // Charger la derniere execution du scanner
  useEffect(() => {
    supabase
      .from('scanner_runs')
      .select('completed_at')
      .order('completed_at', { ascending: false })
      .limit(1)
      .then(({ data }) => {
        setLastUpdated(data?.[0]?.completed_at ?? null)
      })
  }, [])

  // Charger les saves de l'user
  useEffect(() => {
    if (!userId) return
    supabase
      .from('user_saved_opportunities')
      .select('opportunity_id')
      .eq('user_id', userId)
      .then(({ data }) => {
        setSavedIds(new Set((data ?? []).map((r: { opportunity_id: string }) => r.opportunity_id)))
      })
  }, [userId])

  const loadMore = useCallback(() => {
    const newOffset = offset + PAGE_SIZE
    buildQuery(newOffset).then(({ data, error }) => {
      if (error || !data) return
      setOpportunities(prev => [...prev, ...(data as SaasOpportunity[])])
      setOffset(newOffset)
      setHasMore(newOffset + PAGE_SIZE < total)
    })
  }, [offset, total, buildQuery])

  const setFilters = useCallback((f: OpportunityFilters) => {
    setFiltersState(prev => ({ ...prev, ...f }))
  }, [])

  const saveOpportunity = useCallback(async (id: string) => {
    if (!userId) return
    await supabase.from('user_saved_opportunities').insert({ user_id: userId, opportunity_id: id })
    setSavedIds(prev => new Set([...prev, id]))
  }, [userId])

  const unsaveOpportunity = useCallback(async (id: string) => {
    if (!userId) return
    await supabase.from('user_saved_opportunities').delete()
      .eq('user_id', userId).eq('opportunity_id', id)
    setSavedIds(prev => { const s = new Set(prev); s.delete(id); return s })
  }, [userId])

  return {
    opportunities,
    loading,
    total,
    filters,
    setFilters,
    loadMore,
    hasMore,
    savedIds,
    saveOpportunity,
    unsaveOpportunity,
    lastUpdated,
  }
}

// Hook pour une seule opportunite par slug
export function useOpportunityBySlug(slug: string) {
  const [opportunity, setOpportunity] = useState<SaasOpportunity | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('saas_opportunities')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'active')
      .maybeSingle()
      .then(({ data }) => {
        setOpportunity(data as SaasOpportunity)
        setLoading(false)
      })
  }, [slug])

  return { opportunity, loading }
}
