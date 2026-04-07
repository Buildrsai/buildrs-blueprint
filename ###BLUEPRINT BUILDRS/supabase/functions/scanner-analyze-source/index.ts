// supabase/functions/scanner-analyze-source/index.ts
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-scanner-token',
}

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const SCANNER_AUTH_TOKEN = Deno.env.get('SCANNER_AUTH_TOKEN') ?? ''
const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY')!

function buildAnalysisPrompt(source: Record<string, unknown>): string {
  return `SYSTEME :
Tu es l'analyste SaaS de Buildrs. Tu analyses un VRAI SaaS qui existe et fonctionne sur le marche.
Ton travail : proposer une OPPORTUNITE DE CLONE pour un builder non-developpeur.
L'opportunite decrit comment adapter ce SaaS pour une niche specifique, en plus simple.

REGLE CRITIQUE — CE QU'EST UNE BONNE OPPORTUNITE BUILDRS :
- Un angle de niche precise : pas "comme Calendly" mais "Calendly pour professeurs de yoga en ligne"
- Constructible en 7-21 jours avec Claude Code + Supabase + Stripe
- La cloneability mesure la SIMPLICITE du build, pas la similarite avec l'original
- Les gros SaaS (Canva, Notion, Figma) ont une cloneability < 40 (trop complexes)
- Un outil de RDV pour une niche specifique a une cloneability de 70-85

SAAS SOURCE :
Nom: ${source.name}
Domaine: ${source.domain ?? 'N/A'}
Tagline: ${source.tagline ?? ''}
Description: ${source.description ?? ''}
Categorie: ${source.category}
Pricing: ${source.pricing_model ?? 'N/A'}
MRR/ARR connu: ${source.mrr_reported ? `$${source.mrr_reported}` : source.arr_reported ? `ARR $${source.arr_reported}` : 'Non specifie'}
Fondateurs: ${source.founder_names ?? 'N/A'}
Stack: ${JSON.stringify(source.tech_stack ?? [])}

Reponds UNIQUEMENT en JSON valide avec cette structure exacte :
{
  "opportunity_title": "string (ex: 'Clone de [Nom] pour [niche precise]')",
  "target_niche": "string (le metier/audience precise en francais)",
  "problem_solved": "string (1 phrase : QUI a le probleme et POURQUOI)",
  "traction_score": number (0-100, traction du SaaS source sur le marche),
  "traction_explanation": "string (1 phrase avec donnees concretes : MRR, users, funding, anciennete)",
  "cloneability_score": number (0-100, facilite de reproduire UNE VERSION SIMPLIFIEE pour une niche),
  "cloneability_explanation": "string (1 phrase : ce qu'il faut construire et combien de jours)",
  "monetization_score": number (0-100, potentiel de revenus de la version nichee),
  "monetization_explanation": "string (1 phrase : qui paie, combien, pourquoi ils paient)",
  "why_reproducible": "string (2-3 phrases simples sans jargon tech)",
  "recommended_stack": ["string (5 max)"],
  "differentiation_angle": "string (l'angle niche unique, 1-2 phrases)",
  "mvp_features": ["string (5 features cles du MVP, descriptions simples)"],
  "niche_suggestions": ["string (3 metiers/audiences tres specifiques)"],
  "acquisition_channels": ["string (3 canaux concrets pour cette niche)"],
  "pricing_suggestion": "string (ex: '49€/mois par praticien')",
  "estimated_build_time": "string (ex: '10-14 jours')"
}`
}

async function callClaude(prompt: string, model: 'haiku' | 'sonnet'): Promise<Record<string, unknown>> {
  const modelId = model === 'haiku'
    ? 'claude-haiku-4-5-20251001'
    : 'claude-sonnet-4-6'

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: modelId,
      max_tokens: 1500,
      messages: [{ role: 'user', content: prompt }],
    }),
  })

  const data = await res.json()
  const text = data?.content?.[0]?.text ?? ''

  const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) || text.match(/(\{[\s\S]*\})/)
  if (!jsonMatch) throw new Error(`Claude non-JSON response: ${text.slice(0, 200)}`)
  return JSON.parse(jsonMatch[1] || jsonMatch[0])
}

function calcBuildScore(t: number, c: number, m: number): number {
  return Math.round(t * 0.30 + c * 0.40 + m * 0.30)
}

function slugify(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80)
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  const token = req.headers.get('x-scanner-token')
  if (!SCANNER_AUTH_TOKEN || token !== SCANNER_AUTH_TOKEN) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false }
  })

  // Get all source_ids that already have an opportunity
  const { data: analyzedRows, error: analyzedErr } = await supabase
    .from('buildrs_opportunities')
    .select('source_id')

  if (analyzedErr) {
    return new Response(JSON.stringify({ error: analyzedErr.message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  const excludeIds = (analyzedRows ?? []).map((r: { source_id: string }) => r.source_id).filter(Boolean)

  // Fetch unanalyzed sources
  let sourcesQuery = supabase.from('saas_sources').select('*').limit(10)
  if (excludeIds.length > 0) {
    sourcesQuery = sourcesQuery.not('id', 'in', `(${excludeIds.join(',')})`)
  }

  const { data: sources, error: sourcesErr } = await sourcesQuery

  if (sourcesErr) {
    return new Response(JSON.stringify({ error: sourcesErr.message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  if (!sources || sources.length === 0) {
    return new Response(JSON.stringify({ items_analyzed: 0, message: 'Aucune source a analyser' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  let itemsAnalyzed = 0
  const errors: { id: string; error: string }[] = []

  for (const source of sources) {
    try {
      if (itemsAnalyzed > 0) await new Promise(r => setTimeout(r, 500))

      const scored = await callClaude(buildAnalysisPrompt(source), 'haiku')

      const traction = Number(scored.traction_score) || 0
      const cloneability = Number(scored.cloneability_score) || 0
      const monetization = Number(scored.monetization_score) || 0
      const buildScore = calcBuildScore(traction, cloneability, monetization)

      // Create slug from source name + category, check for conflicts
      let slug = slugify(`${source.name}-${source.category}`)
      const { data: existingSlug } = await supabase
        .from('buildrs_opportunities')
        .select('id')
        .eq('slug', slug)
        .maybeSingle()
      if (existingSlug) slug = `${slug}-${Date.now()}`

      const opportunityData: Record<string, unknown> = {
        source_id: source.id,
        slug,
        opportunity_title: String(scored.opportunity_title || `Clone de ${source.name}`),
        problem_solved: String(scored.problem_solved || ''),
        target_niche: String(scored.target_niche || ''),
        traction_score: traction,
        traction_explanation: String(scored.traction_explanation || ''),
        cloneability_score: cloneability,
        cloneability_explanation: String(scored.cloneability_explanation || ''),
        monetization_score: monetization,
        monetization_explanation: String(scored.monetization_explanation || ''),
        build_score: buildScore,
        why_reproducible: String(scored.why_reproducible || ''),
        recommended_stack: scored.recommended_stack || ['Next.js', 'Supabase', 'Stripe'],
        differentiation_angle: String(scored.differentiation_angle || ''),
        mvp_features: scored.mvp_features || [],
        niche_suggestions: scored.niche_suggestions || [],
        acquisition_channels: scored.acquisition_channels || [],
        pricing_suggestion: String(scored.pricing_suggestion || ''),
        estimated_build_time: String(scored.estimated_build_time || '2-3 semaines'),
        status: 'active',
        scored_at: new Date().toISOString(),
      }

      // Phase 2: Sonnet enrichment for high-score items
      if (buildScore > 70) {
        try {
          await new Promise(r => setTimeout(r, 500))
          const enrichPrompt = `${buildAnalysisPrompt(source)}

Cette OPPORTUNITE DE CLONE a un Build Score de ${buildScore}/100 (score > 70 = haute qualite).
Enrichis les champs suivants avec des analyses beaucoup plus detaillees et actionnables pour cette OPPORTUNITE DE CLONE :
- why_reproducible : 4-5 phrases, specifique, avec des exemples concrets sur comment reproduire la version nichee
- differentiation_angle : angle tres precis (ex: "Niche kinesitherapistes independants FR, aucun concurrent en francais")
- mvp_features : 5 features tres specifiques avec description courte de chacune pour cette niche
- niche_suggestions : 3 niches tres specifiques (metier, secteur, taille entreprise)

Reponds en JSON avec UNIQUEMENT ces 4 champs.`

          const enriched = await callClaude(enrichPrompt, 'sonnet')
          if (enriched.why_reproducible) opportunityData.why_reproducible = String(enriched.why_reproducible)
          if (enriched.differentiation_angle) opportunityData.differentiation_angle = String(enriched.differentiation_angle)
          if (enriched.mvp_features) opportunityData.mvp_features = enriched.mvp_features
          if (enriched.niche_suggestions) opportunityData.niche_suggestions = enriched.niche_suggestions
        } catch (enrichErr) {
          console.warn(`Sonnet enrichment failed for ${source.id}:`, enrichErr)
        }
      }

      const { error: insertErr } = await supabase
        .from('buildrs_opportunities')
        .insert(opportunityData)

      if (insertErr) {
        errors.push({ id: source.id, error: insertErr.message })
        continue
      }

      itemsAnalyzed++
    } catch (err) {
      errors.push({ id: source.id, error: String(err) })
      console.error(`Analysis error for ${source.id}:`, err)
    }
  }

  return new Response(JSON.stringify({
    items_analyzed: itemsAnalyzed,
    errors_count: errors.length,
    errors: errors.length > 0 ? errors : undefined,
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
})
