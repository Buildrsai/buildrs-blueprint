import { Check } from 'lucide-react'
import type { MissionDef } from '../../hooks/useMissions'

const STEP_LABELS: Record<string, string> = {
  profile:        'Profil',
  community:      'Communauté',
  environment:    'Environnement',
  find_idea:      'Idée',
  create_project: 'Projet',
  validate:       'Score',
}

interface Props {
  defs: MissionDef[]
  completedIds: Set<string>
  currentIndex: number
}

export function MissionStepper({ defs, completedIds, currentIndex }: Props) {
  return (
    <div className="w-full">
      {/* Mobile: compact pill row */}
      <div className="flex items-center gap-0 overflow-x-auto pb-1 sm:hidden">
        {defs.map((def, i) => {
          const done    = completedIds.has(def.id)
          const active  = i === currentIndex
          const future  = !done && !active
          return (
            <div key={def.id} className="flex items-center flex-shrink-0">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 border text-[10px] font-bold transition-all"
                style={{
                  background: done ? '#22c55e' : active ? 'hsl(var(--foreground))' : 'hsl(var(--secondary))',
                  borderColor: done ? '#22c55e' : active ? 'hsl(var(--foreground))' : 'hsl(var(--border))',
                  color: done || active ? 'hsl(var(--background))' : 'hsl(var(--muted-foreground))',
                }}
              >
                {done ? <Check size={10} strokeWidth={2.5} /> : i + 1}
              </div>
              {i < defs.length - 1 && (
                <div
                  className="h-px w-5 flex-shrink-0 mx-0.5"
                  style={{ background: done ? '#22c55e' : 'hsl(var(--border))' }}
                />
              )}
            </div>
          )
        })}
        <span className="ml-2 text-[10px] text-muted-foreground flex-shrink-0">
          {completedIds.size}/{defs.length}
        </span>
      </div>

      {/* Desktop: full stepper */}
      <div className="hidden sm:flex items-center">
        {defs.map((def, i) => {
          const done   = completedIds.has(def.id)
          const active = i === currentIndex
          return (
            <div key={def.id} className="flex items-center flex-1 last:flex-none">
              {/* Circle + label */}
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center border text-[11px] font-bold transition-all duration-300"
                  style={{
                    background: done ? '#22c55e' : active ? 'hsl(var(--foreground))' : 'hsl(var(--secondary))',
                    borderColor: done ? '#22c55e' : active ? 'hsl(var(--foreground))' : 'hsl(var(--border))',
                    color: done || active ? 'hsl(var(--background))' : 'hsl(var(--muted-foreground))',
                  }}
                >
                  {done ? <Check size={11} strokeWidth={2.5} /> : i + 1}
                </div>
                <span
                  className="text-[9px] font-semibold uppercase tracking-wide whitespace-nowrap"
                  style={{ color: done ? '#22c55e' : active ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))' }}
                >
                  {STEP_LABELS[def.id] ?? def.id}
                </span>
              </div>
              {/* Connector */}
              {i < defs.length - 1 && (
                <div
                  className="flex-1 h-px mx-2 mb-4 transition-all duration-300"
                  style={{ background: done ? '#22c55e' : 'hsl(var(--border))' }}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
