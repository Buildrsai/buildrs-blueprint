// blueprint-app/src/components/dashboard/RevenueCalculatorPage.tsx
import { useState, useMemo } from 'react'
import { Euro, BarChart2, Zap } from 'lucide-react'

// ── Logarithmic scale: slider 0-100 → customers 1-10 000 ──────────────────
function sliderToCustomers(v: number): number {
  if (v === 0) return 1
  return Math.max(1, Math.round(Math.exp(Math.log(10000) * v / 100)))
}
function customersToSlider(c: number): number {
  if (c <= 1) return 0
  return Math.round(100 * Math.log(c) / Math.log(10000))
}

// ── Formatters ─────────────────────────────────────────────────────────────
function fmt(v: number): string {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M€`
  if (v >= 1_000) return `${(v / 1_000).toFixed(1)}k€`
  return `${Math.round(v)}€`
}

function fmtFull(v: number): string {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(v)
}

function fmtPct(future: number, base: number): string {
  if (base === 0) return '—'
  const pct = Math.round(((future - base) / base) * 100)
  return pct >= 0 ? `+${pct}%` : `${pct}%`
}

// ── Sub-components ──────────────────────────────────────────────────────────
function SliderField({
  label, value, display, min, max, step, minLabel, maxLabel, onChange,
}: {
  label: string
  value: number
  display: string
  min: number
  max: number
  step: number
  minLabel?: string
  maxLabel?: string
  onChange: (v: number) => void
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-foreground">{label}</label>
        <span className="text-base font-bold text-foreground" style={{ minWidth: 72, textAlign: 'right' }}>{display}</span>
      </div>
      <input
        type="range"
        min={min} max={max} step={step}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full"
        style={{ accentColor: '#7C3AED' }}
      />
      <div className="flex justify-between text-[10px] text-muted-foreground/50 font-mono">
        <span>{minLabel ?? String(min)}</span>
        <span>{maxLabel ?? String(max)}</span>
      </div>
    </div>
  )
}

function ResultCard({
  label, value, sub, accent = false,
}: {
  label: string
  value: string
  sub?: string
  accent?: boolean
}) {
  return (
    <div
      className="rounded-xl p-5 border"
      style={accent ? {
        borderColor: 'rgba(16,185,129,0.35)',
        borderLeftWidth: 3,
        borderLeftColor: '#10B981',
        background: 'rgba(16,185,129,0.04)',
      } : {
        borderColor: 'hsl(var(--border))',
        background: 'hsl(var(--card))',
      }}
    >
      <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/50 mb-1">{label}</p>
      <p
        className="text-2xl font-black font-mono"
        style={{ letterSpacing: '-0.04em', color: accent ? '#10B981' : undefined }}
      >
        {value}
      </p>
      {sub && (
        <p className="text-[11px] font-semibold mt-0.5" style={{ color: accent ? '#10B981' : 'hsl(var(--muted-foreground))' }}>
          {sub}
        </p>
      )}
    </div>
  )
}

function MiniBarChart({ projections, chartMax }: { projections: number[]; chartMax: number }) {
  return (
    <div>
      <div className="flex items-end gap-0.5" style={{ height: 88 }}>
        {projections.map((v, i) => {
          const heightPct = chartMax > 0 ? Math.max(2, (v / chartMax) * 100) : 2
          const isLast = i === projections.length - 1
          const isFirst = i === 0
          return (
            <div
              key={i}
              className="flex-1 rounded-t-sm transition-all duration-300"
              style={{
                height: `${heightPct}%`,
                background: isLast
                  ? '#7C3AED'
                  : isFirst
                  ? 'rgba(124,58,237,0.7)'
                  : 'rgba(124,58,237,0.3)',
              }}
            />
          )
        })}
      </div>
      <div className="flex gap-0.5 mt-2">
        {projections.map((_, i) => (
          <div key={i} className="flex-1 text-center">
            {(i % 3 === 0 || i === projections.length - 1) && (
              <span className="text-[8px] text-muted-foreground/40 font-mono block">M{i}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

const HOW_TO_STEPS = [
  {
    title: 'Fixe ton prix',
    desc: 'Définis le prix mensuel moyen que tu comptes facturer à chaque client.',
  },
  {
    title: 'Entre tes clients',
    desc: 'Indique ton nombre actuel de clients payants, ou ton objectif de départ.',
  },
  {
    title: 'Ajuste le churn',
    desc: 'Estime le pourcentage de clients qui annulent chaque mois. 5% est une moyenne SaaS.',
  },
  {
    title: 'Projette ta croissance',
    desc: 'Vois ton MRR à 6 et 12 mois avec ta croissance et ton churn intégrés.',
  },
]

// ── Main component ──────────────────────────────────────────────────────────
interface Props {
  userId?: string
  navigate: (hash: string) => void
}

export function RevenueCalculatorPage({ navigate }: Props) {
  const [price, setPrice] = useState(29)
  const [customersSlider, setCustomersSlider] = useState(customersToSlider(50))
  const [churn, setChurn] = useState(5)
  const [growth, setGrowth] = useState(10)

  const customers = sliderToCustomers(customersSlider)

  const { mrr, arr, projections, mrr6, mrr12, chartMax } = useMemo(() => {
    const mrr = price * customers
    const arr = mrr * 12
    const projections: number[] = [mrr]
    for (let i = 1; i <= 12; i++) {
      const prev = projections[i - 1]
      const gained = prev * (growth / 100)
      const lost = prev * (churn / 100)
      projections.push(Math.max(0, prev + gained - lost))
    }
    const chartMax = Math.max(...projections) * 1.1
    return { mrr, arr, projections, mrr6: projections[6], mrr12: projections[12], chartMax }
  }, [price, customers, churn, growth])

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div
        className="rounded-2xl border border-border p-8 text-center space-y-3"
        style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.06) 0%, rgba(16,185,129,0.04) 100%)' }}
      >

        <h1
          className="text-3xl font-black tracking-tight text-foreground"
          style={{ letterSpacing: '-0.04em' }}
        >
          Calculateur de Revenus SaaS{' '}
          <span style={{ color: '#7C3AED' }}>(MRR/ARR)</span>
        </h1>
        <p className="text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed">
          Calcule tes revenus récurrents mensuels et annuels,
          et projette ta croissance avec le churn intégré.
        </p>
      </div>

      {/* ── Main 2-col layout ──────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

        {/* Sliders */}
        <div className="border border-border rounded-2xl p-6 space-y-7 bg-card">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">
            Tes Métriques
          </p>

          <SliderField
            label="Prix moyen par client"
            value={price}
            display={`${price}€/mo`}
            min={5} max={500} step={1}
            minLabel="5€" maxLabel="500€"
            onChange={setPrice}
          />

          {/* Customers — logarithmic scale */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">Nombre de clients</label>
              <span className="text-base font-bold text-foreground" style={{ minWidth: 72, textAlign: 'right' }}>
                {customers.toLocaleString('fr-FR')}
              </span>
            </div>
            <input
              type="range" min={0} max={100} step={1}
              value={customersSlider}
              onChange={e => setCustomersSlider(Number(e.target.value))}
              className="w-full"
              style={{ accentColor: '#7C3AED' }}
            />
            <div className="flex justify-between text-[10px] text-muted-foreground/50 font-mono">
              <span>1</span><span>10 000</span>
            </div>
          </div>

          <SliderField
            label="Taux de churn mensuel"
            value={churn}
            display={`${churn}%`}
            min={0} max={20} step={0.5}
            minLabel="0%" maxLabel="20%"
            onChange={setChurn}
          />

          <SliderField
            label="Croissance mensuelle"
            value={growth}
            display={`${growth}%`}
            min={0} max={30} step={1}
            minLabel="0%" maxLabel="30%"
            onChange={setGrowth}
          />
        </div>

        {/* Results */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <ResultCard label="MRR ACTUEL" value={fmt(mrr)} sub={fmtFull(mrr)} />
            <ResultCard label="ARR ACTUEL" value={fmt(arr)} sub={fmtFull(arr)} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <ResultCard
              label="MRR À 6 MOIS"
              value={fmt(mrr6)}
              sub={fmtPct(mrr6, mrr)}
              accent
            />
            <ResultCard
              label="MRR À 12 MOIS"
              value={fmt(mrr12)}
              sub={fmtPct(mrr12, mrr)}
              accent
            />
          </div>

          <div className="border border-border rounded-2xl p-5 bg-card">
            <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/50 mb-4">
              Projection 12 mois
            </p>
            <MiniBarChart projections={projections} chartMax={chartMax} />
          </div>
        </div>
      </div>

      {/* ── How to use ─────────────────────────────────────────────────── */}
      <div className="space-y-5">
        <h2 className="text-base font-bold text-foreground">
          Comment utiliser ce calculateur
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {HOW_TO_STEPS.map((step, i) => (
            <div
              key={i}
              className="rounded-xl p-5 border space-y-3"
              style={{
                background: 'rgba(124,58,237,0.03)',
                borderColor: 'rgba(124,58,237,0.15)',
              }}
            >
              <div
                className="w-6 h-6 rounded-md flex items-center justify-center text-[11px] font-bold text-white shrink-0"
                style={{ background: '#7C3AED' }}
              >
                {i + 1}
              </div>
              <p className="text-sm font-bold text-foreground leading-tight">{step.title}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── CTA ────────────────────────────────────────────────────────── */}
      <div
        className="rounded-2xl border border-border p-8 text-center space-y-4"
        style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.06) 0%, rgba(16,185,129,0.04) 100%)' }}
      >
        <p className="text-lg font-bold text-foreground" style={{ letterSpacing: '-0.02em' }}>
          Tu sais combien tu peux gagner.
        </p>
        <p className="text-sm text-muted-foreground">Maintenant trouve quoi construire.</p>
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <button
            onClick={() => navigate('#/dashboard/marketplace')}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm bg-foreground text-background hover:opacity-90 transition-opacity"
          >
            <BarChart2 size={16} strokeWidth={1.5} />
            Voir la Marketplace
          </button>
          <button
            onClick={() => navigate('#/dashboard/claude-os/generer')}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm border border-border hover:bg-secondary transition-colors"
          >
            <Zap size={16} strokeWidth={1.5} />
            Générer mon idée
          </button>
        </div>
      </div>

    </div>
  )
}
