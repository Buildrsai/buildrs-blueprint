# Design Spec — Buildrs Blueprint Ad v2

**Date :** 2026-03-24
**Produit :** Buildrs Blueprint (27€)
**URL cible :** buildrs.fr

---

## Paramètres techniques

| Param | Valeur |
|-------|--------|
| Format | 4:5 (1080×1350px) |
| Durée | 45s (1350 frames) |
| FPS | 30 |
| Composition ID | `BlueprintAdV2` |
| Fichier | `src/BlueprintAdV2.tsx` |

---

## Objectif

Pub Meta Feed/Instagram — direct response — pour convertir des solopreneurs/profils non-techniques à acheter le Buildrs Blueprint 27€.

---

## Arc émotionnel

**Rêve identifié → Transformation visualisée → Plan concret → Liberté + MRR → Action**

---

## Storyboard — 6 scènes

### Scène 1 — HOOK (0–5s · frames 0–150)
**Texte :** "Tu rêves de lancer un business avec l'IA mais tu sais pas par où démarrer ?"
- Fond `#09090b` + dots pattern
- Texte massif Geist 800, apparition word-by-word
- Glow blanc doux

### Scène 2 — RAFALE TRANSFORMATION (5–17s · frames 150–510)
8 bullets en séquence plein écran, ~1.5s chacun (45 frames), pop-in spring :

1. "SaaS · app · logiciel"
2. "Sans écrire une ligne de code"
3. "Moins de 100€ de budget"
4. "Rentable dès le premier mois"
5. "Revenus récurrents — chaque mois" ← en vert
6. "Devenir un chef d'orchestre IA"
7. "Bosser d'où tu veux, quand tu veux"
8. **"Tes IA travaillent pendant que tu dors"** ← dernier, plus gros, vert, climax

Chaque bullet remplace le précédent (pas de liste qui s'accumule).

### Scène 3 — PIVOT (17–23s · frames 510–690)
**Texte :** "Comment j'ai lancé mon app en 6 jours — sans savoir coder."
- "sans savoir coder" en `#22c55e`
- Fade transition depuis scène 2
- Logo Buildrs apparaît (spring)
- Badge pill "⚡ Claude comme moteur" + badge "Buildrs Blueprint"
- Glow vert

### Scène 4 — TIMELINE J1→J6 (23–38s · frames 690–1140)
Diagramme vertical, chaque ligne s'allume + checkmark vert, ~2.5s/jour (75 frames) :

| Jour | Contenu |
|------|---------|
| J1 | Idée validée · brief produit |
| J2 | Design + stack (Supabase · Vercel · Stripe) |
| J3 | Build avec **Claude** — feature principale |
| J4 | Auth + paiement Stripe |
| J5 | Deploy live · domaine · emails |
| J6 | **Lancement · premiers € ✓** |

J6 s'allume en vert plus brillant + glow final.

### Scène 5 — RÉSULTAT (38–43s · frames 1140–1290)
- Compteur MRR animé : 0€ → +XXX€/mois (chiffre qui monte)
- "0 patron · 0 dev · 0 bureau."
- Stats : **27€** · **6 jours** · **0 code**
- Stack logos défilent (marquee) : Claude · Lovable · Supabase · Stripe · Vercel · GitHub

### Scène 6 — CTA (43–45s · frames 1290–1350)
- "buildrs.fr"
- Bouton rainbow glow (conic-gradient animé)
- "Commence maintenant →"
- Prix 27€ visible
- Logo Buildrs

---

## Design Tokens

```ts
const BG       = '#09090b'
const WHITE    = '#fafafa'
const GREEN    = '#22c55e'
const ORANGE   = 'rgba(250,134,54,0.9)'   // Claude
const RED      = '#ef4444'
const INDIGO   = '#818cf8'
const SANS     = `'Geist', system-ui, sans-serif`
const SERIF    = `'Instrument Serif', Georgia, serif`
```

---

## Musique

Ambient/lo-fi instrumental dark — tension légère (scènes 1-2), montée progressive (scènes 3-4), drop motivant à J6.
Volume : `0.15–0.20` pour ne pas couvrir les captions.
Source : `staticFile('music.mp3')` — fichier à placer dans `public/`.

---

## Composants à créer

- `Dots` — dots pattern AbsoluteFill (déjà dans BuildrsBlueprintAd, à réutiliser)
- `Glow` — radial gradient positionnable (idem)
- `Badge` — pill badge vert ou orange
- `WordByWord` — apparition texte mot par mot via interpolate
- `BulletBlast` — rafale de bullets plein écran avec spring
- `TimelineDiagram` — J1→J6 avec checkmarks animés
- `MRRCounter` — compteur qui monte via interpolate
- `StackMarquee` — logos qui défilent
- `RainbowCTA` — bouton CTA avec conic-gradient animé

---

## Notes

- Composition séparée de `BuildrsBlueprintAd` (ne pas modifier l'existant)
- Ajouter `BlueprintAdV2` dans `Root.tsx`
- Police Geist + Instrument Serif via `@remotion/google-fonts`
