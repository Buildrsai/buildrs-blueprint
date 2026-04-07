import { useState, useEffect, useCallback, useMemo } from 'react'
import { supabase } from '../lib/supabase'

export interface CommunityPost {
  id: string
  user_id: string | null
  type: 'milestone' | 'idea' | 'question' | 'win' | 'resource'
  content: string
  reactions: Record<string, number>
  is_auto: boolean
  is_pinned: boolean
  created_at: string
  updated_at: string
  author_email?: string
  // seed posts
  seed_author_name?: string | null
  seed_author_level?: string | null
}

export function useCommunityFeed(userId: string | undefined) {
  const [allPosts, setAllPosts] = useState<CommunityPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('community_posts')
      .select('*')
      .order('is_pinned', { ascending: false })
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setAllPosts((data as CommunityPost[]) ?? [])
        setLoading(false)
      })
  }, [])

  const pinnedPosts = useMemo(() => allPosts.filter(p => p.is_pinned), [allPosts])
  const feedPosts   = useMemo(() => allPosts.filter(p => !p.is_pinned), [allPosts])

  const addPost = useCallback(async (type: CommunityPost['type'], content: string) => {
    if (!userId) return
    const { data } = await supabase
      .from('community_posts')
      .insert({ user_id: userId, type, content })
      .select()
      .single()
    if (data) setAllPosts(prev => [data as CommunityPost, ...prev])
  }, [userId])

  const toggleReaction = useCallback(async (postId: string, emoji: string) => {
    if (!userId) return
    const { data: existing } = await supabase
      .from('community_reactions')
      .select('id')
      .eq('post_id', postId)
      .eq('user_id', userId)
      .eq('reaction', emoji)
      .maybeSingle()

    if (existing) {
      await supabase.from('community_reactions').delete().eq('id', existing.id)
    } else {
      await supabase.from('community_reactions').insert({ post_id: postId, user_id: userId, reaction: emoji })
    }

    setAllPosts(prev => prev.map(p => {
      if (p.id !== postId) return p
      const current = p.reactions[emoji] ?? 0
      return {
        ...p,
        reactions: { ...p.reactions, [emoji]: existing ? Math.max(0, current - 1) : current + 1 },
      }
    }))
  }, [userId])

  return { pinnedPosts, feedPosts, loading, addPost, toggleReaction }
}
