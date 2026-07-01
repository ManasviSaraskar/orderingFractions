/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          dark: 'var(--bg-dark)',
          card: 'var(--bg-card)',
          solid: 'var(--bg-card-solid)',
        },
        purple: {
          deep: 'var(--purple-deep)',
          mid: 'var(--purple-mid)',
          light: 'var(--purple-light)',
        },
        blue: {
          deep: 'var(--blue-deep)',
          mid: 'var(--blue-mid)',
          bright: 'var(--blue-bright)',
        },
        gold: {
          DEFAULT: 'var(--gold)',
          light: 'var(--gold-light)',
          dark: 'var(--gold-dark)',
        },
        green: {
          DEFAULT: 'var(--green)',
          light: 'var(--green-light)',
        },
        red: {
          DEFAULT: 'var(--red)',
          light: 'var(--red-light)',
        },
        coral: 'var(--coral)',
      },
      fontFamily: {
        display: 'var(--font-display)',
        body: 'var(--font-body)',
      },
      textColor: {
        primary: 'var(--text-primary)',
        secondary: 'var(--text-secondary)',
        muted: 'var(--text-muted)',
      },
    },
  },
  plugins: [],
}
