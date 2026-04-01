// stripe-webhook/index.ts
// Reçoit checkout.session.completed → insère dans email_sequences → envoie E1 immédiatement
//
// Env vars requises :
//   STRIPE_SECRET_KEY          — clé secrète Stripe
//   STRIPE_WEBHOOK_SECRET      — webhook signing secret (whsec_...)
//   SUPABASE_URL               — URL du projet Supabase
//   SUPABASE_SERVICE_ROLE_KEY  — clé service_role (bypass RLS)
//   RESEND_API_KEY             — clé API Resend

import Stripe from 'https://esm.sh/stripe@14?target=deno'
import { EMAIL_TEMPLATES, SENDERS, REPLY_TO } from '../_shared/email-templates.ts'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
  apiVersion:  '2024-04-10',
  httpClient:  Stripe.createFetchHttpClient(),
})

const SUPABASE_URL              = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const RESEND_API_KEY            = Deno.env.get('RESEND_API_KEY')!
const WEBHOOK_SECRET            = Deno.env.get('STRIPE_WEBHOOK_SECRET')!

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function insertEmailSequence(
  email:   string,
  product: string,
): Promise<void> {
  const url = `${SUPABASE_URL}/rest/v1/email_sequences`
  const res = await fetch(url, {
    method:  'POST',
    headers: {
      'Content-Type':  'application/json',
      'apikey':        SUPABASE_SERVICE_ROLE_KEY,
      'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      'Prefer':        'return=minimal',
    },
    body: JSON.stringify({
      user_email:   email,
      product,
      purchased_at: new Date().toISOString(),
      next_step:    2, // E1 est envoyé ici directement, le cron prend la suite à partir de E2
    }),
  })
  if (!res.ok) {
    const txt = await res.text()
    throw new Error(`Supabase insert failed: ${txt}`)
  }
}

async function sendEmail(templateStep: number, toEmail: string): Promise<void> {
  const tpl = EMAIL_TEMPLATES.find(t => t.step === templateStep)
  if (!tpl) throw new Error(`Template step ${templateStep} introuvable`)

  const res = await fetch('https://api.resend.com/emails', {
    method:  'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type':  'application/json',
    },
    body: JSON.stringify({
      from:     SENDERS[tpl.sender],
      to:       toEmail,
      reply_to: REPLY_TO,
      subject:  tpl.subject,
      html:     tpl.html,
    }),
  })

  if (!res.ok) {
    const errText = await res.text()
    throw new Error(`Resend error: ${errText}`)
  }
}

// ─── Handler principal ────────────────────────────────────────────────────────

Deno.serve(async (req) => {
  // Stripe envoie POST avec la signature dans le header
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  const body      = await req.text()
  const signature = req.headers.get('stripe-signature')

  if (!signature) {
    return new Response('Missing stripe-signature', { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = await stripe.webhooks.constructEventAsync(body, signature, WEBHOOK_SECRET)
  } catch (err) {
    console.error('Stripe signature verification failed:', err)
    return new Response(`Webhook error: ${err instanceof Error ? err.message : 'invalid'}`, { status: 400 })
  }

  // On traite uniquement les paiements complétés
  if (event.type !== 'checkout.session.completed') {
    return new Response(JSON.stringify({ received: true }), {
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const session = event.data.object as Stripe.Checkout.Session
  const product = session.metadata?.product ?? 'unknown'
  const email   = session.customer_details?.email ?? session.customer_email

  // Pack Agents acheté depuis la page upsell (avant inscription)
  // → stocker dans purchases pour réconcilier au premier login
  if (product === 'agents_pack') {
    if (email) {
      await fetch(`${SUPABASE_URL}/rest/v1/purchases`, {
        method:  'POST',
        headers: {
          'Content-Type':  'application/json',
          'apikey':        SUPABASE_SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          'Prefer':        'return=minimal',
        },
        body: JSON.stringify({
          email,
          product:          'agents_pack',
          stripe_session_id: session.id,
        }),
      })
      console.log(`Pack Agents enregistré pour ${email}`)
    }
    return new Response(JSON.stringify({ received: true, product: 'agents_pack' }), {
      headers: { 'Content-Type': 'application/json' },
    })
  }

  // On ne lance la séquence Blueprint que sur l'achat Blueprint
  // (sprint et cohort ont leurs propres flows, pas de séquence drip)
  if (product !== 'blueprint') {
    console.log(`Product "${product}" — pas de séquence email déclenchée`)
    return new Response(JSON.stringify({ received: true, skipped: true }), {
      headers: { 'Content-Type': 'application/json' },
    })
  }

  if (!email) {
    console.error('Aucun email trouvé dans la session Stripe', session.id)
    return new Response(JSON.stringify({ received: true, error: 'no email' }), {
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const hasOrderBump = session.metadata?.has_order_bump === 'true'
  const productLabel = hasOrderBump ? 'blueprint_bump' : 'blueprint'

  try {
    // 1. Insérer en DB (next_step = 2 car E1 est envoyé maintenant)
    await insertEmailSequence(email, productLabel)

    // 2. Envoyer E1 immédiatement (J0 — bienvenue)
    await sendEmail(1, email)

    console.log(`Séquence email démarrée pour ${email} (product: ${productLabel})`)

    return new Response(JSON.stringify({ received: true, email, product: productLabel }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('Erreur lors du démarrage de la séquence email:', err)
    // On retourne 200 à Stripe pour éviter les retries infinis sur une erreur interne
    return new Response(
      JSON.stringify({ received: true, error: err instanceof Error ? err.message : 'internal error' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    )
  }
})
