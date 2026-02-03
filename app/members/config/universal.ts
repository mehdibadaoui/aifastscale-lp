// ============================================
// UNIVERSAL MEMBERS PLATFORM - SINGLE CONFIG
// ============================================

import {
  FileText, Video, Zap, Gift, Target, Award, Flame,
  Star, Trophy, Crown, Rocket, Brain, Sparkles,
  TrendingUp, Users, Clock, CheckCircle, BookOpen,
  Lightbulb, Camera, Mic, Edit3, Layout, Share2,
  BarChart3, DollarSign, Heart, Shield, Globe
} from 'lucide-react'
import type {
  NicheConfig, ThemeConfig, ExpertConfig, WelcomeVideoConfig,
  SocialProofConfig, MemberStatsConfig, CourseModule, Bonus,
  Achievement, ComingSoonCourse, AuthConfig, KeyboardShortcut
} from './types'

// ============================================
// THEME - Premium Gold/Amber (Universal)
// ============================================

const theme: ThemeConfig = {
  primary: 'amber-500',
  primaryLight: 'yellow-500',
  accent: 'orange-500',
  glowColor: 'rgba(212, 175, 55, 0.3)',
  glowColorLg: 'rgba(212, 175, 55, 0.4)',
  btnGradient: 'from-amber-500 to-yellow-500',
  heroGradient: 'from-amber-500/15 to-yellow-500/10',
}

// ============================================
// EXPERT - Hidden/Generic (No specific person)
// ============================================

const expert: ExpertConfig = {
  name: 'Your Instructor',
  title: 'AI Video Expert',
  image: '/images/logo-icon.png', // Use logo instead of person
  quote: 'Master AI video creation and transform your business.',
}

// ============================================
// WELCOME VIDEO
// ============================================

const welcomeVideo: WelcomeVideoConfig = {
  wistiaId: 'fnjt6devuy', // Universal welcome video
  title: 'Welcome to Your Training',
  duration: '3 min',
}

// ============================================
// SOCIAL PROOF
// ============================================

const socialProof: SocialProofConfig = {
  studentCount: 2847,
  rating: 4.9,
  reviewCount: 847,
  countriesServed: 23,
}

// ============================================
// MEMBER STATS (Dynamic counts)
// ============================================

const memberStats: MemberStatsConfig = {
  baseMembers: 2400,
  startDate: new Date('2024-01-15'),
  dailyGrowthMin: 3,
  dailyGrowthMax: 12,
  activeMin: 45,
  activeMax: 180,
  seedOffset: 42,
}

// ============================================
// COURSE MODULES - Universal Content (5 Modules)
// ============================================

const modules: CourseModule[] = [
  {
    id: 'module-1',
    number: 1,
    title: 'Your AI Script Mentor',
    description: 'Learn to write powerful scripts using our custom AI copywriter built specifically for your niche.',
    duration: '3 min',
    durationMinutes: 3,
    wistiaId: 'fnjt6devuy',
    thumbnail: 'https://embed-ssl.wistia.com/deliveries/d70480661b8a93b1ead9507e03cc1654.jpg?image_crop_resized=640x360',
    lessons: [
      'Meet your AI Script Mentor',
      'Generate scripts that convert',
      'Customize tone and style',
      'Create unlimited variations',
    ],
    resources: [
      { name: 'AI Script Mentor GPT', url: 'https://chatgpt.com', type: 'link' },
    ],
  },
  {
    id: 'module-2',
    number: 2,
    title: 'Essential Tools Setup',
    description: 'Get started with the tools you need to create professional AI videos.',
    duration: '5 min',
    durationMinutes: 5,
    wistiaId: '511b44q25r',
    thumbnail: 'https://embed-ssl.wistia.com/deliveries/d1ce9f38c9a06f3e45c729fca84ce46c.jpg?image_crop_resized=640x360',
    lessons: [
      'Setting up Google Flow',
      'Choosing the right settings',
      'Uploading your photo',
      'Creating your first video',
    ],
    resources: [
      { name: 'Google Flow', url: 'https://labs.google/fx/tools/flow', type: 'link' },
    ],
  },
  {
    id: 'module-3',
    number: 3,
    title: 'Make Any Photo Talk',
    description: 'Transform any photo into a realistic talking video with zero filming required.',
    duration: '6 min',
    durationMinutes: 6,
    wistiaId: '7jtqmnymc5',
    thumbnail: 'https://embed-ssl.wistia.com/deliveries/83119c3f57c222f7730b0e68d78ac68b.jpg?image_crop_resized=640x360',
    lessons: [
      'Selecting the perfect photo',
      'Adding your script',
      'Generating the video',
      'Downloading and sharing',
    ],
    resources: [],
  },
  {
    id: 'module-4',
    number: 4,
    title: 'Edit Videos Like a Pro',
    description: 'Learn to edit and polish your AI videos quickly using CapCut.',
    duration: '4 min',
    durationMinutes: 4,
    wistiaId: '9waf0llex7',
    thumbnail: 'https://embed-ssl.wistia.com/deliveries/bc1f648d68653d130c361ff13c23d5d5.jpg?image_crop_resized=640x360',
    lessons: [
      'CapCut basics',
      'Adding captions',
      'Trimming and transitions',
      'Exporting for social media',
    ],
    resources: [
      { name: 'CapCut', url: 'https://www.capcut.com', type: 'link' },
    ],
  },
  {
    id: 'module-5',
    number: 5,
    title: 'Create Multiple AI Images',
    description: 'Generate multiple professional images of yourself for endless content variety.',
    duration: '5 min',
    durationMinutes: 5,
    wistiaId: '9f7os4xklp',
    thumbnail: 'https://embed-ssl.wistia.com/deliveries/9c4bcaeb1d38ebde45ed0dde686eba57.jpg?image_crop_resized=640x360',
    lessons: [
      'Using AI image generation',
      'Different poses and settings',
      'Creating variety in your content',
      'Best practices for realism',
    ],
    resources: [],
  },
]

// ============================================
// BONUSES - 10 Premium Bonuses with Black & Gold Design
// ============================================

const bonuses: Bonus[] = [
  {
    id: 'bonus-100-viral',
    name: '100 Viral Video Scripts',
    value: 497,
    icon: FileText,
    description: 'Ready-to-use viral scripts that grab attention and drive engagement. Just copy, paste, and record.',
    category: 'Scripts',
    url: '/bonuses/100-viral-video-scripts.html',
    image: '/images/bonuses/100-viral.jpeg',
  },
  {
    id: 'bonus-15k-cases',
    name: '15,000+ Case Studies',
    value: 397,
    icon: TrendingUp,
    description: 'Massive library of proven case studies and success stories to inspire your content.',
    category: 'Templates',
    url: '/bonuses/case-studies-vault.html',
    image: '/images/bonuses/15k-cases.jpeg',
  },
  {
    id: 'bonus-365-content',
    name: '365 Days of Content',
    value: 297,
    icon: Layout,
    description: 'Never run out of ideas. A full year of content planned and ready to create.',
    category: 'Templates',
    url: '/bonuses/365-content-planner.html',
    image: '/images/bonuses/365-content.jpeg',
  },
  {
    id: 'bonus-5-stars',
    name: '5-Star Review System',
    value: 197,
    icon: Star,
    description: 'The exact system to collect and showcase 5-star reviews that build trust.',
    category: 'Tools',
    url: '/bonuses/5-star-review-system.html',
    image: '/images/bonuses/5-stars-review.jpeg',
  },
  {
    id: 'bonus-ai-generator',
    name: 'AI Content Generator',
    value: 397,
    icon: Brain,
    description: 'Powerful AI prompts and templates to generate unlimited content ideas instantly.',
    category: 'Tools',
    url: '/bonuses/ai-content-generator-prompts.html',
    image: '/images/bonuses/ai-content-generator.jpeg',
  },
  {
    id: 'bonus-before-after',
    name: 'Before & After System',
    value: 247,
    icon: Camera,
    description: 'Showcase transformations professionally with our proven before/after framework.',
    category: 'Templates',
    url: '/bonuses/before-after-system.html',
    image: '/images/bonuses/before-after-system.jpeg',
  },
  {
    id: 'bonus-phone-scripts',
    name: 'Phone Scripts Collection',
    value: 197,
    icon: Mic,
    description: 'Word-for-word scripts for calls that convert prospects into paying clients.',
    category: 'Scripts',
    url: '/bonuses/phone-scripts-that-book.html',
    image: '/images/bonuses/phone-scripts.jpeg',
  },
  {
    id: 'bonus-referral',
    name: 'Referral Machine System',
    value: 297,
    icon: Users,
    description: 'Turn happy clients into a steady stream of referrals on autopilot.',
    category: 'Tools',
    url: '/bonuses/referral-machine-system.html',
    image: '/images/bonuses/referral-machine.jpeg',
  },
  {
    id: 'bonus-objections',
    name: 'Turn No Into Yes',
    value: 197,
    icon: Target,
    description: 'Master objection handling with scripts that turn hesitation into commitment.',
    category: 'Scripts',
    url: '/bonuses/turn-no-into-yes.html',
    image: '/images/bonuses/turn-no-into-yes.jpeg',
  },
  {
    id: 'bonus-offer-funnel',
    name: 'Offer Funnel Blueprint',
    value: 497,
    icon: Crown,
    description: 'Complete blueprint for creating irresistible offers that convert browsers into buyers.',
    category: 'Tools',
    url: '/bonuses/offer-funnel-blueprint.html',
    image: '/images/bonuses/vip-concierge.jpeg',
  },
]

// ============================================
// ACHIEVEMENTS
// ============================================

const achievements: Achievement[] = [
  {
    id: 'first-video',
    name: 'First Steps',
    description: 'Complete your first module',
    icon: Rocket,
    tier: 'bronze',
    points: 10,
  },
  {
    id: 'halfway',
    name: 'Halfway There',
    description: 'Complete 50% of the course',
    icon: Target,
    tier: 'silver',
    points: 25,
  },
  {
    id: 'graduate',
    name: 'Graduate',
    description: 'Complete the entire course',
    icon: Award,
    tier: 'gold',
    points: 50,
  },
  {
    id: 'bonus-hunter',
    name: 'Bonus Hunter',
    description: 'Download all bonuses',
    icon: Gift,
    tier: 'silver',
    points: 20,
  },
  {
    id: 'streak-3',
    name: 'On Fire',
    description: 'Maintain a 3-day learning streak',
    icon: Flame,
    tier: 'bronze',
    points: 15,
  },
  {
    id: 'streak-7',
    name: 'Week Warrior',
    description: 'Maintain a 7-day learning streak',
    icon: Flame,
    tier: 'silver',
    points: 30,
  },
  {
    id: 'speed-learner',
    name: 'Speed Learner',
    description: 'Complete 3 modules in one session',
    icon: Zap,
    tier: 'silver',
    points: 25,
  },
  {
    id: 'dedicated',
    name: 'Dedicated Student',
    description: 'Spend 60+ minutes learning',
    icon: Clock,
    tier: 'bronze',
    points: 15,
  },
  {
    id: 'note-taker',
    name: 'Note Taker',
    description: 'Add notes to 3 different modules',
    icon: BookOpen,
    tier: 'bronze',
    points: 10,
  },
  {
    id: 'perfectionist',
    name: 'Perfectionist',
    description: 'Earn all achievements',
    icon: Crown,
    tier: 'gold',
    points: 100,
  },
]

// ============================================
// COMING SOON COURSES
// ============================================

const comingSoonCourses: ComingSoonCourse[] = [
  {
    id: 'advanced-ai',
    title: 'Advanced AI Mastery',
    subtitle: 'Next-Level Techniques',
    description: 'Deep dive into advanced AI video features, voice cloning, and automation.',
    icon: Brain,
    color: 'from-purple-500 to-indigo-500',
    features: ['Voice Cloning', 'API Automation', 'Batch Processing', 'Custom Avatars'],
    estimatedLaunch: 'Q2 2025',
    waitlistCount: 847,
    price: 497,
  },
  {
    id: 'ads-mastery',
    title: 'Video Ads Mastery',
    subtitle: 'Paid Traffic Secrets',
    description: 'Turn your AI videos into high-converting ads on Facebook, YouTube, and TikTok.',
    icon: DollarSign,
    color: 'from-green-500 to-emerald-500',
    features: ['Facebook Ads', 'YouTube Ads', 'TikTok Ads', 'Retargeting'],
    estimatedLaunch: 'Q2 2025',
    waitlistCount: 623,
    price: 397,
  },
  {
    id: 'content-empire',
    title: 'Content Empire',
    subtitle: 'Scale to 7 Figures',
    description: 'Build a content team and systems to produce 100+ videos per month.',
    icon: Globe,
    color: 'from-amber-500 to-orange-500',
    features: ['Team Building', 'SOPs', 'Outsourcing', 'Quality Control'],
    estimatedLaunch: 'Q3 2025',
    waitlistCount: 412,
    price: 697,
  },
]

// ============================================
// KEYBOARD SHORTCUTS
// ============================================

const keyboardShortcuts: KeyboardShortcut[] = [
  { key: 'Space', action: 'Play/Pause video' },
  { key: '←/→', action: 'Seek backward/forward 10s' },
  { key: 'M', action: 'Mark module complete' },
  { key: 'N', action: 'Next module' },
  { key: 'P', action: 'Previous module' },
  { key: 'D', action: 'Go to Dashboard' },
  { key: 'C', action: 'Go to Course' },
  { key: 'B', action: 'Go to Bonuses' },
  { key: 'A', action: 'Go to Achievements' },
  { key: '?', action: 'Show keyboard shortcuts' },
]

// ============================================
// AUTH CONFIG - Universal + Accept Old Product IDs
// ============================================

const auth: AuthConfig = {
  product: 'clone-yourself-pro', // New universal product ID
  legacyPassword: 'scalemybusiness2024',
  legacyEnabled: true,
  vipGuests: [
    {
      id: 'vip-demo',
      name: 'Demo User',
      password: 'demo2024',
      welcomeMessage: 'Welcome to your demo access!',
      badge: 'Demo',
    },
  ],
  whopCheckoutLink: 'https://whop.com/clone-yourself-pro/',
  authStorageKey: 'members_auth',
}

// All accepted product IDs for login (old + new)
// Includes both database format and legacy format
export const acceptedProductIds = [
  'clone-yourself-pro',        // New universal
  'clone-yourself-lawyers',    // Legacy - lawyers
  'clone-yourself-dentists',   // Legacy - dentists
  'clone-yourself-psychologists', // Legacy - psychologists
  'clone-yourself-plastic-surgeons', // Legacy - plastic surgeons
  // Database format (actual stored values)
  'dentist',
  'lawyer',
  'psychologist',
  'plastic-surgeon',
]

// ============================================
// MAIN CONFIG EXPORT
// ============================================

export const universalConfig: NicheConfig = {
  // Identity
  slug: 'lawyers', // Keep for type compatibility, but not used
  title: 'CloneYourself',
  subtitle: 'AI Video Mastery',
  supportEmail: 'support@aifastscale.com',

  // Theme
  theme,

  // Expert (hidden/minimal)
  expert,

  // Welcome
  welcomeVideo,
  socialProof,
  memberStats,

  // Content
  modules,
  bonuses,
  achievements,
  comingSoonCourses,
  keyboardShortcuts,

  // Auth
  auth,
  blockedUsers: [],
  devAutoLogin: process.env.NODE_ENV === 'development',

  // Storage - Universal prefix
  storagePrefix: 'members_v1_',
}

// Old storage prefixes for migration
export const oldStoragePrefixes = [
  'lawyer_v4_',
  'dentist_v4_',
  'psychologist_v4_',
  'plastic_surgeon_v4_',
]
