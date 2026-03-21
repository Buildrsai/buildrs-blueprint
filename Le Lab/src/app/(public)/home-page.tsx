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
      "Claude analyse le marché, repère les concurrents, évalue le potentiel réel. Tu obtiens un score /100 et une décision claire.",
  },
  {
    icon: Code2,
    label: 'Étape 2',
    title: 'Prépare ton kit Claude Code sur-mesure',
    description:
      "Le Lab génère ton CLAUDE.md, tes prompts et tes Skills personnalisés. Rien de générique — tout est calé sur ton projet.",
  },
  {
    icon: Zap,
    label: 'Étape 3',
    title: 'Build guidé, sans te perdre',
    description:
      "Des prompts testés à copier dans Claude Code. Chaque étape expliquée, chaque erreur anticipée avant qu'elle arrive.",
  },
  {
    icon: Rocket,
    label: 'Étape 4',
    title: 'Lance ton SaaS, pour de vrai',
    description:
      "Déploiement Vercel, Stripe connecté, premiers utilisateurs. Le Lab t'accompagne jusqu'au bout — pas juste jusqu'au code.",
  },
]

const PHASES = [
  { number: 1, name: 'Idée & Validation',  icon: Lightbulb  },
  { number: 2, name: 'Structure Produit',   icon: LayoutGrid },
  { number: 3, name: 'Branding & Design',   icon: Palette    },
  { number: 4, name: 'Kit Claude Code',     icon: Wrench     },
  { number: 5, name: 'Installation Guidée', icon: Settings   },
  { number: 6, name: 'Build Guidé',         icon: Hammer     },
  { number: 7, name: 'Déploiement',         icon: Globe      },
  { number: 8, name: 'Lancement',           icon: Megaphone  },
]

// Sous-composant PhaseCard — évite d'appeler un hook dans une boucle
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

// Sous-composant FeatureRow — même raison
function FeatureRow({ feature, index }: { feature: typeof FEATURES[0]; index: number }) {
  const ref = useScrollReveal<HTMLDivElement>({ delay: 0 })
  const { icon: Icon, label, title, description } = feature
  const isReversed = index % 2 === 1

  return (
    <div
      ref={ref}
      className={`grid grid-cols-1 md:grid-cols-2 gap-12 items-center ${
        isReversed ? 'md:[&>*:first-child]:order-2' : ''
      }`}
    >
      {/* Texte */}
      <div className="flex flex-col gap-4">
        <p className="text-[11px] font-semibold text-[#3279F9] tracking-widest uppercase">
          {label}
        </p>
        <h3
          className="text-[#121317]"
          style={{
            fontSize: 'clamp(24px, 3vw, 36px)',
            fontWeight: 400,
            letterSpacing: '-0.02em',
            lineHeight: 1.15,
          }}
        >
          {title}
        </h3>
        <p className="text-[#45474D] leading-relaxed">{description}</p>
      </div>

      {/* Visuel — placeholder produit */}
      <div className="bg-[#EFF2F7] rounded-2xl p-8 flex items-center justify-center min-h-[200px] border border-transparent transition-all duration-200 hover:border-[#3279F9] hover:shadow-[0_0_0_3px_rgba(50,121,249,0.12)]">
        <div className="flex flex-col items-center gap-3">
          <Icon size={32} strokeWidth={1} className="text-[#3279F9] opacity-30" />
          <p className="text-xs text-[#B2BBC5]">Aperçu produit — bientôt disponible</p>
        </div>
      </div>
    </div>
  )
}

// Hook parallax hero
function useParallax() {
  const headlineRef  = useRef<HTMLDivElement>(null)
  const particlesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
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

  const phasesHeadingRef   = useScrollReveal<HTMLDivElement>()
  const featuresHeadingRef = useScrollReveal<HTMLDivElement>()
  const ctaRef             = useScrollReveal<HTMLDivElement>()

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
        {/* Couche particules avec parallax */}
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
            De l'idée au SaaS
            <br />
            <span className="text-gradient-blue">sans savoir coder.</span>
            {/* Blinking cursor bleu */}
            <span
              className="inline-block align-middle ml-1.5 bg-[#3279F9] rounded-[1px]"
              style={{
                width: '3px',
                height: '0.82em',
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
              style={{
                fontSize: 'clamp(32px, 4vw, 54px)',
                fontWeight: 400,
                letterSpacing: '-0.02em',
              }}
            >
              8 phases. Un SaaS en ligne.
            </h2>
            <p className="text-[#45474D] max-w-md">
              Chaque phase est guidée, personnalisée à ton projet.
              Tu avances à ton rythme, sans jamais être bloqué.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {PHASES.map((phase, i) => (
              <PhaseCard key={phase.number} phase={phase} delay={(i % 4) * 80} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Features — 2-col alternées avec scroll-reveal ─────────── */}
      <section className="bg-[#F8F9FC] py-24">
        <div className="max-w-[1200px] mx-auto px-6">
          <div
            ref={featuresHeadingRef}
            className="flex flex-col items-center text-center gap-3 mb-20"
          >
            <Badge variant="neutral">Pourquoi Buildrs Lab</Badge>
            <h2
              className="text-[#121317] max-w-2xl"
              style={{
                fontSize: 'clamp(32px, 4vw, 54px)',
                fontWeight: 400,
                letterSpacing: '-0.02em',
              }}
            >
              Tout ce dont tu as besoin, dans l'ordre
            </h2>
          </div>

          <div className="flex flex-col gap-24">
            {FEATURES.map((feature, i) => (
              <FeatureRow key={feature.title} feature={feature} index={i} />
            ))}
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
            style={{
              fontSize: 'clamp(40px, 6vw, 72px)',
              fontWeight: 450,
              letterSpacing: '-0.03em',
              lineHeight: 1.05,
            }}
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
