-- supabase/migrations/20260408_002_buildrs_opportunities.sql
-- Table buildrs_opportunities : analyse IA de clonabilite liee a un saas_source

CREATE TABLE IF NOT EXISTS buildrs_opportunities (
  id                       uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id                uuid NOT NULL REFERENCES saas_sources(id) ON DELETE CASCADE,
  slug                     text UNIQUE NOT NULL,
  opportunity_title        text NOT NULL,
  problem_solved           text,
  target_niche             text,
  traction_score           integer NOT NULL CHECK (traction_score BETWEEN 0 AND 100),
  cloneability_score       integer NOT NULL CHECK (cloneability_score BETWEEN 0 AND 100),
  monetization_score       integer NOT NULL CHECK (monetization_score BETWEEN 0 AND 100),
  build_score              integer NOT NULL CHECK (build_score BETWEEN 0 AND 100),
  traction_explanation     text,
  cloneability_explanation text,
  monetization_explanation text,
  why_reproducible         text,
  differentiation_angle    text,
  recommended_stack        jsonb DEFAULT '[]',
  mvp_features             jsonb DEFAULT '[]',
  pricing_suggestion       text,
  acquisition_channels     jsonb DEFAULT '[]',
  niche_suggestions        jsonb DEFAULT '[]',
  estimated_build_time     text,
  status                   text DEFAULT 'active' CHECK (status IN ('active','archived','flagged')),
  scored_at                timestamptz,
  created_at               timestamptz DEFAULT now(),
  search_vector            tsvector GENERATED ALWAYS AS (
    to_tsvector('french', coalesce(opportunity_title,'') || ' ' || coalesce(problem_solved,'') || ' ' || coalesce(target_niche,''))
  ) STORED
);

CREATE INDEX idx_bo_build_score ON buildrs_opportunities(build_score DESC);
CREATE INDEX idx_bo_source ON buildrs_opportunities(source_id);
CREATE INDEX idx_bo_status ON buildrs_opportunities(status);
CREATE INDEX idx_bo_search ON buildrs_opportunities USING gin(search_vector);

ALTER TABLE buildrs_opportunities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated read active buildrs opportunities"
  ON buildrs_opportunities FOR SELECT TO authenticated
  USING (status = 'active');
