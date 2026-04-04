import type { User } from '@supabase/supabase-js'
import type { PurchaseRow } from './usePurchases'

/**
 * Combine user_purchases (nouvelle table) + legacy user_metadata flags.
 * Backward compat : hasPack, hasClaudeCodeOb, hasClaudeCoworkOb toujours disponibles.
 */
export function useAccess(user: User | null, purchases: PurchaseRow[]) {
  const slugs = new Set(purchases.map(p => p.product_slug))
  const meta  = user?.user_metadata ?? {}

  const hasProduct = (slug: string): boolean => {
    if (slugs.has(slug)) return true
    // Legacy metadata fallback
    if (slug === 'agents-ia')      return meta.has_agents_pack       === true
    if (slug === 'claude-code')    return meta.has_claude_code_ob    === true   // LP1 order bump 37€
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
