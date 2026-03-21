# Onboarding + Dashboard — Design Spec

> **Date :** 2026-03-21
> **Statut :** Approuvé
> **Sprint :** Sub-project 3/5

---

## Objectif

Implémenter le pré-onboarding (7 questions → écran de bienvenue) et refondre le dashboard en LIGHT,
avec persistance Supabase pour les données de profil utilisateur.

---

## Périmètre

**In scope :**
- Route `/onboarding` avec layout minimal (7 questions + écran de bienvenue)
- Table Supabase `profiles` avec `onboarding_data` + `onboarding_completed`
- Guard dans `AppLayout` : redirect vers `/onboarding` si profil non complété
- Dashboard refondu en LIGHT (même DA que les pages publiques)
- Mise à jour de `AppLayout`, `AppSidebar`, `AppHeader` en thème LIGHT
- Accueil personnalisé sur le dashboard ("Bonjour, [Prénom]")

**Out of scope :**
- Night mode (sprint ultérieur)
- Table `projects` réelle (demo data conservée pour ce sprint)
- Appel Claude pour le message de bienvenue (logique client uniquement)

---

## Base de données

### Table `profiles`

```sql
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  onboarding_completed boolean not null default false,
  onboarding_data jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

### Trigger auto-création

Trigger Postgres qui crée automatiquement une ligne dans `profiles`
à chaque nouveau `auth.users` INSERT.

### RLS

- `select` : `auth.uid() = id`
- `update` : `auth.uid() = id`

---

## Onboarding Flow

### Route
`/onboarding` — layout minimal, pas de sidebar, pas de header app.

### Layout
- Fond `#F8F9FC`
- Logo "Buildrs" en haut à gauche (lien vers `/`)
- Barre de progression en haut : 7 segments pill, remplis progressivement (`#3279F9`)
- Contenu centré : max-width 560px

### Navigation
- "Suivant →" : bouton primary pill, désactivé tant qu'aucune option sélectionnée
- "← Retour" : lien texte pour revenir à la question précédente (step > 0)

### Questions (steps 0→6)

| Step | Clé | Question |
|------|-----|----------|
| 0 | `profil` | "Comment tu te définirais ?" — 5 options (dont Autre + champ libre) |
| 1 | `objectif` | "Qu'est-ce que tu veux accomplir avec le Lab ?" — 4 options |
| 2 | `niveau` | "Quel est ton rapport avec le code ?" — 4 options |
| 3 | `budget` | "Quel budget mensuel tu peux consacrer aux outils ?" — 4 options |
| 4 | `idee` | "Tu as déjà une idée de produit ?" — 3 options |
| 5 | `revenu` | "Combien tu voudrais générer par mois ?" — 4 options |
| 6 | `temps` | "Combien d'heures par semaine tu peux consacrer au Lab ?" — 4 options |

### Composant RadioCard
Carte cliquable : fond `#FFFFFF`, border `#E6EAF0`, radius 12px.
État sélectionné : border `#3279F9`, ring `#3279F9/20`.
Transition 150ms.

### Step 7 — Écran de bienvenue
Même route, step interne 7.
Message personnalisé généré côté client à partir des réponses :
- Résumé du profil (1 ligne)
- Objectif de revenu
- Estimation de délai basée sur `temps`
- CTA "Commencer l'aventure →"

Sur clic CTA :
1. `upsert` dans `profiles` : `onboarding_data` + `onboarding_completed = true`
2. `navigate('/dashboard')`

---

## AppLayout — Guard d'onboarding

Après vérification que l'user est connecté :
1. Fetch `profiles` pour `user.id`
2. Si `onboarding_completed === false` → `navigate('/onboarding', { replace: true })`
3. Si profil non trouvé (edge case) → idem
4. Exception : ne pas déclencher ce check si on est déjà sur `/onboarding`

Hook `useProfile` : gère le fetch du profil + état `loading`.

---

## Dashboard — Refonte LIGHT

### Couleurs
| Élément | Valeur |
|---------|--------|
| Fond page | `#F8F9FC` |
| Cards | `#FFFFFF`, border `#E6EAF0` |
| Texte principal | `#121317` |
| Texte secondaire | `#45474D` |
| Texte muted | `#B2BBC5` |

### AppLayout LIGHT
- Fond global : `#F8F9FC`
- Sidebar : `#FFFFFF`, border-right `#E6EAF0`
- Header : `#FFFFFF`, border-bottom `#E6EAF0`

### AppSidebar LIGHT
- Liens nav : texte `#45474D`, hover `#121317`
- Item actif : fond `#F0F1F5`, texte `#121317`
- Logo : texte `#121317`

### AppHeader LIGHT
- Fond blanc, border-bottom `#E6EAF0`
- Avatar/menu : texte `#45474D`
- Toggle night mode : icône `Moon`, stocké dans `localStorage`

### DashboardPage LIGHT
- Greeting : "Bonjour, [prénom]" (depuis `user.email` ou `profiles.onboarding_data`)
- Sous-titre : "X projet(s) en cours"
- Cards projets : variant `white` avec border `#E6EAF0`
- ProgressPhases : filled = `#3279F9`, empty = `#E6EAF0`
- ScoreBadge : adapté au fond clair

---

## Fichiers impactés

### Nouveaux
- `supabase/migrations/YYYYMMDD_create_profiles.sql`
- `src/app/(auth)/onboarding-page.tsx`
- `src/hooks/use-profile.ts`
- `src/components/onboarding/onboarding-step.tsx`
- `src/components/onboarding/welcome-screen.tsx`

### Modifiés
- `src/App.tsx` — ajout route `/onboarding`
- `src/components/layout/app-layout.tsx` — LIGHT + guard onboarding
- `src/components/layout/app-sidebar.tsx` — thème LIGHT
- `src/components/layout/app-header.tsx` — LIGHT + toggle night mode (stub)
- `src/app/(auth)/dashboard-page.tsx` — LIGHT + greeting
- `src/components/ui/progress-phases.tsx` — couleurs adaptées LIGHT
- `src/components/ui/score-badge.tsx` — adaptation fond clair

---

## Flux complet

```
Signup → /auth/callback → AppLayout
  └─ profiles.onboarding_completed === false
       └─ redirect /onboarding
            └─ 7 questions (steps 0-6)
                 └─ Écran bienvenue (step 7)
                      └─ upsert profiles (completed = true)
                           └─ navigate /dashboard ✓
```
