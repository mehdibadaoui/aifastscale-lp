/**
 * Bonus Products Configuration - HORMOZI OPTIMIZED
 *
 * STRATEGY: 5 High-Value Products > 10 Low-Value Products
 * Each product must pass the "I'd buy this alone" test
 *
 * Hormozi Value Equation Applied:
 * Value = (Dream Outcome × Perceived Likelihood) / (Time Delay × Effort)
 */

export interface BonusProduct {
  id: string
  title: string
  subtitle: string
  value: number // Perceived value - NOW PREMIUM
  description: string
  highlights: string[] // Key benefits for quick scanning
  icon: string // Lucide icon name
  iconColor: string
  image?: string
  category: 'training' | 'tools' | 'system'
  badge?: string // Optional badge like "MOST POPULAR" or "NEW"
}

export const BONUS_PRODUCTS: BonusProduct[] = [
  // ═══════════════════════════════════════════════════════════════════
  // BONUS #1 - THE ANCHOR (Highest Perceived Value)
  // This is the "I'd pay for this alone" product
  // ═══════════════════════════════════════════════════════════════════
  {
    id: 'organic-leads-mastery',
    title: 'Organic Leads Mastery',
    subtitle: 'The Zero-Ad Blueprint: Get Free Client Leads from Instagram & TikTok',
    value: 197,
    description: 'The complete system for attracting new clients WITHOUT spending a single dollar on ads. Learn exactly how to create viral content that reaches your ideal audience, turn views into DMs, and DMs into booked appointments. This is the missing piece most professionals never figure out.',
    highlights: [
      'The Viral Content Formula (beat the algorithm)',
      'Reach ideal clients with $0 ad spend',
      'Content-to-DM Pipeline (views → conversations)',
      '30-Day Viral Content Calendar (just post)',
    ],
    icon: 'TrendingUp',
    iconColor: '#10b981', // Emerald green - money/growth
    image: '/images/products/organic-leads-mastery.webp',
    category: 'training',
    badge: 'MOST VALUABLE',
  },

  // ═══════════════════════════════════════════════════════════════════
  // BONUS #2 - THE SCRIPT VAULT (Removes Effort)
  // Consolidates: Hooks + Scripts + Templates into ONE mega resource
  // ═══════════════════════════════════════════════════════════════════
  {
    id: 'script-vault',
    title: 'The Script Vault',
    subtitle: '100+ Viral Hooks, Scripts & Captions That Stop The Scroll',
    value: 97,
    description: 'Never stare at a blank screen again. This vault contains 100+ proven hooks tested on 10M+ views, ready-to-use video scripts for every scenario, and captions that drive engagement. Just copy, paste, and post. Organized by category: educational content, client testimonials, tips & advice, and viral trends.',
    highlights: [
      '45 scroll-stopping hooks (tested on 10M+ views)',
      '30 ready-to-film video scripts',
      '25 high-engagement caption templates',
      'Organized by category for quick access',
    ],
    icon: 'FileText',
    iconColor: '#f59e0b', // Amber - attention/energy
    image: '/images/products/script-vault.webp',
    category: 'tools',
    badge: 'FAN FAVORITE',
  },

  // ═══════════════════════════════════════════════════════════════════
  // BONUS #3 - AI MENTOR (Reduces Time Delay)
  // Your personal coach available 24/7
  // ═══════════════════════════════════════════════════════════════════
  {
    id: 'ai-mentor',
    title: 'AI Business Mentor',
    subtitle: 'Your 24/7 Expert Coach Trained on Top Producer Strategies',
    value: 97,
    description: 'Get instant answers to any business question at 3am or 3pm. This custom AI is trained on strategies from top professionals in your field. Ask about scripts, objection handling, pricing strategy, difficult clients, or market positioning. It\'s like having a mentor who never sleeps and never charges hourly.',
    highlights: [
      'Instant answers on scripts & objections',
      'Pricing strategy & negotiation tactics',
      'Content ideas generated in seconds',
      'Available 24/7 (no $500/hour coaching fees)',
    ],
    icon: 'Bot',
    iconColor: '#6366f1', // Indigo - intelligence/tech
    image: '/images/products/ai-mentor.webp',
    category: 'tools',
  },

  // ═══════════════════════════════════════════════════════════════════
  // BONUS #4 - DM CONVERSION SYSTEM (Increases Likelihood)
  // Turns attention into appointments
  // ═══════════════════════════════════════════════════════════════════
  {
    id: 'dm-conversion-system',
    title: 'DM-to-Deal System',
    subtitle: '89 Copy-Paste Messages That Turn Followers Into Clients',
    value: 67,
    description: 'The exact messages top professionals use to convert DMs into booked appointments. Includes first-touch openers, follow-up sequences, objection handlers, and appointment setters. Each script has been tested to achieve 40%+ response rates. Stop winging your DMs and start closing.',
    highlights: [
      'First-touch messages that get replies',
      'Follow-up sequences (day 1, 3, 7, 14)',
      'Objection handling scripts',
      '40%+ response rate proven',
    ],
    icon: 'MessageSquare',
    iconColor: '#ec4899', // Pink - relationship/communication
    image: '/images/products/dm-system.webp',
    category: 'system',
  },

  // ═══════════════════════════════════════════════════════════════════
  // BONUS #5 - 90-DAY ACCELERATOR (Clear Roadmap)
  // Reduces confusion with step-by-step plan
  // ═══════════════════════════════════════════════════════════════════
  {
    id: 'authority-accelerator',
    title: '90-Day Authority Accelerator',
    subtitle: 'The Week-by-Week Roadmap to Becoming THE Expert in Your Market',
    value: 47,
    description: 'Stop guessing what to do next. This 90-day blueprint breaks down exactly what to post, when to post, and how to position yourself as the go-to expert in your market. Includes weekly action items, milestone checkpoints, and the 17-minute daily ritual that compounds into market dominance.',
    highlights: [
      'Week-by-week action plan (no guessing)',
      '17-minute daily ritual for consistency',
      'Milestone checkpoints to track progress',
      'Position yourself as THE market expert',
    ],
    icon: 'Target',
    iconColor: '#8b5cf6', // Purple - achievement/mastery
    image: '/images/products/authority-accelerator.webp',
    category: 'training',
  },
]

// ═══════════════════════════════════════════════════════════════════
// PRICING CONFIGURATION
// ═══════════════════════════════════════════════════════════════════

export const BONUS_PRICING = {
  individualPrice: 1.99, // If sold separately
  bundlePrice: 9.90,
  currency: 'USD',
  currencySymbol: '$',
} as const

// ═══════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════

export const getTotalBonusValue = (): number => {
  return BONUS_PRODUCTS.reduce((total, product) => total + product.value, 0)
}

export const getProductById = (id: string): BonusProduct | undefined => {
  return BONUS_PRODUCTS.find(product => product.id === id)
}

export const getProductsByCategory = (category: BonusProduct['category']): BonusProduct[] => {
  return BONUS_PRODUCTS.filter(product => product.category === category)
}
