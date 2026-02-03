// ============================================
// UNIFIED MEMBERS PLATFORM - TYPE DEFINITIONS
// ============================================

import { LucideIcon } from 'lucide-react'

// Valid niche slugs
export type NicheSlug = 'lawyers' | 'dentists' | 'psychologists' | 'plastic-surgeons'

// Theme configuration
export interface ThemeConfig {
  // Primary colors (Tailwind class names without 'from-'/'to-' prefix)
  primary: string        // e.g., 'amber-500'
  primaryLight: string   // e.g., 'yellow-500'
  accent: string         // e.g., 'orange-500'

  // CSS custom properties for glow effects
  glowColor: string      // e.g., 'rgba(212, 175, 55, 0.3)'
  glowColorLg: string    // e.g., 'rgba(212, 175, 55, 0.4)'

  // Gradient classes
  btnGradient: string    // e.g., 'from-amber-500 to-yellow-500'
  heroGradient: string   // e.g., 'from-amber-500/15 to-yellow-500/10'
}

// Expert/Instructor information
export interface ExpertConfig {
  name: string
  title: string
  image: string
  quote: string
}

// Welcome video configuration
export interface WelcomeVideoConfig {
  wistiaId: string
  title: string
  duration: string
}

// Social proof numbers
export interface SocialProofConfig {
  studentCount: number
  rating: number
  reviewCount: number
  countriesServed: number
}

// Member stats configuration for dynamic counts
export interface MemberStatsConfig {
  baseMembers: number
  startDate: Date
  dailyGrowthMin: number
  dailyGrowthMax: number
  activeMin: number
  activeMax: number
  seedOffset: number  // Different for each niche to vary counts
}

// Course module definition
export interface CourseModule {
  id: string
  number: number
  title: string
  description: string
  duration: string
  durationMinutes: number
  wistiaId: string | null
  thumbnail: string | null
  lessons: string[]
  resources: ModuleResource[]
  comingSoon?: boolean
}

export interface ModuleResource {
  name: string
  url: string
  type: 'link' | 'file' | 'folder'
  description?: string // Optional one-line description of the resource
  timestamp?: string   // Optional timestamp (e.g., "4:32") when mentioned in video
}

// Bonus definition
export interface Bonus {
  id: string
  name: string
  value: number
  icon: LucideIcon
  description: string
  category: string
  url: string
  image: string
  isFreeBonus?: boolean
}

// Achievement definition
export interface Achievement {
  id: string
  name: string
  description: string
  icon: LucideIcon
  tier: 'bronze' | 'silver' | 'gold'
  points: number
}

// Coming soon course definition
export interface ComingSoonCourse {
  id: string
  title: string
  subtitle: string
  description: string
  icon: LucideIcon
  color: string
  features: string[]
  estimatedLaunch: string
  waitlistCount: number
  price: number
}

// VIP Guest configuration
export interface VipGuest {
  id: string
  name: string
  password: string
  welcomeMessage: string
  badge: string
}

// Auth configuration
export interface AuthConfig {
  product: string              // Product identifier for user-db
  legacyPassword: string       // Legacy shared password
  legacyEnabled: boolean       // Whether legacy login is enabled
  vipGuests: VipGuest[]        // VIP guest accounts
  whopCheckoutLink: string     // Checkout link for blocked users
  authStorageKey: string       // localStorage key for auth state
}

// Keyboard shortcut
export interface KeyboardShortcut {
  key: string
  action: string
}

// Main niche configuration
export interface NicheConfig {
  // Identity
  slug: NicheSlug
  title: string           // e.g., 'CloneYourself'
  subtitle: string        // e.g., 'for Lawyers'
  supportEmail: string

  // Theme
  theme: ThemeConfig

  // Expert/Instructor
  expert: ExpertConfig

  // Welcome
  welcomeVideo: WelcomeVideoConfig
  socialProof: SocialProofConfig
  memberStats: MemberStatsConfig

  // Content
  modules: CourseModule[]
  bonuses: Bonus[]
  achievements: Achievement[]
  comingSoonCourses: ComingSoonCourse[]
  keyboardShortcuts: KeyboardShortcut[]

  // Auth
  auth: AuthConfig
  blockedUsers: string[]
  devAutoLogin: boolean

  // Storage
  storagePrefix: string   // e.g., 'lawyer_v4_'
}

// Video progress tracking
export interface VideoProgress {
  percent: number
  seconds: number
}

// Platform state interface
export interface PlatformState {
  // Auth
  isAuthenticated: boolean
  isBlocked: boolean
  isLoggingIn: boolean
  loginError: string | null

  // Navigation
  activeSection: 'dashboard' | 'course' | 'bonuses' | 'achievements' | 'tracker' | 'resources'
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
  studentName: string
  videoTimestampBookmarks: Record<string, { seconds: number; label: string }[]>
  waitlistedCourses: string[]
  vipGuest: { id: string; name: string; badge: string; welcomeMessage: string } | null

  // Settings
  darkMode: boolean
  autoPlayNext: boolean
  showCompletedBadge: boolean
  soundEnabled: boolean
  reducedMotion: boolean

  // UI state
  showConfetti: boolean
  showWelcome: boolean
  showAchievementToast: string | null
  showLogoutConfirm: boolean
  showNotesModal: boolean
  showKeyboardModal: boolean
  showSettingsModal: boolean
  showCertificateModal: boolean
  showOnboarding: boolean
}

// Helper to calculate dynamic member stats
export function getMemberStats(config: MemberStatsConfig) {
  const now = new Date()
  const daysSinceStart = Math.floor(
    (now.getTime() - config.startDate.getTime()) / (1000 * 60 * 60 * 24)
  )

  // Seeded random for consistent daily values
  const seededRandom = (seed: number): number => {
    const x = Math.sin(seed) * 10000
    return x - Math.floor(x)
  }

  // Calculate total members (base + daily growth)
  let totalMembers = config.baseMembers
  for (let i = 0; i < Math.max(0, daysSinceStart); i++) {
    const daySeed = i + config.seedOffset
    const dailyGrowth = Math.floor(
      config.dailyGrowthMin +
      seededRandom(daySeed) * (config.dailyGrowthMax - config.dailyGrowthMin)
    )
    totalMembers += dailyGrowth
  }

  // Calculate active users (fluctuates smoothly within fixed range)
  const minuteOfDay = now.getHours() * 60 + now.getMinutes()
  const daySeed = now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate()

  const wavePosition = Math.sin((minuteOfDay / 1440) * Math.PI * 4)
  const baseActive = (config.activeMin + config.activeMax) / 2
  const amplitude = (config.activeMax - config.activeMin) / 2

  const variance = seededRandom(daySeed + Math.floor(minuteOfDay / 5)) * 100 - 50

  const activeNowRaw = Math.floor(baseActive + (wavePosition * amplitude * 0.7) + variance)
  const activeNow = Math.min(activeNowRaw, totalMembers)
  const activePercent = Math.round((activeNow / totalMembers) * 100)

  const todaySeed = now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate()
  const todayFullGrowth = Math.floor(
    config.dailyGrowthMin +
    seededRandom(todaySeed) * (config.dailyGrowthMax - config.dailyGrowthMin)
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

// Helper to compute derived values
export function computeDerivedConfig(config: NicheConfig) {
  const availableModules = config.modules.filter(m => !m.comingSoon)
  const totalRuntime = availableModules.reduce((acc, m) => acc + m.durationMinutes, 0)
  const totalBonusValue = config.bonuses.reduce((acc, b) => acc + b.value, 0)
  const bonusCategories = ['All', ...Array.from(new Set(config.bonuses.map(b => b.category)))]

  return {
    availableModules,
    totalRuntime,
    totalBonusValue,
    bonusCategories,
  }
}
