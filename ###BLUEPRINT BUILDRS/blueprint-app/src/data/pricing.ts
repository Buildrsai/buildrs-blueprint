export const PACK_DISCOUNT = 0.15 // 15%

export function formatPrice(cents: number): string {
  return `${Math.round(cents / 100)}EUR`
}

export function applyDiscount(cents: number, discount = PACK_DISCOUNT): number {
  return Math.round(cents * (1 - discount))
}

export function calcPackDeal(prices: number[]): { total: number; discounted: number; savings: number } {
  const total = prices.reduce((s, p) => s + p, 0)
  const discounted = applyDiscount(total)
  return { total, discounted, savings: total - discounted }
}
