import { cva } from "class-variance-authority"
import { motion } from "framer-motion"
import { cn } from "../../lib/utils"

const bouncingDotsVariant = cva("flex gap-2 items-center justify-center", {
  variants: {
    messagePlacement: {
      bottom: "flex-col",
      right: "flex-row",
      left: "flex-row-reverse",
    },
  },
  defaultVariants: {
    messagePlacement: "bottom",
  },
})

export interface BouncingDotsProps {
  dots?: number
  message?: string
  messagePlacement?: "bottom" | "left" | "right"
}

export function BouncingDots({
  dots = 3,
  message,
  messagePlacement = "bottom",
  className,
}: BouncingDotsProps & { className?: string }) {
  return (
    <div className={cn(bouncingDotsVariant({ messagePlacement }))}>
      <div className="flex gap-2 items-center justify-center">
        {Array(dots)
          .fill(undefined)
          .map((_, index) => (
            <motion.div
              key={index}
              className={cn("w-2 h-2 bg-foreground rounded-full", className)}
              animate={{ y: [0, -12, 0] }}
              transition={{
                duration: 0.6,
                repeat: Number.POSITIVE_INFINITY,
                delay: index * 0.2,
                ease: "easeInOut",
              }}
            />
          ))}
      </div>
      {message && (
        <div className="text-xs text-muted-foreground">{message}</div>
      )}
    </div>
  )
}
