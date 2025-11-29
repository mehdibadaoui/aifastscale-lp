import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // LUXURY GOLD + BLACK DESIGN SYSTEM
        'luxury-gold': '#D4AF37',        // 24k gold primary
        'luxury-gold-light': '#F4E5C2',  // champagne accent
        'luxury-gold-dark': '#B8941E',   // deep gold
        'luxury-gold-pale': '#FAF8F3',   // cream
        'luxury-black': '#0A0A0A',       // rich black
        'luxury-charcoal': '#1A1A1A',    // charcoal
        'luxury-graphite': '#2D2D2D',    // graphite
        'luxury-pearl': '#F8F9FA',       // pearl white
        'luxury-silver': '#C0C0C0',      // silver accent
        'luxury-platinum': '#E5E5E5',    // platinum

        // Keeping old colors for backward compatibility
        'entrepedia-red': '#da2b35',
        'entrepedia-red-hover': '#b71e27',
        'entrepedia-dark': '#151515',
        'entrepedia-light': '#ffffff',
        'entrepedia-gray-50': '#f2f2f2',
        'entrepedia-gray-100': '#e6e6e6',
        'entrepedia-gray-400': '#8b8b8b',
        'entrepedia-gray-600': '#5e5e5e',
        'navy-deep': '#0a1128',
        'navy-rich': '#1c2541',
        'navy-medium': '#2d3e5f',
        'gold-premium': '#d4af37',
        'gold-light': '#f4e5c2',
        'gold-dark': '#b8941e',
        'white-pure': '#ffffff',
        'white-soft': '#f8f9fa',
        'cream-luxury': '#faf8f3',
        'red-electric': '#ff0040',
        'red-deep': '#c91432',
        'red-soft': '#ff2d55',
        'green-emerald': '#00b87c',
        'green-success': '#10b981',
      },
      fontFamily: {
        'league-spartan': ['League Spartan', 'system-ui', 'sans-serif'],
        'dm-sans': ['DM Sans', 'system-ui', 'sans-serif'],
        'dm-serif': ['DM Serif Display', 'serif'],
      },
    },
  },
  plugins: [],
}

export default config
