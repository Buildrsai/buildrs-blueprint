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

  return `Tu es l'expert en micro-SaaS de Buildrs. Génère 3 opportunités PERSONNALISÉES et ACTIONNABLES.

${sourceBlock}

PROFIL DU BUILDER :
- Niche visée : ${answers.niche || 'flexible, toute niche'}
- Objectif : ${answers.goal === 'mrr' ? 'Revenus récurrents (MRR)' : answers.goal === 'flip' ? 'Revente rapide (Flip)' : 'Mission client (2k-10k€)'}
- Niveau : ${answers.level === 'beginner' ? 'Débutant complet' : answers.level === 'intermediate' ? 'Quelques bases IA/code' : 'A déjà lancé des projets'}
- Délai : ${answers.timeline || '2-3 semaines'}

RÈGLES ABSOLUES :
- Buildable avec Claude Code + Supabase + Stripe en ${answers.timeline || '2-3 semaines'}
- Niche TRÈS précise (ex: "cabinets dentaires 5-10 praticiens" pas juste "santé")
- Prix réaliste entre 19€ et 299€/mois selon la niche
- Si objectif flip : build_score >= 70, revente visée 5-20x MRR annuel
- Si objectif client : une cible entreprise claire avec budget connu
- Adapte la complexité au niveau du builder

Réponds UNIQUEMENT en JSON valide :
{
  "ideas": [
    {
      "title": "string (nom court et percutant, ex: 'Agent RDV pour kinés')",
      "target_niche": "string (niche très précise en français)",
      "problem_solved": "string (1 phrase : QUI a le problème et POURQUOI)",
      "traction_score": number (0-100, demande marché prouvée),
      "traction_explanation": "string (1 phrase avec preuve concrète)",
      "buildability_score": number (0-100, facilité de construction),
      "buildability_explanation": "string (1 phrase : ce qu'il faut construire exactement)",
      "monetization_score": number (0-100, potentiel revenus),
      "monetization_explanation": "string (1 phrase : qui paie, combien, pourquoi)",
      "build_score": number (0-100, score global = t*0.3 + b*0.4 + m*0.3),
      "recommended_stack": ["string (4 outils max: Claude Code, Supabase, Stripe, Vercel, Resend, etc.)"],
      "mvp_features": ["string (4 features clés, descriptions simples et actionnables)"],
      "pricing_suggestion": "string (ex: '49€/mois par praticien')",
      "estimated_build_time": "string (ex: '7-10 jours')",
      "acquisition_channel": "string (canal principal concret pour atteindre cette niche)",
      "why_now": "string (1 phrase : pourquoi 2026 est le bon moment)"
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
        max_tokens: 4000,
        messages: [{ role: 'user', content: buildPrompt(source, answers) }],
      }),
    })

    if (!res.ok) {
      const errText = await res.text()
      console.error('[generator-recommend] Claude API error:', errText)
      return new Response(JSON.stringify({ error: 'Erreur IA, réessaie.' }), {
        status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const data = await res.json()
    const text: string = data?.content?.[0]?.text ?? ''
    const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) || text.match(/(\{[\s\S]*\})/)
    if (!jsonMatch) {
      console.error('[generator-recommend] No JSON in response:', text.slice(0, 200))
      throw new Error('Réponse non-JSON de Claude')
    }

    const parsed = JSON.parse(jsonMatch[1] || jsonMatch[0]) as { ideas: unknown[] }

    // Save session (fire and forget)
    supabaseService.from('generator_sessions').insert({
      user_id:    user.id,
      mode:       source ? 'copy' : 'find',
      input_data: { source, answers },
      output_data: parsed,
    }).catch((e: unknown) => console.error('[generator-recommend] Session save error:', e))

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('[generator-recommend] Unhandled error:', err)
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
