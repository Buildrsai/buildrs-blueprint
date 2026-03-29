import { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export type BadgeVariant = 'neutral' | 'accent' | 'success' | 'warning' | 'error' | 'dark'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
}

const variantClasses: Record<BadgeVariant, string> = {
  neutral: 'bg-[#EFF2F7] text-[#45474D]',
  accent:  'bg-[#3279F9] text-white',
  success: 'bg-[#22C55E]/10 text-[#22C55E]',
  warning: 'bg-[#F59E0B]/10 text-[#F59E0B]',
  error:   'bg-[#EF4444]/10 text-[#EF4444]',
  dark:    'bg-[#212226] text-[#B2BBC5]',
}

function Badge({ variant = 'neutral', className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        // Pill — règle Antigravity
        'inline-flex items-center gap-1 px-3 py-1 rounded-full',
        'text-xs font-medium tracking-[0.011em] whitespace-nowrap',
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}

export { Badge }
