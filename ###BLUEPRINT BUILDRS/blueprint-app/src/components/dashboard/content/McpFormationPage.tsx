import { useState, useCallback } from 'react'
import { ArrowLeft, Copy, Check, ExternalLink, Plug, ChevronRight } from 'lucide-react'

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
    <div className="relative rounded-xl overflow-hidden my-4" style={{ background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.09)' }}>
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
      style={{ background: `rgba(77,150,255,0.15)`, color: ACCENT, border: `0.5px solid rgba(77,150,255,0.25)` }}>
      {n}
    </span>
  )
}

function TableRow({ cells, header }: { cells: string[]; header?: boolean }) {
  return (
    <div className={`grid gap-0 ${cells.length === 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
      {cells.map((c, i) => (
        <div key={i} className="px-4 py-2.5 text-[12px]"
          style={{
            borderBottom: '0.5px solid rgba(255,255,255,0.06)',
            borderRight: i < cells.length - 1 ? '0.5px solid rgba(255,255,255,0.06)' : undefined,
            color: header ? '#e2e8f0' : i === 0 ? '#e2e8f0' : '#94a3b8',
            fontWeight: header ? 600 : 400,
            background: header ? 'rgba(77,150,255,0.06)' : undefined,
            fontFamily: i === 0 && !header ? 'Geist Mono, monospace' : undefined,
            fontSize: i === 0 && !header ? '11px' : undefined,
          }}>
          {c}
        </div>
      ))}
    </div>
  )
}

function CompareRow({ sans, avec }: { sans: string; avec: string }) {
  return (
    <div className="grid grid-cols-2 gap-0">
      <div className="px-4 py-2.5 text-[12px]" style={{ borderBottom: '0.5px solid rgba(255,255,255,0.06)', borderRight: '0.5px solid rgba(255,255,255,0.06)', color: '#94a3b8' }}>
        <span style={{ color: '#ef4444', marginRight: 6 }}>✕</span>{sans}
      </div>
      <div className="px-4 py-2.5 text-[12px]" style={{ borderBottom: '0.5px solid rgba(255,255,255,0.06)', color: '#94a3b8' }}>
        <span style={{ color: '#22c55e', marginRight: 6 }}>✓</span>{avec}
      </div>
    </div>
  )
}

export function McpFormationPage({ navigate }: Props) {
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
            style={{ background: 'rgba(77,150,255,0.12)', border: '0.5px solid rgba(77,150,255,0.25)' }}>
            <Plug size={18} strokeWidth={1.5} style={{ color: ACCENT }} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full"
                style={{ color: ACCENT, background: 'rgba(77,150,255,0.12)', border: '0.5px solid rgba(77,150,255,0.25)' }}>
                Formation
              </span>
              <span className="text-[10px]" style={{ color: '#3d4466' }}>8 sections · ~15 min</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight" style={{ color: '#e2e8f0' }}>MCP & Connecteurs</h1>
            <p className="text-[13px] mt-1" style={{ color: '#5b6078' }}>
              Connecte Claude à tous tes outils. Claude ne travaille plus en silo — il agit directement dans Supabase, Vercel, Stripe, GitHub.
            </p>
          </div>
        </div>
      </div>

      <div className="px-6 pt-8 max-w-3xl space-y-12">

        {/* Section 1 */}
        <section>
          <h2 className="text-[15px] font-semibold mb-4 flex items-center" style={{ color: '#e2e8f0' }}>
            <SectionNum n={1} />C'est quoi le MCP et pourquoi c'est indispensable
          </h2>
          <p className="text-[13px] leading-relaxed mb-4" style={{ color: '#94a3b8' }}>
            Sans MCP, Claude Code est un assistant brillant mais <span style={{ color: '#e2e8f0' }}>isolé</span>. Il ne peut pas accéder à ta base de données, déployer ton app, consulter tes issues GitHub, ni lire tes designs Figma. Tu dois tout copier-coller entre Claude et tes outils.
          </p>
          <p className="text-[13px] leading-relaxed mb-4" style={{ color: '#94a3b8' }}>
            Le <span style={{ color: '#e2e8f0' }}>Model Context Protocol (MCP)</span> change ça radicalement. C'est un standard ouvert créé par Anthropic qui permet à Claude de communiquer directement avec des outils externes. Pense à MCP comme un port USB universel pour l'IA : n'importe quel outil peut exposer ses fonctionnalités, et Claude s'y connecte instantanément.
          </p>

          <h3 className="text-[13px] font-semibold mb-3" style={{ color: '#e2e8f0' }}>Ce que ça change concrètement</h3>
          <div className="rounded-xl overflow-hidden mb-4" style={{ border: '0.5px solid rgba(255,255,255,0.08)' }}>
            <div className="grid grid-cols-2 gap-0">
              <div className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider" style={{ borderBottom: '0.5px solid rgba(255,255,255,0.08)', borderRight: '0.5px solid rgba(255,255,255,0.08)', color: '#ef4444', background: 'rgba(239,68,68,0.06)' }}>Sans MCP</div>
              <div className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider" style={{ borderBottom: '0.5px solid rgba(255,255,255,0.08)', color: '#22c55e', background: 'rgba(34,197,94,0.06)' }}>Avec MCP</div>
            </div>
            <CompareRow sans="Tu ouvres Supabase Dashboard" avec="Tu dis à Claude 'crée la table users'" />
            <CompareRow sans="Tu copies le schéma de ta table" avec="Claude exécute la migration directement" />
            <CompareRow sans="Tu colles dans Claude Code" avec="C'est fait." />
            <CompareRow sans="Claude génère le code" avec="" />
            <CompareRow sans="Tu retournes dans Supabase pour vérifier" avec="" />
          </div>

          <div className="rounded-xl p-4" style={{ background: 'rgba(77,150,255,0.06)', border: '0.5px solid rgba(77,150,255,0.15)' }}>
            <p className="text-[12px]" style={{ color: '#94a3b8' }}>
              <span style={{ color: ACCENT, fontWeight: 600 }}>Adoption massive.</span>{' '}
              OpenAI, Google, Microsoft, Replit, Sourcegraph — tous supportent MCP. C'est le standard universel de l'IA agentique. Maîtriser MCP aujourd'hui, c'est un investissement durable.
            </p>
          </div>
        </section>

        {/* Section 2 */}
        <section>
          <h2 className="text-[15px] font-semibold mb-4 flex items-center" style={{ color: '#e2e8f0' }}>
            <SectionNum n={2} />MCP Serveurs vs Connecteurs — La différence
          </h2>
          <p className="text-[13px] leading-relaxed mb-4" style={{ color: '#94a3b8' }}>
            C'est la même technologie MCP, mais configurée à deux endroits différents selon l'outil que tu utilises.
          </p>
          <div className="rounded-xl overflow-hidden mb-6" style={{ border: '0.5px solid rgba(255,255,255,0.08)' }}>
            <TableRow cells={['', 'MCP Serveurs', 'Connecteurs']} header />
            <TableRow cells={['Où', 'Claude Code (terminal)', 'Claude.ai / Cowork (web/desktop)']} />
            <TableRow cells={['Comment connecter', 'claude mcp add ou ~/.mcp.json', "Claude.ai → Settings → Integrations"]} />
            <TableRow cells={['Pour qui', 'Développement, code, déploiement', 'Travail de bureau, documents, analyse']} />
            <TableRow cells={['Exemples', 'Supabase MCP, Playwright MCP, Sentry MCP', 'Google Drive, Gmail, Slack, Notion, Figma']} />
            <TableRow cells={['Niveau technique', 'Commandes terminal', 'Clic "Connect" dans l\'interface']} />
          </div>

          <h3 className="text-[13px] font-semibold mb-3" style={{ color: '#e2e8f0' }}>Règle Buildrs</h3>
          <div className="space-y-2">
            {[
              { label: 'Tu builds ton SaaS', value: 'MCP Serveurs dans Claude Code', color: ACCENT },
              { label: 'Tu gères ton business', value: 'Connecteurs dans Claude.ai / Cowork', color: '#22c55e' },
              { label: 'Certains outils ont les deux', value: 'Supabase, Vercel, GitHub, Stripe, Figma, Notion — installe les deux pour une couverture complète', color: '#8b5cf6' },
            ].map(r => (
              <div key={r.label} className="flex items-start gap-3 rounded-xl px-4 py-3" style={{ background: 'rgba(255,255,255,0.03)', border: '0.5px solid rgba(255,255,255,0.07)' }}>
                <ChevronRight size={13} strokeWidth={2} style={{ color: r.color, marginTop: 1, shrink: 0 }} />
                <div>
                  <span className="text-[12px] font-semibold" style={{ color: '#e2e8f0' }}>{r.label} → </span>
                  <span className="text-[12px]" style={{ color: '#94a3b8' }}>{r.value}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3 */}
        <section>
          <h2 className="text-[15px] font-semibold mb-4 flex items-center" style={{ color: '#e2e8f0' }}>
            <SectionNum n={3} />Configurer un MCP Server dans Claude Code
          </h2>

          <h3 className="text-[13px] font-semibold mb-2" style={{ color: '#e2e8f0' }}>Méthode 1 — La commande <code style={{ fontFamily: 'Geist Mono, monospace', fontSize: 11, color: ACCENT }}>claude mcp add</code> (la plus simple)</h3>
          <CodeBlock label="bash" code={`# Serveur HTTP distant (services cloud)
claude mcp add --transport http sentry https://mcp.sentry.dev/mcp

# Serveur stdio local (outils sur ta machine)
claude mcp add --transport stdio playwright -- npx -y @playwright/mcp@latest

# Avec des variables d'environnement (pour les clés API)
claude mcp add --transport stdio supabase \\
  --env SUPABASE_ACCESS_TOKEN=sbp_xxx \\
  -- npx -y @supabase/mcp-server`} />
          <div className="rounded-xl p-3 mb-6" style={{ background: 'rgba(234,179,8,0.06)', border: '0.5px solid rgba(234,179,8,0.2)' }}>
            <p className="text-[12px]" style={{ color: '#94a3b8' }}>
              <span style={{ color: '#eab308', fontWeight: 600 }}>Important :</span> Toutes les options (<code style={{ fontFamily: 'Geist Mono, monospace', fontSize: 11 }}>--transport</code>, <code style={{ fontFamily: 'Geist Mono, monospace', fontSize: 11 }}>--env</code>, <code style={{ fontFamily: 'Geist Mono, monospace', fontSize: 11 }}>--scope</code>) doivent être placées avant le nom du serveur. Le double tiret <code style={{ fontFamily: 'Geist Mono, monospace', fontSize: 11 }}>--</code> sépare le nom du serveur de la commande à exécuter.
            </p>
          </div>

          <h3 className="text-[13px] font-semibold mb-2" style={{ color: '#e2e8f0' }}>Méthode 2 — Le fichier <code style={{ fontFamily: 'Geist Mono, monospace', fontSize: 11, color: ACCENT }}>.mcp.json</code> (partage avec l'équipe)</h3>
          <p className="text-[13px] mb-2" style={{ color: '#94a3b8' }}>Crée un fichier <code style={{ fontFamily: 'Geist Mono, monospace', fontSize: 11, color: '#e2e8f0' }}>.mcp.json</code> à la racine de ton projet :</p>
          <CodeBlock label=".mcp.json" code={`{
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
    }
  }
}`} />
          <p className="text-[12px] mb-6" style={{ color: '#5b6078' }}>Ce fichier peut être versionné dans Git. Les variables <code style={{ fontFamily: 'Geist Mono, monospace', fontSize: 11 }}>${'{VAR}'}</code> permettent à chaque dev de définir ses propres tokens localement.</p>

          <h3 className="text-[13px] font-semibold mb-2" style={{ color: '#e2e8f0' }}>Méthode 3 — Configuration globale (tous tes projets)</h3>
          <CodeBlock label="bash" code={`claude mcp add --transport http --scope user github https://api.githubcopilot.com/mcp/`} />
          <p className="text-[12px] mb-4" style={{ color: '#5b6078' }}>Stocké dans <code style={{ fontFamily: 'Geist Mono, monospace', fontSize: 11 }}>~/.claude.json</code>, disponible partout.</p>

          <h3 className="text-[13px] font-semibold mb-3" style={{ color: '#e2e8f0' }}>Les 3 scopes résumés</h3>
          <div className="rounded-xl overflow-hidden mb-6" style={{ border: '0.5px solid rgba(255,255,255,0.08)' }}>
            <TableRow cells={['Scope', 'Stockage', 'Partage', 'Usage']} header />
            <TableRow cells={['local (défaut)', '~/.claude.json (par projet)', 'Privé', 'Développement personnel']} />
            <TableRow cells={['project', '.mcp.json (racine projet)', 'Équipe (via Git)', 'Outils partagés']} />
            <TableRow cells={['user', '~/.claude.json (global)', 'Privé, tous projets', 'Outils personnels']} />
          </div>

          <h3 className="text-[13px] font-semibold mb-2" style={{ color: '#e2e8f0' }}>Gérer tes serveurs</h3>
          <CodeBlock label="bash" code={`# Lister tous les serveurs configurés
claude mcp list

# Voir les détails d'un serveur
claude mcp get supabase

# Supprimer un serveur
claude mcp remove playwright

# Dans Claude Code, vérifier le statut
/mcp`} />
        </section>

        {/* Section 4 */}
        <section>
          <h2 className="text-[15px] font-semibold mb-4 flex items-center" style={{ color: '#e2e8f0' }}>
            <SectionNum n={4} />Configurer un Connecteur dans Claude.ai
          </h2>
          <p className="text-[13px] leading-relaxed mb-4" style={{ color: '#94a3b8' }}>
            Beaucoup plus simple — tout se fait en clics.
          </p>
          <div className="space-y-2 mb-6">
            {[
              "Va sur claude.ai → Settings → Integrations",
              "Trouve le service que tu veux connecter",
              "Clique Connect",
              "Autorise l'accès (OAuth ou clé API selon le service)",
              "C'est fait — le connecteur est actif dans tes conversations Claude et dans Cowork",
            ].map((step, i) => (
              <div key={i} className="flex items-start gap-3 rounded-xl px-4 py-3" style={{ background: 'rgba(255,255,255,0.03)', border: '0.5px solid rgba(255,255,255,0.07)' }}>
                <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0" style={{ background: `rgba(77,150,255,0.15)`, color: ACCENT }}>{i + 1}</span>
                <span className="text-[12px]" style={{ color: '#94a3b8' }}>{step}</span>
              </div>
            ))}
          </div>

          <h3 className="text-[13px] font-semibold mb-3" style={{ color: '#e2e8f0' }}>Ce que ça donne une fois connecté</h3>
          <div className="rounded-xl p-4 space-y-2" style={{ background: 'rgba(255,255,255,0.02)', border: '0.5px solid rgba(255,255,255,0.07)' }}>
            {[
              '"Lis le document X dans mon Google Drive"',
              '"Crée une issue dans mon projet Linear"',
              '"Envoie un message dans le channel #general sur Slack"',
              '"Montre-moi mes derniers designs Figma"',
            ].map(ex => (
              <p key={ex} className="text-[12px]" style={{ fontFamily: 'Geist Mono, monospace', color: '#e2e8f0' }}>{ex}</p>
            ))}
          </div>
        </section>

        {/* Section 5 */}
        <section>
          <h2 className="text-[15px] font-semibold mb-4 flex items-center" style={{ color: '#e2e8f0' }}>
            <SectionNum n={5} />Sécurité — Les règles à respecter
          </h2>

          <h3 className="text-[13px] font-semibold mb-3" style={{ color: '#ef4444' }}>Les risques</h3>
          <div className="space-y-2 mb-6">
            {[
              { label: 'Prompt injection', desc: 'un serveur malveillant peut manipuler les instructions' },
              { label: 'Exfiltration de données', desc: 'un outil compromis peut accéder à des fichiers sensibles' },
              { label: 'Exécution non souhaitée', desc: 'Claude qui déploie en prod sans que tu le veuilles' },
            ].map(r => (
              <div key={r.label} className="rounded-xl px-4 py-3" style={{ background: 'rgba(239,68,68,0.06)', border: '0.5px solid rgba(239,68,68,0.15)' }}>
                <span className="text-[12px] font-semibold" style={{ color: '#ef4444' }}>{r.label} — </span>
                <span className="text-[12px]" style={{ color: '#94a3b8' }}>{r.desc}</span>
              </div>
            ))}
          </div>

          <h3 className="text-[13px] font-semibold mb-3" style={{ color: '#e2e8f0' }}>Les protections de Claude Code</h3>
          <p className="text-[13px] mb-4 leading-relaxed" style={{ color: '#94a3b8' }}>
            Claude Code intègre un <span style={{ color: '#e2e8f0' }}>sandbox OS-level</span> qui isole l'exécution, bloque l'accès aux fichiers non autorisés, et empêche les requêtes réseau sauf vers les domaines explicitement autorisés.
          </p>

          <h3 className="text-[13px] font-semibold mb-3" style={{ color: '#e2e8f0' }}>Bonnes pratiques Buildrs</h3>
          <div className="space-y-2">
            {[
              "N'installe que des serveurs de confiance — privilégie les serveurs officiels (Anthropic, Supabase, Vercel, GitHub)",
              "Tokens à permissions limitées — jamais un token admin quand un token lecture seule suffit",
              "Ne commite jamais tes secrets — utilise ${VAR} dans .mcp.json et définis les variables localement",
              "Revois les permissions — /mcp dans Claude Code pour voir et révoquer les accès",
            ].map((rule, i) => (
              <div key={i} className="flex items-start gap-3 rounded-xl px-4 py-3" style={{ background: 'rgba(255,255,255,0.03)', border: '0.5px solid rgba(255,255,255,0.07)' }}>
                <span className="text-[11px] font-bold shrink-0 mt-0.5" style={{ color: '#22c55e' }}>{i + 1}.</span>
                <span className="text-[12px]" style={{ color: '#94a3b8' }}>{rule}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Section 6 */}
        <section>
          <h2 className="text-[15px] font-semibold mb-4 flex items-center" style={{ color: '#e2e8f0' }}>
            <SectionNum n={6} />MCP Tool Search — Le chargement intelligent
          </h2>
          <p className="text-[13px] leading-relaxed mb-4" style={{ color: '#94a3b8' }}>
            Quand tu connectes beaucoup de MCP servers, les définitions d'outils consomment du contexte. Claude Code active automatiquement le <span style={{ color: '#e2e8f0' }}>Tool Search</span> quand ça dépasse 10% de la fenêtre de contexte.
          </p>
          <p className="text-[13px] leading-relaxed mb-4" style={{ color: '#94a3b8' }}>
            Au lieu de charger tous les outils en mémoire, Claude utilise un mécanisme de <span style={{ color: '#e2e8f0' }}>lazy loading</span> : seuls les outils pertinents sont chargés quand il en a besoin. Transparent pour toi.
          </p>
          <CodeBlock label="bash" code={`# Seuil personnalisé à 5%
ENABLE_TOOL_SEARCH=auto:5 claude

# Désactiver (tous les outils chargés d'office)
ENABLE_TOOL_SEARCH=false claude`} />
        </section>

        {/* Section 7 */}
        <section>
          <h2 className="text-[15px] font-semibold mb-4 flex items-center" style={{ color: '#e2e8f0' }}>
            <SectionNum n={7} />Créer son propre MCP Server
          </h2>
          <p className="text-[13px] leading-relaxed mb-4" style={{ color: '#94a3b8' }}>
            Tu peux créer ton propre MCP server pour exposer n'importe quelle fonctionnalité à Claude Code — une API interne, un outil métier, un workflow spécifique.
          </p>
          <h3 className="text-[13px] font-semibold mb-2" style={{ color: '#e2e8f0' }}>Exemple minimal avec le SDK TypeScript</h3>
          <CodeBlock label="TypeScript" code={`import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new McpServer({
  name: "mon-serveur-custom",
  version: "1.0.0",
});

server.tool(
  "saluer_utilisateur",
  "Salue un utilisateur par son prénom",
  { prenom: z.string() },
  async ({ prenom }) => ({
    content: [{ type: "text", text: \`Bonjour \${prenom} !\` }],
  })
);

const transport = new StdioServerTransport();
await server.connect(transport);`} />
          <p className="text-[12px] mb-3" style={{ color: '#5b6078' }}>Pour le connecter :</p>
          <CodeBlock label="bash" code={`claude mcp add --transport stdio mon-serveur -- node mon-serveur.js`} />
          <div className="flex items-center gap-2 mt-3">
            <ExternalLink size={12} strokeWidth={1.5} style={{ color: '#5b6078' }} />
            <a href="https://github.com/modelcontextprotocol/typescript-sdk" target="_blank" rel="noopener noreferrer"
              className="text-[12px] transition-colors" style={{ color: '#5b6078' }}
              onMouseEnter={e => (e.currentTarget.style.color = ACCENT)}
              onMouseLeave={e => (e.currentTarget.style.color = '#5b6078')}>
              github.com/modelcontextprotocol/typescript-sdk
            </a>
          </div>
        </section>

        {/* Section 8 */}
        <section>
          <h2 className="text-[15px] font-semibold mb-4 flex items-center" style={{ color: '#e2e8f0' }}>
            <SectionNum n={8} />Claude Code comme MCP Server
          </h2>
          <p className="text-[13px] leading-relaxed mb-4" style={{ color: '#94a3b8' }}>
            Détail souvent méconnu : Claude Code peut lui-même fonctionner comme un MCP server. D'autres applications peuvent s'y connecter pour exploiter ses capacités.
          </p>
          <CodeBlock label="bash" code={`# Lancer Claude Code en mode serveur MCP
claude mcp serve`} />
          <p className="text-[12px]" style={{ color: '#5b6078' }}>
            Utile pour les workflows multi-agents — un agent dans Claude Desktop qui délègue l'édition de code à Claude Code via MCP.
          </p>

          <h3 className="text-[13px] font-semibold mt-6 mb-3" style={{ color: '#e2e8f0' }}>Sources & documentation officielle</h3>
          <div className="space-y-2">
            {[
              { label: 'MCP — Documentation Claude Code', url: 'https://code.claude.com/docs/en/mcp' },
              { label: 'Architecture MCP', url: 'https://modelcontextprotocol.io/docs/learn/architecture' },
              { label: 'Introducing MCP — Blog Anthropic', url: 'https://www.anthropic.com/news/model-context-protocol' },
              { label: 'MCP Servers GitHub', url: 'https://github.com/modelcontextprotocol/servers' },
              { label: 'Supabase MCP Docs', url: 'https://supabase.com/docs/guides/getting-started/mcp' },
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
          <h3 className="text-[14px] font-semibold mb-2" style={{ color: '#e2e8f0' }}>Et maintenant ?</h3>
          <p className="text-[12px] mb-4" style={{ color: '#94a3b8' }}>
            Tu comprends MCP Serveurs vs Connecteurs. Consulte la bibliothèque pour voir tout ce qu'on utilise chez Buildrs avec les commandes exactes, et utilise le générateur pour savoir quels MCPs installer selon ton projet.
          </p>
          <div className="flex flex-wrap gap-3">
            <button onClick={() => navigate('#/dashboard/claude-os/apprendre/mcp-connecteurs/ressources-buildrs')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[12px] font-semibold transition-all"
              style={{ background: 'rgba(34,197,94,0.15)', border: '0.5px solid rgba(34,197,94,0.3)', color: '#22c55e' }}>
              <Plug size={13} strokeWidth={1.5} />
              Bibliothèque Ressources MCP
            </button>
            <button onClick={() => navigate('#/dashboard/claude-os/apprendre/mcp-connecteurs/generateur')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[12px] font-semibold transition-all"
              style={{ background: 'rgba(139,92,246,0.12)', border: '0.5px solid rgba(139,92,246,0.25)', color: '#8b5cf6' }}>
              <Plug size={13} strokeWidth={1.5} />
              Générateur MCP
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
