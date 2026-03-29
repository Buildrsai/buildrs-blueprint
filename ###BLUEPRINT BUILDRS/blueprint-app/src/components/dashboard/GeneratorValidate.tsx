import { useState } from 'react'
import { ShieldCheck, ChevronUp, ChevronDown, Check } from 'lucide-react'
import { supabase } from '../../lib/supabase'

interface Criterion {
  key: string
  label: string
  question: string
  hint: string
  color: string
}

const CRITERIA: Criterion[] = [
  {
    key: 'market',
    label: 'Taille de marché',
    question: 'Est-ce que beaucoup de gens ont ce problème ?',
    hint: '1 = niche très étroite · 10 = millions de personnes concernées',
    color: '#4d96ff',
  },
  {
    key: 'competition',
    label: 'Concurrence',
    question: 'Y a-t-il peu de concurrents directs ?',
    hint: '1 = marché saturé · 10 = peu ou pas de concurrents sérieux',
    color: '#cc5de8',
  },
  {
    key: 'buildability',
    label: 'Buildabilité en 72h',
    question: 'Peut-on sortir un MVP fonctionnel en 72h ?',
    hint: '1 = projet très complexe · 10 = faisable ce week-end avec Lovable',
    color: '#22c55e',
  },
  {
    key: 'monetisation',
    label: 'Monétisation',
    question: 'Les gens paient-ils déjà pour ce type de solution ?',
    hint: '1 = personne ne paie · 10 = marché prouvé, willingness to pay forte',
    color: '#eab308',
  },
  {
    key: 'timing',
    label: 'Timing',
    question: "Est-ce que l'IA rend ce produit particulièrement pertinent maintenant ?",
    hint: "1 = pas lié à l'IA · 10 = impossible sans IA, parfaitement dans l'air du temps",
    color: '#ff6b6b',
  },
]

function getVerdict(score: number): { label: string; desc: string; color: string } {
  if (score >= 80) return { label: 'Très prometteur', desc: "Lance-toi. Ce projet a toutes les caractéristiques d'un winner.", color: '#22c55e' }
  if (score >= 65) return { label: 'Prometteur', desc: 'Bonne base. Quelques points à valider avant de coder.', color: '#4d96ff' }
  if (score >= 50) return { label: 'À affiner', desc: 'Potentiel réel mais des risques à adresser. Creuse les points faibles.', color: '#eab308' }
  return { label: 'Risqué', desc: "Score faible. Reconsidère l'idée ou pivote sur les axes faibles.", color: '#ff6b6b' }
}

interface Props {
  navigate: (hash: string) => void
}

export function GeneratorValidate({ navigate: _navigate }: Props) {
  const [scores, setScores] = useState<Record<string, number>>({
    market: 5, competition: 5, buildability: 5, monetisation: 5, timing: 5,
  })
  const [name, setName] = useState('')
  const [saved, setSaved] = useState(false)

  const total = Math.round(Object.values(scores).reduce((a, b) => a + b, 0) * 2)
  const verdict = getVerdict(total)

  const adjust = (key: string, delta: number) => {
    setScores(prev => ({ ...prev, [key]: Math.max(1, Math.min(10, prev[key] + delta)) }))
    setSaved(false)
  }

  const handleSave = async () => {
    await supabase.auth.updateUser({ data: { buildrs_validator_score: total } })
    setSaved(true)
  }

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
          Score ton idée sur 5 critères. Résultat instantané.
        </p>
      </div>

      {/* Idea name */}
      <div className="mb-6">
        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-1.5">
          Nom de ton idée (optionnel)
        </label>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="ex: FactureAI, RecrutBot..."
          className="w-full border border-border rounded-lg px-3 py-2.5 text-sm bg-background text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-foreground/20"
        />
      </div>

      {/* Score display */}
      <div
        className="rounded-xl p-5 mb-6 text-center border"
        style={{ borderColor: `${verdict.color}30`, background: `${verdict.color}08` }}
      >
        <p
          className="text-5xl font-extrabold tabular-nums mb-1"
          style={{ letterSpacing: '-0.04em', color: verdict.color }}
        >
          {total}<span className="text-2xl opacity-40">/100</span>
        </p>
        <p className="text-sm font-bold" style={{ color: verdict.color }}>{verdict.label}</p>
        <p className="text-xs text-muted-foreground mt-1">{verdict.desc}</p>
      </div>

      {/* Criteria */}
      <div className="flex flex-col gap-3 mb-6">
        {CRITERIA.map(c => {
          const val = scores[c.key]
          const pct = (val / 10) * 100
          return (
            <div key={c.key} className="border border-border rounded-xl px-5 py-4">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-foreground mb-0.5">{c.label}</p>
                  <p className="text-xs text-muted-foreground">{c.question}</p>
                  <p className="text-[10px] text-muted-foreground/60 mt-0.5 italic">{c.hint}</p>
                </div>
                {/* Score stepper */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => adjust(c.key, -1)}
                    disabled={val <= 1}
                    className="w-7 h-7 rounded-lg border border-border flex items-center justify-center hover:bg-secondary transition-colors disabled:opacity-30"
                  >
                    <ChevronDown size={13} strokeWidth={1.5} />
                  </button>
                  <span
                    className="text-lg font-extrabold tabular-nums w-6 text-center"
                    style={{ color: c.color, letterSpacing: '-0.02em' }}
                  >
                    {val}
                  </span>
                  <button
                    onClick={() => adjust(c.key, 1)}
                    disabled={val >= 10}
                    className="w-7 h-7 rounded-lg border border-border flex items-center justify-center hover:bg-secondary transition-colors disabled:opacity-30"
                  >
                    <ChevronUp size={13} strokeWidth={1.5} />
                  </button>
                </div>
              </div>
              {/* Progress bar */}
              <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                <div
                  className="h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${pct}%`, background: c.color }}
                />
              </div>
            </div>
          )
        })}
      </div>

      {/* Breakdown */}
      <div className="border border-border rounded-xl p-5">
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">Analyse détaillée</p>
        <div className="flex flex-col gap-2">
          {CRITERIA.map(c => {
            const val = scores[c.key]
            const pts = val * 2
            const status = val >= 8 ? 'Fort' : val >= 5 ? 'Moyen' : 'Faible'
            const statusColor = val >= 8 ? '#22c55e' : val >= 5 ? '#eab308' : '#ff6b6b'
            return (
              <div key={c.key} className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{c.label}</span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full" style={{ color: statusColor, background: `${statusColor}18` }}>
                    {status}
                  </span>
                  <span className="font-bold text-foreground tabular-nums w-8 text-right">{pts}/20</span>
                </div>
              </div>
            )
          })}
          <div className="border-t border-border mt-1 pt-2 flex items-center justify-between text-xs font-bold">
            <span className="text-foreground">Score total</span>
            <span className="text-foreground tabular-nums" style={{ color: verdict.color }}>{total}/100</span>
          </div>
        </div>
      </div>

      {/* Save to Autopilot */}
      <button
        onClick={handleSave}
        className="mt-4 flex items-center gap-2 border border-border rounded-xl px-5 py-3 text-[13px] font-semibold text-foreground hover:bg-secondary transition-colors"
      >
        {saved ? <Check size={14} strokeWidth={2} style={{ color: '#22c55e' }} /> : <ShieldCheck size={14} strokeWidth={1.5} />}
        {saved ? 'Score sauvegardé dans Jarvis' : 'Sauvegarder ce score dans Jarvis →'}
      </button>
    </div>
  )
}
