// supabase/functions/gif-search/index.ts
// Proxy GIPHY API to avoid CORS issues from the browser

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const GIPHY_KEY = Deno.env.get('GIPHY_API_KEY') ?? 'dc6zaTOxFJmzC'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const url    = new URL(req.url)
    const q      = url.searchParams.get('q') ?? ''
    const limit  = url.searchParams.get('limit') ?? '12'

    const endpoint = q.trim()
      ? `https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_KEY}&q=${encodeURIComponent(q)}&limit=${limit}&rating=g&lang=fr`
      : `https://api.giphy.com/v1/gifs/trending?api_key=${GIPHY_KEY}&limit=${limit}&rating=g`

    const res  = await fetch(endpoint)
    const data = await res.json()

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err), data: [] }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
