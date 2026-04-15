import { useMemo } from 'react'
import type { AccessContext } from './useAccess'
import { PRODUCTS_CATALOG } from '../data/products-catalog'
import { calcPackDeal } from '../data/pricing'

const PACK_SLUGS = ['claude-buildrs', 'claude-cowork', 'agents-ia'] as const

export function usePackDeal(access: AccessContext | undefined) {
  return useMemo(() => {
    if (!access) return null

    const locked = PACK_SLUGS.filter(slug => !access.hasProduct(slug))
    if (locked.length === 0) return null

    const prices = locked.map(slug => {
      const p = PRODUCTS_CATALOG.find(c => c.slug === slug)
      return p?.price ?? 0
    })

    const { total, discounted, savings } = calcPackDeal(prices.map(p => p * 100))

    return {
      lockedSlugs: locked,
      count: locked.length,
      totalCents: total,
      discountedCents: discounted,
      savingsCents: savings,
      totalEur: Math.round(total / 100),
      discountedEur: Math.round(discounted / 100),
      savingsEur: Math.round(savings / 100),
    }
  }, [access])
}
