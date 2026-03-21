import { TrendingUp, Users, Zap, Clock, ExternalLink } from 'lucide-react'
import { Card } from '@/components/ui/card'
import type { FinderResult } from '@/types/finder'

const VERDICT_STYLES = {
  'GO': 'bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20',
  'À AFFINER': 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20',
  'PIVOT': 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20',
}

interface FinderResultCardProps {
  result: FinderResult
  index: number
  blurred?: boolean
}

function FinderResultCard({ result, index, blurred = false }: FinderResultCardProps) {
  return (
    <Card variant="white" padding="lg" className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-[#B2BBC5] tabular-nums">#{index + 1}</span>
          <h3 className="text-[#121317] font-medium text-base" style={{ letterSpacing: '-0.01em' }}>
            {result.title}
          </h3>
        </div>
        <div className={blurred ? 'blur-sm select-none pointer-events-none' : ''}>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${VERDICT_STYLES[result.verdict]}`}>
            {result.verdict}
          </span>
        </div>
      </div>

      {/* Problème */}
      <p className="text-sm text-[#45474D] leading-relaxed">{result.problem}</p>

      {/* Méta */}
      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="flex items-center gap-1.5 text-[#45474D]">
          <Users size={12} strokeWidth={1.5} className="text-[#B2BBC5]" />
          <span>{result.audience}</span>
        </div>
        <div className="flex items-center gap-1.5 text-[#45474D]">
          <TrendingUp size={12} strokeWidth={1.5} className="text-[#B2BBC5]" />
          <span>Concurrence : {result.competition}</span>
        </div>
        <div className="flex items-center gap-1.5 text-[#45474D]">
          <Zap size={12} strokeWidth={1.5} className="text-[#B2BBC5]" />
          <span>{result.pricing_estimate}</span>
        </div>
        <div className="flex items-center gap-1.5 text-[#45474D]">
          <Clock size={12} strokeWidth={1.5} className="text-[#B2BBC5]" />
          <span>{result.build_time}</span>
        </div>
      </div>

      {/* Score — blurré pour anonymes */}
      <div className={`flex items-center gap-2 pt-1 border-t border-[#E6EAF0] ${blurred ? 'blur-sm select-none pointer-events-none' : ''}`}>
        <div className="flex-1 h-1.5 bg-[#E6EAF0] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-[#3279F9] transition-all duration-500"
            style={{ width: `${result.score}%` }}
          />
        </div>
        <span className="text-xs font-semibold text-[#121317] tabular-nums">{result.score}/100</span>
      </div>

      {/* Sources */}
      {result.sources.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {result.sources.slice(0, 3).map((s) => (
            <a
              key={s.url}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[10px] text-[#B2BBC5] hover:text-[#3279F9] transition-colors"
            >
              <ExternalLink size={9} />
              {s.name}
            </a>
          ))}
        </div>
      )}
    </Card>
  )
}

export { FinderResultCard }
