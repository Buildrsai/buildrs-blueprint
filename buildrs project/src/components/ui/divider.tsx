import { cn } from '@/lib/utils'

export interface DividerProps extends React.HTMLAttributes<HTMLHRElement> {}

export function Divider({ className, ...props }: DividerProps) {
  return (
    <hr
      className={cn(
        'divider border-none my-6',
        className
      )}
      {...props}
    />
  )
}
