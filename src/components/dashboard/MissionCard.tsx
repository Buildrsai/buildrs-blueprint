import { ArrowRight, Rocket } from 'lucide-react'
import type { MissionDef } from '../../hooks/useMissions'
import { MissionStepper } from './MissionStepper'

interface Props {
  currentDef: MissionDef
  currentIndex: number
  progress: number
  total: number
  defs: MissionDef[]
  completedIds: Set<string>
  navigate: (hash: string) => void
}

export function MissionCard({ currentDef, currentIndex, progress, total, defs, completedIds, navigate }: Props) {
  return (
    <div
      className="rounded-2xl border p-5 flex flex-col gap-4"
      style={{ borderColor: 'rgba(77,150,255,0.25)', background: 'rgba(77,150,255,0.04)' }}
    >
      {/* Header */}
      <div className="flex items-start gap-3">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'rgba(77,150,255,0.12)', border: '1px solid rgba(77,150,255,0.2)' }}
        >
          <Rocket size={16} strokeWidth={1.5} style={{ color: '#4d96ff' }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <p className="text-[9.5px] font-bold uppercase tracking-[0.1em]" style={{ color: '#4d96ff' }}>
              Mission {currentIndex + 1}/{total}
            </p>
          </div>
          <p className="text-sm font-bold text-foreground leading-snug">{currentDef.title}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">{currentDef.description}</p>
        </div>
      </div>

      {/* Stepper */}
      <MissionStepper defs={defs} completedIds={completedIds} currentIndex={currentIndex} />

      {/* CTA */}
      <button
        onClick={() => navigate(currentDef.hash)}
        className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-[12px] font-bold transition-opacity hover:opacity-90"
        style={{ background: '#4d96ff', color: '#ffffff' }}
      >
        {currentDef.cta}
        <ArrowRight size={13} strokeWidth={2} />
      </button>
    </div>
  )
}
