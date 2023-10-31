const tailwindconfig = {
  content: ['./build/site/**/*.{html,js}'],
  theme: {
    spacing: {
      0: '0',
      0.5: '0.5rem',
      1: '1rem',
      1.5: '1.5rem',
      2: '2rem',
      2.5: '2.5rem',
      3: '3rem',
      3.5: '3.5rem',
      4: '4rem',
      5: '5rem',
      6: '6rem',
      7: '7rem',
      8: '8rem',
      9: '9rem',
      10: '10rem',
      11: '11rem',
      15: '15rem',
    },
    extend: {
      spacing: {
        0.25: '0.25rem',
      },
    },
  },
  plugins: [],
}

export default tailwindconfig
