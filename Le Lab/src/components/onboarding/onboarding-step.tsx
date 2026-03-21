import { useState } from 'react'
import { ArrowRight, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface OnboardingStepProps {
  step: number
  total: number
  question: string
  options: readonly string[]
  hasOther?: boolean
  value: string
  onChange: (val: string) => void
  onNext: () => void
  onBack?: () => void
}

function OnboardingStep({
  step,
  total,
  question,
  options,
  hasOther = false,
  value,
  onChange,
  onNext,
  onBack,
}: OnboardingStepProps) {
  const [otherText, setOtherText] = useState('')
  const isOtherSelected = value === '__other__'
  const canProceed = value !== '' && (!isOtherSelected || otherText.trim() !== '')

  const handleNext = () => {
    if (isOtherSelected) {
      onChange(otherText.trim())
    }
    onNext()
  }

  return (
    <div className="w-full max-w-[540px] flex flex-col gap-8">
      {/* Counter */}
      <p className="text-xs text-[#B2BBC5] text-center tracking-wide uppercase">
        {step + 1} / {total}
      </p>

      {/* Question */}
      <h2
        className="text-[#121317] text-center"
        style={{
          fontSize: 'clamp(22px, 4vw, 32px)',
          fontWeight: 400,
          letterSpacing: '-0.03em',
          lineHeight: 1.2,
        }}
      >
        {question}
      </h2>

      {/* Options */}
      <div className="flex flex-col gap-2">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className={cn(
              'w-full text-left px-5 py-4 rounded-xl border text-sm transition-all duration-150',
              value === opt
                ? 'bg-white border-[#3279F9] ring-1 ring-[#3279F9]/20 text-[#121317]'
                : 'bg-white border-[#E6EAF0] text-[#45474D] hover:border-[#B2BBC5]'
            )}
          >
            {opt}
          </button>
        ))}

        {hasOther && (
          <div>
            <button
              onClick={() => onChange('__other__')}
              className={cn(
                'w-full text-left px-5 py-4 rounded-xl border text-sm transition-all duration-150',
                isOtherSelected
                  ? 'bg-white border-[#3279F9] ring-1 ring-[#3279F9]/20 text-[#121317]'
                  : 'bg-white border-[#E6EAF0] text-[#45474D] hover:border-[#B2BBC5]'
              )}
            >
              Autre…
            </button>
            {isOtherSelected && (
              <input
                autoFocus
                className="mt-2 w-full px-4 py-3 rounded-xl border border-[#3279F9] bg-white
                  text-sm text-[#121317] placeholder:text-[#B2BBC5]
                  focus:outline-none focus:ring-2 focus:ring-[#3279F9]/20"
                placeholder="Décris ton profil en quelques mots…"
                value={otherText}
                onChange={(e) => setOtherText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && canProceed && handleNext()}
              />
            )}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center gap-3">
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-sm text-[#B2BBC5] hover:text-[#45474D] transition-colors"
          >
            <ArrowLeft size={14} />
            Retour
          </button>
        )}
        <div className="flex-1" />
        <Button
          variant="primary"
          size="lg"
          disabled={!canProceed}
          onClick={handleNext}
          className="gap-2"
        >
          Suivant
          <ArrowRight size={15} />
        </Button>
      </div>
    </div>
  )
}

export { OnboardingStep }
