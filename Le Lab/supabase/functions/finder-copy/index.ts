import Anthropic from 'npm:@anthropic-ai/sdk@0.39.0'
import { createClient } from 'npm:@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

const SYSTEM_PROMPT = `Tu es un expert en stratégie produit et en veille concurrentielle SaaS.
L'utilisateur donne le nom d'un produit SaaS. Utilise web_search pour trouver : pricing actuel, avis clients négatifs, faiblesses connues.
Puis génère exactement 3 adaptations niche différenciées et viables.

Réponds UNIQUEMENT avec un objet JSON valide, sans markdown, sans texte avant ou après :
{
  "product_name": "Nom du produit analysé",
  "what_it_does": "Ce que fait le produit en 1 phrase",
  "pricing": "Pricing actuel (ex: 8-16$/mois)",
  "weaknesses": ["Faiblesse exploitable 1", "Faiblesse exploitable 2", "Faiblesse exploitable 3"],
  "angles": [
    {
      "title": "Nom de l'adaptation",
      "niche": "Niche cible précise",
      "description": "Comment se différencier en 2 phrases concrètes",
      "score": 85,
      "verdict": "GO"
    }
  ],
  "mvp_scope": "Description du MVP minimal en 2 phrases"
}
Verdict par angle : "GO" si score >= 70, "À AFFINER" si entre 40-69, "PIVOT" si < 40.`

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { input } = await req.json()

    if (!input?.trim()) {
      return new Response(
        JSON.stringify({ error: "Donne le nom d'un produit SaaS" }),
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
    const bestScore = Math.max(...(result.angles ?? []).map((a: { score: number }) => a.score))
    await supabaseAdmin.from('finder_searches').insert({
      user_id: userId,
      mode: 'copy',
      input: input.trim(),
      result,
      score: bestScore,
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
