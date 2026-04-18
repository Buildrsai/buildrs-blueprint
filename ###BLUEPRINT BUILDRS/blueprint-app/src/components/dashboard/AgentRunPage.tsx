import { useEffect } from 'react'
import { ArrowLeft } from 'lucide-react'
import { AGENTS_CONFIG, type AgentSlug } from '../../lib/agents/config'

interface Props {
  agentSlug: string
  navigate: (hash: string) => void
  hasPack: boolean
}

export function AgentRunPage({ agentSlug, navigate, hasPack }: Props) {
  const config = AGENTS_CONFIG[agentSlug as AgentSlug]

  useEffect(() => {
    if (!config || !hasPack) navigate('#/dashboard/agents')
  }, [config, hasPack, navigate])

  if (!config || !hasPack) return null

  return (
    <div className="max-w-[800px] mx-auto px-5 py-10">
      <button
        onClick={() => navigate('#/dashboard/agents')}
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft size={14} strokeWidth={1.5} />
        Retour aux agents
      </button>

      <div className="flex items-center gap-4 mb-10">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${config.bgAccentColor}`}>
          <img
            src={config.logoPath}
            alt={config.name}
            width={26}
            height={26}
            className="object-contain"
          />
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            {config.phase}
          </p>
          <h1
            className="text-2xl font-extrabold text-foreground tracking-tight"
            style={{ letterSpacing: '-0.04em' }}
          >
            {config.name}
          </h1>
          <p className="text-sm text-muted-foreground">{config.role}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-10 text-center">
        <p className="text-sm text-muted-foreground">
          Interface de l'agent en construction — disponible Phase 5.
        </p>
      </div>
    </div>
  )
}
