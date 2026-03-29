# Spec — Générateurs IA : NicheFinder + MarketPulse
Date : 2026-03-29
Statut : Approuvé

---

## Contexte

Les 3 générateurs (NicheFinder, MarketPulse, FlipCalc) sont actuellement 100% statiques :
- NicheFinder : banque locale de 20 idées avec shuffle aléatoire
- MarketPulse : scoring manuel via steppers +/- (aucun appel IA)
- FlipCalc : calculateur mathématique pur

**Découverte clé :** L'Edge Function `validate-idea` existe déjà et appelle Claude (Anthropic API).
Elle retourne un JSON structuré complet. Le frontend ne l'utilise pas.

**Objectif :** Brancher de la vraie IA sur NicheFinder et MarketPulse. FlipCalc reste inchangé.

---

## Architecture

### MarketPulse — frontend uniquement

L'Edge Function `supabase/functions/validate-idea/index.ts` est opérationnelle.

**Input** : tableau de 5 réponses (`answers: string[]`)
```
answers[0] : description du produit en une phrase
answers[1] : cible principale
answers[2] : modèle de monétisation
answers[3] : concurrents directs connus
answers[4] : problème principal résolu
```

**Output JSON** :
```json
{
  "score": 78,
  "criteria": {
    "marche": 16,
    "concurrence": 14,
    "faisabilite": 18,
    "monetisation": 15,
    "timing": 15
  },
  "verdict": "go_reserves",
  "strengths": ["point fort 1", "point fort 2"],
  "weaknesses": ["point faible 1", "point faible 2"],
  "recommendations": ["reco 1", "reco 2", "reco 3"],
  "summary": "2-3 phrases de synthèse."
}
```

**Quota** : 3 validations max pour plan blueprint (géré par l'Edge Function via table `idea_validations`).

---

### NicheFinder — nouvelle Edge Function + frontend

**Nouvelle Edge Function** : `supabase/functions/generate-ideas/index.ts`

Pattern identique à `validate-idea` : auth JWT Supabase, appel Anthropic API direct, retour JSON.

**Input** :
```json
{
  "secteur": "comptabilité",
  "niveau": "débutant",
  "budget": "<100€",
  "strategie": "copy",
  "contexte": "texte libre optionnel"
}
```

**Output JSON** :
```json
{
  "ideas": [
    {
      "name": "FactureAI",
      "tagline": "Crée et envoie des factures professionnelles en 30 secondes",
      "problem": "Les freelances perdent 2h/semaine sur la facturation manuelle",
      "target": "Freelances & consultants",
      "price": "19€/mois",
      "mrr_potential": "1 500–5 000€",
      "difficulty": "facile",
      "score": 82,
      "why_now": "L'IA permet de pré-remplir 90% du formulaire automatiquement"
    }
  ]
}
```

**Quota** : 5 générations max pour plan blueprint.
Stockage : table `idea_generations` (user_id, inputs, ideas JSON, created_at).

**Prompt système Claude** :
Expert micro-SaaS, génère 5 idées en JSON pur (zéro texte hors JSON).
Chaque idée scorée 0-100 selon : taille marché, concurrence, faisabilité 72h, willingness to pay, timing IA.
Idées adaptées au profil : secteur + niveau + budget + stratégie + contexte.
Toutes les idées en français, buildables avec Claude Code + stack Buildrs (Supabase, Vercel, Stripe).

---

## Interfaces

### MarketPulse — nouveau flow (3 étapes)

**Étape 1 — Formulaire** (remplace les steppers manuels) :
- Nom de l'idée — text input
- Description du produit en une phrase — textarea
- Cible principale — text input
- Modèle de monétisation — select (Abonnement mensuel / Paiement unique / Freemium)
- Concurrents connus — text input ("Je ne connais pas" acceptable)
- Problème principal résolu — textarea
- CTA : "Analyser avec l'IA →" (noir, désactivé si champs vides)

**Étape 2 — Loading** :
- Skeleton + message "Jarvis analyse ton marché..." (estimation 3-5s)

**Étape 3 — Rapport** :
- Score large (ex: `78/100`) coloré selon verdict + badge verdict (Très prometteur / Prometteur / À affiner / Risqué)
- Summary : 2-3 phrases de synthèse Claude
- 5 barres de critères : label + score /20 + barre de progression colorée
- 3 colonnes : Forces / Faiblesses / Recommandations (bullets)
- Boutons : "Recommencer" + "Sauvegarder dans Jarvis"

---

### NicheFinder — nouveau flow (3 étapes)

**Étape 1 — Formulaire enrichi** (remplace les 2 dropdowns) :
- Ton secteur / expertise — text input libre ("ex: comptabilité, RH, e-commerce")
- Niveau technique — select (Débutant / Intermédiaire / Avancé)
- Budget pour lancer — select (0€ / Moins de 100€ / 100–500€)
- Stratégie — select (Copier un SaaS existant / Résoudre un problème / Découvrir des opportunités)
- Contexte optionnel — textarea ("un problème observé, une niche...")
- CTA : "Générer 5 idées avec l'IA →" (noir)

**Étape 2 — Loading** :
- Skeleton + message "Jarvis génère tes idées..." (estimation 5-8s)

**Étape 3 — Résultats** :
- 5 cards, chacune :
  - Numéro + Nom + Score /100 + badge difficulté (Facile / Moyen / Difficile)
  - Tagline (accroche produit)
  - Cible · Prix · MRR potentiel
  - "Pourquoi maintenant" (1-2 phrases IA)
  - Bouton "Valider cette idée →" (redirige vers MarketPulse)
- Bouton "Regénérer"
- Bloc prompt Claude copiable (comme actuellement)

---

## Composants frontend partagés

Les deux générateurs utilisent les mêmes patterns :
- `SkeletonLoader` : 3 lignes animées pendant le chargement
- `QuotaErrorState` : message si quota dépassé avec lien upgrade
- `ErrorState` : message d'erreur générique avec retry

---

## Implémentation parallèle

**Agent A — MarketPulse** :
1. Refactorer `GeneratorValidate.tsx` : formulaire 5 champs → appel `validate-idea` → affichage rapport
2. Gérer les états : form / loading / result / error / quota

**Agent B — NicheFinder** :
1. Créer `supabase/functions/generate-ideas/index.ts`
2. Créer table Supabase `idea_generations` (migration SQL)
3. Refactorer `GeneratorIdeas.tsx` : formulaire enrichi → appel Edge Function → affichage 5 ideas

Les deux agents travaillent sur des fichiers distincts — aucun conflit.

---

## Décisions techniques

- Pas de streaming (réponses JSON structurées, pas de texte progressif)
- Quota géré côté Edge Function (pas côté client)
- `claude-sonnet-4-5-20250929` comme modèle (cohérent avec `validate-idea` et `jarvis-chat`)
- Tokens max : 1500 pour `generate-ideas` (5 idées détaillées), 1024 pour `validate-idea` (déjà réglé)
- Même pattern CORS que les autres Edge Functions
