# Linear.app Behavior Bible

## Scroll Library
- **None** — native browser scroll, no Lenis, no Locomotive Scroll
- `html` overflow: visible, `body` overflow: hidden auto (standard)

## Header Behaviors
- **Position:** fixed, always visible
- **Scroll state change:** NONE — header stays identical at all scroll positions
  - Same background gradient, same blur, same border at scroll=0 and scroll=5000
- **Background at all states:** `linear-gradient(rgba(11,11,11,0.8), oklab(0.149576 ... / 0.762))` + `backdrop-filter: blur(20px)`
- **Border:** `1px solid rgba(255,255,255,0.08)` (constant)
- **Hover on nav links:** color changes to `rgb(247,248,248)` from `rgb(138,143,152)`, no transition recorded

## Hero Section Behaviors
- **Entrance animation:** Elements fade-in as they enter viewport (scroll-driven via IntersectionObserver or CSS animation)
- **Badge "Issue tracking is dead →":** Static link, no animation
- **App mockup:** Static image(s), possibly with a subtle fade-in entrance
- **Interaction model:** Static content, scroll-triggered entrance animations

## Feature Section Behaviors (all 5 PageSections)
- **Entrance pattern:** Each section fades in as user scrolls to it
- **Left column (text):** Sticky within the section — sticks as user scrolls through right panel content
- **Right column (mockup):** Multiple states shown as user scrolls (scroll-driven tab switching via IntersectionObserver)
- **Interaction model:** SCROLL-DRIVEN — the mockup content changes as user scrolls, NOT click-driven
- **Implementation:** `position: sticky` on left text column + multiple mockup frames in right column revealed via IntersectionObserver

## Customer Quotes Behaviors
- **Left card:** Dark background (`rgb(8,9,10)`), large serif-style quote, author info at bottom
- **Right card:** Bright yellow background, dark text, different quote
- **Scroll behavior:** Cards may have entrance animations
- **Interaction model:** Static display

## CTA Section Behaviors
- **Static** — no animations
- **Button "Get started":** White/inverted button (white bg, dark text)
- **Button "Contact sales":** Secondary dark button (subtle border)

## Hover States
- **Nav links:** Color lightens on hover (`rgb(138,143,152)` → `rgb(247,248,248)`)
- **Buttons (primary/invert):** Subtle opacity change or background shift
- **Feature links (1.0 Intake →):** Likely underline or color change
- **Footer links:** Color lightens from `rgb(98,102,109)` (dimm) to `rgb(247,248,248)`

## Responsive Behavior
### Desktop (1440px) — Primary layout
- Header: full width with all nav items visible
- Hero: two-column layout (text left, app mockup right)
- Feature sections: text left sticky, mockup right
- Quotes: two-column (dark left, yellow right)
- Footer: 5-column grid

### Tablet (768px)
- Nav items may collapse or reduce
- Hero may stack or reduce padding
- Feature sections: likely single column or reduced mockup

### Mobile (390px)
- Header: hamburger menu (Log in / Sign up shown, nav items hidden)
- Hero: single column, smaller font sizes
- Feature sections: single column, text above mockup
- Quotes: single card at a time or stacked
- Footer: 2-column or stacked

## Animation Details
- **Section entrance:** `opacity: 0 → 1`, `transform: translateY(20px) → translateY(0)`, ~0.6s ease
- **Stagger:** Child elements within a section likely stagger by 50-100ms
- **Duration:** Typically 400-700ms for entrance animations
- **Trigger:** When element reaches ~10-20% into viewport (IntersectionObserver threshold ~0.1)
