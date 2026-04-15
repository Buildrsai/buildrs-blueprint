interface Props {
  score: number
  size?: 'sm' | 'md'
}

const VERDICT = (score: number) =>
  score >= 70 ? { label: 'GO', color: '#22c55e' } :
  score >= 45 ? { label: 'PIVOT', color: '#eab308' } :
  { label: 'STOP', color: '#ef4444' }

export function ScoreBadge({ score, size = 'sm' }: Props) {
  const { label, color } = VERDICT(score)
  const isSm = size === 'sm'

  return (
    <span
      className="inline-flex items-center gap-1 rounded-full font-bold tabular-nums"
      style={{
        padding: isSm ? '2px 7px' : '3px 10px',
        fontSize: isSm ? 10 : 12,
        background: `${color}18`,
        color,
        border: `1px solid ${color}30`,
      }}
    >
      {score}
      <span style={{ fontSize: isSm ? 8 : 10, opacity: 0.8 }}>{label}</span>
    </span>
  )
}
