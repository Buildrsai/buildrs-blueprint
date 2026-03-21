import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

interface Rect {
  x: number
  y: number
  vy: number
  vx: number
  rotation: number
  rotSpeed: number
  color: string
  opacity: number
  opacityDir: number
}

interface ParticlesBackgroundProps {
  /** 'light' : rectangles multicolores sur fond clair (bleu + violet + gris) */
  /** 'dark'  : rectangles bleus qui montent (anti-gravité) */
  mode?: 'light' | 'dark'
  count?: number
  className?: string
}

// Couleurs LIGHT : bleu (30%) + violet (25%) + gris (45%)
const LIGHT_COLORS = [
  '#3279F9', '#3279F9', '#3279F9',
  '#7B6EF6', '#7B6EF6',
  '#CDD4DC', '#CDD4DC', '#CDD4DC', '#CDD4DC',
]

const W = 2 // largeur rectangle px
const H = 7 // hauteur rectangle px

function ParticlesBackground({ mode = 'light', count = 60, className }: ParticlesBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef   = useRef<number>(0)
  const rectsRef  = useRef<Rect[]>([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const initRects = () => {
      rectsRef.current = Array.from({ length: count }, () => {
        const color =
          mode === 'dark'
            ? '#3279F9'
            : LIGHT_COLORS[Math.floor(Math.random() * LIGHT_COLORS.length)]

        return {
          x:          Math.random() * canvas.width,
          y:          Math.random() * canvas.height,
          // DARK : remonte (vitesse négative) — LIGHT : dérive lente
          vy:         mode === 'dark'
                        ? -(Math.random() * 0.5 + 0.3)
                        : (Math.random() - 0.5) * 0.2,
          vx:         (Math.random() - 0.5) * 0.15,
          rotation:   Math.random() * Math.PI * 2,
          rotSpeed:   (Math.random() - 0.5) * 0.005,
          color,
          opacity:    Math.random() * 0.5 + 0.15,
          opacityDir: Math.random() > 0.5 ? 1 : -1,
        }
      })
    }

    const resize = () => {
      canvas.width  = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      initRects()
    }

    resize()
    window.addEventListener('resize', resize)

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (const r of rectsRef.current) {
        r.x        += r.vx
        r.y        += r.vy
        r.rotation += r.rotSpeed

        // Wrap horizontal
        if (r.x < -10) r.x = canvas.width  + 10
        if (r.x > canvas.width  + 10) r.x  = -10

        // DARK : réapparition depuis le bas — LIGHT : wrap vertical
        if (mode === 'dark') {
          if (r.y < -10) {
            r.y = canvas.height + 10
            r.x = Math.random() * canvas.width
          }
        } else {
          if (r.y < -10) r.y = canvas.height + 10
          if (r.y > canvas.height + 10) r.y = -10
        }

        // Pulsation d'opacité
        r.opacity += r.opacityDir * 0.0015
        if (r.opacity > 0.65) { r.opacity = 0.65; r.opacityDir = -1 }
        if (r.opacity < 0.08) { r.opacity = 0.08; r.opacityDir =  1 }

        // Dessin rectangle centré avec rotation
        ctx.save()
        ctx.translate(r.x, r.y)
        ctx.rotate(r.rotation)
        ctx.globalAlpha = r.opacity
        ctx.fillStyle   = r.color
        ctx.beginPath()
        ctx.roundRect(-W / 2, -H / 2, W, H, 1)
        ctx.fill()

        // Halo glow DARK uniquement
        if (mode === 'dark') {
          const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, 12)
          grad.addColorStop(0, `rgba(50,121,249,${r.opacity * 0.35})`)
          grad.addColorStop(1, 'rgba(50,121,249,0)')
          ctx.globalAlpha = 1
          ctx.fillStyle   = grad
          ctx.beginPath()
          ctx.arc(0, 0, 12, 0, Math.PI * 2)
          ctx.fill()
        }

        ctx.restore()
      }

      ctx.globalAlpha = 1
      animRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [count, mode])

  return (
    <canvas
      ref={canvasRef}
      className={cn('absolute inset-0 w-full h-full pointer-events-none', className)}
      aria-hidden="true"
    />
  )
}

export { ParticlesBackground }
