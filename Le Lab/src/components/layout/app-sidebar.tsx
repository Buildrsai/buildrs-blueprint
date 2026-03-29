import { Link, useLocation } from 'react-router'
import { LayoutDashboard, Settings, Users, ChevronRight, FolderPlus, Layout, Database, DollarSign } from 'lucide-react'
import { cn } from '@/lib/utils'
import { PHASE_NAMES } from '@/lib/utils'

interface AppSidebarProps {
  currentProjectId?: string
  currentPhase?: number
  completedPhases?: number[]
  structureData?: Record<string, unknown> | null
}

// Sous-étapes Phase 2
const PHASE_2_SUB_STEPS = [
  { key: 'pages_features', label: 'Pages & Features', icon: Layout, dataKey: 'pages' },
  { key: 'data_model', label: 'Modèle de données', icon: Database, dataKey: 'data_model' },
  { key: 'monetization', label: 'Monétisation', icon: DollarSign, dataKey: 'monetization' },
]

const PHASE_ICONS = ['💡', '🏗️', '🎨', '🔧', '⚙️', '🔨', '🚀', '📣']

function AppSidebar({ currentProjectId, currentPhase, completedPhases = [], structureData }: AppSidebarProps) {
  const { pathname } = useLocation()

  const mainNav = [
    { href: '/dashboard', icon: LayoutDashboard, label: 'Mes projets' },
    { href: '/club', icon: Users, label: 'Buildrs Club' },
    { href: '/settings', icon: Settings, label: 'Paramètres' },
  ]

  return (
    <aside className="w-60 min-h-screen bg-white border-r border-[#E6EAF0] flex flex-col flex-shrink-0">
      {/* Logo */}
      <div className="h-14 flex items-center px-5 border-b border-[#E6EAF0]">
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-[#121317] flex items-center justify-center">
            <span className="text-white font-bold text-xs">B</span>
          </div>
          <span className="font-semibold text-[#121317] text-sm">Buildrs</span>
        </Link>
      </div>

      <div className="flex-1 flex flex-col p-3 gap-5 overflow-y-auto">
        {/* Navigation principale */}
        <nav className="flex flex-col gap-0.5">
          {mainNav.map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              to={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-xl text-sm',
                'transition-all duration-150',
                pathname === href
                  ? 'bg-[#F0F1F5] text-[#121317]'
                  : 'text-[#45474D] hover:text-[#121317] hover:bg-[#F0F1F5]'
              )}
            >
              <Icon size={15} strokeWidth={1.5} />
              {label}
            </Link>
          ))}
        </nav>

        {/* Phases du projet courant */}
        {currentProjectId && (
          <div className="flex flex-col gap-2">
            <p className="text-[11px] font-medium tracking-[0.12em] uppercase text-[#B2BBC5] px-3">
              Phases
            </p>
            <nav className="flex flex-col gap-0.5">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((phase) => {
                const isCompleted = completedPhases.includes(phase)
                const isCurrent = phase === currentPhase
                const isLocked = phase > (currentPhase ?? 1) && !isCompleted
                const href = `/project/${currentProjectId}/phase/${phase}`

                return (
                  <div key={phase}>
                    <Link
                      to={isLocked ? '#' : href}
                      className={cn(
                        'flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs',
                        'transition-all duration-150',
                        isCurrent && 'bg-[#F0F1F5] border border-[#3279F9]/30 text-[#121317]',
                        isCompleted && !isCurrent && 'text-[#45474D] hover:text-[#121317] hover:bg-[#F0F1F5]',
                        isLocked && 'opacity-30 cursor-not-allowed text-[#B2BBC5]',
                        !isCurrent && !isLocked && 'text-[#45474D] hover:text-[#121317] hover:bg-[#F0F1F5]'
                      )}
                    >
                      <span
                        className={cn(
                          'w-1 h-1 rounded-full flex-shrink-0',
                          isCompleted ? 'bg-[#3279F9]' : isCurrent ? 'bg-[#3279F9]' : 'bg-[#E6EAF0]'
                        )}
                      />
                      <span className="flex-1 truncate">
                        {PHASE_ICONS[phase - 1]} {PHASE_NAMES[phase]}
                      </span>
                      {isCurrent && <ChevronRight size={10} className="text-[#3279F9] flex-shrink-0" />}
                    </Link>

                    {/* Sous-étapes Phase 2 */}
                    {phase === 2 && isCurrent && (
                      <div className="ml-5 mt-1 flex flex-col gap-0.5 border-l border-[#E6EAF0] pl-3">
                        {PHASE_2_SUB_STEPS.map(sub => {
                          const Icon = sub.icon
                          const isDone = !!(structureData as Record<string, unknown> | undefined)?.[sub.dataKey]
                          return (
                            <div
                              key={sub.key}
                              className="flex items-center gap-2 py-1.5 text-[11px]"
                            >
                              <Icon size={12} className={isDone ? 'text-[#22C55E]' : 'text-[#B2BBC5]'} />
                              <span className={isDone ? 'text-[#45474D]' : 'text-[#B2BBC5]'}>
                                {sub.label}
                              </span>
                              {isDone && <span className="text-[10px] text-[#22C55E]">✓</span>}
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })}
            </nav>
          </div>
        )}
      </div>

      {/* Nouveau projet */}
      <div className="p-3 border-t border-[#E6EAF0]">
        <Link
          to="/project/new"
          className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl
            bg-[#F8F9FC] border border-[#E6EAF0] text-[#45474D] text-xs font-medium
            hover:border-[#B2BBC5] hover:text-[#121317] transition-all duration-150"
        >
          <FolderPlus size={13} />
          Nouveau projet
        </Link>
      </div>
    </aside>
  )
}

export { AppSidebar }
