-- supabase/migrations/20260407_006_add_explanation_columns.sql
-- Ajoute les colonnes d'explication pour les 3 scores (generees par le nouveau prompt IA)

ALTER TABLE saas_opportunities
  ADD COLUMN IF NOT EXISTS traction_explanation text,
  ADD COLUMN IF NOT EXISTS cloneability_explanation text,
  ADD COLUMN IF NOT EXISTS monetization_explanation text;
