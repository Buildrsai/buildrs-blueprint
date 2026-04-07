-- supabase/migrations/20260407_004_migrate_saas_ideas.sql
-- Migre les donnees de saas_ideas vers saas_opportunities
-- avec des valeurs de build_score par defaut (source = manual_curated)

INSERT INTO saas_opportunities (
  name,
  slug,
  tagline,
  problem_solved,
  source,
  category,
  mrr_estimated,
  mrr_confidence,
  traction_score,
  cloneability_score,
  monetization_score,
  build_score,
  recommended_stack,
  status,
  created_at
)
SELECT
  title                                               AS name,
  slug,
  COALESCE(target_audience, title)                    AS tagline,
  COALESCE(problem_md, '')                            AS problem_solved,
  'manual_curated'                                    AS source,
  CASE
    WHEN 'crm' = ANY(tags)        THEN 'crm'
    WHEN 'invoicing' = ANY(tags)  THEN 'invoicing'
    WHEN 'analytics' = ANY(tags)  THEN 'analytics'
    WHEN 'scheduling' = ANY(tags) THEN 'scheduling'
    WHEN 'marketing' = ANY(tags)  THEN 'marketing'
    ELSE 'other'
  END                                                 AS category,
  mrr_max                                             AS mrr_estimated,
  7                                                   AS mrr_confidence,
  -- Convertit difficulty (1-5) en traction_score : plus facile = moins de traction marche
  LEAST(100, (6 - difficulty) * 15 + 20)              AS traction_score,
  -- Cloneability : inverse de la difficulte
  CASE difficulty
    WHEN 1 THEN 90
    WHEN 2 THEN 80
    WHEN 3 THEN 65
    WHEN 4 THEN 45
    WHEN 5 THEN 25
    ELSE 65
  END                                                 AS cloneability_score,
  -- Monetization : base sur le MRR max
  CASE
    WHEN mrr_max >= 10000 THEN 85
    WHEN mrr_max >= 5000  THEN 75
    WHEN mrr_max >= 2000  THEN 65
    WHEN mrr_max >= 1000  THEN 55
    ELSE 45
  END                                                 AS monetization_score,
  -- Build Score composite = traction*0.30 + cloneability*0.40 + monetization*0.30
  ROUND(
    (LEAST(100, (6 - difficulty) * 15 + 20) * 0.30) +
    (CASE difficulty WHEN 1 THEN 90 WHEN 2 THEN 80 WHEN 3 THEN 65 WHEN 4 THEN 45 ELSE 25 END * 0.40) +
    (CASE WHEN mrr_max >= 10000 THEN 85 WHEN mrr_max >= 5000 THEN 75 WHEN mrr_max >= 2000 THEN 65 WHEN mrr_max >= 1000 THEN 55 ELSE 45 END * 0.30)
  )                                                   AS build_score,
  -- stack est un text[] dans saas_ideas, on le convertit en jsonb
  to_jsonb(stack)                                     AS recommended_stack,
  'active'                                            AS status,
  created_at
FROM saas_ideas
ON CONFLICT (slug) DO NOTHING;

-- Migrer les saves existants depuis user_saved_ideas
-- Note: user_saved_ideas utilise created_at (pas saved_at)
INSERT INTO user_saved_opportunities (user_id, opportunity_id, saved_at)
SELECT
  usi.user_id,
  so.id,
  usi.created_at
FROM user_saved_ideas usi
JOIN saas_ideas si ON si.id = usi.idea_id
JOIN saas_opportunities so ON so.slug = si.slug
ON CONFLICT (user_id, opportunity_id) DO NOTHING;
