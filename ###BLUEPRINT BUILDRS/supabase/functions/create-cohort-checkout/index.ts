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
    const body = await req.json().catch(() => ({}))
    const paymentMode: 'once' | 'three' = body.payment_mode === 'three' ? 'three' : 'once'

    let session: Stripe.Checkout.Session

    if (paymentMode === 'three') {
      session = await stripe.checkout.sessions.create({
        ui_mode: 'embedded',
        mode:    'subscription',
        line_items: [{
          price_data: {
            currency:     'eur',
            product_data: { name: 'Build in 60 Days — Cohorte (3× sans frais)' },
            unit_amount:  49900, // 499€/mois × 3
            recurring:    { interval: 'month' },
          },
          quantity: 1,
        }],
        metadata: { product: 'cohort', payment_mode: 'three' },
        subscription_data: {
          metadata: { cancel_after_months: '3', product: 'cohort', payment_mode: 'three' },
        },
        return_url: `${RETURN_BASE}/#/confirmation?session_id={CHECKOUT_SESSION_ID}&source=cohort&price=499`,
      })
    } else {
      session = await stripe.checkout.sessions.create({
        ui_mode: 'embedded',
        mode:    'payment',
        line_items: [{
          price_data: {
            currency:     'eur',
            product_data: { name: 'Build in 60 Days — Cohorte' },
            unit_amount:  149700, // 1 497€
          },
          quantity: 1,
        }],
        metadata: { product: 'cohort', payment_mode: 'once' },
        payment_intent_data: {
          metadata: { product: 'cohort', payment_mode: 'once' },
        },
        return_url: `${RETURN_BASE}/#/confirmation?session_id={CHECKOUT_SESSION_ID}&source=cohort&price=1497`,
      })
    }

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
