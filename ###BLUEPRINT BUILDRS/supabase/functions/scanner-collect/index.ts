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
const REDDIT_CLIENT_ID = Deno.env.get('REDDIT_CLIENT_ID') ?? ''
const REDDIT_CLIENT_SECRET = Deno.env.get('REDDIT_CLIENT_SECRET') ?? ''
const REDDIT_USERNAME = Deno.env.get('REDDIT_USERNAME') ?? ''
const REDDIT_PASSWORD = Deno.env.get('REDDIT_PASSWORD') ?? ''
const APIFY_TOKEN = Deno.env.get('APIFY_TOKEN') ?? ''

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  // Auth
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
    let result: { items_collected: number; items_new: number; run_id?: string }

    if (source === 'product_hunt') {
      result = await collectProductHunt(supabase)
    } else if (source === 'reddit') {
      result = await collectReddit(supabase)
    } else if (source === 'acquire') {
      result = await collectAcquire(supabase, fetchResults, runId)
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

  const { data: inserted, error: upsertErr } = await supabase
    .from('saas_raw_discoveries')
    .upsert(rows, { onConflict: 'source,source_id', ignoreDuplicates: true })
    .select('id')

  if (upsertErr) throw upsertErr
  return { items_collected: posts.length, items_new: (inserted ?? []).length }
}

async function collectReddit(supabase: ReturnType<typeof createClient>) {
  if (!REDDIT_CLIENT_ID) throw new Error('Reddit credentials not configured')

  const tokenRes = await fetch('https://www.reddit.com/api/v1/access_token', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${btoa(`${REDDIT_CLIENT_ID}:${REDDIT_CLIENT_SECRET}`)}`,
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': 'BuildrsScanner/1.0 by buildrs.fr',
    },
    body: new URLSearchParams({
      grant_type: 'password',
      username: REDDIT_USERNAME,
      password: REDDIT_PASSWORD,
    }),
  })
  const tokenData = await tokenRes.json()
  const accessToken = tokenData.access_token
  if (!accessToken) throw new Error('Reddit auth failed')

  const MONEY_PATTERNS = /(\$[\d,]+|\d+k?\/mo|\bMRR\b|\bARR\b|\brevenue\b|\bpaying\b)/i
  const SUBREDDITS = ['SaaS', 'indiehackers', 'microsaas', 'startups', 'EntrepreneurRideAlong']
  const allRows: Record<string, unknown>[] = []

  for (const sub of SUBREDDITS) {
    const res = await fetch(`https://oauth.reddit.com/r/${sub}/hot?limit=25`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'User-Agent': 'BuildrsScanner/1.0 by buildrs.fr',
      },
    })
    const json = await res.json()
    const posts = json?.data?.children ?? []

    for (const { data: post } of posts) {
      if (post.score < 10) continue
      const text = `${post.title} ${post.selftext ?? ''}`
      if (!MONEY_PATTERNS.test(text)) continue

      const mrrMatch = text.match(/\$(\d+[,\d]*)\s*(?:MRR|\/mo|\/month)/i)
      const mrr = mrrMatch ? parseInt(mrrMatch[1].replace(/,/g, '')) : null

      allRows.push({
        source: 'reddit',
        source_id: post.id,
        source_url: `https://reddit.com${post.permalink}`,
        name: post.title.slice(0, 100),
        description: post.selftext?.slice(0, 500) ?? '',
        raw_data: { id: post.id, title: post.title, selftext: post.selftext, score: post.score, subreddit: sub },
        mrr_mentioned: mrr,
        upvotes: post.score,
        category: sub.toLowerCase() === 'microsaas' ? 'other' : null,
        website_url: post.url?.startsWith('http') && !post.url.includes('reddit.com') ? post.url : null,
      })
    }
  }

  if (allRows.length === 0) return { items_collected: 0, items_new: 0 }

  const { data: inserted, error } = await supabase
    .from('saas_raw_discoveries')
    .upsert(allRows, { onConflict: 'source,source_id', ignoreDuplicates: true })
    .select('id')

  if (error) throw error
  return { items_collected: allRows.length, items_new: (inserted ?? []).length }
}

const ACQUIRE_ACTOR = 'apify~web-scraper'

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
  const itemsRes = await fetch(`https://api.apify.com/v2/datasets/${datasetId}/items?token=${APIFY_TOKEN}&format=json`)
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
