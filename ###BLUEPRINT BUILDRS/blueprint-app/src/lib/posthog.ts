import posthog from 'posthog-js'

const KEY = import.meta.env.VITE_POSTHOG_KEY as string | undefined

export function initPostHog() {
  if (!KEY) return
  posthog.init(KEY, {
    api_host: 'https://eu.i.posthog.com',
    person_profiles: 'identified_only',
    capture_pageview: false, // On gère manuellement pour le hash routing
    capture_pageleave: true,
    autocapture: true,
  })
}

export function phIdentify(userId: string, props?: Record<string, unknown>) {
  if (!KEY) return
  posthog.identify(userId, props)
}

export function phReset() {
  if (!KEY) return
  posthog.reset()
}

export function phCapture(event: string, props?: Record<string, unknown>) {
  if (!KEY) return
  posthog.capture(event, props)
}

export function phPageview(path: string) {
  if (!KEY) return
  posthog.capture('$pageview', { $current_url: `https://buildrs.fr/#/${path}` })
}
