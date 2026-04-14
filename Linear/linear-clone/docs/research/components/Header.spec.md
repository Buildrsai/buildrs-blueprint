# Header / Nav Specification

## Overview
- **Target file:** `components/Header.tsx`
- **Screenshot:** `docs/design-references/hero-viewport.png` (top bar visible)
- **Interaction model:** Static (fixed overlay — no scroll-driven state change)

## DOM Structure
```
<header>                          ← fixed, full-width, z-100
  <nav>                           ← inner nav wrapper
    <div class="innerWrapper">    ← max-width container, flex row, space-between
      <div class="left">          ← logo + nav links
        <a logo />
        <ul>                      ← nav items list
          <li><button>Product</button></li>   ← has dropdown (not implemented)
          <li><a>Resources</a></li>
          <li><a>Customers</a></li>
          <li><a>Pricing</a></li>
          <li><a>Now</a></li>
          <li><a>Contact</a></li>
          <li><a>Docs</a></li>
        </ul>
      </div>
      <div class="right">         ← Open app + Log in + Sign up
        <a>Open app</a>
        <a>Log in</a>
        <a class="btn-signup">Sign up</a>
      </div>
    </div>
  </nav>
</header>
```

## Computed Styles (exact from getComputedStyle)

### Header element
- position: fixed
- top: 0px
- width: 100% (1440px at desktop)
- height: 73px
- zIndex: 100
- background: `linear-gradient(rgba(11, 11, 11, 0.8) 0px, rgba(11, 11, 11, 0.762) 100%)`
- backdropFilter: blur(20px)
- borderBottom: 1px solid rgba(255, 255, 255, 0.08)
- transition: all

### Inner wrapper (nav container)
- display: flex
- flexDirection: row
- alignItems: center
- justifyContent: space-between
- maxWidth: 1436px
- margin: 0 auto
- padding: 0 32px
- height: 73px

### Logo link
- color: rgb(247, 248, 248)
- display: flex
- alignItems: center
- SVG logo — Linear wordmark

### Nav list (UL)
- display: flex
- flexDirection: row
- alignItems: center
- gap: 0px (items use padding internally)
- listStyle: none

### Nav link items (A/button)
- fontSize: 14px
- fontWeight: 510
- color: rgb(138, 143, 152)  ← secondary/muted state
- padding: 0 12px
- height: 73px (full header height)
- display: flex
- alignItems: center
- cursor: pointer
- background: transparent
- border: none
- Hover: color → rgb(247, 248, 248), transition: color 0.15s ease

### Right: "Open app" link
- fontSize: 14px
- fontWeight: 510
- color: rgb(247, 248, 248)
- padding: 0 12px
- display: flex, alignItems: center

### Right: "Log in" link
- fontSize: 14px
- fontWeight: 510
- color: rgb(138, 143, 152)
- padding: 0 8px

### Right: "Sign up" button
- fontSize: 13px
- fontWeight: 510
- lineHeight: 32px
- height: 32px
- padding: 0 12px
- backgroundColor: rgb(230, 230, 230)
- color: rgb(8, 9, 10)
- borderRadius: 4px
- border: 1px solid rgb(230, 230, 230)
- display: inline-flex
- alignItems: center
- justifyContent: center
- cursor: pointer

## States & Behaviors
### Fixed on scroll
- Header does NOT change at any scroll position — same appearance at scroll:0 and scroll:5000
- No shrinking, no background change, no shadow appearance on scroll

### Hover states
- Nav links: color `rgb(138, 143, 152)` → `rgb(247, 248, 248)`, transition: color 0.15s ease
- "Sign up" button: subtle bg lightening on hover

## Assets
- Linear logo SVG (use text "Linear" with appropriate weight, or inline SVG icon + "Linear" text)

## Text Content (verbatim)
Nav items: Product | Resources | Customers | Pricing | Now | Contact | Docs
Right: Open app | Log in | Sign up

## Responsive Behavior
- **Desktop (1440px):** Full nav row with all items visible
- **Mobile (390px):** Only logo + "Log in" + "Sign up" visible. Nav items hidden. No hamburger needed (out of scope).
- **Breakpoint:** ~768px

## Implementation Notes
- Use `position: fixed; top: 0; left: 0; right: 0; z-index: 100`
- Background gradient + backdrop-filter blur(20px)
- No dropdown needed (static mock)
- Verify with `npx tsc --noEmit` before finishing
