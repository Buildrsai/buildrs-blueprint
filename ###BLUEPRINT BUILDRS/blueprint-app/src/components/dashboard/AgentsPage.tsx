import { ArrowLeft, Construction } from 'lucide-react'

/**
 * AgentsPage — Phase 4 stub (2026-04-17).
 *
 * The legacy 6-agents gallery was archived at
 * `src/_archived/pack-agents-v0/AgentsPage.legacy.tsx` during Phase 0 cleanup.
 * The full Pack Agents V1 (7 agents : Jarvis, Planner, Designer, DB Architect,
 * Builder, Connector, Launcher) will be rebuilt in Phase 4 from
 * `_buildrs-agents-spec/05-agents-config.ts`.
 *
 * Until then, any hit on `#/dashboard/agents` (incl. legacy redirects from
 * `#/dashboard/agent-chat/:id`) lands on this stub.
 */

interface Props {
  navigate: (hash: string) => void
  hasPack: boolean
}

export function AgentsPage({ navigate, hasPack }: Props) {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-8">
      <div className="max-w-lg text-center">
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-6 border"
          style={{ borderColor: 'hsl(var(--border))', background: 'hsl(var(--secondary))' }}
        >
          <Construction strokeWidth={1.5} size={24} />
        </div>

        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
          Pack Agents IA
        </p>

        <h1
          className="text-3xl font-extrabold text-foreground tracking-tight mb-3"
          style={{ letterSpacing: '-0.04em' }}
        >
          Refonte en cours.
        </h1>

        <p className="text-muted-foreground text-sm mb-8 leading-relaxed">
          Les agents reviennent bientôt, avec un système repensé autour de Claude Code&nbsp;:
          Jarvis, Planner, Designer, DB Architect, Builder, Connector et Launcher.
          {hasPack
            ? ' Ton accès est enregistré — tu retrouveras tes agents dès la mise en ligne.'
            : ' Suis le chantier depuis ton tableau de bord.'}
        </p>

        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => navigate('#/dashboard')}
            className="inline-flex items-center gap-2 border border-border rounded-xl px-5 py-2.5 text-xs font-semibold hover:bg-secondary transition-colors"
          >
            <ArrowLeft strokeWidth={1.5} size={14} />
            Retour au tableau de bord
          </button>

          {!hasPack && (
            <button
              type="button"
              onClick={() => navigate('#/dashboard/offers')}
              className="bg-foreground text-background rounded-xl px-5 py-2.5 text-xs font-semibold hover:opacity-90 transition-opacity"
            >
              Voir les offres →
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
