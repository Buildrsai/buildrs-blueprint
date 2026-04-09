import { useState, useEffect, useRef, useCallback } from 'react'
import { matchIntent } from '../../data/jarvis-intents'
import { supabase } from '../../lib/supabase'
import { JarvisMessageBubble, type ChatMessage } from './JarvisMessageBubble'
import { JarvisInputBar } from './JarvisInputBar'
import { JarvisThinkingIndicator } from './JarvisThinkingIndicator'
import { useActiveProject, buildProjectContext } from '../../hooks/useActiveProject'

function RobotJarvis({ size = 36 }: { size?: number }) {
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

const DAILY_LIMIT = 20

const GREETING_GENERIC: ChatMessage = {
  id: 'greeting',
  role: 'jarvis',
  text: 'Salut ! Je suis **Jarvis**, ton copilote IA.\n\nJe connais tout le curriculum Blueprint, les outils du stack, et je peux te guider pas à pas. Pose-moi ta question ou dis-moi où tu en es.',
  timestamp: new Date(),
}

function buildGreeting(firstName?: string, strategie?: string, objectif?: string, niveau?: string): ChatMessage {
  if (!strategie && !objectif && !niveau) return GREETING_GENERIC
  const name = firstName ? `${firstName}, ` : ''
  const strategieLabel: Record<string, string> = {
    problem: 'résoudre un problème',
    copy: 'copier un SaaS',
    discover: 'découvrir les opportunités',
  }
  const objectifLabel: Record<string, string> = {
    mrr: 'revenus récurrents',
    flip: 'revente',
    client: 'commande client',
  }
  const niveauLabel: Record<string, string> = {
    beginner: 'débutant',
    tools: 'outils IA',
    launched: 'expérimenté',
  }
  const s = strategie ? strategieLabel[strategie] ?? strategie : null
  const o = objectif ? objectifLabel[objectif] ?? objectif : null
  const n = niveau ? niveauLabel[niveau] ?? niveau : null
  const parts = [s, o, n].filter(Boolean).join(' · ')
  return {
    id: 'greeting',
    role: 'jarvis',
    text: `${name}c'est Jarvis. Profil configuré — ${parts}.\n\nDis-moi où tu en es ou ce que tu veux avancer. Je connais tout le curriculum.`,
    timestamp: new Date(),
  }
}

const LIMIT_RESPONSE: ChatMessage = {
  id: 'limit',
  role: 'jarvis',
  text: 'Tu as bien bossé aujourd\'hui. 20 questions, c\'est la limite gratuite.\n\nPour bosser sans compteur — **Jarvis illimité** + 5 agents spécialisés dans le **Pack Agents** à 197€.',
  links: [{ label: 'Débloquer le Pack Agents — 197€', route: '#/dashboard/offers' }],
  timestamp: new Date(),
}

function nanoid() {
  return Math.random().toString(36).slice(2, 11)
}

interface Props {
  navigate: (hash: string) => void
  userId: string | undefined
  userFirstName?: string
  onboardingStrategie?: string
  onboardingObjectif?: string
  onboardingNiveau?: string
  hasPack?: boolean
}

export function JarvisChat({ navigate, userId, userFirstName, onboardingStrategie, onboardingObjectif, onboardingNiveau, hasPack = false }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    buildGreeting(userFirstName, onboardingStrategie, onboardingObjectif, onboardingNiveau)
  ])
  const [isThinking, setIsThinking] = useState(false)
  const [dailyCount, setDailyCount] = useState(0)
  const bottomRef = useRef<HTMLDivElement>(null)

  const { activeProject, validatorScore, mrrEstimate } = useActiveProject(userId)

  // Load daily count from localStorage on mount
  useEffect(() => {
    if (!userId) return
    const today = new Date().toDateString()
    const stored = localStorage.getItem(`jarvis_count_${userId}`)
    if (stored) {
      const { date, count } = JSON.parse(stored)
      if (date === today) setDailyCount(count)
    }
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

    // Check rate limit before calling API (pack = unlimited)
    if (!hasPack && dailyCount >= DAILY_LIMIT) {
      setMessages(prev => [...prev, { ...LIMIT_RESPONSE, id: nanoid(), timestamp: new Date() }])
      return
    }

    // Claude API fallback
    setIsThinking(true)
    const newCount = dailyCount + 1

    try {
      const projectContext = buildProjectContext(activeProject, validatorScore, mrrEstimate)
      const { data, error } = await supabase.functions.invoke('jarvis-chat', {
        body: { message: text, projectContext: projectContext || undefined },
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
        localStorage.setItem(`jarvis_count_${userId}`, JSON.stringify({ date: today, count: newCount }))
      }
    } catch {
      addMessage({
        role: 'jarvis',
        text: 'Connexion impossible. Vérifie que tu es bien connecté et réessaie.',
      })
    } finally {
      setIsThinking(false)
    }
  }, [dailyCount, activeProject, validatorScore, mrrEstimate])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'hsl(var(--background))', color: 'hsl(var(--foreground))', fontFamily: 'Geist, sans-serif' }}>
      {/* ── Topbar ── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '0 20px', height: 64, flexShrink: 0,
        background: 'hsl(var(--card))', borderBottom: '1px solid hsl(var(--border))',
      }}>
        {/* Robot SVG — no background */}
        <RobotJarvis size={36} />

        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 15, fontWeight: 700, letterSpacing: '-0.3px', color: 'hsl(var(--foreground))', lineHeight: 1, marginBottom: 3 }}>
            Jarvis
          </p>
          <p style={{ fontSize: 11, color: 'hsl(var(--muted-foreground))', fontFamily: 'Geist Mono, monospace', lineHeight: 1 }}>
            COO IA · Orchestrateur
          </p>
        </div>

        <span style={{
          padding: '3px 8px', borderRadius: 4,
          fontSize: 10, fontWeight: 600, fontFamily: 'Geist Mono, monospace',
          background: 'rgba(99,102,241,0.12)', color: '#6366f1', letterSpacing: '.5px',
        }}>
          ACTIF
        </span>

        {activeProject && (
          <>
            <div style={{ width: 1, height: 20, background: 'hsl(var(--border))' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0, maxWidth: 140, overflow: 'hidden' }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: activeProject.status === 'live' ? '#22c55e' : activeProject.status === 'building' ? '#6366f1' : '#eab308', flexShrink: 0 }} />
              <span style={{ fontSize: 10, color: 'hsl(var(--muted-foreground))', fontFamily: 'Geist, sans-serif', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {activeProject.name}
              </span>
            </div>
          </>
        )}

        {dailyCount > 0 && (
          <>
            <div style={{ width: 1, height: 20, background: 'hsl(var(--border))' }} />
            <span style={{ fontSize: 10, color: 'hsl(var(--muted-foreground))', fontFamily: 'Geist Mono, monospace', flexShrink: 0 }}>
              {dailyCount}/{DAILY_LIMIT} msg
            </span>
          </>
        )}
      </div>

      {/* ── Messages ── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 14, minHeight: 0 }}>
        {messages.map(msg => (
          <JarvisMessageBubble key={msg.id} message={msg} navigate={navigate} />
        ))}
        {isThinking && <JarvisThinkingIndicator />}
        <div ref={bottomRef} />
      </div>

      {/* ── Input ── */}
      <JarvisInputBar onSend={handleSend} disabled={isThinking} />
    </div>
  )
}
