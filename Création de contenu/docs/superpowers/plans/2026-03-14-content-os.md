# Content OS — Alfred Orsini / Buildrs — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Créer un Content Operating System complet — 6 fichiers de contexte + 5 skills Superpowers invocables — permettant à Alfred de produire 2-3 vidéos/jour avec scripts prêts-à-filmer en moins de 60 secondes.

**Architecture:** Système modulaire en deux phases. Phase 1 : fichiers markdown de contexte dans `/CLAUDE/Création de contenu/` (lus automatiquement par Claude à chaque session). Phase 2 : skills installés dans `~/.claude/skills/` (invocables via le Skill tool), chaque skill lisant les fichiers contexte pour rester en cohérence.

**Tech Stack:** Markdown, YAML frontmatter, Claude Code skills system (`~/.claude/skills/`), Superpowers skill format.

**Spec de référence :** `/Users/alfredorsini/CLAUDE/Création de contenu/docs/superpowers/specs/2026-03-14-content-os-design.md`

---

## Chunk 1 : Fichiers de contexte

### Task 1 : CLAUDE.md — Master context

**Fichiers :**
- Créer : `/Users/alfredorsini/CLAUDE/Création de contenu/CLAUDE.md`

- [ ] **Étape 1 : Écrire CLAUDE.md**

Contenu exact à écrire :

```markdown
# Création de Contenu — Alfred Orsini / Buildrs
## Master Context File · Claude Code · v1.0

Ce fichier est la source de vérité pour toutes les sessions de création de contenu.
Lis-le intégralement avant chaque session. Il référence tous les autres fichiers.

---

## 🎯 CE QUE TU FAIS ICI

Tu aides Alfred Orsini à produire du contenu court (TikTok, Reels, Shorts, X, LinkedIn).
Objectif : 2-3 vidéos/jour. Scripts prêts à filmer en < 60 secondes.
Chaque contenu sert le funnel. Chaque script démarre avec un hook fort.

---

## 📁 FICHIERS DE CONTEXTE — LIS-LES AU DÉMARRAGE

| Fichier | Contenu | Quand le lire |
|---------|---------|----------------|
| `ALFRED.md` | Histoire, valeurs, voix, accroche | Toujours — avant tout script |
| `BRAND.md` | Bible marque, funnel, ManyChat mapping | Pour scripts + vérifications brand |
| `STRATEGY.md` | 5 piliers, plateformes, KPIs | Pour planning + idées |
| `IDEAS-BOARD.md` | 100 idées classées | Quand Alfred cherche un sujet |
| `CALENDAR-30J.md` | Planning 30 jours | Pour savoir quoi produire aujourd'hui |

---

## 🔧 SKILLS DISPONIBLES

| Skill | Commande | Usage |
|-------|----------|-------|
| Script vidéo complet | `/alfred-script` | "script sur [sujet]" |
| Idées de contenu | `/alfred-idea` | "idées de contenu" / "qu'est-ce que je filme" |
| Planning éditorial | `/alfred-plan` | "planning 7j" / "calendrier du mois" |
| Optimiseur hook/viralité | `/alfred-viral` | "optimise ce hook" / "rends ça viral" |
| Vérificateur brand | `/alfred-brand` | "vérifie ce texte" / "check brand" |

---

## ⚡ WORKFLOW RAPIDE

**Matin (5 min) :**
1. Ouvre ce dossier dans Claude Code → contexte chargé automatiquement
2. Optionnel : `/alfred-idea` → choisis ton sujet
3. `/alfred-script [sujet]` → script prêt en 60s
4. Optionnel : `/alfred-viral` → booste le hook si score < 7/10

**Hebdo (lundi) :** `/alfred-plan 7j`
**Mensuel :** `/alfred-plan 30j`

---

## 💰 FUNNEL (MÉMORISE-LE)

```
TAPIT → Ressources gratuites → Vibecoder IA 27€ → Stratégie Micro-SaaS 47€
→ MVP 127€ → Cohorte 1997€ → Done For You 8 000€
```

---

## 🚫 RÈGLES ABSOLUES

1. Chaque script démarre avec un hook fort (formule des 7 — voir BRAND.md)
2. Jamais "revenus passifs", "c'est facile", "suffit de", "révolution"
3. Toujours pointer vers la bonne ressource selon le sujet (voir BRAND.md)
4. Ton : pote accessible qui maîtrise. Pas corporate. Pas bullshit.
5. VibeCoding s'écrit toujours en CamelCase
6. Phrases courtes. Une idée = une ligne.

---

*v1.0 · Buildrs Content OS · Mars 2026 · Alfred Orsini*
```

- [ ] **Étape 2 : Vérifier**

Ouvre le fichier et confirme :
- Les 5 fichiers de contexte sont référencés ✓
- Les 5 skills sont listés ✓
- Le funnel est correct (TAPIT → 8k€) ✓
- Les règles absolues sont présentes ✓

- [ ] **Étape 3 : Commit**

```bash
cd "/Users/alfredorsini/CLAUDE"
git add "Création de contenu/CLAUDE.md"
git commit -m "feat(content-os): add CLAUDE.md master context"
```

---

### Task 2 : ALFRED.md — Histoire, voix, valeurs

**Fichiers :**
- Créer : `/Users/alfredorsini/CLAUDE/Création de contenu/ALFRED.md`

- [ ] **Étape 1 : Écrire ALFRED.md**

```markdown
# Alfred Orsini — Qui je suis
## Fichier de référence · Voix · Histoire · Valeurs

---

## 🧍 IDENTITÉ

**Alfred Orsini** · 32 ans · Fondateur Buildrs Group
Non-développeur. Orchestrateur d'IA. VibeCoder.
10 ans d'entrepreneuriat terrain. Maintenant : Micro-SaaS IA.

**Situation actuelle :** Parti en Bretagne face à la mer pour builder sans distraction.
22k MRR → objectif 100k avant de changer d'endroit.
Quotidien : boxe, sport, marche bord de mer + beaucoup de Claude et de tech.
Paradoxe assumé : très tech mais proche des éléments simples et vitaux.

---

## 📖 MON HISTOIRE (arc narratif pour le contenu)

### Le grand reset
Il y a 1 an : perdu. 10 ans d'entrepreneuriat mais dans un mauvais schéma.
Stress, pression entrepreneuriale, mauvais cercle, mauvaises habitudes.
Puis le grand reset. Et ça a tout changé.

### Les désillusions avant
- Des boîtes avec salariés, travaux, équipements → j'aimais pas ça
- Multi-entrepreneur = m'éparpillais sur des projets en simultané, pas alignés
- Beaucoup de désillusions. Des projets sans sens pour moi.

### Le déclic Micro-SaaS IA
J'ai découvert les Micro-SaaS IA. J'ai utilisé Claude + la méthode VibeCoding.
Résultat : ça a explosé direct. J'ai enfin trouvé mon format.
Même système à chaque fois (pas de contraintes salariés).
Rapidité d'exécution. Liberté totale.

### Pourquoi la Bretagne
Fenêtre de tir courte. J'ai quitté ma ville pour avoir zéro distraction.
Objectif : passer de 22k à 100k MRR.
Maison en front de mer. Boxe, sport, marche, Claude. C'est tout.

### Pourquoi Buildrs
Buildrs = un mouvement.
Des gens qui disent stop aux chemins accessibles. Qui veulent maîtriser
les compétences du futur. Un ticket de liberté. De vrais business durables.
Ciao l'OFM. Ciao la culture du vide.

---

## 🎙️ MA VOIX — COMMENT JE PARLE

### Accroche signature officielle
> **"Yo les gars"**

Alternatives possibles selon le contexte :
- "Soyons honnêtes —"
- "Je vais être direct —"
- "Regarde ça —"

### Ton exact
- Pote accessible qui maîtrise ses sujets
- Direct. Cash. Sans bullshit. Terrain avant théorie.
- Vulgarise l'IA sans être trop tech — montre qu'on sait de quoi on parle
- Phrases courtes. Rythme intense. Une idée = une ligne.
- Humour assumé sur Claude (addict aux tokens, rêver de Claude)
- Transparent sur les chiffres (MRR public, erreurs publiques)

### Style de phrase
```
Bien ✓ : "Claude explose la prospection."
Bien ✓ : "J'ai tout plaqué pour la Bretagne."
Bien ✓ : "22k MRR. Objectif 100k. La fenêtre est courte."
Mal ✗ : "Dans cette vidéo, je vais vous expliquer comment..."
Mal ✗ : "C'est vraiment incroyable ce que l'IA peut faire aujourd'hui"
Mal ✗ : "Voici 5 raisons pour lesquelles vous devriez..."
```

---

## 💪 CE QUE JE SUIS

- Multi-entrepreneur assumé (j'aime la nouveauté, je crée plusieurs projets)
- VibeCoder — orchestre les IA comme un chef d'orchestre
- Non-dev qui prouve chaque jour que c'est un avantage
- Gros bosseur. La liberté se mérite.
- Proche des éléments : mer, boxe, sport, marche
- Philosophie CEO San Francisco : appart simple, bureau, banc de muscu. La prison dans la tête, pas dans un penthouse.

---

## 🚫 CE QUE JE NE SUIS PAS

- Pas de bling / Dubai / penthouse / montrer la richesse
- Pas d'OFM / dropshipping / culture du vide
- Pas de bullshit sur la chaîne — que du vrai, du technique
- Pas "je suis millionnaire et vous pouvez l'être aussi"
- Pas de "revenus passifs", "c'est facile", "suffit de"
- Pas corporate, pas générique, pas théorique

---

## 🗺️ MON UNIVERS DE CONTENU

### Lieux de tournage disponibles
- Maison en front de mer (Bretagne) — plan fixe, fenêtre, salon
- Voiture — b-roll en mouvement, voix off
- Bord de mer — b-roll inspirationnel, marche
- Salle de sport — énergie, motivation
- Salle de boxe — philosophie, discipline
- Bureau/setup — démos techniques, screen

### Setup technique
- Perche pour plan fixe et b-roll
- Facecam
- Micro pour son qualité pro

---

## 🏢 MES PROJETS

**Buildrs Group** (structure mère)
├── **Buildrs Lab** — Micro-SaaS IA créés par Alfred en live
└── **Buildrs Academy** — Formation, cohortes, guides

Domaines : buildrs.fr · alfred-orsini.com

---

*ALFRED.md v1.0 · Mars 2026*
```

- [ ] **Étape 2 : Vérifier**
  - Histoire complète (reset → Bretagne → Micro-SaaS) ✓
  - Accroche "Yo les gars" notée ✓
  - Ce qu'il est / ce qu'il n'est pas bien séparé ✓
  - Lieux de tournage listés ✓

- [ ] **Étape 3 : Commit**
```bash
git add "Création de contenu/ALFRED.md"
git commit -m "feat(content-os): add ALFRED.md identity and voice reference"
```

---

### Task 3 : BRAND.md — Bible de marque, funnel, ManyChat

**Fichiers :**
- Créer : `/Users/alfredorsini/CLAUDE/Création de contenu/BRAND.md`

- [ ] **Étape 1 : Écrire BRAND.md**

```markdown
# Brand Bible — Alfred Orsini / Buildrs
## Marque · Funnel · ManyChat · DA Vidéo

---

## 👤 DEUX PERSONAS — DEUX PLATEFORMES

### Persona 1 : Alfred Orsini (Personal Brand)
**Plateformes :** TikTok · Instagram Reels · YouTube Shorts · X
**Angle :** L'homme. L'histoire. La méthode. Le quotidien.
**Ton :** Accessible, direct, terrain, humour, vulgarisation.
**Ce qu'il partage :** Sa vie, ses chiffres, ses erreurs, ses outils, sa philosophie.

### Persona 2 : Buildrs (Business Brand)
**Plateformes :** LinkedIn
**Angle :** Le laboratoire. Les actifs logiciels. Le VibeCoding comme méthode business.
**Ton :** Structuré, pro, orienté résultats. Toujours direct — jamais corporate.
**Ce qu'il partage :** Case studies, méthodes, outils business, vision marché.

---

## 💰 FUNNEL COMPLET

```
TAPIT (link-in-bio)
  ↓
RESSOURCES GRATUITES
  ├── Guide Claude Power by Buildrs
  │     Prompts exacts · Skills sur mesure · Méthode · Workflow · Agents · Connecteurs
  ├── Vibecoder IA by Buildrs .............. 27€
  └── Stratégie Micro-SaaS IA en VibeCoding  47€
  ↓
Lancer son 1er Micro-SaaS IA jusqu'au MVP .. 127€  ← LOW TICKET
  ↓
Cohorte Premium 3 mois (groupe) ........... 1 997€
  ↓
Done For You — Buildrs Lab ................. 8 000€
```

---

## 🔗 MAPPING CONTENU → RESSOURCE → PRODUIT

| Type de vidéo | Ressource gratuite | Produit suivant |
|---|---|---|
| Claude, prompts, skills, agents | Guide Claude Power (gratuit) | Vibecoder IA 27€ |
| Histoire Alfred, inspiration, reset | Guide Claude Power (gratuit) | Vibecoder IA 27€ |
| Outils IA, stack, comparatifs | Vibecoder IA 27€ | Stratégie Micro-SaaS 47€ |
| Micro-SaaS, MRR, valorisation | Stratégie Micro-SaaS 47€ | MVP 127€ |
| Lancement, MVP, build | Guide MVP 127€ | Cohorte 1 997€ |
| Philosophie, liberté, fenêtre | Guide Claude Power (gratuit) | Vibecoder IA 27€ |
| Humour / relatable Claude | Guide Claude Power (gratuit) | Vibecoder IA 27€ |

---

## 💬 MANYCHAT — MOTS TRIGGERS

Chaque vidéo se termine avec un CTA : "Écris [MOT] en commentaire,
je t'envoie [ressource] gratuitement."

| Pilier | Mot trigger | Ressource envoyée automatiquement |
|---|---|---|
| Histoire / Inspiration | **BUILD** | Guide Claude Power |
| Outils IA / Stack | **STACK** | Vibecoder IA 27€ |
| Micro-SaaS / MRR | **SAAS** | Stratégie Micro-SaaS 47€ |
| Lancement / MVP | **MVP** | Guide MVP 127€ |
| Philosophie / Liberté | **VIBE** | Guide Claude Power |

**Règle :** Chaque script doit se terminer avec le mot ManyChat adapté au sujet.
Un seul mot par vidéo. Court. Mémorable.

---

## 🎣 LES 7 FORMULES DE HOOK — LOI ABSOLUE

Toute vidéo démarre avec l'une de ces 7 formules. Les 3 premières secondes = 80% du watch time.

| # | Formule | Exemple Alfred |
|---|---|---|
| 1 | **Bold claim brutal** | "Claude explose la prospection" |
| 2 | **Chiffre + contraste** | "Ce SaaS vaut 3 milliards, créé par un gamin de 16 ans" |
| 3 | **Secret révélé** | "Personne en France te parle de ça" |
| 4 | **Confession** | "J'ai perdu 2 ans à faire cette erreur" |
| 5 | **Pattern interrupt** | Commence par la fin/le résultat — sans contexte |
| 6 | **FOMO / Fenêtre** | "Dans 12 mois ce sera trop tard" |
| 7 | **Identity hook** | "Si tu veux vivre de l'IA en 2026, regarde ça" |

### Règles du hook
- Max 10-15 mots
- Une seule idée — pas d'explication après le hook
- Le cerveau DOIT vouloir savoir la suite immédiatement
- Jamais de contexte AVANT le hook
- Le hook EST la première phrase. Point.

### Score hook (utilisé par /alfred-viral)
- 9-10 : Pattern interrupt fort + chiffre ou identité → publie sans toucher
- 7-8 : Bon hook, curiosity gap présent → OK pour publier
- 5-6 : Trop doux, pas assez clivant → à retravailler
- < 5 : Accroche générique → réécrire complètement

---

## 🎨 DA VIDÉO — DIRECTION ARTISTIQUE

### Ambiance générale
Dark · Premium · Authentique · Pas de fla-fla
Inspiré par : Buildrs design system (fond sombre, minimal, épuré)

### Types de plans à utiliser
| Format | Ambiance | Musique | Sous-titres |
|---|---|---|---|
| B-roll + voix off | Cinématique, calme | Instrumental lo-fi ou epic minimal | Grands, blancs, centrés |
| Plan fixe face caméra | Direct, simple | Aucune ou très discrète | Petits, en bas |
| Split screen | Dynamique, tech | Beat énergique | Auto-générés |
| Facecam mobile | Raw, authentique | Trending TikTok | Auto-générés |

### Règles visuelles
- Sous-titres toujours présents (accessibilité + watch time)
- Pas de filtre sur-saturé / orangé / vintage
- Couleurs dominantes : naturelles ou dark
- Pas de b-roll "stock footage" générique
- Préférer : mer, sport, setup tech, quotidien réel

---

## ✅ / ❌ VOCABULAIRE

### À utiliser — Lexique Buildrs
- VibeCoding (toujours CamelCase)
- Orchestrateur d'IA
- Actifs logiciels
- Micro-SaaS IA
- Chef d'orchestre
- MRR / ARR (toujours expliquer la 1ère fois)
- Fenêtre de tir courte
- Buildrs Lab / Buildrs Academy / Buildrs Group
- "La compétence n°1 de 2026"
- Agent autonome

### À bannir
- ~~revenus passifs~~
- ~~c'est facile~~
- ~~suffit de~~
- ~~révolution~~
- ~~l'IA va tout changer~~
- ~~juste~~
- ~~simple~~

---

*BRAND.md v1.0 · Mars 2026*
```

- [ ] **Étape 2 : Vérifier**
  - Funnel exact avec tous les prix ✓
  - Tableau ManyChat avec 5 mots triggers ✓
  - 7 formules de hook présentes ✓
  - Mapping contenu → ressource → produit complet ✓

- [ ] **Étape 3 : Commit**
```bash
git add "Création de contenu/BRAND.md"
git commit -m "feat(content-os): add BRAND.md funnel and hook formulas"
```

---

### Task 4 : STRATEGY.md — Stratégie SM complète

**Fichiers :**
- Créer : `/Users/alfredorsini/CLAUDE/Création de contenu/STRATEGY.md`

- [ ] **Étape 1 : Écrire STRATEGY.md**

```markdown
# Stratégie Social Media — Alfred Orsini / Buildrs
## Piliers · Plateformes · KPIs · Positionnement

---

## 🎯 POSITIONNEMENT

**Angle unique :** Le seul créateur francophone qui documente EN LIVE la création de
Micro-SaaS IA sans coder — avec les vrais chiffres (MRR public).

**Vs concurrents :**
- Formateurs IA génériques → Alfred = terrain, preuve, chiffres réels
- Créateurs "revenus passifs" → Alfred = vrai business, vraie méthode
- Devs qui enseignent le code → Alfred = l'avantage du non-dev prouvé

**Promesse de valeur :**
"Je te montre comment construire des actifs logiciels avec l'IA — même sans savoir coder.
Pas la théorie. Le terrain. Les chiffres. La méthode exacte."

---

## 📊 LES 5 PILIERS DE CONTENU

| # | Pilier | % | Objectif | Formats |
|---|---|---|---|---|
| 1 | Histoire & Inspiration | 25% | Notoriété, identification | B-roll+VO, Plan fixe |
| 2 | Vulgarisation IA & Outils | 30% | Éducation, autorité | Facecam, Split screen |
| 3 | Micro-SaaS & Métier | 20% | Leads qualifiés | Facecam, Plan fixe |
| 4 | Philosophie & Liberté | 15% | Engagement, communauté | Plan fixe, B-roll |
| 5 | Humour & Relatable | 10% | Viralité, partage | Facecam, court |

### Pilier 1 — Histoire & Inspiration (25%)
Idées types : J'ai tout quitté pour la Bretagne · Grand reset · Pourquoi j'ai créé Buildrs ·
Multi-entrepreneur assumé · Fenêtre de tir courte · 22k→100k MRR journey

### Pilier 2 — Vulgarisation IA & Outils (30%)
Idées types : C'est quoi un Vibe Coder · Stack complète (outils apparaissent) ·
Comparatifs Lovable vs Replit · Pourquoi Claude pete le game · Skills Claude ·
Open Claw vs Manus · Perplexity Computer · C'est quoi GitHub

### Pilier 3 — Micro-SaaS & Métier (20%)
Idées types : C'est quoi un Micro-SaaS IA · MRR & ARR (définitions) ·
Valorisation + multiple de revente · Stratégies SaaS (copy/commande/idée) ·
Pourquoi dev = pas un avantage · Tout le monde peut créer un MVP

### Pilier 4 — Philosophie & Liberté (15%)
Idées types : Fenêtre courte → agents autonomes · Fin des masters ·
Avant : barrières (fond, réseau, budget, tech) → Aujourd'hui : envie + détermination ·
La prison dans la tête · Les CEO SF vivent simplement

### Pilier 5 — Humour & Relatable (10%)
Idées types : Claude addict aux tokens · Rêver de Claude · Même avec l'IA il faut bosser

---

## 📱 PLATEFORMES — FRÉQUENCES & OBJECTIFS

### Court format (Alfred personal brand)

| Plateforme | Fréquence | Format | Objectif principal |
|---|---|---|---|
| TikTok | 2-3/jour | Facecam, B-roll+VO, Split | Top of funnel, notoriété |
| Instagram Reels | 2-3/jour | Mêmes vidéos TikTok | Notoriété, redirect TAPIT |
| YouTube Shorts | 1-2/jour | Mêmes vidéos + titres SEO | Référencement long terme |
| X (Twitter) | 2-3/jour | Thread, 1 phrase choc, citation | Engagement intellectuel |

### Long format / Pro (Buildrs)

| Plateforme | Fréquence | Format | Objectif principal |
|---|---|---|---|
| LinkedIn | 3-4/semaine | Post long, carrousel | B2B, leads qualifiés |
| Substack | 3/semaine | Newsletter thématique | Nurturing, conversion |

### Distribution hebdo recommandée (30 contenus/semaine)
- Lundi : Pilier 2 (Outils) — TikTok/Reels/Shorts + X
- Mardi : Pilier 1 (Histoire) — TikTok/Reels/Shorts + LinkedIn
- Mercredi : Pilier 3 (Métier) — TikTok/Reels/Shorts + X
- Jeudi : Pilier 4 (Philosophie) — Plan fixe + LinkedIn
- Vendredi : Pilier 2 (Outils) — TikTok/Reels/Shorts + X
- Samedi : Pilier 5 (Humour) — TikTok/Reels court
- Dimanche : Pilier 1 (Inspiration) — B-roll weekend

---

## 📈 KPIS À TRACKER

| Métrique | Plateforme | Objectif M+3 | Objectif M+6 |
|---|---|---|---|
| Followers | TikTok | +5 000 | +25 000 |
| Followers | Instagram | +3 000 | +15 000 |
| Followers | YouTube | +1 000 | +5 000 |
| Abonnés newsletter | Substack | +500 | +2 000 |
| Watch time moyen | TikTok/Reels | >50% | >65% |
| Taux engagement | Toutes | >5% | >7% |
| Leads TAPIT/mois | — | 200 | 1 000 |
| Conversions 27€/mois | — | 20 | 100 |
| Conversions 127€/mois | — | 5 | 25 |

---

## 🚀 TACTIQUES DE CROISSANCE RAPIDE

1. **Volume + constance** : 2-3 vidéos/jour minimum pendant 90 jours sans exception
2. **ManyChat automation** : Chaque vidéo déclenche une ressource → nurturing automatique
3. **Transparence des chiffres** : Publier le MRR en temps réel → crédibilité maximale
4. **Documenter le journey Bretagne** : Contenu en temps réel → audience dans l'aventure
5. **Formats trending** : Split screen actualité IA + "la stack complète" → fort algorithme
6. **Cross-posting systématique** : 1 vidéo filmée = 5 posts sur 5 plateformes

---

*STRATEGY.md v1.0 · Mars 2026*
```

- [ ] **Étape 2 : Vérifier**
  - 5 piliers avec % de répartition ✓
  - Toutes les plateformes avec fréquences ✓
  - KPIs chiffrés ✓
  - Tactiques de croissance ✓

- [ ] **Étape 3 : Commit**
```bash
git add "Création de contenu/STRATEGY.md"
git commit -m "feat(content-os): add STRATEGY.md pillars and platform plan"
```

---

### Task 5 : IDEAS-BOARD.md — 100 idées classées

**Fichiers :**
- Créer : `/Users/alfredorsini/CLAUDE/Création de contenu/IDEAS-BOARD.md`

- [ ] **Étape 1 : Écrire IDEAS-BOARD.md**

```markdown
# Ideas Board — Alfred Orsini / Buildrs
## Board vivant · Mise à jour permanente

**Usage :** Consulte ce board quand tu cherches un sujet.
Coche ✅ quand une idée est tournée. Ajoute en bas les nouvelles idées.

---

## PILIER 1 — HISTOIRE & INSPIRATION (25%)

| # | Titre / Hook | Format | Mot ManyChat | Ressource | Viralité |
|---|---|---|---|---|---|
| 1 | J'ai tout quitté pour partir en Bretagne builder | B-roll + VO | BUILD | Guide Claude Power | 9/10 |
| 2 | Il y a 1 an j'étais complètement perdu | Plan fixe | BUILD | Guide Claude Power | 8/10 |
| 3 | 10 ans d'entrepreneuriat pour en arriver là | B-roll + VO | BUILD | Guide Claude Power | 8/10 |
| 4 | Pourquoi j'ai créé Buildrs | Plan fixe | BUILD | Guide Claude Power | 7/10 |
| 5 | J'ai eu des boîtes avec salariés. Je voulais plus ça. | Plan fixe | VIBE | Vibecoder IA | 8/10 |
| 6 | Le multi-entrepreneur assumé — pourquoi j'assume | Facecam | VIBE | Guide Claude Power | 7/10 |
| 7 | La fenêtre de tir courte — voilà pourquoi je suis en Bretagne | B-roll mer | BUILD | Guide Claude Power | 9/10 |
| 8 | 22k MRR → 100k. Je vais tout documenter. | Plan fixe | BUILD | Guide Claude Power | 9/10 |
| 9 | Le paradoxe : hyper tech mais proche de la mer, du sport, de la boxe | B-roll | VIBE | Guide Claude Power | 8/10 |
| 10 | J'ai refait ma vie avec un SaaS. Sans savoir coder. | Facecam | SAAS | Stratégie 47€ | 9/10 |
| 11 | Ce que 10 ans d'entrepreneuriat m'ont vraiment appris | Plan fixe | BUILD | Guide Claude Power | 7/10 |
| 12 | Pourquoi j'ai arrêté les projets qui ne me ressemblaient pas | B-roll | VIBE | Guide Claude Power | 8/10 |
| 13 | La liberté ce n'est pas un penthouse à Dubai | Plan fixe | VIBE | Guide Claude Power | 9/10 |
| 14 | Buildrs c'est un mouvement. Pas une formation. | Plan fixe | BUILD | Guide Claude Power | 7/10 |
| 15 | Je vis en front de mer et je build des SaaS. Voilà mon quotidien. | B-roll | BUILD | Guide Claude Power | 8/10 |

---

## PILIER 2 — VULGARISATION IA & OUTILS (30%)

| # | Titre / Hook | Format | Mot ManyChat | Ressource | Viralité |
|---|---|---|---|---|---|
| 16 | Claude explose la prospection | Facecam | STACK | Vibecoder IA | 10/10 |
| 17 | C'est quoi un Vibe Coder exactement | Plan fixe | VIBE | Vibecoder IA | 8/10 |
| 18 | La stack complète pour créer ton Micro-SaaS IA | Split screen (outils en haut) | STACK | Vibecoder IA | 10/10 |
| 19 | Pourquoi Claude pete le game vs GPT-4 | Facecam | STACK | Vibecoder IA | 9/10 |
| 20 | Mon avis honnête sur Lovable vs Replit | Split screen | STACK | Vibecoder IA | 9/10 |
| 21 | Les Skills Claude — ce que personne t'explique | Facecam | STACK | Vibecoder IA | 8/10 |
| 22 | Open Claw vs Manus AI : le vrai comparatif | Split screen | STACK | Vibecoder IA | 8/10 |
| 23 | C'est quoi les agents IA et pourquoi ça change tout | Facecam | STACK | Vibecoder IA | 8/10 |
| 24 | Claude en moteur, Antigravity en véhicule, les autres en tunning | Split screen | STACK | Vibecoder IA | 9/10 |
| 25 | Perplexity Computer — OMG | Réaction facecam | STACK | Vibecoder IA | 10/10 |
| 26 | C'est quoi GitHub (pour les non-devs) | Facecam simple | STACK | Vibecoder IA | 7/10 |
| 27 | C'est quoi une base de données (pour les non-devs) | Facecam simple | STACK | Vibecoder IA | 7/10 |
| 28 | Mobbin pour trouver l'inspiration design en 2 min | Split screen | STACK | Vibecoder IA | 8/10 |
| 29 | Reddit + Product Hunt + App Store : où trouver des idées de SaaS | Split screen | SAAS | Stratégie 47€ | 9/10 |
| 30 | Claude Code → créer une vidéo Remotion en 10 min | Split screen | STACK | Vibecoder IA | 8/10 |
| 31 | Les connecteurs IA — le niveau supérieur | Facecam | STACK | Vibecoder IA | 8/10 |
| 32 | Commenter l'actualité IA de la semaine | Split screen (news) | STACK | Vibecoder IA | 7/10 |
| 33 | Top 5 outils IA que j'utilise chaque jour | Split screen | STACK | Vibecoder IA | 9/10 |
| 34 | IDE comparatif : VS Code vs Antigravity pour le VibeCoding | Split screen | STACK | Vibecoder IA | 8/10 |
| 35 | Les prompts exactes que j'utilise pour builder | Facecam | STACK | Vibecoder IA | 9/10 |

---

## PILIER 3 — MICRO-SAAS & MÉTIER (20%)

| # | Titre / Hook | Format | Mot ManyChat | Ressource | Viralité |
|---|---|---|---|---|---|
| 36 | C'est quoi un Micro-SaaS IA exactement | Plan fixe | SAAS | Stratégie 47€ | 8/10 |
| 37 | MRR et ARR : pourquoi c'est la métrique qui compte | Plan fixe | SAAS | Stratégie 47€ | 8/10 |
| 38 | Ce SaaS vaut 3 milliards, créé par un gamin de 16 ans | Facecam | SAAS | Stratégie 47€ | 10/10 |
| 39 | Comment calculer la valorisation de ton SaaS | Facecam + screen | SAAS | Stratégie 47€ | 9/10 |
| 40 | Flippa et Acquire : revendre son SaaS (montrer les plateformes) | Split screen | SAAS | Stratégie 47€ | 9/10 |
| 41 | Être dev à l'ère de l'IA n'est PAS un avantage | Plan fixe | SAAS | Stratégie 47€ | 9/10 |
| 42 | Tout le monde peut créer un MVP. Monétiser c'est là que ça se joue. | Facecam | MVP | Guide MVP 127€ | 8/10 |
| 43 | Les 3 stratégies pour trouver son Micro-SaaS | Plan fixe | SAAS | Stratégie 47€ | 8/10 |
| 44 | SaaS classique c'est fini. Les Micro-SaaS ont pris le dessus. | Plan fixe | SAAS | Stratégie 47€ | 9/10 |
| 45 | C'est quoi un Agentic Builder | Facecam | SAAS | Stratégie 47€ | 7/10 |
| 46 | Mon premier Micro-SaaS : comment ça s'est passé | Plan fixe | SAAS | Stratégie 47€ | 8/10 |
| 47 | Liberté temporelle, géographique, financière : les 3 formes | B-roll | VIBE | Guide Claude Power | 8/10 |
| 48 | Comment je suis passé de 0 à 22k MRR | Plan fixe | SAAS | Stratégie 47€ | 10/10 |
| 49 | Le SaaS sur commande : cash immédiat dès le 1er client | Facecam | MVP | Guide MVP 127€ | 8/10 |
| 50 | Pourquoi j'attaque tous les marchés depuis mon ordinateur | B-roll | SAAS | Stratégie 47€ | 7/10 |

---

## PILIER 4 — PHILOSOPHIE & LIBERTÉ (15%)

| # | Titre / Hook | Format | Mot ManyChat | Ressource | Viralité |
|---|---|---|---|---|---|
| 51 | La fenêtre de tir se ferme. Les agents autonomes vont tout changer. | Plan fixe | VIBE | Guide Claude Power | 9/10 |
| 52 | Même les développeurs de Claude utilisent Claude pour coder | Plan fixe | VIBE | Guide Claude Power | 10/10 |
| 53 | Vaut mieux être plombier que faire un master en 2026 ? | Plan fixe | VIBE | Guide Claude Power | 9/10 |
| 54 | Avant : levée de fonds, réseau, budget, tech. Aujourd'hui : envie. | Plan fixe | VIBE | Guide Claude Power | 9/10 |
| 55 | La prison doit être dans ta tête et ton corps. Pas dans un penthouse. | B-roll mer | VIBE | Guide Claude Power | 9/10 |
| 56 | Même avec l'IA il faut bosser. Innover. Créer. | Plan fixe | BUILD | Guide Claude Power | 8/10 |
| 57 | Ce que les CEO de San Francisco ont compris sur la liberté | Plan fixe | VIBE | Guide Claude Power | 8/10 |
| 58 | Fin de la culture du vide. Bienvenue dans l'ère des builders. | B-roll | BUILD | Guide Claude Power | 8/10 |
| 59 | Dans 12 mois plus personne ne cherchera ces compétences — tu les as ? | Plan fixe | VIBE | Guide Claude Power | 9/10 |
| 60 | L'IA ne va pas te remplacer. Elle va remplacer ceux qui ne l'utilisent pas. | Plan fixe | VIBE | Guide Claude Power | 9/10 |

---

## PILIER 5 — HUMOUR & RELATABLE (10%)

| # | Titre / Hook | Format | Mot ManyChat | Ressource | Viralité |
|---|---|---|---|---|---|
| 61 | Claude : addict aux tokens pire que la cigarette | Facecam réaction | BUILD | Guide Claude Power | 10/10 |
| 62 | J'ai rêvé de Claude cette nuit. C'est grave. | Facecam | BUILD | Guide Claude Power | 9/10 |
| 63 | Quand Claude répond exactement ce que tu voulais à 2h du matin | B-roll setup | BUILD | Guide Claude Power | 8/10 |
| 64 | Le moment où tu réalises que Claude comprend mieux ton projet que toi | Facecam | BUILD | Guide Claude Power | 9/10 |
| 65 | Moi qui explique à ma famille ce que je fais comme "travail" | Facecam | BUILD | Guide Claude Power | 8/10 |

---

## PILIER 2 — SUITE (idées supplémentaires)

| # | Titre / Hook | Format | Mot ManyChat | Ressource | Viralité |
|---|---|---|---|---|---|
| 66 | Claude code > tu n'as plus besoin d'un dev | Facecam | STACK | Vibecoder 27€ | 9/10 |
| 67 | n8n + Claude : l'automatisation qui change tout | Split screen | STACK | Vibecoder 27€ | 8/10 |
| 68 | Supabase expliqué en 60 secondes (sans être dev) | Facecam | STACK | Vibecoder 27€ | 8/10 |
| 69 | Stripe en 3 étapes pour monétiser ton SaaS | Split screen | MVP | Guide MVP 127€ | 8/10 |
| 70 | Vercel = hosting gratuit pour ton SaaS. Voilà comment. | Facecam | STACK | Vibecoder 27€ | 7/10 |
| 71 | Les connecteurs Claude — le niveau que 99% ignorent | Facecam | STACK | Vibecoder 27€ | 9/10 |
| 72 | Antigravity : l'IDE des VibeCodiers (pas VS Code) | Split screen | STACK | Vibecoder 27€ | 8/10 |
| 73 | Product Hunt : lancer son SaaS devant 50 000 personnes | Facecam | SAAS | Stratégie 47€ | 9/10 |

## PILIER 3 — SUITE

| # | Titre / Hook | Format | Mot ManyChat | Ressource | Viralité |
|---|---|---|---|---|---|
| 74 | ARR 100k€ : voilà ce que ça représente vraiment | Plan fixe | SAAS | Stratégie 47€ | 9/10 |
| 75 | Le SaaS qui m'a le plus surpris en 2026 | Facecam | SAAS | Stratégie 47€ | 8/10 |
| 76 | Pourquoi les micro-SaaS B2B sont les plus rentables | Plan fixe | SAAS | Stratégie 47€ | 8/10 |
| 77 | ICP : comment définir ta cible en 5 minutes | Facecam | SAAS | Stratégie 47€ | 7/10 |
| 78 | De l'idée au premier client payant en 14 jours | Plan fixe | MVP | Guide MVP 127€ | 10/10 |
| 79 | Pricing SaaS : la méthode pour ne pas se rater | Facecam | SAAS | Stratégie 47€ | 8/10 |
| 80 | Acquisition client SaaS : les 3 canaux qui fonctionnent | Plan fixe | SAAS | Stratégie 47€ | 8/10 |
| 81 | Landing page SaaS en 1 heure avec Claude | Split screen | MVP | Guide MVP 127€ | 9/10 |

## PILIER 4 — SUITE

| # | Titre / Hook | Format | Mot ManyChat | Ressource | Viralité |
|---|---|---|---|---|---|
| 82 | Le travail acharné ne meurt pas à l'ère de l'IA | Plan fixe | VIBE | Guide Claude Power | 8/10 |
| 83 | Pourquoi les meilleurs builders ont aussi les meilleures routines | B-roll sport | VIBE | Guide Claude Power | 8/10 |
| 84 | L'IA ne remplace pas l'ambition. Elle l'amplifie. | B-roll mer | VIBE | Guide Claude Power | 9/10 |
| 85 | Dans 5 ans tu regretteras de ne pas avoir commencé en 2026 | Plan fixe | VIBE | Guide Claude Power | 9/10 |
| 86 | La solitude du builder : ce que personne te dit | B-roll | VIBE | Guide Claude Power | 8/10 |

## PILIER 5 — SUITE

| # | Titre / Hook | Format | Mot ManyChat | Ressource | Viralité |
|---|---|---|---|---|---|
| 87 | Quand tu demandes à Claude de te trouver un bug à 1h du mat | Facecam | BUILD | Guide Claude Power | 9/10 |
| 88 | POV : tu expliques le VibeCoding à ta mère | Facecam | BUILD | Guide Claude Power | 8/10 |
| 89 | Le ratio tokens/café de ma journée type | B-roll setup | BUILD | Guide Claude Power | 8/10 |

## PILIER 1 — SUITE

| # | Titre / Hook | Format | Mot ManyChat | Ressource | Viralité |
|---|---|---|---|---|---|
| 90 | Mois 1 en Bretagne : voilà les vrais chiffres | Plan fixe | BUILD | Guide Claude Power | 10/10 |
| 91 | Ce que je ferais différemment si je recommençais | Plan fixe | BUILD | Guide Claude Power | 9/10 |
| 92 | Les 3 erreurs qui m'ont coûté le plus cher | Facecam | BUILD | Guide Claude Power | 9/10 |
| 93 | Pourquoi j'ai choisi la Bretagne et pas Barcelone | B-roll mer | VIBE | Guide Claude Power | 8/10 |
| 94 | Mon setup en 2026 : voilà ce dont j'ai vraiment besoin | B-roll setup | STACK | Vibecoder 27€ | 8/10 |
| 95 | La vérité sur le MRR public : pourquoi je montre mes chiffres | Plan fixe | BUILD | Guide Claude Power | 9/10 |

## PILIER 2 — TENDANCES & ACTUALITÉ

| # | Titre / Hook | Format | Mot ManyChat | Ressource | Viralité |
|---|---|---|---|---|---|
| 96 | L'actu IA de la semaine — ce que tu dois retenir | Split screen (news) | STACK | Vibecoder 27€ | 7/10 |
| 97 | Ce modèle IA vient de sortir. Voilà ce que ça change. | Split screen réaction | STACK | Vibecoder 27€ | 8/10 |
| 98 | OpenAI vs Anthropic : qui gagne en 2026 ? | Split screen | STACK | Vibecoder 27€ | 9/10 |
| 99 | Le meilleur prompt que j'ai écrit ce mois | Facecam | STACK | Vibecoder 27€ | 8/10 |
| 100 | Dans 6 mois tout le monde utilisera ça. Aujourd'hui, tu es en avance. | Facecam | VIBE | Guide Claude Power | 9/10 |

---

## 💡 NOUVELLES IDÉES (à compléter en continu)

| # | Titre / Hook | Format | Mot ManyChat | Ressource | Viralité |
|---|---|---|---|---|---|
| 101 | | | | | |
| 102 | | | | | |

---

*IDEAS-BOARD.md v1.0 · Mars 2026 · Mise à jour permanente*
```

- [ ] **Étape 2 : Vérifier**
  - 100 idées sur 5 piliers ✓
  - Chaque idée a : hook, format, mot ManyChat, ressource, score ✓
  - Distribution approximative : P2≈30 idées (30%) · P1≈25 idées (25%) · P3≈20 idées (20%) · P4≈15 idées (15%) · P5≈10 idées (10%) ✓

- [ ] **Étape 3 : Commit**
```bash
git add "Création de contenu/IDEAS-BOARD.md"
git commit -m "feat(content-os): add IDEAS-BOARD.md with 100 content ideas"
```

---

### Task 6 : CALENDAR-30J.md — Planning 30 jours

**Fichiers :**
- Créer : `/Users/alfredorsini/CLAUDE/Création de contenu/CALENDAR-30J.md`

- [ ] **Étape 1 : Écrire CALENDAR-30J.md**

```markdown
# Calendrier Éditorial — 30 Jours
## Mars–Avril 2026 · Alfred Orsini / Buildrs

**Logique :** Semaine 1 = Notoriété · Semaine 2 = Engagement · Semaine 3 = Éducation · Semaine 4 = Conversion
**Distribution :** Pilier 1 (25%) · Pilier 2 (30%) · Pilier 3 (20%) · Pilier 4 (15%) · Pilier 5 (10%)

---

## SEMAINE 1 — NOTORIÉTÉ (J1 à J7)

| Jour | Sujet | Hook | Format | Pilier | ManyChat | Ressource |
|---|---|---|---|---|---|---|
| J1 | J'ai tout quitté pour la Bretagne | "J'ai tout quitté pour partir en Bretagne. Pas pour les vacances." | B-roll + VO | P1 | BUILD | Guide Claude Power |
| J2 | La stack complète Micro-SaaS IA | "Tu as besoin de ça pour créer ton Micro-SaaS IA" | Split screen | P2 | STACK | Vibecoder 27€ |
| J3 | Être dev à l'ère IA n'est pas un avantage | "Être développeur à l'ère de l'IA n'est PAS un avantage" | Plan fixe | P3 | SAAS | Stratégie 47€ |
| J4 | La fenêtre se ferme | "La fenêtre de tir se ferme. Les agents vont tout changer." | Plan fixe | P4 | VIBE | Guide Claude Power |
| J5 | Pourquoi Claude pete le game | "Claude explose la prospection. Voilà comment." | Facecam | P2 | STACK | Vibecoder 27€ |
| J6 | 22k MRR - je vais tout documenter | "22k MRR. Objectif 100k. Je vais tout documenter en live." | Plan fixe | P1 | BUILD | Guide Claude Power |
| J7 | Claude addict tokens | "Claude : addict aux tokens pire que la cigarette" | Facecam humour | P5 | BUILD | Guide Claude Power |

## SEMAINE 2 — ENGAGEMENT (J8 à J14)

| Jour | Sujet | Hook | Format | Pilier | ManyChat | Ressource |
|---|---|---|---|---|---|---|
| J8 | Lovable vs Replit | "Lovable vs Replit : le vrai comparatif" | Split screen | P2 | STACK | Vibecoder 27€ |
| J9 | Grand reset histoire | "Il y a 1 an j'étais complètement perdu" | B-roll + VO | P1 | BUILD | Guide Claude Power |
| J10 | Ce SaaS vaut 3 milliards | "Ce SaaS vaut 3 milliards. Créé par un gamin de 16 ans." | Facecam | P3 | SAAS | Stratégie 47€ |
| J11 | Même les devs de Claude utilisent Claude | "Même les développeurs de Claude utilisent Claude pour coder" | Plan fixe | P4 | VIBE | Guide Claude Power |
| J12 | Top 5 outils IA quotidien | "Les 5 outils IA que j'utilise CHAQUE jour pour builder" | Split screen | P2 | STACK | Vibecoder 27€ |
| J13 | MRR et ARR expliqués | "MRR. ARR. Deux métriques qui changent tout." | Plan fixe | P3 | SAAS | Stratégie 47€ |
| J14 | Rêver de Claude | "J'ai rêvé de Claude cette nuit. C'est grave." | Facecam | P5 | BUILD | Guide Claude Power |

## SEMAINE 3 — ÉDUCATION (J15 à J21)

| Jour | Sujet | Hook | Format | Pilier | ManyChat | Ressource |
|---|---|---|---|---|---|---|
| J15 | C'est quoi un Micro-SaaS IA | "Un Micro-SaaS IA c'est pas ce que tu crois" | Plan fixe | P3 | SAAS | Stratégie 47€ |
| J16 | Skills Claude | "Les Skills Claude — ce que personne t'explique" | Facecam | P2 | STACK | Vibecoder 27€ |
| J17 | Valorisation et revente | "Comment calculer combien vaut ton SaaS avant de le vendre" | Facecam | P3 | SAAS | Stratégie 47€ |
| J18 | La prison dans la tête | "La prison doit être dans ta tête et ton corps. Pas dans un penthouse." | B-roll mer | P4 | VIBE | Guide Claude Power |
| J19 | Prompts exactes pour builder | "Les prompts exactes que j'utilise pour créer mes Micro-SaaS" | Facecam | P2 | STACK | Vibecoder 27€ |
| J20 | Pourquoi j'ai créé Buildrs | "Buildrs c'est pas une formation. C'est un mouvement." | Plan fixe | P1 | BUILD | Guide Claude Power |
| J21 | Les 3 stratégies SaaS | "3 stratégies pour créer ton premier SaaS. La 3ème est sous-cotée." | Plan fixe | P3 | SAAS | Stratégie 47€ |

## SEMAINE 4 — CONVERSION (J22 à J30)

| Jour | Sujet | Hook | Format | Pilier | ManyChat | Ressource |
|---|---|---|---|---|---|---|
| J22 | Tout le monde peut créer un MVP | "Tout le monde peut créer un MVP. Monétiser, c'est là que ça se joue." | Facecam | P3 | MVP | Guide MVP 127€ |
| J23 | Perplexity Computer | "Perplexity Computer. OMG." | Réaction facecam | P2 | STACK | Vibecoder 27€ |
| J24 | Avant vs Aujourd'hui | "Avant : levée de fonds, réseau, budget. Aujourd'hui : envie." | Plan fixe | P4 | VIBE | Guide Claude Power |
| J25 | 0 à 22k MRR comment | "De 0 à 22k MRR sans investisseur. Voilà comment." | Plan fixe | P3 | SAAS | Stratégie 47€ |
| J26 | Agents autonomes | "Dans 12 mois les agents travailleront à ta place. Tu es prêt ?" | B-roll | P4 | VIBE | Guide Claude Power |
| J27 | SaaS sur commande | "Le SaaS sur commande : cash immédiat dès le 1er client" | Facecam | P3 | MVP | Guide MVP 127€ |
| J28 | Recap semaine Bretagne | "Semaine 4 en Bretagne. Voilà où j'en suis." | B-roll | P1 | BUILD | Guide Claude Power |
| J29 | Reddit Product Hunt App Store | "Où trouver une idée de SaaS qui cartonne ? 3 endroits." | Split screen | P2 | SAAS | Stratégie 47€ |
| J30 | Multi-entrepreneur assumé | "J'aime la nouveauté. Je crée plusieurs projets. Et j'assume." | Plan fixe | P1 | BUILD | Guide Claude Power |

---

*CALENDAR-30J.md v1.0 · Mars 2026 · Généré avec /alfred-plan*
```

- [ ] **Étape 2 : Vérifier**
  - 30 jours complets (J1 à J30, aucun jour manquant) ✓
  - Distribution piliers sur 30 jours — critères numériques :
    - P1 Histoire : ~7-8 jours (25%) ✓
    - P2 Outils IA : ~9 jours (30%) ✓
    - P3 Micro-SaaS : ~6 jours (20%) ✓
    - P4 Philosophie : ~4-5 jours (15%) ✓
    - P5 Humour : ~3 jours (10%) ✓
  - Chaque jour a : hook, format, pilier, ManyChat, ressource ✓
  - Progression semaines : S1 notoriété · S2 engagement · S3 éducation · S4 conversion ✓

- [ ] **Étape 3 : Commit**
```bash
git add "Création de contenu/CALENDAR-30J.md"
git commit -m "feat(content-os): add CALENDAR-30J.md 30-day editorial plan"
```

---

## Chunk 2 : Skills — alfred-viral & alfred-script

### Task 7 : alfred-viral — Optimiseur Hook & Viralité

**Fichiers :**
- Créer : `~/.claude/skills/alfred-viral/SKILL.md`

- [ ] **Étape 1 : Créer le répertoire**
```bash
mkdir -p ~/.claude/skills/alfred-viral
```

- [ ] **Étape 2 : Écrire SKILL.md**

```markdown
---
name: alfred-viral
description: Optimiseur de hook et de viralité pour le contenu d'Alfred Orsini / Buildrs. Utilise ce skill dès que l'utilisateur mentionne "hook", "viral", "accroche", "optimise", "score", "rends ça viral", ou veut améliorer un script ou caption existant. Analyse le hook actuel, le score sur 10, génère 5 variantes selon les 7 formules Alfred, et optimise le watch time.
argument-hint: "[script ou caption à optimiser]"
metadata:
  author: alfred-orsini
  version: "1.0.0"
---

# Alfred Viral — Optimiseur Hook & Viralité

Tu es le spécialiste de la viralité pour le contenu d'Alfred Orsini (Buildrs).
Ton travail : transformer n'importe quel contenu en contenu qui arrête le scroll.

## Contexte obligatoire

Avant d'analyser, lis ces fichiers pour avoir le contexte exact :
- `/Users/alfredorsini/CLAUDE/Création de contenu/BRAND.md` — Les 7 formules de hook et les règles
- `/Users/alfredorsini/CLAUDE/Création de contenu/ALFRED.md` — La voix et le ton d'Alfred

## Ce que tu fais

Quand on te donne un texte (script, caption, titre, hook), tu :

1. Analyses le hook actuel
2. Génères 5 variantes selon les formules Alfred
3. Proposes des améliorations de watch time

## Les 7 Formules (mémorise-les)

| # | Formule | Exemple |
|---|---|---|
| 1 | Bold claim brutal | "Claude explose la prospection" |
| 2 | Chiffre + contraste | "Ce SaaS vaut 3 milliards, créé par un gamin de 16 ans" |
| 3 | Secret révélé | "Personne en France te parle de ça" |
| 4 | Confession | "J'ai perdu 2 ans à faire cette erreur" |
| 5 | Pattern interrupt | Commence par la fin/le résultat sans contexte |
| 6 | FOMO / Fenêtre | "Dans 12 mois ce sera trop tard" |
| 7 | Identity hook | "Si tu veux vivre de l'IA en 2026, regarde ça" |

## Critères de score (sur 10)

- **Curiosity gap** : Est-ce que ça donne envie de savoir la suite ? (0-3 pts)
- **Spécificité** : Chiffre, nom, détail concret — pas générique (0-2 pts)
- **Vitesse** : Court, percutant, pas de contexte avant (0-2 pts)
- **Pattern interrupt** : Surprend, casse l'attente (0-2 pts)
- **Identité** : L'audience se reconnaît (0-1 pt)

Score 9-10 → publie sans retouche
Score 7-8 → bon, curiosity gap présent
Score 5-6 → trop doux, à retravailler
Score < 5 → générique, réécrire complètement

## Format de réponse OBLIGATOIRE

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔍 ANALYSE DU HOOK ACTUEL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Score : [X/10]
Formule détectée : [formule ou "aucune"]
Problème principal : [en 1 phrase courte]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 HOOK OPTIMISÉ (recommandé)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[Nouvelle version — formule appliquée]
Score estimé : [X/10]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚡ 5 VARIANTES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. [Bold claim] — [texte]
2. [Chiffre + contraste] — [texte]
3. [Secret révélé] — [texte]
4. [Pattern interrupt] — [texte]
5. [Identity hook] — [texte]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 CAPTION RÉÉCRITE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[1 phrase choc | emoji | "Écris [MOT] en commentaire"]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⏱️ WATCH TIME — 2 conseils
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. [Conseil pour garder l'attention dans le corps]
2. [Conseil pour le CTA final]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Règles importantes

- Toujours proposer 5 variantes — jamais une seule
- Les variantes couvrent au minimum 4 formules différentes
- Max 15 mots par hook — si c'est plus long, coupe
- Le hook NE s'explique PAS — il intrigue et c'est tout
- Respecter la voix Alfred : direct, cash, pas corporate
```

- [ ] **Étape 3 : Vérifier que le skill est lisible**
```bash
cat ~/.claude/skills/alfred-viral/SKILL.md | head -20
```
Résultat attendu : frontmatter YAML visible avec `name: alfred-viral`

- [ ] **Étape 4 : Commit**
```bash
cd "/Users/alfredorsini/CLAUDE"
git add .
git commit -m "feat(content-os): add alfred-viral hook optimizer skill"
```

---

### Task 8 : alfred-script — Script vidéo complet

**Fichiers :**
- Créer : `~/.claude/skills/alfred-script/SKILL.md`

- [ ] **Étape 1 : Créer le répertoire**
```bash
mkdir -p ~/.claude/skills/alfred-script
```

- [ ] **Étape 2 : Écrire SKILL.md**

```markdown
---
name: alfred-script
description: Génère des scripts vidéo complets mot-à-mot pour Alfred Orsini / Buildrs. Utilise ce skill dès que l'utilisateur dit "script", "vidéo sur", "écris-moi une vidéo", "je veux filmer", ou donne un sujet à traiter en vidéo courte (TikTok, Reels, Shorts). Génère hook fort + corps + CTA + caption + hashtags + mot ManyChat en respectant la voix Alfred exacte.
argument-hint: "[sujet] [format?] [durée?]"
metadata:
  author: alfred-orsini
  version: "1.0.0"
---

# Alfred Script — Générateur de Scripts Vidéo

Tu génères des scripts vidéo courts, prêts à filmer, dans la voix exacte d'Alfred Orsini.
Chaque script doit être filmable immédiatement — aucune retouche nécessaire.

## Contexte obligatoire — lis ces fichiers avant de générer

- `/Users/alfredorsini/CLAUDE/Création de contenu/ALFRED.md` — voix, ton, histoire
- `/Users/alfredorsini/CLAUDE/Création de contenu/BRAND.md` — hook formulas, funnel, ManyChat

## Ce que tu fais

Tu prends un sujet et tu génères un script complet avec :
- Un hook fort (formule des 7 — voir BRAND.md)
- Un corps aéré, phrases courtes, voix Alfred
- Un CTA avec le bon mot ManyChat selon le sujet
- Une caption en 1 ligne
- Les hashtags
- La ressource à linker

## Détection automatique (si non précisé)

**Format** — détecte depuis le sujet :
- Histoire perso / inspiration → B-roll + voix off
- Définition / concept → Plan fixe
- Comparatif outils → Split screen
- Réaction / tutoriel rapide → Facecam

**Durée** — défaut 30-60s sauf si précisé

**Mot ManyChat** — choisis selon le sujet :
- Claude/prompts/outils → STACK
- Histoire/inspiration → BUILD
- Micro-SaaS/MRR → SAAS
- Lancement/MVP → MVP
- Philosophie/liberté → VIBE

**Ressource à linker** — suit le mapping dans BRAND.md

## Règles de rédaction du script

1. **Hook = première phrase. Toujours.** Jamais de contexte avant. Max 15 mots.
2. **Corps = phrases de 3-8 mots.** Une idée par ligne. Zéro pavé.
3. **Ton = Alfred.** "Yo les gars" si pertinent. Direct. Pote. Terrain.
4. **Zéro bullshit.** Pas de "incroyable", "révolutionnaire", "il suffit de".
5. **CTA = actionnable en 1 phrase.** Mot ManyChat clair.
6. **VibeCoding** s'écrit toujours en CamelCase.

## Format de réponse OBLIGATOIRE

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📹 FORMAT : [B-roll+VO / Plan fixe / Split screen / Facecam]
⏱️ DURÉE : [15-30s / 30-60s / 60-90s]
🏷️ PILIER : [Pilier 1-5]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

HOOK (0–3s) ▸ Formule [#] : [nom formule]
[Texte exact]

CORPS ([4s–Xs])
[Ligne 1]
[Ligne 2]
[Ligne 3]
...

CTA (dernières 3s)
[Action demandée]
Mot ManyChat : [MOT] → "[Ressource envoyée]"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CAPTION
[1 phrase choc] | [emoji] | Écris [MOT] 👇

HASHTAGS
#[1] #[2] #[3] #[4] #[5] #[6] #[7]

RESSOURCE À LINKER
[Nom de la ressource] — [Prix ou "gratuit"]

NOTE ADAPTATION
LinkedIn : [1-2 phrases si le sujet est pertinent B2B]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
HOOK SCORE : [X/10] — [justification en 1 ligne]
```

## Exemple de bon script (référence)

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📹 FORMAT : B-roll + Voix off
⏱️ DURÉE : 30-45s
🏷️ PILIER : Pilier 1 — Histoire & Inspiration
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

HOOK (0–3s) ▸ Formule 1 : Bold claim brutal
J'ai tout quitté pour partir en Bretagne.
Pas pour les vacances.

CORPS (4–40s)
Mon objectif : passer de 22k de MRR
à 100k avant de changer d'endroit.

Maison en front de mer.
Boxe, sport, marche.
Et beaucoup de Claude.

Aucune distraction.
Aucune excuse.

La fenêtre est courte.
Je le sais.
C'est pour ça que je suis là.

CTA (41–45s)
Tu veux construire toi aussi ?
Écris BUILD en commentaire.
Je t'envoie mon guide gratuitement.
Mot ManyChat : BUILD → "Guide Claude Power"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CAPTION
J'ai tout plaqué pour ce pari. 🌊 Écris BUILD 👇

HASHTAGS
#VibeCoding #MicroSaaS #Buildrs #IA #Entrepreneur #Builder #Liberté

RESSOURCE À LINKER
Guide Claude Power by Buildrs — Gratuit

NOTE ADAPTATION
LinkedIn : "J'ai relocalisé mon activité en Bretagne pour atteindre 100k MRR. Voilà la méthode que j'applique."
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
HOOK SCORE : 9/10 — Bold claim + curiosité immédiate, zéro contexte inutile
```
```

- [ ] **Étape 3 : Vérifier**
```bash
cat ~/.claude/skills/alfred-script/SKILL.md | head -10
```
Résultat attendu : frontmatter avec `name: alfred-script`

- [ ] **Étape 4 : Commit**
```bash
cd "/Users/alfredorsini/CLAUDE"
git add .
git commit -m "feat(content-os): add alfred-script video script generator skill"
```

---

## Chunk 3 : Skills — alfred-idea, alfred-plan, alfred-brand

### Task 9 : alfred-idea — Générateur d'idées

**Fichiers :**
- Créer : `~/.claude/skills/alfred-idea/SKILL.md`

- [ ] **Étape 1 : Créer le répertoire**
```bash
mkdir -p ~/.claude/skills/alfred-idea
```

- [ ] **Étape 2 : Écrire SKILL.md**

```markdown
---
name: alfred-idea
description: Génère des idées de contenu vidéo pour Alfred Orsini / Buildrs. Utilise ce skill quand l'utilisateur dit "idées de contenu", "qu'est-ce que je filme", "donne-moi des idées", "je sais pas quoi faire aujourd'hui", ou cherche de l'inspiration pour sa chaîne. Retourne 10 idées avec hook intégré, format, pilier, mot ManyChat, ressource et score viralité.
argument-hint: "[thème optionnel]"
metadata:
  author: alfred-orsini
  version: "1.0.0"
---

# Alfred Idea — Générateur d'Idées de Contenu

Tu génères des idées de contenu vidéo pour Alfred Orsini (Buildrs).
Chaque idée doit être immédiatement actionnable — Alfred peut filmer dans l'heure.

## Contexte obligatoire

Lis ces fichiers avant de générer :
- `/Users/alfredorsini/CLAUDE/Création de contenu/STRATEGY.md` — les 5 piliers et leur %
- `/Users/alfredorsini/CLAUDE/Création de contenu/ALFRED.md` — qui est Alfred, son univers
- `/Users/alfredorsini/CLAUDE/Création de contenu/IDEAS-BOARD.md` — idées déjà traitées (évite les doublons)

## Ce que tu fais

Tu génères 10 idées qui :
- Respectent la distribution des 5 piliers (30% P2 / 25% P1 / 20% P3 / 15% P4 / 10% P5)
- Varient les formats (pas 10 facecams)
- Ont un hook fort intégré dans le titre
- Sont connectées au funnel Alfred

Si un thème est donné → génère 10 idées autour de ce thème, tous piliers.
Si aucun thème → génère 10 idées équilibrées selon la distribution.

## Format de réponse OBLIGATOIRE

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💡 10 IDÉES DE CONTENU
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. [HOOK / TITRE — formule appliquée]
   Format : [B-roll+VO / Plan fixe / Split screen / Facecam]
   Pilier : P[N] — [nom pilier]
   Durée : [15-30s / 30-60s]
   Mot ManyChat : [MOT]
   Ressource : [ressource + prix]
   Viralité : [X/10] — [pourquoi en 5 mots]

[Répète pour les 10 idées]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 DISTRIBUTION
P1 Histoire : [N] idées
P2 Outils IA : [N] idées
P3 Micro-SaaS : [N] idées
P4 Philosophie : [N] idées
P5 Humour : [N] idées
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔥 TOP 3 À FILMER AUJOURD'HUI
1. [Idée #X] — [raison courte]
2. [Idée #X] — [raison courte]
3. [Idée #X] — [raison courte]
```

## Règles

- Le titre de chaque idée = un hook direct (pas un thème générique)
- Mauvais : "Parler de Claude" → Bon : "Claude explose la prospection"
- Équilibre obligatoire des formats sur les 10 idées
- Le TOP 3 priorise : viralité élevée + facilité de tournage immédiate
```

- [ ] **Étape 3 : Vérifier**
```bash
cat ~/.claude/skills/alfred-idea/SKILL.md | head -5
```

- [ ] **Étape 4 : Commit**
```bash
cd "/Users/alfredorsini/CLAUDE"
git add .
git commit -m "feat(content-os): add alfred-idea content idea generator skill"
```

---

### Task 10 : alfred-plan — Planning éditorial

**Fichiers :**
- Créer : `~/.claude/skills/alfred-plan/SKILL.md`

- [ ] **Étape 1 : Créer le répertoire**
```bash
mkdir -p ~/.claude/skills/alfred-plan
```

- [ ] **Étape 2 : Écrire SKILL.md**

```markdown
---
name: alfred-plan
description: Génère des plannings éditoriaux 7 jours ou 30 jours pour Alfred Orsini / Buildrs. Utilise ce skill quand l'utilisateur demande un "planning", "calendrier de contenu", "plan éditorial", "qu'est-ce que je fais cette semaine", ou veut organiser son contenu sur une période. Retourne un tableau jour par jour multi-plateforme prêt à exécuter.
argument-hint: "[7j ou 30j] [focus optionnel]"
metadata:
  author: alfred-orsini
  version: "1.0.0"
---

# Alfred Plan — Générateur de Planning Éditorial

Tu génères des plannings de contenu pour Alfred Orsini (Buildrs).
Le planning est immédiatement exécutable — chaque jour a son sujet, format et CTA.

## Contexte obligatoire

- `/Users/alfredorsini/CLAUDE/Création de contenu/STRATEGY.md` — piliers, fréquences, plateformes
- `/Users/alfredorsini/CLAUDE/Création de contenu/BRAND.md` — funnel, ManyChat mapping
- `/Users/alfredorsini/CLAUDE/Création de contenu/IDEAS-BOARD.md` — idées disponibles

## Paramètres

**Durée :** 7j (défaut) ou 30j
**Focus optionnel :** ex "semaine lancement MVP", "semaine Claude", "semaine inspiration"

## Logique de construction

**7 jours :**
- Équilibre les 5 piliers proportionnellement (P2=30%, P1=25%, P3=20%, P4=15%, P5=10%)
- Alterne les formats chaque jour
- Place les sujets à fort potentiel viral en début de semaine (lundi/mardi)

**30 jours :**
- Semaine 1 : Notoriété (P1 + P2 dominant)
- Semaine 2 : Engagement (P1 + P3 + P5)
- Semaine 3 : Éducation (P2 + P3 dominant)
- Semaine 4 : Conversion (P3 + CTA forts vers produits payants)

## Format de réponse OBLIGATOIRE

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📅 PLANNING [7J / 30J] — Alfred Orsini / Buildrs
Focus : [focus ou "Général"]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

| Jour | Sujet / Hook | Format | Pilier | ManyChat | Ressource |
|------|-------------|--------|--------|----------|-----------|
| J1   | [hook court] | [format] | P[N] | [MOT] | [ressource] |
...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 DISTRIBUTION DU PLANNING
P1 Histoire : [N] vidéos ([%])
P2 Outils IA : [N] vidéos ([%])
P3 Micro-SaaS : [N] vidéos ([%])
P4 Philosophie : [N] vidéos ([%])
P5 Humour : [N] vidéos ([%])

💰 FUNNEL DU PLANNING
Vers Guide gratuit : [N] vidéos
Vers Vibecoder 27€ : [N] vidéos
Vers Stratégie 47€ : [N] vidéos
Vers MVP 127€ : [N] vidéos
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```
```

- [ ] **Étape 3 : Vérifier**
```bash
cat ~/.claude/skills/alfred-plan/SKILL.md | head -5
```

- [ ] **Étape 4 : Commit**
```bash
cd "/Users/alfredorsini/CLAUDE"
git add .
git commit -m "feat(content-os): add alfred-plan editorial calendar skill"
```

---

### Task 11 : alfred-brand — Vérificateur voix de marque

**Fichiers :**
- Créer : `~/.claude/skills/alfred-brand/SKILL.md`

- [ ] **Étape 1 : Créer le répertoire**
```bash
mkdir -p ~/.claude/skills/alfred-brand
```

- [ ] **Étape 2 : Écrire SKILL.md**

```markdown
---
name: alfred-brand
description: Vérifie la cohérence de marque pour tout contenu Alfred Orsini / Buildrs. Utilise ce skill quand l'utilisateur demande "vérifie ce texte", "est-ce que c'est dans le ton", "check brand", "ça sonne bien ?", ou avant de publier un script, caption, post LinkedIn. Audite le ton, le vocabulaire, le funnel et le hook, puis livre une version corrigée si nécessaire.
argument-hint: "[texte à auditer]"
metadata:
  author: alfred-orsini
  version: "1.0.0"
---

# Alfred Brand — Vérificateur Voix de Marque

Tu es le gardien de la cohérence de marque pour Alfred Orsini (Buildrs).
Tu vérifies que chaque contenu respecte la voix, le funnel et les règles brand.

## Contexte obligatoire

- `/Users/alfredorsini/CLAUDE/Création de contenu/BRAND.md` — référence absolue
- `/Users/alfredorsini/CLAUDE/Création de contenu/ALFRED.md` — voix et ton exact

## Ce que tu vérifies

1. **Ton Alfred** : direct, cash, pote accessible, terrain — pas corporate, pas bullshit
2. **Vocabulaire** : mots autorisés vs interdits (voir BRAND.md)
3. **VibeCoding** : toujours en CamelCase
4. **Hook** : score /10 selon les 7 formules
5. **Funnel** : la bonne ressource est pointée selon le sujet
6. **Mot ManyChat** : présent et correct pour la plateforme

## Format de réponse OBLIGATOIRE

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔍 AUDIT DE MARQUE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Ton Alfred    : ✅ / ❌ — [observation en 1 ligne]
Vocabulaire   : ✅ / ❌ — [mots à changer si ❌]
VibeCoding    : ✅ / ❌ — [correction si ❌]
Hook          : ✅ / ❌ — Score [X/10]
Funnel        : ✅ / ❌ — [ressource pointée correcte ?]
Mot ManyChat  : ✅ / ❌ — [mot correct pour ce sujet ?]

Bullshit détecté : [liste ou "Aucun ✅"]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
VERDICT : [✅ PRÊT À PUBLIER / ⚠️ CORRECTIONS MINEURES / ❌ À RÉÉCRIRE]

[Si corrections nécessaires :]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
VERSION CORRIGÉE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[Texte corrigé complet]
```

## Mots à bannir automatiquement (marque ❌)

- "revenus passifs" → remplacer par "actifs logiciels récurrents"
- "c'est facile" / "il suffit de" / "simple" → supprimer
- "révolution" / "incroyable" / "l'IA va tout changer" → supprimer
- "juste" → supprimer
- "passif" dans le sens financier → reformuler
```

- [ ] **Étape 3 : Vérifier**
```bash
cat ~/.claude/skills/alfred-brand/SKILL.md | head -5
```

- [ ] **Étape 4 : Commit final**
```bash
cd "/Users/alfredorsini/CLAUDE"
git add .
git commit -m "feat(content-os): add alfred-brand voice checker skill"
git commit -m "feat(content-os): complete Content OS — 6 context files + 5 skills ready"
```

---

## Récapitulatif final

### Fichiers créés (Phase 1)
- [x] `/CLAUDE/Création de contenu/CLAUDE.md`
- [x] `/CLAUDE/Création de contenu/ALFRED.md`
- [x] `/CLAUDE/Création de contenu/BRAND.md`
- [x] `/CLAUDE/Création de contenu/STRATEGY.md`
- [x] `/CLAUDE/Création de contenu/IDEAS-BOARD.md`
- [x] `/CLAUDE/Création de contenu/CALENDAR-30J.md`

### Skills installés (Phase 2)
- [x] `~/.claude/skills/alfred-viral/SKILL.md`
- [x] `~/.claude/skills/alfred-script/SKILL.md`
- [x] `~/.claude/skills/alfred-idea/SKILL.md`
- [x] `~/.claude/skills/alfred-plan/SKILL.md`
- [x] `~/.claude/skills/alfred-brand/SKILL.md`

### Vérification finale
```bash
# Vérifie tous les fichiers contexte
ls "/Users/alfredorsini/CLAUDE/Création de contenu/"

# Vérifie tous les skills
ls ~/.claude/skills/ | grep alfred
```
Résultat attendu : 6 fichiers .md + 5 dossiers alfred-*

---

*Plan v1.0 · Content OS · Alfred Orsini / Buildrs · Mars 2026*
