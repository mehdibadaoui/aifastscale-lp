/**
 * Bonus Products Configuration
 * All bonus products available for upsell after main purchase
 *
 * ✅ VETERAN COPYWRITER EDITION
 * - Never say "PDF" - use Masterclass/Guide/Blueprint/Playbook
 * - Always mention "Canva editable" where applicable
 * - Focus on OUTCOMES not features
 * - Use specific numbers and social proof
 */

export interface BonusProduct {
  id: string
  title: string
  subtitle: string
  value: number // Perceived value
  description: string
  icon: string // Lucide icon name
  iconColor: string // Icon color for professional look
  image?: string // Optional product preview image
  category: 'content' | 'tools' | 'training'
}

export const BONUS_PRODUCTS: BonusProduct[] = [
  // 1. The Luxury Agent's Brand Kit (FIRST)
  {
    id: 'luxury-brand-kit',
    title: 'The Luxury Agent\'s Brand Kit',
    subtitle: 'Premium Design Assets Worth $1,200+',
    value: 55,
    description: 'Professional logo templates, letterhead designs, business card layouts, email signatures, and branded social media templates. Position yourself as the luxury market authority with cohesive branding across every touchpoint. Fully editable in Canva - no designer needed.',
    icon: 'Briefcase',
    iconColor: '#6366f1', // Indigo
    image: '/images/products/brand-kit.webp',
    category: 'tools',
  },
  // 2. 2026 Business Planner (SECOND) - UPDATED PRICE $67
  {
    id: 'business-planner-2026',
    title: '2026 Business Planner "Million Dollar Roadmap"',
    subtitle: 'The 12-Month Blueprint Top 1% Agents Use',
    value: 67,
    description: 'Strategic quarterly goal-setting framework, monthly KPI trackers, and weekly power hours designed for real estate domination. Track every listing, lead source, and revenue stream in one beautiful planner. Fully editable in Canva - customize for your market.',
    icon: 'Calendar',
    iconColor: '#8b5cf6', // Purple
    image: '/images/products/business-planner.webp',
    category: 'tools',
  },
  // 3. 45 Real Estate Hooks (THIRD)
  {
    id: 'hooks-impossible-to-skip',
    title: '45 Real Estate Hooks Impossible to Skip',
    subtitle: 'Scroll-Stopping First 3 Seconds for Real Estate',
    value: 49,
    description: '45 proven opening lines, visual patterns, and attention-grabbing hooks tested on 10M+ views. Organized in 9 categories: Money Mistakes, Dream vs. Disaster, Secret Shortcuts, Market Shock, First-Time Buyers, Seller Edge, Investment, Hidden Costs, and Authority. Stop thumbs mid-scroll with hooks engineered using hook psychology. Includes complete swipe file + Canva templates.',
    icon: 'Zap',
    iconColor: '#f59e0b', // Amber
    image: '/images/products/hooks-impossible-to-skip.webp',
    category: 'content',
  },
  // 4. Custom ChatGPT AI Mentor (FOURTH)
  {
    id: 'chatgpt-ai-mentor',
    title: 'Custom ChatGPT AI Mentor',
    subtitle: 'Your 50-Year Veteran Coach Available 24/7 (Lifetime Access)',
    value: 45,
    description: 'AI trained on strategies from top producers, providing instant answers on negotiations, pricing strategy, difficult clients, and market positioning. Get expert guidance without the $500/hour fee - includes custom prompts library and setup guide.',
    icon: 'Bot',
    iconColor: '#06b6d4', // Cyan
    image: '/images/products/chatgpt-mentor.webp',
    category: 'tools',
  },
  // 5. The $10M Personal Brand Masterclass (FIFTH)
  {
    id: '90-day-blueprint',
    title: 'The $10M Personal Brand Masterclass',
    subtitle: 'Build a 7-Figure Brand Using AI in 90 Days',
    value: 65,
    description: 'The complete 5-week system top 1% agents use to build magnetic authority. Includes weekly action plans, AI prompt library, hook formulas, DM scripts, and the exact 17-minute daily ritual that compounds into market dominance. Fully editable Canva templates + fillable worksheets.',
    icon: 'ClipboardList',
    iconColor: '#3b82f6', // Blue
    image: '/images/products/personal-brand.webp',
    category: 'training',
  },
  // 6. 327 Instagram Story Templates
  {
    id: 'instagram-stories-templates',
    title: '327 Instagram Story Templates',
    subtitle: 'Pre-Designed Stories That Drive DMs & Listing Inquiries',
    value: 47,
    description: 'Done-for-you Canva story templates including open house countdowns, just listed/sold reveals, market updates, and engagement stickers. Simply edit your info and share - no design skills needed. Fully customizable in Canva.',
    icon: 'Smartphone',
    iconColor: '#ec4899', // Pink
    image: '/images/products/instagram-stories.webp',
    category: 'content',
  },
  // 7. 25 Fall Reels Template Pack
  {
    id: 'viral-reel-templates',
    title: '25 Fall Reels Template Pack',
    subtitle: 'Seasonal Content That Converts During Peak Buying Season',
    value: 29,
    description: 'Fall-themed real estate reels including pumpkin spice staging tips, cozy home tours, holiday prep advice, and autumn market trends. Ready-to-edit Canva templates designed for fall engagement - customize with your listings in under 5 minutes.',
    icon: 'Video',
    iconColor: '#ef4444', // Red
    image: '/images/products/viral-reels.webp',
    category: 'content',
  },
  // 8. 30 Funny Real Estate Social Media Posts
  {
    id: 'listing-presentation',
    title: '30 Funny Real Estate Social Media Posts',
    subtitle: 'Humor That Humanizes & Drives 3X More Engagement',
    value: 25,
    description: 'Pre-written funny posts and memes that get 3X more engagement than standard real estate content. Break through the noise with personality-driven humor that makes you memorable. Includes Canva templates with images - just add your logo and share.',
    icon: 'Smile',
    iconColor: '#d4af37', // Gold
    image: '/images/products/funny-posts.webp',
    category: 'content',
  },
  // 9. 89 Instagram DM Scripts That Convert
  {
    id: 'instagram-dm-scripts',
    title: '89 Instagram DM Scripts That Convert',
    subtitle: 'Copy-Paste Messages That Book Appointments',
    value: 39,
    description: 'First touch messages, follow-up sequences, listing inquiry responses, and referral request templates with 40%+ response rates. Stop guessing what to say - use proven scripts that turn story viewers into scheduled consultations. Includes Canva templates for organizing your outreach.',
    icon: 'MessageSquare',
    iconColor: '#10b981', // Green
    image: '/images/products/instagram-dm-scripts.webp',
    category: 'content',
  },
  // 10. Professional Realtor Email Signature Templates - UPDATED PRICE $17
  {
    id: 'email-signature-professional',
    title: 'Professional Realtor Email Signature Templates',
    subtitle: 'Make Every Email a Marketing Opportunity',
    value: 17,
    description: '25+ professionally designed email signature templates that work in Gmail, Outlook, and Apple Mail. Include your headshot, social links, latest listing, and 5-star reviews in every email you send. Fully editable in Canva - update in 60 seconds.',
    icon: 'Mail',
    iconColor: '#0ea5e9', // Sky blue
    image: '/images/products/email-signature-professional.webp',
    category: 'tools',
  },
]

// Pricing Configuration
export const BONUS_PRICING = {
  individualPrice: 1.99,
  bundlePrice: 9.90,
  bundleDiscount: 0.5, // 50% off
  currency: 'USD',
  currencySymbol: '$',
} as const

// Calculate total value
export const getTotalBonusValue = (): number => {
  return BONUS_PRODUCTS.reduce((total, product) => total + product.value, 0)
}

// Calculate savings
export const getBundleSavings = (): number => {
  const individualTotal = BONUS_PRODUCTS.length * BONUS_PRICING.individualPrice
  return individualTotal - BONUS_PRICING.bundlePrice
}

// Get products by category
export const getProductsByCategory = (category: BonusProduct['category']) => {
  return BONUS_PRODUCTS.filter(product => product.category === category)
}
