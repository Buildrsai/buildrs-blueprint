import { cn } from '@/lib/utils'

interface VerdictBannerProps {
  verdict: 'go' | 'refine' | 'pivot'
  text: string
  className?: string
}

const verdictConfig = {
  go: {
    icon: '✓',
    label: 'GO',
    bg: 'bg-[#22C55E]/8 border-[#22C55E]/20',
    iconBg: 'bg-[#22C55E]/15 text-[#22C55E]',
    text: 'text-[#22C55E]',
  },
  refine: {
    icon: '⚠',
    label: 'À AFFINER',
    bg: 'bg-[#F59E0B]/8 border-[#F59E0B]/20',
    iconBg: 'bg-[#F59E0B]/15 text-[#F59E0B]',
    text: 'text-[#F59E0B]',
  },
  pivot: {
    icon: '✗',
    label: 'PIVOT',
    bg: 'bg-[#EF4444]/8 border-[#EF4444]/20',
    iconBg: 'bg-[#EF4444]/15 text-[#EF4444]',
    text: 'text-[#EF4444]',
  },
}

function VerdictBanner({ verdict, text, className }: VerdictBannerProps) {
  const config = verdictConfig[verdict]

  return (
    <div className={cn('rounded-2xl border p-5 flex items-start gap-4', config.bg, className)}>
      <div className={cn('w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-lg font-bold', config.iconBg)}>
        {config.icon}
      </div>
      <div className="flex flex-col gap-1 min-w-0">
        <span className={cn('text-sm font-semibold tracking-wide', config.text)}>
          {config.label}
        </span>
        <p className="text-sm text-[#45474D] leading-relaxed">{text}</p>
      </div>
    </div>
  )
}

export { VerdictBanner }
