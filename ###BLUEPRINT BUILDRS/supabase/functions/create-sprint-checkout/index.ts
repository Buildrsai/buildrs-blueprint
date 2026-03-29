import Stripe from 'https://esm.sh/stripe@14?target=deno'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
  apiVersion: '2024-04-10',
  httpClient: Stripe.createFetchHttpClient(),
})

const RETURN_BASE = 'https://buildrs.fr'
const PUBLISHABLE_KEY = Deno.env.get('STRIPE_PUBLISHABLE_KEY')!

const corsHeaders = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const session = await stripe.checkout.sessions.create({
      ui_mode: 'embedded',
      mode:    'payment',
      line_items: [{
        price_data: {
          currency:     'eur',
          product_data: { name: 'Buildrs Sprint — MVP livré en 72h' },
          unit_amount:  49700, // 497€
        },
        quantity: 1,
      }],
      metadata: { product: 'sprint', payment_mode: 'once' },
      payment_intent_data: {
        metadata: { product: 'sprint', payment_mode: 'once' },
      },
      return_url: `${RETURN_BASE}/#/confirmation?session_id={CHECKOUT_SESSION_ID}`,
    })

    return new Response(
      JSON.stringify({
        clientSecret:   session.client_secret,
        publishableKey: PUBLISHABLE_KEY,
      }),
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
