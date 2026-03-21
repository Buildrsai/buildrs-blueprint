import Anthropic from 'npm:@anthropic-ai/sdk@0.39.0'
import { createClient } from 'npm:@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'
import { PHASE_PROMPTS } from '../_shared/prompts.ts'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Vérification auth
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

    // Body
    const { projectId, phaseNumber } = await req.json()
    if (!projectId || !phaseNumber) {
      return new Response(JSON.stringify({ error: 'projectId et phaseNumber requis' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const systemPrompt = PHASE_PROMPTS[phaseNumber as number]
    if (!systemPrompt) {
      return new Response(JSON.stringify({ error: `Phase ${phaseNumber} non supportée` }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Fetch projet — RLS vérifie l'ownership automatiquement
    const { data: project, error: projectError } = await supabaseUser
      .from('projects')
      .select('name, description, idea_data')
      .eq('id', projectId)
      .single()

    if (projectError || !project) {
      return new Response(JSON.stringify({ error: 'Projet introuvable' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const ideaData = project.idea_data as Record<string, string>
    const userMessage = [
      `Projet : ${project.name}`,
      project.description ? `Description : ${project.description}` : null,
      ideaData?.niche ? `Niche / secteur cible : ${ideaData.niche}` : null,
    ].filter(Boolean).join('\n')

    // Streaming Claude
    const anthropic = new Anthropic({ apiKey: Deno.env.get('ANTHROPIC_API_KEY')! })

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    let fullText = ''

    const body = new ReadableStream({
      async start(controller) {
        try {
          const stream = anthropic.messages.stream({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 4096,
            tools: [{ type: 'web_search_20250305' as const, name: 'web_search' }],
            system: systemPrompt,
            messages: [{ role: 'user', content: userMessage }],
          })

          for await (const event of stream) {
            if (
              event.type === 'content_block_delta' &&
              event.delta.type === 'text_delta'
            ) {
              const chunk = event.delta.text
              fullText += chunk
              controller.enqueue(new TextEncoder().encode(chunk))
            }
          }
        } catch (err) {
          controller.error(err)
          return
        }

        // Extraire le score depuis le texte généré
        const scoreMatch = fullText.match(/Score de validation\s*:\s*(\d+)\/100/)
        const score = scoreMatch ? parseInt(scoreMatch[1], 10) : 0

        // Sauvegarder dans project_phases
        await supabaseAdmin.from('project_phases').upsert({
          project_id: projectId,
          phase_number: phaseNumber,
          status: 'completed',
          generated_content: { text: fullText, score },
          completed_at: new Date().toISOString(),
        }, { onConflict: 'project_id,phase_number' })

        // Avancer current_phase si nécessaire
        await supabaseAdmin
          .from('projects')
          .update({ current_phase: Math.min((phaseNumber as number) + 1, 8) })
          .eq('id', projectId)
          .lt('current_phase', (phaseNumber as number) + 1)

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
