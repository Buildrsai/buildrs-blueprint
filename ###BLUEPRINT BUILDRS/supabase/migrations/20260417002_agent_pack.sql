-- 20260417002_agent_pack.sql
-- Pack Agents V1 — Phase 1 : tables agent_projects + agent_outputs
--
-- Note : on utilise agent_projects (et non user_projects) car cette table
-- existe déjà et est liée à buildrs_opportunities (système distinct).

-- ─── agent_projects ──────────────────────────────────────────────────────────
-- Un projet représente le contexte du SaaS que l'utilisateur construit.
-- Les 7 agents s'y réfèrent pour produire des outputs cohérents entre eux.

CREATE TABLE IF NOT EXISTS public.agent_projects (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name             text NOT NULL,
  idea_description text,
  target_audience  text,
  preferred_stack  text,
  mrr_goal         text,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);

-- Trigger pour updated_at automatique
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER agent_projects_updated_at
  BEFORE UPDATE ON public.agent_projects
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- Index pour les queries par user
CREATE INDEX IF NOT EXISTS agent_projects_user_id_idx
  ON public.agent_projects (user_id);

-- RLS
ALTER TABLE public.agent_projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "agent_projects: user owns their projects"
  ON public.agent_projects
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);


-- ─── agent_outputs ────────────────────────────────────────────────────────────
-- Historique des outputs produits par chaque agent pour un projet donné.
-- input_tokens + output_tokens sont nullable (remplis par l'Edge Function).

CREATE TABLE IF NOT EXISTS public.agent_outputs (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id    uuid NOT NULL REFERENCES public.agent_projects(id) ON DELETE CASCADE,
  user_id       uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  agent_slug    text NOT NULL CHECK (
    agent_slug IN (
      'jarvis',
      'planner',
      'designer',
      'db-architect',
      'builder',
      'connector',
      'launcher'
    )
  ),
  input_data    jsonb NOT NULL DEFAULT '{}',
  output_content text,
  output_format text NOT NULL DEFAULT 'markdown',
  status        text NOT NULL DEFAULT 'pending' CHECK (
    status IN ('pending', 'running', 'done', 'error')
  ),
  input_tokens  integer,
  output_tokens integer,
  created_at    timestamptz NOT NULL DEFAULT now()
);

-- Index pour les queries fréquentes
CREATE INDEX IF NOT EXISTS agent_outputs_project_id_idx
  ON public.agent_outputs (project_id);

CREATE INDEX IF NOT EXISTS agent_outputs_user_agent_idx
  ON public.agent_outputs (user_id, agent_slug);

-- RLS
ALTER TABLE public.agent_outputs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "agent_outputs: user owns their outputs"
  ON public.agent_outputs
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
