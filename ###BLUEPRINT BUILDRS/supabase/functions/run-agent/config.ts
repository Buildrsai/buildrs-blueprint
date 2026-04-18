// config.ts — Pack Agents V1 — Deno-compatible
// Source de vérité pour la validation et le context chaining.
// Full client-side config dans blueprint-app/src/data/agents-config.ts

export type AgentSlug =
  | 'jarvis'
  | 'planner'
  | 'designer'
  | 'db-architect'
  | 'builder'
  | 'connector'
  | 'launcher'

export const VALID_SLUGS: AgentSlug[] = [
  'jarvis',
  'planner',
  'designer',
  'db-architect',
  'builder',
  'connector',
  'launcher',
]

export interface AgentMeta {
  outputFormat: 'markdown' | 'sql'
  usesProjectContext: AgentSlug[]
}

export const AGENTS_META: Record<AgentSlug, AgentMeta> = {
  jarvis: {
    outputFormat:        'markdown',
    usesProjectContext:  [],
  },
  planner: {
    outputFormat:        'markdown',
    usesProjectContext:  ['jarvis'],
  },
  designer: {
    outputFormat:        'markdown',
    usesProjectContext:  ['jarvis', 'planner'],
  },
  'db-architect': {
    outputFormat:        'sql',
    usesProjectContext:  ['jarvis', 'planner'],
  },
  builder: {
    outputFormat:        'markdown',
    usesProjectContext:  ['jarvis', 'planner', 'designer', 'db-architect'],
  },
  connector: {
    outputFormat:        'markdown',
    usesProjectContext:  ['jarvis', 'planner', 'db-architect'],
  },
  launcher: {
    outputFormat:        'markdown',
    usesProjectContext:  ['jarvis', 'planner', 'designer'],
  },
}
