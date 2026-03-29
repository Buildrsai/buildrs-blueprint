import { createClient } from 'https://esm.sh/@supabase/supabase-js@2?target=deno'

const corsHeaders = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const SYSTEM_PROMPT = `Tu es un expert en analyse de viabilité de micro-SaaS et de startups bootstrap. Tu analyses des idées de produits SaaS soumises par des entrepreneurs individuels.

On va te donner 5 réponses à ces questions :
1. Description du produit en une phrase
2. Cible principale
3. Modèle de monétisation
4. Concurrents directs connus
5. Problème principal résolu

Analyse ces réponses et retourne un JSON (et RIEN d'autre, zéro texte avant ou après) avec cette structure exacte :
{
  "score": <number 0-100>,
  "criteria": {
    "marche": <number 0-20>,
    "concurrence": <number 0-20>,
    "faisabilite": <number 0-20>,
    "monetisation": <number 0-20>,
    "timing": <number 0-20>
  },
  "verdict": "<go|go_reserves|pivot>",
  "strengths": ["<point fort 1>", "<point fort 2>", "<point fort 3 optionnel>"],
  "weaknesses": ["<point faible 1>", "<point faible 2>", "<point faible 3 optionnel>"],
  "recommendations": ["<recommandation actionable 1>", "<recommandation actionable 2>", "<recommandation actionable 3 optionnel>"],
  "summary": "<2-3 phrases de synthèse globale>"
}

Règles de scoring :
- score = somme des 5 critères (chacun /20)
- marche : taille du marché adressable, nombre de personnes concernées, tendance
- concurrence : densité concurrentielle, différenciation possible, barrières à l'entrée
- faisabilite : complexité technique, possibilité de MVP en 72h avec des outils no-code/low-code + IA
- monetisation : willingness to pay prouvée, modèle viable, prix cohérent avec la cible
- timing : pertinence actuelle, lien avec l'IA ou une tendance forte, fenêtre d'opportunité

Verdict :
- "go" si score >= 75
- "go_reserves" si score >= 50 et < 75
- "pivot" si score < 50

Sois direct, concret, et orienté action. Pas de langue de bois. Écris en français. Retourne UNIQUEMENT le JSON, rien d'autre.`

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Parse body
    const body = await req.json().catch(() => ({}))
    const answers: string[] = body.answers ?? []

    if (!Array.isArray(answers) || answers.length !== 5) {
      return new Response(
        JSON.stringify({ error: 'Il faut exactement 5 réponses.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    // Auth — extract user from JWT
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

    // Quota check — count existing validations
    const { count } = await supabase
      .from('idea_validations')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)

    const plan: string = user.user_metadata?.buildrs_plan ?? 'blueprint'
    const isLimited = plan === 'blueprint'

    if (isLimited && (count ?? 0) >= 3) {
      return new Response(
        JSON.stringify({ error: 'quota_exceeded' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    // Build user message
    const userMessage = `Voici les réponses du porteur de projet :

1. Idée de produit : ${answers[0]}
2. Cible : ${answers[1]}
3. Monétisation : ${answers[2]}
4. Concurrents : ${answers[3]}
5. Problème résolu : ${answers[4]}`

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
        max_tokens: 1024,
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

    // Parse JSON — try once, retry with stricter instruction if fails
    let report: Record<string, unknown>
    try {
      report = JSON.parse(rawText.trim())
    } catch {
      // Strip any potential markdown code fences
      const cleaned = rawText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
      try {
        report = JSON.parse(cleaned)
      } catch {
        console.error('JSON parse failed:', rawText)
        return new Response(
          JSON.stringify({ error: 'Réponse IA invalide, réessaie.' }),
          { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        )
      }
    }

    const score = typeof report.score === 'number' ? report.score : 0

    // Save to idea_validations
    const { error: insertError } = await supabase
      .from('idea_validations')
      .insert({
        user_id: user.id,
        answers: answers,
        score: score,
        report: report,
      })

    if (insertError) {
      console.error('Insert error:', insertError)
    }

    // Update user metadata — fire and forget (non-blocking)
    supabase.auth.admin.updateUserById(user.id, {
      user_metadata: { ...user.user_metadata, buildrs_validator_score: score },
    }).catch((e) => console.error('updateUserById error:', e))

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
