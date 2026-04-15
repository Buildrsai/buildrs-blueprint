import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export interface PurchaseRow {
  product_slug: string
  purchased_at: string
}

export function usePurchases(userId: string | undefined) {
  const [purchases, setPurchases] = useState<PurchaseRow[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    if (!userId) { setLoading(false); return }
    const { data } = await supabase
      .from('user_purchases')
      .select('product_slug, purchased_at')
      .eq('user_id', userId)
    setPurchases((data ?? []) as PurchaseRow[])
    setLoading(false)
  }, [userId])

  useEffect(() => { load() }, [load])

  return { purchases, loading, refetch: load }
}
