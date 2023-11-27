module.exports = {
  content: ['./build/site/**/*.{html,js}'],
  theme: {
    fontFamily: {
      sans: ['Roboto Flex', 'sans-serif'],
      display: ['Sora', 'sans-serif'],
      icons: ['Material Icons Outlined', 'sans-serif'],
      mono: ['Roboto Mono', 'monospace'],
    },
    screens: {
      sm: '480px',
      md: '768px',
      lg: '1024px',
      xl: '1440px',
    },
    fontSize: {
      sm: '0.90625rem',
      base: '1rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
    },
    borderRadius: {
      DEFAULT: '0.375rem',
    },
    spacing: {
      0: '0',
      0.5: 'var(--ds-space-h)',
      1: 'var(--ds-space-1)',
      1.5: 'var(--ds-space-1h)',
      2: 'var(--ds-space-2)',
      2.5: 'var(--ds-space-2h)',
      3: 'var(--ds-space-3)',
      3.5: 'var(--ds-space-3h)',
      4: 'var(--ds-space-4)',
      5: 'var(--ds-space-5)',
      6: 'var(--ds-space-6)',
      7: 'var(--ds-space-7)',
      8: 'var(--ds-space-8)',
      9: 'var(--ds-space-9)',
      10: 'var(--ds-space-10)',
      11: 'var(--ds-space-11)',
      15: 'var(--ds-space-15)',
    },
    extend: {
      spacing: {
        0.25: 'var(--ds-space-q)',
      },
      typography: {
        DEFAULT: {
          css: {
            '--tw-prose-body': 'var(--ds-text-secondary)',
            '--tw-prose-headings': 'var(--ds-text-primary)',
            '--tw-prose-lead': 'var(--ds-text-primary)',
            '--tw-prose-links': 'var(--ds-primary-main)',
            '--tw-prose-bold': 'var(--ds-text-primary)',
            '--tw-prose-counters': 'var(--ds-text-primary)',
            '--tw-prose-bullets': 'var(--ds-text-primary)',
            '--tw-prose-hr': 'var(--ds-divider)',
            '--tw-prose-quotes': 'var(--ds-text-primary)',
            '--tw-prose-quote-borders': 'var(--ds-divider)',
            '--tw-prose-captions': 'var(--ds-text-primary)',
            '--tw-prose-code': 'var(--ds-text-secondary)',
            '--tw-prose-pre-code': 'var(--ds-text-secondary)',
            '--tw-prose-pre-bg': 'var(--ds-background-level1)',
            '--tw-prose-th-borders': 'var(--ds-divider)',
            '--tw-prose-td-borders': 'var(--ds-divider)',
            maxWidth: 'var(--doc-max-width)',
            h1: {
              fontSize: 'calc(24 / var(--rem-base) * 1rem)',
              fontWeight: 550,
              fontFamily: '"Sora", sans-serif',
            },
            h2: {
              fontSize: 'calc(20 / var(--rem-base) * 1rem)',
              fontWeight: 550,
              paddingBottom: '0.5em',
              marginBottom: '0.5em',
              fontFamily: '"Sora", sans-serif',
              borderBottom: '1px solid var(--ds-divider)',
            },
            h3: {
              fontSize: 'calc(16 / var(--rem-base) * 1rem)',
              fontWeight: 600,
            },
            h4: {
              fontSize: 'calc(15 / var(--rem-base) * 1rem)',
              fontWeight: 600,
            },
            'h1.discrete, h2.discrete, h3.discrete, h4.discrete': {
              borderBottom: 0,
              margin: 0,
            },
            a: {
              textDecoration: 'none',
            },
            'a:hover': {
              textDecoration: 'underline',
            },
            'a.external::after': {
              fontFamily: '"Material Icons Outlined"',
              content: "'\\e89e'",
              fontSize: 'calc(16 / var(--rem-base) * 1rem)',
              verticalAlign: 'bottom',
              marginLeft: 'var(--ds-space-h)',
              fontWeight: 'normal',
            },
            pre: {
              whiteSpace: 'pre-wrap',
              fontSize: 'calc(14 / var(--rem-base) * 1rem)',
            },
            table: {
              fontSize: 'calc(14.5 / var(--rem-base) * 1rem)',
              maxWidth: 'var(--doc-max-width)',
            },
            'thead th': {
              fontSize: 'calc(13 / var(--rem-base) * 1rem)',
              color: 'var(--ds-text-tertiary)',
            },
            '.tableblock caption': {
              textAlign: 'left',
            },
            'table p, table dl': {
              margin: 0,
            },
            'tbody td, tfoot td, thead th': {
              padding: '0.75em',
            },
            '.title': {
              fontWeight: 600,
              fontStyle: 'normal',
              color: 'var(--tw-prose-captions)',
              fontSize: '1rem',
              marginBottom: '1em',
            },
            'code::before': {
              content: 'none',
            },
            'code::after': {
              content: 'none',
            },
            code: {
              background: 'var(--ds-background-level2)',
              color: 'var(--ds-text-primary)',
              fontWeight: 400,
              borderRadius: '0.3125rem',
              paddingTop: '0.1875em',
              paddingRight: '0.375em',
              paddingBottom: '0.1875em',
              paddingLeft: '0.375em',
            },
            'b.button::before': {
              content: '"["',
              paddingRight: '0.25em',
            },
            'b.button::after': {
              content: '"]"',
              paddingLeft: '0.25em',
            },
            '.menuseq i.caret::before': {
              fontFamily: '"Material Icons Outlined"',
              fontStyle: 'normal',
              verticalAlign: 'sub',
              content: '"\\e5cc"',
              width: '0.75em',
              fontSize: '1.1em',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
