import Stripe from 'https://esm.sh/stripe@14?target=deno'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
  apiVersion: '2024-04-10',
  httpClient: Stripe.createFetchHttpClient(),
})

const ALLOWED_ORIGINS = ['https://buildrs.fr', 'https://claude.buildrs.fr']
const DEFAULT_RETURN_BASE = 'https://buildrs.fr'
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
    const returnBase = ALLOWED_ORIGINS.includes(body.origin) ? body.origin : DEFAULT_RETURN_BASE

    const session = await stripe.checkout.sessions.create({
      ui_mode: 'embedded',
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: 'Claude Integrator — Session privée 45 min',
              description: 'Configuration complète de ton environnement Claude en visio avec l équipe Buildrs',
            },
            unit_amount: 19700,
          },
          quantity: 1,
        },
      ],
      metadata: {
        product: 'claude-integrator',
      },
      payment_intent_data: {
        metadata: { product: 'claude-integrator' },
      },
      return_url: `${returnBase}/#/merci-integrator?session_id={CHECKOUT_SESSION_ID}`,
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
