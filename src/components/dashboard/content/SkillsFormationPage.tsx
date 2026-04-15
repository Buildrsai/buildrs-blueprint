import { useState, useCallback } from 'react'
import { ArrowLeft, Copy, Check, ExternalLink, Wrench, ChevronRight } from 'lucide-react'

interface Props {
  navigate: (hash: string) => void
}

function CodeBlock({ code, label }: { code: string; label?: string }) {
  const [copied, setCopied] = useState(false)
  const doCopy = useCallback(() => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [code])
  return (
    <div className="relative rounded-xl overflow-hidden my-4" style={{ background: '#0d1117', border: '1px solid #30363d' }}>
      {label && (
        <div className="px-4 py-1.5" style={{ borderBottom: '1px solid #30363d', background: '#161b22' }}>
          <span className="text-[10px] font-medium" style={{ fontFamily: 'Geist Mono, monospace', color: 'hsl(var(--muted-foreground))' }}>{label}</span>
        </div>
      )}
      <pre className="px-4 py-4 overflow-x-auto text-[12px] leading-relaxed" style={{ fontFamily: 'Geist Mono, ui-monospace, monospace', color: '#c9d1d9' }}>
        <code>{code}</code>
      </pre>
      <button onClick={doCopy} className="absolute top-2.5 right-2.5 flex items-center gap-1.5 px-2 py-1 rounded-lg transition-all"
        style={{ background: 'hsl(var(--secondary))', border: '0.5px solid hsl(var(--border))', color: copied ? '#22c55e' : 'hsl(var(--muted-foreground))' }}>
        {copied ? <Check size={11} strokeWidth={2} /> : <Copy size={11} strokeWidth={1.5} />}
        <span className="text-[10px] font-medium">{copied ? 'Copié' : 'Copier'}</span>
      </button>
    </div>
  )
}

function Callout({ children, type = 'info' }: { children: React.ReactNode; type?: 'info' | 'warning' | 'success' }) {
  const s = type === 'warning'
    ? { bg: 'rgba(234,179,8,0.06)', border: 'rgba(234,179,8,0.2)', color: '#eab308', label: 'IMPORTANT' }
    : type === 'success'
    ? { bg: 'rgba(34,197,94,0.06)', border: 'rgba(34,197,94,0.2)', color: '#22c55e', label: 'BUILDRS' }
    : { bg: 'rgba(77,150,255,0.06)', border: 'rgba(77,150,255,0.2)', color: '#4d96ff', label: 'NOTE' }
  return (
    <div className="rounded-xl px-4 py-3.5 my-4" style={{ background: s.bg, border: `0.5px solid ${s.border}` }}>
      <p className="text-[9px] font-bold uppercase tracking-[0.1em] mb-1.5" style={{ color: s.color }}>{s.label}</p>
      <div className="text-[12.5px] leading-relaxed" style={{ color: 'hsl(var(--muted-foreground))' }}>{children}</div>
    </div>
  )
}

function SectionTitle({ num, title }: { num: string; title: string }) {
  return (
    <div className="flex items-center gap-3 mt-12 mb-6 pt-10" style={{ borderTop: '0.5px solid hsl(var(--border))' }}>
      <span className="text-[10px] font-black tabular-nums px-2 py-0.5 rounded-md flex-shrink-0"
        style={{ background: 'rgba(34,197,94,0.1)', color: '#22c55e', border: '0.5px solid rgba(34,197,94,0.25)', letterSpacing: '0.03em' }}>
        {num}
      </span>
      <h2 className="text-[17px] font-extrabold" style={{ color: 'hsl(var(--foreground))', letterSpacing: '-0.025em' }}>{title}</h2>
    </div>
  )
}

function SubTitle({ title }: { title: string }) {
  return <h3 className="text-[13px] font-bold mb-3 mt-7" style={{ color: 'hsl(var(--foreground))', letterSpacing: '-0.015em' }}>{title}</h3>
}

function Body({ children }: { children: React.ReactNode }) {
  return <p className="text-[13px] leading-relaxed mb-4" style={{ color: 'hsl(var(--muted-foreground))' }}>{children}</p>
}

function TableRow({ cols, header }: { cols: string[]; header?: boolean }) {
  return (
    <div className={`grid px-4 py-2.5 ${cols.length === 3 ? 'grid-cols-3' : 'grid-cols-2'}`}
      style={{ borderBottom: '0.5px solid hsl(var(--border))', background: header ? 'hsl(var(--secondary))' : undefined }}>
      {cols.map((c, i) => (
        <p key={i} className={header ? 'text-[9px] font-bold uppercase tracking-[0.1em]' : 'text-[12px]'}
          style={{ color: header ? 'hsl(var(--muted-foreground))' : i === 0 ? '#c9d1d9' : 'hsl(var(--muted-foreground))', fontFamily: (!header && i === 0) ? 'Geist Mono, monospace' : undefined }}>
          {c}
        </p>
      ))}
    </div>
  )
}

function Table({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="rounded-xl overflow-hidden my-4" style={{ border: '0.5px solid hsl(var(--border))' }}>
      <TableRow cols={headers} header />
      {rows.map((r, i) => <TableRow key={i} cols={r} />)}
    </div>
  )
}

export function SkillsFormationPage({ navigate }: Props) {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-3xl mx-auto px-6 py-8">

        <button onClick={() => window.history.back()}
          className="flex items-center gap-2 text-sm mb-8 transition-opacity hover:opacity-70" style={{ color: 'hsl(var(--muted-foreground))' }}>
          <ArrowLeft size={14} strokeWidth={1.5} />
          <span>Retour à Skills</span>
        </button>

        <div className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[9px] font-bold uppercase tracking-[0.1em] px-2 py-0.5 rounded-md"
              style={{ background: 'rgba(77,150,255,0.12)', color: '#4d96ff', border: '0.5px solid rgba(77,150,255,0.25)' }}>Formation</span>
          </div>
          <h1 className="text-[26px] font-extrabold mb-3" style={{ color: 'hsl(var(--foreground))', letterSpacing: '-0.035em' }}>Skills</h1>
          <p className="text-[14px] leading-relaxed" style={{ color: 'hsl(var(--muted-foreground))' }}>
            Des commandes personnalisées que tu crées une fois et que tu invoques en un mot.
            <code style={{ fontFamily: 'Geist Mono, monospace', fontSize: '12px', padding: '1px 5px', background: 'hsl(var(--border))', borderRadius: 4, margin: '0 2px' }}>/commit</code>
            <code style={{ fontFamily: 'Geist Mono, monospace', fontSize: '12px', padding: '1px 5px', background: 'hsl(var(--border))', borderRadius: 4, margin: '0 2px' }}>/deploy</code>
            <code style={{ fontFamily: 'Geist Mono, monospace', fontSize: '12px', padding: '1px 5px', background: 'hsl(var(--border))', borderRadius: 4, margin: '0 2px' }}>/review</code>
            — ton workflow automatisé, ton temps gagné.
          </p>
        </div>

        {/* 01 */}
        <SectionTitle num="01" title="C'est quoi un Skill et pourquoi c'est un game changer" />
        <Body>
          Tu te retrouves à répéter les mêmes instructions à Claude Code : "fais un commit propre", "lance les tests et corrige les erreurs", "déploie en production"... Un skill transforme chacune de ces routines en une seule commande.
        </Body>
        <Body>
          Un skill, c'est une <strong style={{ color: 'hsl(var(--foreground))' }}>recette</strong> que tu donnes à Claude Code. Tu écris tes instructions une fois dans un fichier, et tu les invoques avec <code style={{ fontFamily: 'Geist Mono, monospace', fontSize: '11px', padding: '1px 4px', background: 'hsl(var(--border))', borderRadius: 4 }}>/nom-du-skill</code>. Un seul mot, une action complète.
        </Body>
        <Callout type="success">
          Chez Buildrs, les skills sont ce qui transforme Claude Code d'un outil générique en <strong style={{ color: 'hsl(var(--foreground))' }}>ton</strong> outil. Tes conventions, ton workflow, tes vérifications — tout encapsulé dans des commandes que tu lances en un mot. Des heures de répétition transformées en secondes.
        </Callout>
        <SubTitle title="L'évolution : des slash commands aux skills" />
        <Body>
          Si tu as déjà utilisé les anciennes slash commands (fichiers dans <code style={{ fontFamily: 'Geist Mono, monospace', fontSize: '11px', padding: '1px 4px', background: 'hsl(var(--border))', borderRadius: 4 }}>.claude/commands/</code>), les skills sont leur évolution. Tes anciens fichiers continuent de fonctionner. Les skills ajoutent : un dossier complet pour les fichiers de support, un frontmatter YAML pour contrôler le comportement, et le chargement automatique.
        </Body>

        {/* 02 */}
        <SectionTitle num="02" title="Anatomie d'un skill — La structure" />
        <Body>Chaque skill est un dossier contenant au minimum un fichier <code style={{ fontFamily: 'Geist Mono, monospace', fontSize: '11px', padding: '1px 4px', background: 'hsl(var(--border))', borderRadius: 4 }}>SKILL.md</code>.</Body>
        <CodeBlock label="Structure d'un skill" code={`mon-skill/
├── SKILL.md           # Instructions principales (obligatoire)
├── template.md        # Template que Claude peut utiliser (optionnel)
├── examples/
│   └── sample.md      # Exemple de résultat attendu (optionnel)
└── scripts/
    └── helper.sh      # Script exécutable (optionnel)`} />
        <SubTitle title="Le frontmatter — La carte d'identité du skill" />
        <CodeBlock label="Exemple de SKILL.md" code={`---
name: mon-skill
description: Ce que fait le skill et quand l'utiliser
disable-model-invocation: true
allowed-tools: Read, Write, Bash
---

Tes instructions en Markdown ici...`} />
        <SubTitle title="Les champs les plus importants" />
        <Table
          headers={['Champ', 'Ce que ça fait', 'Quand l\'utiliser']}
          rows={[
            ['name', 'Nom du skill → devient la commande /name', 'Toujours'],
            ['description', 'Claude l\'utilise pour décider quand charger le skill automatiquement (max 250 car.)', 'Toujours'],
            ['disable-model-invocation', 'Si true, seul TOI peux lancer le skill', 'Actions à risque (deploy, commit)'],
            ['allowed-tools', 'Outils autorisés sans demander permission', 'Pour fluidifier l\'exécution'],
            ['context: fork', 'Exécute dans un subagent isolé', 'Tâches lourdes'],
            ['argument-hint', 'Indice affiché dans l\'autocomplétio', 'Pour guider l\'utilisateur'],
            ['model', 'Modèle IA à utiliser', 'Haiku (rapide) ou Opus (puissant)'],
            ['paths', 'Glob patterns pour l\'activation auto', 'Skills spécifiques à certains fichiers'],
          ]}
        />
        <SubTitle title="Variables dynamiques" />
        <CodeBlock label="Variables disponibles dans tes instructions" code={`$ARGUMENTS        # Tous les arguments passés après le nom
                  # Ex : /fix-issue 42 → $ARGUMENTS = "42"
$0, $1...         # Accès par position
${'{CLAUDE_SESSION_ID}'}    # Identifiant de session
${'{CLAUDE_SKILL_DIR}'}     # Dossier contenant le SKILL.md`} />

        {/* 03 */}
        <SectionTitle num="03" title="Où placer ses skills" />
        <Table
          headers={['Emplacement', 'Chemin', 'Portée']}
          rows={[
            ['Personnel', '~/.claude/skills/mon-skill/SKILL.md', 'Tous tes projets'],
            ['Projet', '.claude/skills/mon-skill/SKILL.md', 'Ce projet uniquement'],
            ['Entreprise', 'Via les managed settings', 'Tous les utilisateurs'],
          ]}
        />
        <Callout type="success">
          <strong style={{ color: 'hsl(var(--foreground))' }}>Règle Buildrs :</strong> skill utile partout (commit, review, test) → <code style={{ fontFamily: 'Geist Mono, monospace', fontSize: '11px' }}>~/.claude/skills/</code> — skill spécifique à un SaaS (deploy Vercel, conventions du projet) → <code style={{ fontFamily: 'Geist Mono, monospace', fontSize: '11px' }}>.claude/skills/</code>
        </Callout>

        {/* 04 */}
        <SectionTitle num="04" title="Créer un skill — 2 méthodes" />
        <SubTitle title="Méthode 1 — Demander à Claude (la plus simple)" />
        <Body>Copie le contenu du skill souhaité et envoie ce prompt à Claude Code :</Body>
        <CodeBlock label="Prompt à coller dans Claude Code" code={`Crée-moi le fichier ~/.claude/skills/commit/SKILL.md avec le contenu suivant :
[colle le contenu du SKILL.md ici]`} />
        <Body>Claude crée automatiquement le dossier et le fichier. C'est du VibeCoding appliqué à la configuration.</Body>
        <SubTitle title="Méthode 2 — Le Skill Creator (plugin officiel)" />
        <CodeBlock label="Dans Claude Code" code={`/skill-creator`} />
        <Body>Claude te pose des questions et génère le SKILL.md pour toi. C'est le plugin méta : il crée d'autres skills.</Body>
        <Callout>
          Les skills sont détectés en temps réel. Tu peux modifier un SKILL.md pendant une session et les changements sont pris en compte immédiatement. Vérifie en tapant <code style={{ fontFamily: 'Geist Mono, monospace', fontSize: '11px' }}>/</code> suivi des premières lettres.
        </Callout>

        {/* 05 */}
        <SectionTitle num="05" title="Skills vs Subagents — Quand utiliser quoi" />
        <div className="rounded-xl overflow-hidden my-4" style={{ border: '0.5px solid hsl(var(--border))' }}>
          <div className="grid grid-cols-3 px-4 py-2" style={{ borderBottom: '0.5px solid hsl(var(--border))', background: 'hsl(var(--secondary))' }}>
            <p className="text-[9px] font-bold uppercase tracking-[0.1em]" style={{ color: 'hsl(var(--muted-foreground))' }}> </p>
            <p className="text-[9px] font-bold uppercase tracking-[0.1em]" style={{ color: '#22c55e' }}>Skill</p>
            <p className="text-[9px] font-bold uppercase tracking-[0.1em]" style={{ color: '#4d96ff' }}>Subagent</p>
          </div>
          {[
            ['Complexité', 'Simple : un fichier Markdown', 'Plus avancé : config YAML étendue'],
            ['Contexte', 'Dans ta conversation en cours', 'Fenêtre de contexte isolée'],
            ['Cas d\'usage', 'Tâches ponctuelles, workflows', 'Tâches complexes nécessitant isolation'],
            ['Invocation', '/nom-du-skill', 'Délégation automatique par Claude'],
            ['Fichier', '.claude/skills/nom/SKILL.md', '.claude/agents/nom.md'],
          ].map((r, i) => (
            <div key={i} className="grid grid-cols-3 px-4 py-2.5" style={{ borderBottom: '0.5px solid hsl(var(--border))' }}>
              <p className="text-[11px] font-medium" style={{ color: 'hsl(var(--muted-foreground))' }}>{r[0]}</p>
              <p className="text-[11px]" style={{ color: 'hsl(var(--muted-foreground))' }}>{r[1]}</p>
              <p className="text-[11px]" style={{ color: 'hsl(var(--muted-foreground))' }}>{r[2]}</p>
            </div>
          ))}
        </div>
        <Callout>
          <strong style={{ color: 'hsl(var(--foreground))' }}>Règle Buildrs :</strong> Pour 90% des cas, les skills suffisent. Passe aux subagents uniquement si tu as besoin d'isolation stricte, d'un modèle différent, ou de parallélisme.
        </Callout>
        <Body>Astuce combo : ajoute <code style={{ fontFamily: 'Geist Mono, monospace', fontSize: '11px', padding: '1px 4px', background: 'hsl(var(--border))', borderRadius: 4 }}>context: fork</code> dans le frontmatter pour qu'un skill s'exécute dans un subagent tout en restant invocable via <code style={{ fontFamily: 'Geist Mono, monospace', fontSize: '11px', padding: '1px 4px', background: 'hsl(var(--border))', borderRadius: 4 }}>/nom</code>.</Body>

        {/* 06 */}
        <SectionTitle num="06" title="Les skills bundled (intégrés à Claude Code)" />
        <Body>Claude Code inclut des skills pré-installés que tu peux invoquer directement sans rien configurer.</Body>
        <Table
          headers={['Skill', 'Commande', 'Ce qu\'il fait']}
          rows={[
            ['Batch', '/batch <instruction>', 'Changements massifs en parallèle. 5-30 unités, un agent par unité dans un git worktree isolé.'],
            ['Claude API', '/claude-api', 'Charge la doc API Claude. S\'active aussi automatiquement quand tu importes anthropic.'],
            ['Debug', '/debug [description]', 'Active le logging de debug et analyse les logs.'],
            ['Loop', '/loop [interval] <prompt>', 'Exécute un prompt de manière répétée. Ex : /loop 5m check if deploy finished.'],
            ['Simplify', '/simplify [focus]', 'Review tes fichiers modifiés avec 3 agents en parallèle, puis applique les corrections.'],
          ]}
        />

        {/* 07 */}
        <SectionTitle num="07" title="Injecter du contexte dynamique" />
        <Body>
          Les skills avancés utilisent la syntaxe <code style={{ fontFamily: 'Geist Mono, monospace', fontSize: '11px', padding: '1px 4px', background: 'hsl(var(--border))', borderRadius: 4 }}>!`commande`</code> pour exécuter des commandes shell avant que Claude ne voie les instructions.
        </Body>
        <CodeBlock label="Exemple — Skill pr-summary avec contexte dynamique" code={`---
name: pr-summary
description: Résumer les changements d'une pull request
context: fork
agent: Explore
allowed-tools: Bash(gh *)
---

## Contexte de la PR
- Diff de la PR : !\`gh pr diff\`
- Commentaires : !\`gh pr view --comments\`
- Fichiers modifiés : !\`gh pr diff --name-only\`

## Ta tâche
Résume cette PR en français :
1. Objectif principal
2. Changements majeurs
3. Points d'attention pour le reviewer`} />
        <Body>Quand tu invoques <code style={{ fontFamily: 'Geist Mono, monospace', fontSize: '11px', padding: '1px 4px', background: 'hsl(var(--border))', borderRadius: 4 }}>/pr-summary</code>, les commandes <code style={{ fontFamily: 'Geist Mono, monospace', fontSize: '11px', padding: '1px 4px', background: 'hsl(var(--border))', borderRadius: 4 }}>gh</code> s'exécutent d'abord, et Claude reçoit les résultats réels.</Body>

        {/* 08 */}
        <SectionTitle num="08" title="Bonnes pratiques Buildrs" />
        <div className="space-y-3 my-4">
          {[
            { num: '01', title: 'Des descriptions riches', desc: 'La description est ce que Claude utilise pour décider quand charger le skill automatiquement. Front-loade le cas d\'usage principal (max 250 caractères visibles).' },
            { num: '02', title: 'disable-model-invocation: true pour les actions à risque', desc: 'Tout ce qui a un effet de bord (deploy, commit, envoi d\'email) doit être protégé. Tu ne veux pas que Claude décide tout seul de déployer.' },
            { num: '03', title: 'Un skill = une seule chose bien', desc: 'Max 500 lignes pour le SKILL.md principal. Au-delà, découpe en fichiers de support dans le même dossier.' },
            { num: '04', title: 'Inclus des exemples de sortie', desc: 'Claude suit mieux les instructions quand il a un exemple concret du résultat attendu.' },
            { num: '05', title: 'Teste et itère', desc: 'Comme du code, un skill se teste et s\'améliore. Commence simple, utilise-le quelques fois, affine.' },
            { num: '06', title: 'Versionne tes skills projet dans Git', desc: 'Les skills dans .claude/skills/ sont versionnés avec le code. Toute l\'équipe (et tes Team Agents) bénéficie du même setup.' },
          ].map(item => (
            <div key={item.num} className="flex gap-4 p-4 rounded-xl" style={{ background: 'hsl(var(--secondary))', border: '0.5px solid hsl(var(--border))' }}>
              <span className="text-[13px] font-black flex-shrink-0 mt-0.5" style={{ color: '#22c55e', fontFamily: 'Geist Mono, monospace' }}>{item.num}</span>
              <div>
                <p className="text-[13px] font-bold mb-1" style={{ color: 'hsl(var(--foreground))', letterSpacing: '-0.01em' }}>{item.title}</p>
                <p className="text-[12px] leading-relaxed" style={{ color: 'hsl(var(--muted-foreground))' }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* 09 */}
        <SectionTitle num="09" title="Le plugin Superpowers — L'arsenal pré-construit" />
        <Body>
          Superpowers est le plugin de skills le plus utilisé par la communauté Claude Code. C'est un framework complet de développement avec 20+ skills pré-construits qui imposent une discipline que les non-devs n'ont pas naturellement.
        </Body>
        <SubTitle title="Ce qu'il apporte" />
        <div className="space-y-2 my-4">
          {[
            { cmd: '/superpowers:brainstorm', desc: 'Raffine tes idées avant de coder, explore les alternatives' },
            { cmd: '/superpowers:write-plan', desc: 'Plan d\'implémentation détaillé avec tâches concrètes' },
            { cmd: '/superpowers:execute-plan', desc: 'Exécute task par task sans sauter d\'étape' },
            { cmd: '/superpowers:systematic-debugging', desc: 'Debug en 4 phases : hypothèse → test → conclusion' },
            { cmd: '/superpowers:test-driven-development', desc: 'TDD strict — red-green-refactor automatisé' },
            { cmd: '/superpowers:verification-before-completion', desc: 'Vérifie tout avant de livrer' },
          ].map(item => (
            <div key={item.cmd} className="flex items-start gap-3 py-2" style={{ borderBottom: '0.5px solid hsl(var(--border))' }}>
              <code className="text-[11px] flex-shrink-0" style={{ fontFamily: 'Geist Mono, monospace', color: '#22c55e' }}>{item.cmd}</code>
              <p className="text-[12px]" style={{ color: 'hsl(var(--muted-foreground))' }}>{item.desc}</p>
            </div>
          ))}
        </div>
        <CodeBlock label="Installation" code={`/install-plugin superpowers@claude-plugins-official
# OU
/plugin marketplace add obra/superpowers-marketplace
/install-plugin superpowers@superpowers-marketplace`} />

        {/* 10 */}
        <SectionTitle num="10" title="Le Skill Creator — Créer ses propres skills sans coder" />
        <CodeBlock label="Installation" code={`/install-plugin skill-creator@claude-plugins-official`} />
        <Body>Puis tape <code style={{ fontFamily: 'Geist Mono, monospace', fontSize: '11px', padding: '1px 4px', background: 'hsl(var(--border))', borderRadius: 4 }}>/skill-creator</code> — Claude te pose des questions et génère le SKILL.md.</Body>
        <SubTitle title="Exemple concret" />
        <CodeBlock label="Prompt au Skill Creator" code={`/skill-creator

Crée un skill "landing-check" qui :
- Vérifie qu'une landing page a tous les éléments essentiels
  (hero, CTA, pricing, testimonials, FAQ, footer)
- Vérifie le SEO (title, meta, H1, alt images)
- Vérifie la performance (images optimisées, pas de scripts bloquants)
- Produit un rapport avec score et recommandations`} />

        {/* Sources */}
        <div className="mt-12 pt-8" style={{ borderTop: '0.5px solid hsl(var(--border))' }}>
          <p className="text-[9px] font-bold uppercase tracking-[0.1em] mb-4" style={{ color: 'hsl(var(--muted-foreground))' }}>Sources</p>
          <div className="flex flex-col gap-2">
            {[
              { label: 'Extend Claude with skills — Documentation Anthropic', url: 'https://code.claude.com/docs/en/skills' },
              { label: 'Agent Skills — Standard ouvert', url: 'https://agentskills.io' },
              { label: 'Superpowers — GitHub', url: 'https://github.com/obra/superpowers' },
              { label: 'Awesome Claude Skills — Liste communautaire', url: 'https://github.com/travisvn/awesome-claude-skills' },
            ].map((s, i) => (
              <a key={i} href={s.url} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 text-[12px] transition-opacity hover:opacity-70" style={{ color: '#4d96ff' }}>
                <ExternalLink size={11} strokeWidth={1.5} />{s.label}
              </a>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-10 rounded-2xl p-6" style={{ background: 'rgba(34,197,94,0.05)', border: '0.5px solid rgba(34,197,94,0.2)' }}>
          <p className="text-[14px] font-extrabold mb-2" style={{ color: 'hsl(var(--foreground))', letterSpacing: '-0.02em' }}>Et maintenant ?</p>
          <p className="text-[12px] mb-5" style={{ color: 'hsl(var(--muted-foreground))' }}>Tu sais ce qu'est un skill. Consulte la bibliothèque pour voir les 70+ skills qu'on utilise chez Buildrs, et utilise le générateur pour créer les tiens.</p>
          <div className="flex flex-col gap-2">
            <button onClick={() => navigate('#/dashboard/claude-os/apprendre/skills/ressources-buildrs')}
              className="flex items-center gap-2 text-[12px] transition-opacity hover:opacity-70" style={{ color: '#22c55e' }}>
              <ChevronRight size={12} strokeWidth={2} />Bibliothèque Skills Buildrs — 70+ skills avec commandes
            </button>
            <button onClick={() => navigate('#/dashboard/claude-os/apprendre/skills/generateur')}
              className="flex items-center gap-2 text-[12px] transition-opacity hover:opacity-70" style={{ color: '#8b5cf6' }}>
              <Wrench size={12} strokeWidth={2} />Générateur de Skills — Crée un skill custom en 4 étapes
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
