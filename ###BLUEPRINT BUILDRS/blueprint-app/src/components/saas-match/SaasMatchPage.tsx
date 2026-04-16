// blueprint-app/src/components/saas-match/SaasMatchPage.tsx
import { useState, useRef } from 'react'
import { ArrowRight, ChevronRight, Check } from 'lucide-react'
import { BuildrsIcon } from '../ui/icons'
import { supabase } from '../../lib/supabase'
import { trackEvent } from '../../lib/pixel'
import type { IdeaResult } from '../../types/generator'

// ── Questions ─────────────────────────────────────────────────────────────────
const QUESTIONS = [
  {
    id: 'goal',
    label: 'Ton objectif principal ?',
    type: 'choice' as const,
    choices: [
      { value: 'mrr',    label: 'Revenus récurrents (MRR)',  sub: 'Je garde et développe le SaaS IA' },
      { value: 'flip',   label: 'Revente rapide (Flip)',     sub: 'Je construis pour revendre sur Flippa/Acquire' },
      { value: 'client', label: 'Mission client',            sub: 'Je construis pour un client (2 000–10 000€)' },
    ],
  },
  {
    id: 'level',
    label: 'Ton niveau actuel ?',
    type: 'choice' as const,
    choices: [
      { value: 'beginner',      label: 'Débutant complet',   sub: 'Jamais fait de code, je découvre Claude Code' },
      { value: 'intermediate',  label: 'Quelques bases',     sub: "J'ai déjà bidouillé avec des outils IA" },
      { value: 'experienced',   label: "J'ai déjà lancé",    sub: "J'ai un ou plusieurs projets live" },
    ],
  },
  {
    id: 'timeline',
    label: 'Dans combien de temps tu veux lancer ?',
    type: 'choice' as const,
    choices: [
      { value: '1 semaine',    label: '1 semaine',    sub: 'Mode sprint intensif, MVP ultra-simple' },
      { value: '2-3 semaines', label: '2-3 semaines', sub: 'Rythme équilibré, MVP solide' },
      { value: '1 mois',       label: '1 mois',       sub: 'Temps de bien faire, plus de features' },
    ],
  },
]

// ── Loading steps ─────────────────────────────────────────────────────────────
const LOADING_STEPS = [
  'Reddit — Threads de frustrations identifiés',
  'Product Hunt — Gaps de marché analysés',
  'Indie Hackers — Modèles économiques validés',
  'App Store — Avis 1-2 étoiles',
  'Calcul du score de compatibilité',
]

// ── Props ─────────────────────────────────────────────────────────────────────
interface Props {
  onResults: (results: IdeaResult[], answers: Record<string, string>) => void
}

export function SaasMatchPage({ onResults }: Props) {
  const [step, setStep] = useState<'lp' | 'quiz' | 'loading' | 'gate'>('lp')
  const [niche, setNiche] = useState('')
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [loadingStep, setLoadingStep] = useState(0)
  const [email, setEmail] = useState('')
  const [emailLoading, setEmailLoading] = useState(false)
  const [emailError, setEmailError] = useState<string | null>(null)
  const resultsRef = useRef<IdeaResult[]>([])

  // ── Step: LP → Quiz ──────────────────────────────────────────────────────────
  function handleStart() {
    if (!niche.trim()) return
    setAnswers({ niche: niche.trim() })
    setStep('quiz')
    setCurrentQ(0)
  }

  // ── Step: Quiz → Loading ─────────────────────────────────────────────────────
  function handleAnswer(value: string) {
    const q = QUESTIONS[currentQ]
    const newAnswers = { ...answers, [q.id]: value }
    setAnswers(newAnswers)
    if (currentQ < QUESTIONS.length - 1) {
      setCurrentQ(i => i + 1)
    } else {
      void generate(newAnswers)
    }
  }

  async function generate(finalAnswers: Record<string, string>) {
    setStep('loading')
    setLoadingStep(0)

    let s = 0
    const interval = setInterval(() => {
      s += 1
      setLoadingStep(s)
      if (s >= LOADING_STEPS.length - 1) clearInterval(interval)
    }, 700)

    try {
      const { data, error } = await supabase.functions.invoke('saas-match-generate', {
        body: { answers: finalAnswers },
      })
      await new Promise(r => setTimeout(r, Math.max(0, 3500 - (s * 700))))
      clearInterval(interval)
      setLoadingStep(LOADING_STEPS.length)

      if (error || !data?.ideas?.length) throw new Error('Aucune idée générée')
      resultsRef.current = data.ideas as IdeaResult[]
      setStep('gate')
    } catch (_) {
      clearInterval(interval)
      setStep('lp')
    }
  }

  // ── Step: Gate → Results ──────────────────────────────────────────────────────
  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = email.trim().toLowerCase()
    if (!trimmed || !trimmed.includes('@')) {
      setEmailError('Entre un email valide.')
      return
    }
    setEmailLoading(true)
    setEmailError(null)

    try {
      await supabase.from('saas_match_leads').insert({
        email: trimmed,
        answers,
        results_json: { ideas: resultsRef.current },
      })
    } catch (_) { /* non-bloquant */ }

    trackEvent('Lead', { content_name: 'SaaS Match', email: trimmed })

    sessionStorage.setItem('saas_match_results', JSON.stringify(resultsRef.current))
    sessionStorage.setItem('saas_match_answers', JSON.stringify(answers))
    sessionStorage.setItem('saas_match_email', trimmed)

    setEmailLoading(false)
    onResults(resultsRef.current, answers)
  }

  // ── RENDER: LP ───────────────────────────────────────────────────────────────
  if (step === 'lp') return (
    <div
      className="min-h-screen bg-background"
      style={{
        backgroundImage: 'radial-gradient(circle, hsl(var(--foreground)/0.06) 1px, transparent 1px)',
        backgroundSize: '22px 22px',
      }}
    >
      <div className="max-w-lg mx-auto px-5 py-10">

        {/* Nav */}
        <div className="flex items-center justify-between mb-10 pb-5 border-b border-border">
          <BuildrsIcon color="hsl(var(--foreground))" size={22} />
          <span
            className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full"
            style={{ background: 'rgba(124,58,237,0.08)', color: '#7C3AED', border: '1px solid rgba(124,58,237,0.2)' }}
          >
            Gratuit
          </span>
        </div>

        {/* Hero */}
        <div className="space-y-5 mb-8">
          <span
            className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full"
            style={{ background: 'rgba(124,58,237,0.08)', color: '#7C3AED', border: '1px solid rgba(124,58,237,0.2)' }}
          >
            Données réelles · 4 sources analysées
          </span>

          <h1
            className="text-foreground font-black"
            style={{ fontSize: 'clamp(28px, 5.5vw, 46px)', letterSpacing: '-0.04em', lineHeight: 1.05 }}
          >
            <span className="block">Trouve le SaaS IA</span>
            <span className="block" style={{ color: '#7C3AED' }}>fait pour toi.</span>
          </h1>

          <p className="text-muted-foreground text-base leading-relaxed">
            2 minutes. Résultat personnalisé basé sur de vraies douleurs
            identifiées sur Reddit, Product Hunt et l'App Store.
          </p>
        </div>

        {/* Input + CTA */}
        <div className="space-y-3 mb-5">
          <input
            type="text"
            value={niche}
            onChange={e => setNiche(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleStart()}
            placeholder="Ex: coachs sportifs, restaurants, RH PME..."
            className="w-full border-2 border-foreground rounded-xl px-4 py-3.5 bg-background text-foreground text-sm focus:outline-none focus:border-[#7C3AED] transition-colors duration-150"
            autoFocus
          />
          <div className="cta-rainbow relative">
            <button
              onClick={handleStart}
              disabled={!niche.trim()}
              className="relative w-full bg-foreground text-background rounded-xl px-6 py-4 text-sm font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-40 z-10"
            >
              Trouver mon SaaS Match
              <ArrowRight size={15} strokeWidth={2} />
            </button>
          </div>
        </div>

        <p className="text-[11px] text-muted-foreground/60 text-center mb-8">
          <span className="text-foreground font-semibold">847</span> SaaS matchés cette semaine · Gratuit
        </p>

        {/* Sources */}
        <div className="flex items-center justify-center gap-2 flex-wrap mb-8">
          {['Reddit', 'Product Hunt', 'Indie Hackers', 'App Store'].map(s => (
            <span key={s} className="text-[10px] font-semibold px-2.5 py-1 rounded-md bg-secondary border border-border text-muted-foreground">
              {s}
            </span>
          ))}
        </div>

        {/* Example result teaser */}
        <div className="border border-border rounded-xl p-4 bg-secondary/50 overflow-hidden relative">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.04) 0%, transparent 60%)' }}
          />
          <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/40 mb-2.5">Exemple de résultat</p>
          <p className="text-sm font-bold text-foreground mb-1">Gestionnaire de programmes pour coachs sportifs</p>
          <div className="flex items-center gap-3 mt-2">
            <div className="h-1 flex-1 rounded-full bg-border overflow-hidden">
              <div className="h-full rounded-full bg-[#10B981]" style={{ width: '91%' }} />
            </div>
            <span className="text-[11px] font-black font-mono text-[#10B981] shrink-0">91/100</span>
          </div>
          <p className="text-[10px] text-muted-foreground/60 mt-1.5">MRR potentiel : 1 450€/mois · 5-7 jours de build</p>
        </div>

      </div>
    </div>
  )

  // ── RENDER: QUIZ ─────────────────────────────────────────────────────────────
  if (step === 'quiz') {
    const q = QUESTIONS[currentQ]
    const totalSteps = QUESTIONS.length + 1
    const doneSteps = currentQ + 1

    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-lg mx-auto px-5 py-10 space-y-8">

          {/* Progress */}
          <div className="flex gap-2">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                className="h-1.5 rounded-full transition-all duration-300"
                style={{
                  flex: i === doneSteps ? 2 : 1,
                  background: i < doneSteps ? '#10B981' : i === doneSteps ? '#7C3AED' : 'hsl(var(--border))',
                }}
              />
            ))}
          </div>

          {/* Question */}
          <div className="space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">
              Question {currentQ + 2} / {totalSteps}
            </p>
            <h2 className="text-2xl font-black text-foreground" style={{ letterSpacing: '-0.04em' }}>
              {q.label}
            </h2>
          </div>

          {/* Choices */}
          <div className="space-y-2.5">
            {q.choices.map((choice, ci) => (
              <button
                key={choice.value}
                onClick={() => handleAnswer(choice.value)}
                className="w-full text-left flex items-center justify-between p-4 rounded-xl border border-border hover:border-[#7C3AED]/40 hover:bg-secondary/50 transition-all bg-card"
                style={{
                  animationName: 'fadeSlideUp',
                  animationDuration: '0.35s',
                  animationTimingFunction: 'ease',
                  animationFillMode: 'both',
                  animationDelay: `${ci * 60}ms`,
                }}
              >
                <div>
                  <p className="text-sm font-semibold text-foreground">{choice.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{choice.sub}</p>
                </div>
                <ChevronRight size={16} strokeWidth={1.5} className="text-muted-foreground shrink-0" />
              </button>
            ))}
          </div>

          {/* Niche reminder */}
          <div
            className="flex items-center gap-2 p-3 rounded-lg"
            style={{ background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.15)' }}
          >
            <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: '#7C3AED' }}>Niche</span>
            <span className="text-[12px] font-semibold text-foreground">{answers.niche}</span>
          </div>

        </div>
      </div>
    )
  }

  // ── RENDER: LOADING ───────────────────────────────────────────────────────────
  if (step === 'loading') return (
    <div className="min-h-screen bg-background flex items-center justify-center px-5">
      <div className="max-w-sm w-full space-y-6 text-center">

        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto"
          style={{ background: 'rgba(124,58,237,0.1)' }}
        >
          <BuildrsIcon color="#7C3AED" size={24} />
        </div>

        <div className="space-y-1.5">
          <h2 className="text-xl font-black text-foreground" style={{ letterSpacing: '-0.03em' }}>
            Buildrs analyse ta niche...
          </h2>
          <p className="text-sm text-muted-foreground">
            Génération de tes 3 opportunités scorées
          </p>
        </div>

        <div className="space-y-1 text-left">
          {LOADING_STEPS.map((label, i) => {
            const done = i < loadingStep
            const active = i === loadingStep
            return (
              <div
                key={label}
                className="flex items-center gap-3 py-2.5 border-b border-border last:border-0"
                style={{
                  color: done ? '#10B981' : active ? '#7C3AED' : 'hsl(var(--muted-foreground))',
                  opacity: i > loadingStep ? 0.4 : 1,
                  transition: 'all 0.3s',
                }}
              >
                {done ? (
                  <Check size={12} strokeWidth={2.5} className="shrink-0" style={{ color: '#10B981' }} />
                ) : active ? (
                  <span
                    className="w-1.5 h-1.5 rounded-full shrink-0 animate-pulse"
                    style={{ background: '#7C3AED' }}
                  />
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-border shrink-0" />
                )}
                <span className={`text-xs ${active ? 'font-semibold' : ''}`}>{label}</span>
              </div>
            )
          })}
        </div>

      </div>
    </div>
  )

  // ── RENDER: GATE ──────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-5">
      <div className="max-w-sm w-full space-y-6 text-center">

        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto"
          style={{ background: 'rgba(124,58,237,0.1)' }}
        >
          <BuildrsIcon color="#7C3AED" size={24} />
        </div>

        <div className="space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">
            Ton résultat est prêt
          </p>
          <h2 className="text-2xl font-black text-foreground" style={{ letterSpacing: '-0.04em' }}>
            Où envoyer<br />tes 3 opportunités ?
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Entre ton email pour accéder à tes résultats personnalisés.
          </p>
        </div>

        <form onSubmit={handleEmailSubmit} className="space-y-3">
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="ton@email.com"
            required
            className="w-full border border-border rounded-xl px-4 py-3 bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20"
            autoFocus
          />
          {emailError && (
            <p className="text-xs text-center" style={{ color: '#EF4444' }}>{emailError}</p>
          )}
          <div className="cta-rainbow relative">
            <button
              type="submit"
              disabled={emailLoading}
              className="relative w-full bg-foreground text-background rounded-xl px-6 py-4 text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-60 z-10"
            >
              {emailLoading ? 'Chargement...' : 'Voir mes résultats →'}
            </button>
          </div>
        </form>

        <p className="text-[11px] text-muted-foreground/60">
          Gratuit · 0 spam · Résultats instantanés
        </p>

        <div
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-medium text-muted-foreground"
          style={{ background: 'hsl(var(--secondary))', border: '1px solid hsl(var(--border))' }}
        >
          2 847 solopreneurs ont déjà trouvé leur idée
        </div>

      </div>
    </div>
  )
}
