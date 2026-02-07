/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cricket: {
          green: '#22c55e',
          darkGreen: '#15803d',
          blue: '#1e40af',
          darkBlue: '#1e3a8a',
          red: '#dc2626',
          gold: '#f59e0b'
        }
      },
      animation: {
        'pulse-slow': 'pulse 3s infinite',
        'bounce-slow': 'bounce 2s infinite',
      }
    },
  },
  plugins: [],
}