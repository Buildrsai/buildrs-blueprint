import type { ReactNode } from 'react'
import { ArrowLeft } from 'lucide-react'
import { BuildrsIcon } from '../ui/icons'

interface Props {
  title: string
  lastUpdated?: string
  children: ReactNode
}

export function LegalPage({ title, lastUpdated, children }: Props) {
  const goBack = () => {
    window.location.hash = '/landing'
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border bg-background/90 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto px-5 h-[52px] flex items-center justify-between">
          <button
            onClick={goBack}
            className="flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={14} strokeWidth={1.5} />
            Retour
          </button>
          <button onClick={goBack} className="flex items-center gap-2 hover:opacity-75 transition-opacity">
            <BuildrsIcon color="hsl(var(--foreground))" size={16} />
            <span className="font-extrabold text-[13px] text-foreground" style={{ letterSpacing: '-0.04em' }}>
              Buildrs
            </span>
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-5 py-12 pb-24">
        <div className="mb-8">
          <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground mb-2">
            Buildrs Group LLC
          </p>
          <h1
            className="text-foreground mb-2"
            style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 800, letterSpacing: '-0.04em' }}
          >
            {title}
          </h1>
          {lastUpdated && (
            <p className="text-[12px] text-muted-foreground">
              Dernière mise à jour : {lastUpdated}
            </p>
          )}
        </div>

        <div className="prose-legal">
          {children}
        </div>
      </main>

      {/* Footer minimal */}
      <footer className="border-t border-border py-6">
        <p className="text-center text-[11px] text-muted-foreground/50">
          © {new Date().getFullYear()} Buildrs Group LLC — team@buildrs.fr
        </p>
      </footer>
    </div>
  )
}

// ─── Composants prose réutilisables ──────────────────────────────────────────

export function LSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mb-10">
      <h2
        className="text-foreground mb-4 pb-2 border-b border-border"
        style={{ fontSize: 16, fontWeight: 700, letterSpacing: '-0.02em' }}
      >
        {title}
      </h2>
      <div className="space-y-3 text-[13px] leading-[1.75] text-muted-foreground">
        {children}
      </div>
    </section>
  )
}

export function LP({ children }: { children: ReactNode }) {
  return <p>{children}</p>
}

export function LStrong({ children }: { children: ReactNode }) {
  return <strong className="font-semibold text-foreground">{children}</strong>
}

export function LUl({ children }: { children: ReactNode }) {
  return <ul className="list-disc list-inside space-y-1.5 ml-1">{children}</ul>
}

export function LLi({ children }: { children: ReactNode }) {
  return <li>{children}</li>
}

export function LCallout({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-secondary/40 px-5 py-4 text-[13px] leading-[1.7] text-muted-foreground">
      {children}
    </div>
  )
}
