import type { JarvisLink } from '../../data/jarvis-intents'

export interface ChatMessage {
  id: string
  role: 'jarvis' | 'user'
  text: string
  links?: JarvisLink[]
  timestamp: Date
}

interface Props {
  message: ChatMessage
  navigate: (hash: string) => void
}

// ── Jarvis robot SVG (pixel-art, same as AgentsPage RobotJarvis) ──────────────
function RobotJarvis({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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
  )
}

// ── Inline renderer ────────────────────────────────────────────────────────────
function renderInline(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} style={{ fontWeight: 600, color: '#f0f0f5' }}>{part.slice(2, -2)}</strong>
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={i} style={{ fontFamily: 'Geist Mono, monospace', fontSize: 11, background: 'rgba(255,255,255,0.08)', borderRadius: 4, padding: '1px 5px', color: '#f0f0f5' }}>
          {part.slice(1, -1)}
        </code>
      )
    }
    return part
  })
}

function renderText(text: string): React.ReactNode {
  return text.split('\n').map((line, i, arr) => (
    <span key={i}>
      {renderInline(line)}
      {i < arr.length - 1 && <br />}
    </span>
  ))
}

export function JarvisMessageBubble({ message, navigate }: Props) {
  const isJarvis = message.role === 'jarvis'

  if (isJarvis) {
    return (
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, maxWidth: '85%', animation: 'jv-msgin .35s ease forwards' }}>
        {/* Robot SVG — no background */}
        <div style={{ flexShrink: 0, marginTop: 4 }}>
          <RobotJarvis size={28} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {/* Bubble */}
          <div style={{
            background: '#15161d',
            border: '1px solid #1e2030',
            borderRadius: '2px 14px 14px 14px',
            padding: '12px 16px',
          }}>
            <p style={{ fontSize: 13, color: '#9399b2', lineHeight: 1.75, margin: 0 }}>
              {renderText(message.text)}
            </p>
          </div>
          {/* Links */}
          {message.links && message.links.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {message.links.map((link, i) => (
                <button
                  key={i}
                  onClick={() => navigate(link.route)}
                  style={{
                    fontSize: 11, fontWeight: 500,
                    padding: '6px 12px', borderRadius: 8,
                    background: 'rgba(99,102,241,0.06)',
                    border: '1px solid rgba(99,102,241,0.2)',
                    color: '#6366f1', cursor: 'pointer',
                    transition: '.2s', fontFamily: 'Geist, sans-serif',
                  }}
                >
                  {link.label} →
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
      <div style={{
        maxWidth: '75%',
        background: 'rgba(99,102,241,0.06)',
        border: '1px solid rgba(99,102,241,0.15)',
        borderRadius: '14px 2px 14px 14px',
        padding: '12px 16px',
      }}>
        <p style={{ fontSize: 13, lineHeight: 1.65, color: '#f0f0f5', margin: 0 }}>{message.text}</p>
      </div>
    </div>
  )
}
