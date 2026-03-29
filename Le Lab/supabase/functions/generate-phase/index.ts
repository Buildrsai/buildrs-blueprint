import Anthropic from 'npm:@anthropic-ai/sdk@0.39.0'
import { createClient } from 'npm:@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'
import { PHASE_PROMPTS } from '../_shared/prompts.ts'

// Extrait le JSON structuré depuis la réponse Claude
function parseResultJSON(text: string): Record<string, unknown> | null {
  // Essayer d'abord les balises RESULT_JSON (nouveau format)
  let match = text.match(/<RESULT_JSON>([\s\S]*?)<\/RESULT_JSON>/)
  // Fallback sur VALIDATION_JSON (ancien format Phase 1)
  if (!match) match = text.match(/<VALIDATION_JSON>([\s\S]*?)<\/VALIDATION_JSON>/)
  if (!match) return null
  try {
    return JSON.parse(match[1].trim())
  } catch {
    return null
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Auth
    const authHeader = req.headers.get('authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Non authentifié' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const supabaseUser = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    )
    const { data: { user }, error: authError } = await supabaseUser.auth.getUser()
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Non authentifié' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Body — supporte subStep pour les phases multi-générateurs
    const { projectId, phaseNumber, subStep } = await req.json()
    if (!projectId || !phaseNumber) {
      return new Response(JSON.stringify({ error: 'projectId et phaseNumber requis' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Construire la clé du prompt : "1:validation" ou "2:pages_features"
    const promptKey = subStep ? `${phaseNumber}:${subStep}` : `${phaseNumber}:validation`
    const promptConfig = PHASE_PROMPTS[promptKey]
    if (!promptConfig) {
      return new Response(JSON.stringify({ error: `Prompt ${promptKey} non supporté` }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Fetch projet avec toutes les données pour le contexte
    const { data: project, error: projectError } = await supabaseUser
      .from('projects')
      .select('name, description, idea_data, structure_data, branding_data, build_kit_data')
      .eq('id', projectId)
      .single()

    if (projectError || !project) {
      return new Response(JSON.stringify({ error: 'Projet introuvable' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Récupérer les données des phases précédentes pour le contexte
    const { data: previousPhases } = await supabaseUser
      .from('project_phases')
      .select('phase_number, generated_content')
      .eq('project_id', projectId)
      .eq('status', 'completed')
      .order('phase_number', { ascending: true })

    // Trouver les données de la phase 1 pour injection dans les phases suivantes
    const phase1Data = previousPhases?.find(p => p.phase_number === 1)?.generated_content as Record<string, unknown> | undefined

    // Construire le message utilisateur avec le contexte
    const userMessage = promptConfig.buildUserMessage(
      project as { name: string; description?: string; idea_data?: Record<string, unknown>; structure_data?: Record<string, unknown>; branding_data?: Record<string, unknown> },
      phase1Data
    )

    // Appel Claude
    const anthropic = new Anthropic({ apiKey: Deno.env.get('ANTHROPIC_API_KEY')! })
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    let fullText = ''

    const body = new ReadableStream({
      async start(controller) {
        try {
          // Utiliser web_search seulement pour Phase 1
          const tools = phaseNumber === 1
            ? [{ type: 'web_search_20250305' as const, name: 'web_search' }]
            : []

          const streamConfig: Record<string, unknown> = {
            model: 'claude-sonnet-4-20250514',
            max_tokens: 4096,
            system: promptConfig.system,
            messages: [{ role: 'user', content: userMessage }],
          }
          if (tools.length > 0) {
            streamConfig.tools = tools
          }

          const stream = anthropic.messages.stream(streamConfig as Parameters<typeof anthropic.messages.stream>[0])

          // Signaux de progression
          let lastProgressTime = Date.now()
          const progressSteps: Record<string, string[]> = {
            '1:validation': ['analyzing', 'searching_market', 'finding_competitors', 'calculating_score', 'generating_report'],
            '2:pages_features': ['analyzing_idea', 'defining_pages', 'selecting_features', 'mapping_journey'],
            '2:data_model': ['analyzing_structure', 'defining_entities', 'mapping_relations'],
            '2:monetization': ['analyzing_market', 'defining_tiers', 'estimating_revenue'],
          }
          const steps = progressSteps[promptKey] ?? ['analyzing', 'generating']
          let stepIndex = 0

          for await (const event of stream) {
            if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
              fullText += event.delta.text
              const now = Date.now()
              if (now - lastProgressTime > 4000 && stepIndex < steps.length) {
                const progressMsg = JSON.stringify({ type: 'progress', step: steps[stepIndex] }) + '\n'
                controller.enqueue(new TextEncoder().encode(progressMsg))
                stepIndex++
                lastProgressTime = now
              }
            }
          }
        } catch (err) {
          const errorMsg = JSON.stringify({ type: 'error', message: (err as Error).message }) + '\n'
          controller.enqueue(new TextEncoder().encode(errorMsg))
          controller.close()
          return
        }

        // Parser le JSON structuré
        const structured = parseResultJSON(fullText)

        if (structured) {
          // Sauvegarder les données structurées
          if (phaseNumber === 1) {
            // Phase 1 : sauvegarder dans project_phases + idea_data
            await supabaseAdmin.from('project_phases').upsert({
              project_id: projectId,
              phase_number: 1,
              status: 'completed',
              generated_content: { ...structured, raw_text: fullText },
              completed_at: new Date().toISOString(),
            }, { onConflict: 'project_id,phase_number' })

          } else if (phaseNumber === 2) {
            // Phase 2 : sauvegarder dans structure_data du projet
            const currentStructure = (project.structure_data ?? {}) as Record<string, unknown>

            if (subStep === 'pages_features') {
              currentStructure.pages = structured.pages
              currentStructure.features = structured.features
              currentStructure.user_journey = structured.user_journey
              currentStructure.mvp_scope = structured.mvp_scope
              currentStructure.post_mvp = structured.post_mvp
            } else if (subStep === 'data_model') {
              currentStructure.data_model = structured.entities
              currentStructure.data_model_summary = structured.summary
            } else if (subStep === 'monetization') {
              currentStructure.monetization = structured
            }

            await supabaseAdmin
              .from('projects')
              .update({ structure_data: currentStructure })
              .eq('id', projectId)

            // Sauvegarder aussi dans project_phases pour tracking
            // On marque la phase comme complétée quand la dernière sous-étape est faite
            const isLastSubStep = subStep === 'monetization'
            await supabaseAdmin.from('project_phases').upsert({
              project_id: projectId,
              phase_number: 2,
              status: isLastSubStep ? 'completed' : 'active',
              generated_content: currentStructure,
              completed_at: isLastSubStep ? new Date().toISOString() : null,
            }, { onConflict: 'project_id,phase_number' })
          }

          // Avancer current_phase si la phase est complétée
          const isPhaseComplete = phaseNumber === 1 || (phaseNumber === 2 && subStep === 'monetization')
          if (isPhaseComplete) {
            await supabaseAdmin
              .from('projects')
              .update({ current_phase: Math.min(phaseNumber + 1, 8) })
              .eq('id', projectId)
              .lt('current_phase', phaseNumber + 1)
          }

          // Envoyer le résultat au client
          const resultMsg = JSON.stringify({ type: 'result', data: structured }) + '\n'
          controller.enqueue(new TextEncoder().encode(resultMsg))
        } else {
          // Fallback texte brut
          const resultMsg = JSON.stringify({ type: 'result', data: { text: fullText } }) + '\n'
          controller.enqueue(new TextEncoder().encode(resultMsg))
        }

        controller.close()
      },
    })

    return new Response(body, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/plain; charset=utf-8',
        'X-Content-Type-Options': 'nosniff',
      },
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Erreur inconnue'
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
