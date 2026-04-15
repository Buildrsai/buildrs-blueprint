import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

interface BrickProgressRow {
  brick_id: string
  completed: boolean
}

export function useContentProgress(userId: string | undefined) {
  const [rows, setRows] = useState<BrickProgressRow[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    if (!userId) { setLoading(false); return }
    const { data } = await supabase
      .from('user_progress')
      .select('brick_id, completed')
      .eq('user_id', userId)
    setRows((data ?? []) as BrickProgressRow[])
    setLoading(false)
  }, [userId])

  useEffect(() => { load() }, [load])

  const isBrickCompleted = (brickId: string): boolean =>
    rows.some(r => r.brick_id === brickId && r.completed)

  const markBrickComplete = async (brickId: string) => {
    if (!userId) return
    await supabase
      .from('user_progress')
      .upsert({ user_id: userId, brick_id: brickId, completed: true, completed_at: new Date().toISOString() })
    setRows(prev => {
      const filtered = prev.filter(r => r.brick_id !== brickId)
      return [...filtered, { brick_id: brickId, completed: true }]
    })
  }

  /** Pourcentage de complétion pour un bloc (liste de brickIds) */
  const blocProgress = (brickIds: string[]): number => {
    if (brickIds.length === 0) return 0
    const done = brickIds.filter(id => isBrickCompleted(id)).length
    return Math.round((done / brickIds.length) * 100)
  }

  /** Nombre de briques complétées sur un produit (brickIds = toutes les briques du produit) */
  const productProgress = (brickIds: string[]): { done: number; total: number; pct: number } => {
    const total = brickIds.length
    const done  = brickIds.filter(id => isBrickCompleted(id)).length
    const pct   = total > 0 ? Math.round((done / total) * 100) : 0
    return { done, total, pct }
  }

  return { rows, loading, isBrickCompleted, markBrickComplete, blocProgress, productProgress }
}
