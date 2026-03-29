-- ============================================================
-- Ideas table (up to 3 project ideas per user)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.ideas (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name        TEXT        NOT NULL DEFAULT '',
  problem     TEXT        NOT NULL DEFAULT '',
  target      TEXT        NOT NULL DEFAULT '',
  price       TEXT        NOT NULL DEFAULT '',
  feature     TEXT        NOT NULL DEFAULT '',
  status      TEXT        NOT NULL DEFAULT 'idea'
              CHECK (status IN ('idea', 'building', 'live')),
  note        INT         NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS
ALTER TABLE public.ideas ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "ideas_select" ON public.ideas;
DROP POLICY IF EXISTS "ideas_insert" ON public.ideas;
DROP POLICY IF EXISTS "ideas_update" ON public.ideas;
DROP POLICY IF EXISTS "ideas_delete" ON public.ideas;

CREATE POLICY "ideas_select" ON public.ideas
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "ideas_insert" ON public.ideas
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "ideas_update" ON public.ideas
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "ideas_delete" ON public.ideas
  FOR DELETE USING (auth.uid() = user_id);
