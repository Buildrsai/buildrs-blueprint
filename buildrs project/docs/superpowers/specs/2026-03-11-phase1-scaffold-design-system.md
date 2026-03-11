# Phase 1 — Scaffold + Design System + Composants UI
**Date :** 2026-03-11
**Projet :** Buildrs
**Statut :** Approuvé

---

## Contexte

Projet Buildrs démarrant de zéro. Phase 1 établit le socle technique complet : scaffold Vite/React/TS, design system Buildrs en CSS variables + Tailwind, et 5 composants UI de base via shadcn/ui customisé.

Les phases suivantes (Landing, G4 AI Business Matcher, Auth, etc.) se construiront sur ce socle.

---

## Décisions

- **Stack :** React + TypeScript + Vite
- **Styling :** Tailwind CSS (config custom) + CSS Variables
- **Composants :** shadcn/ui comme base (Radix UI), overridé aux tokens Buildrs
- **Fonts :** Instrument Serif (display) + Geist (UI) + Geist Mono (code)

---

## Architecture

```
buildrs/
├── src/
│   ├── components/
│   │   └── ui/
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── input.tsx
│   │       ├── badge.tsx
│   │       └── divider.tsx
│   ├── styles/
│   │   ├── globals.css       ← CSS Variables + reset + dots pattern
│   │   └── fonts.css         ← Import Instrument Serif + Geist
│   └── lib/
│       └── utils.ts          ← cn() helper (clsx + tailwind-merge)
├── tailwind.config.ts
├── components.json
└── index.html
```

---

## Design Tokens

### globals.css — Variables CSS
Toutes les variables du design system Buildrs :
- Backgrounds : `--bg-base #080909`, `--bg-elevated`, `--bg-surface`, `--bg-overlay`
- Borders : `--border-subtle`, `--border-default`, `--border-strong`, `--border-glow`
- Texte : `--text-primary #EDEEEF`, `--text-secondary`, `--text-muted`, `--text-disabled`
- Accent : `--accent #E8E8E8`, `--accent-glow`
- Semantic : `--success`, `--warning`, `--error`
- Shadows : `--shadow-sm/md/lg/xl`
- Radius : `--radius-sm/md/lg/xl/full`
- Animations : `--duration-fast/base/slow/enter` + easings

Classe utilitaire `.dots-bg` : dots pattern signature Buildrs (obligatoire sur toutes les pages).

### tailwind.config.ts — Mapping tokens
```
colors: bg-base, bg-elevated, bg-surface, bg-overlay
        text-primary, text-secondary, text-muted, text-disabled
        border-subtle, border-default, border-strong, border-glow
        accent, success, warning, error
fontFamily: display (Instrument Serif), sans (Geist), mono (Geist Mono)
borderRadius: sm, md, lg, xl, full
boxShadow: sm, md, lg, xl
```

---

## Composants UI

| Composant | Variants | Behavior |
|-----------|----------|----------|
| `Button` | `primary`, `secondary`, `ghost` | Primary : bg text-primary, color bg-base, hover opacity 0.85. Secondary : transparent, border-default, hover border-strong + bg rgba(255,255,255,0.04) |
| `Card` | default | bg-elevated, border-subtle, radius-lg. Hover : border-default + translateY(-1px) |
| `Input` | default | bg-surface, border-default, radius-md, Geist 14px. Focus : border-strong + ring rgba(255,255,255,0.04) |
| `Badge` | default | Geist 500 11px, letter-spacing 0.05em, border-default, radius-sm, text-muted |
| `Divider` | horizontal | Gradient transparent → border-subtle → transparent |

Utilitaire `cn()` : clsx + tailwind-merge.

---

## Contraintes

- Fond TOUJOURS `#080909` — jamais blanc/gris clair
- Instrument Serif = titres hero UNIQUEMENT
- Geist = tout le reste de l'interface
- Pas de violet, bleu vif, gradients colorés
- Icônes Lucide React, stroke 1.5px, jamais filled
- TypeScript strict, no `any`
