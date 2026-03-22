# Auth + Onboarding + Dashboard — Design Spec

**Date :** 2026-03-22
**Projet :** Buildrs Blueprint — `blueprint-app/`
**Scope :** Tout ce qui se passe après l'achat : inscription, onboarding, dashboard produit

---

## Décisions clés

| Question | Décision |
|----------|----------|
| Où ? | Même `blueprint-app/` — routes hash protégées |
| Auth flow | Post-paiement → page signup → onboarding → dashboard |
| OAuth | Google + GitHub via Supabase Auth |
| Module layout | Sommaire (liste) + lecture pleine page |
| Leçon reader | Pleine page centrée, icon-only sidebar |
| Dashboard extras | Quiz fin de module · Journal de bord · Dark mode toggle |

---

## 1. Routing (hash-based, extension de l'existant)

Nouvelles routes dans `App.tsx` :

```
#/signup          ← page création de compte post-achat
#/signin          ← page connexion
#/onboarding      ← flow 4 étapes (protégé : doit être connecté)
#/dashboard       ← hub modules (protégé)
#/dashboard/module/:id          ← sommaire leçons d'un module
#/dashboard/module/:id/lesson/:lessonId  ← lecture pleine page
#/dashboard/quiz/:moduleId      ← quiz fin de module
#/dashboard/journal             ← journal de bord
```

Routes protégées = redirect vers `#/signin` si pas de session Supabase.

---

## 2. Auth Pages

### SignupPage (`#/signup`)

**Layout :** Pleine page blanche centrée, max-w-md. Même DA que la LP (Geist 800, fond blanc, tokens HSL).

**Contenu :**
- Logo Buildrs (BuildrsIcon + "Buildrs")
- Titre : "Crée ton accès Blueprint"
- Sous-titre : "Tu as accès à vie. 2 minutes pour configurer."
- Bouton Google (Lucide icon `Chrome` ou SVG Google officiel)
- Bouton GitHub (Lucide `Github`)
- Séparateur "ou"
- Form email + password + confirm password
- CTA noir "Créer mon compte →" (rainbow glow optionnel)
- Lien "Déjà un compte ? Se connecter"

**Post-signup :** redirect `#/onboarding`

### SigninPage (`#/signin`)

Même structure, sans confirm password, CTA "Se connecter →". Lien "Pas encore de compte ? Créer mon accès"

---

## 3. Onboarding (4 écrans)

Flow linéaire non-skippable. Données sauvegardées dans Supabase table `user_profiles`.

**Écran 1 — Bienvenue**
- Titre : "Tu viens de faire le premier pas."
- Récap visuel : 6 modules, 72h timeline, prompts + outils
- CTA "Commencer →"

**Écran 2 — Ta stratégie de départ**
3 cartes cliquables (une seule sélectionnable) :
- A : "J'ai un problème à résoudre" → Je crée ma propre solution
- B : "Je veux copier un SaaS qui marche" → J'adapte au marché français
- C : "Je n'ai aucune idée" → Je veux découvrir les opportunités

**Écran 3 — Ton objectif**
3 cartes :
- MRR : Je garde et développe
- Flip : Je construis et revends (Flippa, Acquire.com)
- Client : Je construis pour les autres (2 000–10 000€/projet)

**Écran 4 — Ton niveau**
3 cartes :
- Complet débutant
- J'ai déjà touché à des outils IA
- J'ai déjà lancé un projet

→ Sauvegarde dans `user_profiles` (strategie, objectif, niveau) → redirect `#/dashboard`

**Design :** Step indicator (1-2-3-4) en haut. Card sélectionnée = fond noir + texte blanc. Transition slide entre écrans.

---

## 4. Dashboard

### Layout général

```
┌──────────────────────────────────────────────────┐
│ SIDEBAR (236px fixe)    │ HEADER (52px)           │
│                         ├─────────────────────────┤
│ Logo + dark toggle      │ CONTENT AREA (scroll)   │
│ Progress bar            │                         │
│ ─────────────────       │                         │
│ PARCOURS                │                         │
│  00 Fondations ●        │                         │
│  01 Trouver…            │                         │
│  ...                    │                         │
│ ─────────────────       │                         │
│ OUTILS                  │                         │
│  Mes idées              │                         │
│  Bibliothèque           │                         │
│  Checklist              │                         │
│  Journal de bord 🔵     │                         │
│ ─────────────────       │                         │
│ NEXT LEVEL              │                         │
└─────────────────────────┴─────────────────────────┘
```

### Sidebar — détail

- **Logo + dark toggle** : BuildrsIcon + "Buildrs" (font-weight 800) / pill toggle droite
- **Progression globale** : barre gradient bleu→violet, pourcentage
- **Section PARCOURS** : modules 00→06, icône Lucide par module (pas d'emoji), dot coloré (vert = fini, amber = en cours, gris = verrouillé)
- **Section OUTILS** :
  - Mes idées (Lucide `Lightbulb`)
  - Bibliothèque (Lucide `BookOpen`)
  - Checklist (Lucide `CheckSquare`)
  - Journal de bord (Lucide `BookMarked`) — badge bleu avec compteur d'entrées
- **Next Level** : bloc noir, teaser upsells

### Header (52px)

- Gauche : titre du module/page actif (font-weight 600)
- Droite : prénom utilisateur + avatar initiale (cercle noir)

### Page module — sommaire des leçons

Liste verticale de leçons :
- **Complétée** : fond noir + badge vert "✓ Fait" (Lucide `Check`)
- **En cours** : fond blanc + bordure + chevron droite
- **Verrouillée** : opacité 40%
- Section quiz (Lucide `HelpCircle`) avec bordure violet pointillée
- Chaque ligne : numéro (ex: 0.1), titre, durée estimée

### Page leçon — mode lecture (Option A approuvée)

**Sidebar** : icon-only (60px), dots de progression du module (couleur = état)

**Zone contenu** :
- Breadcrumb : Module XX > Leçon X.X + durée + "Leçon N sur N"
- Progress bar mince (gradient bleu→vert) sous le breadcrumb
- Titre leçon (font-size 22-24px, font-weight 800, letter-spacing -0.03em)
- Corps de texte (font-size 13-14px, line-height 1.7, color #3f3f46)
- **Bloc prompt** : fond #09090b, badge "Prompt Claude" + bouton "Copier →" bleu, contenu monospace
- **Checklist interactive** : fond #f4f4f5, cases cochables, case cochée = fond vert + strikethrough
- **Navigation** : bouton "← Précédent" (outline) + bouton "Marquer terminé & continuer →" (fond noir, plein)

### Quiz de fin de module

Route `#/dashboard/quiz/:moduleId`

- 5 questions max par module
- Format QCM (3-4 choix)
- Réponse sélectionnée → feedback immédiat (vert = correct, rouge = incorrect + explication)
- Score final + badge violet "Module XX validé" si ≥ 80%
- CTA "Passer au module suivant →"

### Journal de bord

Route `#/dashboard/journal`

- Liste chronologique d'entrées avec date
- Bouton "Nouvelle entrée +" (bleu #4d96ff)
- Chaque entrée : date, contenu texte libre, tag module (optionnel)
- Pas d'éditeur riche — textarea simple, sauvegarde automatique
- Badge compteur sur l'item sidebar (total entrées)

---

## 5. Système de couleurs dashboard

| État | Couleur | Usage |
|------|---------|-------|
| Complété | `#22c55e` | Dot sidebar, badge "Fait", case cochée |
| En cours | `#eab308` | Dot sidebar, progress |
| Progression globale | gradient `#4d96ff → #cc5de8` | Barre progression |
| Quiz | `#cc5de8` | Bordure section quiz, badge validation |
| Journal de bord | `#4d96ff` | Badge compteur, bouton "Nouvelle entrée" |
| Verrouillé | `#e4e4e7` / opacity 40% | Leçons/modules inaccessibles |

---

## 6. Supabase — schéma données

### Tables nécessaires

```sql
-- user_profiles : données onboarding
create table user_profiles (
  id uuid references auth.users primary key,
  strategie text,   -- 'problem' | 'copy' | 'discover'
  objectif  text,   -- 'mrr' | 'flip' | 'client'
  niveau    text,   -- 'beginner' | 'tools' | 'launched'
  created_at timestamptz default now()
);

-- lesson_progress : suivi par leçon
create table lesson_progress (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users,
  module_id text,
  lesson_id text,
  completed boolean default false,
  completed_at timestamptz,
  unique(user_id, module_id, lesson_id)
);

-- quiz_results : résultats quiz
create table quiz_results (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users,
  module_id text,
  score integer,
  passed boolean,
  taken_at timestamptz default now()
);

-- journal_entries : journal de bord
create table journal_entries (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users,
  content text,
  module_tag text,
  created_at timestamptz default now()
);
```

RLS activé sur toutes les tables (`user_id = auth.uid()`).

---

## 7. Hooks React

- `useAuth()` — session Supabase, user, loading, signIn, signUp, signOut
- `useOnboarding()` — charger/sauvegarder user_profiles
- `useProgress()` — charger lesson_progress par user, calculer % global
- `useJournal()` — CRUD journal_entries

---

## 8. Stack technique

- `@supabase/supabase-js` — auth + db
- Supabase OAuth providers : Google + GitHub (configurés dans Supabase Dashboard)
- Pas de nouveau router — extension du hash-router existant dans App.tsx
- Même design system (CSS HSL variables, Geist, Tailwind v3, Lucide 1.5px stroke)
- Dark mode : classe `.dark` sur `<html>` via localStorage + toggle sidebar

---

## Hors scope MVP

- Stripe webhook pour vérifier l'achat avant signup (V2)
- Magic link post-achat (V2)
- Notifications email pour progression (V2)
- Éditeur riche dans le journal (V2)
- Commentaires sur les leçons (V2)
