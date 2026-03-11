# Phase 1 — Scaffold + Design System + Composants UI

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bootstrapper le projet Buildrs avec Vite/React/TS, configurer le design system complet (CSS variables + Tailwind), et créer 5 composants UI de base via shadcn/ui customisé aux tokens Buildrs.

**Architecture:** shadcn/ui (Radix UI + Tailwind) comme fondation composants, overridé intégralement par les tokens Buildrs. CSS variables définies dans `globals.css`, mappées dans `tailwind.config.ts`. Composants dans `src/components/ui/`, chacun dans son propre fichier.

**Tech Stack:** React 18, TypeScript (strict), Vite, Tailwind CSS v3, shadcn/ui, Radix UI, Lucide React, Vitest, @testing-library/react

---

## Chunk 1: Bootstrap & Configuration

**Files:**
- Create: `package.json` (via vite scaffold)
- Create: `vite.config.ts`
- Create: `tsconfig.json`
- Create: `tailwind.config.ts`
- Create: `postcss.config.js`
- Create: `components.json` (shadcn/ui config)
- Create: `src/main.tsx`
- Create: `src/App.tsx`
- Create: `index.html`
- Create: `src/test/setup.ts`

### Task 1: Scaffold Vite + React + TS

- [ ] **Step 1: Créer le projet Vite**

```bash
cd "/Users/alfredorsini/CLAUDE/buildrs project"
/usr/local/bin/npm create vite@latest . -- --template react-ts
```

Répondre `y` si demandé pour écraser le dossier existant (seul `.vscode` et `CLAUDE.md` dedans).

- [ ] **Step 2: Installer les dépendances de base**

```bash
/usr/local/bin/npm install
```

- [ ] **Step 3: Installer Tailwind CSS**

```bash
/usr/local/bin/npm install -D tailwindcss@3 autoprefixer postcss
/usr/local/bin/npx tailwindcss init -p
```

- [ ] **Step 4: Installer shadcn/ui et ses dépendances**

```bash
/usr/local/bin/npm install class-variance-authority clsx tailwind-merge
/usr/local/bin/npm install @radix-ui/react-slot
/usr/local/bin/npm install lucide-react
```

- [ ] **Step 5: Installer Vitest + Testing Library**

```bash
/usr/local/bin/npm install -D vitest @vitest/ui jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

- [ ] **Step 6: Configurer Vite avec alias `@` et Vitest**

Remplacer le contenu de `vite.config.ts` :

```typescript
/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
})
```

- [ ] **Step 7: Configurer tsconfig.app.json pour les imports absolus**

Dans `tsconfig.app.json` (celui que TypeScript utilise pour la compilation — le root `tsconfig.json` contient seulement des `references`, ne pas le modifier), ajouter dans `compilerOptions` :

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

Note : ajouter `"baseUrl"` et `"paths"` aux `compilerOptions` existants dans `tsconfig.app.json` — ne pas remplacer le fichier entier.

- [ ] **Step 8: Créer le fichier setup de test**

```bash
mkdir -p src/test
```

Créer `src/test/setup.ts` :

```typescript
import '@testing-library/jest-dom'
```

- [ ] **Step 9: Créer `components.json` (config shadcn/ui)**

Créer `components.json` à la racine du projet :

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsx": false,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "src/styles/globals.css",
    "baseColor": "slate",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "iconLibrary": "lucide"
}
```

Ce fichier permet d'utiliser `npx shadcn-ui add <component>` dans les prochaines phases.

- [ ] **Step 10: Ajouter scripts dans package.json**

Dans `package.json`, modifier la section `scripts` :

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:run": "vitest run",
    "test:ui": "vitest --ui"
  }
}
```

`test:run` est utilisé pour les vérifications non-interactives (CI, automatisation). `test` reste en mode watch pour le développement.

- [ ] **Step 11: Vérifier que le projet compile**

```bash
/usr/local/bin/npm run build
```

Attendu : build réussi dans `dist/`, pas d'erreur TypeScript.

Note : `npm run dev` peut être lancé manuellement pour vérifier visuellement dans le navigateur (bloque le terminal).

- [ ] **Step 12: Commit**

```bash
git add -A
git commit -m "feat: bootstrap Vite + React + TS + Tailwind + shadcn/ui + Vitest"
```

---

## Chunk 2: Design Tokens

**Files:**
- Create: `src/styles/globals.css`
- Create: `src/styles/fonts.css`
- Modify: `tailwind.config.ts`
- Modify: `src/main.tsx`
- Modify: `index.html`

### Task 2: CSS Variables + Fonts

- [ ] **Step 1: Créer `src/styles/fonts.css`**

```css
@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Geist:wght@300;400;500;600&family=Geist+Mono:wght@400;500&display=swap');
```

- [ ] **Step 2: Créer `src/styles/globals.css`**

```css
@import './fonts.css';
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  /* BACKGROUNDS */
  --bg-base:        #080909;
  --bg-elevated:    #0C0D0E;
  --bg-surface:     #111214;
  --bg-overlay:     #161819;

  /* BORDERS */
  --border-subtle:  rgba(255, 255, 255, 0.06);
  --border-default: rgba(255, 255, 255, 0.10);
  --border-strong:  rgba(255, 255, 255, 0.18);
  --border-glow:    rgba(255, 255, 255, 0.30);

  /* TEXT */
  --text-primary:   #EDEEEF;
  --text-secondary: rgba(237, 238, 239, 0.55);
  --text-muted:     rgba(237, 238, 239, 0.30);
  --text-disabled:  rgba(237, 238, 239, 0.15);

  /* ACCENT */
  --accent:         #E8E8E8;
  --accent-glow:    rgba(232, 232, 232, 0.08);

  /* SEMANTIC */
  --success:        rgba(74, 222, 128, 0.7);
  --warning:        rgba(251, 191, 36, 0.7);
  --error:          rgba(248, 113, 113, 0.7);

  /* SHADOWS */
  --shadow-sm:  0 1px 3px rgba(0, 0, 0, 0.4);
  --shadow-md:  0 4px 16px rgba(0, 0, 0, 0.5);
  --shadow-lg:  0 8px 32px rgba(0, 0, 0, 0.6);
  --shadow-xl:  0 16px 48px rgba(0, 0, 0, 0.7);

  /* RADIUS */
  --radius-sm:   4px;
  --radius-md:   8px;
  --radius-lg:   12px;
  --radius-xl:   16px;
  --radius-full: 9999px;

  /* ANIMATIONS */
  --duration-fast:   150ms;
  --duration-base:   250ms;
  --duration-slow:   400ms;
  --duration-enter:  600ms;
  --ease-out:  cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in:   cubic-bezier(0.7, 0, 0.84, 0);
  --ease-both: cubic-bezier(0.83, 0, 0.17, 1);
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  scroll-behavior: smooth;
}

body {
  background-color: var(--bg-base);
  color: var(--text-primary);
  font-family: 'Geist', sans-serif;
  font-size: 15px;
  line-height: 1.7;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* DOTS PATTERN — signature Buildrs, obligatoire sur toutes les pages */
.dots-bg {
  background-image: radial-gradient(circle, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
  background-size: 28px 28px;
}

/* Fade des bords du dots pattern */
.dots-bg::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at 50% 50%, transparent 40%, var(--bg-base) 100%);
  pointer-events: none;
}
```

- [ ] **Step 3: Remplacer `tailwind.config.ts` par la config Buildrs complète**

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'bg-base':     'var(--bg-base)',
        'bg-elevated': 'var(--bg-elevated)',
        'bg-surface':  'var(--bg-surface)',
        'bg-overlay':  'var(--bg-overlay)',
        'border-subtle':  'var(--border-subtle)',
        'border-default': 'var(--border-default)',
        'border-strong':  'var(--border-strong)',
        'border-glow':    'var(--border-glow)',
        'text-primary':   'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'text-muted':     'var(--text-muted)',
        'text-disabled':  'var(--text-disabled)',
        accent:   'var(--accent)',
        success:  'var(--success)',
        warning:  'var(--warning)',
        error:    'var(--error)',
      },
      fontFamily: {
        display: ['"Instrument Serif"', 'serif'],
        sans:    ['Geist', 'sans-serif'],
        mono:    ['"Geist Mono"', 'monospace'],
      },
      borderRadius: {
        sm:   'var(--radius-sm)',
        md:   'var(--radius-md)',
        lg:   'var(--radius-lg)',
        xl:   'var(--radius-xl)',
        full: 'var(--radius-full)',
      },
      boxShadow: {
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        xl: 'var(--shadow-xl)',
      },
      transitionDuration: {
        fast:  'var(--duration-fast)',
        base:  'var(--duration-base)',
        slow:  'var(--duration-slow)',
        enter: 'var(--duration-enter)',
      },
    },
  },
  plugins: [],
}

export default config
```

- [ ] **Step 4: Ajouter les preconnects Google Fonts dans `index.html`**

Dans `<head>`, avant `</head>` :

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
```

- [ ] **Step 5: Importer `globals.css` dans `src/main.tsx`**

```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import '@/styles/globals.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

- [ ] **Step 6: Vérifier que le build passe**

```bash
/usr/local/bin/npm run build
```

Attendu : build réussi, pas d'erreur. Pour vérification visuelle manuelle, lancer `npm run dev` dans un terminal séparé (bloque — ouvrir http://localhost:5173 et vérifier fond `#080909`, texte clair, fonts Geist chargées).

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: add Buildrs design tokens, CSS variables, fonts"
```

---

## Chunk 3: Utilitaire + Composants UI

**Files:**
- Create: `src/lib/utils.ts`
- Create: `src/lib/__tests__/utils.test.ts`
- Create: `src/components/ui/button.tsx`
- Create: `src/components/ui/card.tsx`
- Create: `src/components/ui/input.tsx`
- Create: `src/components/ui/badge.tsx`
- Create: `src/components/ui/divider.tsx`
- Create: `src/components/ui/index.ts`
- Create: `src/components/ui/__tests__/button.test.tsx`
- Create: `src/components/ui/__tests__/card.test.tsx`
- Create: `src/components/ui/__tests__/input.test.tsx`
- Create: `src/components/ui/__tests__/badge.test.tsx`
- Create: `src/components/ui/__tests__/divider.test.tsx`

### Task 3: Utilitaire `cn()`

- [ ] **Step 1: Écrire le test**

Créer `src/lib/__tests__/utils.test.ts` :

```typescript
import { describe, it, expect } from 'vitest'
import { cn } from '@/lib/utils'

describe('cn', () => {
  it('merges class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar')
  })

  it('handles undefined/falsy values', () => {
    expect(cn('foo', undefined, false, 'bar')).toBe('foo bar')
  })

  it('deduplicates conflicting Tailwind classes (last wins)', () => {
    expect(cn('p-4', 'p-8')).toBe('p-8')
  })
})
```

- [ ] **Step 2: Vérifier que le test échoue**

```bash
/usr/local/bin/npm run test:run -- src/lib/__tests__/utils.test.ts
```

Attendu : FAIL — `Cannot find module '@/lib/utils'`

- [ ] **Step 3: Créer `src/lib/utils.ts`**

```typescript
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

- [ ] **Step 4: Vérifier que le test passe**

```bash
/usr/local/bin/npm run test:run -- src/lib/__tests__/utils.test.ts
```

Attendu : PASS (3 tests)

- [ ] **Step 5: Commit**

```bash
git add src/lib/utils.ts src/lib/__tests__/utils.test.ts
git commit -m "feat: add cn() utility (clsx + tailwind-merge)"
```

---

### Task 4: Composant `Button`

- [ ] **Step 1: Écrire les tests**

Créer `src/components/ui/__tests__/button.test.tsx` :

```typescript
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Button } from '@/components/ui/button'

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('renders primary variant by default', () => {
    render(<Button>Primary</Button>)
    const btn = screen.getByRole('button')
    expect(btn.className).toContain('bg-text-primary')
  })

  it('renders secondary variant', () => {
    render(<Button variant="secondary">Secondary</Button>)
    const btn = screen.getByRole('button')
    expect(btn.className).toContain('border-border-default')
  })

  it('renders ghost variant', () => {
    render(<Button variant="ghost">Ghost</Button>)
    const btn = screen.getByRole('button')
    expect(btn.className).toContain('border-transparent')
  })

  it('accepts and passes through className', () => {
    render(<Button className="custom-class">Test</Button>)
    expect(screen.getByRole('button').className).toContain('custom-class')
  })

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })
})
```

- [ ] **Step 2: Vérifier que les tests échouent**

```bash
/usr/local/bin/npm run test:run -- src/components/ui/__tests__/button.test.tsx
```

Attendu : FAIL — `Cannot find module '@/components/ui/button'`

- [ ] **Step 3: Créer `src/components/ui/button.tsx`**

```typescript
import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap font-sans text-sm font-medium transition-opacity duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-strong focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base disabled:pointer-events-none disabled:opacity-40',
  {
    variants: {
      variant: {
        primary:
          'bg-text-primary text-bg-base rounded-md hover:opacity-85',
        secondary:
          'bg-transparent text-text-secondary border border-border-default rounded-md hover:border-border-strong hover:text-text-primary hover:bg-white/[0.04]',
        ghost:
          'bg-transparent text-text-secondary border border-transparent rounded-md hover:text-text-primary hover:bg-white/[0.04]',
      },
      size: {
        sm:  'h-8  px-3   text-xs',
        md:  'h-9  px-[18px] text-sm',
        lg:  'h-10 px-5   text-sm',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size:    'md',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
```

- [ ] **Step 4: Vérifier que les tests passent**

```bash
/usr/local/bin/npm run test:run -- src/components/ui/__tests__/button.test.tsx
```

Attendu : PASS (6 tests)

- [ ] **Step 5: Commit**

```bash
git add src/components/ui/button.tsx src/components/ui/__tests__/button.test.tsx
git commit -m "feat: add Button component (primary/secondary/ghost variants)"
```

---

### Task 5: Composant `Card`

- [ ] **Step 1: Écrire les tests**

Créer `src/components/ui/__tests__/card.test.tsx` :

```typescript
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Card } from '@/components/ui/card'

describe('Card', () => {
  it('renders children', () => {
    render(<Card>Content</Card>)
    expect(screen.getByText('Content')).toBeInTheDocument()
  })

  it('has bg-elevated background', () => {
    render(<Card>Test</Card>)
    expect(screen.getByText('Test').parentElement?.className ?? '').toContain('bg-bg-elevated')
  })

  it('accepts and passes through className', () => {
    render(<Card className="custom">Test</Card>)
    expect(screen.getByText('Test').parentElement?.className ?? '').toContain('custom')
  })
})
```

- [ ] **Step 2: Vérifier que les tests échouent**

```bash
/usr/local/bin/npm run test:run -- src/components/ui/__tests__/card.test.tsx
```

Attendu : FAIL

- [ ] **Step 3: Créer `src/components/ui/card.tsx`**

```typescript
import * as React from 'react'
import { cn } from '@/lib/utils'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'bg-bg-elevated border border-border-subtle rounded-lg transition-all duration-base hover:border-border-default hover:-translate-y-px',
        className
      )}
      {...props}
    />
  )
)
Card.displayName = 'Card'

export { Card }
```

- [ ] **Step 4: Vérifier que les tests passent**

```bash
/usr/local/bin/npm run test:run -- src/components/ui/__tests__/card.test.tsx
```

Attendu : PASS (3 tests)

- [ ] **Step 5: Commit**

```bash
git add src/components/ui/card.tsx src/components/ui/__tests__/card.test.tsx
git commit -m "feat: add Card component"
```

---

### Task 6: Composant `Input`

- [ ] **Step 1: Écrire les tests**

Créer `src/components/ui/__tests__/input.test.tsx` :

```typescript
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Input } from '@/components/ui/input'

describe('Input', () => {
  it('renders with placeholder', () => {
    render(<Input placeholder="Enter text" />)
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument()
  })

  it('fires onChange when user types', async () => {
    const user = userEvent.setup()
    let value = ''
    render(<Input onChange={(e) => { value = e.target.value }} />)
    await user.type(screen.getByRole('textbox'), 'hello')
    expect(value).toBe('hello')
  })

  it('is disabled when disabled prop is set', () => {
    render(<Input disabled placeholder="disabled" />)
    expect(screen.getByPlaceholderText('disabled')).toBeDisabled()
  })

  it('accepts className', () => {
    render(<Input className="custom" />)
    expect(screen.getByRole('textbox').className).toContain('custom')
  })
})
```

- [ ] **Step 2: Vérifier que les tests échouent**

```bash
/usr/local/bin/npm run test:run -- src/components/ui/__tests__/input.test.tsx
```

Attendu : FAIL

- [ ] **Step 3: Créer `src/components/ui/input.tsx`**

```typescript
import * as React from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      className={cn(
        'flex w-full bg-bg-surface border border-border-default rounded-md text-text-primary font-sans text-sm px-[14px] py-[10px] placeholder:text-text-muted transition-all duration-fast focus-visible:outline-none focus-visible:border-border-strong focus-visible:shadow-[0_0_0_3px_rgba(255,255,255,0.04)] disabled:cursor-not-allowed disabled:opacity-40',
        className
      )}
      ref={ref}
      {...props}
    />
  )
)
Input.displayName = 'Input'

export { Input }
```

- [ ] **Step 4: Vérifier que les tests passent**

```bash
/usr/local/bin/npm run test:run -- src/components/ui/__tests__/input.test.tsx
```

Attendu : PASS (4 tests)

- [ ] **Step 5: Commit**

```bash
git add src/components/ui/input.tsx src/components/ui/__tests__/input.test.tsx
git commit -m "feat: add Input component"
```

---

### Task 7: Composant `Badge`

- [ ] **Step 1: Écrire les tests**

Créer `src/components/ui/__tests__/badge.test.tsx` :

```typescript
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Badge } from '@/components/ui/badge'

describe('Badge', () => {
  it('renders text content', () => {
    render(<Badge>New</Badge>)
    expect(screen.getByText('New')).toBeInTheDocument()
  })

  it('has uppercase text transform', () => {
    render(<Badge>test</Badge>)
    expect(screen.getByText('test').className).toContain('uppercase')
  })

  it('accepts className', () => {
    render(<Badge className="custom">Test</Badge>)
    expect(screen.getByText('Test').className).toContain('custom')
  })
})
```

- [ ] **Step 2: Vérifier que les tests échouent**

```bash
/usr/local/bin/npm run test:run -- src/components/ui/__tests__/badge.test.tsx
```

Attendu : FAIL

- [ ] **Step 3: Créer `src/components/ui/badge.tsx`**

```typescript
import * as React from 'react'
import { cn } from '@/lib/utils'

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        'inline-flex items-center font-sans text-[11px] font-medium uppercase tracking-[0.05em] px-2 py-[3px] rounded-sm border border-border-default text-text-muted',
        className
      )}
      {...props}
    />
  )
)
Badge.displayName = 'Badge'

export { Badge }
```

- [ ] **Step 4: Vérifier que les tests passent**

```bash
/usr/local/bin/npm run test:run -- src/components/ui/__tests__/badge.test.tsx
```

Attendu : PASS (3 tests)

- [ ] **Step 5: Commit**

```bash
git add src/components/ui/badge.tsx src/components/ui/__tests__/badge.test.tsx
git commit -m "feat: add Badge component"
```

---

### Task 8: Composant `Divider`

- [ ] **Step 1: Écrire les tests**

Créer `src/components/ui/__tests__/divider.test.tsx` :

```typescript
import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Divider } from '@/components/ui/divider'

describe('Divider', () => {
  it('renders an hr element', () => {
    const { container } = render(<Divider />)
    expect(container.querySelector('hr')).toBeInTheDocument()
  })

  it('accepts className', () => {
    const { container } = render(<Divider className="my-8" />)
    expect(container.querySelector('hr')?.className).toContain('my-8')
  })
})
```

- [ ] **Step 2: Vérifier que les tests échouent**

```bash
/usr/local/bin/npm run test:run -- src/components/ui/__tests__/divider.test.tsx
```

Attendu : FAIL

- [ ] **Step 3: Créer `src/components/ui/divider.tsx`**

```typescript
import * as React from 'react'
import { cn } from '@/lib/utils'

interface DividerProps extends React.HTMLAttributes<HTMLHRElement> {}

const Divider = React.forwardRef<HTMLHRElement, DividerProps>(
  ({ className, ...props }, ref) => (
    <hr
      ref={ref}
      className={cn(
        'h-px w-full border-none bg-gradient-to-r from-transparent via-border-subtle to-transparent',
        className
      )}
      {...props}
    />
  )
)
Divider.displayName = 'Divider'

export { Divider }
```

- [ ] **Step 4: Vérifier que les tests passent**

```bash
/usr/local/bin/npm run test:run -- src/components/ui/__tests__/divider.test.tsx
```

Attendu : PASS (2 tests)

- [ ] **Step 5: Créer le barrel export `src/components/ui/index.ts`**

```typescript
export { Button, buttonVariants } from './button'
export type { ButtonProps } from './button'
export { Card } from './card'
export { Input } from './input'
export { Badge } from './badge'
export { Divider } from './divider'
```

- [ ] **Step 6: Commit**

```bash
git add src/components/ui/divider.tsx src/components/ui/__tests__/divider.test.tsx src/components/ui/index.ts
git commit -m "feat: add Divider component + barrel export for all UI components"
```

---

### Task 9: App.tsx démo + vérification finale

- [ ] **Step 1: Mettre à jour `src/App.tsx` pour afficher tous les composants**

```typescript
import { Button, Card, Input, Badge, Divider } from '@/components/ui'

export default function App() {
  return (
    <div className="dots-bg relative min-h-screen bg-bg-base p-12">
      <div className="max-w-xl mx-auto space-y-8">

        <div>
          <p className="text-text-muted text-xs font-medium uppercase tracking-widest mb-4">Buildrs — Design System v1</p>
          <h1 className="font-display text-5xl text-text-primary mb-2">
            Le Laboratoire des<br /><em>Builders SaaS IA</em>
          </h1>
          <p className="text-text-secondary text-base">Composants UI — Phase 1</p>
        </div>

        <Divider />

        <div className="space-y-3">
          <p className="text-text-muted text-xs uppercase tracking-widest">Buttons</p>
          <div className="flex gap-3 flex-wrap">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="primary" disabled>Disabled</Button>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-text-muted text-xs uppercase tracking-widest">Badges</p>
          <div className="flex gap-2 flex-wrap">
            <Badge>New</Badge>
            <Badge>Beta</Badge>
            <Badge>V2.0</Badge>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-text-muted text-xs uppercase tracking-widest">Input</p>
          <Input placeholder="Décris ton idée de SaaS..." />
        </div>

        <div className="space-y-3">
          <p className="text-text-muted text-xs uppercase tracking-widest">Card</p>
          <Card className="p-6">
            <p className="text-text-secondary text-sm">
              Un Micro-SaaS Buildrs = un agent IA autonome encapsulé dans une interface qui résout UN problème pour UNE cible.
            </p>
          </Card>
        </div>

      </div>
    </div>
  )
}
```

- [ ] **Step 2: [MANUAL] Vérifier visuellement dans le navigateur**

> Agents automatisés : passer cette étape, aller directement au Step 3.

```bash
/usr/local/bin/npm run dev
```

Vérifier dans le navigateur :
- Fond `#080909` ✓
- Titre en Instrument Serif ✓
- UI en Geist ✓
- Dots pattern visible ✓
- Tous les composants s'affichent correctement ✓

- [ ] **Step 3: Lancer tous les tests**

```bash
/usr/local/bin/npm run test:run
```

Attendu : PASS — 18 tests (utils: 3, button: 6, card: 3, input: 4, badge: 3, divider: 2)

- [ ] **Step 4: Commit final**

```bash
git add src/App.tsx
git commit -m "feat: add design system demo in App.tsx — Phase 1 complete"
```

---

## Résumé Phase 1

À la fin de ce plan, le projet dispose de :
- ✅ Scaffold Vite + React + TS + Tailwind configuré
- ✅ Design system complet (CSS variables + tokens Tailwind)
- ✅ Fonts Instrument Serif + Geist + Geist Mono
- ✅ Dots pattern `.dots-bg` réutilisable
- ✅ `cn()` utility
- ✅ 5 composants UI testés : Button, Card, Input, Badge, Divider
- ✅ 18 tests passants
- ✅ Barrel export depuis `@/components/ui`
