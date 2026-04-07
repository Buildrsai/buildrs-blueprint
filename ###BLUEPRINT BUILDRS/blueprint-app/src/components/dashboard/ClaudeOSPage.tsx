import { useState, useRef, useEffect } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import {
  BookOpen, Package, Sparkles, Zap, ArrowLeft, ChevronRight,
  Terminal, FileCode, Settings, Cpu,
  Bot, Plug, Wrench, Rocket, Copy, Mail,
  MessageSquare, Bug, Brain, Construction, Monitor, Users,
  CheckCircle2, Circle, ExternalLink, ListChecks, Lock, X,
} from 'lucide-react'
import { ClaudeIcon, BuildrsIcon } from '../ui/icons'
import { PromptsFormationPage } from './content/PromptsFormationPage'
import { PromptGeneratorPage } from './content/PromptGeneratorPage'
import { ClaudeCodeFormationPage } from './content/ClaudeCodeFormationPage'
import { ClaudeCoworkFormationPage } from './content/ClaudeCoworkFormationPage'
import { ClaudeMdFormationPage } from './content/ClaudeMdFormationPage'
import { ClaudeMdGeneratorPage } from './content/ClaudeMdGeneratorPage'
import { SkillsFormationPage } from './content/SkillsFormationPage'
import { SkillsRessourcesPage } from './content/SkillsRessourcesPage'
import { SkillsGeneratorPage } from './content/SkillsGeneratorPage'
import { McpFormationPage } from './content/McpFormationPage'
import { McpRessourcesPage } from './content/McpRessourcesPage'
import { McpGeneratorPage } from './content/McpGeneratorPage'
import { TeamAgentsFormationPage } from './content/TeamAgentsFormationPage'
import { TeamAgentsGeneratorPage } from './content/TeamAgentsGeneratorPage'
import { PluginsFormationPage } from './content/PluginsFormationPage'
import { PluginsRessourcesPage } from './content/PluginsRessourcesPage'
import { CheatsheetPage } from './content/CheatsheetPage'

// ── Types ─────────────────────────────────────────────────────────────────────

type TabId = 'installer' | 'apprendre' | 'equiper' | 'generer' | 'hacks'

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
  logoSrc?: string
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
const BADGE_TOOL_PROMPTS: BadgeDef = { label: 'PROMPTS', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.25)' }
const BADGE_TOOL_CLAUDEMD: BadgeDef = { label: 'CLAUDE.MD', color: '#8b5cf6', bg: 'rgba(139,92,246,0.12)', border: 'rgba(139,92,246,0.25)' }
const BADGE_TOOL_SKILLS: BadgeDef = { label: 'SKILLS', color: '#22c55e', bg: 'rgba(34,197,94,0.12)', border: 'rgba(34,197,94,0.25)' }
const BADGE_TOOL_MCP: BadgeDef = { label: 'MCP & CONNECTEURS', color: '#4d96ff', bg: 'rgba(77,150,255,0.12)', border: 'rgba(77,150,255,0.25)' }
const BADGE_TOOL_PLUGINS: BadgeDef = { label: 'PLUGINS', color: '#06b6d4', bg: 'rgba(6,182,212,0.12)', border: 'rgba(6,182,212,0.25)' }
const BADGE_TOOL_TEAMAGENTS: BadgeDef = { label: 'TEAM AGENTS', color: '#ec4899', bg: 'rgba(236,72,153,0.12)', border: 'rgba(236,72,153,0.25)' }
const BADGE_DEFAULT: BadgeDef = { label: '', color: '#9399b2', bg: 'rgba(147,153,178,0.08)', border: 'rgba(147,153,178,0.18)' }

// Installer tab badges
const BADGE_CLAUDE_PRO: BadgeDef    = { label: 'CLAUDE PRO',    color: '#f59e0b', bg: 'rgba(245,158,11,0.12)',  border: 'rgba(245,158,11,0.25)'  }
const BADGE_CLAUDE_APP: BadgeDef    = { label: 'CLAUDE APP',    color: '#4d96ff', bg: 'rgba(77,150,255,0.12)', border: 'rgba(77,150,255,0.25)'  }
const BADGE_PARAMETRES: BadgeDef    = { label: 'PARAMÈTRES',    color: '#94a3b8', bg: 'rgba(148,163,184,0.1)', border: 'rgba(148,163,184,0.2)'  }
const BADGE_CONNECTEURS: BadgeDef   = { label: 'CONNECTEURS',   color: '#4d96ff', bg: 'rgba(77,150,255,0.12)', border: 'rgba(77,150,255,0.25)'  }
const BADGE_CHROME: BadgeDef        = { label: 'CHROME',        color: '#22c55e', bg: 'rgba(34,197,94,0.12)',  border: 'rgba(34,197,94,0.25)'   }
const BADGE_CLAUDE_CODE: BadgeDef   = { label: 'CLAUDE CODE',   color: '#9333ea', bg: 'rgba(147,51,234,0.12)', border: 'rgba(147,51,234,0.25)'  }
const BADGE_MCP_SERVEURS: BadgeDef  = { label: 'MCP SERVEURS',  color: '#4d96ff', bg: 'rgba(77,150,255,0.12)', border: 'rgba(77,150,255,0.25)'  }

// ── Installer steps ───────────────────────────────────────────────────────────

interface InstallerStep {
  n: number
  badge: BadgeDef
  title: string
  desc: string
  href: string
  external?: boolean
}

const INSTALLER_STEPS: InstallerStep[] = [
  { n: 1,  badge: BADGE_CLAUDE_PRO,   title: "Souscris à un abonnement Claude",           desc: "Le minimum c'est le plan Pro à 20$/mois.",                         href: 'https://claude.ai/pricing',             external: true  },
  { n: 2,  badge: BADGE_CLAUDE_APP,   title: "Installe Claude sur ton ordi et ton mobile", desc: "Desktop (Mac/Windows) + app mobile (iOS/Android).",                href: 'https://claude.ai/download',            external: true  },
  { n: 3,  badge: BADGE_PARAMETRES,   title: "Configure Claude",                           desc: "Compte, confidentialité, capacités, préférences.",                 href: 'https://claude.ai/settings',            external: true  },
  { n: 4,  badge: BADGE_CONNECTEURS,  title: "Branche tes outils dans Claude",             desc: "Supabase, Vercel, Stripe, GitHub, Notion — en 1 clic.",            href: '#/dashboard/claude-os/equiper/bibliotheque-mcp'         },
  { n: 5,  badge: BADGE_CHROME,       title: "Installe l'extension Claude dans Chrome",    desc: "Claude directement dans ton navigateur.",                          href: 'https://chromewebstore.google.com/detail/claude-ai/ghbhobofbbmgomidgkocebghdamonnfp', external: true },
  { n: 6,  badge: BADGE_CLAUDE_CODE,  title: "Installe Claude Code dans VS Code",           desc: "Extension VS Code. 3 clics, c'est parti.",                        href: '#/dashboard/claude-os/apprendre/claude-code'            },
  { n: 7,  badge: BADGE_TOOL_PLUGINS, title: "Installe tous les plugins",                  desc: "22 plugins en copier-coller. 10 minutes.",                         href: '#/dashboard/claude-os/equiper/bibliotheque-plugins'     },
  { n: 8,  badge: BADGE_TOOL_SKILLS,  title: "Installe les skills recommandés",            desc: "GStack + skills custom Buildrs.",                                  href: '#/dashboard/claude-os/equiper/bibliotheque-skills'      },
  { n: 9,  badge: BADGE_TOOL_CLAUDEMD,title: "Crée ton CLAUDE.md de projet",              desc: "La mémoire de ton projet. Le fichier le plus important.",          href: '#/dashboard/claude-os/generer/generateur-claude-md'     },
  { n: 10, badge: BADGE_MCP_SERVEURS, title: "Connecte les MCP servers dans Claude Code",  desc: "Supabase MCP, Playwright, GitHub, Fetch.",                         href: '#/dashboard/claude-os/equiper/bibliotheque-mcp'         },
  { n: 11, badge: BADGE_TOOL_PROMPTS, title: "Crée ton prompt système",                    desc: "Le prompt que Claude lit à chaque session.",                       href: '#/dashboard/claude-os/generer/generateur-prompt-parfait' },
  { n: 12, badge: BADGE_TOOL_TEAMAGENTS, title: "Configure tes agents IA",                desc: "Quand tu es prêt pour le multi-agents.",                           href: '#/dashboard/claude-os/generer/generateur-team-agents'   },
]

// ── Cards per tab ─────────────────────────────────────────────────────────────

const CARDS: Record<TabId, CardDef[]> = {
  installer: [], // handled by InstallerTab component
  apprendre: [
    {
      id: 'claude-code',
      title: 'Claude Code',
      desc: "Ton terminal qui code, déploie et debug.",
      badges: [],
      Icon: ClaudeIcon,
      logoSrc: '/Claude Code Logo.png',
    },
    {
      id: 'claude-cowork',
      title: 'Claude Cowork',
      desc: "L'agent qui gère ton business pendant que tu build.",
      badges: [],
      Icon: Monitor,
      logoSrc: '/Claude Cowork Logo.jpg',
    },
    {
      id: 'prompts',
      title: 'Maîtrise tes prompts',
      desc: "La compétence n°1. Bon prompt = résultat 10x.",
      badges: [BADGE_TOOL_PROMPTS],
      Icon: Terminal,
      logoSrc: 'buildrs',
    },
    {
      id: 'claude-md',
      title: 'Active la mémoire projet',
      desc: "Sans ça, Claude oublie tout. Avec, il connaît ton projet.",
      badges: [BADGE_TOOL_CLAUDEMD],
      Icon: FileCode,
      logoSrc: 'buildrs',
    },
    {
      id: 'skills',
      title: 'Crée tes commandes',
      desc: "Tes workflows en une commande. /deploy, /ship — c'est fait.",
      badges: [BADGE_TOOL_SKILLS],
      Icon: Wrench,
      logoSrc: 'buildrs',
    },
    {
      id: 'mcp-connecteurs',
      title: 'Connecte tes outils',
      desc: "Claude agit dans Supabase, Vercel, Stripe. Zéro copier-coller.",
      badges: [BADGE_TOOL_MCP],
      Icon: Plug,
      logoSrc: 'buildrs',
    },
    {
      id: 'plugins',
      title: 'Supercharge Claude',
      desc: "22 packages prêts. Installés en 10 min.",
      badges: [BADGE_TOOL_PLUGINS],
      Icon: Package,
      logoSrc: 'buildrs',
    },
    {
      id: 'team-agents',
      title: 'Lance ton équipe IA',
      desc: "3 Claude en parallèle. Le CTO que t'as pas encore.",
      badges: [BADGE_TOOL_TEAMAGENTS],
      Icon: Users,
      logoSrc: 'buildrs',
    },
  ],

  equiper: [
    {
      id: 'bibliotheque-skills',
      title: 'Bibliothèque Skills',
      desc: '70+ skills avec commandes d\'installation.',
      badges: [BADGE_TOOL_SKILLS],
      Icon: BookOpen,
      logoSrc: 'buildrs',
    },
    {
      id: 'bibliotheque-plugins',
      title: 'Bibliothèque Plugins',
      desc: '22 plugins. Commande copier-coller pour chaque.',
      badges: [BADGE_TOOL_PLUGINS],
      Icon: Package,
      logoSrc: 'buildrs',
    },
    {
      id: 'bibliotheque-mcp',
      title: 'Bibliothèque MCP & Connecteurs',
      desc: 'MCP servers + connecteurs Claude.ai. Tout le setup.',
      badges: [BADGE_TOOL_MCP],
      Icon: Plug,
      logoSrc: 'buildrs',
    },
    {
      id: 'cheatsheet-commandes',
      title: 'Cheatsheet Commandes',
      desc: '80+ commandes organisées par situation.',
      badges: [BADGE_CLAUDE_CODE],
      Icon: Terminal,
      logoSrc: 'buildrs',
    },
  ],

  generer: [
    {
      id: 'generateur-prompt-parfait',
      title: 'Générateur Prompt Parfait',
      desc: 'Crée ton system prompt personnalisé en 5 étapes.',
      badges: [BADGE_TOOL_PROMPTS],
      Icon: Sparkles,
      logoSrc: 'buildrs',
    },
    {
      id: 'generateur-claude-md',
      title: 'Générateur CLAUDE.md',
      desc: 'Crée la mémoire de ton projet en 6 étapes.',
      badges: [BADGE_TOOL_CLAUDEMD],
      Icon: FileCode,
      logoSrc: 'buildrs',
    },
    {
      id: 'generateur-skills',
      title: 'Générateur Skills',
      desc: 'Crée un skill custom en 4 étapes.',
      badges: [BADGE_TOOL_SKILLS],
      Icon: Wrench,
      logoSrc: 'buildrs',
    },
    {
      id: 'generateur-mcp',
      title: 'Générateur MCP',
      desc: 'Recommande les MCPs selon ton type de projet.',
      badges: [BADGE_TOOL_MCP],
      Icon: Cpu,
      logoSrc: 'buildrs',
    },
    {
      id: 'generateur-team-agents',
      title: 'Générateur Team Agents',
      desc: "Configure une équipe d'agents en 4 étapes.",
      badges: [BADGE_TOOL_TEAMAGENTS],
      Icon: Bot,
      logoSrc: 'buildrs',
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
  { id: 'installer', label: 'Installer', Icon: ListChecks },
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
          onClick={() => window.history.back()}
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

// ── Installer tab ─────────────────────────────────────────────────────────────

function InstallerTab({ navigate, onLocked }: { navigate: (hash: string) => void; onLocked?: () => void }) {
  const [checked, setChecked] = useState<Set<number>>(new Set())
  const toggle = (n: number) => setChecked(prev => {
    const next = new Set(prev)
    next.has(n) ? next.delete(n) : next.add(n)
    return next
  })
  const done = checked.size
  const total = INSTALLER_STEPS.length
  const pct = Math.round((done / total) * 100)

  const handleClick = (step: InstallerStep) => {
    if (onLocked) { onLocked(); return }
    if (step.external) {
      window.open(step.href, '_blank', 'noopener noreferrer')
    } else {
      navigate(step.href)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: '#5b6078' }}>
            Progression
          </span>
          <span className="text-[11px] font-bold" style={{ color: done === total ? '#22c55e' : '#e2e8f0' }}>
            {done}/{total} étapes
          </span>
        </div>
        <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${pct}%`,
              background: done === total ? '#22c55e' : 'linear-gradient(90deg, #4d96ff, #8b5cf6)',
            }}
          />
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div
          className="absolute left-[19px] top-4 bottom-4"
          style={{ width: '1px', background: 'rgba(255,255,255,0.07)' }}
        />

        <div className="space-y-3">
          {INSTALLER_STEPS.map((step, idx) => {
            const isDone = checked.has(step.n)
            const isLast = idx === INSTALLER_STEPS.length - 1

            return (
              <div key={step.n} className="relative flex items-start gap-4">
                {/* Step circle — checkbox */}
                <button
                  onClick={() => toggle(step.n)}
                  className="relative z-10 shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 mt-0.5"
                  style={{
                    background: isDone ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${isDone ? 'rgba(34,197,94,0.4)' : 'rgba(255,255,255,0.1)'}`,
                  }}
                >
                  {isDone
                    ? <CheckCircle2 size={16} strokeWidth={2} style={{ color: '#22c55e' }} />
                    : <span className="text-[11px] font-bold" style={{ color: '#5b6078' }}>{step.n}</span>
                  }
                </button>

                {/* Card */}
                <button
                  onClick={() => handleClick(step)}
                  className="group flex-1 text-left rounded-xl px-4 py-3 transition-all duration-150"
                  style={{
                    background: isDone ? 'rgba(34,197,94,0.04)' : 'hsl(var(--card))',
                    border: `0.5px solid ${isDone ? 'rgba(34,197,94,0.2)' : 'hsl(var(--border))'}`,
                  }}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                        <p
                          className="text-[13px] font-semibold"
                          style={{
                            color: isDone ? '#5b6078' : '#e2e8f0',
                            letterSpacing: '-0.01em',
                            textDecoration: isDone ? 'line-through' : 'none',
                          }}
                        >
                          {step.title}
                        </p>
                        <span
                          className="text-[8px] font-bold px-1.5 py-0.5 rounded shrink-0"
                          style={{
                            background: step.badge.bg,
                            color: step.badge.color,
                            border: `0.5px solid ${step.badge.border}`,
                          }}
                        >
                          {step.badge.label}
                        </span>
                      </div>
                      <p className="text-[11px]" style={{ color: isDone ? '#3d4466' : '#5b6078' }}>
                        {step.desc}
                      </p>
                    </div>
                    {step.external
                      ? <ExternalLink size={13} strokeWidth={1.5} className="shrink-0 transition-colors" style={{ color: '#3d4466' }} />
                      : <ChevronRight size={14} strokeWidth={1.5} className="shrink-0 transition-colors" style={{ color: '#3d4466' }} />
                    }
                  </div>
                </button>
              </div>
            )
          })}
        </div>
      </div>

      {/* Done banner */}
      {done === total && (
        <div className="mt-8 rounded-2xl px-6 py-5 text-center"
          style={{ background: 'rgba(34,197,94,0.06)', border: '0.5px solid rgba(34,197,94,0.25)' }}>
          <p className="text-[14px] font-bold mb-1" style={{ color: '#22c55e' }}>Setup complet ✓</p>
          <p className="text-[12px]" style={{ color: '#5b6078' }}>
            Tu es opérationnel. Passe à l'onglet Apprendre pour maîtriser chaque outil.
          </p>
        </div>
      )}
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
          onClick={() => window.history.back()}
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
                style={{ background: (parentCard.badges[0] ?? BADGE_DEFAULT).bg, border: `0.5px solid ${(parentCard.badges[0] ?? BADGE_DEFAULT).border}` }}
              >
                <parentCard.Icon size={18} strokeWidth={1.5} style={{ color: (parentCard.badges[0] ?? BADGE_DEFAULT).color }} />
              </div>
              <div>
                <span
                  className="text-[9px] font-bold uppercase tracking-[0.1em] block mb-0.5"
                  style={{ color: (parentCard.badges[0] ?? BADGE_DEFAULT).color }}
                >
                  {(parentCard.badges[0] ?? BADGE_DEFAULT).label}
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

// ── Main page ─────────────────────────────────────────────────────────────────

interface Props {
  subPath: string
  navigate: (hash: string) => void
  hasClaudeOS?: boolean
  userId?: string
}

// ── Unlock modal ─────────────────────────────────────────────────────────────

const SUPABASE_FN = 'https://ihgbbgwhgmosfjaknvlf.supabase.co/functions/v1'

function UnlockModal({ onClose, userId }: {
  onClose: () => void
  navigate: (h: string) => void
  userId: string
}) {
  const [showCheckout, setShowCheckout] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const mountRef = useRef<HTMLDivElement>(null)
  const checkoutRef = useRef<{ destroy: () => void } | null>(null)

  useEffect(() => {
    return () => { checkoutRef.current?.destroy() }
  }, [])

  const handlePay = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${SUPABASE_FN}/create-ob-checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, origin: window.location.origin }),
      })
      const data = await res.json()
      if (!res.ok || !data.clientSecret) throw new Error(data.error ?? 'Erreur Stripe')
      const stripe = await loadStripe(data.publishableKey)
      if (!stripe) throw new Error('Stripe non disponible')
      checkoutRef.current?.destroy()
      const checkout = await stripe.initEmbeddedCheckout({ clientSecret: data.clientSecret })
      setShowCheckout(true)
      setTimeout(() => {
        if (mountRef.current) {
          checkout.mount(mountRef.current)
          checkoutRef.current = checkout
        }
      }, 50)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)' }}
      onClick={!showCheckout ? onClose : undefined}
    >
      <div
        className="relative w-full rounded-2xl overflow-hidden"
        style={{
          maxWidth: showCheckout ? 560 : 440,
          background: 'hsl(var(--card))',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 32px 80px rgba(0,0,0,0.5)',
          transition: 'max-width 0.3s ease',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 transition-opacity hover:opacity-60"
          style={{ color: 'rgba(255,255,255,0.35)' }}
        >
          <X size={15} strokeWidth={1.5} />
        </button>

        {/* ── Infos produit ── */}
        {!showCheckout && (
          <div className="p-8 flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-6"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)' }}>
              <Lock size={24} strokeWidth={1.5} style={{ color: 'rgba(255,255,255,0.7)' }} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-[0.14em] mb-2 block" style={{ color: 'rgba(255,255,255,0.35)' }}>
              Accès restreint
            </span>
            <h2 className="text-[20px] font-extrabold mb-3" style={{ color: '#f0f0f5', letterSpacing: '-0.03em', lineHeight: 1.2 }}>
              Claude OS
            </h2>
            <p className="text-[13px] leading-relaxed mb-6 max-w-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>
              Inclus dans le <span style={{ color: 'rgba(255,255,255,0.75)', fontWeight: 600 }}>Module Claude</span> — l'add-on à 37€ du Blueprint.
            </p>
            <div className="w-full rounded-xl p-4 mb-6 text-left space-y-2.5"
              style={{ background: 'rgba(255,255,255,0.03)', border: '0.5px solid rgba(255,255,255,0.08)' }}>
              {[
                'Installation complète Claude Code + Claude AI',
                'Formations : CLAUDE.md, Skills, MCP, Plugins',
                'Bibliothèques Buildrs (70+ skills, 22 plugins)',
                'Générateurs IA personnalisés',
                'Cheatsheet 80+ commandes + Hacks avancés',
              ].map(item => (
                <div key={item} className="flex items-center gap-3">
                  <div className="w-3.5 h-3.5 rounded-full shrink-0" style={{ background: 'rgba(255,255,255,0.12)', border: '0.5px solid rgba(255,255,255,0.2)' }} />
                  <span className="text-[12px]" style={{ color: 'rgba(255,255,255,0.5)' }}>{item}</span>
                </div>
              ))}
            </div>
            {error && <p className="text-[12px] mb-3" style={{ color: '#ef4444' }}>{error}</p>}
            <button
              onClick={handlePay}
              disabled={loading}
              className="cta-rainbow w-full py-3.5 rounded-xl text-[14px] font-bold transition-all hover:opacity-90 disabled:opacity-60"
              style={{ background: 'hsl(var(--foreground))', color: 'hsl(var(--background))' }}
            >
              {loading ? 'Connexion...' : 'Débloquer le Module Claude — 37€ →'}
            </button>
          </div>
        )}

        {/* ── Embedded Stripe checkout ── */}
        {showCheckout && (
          <div className="p-6">
            <div className="flex items-center gap-3 mb-5">
              <button
                onClick={() => { checkoutRef.current?.destroy(); checkoutRef.current = null; setShowCheckout(false) }}
                className="transition-opacity hover:opacity-60"
                style={{ color: 'rgba(255,255,255,0.4)' }}
              >
                <ArrowLeft size={14} strokeWidth={1.5} />
              </button>
              <span className="text-[13px] font-semibold" style={{ color: 'rgba(255,255,255,0.7)' }}>Module Claude — 37€</span>
            </div>
            <div ref={mountRef} />
          </div>
        )}
      </div>
    </div>
  )
}

export function ClaudeOSPage({ subPath, navigate, hasClaudeOS = false, userId = '' }: Props) {
  const isBeta = hasClaudeOS

  // Parse subPath → up to 3 levels: tabId / cardId / subCardId
  const parts = subPath.split('/').filter(Boolean)
  const pathTab = parts[0] as TabId | undefined
  const pathCard = parts[1]
  const pathSub = parts[2]

  // Level 3: sub-card inside a hub (e.g. apprendre/prompts/formation)
  if (pathTab && pathCard && pathSub) {
    // Real content pages
    if (pathCard === 'prompts' && pathSub === 'formation') {
      return <PromptsFormationPage navigate={navigate} />
    }
    if (pathCard === 'claude-md' && pathSub === 'formation') {
      return <ClaudeMdFormationPage navigate={navigate} />
    }
    if (pathCard === 'claude-md' && pathSub === 'generateur') {
      return <ClaudeMdGeneratorPage navigate={navigate} />
    }
    if (pathCard === 'skills' && pathSub === 'formation') {
      return <SkillsFormationPage navigate={navigate} />
    }
    if (pathCard === 'skills' && pathSub === 'ressources-buildrs') {
      return <SkillsRessourcesPage navigate={navigate} />
    }
    if (pathCard === 'skills' && pathSub === 'generateur') {
      return <SkillsGeneratorPage navigate={navigate} />
    }
    if (pathCard === 'mcp-connecteurs' && pathSub === 'formation') {
      return <McpFormationPage navigate={navigate} />
    }
    if (pathCard === 'mcp-connecteurs' && pathSub === 'ressources-buildrs') {
      return <McpRessourcesPage navigate={navigate} />
    }
    if (pathCard === 'mcp-connecteurs' && pathSub === 'generateur') {
      return <McpGeneratorPage navigate={navigate} />
    }
    if (pathCard === 'team-agents' && pathSub === 'formation') {
      return <TeamAgentsFormationPage navigate={navigate} />
    }
    if (pathCard === 'team-agents' && pathSub === 'generateur') {
      return <TeamAgentsGeneratorPage navigate={navigate} />
    }
    if (pathCard === 'plugins' && pathSub === 'formation') {
      return <PluginsFormationPage navigate={navigate} />
    }
    if (pathCard === 'plugins' && pathSub === 'ressources-buildrs') {
      return <PluginsRessourcesPage navigate={navigate} />
    }

    // Generic placeholder for all other sub-cards
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

  // Level 2: équiper library pages → reuse apprendre ressources components
  if (pathCard === 'bibliotheque-skills') return <SkillsRessourcesPage navigate={navigate} />
  if (pathCard === 'bibliotheque-plugins') return <PluginsRessourcesPage navigate={navigate} />
  if (pathCard === 'bibliotheque-mcp') return <McpRessourcesPage navigate={navigate} />
  if (pathCard === 'cheatsheet-commandes') return <CheatsheetPage navigate={navigate} />

  // Level 2: real content pages (generators, tools, formations)
  if (pathCard === 'claude-code') {
    return <ClaudeCodeFormationPage navigate={navigate} />
  }
  if (pathCard === 'claude-cowork') {
    return <ClaudeCoworkFormationPage navigate={navigate} />
  }
  if (pathCard === 'generateur-prompt-parfait') {
    return <PromptGeneratorPage navigate={navigate} />
  }
  if (pathCard === 'generateur-team-agents') {
    return <TeamAgentsGeneratorPage navigate={navigate} />
  }
  if (pathCard === 'generateur-claude-md') {
    return <ClaudeMdGeneratorPage navigate={navigate} />
  }
  if (pathCard === 'generateur-skills') {
    return <SkillsGeneratorPage navigate={navigate} />
  }
  if (pathCard === 'generateur-mcp') {
    return <McpGeneratorPage navigate={navigate} />
  }

  // Level 2: direct placeholder (no hub) e.g. apprendre/claude-code
  if (pathTab && pathCard && CARDS[pathTab as TabId]) {
    const card = CARDS[pathTab as TabId]?.find(c => c.id === pathCard)
    if (card) {
      return (
        <PagePlaceholder
          title={card.title}
          desc={card.desc}
          badge={card.badges[0] ?? BADGE_DEFAULT}
          Icon={card.Icon}
          backPath={`#/dashboard/claude-os/${pathTab}`}
          navigate={navigate}
          isBeta={isBeta}
        />
      )
    }
  }

  // Default active tab
  const validTab = pathTab && TABS.find(t => t.id === pathTab) ? pathTab : 'installer'
  const [activeTab, setActiveTab] = useState<TabId>(validTab)
  const [showUnlockModal, setShowUnlockModal] = useState(false)

  const goTab = (tab: TabId) => {
    setActiveTab(tab)
    navigate(`#/dashboard/claude-os/${tab}`)
  }

  const goCard = (tab: TabId, cardId: string) => {
    if (!hasClaudeOS) { setShowUnlockModal(true); return }
    // Apprendre cards with a hub → skip hub, go directly to formation
    if (tab === 'apprendre' && HUBS[cardId]) {
      navigate(`#/dashboard/claude-os/${tab}/${cardId}/formation`)
    } else {
      navigate(`#/dashboard/claude-os/${tab}/${cardId}`)
    }
  }

  const cards = CARDS[activeTab]

  return (
    <div className="flex-1 overflow-y-auto">
      {showUnlockModal && (
        <UnlockModal onClose={() => setShowUnlockModal(false)} navigate={navigate} userId={userId} />
      )}
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

        {/* ── Installer tab (timeline) ────────────────────────────────────── */}
        {activeTab === 'installer' && (
          <InstallerTab
            navigate={navigate}
            onLocked={!hasClaudeOS ? () => setShowUnlockModal(true) : undefined}
          />
        )}

        {/* ── Cards grid ─────────────────────────────────────────────────── */}
        {activeTab !== 'installer' && (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 gap-3"
        >
          {cards.map(card => (
            <button
              key={card.id}
              onClick={() => goCard(activeTab, card.id)}
              className="group text-left rounded-xl p-4 transition-all duration-150 hover:border-foreground/20 relative overflow-hidden"
              style={{
                background: 'hsl(var(--card))',
                border: !hasClaudeOS ? '0.5px solid rgba(255,255,255,0.08)' : '0.5px solid hsl(var(--border))',
                opacity: !hasClaudeOS ? 0.7 : 1,
              }}
            >
              {/* Lock badge on locked cards */}
              {!hasClaudeOS && (
                <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '0.5px solid rgba(255,255,255,0.15)' }}>
                  <Lock size={9} strokeWidth={2} style={{ color: 'rgba(255,255,255,0.4)' }} />
                </div>
              )}
              <div className="flex items-start gap-3">
                {/* Icon */}
                {card.logoSrc === 'buildrs' ? (
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-150 group-hover:scale-105"
                    style={{ background: '#09090b', border: '0.5px solid rgba(255,255,255,0.15)' }}
                  >
                    <BuildrsIcon color="#ffffff" size={18} />
                  </div>
                ) : card.logoSrc ? (
                  <img
                    src={card.logoSrc}
                    alt={card.title}
                    className="w-9 h-9 rounded-lg flex-shrink-0 transition-all duration-150 group-hover:scale-105 object-cover"
                  />
                ) : (
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-150 group-hover:scale-105"
                  style={{ background: (card.badges[0] ?? BADGE_DEFAULT).bg, border: `0.5px solid ${(card.badges[0] ?? BADGE_DEFAULT).border}` }}
                >
                  <card.Icon size={16} strokeWidth={1.5} style={{ color: (card.badges[0] ?? BADGE_DEFAULT).color }} />
                </div>
                )}

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
        )}

        {/* ── Lock hint strip (non-access users) ─────────────────────────── */}
        {!hasClaudeOS && (
          <button
            onClick={() => setShowUnlockModal(true)}
            className="mt-4 w-full flex items-center justify-center gap-2 rounded-xl px-5 py-3 transition-all hover:opacity-80"
            style={{ background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.1)' }}
          >
            <Lock size={12} strokeWidth={1.5} style={{ color: 'rgba(255,255,255,0.4)' }} />
            <span className="text-[12px] font-semibold" style={{ color: 'rgba(255,255,255,0.5)' }}>
              Débloquer Claude OS — Module Claude 37€
            </span>
          </button>
        )}

        {/* ── Claude Integrator CTA ───────────────────────────────────────── */}
        <div className="mt-8 rounded-2xl p-6"
          style={{ background: 'linear-gradient(135deg, rgba(77,150,255,0.07) 0%, rgba(99,102,241,0.07) 100%)', border: '0.5px solid rgba(77,150,255,0.2)' }}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex-1">
              <p className="text-[11px] font-bold uppercase tracking-widest mb-1" style={{ color: ACCENT }}>
                Session privée · 45 min
              </p>
              <p className="text-[14px] font-bold mb-1" style={{ color: '#e2e8f0', letterSpacing: '-0.02em' }}>
                On configure tout ton environnement Claude en 45 min
              </p>
              <p className="text-[12px]" style={{ color: '#5b6078' }}>
                Claude AI + Claude Code + Cowork — connecteurs, MCP, skills, prompts, workflows. Tout configuré en visio.
              </p>
            </div>
            <button
              onClick={() => navigate('#/claude-integrator')}
              className="shrink-0 px-5 py-3 rounded-xl text-[13px] font-bold transition-all"
              style={{
                background: 'linear-gradient(135deg, #4d96ff 0%, #6366f1 100%)',
                color: '#fff',
                border: 'none',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}>
              Réserver — 197€ →
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}

// local accent constant used in CTA
const ACCENT = '#4d96ff'
