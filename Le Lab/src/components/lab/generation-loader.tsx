import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface StepConfig {
  key: string
  icon: string
  label: string
}

interface GenerationLoaderProps {
  currentStep: string | null
  onCancel: () => void
  className?: string
  steps?: StepConfig[]
  title?: string
}

const DEFAULT_STEPS: StepConfig[] = [
  { key: 'analyzing',          icon: '🔍', label: 'Analyse de ton idée...' },
  { key: 'searching_market',   icon: '📊', label: 'Recherche de données marché...' },
  { key: 'finding_competitors', icon: '⚔️', label: 'Identification des concurrents...' },
  { key: 'calculating_score',  icon: '🎯', label: 'Calcul du score de viabilité...' },
  { key: 'generating_report',  icon: '📝', label: 'Génération du rapport...' },
]

function GenerationLoader({ currentStep, onCancel, className, steps, title }: GenerationLoaderProps) {
  const STEPS = steps ?? DEFAULT_STEPS
  const [activeIndex, setActiveIndex] = useState(0)

  // Avancer automatiquement les étapes si pas de signal serveur
  useEffect(() => {
    if (currentStep) {
      const idx = STEPS.findIndex(s => s.key === currentStep)
      if (idx >= 0) setActiveIndex(idx)
      return
    }

    // Timer auto-progression
    const timer = setInterval(() => {
      setActiveIndex(prev => (prev < STEPS.length - 1 ? prev + 1 : prev))
    }, 8000)

    return () => clearInterval(timer)
  }, [currentStep])

  return (
    <Card variant="white" padding="lg" className={cn('flex flex-col items-center gap-8 py-12', className)}>
      {/* Animation pulsante */}
      <div className="relative">
        <div className="w-20 h-20 rounded-full bg-[#3279F9]/10 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-[#3279F9]/20 flex items-center justify-center animate-pulse">
            <span className="text-2xl">{STEPS[activeIndex].icon}</span>
          </div>
        </div>
        {/* Cercle tournant */}
        <svg
          className="absolute inset-0 w-20 h-20 animate-spin"
          style={{ animationDuration: '3s' }}
          viewBox="0 0 80 80"
        >
          <circle
            cx="40" cy="40" r="36"
            fill="none"
            stroke="#3279F9"
            strokeWidth="2"
            strokeDasharray="60 170"
            strokeLinecap="round"
            opacity="0.4"
          />
        </svg>
      </div>

      {/* Titre */}
      <div className="text-center flex flex-col gap-1">
        <h3 className="text-base font-medium text-[#121317]">{title ?? 'Le Lab analyse ton projet'}</h3>
        <p className="text-xs text-[#B2BBC5]">Cela prend environ 30-45 secondes</p>
      </div>

      {/* Étapes */}
      <div className="flex flex-col gap-3 w-full max-w-[340px]">
        {STEPS.map((step, i) => {
          const isActive = i === activeIndex
          const isDone = i < activeIndex

          return (
            <div key={step.key} className="flex items-center gap-3">
              {/* Indicateur */}
              <div
                className={cn(
                  'w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-500',
                  isDone && 'bg-[#22C55E]/15',
                  isActive && 'bg-[#3279F9]/15',
                  !isDone && !isActive && 'bg-[#EFF2F7]'
                )}
              >
                {isDone ? (
                  <span className="text-[10px] text-[#22C55E]">✓</span>
                ) : isActive ? (
                  <div className="w-2 h-2 rounded-full bg-[#3279F9] animate-pulse" />
                ) : (
                  <div className="w-1.5 h-1.5 rounded-full bg-[#B2BBC5]" />
                )}
              </div>

              {/* Label */}
              <span
                className={cn(
                  'text-sm transition-colors duration-500',
                  isDone && 'text-[#22C55E]',
                  isActive && 'text-[#121317] font-medium',
                  !isDone && !isActive && 'text-[#B2BBC5]'
                )}
              >
                {step.label}
              </span>
            </div>
          )
        })}
      </div>

      {/* Annuler */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onCancel}
        className="text-[#B2BBC5] hover:text-[#EF4444]"
      >
        Annuler
      </Button>
    </Card>
  )
}

export { GenerationLoader }
