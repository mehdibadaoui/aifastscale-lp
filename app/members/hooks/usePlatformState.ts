'use client'

import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { NicheConfig, VideoProgress } from '../config/types'
import { oldStoragePrefixes } from '../config/universal'

// Transaction type for Profit Tracker
export interface Transaction {
  id: string
  type: 'income' | 'expense'
  amount: number
  description: string
  date: string
  category?: string
}

// ============================================
// PROGRESS MIGRATION - Migrate old niche data to universal
// ============================================

function migrateOldProgress(newPrefix: string) {
  if (typeof window === 'undefined') return

  // Check if already migrated
  const migrated = localStorage.getItem(newPrefix + 'migrated')
  if (migrated === 'true') return

  // Keys to migrate
  const keysToMigrate = [
    'completed', 'downloaded', 'video_progress', 'timestamps',
    'points', 'streak', 'unlocked', 'watch_time',
    'notes', 'bookmarks', 'name', 'waitlist', 'vip_guest',
    'dark_mode', 'autoplay', 'show_badge', 'sound_enabled',
    'show_welcome', 'onboarded', 'last_visit', 'email'
  ]

  // Find which old prefix has data (check 'completed' as indicator)
  let sourcePrefix: string | null = null
  for (const oldPrefix of oldStoragePrefixes) {
    const hasData = localStorage.getItem(oldPrefix + 'completed')
    if (hasData) {
      sourcePrefix = oldPrefix
      break
    }
  }

  if (!sourcePrefix) {
    // No old data found, mark as migrated
    localStorage.setItem(newPrefix + 'migrated', 'true')
    return
  }

  console.log(`[Migration] Found old data with prefix: ${sourcePrefix}, migrating to ${newPrefix}`)

  // Migrate each key
  for (const key of keysToMigrate) {
    const oldValue = localStorage.getItem(sourcePrefix + key)
    const newValue = localStorage.getItem(newPrefix + key)

    // Only migrate if old value exists and new doesn't (don't overwrite)
    if (oldValue && !newValue) {
      localStorage.setItem(newPrefix + key, oldValue)
      console.log(`[Migration] Migrated ${key}`)
    }
  }

  // Mark as migrated
  localStorage.setItem(newPrefix + 'migrated', 'true')
  console.log('[Migration] Complete!')
}

// Custom hook for localStorage with SSR safety - takes storagePrefix as param
function useLocalStorage<T>(
  storagePrefix: string,
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(initialValue)

  useEffect(() => {
    try {
      const item = localStorage.getItem(storagePrefix + key)
      if (item) {
        setStoredValue(JSON.parse(item))
      }
    } catch (error) {
      console.error(`Error reading ${key} from localStorage:`, error)
    }
  }, [storagePrefix, key])

  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    setStoredValue(prev => {
      const newValue = value instanceof Function ? value(prev) : value
      try {
        localStorage.setItem(storagePrefix + key, JSON.stringify(newValue))
      } catch (error) {
        console.error(`Error writing ${key} to localStorage:`, error)
      }
      return newValue
    })
  }, [storagePrefix, key])

  return [storedValue, setValue]
}

// Main platform state hook - now takes config as parameter
export function usePlatformState(config: NicheConfig) {
  const STORAGE_PREFIX = config.storagePrefix
  const AUTH_STORAGE_KEY = config.auth.authStorageKey
  const API_ENDPOINT = `/api/members-auth`

  // Loading state
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isBlocked, setIsBlocked] = useState(false)

  // Navigation
  const [activeSection, setActiveSectionRaw] = useState<'dashboard' | 'course' | 'bonuses' | 'achievements' | 'tracker' | 'resources'>('dashboard')
  const [currentModuleIndex, setCurrentModuleIndexRaw] = useState(0)

  // Wrapper to scroll to top when changing sections
  const setActiveSection = useCallback((section: 'dashboard' | 'course' | 'bonuses' | 'achievements' | 'tracker' | 'resources') => {
    setActiveSectionRaw(section)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  // Wrapper to scroll to top when changing modules
  const setCurrentModuleIndex = useCallback((index: number) => {
    setCurrentModuleIndexRaw(index)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  // Progress - using custom localStorage hook with config prefix
  const [completedModules, setCompletedModules] = useLocalStorage<string[]>(STORAGE_PREFIX, 'completed', [])
  const [downloadedBonuses, setDownloadedBonuses] = useLocalStorage<string[]>(STORAGE_PREFIX, 'downloaded', [])
  const [videoProgress, setVideoProgress] = useLocalStorage<Record<string, VideoProgress>>(STORAGE_PREFIX, 'video_progress', {})
  const [completionTimestamps, setCompletionTimestamps] = useLocalStorage<Record<string, string>>(STORAGE_PREFIX, 'timestamps', {})

  // Gamification
  const [totalPoints, setTotalPoints] = useLocalStorage<number>(STORAGE_PREFIX, 'points', 0)
  const [streak, setStreak] = useLocalStorage<number>(STORAGE_PREFIX, 'streak', 1)
  const [unlockedAchievementIds, setUnlockedAchievementIds] = useLocalStorage<string[]>(STORAGE_PREFIX, 'unlocked', [])
  const [sessionCompletedCount, setSessionCompletedCount] = useState(0)
  const [totalWatchTimeMinutes, setTotalWatchTimeMinutes] = useLocalStorage<number>(STORAGE_PREFIX, 'watch_time', 0)

  // User features
  const [moduleNotes, setModuleNotes] = useLocalStorage<Record<string, string>>(STORAGE_PREFIX, 'notes', {})
  const [bookmarkedModules, setBookmarkedModules] = useLocalStorage<string[]>(STORAGE_PREFIX, 'bookmarks', [])
  const [studentName, setStudentName] = useLocalStorage<string>(STORAGE_PREFIX, 'name', '')
  const [videoTimestampBookmarks, setVideoTimestampBookmarks] = useLocalStorage<Record<string, { seconds: number; label: string }[]>>(STORAGE_PREFIX, 'timestamp_bookmarks', {})

  // Waitlist for coming soon courses
  const [waitlistedCourses, setWaitlistedCourses] = useLocalStorage<string[]>(STORAGE_PREFIX, 'waitlist', [])

  // Profit Tracker state
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>(STORAGE_PREFIX, 'transactions', [])
  const [monthlyGoal, setMonthlyGoal] = useLocalStorage<number>(STORAGE_PREFIX, 'monthly_goal', 0)

  // VIP Guest info
  const [vipGuest, setVipGuest] = useLocalStorage<{ id: string; name: string; badge: string; welcomeMessage: string } | null>(STORAGE_PREFIX, 'vip_guest', null)

  // Settings
  const [darkMode, setDarkMode] = useLocalStorage<boolean>(STORAGE_PREFIX, 'dark_mode', true)
  const [autoPlayNext, setAutoPlayNext] = useLocalStorage<boolean>(STORAGE_PREFIX, 'autoplay', false)
  const [showCompletedBadge, setShowCompletedBadge] = useLocalStorage<boolean>(STORAGE_PREFIX, 'show_badge', true)
  const [soundEnabled, setSoundEnabled] = useLocalStorage<boolean>(STORAGE_PREFIX, 'sound_enabled', true)
  const [reducedMotion, setReducedMotion] = useState(false)

  // UI state
  const [showConfetti, setShowConfetti] = useState(false)
  const [showWelcome, setShowWelcome] = useLocalStorage<boolean>(STORAGE_PREFIX, 'show_welcome', true)
  const [showAchievementToast, setShowAchievementToast] = useState<string | null>(null)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  // Modals
  const [showNotesModal, setShowNotesModal] = useState(false)
  const [showKeyboardModal, setShowKeyboardModal] = useState(false)
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  const [showCertificateModal, setShowCertificateModal] = useState(false)
  const [showOnboarding, setShowOnboarding] = useState(false)

  // Refs for keyboard navigation (avoid stale closures)
  const currentModuleIndexRef = useRef(currentModuleIndex)
  const activeSectionRef = useRef(activeSection)

  useEffect(() => {
    currentModuleIndexRef.current = currentModuleIndex
    activeSectionRef.current = activeSection
  }, [currentModuleIndex, activeSection])

  // Derived state
  const availableModules = config.modules.filter(m => !m.comingSoon)
  const totalModules = availableModules.length
  const completedCount = completedModules.filter(id => availableModules.some(m => m.id === id)).length
  const progressPercent = totalModules > 0 ? (completedCount / totalModules) * 100 : 0
  const currentModule = config.modules[currentModuleIndex]
  const timeRemaining = config.modules.filter(m => !m.comingSoon && !completedModules.includes(m.id))
    .reduce((acc, m) => acc + m.durationMinutes, 0)

  // Memoize note-taker check to avoid recalculating on every render
  const hasAnyNotes = useMemo(() =>
    Object.values(moduleNotes).some(note => note && note.length > 0),
    [moduleNotes]
  )

  // Achievement conditions - memoized to prevent unnecessary re-renders
  const achievementConditions: Record<string, boolean> = useMemo(() => ({
    'first-video': completedCount >= 1,
    'halfway': progressPercent >= 50,
    'completed': progressPercent >= 100,
    'fast-learner': sessionCompletedCount >= 3,
    'bonus-collector': downloadedBonuses.length >= 5,
    'streak-3': streak >= 3,
    'streak-7': streak >= 7,
    'note-taker': hasAnyNotes,
    'bookworm': bookmarkedModules.length >= 3,
  }), [completedCount, progressPercent, sessionCompletedCount, downloadedBonuses.length, streak, hasAnyNotes, bookmarkedModules.length])

  // Check for newly unlocked achievements
  useEffect(() => {
    if (isLoading) return

    const newlyUnlocked: string[] = []
    Object.entries(achievementConditions).forEach(([id, isUnlocked]) => {
      if (isUnlocked && !unlockedAchievementIds.includes(id)) {
        newlyUnlocked.push(id)
      }
    })

    if (newlyUnlocked.length > 0) {
      setUnlockedAchievementIds(prev => [...prev, ...newlyUnlocked])

      const pointsToAdd = newlyUnlocked.reduce((sum, id) => {
        const achievement = config.achievements.find(a => a.id === id)
        return sum + (achievement?.points || 0)
      }, 0)

      if (pointsToAdd > 0) {
        setTotalPoints(prev => prev + pointsToAdd)
      }

      // Show toast for first unlocked (extended to 5s)
      const firstUnlocked = config.achievements.find(a => a.id === newlyUnlocked[0])
      if (firstUnlocked) {
        setShowAchievementToast(firstUnlocked.name)
        setTimeout(() => setShowAchievementToast(null), 5000)
      }
    }
  }, [achievementConditions, unlockedAchievementIds, isLoading, config.achievements])

  // Initialize on mount
  useEffect(() => {
    // MIGRATE old progress data to new universal prefix
    migrateOldProgress(STORAGE_PREFIX)

    // Check reduced motion preference
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(motionQuery.matches)
    const handleMotionChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    motionQuery.addEventListener('change', handleMotionChange)

    // Handle streak logic - READ DIRECTLY from localStorage to avoid race condition
    const today = new Date().toDateString()
    const lastVisit = localStorage.getItem(STORAGE_PREFIX + 'last_visit')
    const storedStreak = localStorage.getItem(STORAGE_PREFIX + 'streak')
    const currentStreak = storedStreak ? JSON.parse(storedStreak) : 1

    if (lastVisit) {
      const lastDate = new Date(lastVisit)
      const todayDate = new Date(today)
      const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24))

      if (diffDays === 1) {
        // Consecutive day - increment streak from stored value
        const newStreak = currentStreak + 1
        setStreak(newStreak)
        localStorage.setItem(STORAGE_PREFIX + 'streak', JSON.stringify(newStreak))
      } else if (diffDays > 1) {
        // Streak broken - reset to 1
        setStreak(1)
        localStorage.setItem(STORAGE_PREFIX + 'streak', JSON.stringify(1))
      }
      // diffDays === 0 means same day, keep current streak
    }
    localStorage.setItem(STORAGE_PREFIX + 'last_visit', today)

    // Session count for fast learner
    const sessionDate = localStorage.getItem(STORAGE_PREFIX + 'session_date')
    const sessionCount = localStorage.getItem(STORAGE_PREFIX + 'session_count')

    if (sessionDate === today && sessionCount) {
      setSessionCompletedCount(parseInt(sessionCount))
    } else {
      localStorage.setItem(STORAGE_PREFIX + 'session_date', today)
      localStorage.setItem(STORAGE_PREFIX + 'session_count', '0')
    }

    // Check auth with expiry
    if (config.devAutoLogin) {
      setIsAuthenticated(true)
    } else {
      const savedAuthData = localStorage.getItem(AUTH_STORAGE_KEY)
      const savedVipGuest = localStorage.getItem(STORAGE_PREFIX + 'vip_guest')

      // Check if user is blocked (e.g., refunded)
      if (savedVipGuest) {
        try {
          const vipData = JSON.parse(savedVipGuest)
          if (vipData?.id && config.blockedUsers.includes(vipData.id)) {
            // User is blocked - show payment required screen
            setIsBlocked(true)
            setIsAuthenticated(false)
            setIsLoading(false)
            return
          }
        } catch (e) {
          // Invalid data, continue
        }
      }

      // Check auth with expiry support
      let isValidAuth = false

      if (savedAuthData) {
        try {
          const authData = JSON.parse(savedAuthData)
          if (authData.expiry && Date.now() < authData.expiry) {
            // Still valid (remember me)
            isValidAuth = true
          } else if (authData === true || savedAuthData === 'true') {
            // Legacy format (no expiry) - keep authenticated
            isValidAuth = true
          } else if (authData.expiry) {
            // Expired - clear auth
            localStorage.removeItem(AUTH_STORAGE_KEY)
          }
        } catch {
          // Old format "true" string - keep authenticated
          if (savedAuthData === 'true') isValidAuth = true
        }
      }

      // Also check sessionStorage (for non-remember-me sessions)
      if (!isValidAuth) {
        const sessionAuth = sessionStorage.getItem(AUTH_STORAGE_KEY)
        if (sessionAuth === 'true') isValidAuth = true
      }

      if (isValidAuth) setIsAuthenticated(true)
    }

    // Check if first visit for onboarding
    const hasOnboarded = localStorage.getItem(STORAGE_PREFIX + 'onboarded')
    if (!hasOnboarded) {
      setShowOnboarding(true)
    }

    setIsLoading(false)

    return () => motionQuery.removeEventListener('change', handleMotionChange)
  }, [STORAGE_PREFIX, AUTH_STORAGE_KEY, config.devAutoLogin, config.blockedUsers])

  // Apply dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  // Save session count on change
  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'session_count', sessionCompletedCount.toString())
  }, [sessionCompletedCount, STORAGE_PREFIX])

  // Login state for async handling
  const [loginError, setLoginError] = useState<string | null>(null)
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  // Actions - uses unified API route for secure password verification
  const handleLogin = useCallback(async (email: string, password: string, rememberMe: boolean = true): Promise<boolean> => {
    setIsLoggingIn(true)
    setLoginError(null)

    try {
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (data.success) {
        setIsAuthenticated(true)

        // Store auth with expiry if "Remember me" is checked
        if (rememberMe) {
          const thirtyDaysFromNow = Date.now() + (30 * 24 * 60 * 60 * 1000)
          localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({
            authenticated: true,
            expiry: thirtyDaysFromNow
          }))
        } else {
          // Session only - use sessionStorage (cleared when browser closes)
          sessionStorage.setItem(AUTH_STORAGE_KEY, 'true')
          localStorage.removeItem(AUTH_STORAGE_KEY)
        }

        if (data.isVip && data.vipGuest) {
          // VIP Guest login
          setVipGuest(data.vipGuest)
          setStudentName(data.vipGuest.name)
        } else if (data.user) {
          // Personalized login - set user's name
          setVipGuest(null)
          if (data.user.name) {
            setStudentName(data.user.name)
          }
          // Store user email for reference
          localStorage.setItem(STORAGE_PREFIX + 'email', data.user.email)
        } else {
          setVipGuest(null)
        }

        setIsLoggingIn(false)
        return true
      } else {
        setLoginError(data.error || 'Invalid credentials')
        setIsLoggingIn(false)
        return false
      }
    } catch (error) {
      setLoginError('Connection error. Please try again.')
      setIsLoggingIn(false)
      return false
    }
  }, [API_ENDPOINT, AUTH_STORAGE_KEY, STORAGE_PREFIX, config.slug])

  const handleLogout = useCallback(() => {
    setIsAuthenticated(false)
    setVipGuest(null)
    localStorage.removeItem(AUTH_STORAGE_KEY)
    sessionStorage.removeItem(AUTH_STORAGE_KEY)
    setShowLogoutConfirm(false)
  }, [AUTH_STORAGE_KEY])

  const startCourse = useCallback(() => {
    setShowWelcome(false)
  }, [])

  const completeOnboarding = useCallback(() => {
    setShowOnboarding(false)
    localStorage.setItem(STORAGE_PREFIX + 'onboarded', 'true')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [STORAGE_PREFIX])

  const markComplete = useCallback(() => {
    if (!completedModules.includes(currentModule.id)) {
      setCompletedModules(prev => [...prev, currentModule.id])
      setSessionCompletedCount(prev => prev + 1)
      setTotalPoints(prev => prev + 50)
      setTotalWatchTimeMinutes(prev => prev + currentModule.durationMinutes)
      setCompletionTimestamps(prev => ({ ...prev, [currentModule.id]: new Date().toISOString() }))

      if (!reducedMotion) {
        setShowConfetti(true)
        setTimeout(() => setShowConfetti(false), 4000)
      }

      // Auto-play next if enabled
      if (autoPlayNext && currentModuleIndex < config.modules.length - 1 && !config.modules[currentModuleIndex + 1]?.comingSoon) {
        setTimeout(() => setCurrentModuleIndex(currentModuleIndex + 1), 2000)
      }
    }
  }, [completedModules, currentModule, autoPlayNext, currentModuleIndex, reducedMotion, config.modules])

  const handleVideoProgress = useCallback((percent: number, seconds: number) => {
    setVideoProgress(prev => ({ ...prev, [currentModule.id]: { percent, seconds } }))
  }, [currentModule.id])

  const handleBonusDownload = useCallback((bonusId: string) => {
    if (!downloadedBonuses.includes(bonusId)) {
      setDownloadedBonuses(prev => [...prev, bonusId])
      setTotalPoints(prev => prev + 10)
    }
  }, [downloadedBonuses])

  const toggleBookmark = useCallback((moduleId: string) => {
    setBookmarkedModules(prev =>
      prev.includes(moduleId) ? prev.filter(id => id !== moduleId) : [...prev, moduleId]
    )
  }, [])

  const saveNote = useCallback((moduleId: string, note: string) => {
    setModuleNotes(prev => ({ ...prev, [moduleId]: note }))
  }, [])

  const addTimestampBookmark = useCallback((moduleId: string, seconds: number, label: string = '') => {
    setVideoTimestampBookmarks(prev => {
      const existing = prev[moduleId] || []
      if (existing.some(b => Math.abs(b.seconds - seconds) < 5)) return prev
      const bookmarkLabel = label || `Bookmark at ${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`
      return { ...prev, [moduleId]: [...existing, { seconds, label: bookmarkLabel }].sort((a, b) => a.seconds - b.seconds) }
    })
  }, [])

  const removeTimestampBookmark = useCallback((moduleId: string, seconds: number) => {
    setVideoTimestampBookmarks(prev => {
      const existing = prev[moduleId] || []
      return { ...prev, [moduleId]: existing.filter(b => b.seconds !== seconds) }
    })
  }, [])

  const toggleWaitlist = useCallback((courseId: string) => {
    setWaitlistedCourses(prev => {
      if (prev.includes(courseId)) {
        return prev.filter(id => id !== courseId)
      }
      return [...prev, courseId]
    })
  }, [])

  // Profit Tracker actions
  const addTransaction = useCallback((transaction: Omit<Transaction, 'id'>) => {
    const newTransaction = {
      ...transaction,
      id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    }
    setTransactions(prev => [...prev, newTransaction])
  }, [])

  const deleteTransaction = useCallback((id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id))
  }, [])

  const updateTransaction = useCallback((id: string, updates: Partial<Transaction>) => {
    setTransactions(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t))
  }, [])

  const nextModule = useCallback(() => {
    if (currentModuleIndex < config.modules.length - 1 && !config.modules[currentModuleIndex + 1].comingSoon) {
      setCurrentModuleIndex(currentModuleIndex + 1)
    }
  }, [currentModuleIndex, config.modules])

  const prevModule = useCallback(() => {
    if (currentModuleIndex > 0) {
      setCurrentModuleIndex(currentModuleIndex - 1)
    }
  }, [currentModuleIndex])

  const updateSettings = useCallback((settings: { darkMode?: boolean; autoPlayNext?: boolean; showCompletedBadge?: boolean; soundEnabled?: boolean }) => {
    if (settings.darkMode !== undefined) setDarkMode(settings.darkMode)
    if (settings.autoPlayNext !== undefined) setAutoPlayNext(settings.autoPlayNext)
    if (settings.showCompletedBadge !== undefined) setShowCompletedBadge(settings.showCompletedBadge)
    if (settings.soundEnabled !== undefined) setSoundEnabled(settings.soundEnabled)
  }, [])

  // Find next incomplete module
  const nextIncompleteModule = availableModules.find(m => !completedModules.includes(m.id))
  const nextIncompleteModuleIndex = nextIncompleteModule ? config.modules.findIndex(m => m.id === nextIncompleteModule.id) : 0

  // Get completion date for certificate
  const courseCompletionDate = progressPercent >= 100 && Object.keys(completionTimestamps).length > 0
    ? new Date(Math.max(...Object.values(completionTimestamps).map(t => new Date(t).getTime()))).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : ''

  // Unlocked achievements map
  const unlockedAchievements: Record<string, boolean> = {}
  config.achievements.forEach(a => {
    unlockedAchievements[a.id] = achievementConditions[a.id] || unlockedAchievementIds.includes(a.id)
  })
  const unlockedCount = Object.values(unlockedAchievements).filter(Boolean).length

  return {
    // Config reference
    config,

    // State
    isLoading,
    isAuthenticated,
    isBlocked,
    isLoggingIn,
    loginError,
    activeSection,
    currentModuleIndex,
    currentModule,
    completedModules,
    downloadedBonuses,
    videoProgress,
    completionTimestamps,
    totalPoints,
    streak,
    unlockedAchievementIds,
    sessionCompletedCount,
    totalWatchTimeMinutes,
    moduleNotes,
    bookmarkedModules,
    studentName,
    videoTimestampBookmarks,
    waitlistedCourses,
    vipGuest,
    transactions,
    monthlyGoal,
    darkMode,
    autoPlayNext,
    showCompletedBadge,
    soundEnabled,
    reducedMotion,
    showConfetti,
    showWelcome,
    showAchievementToast,
    showLogoutConfirm,
    showNotesModal,
    showKeyboardModal,
    showSettingsModal,
    showCertificateModal,
    showOnboarding,

    // Derived
    availableModules,
    totalModules,
    completedCount,
    progressPercent,
    timeRemaining,
    nextIncompleteModule,
    nextIncompleteModuleIndex,
    courseCompletionDate,
    unlockedAchievements,
    unlockedCount,
    currentModuleIndexRef,
    activeSectionRef,

    // Setters
    setActiveSection,
    setCurrentModuleIndex,
    setStudentName,
    setDarkMode,
    setShowConfetti,
    setShowWelcome,
    setShowAchievementToast,
    setShowLogoutConfirm,
    setShowNotesModal,
    setShowKeyboardModal,
    setShowSettingsModal,
    setShowCertificateModal,
    setShowOnboarding,

    // Actions
    handleLogin,
    handleLogout,
    startCourse,
    completeOnboarding,
    markComplete,
    handleVideoProgress,
    handleBonusDownload,
    toggleBookmark,
    saveNote,
    addTimestampBookmark,
    removeTimestampBookmark,
    toggleWaitlist,
    nextModule,
    prevModule,
    updateSettings,
    addTransaction,
    deleteTransaction,
    updateTransaction,
    setMonthlyGoal,
  }
}

// Export type for use in components
export type PlatformStateType = ReturnType<typeof usePlatformState>
