import { ExternalLink } from 'lucide-react'
import { Card } from '@/components/ui/card'
import type { ValidationResult } from '@/types/finder'

const SCORE_LABELS: Record<string, string> = {
  market_score: 'Marché',
  competition_score: 'Concurrence',
  monetization_score: 'Monétisation',
  buildability_score: 'Faisabilité',
}

const VERDICT_STYLES = {
  'GO': { bar: 'bg-[#22C55E]', badge: 'bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20' },
  'À AFFINER': { bar: 'bg-[#F59E0B]', badge: 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20' },
  'PIVOT': { bar: 'bg-[#EF4444]', badge: 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20' },
}

const SUB_SCORES = ['market_score', 'competition_score', 'monetization_score', 'buildability_score'] as const

interface ValidationResultDisplayProps {
  result: ValidationResult
  blurred?: boolean
}

function ValidationResultDisplay({ result, blurred = false }: ValidationResultDisplayProps) {
  const style = VERDICT_STYLES[result.verdict]

  return (
    <div className="flex flex-col gap-4">
      {/* Score global — blurré pour anonymes */}
      <Card variant="white" padding="lg" className={blurred ? 'blur-sm select-none pointer-events-none' : ''}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs text-[#B2BBC5] uppercase tracking-wide mb-1">{result.title}</p>
            <p className="text-4xl font-semibold text-[#121317] tabular-nums" style={{ letterSpacing: '-0.03em' }}>
              {result.total_score}
              <span className="text-xl text-[#B2BBC5]">/100</span>
            </p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium border ${style.badge}`}>
            {result.verdict}
          </span>
        </div>
        {/* Sous-scores */}
        <div className="flex flex-col gap-3">
          {SUB_SCORES.map((key) => (
            <div key={key} className="flex items-center gap-3">
              <span className="text-xs text-[#45474D] w-28 flex-shrink-0">{SCORE_LABELS[key]}</span>
              <div className="flex-1 h-1.5 bg-[#E6EAF0] rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${style.bar} transition-all duration-500`}
                  style={{ width: `${result[key]}%` }}
                />
              </div>
              <span className="text-xs font-medium text-[#121317] tabular-nums w-8 text-right">{result[key]}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Recommandations */}
      <Card variant="white" padding="lg">
        <p className="text-xs text-[#B2BBC5] uppercase tracking-wide mb-3">Recommandations</p>
        <ul className="flex flex-col gap-2">
          {result.recommendations.map((r, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-[#45474D]">
              <span className="text-[#3279F9] font-medium text-xs mt-0.5 flex-shrink-0">{i + 1}.</span>
              {r}
            </li>
          ))}
        </ul>
      </Card>

      {/* Sources */}
      {result.sources.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {result.sources.map((s) => (
            <a
              key={s.url}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-[#B2BBC5] hover:text-[#3279F9] transition-colors"
            >
              <ExternalLink size={10} />
              {s.name}
            </a>
          ))}
        </div>
      )}
    </div>
  )
}

export { ValidationResultDisplay }
