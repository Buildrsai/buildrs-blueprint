-- ============================================================
-- Projects table (one row per user)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.projects (
  user_id        UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name           TEXT        NOT NULL DEFAULT '',
  problem        TEXT        NOT NULL DEFAULT '',
  target         TEXT        NOT NULL DEFAULT '',
  price          TEXT        NOT NULL DEFAULT '',
  feature        TEXT        NOT NULL DEFAULT '',
  status         TEXT        NOT NULL DEFAULT 'idea'
                             CHECK (status IN ('idea', 'building', 'live')),
  logo_url       TEXT        NOT NULL DEFAULT '',
  brand_color_1  TEXT        NOT NULL DEFAULT '#4d96ff',
  brand_color_2  TEXT        NOT NULL DEFAULT '#cc5de8',
  brand_color_3  TEXT        NOT NULL DEFAULT '#22c55e',
  brand_color_4  TEXT        NOT NULL DEFAULT '#ff6b6b',
  brand_phrase   TEXT        NOT NULL DEFAULT '',
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "projects_select" ON public.projects;
DROP POLICY IF EXISTS "projects_insert" ON public.projects;
DROP POLICY IF EXISTS "projects_update" ON public.projects;

CREATE POLICY "projects_select" ON public.projects
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "projects_insert" ON public.projects
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "projects_update" ON public.projects
  FOR UPDATE USING (auth.uid() = user_id);

-- ============================================================
-- Storage buckets
-- ============================================================

-- avatars bucket (profile photos)
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "avatars_select" ON storage.objects;
DROP POLICY IF EXISTS "avatars_insert" ON storage.objects;
DROP POLICY IF EXISTS "avatars_update" ON storage.objects;

CREATE POLICY "avatars_select" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "avatars_insert" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "avatars_update" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- project-assets bucket (logos)
INSERT INTO storage.buckets (id, name, public)
VALUES ('project-assets', 'project-assets', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "project_assets_select" ON storage.objects;
DROP POLICY IF EXISTS "project_assets_insert" ON storage.objects;
DROP POLICY IF EXISTS "project_assets_update" ON storage.objects;

CREATE POLICY "project_assets_select" ON storage.objects
  FOR SELECT USING (bucket_id = 'project-assets');

CREATE POLICY "project_assets_insert" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'project-assets' AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "project_assets_update" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'project-assets' AND auth.uid()::text = (storage.foldername(name))[1]
  );
