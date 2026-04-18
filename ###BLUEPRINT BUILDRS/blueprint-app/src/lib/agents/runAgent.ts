import { supabase } from '../supabase'
import type { AgentSlug } from './config'

export interface RunAgentInput {
  projectId: string
  agentSlug: AgentSlug
  inputData: Record<string, unknown>
}

export interface RunAgentResult {
  id: string
  content: string
  outputFormat: 'markdown' | 'sql'
  inputTokens: number | null
  outputTokens: number | null
}

export class AgentError extends Error {
  constructor(
    message: string,
    public readonly code: 'unauthorized' | 'no_entitlement' | 'rate_limit' | 'server_error'
  ) {
    super(message)
    this.name = 'AgentError'
  }
}

export async function runAgent(input: RunAgentInput): Promise<RunAgentResult> {
  const { data, error } = await supabase.functions.invoke('run-agent', {
    body: {
      project_id: input.projectId,
      agent_slug: input.agentSlug,
      input_data: input.inputData,
    },
  })

  if (error) {
    const status = (error as { context?: { status?: number } }).context?.status
    if (status === 401) {
      throw new AgentError('Tu dois être connecté pour utiliser les agents.', 'unauthorized')
    }
    if (status === 403) {
      throw new AgentError("Tu n'as pas accès au Pack Agents. Débloque-le pour continuer.", 'no_entitlement')
    }
    if (status === 429) {
      throw new AgentError('Tu as atteint la limite de 20 appels par heure. Réessaie dans 1h.', 'rate_limit')
    }
    throw new AgentError("Une erreur est survenue. Réessaie dans quelques secondes.", 'server_error')
  }

  if (data.error) {
    throw new AgentError(data.error, 'server_error')
  }

  return {
    id: data.id,
    content: data.content,
    outputFormat: data.output_format,
    inputTokens: data.input_tokens ?? null,
    outputTokens: data.output_tokens ?? null,
  }
}
