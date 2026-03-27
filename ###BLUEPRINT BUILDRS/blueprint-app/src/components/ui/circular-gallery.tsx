import React, { useState, useEffect, useRef } from 'react'
import type { HTMLAttributes, ReactNode } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const cn = (...classes: (string | undefined | null | false)[]) => {
  return classes.filter(Boolean).join(' ')
}

export interface GalleryCard {
  id: string
  title: string
  stat: string
  description: string
  diagram?: ReactNode
}

interface CircularGalleryProps extends HTMLAttributes<HTMLDivElement> {
  items: GalleryCard[]
  radius?: number
  autoRotateSpeed?: number
}

const CircularGallery = React.forwardRef<HTMLDivElement, CircularGalleryProps>(
  ({ items, className, radius = 480, autoRotateSpeed = 0.012, ...props }, ref) => {
    const [rotation, setRotation] = useState(0)
    const [isPaused, setIsPaused] = useState(false)
    const animationFrameRef = useRef<number | null>(null)
    const pauseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const anglePerItem = 360 / items.length

    useEffect(() => {
      const autoRotate = () => {
        if (!isPaused) {
          setRotation((prev) => prev + autoRotateSpeed)
        }
        animationFrameRef.current = requestAnimationFrame(autoRotate)
      }
      animationFrameRef.current = requestAnimationFrame(autoRotate)
      return () => {
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
      }
    }, [isPaused, autoRotateSpeed])

    const navigate = (dir: 'prev' | 'next') => {
      setIsPaused(true)
      setRotation((prev) => prev + (dir === 'next' ? -anglePerItem : anglePerItem))
      if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current)
      pauseTimerRef.current = setTimeout(() => setIsPaused(false), 2500)
    }

    return (
      <div
        ref={ref}
        role="region"
        aria-label="Circular Gallery"
        className={cn('relative w-full h-full flex items-center justify-center', className)}
        style={{ perspective: '2000px' }}
        {...props}
      >
        <div
          className="relative w-full h-full"
          style={{ transform: `rotateY(${rotation}deg)`, transformStyle: 'preserve-3d' }}
        >
          {items.map((item, i) => {
            const itemAngle = i * anglePerItem
            const totalRotation = rotation % 360
            const relativeAngle = (itemAngle + totalRotation + 360) % 360
            const normalizedAngle = Math.abs(relativeAngle > 180 ? 360 - relativeAngle : relativeAngle)
            const opacity = Math.max(0.2, 1 - normalizedAngle / 170)
            const isFront = normalizedAngle < 45

            return (
              <div
                key={item.id}
                className="absolute w-[280px] h-[360px]"
                style={{
                  transform: `rotateY(${itemAngle}deg) translateZ(${radius}px)`,
                  left: '50%',
                  top: '50%',
                  marginLeft: '-140px',
                  marginTop: '-180px',
                  opacity,
                  transition: 'opacity 0.3s linear',
                }}
              >
                <div
                  className="relative w-full h-full rounded-2xl border bg-card p-7 flex flex-col gap-4 shadow-sm"
                  style={{
                    borderColor: isFront ? 'hsl(var(--foreground) / 0.2)' : 'hsl(var(--border))',
                  }}
                >
                  {/* Diagram */}
                  {item.diagram && (
                    <div className="flex items-center justify-center h-[88px] rounded-xl bg-muted/60 flex-shrink-0">
                      {item.diagram}
                    </div>
                  )}

                  {/* Stat */}
                  <p
                    className="font-mono text-[11px] font-bold uppercase tracking-[0.1em] text-muted-foreground/60"
                  >
                    {item.stat}
                  </p>

                  {/* Title */}
                  <h3 className="text-[18px] font-bold tracking-tight text-foreground leading-tight">
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="text-[13px] leading-relaxed text-muted-foreground flex-1">
                    {item.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Navigation */}
        <button
          onClick={() => navigate('prev')}
          className="absolute left-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-foreground text-background shadow-lg hover:opacity-80 transition-opacity"
          aria-label="Précédent"
        >
          <ChevronLeft size={18} strokeWidth={2} />
        </button>
        <button
          onClick={() => navigate('next')}
          className="absolute right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-foreground text-background shadow-lg hover:opacity-80 transition-opacity"
          aria-label="Suivant"
        >
          <ChevronRight size={18} strokeWidth={2} />
        </button>
      </div>
    )
  }
)

CircularGallery.displayName = 'CircularGallery'
export { CircularGallery }
