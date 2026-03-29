import { useState, useEffect, useRef, useCallback } from 'react'
import { matchIntent } from '../../data/jarvis-intents'
import { supabase } from '../../lib/supabase'
import { JarvisMessageBubble, type ChatMessage } from './JarvisMessageBubble'
import { JarvisInputBar } from './JarvisInputBar'
import { JarvisThinkingIndicator } from './JarvisThinkingIndicator'

const DAILY_LIMIT = 20

const GREETING: ChatMessage = {
  id: 'greeting',
  role: 'jarvis',
  text: 'Salut ! Je suis **Jarvis**, ton copilote IA.\n\nJe connais tout le curriculum Blueprint, les outils du stack, et je peux te guider pas à pas. Pose-moi ta question ou dis-moi où tu en es.',
  timestamp: new Date(),
}

const LIMIT_RESPONSE: ChatMessage = {
  id: 'limit',
  role: 'jarvis',
  text: 'Tu as atteint ta limite de 20 questions IA aujourd\'hui. Réessaie demain — ou consulte la Bibliothèque pour trouver ta réponse directement.',
  links: [{ label: 'Bibliothèque des prompts', route: '#/dashboard/library' }],
  timestamp: new Date(),
}

function nanoid() {
  return Math.random().toString(36).slice(2, 11)
}

interface Props {
  navigate: (hash: string) => void
  userId: string | undefined
}

export function JarvisChat({ navigate, userId }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING])
  const [isThinking, setIsThinking] = useState(false)
  const [dailyCount, setDailyCount] = useState(0)
  const bottomRef = useRef<HTMLDivElement>(null)

  // Load daily count from user_metadata on mount
  useEffect(() => {
    if (!userId) return
    supabase.auth.getUser().then(({ data }) => {
      const meta = data.user?.user_metadata ?? {}
      const reset = meta.jarvis_daily_reset
      const today = new Date().toDateString()
      if (reset === today) {
        setDailyCount(meta.jarvis_daily_count ?? 0)
      } else {
        // New day — reset counter
        setDailyCount(0)
      }
    })
  }, [userId])

  // Auto-scroll on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isThinking])

  const addMessage = (msg: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    setMessages(prev => [...prev, { ...msg, id: nanoid(), timestamp: new Date() }])
  }

  const handleSend = useCallback(async (text: string) => {
    // Add user message
    addMessage({ role: 'user', text })

    // Try local intent first
    const intent = matchIntent(text)
    if (intent) {
      addMessage({
        role: 'jarvis',
        text: intent.response,
        links: intent.links,
      })
      return
    }

    // Check rate limit before calling API
    if (dailyCount >= DAILY_LIMIT) {
      setMessages(prev => [...prev, { ...LIMIT_RESPONSE, id: nanoid(), timestamp: new Date() }])
      return
    }

    // Claude API fallback
    setIsThinking(true)
    const newCount = dailyCount + 1

    try {
      const { data, error } = await supabase.functions.invoke('jarvis-chat', {
        body: { message: text },
      })

      if (error || !data?.response) {
        addMessage({
          role: 'jarvis',
          text: 'Je n\'ai pas pu traiter ta question. Vérifie ta connexion et réessaie.',
        })
      } else {
        addMessage({
          role: 'jarvis',
          text: data.response,
          links: data.links ?? [],
        })
        // Update daily count
        setDailyCount(newCount)
        const today = new Date().toDateString()
        await supabase.auth.updateUser({
          data: { jarvis_daily_count: newCount, jarvis_daily_reset: today },
        })
      }
    } catch {
      addMessage({
        role: 'jarvis',
        text: 'Connexion impossible. Vérifie que tu es bien connecté et réessaie.',
      })
    } finally {
      setIsThinking(false)
    }
  }, [dailyCount])

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border flex-shrink-0">
        <div className="flex items-center gap-1.5">
          <span
            className="w-1.5 h-1.5 rounded-full bg-[#22c55e] flex-shrink-0"
            style={{ animation: 'autopilot-pulse 2s ease infinite' }}
          />
          <span className="text-[10px] font-bold uppercase tracking-[0.08em] text-muted-foreground">
            JARVIS IA · ACTIF
          </span>
        </div>
        {dailyCount > 0 && (
          <span className="ml-auto text-[9px] text-muted-foreground/60 font-medium tabular-nums">
            {dailyCount}/{DAILY_LIMIT} questions IA
          </span>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4 min-h-0">
        {messages.map(msg => (
          <JarvisMessageBubble key={msg.id} message={msg} navigate={navigate} />
        ))}
        {isThinking && <JarvisThinkingIndicator />}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <JarvisInputBar onSend={handleSend} disabled={isThinking} />
    </div>
  )
}
