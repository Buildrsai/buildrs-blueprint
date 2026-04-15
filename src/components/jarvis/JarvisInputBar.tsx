import { useRef, useState, useCallback, useEffect } from 'react'
import { Send } from 'lucide-react'

// ── Quick-action suggestions ───────────────────────────────────────────────────
const SUGGESTIONS = [
  { label: 'Mon projet',       message: 'Où en est mon projet ?' },
  { label: 'Par où commencer', message: 'Par où je commence ?' },
  { label: 'Mes prompts',      message: 'Où sont les prompts ?' },
  { label: 'Claude Code',      message: 'Comment utiliser Claude Code ?' },
  { label: 'Ma checklist',     message: 'Montre-moi ma checklist' },
  { label: 'Valider mon idée', message: 'Comment valider mon idée ?' },
]

function useAutoResize(minHeight: number, maxHeight = 180) {
  const ref = useRef<HTMLTextAreaElement>(null)
  const adjust = useCallback((reset?: boolean) => {
    const el = ref.current
    if (!el) return
    if (reset) { el.style.height = `${minHeight}px`; return }
    el.style.height = `${minHeight}px`
    el.style.height = `${Math.min(el.scrollHeight, maxHeight)}px`
  }, [minHeight, maxHeight])
  useEffect(() => { if (ref.current) ref.current.style.height = `${minHeight}px` }, [minHeight])
  useEffect(() => {
    const onResize = () => adjust()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [adjust])
  return { ref, adjust }
}

interface Props {
  onSend: (text: string) => void
  disabled: boolean
}

export function JarvisInputBar({ onSend, disabled }: Props) {
  const [value, setValue] = useState('')
  const { ref, adjust } = useAutoResize(44, 180)

  const handleSend = useCallback(() => {
    const trimmed = value.trim()
    if (!trimmed || disabled) return
    onSend(trimmed)
    setValue('')
    adjust(true)
  }, [value, disabled, onSend, adjust])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
  }

  const hasValue = value.trim().length > 0

  return (
    <div style={{ flexShrink: 0, padding: '10px 20px 18px', borderTop: '1px solid hsl(var(--border))', background: 'hsl(var(--background))' }}>
      {/* Suggestions */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 10, flexWrap: 'wrap' }}>
        {SUGGESTIONS.map(s => (
          <button
            key={s.label}
            type="button"
            onClick={() => { if (!disabled) onSend(s.message) }}
            disabled={disabled}
            className="jv-qa-btn"
            style={{
              padding: '6px 12px', background: 'hsl(var(--secondary))',
              border: '1px solid hsl(var(--border))', borderRadius: 8,
              fontSize: 11, fontWeight: 500, color: 'hsl(var(--muted-foreground))',
              cursor: disabled ? 'not-allowed' : 'pointer',
              opacity: disabled ? 0.4 : 1, transition: '.2s',
              fontFamily: 'Geist, sans-serif',
            }}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Input */}
      <div style={{
        display: 'flex', alignItems: 'flex-end', gap: 8,
        background: 'hsl(var(--secondary))', border: '1px solid hsl(var(--border))',
        borderRadius: 12, padding: '4px 6px 4px 16px', transition: '.25s',
      }}>
        <textarea
          ref={ref}
          value={value}
          onChange={e => { setValue(e.target.value); adjust() }}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder="Pose ta question à Jarvis..."
          rows={1}
          style={{
            flex: 1, resize: 'none', background: 'none', border: 'none', outline: 'none',
            fontFamily: 'Geist, sans-serif', fontSize: 13, color: 'hsl(var(--foreground))',
            padding: '10px 0', lineHeight: 1.5, minHeight: 44, maxHeight: 180,
            overflow: 'hidden', opacity: disabled ? 0.5 : 1,
          }}
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
        />
        <button
          type="button"
          onClick={handleSend}
          disabled={disabled || !hasValue}
          style={{
            width: 34, height: 34, borderRadius: 8, flexShrink: 0,
            background: hasValue && !disabled ? '#6366f1' : 'hsl(var(--secondary))',
            border: 'none', cursor: hasValue && !disabled ? 'pointer' : 'default',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: '.2s', color: 'white', opacity: disabled ? 0.5 : 1,
          }}
        >
          <Send size={13} strokeWidth={2} />
        </button>
      </div>

      <style>{`
        .jv-qa-btn:hover:not(:disabled) { border-color: rgba(99,102,241,0.4) !important; color: #6366f1 !important; background: rgba(99,102,241,0.06) !important; }
      `}</style>
    </div>
  )
}
