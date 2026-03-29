# Projet : Buildrs Lab

## Document de référence
Le fichier BUILDRS-LAB-DOC-MAITRE.md à la racine du projet contient
la vision complète du produit : positionnement, architecture des 8 phases,
le Finder, le pricing, le modèle de données, les pages, et la roadmap.
Consulte-le AVANT de builder une feature pour comprendre le contexte.
En cas de doute sur une décision produit → le Doc Maître fait autorité.

## Description
Buildrs Lab est un associé IA qui guide les entrepreneurs non-techniques
de l'idée au SaaS en ligne — étape par étape, sans savoir coder.
Le Lab valide l'idée avec de vraies données marché, structure le produit,
génère le branding, prépare tout pour Claude Code (CLAUDE.md, prompts,
Skills, MCP personnalisés), et guide le build pas-à-pas jusqu'au
déploiement et au lancement.

Audience : entrepreneurs francophones 25-45 ans, non-techniques,
qui veulent créer un micro-SaaS avec l'IA comme levier.

## Stack technique
- Frontend : React + TypeScript + Tailwind CSS
- Backend : Supabase (PostgreSQL + Auth + Storage + Edge Functions)
- Paiements : Stripe (abonnement mensuel + paiement unique)
- Déploiement : Vercel
- IA : API Claude Anthropic (claude-sonnet-4-20250514) avec web search
- Emails : Resend
- Composants UI : Magic UI (magicui.design) pour les effets premium

## Conventions
- Composants fonctionnels React avec hooks
- TypeScript strict — jamais de `any`
- Tailwind CSS uniquement — pas de CSS inline, pas de fichiers CSS séparés
- Noms de fichiers en kebab-case
- Noms de composants en PascalCase
- Commits en français : type(scope): description
- Commentaires de code en français
- Toute l'interface en français (tutoiement)

## Design system
Direction : Google Antigravity — "Zero Gravity Tech" premium, aéré, cinématique.
Dualité nette light/dark. Particules omniprésentes. Boutons pill. Espace blanc extrême.
LOI : zéro terracotta dans l'UI. Accent = bleu #3279F9. Primary = noir #121317.

### Direction artistique
Pages publiques (LP, Finder, Pricing) : fond blanc/gris légèrement bleuté, quasi monochrome.
Dashboard/Lab authentifié : fond noir pur #000000 ou #121317, immersif.
Alternance nette entre sections blanches et noires — pas de dégradé entre les deux.
Particules grises subtiles sur fond clair, bleues lumineuses sur fond sombre.

### Palette LIGHT (pages publiques)

| Token            | Hex       | Usage                                    |
|-----------------|-----------|------------------------------------------|
| surface          | #F8F9FC   | Fond page (gris légèrement bleuté)       |
| surface-alt      | #F0F1F5   | Fond secondaire, sections alternées      |
| surface-card     | #EFF2F7   | Surface feature cards, blocs UI          |
| on-surface       | #121317   | Texte principal (quasi-noir chaud)       |
| on-surface-2     | #45474D   | Texte secondaire, nav links              |
| on-surface-3     | #B2BBC5   | Texte désactivé, labels muted            |
| border           | #E6EAF0   | Borders, séparateurs                     |
| border-active    | #E1E6EC   | Borders actives                          |
| accent           | #3279F9   | CTA, liens, icônes actives, badges       |
| accent-alt       | #1A73E8   | Boutons action principale                |

### Palette DARK (dashboard + sections hero dark)

| Token            | Hex       | Usage                                    |
|-----------------|-----------|------------------------------------------|
| dark-bg          | #000000   | Fond sections hero dark, footer          |
| dark-bg-alt      | #121317   | Fond dark alternatif, sidebar            |
| dark-card        | #18191D   | Surface cards dark                       |
| dark-text        | #FFFFFF   | Titres et body sur fond sombre           |
| dark-text-2      | #B2BBC5   | Texte secondaire sur dark                |
| dark-border      | #212226   | Borders sur dark                         |
| dark-accent      | #3279F9   | Particules bleues, éléments actifs dark  |
| dark-glow        | rgba(50,121,249,0.3) | Glow bleu sur éléments actifs  |

### Sémantique
- Success : #22C55E
- Warning : #F59E0B
- Error : #EF4444

### Typographie
Police principale : Inter (variable font, fallback Google Sans, sans-serif)
— Installer via @fontsource/inter ou Google Fonts
— Même feeling que "Google Sans Flex", proche d'Antigravity

| Élément      | Size  | Weight | Letter-spacing |
|-------------|-------|--------|----------------|
| H1 Hero      | 80px  | 450    | -1px           |
| H2 Section   | 54px  | 400    | -0.73px        |
| H3 Feature   | 32px  | 400    | -0.5px         |
| Body         | 16px  | 400    | -0.05px        |
| Label/small  | 12.5px| 400    | +0.11px        |
| CTA text     | 14.5px| 500    | +0.11px        |

Règle : letter-spacing légèrement NÉGATIF sur les titres (serré, premium).
Jamais DM Sans. Jamais terracotta en typo.
Code : JetBrains Mono uniquement.

### Effets & Animations
- Particules LIGHT : points 2-3px, couleur #CDD4DC (gris très clair), drift lent
- Particules DARK : points 2-3px, couleur #3279F9 avec halo lumineux, drift lent
- Easing signature : cubic-bezier(.25, .46, .45, .94)
- Scroll reveal : fade-in + translateY(20px → 0), 300ms ease-out-quad
- Transition base : 200ms ease-out-quad
- Hover boutons : state rgba(33,34,38,0.04) pressed rgba(33,34,38,0.12)
- Wordmark footer : "Buildrs" en typographie massive plein-écran (style Antigravity)

### Composants — Règles clés

**Boutons — TOUS en pill (border-radius: 9999px)**
- Primary : fond #121317, texte blanc, pill, padding 12px 24px, font-size 14.5px
- Secondary : fond transparent, border 1px #121317, texte #121317, pill
- Accent : fond #3279F9, texte blanc, pill
- Ghost : fond transparent, texte #45474D

**Cards LIGHT**
- Feature : fond #EFF2F7, radius 16px, pas de border visible, pas de shadow lourde
- Pricing : fond blanc, border #E6EAF0, radius 16px
- Input : fond blanc, border #E6EAF0, radius 12px

**Cards DARK**
- Default : fond #18191D, border #212226, radius 12-16px
- Active : border #3279F9, glow rgba(50,121,249,0.3)
- Sidebar : fond #121317
- Progress bar 8 segments : filled = #3279F9, empty = #212226
- Score badges : sémantique success/warning/error + glow

**Badges**
- Neutral : fond #EFF2F7, texte #45474D, radius 9999px (pill)
- Accent : fond #3279F9, texte blanc, pill

### Layout
- Max-width : 1200px (pages standard) / 1600px possible (sections full-bleed)
- Base grid : 8px
- Marges latérales : 80px desktop, 20px mobile
- Section spacing : 120-160px (très aéré, Antigravity-grade)
- Sur mobile : single column, sections 64-80px

### Icônes
- Lucide React (outline, stroke 1.5-2px)
- Taille : 20-24px dans les cards, 16px inline
- Couleur : hérite du contexte

### RÈGLES ABSOLUES
- JAMAIS de terracotta (#DA7756) dans l'UI
- JAMAIS de radius < 9999px sur les boutons CTA
- JAMAIS de dégradé entre section light et dark — transition nette
- JAMAIS de shadow lourde sur les cards — subtil ou zéro
- Boutons pill sur TOUTES les pages sans exception

### Outils référencés dans le Lab (logos à afficher)
Claude AI, Claude Code, Cowork, Vercel, Supabase, GitHub,
Stripe, Resend, Cloudflare, PostHog, Inngest, Framer Motion,
Magic UI, shadcn/ui, Mobbin, OAuth/Auth

## Structure du projet
```
src/
├── app/                    → Pages (Next.js App Router ou React Router)
│   ├── (public)/           → Pages publiques (landing, finder, pricing, auth)
│   ├── (auth)/             → Pages authentifiées (dashboard, project, settings)
│   └── api/                → API routes (Claude, Stripe webhooks)
├── components/
│   ├── ui/                 → Composants UI de base (Button, Card, Input, etc.)
│   ├── finder/             → Composants du Finder
│   ├── lab/                → Composants du Lab (phases, progression)
│   ├── project/            → Composants projet (dashboard, phases)
│   └── layout/             → Layout, Sidebar, Header, Footer
├── hooks/                  → Hooks personnalisés
├── lib/
│   ├── supabase.ts         → Client Supabase
│   ├── stripe.ts           → Client Stripe
│   ├── claude.ts           → Client API Claude
│   ├── resend.ts           → Client Resend
│   └── utils.ts            → Utilitaires
├── prompts/                → Prompts systèmes pour l'API Claude
│   ├── finder-find.ts      → Prompt mode "Trouve-moi une idée"
│   ├── finder-validate.ts  → Prompt mode "Valide mon idée"
│   ├── finder-copy.ts      → Prompt mode "Copie intelligemment"
│   ├── phase-1-validate.ts → Prompt phase 1 Lab
│   ├── phase-2-structure.ts→ Prompt phase 2 Lab
│   ├── phase-3-branding.ts → Prompt phase 3 Lab
│   ├── phase-4-kit.ts      → Prompt phase 4 Lab (CLAUDE.md, Skills, MCP)
│   ├── phase-6-build.ts    → Prompt phase 6 Lab (séquence de build)
│   └── phase-8-launch.ts   → Prompt phase 8 Lab (templates lancement)
├── types/                  → Types TypeScript
│   ├── project.ts
│   ├── user.ts
│   └── finder.ts
└── styles/
    └── globals.css         → Tailwind base + fonts + grain overlay
```

## Logique métier clé

### Finder (gratuit)
- 3 modes : find / validate / copy
- Appel API Claude avec web_search activé pour les vraies sources
- Pas de login requis pour chercher
- Email requis pour sauvegarder les résultats
- Résultats stockés dans finder_searches
- CTA vers le Lab sur chaque résultat avec score > 60

### Lab (payant)
- 8 phases séquentielles (on ne peut pas sauter une phase)
- Chaque phase a des sous-étapes cochables
- La génération est personnalisée au projet (les données des phases précédentes
  sont injectées dans le contexte Claude à chaque génération)
- Les fichiers générés (CLAUDE.md, .mcp.json, prompts) sont stockés
  dans project_build_kits et téléchargeables
- L'utilisateur peut régénérer n'importe quel élément à tout moment
- La progression est sauvegardée automatiquement

### Paiement
- Stripe Checkout pour l'achat initial (297€)
- Stripe Subscription pour l'abo mensuel (47€/mois ou 97€/mois)
- Webhook Stripe pour gérer les accès (activer/désactiver)
- Le Finder reste gratuit même sans paiement
- Le Lab nécessite un paiement actif

## Sécurité
- Row Level Security (RLS) sur TOUTES les tables Supabase
- Un utilisateur ne voit que SES projets
- Les clés API Claude sont côté serveur uniquement (Edge Functions)
- Rate limiting sur les appels API Claude (anti-abus)
- Pas de secrets dans le code — variables d'environnement

## Performance
- Génération Claude en streaming (l'utilisateur voit le texte apparaître)
- Lazy loading des phases non-actives
- Cache des résultats Finder (même recherche = pas de re-génération)
- Images optimisées (next/image ou composant custom)

## Ce qu'il ne faut PAS faire
- Ne JAMAIS utiliser de CSS inline — Tailwind uniquement
- Ne JAMAIS stocker de clés API côté client
- Ne JAMAIS générer du contenu en anglais — tout est en français
- Ne JAMAIS afficher du jargon technique sans explication
- Ne JAMAIS bloquer l'UI pendant une génération Claude — toujours du streaming ou un loader
- Ne JAMAIS hardcoder des prix — tout vient de Stripe
- Ne JAMAIS sauter une phase dans le Lab — le parcours est séquentiel
- Ne JAMAIS utiliser de composants class — uniquement fonctionnels avec hooks
- Ne JAMAIS laisser un formulaire sans validation (Zod)
- Ne JAMAIS faire de console.log en production

## Ton de l'interface
- Tutoiement systématique
- Direct, encourageant, jamais condescendant
- Phrases courtes
- Pas d'emojis dans le body text (seulement dans les callouts ou badges)
- Le Lab parle comme un associé, pas comme un prof
- Exemple : "Ton idée a un score de 87. C'est solide. On passe à la suite ?"
- Pas : "Félicitations ! Votre idée a obtenu un excellent score !"
