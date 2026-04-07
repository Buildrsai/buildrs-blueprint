// supabase/functions/scanner-collect/index.ts
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-scanner-token',
}

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const SCANNER_AUTH_TOKEN = Deno.env.get('SCANNER_AUTH_TOKEN') ?? ''
const PRODUCTHUNT_TOKEN = Deno.env.get('PRODUCTHUNT_TOKEN') ?? ''
const APIFY_TOKEN = Deno.env.get('APIFY_TOKEN') ?? ''

// Apify actor IDs
const REDDIT_ACTOR = 'trudax~reddit-scraper'
const ACQUIRE_ACTOR = 'apify~web-scraper'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  const token = req.headers.get('x-scanner-token')
  if (!SCANNER_AUTH_TOKEN || token !== SCANNER_AUTH_TOKEN) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  const url = new URL(req.url)
  const source = url.searchParams.get('source')
  const fetchResults = url.searchParams.get('fetch_results') === 'true'
  const runId = url.searchParams.get('run_id')

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false }
  })

  try {
    let result: { items_collected: number; items_new: number; run_id?: string; run_status?: string }

    if (source === 'product_hunt') {
      result = await collectProductHunt(supabase)
    } else if (source === 'reddit') {
      result = await collectRedditApify(supabase, fetchResults, runId)
    } else if (source === 'acquire') {
      result = await collectAcquire(supabase, fetchResults, runId)
    } else if (source === 'hacker_news') {
      result = await collectHackerNews(supabase)
    } else {
      return new Response(JSON.stringify({ error: `Unknown source: ${source}` }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    return new Response(JSON.stringify({ source, ...result }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (err) {
    console.error(`[scanner-collect] ${source} error:`, err)
    return new Response(JSON.stringify({ error: String(err), source }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})

// ── Product Hunt ─────────────────────────────────────────────────────────────

async function collectProductHunt(supabase: ReturnType<typeof createClient>) {
  if (!PRODUCTHUNT_TOKEN) throw new Error('PRODUCTHUNT_TOKEN not configured')
  const yesterday = new Date(Date.now() - 86400 * 1000).toISOString()

  const query = `
    query {
      posts(order: VOTES, first: 20, postedAfter: "${yesterday}") {
        edges {
          node {
            id name tagline description
            votesCount reviewsCount
            url website
            topics { edges { node { name } } }
            createdAt
          }
        }
      }
    }
  `

  const res = await fetch('https://api.producthunt.com/v2/api/graphql', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${PRODUCTHUNT_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  })

  const data = await res.json()
  const posts = data?.data?.posts?.edges ?? []

  const rows = posts.map(({ node }: { node: Record<string, unknown> }) => {
    const topics = (node.topics as { edges: { node: { name: string } }[] })?.edges?.map((e) => e.node.name) ?? []
    return {
      source: 'product_hunt',
      source_id: String(node.id),
      source_url: node.url,
      name: node.name,
      description: `${node.tagline}. ${node.description ?? ''}`.trim(),
      raw_data: node,
      upvotes: node.votesCount ?? 0,
      reviews_count: node.reviewsCount ?? 0,
      category: topics[0]?.toLowerCase() ?? null,
      website_url: node.website ?? null,
    }
  })

  if (rows.length === 0) return { items_collected: 0, items_new: 0 }

  const { data: inserted, error } = await supabase
    .from('saas_raw_discoveries')
    .upsert(rows, { onConflict: 'source,source_id', ignoreDuplicates: true })
    .select('id')

  if (error) throw error
  return { items_collected: posts.length, items_new: (inserted ?? []).length }
}

// ── Reddit via Apify ──────────────────────────────────────────────────────────

async function collectRedditApify(
  supabase: ReturnType<typeof createClient>,
  fetchResults: boolean,
  runId: string | null
) {
  if (!APIFY_TOKEN) throw new Error('APIFY_TOKEN not configured')

  // Mode 1: Launch the actor (async, immediate return)
  if (!fetchResults) {
    const res = await fetch(
      `https://api.apify.com/v2/acts/${REDDIT_ACTOR}/runs?token=${APIFY_TOKEN}&waitForFinish=0`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          searches: [
            'SaaS revenue MRR',
            'micro SaaS making money',
            'built something earning',
            'indie hacker MRR milestone',
          ],
          subreddits: ['SaaS', 'indiehackers', 'microsaas', 'startups', 'EntrepreneurRideAlong'],
          maxItems: 60,
          minUpvotes: 10,
          includeNSFW: false,
        }),
      }
    )
    const data = await res.json()
    return { items_collected: 0, items_new: 0, run_id: data?.data?.id ?? null }
  }

  // Mode 2: Fetch results from a completed run
  if (!runId) throw new Error('run_id required for fetch_results mode')

  const statusRes = await fetch(`https://api.apify.com/v2/actor-runs/${runId}?token=${APIFY_TOKEN}`)
  const statusData = await statusRes.json()
  const status = statusData?.data?.status

  if (status !== 'SUCCEEDED') {
    return { items_collected: 0, items_new: 0, run_status: status }
  }

  const datasetId = statusData?.data?.defaultDatasetId
  const itemsRes = await fetch(
    `https://api.apify.com/v2/datasets/${datasetId}/items?token=${APIFY_TOKEN}&format=json`
  )
  const items = await itemsRes.json()

  const MONEY_PATTERNS = /(\$[\d,]+|\d+k?\/mo|\bMRR\b|\bARR\b|\brevenue\b|\bpaying\b)/i

  const rows = (Array.isArray(items) ? items : [])
    .filter((item: Record<string, unknown>) => {
      const text = `${item.title ?? ''} ${item.body ?? item.selftext ?? ''}`
      return MONEY_PATTERNS.test(text)
    })
    .map((item: Record<string, unknown>) => {
      const text = `${item.title ?? ''} ${item.body ?? item.selftext ?? ''}`
      const mrrMatch = String(text).match(/\$(\d+[,\d]*)\s*(?:MRR|\/mo|\/month)/i)
      const mrr = mrrMatch ? parseInt(mrrMatch[1].replace(/,/g, '')) : null
      return {
        source: 'reddit',
        source_id: String(item.id ?? item.postId ?? `reddit_${Date.now()}_${Math.random()}`),
        source_url: String(item.url ?? item.postUrl ?? ''),
        name: String(item.title ?? '').slice(0, 100),
        description: String(item.body ?? item.selftext ?? '').slice(0, 500),
        raw_data: item,
        mrr_mentioned: mrr,
        upvotes: Number(item.upvotes ?? item.score ?? 0),
        category: null,
        website_url: null,
      }
    })
    .filter((r: { source_url: string }) => r.source_url)

  if (rows.length === 0) return { items_collected: 0, items_new: 0 }

  const { data: inserted, error } = await supabase
    .from('saas_raw_discoveries')
    .upsert(rows, { onConflict: 'source,source_id', ignoreDuplicates: true })
    .select('id')

  if (error) throw error
  return { items_collected: rows.length, items_new: (inserted ?? []).length }
}

// ── Hacker News (Show HN) — gratuit via Algolia API ──────────────────────────

async function collectHackerNews(supabase: ReturnType<typeof createClient>) {
  const MONEY_PATTERNS = /(\$[\d,]+|\d+k?\/mo|\bMRR\b|\bARR\b|\brevenue\b|\bpaying\b|\bpaid\b|\bsubscription\b)/i
  const SAAS_PATTERNS = /(saas|software|app|tool|dashboard|api|platform|service|automation)/i

  // Two queries: MRR-focused + general SaaS Show HN
  const queries = [
    'https://hn.algolia.com/api/v1/search?tags=show_hn&query=saas+revenue&hitsPerPage=20&numericFilters=points%3E15',
    'https://hn.algolia.com/api/v1/search?tags=show_hn&query=mrr+indie&hitsPerPage=20&numericFilters=points%3E15',
    'https://hn.algolia.com/api/v1/search?tags=show_hn&query=built+making+money&hitsPerPage=15&numericFilters=points%3E20',
  ]

  const allHits: Record<string, unknown>[] = []
  const seenIds = new Set<string>()

  for (const queryUrl of queries) {
    try {
      const res = await fetch(queryUrl, {
        headers: { 'User-Agent': 'BuildrsScanner/1.0' }
      })
      const data = await res.json()
      for (const hit of (data.hits ?? [])) {
        if (!seenIds.has(hit.objectID)) {
          seenIds.add(hit.objectID)
          allHits.push(hit)
        }
      }
    } catch (err) {
      console.warn('HN query failed:', err)
    }
  }

  const rows = allHits
    .filter((hit: Record<string, unknown>) => {
      const text = `${hit.title ?? ''} ${hit.story_text ?? hit.comment_text ?? ''}`
      return MONEY_PATTERNS.test(String(text)) || SAAS_PATTERNS.test(String(text))
    })
    .map((hit: Record<string, unknown>) => {
      const text = `${hit.title ?? ''} ${hit.story_text ?? ''}`
      const mrrMatch = String(text).match(/\$(\d+[,\d]*)\s*(?:MRR|\/mo|\/month)/i)
      const mrr = mrrMatch ? parseInt(mrrMatch[1].replace(/,/g, '')) : null
      return {
        source: 'hacker_news',
        source_id: String(hit.objectID),
        source_url: `https://news.ycombinator.com/item?id=${hit.objectID}`,
        name: String(hit.title ?? '').slice(0, 100),
        description: String(hit.story_text ?? '').replace(/<[^>]+>/g, '').slice(0, 500),
        raw_data: hit,
        mrr_mentioned: mrr,
        upvotes: Number(hit.points ?? 0),
        category: null,
        website_url: hit.url ? String(hit.url) : null,
      }
    })

  if (rows.length === 0) return { items_collected: 0, items_new: 0 }

  const { data: inserted, error } = await supabase
    .from('saas_raw_discoveries')
    .upsert(rows, { onConflict: 'source,source_id', ignoreDuplicates: true })
    .select('id')

  if (error) throw error
  return { items_collected: rows.length, items_new: (inserted ?? []).length }
}

// ── Acquire.com via Apify ────────────────────────────────────────────────────

async function collectAcquire(
  supabase: ReturnType<typeof createClient>,
  fetchResults: boolean,
  runId: string | null
) {
  if (!APIFY_TOKEN) throw new Error('APIFY_TOKEN not configured')

  if (!fetchResults) {
    const res = await fetch(
      `https://api.apify.com/v2/acts/${ACQUIRE_ACTOR}/runs?token=${APIFY_TOKEN}&waitForFinish=0`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          startUrls: [{ url: 'https://acquire.com/search/?category=saas&price_max=50000' }],
          maxPagesPerCrawl: 3,
          pageFunction: `async function pageFunction(context) {
            const $ = context.jQuery;
            const listings = [];
            $('.listing-card, [class*="listing"]').each((i, el) => {
              listings.push({
                name: $(el).find('[class*="name"], h2, h3').first().text().trim(),
                description: $(el).find('[class*="desc"], p').first().text().trim(),
                mrr: $(el).find('[class*="mrr"], [class*="revenue"]').first().text().trim(),
                url: $(el).find('a').first().attr('href') || '',
              });
            });
            return listings;
          }`,
        }),
      }
    )
    const data = await res.json()
    return { items_collected: 0, items_new: 0, run_id: data?.data?.id ?? null }
  }

  if (!runId) throw new Error('run_id required for fetch_results mode')

  const statusRes = await fetch(`https://api.apify.com/v2/actor-runs/${runId}?token=${APIFY_TOKEN}`)
  const statusData = await statusRes.json()
  const status = statusData?.data?.status

  if (status !== 'SUCCEEDED') {
    return { items_collected: 0, items_new: 0, run_status: status }
  }

  const datasetId = statusData?.data?.defaultDatasetId
  const itemsRes = await fetch(
    `https://api.apify.com/v2/datasets/${datasetId}/items?token=${APIFY_TOKEN}&format=json`
  )
  const items = await itemsRes.json()

  const rows = (Array.isArray(items) ? items.flat() : [])
    .filter((item: Record<string, string>) => item.name && item.description)
    .map((item: Record<string, string>, idx: number) => {
      const mrrMatch = item.mrr?.match(/\$?([\d,]+)/)
      const mrr = mrrMatch ? parseInt(mrrMatch[1].replace(/,/g, '')) : null
      return {
        source: 'acquire',
        source_id: item.url || `acquire_${Date.now()}_${idx}`,
        source_url: item.url?.startsWith('http') ? item.url : `https://acquire.com${item.url}`,
        name: item.name?.slice(0, 100),
        description: item.description?.slice(0, 500),
        raw_data: item,
        mrr_mentioned: mrr,
        website_url: null,
      }
    })

  if (rows.length === 0) return { items_collected: 0, items_new: 0 }

  const { data: inserted, error } = await supabase
    .from('saas_raw_discoveries')
    .upsert(rows, { onConflict: 'source,source_id', ignoreDuplicates: true })
    .select('id')

  if (error) throw error
  return { items_collected: rows.length, items_new: (inserted ?? []).length }
}
