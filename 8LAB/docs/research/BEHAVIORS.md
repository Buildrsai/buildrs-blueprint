# BEHAVIORS — 8lab Ecosystem Clone

## Scroll Behaviors

### Navbar
- **Trigger:** scroll > 50px
- **Before:** transparent background, no border, no blur
- **After:** `rgba(10,10,10,0.92)` background, `blur(12px)` backdrop-filter, `1px solid rgba(255,255,255,0.06)` border-bottom
- **Transition:** all 300ms ease
- **Implementation:** JS scroll listener, useState in Navbar.tsx

### Elements animate into view
- **Original site:** Webflow scroll animations (appear on scroll)
- **Clone:** Static rendering (no scroll animation implemented — acceptable for MVP clone)

## Click Behaviors

### Programme — Chapter tabs
- **Interaction model:** CLICK-DRIVEN accordion
- **Default:** Chapter 1 is open
- **Click:** toggles open/closed state
- **Transition:** height collapse/expand (currently instant — CSS transition could be added)
- **Implementation:** useState(activeChapter) in Programme.tsx

### Team — Pagination
- **Interaction model:** CLICK-DRIVEN pagination
- **Shows:** 3 members at a time
- **Navigation:** prev/next arrow buttons
- **Total members:** 12 → 4 pages of 3
- **Implementation:** useState(page) in Team.tsx

### FAQ — Accordion
- **Interaction model:** CLICK-DRIVEN accordion
- **Default:** All closed
- **Click:** opens one item, closes previously open item
- **Implementation:** useState(openIndex) in FAQ.tsx

## Hover Behaviors

### Navbar links
- **Before:** `rgb(175, 176, 185)`
- **After:** `#ffffff`
- **Transition:** color 0.2s

### Navbar CTA button
- **Before:** `border: 1px solid rgba(255,255,255,0.18)`
- **After:** `border: 1px solid rgba(255,255,255,0.4)`
- **Transition:** border-color 0.2s ease

## Responsive Behavior

### Desktop (1440px)
- Full nav with all links visible
- 4-column stats bar
- 3-column comparison table
- 3-column step cards
- 3-column team cards

### Mobile (390px) — TODO
- Hamburger menu (nav links hidden)
- Stats bar stacks to 2x2 grid
- Comparison table scrolls horizontally or stacks
- Step cards stack to 1 column
- Team cards stack to 1 column

## Smooth Scroll
- `html { scroll-behavior: smooth }` applied in globals.css
- Anchor links (#programme, #process, etc.) use native smooth scroll

## Marquee (Avantages section)
- Original: auto-scrolling horizontal marquee of testimonial logos
- Clone: NOT implemented (would need dummy logos/content)
- Located: Below comparison table in #avantages section

## Video Embeds
- Original: YouTube iframes embedded in Hero and Programme sections
- Clone: Placeholder dark div with play button SVG
- Both iframes use YouTube embed URLs (not cloned — external dependency)
