import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '[Buildrs] Variables Supabase manquantes.\n' +
    'Copie .env.example → .env.local et remplis VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY.'
  )
}

export const supabase = createClient<Database>(
  supabaseUrl ?? 'https://placeholder.supabase.co',
  supabaseAnonKey ?? 'placeholder-key'
)

/** Récupère la session active, ou null si non connecté */
export async function getSession() {
  const { data: { session } } = await supabase.auth.getSession()
  return session
}

export type { User, Session } from '@supabase/supabase-js'
