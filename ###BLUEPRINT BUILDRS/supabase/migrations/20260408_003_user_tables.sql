-- supabase/migrations/20260408_003_user_tables.sql
-- Tables utilisateur : favoris, projets, sessions generateur

-- user_favorites : bookmarks de sources par l'utilisateur
CREATE TABLE IF NOT EXISTS user_favorites (
  user_id    uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  source_id  uuid NOT NULL REFERENCES saas_sources(id) ON DELETE CASCADE,
  saved_at   timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, source_id)
);

ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage their own favorites"
  ON user_favorites FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- user_projects : projets crees depuis une opportunite Buildrs
CREATE TABLE IF NOT EXISTS user_projects (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  opportunity_id uuid NOT NULL REFERENCES buildrs_opportunities(id) ON DELETE CASCADE,
  status         text NOT NULL DEFAULT 'planning' CHECK (status IN ('planning','building','launched')),
  notes          jsonb DEFAULT '{}',
  created_at     timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE user_projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage their own projects"
  ON user_projects FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- generator_sessions : historique des sessions du generateur IA
CREATE TABLE IF NOT EXISTS generator_sessions (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mode                  text NOT NULL CHECK (mode IN ('find','validate','copy')),
  input_data            jsonb DEFAULT '{}',
  output_data           jsonb DEFAULT '{}',
  source_opportunity_id uuid REFERENCES buildrs_opportunities(id) ON DELETE SET NULL,
  created_at            timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE generator_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage their own generator sessions"
  ON generator_sessions FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
