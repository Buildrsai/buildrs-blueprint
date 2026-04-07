import { useState, useCallback } from 'react'
import { ArrowLeft, Copy, Check, ChevronDown, Package, ExternalLink, Star } from 'lucide-react'

interface Props {
  navigate: (hash: string) => void
}

const ACCENT = '#22c55e'

function CopyBtn({ text, label }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false)
  const doCopy = useCallback(() => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [text])
  return (
    <button onClick={doCopy}
      className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all shrink-0"
      style={{ background: copied ? 'rgba(34,197,94,0.12)' : 'rgba(255,255,255,0.06)', border: `0.5px solid ${copied ? 'rgba(34,197,94,0.3)' : 'rgba(255,255,255,0.1)'}`, color: copied ? '#22c55e' : '#5b6078' }}>
      {copied ? <Check size={10} strokeWidth={2} /> : <Copy size={10} strokeWidth={1.5} />}
      <span className="text-[10px] font-medium">{copied ? 'Copié' : label ?? 'Copier'}</span>
    </button>
  )
}

function CodeBlock({ code, label }: { code: string; label?: string }) {
  const [copied, setCopied] = useState(false)
  const doCopy = useCallback(() => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [code])
  return (
    <div className="relative rounded-xl overflow-hidden my-3" style={{ background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.09)' }}>
      {label && (
        <div className="px-4 py-1.5" style={{ borderBottom: '0.5px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
          <span className="text-[10px] font-medium" style={{ fontFamily: 'Geist Mono, monospace', color: '#5b6078' }}>{label}</span>
        </div>
      )}
      <pre className="px-4 py-4 overflow-x-auto text-[12px] leading-relaxed" style={{ fontFamily: 'Geist Mono, ui-monospace, monospace', color: '#c9d1d9' }}>
        <code>{code}</code>
      </pre>
      <button onClick={doCopy} className="absolute top-2.5 right-2.5 flex items-center gap-1.5 px-2 py-1 rounded-lg transition-all"
        style={{ background: 'rgba(255,255,255,0.07)', border: '0.5px solid rgba(255,255,255,0.12)', color: copied ? '#22c55e' : '#5b6078' }}>
        {copied ? <Check size={11} strokeWidth={2} /> : <Copy size={11} strokeWidth={1.5} />}
        <span className="text-[10px] font-medium">{copied ? 'Copié' : 'Copier'}</span>
      </button>
    </div>
  )
}

interface McpTool { name: string; desc: string }
interface McpServer { id: string; title: string; essential?: boolean; why: string; install: string; installNote?: string; tokenUrl?: string; tools?: McpTool[] }
interface Connector { name: string; essential?: boolean; how: string; why: string; req?: string; tools?: McpTool[] }

const MCP_SERVERS: McpServer[] = [
  {
    id: 'supabase',
    title: 'Supabase MCP',
    essential: true,
    why: "C'est ton backend complet. Claude peut exécuter du SQL, créer des migrations, lister les tables, déployer des Edge Functions, et générer les types TypeScript depuis ton schéma. Sans ça, tu copies-colles entre Claude et le dashboard Supabase.",
    install: `claude mcp add --transport stdio supabase \\
  --env SUPABASE_ACCESS_TOKEN=sbp_your_token \\
  -- npx -y @supabase/mcp-server`,
    installNote: "Où trouver le token : supabase.com/dashboard/account/tokens",
    tokenUrl: 'https://supabase.com/dashboard/account/tokens',
    tools: [
      { name: 'execute_sql', desc: 'Exécuter des requêtes SQL directement' },
      { name: 'apply_migration', desc: 'Appliquer une migration de base de données' },
      { name: 'list_tables', desc: 'Lister toutes les tables' },
      { name: 'get_logs', desc: 'Consulter les logs des Edge Functions' },
      { name: 'deploy_edge_function', desc: 'Déployer une Edge Function' },
      { name: 'generate_typescript_types', desc: 'Générer les types TypeScript depuis le schéma' },
      { name: 'list_projects', desc: 'Lister les projets Supabase' },
      { name: 'get_advisors', desc: 'Recommandations de sécurité et performance' },
    ],
  },
  {
    id: 'playwright',
    title: 'Playwright MCP',
    essential: true,
    why: "Claude peut ouvrir un vrai navigateur, cliquer, remplir des formulaires, prendre des screenshots. Indispensable pour le debug visuel et les tests E2E.",
    install: `claude mcp add --transport stdio playwright \\
  -- npx -y @playwright/mcp@latest`,
    tools: [
      { name: 'navigate', desc: 'Naviguer vers une URL' },
      { name: 'click', desc: 'Cliquer sur un élément' },
      { name: 'fill_form', desc: 'Remplir un formulaire' },
      { name: 'screenshot', desc: 'Prendre un screenshot' },
      { name: 'evaluate', desc: "Exécuter du JavaScript dans la page" },
      { name: 'network_requests', desc: 'Inspecter les requêtes réseau' },
      { name: 'console_messages', desc: 'Lire la console du navigateur' },
    ],
  },
  {
    id: 'github',
    title: 'GitHub MCP',
    essential: true,
    why: "Claude peut créer des issues, ouvrir des PRs, lire le code, gérer les branches — tout sans quitter la conversation.",
    install: `claude mcp add --transport http github https://api.githubcopilot.com/mcp/
# Puis dans Claude Code : /mcp → Authenticate`,
  },
  {
    id: 'sentry',
    title: 'Sentry MCP',
    why: "Monitoring des erreurs en temps réel. Claude peut analyser les stack traces et suggérer des corrections directement.",
    install: `claude mcp add --transport http sentry https://mcp.sentry.dev/mcp
# Puis /mcp → Authenticate (OAuth)`,
    tools: [
      { name: 'list_errors', desc: 'Lister les erreurs les plus fréquentes' },
      { name: 'get_stack_trace', desc: 'Stack trace détaillé + suggestion de fix' },
    ],
  },
  {
    id: 'fetch',
    title: 'Fetch MCP',
    why: "Claude peut récupérer du contenu web et le convertir en format exploitable. Documentation, API REST, scraping de pages.",
    install: `claude mcp add --transport stdio fetch \\
  -- npx -y @modelcontextprotocol/server-fetch`,
  },
  {
    id: 'filesystem',
    title: 'Filesystem MCP',
    why: "Accès sécurisé au système de fichiers avec contrôles d'accès configurables. Tu définis précisément quels répertoires sont accessibles.",
    install: `claude mcp add --transport stdio filesystem \\
  -- npx -y @modelcontextprotocol/server-filesystem /chemin/autorise`,
  },
  {
    id: 'composio',
    title: 'Composio MCP',
    why: "Le couteau suisse. Connecte Claude à +150 outils (Gmail, Notion, Linear, Slack, Airtable, HubSpot, etc.) via une seule connexion.",
    install: `# Prérequis : Python 3.11
brew install python@3.11
/opt/homebrew/opt/python@3.11/bin/pip3.11 install composio_core composio_tools

# Récupérer ton URL MCP
/opt/homebrew/opt/python@3.11/bin/python3.11 -c "
from composio import Composio
c = Composio(api_key='TON_API_KEY_COMPOSIO')
print(c.get_mcp_url())
"`,
    installNote: "Puis ajouter dans ~/.mcp.json avec ton URL et clé API. Lien : composio.dev",
  },
  {
    id: 'n8n',
    title: 'n8n MCP',
    why: "Automatisation. Claude peut déclencher des workflows n8n, consulter des exécutions, et intégrer des automatisations.",
    install: `# Via Claude.ai → Settings → Integrations → n8n → Connect
# OU via ~/.mcp.json avec ton URL n8n`,
    installNote: "GitHub : github.com/czlonkowski/n8n-mcp",
  },
]

const CONNECTORS_ESSENTIAL: Connector[] = [
  { name: 'Vercel', essential: true, how: 'Settings → Integrations → Connect', why: 'Déploiement, logs runtime, variables d\'env, statut des deploys', req: 'Compte Vercel',
    tools: [{ name: 'get_deployment', desc: 'Détails d\'un deployment' }, { name: 'get_runtime_logs', desc: 'Logs de production en temps réel' }, { name: 'list_deployments', desc: 'Liste des deployments récents' }, { name: 'deploy_to_vercel', desc: 'Déclencher un deploy' }, { name: 'get_deployment_build_logs', desc: 'Logs de build' }] },
  { name: 'Supabase', essential: true, how: 'Settings → Integrations → Connect', why: 'Backend complet : DB, auth, storage, Edge Functions', req: 'Compte Supabase' },
  { name: 'GitHub', essential: true, how: 'Settings → Integrations → Connect', why: 'Versioning, issues, PRs, code review', req: 'Compte GitHub' },
  { name: 'Stripe', essential: true, how: 'Settings → Integrations → Connect', why: 'Produits, prix, clients, factures, debug webhooks', req: 'Clé API Stripe' },
  { name: 'Context7', essential: true, how: 'Settings → Integrations → Connect', why: 'Docs officielles de n\'importe quelle lib en temps réel. Claude ne code plus avec des docs obsolètes.' },
  { name: '21st.dev Magic', essential: true, how: 'Settings → Integrations → Connect', why: 'Génération de composants UI premium (variants, dark mode, accessibilité)',
    tools: [{ name: '21st_magic_component_builder', desc: 'Génère un composant depuis une description' }, { name: '21st_magic_component_refiner', desc: 'Affine un composant existant' }, { name: '21st_magic_component_inspiration', desc: 'Suggestions de composants similaires' }, { name: 'logo_search', desc: 'Recherche de logos de marques' }] },
  { name: 'Figma', essential: true, how: 'Settings → Integrations → Connect', why: 'Lecture + écriture dans Figma. Design-to-code et code-to-design.', req: 'Compte Figma',
    tools: [{ name: 'get_design_context', desc: 'Lit le design + génère du code' }, { name: 'get_screenshot', desc: 'Screenshot d\'un composant Figma' }, { name: 'generate_diagram', desc: 'Crée un diagramme dans FigJam' }, { name: 'search_design_system', desc: 'Recherche dans le design system' }, { name: 'get_variable_defs', desc: 'Récupère les tokens/variables' }] },
  { name: 'Notion', how: 'Settings → Integrations → Connect', why: 'Documentation, bases de données, synchronisation contenu', req: 'Compte Notion' },
]

const CONNECTORS_RECOMMENDED: Connector[] = [
  { name: 'Tavily', how: 'Settings → Integrations → Connect', why: 'Recherche web en temps réel depuis Claude' },
  { name: 'tldraw', how: 'Settings → Integrations → Connect', why: 'Créer des diagrammes, schémas, wireframes visuels' },
  { name: 'Stitch', how: 'Settings → Integrations → Connect', why: 'Assemblage d\'interfaces UI. Maquettage rapide, design system.',
    tools: [{ name: 'generate_screen_from_text', desc: 'Génère un écran UI depuis une description' }, { name: 'create_design_system', desc: 'Crée un système de design' }, { name: 'apply_design_system', desc: 'Applique un design system à un projet' }, { name: 'generate_variants', desc: 'Génère des variantes d\'un écran' }] },
  { name: 'Cloudflare', how: 'Settings → Integrations → Connect', why: 'Workers, KV Store, R2, bases D1', req: 'API Token Cloudflare',
    tools: [{ name: 'd1_database_query', desc: 'Requêtes SQL sur D1' }, { name: 'kv_namespace_create', desc: 'Créer un KV Store' }, { name: 'r2_bucket_create', desc: 'Créer un bucket R2' }, { name: 'workers_list', desc: 'Lister les Workers' }] },
  { name: 'Linear', how: 'Settings → Integrations → Connect', why: 'Gestion de tickets et projets, issues, milestones', req: 'Compte Linear' },
  { name: 'Amplitude', how: 'Settings → Integrations → Connect', why: 'Analytics produit, entonnoirs, cohortes', req: 'Compte Amplitude' },
  { name: 'Canva', how: 'Settings → Integrations → Connect', why: 'Créer et exporter des designs (bannières, posts, présentations)', req: 'Compte Canva' },
  { name: 'Craft', how: 'Settings → Integrations → Connect', why: 'Notes et documentation. Outil de notes qu\'on utilise chez Buildrs.', req: 'Compte Craft',
    tools: [{ name: 'documents_create / list', desc: 'Gestion des documents' }, { name: 'blocks_add / update', desc: 'Édition bloc par bloc' }, { name: 'tasks_add / update', desc: 'Gestion de tâches' }, { name: 'collections_create', desc: 'Bases de données' }] },
  { name: 'n8n', how: 'Settings → Integrations → Connect', why: 'Automatisation de workflows', req: 'Instance n8n' },
]

const CONNECTORS_OPTIONAL: { name: string; desc: string }[] = [
  { name: 'Vibe Prospecting', desc: 'Prospection et enrichissement de leads' },
  { name: 'Apify', desc: 'Scraping automatisé' },
  { name: 'shadcn', desc: 'Composants UI (en plus du plugin)' },
  { name: 'ElevenLabs Agent', desc: "Création d'agents vocaux IA" },
  { name: 'ElevenLabs Player', desc: 'Audio, TTS, sound effects' },
  { name: 'Magic UI', desc: 'Composants UI animés' },
  { name: 'Excalidraw', desc: 'Diagrammes et schémas visuels (alternative tldraw)' },
  { name: 'Gamma', desc: 'Présentations, documents, pages web avec IA' },
]

function McpServerCard({ s }: { s: McpServer }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="rounded-xl overflow-hidden" style={{ border: '0.5px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)' }}>
      <button className="w-full flex items-center justify-between px-4 py-3 transition-colors text-left"
        onClick={() => setOpen(o => !o)}
        style={{ background: open ? 'rgba(255,255,255,0.03)' : undefined }}>
        <div className="flex items-center gap-3">
          {s.essential && <Star size={11} strokeWidth={2} style={{ color: '#eab308' }} />}
          <span className="text-[13px] font-semibold" style={{ color: '#e2e8f0', fontFamily: 'Geist Mono, monospace' }}>{s.title}</span>
          {s.essential && <span className="text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded" style={{ color: '#eab308', background: 'rgba(234,179,8,0.12)', border: '0.5px solid rgba(234,179,8,0.25)' }}>Essentiel</span>}
        </div>
        <ChevronDown size={13} strokeWidth={1.5} style={{ color: '#3d4466', transform: open ? 'rotate(180deg)' : undefined, transition: 'transform 200ms' }} />
      </button>
      {open && (
        <div className="px-4 pb-4 space-y-3" style={{ borderTop: '0.5px solid rgba(255,255,255,0.05)' }}>
          <p className="text-[12px] pt-3 leading-relaxed" style={{ color: '#94a3b8' }}>{s.why}</p>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: '#3d4466' }}>Installation</p>
            <div className="relative rounded-lg overflow-hidden" style={{ background: 'rgba(0,0,0,0.3)', border: '0.5px solid rgba(255,255,255,0.07)' }}>
              <pre className="px-4 py-3 overflow-x-auto text-[11px] leading-relaxed" style={{ fontFamily: 'Geist Mono, ui-monospace, monospace', color: '#c9d1d9' }}>
                <code>{s.install}</code>
              </pre>
              <div className="absolute top-2 right-2">
                <CopyBtn text={s.install} />
              </div>
            </div>
            {s.installNote && (
              <p className="text-[11px] mt-1.5" style={{ color: '#5b6078' }}>
                {s.tokenUrl ? (
                  <>Où trouver le token : <a href={s.tokenUrl} target="_blank" rel="noopener noreferrer" className="hover:underline" style={{ color: ACCENT }}>{s.tokenUrl.replace('https://', '')}</a></>
                ) : s.installNote}
              </p>
            )}
          </div>
          {s.tools && s.tools.length > 0 && (
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider mb-2" style={{ color: '#3d4466' }}>Outils disponibles</p>
              <div className="rounded-lg overflow-hidden" style={{ border: '0.5px solid rgba(255,255,255,0.06)' }}>
                {s.tools.map((t, i) => (
                  <div key={t.name} className="flex items-center gap-3 px-3 py-2" style={{ borderBottom: i < s.tools!.length - 1 ? '0.5px solid rgba(255,255,255,0.04)' : undefined }}>
                    <div className="flex items-center justify-between w-full">
                      <span className="text-[11px]" style={{ fontFamily: 'Geist Mono, monospace', color: '#4d96ff' }}>{t.name}</span>
                      <span className="text-[11px] text-right" style={{ color: '#5b6078', maxWidth: '55%' }}>{t.desc}</span>
                    </div>
                    <CopyBtn text={t.name} label="cmd" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function ConnectorCard({ c }: { c: Connector }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="rounded-xl overflow-hidden" style={{ border: '0.5px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)' }}>
      <button className="w-full flex items-center justify-between px-4 py-3 transition-colors text-left"
        onClick={() => setOpen(o => !o)}
        style={{ background: open ? 'rgba(255,255,255,0.03)' : undefined }}>
        <div className="flex items-center gap-3">
          {c.essential && <Star size={11} strokeWidth={2} style={{ color: '#eab308' }} />}
          <span className="text-[13px] font-semibold" style={{ color: '#e2e8f0' }}>{c.name}</span>
          {c.essential && <span className="text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded" style={{ color: '#eab308', background: 'rgba(234,179,8,0.12)', border: '0.5px solid rgba(234,179,8,0.25)' }}>Essentiel</span>}
          {c.req && <span className="text-[10px]" style={{ color: '#5b6078' }}>— {c.req}</span>}
        </div>
        <ChevronDown size={13} strokeWidth={1.5} style={{ color: '#3d4466', transform: open ? 'rotate(180deg)' : undefined, transition: 'transform 200ms' }} />
      </button>
      {open && (
        <div className="px-4 pb-4 space-y-3" style={{ borderTop: '0.5px solid rgba(255,255,255,0.05)' }}>
          <p className="text-[12px] pt-3 leading-relaxed" style={{ color: '#94a3b8' }}>{c.why}</p>
          <div className="flex items-center gap-2">
            <span className="text-[11px]" style={{ color: '#5b6078' }}>Comment connecter :</span>
            <span className="text-[11px] font-medium" style={{ color: '#e2e8f0', fontFamily: 'Geist Mono, monospace' }}>Claude.ai → {c.how}</span>
          </div>
          {c.tools && c.tools.length > 0 && (
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider mb-2" style={{ color: '#3d4466' }}>Outils disponibles</p>
              <div className="rounded-lg overflow-hidden" style={{ border: '0.5px solid rgba(255,255,255,0.06)' }}>
                {c.tools.map((t, i) => (
                  <div key={t.name} className="flex items-center justify-between px-3 py-2" style={{ borderBottom: i < c.tools!.length - 1 ? '0.5px solid rgba(255,255,255,0.04)' : undefined }}>
                    <span className="text-[11px]" style={{ fontFamily: 'Geist Mono, monospace', color: '#22c55e' }}>{t.name}</span>
                    <span className="text-[11px]" style={{ color: '#5b6078' }}>{t.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

const RECOMMENDED_MCP_JSON = `{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": ["-y", "@supabase/mcp-server"],
      "env": {
        "SUPABASE_ACCESS_TOKEN": "\${SUPABASE_ACCESS_TOKEN}"
      }
    },
    "playwright": {
      "command": "npx",
      "args": ["-y", "@playwright/mcp@latest"]
    },
    "fetch": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-fetch"]
    }
  }
}`

const INSTALL_COMMANDS = `# 1. Supabase (backend)
claude mcp add --transport stdio supabase \\
  --env SUPABASE_ACCESS_TOKEN=sbp_xxx \\
  -- npx -y @supabase/mcp-server

# 2. Playwright (tests)
claude mcp add --transport stdio playwright \\
  -- npx -y @playwright/mcp@latest

# 3. GitHub (optionnel si connecteur déjà actif)
claude mcp add --transport http github https://api.githubcopilot.com/mcp/

# 4. Fetch (requêtes web)
claude mcp add --transport stdio fetch \\
  -- npx -y @modelcontextprotocol/server-fetch`

export function McpRessourcesPage({ navigate }: Props) {
  return (
    <div className="min-h-screen pb-20" style={{ background: '#080909' }}>
      {/* Header */}
      <div className="px-6 pt-6 pb-4" style={{ borderBottom: '0.5px solid rgba(255,255,255,0.06)' }}>
        <button onClick={() => window.history.back()}
          className="flex items-center gap-2 mb-5 transition-colors"
          style={{ color: '#5b6078' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#e2e8f0')}
          onMouseLeave={e => (e.currentTarget.style.color = '#5b6078')}>
          <ArrowLeft size={14} strokeWidth={1.5} />
          <span className="text-[12px]">MCP & Connecteurs</span>
        </button>
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: 'rgba(34,197,94,0.12)', border: '0.5px solid rgba(34,197,94,0.25)' }}>
            <Package size={18} strokeWidth={1.5} style={{ color: ACCENT }} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full"
                style={{ color: ACCENT, background: 'rgba(34,197,94,0.12)', border: '0.5px solid rgba(34,197,94,0.25)' }}>
                Ressources
              </span>
              <span className="text-[10px]" style={{ color: '#3d4466' }}>8 MCP Servers · 20+ Connecteurs</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight" style={{ color: '#e2e8f0' }}>Bibliothèque MCP & Connecteurs Buildrs</h1>
            <p className="text-[13px] mt-1" style={{ color: '#5b6078' }}>
              Tous les MCP Serveurs et Connecteurs qu'on utilise en interne. Commandes d'installation exactes, outils disponibles, prérequis.
            </p>
          </div>
        </div>
      </div>

      <div className="px-6 pt-8 max-w-3xl space-y-12">

        {/* MCP Servers */}
        <section>
          <div className="flex items-center gap-3 mb-5">
            <h2 className="text-[15px] font-semibold" style={{ color: '#e2e8f0' }}>MCP Serveurs — Claude Code (terminal)</h2>
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ color: '#4d96ff', background: 'rgba(77,150,255,0.12)', border: '0.5px solid rgba(77,150,255,0.2)' }}>
              {MCP_SERVERS.length} serveurs
            </span>
          </div>
          <p className="text-[12px] mb-5" style={{ color: '#5b6078' }}>
            Installés via <code style={{ fontFamily: 'Geist Mono, monospace', fontSize: 11, color: '#e2e8f0' }}>claude mcp add</code> ou le fichier <code style={{ fontFamily: 'Geist Mono, monospace', fontSize: 11, color: '#e2e8f0' }}>~/.mcp.json</code>. Claude Code peut AGIR directement dans ces outils.
          </p>
          <div className="space-y-2">
            {MCP_SERVERS.map(s => <McpServerCard key={s.id} s={s} />)}
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[12px] font-semibold" style={{ color: '#e2e8f0' }}>.mcp.json recommandé Buildrs (projet type SaaS)</p>
              <CopyBtn text={RECOMMENDED_MCP_JSON} label="Copier le JSON" />
            </div>
            <CodeBlock label=".mcp.json" code={RECOMMENDED_MCP_JSON} />
          </div>
        </section>

        {/* Connecteurs */}
        <section>
          <div className="flex items-center gap-3 mb-5">
            <h2 className="text-[15px] font-semibold" style={{ color: '#e2e8f0' }}>Connecteurs — Claude.ai / Cowork (interface graphique)</h2>
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ color: ACCENT, background: 'rgba(34,197,94,0.12)', border: '0.5px solid rgba(34,197,94,0.2)' }}>
              Un clic suffit
            </span>
          </div>
          <p className="text-[12px] mb-5" style={{ color: '#5b6078' }}>
            Installés via <span style={{ color: '#e2e8f0', fontFamily: 'Geist Mono, monospace', fontSize: 11 }}>Claude.ai → Settings → Integrations → Connect</span>.
          </p>

          <h3 className="text-[12px] font-semibold uppercase tracking-wider mb-3" style={{ color: '#5b6078' }}>Essentiels</h3>
          <div className="space-y-2 mb-6">
            {CONNECTORS_ESSENTIAL.map(c => <ConnectorCard key={c.name} c={c} />)}
          </div>

          <h3 className="text-[12px] font-semibold uppercase tracking-wider mb-3" style={{ color: '#5b6078' }}>Recommandés</h3>
          <div className="space-y-2 mb-6">
            {CONNECTORS_RECOMMENDED.map(c => <ConnectorCard key={c.name} c={c} />)}
          </div>

          <h3 className="text-[12px] font-semibold uppercase tracking-wider mb-3" style={{ color: '#5b6078' }}>Optionnels</h3>
          <div className="rounded-xl overflow-hidden" style={{ border: '0.5px solid rgba(255,255,255,0.07)' }}>
            {CONNECTORS_OPTIONAL.map((c, i) => (
              <div key={c.name} className="flex items-center justify-between px-4 py-3" style={{ borderBottom: i < CONNECTORS_OPTIONAL.length - 1 ? '0.5px solid rgba(255,255,255,0.05)' : undefined }}>
                <span className="text-[12px] font-medium" style={{ color: '#e2e8f0' }}>{c.name}</span>
                <span className="text-[12px]" style={{ color: '#5b6078' }}>{c.desc}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Ordre d'installation */}
        <section>
          <h2 className="text-[15px] font-semibold mb-5" style={{ color: '#e2e8f0' }}>Ordre d'installation recommandé Buildrs</h2>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider mb-3" style={{ color: '#4d96ff' }}>MCP Serveurs (Claude Code) — 10 min</p>
              <CodeBlock label="bash" code={INSTALL_COMMANDS} />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider mb-3" style={{ color: ACCENT }}>Connecteurs (Claude.ai) — 10 min</p>
              <div className="rounded-xl p-4 space-y-2" style={{ background: 'rgba(255,255,255,0.03)', border: '0.5px solid rgba(255,255,255,0.08)' }}>
                <p className="text-[11px] font-medium mb-3" style={{ color: '#5b6078', fontFamily: 'Geist Mono, monospace' }}>Claude.ai → Settings → Integrations</p>
                {['Vercel', 'Supabase', 'GitHub', 'Stripe', 'Context7', '21st.dev Magic', 'Figma', 'Notion', 'Stitch', 'tldraw', 'Tavily', 'Cloudflare'].map(n => (
                  <div key={n} className="flex items-center gap-2">
                    <span style={{ color: ACCENT, fontSize: 11 }}>→</span>
                    <span className="text-[12px]" style={{ color: '#e2e8f0' }}>{n}</span>
                    <span className="text-[10px]" style={{ color: '#3d4466' }}>— Connect</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.02)', border: '0.5px solid rgba(255,255,255,0.06)' }}>
            <p className="text-[11px]" style={{ color: '#5b6078' }}>Bibliothèque Buildrs · Mise à jour : 2026-04-04</p>
          </div>
        </section>

        {/* CTA */}
        <div className="rounded-2xl p-6" style={{ background: 'rgba(34,197,94,0.06)', border: '0.5px solid rgba(34,197,94,0.2)' }}>
          <h3 className="text-[14px] font-semibold mb-2" style={{ color: '#e2e8f0' }}>Pas sûr de quoi installer ?</h3>
          <p className="text-[12px] mb-4" style={{ color: '#94a3b8' }}>
            Utilise le Générateur MCP — décris ton projet en 3 étapes et obtiens la checklist d'installation personnalisée avec les commandes exactes.
          </p>
          <button onClick={() => navigate('#/dashboard/claude-os/apprendre/mcp-connecteurs/generateur')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[12px] font-semibold transition-all"
            style={{ background: 'rgba(139,92,246,0.15)', border: '0.5px solid rgba(139,92,246,0.3)', color: '#8b5cf6' }}>
            <ExternalLink size={13} strokeWidth={1.5} />
            Générateur MCP — setup personnalisé
          </button>
        </div>
      </div>
    </div>
  )
}
