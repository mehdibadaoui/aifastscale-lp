// ============================================
// COURSE CONFIGURATION - PLASTIC SURGEONS
// ============================================

import {
  PlayCircle, Target, Trophy, Zap, Gift, Flame, Crown, StickyNote, Bookmark,
  FileText, Calendar, Rocket, TrendingUp, Headphones, Users, Brain, Star,
  Megaphone, Search, MessageSquare, DollarSign, Video, Bell
} from 'lucide-react'

// Dynamic member count calculation
const MEMBER_STATS_CONFIG = {
  baseMembers: 850,              // Starting count for new product
  startDate: new Date('2025-01-15'), // Launch date
  dailyGrowthMin: 25,           // Min new members per day
  dailyGrowthMax: 45,           // Max new members per day
  activeMin: 312,               // Min active users (fixed range)
  activeMax: 847,               // Max active users (fixed range)
}

// Seeded random for consistent daily values
function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

// Get dynamic member stats
export function getMemberStats() {
  const now = new Date()
  const daysSinceStart = Math.floor((now.getTime() - MEMBER_STATS_CONFIG.startDate.getTime()) / (1000 * 60 * 60 * 24))

  // Calculate total members (base + daily growth)
  let totalMembers = MEMBER_STATS_CONFIG.baseMembers
  for (let i = 0; i < Math.max(0, daysSinceStart); i++) {
    const daySeed = i + 2000 // Different seed from dentist
    const dailyGrowth = Math.floor(
      MEMBER_STATS_CONFIG.dailyGrowthMin +
      seededRandom(daySeed) * (MEMBER_STATS_CONFIG.dailyGrowthMax - MEMBER_STATS_CONFIG.dailyGrowthMin)
    )
    totalMembers += dailyGrowth
  }

  // Calculate active users (fluctuates smoothly within fixed range)
  const minuteOfDay = now.getHours() * 60 + now.getMinutes()
  const daySeed = now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate()

  const wavePosition = Math.sin((minuteOfDay / 1440) * Math.PI * 4)
  const baseActive = (MEMBER_STATS_CONFIG.activeMin + MEMBER_STATS_CONFIG.activeMax) / 2
  const amplitude = (MEMBER_STATS_CONFIG.activeMax - MEMBER_STATS_CONFIG.activeMin) / 2

  const variance = seededRandom(daySeed + Math.floor(minuteOfDay / 5)) * 100 - 50

  const activeNowRaw = Math.floor(baseActive + (wavePosition * amplitude * 0.7) + variance)
  const activeNow = Math.min(activeNowRaw, totalMembers)
  const activePercent = Math.round((activeNow / totalMembers) * 100)

  const todaySeed = now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate()
  const todayFullGrowth = Math.floor(
    MEMBER_STATS_CONFIG.dailyGrowthMin +
    seededRandom(todaySeed) * (MEMBER_STATS_CONFIG.dailyGrowthMax - MEMBER_STATS_CONFIG.dailyGrowthMin)
  )
  const hourProgress = now.getHours() / 24
  const todayNewMembers = Math.floor(todayFullGrowth * hourProgress)

  return {
    totalMembers: totalMembers + todayNewMembers,
    activeNow,
    todayNewMembers,
    activePercent: Math.round(activePercent),
  }
}

export const COURSE_CONFIG = {
  title: "CloneYourself",
  subtitle: "for Plastic Surgeons",
  supportEmail: "support@aifastscale.com",
  welcomeVideo: {
    wistiaId: "myh13ayp9d", // Same as dentist (Dr. Voss welcome video)
    title: "Welcome from Dr. Voss",
    duration: "2 min",
  },
  drVoss: {
    name: "Dr. Alexander Voss",
    title: "Aesthetic & Reconstructive Surgery Consultant",
    image: "/images/plastic-surgeon/dr-voss.webp",
    quote: "I created this system because I was YOU. Spending thousands on marketing with unpredictable results. Now I want to help you achieve the same transformation.",
  },
  socialProof: {
    studentCount: 847, // Fallback, use getMemberStats() for dynamic
    rating: 4.9,
    reviewCount: 89,
    countriesServed: 18,
  },
}

export const DEV_AUTO_LOGIN = true

// Blocked users - will be auto-logged out
export const BLOCKED_USERS: string[] = []

// Course modules - Same Wistia IDs as dentist (same course content)
export const COURSE_MODULES = [
  {
    id: 'module-1',
    number: 1,
    title: 'Scriptwriting with Your Surgeon AI Mentor',
    description: "Learn how to use your personalized Surgeon AI mentor to generate high-quality short-form video scripts, story ideas, and content plans in minutes.",
    duration: '3 min',
    durationMinutes: 3,
    wistiaId: 'myh13ayp9d',
    thumbnail: '/images/plastic-surgeon/module-1.webp',
    lessons: ['Write video scripts in minutes', 'Using Surgeon Expert Copywriter AI', 'Get scripts for trust & consultations'],
    resources: [
      { name: 'Sofia - Plastic Surgeon Growth Mentor', url: 'https://chatgpt.com/g/g-696c9259205481918b40891cd3bf2d83-sofia-the-plastic-surgeon-growth-mentor', type: 'link' as const },
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
    thumbnail: '/images/plastic-surgeon/module-2.webp',
    lessons: ['Where to register', 'Which plan to choose', 'Avoiding common mistakes'],
    resources: [
      { name: 'Google AI Pro (1-month free trial)', url: 'https://one.google.com/about/google-ai-plans/', type: 'link' as const },
      { name: 'Google Flow (AI Video Tool)', url: 'https://labs.google/flow/about', type: 'link' as const },
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
    thumbnail: '/images/plastic-surgeon/module-3.webp',
    lessons: ['The exact process', 'Right settings to use', 'Avoiding common errors'],
    resources: [
      { name: 'Plastic Surgeon AI Talking Video Prompt', url: '/products/plastic-surgeon/Surgeon_AI_Video_Prompt.txt', type: 'file' as const },
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
    thumbnail: '/images/plastic-surgeon/module-4.webp',
    lessons: ['Combine clips easily', 'Add captions & music', 'Export ready-to-post video'],
    resources: [
      { name: 'Background Music Collection', url: '/products/plastic-surgeon/Background music/', type: 'folder' as const },
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
    thumbnail: '/images/plastic-surgeon/module-5.webp',
    lessons: ['Generate realistic images', 'Different styles & locations', 'Keep same identity'],
    resources: [
      { name: 'Plastic Surgeon AI Image Generation Prompt', url: '/products/plastic-surgeon/Surgeon_AI_Image_Prompt.txt', type: 'file' as const },
    ],
  },
  {
    id: 'module-6',
    number: 6,
    title: 'Scaling & Automation',
    description: 'Build a content machine that runs on autopilot. Batch create videos and scale your production.',
    duration: '5 min',
    durationMinutes: 5,
    wistiaId: null,
    thumbnail: null,
    lessons: ['Batch creation', 'Content calendar', 'Scale without burnout'],
    comingSoon: true,
    resources: [],
  },
  {
    id: 'module-7',
    number: 7,
    title: 'Turn Reviews into Video Testimonials',
    description: 'Transform your written Google reviews into powerful AI video testimonials that build instant trust.',
    duration: '6 min',
    durationMinutes: 6,
    wistiaId: null,
    thumbnail: null,
    lessons: ['Extract best reviews', 'Create AI spokesperson', 'Add to your website & ads'],
    comingSoon: true,
    resources: [],
  },
  {
    id: 'module-8',
    number: 8,
    title: 'Before & After Transformations',
    description: 'Create stunning before/after content that showcases your surgical results and attracts high-value patients.',
    duration: '5 min',
    durationMinutes: 5,
    wistiaId: null,
    thumbnail: null,
    lessons: ['Capture perfect befores', 'AI-enhanced presentations', 'HIPAA-compliant sharing'],
    comingSoon: true,
    resources: [],
  },
  {
    id: 'module-9',
    number: 9,
    title: 'Educational Content That Converts',
    description: 'Create educational videos about procedures that position you as the expert and drive consultations.',
    duration: '7 min',
    durationMinutes: 7,
    wistiaId: null,
    thumbnail: null,
    lessons: ['Procedure explainers', 'FAQ video series', 'Treatment option comparisons'],
    comingSoon: true,
    resources: [],
  },
  {
    id: 'module-10',
    number: 10,
    title: 'Platform-Specific Strategies',
    description: 'Master TikTok, Instagram Reels, YouTube Shorts, and Facebook with plastic surgery-specific strategies.',
    duration: '8 min',
    durationMinutes: 8,
    wistiaId: null,
    thumbnail: null,
    lessons: ['Best times to post', 'Platform algorithms', 'Hashtag strategies for surgeons'],
    comingSoon: true,
    resources: [],
  },
  {
    id: 'module-11',
    number: 11,
    title: 'AI Consultation Follow-ups',
    description: 'Automate patient communication with AI-powered scripts for calls, texts, and consultation reminders.',
    duration: '6 min',
    durationMinutes: 6,
    wistiaId: null,
    thumbnail: null,
    lessons: ['AI phone scripts', 'Automated text sequences', 'No-show recovery system'],
    comingSoon: true,
    resources: [],
  },
]

export const TOTAL_RUNTIME = COURSE_MODULES.filter(m => !m.comingSoon).reduce((acc, m) => acc + m.durationMinutes, 0)

// Bonuses
export const BONUSES = [
  { id: 'bonus-1', name: '100 Viral Plastic Surgery Scripts', value: 397, icon: FileText, description: 'Copy-paste scripts that go viral on social media', category: 'Content', url: '/products/plastic-surgeon/bonuses/100-viral-scripts.pdf', image: '/images/plastic-surgeon/viral-scripts.webp' },
  { id: 'bonus-2', name: '365-Day Content Calendar', value: 297, icon: Calendar, description: 'Never run out of content ideas for a whole year', category: 'Planning', url: '/products/plastic-surgeon/bonuses/365-content-calendar.pdf', image: '/images/plastic-surgeon/social-templates.webp' },
  { id: 'bonus-3', name: 'High-Ticket Consultation Scripts', value: 497, icon: DollarSign, description: 'Close more $15K+ procedures with confidence', category: 'Sales', url: '/products/plastic-surgeon/bonuses/consultation-scripts.pdf', image: '/images/plastic-surgeon/consultation-scripts.webp' },
  { id: 'bonus-4', name: 'Before/After Content System', value: 397, icon: Rocket, description: 'Showcase transformations that convert', category: 'Content', url: '/products/plastic-surgeon/bonuses/before-after-system.pdf', image: '/images/plastic-surgeon/before-after.webp' },
  { id: 'bonus-5', name: 'Patient Coordinator Phone Scripts', value: 397, icon: Headphones, description: 'Convert more phone calls into booked consultations', category: 'Operations', url: '/products/plastic-surgeon/bonuses/phone-scripts.pdf', image: '/images/plastic-surgeon/phone-scripts.webp' },
  { id: 'bonus-6', name: 'Patient Financing Scripts', value: 347, icon: FileText, description: 'Turn "I can\'t afford it" into "Yes, let\'s do it"', category: 'Sales', url: '/products/plastic-surgeon/bonuses/financing-scripts.pdf', image: '/images/plastic-surgeon/financing-scripts.webp' },
  { id: 'bonus-7', name: 'Referral Machine System', value: 447, icon: Users, description: 'Turn happy patients into your best referral source', category: 'Marketing', url: '/products/plastic-surgeon/bonuses/referral-system.pdf', image: '/images/plastic-surgeon/referral-machine.webp' },
  { id: 'bonus-8', name: 'AI Content Generator (500+ Prompts)', value: 297, icon: Brain, description: 'Never write content from scratch again', category: 'AI Tools', url: 'https://chatgpt.com/g/g-696c9259205481918b40891cd3bf2d83-sofia-the-plastic-surgeon-growth-mentor', image: '/images/plastic-surgeon/ai-generator.webp' },
  { id: 'bonus-9', name: '5-Star Review System', value: 397, icon: Star, description: 'Get 20+ Google reviews every month on autopilot', category: 'Reviews', url: '/products/plastic-surgeon/bonuses/review-system.pdf', image: '/images/plastic-surgeon/review-explosion.webp' },
  { id: 'bonus-10', name: 'VIP Concierge Patient System', value: 497, icon: Crown, description: 'Premium experience = premium prices', category: 'Operations', url: '/products/plastic-surgeon/bonuses/vip-concierge.pdf', image: '/images/plastic-surgeon/vip-concierge.webp' },
]

export const BONUS_CATEGORIES = ['All', ...Array.from(new Set(BONUSES.map(b => b.category)))]
export const TOTAL_BONUS_VALUE = BONUSES.reduce((acc, b) => acc + b.value, 0)

// Achievements
export const ACHIEVEMENTS = [
  { id: 'first-video', name: 'First Steps', description: 'Complete your first module', icon: PlayCircle, tier: 'bronze', points: 50 },
  { id: 'halfway', name: 'Halfway Hero', description: 'Complete 50% of the course', icon: Target, tier: 'silver', points: 100 },
  { id: 'completed', name: 'AI Video Master', description: 'Complete all modules', icon: Trophy, tier: 'gold', points: 250 },
  { id: 'fast-learner', name: 'Fast Learner', description: 'Complete 3 modules in one session', icon: Zap, tier: 'silver', points: 100 },
  { id: 'bonus-collector', name: 'Bonus Collector', description: 'Download 5 bonuses', icon: Gift, tier: 'bronze', points: 50 },
  { id: 'streak-3', name: '3-Day Streak', description: 'Learn 3 days in a row', icon: Flame, tier: 'bronze', points: 75 },
  { id: 'streak-7', name: 'Week Warrior', description: 'Learn 7 days in a row', icon: Crown, tier: 'gold', points: 200 },
  { id: 'note-taker', name: 'Note Taker', description: 'Write your first note', icon: StickyNote, tier: 'bronze', points: 25 },
  { id: 'bookworm', name: 'Bookworm', description: 'Bookmark 3 modules', icon: Bookmark, tier: 'bronze', points: 50 },
]

// Coming Soon Courses
export const COMING_SOON_COURSES = [
  {
    id: 'course-meta-ads',
    title: 'Meta Ads Mastery',
    subtitle: 'for Plastic Surgeons',
    description: 'Run profitable Facebook & Instagram ads that fill your consultation calendar. From $0 to your first 50 consultations.',
    icon: Megaphone,
    color: 'from-purple-500 to-indigo-600',
    features: ['Facebook & Instagram Ads', 'Targeting cosmetic patients', 'Ad creatives that convert', 'Budget optimization'],
    estimatedLaunch: 'Q1 2025',
    waitlistCount: 187,
    price: 397,
  },
  {
    id: 'course-google-ads',
    title: 'Google Ads Domination',
    subtitle: 'for Plastic Surgeons',
    description: 'Show up first when patients search "plastic surgeon near me". Capture high-intent leads ready to book.',
    icon: Search,
    color: 'from-amber-500 to-orange-600',
    features: ['Search ads setup', 'Local service ads', 'Keyword research', 'Landing page secrets'],
    estimatedLaunch: 'Q1 2025',
    waitlistCount: 156,
    price: 397,
  },
  {
    id: 'course-reviews',
    title: '5-Star Review Machine',
    subtitle: 'for Plastic Surgeons',
    description: 'Get 25+ Google reviews every month on autopilot. Build unstoppable social proof.',
    icon: Star,
    color: 'from-yellow-500 to-amber-600',
    features: ['Automated review requests', 'Response templates', 'Handling negative reviews', 'Review generation scripts'],
    estimatedLaunch: 'Q2 2025',
    waitlistCount: 234,
    price: 297,
  },
  {
    id: 'course-case-acceptance',
    title: 'High-Ticket Case Acceptance',
    subtitle: 'for Plastic Surgeons',
    description: 'Close more facelifts, rhinoplasty, and body contouring cases. Turn consultations into $20K+ procedures.',
    icon: DollarSign,
    color: 'from-green-500 to-emerald-600',
    features: ['Case presentation mastery', 'Overcoming objections', 'Financing presentation', 'Follow-up sequences'],
    estimatedLaunch: 'Q2 2025',
    waitlistCount: 312,
    price: 497,
  },
  {
    id: 'course-tiktok-reels',
    title: 'TikTok & Reels Viral System',
    subtitle: 'for Plastic Surgeons',
    description: 'Go viral with short-form content. Turn views into booked consultations.',
    icon: Video,
    color: 'from-pink-500 to-rose-600',
    features: ['Viral content formulas', 'Trending sounds & hooks', 'Before/after showcases', 'Building your brand'],
    estimatedLaunch: 'Q2 2025',
    waitlistCount: 267,
    price: 347,
  },
  {
    id: 'course-patient-reactivation',
    title: 'Patient Reactivation System',
    subtitle: 'for Plastic Surgeons',
    description: 'Bring back consultation no-shows and unlock hidden revenue sitting in your database.',
    icon: MessageSquare,
    color: 'from-violet-500 to-purple-600',
    features: ['Email sequences', 'SMS campaigns', 'Recall scripts', 'Re-engagement offers'],
    estimatedLaunch: 'Q3 2025',
    waitlistCount: 145,
    price: 297,
  },
]

export interface ComingSoonCourse {
  id: string
  title: string
  subtitle: string
  description: string
  icon: any
  color: string
  features: string[]
  estimatedLaunch: string
  waitlistCount: number
  price: number
}

// Keyboard shortcuts
export const KEYBOARD_SHORTCUTS = [
  { key: '<-', action: 'Previous module' },
  { key: '->', action: 'Next module' },
  { key: 'Space', action: 'Play/Pause video' },
  { key: 'M', action: 'Mark module complete' },
  { key: 'N', action: 'Open notes' },
  { key: 'B', action: 'Toggle bookmark' },
  { key: 'D', action: 'Toggle dark mode' },
  { key: '?', action: 'Show shortcuts' },
  { key: 'Esc', action: 'Close modal' },
]

// Types
export interface CourseModule {
  id: string
  number: number
  title: string
  description: string
  duration: string
  durationMinutes: number
  wistiaId: string | null
  lessons: string[]
  resources: { name: string; url: string; type: 'link' | 'file' | 'folder' }[]
  comingSoon?: boolean
}

export interface Bonus {
  id: string
  name: string
  value: number
  icon: any
  description: string
  category: string
  url: string
  image: string
}

export interface Achievement {
  id: string
  name: string
  description: string
  icon: any
  tier: 'bronze' | 'silver' | 'gold'
  points: number
}

export interface VideoProgress {
  percent: number
  seconds: number
}

export interface PlatformState {
  // Auth
  isAuthenticated: boolean
  // Navigation
  activeSection: 'dashboard' | 'course' | 'bonuses' | 'achievements'
  currentModuleIndex: number
  // Progress
  completedModules: string[]
  downloadedBonuses: string[]
  videoProgress: Record<string, VideoProgress>
  completionTimestamps: Record<string, string>
  // Gamification
  totalPoints: number
  streak: number
  unlockedAchievementIds: string[]
  sessionCompletedCount: number
  totalWatchTimeMinutes: number
  // User features
  moduleNotes: Record<string, string>
  bookmarkedModules: string[]
  // Settings
  darkMode: boolean
  autoPlayNext: boolean
  showCompletedBadge: boolean
  studentName: string
  reducedMotion: boolean
}
