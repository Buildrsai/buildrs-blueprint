// process-email-queue/index.ts
// Cron processor — à appeler toutes les heures via pg_cron ou cron-job.org
// Calcule pour chaque acheteur quel email est dû et l'envoie via Resend
//
// Sécurité : header requis → Authorization: Bearer <QUEUE_CRON_SECRET>
//
// Env vars requises :
//   SUPABASE_URL               — URL du projet Supabase
//   SUPABASE_SERVICE_ROLE_KEY  — clé service_role
//   RESEND_API_KEY             — clé API Resend
//   QUEUE_CRON_SECRET          — secret pour protéger l'endpoint cron

import { EMAIL_TEMPLATES, SENDERS, REPLY_TO, STEP_TO_DAY } from '../_shared/email-templates.ts'

const SUPABASE_URL              = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const RESEND_API_KEY            = Deno.env.get('RESEND_API_KEY')!
const QUEUE_CRON_SECRET         = Deno.env.get('QUEUE_CRON_SECRET')!

// ─── Types ────────────────────────────────────────────────────────────────────

interface EmailSequenceRow {
  id:           string
  user_email:   string
  product:      string
  purchased_at: string
  next_step:    number
  completed:    boolean
}

// ─── Helpers Supabase ─────────────────────────────────────────────────────────

async function fetchPendingSequences(): Promise<EmailSequenceRow[]> {
  const url = `${SUPABASE_URL}/rest/v1/email_sequences?completed=eq.false&select=*`
  const res = await fetch(url, {
    headers: {
      'apikey':        SUPABASE_SERVICE_ROLE_KEY,
      'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
    },
  })
  if (!res.ok) throw new Error(`Fetch sequences failed: ${await res.text()}`)
  return res.json()
}

async function updateSequence(
  id:        string,
  nextStep:  number,
  completed: boolean,
): Promise<void> {
  const url = `${SUPABASE_URL}/rest/v1/email_sequences?id=eq.${id}`
  const res = await fetch(url, {
    method:  'PATCH',
    headers: {
      'Content-Type':  'application/json',
      'apikey':        SUPABASE_SERVICE_ROLE_KEY,
      'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      'Prefer':        'return=minimal',
    },
    body: JSON.stringify({
      next_step:  nextStep,
      completed,
      updated_at: new Date().toISOString(),
    }),
  })
  if (!res.ok) throw new Error(`Update sequence failed: ${await res.text()}`)
}

// ─── Helper Resend ────────────────────────────────────────────────────────────

async function sendEmail(step: number, toEmail: string): Promise<void> {
  const tpl = EMAIL_TEMPLATES.find(t => t.step === step)
  if (!tpl) throw new Error(`Template step ${step} introuvable`)

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
    throw new Error(`Resend error step ${step}: ${errText}`)
  }
}

// ─── Handler principal ────────────────────────────────────────────────────────

Deno.serve(async (req) => {
  // Vérification du secret cron
  const authHeader = req.headers.get('Authorization') ?? ''
  const token      = authHeader.replace('Bearer ', '').trim()

  if (!QUEUE_CRON_SECRET || token !== QUEUE_CRON_SECRET) {
    return new Response('Unauthorized', { status: 401 })
  }

  if (req.method !== 'POST' && req.method !== 'GET') {
    return new Response('Method not allowed', { status: 405 })
  }

  const now       = Date.now()
  const results   = { processed: 0, sent: 0, errors: 0, skipped: 0 }
  const errorLog: string[] = []

  try {
    const sequences = await fetchPendingSequences()
    results.processed = sequences.length

    for (const seq of sequences) {
      const { id, user_email, next_step, purchased_at } = seq

      // Nombre de jours écoulés depuis l'achat (floor = on n'envoie pas en avance)
      const purchasedTs    = new Date(purchased_at).getTime()
      const daysSinceBuy   = Math.floor((now - purchasedTs) / (1000 * 60 * 60 * 24))

      // L'email dû correspond au next_step
      const scheduledDay = STEP_TO_DAY[next_step]

      // Le step est inconnu (hors range 1-23) → marquer completed
      if (scheduledDay === undefined) {
        await updateSequence(id, next_step, true)
        results.skipped++
        continue
      }

      // Pas encore le bon jour → on passe
      if (daysSinceBuy < scheduledDay) {
        results.skipped++
        continue
      }

      // Envoi de l'email
      try {
        await sendEmail(next_step, user_email)

        const isLastStep  = next_step === 23
        const newNextStep = next_step + 1

        await updateSequence(id, newNextStep, isLastStep)
        results.sent++
      } catch (err) {
        const msg = `[${user_email}] step ${next_step}: ${err instanceof Error ? err.message : err}`
        console.error(msg)
        errorLog.push(msg)
        results.errors++
        // On ne bloque pas les autres séquences
      }
    }
  } catch (err) {
    console.error('process-email-queue fatal error:', err)
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : 'internal error', results }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    )
  }

  console.log('process-email-queue done:', results)

  return new Response(
    JSON.stringify({ ok: true, results, errors: errorLog }),
    { headers: { 'Content-Type': 'application/json' } },
  )
})
