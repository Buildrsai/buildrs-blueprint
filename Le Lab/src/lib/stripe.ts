import { loadStripe } from '@stripe/stripe-js'

const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY as string | undefined

if (!stripePublicKey) {
  console.warn(
    '[Buildrs] VITE_STRIPE_PUBLIC_KEY manquante.\n' +
    'Copie .env.example → .env.local et remplis la clé Stripe.'
  )
}

// Singleton — chargé une seule fois (null si clé absente)
export const stripePromise = stripePublicKey ? loadStripe(stripePublicKey) : null

export const STRIPE_PRICES = {
  LAB_ONE_TIME: import.meta.env.VITE_STRIPE_PRICE_LAB_ONE_TIME as string | undefined,
  LAB_MONTHLY: import.meta.env.VITE_STRIPE_PRICE_LAB_MONTHLY as string | undefined,
  LAB_YEARLY: import.meta.env.VITE_STRIPE_PRICE_LAB_YEARLY as string | undefined,
} as const
