// supabase/functions/run-agent/index.ts
// Pack Agents V1 — Phase 2
//
// POST /run-agent
// Headers : Authorization: Bearer <jwt>
// Body    : { project_id: uuid, agent_slug: string, input_data: object }
//
// Env vars requises :
//   SUPABASE_URL                — URL du projet
//   SUPABASE_ANON_KEY           — clé anon (auth.getUser() uniquement)
//   SUPABASE_SERVICE_ROLE_KEY   — service role (toutes les queries métier, bypass RLS)
//   ANTHROPIC_API_KEY           — clé secrète Anthropic

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2?target=deno'
import Anthropic          from 'https://esm.sh/@anthropic-ai/sdk@0.30.0?target=deno'
import { VALID_SLUGS, AGENTS_META, type AgentSlug } from './config.ts'
import { PROMPT_FILES } from './prompts-bundle.ts'

// ── Config ────────────────────────────────────────────────────────────────────

const SUPABASE_URL             = Deno.env.get('SUPABASE_URL')!
const SUPABASE_ANON_KEY        = Deno.env.get('SUPABASE_ANON_KEY')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const ANTHROPIC_API_KEY        = Deno.env.get('ANTHROPIC_API_KEY')

const MODEL               = 'claude-sonnet-4-6'
const MAX_TOKENS          = 8000
const RATE_LIMIT_PER_HOUR = 20
const TIMEOUT_MS          = 90_000

const corsHeaders = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

async function readPromptFile(filename: string): Promise<string> {
  const content = PROMPT_FILES[filename]
  if (!content) throw new Error(`Prompt not found: ${filename}`)
  return content
}

// ── Handler ───────────────────────────────────────────────────────────────────

Deno.serve(async (req) => {

  // CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  // 1. Méthode
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  // Guard : ANTHROPIC_API_KEY obligatoire
  if (!ANTHROPIC_API_KEY) {
    console.error('[run-agent] ANTHROPIC_API_KEY non configurée')
    return json({ error: 'Configuration serveur manquante — contacter le support.' }, 500)
  }

  // 2. Auth — extraire user_id depuis le JWT (client anon uniquement)
  const authHeader = req.headers.get('Authorization')
  if (!authHeader) return json({ error: 'Unauthorized' }, 401)

  // clientJwt : uniquement pour auth.getUser() — jamais pour les queries métier
  const clientJwt = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: authHeader } },
  })
  const { data: { user } } = await clientJwt.auth.getUser()
  if (!user) return json({ error: 'Unauthorized' }, 401)

  // clientAdmin : service role — bypass RLS — toutes les queries métier ci-dessous
  // On filtre user_id manuellement pour garantir l'isolation des données.
  const clientAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

  // 3. Parser le body
  let body: { project_id?: string; agent_slug?: string; input_data?: Record<string, unknown> }
  try {
    body = await req.json()
  } catch {
    return json({ error: 'Body JSON invalide' }, 400)
  }

  const { project_id, agent_slug, input_data = {} } = body

  if (!project_id) return json({ error: 'project_id requis' }, 400)

  // 4. Valider agent_slug
  if (!agent_slug || !VALID_SLUGS.includes(agent_slug as AgentSlug)) {
    return json({
      error: `agent_slug invalide. Valeurs acceptées : ${VALID_SLUGS.join(', ')}`,
    }, 400)
  }

  const slug   = agent_slug as AgentSlug
  const config = AGENTS_META[slug]

  // 5. Vérifier entitlement — user_purchases.product_slug = 'agents-ia'
  const { data: entitlement } = await clientAdmin
    .from('user_purchases')
    .select('id')
    .eq('user_id', user.id)
    .eq('product_slug', 'agents-ia')
    .limit(1)
    .maybeSingle()

  if (!entitlement) {
    return json({ error: 'Pack Agents non débloqué' }, 403)
  }

  // 6. Rate limiting — 20 appels max par heure
  const { count } = await clientAdmin
    .from('agent_outputs')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .gte('created_at', new Date(Date.now() - 3_600_000).toISOString())

  if ((count ?? 0) >= RATE_LIMIT_PER_HOUR) {
    return json({ error: 'Trop de requêtes, réessaie dans 1h' }, 429)
  }

  // 7. Vérifier que project_id appartient à l'user
  const { data: project } = await clientAdmin
    .from('agent_projects')
    .select('id')
    .eq('id', project_id)
    .eq('user_id', user.id)
    .maybeSingle()

  if (!project) return json({ error: 'Projet introuvable' }, 404)

  // 8. Créer une row pending dans agent_outputs
  const { data: pendingRow, error: pendingErr } = await clientAdmin
    .from('agent_outputs')
    .insert({
      project_id,
      user_id:       user.id,
      agent_slug:    slug,
      input_data,
      output_format: config.outputFormat,
      status:        'pending',
    })
    .select('id')
    .single()

  if (pendingErr || !pendingRow) {
    console.error('[run-agent] Pending insert failed:', pendingErr)
    return json({ error: 'Erreur interne' }, 500)
  }

  const pendingId = pendingRow.id

  // Helper : marquer l'output en erreur avant de retourner 500
  const markError = async () => {
    try {
      await clientAdmin
        .from('agent_outputs')
        .update({ status: 'error' })
        .eq('id', pendingId)
    } catch (updateErr) {
      console.error('[run-agent] markError UPDATE failed — row may be stuck pending:', updateErr)
    }
  }

  // 9. Récupérer le contexte chaîné des agents précédents
  const projectContext: Record<string, string> = {}

  for (const contextSlug of config.usesProjectContext) {
    const { data: prev } = await clientAdmin
      .from('agent_outputs')
      .select('output_content')
      .eq('project_id', project_id)
      .eq('user_id', user.id)
      .eq('agent_slug', contextSlug)
      .eq('status', 'completed')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (prev?.output_content) {
      projectContext[contextSlug] = prev.output_content
    }
  }

  // 10. Charger les prompts depuis les fichiers co-localisés
  let buildrsContext: string
  let agentPrompt: string

  try {
    ;[buildrsContext, agentPrompt] = await Promise.all([
      readPromptFile('buildrs-context.md'),
      readPromptFile(`${slug}.md`),
    ])
  } catch (err) {
    console.error('[run-agent] Prompt file load failed:', err)
    await markError()
    return json({ error: 'Erreur interne : fichier prompt introuvable' }, 500)
  }

  // 11. Construire le system prompt final
  const systemPrompt = `${buildrsContext}\n\n---\n\n${agentPrompt}`

  // 12. Construire le user message
  const inputSection = Object.entries(input_data)
    .map(([k, v]) => `**${k}** : ${v}`)
    .join('\n')

  const contextSection = Object.keys(projectContext).length > 0
    ? `\n\n## CONTEXTE PROJET\n\n${
        Object.entries(projectContext)
          .map(([s, content]) => `### Output ${s}\n${content}`)
          .join('\n\n')
      }`
    : ''

  const userMessage = `## INPUT\n\n${inputSection}${contextSection}`

  // 13. Appel Anthropic — timeout 90s via AbortController
  const anthropic = new Anthropic({ apiKey: ANTHROPIC_API_KEY })
  let anthropicResponse: Anthropic.Message

  try {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)

    anthropicResponse = await anthropic.messages.create(
      {
        model:      MODEL,
        max_tokens: MAX_TOKENS,
        system:     systemPrompt,
        messages:   [{ role: 'user', content: userMessage }],
      },
      { signal: controller.signal },
    )

    clearTimeout(timer)
  } catch (err) {
    console.error('[run-agent] Anthropic error:', err)
    await markError()

    const isTimeout = err instanceof Error && err.name === 'AbortError'
    return json({
      error: isTimeout
        ? 'La requête a expiré (90s). Réessaie avec un contexte projet plus court.'
        : 'Erreur lors de l\'appel au modèle IA. Réessaie dans quelques secondes.',
    }, 500)
  }

  // 14. Extraire le contenu texte
  const textBlock     = anthropicResponse.content.find(b => b.type === 'text')
  const outputContent = textBlock?.type === 'text' ? textBlock.text : ''
  const inputTokens   = anthropicResponse.usage.input_tokens
  const outputTokens  = anthropicResponse.usage.output_tokens

  // 15. Mettre à jour la row avec le résultat
  await clientAdmin
    .from('agent_outputs')
    .update({
      output_content: outputContent,
      status:         'completed',
      input_tokens:   inputTokens,
      output_tokens:  outputTokens,
    })
    .eq('id', pendingId)

  // 16. Retourner le résultat
  return json({
    id:            pendingId,
    content:       outputContent,
    output_format: config.outputFormat,
    input_tokens:  inputTokens,
    output_tokens: outputTokens,
  })
})
