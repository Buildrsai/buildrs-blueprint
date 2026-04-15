import { useState, useEffect, useRef } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Check, Shield, Lock, ChevronLeft, Users, Zap, Calendar, Star } from 'lucide-react'
import { BuildrsIcon } from './ui/icons'
import { trackEvent } from '../lib/pixel'

const SUPABASE_FUNCTIONS_URL = 'https://ihgbbgwhgmosfjaknvlf.supabase.co/functions/v1'

const cohortFeatures = [
  '30 jours d\'accompagnement intensif avec Alfred',
  'Sessions live hebdomadaires (questions / code / stratégie)',
  'Accès au groupe privé — entraide entre builders',
  'Buildrs Blueprint + Pack Claude inclus',
  'Revue de ton produit en live — feedback direct',
  'Support illimité par messages pendant 30 jours',
  'Accès aux templates d\'apps prêtes à forker',
  'Accès à vie à tous les replays des sessions',
]

const testimonials = [
  { quote: "En 3 semaines j'avais mon SaaS en ligne et mes 5 premiers clients payants.", name: 'Romain V.' },
  { quote: "Alfred m'a débloqué en 20 min ce sur quoi je bloquais depuis 2 semaines.", name: 'Sarah M.' },
  { quote: "La cohorte c'est du concret, pas du coaching bullshit. On code, on lance.", name: 'Thomas L.' },
]

interface Props {
  onBack: () => void
}

export function CohorteCheckoutPage({ onBack }: Props) {
  const [paymentMode, setPaymentMode] = useState<'once' | 'three'>('once')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showStripe, setShowStripe] = useState(false)
  const checkoutRef = useRef<{ destroy: () => void } | null>(null)
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    return () => { checkoutRef.current?.destroy() }
  }, [])

  const handlePay = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${SUPABASE_FUNCTIONS_URL}/create-cohort-checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payment_mode: paymentMode }),
      })
      const data = await res.json()
      if (!res.ok || !data.clientSecret) throw new Error(data.error ?? 'Erreur de connexion à Stripe')

      const stripe = await loadStripe(data.publishableKey)
      if (!stripe) throw new Error('Stripe non disponible')

      checkoutRef.current?.destroy()

      const checkout = await stripe.initEmbeddedCheckout({ clientSecret: data.clientSecret })
      const price = paymentMode === 'once' ? 797 : 299
      trackEvent('InitiateCheckout', { value: price, currency: 'EUR', num_items: 1, content_name: 'Cohorte Build in 30 Days' })
      setShowStripe(true)

      setTimeout(() => {
        if (mountRef.current) {
          checkout.mount(mountRef.current)
          checkoutRef.current = checkout
        }
      }, 50)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
    } finally {
      setLoading(false)
    }
  }

  const handleCloseStripe = () => {
    checkoutRef.current?.destroy()
    checkoutRef.current = null
    setShowStripe(false)
  }

  return (
    <div className="min-h-screen bg-background">

      {/* Stripe overlay */}
      {showStripe && (
        <div className="fixed inset-0 z-50 flex flex-col bg-background overflow-y-auto">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border flex-shrink-0">
            <button onClick={handleCloseStripe} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm">
              <ChevronLeft size={16} strokeWidth={1.5} /> Retour
            </button>
            <div className="flex items-center gap-1.5">
              <Lock size={12} strokeWidth={1.5} className="text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Paiement sécurisé</span>
            </div>
          </div>
          <div ref={mountRef} className="flex-1 min-h-[600px]" />
        </div>
      )}

      {/* Header */}
      <div className="border-b border-border px-5 py-3.5 flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm">
          <ChevronLeft size={16} strokeWidth={1.5} /> Retour au dashboard
        </button>
        <div className="flex items-center gap-2">
          <BuildrsIcon color="hsl(var(--foreground))" size={16} />
          <span className="font-extrabold text-foreground text-[13px]" style={{ letterSpacing: '-0.04em' }}>Buildrs</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Lock size={12} strokeWidth={1.5} className="text-muted-foreground" />
          <span className="text-xs text-muted-foreground">SSL sécurisé</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-5 py-10 grid grid-cols-1 md:grid-cols-[1fr_380px] gap-8">

        {/* LEFT — Produit */}
        <div>
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 mb-5" style={{ background: 'hsl(var(--secondary))' }}>
            <Users size={11} strokeWidth={1.5} className="text-muted-foreground" />
            <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground">Cohorte — Places limitées</span>
          </div>

          <h1 className="font-extrabold text-foreground mb-2" style={{ fontSize: 'clamp(28px, 4vw, 38px)', letterSpacing: '-0.03em', lineHeight: 1.15 }}>
            Build in 30 Days
          </h1>
          <p className="text-muted-foreground mb-7" style={{ fontSize: 15, lineHeight: 1.6 }}>
            30 jours pour sortir ton premier produit monétisé — avec Alfred à côté de toi, pas juste un PDF à lire seul dans ton coin.
          </p>

          {/* Features */}
          <ul className="flex flex-col gap-2.5 mb-8">
            {cohortFeatures.map((f, i) => (
              <li key={i} className="flex items-start gap-2.5" style={{ fontSize: 13 }}>
                <Check size={13} strokeWidth={2.5} className="flex-shrink-0 mt-0.5" style={{ color: '#22c55e' }} />
                <span className="text-foreground">{f}</span>
              </li>
            ))}
          </ul>

          {/* Testimonials */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
            {testimonials.map((t, i) => (
              <div key={i} className="rounded-xl p-4" style={{ border: '1px solid hsl(var(--border))', background: 'hsl(var(--secondary) / 0.5)' }}>
                <div className="flex gap-0.5 mb-2">
                  {[...Array(5)].map((_, s) => <Star key={s} size={9} strokeWidth={0} style={{ fill: '#f59e0b' }} />)}
                </div>
                <p className="text-muted-foreground mb-2" style={{ fontSize: 11, lineHeight: 1.6 }}>"{t.quote}"</p>
                <p className="font-semibold text-foreground" style={{ fontSize: 11 }}>{t.name}</p>
              </div>
            ))}
          </div>

          {/* Garantie */}
          <div className="flex items-start gap-3 rounded-xl p-4" style={{ border: '1px solid hsl(var(--border))', background: 'hsl(var(--secondary) / 0.3)' }}>
            <Shield size={16} strokeWidth={1.5} className="flex-shrink-0 mt-0.5 text-muted-foreground" />
            <div>
              <p className="font-semibold text-foreground text-[12px] mb-0.5">Garantie satisfaction 7 jours</p>
              <p className="text-muted-foreground text-[11px] leading-relaxed">
                Si après 7 jours tu estimes que la cohorte ne te convient pas, on te rembourse intégralement. Sans question.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT — Order card */}
        <div className="md:sticky md:top-6 self-start">
          <div className="rounded-2xl overflow-hidden" style={{ border: '1.5px solid hsl(var(--border))' }}>

            {/* Header card */}
            <div className="px-5 py-4" style={{ background: 'hsl(var(--foreground))', color: 'hsl(var(--background))' }}>
              <div className="flex items-center gap-1.5 mb-1">
                <Zap size={11} strokeWidth={2} style={{ color: '#fbbf24' }} />
                <span className="text-[10px] font-bold uppercase tracking-[0.1em] opacity-75">Accès immédiat</span>
              </div>
              <p className="font-extrabold" style={{ fontSize: 18, letterSpacing: '-0.03em' }}>Build in 30 Days — Cohorte</p>
            </div>

            <div className="p-5">

              {/* Payment mode selector */}
              <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground mb-2.5">Mode de paiement</p>
              <div className="flex flex-col gap-2 mb-5">
                {/* 1x */}
                <button
                  onClick={() => setPaymentMode('once')}
                  className="flex items-center justify-between rounded-xl px-4 py-3 transition-all duration-150 text-left w-full"
                  style={{
                    border: paymentMode === 'once' ? '2px solid hsl(var(--foreground))' : '1.5px solid hsl(var(--border))',
                    background: paymentMode === 'once' ? 'hsl(var(--foreground) / 0.04)' : 'hsl(var(--background))',
                  }}
                >
                  <div>
                    <p className="font-semibold text-foreground" style={{ fontSize: 12 }}>Paiement en 1 fois</p>
                    <p className="text-muted-foreground" style={{ fontSize: 10 }}>Le moins cher</p>
                  </div>
                  <div className="text-right">
                    <p className="font-extrabold text-foreground" style={{ fontSize: 18, letterSpacing: '-0.02em' }}>797€</p>
                  </div>
                </button>

                {/* 3x */}
                <button
                  onClick={() => setPaymentMode('three')}
                  className="flex items-center justify-between rounded-xl px-4 py-3 transition-all duration-150 text-left w-full relative"
                  style={{
                    border: paymentMode === 'three' ? '2px solid hsl(var(--foreground))' : '1.5px solid hsl(var(--border))',
                    background: paymentMode === 'three' ? 'hsl(var(--foreground) / 0.04)' : 'hsl(var(--background))',
                  }}
                >
                  <div className="absolute -top-2.5 left-3">
                    <span className="text-[9px] font-bold uppercase tracking-[0.08em] px-2 py-0.5 rounded-full" style={{ background: 'hsl(var(--foreground))', color: 'hsl(var(--background))' }}>
                      Sans frais
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground" style={{ fontSize: 12 }}>Paiement en 3 fois</p>
                    <p className="text-muted-foreground" style={{ fontSize: 10 }}>3 × 266€ / mois</p>
                  </div>
                  <div className="text-right">
                    <p className="font-extrabold text-foreground" style={{ fontSize: 18, letterSpacing: '-0.02em' }}>266€</p>
                    <p className="text-muted-foreground" style={{ fontSize: 9 }}>× 3 mois</p>
                  </div>
                </button>
              </div>

              {/* Récap */}
              <div className="rounded-xl p-3 mb-4" style={{ background: 'hsl(var(--secondary))', border: '1px solid hsl(var(--border))' }}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-muted-foreground" style={{ fontSize: 11 }}>Build in 30 Days — Cohorte</span>
                  <span className="text-foreground font-medium" style={{ fontSize: 11 }}>
                    {paymentMode === 'once' ? '797€' : '3 × 266€'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground" style={{ fontSize: 11 }}>Buildrs Blueprint + Pack Claude</span>
                  <span style={{ fontSize: 11, color: '#22c55e', fontWeight: 600 }}>Inclus</span>
                </div>
                <div className="border-t border-border mt-2 pt-2 flex items-center justify-between">
                  <span className="font-semibold text-foreground" style={{ fontSize: 12 }}>Total</span>
                  <span className="font-extrabold text-foreground" style={{ fontSize: 15, letterSpacing: '-0.02em' }}>
                    {paymentMode === 'once' ? '797€' : '798€ (3×266€)'}
                  </span>
                </div>
              </div>

              {/* CTA */}
              {error && (
                <p className="text-[11px] mb-3 rounded-lg px-3 py-2 text-center" style={{ color: '#ef4444', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
                  {error}
                </p>
              )}

              <button
                onClick={handlePay}
                disabled={loading}
                className="cta-rainbow w-full rounded-xl font-semibold transition-opacity hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2"
                style={{ background: 'hsl(var(--foreground))', color: 'hsl(var(--background))', padding: '13px 20px', fontSize: 14 }}
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Zap size={14} strokeWidth={2} />
                    {paymentMode === 'once' ? 'Rejoindre — 797€' : 'Rejoindre — 3 × 266€'}
                  </>
                )}
              </button>

              {/* Sécurité */}
              <div className="flex items-center justify-center gap-3 mt-3">
                <div className="flex items-center gap-1">
                  <Lock size={10} strokeWidth={1.5} className="text-muted-foreground" />
                  <span className="text-muted-foreground" style={{ fontSize: 10 }}>Stripe sécurisé</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar size={10} strokeWidth={1.5} className="text-muted-foreground" />
                  <span className="text-muted-foreground" style={{ fontSize: 10 }}>Accès immédiat</span>
                </div>
                <div className="flex items-center gap-1">
                  <Shield size={10} strokeWidth={1.5} className="text-muted-foreground" />
                  <span className="text-muted-foreground" style={{ fontSize: 10 }}>Remboursé si insatisfait</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
