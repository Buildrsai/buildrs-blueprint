-- supabase/migrations/20260407_002_saas_opportunities.sql

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
