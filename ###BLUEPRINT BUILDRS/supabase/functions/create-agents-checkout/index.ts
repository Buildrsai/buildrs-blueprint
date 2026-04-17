import Stripe from 'https://esm.sh/stripe@14?target=deno'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2?target=deno'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
  apiVersion: '2024-04-10',
  httpClient: Stripe.createFetchHttpClient(),
})

const RETURN_BASE      = 'https://buildrs.fr'
const PUBLISHABLE_KEY  = Deno.env.get('STRIPE_PUBLISHABLE_KEY')!
const SUPABASE_URL     = Deno.env.get('SUPABASE_URL')!
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!

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
    const fromDashboard: boolean = body.from_dashboard === true

    // Extraire user_id depuis le JWT — ne peut pas être falsifié côté client
    let userId: string | undefined
    const authHeader = req.headers.get('Authorization')
    if (authHeader) {
      const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        global: { headers: { Authorization: authHeader } },
      })
      const { data: { user } } = await supabase.auth.getUser()
      userId = user?.id ?? undefined
    }

    // Récupère les infos client de la session précédente pour pré-remplir
    let customerEmail: string | undefined
    let customerId: string | undefined
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
          product_data: { name: 'Buildrs Pack Agents IA — 7 agents spécialisés' },
          unit_amount:  19700, // 197€
        },
        quantity: 1,
      }],
      metadata: {
        product: 'agents_pack',
        payment_mode: 'once',
        ...(userId ? { user_id: userId } : {}),
      },
      payment_intent_data: {
        metadata: {
          product: 'agents_pack',
          payment_mode: 'once',
          ...(userId ? { user_id: userId } : {}),
        },
      },
      return_url: fromDashboard
        ? `${RETURN_BASE}/#/dashboard/agents?pack_unlocked=1`
        : `${RETURN_BASE}/#/confirmation`,
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
