import { createClient } from 'https://esm.sh/@supabase/supabase-js@2?target=deno'

const corsHeaders = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const SYSTEM_PROMPT = `Tu es un expert en micro-SaaS B2B. Tu génères des idées de micro-SaaS rentables et buildables en 72h avec Claude Code.

On te donne le profil d'un entrepreneur :
- Secteur/expertise
- Niveau technique
- Budget disponible
- Stratégie choisie
- Contexte optionnel

Génère exactement 5 idées de micro-SaaS adaptées à ce profil et retourne UNIQUEMENT ce JSON (zéro texte avant ou après) :
{
  "ideas": [
    {
      "name": "<nom produit>",
      "tagline": "<accroche 1 phrase max>",
      "problem": "<problème précis résolu en 1 phrase>",
      "target": "<cible principale>",
      "price": "<prix mensuel ex: 19€/mois>",
      "mrr_potential": "<fourchette MRR ex: 1 500–5 000€>",
      "difficulty": "<facile|moyen|difficile>",
      "score": <number 0-100>,
      "why_now": "<pourquoi ce moment est idéal, 1-2 phrases>"
    }
  ]
}

Règles de scoring (0-100) : taille marché adressable + concurrence existante + faisabilité 72h avec Claude Code + willingness to pay prouvée + timing IA/2026.

Règles de difficulté :
- "facile" : CRUD + IA, buildable en 24-48h
- "moyen" : intégrations multiples, buildable en 48-72h
- "difficile" : architecture complexe, > 72h

Les idées doivent :
- Être en français (noms produits en anglais ok)
- Être buildables avec : Supabase + Vercel + Stripe + Resend + Claude API
- Correspondre au profil donné (secteur, niveau, budget)
- Avoir un MRR potentiel réaliste pour le marché français

Retourne UNIQUEMENT le JSON. Rien d'autre.`

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const body = await req.json().catch(() => ({}))
    const { secteur, niveau, budget, strategie, contexte } = body

    if (!secteur || !niveau || !budget || !strategie) {
      return new Response(
        JSON.stringify({ error: 'Champs requis manquants.' }),
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

    // Quota check — 5 générations max pour plan blueprint
    const { count } = await supabase
      .from('idea_generations')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)

    const plan: string = user.user_metadata?.buildrs_plan ?? 'blueprint'
    if (plan === 'blueprint' && (count ?? 0) >= 5) {
      return new Response(
        JSON.stringify({ error: 'quota_exceeded' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    // Build user message
    const userMessage = `Profil de l'entrepreneur :
- Secteur/expertise : ${secteur}
- Niveau technique : ${niveau}
- Budget disponible : ${budget}
- Stratégie : ${strategie}${contexte ? `\n- Contexte : ${contexte}` : ''}`

    // Call Claude
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
    let result: { ideas: unknown[] }
    try {
      result = JSON.parse(rawText.trim())
    } catch {
      const cleaned = rawText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
      try {
        result = JSON.parse(cleaned)
      } catch {
        console.error('JSON parse failed:', rawText)
        return new Response(
          JSON.stringify({ error: 'Réponse IA invalide, réessaie.' }),
          { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        )
      }
    }

    // Save to idea_generations (fire and forget)
    supabase.from('idea_generations').insert({
      user_id: user.id,
      inputs: { secteur, niveau, budget, strategie, contexte },
      ideas: result.ideas ?? [],
    }).catch((e) => console.error('Insert error:', e))

    return new Response(
      JSON.stringify(result),
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
