import { Users, Lock } from 'lucide-react'

interface Props {
  userId: string
  navigate: (hash: string) => void
}

export function CollaboratorsPage({ navigate }: Props) {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-foreground tracking-tight" style={{ letterSpacing: '-0.03em' }}>
          Collaborateurs
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Invite des co-fondateurs ou partenaires sur ton projet.
        </p>
      </div>
      <div className="text-center py-16 border border-dashed border-border rounded-xl">
        <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
          <Lock size={20} strokeWidth={1.5} className="text-muted-foreground/50" />
        </div>
        <p className="text-sm font-medium text-foreground mb-1">Fonctionnalite Cohorte</p>
        <p className="text-xs text-muted-foreground mb-4">
          La collaboration est reservee aux membres de la Cohorte Buildrs.
        </p>
        <button
          onClick={() => navigate('#/dashboard/offers')}
          className="flex items-center gap-2 mx-auto text-xs font-semibold px-4 py-2 rounded-lg bg-foreground text-background hover:opacity-90 transition-opacity"
        >
          <Users size={12} strokeWidth={1.5} />
          Rejoindre la Cohorte
        </button>
      </div>
    </div>
  )
}
