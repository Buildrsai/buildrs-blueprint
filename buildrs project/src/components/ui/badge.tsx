import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  [
    'inline-flex items-center',
    'font-sans font-medium text-[11px] leading-[1.4] tracking-[0.05em]',
    'px-2 py-[3px]',
    'rounded-sm border',
  ].join(' '),
  {
    variants: {
      variant: {
        default: 'border-border-default text-text-muted bg-transparent',
        success: 'border-success/30 text-success bg-success/10',
        warning: 'border-warning/30 text-warning bg-warning/10',
        error:   'border-error/30 text-error bg-error/10',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}
