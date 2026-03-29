// Utilitaires partagés

/**
 * Fusion conditionnelle de classes CSS (Tailwind-friendly)
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}

/**
 * Formate un score /100 avec couleur sémantique
 */
export function getScoreColor(score: number): 'success' | 'warning' | 'error' {
  if (score >= 70) return 'success'
  if (score >= 40) return 'warning'
  return 'error'
}

/**
 * Formate une date relative en français
 */
export function formatRelativeDate(date: string): string {
  const d = new Date(date)
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (days === 0) return "Aujourd'hui"
  if (days === 1) return 'Hier'
  if (days < 7) return `Il y a ${days} jours`
  if (days < 30) return `Il y a ${Math.floor(days / 7)} semaines`
  if (days < 365) return `Il y a ${Math.floor(days / 30)} mois`
  return `Il y a ${Math.floor(days / 365)} ans`
}

/**
 * Tronque un texte avec ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength - 3) + '...'
}

/**
 * Noms des phases du Lab
 */
export const PHASE_NAMES: Record<number, string> = {
  1: 'Idée & Validation',
  2: 'Structure Produit',
  3: 'Branding & Design',
  4: 'Kit Claude Code',
  5: 'Installation Guidée',
  6: 'Build Guidé',
  7: 'Déploiement',
  8: 'Lancement',
}

/**
 * Délai (promesse)
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}
