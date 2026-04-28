# CLAUDE.md — Buildrs Blueprint

## Identité du projet

**Projet :** Buildrs Blueprint
**Marque :** Buildrs
**Fondateur :** Alfred Orsini
**Positionnement :** Le système opérationnel pour lancer son MVP de micro-SaaS, app ou logiciel en 72h avec Claude comme moteur — sans savoir coder, sans budget, sans expérience technique.
**Tagline :** "De l'idée au MVP monétisé en 72h."
**Langue :** Français (tutoiement, ton direct, expert mais accessible)
**Cible :** Solopreneurs, freelances, coachs, créateurs, dirigeants de PME — profils non-techniques qui veulent créer et monétiser un produit digital avec l'IA.

---

## Architecture business — Système PSSO

### Les 6 niveaux d'offre (Problème → Solution → Système → Offre)

```
NIVEAU 0 — GRATUIT        →  On te qualifie
  Générateurs IA (quizz profil, idées, score)
  Contenu organique + Meta Ads → Landing Page

NIVEAU 1 — BLUEPRINT      →  On te guide
  27€ (barré 297€) — Dashboard interactif, 6 modules, prompts
  Order Bump : Module Claude +37€ (total 64€)
  Post-achat → page 2 chemins (Sprint ou Cohorte)

NIVEAU 2 — SPRINT         →  On te livre
  497€ (barré 997€) — MVP complet livré en 72h
  Call cadrage + DA + MVP fonctionnel + landing + créas Meta Ads + GitHub

NIVEAU 3 — COHORTE        →  On le fait ensemble
  1 497€ (barré 2 497€) ou 3×499€/mois
  60 jours · 4 sessions live/semaine · 12 places max
  Garantie : 1 000€/mois en 90 jours ou remboursé

NIVEAU 4 — ÉLITE          →  On construit tout
  4 997€ (barré 9 997€) · Sur candidature
  Produit complet, prêt au marché, livraison en 30 jours

NIVEAU 5 — PARTNER        →  On gère tout dans la durée
  997€/mois ou 9 997€/an
  Réservé aux clients Élite/Cohorte uniquement
```

### Paiement
- Stripe Checkout (liens directs + embedded checkout)
- Order bump sur la page de checkout (Blueprint → +37€ Module Claude)
- Post-achat Blueprint : page choix 2 chemins (Sprint 497€ / Cohorte 1 497€) + lien exit dashboard

---

## Direction Artistique (DA) — IMPLÉMENTÉE

> ⚠️ Cette section reflète le design **réellement implémenté** dans `blueprint-app/`. Ne pas revenir à l'ancienne DA (dark mode + indigo). Tout ce qui sera créé doit correspondre exactement à ces specs.

### Inspiration principale
Magic UI (magicui.design) — clean, ultra-premium, typographie massive weight 800, espacement généreux, fond blanc dominant.

### Thème — CSS Variable System (HSL)

**Défaut : Light Mode** (fond blanc `#ffffff`)
**Toggle dark/light** via `document.documentElement.classList.toggle("dark")`

Token CSS dans `src/index.css` via `@layer base` :

#### Light Mode (défaut `:root`)
```css
--background: 0 0% 100%;          /* #ffffff */
--foreground: 240 10% 4%;         /* #09090b */
--card: 0 0% 100%;
--card-foreground: 240 10% 4%;
--primary: 240 10% 4%;            /* noir — CTA principal */
--primary-foreground: 0 0% 100%;  /* blanc */
--secondary: 240 5% 96%;          /* #f4f4f5 — fond cards */
--secondary-foreground: 240 6% 10%;
--muted: 240 5% 96%;
--muted-foreground: 240 4% 46%;   /* texte secondaire */
--accent: 240 5% 96%;
--accent-foreground: 240 6% 10%;
--border: 240 6% 90%;             /* #e4e4e7 */
--input: 240 6% 90%;
--ring: 240 10% 4%;
```

#### Dark Mode (`.dark`)
```css
--background: 240 10% 4%;         /* #09090b */
--foreground: 0 0% 98%;           /* #fafafa */
--card: 240 10% 6%;
--card-foreground: 0 0% 98%;
--primary: 0 0% 98%;
--primary-foreground: 240 10% 4%;
--secondary: 240 4% 10%;
--secondary-foreground: 0 0% 98%;
--muted: 240 4% 10%;
--muted-foreground: 240 5% 65%;
--accent: 240 4% 10%;
--accent-foreground: 0 0% 98%;
--border: 240 4% 16%;
--input: 240 4% 16%;
--ring: 240 5% 84%;
```

**PAS d'accent indigo/violet.** Le seul accent est le rainbow glow sur le CTA principal.

#### Couleurs fonctionnelles
- Succès : `#22c55e`
- Warning : `#eab308`
- Erreur : `#ef4444`

### Typographie

**Font :** Geist (chargée via `<link>` CDN dans `index.html`, PAS via `@import` CSS)

- **Hero H1** : `clamp(52px, 8.5vw, 96px)`, `font-weight: 800`, `letter-spacing: -0.04em`
- **H2 sections** : `text-4xl` à `text-5xl`, `font-weight: 800`, `tracking-tight`
- **H3** : `text-xl` à `text-2xl`, `font-weight: 700`
- **Body** : 16px, `font-weight: 400`, `line-height: 1.6`
- **Mono / chiffres clés** : Geist Mono, chiffres stats en `font-mono font-bold text-5xl`
- **Caption** : 12px, `font-weight: 500`, uppercase, `tracking-widest`

### CTA Principal — Rainbow Glow

Le bouton CTA principal (noir avec aura arc-en-ciel) utilise la classe `.cta-rainbow` :

```css
/* Dans index.css */
@keyframes rainbow-glow {
  0%   { filter: blur(12px) hue-rotate(0deg); }
  100% { filter: blur(12px) hue-rotate(360deg); }
}

.cta-rainbow {
  position: relative;
}
.cta-rainbow::after {
  content: '';
  position: absolute;
  inset: -2px;
  border-radius: 12px;
  background: conic-gradient(from 0deg, #ff6b6b, #ffd93d, #6bcb77, #4d96ff, #cc5de8, #ff6b6b);
  z-index: -1;
  filter: blur(12px);
  opacity: 0.55;
  animation: rainbow-glow 3s linear infinite;
}
```

HTML du bouton CTA :
```jsx
<button className="cta-rainbow relative bg-foreground text-background rounded-xl px-8 py-4 text-base font-semibold">
  Commencer maintenant →
</button>
```

### Logo Buildrs

**Fichier :** `src/components/ui/icons.tsx`

**BuildrsIcon** : SVG hashtag/grille (#) avec carré intérieur, stroke-based.
- Version noire : `color="#09090b"` (fond clair)
- Version blanche : `color="#ffffff"` (fond sombre)
- Usage : `<BuildrsIcon color="#09090b" size={28} />`

**BuildrsLogo** : icône + texte "Buildrs" côte à côte (inline SVG + span)

**Règle absolue :** PAS d'emoji comme icône. Toujours SVG Lucide ou BrandIcons.

### Marquee / Défilement outils

Animation CSS `marquee-scroll` (définie dans `index.css`) :
```css
@keyframes marquee-scroll {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}
```

Les outils utilisent `BrandIcons` (SVG officiels) depuis `src/components/ui/icons.tsx` :
`vercel, supabase, stripe, github, tailwind, claude, cloudflare, resend`

### Composants UI

**Cards** :
- `border border-border rounded-xl p-6`
- Hover : `hover:border-foreground/20 transition-colors`
- Fond : `bg-card` ou `bg-secondary/50`

**Buttons secondaires** :
- `border border-border rounded-xl px-6 py-3 font-medium hover:bg-secondary transition-colors`

**Badges** :
- `text-xs font-medium px-3 py-1 rounded-full bg-secondary border border-border`

**Icons** :
- Lucide : toujours `strokeWidth={1.5}`, taille 20px standard
- BrandIcons : taille 18-20px

**Inputs** :
- `border border-border rounded-lg px-4 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-foreground/20`

### Composants spéciaux

**SprintWallCalendar** (`src/components/ui/sprint-wall-calendar.tsx`) :
- 3D via `preserve-3d`, `perspective: 1400px`
- Drag-to-tilt via pointer events (tiltX/tiltY state)
- 6 panneaux `155×200px` en grid

**MorphingCardStack** (`src/components/ui/morphing-card-stack.tsx`) :
- 3 modes : stack (défaut), grid, list
- Framer Motion `AnimatePresence + LayoutGroup`
- Swipe/drag navigation en mode stack

### Principes de design
- Fond blanc dominant (light), jamais chargé
- Un seul élément dominant par section (hiérarchie claire)
- Typographie massive comme structure visuelle
- Pas d'emoji — SVG Lucide ou BrandIcons partout
- Mobile-first responsive
- Transitions 150ms, hover scale légère 1.02
- Accessibilité WCAG AA minimum

### Workflow de preview (IMPORTANT)

Le dossier parent contient `###` qui casse Vite dev server.
**Workflow obligatoire :**
```bash
cd blueprint-app && npx vite build
pkill -f "serve dist" 2>/dev/null; npx serve dist --listen 4000 &
open http://localhost:4000
```
PAS de `npm run dev`. Toujours build + serve.

---

## Stack technique

### Produits Buildrs

| Outil | Usage | Lien |
|-------|-------|------|
| Supabase | Base de données, auth, edge functions | supabase.com |
| Stripe | Paiements, checkout, subscriptions | stripe.com |
| Vercel | Déploiement web | vercel.com |
| Cloudflare | DNS, sécurité, CDN | cloudflare.com |
| Resend | Emails transactionnels | resend.com |
| GitHub | Versioning du code | github.com |

### Outils de développement

| Outil | Usage |
|-------|-------|
| Claude (claude.ai) | IA principale — prompts, génération, assistance |
| Claude Code | Développement avancé en ligne de commande |
| VS Code | IDE pour édition de code |
| Whispr | Parler au lieu de taper — productivité |

### Outils de design & inspiration

| Outil | Usage |
|-------|-------|
| Mobbin | Inspiration UI/UX — copier ce qui marche |
| 21st.dev | Composants design prêts à l'emploi |
| Magic UI | Composants animés React/Tailwind |
| Shadcn/ui | Bibliothèque UI accessible |
| Stitch | Assemblage d'interfaces |
| Lucide Icons | Icônes cohérentes et fines |

### Outils de recherche & validation

| Outil | Usage |
|-------|-------|
| Product Hunt | Découvrir les SaaS qui marchent |
| Indie Hackers | Communauté et idées de micro-SaaS |
| Reddit | Validation de problèmes réels |
| App Store | Analyse de la concurrence mobile |

### Outils de monétisation & revente

| Outil | Usage |
|-------|-------|
| Stripe Connect | Paiements dans l'app |
| Flippa | Revente de SaaS |
| Acquire.com | Revente de SaaS (+ sourcing d'idées) |
| Superwall | Paywall et CTA optimisés |

### Outils d'hébergement alternatifs

| Outil | Usage |
|-------|-------|
| Hostinger | Hébergement web alternatif |

---

## Structure du produit — Buildrs Blueprint (27€)

### Onboarding (post-achat, avant le dashboard)

**Écran 1 — Bienvenue**
"Tu viens de faire le premier pas. Voici ce qui t'attend dans les 72 prochaines heures."
Récap visuel du parcours en 6 modules.

**Écran 2 — Ta stratégie de départ**
3 choix :
- "J'ai un problème à résoudre" → Je crée ma propre solution
- "Je veux copier un SaaS qui marche" → J'adapte au marché français
- "Je n'ai aucune idée" → Je veux découvrir les opportunités

**Écran 3 — Ton objectif de monétisation**
3 choix :
- MRR (revenus mensuels récurrents) → Je garde et développe
- Revente (flip) → Je construis et revends
- Commande client → Je construis pour les autres

**Écran 4 — Ton niveau**
- Complet débutant
- J'ai déjà touché à des outils IA
- J'ai déjà lancé un projet

→ Redirection vers le dashboard personnalisé.

### Module 0 — Introduction & Fondations
*"Comprendre pourquoi tu es au bon endroit, au bon moment"*

**0.1 — Bienvenue dans Buildrs Blueprint**
- Récap : ce que tu vas accomplir (un produit live + monétisé)
- Le timeline : 72h
- Comment utiliser ce dashboard

**0.2 — Pourquoi les micro-SaaS sont le meilleur business en 2026**
- Définition simple : un petit logiciel en ligne payé chaque mois
- Pourquoi c'est puissant : MRR, scalable, prévisible, duplicable, automatisable, sans employé
- Armé d'agents IA — mode Tony Stark
- Juste besoin d'un ordinateur

**0.3 — C'est quoi le vibe coding ?**
- Définition : tu décris ce que tu veux, l'IA le construit
- Pourquoi c'est l'avenir
- Pourquoi maîtriser cette compétence change tout

**0.4 — C'est quoi un product builder ?**
- Pas besoin d'être développeur
- LA compétence la plus recherchée
- Les entreprises s'arrachent ce profil

**0.5 — Glossaire**
Définitions en une ligne : MVP, MRR, SaaS, API, Front-end, Back-end, Base de données, Déploiement, Auth, Prompt, Agent IA, Stack.

**0.6 — Les 3 stratégies de départ (détaillé)**

*Stratégie A — Résoudre un problème*
Tu as identifié un problème réel → tu construis la solution.

*Stratégie B — Copier et adapter*
Les étapes :
1. Repérer des SaaS IA qui fonctionnent (US, autre niche)
2. Copier le modèle économique et la stratégie
3. Adapter au marché français
4. Repérer les forces et faiblesses
5. Optimiser les failles
6. Mettre en place le marketing
7. Lancer en moins de 10 jours
Outils : Product Hunt, Indie Hackers, Acquire.com, App Store

*Stratégie C — Découvrir les opportunités*
Utiliser les générateurs du Module 1 pour trouver son idée.

**0.7 — Les 3 modèles de monétisation**
- MRR : conserver, développer, abonnements mensuels
- Flip : construire et revendre (Flippa, Acquire.com)
- Commande : construire pour des clients (2 000-10 000€/projet)

### Module 1 — Trouver & Valider
*"L'idée qui va devenir ton produit"*

**1.1 — Trouver ton idée**
- Générateur d'idées intégré au dashboard
- Prompt Claude pour brainstormer selon son profil
- Où chercher : Product Hunt, Indie Hackers, Reddit, App Store
- Comment analyser un SaaS existant pour le copier

**1.2 — Espace "Mes idées"**
- Sauvegarder, noter, comparer ses idées
- Conserver 3-5 idées et choisir la meilleure

**1.3 — Valider avant de construire**
- "90% des MVP échouent parce qu'ils résolvent un problème imaginaire"
- Prompt de validation Claude : concurrence, marché, risques
- Checklist : des gens paient déjà ? Explicable en 1 phrase ? Buildable en 72h ?

**1.4 — Le brief produit**
- Prompt pour générer : nom, problème, cible, feature core, modèle de prix
- Le "premier oui payant" — comment valider avec de vrais humains avant de coder

### Module 2 — Préparer & Designer
*"Donne forme à ton produit avant de le construire"*

**2.1 — Configurer son environnement**
- Liste complète des outils à ouvrir/installer avec liens directs
- Pour chaque outil : ce que c'est en 1 phrase + pourquoi on l'utilise
- Claude Code, VS Code, Supabase, Stripe, Vercel, Cloudflare, Resend, GitHub

**2.2 — S'inspirer et designer**
- Mobbin : comment chercher l'inspiration
- 21st.dev, Magic UI : trouver des composants
- Stitch : assembler des interfaces
- Process : chercher 3-5 apps similaires, capturer, donner à Claude comme référence

**2.3 — Le branding express**
- Nom du produit (prompt Claude)
- Palette de couleurs simple
- Choix de la typo
- Le "moodboard en 15 minutes"

**2.4 — Le parcours utilisateur**
- Prompt Claude : de l'inscription au paiement, chaque écran décrit
- Le user flow visuel

### Module 3 — L'Architecture
*"Les fondations solides de ton produit"*

**3.1 — Planifier avant de coder**
- Pourquoi 20 min de planification = 5h de gagné
- Prompt "Architecte" : structure complète de l'app

**3.2 — La base de données**
- Explication simple : le cerveau de ton app
- Prompt pour générer le schéma Supabase
- Tables essentielles : users, [data principale], payments

**3.3 — L'authentification**
- Comment les utilisateurs se connectent
- Prompt pour Supabase Auth (email, Google, etc.)

**3.4 — La sécurité**
- Les bases : RLS Supabase, variables d'environnement, HTTPS
- Checklist sécurité pour débutant

### Module 4 — Construire
*"On code. Enfin, Claude code. Toi tu diriges."*

**4.1 — Lancer le build**
- Claude Code : le prompt complet pour initialiser le projet
- VS Code + Vite : structure et scaffolding de l'app

**4.2 — La fonctionnalité principale**
- UN seul prompt ciblé pour LA feature core
- Pas 15 features, une seule qui justifie le paiement

**4.3 — Les pages essentielles**
- Accueil, connexion, dashboard utilisateur, pricing
- Un prompt par page

**4.4 — Intégrer l'IA (optionnel)**
- Si le SaaS utilise l'IA : prompt pour brancher Claude API
- Cas d'usage : génération de texte, analyse, chatbot

**4.5 — L'onboarding utilisateur**
- Créer un onboarding dans son propre SaaS
- Prompt pour générer le flow d'accueil

**4.6 — Corriger et affiner**
- Prompt "Debug" : identifier et corriger les problèmes
- Prompt "Polish" : affiner le design et l'UX

### Module 5 — Déployer
*"Ton app est live. Accessible au monde entier."*

**5.1 — Mise en ligne**
- Via Vercel (GitHub → deploy) ← méthode principale
- Via Cloudflare Pages (alternative)

**5.2 — Domaine personnalisé**
- Connecter son nom de domaine
- Configuration DNS simplifiée

**5.3 — Brancher les paiements**
- Stripe : produits, prix, checkout
- Prompt pour la logique de paiement complète
- Test du paiement

**5.4 — Les emails automatiques**
- Resend : bienvenue, confirmation, relance
- Prompt pour les templates d'emails

**5.5 — Checklist pré-lancement**
- 10 vérifications : paiement OK, emails OK, auth OK, mobile OK, mentions légales, CGV, confidentialité, SEO basique, analytics, test utilisateur

### Module 6 — Monétiser & Lancer
*"Tes premiers utilisateurs. Tes premiers euros."*

**6.1 — Ta page de vente**
- Prompt pour générer la landing page de SON produit
- Structure : accroche, problème, solution, fonctionnalités, prix, CTA

**6.2 — Ta stratégie de prix**
- Paiement unique vs abonnement vs freemium
- Comment choisir
- Les erreurs classiques

**6.3 — Les mentions légales**
- CGV, politique de confidentialité, mentions légales
- Prompt Claude pour les générer

**6.4 — Tes premiers contenus**
- Prompt lancement : 5 posts LinkedIn, 3 posts X, 1 email
- Prêts à copier-coller

**6.5 — Acquisition payante (les bases)**
- Première campagne Meta Ads simple
- Budget minimum, structure, erreurs à éviter

**6.6 — Acquisition organique**
- SEO basique
- Contenu organique
- Influence et partenariats

**6.7 — Mesurer et itérer**
- Métriques essentielles : visiteurs, inscriptions, conversions, MRR
- Outils d'analytics

### Bibliothèque de ressources (sidebar permanente)
- Tous les prompts organisés par module, copiables en 1 clic
- Checklist complète à cocher
- Templates : brief produit, cahier des charges, emails, landing page
- Liens directs vers tous les outils du stack

### Espace "Mes Idées" (sidebar permanente)
- Générateur d'idées intégré
- Sauvegarde et comparaison d'idées
- Notes personnelles

### Zone Next Level (teaser upsells)
- "Les Super Pouvoirs Claude" → teaser Order Bump
- "Templates d'apps prêts à forker" → teaser Upsell 1 (127€)
- "Accès Buildrs Lab" → teaser Upsell 1
- "Cohorte 30 jours" → teaser Upsell 2 (797-897€)

---

## Structure du dashboard — Navigation

### Sidebar gauche
```
[Logo Buildrs]
[Toggle dark/light]

PARCOURS
├── Introduction
├── Module 1 — Trouver & Valider
├── Module 2 — Préparer & Designer
├── Module 3 — L'Architecture
├── Module 4 — Construire
├── Module 5 — Déployer
└── Module 6 — Monétiser & Lancer

OUTILS
├── Mes Idées
├── Bibliothèque
└── Checklist

NEXT LEVEL
└── Débloquer les Super Pouvoirs →
```

### Header
- Logo Buildrs (gauche)
- Barre de progression globale (centre)
- Profil utilisateur + toggle theme (droite)

---

## Règles de contenu

### Ton
- Tutoiement systématique
- Direct, pas de bullshit
- Expert mais jamais condescendant
- Accessible : chaque terme technique est expliqué en une phrase AVANT d'être utilisé
- Pas de jargon gratuit — si un mot simple existe, on l'utilise
- Motivant sans être cringe

### Format
- Pas de murs de texte — phrases courtes, paragraphes courts
- Un concept par section
- Les prompts sont dans des blocs copiables visuellement distincts
- Les checklists sont interactives (cochables)
- Les liens outils ouvrent dans un nouvel onglet
- Progression visuelle : l'utilisateur voit où il en est à tout moment

### Langue
- Français uniquement (sauf termes techniques anglais standard : SaaS, MVP, MRR, API, etc.)
- Ces termes anglais sont toujours définis au premier usage

---

## Équipe Buildrs

### Alfred Orsini — Fondateur & CEO
- 32 ans, Bretagne
- Construit l'écosystème Buildrs seul — sans levée de fonds, sans équipe traditionnelle
- Génère +25 000€/mois de revenus récurrents sur ses propres SaaS, apps et logiciels
- Intervient dans les Cohortes, les appels diagnostics, et les décisions stratégiques
- Présent sur WhatsApp pour les clients
- Signe les emails de pitch Sprint (E18), Cohorte (E20) et de clôture émotionnelle (E23)

### Jarvis — COO IA · Bras droit d'Alfred
- Agent IA principal de Buildrs
- Coordonne les +40 agents IA spécialisés
- Sender par défaut de la séquence email post-achat (jarvis@app.buildrs.fr)
- Personnalité : direct, caractériel, légèrement sarcastique, orienté résultat
- Ton : tutoiement, phrases courtes, zéro emoji, pas de blabla corporate
- Ne se cache pas d'être une IA — c'est sa force ("Bienvenue en 2026")
- Mentionne Alfred naturellement ("Alfred m'a demandé de...", "j'en ai parlé avec Alfred")

### Chris — Coach humain
- Accompagne les clients Sprint et Cohorte aux côtés d'Alfred
- A lui-même construit et lancé des produits digitaux avant de rejoindre Buildrs
- Anime des sessions live de la Cohorte (3 sessions/semaine sur 4)
- Disponible sur WhatsApp pour le support technique et stratégique des clients Cohorte

### Tim & Charles — Vibecoders IA certifiés
- 22 ans chacun, sont passés par la Cohorte Buildrs avant de rejoindre l'équipe
- Construisent les MVP pour les clients Sprint et Élite
- Tim : rapidité, front-end, déploiement
- Charles : architecture, back-end, intégrations (Stripe, Supabase, API)
- Preuve vivante que la méthode Buildrs fonctionne

### Les +40 agents IA
- Chacun a une spécialité : design, architecture, développement, sécurité, copywriting, SEO, analyse, etc.
- Pilotés par Jarvis et Alfred au quotidien
- Utilisés dans chaque projet Buildrs (interne et client)

---

## Emails & Communication post-achat

### Senders Resend
- **Sender par défaut :** Jarvis · Buildrs — `jarvis@app.buildrs.fr`
- **Sender pitch + clôture :** Alfred Orsini · Buildrs — `alfred@app.buildrs.fr`
- **Reply-to universel :** `alfred@app.buildrs.fr`

### Séquence — 23 emails sur 30 jours
Référence complète : `ARCHITECTURE-EMAILS-BUILDRS-V4.md`

3 phases :
- **Phase 1 — Activation (J0-J7)** : 8 emails, Jarvis, ouvrir le dashboard + WhatsApp
- **Phase 2 — Éducation marché (J8-J18)** : 8 emails, Jarvis, cas réels + destruction des objections
- **Phase 3 — Ascension (J19-J30)** : 7 emails, shift Jarvis → Alfred pour les pitchs

Emails signés Alfred directement : **E18 (Sprint)**, **E20 (Cohorte)**, **E23 (clôture)** — le shift de voix crée l'impact.

### Implémentation technique
- **n8n** : Webhook Stripe `checkout.session.completed` → Wait nodes → API Resend
- **Supabase** : table `email_sequence` (date d'achat + email)
- **Resend** : 23 templates, domaine `app.buildrs.fr` vérifié (SPF, DKIM, DMARC via Cloudflare)

### Règles copy email (appliquées à tous les emails Buildrs)
- Tutoiement, ton direct
- Zéro emoji
- Objet : 5-8 mots max, curiosité ou bénéfice
- Toujours ouvrir sur le lecteur (tu/ton)
- Un seul CTA par email — jamais de compétition entre deux liens
- PS utilisé pour mentions douces (WhatsApp, Sprint soft)

---

## Concurrence — Positionnement différenciant

### vs IQ Project (bootcamp vibe coding)
- Eux : 8 sessions sur 2 semaines, présentiel Paris, coaching, CPF, GPT-centric
- Nous : produit autonome à 27€, dashboard interactif, Claude comme moteur, accessible immédiatement, pas besoin de coach

### vs Pierre Evrard / Nokode Academy (micro-SaaS)
- Lui : communauté Skool, workshops gratuits, GPT/Bolt/Make/Airtable, outils LinkedIn
- Nous : système opérationnel complet, pas juste des tips, Claude-centric, stack moderne (Supabase, Vercel, Cloudflare), produit autonome pas communauté

### Notre avantage unique
1. Claude comme moteur (personne ne le fait en francophone)
2. Produit autonome, pas une formation (on achète, on exécute)
3. Prix d'entrée accessible (27€ vs 400-900€ les bootcamps)
4. Dashboard interactif avec effet SaaS (pas un PDF, pas un cours vidéo)
5. Stack moderne et pro (pas du no-code basique)

---

## Plan de développement

### Phase 1 — MVP (Semaine 1)
1. Dashboard React (blueprint-app) avec les 6 modules + onboarding
2. Landing page HTML standalone
3. Intégration Stripe (checkout 27€)
4. Contenu des modules 0 à 3 (minimum viable)

### Phase 2 — Complétion (Semaine 2)
1. Contenu des modules 4 à 6
2. Bibliothèque de prompts complète
3. Espace "Mes Idées" fonctionnel
4. Order bump page (module Claude 47€)
5. Upsell 1 page (pack complet 127€)

### Phase 3 — Acquisition (Semaine 3)
1. Créas Meta Ads (3-5 variations)
2. Générateurs gratuits (quizz vibecoder, générateur d'idées)
3. Lancement campagne Meta Ads
4. Itérations basées sur les données

### Phase 4 — Scale (Semaine 4+)
1. Upsell 2 (cohorte 30 jours)
2. Optimisation du funnel
3. Contenu organique
4. Done For You (sur rendez-vous)

---

## Feature Pack Agents (en développement)

Le dashboard contient maintenant une section `/agents` qui héberge 7 agents IA spécialisés vendus comme OTO à 197€ après achat du Blueprint.

Stack :
- Table Supabase `user_projects` (projets utilisateur)
- Table Supabase `agent_outputs` (historique des outputs)
- Table Supabase `user_entitlements` (qui a acheté quoi)
- Endpoint `/api/agents/run` qui appelle l'API Anthropic (model claude-sonnet-4-5)
- 7 system prompts stockés dans `/src/lib/agents/prompts/`

Les 7 agents : jarvis, planner, designer, db-architect, builder, connector, launcher.

Chaque agent prend un formulaire en input, fait un appel API Anthropic avec un system prompt premium, retourne un output Markdown/SQL/ZIP que l'utilisateur peut copier ou télécharger pour son Claude Code local.

L'accès aux agents est gaté par `user_entitlements.has_agents_pack = true`.

---

## Notes techniques pour Claude Code

### Stack blueprint-app (React LP + pages funnel)

- **Projet :** `###BLUEPRINT BUILDRS/blueprint-app/`
- **Framework :** React 18 + TypeScript + Vite
- **CSS :** Tailwind CSS v3 + PostCSS (⚠️ PAS `@tailwindcss/vite`, il casse avec `###` dans le path)
- **UI Components :** shadcn/ui pattern (components dans `src/components/ui/`)
- **Icônes :** Lucide React (strokeWidth 1.5 obligatoire) + BrandIcons SVG custom (`icons.tsx`)
- **Animations :** Framer Motion (MorphingCardStack) + CSS animations (marquee, rainbow)
- **CSS Variables :** HSL system dans `src/index.css`, mappées dans `tailwind.config.ts`
- **Fonts :** Geist + Geist Mono via `<link>` CDN dans `index.html` (PAS @import CSS)
- **Logo :** BuildrsIcon SVG hashtag/grille (`src/components/ui/icons.tsx`)

### Stack dashboard (post-achat)

- **Auth :** Supabase Auth (email + Google OAuth)
- **Database :** Supabase PostgreSQL
- **Paiement :** Stripe Checkout (liens directs)
- **Emails :** Resend
- **Déploiement :** Vercel

### Workflow preview obligatoire

```bash
# JAMAIS npm run dev (le path ### casse Vite dev server)
cd "###BLUEPRINT BUILDRS/blueprint-app"
npx vite build
pkill -f "serve dist" 2>/dev/null
npx serve dist --listen 4000 &
open http://localhost:4000
```

### Structure des pages funnel

```
src/components/LandingPage.tsx        ← LP principale (toutes sections)
src/components/CheckoutPage.tsx       ← Panier + Order Bump (27€ → 47€)
src/components/UpsellCohortPage.tsx   ← Upsell cohorte (remplace Upsell1 + Upsell2)
src/App.tsx                           ← Router entre les pages
```

> ⚠️ Upsell1Page.tsx et Upsell2Page.tsx ont été supprimées — remplacées par UpsellCohortPage.tsx

### Composants UI notables

```
src/components/ui/morphing-card-stack.tsx   ← Stack/Grid/List animé (Framer Motion)
                                              Interface CardData : id, title, description,
                                              icon, color, stat
src/components/ui/circular-gallery.tsx      ← Carousel 3D (conservé, non utilisé en prod)
src/components/ui/animated-beam-stack.tsx   ← Diagramme stack tech animé
src/components/ui/dashboard-preview.tsx     ← Preview dashboard interactif
src/components/ui/word-rotate.tsx           ← Rotation de mots animée (hero)
src/components/ui/testimonials-section.tsx  ← Colonnes de témoignages défilants
```

### Sections LandingPage.tsx — état actuel

| Section | Composant/Fonction | Notes |
|---|---|---|
| Hero | `Hero()` | WordRotate dans le H1 |
| Outils | marquee BrandIcons | 9 logos défilants |
| Pain | `Pain()` | |
| Pourquoi un SaaS | `SaasVehicle()` | MorphingCardStack, 4 cards avec stat + icône Lucide |
| Before/After | `BeforeAfter()` | |
| Sprint 72h | inline dans LP | 6 jours, items + tool badges |
| Témoignages | `<TestimonialsSection />` | 9 témoignages, 3 colonnes |
| Offre | inline dans LP | 11 features + 2 bonus |
| FAQ | inline dans LP | |
| Footer | `<StackedCircularFooter />` | |

### Features offre (27€) — liste actuelle

1. Accès au dashboard interactif Buildrs
2. 6 modules complets (de l'idée au lancement)
3. Les prompts exacts à copier-coller à chaque étape
4. Le stack complet d'outils avec guides de configuration
5. Générateur d'idées intégré
6. Checklist interactive de progression
7. Templates prêts à l'emploi (brief, emails, landing page)
8. Les fondations du vibecoding et du product building
9. 3 stratégies de départ (copier, résoudre, découvrir)
10. 3 modèles de monétisation (MRR, revente, commande)
11. Accès à vie + mises à jour

Bonus : 3 générateurs IA · Accès canal WhatsApp Buildrs
