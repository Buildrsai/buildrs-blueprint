// blueprint-app/src/components/dashboard/GeneratorPage.tsx
import { useState, useEffect } from 'react'
import { ArrowRight, Clock, ChevronRight, RotateCcw, Zap, TrendingUp, BookmarkPlus, Check } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { BuildrsIcon } from '../ui/icons'
import type { IdeaResult } from '../../types/generator'

// ── Data source SVG icons (defined outside component — rerender-no-inline-components) ──

function RedditIcon({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#FF4500">
      <path d="M12 0C5.373 0 0 5.373 0 12c0 3.314 1.343 6.314 3.515 8.485l-2.286 2.286C.775 23.225 1.097 24 1.738 24H12c6.627 0 12-5.373 12-12S18.627 0 12 0Zm4.388 3.199c1.104 0 1.999.895 1.999 1.999 0 1.105-.895 2-1.999 2-.946 0-1.739-.657-1.947-1.539v.002c-1.147.162-2.032 1.15-2.032 2.341v.007c1.776.067 3.4.567 4.686 1.363.473-.363 1.064-.58 1.707-.58 1.547 0 2.802 1.254 2.802 2.802 0 1.117-.655 2.081-1.601 2.531-.088 3.256-3.637 5.876-7.997 5.876-4.361 0-7.905-2.617-7.998-5.87-.954-.447-1.614-1.415-1.614-2.538 0-1.548 1.255-2.802 2.803-2.802.645 0 1.239.218 1.712.585 1.275-.79 2.881-1.291 4.64-1.365v-.01c0-1.663 1.263-3.034 2.88-3.207.188-.911.993-1.595 1.959-1.595Zm-8.085 8.376c-.784 0-1.459.78-1.506 1.797-.047 1.016.64 1.429 1.426 1.429.786 0 1.371-.369 1.418-1.385.047-1.017-.553-1.841-1.338-1.841Zm7.406 0c-.786 0-1.385.824-1.338 1.841.047 1.017.634 1.385 1.418 1.385.785 0 1.473-.413 1.426-1.429-.046-1.017-.721-1.797-1.506-1.797Zm-3.703 4.013c-.974 0-1.907.048-2.77.135-.147.015-.241.168-.183.305.483 1.154 1.622 1.964 2.953 1.964 1.33 0 2.47-.81 2.953-1.964.057-.137-.037-.29-.184-.305-.863-.087-1.795-.135-2.769-.135Z"/>
    </svg>
  )
}

function ProductHuntIcon({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#DA552F">
      <path d="M13.604 8.4h-3.405V12h3.405c.995 0 1.801-.806 1.801-1.801 0-.993-.805-1.799-1.801-1.799zM12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zm1.604 14.4h-3.405V18H7.801V6h5.804c2.319 0 4.2 1.88 4.2 4.199 0 2.321-1.881 4.201-4.201 4.201z"/>
    </svg>
  )
}

function AppStoreIcon({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#0D96F6">
      <path d="M8.8086 14.9194l6.1107-11.0368c.0837-.1513.1682-.302.2437-.4584.0685-.142.1267-.2854.1646-.4403.0803-.3259.0588-.6656-.066-.9767-.1238-.3095-.3417-.5678-.6201-.7355a1.4175 1.4175 0 0 0-.921-.1924c-.3207.043-.6135.1935-.8443.4288-.1094.1118-.1996.2361-.2832.369-.092.1463-.175.2979-.259.4492l-.3864.6979-.3865-.6979c-.0837-.1515-.1667-.303-.2587-.4492-.0837-.1329-.1739-.2572-.2835-.369-.2305-.2353-.5233-.3857-.844-.429a1.4181 1.4181 0 0 0-.921.1926c-.2784.1677-.4964.426-.6203.7355-.1246.311-.1461.6508-.066.9767.038.155.0962.2984.1648.4403.0753.1564.1598.307.2437.4584l1.248 2.2543-4.8625 8.7825H2.0295c-.1676 0-.3351-.0007-.5026.0092-.1522.009-.3004.0284-.448.0714-.3108.0906-.5822.2798-.7783.548-.195.2665-.3006.5929-.3006.9279 0 .3352.1057.6612.3006.9277.196.2683.4675.4575.7782.548.1477.043.296.0623.4481.0715.1675.01.335.009.5026.009h13.0974c.0171-.0357.059-.1294.1-.2697.415-1.4151-.6156-2.843-2.0347-2.843zM3.113 18.5418l-.7922 1.5008c-.0818.1553-.1644.31-.2384.4705-.067.1458-.124.293-.1611.452-.0785.3346-.0576.6834.0645 1.0029.1212.3175.3346.583.607.7549.2727.172.5891.2416.9013.1975.3139-.044.6005-.1986.8263-.4402.1072-.1148.1954-.2424.2772-.3787.0902-.1503.1714-.3059.2535-.4612L6 19.4636c-.0896-.149-.9473-1.4704-2.887-.9218m20.5861-3.0056a1.4707 1.4707 0 0 0-.779-.5407c-.1476-.0425-.2961-.0616-.4483-.0705-.1678-.0099-.3352-.0091-.503-.0091H18.648l-4.3891-7.817c-.6655.7005-.9632 1.485-1.0773 2.1976-.1655 1.0333.0367 2.0934.546 3.0004l5.2741 9.3933c.084.1494.167.299.2591.4435.0837.131.1739.2537.2836.364.231.2323.5238.3809.8449.4232.3192.0424.643-.0244.9217-.1899.2784-.1653.4968-.4204.621-.7257.1246-.3072.146-.6425.0658-.9641-.0381-.1529-.0962-.2945-.165-.4346-.0753-.1543-.1598-.303-.2438-.4524l-1.216-2.1662h1.596c.1677 0 .3351.0009.5029-.009.1522-.009.3007-.028.4483-.0705a1.4707 1.4707 0 0 0 .779-.5407A1.5386 1.5386 0 0 0 24 16.452a1.539 1.539 0 0 0-.3009-.9158Z"/>
    </svg>
  )
}

function IndieHackersIcon({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
      <path d="M0 0h24v24H0V0Zm5.4 17.2h2.4V6.8H5.4v10.4Zm4.8 0h2.4v-4h3.6v4h2.4V6.8h-2.4v4h-3.6v-4h-2.4v10.4Z"/>
    </svg>
  )
}

// ── Monochrome icons for wizard header (currentColor = adapts light/dark) ────
function RedditIconMono({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
      <path d="M12 0C5.373 0 0 5.373 0 12c0 3.314 1.343 6.314 3.515 8.485l-2.286 2.286C.775 23.225 1.097 24 1.738 24H12c6.627 0 12-5.373 12-12S18.627 0 12 0Zm4.388 3.199c1.104 0 1.999.895 1.999 1.999 0 1.105-.895 2-1.999 2-.946 0-1.739-.657-1.947-1.539v.002c-1.147.162-2.032 1.15-2.032 2.341v.007c1.776.067 3.4.567 4.686 1.363.473-.363 1.064-.58 1.707-.58 1.547 0 2.802 1.254 2.802 2.802 0 1.117-.655 2.081-1.601 2.531-.088 3.256-3.637 5.876-7.997 5.876-4.361 0-7.905-2.617-7.998-5.87-.954-.447-1.614-1.415-1.614-2.538 0-1.548 1.255-2.802 2.803-2.802.645 0 1.239.218 1.712.585 1.275-.79 2.881-1.291 4.64-1.365v-.01c0-1.663 1.263-3.034 2.88-3.207.188-.911.993-1.595 1.959-1.595Zm-8.085 8.376c-.784 0-1.459.78-1.506 1.797-.047 1.016.64 1.429 1.426 1.429.786 0 1.371-.369 1.418-1.385.047-1.017-.553-1.841-1.338-1.841Zm7.406 0c-.786 0-1.385.824-1.338 1.841.047 1.017.634 1.385 1.418 1.385.785 0 1.473-.413 1.426-1.429-.046-1.017-.721-1.797-1.506-1.797Zm-3.703 4.013c-.974 0-1.907.048-2.77.135-.147.015-.241.168-.183.305.483 1.154 1.622 1.964 2.953 1.964 1.33 0 2.47-.81 2.953-1.964.057-.137-.037-.29-.184-.305-.863-.087-1.795-.135-2.769-.135Z"/>
    </svg>
  )
}
function ProductHuntIconMono({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
      <path d="M13.604 8.4h-3.405V12h3.405c.995 0 1.801-.806 1.801-1.801 0-.993-.805-1.799-1.801-1.799zM12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zm1.604 14.4h-3.405V18H7.801V6h5.804c2.319 0 4.2 1.88 4.2 4.199 0 2.321-1.881 4.201-4.201 4.201z"/>
    </svg>
  )
}
function AppStoreIconMono({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
      <path d="M8.8086 14.9194l6.1107-11.0368c.0837-.1513.1682-.302.2437-.4584.0685-.142.1267-.2854.1646-.4403.0803-.3259.0588-.6656-.066-.9767-.1238-.3095-.3417-.5678-.6201-.7355a1.4175 1.4175 0 0 0-.921-.1924c-.3207.043-.6135.1935-.8443.4288-.1094.1118-.1996.2361-.2832.369-.092.1463-.175.2979-.259.4492l-.3864.6979-.3865-.6979c-.0837-.1515-.1667-.303-.2587-.4492-.0837-.1329-.1739-.2572-.2835-.369-.2305-.2353-.5233-.3857-.844-.429a1.4181 1.4181 0 0 0-.921.1926c-.2784.1677-.4964.426-.6203.7355-.1246.311-.1461.6508-.066.9767.038.155.0962.2984.1648.4403.0753.1564.1598.307.2437.4584l1.248 2.2543-4.8625 8.7825H2.0295c-.1676 0-.3351-.0007-.5026.0092-.1522.009-.3004.0284-.448.0714-.3108.0906-.5822.2798-.7783.548-.195.2665-.3006.5929-.3006.9279 0 .3352.1057.6612.3006.9277.196.2683.4675.4575.7782.548.1477.043.296.0623.4481.0715.1675.01.335.009.5026.009h13.0974c.0171-.0357.059-.1294.1-.2697.415-1.4151-.6156-2.843-2.0347-2.843zM3.113 18.5418l-.7922 1.5008c-.0818.1553-.1644.31-.2384.4705-.067.1458-.124.293-.1611.452-.0785.3346-.0576.6834.0645 1.0029.1212.3175.3346.583.607.7549.2727.172.5891.2416.9013.1975.3139-.044.6005-.1986.8263-.4402.1072-.1148.1954-.2424.2772-.3787.0902-.1503.1714-.3059.2535-.4612L6 19.4636c-.0896-.149-.9473-1.4704-2.887-.9218m20.5861-3.0056a1.4707 1.4707 0 0 0-.779-.5407c-.1476-.0425-.2961-.0616-.4483-.0705-.1678-.0099-.3352-.0091-.503-.0091H18.648l-4.3891-7.817c-.6655.7005-.9632 1.485-1.0773 2.1976-.1655 1.0333.0367 2.0934.546 3.0004l5.2741 9.3933c.084.1494.167.299.2591.4435.0837.131.1739.2537.2836.364.231.2323.5238.3809.8449.4232.3192.0424.643-.0244.9217-.1899.2784-.1653.4968-.4204.621-.7257.1246-.3072.146-.6425.0658-.9641-.0381-.1529-.0962-.2945-.165-.4346-.0753-.1543-.1598-.303-.2438-.4524l-1.216-2.1662h1.596c.1677 0 .3351.0009.5029-.009.1522-.009.3007-.028.4483-.0705a1.4707 1.4707 0 0 0 .779-.5407A1.5386 1.5386 0 0 0 24 16.452a1.539 1.539 0 0 0-.3009-.9158Z"/>
    </svg>
  )
}
function IndieHackersIconMono({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
      <path d="M0 0h24v24H0V0Zm5.4 17.2h2.4V6.8H5.4v10.4Zm4.8 0h2.4v-4h3.6v4h2.4V6.8h-2.4v4h-3.6v-4h-2.4v10.4Z"/>
    </svg>
  )
}

const DATA_SOURCES = [
  {
    Icon: RedditIcon,
    name: 'Reddit',
    tagline: 'Frustrations réelles',
    description: 'Threads de douleurs et problèmes récurrents dans chaque niche — non filtrés, non marketés.',
    bg: 'rgba(255,69,0,0.06)',
    border: 'rgba(255,69,0,0.15)',
    color: '#FF4500',
  },
  {
    Icon: ProductHuntIcon,
    name: 'Product Hunt',
    tagline: 'Tendances du marché',
    description: 'Top launches, gaps identifiés dans les commentaires et fonctionnalités demandées.',
    bg: 'rgba(218,85,47,0.06)',
    border: 'rgba(218,85,47,0.15)',
    color: '#DA552F',
  },
  {
    Icon: AppStoreIcon,
    name: 'App Store',
    tagline: 'Avis 1-2 étoiles',
    description: 'Fonctionnalités manquantes et frustrations des utilisateurs dans les apps existantes.',
    bg: 'rgba(13,150,246,0.06)',
    border: 'rgba(13,150,246,0.15)',
    color: '#0D96F6',
  },
  {
    Icon: IndieHackersIcon,
    name: 'Indie Hackers',
    tagline: 'Revenus validés',
    description: 'Modèles économiques publics et preuves de marché de builders qui font déjà du MRR.',
    bg: 'rgba(9,9,11,0.04)',
    border: 'rgba(9,9,11,0.12)',
    color: 'hsl(var(--foreground))',
  },
] as const

// ── Types ───────────────────────────────────────────────────────────────────
interface GeneratorContext {
  source: {
    name: string
    domain: string | null
    tagline: string | null
    category: string
    logo_url: string | null
    opportunity_title?: string | null
    target_niche?: string | null
    build_score?: number
    opportunity_id?: string
  }
}

interface PastSession {
  id: string
  mode: string
  input_data: { source?: unknown; answers?: Record<string, string> }
  output_data: { ideas?: IdeaResult[] }
  created_at: string
}

// ── Questions wizard ─────────────────────────────────────────────────────────
const QUESTIONS = [
  {
    id: 'niche',
    label: 'Dans quelle niche tu veux opérer ?',
    hint: 'Plus c\'est précis, plus l\'opportunité sera pertinente',
    type: 'text' as const,
    placeholder: 'Ex: coachs sportifs, restaurants, agences immobilières, RH PME...',
  },
  {
    id: 'goal',
    label: 'Ton objectif principal ?',
    type: 'choice' as const,
    choices: [
      { value: 'mrr', label: 'Revenus récurrents (MRR)', sub: 'Je garde et développe le SaaS' },
      { value: 'flip', label: 'Revente rapide (Flip)', sub: 'Je construis pour revendre sur Flippa/Acquire' },
      { value: 'client', label: 'Mission client', sub: 'Je construis pour un client (2 000–10 000€)' },
    ],
  },
  {
    id: 'level',
    label: 'Ton niveau actuel ?',
    type: 'choice' as const,
    choices: [
      { value: 'beginner', label: 'Débutant complet', sub: 'Jamais fait de code, je découvre Claude Code' },
      { value: 'intermediate', label: 'Quelques bases', sub: 'J\'ai déjà bidouillé avec des outils IA' },
      { value: 'experienced', label: 'J\'ai déjà lancé', sub: 'J\'ai un ou plusieurs projets live' },
    ],
  },
  {
    id: 'timeline',
    label: 'Dans combien de temps tu veux lancer ?',
    type: 'choice' as const,
    choices: [
      { value: '1 semaine', label: '1 semaine', sub: 'Mode sprint intensif, MVP ultra-simple' },
      { value: '2-3 semaines', label: '2-3 semaines', sub: 'Rythme équilibré, MVP solide' },
      { value: '1 mois', label: '1 mois', sub: 'Temps de bien faire, plus de features' },
    ],
  },
]

// ── Helpers ───────────────────────────────────────────────────────────────────
function scoreColor(s: number): string {
  if (s >= 70) return '#10B981'
  if (s >= 50) return '#F59E0B'
  return '#EF4444'
}

function ScoreBar({ label, score, explanation }: { label: string; score: number; explanation?: string }) {
  return (
    <div className="rounded-lg p-3" style={{ background: 'hsl(var(--secondary))' }}>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[11px] font-bold text-foreground">{label}</span>
        <span className="text-base font-black font-mono" style={{ color: scoreColor(score), letterSpacing: '-0.04em' }}>
          {score}
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-border overflow-hidden mb-1.5">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${score}%`, background: scoreColor(score) }}
        />
      </div>
      {explanation && (
        <p className="text-[11px] text-muted-foreground leading-relaxed">{explanation}</p>
      )}
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
interface Props {
  userId: string
  navigate: (hash: string) => void
}

export function GeneratorPage({ userId, navigate }: Props) {
  const [context, setContext] = useState<GeneratorContext | null>(null)
  const [step, setStep] = useState<'intro' | 'wizard' | 'loading' | 'results'>('intro')
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [textInput, setTextInput] = useState('')
  const [ideas, setIdeas] = useState<IdeaResult[]>([])
  const [error, setError] = useState<string | null>(null)
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null)
  const [savedIndices, setSavedIndices] = useState<Set<number>>(new Set())
  const [savingIdx, setSavingIdx] = useState<number | null>(null)
  const [pastSessions, setPastSessions] = useState<PastSession[]>([])
  const [sessionsLoaded, setSessionsLoaded] = useState(false)

  // Load session context from marketplace
  useEffect(() => {
    const raw = sessionStorage.getItem('generator_context')
    if (raw) {
      try {
        setContext(JSON.parse(raw))
        setStep('wizard') // skip intro when coming from marketplace
      } catch { /* ignore */ }
      sessionStorage.removeItem('generator_context')
    }
  }, [])

  // Load past sessions
  useEffect(() => {
    if (!userId) { setSessionsLoaded(true); return }
    void supabase
      .from('generator_sessions')
      .select('id, mode, input_data, output_data, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(3)
      .then(({ data }) => {
        if (data) setPastSessions(data as PastSession[])
        setSessionsLoaded(true)
      })
  }, [userId])

  const currentQuestion = QUESTIONS[currentQ]

  function handleAnswer(value: string) {
    const newAnswers = { ...answers, [currentQuestion.id]: value }
    setAnswers(newAnswers)
    if (currentQ < QUESTIONS.length - 1) {
      setCurrentQ(q => q + 1)
      setTextInput('')
    } else {
      void generate(newAnswers)
    }
  }

  async function generate(finalAnswers: Record<string, string>) {
    setStep('loading')
    setError(null)
    try {
      const { data, error: fnError } = await supabase.functions.invoke('generator-recommend', {
        body: {
          source: context?.source ?? null,
          answers: finalAnswers,
        },
      })
      if (fnError) {
        // Try to read the actual error message from the response body
        let msg = fnError.message ?? 'Erreur edge function'
        try {
          // FunctionsHttpError has a context property with the Response
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const body = await (fnError as any).context?.json?.()
          if (body?.error) msg = body.error
        } catch { /* ignore */ }
        throw new Error(msg)
      }
      const result = data as { ideas: IdeaResult[] }
      if (!result?.ideas?.length) throw new Error('Aucune idée générée — réessaie')
      setIdeas(result.ideas)
      setStep('results')
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
      setStep('wizard')
    }
  }

  function restart() {
    setStep('intro')
    setCurrentQ(0)
    setAnswers({})
    setTextInput('')
    setIdeas([])
    setExpandedIdx(null)
    setError(null)
    setSavedIndices(new Set())
    setContext(null)
  }

  function loadSession(session: PastSession) {
    const ideas = session.output_data?.ideas
    if (!ideas?.length) return
    setIdeas(ideas)
    setExpandedIdx(null)
    setSavedIndices(new Set())
    setStep('results')
  }

  async function saveToProjects(idea: IdeaResult, idx: number, andNavigate = false) {
    if (!userId || savedIndices.has(idx)) return
    setSavingIdx(idx)
    try {
      const { error: dbErr } = await supabase.from('ideas').insert({
        user_id: userId,
        name:    idea.title,
        problem: idea.problem_solved,
        target:  idea.target_niche,
        price:   idea.pricing_suggestion,
        note:    idea.build_score,
        feature: idea.mvp_features[0] ?? '',
        status:  'idea',
      })
      if (!dbErr) {
        setSavedIndices(prev => new Set([...prev, idx]))
        if (andNavigate) navigate('#/dashboard/project')
      }
    } finally {
      setSavingIdx(null)
    }
  }

  // ── INTRO LP ─────────────────────────────────────────────────────────────────
  if (step === 'intro') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10 space-y-20">

        {/* ── HERO ── */}
        <div className="text-center space-y-7">
          <span
            className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full"
            style={{ background: 'rgba(124,58,237,0.08)', color: '#7C3AED', border: '1px solid rgba(124,58,237,0.2)' }}
          >
            <Zap size={10} strokeWidth={2} />
            Données réelles · 4 sources analysées
          </span>

          <div className="space-y-4">
            <h1
              className="text-foreground font-black leading-none"
              style={{ fontSize: 'clamp(28px, 5vw, 48px)', letterSpacing: '-0.04em' }}
            >
              Ton SaaS IA identifié sur de vraies douleurs
            </h1>
            <p className="text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Pas des idées à la volée. Buildrs analyse Reddit, Product Hunt, l'App Store et Indie Hackers
              pour identifier les problèmes récurrents dans ta niche — et génère 3 opportunités scorées, personnalisées pour ton profil.
            </p>
          </div>

          {/* AI chat block */}
          <div
            className="max-w-lg mx-auto rounded-2xl overflow-hidden text-left"
            style={{ background: 'hsl(var(--foreground))' }}
          >
            {/* Header */}
            <div
              className="flex items-center gap-2.5 px-4 py-3"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}
            >
              <BuildrsIcon color="#ffffff" size={14} />
              <span className="text-[11px] font-semibold" style={{ color: 'rgba(255,255,255,0.5)' }}>
                Générateur de SaaS IA · Buildrs
              </span>
              <div className="ml-auto flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="text-[9px] font-bold" style={{ color: 'rgba(52,211,153,0.8)' }}>ACTIF</span>
              </div>
            </div>

            {/* Message */}
            <div className="px-4 py-4 space-y-1">
              <p className="text-[13px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.85)' }}>
                Dis-moi dans quelle niche tu veux opérer.
              </p>
              <p className="text-[12px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.4)' }}>
                Je génère 3 opportunités de micro-SaaS scorées, basées sur des problèmes réels identifiés sur Reddit, Product Hunt et l'App Store.
              </p>
            </div>

            {/* CTA */}
            <div className="px-4 pb-4">
              {pastSessions.length >= 3 ? (
                <div
                  className="w-full text-center rounded-xl py-3 text-[12px] font-semibold"
                  style={{ background: 'rgba(239,68,68,0.12)', color: '#EF4444' }}
                >
                  Limite de 3 générations atteinte
                </div>
              ) : (
                <button
                  onClick={() => setStep('wizard')}
                  className="w-full flex items-center justify-center gap-2 rounded-xl py-3 text-[13px] font-bold transition-opacity hover:opacity-90"
                  style={{ background: '#ffffff', color: '#09090b' }}
                >
                  Démarrer
                  <ArrowRight size={13} strokeWidth={2.5} />
                </button>
              )}
            </div>
          </div>

          <p className="text-[11px] text-muted-foreground/50">4 questions · Résultat en 15 secondes · {3 - pastSessions.length} génération{3 - pastSessions.length > 1 ? 's' : ''} restante{3 - pastSessions.length > 1 ? 's' : ''}</p>
        </div>

        {/* ── PAST SESSIONS ── */}
        {sessionsLoaded && pastSessions.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-muted-foreground/50">
                Tes générations
              </p>
              <span
                className="text-[9px] font-bold px-2 py-0.5 rounded-full"
                style={
                  pastSessions.length >= 3
                    ? { background: 'rgba(239,68,68,0.08)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.2)' }
                    : { background: 'rgba(16,185,129,0.08)', color: '#10B981', border: '1px solid rgba(16,185,129,0.2)' }
                }
              >
                {pastSessions.length}/3 utilisées
              </span>
            </div>

            <div className="space-y-2">
              {pastSessions.map(session => {
                const topIdea = session.output_data?.ideas?.[0]
                const allIdeas = session.output_data?.ideas ?? []
                const niche = session.input_data?.answers?.niche ?? (session.mode === 'copy' ? 'Copie SaaS' : '—')
                const date = new Date(session.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
                return (
                  <button
                    key={session.id}
                    onClick={() => loadSession(session)}
                    className="w-full flex items-center gap-3 p-4 rounded-xl border border-border hover:border-foreground/20 bg-card transition-all text-left group"
                  >
                    {/* Score */}
                    {topIdea && (
                      <span
                        className="text-[18px] font-black font-mono flex-shrink-0 w-10 text-center"
                        style={{ color: scoreColor(topIdea.build_score), letterSpacing: '-0.04em' }}
                      >
                        {topIdea.build_score}
                      </span>
                    )}
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-bold text-foreground truncate leading-snug">
                        {topIdea?.title ?? 'Génération sans titre'}
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        {niche} · {allIdeas.length} idée{allIdeas.length > 1 ? 's' : ''} · {date}
                      </p>
                    </div>
                    {/* Arrow */}
                    <div
                      className="flex items-center gap-1 text-[10px] font-semibold flex-shrink-0 transition-colors text-muted-foreground/40 group-hover:text-foreground"
                    >
                      Revoir
                      <ChevronRight size={12} strokeWidth={2} />
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* ── DATA SOURCES ── */}
        <div className="space-y-6">
          <div className="text-center space-y-1">
            <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-muted-foreground/50">
              Analysé depuis
            </p>
            <p className="text-base font-bold text-foreground" style={{ letterSpacing: '-0.02em' }}>
              Des données réelles, pas des suppositions
            </p>
            <p className="text-sm text-muted-foreground max-w-lg mx-auto">
              Chaque opportunité est fondée sur des problèmes déjà exprimés par de vraies personnes — avec preuve de budget existant.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {DATA_SOURCES.map(({ Icon, name, tagline, description, bg, border, color }) => (
              <div
                key={name}
                className="rounded-2xl p-5 flex items-start gap-4"
                style={{ background: bg, border: `1px solid ${border}` }}
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'hsl(var(--background))', border: `1px solid ${border}` }}
                >
                  <Icon size={22} />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-[13px] font-bold text-foreground">{name}</p>
                    <span
                      className="text-[9px] font-bold px-1.5 py-0.5 rounded"
                      style={{ background: `${color}15`, color, border: `1px solid ${color}25` }}
                    >
                      {tagline}
                    </span>
                  </div>
                  <p className="text-[12px] text-muted-foreground leading-relaxed">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── STATS ── */}
        <div
          className="grid grid-cols-3 gap-0 rounded-2xl overflow-hidden border border-border"
          style={{ background: 'hsl(var(--card))' }}
        >
          {[
            { value: '3', label: 'Opportunités générées' },
            { value: '0–100', label: 'Score de viabilité' },
            { value: '4', label: 'Sources de données' },
          ].map(({ value, label }, i) => (
            <div
              key={label}
              className="py-6 text-center"
              style={{ borderRight: i < 2 ? '1px solid hsl(var(--border))' : 'none' }}
            >
              <p
                className="font-black tabular-nums text-foreground leading-none mb-1.5"
                style={{ fontSize: 28, letterSpacing: '-0.04em' }}
              >
                {value}
              </p>
              <p className="text-[10px] font-medium text-muted-foreground/60 uppercase tracking-wider">{label}</p>
            </div>
          ))}
        </div>

        {/* ── BOTTOM CTA ── */}
        <div className="text-center pb-4">
          <button
            onClick={() => setStep('wizard')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-all"
          >
            Commencer les 4 questions
            <ChevronRight size={14} strokeWidth={1.5} />
          </button>
        </div>

      </div>
    )
  }

  // ── LOADING ──────────────────────────────────────────────────────────────────
  if (step === 'loading') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 flex flex-col items-center justify-center space-y-6 text-center">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center"
          style={{ background: 'rgba(124,58,237,0.1)' }}
        >
          <BuildrsIcon color="#7C3AED" size={28} />
        </div>
        <div className="space-y-2">
          <p className="text-xl font-black text-foreground" style={{ letterSpacing: '-0.03em' }}>
            Buildrs analyse ton profil...
          </p>
          <p className="text-sm text-muted-foreground">
            Génération de 3 opportunités scorées et personnalisées
          </p>
        </div>
        <div className="flex gap-2 pt-2">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="w-2.5 h-2.5 rounded-full animate-bounce"
              style={{ background: '#7C3AED', animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    )
  }

  // ── RESULTS ───────────────────────────────────────────────────────────────────
  if (step === 'results') {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">

        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1
              className="text-2xl font-black text-foreground"
              style={{ letterSpacing: '-0.04em' }}
            >
              Tes 3 opportunités sur mesure
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Scorées par Buildrs selon ton profil · Clique sur une carte pour voir le détail complet
            </p>
          </div>
          <button
            onClick={restart}
            className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs border border-border hover:bg-secondary transition-colors text-muted-foreground"
          >
            <RotateCcw size={13} strokeWidth={1.5} />
            Recommencer
          </button>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
          {ideas.map((idea, i) => {
            const expanded = expandedIdx === i
            return (
              <div
                key={i}
                onClick={() => setExpandedIdx(expanded ? null : i)}
                className="border rounded-2xl p-5 cursor-pointer transition-all duration-150 hover:border-foreground/20 bg-card"
                style={{
                  borderColor: expanded ? '#7C3AED' : 'hsl(var(--border))',
                  background: expanded ? 'rgba(124,58,237,0.02)' : undefined,
                }}
              >
                {/* Top: badge + score */}
                <div className="flex items-center justify-between mb-3">
                  <span
                    className="text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-md"
                    style={
                      i === 0
                        ? { background: 'rgba(124,58,237,0.12)', color: '#7C3AED' }
                        : { background: 'hsl(var(--secondary))', color: 'hsl(var(--muted-foreground))' }
                    }
                  >
                    {i === 0 ? 'Recommandé' : `Option ${i + 1}`}
                  </span>
                  <span
                    className="text-2xl font-black font-mono"
                    style={{ color: scoreColor(idea.build_score), letterSpacing: '-0.04em' }}
                  >
                    {idea.build_score}
                  </span>
                </div>

                {/* Title + niche */}
                <p className="text-sm font-bold text-foreground leading-tight mb-1">{idea.title}</p>
                <p className="text-[11px] text-muted-foreground mb-3 leading-snug">{idea.target_niche}</p>

                {/* Problem */}
                <p className="text-xs text-muted-foreground leading-relaxed border-t border-border pt-3 mb-3">
                  {idea.problem_solved}
                </p>

                {/* Mini score bars */}
                <div className="space-y-1.5 mb-3">
                  {[
                    { label: 'Buildabilité', score: idea.buildability_score },
                    { label: 'Traction', score: idea.traction_score },
                    { label: 'Monétisation', score: idea.monetization_score },
                  ].map(({ label, score }) => (
                    <div key={label}>
                      <div className="flex justify-between text-[10px] text-muted-foreground/60 mb-0.5">
                        <span>{label}</span>
                        <span className="font-mono">{score}</span>
                      </div>
                      <div className="h-1 rounded-full bg-secondary overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${score}%`, background: scoreColor(score) }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Meta */}
                <div className="flex items-center gap-3 text-[10px] text-muted-foreground border-t border-border pt-3 mb-3">
                  <span className="flex items-center gap-1">
                    <Clock size={10} strokeWidth={1.5} />
                    {idea.estimated_build_time}
                  </span>
                  <span className="flex items-center gap-1">
                    <TrendingUp size={10} strokeWidth={1.5} />
                    {idea.pricing_suggestion}
                  </span>
                </div>

                {/* Save button */}
                <button
                  onClick={e => { e.stopPropagation(); void saveToProjects(idea, i) }}
                  disabled={savedIndices.has(i) || savingIdx === i}
                  className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border transition-all"
                  style={
                    savedIndices.has(i)
                      ? { background: 'rgba(16,185,129,0.08)', color: '#10B981', borderColor: 'rgba(16,185,129,0.3)' }
                      : { background: 'hsl(var(--secondary))', color: 'hsl(var(--foreground))', borderColor: 'hsl(var(--border))' }
                  }
                >
                  {savedIndices.has(i) ? (
                    <><Check size={11} strokeWidth={2} /> Ajouté à mes projets</>
                  ) : savingIdx === i ? (
                    'Enregistrement...'
                  ) : (
                    <><BookmarkPlus size={11} strokeWidth={1.5} /> Ajouter à mes projets</>
                  )}
                </button>

                {/* Expanded detail */}
                {expanded && (
                  <div
                    className="mt-5 space-y-4 border-t border-border pt-4"
                    onClick={e => e.stopPropagation()}
                  >

                    {/* Why now */}
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/50 mb-1">
                        Pourquoi maintenant
                      </p>
                      <p className="text-xs text-muted-foreground leading-relaxed">{idea.why_now}</p>
                    </div>

                    {/* Current friction */}
                    {idea.current_friction && (
                      <div className="rounded-lg p-3" style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.15)' }}>
                        <p className="text-[9px] font-bold uppercase tracking-widest mb-1" style={{ color: 'rgba(239,68,68,0.6)' }}>
                          Comment ils gèrent aujourd'hui
                        </p>
                        <p className="text-xs leading-relaxed" style={{ color: '#EF4444' }}>{idea.current_friction}</p>
                      </div>
                    )}

                    {/* Market proof */}
                    {idea.market_proof && (
                      <div className="rounded-lg p-3" style={{ background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.15)' }}>
                        <p className="text-[9px] font-bold uppercase tracking-widest mb-1" style={{ color: 'rgba(16,185,129,0.6)' }}>
                          Preuve de marché
                        </p>
                        <p className="text-xs leading-relaxed" style={{ color: '#10B981' }}>{idea.market_proof}</p>
                      </div>
                    )}

                    {/* Score details */}
                    <div className="space-y-2">
                      <ScoreBar label="Buildabilité" score={idea.buildability_score} explanation={idea.buildability_explanation} />
                      <ScoreBar label="Traction marché" score={idea.traction_score} explanation={idea.traction_explanation} />
                      <ScoreBar label="Monétisation" score={idea.monetization_score} explanation={idea.monetization_explanation} />
                    </div>

                    {/* Stack */}
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/50 mb-2">
                        Stack recommandée
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {idea.recommended_stack.map(s => (
                          <span
                            key={s}
                            className="text-[10px] px-2 py-0.5 rounded-md border border-border bg-secondary text-foreground font-mono"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* MVP features */}
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/50 mb-2">
                        Features MVP
                      </p>
                      <div className="space-y-1.5">
                        {idea.mvp_features.map((f, fi) => (
                          <div key={fi} className="flex items-start gap-2">
                            <span
                              className="text-[10px] font-black mt-0.5 shrink-0 w-4 text-center"
                              style={{ color: '#7C3AED' }}
                            >
                              {fi + 1}
                            </span>
                            <span className="text-xs text-muted-foreground leading-relaxed">{f}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Acquisition */}
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/50 mb-1">
                        Canal d'acquisition
                      </p>
                      <p className="text-xs text-muted-foreground">{idea.acquisition_channel}</p>
                    </div>

                    {/* CTA */}
                    <button
                      onClick={() => savedIndices.has(i) ? navigate('#/dashboard/project') : void saveToProjects(idea, i, true)}
                      disabled={savingIdx === i}
                      className="cta-rainbow relative w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm bg-foreground text-background hover:opacity-90 transition-opacity mt-2 disabled:opacity-60"
                    >
                      <Zap size={15} strokeWidth={1.5} />
                      {savingIdx === i ? 'Sauvegarde...' : savedIndices.has(i) ? 'Voir mes projets →' : 'Sauvegarder mon projet'}
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  // ── WIZARD ────────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">

      {/* Header */}
      <div
        className="rounded-2xl border border-border p-8 text-center space-y-3"
        style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.06) 0%, rgba(16,185,129,0.04) 100%)' }}
      >
        <span
          className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full"
          style={{ background: 'rgba(124,58,237,0.12)', color: '#7C3AED' }}
        >
          <Zap size={12} strokeWidth={1.5} />
          Générateur personnalisé
        </span>
        <h1
          className="text-2xl font-black text-foreground"
          style={{ letterSpacing: '-0.04em' }}
        >
          Ton SaaS sur mesure, vérifié par
        </h1>
        <div className="flex items-center justify-center gap-4 text-foreground/40">
          <RedditIconMono size={20} />
          <ProductHuntIconMono size={20} />
          <IndieHackersIconMono size={20} />
          <AppStoreIconMono size={20} />
        </div>
        {context ? (
          <p className="text-sm text-muted-foreground">
            Basé sur{' '}
            <span className="font-semibold text-foreground">{context.source.name}</span>
            {' '}· 4 questions pour personnaliser
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">
            4 questions · Buildrs génère 3 opportunités scorées pour ton profil
          </p>
        )}
      </div>

      {/* Source context card */}
      {context && (
        <div className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card">
          {context.source.logo_url && (
            <div
              className="shrink-0 rounded-lg border border-border bg-white overflow-hidden flex items-center justify-center"
              style={{ width: 44, height: 44, padding: 5 }}
            >
              <img
                src={context.source.logo_url}
                alt={context.source.name}
                className="w-full h-full object-contain"
                onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
              />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-foreground">{context.source.name}</p>
            <p className="text-[11px] text-muted-foreground truncate">
              {context.source.opportunity_title ?? context.source.tagline ?? context.source.category}
            </p>
          </div>
          {context.source.build_score != null && (
            <span
              className="text-base font-black font-mono shrink-0"
              style={{ color: scoreColor(context.source.build_score), letterSpacing: '-0.04em' }}
            >
              {context.source.build_score}
            </span>
          )}
        </div>
      )}

      {/* Progress */}
      <div className="flex gap-2 justify-center">
        {QUESTIONS.map((_, i) => (
          <div
            key={i}
            className="h-1.5 rounded-full transition-all duration-300"
            style={{
              width: i === currentQ ? 28 : 8,
              background: i < currentQ ? '#10B981' : i === currentQ ? '#7C3AED' : 'hsl(var(--border))',
            }}
          />
        ))}
      </div>

      {/* Question */}
      <div className="space-y-5">
        <div className="space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">
            Question {currentQ + 1} / {QUESTIONS.length}
          </p>
          <h2 className="text-xl font-bold text-foreground">{currentQuestion.label}</h2>
          {currentQuestion.type === 'text' && currentQuestion.hint && (
            <p className="text-sm text-muted-foreground">{currentQuestion.hint}</p>
          )}
        </div>

        {currentQuestion.type === 'text' ? (
          <div className="space-y-3">
            <input
              type="text"
              value={textInput}
              onChange={e => setTextInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && textInput.trim() && handleAnswer(textInput.trim())}
              placeholder={currentQuestion.placeholder}
              className="w-full border border-border rounded-xl px-4 py-3 bg-background focus:outline-none focus:ring-2 focus:ring-foreground/20 text-foreground text-sm"
              autoFocus
            />
            <button
              onClick={() => textInput.trim() && handleAnswer(textInput.trim())}
              disabled={!textInput.trim()}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm bg-foreground text-background hover:opacity-90 transition-opacity disabled:opacity-40"
            >
              Continuer <ArrowRight size={15} strokeWidth={1.5} />
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {currentQuestion.choices?.map(choice => (
              <button
                key={choice.value}
                onClick={() => handleAnswer(choice.value)}
                className="w-full text-left flex items-center justify-between p-4 rounded-xl border border-border hover:border-foreground/30 hover:bg-secondary/50 transition-all bg-card"
              >
                <div>
                  <p className="text-sm font-semibold text-foreground">{choice.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{choice.sub}</p>
                </div>
                <ChevronRight size={16} strokeWidth={1.5} className="text-muted-foreground shrink-0" />
              </button>
            ))}
          </div>
        )}
      </div>

      {error && (
        <div
          className="rounded-xl p-4 text-sm text-center"
          style={{ background: 'rgba(239,68,68,0.08)', color: '#EF4444' }}
        >
          {error} —{' '}
          <button onClick={restart} className="underline font-semibold">Réessayer</button>
        </div>
      )}
    </div>
  )
}
