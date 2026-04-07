# BUILDRS DASHBOARD V2 — Architecture

> Document de reference pour la V2 du dashboard app.buildrs.fr
> Mis a jour : 2026-04-02

---

## Vision

Transformer le dashboard post-achat Blueprint en un **systeme operationnel complet** pour les builders :
- Tracker de projet avec Kanban
- Marketplace d'idees SaaS curees
- Veille IA hebdomadaire
- Communaute builders
- Systeme XP / Niveaux
- Templates & Toolbox enrichis
- Funnel LP2 (Claude By Buildrs)

**Contrainte absolue** : zero regression sur l'existant (auth, parcours Blueprint, Jarvis, agents, Claude 360).

---

## Stack (inchange)

- **Frontend** : React 18 + TypeScript + Vite + Tailwind CSS v3
- **Backend** : Supabase (PostgreSQL + Auth + Edge Functions + Storage)
- **Paiements** : Stripe Checkout (embedded + liens directs)
- **Hosting** : Vercel
- **Build** : `cd blueprint-app && npx vite build` → `vercel --prod --yes`

---

## Tables Supabase

### Existantes (a conserver)

| Table | Usage | Modifications V2 |
|-------|-------|-----------------|
| `projects` | Projets user | + colonne `description text`, `current_phase int default 0` |
| `onboarding` | Questionnaire initial | aucune |
| `progress` | Completion lecons Blueprint | aucune |
| `user_progress` | Completion bricks contenu | aucune |
| `journal` | Entrees journal | aucune |
| `user_purchases` | Achats produits | + `stripe_payment_id text`, `funnel_source text` |
| `purchases` | Legacy migration | aucune |
| `ideas` | Idees sauvegardees | aucune |
| `checklist` | Checklist interactive | aucune |
| `content_blocs` | Contenu cours | aucune |
| `content_bricks` | Contenu cours | aucune |
| `idea_generations` | Historique generateur | aucune |
| `idea_validations` | Historique validation | aucune |

### Nouvelles V2

| Table | Priorite | Description |
|-------|----------|-------------|
| `user_profiles_buildrs` | P1 | Profil builder (level, XP, stage, goal) |
| `project_milestones` | P1 | Kanban par projet (8 milestones defaut) |
| `project_collaborators` | P2 | Collaboration (owner/co-founder/member/viewer) |
| `saas_ideas` | P1 | Marketplace 10 idees SaaS curees |
| `user_saved_ideas` | P1 | Bookmarks idees marketplace |
| `notifications` | P2 | Notifications in-app |
| `community_posts` | P2 | Feed communaute (idea/question/win/resource) |
| `community_comments` | P2 | Commentaires |
| `community_reactions` | P2 | Reactions emoji |
| `trend_reports` | P3 | Rapports veille IA |
| `user_alerts` | P3 | Alertes veille personnalisees |

---

## Hooks React

### Existants (tous conserves)
- `useAuth` — auth Supabase
- `useOnboarding` — table `onboarding`
- `useProgress` — table `progress` (lecons Blueprint)
- `useContentProgress` — table `user_progress` (bricks)
- `useJournal` — table `journal`
- `usePurchases` — table `user_purchases`
- `useAccess` — logique acces (purchases + legacy metadata)
- `useActiveProject` — table `projects`

### Nouveaux V2
| Hook | Tables | Exports |
|------|--------|---------|
| `useProfile(userId)` | `user_profiles_buildrs` | `{ profile, loading, updateProfile, addXP }` |
| `useMilestones(projectId)` | `project_milestones` | `{ milestones, loading, add, update, reorder, remove }` |
| `useMarketplaceIdeas()` | `saas_ideas`, `user_saved_ideas` | `{ ideas, loading, filters, saveIdea, unsaveIdea, savedIds }` |
| `usePackDeal(access)` | pur logique | `{ lockedSlugs, totalPrice, packPrice, discount }` |
| `useNotifications(userId)` | `notifications` | `{ notifications, unreadCount, markRead, markAllRead }` |
| `useCommunityFeed()` | `community_posts`, comments, reactions | `{ posts, loading, addPost, addComment, toggleReaction, loadMore }` |
| `useTrends()` | `trend_reports`, `user_alerts` | `{ reports, loading, saveAlert, removeAlert }` |

### Helpers data
| Fichier | Contenu |
|---------|---------|
| `src/data/levels.ts` | XP thresholds, noms niveaux, rewards par action |
| `src/data/milestones.ts` | 8 milestones par defaut pour nouveau projet |
| `src/data/next-action.ts` | Logique "prochaine action recommandee" |
| `src/data/pricing.ts` | Pack deal -15%, formatage prix |
| `src/data/templates.ts` | 30+ templates statiques (6 categories) |

---

## Nouvelles Routes (hash-based)

| Route | Page | Priorite |
|-------|------|----------|
| `#/dashboard` | HomePage (cockpit) | existant |
| `#/dashboard/kanban` | KanbanPage | P1 |
| `#/dashboard/milestone/:id` | MilestonePage (drawer) | P1 |
| `#/dashboard/collaborators` | CollaboratorsPage | P2 |
| `#/dashboard/marketplace` | MarketplaceIdeasPage | P1 |
| `#/dashboard/marketplace/:slug` | IdeaDetailPage | P1 |
| `#/dashboard/trends` | TrendsPage | P3 |
| `#/dashboard/community` | CommunityPage | P2 |
| `#/dashboard/members` | MembersPage | P2 |
| `#/dashboard/templates` | TemplatesPage | P1 |
| `#/dashboard/products` | ProductsPage | P1 |
| `#/dashboard/notifications` | NotificationsPage | P2 |
| `#/checkout/claude` | ClaudeCheckoutPage (LP2) | P1 |
| `#/merci` | ClaudeMerciPage (OTO) | P1 |
| `#/merci/offre` | ClaudeDownsellPage | P1 |

---

## Sidebar V2 — Nouvelle structure

```
[Avatar user + Badge niveau + XP bar]

ACCUEIL
  Home (cockpit)        → #/dashboard
  Jarvis IA             → #/dashboard/autopilot

MON PROJET
  Mon SaaS              → #/dashboard/project
  Kanban                → #/dashboard/kanban
  Collaborateurs        → #/dashboard/collaborators  [lock: cohorte]

APPRENDRE
  Parcours Blueprint    → #/dashboard/module/00
  Env. Claude           → #/dashboard/claude  [lock: claude-buildrs]
  Claude Cowork         → #/dashboard/claude  [lock: claude-cowork]

OUTILS
  Agents IA             → #/dashboard/agents  [lock: agents-ia]
  Marketplace SaaS      → #/dashboard/marketplace
  Veille IA             → #/dashboard/trends
  Templates             → #/dashboard/templates
  Boite a outils        → #/dashboard/tools

COMMUNAUTE
  Feed                  → #/dashboard/community
  Membres               → #/dashboard/members

ACCES BUILDRS
  WhatsApp              → lien externe
  Nos Produits          → #/dashboard/products

[CTA dynamique bas]
  2+ locked → Pack Deal -15%
  1 locked  → Agents IA
  0 locked  → Sprint/Cohorte
```

---

## Systeme XP / Niveaux

| Action | XP |
|--------|-----|
| Completion brick | +5 |
| Completion bloc | +25 |
| Milestone done | +30 |
| Post feed | +5 |
| Win share | +10 |
| Commentaire aide | +10 |
| Lancement projet | +200 |

| Niveau | XP requis |
|--------|-----------|
| Explorateur | 0 |
| Builder | 100 |
| Launcher | 500 |
| Scaler | 1000 |

---

## Funnel LP2 — Claude By Buildrs

```
/checkout/claude
  ├── Claude By Buildrs : 47EUR (main)
  ├── Order Bump 1 : Claude Cowork +37EUR
  └── Order Bump 2 : Blueprint +27EUR (si pas achete)
        ↓
/merci (post-achat)
  └── OTO : Agents IA 147EUR (au lieu de 197EUR)
        ↓ (si refuse)
/merci/offre (downsell)
  └── Blueprint 27EUR (si Blueprint pas achete)
```

Stripe webhook : `checkout.session.completed` → insert `user_purchases` avec `funnel_source='lp2'`

---

## Marketplace SaaS — 10 idees seed

1. **SEO Audit Tool** — MRR 500-2000EUR, difficulte 2/5
2. **Freelance Contract Generator** — MRR 300-1500EUR, difficulte 1/5
3. **Creator Analytics Dashboard** — MRR 1000-5000EUR, difficulte 3/5
4. **Dynamic Pricing Engine** — MRR 2000-8000EUR, difficulte 4/5
5. **Landing Page Generator** — MRR 800-3000EUR, difficulte 2/5
6. **HR Assistant Bot** — MRR 1500-6000EUR, difficulte 3/5
7. **Competitive Intelligence Tool** — MRR 2000-7000EUR, difficulte 4/5
8. **Support Chatbot Builder** — MRR 1000-4000EUR, difficulte 3/5
9. **Smart Invoicing Tool** — MRR 500-2500EUR, difficulte 2/5
10. **Creative Brief Generator** — MRR 400-1800EUR, difficulte 1/5

---

## Kanban — 8 milestones par defaut

1. Idee validee (todo)
2. Architecture definie (todo)
3. Branding & Design (todo)
4. Installation env. (todo)
5. Build MVP (todo)
6. Feature core (todo)
7. Deploiement live (todo)
8. Lancement & Monetisation (todo)

---

## Templates — 6 categories

1. **Claude Config** — CLAUDE.md templates, .mcp.json
2. **Claude Code** — Prompts de build step-by-step
3. **Prompts** — Prompts generaux (validation, analyse, debug)
4. **System Prompts** — System prompts agents IA
5. **Business** — Brief produit, cahier des charges, email pitch
6. **Landing Page** — Structure LP, copy sections

---

## Regles absolues V2

1. **Zero regression** : auth, onboarding, Jarvis, agents, Claude 360, parcours Blueprint intacts
2. **Tables existantes** : ajout colonnes OK — suppression/modification schema INTERDITE
3. **RLS** obligatoire sur toutes les nouvelles tables (`user_id = auth.uid()`)
4. **Responsive** : 375px minimum, mobile-first
5. **Design** : CSS variables HSL, Geist fonts, Lucide strokeWidth 1.5, zero emoji dans le code
6. **Build** : `npx vite build` puis `vercel --prod --yes` (jamais `npm run dev`)

---

## Plan d'execution — 17 phases

| Phase | Jour | Description |
|-------|------|-------------|
| 0 | - | Audit + architecture (ce fichier) ✓ |
| 1 | J1 | Migrations DB (11 tables + extensions) |
| 2 | J2 | Hooks V2 + helpers |
| 3 | J3 | Sidebar V2 |
| 4 | J4 | Home Cockpit upgrade |
| 5 | J5 | Onboarding upgrade (4 ecrans) |
| 6-7 | J6-7 | Kanban + collaboration |
| 7 | J8 | Marketplace SaaS |
| 8 | J9 | Veille IA |
| 9 | J10 | Communaute |
| 10 | J11 | Agents contextuels |
| 11-12 | J12 | Templates + Toolbox |
| 13 | J13 | Products page |
| 14 | J14 | XP/Niveaux + Notifications |
| 15 | J15 | Checkout LP2 funnel |
| 16 | J16 | Polish + tests + deploy |
