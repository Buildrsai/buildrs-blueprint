# Claude OS Generators — Full Refonte Design
**Date:** 2026-04-12  
**Status:** Approved  
**Author:** Claude Code

## Problem

5 of 6 generators in Claude OS are static form→template tools with no AI. The only AI-powered generator uses `claude-haiku-4-5-20251001` with a comment claiming Sonnet. Prompts don't follow Anthropic's recommended structure.

## Architecture Decision

**Pattern:** Unified edge function `claude-generators` with typed internal handlers.  
**Why:** Single deployment, shared auth middleware, shared logging. Handlers are pure functions — independently testable.  
**Separate:** `generator-recommend` stays isolated (existing prod, avoid regression).

## Anthropic Best Practices Applied

- System prompt + user message separation (not single user message)
- `claude-sonnet-4-6` for complex generation, `claude-haiku-4-5-20251001` for fast lookup tasks
- Temperature 0 for deterministic structured output
- XML tags (`<context>`, `<instructions>`, `<output_format>`) in system prompts
- Tool use / constrained JSON via explicit schema in prompt
- `max_tokens` calibrated per task (not one-size 8000)
- No emoji in generated prompts/outputs

## Edge Function: `claude-generators`

### Routing
```
POST /functions/v1/claude-generators
Body: { type: 'prompt' | 'claude-md' | 'skills' | 'mcp' | 'team-agents', payload: {...} }
```

### Model allocation
| Generator | Model | max_tokens | temp |
|---|---|---|---|
| prompt | claude-sonnet-4-6 | 2000 | 0 |
| claude-md | claude-sonnet-4-6 | 4000 | 0 |
| skills | claude-sonnet-4-6 | 2000 | 0 |
| mcp | claude-haiku-4-5-20251001 | 1500 | 0 |
| team-agents | claude-sonnet-4-6 | 3000 | 0 |

### Handler structure
Each handler exports:
- `buildSystem_X(): string` — system prompt (cacheable)
- `buildUser_X(payload): string` — user message with data
- `schema_X` — expected output shape for validation

## Bug Fixes
1. `generator-recommend`: `claude-haiku-4-5-20251001` → `claude-sonnet-4-6`
2. `TeamAgentsGeneratorPage`: remove `⚠️` emoji from generated output
3. `ClaudeMdGeneratorPage` + `TeamAgentsGeneratorPage`: Next.js → user-specified stack (default React+Vite)
4. All generators: Anthropic-compliant prompt structure

## Prompt Framework (Anthropic-recommended)
```xml
<context>Role + project background</context>
<instructions>Step-by-step, imperative mood</instructions>
<examples>2-3 few-shot examples where applicable</examples>
<output_format>Exact schema, constraints, no extra text</output_format>
```

## Component Changes
Each generator component gets:
- `isGenerating` state (loading skeleton)
- `callGenerator(type, payload)` helper (shared fetch to edge function)
- Result displayed in existing UI (no visual refonte)
- Error state with retry button

## Deployment
1. `supabase functions deploy claude-generators`
2. `vercel --prod --yes` (frontend)
