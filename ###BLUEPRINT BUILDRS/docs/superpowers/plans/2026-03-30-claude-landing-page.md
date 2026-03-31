# Claude Buildrs LP2 Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Créer une deuxième landing page indépendante (`#/claude`) qui vend "Claude Buildrs" à 47€ avec un order bump inversé (Blueprint +27€), en réutilisant le design system et les composants existants.

**Architecture:** `ClaudeLandingPage.tsx` est un fichier autonome (~1100 lignes) lazy-loadé dans App.tsx via un nouveau hash route `#/claude`. Un state `funnelSource` dans App.tsx détermine le comportement du checkout. L'Edge Function `create-checkout` est étendue avec un paramètre `source` pour gérer les deux funnels.

**Tech Stack:** React 18 + TypeScript + Vite + Tailwind CSS + Supabase Edge Functions (Deno) + Stripe Embedded Checkout

**Spec de référence :** `docs/superpowers/specs/2026-03-30-claude-landing-page-design.md`

**Note build :** Ce projet a `###` dans le path — JAMAIS `npm run dev`. Toujours :
```bash
cd "blueprint-app" && npx vite build && pkill -f "serve dist" 2>/dev/null; npx serve dist --listen 4000 &
```
Puis ouvrir `http://localhost:4000/#/claude`

---

## Chunk 1 : Routing & State — App.tsx + CheckoutPage

**Files:**
- Modify: `blueprint-app/src/App.tsx`
- Modify: `blueprint-app/src/components/CheckoutPage.tsx`

---

### Task 1 : Ajouter `funnelSource` state + route `#/claude` dans App.tsx

**Files:**
- Modify: `blueprint-app/src/App.tsx`

- [ ] **Step 1 : Ouvrir `App.tsx` et lire les sections concernées**

  Lire `blueprint-app/src/App.tsx` lignes 1-50 (imports + lazy) et lignes 75-147 (parseHash).

- [ ] **Step 2 : Ajouter le type `'claude-landing'` à `ParsedRoute`**

  Dans le type union `ParsedRoute`, ajouter `'claude-landing'` après `'landing'` :

  ```ts
  // Avant
  type:
    | 'landing'
    | 'checkout'
    ...

  // Après
  type:
    | 'landing'
    | 'claude-landing'
    | 'checkout'
    ...
  ```

- [ ] **Step 3 : Ajouter le parsing du hash `#/claude` dans `parseHash()`**

  Après la ligne `if (!h || h === 'landing' || h === '/') return { type: 'landing' }`, ajouter :

  ```ts
  if (h === 'claude') return { type: 'claude-landing' }
  ```

- [ ] **Step 4 : Ajouter le lazy import de `ClaudeLandingPage`**

  Après le lazy import de `CheckoutPage`, ajouter :

  ```ts
  const ClaudeLandingPage = lazy(() => import('./components/ClaudeLandingPage').then(m => ({ default: m.ClaudeLandingPage })))
  ```

- [ ] **Step 5 : Ajouter le state `funnelSource`**

  Dans la fonction `App()`, après `const [hasAgentsBump, setHasAgentsBump] = useState(false)`, ajouter :

  ```ts
  const [funnelSource, setFunnelSource] = useState<'blueprint' | 'claude'>('blueprint')
  ```

- [ ] **Step 6 : Mettre à jour le handler LP1 pour setter la source `blueprint`**

  Changer la ligne landing render de :
  ```tsx
  return <LandingPage onCTAClick={() => navigate('#/checkout')} />
  ```
  en :
  ```tsx
  return <LandingPage onCTAClick={() => { setFunnelSource('blueprint'); navigate('#/checkout') }} />
  ```

- [ ] **Step 7 : Ajouter le render de la route `claude-landing`**

  Juste après le bloc landing (avant les funnel routes), ajouter :

  ```tsx
  if (route.type === 'claude-landing') {
    return (
      <Suspense fallback={SpinnerFallback}>
        <ClaudeLandingPage onCTAClick={() => { setFunnelSource('claude'); navigate('#/checkout') }} />
      </Suspense>
    )
  }
  ```

- [ ] **Step 8 : Passer `funnelSource` à `CheckoutPage`**

  Trouver le bloc `if (route.type === 'checkout')` et ajouter la prop `funnelSource` :

  ```tsx
  <CheckoutPage
    hasOrderBump={hasOrderBump}
    setHasOrderBump={setHasOrderBump}
    hasAgentsBump={hasAgentsBump}
    setHasAgentsBump={setHasAgentsBump}
    funnelSource={funnelSource}
    onPay={() => navigate('#/upsell-cohort')}
    onBack={() => navigate('#/landing')}
  />
  ```

- [ ] **Step 9 : Persister `funnelSource` dans sessionStorage pour le signup**

  Après le state `funnelSource`, ajouter un effet :

  ```ts
  useEffect(() => {
    sessionStorage.setItem('funnelSource', funnelSource)
  }, [funnelSource])
  ```

- [ ] **Step 10 : Commit**

  ```bash
  git add blueprint-app/src/App.tsx
  git commit -m "feat(routing): add #/claude route + funnelSource state"
  ```

---

### Task 2 : Adapter `CheckoutPage.tsx` selon `funnelSource`

**Files:**
- Modify: `blueprint-app/src/components/CheckoutPage.tsx`

- [ ] **Step 1 : Lire `CheckoutPage.tsx` lignes 1-170**

  Comprendre l'interface, les prix, et la logique `handlePay`.

- [ ] **Step 2 : Ajouter `funnelSource` à l'interface props**

  ```ts
  interface CheckoutPageProps {
    hasOrderBump: boolean
    setHasOrderBump: (v: boolean) => void
    hasAgentsBump: boolean
    setHasAgentsBump: (v: boolean) => void
    funnelSource: 'blueprint' | 'claude'
    onPay: () => void
    onBack: () => void
  }
  ```

- [ ] **Step 3 : Définir les constantes de prix selon la source**

  Dans la fonction `CheckoutPage`, remplacer les constantes hardcodées par :

  ```ts
  const isClaudeFunnel = funnelSource === 'claude'
  const basePrice  = isClaudeFunnel ? 47 : 27
  const bumpPrice  = isClaudeFunnel ? 27 : 37
  const total      = basePrice + (hasOrderBump ? bumpPrice : 0)
  ```

- [ ] **Step 4 : Adapter le titre produit principal**

  Trouver le texte `"Buildrs Blueprint"` dans le header de la carte produit et le rendre dynamique :

  ```tsx
  <p className="text-[12px] font-semibold uppercase tracking-[0.09em] text-muted-foreground">
    {isClaudeFunnel ? 'Claude Buildrs' : 'Buildrs Blueprint'}
  </p>
  ```

- [ ] **Step 5 : Adapter le prix barré**

  ```tsx
  <span className="text-[14px] font-medium text-muted-foreground/50 line-through">
    {isClaudeFunnel ? '97€' : '297€'}
  </span>
  ```

- [ ] **Step 6 : Adapter l'affichage du prix principal**

  ```tsx
  <span style={{ fontSize: 44, fontWeight: 800, ... }}>
    {basePrice}
  </span>
  ```

- [ ] **Step 7 : Adapter le sous-titre checkout**

  ```tsx
  <p className="mx-auto mt-3 max-w-[520px] text-[15px] ...">
    {isClaudeFunnel
      ? "L'environnement Claude exact pour construire des SaaS et des apps rentables."
      : "Le système guidé pour créer et monétiser ton premier SaaS IA en autopilote."}
  </p>
  ```

- [ ] **Step 8 : Adapter le label et le prix de l'order bump**

  Trouver la section order bump (carte avec badge "OUI — AJOUTER") et adapter :

  ```tsx
  // Titre order bump
  {isClaudeFunnel ? 'Blueprint SaaS' : 'Module Claude'}

  // Prix barré
  {isClaudeFunnel ? '297€' : '197€'}

  // Prix ajouté
  +{bumpPrice}€

  // Description courte
  {isClaudeFunnel
    ? "Tu as la machine de guerre. Voici le plan de bataille — 7 modules pour construire ton premier SaaS rentable."
    : "L'environnement Claude exact utilisé chez Buildrs — mémoire projet, skills, sous-agents — prêt à l'emploi."}
  ```

- [ ] **Step 9 : Passer `source` à l'Edge Function dans `handlePay`**

  Dans le fetch `create-checkout`, ajouter `source` dans le body :

  ```ts
  body: JSON.stringify({
    has_order_bump: hasOrderBump,
    has_agents_bump: hasAgentsBump,
    source: funnelSource,
  }),
  ```

- [ ] **Step 10 : Commit**

  ```bash
  git add blueprint-app/src/components/CheckoutPage.tsx
  git commit -m "feat(checkout): adapt pricing + labels based on funnelSource"
  ```

---

### Task 3 : Adapter `ConfirmationPage` pour le Pixel claude

**Files:**
- Modify: `blueprint-app/src/App.tsx` (fonction `ConfirmationPage`)

- [ ] **Step 1 : Mettre à jour le calcul de la valeur Pixel dans `ConfirmationPage`**

  Remplacer :
  ```ts
  const isOrderBump = window.location.hash.includes('bump=1')
  trackEvent('Purchase', { value: isOrderBump ? 64 : 27, currency: 'EUR', num_items: 1 })
  ```

  Par :
  ```ts
  const hash = window.location.hash
  const isClaude   = hash.includes('source=claude')
  const isOrderBump = hash.includes('bump=1')
  const value = isClaude
    ? (isOrderBump ? 74 : 47)
    : (isOrderBump ? 64 : 27)
  trackEvent('Purchase', { value, currency: 'EUR', num_items: 1 })
  ```

- [ ] **Step 2 : Commit**

  ```bash
  git add blueprint-app/src/App.tsx
  git commit -m "feat(pixel): track correct purchase value for claude funnel"
  ```

---

## Chunk 2 : Edge Function `create-checkout`

**Files:**
- Modify: `supabase/functions/create-checkout/index.ts`

---

### Task 4 : Ajouter le support `source=claude` dans l'Edge Function

**Files:**
- Modify: `supabase/functions/create-checkout/index.ts`

- [ ] **Step 1 : Lire `supabase/functions/create-checkout/index.ts` en entier**

  Comprendre la structure des `lineItems` et la `return_url`.

- [ ] **Step 2 : Extraire le paramètre `source` depuis le body**

  Après les lignes `hasOrderBump` et `hasAgentsBump`, ajouter :

  ```ts
  const source: 'blueprint' | 'claude' = body.source === 'claude' ? 'claude' : 'blueprint'
  const isClaudeFunnel = source === 'claude'
  ```

- [ ] **Step 3 : Adapter le premier `lineItem` selon la source**

  Remplacer le premier lineItem statique par :

  ```ts
  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
    {
      price_data: {
        currency: 'eur',
        product_data: {
          name: isClaudeFunnel ? 'Claude Buildrs' : 'Buildrs Blueprint',
        },
        unit_amount: isClaudeFunnel ? 4700 : 2700,
      },
      quantity: 1,
    },
  ]
  ```

- [ ] **Step 4 : Adapter le bump selon la source**

  Remplacer le bloc `if (hasOrderBump)` par :

  ```ts
  if (hasOrderBump) {
    lineItems.push({
      price_data: {
        currency: 'eur',
        product_data: {
          name: isClaudeFunnel
            ? 'Blueprint SaaS — Buildrs'
            : 'Module Claude — Buildrs Blueprint',
        },
        unit_amount: isClaudeFunnel ? 2700 : 3700,
      },
      quantity: 1,
    })
  }
  ```

- [ ] **Step 5 : Adapter la `return_url` pour inclure `source=claude`**

  ```ts
  const sourceParam = isClaudeFunnel ? '&source=claude' : ''
  const bumpParam   = hasOrderBump  ? '&bump=1' : ''
  const agentsParam = hasAgentsBump ? '&agents=1' : ''

  // Dans la session create :
  return_url: `${RETURN_BASE}/#/upsell-cohort?session_id={CHECKOUT_SESSION_ID}${sourceParam}${bumpParam}${agentsParam}`,
  ```

- [ ] **Step 6 : Ajouter `source` aux metadata Stripe**

  ```ts
  metadata: {
    product:          isClaudeFunnel ? 'claude' : 'blueprint',
    has_order_bump:   hasOrderBump   ? 'true' : 'false',
    has_agents_bump:  hasAgentsBump  ? 'true' : 'false',
  },
  ```

- [ ] **Step 7 : Commit**

  ```bash
  git add supabase/functions/create-checkout/index.ts
  git commit -m "feat(edge): support source=claude in create-checkout function"
  ```

---

## Chunk 3 : `ClaudeLandingPage.tsx`

**Files:**
- Create: `blueprint-app/src/components/ClaudeLandingPage.tsx`

Ce chunk est le plus volumineux. Le fichier suit exactement la même architecture que `LandingPage.tsx` : fonctions internes par section, data en haut du fichier, export final.

---

### Task 5 : Créer le squelette + data du fichier

**Files:**
- Create: `blueprint-app/src/components/ClaudeLandingPage.tsx`

- [ ] **Step 1 : Créer le fichier avec les imports**

  ```tsx
  import { useState, useEffect } from "react"
  import { Check, Flame, ChevronDown, Zap, Monitor, Cpu, RefreshCw, Terminal, Database, GitBranch, Layers, Bot } from "lucide-react"
  import { StackedCircularFooter } from "./ui/stacked-circular-footer"
  import { BuildrsIcon, BrandIcons } from "./ui/icons"
  import { SaasMarquee } from "./ui/saas-marquee"
  import { DashboardPreview } from "./ui/dashboard-preview"
  import { BGPattern } from "./ui/bg-pattern"
  import { DottedSurface } from "./ui/dotted-surface"
  ```

- [ ] **Step 2 : Ajouter les données de contenu — Stats, Pain, Solution**

  ```ts
  // ─── DATA ────────────────────────────────────────────────────────────────────

  const stats = [
    { num: "+25 000€/mois",       desc: "Avec cet exact setup",           sub: undefined as string | undefined },
    { num: "Mis à jour en continu", desc: "À chaque nouveauté Claude",     sub: undefined as string | undefined },
    { num: "+80 builders",         desc: "Utilisent déjà ce système",      sub: undefined as string | undefined },
  ]

  const pains = [
    {
      title: "Tu utilises Claude à 5% de sa puissance",
      desc: "Conversations jetables. Zéro mémoire. Zéro skill. Tu utilises un moteur de F1 pour aller chercher le pain.",
    },
    {
      title: "Une feature sort, tu la rates",
      desc: "Skills hier. MCP la semaine d'avant. Sub-agents le mois dernier. Tu vois passer les annonces. Tu ne sais pas quoi en faire. Le retard s'accumule.",
    },
    {
      title: "Tu consommes du contenu. Tu ne buildes rien.",
      desc: "Threads X, tutos YouTube, newsletters IA. Tu sais tout sur Claude. Tu n'as rien construit avec. Zéro revenu. Zéro produit.",
    },
    {
      title: "On te dit que Claude est une révolution. T'as toujours pas fait 1€ avec.",
      desc: "Même Claude. Même abonnement à 20€. D'autres font +25K/mois. Ils ont juste un setup, une méthode, et un système qui reste à jour.",
    },
  ]

  const solutions = [
    {
      badge: "UN SETUP COMPLET",
      desc: "Skills spécialisés, MCP essentiels, CLAUDE.md, commandes Claude Code, sub-agents parallèles. Tout est configuré, testé, documenté. Tu installes, tu es opérationnel.",
    },
    {
      badge: "SPÉCIALISÉ SAAS & APPS",
      desc: "Pas un setup Claude générique. Un environnement calibré pour construire des produits digitaux qui génèrent des revenus : SaaS, apps, logiciels, outils. Avec le stack complet : Supabase, Vercel, Stripe, GitHub.",
    },
    {
      badge: "MIS À JOUR EN TEMPS RÉEL",
      desc: "Chaque fois que Claude sort une feature, on met à jour le chapitre, le skill ou le connecteur concerné. Tu reçois une notification dans ton dashboard. Tu implémentes en 5 minutes. Zéro veille à faire.",
    },
  ]
  ```

- [ ] **Step 3 : Ajouter les données — Programme (10 chapitres)**

  ```ts
  const chapters = [
    { n: 1,  title: "Claude basique vs Claude Buildrs",       sub: "Pourquoi 99% des gens utilisent Claude comme un ChatGPT — et ce que change un vrai setup avec mémoire projet, skills et contexte persistant" },
    { n: 2,  title: "Choisir le bon modèle au bon moment",    sub: "Opus pour la stratégie, Sonnet pour l'exécution, Haiku pour les tâches rapides. Comment économiser des tokens avec le plan et quand switcher" },
    { n: 3,  title: "Les interfaces Claude",                   sub: "claude.ai, Claude Code dans le terminal, l'API, l'extension VS Code, Claude depuis Discord ou Telegram sur ton téléphone, et l'agent Cowork pour piloter ton desktop" },
    { n: 4,  title: "Paramétrer ton Claude Buildrs",           sub: "Mémoire projet, préférences, contexte persistant — ton Claude ne repart plus jamais de zéro. Il connaît ton projet, ton style, tes objectifs" },
    { n: 5,  title: "Le CLAUDE.md — le fichier qui change tout", sub: "Le fichier de référence que tu donnes à Claude Code. Stack, architecture, conventions, structure. Claude devient expert de TON projet en 30 secondes" },
    { n: 6,  title: "Les Skills — tes agents spécialisés",    sub: "Design, dev, archi, copy, debug — chaque skill donne à Claude une expertise spécifique. On t'installe les skills essentiels et on t'explique comment créer les tiens" },
    { n: 7,  title: "Les MCP — branche tes outils",           sub: "Supabase, GitHub, Stripe, Vercel, Figma, Notion — connectés directement à Claude. Il lit ta BDD, pousse ton code, déploie ton app. Les connecteurs indispensables, configurés pas à pas" },
    { n: 8,  title: "Les commandes Claude Code",              sub: "Les commandes essentielles : /init, /compact, les slash commands custom, les raccourcis. Plus Playwright et la prise de contrôle des onglets Chrome et des apps de bureau par Claude Code" },
    { n: 9,  title: "Les sub-agents parallèles",              sub: "Lance plusieurs agents qui bossent en même temps sur ton projet. Pendant que l'un code ton auth, l'autre écrit ta landing page et le troisième configure ton Stripe" },
    { n: 10, title: "Le Pack Buildrs — tout en un clic",      sub: "L'environnement complet de Buildrs — skills, MCP, CLAUDE.md, prompts, configs — installé en un téléchargement. Tu ouvres Claude Code, tu es opérationnel" },
  ]
  ```

- [ ] **Step 4 : Ajouter les données — Features, Bonus, FAQ**

  ```ts
  const features: { text: string; value: string }[] = [
    { text: "10 chapitres opérationnels — du Claude basique à un environnement pro complet",                       value: "397€" },
    { text: "Le CLAUDE.md Buildrs — le fichier qui transforme Claude en expert de ton projet",                   value: "97€"  },
    { text: "Les Skills spécialisés — design, dev, archi, copy, debug et bien d'autres",                         value: "147€" },
    { text: "Les MCP indispensables — Supabase, GitHub, Stripe, Vercel, Figma branchés à Claude",                value: "97€"  },
    { text: "Commandes Claude Code + sub-agents parallèles + Playwright + contrôle Chrome et desktop",           value: "147€" },
    { text: "Le Pack Buildrs — tout l'environnement en un téléchargement",                                       value: "47€"  },
    { text: "Le Dashboard Buildrs — ton espace projet, tes outils et ta progression",                            value: "197€" },
    { text: "Mises à jour à vie + notifications à chaque nouveauté Claude",                                      value: "97€"  },
  ]

  const bonuses: { text: string; value: string }[] = [
    { text: "Jarvis IA — ton copilote intelligent qui te guide à chaque étape en temps réel",                    value: "97€" },
    { text: "Agent Validator — valide ton idée SaaS avant de coder · score /100 + analyse concurrence",          value: "97€" },
    { text: "Toolbox Pro — les meilleurs outils IA du marché expliqués, testés, avec les prompts",               value: "97€" },
    { text: "WhatsApp Buildrs — accès privé à Alfred & Jarvis via le canal WhatsApp Buildrs",                    value: "47€" },
  ]

  const faqs = [
    { q: "J'ai besoin de savoir coder ?",                       a: "Non. Claude Code fait le code. Toi tu décris ce que tu veux et tu valides. C'est ça le vibecoding." },
    { q: "C'est quoi la différence avec un tuto YouTube ?",     a: "Un tuto te montre une feature. Claude Buildrs t'installe un ENVIRONNEMENT complet — skills, MCP, sub-agents, commandes, Playwright, contrôle Chrome — configuré et spécialisé pour construire des SaaS. C'est le setup exact qui génère +25K/mois." },
    { q: "Ça va devenir obsolète dans 3 mois ?",               a: "C'est exactement le problème des formations classiques. Claude Buildrs est mis à jour en continu. Chaque fois que Claude sort une nouveauté, on met à jour le chapitre concerné et on te notifie. Tu paies une fois, tu reçois les mises à jour à vie." },
    { q: "Je suis déjà à l'aise avec Claude, c'est pour moi ?", a: "Surtout pour toi. Si tu utilises Claude sans skills, sans MCP, sans CLAUDE.md, tu utilises 10% de sa puissance. Les 10 chapitres te font passer au niveau suivant." },
    { q: "C'est quoi un MCP, un skill, un sub-agent ?",        a: "Ce sont les briques avancées de Claude. Un MCP connecte Claude à tes outils (Supabase, Stripe, GitHub). Un skill lui donne une expertise spécifique. Un sub-agent c'est un Claude qui travaille en autonomie sur une tâche. Tout est expliqué pas à pas." },
    { q: "Ça coûte combien en outils ?",                       a: "Claude Pro : 20€/mois. Le reste (Supabase, Vercel, Stripe, GitHub) est gratuit en free tier. Budget total pour démarrer : moins de 70€, Claude Buildrs inclus." },
    { q: "Comment ça se passe après le paiement ?",            a: "Accès immédiat au dashboard Buildrs. Tu commences le chapitre 1. En une session, ton Claude est configuré. En une semaine, tu as un setup pro opérationnel." },
    { q: "Et si ça marche pas pour moi ?",                     a: "Tu as 30 jours pour tester. Si Claude Buildrs ne te convient pas, on te rembourse intégralement, sans condition et sans question." },
  ]
  ```

- [ ] **Step 5 : Commit squelette + data**

  ```bash
  git add blueprint-app/src/components/ClaudeLandingPage.tsx
  git commit -m "feat(lp2): scaffold ClaudeLandingPage with all content data"
  ```

---

### Task 6 : Implémenter les sections Nav + Hero + Marquee + Stats

**Files:**
- Modify: `blueprint-app/src/components/ClaudeLandingPage.tsx`

- [ ] **Step 1 : Ajouter le composant `Nav`**

  Copier le pattern exact de `Nav` dans `LandingPage.tsx` (lignes 152-215) et adapter :
  - Lien CTA : `"Accéder au setup — 47€ →"` (au lieu de `"Accéder au Blueprint →"`)
  - Ancres nav : `{ label: "Le programme", id: "programme" }`, `{ label: "Résultats", id: "resultats" }`, `{ label: "Tarif", id: "tarif" }`, `{ label: "FAQ", id: "faq" }`

- [ ] **Step 2 : Ajouter le composant `Hero`**

  Structure :
  ```tsx
  function Hero({ onCTA }: { onCTA?: (e: React.MouseEvent) => void }) {
    return (
      <section className="relative pt-32 pb-20 overflow-hidden">
        <BGPattern />
        <div className="relative mx-auto max-w-[900px] px-6 text-center">
          {/* Surtitre */}
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground mb-6">
            +25 000€/mois. Avec Claude. Voici le setup exact.
          </p>

          {/* Titre */}
          <h1 style={{ fontSize: 'clamp(38px, 6vw, 72px)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.05 }}
              className="text-foreground mb-6">
            L'environnement Claude qui génère +25 000€/mois.{" "}
            <span className="text-muted-foreground">Mis à jour en temps réel.</span>
          </h1>

          {/* Sous-titre */}
          <p className="mx-auto max-w-[620px] text-[17px] leading-[1.7] text-muted-foreground mb-8">
            Le setup complet — skills, sub-agents, MCP, CLAUDE.md, commandes Claude Code — pour construire des SaaS, des apps et des logiciels qui génèrent des revenus récurrents. Installé en une journée. Mis à jour à vie.
          </p>

          {/* Badges */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {["Débutant ou avancé en IA", "Installé en une journée", "Mises à jour en continu"].map(b => (
              <span key={b} className="text-xs font-medium px-3 py-1 rounded-full bg-secondary border border-border text-muted-foreground">
                {b}
              </span>
            ))}
          </div>

          {/* CTA */}
          <a href="#tarif" onClick={onCTA}
            className="cta-rainbow inline-flex items-center gap-2 rounded-[10px] bg-foreground px-8 py-4 text-[15px] font-semibold text-background hover:opacity-90 transition-opacity no-underline">
            Accéder au setup — 47€ →
          </a>
          <p className="mt-3 text-[12px] text-muted-foreground/60">
            Valeur réelle : 1 235€ · Paiement unique · Accès à vie
          </p>

          {/* Scarcity bar */}
          <div className="mt-8 mx-auto max-w-[320px]">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground/60">Places réclamées</span>
              <span className="text-[11px] font-bold text-foreground tabular-nums">XX / 200</span>
            </div>
            <div className="h-[3px] rounded-full bg-border overflow-hidden">
              <div className="h-full rounded-full bg-foreground" style={{ width: '38%' }} />
            </div>
            <p className="mt-1.5 text-[11px] text-muted-foreground/50">Ensuite 97€</p>
          </div>
        </div>
      </section>
    )
  }
  ```

- [ ] **Step 3 : Ajouter le composant `Stats`**

  ```tsx
  function Stats() {
    return (
      <section className="border-y border-border py-12">
        <div className="mx-auto max-w-[900px] px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            {stats.map((s) => (
              <div key={s.num}>
                <p className="font-mono font-bold text-foreground mb-1" style={{ fontSize: 'clamp(28px, 4vw, 40px)', letterSpacing: '-0.03em' }}>
                  {s.num}
                </p>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
                {s.sub && <p className="text-xs text-muted-foreground/60 mt-0.5">{s.sub}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }
  ```

- [ ] **Step 4 : Build et vérification visuelle hero**

  ```bash
  cd blueprint-app && npx vite build 2>&1 | tail -5
  pkill -f "serve dist" 2>/dev/null; npx serve dist --listen 4000 &
  ```

  Ouvrir `http://localhost:4000/#/claude` et vérifier :
  - Nav avec lien "Accéder au setup — 47€ →"
  - Hero avec titre, sous-titre, badges, CTA rainbow
  - Stats row

- [ ] **Step 5 : Commit**

  ```bash
  git add blueprint-app/src/components/ClaudeLandingPage.tsx
  git commit -m "feat(lp2): add Nav + Hero + Stats sections"
  ```

---

### Task 7 : Implémenter les sections Pain + Solution + BeforeAfter

**Files:**
- Modify: `blueprint-app/src/components/ClaudeLandingPage.tsx`

- [ ] **Step 1 : Ajouter la section `Pain` (4 cards 2×2)**

  ```tsx
  function Pain() {
    return (
      <section className="py-20">
        <div className="mx-auto max-w-[900px] px-6">
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted-foreground text-center mb-4">LE PROBLÈME</p>
          <h2 className="text-center font-extrabold tracking-tight text-foreground mb-3"
              style={{ fontSize: 'clamp(28px, 4vw, 48px)', letterSpacing: '-0.035em' }}>
            Claude sort une nouveauté par semaine.<br />Tu en rates combien ?
          </h2>
          <p className="text-center text-muted-foreground text-[16px] mb-12 max-w-[560px] mx-auto leading-relaxed">
            Skills, MCP, sub-agents, Playwright, Cowork, nouvelles commandes — pendant que tu regardes passer les annonces, d'autres installent et buildent. Le fossé se creuse chaque jour.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {pains.map((p) => (
              <div key={p.title} className="rounded-xl border border-border bg-secondary/50 p-6 hover:border-foreground/20 transition-colors">
                <h3 className="text-[16px] font-bold text-foreground mb-2 leading-snug">{p.title}</h3>
                <p className="text-[14px] text-muted-foreground leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
          <p className="text-center mt-10 text-[16px] font-semibold text-foreground">
            La différence entre toi et eux ? Pas le talent. Le setup.
          </p>
        </div>
      </section>
    )
  }
  ```

- [ ] **Step 2 : Ajouter la section `Solution` (3 blocs)**

  ```tsx
  function Solution() {
    return (
      <section className="py-20 border-t border-border">
        <div className="mx-auto max-w-[900px] px-6">
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted-foreground text-center mb-4">LA SOLUTION</p>
          <h2 className="text-center font-extrabold tracking-tight text-foreground mb-3"
              style={{ fontSize: 'clamp(26px, 3.5vw, 44px)', letterSpacing: '-0.035em' }}>
            Un environnement Claude pro.<br />Spécialisé business. Mis à jour à vie.
          </h2>
          <p className="text-center text-muted-foreground text-[16px] mb-12 max-w-[580px] mx-auto leading-relaxed">
            Claude Buildrs c'est le setup exact qu'on utilise pour construire des SaaS, des apps et des logiciels qui génèrent des revenus récurrents. Installé en une journée. Mis à jour en temps réel quand Claude sort une nouveauté.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {solutions.map((s) => (
              <div key={s.badge} className="rounded-xl border border-border bg-card p-6">
                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground mb-3">{s.badge}</p>
                <p className="text-[14px] text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }
  ```

- [ ] **Step 3 : Ajouter la section `BeforeAfter`**

  Copier le pattern de `BeforeAfter` de `LandingPage.tsx` (lignes 894-940), adapter le contenu :

  **Avant :**
  - "Tu copies des prompts depuis Twitter"
  - "Chaque conversation Claude repart de zéro"
  - "Tu ne sais pas ce qu'est un MCP ou un skill"
  - "On te dit que Claude est une révolution — et t'as toujours rien buildé"

  **Après :**
  - "Tu as un setup Claude configuré par des pros"
  - "Claude connaît ton projet et se souvient de tout"
  - "Skills + MCP + sub-agents tournent pour toi"
  - "Tu construis des produits qui génèrent des revenus récurrents"

- [ ] **Step 4 : Build et vérification**

  ```bash
  cd blueprint-app && npx vite build 2>&1 | tail -5
  ```

  Vérifier sections Pain, Solution, BeforeAfter sur `http://localhost:4000/#/claude`.

- [ ] **Step 5 : Commit**

  ```bash
  git add blueprint-app/src/components/ClaudeLandingPage.tsx
  git commit -m "feat(lp2): add Pain + Solution + BeforeAfter sections"
  ```

---

### Task 8 : Implémenter la section Programme (timeline 10 chapitres)

**Files:**
- Modify: `blueprint-app/src/components/ClaudeLandingPage.tsx`

- [ ] **Step 1 : Lire la section `Sprint` de `LandingPage.tsx` (lignes 1714-1805)**

  Comprendre le pattern timeline zigzag pour le reproduire.

- [ ] **Step 2 : Implémenter la section `Programme`**

  ```tsx
  function Programme({ onCTA }: { onCTA?: (e: React.MouseEvent) => void }) {
    return (
      <section id="programme" className="py-20 border-t border-border">
        <div className="mx-auto max-w-[900px] px-6">
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted-foreground text-center mb-4">LE PROGRAMME</p>
          <h2 className="text-center font-extrabold tracking-tight text-foreground mb-3"
              style={{ fontSize: 'clamp(26px, 3.5vw, 44px)', letterSpacing: '-0.035em' }}>
            10 chapitres. Un Claude opérationnel.
          </h2>
          <p className="text-center text-muted-foreground text-[16px] mb-14 max-w-[580px] mx-auto leading-relaxed">
            Chaque chapitre t'installe une brique. À la fin tu as un environnement complet, connecté, et spécialisé pour construire des produits rentables.
          </p>

          {/* Timeline zigzag */}
          <div className="flex flex-col gap-0">
            {chapters.map((ch, i) => (
              <div key={ch.n} className={`flex items-start gap-6 py-6 border-b border-border/50 ${i % 2 === 1 ? 'flex-row-reverse' : ''}`}>
                {/* Numéro */}
                <div className="flex-shrink-0 w-12 h-12 rounded-xl border border-border bg-secondary flex items-center justify-center">
                  <span className="font-mono font-bold text-foreground text-[14px]">{String(ch.n).padStart(2, '0')}</span>
                </div>
                {/* Contenu */}
                <div className={`flex-1 ${i % 2 === 1 ? 'text-right' : ''}`}>
                  <p className="font-bold text-foreground text-[16px] mb-1">{ch.title}</p>
                  <p className="text-[14px] text-muted-foreground leading-relaxed">{ch.sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Barre résultat */}
          <div className="mt-10 rounded-xl border border-border bg-secondary/50 p-6 text-center">
            <p className="text-[15px] font-semibold text-foreground">
              Ton Claude est configuré. Tes outils sont branchés. Tes agents sont prêts. Tu es opérationnel — spécialisé SaaS, apps et logiciels.
            </p>
          </div>

          {/* Bloc "Et demain ?" */}
          <div className="mt-6 rounded-xl border border-dashed border-border p-6">
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted-foreground mb-2">Et demain ?</p>
            <p className="text-[14px] text-muted-foreground leading-relaxed">
              Claude évolue. Ton setup aussi. Chaque fois qu'Anthropic sort une feature, on met à jour le chapitre concerné et tu reçois une notification dans ton dashboard : <span className="font-semibold text-foreground">'Nouvelle brique disponible — implémente-la en 5 minutes.'</span> Zéro veille à faire.
            </p>
          </div>
        </div>
      </section>
    )
  }
  ```

- [ ] **Step 3 : Build et vérification timeline**

  ```bash
  cd blueprint-app && npx vite build 2>&1 | tail -5
  ```

  Vérifier que le zigzag s'affiche correctement sur mobile et desktop.

- [ ] **Step 4 : Commit**

  ```bash
  git add blueprint-app/src/components/ClaudeLandingPage.tsx
  git commit -m "feat(lp2): add Programme section with 10-chapter timeline"
  ```

---

### Task 9 : Implémenter Dashboard + Exemples + Alfred + Pricing + FAQ + FinalCTA

**Files:**
- Modify: `blueprint-app/src/components/ClaudeLandingPage.tsx`

- [ ] **Step 1 : Ajouter la section `DashboardSection`**

  ```tsx
  function DashboardSection() {
    return (
      <section className="py-20 border-t border-border">
        <div className="mx-auto max-w-[900px] px-6">
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted-foreground text-center mb-4">LE PRODUIT</p>
          <h2 className="text-center font-extrabold tracking-tight text-foreground mb-3"
              style={{ fontSize: 'clamp(26px, 3.5vw, 44px)', letterSpacing: '-0.035em' }}>
            Pas un PDF. Pas un tuto. Un cockpit IA.
          </h2>
          <p className="text-center text-muted-foreground text-[16px] mb-10 max-w-[520px] mx-auto">
            Ton dashboard évolue avec Claude. Nouveaux chapitres, nouvelles configs, nouvelles briques — tu reçois tout automatiquement.
          </p>
          <DashboardPreview />
        </div>
      </section>
    )
  }
  ```

- [ ] **Step 2 : Ajouter la section `AlfredBlock` (crédibilité)**

  ```tsx
  function AlfredBlock() {
    return (
      <section className="py-16 border-t border-border">
        <div className="mx-auto max-w-[600px] px-6 text-center">
          <div className="w-16 h-16 rounded-full border border-border bg-secondary mx-auto mb-4 flex items-center justify-center">
            <span className="text-2xl font-bold text-foreground font-mono">A</span>
          </div>
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted-foreground mb-2">Alfred — Fondateur de Buildrs</p>
          <p className="text-[16px] text-muted-foreground leading-relaxed">
            "Cet environnement génère +25 000€/mois. 40+ produits construits. J'ai packagé le setup pour que tu l'aies en une journée."
          </p>
        </div>
      </section>
    )
  }
  ```

- [ ] **Step 3 : Ajouter la section `Pricing`**

  Copier le pattern de `Pricing` de `LandingPage.tsx` (lignes 1327-1478), adapter :
  - Titre : "Ce que tu reçois"
  - Prix barré : 97€ → 47€
  - Features : array `features` (8 items)
  - Bonus : titre section "POUR LES 200 PREMIERS", array `bonuses` (4 items)
  - Total : "Valeur totale : 1 235€" → "47€"
  - Scarcity : "XX/200 places réclamées"

- [ ] **Step 4 : Ajouter la section `FAQ`**

  Copier le pattern accordéon de `FAQ` de `LandingPage.tsx` (lignes 1482-1517), adapter avec l'array `faqs` de LP2.

- [ ] **Step 5 : Ajouter la section `FinalCTA`**

  ```tsx
  function FinalCTA({ onCTA }: { onCTA?: (e: React.MouseEvent) => void }) {
    return (
      <section className="py-20 border-t border-border">
        <div className="mx-auto max-w-[700px] px-6 text-center">
          <h2 className="font-extrabold tracking-tight text-foreground mb-4"
              style={{ fontSize: 'clamp(28px, 4vw, 52px)', letterSpacing: '-0.04em' }}>
            Arrête de regarder Claude évoluer sans toi.
          </h2>
          <p className="text-[16px] text-muted-foreground mb-8 leading-relaxed">
            Chaque jour sans le bon setup, c'est un jour où quelqu'un d'autre prend ta place. Installe l'environnement. Commence à builder.
          </p>
          <a href="#tarif" onClick={onCTA}
            className="cta-rainbow inline-flex items-center gap-2 rounded-[10px] bg-foreground px-8 py-4 text-[15px] font-semibold text-background hover:opacity-90 transition-opacity no-underline">
            Accéder au setup — 47€ (au lieu de 97€) →
          </a>
          <p className="mt-3 text-[12px] text-muted-foreground/60">Valeur réelle : 1 235€ · Paiement unique · Accès à vie</p>
          <div className="mt-6 mx-auto max-w-[280px]">
            <div className="h-[3px] rounded-full bg-border overflow-hidden">
              <div className="h-full rounded-full bg-foreground" style={{ width: '38%' }} />
            </div>
            <p className="mt-1.5 text-[11px] text-muted-foreground/50">XX/200 places réclamées · Ensuite 97€</p>
          </div>
        </div>
      </section>
    )
  }
  ```

- [ ] **Step 6 : Ajouter l'export `ClaudeLandingPage`**

  ```tsx
  export function ClaudeLandingPage({ onCTAClick }: { onCTAClick?: () => void }) {
    const go = (e: React.MouseEvent) => { e.preventDefault(); onCTAClick?.() }
    return (
      <>
        <Nav onCTA={go} />
        <main>
          <Hero onCTA={go} />
          <SaasMarquee />
          <Stats />
          <Pain />
          <Solution />
          <BeforeAfter />
          <Programme onCTA={go} />
          <DashboardSection />
          <AlfredBlock />
          <Pricing onCTA={go} />
          <FAQ />
          <FinalCTA onCTA={go} />
        </main>
        <StackedCircularFooter />
      </>
    )
  }
  ```

- [ ] **Step 7 : Build final et vérification complète**

  ```bash
  cd blueprint-app && npx vite build 2>&1 | tail -10
  pkill -f "serve dist" 2>/dev/null; npx serve dist --listen 4000 &
  ```

  Checklist visuelle sur `http://localhost:4000/#/claude` :
  - [ ] Nav avec CTA "Accéder au setup — 47€ →"
  - [ ] Hero complet avec scarcity bar
  - [ ] Toutes les sections présentes et dans le bon ordre
  - [ ] Section Pricing avec prix 47€ (97€ barré)
  - [ ] FAQ accordéon fonctionnel

  Checklist fonctionnelle sur `http://localhost:4000/#/checkout` (après clic CTA LP2) :
  - [ ] Titre "Claude Buildrs" (pas "Buildrs Blueprint")
  - [ ] Prix 47€ (pas 27€)
  - [ ] Order bump "Blueprint SaaS +27€"
  - [ ] Total dynamique 47€ ou 74€

- [ ] **Step 8 : Commit final**

  ```bash
  git add blueprint-app/src/components/ClaudeLandingPage.tsx
  git commit -m "feat(lp2): complete ClaudeLandingPage — all sections implemented"
  ```

---

## Chunk 4 : Analytics + Nettoyage final

**Files:**
- Modify: `blueprint-app/src/components/auth/SignupPage.tsx`

---

### Task 10 : Persister `acquisition_source` dans Supabase user_metadata

**Files:**
- Modify: `blueprint-app/src/components/auth/SignupPage.tsx`

- [ ] **Step 1 : Lire `SignupPage.tsx` pour comprendre l'appel `signUp`**

  Trouver l'appel à `supabase.auth.signUp()` et sa structure de `options.data`.

- [ ] **Step 2 : Ajouter `acquisition_source` dans `user_metadata` au signup**

  Dans la fonction de signup, avant ou dans l'appel `supabase.auth.signUp`, ajouter :

  ```ts
  const acquisitionSource = sessionStorage.getItem('funnelSource') ?? 'blueprint'

  await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        // ...champs existants
        acquisition_source: acquisitionSource,
      },
    },
  })
  ```

- [ ] **Step 3 : Même chose dans `SigninPage.tsx` si applicable**

  Si SigninPage a aussi un flow d'update metadata, ajouter pareillement. Sinon, passer.

- [ ] **Step 4 : Build final global**

  ```bash
  cd blueprint-app && npx vite build 2>&1 | tail -5
  ```

  S'assurer : 0 erreur TypeScript, 0 warning Vite critique.

- [ ] **Step 5 : Commit**

  ```bash
  git add blueprint-app/src/components/auth/SignupPage.tsx
  git commit -m "feat(analytics): track acquisition_source in Supabase user_metadata"
  ```

---

## Récap des fichiers touchés

| Fichier | Action | Pourquoi |
|---|---|---|
| `blueprint-app/src/App.tsx` | Modify | Route `#/claude`, state `funnelSource`, ConfirmationPage Pixel |
| `blueprint-app/src/components/ClaudeLandingPage.tsx` | **Create** | LP2 complète |
| `blueprint-app/src/components/CheckoutPage.tsx` | Modify | Prop `funnelSource`, prix dynamiques |
| `supabase/functions/create-checkout/index.ts` | Modify | Param `source`, produits Stripe dynamiques |
| `blueprint-app/src/components/auth/SignupPage.tsx` | Modify | `acquisition_source` dans user_metadata |

## Ce qui n'est PAS dans ce plan

- Déploiement Vercel prod (reporté)
- Déploiement Edge Function Supabase (reporté — à faire quand on valide le checkout en local)
- OTO post-achat 37€ (Phase 2)
