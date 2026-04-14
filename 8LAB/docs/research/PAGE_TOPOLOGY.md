# Page Topology — 8lab Ecosystem

## URL
https://www.8lab-ecosystem.com/

## Overview
- **Framework:** Webflow
- **Theme:** Dark (bg #0a0a0a) with white sections for contrast
- **Fonts:** "Aeonik Pro" (primary), Inter (secondary)
- **Total page height:** ~15,775px at 1440px viewport

## Section Map (top to bottom)

| # | ID / Class | Top (px) | Height (px) | Label |
|---|---|---|---|---|
| 1 | `.is-section.is-hero` | 0 | 1419 | Hero |
| 2 | `#avantages.is-white.is-compare` | 1419 | 1528 | Avantages (white) |
| 3 | `#programme.is-modules` | 2947 | 5140 | Programme (10 tabs) |
| 4 | `#process.is-white.is-process` | 8087 | 916 | Process (3 steps) |
| 5 | `#team-8lab.is-white.is-team` | 9004 | 974 | Team |
| 6 | `#rejoindre.is-join` | 9978 | 3246 | Rejoindre (pricing + testimonials) |
| 7 | `#faq.is-white.is-faq` | 13224 | 1271 | FAQ |
| 8 | `.is-section.is-footer` | 14495 | 1280 | Footer |

## Sticky / Fixed Elements
- **Navbar** (`.nav-bar-3.w-nav`) — appears to be sticky/fixed at top, z-index: 1000

## Interaction Models
- **Hero:** Static + embedded YouTube iframe
- **Avantages:** Static (comparison/feature list)
- **Programme:** Click-driven tabs (10 chapters, click to reveal content)
- **Process:** Static (3 steps)
- **Team:** Static (team cards)
- **Rejoindre:** Static (pricing card + testimonials carousel?)
- **FAQ:** Click-driven accordion
- **Footer:** Static

## Color Pattern
- Dark sections: `#0a0a0a` / `rgb(10, 10, 10)` background, white text
- White sections: `#avantages`, `#process`, `#team-8lab`, `#faq` → `.is-white` class

## Navbar
- Links: Programme, Processus, Team, Résultats
- CTA: "Rejoindre maintenant" → /offers
- Color: transparent bg on dark hero, changes on scroll (TBD)
