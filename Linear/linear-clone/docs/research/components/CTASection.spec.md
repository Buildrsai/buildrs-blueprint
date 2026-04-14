# CTASection Specification

## Overview
- **Target file:** `components/CTASection.tsx`
- **Screenshot:** `docs/design-references/section-cta.png`
- **Interaction model:** Static

## DOM Structure
```
<section class="cta-section">
  <div class="cta-inner">
    <h2>Built for the future. Available today.</h2>
    <div class="cta-buttons">
      <a href="/signup" class="btn-primary">Get started</a>
      <a href="/contact" class="btn-secondary">Contact sales</a>
    </div>
  </div>
</section>
```

## Computed Styles (exact from getComputedStyle)

### Section
- backgroundColor: rgb(8, 9, 10)
- paddingTop: 80px
- paddingBottom: 80px
- width: 100%

### Inner container
- maxWidth: 1344px (from extracted ctaStyles)
- margin: 0 auto
- padding: 0 32px
- display: flex
- flexDirection: column
- justifyContent: center
- alignItems: center
- gap: 40px

### H2
- fontSize: 64px
- fontWeight: 510
- lineHeight: 64px
- letterSpacing: -1.408px
- color: rgb(247, 248, 248)
- textAlign: center

### Buttons row
- display: flex
- flexDirection: row
- gap: 12px
- alignItems: center

### Primary button ("Get started") — Button_variant-invert
- display: inline-flex
- alignItems: center
- justifyContent: center
- height: 40px
- padding: 0 16px
- backgroundColor: rgb(230, 230, 230)
- color: rgb(8, 9, 10)
- fontSize: 15px
- fontWeight: 510
- borderRadius: 4px
- border: 1px solid rgb(230, 230, 230)
- boxShadow: rgba(0,0,0,0) 0px 8px 2px 0px, rgba(0,0,0,0.01) 0px 5px 2px 0px, rgba(0,0,0,0.04) 0px 3px 2px 0px, rgba(0,0,0,0.07) 0px 1px 1px 0px, rgba(0,0,0,0.08) 0px 0px 1px 0px
- cursor: pointer
- Hover: backgroundColor → rgb(255, 255, 255)

### Secondary button ("Contact sales") — Button_variant-secondary
- display: flex
- alignItems: center
- justifyContent: center
- height: 40px
- padding: 0 16px
- backgroundColor: rgb(40, 40, 44)
- color: rgb(247, 248, 248)
- fontSize: 15px
- fontWeight: 510
- borderRadius: 4px
- border: 1px solid rgb(62, 62, 68)
- cursor: pointer
- Hover: backgroundColor → rgb(50, 50, 56)

## States & Behaviors
- Buttons have hover states (subtle bg change)
- No scroll-driven animations

## Text Content (verbatim)
- H2: "Built for the future. Available today."
- Button 1: "Get started"
- Button 2: "Contact sales"

## Responsive Behavior
- **Desktop:** H2 at 64px, buttons in a row
- **Mobile:** H2 shrinks to ~32px, buttons stack vertically or row stays (depends on screen)
- **Mobile CTAs:** On mobile layout shows "Open app" + "Download" instead

## Implementation Notes
- Simple static section
- Centered layout with large heading
- Verify with `npx tsc --noEmit` before finishing
