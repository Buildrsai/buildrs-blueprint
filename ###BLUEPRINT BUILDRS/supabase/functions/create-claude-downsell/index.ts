import Stripe from 'https://esm.sh/stripe@14?target=deno'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
  apiVersion: '2024-04-10',
  httpClient: Stripe.createFetchHttpClient(),
})

const ALLOWED_ORIGINS = ['https://buildrs.fr', 'https://claude.buildrs.fr']
const DEFAULT_RETURN_BASE = 'https://claude.buildrs.fr'
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
    const priorSessionId: string | undefined = body.prior_session_id
    const returnBase = ALLOWED_ORIGINS.includes(body.origin) ? body.origin : DEFAULT_RETURN_BASE

    // Récupère les infos client de la session précédente pour pré-remplir
    let customerEmail: string | undefined
    let customerId:    string | undefined
    if (priorSessionId) {
      try {
        const prior = await stripe.checkout.sessions.retrieve(priorSessionId)
        if (prior.customer && typeof prior.customer === 'string') {
          customerId = prior.customer
        } else if (prior.customer_details?.email) {
          customerEmail = prior.customer_details.email
        }
      } catch (_) {
        // Si la récupération échoue, on continue sans pré-remplissage
      }
    }

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      ui_mode: 'embedded',
      mode:    'payment',
      line_items: [{
        price_data: {
          currency:     'eur',
          product_data: { name: 'Buildrs Blueprint — 7 modules opérationnels · Offre downsell' },
          unit_amount:  2700, // 27€
        },
        quantity: 1,
      }],
      metadata: {
        product:      'blueprint',
        payment_mode: 'downsell',
        source:       'claude-funnel',
      },
      payment_intent_data: {
        metadata: {
          product:      'blueprint',
          payment_mode: 'downsell',
          source:       'claude-funnel',
        },
      },
      return_url: `${returnBase}/#/signup?welcome=lp2&purchased=downsell`,
    }

    if (customerId) {
      sessionParams.customer = customerId
    } else if (customerEmail) {
      sessionParams.customer_email = customerEmail
    }

    const session = await stripe.checkout.sessions.create(sessionParams)

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
