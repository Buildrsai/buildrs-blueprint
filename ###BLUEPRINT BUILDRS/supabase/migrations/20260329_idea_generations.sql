CREATE TABLE IF NOT EXISTS public.idea_generations (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  inputs      JSONB       NOT NULL DEFAULT '{}',
  ideas       JSONB       NOT NULL DEFAULT '[]',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.idea_generations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "idea_generations_select" ON public.idea_generations;
DROP POLICY IF EXISTS "idea_generations_insert" ON public.idea_generations;

CREATE POLICY "idea_generations_select" ON public.idea_generations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "idea_generations_insert" ON public.idea_generations
  FOR INSERT WITH CHECK (auth.uid() = user_id);
