import { createClient } from 'https://esm.sh/@supabase/supabase-js@2?target=deno'
import { getAgentPrompt } from '../_shared/agent-prompts.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Max tokens par agent (livrables longs = plus de tokens)
const MAX_TOKENS: Record<string, number> = {
  validator: 1500,
  planner:   2000,
  designer:  2000,
  architect: 2500,
  builder:   2500,
  launcher:  2500,
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const body = await req.json().catch(() => ({}))
    const agentId: string  = body.agentId ?? ''
    const message: string  = body.message ?? ''
    // history = [{role: 'user'|'assistant', content: string}]
    const history: { role: string; content: string }[] = body.history ?? []
    const projectContext: string | undefined = body.projectContext || undefined

    if (!agentId || !message.trim()) {
      return new Response(
        JSON.stringify({ error: 'agentId et message requis.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    const systemPrompt = getAgentPrompt(agentId)
    if (!systemPrompt) {
      return new Response(
        JSON.stringify({ error: `Agent inconnu : ${agentId}` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    // Auth
    const authHeader = req.headers.get('Authorization') ?? ''
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    })

    const { data: { user }, error: userError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', ''),
    )

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Non authentifié.' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    // Rate limit — 50 messages/jour pour les agents (partagé tous agents)
    const meta = user.user_metadata ?? {}
    const today = new Date().toDateString()
    const dailyCount: number = meta.agents_daily_reset === today ? (meta.agents_daily_count ?? 0) : 0
    const hasPack: boolean = meta.has_agents_pack === true

    if (dailyCount >= 50) {
      return new Response(
        JSON.stringify({ error: 'quota_exceeded' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    // Validator monthly limit — 3/mois pour les Blueprint users (pas de pack)
    const thisMonth = new Date().toISOString().slice(0, 7) // 'YYYY-MM'
    if (agentId === 'validator' && !hasPack) {
      const monthlyCount: number = meta.buildrs_validator_monthly_reset === thisMonth
        ? (meta.buildrs_validator_monthly_count ?? 0)
        : 0
      if (monthlyCount >= 3) {
        return new Response(
          JSON.stringify({ error: 'validator_quota_exceeded' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        )
      }
    }

    // Build messages array (history + current message)
    const messages = [
      ...history.map(m => ({ role: m.role, content: m.content })),
      { role: 'user', content: message },
    ]

    // Call Claude API
    const anthropicKey = Deno.env.get('ANTHROPIC_API_KEY')!
    const claudeRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': anthropicKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: MAX_TOKENS[agentId] ?? 1500,
        system: projectContext ? `${systemPrompt}\n\n${projectContext}` : systemPrompt,
        messages,
      }),
    })

    if (!claudeRes.ok) {
      const errText = await claudeRes.text()
      console.error('Claude API error:', errText)
      return new Response(
        JSON.stringify({ error: 'Erreur IA, réessaie dans un instant.' }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    const claudeData = await claudeRes.json()
    const responseText: string = claudeData.content?.[0]?.text ?? ''

    // Increment counters (fire and forget)
    const updatedMeta: Record<string, unknown> = {
      ...meta,
      agents_daily_count: dailyCount + 1,
      agents_daily_reset: today,
    }
    if (agentId === 'validator' && !hasPack) {
      const monthlyCount: number = meta.buildrs_validator_monthly_reset === thisMonth
        ? (meta.buildrs_validator_monthly_count ?? 0)
        : 0
      updatedMeta.buildrs_validator_monthly_count = monthlyCount + 1
      updatedMeta.buildrs_validator_monthly_reset = thisMonth
    }
    supabase.auth.admin.updateUserById(user.id, {
      user_metadata: updatedMeta,
    }).catch((e) => console.error('updateUserById error:', e))

    return new Response(
      JSON.stringify({ response: responseText }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  } catch (err) {
    console.error('Unexpected error:', err)
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : 'Erreur serveur' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  }
})
