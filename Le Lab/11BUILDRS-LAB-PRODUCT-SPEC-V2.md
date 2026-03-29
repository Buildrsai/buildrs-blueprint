# ══════════════════════════════════════════════════════════════
# BUILDRS LAB — DOCUMENT PRODUIT V2
# Le parcours utilisateur complet, écran par écran
# Ce document remplace et complète le Doc Maître V1
# ══════════════════════════════════════════════════════════════

# CONFIDENTIEL — PROPRIÉTÉ INTELLECTUELLE BUILDRS

---

# PRINCIPE FONDAMENTAL

Le Lab n'est PAS un guide à lire. C'est une MACHINE qui fait le travail.

Laforet.dev dit : "Voici un template CLAUDE.md, copie-le."
Le Lab dit : "Ton CLAUDE.md est prêt. Télécharge-le."

Laforet.dev dit : "Voici comment valider ton idée."
Le Lab dit : "Ton idée a un score de 87/100. Voici les sources."

Laforet.dev dit : "Voici un prompt, colle-le dans Claude Code."
Le Lab dit : "Ton prompt personnalisé est prêt. Copie-le."

À chaque étape, l'utilisateur clique sur un bouton et le Lab GÉNÈRE.
L'utilisateur n'écrit rien depuis zéro. Il valide, ajuste, avance.

---

# DESIGN

## Mode par défaut : LIGHT
- Le dashboard est BLANC par défaut (style Antigravity/Apple)
- Un toggle Night Mode est disponible (pour ceux qui préfèrent)
- La LP et les pages publiques sont LIGHT uniquement
- Alternance sections blanches / sections dark sur la LP (comme Antigravity)
- Particules/confettis colorées sur le hero

## Référence design : voir le CLAUDE.md pour le design system complet

---

# PARCOURS UTILISATEUR COMPLET

## ═══════════════════════════════════════
## PHASE 0 — INSCRIPTION + PRE-ONBOARDING
## ═══════════════════════════════════════

### 0.1 — Landing Page
- Hero avec particules : "De l'idée au SaaS. Propulsé par Claude."
- Le Finder en démo (l'utilisateur peut tester gratuitement)
- Les 8 phases du Lab présentées visuellement
- Social proof (compteur de builders, SaaS lancés)
- Pricing
- CTA → inscription

### 0.2 — Inscription
- Email + mot de passe OU Google OAuth
- Supabase Auth

### 0.3 — Pré-onboarding (qualification)
Avant d'accéder au Lab, l'utilisateur répond à 6-8 questions.
Le Lab utilise ces réponses pour personnaliser TOUT le parcours.

ÉCRAN : fond blanc, une question par écran, barre de progression en haut.
Ton : "On fait connaissance. Pour que le Lab s'adapte à toi."

**Question 1 — Ton profil**
"Comment tu te définirais ?"
○ Entrepreneur / freelance
○ Salarié qui veut lancer un side-project
○ Étudiant / en reconversion
○ Créateur de contenu / coach
○ Autre : [champ libre]

**Question 2 — Ton objectif**
"Qu'est-ce que tu veux accomplir avec le Lab ?"
○ Créer mon premier SaaS / app
○ Transformer une idée que j'ai déjà en produit
○ Apprendre le VibeCoding et Claude Code
○ Générer un revenu récurrent (MRR)

**Question 3 — Ton niveau technique**
"Quel est ton rapport avec le code ?"
○ Je n'ai jamais codé de ma vie
○ J'ai fait un peu de HTML/CSS ou WordPress
○ Je connais les bases (un peu de JS ou Python)
○ Je suis développeur

**Question 4 — Ton budget**
"Quel budget mensuel tu peux consacrer aux outils ?"
○ 0-20€ (juste l'abo Claude Pro)
○ 20-50€
○ 50-100€
○ 100€+

**Question 5 — Ton idée**
"Tu as déjà une idée de produit ?"
○ Oui, j'ai une idée précise
○ J'ai quelques pistes mais rien de clair
○ Non, je pars de zéro — aide-moi à trouver

**Question 6 — Ton objectif de revenu**
"Combien tu voudrais générer par mois avec ton SaaS ?"
○ 500-1 000€ (revenu complémentaire)
○ 1 000-3 000€ (revenu significatif)
○ 3 000-10 000€ (revenu principal)
○ 10 000€+ (business à scale)

**Question 7 — Ton temps disponible**
"Combien d'heures par semaine tu peux consacrer au Lab ?"
○ 2-5h (side-project)
○ 5-10h (engagement sérieux)
○ 10-20h (full focus)
○ 20h+ (temps plein)

### 0.4 — Écran de bienvenue personnalisé
Basé sur les réponses, le Lab affiche un message personnalisé :

Exemple pour un non-dev avec une idée, 5-10h/semaine, objectif 1-3K€ :
```
Bienvenue dans le Lab, [Prénom].

Ton profil : entrepreneur non-technique avec une idée à concrétiser.
Ton objectif : un SaaS qui génère 1 000-3 000€/mois.
Ton rythme : 5-10h par semaine.

Le Lab va s'adapter à toi. Chaque étape sera calibrée
à ton niveau et à ton temps disponible.

Estimation : tu peux avoir ton premier SaaS en ligne
dans 2-3 semaines à ton rythme.

Prêt ? On commence par valider ton idée.

[Commencer l'aventure →]
```

---

## ═══════════════════════════════════════
## PHASE 1 — TROUVER & VALIDER L'IDÉE
## ═══════════════════════════════════════

### Sidebar
```
Phase 1 — L'idée          ← ACTIF
├── 1.1 Le Finder
├── 1.2 Validation approfondie
└── 1.3 Synthèse & décision
```

### 1.1 — Le Finder (intégré dans le Lab)
Le même Finder que la version publique gratuite, mais ici
les résultats sont liés au projet de l'utilisateur.

L'utilisateur peut :
- Chercher des idées (mode "Trouve-moi une idée")
- Valider son idée existante (mode "Valide mon idée")
- Analyser un concurrent (mode "Copie intelligemment")

Chaque résultat a un bouton : [Choisir cette idée →]
Quand l'utilisateur choisit, l'idée est enregistrée dans son projet.

### 1.2 — Validation approfondie
Une fois l'idée choisie, le Lab génère automatiquement :

**[BOUTON] Générer le rapport de validation**

Le rapport contient :
- Taille du marché estimée (avec sources)
- 5-10 concurrents identifiés (avec liens, pricing, faiblesses)
- Les forums/Reddit où les gens parlent du problème (avec liens)
- Le pricing moyen dans cette niche
- Le profil type de l'utilisateur cible
- Le verdict : GO / À AFFINER / PIVOT
- Si pivot : 2-3 suggestions alternatives

L'utilisateur lit, peut régénérer ("Cherche plus en profondeur"),
ajuster ("Mon audience c'est plutôt des coachs, pas des freelances"),
ou valider.

**Outils recommandés** (encart en sidebar ou en bas)
Le Lab affiche : "Pour aller plus loin dans ta recherche, tu peux aussi
explorer ces plateformes" + liens vers :
- Product Hunt (tendances)
- Reddit (pain points dans ta niche)
- App Store / Chrome Web Store (avis négatifs = opportunités)
- Google Trends (volume de recherche)
- TrustMRR (SaaS avec MRR vérifiés)
- Exploding Topics (tendances émergentes)

### 1.3 — Synthèse & décision
Le Lab affiche un récap :
```
TON IDÉE : [nom de l'idée]
SCORE : 87/100
AUDIENCE : [description]
PROBLÈME : [description]
CONCURRENTS : [liste avec faiblesses]
PRICING ESTIMÉ : [fourchette]

[Valider et passer à l'étape suivante →]
```

---

## ═══════════════════════════════════════
## PHASE 2 — STRUCTURER LE PRODUIT
## ═══════════════════════════════════════

### Sidebar
```
Phase 2 — Structure       ← ACTIF
├── 2.1 Pages & features
├── 2.2 Modèle de données
├── 2.3 Monétisation
└── 2.4 Résumé produit
```

### 2.1 — Pages & features MVP
**[BOUTON] Générer la structure de mon produit**

Le Lab génère (basé sur l'idée validée en Phase 1) :
- La liste des pages nécessaires avec le rôle de chaque page
- Les features MVP (le strict minimum pour valider — PAS 50 features)
- Le parcours utilisateur (comment un client utilise l'app)
- Ce qui est dans le MVP vs ce qui viendra après

L'utilisateur peut :
- Ajouter/supprimer des pages ("Ajoute une page FAQ")
- Modifier une feature ("La feature principale c'est plutôt X")
- Régénérer

### 2.2 — Modèle de données
**[BOUTON] Générer le modèle de données**

Le Lab génère le modèle de données EN LANGAGE SIMPLE :
```
UTILISATEURS
- Nom, email, mot de passe
- Date d'inscription
- Plan (gratuit / payant)

RÉSERVATIONS
- Utilisateur qui a réservé
- Service choisi
- Date et heure
- Statut (en attente / confirmé / annulé)
- Montant payé
```

PAS de SQL. PAS de schéma technique. Du langage humain.
Le Lab convertira automatiquement en schéma Supabase dans la Phase 5.

### 2.3 — Monétisation
**[BOUTON] Générer ma stratégie de monétisation**

L'utilisateur choisit d'abord :
○ Abonnement mensuel (MRR) — recommandé pour la récurrence
○ Paiement unique (one-shot) — plus simple au lancement
○ Freemium (gratuit + premium) — pour l'acquisition
○ Je ne sais pas — recommande-moi

Le Lab génère :
- Le modèle de pricing recommandé (1-3 tiers)
- Le prix de chaque tier (basé sur la concurrence en Phase 1)
- Ce qui est inclus dans chaque tier
- La stratégie de conversion (comment convertir les gratuits en payants)

### 2.4 — Résumé produit
Le Lab compile tout en un résumé :
```
PRODUIT : [nom]
PAGES : [liste]
FEATURES MVP : [liste]
MODÈLE DE DONNÉES : [résumé]
MONÉTISATION : [modèle + pricing]

[Valider et passer au branding →]
```

---

## ═══════════════════════════════════════
## PHASE 3 — BRANDING & DESIGN
## ═══════════════════════════════════════

### Sidebar
```
Phase 3 — Branding        ← ACTIF
├── 3.1 Nom & positionnement
├── 3.2 Direction artistique
└── 3.3 Brand guide
```

### 3.1 — Nom & positionnement
**[BOUTON] Générer des propositions de nom**

Le Lab génère :
- 5 propositions de nom avec :
  - La signification / le pourquoi de ce nom
  - La disponibilité du domaine (.com, .fr, .io)
  - Le nom est-il prononçable et mémorisable ?
- 3 propositions de tagline / baseline
- Le positionnement en 1 phrase ("X pour Y qui veulent Z")

L'utilisateur choisit ou demande d'autres propositions.

### 3.2 — Direction artistique
**[BOUTON] Générer la direction artistique**

Le Lab génère :
- 3 palettes de couleurs (avec logique : "terracotta = chaleur + action")
- 2 paires de typographies (titre + body)
- Le style recommandé (dark/light, minimaliste/bold, glassmorphism/flat)
- 3-5 références visuelles (liens vers des sites/apps du même style)
  Source : Mobbin, Dribbble, sites réels

L'utilisateur choisit sa palette, ses fonts, son style.

### 3.3 — Brand guide
**[BOUTON] Générer ma brand guide**

Le Lab compile les choix en un document téléchargeable :
- Palette de couleurs (hex codes)
- Typographies (avec liens Google Fonts)
- Style des boutons, cards, inputs
- Do's and Don'ts visuels
- Le tout formaté en Markdown (prêt pour le CLAUDE.md)

---

## ═══════════════════════════════════════
## PHASE 4 — KIT CLAUDE CODE
## ═══════════════════════════════════════

C'est la phase qui rend le Lab unique.
Le Lab génère TOUS les fichiers pour Claude Code, personnalisés.

### Sidebar
```
Phase 4 — Kit Claude Code  ← ACTIF
├── 4.1 CLAUDE.md
├── 4.2 Prompts systèmes
├── 4.3 Skills recommandés
├── 4.4 MCP & connecteurs
└── 4.5 Kit complet
```

### 4.1 — Générer mon CLAUDE.md
**[BOUTON] Générer mon CLAUDE.md**

Le Lab génère un CLAUDE.md COMPLET et PERSONNALISÉ basé sur :
- Le projet (Phase 1-2)
- Le branding (Phase 3)
- La stack technique (Supabase + Vercel + Stripe + etc.)
- Les conventions (TypeScript strict, Tailwind only, etc.)
- Les interdits (pas de CSS inline, pas de any, etc.)

Le résultat est affiché dans un bloc de code avec :
- [Copier] — copie dans le presse-papier
- [Télécharger] — télécharge le fichier .md
- [Régénérer] — si l'utilisateur veut ajuster

Ce n'est PAS un template générique. C'est LE CLAUDE.md de SON projet
avec SES couleurs, SON modèle de données, SES conventions.

### 4.2 — Générer mes prompts systèmes
**[BOUTON] Générer mes prompts de build**

Le Lab génère une SÉQUENCE de prompts numérotés :
```
PROMPT 1 — Créer la structure du projet
"Crée un projet React + TypeScript + Tailwind CSS avec la structure
suivante : [structure personnalisée basée sur les pages de la Phase 2].
Configure Tailwind avec les couleurs : [couleurs de la Phase 3]..."

→ Ce que Claude Code va faire : [explication]
→ Ce que tu dois vérifier : [checklist]
→ Problème courant : [et comment le résoudre]

[Copier ce prompt]

─────────────────────────

PROMPT 2 — Créer la landing page
"Crée la landing page du projet [nom] avec un hero section
qui contient [titre + description de la Phase 2].
Design : [style de la Phase 3]. Utilise les composants..."

→ Ce que Claude Code va faire : [explication]
→ Ce que tu dois vérifier : [checklist]
→ Problème courant : [et comment le résoudre]

[Copier ce prompt]

─────────────────────────

PROMPT 3 — Ajouter l'authentification
...

PROMPT 4 — Créer le dashboard principal
...

PROMPT 5 — Intégrer Stripe
...

PROMPT 6 — [Feature spécifique au projet]
...
```

Chaque prompt est :
- Personnalisé au projet (pas générique)
- Accompagné de ce qu'il faut vérifier après
- Accompagné des erreurs courantes et comment les corriger

### 4.3 — Skills recommandés
**[BOUTON] Voir mes Skills recommandés**

Le Lab recommande les Skills spécifiques au projet :
```
SKILLS RECOMMANDÉS POUR [NOM DU PROJET]

1. Frontend Design
   Ce qu'il apporte à TON projet : des interfaces premium
   au lieu du design générique Claude.
   Commande : npx skills add frontend-design
   [Copier la commande]

2. SuperPowers
   Ce qu'il apporte à TON projet : workflow structuré
   pour chaque feature.
   Commande : /plugin install superpowers
   [Copier la commande]

3. [Skill spécifique au type de projet]
   ...
```

### 4.4 — MCP & connecteurs
**[BOUTON] Générer mon fichier .mcp.json**

Le Lab génère le fichier .mcp.json PERSONNALISÉ :
- Context7 (toujours)
- Supabase MCP (si le projet utilise Supabase — toujours)
- Stripe MCP (si le projet a du paiement)
- GitHub MCP (toujours)
- Autres MCP pertinents au projet

Le fichier est affiché avec [Copier] et [Télécharger].

### 4.5 — Kit complet
**[BOUTON] Télécharger tout le kit**

Télécharge un ZIP avec :
- CLAUDE.md
- .mcp.json
- prompts.md (tous les prompts séquentiels)
- brand-guide.md (le branding)
- skills-install.sh (script d'installation des skills)

---

## ═══════════════════════════════════════
## PHASE 5 — INSTALLATION GUIDÉE
## ═══════════════════════════════════════

### Sidebar
```
Phase 5 — Installation    ← ACTIF
├── 5.1 Prérequis
├── 5.2 Installer Claude Code
├── 5.3 Configurer le projet
├── 5.4 Installer les Skills
├── 5.5 Configurer les MCP
└── 5.6 Vérification
```

Chaque sous-étape est un écran avec :
- L'instruction exacte (commande à copier)
- Ce qu'on doit voir si ça marche (screenshot ou description)
- Troubleshooting si ça ne marche pas
- Un bouton [J'ai fait cette étape ✓] pour passer à la suivante

### 5.1 — Prérequis
Checklist :
□ Node.js installé (lien + commande de vérification : node --version)
□ Git installé (lien + commande : git --version)
□ Compte Claude Pro ou Max (lien inscription)
□ Compte GitHub (lien)
□ Compte Supabase (lien)
□ Compte Vercel (lien)
□ Compte Stripe (lien — si monétisation)

Chaque item a un lien direct + instruction pour vérifier.

### 5.2 — Installer Claude Code
```
Ouvre ton terminal et tape :

npm install -g @anthropic-ai/claude-code

[Copier la commande]

Tu dois voir : "claude-code@x.x.x installed"
Si tu vois une erreur → [voir la solution]
```

### 5.3 — Configurer le projet
```
Crée ton dossier projet :

mkdir [nom-du-projet]
cd [nom-du-projet]

[Copier les commandes]

Maintenant, copie le CLAUDE.md que le Lab a généré
à la racine de ce dossier.

[Télécharger le CLAUDE.md] ou [Copier le contenu]
```

### 5.4 — Installer les Skills
```
Lance Claude Code :

claude

Puis installe les Skills recommandés un par un :

npx skills add frontend-design
[Copier]

/plugin install superpowers
[Copier]

...
```

### 5.5 — Configurer les MCP
```
Copie ton fichier .mcp.json dans le dossier du projet.

[Télécharger le .mcp.json]

Puis ajoute Context7 :

claude mcp add context7 -- npx -y @upstash/context7-mcp@latest
[Copier]
```

### 5.6 — Vérification
```
Vérifions que tout fonctionne.

Dans Claude Code, tape :

/doctor

[Copier]

Tu dois voir :
✓ CLAUDE.md trouvé
✓ Skills installés : frontend-design, superpowers
✓ MCP configurés : context7, supabase
✓ Git initialisé

Si tout est vert → [Passer au build →]
```

---

## ═══════════════════════════════════════
## PHASE 6 — BUILD GUIDÉ
## ═══════════════════════════════════════

### Sidebar
```
Phase 6 — Build           ← ACTIF
├── 6.1 Structure du projet
├── 6.2 Landing page
├── 6.3 Authentification
├── 6.4 Dashboard principal
├── 6.5 Feature principale
├── 6.6 Paiement Stripe
├── 6.7 [Feature spécifique]
└── 6.8 Polish & tests
```

Chaque sous-étape affiche :
1. Le PROMPT personnalisé à copier dans Claude Code
2. Ce que Claude Code va faire (en langage simple)
3. Ce que tu dois vérifier en preview
4. Les erreurs courantes et comment les corriger
5. Un bouton [Cette étape est terminée ✓]

Le Lab adapte le nombre de sous-étapes au projet.
Un projet simple (5 pages) = 6-8 prompts.
Un projet complexe (10+ pages) = 12-15 prompts.

### Format de chaque sous-étape

```
┌─────────────────────────────────────────────┐
│  ÉTAPE 6.2 — Landing page                   │
│                                             │
│  Copie ce prompt dans Claude Code :         │
│  ┌─────────────────────────────────────┐    │
│  │ Crée la landing page de [projet]    │    │
│  │ avec un hero section qui contient   │    │
│  │ [titre]. Design : [couleurs].       │    │
│  │ Utilise le skill frontend-design.   │    │
│  │ ...                                 │    │
│  └─────────────────────────────────────┘    │
│  [Copier le prompt]                         │
│                                             │
│  ▸ Ce que Claude Code va faire              │
│    Claude va créer le fichier page.tsx      │
│    avec le hero, le formulaire, et le       │
│    footer. Tu verras la preview sur         │
│    localhost:5173.                           │
│                                             │
│  ▸ Ce que tu dois vérifier                  │
│    □ Le titre s'affiche correctement        │
│    □ Les couleurs correspondent             │
│    □ Le formulaire est visible              │
│    □ La page est responsive (mobile)        │
│                                             │
│  ▸ Problème courant                         │
│    Si les couleurs ne correspondent pas,    │
│    dis à Claude : "Les couleurs du hero     │
│    ne matchent pas le CLAUDE.md. Vérifie    │
│    et corrige."                             │
│                                             │
│  [Cette étape est terminée ✓]               │
└─────────────────────────────────────────────┘
```

---

## ═══════════════════════════════════════
## PHASE 7 — DÉPLOIEMENT
## ═══════════════════════════════════════

### Sidebar
```
Phase 7 — Déploiement     ← ACTIF
├── 7.1 Push sur GitHub
├── 7.2 Connecter Vercel
├── 7.3 Configurer Supabase (production)
├── 7.4 Configurer Stripe (production)
├── 7.5 Domaine custom (optionnel)
└── 7.6 Vérification finale
```

Même format que la Phase 5 : instruction + commande + vérification + troubleshooting.

### 7.6 — Vérification finale
```
CHECKLIST AVANT LANCEMENT

□ L'app se charge sans erreur
□ L'inscription/connexion fonctionne
□ Le dashboard affiche les bonnes données
□ Le paiement Stripe fonctionne (mode test)
□ Les emails transactionnels arrivent
□ L'app est responsive (mobile)
□ Le HTTPS est activé (cadenas vert)

Tout est coché ?

🎉 TON SAAS EST EN LIGNE

[nom-du-projet].vercel.app

[Passer au lancement →]
```

---

## ═══════════════════════════════════════
## PHASE 8 — LANCEMENT
## ═══════════════════════════════════════

### Sidebar
```
Phase 8 — Lancement       ← ACTIF
├── 8.1 Checklist pré-lancement
├── 8.2 Premiers utilisateurs
├── 8.3 Templates de lancement
└── 8.4 Plan semaine 1
```

### 8.2 — Où trouver tes premiers utilisateurs
Le Lab recommande les canaux adaptés au projet :
- Product Hunt (avec lien + tips)
- Reddit (subreddits spécifiques à la niche — identifiés en Phase 1)
- IndieHackers
- LinkedIn (si B2B)
- Instagram / TikTok (si B2C)

### 8.3 — Templates de lancement
**[BOUTON] Générer mes templates de lancement**

Le Lab génère des messages prêts à poster, personnalisés :
- Template Product Hunt (titre + tagline + description)
- Template Reddit (post pour r/SaaS et le subreddit de la niche)
- Template LinkedIn (post de lancement)
- Template email (pour envoyer à ton réseau)

Chaque template est personnalisé au projet, pas générique.

---

## ═══════════════════════════════════════
## APRÈS LE LANCEMENT — LE LAB CONTINUE
## ═══════════════════════════════════════

Une fois la Phase 8 terminée, le dashboard principal affiche :

```
TON PROJET : [nom]
STATUT : 🟢 En ligne
URL : [url]

OUTILS :
[Régénérer un prompt]  [Modifier le CLAUDE.md]
[Ajouter une feature]  [Voir le brand guide]

PROCHAINES ÉTAPES RECOMMANDÉES :
□ Configurer PostHog (analytics)
□ Configurer Sentry (error tracking)
□ Ajouter une page SEO
□ Créer ta première séquence d'emails

[Commencer un nouveau projet →]
```

---

# ÉLÉMENTS D'INTERFACE RÉCURRENTS

## Barre de progression globale
En haut de chaque page du Lab :
```
Phase 1 ● ─── Phase 2 ● ─── Phase 3 ● ─── Phase 4 ◐ ─── Phase 5 ○ ─── Phase 6 ○ ─── Phase 7 ○ ─── Phase 8 ○
```
● = complétée, ◐ = en cours, ○ = à faire

## Sidebar de navigation
Toujours visible à gauche. Montre :
- Les 8 phases avec leur statut
- Les sous-étapes de la phase active
- Les fichiers générés (CLAUDE.md, .mcp.json, prompts, brand guide)
- Le lien vers le Buildrs Club

## Boutons de génération
Chaque bouton "Générer" a 3 états :
1. Pas encore cliqué : bouton plein (terracotta ou noir)
2. En cours de génération : loader/spinner + streaming du texte
3. Généré : le résultat est affiché + boutons [Copier] [Télécharger] [Régénérer]

## Encarts "Outils recommandés"
À chaque phase, un encart discret recommande des outils externes :
Phase 1 : Product Hunt, Reddit, Google Trends, TrustMRR
Phase 3 : Mobbin, Dribbble, Coolors
Phase 5 : Documentation Claude Code, Skills.sh
Phase 7 : Vercel docs, Supabase docs, Stripe docs
Phase 8 : Product Hunt tips, Reddit posting guide

## Streaming des générations
Quand le Lab génère du contenu (via l'API Claude),
le texte apparaît en streaming (mot par mot).
Pas d'attente 10 secondes devant un écran blanc.
L'utilisateur voit le texte se construire en temps réel.

---

# MODÈLE DE DONNÉES (mis à jour)

## Tables

users
- id, email, name, avatar_url
- plan (free / lab / lab_lifetime)
- stripe_customer_id
- onboarding_completed (boolean)
- onboarding_data (JSON — réponses pré-onboarding)
- created_at

projects
- id, user_id
- name, slug
- status (active / completed / archived)
- current_phase (1-8)
- idea_data (JSON — idée + score + validation)
- structure_data (JSON — pages, features, data model, pricing)
- branding_data (JSON — nom, couleurs, typos, style)
- build_kit_data (JSON — CLAUDE.md, prompts, skills, mcp)
- created_at, updated_at

project_phases
- id, project_id
- phase_number (1-8)
- step_number
- status (locked / active / completed)
- completed_at

generated_files
- id, project_id
- file_type (claude_md / mcp_json / prompts / brand_guide / kit_zip)
- content (TEXT)
- version (int — pour les régénérations)
- created_at

finder_searches
- id, user_id (nullable)
- mode (find / validate / copy)
- query
- results (JSON)
- score (int, nullable)
- email (for guests)
- created_at

---

# PRICING (confirmé)

## Finder
GRATUIT — accès libre, email requis pour sauvegarder

## Buildrs Lab
297€ paiement unique — 1 projet complet (8 phases)
+47€/mois optionnel — projets supplémentaires + mises à jour

## Cohorte Buildrs
Sur mesure — accompagnement groupe avec Alfred

---

# ROADMAP DE BUILD

## Semaine 1 — Fondations + Finder
- Jour 1-2 : Setup projet + composants de base + LP
- Jour 3-4 : Finder (3 modes, interface, génération Claude)
- Jour 5 : Auth (Supabase) + pré-onboarding
- Jour 6-7 : Dashboard + Phase 1 du Lab

## Semaine 2 — Phases 2-4
- Jour 8-9 : Phase 2 (structure produit + monétisation)
- Jour 10 : Phase 3 (branding + brand guide)
- Jour 11-12 : Phase 4 (CLAUDE.md + prompts + skills + MCP)
- Jour 13-14 : Phase 4 suite + Kit complet téléchargeable

## Semaine 3 — Phases 5-8 + Polish
- Jour 15-16 : Phase 5 (installation guidée pas-à-pas)
- Jour 17-18 : Phase 6 (build guidé avec prompts séquentiels)
- Jour 19 : Phase 7 (déploiement guidé)
- Jour 20 : Phase 8 (lancement + templates)
- Jour 21 : Polish, tests, Stripe, go live

---

# FIN DU DOCUMENT PRODUIT V2
# Ce document est la spec complète du Lab.
# Chaque écran, chaque bouton, chaque génération est décrit.
# Claude Code doit suivre ce document pour builder le Lab.
