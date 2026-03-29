import { cn, getScoreColor } from '@/lib/utils'

interface ScoreBadgeProps {
  score: number
  showLabel?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeClasses = {
  sm: 'text-sm px-2.5 py-0.5',
  md: 'text-base px-3 py-1',
  lg: 'text-xl px-4 py-1.5',
}

const colorClasses = {
  success: 'text-[#22C55E] [text-shadow:0_0_10px_rgba(34,197,94,0.4)]',
  warning: 'text-[#F59E0B] [text-shadow:0_0_10px_rgba(245,158,11,0.4)]',
  error:   'text-[#EF4444] [text-shadow:0_0_10px_rgba(239,68,68,0.4)]',
}

const bgClasses = {
  success: 'bg-[#22C55E]/10 border-[#22C55E]/20',
  warning: 'bg-[#F59E0B]/10 border-[#F59E0B]/20',
  error:   'bg-[#EF4444]/10 border-[#EF4444]/20',
}

function ScoreBadge({ score, showLabel = true, size = 'md', className }: ScoreBadgeProps) {
  const color = getScoreColor(score)

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border font-bold font-mono',
        sizeClasses[size],
        colorClasses[color],
        bgClasses[color],
        className
      )}
    >
      <span>{score}</span>
      {showLabel && <span className="text-xs font-normal opacity-60">/100</span>}
    </span>
  )
}

export { ScoreBadge }
