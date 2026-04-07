import { useState, useCallback } from 'react'
import { ArrowLeft, Copy, Check, ChevronDown, Package, Star, ExternalLink } from 'lucide-react'

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
    <div className="relative rounded-xl overflow-hidden my-3" style={{ background: 'rgba(0,0,0,0.4)', border: '0.5px solid rgba(255,255,255,0.08)' }}>
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

interface PluginDef {
  name: string
  command: string
  why: string
  skills?: string[]
  github?: string
  stars?: string
  essential?: boolean
  prereq?: string
}

const PLUGINS_CORE: PluginDef[] = [
  {
    name: 'superpowers',
    command: '/install-plugin superpowers@claude-plugins-official',
    why: "Le plugin le plus important. Sans lui, Claude improvise. Avec lui, il suit une méthodologie structurée : brainstorm → plan → implémentation → review. Transforme Claude d'un junior qui code n'importe quoi en senior qui réfléchit avant d'agir.",
    skills: ['brainstorm', 'write-plan', 'execute-plan', 'systematic-debugging', 'test-driven-development', 'dispatching-parallel-agents', 'verification-before-completion', 'finishing-a-development-branch', 'writing-skills'],
    github: 'https://github.com/obra/superpowers',
    stars: '133k+',
    essential: true,
  },
  {
    name: 'feature-dev',
    command: '/install-plugin feature-dev@claude-plugins-official',
    why: "3 spécialistes en pipeline : code-explorer (analyse le codebase) → code-architect (conçoit l'architecture) → code-reviewer (review le code). 3x plus précis pour les features complexes.",
    essential: true,
  },
  {
    name: 'code-review',
    command: '/install-plugin code-review@claude-plugins-official',
    why: "Review systématique avec 5 agents parallèles : conformité CLAUDE.md, détection de bugs, contexte historique, historique PR, commentaires de code. Scoring basé sur la confiance pour filtrer les faux positifs.",
    essential: true,
  },
  {
    name: 'security-guidance',
    command: '/install-plugin security-guidance@claude-plugins-official',
    why: "Détecte automatiquement 9 patterns de sécurité dangereux : injection de commandes, XSS, eval non sécurisé, HTML dangereux, appels système non contrôlés… Claude peut introduire des failles sans le savoir — ce plugin ajoute un filet de sécurité.",
    essential: true,
  },
  {
    name: 'skill-creator',
    command: '/install-plugin skill-creator@claude-plugins-official',
    why: "Le plugin méta : il crée d'autres skills. Tu décris ce que tu veux automatiser, Claude génère le SKILL.md complet avec frontmatter, instructions, et structure. C'est comme ça qu'on crée les skills custom Buildrs.",
    essential: true,
  },
  {
    name: 'commit-commands',
    command: '/install-plugin commit-commands@claude-plugins-official',
    why: "Commits intelligents formatés automatiquement.",
    skills: ['/commit — commit propre', '/commit-push-pr — commit + push + PR GitHub en une commande'],
  },
  {
    name: 'claude-md-management',
    command: '/install-plugin claude-md-management@claude-plugins-official',
    why: "Crée et maintient tes fichiers CLAUDE.md.",
    skills: ['/claude-md-management:claude-md-improver', '/claude-md-management:revise-claude-md'],
  },
  {
    name: 'code-simplifier',
    command: '/install-plugin code-simplifier@claude-plugins-official',
    why: "Agent de clarté du code : simplifie et affine le code modifié tout en préservant la fonctionnalité et la cohérence.",
  },
  {
    name: 'hookify',
    command: '/install-plugin hookify@claude-plugins-official',
    why: "Aide à créer et gérer les hooks Claude Code (SessionStart, PreToolUse, Stop) pour automatiser des comportements.",
  },
  {
    name: 'ralph-loop',
    command: '/install-plugin ralph-loop@claude-plugins-official',
    why: "Boucle d'itération autonome. /ralph-loop pour démarrer, /cancel-ralph pour arrêter. Claude itère en continu sans intervention.",
    skills: ['/ralph-loop — démarre la boucle', '/cancel-ralph — arrête la boucle'],
  },
]

const PLUGINS_PLATFORM: PluginDef[] = [
  {
    name: 'vercel',
    command: '/install-plugin vercel@claude-plugins-official',
    why: "Skills et agents spécialisés Vercel : deploy avec vérifications, bootstrap de projet, gestion env vars, statut des deployments, guide AI SDK v6, guide Next.js App Router. Complète le connecteur MCP Vercel.",
    skills: ['/vercel:deploy', '/vercel:bootstrap', '/vercel:env', '/vercel:status', '/vercel:ai-sdk', '/vercel:nextjs', '/vercel:workflow'],
    essential: true,
  },
  {
    name: 'supabase',
    command: '/install-plugin supabase@claude-plugins-official',
    why: "Skills spécialisés Auth, Database, Storage, Edge Functions. Inclut les best practices Postgres et RLS. Complète le MCP Supabase.",
    essential: true,
  },
  {
    name: 'stripe',
    command: '/install-plugin stripe@claude-plugins-official',
    why: "Patterns Stripe production-ready, debug d'erreurs Stripe, cartes de test par scénario. Indispensable pour tout SaaS avec paiement.",
    skills: ['/stripe:stripe-best-practices', '/stripe:explain-error', '/stripe:test-cards'],
    essential: true,
  },
  {
    name: 'github',
    command: '/install-plugin github@claude-plugins-official',
    why: "Claude peut créer des issues, ouvrir des PRs, lire l'historique git, commenter du code — sans quitter la conversation.",
  },
  {
    name: 'playwright',
    command: '/install-plugin playwright@claude-plugins-official',
    why: "Claude ouvre un vrai navigateur (Chromium), clique, remplit des formulaires, prend des screenshots. Debug visuel et tests E2E.",
  },
  {
    name: 'figma',
    command: '/install-plugin figma@claude-plugins-official',
    why: "Claude lit tes designs Figma et les traduit en code. Design-to-code automatique.",
    skills: ['/figma:figma-implement-design', '/figma:figma-use', '/figma:figma-generate-design'],
  },
  {
    name: 'posthog',
    command: '/install-plugin posthog@claude-plugins-official',
    why: "Analytics produit, feature flags, A/B tests, error tracking — tout piloté depuis Claude. 15 skills inclus.",
  },
  {
    name: 'postgres-best-practices',
    command: '/install-plugin postgres-best-practices@supabase-agent-skills',
    why: "Best practices Postgres spécifiques : indexation, requêtes performantes, sécurité RLS, migrations propres. Complète le plugin Supabase.",
    prereq: '/add-marketplace https://github.com/supabase/agent-skills',
    github: 'https://github.com/supabase/agent-skills',
  },
]

const PLUGINS_DESIGN: PluginDef[] = [
  {
    name: 'frontend-design',
    command: '/install-plugin frontend-design@claude-plugins-official',
    why: "Transforme Claude en designer Figma-level. Hiérarchie visuelle, spacing système, accessibilité, composants réutilisables. S'active automatiquement sur les fichiers TSX/CSS.",
    essential: true,
  },
  {
    name: 'brand-guidelines',
    command: '/install-plugin brand-guidelines@claude-plugins-official',
    why: "Applique ta charte graphique automatiquement. Chez Buildrs : #080909, Instrument Serif + Geist, dots pattern, Lucide icons.",
  },
  {
    name: 'canvas-design',
    command: '/install-plugin canvas-design@claude-plugins-official',
    why: "Design créatif — posters, visuels, art. Utile pour les assets marketing et les illustrations.",
  },
]

const PLUGINS_MARKETING: PluginDef[] = [
  {
    name: 'marketing-skills',
    command: '/install-plugin marketing-skills@marketingskills',
    why: "30+ skills spécialisés copywriting, SEO, growth, CRO, pricing, ads, email sequences. Tout le marketing d'un SaaS en commandes Claude.",
    prereq: '/add-marketplace https://github.com/coreyhaines31/marketingskills',
    github: 'https://github.com/coreyhaines31/marketingskills',
  },
]

const PLUGINS_COMMS: PluginDef[] = [
  {
    name: 'telegram',
    command: '/install-plugin telegram@claude-plugins-official',
    why: "Pilote Claude Code depuis ton téléphone via Telegram.",
  },
  {
    name: 'discord',
    command: '/install-plugin discord@claude-plugins-official',
    why: "Pilote Claude Code depuis Discord.",
  },
  {
    name: 'slack',
    command: '/install-plugin slack@claude-plugins-official',
    why: "Résumés de canaux, drafts d'annonces, standup automatique.",
  },
  {
    name: 'gsd',
    command: '/install-plugin gsd@gsd-marketplace',
    why: "Plugin de productivité brute. Workflows orientés 'ship fast' : moins de réflexion, plus d'exécution. Complémentaire à Superpowers — GSD est pour les moments où tu sais ce que tu veux et tu veux juste que ce soit fait.",
    github: 'https://github.com/gsd-build/get-shit-done',
  },
]

function PluginCard({ p }: { p: PluginDef }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="rounded-xl overflow-hidden" style={{ border: '0.5px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)' }}>
      <button className="w-full flex items-center justify-between px-4 py-3 text-left transition-colors"
        onClick={() => setOpen(o => !o)}
        style={{ background: open ? 'rgba(255,255,255,0.03)' : undefined }}>
        <div className="flex items-center gap-3 min-w-0">
          {p.essential && <Star size={11} strokeWidth={2} style={{ color: '#eab308' }} />}
          <code className="text-[12px] font-semibold truncate" style={{ fontFamily: 'Geist Mono, monospace', color: '#e2e8f0' }}>{p.name}</code>
          {p.essential && <span className="text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded shrink-0" style={{ color: '#eab308', background: 'rgba(234,179,8,0.12)', border: '0.5px solid rgba(234,179,8,0.25)' }}>Essentiel</span>}
          {p.stars && <span className="text-[10px] shrink-0" style={{ color: '#eab308' }}>⭐ {p.stars}</span>}
        </div>
        <ChevronDown size={13} strokeWidth={1.5} style={{ color: '#3d4466', transform: open ? 'rotate(180deg)' : undefined, transition: 'transform 200ms' }} />
      </button>
      {open && (
        <div className="px-4 pb-4 space-y-3" style={{ borderTop: '0.5px solid rgba(255,255,255,0.05)' }}>
          <p className="text-[12px] pt-3 leading-relaxed" style={{ color: '#94a3b8' }}>{p.why}</p>
          {p.prereq && (
            <div className="rounded-lg px-3 py-2" style={{ background: 'rgba(234,179,8,0.06)', border: '0.5px solid rgba(234,179,8,0.2)' }}>
              <p className="text-[10px] font-semibold mb-1" style={{ color: '#eab308' }}>Prérequis — ajouter la marketplace d'abord</p>
              <div className="flex items-center justify-between gap-2">
                <code className="text-[11px]" style={{ fontFamily: 'Geist Mono, monospace', color: '#e2e8f0' }}>{p.prereq}</code>
                <CopyBtn text={p.prereq} />
              </div>
            </div>
          )}
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#3d4466' }}>Commande d'installation</p>
            <div className="relative rounded-lg overflow-hidden" style={{ background: 'rgba(0,0,0,0.3)', border: '0.5px solid rgba(255,255,255,0.07)' }}>
              <code className="block px-4 py-3 text-[11px] pr-24 break-all" style={{ fontFamily: 'Geist Mono, monospace', color: '#c9d1d9' }}>
                {p.command}
              </code>
              <div className="absolute top-2 right-2">
                <CopyBtn text={p.command} />
              </div>
            </div>
          </div>
          {p.skills && p.skills.length > 0 && (
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider mb-2" style={{ color: '#3d4466' }}>Skills inclus</p>
              <div className="flex flex-wrap gap-1.5">
                {p.skills.map(s => (
                  <span key={s} className="text-[10px] px-2 py-0.5 rounded-lg" style={{ fontFamily: 'Geist Mono, monospace', color: ACCENT, background: 'rgba(34,197,94,0.08)', border: '0.5px solid rgba(34,197,94,0.2)' }}>{s}</span>
                ))}
              </div>
            </div>
          )}
          {p.github && (
            <div className="flex items-center gap-2">
              <ExternalLink size={11} strokeWidth={1.5} style={{ color: '#3d4466' }} />
              <a href={p.github} target="_blank" rel="noopener noreferrer"
                className="text-[11px] transition-colors" style={{ color: '#5b6078' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#4d96ff')}
                onMouseLeave={e => (e.currentTarget.style.color = '#5b6078')}>
                {p.github.replace('https://', '')}
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function PluginGroup({ title, count, accent = '#5b6078', plugins }: { title: string; count: number; accent?: string; plugins: PluginDef[] }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <h3 className="text-[12px] font-semibold uppercase tracking-wider" style={{ color: accent }}>{title}</h3>
        <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ color: accent, background: `${accent}18`, border: `0.5px solid ${accent}30` }}>{count}</span>
      </div>
      <div className="space-y-2">
        {plugins.map(p => <PluginCard key={p.name} p={p} />)}
      </div>
    </div>
  )
}

const PHASE1 = `/add-marketplace https://github.com/anthropics/claude-plugins-official
/add-marketplace https://github.com/obra/superpowers-marketplace
/add-marketplace https://github.com/supabase/agent-skills
/add-marketplace https://github.com/coreyhaines31/marketingskills`

const PHASE2 = `/install-plugin superpowers@claude-plugins-official
/install-plugin frontend-design@claude-plugins-official
/install-plugin feature-dev@claude-plugins-official
/install-plugin code-review@claude-plugins-official
/install-plugin security-guidance@claude-plugins-official
/install-plugin skill-creator@claude-plugins-official
/install-plugin commit-commands@claude-plugins-official
/install-plugin claude-md-management@claude-plugins-official`

const PHASE3 = `/install-plugin vercel@claude-plugins-official
/install-plugin supabase@claude-plugins-official
/install-plugin stripe@claude-plugins-official
/install-plugin github@claude-plugins-official
/install-plugin playwright@claude-plugins-official
/install-plugin figma@claude-plugins-official
/install-plugin posthog@claude-plugins-official
/install-plugin postgres-best-practices@supabase-agent-skills`

const PHASE4 = `/install-plugin brand-guidelines@claude-plugins-official
/install-plugin marketing-skills@marketingskills
/install-plugin canvas-design@claude-plugins-official`

const PHASE5 = `/install-plugin telegram@claude-plugins-official
/install-plugin discord@claude-plugins-official
/install-plugin slack@claude-plugins-official`

export function PluginsRessourcesPage({ navigate }: Props) {
  return (
    <div className="min-h-screen pb-20" style={{ background: '#080909' }}>
      <div className="px-6 pt-6 pb-4" style={{ borderBottom: '0.5px solid rgba(255,255,255,0.06)' }}>
        <button onClick={() => window.history.back()}
          className="flex items-center gap-2 mb-5 transition-colors"
          style={{ color: '#5b6078' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#e2e8f0')}
          onMouseLeave={e => (e.currentTarget.style.color = '#5b6078')}>
          <ArrowLeft size={14} strokeWidth={1.5} />
          <span className="text-[12px]">Plugins</span>
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
              <span className="text-[10px]" style={{ color: '#3d4466' }}>22 plugins · 5 phases · ~15 min</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight" style={{ color: '#e2e8f0' }}>Bibliothèque Ressources Plugins</h1>
            <p className="text-[13px] mt-1" style={{ color: '#5b6078' }}>
              Tous les plugins qu'on utilise en interne chez Buildrs. Commandes exactes, skills inclus, ordre d'installation.
            </p>
          </div>
        </div>
      </div>

      <div className="px-6 pt-8 max-w-3xl space-y-10">
        <PluginGroup title="Core — Workflow & Qualité" count={PLUGINS_CORE.length} accent="#4d96ff" plugins={PLUGINS_CORE} />
        <PluginGroup title="Plateforme — Stack Buildrs" count={PLUGINS_PLATFORM.length} accent={ACCENT} plugins={PLUGINS_PLATFORM} />
        <PluginGroup title="Design & UI" count={PLUGINS_DESIGN.length} accent="#8b5cf6" plugins={PLUGINS_DESIGN} />
        <PluginGroup title="Marketing" count={PLUGINS_MARKETING.length} accent="#eab308" plugins={PLUGINS_MARKETING} />
        <PluginGroup title="Communication & Productivité" count={PLUGINS_COMMS.length} accent="#ef4444" plugins={PLUGINS_COMMS} />

        <section>
          <h2 className="text-[15px] font-semibold mb-5" style={{ color: '#e2e8f0' }}>Ordre d'installation recommandé Buildrs</h2>
          <p className="text-[12px] mb-5" style={{ color: '#5b6078' }}>5 phases dans l'ordre. Total : ~15 minutes.</p>
          <div className="space-y-5">
            {[
              { phase: 1, title: 'Marketplaces', duration: '2 min', code: PHASE1 },
              { phase: 2, title: 'Core', duration: '5 min', code: PHASE2 },
              { phase: 3, title: 'Plateforme', duration: '3 min', code: PHASE3 },
              { phase: 4, title: 'Design & Marketing', duration: '2 min', code: PHASE4 },
              { phase: 5, title: 'Bonus', duration: '1 min', code: PHASE5 },
            ].map(ph => (
              <div key={ph.phase}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
                    style={{ background: 'rgba(34,197,94,0.15)', color: ACCENT, border: '0.5px solid rgba(34,197,94,0.3)' }}>
                    {ph.phase}
                  </span>
                  <span className="text-[12px] font-semibold" style={{ color: '#e2e8f0' }}>Phase {ph.phase} — {ph.title}</span>
                  <span className="text-[10px]" style={{ color: '#3d4466' }}>{ph.duration}</span>
                </div>
                <CodeBlock label="Claude Code" code={ph.code} />
              </div>
            ))}
          </div>
          <div className="rounded-xl p-3 mt-4" style={{ background: 'rgba(255,255,255,0.02)', border: '0.5px solid rgba(255,255,255,0.06)' }}>
            <p className="text-[11px]" style={{ color: '#5b6078' }}>Bibliothèque Buildrs · Mise à jour : 2026-04-04</p>
          </div>
        </section>
      </div>
    </div>
  )
}
