import { useState } from 'react'
import {
  BookOpen, Package, Sparkles, Zap, ArrowLeft, ChevronRight,
  Terminal, FileCode, Settings, Cpu,
  Bot, Plug, Wrench, Rocket, Copy, Mail,
  MessageSquare, Bug, Brain, Construction, Monitor, Users,
} from 'lucide-react'
import { ClaudeIcon } from '../ui/icons'

// ── Types ─────────────────────────────────────────────────────────────────────

type TabId = 'apprendre' | 'equiper' | 'generer' | 'hacks'

interface BadgeDef {
  label: string
  color: string
  bg: string
  border: string
}

interface CardDef {
  id: string
  title: string
  desc: string
  badges: BadgeDef[]
  Icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>
}

interface HubCardDef {
  id: string
  title: string
  desc: string
  badge: BadgeDef
  Icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>
}

// ── Badges ───────────────────────────────────────────────────────────────────

const BADGE_BLUE: BadgeDef = {
  label: 'Formation',
  color: '#4d96ff',
  bg: 'rgba(77,150,255,0.12)',
  border: 'rgba(77,150,255,0.25)',
}
const BADGE_GREEN: BadgeDef = {
  label: 'Ressources',
  color: '#22c55e',
  bg: 'rgba(34,197,94,0.12)',
  border: 'rgba(34,197,94,0.25)',
}
const BADGE_VIOLET: BadgeDef = {
  label: 'Génération',
  color: '#8b5cf6',
  bg: 'rgba(139,92,246,0.12)',
  border: 'rgba(139,92,246,0.25)',
}
const BADGE_GUIDE: BadgeDef = {
  label: 'Guide',
  color: '#f59e0b',
  bg: 'rgba(245,158,11,0.12)',
  border: 'rgba(245,158,11,0.25)',
}
const BADGE_HACK: BadgeDef = {
  label: 'Hack',
  color: '#06b6d4',
  bg: 'rgba(6,182,212,0.12)',
  border: 'rgba(6,182,212,0.25)',
}

// ── Cards per tab ─────────────────────────────────────────────────────────────

const CARDS: Record<TabId, CardDef[]> = {
  apprendre: [
    {
      id: 'claude-code',
      title: 'Claude Code',
      desc: "Ton terminal qui code, déploie et debug.",
      badges: [BADGE_BLUE],
      Icon: ClaudeIcon,
    },
    {
      id: 'claude-cowork',
      title: 'Claude Cowork',
      desc: "L'agent qui gère ton business pendant que tu build.",
      badges: [BADGE_BLUE],
      Icon: Monitor,
    },
    {
      id: 'prompts',
      title: 'Prompts',
      desc: "La compétence n°1. Bon prompt = résultat 10x.",
      badges: [BADGE_BLUE, BADGE_VIOLET],
      Icon: Terminal,
    },
    {
      id: 'claude-md',
      title: 'CLAUDE.md',
      desc: "Sans ça, Claude oublie tout. Avec, il connaît ton projet.",
      badges: [BADGE_BLUE, BADGE_VIOLET],
      Icon: FileCode,
    },
    {
      id: 'skills',
      title: 'Skills',
      desc: "Tes workflows en une commande. /deploy, /ship — c'est fait.",
      badges: [BADGE_BLUE, BADGE_GREEN, BADGE_VIOLET],
      Icon: Wrench,
    },
    {
      id: 'mcp-connecteurs',
      title: 'MCP & Connecteurs',
      desc: "Claude agit dans Supabase, Vercel, Stripe. Zéro copier-coller.",
      badges: [BADGE_BLUE, BADGE_GREEN, BADGE_VIOLET],
      Icon: Plug,
    },
    {
      id: 'plugins',
      title: 'Plugins',
      desc: "22 packages prêts. Installés en 10 min.",
      badges: [BADGE_BLUE, BADGE_GREEN],
      Icon: Package,
    },
    {
      id: 'team-agents',
      title: 'Team Agents',
      desc: "3 Claude en parallèle. Le CTO que t'as pas encore.",
      badges: [BADGE_BLUE, BADGE_VIOLET],
      Icon: Users,
    },
  ],

  equiper: [
    {
      id: 'checklist-installation',
      title: "Checklist d'installation",
      desc: "8 étapes dans l'ordre. De zéro à opérationnel.",
      badges: [BADGE_GUIDE],
      Icon: Settings,
    },
    {
      id: 'bibliotheque-skills',
      title: 'Bibliothèque Skills',
      desc: '70+ skills avec commandes d\'installation.',
      badges: [BADGE_GREEN],
      Icon: BookOpen,
    },
    {
      id: 'bibliotheque-plugins',
      title: 'Bibliothèque Plugins',
      desc: '22 plugins. Commande copier-coller pour chaque.',
      badges: [BADGE_GREEN],
      Icon: Package,
    },
    {
      id: 'bibliotheque-mcp',
      title: 'Bibliothèque MCP & Connecteurs',
      desc: 'MCP servers + connecteurs Claude.ai. Tout le setup.',
      badges: [BADGE_GREEN],
      Icon: Plug,
    },
    {
      id: 'cheatsheet-commandes',
      title: 'Cheatsheet Commandes',
      desc: '80+ commandes organisées par situation.',
      badges: [BADGE_GREEN],
      Icon: Terminal,
    },
    {
      id: 'prompt-general-buildrs',
      title: 'Prompt Général Buildrs',
      desc: 'Le system prompt qu\'on utilise sur tous nos projets.',
      badges: [BADGE_GREEN],
      Icon: Brain,
    },
  ],

  generer: [
    {
      id: 'generateur-claude-md',
      title: 'Générateur CLAUDE.md',
      desc: 'Crée la mémoire de ton projet en 6 étapes.',
      badges: [BADGE_VIOLET],
      Icon: FileCode,
    },
    {
      id: 'generateur-skills',
      title: 'Générateur Skills',
      desc: 'Crée un skill custom en 4 étapes.',
      badges: [BADGE_VIOLET],
      Icon: Wrench,
    },
    {
      id: 'generateur-mcp',
      title: 'Générateur MCP',
      desc: 'Recommande les MCPs selon ton type de projet.',
      badges: [BADGE_VIOLET],
      Icon: Cpu,
    },
    {
      id: 'generateur-team-agents',
      title: 'Générateur Team Agents',
      desc: "Configure une équipe d'agents en 4 étapes.",
      badges: [BADGE_VIOLET],
      Icon: Bot,
    },
    {
      id: 'generateur-prompt-parfait',
      title: 'Générateur Prompt Parfait',
      desc: 'Crée ton system prompt personnalisé en 5 étapes.',
      badges: [BADGE_VIOLET],
      Icon: Sparkles,
    },
  ],

  hacks: [
    {
      id: 'dispatch-cowork',
      title: 'Dispatch Cowork',
      desc: 'Pilote Claude Cowork depuis ton téléphone.',
      badges: [BADGE_HACK],
      Icon: Monitor,
    },
    {
      id: 'telegram-discord',
      title: 'Telegram + Discord',
      desc: 'Pilote Claude Code depuis ton téléphone.',
      badges: [BADGE_HACK],
      Icon: MessageSquare,
    },
    {
      id: 'opus-plan-mode',
      title: 'Opus & Plan Mode',
      desc: 'Quand utiliser Opus vs Sonnet vs Haiku.',
      badges: [BADGE_HACK],
      Icon: Brain,
    },
    {
      id: 'token-economy',
      title: 'Token Economy',
      desc: 'Stratégie pour optimiser tes coûts Claude.',
      badges: [BADGE_HACK],
      Icon: Zap,
    },
  ],
}

// ── Tab config ────────────────────────────────────────────────────────────────

const TABS: { id: TabId; label: string; Icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }> }[] = [
  { id: 'apprendre', label: 'Apprendre', Icon: BookOpen },
  { id: 'equiper',   label: 'Équiper',   Icon: Package },
  { id: 'generer',   label: 'Générer',   Icon: Sparkles },
  { id: 'hacks',     label: 'Hacks',     Icon: Zap },
]

// ── Hub sub-cards (apprendre cards that expand into sub-pages) ────────────────

const HUBS: Partial<Record<string, HubCardDef[]>> = {
  prompts: [
    { id: 'formation',   title: 'Formation',   desc: 'Les 5 principes et le framework CTAR', badge: BADGE_BLUE,   Icon: BookOpen },
    { id: 'generateur',  title: 'Générateur',  desc: 'Crée ton system prompt en 5 étapes',   badge: BADGE_VIOLET, Icon: Sparkles },
  ],
  'claude-md': [
    { id: 'formation',   title: 'Formation',   desc: 'Structure, hiérarchie et template Buildrs',    badge: BADGE_BLUE,   Icon: BookOpen },
    { id: 'generateur',  title: 'Générateur',  desc: 'Crée la mémoire de ton projet en 6 étapes',   badge: BADGE_VIOLET, Icon: Sparkles },
  ],
  skills: [
    { id: 'formation',          title: 'Formation',          desc: 'Anatomie, bonnes pratiques, Superpowers', badge: BADGE_BLUE,   Icon: BookOpen },
    { id: 'ressources-buildrs', title: 'Ressources Buildrs', desc: '70+ skills avec commandes',               badge: BADGE_GREEN,  Icon: Package  },
    { id: 'generateur',         title: 'Générateur',         desc: 'Crée un skill custom en 4 étapes',        badge: BADGE_VIOLET, Icon: Sparkles },
  ],
  'mcp-connecteurs': [
    { id: 'formation',          title: 'Formation',          desc: 'MCP servers + connecteurs Claude.ai',      badge: BADGE_BLUE,   Icon: BookOpen },
    { id: 'ressources-buildrs', title: 'Ressources Buildrs', desc: 'Tous les MCP et connecteurs Buildrs',      badge: BADGE_GREEN,  Icon: Package  },
    { id: 'generateur',         title: 'Générateur',         desc: 'Recommande les MCPs selon ton projet',     badge: BADGE_VIOLET, Icon: Sparkles },
  ],
  plugins: [
    { id: 'formation',          title: 'Formation',          desc: "C'est quoi un plugin, marketplaces", badge: BADGE_BLUE,  Icon: BookOpen },
    { id: 'ressources-buildrs', title: 'Ressources Buildrs', desc: '22 plugins avec commandes',          badge: BADGE_GREEN, Icon: Package  },
  ],
  'team-agents': [
    { id: 'formation',  title: 'Formation',  desc: "Orchestrer une équipe d'agents IA", badge: BADGE_BLUE,   Icon: BookOpen },
    { id: 'generateur', title: 'Générateur', desc: 'Configure une équipe en 4 étapes',  badge: BADGE_VIOLET, Icon: Sparkles },
  ],
}

// ── Placeholder sub-page ──────────────────────────────────────────────────────

// Generic placeholder — works for direct pages (level-2) and sub-cards (level-3)
function PagePlaceholder({
  title, desc, badge, Icon, backPath, navigate, isBeta,
}: {
  title: string
  desc: string
  badge: BadgeDef
  Icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>
  backPath: string
  navigate: (hash: string) => void
  isBeta: boolean
}) {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-3xl mx-auto px-6 py-8">
        <button
          onClick={() => navigate(backPath)}
          className="flex items-center gap-2 text-sm mb-8 transition-opacity hover:opacity-70"
          style={{ color: '#9399b2' }}
        >
          <ArrowLeft size={14} strokeWidth={1.5} />
          <span>Retour</span>
        </button>
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: badge.bg, border: `0.5px solid ${badge.border}` }}
            >
              <Icon size={18} strokeWidth={1.5} style={{ color: badge.color }} />
            </div>
            <div>
              <span
                className="text-[9px] font-bold uppercase tracking-[0.1em] block mb-0.5"
                style={{ color: badge.color }}
              >
                {badge.label}
              </span>
              <h1 className="text-xl font-extrabold" style={{ color: '#f0f0f5', letterSpacing: '-0.03em' }}>
                {title}
              </h1>
            </div>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: '#9399b2' }}>{desc}</p>
        </div>
        <div
          className="rounded-2xl flex flex-col items-center justify-center text-center py-16 px-8"
          style={{ background: 'rgba(255,255,255,0.02)', border: '0.5px solid rgba(255,255,255,0.08)' }}
        >
          <Construction size={32} strokeWidth={1.5} style={{ color: '#5b6078', marginBottom: 16 }} />
          <p className="font-bold mb-2" style={{ color: '#f0f0f5', letterSpacing: '-0.02em' }}>
            Section en construction
          </p>
          {isBeta ? (
            <p className="text-sm" style={{ color: '#22c55e' }}>
              Accès bêta actif — contenu disponible très prochainement.
            </p>
          ) : (
            <p className="text-sm" style={{ color: '#5b6078' }}>
              Ce contenu sera disponible avec la V3 le 07.04.2026.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

// Hub page — shows sub-cards for apprendre cards that have children
function HubPage({
  tabId, cardId, navigate, isBeta,
}: {
  tabId: TabId
  cardId: string
  navigate: (hash: string) => void
  isBeta: boolean
}) {
  const parentCard = CARDS[tabId]?.find(c => c.id === cardId)
  const hubCards = HUBS[cardId] ?? []

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <button
          onClick={() => navigate(`#/dashboard/claude-os/${tabId}`)}
          className="flex items-center gap-2 text-sm mb-8 transition-opacity hover:opacity-70"
          style={{ color: '#9399b2' }}
        >
          <ArrowLeft size={14} strokeWidth={1.5} />
          <span>Retour</span>
        </button>

        {/* Parent card header */}
        {parentCard && (
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: parentCard.badges[0].bg, border: `0.5px solid ${parentCard.badges[0].border}` }}
              >
                <parentCard.Icon size={18} strokeWidth={1.5} style={{ color: parentCard.badges[0].color }} />
              </div>
              <div>
                <span
                  className="text-[9px] font-bold uppercase tracking-[0.1em] block mb-0.5"
                  style={{ color: parentCard.badges[0].color }}
                >
                  {parentCard.badges[0].label}
                </span>
                <h1 className="text-xl font-extrabold" style={{ color: '#f0f0f5', letterSpacing: '-0.03em' }}>
                  {parentCard.title}
                </h1>
              </div>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: '#9399b2' }}>{parentCard.desc}</p>
          </div>
        )}

        {/* Sub-cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {hubCards.map(sub => (
            <button
              key={sub.id}
              onClick={() => navigate(`#/dashboard/claude-os/${tabId}/${cardId}/${sub.id}`)}
              className="group text-left rounded-xl p-4 transition-all duration-150 hover:border-foreground/20"
              style={{ background: 'hsl(var(--card))', border: '0.5px solid hsl(var(--border))' }}
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-150 group-hover:scale-105"
                  style={{ background: sub.badge.bg, border: `0.5px solid ${sub.badge.border}` }}
                >
                  <sub.Icon size={16} strokeWidth={1.5} style={{ color: sub.badge.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    <p className="text-[13px] font-semibold text-foreground" style={{ letterSpacing: '-0.01em' }}>
                      {sub.title}
                    </p>
                    <span
                      className="text-[8px] font-bold px-1.5 py-0.5 rounded flex-shrink-0"
                      style={{ background: sub.badge.bg, color: sub.badge.color, border: `0.5px solid ${sub.badge.border}` }}
                    >
                      {sub.badge.label.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">{sub.desc}</p>
                </div>
                <ChevronRight
                  size={14}
                  strokeWidth={1.5}
                  className="flex-shrink-0 text-muted-foreground/30 group-hover:text-muted-foreground/60 transition-colors mt-0.5"
                />
              </div>
            </button>
          ))}
        </div>

        {/* Coming soon notice */}
        {!isBeta && (
          <div
            className="mt-6 rounded-xl px-5 py-4 text-center"
            style={{ background: 'rgba(139,92,246,0.05)', border: '0.5px solid rgba(139,92,246,0.2)' }}
          >
            <p className="text-[11px]" style={{ color: '#8b5cf6' }}>
              Contenu disponible avec la V3 le 07.04.2026.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Beta access ───────────────────────────────────────────────────────────────

const BETA_ACCESS = ['mehdib@gmail.com']

// ── Main page ─────────────────────────────────────────────────────────────────

interface Props {
  subPath: string
  navigate: (hash: string) => void
  userEmail?: string | undefined
}

export function ClaudeOSPage({ subPath, navigate, userEmail }: Props) {
  const isBeta = BETA_ACCESS.includes(userEmail ?? '')
  // Parse subPath → up to 3 levels: tabId / cardId / subCardId
  const parts = subPath.split('/').filter(Boolean)
  const pathTab = parts[0] as TabId | undefined
  const pathCard = parts[1]
  const pathSub = parts[2]

  // Level 3: sub-card inside a hub (e.g. apprendre/prompts/formation)
  if (pathTab && pathCard && pathSub) {
    const subCard = HUBS[pathCard]?.find(c => c.id === pathSub)
    if (subCard) {
      return (
        <PagePlaceholder
          title={subCard.title}
          desc={subCard.desc}
          badge={subCard.badge}
          Icon={subCard.Icon}
          backPath={`#/dashboard/claude-os/${pathTab}/${pathCard}`}
          navigate={navigate}
          isBeta={isBeta}
        />
      )
    }
  }

  // Level 2: hub page (card has sub-cards) e.g. apprendre/prompts
  if (pathTab && pathCard && HUBS[pathCard]) {
    return (
      <HubPage
        tabId={pathTab}
        cardId={pathCard}
        navigate={navigate}
        isBeta={isBeta}
      />
    )
  }

  // Level 2: direct placeholder (no hub) e.g. apprendre/claude-code
  if (pathTab && pathCard && CARDS[pathTab as TabId]) {
    const card = CARDS[pathTab as TabId]?.find(c => c.id === pathCard)
    if (card) {
      return (
        <PagePlaceholder
          title={card.title}
          desc={card.desc}
          badge={card.badges[0]}
          Icon={card.Icon}
          backPath={`#/dashboard/claude-os/${pathTab}`}
          navigate={navigate}
          isBeta={isBeta}
        />
      )
    }
  }

  // Default active tab
  const validTab = pathTab && TABS.find(t => t.id === pathTab) ? pathTab : 'apprendre'
  const [activeTab, setActiveTab] = useState<TabId>(validTab)

  const goTab = (tab: TabId) => {
    setActiveTab(tab)
    navigate(`#/dashboard/claude-os/${tab}`)
  }

  const goCard = (tab: TabId, cardId: string) => {
    navigate(`#/dashboard/claude-os/${tab}/${cardId}`)
  }

  const cards = CARDS[activeTab]

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-4xl mx-auto px-6 py-8">

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <ClaudeIcon size={20} />
            <h1
              className="text-2xl font-extrabold text-foreground"
              style={{ letterSpacing: '-0.03em' }}
            >
              Claude OS
            </h1>
            {isBeta ? (
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(34,197,94,0.15)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.3)' }}
              >
                BÊTA
              </span>
            ) : (
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(139,92,246,0.15)', color: '#8b5cf6', border: '1px solid rgba(139,92,246,0.3)' }}
              >
                V3
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-xl">
            L'arsenal complet pour builder des SaaS rentables avec Claude.
            Le même setup qu'on utilise pour générer du MRR.
          </p>
        </div>

        {/* ── Tab bar ────────────────────────────────────────────────────── */}
        <div
          className="flex gap-1 mb-6 p-1 rounded-xl"
          style={{ background: 'hsl(var(--secondary))', border: '0.5px solid hsl(var(--border))' }}
        >
          {TABS.map(({ id, label, Icon }) => {
            const active = activeTab === id
            return (
              <button
                key={id}
                onClick={() => goTab(id)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[12px] font-semibold transition-all duration-150"
                style={{
                  background: active ? 'hsl(var(--background))' : 'transparent',
                  color: active ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))',
                  boxShadow: active ? '0 1px 3px rgba(0,0,0,0.2)' : 'none',
                  letterSpacing: '-0.01em',
                }}
              >
                <Icon size={12} strokeWidth={1.5} />
                <span className="hidden sm:inline">{label}</span>
              </button>
            )
          })}
        </div>

        {/* ── Cards grid ─────────────────────────────────────────────────── */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 gap-3"
        >
          {cards.map(card => (
            <button
              key={card.id}
              onClick={() => goCard(activeTab, card.id)}
              className="group text-left rounded-xl p-4 transition-all duration-150 hover:border-foreground/20"
              style={{
                background: 'hsl(var(--card))',
                border: '0.5px solid hsl(var(--border))',
              }}
            >
              <div className="flex items-start gap-3">
                {/* Icon */}
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-150 group-hover:scale-105"
                  style={{ background: card.badges[0].bg, border: `0.5px solid ${card.badges[0].border}` }}
                >
                  <card.Icon size={16} strokeWidth={1.5} style={{ color: card.badges[0].color }} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                    <p className="text-[13px] font-semibold text-foreground" style={{ letterSpacing: '-0.01em' }}>
                      {card.title}
                    </p>
                    {card.badges.map(b => (
                      <span
                        key={b.label}
                        className="text-[8px] font-bold px-1.5 py-0.5 rounded flex-shrink-0"
                        style={{
                          background: b.bg,
                          color: b.color,
                          border: `0.5px solid ${b.border}`,
                        }}
                      >
                        {b.label.toUpperCase()}
                      </span>
                    ))}
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    {card.desc}
                  </p>
                </div>

                {/* Arrow */}
                <ChevronRight
                  size={14}
                  strokeWidth={1.5}
                  className="flex-shrink-0 text-muted-foreground/30 group-hover:text-muted-foreground/60 transition-colors mt-0.5"
                />
              </div>
            </button>
          ))}
        </div>

        {/* ── Coming soon / beta notice ───────────────────────────────────── */}
        {isBeta ? (
          <div
            className="mt-6 rounded-xl px-5 py-4 text-center"
            style={{ background: 'rgba(34,197,94,0.05)', border: '0.5px solid rgba(34,197,94,0.2)' }}
          >
            <p className="text-[11px]" style={{ color: '#22c55e' }}>
              <span className="font-bold">Accès bêta actif</span>
              {' '}— Tu es parmi les premiers à explorer Claude OS. Contenu en cours de déploiement.
            </p>
          </div>
        ) : (
          <div
            className="mt-6 rounded-xl px-5 py-4 text-center"
            style={{ background: 'rgba(139,92,246,0.05)', border: '0.5px solid rgba(139,92,246,0.2)' }}
          >
            <p className="text-[11px]" style={{ color: '#8b5cf6' }}>
              <span className="font-bold">Claude OS arrive le 07.04.2026</span>
              {' '}— Contenu complet disponible avec la V3.
            </p>
          </div>
        )}

      </div>
    </div>
  )
}
