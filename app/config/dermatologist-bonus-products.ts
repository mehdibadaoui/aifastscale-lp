/**
 * DERMATOLOGIST Bonus Products Configuration
 * All bonus products available for the CloneYourself Dermatologist offer
 *
 * IRRESISTIBLE OFFER FRAMEWORK:
 * - Every product = CLEAR RESULT they can visualize
 * - Focus on WHAT THEY GET (money, patients, time saved)
 * - Specific numbers = believable = irresistible
 * - Benefits > Features. Results > Tools.
 */

export interface DermatologistBonusProduct {
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

export const DERMATOLOGIST_BONUS_PRODUCTS: DermatologistBonusProduct[] = [
  // ===== FIRST 5: FREE BONUSES (INCLUDED WITH MAIN OFFER) =====

  {
    id: 'website-templates',
    title: '2-in-1 Professional Website Templates',
    subtitle: 'Drag & Drop. No Code. Launch Today.',
    value: 497,
    description: 'Your website is your 24/7 receptionist. These 2 premium templates are specifically designed for dermatology practices - one for lead generation, one for services showcase. Just drag, drop, and customize. One dermatologist launched her new site in 2 hours and booked 18 new patients the first week. No developers. No coding. No waiting.',
    icon: 'Globe',
    iconColor: '#d4af37', // Gold
    image: '/images/bonuses/website-templates.jpeg',
    category: 'marketing',
  },
  {
    id: 'profit-tracker',
    title: 'Profit Tracker Dashboard',
    subtitle: 'See Exactly Where Your Money Goes',
    value: 397,
    description: 'Track your income, expenses, and profit in one beautiful dashboard. See your 6-month trends, profit margins, and streaks at a glance. Set monthly goals and watch your practice grow. One dermatologist discovered she was losing $3,400/month on underpriced procedures - and fixed it in a week. Know your numbers. Grow your profits.',
    icon: 'TrendingUp',
    iconColor: '#22c55e', // Green
    image: '/images/bonuses/profit-tracker.jpeg',
    category: 'operations',
  },
  {
    id: 'viral-video-scripts',
    title: '100 Viral Dermatology Video Scripts',
    subtitle: 'Record Once. Get Patients for Months.',
    value: 297,
    description: 'One dermatologist posted 3 videos using these scripts. 847,000 views. 23 new patients in 14 days. These are the exact word-for-word scripts that make people stop scrolling, watch till the end, and call YOUR office - not your competitor\'s. Just read, record, post. Your phone starts ringing.',
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
    description: 'Every day you don\'t post, your competitor does - and steals your future patients. This gives you 365 ready-to-post templates. Open. Click. Customize in 30 seconds. Post. Done. One dermatologist went from 200 followers to 12,000 in 4 months. Her treatment schedule is now booked 6 weeks out.',
    icon: 'Layout',
    iconColor: '#ec4899', // Pink (Instagram vibes)
    image: '/images/dentist/social-templates.webp',
    category: 'marketing',
  },
  {
    id: 'website-template',
    title: 'High-Converting Dermatology Website Template',
    subtitle: 'Turn Visitors Into Booked Appointments',
    value: 397,
    description: 'Your website is losing you patients right now. Visitors land, get confused, leave. This template is built from analyzing 200+ dermatology websites that actually convert. The result? One practice switched and booked 34 new patients in 30 days - from the SAME traffic they already had. No more "I\'ll call you back."',
    icon: 'Globe',
    iconColor: '#3b82f6', // Blue
    image: '/images/dentist/website-template.webp',
    category: 'marketing',
  },
  {
    id: 'profit-simulator',
    title: 'Dermatology Profit Simulator & Tracker',
    subtitle: 'Find $50K Hidden in Your Practice',
    value: 247,
    description: 'Most dermatologists are leaking $3,000-$8,000 every month and don\'t even know it. This simulator shows you EXACTLY where the money is going - which procedures lose money, which provider produces most, which days are costing you. One dermatologist found $67,000 in annual profit hiding in plain sight. How much are YOU leaving on the table?',
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
    description: 'Right now, your front desk is losing you 6-10 patients per week. "How much is Botox?" Click. Gone. Forever. These scripts flip that. When a caller says "I\'m just shopping around," your team knows EXACTLY what to say to book them. One practice added $14,000/month in production just by changing how they answer the phone.',
    icon: 'Phone',
    iconColor: '#8b5cf6', // Purple
    image: '/images/dentist/front-desk-scripts.webp',
    category: 'operations',
  },

  // ===== LAST 5: UPSELL PRODUCTS ($9.95 for all 5) =====

  {
    id: 'patient-forms-bundle',
    title: 'Patient Intake & Consent Forms Bundle',
    subtitle: 'First Impressions That Build Trust',
    value: 147,
    description: 'Patients judge your practice before they even sit in the chair. Ugly, outdated forms = "cheap practice." These professionally designed intake and consent forms make patients think "this is a premium practice" the moment they start filling paperwork. Trust goes up. Treatment acceptance goes up. One office said patients started accepting more treatments after switching forms alone.',
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
    description: 'Your best patients know other people who care about their skin. But they\'re not referring anyone because you never asked - or asked wrong. This system makes referring effortless and rewarding. One practice generated 47 referrals in 60 days. That\'s 47 new patients who came pre-sold, ready to book, because someone they trust said "go here."',
    icon: 'Users',
    iconColor: '#f59e0b', // Amber
    image: '/images/dentist/referral-machine.webp',
    category: 'revenue',
  },
  {
    id: 'ai-content-generator',
    title: 'AI Dermatology Content Generator',
    subtitle: 'Unlimited Content. 10 Seconds. Zero Thinking.',
    value: 197,
    description: '500+ copy-paste prompts that turn ChatGPT into your personal dermatology marketing team. Need a caption? 10 seconds. Video script? 10 seconds. Email newsletter? 10 seconds. One dermatologist creates a full week of content every Monday morning in 15 minutes while drinking coffee. Then she\'s done. What would you do with that time back?',
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
    description: 'When someone Googles "dermatologist near me," 3 names pop up. They click the one with the most reviews. Period. This system floods your Google profile with 5-star reviews - automatically. One practice went from 2 reviews/month to 19/month. Within 90 days, they ranked #1 locally. Now they turn away patients. What would 15 new 5-star reviews do for YOU this month?',
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
    description: 'Before/after posts get 3x more engagement than any other content. They make people WANT your treatments. But most dermatologists capture them wrong - bad lighting, no consent, boring reveals. This kit gives you the exact system: how to capture, how to edit, how to post for maximum impact. One dermatologist\'s skin transformation reveal got 2.1 million views. She booked $180,000 in cosmetic treatment cases that month.',
    icon: 'Camera',
    iconColor: '#d946ef', // Fuchsia
    image: '/images/dentist/before-after-kit.webp',
    category: 'marketing',
  },
]

// Calculate total value
export const getDermatologistTotalBonusValue = (): number => {
  return DERMATOLOGIST_BONUS_PRODUCTS.reduce((total, product) => total + product.value, 0)
}

// Get first 7 (free bonuses)
export const getDermatologistFreeBonuses = () => {
  return DERMATOLOGIST_BONUS_PRODUCTS.slice(0, 7)
}

// Get last 5 (upsell bonuses)
export const getDermatologistUpsellBonuses = () => {
  return DERMATOLOGIST_BONUS_PRODUCTS.slice(7, 12)
}
