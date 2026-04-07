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
    const hasCoworkBump:    boolean = body.has_cowork_bump    === true
    const hasBlueprintBump: boolean = body.has_blueprint_bump === true
    const returnBase = ALLOWED_ORIGINS.includes(body.origin) ? body.origin : DEFAULT_RETURN_BASE

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
      {
        price_data: {
          currency:     'eur',
          product_data: { name: 'Claude By Buildrs — 7 blocs, 43 briques' },
          unit_amount:  4700,
        },
        quantity: 1,
      },
    ]

    if (hasCoworkBump) {
      lineItems.push({
        price_data: {
          currency:     'eur',
          product_data: { name: 'Claude Cowork by Buildrs — 6 blocs, 47 briques' },
          unit_amount:  3700,
        },
        quantity: 1,
      })
    }

    if (hasBlueprintBump) {
      lineItems.push({
        price_data: {
          currency:     'eur',
          product_data: { name: 'Buildrs Blueprint — 7 modules opérationnels' },
          unit_amount:  2700,
        },
        quantity: 1,
      })
    }

    const coworkParam    = hasCoworkBump    ? '&cowork=1'    : '&cowork=0'
    const blueprintParam = hasBlueprintBump ? '&blueprint=1' : '&blueprint=0'

    const session = await stripe.checkout.sessions.create({
      ui_mode: 'embedded',
      mode:    'payment',
      line_items: lineItems,
      metadata: {
        product:            'claude-buildrs',
        has_cowork_bump:    hasCoworkBump    ? 'true' : 'false',
        has_blueprint_bump: hasBlueprintBump ? 'true' : 'false',
      },
      payment_intent_data: {
        metadata: {
          product:            'claude-buildrs',
          has_cowork_bump:    hasCoworkBump    ? 'true' : 'false',
          has_blueprint_bump: hasBlueprintBump ? 'true' : 'false',
        },
      },
      return_url: `${returnBase}/#/merci-claude?session_id={CHECKOUT_SESSION_ID}${coworkParam}${blueprintParam}`,
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
