# Linear.app Page Topology

## Page Overview
- **Total height:** ~10,772px
- **Scroll:** Native browser scroll, no Lenis/Locomotive
- **Background:** `rgb(8, 9, 10)` throughout
- **Grain texture:** `grain-default.png` overlaid on every section

## Layout Structure
```
<html class="enhanced js">
  <body>
    <main>
      <Header />          ← fixed, z-index: 100, height: 73px
      <div>               ← full layout wrapper
        <HeroSection />         ← top: 0, ~2400px tall
        <PageSection x5 />      ← 5 feature sections, each ~1150-1200px
        <CustomerQuotes />      ← top: 9072, 564px
        <CTASection />          ← top: 9860, 224px
        <Footer />              ← top: 10308, 464px
      </div>
    </main>
  </body>
</html>
```

## Sections (top to bottom)

### 1. Header / Nav
- **Position:** `fixed`, top: 0, z-index: 100
- **Height:** 73px
- **Behavior:** Static — does NOT change on scroll (no shrink/change)
- **Background:** `linear-gradient(rgba(11,11,11,0.8), rgba(11,11,11,0.762))` + `backdrop-filter: blur(20px)`
- **Border-bottom:** `1px solid rgba(255,255,255,0.08)`
- **Interaction model:** Static (fixed overlay, no scroll-driven changes)
- **Logo:** Linear wordmark (SVG)
- **Nav items:** Product (dropdown), Resources, Customers, Pricing, Now, Contact, Docs | Open app, Log in, Sign up

### 2. Hero Section
- **Top:** 72px (below fixed header)
- **Height:** ~2400px
- **Interaction model:** Static content + scroll-driven entrance animations
- **Contains:**
  - Badge link: "Issue tracking is dead — linear.app/next →"
  - H1: "The product development system for teams and agents"
  - Subtitle: "Purpose-built for planning and building products. Designed for the AI era."
  - Dark UI screenshot/mockup of Linear app
  - Logos bar (company logos)

### 3. PageSection: Make product operations self-driving (Intake)
- **Top:** 2483px, **Height:** 1206px
- **Badge:** "1.0 Intake"
- **H2:** "Make product operations self-driving"
- **P:** "Turn conversations and customer feedback into actionable issues that are routed, labeled, and prioritized for the right team."
- **Link:** "1.0 Intake →" → /intake
- **Interaction model:** Scroll-driven entrance (fade-in on viewport entry)
- **UI mockup:** Slack integration issue UI + issue triage board

### 4. PageSection: Define the product direction (Plan)
- **Top:** 3698px, **Height:** 1198px
- **Badge:** "2.0 Plan"
- **H2:** "Define the product direction"
- **P:** "Plan and navigate from idea to launch. Align your team with product initiatives, strategic roadmaps, and clear, up-to-date PRDs."
- **Link:** "2.0 Plan →" → /plan
- **Interaction model:** Scroll-driven
- **UI mockup:** Initiatives timeline / roadmap view

### 5. PageSection: Move work forward across teams and agents (Build)
- **Top:** 4906px, **Height:** 1154px
- **Badge:** "3.0 Build"
- **H2:** "Move work forward across teams and agents"
- **P:** "Build and deploy AI agents that work alongside your team. Work on complex tasks together or delegate entire issues end-to-end."
- **Link:** "3.0 Build →" → /build
- **Interaction model:** Scroll-driven
- **UI mockup:** Codex agent terminal + issue assignment UI

### 6. PageSection: Review PRs and agent output (Diffs)
- **Top:** 6070px, **Height:** 1072px
- **Badge:** "4.0 Diffs (Coming soon)"
- **H2:** "Review PRs and agent output"
- **P:** "Understand code changes at a glance with structural diffs for human and agent output. Review, discuss, and merge — all within Linear."
- **Link:** "4.0 Diffs (Coming soon) →" → /diffs
- **Interaction model:** Scroll-driven
- **UI mockup:** Code diff viewer (dark, syntax highlighted)

### 7. PageSection: Understand progress at scale (Monitor)
- **Top:** 7151px, **Height:** 1178px
- **Badge:** "5.0 Monitor"
- **H2:** "Understand progress at scale"
- **P:** "Take the guesswork out of product development with project updates, analytics, and dashboards that surface what needs your attention."
- **Link:** "5.0 Monitor →" → /monitor
- **Interaction model:** Scroll-driven
- **UI mockup:** Weekly pulse + cycle time chart

### 8. Customer Quotes
- **Top:** 9072px, **Height:** 564px
- **Interaction model:** Static
- **Contains:**
  - Quote 1: "You just have to use it and you will see, you will just feel it." — Gabriel Peal, OpenAI (dark card)
  - Quote 2: "Our speed is intense and Linear helps us be action biased." — Nik Koblov, Head of Engineering, Ramp (yellow card)
  - Tagline: "Linear powers over 25,000 product teams. From ambitious startups to major enterprises."
  - Link: "Customer stories →"

### 9. CTA Section
- **Top:** 9860px, **Height:** 224px
- **Interaction model:** Static
- **H2:** "Built for the future. Available today."
- **Buttons:** "Get started" (primary/white), "Contact sales" (secondary)

### 10. Footer
- **Top:** 10308px, **Height:** 464px
- **Interaction model:** Static
- **Columns:** Product, Features, Company, Resources, Connect, Legal
- **Bottom:** Linear logo + copyright + status

## Z-index layers
- Header: z-index 100 (fixed overlay)
- All sections: flow content, z-index auto
- Grain overlays: z-index 1 within their sections
