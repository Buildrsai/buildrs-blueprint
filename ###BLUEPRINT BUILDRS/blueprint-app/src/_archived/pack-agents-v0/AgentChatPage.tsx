import { useState, useRef, useEffect, useCallback } from 'react'
import { ArrowLeft, Send } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useActiveProject, buildProjectContext, type Project } from '../../hooks/useActiveProject'

// ── Dark palette ───────────────────────────────────────────────────────────────
const C = {
  bg:          '#09090b',
  s1:          '#0f1015',
  s2:          '#15161d',
  s3:          '#1a1c25',
  b1:          '#1e2030',
  b2:          '#2a2d3e',
  t:           '#f0f0f5',
  tm:          '#9399b2',
  td:          '#5b6078',
  green:       '#22c55e',
  greenGlow:   'rgba(34,197,94,0.08)',
  greenBorder: 'rgba(34,197,94,0.2)',
  indigo:      '#6366f1',
  indigoGlow:  'rgba(99,102,241,0.06)',
  indigoBorder:'rgba(99,102,241,0.15)',
} as const

// ── Agent metadata ─────────────────────────────────────────────────────────────
const AGENT_META: Record<string, { name: string; role: string; color: string; greeting: string }> = {
  validator: {
    name: 'Validator', role: 'Trouver & Valider ton idée', color: '#22c55e',
    greeting: `Bonjour. Je suis le Validator.\n\nMon job : te dire la vérité sur ton idée — pas te la vendre.\n\nDeux modes disponibles :\n- **Tu cherches une idée** → je t'en propose 5 selon ton profil\n- **Tu as déjà une idée** → je la disséque et te donne un score /100\n\nDis-moi où tu en es.`,
  },
  planner: {
    name: 'Planner', role: 'Structure ton produit en specs actionnables', color: '#3b82f6',
    greeting: `Bonjour. Je suis le Planner.\n\nJe transforme une idée validée en cahier des charges béton.\n\nDonne-moi ta fiche projet (ou colle le résultat du Validator) et je produis un **PRD complet** — features MVP, user flows, wireframes textuels, estimation MRR.\n\nPar quoi tu commences ?`,
  },
  designer: {
    name: 'Designer', role: 'Définit ton identité visuelle & kit brand', color: '#f43f5e',
    greeting: `Bonjour. Je suis le Designer.\n\nMon obsession : que ton produit ait l'air aussi sérieux que ses ambitions.\n\nJe m'inspire des meilleurs — Linear, Vercel, Resend, Raycast — mais j'adapte toujours à ton produit. Jamais du générique.\n\nDonne-moi ta fiche projet et on commence par le positionnement visuel.`,
  },
  architect: {
    name: 'Architect', role: 'Conçoit ta stack technique & CLAUDE.md', color: '#f97316',
    greeting: `Bonjour. Je suis l'Architect.\n\nJe parle peu. Ce que je produis est immédiatement exécutable.\n\nDonne-moi ta fiche projet + ton PRD et je génère le **CLAUDE.md complet** — schéma Supabase, RLS policies, structure fichiers, Edge Functions, variables d'environnement.\n\nTout ce dont Claude Code a besoin pour construire ton app.`,
  },
  builder: {
    name: 'Builder', role: 'Génère les prompts Claude Code phase par phase', color: '#8b5cf6',
    greeting: `Bonjour. Je suis le Builder.\n\nJe connais Claude Code mieux que personne — ses forces, ses limites, comment formuler pour obtenir exactement ce qu'on veut.\n\nDonne-moi ton **CLAUDE.md** (généré par l'Architect) et je produis la suite complète de prompts organisés par phase, prêts à copier dans Claude Code.\n\nOn commence ?`,
  },
  launcher: {
    name: 'Launcher', role: 'Prépare ton lancement & tes premières ventes', color: '#14b8a6',
    greeting: `Bonjour. Je suis le Launcher.\n\nJe pense conversion et premiers euros. Pas de théorie — chaque action a un impact direct sur les ventes.\n\nDonne-moi le contexte de ton produit et je livre : checklist pré-lancement, copy landing page complète, séquences email, créas Meta Ads, plan J-7 à J+30.\n\nTon produit est prêt à être lancé ?`,
  },
}

// ── Quick actions ──────────────────────────────────────────────────────────────
const QUICK_ACTIONS: Record<string, string[]> = {
  validator: ["Je cherche une idée", "J'ai déjà une idée", "Revoir mon score", "Ma fiche projet"],
  planner:   ["Coller ma fiche projet", "Lister mes features MVP", "Estimer mon MRR", "Mon PRD complet"],
  designer:  ["Mon kit brand", "Palette CSS vars", "Choisir ma typo", "Moodboard produit"],
  architect: ["Mon CLAUDE.md", "Schéma Supabase", "Structure de fichiers", "Variables d'env"],
  builder:   ["Prompts Phase 1", "Prompt Claude Code", "Checkpoint build", "Suite complète"],
  launcher:  ["Checklist pré-lancement", "Copy landing page", "Séquence emails", "Plan J-7/J+30"],
}

// ── Next agent ─────────────────────────────────────────────────────────────────
const NEXT_AGENT: Record<string, string | null> = {
  validator: 'planner', planner: 'designer', designer: 'architect',
  architect: 'builder', builder: 'launcher', launcher: null,
}

// ── Progression steps ──────────────────────────────────────────────────────────
const STEPS = [
  { label: 'Idée trouvée',       agentId: null },
  { label: 'Validation',         agentId: 'validator' },
  { label: 'Cahier des charges', agentId: 'planner' },
  { label: 'Design & branding',  agentId: 'designer' },
  { label: 'Architecture',       agentId: 'architect' },
  { label: 'Construction',       agentId: 'builder' },
  { label: 'Lancement',          agentId: 'launcher' },
]

// ── Score helpers ──────────────────────────────────────────────────────────────
function getScoreLabel(s: number) {
  if (s <= 30) return 'Pas viable'
  if (s <= 50) return 'À pivoter'
  if (s <= 70) return 'Viable avec réserves'
  if (s <= 85) return 'Bonne idée'
  return 'Excellent'
}
function getScoreColor(s: number) {
  if (s <= 30) return '#ef4444'
  if (s <= 50) return '#f97316'
  if (s <= 70) return '#eab308'
  return '#22c55e'
}

// ── Robot SVGs (pixel-art) — exact same shapes as AgentsPage ──────────────────
function RobotSVG({ agentId, size = 32 }: { agentId: string; size?: number }) {
  if (agentId === 'validator') return (
    <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="0" width="2" height="4" fill="#4ade80"/>
      <rect x="18" y="0" width="2" height="4" fill="#4ade80"/>
      <rect x="3" y="0" width="4" height="2" fill="#22c55e"/>
      <rect x="17" y="0" width="4" height="2" fill="#22c55e"/>
      <rect x="3" y="4" width="18" height="12" rx="2" fill="#22c55e"/>
      <rect x="6" y="7" width="4" height="3" rx="1" fill="#dcfce7"/>
      <rect x="14" y="7" width="4" height="3" rx="1" fill="#dcfce7"/>
      <rect x="8" y="8" width="2" height="2" fill="#14532d"/>
      <rect x="16" y="8" width="2" height="2" fill="#14532d"/>
      <rect x="8" y="12" width="2" height="2" fill="#15803d"/>
      <rect x="10" y="13" width="4" height="2" fill="#15803d"/>
      <rect x="14" y="12" width="2" height="2" fill="#15803d"/>
      <rect x="5" y="17" width="4" height="5" rx="1" fill="#15803d"/>
      <rect x="15" y="17" width="4" height="5" rx="1" fill="#15803d"/>
    </svg>
  )
  if (agentId === 'planner') return (
    <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="0" width="4" height="2" fill="#93c5fd"/>
      <rect x="11" y="1" width="2" height="4" fill="#60a5fa"/>
      <rect x="3" y="4" width="18" height="12" rx="2" fill="#3b82f6"/>
      <rect x="5" y="6" width="14" height="5" rx="1" fill="#1e3a5f"/>
      <rect x="6" y="7" width="4" height="3" fill="#bfdbfe"/>
      <rect x="14" y="7" width="4" height="3" fill="#bfdbfe"/>
      <rect x="8" y="13" width="8" height="2" rx="1" fill="#1d4ed8"/>
      <rect x="5" y="17" width="4" height="5" rx="1" fill="#1d4ed8"/>
      <rect x="15" y="17" width="4" height="5" rx="1" fill="#1d4ed8"/>
      <rect x="1" y="6" width="3" height="6" rx="1" fill="#1d4ed8"/>
      <rect x="20" y="6" width="3" height="6" rx="1" fill="#1d4ed8"/>
    </svg>
  )
  if (agentId === 'designer') return (
    <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <rect x="11" y="1" width="2" height="4" fill="#fb7185"/>
      <rect x="9" y="0" width="2" height="2" fill="#fda4af"/>
      <rect x="13" y="0" width="2" height="2" fill="#fda4af"/>
      <rect x="3" y="4" width="18" height="12" rx="2" fill="#f43f5e"/>
      <circle cx="9" cy="9" r="3" fill="#ffe4e6"/>
      <circle cx="15" cy="9" r="3" fill="#ffe4e6"/>
      <circle cx="9" cy="9" r="1.5" fill="#881337"/>
      <circle cx="15" cy="9" r="1.5" fill="#881337"/>
      <circle cx="10" cy="8" r="0.7" fill="white"/>
      <circle cx="16" cy="8" r="0.7" fill="white"/>
      <rect x="8" y="13" width="8" height="2" rx="1" fill="#9f1239"/>
      <rect x="1" y="7" width="3" height="4" rx="1" fill="#e11d48"/>
      <rect x="20" y="7" width="3" height="4" rx="1" fill="#e11d48"/>
      <rect x="5" y="17" width="4" height="5" rx="1" fill="#be123c"/>
      <rect x="15" y="17" width="4" height="5" rx="1" fill="#be123c"/>
    </svg>
  )
  if (agentId === 'architect') return (
    <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <rect x="7" y="0" width="2" height="4" fill="#fdba74"/>
      <rect x="11" y="0" width="2" height="3" fill="#fb923c"/>
      <rect x="15" y="0" width="2" height="4" fill="#fdba74"/>
      <rect x="3" y="4" width="18" height="12" rx="2" fill="#f97316"/>
      <rect x="5" y="7" width="5" height="4" rx="1" fill="#fff7ed"/>
      <rect x="14" y="7" width="5" height="4" rx="1" fill="#fff7ed"/>
      <rect x="7" y="8" width="2" height="2" fill="#7c2d12"/>
      <rect x="16" y="8" width="2" height="2" fill="#7c2d12"/>
      <rect x="7" y="13" width="10" height="2" fill="#c2410c"/>
      <rect x="1" y="5" width="3" height="8" rx="1" fill="#c2410c"/>
      <rect x="20" y="5" width="3" height="8" rx="1" fill="#c2410c"/>
      <rect x="5" y="17" width="5" height="5" rx="1" fill="#c2410c"/>
      <rect x="14" y="17" width="5" height="5" rx="1" fill="#c2410c"/>
    </svg>
  )
  if (agentId === 'builder') return (
    <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <rect x="11" y="0" width="2" height="5" fill="#a78bfa"/>
      <rect x="9" y="1" width="6" height="2" fill="#8b5cf6"/>
      <rect x="3" y="4" width="18" height="12" rx="2" fill="#8b5cf6"/>
      <line x1="6" y1="7" x2="10" y2="11" stroke="#ede9fe" strokeWidth="1.8" strokeLinecap="round"/>
      <line x1="10" y1="7" x2="6" y2="11" stroke="#ede9fe" strokeWidth="1.8" strokeLinecap="round"/>
      <line x1="14" y1="7" x2="18" y2="11" stroke="#ede9fe" strokeWidth="1.8" strokeLinecap="round"/>
      <line x1="18" y1="7" x2="14" y2="11" stroke="#ede9fe" strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M7 14 L9 12.5 L11 14 L13 12.5 L15 14 L17 12.5" stroke="#5b21b6" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      <rect x="1" y="6" width="3" height="6" rx="1" fill="#7c3aed"/>
      <rect x="20" y="6" width="3" height="6" rx="1" fill="#7c3aed"/>
      <rect x="5" y="17" width="4" height="5" rx="1" fill="#6d28d9"/>
      <rect x="15" y="17" width="4" height="5" rx="1" fill="#6d28d9"/>
    </svg>
  )
  // launcher
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <polygon points="12,0 14,3 10,3" fill="#5eead4"/>
      <rect x="11" y="2" width="2" height="3" fill="#2dd4bf"/>
      <rect x="3" y="4" width="18" height="12" rx="2" fill="#14b8a6"/>
      <polygon points="8,9 10,7 12,9 10,11" fill="#ccfbf1"/>
      <polygon points="12,9 14,7 16,9 14,11" fill="#ccfbf1"/>
      <circle cx="10" cy="9" r="1" fill="#134e4a"/>
      <circle cx="14" cy="9" r="1" fill="#134e4a"/>
      <rect x="8" y="13" width="8" height="2" rx="1" fill="#0d9488"/>
      <rect x="1" y="6" width="3" height="7" rx="1" fill="#0f766e"/>
      <rect x="20" y="6" width="3" height="7" rx="1" fill="#0f766e"/>
      <rect x="5" y="17" width="4" height="4" rx="1" fill="#0f766e"/>
      <rect x="15" y="17" width="4" height="4" rx="1" fill="#0f766e"/>
    </svg>
  )
}

// ── Safe markdown renderer ─────────────────────────────────────────────────────
function parseInline(text: string): React.ReactNode[] {
  const result: React.ReactNode[] = []
  const pattern = /\*\*([^*]+)\*\*|\*([^*]+)\*|`([^`]+)`/g
  const allMatches = [...text.matchAll(pattern)]
  let lastIndex = 0
  allMatches.forEach((match, keyIdx) => {
    const start = match.index ?? 0
    if (start > lastIndex) result.push(text.slice(lastIndex, start))
    const [, bold, italic, code] = match
    if (bold !== undefined) {
      result.push(<strong key={keyIdx} style={{ color: C.t, fontWeight: 600 }}>{bold}</strong>)
    } else if (italic !== undefined) {
      result.push(<em key={keyIdx}>{italic}</em>)
    } else if (code !== undefined) {
      result.push(
        <code key={keyIdx} style={{ fontFamily: 'monospace', fontSize: 12, padding: '1px 5px', borderRadius: 4, background: 'rgba(255,255,255,0.08)', color: C.t }}>
          {code}
        </code>
      )
    }
    lastIndex = start + match[0].length
  })
  if (lastIndex < text.length) result.push(text.slice(lastIndex))
  return result
}

function renderMarkdown(text: string, agentColor: string): React.ReactNode {
  const lines = text.split('\n')
  const nodes: React.ReactNode[] = []
  let key = 0
  let i = 0
  while (i < lines.length) {
    const line = lines[i]
    if (line.startsWith('```')) {
      const codeLines: string[] = []
      i++
      while (i < lines.length && !lines[i].startsWith('```')) { codeLines.push(lines[i]); i++ }
      nodes.push(
        <pre key={key++} style={{ borderRadius: 8, padding: '10px 14px', margin: '8px 0', overflowX: 'auto', fontSize: 12, fontFamily: 'monospace', lineHeight: 1.6, background: 'rgba(0,0,0,0.4)', color: C.tm }}>
          {codeLines.join('\n')}
        </pre>
      )
      i++; continue
    }
    if (line.startsWith('### ')) {
      nodes.push(<p key={key++} style={{ fontWeight: 700, fontSize: 13, color: C.t, marginTop: 10, marginBottom: 2 }}>{parseInline(line.slice(4))}</p>)
      i++; continue
    }
    if (line.startsWith('## ')) {
      nodes.push(<p key={key++} style={{ fontWeight: 700, fontSize: 14, color: C.t, marginTop: 12, marginBottom: 4 }}>{parseInline(line.slice(3))}</p>)
      i++; continue
    }
    if (line.startsWith('# ')) {
      nodes.push(<p key={key++} style={{ fontWeight: 800, fontSize: 15, color: C.t, marginTop: 12, marginBottom: 4 }}>{parseInline(line.slice(2))}</p>)
      i++; continue
    }
    if (line.trim() === '---') {
      nodes.push(<div key={key++} style={{ borderTop: `1px solid ${C.b1}`, margin: '10px 0' }} />)
      i++; continue
    }
    if (line.startsWith('- ') || line.startsWith('* ')) {
      const items: React.ReactNode[] = []
      while (i < lines.length && (lines[i].startsWith('- ') || lines[i].startsWith('* '))) {
        items.push(
          <li key={i} style={{ marginLeft: 16, fontSize: 13, lineHeight: 1.7, color: C.tm, listStyleType: 'disc' }}>
            {parseInline(lines[i].slice(2))}
          </li>
        )
        i++
      }
      nodes.push(<ul key={key++} style={{ margin: '4px 0' }}>{items}</ul>)
      continue
    }
    if (/^\d+\. /.test(line)) {
      const items: React.ReactNode[] = []
      while (i < lines.length && /^\d+\. /.test(lines[i])) {
        items.push(
          <li key={i} style={{ marginLeft: 20, fontSize: 13, lineHeight: 1.7, color: C.tm, listStyleType: 'decimal' }}>
            {parseInline(lines[i].replace(/^\d+\. /, ''))}
          </li>
        )
        i++
      }
      nodes.push(<ol key={key++} style={{ margin: '4px 0' }}>{items}</ol>)
      continue
    }
    if (line.trim() === '') {
      nodes.push(<div key={key++} style={{ height: 6 }} />)
      i++; continue
    }
    nodes.push(<p key={key++} style={{ fontSize: 13, lineHeight: 1.75, color: C.tm }}>{parseInline(line)}</p>)
    i++
  }
  return <>{nodes}</>
}

// ── ThinkingDots ───────────────────────────────────────────────────────────────
function ThinkingDots({ color }: { color: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '2px 0' }}>
      {[0, 1, 2].map((i) => (
        <span key={i} style={{
          width: 6, height: 6, borderRadius: '50%', background: color, display: 'inline-block',
          animation: `ac-think 1.2s ease-in-out ${i * 0.2}s infinite`,
        }} />
      ))}
    </div>
  )
}

// ── Message type ───────────────────────────────────────────────────────────────
interface Message { role: 'user' | 'agent'; content: string }

// ── Props ──────────────────────────────────────────────────────────────────────
interface Props { agentId: string; navigate: (hash: string) => void; userId?: string; hasPack?: boolean }

const FREE_AGENTS = ['validator']
const VALIDATOR_MONTHLY_LIMIT = 3
const V3_UNLOCK = new Date('2026-04-07T00:00:00+02:00').getTime()

// ── AgentChatPage ──────────────────────────────────────────────────────────────
export function AgentChatPage({ agentId, navigate, userId, hasPack = false }: Props) {
  const meta = AGENT_META[agentId]
  const isV3Live = Date.now() >= V3_UNLOCK
  // Non-free agents locked until V3, regardless of pack purchase
  const isPaywalled = !FREE_AGENTS.includes(agentId) && (!hasPack || !isV3Live)

  const { activeProject, validatorScore, mrrEstimate } = useActiveProject(userId)

  const [sbProject, setSbProject] = useState<Project | null>(null)
  const [messages, setMessages] = useState<Message[]>(() =>
    meta ? [{ role: 'agent', content: meta.greeting }] : []
  )
  const [input, setInput] = useState('')
  const [thinking, setThinking] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [score, setScore] = useState<number | null>(null)
  const [scoreDisplayed, setScoreDisplayed] = useState(0)
  const [validatorMonthlyCount, setValidatorMonthlyCount] = useState<number | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Saved score from user_metadata (fallback when no conversation score yet)
  const savedScore = validatorScore ? parseInt(validatorScore, 10) : null

  // Direct project fetch — bypasses useActiveProject ordering issues (BUG 1 fix)
  useEffect(() => {
    if (!userId) return
    supabase.from('projects').select('*').eq('user_id', userId).maybeSingle()
      .then(({ data }) => { if (data) setSbProject(data as unknown as Project) })
  }, [userId])

  // Guard: redirect unknown agent → agents list, paywalled agent → offers (BUG 3 fix)
  useEffect(() => {
    if (!meta) { navigate('#/dashboard/agents'); return }
    if (isPaywalled) navigate('#/dashboard/offers')
  }, [meta, navigate, isPaywalled])

  // Load validator monthly count from user_metadata
  useEffect(() => {
    if (agentId !== 'validator' || hasPack || !userId) return
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) return
      const m = data.user.user_metadata ?? {}
      const thisMonth = new Date().toISOString().slice(0, 7)
      const count = m.buildrs_validator_monthly_reset === thisMonth ? (m.buildrs_validator_monthly_count ?? 0) : 0
      setValidatorMonthlyCount(count)
    })
  }, [agentId, hasPack, userId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, thinking])

  // Extract score from agent messages
  useEffect(() => {
    const pattern = /\b(\d{1,3})\/100\b/g
    let found: number | null = null
    for (const msg of messages) {
      if (msg.role === 'agent') {
        const allMatches = [...msg.content.matchAll(pattern)]
        if (allMatches.length > 0) {
          const val = parseInt(allMatches[allMatches.length - 1][1], 10)
          if (val >= 0 && val <= 100) found = val
        }
      }
    }
    if (found !== null && found !== score) setScore(found)
  }, [messages])

  // Animate score counter
  useEffect(() => {
    if (score === null) return
    let current = 0
    const target = score
    const id = setInterval(() => {
      current += 2
      if (current >= target) { current = target; clearInterval(id) }
      setScoreDisplayed(current)
    }, 20)
    return () => clearInterval(id)
  }, [score])

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
    e.target.style.height = 'auto'
    e.target.style.height = Math.min(e.target.scrollHeight, 140) + 'px'
  }

  const sendMessage = useCallback(async (text?: string) => {
    const msg = (text ?? input).trim()
    if (!msg || thinking) return
    setInput('')
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
    setError(null)
    const updated: Message[] = [...messages, { role: 'user', content: msg }]
    setMessages(updated)
    setThinking(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { setError('Session expirée. Reconnecte-toi.'); setThinking(false); return }
      const history = updated.slice(1).slice(0, -1).map((m) => ({
        role: m.role === 'agent' ? 'assistant' : 'user', content: m.content,
      }))
      const projectContext = buildProjectContext(activeProject, validatorScore, mrrEstimate)
      const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/agent-chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
        body: JSON.stringify({ agentId, message: msg, history, projectContext }),
      })
      const data = await res.json()
      if (!res.ok) {
        if (data.error === 'validator_quota_exceeded') {
          setError(`Tu as utilisé tes ${VALIDATOR_MONTHLY_LIMIT} validations ce mois-ci. Débloque le Pack Agents pour un Validator illimité.`)
        } else if (data.error === 'quota_exceeded') {
          setError('Limite journalière atteinte (50 messages/jour). Reviens demain.')
        } else {
          setError(data.error ?? "Erreur lors de la réponse de l'agent.")
        }
        setThinking(false); return
      }
      setMessages((prev) => [...prev, { role: 'agent', content: data.response }])
      // Increment local validator monthly count
      if (agentId === 'validator' && !hasPack) {
        setValidatorMonthlyCount(prev => (prev ?? 0) + 1)
      }
    } catch { setError("Impossible de contacter l'agent. Vérifie ta connexion.") }
    finally { setThinking(false) }
  }, [input, thinking, messages, agentId, activeProject, validatorScore, mrrEstimate])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() }
  }

  if (!meta) return null

  const { color, name, role } = meta
  const nextId = NEXT_AGENT[agentId]
  const nextMeta = nextId ? AGENT_META[nextId] : null
  const currentStepIdx = STEPS.findIndex((s) => s.agentId === agentId)

  return (
    <>
      {/* Injected keyframes */}
      <style>{`
        @keyframes ac-think { 0%,80%,100%{transform:scale(0.7);opacity:.4} 40%{transform:scale(1);opacity:1} }
        @keyframes ac-pulse { 0%,100%{box-shadow:0 0 0 0 rgba(34,197,94,.4)} 50%{box-shadow:0 0 0 6px rgba(34,197,94,0)} }
        @keyframes ac-msgin { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
        .ac-qa:hover { border-color: var(--ac-color) !important; color: var(--ac-color) !important; background: rgba(34,197,94,.06) !important; transform: translateY(-1px); }
        .ac-send-btn:hover { opacity: .85; transform: scale(1.03); }
        .ac-back:hover { background: rgba(255,255,255,.08) !important; color: #f0f0f5 !important; }
        .ac-msg-in { animation: ac-msgin .35s ease forwards; }
        .ac-next:hover { border-color: rgba(99,102,241,.3) !important; transform: translateY(-1px); }
        .ac-livrable:hover { background: rgba(255,255,255,.05) !important; }
        @media (max-width: 900px) { .ac-sidebar { display: none !important; } .ac-grid { grid-template-columns: 1fr !important; } }
      `}</style>

      <div
        className="ac-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 320px',
          gridTemplateRows: '64px 1fr',
          height: '100%',
          background: C.bg,
          color: C.t,
          overflow: 'hidden',
          fontFamily: 'Geist, sans-serif',
        }}
      >

        {/* ── Topbar ────────────────────────────────────────────────────── */}
        <div style={{
          gridColumn: '1 / -1',
          display: 'flex', alignItems: 'center', gap: 14,
          padding: '0 24px',
          background: C.s1,
          borderBottom: `1px solid ${C.b1}`,
          zIndex: 10,
        }}>
          <button
            className="ac-back"
            onClick={() => navigate('#/dashboard/agents')}
            style={{
              width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'rgba(255,255,255,.04)', border: `1px solid ${C.b1}`, color: C.tm, cursor: 'pointer',
              transition: '.2s', flexShrink: 0,
            }}
          >
            <ArrowLeft size={15} strokeWidth={1.5} />
          </button>

          {/* Robot — no container, raw SVG */}
          <RobotSVG agentId={agentId} size={36} />

          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 15, fontWeight: 700, letterSpacing: '-0.3px', lineHeight: 1, color: C.t, marginBottom: 3 }}>
              {name}
            </p>
            <p style={{ fontSize: 11, color: C.td, fontFamily: 'Geist Mono, monospace', lineHeight: 1 }}>
              {role}
            </p>
          </div>

          <span style={{
            padding: '3px 8px', borderRadius: 4,
            fontSize: 10, fontWeight: 600, fontFamily: 'Geist Mono, monospace',
            background: `${color}1a`, color, letterSpacing: '.5px', flexShrink: 0,
          }}>
            ACTIF
          </span>
        </div>

        {/* ── Chat column ───────────────────────────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', background: C.bg }}>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: 14 }}>
            {messages.map((msg, idx) => (
              <div key={idx} className="ac-msg-in" style={{ animationDelay: `${Math.min(idx * 0.05, 0.3)}s` }}>
                {msg.role === 'agent' ? (
                  <div style={{ display: 'flex', gap: 12, maxWidth: 680 }}>
                    {/* Robot — no background, just SVG */}
                    <div style={{ flexShrink: 0, marginTop: 4 }}>
                      <RobotSVG agentId={agentId} size={28} />
                    </div>
                    <div style={{
                      background: C.s2, border: `1px solid ${C.b1}`,
                      borderRadius: '2px 14px 14px 14px',
                      padding: '14px 18px',
                      color: C.tm,
                    }}>
                      {renderMarkdown(msg.content, color)}
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <div style={{
                      maxWidth: 480,
                      background: 'rgba(99,102,241,0.06)',
                      border: `1px solid rgba(99,102,241,0.15)`,
                      borderRadius: '14px 2px 14px 14px',
                      padding: '12px 16px',
                      fontSize: 13, lineHeight: 1.65, color: C.t,
                    }}>
                      {msg.content}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {thinking && (
              <div style={{ display: 'flex', gap: 12, maxWidth: 680 }}>
                <div style={{ flexShrink: 0, marginTop: 4 }}>
                  <RobotSVG agentId={agentId} size={28} />
                </div>
                <div style={{
                  background: C.s2, border: `1px solid ${C.b1}`,
                  borderRadius: '2px 14px 14px 14px', padding: '14px 18px',
                }}>
                  <ThinkingDots color={color} />
                </div>
              </div>
            )}

            {error && (
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <p style={{ fontSize: 12, color: '#ef4444', background: 'rgba(239,68,68,0.08)', padding: '8px 14px', borderRadius: 8, border: '1px solid rgba(239,68,68,0.2)' }}>
                  {error}
                </p>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Quick actions */}
          <div style={{ display: 'flex', gap: 8, padding: '0 32px 10px', flexWrap: 'wrap' }}>
            {(QUICK_ACTIONS[agentId] ?? []).map((label) => (
              <button
                key={label}
                className="ac-qa"
                onClick={() => sendMessage(label)}
                style={{
                  padding: '8px 14px',
                  background: C.s2, border: `1px solid ${C.b1}`,
                  borderRadius: 10, color: C.tm,
                  fontSize: 12, fontWeight: 500, cursor: 'pointer',
                  transition: '.25s', ['--ac-color' as string]: color,
                  fontFamily: 'Geist, sans-serif',
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Input area */}
          <div style={{ padding: '10px 24px 20px', borderTop: `1px solid ${C.b1}`, background: C.s1 }}>
            <div style={{
              display: 'flex', alignItems: 'flex-end', gap: 10,
              background: C.s2, border: `1px solid ${C.b1}`, borderRadius: 12,
              padding: '4px 6px 4px 16px', transition: '.3s',
            }}>
              <textarea
                ref={textareaRef}
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder={`Décris ton idée au ${name}…`}
                rows={1}
                disabled={thinking}
                style={{
                  flex: 1, resize: 'none', background: 'none', border: 'none', outline: 'none',
                  fontFamily: 'Geist, sans-serif', fontSize: 13, color: C.t,
                  padding: '10px 0', lineHeight: 1.5, minHeight: 40, maxHeight: 140,
                  overflow: 'hidden',
                }}
              />
              <button
                className="ac-send-btn"
                onClick={() => sendMessage()}
                disabled={!input.trim() || thinking}
                style={{
                  width: 36, height: 36, borderRadius: 8, flexShrink: 0,
                  background: input.trim() ? color : C.b2,
                  border: 'none', cursor: input.trim() ? 'pointer' : 'default',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: '.2s', opacity: thinking ? 0.5 : 1,
                  color: 'white',
                }}
              >
                <Send size={14} strokeWidth={2} />
              </button>
            </div>
            <p style={{ textAlign: 'center', fontSize: 10, color: C.td, marginTop: 8, fontFamily: 'Geist Mono, monospace' }}>
              {name} · {role} · Powered by Claude
            </p>
          </div>
        </div>

        {/* ── Sidebar ───────────────────────────────────────────────────── */}
        <div
          className="ac-sidebar"
          style={{
            background: C.s1, borderLeft: `1px solid ${C.b1}`,
            overflowY: 'auto', padding: 16,
            display: 'flex', flexDirection: 'column', gap: 12,
          }}
        >
          {/* Section helper */}
          {[
            /* Projet actif — direct fetch bypasses useActiveProject ordering issues */
            <SbSection key="project">
              <SbLabel>Projet actif</SbLabel>
              {sbProject ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: C.t, letterSpacing: '-0.02em', lineHeight: 1.3 }}>{sbProject.name}</p>
                  {sbProject.problem && (
                    <div>
                      <p style={{ fontSize: 9, color: C.td, textTransform: 'uppercase', letterSpacing: 1, fontFamily: 'Geist Mono, monospace', marginBottom: 3 }}>Problème</p>
                      <p style={{ fontSize: 11, color: C.tm, lineHeight: 1.5 }}>{sbProject.problem}</p>
                    </div>
                  )}
                  {sbProject.target && (
                    <div>
                      <p style={{ fontSize: 9, color: C.td, textTransform: 'uppercase', letterSpacing: 1, fontFamily: 'Geist Mono, monospace', marginBottom: 3 }}>Cible</p>
                      <p style={{ fontSize: 11, color: C.tm, lineHeight: 1.5 }}>{sbProject.target}</p>
                    </div>
                  )}
                  {mrrEstimate && (
                    <div>
                      <p style={{ fontSize: 9, color: C.td, textTransform: 'uppercase', letterSpacing: 1, fontFamily: 'Geist Mono, monospace', marginBottom: 3 }}>MRR estimé</p>
                      <p style={{ fontSize: 11, color: C.green, fontFamily: 'Geist Mono, monospace', fontWeight: 600 }}>{mrrEstimate}</p>
                    </div>
                  )}
                  <button
                    onClick={() => navigate('#/dashboard/project')}
                    style={{ fontSize: 10, color: C.td, background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', padding: 0, fontFamily: 'Geist, sans-serif' }}
                  >
                    Modifier →
                  </button>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '8px 0' }}>
                  <p style={{ fontSize: 11, color: C.td, marginBottom: 8 }}>Aucun projet défini</p>
                  <button
                    onClick={() => navigate('#/dashboard/project')}
                    style={{ fontSize: 11, fontWeight: 600, color: C.t, background: C.b2, border: 'none', cursor: 'pointer', padding: '6px 12px', borderRadius: 8, fontFamily: 'Geist, sans-serif' }}
                  >
                    Créer un projet →
                  </button>
                </div>
              )}
            </SbSection>,

            /* Score (live from conversation, fallback to saved validatorScore) */
            <SbSection key="score">
              <SbLabel>Score de viabilité</SbLabel>
              {(score !== null || savedScore !== null) ? (() => {
                const displayScore = score !== null ? score : savedScore!
                const displayValue = score !== null ? scoreDisplayed : displayScore
                return (
                  <>
                    <div style={{ textAlign: 'center', padding: '6px 0' }}>
                      <div style={{
                        fontSize: 48, fontWeight: 800, fontFamily: 'Geist Mono, monospace',
                        color: getScoreColor(displayScore), lineHeight: 1,
                      }}>
                        {displayValue}
                      </div>
                      <p style={{ fontSize: 11, color: C.td, marginTop: 4 }}>{getScoreLabel(displayScore)}</p>
                    </div>
                    <div style={{ width: '100%', height: 6, borderRadius: 3, background: C.b1, marginTop: 8, overflow: 'hidden' }}>
                      <div style={{ height: '100%', borderRadius: 3, background: getScoreColor(displayScore), width: `${displayScore}%`, transition: 'width 1.5s ease' }} />
                    </div>
                    {score === null && savedScore !== null && (
                      <p style={{ fontSize: 9, color: C.td, marginTop: 6, textAlign: 'center', fontFamily: 'Geist Mono, monospace' }}>Sauvegardé · Validator</p>
                    )}
                  </>
                )
              })() : (
                <div style={{ textAlign: 'center', padding: '10px 0' }}>
                  <div style={{ fontSize: 32, fontWeight: 800, fontFamily: 'Geist Mono, monospace', color: C.td }}>—</div>
                  <p style={{ fontSize: 11, color: C.td, marginTop: 4 }}>En attente d'analyse</p>
                </div>
              )}
            </SbSection>,

            /* Validator quota — only for validator, only when no pack */
            agentId === 'validator' && !hasPack && validatorMonthlyCount !== null ? (
              <SbSection key="quota">
                <SbLabel>Quota mensuel</SbLabel>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 6 }}>
                  <span style={{
                    fontFamily: 'Geist Mono, monospace', fontSize: 28, fontWeight: 800, lineHeight: 1,
                    color: validatorMonthlyCount >= VALIDATOR_MONTHLY_LIMIT ? '#ef4444' : '#22c55e',
                  }}>
                    {validatorMonthlyCount}/{VALIDATOR_MONTHLY_LIMIT}
                  </span>
                  <span style={{ fontSize: 11, color: C.td }}>validations ce mois-ci</span>
                </div>
                {validatorMonthlyCount >= VALIDATOR_MONTHLY_LIMIT && (
                  <button
                    onClick={() => navigate('#/dashboard/offers')}
                    style={{
                      width: '100%', padding: '8px 12px', borderRadius: 8,
                      background: '#22c55e', color: '#fff',
                      fontSize: 11, fontWeight: 600, cursor: 'pointer', border: 'none',
                      fontFamily: 'Geist, sans-serif',
                    }}
                  >
                    Validator illimité — 197€ →
                  </button>
                )}
              </SbSection>
            ) : null,

            /* Progression */
            <SbSection key="progress">
              <SbLabel>Progression</SbLabel>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {STEPS.map((step, idx) => {
                  const isDone = idx < currentStepIdx || (idx === 0)
                  const isCurrent = step.agentId === agentId
                  const isLocked = !isDone && !isCurrent
                  return (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{
                        width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 10,
                        background: isDone ? 'rgba(34,197,94,.15)' : isCurrent ? 'rgba(34,197,94,.25)' : 'rgba(255,255,255,.04)',
                        color: isDone ? C.green : isCurrent ? C.green : C.td,
                        animation: isCurrent ? 'ac-pulse 2s infinite' : 'none',
                      }}>
                        {isDone ? '✓' : isCurrent ? '●' : '○'}
                      </div>
                      <span style={{
                        fontSize: 12,
                        color: isCurrent ? C.green : isDone ? C.tm : C.td,
                        fontWeight: isCurrent ? 500 : 400,
                      }}>
                        {step.label}
                      </span>
                    </div>
                  )
                })}
              </div>
            </SbSection>,

            /* Livrables */
            <SbSection key="livrables">
              <SbLabel>Livrables produits</SbLabel>
              {messages.some((m) => m.role === 'agent' && m.content.length > 200) ? (
                <div
                  className="ac-livrable"
                  style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', background: 'rgba(255,255,255,.02)', borderRadius: 8, cursor: 'pointer', transition: '.2s' }}
                >
                  <span style={{ fontSize: 13, flexShrink: 0, color: color }}>◻</span>
                  <span style={{ flex: 1, fontSize: 11, color: C.tm }}>Analyse en cours…</span>
                  <span style={{ fontSize: 10, color: C.td }}>↓</span>
                </div>
              ) : (
                <p style={{ fontSize: 11, color: C.td }}>Aucun livrable pour l'instant</p>
              )}
            </SbSection>,

            /* Next agent */
            nextMeta ? (
              <SbSection key="next" style={{ padding: 12 }}>
                <SbLabel>Prochaine étape</SbLabel>
                <div
                  className="ac-next"
                  onClick={() => {
                    if (nextId && !FREE_AGENTS.includes(nextId) && !hasPack) navigate('#/dashboard/offers')
                    else navigate(`#/dashboard/agent/${nextId}`)
                  }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: 12, background: C.indigoGlow,
                    border: `1px solid ${C.indigoBorder}`,
                    borderRadius: 10, cursor: 'pointer', transition: '.25s',
                  }}
                >
                  {/* Robot — no background */}
                  <RobotSVG agentId={nextId!} size={28} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 10, color: C.indigo, fontFamily: 'Geist Mono, monospace', textTransform: 'uppercase', letterSpacing: '.5px' }}>
                      Étape suivante
                    </p>
                    <p style={{ fontSize: 12, fontWeight: 600, color: C.t, marginTop: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {nextMeta.name} — {nextMeta.role.split(' ').slice(0, 4).join(' ')}…
                    </p>
                  </div>
                  <span style={{ color: C.indigo, fontSize: 14, flexShrink: 0 }}>→</span>
                </div>
              </SbSection>
            ) : null,
          ]}
        </div>

      </div>
    </>
  )
}

// ── Sidebar helpers ────────────────────────────────────────────────────────────
function SbSection({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      background: '#15161d', border: '1px solid #1e2030',
      borderRadius: 12, padding: 14, ...style,
    }}>
      {children}
    </div>
  )
}
function SbLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      fontSize: 10, fontWeight: 600, color: '#5b6078',
      textTransform: 'uppercase', letterSpacing: 1,
      fontFamily: 'Geist Mono, monospace', marginBottom: 10,
    }}>
      {children}
    </p>
  )
}
