import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export interface SaasIdea {
  id: string
  title: string
  slug: string
  difficulty: number
  mrr_min: number
  mrr_max: number
  target_audience: string | null
  tags: string[]
  problem_md: string | null
  solution_md: string | null
  stack: string[]
  business_model_md: string | null
  competition_md: string | null
  created_at: string
}

export interface IdeaFilters {
  difficulty?: number | null
  mrrMin?: number | null
  tag?: string | null
  search?: string
}

export function useMarketplaceIdeas(userId: string | undefined) {
  const [ideas, setIdeas] = useState<SaasIdea[]>([])
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<IdeaFilters>({})

  useEffect(() => {
    supabase
      .from('saas_ideas')
      .select('*')
      .order('created_at', { ascending: true })
      .then(({ data }) => {
        setIdeas((data as SaasIdea[]) ?? [])
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    if (!userId) return
    supabase
      .from('user_saved_ideas')
      .select('idea_id')
      .eq('user_id', userId)
      .then(({ data }) => {
        setSavedIds(new Set((data ?? []).map((r: { idea_id: string }) => r.idea_id)))
      })
  }, [userId])

  const saveIdea = useCallback(async (ideaId: string) => {
    if (!userId) return
    await supabase.from('user_saved_ideas').insert({ user_id: userId, idea_id: ideaId })
    setSavedIds(prev => new Set([...prev, ideaId]))
  }, [userId])

  const unsaveIdea = useCallback(async (ideaId: string) => {
    if (!userId) return
    await supabase.from('user_saved_ideas').delete().eq('user_id', userId).eq('idea_id', ideaId)
    setSavedIds(prev => { const s = new Set(prev); s.delete(ideaId); return s })
  }, [userId])

  const filteredIdeas = ideas.filter(idea => {
    if (filters.difficulty && idea.difficulty !== filters.difficulty) return false
    if (filters.mrrMin && idea.mrr_max < filters.mrrMin) return false
    if (filters.tag && !idea.tags.includes(filters.tag)) return false
    if (filters.search) {
      const q = filters.search.toLowerCase()
      return idea.title.toLowerCase().includes(q) || (idea.target_audience ?? '').toLowerCase().includes(q)
    }
    return true
  })

  return { ideas: filteredIdeas, allIdeas: ideas, loading, filters, setFilters, saveIdea, unsaveIdea, savedIds }
}
