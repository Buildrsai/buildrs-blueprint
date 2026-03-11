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
