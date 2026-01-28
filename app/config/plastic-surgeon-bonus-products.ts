/**
 * PLASTIC SURGEON Bonus Products Configuration
 * All bonus products available for the CloneYourself Plastic Surgeon offer
 *
 * IRRESISTIBLE OFFER FRAMEWORK:
 * - Every product = CLEAR RESULT they can visualize
 * - Focus on WHAT THEY GET (revenue, patients, time saved)
 * - Specific numbers = believable = irresistible
 * - Benefits > Features. Results > Tools.
 */

export interface PlasticSurgeonBonusProduct {
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

export const PLASTIC_SURGEON_BONUS_PRODUCTS: PlasticSurgeonBonusProduct[] = [
  // ===== FIRST 5: FREE BONUSES (INCLUDED WITH MAIN OFFER) =====

  {
    id: 'viral-video-scripts',
    title: '100 Viral Plastic Surgery Video Scripts',
    subtitle: 'Record Once. Get Consultations for Months.',
    value: 397,
    description: 'One surgeon posted 3 videos using these scripts. 1.2M views. 47 new consultation requests in 3 weeks. These are the exact word-for-word scripts that make people stop scrolling, watch till the end, and book a consultation at YOUR clinic. Just read, record, post. Your phone starts ringing.',
    icon: 'Video',
    iconColor: '#d4af37', // Gold
    image: '/images/plastic-surgeon/bonuses/viral-scripts.webp',
    category: 'marketing',
  },
  {
    id: 'social-media-templates',
    title: '365 Days of Social Media Content',
    subtitle: 'Post Daily Without Thinking. Ever.',
    value: 297,
    description: 'Every day you don\'t post, your competitor does - and steals your future patients. This gives you 365 ready-to-post templates specifically for plastic surgeons. Open. Click. Customize in 30 seconds. Post. Done. One surgeon went from 500 followers to 28,000 in 5 months. Her consultation calendar is now booked 8 weeks out.',
    icon: 'Layout',
    iconColor: '#d4af37', // Gold
    image: '/images/plastic-surgeon/bonuses/social-templates.webp',
    category: 'marketing',
  },
  {
    id: 'consultation-scripts',
    title: 'High-Ticket Consultation Scripts',
    subtitle: 'Close More $15K+ Procedures',
    value: 497,
    description: 'Most surgeons lose 60% of consultations because they don\'t know how to handle objections. These scripts help you close rhinoplasty, facelifts, and body contouring cases. One surgeon went from 30% close rate to 72%. That\'s an extra $180,000/month from the same number of consultations.',
    icon: 'DollarSign',
    iconColor: '#22c55e', // Green
    image: '/images/plastic-surgeon/bonuses/consultation-scripts.webp',
    category: 'revenue',
  },
  {
    id: 'before-after-system',
    title: 'Before/After Content System',
    subtitle: 'Showcase Transformations That Convert',
    value: 397,
    description: 'Before/after posts get 5x more engagement than any other content in plastic surgery. They make people WANT your work. This system shows you exactly how to capture, edit, and post for maximum impact while staying HIPAA compliant. One surgeon\'s tummy tuck reveal got 3.8 million views. She booked $420,000 in procedures that month.',
    icon: 'Camera',
    iconColor: '#d4af37', // Gold
    image: '/images/plastic-surgeon/bonuses/before-after.webp',
    category: 'marketing',
  },
  {
    id: 'patient-coordinator-scripts',
    title: 'Patient Coordinator Phone Scripts',
    subtitle: 'Stop Losing $10,000/Week to Bad Phone Calls',
    value: 397,
    description: 'Right now, your patient coordinator is losing you 8-12 consultations per week. "How much is a nose job?" Click. Gone. Forever. These scripts flip that. When a caller says "I\'m just getting prices," your team knows EXACTLY what to say to book them. One practice added $67,000/month in procedures just by changing how they answer the phone.',
    icon: 'Phone',
    iconColor: '#d4af37', // Gold
    image: '/images/plastic-surgeon/bonuses/phone-scripts.webp',
    category: 'operations',
  },

  // ===== LAST 5: UPSELL PRODUCTS ($47.72 for all 5) =====

  {
    id: 'financing-scripts',
    title: 'Patient Financing Scripts',
    subtitle: 'Turn "I Can\'t Afford It" Into "Yes, Let\'s Do It"',
    value: 347,
    description: 'Most patients who say "I can\'t afford it" actually CAN - they just need help seeing how. These scripts help your coordinator present financing options that turn hesitant patients into booked surgeries. One practice increased their close rate by 34% just by implementing these scripts. That\'s an extra $90,000/month.',
    icon: 'CreditCard',
    iconColor: '#d4af37', // Gold
    image: '/images/plastic-surgeon/bonuses/financing-scripts.webp',
    category: 'revenue',
  },
  {
    id: 'referral-machine',
    title: 'The Patient Referral Machine',
    subtitle: 'Turn 1 Happy Patient Into 5 New Ones',
    value: 447,
    description: 'Your best patients know other people who want plastic surgery. But they\'re not referring anyone because you never asked - or asked wrong. This system makes referring effortless. One practice generated 67 referrals in 90 days. That\'s 67 new patients who came pre-sold, ready to book, because someone they trust said "go here."',
    icon: 'Users',
    iconColor: '#d4af37', // Gold
    image: '/images/plastic-surgeon/bonuses/referral-machine.webp',
    category: 'revenue',
  },
  {
    id: 'ai-content-generator',
    title: 'AI Content Generator for Surgeons',
    subtitle: 'Unlimited Content. 10 Seconds. Zero Thinking.',
    value: 297,
    description: '500+ copy-paste prompts that turn ChatGPT into your personal plastic surgery marketing team. Need a caption? 10 seconds. Video script? 10 seconds. Email newsletter? 10 seconds. One surgeon creates a full week of content every Monday morning in 15 minutes while drinking coffee. Then she\'s done. What would you do with that time back?',
    icon: 'Sparkles',
    iconColor: '#d4af37', // Gold
    image: '/images/plastic-surgeon/bonuses/ai-generator.webp',
    category: 'marketing',
  },
  {
    id: 'review-explosion',
    title: 'The 5-Star Review Explosion System',
    subtitle: '20+ New Reviews This Month. Guaranteed.',
    value: 397,
    description: 'When someone Googles "plastic surgeon near me," they click the one with the most reviews. Period. This system floods your Google profile with 5-star reviews - automatically. One practice went from 3 reviews/month to 24/month. Within 90 days, they ranked #1 locally. Now they turn away patients. What would 20 new 5-star reviews do for YOU this month?',
    icon: 'Star',
    iconColor: '#d4af37', // Gold
    image: '/images/plastic-surgeon/bonuses/review-explosion.webp',
    category: 'marketing',
  },
  {
    id: 'vip-concierge-system',
    title: 'VIP Concierge Patient System',
    subtitle: 'Premium Experience = Premium Prices',
    value: 497,
    description: 'Plastic surgery patients expect luxury. This system shows you how to create a VIP experience from first call to post-op that justifies premium pricing. Patients who feel like VIPs pay more, complain less, and refer more. One surgeon raised prices 25% after implementing this - and bookings actually increased.',
    icon: 'Crown',
    iconColor: '#d4af37', // Gold
    image: '/images/plastic-surgeon/bonuses/vip-concierge.webp',
    category: 'operations',
  },
]

// Calculate total value
export const getPlasticSurgeonTotalBonusValue = (): number => {
  return PLASTIC_SURGEON_BONUS_PRODUCTS.reduce((total, product) => total + product.value, 0)
}

// Get first 5 (free bonuses)
export const getPlasticSurgeonFreeBonuses = () => {
  return PLASTIC_SURGEON_BONUS_PRODUCTS.slice(0, 5)
}

// Get last 5 (upsell bonuses)
export const getPlasticSurgeonUpsellBonuses = () => {
  return PLASTIC_SURGEON_BONUS_PRODUCTS.slice(5, 10)
}
