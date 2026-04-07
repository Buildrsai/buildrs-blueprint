// supabase/functions/scanner-status/index.ts
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const SCANNER_AUTH_TOKEN = Deno.env.get('SCANNER_AUTH_TOKEN') ?? ''

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  // Auth via JWT user (verifie is_admin dans user_metadata)
  const authHeader = req.headers.get('Authorization')
  if (!authHeader) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false }
  })
  const { data: { user }, error: authErr } = await supabase.auth.getUser(
    authHeader.replace('Bearer ', '')
  )
  if (authErr || !user || !user.user_metadata?.is_admin) {
    return new Response(JSON.stringify({ error: 'Admin only' }), {
      status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  const url = new URL(req.url)
  const action = url.searchParams.get('action') ?? 'status'

  if (action === 'status') {
    const [runsResult, oppsResult] = await Promise.all([
      supabase.from('scanner_runs').select('*').order('started_at', { ascending: false }).limit(10),
      supabase.from('saas_opportunities').select('id, source, build_score, status').eq('status', 'active'),
    ])

    const opps = oppsResult.data ?? []
    const by_source: Record<string, number> = {}
    opps.forEach((o: { source: string }) => {
      by_source[o.source] = (by_source[o.source] || 0) + 1
    })
    const scores = opps.map((o: { build_score: number }) => o.build_score)
    const avg_build_score = scores.length > 0
      ? Math.round(scores.reduce((a: number, b: number) => a + b, 0) / scores.length)
      : 0

    return new Response(JSON.stringify({
      runs: runsResult.data ?? [],
      stats: { total: opps.length, by_source, avg_build_score },
    }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }

  if (action === 'run') {
    const started_at = new Date().toISOString()
    const { data: run } = await supabase
      .from('scanner_runs')
      .insert({ trigger_type: 'manual', started_at })
      .select('id')
      .single()

    const headers = { 'x-scanner-token': SCANNER_AUTH_TOKEN }
    const fnBase = `${SUPABASE_URL}/functions/v1`

    const results = await Promise.allSettled([
      fetch(`${fnBase}/scanner-collect?source=product_hunt`, { method: 'POST', headers }),
      fetch(`${fnBase}/scanner-collect?source=hacker_news`, { method: 'POST', headers }),
    ])

    let items_collected = 0
    for (const r of results) {
      if (r.status === 'fulfilled') {
        try {
          const d = await r.value.json()
          items_collected += d.items_new ?? 0
        } catch { /* ignore parse errors */ }
      }
    }

    const scoreRes = await fetch(`${fnBase}/scanner-score`, { method: 'POST', headers })
    const scored = await scoreRes.json().catch(() => ({ items_scored: 0 }))

    await supabase.from('scanner_runs').update({
      items_collected,
      items_new: items_collected,
      items_scored: scored.items_scored ?? 0,
      completed_at: new Date().toISOString(),
      duration_ms: Date.now() - new Date(started_at).getTime(),
    }).eq('id', run?.id)

    return new Response(JSON.stringify({
      success: true,
      run_id: run?.id,
      items_collected,
      items_scored: scored.items_scored,
    }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }

  if (action === 'archive') {
    const id = url.searchParams.get('id')
    if (!id) return new Response(JSON.stringify({ error: 'id required' }), { status: 400, headers: corsHeaders })
    await supabase.from('saas_opportunities').update({ status: 'archived' }).eq('id', id)
    return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }

  if (action === 'flag') {
    const id = url.searchParams.get('id')
    if (!id) return new Response(JSON.stringify({ error: 'id required' }), { status: 400, headers: corsHeaders })
    await supabase.from('saas_opportunities').update({ status: 'flagged' }).eq('id', id)
    return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }

  return new Response(JSON.stringify({ error: `Unknown action: ${action}` }), {
    status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
})
