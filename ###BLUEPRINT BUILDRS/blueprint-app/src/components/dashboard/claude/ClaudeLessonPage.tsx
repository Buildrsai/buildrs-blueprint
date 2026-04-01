import { useState } from 'react'
import {
  ArrowLeft, ChevronLeft, ChevronRight, Check, Copy, ExternalLink,
  Globe, Zap, Lock, Terminal, BookOpen,
} from 'lucide-react'
import { ClaudeIcon } from '../../ui/icons'
import type { ClaudeBlock } from '../../../data/claude-curriculum'
import {
  getClaudeModule, getClaudeLesson,
  getClaudeNextLesson, getClaudePrevLesson,
  FRAMEWORK_STEPS,
} from '../../../data/claude-curriculum'

interface Props {
  modId: string
  lessonId: string
  navigate: (hash: string) => void
  isCompleted: (moduleId: string, lessonId: string) => boolean
  markComplete: (moduleId: string, lessonId: string) => Promise<void>
  hasClaudeCodeOb: boolean
  hasClaudeCoworkOb: boolean
}

// ── OB Gate block ─────────────────────────────────────────────────────────────
function ObGateBlock({
  block,
  navigate,
}: {
  block: Extract<ClaudeBlock, { type: 'ob-gate' }>
  navigate: (hash: string) => void
}) {
  const isCode = block.obType === 'code'
  const color = isCode ? '#8b5cf6' : '#14b8a6'
  const bgColor = isCode ? 'rgba(139,92,246,0.08)' : 'rgba(20,184,166,0.08)'
  const borderColor = isCode ? 'rgba(139,92,246,0.3)' : 'rgba(20,184,166,0.3)'

  return (
    <div className="rounded-2xl overflow-hidden mb-6" style={{ border: `1.5px solid ${borderColor}`, background: bgColor }}>
      <div className="px-5 py-4 border-b" style={{ borderColor }}>
        <div className="flex items-center gap-2 mb-1">
          <Lock size={13} strokeWidth={1.5} style={{ color }} />
          <span className="text-[10px] font-bold uppercase tracking-[0.1em]" style={{ color }}>
            {isCode ? 'Claude Code by Buildrs' : 'Claude Cowork by Buildrs'}
          </span>
        </div>
        <p className="text-sm font-bold text-foreground">{block.title}</p>
      </div>

      <div className="px-5 py-4">
        <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
          {isCode
            ? 'Cette leçon fait partie du module Claude Code by Buildrs. Débloque-le pour accéder aux commandes avancées, au workflow de build complet et aux 12 skills Buildrs.'
            : 'Cette leçon fait partie du module Claude Cowork by Buildrs. Débloque-le pour accéder au dispatch mobile, aux tâches planifiées et aux 5 workflows automation plug-and-play.'}
        </p>

        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-2xl font-extrabold text-foreground" style={{ letterSpacing: '-0.03em' }}>
            {block.price}
          </span>
          <span className="text-xs text-muted-foreground">une fois · accès à vie</span>
        </div>

        <div className="flex items-center gap-2">
          {isCode ? (
            <Terminal size={12} strokeWidth={1.5} style={{ color }} />
          ) : (
            <Zap size={12} strokeWidth={1.5} style={{ color }} />
          )}
          <span className="text-xs text-muted-foreground">
            {isCode
              ? '14 leçons · Claude Code CLI, CLAUDE.md, Skills, MCP, Sub-agents'
              : '7 leçons · Dispatch mobile, tâches planifiées, Computer Use'}
          </span>
        </div>

        <button
          onClick={() => navigate('#/dashboard/offers')}
          className="mt-4 w-full rounded-xl py-2.5 text-xs font-bold text-white transition-opacity hover:opacity-90"
          style={{ background: color }}
        >
          Débloquer — {block.price} →
        </button>
      </div>
    </div>
  )
}

// ── Block renderer ─────────────────────────────────────────────────────────────
function renderBlock(
  block: ClaudeBlock,
  idx: number,
  copied: string | null,
  setCopied: (k: string | null) => void,
  blockChecked: Set<string>,
  setBlockChecked: (fn: (prev: Set<string>) => Set<string>) => void,
  navigate: (hash: string) => void,
  hasClaudeCodeOb: boolean,
  hasClaudeCoworkOb: boolean,
): React.ReactNode {

  const copyText = async (content: string, key: string) => {
    await navigator.clipboard.writeText(content)
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }

  switch (block.type) {

    case 'ob-gate': {
      const isUnlocked = block.obType === 'code' ? hasClaudeCodeOb : hasClaudeCoworkOb
      if (isUnlocked) return null
      return <ObGateBlock key={idx} block={block} navigate={navigate} />
    }

    case 'heading':
      return block.level === 2
        ? <h2 key={idx} className="text-base font-bold text-foreground mt-7 mb-3" style={{ letterSpacing: '-0.02em' }}>{block.text}</h2>
        : <p key={idx} className="text-[10px] font-bold uppercase tracking-[0.09em] text-muted-foreground mt-5 mb-2">{block.text}</p>

    case 'text':
      return (
        <p key={idx} className="text-sm leading-relaxed mb-4 text-muted-foreground">
          {block.text}
        </p>
      )

    case 'callout': {
      const styles: Record<string, { bg: string; border: string; color: string; label?: string }> = {
        framework: { bg: 'rgba(204,93,232,0.07)', border: 'rgba(204,93,232,0.25)', color: '#cc5de8', label: 'Framework Buildrs' },
        buildrs:   { bg: 'rgba(77,150,255,0.07)', border: 'rgba(77,150,255,0.25)', color: '#4d96ff', label: 'Chez Buildrs' },
        warning:   { bg: 'rgba(234,179,8,0.07)',  border: 'rgba(234,179,8,0.3)',   color: '#eab308' },
        tip:       { bg: 'rgba(34,197,94,0.07)',  border: 'rgba(34,197,94,0.25)',  color: '#22c55e' },
      }
      const s = styles[block.variant]
      const title = block.title ?? s.label
      return (
        <div key={idx} className="rounded-xl p-4 mb-5 border" style={{ background: s.bg, borderColor: s.border }}>
          {title && <p className="text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: s.color }}>{title}</p>}
          <p className="text-xs leading-relaxed text-foreground/80">{block.text}</p>
        </div>
      )
    }

    case 'prompt': {
      const key = `prompt-${idx}`
      return (
        <div key={idx} className="rounded-xl p-4 mb-5" style={{ background: 'hsl(var(--foreground))' }}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#71717a' }}>
              {block.title ?? 'Prompt'}
            </span>
            {block.copyable !== false && (
              <button
                onClick={() => copyText(block.text, key)}
                className="flex items-center gap-1.5 text-[11px] font-semibold transition-colors"
                style={{ color: copied === key ? '#22c55e' : '#4d96ff' }}
              >
                {copied === key
                  ? <><Check size={11} strokeWidth={2.5} /> Copié !</>
                  : <><Copy size={11} strokeWidth={2.5} /> Copier</>}
              </button>
            )}
          </div>
          <p className="font-mono text-[11px] leading-relaxed whitespace-pre-wrap" style={{ color: '#d4d4d8' }}>{block.text}</p>
        </div>
      )
    }

    case 'template': {
      const key = `tpl-${idx}`
      return (
        <div key={idx} className="rounded-xl overflow-hidden mb-5 border border-border">
          <div className="px-4 py-2.5 border-b border-border flex items-center justify-between"
            style={{ background: 'hsl(var(--secondary))' }}>
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              {block.title}
            </span>
            <button
              onClick={() => copyText(block.content, key)}
              className="flex items-center gap-1.5 text-[11px] font-semibold transition-colors"
              style={{ color: copied === key ? '#22c55e' : '#4d96ff' }}
            >
              {copied === key
                ? <><Check size={11} strokeWidth={2.5} /> Copié !</>
                : <><Copy size={11} strokeWidth={2.5} /> Copier</>}
            </button>
          </div>
          <div className="p-4" style={{ background: 'hsl(var(--foreground))' }}>
            <pre className="font-mono text-[11px] leading-relaxed whitespace-pre-wrap overflow-x-auto" style={{ color: '#d4d4d8' }}>
              {block.content}
            </pre>
          </div>
        </div>
      )
    }

    case 'checklist':
      return (
        <div key={idx} className="rounded-xl p-4 mb-5" style={{ background: 'hsl(var(--secondary))' }}>
          <div className="flex flex-col gap-2.5">
            {block.items.map((item, i) => {
              const k = `${idx}-${i}`
              const isChecked = blockChecked.has(k)
              return (
                <button
                  key={i}
                  onClick={() => setBlockChecked(prev => {
                    const n = new Set(prev)
                    n.has(k) ? n.delete(k) : n.add(k)
                    return n
                  })}
                  className="flex items-center gap-3 text-left w-full"
                >
                  <div className="w-4 h-4 rounded-[4px] flex items-center justify-center flex-shrink-0 transition-colors"
                    style={{ background: isChecked ? '#22c55e' : 'transparent', border: isChecked ? 'none' : '1.5px solid hsl(var(--border))' }}>
                    {isChecked && <Check size={9} strokeWidth={3} color="white" />}
                  </div>
                  <span className={`text-xs transition-all ${isChecked ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                    {item}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      )

    case 'list':
      return (
        <div key={idx} className="mb-5">
          <div className="flex flex-col gap-1.5">
            {block.items.map((item, i) => (
              <div key={i} className="flex items-start gap-2.5 py-1.5 border-b border-border last:border-0">
                {block.style === 'numbered'
                  ? <span className="text-[11px] font-bold text-muted-foreground w-5 flex-shrink-0 pt-0.5">{i + 1}.</span>
                  : <div className="w-1 h-1 rounded-full bg-muted-foreground mt-2 flex-shrink-0" />}
                <p className="text-xs text-foreground leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </div>
      )

    case 'links':
      return (
        <div key={idx} className="mb-5">
          <div className="flex flex-col gap-2">
            {block.items.map((item, i) => (
              <a
                key={i}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 rounded-xl border p-3.5 transition-all duration-150 group"
                style={{ borderColor: 'hsl(var(--border))', background: 'hsl(var(--background))' }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'hsl(var(--foreground) / 0.25)'
                  ;(e.currentTarget as HTMLElement).style.background = 'hsl(var(--secondary))'
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'hsl(var(--border))'
                  ;(e.currentTarget as HTMLElement).style.background = 'hsl(var(--background))'
                }}
              >
                <Globe size={14} strokeWidth={1.5} className="text-muted-foreground mt-0.5 flex-shrink-0 group-hover:text-foreground transition-colors" />
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-bold text-foreground">{item.label}</span>
                  {item.desc && <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">{item.desc}</p>}
                </div>
                <ExternalLink size={11} strokeWidth={2} className="text-muted-foreground/50 flex-shrink-0 mt-0.5 group-hover:text-muted-foreground transition-colors" />
              </a>
            ))}
          </div>
        </div>
      )

    case 'diagram-cards':
      return (
        <div key={idx} className="rounded-xl border border-border p-5 mb-5">
          <div className="grid grid-cols-2 gap-2.5">
            {block.cards.map((card, ci) => (
              <div key={ci} className="rounded-lg p-3.5" style={{ background: 'hsl(var(--secondary))' }}>
                {card.badge && (
                  <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded mb-2 inline-block"
                    style={{ background: 'rgba(204,93,232,0.15)', color: '#cc5de8', border: '1px solid rgba(204,93,232,0.3)' }}>
                    {card.badge}
                  </span>
                )}
                <p className="text-[11px] font-bold text-foreground mb-1 leading-tight">{card.title}</p>
                <p className="text-[10px] text-muted-foreground leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )

    case 'glossary':
      return (
        <div key={idx} className="mb-5">
          <div className="flex flex-col">
            {block.items.map((item, ii) => (
              <div key={ii} className="flex gap-4 py-2.5 border-b border-border/50 last:border-0">
                <span className="text-[11px] font-bold text-foreground w-[140px] flex-shrink-0 pt-0.5">{item.term}</span>
                <span className="text-[11px] text-muted-foreground leading-relaxed">{item.def}</span>
              </div>
            ))}
          </div>
        </div>
      )

    default:
      return null
  }
}

// ── Main component ─────────────────────────────────────────────────────────────
export function ClaudeLessonPage({
  modId,
  lessonId,
  navigate,
  isCompleted,
  markComplete,
  hasClaudeCodeOb,
  hasClaudeCoworkOb,
}: Props) {
  const lesson = getClaudeLesson(modId, lessonId)
  const mod = getClaudeModule(modId)
  const nextLesson = getClaudeNextLesson(modId, lessonId)
  const prevLesson = getClaudePrevLesson(modId, lessonId)

  const [copied, setCopied] = useState<string | null>(null)
  const [blockChecked, setBlockChecked] = useState<Set<string>>(new Set())
  const [completing, setCompleting] = useState(false)

  if (!lesson || !mod) return <div className="p-7 text-sm text-muted-foreground">Leçon introuvable.</div>

  const done = isCompleted(modId, lessonId)
  const lessonIndex = mod.lessons.findIndex(l => l.id === lessonId)

  // Check if this lesson is gated (has an ob-gate block that's not unlocked)
  const gateBlock = lesson.blocks.find(b => b.type === 'ob-gate') as Extract<ClaudeBlock, { type: 'ob-gate' }> | undefined
  const isGated = gateBlock && !(gateBlock.obType === 'code' ? hasClaudeCodeOb : hasClaudeCoworkOb)

  const handleComplete = async () => {
    if (isGated) return
    setCompleting(true)
    await markComplete(modId, lessonId)
    setCompleting(false)
    if (nextLesson) navigate(`#/dashboard/claude/module/${modId}/lesson/${nextLesson.id}`)
    else navigate(`#/dashboard/claude/module/${modId}`)
  }

  const handleNext = () => {
    if (nextLesson) navigate(`#/dashboard/claude/module/${modId}/lesson/${nextLesson.id}`)
    else navigate(`#/dashboard/claude/module/${modId}`)
  }

  return (
    <div className="min-h-full bg-background">

      {/* Sub-header */}
      <div className="sticky top-0 z-20 bg-background border-b border-border">
        <div className="flex items-center justify-between px-4 h-12">
          <button
            onClick={() => navigate(`#/dashboard/claude/module/${modId}`)}
            className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors text-xs font-medium"
          >
            <ArrowLeft size={13} strokeWidth={1.5} />
            {mod.title}
          </button>
          <div className="flex items-center gap-1.5">
            <ClaudeIcon size={13} />
            <span className="text-xs font-medium text-muted-foreground">
              {lessonIndex + 1}/{mod.lessons.length}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {prevLesson && (
              <button
                onClick={() => navigate(`#/dashboard/claude/module/${modId}/lesson/${prevLesson.id}`)}
                className="p-1.5 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
              >
                <ChevronLeft size={13} strokeWidth={1.5} />
              </button>
            )}
            {nextLesson && (
              <button
                onClick={() => navigate(`#/dashboard/claude/module/${modId}/lesson/${nextLesson.id}`)}
                className="p-1.5 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
              >
                <ChevronRight size={13} strokeWidth={1.5} />
              </button>
            )}
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-[2px] bg-border">
          <div
            className="h-full transition-all duration-500"
            style={{
              width: `${((lessonIndex + (done ? 1 : 0)) / mod.lessons.length) * 100}%`,
              background: '#cc5de8',
            }}
          />
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">

        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 mb-5 text-xs text-muted-foreground">
          <button
            onClick={() => navigate('#/dashboard/claude')}
            className="hover:text-foreground transition-colors flex items-center gap-1"
          >
            <BookOpen size={10} strokeWidth={1.5} />
            Claude 360°
          </button>
          <ChevronRight size={10} strokeWidth={2} />
          <button
            onClick={() => navigate(`#/dashboard/claude/module/${modId}`)}
            className="hover:text-foreground transition-colors"
          >
            {mod.title}
          </button>
          <ChevronRight size={10} strokeWidth={2} />
          <span className="text-foreground font-medium truncate max-w-[180px]">{lesson.title}</span>
        </div>

        {/* Framework steps */}
        {mod.frameworkSteps.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-5">
            {mod.frameworkSteps.map(stepNum => {
              const s = FRAMEWORK_STEPS[stepNum - 1]
              return (
                <span
                  key={stepNum}
                  className="text-[9px] font-bold px-2 py-0.5 rounded"
                  style={{ background: 'rgba(204,93,232,0.08)', color: '#cc5de8', border: '1px solid rgba(204,93,232,0.2)' }}
                >
                  Étape {stepNum} · {s?.shortLabel}
                </span>
              )
            })}
          </div>
        )}

        {/* Title */}
        <h1 className="text-2xl font-extrabold text-foreground mb-1" style={{ letterSpacing: '-0.03em' }}>
          {lesson.title}
        </h1>
        {lesson.duration && (
          <p className="text-xs text-muted-foreground mb-6">{lesson.duration}</p>
        )}

        {/* Blocks */}
        {lesson.blocks.map((block, idx) =>
          renderBlock(
            block, idx, copied, setCopied,
            blockChecked, setBlockChecked,
            navigate, hasClaudeCodeOb, hasClaudeCoworkOb,
          )
        )}

        {/* Navigation footer */}
        <div className="flex gap-3 mt-8 pt-6 border-t border-border">
          {prevLesson ? (
            <button
              onClick={() => navigate(`#/dashboard/claude/module/${modId}/lesson/${prevLesson.id}`)}
              className="flex items-center gap-1.5 border border-border rounded-xl px-4 py-2.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
            >
              <ChevronLeft size={13} strokeWidth={1.5} /> Précédent
            </button>
          ) : <div />}

          {!isGated && (
            <button
              onClick={done ? handleNext : handleComplete}
              disabled={completing}
              className="flex-1 rounded-xl py-2.5 text-xs font-semibold disabled:opacity-50 hover:opacity-90 transition-opacity"
              style={{ background: 'hsl(var(--foreground))', color: 'hsl(var(--background))' }}
            >
              {completing
                ? 'Sauvegarde...'
                : done
                  ? nextLesson ? `Suivant : ${nextLesson.title} →` : 'Retour au module →'
                  : 'Marquer terminé & continuer →'}
            </button>
          )}

          {isGated && (
            <button
              onClick={() => navigate('#/dashboard/offers')}
              className="flex-1 rounded-xl py-2.5 text-xs font-semibold hover:opacity-90 transition-opacity"
              style={{ background: gateBlock!.obType === 'code' ? '#8b5cf6' : '#14b8a6', color: 'white' }}
            >
              Débloquer — {gateBlock!.price} →
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
