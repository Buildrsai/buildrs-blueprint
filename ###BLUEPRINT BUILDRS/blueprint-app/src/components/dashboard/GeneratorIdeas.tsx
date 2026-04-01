import { useState } from 'react'
import { Lightbulb, RefreshCw, Copy, Check, ChevronRight, Sparkles, Zap } from 'lucide-react'
import { supabase } from '../../lib/supabase'

interface GeneratedIdea {
  name: string
  tagline: string
  problem: string
  target: string
  price: string
  mrr_potential: string
  difficulty: 'facile' | 'moyen' | 'difficile'
  score: number
  why_now: string
}

const DIFFICULTY_COLORS: Record<string, string> = {
  facile: '#22c55e',
  moyen: '#eab308',
  difficile: '#ff6b6b',
}

const NIVEAUX = [
  { value: 'débutant', label: 'Débutant — jamais codé' },
  { value: 'intermédiaire', label: 'Intermédiaire — quelques projets' },
  { value: 'avancé', label: 'Avancé — à l\'aise avec la tech' },
]

const BUDGETS = [
  { value: '0€', label: '0€ — gratuit uniquement' },
  { value: 'moins de 100€', label: 'Moins de 100€/mois' },
  { value: '100–500€', label: '100–500€/mois' },
]

const STRATEGIES = [
  { value: 'copier un SaaS existant', label: 'Copier un SaaS existant' },
  { value: 'résoudre mon problème', label: 'Résoudre mon problème' },
  { value: 'découvrir des opportunités', label: 'Découvrir des opportunités' },
]

interface Props {
  navigate: (hash: string) => void
}

type Step = 'form' | 'loading' | 'results'

export function GeneratorIdeas({ navigate }: Props) {
  const [step, setStep] = useState<Step>('form')
  const [secteur, setSecteur] = useState('')
  const [niveau, setNiveau] = useState('')
  const [budget, setBudget] = useState('')
  const [strategie, setStrategie] = useState('')
  const [contexte, setContexte] = useState('')
  const [ideas, setIdeas] = useState<GeneratedIdea[]>([])
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const isFormValid = secteur.trim() && niveau && budget && strategie

  const generate = async () => {
    setError(null)
    setStep('loading')

    const { data, error: fnError } = await supabase.functions.invoke('generate-ideas', {
      body: { secteur: secteur.trim(), niveau, budget, strategie, contexte: contexte.trim() || undefined },
    })

    if (fnError || !data?.ideas) {
      const detail = fnError?.message ?? JSON.stringify(data) ?? ''
      const msg = data?.error === 'quota_exceeded'
        ? 'Tu as atteint ta limite de 5 générations. Passe en Premium pour continuer.'
        : `Erreur IA. Vérifie ta connexion et réessaie. [${detail}]`
      setError(msg)
      setStep('form')
      return
    }

    setIdeas(data.ideas as GeneratedIdea[])
    setStep('results')
  }

  const reset = () => {
    setStep('form')
    setIdeas([])
    setError(null)
  }

  const claudePrompt = `Tu es un expert micro-SaaS. Génère 10 idées de micro-SaaS dans le secteur "${secteur}" pour un profil ${niveau}, budget ${budget}, stratégie : ${strategie}. Pour chaque idée : nom, problème, cible, prix mensuel, MRR potentiel, stack technique suggéré.`

  const handleCopy = async () => {
    await navigator.clipboard.writeText(claudePrompt)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // ── Form ──────────────────────────────────────────────────────────────────
  if (step === 'form') {
    return (
      <div className="p-7 max-w-3xl">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1.5">
            <Lightbulb size={16} strokeWidth={1.5} className="text-muted-foreground" />
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Outil IA</p>
          </div>
          <h1 className="text-3xl font-extrabold text-foreground" style={{ letterSpacing: '-0.03em' }}>
            NicheFinder
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Décris ton profil. L'IA génère 5 idées de micro-SaaS sur mesure avec scoring.
          </p>
        </div>

        <div className="border border-border rounded-xl p-5 flex flex-col gap-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Ton profil</p>

          <div>
            <label className="text-[11px] font-semibold text-muted-foreground block mb-1.5">
              Ton secteur ou expertise *
            </label>
            <input
              value={secteur}
              onChange={e => setSecteur(e.target.value)}
              placeholder="ex: comptabilité, RH, e-commerce, santé, immobilier..."
              className="w-full border border-border rounded-lg px-3 py-2.5 text-sm bg-background text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-foreground/20"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-muted-foreground block mb-1.5">
                Niveau technique *
              </label>
              <select
                value={niveau}
                onChange={e => setNiveau(e.target.value)}
                className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
              >
                <option value="">Choisir...</option>
                {NIVEAUX.map(n => <option key={n.value} value={n.value}>{n.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[11px] font-semibold text-muted-foreground block mb-1.5">
                Budget mensuel *
              </label>
              <select
                value={budget}
                onChange={e => setBudget(e.target.value)}
                className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
              >
                <option value="">Choisir...</option>
                {BUDGETS.map(b => <option key={b.value} value={b.value}>{b.label}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-muted-foreground block mb-1.5">
              Stratégie *
            </label>
            <select
              value={strategie}
              onChange={e => setStrategie(e.target.value)}
              className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
            >
              <option value="">Choisir...</option>
              {STRATEGIES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-muted-foreground block mb-1.5">
              Contexte (optionnel)
            </label>
            <textarea
              value={contexte}
              onChange={e => setContexte(e.target.value)}
              placeholder="Un problème que tu as observé, une niche que tu veux cibler, une contrainte particulière..."
              rows={3}
              className="w-full border border-border rounded-lg px-3 py-2.5 text-sm bg-background text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-foreground/20 resize-none"
            />
          </div>

          {error && (
            <p className="text-xs font-medium" style={{ color: '#ff6b6b' }}>{error}</p>
          )}

          <button
            onClick={generate}
            disabled={!isFormValid}
            className="flex items-center gap-2 bg-foreground text-background rounded-xl px-5 py-3 text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed self-start"
          >
            <Sparkles size={14} strokeWidth={1.5} />
            Générer 5 idées avec l'IA
          </button>
        </div>
      </div>
    )
  }

  // ── Loading ───────────────────────────────────────────────────────────────
  if (step === 'loading') {
    return (
      <div className="p-7 max-w-3xl">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1.5">
            <Lightbulb size={16} strokeWidth={1.5} className="text-muted-foreground" />
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Outil IA</p>
          </div>
          <h1 className="text-3xl font-extrabold text-foreground" style={{ letterSpacing: '-0.03em' }}>
            NicheFinder
          </h1>
        </div>
        <div className="border border-border rounded-xl p-8 text-center">
          <div className="flex items-center justify-center gap-1.5 mb-3">
            {[0, 1, 2].map(i => (
              <div
                key={i}
                className="w-2 h-2 rounded-full bg-foreground/30"
                style={{ animation: `bounce 1.2s ease infinite ${i * 0.2}s` }}
              />
            ))}
          </div>
          <p className="text-sm font-semibold text-foreground mb-1">Jarvis génère tes idées...</p>
          <p className="text-xs text-muted-foreground">Analyse du marché en cours — 5 à 8 secondes</p>
        </div>
        <style>{`@keyframes bounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-8px)} }`}</style>
      </div>
    )
  }

  // ── Results ───────────────────────────────────────────────────────────────
  return (
    <div className="p-7 max-w-3xl">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1.5">
          <Lightbulb size={16} strokeWidth={1.5} className="text-muted-foreground" />
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Outil IA</p>
        </div>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-extrabold text-foreground" style={{ letterSpacing: '-0.03em' }}>
            NicheFinder
          </h1>
          <button
            onClick={reset}
            className="flex items-center gap-1.5 text-[11px] text-muted-foreground hover:text-foreground transition-colors border border-border rounded-lg px-3 py-1.5"
          >
            <RefreshCw size={11} strokeWidth={1.5} />
            Recommencer
          </button>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Secteur : <span className="font-semibold text-foreground">{secteur}</span>
          {' · '}Niveau : <span className="font-semibold text-foreground">{niveau}</span>
        </p>
      </div>

      <div className="flex flex-col gap-3 mb-8">
        {ideas.map((idea, i) => {
          const diffColor = DIFFICULTY_COLORS[idea.difficulty] ?? '#eab308'
          const scoreColor = idea.score >= 75 ? '#22c55e' : idea.score >= 55 ? '#4d96ff' : '#eab308'
          return (
            <div key={i} className="border border-border rounded-xl px-5 py-4 hover:border-foreground/20 transition-colors">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-[10px] font-bold text-muted-foreground tabular-nums">#{i + 1}</span>
                    <span className="text-sm font-bold text-foreground">{idea.name}</span>
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full" style={{ color: scoreColor, background: `${scoreColor}18` }}>
                      {idea.score}/100
                    </span>
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full capitalize" style={{ color: diffColor, background: `${diffColor}18` }}>
                      {idea.difficulty}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-foreground/80 mb-1">{idea.tagline}</p>
                  <p className="text-[10px] text-muted-foreground mb-1">
                    Cible : {idea.target} · <span className="font-semibold" style={{ color: '#22c55e' }}>{idea.price}</span> · MRR : <span className="font-semibold text-foreground">{idea.mrr_potential}</span>
                  </p>
                  <p className="text-[10px] text-muted-foreground italic">
                    <Zap size={9} strokeWidth={1.5} className="inline mr-0.5 -mt-0.5" style={{ color: '#eab308' }} />
                    {idea.why_now}
                  </p>
                </div>
                <button
                  onClick={() => navigate('#/dashboard/generator/validate')}
                  className="flex items-center gap-1 text-[10px] font-semibold text-muted-foreground hover:text-foreground transition-colors flex-shrink-0 mt-1"
                >
                  Valider
                  <ChevronRight size={11} strokeWidth={1.5} />
                </button>
              </div>
            </div>
          )
        })}
      </div>

      <div className="border border-border rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2.5 bg-secondary/50 border-b border-border">
          <span className="text-[11px] font-semibold text-foreground">Prompt Claude pour aller plus loin</span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-[10px] font-medium text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-md hover:bg-secondary"
          >
            {copied
              ? <><Check size={11} strokeWidth={2} style={{ color: '#22c55e' }} /><span style={{ color: '#22c55e' }}>Copié !</span></>
              : <><Copy size={11} strokeWidth={1.5} />Copier</>
            }
          </button>
        </div>
        <div className="px-4 py-3">
          <p className="text-xs text-muted-foreground font-mono leading-relaxed">{claudePrompt}</p>
        </div>
      </div>
    </div>
  )
}
