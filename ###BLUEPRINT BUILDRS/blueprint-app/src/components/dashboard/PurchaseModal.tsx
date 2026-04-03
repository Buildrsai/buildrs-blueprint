import { useState, useRef, useEffect } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import type { StripeEmbeddedCheckout } from '@stripe/stripe-js'
import { Modal } from '../ui/Modal'
import { PRODUCTS_CATALOG, formatPrice } from '../../data/products-catalog'
import type { AccessContext } from '../../hooks/useAccess'

const SUPABASE_FUNCTIONS_URL = 'https://ihgbbgwhgmosfjaknvlf.supabase.co/functions/v1'

interface Props {
  productSlug: string
  userId: string
  access: AccessContext
  onClose: () => void
}

export function PurchaseModal({ productSlug, userId, access: _access, onClose }: Props) {
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState<string | null>(null)
  const [showStripe, setShowStripe] = useState(false)
  const mountRef    = useRef<HTMLDivElement>(null)
  const checkoutRef = useRef<StripeEmbeddedCheckout | null>(null)

  const product = PRODUCTS_CATALOG.find(p => p.slug === productSlug)
  const Icon    = product?.icon

  useEffect(() => {
    return () => { checkoutRef.current?.destroy() }
  }, [])

  const startCheckout = async (slugs: string[]) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${SUPABASE_FUNCTIONS_URL}/create-product-checkout`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ product_slug: slugs[0], user_id: userId }),
      })
      const data = await res.json()
      if (!res.ok || !data.clientSecret) throw new Error(data.error ?? 'Erreur Stripe')

      const stripe = await loadStripe(data.publishableKey)
      if (!stripe) throw new Error('Stripe indisponible')
      checkoutRef.current?.destroy()
      const checkout = await stripe.initEmbeddedCheckout({ clientSecret: data.clientSecret })
      setShowStripe(true)
      setTimeout(() => {
        if (mountRef.current) { checkout.mount(mountRef.current); checkoutRef.current = checkout }
      }, 50)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal onClose={onClose} maxWidth={520}>
      {!showStripe ? (
        <div className="p-6">
          {/* Product header */}
          <div className="flex items-center gap-3 mb-5">
            {Icon && (
              <div className="w-10 h-10 rounded-xl border border-border flex items-center justify-center flex-shrink-0"
                style={{ background: 'hsl(var(--secondary))' }}>
                <Icon size={18} strokeWidth={1.5} className="text-foreground" />
              </div>
            )}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-0.5">
                Buildrs
              </p>
              <h2 className="text-[16px] font-extrabold text-foreground tracking-tight">
                {product?.name}
              </h2>
            </div>
          </div>

          <p className="text-[13px] text-muted-foreground leading-relaxed mb-6">
            {product?.description}
          </p>

          {/* Price + CTA */}
          <button
            onClick={() => startCheckout([productSlug])}
            disabled={loading}
            className="w-full rounded-xl py-3.5 text-[14px] font-bold transition-all duration-150"
            style={{
              background: loading ? 'hsl(var(--secondary))' : 'hsl(var(--foreground))',
              color: loading ? 'hsl(var(--muted-foreground))' : 'hsl(var(--background))',
            }}
          >
            {loading ? 'Chargement...' : `Débloquer — ${formatPrice(product?.priceCents ?? 0)}`}
          </button>

          {error && (
            <p className="mt-3 text-[12px] text-center" style={{ color: '#ef4444' }}>{error}</p>
          )}
        </div>
      ) : (
        <div className="p-4">
          <div ref={mountRef} />
        </div>
      )}
    </Modal>
  )
}
