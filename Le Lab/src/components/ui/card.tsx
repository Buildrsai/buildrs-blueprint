import { HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export type CardVariant = 'light' | 'white' | 'dark' | 'dark-active' | 'feature'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant
  hover?: boolean
  padding?: 'sm' | 'md' | 'lg'
}

const variantClasses: Record<CardVariant, string> = {
  // Surface gris bleuté — feature cards Antigravity
  light:
    'bg-[#EFF2F7]',
  // Card blanche avec border subtile
  white:
    'bg-white border border-[#E6EAF0] shadow-[0_1px_2px_rgba(18,19,23,0.04),0_4px_8px_rgba(18,19,23,0.02)]',
  // Card dark
  dark:
    'bg-[#18191D] border border-[#212226]',
  // Card dark active — glow bleu
  'dark-active':
    'bg-[#18191D] border border-[#3279F9] shadow-[0_0_20px_rgba(50,121,249,0.3)]',
  // Feature card — identique à light mais avec padding généreux (grandes sections)
  feature:
    'bg-[#EFF2F7]',
}

const radiusClasses: Record<CardVariant, string> = {
  light:        'rounded-2xl',    /* 16px */
  white:        'rounded-2xl',    /* 16px */
  dark:         'rounded-xl',     /* 12px */
  'dark-active': 'rounded-xl',
  feature:      'rounded-2xl',    /* 16px */
}

const paddingClasses = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'white', hover = false, padding = 'md', className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'transition-all duration-200',
          variantClasses[variant],
          radiusClasses[variant],
          paddingClasses[padding],
          hover && (variant === 'light' || variant === 'white' || variant === 'feature') &&
            'hover:shadow-[0_4px_16px_rgba(18,19,23,0.08)] hover:-translate-y-0.5 cursor-pointer',
          hover && (variant === 'dark' || variant === 'dark-active') &&
            'hover:border-[#3279F9] hover:shadow-[0_0_20px_rgba(50,121,249,0.15)]',
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'

export { Card }
