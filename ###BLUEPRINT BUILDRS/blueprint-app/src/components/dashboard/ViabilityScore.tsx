import { TrendingUp, AlertTriangle, Users, ArrowRight } from 'lucide-react'
import type { ViabilityReport } from '../../hooks/useScoring'

const VERDICT_CONFIG = {
  GO:    { label: 'GO',    color: '#22c55e', bg: 'rgba(34,197,94,0.08)',   border: 'rgba(34,197,94,0.25)' },
  PIVOT: { label: 'PIVOT', color: '#eab308', bg: 'rgba(234,179,8,0.08)',   border: 'rgba(234,179,8,0.25)' },
  STOP:  { label: 'STOP',  color: '#ef4444', bg: 'rgba(239,68,68,0.08)',   border: 'rgba(239,68,68,0.25)' },
}

function ScoreRing({ score }: { score: number }) {
  const radius   = 36
  const circ     = 2 * Math.PI * radius
  const dash     = (score / 100) * circ
  const color    = score >= 70 ? '#22c55e' : score >= 45 ? '#eab308' : '#ef4444'

  return (
    <div className="relative flex items-center justify-center" style={{ width: 96, height: 96 }}>
      <svg width="96" height="96" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="48" cy="48" r={radius} fill="none" stroke="hsl(var(--border))" strokeWidth="6" />
        <circle
          cx="48" cy="48" r={radius} fill="none"
          stroke={color} strokeWidth="6"
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 0.8s ease' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-extrabold text-foreground tabular-nums leading-none" style={{ color }}>
          {score}
        </span>
        <span className="text-[9px] text-muted-foreground font-semibold">/100</span>
      </div>
    </div>
  )
}

interface Props {
  report: ViabilityReport
}

export function ViabilityScore({ report }: Props) {
  const verdict = VERDICT_CONFIG[report.verdict] ?? VERDICT_CONFIG.PIVOT

  return (
    <div className="flex flex-col gap-5">

      {/* Header — score ring + verdict + summary */}
      <div
        className="rounded-xl border p-5 flex flex-col sm:flex-row items-center gap-5"
        style={{ background: verdict.bg, borderColor: verdict.border }}
      >
        <ScoreRing score={report.score} />
        <div className="flex-1 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
            <span
              className="text-[10px] font-black px-2.5 py-1 rounded-full tracking-widest"
              style={{ background: verdict.color, color: '#fff' }}
            >
              {verdict.label}
            </span>
          </div>
          <p className="text-sm text-foreground leading-relaxed mt-2">{report.summary}</p>
        </div>
      </div>

      {/* Criteria bars */}
      {report.criteria?.length > 0 && (
        <div className="border border-border rounded-xl p-4 flex flex-col gap-3">
          <p className="text-[9.5px] font-bold uppercase tracking-[0.08em] text-muted-foreground/70 mb-1">
            Analyse par critère
          </p>
          {report.criteria.map(c => {
            const pct = (c.score / 20) * 100
            const barColor = c.score >= 15 ? '#22c55e' : c.score >= 10 ? '#eab308' : '#ef4444'
            return (
              <div key={c.label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-semibold text-foreground">{c.label}</span>
                  <span className="text-[11px] font-bold tabular-nums" style={{ color: barColor }}>
                    {c.score}/20
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-border overflow-hidden mb-1">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${pct}%`, background: barColor }}
                  />
                </div>
                {c.comment && (
                  <p className="text-[10px] text-muted-foreground leading-snug">{c.comment}</p>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Strengths + Warnings */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

        {report.strengths?.length > 0 && (
          <div className="border border-border rounded-xl p-4">
            <div className="flex items-center gap-1.5 mb-2.5">
              <TrendingUp size={12} strokeWidth={1.5} style={{ color: '#22c55e' }} />
              <p className="text-[9.5px] font-bold uppercase tracking-[0.08em] text-muted-foreground/70">
                Points forts
              </p>
            </div>
            <ul className="flex flex-col gap-1.5">
              {report.strengths.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-[11px] text-foreground leading-relaxed">
                  <span className="mt-0.5 w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center text-[9px] font-bold" style={{ background: 'rgba(34,197,94,0.15)', color: '#22c55e' }}>
                    +
                  </span>
                  {s}
                </li>
              ))}
            </ul>
          </div>
        )}

        {report.warnings?.length > 0 && (
          <div className="border border-border rounded-xl p-4">
            <div className="flex items-center gap-1.5 mb-2.5">
              <AlertTriangle size={12} strokeWidth={1.5} style={{ color: '#eab308' }} />
              <p className="text-[9.5px] font-bold uppercase tracking-[0.08em] text-muted-foreground/70">
                Points de vigilance
              </p>
            </div>
            <ul className="flex flex-col gap-1.5">
              {report.warnings.map((w, i) => (
                <li key={i} className="flex items-start gap-2 text-[11px] text-foreground leading-relaxed">
                  <span className="mt-0.5 w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center text-[9px] font-bold" style={{ background: 'rgba(234,179,8,0.15)', color: '#eab308' }}>
                    !
                  </span>
                  {w}
                </li>
              ))}
            </ul>
          </div>
        )}

      </div>

      {/* Competitors */}
      {report.competitors?.length > 0 && (
        <div className="border border-border rounded-xl p-4">
          <div className="flex items-center gap-1.5 mb-3">
            <Users size={12} strokeWidth={1.5} className="text-muted-foreground" />
            <p className="text-[9.5px] font-bold uppercase tracking-[0.08em] text-muted-foreground/70">
              Concurrents identifiés
            </p>
          </div>
          <div className="flex flex-col gap-2.5">
            {report.competitors.map((c, i) => (
              <div key={i} className="flex items-start gap-3">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-[10px] font-bold"
                  style={{ background: 'hsl(var(--secondary))', color: 'hsl(var(--muted-foreground))' }}
                >
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-bold text-foreground">{c.name}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5 leading-snug">{c.differentiator}</p>
                  {c.url && (
                    <p className="text-[9px] text-muted-foreground/50 mt-0.5 truncate">{c.url}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MRR estimate */}
      {report.mrr_estimate && (
        <div
          className="rounded-xl border p-4 flex items-center gap-4"
          style={{ borderColor: 'rgba(77,150,255,0.2)', background: 'rgba(77,150,255,0.04)' }}
        >
          <div>
            <p className="text-[9.5px] font-bold uppercase tracking-[0.08em] text-muted-foreground/70 mb-1">
              MRR estimé à 6 mois
            </p>
            <p className="text-xl font-extrabold tabular-nums tracking-tight" style={{ color: '#4d96ff' }}>
              {report.mrr_estimate.low}–{report.mrr_estimate.high} {report.mrr_estimate.currency}
            </p>
          </div>
        </div>
      )}

      {/* Next step */}
      {report.next_step && (
        <div className="flex items-start gap-3 border border-border rounded-xl p-4">
          <div className="w-7 h-7 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0 mt-0.5">
            <ArrowRight size={12} strokeWidth={2} className="text-foreground" />
          </div>
          <div>
            <p className="text-[9.5px] font-bold uppercase tracking-[0.08em] text-muted-foreground/70 mb-1">
              Prochaine action
            </p>
            <p className="text-[12px] font-semibold text-foreground leading-snug">{report.next_step}</p>
          </div>
        </div>
      )}

    </div>
  )
}
