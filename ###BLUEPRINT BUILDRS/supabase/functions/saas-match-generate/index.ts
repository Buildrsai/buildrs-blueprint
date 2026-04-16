// supabase/functions/saas-match-generate/index.ts
// Public edge function — no auth required (SaaS Match funnel, anonymous users)

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY')!

function buildPrompt(answers: Record<string, string>): string {
  return `Tu es l'expert en micro-SaaS de Buildrs. Ta méthode : PROBLÈME D'ABORD, solution ensuite.

Pas de source spécifique. Génère 3 idées originales adaptées au profil.

PROFIL DU BUILDER :
- Niche visée : ${answers.niche || 'flexible, toute niche'}
- Objectif : ${answers.goal === 'mrr' ? 'Revenus récurrents (MRR)' : answers.goal === 'flip' ? 'Revente rapide (Flip)' : 'Mission client (2k-10k€)'}
- Niveau : ${answers.level === 'beginner' ? 'Débutant complet' : answers.level === 'intermediate' ? 'Quelques bases IA/code' : 'A déjà lancé des projets'}
- Délai : ${answers.timeline || '2-3 semaines'}

MÉTHODE OBLIGATOIRE — pour chaque idée, raisonne dans cet ordre :
1. PROBLÈME RÉCURRENT : identifie un problème RÉEL et FRÉQUENT dans la niche. Pas un "nice to have" — un truc qui fait perdre du temps, de l'argent ou des clients CHAQUE SEMAINE.
2. FRICTION ACTUELLE : comment ces gens gèrent ce problème AUJOURD'HUI ? (Excel, papier, WhatsApp, outil trop cher, process manuel...).
3. SOLUTION SAAS : le micro-SaaS qui remplace cette friction. Simple, ciblé, une seule feature core.
4. PREUVE DE MARCHÉ : cite un concurrent qui existe (même partiel), un subreddit actif, un mot-clé Google, ou un budget existant.

RÈGLES :
- Niche ULTRA-PRÉCISE (ex: "studios de yoga 1-3 salles en France" pas juste "fitness")
- Le problème doit être RÉCURRENT (hebdo ou quotidien), pas ponctuel
- La cible doit DÉJÀ dépenser de l'argent ou du temps significatif sur ce problème
- Buildable avec Claude Code + Supabase + Stripe en ${answers.timeline || '2-3 semaines'}
- Prix réaliste entre 19€ et 299€/mois selon la valeur du problème résolu
- Si objectif flip : build_score >= 70, revente visée 5-20x MRR annuel
- Si objectif client : une cible entreprise claire avec budget connu
- Adapte la complexité au niveau du builder
- INTERDICTION de proposer des idées vagues — chaque idée doit résoudre UN problème précis

Réponds UNIQUEMENT en JSON valide :
{
  "ideas": [
    {
      "title": "string (nom court et percutant, ex: 'NoShow Killer pour kinés')",
      "target_niche": "string (niche très précise avec taille)",
      "problem_solved": "string (LE problème récurrent : QUI souffre, COMBIEN de fois par semaine, coût)",
      "current_friction": "string (comment ils gèrent aujourd'hui)",
      "market_proof": "string (preuve concrète : concurrent, subreddit, volume Google, budget cible)",
      "traction_score": number,
      "traction_explanation": "string",
      "buildability_score": number,
      "buildability_explanation": "string",
      "monetization_score": number,
      "monetization_explanation": "string",
      "build_score": number,
      "recommended_stack": ["string"],
      "mvp_features": ["string"],
      "pricing_suggestion": "string",
      "estimated_build_time": "string",
      "acquisition_channel": "string",
      "why_now": "string"
    }
  ]
}`
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const body = await req.json()
    const { answers } = body as { answers: Record<string, string> }

    if (!answers || !answers.niche) {
      return new Response(JSON.stringify({ error: 'answers.niche requis' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 8000,
        messages: [{ role: 'user', content: buildPrompt(answers) }],
      }),
    })

    if (!res.ok) {
      const errText = await res.text()
      console.error('[saas-match-generate] Claude API error:', errText)
      return new Response(JSON.stringify({ error: `Claude API ${res.status}` }), {
        status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const claudeData = await res.json() as {
      content?: { text: string }[]
      stop_reason?: string
      error?: { message: string }
    }

    if (claudeData.error) {
      return new Response(JSON.stringify({ error: `Claude: ${claudeData.error.message}` }), {
        status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const text = claudeData?.content?.[0]?.text ?? ''
    if (!text) {
      return new Response(JSON.stringify({ error: 'Empty response from model' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/)
    const bareObjectMatch = text.match(/\{[\s\S]*\}/)
    const rawJson = codeBlockMatch ? codeBlockMatch[1] : bareObjectMatch ? bareObjectMatch[0] : null

    if (!rawJson) {
      return new Response(JSON.stringify({ error: 'No JSON in response' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const parsed = JSON.parse(rawJson) as { ideas: unknown[] }

    if (!parsed.ideas || !Array.isArray(parsed.ideas) || parsed.ideas.length === 0) {
      return new Response(JSON.stringify({ error: 'No ideas in response' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('[saas-match-generate] Unhandled error:', err)
    return new Response(JSON.stringify({ error: `Unhandled: ${String(err)}` }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
