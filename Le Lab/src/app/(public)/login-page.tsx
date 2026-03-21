import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { z } from 'zod'
import { Chrome, Github, Apple, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { supabase } from '@/lib/supabase'

const loginSchema = z.object({
  email: z.string().email('Adresse email invalide'),
  password: z.string().min(1, 'Mot de passe requis'),
})

type LoginForm = z.infer<typeof loginSchema>

function LoginPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState<LoginForm>({ email: '', password: '' })
  const [errors, setErrors] = useState<Partial<LoginForm & { global: string }>>({})
  const [loading, setLoading] = useState(false)
  const [magicSent, setMagicSent] = useState(false)

  // Email + mot de passe
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const result = loginSchema.safeParse(form)
    if (!result.success) {
      const fieldErrors: Partial<LoginForm> = {}
      result.error.errors.forEach((err) => {
        const field = err.path[0] as keyof LoginForm
        fieldErrors[field] = err.message
      })
      setErrors(fieldErrors)
      return
    }
    setErrors({})
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    })

    if (error) {
      setErrors({ global: 'Email ou mot de passe incorrect.' })
      setLoading(false)
      return
    }

    navigate('/dashboard')
  }

  // Magic link
  const handleMagicLink = async () => {
    const emailResult = z.string().email().safeParse(form.email)
    if (!emailResult.success) {
      setErrors({ email: 'Entre ton email pour recevoir le lien.' })
      return
    }
    setLoading(true)
    const { error } = await supabase.auth.signInWithOtp({
      email: form.email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    })
    setLoading(false)
    if (error) {
      setErrors({ global: error.message })
      return
    }
    setMagicSent(true)
  }

  // OAuth
  const handleOAuth = async (provider: 'google' | 'github' | 'apple') => {
    await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
  }

  if (magicSent) {
    return (
      <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center bg-[#F8F9FC] px-6">
        <div className="text-center flex flex-col gap-3 max-w-sm">
          <Mail size={32} className="text-[#3279F9] mx-auto" strokeWidth={1.5} />
          <h2 className="text-[#121317] font-medium text-xl">Vérifie ta boite mail</h2>
          <p className="text-sm text-[#45474D]">
            On t&apos;a envoyé un lien de connexion à <strong>{form.email}</strong>.
            Clique dessus pour te connecter.
          </p>
          <button
            onClick={() => setMagicSent(false)}
            className="text-sm text-[#3279F9] hover:text-[#1A73E8] mt-2"
          >
            Retour
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center bg-[#F8F9FC] px-6 py-12">
      <div className="w-full max-w-[400px] flex flex-col gap-8">
        <div className="flex flex-col items-center text-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-[#121317] flex items-center justify-center mb-1">
            <span className="text-white font-bold text-sm">B</span>
          </div>
          <h1
            className="text-[#121317]"
            style={{ fontSize: '1.5rem', fontWeight: 500, letterSpacing: '-0.02em' }}
          >
            Bon retour
          </h1>
          <p className="text-sm text-[#45474D]">Connecte-toi à ton espace Buildrs Lab</p>
        </div>

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
              label="Email"
              type="email"
              placeholder="ton@email.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              error={errors.email}
              autoComplete="email"
            />
            <div className="flex flex-col gap-1.5">
              <Input
                mode="light"
                label="Mot de passe"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                error={errors.password}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={handleMagicLink}
                className="text-xs text-[#3279F9] hover:text-[#1A73E8] self-end transition-colors"
              >
                Connexion par lien magique
              </button>
            </div>

            <Button type="submit" variant="primary" fullWidth loading={loading}>
              Se connecter
            </Button>
          </form>
        </Card>

        <p className="text-center text-sm text-[#45474D]">
          Pas encore de compte ?{' '}
          <Link to="/signup" className="text-[#3279F9] hover:text-[#1A73E8] font-medium transition-colors">
            Créer un compte
          </Link>
        </p>
      </div>
    </div>
  )
}

export { LoginPage }
