import { useEffect, useRef } from 'react'

interface UseScrollRevealOptions {
  /** Délai avant l'animation en ms — pour les effets cascade dans une grille */
  delay?: number
  /** Fraction du composant visible avant déclenchement (0-1) */
  threshold?: number
}

/**
 * Hook IntersectionObserver pour les animations scroll-reveal.
 * Applique `.reveal-hidden` à l'init, puis `.reveal-visible` dès que
 * l'élément entre dans le viewport.
 *
 * Usage :
 *   const ref = useScrollReveal<HTMLDivElement>({ delay: 100 })
 *   <div ref={ref} className="reveal-hidden">...</div>
 */
function useScrollReveal<T extends HTMLElement = HTMLElement>({
  delay = 0,
  threshold = 0.1,
}: UseScrollRevealOptions = {}) {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    el.classList.add('reveal-hidden')
    if (delay > 0) {
      el.style.transitionDelay = `${delay}ms`
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.remove('reveal-hidden')
          el.classList.add('reveal-visible')
          observer.disconnect()
        }
      },
      { threshold },
    )

    observer.observe(el)

    return () => observer.disconnect()
  }, [delay, threshold])

  return ref
}

export { useScrollReveal }
