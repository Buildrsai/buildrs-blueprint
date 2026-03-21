import { Link } from 'react-router'
import { Check, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const PLANS = [
  {
    name: 'Finder',
    price: 'Gratuit',
    description: 'Explore et valide des idées de SaaS sans engagement.',
    cta: 'Essayer gratuitement',
    href: '/finder',
    variant: 'secondary' as const,
    features: [
      '3 modes de recherche',
      'Score de viabilité /100',
      'Analyse concurrentielle',
      'Sources vérifiées',
      'Email requis pour sauvegarder',
    ],
    highlight: false,
  },
  {
    name: 'Buildrs Lab',
    price: '297€',
    priceNote: 'accès complet · 1 projet',
    description: "De l'idée à ton SaaS en ligne. Tout compris, guidé étape par étape.",
    cta: 'Démarrer le Lab',
    href: '/signup',
    variant: 'primary' as const,
    features: [
      '8 phases complètes',
      'Validation marché IA',
      'Structure produit personnalisée',
      'Branding & design system',
      'Kit Claude Code complet',
      'Build guidé (prompts testés)',
      'Guide déploiement Vercel',
      'Templates de lancement',
      'Buildrs Club inclus',
    ],
    highlight: true,
    badge: 'Recommandé',
  },
  {
    name: 'Lab Pro',
    price: '97€',
    priceNote: 'par mois · projets illimités',
    description: 'Pour les builders sérieux. Projets illimités, mises à jour continues.',
    cta: 'Choisir Lab Pro',
    href: '/signup?plan=pro',
    variant: 'secondary' as const,
    features: [
      'Tout du Lab standard',
      'Projets illimités',
      'Mises à jour des prompts',
      'Support prioritaire',
      'Accès aux nouvelles phases',
    ],
    highlight: false,
  },
]

function PricingPage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="dot-grid py-20 border-b border-[#E6EAF0]">
        <div className="max-w-[800px] mx-auto px-6 flex flex-col items-center text-center gap-5">
          <Badge variant="neutral">Tarifs</Badge>
          <h1
            className="text-[#121317]"
            style={{ fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 450, letterSpacing: '-0.03em', lineHeight: 1.05 }}
          >
            Investis dans ton SaaS,
            <br />
            <span className="text-gradient-blue">pas dans des formations.</span>
          </h1>
          <p className="text-[#45474D] text-lg max-w-md">
            Paiement unique. Accès immédiat. Pas d'abonnement caché.
          </p>
        </div>
      </section>

      {/* Plans */}
      <section className="dot-grid py-16">
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
            {PLANS.map((plan) => (
              <Card
                key={plan.name}
                variant={plan.highlight ? 'white' : 'light'}
                padding="lg"
                className={`flex flex-col gap-6 ${
                  plan.highlight
                    ? 'border-[#121317] ring-1 ring-[#121317]/10 scale-[1.02]'
                    : ''
                }`}
              >
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#45474D]">{plan.name}</span>
                    {plan.badge && <Badge variant="dark">{plan.badge}</Badge>}
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span
                      className="text-[#121317]"
                      style={{ fontSize: '2rem', fontWeight: 500, letterSpacing: '-0.03em' }}
                    >
                      {plan.price}
                    </span>
                  </div>
                  {plan.priceNote && (
                    <span className="text-xs text-[#B2BBC5]">{plan.priceNote}</span>
                  )}
                  <p className="text-sm text-[#45474D] leading-relaxed">{plan.description}</p>
                </div>

                <Link to={plan.href}>
                  <Button variant={plan.variant} fullWidth className="gap-1.5">
                    {plan.cta} <ArrowRight size={13} />
                  </Button>
                </Link>

                <ul className="flex flex-col gap-2.5">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5">
                      <Check size={13} className="text-[#3279F9] flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                      <span className="text-sm text-[#45474D]">{feature}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export { PricingPage }
