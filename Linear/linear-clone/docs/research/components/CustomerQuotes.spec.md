# CustomerQuotes Specification

## Overview
- **Target file:** `components/CustomerQuotes.tsx`
- **Screenshot:** `docs/design-references/section-quotes.png`
- **Interaction model:** Static

## DOM Structure
```
<section class="customer-quotes">
  <div class="quotes-grid">            ← 2-column grid

    <!-- Card 1: Dark -->
    <div class="quote-card quote-dark">
      <p class="quote-text">"You just have to use it and you will see, you will just feel it."</p>
      <div class="author">
        <img src="/images/avatar-gabriel.png" alt="Gabriel Peal" />
        <div>
          <span class="author-name">Gabriel Peal</span>
          <span class="author-company">OpenAI</span>
        </div>
      </div>
    </div>

    <!-- Card 2: Yellow -->
    <div class="quote-card quote-yellow">
      <p class="quote-text">"Our speed is intense and Linear helps us be action biased."</p>
      <div class="author">
        <img src="/images/avatar-nik.png" alt="Nik Koblov" />
        <div>
          <span class="author-name">Nik Koblov</span>
          <span class="author-company">Head of Engineering, Ramp</span>
        </div>
      </div>
    </div>

  </div>

  <!-- Bottom bar -->
  <div class="social-proof-bar">
    <p>Linear powers over <strong>25,000</strong> product teams. From ambitious startups to major enterprises.</p>
    <a href="/customers">Customer stories →</a>
  </div>
</section>
```

## Computed Styles (exact from getComputedStyle)

### Section
- backgroundColor: rgb(8, 9, 10)
- paddingTop: 80px
- paddingBottom: 80px
- width: 100%

### Quotes grid
- display: grid
- gridTemplateColumns: 1fr 1fr
- gap: 16px
- maxWidth: 1280px
- margin: 0 auto
- padding: 0 32px
- marginBottom: 48px

### Dark card
- backgroundColor: rgb(18, 19, 22)
- border: 1px solid rgba(255, 255, 255, 0.08)
- borderRadius: 12px
- padding: 48px
- display: flex
- flexDirection: column
- justifyContent: space-between
- minHeight: 280px

### Yellow card
- backgroundColor: rgb(255, 230, 0)  ← bright yellow
- borderRadius: 12px
- padding: 48px
- display: flex
- flexDirection: column
- justifyContent: space-between
- minHeight: 280px

### Quote text
- fontSize: 28px
- fontWeight: 510
- lineHeight: 36px
- letterSpacing: -0.56px
- color: rgb(247, 248, 248)  ← dark card
- color: rgb(8, 9, 10)        ← yellow card
- marginBottom: 32px

### Author row
- display: flex
- flexDirection: row
- alignItems: center
- gap: 12px

### Avatar image
- width: 36px
- height: 36px
- borderRadius: 50%
- objectFit: cover

### Author name
- fontSize: 14px
- fontWeight: 510
- color: rgb(247, 248, 248)  ← dark card
- color: rgb(8, 9, 10)        ← yellow card

### Author company / title
- fontSize: 13px
- fontWeight: 400
- color: rgb(138, 143, 152)  ← dark card
- color: rgba(8, 9, 10, 0.6)  ← yellow card

### Social proof bar
- maxWidth: 1280px
- margin: 0 auto
- padding: 0 32px 0
- display: flex
- flexDirection: row
- alignItems: center
- justifyContent: space-between

### Social proof text
- fontSize: 15px
- fontWeight: 400
- color: rgb(138, 143, 152)

### "Customer stories →" link
- fontSize: 14px
- fontWeight: 510
- color: rgb(138, 143, 152)
- Hover: color → rgb(247, 248, 248)

## Assets
- `/images/avatar-gabriel.png` — Gabriel Peal, OpenAI
- `/images/avatar-nik.png` — Nik Koblov, Ramp

## Text Content (verbatim)
- Card 1 quote: "You just have to use it and you will see, you will just feel it."
- Card 1 author: Gabriel Peal · OpenAI
- Card 2 quote: "Our speed is intense and Linear helps us be action biased."
- Card 2 author: Nik Koblov · Head of Engineering, Ramp
- Bar: "Linear powers over 25,000 product teams. From ambitious startups to major enterprises."
- Link: "Customer stories →"

## Responsive Behavior
- **Desktop (1440px):** 2-column grid side by side
- **Mobile (390px):** Single column, cards stacked
- **Breakpoint:** 768px

## Implementation Notes
- Yellow card uses `rgb(255, 230, 0)` background — bright yellow
- Avatar images have circular crop (border-radius: 50%)
- Verify with `npx tsc --noEmit` before finishing
