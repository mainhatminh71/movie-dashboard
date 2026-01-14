/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        tinyZ: {
          dark: '#0f0f0f',
          'dark-alt': '#1a1a1a',
          accent: '#00d4ff',
          'accent-hover': '#00b9ae',
          text: '#ffffff',
          'text-secondary': '#e0e0e0',
        },
      },
      backgroundColor: {
        'grok-dark': '#0f0f0f',
        'grok-dark-alt': '#1a1a1a',
      },
      textColor: {
        'grok-accent': '#00d4ff',
      },
    },
  },
  plugins: [],
}