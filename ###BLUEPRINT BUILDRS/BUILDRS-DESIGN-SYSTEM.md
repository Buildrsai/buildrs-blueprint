# Buildrs — Design System Complet
> Référence officielle pour toute production créative (Remotion, ads, LP, dashboard)
> Dernière mise à jour : Mars 2026

---

## 1. Identité de Marque

### Qui est Buildrs ?
**Buildrs** est le système opérationnel pour lancer un micro-SaaS, une app ou un logiciel en 6 jours avec Claude comme moteur — sans savoir coder, sans budget, sans expérience technique.

### Positionnement
- **Pour qui :** Solopreneurs, freelances, coachs, créateurs, dirigeants de PME — profils non-techniques
- **Contre qui :** Les formations à 900€ qui parlent théorie et ne livrent rien
- **Avec quoi :** Claude Code (IA) comme moteur de production, vibecoding comme méthode

### Tagline principale
> "De l'idée au MVP monétisé en 6 jours."

### Messages clés (à répéter dans toute comm)
- Claude code. Toi tu diriges.
- Deviens chef d'orchestre d'IA.
- Ton SaaS, ton app, ton logiciel — live en 6 jours.
- Sans savoir coder. Sans équipe. Depuis ton ordi.
- La fenêtre est historique. C'est maintenant.
- Ceux qui se lancent maintenant ont 3 ans d'avance.
- 6 jours. 2h/jour. 0€ de dev nécessaire.
- Ta propre équipe IA. Seul depuis ton ordi.

### Chiffres produit (à utiliser tel quel)
- Prix : **27€** (prix de lancement, barré depuis 197€)
- Durée : **6 jours**
- Temps quotidien : **2h par jour**
- Modules : **6 modules** complets
- Places : **82/100 places** prises (urgence)
- Prix après lancement : **297€**
- URL : **buildrs.fr**

---

## 2. Palette de Couleurs

### Mode Dark (DA des ads et de la vidéo)
```
Background principal : #09090b      (zinc-950, presque noir)
Foreground / Texte   : #fafafa      (blanc quasi-pur)
Card                 : #18181b      (zinc-900)
Border               : rgba(255,255,255,0.08)–0.12
Muted text           : rgba(255,255,255,0.35)–0.45
Very muted text      : rgba(255,255,255,0.20)–0.25
```

### Mode Light (LP principale)
```
Background           : #ffffff
Foreground           : #09090b
Secondary/Card       : #f4f4f5   (zinc-100)
Border               : #e4e4e7   (zinc-200)
Muted foreground     : #71717a   (zinc-500)
```

### Couleurs fonctionnelles (identiques light/dark)
```
Succès / Live        : #22c55e   (green-500)
Succès glow          : rgba(34,197,94,0.8)
Warning              : #eab308   (yellow-500)
Erreur               : #ef4444   (red-500)
Erreur bg            : rgba(239,68,68,0.1)
Erreur border        : rgba(239,68,68,0.18)
```

### Accent Hero (LP) — radial gradient top
```css
background: radial-gradient(ellipse 80% 50% at 50% -10%,
  rgba(170,170,255,0.10) 0%,
  transparent 65%
);
```

### Rainbow Glow (CTA signature)
```css
/* Couleurs du arc-en-ciel, dans l'ordre */
#ff6b6b  → Rouge-corail
#ffd93d  → Jaune
#6bcb77  → Vert
#4d96ff  → Bleu
#cc5de8  → Violet
#ff6b6b  → Retour rouge (boucle)

/* Dégradé conic utilisé */
conic-gradient(from 0deg, #ff6b6b, #ffd93d, #6bcb77, #4d96ff, #cc5de8, #ff6b6b)
/* blur: 12–14px, opacity: 0.55–0.70, rotation 360° en 3s */
```

---

## 3. Typographie

### Polices
```
Principale UI    : Geist Sans     (variable, 100–900)
Code / Chiffres  : Geist Mono     (variable, 100–900)
CDN              : https://cdn.jsdelivr.net/npm/geist@1.3.1/dist/fonts/geist-sans/style.css
CDN Mono         : https://cdn.jsdelivr.net/npm/geist@1.3.1/dist/fonts/geist-mono/style.css
```

### Échelle typographique

| Usage | Taille | Poids | Letter-spacing | Line-height |
|-------|--------|-------|----------------|-------------|
| Hero H1 (LP) | clamp(52px, 8.5vw, 96px) | 800 | -0.04em | 1.05 |
| Hero H1 (ads 1:1) | 108px | 800 | -0.05em | 0.92 |
| Hero H1 (ads 9:16) | 112–118px | 800 | -0.05em | 0.92 |
| H2 sections | text-4xl / text-5xl | 800 | -0.045em | 0.95 |
| H3 | text-xl–text-2xl | 700 | -0.03em | 1.1 |
| Headline moyen | 68–82px | 800 | -0.04em | 1.0 |
| Body | 16–18px | 400 | 0 | 1.6–1.65 |
| Sub/Lead | 22–28px | 400 | 0 | 1.5 |
| Caption / Label | 12–14px | 500–600 | 0.08–0.12em | 1 |
| Stats / Mono | 38–52px | 800 | -0.04em | 1 |
| Prix | 42–80px | 800 | -0.05em | 1 |

### Règles typo absolues
- **Hero titles** : toujours weight 800, letter-spacing fortement négatif (-0.04 à -0.05em)
- **Mono** : Geist Mono pour prix, stats, chiffres clés, code
- **Antialiasing** : `-webkit-font-smoothing: antialiased` partout

---

## 4. Logo & Icône

### BuildrsIcon SVG (hashtag/grille)
```svg
<svg width="36" height="36" viewBox="0 0 36 36" fill="none">
  <rect width="36" height="36" rx="9" fill="#18181b"/>
  <line x1="13.5" y1="6"  x2="13.5" y2="30" stroke="white" stroke-width="3" stroke-linecap="round"/>
  <line x1="22.5" y1="6"  x2="22.5" y2="30" stroke="white" stroke-width="3" stroke-linecap="round"/>
  <line x1="6"    y1="13.5" x2="30" y2="13.5" stroke="white" stroke-width="3" stroke-linecap="round"/>
  <line x1="6"    y1="22.5" x2="30" y2="22.5" stroke="white" stroke-width="3" stroke-linecap="round"/>
</svg>
```
- Sur fond sombre → `fill="#18181b"`, lignes `stroke="white"`
- Sur fond clair → `fill="#f4f4f5"`, lignes `stroke="#09090b"`
- Logo complet = icône + `<span>Buildrs</span>` en Geist Sans weight 700 letter-spacing -0.03em

### Règle absolue
**Zéro emoji.** Uniquement SVG Lucide (strokeWidth 1.5) ou BrandIcons custom.

---

## 5. Animations & Motion

### Keyframes principaux

```css
/* Entrée vers le haut — composants hero */
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(24–28px); }
  to   { opacity: 1; transform: translateY(0); }
  easing: cubic-bezier(0.16, 1, 0.3, 1)  /* spring */
  duration: 0.7–0.9s
}

/* Fade simple */
@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
  duration: 0.4–0.5s
}

/* Révélation de ligne horizontale (séparateur) */
@keyframes revealLine {
  from { clip-path: inset(0 100% 0 0); }
  to   { clip-path: inset(0 0% 0 0); }
  duration: 0.8–0.9s
}

/* Barrer du texte (pain points) */
@keyframes strikeThrough {
  from { width: 0; }
  to   { width: 100%; }
  duration: 0.4s
}

/* Défilement marquee horizontal */
@keyframes marquee-scroll {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
  duration: 28s, linear, infinite
}

/* Pulsation du glow background */
@keyframes glow-pulse {
  0%, 100% { opacity: 0.12–0.15; }
  50%       { opacity: 0.22–0.28; }
  duration: 4–5s, ease-in-out, infinite
}

/* Rainbow glow CTA */
@keyframes rainbow-glow {
  0%   { filter: blur(12–14px) hue-rotate(0deg); }
  100% { filter: blur(12–14px) hue-rotate(360deg); }
  duration: 3s, linear, infinite
}

/* Bord animé (order bump) */
@keyframes bump-spin {
  to { --bump-angle: 360deg; }
  duration: 4s, linear, infinite
}
```

### Timings de cascade (séquence d'entrée type ads)
```
0.1s — Logo / top (fadeIn)
0.3s — Eyebrow label (fadeIn)
0.4s — Ligne 1 (fadeUp)
0.6s — Ligne 2 (fadeUp)
0.8s — Ligne 3 (fadeUp)
1.1s — Ligne clé / bright (fadeUp)
1.4s — Séparateur (revealLine)
1.7s — Contenu section 2 (fadeUp)
2.0s — Stats / cards (fadeUp)
2.3–2.4s — Solution card (fadeUp)
2.8–2.9s — Bottom / CTA (fadeUp)
```

### Règles motion
- Easing spring `cubic-bezier(0.16, 1, 0.3, 1)` pour les entrées hero
- `ease` simple pour les éléments secondaires
- Jamais d'animation > 500ms pour les micro-interactions UI
- Transitions UI : 150ms

---

## 6. Motifs Visuels (Visual Patterns)

### Dot Grid (fond grille de points)
```css
background-image: radial-gradient(circle, rgba(255,255,255,0.045–0.055) 1px, transparent 1px);
background-size: 32–36px 32–36px;
```

### Background Glow (cercle de lumière)
```css
position: absolute;
border-radius: 50%;
background: radial-gradient(ellipse, rgba(255,255,255,0.04–0.06) 0%, transparent 65%);
/* Taille : 900–1100px, centré sur le contenu hero */
animation: glow-pulse 4–5s ease-in-out infinite;
```

### Watermark (chiffre fantôme en fond)
```css
font-family: 'Geist Mono';
font-size: 380–580px;
font-weight: 800;
color: rgba(255,255,255,0.018–0.025);
letter-spacing: -0.06em;
/* Positionné en bas-droite ou centré selon le format */
```

### Technique typographique "muted/bright"
Structure visuelle signature des ads :
- Lignes **muted** : `color: rgba(255,255,255,0.20–0.22)` → texte fantôme
- Ligne **bright** (clé) : `color: #fafafa` → elle tranche, attire l'œil
- Séparateur horizontal animé entre hero et contenu

---

## 7. Composants UI

### Bouton CTA Principal (Rainbow Glow)
```css
/* Base */
background: #09090b (dark) ou #fafafa (sur fond dark)
color: #fafafa (dark) ou #09090b (sur fond dark)
border-radius: 10–14px
padding: 16–22px 28–44px
font-size: 15–20px, font-weight: 700
letter-spacing: -0.02em

/* Glow pseudo ::after */
inset: -2px
border-radius: [base + 2px]
background: conic-gradient(rainbow)
filter: blur(12–14px)
opacity: 0.55–0.70
animation: rainbow-glow 3s linear infinite
z-index: -1
```

### Bouton secondaire
```css
border: 1px solid rgba(255,255,255,0.10)
background: transparent
border-radius: 100px ou 10px
color: rgba(255,255,255,0.45–0.55)
```

### Cards
```css
background: rgba(255,255,255,0.03–0.05)
border: 1px solid rgba(255,255,255,0.08–0.10)
border-radius: 16–28px
padding: 24–52px
```

### Badge / Tag
```css
border: 1px solid rgba(255,255,255,0.10–0.12)
border-radius: 100px
padding: 6–8px 14–18px
font-size: 12–13px, font-weight: 600
color: rgba(255,255,255,0.45–0.50)
```

### Live Dot (indicateur "live" vert)
```css
width: 7px; height: 7px;
border-radius: 50%;
background: #22c55e;
box-shadow: 0 0 8px rgba(34,197,94,0.8);
```

### Check Icon (liste features)
```css
width: 22–26px; height: 22–26px;
border-radius: 50%;
background: rgba(34,197,94,0.15);
border: 1px solid rgba(34,197,94,0.30);
/* SVG polyline check vert #22c55e à l'intérieur */
```

### Pain Icon (liste problèmes)
```css
width: 36–40px; height: 36–40px;
border-radius: 8–10px;
background: rgba(239,68,68,0.10);
border: 1px solid rgba(239,68,68,0.18–0.20);
/* SVG X rouge #ef4444 à l'intérieur */
```

---

## 8. Structure des Ads (Formats)

### Feed 1:1 (1080×1080px)
```
Padding : 72px 80–84px
Layout  : flex-column, space-between

[TOP]     Logo gauche + badge droit
[HERO]    Titre en cascade (muted/bright) + séparateur + sous-titre
[BOTTOM]  Prix barré + nouveau prix + CTA rainbow
```

### Story 9:16 (1080×1920px)
```
Padding : 100px 84px 110px
Layout  : flex-column

[TOP]       Logo + badge (margin-bottom 80px)
[HERO]      Eyebrow + titre cascade (margin-bottom 64–80px)
[SEPARATOR] Ligne révélation (margin 52–60px vertical)
[SECTION 2] Contenu central (pain list OU stats OU equation)
[CARD]      Solution / preuve / identité (flex: 1)
[BOTTOM]    Prix + CTA (margin-top 52–56px)
```

---

## 9. Voix & Ton (Copywriting)

### Ton général
- **Tutoiement** systématique
- Direct, cash, sans bullshit
- Expert mais jamais condescendant
- Motivant sans être cringe
- Phrases courtes. Paragraphes courts.

### Angles publicitaires

**Douleur (Angle 1)**
> Appuyer sur ce qui bloque : scroll infini, pas de résultat, formations chères, outils inutilisables
> Hooks : "Arrête de...", "T'as une idée. Qu'attends-tu ?", "Tu scrolles encore..."

**Rêve (Angle 2)**
> Projeter dans l'identité : devenir fondateur, chef d'orchestre, créer depuis n'importe où
> Hooks : "Deviens chef d'orchestre d'IA", "Claude code. Toi tu diriges.", "Ton app live en 6 jours."

**Curiosité (Angle 3)**
> La logique financière + la transformation avant/après
> Hooks : "Et si ton SaaS valait 1 000€/mois dans 6 jours ?", "27€ investis. ∞ possible."

### Formule de transformation
```
AVANT (douleur)         → APRÈS (résultat)
Tu scrolles sur l'IA   → Tu crées avec l'IA
Tu regardes les autres  → Tu en fais partie
Tu n'as pas lancé       → Ton SaaS est live
```

### Mots à éviter
- "Formation" (dit contenu théorique — dire "système", "blueprint", "plan d'action")
- "ChatGPT" (dire "Claude")
- "No-code" (dire "vibecoding")
- Jargon technique non expliqué

### Stack technologique à mentionner
Claude · Supabase · Stripe · Vercel · GitHub · Tailwind CSS · Resend · Cloudflare

---

## 10. Contenus Statiques Clés

### Stats produit pour vidéo / slides
```
6 JOURS          → De l'idée au produit live
2H/JOUR          → Temps nécessaire
27€              → Prix de lancement (barré depuis 197€)
6 MODULES        → Structure complète
0€               → Dev nécessaire
∞                → Idées possibles à lancer
82/100           → Places déjà prises
```

### Pain points (à lire / animer)
1. Tu scrolles depuis des mois sans rien lancer
2. Les formations coûtent une fortune pour peu de résultats
3. Trop d'outils, zéro direction
4. Pendant ce temps, d'autres lancent

### Features produit (checklist)
- 6 modules complets (de l'idée au lancement)
- Les prompts exacts à copier-coller
- La liste de tous les outils avec liens directs
- Générateur d'idées intégré
- Checklist interactive
- Bibliothèque de templates
- Glossaire et fondations
- 3 stratégies de départ
- 3 modèles de monétisation
- Accès à vie + mises à jour

### Objections / FAQ (à utiliser en voix off ou slides)
- "J'ai besoin de savoir coder ?" → Non. Zéro.
- "Combien de temps ?" → 6 jours. 2h par jour.
- "Vs bootcamp à 900€ ?" → 10x moins cher. 10x plus rapide.
- "Pourquoi Claude ?" → Meilleur pour le code propre. Vraie différence.

---

## 11. Tokens pour Remotion

Voir fichier `design-tokens.ts` dans ce même dossier pour les constantes TypeScript.
