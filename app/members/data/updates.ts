// ============================================
// WEEKLY UPDATES / WHAT'S NEW DATA
// ============================================

import { NicheSlug } from '../config'

export interface Update {
  id: string
  type: 'new' | 'improvement' | 'coming-soon' | 'bonus'
  title: string
  description: string
  date: string
  badge?: string
}

// Weekly updates create perception of active development
export const updatesByNiche: Record<NicheSlug, Update[]> = {
  lawyers: [
    {
      id: 'update-1',
      type: 'new',
      title: 'New AI Image Prompt Added',
      description: 'Generate even more realistic professional photos with our updated image prompt.',
      date: 'This week',
      badge: 'NEW',
    },
    {
      id: 'update-2',
      type: 'improvement',
      title: 'Enhanced Script Library',
      description: '25 new viral script templates added to the 100 Scripts bonus.',
      date: 'This week',
      badge: '+25',
    },
    {
      id: 'update-3',
      type: 'coming-soon',
      title: 'Coming: Google Ads Module',
      description: 'Learn to dominate local search with Google Ads. Launching soon!',
      date: 'Next week',
      badge: 'SOON',
    },
    {
      id: 'update-4',
      type: 'bonus',
      title: 'Free Bonus: Legal Holiday Scripts',
      description: 'Seasonal content scripts for every major holiday throughout the year.',
      date: '2 days ago',
      badge: 'FREE',
    },
  ],
  dentists: [
    {
      id: 'update-1',
      type: 'new',
      title: 'New Before/After Template',
      description: 'Showcase your transformations with our new HIPAA-compliant presentation template.',
      date: 'This week',
      badge: 'NEW',
    },
    {
      id: 'update-2',
      type: 'improvement',
      title: 'Updated Case Acceptance Scripts',
      description: 'New scripts for presenting high-ticket treatment plans effectively.',
      date: 'This week',
      badge: 'UPDATED',
    },
    {
      id: 'update-3',
      type: 'coming-soon',
      title: 'Coming: Implant Marketing Module',
      description: 'Complete system for attracting high-value implant patients. Launching soon!',
      date: 'Next week',
      badge: 'SOON',
    },
    {
      id: 'update-4',
      type: 'bonus',
      title: 'Free Bonus: Insurance Presentation Deck',
      description: 'Help patients understand their benefits with this visual presentation.',
      date: '2 days ago',
      badge: 'FREE',
    },
  ],
  psychologists: [
    {
      id: 'update-1',
      type: 'new',
      title: 'New Anxiety Content Scripts',
      description: 'Compassionate scripts specifically for anxiety-related content.',
      date: 'This week',
      badge: 'NEW',
    },
    {
      id: 'update-2',
      type: 'improvement',
      title: 'Enhanced Intake Process',
      description: 'Updated intake coordinator scripts with trauma-informed language.',
      date: 'This week',
      badge: 'UPDATED',
    },
    {
      id: 'update-3',
      type: 'coming-soon',
      title: 'Coming: Group Therapy Marketing',
      description: 'Complete guide to filling your group therapy sessions. Launching soon!',
      date: 'Next week',
      badge: 'SOON',
    },
    {
      id: 'update-4',
      type: 'bonus',
      title: 'Free Bonus: Mental Health Awareness Scripts',
      description: 'Content for Mental Health Awareness Month and other awareness campaigns.',
      date: '2 days ago',
      badge: 'FREE',
    },
  ],
  'plastic-surgeons': [
    {
      id: 'update-1',
      type: 'new',
      title: 'New Consultation Close Scripts',
      description: 'Close more high-value consultations with these proven scripts.',
      date: 'This week',
      badge: 'NEW',
    },
    {
      id: 'update-2',
      type: 'improvement',
      title: 'Enhanced Financing Presentation',
      description: 'Updated scripts for presenting payment options professionally.',
      date: 'This week',
      badge: 'UPDATED',
    },
    {
      id: 'update-3',
      type: 'coming-soon',
      title: 'Coming: Celebrity-Style Marketing',
      description: 'Position your practice as THE luxury choice. Module launching soon!',
      date: 'Next week',
      badge: 'SOON',
    },
    {
      id: 'update-4',
      type: 'bonus',
      title: 'Free Bonus: VIP Experience Checklist',
      description: 'Create a premium patient experience from first call to post-op.',
      date: '2 days ago',
      badge: 'FREE',
    },
  ],
  dermatologists: [
    {
      id: 'update-1',
      type: 'new',
      title: 'New Before/After Showcase Template',
      description: 'HIPAA-compliant before/after presentations for skin treatments and procedures.',
      date: 'This week',
      badge: 'NEW',
    },
    {
      id: 'update-2',
      type: 'improvement',
      title: 'Updated Cosmetic Consultation Scripts',
      description: 'New scripts for Botox, fillers, and laser treatment consultations.',
      date: 'This week',
      badge: 'UPDATED',
    },
    {
      id: 'update-3',
      type: 'coming-soon',
      title: 'Coming: Medical Spa Marketing Module',
      description: 'Complete system for marketing your med spa services. Launching soon!',
      date: 'Next week',
      badge: 'SOON',
    },
    {
      id: 'update-4',
      type: 'bonus',
      title: 'Free Bonus: Skincare Routine Content Scripts',
      description: 'Educational content scripts about daily skincare routines and product recommendations.',
      date: '2 days ago',
      badge: 'FREE',
    },
  ],
}

// Helper to get updates for a niche
export function getUpdatesForNiche(niche: NicheSlug): Update[] {
  return updatesByNiche[niche] || []
}

// Coming this week teasers
export const upcomingTeasers: Record<NicheSlug, string[]> = {
  lawyers: [
    'New retainer closing script dropping Friday',
    'Advanced AI prompt training coming this week',
    'Exclusive case study from $2M+ practice',
  ],
  dentists: [
    'New Invisalign marketing scripts dropping Friday',
    'Advanced AI prompt training coming this week',
    'Exclusive case study from 5-location practice',
  ],
  psychologists: [
    'New couples therapy content scripts dropping Friday',
    'Advanced AI prompt training coming this week',
    'Exclusive case study from fully-booked practice',
  ],
  'plastic-surgeons': [
    'New rhinoplasty consultation scripts dropping Friday',
    'Advanced AI prompt training coming this week',
    'Exclusive case study from Beverly Hills practice',
  ],
  dermatologists: [
    'New laser treatment marketing scripts dropping Friday',
    'Advanced AI prompt training coming this week',
    'Exclusive case study from cosmetic derm practice',
  ],
}
