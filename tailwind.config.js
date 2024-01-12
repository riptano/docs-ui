module.exports = {
  content: ['./build/site/**/*.{html,js}'],
  darkMode: ['class', '[data-theme="dark"]'],
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
      xs: '0.75rem',
      sm: '0.90625rem',
      base: '1rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '2.125rem',
    },
    borderRadius: {
      DEFAULT: '0.375rem',
      full: '9999px',
    },
  },
  plugins: [],
}
