/**
 * LAWYER Bonus Products Configuration
 * All bonus products available for the CloneYourself Lawyer offer
 *
 * IRRESISTIBLE OFFER FRAMEWORK:
 * - Every product = CLEAR RESULT they can visualize
 * - Focus on WHAT THEY GET (clients, revenue, time saved)
 * - Specific numbers = believable = irresistible
 * - Benefits > Features. Results > Tools.
 */

export interface LawyerBonusProduct {
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

export const LAWYER_BONUS_PRODUCTS: LawyerBonusProduct[] = [
  // ===== FIRST 5: FREE BONUSES (INCLUDED WITH MAIN OFFER) =====

  {
    id: 'viral-video-scripts',
    title: '100 Viral Legal Video Scripts',
    subtitle: 'Record Once. Sign Clients for Months.',
    value: 497,
    description: 'One personal injury attorney posted 3 videos using these scripts. 1.2M views. 47 new case inquiries in 4 weeks. These are the exact word-for-word scripts that make people stop scrolling, watch till the end, and call YOUR firm. Just read, record, post. Your phone starts ringing.',
    icon: 'Video',
    iconColor: '#d4af37', // Gold
    image: '/images/lawyer/viral-scripts.webp',
    category: 'marketing',
  },
  {
    id: 'social-media-templates',
    title: '365 Days of Legal Content',
    subtitle: 'Post Daily Without Thinking. Ever.',
    value: 397,
    description: 'Every day you don\'t post, your competitor does - and steals your future clients. This gives you 365 ready-to-post templates specifically for attorneys. Open. Click. Customize in 30 seconds. Post. Done. One family law attorney went from 400 followers to 45,000 in 6 months. His caseload is now fully booked.',
    icon: 'Layout',
    iconColor: '#d4af37', // Gold
    image: '/images/lawyer/social-templates.webp',
    category: 'marketing',
  },
  {
    id: 'consultation-scripts',
    title: 'The Retainer Closer Scripts',
    subtitle: 'Convert Free Consults Into $5K+ Retainers',
    value: 597,
    description: 'Most attorneys lose 60% of consultations because they don\'t know how to handle the "I need to think about it" objection. These scripts turn tire-kickers into signed retainers. One criminal defense attorney went from 35% conversion to 72%. That\'s an extra $28,000/month from the same number of consultations.',
    icon: 'DollarSign',
    iconColor: '#22c55e', // Green
    image: '/images/lawyer/retainer-scripts.webp',
    category: 'revenue',
  },
  {
    id: 'authority-content-system',
    title: 'Authority Building Content System',
    subtitle: 'Become THE Attorney in Your Market',
    value: 497,
    description: 'Educational content positions you as the expert - not just another lawyer. This system shows you exactly how to create content that builds trust AND attracts cases. One immigration attorney\'s visa explainer video got 3.8 million views. She now has a 6-month waitlist for cases.',
    icon: 'Scale',
    iconColor: '#d4af37', // Gold
    image: '/images/lawyer/authority-content.webp',
    category: 'marketing',
  },
  {
    id: 'intake-coordinator-scripts',
    title: 'Legal Intake Specialist Scripts',
    subtitle: 'Stop Losing $15,000/Week to Bad Phone Calls',
    value: 497,
    description: 'Right now, your front desk is losing you 8-12 potential clients per week. "How much do you charge?" Click. Gone. Forever. These scripts flip that. When a caller asks about fees or retainers, your team knows EXACTLY what to say to book a consultation. One PI firm added $87,000/month in signed cases just by changing how they answer the phone.',
    icon: 'Phone',
    iconColor: '#d4af37', // Gold
    image: '/images/lawyer/phone-scripts.webp',
    category: 'operations',
  },

  // ===== LAST 5: UPSELL PRODUCTS ($9.95 for all 5) =====

  {
    id: 'fee-objection-scripts',
    title: 'Fee Objection Destroyer Scripts',
    subtitle: 'Turn "You\'re Too Expensive" Into "Where Do I Sign?"',
    value: 447,
    description: 'Clients who object to fees are often the most ready to hire - they just need to understand the value. These scripts help you reframe fees as investments that protect their future. One estate planning attorney increased average retainer from $3,500 to $7,200 using these exact responses.',
    icon: 'CreditCard',
    iconColor: '#d4af37', // Gold
    image: '/images/lawyer/fee-scripts.webp',
    category: 'revenue',
  },
  {
    id: 'referral-network',
    title: 'The Attorney Referral Network Builder',
    subtitle: 'Turn 1 Case Into 5 More Referrals',
    value: 547,
    description: 'Your past clients and attorney network aren\'t referring cases because you never made it easy. This system creates a referral machine that runs on autopilot. One personal injury firm generated 62 referred cases in 90 days. That\'s 62 pre-qualified clients who came pre-sold because someone they trust said "call this attorney."',
    icon: 'Users',
    iconColor: '#d4af37', // Gold
    image: '/images/lawyer/referral-network.webp',
    category: 'revenue',
  },
  {
    id: 'ai-content-generator',
    title: 'AI Content Generator for Attorneys',
    subtitle: 'Unlimited Content. 10 Seconds. Zero Billable Hours.',
    value: 397,
    description: '500+ copy-paste prompts that turn ChatGPT into your personal legal marketing team. Need a caption? 10 seconds. Video script? 10 seconds. Blog post? 10 seconds. One litigation attorney creates a full week of content every Monday morning in 15 minutes before court. Then he\'s done. What would you do with that time back?',
    icon: 'Sparkles',
    iconColor: '#d4af37', // Gold
    image: '/images/lawyer/ai-generator.webp',
    category: 'marketing',
  },
  {
    id: 'review-explosion',
    title: 'The 5-Star Review Explosion System',
    subtitle: '25+ New Reviews This Month. Guaranteed.',
    value: 497,
    description: 'When someone Googles "lawyer near me," they click the one with the most reviews. Period. This system floods your Google profile with 5-star reviews - ethically and automatically. One family law firm went from 8 reviews/month to 31/month. Within 90 days, they ranked #1 locally. Now they turn away cases. What would 25 new 5-star reviews do for YOUR firm?',
    icon: 'Star',
    iconColor: '#fbbf24', // Yellow/Gold
    image: '/images/lawyer/review-explosion.webp',
    category: 'marketing',
  },
  {
    id: 'case-study-system',
    title: 'Case Win Marketing System',
    subtitle: 'Turn Every Win Into a Client Magnet',
    value: 597,
    description: 'Your case wins are your best marketing asset - but you\'re not using them. This system shows you how to ethically showcase results that attract ideal clients. One medical malpractice attorney turned ONE $2.1M verdict into 14 new high-value cases over 18 months. Your wins should work as hard as you do.',
    icon: 'Trophy',
    iconColor: '#d4af37', // Gold
    image: '/images/lawyer/case-study.webp',
    category: 'operations',
  },
]

// Calculate total value
export const getLawyerTotalBonusValue = (): number => {
  return LAWYER_BONUS_PRODUCTS.reduce((total, product) => total + product.value, 0)
}

// Get first 5 (free bonuses)
export const getLawyerFreeBonuses = () => {
  return LAWYER_BONUS_PRODUCTS.slice(0, 5)
}

// Get last 5 (upsell bonuses)
export const getLawyerUpsellBonuses = () => {
  return LAWYER_BONUS_PRODUCTS.slice(5, 10)
}
