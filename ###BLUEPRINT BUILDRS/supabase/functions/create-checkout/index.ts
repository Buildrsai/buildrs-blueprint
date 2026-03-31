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
    const hasOrderBump: boolean       = body.has_order_bump === true
    const hasAcquisitionBump: boolean = body.has_acquisition_bump === true
    const source: 'blueprint' | 'claude' = body.source === 'claude' ? 'claude' : 'blueprint'
    const isClaudeFunnel = source === 'claude'

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
      {
        price_data: {
          currency: 'eur',
          product_data: {
            name: isClaudeFunnel ? 'Claude Buildrs' : 'Buildrs Blueprint',
          },
          unit_amount: isClaudeFunnel ? 4700 : 2700,
        },
        quantity: 1,
      },
    ]

    if (hasOrderBump) {
      lineItems.push({
        price_data: {
          currency: 'eur',
          product_data: {
            name: isClaudeFunnel
              ? 'Blueprint SaaS — Buildrs'
              : 'Claude 360° — Buildrs Blueprint',
          },
          unit_amount: isClaudeFunnel ? 2700 : 3700,
        },
        quantity: 1,
      })
    }

    if (!isClaudeFunnel && hasAcquisitionBump) {
      lineItems.push({
        price_data: {
          currency: 'eur',
          product_data: { name: 'Blueprint Acquisition' },
          unit_amount: 2700,
        },
        quantity: 1,
      })
    }

    const sourceParam      = isClaudeFunnel    ? '&source=claude' : ''
    const bumpParam        = hasOrderBump      ? '&bump=1'        : ''
    const acquisitionParam = hasAcquisitionBump && !isClaudeFunnel ? '&acquisition=1' : ''

    const session = await stripe.checkout.sessions.create({
      ui_mode: 'embedded',
      mode: 'payment',
      line_items: lineItems,
      metadata: {
        product:              isClaudeFunnel ? 'claude' : 'blueprint',
        has_order_bump:       hasOrderBump       ? 'true' : 'false',
        has_acquisition_bump: hasAcquisitionBump ? 'true' : 'false',
      },
      payment_intent_data: {
        metadata: {
          product:              isClaudeFunnel ? 'claude' : 'blueprint',
          has_order_bump:       hasOrderBump       ? 'true' : 'false',
          has_acquisition_bump: hasAcquisitionBump ? 'true' : 'false',
        },
      },
      return_url: `${RETURN_BASE}/#/upsell-cohort?session_id={CHECKOUT_SESSION_ID}${sourceParam}${bumpParam}${acquisitionParam}`,
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
