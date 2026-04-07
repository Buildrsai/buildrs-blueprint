ALTER TABLE validator_sessions
  ADD COLUMN IF NOT EXISTS product_type text,
  ADD COLUMN IF NOT EXISTS market_type  text;

ALTER TABLE buildrs_opportunities
  ADD COLUMN IF NOT EXISTS product_type text,
  ADD COLUMN IF NOT EXISTS market_type  text;
