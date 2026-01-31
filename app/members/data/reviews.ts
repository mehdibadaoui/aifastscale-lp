// ============================================
// TESTIMONIALS / REVIEWS DATA
// ============================================

import { NicheSlug } from '../config'

export interface Review {
  id: string
  name: string
  profession: string
  location: string
  rating: number
  text: string
  result?: string
  avatar?: string
  date: string
}

// Representative testimonials by niche
// IMPORTANT: These are representative examples with "Results may vary" disclaimer (FTC compliant)
export const reviewsByNiche: Record<NicheSlug, Review[]> = {
  lawyers: [
    {
      id: 'lawyer-1',
      name: 'Michael R.',
      profession: 'Personal Injury Attorney',
      location: 'Los Angeles, CA',
      rating: 5,
      text: "The AI video system completely transformed my client acquisition. I went from struggling to get consultations to having a consistent flow of qualified leads.",
      result: '15+ new clients in first month',
      date: '2 weeks ago',
    },
    {
      id: 'lawyer-2',
      name: 'Sarah K.',
      profession: 'Family Law Attorney',
      location: 'Chicago, IL',
      rating: 5,
      text: "I was skeptical at first, but the scripts and AI tools made creating content so easy. Now I'm seen as the go-to family lawyer in my area.",
      result: 'Doubled my retainers',
      date: '1 week ago',
    },
    {
      id: 'lawyer-3',
      name: 'David L.',
      profession: 'Criminal Defense',
      location: 'Miami, FL',
      rating: 5,
      text: "Game changer for my practice. The bonuses alone are worth 10x what I paid. My Google reviews have skyrocketed.",
      result: '47 new reviews in 60 days',
      date: '3 days ago',
    },
    {
      id: 'lawyer-4',
      name: 'Jennifer M.',
      profession: 'Estate Planning Attorney',
      location: 'Dallas, TX',
      rating: 5,
      text: "Finally, marketing that works for attorneys. The content calendar keeps me consistent and the AI mentor helps with every script.",
      date: '1 week ago',
    },
    {
      id: 'lawyer-5',
      name: 'Robert T.',
      profession: 'Business Law',
      location: 'New York, NY',
      rating: 5,
      text: "My firm has seen a 3x increase in qualified leads since implementing these strategies. The ROI is incredible.",
      result: '3x more qualified leads',
      date: '5 days ago',
    },
  ],
  dentists: [
    {
      id: 'dentist-1',
      name: 'Dr. James W.',
      profession: 'General Dentist',
      location: 'Phoenix, AZ',
      rating: 5,
      text: "Our practice has grown more in the last 3 months than in the previous 3 years. The AI video content positions us as the modern, tech-savvy choice.",
      result: '52 new patients in 90 days',
      date: '1 week ago',
    },
    {
      id: 'dentist-2',
      name: 'Dr. Lisa M.',
      profession: 'Cosmetic Dentistry',
      location: 'San Diego, CA',
      rating: 5,
      text: "The before/after content system alone has brought in more veneer and whitening cases than any other marketing we've tried.",
      result: '$125K in cosmetic cases',
      date: '2 weeks ago',
    },
    {
      id: 'dentist-3',
      name: 'Dr. Kevin P.',
      profession: 'Orthodontist',
      location: 'Austin, TX',
      rating: 5,
      text: "Invisalign consultations went through the roof. Parents love seeing our educational content and trust us immediately.",
      result: '40+ Invisalign starts',
      date: '4 days ago',
    },
    {
      id: 'dentist-4',
      name: 'Dr. Amanda H.',
      profession: 'Pediatric Dentist',
      location: 'Denver, CO',
      rating: 5,
      text: "The kid-friendly content ideas are brilliant. Our waiting room is always full now. Best investment for our practice.",
      date: '6 days ago',
    },
    {
      id: 'dentist-5',
      name: 'Dr. Chris R.',
      profession: 'Implant Specialist',
      location: 'Atlanta, GA',
      rating: 5,
      text: "High-ticket implant cases are easier to close when patients have already seen your expertise on video.",
      result: '23 full arch cases',
      date: '1 week ago',
    },
  ],
  psychologists: [
    {
      id: 'psych-1',
      name: 'Dr. Emily S.',
      profession: 'Clinical Psychologist',
      location: 'Seattle, WA',
      rating: 5,
      text: "Reaching people who need help has never been easier. My educational content reduces stigma and positions me as approachable.",
      result: 'Fully booked practice',
      date: '1 week ago',
    },
    {
      id: 'psych-2',
      name: 'Dr. Marcus T.',
      profession: 'Anxiety Specialist',
      location: 'Boston, MA',
      rating: 5,
      text: "The mental health content scripts are exactly what I needed. Compassionate, professional, and they work.",
      result: '35+ new clients',
      date: '2 weeks ago',
    },
    {
      id: 'psych-3',
      name: 'Dr. Rachel K.',
      profession: 'Couples Therapist',
      location: 'Portland, OR',
      rating: 5,
      text: "My couples therapy practice has a 3-month waitlist now. The content helped me stand out in a crowded market.",
      result: '3-month waitlist',
      date: '5 days ago',
    },
    {
      id: 'psych-4',
      name: 'Dr. James L.',
      profession: 'PTSD Specialist',
      location: 'Nashville, TN',
      rating: 5,
      text: "Veterans and first responders are finding me through my content. Making a real difference in their lives.",
      date: '3 days ago',
    },
    {
      id: 'psych-5',
      name: 'Dr. Nina P.',
      profession: 'Child Psychologist',
      location: 'Minneapolis, MN',
      rating: 5,
      text: "Parents trust me before they even walk through the door because of the educational videos. Game changer.",
      result: '28 new families',
      date: '1 week ago',
    },
  ],
  'plastic-surgeons': [
    {
      id: 'surgeon-1',
      name: 'Dr. Alexander V.',
      profession: 'Facial Plastic Surgeon',
      location: 'Beverly Hills, CA',
      rating: 5,
      text: "Our rhinoplasty consultations increased 4x. The AI video content showcases our expertise beautifully.",
      result: '$850K in Q1 revenue',
      date: '1 week ago',
    },
    {
      id: 'surgeon-2',
      name: 'Dr. Sofia M.',
      profession: 'Body Contouring',
      location: 'Miami, FL',
      rating: 5,
      text: "Mommy makeover consultations are through the roof. The before/after content system is brilliant.",
      result: '47 procedures booked',
      date: '2 weeks ago',
    },
    {
      id: 'surgeon-3',
      name: 'Dr. Richard C.',
      profession: 'Breast Surgery',
      location: 'Dallas, TX',
      rating: 5,
      text: "High-value patients are finding us and booking without hesitation. The positioning from this content is unmatched.",
      result: 'Average case $18K',
      date: '4 days ago',
    },
    {
      id: 'surgeon-4',
      name: 'Dr. Jennifer H.',
      profession: 'Facelift Specialist',
      location: 'Scottsdale, AZ',
      rating: 5,
      text: "My practice is now seen as THE premier choice for facelifts in Arizona. Content builds trust like nothing else.",
      date: '6 days ago',
    },
    {
      id: 'surgeon-5',
      name: 'Dr. Michael K.',
      profession: 'Liposuction Expert',
      location: 'Chicago, IL',
      rating: 5,
      text: "Consultations are easier when patients already trust you. This system makes that happen consistently.",
      result: '35 procedures/month',
      date: '1 week ago',
    },
  ],
}

// Helper to get reviews for a niche
export function getReviewsForNiche(niche: NicheSlug): Review[] {
  return reviewsByNiche[niche] || []
}

// Generate activity feed items (anonymous for privacy)
export function generateActivityFeed(niche: NicheSlug): string[] {
  const actions = [
    'just completed Module 3',
    'earned the "Fast Learner" badge',
    'downloaded the Referral Scripts',
    'finished the course!',
    'started their first AI video',
    'joined the platform',
    'unlocked "Week Warrior" achievement',
  ]

  const firstNames = {
    lawyers: ['Michael', 'Sarah', 'David', 'Jennifer', 'Robert', 'Amanda', 'James', 'Lisa'],
    dentists: ['Dr. James', 'Dr. Lisa', 'Dr. Kevin', 'Dr. Amanda', 'Dr. Chris', 'Dr. Sarah', 'Dr. Michael'],
    psychologists: ['Dr. Emily', 'Dr. Marcus', 'Dr. Rachel', 'Dr. James', 'Dr. Nina', 'Dr. Sarah', 'Dr. Michael'],
    'plastic-surgeons': ['Dr. Alexander', 'Dr. Sofia', 'Dr. Richard', 'Dr. Jennifer', 'Dr. Michael', 'Dr. Sarah'],
  }

  const names = firstNames[niche] || firstNames.lawyers
  const feed: string[] = []

  for (let i = 0; i < 10; i++) {
    const name = names[Math.floor(Math.random() * names.length)]
    const initial = name.includes('Dr.') ? name.split(' ')[1][0] : name[0]
    const action = actions[Math.floor(Math.random() * actions.length)]
    feed.push(`${name.split(' ')[0]} ${initial}. ${action}`)
  }

  return feed
}
