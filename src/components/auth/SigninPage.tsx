import { useState } from 'react'
import { Github } from 'lucide-react'
import { BuildrsIcon } from '../ui/icons'
import { useAuth } from '../../hooks/useAuth'

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
)

interface Props {
  onSwitchToSignup: () => void
  onSuccess: () => void
}

export function SigninPage({ onSwitchToSignup, onSuccess }: Props) {
  const { signInEmail, signInGoogle, signInGitHub } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleOAuth = (fn: () => void) => { fn(); onSuccess() }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const { error } = await signInEmail(email, password)
    setLoading(false)
    if (error) { setError(error); return }
    onSuccess()
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        <div className="flex items-center gap-2.5 justify-center mb-8">
          <BuildrsIcon color="hsl(var(--foreground))" size={22} />
          <span className="font-extrabold text-lg text-foreground" style={{ letterSpacing: '-0.04em' }}>Buildrs</span>
        </div>

        <h1 className="text-3xl font-extrabold text-foreground text-center mb-1" style={{ letterSpacing: '-0.03em' }}>
          Content de te revoir
        </h1>
        <p className="text-sm text-muted-foreground text-center mb-8">
          Connecte-toi pour accéder à ton Blueprint.
        </p>

        <div className="flex flex-col gap-3 mb-6">
          <button onClick={() => handleOAuth(signInGoogle)} className="flex items-center justify-center gap-3 w-full border border-border rounded-xl px-4 py-3 text-sm font-medium text-foreground hover:bg-secondary transition-colors">
            <GoogleIcon /> Continuer avec Google
          </button>
          <button onClick={() => handleOAuth(signInGitHub)} className="flex items-center justify-center gap-3 w-full border border-border rounded-xl px-4 py-3 text-sm font-medium text-foreground hover:bg-secondary transition-colors">
            <Github size={18} strokeWidth={1.5} /> Continuer avec GitHub
          </button>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs text-muted-foreground">ou</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">Email</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="toi@exemple.com"
              className="w-full border border-border rounded-lg px-4 py-2.5 bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20" />
          </div>
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">Mot de passe</label>
            <input type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="Ton mot de passe"
              className="w-full border border-border rounded-lg px-4 py-2.5 bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20" />
          </div>

          {error && <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}

          <button type="submit" disabled={loading}
            className="bg-foreground text-background rounded-xl px-6 py-3 text-sm font-semibold disabled:opacity-50 mt-1 hover:opacity-90 transition-opacity">
            {loading ? 'Connexion...' : 'Se connecter →'}
          </button>
        </form>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Pas encore de compte ?{' '}
          <button onClick={onSwitchToSignup} className="text-foreground font-semibold underline underline-offset-2">Créer mon accès</button>
        </p>
      </div>
    </div>
  )
}
