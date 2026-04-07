-- supabase/migrations/20260407_005_add_hacker_news_source.sql
-- Add hacker_news to allowed sources in saas_raw_discoveries

ALTER TABLE saas_raw_discoveries
  DROP CONSTRAINT IF EXISTS saas_raw_discoveries_source_check;

ALTER TABLE saas_raw_discoveries
  ADD CONSTRAINT saas_raw_discoveries_source_check
  CHECK (source IN ('product_hunt','reddit','acquire','indie_hackers','g2_capterra','generator_live','hacker_news'));
