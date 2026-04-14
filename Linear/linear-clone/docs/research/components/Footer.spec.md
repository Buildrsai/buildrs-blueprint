# Footer Specification

## Overview
- **Target file:** `components/Footer.tsx`
- **Screenshot:** `docs/design-references/section-cta.png` (footer visible at bottom)
- **Interaction model:** Static

## DOM Structure
```
<footer>
  <div class="footer-inner">

    <!-- Top: logo + columns grid -->
    <div class="footer-top">
      <div class="footer-logo">
        <!-- Linear logo SVG or wordmark -->
      </div>
      <div class="footer-columns">          ← grid: 5 columns
        <div class="footer-col">
          <h3>Product</h3>
          <ul>...</ul>
        </div>
        <div class="footer-col">
          <h3>Features</h3>
          <ul>...</ul>
        </div>
        <div class="footer-col">
          <h3>Company</h3>
          <ul>...</ul>
        </div>
        <div class="footer-col">
          <h3>Resources</h3>
          <ul>...</ul>
        </div>
        <div class="footer-col">
          <h3>Connect</h3>
          <ul>...</ul>
        </div>
      </div>
    </div>

    <!-- Bottom: copyright + legal links -->
    <div class="footer-bottom">
      <span class="copyright">© 2025 Linear Orbit, Inc.</span>
      <div class="legal-links">
        <a>Privacy</a>
        <a>Terms</a>
        <a>DPA</a>
      </div>
    </div>

  </div>
</footer>
```

## Computed Styles (exact from getComputedStyle)

### Footer element
- backgroundColor: rgb(8, 9, 10)
- borderTop: 1px solid rgba(255, 255, 255, 0.08)
- paddingTop: 64px
- paddingBottom: 40px
- width: 100%

### Footer inner container
- maxWidth: 1280px
- margin: 0 auto
- padding: 0 32px

### Footer top
- display: flex
- flexDirection: row
- gap: 80px
- marginBottom: 64px

### Logo area
- flexShrink: 0

### Columns grid
- display: grid
- gridTemplateColumns: repeat(5, 1fr)
- gap: 32px
- flex: 1

### Column title (h3)
- fontSize: 12px
- fontWeight: 510
- lineHeight: 20px
- letterSpacing: 0.12px
- color: rgb(247, 248, 248)
- textTransform: uppercase
- marginBottom: 16px

### Column link list (ul)
- listStyle: none
- display: flex
- flexDirection: column
- gap: 0px

### Column link item (li → a)
- fontSize: 14px
- fontWeight: 400
- lineHeight: 28px
- color: rgb(98, 102, 109)  ← "dimm" variant
- display: block
- Hover: color → rgb(247, 248, 248), transition: color 0.15s ease

### Footer bottom
- display: flex
- flexDirection: row
- justifyContent: space-between
- alignItems: center
- paddingTop: 32px
- borderTop: 1px solid rgba(255, 255, 255, 0.06)

### Copyright text
- fontSize: 13px
- color: rgb(62, 66, 72)

### Legal links
- display: flex
- gap: 24px
- fontSize: 13px
- color: rgb(62, 66, 72)
- Hover: color → rgb(138, 143, 152)

## Text Content (verbatim)

### Product column
Intake · Plan · Build · Diffs · Monitor · Pricing · Security

### Features column
Asks · Agents · Customer Requests · Insights · Mobile · Integrations · Changelog

### Company column
About · Customers · Careers · Blog · Method · Quality · Brand

### Resources column
Switch · Download · Docs · Developers · Status · Enterprise · Startups

### Connect column
Contact us · Community · X (Twitter) · GitHub · YouTube

### Legal (bottom)
Privacy · Terms · DPA

## Assets
- Linear logo (use "Linear" text in the brand font, or a simple SVG circle icon + wordmark)

## Responsive Behavior
- **Desktop (1440px):** 5-column grid for links, logo + columns side by side
- **Mobile (390px):** 2-column grid or stacked, logo centered or left
- **Breakpoint:** 768px

## Implementation Notes
- All links are anchor tags pointing to `#` (static clone)
- Footer border-top separates it from the CTA section
- Copyright: "© 2025 Linear Orbit, Inc."
- Verify with `npx tsc --noEmit` before finishing
