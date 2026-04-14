# Buildrs V2 -- Opportunity Scanner + Marketplace

**Date**: 2026-04-07
**Status**: Design validee, prete pour implementation
**Auteur**: Alfred Orsini + Claude Code

---

## Context

Les utilisateurs Buildrs (non-devs qui decouvrent Claude Code) ont l'outil de build mais pas la vision business. Ils ouvrent Claude Code et restent bloques sur "je construis quoi ?". Le Scanner + Marketplace resout ce probleme en leur livrant des opportunites de micro-SaaS validees par le marche, scorees par IA, et directement actionnables dans le dashboard.

**Valeur strategique** : Sans ce systeme, Buildrs vend un outil de build. Avec, c'est un systeme de creation de revenus. Le moat c'est la detection d'opportunites scorees + le lien direct vers le build -- personne ne le fait en francophone.

---

## Architecture

### Approche retenue : Pipeline Edge Functions orchestrees par n8n

Le Scanner est decoupe en edge functions granulaires (< 150s chacune), orchestrees par n8n via un workflow cron quotidien. Pattern identique a `process-email-queue` deja en place.

```
n8n cron (6h UTC)
  ├── POST /scanner-collect?source=product_hunt  → saas_raw_discoveries
  ├── POST /scanner-collect?source=reddit        → saas_raw_discoveries
  ├── POST /scanner-collect?source=acquire       → saas_raw_discoveries (Apify async)
  ├── Wait 60s (Apify processing)
  ├── POST /scanner-collect?source=acquire&fetch_results=true&run_id=xxx
  ├── Insert scanner_runs log
  ├── POST /scanner-score
  └── Update scanner_runs avec items_scored
```

### Sources MVP (3 sources)

| Source | Methode | API | Volume estime |
|--------|---------|-----|---------------|
| Product Hunt | GraphQL API officielle | Bearer token, 500 req/jour | ~20 items/jour |
| Reddit | OAuth2 API (snoowrap pattern) | Client ID/Secret, 60 req/min | ~50 items/jour (filtre) |
| Acquire.com | Apify Actor (scraping) | Apify token, async run | ~10-20 items/jour |

Sources futures (post-MVP) : Indie Hackers, G2/Capterra.

### Build Score Engine -- Hybride Haiku + Sonnet

- **Phase 1 (Haiku)** : Tous les items bruts sont scores par Claude Haiku (~$0.001/item). Genere les 3 scores + champs courts.
- **Phase 2 (Sonnet)** : Les items avec `build_score > 70` sont re-enrichis par Claude Sonnet (~$0.01/item). Genere des analyses profondes (why_reproducible, differentiation_angle, mvp_features).
- **Cout estime** : ~$5-10/mois en regime.

Formule composite :
```
build_score = (traction_score * 0.30) + (cloneability_score * 0.40) + (monetization_score * 0.30)
```

Cloneability ponderee a 40% car c'est le critere le plus important pour la cible Buildrs (non-devs).

---

## Schema Supabase

### Migration strategy

On remplace `saas_ideas` + `user_saved_ideas` par le nouveau systeme. Les donnees existantes dans `saas_ideas` sont migrees vers `saas_opportunities` avec `source = 'manual_curated'` et `build_score = 75`.

### Table : saas_raw_discoveries

Donnees brutes collectees par le Scanner avant enrichissement.

| Colonne | Type | Nullable | Description |
|---------|------|----------|-------------|
| id | uuid (PK, gen_random_uuid()) | Non | Identifiant unique |
| source | text | Non | product_hunt, reddit, acquire |
| source_id | text | Non | ID unique sur la source (dedup) |
| source_url | text | Non | URL originale du post/listing |
| name | text | Oui | Nom du SaaS detecte |
| description | text | Oui | Description / tagline |
| raw_data | jsonb | Non | Donnees brutes completes |
| mrr_mentioned | integer | Oui | MRR extrait si mentionne (USD) |
| upvotes | integer | Oui | Votes / score selon la source |
| reviews_count | integer | Oui | Nombre de reviews |
| category | text | Oui | Categorie / topic principal |
| website_url | text | Oui | URL du site du SaaS |
| is_processed | boolean (default false) | Non | Flag de traitement |
| discovered_at | timestamptz (now()) | Non | Date de collecte |

**Index unique** : `UNIQUE(source, source_id)`
**RLS** : Service role only (pas de lecture user)

### Table : saas_opportunities

Opportunites enrichies et scorees. Remplace `saas_ideas`.

| Colonne | Type | Nullable | Description |
|---------|------|----------|-------------|
| id | uuid (PK) | Non | Identifiant unique |
| raw_id | uuid (FK) | Oui | Reference vers saas_raw_discoveries (null pour manual_curated) |
| name | text | Non | Nom du SaaS |
| slug | text (unique) | Non | Slug URL-friendly |
| tagline | text | Non | Description courte (1 ligne) |
| problem_solved | text | Non | Probleme resolu (1-2 phrases, genere par IA) |
| source | text | Non | Source principale |
| source_url | text | Oui | URL source originale |
| website_url | text | Oui | Site du SaaS |
| category | text | Non | Categorie normalisee |
| mrr_estimated | integer | Oui | MRR estime en USD |
| mrr_confidence | integer (1-10) | Oui | Score de fiabilite du MRR |
| traction_score | integer (0-100) | Non | Score de traction marche |
| cloneability_score | integer (0-100) | Non | Score de reproductibilite |
| monetization_score | integer (0-100) | Non | Score de potentiel monetisation |
| build_score | integer (0-100) | Non | Score composite (moyenne ponderee) |
| why_reproducible | text | Oui | Explication IA (Sonnet, si score > 70) |
| recommended_stack | jsonb | Oui | Stack recommandee |
| differentiation_angle | text | Oui | Angle de differenciation |
| mvp_features | jsonb | Oui | 5 features MVP recommandees |
| pain_points | jsonb | Oui | Frustrations utilisateurs |
| niche_suggestions | jsonb | Oui | Verticalisations possibles |
| acquisition_channels | jsonb | Oui | Canaux d'acquisition |
| pricing_suggestion | text | Oui | Pricing recommande |
| status | text (default 'active') | Non | active, archived, flagged |
| scored_at | timestamptz | Oui | Date du scoring IA |
| created_at | timestamptz (now()) | Non | Date de creation |

**Index** : `build_score DESC`, `category`, `status`
**Full-text search** : GIN index sur `name || tagline || problem_solved`
**RLS** : SELECT pour authenticated users (WHERE status = 'active'), INSERT/UPDATE/DELETE service role only

### Table : scanner_runs

| Colonne | Type | Description |
|---------|------|-------------|
| id | uuid (PK) | Identifiant unique |
| trigger_type | text | cron, manual |
| sources_scanned | jsonb | Status par source |
| items_collected | integer | Total collecte |
| items_new | integer | Nouveaux (apres dedup) |
| items_scored | integer | Enrichis par Build Score |
| errors | jsonb | Erreurs rencontrees |
| duration_ms | integer | Duree totale |
| started_at | timestamptz | Debut |
| completed_at | timestamptz | Fin |

**RLS** : Service role only

### Table : user_saved_opportunities

Remplace `user_saved_ideas`. Meme pattern.

| Colonne | Type | Description |
|---------|------|-------------|
| id | uuid (PK) | Identifiant unique |
| user_id | uuid (FK auth.users) | Utilisateur |
| opportunity_id | uuid (FK saas_opportunities) | Opportunite sauvegardee |
| saved_at | timestamptz (now()) | Date de sauvegarde |

**Index unique** : `UNIQUE(user_id, opportunity_id)`
**RLS** : User CRUD own rows

---

## Edge Functions

### scanner-collect

**Path** : `supabase/functions/scanner-collect/index.ts`
**Auth** : Header `x-scanner-token` = `SCANNER_AUTH_TOKEN`
**Params** : `?source=product_hunt|reddit|acquire` + optionnel `&fetch_results=true&run_id=xxx`

Logique par source :

**Product Hunt** :
- GraphQL query : top 20 posts du jour, tries par votes
- Extraction : name, tagline, description, votesCount, reviewsCount, topics, url, website, createdAt
- source_id : PH post ID

**Reddit** :
- OAuth2 auth (script type), fetch r/SaaS + r/indiehackers + r/microsaas + r/startups + r/EntrepreneurRideAlong
- Filtre : patterns monetaires ($, MRR, ARR, revenue, /mo), min 10 upvotes, compte > 30 jours
- source_id : Reddit post ID (t3_xxx)

**Acquire** :
- Apify Actor launch (async, waitForFinish: 0)
- Return run_id pour fetch ulterieur
- Second call avec fetch_results=true : recup listings et insert
- source_id : Acquire listing ID

### scanner-score

**Path** : `supabase/functions/scanner-score/index.ts`
**Auth** : Header `x-scanner-token` = `SCANNER_AUTH_TOKEN`

Flow :
1. Fetch items `WHERE is_processed = false` depuis `saas_raw_discoveries`
2. Batch de 10, delay 500ms entre chaque call
3. **Phase Haiku** : score tous les items (prompt section 4.4 du CDC)
4. Calcul `build_score` composite
5. Insert dans `saas_opportunities`
6. **Phase Sonnet** : re-enrichit items avec `build_score > 70` (why_reproducible, differentiation_angle, mvp_features plus detailles)
7. Marque `is_processed = true`
8. Retourne stats

### scanner-status

**Path** : `supabase/functions/scanner-status/index.ts`
**Auth** : JWT user + verification `user_metadata.is_admin`

Endpoints (via query param `action`) :
- `?action=status` : derniers scanner_runs, stats globales
- `?action=run` : trigger manuel du pipeline complet (appelle scanner-collect + scanner-score en sequence)
- `?action=archive&id=xxx` : archive une opportunite
- `?action=flag&id=xxx` : flag une opportunite

---

## Marketplace UI

### Fichiers a creer/modifier

| Fichier | Action | Description |
|---------|--------|-------------|
| `src/hooks/useOpportunities.ts` | Creer | Hook pour fetch saas_opportunities + filtres + saves |
| `src/components/dashboard/MarketplacePage.tsx` | Remplacer existant | Catalogue avec cards, filtres, search, pagination |
| `src/components/dashboard/OpportunityDetailPage.tsx` | Creer | Fiche detaillee 4 sections |
| `src/components/dashboard/DashboardSection.tsx` | Modifier | Routes marketplace/idea-detail → nouveaux composants |
| `src/components/dashboard/Sidebar.tsx` | Modifier | Debloquer item "Marketplace" dans section Outils |
| `src/hooks/useMarketplaceIdeas.ts` | Supprimer | Remplace par useOpportunities |
| `src/components/dashboard/MarketplaceIdeasPage.tsx` | Supprimer | Remplace par MarketplacePage |
| `src/components/dashboard/IdeaDetailPage.tsx` | Supprimer | Remplace par OpportunityDetailPage |

### Hook useOpportunities

```typescript
interface OpportunityFilters {
  category?: string | null
  source?: string | null
  buildScoreMin?: number      // default: 0
  search?: string
  sortBy?: 'build_score' | 'created_at' | 'traction_score'
}

interface UseOpportunitiesReturn {
  opportunities: SaasOpportunity[]
  loading: boolean
  total: number
  filters: OpportunityFilters
  setFilters: (f: OpportunityFilters) => void
  loadMore: () => void
  hasMore: boolean
  savedIds: Set<string>
  saveOpportunity: (id: string) => Promise<void>
  unsaveOpportunity: (id: string) => Promise<void>
  lastUpdated: string | null  // derniere scanner_run completed_at
}
```

Pagination server-side : `.range(offset, offset + 19)` sur Supabase.
Full-text search via `.textSearch('search_vector', query)`.

### MarketplacePage layout

- Header : titre H1 + badge count + indicateur fraicheur
- Barre de filtres : search, categorie dropdown, source multi-select, score min slider, tri
- Grille responsive : 3 cols desktop, 2 tablette, 1 mobile
- Cards opportunite avec Build Score, 3 mini-barres, badge source, MRR, angle
- Pagination "Charger plus" (20/page)
- Bouton admin "Refresh Scanner" (conditionnel sur profile?.is_admin)

### OpportunityDetailPage sections

1. **Header** : nom, tagline, Build Score grand + breakdown 3 axes, liens source + site, badges
2. **Analyse** : problem_solved, why_reproducible, differentiation_angle, pain_points
3. **Blueprint** : mvp_features (liste ordonnee), recommended_stack (BrandIcons), pricing_suggestion, acquisition_channels, niche_suggestions
4. **Actions** : "Lancer ce projet" (sessionStorage + redirect claude-os), "Sauvegarder", "Partager"

### Flow "Lancer ce projet"

```typescript
// Sur click du CTA dans OpportunityDetailPage
const launchProject = () => {
  sessionStorage.setItem('marketplace_context', JSON.stringify({
    name: opportunity.name,
    problem: opportunity.problem_solved,
    stack: opportunity.recommended_stack,
    features: opportunity.mvp_features,
    niche: opportunity.niche_suggestions,
    pricing: opportunity.pricing_suggestion,
    source_slug: opportunity.slug,
  }))
  navigate('#/dashboard/claude-os/generer')
}

// Dans le Claude OS Generator, au mount :
const marketplaceContext = sessionStorage.getItem('marketplace_context')
if (marketplaceContext) {
  const ctx = JSON.parse(marketplaceContext)
  // Pre-remplir les champs du generateur
  sessionStorage.removeItem('marketplace_context')
}
```

### Design system

Respecte les conventions du dashboard existant :
- Fond : `bg-background` (dark mode first, token `#080909`)
- Cards : `border border-border rounded-xl`, hover `hover:border-foreground/20`
- Typographie : Geist (UI), Geist Mono (chiffres scores)
- Icones : Lucide React (strokeWidth 1.5), BrandIcons pour les stacks
- Pas d'emoji nulle part
- Couleurs scores : `#22c55e` (vert > 70), `#eab308` (orange 40-70), `#ef4444` (rouge < 40)
- Badges source : PH `#ff6154`, Reddit `#ff4500`, Acquire `#22c55e`

---

## Variables d'environnement (nouvelles)

| Variable | Source | Description |
|----------|--------|-------------|
| PRODUCTHUNT_TOKEN | Product Hunt | Bearer token API GraphQL |
| REDDIT_CLIENT_ID | Reddit | OAuth2 client ID |
| REDDIT_CLIENT_SECRET | Reddit | OAuth2 client secret |
| REDDIT_USERNAME | Reddit | Compte pour auth |
| REDDIT_PASSWORD | Reddit | Password pour auth |
| APIFY_TOKEN | Apify | Token API pour Acquire scraper |
| SCANNER_AUTH_TOKEN | Custom | Token pour securiser les webhooks n8n |

Variables existantes reutilisees : `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `ANTHROPIC_API_KEY`.

---

## Verification & Tests

### Test end-to-end

1. **Schema** : Appliquer les migrations, verifier les tables, tester RLS avec anon key vs service key
2. **Collecteurs** : Appeler chaque source individuellement, verifier les inserts dans saas_raw_discoveries
3. **Scoring** : Trigger le scorer, verifier les inserts dans saas_opportunities avec les 3 scores + build_score
4. **UI Catalogue** : Build + serve, naviguer vers #/dashboard/marketplace, verifier filtres/search/pagination
5. **UI Detail** : Cliquer une card, verifier les 4 sections, tester "Lancer ce projet" + redirect
6. **Admin** : Tester le bouton Refresh Scanner, verifier scanner_runs
7. **Save/Unsave** : Tester la sauvegarde d'opportunites, verifier persistence

### Criteres de succes

- Le Scanner collecte des donnees reelles depuis PH + Reddit + Acquire
- Le Build Score est pertinent (les SaaS CRUD simples scorent > 70 en cloneability)
- La Marketplace affiche les opportunites filtrees et triees
- Le flow "Lancer ce projet" → Claude OS fonctionne avec contexte pre-rempli
- Le panel admin permet de trigger/monitor le Scanner
