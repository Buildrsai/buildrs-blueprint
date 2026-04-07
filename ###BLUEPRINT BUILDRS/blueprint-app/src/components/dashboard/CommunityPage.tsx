import { useState, useEffect, useCallback, useMemo } from 'react'
import {
  Send, MessageSquare, Trophy, Lightbulb, HelpCircle, BookOpen,
  Flag, Pin, Bookmark, ChevronDown,
} from 'lucide-react'
import { useCommunityFeed, type CommunityPost } from '../../hooks/useCommunityFeed'
import { BuilderAvatar, type BuilderLevel } from '../ui/BuilderAvatar'
import { BuildrsIcon } from '../ui/icons'
import { supabase } from '../../lib/supabase'

// ── Types ─────────────────────────────────────────────────────────────────────
interface Comment {
  id: string
  post_id: string
  user_id: string | null
  content: string
  author_display_name: string | null
  author_level: string | null
  created_at: string
}

// ── Constants ─────────────────────────────────────────────────────────────────
const POST_TYPES: {
  key: CommunityPost['type']
  label: string
  Icon: React.ComponentType<{ size?: number; strokeWidth?: number; style?: React.CSSProperties }>
  placeholder: string
}[] = [
  { key: 'win',       label: 'Win',        Icon: Trophy,     placeholder: 'Partage ton dernier win...' },
  { key: 'milestone', label: 'Avancement', Icon: Flag,       placeholder: 'Quel milestone viens-tu de compléter ?' },
  { key: 'idea',      label: 'Idée',       Icon: Lightbulb,  placeholder: 'Une idée à partager avec la communauté...' },
  { key: 'question',  label: 'Question',   Icon: HelpCircle, placeholder: 'Pose ta question — la communauté répond.' },
  { key: 'resource',  label: 'Ressource',  Icon: BookOpen,   placeholder: 'Partage un outil, un article ou un template utile...' },
]

const REACTIONS = ['🔥', '👏', '💡', '🚀', '❤️', '💪']
const SAVED_KEY = 'buildrs_saved_posts'

// ── Helpers ───────────────────────────────────────────────────────────────────
function timeAgo(date: string): string {
  const diff = Date.now() - new Date(date).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1)  return 'maintenant'
  if (mins < 60) return `${mins}m`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h`
  return `${Math.floor(hours / 24)}j`
}

function getSavedIds(): string[] {
  try { return JSON.parse(localStorage.getItem(SAVED_KEY) ?? '[]') } catch { return [] }
}
function setSavedIds(ids: string[]) {
  localStorage.setItem(SAVED_KEY, JSON.stringify(ids))
}

// ── System avatar (Buildrs / Jarvis / Alfred) ────────────────────────────────
function SystemAvatar({ name, size = 32 }: { name: string; size?: number }) {
  if (name === 'Buildrs') return (
    <div
      className="rounded-full bg-foreground flex items-center justify-center flex-shrink-0"
      style={{ width: size, height: size }}
    >
      <BuildrsIcon color="hsl(var(--background))" size={Math.round(size * 0.5)} />
    </div>
  )
  if (name === 'Jarvis') {
    const s = Math.round(size * 0.82)
    return (
      <div className="rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden" style={{ width: size, height: size, background: '#3730a318' }}>
        <svg width={s} height={s} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <rect x="7" y="0" width="2" height="3" fill="#818cf8"/>
          <rect x="15" y="0" width="2" height="3" fill="#818cf8"/>
          <rect x="5" y="2" width="2" height="2" fill="#818cf8"/>
          <rect x="17" y="2" width="2" height="2" fill="#818cf8"/>
          <rect x="3" y="4" width="18" height="12" rx="2" fill="#6366f1"/>
          <rect x="6" y="7" width="4" height="4" rx="1" fill="#c7d2fe"/>
          <rect x="14" y="7" width="4" height="4" rx="1" fill="#c7d2fe"/>
          <rect x="7" y="8" width="2" height="2" fill="#312e81"/>
          <rect x="15" y="8" width="2" height="2" fill="#312e81"/>
          <rect x="9" y="13" width="6" height="2" rx="1" fill="#4338ca"/>
          <rect x="5" y="17" width="4" height="4" rx="1" fill="#4338ca"/>
          <rect x="15" y="17" width="4" height="4" rx="1" fill="#4338ca"/>
          <rect x="4" y="20" width="3" height="2" rx="1" fill="#4338ca"/>
          <rect x="17" y="20" width="3" height="2" rx="1" fill="#4338ca"/>
        </svg>
      </div>
    )
  }
  // Alfred → avatar pixel art niveau scaler
  return (
    <BuilderAvatar level="scaler" size={size} />
  )
}

// ── Comments section ──────────────────────────────────────────────────────────
function CommentsSection({
  postId, userId, userDisplayName, userLevel,
}: {
  postId: string
  userId: string | undefined
  userDisplayName?: string
  userLevel?: string
}) {
  const [comments,   setComments]   = useState<Comment[]>([])
  const [loading,    setLoading]    = useState(true)
  const [content,    setContent]    = useState('')
  const [posting,    setPosting]    = useState(false)
  const [submitErr,  setSubmitErr]  = useState<string | null>(null)

  useEffect(() => {
    supabase
      .from('community_comments')
      .select('*')
      .eq('post_id', postId)
      .order('created_at', { ascending: true })
      .then(({ data, error }) => {
        if (!error) setComments((data as Comment[]) ?? [])
        setLoading(false)
      })
  }, [postId])

  const handleSubmit = useCallback(async () => {
    if (!content.trim() || !userId) return
    setPosting(true)
    setSubmitErr(null)

    const { data, error } = await supabase
      .from('community_comments')
      .insert({
        post_id:              postId,
        user_id:              userId,
        content:              content.trim(),
        author_display_name:  userDisplayName ?? null,
        author_level:         userLevel ?? 'explorer',
      })
      .select()
      .single()

    if (error) {
      console.error('[CommentsSection] insert error:', error)
      setSubmitErr(error.message)
    } else if (data) {
      setComments(prev => [...prev, data as Comment])
      setContent('')
    }
    setPosting(false)
  }, [content, userId, postId, userDisplayName, userLevel])

  return (
    <div className="mt-3 pt-3 border-t border-border space-y-3">
      {loading ? (
        <div className="flex justify-center py-2">
          <div className="w-4 h-4 rounded-full border border-foreground/20 border-t-foreground animate-spin" />
        </div>
      ) : comments.length === 0 ? (
        <p className="text-[11px] text-muted-foreground/50 text-center py-1">
          Aucune réponse — sois le premier.
        </p>
      ) : (
        comments.map(c => (
          <div key={c.id} className="flex items-start gap-2">
            <BuilderAvatar level={(c.author_level as BuilderLevel) ?? 'explorer'} size={24} />
            <div className="flex-1 min-w-0 bg-secondary/40 rounded-lg px-3 py-2">
              <div className="flex items-baseline gap-2 mb-0.5">
                <span className="text-[11px] font-semibold text-foreground">
                  {c.author_display_name ?? 'Builder'}
                </span>
                <span className="text-[10px] text-muted-foreground/40">{timeAgo(c.created_at)}</span>
              </div>
              <p className="text-[12px] text-foreground leading-relaxed">{c.content}</p>
            </div>
          </div>
        ))
      )}

      {submitErr && (
        <p className="text-[10px] text-red-500 px-1">{submitErr}</p>
      )}

      {userId && (
        <div className="flex items-center gap-2">
          <BuilderAvatar level={(userLevel as BuilderLevel) ?? 'explorer'} size={24} />
          <div className="flex-1 flex items-center gap-2 bg-secondary/40 rounded-lg px-3 py-1.5 border border-transparent focus-within:border-border transition-colors">
            <input
              value={content}
              onChange={e => setContent(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit() } }}
              placeholder="Répondre..."
              className="flex-1 bg-transparent text-xs text-foreground placeholder:text-muted-foreground/50 outline-none"
            />
            <button
              onClick={handleSubmit}
              disabled={!content.trim() || posting}
              className="text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30"
            >
              {posting
                ? <div className="w-3 h-3 rounded-full border border-current border-t-transparent animate-spin" />
                : <Send size={11} strokeWidth={1.5} />
              }
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Post card ─────────────────────────────────────────────────────────────────
function PostCard({
  post, userId, savedIds, onReact, onToggleSave, userDisplayName, userLevel, commentCount,
}: {
  post: CommunityPost
  userId: string | undefined
  savedIds: string[]
  onReact: (id: string, emoji: string) => void
  onToggleSave: (id: string) => void
  userDisplayName?: string
  userLevel?: string
  commentCount?: number
}) {
  const [showComments, setShowComments] = useState(false)
  const [localCommentCount, setLocalCommentCount] = useState(commentCount ?? 0)

  const typeInfo  = POST_TYPES.find(t => t.key === post.type) ?? { label: post.type, Icon: MessageSquare }
  const TypeIcon  = typeInfo.Icon
  const isSeed    = !!post.seed_author_name
  const authorName  = isSeed ? post.seed_author_name! : (post.author_email?.split('@')[0] ?? 'Builder')
  const authorLevel = (isSeed ? (post.seed_author_level as BuilderLevel) : 'explorer') ?? 'explorer'
  const isSystem  = authorName === 'Buildrs' || authorName === 'Jarvis' || authorName === 'Alfred'
  const isSaved   = savedIds.includes(post.id)

  return (
    <div className={`border rounded-xl p-4 transition-colors ${post.is_pinned ? 'border-foreground/20 bg-secondary/30' : 'border-border'}`}>
      {post.is_pinned && (
        <div className="flex items-center gap-1 mb-2.5">
          <Pin size={10} strokeWidth={1.5} className="text-muted-foreground/50" />
          <span className="text-[10px] font-medium text-muted-foreground/50 uppercase tracking-wider">Épinglé</span>
        </div>
      )}

      <div className="flex items-start gap-3">
        {isSystem
          ? <SystemAvatar name={authorName} size={32} />
          : <BuilderAvatar level={authorLevel} size={32} />
        }
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-foreground">{authorName}</span>
            {!post.is_pinned && (
              <>
                <TypeIcon size={11} strokeWidth={1.5} style={{ color: 'hsl(var(--muted-foreground))' }} />
                <span className="text-[10px] text-muted-foreground/60">{typeInfo.label}</span>
              </>
            )}
            <span className="text-[10px] text-muted-foreground/40 ml-auto">{timeAgo(post.created_at)}</span>
            {/* Save button */}
            <button
              onClick={() => onToggleSave(post.id)}
              className={`transition-colors ${isSaved ? 'text-foreground' : 'text-muted-foreground/30 hover:text-muted-foreground'}`}
            >
              <Bookmark size={12} strokeWidth={1.5} fill={isSaved ? 'currentColor' : 'none'} />
            </button>
          </div>

          {/* Content */}
          <p className="text-sm text-foreground leading-relaxed">{post.content}</p>

          {/* Reactions + reply */}
          <div className="flex items-center gap-1.5 mt-3 flex-wrap">
            {REACTIONS.map(emoji => {
              const count = post.reactions?.[emoji] ?? 0
              return (
                <button
                  key={emoji}
                  onClick={() => userId && onReact(post.id, emoji)}
                  disabled={!userId}
                  className={`flex items-center gap-0.5 px-2 py-0.5 rounded-full border transition-colors text-xs ${
                    count > 0
                      ? 'border-foreground/20 bg-secondary/50 text-foreground'
                      : 'border-transparent text-muted-foreground/30 hover:border-border hover:text-muted-foreground'
                  }`}
                >
                  {emoji}{count > 0 && <span className="font-medium ml-0.5">{count}</span>}
                </button>
              )
            })}

            <button
              onClick={() => { setShowComments(o => !o); if (!showComments) setLocalCommentCount(0) }}
              className="ml-auto flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
            >
              <MessageSquare size={11} strokeWidth={1.5} />
              {localCommentCount > 0 && !showComments
                ? <span>{localCommentCount} réponse{localCommentCount > 1 ? 's' : ''}</span>
                : <span>{showComments ? 'Masquer' : 'Répondre'}</span>
              }
              <ChevronDown
                size={10}
                strokeWidth={1.5}
                className={`transition-transform ${showComments ? 'rotate-180' : ''}`}
              />
            </button>
          </div>

          {/* Comments */}
          {showComments && (
            <CommentsSection
              postId={post.id}
              userId={userId}
              userDisplayName={userDisplayName}
              userLevel={userLevel}
            />
          )}
        </div>
      </div>
    </div>
  )
}

// ── Pinned sidebar card (compact) ─────────────────────────────────────────────
function PinnedCard({ post }: { post: CommunityPost }) {
  const [expanded, setExpanded] = useState(false)
  const authorName  = post.seed_author_name ?? 'Buildrs'
  const isSystem    = authorName === 'Buildrs' || authorName === 'Jarvis' || authorName === 'Alfred'
  const authorLevel = (post.seed_author_level as BuilderLevel) ?? 'explorer'
  // Show "Lire plus" only if content is long (rough threshold)
  const isLong = post.content.length > 120

  return (
    <div className="border border-foreground/10 rounded-xl p-3 bg-secondary/20 hover:border-foreground/20 transition-colors">
      <div className="flex items-start gap-2.5">
        {isSystem
          ? <SystemAvatar name={authorName} size={28} />
          : <BuilderAvatar level={authorLevel} size={28} />
        }
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-[11px] font-bold text-foreground">{authorName}</span>
            <span className="text-[9px] text-muted-foreground/40 ml-auto">{timeAgo(post.created_at)}</span>
          </div>
          <p className={`text-[11px] text-foreground/80 leading-relaxed ${!expanded && isLong ? 'line-clamp-3' : ''}`}>
            {post.content}
          </p>
          {isLong && (
            <button
              onClick={() => setExpanded(o => !o)}
              className="mt-1.5 flex items-center gap-0.5 text-[10px] font-semibold text-muted-foreground/60 hover:text-foreground transition-colors"
            >
              {expanded ? 'Réduire' : 'Lire plus'}
              <ChevronDown size={10} strokeWidth={1.5} className={`transition-transform ${expanded ? 'rotate-180' : ''}`} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Saved posts panel ─────────────────────────────────────────────────────────
function SavedPanel({
  savedIds, allFeedPosts, onClose, userId, onReact, onToggleSave, userDisplayName, userLevel,
}: {
  savedIds: string[]
  allFeedPosts: CommunityPost[]
  onClose: () => void
  userId: string | undefined
  onReact: (id: string, emoji: string) => void
  onToggleSave: (id: string) => void
  userDisplayName?: string
  userLevel?: string
}) {
  const savedPosts = allFeedPosts.filter(p => savedIds.includes(p.id))
  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative ml-auto w-full max-w-sm h-full bg-background border-l border-border flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border flex-shrink-0">
          <div className="flex items-center gap-2">
            <Bookmark size={14} strokeWidth={1.5} />
            <span className="text-[13px] font-bold">Messages sauvegardés</span>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-lg leading-none">&times;</button>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3">
          {savedPosts.length === 0 ? (
            <div className="text-center py-12">
              <Bookmark size={28} strokeWidth={1} className="text-muted-foreground/20 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">Aucun message sauvegardé</p>
              <p className="text-xs text-muted-foreground/50 mt-1">Clique sur le marque-page d'un post pour le retrouver ici.</p>
            </div>
          ) : savedPosts.map(p => (
            <PostCard
              key={p.id}
              post={p}
              userId={userId}
              savedIds={savedIds}
              onReact={onReact}
              onToggleSave={onToggleSave}
              userDisplayName={userDisplayName}
              userLevel={userLevel}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
interface Props {
  userId: string | undefined
  navigate: (hash: string) => void
  onPost?: () => void
  userDisplayName?: string
  userLevel?: string
}

const FILTER_OPTIONS: { key: CommunityPost['type'] | 'all'; label: string }[] = [
  { key: 'all',       label: 'Tout' },
  { key: 'win',       label: 'Wins' },
  { key: 'milestone', label: 'Avancements' },
  { key: 'idea',      label: 'Idées' },
  { key: 'question',  label: 'Questions' },
  { key: 'resource',  label: 'Ressources' },
]

export function CommunityPage({ userId, navigate: _navigate, onPost, userDisplayName, userLevel }: Props) {
  const { pinnedPosts, feedPosts, loading, addPost, toggleReaction } = useCommunityFeed(userId)

  const [newContent,   setNewContent]   = useState('')
  const [newType,      setNewType]      = useState<CommunityPost['type']>('win')
  const [posting,      setPosting]      = useState(false)
  const [filter,       setFilter]       = useState<CommunityPost['type'] | 'all'>('all')
  const [savedIds,     setSavedIdsState] = useState<string[]>(getSavedIds)
  const [showSaved,    setShowSaved]    = useState(false)

  const toggleSave = useCallback((id: string) => {
    setSavedIdsState(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
      setSavedIds(next)
      return next
    })
  }, [])

  const filteredFeed = useMemo(() =>
    filter === 'all' ? feedPosts : feedPosts.filter(p => p.type === filter),
    [feedPosts, filter]
  )

  const handlePost = async () => {
    if (!newContent.trim() || !userId) return
    setPosting(true)
    await addPost(newType, newContent.trim())
    onPost?.()
    setNewContent('')
    setPosting(false)
  }

  return (
    <div className="px-4 py-6 max-w-5xl mx-auto">

      {/* ── Page header ── */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight" style={{ letterSpacing: '-0.03em' }}>
            Communauté
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Partage tes wins, pose tes questions, inspire les autres builders.
          </p>
        </div>
        <button
          onClick={() => setShowSaved(true)}
          className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors border border-border rounded-lg px-3 py-1.5 hover:border-foreground/20"
        >
          <Bookmark size={12} strokeWidth={1.5} />
          Sauvegardés
          {savedIds.length > 0 && (
            <span className="ml-0.5 bg-foreground text-background text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
              {savedIds.length}
            </span>
          )}
        </button>
      </div>

      {/* ── Category filters ── */}
      <div className="flex gap-1.5 mb-5 overflow-x-auto pb-1 scrollbar-hide">
        {FILTER_OPTIONS.map(opt => (
          <button
            key={opt.key}
            onClick={() => setFilter(opt.key)}
            className={`flex-shrink-0 text-[11px] font-semibold px-3 py-1.5 rounded-lg border transition-colors ${
              filter === opt.key
                ? 'bg-foreground text-background border-foreground'
                : 'border-border text-muted-foreground hover:text-foreground hover:border-foreground/30'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* ── Two-column layout ── */}
      <div className="flex gap-5 items-start">

        {/* ── MAIN FEED (left / center) ── */}
        <div className="flex-1 min-w-0 flex flex-col gap-4">

          {/* Composer */}
          {userId && (
            <div className="border border-border rounded-xl p-4">
              <div className="flex gap-2 mb-3 flex-wrap">
                {POST_TYPES.map(t => (
                  <button
                    key={t.key}
                    onClick={() => setNewType(t.key)}
                    className={`flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-lg border transition-colors ${
                      newType === t.key
                        ? 'bg-foreground text-background border-foreground'
                        : 'border-border text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <t.Icon size={11} strokeWidth={1.5} />
                    {t.label}
                  </button>
                ))}
              </div>
              <textarea
                value={newContent}
                onChange={e => setNewContent(e.target.value)}
                placeholder={POST_TYPES.find(t => t.key === newType)?.placeholder ?? 'Écris quelque chose...'}
                rows={3}
                className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none resize-none"
              />
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                <span className="text-xs text-muted-foreground/50">{newContent.length} car.</span>
                <button
                  onClick={handlePost}
                  disabled={!newContent.trim() || posting}
                  className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-foreground text-background hover:opacity-90 transition-opacity disabled:opacity-40"
                >
                  <Send size={12} strokeWidth={1.5} />
                  Publier
                </button>
              </div>
            </div>
          )}

          {/* Feed list */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-5 h-5 rounded-full border-2 border-foreground/20 border-t-foreground animate-spin" />
            </div>
          ) : filteredFeed.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-border rounded-xl">
              <MessageSquare size={28} strokeWidth={1} className="text-muted-foreground/20 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">
                {filter === 'all' ? 'Le feed est vide — sois le premier à publier !' : `Aucun post de type "${FILTER_OPTIONS.find(o=>o.key===filter)?.label}".`}
              </p>
            </div>
          ) : (
            filteredFeed.map(post => (
              <PostCard
                key={post.id}
                post={post}
                userId={userId}
                savedIds={savedIds}
                onReact={toggleReaction}
                onToggleSave={toggleSave}
                userDisplayName={userDisplayName}
                userLevel={userLevel}
              />
            ))
          )}
        </div>

        {/* ── PINNED SIDEBAR (right, desktop only) ── */}
        <div className="hidden lg:flex flex-col gap-3 w-72 flex-shrink-0 sticky top-4">
          <div className="flex items-center gap-1.5 mb-1">
            <Pin size={11} strokeWidth={1.5} className="text-muted-foreground/50" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">Messages épinglés</span>
          </div>
          {pinnedPosts.length === 0 ? (
            <p className="text-xs text-muted-foreground/40 text-center py-4">Aucun message épinglé.</p>
          ) : (
            pinnedPosts.map(p => <PinnedCard key={p.id} post={p} />)
          )}
        </div>

      </div>

      {/* ── Saved panel ── */}
      {showSaved && (
        <SavedPanel
          savedIds={savedIds}
          allFeedPosts={feedPosts}
          onClose={() => setShowSaved(false)}
          userId={userId}
          onReact={toggleReaction}
          onToggleSave={toggleSave}
          userDisplayName={userDisplayName}
          userLevel={userLevel}
        />
      )}
    </div>
  )
}
