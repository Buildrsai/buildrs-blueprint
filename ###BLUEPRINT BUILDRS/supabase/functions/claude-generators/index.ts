// supabase/functions/claude-generators/index.ts
// Unified Claude OS generator — routes prompt | claude-md | skills | mcp | team-agents
// Senior Anthropic pattern: system/user separation, temperature=0, calibrated max_tokens

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const SUPABASE_URL     = Deno.env.get('SUPABASE_URL')!
const SUPABASE_ANON    = Deno.env.get('SUPABASE_ANON_KEY')!
const SUPABASE_SVC     = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const ANTHROPIC_KEY    = Deno.env.get('ANTHROPIC_API_KEY')!

const SONNET = 'claude-sonnet-4-6'
const HAIKU  = 'claude-haiku-4-5-20251001'

// ── Claude call helper ────────────────────────────────────────────────────────

async function callClaude(opts: {
  system: string
  user: string
  model: string
  max_tokens: number
}): Promise<string> {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': ANTHROPIC_KEY,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model:      opts.model,
      max_tokens: opts.max_tokens,
      temperature: 0,
      system:     opts.system,
      messages:   [{ role: 'user', content: opts.user }],
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Claude API ${res.status}: ${err.slice(0, 300)}`)
  }

  const data = await res.json() as {
    content?: { text: string }[]
    error?: { message: string }
    stop_reason?: string
  }

  if (data.error) throw new Error(`Claude: ${data.error.message}`)
  const text = data.content?.[0]?.text ?? ''
  if (!text) throw new Error(`Empty response. stop_reason: ${data.stop_reason}`)
  return text
}

// ─────────────────────────────────────────────────────────────────────────────
// HANDLER 1 — Générateur Prompt Parfait
// Framework Anthropic officiel: Context → Instructions → Examples → Output Format
// ─────────────────────────────────────────────────────────────────────────────

function systemPrompt(): string {
  return `Tu es un expert en prompt engineering chez Anthropic. Tu maîtrises parfaitement le framework officiel de construction de prompts : Context → Instructions → Examples → Output Format.

<context>
Tu génères des system prompts production-ready pour Claude. Chaque prompt que tu génères doit être immédiatement opérationnel — pas de placeholder, pas de commentaire, pas d'emoji.
</context>

<instructions>
1. Structure OBLIGATOIRE du prompt généré :
   - Section CONTEXTE : rôle de l'assistant + arrière-plan du projet
   - Section INSTRUCTIONS : liste numérotée d'instructions précises, mode impératif
   - Section EXEMPLES : 2-3 exemples concrets input/output (few-shot) si pertinent
   - Section FORMAT DE SORTIE : format exact attendu, contraintes, longueur

2. Qualité exigée :
   - Chaque instruction est une action concrète, pas un principe vague
   - Le ton est direct, professionnel, sans fioritures
   - Pas d'emoji dans le prompt généré
   - Le prompt doit tenir dans 2000 tokens maximum

3. Génère UNIQUEMENT le texte du system prompt, sans explication ni commentaire autour.
</instructions>

<output_format>
Texte brut du system prompt, structuré avec des sections en majuscules suivies de deux-points.
Exemple de structure :

CONTEXTE :
[...]

INSTRUCTIONS :
1. [...]
2. [...]

EXEMPLES :
Input : [...]
Output : [...]

FORMAT DE SORTIE :
[...]
</output_format>`
}

function userPrompt(p: Record<string, string>): string {
  return `Génère un system prompt complet pour le projet suivant.

Nom du projet : ${p.projectName || 'Mon projet'}
Contexte / rôle de l'assistant : ${p.context || 'Assistant généraliste'}
Tâche principale : ${p.task || 'Aider l\'utilisateur'}
Contraintes et règles : ${p.constraints || 'Aucune contrainte spécifique'}
Format de sortie attendu : ${p.outputFormat || 'Texte structuré'}

Génère le system prompt complet. Aucun commentaire autour, uniquement le prompt.`
}

// ─────────────────────────────────────────────────────────────────────────────
// HANDLER 2 — Générateur CLAUDE.md
// ─────────────────────────────────────────────────────────────────────────────

function systemClaudeMd(): string {
  return `Tu es un expert en architecture de projets et en conventions de développement pour Claude Code. Tu génères des fichiers CLAUDE.md production-ready.

<context>
CLAUDE.md est le fichier de mémoire d'un projet pour Claude Code. Il définit l'architecture, les conventions, les commandes, les règles métier, et tout ce que Claude doit savoir pour contribuer efficacement au projet sans faire d'erreurs.
</context>

<instructions>
1. Génère un CLAUDE.md complet, structuré, immédiatement utilisable
2. Adapte le stack aux informations fournies — ne hardcode JAMAIS Next.js si le projet utilise React+Vite
3. Sections obligatoires :
   - Identité du projet (nom, objectif, cible)
   - Stack technique (liste précise des outils)
   - Commandes essentielles (dev, build, test, lint, deploy)
   - Architecture (structure des dossiers, composants clés)
   - Base de données (tables, auth, RLS si Supabase)
   - Paiement (si Stripe : produits, webhooks)
   - Conventions de code (nommage, style, langue des commentaires)
   - Règles absolues (ce qu'il NE FAUT PAS faire)
4. Utilise des blocs de code \`\`\` pour les commandes et structures
5. Pas d'emoji dans le fichier généré
6. Sois précis et concis — pas de philosophie, que des faits actionnables
</instructions>

<output_format>
Fichier CLAUDE.md complet en Markdown. Commence directement par # CLAUDE.md — [Nom du projet].
</output_format>`
}

function userClaudeMd(p: Record<string, string>): string {
  return `Génère le fichier CLAUDE.md complet pour ce projet.

Nom : ${p.projectName || 'Mon Projet'}
Description : ${p.description || 'Application web'}
Objectif business : ${p.businessObjective || 'Générer du revenu'}
Cible utilisateurs : ${p.targetAudience || 'Professionnels'}

Stack technique :
- Frontend : ${p.frontend || 'React 18 + TypeScript + Vite + Tailwind CSS'}
- Backend / BDD : ${p.backend || 'Supabase (PostgreSQL + Auth + Edge Functions)'}
- Paiement : ${p.payment || 'Stripe Checkout'}
- Hosting : ${p.hosting || 'Vercel'}
- Autres outils : ${p.otherTools || 'Resend (emails), Lucide (icônes)'}

Fonctionnalités principales : ${p.features || 'Auth, dashboard, paiement'}
Tables Supabase : ${p.tables || 'users, profiles, purchases'}
RLS activé : ${p.rls || 'oui'}
Auth méthodes : ${p.authMethods || 'Email + Google OAuth'}

Modèle de monétisation : ${p.monetization || 'Abonnement mensuel'}
Plans tarifaires : ${p.pricing || 'Starter 29€/mois, Pro 79€/mois'}

Langue du code/commentaires : ${p.codeLanguage || 'Français'}
Conventions particulières : ${p.conventions || 'Pas d\'emoji dans le code, SVG Lucide pour les icônes'}
Fichiers à ne jamais modifier : ${p.neverModify || '.env, supabase/migrations/'}
Règles métier : ${p.businessRules || 'Aucune règle spécifique'}`
}

// ─────────────────────────────────────────────────────────────────────────────
// HANDLER 3 — Générateur Skills
// ─────────────────────────────────────────────────────────────────────────────

function systemSkills(): string {
  return `Tu es un expert Claude Code et en création de skills (commandes personnalisées). Tu génères des fichiers SKILL.md parfaits, immédiatement installables.

<context>
Les skills Claude Code sont des fichiers Markdown avec frontmatter YAML qui définissent des commandes personnalisées. Ils permettent d'encapsuler des workflows complexes en une seule commande slash.

Structure d'un skill :
---
name: nom-du-skill
description: Ce que fait le skill (utilisé pour la recherche)
---

[Corps du skill en Markdown avec instructions précises]
</context>

<instructions>
1. Génère un skill complet et opérationnel basé sur la description fournie
2. Le frontmatter YAML doit avoir name (kebab-case) et description (1 phrase précise)
3. Le corps doit contenir :
   - Instructions claires sur QUAND utiliser ce skill
   - Étapes précises de ce que Claude doit faire
   - Format de sortie attendu
   - Exemples d'utilisation si pertinent
4. Ton impératif et direct — pas de "vous pouvez", mais "fais X, puis Y"
5. Pas d'emoji
6. Longueur optimale : 300-600 mots de corps (assez pour être utile, assez court pour tenir en contexte)
</instructions>

<output_format>
Fichier SKILL.md complet avec frontmatter YAML valide. Commence par ---.
</output_format>`
}

function userSkills(p: Record<string, string>): string {
  return `Génère un skill Claude Code complet.

Nom du skill : ${p.skillName || 'mon-skill'}
Description courte : ${p.description || 'Un skill personnalisé'}
Ce que le skill doit faire : ${p.instructions || 'Exécuter une tâche spécifique'}
Contexte du projet : ${p.context || 'Projet web React + TypeScript'}
Exemples de cas d'usage : ${p.examples || 'Aucun exemple spécifique'}
Contraintes particulières : ${p.constraints || 'Aucune contrainte'}`
}

// ─────────────────────────────────────────────────────────────────────────────
// HANDLER 4 — Générateur MCP (Haiku — recommandation rapide)
// ─────────────────────────────────────────────────────────────────────────────

function systemMcp(): string {
  return `Tu es un expert MCP (Model Context Protocol) et intégrations Claude. Tu recommandes les MCP servers et connecteurs Claude.ai les plus pertinents selon le type de projet.

<context>
Les MCP servers étendent les capacités de Claude Code : accès base de données, navigation web, intégrations SaaS, tests, etc.
Les connecteurs Claude.ai (Integrations) permettent à Claude.ai d'accéder directement à des outils tiers.

MCP servers les plus courants :
- supabase-mcp : accès direct à Supabase (tables, auth, edge functions)
- playwright-mcp : tests et automatisation navigateur
- fetch-mcp : requêtes HTTP et scraping
- context7 : documentation bibliothèques à jour
- figma-mcp : lecture designs Figma
- 21st-magic : composants UI React générés
- vercel-mcp : déploiements et logs Vercel
- stripe-mcp : produits et transactions Stripe
- github-mcp : issues, PRs, repos GitHub

Connecteurs Claude.ai principaux :
- Supabase, Linear, Notion, GitHub, Google Drive, Slack, Jira, Figma, Stripe, Vercel
</context>

<instructions>
1. Analyse le type de projet et les besoins décrits
2. Recommande 3-5 MCP servers prioritaires avec justification courte
3. Recommande 3-5 connecteurs Claude.ai pertinents
4. Pour chaque MCP server, fournis la commande d'installation exacte
5. Génère le bloc .mcp.json minimal avec les MCPs recommandés
6. Sois concret : explique POURQUOI chaque MCP est utile pour CE projet spécifique
</instructions>

<output_format>
Markdown structuré avec sections : MCP Servers recommandés, Connecteurs Claude.ai, Configuration .mcp.json
</output_format>`
}

function userMcp(p: Record<string, string>): string {
  return `Recommande les MCP servers et connecteurs pour ce projet.

Type de projet : ${p.projectType || 'Application web SaaS'}
Description : ${p.description || 'SaaS avec authentification et paiement'}
Stack : ${p.stack || 'React + Supabase + Stripe + Vercel'}
Besoins spécifiques : ${p.needs || 'Base de données, paiements, déploiement'}
Niveau du développeur : ${p.level || 'Intermédiaire'}`
}

// ─────────────────────────────────────────────────────────────────────────────
// HANDLER 5 — Générateur Team Agents
// ─────────────────────────────────────────────────────────────────────────────

function systemTeamAgents(): string {
  return `Tu es un expert en orchestration multi-agents Claude. Tu génères des prompts d'équipe (Team) parfaits pour Claude Code — des configurations qui permettent à plusieurs agents de travailler en parallèle sur un même projet.

<context>
Claude Code supporte le mode "multi-agent" où plusieurs instances de Claude travaillent en parallèle comme une équipe. Chaque agent a un rôle précis, des fichiers dédiés, et ne touche pas aux fichiers des autres agents.

Structure d'un bon prompt Team :
- Contexte projet (nom, objectif, stack)
- Description précise de la tâche globale
- Liste des agents avec rôle + responsabilités précises + fichiers qu'il peut modifier
- Règles de coordination (interfaces partagées, communication entre agents)
- Critères de succès
</context>

<instructions>
1. Génère un prompt Team complet, prêt à coller dans Claude Code
2. Chaque agent doit avoir :
   - Un nom de rôle clair (Backend, Frontend, Tests, etc.)
   - Des responsabilités précises et non-chevauchantes
   - Une liste des fichiers/dossiers qu'il contrôle exclusivement
   - Un livrable concret attendu
3. Ajoute des règles de coordination claires entre agents
4. Inclus un agent "Orchestrateur" ou "Lead" si la tâche est complexe
5. Stack obligatoire : utilise le stack fourni par l'utilisateur, pas de Next.js par défaut
6. Pas d'emoji dans le prompt généré
7. Ton direct et impératif
</instructions>

<output_format>
Prompt texte pur, structuré, prêt à copier-coller dans Claude Code. Commence par "Projet : [nom]".
</output_format>`
}

function userTeamAgents(p: Record<string, string>): string {
  return `Génère le prompt Team Agents complet pour cette tâche.

Nom du projet : ${p.projectName || 'Mon SaaS'}
Type de tâche : ${p.taskType || 'Construction complète'}
Description de la tâche : ${p.taskDescription || 'Construire un SaaS de A à Z'}
Stack technique : ${p.stack || 'React + TypeScript + Supabase + Stripe + Vercel'}
Agents à configurer (rôles) : ${p.agents || 'Backend, Frontend, Tests'}
CLAUDE.md disponible : ${p.hasClaude ? 'oui — Claude doit le lire en premier' : 'non'}
Skills disponibles : ${p.skills || 'aucun'}
Contraintes : ${p.constraints || 'aucune'}
Mode plan avant exécution : ${p.usePlan ? 'oui' : 'non'}`
}

// ─────────────────────────────────────────────────────────────────────────────
// ROUTER
// ─────────────────────────────────────────────────────────────────────────────

type GeneratorType = 'prompt' | 'claude-md' | 'skills' | 'mcp' | 'team-agents'

const HANDLERS: Record<GeneratorType, {
  system: () => string
  user: (p: Record<string, string>) => string
  model: string
  max_tokens: number
}> = {
  'prompt':      { system: systemPrompt,     user: userPrompt,     model: SONNET, max_tokens: 2000 },
  'claude-md':   { system: systemClaudeMd,   user: userClaudeMd,   model: SONNET, max_tokens: 4000 },
  'skills':      { system: systemSkills,     user: userSkills,     model: SONNET, max_tokens: 2000 },
  'mcp':         { system: systemMcp,        user: userMcp,        model: HAIKU,  max_tokens: 1500 },
  'team-agents': { system: systemTeamAgents, user: userTeamAgents, model: SONNET, max_tokens: 3000 },
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN HANDLER
// ─────────────────────────────────────────────────────────────────────────────

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS })

  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { ...CORS, 'Content-Type': 'application/json' },
    })

  try {
    // ── Auth ──────────────────────────────────────────────────────────────────
    const auth = req.headers.get('Authorization') ?? ''
    if (!auth) return json({ error: 'Non authentifié' }, 401)

    const userClient = createClient(SUPABASE_URL, SUPABASE_ANON, {
      global: { headers: { Authorization: auth } },
      auth: { autoRefreshToken: false, persistSession: false },
    })
    const { data: { user }, error: authErr } = await userClient.auth.getUser()
    if (authErr || !user) return json({ error: 'Non authentifié' }, 401)

    // ── Parse body ────────────────────────────────────────────────────────────
    const body = await req.json() as { type?: string; payload?: Record<string, string> }
    const { type, payload = {} } = body

    if (!type || !(type in HANDLERS)) {
      return json({ error: `Type invalide. Attendu: ${Object.keys(HANDLERS).join(' | ')}` }, 400)
    }

    const handler = HANDLERS[type as GeneratorType]

    // ── Generate ──────────────────────────────────────────────────────────────
    console.log(`[claude-generators] type=${type} model=${handler.model} user=${user.id}`)

    const result = await callClaude({
      system:     handler.system(),
      user:       handler.user(payload),
      model:      handler.model,
      max_tokens: handler.max_tokens,
    })

    // ── Save session (fire and forget) ────────────────────────────────────────
    const svcClient = createClient(SUPABASE_URL, SUPABASE_SVC, {
      auth: { autoRefreshToken: false, persistSession: false },
    })
    svcClient.from('generator_sessions').insert({
      user_id:    user.id,
      generator:  type,
      payload:    JSON.stringify(payload),
      result:     result.slice(0, 4000),
      created_at: new Date().toISOString(),
    }).then(({ error }) => {
      if (error) console.error('[claude-generators] session save error:', error.message)
    })

    console.log(`[claude-generators] done type=${type} chars=${result.length}`)
    return json({ result })

  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[claude-generators] error:', msg)
    return json({ error: msg }, 500)
  }
})
