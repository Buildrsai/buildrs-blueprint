# Finder — Design Spec

**Date :** 2026-03-21
**Statut :** Approuvé

---

## Vision

Le Finder est l'outil gratuit de Buildrs Lab qui permet à n'importe quel entrepreneur de valider ou trouver une idée de micro-SaaS en quelques secondes, grâce à Claude + web search. C'est le top of funnel principal du produit.

**3 modes :**
- **Trouve-moi une idée** — génère 3 idées de micro-SaaS scorées à partir d'un domaine/problème
- **Valide mon idée** — analyse une idée existante et retourne un verdict structuré
- **Copie intelligemment** — prend un produit existant et génère 3 adaptations niche différenciées

---

## Architecture

### Edge Functions (Supabase)

3 fonctions indépendantes, une par mode :

| Fonction | Input | Output |
|---|---|---|
| `finder-find` | `{ input: string, user_id?: string }` | 3 `FinderResult[]` streamées |
| `finder-validate` | `{ input: string, user_id?: string }` | 1 `ValidationResult` streamée |
| `finder-copy` | `{ input: string, user_id?: string }` | 3 adaptations niche streamées |

Chaque Edge Function :
1. Valide l'input (non vide, max 500 chars)
2. Appelle l'API Anthropic (`claude-sonnet-4-20250514`) avec `web_search_20250305` activé
3. Streame la réponse JSON structurée chunk par chunk via `TransformStream`
4. Sauvegarde le résultat dans `finder_searches` (user_id null si anonyme)
5. Retourne une réponse `ReadableStream` au client

### Clé API

`ANTHROPIC_API_KEY` stockée en secret Supabase Edge Function — jamais exposée côté client.

---

## Rate Limiting Anonyme

Modèle : **1 recherche gratuite → résultats partiels → modale inscription**

- Compteur `localStorage` : `buildrs_finder_count` (nombre de recherches effectuées)
- Après la 1ère recherche complète pour les anonymes :
  - Score et verdict affichés en `blur` (filter: blur(4px))
  - Modale "Crée ton compte pour voir le score et sauvegarder" apparaît
  - Les utilisateurs connectés ont un accès illimité
- Utilisateurs connectés : pas de limite, résultats sauvegardés automatiquement

---

## Types de données

### Mode "find" — FinderResult (×3)
```ts
{
  title: string          // Nom de l'idée
  problem: string        // Problème résolu (1 phrase)
  audience: string       // Cible précise
  competition: string    // Concurrents existants
  score: number          // 0-100
  verdict: 'GO' | 'À AFFINER' | 'PIVOT'
  sources?: string[]     // URLs web search
}
```

### Mode "validate" — ValidationResult
```ts
{
  title: string
  problem: string
  audience: string
  competition: string
  score: number
  verdict: 'GO' | 'À AFFINER' | 'PIVOT'
  strengths: string[]
  weaknesses: string[]
  recommendation: string
  sources?: string[]
}
```

### Mode "copy" — CopyResult (×3)
```ts
{
  original: string       // Produit source
  niche: string          // Niche cible adaptée
  positioning: string    // Comment se différencier
  features: string[]     // Features à garder/adapter
  score: number
  verdict: 'GO' | 'À AFFINER' | 'PIVOT'
  sources?: string[]
}
```

---

## Flux Client

```
finder-page.tsx
  → handleSearch(mode, input)
  → callClaudeStream('finder-{mode}', { input, user_id })
  → parse chunks JSON au fil du stream
  → affiche les résultats progressivement (1 card à la fois)
  → si anonyme + 1ère recherche → modale inscription après affichage
  → si connecté → sauvegarde auto dans finder_searches
```

Le streaming est **progressif** : chaque `FinderResult` apparaît dès qu'elle est complète, pas d'attente que les 3 soient prêtes.

---

## Prompts (côté serveur uniquement)

Chaque Edge Function embarque son propre prompt système :

- `finder-find` : "Tu es un expert en micro-SaaS. À partir du domaine/problème fourni, génère 3 idées de micro-SaaS avec de vraies données marché (web search). Pour chaque idée, retourne un JSON structuré..."
- `finder-validate` : "Tu es un expert en validation d'idées SaaS. Analyse cette idée avec de vraies données marché (web search). Retourne un JSON structuré avec score 0-100, forces, faiblesses et verdict..."
- `finder-copy` : "Tu es un expert en stratégie produit. À partir de ce produit existant, génère 3 adaptations niche différenciées avec de vraies données marché (web search). Pour chaque adaptation, retourne un JSON structuré..."

---

## Sécurité

- `ANTHROPIC_API_KEY` : secret Supabase, jamais côté client
- CORS : autorisé uniquement depuis `https://buildrs.fr` et `http://localhost:5173`
- Input sanitization dans chaque Edge Function
- RLS sur `finder_searches` : un utilisateur ne voit que ses propres recherches

---

## Hors scope (V2)

- Rate limiting côté serveur (IP-based) — localStorage suffit pour MVP
- Cache des recherches identiques — pas nécessaire au lancement
- Google OAuth — déployé en production uniquement
