import { forwardRef, InputHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

export type InputMode = 'light' | 'dark'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  mode?: InputMode
  label?: string
  error?: string
  hint?: string
  leftIcon?: ReactNode
  rightElement?: ReactNode
  fullWidth?: boolean
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      mode = 'light',
      label,
      error,
      hint,
      leftIcon,
      rightElement,
      fullWidth = true,
      className,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className={cn('flex flex-col gap-1.5', fullWidth && 'w-full')}>
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              'text-[12.5px] font-medium tracking-[0.011em]',
              mode === 'light' ? 'text-[#45474D]' : 'text-[#B2BBC5]'
            )}
          >
            {label}
          </label>
        )}

        <div className="relative flex items-center">
          {leftIcon && (
            <span className="absolute left-3.5 flex items-center pointer-events-none text-[#B2BBC5]">
              {leftIcon}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            className={cn(
              'rounded-[10px] px-4 py-3 text-sm w-full',
              'transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-[#3279F9]/40 focus:ring-offset-0',
              'placeholder:text-[#B2BBC5]',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              mode === 'light' && 'bg-white border border-[#E6EAF0] text-[#121317] hover:border-[#E1E6EC]',
              mode === 'light' && error && 'border-[#EF4444] focus:ring-[#EF4444]/30',
              mode === 'dark' && 'bg-[#121317] border border-[#212226] text-white hover:border-[#2E3038]',
              mode === 'dark' && error && 'border-[#EF4444] focus:ring-[#EF4444]/30',
              leftIcon ? 'pl-10' : undefined,
              rightElement ? 'pr-12' : undefined,
              className
            )}
            {...props}
          />

          {rightElement && (
            <span className="absolute right-3 flex items-center">
              {rightElement}
            </span>
          )}
        </div>

        {error && <p className="text-xs text-[#EF4444]">{error}</p>}
        {hint && !error && (
          <p className={cn('text-xs', mode === 'light' ? 'text-[#B2BBC5]' : 'text-[#45474D]')}>
            {hint}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export { Input }
