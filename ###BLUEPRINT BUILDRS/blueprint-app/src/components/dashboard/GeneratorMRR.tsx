import { useState, useMemo } from 'react'
import { TrendingUp, DollarSign, Check } from 'lucide-react'
import { supabase } from '../../lib/supabase'

function fmt(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M€`
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k€`
  return `${Math.round(n)}€`
}

function fmtFull(n: number): string {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n)
}

interface Props {
  navigate: (hash: string) => void
}

export function GeneratorMRR({ navigate: _navigate }: Props) {
  const [price, setPrice] = useState(29)
  const [users, setUsers] = useState(10)
  const [growth, setGrowth] = useState(15)
  const [churn, setChurn] = useState(5)
  const [saved, setSaved] = useState(false)

  const projection = useMemo(() => {
    const months: { month: number; users: number; mrr: number }[] = []
    let currentUsers = users
    for (let m = 1; m <= 12; m++) {
      const newUsers = Math.round(currentUsers * (growth / 100))
      const lostUsers = Math.round(currentUsers * (churn / 100))
      currentUsers = Math.max(0, currentUsers + newUsers - lostUsers)
      months.push({ month: m, users: currentUsers, mrr: currentUsers * price })
    }
    return months
  }, [price, users, growth, churn])

  const currentMRR = users * price
  const mrr12 = projection[11]?.mrr ?? 0
  const arr = mrr12 * 12
  const maxMRR = Math.max(...projection.map(p => p.mrr), 1)

  // Valorisation
  const flippaLow = mrr12 * 30
  const flippaStd = mrr12 * 40
  const acquirePremium = mrr12 * 55

  const MONTH_LABELS = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc']

  return (
    <div className="p-7 max-w-3xl">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1.5">
          <TrendingUp size={16} strokeWidth={1.5} className="text-muted-foreground" />
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Générateur</p>
        </div>
        <h1 className="text-3xl font-extrabold text-foreground" style={{ letterSpacing: '-0.03em' }}>
          Calculateur MRR & Revente
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Projette tes revenus sur 12 mois et calcule la valorisation de ton SaaS.
        </p>
      </div>

      {/* Inputs */}
      <div className="border border-border rounded-xl p-5 mb-6">
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-4">Paramètres</p>
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: 'Prix mensuel (€)', value: price, set: setPrice, min: 1, max: 999, unit: '€/mois' },
            { label: 'Utilisateurs actuels', value: users, set: setUsers, min: 1, max: 9999, unit: 'users' },
            { label: 'Croissance mensuelle (%)', value: growth, set: setGrowth, min: 0, max: 200, unit: '%/mois' },
            { label: 'Churn mensuel (%)', value: churn, set: setChurn, min: 0, max: 100, unit: '%/mois' },
          ].map(field => (
            <div key={field.label}>
              <label className="text-[11px] font-semibold text-muted-foreground block mb-1.5">
                {field.label}
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={field.value}
                  min={field.min}
                  max={field.max}
                  onChange={e => field.set(Math.max(field.min, Math.min(field.max, Number(e.target.value))))}
                  className="w-full border border-border rounded-lg px-3 py-2.5 text-sm font-semibold bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 pr-14"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground font-medium">
                  {field.unit}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: 'MRR actuel', value: fmt(currentMRR), color: '#4d96ff' },
          { label: 'MRR mois 12', value: fmt(mrr12), color: '#22c55e' },
          { label: 'ARR mois 12', value: fmt(arr), color: '#cc5de8' },
        ].map(kpi => (
          <div key={kpi.label} className="border border-border rounded-xl p-4 text-center">
            <p
              className="text-2xl font-extrabold tabular-nums mb-0.5"
              style={{ letterSpacing: '-0.03em', color: kpi.color }}
            >
              {kpi.value}
            </p>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">{kpi.label}</p>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="border border-border rounded-xl p-5 mb-6">
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-4">Projection MRR — 12 mois</p>
        <div className="flex items-end gap-1.5 h-32">
          {projection.map((p, i) => {
            const h = Math.max(4, (p.mrr / maxMRR) * 100)
            const isLast = i === 11
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                <div className="relative w-full flex items-end justify-center" style={{ height: 112 }}>
                  {/* Tooltip */}
                  <div className="absolute bottom-full mb-1 bg-foreground text-background text-[10px] font-semibold px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                    {fmtFull(p.mrr)}
                  </div>
                  <div
                    className="w-full rounded-t-sm transition-all duration-300"
                    style={{
                      height: `${h}%`,
                      background: isLast ? '#22c55e' : 'hsl(var(--foreground) / 0.15)',
                    }}
                  />
                </div>
                <span className="text-[9px] text-muted-foreground">{MONTH_LABELS[i]}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Valorisation */}
      <div className="border border-border rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <DollarSign size={14} strokeWidth={1.5} className="text-muted-foreground" />
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Valorisation à la revente (mois 12)</p>
        </div>
        <div className="flex flex-col gap-3">
          {[
            { platform: 'Flippa', range: 'Multiple 30×', value: flippaLow, note: 'Vente rapide, acheteurs nombreux', color: '#4d96ff' },
            { platform: 'Flippa / Acquire', range: 'Multiple 40×', value: flippaStd, note: 'Valorisation standard du marché', color: '#cc5de8' },
            { platform: 'Acquire.com', range: 'Multiple 55×', value: acquirePremium, note: 'Acheteurs premium, processus long', color: '#22c55e' },
          ].map(v => (
            <div key={v.platform} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-foreground">{v.platform}</p>
                <p className="text-[11px] text-muted-foreground">{v.range} · {v.note}</p>
              </div>
              <div className="text-right">
                <p className="text-base font-extrabold tabular-nums" style={{ letterSpacing: '-0.02em', color: v.color }}>
                  {fmt(v.value)}
                </p>
              </div>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-muted-foreground mt-4 pt-3 border-t border-border">
          * Basé sur le MRR projeté au mois 12. Les multiples varient selon la croissance, le churn, et la qualité du code.
        </p>
      </div>

      {/* Save to Autopilot */}
      <button
        onClick={async () => {
          await supabase.auth.updateUser({ data: { buildrs_mrr_estimate: fmt(mrr12) } })
          setSaved(true)
        }}
        className="mt-4 flex items-center gap-2 border border-border rounded-xl px-5 py-3 text-[13px] font-semibold text-foreground hover:bg-secondary transition-colors"
      >
        {saved ? <Check size={14} strokeWidth={2} style={{ color: '#22c55e' }} /> : <TrendingUp size={14} strokeWidth={1.5} />}
        {saved ? 'MRR sauvegardé dans Autopilot' : 'Sauvegarder cette estimation dans Autopilot →'}
      </button>
    </div>
  )
}
