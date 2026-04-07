-- supabase/migrations/20260407_003_scanner_runs_and_saves.sql

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
