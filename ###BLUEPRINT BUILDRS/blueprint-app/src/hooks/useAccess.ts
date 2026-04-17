import type { User } from '@supabase/supabase-js'
import type { PurchaseRow } from './usePurchases'

// TODO (post Fix A validation) : supprimer le fallback meta.has_agents_pack.
// Une fois Fix A validé en prod avec au moins 1 vente réelle post-déploiement
// qui crée bien la row user_purchases directement via le webhook, la chaîne
// de réconciliation meta → user_purchases (DashboardSection.tsx lignes 95-111)
// devient obsolète. Refactor à faire :
//  1) Simplifier DashboardSection pour qu'elle n'écrive plus dans user_meta
//     mais directement dans user_purchases avec le slug 'agents-ia'
//  2) Supprimer la ligne fallback `if (slug === 'agents-ia') return meta.has_agents_pack`
// Ne pas faire avant d'avoir une preuve de Fix A fonctionnel sur vraie vente.

/**
 * Combine user_purchases (nouvelle table) + legacy user_metadata flags.
 * Backward compat : hasPack, hasClaudeCodeOb, hasClaudeCoworkOb toujours disponibles.
 *
 * Claude OS grandfathering : tous les users créés avant le 2026-04-07 ont accès
 * à Claude OS sans avoir acheté l'OB. Les nouveaux users doivent l'acheter.
 */
const CLAUDE_OS_CUTOFF = new Date('2026-04-07T00:00:00Z')

export function useAccess(user: User | null, purchases: PurchaseRow[]) {
  const slugs = new Set(purchases.map(p => p.product_slug))
  const meta  = user?.user_metadata ?? {}

  // User existant avant la date de coupure → Claude OS offert
  const isLegacyUser = user?.created_at
    ? new Date(user.created_at) < CLAUDE_OS_CUTOFF
    : false

  const hasProduct = (slug: string): boolean => {
    if (slugs.has(slug)) return true
    // Legacy metadata fallback
    if (slug === 'agents-ia')      return meta.has_agents_pack       === true
    if (slug === 'claude-code')    return meta.has_claude_code_ob    === true   // LP1 order bump 37€
                                       || isLegacyUser                          // grandfathering avant 2026-04-07
    if (slug === 'claude-cowork')  return meta.has_claude_cowork_ob  === true
    // blueprint inclus pour tout user authentifié (accès de base)
    if (slug === 'blueprint')      return !!user
    // claude-buildrs = LP2 produit principal 47€ — uniquement si acheté
    return false
  }

  const ownedSlugs  = ['blueprint', 'claude-buildrs', 'claude-code', 'claude-cowork', 'agents-ia']
    .filter(s => hasProduct(s))

  const lockedSlugs = ['claude-code', 'claude-cowork', 'agents-ia']
    .filter(s => !hasProduct(s))

  // Backward-compat aliases
  const hasPack         = hasProduct('agents-ia')
  const hasClaudeCodeOb   = hasProduct('claude-code')
  const hasClaudeCoworkOb = hasProduct('claude-cowork')

  return { hasProduct, ownedSlugs, lockedSlugs, hasPack, hasClaudeCodeOb, hasClaudeCoworkOb }
}

export type AccessContext = ReturnType<typeof useAccess>
