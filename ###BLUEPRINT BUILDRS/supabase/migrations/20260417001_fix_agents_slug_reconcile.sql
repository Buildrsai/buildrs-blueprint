-- 20260417001_fix_agents_slug_reconcile.sql
-- Corrige le slug 'agents_pack' → 'agents-ia' dans la fonction de réconciliation
-- appelée automatiquement au signup via trigger reconcile_purchases_on_signup.
--
-- Avant ce fix, la fonction copiait le slug brut de purchases.product vers
-- user_purchases.product_slug, ce qui écrivait 'agents_pack' (underscore) alors
-- que useAccess.ts vérifie 'agents-ia' (tiret) → hasPack toujours false.
--
-- Pas de migration de données nécessaire : zéro row 'agents_pack' confirmée
-- dans user_purchases au moment de l'application (2026-04-17).

CREATE OR REPLACE FUNCTION public.reconcile_pending_purchases(
  p_user_id uuid,
  p_email   text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN
    SELECT id, product, stripe_session_id
    FROM purchases
    WHERE lower(email) = lower(p_email)
      AND applied = false
  LOOP
    INSERT INTO user_purchases (user_id, product_slug, stripe_payment_id, amount_paid_cents)
    VALUES (
      p_user_id,
      CASE r.product
        WHEN 'agents_pack' THEN 'agents-ia'
        ELSE r.product
      END,
      r.stripe_session_id,
      null
    )
    ON CONFLICT (user_id, product_slug) DO NOTHING;

    UPDATE purchases SET applied = true WHERE id = r.id;
  END LOOP;
END;
$$;
