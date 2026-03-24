# Buildrs Blueprint Ad V2 — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Créer une composition Remotion `BlueprintAdV2` — pub Meta Feed 4:5, 45s, dark Buildrs — avec hook aspirationnel, rafale transformation, timeline J1→J6, MRR animé et CTA rainbow.

**Architecture:** Extraction des utilitaires partagés dans `src/shared.tsx`, puis implémentation scène par scène dans `src/BlueprintAdV2.tsx`. Chaque scène est un composant React indépendant monté dans une `<Sequence>`. Vérification visuelle dans Remotion Studio après chaque scène.

**Tech Stack:** Remotion 4.x, React 19, TypeScript, `@remotion/google-fonts` (Geist + Instrument Serif)

**Spec:** `docs/superpowers/specs/2026-03-24-buildrs-blueprint-ad-design.md`

**Studio :** `npm run studio` → http://localhost:3000 → composition `BlueprintAdV2`

---

## Frame Map (30 fps · 1350 frames · 45s)

| Scène | Frames | Durée |
|-------|--------|-------|
| 1 — Hook | 0–150 | 5s |
| 2 — Rafale (8 bullets × 45f) | 150–510 | 12s |
| 3 — Pivot | 510–690 | 6s |
| 4 — Timeline J1→J6 (6×75f) | 690–1140 | 15s |
| 5 — Résultat MRR + Liberté | 1140–1290 | 5s |
| 6 — CTA | 1290–1350 | 2s |

---

## Chunk 1: Fondations — shared utilities + composition skeleton

### Task 1: Extraire les utilitaires partagés dans `src/shared.tsx`

**Files:**
- Create: `src/shared.tsx`

- [ ] **Step 1: Créer `src/shared.tsx`** avec design tokens, helpers d'animation et composants visuels réutilisables

```tsx
// src/shared.tsx
import React from 'react';
import { AbsoluteFill, interpolate, spring } from 'remotion';

// ─── Design Tokens ───────────────────────────────────────────────────────────
export const BG       = '#09090b';
export const WHITE    = '#fafafa';
export const GREEN    = '#22c55e';
export const ORANGE   = 'rgba(250,134,54,0.9)';
export const RED      = '#ef4444';
export const GRAY     = 'rgba(250,250,250,0.55)';
export const GRAY_DIM = 'rgba(250,250,250,0.28)';
export const BORDER   = 'rgba(250,250,250,0.09)';

// ─── Animation Helpers ───────────────────────────────────────────────────────
/** fade in */
export const fi = (frame: number, from = 0, dur = 18) =>
  interpolate(frame - from, [0, dur], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

/** fade out */
export const fo = (frame: number, from = 0, dur = 14) =>
  interpolate(frame - from, [0, dur], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

/** slide up */
export const su = (frame: number, from = 0, dur = 18, dist = 60) =>
  interpolate(frame - from, [0, dur], [dist, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

/** spring pop */
export const pop = (frame: number, fps: number, from = 0, stiffness = 120) =>
  spring({ fps, frame: frame - from, config: { damping: 200, stiffness } });

/** typewriter */
export const tw = (frame: number, text: string, start: number, end: number) =>
  text.slice(0, Math.floor(interpolate(frame, [start, end], [0, text.length], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })));

// ─── Cursor ───────────────────────────────────────────────────────────────────
export const Cursor: React.FC<{ frame: number; color?: string }> = ({ frame, color = WHITE }) =>
  <span style={{ opacity: frame % 14 < 7 ? 1 : 0, color }}>|</span>;

// ─── Dots Pattern ────────────────────────────────────────────────────────────
export const Dots: React.FC<{ opacity?: number }> = ({ opacity = 1 }) => (
  <AbsoluteFill style={{
    backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.12) 1px, transparent 1px)',
    backgroundSize: '28px 28px',
    opacity,
  }} />
);

// ─── Glow ────────────────────────────────────────────────────────────────────
export const Glow: React.FC<{
  color?: string;
  size?: number;
  top?: string;
  left?: string;
  opacity?: number;
}> = ({ color = 'rgba(34,197,94,0.10)', size = 900, top = '50%', left = '50%', opacity = 1 }) => (
  <AbsoluteFill>
    <div style={{
      position: 'absolute', top, left,
      width: size, height: size,
      transform: 'translate(-50%,-50%)',
      borderRadius: '50%',
      background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
      opacity, pointerEvents: 'none',
    }} />
  </AbsoluteFill>
);

// ─── Badge Pill ───────────────────────────────────────────────────────────────
export const Badge: React.FC<{
  text: string;
  opacity?: number;
  translateY?: number;
  color?: string;
  borderColor?: string;
  bgColor?: string;
}> = ({ text, opacity = 1, translateY = 0, color = GREEN, borderColor = 'rgba(34,197,94,0.28)', bgColor = 'rgba(34,197,94,0.08)' }) => (
  <div style={{
    opacity, transform: `translateY(${translateY}px)`,
    display: 'inline-flex', alignItems: 'center', gap: 12,
    background: bgColor,
    border: `1px solid ${borderColor}`,
    borderRadius: 999,
    padding: '12px 28px',
    fontFamily: "'Geist', system-ui, sans-serif",
    fontSize: 28, fontWeight: 500,
    letterSpacing: '-0.01em', color,
    whiteSpace: 'nowrap',
  }}>
    <span style={{ width: 8, height: 8, borderRadius: '50%', background: color, display: 'inline-block', flexShrink: 0 }} />
    {text}
  </div>
);
```

- [ ] **Step 2: Vérifier que `src/shared.tsx` compile sans erreur**

```bash
cd "/Users/alfredorsini/CLAUDE/###BLUEPRINT BUILDRS/Remotion"
npx tsc --noEmit 2>&1 | head -20
```
Attendu : 0 erreur (ou erreurs non liées au nouveau fichier)

- [ ] **Step 3: Commit**

```bash
cd "/Users/alfredorsini/CLAUDE/###BLUEPRINT BUILDRS/Remotion"
git add src/shared.tsx
git commit -m "feat(ad-v2): extract shared tokens, helpers & visual components"
```

---

### Task 2: Registrer la composition dans `Root.tsx` et créer le squelette `BlueprintAdV2.tsx`

**Files:**
- Create: `src/BlueprintAdV2.tsx`
- Modify: `src/Root.tsx`
- Modify: `package.json`

- [ ] **Step 1: Créer `src/BlueprintAdV2.tsx` — squelette vide**

```tsx
// src/BlueprintAdV2.tsx
import React from 'react';
import {
  AbsoluteFill,
  Audio,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
  staticFile,
} from 'remotion';
import {
  loadFont as loadGeist,
  fontFamily as geistFamily,
} from '@remotion/google-fonts/Geist';
import {
  loadFont as loadSerif,
  fontFamily as serifFamily,
} from '@remotion/google-fonts/InstrumentSerif';
import { BG, WHITE, GREEN, ORANGE, RED, Dots, Glow, Badge, fi, fo, su, pop, tw, Cursor } from './shared';

const { waitUntilDone: waitGeist } = loadGeist('normal', { weights: ['400','600','700','800'], subsets: ['latin'] });
const { waitUntilDone: waitSerif } = loadSerif('italic', { weights: ['400'], subsets: ['latin'] });

const SANS  = `'${geistFamily}', system-ui, sans-serif`;
const SERIF = `'${serifFamily}', Georgia, serif`;

// ─── Scènes (placeholders) ───────────────────────────────────────────────────
const SceneHook: React.FC         = () => { const f = useCurrentFrame(); return <AbsoluteFill style={{ background: BG, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Dots opacity={0.6} /><div style={{ color: WHITE, fontFamily: SANS, fontSize: 60, fontWeight: 800 }}>HOOK</div></AbsoluteFill>; };
const SceneRafale: React.FC       = () => { const f = useCurrentFrame(); return <AbsoluteFill style={{ background: BG, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Dots opacity={0.6} /><div style={{ color: GREEN, fontFamily: SANS, fontSize: 60, fontWeight: 800 }}>RAFALE</div></AbsoluteFill>; };
const ScenePivot: React.FC        = () => <AbsoluteFill style={{ background: BG, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Dots opacity={0.6} /><div style={{ color: WHITE, fontFamily: SANS, fontSize: 60, fontWeight: 800 }}>PIVOT</div></AbsoluteFill>;
const SceneTimeline: React.FC     = () => <AbsoluteFill style={{ background: BG, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Dots opacity={0.6} /><div style={{ color: GREEN, fontFamily: SANS, fontSize: 60, fontWeight: 800 }}>TIMELINE</div></AbsoluteFill>;
const SceneResultat: React.FC     = () => <AbsoluteFill style={{ background: BG, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Dots opacity={0.6} /><div style={{ color: WHITE, fontFamily: SANS, fontSize: 60, fontWeight: 800 }}>RÉSULTAT</div></AbsoluteFill>;
const SceneCTA: React.FC          = () => <AbsoluteFill style={{ background: BG, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Dots opacity={0.6} /><div style={{ color: WHITE, fontFamily: SANS, fontSize: 60, fontWeight: 800 }}>CTA</div></AbsoluteFill>;

// ─── Composition principale ───────────────────────────────────────────────────
export const BlueprintAdV2: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: BG }}>
      {/* Music — décommenter quand public/music.mp3 est présent */}
      {/* <Audio src={staticFile('music.mp3')} volume={0.18} /> */}

      <Sequence from={0}    durationInFrames={150}><SceneHook /></Sequence>
      <Sequence from={150}  durationInFrames={360}><SceneRafale /></Sequence>
      <Sequence from={510}  durationInFrames={180}><ScenePivot /></Sequence>
      <Sequence from={690}  durationInFrames={450}><SceneTimeline /></Sequence>
      <Sequence from={1140} durationInFrames={150}><SceneResultat /></Sequence>
      <Sequence from={1290} durationInFrames={60}><SceneCTA /></Sequence>
    </AbsoluteFill>
  );
};
```

- [ ] **Step 2: Ajouter `BlueprintAdV2` dans `src/Root.tsx`**

Ajouter après la composition `BuildrsBlueprintAd` existante :

```tsx
import {BlueprintAdV2} from './BlueprintAdV2';

// Dans le return de Root, ajouter :
<Composition
  id="BlueprintAdV2"
  component={BlueprintAdV2}
  durationInFrames={1350}
  width={1080}
  height={1350}
  fps={30}
  defaultProps={{}}
/>
```

⚠️ Format 4:5 = **1080×1350** (pas 1080×1920 qui est 9:16)

- [ ] **Step 3: Ajouter le script render dans `package.json`**

```json
"render:blueprint-v2": "remotion render src/index.ts BlueprintAdV2 out/BlueprintAdV2.mp4"
```

- [ ] **Step 4: Vérifier dans Studio que la composition apparaît**

```bash
cd "/Users/alfredorsini/CLAUDE/###BLUEPRINT BUILDRS/Remotion"
npm run studio
```
Ouvrir http://localhost:3000 → vérifier que `BlueprintAdV2` est listée et que les 6 scènes placeholder défilent sans erreur.

- [ ] **Step 5: Commit**

```bash
git add src/BlueprintAdV2.tsx src/Root.tsx package.json
git commit -m "feat(ad-v2): composition skeleton — 6 scene placeholders, 1080×1350 4:5"
```

---

## Chunk 2: Scène 1 (Hook) + Scène 2 (Rafale)

### Task 3: SceneHook — frames 0–150

**Objectif :** "Tu rêves de lancer un business avec l'IA mais tu sais pas par où démarrer ?" — texte massif word-by-word, dots pattern, glow blanc.

**Files:**
- Modify: `src/BlueprintAdV2.tsx` (remplacer placeholder SceneHook)

- [ ] **Step 1: Remplacer le placeholder `SceneHook` par l'implémentation**

```tsx
const HOOK_LINE1 = "Tu rêves de lancer un business avec l'IA";
const HOOK_LINE2 = "mais tu sais pas par où démarrer ?";

const SceneHook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const glowPulse = interpolate(
    Math.sin((frame / 30) * Math.PI),
    [-1, 1], [0.04, 0.12],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Line 1 apparaît frames 10–55, line 2 frames 30–80
  const line1Opacity = fi(frame, 10, 14);
  const line1Y       = su(frame, 10, 14, 50);
  const line2Opacity = fi(frame, 30, 14);
  const line2Y       = su(frame, 30, 14, 50);

  // Word-by-word
  const line1Words = tw(frame, HOOK_LINE1, 10, 60);
  const line2Words = tw(frame, HOOK_LINE2, 35, 90);

  return (
    <AbsoluteFill style={{ background: BG }}>
      <Dots opacity={0.6} />
      <Glow color={`rgba(250,250,250,${glowPulse})`} size={1000} />
      <AbsoluteFill style={{
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '0 72px', gap: 24,
        textAlign: 'center',
      }}>
        <div style={{
          opacity: line1Opacity,
          transform: `translateY(${line1Y}px)`,
          fontFamily: SANS, fontSize: 80, fontWeight: 800,
          letterSpacing: '-0.04em', color: WHITE,
          lineHeight: 1.05,
        }}>
          {line1Words}
          {line1Words.length < HOOK_LINE1.length && <Cursor frame={frame} />}
        </div>
        <div style={{
          opacity: line2Opacity,
          transform: `translateY(${line2Y}px)`,
          fontFamily: SANS, fontSize: 80, fontWeight: 800,
          letterSpacing: '-0.04em', color: WHITE,
          lineHeight: 1.05,
        }}>
          {line2Words}
          {line2Words.length < HOOK_LINE2.length && <Cursor frame={frame} />}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
```

Il faudra aussi ajouter cet import en haut du fichier :
```tsx
import { interpolate } from 'remotion';
```

- [ ] **Step 2: Vérifier dans Studio**

Dans Studio, naviguer à `BlueprintAdV2`, frame 0–150. Vérifier :
- [ ] Fond noir avec dots
- [ ] Glow blanc doux pulsant
- [ ] Ligne 1 apparaît et s'écrit
- [ ] Ligne 2 apparaît ensuite
- [ ] Texte massif centré

- [ ] **Step 3: Commit**

```bash
git add src/BlueprintAdV2.tsx
git commit -m "feat(ad-v2): scene 1 — hook word-by-word aspirational"
```

---

### Task 4: SceneRafale — frames 150–510 (8 bullets × 45 frames)

**Objectif :** 8 bullets qui s'enchaînent plein écran, chacun remplace le précédent avec spring pop-in.

**Files:**
- Modify: `src/BlueprintAdV2.tsx` (remplacer placeholder SceneRafale)

- [ ] **Step 1: Définir les bullets et remplacer `SceneRafale`**

```tsx
const BULLETS = [
  { text: "SaaS · app · logiciel",                  color: WHITE  },
  { text: "Sans écrire une ligne de code",            color: WHITE  },
  { text: "Moins de 100€ de budget",                 color: WHITE  },
  { text: "Rentable dès le premier mois",             color: WHITE  },
  { text: "Revenus récurrents — chaque mois",         color: GREEN  },
  { text: "Devenir un chef d'orchestre IA",           color: WHITE  },
  { text: "Bosser d'où tu veux, quand tu veux",      color: WHITE  },
  { text: "Tes IA travaillent pendant que tu dors",  color: GREEN  },
] as const;

const BULLET_DURATION = 45; // frames par bullet (1.5s)

const SceneRafale: React.FC = () => {
  const frame = useCurrentFrame(); // relatif à la Sequence (commence à 0)
  const { fps } = useVideoConfig();

  const currentIndex = Math.min(
    Math.floor(frame / BULLET_DURATION),
    BULLETS.length - 1
  );
  const localFrame = frame - currentIndex * BULLET_DURATION;

  const bullet = BULLETS[currentIndex];
  const isLast = currentIndex === BULLETS.length - 1;

  const scale    = pop(localFrame, fps, 0, 180);
  const opacity  = fi(localFrame, 0, 8);
  // Fade out à la fin de chaque bullet sauf le dernier
  const fadeOut  = !isLast && localFrame > BULLET_DURATION - 10
    ? fo(localFrame, BULLET_DURATION - 10, 8)
    : 1;

  const glowOpacity = interpolate(
    Math.sin((frame / 20) * Math.PI),
    [-1, 1], [0.06, 0.18],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <AbsoluteFill style={{ background: BG }}>
      <Dots opacity={0.55} />
      <Glow
        color={`rgba(34,197,94,${glowOpacity})`}
        size={800}
        opacity={currentIndex >= 4 ? 1 : 0.4}
      />
      <AbsoluteFill style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '0 72px',
      }}>
        {/* Flèche verte */}
        <div style={{
          position: 'absolute',
          top: '38%',
          left: 72,
          fontFamily: SANS, fontSize: 72, color: GREEN,
          opacity: opacity * fadeOut,
          transform: `scale(${scale})`,
          fontWeight: 800,
        }}>→</div>

        {/* Texte bullet */}
        <div style={{
          opacity: opacity * fadeOut,
          transform: `scale(${scale})`,
          fontFamily: SANS,
          fontSize: isLast ? 88 : 76,
          fontWeight: 800,
          letterSpacing: '-0.04em',
          color: bullet.color,
          textAlign: 'center',
          lineHeight: 1.1,
          maxWidth: 900,
        }}>
          {bullet.text}
        </div>

        {/* Numéro discret */}
        <div style={{
          position: 'absolute', bottom: 80, right: 72,
          fontFamily: SANS, fontSize: 24, color: 'rgba(250,250,250,0.18)',
          fontWeight: 600,
        }}>
          {currentIndex + 1}/8
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
```

- [ ] **Step 2: Vérifier dans Studio — frames 150–510**

Vérifier :
- [ ] Chaque bullet apparaît bien à intervalles de 45f
- [ ] Spring pop-in fluide
- [ ] "Revenus récurrents" et dernier bullet en vert
- [ ] Dernier bullet plus gros
- [ ] Fond noir + glow vert qui monte progressivement

- [ ] **Step 3: Commit**

```bash
git add src/BlueprintAdV2.tsx
git commit -m "feat(ad-v2): scene 2 — bullet blast rafale transformation (8×45f)"
```

---

## Chunk 3: Scène 3 (Pivot) + Scène 4 (Timeline)

### Task 5: ScenePivot — frames 510–690

**Objectif :** Transition — hook C + logo Buildrs + badges "Claude comme moteur" + "Buildrs Blueprint".

**Files:**
- Modify: `src/BlueprintAdV2.tsx`

- [ ] **Step 1: Remplacer `ScenePivot`**

```tsx
const BuildrsHashIcon: React.FC<{ size?: number }> = ({ size = 52 }) => (
  <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
    <rect x="1" y="1" width="26" height="26" rx="6" stroke={WHITE} strokeWidth="1.8" />
    <line x1="9" y1="5" x2="9" y2="23" stroke={WHITE} strokeWidth="1.8" strokeLinecap="round" />
    <line x1="19" y1="5" x2="19" y2="23" stroke={WHITE} strokeWidth="1.8" strokeLinecap="round" />
    <line x1="5" y1="10" x2="23" y2="10" stroke={WHITE} strokeWidth="1.8" strokeLinecap="round" />
    <line x1="5" y1="18" x2="23" y2="18" stroke={WHITE} strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const ScenePivot: React.FC = () => {
  const frame = useCurrentFrame(); // relatif à la Sequence
  const { fps } = useVideoConfig();

  const LINE1 = "Comment j'ai lancé mon app en 6 jours —";
  const LINE2 = "sans savoir coder.";

  const logoScale   = pop(frame, fps, 0, 200);
  const logoOpacity = fi(frame, 0, 12);

  const l1Opacity   = fi(frame, 18, 14);
  const l1Y         = su(frame, 18, 14, 40);
  const l2Opacity   = fi(frame, 36, 14);
  const l2Y         = su(frame, 36, 14, 40);

  const badge1Opacity = fi(frame, 70, 12);
  const badge1Y       = su(frame, 70, 12, 30);
  const badge2Opacity = fi(frame, 84, 12);
  const badge2Y       = su(frame, 84, 12, 30);

  return (
    <AbsoluteFill style={{ background: BG }}>
      <Dots opacity={0.55} />
      <Glow color="rgba(34,197,94,0.12)" size={900} />

      <AbsoluteFill style={{
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '0 72px', gap: 32, textAlign: 'center',
      }}>
        {/* Logo Buildrs */}
        <div style={{
          opacity: logoOpacity,
          transform: `scale(${logoScale})`,
          display: 'flex', alignItems: 'center', gap: 16,
          marginBottom: 16,
        }}>
          <BuildrsHashIcon size={48} />
          <span style={{
            fontFamily: SANS, fontSize: 44, fontWeight: 800,
            letterSpacing: '-0.04em', color: WHITE,
          }}>Buildrs</span>
        </div>

        {/* Ligne 1 */}
        <div style={{
          opacity: l1Opacity, transform: `translateY(${l1Y}px)`,
          fontFamily: SANS, fontSize: 68, fontWeight: 800,
          letterSpacing: '-0.04em', color: WHITE, lineHeight: 1.05,
        }}>
          {LINE1}
        </div>

        {/* Ligne 2 — en vert */}
        <div style={{
          opacity: l2Opacity, transform: `translateY(${l2Y}px)`,
          fontFamily: SANS, fontSize: 68, fontWeight: 800,
          letterSpacing: '-0.04em', color: GREEN, lineHeight: 1.05,
        }}>
          {LINE2}
        </div>

        {/* Badges */}
        <div style={{
          display: 'flex', gap: 20, flexWrap: 'wrap', justifyContent: 'center',
          marginTop: 16,
        }}>
          <div style={{ opacity: badge1Opacity, transform: `translateY(${badge1Y}px)` }}>
            <Badge
              text="⚡ Claude comme moteur"
              color={ORANGE}
              borderColor="rgba(250,134,54,0.30)"
              bgColor="rgba(250,134,54,0.08)"
            />
          </div>
          <div style={{ opacity: badge2Opacity, transform: `translateY(${badge2Y}px)` }}>
            <Badge text="Buildrs Blueprint" />
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
```

- [ ] **Step 2: Vérifier dans Studio — frames 510–690**

Vérifier :
- [ ] Logo Buildrs pop-in spring
- [ ] 2 lignes de texte apparaissent en séquence
- [ ] "sans savoir coder." bien en vert
- [ ] 2 badges apparaissent en dernier

- [ ] **Step 3: Commit**

```bash
git add src/BlueprintAdV2.tsx
git commit -m "feat(ad-v2): scene 3 — pivot blueprint reveal + claude badge"
```

---

### Task 6: SceneTimeline — frames 690–1140 (6 jours × 75 frames)

**Objectif :** Diagramme vertical J1→J6, chaque ligne s'allume + checkmark vert, 2.5s par jour.

**Files:**
- Modify: `src/BlueprintAdV2.tsx`

- [ ] **Step 1: Remplacer `SceneTimeline`**

```tsx
const DAYS = [
  { label: 'J1', text: 'Idée validée · brief produit',                   highlight: false },
  { label: 'J2', text: 'Design + stack (Supabase · Vercel · Stripe)',     highlight: false },
  { label: 'J3', text: 'Build avec Claude — feature principale',          highlight: true  }, // orange
  { label: 'J4', text: 'Auth + paiement Stripe',                          highlight: false },
  { label: 'J5', text: 'Deploy live · domaine · emails',                  highlight: false },
  { label: 'J6', text: 'Lancement · premiers €',                          highlight: true  }, // vert fort
] as const;

const DAY_DURATION = 75; // frames par jour (2.5s)

const SceneTimeline: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const activeDay = Math.min(Math.floor(frame / DAY_DURATION), DAYS.length - 1);
  const dayProgress = (frame - activeDay * DAY_DURATION) / DAY_DURATION;

  return (
    <AbsoluteFill style={{ background: BG }}>
      <Dots opacity={0.5} />
      <Glow color="rgba(34,197,94,0.08)" size={1100} top="60%" />

      <AbsoluteFill style={{
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center',
        padding: '80px 80px',
        gap: 0,
      }}>
        {/* Titre */}
        <div style={{
          opacity: fi(frame, 0, 14),
          fontFamily: SANS, fontSize: 36, fontWeight: 600,
          color: 'rgba(250,250,250,0.4)',
          letterSpacing: '-0.02em',
          marginBottom: 48,
        }}>
          Le plan en 6 jours
        </div>

        {/* Lignes timeline */}
        {DAYS.map((day, i) => {
          const isActive  = i === activeDay;
          const isPast    = i < activeDay;
          const lineFrame = frame - i * DAY_DURATION;

          const rowOpacity = isPast ? 1 : isActive ? fi(lineFrame, 0, 12) : 0.18;
          const rowY       = isActive ? su(lineFrame, 0, 12, 20) : 0;
          const checkScale = (isPast || (isActive && dayProgress > 0.7))
            ? pop(Math.max(lineFrame - Math.floor(DAY_DURATION * 0.7), 0), fps, 0, 300)
            : 0;
          const showCheck  = isPast || (isActive && dayProgress > 0.7);

          const textColor  = isPast
            ? 'rgba(250,250,250,0.45)'
            : isActive
              ? (i === 2 ? ORANGE : i === 5 ? GREEN : WHITE)
              : 'rgba(250,250,250,0.18)';

          const labelBg    = isPast
            ? 'rgba(34,197,94,0.10)'
            : isActive ? 'rgba(34,197,94,0.20)' : 'rgba(250,250,250,0.04)';
          const labelColor = isPast || isActive ? GREEN : 'rgba(250,250,250,0.3)';

          return (
            <div key={day.label} style={{
              display: 'flex', alignItems: 'center', gap: 24,
              opacity: rowOpacity,
              transform: `translateY(${rowY}px)`,
              padding: '20px 0',
              borderBottom: i < DAYS.length - 1 ? '1px solid rgba(250,250,250,0.06)' : 'none',
            }}>
              {/* Label jour */}
              <div style={{
                background: labelBg,
                border: `1px solid ${isActive || isPast ? 'rgba(34,197,94,0.25)' : 'rgba(250,250,250,0.08)'}`,
                borderRadius: 8, padding: '8px 16px',
                fontFamily: SANS, fontSize: 26, fontWeight: 800,
                color: labelColor, width: 72, textAlign: 'center', flexShrink: 0,
              }}>
                {day.label}
              </div>

              {/* Texte */}
              <div style={{
                fontFamily: SANS, fontSize: 38, fontWeight: isActive ? 700 : 500,
                letterSpacing: '-0.02em', color: textColor, flex: 1,
              }}>
                {day.text}
              </div>

              {/* Checkmark */}
              <div style={{
                opacity: showCheck ? 1 : 0,
                transform: `scale(${checkScale})`,
                color: GREEN, fontSize: 42, flexShrink: 0,
              }}>
                ✓
              </div>
            </div>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
```

- [ ] **Step 2: Vérifier dans Studio — frames 690–1140**

Vérifier :
- [ ] Chaque jour s'allume à intervalles de 75f
- [ ] Jours passés restent visibles mais atténués
- [ ] Checkmark pop-in spring pour chaque jour validé
- [ ] J3 (Claude) en orange, J6 (Lancement) en vert plus lumineux
- [ ] J6 checkmark bien visible

- [ ] **Step 3: Commit**

```bash
git add src/BlueprintAdV2.tsx
git commit -m "feat(ad-v2): scene 4 — timeline j1→j6 avec checkmarks animés"
```

---

## Chunk 4: Scène 5 (Résultat) + Scène 6 (CTA) + Musique

### Task 7: SceneResultat — frames 1140–1290

**Objectif :** Compteur MRR animé, "0 patron · 0 dev · 0 bureau.", stats clés, stack logos.

**Files:**
- Modify: `src/BlueprintAdV2.tsx`

- [ ] **Step 1: Remplacer `SceneResultat`**

```tsx
const STACK_LOGOS = ['Claude', 'Lovable', 'Supabase', 'Stripe', 'Vercel', 'GitHub'];

const SceneResultat: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // MRR counter — monte de 0 à 890 sur les 80 premières frames
  const mrrValue = Math.floor(
    interpolate(frame, [10, 90], [0, 890], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  );

  const libertéOpacity = fi(frame, 80, 14);
  const libertéY       = su(frame, 80, 14, 30);

  const statsOpacity = fi(frame, 100, 12);
  const statsY       = su(frame, 100, 12, 30);

  const logosOpacity = fi(frame, 120, 12);

  // Marquee logos
  const logoOffset = interpolate(frame, [120, 150], [0, -1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ background: BG }}>
      <Dots opacity={0.5} />
      <Glow color="rgba(34,197,94,0.15)" size={1000} />

      <AbsoluteFill style={{
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '0 72px', gap: 36, textAlign: 'center',
      }}>
        {/* MRR Counter */}
        <div style={{ opacity: fi(frame, 0, 12) }}>
          <div style={{
            fontFamily: SANS, fontSize: 28, fontWeight: 600,
            color: 'rgba(250,250,250,0.4)', letterSpacing: '-0.01em',
            marginBottom: 8,
          }}>
            MRR mensuel
          </div>
          <div style={{
            fontFamily: SANS, fontSize: 120, fontWeight: 800,
            letterSpacing: '-0.06em', color: GREEN,
            lineHeight: 1,
          }}>
            +{mrrValue}€
          </div>
          <div style={{
            fontFamily: SANS, fontSize: 28, fontWeight: 500,
            color: 'rgba(250,250,250,0.35)', marginTop: 8,
          }}>
            /mois
          </div>
        </div>

        {/* Liberté */}
        <div style={{
          opacity: libertéOpacity, transform: `translateY(${libertéY}px)`,
          fontFamily: SANS, fontSize: 52, fontWeight: 800,
          letterSpacing: '-0.03em', color: WHITE,
        }}>
          0 patron · 0 dev · 0 bureau.
        </div>

        {/* Stats */}
        <div style={{
          opacity: statsOpacity, transform: `translateY(${statsY}px)`,
          display: 'flex', gap: 36, alignItems: 'center', justifyContent: 'center',
        }}>
          {[
            { value: '27€', label: 'Prix unique' },
            { value: '6j', label: 'De l\'idée au live', color: GREEN },
            { value: '0', label: 'Ligne de code' },
          ].map(stat => (
            <div key={stat.value} style={{ textAlign: 'center' }}>
              <div style={{
                fontFamily: SANS, fontSize: 64, fontWeight: 800,
                letterSpacing: '-0.04em', color: stat.color || WHITE,
              }}>
                {stat.value}
              </div>
              <div style={{
                fontFamily: SANS, fontSize: 24, fontWeight: 500,
                color: 'rgba(250,250,250,0.4)',
              }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Stack logos */}
        <div style={{ opacity: logosOpacity, overflow: 'hidden', width: '100%' }}>
          <div style={{
            display: 'flex', gap: 32, justifyContent: 'center',
            flexWrap: 'wrap',
          }}>
            {STACK_LOGOS.map(logo => (
              <div key={logo} style={{
                background: 'rgba(250,250,250,0.04)',
                border: '1px solid rgba(250,250,250,0.10)',
                borderRadius: 10, padding: '10px 20px',
                fontFamily: SANS, fontSize: 24, fontWeight: 600,
                color: 'rgba(250,250,250,0.6)',
              }}>
                {logo}
              </div>
            ))}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
```

- [ ] **Step 2: Vérifier dans Studio — frames 1140–1290**

Vérifier :
- [ ] Compteur MRR monte de 0 à +890€ (chiffre lisible)
- [ ] "0 patron · 0 dev · 0 bureau." apparaît après
- [ ] Stats 27€ / 6j / 0 code apparaissent
- [ ] Stack logos visibles

- [ ] **Step 3: Commit**

```bash
git add src/BlueprintAdV2.tsx
git commit -m "feat(ad-v2): scene 5 — mrr counter + liberté + stats"
```

---

### Task 8: SceneCTA — frames 1290–1350

**Objectif :** buildrs.fr — bouton rainbow glow animé — prix 27€ — logo Buildrs.

**Files:**
- Modify: `src/BlueprintAdV2.tsx`

- [ ] **Step 1: Remplacer `SceneCTA`**

```tsx
const SceneCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoOpacity  = fi(frame, 0, 10);
  const logoScale    = pop(frame, fps, 0, 250);
  const textOpacity  = fi(frame, 12, 10);
  const textY        = su(frame, 12, 10, 30);
  const btnScale     = pop(frame, fps, 20, 220);
  const btnOpacity   = fi(frame, 20, 10);

  // Rainbow hue rotation
  const hue = interpolate(frame, [0, 60], [0, 360], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ background: BG }}>
      <Dots opacity={0.55} />
      <Glow color="rgba(34,197,94,0.18)" size={800} />

      <AbsoluteFill style={{
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '0 72px', gap: 36, textAlign: 'center',
      }}>
        {/* Logo */}
        <div style={{
          opacity: logoOpacity, transform: `scale(${logoScale})`,
          display: 'flex', alignItems: 'center', gap: 16,
        }}>
          <BuildrsHashIcon size={44} />
          <span style={{
            fontFamily: SANS, fontSize: 40, fontWeight: 800,
            letterSpacing: '-0.04em', color: WHITE,
          }}>Buildrs</span>
        </div>

        {/* URL */}
        <div style={{
          opacity: textOpacity, transform: `translateY(${textY}px)`,
          fontFamily: SANS, fontSize: 88, fontWeight: 800,
          letterSpacing: '-0.05em', color: WHITE,
        }}>
          buildrs.fr
        </div>

        {/* Prix */}
        <div style={{ opacity: textOpacity, transform: `translateY(${textY}px)` }}>
          <span style={{
            fontFamily: SANS, fontSize: 36, fontWeight: 600,
            color: GREEN,
          }}>
            Accès complet — 27€ seulement
          </span>
        </div>

        {/* Bouton Rainbow CTA */}
        <div style={{
          opacity: btnOpacity,
          transform: `scale(${btnScale})`,
          position: 'relative',
        }}>
          {/* Glow rainbow derrière le bouton */}
          <div style={{
            position: 'absolute', inset: -3, borderRadius: 20,
            background: `conic-gradient(from ${hue}deg, #ff6b6b, #ffd93d, #6bcb77, #4d96ff, #cc5de8, #ff6b6b)`,
            filter: 'blur(14px)',
            opacity: 0.6,
          }} />
          <div style={{
            position: 'relative',
            background: WHITE, color: BG,
            borderRadius: 18, padding: '28px 72px',
            fontFamily: SANS, fontSize: 44, fontWeight: 800,
            letterSpacing: '-0.03em',
            display: 'flex', alignItems: 'center', gap: 16,
          }}>
            Commencer maintenant →
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
```

Note : `BuildrsHashIcon` est déjà défini dans `ScenePivot` — le déplacer en haut du fichier pour le partager entre les deux scènes.

- [ ] **Step 2: Déplacer `BuildrsHashIcon` en haut du fichier** (avant les scènes)

- [ ] **Step 3: Vérifier dans Studio — frames 1290–1350**

Vérifier :
- [ ] Logo Buildrs pop-in
- [ ] "buildrs.fr" massif
- [ ] Prix en vert
- [ ] Bouton rainbow glow animé

- [ ] **Step 4: Commit**

```bash
git add src/BlueprintAdV2.tsx
git commit -m "feat(ad-v2): scene 6 — rainbow CTA buildrs.fr"
```

---

### Task 9: Musique de fond

**Objectif :** Ajouter un fichier audio ambiant dans `public/` et l'activer.

**Files:**
- Modify: `src/BlueprintAdV2.tsx` (décommenter `<Audio>`)
- Add: `public/music.mp3` (fichier à fournir manuellement)

- [ ] **Step 1: Placer un fichier `music.mp3` dans `public/`**

Choisir un track ambient/lo-fi dark (ex: depuis Pixabay, Free Music Archive, ou Epidemic Sound). Durée minimum 45s. Volume sera `0.18`.

- [ ] **Step 2: Décommenter la ligne Audio dans `BlueprintAdV2`**

```tsx
<Audio src={staticFile('music.mp3')} volume={0.18} />
```

- [ ] **Step 3: Vérifier dans Studio** que le son joue sans couvrir les captions

- [ ] **Step 4: Commit**

```bash
git add public/music.mp3 src/BlueprintAdV2.tsx
git commit -m "feat(ad-v2): add background music (volume 0.18)"
```

---

## Chunk 5: Polish + Render final

### Task 10: Transitions entre scènes + polish global

**Files:**
- Modify: `src/BlueprintAdV2.tsx`

- [ ] **Step 1: Ajouter fade-out sur les scènes 1 et 3** (les transitions brusques)

Dans `SceneHook`, ajouter un fondu sur les dernières 20 frames (130–150) :
```tsx
// Dans SceneHook, wrapper AbsoluteFill principal :
const fadeOutOpacity = fo(frame, 130, 20);
// appliquer opacity: fadeOutOpacity sur l'AbsoluteFill principal
```

Même chose pour `ScenePivot` (frames 160–180 = 670–690 relatif à la Sequence).

- [ ] **Step 2: Vérification visuelle complète** — parcourir l'intégralité de la composition frame 0→1350

Checklist de relecture :
- [ ] Hook (0–150) : texte lisible, glow subtil
- [ ] Rafale (150–510) : rythme fluide, pas de saut
- [ ] Pivot (510–690) : transitions douces, logo net
- [ ] Timeline (690–1140) : jours bien espacés, checkmarks visibles
- [ ] Résultat (1140–1290) : MRR lisible, stats claires
- [ ] CTA (1290–1350) : rainbow visible, URL lisible

- [ ] **Step 3: Commit**

```bash
git add src/BlueprintAdV2.tsx
git commit -m "feat(ad-v2): polish — fade transitions + final review"
```

---

### Task 11: Render final

**Files:**
- Aucun changement de code

- [ ] **Step 1: Render MP4**

```bash
cd "/Users/alfredorsini/CLAUDE/###BLUEPRINT BUILDRS/Remotion"
npm run render:blueprint-v2
```
Attendu : `out/BlueprintAdV2.mp4` créé. Durée 45s. Format 1080×1350.

- [ ] **Step 2: Vérifier le MP4** dans un lecteur vidéo

- [ ] **Step 3: Commit final**

```bash
git add out/BlueprintAdV2.mp4
git commit -m "feat(ad-v2): render final — BlueprintAdV2 1080x1350 45s Meta 4:5"
```

---

## Résumé des fichiers

| Fichier | Action |
|---------|--------|
| `src/shared.tsx` | Créer — tokens, helpers, Dots/Glow/Badge |
| `src/BlueprintAdV2.tsx` | Créer — composition principale + 6 scènes |
| `src/Root.tsx` | Modifier — ajouter `<Composition id="BlueprintAdV2" ...>` |
| `package.json` | Modifier — ajouter `render:blueprint-v2` |
| `public/music.mp3` | Ajouter — fichier audio (fourni manuellement) |
