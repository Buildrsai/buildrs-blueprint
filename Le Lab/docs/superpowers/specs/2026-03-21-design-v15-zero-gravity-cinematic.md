# Buildrs Lab — Design V1.5 : Zero-Gravity Cinematic

**Date :** 2026-03-21
**Statut :** Approuvé
**Référence :** antigravity.google
**Priorité :** Avant le backend (pure frontend, aucune dépendance)

---

## Contexte

La V1 du design est fonctionnelle mais trop simple. L'objectif de la V1.5 est de rapprocher Buildrs Lab de l'esthétique Google Antigravity : particules rectangulaires, blinking cursor, dot grid, tool strip, scroll-reveal, feature sections 2-col, et parallax hero avec mesh gradient.

**Ce qui change :** 6 fichiers, 7 upgrades visuels.
**Ce qui ne change pas :** tokens de couleur, typographie Inter, design system existant.

---

## Observations antigravity.google

| Élément | Description |
|---------|-------------|
| Particules hero | Mini-rectangles 2×7px, multicolores (bleu/violet/gris), rotation aléatoire, drift lent |
| Particules dark | Rectangles bleus qui dérivent vers le HAUT — effet zéro-gravité |
| Blinking cursor | Curseur coloré clignotant à la fin du H1 hero |
| Dot grid | Grille de points statique sur la section pricing |
| Tool strip | Rangée de chips qui scrolle en boucle entre sections |
| Giant wordmark | Déjà implémenté ✓ |

---

## Upgrades V1.5

### ① Particules rectangles — `particles-background.tsx`

**Remplacement complet du système de particules existant (dots ronds → rectangles).**

- **Forme :** `width: 2px, height: 7px, border-radius: 1px`
- **Rotation :** aléatoire entre `-20deg` et `+20deg`
- **Mode LIGHT :**
  - Couleurs : `#3279F9` (30%) + `#7B6EF6` violet (25%) + `#CDD4DC` gris (45%)
  - Animation : drift lent flottant (`translateY 0 → -8px → 0`, 4-8s)
  - Densité : 60-80 particules
- **Mode DARK :**
  - Couleur : `#3279F9` uniquement, avec `box-shadow: 0 0 4px #3279F9`
  - Animation : drift vers le HAUT (`translateY 0 → -150px`, 5-10s, loop avec réapparition en bas)
  - Densité : 40-60 particules, positions Y randomisées pour décalage

### ② Blinking Cursor H1 — `home-page.tsx`

**Curseur bleu clignotant à la fin du headline hero.**

```tsx
<span className="inline-block w-[3px] h-[0.85em] bg-[#3279F9] ml-1 align-middle animate-[blink_1s_step-end_infinite]" />
```

- Ajout dans `globals.css` : `@keyframes blink { 0%,100% { opacity:1 } 50% { opacity:0 } }`
- Positionné après le dernier mot du H1, sur la même ligne
- Uniquement sur la `home-page.tsx`, pas dans les sections secondaires

### ③ Dot Grid Pricing — `pricing-page.tsx`

**Texture de points subtile en fond de la section pricing.**

```css
background-image: radial-gradient(#CDD4DC 1px, transparent 1px);
background-size: 20px 20px;
background-color: #F8F9FC;
```

- Appliqué en classe Tailwind via style inline ou `globals.css`
- Couvre toute la section pricing (pas les cards individuelles)

### ④ Tool Strip — nouveau composant `src/components/ui/tool-strip.tsx`

**Rangée de chips d'outils en défilement infini.**

```
Outils : Claude AI · Claude Code · Supabase · Vercel · GitHub · Stripe · Resend · Framer Motion · Magic UI · PostHog
```

- Chips pill : `bg-[#F8F9FC] border border-[#E6EAF0] rounded-full px-3 py-1.5 text-xs`
- Chaque chip a un dot coloré (couleur propre à l'outil) + nom texte
- Track dupliqué (×2) pour boucle seamless
- Animation : `translateX(0 → -50%)`, `25s linear infinite`
- Pause au hover : `animation-play-state: paused` sur hover du conteneur
- Bordures top/bottom `#E6EAF0`, fond blanc
- **Placement :** entre hero et première section features dans `home-page.tsx`

### ⑤ Scroll-Reveal — `src/hooks/use-scroll-reveal.ts`

**Hook IntersectionObserver réutilisable pour tous les éléments.**

```ts
// Usage
const ref = useScrollReveal<HTMLDivElement>({ delay: 0 });
// → ajoute className "reveal-visible" quand l'élément entre dans le viewport
```

- CSS dans `globals.css` :
  ```css
  .reveal-hidden { opacity: 0; transform: translateY(20px); }
  .reveal-visible { opacity: 1; transform: translateY(0); transition: opacity 300ms cubic-bezier(.25,.46,.45,.94), transform 300ms cubic-bezier(.25,.46,.45,.94); }
  ```
- Délais pour grilles : `delay: 0 | 100 | 200ms` (cascade)
- `threshold: 0.1` — déclenche dès que 10% visible
- **Éléments ciblés :** section headings, feature cards, pricing cards, badges

### ⑥ Feature Sections 2-col — `home-page.tsx`

**Restructuration des sections features en layout 2 colonnes.**

- Layout : `grid-cols-2 gap-16 items-center` (texte gauche, visuel droit — alternance)
- Titres left-aligned : `text-[54px] font-[400] tracking-[-0.73px] leading-[1.1]`
- Label au-dessus du titre : `text-[#3279F9] text-[11px] font-[600] tracking-[1px] uppercase`
- **Hover sur les cards features :**
  - `scale(1.01)` + `border-color: #3279F9` + `box-shadow: 0 0 0 3px rgba(50,121,249,0.12)`
  - Transition : `200ms ease-out`
- Visuel côté droit : screenshot produit mockup ou illustration dans une card `bg-[#EFF2F7] rounded-2xl`

### ⑦ Parallax Hero + Mesh Gradient — `home-page.tsx`

**Effet de profondeur et gradient subtil sur le hero.**

**Mesh gradient (statique) :**
```css
background: radial-gradient(ellipse 80% 50% at 50% -10%, rgba(50,121,249,0.06) 0%, transparent 70%), #F8F9FC;
```

**Parallax (dynamique) :**
```tsx
// requestAnimationFrame sur scroll
headlineEl.style.transform = `translateY(${scrollY * 0.1}px)`;
particlesEl.style.transform = `translateY(${scrollY * 0.3}px)`;
```

- Implémenté via `useEffect` + `requestAnimationFrame`
- Désactivé si `window.matchMedia('(prefers-reduced-motion: reduce)').matches`
- Désactivé sur mobile (`window.innerWidth < 768`)

---

## Fichiers impactés

| Fichier | Action |
|---------|--------|
| `src/components/ui/particles-background.tsx` | Réécriture complète |
| `src/components/ui/tool-strip.tsx` | Création |
| `src/hooks/use-scroll-reveal.ts` | Création |
| `src/app/(public)/home-page.tsx` | Upgrades ②④⑤⑥⑦ |
| `src/app/(public)/pricing-page.tsx` | Upgrade ③ |
| `src/styles/globals.css` | Ajout keyframes blink + classes reveal |

---

## Ce qui ne change PAS

- Tokens de couleur (palette Antigravity déjà appliquée)
- Typographie Inter Variable
- Composants UI de base (Button, Card, Badge, Input)
- Architecture React + Vite + Tailwind
- Pages authentifiées (dashboard, project, phase, settings)

---

## Critères de succès

- [ ] Particules rectangulaires visibles et animées sur hero light et sections dark
- [ ] Cursor clignotant bleu présent sur H1 hero
- [ ] Dot grid visible (subtil) sur section pricing
- [ ] Tool strip défile sans interruption, pause au hover
- [ ] Scroll-reveal déclenche sur tous les éléments ciblés
- [ ] Feature sections en 2-col sur desktop, 1-col sur mobile
- [ ] Parallax perceptible mais non dérangeant (max 10% scroll offset sur headline)
- [ ] `prefers-reduced-motion` respecté (parallax désactivé)
- [ ] Aucun régression sur les pages authentifiées
- [ ] Dev server sans erreurs TypeScript

---

## Ordre d'implémentation recommandé

1. `globals.css` — keyframes + classes reveal (base)
2. `particles-background.tsx` — upgrade rectangles (impact visuel immédiat)
3. `tool-strip.tsx` — nouveau composant
4. `use-scroll-reveal.ts` — hook
5. `home-page.tsx` — cursor + tool strip + scroll-reveal + 2-col + parallax
6. `pricing-page.tsx` — dot grid
