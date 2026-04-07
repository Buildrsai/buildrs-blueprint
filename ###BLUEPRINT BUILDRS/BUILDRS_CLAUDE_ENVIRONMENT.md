# BUILDRS — L'Environnement Claude Code Parfait
## Guide Complet : Setup, Plugins, MCP, Skills, Commandes

> **Document officiel Buildrs** — Ce guide te donne tout ce qu'il faut pour installer,
> configurer et utiliser l'environnement Claude Code utilisé en interne chez Buildrs.
> Objectif : Builder des SaaS professionnels avec IA, design premium, et méthodologie structurée.

---

## TABLE DES MATIÈRES

1. [Les 3 Couches de l'Environnement](#1-les-3-couches)
2. [Marketplaces — Installation de base](#2-marketplaces)
3. [Plugins Essentiels](#3-plugins)
4. [MCP Servers](#4-mcp-servers)
5. [Skills — Design](#5-skills-design)
6. [Skills — Marketing & SEO](#6-skills-marketing--seo)
7. [Skills — Plan & Architecture](#7-skills-plan--architecture)
8. [Skills — Qualité & Review](#8-skills-qualité--review)
9. [Skills — Deployment](#9-skills-deployment)
10. [Skills — Modes Spéciaux](#10-skills-modes-spéciaux)
11. [Skills — GStack (Garry Tan / YC)](#11-skills-gstack)
12. [Skills — Superpowers Pipeline](#12-skills-superpowers)
13. [Skills — Analytics & Monitoring](#13-skills-analytics--monitoring)
14. [Skills — Vercel Ecosystem](#14-skills-vercel-ecosystem)
15. [Skills — Vidéo & Remotion](#15-skills-vidéo--remotion)
16. [CLAUDE.md — Structure Parfaite](#16-claudemd)
17. [System Prompt — Template Buildrs](#17-system-prompt)
18. [Slash Commands — Référence Complète](#18-slash-commands)
19. [Plan Mode & Opus — Gestion des Modèles](#19-plan-mode--opus)
20. [Telegram & Discord — Pilotage Mobile](#20-telegram--discord)
21. [Checklist d'Installation Complète](#21-checklist-dinstallation)

---

## 1. Les 3 Couches

Avant d'installer quoi que ce soit, comprends la structure. Claude Code a 3 couches distinctes qui travaillent ensemble.

```
┌─────────────────────────────────────────────────────────┐
│  COUCHE 1 — PLUGINS                                     │
│  Comportement + agents spécialisés                      │
│  → Installés via /install-plugin ou /add-marketplace    │
│  → Exemples : Superpowers, Frontend Design, Code Review │
├─────────────────────────────────────────────────────────┤
│  COUCHE 2 — MCP SERVERS                                 │
│  Connexions à des outils externes (APIs)                │
│  → Installés via Claude.ai Settings > Integrations      │
│  → Exemples : Vercel, Supabase, Stripe, GitHub          │
├─────────────────────────────────────────────────────────┤
│  COUCHE 3 — SKILLS CUSTOM                               │
│  Méthodologies IA (fichiers SKILL.md)                   │
│  → Installés dans ~/.claude/skills/                     │
│  → Exemples : GStack, skills Buildrs custom             │
└─────────────────────────────────────────────────────────┘
```

**Pourquoi c'est important :** Sans cette distinction, tu vas essayer d'installer un MCP server comme un plugin et vice versa. Les 3 couches s'installent différemment et servent des rôles différents.

---

## 2. Marketplaces

Les marketplaces sont des dépôts GitHub qui hébergent des collections de plugins. Tu dois les ajouter AVANT d'installer les plugins qu'elles contiennent.

### Installation (à faire une seule fois)

```bash
# Dans Claude Code, tape ces 4 commandes :
/add-marketplace https://github.com/anthropics/claude-plugins-official
/add-marketplace https://github.com/obra/superpowers-marketplace
/add-marketplace https://github.com/supabase/agent-skills
/add-marketplace https://github.com/coreyhaines31/marketingskills
```

| Marketplace | Contenu | GitHub |
|-------------|---------|--------|
| **claude-plugins-official** | Plugins officiels Anthropic (Vercel, Supabase, Stripe, GitHub, Figma, etc.) | github.com/anthropics/claude-plugins-official |
| **superpowers-marketplace** | Superpowers — workflows structurés, mémoire, agents | github.com/obra/superpowers-marketplace |
| **supabase-agent-skills** | Skills spécialisés Supabase + Postgres | github.com/supabase/agent-skills |
| **marketingskills** | 30+ skills marketing, copywriting, SEO, growth | github.com/coreyhaines31/marketingskills |

> **Note :** Les plugins officiels Anthropic (`claude-plugins-official`) et les skills Superpowers (`superpowers-marketplace`) n'ont **pas** de repos individuels par plugin — tout est dans le monorepo de leur marketplace respective. Tu installes chaque plugin/skill avec la commande `/install-plugin nom@marketplace`, pas en clonant un repo séparé.

---

## 3. Plugins

### Superpowers — LE plugin fondamental

**Pourquoi c'est le plus important :** Sans Superpowers, Claude improvise. Avec Superpowers, il suit une méthodologie structurée (brainstorm → plan → implémentation → review). C'est la différence entre un junior qui code n'importe quoi et un senior qui réfléchit avant d'agir.

```bash
# Installation
/install-plugin superpowers@superpowers-marketplace
/install-plugin superpowers@claude-plugins-official
```

**Skills inclus :**
- `/superpowers:brainstorm` — Structure une idée avant de coder
- `/superpowers:write-plan` — Crée un plan d'implémentation détaillé
- `/superpowers:execute-plan` — Exécute le plan task par task
- `/superpowers:systematic-debugging` — Debug scientifique : hypothèse → test → fix
- `/superpowers:test-driven-development` — TDD strict
- `/superpowers:dispatching-parallel-agents` — Lance des agents en parallèle
- `/superpowers:verification-before-completion` — Vérifie avant de livrer
- `/superpowers:finishing-a-development-branch` — Finalise proprement une branche

**GitHub :** github.com/obra/superpowers-marketplace

---

### Frontend Design

**Pourquoi :** Transforme Claude en designer Figma-level. Applique les bonnes pratiques UI/UX automatiquement : hiérarchie visuelle, spacing système, accessibilité, composants réutilisables.

```bash
/install-plugin frontend-design@claude-plugins-official
```

**Usage :** Automatique lors de l'édition de fichiers TSX/CSS. Aussi `/frontend-design:frontend-design`

---

### Feature Dev (trilogy d'agents)

**Pourquoi :** Au lieu d'un seul Claude qui fait tout, tu as 3 spécialistes qui travaillent en pipeline. C'est 3x plus précis pour les features complexes.

```bash
/install-plugin feature-dev@claude-plugins-official
```

**Pipeline :**
1. `feature-dev:code-explorer` — Analyse le codebase existant avant de toucher quoi que ce soit
2. `feature-dev:code-architect` — Conçoit l'architecture de la feature
3. `feature-dev:code-reviewer` — Review le code produit

---

### Code Review

**Pourquoi :** Claude peut livrer du code qui fonctionne mais qui a des problèmes structurels non évidents. Ce plugin ajoute une review systématique.

```bash
/install-plugin code-review@claude-plugins-official
```

**Usage :** `/code-review:code-review`

---

### Security Guidance

**Pourquoi :** Claude peut introduire des failles sans le savoir (injection SQL, XSS, clés API exposées, RLS manquant). Ce plugin ajoute une couche de vérification sécurité automatique.

```bash
/install-plugin security-guidance@claude-plugins-official
```

---

### Skill Creator

**Pourquoi :** Tu peux créer tes propres skills custom directement depuis Claude Code. C'est le plugin qui te permet de packager ta propre méthodologie (design system Buildrs, stack Buildrs, etc.).

```bash
/install-plugin skill-creator@claude-plugins-official
```

**Usage :** `/skill-creator` → Claude te pose des questions et génère le SKILL.md

---

### Vercel Plugin

**Pourquoi :** Skills et agents spécialisés Vercel en plus du MCP server. Couvre le déploiement, les fonctions, le cache, les variables d'environnement, Next.js, AI SDK.

```bash
/install-plugin vercel@claude-plugins-official
```

**Skills inclus :**
- `/vercel:deploy` — Deploy avec vérifications
- `/vercel:bootstrap` — Initialise un nouveau projet
- `/vercel:env` — Gestion des variables d'environnement
- `/vercel:status` — Statut des deployments
- `/vercel:ai-sdk` — Guide AI SDK v6 (toujours à jour)
- `/vercel:nextjs` — Guide Next.js App Router
- `/vercel:workflow` — Workflow DevKit (agents durables)

---

### Supabase Plugin

**Pourquoi :** Skills spécialisés pour Auth, Database, Storage, Edge Functions. Inclut les best practices Postgres et RLS.

```bash
/install-plugin supabase@claude-plugins-official
/install-plugin postgres-best-practices@supabase-agent-skills
```

---

### Stripe Plugin

**Pourquoi :** Skills spécialisés pour l'intégration Stripe (webhooks, produits, paiements, abonnements).

```bash
/install-plugin stripe@claude-plugins-official
```

**Skills inclus :**
- `/stripe:stripe-best-practices` — Patterns Stripe production-ready
- `/stripe:explain-error` — Debug des erreurs Stripe
- `/stripe:test-cards` — Cartes de test par scénario

---

### GitHub Plugin

**Pourquoi :** Claude peut créer des issues, ouvrir des PRs, lire l'historique git, commenter du code — sans quitter la conversation.

```bash
/install-plugin github@claude-plugins-official
```

---

### Playwright

**Pourquoi :** Claude peut ouvrir un vrai navigateur (Chromium), cliquer, remplir des formulaires, prendre des screenshots. Indispensable pour le debug visuel et les tests E2E.

```bash
/install-plugin playwright@claude-plugins-official
```

**Outils disponibles :** navigate, click, fill_form, screenshot, evaluate, network_requests, console_messages

---

### Figma Plugin

**Pourquoi :** Claude lit tes designs Figma et les traduit directement en code. Avec le MCP Figma en plus, tu as lecture + écriture dans Figma.

```bash
/install-plugin figma@claude-plugins-official
```

**Skills inclus :**
- `/figma:figma-implement-design` — Traduit un design Figma en code
- `/figma:figma-use` — Workflow général Figma
- `/figma:figma-generate-design` — Génère un design dans Figma

---

### PostHog Plugin

**Pourquoi :** Analytics produit, feature flags, A/B tests, error tracking — tout piloté depuis Claude.

```bash
/install-plugin posthog@claude-plugins-official
```

---

### Marketing Skills Plugin

**Pourquoi :** 30+ skills spécialisés copywriting, SEO, growth, conversion. Voir section Marketing pour la liste complète.

```bash
/add-marketplace https://github.com/coreyhaines31/marketingskills
/install-plugin marketing-skills@marketingskills
```

---

### Commit Commands

**Pourquoi :** Des commandes de commit intelligentes qui formatent automatiquement les messages selon les conventions.

```bash
/install-plugin commit-commands@claude-plugins-official
```

**Usage :**
- `/commit` — Commit propre avec message structuré
- `/commit-push-pr` — Commit + push + PR GitHub en une commande

---

### CLAUDE.md Management

**Pourquoi :** Aide à créer et maintenir tes fichiers CLAUDE.md — la mémoire permanente de chaque projet.

```bash
/install-plugin claude-md-management@claude-plugins-official
```

**Usage :**
- `/claude-md-management:claude-md-improver` — Améliore un CLAUDE.md existant
- `/claude-md-management:revise-claude-md` — Révise selon les changements du projet

---

### Telegram & Discord Plugins

**Pourquoi :** Piloter Claude depuis ton téléphone via Telegram ou Discord. Tu envoies un message → Claude Code exécute et répond.

```bash
/install-plugin telegram@claude-plugins-official
/install-plugin discord@claude-plugins-official
```

**Setup :** Voir section 20 — Telegram & Discord

---

### Slack Plugin

```bash
/install-plugin slack@claude-plugins-official
```

**Skills :** résumés de canaux, drafts d'annonces, standup automatique

---

## 4. MCP Servers

Les MCP Servers donnent à Claude un accès direct à des outils externes. Ils s'installent depuis **Claude.ai → Settings → Integrations** ou via `~/.mcp.json`.

### Vercel MCP ✔

**Pourquoi :** Claude peut lire tes deployments, logs runtime, variables d'environnement, et déclencher des actions Vercel directement depuis la conversation.

**Installation :** Claude.ai → Settings → Integrations → Vercel → Connect

**Outils disponibles :**
- `get_deployment` — Détails d'un deployment
- `get_runtime_logs` — Logs de production en temps réel
- `list_deployments` — Liste des deployments récents
- `get_project` — Configuration du projet
- `deploy_to_vercel` — Déclencher un deploy
- `get_deployment_build_logs` — Logs de build

---

### Supabase MCP ✔

**Pourquoi :** Claude peut lire et écrire dans ta base de données, voir les migrations, appliquer des changements SQL, déployer des Edge Functions.

**Installation :** Claude.ai → Settings → Integrations → Supabase → Connect

**Outils disponibles :**
- `execute_sql` — Exécuter des requêtes SQL
- `apply_migration` — Appliquer une migration
- `list_tables` — Lister les tables
- `get_logs` — Logs des Edge Functions
- `deploy_edge_function` — Déployer une Edge Function
- `generate_typescript_types` — Générer les types TypeScript depuis le schéma
- `list_projects` — Lister les projets Supabase
- `get_advisors` — Recommandations de sécurité et performance

---

### GitHub MCP

**Pourquoi :** Claude peut créer des issues, ouvrir des PRs, lire le code, gérer les branches — tout sans quitter la conversation.

**Installation :** Claude.ai → Settings → Integrations → GitHub → Connect

---

### Stripe MCP

**Pourquoi :** Claude peut voir tes produits, prices, customers, invoices. Indispensable pour débugger les webhooks Stripe.

**Installation :** Claude.ai → Settings → Integrations → Stripe → Connect

> Nécessite ta clé API Stripe (Settings → API Keys)

---

### Context7 MCP ✔

**Pourquoi :** Claude récupère la documentation officielle de n'importe quelle lib en temps réel. Il ne code plus avec des docs obsolètes de son entraînement.

**Exemple :** Tu travailles avec Next.js App Router → Claude consulte automatiquement la doc officielle à jour avant de coder.

**Installation :** Claude.ai → Settings → Integrations → Context7 → Connect

**Outil principal :** `query-docs` + `resolve-library-id`

---

### 21st.dev Magic MCP

**Pourquoi :** Génération de composants UI premium à partir d'une description. Les composants sont production-ready avec variants, dark mode, accessibilité.

**Installation :** Claude.ai → Settings → Integrations → 21st.dev Magic → Connect

**Outils disponibles :**
- `21st_magic_component_builder` — Génère un composant depuis une description
- `21st_magic_component_refiner` — Affine un composant existant
- `21st_magic_component_inspiration` — Suggestions de composants similaires
- `logo_search` — Recherche de logos de marques

---

### Figma MCP ✔

**Pourquoi :** Lecture ET écriture dans Figma. Claude peut lire tes designs et les traduire en code, ou créer des éléments dans Figma.

**Installation :** Claude.ai → Settings → Integrations → Figma → Connect

**Outils disponibles :**
- `get_design_context` — Lit le design + génère du code de référence
- `get_screenshot` — Screenshot d'un composant Figma
- `get_metadata` — Métadonnées du fichier
- `generate_diagram` — Crée un diagramme dans FigJam
- `search_design_system` — Recherche dans le design system
- `get_variable_defs` — Récupère les tokens/variables

---

### Composio MCP

**Pourquoi :** Connecte Claude à +150 outils (Gmail, Notion, Linear, Slack, Airtable, HubSpot, etc.) via une seule connexion. Le couteau suisse des intégrations.

**Installation manuelle :**
```bash
# Prérequis : Python 3.11
brew install python@3.11
/opt/homebrew/opt/python@3.11/bin/pip3.11 install composio_core composio_tools

# Récupérer ton URL MCP personnelle
/opt/homebrew/opt/python@3.11/bin/python3.11 -c "
from composio import Composio
c = Composio(api_key='TON_API_KEY_COMPOSIO')
print(c.get_mcp_url())
"

# Ajouter dans ~/.mcp.json
```

```json
{
  "composio": {
    "type": "http",
    "url": "https://backend.composio.dev/tool_router/TON_ID/mcp",
    "headers": { "x-api-key": "TON_API_KEY_COMPOSIO" }
  }
}
```

**GitHub :** github.com/ComposioHQ/composio

**Lien :** composio.dev → Se créer un compte → Récupérer la clé API

---

### Notion MCP

**Pourquoi :** Claude lit et écrit dans ta workspace Notion. Utile pour synchroniser des contenus, créer des pages de documentation, gérer des bases de données Notion.

**Installation :** Claude.ai → Settings → Integrations → Notion → Connect

---

### Linear MCP

**Pourquoi :** Gestion de tickets et projets. Claude peut créer des issues, les assigner, changer leur statut, créer des milestones.

**Installation :** Claude.ai → Settings → Integrations → Linear → Connect

---

### Tavily MCP

**Pourquoi :** Recherche web en temps réel. Claude peut faire des vraies recherches Google/web depuis la conversation pour trouver des informations actuelles.

**Installation :** Claude.ai → Settings → Integrations → Tavily → Connect

---

### Amplitude MCP

**Pourquoi :** Analytics produit Amplitude. Requêtes, entonnoirs, cohortes directement depuis Claude.

**Installation :** Claude.ai → Settings → Integrations → Amplitude → Connect

---

### n8n MCP

**Pourquoi :** Automatisation. Claude peut déclencher des workflows n8n, consulter des executions, et intégrer des automatisations dans son workflow.

**Installation :** Claude.ai → Settings → Integrations → n8n → Connect

---

### tldraw MCP ✔

**Pourquoi :** Créer des diagrammes et schémas visuels directement depuis Claude. Architecture, flows, wireframes.

**Installation :** Claude.ai → Settings → Integrations → tldraw → Connect

---

### Canva MCP

**Pourquoi :** Créer et exporter des designs Canva (bannières, posts social, présentations) depuis Claude.

**Installation :** Claude.ai → Settings → Integrations → Canva → Connect

---

### Gamma MCP

**Pourquoi :** Créer des présentations, documents et pages web avec IA depuis Claude.

**Installation :** Claude.ai → Settings → Integrations → Gamma → Connect

---

### Craft MCP

**Pourquoi :** Craft est l'outil de notes et documentation qu'Alfred utilise chez Buildrs. Claude peut lire, créer et éditer des documents Craft, gérer des collections, créer des tâches et des tableaux blancs — sans quitter la conversation.

**Installation :** Claude.ai → Settings → Integrations → Craft → Connect

**Outils disponibles :**
- `documents_create / documents_list / documents_search` — Gestion des documents
- `blocks_add / blocks_update / blocks_delete / blocks_get` — Édition de contenu bloc par bloc
- `folders_create / folders_list` — Organisation
- `tasks_add / tasks_update / tasks_delete` — Gestion de tâches dans les documents
- `collections_create / collectionItems_add` — Bases de données et collections
- `whiteboard_create / whiteboardElements_add` — Tableaux blancs

---

### Excalidraw MCP

**Pourquoi :** Créer des diagrammes et schémas visuels directement depuis Claude. Idéal pour les architectures système, les flows utilisateurs, les wireframes rapides — Claude dessine, toi tu valides.

**Installation :** Claude.ai → Settings → Integrations → Excalidraw → Connect

**Outils disponibles :**
- `create_view` — Crée une nouvelle vue Excalidraw
- `export_to_excalidraw` — Exporte un diagramme au format Excalidraw
- `save_checkpoint / read_checkpoint` — Sauvegarde et restauration d'états

---

### Stitch MCP

**Pourquoi :** Assemblage d'interfaces UI. Claude peut générer des écrans complets à partir d'une description textuelle, les éditer, et appliquer un design system. C'est l'outil de maquettage rapide dans l'environnement Buildrs.

**Installation :** Claude.ai → Settings → Integrations → Stitch → Connect

**Outils disponibles :**
- `create_project / get_project / list_projects` — Gestion des projets UI
- `generate_screen_from_text` — Génère un écran depuis une description
- `list_screens / get_screen / edit_screens` — Navigation et édition des écrans
- `generate_variants` — Génère des variantes d'un écran
- `create_design_system / apply_design_system` — Système de design

---

### Vibe Prospecting MCP

**Pourquoi :** Prospection et enrichissement de leads. Claude peut enrichir des fiches entreprise/prospects, faire des recherches de matching, exporter des listes — utile pour les projets clients et les campagnes d'acquisition.

**Installation :** Claude.ai → Settings → Integrations → Vibe Prospecting → Connect

**Outils disponibles :**
- `enrich-business / enrich-prospects` — Enrichissement de données
- `match-business / match-prospects` — Matching par critères
- `fetch-entities / fetch-entities-statistics` — Récupération d'entités
- `autocomplete` — Autocomplétion pour la recherche
- `export-to-csv` — Export des résultats
- `estimate-cost` — Estimation du coût d'une opération

---

### Cloudflare Developer Platform MCP

**Pourquoi :** Claude peut gérer directement les ressources Cloudflare : bases de données D1, namespaces KV, buckets R2, et Workers. Indispensable pour le déploiement d'applications sur Cloudflare depuis la conversation.

**Installation :** Claude.ai → Settings → Integrations → Cloudflare → Connect

> Nécessite un compte Cloudflare et un API Token (Dashboard → My Profile → API Tokens)

**Outils disponibles :**
- `d1_database_query / d1_database_create / d1_database_get` — Bases de données D1 (SQLite)
- `kv_namespace_create / kv_namespace_get / kv_namespace_update` — KV Store
- `r2_bucket_create / r2_bucket_get / r2_buckets_list` — Stockage R2
- `workers_list / workers_get_worker / workers_get_worker_code` — Workers
- `set_active_account / accounts_list` — Gestion des comptes
- `search_cloudflare_documentation` — Recherche dans la doc Cloudflare

---

## 5. Skills — Design

Les design skills transforment Claude en designer senior. Utilise-les AVANT de livrer un écran.

### ui-ux-pro-max

**Pourquoi :** Le skill de review UX le plus complet. Il vérifie la hiérarchie visuelle, l'accessibilité, la cohérence du design system, les états (loading/empty/error), et le mobile-first.

**Commande :** `/ui-ux-pro-max`

**Quand l'utiliser :** Avant chaque livraison d'un écran ou composant. C'est le "QA design" final.

---

### design

**Pourquoi :** Design system + composants — usage général pour tout ce qui est design.

**Commande :** `/design`

---

### design-html

**Pourquoi :** Génère du HTML/CSS/Tailwind de qualité design premium directement. Utile pour les maquettes rapides.

**Commande :** `/design-html`

---

### design-shotgun

**Pourquoi :** Génère plusieurs directions visuelles en parallèle. Quand tu ne sais pas encore dans quelle direction aller, ce skill te donne 3-5 options rapidement.

**Commande :** `/design-shotgun`

**Quand l'utiliser :** Au début d'un nouveau projet ou quand tu explores une nouvelle section.

---

### design-consultation

**Pourquoi :** Consultation design interactive. Claude pose des questions ciblées pour comprendre ton intention avant de proposer quoi que ce soit.

**Commande :** `/design-consultation`

---

### design-review

**Pourquoi :** Review d'un design existant avec critique structurée. Claude identifie les problèmes et propose des améliorations spécifiques.

**Commande :** `/design-review`

---

### design-system

**Pourquoi :** Crée ou améliore un design system complet (tokens de couleurs, typographie, spacing, composants de base, documentation).

**Commande :** `/design-system`

**Quand l'utiliser :** Au début d'un projet pour définir les fondations, ou pour documenter un système existant.

---

### ui-styling

**Pourquoi :** Focus sur le polish CSS/Tailwind — spacing précis, typographie, couleurs, ombres. Le skill du "dernière mile" visuellement.

**Commande :** `/ui-styling`

---

### banner-design

**Pourquoi :** Génère des bannières marketing (OG images, headers, ads). Produit du code ou des specifications pour des bannières production-ready.

**Commande :** `/banner-design`

---

### brand

**Pourquoi :** Réflexion brand et identité visuelle. Positionnement, personnalité de marque, guidelines visuelles.

**Commande :** `/brand`

---

### slides

**Pourquoi :** Crée des présentations structurées (pitch deck, onboarding, formation). Format Markdown ou HTML exportable.

**Commande :** `/slides`

---

### plan-design-review

**Pourquoi :** Review design intégrée dans le process de planification. Vérifie que le plan inclut les bons aspects UX/UI avant l'implémentation.

**Commande :** `/plan-design-review`

---

### video-to-website

**Pourquoi :** Transforme un script ou storyboard vidéo en landing page web. Utile pour convertir des concepts de vidéos marketing en pages HTML.

**Commande :** `/video-to-website`

---

## 6. Skills — Marketing & SEO

### Copywriting & Contenu

| Skill | Commande | Usage concret |
|-------|----------|---------------|
| **copywriting** | `/marketing-skills:copywriting` | Écriture persuasive — headlines, body copy, CTAs |
| **copy-editing** | `/marketing-skills:copy-editing` | Améliore un texte existant (clarté, impact, flow) |
| **content-strategy** | `/marketing-skills:content-strategy` | Plan de contenu (blog, social, email) |
| **social-content** | `/marketing-skills:social-content` | Posts pour Twitter/X, LinkedIn, Instagram |
| **cold-email** | `/marketing-skills:cold-email` | Séquences cold email B2B |
| **email-sequence** | `/marketing-skills:email-sequence` | Nurture, onboarding, réactivation |

### Conversion Rate Optimization (CRO)

| Skill | Commande | Usage concret |
|-------|----------|---------------|
| **page-cro** | `/marketing-skills:page-cro` | Optimiser une landing page pour convertir |
| **signup-flow-cro** | `/marketing-skills:signup-flow-cro` | Optimiser le flow d'inscription |
| **onboarding-cro** | `/marketing-skills:onboarding-cro` | Améliorer l'onboarding, réduire le churn early |
| **paywall-upgrade-cro** | `/marketing-skills:paywall-upgrade-cro` | Optimiser la page upgrade/pricing |
| **popup-cro** | `/marketing-skills:popup-cro` | Popups qui convertissent sans être intrusifs |
| **form-cro** | `/marketing-skills:form-cro` | Réduire les frictions dans les formulaires |

### Growth & Acquisition

| Skill | Commande | Usage concret |
|-------|----------|---------------|
| **paid-ads** | `/marketing-skills:paid-ads` | Stratégie Meta Ads, Google Ads, copy |
| **ad-creative** | `/marketing-skills:ad-creative` | Créatifs ads (concepts + textes) |
| **lead-magnets** | `/marketing-skills:lead-magnets` | Lead magnets à fort taux de conversion |
| **free-tool-strategy** | `/marketing-skills:free-tool-strategy` | Stratégie outil gratuit viral (top of funnel) |
| **referral-program** | `/marketing-skills:referral-program` | Programme referral (mécanique + copy) |
| **launch-strategy** | `/marketing-skills:launch-strategy` | Plan de lancement produit ou feature |
| **marketing-ideas** | `/marketing-skills:marketing-ideas` | Brainstorm d'idées marketing non conventionnelles |

### Rétention & Revenue

| Skill | Commande | Usage concret |
|-------|----------|---------------|
| **churn-prevention** | `/marketing-skills:churn-prevention` | Identifier et réduire le churn |
| **pricing-strategy** | `/marketing-skills:pricing-strategy` | Stratégie de pricing (freemium, tiers, annual) |
| **revops** | `/marketing-skills:revops` | Revenue operations (pipeline, conversion, LTV) |

### Positionnement & Vente

| Skill | Commande | Usage concret |
|-------|----------|---------------|
| **product-marketing-context** | `/marketing-skills:product-marketing-context` | Positionnement, messaging, ICP |
| **competitor-alternatives** | `/marketing-skills:competitor-alternatives` | Pages "Meilleure alternative à X" |
| **sales-enablement** | `/marketing-skills:sales-enablement` | One-pager, gestion des objections, deck commercial |
| **marketing-psychology** | `/marketing-skills:marketing-psychology` | Principes psychologiques appliqués au marketing |

### SEO

| Skill | Commande | Usage concret |
|-------|----------|---------------|
| **seo** | `/seo` | Audit SEO technique complet + recommendations |
| **ai-seo** | `/marketing-skills:ai-seo` | SEO IA (contenus optimisés, clusters thématiques) |
| **seo-audit** | `/marketing-skills:seo-audit` | Audit SEO structuré avec priorités |
| **site-architecture** | `/marketing-skills:site-architecture` | Architecture de site optimisée SEO |
| **programmatic-seo** | `/marketing-skills:programmatic-seo` | Pages SEO générées programmatiquement |
| **schema-markup** | `/marketing-skills:schema-markup` | JSON-LD, rich snippets, structured data |
| **analytics-tracking** | `/marketing-skills:analytics-tracking` | Setup tracking GA4, PostHog, events |
| **ab-test-setup** | `/marketing-skills:ab-test-setup` | Configurer et analyser des A/B tests |

---

## 7. Skills — Plan & Architecture

> **Règle Buildrs :** On ne code JAMAIS sans avoir planifié. Ces skills sont obligatoires avant toute nouvelle feature.

### autoplan

**Pourquoi :** Claude crée automatiquement un plan avant de coder. Il analyse ton besoin, identifie les risques, propose une approche structurée.

**Commande :** `/autoplan`

**Quand l'utiliser :** Dès que tu décris une nouvelle feature ou un bug complexe.

---

### superpowers:brainstorm

**Pourquoi :** Exploration structurée d'une idée. Claude pose des questions une par une pour comprendre l'objectif, les contraintes, les critères de succès, puis propose 2-3 approches avec trade-offs.

**Commande :** `/superpowers:brainstorm`

**Process :** Exploration → Questions → 2-3 approches → Design → Validation → Plan

---

### superpowers:write-plan

**Pourquoi :** Crée un plan d'implémentation détaillé avec des tâches concrètes, ordonnées, et des critères de succès pour chaque étape.

**Commande :** `/superpowers:write-plan`

**Output :** Fichier `docs/superpowers/plans/YYYY-MM-DD-feature-name.md`

---

### superpowers:execute-plan

**Pourquoi :** Exécute le plan task par task en cochant chaque étape. Claude ne saute aucune étape et vérifie à chaque fois.

**Commande :** `/superpowers:execute-plan`

---

### plan-ceo-review

**Pourquoi :** Review du plan depuis l'angle CEO. Claude vérifie : est-ce que ça va dans le bon sens ? Est-ce que le ROI est là ? Est-ce que les priorités sont bonnes ?

**Commande :** `/plan-ceo-review`

---

### plan-eng-review

**Pourquoi :** Review du plan depuis l'angle ingénierie. Claude vérifie la faisabilité technique, les risques, la dette technique potentielle.

**Commande :** `/plan-eng-review`

---

### plan-design-review

**Pourquoi :** Review du plan depuis l'angle design/UX. Claude vérifie que les aspects UX sont bien couverts avant l'implémentation.

**Commande :** `/plan-design-review`

---

## 8. Skills — Qualité & Review

### qa

**Pourquoi :** Tests et quality assurance complets. Claude génère des tests, vérifie la couverture, identifie les cas limites non couverts.

**Commande :** `/qa`

---

### qa-only

**Pourquoi :** QA sans toucher au code — audit uniquement. Claude évalue la qualité du code existant et liste les problèmes.

**Commande :** `/qa-only`

---

### code-review:code-review

**Pourquoi :** Review approfondie du code. Identifie les bugs potentiels, les problèmes de performance, les anti-patterns, les vulnérabilités sécurité.

**Commande :** `/code-review:code-review`

---

### web-quality-audit

**Pourquoi :** Audit qualité complet d'une page web : performance, accessibilité, SEO technique, bonnes pratiques, sécurité HTTP.

**Commande :** `/web-quality-audit`

---

### accessibility

**Pourquoi :** Audit accessibilité WCAG. Contraste, navigation clavier, lecteurs d'écran, attributs ARIA, structure sémantique.

**Commande :** `/accessibility`

---

### performance

**Pourquoi :** Audit performance web. Bundle size, lazy loading, images, fonts, critical CSS, temps de chargement.

**Commande :** `/performance`

---

### core-web-vitals

**Pourquoi :** Focus spécifique sur les Core Web Vitals Google (LCP, CLS, FID/INP). Directement lié au SEO et au ranking Google.

**Commande :** `/core-web-vitals`

---

### best-practices

**Pourquoi :** Checklist de bonnes pratiques générales (React, TypeScript, sécurité, accessibilité).

**Commande :** `/best-practices`

---

### simplify

**Pourquoi :** Review + simplification du code modifié. Claude identifie les duplications, les abstractions inutiles, les chemins trop complexes.

**Commande :** `/simplify`

---

### superpowers:systematic-debugging

**Pourquoi :** Protocole de debug scientifique. Claude ne devine pas — il formule une hypothèse, la teste, tire des conclusions.

**Commande :** Déclenché automatiquement lors d'une session de debug. Aussi `/superpowers:systematic-debugging`

---

### superpowers:test-driven-development

**Pourquoi :** TDD strict. Les tests sont écrits AVANT le code. Claude ne code pas une ligne sans un test qui l'exige.

**Commande :** `/superpowers:test-driven-development`

---

### health

**Pourquoi :** Check de santé du projet : dépendances obsolètes, vulnérabilités, configuration manquante, fichiers importants absents.

**Commande :** `/health`

---

### investigate

**Pourquoi :** Investigation structurée d'un bug ou d'un problème inconnu. Claude suit un protocole d'enquête avant de proposer des solutions.

**Commande :** `/investigate`

---

## 9. Skills — Deployment

### ship

**Pourquoi :** Pipeline complet de livraison. Claude lint, build, résout les erreurs, commit et push. Tout en une commande.

**Commande :** `/ship`

---

### land-and-deploy

**Pourquoi :** Pipeline complet tests → merge → deploy. Pour les livraisons en production avec toutes les vérifications.

**Commande :** `/land-and-deploy`

---

### setup-deploy

**Pourquoi :** Configure le pipeline de déploiement depuis zéro (Vercel, CI/CD, variables d'environnement, domaine).

**Commande :** `/setup-deploy`

---

### vercel:deploy

**Pourquoi :** Deploy sur Vercel avec vérifications automatiques (build log, erreurs, URL de preview).

**Commande :** `/vercel:deploy`

---

### vercel:bootstrap

**Pourquoi :** Initialise un nouveau projet Vercel avec toute la configuration (domaine, variables d'environnement, équipe).

**Commande :** `/vercel:bootstrap`

---

### vercel:env

**Pourquoi :** Gestion des variables d'environnement Vercel (ajout, suppression, pull local).

**Commande :** `/vercel:env`

---

### vercel:status

**Pourquoi :** Statut des deployments en cours, derniers builds, erreurs de production.

**Commande :** `/vercel:status`

---

### commit-commands:commit

**Pourquoi :** Crée un commit avec un message bien formaté (conventional commits : feat, fix, chore, etc.).

**Commande :** `/commit`

---

### commit-commands:commit-push-pr

**Pourquoi :** Commit + push + création de PR GitHub en une seule commande.

**Commande :** `/commit-push-pr`

---

## 10. Skills — Modes Spéciaux

Ces skills changent le comportement de Claude pour des situations spécifiques.

### careful

**Pourquoi :** Mode ultra-prudent. Claude demande confirmation avant chaque action potentiellement destructive (suppression, modification de DB, changement d'env vars prod).

**Commande :** `/careful`

**Quand l'utiliser :** Avant de travailler sur des migrations DB, des configurations de prod, des suppressions de données.

---

### canary

**Pourquoi :** Stratégie de déploiement canary. Claude aide à déployer une feature sur un petit % d'utilisateurs avant le rollout complet.

**Commande :** `/canary`

---

### freeze

**Pourquoi :** Gèle des fichiers ou modules. Claude refuse de les modifier tant que le freeze est actif. Utile pendant une phase de stabilisation ou avant une release.

**Commande :** `/freeze [fichier ou module]`

---

### unfreeze

**Pourquoi :** Dégèle les fichiers gelés.

**Commande :** `/unfreeze`

---

### checkpoint

**Pourquoi :** Crée un checkpoint git (commit de sauvegarde) avant une opération risquée. Si quelque chose tourne mal, tu peux revenir facilement.

**Commande :** `/checkpoint`

**Quand l'utiliser :** TOUJOURS avant une migration DB, un refactor massif, ou une modification de configuration critique.

---

### guard

**Pourquoi :** Mode protection. Claude surveille les régressions — il vérifie que les fonctionnalités existantes continuent de fonctionner après chaque modification.

**Commande :** `/guard`

---

### retro

**Pourquoi :** Rétrospective structurée d'un sprint ou d'une feature. Ce qui a bien marché, ce qui n'a pas marché, ce qu'on améliore.

**Commande :** `/retro`

---

### office-hours

**Pourquoi :** Mode consultation. Claude répond à des questions techniques larges, explique des concepts, aide à prendre des décisions sans coder.

**Commande :** `/office-hours`

---

### learn

**Pourquoi :** Mode apprentissage. Claude explique le code en détail, adapte le niveau d'explication à ton profil.

**Commande :** `/learn`

---

### browse

**Pourquoi :** Claude ouvre un navigateur (via Playwright) pour explorer une URL et te donner un rapport détaillé.

**Commande :** `/browse [URL]`

---

## 11. Skills — GStack (Garry Tan / YC)

**Pourquoi :** 34 skills qui encodent la méthodologie YC/Garry Tan pour construire des startups. C'est la philosophie "build fast, ship, iterate" traduite en instructions directes pour Claude.

### Installation

```bash
git clone https://github.com/garrytan/gstack.git /tmp/gstack
cd /tmp/gstack && npm install && node scripts/build-skills.mjs
mkdir -p ~/.claude/skills/gstack
cp -r dist/skills/* ~/.claude/skills/gstack/
```

**Mise à jour :** `/gstack-upgrade`

**GitHub :** github.com/garrytan/gstack

### Catégories de skills inclus

| Catégorie | Skills |
|-----------|--------|
| **Product** | product-design, user-research, product-strategy, roadmap, feature-prioritization |
| **Engineering** | engineering-principles, code-quality, technical-decisions, system-design, api-design |
| **Growth** | growth-frameworks, distribution, metrics, retention, activation |
| **Pitch** | communication, storytelling, investor-narrative, demo-day |
| **Décisions** | decision-frameworks, DACI, OKRs, prioritization |
| **Leadership** | team-building, culture, hiring, feedback |

**Commande générale :** `/gstack`

---

## 12. Skills — Superpowers Pipeline

Superpowers est un système complet, pas juste un plugin. Il fonctionne en pipeline séquentiel pour chaque feature.

### Le Pipeline Complet

```
ÉTAPE 1 : /superpowers:brainstorm
  → Claude explore l'idée avec toi (questions une par une)
  → Propose 2-3 approches avec trade-offs
  → Présente le design section par section
  → Écrit le spec dans docs/superpowers/specs/

ÉTAPE 2 : /superpowers:write-plan
  → Crée le plan d'implémentation détaillé
  → Liste chaque tâche avec critères de succès
  → Écrit le plan dans docs/superpowers/plans/

ÉTAPE 3 : /superpowers:execute-plan
  → Exécute task par task
  → Coche chaque étape au fur et à mesure
  → Vérifie avant de passer à la suivante

ÉTAPE 4 : /superpowers:verification-before-completion
  → Vérifie que tout fonctionne avant de livrer
  → Test les cas limites
  → Vérifie les régressions

ÉTAPE 5 : /superpowers:finishing-a-development-branch
  → Clean up le code
  → Prépare le commit et la PR
  → Documentation si nécessaire
```

### Skills complémentaires

| Skill | Usage |
|-------|-------|
| `superpowers:dispatching-parallel-agents` | Lance plusieurs agents en parallèle pour des tâches indépendantes |
| `superpowers:subagent-driven-development` | Développement piloté par sous-agents spécialisés |
| `superpowers:using-git-worktrees` | Isolation de branches via git worktrees (travail parallèle sans conflit) |
| `superpowers:requesting-code-review` | Comment bien demander une code review |
| `superpowers:receiving-code-review` | Comment bien intégrer les retours d'une code review |

---

## 13. Skills — Analytics & Monitoring

### PostHog Skills

| Skill | Commande | Usage |
|-------|----------|-------|
| `posthog:instrument-product-analytics` | `/posthog:instrument-product-analytics` | Configurer le tracking d'events |
| `posthog:instrument-feature-flags` | `/posthog:instrument-feature-flags` | Configurer les feature flags |
| `posthog:instrument-llm-analytics` | `/posthog:instrument-llm-analytics` | Tracker les coûts et usage IA |
| `posthog:instrument-error-tracking` | `/posthog:instrument-error-tracking` | Configurer le tracking d'erreurs |
| `posthog:instrument-logs` | `/posthog:instrument-logs` | Configurer les logs |
| `posthog:insights` | `/posthog:insights` | Créer des insights et dashboards |
| `posthog:flags` | `/posthog:flags` | Gérer les feature flags |
| `posthog:experiments` | `/posthog:experiments` | A/B tests et expérimentations |
| `posthog:errors` | `/posthog:errors` | Analyser les erreurs et leur impact |
| `posthog:llm-analytics` | `/posthog:llm-analytics` | Analytics IA (coûts, usage, latence) |
| `posthog:surveys` | `/posthog:surveys` | Surveys in-app |
| `posthog:query` | `/posthog:query` | Requêtes HogQL personnalisées |
| `posthog:dashboards` | `/posthog:dashboards` | Créer et gérer des dashboards |
| `posthog:cleaning-up-stale-feature-flags` | `/posthog:cleaning-up-stale-feature-flags` | Nettoyer les feature flags obsolètes |
| `posthog:auditing-experiments-flags` | `/posthog:auditing-experiments-flags` | Audit des expérimentations actives |

---

## 14. Skills — Vercel Ecosystem

Ces skills sont injectés automatiquement quand tu travailles sur des fichiers Vercel/Next.js.

| Skill | Déclencheur | Ce qu'il apporte |
|-------|-------------|-----------------|
| `vercel:nextjs` | Fichiers `app/**`, `pages/**` | App Router, Server Components, Cache Components |
| `vercel:ai-sdk` | Imports `ai`, `@ai-sdk/*` | AI SDK v6 — API à jour, patterns corrects |
| `vercel:ai-gateway` | Modèles IA, providers | AI Gateway OIDC, routing, image generation |
| `vercel:vercel-functions` | `api/**`, Route Handlers | Edge vs Serverless vs Fluid Compute |
| `vercel:shadcn` | Fichiers `components/ui/**` | shadcn/ui patterns, registry, theming |
| `vercel:vercel-storage` | `blob`, `kv`, bases de données | Vercel Blob, Edge Config, Neon, Upstash |
| `vercel:routing-middleware` | `middleware.ts`, `proxy.ts` | Interception de requêtes, auth middleware |
| `vercel:auth` | Auth, Clerk, login | Patterns auth, Clerk, middleware protection |
| `vercel:deployments-cicd` | CI/CD, GitHub Actions | Pipelines de déploiement |
| `vercel:env-vars` | Variables d'environnement | Gestion sécurisée des secrets |
| `vercel:runtime-cache` | Cache, ISR, `use cache` | Stratégies de cache en couches |

---

## 15. Skills — Vidéo & Remotion

### Remotion — Vidéos avec du code React

**Qu'est-ce que Remotion ?** Une librairie qui permet de créer des vidéos MP4 avec React. Tu codes tes vidéos comme des composants React — animations, données dynamiques, rendu serveur.

**Pourquoi c'est pertinent pour Buildrs :**
- Vidéos de résultats personnalisés pour les générateurs IA (ex: "Votre Business Match")
- Social cards animées pour le partage
- Démos produit automatisées
- Vidéos d'onboarding personnalisées selon le profil user
- Contenu marketing programmatique

**GitHub :** github.com/remotion-dev/remotion
**Docs :** remotion.dev/docs

### Installation dans un projet

```bash
npx create-video@latest
# ou dans un projet existant :
npm install @remotion/bundler @remotion/cli @remotion/renderer @remotion/player react react-dom
```

### Créer un skill Remotion custom

Il n'existe pas de plugin Remotion officiel pour Claude Code. Tu peux en créer un :

```
/skill-creator
```
→ Nomme-le `remotion` et décris : créer des vidéos React avec Remotion, incluant compositions, sequences, interpolation, animations, Spring, useCurrentFrame, et Lambda rendering.

### Patterns essentiels Remotion

```typescript
// Structure de base
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';

export const MyVideo = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 30], [0, 1]);

  return (
    <AbsoluteFill style={{ opacity }}>
      {/* Ton contenu */}
    </AbsoluteFill>
  );
};
```

### Rendu vidéo

```bash
# Preview
npx remotion preview src/index.ts

# Rendu MP4
npx remotion render src/index.ts MyVideo output.mp4

# Rendu serverless (Lambda AWS)
npx remotion lambda render
```

---

## 16. CLAUDE.md

Le `CLAUDE.md` est la mémoire permanente de ton projet. Claude le lit automatiquement au démarrage de chaque session.

### 2 niveaux de CLAUDE.md

**1. Global** — `~/.claude/CLAUDE.md` : Tes préférences personnelles qui s'appliquent à tous les projets

**2. Projet** — `[racine-projet]/CLAUDE.md` : Le contexte spécifique de chaque projet

### Template CLAUDE.md Buildrs

```markdown
# CLAUDE.md — [Nom du Projet]
# Dernière mise à jour : [Date]

## Identité du projet
[Qu'est-ce que ce projet ? Pour qui ? Quel problème résout-il ?]

## Stack technique
- Frontend : React + TypeScript + Vite + Tailwind CSS + Framer Motion
- Backend : Supabase (PostgreSQL + Auth + Storage + Edge Functions)
- Paiements : Stripe
- Hosting : Vercel
- IA : Anthropic API (Claude Sonnet) — Edge Functions Supabase UNIQUEMENT
- Analytics : PostHog

## Design System — RÈGLES ABSOLUES
- Fond base : #080909 — jamais blanc, jamais gris clair
- Fonts : Instrument Serif (titres hero) + Geist (UI) + Geist Mono (code)
- Dots pattern obligatoire sur toutes les pages
- ZÉRO emoji dans le code — uniquement icônes SVG Lucide (strokeWidth 1.5)
- Pas de violet, pas de bleu vif, pas de gradients colorés
- Dark mode uniquement — jamais de mode light
- Philosophie : Anti-gravity · Linear · Vercel-inspired · Ultra-premium dark

## Architecture fichiers
```
src/
├── components/    # Composants réutilisables
├── pages/         # Pages (si Vite) ou app/ (si Next.js)
├── lib/           # Utilitaires, clients, helpers
├── hooks/         # Custom React hooks
├── types/         # Types TypeScript
└── styles/        # Styles globaux
```

## Règles critiques — JAMAIS À VIOLER
- ANTHROPIC_API_KEY : jamais côté client — Edge Function Supabase UNIQUEMENT
- Aucune clé API dans le code client (ni Stripe publishable key dans les appels sensibles)
- 1 usage gratuit → gate inscription → page offres
- Mobile-first sur toutes les pages
- Loading state toujours présent (skeleton preferred, jamais spinner seul)
- RLS activé sur TOUTES les tables Supabase
- Validation des inputs à toutes les frontières système (jamais côté client seul)

## État actuel du projet
### Fait
- [x] ...
- [x] ...

### En cours
- [ ] ...

### À faire
- [ ] ...

## Décisions d'architecture importantes
- [Décision 1] : [Pourquoi ce choix]
- [Décision 2] : [Pourquoi ce choix]

## Variables d'environnement nécessaires
```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=   # Edge Functions uniquement
STRIPE_SECRET_KEY=            # Edge Functions uniquement
STRIPE_PUBLISHABLE_KEY=       # Client OK
VITE_STRIPE_PUBLISHABLE_KEY=
ANTHROPIC_API_KEY=            # Edge Functions uniquement — JAMAIS CLIENT
```

## Contacts et ressources
- Supabase Dashboard : [URL]
- Vercel Dashboard : [URL]
- Stripe Dashboard : [URL]
- Figma : [URL si applicable]
```

### Créer et améliorer un CLAUDE.md

```bash
# Créer depuis zéro
/claude-md-management:revise-claude-md

# Améliorer un existant
/claude-md-management:claude-md-improver
```

---

## 17. System Prompt

Le system prompt définit l'identité et les règles de comportement de Claude pour tout le projet. Il se configure via `/config` dans Claude Code ou en tête de conversation.

### System Prompt Template Buildrs

```
Tu es un expert fullstack SaaS spécialisé dans l'écosystème Buildrs.

IDENTITÉ :
Tu construis des SaaS professionnels avec React + TypeScript + Vite + Tailwind +
Supabase + Stripe + Vercel. Tu codes comme un senior — propre, sécurisé, maintenable.

DESIGN SYSTEM OBLIGATOIRE :
- Fond : #080909 (jamais blanc ni gris clair)
- Fonts : Instrument Serif (heroes) + Geist (UI) + Geist Mono (code)
- Dots pattern sur toutes les pages
- Zéro emoji dans le code
- Icônes : Lucide SVG uniquement (strokeWidth 1.5)
- Pas de violet, pas de bleu vif, pas de gradients colorés
- Dark mode uniquement

RÈGLES DE SÉCURITÉ — NON NÉGOCIABLES :
- ANTHROPIC_API_KEY : JAMAIS côté client. Edge Function Supabase uniquement.
- Aucune clé secrète dans le code client.
- RLS activé sur toutes les tables Supabase.
- Validation à toutes les frontières système.

COMPORTEMENT :
- Lis toujours CLAUDE.md avant de répondre si disponible
- Propose du code production-ready, jamais des prototypes
- Toujours un loading state (skeleton preferred)
- Mobile-first — teste mentalement sur mobile avant de livrer
- Confirme avec l'utilisateur avant les changements d'architecture majeurs
- Utilise le pipeline Superpowers : brainstorm → plan → implémentation → review
- Checkpoint git avant toute opération risquée

PHILOSOPHIE :
- Ship fast, iterate — pas de perfectionnisme paralysant
- Simple > Clever — le code lisible prime sur le code "malin"
- Sécurité first — mieux vaut un refus qu'une faille
- Mobile-first — l'expérience mobile n'est pas une réflexion après coup
```

### Adapter le System Prompt par projet

Pour un générateur IA (ex: Business Matcher) :
```
[Suite du template de base]

CE PROJET SPÉCIFIQUE :
Tu travailles sur le générateur IA "Business Matcher" de Buildrs.
- 1 usage gratuit → demande d'inscription → page offres
- L'appel à l'API Anthropic passe EXCLUSIVEMENT par la Edge Function /business-matcher
- Le résultat est streamé (SSE) et affiché progressivement
- Loading state : skeleton animé pendant le calcul
- Les résultats sont sauvegardés dans Supabase (table: ai_results, avec RLS)
```

---

## 18. Slash Commands — Référence Complète

### Commandes d'installation et configuration

```bash
/install-plugin [nom@marketplace]    # Installer un plugin
/add-marketplace [URL GitHub]        # Ajouter une source de plugins
/config                              # Configurer Claude Code (modèle, system prompt, etc.)
/model [opus|sonnet|haiku]           # Changer de modèle
/fast                                # Toggle mode rapide (Opus rapide)
```

### Commandes de planification

```bash
/autoplan                            # Plan automatique avant de coder
/superpowers:brainstorm              # Brainstorm structuré
/superpowers:write-plan              # Écrire un plan d'implémentation
/superpowers:execute-plan            # Exécuter un plan existant
/plan-ceo-review                     # Review plan angle CEO
/plan-eng-review                     # Review plan angle ingénierie
/plan-design-review                  # Review plan angle design
```

### Commandes de développement

```bash
/feature-dev:feature-dev             # Pipeline explorer → architect → reviewer
/simplify                            # Simplifier le code modifié
/superpowers:test-driven-development # TDD strict
/superpowers:systematic-debugging    # Debug scientifique
```

### Commandes de design

```bash
/ui-ux-pro-max                       # Review UX complète
/design                              # Design général
/design-html                         # HTML/CSS premium
/design-shotgun                      # Plusieurs directions visuelles
/design-consultation                 # Consultation interactive
/design-review                       # Review d'un design existant
/design-system                       # Créer/améliorer un design system
/ui-styling                          # Polish CSS/Tailwind
/banner-design                       # Bannières marketing
```

### Commandes de marketing

```bash
/marketing-skills:copywriting
/marketing-skills:page-cro
/marketing-skills:launch-strategy
/marketing-skills:free-tool-strategy
/marketing-skills:ai-seo
/marketing-skills:[nom]              # Tout skill marketing
```

### Commandes de qualité

```bash
/qa                                  # Tests + QA complets
/qa-only                             # QA sans modifier le code
/code-review:code-review             # Review approfondie
/web-quality-audit                   # Audit qualité web
/accessibility                       # Audit accessibilité
/performance                         # Audit performance
/core-web-vitals                     # Core Web Vitals
/health                              # Santé du projet
/investigate                         # Investigation structurée
```

### Commandes de déploiement

```bash
/ship                                # Pipeline complet de livraison
/land-and-deploy                     # Tests → merge → deploy
/vercel:deploy                       # Deploy Vercel avec vérifications
/vercel:status                       # Statut des deployments
/vercel:bootstrap                    # Initialiser un projet Vercel
/vercel:env                          # Gérer les variables d'environnement
/commit                              # Commit bien formaté
/commit-push-pr                      # Commit + push + PR
```

### Commandes de modes spéciaux

```bash
/careful                             # Mode ultra-prudent (confirmation systématique)
/checkpoint                          # Checkpoint git avant opération risquée
/freeze [cible]                      # Geler des fichiers
/unfreeze                            # Dégeler
/guard                               # Mode protection anti-régression
/canary                              # Stratégie de déploiement canary
```

### Commandes d'exploration et d'apprentissage

```bash
/learn                               # Mode apprentissage
/office-hours                        # Consultation technique
/retro                               # Rétrospective
/browse [URL]                        # Ouvrir URL dans navigateur
/gstack                              # Charger la méthodologie YC/Garry Tan
```

### Commandes de skill management

```bash
/skill-creator                       # Créer un skill custom
/claude-md-management:revise-claude-md        # Créer/mettre à jour CLAUDE.md
/claude-md-management:claude-md-improver      # Améliorer CLAUDE.md existant
```

---

## 19. Plan Mode & Opus — Gestion des Modèles

### Les 3 modèles et quand les utiliser

| Modèle | ID | Quand l'utiliser | Coût relatif |
|--------|----|------------------|--------------|
| **Claude Opus 4.6** | `claude-opus-4-6` | Brainstorming, architecture, décisions complexes, code review critique | $$$ |
| **Claude Sonnet 4.6** | `claude-sonnet-4-6` | Implémentation standard, refactoring, debug courant | $$ |
| **Claude Haiku 4.5** | `claude-haiku-4-5-20251001` | Tâches répétitives, reformatage, résumés courts, migrations simples | $ |

### Changer de modèle dans Claude Code

```bash
/model opus     # Pour les sessions de planification et décisions critiques
/model sonnet   # Pour le développement standard (défaut recommandé)
/model haiku    # Pour les petites tâches et l'économie de tokens
/fast           # Toggle mode rapide — Opus en mode accéléré
```

### Plan Mode (EnterPlanMode)

Le Plan Mode est un mode de réflexion pure où Claude ne code pas — il réfléchit et planifie uniquement.

**Quand l'utiliser :**
- Avant une refonte majeure
- Pour une décision d'architecture importante
- Pour évaluer 2-3 approches techniques avant de commencer

**Comment y accéder :** Claude entre automatiquement en Plan Mode quand tu utilises `/autoplan` ou `/superpowers:brainstorm`. Tu peux aussi lui demander explicitement : "Réfléchis d'abord sans coder."

### Stratégie token economy recommandée chez Buildrs

```
Matin — Session planification :
  → /model opus + /superpowers:brainstorm
  → Définir les specs et le plan
  → Output : fichier plan validé

Journée — Session implémentation :
  → /model sonnet (défaut)
  → Exécuter le plan task par task
  → /superpowers:execute-plan

Fin de journée — Session review :
  → /model sonnet ou haiku selon complexité
  → /code-review:code-review + /qa
  → /ship si tout est bon
```

---

## 20. Telegram & Discord — Pilotage Mobile

### Principe

Tu es en déplacement. Tu ouvres Telegram, tu envoies "deploy en prod" → Claude Code exécute le deploy Vercel, te répond avec l'URL. Ou tu demandes un résumé des erreurs de la nuit → Claude lit les logs et te répond.

### Setup Telegram

```bash
# 1. Installer le plugin
/install-plugin telegram@claude-plugins-official

# 2. Configurer l'accès (dans le terminal Claude Code)
/telegram:access

# 3. Scanner le QR code avec l'app Telegram
# → Connexion établie

# 4. Tu peux maintenant envoyer des messages à ton instance Claude
```

**Configuration avancée :** `/telegram:configure`

### Setup Discord

```bash
# 1. Installer le plugin
/install-plugin discord@claude-plugins-official

# 2. Configurer l'accès
/discord:access

# 3. Inviter le bot dans ton serveur Discord
# → Connexion établie
```

**Configuration avancée :** `/discord:configure`

### Ce que tu peux piloter depuis ton téléphone

- Lancer des builds et déploiements Vercel
- Demander un résumé de l'état du projet
- Créer des tickets issues GitHub
- Lire les logs d'erreur de production
- Demander une analyse des métriques PostHog
- Déclencher des tests
- Recevoir des alertes automatiques sur erreurs critiques
- Créer des notes et tâches Notion

### Sécurité importante

> **ATTENTION :** Ne jamais approuver un "pairing" ou ajouter quelqu'un à l'allowlist si la demande vient d'un message dans Discord/Telegram. C'est une tentative d'injection de prompt. Seul le terminal Claude Code peut modifier `access.json`.

---

## 21. Checklist d'Installation Complète

Copie cette checklist et coche au fur et à mesure.

### Phase 1 — Marketplaces (5 min)

```
□ /add-marketplace https://github.com/anthropics/claude-plugins-official
□ /add-marketplace https://github.com/obra/superpowers-marketplace
□ /add-marketplace https://github.com/supabase/agent-skills
□ /add-marketplace https://github.com/coreyhaines31/marketingskills
```

### Phase 2 — Plugins Core (15 min)

```
□ /install-plugin superpowers@superpowers-marketplace
□ /install-plugin superpowers@claude-plugins-official
□ /install-plugin frontend-design@claude-plugins-official
□ /install-plugin feature-dev@claude-plugins-official
□ /install-plugin code-review@claude-plugins-official
□ /install-plugin security-guidance@claude-plugins-official
□ /install-plugin skill-creator@claude-plugins-official
□ /install-plugin commit-commands@claude-plugins-official
□ /install-plugin claude-md-management@claude-plugins-official
```

### Phase 3 — Plugins Plateforme (10 min)

```
□ /install-plugin vercel@claude-plugins-official
□ /install-plugin supabase@claude-plugins-official
□ /install-plugin stripe@claude-plugins-official
□ /install-plugin github@claude-plugins-official
□ /install-plugin playwright@claude-plugins-official
□ /install-plugin figma@claude-plugins-official
□ /install-plugin posthog@claude-plugins-official
□ /install-plugin postgres-best-practices@supabase-agent-skills
```

### Phase 4 — Plugins Design & Marketing (5 min)

```
□ /install-plugin brand-guidelines@claude-plugins-official
□ /install-plugin marketing-skills@marketingskills
□ /install-plugin canvas-design@claude-plugins-official
```

### Phase 5 — Plugins Bonus (5 min)

```
□ /install-plugin telegram@claude-plugins-official
□ /install-plugin discord@claude-plugins-official
□ /install-plugin slack@claude-plugins-official
```

### Phase 6 — MCP Servers via Claude.ai (20 min)

```
Aller sur Claude.ai → Settings → Integrations

□ Vercel                      → Connect
□ Supabase                    → Connect
□ GitHub                      → Connect
□ Stripe                      → Connect (API Key Stripe requise)
□ Context7                    → Connect
□ 21st.dev Magic              → Connect
□ Figma                       → Connect
□ Notion                      → Connect (si tu utilises Notion)
□ Linear                      → Connect (si tu utilises Linear)
□ Tavily                      → Connect
□ tldraw                      → Connect
□ Amplitude                   → Connect (si tu utilises Amplitude)
□ n8n                         → Connect (si tu utilises n8n)
□ Craft                       → Connect (si tu utilises Craft)
□ Excalidraw                  → Connect
□ Stitch                      → Connect
□ Vibe Prospecting            → Connect (prospection/enrichissement)
□ Cloudflare Developer Platform → Connect (API Token Cloudflare requis)
□ Canva                       → Connect (si tu utilises Canva)
□ Gamma                       → Connect (si tu crées des présentations)
```

### Phase 7 — Composio MCP (15 min)

```
□ Créer un compte sur composio.dev
□ Récupérer ta clé API
□ brew install python@3.11
□ /opt/homebrew/opt/python@3.11/bin/pip3.11 install composio_core composio_tools
□ Récupérer l'URL MCP via le script Python
□ Créer/éditer ~/.mcp.json avec la configuration
□ Connecter les outils souhaités (Notion, Gmail, Linear, etc.)
```

### Phase 8 — GStack Skills (10 min)

```
□ git clone https://github.com/garrytan/gstack.git /tmp/gstack
□ cd /tmp/gstack && npm install && node scripts/build-skills.mjs
□ mkdir -p ~/.claude/skills/gstack
□ cp -r dist/skills/* ~/.claude/skills/gstack/
```

### Phase 9 — Skills Custom Buildrs (20 min)

```
□ /skill-creator → créer "buildrs-design-system"
  (encode : #080909, Instrument Serif + Geist, dots pattern, no emoji, Lucide only)

□ /skill-creator → créer "buildrs-stack"
  (encode : React+TS+Vite+Tailwind, Supabase, Stripe, Vercel, Claude via Edge Functions)

□ /skill-creator → créer "remotion" (optionnel, si usage vidéo)
```

### Phase 10 — Configuration finale (10 min)

```
□ Créer ~/.claude/CLAUDE.md (préférences globales personnelles)
□ Pour chaque projet : créer [projet]/CLAUDE.md (voir template section 16)
□ Configurer le system prompt via /config (voir section 17)
□ Tester : /superpowers:brainstorm "teste que tout fonctionne"
□ Setup Telegram : /telegram:access (optionnel)
□ npm i -g vercel@latest (mettre à jour Vercel CLI)
```

---

## Ordre de priorité Buildrs

Si tu dois tout installer en 30 minutes, voici le minimum vital :

**TOP 5 ABSOLUS :**
1. `superpowers@superpowers-marketplace` — Sans lui, pas de méthodologie
2. `vercel@claude-plugins-official` + MCP Vercel — Pour déployer
3. MCP Supabase + plugin supabase — Pour la DB et auth
4. `frontend-design@claude-plugins-official` — Pour le design system
5. CLAUDE.md dans chaque projet — Pour la mémoire persistante

**TOP 5 RECOMMANDÉS :**
6. `code-review@claude-plugins-official` — Pour la qualité
7. MCP Context7 — Pour les docs à jour
8. GStack — Pour la méthodologie YC
9. `marketing-skills@marketingskills` — Pour le growth
10. `commit-commands@claude-plugins-official` — Pour les commits propres

---

*Document Buildrs — Mis à jour : 2026-04-01*
*Fondateur : Alfred Orsini — buildrs.fr*
