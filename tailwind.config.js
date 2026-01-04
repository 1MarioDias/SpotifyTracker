/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  safelist: [
    'grid-cols-3',
    'grid-cols-5',
    'grid-cols-10'
  ],
  theme: {
    extend: {
      colors: {
        'primary-dark': '#100C14',
        'primary-light': '#1D1A23',
        'accent-pink': '#E0218A',
        'accent-purple': '#8B5CF6',
        'text-primary': '#F1F1F1',
        'text-secondary': '#A0A0A0',
      },
      fontFamily: {
        'display': ['Satoshi', 'sans-serif'],
        'body': ['Inter', 'sans-serif'],
        'heading': ['Satoshi', 'sans-serif'],
        'nav': ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}