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

const PRODUCT_TYPE_EXAMPLES: Record<string, string> = {
  'micro-saas': 'outil web simple pour une niche (ex: outil de RDV pour tatoueurs)',
  'mobile-app': 'application mobile native (ex: app de suivi pour coachs sportifs)',
  'ai-agent': 'agent IA autonome (ex: agent vocal IA pour reception cabinet dentaire)',
  'ai-gen': 'generateur IA (ex: generateur de contrats pour freelances)',
  'biz-tool': 'logiciel metier vertical (ex: logiciel de gestion pour plombiers)',
  'automation': 'outil d\'automatisation (ex: automatisation des relances pour agences)',
  'marketplace': 'place de marche (ex: marketplace de prestataires evenementiels)',
}

function buildAnalysisPrompt(
  source: Record<string, unknown>,
  existingNiches: string[],
): string {
  const existingNicheBlock = existingNiches.length > 0
    ? `\nNICHES DEJA UTILISEES (INTERDITES — choisis quelque chose de DIFFERENT) :\n${existingNiches.slice(0, 30).map(n => `- ${n}`).join('\n')}\n`
    : ''

  const productTypeBlock = Object.entries(PRODUCT_TYPE_EXAMPLES)
    .map(([k, v]) => `  - "${k}" : ${v}`)
    .join('\n')

  return `SYSTEME :
Tu es l'analyste SaaS de Buildrs. Tu analyses un VRAI SaaS qui existe et fonctionne sur le marche.
Ton travail : proposer une OPPORTUNITE DE CLONE pour un builder non-developpeur.
L'opportunite decrit comment adapter ce SaaS pour une niche specifique, en plus simple.

REGLE CRITIQUE — CE QU'EST UNE BONNE OPPORTUNITE BUILDRS :
- Un angle de niche TRES PRECIS : pas "comme Calendly" mais "Calendly pour professeurs de yoga en ligne"
- Constructible en 7-21 jours avec Claude Code + Supabase + Stripe
- La cloneability mesure la SIMPLICITE du build, pas la similarite avec l'original
- Les gros SaaS (Canva, Notion, Figma) ont une cloneability < 40 (trop complexes)
- Un outil de RDV pour une niche specifique a une cloneability de 70-85
${existingNicheBlock}
REGLE DIVERSITE — TYPES DE PRODUITS :
Varies les types. Choisis product_type parmi :
${productTypeBlock}
Pour un SaaS de scheduling classique, pense a proposer une version "biz-tool" ou "mobile-app" plutot que "micro-saas" si c'est plus pertinent.
Pour un SaaS d'IA, prefere "ai-agent" ou "ai-gen".
Choisis market_type selon la cible : "b2b" (entreprises), "b2c" (particuliers), "b2b2c" (les deux).

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
  "estimated_build_time": "string (ex: '10-14 jours')",
  "product_type": "string (une valeur parmi: micro-saas, mobile-app, ai-agent, ai-gen, biz-tool, automation, marketplace)",
  "market_type": "string (une valeur parmi: b2b, b2c, b2b2c)"
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
      max_tokens: 1600,
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

async function archiveExcessOpportunities(supabase: ReturnType<typeof createClient>): Promise<void> {
  // Find target_niches with more than 3 active opportunities, keep top 2, archive rest
  const { data: allOpps } = await supabase
    .from('buildrs_opportunities')
    .select('id, target_niche, build_score')
    .eq('status', 'active')
    .order('build_score', { ascending: false })

  if (!allOpps || allOpps.length === 0) return

  // Group by target_niche
  const byNiche: Record<string, { id: string; build_score: number }[]> = {}
  for (const opp of allOpps) {
    const niche = (opp.target_niche ?? '').trim().toLowerCase()
    if (!niche) continue
    if (!byNiche[niche]) byNiche[niche] = []
    byNiche[niche].push({ id: opp.id, build_score: opp.build_score })
  }

  const toArchive: string[] = []
  for (const [, opps] of Object.entries(byNiche)) {
    if (opps.length > 3) {
      // Sort desc by build_score (already sorted from query)
      const excess = opps.slice(2).map(o => o.id)
      toArchive.push(...excess)
    }
  }

  if (toArchive.length > 0) {
    await supabase
      .from('buildrs_opportunities')
      .update({ status: 'archived' })
      .in('id', toArchive)
    console.log(`Archived ${toArchive.length} excess opportunities`)
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    return await handleRequest(req)
  } catch (err) {
    console.error('Unhandled error:', err)
    return new Response(JSON.stringify({ error: 'Internal server error', details: String(err) }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})

async function handleRequest(req: Request): Promise<Response> {
  const token = req.headers.get('x-scanner-token')
  if (!SCANNER_AUTH_TOKEN || token !== SCANNER_AUTH_TOKEN) {
    return new Response(JSON.stringify({ error: 'Unauthorized', hint: `token_set=${!!SCANNER_AUTH_TOKEN}` }), {
      status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false }
  })

  // Fetch all existing target_niches to prevent duplicates
  const { data: existingOpps, error: existingErr } = await supabase
    .from('buildrs_opportunities')
    .select('source_id, target_niche')
    .eq('status', 'active')

  if (existingErr) {
    return new Response(JSON.stringify({ error: existingErr.message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  const existingNiches = [...new Set(
    (existingOpps ?? [])
      .map((r: { target_niche: string | null }) => r.target_niche)
      .filter(Boolean) as string[]
  )]

  const excludeIds = (existingOpps ?? []).map((r: { source_id: string }) => r.source_id).filter(Boolean)

  // Fetch unanalyzed sources (batch 5 — free tier 60s limit)
  let sourcesQuery = supabase.from('saas_sources').select('*').limit(5)
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
    // Run archive cleanup even when no new sources
    await archiveExcessOpportunities(supabase)
    return new Response(JSON.stringify({ items_analyzed: 0, message: 'Aucune source a analyser' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  let itemsAnalyzed = 0
  const errors: { id: string; error: string }[] = []

  for (const source of sources) {
    try {
      if (itemsAnalyzed > 0) await new Promise(r => setTimeout(r, 200))

      const scored = await callClaude(buildAnalysisPrompt(source, existingNiches), 'haiku')

      const traction = Number(scored.traction_score) || 0
      const cloneability = Number(scored.cloneability_score) || 0
      const monetization = Number(scored.monetization_score) || 0
      const buildScore = calcBuildScore(traction, cloneability, monetization)

      // Add new niche to the running list so subsequent sources in this batch also avoid it
      const newNiche = String(scored.target_niche || '')
      if (newNiche) existingNiches.push(newNiche)

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
        product_type: String(scored.product_type || ''),
        market_type: String(scored.market_type || ''),
        status: 'active',
        scored_at: new Date().toISOString(),
      }

      // Phase 2: Sonnet enrichment for very high-score items only
      if (buildScore > 80) {
        try {
          await new Promise(r => setTimeout(r, 200))
          const enrichPrompt = `${buildAnalysisPrompt(source, [])}

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

  // Archive excess opportunities after analyzing new ones
  try {
    await archiveExcessOpportunities(supabase)
  } catch (archiveErr) {
    console.warn('Archive cleanup failed:', archiveErr)
  }

  return new Response(JSON.stringify({
    items_analyzed: itemsAnalyzed,
    errors_count: errors.length,
    errors: errors.length > 0 ? errors : undefined,
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}
