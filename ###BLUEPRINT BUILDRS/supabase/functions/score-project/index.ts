import { createClient } from 'https://esm.sh/@supabase/supabase-js@2?target=deno'

const corsHeaders = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const SYSTEM_PROMPT = `Tu es un expert en analyse de viabilité de micro-SaaS. Tu analyses une idée de projet soumise par un entrepreneur solo (pas de budget, pas d'équipe technique, stack moderne avec Claude Code + Supabase + Vercel).

Utilise l'outil de recherche web pour trouver des informations sur les concurrents réels et le marché. Cherche d'abord le nom du projet ou du problème, puis les concurrents potentiels.

Retourne UNIQUEMENT un JSON valide (zéro texte avant ou après) avec cette structure exacte :
{
  "score": <number 0-100>,
  "verdict": "<GO|PIVOT|STOP>",
  "summary": "<2-3 phrases de synthèse directe et actionnable>",
  "strengths": ["<point fort 1>", "<point fort 2>", "<point fort 3 optionnel>"],
  "warnings": ["<risque 1>", "<risque 2>", "<risque 3 optionnel>"],
  "criteria": [
    { "label": "Taille du marché", "score": <0-20>, "comment": "<explication courte>" },
    { "label": "Concurrence", "score": <0-20>, "comment": "<explication courte>" },
    { "label": "Faisabilité solo", "score": <0-20>, "comment": "<explication courte>" },
    { "label": "Monétisation", "score": <0-20>, "comment": "<explication courte>" },
    { "label": "Timing", "score": <0-20>, "comment": "<explication courte>" }
  ],
  "competitors": [
    { "name": "<nom>", "url": "<url optionnel>", "differentiator": "<comment se différencier de lui en 1 phrase>" }
  ],
  "mrr_estimate": { "low": <number>, "high": <number>, "currency": "EUR" },
  "next_step": "<action concrète la plus urgente à faire maintenant, en 1 phrase>"
}

Règles :
- score = somme des 5 critères /20
- verdict : GO si >= 70, PIVOT si >= 45, STOP sinon
- 1 à 3 concurrents réels (pas inventés — utilise la recherche web)
- mrr_estimate : fourchette réaliste à 6 mois pour un solopreneur
- Écris en français. Sois direct, pas de langue de bois.`

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const body = await req.json().catch(() => ({}))
    const { project_id, project_name, problem } = body as {
      project_id: string
      project_name: string
      problem: string
    }

    if (!project_id || !project_name || !problem) {
      return new Response(
        JSON.stringify({ error: 'project_id, project_name et problem sont requis.' }),
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

    // Verify project belongs to user
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('id')
      .eq('id', project_id)
      .eq('user_id', user.id)
      .maybeSingle()

    if (projectError || !project) {
      return new Response(
        JSON.stringify({ error: 'Projet introuvable.' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    // Call Claude API with web_search tool
    const userMessage = `Analyse cette idée de micro-SaaS :

Nom du projet : ${project_name}
Problème résolu : ${problem}

Cherche les concurrents réels sur le web, puis fournis ton analyse complète en JSON.`

    const claudeRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': anthropicKey,
        'anthropic-version': '2023-06-01',
        'anthropic-beta': 'web-search-2025-03-05',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: 2048,
        system: SYSTEM_PROMPT,
        tools: [
          {
            type: 'web_search_20250305',
            name: 'web_search',
          },
        ],
        messages: [{ role: 'user', content: userMessage }],
      }),
    })

    if (!claudeRes.ok) {
      const errText = await claudeRes.text()
      console.error('Claude API error:', claudeRes.status, errText)
      return new Response(
        JSON.stringify({ error: 'Erreur IA, réessaie dans un instant.' }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    const claudeData = await claudeRes.json()

    // Extract the last text block (after potential tool calls)
    const textBlocks = (claudeData.content ?? []).filter((b: { type: string }) => b.type === 'text')
    const rawText: string = textBlocks[textBlocks.length - 1]?.text ?? ''

    // Parse JSON
    let report: Record<string, unknown>
    try {
      report = JSON.parse(rawText.trim())
    } catch {
      const cleaned = rawText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
      try {
        report = JSON.parse(cleaned)
      } catch {
        console.error('JSON parse failed. Raw text:', rawText)
        return new Response(
          JSON.stringify({ error: 'Réponse IA invalide, réessaie.' }),
          { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        )
      }
    }

    const score = typeof report.score === 'number' ? report.score : 0

    // Save to projects table
    const { error: updateError } = await supabase
      .from('projects')
      .update({
        viability_score: score,
        viability_report: report,
      })
      .eq('id', project_id)
      .eq('user_id', user.id)

    if (updateError) {
      console.error('Update project error:', updateError)
    }

    // Also save to user_missions — auto-complete 'validate' mission
    await supabase
      .from('user_missions')
      .update({ completed: true, completed_at: new Date().toISOString() })
      .eq('user_id', user.id)
      .eq('mission_id', 'validate')

    // Update legacy user_metadata for backward compat
    supabase.auth.admin.updateUserById(user.id, {
      user_metadata: {
        ...user.user_metadata,
        buildrs_validator_score: score,
        buildrs_mrr_estimate: report.mrr_estimate
          ? `${(report.mrr_estimate as Record<string, number>).low}–${(report.mrr_estimate as Record<string, number>).high}€`
          : null,
      },
    }).catch((e: Error) => console.error('updateUserById error:', e))

    return new Response(
      JSON.stringify(report),
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
