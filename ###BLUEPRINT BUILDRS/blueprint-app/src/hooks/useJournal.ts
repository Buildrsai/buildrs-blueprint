import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export interface JournalEntry {
  id: string
  content: string
  module_tag: string | null
  created_at: string
}

export function useJournal(userId: string | undefined) {
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    if (!userId) { setLoading(false); return }
    const { data } = await supabase
      .from('journal')
      .select('id, content, module_tag, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    setEntries((data ?? []) as JournalEntry[])
    setLoading(false)
  }, [userId])

  useEffect(() => { load() }, [load])

  const addEntry = async (content: string, moduleTag?: string) => {
    if (!userId || !content.trim()) return
    const { data } = await supabase
      .from('journal')
      .insert({ user_id: userId, content: content.trim(), module_tag: moduleTag ?? null })
      .select('id, content, module_tag, created_at')
      .single()
    if (data) setEntries(prev => [data as JournalEntry, ...prev])
  }

  const deleteEntry = async (id: string) => {
    if (!userId) return
    await supabase.from('journal').delete().eq('id', id).eq('user_id', userId)
    setEntries(prev => prev.filter(e => e.id !== id))
  }

  return { entries, loading, addEntry, deleteEntry }
}
