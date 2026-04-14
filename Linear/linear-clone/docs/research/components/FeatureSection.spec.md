# FeatureSection Specification (shared pattern — all 5 sections)

## Overview
- **Target file:** `components/FeatureSection.tsx`
- **Screenshots:** `docs/design-references/section1-automate.png`, `section2-direction.png`, `section3-build.png`, `section4-review.png`, `section5-monitor.png`
- **Interaction model:** Scroll-driven fade-in entrance per section

## DOM Structure
```
<section class="page-section">
  <div class="section-inner">           ← max-width 1280px, padding 0 32px, margin auto

    <!-- Left column — sticky text -->
    <div class="section-text">
      <div class="section-badge">       ← e.g. "1.0 Intake →"
        <span class="number">1.0</span>
        <span class="label">Intake</span>
        <span class="arrow">→</span>
      </div>
      <h2>Make product operations self-driving</h2>
      <p>Turn conversations and customer feedback into actionable issues...</p>
    </div>

    <!-- Right column — mockup image -->
    <div class="section-mockup">
      <div class="mockup-frame">         ← dark rounded card with subtle border
        <img src="/images/section-mockup.png" />
      </div>
    </div>

  </div>
</section>
```

## Computed Styles (exact from getComputedStyle)

### Section root (.PageSection_root)
- backgroundColor: rgb(8, 9, 10)
- paddingTop: 160px
- paddingBottom: 160px
- position: relative
- overflow: hidden
- minHeight: 1154–1206px

### Inner container
- maxWidth: 1280px
- margin: 0 auto
- padding: 0 32px
- display: grid
- gridTemplateColumns: 1fr 1fr (approximately 45% / 55%)
- gap: 80px
- alignItems: start

### Left: section text
- position: sticky
- top: 120px  ← stays in place as right column scrolls
- paddingTop: 0

### Badge link (.section-badge)
- display: inline-flex
- alignItems: center
- gap: 8px
- fontSize: 12px
- fontWeight: 510
- color: rgb(138, 143, 152)
- marginBottom: 24px
- cursor: pointer
- Hover: color → rgb(247, 248, 248), transition: color 0.15s

### Badge number
- fontSize: 12px
- fontWeight: 510
- color: rgb(138, 143, 152)

### Badge separator / arrow
- color: rgb(62, 66, 72)

### H2
- fontSize: 48px
- fontWeight: 510
- lineHeight: 48px
- letterSpacing: -1.056px
- color: rgb(247, 248, 248)
- marginBottom: 24px
- whiteSpace: pre-wrap (intentional line breaks with \n)

### Paragraph
- fontSize: 15px
- fontWeight: 400
- lineHeight: 24px
- letterSpacing: -0.165px
- color: rgb(138, 143, 152)
- maxWidth: 380px

### Right: mockup frame
- borderRadius: 12px
- border: 1px solid rgba(255, 255, 255, 0.08)
- overflow: hidden
- backgroundColor: rgb(18, 19, 20)
- position: relative

### Mockup image
- width: 100%
- height: auto
- display: block

### Grain overlay (on mockup frame)
- position: absolute
- inset: 0
- opacity: 0.15
- mixBlendMode: overlay
- pointerEvents: none

### Glow effect (behind frame)
- position: absolute
- borderRadius: 50%
- background: radial-gradient(50% 50%, rgba(255,255,255,0.04) 0, rgba(255,255,255,0) 90%)
- width: 600px, height: 600px
- top: -100px, left: 50%
- transform: translateX(-50%)
- pointerEvents: none

## States & Behaviors
### Entrance animation
- Initial state: opacity: 0, transform: translateY(24px)
- Final state: opacity: 1, transform: translateY(0)
- Duration: 700ms ease-out
- Trigger: IntersectionObserver threshold 0.1
- Applied to: entire section (text + mockup fade in together)

### Badge hover
- color: rgb(138, 143, 152) → rgb(247, 248, 248)
- transition: color 0.15s ease

## Section Data (5 sections)
```typescript
const sections = [
  {
    number: "1.0",
    label: "Intake",
    href: "/intake",
    heading: "Make product\noperations self-driving",
    description: "Turn conversations and customer feedback into actionable issues that are routed, labeled, and prioritized for the right team.",
    mockupSrc: "/images/section1-intake.png",
    mockupAlt: "Linear Intake — issue triage and routing UI"
  },
  {
    number: "2.0",
    label: "Plan",
    href: "/plan",
    heading: "Define the\nproduct direction",
    description: "Plan and navigate from idea to launch. Align your team with product initiatives, strategic roadmaps, and clear, up-to-date PRDs.",
    mockupSrc: "/images/hero-mockup.png",
    mockupAlt: "Linear Plan — initiatives and roadmap view"
  },
  {
    number: "3.0",
    label: "Build",
    href: "/build",
    heading: "Move work forward\nacross teams and agents",
    description: "Build and deploy AI agents that work alongside your team. Work on complex tasks together or delegate entire issues end-to-end.",
    mockupSrc: "/images/hero-mockup.png",
    mockupAlt: "Linear Build — Codex agent and issue assignment"
  },
  {
    number: "4.0",
    label: "Diffs (Coming soon)",
    href: "/diffs",
    heading: "Review PRs and\nagent output",
    description: "Understand code changes at a glance with structural diffs for human and agent output. Review, discuss, and merge — all within Linear.",
    mockupSrc: "/images/hero-mockup.png",
    mockupAlt: "Linear Diffs — code diff viewer"
  },
  {
    number: "5.0",
    label: "Monitor",
    href: "/monitor",
    heading: "Understand\nprogress at scale",
    description: "Take the guesswork out of product development with project updates, analytics, and dashboards that surface what needs your attention.",
    mockupSrc: "/images/hero-mockup.png",
    mockupAlt: "Linear Monitor — analytics dashboard"
  }
]
```

## Assets
- Section 1 mockup: `/images/section1-intake.png`
- Sections 2–5: use `/images/hero-mockup.png` as fallback (section-specific images not downloaded)

## Responsive Behavior
- **Desktop (1440px):** 2-column grid, text sticky on left, mockup on right
- **Tablet (768px):** Grid collapses to single column, sticky disabled, text above mockup
- **Mobile (390px):** Single column, smaller h2 (~28px), full-width mockup
- **Breakpoint:** 900px

## Implementation Notes
- Use `'use client'` directive for IntersectionObserver entrance animation
- Accept `section` prop of type `FeatureSection` (from `types/index.ts`)
- Wrap in a wrapper component `FeatureSections.tsx` that renders all 5 in order
- The sticky left column requires `position: sticky; top: 120px` (120 = 73px header + padding)
- Verify with `npx tsc --noEmit` before finishing
