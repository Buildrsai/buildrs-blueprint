// create-product-checkout/index.ts
// Checkout universel pour un seul produit du catalogue.
// Body: { product_slug: string, user_id: string }
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

// Lookup produit dans la table Supabase
async function fetchProduct(slug: string) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/products?slug=eq.${encodeURIComponent(slug)}&select=slug,name,price_cents,stripe_price_id`, {
    headers: {
      'apikey':        SERVICE_KEY,
      'Authorization': `Bearer ${SERVICE_KEY}`,
    },
  })
  const data = await res.json()
  return Array.isArray(data) && data.length > 0 ? data[0] : null
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { product_slug, user_id } = await req.json()
    if (!product_slug || !user_id) throw new Error('product_slug et user_id requis')

    const product = await fetchProduct(product_slug)
    if (!product) throw new Error(`Produit "${product_slug}" introuvable`)

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      ui_mode:   'embedded',
      mode:      'payment',
      line_items: [{
        price_data: {
          currency:     'eur',
          product_data: { name: `Buildrs — ${product.name}` },
          unit_amount:  product.price_cents,
        },
        quantity: 1,
      }],
      metadata: {
        product:         product_slug,
        user_id,
        payment_mode:    'once',
      },
      payment_intent_data: {
        metadata: { product: product_slug, user_id, payment_mode: 'once' },
      },
      return_url: `${RETURN_BASE}/#/dashboard/produit/${product_slug}?unlocked=1`,
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
