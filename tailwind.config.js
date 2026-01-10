/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#050805',       // Deepest forest black
        surface: '#0f140f',          // Dark organic card background
        surfaceHighlight: '#1a211a', // Lighter hover state
        border: '#2a332a',           // Subtle borders
        primary: '#d2ff28',          // Bright Lime (Brand Identity)
        primaryDim: 'rgba(210, 255, 40, 0.1)', // Low opacity lime
        accent: '#ff6b2b',           // Persimmon Orange (Status/Alerts)
        textMain: '#eff2ef',         // Off-white for readability
        textMuted: '#8b948b',        // Sage grey for secondary text
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'], // We might want to add a font link later
        mono: ['JetBrains Mono', 'monospace'],
      }
    },
  },
  plugins: [],
}
