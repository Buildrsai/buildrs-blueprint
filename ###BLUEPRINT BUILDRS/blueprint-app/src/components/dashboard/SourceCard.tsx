// blueprint-app/src/components/dashboard/SourceCard.tsx
import { Bookmark, BookmarkCheck, TrendingUp, Zap, DollarSign } from 'lucide-react'
import { SaasLogo } from '../ui/SaasLogo'
import type { SaasSource } from '../../hooks/useSources'

function scoreColor(score: number): string {
  if (score >= 70) return '#22c55e'
  if (score >= 40) return '#eab308'
  return '#ef4444'
}

function ScoreMiniBar({ label, value, explanation, Icon }: {
  label: string
  value: number
  explanation?: string | null
  Icon: typeof TrendingUp
}) {
  return (
    <div className="space-y-0.5">
      <div className="flex items-center gap-2">
        <Icon size={11} className="shrink-0" style={{ color: scoreColor(value) }} strokeWidth={1.5} />
        <span className="text-[10px] text-muted-foreground w-16 shrink-0">{label}</span>
        <div className="flex-1 h-1 rounded-full bg-border overflow-hidden">
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${value}%`, background: scoreColor(value) }}
          />
        </div>
        <span className="text-[10px] font-mono text-muted-foreground w-6 text-right">{value}</span>
      </div>
      {explanation && (
        <p className="text-[10px] text-muted-foreground/50 leading-tight pl-[72px] line-clamp-1">{explanation}</p>
      )}
    </div>
  )
}

function formatRevenue(mrr: number | null, arr: number | null): string | null {
  if (mrr) return `MRR $${mrr >= 1000 ? `${(mrr / 1000).toFixed(0)}k` : mrr}`
  if (arr) return `ARR $${arr >= 1000000 ? `${(arr / 1000000).toFixed(0)}M` : arr >= 1000 ? `${(arr / 1000).toFixed(0)}k` : arr}`
  return null
}

interface SourceCardProps {
  source: SaasSource
  saved: boolean
  onSave: () => void
  onOpen: () => void
}

export function SourceCard({ source, saved, onSave, onOpen }: SourceCardProps) {
  const opp = source.opportunity
  const revenue = formatRevenue(source.mrr_reported, source.arr_reported)

  return (
    <div
      className="border border-border rounded-xl p-5 flex flex-col gap-3 cursor-pointer hover:border-foreground/20 transition-colors bg-card"
      onClick={onOpen}
    >
      {/* SaaS header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <SaasLogo logoUrl={source.logo_url} name={source.name} size="md" />
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-bold text-foreground text-sm leading-tight">{source.name}</p>
              {source.is_featured && (
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-foreground text-background uppercase tracking-wide">
                  Featured
                </span>
              )}
            </div>
            {source.tagline && (
              <p className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">{source.tagline}</p>
            )}
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className="text-[9px] font-medium uppercase tracking-widest text-muted-foreground/50">
                {source.category}
              </span>
              {revenue && (
                <span className="text-[9px] font-mono font-semibold text-foreground/70">{revenue}</span>
              )}
            </div>
          </div>
        </div>
        <button
          className="text-muted-foreground hover:text-foreground transition-colors shrink-0 mt-0.5"
          onClick={e => { e.stopPropagation(); onSave() }}
        >
          {saved
            ? <BookmarkCheck size={16} strokeWidth={1.5} className="text-foreground" />
            : <Bookmark size={16} strokeWidth={1.5} />
          }
        </button>
      </div>

      {/* Screenshot (optional) */}
      {source.screenshot_url && (
        <img
          src={source.screenshot_url}
          alt={`${source.name} screenshot`}
          className="rounded-lg aspect-video object-cover w-full border border-border"
        />
      )}

      {/* Divider */}
      <div className="border-t border-border" />

      {/* Buildrs Opportunity */}
      {opp ? (
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/50">
              Opportunite Buildrs
            </span>
            <span
              className="text-xl font-black font-mono"
              style={{ color: scoreColor(opp.build_score), letterSpacing: '-0.03em' }}
            >
              {opp.build_score}
            </span>
          </div>
          <p className="text-[12px] font-semibold text-foreground leading-snug" style={{ letterSpacing: '-0.01em' }}>
            {opp.opportunity_title}
          </p>
          <div className="space-y-1.5">
            <ScoreMiniBar label="Traction" value={opp.traction_score} explanation={opp.traction_explanation} Icon={TrendingUp} />
            <ScoreMiniBar label="Cloneabilite" value={opp.cloneability_score} explanation={opp.cloneability_explanation} Icon={Zap} />
            <ScoreMiniBar label="Monetisation" value={opp.monetization_score} explanation={opp.monetization_explanation} Icon={DollarSign} />
          </div>
        </div>
      ) : (
        <div className="text-[11px] text-muted-foreground/40 italic">
          Analyse en cours...
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between gap-2 pt-1">
        <button
          className="text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors"
          onClick={e => { e.stopPropagation(); onOpen() }}
        >
          Voir detail →
        </button>
        {opp?.target_niche && (
          <span className="text-[9px] font-medium px-2 py-0.5 rounded-full bg-secondary border border-border text-muted-foreground truncate max-w-[140px]">
            {opp.target_niche}
          </span>
        )}
      </div>
    </div>
  )
}
