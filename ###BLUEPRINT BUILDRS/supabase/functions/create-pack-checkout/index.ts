// create-pack-checkout/index.ts
// Checkout multi-produits avec remise 15%.
// Body: { product_slugs: string[], user_id: string }
// Returns: { clientSecret, publishableKey }

import Stripe from 'https://esm.sh/stripe@14?target=deno'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
  apiVersion: '2024-04-10',
  httpClient: Stripe.createFetchHttpClient(),
})

const RETURN_BASE     = 'https://buildrs.fr'
const PUBLISHABLE_KEY = Deno.env.get('STRIPE_PUBLISHABLE_KEY')!
const SUPABASE_URL    = Deno.env.get('SUPABASE_URL')!
const SERVICE_KEY     = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

const corsHeaders = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

async function fetchProducts(slugs: string[]) {
  const filter = slugs.map(s => `slug.eq.${encodeURIComponent(s)}`).join(',')
  const res = await fetch(`${SUPABASE_URL}/rest/v1/products?or=(${filter})&select=slug,name,price_cents`, {
    headers: {
      'apikey':        SERVICE_KEY,
      'Authorization': `Bearer ${SERVICE_KEY}`,
    },
  })
  return await res.json()
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { product_slugs, user_id } = await req.json()
    if (!Array.isArray(product_slugs) || product_slugs.length === 0 || !user_id) {
      throw new Error('product_slugs[] et user_id requis')
    }

    const products = await fetchProducts(product_slugs)
    if (!products || products.length === 0) throw new Error('Produits introuvables')

    const total    = products.reduce((s: number, p: { price_cents: number }) => s + p.price_cents, 0)
    const discounted = Math.round(total * 0.85)

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      ui_mode: 'embedded',
      mode:    'payment',
      line_items: [{
        price_data: {
          currency:     'eur',
          product_data: {
            name: `Buildrs Pack — ${products.map((p: { name: string }) => p.name).join(' + ')}`,
          },
          unit_amount: discounted,
        },
        quantity: 1,
      }],
      metadata: {
        product:         'pack',
        product_slugs:   product_slugs.join(','),
        user_id,
        payment_mode:    'once',
      },
      payment_intent_data: {
        metadata: { product: 'pack', product_slugs: product_slugs.join(','), user_id, payment_mode: 'once' },
      },
      return_url: `${RETURN_BASE}/#/dashboard/produits?pack_unlocked=1`,
    }

    const session = await stripe.checkout.sessions.create(sessionParams)

    return new Response(
      JSON.stringify({ clientSecret: session.client_secret, publishableKey: PUBLISHABLE_KEY }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  } catch (err) {
    console.error(err)
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : 'Erreur serveur' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  }
})
