import { useState, useEffect, useRef } from 'react'
import {
  ChevronLeft, ChevronRight, Check, Copy, ExternalLink,
  Brain, Database, CreditCard, Cloud, Mail, GitBranch,
  Globe, TrendingUp, RefreshCw, Lightbulb, Package,
  Briefcase, Rocket, DollarSign, Zap, Code2,
  Eye, Target, Search, Star, Tag, Users, FileText,
  Palette, Layout, Mic, ImageIcon, Sparkles, Monitor, PenTool, Layers2,
  MessageSquare, BookOpen, Wand2,
  Shield, Lock, User, Share2, Calendar, CheckCircle2, AlertTriangle,
} from 'lucide-react'
import type { ContentBlock } from '../../data/curriculum'
import { getLesson, getModule, getNextLesson, getPrevLesson } from '../../data/curriculum'

type LIcon = React.ComponentType<{ size?: number; strokeWidth?: number; style?: React.CSSProperties; className?: string }>

const ICON_MAP: Record<string, LIcon> = {
  brain: Brain, database: Database, 'credit-card': CreditCard, cloud: Cloud,
  mail: Mail, 'git-branch': GitBranch, globe: Globe, 'trending-up': TrendingUp,
  'refresh-cw': RefreshCw, lightbulb: Lightbulb, package: Package, briefcase: Briefcase,
  rocket: Rocket, 'dollar-sign': DollarSign, zap: Zap, code: Code2,
  eye: Eye, target: Target, search: Search, star: Star, tag: Tag,
  users: Users, 'file-text': FileText, copy: Copy,
  palette: Palette, layout: Layout, mic: Mic, image: ImageIcon,
  sparkles: Sparkles, monitor: Monitor, 'pen-tool': PenTool,
  layers2: Layers2, 'message-square': MessageSquare,
  'book-open': BookOpen, wand2: Wand2,
  shield: Shield, lock: Lock, user: User, 'share-2': Share2,
  calendar: Calendar, 'check-circle': CheckCircle2, 'alert-triangle': AlertTriangle,
  linkedin: Share2, 'check-circle-2': CheckCircle2,
}

// Cal.com inline embed component
function CalBookingBlock({ block, idx }: { block: { type: 'cal-booking'; title?: string; subtitle?: string; calUrl?: string }, idx: number }) {
  const embedId = `cal-embed-${idx}`
  const initialized = useRef(false)

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    // Exécute l'IIFE exacte de Cal.com — crée la file d'attente ET charge le script
    ;(function (C: any, A: string, L: string) {
      let p = function (a: any, ar: any) { a.q.push(ar) }
      let d = C.document
      C.Cal = C.Cal || function (...args: any[]) {
        let cal = C.Cal
        let ar = args
        if (!cal.loaded) {
          cal.ns = {}
          cal.q = cal.q || []
          d.head.appendChild(d.createElement('script')).src = A
          cal.loaded = true
        }
        if (ar[0] === L) {
          const api: any = function () { p(api, arguments) }
          const namespace = ar[1]
          api.q = api.q || []
          if (typeof namespace === 'string') {
            cal.ns[namespace] = cal.ns[namespace] || api
            p(cal.ns[namespace], ar)
            p(cal, ['initNamespace', namespace])
          } else {
            p(cal, ar)
          }
          return
        }
        p(cal, ar)
      }
    })(window, 'https://app.cal.com/embed/embed.js', 'init')

    const Cal = (window as any).Cal
    Cal('init', 'secret', { origin: 'https://app.cal.com' })
    Cal.ns.secret('inline', {
      elementOrSelector: `#${embedId}`,
      config: { layout: 'month_view', useSlotsViewOnSmallScreen: 'true' },
      calLink: 'team-buildrs/secret',
    })
    Cal.ns.secret('ui', { hideEventTypeDetails: false, layout: 'month_view' })
  }, [embedId])

  return (
    <div className="mb-5 rounded-xl overflow-hidden" style={{ border: '1.5px solid hsl(var(--border))' }}>
      <div className="px-5 py-3.5 border-b flex items-center gap-2.5" style={{ borderColor: 'hsl(var(--border))', background: 'hsl(var(--secondary) / 0.5)' }}>
        <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'hsl(var(--foreground) / 0.08)' }}>
          <Calendar size={13} strokeWidth={1.5} className="text-foreground" />
        </div>
        <div>
          <p className="font-semibold text-foreground" style={{ fontSize: 13 }}>{block.title || 'Questions sur ce module ?'}</p>
          <p className="text-muted-foreground" style={{ fontSize: 11 }}>{block.subtitle || "Réserve 15 minutes avec l'équipe Buildrs"}</p>
        </div>
      </div>
      <div id={embedId} style={{ width: '100%', height: 600, overflow: 'scroll' }} />
    </div>
  )
}

interface Props {
  moduleId: string
  lessonId: string
  navigate: (hash: string) => void
  isCompleted: (moduleId: string, lessonId: string) => boolean
  markComplete: (moduleId: string, lessonId: string) => Promise<void>
  hasPack?: boolean
  module01Complete?: boolean
}

const AGENT_CHIPS = [
  { label: 'Planner',   color: '#3b82f6' },
  { label: 'Designer',  color: '#f43f5e' },
  { label: 'Architect', color: '#f97316' },
  { label: 'Builder',   color: '#8b5cf6' },
  { label: 'Launcher',  color: '#14b8a6' },
]

function PackAgentsCTA({ navigate, hasPack, module01Complete }: { navigate: (hash: string) => void; hasPack: boolean; module01Complete: boolean }) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (hasPack || !module01Complete) return
    const KEY = 'buildrs_agents_upsell_shown'
    if (sessionStorage.getItem(KEY)) return
    sessionStorage.setItem(KEY, '1')
    setShow(true)
  }, [hasPack, module01Complete])

  if (!show) return null

  return (
    <div className="mb-6 relative rounded-2xl overflow-hidden" style={{ padding: 2 }}>
      <div className="absolute" style={{
        inset: -40,
        background: 'conic-gradient(#4d96ff, #8b5cf6, #f43f5e, #f97316, #14b8a6, #4d96ff)',
        animation: 'cohorte-spin 4s linear infinite',
      }} />
      <div className="relative rounded-[14px] overflow-hidden" style={{ background: 'hsl(var(--background))' }}>
        <div className="px-5 py-3" style={{ background: 'hsl(var(--foreground))' }}>
          <p className="font-extrabold" style={{ fontSize: 14, letterSpacing: '-0.02em', color: 'hsl(var(--background))' }}>
            Accélère ton build
          </p>
          <p style={{ fontSize: 11, color: 'hsl(var(--background) / 0.65)', marginTop: 2 }}>
            5 agents IA spécialisés
          </p>
        </div>
        <div className="p-4">
          <div className="flex flex-wrap gap-1.5 mb-3">
            {AGENT_CHIPS.map(({ label, color }) => (
              <span key={label} className="text-[10px] font-bold px-2 py-0.5 rounded" style={{ background: `${color}20`, color, border: `1px solid ${color}40` }}>
                {label}
              </span>
            ))}
          </div>
          <div className="flex items-baseline gap-1.5 mb-3">
            <span className="text-foreground font-extrabold" style={{ fontSize: 24, letterSpacing: '-0.03em' }}>197€</span>
            <span className="text-muted-foreground line-through" style={{ fontSize: 11 }}>497€</span>
            <span className="text-muted-foreground" style={{ fontSize: 10 }}>une fois</span>
          </div>
          <button
            onClick={() => navigate('#/dashboard/offers')}
            className="cta-rainbow w-full relative rounded-xl font-semibold transition-opacity hover:opacity-90"
            style={{ background: 'hsl(var(--foreground))', color: 'hsl(var(--background))', padding: '9px 18px', fontSize: 12 }}
          >
            Débloquer les Agents IA →
          </button>
        </div>
      </div>
    </div>
  )
}

export function LessonPage({ moduleId, lessonId, navigate, isCompleted, markComplete, hasPack = false, module01Complete = false }: Props) {
  const lesson = getLesson(moduleId, lessonId)
  const mod = getModule(moduleId)
  const nextLesson = getNextLesson(moduleId, lessonId)
  const prevLesson = getPrevLesson(moduleId, lessonId)
  const [copied, setCopied] = useState<string | null>(null)
  const [checked, setChecked] = useState<Set<number>>(new Set())
  const [blockChecked, setBlockChecked] = useState<Set<string>>(new Set())
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({})
  const [completing, setCompleting] = useState(false)

  if (!lesson || !mod) return <div className="p-7 text-sm text-muted-foreground">Leçon introuvable.</div>

  const done = isCompleted(moduleId, lessonId)
  const lessonIndex = mod.lessons.findIndex(l => l.id === lessonId)

  const copyText = async (content: string, key: string) => {
    await navigator.clipboard.writeText(content.replace(/^"|"$/g, ''))
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }

  const handleComplete = async () => {
    setCompleting(true)
    await markComplete(moduleId, lessonId)
    setCompleting(false)
    if (nextLesson) navigate(`#/dashboard/module/${moduleId}/lesson/${nextLesson.id}`)
    else navigate(`#/dashboard/module/${moduleId}`)
  }

  const handleNext = () => {
    if (nextLesson) navigate(`#/dashboard/module/${moduleId}/lesson/${nextLesson.id}`)
    else navigate(`#/dashboard/module/${moduleId}`)
  }

  // ── Block renderer ────────────────────────────────────────────────────────
  const renderBlock = (block: ContentBlock, idx: number): React.ReactNode => {
    switch (block.type) {

      case 'text':
        return (
          <p key={idx} className="text-sm leading-relaxed mb-4" style={{ color: 'hsl(var(--muted-foreground))' }}>
            {block.content}
          </p>
        )

      case 'heading':
        return block.level === 2
          ? <h2 key={idx} className="text-base font-bold text-foreground mt-7 mb-3" style={{ letterSpacing: '-0.02em' }}>{block.content}</h2>
          : <p key={idx} className="text-[10px] font-bold uppercase tracking-[0.09em] text-muted-foreground mt-5 mb-2">{block.content}</p>

      case 'divider':
        return <hr key={idx} className="border-border my-6" />

      case 'callout': {
        const cv = {
          tip:    { bg: 'rgba(34,197,94,0.07)',  border: 'rgba(34,197,94,0.25)',  color: '#22c55e' },
          info:   { bg: 'rgba(77,150,255,0.07)', border: 'rgba(77,150,255,0.25)', color: '#4d96ff' },
          action: { bg: 'hsl(var(--secondary))', border: 'hsl(var(--border))',    color: 'hsl(var(--foreground))' },
        }
        const c = cv[block.variant ?? 'info']
        return (
          <div key={idx} className="rounded-xl p-4 mb-5 border" style={{ background: c.bg, borderColor: c.border }}>
            {block.title && <p className="text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: c.color }}>{block.title}</p>}
            <p className="text-xs leading-relaxed text-foreground/80">{block.content}</p>
          </div>
        )
      }

      case 'prompt': {
        const key = `prompt-${idx}`
        return (
          <div key={idx} className="rounded-xl p-4 mb-5" style={{ background: 'hsl(var(--foreground))' }}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#71717a' }}>{block.label}</span>
              <button onClick={() => copyText(block.content, key)} className="flex items-center gap-1.5 text-[11px] font-semibold transition-colors"
                style={{ color: copied === key ? '#22c55e' : '#4d96ff' }}>
                {copied === key ? <><Check size={11} strokeWidth={2.5} /> Copié !</> : <><Copy size={11} strokeWidth={2.5} /> Copier</>}
              </button>
            </div>
            <p className="font-mono text-[11px] leading-relaxed" style={{ color: '#d4d4d8' }}>{block.content}</p>
          </div>
        )
      }

      case 'checklist':
        return (
          <div key={idx} className="rounded-xl p-4 mb-5" style={{ background: 'hsl(var(--secondary))' }}>
            {block.title && <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">{block.title}</p>}
            <div className="flex flex-col gap-2.5">
              {block.items.map((item, i) => {
                const k = `${idx}-${i}`
                const isChecked = blockChecked.has(k)
                return (
                  <button key={i} onClick={() => setBlockChecked(prev => { const n = new Set(prev); n.has(k) ? n.delete(k) : n.add(k); return n })}
                    className="flex items-center gap-3 text-left w-full">
                    <div className="w-4 h-4 rounded-[4px] flex items-center justify-center flex-shrink-0 transition-colors"
                      style={{ background: isChecked ? '#22c55e' : 'transparent', border: isChecked ? 'none' : '1.5px solid hsl(var(--border))' }}>
                      {isChecked && <Check size={9} strokeWidth={3} color="white" />}
                    </div>
                    <span className={`text-xs transition-all ${isChecked ? 'text-muted-foreground line-through' : 'text-foreground'}`}>{item}</span>
                  </button>
                )
              })}
            </div>
          </div>
        )

      case 'list':
        if (block.style === 'cards') {
          return (
            <div key={idx} className="mb-5">
              {block.title && <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">{block.title}</p>}
              <div className="grid grid-cols-2 gap-2.5">
                {block.items.map((item, i) => {
                  const Icon = item.icon ? ICON_MAP[item.icon] : null
                  return (
                    <div key={i} className="rounded-xl border p-4" style={{ borderColor: item.accent ? `${item.accent}35` : 'hsl(var(--border))', background: item.accent ? `${item.accent}08` : 'hsl(var(--background))' }}>
                      {Icon && <Icon size={14} strokeWidth={1.5} style={{ color: item.accent ?? 'hsl(var(--muted-foreground))' }} className="mb-2" />}
                      <p className="text-xs font-bold text-foreground mb-1">{item.label}</p>
                      {item.desc && <p className="text-[11px] text-muted-foreground leading-relaxed">{item.desc}</p>}
                    </div>
                  )
                })}
              </div>
            </div>
          )
        }
        return (
          <div key={idx} className="mb-5">
            {block.title && <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">{block.title}</p>}
            <div className="flex flex-col gap-2">
              {block.items.map((item, i) => (
                <div key={i} className="flex items-start gap-2.5 py-1.5 border-b border-border last:border-0">
                  <div className="w-1 h-1 rounded-full bg-muted-foreground mt-2 flex-shrink-0" />
                  <div>
                    <span className="text-xs font-semibold text-foreground">{item.label}</span>
                    {item.desc && <span className="text-xs text-muted-foreground"> — {item.desc}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      case 'glossary':
        return (
          <div key={idx} className="mb-5">
            {block.categories.map((cat, ci) => (
              <div key={ci} className="mb-6">
                <p className="text-[10px] font-bold uppercase tracking-[0.09em] text-muted-foreground mb-3 pb-2 border-b border-border">{cat.title}</p>
                <div className="flex flex-col">
                  {cat.items.map((item, ii) => (
                    <div key={ii} className="flex gap-4 py-2 border-b border-border/50 last:border-0">
                      <span className="text-[11px] font-bold text-foreground w-[140px] flex-shrink-0 pt-0.5">{item.term}</span>
                      <span className="text-[11px] text-muted-foreground leading-relaxed">{item.def}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )

      case 'diagram-flow':
        return (
          <div key={idx} className="rounded-xl border border-border p-5 mb-5">
            {block.title && <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-4">{block.title}</p>}
            <div className="flex flex-col gap-0">
              {block.steps.map((step, si) => (
                <div key={si} className="flex items-start gap-3">
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div className="w-6 h-6 rounded-full border-2 flex items-center justify-center text-[9px] font-bold"
                      style={{ borderColor: step.color ?? 'hsl(var(--foreground))', color: step.color ?? 'hsl(var(--foreground))' }}>
                      {si + 1}
                    </div>
                    {si < block.steps.length - 1 && (
                      <div className="w-px flex-1 my-1" style={{ minHeight: 20, background: 'hsl(var(--border))' }} />
                    )}
                  </div>
                  <div className="pb-4">
                    <p className="text-xs font-bold text-foreground leading-tight">{step.label}</p>
                    {step.sub && <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">{step.sub}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      case 'diagram-cards':
        return (
          <div key={idx} className="rounded-xl border border-border p-5 mb-5">
            {block.title && <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-4">{block.title}</p>}
            <div className="grid grid-cols-3 gap-2.5">
              {block.items.map((item, ii) => {
                const Icon = ICON_MAP[item.icon]
                return (
                  <div key={ii} className="rounded-lg p-3.5" style={{ background: item.color ? `${item.color}0e` : 'hsl(var(--secondary))' }}>
                    {Icon && <Icon size={13} strokeWidth={1.5} style={{ color: item.color ?? 'hsl(var(--muted-foreground))' }} className="mb-2" />}
                    <p className="text-[11px] font-bold text-foreground mb-1 leading-tight">{item.label}</p>
                    <p className="text-[10px] text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                )
              })}
            </div>
          </div>
        )

      case 'quiz-inline': {
        const answer = quizAnswers[idx]
        const answered = answer !== undefined
        const isCorrect = !block.reflective && answer === block.correctIndex
        return (
          <div key={idx} className="rounded-xl border-2 p-5 mb-5" style={{ borderColor: 'rgba(204,93,232,0.3)', background: 'rgba(204,93,232,0.04)' }}>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: '#cc5de8' }}>
              {block.reflective ? 'Réflexion' : 'Quiz'}
            </p>
            <p className="text-sm font-semibold text-foreground mb-4">{block.question}</p>
            <div className="flex flex-col gap-2">
              {block.options.map((opt, oi) => {
                const selected = answer === oi
                const correct = oi === block.correctIndex
                const showResult = answered && !block.reflective
                return (
                  <button key={oi}
                    onClick={() => !answered && setQuizAnswers(prev => ({ ...prev, [idx]: oi }))}
                    disabled={answered}
                    className="text-left rounded-lg px-3.5 py-2.5 text-xs border transition-all"
                    style={{
                      borderColor: block.reflective && selected ? '#cc5de8'
                        : showResult && correct ? '#22c55e'
                        : showResult && selected && !correct ? '#ef4444'
                        : 'hsl(var(--border))',
                      background: block.reflective && selected ? 'rgba(204,93,232,0.1)'
                        : showResult && correct ? 'rgba(34,197,94,0.1)'
                        : showResult && selected && !correct ? 'rgba(239,68,68,0.1)'
                        : 'hsl(var(--background))',
                    }}>
                    {opt}
                  </button>
                )
              })}
            </div>
            {answered && (
              <div className="mt-3 p-3 rounded-lg text-[11px] leading-relaxed"
                style={{
                  background: block.reflective ? 'rgba(204,93,232,0.08)' : isCorrect ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                  color: block.reflective ? '#cc5de8' : isCorrect ? '#22c55e' : '#ef4444',
                }}>
                {block.reflective && block.reflections
                  ? block.reflections[answer]
                  : (isCorrect ? '✓ ' : '✗ ') + block.explanation}
              </div>
            )}
          </div>
        )
      }

      case 'links':
        return (
          <div key={idx} className="mb-5">
            {block.title && <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">{block.title}</p>}
            <div className="flex flex-col gap-2">
              {block.items.map((item, i) => {
                const Icon = item.icon ? ICON_MAP[item.icon] : Globe
                return (
                  <a key={i} href={item.url} target="_blank" rel="noopener noreferrer"
                    className="flex items-start gap-3 rounded-xl border p-3.5 transition-all duration-150 group"
                    style={{ borderColor: 'hsl(var(--border))', background: 'hsl(var(--background))' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'hsl(var(--foreground) / 0.25)'; (e.currentTarget as HTMLElement).style.background = 'hsl(var(--secondary))' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'hsl(var(--border))'; (e.currentTarget as HTMLElement).style.background = 'hsl(var(--background))' }}>
                    {Icon && <Icon size={14} strokeWidth={1.5} className="text-muted-foreground mt-0.5 flex-shrink-0 group-hover:text-foreground transition-colors" />}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-foreground">{item.label}</span>
                        {item.tag && <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full" style={{ background: 'hsl(var(--secondary))', color: 'hsl(var(--muted-foreground))' }}>{item.tag}</span>}
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">{item.desc}</p>
                    </div>
                    <ExternalLink size={11} strokeWidth={2} className="text-muted-foreground/50 flex-shrink-0 mt-0.5 group-hover:text-muted-foreground transition-colors" />
                  </a>
                )
              })}
            </div>
          </div>
        )

      case 'template': {
        const sectionColors = ['#4d96ff', '#22c55e', '#cc5de8', '#f59e0b', '#ef4444', '#71717a']
        return (
          <div key={idx} className="mb-5 rounded-xl border-2 overflow-hidden" style={{ borderColor: 'hsl(var(--border))' }}>
            {block.title && (
              <div className="px-5 py-3 border-b flex items-center gap-2" style={{ borderColor: 'hsl(var(--border))', background: 'hsl(var(--secondary))' }}>
                <FileText size={12} strokeWidth={1.5} className="text-muted-foreground" />
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{block.title}</p>
              </div>
            )}
            <div className="divide-y" style={{ borderColor: 'hsl(var(--border))' }}>
              {block.sections.map((section, si) => {
                const Icon = section.icon ? ICON_MAP[section.icon] : FileText
                const color = sectionColors[si % sectionColors.length]
                return (
                  <div key={si} className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      {Icon && <Icon size={11} strokeWidth={1.5} style={{ color }} />}
                      <p className="text-[10px] font-bold uppercase tracking-[0.08em]" style={{ color }}>{section.label}</p>
                    </div>
                    <div className="flex flex-col gap-2.5">
                      {section.fields.map((field, fi) => (
                        <div key={fi} className="rounded-lg px-3 py-2.5" style={{ background: 'hsl(var(--secondary))' }}>
                          <p className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground mb-1">{field.name}</p>
                          <p className="text-xs font-mono" style={{ color: 'hsl(var(--muted-foreground) / 0.7)' }}>{field.placeholder}</p>
                          {field.example && (
                            <p className="text-[10px] text-muted-foreground/50 mt-1 italic">{field.example}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )
      }

      case 'cohorte-cta':
        return <PackAgentsCTA key={idx} navigate={navigate} hasPack={hasPack} module01Complete={module01Complete} />

      case 'cal-booking':
        return <CalBookingBlock key={idx} block={block} idx={idx} />

      default:
        return null
    }
  }

  return (
    <div className="flex h-full">

      {/* Progression dots sidebar */}
      <div className="w-14 border-r border-border flex flex-col items-center pt-6 gap-3 flex-shrink-0">
        {mod.lessons.map((l) => {
          const lDone = isCompleted(moduleId, l.id)
          const lCurrent = l.id === lessonId
          return (
            <button key={l.id} onClick={() => navigate(`#/dashboard/module/${moduleId}/lesson/${l.id}`)} title={l.title}
              className="rounded-full transition-all duration-200"
              style={{
                width: lCurrent ? 10 : 7, height: lCurrent ? 10 : 7,
                background: lCurrent ? 'hsl(var(--foreground))' : lDone ? '#22c55e' : 'hsl(var(--border))',
              }} />
          )
        })}
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto px-8 py-7" style={{ maxWidth: 680 }}>

        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 mb-5 text-xs text-muted-foreground flex-wrap">
          <button onClick={() => navigate(`#/dashboard/module/${moduleId}`)} className="hover:text-foreground transition-colors">
            Module {moduleId}
          </button>
          <ChevronRight size={11} strokeWidth={2} />
          <span className="text-foreground font-medium">{lesson.title}</span>
          <span className="ml-auto text-[11px]">{lesson.duration} · Leçon {lessonIndex + 1} sur {mod.lessons.length}</span>
        </div>

        {/* Progress bar */}
        <div className="h-0.5 rounded-full mb-6" style={{ background: 'hsl(var(--border))' }}>
          <div className="h-0.5 rounded-full transition-all"
            style={{ width: `${((lessonIndex + (done ? 1 : 0)) / mod.lessons.length) * 100}%`, background: 'linear-gradient(90deg, #4d96ff, #22c55e)' }} />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-extrabold text-foreground mb-5" style={{ letterSpacing: '-0.03em' }}>
          {lesson.title}
        </h1>

        {/* Rich blocks OR legacy body */}
        {lesson.blocks ? (
          lesson.blocks.map((block, idx) => renderBlock(block, idx))
        ) : (
          <>
            {lesson.body.map((para, i) => (
              <p key={i} className="text-sm leading-relaxed mb-4" style={{ color: 'hsl(var(--muted-foreground))' }}>{para}</p>
            ))}
            {lesson.prompts?.map((prompt, i) => {
              const key = `legacy-${i}`
              return (
                <div key={i} className="rounded-xl p-4 mb-5" style={{ background: 'hsl(var(--foreground))' }}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#71717a' }}>{prompt.label}</span>
                    <button onClick={() => copyText(prompt.content, key)} className="flex items-center gap-1.5 text-[11px] font-semibold transition-colors"
                      style={{ color: copied === key ? '#22c55e' : '#4d96ff' }}>
                      {copied === key ? <><Check size={11} strokeWidth={2.5} /> Copié !</> : <><Copy size={11} strokeWidth={2.5} /> Copier</>}
                    </button>
                  </div>
                  <p className="font-mono text-[11px] leading-relaxed" style={{ color: '#d4d4d8' }}>{prompt.content}</p>
                </div>
              )
            })}
            {lesson.checklist && lesson.checklist.length > 0 && (
              <div className="rounded-xl p-4 mb-7" style={{ background: 'hsl(var(--secondary))' }}>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">À faire</p>
                <div className="flex flex-col gap-2.5">
                  {lesson.checklist.map((item, i) => {
                    const isChecked = checked.has(i)
                    return (
                      <button key={i} onClick={() => setChecked(prev => { const n = new Set(prev); n.has(i) ? n.delete(i) : n.add(i); return n })}
                        className="flex items-center gap-3 text-left w-full">
                        <div className="w-4 h-4 rounded-[4px] flex items-center justify-center flex-shrink-0 transition-colors"
                          style={{ background: isChecked ? '#22c55e' : 'transparent', border: isChecked ? 'none' : '1.5px solid hsl(var(--border))' }}>
                          {isChecked && <Check size={9} strokeWidth={3} color="white" />}
                        </div>
                        <span className={`text-xs transition-all ${isChecked ? 'text-muted-foreground line-through' : 'text-foreground'}`}>{item}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
          </>
        )}

        {/* Navigation */}
        <div className="flex gap-3 mt-8">
          {prevLesson ? (
            <button onClick={() => navigate(`#/dashboard/module/${moduleId}/lesson/${prevLesson.id}`)}
              className="flex items-center gap-1.5 border border-border rounded-xl px-4 py-2.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors">
              <ChevronLeft size={13} strokeWidth={1.5} /> Précédent
            </button>
          ) : <div />}
          <button onClick={done ? handleNext : handleComplete} disabled={completing}
            className="flex-1 bg-foreground text-background rounded-xl py-2.5 text-xs font-semibold disabled:opacity-50 hover:opacity-90 transition-opacity">
            {completing ? 'Sauvegarde...' : done ? nextLesson ? `Suivant : ${nextLesson.title} →` : 'Retour au module →' : 'Marquer terminé & continuer →'}
          </button>
        </div>
      </div>
    </div>
  )
}
