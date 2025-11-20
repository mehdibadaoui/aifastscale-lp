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
    },
  },
  plugins: [],
}

export default config
