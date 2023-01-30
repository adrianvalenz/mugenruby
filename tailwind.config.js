/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{html,md,liquid,erb,serb,rb}',
    './frontend/javascript/**/*.js',
  ],
  theme: {
    extend: {
      fontFamily: {
        "sans": ["Roboto", "sans-serif"],
        "serif": ["Roboto Slab", "serif"],
        "mono": ["Roboto Mono", "monospace"],
      }
    },
  },
  plugins: [],
}
