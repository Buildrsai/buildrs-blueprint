import { useState, useCallback } from 'react'
import { ArrowLeft, Copy, Check, ChevronLeft, ChevronRight, Sparkles, RotateCcw } from 'lucide-react'

interface Props {
  navigate: (hash: string) => void
}

const ACCENT = '#8b5cf6'

// ── Types ─────────────────────────────────────────────────────────────────────

type ProjectType = 'micro-saas' | 'app-mobile' | 'marketplace' | 'outil-ia' | 'landing' | 'api-backend' | 'autre'

interface WizardValues {
  projectType: ProjectType | ''
  description: string
  needs: string[]
}

const PROJECT_TYPES: { id: ProjectType; label: string }[] = [
  { id: 'micro-saas', label: 'Micro-SaaS' },
  { id: 'app-mobile', label: 'App mobile (web)' },
  { id: 'marketplace', label: 'Marketplace' },
  { id: 'outil-ia', label: 'Outil IA' },
  { id: 'landing', label: 'Landing page / site vitrine' },
  { id: 'api-backend', label: 'API / Backend' },
  { id: 'autre', label: 'Autre' },
]

const NEEDS_OPTIONS: { id: string; label: string }[] = [
  { id: 'database', label: 'Base de données' },
  { id: 'auth', label: 'Authentification' },
  { id: 'payments', label: 'Paiements' },
  { id: 'deploy', label: 'Déploiement web' },
  { id: 'tests', label: 'Tests automatisés' },
  { id: 'analytics', label: 'Analytics' },
  { id: 'design', label: 'Design / Figma' },
  { id: 'monitoring', label: "Monitoring d'erreurs" },
  { id: 'search', label: 'Recherche web / docs' },
  { id: 'automation', label: 'Automatisations (n8n)' },
  { id: 'prospecting', label: 'Prospection / enrichissement' },
  { id: 'ui-components', label: 'Composants UI premium' },
  { id: 'presentations', label: 'Présentations / design visuel' },
]

// ── Logic ─────────────────────────────────────────────────────────────────────

interface McpRec {
  name: string
  why: string
  install: string
  essential?: boolean
}

interface ConnectorRec {
  name: string
  why: string
  essential?: boolean
}

function buildRecommendation(values: WizardValues): { mcps: McpRec[]; connectors: ConnectorRec[] } {
  const mcps: McpRec[] = []
  const connectors: ConnectorRec[] = []
  const needs = new Set(values.needs)
  const pt = values.projectType

  // Always: GitHub + Vercel connectors
  connectors.push({ name: 'GitHub', why: 'Versioning de ton code. Indispensable quel que soit le projet.', essential: true })
  connectors.push({ name: 'Vercel', why: 'Déploiement web. Logs de production et statut des deploys depuis Claude.', essential: true })
  connectors.push({ name: 'Context7', why: 'Documentation officielle de chaque lib en temps réel. Claude ne code plus avec des docs obsolètes.', essential: true })

  // Database / Auth
  if (needs.has('database') || needs.has('auth') || pt === 'micro-saas' || pt === 'app-mobile' || pt === 'marketplace' || pt === 'api-backend') {
    mcps.push({
      name: 'Supabase MCP',
      essential: true,
      why: 'Ton backend complet. Claude exécute du SQL, crée des migrations, déploie des Edge Functions et génère les types TypeScript directement.',
      install: `claude mcp add --transport stdio supabase \\
  --env SUPABASE_ACCESS_TOKEN=sbp_your_token \\
  -- npx -y @supabase/mcp-server`,
    })
    connectors.push({ name: 'Supabase', why: 'Accès complet à ta base de données, auth et storage depuis Claude.ai et Cowork.', essential: true })
  }

  // Payments
  if (needs.has('payments') || pt === 'micro-saas' || pt === 'marketplace') {
    connectors.push({ name: 'Stripe', why: 'Gestion des produits, prix, clients, factures et debug de webhooks depuis Claude.', essential: true })
  }

  // Tests
  if (needs.has('tests') || pt === 'micro-saas' || pt === 'app-mobile' || pt === 'marketplace') {
    mcps.push({
      name: 'Playwright MCP',
      essential: true,
      why: 'Claude ouvre un vrai navigateur, clique, remplit des formulaires, prend des screenshots. Indispensable pour le debug visuel et les tests E2E.',
      install: `claude mcp add --transport stdio playwright \\
  -- npx -y @playwright/mcp@latest`,
    })
  }

  // Fetch / Search / Docs
  if (needs.has('search') || pt === 'outil-ia') {
    mcps.push({
      name: 'Fetch MCP',
      why: 'Claude récupère du contenu web et le convertit en format exploitable. Documentation, API REST, scraping de pages.',
      install: `claude mcp add --transport stdio fetch \\
  -- npx -y @modelcontextprotocol/server-fetch`,
    })
    connectors.push({ name: 'Tavily', why: 'Recherche web en temps réel depuis Claude — résultats structurés et à jour.' })
  }

  // Analytics
  if (needs.has('analytics')) {
    connectors.push({ name: 'Amplitude', why: 'Analytics produit, entonnoirs, cohortes et métriques directement analysables par Claude.' })
  }

  // Design / Figma
  if (needs.has('design') || pt === 'landing') {
    connectors.push({ name: 'Figma', why: 'Lecture + écriture dans Figma. Design-to-code et code-to-design depuis Claude.', essential: true })
    connectors.push({ name: '21st.dev Magic', why: 'Génération de composants UI premium avec variants et dark mode.', essential: true })
    connectors.push({ name: 'Stitch', why: "Assemblage d'interfaces UI. Maquettage rapide avec design system." })
    connectors.push({ name: 'Canva', why: 'Créer et exporter des designs (bannières, posts réseaux sociaux, présentations).' })
  } else if (pt !== 'api-backend') {
    // UI components for most projects
    connectors.push({ name: '21st.dev Magic', why: 'Génération de composants UI premium pour accélérer le développement front.' })
  }

  // Monitoring
  if (needs.has('monitoring') || pt === 'micro-saas' || pt === 'api-backend') {
    mcps.push({
      name: 'Sentry MCP',
      why: "Monitoring d'erreurs en temps réel. Claude analyse les stack traces et suggère des corrections directement.",
      install: `claude mcp add --transport http sentry https://mcp.sentry.dev/mcp
# Puis dans Claude Code : /mcp → Authenticate (OAuth)`,
    })
  }

  // Automation
  if (needs.has('automation')) {
    connectors.push({ name: 'n8n', why: 'Claude peut déclencher des workflows n8n, consulter des exécutions et intégrer des automatisations.' })
  }

  // Prospecting
  if (needs.has('prospecting')) {
    connectors.push({ name: 'Vibe Prospecting', why: 'Prospection et enrichissement de leads (entreprises, contacts) directement depuis Claude.' })
  }

  // UI Components
  if (needs.has('ui-components')) {
    if (!connectors.find(c => c.name === '21st.dev Magic')) {
      connectors.push({ name: '21st.dev Magic', why: 'Génération de composants UI premium avec variants, dark mode et accessibilité.' })
    }
  }

  // Presentations
  if (needs.has('presentations')) {
    connectors.push({ name: 'Canva', why: 'Créer et exporter des designs et présentations depuis Claude.' })
    connectors.push({ name: 'tldraw', why: 'Créer des diagrammes, schémas et wireframes visuels.' })
  }

  // Notion (always useful for doc)
  connectors.push({ name: 'Notion', why: 'Documentation et bases de données de contenu. Synchronisation depuis Claude.' })

  return { mcps, connectors }
}

function buildMcpJson(mcps: McpRec[]): string {
  const entries: Record<string, unknown> = {}
  for (const mcp of mcps) {
    if (mcp.name === 'Supabase MCP') {
      entries['supabase'] = { command: 'npx', args: ['-y', '@supabase/mcp-server'], env: { SUPABASE_ACCESS_TOKEN: '${SUPABASE_ACCESS_TOKEN}' } }
    } else if (mcp.name === 'Playwright MCP') {
      entries['playwright'] = { command: 'npx', args: ['-y', '@playwright/mcp@latest'] }
    } else if (mcp.name === 'Fetch MCP') {
      entries['fetch'] = { command: 'npx', args: ['-y', '@modelcontextprotocol/server-fetch'] }
    } else if (mcp.name === 'Sentry MCP') {
      entries['sentry'] = { type: 'http', url: 'https://mcp.sentry.dev/mcp' }
    }
  }
  if (Object.keys(entries).length === 0) return '{}'
  return JSON.stringify({ mcpServers: entries }, null, 2)
}

// ── UI Components ─────────────────────────────────────────────────────────────

function CopyBtn({ text, label }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false)
  const doCopy = useCallback(() => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [text])
  return (
    <button onClick={doCopy}
      className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-medium transition-all"
      style={{ background: copied ? 'rgba(34,197,94,0.12)' : 'rgba(255,255,255,0.06)', border: `0.5px solid ${copied ? 'rgba(34,197,94,0.3)' : 'rgba(255,255,255,0.1)'}`, color: copied ? '#22c55e' : '#94a3b8' }}>
      {copied ? <Check size={12} strokeWidth={2} /> : <Copy size={12} strokeWidth={1.5} />}
      {copied ? 'Copié !' : label ?? 'Copier'}
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
    <div className="relative rounded-xl overflow-hidden" style={{ background: 'rgba(0,0,0,0.4)', border: '0.5px solid rgba(255,255,255,0.08)' }}>
      {label && (
        <div className="px-4 py-1.5" style={{ borderBottom: '0.5px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)' }}>
          <span className="text-[10px] font-medium" style={{ fontFamily: 'Geist Mono, monospace', color: '#5b6078' }}>{label}</span>
        </div>
      )}
      <pre className="px-4 py-4 overflow-x-auto text-[11px] leading-relaxed" style={{ fontFamily: 'Geist Mono, ui-monospace, monospace', color: '#c9d1d9' }}>
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

// ── Steps ─────────────────────────────────────────────────────────────────────

function Step1({ values, onChange }: { values: WizardValues; onChange: (v: Partial<WizardValues>) => void }) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-[12px] font-semibold mb-3" style={{ color: '#e2e8f0' }}>Type de projet <span style={{ color: '#ef4444' }}>*</span></label>
        <div className="grid grid-cols-2 gap-2">
          {PROJECT_TYPES.map(pt => {
            const active = values.projectType === pt.id
            return (
              <button key={pt.id} onClick={() => onChange({ projectType: pt.id })}
                className="text-left px-4 py-3 rounded-xl text-[12px] font-medium transition-all"
                style={{
                  background: active ? `rgba(139,92,246,0.15)` : 'rgba(255,255,255,0.03)',
                  border: `0.5px solid ${active ? 'rgba(139,92,246,0.4)' : 'rgba(255,255,255,0.07)'}`,
                  color: active ? '#e2e8f0' : '#94a3b8',
                }}>
                {pt.label}
              </button>
            )
          })}
        </div>
      </div>
      <div>
        <label className="block text-[12px] font-semibold mb-2" style={{ color: '#e2e8f0' }}>Description courte <span style={{ color: '#ef4444' }}>*</span></label>
        <input
          value={values.description}
          onChange={e => onChange({ description: e.target.value })}
          placeholder="Ex: App de facturation pour freelances avec abonnement mensuel"
          className="w-full px-4 py-3 rounded-xl text-[13px] transition-all outline-none"
          style={{ background: 'rgba(255,255,255,0.04)', border: `0.5px solid ${values.description ? 'rgba(139,92,246,0.3)' : 'rgba(255,255,255,0.08)'}`, color: '#e2e8f0' }}
        />
      </div>
    </div>
  )
}

function Step2({ values, onChange }: { values: WizardValues; onChange: (v: Partial<WizardValues>) => void }) {
  const toggleNeed = (id: string) => {
    const current = values.needs
    onChange({ needs: current.includes(id) ? current.filter(n => n !== id) : [...current, id] })
  }
  return (
    <div>
      <p className="text-[12px] mb-4" style={{ color: '#5b6078' }}>Coche tout ce qui s'applique. Plus tu es précis, plus la recommandation sera pertinente.</p>
      <div className="grid grid-cols-2 gap-2">
        {NEEDS_OPTIONS.map(n => {
          const active = values.needs.includes(n.id)
          return (
            <button key={n.id} onClick={() => toggleNeed(n.id)}
              className="flex items-center gap-2 px-4 py-3 rounded-xl text-[12px] font-medium transition-all text-left"
              style={{
                background: active ? 'rgba(139,92,246,0.12)' : 'rgba(255,255,255,0.03)',
                border: `0.5px solid ${active ? 'rgba(139,92,246,0.35)' : 'rgba(255,255,255,0.07)'}`,
                color: active ? '#e2e8f0' : '#94a3b8',
              }}>
              <div className="w-3.5 h-3.5 rounded-sm flex items-center justify-center shrink-0 transition-all"
                style={{ background: active ? ACCENT : 'rgba(255,255,255,0.08)', border: `0.5px solid ${active ? ACCENT : 'rgba(255,255,255,0.15)'}` }}>
                {active && <Check size={9} strokeWidth={3} style={{ color: 'white' }} />}
              </div>
              {n.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function Step3({ values, navigate }: { values: WizardValues; navigate: (hash: string) => void }) {
  const { mcps, connectors } = buildRecommendation(values)
  const mcpJson = buildMcpJson(mcps)
  const allInstallCmds = mcps.map(m => m.install).join('\n\n')
  const connectorChecklist = connectors.map(c => `→ ${c.name} — Connect`).join('\n')
  const ptLabel = PROJECT_TYPES.find(p => p.id === values.projectType)?.label ?? values.projectType

  return (
    <div className="space-y-8">
      {/* Summary */}
      <div className="rounded-xl p-4" style={{ background: 'rgba(139,92,246,0.08)', border: '0.5px solid rgba(139,92,246,0.2)' }}>
        <p className="text-[12px]" style={{ color: '#94a3b8' }}>
          <span style={{ color: '#e2e8f0', fontWeight: 600 }}>{ptLabel}</span>{' '}
          {values.description && <span>— {values.description}</span>}
        </p>
        <p className="text-[11px] mt-1" style={{ color: '#5b6078' }}>
          {mcps.length} MCP Server{mcps.length > 1 ? 's' : ''} · {connectors.length} Connecteur{connectors.length > 1 ? 's' : ''}
        </p>
      </div>

      {/* Section A — MCP Servers */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[13px] font-semibold" style={{ color: '#4d96ff' }}>MCP Serveurs (Claude Code)</h3>
          {mcps.length > 0 && <CopyBtn text={allInstallCmds} label="Copier toutes les commandes" />}
        </div>

        {mcps.length === 0 ? (
          <p className="text-[12px]" style={{ color: '#5b6078' }}>Aucun MCP Server spécifique requis pour ce projet. Les connecteurs Claude.ai suffisent.</p>
        ) : (
          <div className="space-y-4">
            {mcps.map(m => (
              <div key={m.name} className="rounded-xl overflow-hidden" style={{ border: '0.5px solid rgba(77,150,255,0.15)', background: 'rgba(77,150,255,0.04)' }}>
                <div className="px-4 pt-4 pb-2">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[12px] font-semibold" style={{ color: '#4d96ff', fontFamily: 'Geist Mono, monospace' }}>{m.name}</span>
                    {m.essential && <span className="text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded" style={{ color: '#eab308', background: 'rgba(234,179,8,0.12)' }}>Essentiel</span>}
                  </div>
                  <p className="text-[12px]" style={{ color: '#94a3b8' }}>{m.why}</p>
                </div>
                <div className="px-4 pb-4">
                  <CodeBlock label="bash" code={m.install} />
                </div>
              </div>
            ))}
          </div>
        )}

        {mcps.length > 0 && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[11px] font-medium" style={{ color: '#e2e8f0' }}>.mcp.json complet prêt à utiliser</p>
              <CopyBtn text={mcpJson} label="Copier le .mcp.json" />
            </div>
            <CodeBlock label=".mcp.json" code={mcpJson} />
          </div>
        )}
      </div>

      {/* Section B — Connectors */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[13px] font-semibold" style={{ color: '#22c55e' }}>Connecteurs (Claude.ai)</h3>
          <CopyBtn text={`Claude.ai → Settings → Integrations\n\n${connectorChecklist}`} label="Copier la checklist" />
        </div>

        <p className="text-[11px] mb-3" style={{ color: '#5b6078', fontFamily: 'Geist Mono, monospace' }}>Claude.ai → Settings → Integrations</p>

        <div className="rounded-xl overflow-hidden" style={{ border: '0.5px solid rgba(255,255,255,0.08)' }}>
          {connectors.map((c, i) => (
            <div key={c.name} className="px-4 py-3" style={{ borderBottom: i < connectors.length - 1 ? '0.5px solid rgba(255,255,255,0.05)' : undefined }}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[12px] font-semibold" style={{ color: '#e2e8f0' }}>{c.name}</span>
                    {c.essential && <span className="text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded" style={{ color: '#eab308', background: 'rgba(234,179,8,0.12)' }}>Essentiel</span>}
                  </div>
                  <p className="text-[11px]" style={{ color: '#5b6078' }}>{c.why}</p>
                </div>
                <span className="text-[10px] shrink-0 px-2 py-1 rounded-lg" style={{ color: '#22c55e', background: 'rgba(34,197,94,0.1)', border: '0.5px solid rgba(34,197,94,0.2)' }}>→ Connect</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="flex flex-wrap gap-3">
        <button onClick={() => navigate('#/dashboard/claude-os/apprendre/mcp-connecteurs/ressources-buildrs')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[12px] font-semibold transition-all"
          style={{ background: 'rgba(34,197,94,0.12)', border: '0.5px solid rgba(34,197,94,0.25)', color: '#22c55e' }}>
          Voir la bibliothèque complète
        </button>
        <button onClick={() => navigate('#/dashboard/claude-os/apprendre/mcp-connecteurs/formation')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[12px] font-semibold transition-all"
          style={{ background: 'rgba(77,150,255,0.1)', border: '0.5px solid rgba(77,150,255,0.2)', color: '#4d96ff' }}>
          Lire la formation MCP
        </button>
      </div>
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────

const EMPTY_VALUES: WizardValues = { projectType: '', description: '', needs: [] }
const TOTAL_STEPS = 3

const STEP_LABELS = [
  'Décris ton projet',
  'De quoi ton projet a besoin ?',
  'Ton setup MCP & Connecteurs',
]

export function McpGeneratorPage({ navigate }: Props) {
  const [step, setStep] = useState(1)
  const [values, setValues] = useState<WizardValues>(EMPTY_VALUES)
  const [done, setDone] = useState(false)

  const update = useCallback((v: Partial<WizardValues>) => setValues(prev => ({ ...prev, ...v })), [])

  const canNext = () => {
    if (step === 1) return values.projectType !== '' && values.description.trim().length >= 3
    if (step === 2) return values.needs.length > 0
    return true
  }

  const handleNext = () => {
    if (step < TOTAL_STEPS) setStep(s => s + 1)
    else setDone(true)
  }

  const reset = () => {
    setValues(EMPTY_VALUES)
    setStep(1)
    setDone(false)
  }

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
            style={{ background: `rgba(139,92,246,0.15)`, border: `0.5px solid rgba(139,92,246,0.3)` }}>
            <Sparkles size={18} strokeWidth={1.5} style={{ color: ACCENT }} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full"
                style={{ color: ACCENT, background: 'rgba(139,92,246,0.12)', border: '0.5px solid rgba(139,92,246,0.25)' }}>
                Générateur
              </span>
              <span className="text-[10px]" style={{ color: '#3d4466' }}>3 étapes · Résultat immédiat</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight" style={{ color: '#e2e8f0' }}>Générateur MCP</h1>
            <p className="text-[13px] mt-1" style={{ color: '#5b6078' }}>
              Décris ton projet — on te recommande les MCP Serveurs et Connecteurs essentiels avec les commandes exactes.
            </p>
          </div>
        </div>
      </div>

      <div className="px-6 pt-8 max-w-2xl">
        {/* Progress */}
        {!done && (
          <div className="flex items-center gap-2 mb-8">
            {[1, 2, 3].map(s => (
              <div key={s} className="flex items-center gap-2">
                <div className="flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-bold transition-all"
                  style={{
                    background: s < step ? '#22c55e' : s === step ? ACCENT : 'rgba(255,255,255,0.06)',
                    border: `0.5px solid ${s < step ? '#22c55e' : s === step ? ACCENT : 'rgba(255,255,255,0.1)'}`,
                    color: s <= step ? 'white' : '#3d4466',
                  }}>
                  {s < step ? <Check size={10} strokeWidth={3} /> : s}
                </div>
                <span className="text-[11px] hidden sm:block" style={{ color: s === step ? '#e2e8f0' : '#3d4466' }}>
                  {STEP_LABELS[s - 1]}
                </span>
                {s < 3 && <ChevronRight size={12} strokeWidth={1.5} style={{ color: '#2a2d3e' }} />}
              </div>
            ))}
          </div>
        )}

        {/* Card */}
        <div className="rounded-2xl p-6 mb-6" style={{ border: '0.5px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)' }}>
          {!done ? (
            <>
              <h2 className="text-[14px] font-semibold mb-1" style={{ color: '#e2e8f0' }}>Étape {step} — {STEP_LABELS[step - 1]}</h2>
              <p className="text-[12px] mb-5" style={{ color: '#5b6078' }}>
                {step === 1 && "On va te recommander les MCP Serveurs et Connecteurs essentiels pour ton projet."}
                {step === 2 && "Plus tu es précis, plus la recommandation sera pertinente."}
                {step === 3 && ""}
              </p>

              {step === 1 && <Step1 values={values} onChange={update} />}
              {step === 2 && <Step2 values={values} onChange={update} />}
            </>
          ) : (
            <>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-[14px] font-semibold" style={{ color: '#e2e8f0' }}>Ton setup MCP & Connecteurs</h2>
                  <p className="text-[12px] mt-0.5" style={{ color: '#5b6078' }}>Checklist d'installation personnalisée</p>
                </div>
                <button onClick={reset} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] transition-all"
                  style={{ color: '#5b6078', border: '0.5px solid rgba(255,255,255,0.08)' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#e2e8f0')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#5b6078')}>
                  <RotateCcw size={11} strokeWidth={1.5} /> Nouveau projet
                </button>
              </div>
              <Step3 values={values} navigate={navigate} />
            </>
          )}
        </div>

        {/* Navigation */}
        {!done && (
          <div className="flex items-center justify-between">
            <button onClick={() => step > 1 ? setStep(s => s - 1) : window.history.back()}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[12px] font-medium transition-all"
              style={{ color: '#5b6078', border: '0.5px solid rgba(255,255,255,0.08)' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#e2e8f0')}
              onMouseLeave={e => (e.currentTarget.style.color = '#5b6078')}>
              <ChevronLeft size={14} strokeWidth={1.5} />
              {step === 1 ? 'Retour' : 'Précédent'}
            </button>

            <button onClick={handleNext} disabled={!canNext()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[12px] font-semibold transition-all"
              style={{
                background: canNext() ? ACCENT : 'rgba(255,255,255,0.05)',
                color: canNext() ? 'white' : '#3d4466',
                border: `0.5px solid ${canNext() ? ACCENT : 'rgba(255,255,255,0.08)'}`,
                cursor: canNext() ? 'pointer' : 'not-allowed',
              }}>
              {step === TOTAL_STEPS ? (
                <><Sparkles size={13} strokeWidth={1.5} />Générer mon setup</>
              ) : (
                <>Suivant <ChevronRight size={14} strokeWidth={1.5} /></>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
