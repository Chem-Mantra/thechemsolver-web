/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      // ── Atomic Excellence — exact Stitch MD3 token names ──────────
      colors: {
        // Surface scale
        'background':                 '#08020d',
        'surface':                    '#0e1322',
        'surface-dim':                '#0e1322',
        'surface-bright':             '#343949',
        'surface-container-lowest':   '#090e1c',
        'surface-container-low':      '#161b2b',
        'surface-container':          '#1a1f2f',
        'surface-container-high':     '#25293a',
        'surface-container-highest':  '#2f3445',
        'surface-variant':            '#2f3445',
        'surface-tint':               '#00dbe7',
        // Primary — Neon Teal
        'primary':                    '#e1fdff',
        'primary-container':          '#00f2ff',
        'primary-fixed':              '#74f5ff',
        'primary-fixed-dim':          '#00dbe7',
        'on-primary':                 '#00363a',
        'on-primary-fixed':           '#002022',
        'on-primary-fixed-variant':   '#004f54',
        'on-primary-container':       '#006a71',
        'inverse-primary':            '#00696f',
        // Secondary — Electric Violet
        'secondary':                  '#d0bcff',
        'secondary-container':        '#571bc1',
        'secondary-fixed':            '#e9ddff',
        'secondary-fixed-dim':        '#d0bcff',
        'on-secondary':               '#3c0091',
        'on-secondary-container':     '#c4abff',
        'on-secondary-fixed':         '#23005c',
        'on-secondary-fixed-variant': '#5516be',
        // Tertiary — Excellence Gold
        'tertiary':                   '#fff6e4',
        'tertiary-container':         '#ffd81d',
        'tertiary-fixed':             '#ffe16d',
        'tertiary-fixed-dim':         '#e9c400',
        'on-tertiary':                '#3a3000',
        'on-tertiary-container':      '#715e00',
        'on-tertiary-fixed':          '#221b00',
        'on-tertiary-fixed-variant':  '#544600',
        // On-colors
        'on-surface':                 '#dee1f7',
        'on-surface-variant':         '#b9cacb',
        'on-background':              '#dee1f7',
        'inverse-surface':            '#dee1f7',
        'inverse-on-surface':         '#2b3040',
        // Outline
        'outline':                    '#849495',
        'outline-variant':            '#3a494b',
        // Error
        'error':                      '#ffb4ab',
        'error-container':            '#93000a',
        'on-error':                   '#690005',
        'on-error-container':         '#ffdad6',
        // Legacy compat — dashboard pages
        saffron: {
          50: '#fff7ed', 100: '#ffedd5', 200: '#fed7aa', 300: '#fdba74',
          400: '#fb923c', 500: '#f97316', 600: '#ea580c', 700: '#c2410c',
          800: '#9a3412', 900: '#7c2d12',
        },
        chemRed: {
          50: '#fef2f2', 100: '#fee2e2', 200: '#fecaca', 300: '#fca5a5',
          400: '#f87171', 500: '#ef4444', 600: '#dc2626', 700: '#b91c1c',
          800: '#991b1b', 900: '#7f1d1d',
        },
        chemBlue: {
          50: '#eff6ff', 100: '#dbeafe', 200: '#bfdbfe', 300: '#93c5fd',
          400: '#60a5fa', 500: '#3b82f6', 600: '#2563eb', 700: '#1d4ed8',
          800: '#1e40af', 900: '#1e3a8a',
        },
      },

      // ── Font families — semantic Stitch names → CSS vars ──────────
      fontFamily: {
        'display-lg':        ['var(--font-sora)', 'sans-serif'],
        'display-lg-mobile': ['var(--font-sora)', 'sans-serif'],
        'headline-xl':       ['var(--font-sora)', 'sans-serif'],
        'headline-lg':       ['var(--font-sora)', 'sans-serif'],
        'headline-md':       ['var(--font-sora)', 'sans-serif'],
        'body-lg':           ['var(--font-hanken)', 'sans-serif'],
        'body-md':           ['var(--font-hanken)', 'sans-serif'],
        'label-sm':          ['var(--font-space-mono)', 'monospace'],
        // Shorthand aliases
        display:             ['var(--font-sora)', 'sans-serif'],
        body:                ['var(--font-hanken)', 'sans-serif'],
        mono:                ['var(--font-space-mono)', 'monospace'],
      },

      // ── Font sizes — semantic Stitch scale ────────────────────────
      fontSize: {
        'display-lg':        ['64px', { lineHeight: '1.1', fontWeight: '700', letterSpacing: '-0.02em' }],
        'display-lg-mobile': ['40px', { lineHeight: '1.2', fontWeight: '700' }],
        'headline-xl':       ['40px', { lineHeight: '1.2', fontWeight: '600' }],
        'headline-lg':       ['32px', { lineHeight: '1.3', fontWeight: '600' }],
        'headline-md':       ['24px', { lineHeight: '1.4', fontWeight: '500' }],
        'body-lg':           ['18px', { lineHeight: '1.6', fontWeight: '400' }],
        'body-md':           ['16px', { lineHeight: '1.6', fontWeight: '400' }],
        'label-sm':          ['12px', { lineHeight: '1.0', fontWeight: '500', letterSpacing: '0.1em' }],
      },

      // ── Spacing — Stitch tokens ───────────────────────────────────
      spacing: {
        'unit':           '8px',
        'gutter':         '24px',
        'margin-mobile':  '16px',
        'margin-desktop': '64px',
      },

      // ── Max width ─────────────────────────────────────────────────
      maxWidth: {
        'container-max': '1280px',
      },

      // ── Border radius — Stitch overrides ─────────────────────────
      borderRadius: {
        DEFAULT: '0.125rem',
        sm:      '0.125rem',
        md:      '0.25rem',
        lg:      '0.25rem',
        xl:      '0.5rem',
        '2xl':   '0.75rem',
        '3xl':   '1.5rem',
        '[40px]': '40px',
        full:    '9999px',
      },

      backgroundImage: {
        'chemistry-gradient': 'linear-gradient(135deg, #00f2ff 0%, #8b5cf6 100%)',
      },
    },
  },
  plugins: [],
}

module.exports = config
