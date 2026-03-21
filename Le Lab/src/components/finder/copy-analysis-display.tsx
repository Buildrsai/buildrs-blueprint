import { AlertCircle, Lightbulb, Code } from 'lucide-react'
import { Card } from '@/components/ui/card'
import type { CopyResult } from '@/types/finder'

const VERDICT_STYLES = {
  'GO': 'bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20',
  'À AFFINER': 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20',
  'PIVOT': 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20',
}

interface CopyAnalysisDisplayProps {
  result: CopyResult
  blurred?: boolean
}

function CopyAnalysisDisplay({ result, blurred = false }: CopyAnalysisDisplayProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* Analyse du produit */}
      <Card variant="white" padding="lg">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <p className="text-xs text-[#B2BBC5] uppercase tracking-wide">Produit analysé</p>
            <h3 className="text-lg font-medium text-[#121317]" style={{ letterSpacing: '-0.02em' }}>
              {result.product_name}
            </h3>
          </div>
          <span className="text-xs text-[#B2BBC5] bg-[#F8F9FC] px-2 py-1 rounded-lg flex-shrink-0">
            {result.pricing}
          </span>
        </div>
        <p className="text-sm text-[#45474D] mb-4">{result.what_it_does}</p>
        <div>
          <p className="text-xs font-medium text-[#121317] mb-2 flex items-center gap-1.5">
            <AlertCircle size={12} strokeWidth={1.5} className="text-[#F59E0B]" />
            Faiblesses à exploiter
          </p>
          <ul className="flex flex-col gap-1.5">
            {result.weaknesses.map((w, i) => (
              <li key={i} className="text-xs text-[#45474D] flex items-start gap-2">
                <span className="text-[#F59E0B] mt-0.5 flex-shrink-0">·</span>
                {w}
              </li>
            ))}
          </ul>
        </div>
      </Card>

      {/* Angles niche — blurrés pour anonymes */}
      <div className={blurred ? 'blur-sm select-none pointer-events-none' : ''}>
        <p className="text-xs text-[#B2BBC5] uppercase tracking-wide mb-3 flex items-center gap-1.5">
          <Lightbulb size={12} strokeWidth={1.5} />
          3 adaptations niche
        </p>
        <div className="flex flex-col gap-3">
          {result.angles.map((angle, i) => (
            <Card key={i} variant="white" padding="md" className="flex flex-col gap-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-medium text-[#121317]">{angle.title}</p>
                  <p className="text-xs text-[#3279F9] mt-0.5">{angle.niche}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-xs font-semibold text-[#121317] tabular-nums">{angle.score}/100</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs border ${VERDICT_STYLES[angle.verdict]}`}>
                    {angle.verdict}
                  </span>
                </div>
              </div>
              <p className="text-xs text-[#45474D] leading-relaxed">{angle.description}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* MVP Scope */}
      <Card variant="light" padding="md" className="flex items-start gap-2.5">
        <Code size={14} strokeWidth={1.5} className="text-[#3279F9] flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-medium text-[#121317] mb-1">Scope MVP</p>
          <p className="text-xs text-[#45474D] leading-relaxed">{result.mvp_scope}</p>
        </div>
      </Card>
    </div>
  )
}

export { CopyAnalysisDisplay }
