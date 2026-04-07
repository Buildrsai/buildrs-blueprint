// blueprint-app/src/components/dashboard/GeneratorPage.tsx
import { useState, useEffect } from 'react'
import { ArrowRight, Sparkles, Clock, ChevronRight, RotateCcw, Zap, TrendingUp } from 'lucide-react'
import { supabase } from '../../lib/supabase'

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

interface IdeaResult {
  title: string
  target_niche: string
  problem_solved: string
  traction_score: number
  traction_explanation: string
  buildability_score: number
  buildability_explanation: string
  monetization_score: number
  monetization_explanation: string
  build_score: number
  recommended_stack: string[]
  mvp_features: string[]
  pricing_suggestion: string
  estimated_build_time: string
  acquisition_channel: string
  why_now: string
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

export function GeneratorPage({ userId: _userId, navigate }: Props) {
  const [context, setContext] = useState<GeneratorContext | null>(null)
  const [step, setStep] = useState<'wizard' | 'loading' | 'results'>('wizard')
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [textInput, setTextInput] = useState('')
  const [ideas, setIdeas] = useState<IdeaResult[]>([])
  const [error, setError] = useState<string | null>(null)
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null)

  useEffect(() => {
    const raw = sessionStorage.getItem('generator_context')
    if (raw) {
      try { setContext(JSON.parse(raw)) } catch { /* ignore */ }
      sessionStorage.removeItem('generator_context')
    }
  }, [])

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
      if (fnError) throw new Error(fnError.message ?? 'Erreur edge function')
      const result = data as { ideas: IdeaResult[] }
      setIdeas(result.ideas ?? [])
      setStep('results')
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
      setStep('wizard')
    }
  }

  function restart() {
    setStep('wizard')
    setCurrentQ(0)
    setAnswers({})
    setTextInput('')
    setIdeas([])
    setExpandedIdx(null)
    setError(null)
  }

  function launchWithIdea(idea: IdeaResult) {
    sessionStorage.setItem('claude_os_context', JSON.stringify({
      idea_title: idea.title,
      target_niche: idea.target_niche,
      problem_solved: idea.problem_solved,
      recommended_stack: idea.recommended_stack,
      mvp_features: idea.mvp_features,
      pricing_suggestion: idea.pricing_suggestion,
      estimated_build_time: idea.estimated_build_time,
    }))
    navigate('#/dashboard/claude-os/generer')
  }

  // ── LOADING ──────────────────────────────────────────────────────────────────
  if (step === 'loading') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 flex flex-col items-center justify-center space-y-6 text-center">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center"
          style={{ background: 'rgba(124,58,237,0.1)' }}
        >
          <Sparkles size={28} style={{ color: '#7C3AED' }} strokeWidth={1.5} />
        </div>
        <div className="space-y-2">
          <p className="text-xl font-black text-foreground" style={{ letterSpacing: '-0.03em' }}>
            Claude analyse ton profil...
          </p>
          <p className="text-sm text-muted-foreground">
            Génération de 3 opportunités scorées et personnalisées
          </p>
        </div>
        <div className="flex gap-2 pt-2">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="w-2.5 h-2.5 rounded-full"
              style={{
                background: '#7C3AED',
                animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
              }}
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
              Scorées par Claude selon ton profil · Clique sur une carte pour voir le détail complet
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
                <div className="flex items-center gap-3 text-[10px] text-muted-foreground border-t border-border pt-3">
                  <span className="flex items-center gap-1">
                    <Clock size={10} strokeWidth={1.5} />
                    {idea.estimated_build_time}
                  </span>
                  <span className="flex items-center gap-1">
                    <TrendingUp size={10} strokeWidth={1.5} />
                    {idea.pricing_suggestion}
                  </span>
                </div>

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
                      onClick={() => launchWithIdea(idea)}
                      className="cta-rainbow relative w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm bg-foreground text-background hover:opacity-90 transition-opacity mt-2"
                    >
                      <Zap size={15} strokeWidth={1.5} />
                      Construire avec Claude OS
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
          <Sparkles size={12} strokeWidth={1.5} />
          Générateur personnalisé
        </span>
        <h1
          className="text-2xl font-black text-foreground"
          style={{ letterSpacing: '-0.04em' }}
        >
          Ton micro-SaaS sur mesure
        </h1>
        {context ? (
          <p className="text-sm text-muted-foreground">
            Basé sur{' '}
            <span className="font-semibold text-foreground">{context.source.name}</span>
            {' '}· 4 questions pour personnaliser
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">
            4 questions · Claude génère 3 opportunités scorées pour ton profil
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
