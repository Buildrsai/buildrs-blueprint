import { useState } from 'react'
import type { ReactNode } from 'react'
import {
  Zap, BookOpen, Lightbulb, FolderOpen, MoreHorizontal,
  Layers, Search, Palette, Building2, Hammer, Rocket, DollarSign,
  CheckSquare, Wrench, Settings, LogOut, X, Brain,
} from 'lucide-react'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { Dock } from '../ui/dock'
import { CURRICULUM } from '../../data/curriculum'

const MODULE_ICONS: Record<string, React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>> = {
  '00': Layers, '01': Search, '02': Palette, '03': Building2,
  '04': Hammer, '05': Rocket, '06': DollarSign, 'claude': Brain,
}

interface Props {
  children: ReactNode
  currentPath: string
  title: string
  navigate: (hash: string) => void
  isDark: boolean
  onToggleDark: () => void
  globalPercent: number
  moduleProgress: (moduleId: string, totalLessons: number) => number
  journalCount: number
  userEmail: string | undefined
  userFirstName?: string | undefined
  userAvatarUrl?: string | undefined
  onSignOut: () => void
  hasPack?: boolean
}

export function DashboardLayout({
  children,
  currentPath,
  title,
  navigate,
  isDark,
  onToggleDark,
  globalPercent,
  moduleProgress,
  journalCount,
  userEmail,
  userFirstName,
  userAvatarUrl,
  onSignOut,
  hasPack = false,
}: Props) {
  const [moreOpen, setMoreOpen] = useState(false)

  const go = (hash: string) => { navigate(hash); setMoreOpen(false) }

  const isActive = (hash: string) => currentPath === hash
  const isAutopilot = currentPath === '#/dashboard/autopilot' || currentPath === '#/dashboard'

  return (
    <div className="flex h-screen bg-background overflow-hidden">

      {/* ── SIDEBAR (desktop only) ── */}
      <Sidebar
        currentPath={currentPath}
        navigate={navigate}
        globalPercent={globalPercent}
        moduleProgress={moduleProgress}
        journalCount={journalCount}
        isDark={isDark}
        hasPack={hasPack}
        onToggleDark={onToggleDark}
      />

      {/* ── MAIN CONTENT ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          title={title}
          userEmail={userEmail}
          userFirstName={userFirstName}
          userAvatarUrl={userAvatarUrl}
          onSignOut={onSignOut}
          navigate={navigate}
        />
        <main className="flex-1 overflow-y-auto pb-[65px] lg:pb-0">
          {children}
        </main>
      </div>

      {/* ── MOBILE DOCK ── */}
      <div className="lg:hidden fixed bottom-5 left-0 right-0 z-40 flex justify-center pointer-events-none">
        <div className="pointer-events-auto">
          <Dock
            items={[
              {
                icon: Zap,
                label: "Accueil",
                active: isAutopilot,
                onClick: () => go('#/dashboard/autopilot'),
              },
              {
                icon: BookOpen,
                label: "Parcours",
                active: currentPath.includes('/module/'),
                onClick: () => go('#/dashboard/module/00'),
              },
              {
                icon: FolderOpen,
                label: "Projets",
                active: isActive('#/dashboard/project'),
                onClick: () => go('#/dashboard/project'),
              },
              {
                icon: MoreHorizontal,
                label: "Plus",
                active: false,
                onClick: () => setMoreOpen(true),
              },
            ]}
          />
        </div>
      </div>

      {/* ── MOBILE MORE PANEL ── */}
      {moreOpen && (
        <>
          {/* Overlay */}
          <div
            className="lg:hidden fixed inset-0 z-40 bg-background/60 backdrop-blur-sm"
            onClick={() => setMoreOpen(false)}
          />
          {/* Slide-up sheet */}
          <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 rounded-t-2xl border-t border-border bg-background pb-safe">
            {/* Handle + close */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <span className="text-[13px] font-bold text-foreground" style={{ letterSpacing: '-0.02em' }}>Navigation</span>
              <button onClick={() => setMoreOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X size={18} strokeWidth={1.5} />
              </button>
            </div>

            <div className="overflow-y-auto max-h-[65vh] px-4 py-3 flex flex-col gap-1">

              {/* CTA offres */}
              <div className="relative rounded-2xl overflow-hidden mb-3" style={{ padding: 2 }}>
                <div className="absolute" style={{
                  inset: -40,
                  background: 'conic-gradient(#ff6b6b, #ffd93d, #6bcb77, #4d96ff, #cc5de8, #ff6b6b)',
                  animation: 'cohorte-spin 4s linear infinite',
                }} />
                <button
                  onClick={() => go('#/dashboard/offers')}
                  className="relative w-full text-left rounded-[14px] px-4 py-3 transition-opacity hover:opacity-90"
                  style={{ background: 'hsl(var(--background))' }}
                >
                  <p className="text-[9px] font-bold uppercase tracking-[0.1em] mb-0.5" style={{ color: '#ff6b6b' }}>Envie d'aller plus vite ?</p>
                  <p className="font-extrabold text-foreground" style={{ fontSize: 13, letterSpacing: '-0.02em' }}>Accélérer mon projet →</p>
                  <p className="text-muted-foreground" style={{ fontSize: 10 }}>On construit avec toi</p>
                </button>
              </div>

              {/* Modules */}
              <p className="text-[9.5px] font-bold uppercase tracking-[0.08em] text-muted-foreground/60 px-2 mb-1 mt-1">
                Mon Parcours
              </p>
              {CURRICULUM.map(mod => {
                const Icon = MODULE_ICONS[mod.id] ?? Layers
                const active = currentPath.startsWith(`#/dashboard/module/${mod.id}`)
                const pct = moduleProgress(mod.id, mod.lessons.length)
                const done = pct === 100
                return (
                  <button
                    key={mod.id}
                    onClick={() => go(`#/dashboard/module/${mod.id}`)}
                    className={`flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-xl transition-colors ${active ? 'bg-foreground text-background' : 'hover:bg-secondary/60 text-muted-foreground'}`}
                  >
                    <Icon size={14} strokeWidth={1.5} />
                    <span className="text-[13px] font-medium flex-1 truncate">{mod.title}</span>
                    {done && <div className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0" />}
                  </button>
                )
              })}

              {/* Ressources */}
              <p className="text-[9.5px] font-bold uppercase tracking-[0.08em] text-muted-foreground/60 px-2 mb-1 mt-3">
                Ressources
              </p>
              <button onClick={() => go('#/dashboard/ideas')} className={`flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-xl transition-colors ${isActive('#/dashboard/ideas') ? 'bg-foreground text-background' : 'hover:bg-secondary/60 text-muted-foreground'}`}>
                <Lightbulb size={14} strokeWidth={1.5} />
                <span className="text-[13px] font-medium">Mes Idées</span>
              </button>
              <button onClick={() => go('#/dashboard/library')} className={`flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-xl transition-colors ${isActive('#/dashboard/library') ? 'bg-foreground text-background' : 'hover:bg-secondary/60 text-muted-foreground'}`}>
                <BookOpen size={14} strokeWidth={1.5} />
                <span className="text-[13px] font-medium">Bibliothèque</span>
              </button>
              <button onClick={() => go('#/dashboard/checklist')} className={`flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-xl transition-colors ${isActive('#/dashboard/checklist') ? 'bg-foreground text-background' : 'hover:bg-secondary/60 text-muted-foreground'}`}>
                <CheckSquare size={14} strokeWidth={1.5} />
                <span className="text-[13px] font-medium">Checklist</span>
              </button>
              <button onClick={() => go('#/dashboard/tools')} className={`flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-xl transition-colors ${isActive('#/dashboard/tools') ? 'bg-foreground text-background' : 'hover:bg-secondary/60 text-muted-foreground'}`}>
                <Wrench size={14} strokeWidth={1.5} />
                <span className="text-[13px] font-medium">Boîte à outils</span>
              </button>

              {/* Compte */}
              <p className="text-[9.5px] font-bold uppercase tracking-[0.08em] text-muted-foreground/60 px-2 mb-1 mt-3">
                Compte
              </p>
              <button onClick={() => go('#/dashboard/settings')} className="flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-xl transition-colors hover:bg-secondary/60 text-muted-foreground">
                <Settings size={14} strokeWidth={1.5} />
                <span className="text-[13px] font-medium">Paramètres</span>
              </button>
              <button
                onClick={() => { setMoreOpen(false); onSignOut() }}
                className="flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-xl transition-colors hover:bg-secondary/60 text-muted-foreground mb-2"
              >
                <LogOut size={14} strokeWidth={1.5} />
                <span className="text-[13px] font-medium">Se déconnecter</span>
              </button>

            </div>
          </div>
        </>
      )}

    </div>
  )
}
