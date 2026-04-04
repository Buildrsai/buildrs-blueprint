import { useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import {
  Zap, BookOpen, Lightbulb, FolderOpen, MoreHorizontal, Home,
  Layers, Search, Palette, Building2, Hammer, Rocket, DollarSign,
  CheckSquare, Wrench, Settings, LogOut, X, Brain,
  RefreshCw, Terminal, Lock, MessageSquare, Users,
} from 'lucide-react'

// ── V3 countdown (shared avec Sidebar) ───────────────────────────────────────
const V3_UNLOCK = new Date('2026-04-07T00:00:00+02:00').getTime()
function computeV3Label(): string {
  const diff = V3_UNLOCK - Date.now()
  if (diff <= 0) return 'V3 Bientôt'
  const days  = Math.floor(diff / 86_400_000)
  const hours = Math.floor((diff % 86_400_000) / 3_600_000)
  const mins  = Math.floor((diff % 3_600_000) / 60_000)
  if (days > 0) return `V3 · ${days}j${hours}h`
  if (hours > 0) return `V3 · ${hours}h${String(mins).padStart(2,'0')}`
  return `V3 · ${mins}min`
}
function useV3Countdown() {
  const [label, setLabel] = useState(computeV3Label)
  useEffect(() => {
    const id = setInterval(() => setLabel(computeV3Label()), 60_000)
    return () => clearInterval(id)
  }, [])
  return label
}
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { Dock } from '../ui/dock'
import { PurchaseModal } from './PurchaseModal'
import { CURRICULUM } from '../../data/curriculum'
import type { AccessContext } from '../../hooks/useAccess'
import type { BuildrsProfile } from '../../hooks/useProfile'
import { ClaudeIcon } from '../ui/icons'

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
  userId?: string
  onSignOut: () => void
  hasPack?: boolean
  access?: AccessContext
  contentRows?: { brick_id: string; completed: boolean }[]
  profile?: BuildrsProfile | null
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
  userId,
  onSignOut,
  hasPack = false,
  access,
  contentRows = [],
  profile,
}: Props) {
  const [moreOpen, setMoreOpen] = useState(false)
  const [purchaseSlug, setPurchaseSlug] = useState<string | null>(null)
  const v3Label = useV3Countdown()

  const go = (hash: string) => { navigate(hash); setMoreOpen(false) }

  // Helper V3 locked item pour mobile
  const mobileV3Item = (label: string, Icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>) => (
    <div key={label} className="flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-xl cursor-not-allowed" style={{ opacity: 0.38 }}>
      <Icon size={14} strokeWidth={1.5} />
      <span className="text-[13px] font-medium flex-1 truncate">{label}</span>
      <span className="text-[8px] font-bold px-1.5 py-0.5 rounded flex-shrink-0 tabular-nums"
        style={{ background: 'rgba(139,92,246,0.12)', color: '#8b5cf6', border: '1px solid rgba(139,92,246,0.25)', whiteSpace: 'nowrap' }}>
        {v3Label}
      </span>
      <Lock size={10} strokeWidth={1.5} className="flex-shrink-0" />
    </div>
  )

  const isActive = (hash: string) => currentPath === hash
  const isHome = currentPath === '#/dashboard'
  const isAutopilot = currentPath === '#/dashboard/autopilot'

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
        access={access}
        contentRows={contentRows}
        onRequestPurchase={setPurchaseSlug}
        profile={profile}
      />

      {/* ── MAIN CONTENT ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          title={title}
          userEmail={userEmail}
          userFirstName={userFirstName}
          userAvatarUrl={userAvatarUrl}
          userId={userId}
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
                icon: Home,
                label: "Accueil",
                active: isHome,
                onClick: () => go('#/dashboard'),
              },
              {
                icon: Zap,
                label: "Jarvis",
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

              {/* Claude OS */}
              <button onClick={() => go('#/dashboard/claude-os')} className={`flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-xl transition-colors ${isActive('#/dashboard/claude-os') || currentPath.startsWith('#/dashboard/claude-os') ? 'bg-foreground text-background' : 'hover:bg-secondary/60 text-muted-foreground'}`}>
                <ClaudeIcon size={14} strokeWidth={1.5} />
                <span className="text-[13px] font-medium flex-1 truncate">Claude OS</span>
                <span className="text-[8px] font-bold px-1.5 py-0.5 rounded flex-shrink-0" style={{ background: 'rgba(139,92,246,0.12)', color: '#8b5cf6', border: '1px solid rgba(139,92,246,0.25)' }}>V3</span>
              </button>

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

              {/* Communauté — V3 lock */}
              <p className="text-[9.5px] font-bold uppercase tracking-[0.08em] text-muted-foreground/60 px-2 mb-1 mt-3">
                Communauté
              </p>
              {mobileV3Item('Feed',    MessageSquare)}
              {mobileV3Item('Membres', Users)}

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

      {/* ── PURCHASE MODAL ── */}
      {purchaseSlug && userId && access && (
        <PurchaseModal
          productSlug={purchaseSlug}
          userId={userId}
          access={access}
          onClose={() => setPurchaseSlug(null)}
        />
      )}

    </div>
  )
}
