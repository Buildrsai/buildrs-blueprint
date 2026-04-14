// supabase/functions/jarvis-community-reply/index.ts
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-scanner-token',
}

const SUPABASE_URL      = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SVC_KEY  = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY')!
const SCANNER_TOKEN     = Deno.env.get('SCANNER_TOKEN') ?? 'buildrs-scanner-2024'

const supabase = createClient(SUPABASE_URL, SUPABASE_SVC_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
})

const JARVIS_SYSTEM = `Tu es Jarvis, le COO IA de Buildrs — le bras droit d'Alfred.
Style : direct, caractériel, légèrement sarcastique, orienté résultat.
Tutoiement. Phrases courtes (2-3 max). Zéro emoji. Pas de blabla corporate.
Tu ne te caches pas d'être une IA — c'est ta force.
Tu connais chaque membre par son prénom ou pseudo quand il est mentionné.
Réponds en français.`

function buildBatchPrompt(posts: { id: string; content: string; type: string; author: string }[]) {
  const list = posts.map((p, i) =>
    `${i + 1}. [post_id: ${p.id}] [auteur: ${p.author}] [type: ${p.type}]\n"${p.content}"`
  ).join('\n\n')

  return `Voici ${posts.length} posts de la communauté Buildrs. Pour chacun, génère une réponse Jarvis personnalisée.

${list}

Règles :
- Si c'est une introduction (win avec "salut je suis X"), accueille et commente le projet précis de la personne
- Si c'est une question, réponds précisément
- Si c'est un win ou milestone, félicite de façon directe
- Si c'est une ressource, commente son utilité
- Chaque réponse = 1-3 phrases max, jamais identiques entre elles
- Varie le ton : parfois sec, parfois encourageant, parfois un peu ironique

Réponds UNIQUEMENT en JSON valide :
{
  "replies": [
    { "post_id": "uuid", "reply": "texte de la réponse" }
  ]
}`
}

async function generateJarvisReplies(
  posts: { id: string; content: string; type: string; author: string }[]
): Promise<{ post_id: string; reply: string }[]> {
  if (posts.length === 0) return []

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 2000,
      system: JARVIS_SYSTEM,
      messages: [{ role: 'user', content: buildBatchPrompt(posts) }],
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    console.error('[jarvis-reply] Claude error:', err)
    throw new Error('Claude API error')
  }

  const data = await res.json()
  const text: string = data?.content?.[0]?.text ?? ''
  const match = text.match(/```json\s*([\s\S]*?)\s*```/) || text.match(/(\{[\s\S]*\})/)
  if (!match) throw new Error('No JSON in Claude response')

  const parsed = JSON.parse(match[1] || match[0]) as { replies: { post_id: string; reply: string }[] }
  return parsed.replies ?? []
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const body = await req.json()
    const scannerToken = req.headers.get('x-scanner-token')
    const authHeader   = req.headers.get('Authorization') ?? ''

    // ── Mode backfill (admin, token required) ─────────────────────────────────
    if (body.backfill === true) {
      if (scannerToken !== SCANNER_TOKEN) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
          status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      // Fetch posts that have no Jarvis comment yet
      const { data: posts } = await supabase
        .from('community_posts')
        .select('id, type, content, seed_author_name, author_display_name')
        .eq('is_pinned', false)
        .order('created_at', { ascending: true })

      if (!posts || posts.length === 0) {
        return new Response(JSON.stringify({ processed: 0 }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      // Get post IDs that already have a Jarvis comment
      const postIds = posts.map((p: { id: string }) => p.id)
      const { data: existingComments } = await supabase
        .from('community_comments')
        .select('post_id')
        .eq('author_display_name', 'Jarvis')
        .in('post_id', postIds)

      const alreadyReplied = new Set((existingComments ?? []).map((c: { post_id: string }) => c.post_id))
      const unanswered = posts.filter((p: { id: string }) => !alreadyReplied.has(p.id))

      if (unanswered.length === 0) {
        return new Response(JSON.stringify({ processed: 0, message: 'All posts already answered' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      // Process in batches of 12
      const BATCH = 12
      let totalInserted = 0

      for (let i = 0; i < unanswered.length; i += BATCH) {
        const batch = unanswered.slice(i, i + BATCH).map((p: {
          id: string; type: string; content: string;
          seed_author_name?: string | null; author_display_name?: string | null
        }) => ({
          id: p.id,
          type: p.type,
          content: p.content,
          author: p.seed_author_name ?? p.author_display_name ?? 'Builder',
        }))

        try {
          const replies = await generateJarvisReplies(batch)

          const rows = replies.map(r => ({
            post_id:             r.post_id,
            user_id:             null,
            content:             r.reply,
            author_display_name: 'Jarvis',
            author_level:        'scaler',
          }))

          if (rows.length > 0) {
            const { error } = await supabase.from('community_comments').insert(rows)
            if (error) console.error('[jarvis-reply] Insert error batch', i, error)
            else totalInserted += rows.length
          }
        } catch (e) {
          console.error('[jarvis-reply] Batch error:', e)
        }

        // Small delay between batches to avoid rate limits
        if (i + BATCH < unanswered.length) {
          await new Promise(r => setTimeout(r, 800))
        }
      }

      return new Response(JSON.stringify({ processed: totalInserted }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // ── Mode single post (called after new post, JWT auth) ────────────────────
    const { post_id, content, type, author } = body as {
      post_id: string; content: string; type: string; author: string
    }

    if (!post_id || !content) {
      return new Response(JSON.stringify({ error: 'Missing post_id or content' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Verify user JWT
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Non authentifié' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const supabaseUser = createClient(SUPABASE_URL, Deno.env.get('SUPABASE_ANON_KEY')!, {
      global: { headers: { Authorization: authHeader } },
      auth: { autoRefreshToken: false, persistSession: false },
    })
    const { data: { user }, error: authError } = await supabaseUser.auth.getUser()
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Non authentifié' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Check Jarvis hasn't already replied
    const { data: existing } = await supabase
      .from('community_comments')
      .select('id')
      .eq('post_id', post_id)
      .eq('author_display_name', 'Jarvis')
      .maybeSingle()

    if (existing) {
      return new Response(JSON.stringify({ skipped: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const replies = await generateJarvisReplies([{ id: post_id, content, type, author }])
    const reply = replies[0]?.reply
    if (!reply) throw new Error('No reply generated')

    await supabase.from('community_comments').insert({
      post_id,
      user_id:             null,
      content:             reply,
      author_display_name: 'Jarvis',
      author_level:        'scaler',
    })

    return new Response(JSON.stringify({ ok: true, reply }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (err) {
    console.error('[jarvis-community-reply] Error:', err)
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
