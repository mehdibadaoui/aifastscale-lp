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
    title: 'Getting Started with AI Video',
    description: 'Set up your account and create your first AI-powered video in minutes.',
    duration: '8 min',
    durationMinutes: 8,
    wistiaId: 'fnjt6devuy',
    thumbnail: null,
    lessons: [
      'Create your HeyGen account',
      'Navigate the dashboard',
      'Upload your first avatar photo',
      'Generate your AI clone',
    ],
    resources: [
      { name: 'Quick Start Guide', url: '/resources/quick-start.pdf', type: 'file' },
      { name: 'HeyGen Account Setup', url: 'https://heygen.com', type: 'link' },
    ],
  },
  {
    id: 'module-2',
    number: 2,
    title: 'Crafting Perfect Scripts',
    description: 'Learn the proven formula for writing scripts that convert viewers into clients.',
    duration: '12 min',
    durationMinutes: 12,
    wistiaId: '511b44q25r',
    thumbnail: null,
    lessons: [
      'The hook-story-offer framework',
      'Writing for AI voice delivery',
      'Emotional triggers that work',
      'Call-to-action best practices',
    ],
    resources: [
      { name: 'Script Templates', url: '/resources/script-templates.pdf', type: 'file' },
    ],
  },
  {
    id: 'module-3',
    number: 3,
    title: 'Professional Video Production',
    description: 'Transform your AI videos into polished, professional content.',
    duration: '15 min',
    durationMinutes: 15,
    wistiaId: '7jtqmnymc5',
    thumbnail: null,
    lessons: [
      'Choosing the right avatar settings',
      'Background and lighting tips',
      'Adding captions and graphics',
      'Export settings for each platform',
    ],
    resources: [
      { name: 'Video Checklist', url: '/resources/video-checklist.pdf', type: 'file' },
    ],
  },
  {
    id: 'module-4',
    number: 4,
    title: 'Social Media Distribution',
    description: 'Get your videos in front of your ideal audience on every platform.',
    duration: '10 min',
    durationMinutes: 10,
    wistiaId: '9waf0llex7',
    thumbnail: null,
    lessons: [
      'Platform-specific formatting',
      'Best posting times',
      'Hashtag strategies',
      'Engagement tactics',
    ],
    resources: [
      { name: 'Platform Guide', url: '/resources/platform-guide.pdf', type: 'file' },
    ],
  },
  {
    id: 'module-5',
    number: 5,
    title: 'Advanced AI Techniques',
    description: 'Take your AI videos to the next level with advanced features and workflows.',
    duration: '14 min',
    durationMinutes: 14,
    wistiaId: '9f7os4xklp',
    thumbnail: null,
    lessons: [
      'Multi-avatar videos',
      'Voice cloning setup',
      'Batch video creation',
      'API automation basics',
    ],
    resources: [
      { name: 'Advanced Workflows', url: '/resources/advanced-workflows.pdf', type: 'file' },
    ],
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
    url: '/bonuses/100-viral-scripts.pdf',
    image: '/images/bonuses/100-viral.jpeg',
  },
  {
    id: 'bonus-15k-cases',
    name: '15,000+ Case Studies',
    value: 397,
    icon: TrendingUp,
    description: 'Massive library of proven case studies and success stories to inspire your content.',
    category: 'Templates',
    url: '/bonuses/15k-cases.pdf',
    image: '/images/bonuses/15k-cases.jpeg',
  },
  {
    id: 'bonus-365-content',
    name: '365 Days of Content',
    value: 297,
    icon: Layout,
    description: 'Never run out of ideas. A full year of content planned and ready to create.',
    category: 'Templates',
    url: '/bonuses/365-content.pdf',
    image: '/images/bonuses/365-content.jpeg',
  },
  {
    id: 'bonus-5-stars',
    name: '5-Star Review System',
    value: 197,
    icon: Star,
    description: 'The exact system to collect and showcase 5-star reviews that build trust.',
    category: 'Tools',
    url: '/bonuses/5-star-review.pdf',
    image: '/images/bonuses/5-stars-review.jpeg',
  },
  {
    id: 'bonus-ai-generator',
    name: 'AI Content Generator',
    value: 397,
    icon: Brain,
    description: 'Powerful AI prompts and templates to generate unlimited content ideas instantly.',
    category: 'Tools',
    url: '/bonuses/ai-generator.pdf',
    image: '/images/bonuses/ai-content-generator.jpeg',
  },
  {
    id: 'bonus-before-after',
    name: 'Before & After System',
    value: 247,
    icon: Camera,
    description: 'Showcase transformations professionally with our proven before/after framework.',
    category: 'Templates',
    url: '/bonuses/before-after.pdf',
    image: '/images/bonuses/before-after-system.jpeg',
  },
  {
    id: 'bonus-phone-scripts',
    name: 'Phone Scripts Collection',
    value: 197,
    icon: Mic,
    description: 'Word-for-word scripts for calls that convert prospects into paying clients.',
    category: 'Scripts',
    url: '/bonuses/phone-scripts.pdf',
    image: '/images/bonuses/phone-scripts.jpeg',
  },
  {
    id: 'bonus-referral',
    name: 'Referral Machine System',
    value: 297,
    icon: Users,
    description: 'Turn happy clients into a steady stream of referrals on autopilot.',
    category: 'Tools',
    url: '/bonuses/referral-machine.pdf',
    image: '/images/bonuses/referral-machine.jpeg',
  },
  {
    id: 'bonus-objections',
    name: 'Turn No Into Yes',
    value: 197,
    icon: Target,
    description: 'Master objection handling with scripts that turn hesitation into commitment.',
    category: 'Scripts',
    url: '/bonuses/turn-no-yes.pdf',
    image: '/images/bonuses/turn-no-into-yes.jpeg',
  },
  {
    id: 'bonus-vip',
    name: 'VIP Concierge System',
    value: 497,
    icon: Crown,
    description: 'Create a premium experience that commands premium prices. White-glove service blueprint.',
    category: 'Tools',
    url: '/bonuses/vip-concierge.pdf',
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
export const acceptedProductIds = [
  'clone-yourself-pro',        // New universal
  'clone-yourself-lawyers',    // Old - lawyers
  'clone-yourself-dentists',   // Old - dentists
  'clone-yourself-psychologists', // Old - psychologists
  'clone-yourself-plastic-surgeons', // Old - plastic surgeons
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
