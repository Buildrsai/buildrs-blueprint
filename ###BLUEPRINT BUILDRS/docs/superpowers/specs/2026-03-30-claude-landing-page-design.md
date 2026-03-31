# Design Spec — Claude Buildrs Landing Page (LP2)

**Date :** 2026-03-30
**Statut :** Approuvé
**Périmètre :** LP2 `/claude` + adaptations checkout + Edge Function + analytics source

---

## Contexte

Buildrs a une LP principale (`/` → `#/landing`) qui vend le Blueprint à 27€. Ce spec couvre la création d'une **deuxième landing page indépendante** (`#/claude`) qui vend "Claude Buildrs" à 47€ avec un order bump inversé (Blueprint +27€ au lieu de Module Claude +37€).

Le funnel post-achat (UpsellCohortPage → Confirmation) est **partagé** entre les deux funnels. Seuls les montants Pixel changent.

---

## Décisions de design

| Question | Décision | Raison |
|---|---|---|
| Routing | Hash route `#/claude` | Cohérent avec l'architecture existante, zéro infra |
| Passage de source | `funnelSource` state dans App.tsx | Plus simple que query params, pas de parsing hash |
| Structure LP2 | Fichier autonome `ClaudeLandingPage.tsx` | Isolation totale, pas de couplage avec LP1 |
| Déploiement | Local uniquement pour l'instant | Validation visuelle avant mise en prod |

---

## Architecture

### 1. Routing — `App.tsx`

**Nouveau type de route :**
```ts
type ParsedRoute = ... | 'claude-landing'
```

**Parser :**
```ts
if (h === 'claude') return { type: 'claude-landing' }
```

**Render :**
```tsx
if (route.type === 'claude-landing') {
  return <ClaudeLandingPage onCTAClick={() => { setFunnelSource('claude'); navigate('#/checkout') }} />
}
```

**State ajouté :**
```ts
const [funnelSource, setFunnelSource] = useState<'blueprint' | 'claude'>('blueprint')
```
- LP1 CTA → `setFunnelSource('blueprint')` + navigate `#/checkout`
- LP2 CTA → `setFunnelSource('claude')` + navigate `#/checkout`
- `funnelSource` passé en prop à `CheckoutPage`

---

### 2. `ClaudeLandingPage.tsx`

**Fichier :** `blueprint-app/src/components/ClaudeLandingPage.tsx`
**Taille estimée :** ~1000-1200 lignes
**Import :** lazy dans App.tsx

**Sections (dans l'ordre) :**

| Section | Composant | Notes |
|---|---|---|
| Nav | Nav (pattern copié LP1) | Lien CTA "Accéder au setup → 47€" |
| Hero | Hero | Surtitre + titre + sous-titre + 3 badges + CTA + scarcity bar |
| Marquee | `<SaasMarquee />` | Réutilisé identique |
| Stats | Stats | 3 stats : +25K/mois · mis à jour continu · +80 builders |
| Pain | Pain | 4 cards 2×2 |
| Solution | Solution | 3 blocs visuels |
| BeforeAfter | BeforeAfter | 2 colonnes avant/après |
| Programme | Programme | Timeline zigzag 10 chapitres (style Sprint de LP1) |
| Dashboard | `<DashboardPreview />` | Réutilisé identique + 4 tabs |
| Exemples | Exemples | 3 cards produits (PriceFlow, Brew, StayTrack) |
| Alfred | AlfredBlock | Bloc crédibilité centré |
| Pricing | Pricing | 8 features + 4 bonus + garantie + CTA + scarcity |
| FAQ | FAQ | 9 questions accordéon |
| FinalCTA | FinalCTA | CTA final + scarcity |
| Footer | `<StackedCircularFooter />` | Newsletter texte adapté |

**Composants réutilisés :**
- `SaasMarquee`, `DashboardPreview`, `StackedCircularFooter`
- `BGPattern`, `DottedSurface`, `WordRotate` (si utilisé)
- `BuildrsIcon`, `BrandIcons` depuis `icons.tsx`

---

### 3. `CheckoutPage.tsx` — adaptations

**Nouvelle prop :**
```ts
interface CheckoutPageProps {
  ...
  funnelSource: 'blueprint' | 'claude'
}
```

**Comportement selon source :**

| | `blueprint` | `claude` |
|---|---|---|
| Titre produit | "Buildrs Blueprint" | "Claude Buildrs" |
| Prix base | 27€ | 47€ |
| Order bump label | "Module Claude +37€" | "Blueprint SaaS +27€" |
| Order bump prix | 3700 centimes | 2700 centimes |
| Total seul | 27€ | 47€ |
| Total + bump | 64€ | 74€ |

---

### 4. Edge Function `create-checkout`

**Nouveau paramètre body :**
```ts
const source: 'blueprint' | 'claude' = body.source ?? 'blueprint'
```

**Logique produit selon source :**

`source = 'claude'` :
- Produit principal : "Claude Buildrs" · 4700 centimes
- Bump : "Blueprint SaaS" · 2700 centimes (si `has_order_bump`)

`source = 'blueprint'` : comportement actuel inchangé.

**Return URL claude :**
```
/#/upsell-cohort?session_id={CHECKOUT_SESSION_ID}&source=claude[&bump=1]
```

---

### 5. `ConfirmationPage` — Pixel tracking

La `ConfirmationPage` lit le hash pour calculer la valeur Purchase :
```ts
const isClaude = window.location.hash.includes('source=claude')
const isOrderBump = window.location.hash.includes('bump=1')
const value = isClaude
  ? (isOrderBump ? 74 : 47)
  : (isOrderBump ? 64 : 27)
trackEvent('Purchase', { value, currency: 'EUR', num_items: 1 })
```

---

### 6. Analytics — `acquisition_source`

Au signup (`SignupPage.tsx`), lire `sessionStorage.getItem('funnelSource')` (App.tsx le persiste) et l'inclure dans `user_metadata` Supabase Auth :
```ts
user_metadata: { acquisition_source: funnelSource }
```
Cela permet de comparer les taux de conversion LP1 vs LP2 depuis le dashboard Supabase.

---

## Contenu LP2 — Données clés

### Hero
- Surtitre : "+25 000€/mois. Avec Claude. Voici le setup exact."
- Titre : "L'environnement Claude qui génère +25 000€/mois. Mis à jour en temps réel."
- Badges : "Débutant ou avancé en IA" · "Installé en une journée" · "Mises à jour en continu"
- CTA : "Accéder au setup — 47€ →"
- Sous-CTA : "Valeur réelle : 1 235€ · Paiement unique · Accès à vie"

### Pricing
- Prix : 97€ barré → 47€
- 8 features avec valeur fantôme (total 1 235€)
- 4 bonus "POUR LES 200 PREMIERS"
- Garantie 30 jours

### Programme — 10 chapitres
1. Claude basique vs Claude Buildrs
2. Choisir le bon modèle au bon moment
3. Les interfaces Claude
4. Paramétrer ton Claude Buildrs
5. Le CLAUDE.md
6. Les Skills
7. Les MCP
8. Les commandes Claude Code
9. Les sub-agents parallèles
10. Le Pack Buildrs

---

## Ce qui n'est PAS dans ce spec

- Déploiement production (reporté)
- OTO post-achat 37€ (reporté — Phase 2 du brief)
- Modifications du dashboard (aucune requise)
- Nouvelles tables Supabase (user_metadata suffit)
