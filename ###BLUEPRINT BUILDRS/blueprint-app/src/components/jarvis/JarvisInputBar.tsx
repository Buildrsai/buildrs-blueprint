import { useRef, useState, useCallback, useEffect } from 'react'
import { ArrowUp, Paperclip } from 'lucide-react'
import { cn } from '../../lib/utils'
import { Textarea } from '../ui/textarea'

// ── Quick-action suggestions ─────────────────────────────────────────────
const SUGGESTIONS = [
  { label: 'Mon projet',        message: 'Où en est mon projet ?' },
  { label: 'Par où commencer',  message: 'Par où je commence ?' },
  { label: 'Mes prompts',       message: 'Où sont les prompts ?' },
  { label: 'Claude Code',       message: 'Comment utiliser Claude Code ?' },
  { label: 'Ma checklist',      message: 'Montre-moi ma checklist' },
  { label: 'Valider mon idée',  message: 'Comment valider mon idée ?' },
]

// ── Auto-resize hook ─────────────────────────────────────────────────────
function useAutoResize(minHeight: number, maxHeight = 200) {
  const ref = useRef<HTMLTextAreaElement>(null)

  const adjust = useCallback((reset?: boolean) => {
    const el = ref.current
    if (!el) return
    if (reset) { el.style.height = `${minHeight}px`; return }
    el.style.height = `${minHeight}px`
    el.style.height = `${Math.min(el.scrollHeight, maxHeight)}px`
  }, [minHeight, maxHeight])

  useEffect(() => {
    if (ref.current) ref.current.style.height = `${minHeight}px`
  }, [minHeight])

  useEffect(() => {
    const onResize = () => adjust()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [adjust])

  return { ref, adjust }
}

// ── Component ─────────────────────────────────────────────────────────────
interface Props {
  onSend: (text: string) => void
  disabled: boolean
}

export function JarvisInputBar({ onSend, disabled }: Props) {
  const [value, setValue] = useState('')
  const { ref, adjust } = useAutoResize(52, 180)

  const handleSend = useCallback(() => {
    const trimmed = value.trim()
    if (!trimmed || disabled) return
    onSend(trimmed)
    setValue('')
    adjust(true)
  }, [value, disabled, onSend, adjust])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleSuggestion = (msg: string) => {
    if (disabled) return
    onSend(msg)
  }

  const hasValue = value.trim().length > 0

  return (
    <div className="flex-shrink-0 px-4 pb-4 pt-2">

      {/* ── Suggestions ── */}
      <div className="flex items-center gap-1.5 mb-3 flex-wrap">
        {SUGGESTIONS.map(s => (
          <button
            key={s.label}
            type="button"
            onClick={() => handleSuggestion(s.message)}
            disabled={disabled}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary hover:bg-foreground/8 border border-border hover:border-foreground/20 rounded-full text-[11px] font-medium text-muted-foreground hover:text-foreground transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* ── Input container ── */}
      <div className="relative bg-secondary border border-border rounded-xl overflow-hidden focus-within:border-foreground/25 transition-colors">

        {/* Textarea */}
        <Textarea
          ref={ref}
          value={value}
          onChange={e => { setValue(e.target.value); adjust() }}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder="Pose ta question à Jarvis..."
          className={cn(
            'w-full px-4 py-3.5',
            'resize-none',
            'bg-transparent border-none shadow-none',
            'text-foreground text-[13px]',
            'focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0',
            'placeholder:text-muted-foreground/60 placeholder:text-[13px]',
            'min-h-[52px]',
            'disabled:opacity-50',
          )}
          style={{ overflow: 'hidden' }}
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
        />

        {/* Bottom bar */}
        <div className="flex items-center justify-between px-3 pb-3 pt-0">
          {/* Left — attach */}
          <button
            type="button"
            className="p-1.5 text-muted-foreground/50 hover:text-muted-foreground rounded-lg hover:bg-foreground/5 transition-colors"
            tabIndex={-1}
          >
            <Paperclip size={14} strokeWidth={1.5} />
          </button>

          {/* Right — send */}
          <button
            type="button"
            onClick={handleSend}
            disabled={disabled || !hasValue}
            className={cn(
              'w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-150',
              hasValue && !disabled
                ? 'bg-foreground text-background hover:opacity-85'
                : 'bg-border text-muted-foreground/40 cursor-not-allowed',
            )}
            aria-label="Envoyer"
          >
            <ArrowUp size={13} strokeWidth={2} />
          </button>
        </div>
      </div>

    </div>
  )
}
