import { useState, useCallback } from 'react'
import { ArrowLeft, Copy, Check, ExternalLink, Package, ChevronRight } from 'lucide-react'

interface Props {
  navigate: (hash: string) => void
}

const ACCENT = '#4d96ff'

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

function SectionNum({ n }: { n: number }) {
  return (
    <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg text-[11px] font-bold mr-3 shrink-0"
      style={{ background: 'rgba(77,150,255,0.15)', color: ACCENT, border: '0.5px solid rgba(77,150,255,0.25)' }}>
      {n}
    </span>
  )
}

const MARKETPLACES = [
  { name: 'claude-plugins-official', content: 'Plugins officiels Anthropic (Vercel, Supabase, Stripe, GitHub, Figma…)', stars: '15.9k', url: 'https://github.com/anthropics/claude-plugins-official' },
  { name: 'superpowers-marketplace', content: 'Superpowers — workflows structurés, mémoire, agents', stars: 'Superpowers', url: 'https://github.com/obra/superpowers-marketplace' },
  { name: 'supabase-agent-skills', content: 'Skills spécialisés Supabase + Postgres', stars: '—', url: 'https://github.com/supabase/agent-skills' },
  { name: 'marketingskills', content: '30+ skills marketing, copywriting, SEO, growth', stars: '—', url: 'https://github.com/coreyhaines31/marketingskills' },
]

export function PluginsFormationPage({ navigate }: Props) {
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
          <span className="text-[12px]">Plugins</span>
        </button>
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: 'rgba(77,150,255,0.12)', border: '0.5px solid rgba(77,150,255,0.25)' }}>
            <Package size={18} strokeWidth={1.5} style={{ color: ACCENT }} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full"
                style={{ color: ACCENT, background: 'rgba(77,150,255,0.12)', border: '0.5px solid rgba(77,150,255,0.25)' }}>
                Formation
              </span>
              <span className="text-[10px]" style={{ color: '#3d4466' }}>4 sections · ~8 min</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight" style={{ color: '#e2e8f0' }}>Plugins Claude Code</h1>
            <p className="text-[13px] mt-1" style={{ color: '#5b6078' }}>
              Skills + connecteurs MCP + agents — packagés en un seul dossier installable en une commande.
            </p>
          </div>
        </div>
      </div>

      <div className="px-6 pt-8 max-w-3xl space-y-12">

        {/* Section 1 */}
        <section>
          <h2 className="text-[15px] font-semibold mb-4 flex items-center" style={{ color: '#e2e8f0' }}>
            <SectionNum n={1} />C'est quoi un Plugin
          </h2>
          <p className="text-[13px] leading-relaxed mb-4" style={{ color: '#94a3b8' }}>
            Un skill, c'est un fichier. Un plugin, c'est un <span style={{ color: '#e2e8f0' }}>dossier complet</span> qui peut contenir des skills, des agents, des commandes ET des connexions MCP — en un seul package installable en une commande.
          </p>
          <CodeBlock label="structure d'un plugin" code={`mon-plugin/
├── .claude-plugin/
│   └── plugin.json       # Métadonnées du plugin (obligatoire)
├── .mcp.json              # Serveurs MCP embarqués (optionnel)
├── commands/              # Commandes slash (optionnel)
├── agents/                # Agents spécialisés (optionnel)
├── skills/                # Skills (optionnel)
└── README.md              # Documentation`} />

          <div className="grid grid-cols-3 gap-3 mt-5">
            {[
              { label: 'Skills', desc: 'Comportements personnalisés', color: '#22c55e' },
              { label: 'Agents', desc: 'Sous-agents spécialisés', color: ACCENT },
              { label: 'MCP', desc: 'Connexions outils', color: '#8b5cf6' },
            ].map(c => (
              <div key={c.label} className="rounded-xl p-3 text-center" style={{ background: 'rgba(255,255,255,0.03)', border: '0.5px solid rgba(255,255,255,0.07)' }}>
                <p className="text-[12px] font-semibold mb-1" style={{ color: c.color }}>{c.label}</p>
                <p className="text-[11px]" style={{ color: '#5b6078' }}>{c.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 2 */}
        <section>
          <h2 className="text-[15px] font-semibold mb-4 flex items-center" style={{ color: '#e2e8f0' }}>
            <SectionNum n={2} />Marketplaces — Où trouver les plugins
          </h2>
          <p className="text-[13px] leading-relaxed mb-4" style={{ color: '#94a3b8' }}>
            Les plugins sont hébergés dans des <span style={{ color: '#e2e8f0' }}>marketplaces</span> — des dépôts GitHub qui contiennent des collections de plugins. Tu dois ajouter les marketplaces <span style={{ color: '#e2e8f0' }}>avant</span> d'installer les plugins qu'elles contiennent.
          </p>

          <h3 className="text-[12px] font-semibold uppercase tracking-wider mb-3" style={{ color: '#5b6078' }}>Les 4 marketplaces Buildrs</h3>
          <CodeBlock label="bash — à taper une seule fois dans Claude Code" code={`/add-marketplace https://github.com/anthropics/claude-plugins-official
/add-marketplace https://github.com/obra/superpowers-marketplace
/add-marketplace https://github.com/supabase/agent-skills
/add-marketplace https://github.com/coreyhaines31/marketingskills`} />

          <div className="rounded-xl overflow-hidden mt-4" style={{ border: '0.5px solid rgba(255,255,255,0.08)' }}>
            <div className="grid grid-cols-3 px-4 py-2.5" style={{ background: 'rgba(77,150,255,0.06)', borderBottom: '0.5px solid rgba(255,255,255,0.06)' }}>
              {['Marketplace', 'Contenu', 'Stars'].map(h => (
                <span key={h} className="text-[11px] font-semibold" style={{ color: '#e2e8f0' }}>{h}</span>
              ))}
            </div>
            {MARKETPLACES.map((m, i) => (
              <div key={m.name} className="grid grid-cols-3 px-4 py-3" style={{ borderBottom: i < MARKETPLACES.length - 1 ? '0.5px solid rgba(255,255,255,0.05)' : undefined }}>
                <a href={m.url} target="_blank" rel="noopener noreferrer"
                  className="text-[11px] transition-colors flex items-center gap-1"
                  style={{ fontFamily: 'Geist Mono, monospace', color: ACCENT }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = '0.7')}
                  onMouseLeave={e => (e.currentTarget.style.opacity = '1')}>
                  {m.name}
                  <ExternalLink size={9} strokeWidth={1.5} />
                </a>
                <span className="text-[11px]" style={{ color: '#94a3b8' }}>{m.content}</span>
                <span className="text-[11px]" style={{ color: '#eab308' }}>{m.stars !== '—' ? `⭐ ${m.stars}` : '—'}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3 */}
        <section>
          <h2 className="text-[15px] font-semibold mb-4 flex items-center" style={{ color: '#e2e8f0' }}>
            <SectionNum n={3} />Comment installer un plugin
          </h2>
          <CodeBlock label="Claude Code" code={`# Installation depuis une marketplace
/install-plugin nom-du-plugin@nom-de-la-marketplace

# Exemple :
/install-plugin superpowers@claude-plugins-official

# Découvrir les plugins disponibles
/plugin > Discover

# Mettre à jour un plugin
/plugin update nom-du-plugin

# Lister les plugins installés
/plugin list`} />
        </section>

        {/* Section 4 */}
        <section>
          <h2 className="text-[15px] font-semibold mb-4 flex items-center" style={{ color: '#e2e8f0' }}>
            <SectionNum n={4} />Plugin vs Skill — Pourquoi installer les deux ?
          </h2>
          <p className="text-[13px] leading-relaxed mb-4" style={{ color: '#94a3b8' }}>
            Un plugin <span style={{ color: '#e2e8f0' }}>contient</span> des skills. Quand tu installes un plugin, tu récupères automatiquement tous ses skills. Mais tu peux aussi créer des skills custom en dehors de tout plugin.
          </p>
          <div className="space-y-2">
            {[
              { label: 'Si l\'outil que tu veux existe comme plugin', desc: 'installe le plugin — c\'est plus complet (skills + agents + MCP)', icon: '→', color: '#22c55e' },
              { label: 'Si tu veux un truc spécifique à ton projet', desc: 'crée un skill custom via le Générateur Skills', icon: '→', color: ACCENT },
            ].map(r => (
              <div key={r.label} className="flex items-start gap-3 rounded-xl px-4 py-3" style={{ background: 'rgba(255,255,255,0.03)', border: '0.5px solid rgba(255,255,255,0.07)' }}>
                <span className="text-[12px] font-bold shrink-0 mt-0.5" style={{ color: r.color }}>{r.icon}</span>
                <div>
                  <span className="text-[12px] font-semibold" style={{ color: '#e2e8f0' }}>{r.label} — </span>
                  <span className="text-[12px]" style={{ color: '#94a3b8' }}>{r.desc}</span>
                </div>
              </div>
            ))}
          </div>

          <h3 className="text-[12px] font-semibold uppercase tracking-wider mt-6 mb-3" style={{ color: '#5b6078' }}>Sources</h3>
          <div className="space-y-2">
            {[
              { label: 'Plugins — Documentation Anthropic', url: 'https://code.claude.com/docs/en/discover-plugins' },
              { label: 'Créer des plugins', url: 'https://code.claude.com/docs/en/plugins' },
              { label: 'claude-plugins-official — GitHub', url: 'https://github.com/anthropics/claude-plugins-official' },
            ].map(s => (
              <div key={s.label} className="flex items-center gap-2">
                <ExternalLink size={11} strokeWidth={1.5} style={{ color: '#3d4466' }} />
                <a href={s.url} target="_blank" rel="noopener noreferrer"
                  className="text-[12px] transition-colors" style={{ color: '#5b6078' }}
                  onMouseEnter={e => (e.currentTarget.style.color = ACCENT)}
                  onMouseLeave={e => (e.currentTarget.style.color = '#5b6078')}>
                  {s.label}
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="rounded-2xl p-6" style={{ background: 'rgba(77,150,255,0.06)', border: '0.5px solid rgba(77,150,255,0.2)' }}>
          <h3 className="text-[14px] font-semibold mb-2" style={{ color: '#e2e8f0' }}>Voir tous les plugins Buildrs</h3>
          <p className="text-[12px] mb-4" style={{ color: '#94a3b8' }}>
            22 plugins organisés avec les commandes d'installation exactes et l'ordre recommandé pour tout installer en moins de 15 minutes.
          </p>
          <button onClick={() => navigate('#/dashboard/claude-os/apprendre/plugins/ressources-buildrs')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[12px] font-semibold transition-all"
            style={{ background: 'rgba(34,197,94,0.12)', border: '0.5px solid rgba(34,197,94,0.3)', color: '#22c55e' }}>
            <Package size={13} strokeWidth={1.5} />
            <ChevronRight size={13} strokeWidth={1.5} />
            Bibliothèque Ressources Plugins
          </button>
        </div>
      </div>
    </div>
  )
}
