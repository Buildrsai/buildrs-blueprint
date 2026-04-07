// supabase/functions/validator-analyze/index.ts
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2?target=deno'

const corsHeaders = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const SYSTEM_PROMPT = `Tu es un expert en analyse de marché pour les micro-SaaS et startups bootstrap. Tu aides des entrepreneurs à valider leurs idées de produits digitaux.

On te donne une idée de micro-SaaS avec sa catégorie, sa cible, et son modèle de prix envisagé.

Analyse cette idée et retourne UNIQUEMENT un JSON valide avec cette structure exacte (zéro texte avant ou après) :

{
  "demand_score": <entier 0-100>,
  "competition_level": "<low|medium|high>",
  "feasibility_score": <entier 0-100>,
  "revenue_score": <entier 0-100>,
  "demand_insight": "<1-2 phrases sur la demande marché>",
  "competition_insight": "<1-2 phrases sur la concurrence>",
  "feasibility_insight": "<1-2 phrases sur la faisabilité MVP 72h>",
  "revenue_insight": "<1-2 phrases sur le potentiel de revenus>",
  "competitors_found": [
    { "name": "<nom>", "url": "<domaine.com>", "note": "<1 phrase en français>" }
  ]
}

Règles de scoring :
- demand_score (0-100) : taille du marché adressable, volume de recherches, tendance croissante
- competition_level : low = moins de 3 concurrents établis · medium = 3-10 · high = plus de 10 ou géants présents (Calendly, HubSpot, etc.)
- feasibility_score (0-100) : MVP réalisable en 72h avec Claude Code + Supabase + Stripe ? 100 = absolument, 0 = impossible
- revenue_score (0-100) : willingness to pay prouvée, MRR potentiel réaliste, modèle viable avec la cible donnée
- competitors_found : liste 2-5 concurrents réels que tu connais, du plus direct au plus indirect

Sois direct, réaliste, sans optimisme béat. Écris en français. Retourne UNIQUEMENT le JSON.`

function computeVerdict(
  demand: number,
  competition: string,
  feasibility: number,
): 'go' | 'caution' | 'stop' {
  if (demand >= 60 && feasibility >= 60 && competition !== 'high') return 'go'
  if (demand >= 40 && feasibility >= 50) return 'caution'
  return 'stop'
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const body = await req.json().catch(() => ({}))
    const { idea_description, category, target_audience, pricing_model } = body

    if (!idea_description?.trim()) {
      return new Response(
        JSON.stringify({ error: 'idea_description est requis.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    // Auth
    const authHeader = req.headers.get('Authorization') ?? ''
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const anthropicKey = Deno.env.get('ANTHROPIC_API_KEY')!

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

    // Build user message
    const userMessage = `Idée à analyser :
Description : ${idea_description}
Catégorie : ${category ?? 'non précisée'}
Cible : ${target_audience ?? 'non précisée'}
Modèle de prix : ${pricing_model ?? 'non précisé'}`

    // Call Claude Sonnet
    const claudeRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': anthropicKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1500,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: userMessage }],
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
    const rawText: string = claudeData.content?.[0]?.text ?? ''

    // Parse JSON
    let analysis: Record<string, unknown>
    try {
      analysis = JSON.parse(rawText.trim())
    } catch {
      const cleaned = rawText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
      try {
        analysis = JSON.parse(cleaned)
      } catch {
        console.error('JSON parse failed:', rawText)
        return new Response(
          JSON.stringify({ error: 'Réponse IA invalide, réessaie.' }),
          { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        )
      }
    }

    const demand_score      = typeof analysis.demand_score      === 'number' ? analysis.demand_score      : 0
    const competition_level = typeof analysis.competition_level === 'string' ? analysis.competition_level : 'medium'
    const feasibility_score = typeof analysis.feasibility_score === 'number' ? analysis.feasibility_score : 0
    const revenue_score     = typeof analysis.revenue_score     === 'number' ? analysis.revenue_score     : 0
    const verdict           = computeVerdict(demand_score, competition_level, feasibility_score)

    const insights = {
      demand:      analysis.demand_insight      ?? null,
      competition: analysis.competition_insight ?? null,
      feasibility: analysis.feasibility_insight ?? null,
      revenue:     analysis.revenue_insight     ?? null,
    }

    // Save to validator_sessions
    const { data: session, error: insertError } = await supabase
      .from('validator_sessions')
      .insert({
        user_id:           user.id,
        idea_description:  idea_description.trim(),
        category:          category ?? null,
        target_audience:   target_audience ?? null,
        pricing_model:     pricing_model ?? null,
        demand_score,
        competition_level,
        feasibility_score,
        revenue_score,
        verdict,
        competitors_found: analysis.competitors_found ?? [],
        insights,
      })
      .select('id')
      .single()

    if (insertError) {
      console.error('Insert error:', insertError)
    }

    return new Response(
      JSON.stringify({
        session_id:        session?.id ?? null,
        demand_score,
        competition_level,
        feasibility_score,
        revenue_score,
        verdict,
        competitors_found: analysis.competitors_found ?? [],
        insights,
      }),
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
