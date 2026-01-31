import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  safelist: [
    // Dynamic color classes for niche theming (amber for lawyers, teal for others)
    { pattern: /bg-(amber|teal)-\d+\/\d+/ },
    { pattern: /text-(amber|teal)-\d+/ },
    { pattern: /border-(amber|teal)-\d+\/\d+/ },
    { pattern: /fill-(amber|teal)-\d+/ },
    { pattern: /from-(amber|teal)-\d+/ },
    { pattern: /to-(amber|teal)-\d+/ },
    { pattern: /via-(amber|teal)-\d+/ },
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
        // Modern entrance animations
        'fade-in': 'fade-in 0.6s ease-out forwards',
        'fade-in-up': 'fade-in-up 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in-down': 'fade-in-down 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in-left': 'fade-in-left 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in-right': 'fade-in-right 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'scale-in': 'scale-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'zoom-in': 'zoom-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'blur-in': 'blur-in 0.6s ease-out forwards',
        'slide-up': 'slide-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-down': 'slide-down 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'rotate-in': 'rotate-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'bounce-in': 'bounce-in 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards',
        // Hover/interactive animations
        'hover-lift': 'hover-lift 0.3s ease-out forwards',
        'hover-glow': 'hover-glow 0.3s ease-out forwards',
        'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
        'wiggle': 'wiggle 0.5s ease-in-out',
        'shake': 'shake 0.5s ease-in-out',
        // Background animations
        'gradient-flow': 'gradient-flow 8s ease infinite',
        'spotlight': 'spotlight 4s ease-in-out infinite',
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
        // Modern entrance keyframes
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in-down': {
          '0%': { opacity: '0', transform: 'translateY(-30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in-left': {
          '0%': { opacity: '0', transform: 'translateX(-30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'fade-in-right': {
          '0%': { opacity: '0', transform: 'translateX(30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'zoom-in': {
          '0%': { opacity: '0', transform: 'scale(0.5)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'blur-in': {
          '0%': { opacity: '0', filter: 'blur(10px)' },
          '100%': { opacity: '1', filter: 'blur(0)' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        'slide-down': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        'rotate-in': {
          '0%': { opacity: '0', transform: 'rotate(-10deg) scale(0.9)' },
          '100%': { opacity: '1', transform: 'rotate(0) scale(1)' },
        },
        'bounce-in': {
          '0%': { opacity: '0', transform: 'scale(0.3)' },
          '50%': { transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        // Interactive keyframes
        'hover-lift': {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-5px)' },
        },
        'hover-glow': {
          '0%': { boxShadow: '0 0 0 rgba(139, 92, 246, 0)' },
          '100%': { boxShadow: '0 0 30px rgba(139, 92, 246, 0.4)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        'wiggle': {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(-3deg)' },
          '75%': { transform: 'rotate(3deg)' },
        },
        'shake': {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-5px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(5px)' },
        },
        'gradient-flow': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        'spotlight': {
          '0%, 100%': { opacity: '0.5', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.1)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
