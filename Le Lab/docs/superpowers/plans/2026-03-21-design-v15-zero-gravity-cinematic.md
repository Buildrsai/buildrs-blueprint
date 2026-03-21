# Design V1.5 — Zero-Gravity Cinematic

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrader le design de Buildrs Lab pour se rapprocher de l'esthétique Google Antigravity — particules rectangulaires, blinking cursor, dot grid, tool strip, scroll-reveal, feature sections 2-col, parallax et mesh gradient.

**Architecture:** Toutes les modifications sont purement frontend (Canvas API, CSS, React hooks). Aucune dépendance backend. Le design system existant (tokens couleur, typographie Inter, composants) n'est pas modifié — on ajoute des effets par-dessus.

**Tech Stack:** React 19, TypeScript strict, Tailwind CSS v4, Canvas API, IntersectionObserver API, requestAnimationFrame — pas de nouvelles dépendances npm.

---

## Fichiers impactés

| Action | Fichier | Responsabilité |
|--------|---------|----------------|
| Modifier | `src/styles/globals.css` | Ajouter `@keyframes blink` + classes `.reveal-hidden`/`.reveal-visible` + `.dot-grid` |
| Réécrire | `src/components/ui/particles-background.tsx` | Rectangles 2×7px, multicolore LIGHT, drift upward DARK |
| Créer | `src/components/ui/tool-strip.tsx` | Strip de chips outils en défilement infini |
| Créer | `src/hooks/use-scroll-reveal.ts` | Hook IntersectionObserver réutilisable |
| Modifier | `src/app/(public)/home-page.tsx` | Cursor + tool strip + scroll-reveal + 2-col features + parallax + suppr. emojis |
| Modifier | `src/app/(public)/pricing-page.tsx` | Dot grid en fond de section |

---

## Chunk 1 : CSS de base + animations globales

### Task 1 : Ajouter les keyframes et utilitaires dans `globals.css`

**Files:**
- Modify: `src/styles/globals.css`

- [ ] **Step 1 : Ajouter `@keyframes blink` et classes reveal**

Ajouter à la fin de `src/styles/globals.css`, après le bloc `@layer utilities` existant :

```css
/* ─── Keyframes ──────────────────────────────────────────────────────────── */
@keyframes blink {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0; }
}

/* ─── Scroll-reveal ──────────────────────────────────────────────────────── */
@layer utilities {
  .reveal-hidden {
    opacity: 0;
    transform: translateY(20px);
  }

  .reveal-visible {
    opacity: 1;
    transform: translateY(0);
    transition:
      opacity 300ms cubic-bezier(.25, .46, .45, .94),
      transform 300ms cubic-bezier(.25, .46, .45, .94);
  }

  /* Dot grid — section pricing */
  .dot-grid {
    background-image: radial-gradient(#CDD4DC 1px, transparent 1px);
    background-size: 20px 20px;
    background-color: #F8F9FC;
  }
}
```

- [ ] **Step 2 : Vérifier que le dev server ne plante pas**

```bash
cd "/Users/alfredorsini/CLAUDE/Le Lab" && npm run dev
```

Résultat attendu : serveur sur http://localhost:5173 sans erreurs de compilation.

- [ ] **Step 3 : Commit**

```bash
cd "/Users/alfredorsini/CLAUDE/Le Lab"
git add src/styles/globals.css
git commit -m "style(globals): ajout keyframes blink, classes reveal et dot-grid"
```

---

## Chunk 2 : Particules rectangulaires

### Task 2 : Réécriture de `particles-background.tsx`

**Files:**
- Modify: `src/components/ui/particles-background.tsx`

**Logique :**
- LIGHT : rectangles 2×7px en 3 couleurs (`#3279F9` 30%, `#7B6EF6` 25%, `#CDD4DC` 45%), rotation aléatoire, drift flottant lent
- DARK : rectangles `#3279F9` avec glow, drift vers le HAUT (anti-gravité), réapparition depuis le bas

- [ ] **Step 1 : Réécrire le composant complet**

Remplacer entièrement `src/components/ui/particles-background.tsx` :

```tsx
import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

interface Rect {
  x: number
  y: number
  vy: number        // vitesse verticale (negative = monte)
  vx: number        // légère dérive horizontale
  rotation: number  // angle en radians
  rotSpeed: number  // vitesse de rotation lente
  color: string
  opacity: number
  opacityDir: number
}

interface ParticlesBackgroundProps {
  mode?: 'light' | 'dark'
  count?: number
  className?: string
}

// Couleurs LIGHT : bleu (30%) + violet (25%) + gris (45%)
const LIGHT_COLORS = [
  '#3279F9', '#3279F9', '#3279F9',   // 30%
  '#7B6EF6', '#7B6EF6',              // 25%
  '#CDD4DC', '#CDD4DC', '#CDD4DC', '#CDD4DC', // 45%
]

function ParticlesBackground({ mode = 'light', count = 60, className }: ParticlesBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef   = useRef<number>(0)
  const rectsRef  = useRef<Rect[]>([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width  = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      initRects()
    }

    const initRects = () => {
      rectsRef.current = Array.from({ length: count }, () => {
        const color =
          mode === 'dark'
            ? '#3279F9'
            : LIGHT_COLORS[Math.floor(Math.random() * LIGHT_COLORS.length)]

        return {
          x:          Math.random() * canvas.width,
          // DARK : démarre à des positions Y aléatoires pour décalage initial
          y:          mode === 'dark'
                        ? Math.random() * canvas.height
                        : Math.random() * canvas.height,
          // DARK : remonte — vitesse négative (0.3 à 0.8 px/frame)
          // LIGHT : dérive très lente (±0.2 px/frame)
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

    resize()
    window.addEventListener('resize', resize)

    const W = 2  // largeur rectangle
    const H = 7  // hauteur rectangle

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (const r of rectsRef.current) {
        // Déplacement
        r.x        += r.vx
        r.y        += r.vy
        r.rotation += r.rotSpeed

        // Wrap horizontal (toujours)
        if (r.x < -10) r.x = canvas.width  + 10
        if (r.x > canvas.width  + 10) r.x = -10

        // DARK : réapparition depuis le bas quand sort par le haut
        // LIGHT : wrap vertical classique
        if (mode === 'dark') {
          if (r.y < -10) {
            r.y = canvas.height + 10
            r.x = Math.random() * canvas.width
          }
        } else {
          if (r.y < -10) r.y = canvas.height + 10
          if (r.y > canvas.height + 10) r.y = -10
        }

        // Pulsation d'opacité douce
        r.opacity += r.opacityDir * 0.0015
        if (r.opacity > 0.65) { r.opacity = 0.65; r.opacityDir = -1 }
        if (r.opacity < 0.08) { r.opacity = 0.08; r.opacityDir =  1 }

        // Dessin du rectangle centré avec rotation
        ctx.save()
        ctx.translate(r.x, r.y)
        ctx.rotate(r.rotation)
        ctx.globalAlpha  = r.opacity
        ctx.fillStyle    = r.color
        ctx.beginPath()
        ctx.roundRect(-W / 2, -H / 2, W, H, 1)
        ctx.fill()

        // Halo glow sur particules DARK uniquement
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
```

- [ ] **Step 2 : Vérifier visuellement**

Ouvrir http://localhost:5173 — le hero doit afficher des mini-rectangles colorés (bleu + violet + gris) qui dérivent lentement. La section CTA dark doit avoir des rectangles bleus qui montent.

- [ ] **Step 3 : Commit**

```bash
cd "/Users/alfredorsini/CLAUDE/Le Lab"
git add src/components/ui/particles-background.tsx
git commit -m "feat(particles): rectangles 2x7px multicolore LIGHT, drift upward DARK"
```

---

## Chunk 3 : Tool Strip

### Task 3 : Créer `tool-strip.tsx`

**Files:**
- Create: `src/components/ui/tool-strip.tsx`

- [ ] **Step 1 : Créer le composant**

```tsx
import { cn } from '@/lib/utils'

interface Tool {
  name: string
  color: string
}

const TOOLS: Tool[] = [
  { name: 'Claude AI',      color: '#D97706' },
  { name: 'Claude Code',    color: '#3279F9' },
  { name: 'Supabase',       color: '#22C55E' },
  { name: 'Vercel',         color: '#121317' },
  { name: 'GitHub',         color: '#6366F1' },
  { name: 'Stripe',         color: '#6772E5' },
  { name: 'Resend',         color: '#121317' },
  { name: 'Framer Motion',  color: '#E11D48' },
  { name: 'Magic UI',       color: '#7C3AED' },
  { name: 'PostHog',        color: '#F59E0B' },
  { name: 'Cloudflare',     color: '#F97316' },
  { name: 'shadcn/ui',      color: '#45474D' },
]

interface ToolStripProps {
  className?: string
}

function ToolStrip({ className }: ToolStripProps) {
  // Dupliquer pour boucle seamless
  const doubled = [...TOOLS, ...TOOLS]

  return (
    <div
      className={cn(
        'w-full overflow-hidden border-y border-[#E6EAF0] bg-white py-4',
        className,
      )}
    >
      {/* Masques de fondu gauche/droite */}
      <div className="relative">
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-16 bg-gradient-to-r from-white to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-16 bg-gradient-to-l from-white to-transparent" />

        <div
          className="flex w-max gap-3 [animation:tool-scroll_28s_linear_infinite] hover:[animation-play-state:paused]"
        >
          {doubled.map((tool, i) => (
            <div
              key={`${tool.name}-${i}`}
              className="flex items-center gap-2 rounded-full border border-[#E6EAF0] bg-[#F8F9FC] px-3.5 py-1.5 text-xs font-medium text-[#45474D] whitespace-nowrap"
            >
              <span
                className="h-2 w-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: tool.color }}
              />
              {tool.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export { ToolStrip }
```

- [ ] **Step 2 : Ajouter l'animation `tool-scroll` dans `globals.css`**

Ajouter dans le bloc `@layer utilities` existant de `globals.css` :

```css
  /* Tool strip scroll infini */
  @keyframes tool-scroll {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }
```

Note : Tailwind v4 permet de référencer des keyframes custom dans les classes arbitraires `[animation:...]`.

- [ ] **Step 3 : Commit**

```bash
cd "/Users/alfredorsini/CLAUDE/Le Lab"
git add src/components/ui/tool-strip.tsx src/styles/globals.css
git commit -m "feat(ui): ajout composant ToolStrip défilement infini"
```

---

## Chunk 4 : Hook Scroll-Reveal

### Task 4 : Créer `use-scroll-reveal.ts`

**Files:**
- Create: `src/hooks/use-scroll-reveal.ts`

- [ ] **Step 1 : Créer le dossier et le hook**

```bash
mkdir -p "/Users/alfredorsini/CLAUDE/Le Lab/src/hooks"
```

Créer `src/hooks/use-scroll-reveal.ts` :

```ts
import { useEffect, useRef } from 'react'

interface UseScrollRevealOptions {
  /** Délai avant l'animation, en ms — pour les effets cascade */
  delay?: number
  /** Fraction du composant visible avant déclenchement (0-1) */
  threshold?: number
}

/**
 * Hook IntersectionObserver pour les animations scroll-reveal.
 * Ajoute la classe CSS `.reveal-hidden` à l'init, puis `.reveal-visible`
 * dès que l'élément entre dans le viewport.
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

    // Appliquer l'état initial caché
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
```

- [ ] **Step 2 : Vérifier TypeScript**

```bash
cd "/Users/alfredorsini/CLAUDE/Le Lab" && npx tsc --noEmit
```

Résultat attendu : aucune erreur TypeScript.

- [ ] **Step 3 : Commit**

```bash
cd "/Users/alfredorsini/CLAUDE/Le Lab"
git add src/hooks/use-scroll-reveal.ts
git commit -m "feat(hooks): ajout useScrollReveal avec IntersectionObserver"
```

---

## Chunk 5 : home-page.tsx — Toutes les upgrades

### Task 5 : Mettre à jour `home-page.tsx`

**Files:**
- Modify: `src/app/(public)/home-page.tsx`

**Changements à appliquer :**
1. Supprimer les emojis des PHASES — remplacer par des icônes Lucide React
2. Ajouter le blinking cursor sur le H1
3. Insérer le `<ToolStrip />` entre hero et section phases
4. Restructurer les features en 2-col avec scroll-reveal
5. Ajouter le mesh gradient + parallax sur le hero

- [ ] **Step 1 : Réécrire `home-page.tsx` complet**

```tsx
import { useEffect, useRef } from 'react'
import { Link } from 'react-router'
import {
  ArrowRight,
  Zap,
  Target,
  Code2,
  Rocket,
  Lightbulb,
  LayoutGrid,
  Palette,
  Wrench,
  Settings,
  Hammer,
  Globe,
  Megaphone,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ParticlesBackground } from '@/components/ui/particles-background'
import { ToolStrip } from '@/components/ui/tool-strip'
import { useScrollReveal } from '@/hooks/use-scroll-reveal'

const FEATURES = [
  {
    icon: Target,
    label: 'Étape 1',
    title: 'Valide ton idée avec de vraies données',
    description:
      'Claude analyse le marché, repère les concurrents, évalue le potentiel réel. Tu obtiens un score /100 et une décision claire.',
  },
  {
    icon: Code2,
    label: 'Étape 2',
    title: 'Prépare ton kit Claude Code sur-mesure',
    description:
      'Le Lab génère ton CLAUDE.md, tes prompts et tes Skills personnalisés. Rien de générique — tout est calé sur ton projet.',
  },
  {
    icon: Zap,
    label: 'Étape 3',
    title: 'Build guidé, sans te perdre',
    description:
      'Des prompts testés à copier dans Claude Code. Chaque étape expliquée, chaque erreur anticipée avant qu\'elle arrive.',
  },
  {
    icon: Rocket,
    label: 'Étape 4',
    title: 'Lance ton SaaS, pour de vrai',
    description:
      'Déploiement Vercel, Stripe connecté, premiers utilisateurs. Le Lab t\'accompagne jusqu\'au bout — pas juste jusqu\'au code.',
  },
]

const PHASES = [
  { number: 1, name: 'Idée & Validation',   icon: Lightbulb  },
  { number: 2, name: 'Structure Produit',    icon: LayoutGrid },
  { number: 3, name: 'Branding & Design',    icon: Palette    },
  { number: 4, name: 'Kit Claude Code',      icon: Wrench     },
  { number: 5, name: 'Installation Guidée',  icon: Settings   },
  { number: 6, name: 'Build Guidé',          icon: Hammer     },
  { number: 7, name: 'Déploiement',          icon: Globe      },
  { number: 8, name: 'Lancement',            icon: Megaphone  },
]

// Hook parallax hero
function useParallax() {
  const headlineRef = useRef<HTMLDivElement>(null)
  const particlesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Désactiver si l'utilisateur préfère moins de mouvement
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced || window.innerWidth < 768) return

    let rafId: number

    const onScroll = () => {
      rafId = requestAnimationFrame(() => {
        const y = window.scrollY
        if (headlineRef.current) {
          headlineRef.current.style.transform = `translateY(${y * 0.08}px)`
        }
        if (particlesRef.current) {
          particlesRef.current.style.transform = `translateY(${y * 0.2}px)`
        }
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return { headlineRef, particlesRef }
}

function HomePage() {
  const { headlineRef, particlesRef } = useParallax()

  // Scroll-reveal refs pour les sections
  const phasesHeadingRef  = useScrollReveal<HTMLDivElement>({ delay: 0   })
  const featuresHeadingRef = useScrollReveal<HTMLDivElement>({ delay: 0  })
  const ctaRef            = useScrollReveal<HTMLDivElement>({ delay: 0   })

  return (
    <div className="flex flex-col">

      {/* ── Hero LIGHT — mesh gradient + particules + parallax ─────── */}
      <section
        className="relative min-h-[88vh] flex items-center overflow-hidden"
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 50% -5%, rgba(50,121,249,0.06) 0%, transparent 70%), #F8F9FC',
        }}
      >
        {/* Particules avec couche parallax */}
        <div ref={particlesRef} className="absolute inset-0">
          <ParticlesBackground mode="light" count={65} />
        </div>

        <div
          ref={headlineRef}
          className="relative max-w-[1200px] mx-auto px-6 py-24 flex flex-col items-center text-center gap-8 w-full"
        >
          <Badge variant="neutral">Buildrs Lab · Beta</Badge>

          <h1
            className="text-[#121317] max-w-3xl"
            style={{
              fontSize: 'clamp(48px, 7vw, 80px)',
              fontWeight: 450,
              lineHeight: 1.05,
              letterSpacing: '-0.03em',
            }}
          >
            De l'idée au SaaS{' '}
            <br />
            <span className="text-gradient-blue">sans savoir coder.</span>
            {/* Blinking cursor bleu */}
            <span
              className="inline-block align-middle ml-1.5 bg-[#3279F9]"
              style={{
                width: '3px',
                height: '0.82em',
                borderRadius: '1px',
                animation: 'blink 1s step-end infinite',
              }}
              aria-hidden="true"
            />
          </h1>

          <p
            className="text-[18px] text-[#45474D] leading-relaxed max-w-xl"
            style={{ letterSpacing: '-0.01em' }}
          >
            Buildrs Lab est ton associé IA. Il valide ton idée, structure ton produit,
            prépare tout pour Claude Code, et te guide jusqu'au lancement.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <Link to="/signup">
              <Button variant="primary" size="lg" className="gap-2">
                Commencer gratuitement
                <ArrowRight size={15} />
              </Button>
            </Link>
            <Link to="/finder">
              <Button variant="secondary" size="lg">
                Essayer le Finder
              </Button>
            </Link>
          </div>

          <p className="text-sm text-[#B2BBC5]">
            Le Finder est gratuit. Aucune carte de crédit requise.
          </p>
        </div>
      </section>

      {/* ── Tool Strip — défilement infini ────────────────────────── */}
      <ToolStrip />

      {/* ── Les 8 phases — fond blanc ─────────────────────────────── */}
      <section className="bg-white py-24">
        <div className="max-w-[1200px] mx-auto px-6">
          <div
            ref={phasesHeadingRef}
            className="flex flex-col items-center text-center gap-3 mb-16"
          >
            <Badge variant="neutral">Le parcours</Badge>
            <h2
              className="text-[#121317] max-w-lg"
              style={{ fontSize: 'clamp(32px, 4vw, 54px)', fontWeight: 400, letterSpacing: '-0.02em' }}
            >
              8 phases. Un SaaS en ligne.
            </h2>
            <p className="text-[#45474D] max-w-md">
              Chaque phase est guidée, personnalisée à ton projet.
              Tu avances à ton rythme, sans jamais être bloqué.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {PHASES.map((phase, i) => {
              const PhaseRef = useScrollReveal<HTMLDivElement>({ delay: (i % 4) * 80 })
              const Icon = phase.icon
              return (
                <div key={phase.number} ref={PhaseRef}>
                  <Card variant="light" padding="md" hover className="flex flex-col gap-3 h-full">
                    <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center">
                      <Icon size={16} className="text-[#3279F9]" strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="text-[12.5px] text-[#B2BBC5]">Phase {phase.number}</p>
                      <p className="text-sm font-medium text-[#121317] leading-tight">{phase.name}</p>
                    </div>
                  </Card>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Features — 2-col alternées ────────────────────────────── */}
      <section className="bg-[#F8F9FC] py-24">
        <div className="max-w-[1200px] mx-auto px-6">
          <div
            ref={featuresHeadingRef}
            className="flex flex-col items-center text-center gap-3 mb-20"
          >
            <Badge variant="neutral">Pourquoi Buildrs Lab</Badge>
            <h2
              className="text-[#121317] max-w-2xl"
              style={{ fontSize: 'clamp(32px, 4vw, 54px)', fontWeight: 400, letterSpacing: '-0.02em' }}
            >
              Tout ce dont tu as besoin, dans l'ordre
            </h2>
          </div>

          <div className="flex flex-col gap-24">
            {FEATURES.map(({ icon: Icon, label, title, description }, i) => {
              const featureRef = useScrollReveal<HTMLDivElement>({ delay: 0 })
              const isReversed = i % 2 === 1

              return (
                <div
                  key={title}
                  ref={featureRef}
                  className={`grid grid-cols-1 md:grid-cols-2 gap-12 items-center ${isReversed ? 'md:[&>*:first-child]:order-2' : ''}`}
                >
                  {/* Texte */}
                  <div className="flex flex-col gap-4">
                    <p className="text-[11px] font-semibold text-[#3279F9] tracking-widest uppercase">
                      {label}
                    </p>
                    <h3
                      className="text-[#121317]"
                      style={{ fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 400, letterSpacing: '-0.02em', lineHeight: 1.15 }}
                    >
                      {title}
                    </h3>
                    <p className="text-[#45474D] leading-relaxed">
                      {description}
                    </p>
                  </div>

                  {/* Visuel — placeholder product mockup */}
                  <div
                    className="bg-[#EFF2F7] rounded-2xl p-8 flex items-center justify-center min-h-[200px] transition-all duration-200 hover:border-[#3279F9] hover:shadow-[0_0_0_3px_rgba(50,121,249,0.12)] border border-transparent"
                  >
                    <div className="flex flex-col items-center gap-3 text-[#B2BBC5]">
                      <Icon size={32} strokeWidth={1} className="text-[#3279F9] opacity-40" />
                      <p className="text-xs">Aperçu produit — bientôt disponible</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── CTA bas — section DARK pure avec particules bleues ───────── */}
      <section className="relative bg-[#000000] py-32 overflow-hidden">
        <ParticlesBackground mode="dark" count={45} />
        <div
          ref={ctaRef}
          className="relative max-w-[1200px] mx-auto px-6 flex flex-col items-center text-center gap-8"
        >
          <h2
            className="text-white max-w-2xl"
            style={{ fontSize: 'clamp(40px, 6vw, 72px)', fontWeight: 450, letterSpacing: '-0.03em', lineHeight: 1.05 }}
          >
            Tu as une idée.
            <br />
            <span className="text-[#3279F9]">Le Lab fait le reste.</span>
          </h2>
          <p className="text-[#B2BBC5] max-w-md text-lg">
            Rejoins des entrepreneurs qui construisent leur SaaS avec l'IA comme levier.
          </p>
          <Link to="/signup">
            <Button variant="accent" size="lg" className="gap-2">
              Démarrer maintenant
              <ArrowRight size={15} />
            </Button>
          </Link>
        </div>
      </section>

    </div>
  )
}

export { HomePage }
```

**Note importante :** L'utilisation de `useScrollReveal` dans une boucle `.map()` viole la règle des hooks React (les hooks doivent être appelés à la même position à chaque rendu). Il faut créer un sous-composant pour chaque carte. Voir Step 2.

- [ ] **Step 2 : Extraire les composants avec hooks en boucle**

React interdit les hooks dans les boucles. Créer deux mini sous-composants dans le même fichier, avant `HomePage` :

```tsx
// Sous-composant pour les phases (évite hook en boucle)
function PhaseCard({ phase, delay }: { phase: typeof PHASES[0]; delay: number }) {
  const ref = useScrollReveal<HTMLDivElement>({ delay })
  const Icon = phase.icon
  return (
    <div ref={ref}>
      <Card variant="light" padding="md" hover className="flex flex-col gap-3 h-full">
        <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center">
          <Icon size={16} className="text-[#3279F9]" strokeWidth={1.5} />
        </div>
        <div>
          <p className="text-[12.5px] text-[#B2BBC5]">Phase {phase.number}</p>
          <p className="text-sm font-medium text-[#121317] leading-tight">{phase.name}</p>
        </div>
      </Card>
    </div>
  )
}

// Sous-composant pour les features
function FeatureRow({ feature, index }: { feature: typeof FEATURES[0]; index: number }) {
  const ref = useScrollReveal<HTMLDivElement>({ delay: 0 })
  const { icon: Icon, label, title, description } = feature
  const isReversed = index % 2 === 1

  return (
    <div
      ref={ref}
      className={`grid grid-cols-1 md:grid-cols-2 gap-12 items-center ${isReversed ? 'md:[&>*:first-child]:order-2' : ''}`}
    >
      <div className="flex flex-col gap-4">
        <p className="text-[11px] font-semibold text-[#3279F9] tracking-widest uppercase">
          {label}
        </p>
        <h3
          className="text-[#121317]"
          style={{ fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 400, letterSpacing: '-0.02em', lineHeight: 1.15 }}
        >
          {title}
        </h3>
        <p className="text-[#45474D] leading-relaxed">{description}</p>
      </div>

      <div className="bg-[#EFF2F7] rounded-2xl p-8 flex items-center justify-center min-h-[200px] transition-all duration-200 hover:border-[#3279F9] hover:shadow-[0_0_0_3px_rgba(50,121,249,0.12)] border border-transparent">
        <div className="flex flex-col items-center gap-3">
          <Icon size={32} strokeWidth={1} className="text-[#3279F9] opacity-40" />
          <p className="text-xs text-[#B2BBC5]">Aperçu produit — bientôt disponible</p>
        </div>
      </div>
    </div>
  )
}
```

Puis dans `HomePage`, remplacer les `.map()` avec hooks par :

```tsx
// Dans la section phases :
{PHASES.map((phase, i) => (
  <PhaseCard key={phase.number} phase={phase} delay={(i % 4) * 80} />
))}

// Dans la section features :
{FEATURES.map((feature, i) => (
  <FeatureRow key={feature.title} feature={feature} index={i} />
))}
```

- [ ] **Step 3 : Vérifier TypeScript + visuellement**

```bash
cd "/Users/alfredorsini/CLAUDE/Le Lab" && npx tsc --noEmit
```

Ouvrir http://localhost:5173 et vérifier :
- Curseur bleu clignotant présent après "coder."
- Tool strip défile juste en dessous du hero
- Phases ont des icônes Lucide (plus d'emojis)
- Features en 2 colonnes, alternées
- Scroll-reveal : les éléments apparaissent en entrant dans le viewport
- Parallax : le headline bouge légèrement au scroll

- [ ] **Step 4 : Commit**

```bash
cd "/Users/alfredorsini/CLAUDE/Le Lab"
git add src/app/(public)/home-page.tsx
git commit -m "feat(home): cursor clignotant, tool strip, 2-col features, scroll-reveal, parallax, suppression emojis"
```

---

## Chunk 6 : Pricing — Dot Grid + suppression emojis

### Task 6 : Mettre à jour `pricing-page.tsx`

**Files:**
- Modify: `src/app/(public)/pricing-page.tsx`

- [ ] **Step 1 : Lire le fichier actuel**

```bash
cat "/Users/alfredorsini/CLAUDE/Le Lab/src/app/(public)/pricing-page.tsx"
```

- [ ] **Step 2 : Appliquer le dot grid sur la section wrapper**

Trouver la section/div racine de la page pricing et y appliquer la classe `dot-grid` :

```tsx
// Avant
<div className="min-h-screen bg-[#F8F9FC] py-24">

// Après
<div className="min-h-screen dot-grid py-24">
```

- [ ] **Step 3 : Supprimer les éventuels emojis**

Chercher et remplacer tous les emojis (✓, ✅, etc.) par des icônes Lucide. Utiliser `Check` de lucide-react :

```tsx
import { Check } from 'lucide-react'

// Avant
<span>✓ Fonctionnalité</span>

// Après
<span className="flex items-center gap-2">
  <Check size={14} className="text-[#22C55E]" strokeWidth={2} />
  Fonctionnalité
</span>
```

- [ ] **Step 4 : Vérifier visuellement**

Ouvrir http://localhost:5173/pricing — la grille de points doit être visible en fond (très subtile, couleur `#CDD4DC` sur fond `#F8F9FC`).

- [ ] **Step 5 : Vérifier TypeScript**

```bash
cd "/Users/alfredorsini/CLAUDE/Le Lab" && npx tsc --noEmit
```

- [ ] **Step 6 : Commit final**

```bash
cd "/Users/alfredorsini/CLAUDE/Le Lab"
git add src/app/(public)/pricing-page.tsx
git commit -m "feat(pricing): dot grid en fond, remplacement emojis par icônes Lucide"
```

---

## Chunk 7 : Vérification finale

### Task 7 : Recette complète V1.5

- [ ] **Step 1 : Build de production**

```bash
cd "/Users/alfredorsini/CLAUDE/Le Lab" && npm run build
```

Résultat attendu : build sans erreurs TypeScript ni warnings critiques.

- [ ] **Step 2 : Checklist visuelle**

Ouvrir http://localhost:5173 et vérifier chaque point :

| Élément | Attendu |
|---------|---------|
| Particules hero | Mini-rectangles colorés (bleu + violet + gris), drift lent |
| Particules CTA dark | Rectangles bleus qui montent vers le haut |
| Blinking cursor | Curseur bleu clignotant après "coder." |
| Tool strip | Défile en boucle, pause au hover, fondu gauche/droite |
| Phases | Icônes Lucide, aucun emoji |
| Features | 2 colonnes desktop, 1 colonne mobile, alternées |
| Scroll-reveal | Elements apparaissent en douceur à l'entrée viewport |
| Parallax | Headline bouge légèrement au scroll (desktop seulement) |
| Pricing | Dot grid visible en fond |
| Pricing | Aucun emoji — icônes Check vertes |

- [ ] **Step 3 : Vérifier `prefers-reduced-motion`**

Dans DevTools → Rendering → Emulate CSS media → `prefers-reduced-motion: reduce` → vérifier que le parallax est désactivé.

- [ ] **Step 4 : Vérifier mobile**

Dans DevTools → viewport mobile (375px) → vérifier que le parallax est désactivé et features en 1 colonne.

- [ ] **Step 5 : Commit de clôture**

```bash
cd "/Users/alfredorsini/CLAUDE/Le Lab"
git add -A
git commit -m "chore(v1.5): recette finale design Zero-Gravity Cinematic"
```
