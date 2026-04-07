-- validator_sessions : stocke chaque validation d'idée soumise par un user
CREATE TABLE IF NOT EXISTS validator_sessions (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  idea_description    text NOT NULL,
  category            text,
  target_audience     text,
  pricing_model       text,
  demand_score        integer,
  competition_level   text CHECK (competition_level IN ('low', 'medium', 'high')),
  feasibility_score   integer,
  revenue_score       integer,
  verdict             text CHECK (verdict IN ('go', 'caution', 'stop')),
  competitors_found   jsonb DEFAULT '[]',
  insights            jsonb DEFAULT '{}',
  created_at          timestamptz DEFAULT now()
);

CREATE INDEX idx_vs_user ON validator_sessions(user_id);
CREATE INDEX idx_vs_verdict ON validator_sessions(verdict);

ALTER TABLE validator_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own validator sessions"
  ON validator_sessions FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
