// Types utilisateur

export type UserPlan = 'free' | 'lab' | 'lab_pro'

export interface User {
  id: string
  email: string
  name: string | null
  avatar: string | null
  plan: UserPlan
  stripe_customer_id: string | null
  created_at: string
}
