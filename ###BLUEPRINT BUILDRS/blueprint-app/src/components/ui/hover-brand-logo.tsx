import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

type Brand = {
  id: string
  name: string
  utility: string
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
}

type Props = {
  brands: Brand[]
  label?: string
}

export function HoverBrandLogo({ brands, label = 'Les outils qu\'on utilise' }: Props) {
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const active = brands.find(b => b.id === hoveredId)

  const row1 = brands.slice(0, 4)
  const row2 = brands.slice(4, 8)

  return (
    <div className="w-full max-w-[1100px] mx-auto px-6 py-10">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-8">

        {/* Left: label + animated name */}
        <div className="flex-shrink-0 w-full sm:w-[220px]">
          <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground/50 mb-1">
            {label}
          </p>
          <div className="relative h-[44px] overflow-hidden">
            <AnimatePresence mode="wait">
              {active ? (
                <motion.div
                  key={hoveredId ?? '__default__'}
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -10, opacity: 0 }}
                  transition={{ duration: 0.12, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="absolute inset-0"
                >
                  <p className="text-[17px] font-bold text-foreground leading-tight tracking-tight">
                    {active.name}
                  </p>
                  <p className="text-[11px] text-muted-foreground/60 mt-0.5 leading-snug">
                    {active.utility}
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="__default__"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.1 }}
                  className="absolute inset-0 flex items-center"
                >
                  <p className="text-[13px] text-muted-foreground/40 italic">Survole un outil</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right: 4×2 grid */}
        <div className="flex flex-col gap-2">
          {[row1, row2].map((row, rowIdx) => (
            <div key={rowIdx} className="flex items-center gap-2">
              {row.map(({ id, name, Icon }) => {
                const isActive = hoveredId === id
                return (
                  <button
                    key={id}
                    aria-label={name}
                    className={[
                      'flex items-center justify-center p-3 rounded-xl border transition-all duration-150',
                      isActive
                        ? 'border-foreground/30 text-foreground bg-foreground/5'
                        : 'border-transparent text-foreground/25 hover:text-foreground/60 hover:border-border',
                    ].join(' ')}
                    onMouseEnter={() => setHoveredId(id)}
                    onMouseLeave={() => setHoveredId(null)}
                  >
                    <Icon className="w-8 h-8" />
                  </button>
                )
              })}
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
