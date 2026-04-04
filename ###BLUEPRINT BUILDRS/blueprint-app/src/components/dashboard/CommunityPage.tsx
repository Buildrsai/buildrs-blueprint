import { useState } from 'react'
import { Send, MessageSquare, Trophy, Lightbulb, HelpCircle, BookOpen, Flag } from 'lucide-react'
import { useCommunityFeed, type CommunityPost } from '../../hooks/useCommunityFeed'

const POST_TYPES: { key: CommunityPost['type']; label: string; Icon: React.ComponentType<{ size?: number; strokeWidth?: number; style?: React.CSSProperties }>; placeholder: string }[] = [
  { key: 'win',       label: 'Win',        Icon: Trophy,     placeholder: 'Partage ton dernier win...' },
  { key: 'milestone', label: 'Avancement', Icon: Flag,       placeholder: 'Quel milestone viens-tu de completer ?' },
  { key: 'idea',      label: 'Idee',       Icon: Lightbulb,  placeholder: 'Une idee a partager avec la communaute...' },
  { key: 'question',  label: 'Question',   Icon: HelpCircle, placeholder: 'Pose ta question — la communaute repond.' },
  { key: 'resource',  label: 'Ressource',  Icon: BookOpen,   placeholder: 'Partage un outil, un article ou un template utile...' },
]

const REACTIONS = ['🔥', '👏', '💡', '🚀', '❤️']

function PostCard({ post, userId, onReact }: {
  post: CommunityPost
  userId: string | undefined
  onReact: (postId: string, emoji: string) => void
}) {
  const typeInfo = POST_TYPES.find(t => t.key === post.type) ?? { label: post.type, Icon: MessageSquare }
  const TypeIcon = typeInfo.Icon

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 60) return `${mins}m`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `${hours}h`
    return `${Math.floor(hours / 24)}j`
  }

  return (
    <div className="border border-border rounded-xl p-4">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 text-xs font-bold text-muted-foreground">
          {post.author_email ? post.author_email[0].toUpperCase() : '?'}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-foreground">
              {post.author_email?.split('@')[0] ?? 'Builder'}
            </span>
            <TypeIcon size={11} strokeWidth={1.5} style={{ color: 'hsl(var(--muted-foreground))' }} />
            <span className="text-[10px] text-muted-foreground/60">{typeInfo?.label}</span>
            <span className="text-[10px] text-muted-foreground/40 ml-auto">{timeAgo(post.created_at)}</span>
          </div>
          <p className="text-sm text-foreground leading-relaxed">{post.content}</p>

          {/* Reactions */}
          <div className="flex items-center gap-1.5 mt-3">
            {REACTIONS.map(emoji => {
              const count = post.reactions[emoji] ?? 0
              return (
                <button
                  key={emoji}
                  onClick={() => userId && onReact(post.id, emoji)}
                  className={`flex items-center gap-0.5 px-2 py-0.5 rounded-full border transition-colors text-xs ${
                    count > 0
                      ? 'border-foreground/20 bg-secondary/50 text-foreground'
                      : 'border-transparent text-muted-foreground/30 hover:border-border hover:text-muted-foreground'
                  }`}
                  disabled={!userId}
                >
                  {emoji}{count > 0 && <span className="font-medium">{count}</span>}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

interface Props {
  userId: string | undefined
  navigate: (hash: string) => void
  onPost?: () => void
}

export function CommunityPage({ userId, navigate: _navigate, onPost }: Props) {
  const { posts, loading, hasMore, loadMore, addPost, toggleReaction } = useCommunityFeed(userId)
  const [newContent, setNewContent] = useState('')
  const [newType, setNewType] = useState<CommunityPost['type']>('win')
  const [posting, setPosting] = useState(false)

  const handlePost = async () => {
    if (!newContent.trim() || !userId) return
    setPosting(true)
    await addPost(newType, newContent.trim())
    onPost?.()
    setNewContent('')
    setPosting(false)
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">

      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-foreground tracking-tight" style={{ letterSpacing: '-0.03em' }}>
          Communaute
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Partage tes wins, pose tes questions, inspire les autres builders.
        </p>
      </div>

      {/* Post composer */}
      {userId && (
        <div className="border border-border rounded-xl p-4 mb-6">
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
            placeholder={POST_TYPES.find(t => t.key === newType)?.placeholder ?? 'Ecris quelque chose...'}
            rows={3}
            className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none resize-none"
          />
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
            <span className="text-xs text-muted-foreground/50">{newContent.length} caracteres</span>
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

      {/* Feed */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-5 h-5 rounded-full border-2 border-foreground/20 border-t-foreground animate-spin" />
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-border rounded-xl">
          <MessageSquare size={32} strokeWidth={1} className="text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Le feed est vide — sois le premier a publier !</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {posts.map(post => (
            <PostCard
              key={post.id}
              post={post}
              userId={userId}
              onReact={toggleReaction}
            />
          ))}
          {hasMore && (
            <button
              onClick={loadMore}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors text-center py-2"
            >
              Charger plus
            </button>
          )}
        </div>
      )}

    </div>
  )
}
