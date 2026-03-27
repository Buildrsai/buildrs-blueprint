import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "../../lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip"

interface DockItem {
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>
  label: string
  onClick?: () => void
  active?: boolean
}

interface DockProps {
  items: DockItem[]
  className?: string
}

export function Dock({ items, className }: DockProps) {
  const [hovered, setHovered] = React.useState<number | null>(null)

  return (
    <TooltipProvider delayDuration={200}>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
        className={cn(
          "flex items-end gap-1 px-3 py-2.5 rounded-2xl",
          "border border-border/60 bg-background/80 backdrop-blur-2xl shadow-2xl",
          className,
        )}
      >
        {items.map((item, i) => {
          const isHovered = hovered === i
          const Icon = item.icon

          return (
            <Tooltip key={item.label}>
              <TooltipTrigger asChild>
                <motion.button
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                  onTouchStart={() => setHovered(i)}
                  onTouchEnd={() => setHovered(null)}
                  onClick={item.onClick}
                  animate={{
                    scale: isHovered ? 1.25 : 1,
                    y: isHovered ? -4 : 0,
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 22 }}
                  className={cn(
                    "relative flex flex-col items-center justify-center",
                    "w-12 h-12 rounded-xl transition-colors duration-150",
                    item.active
                      ? "bg-foreground text-background"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/60",
                  )}
                >
                  <Icon size={20} strokeWidth={1.5} />

                  {/* Glow ring on hover */}
                  <AnimatePresence>
                    {isHovered && !item.active && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 rounded-xl border border-foreground/20"
                      />
                    )}
                  </AnimatePresence>

                  {/* Active dot */}
                  {item.active && (
                    <motion.div
                      layoutId="dock-active-dot"
                      className="absolute -bottom-1.5 w-1 h-1 rounded-full bg-foreground"
                    />
                  )}
                </motion.button>
              </TooltipTrigger>
              <TooltipContent side="top">
                {item.label}
              </TooltipContent>
            </Tooltip>
          )
        })}
      </motion.div>
    </TooltipProvider>
  )
}
