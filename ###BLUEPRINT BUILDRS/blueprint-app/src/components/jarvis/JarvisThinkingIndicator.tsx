import { Bot } from 'lucide-react'

export function JarvisThinkingIndicator() {
  return (
    <div className="flex items-start gap-2.5">
      <div className="w-6 h-6 rounded-full bg-foreground flex items-center justify-center flex-shrink-0 mt-0.5">
        <Bot size={12} strokeWidth={1.5} className="text-background" />
      </div>
      <div className="bg-secondary border border-border rounded-xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5">
        <span className="text-[11px] text-muted-foreground font-medium">Jarvis analyse</span>
        <span className="flex gap-1 ml-1">
          {[0, 1, 2].map(i => (
            <span
              key={i}
              className="w-1 h-1 rounded-full bg-muted-foreground/60"
              style={{
                animation: 'jarvis-dot 1.2s ease-in-out infinite',
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </span>
      </div>
      <style>{`
        @keyframes jarvis-dot {
          0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); }
          40% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  )
}
