import { cn } from '@/lib/utils'

interface ScoreBarProps {
  label: string
  score: number
  max?: number
  summary: string
  icon: string
  className?: string
}

function getBarColor(score: number, max: number): string {
  const pct = score / max
  if (pct >= 0.7) return 'bg-[#22C55E]'
  if (pct >= 0.45) return 'bg-[#F59E0B]'
  return 'bg-[#EF4444]'
}

function ScoreBar({ label, score, max = 25, summary, icon, className }: ScoreBarProps) {
  const pct = (score / max) * 100

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-base">{icon}</span>
          <span className="text-sm font-medium text-[#121317]">{label}</span>
        </div>
        <span className="text-sm font-mono font-semibold text-[#121317]">
          {score}<span className="text-[#B2BBC5] font-normal">/{max}</span>
        </span>
      </div>
      <div className="h-2 bg-[#E6EAF0] rounded-full overflow-hidden">
        <div
          className={cn('h-full rounded-full transition-all duration-1000', getBarColor(score, max))}
          style={{ width: `${pct}%`, transitionTimingFunction: 'cubic-bezier(.25,.46,.45,.94)' }}
        />
      </div>
      <p className="text-xs text-[#45474D] leading-relaxed">{summary}</p>
    </div>
  )
}

export { ScoreBar }
