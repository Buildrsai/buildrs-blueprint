// supabase/functions/scanner-score/index.ts
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-scanner-token',
}

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const SCANNER_AUTH_TOKEN = Deno.env.get('SCANNER_AUTH_TOKEN') ?? ''
const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY')!

const SCORE_SCHEMA = `{
  "name": "string (nom court et parlant, pas de sigles)",
  "tagline": "string (10 mots max, langage simple)",
  "problem_solved": "string (1 phrase simple : QUI + POURQUOI)",
  "category": "string (parmi: crm, invoicing, scheduling, analytics, hr, marketing, productivity, ecommerce, education, health, other)",
  "traction_score": number (0-100),
  "traction_explanation": "string (1 phrase avec les chiffres concrets : X votes, X MRR, X reviews)",
  "cloneability_score": number (0-100),
  "cloneability_explanation": "string (1 phrase simple : ce qu'il faut construire et combien de temps)",
  "monetization_score": number (0-100),
  "monetization_explanation": "string (1 phrase : qui paie, combien, pourquoi)",
  "why_reproducible": "string (2-3 phrases simples, pas de jargon)",
  "recommended_stack": ["string"],
  "differentiation_angle": "string (1-2 phrases : quelle niche, quel angle)",
  "mvp_features": ["string (5 features max, décrites simplement)"],
  "pain_points": ["string"] ou null,
  "niche_suggestions": ["string (3 métiers/audiences précis)"],
  "acquisition_channels": ["string (3 canaux concrets)"],
  "pricing_suggestion": "string (ex: '29€/mois par salon')",
  "mrr_estimated": number ou null,
  "mrr_confidence": number (1-10) ou null
}`

function buildHaikuPrompt(item: Record<string, unknown>): string {
  return `SYSTEME :
Tu es l'analyste SaaS de Buildrs. Tu évalues des produits SaaS pour déterminer si un NON-DEVELOPPEUR DEBUTANT peut les reproduire en micro-SaaS avec Claude Code, Supabase, Next.js et Stripe.

REGLE CRITIQUE — CE QUE "MICRO-SAAS SIMPLE" VEUT DIRE :
Un micro-SaaS simple c'est :
- Un problème concret pour un métier précis (coiffeurs, artisans, coachs, restaurants, freelances, e-commerçants, agences...)
- Un outil qu'on explique en UNE phrase
- Stack maximale : landing + auth + formulaires + base de données + paiement Stripe + dashboard + éventuellement API Claude pour de l'IA simple (génération de texte, analyse, suggestions)
- Constructible en 7 à 20 jours par quelqu'un qui découvre Claude Code

CE QUI N'EST PAS UN MICRO-SAAS SIMPLE (Cloneability < 40 obligatoire) :
- Intégrations API tierces complexes (DocuSign, Twilio, Puppeteer, scraping avancé, OAuth multi-provider)
- Génération PDF complexe avec templating avancé
- Temps réel (websockets, chat live, collaboration)
- Machine learning custom ou fine-tuning
- Marketplace avec multi-vendeurs
- Tout ce qui nécessite plus de 3 services externes

REGLE CRITIQUE — FORMAT DES DESCRIPTIONS :
- Tagline : 10 mots max. Langage simple. Pas de jargon technique.
  BON : "Prise de rendez-vous automatique pour salons de coiffure"
  MAUVAIS : "Plateforme de scheduling multi-canaux avec intégration CRM"
- problem_solved : 1 phrase simple qui dit QUI a le problème et POURQUOI c'est un problème.
  BON : "Les coiffeurs perdent des clients parce qu'ils ne peuvent pas répondre au téléphone quand ils coupent les cheveux."
  MAUVAIS : "Les professionnels du secteur capillaire subissent une déperdition de leads."
- why_reproducible : expliquer avec des mots simples pourquoi c'est faisable. Pas de noms de technologies.
  BON : "C'est un formulaire, une base de données et un tableau de bord. L'IA génère le contenu. Pas de complexité technique."
  MAUVAIS : "Architecture CRUD classique avec endpoints REST, Supabase RLS et server-side rendering Next.js."

CATEGORIES PRIVILEGIEES (micro-SaaS nichés par métier) :
- Outils pour artisans (devis, facturation, planning)
- Outils pour commerçants (pricing, inventaire, fidélité)
- Outils pour freelances (facturation, CRM, propositions)
- Outils pour coachs/formateurs (booking, suivi clients, programmes)
- Outils pour restaurants/food (commandes, avis, menu)
- Outils pour professionnels de santé/beauté (RDV, fiches clients)
- Outils pour agences (reporting, gestion projets, clients)
- Agents IA simples (vocal, email, chat pour un métier précis)
- Générateurs IA (offres, contenus, emails pour une niche)
- Automatisations simples (suivi, relances, notifications)

DONNEES DU SAAS :
Source: ${item.source}
Nom: ${item.name ?? 'Inconnu'}
Description: ${item.description ?? ''}
URL: ${item.website_url ?? 'N/A'}
MRR mentionne: ${item.mrr_mentioned ?? 'Non mentionne'}
Upvotes/Score: ${item.upvotes ?? 0}

Reponds UNIQUEMENT en JSON valide :
${SCORE_SCHEMA}`
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

  const { data: rawItems, error: fetchErr } = await supabase
    .from('saas_raw_discoveries')
    .select('*')
    .eq('is_processed', false)
    .limit(20)

  if (fetchErr) {
    return new Response(JSON.stringify({ error: fetchErr.message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
  if (!rawItems || rawItems.length === 0) {
    return new Response(JSON.stringify({ items_scored: 0, message: 'Rien a scorer' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  let itemsScored = 0
  const errors: { id: string; error: string }[] = []

  for (const item of rawItems) {
    try {
      if (itemsScored > 0) await new Promise(r => setTimeout(r, 500))

      const scored = await callClaude(buildHaikuPrompt(item), 'haiku')

      const traction = Number(scored.traction_score) || 0
      const cloneability = Number(scored.cloneability_score) || 0
      const monetization = Number(scored.monetization_score) || 0
      const buildScore = calcBuildScore(traction, cloneability, monetization)

      const baseName = String(scored.name || item.name || 'saas')
      let slug = slugify(baseName)
      const { data: existing } = await supabase
        .from('saas_opportunities')
        .select('id')
        .eq('slug', slug)
        .maybeSingle()
      if (existing) slug = `${slug}-${Date.now()}`

      const opportunityData: Record<string, unknown> = {
        raw_id: item.id,
        name: String(scored.name || item.name || 'Unknown'),
        slug,
        tagline: String(scored.tagline || item.description?.slice(0, 100) || ''),
        problem_solved: String(scored.problem_solved || ''),
        source: item.source,
        source_url: item.source_url,
        website_url: item.website_url,
        category: String(scored.category || 'other'),
        mrr_estimated: scored.mrr_estimated ? Number(scored.mrr_estimated) : (item.mrr_mentioned ?? null),
        mrr_confidence: scored.mrr_confidence ? Number(scored.mrr_confidence) : null,
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
        pain_points: scored.pain_points || null,
        niche_suggestions: scored.niche_suggestions || [],
        acquisition_channels: scored.acquisition_channels || [],
        pricing_suggestion: String(scored.pricing_suggestion || ''),
        status: 'active',
        scored_at: new Date().toISOString(),
      }

      // Phase 2: Sonnet enrichment for high-score items
      if (buildScore > 70) {
        try {
          await new Promise(r => setTimeout(r, 500))
          const enrichPrompt = `${buildHaikuPrompt(item)}

Cet item a un Build Score de ${buildScore}/100 (score > 70 = haute qualite).
Enrichis les champs suivants avec des analyses beaucoup plus detaillees et actionnables :
- why_reproducible : 4-5 phrases, specifique, avec des exemples concrets
- differentiation_angle : angle tres precis (ex: "Niche avocats independants FR, pas de concurrent en francais")
- mvp_features : 5 features tres specifiques avec description courte de chacune
- niche_suggestions : 3 niches tres specifiques (metier, secteur, taille entreprise)

Reponds en JSON avec UNIQUEMENT ces 4 champs.`

          const enriched = await callClaude(enrichPrompt, 'sonnet')
          if (enriched.why_reproducible) opportunityData.why_reproducible = String(enriched.why_reproducible)
          if (enriched.differentiation_angle) opportunityData.differentiation_angle = String(enriched.differentiation_angle)
          if (enriched.mvp_features) opportunityData.mvp_features = enriched.mvp_features
          if (enriched.niche_suggestions) opportunityData.niche_suggestions = enriched.niche_suggestions
        } catch (enrichErr) {
          console.warn(`Sonnet enrichment failed for ${item.id}:`, enrichErr)
        }
      }

      const { error: insertErr } = await supabase
        .from('saas_opportunities')
        .insert(opportunityData)

      if (insertErr) {
        errors.push({ id: item.id, error: insertErr.message })
        continue
      }

      await supabase
        .from('saas_raw_discoveries')
        .update({ is_processed: true })
        .eq('id', item.id)

      itemsScored++
    } catch (err) {
      errors.push({ id: item.id, error: String(err) })
      console.error(`Scoring error for ${item.id}:`, err)
    }
  }

  return new Response(JSON.stringify({
    items_scored: itemsScored,
    errors_count: errors.length,
    errors: errors.length > 0 ? errors : undefined,
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
})
