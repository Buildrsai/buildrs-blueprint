import { useState } from 'react'
import {
  BookOpen, Package, Sparkles, Zap, ArrowLeft, ChevronRight,
  Layers, Terminal, FileCode, Settings, Cpu, Code,
  Bot, Plug, Wrench, Star, Rocket, Copy, Mail,
  MessageSquare, GitBranch, Bug, Brain, Construction,
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

// ── Cards per tab ─────────────────────────────────────────────────────────────

const CARDS: Record<TabId, CardDef[]> = {
  apprendre: [
    {
      id: '3-couches',
      title: 'Les 3 Couches',
      desc: 'Plugins, MCP Servers et Skills — comprendre la structure avant d\'installer quoi que ce soit.',
      badge: BADGE_BLUE,
      Icon: Layers,
    },
    {
      id: 'framework',
      title: 'Le Framework Buildrs',
      desc: 'Le process en 10 étapes pour construire un SaaS de l\'idée au MRR avec Claude.',
      badge: BADGE_BLUE,
      Icon: GitBranch,
    },
    {
      id: 'claude-md',
      title: 'CLAUDE.md Parfait',
      desc: 'Structure et template du CLAUDE.md Buildrs. La mémoire permanente de ton projet.',
      badge: BADGE_GREEN,
      Icon: FileCode,
    },
    {
      id: 'system-prompt',
      title: 'System Prompt Buildrs',
      desc: 'Le template de system prompt utilisé par Alfred pour chaque nouveau projet SaaS.',
      badge: BADGE_GREEN,
      Icon: Terminal,
    },
    {
      id: 'slash-commands',
      title: 'Slash Commands',
      desc: 'Référence complète de toutes les commandes slash disponibles dans l\'environnement Buildrs.',
      badge: BADGE_BLUE,
      Icon: Code,
    },
    {
      id: 'plan-mode',
      title: 'Plan Mode & Opus',
      desc: 'Quand utiliser Plan Mode vs Sonnet vs Opus. Gestion des modèles selon la complexité.',
      badge: BADGE_BLUE,
      Icon: Brain,
    },
    {
      id: 'bonnes-pratiques',
      title: 'Bonnes Pratiques',
      desc: 'Les règles qui évitent 80% des bugs et 90% du code spaghetti. Obligatoire avant de builder.',
      badge: BADGE_GREEN,
      Icon: Star,
    },
    {
      id: 'glossaire',
      title: 'Glossaire Claude Code',
      desc: 'Tous les termes techniques en une page. De "context window" à "tool use".',
      badge: BADGE_BLUE,
      Icon: BookOpen,
    },
  ],

  equiper: [
    {
      id: 'marketplaces',
      title: 'Marketplaces',
      desc: 'Les 4 repos GitHub à ajouter en priorité. Le point de départ obligatoire de tout setup.',
      badge: BADGE_GREEN,
      Icon: Package,
    },
    {
      id: 'plugins',
      title: 'Plugins Essentiels',
      desc: 'Superpowers, Frontend Design, Feature Dev, Code Review, Security — les 8 plugins du stack.',
      badge: BADGE_GREEN,
      Icon: Plug,
    },
    {
      id: 'mcp-servers',
      title: 'MCP Servers',
      desc: 'Vercel, Supabase, Stripe, GitHub, Figma, Linear, PostHog — accès directs aux outils.',
      badge: BADGE_GREEN,
      Icon: Cpu,
    },
    {
      id: 'skills-design',
      title: 'Skills Design',
      desc: 'UI/UX Pro Max, Design System Buildrs et les skills qui font de Claude un designer senior.',
      badge: BADGE_GREEN,
      Icon: Wrench,
    },
    {
      id: 'skills-vercel',
      title: 'Skills Vercel',
      desc: 'Deploy, bootstrap, env, AI SDK, Next.js, Workflow DevKit — l\'écosystème Vercel complet.',
      badge: BADGE_GREEN,
      Icon: Rocket,
    },
    {
      id: 'checklist',
      title: "Checklist d'Installation",
      desc: 'La séquence d\'installation dans le bon ordre. 21 étapes de la première marketplace au dernier skill.',
      badge: BADGE_GREEN,
      Icon: Settings,
    },
  ],

  generer: [
    {
      id: 'mvp-72h',
      title: 'MVP Complet en 72h',
      desc: 'La suite de prompts complète pour aller de l\'idée validée au SaaS live en 72 heures.',
      badge: BADGE_VIOLET,
      Icon: Rocket,
    },
    {
      id: 'architecture',
      title: 'Architecture & CLAUDE.md',
      desc: 'Génère automatiquement le schéma Supabase, les RLS policies et le CLAUDE.md de ton projet.',
      badge: BADGE_VIOLET,
      Icon: Cpu,
    },
    {
      id: 'landing-page',
      title: 'Landing Page',
      desc: 'Prompt pour générer la landing page complète de ton SaaS — accroche, features, pricing, FAQ.',
      badge: BADGE_VIOLET,
      Icon: Code,
    },
    {
      id: 'prompts-buildrs',
      title: 'Prompts Buildrs',
      desc: 'La bibliothèque de prompts optimisés pour chaque étape du build. Validés en production.',
      badge: BADGE_VIOLET,
      Icon: Copy,
    },
    {
      id: 'emails-sequences',
      title: 'Emails & Séquences',
      desc: 'Génère ta séquence d\'emails post-achat, de relance et de rétention. Ton Resend setup prêt.',
      badge: BADGE_VIOLET,
      Icon: Mail,
    },
  ],

  hacks: [
    {
      id: 'mobile',
      title: 'Pilotage Mobile',
      desc: 'Connecte Telegram ou Discord pour piloter Claude Code depuis ton téléphone, où que tu sois.',
      badge: BADGE_BLUE,
      Icon: MessageSquare,
    },
    {
      id: 'agents-paralleles',
      title: 'Agents Parallèles',
      desc: 'Lancer plusieurs instances Claude en parallèle sur des tâches indépendantes. Multiplier la vitesse.',
      badge: BADGE_BLUE,
      Icon: Bot,
    },
    {
      id: 'debug',
      title: 'Debugging Scientifique',
      desc: 'La méthode Superpowers : hypothèse → test → fix. Jamais de panique, toujours une méthode.',
      badge: BADGE_BLUE,
      Icon: Bug,
    },
    {
      id: 'memoire',
      title: 'Mémoire Persistante',
      desc: 'Auto Memory, CLAUDE.md, et les patterns qui font que Claude ne perd jamais le contexte projet.',
      badge: BADGE_BLUE,
      Icon: Brain,
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

// ── Placeholder sub-page ──────────────────────────────────────────────────────

function SubPagePlaceholder({
  tabId,
  cardId,
  navigate,
  isBeta,
}: {
  tabId: TabId
  cardId: string
  navigate: (hash: string) => void
  isBeta: boolean
}) {
  const cards = CARDS[tabId]
  const card = cards?.find(c => c.id === cardId)

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-3xl mx-auto px-6 py-8">
        {/* Back */}
        <button
          onClick={() => navigate(`#/dashboard/claude-os/${tabId}`)}
          className="flex items-center gap-2 text-sm mb-8 transition-opacity hover:opacity-70"
          style={{ color: '#9399b2' }}
        >
          <ArrowLeft size={14} strokeWidth={1.5} />
          <span>Retour</span>
        </button>

        {/* Header */}
        {card && (
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: card.badge.bg, border: `0.5px solid ${card.badge.border}` }}
              >
                <card.Icon size={18} strokeWidth={1.5} style={{ color: card.badge.color }} />
              </div>
              <div>
                <span
                  className="text-[9px] font-bold uppercase tracking-[0.1em] block mb-0.5"
                  style={{ color: card.badge.color }}
                >
                  {card.badge.label}
                </span>
                <h1
                  className="text-xl font-extrabold"
                  style={{ color: '#f0f0f5', letterSpacing: '-0.03em' }}
                >
                  {card.title}
                </h1>
              </div>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: '#9399b2' }}>
              {card.desc}
            </p>
          </div>
        )}

        {/* Placeholder */}
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
  // Parse subPath → tabId + cardId
  // subPath examples: '', 'apprendre', 'apprendre/3-couches', 'equiper/plugins'
  const parts = subPath.split('/').filter(Boolean)
  const pathTab = parts[0] as TabId | undefined
  const pathCard = parts[1]

  // If card sub-page requested
  if (pathTab && pathCard && CARDS[pathTab]) {
    return (
      <SubPagePlaceholder
        tabId={pathTab}
        cardId={pathCard}
        navigate={navigate}
        isBeta={isBeta}
      />
    )
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
            L'environnement Claude Code tel qu'Alfred l'utilise chez Buildrs.
            Installation, maîtrise, et les hacks qui changent tout.
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
                  style={{ background: card.badge.bg, border: `0.5px solid ${card.badge.border}` }}
                >
                  <card.Icon size={16} strokeWidth={1.5} style={{ color: card.badge.color }} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <p className="text-[13px] font-semibold text-foreground" style={{ letterSpacing: '-0.01em' }}>
                      {card.title}
                    </p>
                    <span
                      className="text-[8px] font-bold px-1.5 py-0.5 rounded flex-shrink-0"
                      style={{
                        background: card.badge.bg,
                        color: card.badge.color,
                        border: `0.5px solid ${card.badge.border}`,
                      }}
                    >
                      {card.badge.label.toUpperCase()}
                    </span>
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
