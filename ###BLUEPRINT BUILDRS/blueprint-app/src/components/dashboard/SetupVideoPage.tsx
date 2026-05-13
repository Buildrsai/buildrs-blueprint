import { useState, useEffect, useRef } from 'react'
import {
  Play, Clock, Star, ChevronLeft, ChevronRight, ExternalLink, Send, Copy, Check,
} from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { BrandIcons } from '../ui/icons'

const VIDEOS = [
  { num: 1, title: "Vue d'ensemble du stack Buildrs", subtitle: "Les outils, pourquoi on les utilise et comment ils s'articulent", durationMin: 5, videoUrl: 'https://www.tella.tv/video/vid_cmp3v1g7d006s04l5cz8614hc/embed?b=0&title=0&a=1&loop=0&autoPlay=true&t=0&muted=1&wt=0&o=1', thumbnailUrl: 'https://www.tella.tv/api/stories/vid_cmp3v1g7d006s04l5cz8614hc/thumb.jpg' },
  { num: 2, title: 'Installer Wispr Flow', subtitle: 'Dicter à la voix dans n\'importe quelle app pour gagner en vitesse', durationMin: 6, videoUrl: 'https://www.tella.tv/video/vid_cmospfc69051h04l2cryy82gp/embed?b=0&title=0&a=1&loop=0&t=0&muted=0&wt=0&o=1', thumbnailUrl: 'https://www.tella.tv/api/stories/vid_cmospfc69051h04l2cryy82gp/thumb.jpg' },
  { num: 3, title: 'Nom de domaine sur Hostinger', subtitle: 'Acheter et configurer ton nom de domaine en quelques minutes', durationMin: 5, videoUrl: 'https://www.tella.tv/video/vid_cmp3v0vwq002104lbavdm9w2u/embed?b=0&title=0&a=1&loop=0&autoPlay=true&t=0&muted=1&wt=0&o=1', thumbnailUrl: 'https://www.tella.tv/api/stories/vid_cmp3v0vwq002104lbavdm9w2u/thumb.jpg' },
  { num: 4, title: 'Configurer GitHub', subtitle: 'Versionner ton code et gérer tes repos comme un pro', durationMin: 6, videoUrl: 'https://www.tella.tv/video/vid_cmp3uzy2a000g04lbbwanfyw3/embed?b=0&title=0&a=1&loop=0&autoPlay=true&t=0&muted=1&wt=0&o=1', thumbnailUrl: 'https://www.tella.tv/api/stories/vid_cmp3uzy2a000g04lbbwanfyw3/thumb.jpg' },
  { num: 5, title: 'Configurer Vercel', subtitle: 'Créer son compte et déployer automatiquement à chaque push', durationMin: 6, videoUrl: 'https://www.tella.tv/video/vid_cmp3v06sr001d04i9f7a4f7rd/embed?b=0&title=0&a=1&loop=0&autoPlay=true&t=0&muted=1&wt=0&o=1', thumbnailUrl: 'https://www.tella.tv/api/stories/vid_cmp3v06sr001d04i9f7a4f7rd/thumb.jpg' },
  { num: 6, title: 'Configurer Supabase', subtitle: 'Base de données, auth et storage en moins de 15 min', durationMin: 7, videoUrl: 'https://www.tella.tv/video/vid_cmp3v0hrk001l04kybg6w0oef/embed?b=0&title=0&a=1&loop=0&autoPlay=true&t=0&muted=1&wt=0&o=1', thumbnailUrl: 'https://www.tella.tv/api/stories/vid_cmp3v0hrk001l04kybg6w0oef/thumb.jpg' },
  { num: 7, title: 'Configurer Stripe', subtitle: 'Activer les paiements en ligne sur ton produit dès le premier jour', durationMin: 6, videoUrl: 'https://www.tella.tv/video/vid_cmp3v0pec004704l589ota8c2/embed?b=0&title=0&a=1&loop=0&autoPlay=true&t=0&muted=1&wt=0&o=1', thumbnailUrl: 'https://www.tella.tv/api/stories/vid_cmp3v0pec004704l589ota8c2/thumb.jpg' },
  { num: 8, title: 'Configurer Resend + emails', subtitle: 'Automatiser les emails transactionnels de ton app en 5 minutes', durationMin: 5, videoUrl: 'https://www.tella.tv/video/vid_cmp3unmxr00f504iihj7d1dcd/embed?b=0&title=0&a=1&loop=0&autoPlay=true&t=0&muted=1&wt=0&o=1', thumbnailUrl: 'https://www.tella.tv/api/stories/vid_cmp3unmxr00f504iihj7d1dcd/thumb.jpg' },
  { num: 9, title: 'Installer VS Code pour Claude Code', subtitle: 'Configurer ton environnement local pour gérer Claude Code', durationMin: 6, videoUrl: 'https://www.tella.tv/video/vid_cmp3v17re006e04kybwu04uwd/embed?b=0&title=0&a=1&loop=0&autoPlay=true&t=0&muted=1&wt=0&o=1', thumbnailUrl: 'https://www.tella.tv/api/stories/vid_cmp3v17re006e04kybwu04uwd/thumb.jpg' },
]

type ResourceItem =
  | { kind: 'link'; label: string; href: string; icon?: 'claude' }
  | { kind: 'prompt'; label: string; content: string }

const RESOURCES: Record<number, ResourceItem[]> = {
  1: [],
  2: [
    { kind: 'link', label: 'Wispr Flow — Site officiel', href: 'https://wisprflow.ai' },
  ],
  3: [
    { kind: 'link', label: 'Hostinger — Nom de domaine', href: 'https://www.hostinger.com/fr?REFERRALCODE=buildrs' },
  ],
  4: [
    { kind: 'link', label: 'GitHub — Site officiel', href: 'https://github.com' },
  ],
  5: [
    { kind: 'link', label: 'Vercel — Site officiel', href: 'https://vercel.com' },
  ],
  6: [], 7: [], 8: [],
  9: [
    { kind: 'link', label: 'VS Code — Télécharger', href: 'https://code.visualstudio.com' },
    { kind: 'link', label: 'Claude Code — Intégration VS Code', href: 'https://code.claude.com/docs/fr/vs-code#' },
  ],
}

interface Comment {
  id: string
  content: string
  created_at: string
  profiles?: { display_name: string | null; avatar_url: string | null }
}

function useComments(videoKey: string, userId: string) {
  const [comments, setComments] = useState<Comment[]>([])

  useEffect(() => {
    supabase
      .from('video_comments')
      .select('id, content, created_at, profiles(display_name, avatar_url)')
      .eq('video_id', videoKey)
      .order('created_at', { ascending: true })
      .then(({ data }) => setComments((data as unknown as Comment[]) ?? []))
      .catch(() => {})
  }, [videoKey])

  const postComment = async (content: string) => {
    const { data } = await supabase
      .from('video_comments')
      .insert({ user_id: userId, video_id: videoKey, content })
      .select('id, content, created_at, profiles(display_name, avatar_url)')
      .single()
    if (data) setComments(prev => [...prev, data as unknown as Comment])
  }

  return { comments, postComment }
}

function MiniVideoCard({ video, navigate }: { video: (typeof VIDEOS)[0]; navigate: (h: string) => void }) {
  return (
    <div
      className="rounded-xl overflow-hidden flex flex-col cursor-pointer group"
      style={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--foreground) / 0.07)' }}
      onClick={() => navigate(`#/dashboard/formation/setup/${video.num}`)}
    >
      <div
        className="relative h-[120px] flex items-center justify-center flex-shrink-0"
        style={{ background: 'linear-gradient(135deg, #0a1628 0%, #1a3a5f 100%)' }}
      >
        {video.thumbnailUrl && (
          <img
            src={video.thumbnailUrl}
            alt={video.title}
            className="absolute inset-0 w-full h-full object-cover"
            onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
          />
        )}
        <div className="absolute top-2 right-2">
          <span
            className="text-[10px] font-medium px-1.5 py-0.5 rounded"
            style={{ background: 'rgba(0,0,0,0.55)', color: 'hsl(var(--foreground) / 0.6)' }}
          >
            {video.durationMin}:00
          </span>
        </div>
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center transition-transform group-hover:scale-105"
          style={{ background: 'hsl(var(--foreground) / 0.1)', border: '1px solid hsl(var(--foreground) / 0.15)' }}
        >
          <Play size={14} strokeWidth={0} fill="white" className="ml-0.5" />
        </div>
      </div>

      <div className="p-3 flex flex-col flex-1">
        <h4 className="text-[13px] font-semibold leading-snug mb-1" style={{ color: 'hsl(var(--foreground))' }}>
          {video.title}
        </h4>
        <div className="flex items-center gap-2 mb-3">
          <span className="flex items-center gap-1" style={{ color: 'hsl(var(--foreground) / 0.3)' }}>
            <Clock size={9} strokeWidth={1.5} />
            <span className="text-[10px]">{video.durationMin}:00</span>
          </span>
          <span className="text-[10px]" style={{ color: 'hsl(var(--foreground) / 0.2)' }}>·</span>
          <span className="text-[10px]" style={{ color: 'hsl(var(--foreground) / 0.3)' }}>0% Progrès</span>
        </div>
        <div className="mt-auto pt-2" style={{ borderTop: '1px solid hsl(var(--foreground) / 0.05)' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <img src="/Alfred_Buildrs_V2.png" alt="Alfred" className="rounded-full object-cover flex-shrink-0" style={{ width: 20, height: 20 }} />
              <span className="text-[10px]" style={{ color: 'hsl(var(--foreground) / 0.3)' }}>Alfred</span>
            </div>
            <span className="text-[10px] font-medium" style={{ color: 'hsl(var(--foreground) / 0.55)' }}>
              Visionner la vidéo →
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

interface Props {
  navigate: (hash: string) => void
  videoId: string
  userId: string
}

export function SetupVideoPage({ navigate, videoId, userId }: Props) {
  const idx = Math.max(0, Math.min((Number(videoId) || 1) - 1, VIDEOS.length - 1))
  const video = VIDEOS[idx]
  const prevVideo = idx > 0 ? VIDEOS[idx - 1] : null
  const nextVideo = idx < VIDEOS.length - 1 ? VIDEOS[idx + 1] : null
  const otherVideos = VIDEOS.filter((_, i) => i !== idx)
  const resources = RESOURCES[video.num] ?? []
  const videoKey = `setup_v${video.num}`

  const [isFav, setIsFav] = useState(false)
  const [notes, setNotes] = useState('')
  const [notesSaved, setNotesSaved] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [isDone, setIsDone] = useState(false)
  const [copiedPrompt, setCopiedPrompt] = useState<string | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const { comments, postComment } = useComments(videoKey, userId)

  useEffect(() => {
    try {
      setIsFav(localStorage.getItem(`fav_${videoKey}`) === '1')
      setNotes(localStorage.getItem(`notes_${videoKey}`) ?? '')
      setIsDone(localStorage.getItem(`video_done_setup_${video.num}`) === '1')
    } catch {}
    setNotesSaved(false)
    setCommentText('')
  }, [videoKey])

  const toggleFav = () => {
    const next = !isFav
    setIsFav(next)
    try { localStorage.setItem(`fav_${videoKey}`, next ? '1' : '0') } catch {}
  }

  const saveNotes = () => {
    try { localStorage.setItem(`notes_${videoKey}`, notes) } catch {}
    setNotesSaved(true)
    setTimeout(() => setNotesSaved(false), 2000)
  }

  const toggleDone = () => {
    const next = !isDone
    setIsDone(next)
    try { localStorage.setItem(`video_done_setup_${video.num}`, next ? '1' : '0') } catch {}
  }

  const copyPrompt = (content: string, key: string) => {
    void navigator.clipboard.writeText(content)
    setCopiedPrompt(key)
    setTimeout(() => setCopiedPrompt(null), 2000)
  }

  const submitComment = async () => {
    if (!commentText.trim() || submitting) return
    setSubmitting(true)
    await postComment(commentText.trim())
    setCommentText('')
    setSubmitting(false)
  }

  return (
    <div style={{ background: 'hsl(var(--background))', minHeight: '100vh' }}>

      <div className="px-6 pt-5 pb-3">
        <nav className="flex items-center gap-1.5 text-[12px]" style={{ color: 'hsl(var(--foreground) / 0.35)' }}>
          <button onClick={() => navigate('#/dashboard/formation')} className="hover:opacity-70 transition-opacity">
            Formation
          </button>
          <span>/</span>
          <button onClick={() => navigate('#/dashboard/formation/setup')} className="hover:opacity-70 transition-opacity">
            Partie 2
          </button>
          <span>/</span>
          <span style={{ color: 'hsl(var(--foreground) / 0.65)' }}>{video.title}</span>
        </nav>
      </div>

      <div className="px-6 pb-10">
        <div className="flex gap-5 flex-col xl:flex-row items-start">

          <div className="flex-1 min-w-0">

            <div
              className="relative w-full rounded-xl overflow-hidden"
              style={{ paddingBottom: '56.25%', background: '#0a0a0f', border: '1px solid hsl(var(--foreground) / 0.07)' }}
            >
              {video.videoUrl ? (
                <iframe
                  src={video.videoUrl}
                  allow="autoplay; fullscreen"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                  style={{ border: 0 }}
                />
              ) : (
                <>
                  <img
                    src="/Dash - Cover Modules/configuration.png"
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                    style={{ opacity: 0.18 }}
                    onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center cursor-pointer transition-transform hover:scale-105"
                      style={{ background: 'hsl(var(--foreground) / 0.12)', border: '1px solid hsl(var(--foreground) / 0.2)' }}
                    >
                      <Play size={26} strokeWidth={0} fill="white" className="ml-1" />
                    </div>
                    <span className="text-[12px] font-medium" style={{ color: 'hsl(var(--foreground) / 0.35)' }}>
                      Vidéo à venir
                    </span>
                  </div>
                  <div className="absolute top-4 left-4">
                    <span
                      className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md"
                      style={{ background: 'rgba(0,0,0,0.5)', color: 'hsl(var(--foreground) / 0.45)' }}
                    >
                      {String(video.num).padStart(2, '0')} · CONFIGURATION
                    </span>
                  </div>
                </>
              )}
            </div>

            <div className="flex items-center justify-between mt-4">
              <button
                onClick={toggleFav}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all"
                style={{
                  background: isFav ? 'rgba(250,204,21,0.1)' : 'hsl(var(--foreground) / 0.05)',
                  border: `1px solid ${isFav ? 'rgba(250,204,21,0.25)' : 'hsl(var(--foreground) / 0.08)'}`,
                  color: isFav ? '#facc15' : 'hsl(var(--foreground) / 0.45)',
                }}
              >
                <Star size={13} strokeWidth={1.5} fill={isFav ? '#facc15' : 'none'} />
                Favoris
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => prevVideo && navigate(`#/dashboard/formation/setup/${prevVideo.num}`)}
                  disabled={!prevVideo}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-medium transition-opacity disabled:opacity-20"
                  style={{ background: 'hsl(var(--foreground) / 0.06)', border: '1px solid hsl(var(--foreground) / 0.08)', color: 'hsl(var(--foreground) / 0.65)' }}
                >
                  <ChevronLeft size={14} strokeWidth={2} />
                  Précédent
                </button>
                <button
                  onClick={toggleDone}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-semibold transition-all flex-shrink-0"
                  style={isDone
                    ? { background: 'rgba(99,102,241,0.18)', border: '1px solid rgba(99,102,241,0.45)', color: '#a5b4fc' }
                    : { background: 'hsl(var(--foreground) / 0.06)', border: '1px solid hsl(var(--foreground) / 0.1)', color: 'hsl(var(--foreground) / 0.45)' }
                  }
                >
                  <Check size={13} strokeWidth={2.5} />
                  {isDone ? 'Validé' : 'Valider'}
                </button>
                <button
                  onClick={() => nextVideo && navigate(`#/dashboard/formation/setup/${nextVideo.num}`)}
                  disabled={!nextVideo}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-semibold transition-opacity disabled:opacity-20"
                  style={{ background: 'hsl(var(--foreground))', color: 'hsl(var(--background))' }}
                >
                  Suivant
                  <ChevronRight size={14} strokeWidth={2} />
                </button>
              </div>
            </div>

            <div className="mt-5 pb-5" style={{ borderBottom: '1px solid hsl(var(--foreground) / 0.07)' }}>
              <h1 className="text-[20px] font-bold tracking-[-0.02em] mb-4" style={{ color: 'hsl(var(--foreground))' }}>
                {video.title}
              </h1>
              <div
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
                style={{ background: 'hsl(var(--foreground) / 0.04)', border: '1px solid hsl(var(--foreground) / 0.07)' }}
              >
                <img
                  src="/Alfred_Buildrs_V2.png"
                  alt="Alfred"
                  className="rounded-full object-cover flex-shrink-0"
                  style={{ width: 38, height: 38, border: '1px solid hsl(var(--foreground) / 0.1)' }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold" style={{ color: 'hsl(var(--foreground))' }}>Alfred Orsini</p>
                  <p className="text-[11px]" style={{ color: 'hsl(var(--foreground) / 0.38)' }}>CEO de Buildrs</p>
                </div>
                <button
                  className="flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-lg transition-opacity hover:opacity-70 flex-shrink-0"
                  style={{ background: 'hsl(var(--foreground) / 0.06)', color: 'hsl(var(--foreground) / 0.45)', border: '1px solid hsl(var(--foreground) / 0.08)' }}
                >
                  <ExternalLink size={11} strokeWidth={1.5} />
                  Profil
                </button>
              </div>
            </div>

            <div className="py-5" style={{ borderBottom: '1px solid hsl(var(--foreground) / 0.07)' }}>
              <h2 className="text-[15px] font-bold mb-3" style={{ color: 'hsl(var(--foreground))' }}>
                Ressources complémentaires utilisées dans ce cours
              </h2>
              {resources.length === 0 ? (
                <p className="text-[13px]" style={{ color: 'hsl(var(--foreground) / 0.25)' }}>
                  Aucune ressource pour cette vidéo.
                </p>
              ) : (
                <div className="flex flex-col gap-2">
                  {resources.map((r, i) => {
                    if (r.kind === 'prompt') {
                      const isCopied = copiedPrompt === `${video.num}-${i}`
                      return (
                        <div key={r.label} className="rounded-lg overflow-hidden" style={{ border: '1px solid hsl(var(--foreground) / 0.07)' }}>
                          <div className="flex items-center justify-between px-4 py-2.5" style={{ background: 'hsl(var(--foreground) / 0.04)', borderBottom: '1px solid hsl(var(--foreground) / 0.06)' }}>
                            <span className="text-[12px] font-semibold" style={{ color: 'hsl(var(--foreground) / 0.45)' }}>{r.label}</span>
                            <button
                              onClick={() => copyPrompt(r.content, `${video.num}-${i}`)}
                              className="flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-md transition-all"
                              style={{
                                background: isCopied ? 'rgba(34,197,94,0.12)' : 'hsl(var(--foreground) / 0.06)',
                                color: isCopied ? '#22c55e' : 'hsl(var(--foreground) / 0.45)',
                                border: `1px solid ${isCopied ? 'rgba(34,197,94,0.25)' : 'hsl(var(--foreground) / 0.08)'}`,
                              }}
                            >
                              {isCopied ? <Check size={11} strokeWidth={2} /> : <Copy size={11} strokeWidth={1.5} />}
                              {isCopied ? 'Copié !' : 'Copier'}
                            </button>
                          </div>
                          <pre
                            className="px-4 py-3 text-[11px] leading-relaxed overflow-y-auto"
                            style={{ color: 'hsl(var(--foreground) / 0.35)', fontFamily: 'inherit', whiteSpace: 'pre-wrap', margin: 0, maxHeight: 160, background: 'hsl(var(--foreground) / 0.02)' }}
                          >
                            {r.content}
                          </pre>
                        </div>
                      )
                    }
                    return (
                      <a
                        key={r.label}
                        href={r.href}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-between px-4 py-3 rounded-lg transition-opacity hover:opacity-70"
                        style={{ background: 'hsl(var(--foreground) / 0.04)', border: '1px solid hsl(var(--foreground) / 0.07)', color: 'hsl(var(--foreground))', textDecoration: 'none' }}
                      >
                        <div className="flex items-center gap-2.5">
                          {r.icon === 'claude' && <BrandIcons.claude width={16} height={16} style={{ flexShrink: 0, opacity: 0.75 }} />}
                          <span className="text-[13px]">{r.label}</span>
                        </div>
                        <ExternalLink size={13} strokeWidth={1.5} style={{ color: 'hsl(var(--foreground) / 0.35)', flexShrink: 0 }} />
                      </a>
                    )
                  })}
                </div>
              )}
            </div>

            <div className="py-5" style={{ borderBottom: '1px solid hsl(var(--foreground) / 0.07)' }}>
              <h2 className="text-[15px] font-bold mb-4" style={{ color: 'hsl(var(--foreground))' }}>
                Continuer le module
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {otherVideos.map(v => (
                  <MiniVideoCard key={v.num} video={v} navigate={navigate} />
                ))}
              </div>
            </div>

            <div className="pt-5">
              <h2 className="text-[15px] font-bold mb-4" style={{ color: 'hsl(var(--foreground))' }}>
                Commentaires ({comments.length})
              </h2>

              <div className="flex items-start gap-3 mb-5">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: 'hsl(var(--foreground) / 0.07)', border: '1px solid hsl(var(--foreground) / 0.1)' }}
                >
                  <span className="text-[11px] font-bold" style={{ color: 'hsl(var(--foreground) / 0.45)' }}>W</span>
                </div>
                <div className="flex-1 relative">
                  <textarea
                    ref={textareaRef}
                    value={commentText}
                    onChange={e => setCommentText(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) void submitComment() }}
                    placeholder="Partagez votre avis sur cette vidéo..."
                    rows={2}
                    className="w-full resize-none rounded-xl px-4 py-3 pr-12 text-[13px] outline-none"
                    style={{ background: 'hsl(var(--foreground) / 0.04)', border: '1px solid hsl(var(--foreground) / 0.08)', color: 'hsl(var(--foreground))', fontFamily: 'inherit' }}
                  />
                  <button
                    onClick={() => void submitComment()}
                    disabled={!commentText.trim() || submitting}
                    className="absolute bottom-3 right-3 w-7 h-7 rounded-full flex items-center justify-center transition-opacity disabled:opacity-25"
                    style={{ background: 'hsl(var(--foreground) / 0.9)', color: 'hsl(var(--background))' }}
                  >
                    <Send size={12} strokeWidth={2} />
                  </button>
                </div>
              </div>

              {comments.length === 0 ? (
                <div
                  className="rounded-xl py-8 text-center"
                  style={{ background: 'hsl(var(--foreground) / 0.02)', border: '1px solid hsl(var(--foreground) / 0.05)' }}
                >
                  <p className="text-[13px]" style={{ color: 'hsl(var(--foreground) / 0.28)' }}>
                    Aucun commentaire pour le moment. Soyez le premier à partager votre avis !
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {comments.map(c => (
                    <div key={c.id} className="flex items-start gap-3">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden"
                        style={{ background: 'hsl(var(--foreground) / 0.07)', border: '1px solid hsl(var(--foreground) / 0.1)' }}
                      >
                        {c.profiles?.avatar_url ? (
                          <img src={c.profiles.avatar_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-[11px] font-bold" style={{ color: 'hsl(var(--foreground) / 0.5)' }}>
                            {(c.profiles?.display_name ?? 'U')[0].toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[12px] font-semibold" style={{ color: 'hsl(var(--foreground) / 0.7)' }}>
                            {c.profiles?.display_name ?? 'Utilisateur'}
                          </span>
                          <span className="text-[10px]" style={{ color: 'hsl(var(--foreground) / 0.22)' }}>
                            {new Date(c.created_at).toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                        <p className="text-[13px] leading-relaxed" style={{ color: 'hsl(var(--foreground) / 0.55)' }}>
                          {c.content}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="xl:w-[340px] w-full flex-shrink-0">
            <div
              className="xl:sticky xl:top-6 rounded-xl overflow-hidden"
              style={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--foreground) / 0.07)' }}
            >
              <div
                className="flex items-center justify-between px-4 py-3"
                style={{ borderBottom: '1px solid hsl(var(--foreground) / 0.07)' }}
              >
                <h3 className="text-[14px] font-bold" style={{ color: 'hsl(var(--foreground))' }}>Notes</h3>
                <button
                  onClick={saveNotes}
                  className="text-[12px] font-semibold px-3 py-1.5 rounded-lg transition-all"
                  style={{
                    background: notesSaved ? 'rgba(34,197,94,0.12)' : 'hsl(var(--foreground) / 0.9)',
                    color: notesSaved ? '#22c55e' : 'hsl(var(--background))',
                    border: notesSaved ? '1px solid rgba(34,197,94,0.3)' : '1px solid transparent',
                  }}
                >
                  {notesSaved ? 'Enregistré' : 'Sauvegarder'}
                </button>
              </div>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Commencez à écrire votre note ici..."
                className="w-full resize-none outline-none text-[13px] leading-relaxed px-4 py-3 placeholder:text-white/20"
                style={{
                  background: 'transparent',
                  color: 'hsl(var(--foreground))',
                  fontFamily: 'inherit',
                  minHeight: 340,
                }}
              />
            </div>
          </div>

        </div>
      </div>

    </div>
  )
}
