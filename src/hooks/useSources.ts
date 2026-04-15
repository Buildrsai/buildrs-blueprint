// blueprint-app/src/hooks/useSources.ts
import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export interface BuildrsOpportunity {
  id: string
  slug: string
  opportunity_title: string
  target_niche: string | null
  problem_solved: string | null
  traction_score: number
  cloneability_score: number
  monetization_score: number
  build_score: number
  traction_explanation: string | null
  cloneability_explanation: string | null
  monetization_explanation: string | null
  why_reproducible: string | null
  differentiation_angle: string | null
  recommended_stack: string[]
  mvp_features: string[]
  pricing_suggestion: string | null
  acquisition_channels: string[]
  niche_suggestions: string[]
  estimated_build_time: string | null
  product_type: string | null
  market_type: string | null
  status: string
  scored_at: string | null
}

export interface SaasSource {
  id: string
  name: string
  slug: string
  domain: string | null
  tagline: string | null
  description: string | null
  logo_url: string | null
  screenshot_url: string | null
  category: string
  subcategory: string | null
  mrr_reported: number | null
  arr_reported: number | null
  mrr_source: string | null
  pricing_model: string | null
  pricing_url: string | null
  founder_names: string | null
  founded_year: number | null
  employee_count_range: string | null
  tech_stack: string[]
  platforms: string[]
  source_urls: Record<string, string>
  is_verified: boolean
  is_featured: boolean
  created_at: string
  // joined — first opportunity only
  opportunity: BuildrsOpportunity | null
}

export interface SourceFilters {
  category?: string | null
  search?: string
  featuredOnly?: boolean
  buildScoreMin?: number
  sortBy?: 'build_score' | 'created_at' | 'name'
  productType?: string | null
  marketType?: string | null
}

const PAGE_SIZE = 20

export function useSources(userId: string | undefined) {
  const [sources, setSources] = useState<SaasSource[]>([])
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [offset, setOffset] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  const [filters, setFiltersState] = useState<SourceFilters>({
    buildScoreMin: 0,
    sortBy: 'build_score',
  })

  const buildQuery = useCallback((currentOffset: number) => {
    let q = supabase
      .from('saas_sources')
      .select('*, buildrs_opportunities(*)', { count: 'exact' })
      .range(currentOffset, currentOffset + PAGE_SIZE - 1)

    if (filters.featuredOnly) q = q.eq('is_featured', true)
    if (filters.category) q = q.eq('category', filters.category)
    if (filters.search?.trim()) {
      q = q.textSearch('search_vector', filters.search.trim(), { type: 'websearch', config: 'french' })
    }

    const sortCol = filters.sortBy === 'name' ? 'name' : 'created_at'
    q = q.order(sortCol, { ascending: filters.sortBy === 'name' })

    return q
  }, [filters])

  const normalize = useCallback((data: Record<string, unknown>[]): SaasSource[] => {
    return data.map(row => {
      const opps = (row.buildrs_opportunities as BuildrsOpportunity[] | null) ?? []
      // Sort by build_score desc, take highest
      const sortedOpps = [...opps].sort((a, b) => b.build_score - a.build_score)
      let opportunity = sortedOpps[0] ?? null

      // Apply buildScoreMin filter on opportunity
      if (opportunity && filters.buildScoreMin && opportunity.build_score < filters.buildScoreMin) {
        opportunity = null
      }
      // Apply product_type / market_type filters (only if opportunity has a non-null value for the field)
      if (opportunity && filters.productType && opportunity.product_type && opportunity.product_type !== filters.productType) {
        opportunity = null
      }
      if (opportunity && filters.marketType && opportunity.market_type && opportunity.market_type !== filters.marketType) {
        opportunity = null
      }

      return {
        ...row,
        tech_stack: (row.tech_stack as string[]) ?? [],
        platforms: (row.platforms as string[]) ?? [],
        source_urls: (row.source_urls as Record<string, string>) ?? {},
        opportunity,
      } as SaasSource
    }).filter(s => !filters.buildScoreMin || s.opportunity !== null || filters.buildScoreMin === 0)
  }, [filters.buildScoreMin])

  // Initial load
  useEffect(() => {
    setLoading(true)
    setOffset(0)
    buildQuery(0).then(({ data, count, error }) => {
      if (error) { console.error(error); setLoading(false); return }
      const normalized = normalize((data ?? []) as Record<string, unknown>[])
      // Sort by build_score if needed
      if (filters.sortBy === 'build_score') {
        normalized.sort((a, b) => (b.opportunity?.build_score ?? 0) - (a.opportunity?.build_score ?? 0))
      }
      setSources(normalized)
      setTotal(count ?? 0)
      setHasMore((count ?? 0) > PAGE_SIZE)
      setLoading(false)
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters])

  // Load user favorites
  useEffect(() => {
    if (!userId) return
    supabase
      .from('user_favorites')
      .select('source_id')
      .eq('user_id', userId)
      .then(({ data }) => {
        setFavoriteIds(new Set((data ?? []).map((r: { source_id: string }) => r.source_id)))
      })
  }, [userId])

  const loadMore = useCallback(() => {
    const newOffset = offset + PAGE_SIZE
    buildQuery(newOffset).then(({ data, error }) => {
      if (error || !data) return
      const normalized = normalize((data ?? []) as Record<string, unknown>[])
      setSources(prev => [...prev, ...normalized])
      setOffset(newOffset)
      setHasMore(newOffset + PAGE_SIZE < total)
    })
  }, [offset, total, buildQuery, normalize])

  const setFilters = useCallback((f: SourceFilters) => {
    setFiltersState(prev => ({ ...prev, ...f }))
  }, [])

  const addFavorite = useCallback(async (sourceId: string) => {
    if (!userId) return
    await supabase.from('user_favorites').insert({ user_id: userId, source_id: sourceId })
    setFavoriteIds(prev => new Set([...prev, sourceId]))
  }, [userId])

  const removeFavorite = useCallback(async (sourceId: string) => {
    if (!userId) return
    await supabase.from('user_favorites').delete().eq('user_id', userId).eq('source_id', sourceId)
    setFavoriteIds(prev => { const s = new Set(prev); s.delete(sourceId); return s })
  }, [userId])

  return {
    sources,
    loading,
    total,
    filters,
    setFilters,
    loadMore,
    hasMore,
    favoriteIds,
    addFavorite,
    removeFavorite,
  }
}

// Hook for single source + opportunity by slug
export function useSourceBySlug(slug: string) {
  const [source, setSource] = useState<SaasSource | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!slug) return
    setLoading(true)
    supabase
      .from('saas_sources')
      .select('*, buildrs_opportunities(*)')
      .eq('slug', slug)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error || !data) { setLoading(false); return }
        const opps = (data.buildrs_opportunities as BuildrsOpportunity[] | null) ?? []
        const sortedOpps = [...opps].sort((a, b) => b.build_score - a.build_score)
        setSource({
          ...data,
          tech_stack: data.tech_stack ?? [],
          platforms: data.platforms ?? [],
          source_urls: data.source_urls ?? {},
          opportunity: sortedOpps[0] ?? null,
        } as SaasSource)
        setLoading(false)
      })
  }, [slug])

  return { source, loading }
}
