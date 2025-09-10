/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class', // IMPORTANTE: deve ser 'class'
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#10b981',
        },
      },
    },
  },
  plugins: [],
}
