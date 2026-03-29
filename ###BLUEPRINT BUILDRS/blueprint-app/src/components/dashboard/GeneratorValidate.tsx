import { useState } from 'react'
import { ShieldCheck, Sparkles, RefreshCw, TrendingUp, AlertTriangle, Lightbulb } from 'lucide-react'
import { supabase } from '../../lib/supabase'

interface ValidationReport {
  score: number
  criteria: {
    marche: number
    concurrence: number
    faisabilite: number
    monetisation: number
    timing: number
  }
  verdict: 'go' | 'go_reserves' | 'pivot'
  strengths: string[]
  weaknesses: string[]
  recommendations: string[]
  summary: string
}

const VERDICTS = {
  go:          { label: 'Fonce.', color: '#22c55e', desc: "Toutes les conditions sont réunies. Lance-toi." },
  go_reserves: { label: 'Prometteur', color: '#4d96ff', desc: 'Bonne base. Quelques points à adresser avant de coder.' },
  pivot:       { label: 'À revoir', color: '#ff6b6b', desc: 'Score faible. Reconsidère ou pivote sur les axes faibles.' },
}

const CRITERIA_LABELS: Record<string, string> = {
  marche: 'Taille de marché',
  concurrence: 'Concurrence',
  faisabilite: 'Faisabilité 72h',
  monetisation: 'Monétisation',
  timing: 'Timing IA',
}

const CRITERIA_COLORS: Record<string, string> = {
  marche: '#4d96ff',
  concurrence: '#cc5de8',
  faisabilite: '#22c55e',
  monetisation: '#eab308',
  timing: '#ff6b6b',
}

const MONETISATION_OPTIONS = [
  'Abonnement mensuel (SaaS)',
  'Paiement unique (one-shot)',
  'Freemium + upgrade payant',
  'Usage-based (à la consommation)',
]

interface Props {
  navigate: (hash: string) => void
}

type Step = 'form' | 'loading' | 'results'

export function GeneratorValidate({ navigate: _navigate }: Props) {
  const [step, setStep] = useState<Step>('form')
  const [nom, setNom] = useState('')
  const [description, setDescription] = useState('')
  const [cible, setCible] = useState('')
  const [monetisation, setMonetisation] = useState('')
  const [concurrents, setConcurrents] = useState('')
  const [probleme, setProbleme] = useState('')
  const [report, setReport] = useState<ValidationReport | null>(null)
  const [error, setError] = useState<string | null>(null)

  const isFormValid = description.trim() && cible.trim() && monetisation && probleme.trim()

  const analyze = async () => {
    setError(null)
    setStep('loading')

    const answers = [
      description.trim(),
      cible.trim(),
      monetisation,
      concurrents.trim() || 'Je ne connais pas de concurrents directs',
      probleme.trim(),
    ]

    const { data, error: fnError } = await supabase.functions.invoke('validate-idea', {
      body: { answers },
    })

    if (fnError || !data?.score) {
      const msg = data?.error === 'quota_exceeded'
        ? 'Tu as atteint ta limite de 3 analyses. Passe en Premium pour continuer.'
        : 'Erreur IA. Vérifie ta connexion et réessaie.'
      setError(msg)
      setStep('form')
      return
    }

    setReport(data as ValidationReport)
    setStep('results')
  }

  const reset = () => {
    setStep('form')
    setReport(null)
    setError(null)
    setNom('')
    setDescription('')
    setCible('')
    setMonetisation('')
    setConcurrents('')
    setProbleme('')
  }

  // ── Form ──────────────────────────────────────────────────────────────────
  if (step === 'form') {
    return (
      <div className="p-7 max-w-3xl">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1.5">
            <ShieldCheck size={16} strokeWidth={1.5} className="text-muted-foreground" />
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Plugin IA</p>
          </div>
          <h1 className="text-3xl font-extrabold text-foreground" style={{ letterSpacing: '-0.03em' }}>
            MarketPulse
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Décris ton idée. L'IA analyse le marché et retourne un score /100 avec recommandations.
          </p>
        </div>

        <div className="border border-border rounded-xl p-5 flex flex-col gap-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Ton idée</p>

          <div>
            <label className="text-[11px] font-semibold text-muted-foreground block mb-1.5">
              Nom de ton idée (optionnel)
            </label>
            <input
              value={nom}
              onChange={e => setNom(e.target.value)}
              placeholder="ex: FactureAI, RecrutBot..."
              className="w-full border border-border rounded-lg px-3 py-2.5 text-sm bg-background text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-foreground/20"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-muted-foreground block mb-1.5">
              Décris ton produit en une phrase *
            </label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="ex: Un outil qui génère des fiches de paie automatiquement pour les TPE"
              rows={2}
              className="w-full border border-border rounded-lg px-3 py-2.5 text-sm bg-background text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-foreground/20 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-muted-foreground block mb-1.5">
                Ta cible principale *
              </label>
              <input
                value={cible}
                onChange={e => setCible(e.target.value)}
                placeholder="ex: Freelances, PME, gérants..."
                className="w-full border border-border rounded-lg px-3 py-2.5 text-sm bg-background text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-foreground/20"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-muted-foreground block mb-1.5">
                Modèle de monétisation *
              </label>
              <select
                value={monetisation}
                onChange={e => setMonetisation(e.target.value)}
                className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
              >
                <option value="">Choisir...</option>
                {MONETISATION_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-muted-foreground block mb-1.5">
              Concurrents connus (optionnel)
            </label>
            <input
              value={concurrents}
              onChange={e => setConcurrents(e.target.value)}
              placeholder="ex: Pennylane, Indy... ou laisse vide si tu ne sais pas"
              className="w-full border border-border rounded-lg px-3 py-2.5 text-sm bg-background text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-foreground/20"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-muted-foreground block mb-1.5">
              Le problème principal résolu *
            </label>
            <textarea
              value={probleme}
              onChange={e => setProbleme(e.target.value)}
              placeholder="ex: Les TPE perdent 3h/semaine à faire leurs fiches de paie manuellement sur Excel"
              rows={3}
              className="w-full border border-border rounded-lg px-3 py-2.5 text-sm bg-background text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-foreground/20 resize-none"
            />
          </div>

          {error && (
            <p className="text-xs font-medium" style={{ color: '#ff6b6b' }}>{error}</p>
          )}

          <button
            onClick={analyze}
            disabled={!isFormValid}
            className="flex items-center gap-2 bg-foreground text-background rounded-xl px-5 py-3 text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed self-start"
          >
            <Sparkles size={14} strokeWidth={1.5} />
            Analyser avec l'IA
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
            <ShieldCheck size={16} strokeWidth={1.5} className="text-muted-foreground" />
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Plugin IA</p>
          </div>
          <h1 className="text-3xl font-extrabold text-foreground" style={{ letterSpacing: '-0.03em' }}>
            MarketPulse
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
          <p className="text-sm font-semibold text-foreground mb-1">Jarvis analyse ton marché...</p>
          <p className="text-xs text-muted-foreground">Évaluation des 5 critères en cours — 3 à 5 secondes</p>
        </div>
        <style>{`@keyframes bounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-8px)} }`}</style>
      </div>
    )
  }

  // ── Results ───────────────────────────────────────────────────────────────
  if (!report) return null
  const verdict = VERDICTS[report.verdict]

  return (
    <div className="p-7 max-w-3xl">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1.5">
          <ShieldCheck size={16} strokeWidth={1.5} className="text-muted-foreground" />
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Plugin IA</p>
        </div>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-extrabold text-foreground" style={{ letterSpacing: '-0.03em' }}>
            MarketPulse{nom ? ` — ${nom}` : ''}
          </h1>
          <button
            onClick={reset}
            className="flex items-center gap-1.5 text-[11px] text-muted-foreground hover:text-foreground transition-colors border border-border rounded-lg px-3 py-1.5"
          >
            <RefreshCw size={11} strokeWidth={1.5} />
            Recommencer
          </button>
        </div>
      </div>

      {/* Score + Verdict */}
      <div
        className="rounded-xl p-6 mb-5 border text-center"
        style={{ borderColor: `${verdict.color}30`, background: `${verdict.color}08` }}
      >
        <p
          className="text-6xl font-extrabold tabular-nums mb-1"
          style={{ letterSpacing: '-0.04em', color: verdict.color }}
        >
          {report.score}<span className="text-3xl opacity-40">/100</span>
        </p>
        <p className="text-base font-bold mb-1" style={{ color: verdict.color }}>{verdict.label}</p>
        <p className="text-xs text-muted-foreground">{verdict.desc}</p>
        {report.summary && (
          <p className="text-xs text-foreground/80 mt-3 max-w-lg mx-auto leading-relaxed border-t border-border/30 pt-3">
            {report.summary}
          </p>
        )}
      </div>

      {/* Criteria bars */}
      <div className="border border-border rounded-xl p-5 mb-5">
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-4">Analyse par critère</p>
        <div className="flex flex-col gap-3">
          {Object.entries(report.criteria).map(([key, val]) => {
            const color = CRITERIA_COLORS[key] ?? '#4d96ff'
            const pct = (val / 20) * 100
            return (
              <div key={key}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-foreground">{CRITERIA_LABELS[key] ?? key}</span>
                  <span className="text-xs font-bold tabular-nums" style={{ color }}>{val}/20</span>
                </div>
                <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                  <div
                    className="h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${pct}%`, background: color }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Forces / Faiblesses / Recommandations */}
      <div className="flex flex-col gap-3">
        {[
          { icon: TrendingUp, label: 'Forces', items: report.strengths, color: '#22c55e' },
          { icon: AlertTriangle, label: 'Faiblesses', items: report.weaknesses, color: '#ff6b6b' },
          { icon: Lightbulb, label: 'Recommandations', items: report.recommendations, color: '#4d96ff' },
        ].filter(s => s.items?.length > 0).map(({ icon: Icon, label, items, color }) => (
          <div key={label} className="border border-border rounded-xl p-4">
            <div className="flex items-center gap-1.5 mb-2">
              <Icon size={13} strokeWidth={1.5} style={{ color }} />
              <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color }}>{label}</p>
            </div>
            <ul className="flex flex-col gap-1.5">
              {items.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-foreground/80">
                  <span className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0" style={{ background: color }} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}
