import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { getTotalLessons } from '../data/curriculum'

interface ProgressRow {
  module_id: string
  lesson_id: string
  completed: boolean
}

export function useProgress(userId: string | undefined) {
  const [progress, setProgress] = useState<ProgressRow[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    if (!userId) { setLoading(false); return }
    const { data } = await supabase
      .from('progress')
      .select('module_id, lesson_id, completed')
      .eq('user_id', userId)
    setProgress((data ?? []) as ProgressRow[])
    setLoading(false)
  }, [userId])

  useEffect(() => { load() }, [load])

  const markComplete = async (moduleId: string, lessonId: string) => {
    if (!userId) return
    await supabase
      .from('progress')
      .upsert({ user_id: userId, module_id: moduleId, lesson_id: lessonId, completed: true, completed_at: new Date().toISOString() })
    setProgress(prev => {
      const filtered = prev.filter(p => !(p.module_id === moduleId && p.lesson_id === lessonId))
      return [...filtered, { module_id: moduleId, lesson_id: lessonId, completed: true }]
    })
  }

  const isCompleted = (moduleId: string, lessonId: string) =>
    progress.some(p => p.module_id === moduleId && p.lesson_id === lessonId && p.completed)

  const moduleProgress = (moduleId: string, totalLessons: number) => {
    const done = progress.filter(p => p.module_id === moduleId && p.completed).length
    return totalLessons > 0 ? Math.round((done / totalLessons) * 100) : 0
  }

  const globalPercent = () => {
    const total = getTotalLessons()
    const done = progress.filter(p => p.completed).length
    return total > 0 ? Math.min(100, Math.round((done / total) * 100)) : 0
  }

  return { progress, loading, markComplete, isCompleted, moduleProgress, globalPercent }
}
