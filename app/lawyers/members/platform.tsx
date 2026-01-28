'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import {
  Play, CheckCircle, Lock, Trophy, Gift, Star, Crown, Zap,
  ChevronRight, ChevronDown, Clock, BookOpen, Download,
  Sun, Moon, Menu, X, Award, Target, Flame, Heart,
  Sparkles, Users, TrendingUp, ArrowRight, Volume2,
  CircleCheck, Circle, Settings, LogOut, Home, Video,
  FileText, Lightbulb, MessageCircle, Coffee, Rocket,
  PartyPopper, Medal, GraduationCap, Brain, Gem
} from 'lucide-react'

// ============================================
// CONFIGURATION - Easy to update
// ============================================

const COURSE_CONFIG = {
  title: "AI Video Mastery",
  subtitle: "for Lawyers",
  description: "Transform your law practice with AI-powered video marketing",
  password: "im the best lawyer in the world",
}

// DEV MODE: Auto-login for testing (set to false for production)
const DEV_AUTO_LOGIN = true

// Resource types for courses
type CourseResource = {
  name: string;
  url: string;
  type: 'link' | 'file' | 'folder';
}

// Course modules with Wistia IDs and resources
const COURSE_MODULES = [
  {
    id: 'module-1',
    title: 'Welcome & Quick Start',
    description: 'Your roadmap to creating AI videos that attract clients',
    duration: '8 min',
    wistiaId: 'myh13ayp9d',
    thumbnail: '/images/lawyer/course-1.webp',
    lessons: ['Course overview', 'Setting expectations', 'Your 7-day action plan'],
    resources: [
      { name: 'Alex Morgan Legal Growth Mentor GPT', url: 'https://chatgpt.com/g/g-69777dcea0008191ac576005a41fdeed-alex-morgan-legal-growth-mentor', type: 'link' as const },
    ],
  },
  {
    id: 'module-2',
    title: 'Accounts Setup',
    description: 'Get your accounts ready and configured perfectly',
    duration: '12 min',
    wistiaId: 'fnjt6devuy',
    thumbnail: '/images/lawyer/course-2.webp',
    lessons: ['Google AI Pro setup', 'Google Flow setup', 'Account configuration'],
    resources: [
      { name: 'Google AI Pro (1-month free trial)', url: 'https://one.google.com/about/google-ai-plans/', type: 'link' as const },
      { name: 'Google Flow (AI Video Tool)', url: 'https://labs.google/flow/about', type: 'link' as const },
    ],
  },
  {
    id: 'module-3',
    title: 'Make Any Photo Talk',
    description: 'Step-by-step: from script to stunning video in 7 minutes',
    duration: '15 min',
    wistiaId: '511b44q25r',
    thumbnail: '/images/lawyer/course-3.webp',
    lessons: ['Writing magnetic scripts', 'Recording your video', 'Export & optimization'],
    resources: [
      { name: 'Lawyer AI Talking Video Prompt (Universal)', url: '/products/lawyer/Lawyer_AI_Talking_Video_Prompt_Universal.pdf', type: 'file' as const },
    ],
  },
  {
    id: 'module-4',
    title: 'Advanced Video Techniques',
    description: 'Pro tips to make your videos stand out from competitors',
    duration: '10 min',
    wistiaId: '7jtqmnymc5',
    thumbnail: '/images/lawyer/course-4.webp',
    lessons: ['Multi-scene videos', 'B-roll integration', 'Professional editing'],
    resources: [
      { name: 'Background Music Collection', url: '/products/lawyer/Background music/', type: 'folder' as const },
    ],
  },
  {
    id: 'module-5',
    title: 'Client Attraction System',
    description: 'Turn views into signed retainers with proven strategies',
    duration: '14 min',
    wistiaId: '9waf0llex7',
    thumbnail: '/images/lawyer/course-5.webp',
    lessons: ['Video distribution', 'Social media strategy', 'Lead capture funnels'],
    resources: [],
  },
  {
    id: 'module-6',
    title: 'Scaling & Automation',
    description: 'Build a content machine that runs on autopilot',
    duration: '11 min',
    wistiaId: '9f7os4xklp',
    thumbnail: '/images/lawyer/course-6.webp',
    lessons: ['Batch creation', 'Content calendar', 'Outsourcing tips'],
    resources: [],
  },
]

// Bonuses - placeholder for your actual bonuses
const BONUSES = [
  { id: 'bonus-1', name: '100 Viral Legal Scripts', value: 97, icon: FileText, description: 'Copy-paste scripts that go viral', file: null },
  { id: 'bonus-2', name: '365-Day Content Calendar', value: 197, icon: Target, description: 'Never run out of content ideas', file: null },
  { id: 'bonus-3', name: 'High-Converting Website Template', value: 297, icon: Rocket, description: 'Proven law firm website blueprint', file: null },
  { id: 'bonus-4', name: 'Case Value Calculator Tool', value: 47, icon: TrendingUp, description: 'Find hidden profits in your practice', file: null },
  { id: 'bonus-5', name: 'Client Intake Scripts', value: 67, icon: MessageCircle, description: 'Convert more calls to retainers', file: null },
  { id: 'bonus-6', name: 'Legal Forms Bundle', value: 47, icon: FileText, description: 'Professional intake forms', file: null },
  { id: 'bonus-7', name: 'Referral Machine System', value: 97, icon: Users, description: 'Turn clients into referrals', file: null },
  { id: 'bonus-8', name: 'AI Content Generator', value: 147, icon: Brain, description: '500+ legal AI prompts', file: null },
  { id: 'bonus-9', name: '5-Star Review System', value: 97, icon: Star, description: 'Get 15+ reviews monthly', file: null },
  { id: 'bonus-10', name: 'Case Study Kit', value: 77, icon: Sparkles, description: 'Viral transformation content', file: null },
]

// Motivational quotes for different progress levels
const MOTIVATIONAL_QUOTES = [
  { threshold: 0, quote: "Every expert was once a beginner. Let's start your journey!", author: "Your AI Coach" },
  { threshold: 20, quote: "You're making progress! Keep that momentum going.", author: "Your AI Coach" },
  { threshold: 50, quote: "Halfway there! You're doing amazing.", author: "Your AI Coach" },
  { threshold: 80, quote: "Almost a master! Just a few more steps.", author: "Your AI Coach" },
  { threshold: 100, quote: "You did it! Now go attract those clients!", author: "Your AI Coach" },
]

// Achievement badges
const ACHIEVEMENTS = [
  { id: 'first-lesson', name: 'First Steps', icon: Rocket, description: 'Complete your first lesson', condition: (completed: string[]) => completed.length >= 1 },
  { id: 'three-lessons', name: 'On Fire', icon: Flame, description: 'Complete 3 lessons', condition: (completed: string[]) => completed.length >= 3 },
  { id: 'halfway', name: 'Halfway Hero', icon: Medal, description: 'Complete 50% of course', condition: (completed: string[], total: number) => completed.length >= total / 2 },
  { id: 'course-complete', name: 'AI Video Master', icon: Crown, description: 'Complete the entire course', condition: (completed: string[], total: number) => completed.length >= total },
  { id: 'bonus-explorer', name: 'Bonus Explorer', icon: Gift, description: 'Download your first bonus', condition: (completed: string[]) => completed.some(c => c.startsWith('bonus-')) },
]

// ============================================
// COMPONENTS
// ============================================

// Theme Toggle Component
function ThemeToggle({ isDark, onToggle }: { isDark: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={`relative w-14 h-7 rounded-full transition-all duration-300 ${
        isDark ? 'bg-slate-700' : 'bg-amber-100'
      }`}
      aria-label="Toggle theme"
    >
      <div className={`absolute top-0.5 w-6 h-6 rounded-full transition-all duration-300 flex items-center justify-center ${
        isDark ? 'left-7 bg-slate-900' : 'left-0.5 bg-white shadow-md'
      }`}>
        {isDark ? (
          <Moon className="w-3.5 h-3.5 text-amber-400" />
        ) : (
          <Sun className="w-3.5 h-3.5 text-amber-500" />
        )}
      </div>
    </button>
  )
}

// Progress Ring Component
function ProgressRing({ progress, size = 120, strokeWidth = 8, isDark }: {
  progress: number;
  size?: number;
  strokeWidth?: number;
  isDark: boolean;
}) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (progress / 100) * circumference

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          stroke={isDark ? '#334155' : '#e2e8f0'}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          stroke="url(#progressGradient)"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
        />
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#d4af37" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
          {Math.round(progress)}%
        </span>
        <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Complete</span>
      </div>
    </div>
  )
}

// Wistia Video Player Component
function WistiaPlayer({ wistiaId, onComplete, isDark }: {
  wistiaId: string;
  onComplete?: () => void;
  isDark: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Clear previous content
    containerRef.current.innerHTML = ''

    // Create and add Wistia embed
    const wistiaDiv = document.createElement('div')
    wistiaDiv.className = `wistia_embed wistia_async_${wistiaId} videoFoam=true`
    wistiaDiv.style.height = '100%'
    wistiaDiv.style.width = '100%'
    containerRef.current.appendChild(wistiaDiv)

    // Load Wistia script if not already loaded
    if (!document.querySelector('script[src*="wistia.com/assets/external/E-v1.js"]')) {
      const script = document.createElement('script')
      script.src = 'https://fast.wistia.com/assets/external/E-v1.js'
      script.async = true
      document.head.appendChild(script)
    }

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = ''
      }
    }
  }, [wistiaId])

  return (
    <div className={`relative rounded-2xl overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
      <div
        ref={containerRef}
        className="aspect-video w-full"
      />
    </div>
  )
}

// Module Card Component
function ModuleCard({
  module,
  index,
  isCompleted,
  isActive,
  isLocked,
  onClick,
  isDark
}: {
  module: typeof COURSE_MODULES[0];
  index: number;
  isCompleted: boolean;
  isActive: boolean;
  isLocked: boolean;
  onClick: () => void;
  isDark: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={isLocked || module.comingSoon}
      className={`w-full text-left p-4 rounded-xl transition-all duration-300 group ${
        isActive
          ? isDark
            ? 'bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border-2 border-amber-500 shadow-lg shadow-amber-500/20'
            : 'bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-500 shadow-lg shadow-amber-500/10'
          : isCompleted
            ? isDark
              ? 'bg-slate-800/50 border border-amber-500/50 hover:border-amber-500'
              : 'bg-white border border-amber-200 hover:border-amber-400 shadow-sm'
            : isLocked || module.comingSoon
              ? isDark
                ? 'bg-slate-800/30 border border-slate-700 opacity-60 cursor-not-allowed'
                : 'bg-slate-50 border border-slate-200 opacity-60 cursor-not-allowed'
              : isDark
                ? 'bg-slate-800/50 border border-slate-700 hover:border-amber-500/50 hover:bg-slate-800'
                : 'bg-white border border-slate-200 hover:border-amber-300 hover:shadow-md shadow-sm'
      }`}
    >
      <div className="flex items-start gap-4">
        {/* Module Number / Status */}
        <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${
          isCompleted
            ? 'bg-gradient-to-br from-amber-500 to-yellow-500 text-white'
            : isActive
              ? 'bg-gradient-to-br from-amber-500 to-yellow-500 text-white'
              : module.comingSoon
                ? isDark ? 'bg-slate-700 text-slate-500' : 'bg-slate-200 text-slate-400'
                : isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'
        }`}>
          {isCompleted ? (
            <CheckCircle className="w-6 h-6" />
          ) : module.comingSoon ? (
            <Lock className="w-5 h-5" />
          ) : (
            index + 1
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className={`font-bold truncate ${
              isDark ? 'text-white' : 'text-slate-900'
            } ${isActive ? 'text-amber-500' : ''}`}>
              {module.title}
            </h3>
            {module.comingSoon && (
              <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-amber-500/20 text-amber-500">
                Soon
              </span>
            )}
          </div>
          <p className={`text-sm mb-2 line-clamp-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            {module.description}
          </p>
          <div className="flex items-center gap-3">
            <span className={`flex items-center gap-1 text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              <Clock className="w-3.5 h-3.5" />
              {module.duration}
            </span>
            <span className={`flex items-center gap-1 text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              <BookOpen className="w-3.5 h-3.5" />
              {module.lessons.length} lessons
            </span>
          </div>
        </div>

        {/* Arrow */}
        {!module.comingSoon && !isLocked && (
          <ChevronRight className={`w-5 h-5 flex-shrink-0 transition-transform group-hover:translate-x-1 ${
            isDark ? 'text-slate-500' : 'text-slate-400'
          } ${isActive ? 'text-amber-500' : ''}`} />
        )}
      </div>
    </button>
  )
}

// Bonus Card Component
function BonusCard({
  bonus,
  isUnlocked,
  onClick,
  isDark
}: {
  bonus: typeof BONUSES[0];
  isUnlocked: boolean;
  onClick: () => void;
  isDark: boolean;
}) {
  const Icon = bonus.icon

  return (
    <div className={`p-4 rounded-xl transition-all duration-300 ${
      isDark
        ? 'bg-slate-800/50 border border-slate-700 hover:border-amber-500/50'
        : 'bg-white border border-slate-200 hover:border-amber-300 shadow-sm hover:shadow-md'
    }`}>
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
          isDark ? 'bg-amber-500/20' : 'bg-amber-50'
        }`}>
          <Icon className="w-5 h-5 text-amber-500" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className={`font-bold text-sm mb-0.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {bonus.name}
          </h4>
          <p className={`text-xs mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            {bonus.description}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-amber-500">
              Value: ${bonus.value}
            </span>
            {bonus.file ? (
              <button
                onClick={onClick}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-gradient-to-r from-amber-500 to-yellow-500 text-white hover:opacity-90 transition-opacity"
              >
                <Download className="w-3.5 h-3.5" />
                Download
              </button>
            ) : (
              <span className={`text-xs px-2 py-1 rounded-full ${
                isDark ? 'bg-slate-700 text-slate-400' : 'bg-slate-100 text-slate-500'
              }`}>
                Coming soon
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Achievement Badge Component
function AchievementBadge({
  achievement,
  isUnlocked,
  isDark
}: {
  achievement: typeof ACHIEVEMENTS[0];
  isUnlocked: boolean;
  isDark: boolean;
}) {
  const Icon = achievement.icon

  return (
    <div className={`relative p-4 rounded-xl text-center transition-all duration-300 ${
      isUnlocked
        ? 'bg-gradient-to-br from-amber-500/20 to-orange-500/20 border-2 border-amber-500/50'
        : isDark
          ? 'bg-slate-800/30 border border-slate-700 opacity-50'
          : 'bg-slate-50 border border-slate-200 opacity-50'
    }`}>
      {isUnlocked && (
        <div className="absolute -top-2 -right-2">
          <Sparkles className="w-5 h-5 text-amber-500" />
        </div>
      )}
      <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-2 ${
        isUnlocked
          ? 'bg-gradient-to-br from-amber-400 to-orange-500'
          : isDark ? 'bg-slate-700' : 'bg-slate-200'
      }`}>
        <Icon className={`w-6 h-6 ${isUnlocked ? 'text-white' : isDark ? 'text-slate-500' : 'text-slate-400'}`} />
      </div>
      <h4 className={`font-bold text-sm mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
        {achievement.name}
      </h4>
      <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
        {achievement.description}
      </p>
    </div>
  )
}

// Celebration Modal
function CelebrationModal({
  isOpen,
  onClose,
  achievement,
  isDark
}: {
  isOpen: boolean;
  onClose: () => void;
  achievement: typeof ACHIEVEMENTS[0] | null;
  isDark: boolean;
}) {
  if (!isOpen || !achievement) return null

  const Icon = achievement.icon

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className={`relative max-w-sm w-full rounded-2xl p-8 text-center ${
        isDark ? 'bg-slate-900 border border-slate-700' : 'bg-white'
      } shadow-2xl animate-bounce-in`}>
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 p-1 rounded-full ${
            isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'
          }`}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-4">
          <PartyPopper className="w-16 h-16 mx-auto text-amber-500 animate-pulse" />
        </div>

        <h2 className={`text-2xl font-black mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          Achievement Unlocked!
        </h2>

        <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-500/30">
          <Icon className="w-10 h-10 text-white" />
        </div>

        <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          {achievement.name}
        </h3>
        <p className={`mb-6 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          {achievement.description}
        </p>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-amber-500 to-yellow-500 hover:opacity-90 transition-opacity"
        >
          Keep Going!
        </button>
      </div>
    </div>
  )
}

// ============================================
// MAIN COMPONENT
// ============================================

export default function PremiumCoursePlatform() {
  // State
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isDark, setIsDark] = useState(false)
  const [activeModule, setActiveModule] = useState<string | null>(null)
  const [completedModules, setCompletedModules] = useState<string[]>([])
  const [completedBonuses, setCompletedBonuses] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState<'course' | 'bonuses' | 'achievements'>('course')
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [celebrationAchievement, setCelebrationAchievement] = useState<typeof ACHIEVEMENTS[0] | null>(null)
  const [lastUnlockedAchievements, setLastUnlockedAchievements] = useState<string[]>([])

  // Calculate progress
  const availableModules = COURSE_MODULES.filter(m => !m.comingSoon)
  const totalLessons = availableModules.length
  const completedCount = completedModules.filter(id =>
    availableModules.some(m => m.id === id)
  ).length
  const progressPercent = totalLessons > 0 ? (completedCount / totalLessons) * 100 : 0

  // Get current motivational quote
  const currentQuote = MOTIVATIONAL_QUOTES.reduce((prev, curr) =>
    progressPercent >= curr.threshold ? curr : prev
  , MOTIVATIONAL_QUOTES[0])

  // Load saved state + DEV auto-login
  useEffect(() => {
    const savedTheme = localStorage.getItem('lawyer_theme')
    if (savedTheme) setIsDark(savedTheme === 'dark')

    const savedCompleted = localStorage.getItem('lawyer_completed_modules')
    if (savedCompleted) setCompletedModules(JSON.parse(savedCompleted))

    const savedBonuses = localStorage.getItem('lawyer_completed_bonuses')
    if (savedBonuses) setCompletedBonuses(JSON.parse(savedBonuses))

    // DEV MODE: Auto-login for testing
    if (DEV_AUTO_LOGIN) {
      setIsAuthenticated(true)
    } else {
      const savedAuth = localStorage.getItem('lawyerMemberAuth')
      if (savedAuth === 'true') setIsAuthenticated(true)
    }

    const savedAchievements = localStorage.getItem('lawyer_achievements')
    if (savedAchievements) setLastUnlockedAchievements(JSON.parse(savedAchievements))
  }, [])

  // Save state changes
  useEffect(() => {
    localStorage.setItem('lawyer_theme', isDark ? 'dark' : 'light')
  }, [isDark])

  useEffect(() => {
    localStorage.setItem('lawyer_completed_modules', JSON.stringify(completedModules))
  }, [completedModules])

  useEffect(() => {
    localStorage.setItem('lawyer_completed_bonuses', JSON.stringify(completedBonuses))
  }, [completedBonuses])

  // Check for new achievements
  useEffect(() => {
    const allCompleted = [...completedModules, ...completedBonuses]
    const unlockedAchievements = ACHIEVEMENTS.filter(a =>
      a.condition(allCompleted, totalLessons)
    ).map(a => a.id)

    // Find newly unlocked achievements
    const newAchievements = unlockedAchievements.filter(id =>
      !lastUnlockedAchievements.includes(id)
    )

    if (newAchievements.length > 0) {
      const newAchievement = ACHIEVEMENTS.find(a => a.id === newAchievements[0])
      if (newAchievement) {
        setCelebrationAchievement(newAchievement)
      }
      setLastUnlockedAchievements(unlockedAchievements)
      localStorage.setItem('lawyer_achievements', JSON.stringify(unlockedAchievements))
    }
  }, [completedModules, completedBonuses, lastUnlockedAchievements, totalLessons])

  // Handle login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password.toLowerCase().trim() === COURSE_CONFIG.password) {
      setIsAuthenticated(true)
      localStorage.setItem('lawyerMemberAuth', 'true')
      setError('')
    } else {
      setError('Invalid password. Please check your email for the correct password.')
    }
  }

  // Mark module complete
  const markModuleComplete = (moduleId: string) => {
    if (!completedModules.includes(moduleId)) {
      setCompletedModules([...completedModules, moduleId])
    }
  }

  // Handle bonus download
  const handleBonusDownload = (bonusId: string) => {
    if (!completedBonuses.includes(bonusId)) {
      setCompletedBonuses([...completedBonuses, bonusId])
    }
    // Trigger download if file exists
    const bonus = BONUSES.find(b => b.id === bonusId)
    if (bonus?.file) {
      window.open(bonus.file, '_blank')
    }
  }

  // Get active module data
  const activeModuleData = COURSE_MODULES.find(m => m.id === activeModule)

  // ============================================
  // LOGIN SCREEN
  // ============================================
  if (!isAuthenticated) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-4 ${
        isDark
          ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900'
          : 'bg-gradient-to-br from-slate-50 via-white to-amber-50'
      }`}>
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className={`absolute top-1/4 -left-20 w-96 h-96 rounded-full blur-3xl ${
            isDark ? 'bg-amber-500/10' : 'bg-amber-500/20'
          }`} />
          <div className={`absolute bottom-1/4 -right-20 w-96 h-96 rounded-full blur-3xl ${
            isDark ? 'bg-yellow-500/10' : 'bg-yellow-500/20'
          }`} />
        </div>

        <div className={`relative w-full max-w-md rounded-3xl p-8 ${
          isDark
            ? 'bg-slate-800/50 backdrop-blur-xl border border-slate-700'
            : 'bg-white/80 backdrop-blur-xl border border-slate-200 shadow-2xl'
        }`}>
          {/* Theme toggle */}
          <div className="absolute top-4 right-4">
            <ThemeToggle isDark={isDark} onToggle={() => setIsDark(!isDark)} />
          </div>

          {/* Logo/Title */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <h1 className={`text-2xl font-black mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {COURSE_CONFIG.title}
            </h1>
            <p className="text-amber-500 font-bold">{COURSE_CONFIG.subtitle}</p>
          </div>

          {/* Login form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Enter your password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your access password"
                className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                  isDark
                    ? 'bg-slate-800/90 border-slate-600 text-white placeholder-slate-500 focus:border-amber-400'
                    : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-amber-500'
                } focus:outline-none focus:ring-4 focus:ring-amber-500/20`}
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-amber-500 to-yellow-500 hover:opacity-90 transition-all duration-200 shadow-lg shadow-amber-500/30"
            >
              Access My Course
            </button>
          </form>

          <p className={`mt-6 text-center text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Check your email for your password
          </p>
        </div>
      </div>
    )
  }

  // ============================================
  // MAIN PLATFORM
  // ============================================
  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark
        ? 'bg-slate-900 text-white'
        : 'bg-slate-50 text-slate-900'
    }`}>
      {/* Header */}
      <header className={`sticky top-0 z-40 ${
        isDark
          ? 'bg-slate-900/80 border-b border-slate-800'
          : 'bg-white/80 border-b border-slate-200'
      } backdrop-blur-xl`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="font-bold">{COURSE_CONFIG.title}</h1>
                <p className="text-xs text-amber-500">{COURSE_CONFIG.subtitle}</p>
              </div>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {[
                { id: 'course', label: 'Course', icon: Video },
                { id: 'bonuses', label: 'Bonuses', icon: Gift },
                { id: 'achievements', label: 'Achievements', icon: Trophy },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-white'
                      : isDark
                        ? 'text-slate-400 hover:text-white hover:bg-slate-800'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-3">
              <ThemeToggle isDark={isDark} onToggle={() => setIsDark(!isDark)} />

              {/* Mobile menu button */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className={`md:hidden p-2 rounded-lg ${
                  isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-100'
                }`}
              >
                {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {showMobileMenu && (
          <div className={`md:hidden border-t ${isDark ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'}`}>
            <nav className="p-4 space-y-2">
              {[
                { id: 'course', label: 'Course', icon: Video },
                { id: 'bonuses', label: 'Bonuses', icon: Gift },
                { id: 'achievements', label: 'Achievements', icon: Trophy },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as any)
                    setShowMobileMenu(false)
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-white'
                      : isDark
                        ? 'text-slate-400 hover:bg-slate-800'
                        : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Overview */}
        <div className={`rounded-2xl p-6 mb-8 ${
          isDark
            ? 'bg-slate-800/50 border border-slate-700'
            : 'bg-white border border-slate-200 shadow-sm'
        }`}>
          <div className="flex flex-col md:flex-row items-center gap-6">
            <ProgressRing progress={progressPercent} isDark={isDark} />
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-xl font-bold mb-2">Your Progress</h2>
              <p className={`mb-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                {completedCount} of {totalLessons} modules completed
              </p>
              <div className={`p-4 rounded-xl ${isDark ? 'bg-slate-700/50' : 'bg-amber-50'}`}>
                <p className={`text-sm italic ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  "{currentQuote.quote}"
                </p>
                <p className="text-xs text-amber-500 mt-1">— {currentQuote.author}</p>
              </div>
            </div>
            {/* Quick stats */}
            <div className="flex gap-4 md:flex-col">
              <div className={`px-4 py-3 rounded-xl text-center ${isDark ? 'bg-slate-700/50' : 'bg-slate-100'}`}>
                <div className="text-2xl font-bold text-amber-500">{ACHIEVEMENTS.filter(a => a.condition([...completedModules, ...completedBonuses], totalLessons)).length}</div>
                <div className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Badges</div>
              </div>
              <div className={`px-4 py-3 rounded-xl text-center ${isDark ? 'bg-slate-700/50' : 'bg-slate-100'}`}>
                <div className="text-2xl font-bold text-amber-500">{BONUSES.length}</div>
                <div className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Bonuses</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'course' && (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Module List */}
            <div className="lg:col-span-1 space-y-3">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-amber-500" />
                Course Modules
              </h3>
              {COURSE_MODULES.map((module, index) => (
                <ModuleCard
                  key={module.id}
                  module={module}
                  index={index}
                  isCompleted={completedModules.includes(module.id)}
                  isActive={activeModule === module.id}
                  isLocked={false}
                  onClick={() => setActiveModule(module.id)}
                  isDark={isDark}
                />
              ))}
            </div>

            {/* Video Player Area */}
            <div className="lg:col-span-2">
              {activeModuleData ? (
                <div className={`rounded-2xl overflow-hidden ${
                  isDark ? 'bg-slate-800/50 border border-slate-700' : 'bg-white border border-slate-200 shadow-sm'
                }`}>
                  {/* Video */}
                  {activeModuleData.wistiaId ? (
                    <WistiaPlayer
                      wistiaId={activeModuleData.wistiaId}
                      isDark={isDark}
                      onComplete={() => markModuleComplete(activeModuleData.id)}
                    />
                  ) : (
                    <div className={`aspect-video flex items-center justify-center ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`}>
                      <div className="text-center">
                        <Lock className={`w-12 h-12 mx-auto mb-3 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                        <p className={isDark ? 'text-slate-400' : 'text-slate-500'}>Coming Soon</p>
                      </div>
                    </div>
                  )}

                  {/* Module Info */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h2 className="text-xl font-bold mb-2">{activeModuleData.title}</h2>
                        <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                          {activeModuleData.description}
                        </p>
                      </div>
                      {!activeModuleData.comingSoon && (
                        <button
                          onClick={() => markModuleComplete(activeModuleData.id)}
                          disabled={completedModules.includes(activeModuleData.id)}
                          className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                            completedModules.includes(activeModuleData.id)
                              ? 'bg-amber-500/20 text-amber-500 cursor-default'
                              : 'bg-gradient-to-r from-amber-500 to-yellow-500 text-white hover:opacity-90'
                          }`}
                        >
                          <CheckCircle className="w-4 h-4" />
                          {completedModules.includes(activeModuleData.id) ? 'Completed' : 'Mark Complete'}
                        </button>
                      )}
                    </div>

                    {/* Lessons list */}
                    <div className={`p-4 rounded-xl ${isDark ? 'bg-slate-700/50' : 'bg-slate-50'}`}>
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        <Lightbulb className="w-4 h-4 text-amber-500" />
                        What you'll learn:
                      </h4>
                      <ul className="space-y-2">
                        {activeModuleData.lessons.map((lesson, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <CircleCheck className="w-4 h-4 text-amber-500 flex-shrink-0" />
                            <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                              {lesson}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Resources section */}
                    {activeModuleData.resources && activeModuleData.resources.length > 0 && (
                      <div className={`p-4 rounded-xl mt-4 ${isDark ? 'bg-amber-500/10 border border-amber-500/30' : 'bg-amber-50 border border-amber-200'}`}>
                        <h4 className="font-medium mb-3 flex items-center gap-2">
                          <Download className="w-4 h-4 text-amber-500" />
                          Resources & Downloads:
                        </h4>
                        <div className="space-y-2">
                          {activeModuleData.resources.map((resource, i) => (
                            <a
                              key={i}
                              href={resource.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                                isDark
                                  ? 'bg-slate-800/50 hover:bg-slate-800 border border-slate-700'
                                  : 'bg-white hover:bg-slate-50 border border-slate-200 shadow-sm'
                              }`}
                            >
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                resource.type === 'link'
                                  ? 'bg-amber-500/20 text-amber-500'
                                  : resource.type === 'folder'
                                    ? 'bg-amber-500/20 text-amber-500'
                                    : 'bg-amber-500/20 text-amber-500'
                              }`}>
                                {resource.type === 'link' ? (
                                  <ArrowRight className="w-4 h-4" />
                                ) : resource.type === 'folder' ? (
                                  <Gift className="w-4 h-4" />
                                ) : (
                                  <FileText className="w-4 h-4" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className={`font-medium text-sm truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                  {resource.name}
                                </p>
                                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                  {resource.type === 'link' ? 'External Link' : resource.type === 'folder' ? 'Download Folder' : 'Download File'}
                                </p>
                              </div>
                              <ChevronRight className={`w-4 h-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className={`rounded-2xl p-12 text-center ${
                  isDark ? 'bg-slate-800/50 border border-slate-700' : 'bg-white border border-slate-200 shadow-sm'
                }`}>
                  <Play className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-slate-600' : 'text-slate-300'}`} />
                  <h3 className="text-xl font-bold mb-2">Select a Module</h3>
                  <p className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                    Choose a module from the list to start learning
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'bonuses' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-xl flex items-center gap-2">
                <Gift className="w-6 h-6 text-amber-500" />
                Your Exclusive Bonuses
              </h3>
              <div className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                isDark ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-50 text-amber-600'
              }`}>
                Total Value: ${BONUSES.reduce((acc, b) => acc + b.value, 0)}
              </div>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {BONUSES.map(bonus => (
                <BonusCard
                  key={bonus.id}
                  bonus={bonus}
                  isUnlocked={true}
                  onClick={() => handleBonusDownload(bonus.id)}
                  isDark={isDark}
                />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'achievements' && (
          <div>
            <div className="mb-6">
              <h3 className="font-bold text-xl flex items-center gap-2 mb-2">
                <Trophy className="w-6 h-6 text-amber-500" />
                Your Achievements
              </h3>
              <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                Complete modules and unlock badges to track your progress
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {ACHIEVEMENTS.map(achievement => (
                <AchievementBadge
                  key={achievement.id}
                  achievement={achievement}
                  isUnlocked={achievement.condition([...completedModules, ...completedBonuses], totalLessons)}
                  isDark={isDark}
                />
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Celebration Modal */}
      <CelebrationModal
        isOpen={!!celebrationAchievement}
        onClose={() => setCelebrationAchievement(null)}
        achievement={celebrationAchievement}
        isDark={isDark}
      />

      {/* Custom styles */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes bounce-in {
          0% { transform: scale(0.5); opacity: 0; }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-bounce-in {
          animation: bounce-in 0.4s ease-out;
        }
      `}} />
    </div>
  )
}
