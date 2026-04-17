# Archived Edge Functions

Functions archived during Phase 0 cleanup (2026-04-17) of the legacy 6-agents
system. The code is preserved here for reference; it is **not** deployed from
this path.

## Pending — production undeploy

The following functions may still be deployed on Supabase prod. They must be
undeployed **only after** the new Pack Agents V1 (`run-agent` Edge Function) is
validated in production and serving real traffic for at least 48 hours
(rollback safety).

- `agent-chat`  → used by the archived `AgentChatPage.tsx` (chat UI for the
  legacy 6 agents).

### Undeploy procedure (to run once V1 is green)

```bash
supabase functions delete agent-chat --project-ref <project-ref>
```

Confirm on the Supabase dashboard that the function is removed, then drop this
README entry.

## Imports to note

`agent-chat/index.ts` imports `../_shared/agent-prompts.ts`, which has moved to
`../_shared/_archived/agent-prompts.ts`. The archived code will not compile
from this location without fixing the import — intentional, since the code is
frozen reference material only.
