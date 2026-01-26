/**
 * PSYCHOLOGIST Bonus Products Configuration
 * All bonus products available for the CloneYourself Psychologist offer
 *
 * IRRESISTIBLE OFFER FRAMEWORK:
 * - Every product = CLEAR RESULT they can visualize
 * - Focus on WHAT THEY GET (clients, revenue, time saved)
 * - Specific numbers = believable = irresistible
 * - Benefits > Features. Results > Tools.
 */

export interface PsychologistBonusProduct {
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

export const PSYCHOLOGIST_BONUS_PRODUCTS: PsychologistBonusProduct[] = [
  // ===== FIRST 5: FREE BONUSES (INCLUDED WITH MAIN OFFER) =====

  {
    id: 'viral-video-scripts',
    title: '100 Viral Mental Health Video Scripts',
    subtitle: 'Record Once. Get Clients for Months.',
    value: 397,
    description: 'One therapist posted 3 videos using these scripts. 890K views. 34 new client inquiries in 3 weeks. These are the exact word-for-word scripts that make people stop scrolling, watch till the end, and book a session with YOU. Just read, record, post. Your calendar starts filling.',
    icon: 'Video',
    iconColor: '#0ea5e9', // Sky blue
    image: '/images/psychologist/viral-scripts.webp',
    category: 'marketing',
  },
  {
    id: 'social-media-templates',
    title: '365 Days of Mental Health Content',
    subtitle: 'Post Daily Without Thinking. Ever.',
    value: 297,
    description: 'Every day you don\'t post, your competitor does - and steals your future clients. This gives you 365 ready-to-post templates specifically for psychologists and therapists. Open. Click. Customize in 30 seconds. Post. Done. One therapist went from 200 followers to 18,000 in 5 months. Her practice is now fully booked.',
    icon: 'Layout',
    iconColor: '#f59e0b', // Gold
    image: '/images/psychologist/social-templates.webp',
    category: 'marketing',
  },
  {
    id: 'consultation-scripts',
    title: 'High-Value Intake Scripts',
    subtitle: 'Convert More Consultations Into Clients',
    value: 497,
    description: 'Most therapists lose 50% of consultations because they don\'t know how to handle objections about therapy costs. These scripts help you convert initial calls into ongoing clients. One psychologist went from 40% conversion to 78%. That\'s an extra $12,000/month from the same number of inquiries.',
    icon: 'DollarSign',
    iconColor: '#22c55e', // Green
    image: '/images/psychologist/consultation-scripts.webp',
    category: 'revenue',
  },
  {
    id: 'educational-content-system',
    title: 'Educational Content System',
    subtitle: 'Reduce Stigma & Attract Clients',
    value: 397,
    description: 'Educational content gets 4x more engagement than any other content in mental health. It breaks down stigma and positions you as an expert. This system shows you exactly how to create content that educates AND attracts. One therapist\'s anxiety video got 2.1 million views. She filled 8 months of sessions from that one video.',
    icon: 'Brain',
    iconColor: '#8b5cf6', // Purple
    image: '/images/psychologist/educational-content.webp',
    category: 'marketing',
  },
  {
    id: 'intake-coordinator-scripts',
    title: 'Intake Coordinator Phone Scripts',
    subtitle: 'Stop Losing $8,000/Week to Bad Phone Calls',
    value: 397,
    description: 'Right now, your front desk is losing you 6-10 potential clients per week. "How much is a session?" Click. Gone. Forever. These scripts flip that. When a caller asks about insurance or costs, your team knows EXACTLY what to say to book them. One practice added $52,000/month in sessions just by changing how they answer the phone.',
    icon: 'Phone',
    iconColor: '#0ea5e9', // Sky blue
    image: '/images/psychologist/phone-scripts.webp',
    category: 'operations',
  },

  // ===== LAST 5: UPSELL PRODUCTS ($9.95 for all 5) =====

  {
    id: 'insurance-scripts',
    title: 'Insurance & Payment Scripts',
    subtitle: 'Turn "Do You Take My Insurance?" Into "Yes, Let\'s Start"',
    value: 347,
    description: 'Most clients who ask about insurance are ready to commit - they just need clarity. These scripts help your coordinator explain benefits, out-of-network options, and sliding scales that convert hesitant callers into booked sessions. One practice increased their conversion by 42% just by implementing these scripts.',
    icon: 'CreditCard',
    iconColor: '#6366f1', // Indigo
    image: '/images/psychologist/insurance-scripts.webp',
    category: 'revenue',
  },
  {
    id: 'referral-machine',
    title: 'The Client Referral Machine',
    subtitle: 'Turn 1 Happy Client Into 5 New Ones',
    value: 447,
    description: 'Your best clients know other people who need therapy. But they\'re not referring anyone because they don\'t know how to bring it up - or you never made it easy. This system makes referring natural and comfortable. One practice generated 45 referrals in 90 days. That\'s 45 new clients who came pre-sold because someone they trust said "go here."',
    icon: 'Users',
    iconColor: '#f59e0b', // Amber/Gold
    image: '/images/psychologist/referral-machine.webp',
    category: 'revenue',
  },
  {
    id: 'ai-content-generator',
    title: 'AI Content Generator for Therapists',
    subtitle: 'Unlimited Content. 10 Seconds. Zero Thinking.',
    value: 297,
    description: '500+ copy-paste prompts that turn ChatGPT into your personal mental health marketing team. Need a caption? 10 seconds. Video script? 10 seconds. Newsletter? 10 seconds. One psychologist creates a full week of content every Monday morning in 15 minutes while drinking coffee. Then she\'s done. What would you do with that time back?',
    icon: 'Sparkles',
    iconColor: '#06b6d4', // Cyan
    image: '/images/psychologist/ai-generator.webp',
    category: 'marketing',
  },
  {
    id: 'review-explosion',
    title: 'The 5-Star Review Explosion System',
    subtitle: '20+ New Reviews This Month. Guaranteed.',
    value: 397,
    description: 'When someone Googles "therapist near me," they click the one with the most reviews. Period. This system floods your Google profile with 5-star reviews - ethically and automatically. One practice went from 5 reviews/month to 22/month. Within 90 days, they ranked #1 locally. Now they have a waitlist. What would 20 new 5-star reviews do for YOUR practice?',
    icon: 'Star',
    iconColor: '#fbbf24', // Yellow/Gold
    image: '/images/psychologist/review-explosion.webp',
    category: 'marketing',
  },
  {
    id: 'group-therapy-system',
    title: 'Group Therapy Launch System',
    subtitle: 'Scale Your Impact & Income',
    value: 497,
    description: 'Private sessions cap your income at your available hours. Group therapy lets you help more people while earning more per hour. This system shows you how to launch, market, and fill group therapy programs. One therapist added $6,000/month working just 4 extra hours by running two groups.',
    icon: 'Users2',
    iconColor: '#0ea5e9', // Sky blue
    image: '/images/psychologist/group-therapy.webp',
    category: 'operations',
  },
]

// Calculate total value
export const getPsychologistTotalBonusValue = (): number => {
  return PSYCHOLOGIST_BONUS_PRODUCTS.reduce((total, product) => total + product.value, 0)
}

// Get first 5 (free bonuses)
export const getPsychologistFreeBonuses = () => {
  return PSYCHOLOGIST_BONUS_PRODUCTS.slice(0, 5)
}

// Get last 5 (upsell bonuses)
export const getPsychologistUpsellBonuses = () => {
  return PSYCHOLOGIST_BONUS_PRODUCTS.slice(5, 10)
}
