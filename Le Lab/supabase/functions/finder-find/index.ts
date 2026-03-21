import Anthropic from 'npm:@anthropic-ai/sdk@0.39.0'
import { createClient } from 'npm:@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

const SYSTEM_PROMPT = `Tu es un expert en micro-SaaS et validation de marché.
À partir d'un domaine ou problème donné, génère exactement 3 idées de micro-SaaS viables.
Utilise web_search pour trouver des données réelles : concurrents existants, fourchettes de prix, tendances marché.

Réponds UNIQUEMENT avec un tableau JSON valide, sans markdown, sans texte avant ou après :
[
  {
    "title": "Nom de l'idée",
    "problem": "Problème résolu en une phrase",
    "audience": "Cible précise (ex: freelances graphistes)",
    "competition": "Faible | Moyen | Élevé",
    "competitors": [{ "name": "Nom concurrent", "weaknesses": ["faiblesse 1"] }],
    "pricing_estimate": "Ex: 29€/mois",
    "build_time": "Ex: 4-6 semaines",
    "sources": [{ "name": "Nom source", "url": "https://..." }],
    "score": 85,
    "verdict": "GO"
  }
]
Verdict : "GO" si score >= 70, "À AFFINER" si score entre 40-69, "PIVOT" si score < 40.`

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { input } = await req.json()

    if (!input?.trim() || input.trim().length < 3) {
      return new Response(
        JSON.stringify({ error: 'Input trop court (minimum 3 caractères)' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Extraire user_id depuis le JWT si présent
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

    // Appel Anthropic avec web search
    const anthropic = new Anthropic({ apiKey: Deno.env.get('ANTHROPIC_API_KEY')! })
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      tools: [{ type: 'web_search_20250305', name: 'web_search' }],
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: input.trim() }],
    })

    // Extraire le dernier bloc texte (après les éventuels tool_use)
    const textBlock = message.content.findLast((b) => b.type === 'text')
    if (!textBlock || textBlock.type !== 'text') {
      throw new Error('Pas de réponse texte de Claude')
    }

    // Nettoyer les éventuels backticks markdown et parser
    const cleaned = textBlock.text.replace(/```json\n?|\n?```/g, '').trim()
    const results = JSON.parse(cleaned)

    // Sauvegarder dans finder_searches
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )
    const avgScore = Math.round(
      results.reduce((sum: number, r: { score: number }) => sum + r.score, 0) / results.length
    )
    await supabaseAdmin.from('finder_searches').insert({
      user_id: userId,
      mode: 'find',
      input: input.trim(),
      result: results,
      score: avgScore,
    })

    return new Response(JSON.stringify(results), {
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
