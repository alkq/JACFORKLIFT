/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.html",
    "./*.js"
  ],
  theme: {
    extend: {
      colors: {
        primary: { 50: '#F8FAFC', 100: '#F1F5F9', DEFAULT: '#FFFFFF' },
        brand: { light: '#FF3B47', DEFAULT: '#E11D2A', dark: '#B8141F' },
        obsidian: { DEFAULT: '#0B0F17', surface: '#161F2E', muted: '#475569', light: '#64748B' },
        gold: { DEFAULT: '#C5A059', light: '#D4AF37' }
      },
      fontFamily: {
        heading: ['Montserrat', 'sans-serif'],
        body: ['Inter', 'sans-serif']
      },
      boxShadow: {
        'soft-glow': '0 12px 30px -8px rgba(225, 29, 42, 0.25)',
        'luxe': '0 12px 32px -4px rgba(15, 23, 42, 0.08), 0 2px 8px -2px rgba(15, 23, 42, 0.04)',
        'luxe-hover': '0 24px 50px -10px rgba(15, 23, 42, 0.14), 0 8px 20px -4px rgba(15, 23, 42, 0.06)'
      }
    }
  },
  plugins: []
};