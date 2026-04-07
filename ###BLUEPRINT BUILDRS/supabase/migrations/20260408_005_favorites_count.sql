-- supabase/migrations/20260408_005_favorites_count.sql
-- RPC get_favorites_count : retourne le nb de favoris par source_id

CREATE OR REPLACE FUNCTION get_favorites_count(source_ids uuid[])
RETURNS TABLE(source_id uuid, count bigint) AS $$
  SELECT source_id, count(*)
  FROM user_favorites
  WHERE source_id = ANY(source_ids)
  GROUP BY source_id
$$ LANGUAGE SQL STABLE SECURITY DEFINER;
