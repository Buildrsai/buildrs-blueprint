-- supabase/migrations/20260408_001_saas_sources.sql
-- Table saas_sources : vrais SaaS sources (logos Clearbit, revenus, metadata)

CREATE TABLE IF NOT EXISTS saas_sources (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name            text NOT NULL,
  slug            text UNIQUE NOT NULL,
  domain          text,
  tagline         text,
  description     text,
  logo_url        text,
  screenshot_url  text,
  category        text NOT NULL DEFAULT 'other',
  subcategory     text,
  mrr_reported    integer,
  arr_reported    integer,
  mrr_source      text,
  pricing_model   text CHECK (pricing_model IN ('freemium','subscription','one_time','usage')),
  pricing_url     text,
  founder_names   text,
  founded_year    integer,
  employee_count_range text,
  tech_stack      jsonb DEFAULT '[]',
  platforms       jsonb DEFAULT '["web"]',
  source_urls     jsonb DEFAULT '{}',
  is_verified     boolean DEFAULT false,
  is_featured     boolean DEFAULT false,
  search_vector   tsvector GENERATED ALWAYS AS (
    to_tsvector('french', coalesce(name,'') || ' ' || coalesce(tagline,'') || ' ' || coalesce(description,''))
  ) STORED,
  created_at      timestamptz DEFAULT now(),
  updated_at      timestamptz DEFAULT now()
);

CREATE INDEX idx_saas_sources_category ON saas_sources(category);
CREATE INDEX idx_saas_sources_featured ON saas_sources(is_featured) WHERE is_featured = true;
CREATE INDEX idx_saas_sources_search ON saas_sources USING gin(search_vector);

ALTER TABLE saas_sources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read sources"
  ON saas_sources FOR SELECT TO authenticated USING (true);
