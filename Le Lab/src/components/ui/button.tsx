import { forwardRef, ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'ghost'
export type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  fullWidth?: boolean
}

const variantClasses: Record<ButtonVariant, string> = {
  // Bouton noir — style Antigravity "Download" — pill obligatoire
  primary:
    'bg-[#121317] text-white hover:bg-[#212226] active:bg-[#000000]',
  // Bouton outlined — pill, border noir
  secondary:
    'bg-transparent text-[#121317] border border-[#121317] hover:bg-[rgba(33,34,38,0.04)] active:bg-[rgba(33,34,38,0.12)]',
  // Bouton bleu accent
  accent:
    'bg-[#3279F9] text-white hover:bg-[#1A73E8] active:bg-[#1560D4]',
  // Ghost / texte
  ghost:
    'bg-transparent text-[#45474D] hover:bg-[rgba(33,34,38,0.04)] active:bg-[rgba(33,34,38,0.08)]',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-[13px] gap-1.5',
  md: 'px-6 py-3 text-[14.5px] gap-2',
  lg: 'px-8 py-3.5 text-[14.5px] gap-2',
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      fullWidth = false,
      disabled,
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled ?? loading}
        className={cn(
          // Pill — règle absolue Antigravity
          'inline-flex items-center justify-center rounded-full font-medium',
          'tracking-[0.011em]', // letter-spacing CTA
          'transition-all duration-200 ease-out cursor-pointer',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3279F9] focus-visible:ring-offset-2',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          variantClasses[variant],
          sizeClasses[size],
          fullWidth && 'w-full',
          className
        )}
        {...props}
      >
        {loading ? (
          <>
            <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            <span>Chargement…</span>
          </>
        ) : (
          children
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'

export { Button }
