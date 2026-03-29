import { cn, getScoreColor } from '@/lib/utils'

interface ScoreRingProps {
  score: number
  max?: number
  size?: number
  strokeWidth?: number
  className?: string
}

const colorMap = {
  success: { stroke: '#22C55E', glow: 'rgba(34,197,94,0.3)' },
  warning: { stroke: '#F59E0B', glow: 'rgba(245,158,11,0.3)' },
  error:   { stroke: '#EF4444', glow: 'rgba(239,68,68,0.3)' },
}

function ScoreRing({ score, max = 100, size = 140, strokeWidth = 8, className }: ScoreRingProps) {
  const color = getScoreColor(score)
  const { stroke, glow } = colorMap[color]
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const progress = (score / max) * circumference
  const offset = circumference - progress

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#E6EAF0"
          strokeWidth={strokeWidth}
        />
        {/* Progress */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            filter: `drop-shadow(0 0 6px ${glow})`,
            transition: 'stroke-dashoffset 1s cubic-bezier(.25,.46,.45,.94)',
          }}
        />
      </svg>
      {/* Score au centre */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="font-mono font-bold"
          style={{ fontSize: size * 0.28, color: stroke }}
        >
          {score}
        </span>
        <span className="text-xs text-[#B2BBC5] font-mono">/{max}</span>
      </div>
    </div>
  )
}

export { ScoreRing }
