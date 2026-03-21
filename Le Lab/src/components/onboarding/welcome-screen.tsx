import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'

interface WelcomeScreenProps {
  answers: Record<string, string>
  onStart: () => void
  loading?: boolean
  error?: string | null
}

function getTimeline(temps: string): string {
  if (temps.startsWith('20h')) return '1-2 semaines'
  if (temps.startsWith('10')) return '2-3 semaines'
  if (temps.startsWith('5')) return '3-5 semaines'
  return '5-8 semaines'
}

function getRevenueLabel(revenu: string): string {
  if (revenu.startsWith('10 000')) return '10 000€+/mois'
  if (revenu.startsWith('3 000')) return '3 000-10 000€/mois'
  if (revenu.startsWith('1 000')) return '1 000-3 000€/mois'
  return '500-1 000€/mois'
}

function WelcomeScreen({ answers, onStart, loading = false, error = null }: WelcomeScreenProps) {
  const { user } = useAuth()
  const firstName = user?.email
    ? user.email.split('@')[0].charAt(0).toUpperCase() + user.email.split('@')[0].slice(1)
    : 'toi'
  const timeline = getTimeline(answers.temps ?? '')
  const revenue = getRevenueLabel(answers.revenu ?? '')

  return (
    <div className="flex-1 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-[480px] flex flex-col gap-8 text-center">
        <div className="flex flex-col gap-3">
          <p className="text-xs text-[#B2BBC5] uppercase tracking-wide">Le Lab est prêt</p>
          <h1
            className="text-[#121317]"
            style={{
              fontSize: 'clamp(28px, 5vw, 40px)',
              fontWeight: 450,
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
            }}
          >
            Bienvenue dans le Lab,
            <br />
            <span className="text-[#3279F9]">{firstName}.</span>
          </h1>
        </div>

        <div className="bg-white border border-[#E6EAF0] rounded-2xl p-6 text-left flex flex-col gap-3">
          <p className="text-sm text-[#45474D] leading-relaxed">
            Ton profil :{' '}
            <span className="text-[#121317] font-medium">{answers.profil ?? '—'}</span>
          </p>
          <p className="text-sm text-[#45474D] leading-relaxed">
            Objectif revenu :{' '}
            <span className="text-[#121317] font-medium">{revenue}</span>
          </p>
          <p className="text-sm text-[#45474D] leading-relaxed">
            Estimation : ton premier SaaS peut être en ligne dans{' '}
            <span className="text-[#121317] font-medium">{timeline}</span> à ton rythme.
          </p>
        </div>

        <p className="text-sm text-[#B2BBC5] leading-relaxed">
          Le Lab va s'adapter à toi. Chaque étape sera calibrée à ton niveau et à ton temps disponible.
        </p>

        {error && (
          <p className="text-sm text-[#EF4444] text-center">{error}</p>
        )}

        <Button variant="primary" size="lg" onClick={onStart} loading={loading} fullWidth>
          Commencer l'aventure →
        </Button>
      </div>
    </div>
  )
}

export { WelcomeScreen }
