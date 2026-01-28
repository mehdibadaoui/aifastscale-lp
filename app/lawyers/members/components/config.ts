// ============================================
// COURSE CONFIGURATION - LAWYERS
// ============================================

import {
  PlayCircle, Target, Trophy, Zap, Gift, Flame, Crown, StickyNote, Bookmark,
  FileText, Calendar, Rocket, TrendingUp, Headphones, Users, Brain, Star,
  Megaphone, Search, MessageSquare, DollarSign, Video, Bell
} from 'lucide-react'

// Dynamic member count calculation
const MEMBER_STATS_CONFIG = {
  baseMembers: 750,              // Starting count for new product
  startDate: new Date('2025-01-25'), // Launch date
  dailyGrowthMin: 20,           // Min new members per day
  dailyGrowthMax: 40,           // Max new members per day
  activeMin: 245,               // Min active users (fixed range)
  activeMax: 680,               // Max active users (fixed range)
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
    const daySeed = i + 3000 // Different seed from other products
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
  subtitle: "for Lawyers",
  supportEmail: "support@aifastscale.com",
  welcomeVideo: {
    wistiaId: "fnjt6devuy",
    title: "Welcome from Alex Morgan",
    duration: "2 min",
  },
  expert: {
    name: "Alex Morgan, Esq.",
    title: "Trial Attorney, 18+ Years Experience",
    image: "/images/lawyer/alex-morgan.webp",
    quote: "After 18 years winning cases and building a 7-figure practice, I realized the attorneys who thrive aren't just skilled — they're visible. I built this system to help you attract the high-value clients who need YOUR expertise.",
  },
  socialProof: {
    studentCount: 750, // Fallback, use getMemberStats() for dynamic
    rating: 4.9,
    reviewCount: 67,
    countriesServed: 15,
  },
}

export const DEV_AUTO_LOGIN = true

// Blocked users - will be auto-logged out
export const BLOCKED_USERS: string[] = []

// Course modules - Same Wistia IDs (same core content, adapted messaging)
export const COURSE_MODULES = [
  {
    id: 'module-1',
    number: 1,
    title: 'Scriptwriting with Your Attorney AI Mentor',
    description: "Learn how to use your personalized Attorney AI mentor to generate high-quality short-form video scripts, story ideas, and content plans in minutes.",
    duration: '3 min',
    durationMinutes: 3,
    wistiaId: 'fnjt6devuy',
    thumbnail: '/images/lawyer/module-1.webp',
    lessons: ['Write video scripts in minutes', 'Using Attorney Expert Copywriter AI', 'Get scripts for trust & appointments'],
    resources: [
      { name: 'Marcus - Lawyer Growth Mentor', url: 'https://chatgpt.com/g/g-6974ba45c9b4819183b251cfe6b68c27-marcus-the-lawyer-growth-mentor', type: 'link' as const },
    ],
  },
  {
    id: 'module-2',
    number: 2,
    title: 'Accounts You Need to Get Started',
    description: "Set up the essential tools. I'll show you exactly where to register, which plan to choose, and how to avoid mistakes.",
    duration: '5 min',
    durationMinutes: 5,
    wistiaId: '511b44q25r',
    thumbnail: '/images/lawyer/module-2.webp',
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
    wistiaId: '7jtqmnymc5',
    thumbnail: '/images/lawyer/module-3.webp',
    lessons: ['The exact process', 'Right settings to use', 'Avoiding common errors'],
    resources: [
      { name: 'Lawyer AI Talking Video Prompt', url: '/products/lawyer/Attorney_AI_Video_Prompt.txt', type: 'file' as const },
    ],
  },
  {
    id: 'module-4',
    number: 4,
    title: 'Edit Your AI Video in Minutes',
    description: "Edit your AI videos quickly using simple tools like CapCut. No experience required.",
    duration: '4 min',
    durationMinutes: 4,
    wistiaId: '9waf0llex7',
    thumbnail: '/images/lawyer/module-4.webp',
    lessons: ['Combine clips easily', 'Add captions & music', 'Export ready-to-post video'],
    resources: [
      { name: 'Background Music Collection', url: '/products/lawyer/Background music/', type: 'folder' as const },
    ],
  },
  {
    id: 'module-5',
    number: 5,
    title: 'Create Multiple Realistic Images',
    description: "Generate multiple realistic images of yourself using one reference photo. Different styles, locations, outfits.",
    duration: '5 min',
    durationMinutes: 5,
    wistiaId: '9f7os4xklp',
    thumbnail: '/images/lawyer/module-5.webp',
    lessons: ['Generate realistic images', 'Different styles & locations', 'Keep same identity'],
    resources: [
      { name: 'Lawyer AI Image Generation Prompt', url: '/products/lawyer/Attorney_AI_Image_Prompt.txt', type: 'file' as const },
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
    title: 'Legal Educational Content That Converts',
    description: 'Create educational content that positions you as the authority in your practice area and attracts qualified leads.',
    duration: '5 min',
    durationMinutes: 5,
    wistiaId: null,
    thumbnail: null,
    lessons: ['Topic selection for your practice area', 'Authority-building messaging', 'Compliance-friendly content'],
    comingSoon: true,
    resources: [],
  },
  {
    id: 'module-9',
    number: 9,
    title: 'Case Study & Success Story Content',
    description: 'Transform your wins into compelling content that builds trust and attracts similar high-value cases.',
    duration: '7 min',
    durationMinutes: 7,
    wistiaId: null,
    thumbnail: null,
    lessons: ['Selecting compelling cases', 'Client confidentiality best practices', 'Story structure that converts'],
    comingSoon: true,
    resources: [],
  },
  {
    id: 'module-10',
    number: 10,
    title: 'Platform-Specific Strategies',
    description: 'Master TikTok, Instagram Reels, YouTube Shorts, and Facebook with legal services-specific strategies.',
    duration: '8 min',
    durationMinutes: 8,
    wistiaId: null,
    thumbnail: null,
    lessons: ['Best times to post', 'Platform algorithms', 'Hashtag strategies for attorneys'],
    comingSoon: true,
    resources: [],
  },
  {
    id: 'module-11',
    number: 11,
    title: 'AI Appointment Follow-ups',
    description: 'Automate client communication with AI-powered scripts for calls, texts, and appointment reminders.',
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
  { id: 'bonus-1', name: '100 Viral Legal Video Scripts', value: 497, icon: FileText, description: 'Copy-paste scripts that go viral on social media', category: 'Content', url: '/products/lawyer/bonuses/100-viral-scripts.html', image: '/images/lawyer/viral-scripts.webp' },
  { id: 'bonus-2', name: '365-Day Legal Content Calendar', value: 397, icon: Calendar, description: 'Never run out of content ideas for a whole year', category: 'Planning', url: '/products/lawyer/bonuses/365-content-calendar.html', image: '/images/lawyer/content-calendar.webp' },
  { id: 'bonus-3', name: 'The Retainer Closer Scripts', value: 597, icon: DollarSign, description: 'Convert more consultations into retained clients', category: 'Sales', url: '/products/lawyer/bonuses/retainer-closer-scripts.html', image: '/images/lawyer/retainer-scripts.webp' },
  { id: 'bonus-4', name: 'Authority Building Content System', value: 497, icon: Brain, description: 'Position yourself as THE go-to attorney in your area', category: 'Content', url: '/products/lawyer/bonuses/authority-building-system.html', image: '/images/lawyer/authority-system.webp' },
  { id: 'bonus-5', name: 'Legal Intake Specialist Scripts', value: 497, icon: Headphones, description: 'Convert more phone calls into booked consultations', category: 'Operations', url: '/products/lawyer/bonuses/intake-phone-scripts.html', image: '/images/lawyer/phone-scripts.webp' },
  { id: 'bonus-6', name: 'Fee Objection Destroyer Scripts', value: 447, icon: FileText, description: 'Handle fee objections with confidence and close more retainers', category: 'Sales', url: '/products/lawyer/bonuses/fee-objection-scripts.html', image: '/images/lawyer/fee-scripts.webp' },
  { id: 'bonus-7', name: 'Attorney Referral Network Builder', value: 547, icon: Users, description: 'Build a referral network that sends you cases on autopilot', category: 'Marketing', url: '/products/lawyer/bonuses/referral-network-builder.html', image: '/images/lawyer/referral-machine.webp' },
  { id: 'bonus-8', name: 'AI Content Generator for Attorneys', value: 397, icon: Brain, description: 'Never write content from scratch again', category: 'AI Tools', url: '/products/lawyer/bonuses/ai-content-generator.html', image: '/images/lawyer/ai-generator.webp' },
  { id: 'bonus-9', name: '5-Star Review Explosion System', value: 497, icon: Star, description: 'Get 20+ Google reviews every month on autopilot', category: 'Reviews', url: '/products/lawyer/bonuses/5-star-review-system.html', image: '/images/lawyer/review-system.webp' },
  { id: 'bonus-10', name: 'Case Win Marketing System', value: 597, icon: Users, description: 'Turn your case wins into a client attraction machine', category: 'Marketing', url: '/products/lawyer/bonuses/case-win-marketing.html', image: '/images/lawyer/case-win-marketing.webp' },
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
    subtitle: 'for Lawyers',
    description: 'Run profitable Facebook & Instagram ads that fill your appointment calendar. From $0 to your first 50 clients.',
    icon: Megaphone,
    color: 'from-amber-500 to-yellow-600',
    features: ['Facebook & Instagram Ads', 'Targeting legal seekers', 'Ad creatives that convert', 'Budget optimization'],
    estimatedLaunch: 'Q1 2025',
    waitlistCount: 134,
    price: 397,
  },
  {
    id: 'course-google-ads',
    title: 'Google Ads Domination',
    subtitle: 'for Lawyers',
    description: 'Show up first when clients search "attorney near me". Capture high-intent leads ready to book.',
    icon: Search,
    color: 'from-amber-500 to-orange-600',
    features: ['Search ads setup', 'Local service ads', 'Keyword research', 'Landing page secrets'],
    estimatedLaunch: 'Q1 2025',
    waitlistCount: 112,
    price: 397,
  },
  {
    id: 'course-reviews',
    title: '5-Star Review Machine',
    subtitle: 'for Lawyers',
    description: 'Get 25+ Google reviews every month on autopilot. Build unstoppable social proof.',
    icon: Star,
    color: 'from-yellow-500 to-amber-600',
    features: ['Automated review requests', 'Response templates', 'Handling negative reviews', 'Review generation scripts'],
    estimatedLaunch: 'Q2 2025',
    waitlistCount: 189,
    price: 297,
  },
  {
    id: 'course-intake',
    title: 'High-Conversion Intake System',
    subtitle: 'for Lawyers',
    description: 'Convert more consultations into long-term clients. Master the intake process.',
    icon: DollarSign,
    color: 'from-amber-500 to-yellow-600',
    features: ['Intake call mastery', 'Overcoming objections', 'Insurance presentation', 'Follow-up sequences'],
    estimatedLaunch: 'Q2 2025',
    waitlistCount: 256,
    price: 497,
  },
  {
    id: 'course-tiktok-reels',
    title: 'TikTok & Reels Viral System',
    subtitle: 'for Lawyers',
    description: 'Go viral with short-form legal services content. Turn views into booked sessions.',
    icon: Video,
    color: 'from-yellow-500 to-amber-600',
    features: ['Viral content formulas', 'Trending sounds & hooks', 'Educational showcases', 'Building your brand'],
    estimatedLaunch: 'Q2 2025',
    waitlistCount: 198,
    price: 347,
  },
  {
    id: 'course-client-reactivation',
    title: 'Client Reactivation System',
    subtitle: 'for Lawyers',
    description: 'Bring back clients who stopped coming and unlock hidden revenue in your database.',
    icon: MessageSquare,
    color: 'from-amber-500 to-amber-600',
    features: ['Email sequences', 'SMS campaigns', 'Recall scripts', 'Re-engagement offers'],
    estimatedLaunch: 'Q3 2025',
    waitlistCount: 98,
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
