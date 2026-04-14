# Scanner + Marketplace V2 Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remplacer le systeme `saas_ideas` statique par un pipeline automatise (Scanner) qui collecte les SaaS performants sur PH/Reddit/Acquire, les score via Claude (Build Score), et les presente dans une Marketplace interactive integree au dashboard Buildrs existant.

**Architecture:** 3 edge functions Supabase (scanner-collect, scanner-score, scanner-status) orchestrees par n8n via cron quotidien. Migration du schema Supabase `saas_ideas` → `saas_opportunities`. Remplacement des composants React existants par la nouvelle Marketplace avec cards Build Score, fiche detail 4 sections, et integration Claude OS Generator.

**Tech Stack:** Deno (Edge Functions), Claude API Haiku + Sonnet, Product Hunt GraphQL API, Reddit OAuth2 API, Apify (Acquire scraping), React 18 + TypeScript + Vite, Supabase JS v2, Tailwind CSS, Lucide React.

**Design spec:** `docs/superpowers/specs/2026-04-07-scanner-marketplace-v2-design.md`

**Preview workflow** (pas de npm run dev) :
```bash
cd "###BLUEPRINT BUILDRS/blueprint-app"
npx vite build && pkill -f "serve dist" 2>/dev/null; npx serve dist --listen 4000 &
open http://localhost:4000
```

---

## Chunk 1: Schema Supabase

Trois tables nouvelles + migration des donnees existantes + suppression des tables remplacees.

### Task 1: Migration saas_raw_discoveries

**NOTE sur l'ordre des migrations :** Toutes les migrations du Chunk 1 ont le meme prefixe date. Elles doivent etre appliquees sequentiellement via Supabase MCP (comme indique dans chaque tache). Ne pas faire `supabase db push` en masse sans verifier l'ordre lexicographique. Si besoin, renommer avec suffixes numeriques : `20260407_001_`, `20260407_002_`, etc.

**Files:**
- Create: `supabase/migrations/20260407_001_saas_raw_discoveries.sql`

- [ ] **Creer la migration SQL**

```sql
-- supabase/migrations/20260407_001_saas_raw_discoveries.sql

CREATE TABLE IF NOT EXISTS saas_raw_discoveries (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source          text NOT NULL CHECK (source IN ('product_hunt','reddit','acquire','indie_hackers','g2_capterra')),
  source_id       text NOT NULL,
  source_url      text NOT NULL,
  name            text,
  description     text,
  raw_data        jsonb NOT NULL DEFAULT '{}',
  mrr_mentioned   integer,
  upvotes         integer,
  reviews_count   integer,
  category        text,
  website_url     text,
  is_processed    boolean NOT NULL DEFAULT false,
  discovered_at   timestamptz NOT NULL DEFAULT now()
);

-- Dedup par source + source_id
CREATE UNIQUE INDEX saas_raw_discoveries_source_id_idx ON saas_raw_discoveries(source, source_id);

-- Index pour le scoring pipeline
CREATE INDEX saas_raw_discoveries_unprocessed_idx ON saas_raw_discoveries(is_processed) WHERE is_processed = false;

-- RLS : service role only
ALTER TABLE saas_raw_discoveries ENABLE ROW LEVEL SECURITY;
-- Pas de policy user : acces uniquement via service key
```

- [ ] **Appliquer la migration via Supabase MCP**

Utiliser `mcp__claude_ai_Supabase__apply_migration` avec le contenu SQL ci-dessus.

- [ ] **Verifier la migration**

Utiliser `mcp__claude_ai_Supabase__execute_sql` :
```sql
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public' AND table_name = 'saas_raw_discoveries';
```
Resultat attendu : 1 ligne retournee.

- [ ] **Commit**
```bash
git add supabase/migrations/20260407_saas_raw_discoveries.sql
git commit -m "feat(db): create saas_raw_discoveries table for scanner pipeline"
```

---

### Task 2: Migration saas_opportunities

**Files:**
- Create: `supabase/migrations/20260407_saas_opportunities.sql`

- [ ] **Creer la migration SQL**

```sql
-- supabase/migrations/20260407_saas_opportunities.sql

CREATE TABLE IF NOT EXISTS saas_opportunities (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  raw_id                uuid REFERENCES saas_raw_discoveries(id) ON DELETE SET NULL,
  name                  text NOT NULL,
  slug                  text UNIQUE NOT NULL,
  tagline               text NOT NULL,
  problem_solved        text NOT NULL DEFAULT '',
  source                text NOT NULL,
  source_url            text,
  website_url           text,
  category              text NOT NULL DEFAULT 'other',
  mrr_estimated         integer,
  mrr_confidence        integer CHECK (mrr_confidence BETWEEN 1 AND 10),
  traction_score        integer NOT NULL DEFAULT 0 CHECK (traction_score BETWEEN 0 AND 100),
  cloneability_score    integer NOT NULL DEFAULT 0 CHECK (cloneability_score BETWEEN 0 AND 100),
  monetization_score    integer NOT NULL DEFAULT 0 CHECK (monetization_score BETWEEN 0 AND 100),
  build_score           integer NOT NULL DEFAULT 0 CHECK (build_score BETWEEN 0 AND 100),
  why_reproducible      text,
  recommended_stack     jsonb,
  differentiation_angle text,
  mvp_features          jsonb,
  pain_points           jsonb,
  niche_suggestions     jsonb,
  acquisition_channels  jsonb,
  pricing_suggestion    text,
  status                text NOT NULL DEFAULT 'active' CHECK (status IN ('active','archived','flagged')),
  scored_at             timestamptz,
  created_at            timestamptz NOT NULL DEFAULT now()
);

-- Index de tri principal
CREATE INDEX saas_opportunities_build_score_idx ON saas_opportunities(build_score DESC) WHERE status = 'active';
CREATE INDEX saas_opportunities_category_idx ON saas_opportunities(category) WHERE status = 'active';

-- Full-text search : GIN index sur concatenation
ALTER TABLE saas_opportunities ADD COLUMN IF NOT EXISTS search_vector tsvector
  GENERATED ALWAYS AS (to_tsvector('french', coalesce(name,'') || ' ' || coalesce(tagline,'') || ' ' || coalesce(problem_solved,''))) STORED;
CREATE INDEX saas_opportunities_search_idx ON saas_opportunities USING GIN(search_vector);

-- RLS : lecture pour les utilisateurs authentifies
ALTER TABLE saas_opportunities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can read active opportunities"
  ON saas_opportunities FOR SELECT
  TO authenticated
  USING (status = 'active');
-- INSERT/UPDATE/DELETE : service role uniquement (pas de policy = blocked pour authenticated)
```

- [ ] **Appliquer la migration via Supabase MCP**

- [ ] **Verifier : colonnes + index**

```sql
SELECT column_name, data_type FROM information_schema.columns
WHERE table_name = 'saas_opportunities' ORDER BY ordinal_position;
```

- [ ] **Commit**
```bash
git add supabase/migrations/20260407_saas_opportunities.sql
git commit -m "feat(db): create saas_opportunities table with build score schema"
```

---

### Task 3: Migration scanner_runs et user_saved_opportunities

**Files:**
- Create: `supabase/migrations/20260407_scanner_runs_and_saves.sql`

- [ ] **Creer la migration SQL**

```sql
-- supabase/migrations/20260407_scanner_runs_and_saves.sql

-- Table de logs d'execution du Scanner
CREATE TABLE IF NOT EXISTS scanner_runs (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trigger_type     text NOT NULL CHECK (trigger_type IN ('cron','manual')),
  sources_scanned  jsonb,
  items_collected  integer DEFAULT 0,
  items_new        integer DEFAULT 0,
  items_scored     integer DEFAULT 0,
  errors           jsonb,
  duration_ms      integer,
  started_at       timestamptz NOT NULL DEFAULT now(),
  completed_at     timestamptz
);

ALTER TABLE scanner_runs ENABLE ROW LEVEL SECURITY;
-- Service role only (pas de policy user)

-- Table de sauvegarde d'opportunites par user (remplace user_saved_ideas)
CREATE TABLE IF NOT EXISTS user_saved_opportunities (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  opportunity_id  uuid NOT NULL REFERENCES saas_opportunities(id) ON DELETE CASCADE,
  saved_at        timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, opportunity_id)
);

ALTER TABLE user_saved_opportunities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage their own saved opportunities"
  ON user_saved_opportunities FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
```

- [ ] **Appliquer la migration via Supabase MCP**

- [ ] **Verifier les deux tables**

```sql
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('scanner_runs', 'user_saved_opportunities');
```
Resultat attendu : 2 lignes.

- [ ] **Commit**
```bash
git add supabase/migrations/20260407_scanner_runs_and_saves.sql
git commit -m "feat(db): add scanner_runs and user_saved_opportunities tables"
```

---

### Task 4: Migration des donnees saas_ideas existantes

**Files:**
- Create: `supabase/migrations/20260407_migrate_saas_ideas.sql`

- [ ] **Inspecter les donnees existantes**

```sql
SELECT id, title, slug, difficulty, mrr_min, mrr_max, target_audience, tags, created_at
FROM saas_ideas LIMIT 5;
```

- [ ] **Creer la migration de donnees**

```sql
-- supabase/migrations/20260407_migrate_saas_ideas.sql
-- Migre les donnees de saas_ideas vers saas_opportunities
-- avec des valeurs de build_score par defaut (source = manual_curated)

INSERT INTO saas_opportunities (
  name,
  slug,
  tagline,
  problem_solved,
  source,
  category,
  mrr_estimated,
  mrr_confidence,
  traction_score,
  cloneability_score,
  monetization_score,
  build_score,
  recommended_stack,
  status,
  created_at
)
SELECT
  title                                               AS name,
  slug,
  COALESCE(target_audience, title)                    AS tagline,
  COALESCE(problem_md, '')                            AS problem_solved,
  'manual_curated'                                    AS source,
  CASE
    WHEN 'crm' = ANY(tags)       THEN 'crm'
    WHEN 'invoicing' = ANY(tags) THEN 'invoicing'
    WHEN 'analytics' = ANY(tags) THEN 'analytics'
    WHEN 'scheduling' = ANY(tags)THEN 'scheduling'
    WHEN 'marketing' = ANY(tags) THEN 'marketing'
    ELSE 'other'
  END                                                 AS category,
  mrr_max                                             AS mrr_estimated,
  7                                                   AS mrr_confidence,
  -- Convertit difficulty (1-5) en traction_score (0-100) : plus facile = moins de traction
  LEAST(100, (6 - difficulty) * 15 + 20)              AS traction_score,
  -- Cloneability : inverse de la difficulte
  CASE difficulty
    WHEN 1 THEN 90
    WHEN 2 THEN 80
    WHEN 3 THEN 65
    WHEN 4 THEN 45
    WHEN 5 THEN 25
  END                                                 AS cloneability_score,
  -- Monetization : base sur le MRR max
  CASE
    WHEN mrr_max >= 10000 THEN 85
    WHEN mrr_max >= 5000  THEN 75
    WHEN mrr_max >= 2000  THEN 65
    WHEN mrr_max >= 1000  THEN 55
    ELSE 45
  END                                                 AS monetization_score,
  -- Build Score composite = traction*0.30 + cloneability*0.40 + monetization*0.30
  ROUND(
    (LEAST(100, (6 - difficulty) * 15 + 20) * 0.30) +
    (CASE difficulty WHEN 1 THEN 90 WHEN 2 THEN 80 WHEN 3 THEN 65 WHEN 4 THEN 45 ELSE 25 END * 0.40) +
    (CASE WHEN mrr_max >= 10000 THEN 85 WHEN mrr_max >= 5000 THEN 75 WHEN mrr_max >= 2000 THEN 65 WHEN mrr_max >= 1000 THEN 55 ELSE 45 END * 0.30)
  )                                                   AS build_score,
  stack::jsonb                                        AS recommended_stack,
  'active'                                            AS status,
  created_at
FROM saas_ideas
ON CONFLICT (slug) DO NOTHING;

-- Migrer les saves existants
INSERT INTO user_saved_opportunities (user_id, opportunity_id, saved_at)
SELECT
  usi.user_id,
  so.id,
  usi.saved_at
FROM user_saved_ideas usi
JOIN saas_ideas si ON si.id = usi.idea_id
JOIN saas_opportunities so ON so.slug = si.slug
ON CONFLICT (user_id, opportunity_id) DO NOTHING;
```

- [ ] **Appliquer la migration**

- [ ] **Verifier la migration**

```sql
SELECT COUNT(*) FROM saas_opportunities WHERE source = 'manual_curated';
SELECT MIN(build_score), MAX(build_score), AVG(build_score) FROM saas_opportunities;
```

- [ ] **Commit**
```bash
git add supabase/migrations/20260407_migrate_saas_ideas.sql
git commit -m "feat(db): migrate saas_ideas data to saas_opportunities with build scores"
```

---

## Chunk 2: Edge Functions Scanner

Trois edge functions Deno, pattern identique aux fonctions IA existantes.

### Task 5: scanner-collect — Product Hunt

**Files:**
- Create: `supabase/functions/scanner-collect/index.ts`

- [ ] **Creer la structure de base de la fonction**

```typescript
// supabase/functions/scanner-collect/index.ts
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-scanner-token',
}

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const SCANNER_AUTH_TOKEN = Deno.env.get('SCANNER_AUTH_TOKEN')!
const PRODUCTHUNT_TOKEN = Deno.env.get('PRODUCTHUNT_TOKEN')!
const REDDIT_CLIENT_ID = Deno.env.get('REDDIT_CLIENT_ID')!
const REDDIT_CLIENT_SECRET = Deno.env.get('REDDIT_CLIENT_SECRET')!
const REDDIT_USERNAME = Deno.env.get('REDDIT_USERNAME')!
const REDDIT_PASSWORD = Deno.env.get('REDDIT_PASSWORD')!
const APIFY_TOKEN = Deno.env.get('APIFY_TOKEN')!

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  // Auth
  const token = req.headers.get('x-scanner-token')
  if (token !== SCANNER_AUTH_TOKEN) {
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
```

- [ ] **Implementer collectProductHunt**

```typescript
async function collectProductHunt(supabase: ReturnType<typeof createClient>) {
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

  // Upsert unique — ignoreDuplicates gere le ON CONFLICT via l'index UNIQUE(source, source_id)
  // Construire les rows et faire un seul upsert (ON CONFLICT DO NOTHING via ignoreDuplicates)
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

  const { data: inserted, error: upsertErr } = await supabase
    .from('saas_raw_discoveries')
    .upsert(rows, { onConflict: 'source,source_id', ignoreDuplicates: true })
    .select('id')

  if (upsertErr) throw upsertErr

  return { items_collected: posts.length, items_new: (inserted ?? []).length }
}
```

- [ ] **Implementer collectReddit**

```typescript
async function collectReddit(supabase: ReturnType<typeof createClient>) {
  // Step 1: Get OAuth2 token
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

  // Patterns monetaires a detecter
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
      // Filtre : min 10 upvotes + pattern monetaire dans titre ou selftext
      if (post.score < 10) continue
      const text = `${post.title} ${post.selftext ?? ''}`
      if (!MONEY_PATTERNS.test(text)) continue

      // Extraire un MRR si mentionne
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
```

- [ ] **Implementer collectAcquire (Apify async)**

```typescript
// ID de l'actor Apify pour acquire.com
// Utiliser un actor public ou custom. Ex: "apify/web-scraper" avec config custom.
// Pour simplifier le MVP, on utilise une URL de scraping simple avec Apify Actors.
const ACQUIRE_ACTOR = 'apify~web-scraper'

async function collectAcquire(
  supabase: ReturnType<typeof createClient>,
  fetchResults: boolean,
  runId: string | null
) {
  // Mode 1: Lancer l'actor Apify (retour immediat)
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
    return {
      items_collected: 0,
      items_new: 0,
      run_id: data?.data?.id ?? null,
    }
  }

  // Mode 2: Fetch les resultats du run Apify
  if (!runId) throw new Error('run_id required for fetch_results mode')

  const statusRes = await fetch(
    `https://api.apify.com/v2/actor-runs/${runId}?token=${APIFY_TOKEN}`
  )
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
```

- [ ] **Deployer la fonction via Supabase MCP**

Utiliser `mcp__claude_ai_Supabase__deploy_edge_function` avec le nom `scanner-collect`.

- [ ] **Commit**
```bash
git add supabase/functions/scanner-collect/
git commit -m "feat(edge): scanner-collect for Product Hunt, Reddit, Acquire"
```

---

### Task 6: scanner-score — Build Score Engine

**Files:**
- Create: `supabase/functions/scanner-score/index.ts`

- [ ] **Creer la fonction avec le prompt Haiku**

```typescript
// supabase/functions/scanner-score/index.ts
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-scanner-token',
}

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const SCANNER_AUTH_TOKEN = Deno.env.get('SCANNER_AUTH_TOKEN')!
const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY')!

const SCORE_SCHEMA = `{
  "name": "string",
  "tagline": "string (1 ligne max)",
  "problem_solved": "string (1-2 phrases)",
  "category": "string (parmi: crm, invoicing, scheduling, analytics, hr, marketing, productivity, ecommerce, education, health, other)",
  "traction_score": "number (0-100)",
  "cloneability_score": "number (0-100)",
  "monetization_score": "number (0-100)",
  "why_reproducible": "string (2-3 phrases)",
  "recommended_stack": ["string"],
  "differentiation_angle": "string (1-2 phrases)",
  "mvp_features": ["string (5 features max)"],
  "pain_points": ["string"] ou null,
  "niche_suggestions": ["string (3 verticalisations)"],
  "acquisition_channels": ["string (3 canaux max)"],
  "pricing_suggestion": "string",
  "mrr_estimated": "number ou null",
  "mrr_confidence": "number (1-10) ou null"
}`

function buildHaikuPrompt(item: Record<string, unknown>): string {
  return `Tu es un analyste SaaS expert. Tu recois les donnees brutes d'un SaaS detecte sur le marche.
Tu dois produire un scoring structure et des recommandations actionnables pour un non-developpeur qui veut reproduire ce SaaS avec Claude Code, Supabase, Next.js et Stripe.

DONNEES DU SAAS :
Source: ${item.source}
Nom: ${item.name ?? 'Inconnu'}
Description: ${item.description ?? ''}
URL: ${item.website_url ?? 'N/A'}
MRR mentionne: ${item.mrr_mentioned ?? 'Non mentionne'}
Upvotes/Score: ${item.upvotes ?? 0}

Axes de scoring:
- TRACTION (0-100): Validation marche (upvotes, MRR reel, presence Acquire/PH)
- CLONEABILITY (0-100): Faisabilite par un non-dev avec Claude Code en 30 jours (CRUD+auth+paiement = facile; IA custom lourde = difficile)
- MONETIZATION (0-100): Modele de revenus clair, recurrent, canal d'acquisition identifiable

Reponds UNIQUEMENT en JSON valide avec cette structure exacte :
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
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    }),
  })

  const data = await res.json()
  const text = data?.content?.[0]?.text ?? ''

  // Parse le JSON (peut etre entoure de ```json ... ```)
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
  if (token !== SCANNER_AUTH_TOKEN) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false }
  })

  // Fetch items non traites
  const { data: rawItems, error: fetchErr } = await supabase
    .from('saas_raw_discoveries')
    .select('*')
    .eq('is_processed', false)
    .limit(20)

  if (fetchErr) throw fetchErr
  if (!rawItems || rawItems.length === 0) {
    return new Response(JSON.stringify({ items_scored: 0, message: 'Rien a scorer' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  let itemsScored = 0
  const errors: { id: string; error: string }[] = []

  for (const item of rawItems) {
    try {
      // Delay 500ms entre chaque call
      if (itemsScored > 0) await new Promise(r => setTimeout(r, 500))

      // Phase 1 : Haiku scoring
      const scored = await callClaude(buildHaikuPrompt(item), 'haiku')

      const traction = Number(scored.traction_score) || 0
      const cloneability = Number(scored.cloneability_score) || 0
      const monetization = Number(scored.monetization_score) || 0
      const buildScore = calcBuildScore(traction, cloneability, monetization)

      // Slug unique
      const baseName = String(scored.name || item.name || 'saas')
      let slug = slugify(baseName)
      // Ajouter timestamp si conflit possible
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
        cloneability_score: cloneability,
        monetization_score: monetization,
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

      // Phase 2 : Sonnet enrichissement si build_score > 70
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
          // On continue sans enrichissement Sonnet
        }
      }

      // Insert dans saas_opportunities
      const { error: insertErr } = await supabase
        .from('saas_opportunities')
        .insert(opportunityData)

      if (insertErr) {
        errors.push({ id: item.id, error: insertErr.message })
        continue
      }

      // Marquer comme traite
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
```

- [ ] **Deployer la fonction**

Utiliser `mcp__claude_ai_Supabase__deploy_edge_function` avec le nom `scanner-score`.

- [ ] **Commit**
```bash
git add supabase/functions/scanner-score/
git commit -m "feat(edge): scanner-score Build Score Engine with Haiku+Sonnet hybrid"
```

---

### Task 7: scanner-status — Admin endpoint

**Files:**
- Create: `supabase/functions/scanner-status/index.ts`

- [ ] **Creer la fonction**

```typescript
// supabase/functions/scanner-status/index.ts
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const SCANNER_AUTH_TOKEN = Deno.env.get('SCANNER_AUTH_TOKEN')!

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  // Auth via JWT user (verifie is_admin dans user_metadata)
  const authHeader = req.headers.get('Authorization')
  if (!authHeader) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false }
  })
  const { data: { user }, error: authErr } = await supabase.auth.getUser(
    authHeader.replace('Bearer ', '')
  )
  if (authErr || !user || !user.user_metadata?.is_admin) {
    return new Response(JSON.stringify({ error: 'Admin only' }), {
      status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  const url = new URL(req.url)
  const action = url.searchParams.get('action') ?? 'status'

  if (action === 'status') {
    // Dernieres executions + stats
    const [runsResult, statsResult] = await Promise.all([
      supabase.from('scanner_runs').select('*').order('started_at', { ascending: false }).limit(10),
      supabase.from('saas_opportunities').select('id, source, build_score, status', { count: 'exact' })
        .eq('status', 'active'),
    ])

    const stats = {
      total: runsResult.count ?? 0,
      by_source: {} as Record<string, number>,
      avg_build_score: 0,
    }
    const opps = statsResult.data ?? []
    opps.forEach((o: { source: string }) => {
      stats.by_source[o.source] = (stats.by_source[o.source] || 0) + 1
    })
    const scores = opps.map((o: { build_score: number }) => o.build_score)
    stats.avg_build_score = scores.length > 0
      ? Math.round(scores.reduce((a: number, b: number) => a + b, 0) / scores.length)
      : 0
    stats.total = opps.length

    return new Response(JSON.stringify({
      runs: runsResult.data ?? [],
      stats,
    }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }

  if (action === 'run') {
    // Trigger manuel : appelle scanner-collect + scanner-score
    const started_at = new Date().toISOString()
    const { data: run } = await supabase
      .from('scanner_runs')
      .insert({ trigger_type: 'manual', started_at })
      .select('id')
      .single()

    // Appeler les collecteurs (fire and return, n8n gere le reste)
    const headers = { 'x-scanner-token': SCANNER_AUTH_TOKEN }
    const fnBase = `${SUPABASE_URL}/functions/v1`
    const results = await Promise.allSettled([
      fetch(`${fnBase}/scanner-collect?source=product_hunt`, { method: 'POST', headers }),
      fetch(`${fnBase}/scanner-collect?source=reddit`, { method: 'POST', headers }),
    ])

    let items_collected = 0
    for (const r of results) {
      if (r.status === 'fulfilled') {
        const d = await r.value.json()
        items_collected += d.items_new ?? 0
      }
    }

    // Scorer
    const scoreRes = await fetch(`${fnBase}/scanner-score`, { method: 'POST', headers })
    const scored = await scoreRes.json()

    // Update run log
    await supabase.from('scanner_runs').update({
      items_collected,
      items_new: items_collected,
      items_scored: scored.items_scored ?? 0,
      completed_at: new Date().toISOString(),
      duration_ms: Date.now() - new Date(started_at).getTime(),
    }).eq('id', run?.id)

    return new Response(JSON.stringify({
      success: true,
      run_id: run?.id,
      items_collected,
      items_scored: scored.items_scored,
    }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }

  if (action === 'archive') {
    const id = url.searchParams.get('id')
    if (!id) return new Response(JSON.stringify({ error: 'id required' }), { status: 400, headers: corsHeaders })
    await supabase.from('saas_opportunities').update({ status: 'archived' }).eq('id', id)
    return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }

  if (action === 'flag') {
    const id = url.searchParams.get('id')
    if (!id) return new Response(JSON.stringify({ error: 'id required' }), { status: 400, headers: corsHeaders })
    await supabase.from('saas_opportunities').update({ status: 'flagged' }).eq('id', id)
    return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }

  return new Response(JSON.stringify({ error: `Unknown action: ${action}` }), {
    status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
})
```

- [ ] **Deployer la fonction**

Utiliser `mcp__claude_ai_Supabase__deploy_edge_function` avec le nom `scanner-status`.

- [ ] **Configurer les variables d'environnement Supabase**

Verifier que ces variables sont configurees dans les secrets Supabase :
```
PRODUCTHUNT_TOKEN
REDDIT_CLIENT_ID
REDDIT_CLIENT_SECRET
REDDIT_USERNAME
REDDIT_PASSWORD
APIFY_TOKEN
SCANNER_AUTH_TOKEN
```

- [ ] **Commit**
```bash
git add supabase/functions/scanner-status/
git commit -m "feat(edge): scanner-status admin endpoint with run trigger"
```

---

## Chunk 3: Frontend Marketplace

### Task 8: Hook useOpportunities

**Files:**
- Create: `blueprint-app/src/hooks/useOpportunities.ts`

- [ ] **Creer le hook**

```typescript
// blueprint-app/src/hooks/useOpportunities.ts
import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export interface SaasOpportunity {
  id: string
  name: string
  slug: string
  tagline: string
  problem_solved: string
  source: string
  source_url: string | null
  website_url: string | null
  category: string
  mrr_estimated: number | null
  mrr_confidence: number | null
  traction_score: number
  cloneability_score: number
  monetization_score: number
  build_score: number
  why_reproducible: string | null
  recommended_stack: string[] | null
  differentiation_angle: string | null
  mvp_features: string[] | null
  pain_points: string[] | null
  niche_suggestions: string[] | null
  acquisition_channels: string[] | null
  pricing_suggestion: string | null
  status: string
  scored_at: string | null
  created_at: string
}

export interface OpportunityFilters {
  category?: string | null
  source?: string | null
  buildScoreMin?: number
  search?: string
  sortBy?: 'build_score' | 'created_at' | 'traction_score'
}

const PAGE_SIZE = 20

export function useOpportunities(userId: string | undefined) {
  const [opportunities, setOpportunities] = useState<SaasOpportunity[]>([])
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [offset, setOffset] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)
  const [filters, setFiltersState] = useState<OpportunityFilters>({
    buildScoreMin: 0,
    sortBy: 'build_score',
  })

  const buildQuery = useCallback((currentOffset: number) => {
    let q = supabase
      .from('saas_opportunities')
      .select('*', { count: 'exact' })
      .eq('status', 'active')
      .range(currentOffset, currentOffset + PAGE_SIZE - 1)

    if (filters.category) q = q.eq('category', filters.category)
    if (filters.source) q = q.eq('source', filters.source)
    if (filters.buildScoreMin) q = q.gte('build_score', filters.buildScoreMin)
    if (filters.search && filters.search.trim()) {
      q = q.textSearch('search_vector', filters.search.trim(), { type: 'websearch', config: 'french' })
    }

    const sortCol = filters.sortBy ?? 'build_score'
    q = q.order(sortCol, { ascending: false })

    return q
  }, [filters])

  // Charger la page initiale — dependance sur `filters` uniquement
  // (buildQuery est memo sur filters donc les deux sont equivalents ; garder filters seul evite les double-fire)
  useEffect(() => {
    setLoading(true)
    setOffset(0)
    buildQuery(0).then(({ data, count, error }) => {
      if (error) { console.error(error); setLoading(false); return }
      setOpportunities((data as SaasOpportunity[]) ?? [])
      setTotal(count ?? 0)
      setHasMore((count ?? 0) > PAGE_SIZE)
      setLoading(false)
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters])

  // Charger la derniere execution du scanner
  useEffect(() => {
    supabase
      .from('scanner_runs')
      .select('completed_at')
      .order('completed_at', { ascending: false })
      .limit(1)
      .then(({ data }) => {
        setLastUpdated(data?.[0]?.completed_at ?? null)
      })
  }, [])

  // Charger les saves de l'user
  useEffect(() => {
    if (!userId) return
    supabase
      .from('user_saved_opportunities')
      .select('opportunity_id')
      .eq('user_id', userId)
      .then(({ data }) => {
        setSavedIds(new Set((data ?? []).map((r: { opportunity_id: string }) => r.opportunity_id)))
      })
  }, [userId])

  const loadMore = useCallback(() => {
    const newOffset = offset + PAGE_SIZE
    buildQuery(newOffset).then(({ data, error }) => {
      if (error || !data) return
      setOpportunities(prev => [...prev, ...(data as SaasOpportunity[])])
      setOffset(newOffset)
      setHasMore(newOffset + PAGE_SIZE < total)
    })
  }, [offset, total, buildQuery])

  const setFilters = useCallback((f: OpportunityFilters) => {
    setFiltersState(prev => ({ ...prev, ...f }))
  }, [])

  const saveOpportunity = useCallback(async (id: string) => {
    if (!userId) return
    await supabase.from('user_saved_opportunities').insert({ user_id: userId, opportunity_id: id })
    setSavedIds(prev => new Set([...prev, id]))
  }, [userId])

  const unsaveOpportunity = useCallback(async (id: string) => {
    if (!userId) return
    await supabase.from('user_saved_opportunities').delete()
      .eq('user_id', userId).eq('opportunity_id', id)
    setSavedIds(prev => { const s = new Set(prev); s.delete(id); return s })
  }, [userId])

  return {
    opportunities,
    loading,
    total,
    filters,
    setFilters,
    loadMore,
    hasMore,
    savedIds,
    saveOpportunity,
    unsaveOpportunity,
    lastUpdated,
  }
}

// Hook pour une seule opportunite par slug
export function useOpportunityBySlug(slug: string) {
  const [opportunity, setOpportunity] = useState<SaasOpportunity | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('saas_opportunities')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'active')
      .maybeSingle()
      .then(({ data }) => {
        setOpportunity(data as SaasOpportunity)
        setLoading(false)
      })
  }, [slug])

  return { opportunity, loading }
}
```

- [ ] **Verifier le build**
```bash
cd "###BLUEPRINT BUILDRS/blueprint-app" && npx vite build 2>&1 | tail -20
```
Resultat attendu : aucune erreur TypeScript.

- [ ] **Commit**
```bash
git add blueprint-app/src/hooks/useOpportunities.ts
git commit -m "feat(hooks): useOpportunities avec filtres, pagination, saves"
```

---

### Task 9: MarketplacePage — Catalogue

**Files:**
- Modify: `blueprint-app/src/components/dashboard/MarketplacePage.tsx` (remplace le fichier existant)

- [ ] **Creer les composants de base (helpers et card)**

```typescript
// blueprint-app/src/components/dashboard/MarketplacePage.tsx
import { useState } from 'react'
import { Search, Bookmark, BookmarkCheck, ExternalLink, RefreshCw, TrendingUp, Zap, DollarSign, ChevronDown } from 'lucide-react'
import { useOpportunities, type SaasOpportunity } from '../../hooks/useOpportunities'
import { supabase } from '../../lib/supabase'

// ── Helpers ──────────────────────────────────────────────────────────────────

const SOURCE_COLORS: Record<string, string> = {
  product_hunt: '#ff6154',
  reddit: '#ff4500',
  acquire: '#22c55e',
  indie_hackers: '#0fa',
  g2_capterra: '#3b82f6',
  manual_curated: '#8b5cf6',
}

const SOURCE_LABELS: Record<string, string> = {
  product_hunt: 'PH',
  reddit: 'Reddit',
  acquire: 'Acquire',
  indie_hackers: 'IH',
  g2_capterra: 'G2',
  manual_curated: 'Buildrs',
}

const CATEGORIES = [
  { value: '', label: 'Toutes' },
  { value: 'crm', label: 'CRM' },
  { value: 'invoicing', label: 'Facturation' },
  { value: 'scheduling', label: 'Booking' },
  { value: 'analytics', label: 'Analytics' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'productivity', label: 'Productivite' },
  { value: 'hr', label: 'RH' },
  { value: 'ecommerce', label: 'E-commerce' },
  { value: 'education', label: 'Education' },
  { value: 'health', label: 'Sante' },
  { value: 'other', label: 'Autre' },
]

function scoreColor(score: number): string {
  if (score >= 70) return '#22c55e'
  if (score >= 40) return '#eab308'
  return '#ef4444'
}

function ScoreMiniBar({ label, value, Icon }: { label: string; value: number; Icon: typeof TrendingUp }) {
  return (
    <div className="flex items-center gap-2">
      <Icon size={11} className="shrink-0" style={{ color: scoreColor(value) }} strokeWidth={1.5} />
      <span className="text-[10px] text-muted-foreground w-16 shrink-0">{label}</span>
      <div className="flex-1 h-1 rounded-full bg-border overflow-hidden">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${value}%`, background: scoreColor(value) }}
        />
      </div>
      <span className="text-[10px] font-mono text-muted-foreground w-6 text-right">{value}</span>
    </div>
  )
}

function timeAgo(isoDate: string | null): string {
  if (!isoDate) return 'jamais'
  const diff = Date.now() - new Date(isoDate).getTime()
  const h = Math.floor(diff / 3600000)
  if (h < 1) return 'il y a moins d\'1h'
  if (h < 24) return `il y a ${h}h`
  return `il y a ${Math.floor(h / 24)}j`
}
```

- [ ] **Ajouter le composant OpportunityCard**

```typescript
function OpportunityCard({
  opp, idx, saved, onSave, onOpen,
}: {
  opp: SaasOpportunity
  idx: number
  saved: boolean
  onSave: () => void
  onOpen: () => void
}) {
  const srcColor = SOURCE_COLORS[opp.source] ?? '#8b5cf6'
  const srcLabel = SOURCE_LABELS[opp.source] ?? opp.source

  return (
    <div
      className="border border-border rounded-xl p-5 flex flex-col gap-4 cursor-pointer hover:border-foreground/20 transition-colors bg-card"
      onClick={onOpen}
    >
      {/* Top row */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span
            className="text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide"
            style={{ background: `${srcColor}20`, color: srcColor }}
          >
            {srcLabel}
          </span>
          <span className="text-[9px] font-medium uppercase tracking-widest text-muted-foreground/50">
            {opp.category}
          </span>
        </div>
        <button
          className="text-muted-foreground hover:text-foreground transition-colors"
          onClick={e => { e.stopPropagation(); onSave() }}
        >
          {saved
            ? <BookmarkCheck size={16} strokeWidth={1.5} className="text-foreground" />
            : <Bookmark size={16} strokeWidth={1.5} />
          }
        </button>
      </div>

      {/* Titre */}
      <div>
        <h3 className="font-bold text-foreground text-[15px] leading-tight mb-1" style={{ letterSpacing: '-0.02em' }}>
          {opp.name}
        </h3>
        <p className="text-[12px] text-muted-foreground leading-relaxed line-clamp-2">
          {opp.tagline}
        </p>
      </div>

      {/* Build Score */}
      <div className="border border-border rounded-lg p-3 space-y-2">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground/60">
            Build Score
          </span>
          <span
            className="text-2xl font-black font-mono"
            style={{ color: scoreColor(opp.build_score), letterSpacing: '-0.03em' }}
          >
            {opp.build_score}
          </span>
        </div>
        <ScoreMiniBar label="Traction" value={opp.traction_score} Icon={TrendingUp} />
        <ScoreMiniBar label="Cloneabilite" value={opp.cloneability_score} Icon={Zap} />
        <ScoreMiniBar label="Monetisation" value={opp.monetization_score} Icon={DollarSign} />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-[11px]">
        <div className="text-muted-foreground">
          {opp.mrr_estimated
            ? <span>MRR ~<span className="font-mono font-semibold text-foreground">${opp.mrr_estimated.toLocaleString()}</span></span>
            : <span className="text-muted-foreground/40">MRR inconnu</span>
          }
        </div>
        {opp.differentiation_angle && (
          <span className="text-[9px] font-medium px-2 py-0.5 rounded-full bg-secondary border border-border text-muted-foreground truncate max-w-[120px]">
            {opp.differentiation_angle.slice(0, 30)}
          </span>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Ajouter le composant principal MarketplacePage**

```typescript
export function MarketplacePage({
  userId,
  navigate,
  isAdmin = false,
}: {
  userId: string
  navigate: (hash: string) => void
  isAdmin?: boolean
}) {
  const {
    opportunities, loading, total, filters, setFilters,
    loadMore, hasMore, savedIds, saveOpportunity, unsaveOpportunity, lastUpdated,
  } = useOpportunities(userId)

  const [refreshing, setRefreshing] = useState(false)

  const handleRefresh = async () => {
    setRefreshing(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const token = session?.access_token
      if (!token) return
      const supaUrl = import.meta.env.VITE_SUPABASE_URL as string
      await fetch(`${supaUrl}/functions/v1/scanner-status?action=run`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      })
      // Recharger la page apres 3s
      setTimeout(() => window.location.reload(), 3000)
    } catch (err) {
      console.error(err)
    } finally {
      setRefreshing(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-foreground" style={{ letterSpacing: '-0.04em' }}>
            Marketplace
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {total} opportunites &middot; Mis a jour {timeAgo(lastUpdated)}
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border text-sm font-medium hover:bg-secondary transition-colors disabled:opacity-50"
          >
            <RefreshCw size={14} strokeWidth={1.5} className={refreshing ? 'animate-spin' : ''} />
            Refresh Scanner
          </button>
        )}
      </div>

      {/* Filtres */}
      <div className="flex flex-wrap gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" strokeWidth={1.5} />
          <input
            type="text"
            placeholder="Rechercher..."
            className="w-full pl-9 pr-4 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-foreground/20"
            value={filters.search ?? ''}
            onChange={e => setFilters({ search: e.target.value })}
          />
        </div>

        {/* Categorie */}
        <div className="relative">
          <select
            className="appearance-none pl-3 pr-8 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-foreground/20 cursor-pointer"
            value={filters.category ?? ''}
            onChange={e => setFilters({ category: e.target.value || null })}
          >
            {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
          <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        </div>

        {/* Score min */}
        <div className="flex items-center gap-2 px-3 py-2 border border-border rounded-lg bg-background text-sm">
          <span className="text-muted-foreground text-xs">Score min</span>
          <input
            type="range" min={0} max={90} step={10}
            value={filters.buildScoreMin ?? 0}
            onChange={e => setFilters({ buildScoreMin: Number(e.target.value) })}
            className="w-20 accent-foreground"
          />
          <span className="font-mono text-xs w-6">{filters.buildScoreMin ?? 0}</span>
        </div>

        {/* Source */}
        <div className="relative">
          <select
            className="appearance-none pl-3 pr-8 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-foreground/20 cursor-pointer"
            value={filters.source ?? ''}
            onChange={e => setFilters({ source: e.target.value || null })}
          >
            <option value="">Toutes sources</option>
            <option value="product_hunt">Product Hunt</option>
            <option value="reddit">Reddit</option>
            <option value="acquire">Acquire</option>
            <option value="manual_curated">Buildrs</option>
          </select>
          <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        </div>

        {/* Tri */}
        <div className="relative">
          <select
            className="appearance-none pl-3 pr-8 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none cursor-pointer"
            value={filters.sortBy ?? 'build_score'}
            onChange={e => setFilters({ sortBy: e.target.value as 'build_score' | 'created_at' | 'traction_score' })}
          >
            <option value="build_score">Tri: Score</option>
            <option value="created_at">Tri: Recent</option>
            <option value="traction_score">Tri: Traction</option>
          </select>
          <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        </div>
      </div>

      {/* Grille */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="border border-border rounded-xl p-5 h-64 animate-pulse bg-secondary/30" />
          ))}
        </div>
      ) : opportunities.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-lg font-medium">Aucune opportunite trouvee</p>
          <p className="text-sm mt-1">Modifie les filtres ou reviens apres le prochain scan.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {opportunities.map((opp, idx) => (
            <OpportunityCard
              key={opp.id}
              opp={opp}
              idx={idx}
              saved={savedIds.has(opp.id)}
              onSave={() => savedIds.has(opp.id)
                ? unsaveOpportunity(opp.id)
                : saveOpportunity(opp.id)
              }
              onOpen={() => navigate(`#/dashboard/marketplace/${opp.slug}`)}
            />
          ))}
        </div>
      )}

      {/* Load more */}
      {hasMore && (
        <div className="flex justify-center pt-4">
          <button
            onClick={loadMore}
            className="px-6 py-3 rounded-xl border border-border text-sm font-medium hover:bg-secondary transition-colors"
          >
            Charger plus
          </button>
        </div>
      )}
    </div>
  )
}
```

- [ ] **Verifier le build**
```bash
cd "###BLUEPRINT BUILDRS/blueprint-app" && npx vite build 2>&1 | tail -20
```

- [ ] **Commit**
```bash
git add blueprint-app/src/components/dashboard/MarketplacePage.tsx
git commit -m "feat(ui): MarketplacePage avec grille, filtres, Build Score cards"
```

---

### Task 10: OpportunityDetailPage — Fiche detail

**Files:**
- Create: `blueprint-app/src/components/dashboard/OpportunityDetailPage.tsx`

- [ ] **Creer la page de fiche**

```typescript
// blueprint-app/src/components/dashboard/OpportunityDetailPage.tsx
import { ArrowLeft, ExternalLink, Bookmark, BookmarkCheck, Share2, Zap, TrendingUp, DollarSign, ChevronRight } from 'lucide-react'
import { useOpportunityBySlug } from '../../hooks/useOpportunities'
import { supabase } from '../../lib/supabase'

// Importer BrandIcons (objet avec les SVGs des outils) depuis icons.tsx
// Les icones sont des proprietes de l'objet BrandIcons : BrandIcons.vercel, BrandIcons.supabase, etc.
import { BrandIcons } from '../ui/icons'

// Map stack string → icone BrandIcon
function StackBadge({ name }: { name: string }) {
  const lower = name.toLowerCase()
  // BrandIcons contient : vercel, supabase, stripe, github, tailwind, claude, cloudflare, resend
  const iconKey = Object.keys(BrandIcons).find(k => lower.includes(k)) as keyof typeof BrandIcons | undefined
  const IconComponent = iconKey ? BrandIcons[iconKey] : null

  return (
    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-secondary/50 text-[12px] font-medium">
      {IconComponent && <IconComponent size={14} />}
      {name}
    </span>
  )
}

function ScoreBar({ label, value, Icon }: { label: string; value: number; Icon: typeof TrendingUp }) {
  const color = value >= 70 ? '#22c55e' : value >= 40 ? '#eab308' : '#ef4444'
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-[12px] text-muted-foreground">
          <Icon size={13} strokeWidth={1.5} style={{ color }} />
          {label}
        </div>
        <span className="text-[13px] font-mono font-semibold" style={{ color }}>{value}</span>
      </div>
      <div className="h-1.5 rounded-full bg-border overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${value}%`, background: color }} />
      </div>
    </div>
  )
}

const SOURCE_LABELS: Record<string, string> = {
  product_hunt: 'Product Hunt',
  reddit: 'Reddit',
  acquire: 'Acquire.com',
  indie_hackers: 'Indie Hackers',
  g2_capterra: 'G2 / Capterra',
  manual_curated: 'Buildrs Curated',
}

// Note: la fiche detail recoit les props de save depuis DashboardSection
// pour eviter de re-instancier useOpportunities (le hook est deja dans le parent via MarketplacePage)
// Dans DashboardSection, au rendu idea-detail, passer savedIds + handlers du hook useOpportunities
// (instancie une seule fois dans DashboardSection et partage via props)
export function OpportunityDetailPage({
  slug,
  userId,
  navigate,
  savedIds,
  onSave,
  onUnsave,
}: {
  slug: string
  userId: string
  navigate: (hash: string) => void
  savedIds?: Set<string>
  onSave?: (id: string) => Promise<void>
  onUnsave?: (id: string) => Promise<void>
}) {
  const { opportunity: opp, loading } = useOpportunityBySlug(slug)

  const handleLaunch = () => {
    if (!opp) return
    sessionStorage.setItem('marketplace_context', JSON.stringify({
      name: opp.name,
      problem: opp.problem_solved,
      stack: opp.recommended_stack ?? ['Next.js', 'Supabase', 'Stripe'],
      features: opp.mvp_features ?? [],
      niche: opp.niche_suggestions ?? [],
      pricing: opp.pricing_suggestion ?? '',
      source_slug: opp.slug,
    }))
    navigate('#/dashboard/claude-os/generer')
  }

  const handleShare = () => {
    const url = `${window.location.origin}/#/dashboard/marketplace/${slug}`
    navigator.clipboard.writeText(url)
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6 animate-pulse">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-32 rounded-xl bg-secondary/30 border border-border" />
        ))}
      </div>
    )
  }

  if (!opp) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <p className="text-muted-foreground">Opportunite introuvable.</p>
        <button onClick={() => navigate('#/dashboard/marketplace')} className="mt-4 text-sm underline">
          Retour a la Marketplace
        </button>
      </div>
    )
  }

  const scoreColor = opp.build_score >= 70 ? '#22c55e' : opp.build_score >= 40 ? '#eab308' : '#ef4444'

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">

      {/* Back */}
      <button
        onClick={() => navigate('#/dashboard/marketplace')}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft size={14} strokeWidth={1.5} /> Marketplace
      </button>

      {/* Section 1 — Header */}
      <div className="border border-border rounded-xl p-6 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/50">
                {opp.category}
              </span>
              <span className="text-[9px] font-medium px-2 py-0.5 rounded-full bg-secondary border border-border text-muted-foreground">
                {SOURCE_LABELS[opp.source] ?? opp.source}
              </span>
            </div>
            <h1 className="text-3xl font-black tracking-tight" style={{ letterSpacing: '-0.04em' }}>
              {opp.name}
            </h1>
            <p className="text-muted-foreground mt-1">{opp.tagline}</p>
          </div>
          {/* Build Score */}
          <div className="text-right shrink-0">
            <div className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground/60 mb-1">
              Build Score
            </div>
            <div className="text-5xl font-black font-mono" style={{ color: scoreColor, letterSpacing: '-0.03em' }}>
              {opp.build_score}
            </div>
          </div>
        </div>

        {/* 3 axes */}
        <div className="space-y-3">
          <ScoreBar label="Traction" value={opp.traction_score} Icon={TrendingUp} />
          <ScoreBar label="Cloneabilite" value={opp.cloneability_score} Icon={Zap} />
          <ScoreBar label="Monetisation" value={opp.monetization_score} Icon={DollarSign} />
        </div>

        {/* Liens */}
        <div className="flex items-center gap-3 pt-2">
          {opp.source_url && (
            <a href={opp.source_url} target="_blank" rel="noreferrer"
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
              <ExternalLink size={12} strokeWidth={1.5} /> Voir sur {SOURCE_LABELS[opp.source] ?? opp.source}
            </a>
          )}
          {opp.website_url && (
            <a href={opp.website_url} target="_blank" rel="noreferrer"
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
              <ExternalLink size={12} strokeWidth={1.5} /> Site officiel
            </a>
          )}
        </div>
      </div>

      {/* Section 2 — Analyse */}
      <div className="border border-border rounded-xl p-6 space-y-4">
        <h2 className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60">Analyse</h2>

        <div>
          <h3 className="text-[13px] font-semibold text-foreground mb-1">Probleme resolu</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{opp.problem_solved}</p>
        </div>

        {opp.why_reproducible && (
          <div>
            <h3 className="text-[13px] font-semibold text-foreground mb-1">Pourquoi c'est reproductible</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{opp.why_reproducible}</p>
          </div>
        )}

        {opp.differentiation_angle && (
          <div>
            <h3 className="text-[13px] font-semibold text-foreground mb-1">Angle de differenciation</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{opp.differentiation_angle}</p>
          </div>
        )}

        {opp.pain_points && opp.pain_points.length > 0 && (
          <div>
            <h3 className="text-[13px] font-semibold text-foreground mb-2">Frustrations detectees</h3>
            <ul className="space-y-1">
              {opp.pain_points.map((pain, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="shrink-0 mt-0.5 w-4 h-4 rounded-full bg-secondary border border-border flex items-center justify-center text-[9px] font-bold">
                    {i + 1}
                  </span>
                  {pain}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Section 3 — Blueprint */}
      <div className="border border-border rounded-xl p-6 space-y-4">
        <h2 className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60">Blueprint</h2>

        {opp.mvp_features && opp.mvp_features.length > 0 && (
          <div>
            <h3 className="text-[13px] font-semibold text-foreground mb-2">5 features MVP</h3>
            <ol className="space-y-2">
              {opp.mvp_features.map((feat, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="shrink-0 mt-0.5 w-5 h-5 rounded-full border border-border flex items-center justify-center text-[10px] font-mono font-bold text-foreground">
                    {i + 1}
                  </span>
                  {feat}
                </li>
              ))}
            </ol>
          </div>
        )}

        {opp.recommended_stack && opp.recommended_stack.length > 0 && (
          <div>
            <h3 className="text-[13px] font-semibold text-foreground mb-2">Stack recommandee</h3>
            <div className="flex flex-wrap gap-2">
              {opp.recommended_stack.map(s => <StackBadge key={s} name={s} />)}
            </div>
          </div>
        )}

        {opp.pricing_suggestion && (
          <div>
            <h3 className="text-[13px] font-semibold text-foreground mb-1">Pricing suggere</h3>
            <p className="text-sm text-muted-foreground">{opp.pricing_suggestion}</p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          {opp.acquisition_channels && opp.acquisition_channels.length > 0 && (
            <div>
              <h3 className="text-[13px] font-semibold text-foreground mb-2">Canaux d'acquisition</h3>
              <ul className="space-y-1">
                {opp.acquisition_channels.map((c, i) => (
                  <li key={i} className="flex items-center gap-1.5 text-[12px] text-muted-foreground">
                    <ChevronRight size={11} strokeWidth={1.5} /> {c}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {opp.niche_suggestions && opp.niche_suggestions.length > 0 && (
            <div>
              <h3 className="text-[13px] font-semibold text-foreground mb-2">Niches cibles</h3>
              <div className="flex flex-wrap gap-1.5">
                {opp.niche_suggestions.map((n, i) => (
                  <span key={i} className="text-[11px] px-2 py-1 rounded-lg bg-secondary border border-border text-muted-foreground">
                    {n}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Section 4 — Actions */}
      <div className="border border-border rounded-xl p-6 space-y-3">
        <h2 className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60 mb-3">Actions</h2>

        <button
          onClick={handleLaunch}
          className="cta-rainbow relative w-full bg-foreground text-background rounded-xl px-6 py-4 text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          Lancer ce projet dans Claude OS →
        </button>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => opp && (savedIds?.has(opp.id) ? onUnsave?.(opp.id) : onSave?.(opp.id))}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-border text-sm font-medium hover:bg-secondary transition-colors"
          >
            {opp && savedIds?.has(opp.id)
              ? <BookmarkCheck size={14} strokeWidth={1.5} className="text-foreground" />
              : <Bookmark size={14} strokeWidth={1.5} />
            }
            {opp && savedIds?.has(opp.id) ? 'Sauvegarde' : 'Sauvegarder'}
          </button>
          <button
            onClick={handleShare}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-border text-sm font-medium hover:bg-secondary transition-colors"
          >
            <Share2 size={14} strokeWidth={1.5} />
            Partager
          </button>
        </div>
      </div>

    </div>
  )
}
```

- [ ] **Verifier le build**
```bash
cd "###BLUEPRINT BUILDRS/blueprint-app" && npx vite build 2>&1 | tail -20
```

- [ ] **Commit**
```bash
git add blueprint-app/src/components/dashboard/OpportunityDetailPage.tsx
git commit -m "feat(ui): OpportunityDetailPage avec 4 sections et CTA Claude OS"
```

---

### Task 11: Integration DashboardSection + Sidebar

**Files:**
- Modify: `blueprint-app/src/components/dashboard/DashboardSection.tsx`
- Modify: `blueprint-app/src/components/dashboard/Sidebar.tsx`

- [ ] **Modifier DashboardSection.tsx**

Trouver les lignes (~277-279) avec `MarketplaceIdeasPage` et `IdeaDetailPage` et remplacer :

```typescript
// Avant (lignes ~277-279 dans DashboardSection.tsx) :
if (route.type === 'marketplace') return (<W><DashboardLayout {...layoutProps}><MarketplaceIdeasPage userId={user.id} navigate={navigate} /></DashboardLayout></W>)
if (route.type === 'idea-detail' && route.moduleId) return (<W><DashboardLayout {...layoutProps}><IdeaDetailPage slug={route.moduleId} userId={user.id} navigate={navigate} /></DashboardLayout></W>)

// Apres :
if (route.type === 'marketplace') return (
  <W><DashboardLayout {...layoutProps}>
    <MarketplacePage
      userId={user.id}
      navigate={navigate}
      isAdmin={user.user_metadata?.is_admin === true}
    />
  </DashboardLayout></W>
)
if (route.type === 'idea-detail' && route.moduleId) return (
  <W><DashboardLayout {...layoutProps}>
    <OpportunityDetailPage
      slug={route.moduleId}
      userId={user.id}
      navigate={navigate}
      savedIds={savedOpportunityIds}
      onSave={saveOpportunity}
      onUnsave={unsaveOpportunity}
    />
  </DashboardLayout></W>
)
// Note: savedOpportunityIds, saveOpportunity, unsaveOpportunity viennent d'un hook
// useOpportunities instancie dans DashboardSection pour partager l'etat de save
// entre MarketplacePage et OpportunityDetailPage sans double fetch.
// Ajouter en haut de DashboardSection, apres les hooks existants :
//   const { savedIds: savedOpportunityIds, saveOpportunity, unsaveOpportunity } = useOpportunitySaves(user?.id)
```

Mettre a jour les imports en haut du fichier :
```typescript
// Remplacer :
const MarketplaceIdeasPage = lazy(() => import('./MarketplaceIdeasPage').then(m => ({ default: m.MarketplaceIdeasPage })))
const IdeaDetailPage = lazy(() => import('./IdeaDetailPage').then(m => ({ default: m.IdeaDetailPage })))

// Par :
const MarketplacePage = lazy(() => import('./MarketplacePage').then(m => ({ default: m.MarketplacePage })))
const OpportunityDetailPage = lazy(() => import('./OpportunityDetailPage').then(m => ({ default: m.OpportunityDetailPage })))
```

Mettre a jour les labels dans la map de titres (~ligne 298) :
```typescript
// Avant :
'marketplace': 'Idees SaaS',
'idea-detail': 'Idee SaaS',

// Apres :
'marketplace': 'Marketplace',
'idea-detail': 'Opportunite SaaS',
```

- [ ] **Modifier Sidebar.tsx — debloquer l'item Marketplace**

Dans la section Outils du Sidebar, trouver l'item "Idees SaaS" (v3Item ou navItem) et :
1. Remplacer `v3Item('Idees SaaS', ...)` par un `navItem` normal
2. Mettre a jour le label en "Marketplace"
3. Lien : `#/dashboard/marketplace`
4. Icone : `ShoppingBag` ou `Store` (Lucide)

```typescript
// Chercher dans Sidebar.tsx le bloc Outils et remplacer l'item Ideas:
// Avant : v3Item('Idees SaaS', IdeaIcon) ou navItem equivalent
// Apres :
{navItem('#/dashboard/marketplace', 'Marketplace', ShoppingBag)}
```

- [ ] **Verifier que ShoppingBag est deja importe dans Sidebar.tsx**

```bash
grep "ShoppingBag" "blueprint-app/src/components/dashboard/Sidebar.tsx"
```
Si absent, ajouter au bloc import Lucide existant. Si present, ne rien changer (evite le TypeScript duplicate identifier).

- [ ] **Verifier le build**
```bash
cd "###BLUEPRINT BUILDRS/blueprint-app" && npx vite build 2>&1 | tail -20
```

- [ ] **Commit**
```bash
git add blueprint-app/src/components/dashboard/DashboardSection.tsx blueprint-app/src/components/dashboard/Sidebar.tsx
git commit -m "feat(routing): wire MarketplacePage + OpportunityDetailPage, unlock sidebar item"
```

---

### Task 12: Cleanup + test end-to-end

**Files:**
- Delete: `blueprint-app/src/components/dashboard/MarketplaceIdeasPage.tsx`
- Delete: `blueprint-app/src/components/dashboard/IdeaDetailPage.tsx`
- Delete: `blueprint-app/src/hooks/useMarketplaceIdeas.ts`

- [ ] **Verifier qu'aucun import des anciens fichiers ne subsiste**

```bash
grep -r "MarketplaceIdeasPage\|IdeaDetailPage\|useMarketplaceIdeas" \
  "###BLUEPRINT BUILDRS/blueprint-app/src/" --include="*.ts" --include="*.tsx"
```
Resultat attendu : aucune ligne.

- [ ] **Supprimer les anciens fichiers**
```bash
rm "###BLUEPRINT BUILDRS/blueprint-app/src/components/dashboard/MarketplaceIdeasPage.tsx"
rm "###BLUEPRINT BUILDRS/blueprint-app/src/components/dashboard/IdeaDetailPage.tsx"
rm "###BLUEPRINT BUILDRS/blueprint-app/src/hooks/useMarketplaceIdeas.ts"
```

- [ ] **Build final**
```bash
cd "###BLUEPRINT BUILDRS/blueprint-app" && npx vite build 2>&1 | tail -20
```
Resultat attendu : build SUCCESS, 0 erreur TypeScript.

- [ ] **Serve et test manuel**
```bash
pkill -f "serve dist" 2>/dev/null
npx serve dist --listen 4000 &
open http://localhost:4000
```

Test checklist :
- [ ] Naviguer vers `#/dashboard/marketplace` → catalogue s'affiche avec les donnees migrees de saas_ideas
- [ ] Filtres : search, categorie, score min fonctionnent
- [ ] Cliquer une card → fiche detail s'ouvre
- [ ] Fiche detail : 4 sections visibles (Header, Analyse, Blueprint, Actions)
- [ ] Bouton "Lancer ce projet" → sessionStorage rempli + redirect vers claude-os/generer
- [ ] Bouton Sauvegarder → toggling fonctionnel
- [ ] Bouton Partager → lien copie dans clipboard
- [ ] Sidebar : item "Marketplace" dans section Outils, cliquable

- [ ] **Commit final**
```bash
git add -u
git commit -m "feat(marketplace): v2 complete — Scanner schema + edge functions + marketplace UI"
```

---

## n8n Workflow (configuration manuelle post-implementation)

JSON du workflow a importer dans n8n :

```json
{
  "name": "Buildrs Scanner Quotidien",
  "nodes": [
    {
      "name": "Cron 6h UTC",
      "type": "n8n-nodes-base.cron",
      "parameters": { "cronExpression": "0 6 * * *" }
    },
    {
      "name": "Collect Product Hunt",
      "type": "n8n-nodes-base.httpRequest",
      "parameters": {
        "method": "POST",
        "url": "={{$env.SUPABASE_URL}}/functions/v1/scanner-collect?source=product_hunt",
        "headers": { "x-scanner-token": "={{$env.SCANNER_AUTH_TOKEN}}" }
      }
    },
    {
      "name": "Collect Reddit",
      "type": "n8n-nodes-base.httpRequest",
      "parameters": {
        "method": "POST",
        "url": "={{$env.SUPABASE_URL}}/functions/v1/scanner-collect?source=reddit",
        "headers": { "x-scanner-token": "={{$env.SCANNER_AUTH_TOKEN}}" }
      }
    },
    {
      "name": "Launch Acquire Apify",
      "type": "n8n-nodes-base.httpRequest",
      "parameters": {
        "method": "POST",
        "url": "={{$env.SUPABASE_URL}}/functions/v1/scanner-collect?source=acquire",
        "headers": { "x-scanner-token": "={{$env.SCANNER_AUTH_TOKEN}}" }
      }
    },
    {
      "name": "Wait 60s",
      "type": "n8n-nodes-base.wait",
      "parameters": { "amount": 60, "unit": "seconds" }
    },
    {
      "name": "Fetch Acquire Results",
      "type": "n8n-nodes-base.httpRequest",
      "parameters": {
        "method": "POST",
        "url": "={{$env.SUPABASE_URL}}/functions/v1/scanner-collect?source=acquire&fetch_results=true&run_id={{$node['Launch Acquire Apify'].json.run_id}}",
        "headers": { "x-scanner-token": "={{$env.SCANNER_AUTH_TOKEN}}" }
      }
    },
    {
      "name": "Score Items",
      "type": "n8n-nodes-base.httpRequest",
      "parameters": {
        "method": "POST",
        "url": "={{$env.SUPABASE_URL}}/functions/v1/scanner-score",
        "headers": { "x-scanner-token": "={{$env.SCANNER_AUTH_TOKEN}}" }
      }
    }
  ]
}
```

Variables n8n necessaires : `SUPABASE_URL`, `SCANNER_AUTH_TOKEN`.

---

## Criteres de succes

- [ ] Schema Supabase : 4 nouvelles tables avec RLS correct
- [ ] Donnees saas_ideas migrees vers saas_opportunities avec build_score calcule
- [ ] scanner-collect fonctionne pour PH, Reddit, Acquire
- [ ] scanner-score genere des scores pertinents (CRUD simple = cloneability > 80)
- [ ] Marketplace UI affiche les opportunites avec Build Score, filtres, pagination
- [ ] Fiche detail : 4 sections + CTA Lancer ce projet
- [ ] sessionStorage context correctement lu par Claude OS Generator
- [ ] Panel admin : bouton Refresh Scanner fonctionnel
- [ ] Build TypeScript sans erreur
- [ ] Anciens fichiers supprimes, aucun import mort
