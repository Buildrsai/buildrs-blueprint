import { Bot } from 'lucide-react'
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

// Renders **bold** and `code` inline
function renderInline(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-semibold text-foreground">{part.slice(2, -2)}</strong>
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={i} className="font-mono text-[10px] bg-foreground/10 rounded px-1 py-0.5">
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
      <div className="flex items-start gap-2.5 max-w-[85%]">
        {/* Avatar */}
        <div className="w-6 h-6 rounded-full bg-foreground flex items-center justify-center flex-shrink-0 mt-0.5">
          <Bot size={12} strokeWidth={1.5} className="text-background" />
        </div>

        <div className="flex flex-col gap-2">
          {/* Bubble */}
          <div className="bg-secondary border border-border rounded-xl rounded-tl-sm px-4 py-3">
            <p className="text-[13px] text-foreground leading-relaxed">
              {renderText(message.text)}
            </p>
          </div>

          {/* Links */}
          {message.links && message.links.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pl-0">
              {message.links.map((link, i) => (
                <button
                  key={i}
                  onClick={() => navigate(link.route)}
                  className="text-[11px] font-medium px-3 py-1.5 rounded-lg border border-border hover:bg-secondary hover:border-foreground/20 transition-all duration-150 text-foreground/70 hover:text-foreground text-left"
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
    <div className="flex justify-end">
      <div className="max-w-[75%] bg-foreground text-background rounded-xl rounded-tr-sm px-4 py-3">
        <p className="text-[13px] leading-relaxed">{message.text}</p>
      </div>
    </div>
  )
}
