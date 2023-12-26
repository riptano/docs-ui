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
    },
    // spacing: {
    //   0: '0',
    //   0.5: '0.5rem',
    //   1: '1rem',
    //   1.5: '1.5rem',
    //   2: '2rem',
    //   2.5: '2.5rem',
    //   3: '3rem',
    //   3.5: '3.5rem',
    //   4: '4rem',
    //   5: '5rem',
    //   6: '6rem',
    //   7: '7rem',
    //   8: '8rem',
    //   9: '9rem',
    //   10: '10rem',
    //   11: '11rem',
    //   15: '15rem',
    // },
    // extend: {
    //   spacing: {
    //     0.25: '0.25rem',
    //   },
    // },
  },
  plugins: [],
}
