/**
 * Buildrs — Design Tokens
 * Importez ce fichier dans votre projet Remotion pour accéder à toute la DA.
 * Usage : import { colors, typography, brand } from './design-tokens'
 */

// ─── COLORS ───────────────────────────────────────────────────────────────────

export const colors = {
  // Dark mode (DA des ads et vidéo)
  dark: {
    bg:          "#09090b",
    bgCard:      "#18181b",
    fg:          "#fafafa",
    fgMuted:     "rgba(255,255,255,0.45)",
    fgVeryMuted: "rgba(255,255,255,0.22)",
    fgGhost:     "rgba(255,255,255,0.20)",
    border:      "rgba(255,255,255,0.08)",
    borderLight: "rgba(255,255,255,0.12)",
    cardBg:      "rgba(255,255,255,0.04)",
  },

  // Light mode (LP)
  light: {
    bg:          "#ffffff",
    bgSecondary: "#f4f4f5",
    fg:          "#09090b",
    fgMuted:     "#71717a",
    border:      "#e4e4e7",
  },

  // Fonctionnelles
  success:      "#22c55e",
  successBg:    "rgba(34,197,94,0.15)",
  successBorder:"rgba(34,197,94,0.30)",
  successGlow:  "rgba(34,197,94,0.80)",
  error:        "#ef4444",
  errorBg:      "rgba(239,68,68,0.10)",
  errorBorder:  "rgba(239,68,68,0.18)",
  warning:      "#eab308",

  // Rainbow CTA
  rainbow: ["#ff6b6b", "#ffd93d", "#6bcb77", "#4d96ff", "#cc5de8", "#ff6b6b"],
} as const

// ─── TYPOGRAPHY ───────────────────────────────────────────────────────────────

export const typography = {
  fonts: {
    sans: "'Geist', 'Geist Sans', system-ui, sans-serif",
    mono: "'Geist Mono', ui-monospace, monospace",
  },

  // Tailles (en px, pour Remotion les utiliser directement)
  sizes: {
    heroFeed:    108,  // ads 1:1
    heroStory:   116,  // ads 9:16
    heroLP:      96,   // landing page max
    headline:    82,   // sections
    h2:          52,   // sous-titres
    h3:          32,   // cartes
    lead:        26,   // sous-titre hero
    body:        18,   // corps de texte
    caption:     13,   // labels, tags
    priceLarge:  80,   // prix story
    priceMedium: 52,   // prix feed
    statNumber:  52,   // chiffres stats
    mono:        32,   // valeurs mono
  },

  weights: {
    regular: 400,
    medium:  500,
    semibold:600,
    bold:    700,
    black:   800,
  },

  letterSpacing: {
    hero:    "-0.05em",
    heading: "-0.04em",
    tight:   "-0.03em",
    normal:  "0",
    wide:    "0.08em",
    wider:   "0.12em",
  },

  lineHeight: {
    hero:   0.92,
    tight:  1.05,
    normal: 1.5,
    body:   1.65,
  },
} as const

// ─── BRAND ────────────────────────────────────────────────────────────────────

export const brand = {
  name:     "Buildrs",
  url:      "buildrs.fr",
  tagline:  "De l'idée au MVP monétisé en 6 jours.",

  // Messages clés (utiliser tels quels)
  messages: {
    core:         "Claude code. Toi tu diriges.",
    identity:     "Deviens chef d'orchestre d'IA.",
    promise:      "Ton SaaS, ton app, ton logiciel — live en 6 jours.",
    noCode:       "Sans savoir coder. Sans équipe. Depuis ton ordi.",
    urgency:      "La fenêtre est historique. C'est maintenant.",
    advantage:    "Ceux qui se lancent maintenant ont 3 ans d'avance.",
    rhythm:       "6 jours. 2h/jour. 0€ de dev nécessaire.",
    team:         "Ta propre équipe IA. Seul depuis ton ordi.",
  },

  // Statistiques produit
  stats: {
    days:       "6",
    hoursPerDay:"2h",
    price:      "27€",
    priceFull:  "197€",
    priceNext:  "297€",
    modules:    "6",
    places:     "82/100",
  },

  // Stack technologique
  stack: ["Claude", "Supabase", "Stripe", "Vercel", "GitHub", "Tailwind CSS", "Resend", "Cloudflare"],

  // Transformation avant/après
  transformation: [
    { before: "Tu scrolles sur l'IA",   after: "Tu crées avec l'IA"     },
    { before: "Tu regardes les autres", after: "Tu en fais partie"       },
    { before: "Tu n'as pas lancé",      after: "Ton SaaS est live"       },
    { before: "Consommateur",           after: "Fondateur de SaaS"       },
  ],
} as const

// ─── ANIMATIONS (durées en frames à 30fps) ────────────────────────────────────

export const motion = {
  fps: 30,

  // Durées en frames
  frames: {
    fadeIn:     12,  // 0.4s
    fadeUp:     21,  // 0.7s
    fadeUpHero: 27,  // 0.9s
    revealLine: 25,  // 0.8s
    strike:     12,  // 0.4s
  },

  // Délais de cascade (en frames)
  cascade: {
    logo:      3,   // 0.1s
    eyebrow:   9,   // 0.3s
    line1:     12,  // 0.4s
    line2:     18,  // 0.6s
    line3:     24,  // 0.8s
    lineBright:33,  // 1.1s
    separator: 42,  // 1.4s
    section2:  51,  // 1.7s
    stats:     60,  // 2.0s
    card:      69,  // 2.3s
    bottom:    87,  // 2.9s
  },

  // Easing
  easing: {
    spring:  "cubic-bezier(0.16, 1, 0.3, 1)",  // entrée hero
    ease:    "ease",                             // secondaire
    linear:  "linear",                           // marquee, rainbow
  },
} as const

// ─── PATTERNS VISUELS ─────────────────────────────────────────────────────────

export const patterns = {
  // Dot grid
  dotGrid: {
    color:    "rgba(255,255,255,0.05)",
    size:     "34px",  // background-size: 34px 34px
  },

  // Background glow (cercle)
  bgGlow: {
    size:    900,   // px
    color:   "rgba(255,255,255,0.045)",
    spread:  "65%",
  },

  // Watermark (chiffre fantôme)
  watermark: {
    color:   "rgba(255,255,255,0.022)",
    size:    480,   // px, adapter selon format
    weight:  800,
  },
} as const

// ─── FORMATS ADS ──────────────────────────────────────────────────────────────

export const adFormats = {
  feed_1x1: {
    width:   1080,
    height:  1080,
    padding: { x: 84, y: 72 },
  },
  story_9x16: {
    width:   1080,
    height:  1920,
    padding: { x: 84, yTop: 100, yBottom: 110 },
  },
} as const

// ─── LOGO SVG (inline) ────────────────────────────────────────────────────────

export const logoSVG = {
  // Taille recommandée dans les ads : 34–44px
  dark: `<svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="36" height="36" rx="9" fill="#18181b"/>
  <line x1="13.5" y1="6"  x2="13.5" y2="30" stroke="white" stroke-width="3" stroke-linecap="round"/>
  <line x1="22.5" y1="6"  x2="22.5" y2="30" stroke="white" stroke-width="3" stroke-linecap="round"/>
  <line x1="6"  y1="13.5" x2="30"   y2="13.5" stroke="white" stroke-width="3" stroke-linecap="round"/>
  <line x1="6"  y1="22.5" x2="30"   y2="22.5" stroke="white" stroke-width="3" stroke-linecap="round"/>
</svg>`,
  light: `<svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="36" height="36" rx="9" fill="#f4f4f5"/>
  <line x1="13.5" y1="6"  x2="13.5" y2="30" stroke="#09090b" stroke-width="3" stroke-linecap="round"/>
  <line x1="22.5" y1="6"  x2="22.5" y2="30" stroke="#09090b" stroke-width="3" stroke-linecap="round"/>
  <line x1="6"  y1="13.5" x2="30"   y2="13.5" stroke="#09090b" stroke-width="3" stroke-linecap="round"/>
  <line x1="6"  y1="22.5" x2="30"   y2="22.5" stroke="#09090b" stroke-width="3" stroke-linecap="round"/>
</svg>`,
} as const
