# Content OS — Alfred Orsini / Buildrs
## Design Spec · v1.0 · 14 Mars 2026

---

## 1. Vision & Objectif

Construire un **Content Operating System** complet pour Alfred Orsini / Buildrs.
Ce système permet de produire 2-3 vidéos/jour sur TikTok, Instagram Reels, YouTube Shorts et X,
avec un contenu cohérent, viral, et relié à un funnel de vente clair — le tout industrialisé via Claude.

**Résultat attendu :** Alfred ouvre Claude Code dans ce dossier, invoque un skill, et a un script
prêt à filmer en moins de 60 secondes. Chaque contenu sert le funnel. Chaque script démarre fort.

---

## 2. Architecture des fichiers

```
/CLAUDE/Création de contenu/
│
├── CLAUDE.md                    ← Master context chargé à chaque session
├── ALFRED.md                    ← Histoire, valeurs, voix, accroche signature
├── BRAND.md                     ← Bible de marque, DA, funnel, ManyChat mapping
├── STRATEGY.md                  ← 5 piliers, plateformes, KPIs, fréquences
│
├── IDEAS-BOARD.md               ← Board vivant : 100 idées classées
├── CALENDAR-30J.md              ← 30 jours de contenu détaillés
│
└── docs/superpowers/specs/
    └── 2026-03-14-content-os-design.md  ← Ce fichier
```

**Skills installés dans** `~/.claude/skills/` :
```
alfred-script/    ← Script vidéo complet mot-à-mot
alfred-idea/      ← Générateur d'idées de contenu
alfred-plan/      ← Planning éditorial 7j ou 30j
alfred-viral/     ← Optimiseur de hook & viralité
alfred-brand/     ← Vérificateur de voix de marque
```

---

## 3. Persona & Voix de marque

### 3.1 Alfred Orsini — Personal Brand (TikTok / Instagram / YouTube Shorts / X)

**Qui :** 32 ans, 10 ans d'entrepreneuriat, fondateur de Buildrs Group.
Non-développeur qui orchestre l'IA pour construire des actifs logiciels réels (VibeCoding).
Parti en Bretagne face à la mer pour builder sans distraction.
22k MRR actuel → objectif 100k avant de changer d'endroit.

**Ce qu'il est :**
- Multi-entrepreneur assumé
- VibeCoder — orchestre les IA comme un chef d'orchestre
- Accro à Claude (humour assumé)
- Proche des éléments simples : boxe, sport, marche, bord de mer + beaucoup de tech
- Transparent sur les chiffres, les méthodes, les erreurs

**Ce qu'il n'est pas :**
- Pas de bling / penthouse Dubai / millionnaire show-off
- Pas d'OFM / culture du vide
- Pas de "revenus passifs", "c'est facile", "suffit de"
- Pas de jargon technique inutile

**Accroche signature :** "Yo les gars" — pote accessible qui maîtrise ses sujets.
Alternatives possibles : "Soyons honnêtes —" / "Je vais être direct —"

**Ton :** Direct. Cash. Sans bullshit. Court. Intense. Vulgarise l'IA sans être trop tech.
Phrases courtes. Énergie terrain. Preuve avant tout.

### 3.2 Buildrs — Business Brand (LinkedIn)

**Angle :** Buildrs = le laboratoire. Posts pro, orientés création d'outils SaaS, B2B.
Ton plus structuré, mais toujours direct. Pas corporate. Pas générique.
Tagline : "Orchestre des IA. Construis des actifs. Génère du MRR."

---

## 4. Le Funnel

```
TAPIT (link-in-bio, outil type Linktree)
  ↓
RESSOURCES GRATUITES
  ├── Guide Claude Power by Buildrs
  │     (prompts exacts, skills sur mesure, méthode, workflow, agents, connecteurs, présentation)
  ├── Vibecoder IA by Buildrs — 27€
  └── Stratégie Micro-SaaS IA en VibeCoding — 47€
  ↓
Lancer son 1er Micro-SaaS IA jusqu'au MVP — 127€ (low ticket)
  ↓
Cohorte Premium — 3 mois d'accompagnement en groupe — 1997€
  ↓
Done For You — Buildrs Lab — 8 000€
```

### Mapping Contenu → Ressource → Produit

| Type de contenu | Ressource gratuite | Produit suivant |
|---|---|---|
| Vidéos sur Claude / prompts / skills | Guide Claude Power by Buildrs | Vibecoder IA 27€ |
| Vidéos inspiration / histoire Alfred | Guide Claude Power by Buildrs | Vibecoder IA 27€ |
| Vidéos sur les outils IA / stack | Vibecoder IA 27€ | Stratégie Micro-SaaS 47€ |
| Vidéos sur les Micro-SaaS / MRR | Stratégie Micro-SaaS 47€ | MVP 127€ |
| Vidéos sur le lancement / MVP | Guide MVP 127€ | Cohorte 1997€ |
| Vidéos philosophie / liberté | Guide Claude Power (freemium) | Vibecoder IA 27€ |

### ManyChat — Mots triggers par pilier

| Pilier | Mot trigger | Ressource envoyée |
|---|---|---|
| Histoire / Inspiration | **BUILD** | Guide Claude Power |
| Outils IA | **STACK** | Vibecoder IA 27€ |
| Micro-SaaS / MRR | **SAAS** | Stratégie Micro-SaaS 47€ |
| Lancement / MVP | **MVP** | Guide MVP 127€ |
| Philosophie / Liberté | **VIBE** | Guide Claude Power |

---

## 5. Les 5 Piliers de contenu

| # | Pilier | % | Objectif | Plateformes |
|---|---|---|---|---|
| 1 | Histoire & Inspiration | 25% | Notoriété, identification | TikTok, Reels, Shorts |
| 2 | Vulgarisation IA & Outils | 30% | Éducation, autorité | TikTok, Reels, Shorts, X |
| 3 | Micro-SaaS & Métier | 20% | Leads qualifiés | TikTok, Reels, X, LinkedIn |
| 4 | Philosophie & Liberté | 15% | Engagement, communauté | Plan fixe, X, LinkedIn |
| 5 | Humour & Relatable | 10% | Viralité, partage | TikTok, Reels, Shorts |

---

## 6. Plateformes — Fréquences & Objectifs

| Plateforme | Fréquence | Format prioritaire | Objectif | Persona |
|---|---|---|---|---|
| TikTok | 2-3/jour | Facecam, B-roll+VO | Notoriété, top of funnel | Alfred |
| Instagram Reels | 2-3/jour | Mêmes vidéos que TikTok | Notoriété | Alfred |
| YouTube Shorts | 1-2/jour | Mêmes vidéos | Référencement long terme | Alfred |
| X (Twitter) | 2-3/jour | Thread, 1 phrase choc | Engagement intellectuel | Alfred |
| LinkedIn | 3-4/semaine | Post long, carrousel | B2B, leads qualifiés | Buildrs |
| Substack | 3/semaine | Newsletter thématique | Nurturing, conversion | Alfred |

---

## 7. Formats vidéo de production

| Format | Description | Lieux idéaux | Piliers associés |
|---|---|---|---|
| B-roll + voix off + musique | Images de vie, voix posée dessus | Bord de mer, route, sport | Histoire, Philosophie |
| Plan fixe face caméra | Parle directement à l'audience, stable | Bureau/chambre, intérieur | Vulgarisation, Métier |
| Split screen | Toi + contenu IA à l'écran | Intérieur | Outils, Actualité IA |
| Facecam dynamique | Énergie, réaction, tutoriel | Partout | Outils, Humour |

---

## 8. Les 7 Formules de Hook (Loi absolue)

Toute vidéo DOIT démarrer avec un hook selon l'une de ces 7 formules.
Les 3 premières secondes déterminent 80% du watch time.

| # | Formule | Exemple concret |
|---|---|---|
| 1 | **Bold claim brutal** | "Claude explose la prospection" |
| 2 | **Chiffre + contraste** | "Ce SaaS vaut 3 milliards, créé par un gamin de 16 ans" |
| 3 | **Secret révélé** | "Personne en France te parle de ça" |
| 4 | **Confession** | "J'ai perdu 2 ans à faire cette erreur" |
| 5 | **Pattern interrupt** | Commence par le résultat/la fin — sans contexte |
| 6 | **FOMO / Fenêtre** | "Dans 12 mois ce sera trop tard" |
| 7 | **Identity hook** | "Si tu veux vivre de l'IA en 2026, regarde ça" |

**Règles du hook :**
- Max 10-15 mots
- Une seule idée — pas d'explication
- Le cerveau doit vouloir savoir la suite immédiatement
- Jamais de contexte avant le hook — le hook EST la première phrase

---

## 9. Spec des 5 Skills

### 9.1 `/alfred-script` — Script vidéo complet

**Trigger :** "écris-moi un script", "script sur [sujet]", "vidéo sur [sujet]"

**Input requis :**
- Sujet (obligatoire)
- Format : b-roll / plan fixe / split screen / facecam (optionnel, détecté si non fourni)
- Durée cible : 15-30s / 30-60s / 60-90s (optionnel, défaut 30-60s)

**Output :**
```
FORMAT : [format] | DURÉE : [durée] | PILIER : [pilier] | PLATEFORME : TikTok/Reels/Shorts

HOOK (0-3s) — Formule utilisée : [#]
[Texte exact mot-à-mot]

CORPS (4-Xs)
[Texte aéré, phrases courtes, 1 idée par ligne]

CTA (dernières 3s)
[Action demandée] — Mot ManyChat : [MOT]

---
CAPTION : [1 phrase choc | emoji | "Écris [MOT]"]
HASHTAGS : [5-7 hashtags]
RESSOURCE À LINKER : [nom de la ressource + prix ou "gratuit"]
NOTE LINKEDIN : [Adaptation en 2 phrases si pertinent]
```

**Comportement :** Lit ALFRED.md + BRAND.md. Applique la voix Alfred exacte.
Choisit automatiquement la formule de hook la plus adaptée au sujet.
Si le sujet touche à Claude/outils → pointe vers guide Claude. Si Micro-SaaS/MVP → pointe vers 127€.

### 9.2 `/alfred-idea` — Générateur d'idées

**Trigger :** "idées de contenu", "qu'est-ce que je filme", "donne-moi des idées"

**Input :** Thème optionnel / rien = génération libre

**Output :** 10 idées avec pour chacune :
- Titre (hook intégré)
- Format recommandé
- Pilier
- Durée estimée
- Mot ManyChat
- Ressource à linker
- Score viralité /10 + justification courte

**Comportement :** Pioche dans les piliers de STRATEGY.md, l'actualité IA, l'histoire Alfred dans ALFRED.md.
Équilibre les 5 piliers sur les 10 idées. Varie les formats.

### 9.3 `/alfred-plan` — Planning éditorial

**Trigger :** "planning", "calendrier de contenu", "plan éditorial"

**Input :** Durée (7j / 30j) + focus optionnel (ex: "semaine lancement MVP")

**Output :** Tableau jour par jour :
- Jour / Date
- Sujet + hook suggéré
- Format
- Plateforme principale
- Pilier
- Mot ManyChat
- Ressource à linker

**Comportement :** Respecte la distribution des 5 piliers (%). Alterne les formats.
Semaine 1 = notoriété. Semaine 2 = engagement. Semaine 3 = éducation. Semaine 4 = conversion.

### 9.4 `/alfred-viral` — Optimiseur Hook & Viralité

**Trigger :** "optimise ce hook", "rends ça plus viral", "améliore l'accroche"

**Input :** Script brut ou caption ou titre

**Output :**
```
ANALYSE DU HOOK ACTUEL
Score : [X/10]
Formule détectée : [formule ou "aucune"]
Problème : [en 1 phrase]

HOOK OPTIMISÉ
[Nouvelle version — formule appliquée]

5 VARIANTES
1. [Bold claim]
2. [Chiffre + contraste]
3. [Secret révélé]
4. [Pattern interrupt]
5. [Identity hook]

CAPTION RÉÉCRITE
[Version optimisée]

WATCH TIME
[1-2 conseils pour garder l'attention dans le corps de la vidéo]
```

**Comportement :** Applique les 7 formules de hook. Score selon : curiosity gap, spécificité,
vitesse, pattern interrupt, identité. Toujours proposer 5 variantes, jamais une seule.

### 9.5 `/alfred-brand` — Vérificateur voix de marque

**Trigger :** "vérifie ce texte", "est-ce que c'est dans le ton", "check brand"

**Input :** N'importe quel texte (script, caption, post LinkedIn, email)

**Output :**
```
AUDIT DE MARQUE
Ton Alfred : ✓ / ✗ — [observation]
Vocabulaire : ✓ / ✗ — [mots à changer si ✗]
Funnel : ✓ / ✗ — [ressource pointée correcte ?]
Hook : ✓ / ✗ — [score /10]
Bullshit détecté : [liste si présent]

VERSION CORRIGÉE (si corrections nécessaires)
[Texte réécrit]
```

**Comportement :** Lit BRAND.md comme référence absolue. Vérifie : pas de "revenus passifs",
pas de "c'est facile", bon mot ManyChat, bonne ressource linkée, ton pote/direct/terrain.

---

## 10. Workflow quotidien

```
MATIN (5 min)
├── Ouvre Création de contenu/ dans Claude Code
├── Claude lit CLAUDE.md → full context chargé
├── /alfred-idea (optionnel) → choisis ton sujet du jour
└── /alfred-script [sujet] → script prêt à filmer

AVANT DE PUBLIER
└── /alfred-viral → optimise le hook si score < 7/10
    /alfred-brand → vérifie la cohérence (optionnel)

HEBDO (lundi matin — 10 min)
└── /alfred-plan 7j → planning de la semaine

MENSUEL
└── /alfred-plan 30j → calendrier du mois
    Mise à jour manuelle IDEAS-BOARD.md avec nouvelles idées
```

---

## 11. KPIs à tracker

| Métrique | Plateforme | Objectif 3 mois | Objectif 6 mois |
|---|---|---|---|
| Followers | TikTok | +5 000 | +25 000 |
| Followers | Instagram | +3 000 | +15 000 |
| Abonnés newsletter | Substack | +500 | +2 000 |
| Taux engagement | Toutes | > 5% | > 7% |
| Leads TAPIT/mois | — | 200 | 1 000 |
| Conversions 27€/mois | — | 20 | 100 |
| Conversions 127€/mois | — | 5 | 25 |
| Watch time moyen | TikTok/Reels | > 50% | > 65% |

---

## 12. Décisions clés

| Décision | Choix |
|---|---|
| Architecture fichiers | Système modulaire (multi-fichiers) |
| Persona | 2 distincts : Alfred (perso) + Buildrs (LinkedIn) |
| Format script | Texte complet mot-à-mot |
| Adaptation plateformes | 1 script universel + note d'adaptation |
| Newsletter | Sur hold — priorité vidéo court format |
| Skills | 5 skills Superpowers invocables |
| Accroche signature | "Yo les gars" (officielle) |

---

## 13. Plan d'implémentation (ordre d'exécution)

**Phase 1 — Fichiers de contexte** (à créer dans Création de contenu/)
1. `CLAUDE.md` — Master context
2. `ALFRED.md` — Histoire + voix + valeurs
3. `BRAND.md` — Bible marque + funnel + ManyChat
4. `STRATEGY.md` — Stratégie SM + piliers + KPIs
5. `IDEAS-BOARD.md` — 100 idées initiales
6. `CALENDAR-30J.md` — Planning 30 premiers jours

**Phase 2 — Skills** (à créer dans ~/.claude/skills/)
7. `alfred-viral/SKILL.md` — En premier car utilisé dans tous les autres
8. `alfred-script/SKILL.md` — Le plus utilisé
9. `alfred-idea/SKILL.md`
10. `alfred-plan/SKILL.md`
11. `alfred-brand/SKILL.md`

---

*Design validé par Alfred Orsini · Mars 2026*
*Construit avec Claude Code + Superpowers*
