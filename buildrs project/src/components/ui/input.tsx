import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        className={cn(
          'flex w-full',
          'bg-bg-surface border border-border-default rounded-md',
          'text-text-primary text-sm font-sans',
          'px-[14px] py-[10px]',
          'placeholder:text-text-muted',
          'transition-[border-color,box-shadow] duration-fast',
          'focus-visible:outline-none',
          'focus-visible:border-border-strong',
          'focus-visible:ring-[3px] focus-visible:ring-white/[0.04]',
          'disabled:cursor-not-allowed disabled:opacity-40',
          className
        )}
        {...props}
      />
    )
  }
)
Input.displayName = 'Input'
