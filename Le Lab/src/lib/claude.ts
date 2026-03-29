// Client Claude — appels via les Edge Functions Supabase UNIQUEMENT
// Jamais d'appels directs à l'API Anthropic depuis le client !

import { supabase } from './supabase'

export interface ClaudeStreamOptions {
  prompt: string
  systemPrompt: string
  onChunk: (text: string) => void
  onComplete: (fullText: string) => void
  onError: (error: Error) => void
}

/**
 * Appel à Claude via une Edge Function Supabase (streaming)
 * La clé API Anthropic est uniquement côté serveur
 */
export async function callClaudeStream(
  functionName: string,
  payload: Record<string, unknown>,
  options: Pick<ClaudeStreamOptions, 'onChunk' | 'onComplete' | 'onError'>
): Promise<void> {
  try {
    const response = await supabase.functions.invoke(functionName, {
      body: payload,
    })

    if (response.error) {
      throw new Error(response.error.message)
    }

    options.onComplete(response.data as string)
  } catch (err) {
    options.onError(err instanceof Error ? err : new Error('Erreur inconnue'))
  }
}

/**
 * Appel à Claude via une Edge Function Supabase (non-streaming)
 */
export async function callClaude<T>(
  functionName: string,
  payload: Record<string, unknown>
): Promise<T> {
  const { data, error } = await supabase.functions.invoke<T>(functionName, {
    body: payload,
  })

  if (error) throw new Error(error.message)
  if (!data) throw new Error('Réponse vide du serveur')

  return data
}
