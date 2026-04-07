-- supabase/migrations/20260407_001_saas_raw_discoveries.sql

CREATE TABLE IF NOT EXISTS saas_raw_discoveries (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source          text NOT NULL CHECK (source IN ('product_hunt','reddit','acquire','indie_hackers','g2_capterra','generator_live')),
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
