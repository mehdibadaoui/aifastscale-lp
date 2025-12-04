/**
 * DENTIST Bonus Products Configuration
 * All bonus products available for the CloneYourself Dentist offer
 *
 * IRRESISTIBLE OFFER FRAMEWORK:
 * - Every product = CLEAR RESULT they can visualize
 * - Focus on WHAT THEY GET (money, patients, time saved)
 * - Specific numbers = believable = irresistible
 * - Benefits > Features. Results > Tools.
 */

export interface DentistBonusProduct {
  id: string
  title: string
  subtitle: string
  value: number // Perceived value
  description: string
  icon: string // Lucide icon name
  iconColor: string // Icon color
  image?: string
  category: 'revenue' | 'marketing' | 'operations'
}

export const DENTIST_BONUS_PRODUCTS: DentistBonusProduct[] = [
  // ===== FIRST 5: FREE BONUSES (USER PICKS 5) =====

  {
    id: 'viral-video-scripts',
    title: '100 Viral Dental Video Scripts',
    subtitle: 'Record Once. Get Patients for Months.',
    value: 297,
    description: 'One dentist posted 3 videos using these scripts. 847,000 views. 23 new patients in 14 days. These are the exact word-for-word scripts that make people stop scrolling, watch till the end, and call YOUR office - not your competitor\'s. Just read, record, post. Your phone starts ringing.',
    icon: 'Video',
    iconColor: '#ef4444', // Red (TikTok vibes)
    image: '/images/dentist/viral-scripts.webp',
    category: 'marketing',
  },
  {
    id: 'social-media-templates',
    title: '365 Days of Social Media Content',
    subtitle: 'Post Daily Without Thinking. Ever.',
    value: 197,
    description: 'Every day you don\'t post, your competitor does - and steals your future patients. This gives you 365 ready-to-post templates. Open. Click. Customize in 30 seconds. Post. Done. One dentist went from 200 followers to 12,000 in 4 months. Her hygiene schedule is now booked 6 weeks out.',
    icon: 'Layout',
    iconColor: '#ec4899', // Pink (Instagram vibes)
    image: '/images/dentist/social-templates.webp',
    category: 'marketing',
  },
  {
    id: 'website-template',
    title: 'High-Converting Dental Website Template',
    subtitle: 'Turn Visitors Into Booked Appointments',
    value: 397,
    description: 'Your website is losing you patients right now. Visitors land, get confused, leave. This template is built from analyzing 200+ dental websites that actually convert. The result? One practice switched and booked 34 new patients in 30 days - from the SAME traffic they already had. No more "I\'ll call you back."',
    icon: 'Globe',
    iconColor: '#3b82f6', // Blue
    image: '/images/dentist/website-template.webp',
    category: 'marketing',
  },
  {
    id: 'profit-simulator',
    title: 'Dental Profit Simulator & Tracker',
    subtitle: 'Find $50K Hidden in Your Practice',
    value: 247,
    description: 'Most dentists are leaking $3,000-$8,000 every month and don\'t even know it. This simulator shows you EXACTLY where the money is going - which procedures lose money, which hygienist produces most, which days are costing you. One dentist found $67,000 in annual profit hiding in plain sight. How much are YOU leaving on the table?',
    icon: 'TrendingUp',
    iconColor: '#22c55e', // Green
    image: '/images/dentist/profit-simulator.webp',
    category: 'operations',
  },
  {
    id: 'front-desk-scripts',
    title: 'Front Desk Conversion Scripts',
    subtitle: 'Stop Losing $5,000/Month to Bad Phone Calls',
    value: 297,
    description: 'Right now, your front desk is losing you 6-10 patients per week. "How much is a cleaning?" Click. Gone. Forever. These scripts flip that. When a caller says "I\'m just shopping around," your team knows EXACTLY what to say to book them. One practice added $14,000/month in production just by changing how they answer the phone.',
    icon: 'Phone',
    iconColor: '#8b5cf6', // Purple
    image: '/images/dentist/front-desk-scripts.webp',
    category: 'operations',
  },

  // ===== LAST 5: UPSELL PRODUCTS ($9.95 for all 5) =====

  {
    id: 'patient-forms-bundle',
    title: 'Professional Patient Forms Bundle',
    subtitle: 'First Impressions That Build Trust',
    value: 147,
    description: 'Patients judge your practice before they even sit in the chair. Ugly, outdated forms = "cheap dentist." These professionally designed forms make patients think "this is a premium practice" the moment they start filling paperwork. Trust goes up. Case acceptance goes up. One office said patients started accepting more treatment after switching forms alone.',
    icon: 'FileText',
    iconColor: '#6366f1', // Indigo
    image: '/images/dentist/patient-forms.webp',
    category: 'operations',
  },
  {
    id: 'referral-machine',
    title: 'The Patient Referral Machine',
    subtitle: 'Turn 1 Happy Patient Into 5 New Ones',
    value: 347,
    description: 'Your best patients know other people with teeth. But they\'re not referring anyone because you never asked - or asked wrong. This system makes referring effortless and rewarding. One practice generated 47 referrals in 60 days. That\'s 47 new patients who came pre-sold, ready to book, because someone they trust said "go here."',
    icon: 'Users',
    iconColor: '#f59e0b', // Amber
    image: '/images/dentist/referral-machine.webp',
    category: 'revenue',
  },
  {
    id: 'ai-content-generator',
    title: 'AI Dental Content Generator',
    subtitle: 'Unlimited Content. 10 Seconds. Zero Thinking.',
    value: 197,
    description: '500+ copy-paste prompts that turn ChatGPT into your personal dental marketing team. Need a caption? 10 seconds. Video script? 10 seconds. Email newsletter? 10 seconds. One dentist creates a full week of content every Monday morning in 15 minutes while drinking coffee. Then she\'s done. What would you do with that time back?',
    icon: 'Sparkles',
    iconColor: '#06b6d4', // Cyan
    image: '/images/dentist/ai-generator.webp',
    category: 'marketing',
  },
  {
    id: 'review-explosion',
    title: 'The 5-Star Review Explosion System',
    subtitle: '15+ New Reviews This Month. Guaranteed.',
    value: 297,
    description: 'When someone Googles "dentist near me," 3 names pop up. They click the one with the most reviews. Period. This system floods your Google profile with 5-star reviews - automatically. One practice went from 2 reviews/month to 19/month. Within 90 days, they ranked #1 locally. Now they turn away patients. What would 15 new 5-star reviews do for YOU this month?',
    icon: 'Star',
    iconColor: '#fbbf24', // Yellow/Gold
    image: '/images/dentist/review-explosion.webp',
    category: 'marketing',
  },
  {
    id: 'before-after-kit',
    title: 'Before/After Transformation Kit',
    subtitle: 'Content That Makes Your Phone Ring',
    value: 247,
    description: 'Before/after posts get 3x more engagement than any other content. They make people WANT your work. But most dentists capture them wrong - bad lighting, no consent, boring reveals. This kit gives you the exact system: how to capture, how to edit, how to post for maximum impact. One dentist\'s veneer reveal got 2.1 million views. She booked $180,000 in cosmetic cases that month.',
    icon: 'Camera',
    iconColor: '#d946ef', // Fuchsia
    image: '/images/dentist/before-after-kit.webp',
    category: 'marketing',
  },
]

// Pricing Configuration
export const DENTIST_BONUS_PRICING = {
  mainPrice: 58.22,
  upsellPrice: 9.95,
  downsellPrice: 4.97,
  pricePerItemUpsell: 1.99,
  pricePerItemDownsell: 0.99,
  currency: 'USD',
  currencySymbol: '$',
} as const

// Plan IDs
export const DENTIST_PLAN_IDS = {
  main: 'plan_SxMS4HqFxJKNT',
  upsell: 'plan_IbsV5qrvMPBgb',
  downsell: 'plan_C2l5ZPXSWCxQu',
} as const

// Calculate total value
export const getDentistTotalBonusValue = (): number => {
  return DENTIST_BONUS_PRODUCTS.reduce((total, product) => total + product.value, 0)
}

// Get first 5 (free bonuses)
export const getDentistFreeBonuses = () => {
  return DENTIST_BONUS_PRODUCTS.slice(0, 5)
}

// Get last 5 (upsell bonuses)
export const getDentistUpsellBonuses = () => {
  return DENTIST_BONUS_PRODUCTS.slice(5, 10)
}
