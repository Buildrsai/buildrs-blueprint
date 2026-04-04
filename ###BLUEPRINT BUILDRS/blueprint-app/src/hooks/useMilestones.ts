import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { DEFAULT_MILESTONES } from '../data/milestones-defaults'

export interface Milestone {
  id: string
  user_id: string
  title: string
  description: string | null
  kanban_status: 'todo' | 'in_progress' | 'review' | 'done'
  sort_order: number
  linked_agent: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export function useMilestones(userId: string | undefined) {
  const [milestones, setMilestones] = useState<Milestone[]>([])
  const [loading, setLoading] = useState(true)

  const fetch = useCallback(async () => {
    if (!userId) { setLoading(false); return }
    const { data } = await supabase
      .from('project_milestones')
      .select('*')
      .eq('user_id', userId)
      .order('sort_order', { ascending: true })
    setMilestones((data as Milestone[]) ?? [])
    setLoading(false)
  }, [userId])

  useEffect(() => { fetch() }, [fetch])

  const add = useCallback(async (title: string, description?: string) => {
    if (!userId) return
    const sort_order = milestones.length
    const { data } = await supabase
      .from('project_milestones')
      .insert({ user_id: userId, title, description: description ?? null, sort_order })
      .select()
      .single()
    if (data) setMilestones(prev => [...prev, data as Milestone])
  }, [userId, milestones.length])

  const update = useCallback(async (id: string, updates: Partial<Pick<Milestone, 'title' | 'description' | 'kanban_status' | 'notes' | 'linked_agent'>>) => {
    const { data } = await supabase
      .from('project_milestones')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    if (data) setMilestones(prev => prev.map(m => m.id === id ? data as Milestone : m))
  }, [])

  const remove = useCallback(async (id: string) => {
    await supabase.from('project_milestones').delete().eq('id', id)
    setMilestones(prev => prev.filter(m => m.id !== id))
  }, [])

  const reorder = useCallback(async (ordered: Milestone[]) => {
    setMilestones(ordered)
    await Promise.all(
      ordered.map((m, i) =>
        supabase.from('project_milestones').update({ sort_order: i }).eq('id', m.id)
      )
    )
  }, [])

  const seedDefaults = useCallback(async () => {
    if (!userId || milestones.length > 0) return
    const rows = DEFAULT_MILESTONES.map(m => ({ user_id: userId, ...m }))
    const { data } = await supabase
      .from('project_milestones')
      .insert(rows)
      .select()
    if (data) setMilestones(data as Milestone[])
  }, [userId, milestones.length])

  const doneCount = milestones.filter(m => m.kanban_status === 'done').length

  return { milestones, loading, add, update, remove, reorder, seedDefaults, doneCount }
}
