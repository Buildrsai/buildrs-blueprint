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
  author_display_name?: string | null
  author_level?: string | null
  // seed posts
  seed_author_name?: string | null
  seed_author_level?: string | null
}

export function useCommunityFeed(userId: string | undefined) {
  const [allPosts, setAllPosts]     = useState<CommunityPost[]>([])
  const [commentCounts, setCommentCounts] = useState<Record<string, number>>({})
  const [loading, setLoading]       = useState(true)

  useEffect(() => {
    supabase
      .from('community_posts')
      .select('*')
      .order('is_pinned', { ascending: false })
      .order('created_at', { ascending: false })
      .then(async ({ data }) => {
        const posts = (data as CommunityPost[]) ?? []
        setAllPosts(posts)

        if (posts.length > 0) {
          const { data: counts } = await supabase.rpc('get_comment_counts_for_posts', {
            post_ids: posts.map(p => p.id),
          })
          const map: Record<string, number> = {}
          ;(counts as { post_id: string; comment_count: number }[] ?? []).forEach(r => {
            map[r.post_id] = Number(r.comment_count)
          })
          setCommentCounts(map)
        }

        setLoading(false)
      })
  }, [])

  const pinnedPosts = useMemo(() => allPosts.filter(p => p.is_pinned), [allPosts])
  const feedPosts   = useMemo(() => allPosts.filter(p => !p.is_pinned), [allPosts])

  // Increment a post's comment count locally (called after a comment is submitted)
  const incrementCommentCount = useCallback((postId: string) => {
    setCommentCounts(prev => ({ ...prev, [postId]: (prev[postId] ?? 0) + 1 }))
  }, [])

  const addPost = useCallback(async (
    type: CommunityPost['type'],
    content: string,
    authorDisplayName?: string,
    authorLevel?: string,
  ) => {
    if (!userId) return null
    const { data } = await supabase
      .from('community_posts')
      .insert({
        user_id: userId,
        type,
        content,
        author_display_name: authorDisplayName ?? null,
        author_level: authorLevel ?? null,
      })
      .select()
      .single()
    if (data) setAllPosts(prev => [data as CommunityPost, ...prev])
    return data as CommunityPost | null
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

    const { data: allReactions } = await supabase
      .from('community_reactions')
      .select('reaction')
      .eq('post_id', postId)

    const newCounts: Record<string, number> = {}
    allReactions?.forEach((r: { reaction: string }) => {
      newCounts[r.reaction] = (newCounts[r.reaction] ?? 0) + 1
    })

    await supabase
      .from('community_posts')
      .update({ reactions: newCounts })
      .eq('id', postId)

    setAllPosts(prev => prev.map(p => p.id !== postId ? p : { ...p, reactions: newCounts }))
  }, [userId])

  return { pinnedPosts, feedPosts, loading, addPost, toggleReaction, commentCounts, incrementCommentCount }
}
