// pixel.ts — Meta Pixel dual-send (browser + serveur)
// - Browser : fbq() standard (bloqué par ~35% des users avec ad blocker)
// - Serveur  : Facebook Conversions API via Supabase Edge Function (passe toujours)
// Usage : trackEvent('Purchase', { value: 27, currency: 'EUR' })

const SUPABASE_FUNCTIONS_URL = 'https://ihgbbgwhgmosfjaknvlf.supabase.co/functions/v1'

declare function fbq(event: string, name: string, params?: Record<string, unknown>): void

/** Lit un cookie par son nom */
function getCookie(name: string): string | undefined {
  return document.cookie
    .split('; ')
    .find(r => r.startsWith(name + '='))
    ?.split('=')[1]
}

export interface PixelEventParams {
  value?: number
  currency?: string
  content_name?: string
  num_items?: number
  [key: string]: unknown
}

/**
 * Envoie un event Meta Pixel :
 *   1) Browser-side via fbq() (classique, peut être bloqué)
 *   2) Server-side via Conversions API (toujours envoyé, bypass ad blockers)
 */
export function trackEvent(eventName: string, params?: PixelEventParams): void {
  // Ne pas envoyer d'events depuis localhost (dev)
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') return

  // ── 1. Browser-side ──────────────────────────────────────────────────────
  try {
    if (typeof fbq !== 'undefined') {
      fbq('track', eventName, params)
    }
  } catch {
    // Silently ignore if fbq not loaded
  }

  // ── 2. Server-side via Conversions API ───────────────────────────────────
  // Fire-and-forget — ne bloque pas l'UI
  const fbc = getCookie('_fbc')
  const fbp = getCookie('_fbp')

  fetch(`${SUPABASE_FUNCTIONS_URL}/meta-pixel`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      event_name: eventName,
      event_source_url: window.location.href,
      value: params?.value,
      currency: params?.currency ?? 'EUR',
      fbc: fbc ?? null,
      fbp: fbp ?? null,
    }),
  }).catch(() => {
    // Silently ignore network errors
  })
}
