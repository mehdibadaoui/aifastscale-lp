// ============================================
// NICHE CONFIG: DERMATOLOGISTS
// ============================================

import {
  PlayCircle, Target, Trophy, Zap, Gift, Flame, Crown, StickyNote, Bookmark,
  FileText, Calendar, DollarSign, Headphones, Users, Brain, Star, Rocket,
  Megaphone, Search, MessageSquare, Video, TrendingUp
} from 'lucide-react'
import { NicheConfig } from '../types'

export const dermatologistsConfig: NicheConfig = {
  // Identity
  slug: 'dermatologists',
  title: 'CloneYourself',
  subtitle: 'for Dermatologists',
  supportEmail: 'support@aifastscale.com',

  // Theme - Rose/Pink
  theme: {
    primary: 'rose-500',
    primaryLight: 'pink-500',
    accent: 'fuchsia-500',
    glowColor: 'rgba(225, 29, 72, 0.3)',
    glowColorLg: 'rgba(225, 29, 72, 0.4)',
    btnGradient: 'from-rose-500 to-pink-500',
    heroGradient: 'from-rose-500/15 to-pink-500/10',
  },

  // Expert
  expert: {
    name: 'Dr. Alexander Voss',
    title: 'MD, FAAD',
    image: '/images/dentist/dr-voss.webp',
    quote: "I created this system because I was YOU. Spending thousands on marketing with unpredictable results. Now I want to help you achieve the same transformation.",
  },

  // Welcome
  welcomeVideo: {
    wistiaId: 'myh13ayp9d',
    title: 'Welcome from Dr. Voss',
    duration: '2 min',
  },
  socialProof: {
    studentCount: 847,
    rating: 4.9,
    reviewCount: 156,
    countriesServed: 23,
  },
  memberStats: {
    baseMembers: 1750,
    startDate: new Date('2024-12-01'),
    dailyGrowthMin: 40,
    dailyGrowthMax: 70,
    activeMin: 1233,
    activeMax: 2931,
    seedOffset: 2000,
  },

  // Modules
  modules: [
    {
      id: 'module-1',
      number: 1,
      title: 'Scriptwriting with Your Dermatology AI Mentor',
      description: "Learn how to use your personalized Dermatology AI mentor to generate high-quality short-form video scripts, story ideas, and content plans in minutes.",
      duration: '3 min',
      durationMinutes: 3,
      wistiaId: 'myh13ayp9d',
      thumbnail: '/images/dentist/module-1-scriptwriting.webp',
      lessons: ['Write video scripts in minutes', 'Using Dermatology Expert Copywriter AI', 'Get scripts for trust & bookings'],
      resources: [
        { name: 'Dermatology Expert Copywriter GPT', url: 'https://chatgpt.com/g/g-693ff08b15208191b94265efd521f783-dentist-expert-copywriter', type: 'link' },
      ],
    },
    {
      id: 'module-2',
      number: 2,
      title: 'Accounts You Need to Get Started',
      description: "Set up the essential tools. I'll show you exactly where to register, which plan to choose, and how to avoid mistakes.",
      duration: '5 min',
      durationMinutes: 5,
      wistiaId: 'lpkrdgr19e',
      thumbnail: '/images/dentist/module-2-accounts.webp',
      lessons: ['Where to register', 'Which plan to choose', 'Avoiding common mistakes'],
      resources: [
        { name: 'Google AI Pro (1-month free trial)', url: 'https://one.google.com/about/google-ai-plans/', type: 'link' },
        { name: 'Google Flow (AI Video Tool)', url: 'https://labs.google/flow/about', type: 'link' },
      ],
    },
    {
      id: 'module-3',
      number: 3,
      title: 'How to Make Any Photo Talk',
      description: "Turn a single photo into a realistic talking video. The exact process, right settings, and how to avoid common errors.",
      duration: '6 min',
      durationMinutes: 6,
      wistiaId: 'n4lx79ecbo',
      thumbnail: '/images/dentist/module-3-photo-talk.webp',
      lessons: ['The exact process', 'Right settings to use', 'Avoiding common errors'],
      resources: [
        { name: 'AI Talking Video Prompt', url: '/products/dentist/AI-Talking-Video-Prompt.html', type: 'file' },
      ],
    },
    {
      id: 'module-4',
      number: 4,
      title: 'Edit Your AI Video in Minutes',
      description: "Edit your AI videos quickly using simple tools like CapCut. No experience required.",
      duration: '4 min',
      durationMinutes: 4,
      wistiaId: 'j2reo83n4z',
      thumbnail: '/images/dentist/module-4-edit-video.webp',
      lessons: ['Combine clips easily', 'Add captions & music', 'Export ready-to-post video'],
      resources: [
        { name: 'Background Music Collection', url: '/products/dentist/background-music/', type: 'folder' },
      ],
    },
    {
      id: 'module-5',
      number: 5,
      title: 'Create Multiple Realistic Images',
      description: "Generate multiple realistic images of yourself using one reference photo. Different styles, locations, outfits.",
      duration: '5 min',
      durationMinutes: 5,
      wistiaId: '0a48x7ur8z',
      thumbnail: '/images/dentist/module-5-realistic-images.webp',
      lessons: ['Generate realistic images', 'Different styles & locations', 'Keep same identity'],
      resources: [
        { name: 'AI Image Generation Prompt', url: '/products/dentist/AI-Image-Generation-Prompt.html', type: 'file' },
      ],
    },
    // Modules 6-11 removed — will be added when content is ready
  ],

  // Bonuses
  bonuses: [
    { id: 'bonus-1', name: '100 Viral Dermatology Scripts', value: 297, icon: FileText, description: 'Copy-paste scripts that go viral on social media', category: 'Content', url: '/products/dentist/bonuses/100-viral-scripts.pdf', image: '/images/dentist/viral-scripts.webp' },
    { id: 'bonus-2', name: '365-Day Content Calendar', value: 197, icon: Calendar, description: 'Never run out of content ideas for a whole year', category: 'Planning', url: '/products/dentist/bonuses/365-content-calendar.pdf', image: '/images/dentist/social-templates.webp' },
    { id: 'bonus-3', name: 'Website Template (Canva)', value: 397, icon: Rocket, description: 'Professional dermatology website template for Canva', category: 'Website', url: '/products/dentist/bonuses/website-template-canva.pdf', image: '/images/dentist/website-template.webp' },
    { id: 'bonus-3b', name: 'FREE BONUS: Elementor Template', value: 0, icon: Rocket, description: 'Extra free WordPress Elementor theme - EverBright', category: 'Website', url: '/products/dentist/bonuses/website-template-elementor.zip', image: '/images/dentist/website-template.webp', isFreeBonus: true },
    { id: 'bonus-4', name: 'Profit Calculator Spreadsheet', value: 247, icon: TrendingUp, description: 'Find hidden profits in your practice instantly', category: 'Tools', url: '/products/dentist/bonuses/profit-calculator.xlsx', image: '/images/dentist/profit-simulator.webp' },
    { id: 'bonus-5', name: 'Front Desk Phone Scripts', value: 297, icon: Headphones, description: 'Convert more phone calls into booked appointments', category: 'Scripts', url: '/products/dentist/bonuses/front-desk-scripts.pdf', image: '/images/dentist/front-desk-scripts.webp' },
    { id: 'bonus-6', name: 'Patient Intake & Consent Forms', value: 147, icon: FileText, description: 'Professional intake and consent forms that save hours', category: 'Forms', url: '/products/dentist/bonuses/patient-forms.zip', image: '/images/dentist/patient-forms.webp' },
    { id: 'bonus-7', name: 'Referral Machine System', value: 347, icon: Users, description: 'Turn happy patients into your best referral source', category: 'Marketing', url: '/products/dentist/bonuses/referral-system.pdf', image: '/images/dentist/referral-machine.webp' },
    { id: 'bonus-8', name: 'AI Content Generator (500+ Prompts)', value: 197, icon: Brain, description: 'Never write content from scratch again', category: 'AI Tools', url: 'https://chatgpt.com/g/g-693ff08b15208191b94265efd521f783-dentist-expert-copywriter', image: '/images/dentist/ai-generator.webp' },
    { id: 'bonus-9', name: '5-Star Review System', value: 297, icon: Star, description: 'Get 15+ Google reviews every month on autopilot', category: 'Reviews', url: '/products/dentist/bonuses/review-system.pdf', image: '/images/dentist/review-explosion.webp' },
  ],

  // Achievements
  achievements: [
    { id: 'first-video', name: 'First Steps', description: 'Complete your first module', icon: PlayCircle, tier: 'bronze', points: 50 },
    { id: 'halfway', name: 'Halfway Hero', description: 'Complete 50% of the course', icon: Target, tier: 'silver', points: 100 },
    { id: 'completed', name: 'AI Video Master', description: 'Complete all modules', icon: Trophy, tier: 'gold', points: 250 },
    { id: 'fast-learner', name: 'Fast Learner', description: 'Complete 3 modules in one session', icon: Zap, tier: 'silver', points: 100 },
    { id: 'bonus-collector', name: 'Bonus Collector', description: 'Download 5 bonuses', icon: Gift, tier: 'bronze', points: 50 },
    { id: 'streak-3', name: '3-Day Streak', description: 'Learn 3 days in a row', icon: Flame, tier: 'bronze', points: 75 },
    { id: 'streak-7', name: 'Week Warrior', description: 'Learn 7 days in a row', icon: Crown, tier: 'gold', points: 200 },
    { id: 'note-taker', name: 'Note Taker', description: 'Write your first note', icon: StickyNote, tier: 'bronze', points: 25 },
    { id: 'bookworm', name: 'Bookworm', description: 'Bookmark 3 modules', icon: Bookmark, tier: 'bronze', points: 50 },
  ],

  // Coming Soon Courses
  comingSoonCourses: [
    {
      id: 'course-meta-ads',
      title: 'Meta Ads Mastery',
      subtitle: 'for Dermatologists',
      description: 'Run profitable Facebook & Instagram ads that fill your appointment book. From $0 to your first 50 patients.',
      icon: Megaphone,
      color: 'from-blue-500 to-indigo-600',
      features: ['Facebook & Instagram Ads', 'Targeting local patients', 'Ad creatives that convert', 'Budget optimization'],
      estimatedLaunch: 'Q1 2025',
      waitlistCount: 312,
      price: 297,
    },
    {
      id: 'course-google-ads',
      title: 'Google Ads Domination',
      subtitle: 'for Dermatologists',
      description: 'Show up first when patients search "dermatologist near me". Capture high-intent leads ready to book.',
      icon: Search,
      color: 'from-emerald-500 to-teal-600',
      features: ['Search ads setup', 'Local service ads', 'Keyword research', 'Landing page secrets'],
      estimatedLaunch: 'Q1 2025',
      waitlistCount: 287,
      price: 297,
    },
    {
      id: 'course-reviews',
      title: '5-Star Review Machine',
      subtitle: 'for Dermatologists',
      description: 'Get 20+ Google reviews every month on autopilot. Build unstoppable social proof.',
      icon: Star,
      color: 'from-amber-500 to-orange-600',
      features: ['Automated review requests', 'Response templates', 'Handling negative reviews', 'Review generation scripts'],
      estimatedLaunch: 'Q2 2025',
      waitlistCount: 456,
      price: 197,
    },
    {
      id: 'course-treatment-acceptance',
      title: 'High-Ticket Treatment Acceptance',
      subtitle: 'for Dermatologists',
      description: 'Close more Botox, filler, and laser treatment cases. Turn consultations into $5K+ treatment plans.',
      icon: DollarSign,
      color: 'from-green-500 to-emerald-600',
      features: ['Treatment presentation mastery', 'Overcoming objections', 'Payment plan scripts', 'Follow-up sequences'],
      estimatedLaunch: 'Q2 2025',
      waitlistCount: 523,
      price: 397,
    },
    {
      id: 'course-tiktok-reels',
      title: 'TikTok & Reels Viral System',
      subtitle: 'for Dermatologists',
      description: 'Go viral with short-form content. Turn views into booked appointments.',
      icon: Video,
      color: 'from-pink-500 to-rose-600',
      features: ['Viral content formulas', 'Trending sounds & hooks', 'Before/after showcases', 'Building your brand'],
      estimatedLaunch: 'Q2 2025',
      waitlistCount: 389,
      price: 247,
    },
    {
      id: 'course-patient-reactivation',
      title: 'Patient Reactivation System',
      subtitle: 'for Dermatologists',
      description: 'Bring back inactive patients and unlock hidden revenue sitting in your database.',
      icon: MessageSquare,
      color: 'from-violet-500 to-purple-600',
      features: ['Email sequences', 'SMS campaigns', 'Recall scripts', 'Re-engagement offers'],
      estimatedLaunch: 'Q3 2025',
      waitlistCount: 234,
      price: 197,
    },
  ],

  // Keyboard shortcuts
  keyboardShortcuts: [
    { key: '←', action: 'Previous module' },
    { key: '→', action: 'Next module' },
    { key: 'Space', action: 'Play/Pause video' },
    { key: 'M', action: 'Mark module complete' },
    { key: 'N', action: 'Open notes' },
    { key: 'B', action: 'Toggle bookmark' },
    { key: 'D', action: 'Toggle dark mode' },
    { key: '?', action: 'Show shortcuts' },
    { key: 'Esc', action: 'Close modal' },
  ],

  // Auth
  auth: {
    product: 'dermatologist',
    legacyPassword: 'dermatologist2026',
    legacyEnabled: true,
    vipGuests: [],
    whopCheckoutLink: '#',
    authStorageKey: 'dermatologistMemberAuth',
  },
  blockedUsers: [],
  devAutoLogin: false,

  // Storage
  storagePrefix: 'dermatologist_v4_',
}
