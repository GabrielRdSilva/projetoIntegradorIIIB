/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'emerald': {
          50: '#ecfdf5',
          600: '#059669',
          700: '#047857',
        },
        'slate': {
          50: '#f8fafc',
          200: '#e2e8f0',
          800: '#1e293b',
        }
      }
    },
  },
  plugins: [],
}
