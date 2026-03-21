import { cn } from '@/lib/utils'
import { PHASE_NAMES } from '@/lib/utils'

interface ProgressPhasesProps {
  currentPhase: number
  completedPhases?: number[]
  showLabels?: boolean
  className?: string
}

function ProgressPhases({
  currentPhase,
  completedPhases = [],
  showLabels = false,
  className,
}: ProgressPhasesProps) {
  const phases = [1, 2, 3, 4, 5, 6, 7, 8]

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {/* Barre 8 segments — bleu Antigravity */}
      <div className="flex gap-1">
        {phases.map((phase) => {
          const isCompleted = completedPhases.includes(phase)
          const isCurrent = phase === currentPhase
          const isLocked = phase > currentPhase && !isCompleted

          return (
            <div
              key={phase}
              title={PHASE_NAMES[phase]}
              className={cn(
                'flex-1 h-1 rounded-full transition-all duration-300',
                isCompleted && 'bg-[#3279F9]',
                isCurrent && 'bg-[#3279F9] opacity-60',
                isLocked && 'bg-[#E6EAF0]'
              )}
            />
          )
        })}
      </div>

      {showLabels && (
        <div className="flex justify-between">
          <span className="text-[12.5px] text-[#B2BBC5]">
            Phase {currentPhase} — {PHASE_NAMES[currentPhase]}
          </span>
          <span className="text-[12.5px] text-[#B2BBC5]">
            {completedPhases.length}/8
          </span>
        </div>
      )}
    </div>
  )
}

export { ProgressPhases }
