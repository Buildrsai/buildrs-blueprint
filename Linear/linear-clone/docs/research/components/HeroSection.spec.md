# HeroSection Specification

## Overview
- **Target file:** `components/HeroSection.tsx`
- **Screenshot:** `docs/design-references/hero-viewport.png`
- **Interaction model:** Static content with scroll-triggered fade-in entrance

## DOM Structure
```
<section class="hero">
  <div class="container">           ← max-width 1436px, padding 0 32px
    <a class="badge">               ← "Issue tracking is dead" link
    <h1>                            ← main heading
    <div class="description-row">   ← flex row: subtitle left, badge right (desktop)
      <p class="description">
      <a class="feature-link">      ← "Issue tracking is dead →" (hide on mobile)
    </div>
    <div class="app-mockup">        ← dark UI screenshot
      <img src="/images/hero-mockup.png" />
    </div>
    <div class="logos-bar">         ← company logos row (below mockup)
  </div>
</section>
```

## Computed Styles (exact from getComputedStyle)

### Section container
- background: rgb(8, 9, 10)
- paddingTop: 160px (accounts for 73px fixed header + extra space)
- paddingBottom: 80px
- overflow: hidden
- position: relative

### Inner container (.container)
- maxWidth: 1436px
- margin: 0 auto
- padding: 0 32px

### H1 (.Hero_title)
- fontSize: 64px
- fontWeight: 510
- lineHeight: 64px
- letterSpacing: -1.408px
- color: rgb(247, 248, 248)
- display: block
- marginBottom: 32px

### Description row
- display: flex
- flexDirection: row
- justifyContent: space-between
- alignItems: flex-start
- marginBottom: 64px

### Description paragraph
- fontSize: 15px
- fontWeight: 400
- lineHeight: 24px
- letterSpacing: -0.165px
- color: rgb(138, 143, 152)
- maxWidth: 380px

### Feature link ("Issue tracking is dead →")
- fontSize: 13px
- fontWeight: 510
- color: rgb(138, 143, 152)
- display: flex
- alignItems: center
- gap: 12px
- Hover: color → rgb(247, 248, 248)

### App mockup container
- width: 100%
- borderRadius: 8px
- overflow: hidden
- border: 1px solid rgba(255, 255, 255, 0.08)
- position: relative

### App mockup image
- width: 100%
- height: auto
- display: block
- objectFit: cover

## States & Behaviors
### Entrance animation
- Initial: opacity 0, translateY(20px)
- Final: opacity 1, translateY(0)
- Duration: 600ms ease-out
- Trigger: IntersectionObserver (threshold 0.1) OR CSS animation on mount
- Stagger: heading → description → mockup (50ms each)

## Assets
- App mockup: `/images/hero-mockup.png` (1062x493 px)

## Text Content (verbatim)
- Badge text: "Issue tracking is dead  linear.app/next →"
- H1: "The product development system for teams and agents"
- Description: "Purpose-built for planning and building products. Designed for the AI era."

## Responsive Behavior
- **Desktop (1440px):** H1 at 64px, description-row flex-row, full-width mockup
- **Mobile (390px):** H1 ~36-40px, description stacked vertically, feature link hidden, mockup full-width
- **Breakpoint:** 768px — description-row switches from row to column

## Implementation Notes
- Use `'use client'` for IntersectionObserver animations
- The heading has manual line breaks on desktop: "The product development\nsystem for teams and agents"
- Company logos bar below mockup: use placeholder text or SVG placeholders for now
- Verify with `npx tsc --noEmit` before finishing
