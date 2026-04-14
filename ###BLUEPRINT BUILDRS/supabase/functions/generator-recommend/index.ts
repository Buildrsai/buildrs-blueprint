// supabase/functions/generator-recommend/index.ts
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const SUPABASE_URL       = Deno.env.get('SUPABASE_URL')!
const SUPABASE_ANON_KEY  = Deno.env.get('SUPABASE_ANON_KEY')!
const SUPABASE_SVC_KEY   = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const ANTHROPIC_API_KEY  = Deno.env.get('ANTHROPIC_API_KEY')!

function buildPrompt(source: Record<string, unknown> | null, answers: Record<string, string>): string {
  const sourceBlock = source
    ? `SAAS SOURCE D'INSPIRATION (idée validée sur le marché) :
- Nom: ${source.name}
- Catégorie: ${source.category}
- Tagline: ${source.tagline ?? 'N/A'}
- Opportunité identifiée: ${source.opportunity_title ?? 'N/A'}
- Niche suggérée: ${source.target_niche ?? 'N/A'}
- Build Score existant: ${source.build_score ?? 'N/A'}/100

La 1ère idée DOIT s'inspirer directement de ce SaaS, adaptée au profil du builder.
Les 2 autres idées peuvent être complémentaires ou différentes.`
    : `Pas de source spécifique. Génère 3 idées originales adaptées au profil.`

  return `Tu es l'expert en micro-SaaS de Buildrs. Ta méthode : PROBLÈME D'ABORD, solution ensuite.

${sourceBlock}

PROFIL DU BUILDER :
- Niche visée : ${answers.niche || 'flexible, toute niche'}
- Objectif : ${answers.goal === 'mrr' ? 'Revenus récurrents (MRR)' : answers.goal === 'flip' ? 'Revente rapide (Flip)' : 'Mission client (2k-10k€)'}
- Niveau : ${answers.level === 'beginner' ? 'Débutant complet' : answers.level === 'intermediate' ? 'Quelques bases IA/code' : 'A déjà lancé des projets'}
- Délai : ${answers.timeline || '2-3 semaines'}

MÉTHODE OBLIGATOIRE — pour chaque idée, raisonne dans cet ordre :
1. PROBLÈME RÉCURRENT : identifie un problème RÉEL et FRÉQUENT dans la niche. Pas un "nice to have" — un truc qui fait perdre du temps, de l'argent ou des clients CHAQUE SEMAINE.
2. FRICTION ACTUELLE : comment ces gens gèrent ce problème AUJOURD'HUI ? (Excel, papier, WhatsApp, outil trop cher, process manuel...). C'est la preuve qu'il y a un marché.
3. SOLUTION SAAS : le micro-SaaS qui remplace cette friction. Simple, ciblé, une seule feature core qui résout LE problème.
4. PREUVE DE MARCHÉ : cite un concurrent qui existe (même partiel), un subreddit actif, un mot-clé Google avec du volume, ou un budget déjà dépensé par la cible.

RÈGLES :
- Niche ULTRA-PRÉCISE (ex: "studios de yoga 1-3 salles en France" pas juste "fitness")
- Le problème doit être RÉCURRENT (hebdo ou quotidien), pas ponctuel
- La cible doit DÉJÀ dépenser de l'argent ou du temps significatif sur ce problème
- Buildable avec Claude Code + Supabase + Stripe en ${answers.timeline || '2-3 semaines'}
- Prix réaliste entre 19€ et 299€/mois selon la valeur du problème résolu
- Si objectif flip : build_score >= 70, revente visée 5-20x MRR annuel
- Si objectif client : une cible entreprise claire avec budget connu
- Adapte la complexité au niveau du builder
- INTERDICTION de proposer des idées vagues ("outil de gestion", "plateforme de...") — chaque idée doit résoudre UN problème précis

Réponds UNIQUEMENT en JSON valide :
{
  "ideas": [
    {
      "title": "string (nom court et percutant, ex: 'NoShow Killer pour kinés')",
      "target_niche": "string (niche très précise avec taille : ex 'kinés libéraux 1-2 cabinets, ~80 000 en France')",
      "problem_solved": "string (LE problème récurrent : QUI souffre, COMBIEN de fois par semaine, et combien ça coûte)",
      "current_friction": "string (comment ils gèrent aujourd'hui : quel outil/process manuel/workaround)",
      "market_proof": "string (preuve concrète : concurrent existant, subreddit, volume Google, budget existant de la cible)",
      "traction_score": number (0-100, basé sur la preuve de marché réelle),
      "traction_explanation": "string (1 phrase : pourquoi la demande est prouvée, avec donnée concrète)",
      "buildability_score": number (0-100, facilité de construction),
      "buildability_explanation": "string (1 phrase : ce qu'il faut construire exactement pour le MVP)",
      "monetization_score": number (0-100, potentiel revenus),
      "monetization_explanation": "string (1 phrase : qui paie, combien, et pourquoi ce prix est évident vu le problème résolu)",
      "build_score": number (0-100, score global = t*0.3 + b*0.4 + m*0.3),
      "recommended_stack": ["string (4 outils max: Claude Code, Supabase, Stripe, Vercel, Resend, etc.)"],
      "mvp_features": ["string (4 features clés — la 1ère DOIT être la feature qui résout le problème core)"],
      "pricing_suggestion": "string (ex: '49€/mois — économise 3h/semaine au kiné soit ~150€ de valeur')",
      "estimated_build_time": "string (ex: '7-10 jours')",
      "acquisition_channel": "string (canal principal concret : OÙ ces gens traînent et comment les atteindre)",
      "why_now": "string (1 phrase : pourquoi 2026 est le bon moment — IA, régulation, tendance marché)"
    }
  ]
}`
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    // ── Auth — pattern recommandé Supabase edge functions ──────────────────────
    const authHeader = req.headers.get('Authorization') ?? ''
    if (!authHeader) {
      console.error('[generator-recommend] Missing Authorization header')
      return new Response(JSON.stringify({ error: 'Non authentifié' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Client user-scoped pour vérifier le JWT (pattern recommandé)
    const supabaseUser = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
      auth: { autoRefreshToken: false, persistSession: false },
    })
    const { data: { user }, error: authError } = await supabaseUser.auth.getUser()
    if (authError || !user) {
      console.error('[generator-recommend] Auth failed:', authError?.message ?? 'no user')
      return new Response(JSON.stringify({ error: 'Non authentifié' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Client service role pour les écritures DB
    const supabaseService = createClient(SUPABASE_URL, SUPABASE_SVC_KEY, {
      auth: { autoRefreshToken: false, persistSession: false },
    })

    // ── Body ───────────────────────────────────────────────────────────────────
    const body = await req.json()
    const { source, answers } = body as {
      source: Record<string, unknown> | null
      answers: Record<string, string>
    }

    // ── Claude claude-sonnet-4-6 ───────────────────────────────────────────────
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
        messages: [{ role: 'user', content: buildPrompt(source, answers) }],
      }),
    })

    if (!res.ok) {
      const errText = await res.text()
      console.error('[generator-recommend] Claude API error:', errText)
      return new Response(JSON.stringify({ error: `Claude API ${res.status}: ${errText.slice(0, 200)}` }), {
        status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // ── Parse Claude response ─────────────────────────────────────────────────
    let claudeData: { content?: { text: string }[]; stop_reason?: string; error?: { message: string } }
    try {
      claudeData = await res.json()
    } catch (e) {
      return new Response(JSON.stringify({ error: `Claude response not JSON: ${e}` }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Handle Claude-level errors (e.g. overload, invalid request)
    if (claudeData.error) {
      console.error('[generator-recommend] Claude error in body:', claudeData.error)
      return new Response(JSON.stringify({ error: `Claude: ${claudeData.error.message}` }), {
        status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const text: string = claudeData?.content?.[0]?.text ?? ''
    console.log('[generator-recommend] stop_reason:', claudeData?.stop_reason, '| text length:', text.length)

    if (!text) {
      console.error('[generator-recommend] Empty text. Full response:', JSON.stringify(claudeData).slice(0, 500))
      return new Response(JSON.stringify({ error: `Empty response from model. stop_reason: ${claudeData?.stop_reason}` }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // ── Extract JSON ─────────────────────────────────────────────────────────
    const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/)
    const bareObjectMatch = text.match(/\{[\s\S]*\}/)
    const rawJson = codeBlockMatch ? codeBlockMatch[1] : bareObjectMatch ? bareObjectMatch[0] : null

    if (!rawJson) {
      console.error('[generator-recommend] No JSON found. Text preview:', text.slice(0, 300))
      return new Response(JSON.stringify({ error: `No JSON in response. Preview: ${text.slice(0, 200)}` }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    let parsed: { ideas: unknown[] }
    try {
      parsed = JSON.parse(rawJson) as { ideas: unknown[] }
    } catch (e) {
      console.error('[generator-recommend] JSON.parse failed. rawJson preview:', rawJson.slice(0, 300))
      return new Response(JSON.stringify({ error: `JSON parse error: ${e}. Preview: ${rawJson.slice(0, 200)}` }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (!parsed.ideas || !Array.isArray(parsed.ideas) || parsed.ideas.length === 0) {
      console.error('[generator-recommend] No ideas in parsed result:', JSON.stringify(parsed).slice(0, 300))
      return new Response(JSON.stringify({ error: `No ideas in response. Keys: ${Object.keys(parsed).join(', ')}` }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // ── Save session (fire and forget) ────────────────────────────────────────
    void Promise.resolve(
      supabaseService.from('generator_sessions').insert({
        user_id:    user.id,
        mode:       source ? 'copy' : 'find',
        input_data: { source, answers },
        output_data: parsed,
      })
    ).catch((e: unknown) => console.error('[generator-recommend] Session save error:', e))

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('[generator-recommend] Unhandled error:', err)
    return new Response(JSON.stringify({ error: `Unhandled: ${String(err)}` }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
