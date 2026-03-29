-- Add columns needed for multi-project support in ProjectPage (ideas table)
ALTER TABLE public.ideas ADD COLUMN IF NOT EXISTS problem text NOT NULL DEFAULT '';
ALTER TABLE public.ideas ADD COLUMN IF NOT EXISTS target  text NOT NULL DEFAULT '';
ALTER TABLE public.ideas ADD COLUMN IF NOT EXISTS price   text NOT NULL DEFAULT '';
ALTER TABLE public.ideas ADD COLUMN IF NOT EXISTS feature text NOT NULL DEFAULT '';

ALTER TABLE public.ideas ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'idea'
  CHECK (status IN ('idea', 'building', 'live'));

ALTER TABLE public.ideas ADD COLUMN IF NOT EXISTS note int NOT NULL DEFAULT 0;

-- Add delete policy so users can remove their own ideas/projects
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'ideas' AND policyname = 'ideas_delete'
  ) THEN
    EXECUTE 'CREATE POLICY "ideas_delete" ON public.ideas FOR DELETE USING (auth.uid() = user_id)';
  END IF;
END $$;
