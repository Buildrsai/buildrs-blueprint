import { useState } from 'react'
import { Link } from 'react-router'
import { z } from 'zod'
import { Check, Chrome, Github, Apple } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { supabase } from '@/lib/supabase'

const signupSchema = z.object({
  name: z.string().min(2, 'Ton prénom doit faire au moins 2 caractères'),
  email: z.string().email('Adresse email invalide'),
  password: z
    .string()
    .min(8, 'Au moins 8 caractères')
    .regex(/[A-Z]/, 'Au moins une majuscule')
    .regex(/[0-9]/, 'Au moins un chiffre'),
})

type SignupForm = z.infer<typeof signupSchema>

const BENEFITS = [
  'Buildrs Finder gratuit et illimité',
  'Accès au Lab dès le paiement',
  'Annule quand tu veux',
]

function SignupPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState<SignupForm>({ name: '', email: '', password: '' })
  const [errors, setErrors] = useState<Partial<SignupForm & { global: string }>>({})
  const [loading, setLoading] = useState(false)
  const [confirmSent, setConfirmSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const result = signupSchema.safeParse(form)
    if (!result.success) {
      const fieldErrors: Partial<SignupForm> = {}
      result.error.errors.forEach((err) => {
        const field = err.path[0] as keyof SignupForm
        fieldErrors[field] = err.message
      })
      setErrors(fieldErrors)
      return
    }
    setErrors({})
    setLoading(true)

    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: { full_name: form.name },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    setLoading(false)

    if (error) {
      setErrors({ global: error.message })
      return
    }

    // Supabase envoie un email de confirmation
    setConfirmSent(true)
  }

  const handleOAuth = async (provider: 'google' | 'github' | 'apple') => {
    await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
  }

  if (confirmSent) {
    return (
      <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center bg-[#F8F9FC] px-6">
        <div className="text-center flex flex-col gap-3 max-w-sm">
          <Check size={32} className="text-[#22C55E] mx-auto" strokeWidth={1.5} />
          <h2 className="text-[#121317] font-medium text-xl">Vérifie ta boite mail</h2>
          <p className="text-sm text-[#45474D]">
            On t&apos;a envoyé un lien de confirmation à <strong>{form.email}</strong>.
            Clique dessus pour activer ton compte.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center bg-[#F8F9FC] px-6 py-12">
      <div className="w-full max-w-[400px] flex flex-col gap-7">
        <div className="flex flex-col items-center text-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-[#121317] flex items-center justify-center mb-1">
            <span className="text-white font-bold text-sm">B</span>
          </div>
          <h1
            className="text-[#121317]"
            style={{ fontSize: '1.5rem', fontWeight: 500, letterSpacing: '-0.02em' }}
          >
            Crée ton compte
          </h1>
          <p className="text-sm text-[#45474D]">Gratuit. Aucune carte requise pour commencer.</p>
        </div>

        <ul className="flex flex-col gap-2">
          {BENEFITS.map((b) => (
            <li key={b} className="flex items-center gap-2.5">
              <Check size={13} className="text-[#22C55E] flex-shrink-0" strokeWidth={2.5} />
              <span className="text-sm text-[#45474D]">{b}</span>
            </li>
          ))}
        </ul>

        {/* OAuth */}
        <div className="flex flex-col gap-2">
          <button
            onClick={() => handleOAuth('google')}
            className="flex items-center justify-center gap-3 w-full h-10 rounded-full border border-[#E6EAF0] bg-white text-sm font-medium text-[#121317] hover:bg-[#F8F9FC] transition-colors"
          >
            <Chrome size={16} strokeWidth={1.5} />
            Continuer avec Google
          </button>
          <button
            onClick={() => handleOAuth('github')}
            className="flex items-center justify-center gap-3 w-full h-10 rounded-full border border-[#E6EAF0] bg-white text-sm font-medium text-[#121317] hover:bg-[#F8F9FC] transition-colors"
          >
            <Github size={16} strokeWidth={1.5} />
            Continuer avec GitHub
          </button>
          <button
            onClick={() => handleOAuth('apple')}
            className="flex items-center justify-center gap-3 w-full h-10 rounded-full border border-[#E6EAF0] bg-white text-sm font-medium text-[#121317] hover:bg-[#F8F9FC] transition-colors"
          >
            <Apple size={16} strokeWidth={1.5} />
            Continuer avec Apple
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-[#E6EAF0]" />
          <span className="text-xs text-[#B2BBC5]">ou par email</span>
          <div className="flex-1 h-px bg-[#E6EAF0]" />
        </div>

        <Card variant="white" padding="lg">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {errors.global && (
              <p className="text-sm text-[#EF4444] text-center">{errors.global}</p>
            )}
            <Input
              mode="light"
              label="Prénom"
              type="text"
              placeholder="Tony"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              error={errors.name}
              autoComplete="given-name"
            />
            <Input
              mode="light"
              label="Email"
              type="email"
              placeholder="tony@stark.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              error={errors.email}
              autoComplete="email"
            />
            <Input
              mode="light"
              label="Mot de passe"
              type="password"
              placeholder="Au moins 8 caractères"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              error={errors.password}
              hint="8 caractères minimum, une majuscule, un chiffre"
              autoComplete="new-password"
            />

            <Button type="submit" variant="primary" fullWidth loading={loading}>
              Créer mon compte
            </Button>

            <p className="text-xs text-center text-[#B2BBC5]">
              En créant un compte, tu acceptes nos{' '}
              <Link to="#" className="text-[#45474D] hover:text-[#121317] underline">CGV</Link>{' '}
              et notre{' '}
              <Link to="#" className="text-[#45474D] hover:text-[#121317] underline">politique de confidentialité</Link>.
            </p>
          </form>
        </Card>

        <p className="text-center text-sm text-[#45474D]">
          Déjà un compte ?{' '}
          <Link to="/login" className="text-[#3279F9] hover:text-[#1A73E8] font-medium transition-colors">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  )
}

export { SignupPage }
