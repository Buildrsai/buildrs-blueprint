# ══════════════════════════════════════════════════════════════
# BUILDRS LAB — ORCHESTRATION COMPLÈTE
# Fusion Doc Maître V1 + Spec V2 → Plan d'exécution
# Généré le 21 mars 2026
# ══════════════════════════════════════════════════════════════

---

# VUE D'ENSEMBLE

```
FINDER (gratuit)          LAB (payant — 297€)                           POST-LAUNCH
─────────────────    ─────────────────────────────────────────    ─────────────────
                     P1        P2       P3       P4
[Find] ──────────→  Idée  →  Struct → Brand → Kit CC
[Validate] ──────→   │                                           Dashboard projet
[Copy] ──────────→   │        P5       P6       P7      P8      avec outils
                     │      Instal → Build → Deploy → Launch
                     │                                           [+ Ajouter feature]
                     └── Chaque phase injecte ses données        [Modifier CLAUDE.md]
                         dans les suivantes (contexte cumulatif)  [Nouveau projet]
```

---

# MODULES & GÉNÉRATEURS

## Légende
- 🔘 = Bouton générateur (appel API Claude)
- 📦 = Livrable (fichier / donnée structurée)
- ✅ = Action utilisateur (valider / cocher)
- 💾 = Donnée sauvegardée en DB (injectée dans les phases suivantes)

---

## PHASE 0 — INSCRIPTION + PRÉ-ONBOARDING

### Statut : ✅ Partiellement construit
### Manque : onboarding enrichi (6-8 questions au lieu de 2)

| Sous-étape | Type | Description | Statut |
|---|---|---|---|
| 0.1 Landing Page | Page | Hero + Finder démo + 8 phases + pricing + CTA | ✅ Fait |
| 0.2 Inscription | Auth | Email/MDP ou Google OAuth via Supabase | ✅ Fait |
| 0.3 Pré-onboarding | Flow | 7 questions (profil, objectif, niveau, budget, idée, revenu, temps) | ⚠️ Partiel (2 questions) |
| 0.4 Bienvenue | Écran | Message personnalisé basé sur les réponses + estimation timeline | ❌ À faire |

💾 **Données sauvegardées** : `users.onboarding_data` (JSON)
- profil, objectif, niveau_technique, budget, a_une_idee, objectif_revenu, temps_dispo

---

## PHASE 1 — TROUVER & VALIDER L'IDÉE

### Statut : ⚠️ Validation structurée faite, sous-étapes manquantes

| Sous-étape | Type | Description | Statut |
|---|---|---|---|
| 1.1 Le Finder (intégré) | 🔘 x3 | 3 modes : Find / Validate / Copy — lié au projet | ❌ À intégrer |
| 1.2 Validation approfondie | 🔘 | Rapport structuré : scores /25 x4, concurrents, marché | ✅ Fait |
| 1.3 Synthèse & décision | 📦 + ✅ | Récap idée + score + audience + CTA valider/pivoter | ❌ À faire |

📦 **Livrables** :
- Score de viabilité /100 (décomposé 4x /25)
- Analyse concurrentielle (cards)
- Verdict GO / AFFINER / PIVOT
- Outils recommandés (Product Hunt, Reddit, Trends)

💾 **Données** : `projects.idea_data` + `project_phases.generated_content`
```json
{
  "scores": { "market_demand": {}, "competition": {}, "monetization": {}, "buildability": {} },
  "total_score": 75,
  "verdict": "go",
  "competitors": [...],
  "market": { "size": "", "growth": "", "trends": [] },
  "recommendations": { "pricing": "", "mvp_features": [], "risks": [] }
}
```

---

## PHASE 2 — STRUCTURER LE PRODUIT

### Statut : ❌ À construire entièrement

| Sous-étape | Type | Description |
|---|---|---|
| 2.1 Pages & features MVP | 🔘 | Liste des pages + rôle + features MVP + parcours utilisateur |
| 2.2 Modèle de données | 🔘 | Schéma en langage simple (PAS de SQL) — converti en Phase 5 |
| 2.3 Monétisation | 🔘 | Choix abo/one-shot/freemium + tiers + prix basés sur Phase 1 |
| 2.4 Résumé produit | 📦 + ✅ | Compilation des 3 blocs + validation |

📦 **Livrables** :
- Liste des pages avec rôle
- Features MVP (strict minimum)
- Modèle de données humain
- Stratégie de monétisation + pricing

💾 **Données** : `projects.structure_data`
```json
{
  "pages": [{ "name": "", "role": "", "priority": "mvp|v2" }],
  "features": [{ "name": "", "description": "", "priority": "mvp|v2" }],
  "data_model": [{ "entity": "", "fields": [""] }],
  "user_journey": "",
  "monetization": { "type": "subscription|one_time|freemium", "tiers": [...] }
}
```

🔗 **Contexte injecté** : Phase 1 (idée, audience, concurrents, pricing marché)

---

## PHASE 3 — BRANDING & DESIGN

### Statut : ❌ À construire entièrement

| Sous-étape | Type | Description |
|---|---|---|
| 3.1 Nom & positionnement | 🔘 | 5 noms + dispo domaine + 3 taglines + positionnement |
| 3.2 Direction artistique | 🔘 | 3 palettes + 2 paires typo + style + 3-5 références Mobbin |
| 3.3 Brand guide | 🔘 + 📦 | Compilation → document téléchargeable (Markdown) |

📦 **Livrables** :
- Nom choisi + tagline
- Palette couleurs (hex codes)
- Typographies (Google Fonts links)
- Style (dark/light/glass/flat)
- Brand guide .md téléchargeable

💾 **Données** : `projects.branding_data`
```json
{
  "name_options": [{ "name": "", "domain_available": true, "meaning": "" }],
  "chosen_name": "",
  "tagline": "",
  "colors": { "primary": "", "secondary": "", "accent": "", "bg": "", "text": "" },
  "typography": { "heading": "", "body": "", "mono": "" },
  "style": "dark|light|minimal|bold",
  "references": [{ "url": "", "note": "" }]
}
```

🔗 **Contexte injecté** : Phase 1 (audience, secteur) + Phase 2 (type de produit)

---

## PHASE 4 — KIT CLAUDE CODE

### Statut : ❌ À construire entièrement
### C'est LA phase qui rend le Lab unique.

| Sous-étape | Type | Description |
|---|---|---|
| 4.1 CLAUDE.md | 🔘 + 📦 | CLAUDE.md COMPLET personnalisé (projet + branding + stack + conventions) |
| 4.2 Prompts systèmes | 🔘 + 📦 | Séquence de prompts numérotés pour le build (6-15 selon complexité) |
| 4.3 Skills recommandés | 🔘 | Skills spécifiques au projet + commandes d'installation |
| 4.4 MCP & connecteurs | 🔘 + 📦 | Fichier .mcp.json personnalisé |
| 4.5 Kit complet | 📦 | ZIP téléchargeable (CLAUDE.md + .mcp.json + prompts.md + brand-guide.md) |

📦 **Livrables** :
- CLAUDE.md (avec [Copier] [Télécharger] [Régénérer])
- Séquence de prompts (chacun copiable individuellement)
- Liste Skills avec commandes
- .mcp.json
- Kit ZIP complet

💾 **Données** : `projects.build_kit_data` + `generated_files`
```json
{
  "claude_md": "contenu complet...",
  "prompts": [
    { "number": 1, "title": "Structure du projet", "prompt": "...", "expected": "...", "troubleshoot": "..." }
  ],
  "skills": [
    { "name": "frontend-design", "command": "npx skills add frontend-design", "why": "..." }
  ],
  "mcp_config": { ... }
}
```

🔗 **Contexte injecté** : Phase 1 (idée) + Phase 2 (pages, features, data model) + Phase 3 (branding complet)

---

## PHASE 5 — INSTALLATION GUIDÉE

### Statut : ❌ À construire entièrement

| Sous-étape | Type | Description |
|---|---|---|
| 5.1 Prérequis | ✅ checklist | Node.js, Git, Claude Pro, GitHub, Supabase, Vercel, Stripe |
| 5.2 Installer Claude Code | ✅ | Commande + vérification + troubleshooting |
| 5.3 Configurer le projet | ✅ | mkdir + cd + copier CLAUDE.md |
| 5.4 Installer les Skills | ✅ | Commandes une par une |
| 5.5 Configurer les MCP | ✅ | Copier .mcp.json + commandes mcp add |
| 5.6 Vérification | ✅ | /doctor → tout vert = OK |

📦 **Livrables** : Aucun fichier — c'est un guide interactif
💾 **Données** : `project_phases` avec step_number pour chaque sous-étape cochée

**Format UI** : Checklist interactive
- Chaque étape = instruction + commande [Copier] + "ce que tu dois voir" + troubleshooting
- Bouton [J'ai fait cette étape ✓] pour débloquer la suivante

---

## PHASE 6 — BUILD GUIDÉ

### Statut : ❌ À construire entièrement

| Sous-étape | Type | Description |
|---|---|---|
| 6.1 Structure du projet | 🔘 prompt | Prompt personnalisé : init projet + structure fichiers |
| 6.2 Landing page | 🔘 prompt | Prompt : créer LP avec hero, features, CTA |
| 6.3 Authentification | 🔘 prompt | Prompt : Supabase Auth + pages login/signup |
| 6.4 Dashboard principal | 🔘 prompt | Prompt : dashboard + composants data |
| 6.5 Feature principale | 🔘 prompt | Prompt : la feature core du produit |
| 6.6 Paiement Stripe | 🔘 prompt | Prompt : intégration Stripe checkout |
| 6.7 [Feature spécifique] | 🔘 prompt | Prompt : features supplémentaires (adapté au projet) |
| 6.8 Polish & tests | 🔘 prompt | Prompt : responsive, edge cases, clean up |

**Format UI** : Chaque sous-étape =
1. Prompt copiable (dans un bloc code)
2. "Ce que Claude Code va faire" (accordéon)
3. "Ce que tu dois vérifier" (checklist)
4. "Problème courant" (accordéon)
5. [Cette étape est terminée ✓]

📦 **Livrables** : Les prompts eux-mêmes (générés en Phase 4.2)
🔗 **Contexte** : Phase 4 (prompts personnalisés, CLAUDE.md)

---

## PHASE 7 — DÉPLOIEMENT

### Statut : ❌ À construire entièrement

| Sous-étape | Type | Description |
|---|---|---|
| 7.1 Push sur GitHub | ✅ | Commandes git init + commit + push |
| 7.2 Connecter Vercel | ✅ | Import GitHub → Vercel + config |
| 7.3 Supabase production | ✅ | Env vars prod + RLS check |
| 7.4 Stripe production | ✅ | Passer en mode live + env vars |
| 7.5 Domaine custom | ✅ | Optionnel — configuration DNS |
| 7.6 Vérification finale | ✅ checklist | 7 checks (app, auth, paiement, emails, responsive, HTTPS) |

**Format UI** : Même que Phase 5 (checklist pas-à-pas)
📦 **Livrable final** : URL de production `[projet].vercel.app`

---

## PHASE 8 — LANCEMENT

### Statut : ❌ À construire entièrement

| Sous-étape | Type | Description |
|---|---|---|
| 8.1 Checklist pré-lancement | ✅ | 15 étapes de vérification |
| 8.2 Premiers utilisateurs | 📋 | 5 canaux adaptés au projet (Product Hunt, Reddit, IndieHackers...) |
| 8.3 Templates de lancement | 🔘 x4 | Product Hunt + Reddit + LinkedIn + Email — personnalisés |
| 8.4 Plan semaine 1 | 🔘 | Planning éditorial jours 1-7 post-launch |

📦 **Livrables** :
- Templates copiables (4 plateformes)
- Plan de contenu semaine 1-2
- Liste de canaux avec tips

🔗 **Contexte** : Phase 1 (audience, Reddit subs identifiés) + Phase 3 (nom, tagline) + Phase 7 (URL prod)

---

# FLUX DE DONNÉES ENTRE PHASES

```
Phase 0 (onboarding_data)
    │
    ▼
Phase 1 (idea_data)
    │  scores, verdict, concurrents, marché, pricing marché
    ▼
Phase 2 (structure_data)
    │  pages, features, data model, monétisation, pricing tiers
    ▼
Phase 3 (branding_data)
    │  nom, couleurs, typos, style, références
    ▼
Phase 4 (build_kit_data)
    │  CLAUDE.md (compile P1-P3), prompts séquentiels, skills, MCP
    │  → les prompts de P6 sont générés ici
    ▼
Phase 5 (checklist — pas de données, exécution)
    │
    ▼
Phase 6 (exécution des prompts de P4)
    │
    ▼
Phase 7 (déploiement — URL prod)
    │
    ▼
Phase 8 (lancement — templates compilés avec nom + URL + audience)
```

Chaque générateur 🔘 reçoit en contexte :
1. Les données de son projet (`projects.*_data`)
2. Les données de toutes les phases précédentes
3. Le profil utilisateur (`users.onboarding_data`)

---

# GÉNÉRATEURS — RÉCAPITULATIF

| # | Phase | Générateur | Input Claude | Output |
|---|---|---|---|---|
| G1 | 1.1 | Finder Find | niche | 3-5 opportunités SaaS |
| G2 | 1.1 | Finder Validate | idée | Score /100 + verdict |
| G3 | 1.1 | Finder Copy | URL SaaS | Analyse + 3 angles |
| G4 | 1.2 | Validation approfondie | idée choisie | JSON structuré (scores, concurrents, reco) |
| G5 | 2.1 | Pages & features | idea_data | Pages + features + parcours |
| G6 | 2.2 | Modèle de données | idea_data + structure | Entités + champs en langage simple |
| G7 | 2.3 | Monétisation | idea_data + structure + concurrents | Tiers + pricing + stratégie |
| G8 | 3.1 | Nom & positionnement | idea + structure | 5 noms + domaines + taglines |
| G9 | 3.2 | Direction artistique | idea + structure + nom | Palettes + typos + style |
| G10 | 3.3 | Brand guide | branding complet | Document .md compilé |
| G11 | 4.1 | CLAUDE.md | P1+P2+P3 complet | Fichier CLAUDE.md personnalisé |
| G12 | 4.2 | Prompts systèmes | P1+P2+P3+CLAUDE.md | 6-15 prompts séquentiels |
| G13 | 4.3 | Skills recommandés | type de projet | Liste skills + commandes |
| G14 | 4.4 | .mcp.json | stack technique | Fichier JSON |
| G15 | 8.3 | Templates lancement | P1+P3+P7(URL) | 4 templates personnalisés |
| G16 | 8.4 | Plan semaine 1 | P1(audience)+P3(nom) | Planning 7 jours |

**Total : 16 générateurs IA**

---

# PRIORITÉ DE BUILD

## Sprint 1 — DONE ✅
- Auth + onboarding basique
- Dashboard + projets CRUD
- Phase 1 validation structurée (G4)
- Edge Function streaming

## Sprint 2 — NEXT 🔵
- Enrichir onboarding (7 questions)
- Phase 1 : intégrer Finder (G1-G3) + synthèse (1.3)
- Phase 2 complète (G5 + G6 + G7)
- Sidebar avec sous-étapes par phase

## Sprint 3
- Phase 3 complète (G8 + G9 + G10)
- Phase 4 complète (G11 + G12 + G13 + G14) — le coeur du Lab
- Système de fichiers générés + téléchargement ZIP

## Sprint 4
- Phase 5 (checklist interactive)
- Phase 6 (prompts séquentiels avec UI dédiée)
- Phase 7 (checklist déploiement)
- Phase 8 (G15 + G16)

## Sprint 5
- Stripe intégration (paywall avant Lab)
- Night mode toggle
- Polish + mobile responsive
- Lancement

---

# MODÈLE DE DONNÉES CIBLE

```sql
-- Déjà créé
users (id, email, name, avatar_url, plan, stripe_customer_id,
       onboarding_completed, onboarding_data, created_at)

projects (id, user_id, name, slug, description,
          status, current_phase,
          idea_data,       -- Phase 1
          structure_data,  -- Phase 2
          branding_data,   -- Phase 3
          build_kit_data,  -- Phase 4
          created_at, updated_at)

project_phases (id, project_id, phase_number, step_number,
               status, generated_content, completed_at)

-- À créer
generated_files (id, project_id,
                 file_type,  -- claude_md / mcp_json / prompts / brand_guide / kit_zip
                 content,    -- TEXT (contenu du fichier)
                 version,    -- int (régénérations)
                 created_at)

finder_searches (id, user_id, project_id,
                 mode, query, results, score, email,
                 created_at)
```

---

# FIN DE L'ORCHESTRATION
