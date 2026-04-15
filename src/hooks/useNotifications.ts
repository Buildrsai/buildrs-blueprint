import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export interface AppNotification {
  id: string
  user_id: string
  type: string
  title: string
  message: string | null
  link: string | null
  is_read: boolean
  created_at: string
}

export function useNotifications(userId: string | undefined) {
  const [notifications, setNotifications] = useState<AppNotification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) { setLoading(false); return }
    supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50)
      .then(({ data }) => {
        setNotifications((data as AppNotification[]) ?? [])
        setLoading(false)
      })
  }, [userId])

  const markRead = useCallback(async (id: string) => {
    await supabase.from('notifications').update({ is_read: true }).eq('id', id)
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n))
  }, [])

  const markAllRead = useCallback(async () => {
    if (!userId) return
    await supabase.from('notifications').update({ is_read: true }).eq('user_id', userId).eq('is_read', false)
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
  }, [userId])

  const unreadCount = notifications.filter(n => !n.is_read).length

  return { notifications, loading, unreadCount, markRead, markAllRead }
}
