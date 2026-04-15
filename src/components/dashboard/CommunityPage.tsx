import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import {
  Send, MessageSquare, Trophy, Lightbulb, HelpCircle, BookOpen,
  Flag, Pin, Bookmark, ChevronDown, Image, Search, X, UserPlus,
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

interface MentionUser {
  user_id: string
  display_name: string
  level: string | null
}

interface GiphyResult {
  id: string
  images: { downsized: { url: string }; fixed_height_small: { url: string } }
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

// GIF proxy via Supabase edge function (avoids CORS)
const GIF_PROXY = 'https://ihgbbgwhgmosfjaknvlf.supabase.co/functions/v1/gif-search'

const INTRO_TEMPLATE = `Salut la commu ! Je m'appelle [Prénom], je viens de [Ville].
Je build [Nom du projet] — [description en 1 phrase].
Mon objectif : [MRR / flip / commande client].
Hâte d'échanger avec vous.`

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

// Render content: @mentions + [gif:url]
function renderContent(text: string): React.ReactNode {
  // Split on [gif:...] blocks first, then handle @mentions inside text parts
  const gifParts = text.split(/(\[gif:[^\]]+\])/g)
  return gifParts.map((part, i) => {
    const gifMatch = part.match(/^\[gif:(.+)\]$/)
    if (gifMatch) {
      return (
        <img
          key={i}
          src={gifMatch[1]}
          alt="gif"
          style={{ maxWidth: 260, borderRadius: 8, display: 'block', marginTop: 6 }}
          loading="lazy"
        />
      )
    }
    // Handle @mentions in text parts
    return part.split(/(@\w+)/g).map((chunk, j) =>
      /^@\w+$/.test(chunk)
        ? <span key={`${i}-${j}`} style={{ color: '#6366f1', fontWeight: 600 }}>{chunk}</span>
        : chunk
    )
  })
}

// ── System avatar ─────────────────────────────────────────────────────────────
function SystemAvatar({ name, size = 32 }: { name: string; size?: number }) {
  if (name === 'Buildrs') return (
    <div className="rounded-full bg-foreground flex items-center justify-center flex-shrink-0" style={{ width: size, height: size }}>
      <BuildrsIcon color="hsl(var(--background))" size={Math.round(size * 0.5)} />
    </div>
  )
  if (name === 'Jarvis') {
    const s = Math.round(size * 0.82)
    return (
      <div className="rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden" style={{ width: size, height: size, background: '#3730a318' }}>
        <svg width={s} height={s} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <rect x="7" y="0" width="2" height="3" fill="#818cf8"/><rect x="15" y="0" width="2" height="3" fill="#818cf8"/>
          <rect x="5" y="2" width="2" height="2" fill="#818cf8"/><rect x="17" y="2" width="2" height="2" fill="#818cf8"/>
          <rect x="3" y="4" width="18" height="12" rx="2" fill="#6366f1"/>
          <rect x="6" y="7" width="4" height="4" rx="1" fill="#c7d2fe"/><rect x="14" y="7" width="4" height="4" rx="1" fill="#c7d2fe"/>
          <rect x="7" y="8" width="2" height="2" fill="#312e81"/><rect x="15" y="8" width="2" height="2" fill="#312e81"/>
          <rect x="9" y="13" width="6" height="2" rx="1" fill="#4338ca"/>
          <rect x="5" y="17" width="4" height="4" rx="1" fill="#4338ca"/><rect x="15" y="17" width="4" height="4" rx="1" fill="#4338ca"/>
          <rect x="4" y="20" width="3" height="2" rx="1" fill="#4338ca"/><rect x="17" y="20" width="3" height="2" rx="1" fill="#4338ca"/>
        </svg>
      </div>
    )
  }
  return <BuilderAvatar level="scaler" size={size} />
}

// ── @mention autocomplete hook ────────────────────────────────────────────────
function useMentionAutocomplete(value: string, cursorPos: number) {
  const [results, setResults] = useState<MentionUser[]>([])
  const [query,   setQuery]   = useState<string | null>(null)

  useEffect(() => {
    const before = value.slice(0, cursorPos)
    const match  = before.match(/@(\w+)$/)
    if (!match) { setQuery(null); setResults([]); return }
    const q = match[1]
    setQuery(q)
    supabase.from('user_profiles_buildrs').select('user_id, display_name, level').ilike('display_name', `%${q}%`).limit(6)
      .then(({ data }) => setResults((data as MentionUser[]) ?? []))
  }, [value, cursorPos])

  return { mentionQuery: query, mentionResults: results }
}

// ── GIF Picker ────────────────────────────────────────────────────────────────
function GifPicker({ onSelect, onClose }: { onSelect: (url: string) => void; onClose: () => void }) {
  const [q,       setQ]       = useState('')
  const [gifs,    setGifs]    = useState<GiphyResult[]>([])
  const [loading, setLoading] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const search = useCallback(async (query: string) => {
    setLoading(true)
    try {
      const endpoint = `${GIF_PROXY}?q=${encodeURIComponent(query)}&limit=12`
      const res  = await fetch(endpoint)
      const data = await res.json()
      setGifs(data.data ?? [])
    } catch { /* ignore */ }
    setLoading(false)
  }, [])

  // Load trending on mount (empty string = trending endpoint in proxy)
  useEffect(() => { search('') }, [search])

  const handleInput = (val: string) => {
    setQ(val)
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => search(val), 400)
  }

  return (
    <div className="absolute z-50 bottom-full mb-2 left-0 right-0 bg-background border border-border rounded-xl shadow-xl overflow-hidden" style={{ maxHeight: 320 }}>
      {/* Search bar */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-border">
        <Search size={13} strokeWidth={1.5} className="text-muted-foreground flex-shrink-0" />
        <input
          autoFocus
          value={q}
          onChange={e => handleInput(e.target.value)}
          placeholder="Chercher un GIF..."
          className="flex-1 bg-transparent text-xs text-foreground placeholder:text-muted-foreground/50 outline-none"
        />
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
          <X size={13} strokeWidth={1.5} />
        </button>
      </div>

      {/* Grid */}
      <div className="overflow-y-auto" style={{ maxHeight: 260 }}>
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="w-4 h-4 rounded-full border-2 border-foreground/20 border-t-foreground animate-spin" />
          </div>
        ) : gifs.length === 0 ? (
          <p className="text-center text-xs text-muted-foreground/50 py-8">Aucun résultat</p>
        ) : (
          <div className="grid grid-cols-3 gap-1 p-2">
            {gifs.map(gif => (
              <button
                key={gif.id}
                type="button"
                onMouseDown={e => { e.preventDefault(); onSelect(gif.images.downsized.url) }}
                className="aspect-video overflow-hidden rounded-md hover:opacity-80 transition-opacity"
              >
                <img
                  src={gif.images.fixed_height_small.url}
                  alt=""
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        )}
        <p className="text-center text-[9px] text-muted-foreground/30 py-1 pb-2">Powered by GIPHY</p>
      </div>
    </div>
  )
}

// ── @mention dropdown ─────────────────────────────────────────────────────────
function MentionDropdown({ results, onSelect }: { results: MentionUser[]; onSelect: (u: MentionUser) => void }) {
  if (results.length === 0) return null
  return (
    <div className="absolute z-50 bottom-full mb-1 left-0 right-0 bg-background border border-border rounded-xl shadow-lg overflow-hidden">
      {results.map(u => (
        <button key={u.user_id} type="button" onMouseDown={e => { e.preventDefault(); onSelect(u) }}
          className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-secondary/60 transition-colors">
          <BuilderAvatar level={(u.level as BuilderLevel) ?? 'explorer'} size={22} />
          <span className="text-xs font-semibold text-foreground">@{u.display_name}</span>
          {u.level && <span className="ml-auto text-[10px] text-muted-foreground/50 capitalize">{u.level}</span>}
        </button>
      ))}
    </div>
  )
}

// ── Comments section ──────────────────────────────────────────────────────────
function CommentsSection({
  postId, userId, userDisplayName, userLevel, onCommentAdded,
}: {
  postId: string
  userId: string | undefined
  userDisplayName?: string
  userLevel?: string
  onCommentAdded?: () => void
}) {
  const [comments,  setComments]  = useState<Comment[]>([])
  const [loading,   setLoading]   = useState(true)
  const [content,   setContent]   = useState('')
  const [posting,   setPosting]   = useState(false)
  const [submitErr, setSubmitErr] = useState<string | null>(null)

  useEffect(() => {
    supabase.from('community_comments').select('*').eq('post_id', postId)
      .order('created_at', { ascending: true })
      .then(({ data, error }) => {
        if (!error) setComments((data as Comment[]) ?? [])
        setLoading(false)
      })
  }, [postId])

  const handleSubmit = useCallback(async () => {
    if (!content.trim() || !userId) return
    setPosting(true); setSubmitErr(null)
    const { data, error } = await supabase.from('community_comments')
      .insert({ post_id: postId, user_id: userId, content: content.trim(), author_display_name: userDisplayName ?? null, author_level: userLevel ?? 'explorer' })
      .select().single()
    if (error) { setSubmitErr(error.message) }
    else if (data) { setComments(prev => [...prev, data as Comment]); setContent(''); onCommentAdded?.() }
    setPosting(false)
  }, [content, userId, postId, userDisplayName, userLevel, onCommentAdded])

  return (
    <div className="mt-3 pt-3 border-t border-border space-y-3">
      {loading ? (
        <div className="flex justify-center py-2"><div className="w-4 h-4 rounded-full border border-foreground/20 border-t-foreground animate-spin" /></div>
      ) : comments.length === 0 ? (
        <p className="text-[11px] text-muted-foreground/50 text-center py-1">Aucune réponse — sois le premier.</p>
      ) : (
        comments.map(c => (
          <div key={c.id} className="flex items-start gap-2">
            {(c.author_display_name === 'Jarvis')
              ? <SystemAvatar name="Jarvis" size={24} />
              : <BuilderAvatar level={(c.author_level as BuilderLevel) ?? 'explorer'} size={24} />
            }
            <div className="flex-1 min-w-0 bg-secondary/40 rounded-lg px-3 py-2">
              <div className="flex items-baseline gap-2 mb-0.5">
                <span className="text-[11px] font-semibold text-foreground">{c.author_display_name ?? 'Builder'}</span>
                <span className="text-[10px] text-muted-foreground/40">{timeAgo(c.created_at)}</span>
              </div>
              <div className="text-[12px] text-foreground leading-relaxed">{renderContent(c.content)}</div>
            </div>
          </div>
        ))
      )}
      {submitErr && <p className="text-[10px] text-red-500 px-1">{submitErr}</p>}
      {userId && (
        <div className="flex items-center gap-2">
          <BuilderAvatar level={(userLevel as BuilderLevel) ?? 'explorer'} size={24} />
          <div className="flex-1 flex items-center gap-2 bg-secondary/40 rounded-lg px-3 py-1.5 border border-transparent focus-within:border-border transition-colors">
            <input value={content} onChange={e => setContent(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit() } }}
              placeholder="Répondre..." className="flex-1 bg-transparent text-xs text-foreground placeholder:text-muted-foreground/50 outline-none" />
            <button onClick={handleSubmit} disabled={!content.trim() || posting} className="text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30">
              {posting ? <div className="w-3 h-3 rounded-full border border-current border-t-transparent animate-spin" /> : <Send size={11} strokeWidth={1.5} />}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Post card ─────────────────────────────────────────────────────────────────
function PostCard({
  post, userId, savedIds, onReact, onToggleSave, userDisplayName, userLevel, commentCount, onCommentAdded,
}: {
  post: CommunityPost
  userId: string | undefined
  savedIds: string[]
  onReact: (id: string, emoji: string) => void
  onToggleSave: (id: string) => void
  userDisplayName?: string
  userLevel?: string
  commentCount: number
  onCommentAdded: (postId: string) => void
}) {
  const [showComments,    setShowComments]    = useState(false)
  const [localCount,      setLocalCount]      = useState(commentCount)

  // Keep local count in sync when prop updates (e.g., after backfill)
  useEffect(() => { setLocalCount(commentCount) }, [commentCount])

  const typeInfo    = POST_TYPES.find(t => t.key === post.type) ?? { label: post.type, Icon: MessageSquare }
  const TypeIcon    = typeInfo.Icon
  const isSeed      = !!post.seed_author_name
  const authorName  = isSeed ? post.seed_author_name! : (post.author_display_name ?? 'Builder')
  const authorLevel = (isSeed ? (post.seed_author_level as BuilderLevel) : (post.author_level as BuilderLevel)) ?? 'explorer'
  const isSystem    = authorName === 'Buildrs' || authorName === 'Jarvis' || authorName === 'Alfred'
  const isSaved     = savedIds.includes(post.id)

  const handleCommentAdded = () => {
    setLocalCount(c => c + 1)
    onCommentAdded(post.id)
  }

  return (
    <div className={`border rounded-xl p-4 transition-colors ${post.is_pinned ? 'border-foreground/20 bg-secondary/30' : 'border-border'}`}>
      {post.is_pinned && (
        <div className="flex items-center gap-1 mb-2.5">
          <Pin size={10} strokeWidth={1.5} className="text-muted-foreground/50" />
          <span className="text-[10px] font-medium text-muted-foreground/50 uppercase tracking-wider">Épinglé</span>
        </div>
      )}
      <div className="flex items-start gap-3">
        {isSystem ? <SystemAvatar name={authorName} size={32} /> : <BuilderAvatar level={authorLevel} size={32} />}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-foreground">{authorName}</span>
            {!post.is_pinned && (
              <>
                <TypeIcon size={11} strokeWidth={1.5} style={{ color: 'hsl(var(--muted-foreground))' }} />
                <span className="text-[10px] text-muted-foreground/60">{typeInfo.label}</span>
              </>
            )}
            <span className="text-[10px] text-muted-foreground/40 ml-auto">{timeAgo(post.created_at)}</span>
            <button onClick={() => onToggleSave(post.id)}
              className={`transition-colors ${isSaved ? 'text-foreground' : 'text-muted-foreground/30 hover:text-muted-foreground'}`}>
              <Bookmark size={12} strokeWidth={1.5} fill={isSaved ? 'currentColor' : 'none'} />
            </button>
          </div>

          <div className="text-sm text-foreground leading-relaxed">{renderContent(post.content)}</div>

          <div className="flex items-center gap-1.5 mt-3 flex-wrap">
            {REACTIONS.map(emoji => {
              const count = post.reactions?.[emoji] ?? 0
              return (
                <button key={emoji} onClick={() => userId && onReact(post.id, emoji)} disabled={!userId}
                  className={`flex items-center gap-0.5 px-2 py-0.5 rounded-full border transition-colors text-xs ${
                    count > 0 ? 'border-foreground/20 bg-secondary/50 text-foreground' : 'border-transparent text-muted-foreground/30 hover:border-border hover:text-muted-foreground'
                  }`}>
                  {emoji}{count > 0 && <span className="font-medium ml-0.5">{count}</span>}
                </button>
              )
            })}

            <button
              onClick={() => setShowComments(o => !o)}
              className="ml-auto flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
            >
              <MessageSquare size={11} strokeWidth={1.5} />
              {!showComments && localCount > 0
                ? <span className="font-semibold">{localCount} réponse{localCount > 1 ? 's' : ''}</span>
                : <span>{showComments ? 'Masquer' : 'Répondre'}</span>
              }
              <ChevronDown size={10} strokeWidth={1.5} className={`transition-transform ${showComments ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {showComments && (
            <CommentsSection
              postId={post.id} userId={userId}
              userDisplayName={userDisplayName} userLevel={userLevel}
              onCommentAdded={handleCommentAdded}
            />
          )}
        </div>
      </div>
    </div>
  )
}

// ── Pinned sidebar card ───────────────────────────────────────────────────────
function PinnedCard({ post }: { post: CommunityPost }) {
  const [expanded, setExpanded] = useState(false)
  const authorName  = post.seed_author_name ?? 'Buildrs'
  const isSystem    = authorName === 'Buildrs' || authorName === 'Jarvis' || authorName === 'Alfred'
  const authorLevel = (post.seed_author_level as BuilderLevel) ?? 'explorer'
  const isLong = post.content.length > 120
  return (
    <div className="border border-foreground/10 rounded-xl p-3 bg-secondary/20 hover:border-foreground/20 transition-colors">
      <div className="flex items-start gap-2.5">
        {isSystem ? <SystemAvatar name={authorName} size={28} /> : <BuilderAvatar level={authorLevel} size={28} />}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-[11px] font-bold text-foreground">{authorName}</span>
            <span className="text-[9px] text-muted-foreground/40 ml-auto">{timeAgo(post.created_at)}</span>
          </div>
          <div className={`text-[11px] text-foreground/80 leading-relaxed ${!expanded && isLong ? 'line-clamp-3' : ''}`}>
            {renderContent(post.content)}
          </div>
          {isLong && (
            <button onClick={() => setExpanded(o => !o)} className="mt-1.5 flex items-center gap-0.5 text-[10px] font-semibold text-muted-foreground/60 hover:text-foreground transition-colors">
              {expanded ? 'Réduire' : 'Lire plus'}
              <ChevronDown size={10} strokeWidth={1.5} className={`transition-transform ${expanded ? 'rotate-180' : ''}`} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Saved panel ───────────────────────────────────────────────────────────────
function SavedPanel({ savedIds, allFeedPosts, onClose, userId, onReact, onToggleSave, userDisplayName, userLevel, commentCounts, onCommentAdded }: {
  savedIds: string[]; allFeedPosts: CommunityPost[]; onClose: () => void; userId: string | undefined
  onReact: (id: string, emoji: string) => void; onToggleSave: (id: string) => void
  userDisplayName?: string; userLevel?: string
  commentCounts: Record<string, number>; onCommentAdded: (postId: string) => void
}) {
  const savedPosts = allFeedPosts.filter(p => savedIds.includes(p.id))
  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative ml-auto w-full max-w-sm h-full bg-background border-l border-border flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border flex-shrink-0">
          <div className="flex items-center gap-2"><Bookmark size={14} strokeWidth={1.5} /><span className="text-[13px] font-bold">Messages sauvegardés</span></div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-lg leading-none">&times;</button>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3">
          {savedPosts.length === 0 ? (
            <div className="text-center py-12">
              <Bookmark size={28} strokeWidth={1} className="text-muted-foreground/20 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">Aucun message sauvegardé</p>
            </div>
          ) : savedPosts.map(p => (
            <PostCard key={p.id} post={p} userId={userId} savedIds={savedIds}
              onReact={onReact} onToggleSave={onToggleSave}
              userDisplayName={userDisplayName} userLevel={userLevel}
              commentCount={commentCounts[p.id] ?? 0} onCommentAdded={onCommentAdded} />
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Post composer ─────────────────────────────────────────────────────────────
function PostComposer({ userId, userDisplayName, userLevel, onPosted, addPost }: {
  userId: string | undefined; userDisplayName?: string; userLevel?: string
  onPosted?: () => void
  addPost: (type: CommunityPost['type'], content: string, displayName?: string, level?: string) => Promise<CommunityPost | null>
}) {
  const [newContent, setNewContent] = useState('')
  const [newType,    setNewType]    = useState<CommunityPost['type']>('win')
  const [posting,    setPosting]    = useState(false)
  const [cursorPos,  setCursorPos]  = useState(0)
  const [showGif,    setShowGif]    = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const { mentionQuery, mentionResults } = useMentionAutocomplete(newContent, cursorPos)

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewContent(e.target.value); setCursorPos(e.target.selectionStart ?? 0)
  }
  const handleKeyUp = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    setCursorPos((e.target as HTMLTextAreaElement).selectionStart ?? 0)
  }

  const insertMention = (user: MentionUser) => {
    const before   = newContent.slice(0, cursorPos)
    const after    = newContent.slice(cursorPos)
    const replaced = before.replace(/@\w*$/, `@${user.display_name} `)
    setNewContent(replaced + after); setCursorPos(replaced.length)
    setTimeout(() => textareaRef.current?.focus(), 0)
  }

  const insertGif = (url: string) => {
    setNewContent(prev => prev + (prev ? '\n' : '') + `[gif:${url}]`)
    setShowGif(false)
    setTimeout(() => textareaRef.current?.focus(), 0)
  }

  const applyIntroTemplate = () => {
    setNewContent(INTRO_TEMPLATE)
    setNewType('win')
    setTimeout(() => textareaRef.current?.focus(), 0)
  }

  const sendMentionNotifications = async (content: string) => {
    const matches = [...content.matchAll(/@(\w+)/g)].map(m => m[1])
    if (!matches.length) return
    const unique = [...new Set(matches)]
    const { data: users } = await supabase.from('user_profiles_buildrs').select('user_id, display_name').in('display_name', unique)
    if (!users?.length) return
    const notifs = (users as { user_id: string; display_name: string }[])
      .filter(u => u.user_id !== userId)
      .map(u => ({ user_id: u.user_id, type: 'mention', title: 'Tu as été mentionné', message: `${userDisplayName ?? 'Un builder'} t'a mentionné : "${content.slice(0, 80)}${content.length > 80 ? '…' : ''}"`, link: '#/dashboard/community', is_read: false }))
    if (notifs.length) await supabase.from('notifications').insert(notifs)
  }

  const triggerJarvisReply = async (postId: string, content: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return
      await supabase.functions.invoke('jarvis-community-reply', {
        body: { post_id: postId, content, type: newType, author: userDisplayName ?? 'Builder' },
      })
    } catch { /* fire and forget */ }
  }

  const handlePost = async () => {
    if (!newContent.trim() || !userId) return
    setPosting(true)
    const content = newContent.trim()
    const post = await addPost(newType, content, userDisplayName, userLevel)
    if (post) {
      await sendMentionNotifications(content)
      triggerJarvisReply(post.id, content) // fire and forget
    }
    onPosted?.()
    setNewContent(''); setCursorPos(0); setPosting(false)
  }

  return (
    <div className="border border-border rounded-xl p-4">
      {/* Intro template CTA */}
      <button onClick={applyIntroTemplate}
        className="w-full flex items-center gap-2 text-left mb-3 px-3 py-2 rounded-lg border border-dashed border-border hover:border-foreground/30 hover:bg-secondary/40 transition-colors group">
        <UserPlus size={13} strokeWidth={1.5} className="text-muted-foreground/50 group-hover:text-foreground transition-colors flex-shrink-0" />
        <span className="text-[11px] text-muted-foreground/60 group-hover:text-foreground transition-colors">Tu viens d'arriver ? Utilise le template de présentation →</span>
      </button>

      {/* Type selector */}
      <div className="flex gap-2 mb-3 flex-wrap">
        {POST_TYPES.map(t => (
          <button key={t.key} onClick={() => setNewType(t.key)}
            className={`flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-lg border transition-colors ${
              newType === t.key ? 'bg-foreground text-background border-foreground' : 'border-border text-muted-foreground hover:text-foreground'
            }`}>
            <t.Icon size={11} strokeWidth={1.5} />{t.label}
          </button>
        ))}
      </div>

      {/* Textarea + dropdowns */}
      <div className="relative">
        <textarea ref={textareaRef} value={newContent} onChange={handleChange} onKeyUp={handleKeyUp}
          onClick={handleKeyUp as unknown as React.MouseEventHandler<HTMLTextAreaElement>}
          placeholder={POST_TYPES.find(t => t.key === newType)?.placeholder ?? 'Écris quelque chose... (@pseudo pour mentionner)'}
          rows={3} className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none resize-none" />

        {mentionQuery !== null && mentionResults.length > 0 && (
          <MentionDropdown results={mentionResults} onSelect={insertMention} />
        )}
        {showGif && <GifPicker onSelect={insertGif} onClose={() => setShowGif(false)} />}
      </div>

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground/50">{newContent.length} car.</span>
          <button onClick={() => setShowGif(o => !o)}
            className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-lg border transition-colors ${showGif ? 'border-foreground/30 text-foreground bg-secondary/50' : 'border-transparent text-muted-foreground/50 hover:text-foreground hover:border-border'}`}>
            <Image size={12} strokeWidth={1.5} /> GIF
          </button>
        </div>
        <button onClick={handlePost} disabled={!newContent.trim() || posting}
          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-foreground text-background hover:opacity-90 transition-opacity disabled:opacity-40">
          <Send size={12} strokeWidth={1.5} /> Publier
        </button>
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
  const { pinnedPosts, feedPosts, loading, addPost, toggleReaction, commentCounts, incrementCommentCount } = useCommunityFeed(userId)

  const [filter,       setFilter]        = useState<CommunityPost['type'] | 'all'>('all')
  const [savedIds,     setSavedIdsState] = useState<string[]>(getSavedIds)
  const [showSaved,    setShowSaved]     = useState(false)

  const toggleSave = useCallback((id: string) => {
    setSavedIdsState(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
      setSavedIds(next); return next
    })
  }, [])

  const filteredFeed = useMemo(() =>
    filter === 'all' ? feedPosts : feedPosts.filter(p => p.type === filter),
    [feedPosts, filter]
  )

  return (
    <div className="px-4 py-6 max-w-5xl mx-auto">

      <div className="flex items-start justify-between mb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight" style={{ letterSpacing: '-0.03em' }}>Communauté</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Partage tes wins, pose tes questions, inspire les autres builders.</p>
        </div>
        <button onClick={() => setShowSaved(true)}
          className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors border border-border rounded-lg px-3 py-1.5 hover:border-foreground/20">
          <Bookmark size={12} strokeWidth={1.5} />
          Sauvegardés
          {savedIds.length > 0 && (
            <span className="ml-0.5 bg-foreground text-background text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">{savedIds.length}</span>
          )}
        </button>
      </div>

      <div className="flex gap-1.5 mb-5 overflow-x-auto pb-1 scrollbar-hide">
        {FILTER_OPTIONS.map(opt => (
          <button key={opt.key} onClick={() => setFilter(opt.key)}
            className={`flex-shrink-0 text-[11px] font-semibold px-3 py-1.5 rounded-lg border transition-colors ${
              filter === opt.key ? 'bg-foreground text-background border-foreground' : 'border-border text-muted-foreground hover:text-foreground hover:border-foreground/30'
            }`}>
            {opt.label}
          </button>
        ))}
      </div>

      <div className="flex gap-5 items-start">

        <div className="flex-1 min-w-0 flex flex-col gap-4">
          {userId && (
            <PostComposer userId={userId} userDisplayName={userDisplayName} userLevel={userLevel} onPosted={onPost} addPost={addPost} />
          )}

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-5 h-5 rounded-full border-2 border-foreground/20 border-t-foreground animate-spin" />
            </div>
          ) : filteredFeed.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-border rounded-xl">
              <MessageSquare size={28} strokeWidth={1} className="text-muted-foreground/20 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">
                {filter === 'all' ? 'Le feed est vide — sois le premier à publier !' : `Aucun post de type "${FILTER_OPTIONS.find(o => o.key === filter)?.label}".`}
              </p>
            </div>
          ) : (
            filteredFeed.map(post => (
              <PostCard key={post.id} post={post} userId={userId} savedIds={savedIds}
                onReact={toggleReaction} onToggleSave={toggleSave}
                userDisplayName={userDisplayName} userLevel={userLevel}
                commentCount={commentCounts[post.id] ?? 0}
                onCommentAdded={incrementCommentCount}
              />
            ))
          )}
        </div>

        <div className="hidden lg:flex flex-col gap-3 w-72 flex-shrink-0 sticky top-4">
          <div className="flex items-center gap-1.5 mb-1">
            <Pin size={11} strokeWidth={1.5} className="text-muted-foreground/50" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">Messages épinglés</span>
          </div>
          {pinnedPosts.length === 0
            ? <p className="text-xs text-muted-foreground/40 text-center py-4">Aucun message épinglé.</p>
            : pinnedPosts.map(p => <PinnedCard key={p.id} post={p} />)
          }
        </div>

      </div>

      {showSaved && (
        <SavedPanel savedIds={savedIds} allFeedPosts={feedPosts} onClose={() => setShowSaved(false)}
          userId={userId} onReact={toggleReaction} onToggleSave={toggleSave}
          userDisplayName={userDisplayName} userLevel={userLevel}
          commentCounts={commentCounts} onCommentAdded={incrementCommentCount} />
      )}
    </div>
  )
}
