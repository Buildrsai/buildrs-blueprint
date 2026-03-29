-- Migration: table email_sequences pour la séquence drip post-achat Blueprint
-- 23 emails sur 30 jours, orchestrée par process-email-queue Edge Function

CREATE TABLE IF NOT EXISTS public.email_sequences (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email   TEXT        NOT NULL,
  product      TEXT        NOT NULL,                -- 'blueprint' | 'blueprint_bump'
  purchased_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  next_step    INT         NOT NULL DEFAULT 1,      -- 1 à 23 (23 = dernier email)
  completed    BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour le cron processor (ne scanne que les séquences actives)
CREATE INDEX IF NOT EXISTS idx_email_sequences_pending
  ON public.email_sequences (completed, next_step)
  WHERE completed = FALSE;

-- RLS activé — seul le service_role peut accéder (Edge Functions uniquement)
ALTER TABLE public.email_sequences ENABLE ROW LEVEL SECURITY;

-- Aucune policy anon/authenticated : le service_role bypasse le RLS
