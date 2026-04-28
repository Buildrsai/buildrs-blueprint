import { useState, useEffect, useRef } from "react"
import { Check, Shield, RefreshCw, Zap, Lock } from "lucide-react"
import { trackEvent } from '../lib/pixel'
import { loadStripe } from "@stripe/stripe-js"
import { StackedCircularFooter } from "./ui/stacked-circular-footer"
import { ClaudeIcon } from "./ui/icons"
import { BLUEPRINT_PRICE, CLAUDE_OS_BUMP_PRICE, ACQUISITION_BUMP_PRICE } from '../lib/pricing'
import { BuilderTierBadge } from './ui/builder-tier-badge'

const SUPABASE_FUNCTIONS_URL = 'https://ihgbbgwhgmosfjaknvlf.supabase.co/functions/v1'

interface CheckoutPageProps {
  hasOrderBump: boolean
  setHasOrderBump: (v: boolean) => void
  hasAgentsBump: boolean
  setHasAgentsBump: (v: boolean) => void
  hasAcquisitionBump: boolean
  setHasAcquisitionBump: (v: boolean) => void
  funnelSource: 'blueprint' | 'claude'
  onPay: () => void
  onBack: () => void
}

const BLUEPRINT_FEATURES = [
  "Le parcours 7 jours — de l'idée à ton SaaS en live, jour par jour",
  "7 vidéos guidées — une par jour, écran à l'appui (45-60 min)",
  "7 templates projet clonables — auth, paiement, dashboard, email",
  "7 prompts système prêts à l'emploi — testés sur 25+ SaaS actifs",
  "La stack préconfigurée — Supabase, Vercel, Stripe, Resend",
  "Accès à vie + mises à jour automatiques",
  "+ 3 bonus : Marketplace · 10 prompts de lancement · Bibliothèque Buildrs",
]

const CLAUDE_OS_FEATURES = [
  "Système Buildrs AI + Skills testés en production",
  "Système Buildrs Code + Sub-agents pré-configurés",
  "MCPs recommandés avec configurations",
  "Veille quotidienne Jarvis",
  "Banque d'inspiration",
  "Updates à vie",
]

function ExtensionCard({ checked, onToggle, name, price, badge, accroche, highlights, closing, icon }: {
  checked: boolean
  onToggle: () => void
  name: string
  price: string
  badge?: string
  accroche?: string
  highlights?: string[]
  closing?: string
  icon?: React.ReactNode
}) {
  return (
    <button
      onClick={onToggle}
      className="w-full text-left rounded-xl p-4 transition-all"
      style={{
        border: `1px solid ${checked ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.09)'}`,
        background: checked ? 'rgba(255,255,255,0.04)' : 'transparent',
        cursor: 'pointer',
      }}
    >
      {badge && (
        <div style={{ marginBottom: 10 }}>
          <span style={{
            display: 'inline-block', fontSize: 10, fontWeight: 700,
            letterSpacing: '0.07em', textTransform: 'uppercase' as const,
            color: '#09090b', background: '#ffffff',
            borderRadius: 4, padding: '3px 8px',
          }}>
            {badge}
          </span>
        </div>
      )}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: accroche || highlights ? 10 : 0 }}>
        <div style={{
          width: 20, height: 20, borderRadius: 4, flexShrink: 0,
          border: `1.5px solid ${checked ? '#fff' : 'rgba(255,255,255,0.3)'}`,
          background: checked ? '#fff' : 'transparent',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {checked && <Check size={11} strokeWidth={3} style={{ color: '#09090b' }} />}
        </div>
        <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>+</span>
        {icon && <span style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>{icon}</span>}
        <span style={{ flex: 1, fontSize: 14, fontWeight: 700, color: '#fff' }}>{name}</span>
        <span style={{ fontSize: 14, fontWeight: 700, color: '#fff', flexShrink: 0 }}>{price}</span>
      </div>
      {accroche && (
        <p style={{ fontSize: 12, lineHeight: 1.6, color: 'rgba(255,255,255,0.55)', paddingLeft: 30, marginBottom: highlights?.length ? 8 : 0 }}>
          {accroche}
        </p>
      )}
      {highlights && highlights.length > 0 && (
        <ul style={{ display: 'flex', flexDirection: 'column', gap: 4, paddingLeft: 30, marginBottom: closing ? 8 : 0 }}>
          {highlights.map((h) => (
            <li key={h} style={{ display: 'flex', alignItems: 'flex-start', gap: 7, fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>
              <Check size={11} strokeWidth={2} style={{ marginTop: 2, flexShrink: 0, color: 'rgba(255,255,255,0.45)' }} />
              {h}
            </li>
          ))}
        </ul>
      )}
      {closing && (
        <p style={{ fontSize: 11, lineHeight: 1.55, color: 'rgba(255,255,255,0.3)', paddingLeft: 30, fontStyle: 'italic' }}>
          {closing}
        </p>
      )}
    </button>
  )
}

export function CheckoutPage({
  hasOrderBump, setHasOrderBump,
  hasAgentsBump: _hasAgentsBump, setHasAgentsBump: _setHasAgentsBump,
  hasAcquisitionBump, setHasAcquisitionBump,
  funnelSource,
}: CheckoutPageProps) {
  const isClaudeFunnel = funnelSource === 'claude'
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showStripe, setShowStripe] = useState(false)
  const [stripeReady, setStripeReady] = useState(false)
  const mountRef = useRef<HTMLDivElement>(null)
  const checkoutRef = useRef<{ destroy: () => void } | null>(null)

  const basePrice = isClaudeFunnel ? 47 : BLUEPRINT_PRICE
  const ext1Price = isClaudeFunnel ? 27 : CLAUDE_OS_BUMP_PRICE
  const ext2Price = ACQUISITION_BUMP_PRICE

  const total = basePrice
    + (hasOrderBump ? ext1Price : 0)
    + (!isClaudeFunnel && hasAcquisitionBump ? ext2Price : 0)

  const productName = isClaudeFunnel ? "Buildrs OS Pack" : "Buildrs Blueprint"
  const productSubtitle = isClaudeFunnel
    ? "Brique Claude AI + Brique Claude Code"
    : "De l'idée au SaaS IA en 7 jours — sans savoir coder"
  const productFeatures = isClaudeFunnel ? CLAUDE_OS_FEATURES : BLUEPRINT_FEATURES

  const ext1Name = isClaudeFunnel ? "Ajouter Claude Design OS" : "Ajouter Buildrs OS"
  const ext1Accroche = isClaudeFunnel
    ? "Tu conçois et tu crées au niveau agence. Skills de conception, MCPs Figma/Canva, templates d'assets, walkthroughs vidéo."
    : "Le même setup testé 18 mois sur 25+ produits actifs et 45M tokens/mois."
  const ext1Highlights = isClaudeFunnel ? undefined : [
    "130+ skills business préconfigurés",
    "27 sub-agents Claude prêts à déléguer",
    "46 MCPs configurés (Notion, Drive, Stripe, Supabase...)",
    "La veille quotidienne Jarvis (mise à jour chaque jour)",
    "Updates à vie",
  ]
  const ext1Closing = isClaudeFunnel ? undefined : "Tu repars de chez Buildrs avec l'environnement Claude qu'on utilise quotidiennement. Tu n'as plus rien à configurer."

  useEffect(() => {
    document.documentElement.classList.add('dark')
    return () => {
      document.documentElement.classList.remove('dark')
      checkoutRef.current?.destroy()
    }
  }, [])

  const handlePay = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${SUPABASE_FUNCTIONS_URL}/create-checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: funnelSource,
          has_order_bump: hasOrderBump,
          has_acquisition_bump: isClaudeFunnel ? false : hasAcquisitionBump,
          origin: window.location.origin,
        }),
      })
      const data = await res.json()
      if (!res.ok || !data.clientSecret) throw new Error(data.error ?? 'Erreur de connexion à Stripe')
      const stripe = await loadStripe(data.publishableKey)
      if (!stripe) throw new Error('Stripe non disponible')
      checkoutRef.current?.destroy()
      const checkout = await stripe.initEmbeddedCheckout({ clientSecret: data.clientSecret })
      trackEvent('InitiateCheckout', { value: total, currency: 'EUR', num_items: 1 })
      setStripeReady(false)
      setShowStripe(true)
      setTimeout(() => {
        if (mountRef.current) {
          checkout.mount(mountRef.current)
          checkoutRef.current = checkout
          setTimeout(() => {
            setStripeReady(true)
            mountRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }, 700)
        }
      }, 50)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#080909', color: '#fff' }}>

      {/* NAV */}
      <nav style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="mx-auto flex h-[60px] max-w-[640px] items-center justify-between px-6">
          <img src="/LogoBuildrsBlanc.png" alt="Buildrs" style={{ height: 28, width: 'auto' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Lock size={12} strokeWidth={1.5} style={{ color: 'rgba(255,255,255,0.45)' }} />
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', fontWeight: 500 }}>Paiement sécurisé</span>
          </div>
        </div>
      </nav>

      {/* MAIN */}
      <div className="mx-auto max-w-[560px] px-5 py-10">

        {/* Title */}
        <div className="mb-8 text-center">
          <h1 style={{ fontSize: 'clamp(24px, 5vw, 32px)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.1, color: '#fff', marginBottom: 10 }}>
            Installer {productName}
          </h1>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>
            Accès immédiat après paiement · Updates à vie · Garantie 14 jours
          </p>
        </div>

        {/* Card — rainbow glow border */}
        <div className="card-rainbow mb-4">
        <div style={{ borderRadius: 20, background: '#0a0a0a', overflow: 'hidden' }}>

          {/* Product */}
          <div className="p-6">
            <div className="flex items-start justify-between mb-1">
              <p style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>{productName}</p>
              <p style={{ fontSize: 17, fontWeight: 700, color: '#fff' }}>{basePrice}€</p>
            </div>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.38)', marginBottom: 18 }}>{productSubtitle}</p>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {productFeatures.map((f) => (
                <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>
                  <span style={{ marginTop: 2, color: 'rgba(255,255,255,0.3)', flexShrink: 0 }}>•</span>
                  {f}
                </li>
              ))}
            </ul>
          </div>

          {/* Divider */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }} />

          {/* Extensions */}
          <div className="p-6" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.22)', marginBottom: 4 }}>
              Extension recommandée
            </p>

            <ExtensionCard
              checked={hasOrderBump}
              onToggle={() => setHasOrderBump(!hasOrderBump)}
              name={ext1Name}
              price={`+${ext1Price}€`}
              badge={!isClaudeFunnel ? "PROMO ACHETEUR BLUEPRINT · -21% sur le prix public (47€)" : undefined}
              accroche={ext1Accroche}
              highlights={ext1Highlights}
              closing={ext1Closing}
              icon={<ClaudeIcon size={15} style={{ color: '#fff', opacity: 0.85 }} />}
            />

            {!isClaudeFunnel && (
              <ExtensionCard
                checked={hasAcquisitionBump}
                onToggle={() => setHasAcquisitionBump(!hasAcquisitionBump)}
                name="Ajouter 100 Premiers Clients"
                price={`+${ext2Price}€`}
                accroche="La méthode complète pour acquérir tes 100 premiers clients payants sans agence et sans budget ADS infini."
                highlights={[
                  "Le framework d'acquisition par canal (organic, ADS, outbound)",
                  "Les templates de pitch + scripts de DM testés",
                  "Les structures de pricing qui convertissent (anchoring, tiers)",
                  "Le playbook ProductHunt + lancement communautaire",
                  "Les 10 erreurs qui tuent une acquisition (à éviter)",
                ]}
                closing="Tu sors avec un plan d'acquisition exécutable, pas une théorie générique."
              />
            )}
          </div>

          {/* Divider */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }} />

          {/* Total */}
          <div className="px-6 py-5 flex items-end justify-between">
            <p style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>Total</p>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1, color: '#fff' }}>{total}€</p>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>paiement unique</p>
            </div>
          </div>
        </div>
        </div>{/* end cta-rainbow */}

        {/* Error */}
        {error && (
          <div className="mb-3 rounded-xl px-4 py-3" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', fontSize: 13, color: '#f87171' }}>
            {error}
          </div>
        )}

        {/* CTA */}
        {!showStripe && (
          <button
            onClick={handlePay}
            disabled={loading}
            className="w-full rounded-xl transition-opacity hover:opacity-90 disabled:opacity-60"
            style={{ background: '#fff', fontSize: 16, fontWeight: 700, color: '#09090b', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', letterSpacing: '-0.02em', padding: '15px 0' }}
          >
            {loading ? 'Connexion...' : `Finaliser l'achat · ${total}€`}
          </button>
        )}

        {!isClaudeFunnel && !showStripe && (
          <div className="mt-3">
            <BuilderTierBadge variant="full" />
          </div>
        )}

        {/* Payment security block */}
        <div className="mt-4 rounded-2xl px-5 py-5" style={{ border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)' }}>
          <div className="flex items-center justify-center gap-1.5 mb-4">
            <Lock size={11} strokeWidth={1.5} style={{ color: 'rgba(255,255,255,0.45)' }} />
            <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.07em', textTransform: 'uppercase', fontWeight: 600 }}>
              Paiement sécurisé · SSL 256-bit
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: 14 }}>

            {/* Apple Pay */}
            <svg width="58" height="22" viewBox="0 0 58 22" fill="white" style={{ opacity: 0.78 }}>
              <path d="M9.16 4.47a3.37 3.37 0 0 0 .77-2.39 3.43 3.43 0 0 0-2.22 1.15 3.2 3.2 0 0 0-.8 2.32 2.83 2.83 0 0 0 2.25-1.08z"/>
              <path d="M9.92 5.69c-1.24-.07-2.3.7-2.89.7-.6 0-1.52-.67-2.51-.65a3.7 3.7 0 0 0-3.14 1.9C.05 9.87.94 13.62 2.23 15.59c.63.92 1.4 1.95 2.4 1.91.96-.04 1.32-.62 2.49-.62s1.5.62 2.5.6c1.04-.02 1.7-.94 2.33-1.87a8 8 0 0 0 1.03-2.12 3.4 3.4 0 0 1-2.04-3.1 3.48 3.48 0 0 1 1.66-2.93 3.56 3.56 0 0 0-2.68-1.77z"/>
              <text x="15" y="14.5" fontFamily="-apple-system,BlinkMacSystemFont,system-ui,sans-serif" fontSize="11" fontWeight="600">Pay</text>
            </svg>

            {/* Google Pay */}
            <svg width="54" height="22" viewBox="0 0 54 22" fill="white" style={{ opacity: 0.78 }}>
              <text x="0" y="15" fontFamily="system-ui,sans-serif" fontSize="13" fontWeight="500">G Pay</text>
            </svg>

            {/* Revolut */}
            <svg width="72" height="22" viewBox="0 0 72 22" fill="white" style={{ opacity: 0.78 }}>
              <text x="0" y="16" fontFamily="system-ui,-apple-system,'Helvetica Neue',Arial,sans-serif" fontSize="15" fontWeight="800" letterSpacing="-0.4">Revolut</text>
            </svg>

            {/* CB — Carte Bancaire */}
            <svg width="40" height="22" viewBox="0 0 40 22" fill="none" style={{ opacity: 0.78 }}>
              <rect x="0.5" y="0.5" width="39" height="21" rx="3.5" stroke="white" strokeOpacity="0.55"/>
              <text x="8" y="15" fontFamily="system-ui,sans-serif" fontSize="11" fontWeight="800" fill="white">CB</text>
            </svg>

            {/* American Express */}
            <svg width="56" height="22" viewBox="0 0 56 22" fill="none" style={{ opacity: 0.78 }}>
              <rect x="0.5" y="0.5" width="55" height="21" rx="3.5" stroke="white" strokeOpacity="0.45" fill="rgba(255,255,255,0.06)"/>
              <text x="5" y="9.5" fontFamily="system-ui,sans-serif" fontSize="7" fontWeight="800" fill="white" letterSpacing="0.8">AMERICAN</text>
              <text x="7" y="17.5" fontFamily="system-ui,sans-serif" fontSize="7" fontWeight="800" fill="white" letterSpacing="0.8">EXPRESS</text>
            </svg>

          </div>
        </div>

        {/* Stripe embedded */}
        {showStripe && (
          <div className="mt-4 rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
            {!stripeReady && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, padding: '48px 0' }}>
                <div className="animate-spin rounded-full" style={{ width: 28, height: 28, border: '2px solid rgba(255,255,255,0.15)', borderTopColor: '#fff' }} />
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>Chargement sécurisé…</span>
              </div>
            )}
            <div ref={mountRef} className={stripeReady ? '' : 'hidden'} />
          </div>
        )}

        {/* Trust badges */}
        <div className="mt-6 grid grid-cols-4 gap-2">
          {[
            { label: 'Garantie 14 jours', Icon: Shield },
            { label: 'Updates à vie',     Icon: RefreshCw },
            { label: 'Accès immédiat',    Icon: Zap },
            { label: 'Paiement Stripe',   Icon: Lock },
          ].map(({ label, Icon }) => (
            <div key={label} className="rounded-xl flex flex-col items-center gap-2 p-3 text-center" style={{ border: '1px solid rgba(255,255,255,0.18)', background: 'transparent' }}>
              <Icon size={15} strokeWidth={1.5} style={{ color: 'rgba(255,255,255,0.7)' }} />
              <p style={{ fontSize: 10, lineHeight: 1.3, color: 'rgba(255,255,255,0.55)' }}>{label}</p>
            </div>
          ))}
        </div>

      </div>

      <StackedCircularFooter />

    </div>
  )
}
