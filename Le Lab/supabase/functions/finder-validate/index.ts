import Anthropic from 'npm:@anthropic-ai/sdk@0.39.0'
import { createClient } from 'npm:@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

const SYSTEM_PROMPT = `Tu es un expert en validation d'idées SaaS et en analyse de marché.
L'utilisateur décrit une idée de micro-SaaS. Analyse-la avec de vraies données marché via web_search.

Réponds UNIQUEMENT avec un objet JSON valide, sans markdown, sans texte avant ou après :
{
  "title": "Titre court de l'idée (3-5 mots)",
  "market_score": 85,
  "competition_score": 70,
  "monetization_score": 90,
  "buildability_score": 75,
  "total_score": 80,
  "verdict": "GO",
  "recommendations": [
    "Recommandation concrète et actionnable 1",
    "Recommandation concrète et actionnable 2",
    "Recommandation concrète et actionnable 3"
  ],
  "sources": [{ "name": "Nom source", "url": "https://..." }]
}
Verdict : "GO" si total >= 70, "À AFFINER" si total entre 40-69, "PIVOT" si total < 40.
Chaque score est entre 0 et 100. total_score = moyenne des 4 scores.`

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { input } = await req.json()

    if (!input?.trim() || input.trim().length < 10) {
      return new Response(
        JSON.stringify({ error: 'Décris ton idée en quelques mots minimum' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    let userId: string | null = null
    const authHeader = req.headers.get('authorization')
    if (authHeader) {
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_ANON_KEY')!,
        { global: { headers: { Authorization: authHeader } } }
      )
      const { data: { user } } = await supabase.auth.getUser()
      userId = user?.id ?? null
    }

    const anthropic = new Anthropic({ apiKey: Deno.env.get('ANTHROPIC_API_KEY')! })
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      tools: [{ type: 'web_search_20250305', name: 'web_search' }],
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: input.trim() }],
    })

    const textBlock = message.content.findLast((b) => b.type === 'text')
    if (!textBlock || textBlock.type !== 'text') {
      throw new Error('Pas de réponse texte de Claude')
    }

    const cleaned = textBlock.text.replace(/```json\n?|\n?```/g, '').trim()
    const result = JSON.parse(cleaned)

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )
    await supabaseAdmin.from('finder_searches').insert({
      user_id: userId,
      mode: 'validate',
      input: input.trim(),
      result,
      score: result.total_score,
    })

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Erreur inconnue'
    return new Response(
      JSON.stringify({ error: msg }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
