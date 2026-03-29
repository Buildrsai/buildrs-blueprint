// Client Resend — envoi via les Edge Functions Supabase uniquement
// Les emails transactionnels sont envoyés côté serveur

/**
 * Déclenche l'envoi d'un email via une Edge Function
 */
export type EmailTemplate =
  | 'welcome'
  | 'finder-results'
  | 'phase-complete'
  | 'payment-confirmation'
  | 'password-reset'

export interface SendEmailPayload {
  template: EmailTemplate
  to: string
  data?: Record<string, unknown>
}
