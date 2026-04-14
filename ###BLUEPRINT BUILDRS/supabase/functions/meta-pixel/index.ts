// Meta Pixel — Conversions API (server-side)
// Bypasses ad blockers. Called in parallel with browser-side fbq().
// Required env var: META_CAPI_TOKEN (from Meta Business Manager → Events Manager → Settings)

const PIXEL_ID = '1457975302620059'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  const capiToken = Deno.env.get('META_CAPI_TOKEN')
  if (!capiToken) {
    // Token not configured yet — fail silently (don't break client)
    return new Response(JSON.stringify({ skipped: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  try {
    const body = await req.json()
    const { event_name, event_id, event_source_url, value, currency, fbc, fbp, email_hash } = body

    if (!event_name) {
      return new Response(JSON.stringify({ error: 'event_name required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Extract user identifiers from request headers
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      ?? req.headers.get('x-real-ip')
      ?? undefined
    const userAgent = req.headers.get('user-agent') ?? undefined

    const userData: Record<string, string> = {}
    if (ip) userData.client_ip_address = ip
    if (userAgent) userData.client_user_agent = userAgent
    if (fbc) userData.fbc = fbc
    if (fbp) userData.fbp = fbp
    if (email_hash) userData.em = email_hash  // SHA-256 hashed email

    const eventData: Record<string, unknown> = {
      event_name,
      event_time: Math.floor(Date.now() / 1000),
      action_source: 'website',
      event_source_url: event_source_url || 'https://buildrs.fr',
      user_data: userData,
    }
    // event_id partagé avec fbq() côté browser → Meta déduplication correctement
    if (event_id) eventData.event_id = event_id

    if (value !== undefined && value !== null) {
      eventData.custom_data = {
        value: Number(value),
        currency: (currency as string) || 'EUR',
      }
    }

    const resp = await fetch(
      `https://graph.facebook.com/v19.0/${PIXEL_ID}/events?access_token=${capiToken}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: [eventData] }),
      }
    )

    const result = await resp.json()

    return new Response(JSON.stringify(result), {
      status: resp.ok ? 200 : 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('[meta-pixel]', err)
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : 'Erreur serveur' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
