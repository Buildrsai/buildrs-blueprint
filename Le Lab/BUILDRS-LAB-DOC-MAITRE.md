# ══════════════════════════════════════════════════════════════
# BUILDRS LAB — DOCUMENT MAÎTRE
# Version : 1.0 — 20 mars 2026
# Statut : VERROUILLÉ — Ce document est la source de vérité
# Auteur : Alfred Orsini — Buildrs
# ══════════════════════════════════════════════════════════════

# CONFIDENTIEL — PROPRIÉTÉ INTELLECTUELLE BUILDRS
# Ce concept, son architecture, son positionnement et ses mécaniques
# sont la propriété exclusive d'Alfred Orsini / Buildrs.
# Toute reproduction, même partielle, est interdite.

---

# 1. VISION

## En une phrase
Buildrs Lab est un associé IA qui guide n'importe qui de "j'ai une vague idée"
à "mon SaaS est en ligne et accepte des paiements" — sans savoir coder.

## Le problème qu'on résout
En 2026, les outils pour créer des SaaS existent (Claude Code, Supabase, Vercel).
Mais 95% des gens ne savent pas les utiliser. Pas parce qu'ils sont incapables —
parce que personne ne les guide étape par étape, de façon personnalisée,
en partant de LEUR idée et pas d'un template générique.

Le résultat : des milliers de personnes avec des idées qui meurent
parce que le fossé entre "j'ai une idée" et "c'est en ligne" est trop grand.

## La solution
Un copilote IA qui :
1. Aide à TROUVER et VALIDER l'idée (avec de vraies données marché)
2. STRUCTURE le produit (features, pages, business model, branding)
3. PRÉPARE tout pour Claude Code (CLAUDE.md, prompts, Skills, MCP — personnalisés)
4. GUIDE le build pas-à-pas (chaque commande, chaque étape, chaque validation)
5. Accompagne jusqu'au LANCEMENT (déploiement, Stripe, premiers utilisateurs)

Tout est personnalisé au projet de l'utilisateur. Rien de générique.

## La métaphore
"Tu es Tony Stark. Le Lab est ton Jarvis. Claude Code est ton atelier.
Ensemble, vous construisez ce que vous voulez."

---

# 2. POSITIONNEMENT

## Ce que Buildrs Lab N'EST PAS
- Pas une formation vidéo passive (tu ne regardes pas, tu fais)
- Pas un boilerplate pour devs (pas besoin de connaître le terminal)
- Pas un chatbot (c'est un dashboard structuré avec des étapes)
- Pas un app builder type Lovable (on build des BUSINESS, pas des apps)
- Pas un concurrent de Claude Code (on le rend accessible)

## Ce que Buildrs Lab EST
- Un associé IA personnalisé pour chaque projet
- Un pont entre "j'ai une idée" et "mon SaaS est en ligne"
- Un système qui rend Claude Code accessible à tout le monde
- Un business builder (pas un app builder)
- Le premier outil francophone de ce type

## Le gap de marché
```
EN BAS → ChatGPT / Claude AI (chat)
          Tout le monde sait faire. Mais tu ne builds rien.

AU MILIEU → [VIDE] ← BUILDRS LAB SE PLACE ICI
             Le mec motivé qui a une idée mais qui est paralysé
             devant le terminal. Personne ne lui parle.

EN HAUT → Claude Code / Cursor / Anti-Gravity
           Puissant. Mais trop intimidant pour 95% des gens.
```

## Audience cible
- Entrepreneurs non-techniques avec une idée de produit
- Freelances qui veulent un revenu récurrent (SaaS)
- Salariés en transition qui veulent lancer un side-project
- Coachs / consultants / créateurs qui veulent monétiser autrement
- Toute personne motivée qui pense que "coder" est obligatoire

Profil psychographique :
- Curieux de l'IA mais perdu face à la complexité
- Ambitieux, veut être indépendant
- Prêt à investir du temps et de l'argent si c'est guidé
- A essayé des formations, n'a jamais fini
- Veut des RÉSULTATS, pas de la théorie

---

# 3. ARCHITECTURE PRODUIT

## 3.1 — BUILDRS FINDER (gratuit — lead magnet)

Point d'entrée gratuit. Un moteur de recherche d'idées de SaaS.

### 3 modes de recherche

MODE 1 — "Trouve-moi une idée"
- Input : une niche ou un centre d'intérêt
- Output : 3-5 opportunités de SaaS avec :
  - Le problème identifié
  - L'audience cible
  - La concurrence et ses faiblesses
  - Le pricing estimé
  - Le temps de build estimé
  - Les sources (Product Hunt, Reddit, App Store, Google Trends)
  - Score de viabilité /100

MODE 2 — "Valide mon idée"
- Input : description de l'idée en 2-3 lignes
- Output : score de viabilité /100 avec :
  - Demande marché /25 (des gens cherchent ça ?)
  - Concurrence /25 (qui fait déjà ça ? quels gaps ?)
  - Monétisabilité /25 (les gens paieraient combien ?)
  - Buildabilité /25 (faisable en combien de temps ?)
  - Verdict : GO / À AFFINER / PIVOT
  - Recommandations concrètes

MODE 3 — "Copie intelligemment"
- Input : nom ou URL d'un SaaS existant
- Output : analyse complète avec :
  - Ce que fait le produit
  - Son pricing
  - Ses faiblesses (avis négatifs réels)
  - 3 angles pour faire mieux ou différent
  - Le scope MVP pour une version alternative

### Mécanique de conversion
- Accès libre (pas de login pour chercher)
- Email requis pour "sauvegarder tes résultats"
- Chaque résultat se termine par :
  "Score 87/100. Tu veux construire ce SaaS ?
   Le Buildrs Lab te guide de A à Z. →"

---

## 3.2 — BUILDRS LAB (payant — produit principal)

### Les 8 phases du Lab

PHASE 1 — IDÉE & VALIDATION
├── Si l'utilisateur vient du Finder : son idée est déjà validée
├── Si non : le Lab intègre le Finder pour chercher/valider
├── Livrables :
│   ├── Rapport de validation marché
│   ├── Analyse concurrentielle
│   ├── Audience cible définie
│   └── Score de viabilité
└── Action utilisateur : valider l'idée ou pivoter

PHASE 2 — STRUCTURE PRODUIT
├── Le Lab génère :
│   ├── Liste des pages nécessaires (et pourquoi chacune)
│   ├── Features MVP (le strict minimum, pas 50 features)
│   ├── Modèle de données (en langage simple)
│   ├── Parcours utilisateur (comment le client utilise l'app)
│   └── Choix de monétisation :
│       ├── Abonnement mensuel (MRR)
│       ├── Paiement unique (one-shot)
│       ├── Freemium (gratuit + premium)
│       └── Recommandation personnalisée avec pricing
├── L'utilisateur ajuste, le Lab régénère
└── Action utilisateur : valider la structure

PHASE 3 — BRANDING & DESIGN
├── Le Lab génère :
│   ├── Nom du produit (3 propositions + disponibilité domaine)
│   ├── Baseline / tagline
│   ├── Palette de couleurs (avec logique)
│   ├── Typographies recommandées
│   ├── Style visuel (dark/light, glassmorphism, minimaliste, etc.)
│   ├── Mood board de références (liens vers des sites similaires)
│   └── Design system résumé
└── Action utilisateur : valider le branding

PHASE 4 — KIT CLAUDE CODE
├── Le Lab génère (PERSONNALISÉ au projet) :
│   ├── CLAUDE.md complet du projet
│   ├── Fichier .mcp.json avec les MCP nécessaires
│   ├── Liste des Skills à installer avec :
│   │   ├── Les commandes exactes
│   │   ├── Les liens
│   │   └── Ce que chaque Skill apporte à CE projet
│   ├── Liste des connecteurs nécessaires
│   └── Configuration recommandée de Claude Desktop
├── TOUT est téléchargeable / copiable en un clic
└── Action utilisateur : télécharger les fichiers

PHASE 5 — INSTALLATION GUIDÉE
├── Guide pas-à-pas pour installer l'environnement :
│   ├── Installer Node.js (avec lien + captures)
│   ├── Installer Claude Code (commande exacte)
│   ├── Créer le dossier projet
│   ├── Copier le CLAUDE.md
│   ├── Installer les Skills (commande par commande)
│   ├── Configurer les MCP
│   └── Vérifier que tout fonctionne
├── Chaque étape : instruction + ce qu'on doit voir + troubleshooting
└── Action utilisateur : suivre les étapes, valider chacune

PHASE 6 — BUILD GUIDÉ
├── Le Lab fournit une séquence de prompts à copier dans Claude Code :
│   ├── Prompt 1 : "Crée la structure du projet" → ce qu'on attend
│   ├── Prompt 2 : "Crée la landing page" → ce qu'on attend
│   ├── Prompt 3 : "Ajoute l'authentification" → ce qu'on attend
│   ├── Prompt 4 : "Crée le dashboard principal" → ce qu'on attend
│   ├── Prompt 5 : "Intègre Stripe" → ce qu'on attend
│   ├── Prompt 6 : "Ajoute [feature spécifique]" → ce qu'on attend
│   └── etc. (adapté au projet)
├── Chaque prompt est accompagné de :
│   ├── Ce que Claude Code va faire
│   ├── Ce qu'on doit voir en preview
│   ├── Les problèmes courants et comment les résoudre
│   └── Quand passer au prompt suivant
├── L'utilisateur peut demander des modifications :
│   "Le bouton est trop petit" → Le Lab génère le prompt de correction
└── Action utilisateur : copier les prompts, valider les résultats

PHASE 7 — DÉPLOIEMENT
├── Guide pas-à-pas :
│   ├── Créer un compte GitHub (si pas fait)
│   ├── Push le code (commande exacte)
│   ├── Créer un compte Vercel (si pas fait)
│   ├── Connecter GitHub à Vercel
│   ├── Configurer Stripe (produits, prix, checkout)
│   ├── Connecter un domaine custom (optionnel)
│   └── Vérifier que tout fonctionne en production
├── Checklist de validation pré-lancement
└── Action utilisateur : suivre, valider, son SaaS est en ligne

PHASE 8 — LANCEMENT
├── Le Lab génère :
│   ├── Checklist de lancement (15 étapes)
│   ├── Template de post Product Hunt
│   ├── Template de post Reddit (subreddits recommandés)
│   ├── Template de post LinkedIn
│   ├── Template de post Instagram
│   ├── 5 canaux pour trouver les premiers utilisateurs
│   └── Plan de contenu semaine 1 et 2
└── Action utilisateur : lancer, partager, itérer

---

## 3.3 — BUILDRS CLUB (inclus avec le Lab)

Communauté des builders :
- Groupe WhatsApp ou Discord privé
- Partage de projets entre membres
- Feedback entre builders
- Challenges mensuels ("le meilleur SaaS du mois")
- Lives et Q&A avec Alfred
- Entraide technique

Rôle : rétention + accountability + upsell vers la Cohorte

---

## 3.4 — COHORTE BUILDRS (upsell — high ticket)

Accompagnement groupe sur 3 mois :
- 6-8 participants max
- De l'idée au MRR
- 1 call groupe/semaine avec Alfred
- Support WhatsApp illimité
- Les participants utilisent le Lab comme outil central
- Pricing : sur mesure (2 000-5 000€)

---

# 4. PRICING

## Buildrs Finder
GRATUIT — accès libre, email requis pour sauvegarder

## Buildrs Lab

OPTION RECOMMANDÉE :
- 297€ paiement unique — accès complet, 1 projet
- +47€/mois optionnel — projets additionnels + mises à jour + support

OPTION ALTERNATIVE :
- 97€/mois — tout inclus, projets illimités
- 797€/an — 2 mois offerts

## Cohorte Buildrs
- Sur mesure — entre 2 000€ et 5 000€
- Candidature via call avec Alfred

---

# 5. STACK TECHNIQUE

## Frontend
- React + TypeScript + Tailwind CSS
- Magic UI pour les composants premium
- Design system Buildrs (dark mode, terracotta, glassmorphism)

## Backend
- Supabase (PostgreSQL + Auth + Storage + Edge Functions)
- Row Level Security sur toutes les tables

## IA
- API Claude (Anthropic) avec web search pour le Finder
- Prompts systèmes optimisés par module
- Génération personnalisée à chaque étape

## Paiements
- Stripe (abonnement + one-shot)
- Webhooks pour gérer les accès

## Hébergement
- Vercel (auto-deploy depuis GitHub)

## Emails
- Resend (transactionnels + séquences)

## Analytics
- PostHog ou Vercel Analytics

---

# 6. MODÈLE DE DONNÉES (simplifié)

## Tables principales

users
- id, email, name, avatar
- plan (free / lab / lab_pro)
- stripe_customer_id
- created_at

projects
- id, user_id
- name, description
- status (idea / validating / structuring / branding / building / deploying / launched)
- current_phase (1-8)
- niche, audience, problem
- created_at

project_validations
- id, project_id
- market_score, competition_score, monetization_score, buildability_score
- total_score
- sources (JSON)
- verdict (go / refine / pivot)

project_structures
- id, project_id
- pages (JSON)
- features (JSON)
- data_model (JSON)
- monetization_type (subscription / one_time / freemium)
- pricing (JSON)

project_brandings
- id, project_id
- name_options (JSON)
- colors (JSON)
- typography (JSON)
- style (dark / light / glassmorphism / etc.)
- design_system_summary

project_build_kits
- id, project_id
- claude_md (TEXT)
- mcp_json (JSON)
- skills (JSON — list with install commands)
- connectors (JSON)
- build_prompts (JSON — ordered list of prompts)

project_progress
- id, project_id
- phase (1-8)
- step_number
- completed (boolean)
- completed_at

finder_searches
- id, user_id (nullable — guests allowed)
- mode (find / validate / copy)
- query
- results (JSON)
- email (for guests)
- created_at

---

# 7. PAGES DE L'APPLICATION

## Pages publiques (pas de login)
- / → Landing page Buildrs Lab
- /finder → Buildrs Finder (moteur de recherche gratuit)
- /finder/results → Résultats de recherche
- /pricing → Page de pricing
- /login → Connexion
- /signup → Inscription

## Pages authentifiées (Lab)
- /dashboard → Vue d'ensemble de mes projets
- /project/new → Créer un nouveau projet
- /project/[id] → Dashboard du projet avec les 8 phases
- /project/[id]/phase/1 → Phase 1 — Idée & Validation
- /project/[id]/phase/2 → Phase 2 — Structure Produit
- /project/[id]/phase/3 → Phase 3 — Branding & Design
- /project/[id]/phase/4 → Phase 4 — Kit Claude Code
- /project/[id]/phase/5 → Phase 5 — Installation Guidée
- /project/[id]/phase/6 → Phase 6 — Build Guidé
- /project/[id]/phase/7 → Phase 7 — Déploiement
- /project/[id]/phase/8 → Phase 8 — Lancement
- /project/[id]/files → Mes fichiers (CLAUDE.md, .mcp.json, etc.)
- /club → Buildrs Club (lien communauté)
- /settings → Paramètres + abonnement

---

# 8. ROADMAP

## V1 — MVP (semaine 1-3)
- Buildrs Finder (3 modes de recherche)
- Landing page Lab
- Inscription + paiement Stripe
- Phases 1-4 du Lab (idée → validation → structure → branding)
- Phase 4 : génération CLAUDE.md + prompts + Skills
- Dashboard projet avec progression

## V2 — Build guidé (semaine 4-6)
- Phases 5-6 (installation guidée + build guidé avec séquence de prompts)
- Phase 7 (déploiement guidé)
- Phase 8 (lancement)
- Buildrs Club (intégration Discord/WhatsApp)

## V3 — Amélioration continue (mois 2-3)
- Bibliothèque de templates SaaS pré-validés
- Marketplace de Skills approuvés
- Amélioration des prompts de génération
- Analytics sur les projets lancés
- Témoignages et case studies intégrés

## V4 — Automatisation (mois 4+)
- Build semi-automatique (Claude Code API en background)
- Preview live intégrée dans le Lab
- Déploiement en un clic depuis le Lab
- Monitoring post-launch (agents de surveillance)

---

# 9. MÉTRIQUES DE SUCCÈS

## Mois 1
- Finder : 1 000+ recherches
- Emails captés : 300+
- Ventes Lab : 20-30
- Revenue : 6 000-9 000€

## Mois 3
- Finder : 5 000+ recherches/mois
- Abonnés Lab : 80-120
- Revenue mensuel : 15 000-25 000€
- Projets lancés par les membres : 30+

## Mois 6
- Finder : 15 000+ recherches/mois
- Abonnés Lab : 200-300
- Revenue mensuel : 30 000-50 000€
- Projets lancés : 100+
- Cohortes lancées : 2-3
- Buildrs Club : 200+ membres actifs

---

# 10. RISQUES ET MITIGATIONS

RISQUE : Dépendance à l'API Claude
MITIGATION : Abstraire la couche IA pour pouvoir switcher de modèle si nécessaire

RISQUE : Claude Code trop complexe pour certains utilisateurs malgré le guidage
MITIGATION : V4 avec build automatique en background. En attendant, les phases 5-6 sont ultra-détaillées

RISQUE : Concurrence (quelqu'un copie le concept)
MITIGATION : Avantage du first-mover FR + communauté + personal brand Alfred + itérations rapides

RISQUE : Qualité variable des SaaS générés
MITIGATION : Templates de prompts testés et optimisés + Skills pré-approuvés + CLAUDE.md détaillés

---

# FIN DU DOCUMENT MAÎTRE
# Ce document est la bible du produit.
# Toute décision produit doit être cohérente avec ce document.
# Modifications uniquement par Alfred Orsini.
