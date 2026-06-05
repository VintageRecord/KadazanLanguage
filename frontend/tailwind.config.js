/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: '#1a3a2a',
          50:  '#f0f7f3',
          100: '#d4eade',
          200: '#a8d5ba',
          300: '#72b896',
          400: '#3e9b72',
          500: '#1a7a50',
          600: '#146040',
          700: '#0f4a30',
          800: '#0a3522',
          900: '#061f14',
        },
        earth: {
          DEFAULT: '#6b3a1f',
          50:  '#fdf5ef',
          100: '#f8e4cc',
          200: '#f0c897',
          300: '#e5a45e',
          400: '#d6833a',
          500: '#c0651e',
          600: '#a04e16',
          700: '#7d3a10',
          800: '#5e2a0b',
          900: '#3e1b07',
        },
        cream: '#f9f5ee',
        parchment: '#ede8de',
      },
      fontFamily: {
        sans:    ['Inter', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'Georgia', 'serif'],
      },
      boxShadow: {
        card:  '0 8px 32px rgba(0,0,0,0.18)',
        glass: '0 4px 24px rgba(0,0,0,0.12)',
      },
    },
  },
  plugins: [],
};
