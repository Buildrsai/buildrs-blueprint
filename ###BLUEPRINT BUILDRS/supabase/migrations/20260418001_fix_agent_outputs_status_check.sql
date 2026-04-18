-- align agent_outputs status CHECK with code (pending/completed/error only)
-- 'running' and 'done' were never used in production code
ALTER TABLE agent_outputs DROP CONSTRAINT agent_outputs_status_check;
ALTER TABLE agent_outputs ADD CONSTRAINT agent_outputs_status_check
  CHECK (status = ANY (ARRAY['pending'::text, 'completed'::text, 'error'::text]));
