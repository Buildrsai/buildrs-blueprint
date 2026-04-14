// pixel.ts — Meta Pixel dual-send (browser + serveur)
// - Browser : fbq() standard (bloqué par ~35% des users avec ad blocker)
// - Serveur  : Facebook Conversions API via Supabase Edge Function (passe toujours)
// Usage : trackEvent('Purchase', { value: 27, currency: 'EUR' })

const SUPABASE_FUNCTIONS_URL = 'https://ihgbbgwhgmosfjaknvlf.supabase.co/functions/v1'
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string

declare function fbq(
  event: string,
  name: string,
  params?: Record<string, unknown>,
  options?: { eventID?: string },
): void

/** Lit un cookie par son nom */
function getCookie(name: string): string | undefined {
  return document.cookie
    .split('; ')
    .find(r => r.startsWith(name + '='))
    ?.split('=')[1]
}

/** Génère un UUID v4 pour la déduplication Meta */
function generateEventId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  // Fallback (navigateurs anciens)
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (crypto.getRandomValues(new Uint8Array(1))[0] & 15) >> (c === 'x' ? 0 : 3)
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16)
  })
}

// ── Capture fbclid + UTMs avant que le SPA ne les perde ──────────────────────
// S'exécute au chargement du module (avant le hash routing)
;(() => {
  if (typeof window === 'undefined') return
  const params = new URLSearchParams(window.location.search)
  const fbclid = params.get('fbclid')
  if (fbclid) {
    sessionStorage.setItem('fbclid', fbclid)
    // Créer le cookie _fbc manuellement si absent (format officiel Meta)
    if (!getCookie('_fbc')) {
      document.cookie = `_fbc=fb.1.${Date.now()}.${fbclid};path=/;max-age=7776000;SameSite=Lax`
    }
  }
  for (const key of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']) {
    const val = params.get(key)
    if (val) sessionStorage.setItem(key, val)
  }
})()

export interface PixelEventParams {
  value?: number
  currency?: string
  content_name?: string
  num_items?: number
  email?: string
  [key: string]: unknown
}

/**
 * Envoie un event Meta Pixel :
 *   1) Browser-side via fbq() avec eventID pour déduplication
 *   2) Server-side via Conversions API (toujours envoyé, bypass ad blockers)
 *
 * L'event_id est partagé entre browser et CAPI pour que Meta déduplication correctement.
 */
export function trackEvent(eventName: string, params?: PixelEventParams): void {
  // Ne pas envoyer d'events depuis localhost (dev)
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') return

  // ID partagé browser + CAPI — évite le double comptage
  const eventId = generateEventId()

  // ── 1. Browser-side ──────────────────────────────────────────────────────
  try {
    if (typeof fbq !== 'undefined') {
      fbq('track', eventName, params, { eventID: eventId })
    }
  } catch {
    // Silently ignore if fbq not loaded
  }

  // ── 2. Server-side via Conversions API (async interne) ───────────────────
  // _fbc : cookie officiel, avec fallback sessionStorage si bloqué
  const fbcCookie = getCookie('_fbc')
  const fbcFromSession = sessionStorage.getItem('fbclid')
    ? `fb.1.${Date.now()}.${sessionStorage.getItem('fbclid')}`
    : null
  const fbc = fbcCookie ?? fbcFromSession ?? null
  const fbp = getCookie('_fbp') ?? null

  ;(async () => {
    let emailHash: string | null = null
    if (params?.email) {
      const normalized = (params.email as string).trim().toLowerCase()
      const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(normalized))
      emailHash = [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('')
    }

    fetch(`${SUPABASE_FUNCTIONS_URL}/meta-pixel`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({
        event_name: eventName,
        event_id: eventId,
        event_source_url: window.location.href,
        value: params?.value,
        currency: params?.currency ?? 'EUR',
        fbc,
        fbp,
        email_hash: emailHash,
      }),
    }).catch(() => {
      // Silently ignore network errors
    })
  })()
}
