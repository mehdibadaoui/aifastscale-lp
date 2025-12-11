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
        'sans': ['var(--font-inter)', 'system-ui', 'sans-serif'],
        'heading': ['var(--font-plus-jakarta)', 'system-ui', 'sans-serif'],
        'inter': ['var(--font-inter)', 'system-ui', 'sans-serif'],
        'jakarta': ['var(--font-plus-jakarta)', 'system-ui', 'sans-serif'],
        'league-spartan': ['League Spartan', 'system-ui', 'sans-serif'],
        'dm-sans': ['DM Sans', 'system-ui', 'sans-serif'],
        'dm-serif': ['DM Serif Display', 'serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px rgba(0, 0, 0, 0.1)',
        'glass-lg': '0 12px 48px rgba(0, 0, 0, 0.15)',
        'premium': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        'premium-lg': '0 35px 60px -15px rgba(0, 0, 0, 0.3)',
        'glow-teal': '0 0 40px rgba(20, 184, 166, 0.3)',
        'glow-gold': '0 0 40px rgba(212, 175, 55, 0.3)',
      },
      backdropBlur: {
        'xs': '2px',
      },
      animation: {
        'gradient-x': 'gradient-x 15s ease infinite',
        'gradient-y': 'gradient-y 15s ease infinite',
        'gradient-xy': 'gradient-xy 15s ease infinite',
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 8s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        'gradient-y': {
          '0%, 100%': { backgroundPosition: '0% 0%' },
          '50%': { backgroundPosition: '0% 100%' },
        },
        'gradient-x': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'gradient-xy': {
          '0%, 100%': { backgroundPosition: '0% 0%' },
          '25%': { backgroundPosition: '100% 0%' },
          '50%': { backgroundPosition: '100% 100%' },
          '75%': { backgroundPosition: '0% 100%' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(20, 184, 166, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(20, 184, 166, 0.5)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}

export default config
