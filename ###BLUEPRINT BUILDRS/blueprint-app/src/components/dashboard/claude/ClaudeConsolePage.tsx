import { useState } from 'react'
import { ArrowLeft, Terminal, Settings, Cpu, Wrench, BookOpen, Zap } from 'lucide-react'
import { ClaudeIcon } from '../../ui/icons'

type Tab = 'setup' | 'skills' | 'mcp' | 'resources'

interface Props {
  tab?: string
  navigate: (hash: string) => void
  userId: string
  isCompleted: (moduleId: string, lessonId: string) => boolean
  markComplete: (moduleId: string, lessonId: string) => void
}

const TABS: { id: Tab; label: string; Icon: React.ComponentType<{ size?: number; strokeWidth?: number }> }[] = [
  { id: 'setup',     label: 'Mon Setup',    Icon: Settings },
  { id: 'skills',    label: 'Mes Skills',   Icon: Cpu },
  { id: 'mcp',       label: 'MCP Servers',  Icon: Wrench },
  { id: 'resources', label: 'Ressources',   Icon: BookOpen },
]

export function ClaudeConsolePage({ tab, navigate }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>((tab as Tab) || 'setup')

  const handleTabChange = (t: Tab) => {
    setActiveTab(t)
    navigate(`#/dashboard/claude/console/${t}`)
  }

  return (
    <div className="min-h-full bg-background">

      {/* ── Sub-header ── */}
      <div className="sticky top-0 z-20 bg-background border-b border-border">
        <div className="flex items-center justify-between px-4 h-12">
          <button
            onClick={() => navigate('#/dashboard/claude')}
            className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors text-xs font-medium"
          >
            <ArrowLeft size={13} strokeWidth={1.5} />
            Parcours
          </button>
          <div className="flex items-center gap-1.5">
            <ClaudeIcon size={14} />
            <span className="text-xs font-bold tracking-[-0.02em] text-foreground">Console Claude</span>
          </div>
          <button
            onClick={() => navigate('#/dashboard/autopilot')}
            className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors text-xs font-medium"
          >
            <Zap size={13} strokeWidth={1.5} />
            Jarvis
          </button>
        </div>

        {/* Tab bar */}
        <div className="flex items-center gap-0 px-4 border-t border-border overflow-x-auto">
          {TABS.map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => handleTabChange(id)}
              className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-semibold whitespace-nowrap border-b-2 transition-all duration-150 ${
                activeTab === id
                  ? 'border-foreground text-foreground'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon size={11} strokeWidth={1.5} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Tab content ── */}
      <div className="max-w-3xl mx-auto px-4 py-6">
        {activeTab === 'setup'     && <SetupTab />}
        {activeTab === 'skills'    && <SkillsTab />}
        {activeTab === 'mcp'       && <McpTab />}
        {activeTab === 'resources' && <ResourcesTab />}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────
// Tab: Mon Setup
// ─────────────────────────────────────────────────────────────────
function SetupTab() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-base font-bold text-foreground mb-1 tracking-tight">Mon Setup Claude</h2>
        <p className="text-sm text-muted-foreground">Vérifie que ton environnement est correctement configuré.</p>
      </div>
      <div className="rounded-xl border border-border bg-card p-4">
        <p className="text-xs font-bold uppercase tracking-[0.08em] text-muted-foreground mb-3">Configuration</p>
        {[
          { label: 'Plan Pro ou Max activé', lesson: '1.1' },
          { label: 'Claude Desktop installé', lesson: '1.2' },
          { label: 'Claude Mobile installé', lesson: '1.2' },
          { label: 'Préférences profil configurées', lesson: '1.3' },
          { label: 'Style Builder Mode créé', lesson: '1.4' },
          { label: 'Mémoire activée et initialisée', lesson: '1.5' },
          { label: 'Confidentialité configurée', lesson: '1.6' },
          { label: 'VS Code installé avec extensions', lesson: '1.8' },
          { label: 'Whispr Flow installé', lesson: '1.8' },
        ].map(item => (
          <div key={item.label} className="flex items-center justify-between py-2 border-b border-border last:border-0">
            <span className="text-sm text-foreground">{item.label}</span>
            <button
              onClick={() => window.location.hash = `/dashboard/claude/module/claude-1/lesson/${item.lesson}`}
              className="text-[10px] text-muted-foreground hover:text-foreground transition-colors font-medium"
            >
              Leçon {item.lesson} →
            </button>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-card p-4">
        <p className="text-xs font-bold uppercase tracking-[0.08em] text-muted-foreground mb-3">Statut système</p>
        {[
          { label: 'Claude Sonnet 4.6', status: 'Connecté', color: '#22c55e' },
          { label: 'Skills actifs', status: '12 / 12', color: '#22c55e' },
          { label: 'MCPs configurés', status: '0 / 6', color: '#eab308' },
          { label: 'Modèle préféré', status: 'Sonnet 4.6', color: '#cc5de8' },
        ].map(item => (
          <div key={item.label} className="flex items-center justify-between py-2 border-b border-border last:border-0">
            <span className="text-sm text-foreground">{item.label}</span>
            <span className="text-xs font-bold" style={{ color: item.color }}>{item.status}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────
// Tab: Mes Skills
// ─────────────────────────────────────────────────────────────────
const SKILLS = [
  { name: 'brainstorming',        desc: 'Idéation et exploration de marché',            cmd: '/brainstorming',        framework: 'Étapes 2-3' },
  { name: 'writing-plans',        desc: 'Planification technique structurée',            cmd: '/writing-plans',        framework: 'Étape 5' },
  { name: 'executing-plans',      desc: 'Exécution pas à pas d\'un plan',               cmd: '/executing-plans',      framework: 'Étapes 7-8' },
  { name: 'code-reviewer',        desc: 'Revue de code et détection de bugs',            cmd: '/code-reviewer',        framework: 'Étape 8' },
  { name: 'code-architect',       desc: 'Architecture d\'un SaaS complet',              cmd: '/code-architect',       framework: 'Étape 7' },
  { name: 'code-explorer',        desc: 'Navigation et compréhension de codebase',       cmd: '/code-explorer',        framework: 'Étape 8' },
  { name: 'debugging',            desc: 'Résolution de bugs step by step',              cmd: '/debugging',            framework: 'Étape 8' },
  { name: 'react-best-practices', desc: 'Standards React / TypeScript / UI',            cmd: '/react-best-practices', framework: 'Étape 8' },
  { name: 'commit',               desc: 'Commits Git clairs et structurés',             cmd: '/commit',               framework: 'Étape 8' },
  { name: 'frontend-design',      desc: 'Bonnes pratiques UI/UX',                       cmd: '/frontend-design',      framework: 'Étape 6' },
  { name: 'deployment',           desc: 'Déploiement Vercel',                           cmd: '/deployment',           framework: 'Étape 9' },
  { name: 'supabase',             desc: 'Expert Supabase (schéma, RLS, Edge Functions)', cmd: '/supabase',             framework: 'Étapes 7-8' },
]

function SkillsTab() {
  const [copied, setCopied] = useState<string | null>(null)

  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 1500)
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-base font-bold text-foreground mb-1 tracking-tight">Mes Skills Buildrs</h2>
        <p className="text-sm text-muted-foreground">Les 12 skills Buildrs à installer dans Claude Code.</p>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {SKILLS.map(skill => (
          <div key={skill.name} className="rounded-xl border border-border bg-card p-3 flex flex-col gap-1.5">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-xs font-bold text-foreground font-mono">{skill.name}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{skill.desc}</p>
              </div>
              <span className="text-[8px] font-bold px-1.5 py-0.5 rounded flex-shrink-0 bg-secondary text-muted-foreground border border-border">
                {skill.framework}
              </span>
            </div>
            <button
              onClick={() => copy(skill.cmd, skill.name)}
              className="text-left text-[10px] font-mono bg-secondary/60 rounded-md px-2 py-1 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            >
              {copied === skill.name ? '✓ Copié' : skill.cmd}
            </button>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-secondary/30 p-4">
        <p className="text-xs font-bold text-foreground mb-2">Installer tous les skills Buildrs</p>
        <p className="text-[11px] text-muted-foreground mb-3">
          Le plugin Superpowers Buildrs installe les 12 skills d'un coup dans Claude Code.
        </p>
        <button
          onClick={() => copy('claude plugin install superpowers', 'all-skills')}
          className="text-xs font-mono bg-foreground text-background rounded-lg px-3 py-2 hover:opacity-90 transition-opacity"
        >
          {copied === 'all-skills' ? '✓ Copié' : 'claude plugin install superpowers'}
        </button>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────
// Tab: MCP Servers
// ─────────────────────────────────────────────────────────────────
const MCPS = [
  { name: 'Context7',    desc: 'Documentation React, Supabase, Stripe à jour',     priority: 'Essentiel', framework: 'Étapes 7-8', cmd: 'npx -y @upstash/context7-mcp@latest' },
  { name: 'Supabase',    desc: 'Accès BDD direct — tables, migrations, RLS',       priority: 'Essentiel', framework: 'Étapes 7-8', cmd: 'npx -y @supabase/mcp-server-supabase@latest --project-ref [TON_REF]' },
  { name: 'GitHub',      desc: 'Lecture repos, fichiers, branches',                priority: 'Important', framework: 'Étapes 7-9', cmd: 'npx -y @modelcontextprotocol/server-github' },
  { name: 'Stripe',      desc: 'Clients, paiements, abonnements',                  priority: 'Important', framework: 'Étapes 9-10', cmd: 'npx -y @stripe/mcp-server' },
  { name: 'Vercel',      desc: 'Déploiements, logs, projets',                      priority: 'Utile',     framework: 'Étape 9', cmd: 'npx -y @vercel/mcp-server' },
  { name: 'Resend',      desc: 'Gestion emails, templates, domaines',              priority: 'Optionnel', framework: 'Étape 8', cmd: 'npx -y @resend/mcp-server' },
]

const PRIORITY_COLOR: Record<string, string> = {
  Essentiel: '#22c55e',
  Important: '#3b82f6',
  Utile: '#eab308',
  Optionnel: '#6b7280',
}

const SETTINGS_TEMPLATE = `{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp@latest"]
    },
    "supabase": {
      "command": "npx",
      "args": ["-y", "@supabase/mcp-server-supabase@latest",
                "--project-ref", "[TON_PROJECT_REF]",
                "--access-token", "[TON_ACCESS_TOKEN]"]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "[TON_TOKEN]" }
    }
  }
}`

function McpTab() {
  const [expanded, setExpanded] = useState<string | null>(null)
  const [copied, setCopied] = useState<string | null>(null)

  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 1500)
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-base font-bold text-foreground mb-1 tracking-tight">Connecteurs MCP</h2>
        <p className="text-sm text-muted-foreground">Les outils branchés directement à Claude Code.</p>
      </div>

      <div className="flex flex-col divide-y divide-border rounded-xl border border-border overflow-hidden">
        {MCPS.map(mcp => (
          <div key={mcp.name}>
            <div
              className="flex items-center gap-3 p-3 cursor-pointer hover:bg-secondary/30 transition-colors"
              onClick={() => setExpanded(expanded === mcp.name ? null : mcp.name)}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-foreground">{mcp.name} MCP</span>
                  <span
                    className="text-[8px] font-bold px-1.5 py-0.5 rounded"
                    style={{ color: PRIORITY_COLOR[mcp.priority], border: `1px solid ${PRIORITY_COLOR[mcp.priority]}40`, background: `${PRIORITY_COLOR[mcp.priority]}15` }}
                  >
                    {mcp.priority}
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground mt-0.5">{mcp.desc}</p>
              </div>
              <span className="text-[9px] text-muted-foreground/60">{mcp.framework}</span>
            </div>
            {expanded === mcp.name && (
              <div className="px-3 pb-3 bg-secondary/20">
                <p className="text-[10px] text-muted-foreground mb-1.5 font-medium">Commande d'installation :</p>
                <button
                  onClick={() => copy(mcp.cmd, mcp.name)}
                  className="w-full text-left text-[10px] font-mono bg-background rounded-lg px-3 py-2 border border-border text-muted-foreground hover:text-foreground transition-colors"
                >
                  {copied === mcp.name ? '✓ Copié' : mcp.cmd}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-secondary/30 p-4">
        <p className="text-xs font-bold text-foreground mb-1">Config plug-and-play</p>
        <p className="text-[11px] text-muted-foreground mb-3">
          Copie ce template dans ton fichier <code className="font-mono bg-secondary px-1 py-0.5 rounded text-[10px]">.claude/settings.json</code> et remplace les [placeholders].
        </p>
        <button
          onClick={() => copy(SETTINGS_TEMPLATE, 'settings')}
          className="w-full text-left text-[10px] font-mono bg-background rounded-lg px-3 py-2.5 border border-border text-muted-foreground hover:text-foreground transition-colors whitespace-pre"
        >
          {copied === 'settings' ? '✓ Copié — colle dans .claude/settings.json' : SETTINGS_TEMPLATE}
        </button>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────
// Tab: Ressources
// ─────────────────────────────────────────────────────────────────
const WORKFLOWS = [
  { name: 'Lancer un SaaS IA',          steps: 8, desc: 'Du brief produit au déploiement live' },
  { name: 'Rédiger une landing page',   steps: 6, desc: 'Copywriting + structure + CTA optimisé' },
  { name: 'Debugger en production',     steps: 5, desc: 'Identifier et corriger en moins d\'1h' },
  { name: 'Architecture BDD Supabase',  steps: 4, desc: 'Schéma + RLS + Edge Functions' },
  { name: 'Créer un agent autonome',    steps: 7, desc: 'Agent avec mémoire, outils et handoff' },
]

const TOOL_LINKS = [
  { step: 1, tools: ['Claude Pro/Max', 'VS Code', 'Whispr Flow'] },
  { step: 2, tools: ['Product Hunt', 'Perplexity', 'Indie Hackers'] },
  { step: 3, tools: ['Acquire.com', 'Flippa', 'Claude Deep Research'] },
  { step: 4, tools: ['Claude Projects'] },
  { step: 5, tools: ['Claude Artifacts', 'Mermaid'] },
  { step: 6, tools: ['Mobbin', '21st.dev', 'Dribbble', 'Figma'] },
  { step: 7, tools: ['Claude Code', 'Supabase MCP'] },
  { step: 8, tools: ['Claude Code', 'Supabase', 'Resend', 'GitHub MCP'] },
  { step: 9, tools: ['Vercel', 'Stripe', 'Superwall'] },
  { step: 10, tools: ['GA4', 'PostHog', 'Claude Research'] },
]

function ResourcesTab() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-base font-bold text-foreground mb-1 tracking-tight">Ressources Buildrs</h2>
        <p className="text-sm text-muted-foreground">Workflows, templates, commandes et outils par étape du framework.</p>
      </div>

      {/* Workflows */}
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.08em] text-muted-foreground mb-3">Workflows plug-and-play</p>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {WORKFLOWS.map(wf => (
            <div key={wf.name} className="rounded-xl border border-border bg-card p-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-xs font-bold text-foreground">{wf.name}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{wf.desc}</p>
                </div>
                <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-secondary text-muted-foreground border border-border flex-shrink-0">
                  {wf.steps} étapes
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Outils par étape */}
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.08em] text-muted-foreground mb-3">Outils par étape du framework</p>
        <div className="flex flex-col divide-y divide-border rounded-xl border border-border overflow-hidden">
          {TOOL_LINKS.map(({ step, tools }) => (
            <div key={step} className="flex items-start gap-3 p-2.5">
              <span className="text-[10px] font-bold text-muted-foreground/60 w-14 flex-shrink-0 pt-0.5">Étape {step}</span>
              <div className="flex flex-wrap gap-1">
                {tools.map(t => (
                  <span key={t} className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-secondary border border-border text-foreground/80">{t}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Commandes custom */}
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.08em] text-muted-foreground mb-3">Commandes Claude Code essentielles</p>
        <div className="flex flex-col gap-1.5">
          {[
            { cmd: '/plan',    desc: 'Planifier avant de coder — économise des tokens' },
            { cmd: '/review',  desc: 'Code review automatique de tes fichiers' },
            { cmd: '/commit',  desc: 'Commits Git clairs et structurés' },
            { cmd: '/compact', desc: 'Compresser le contexte quand la fenêtre sature' },
            { cmd: '/diff',    desc: 'Voir les changements avant de valider' },
          ].map(item => (
            <div key={item.cmd} className="flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-2">
              <code className="text-xs font-mono font-bold text-foreground/90 w-16 flex-shrink-0">{item.cmd}</code>
              <span className="text-[11px] text-muted-foreground">{item.desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
