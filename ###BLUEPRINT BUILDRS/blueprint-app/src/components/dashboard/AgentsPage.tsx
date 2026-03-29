import {
  Bot, Palette, Building2, ShieldCheck, FileText,
  Mail, BarChart2, Search, Lock,
} from 'lucide-react'

interface AgentCard {
  id: string
  name: string
  role: string
  description: string
  tag: string
  tagColor: string
  Icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>
  status: 'actif' | 'bientôt'
}

const AGENTS: AgentCard[] = [
  {
    id: 'designer',
    name: 'Design Agent',
    role: 'Branding & UI',
    description: 'Génère ton identité visuelle, tes couleurs, ta typo et tes maquettes d\'écrans à partir d\'un brief produit.',
    tag: 'Design',
    tagColor: '#cc5de8',
    Icon: Palette,
    status: 'bientôt',
  },
  {
    id: 'architect',
    name: 'Architecture Agent',
    role: 'Stack & Base de données',
    description: 'Conçoit le schéma Supabase, l\'architecture de l\'app et le plan de développement complet.',
    tag: 'Architecture',
    tagColor: '#4d96ff',
    Icon: Building2,
    status: 'bientôt',
  },
  {
    id: 'validator',
    name: 'Validation Agent',
    role: 'Analyse de marché',
    description: 'Analyse la viabilité de ton idée : concurrence, marché, risques, et retourne un score /100.',
    tag: 'Validation',
    tagColor: '#22c55e',
    Icon: ShieldCheck,
    status: 'actif',
  },
  {
    id: 'copywriter',
    name: 'Copy Agent',
    role: 'Copywriting & Landing',
    description: 'Rédige ta landing page, tes emails et tes posts LinkedIn à partir de ton brief produit.',
    tag: 'Copy',
    tagColor: '#ffd93d',
    Icon: FileText,
    status: 'bientôt',
  },
  {
    id: 'email',
    name: 'Email Agent',
    role: 'Séquences email',
    description: 'Crée tes séquences d\'activation, de nurturing et de relance en accord avec ton branding.',
    tag: 'Email',
    tagColor: '#ff6b6b',
    Icon: Mail,
    status: 'bientôt',
  },
  {
    id: 'analytics',
    name: 'Analytics Agent',
    role: 'Métriques & Croissance',
    description: 'Analyse tes données, identifie les blocages et suggère des actions concrètes pour scaler.',
    tag: 'Analytics',
    tagColor: '#4d96ff',
    Icon: BarChart2,
    status: 'bientôt',
  },
  {
    id: 'research',
    name: 'Research Agent',
    role: 'Veille & Opportunités',
    description: 'Scanne Product Hunt, Indie Hackers et Reddit pour identifier les tendances et idées portables.',
    tag: 'Recherche',
    tagColor: '#22c55e',
    Icon: Search,
    status: 'bientôt',
  },
  {
    id: 'security',
    name: 'Security Agent',
    role: 'Audit sécurité',
    description: 'Vérifie tes RLS Supabase, variables d\'environnement, et réalise un audit de sécurité basique.',
    tag: 'Sécurité',
    tagColor: '#ff6b6b',
    Icon: Lock,
    status: 'bientôt',
  },
]

interface Props {
  navigate: (hash: string) => void
}

export function AgentsPage({ navigate: _navigate }: Props) {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-4xl mx-auto px-6 py-8">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <Bot size={20} strokeWidth={1.5} className="text-foreground" />
            <h1 className="text-2xl font-extrabold text-foreground tracking-tight">
              Mes agents IA
            </h1>
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-full"
              style={{
                background: 'rgba(77,150,255,0.15)',
                color: '#4d96ff',
                border: '1px solid rgba(77,150,255,0.3)',
              }}
            >
              BETA
            </span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-xl">
            Les agents IA spécialisés de Buildrs. Chacun maîtrise un domaine précis et travaille avec ton contexte projet.
            Coordonnés par Jarvis, ton copilote principal.
          </p>
        </div>

        {/* Jarvis — featured */}
        <div
          className="border border-foreground/20 rounded-2xl p-5 mb-6 relative overflow-hidden"
          style={{ background: 'hsl(var(--secondary))' }}
        >
          <div className="flex items-start gap-4">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #4d96ff 0%, #cc5de8 100%)', color: '#fff' }}
            >
              <Bot size={18} strokeWidth={1.5} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-sm font-bold text-foreground">Jarvis</p>
                <span
                  className="text-[9px] font-bold px-1.5 py-0.5 rounded"
                  style={{ background: 'rgba(34,197,94,0.2)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.3)' }}
                >
                  ACTIF
                </span>
                <span className="text-[10px] text-muted-foreground font-medium">COO IA · Orchestrateur</span>
              </div>
              <p className="text-[13px] text-muted-foreground leading-relaxed">
                Ton copilote principal. Coordonne les agents spécialisés, connaît tout le curriculum Blueprint et te guide étape par étape.
                Accessible depuis l'onglet Jarvis IA à tout moment.
              </p>
            </div>
          </div>
        </div>

        {/* Agent grid */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-muted-foreground mb-4">
            Agents spécialisés
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {AGENTS.map(agent => {
              const Icon = agent.Icon
              const isActive = agent.status === 'actif'
              return (
                <div
                  key={agent.id}
                  className="border border-border rounded-xl p-4 relative"
                  style={{ background: 'hsl(var(--card))' }}
                >
                  {!isActive && (
                    <div className="absolute inset-0 rounded-xl" style={{ background: 'hsl(var(--background) / 0.5)' }} />
                  )}
                  <div className="flex items-start gap-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{
                        background: isActive ? `${agent.tagColor}20` : 'hsl(var(--secondary))',
                        color: isActive ? agent.tagColor : 'hsl(var(--muted-foreground))',
                      }}
                    >
                      <Icon size={14} strokeWidth={1.5} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <p className="text-[12px] font-semibold text-foreground">{agent.name}</p>
                        {isActive ? (
                          <span
                            className="text-[8px] font-bold px-1.5 py-0.5 rounded"
                            style={{ background: 'rgba(34,197,94,0.15)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.3)' }}
                          >
                            ACTIF
                          </span>
                        ) : (
                          <span
                            className="text-[8px] font-bold px-1.5 py-0.5 rounded"
                            style={{ background: 'hsl(var(--secondary))', color: 'hsl(var(--muted-foreground))', border: '1px solid hsl(var(--border))' }}
                          >
                            BIENTÔT
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-muted-foreground/70 font-medium mb-1.5">{agent.role}</p>
                      <p className="text-[11px] text-muted-foreground leading-relaxed">{agent.description}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Footer note */}
        <div className="mt-8 border border-border rounded-xl p-4 flex items-start gap-3">
          <Bot size={14} strokeWidth={1.5} className="text-muted-foreground flex-shrink-0 mt-0.5" />
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Les agents spécialisés sont en cours de développement et seront progressivement intégrés au dashboard.
            En attendant, Jarvis peut répondre à la plupart de tes questions depuis l'onglet Jarvis IA.
          </p>
        </div>

      </div>
    </div>
  )
}
