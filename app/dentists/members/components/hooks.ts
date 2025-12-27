'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { COURSE_MODULES, ACHIEVEMENTS, PlatformState, DEV_AUTO_LOGIN, VIP_GUESTS, BLOCKED_USERS } from './config'

const STORAGE_PREFIX = 'dentist_v4_'

// Custom hook for localStorage with SSR safety
function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(initialValue)

  useEffect(() => {
    try {
      const item = localStorage.getItem(STORAGE_PREFIX + key)
      if (item) {
        setStoredValue(JSON.parse(item))
      }
    } catch (error) {
      console.error(`Error reading ${key} from localStorage:`, error)
    }
  }, [key])

  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    setStoredValue(prev => {
      const newValue = value instanceof Function ? value(prev) : value
      try {
        localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(newValue))
      } catch (error) {
        console.error(`Error writing ${key} to localStorage:`, error)
      }
      return newValue
    })
  }, [key])

  return [storedValue, setValue]
}

// Main platform state hook with all logic
export function usePlatformState() {
  // Loading state
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isBlocked, setIsBlocked] = useState(false)

  // Navigation
  const [activeSection, setActiveSection] = useState<PlatformState['activeSection']>('dashboard')
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0)

  // Progress - using custom localStorage hook
  const [completedModules, setCompletedModules] = useLocalStorage<string[]>('completed', [])
  const [downloadedBonuses, setDownloadedBonuses] = useLocalStorage<string[]>('downloaded', [])
  const [videoProgress, setVideoProgress] = useLocalStorage<Record<string, { percent: number; seconds: number }>>('video_progress', {})
  const [completionTimestamps, setCompletionTimestamps] = useLocalStorage<Record<string, string>>('timestamps', {})

  // Gamification
  const [totalPoints, setTotalPoints] = useLocalStorage<number>('points', 0)
  const [streak, setStreak] = useLocalStorage<number>('streak', 1)
  const [unlockedAchievementIds, setUnlockedAchievementIds] = useLocalStorage<string[]>('unlocked', [])
  const [sessionCompletedCount, setSessionCompletedCount] = useState(0)
  const [totalWatchTimeMinutes, setTotalWatchTimeMinutes] = useLocalStorage<number>('watch_time', 0)

  // User features
  const [moduleNotes, setModuleNotes] = useLocalStorage<Record<string, string>>('notes', {})
  const [bookmarkedModules, setBookmarkedModules] = useLocalStorage<string[]>('bookmarks', [])
  const [studentName, setStudentName] = useLocalStorage<string>('name', '')
  const [videoTimestampBookmarks, setVideoTimestampBookmarks] = useLocalStorage<Record<string, { seconds: number; label: string }[]>>('timestamp_bookmarks', {})

  // Waitlist for coming soon courses
  const [waitlistedCourses, setWaitlistedCourses] = useLocalStorage<string[]>('waitlist', [])

  // VIP Guest info
  const [vipGuest, setVipGuest] = useLocalStorage<{ id: string; name: string; badge: string; welcomeMessage: string } | null>('vip_guest', null)

  // Settings
  const [darkMode, setDarkMode] = useLocalStorage<boolean>('dark_mode', false)
  const [autoPlayNext, setAutoPlayNext] = useLocalStorage<boolean>('autoplay', false)
  const [showCompletedBadge, setShowCompletedBadge] = useLocalStorage<boolean>('show_badge', true)
  const [soundEnabled, setSoundEnabled] = useLocalStorage<boolean>('sound_enabled', true)
  const [reducedMotion, setReducedMotion] = useState(false)

  // UI state
  const [showConfetti, setShowConfetti] = useState(false)
  const [showWelcome, setShowWelcome] = useLocalStorage<boolean>('show_welcome', true)
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
  const availableModules = COURSE_MODULES.filter(m => !m.comingSoon)
  const totalModules = availableModules.length
  const completedCount = completedModules.filter(id => availableModules.some(m => m.id === id)).length
  const progressPercent = totalModules > 0 ? (completedCount / totalModules) * 100 : 0
  const currentModule = COURSE_MODULES[currentModuleIndex]
  const timeRemaining = COURSE_MODULES.filter(m => !m.comingSoon && !completedModules.includes(m.id))
    .reduce((acc, m) => acc + m.durationMinutes, 0)

  // Achievement conditions
  const achievementConditions: Record<string, boolean> = {
    'first-video': completedCount >= 1,
    'halfway': progressPercent >= 50,
    'completed': progressPercent >= 100,
    'fast-learner': sessionCompletedCount >= 3,
    'bonus-collector': downloadedBonuses.length >= 5,
    'streak-3': streak >= 3,
    'streak-7': streak >= 7,
    'note-taker': Object.values(moduleNotes).some(note => note && note.length > 0),
    'bookworm': bookmarkedModules.length >= 3,
  }

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
        const achievement = ACHIEVEMENTS.find(a => a.id === id)
        return sum + (achievement?.points || 0)
      }, 0)

      if (pointsToAdd > 0) {
        setTotalPoints(prev => prev + pointsToAdd)
      }

      // Show toast for first unlocked (extended to 5s)
      const firstUnlocked = ACHIEVEMENTS.find(a => a.id === newlyUnlocked[0])
      if (firstUnlocked) {
        setShowAchievementToast(firstUnlocked.name)
        setTimeout(() => setShowAchievementToast(null), 5000)
      }
    }
  }, [achievementConditions, unlockedAchievementIds, isLoading])

  // Initialize on mount
  useEffect(() => {
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
      // diffDays === 0 means same day, keep current streak (already loaded by useLocalStorage)
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

    // Check auth
    if (DEV_AUTO_LOGIN) {
      setIsAuthenticated(true)
    } else {
      const savedAuth = localStorage.getItem('dentistMemberAuth')
      const savedVipGuest = localStorage.getItem(STORAGE_PREFIX + 'vip_guest')

      // Check if user is blocked (e.g., refunded)
      if (savedVipGuest) {
        try {
          const vipData = JSON.parse(savedVipGuest)
          if (vipData?.id && BLOCKED_USERS.includes(vipData.id)) {
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

      if (savedAuth === 'true') setIsAuthenticated(true)
    }

    // Check if first visit for onboarding
    const hasOnboarded = localStorage.getItem(STORAGE_PREFIX + 'onboarded')
    if (!hasOnboarded) {
      setShowOnboarding(true)
    }

    setIsLoading(false)

    return () => motionQuery.removeEventListener('change', handleMotionChange)
  }, [])

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
  }, [sessionCompletedCount])

  // Actions
  const handleLogin = useCallback((password: string): boolean => {
    const trimmedPassword = password.trim()

    // Check for VIP guest login first (case-insensitive)
    const vipGuestMatch = VIP_GUESTS.find(g => g.password.toLowerCase() === trimmedPassword.toLowerCase())
    if (vipGuestMatch) {
      setIsAuthenticated(true)
      setVipGuest({
        id: vipGuestMatch.id,
        name: vipGuestMatch.name,
        badge: vipGuestMatch.badge,
        welcomeMessage: vipGuestMatch.welcomeMessage,
      })
      setStudentName(vipGuestMatch.name)
      localStorage.setItem('dentistMemberAuth', 'true')
      return true
    }

    // Regular password check
    if (trimmedPassword.toLowerCase() === 'dentist2026') {
      setIsAuthenticated(true)
      setVipGuest(null) // Clear any VIP status
      localStorage.setItem('dentistMemberAuth', 'true')
      return true
    }
    return false
  }, [])

  const handleLogout = useCallback(() => {
    setIsAuthenticated(false)
    setVipGuest(null)
    localStorage.removeItem('dentistMemberAuth')
    setShowLogoutConfirm(false)
  }, [])

  const startCourse = useCallback(() => {
    setShowWelcome(false)
  }, [])

  const completeOnboarding = useCallback(() => {
    setShowOnboarding(false)
    localStorage.setItem(STORAGE_PREFIX + 'onboarded', 'true')
  }, [])

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
      if (autoPlayNext && currentModuleIndex < COURSE_MODULES.length - 1 && !COURSE_MODULES[currentModuleIndex + 1]?.comingSoon) {
        setTimeout(() => setCurrentModuleIndex(currentModuleIndex + 1), 2000)
      }
    }
  }, [completedModules, currentModule, autoPlayNext, currentModuleIndex, reducedMotion])

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
      // Don't add duplicate timestamps (within 5 seconds)
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

  const nextModule = useCallback(() => {
    if (currentModuleIndex < COURSE_MODULES.length - 1 && !COURSE_MODULES[currentModuleIndex + 1].comingSoon) {
      setCurrentModuleIndex(currentModuleIndex + 1)
    }
  }, [currentModuleIndex])

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
  const nextIncompleteModuleIndex = nextIncompleteModule ? COURSE_MODULES.findIndex(m => m.id === nextIncompleteModule.id) : 0

  // Get completion date for certificate
  const courseCompletionDate = progressPercent >= 100 && Object.keys(completionTimestamps).length > 0
    ? new Date(Math.max(...Object.values(completionTimestamps).map(t => new Date(t).getTime()))).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : ''

  // Unlocked achievements map
  const unlockedAchievements: Record<string, boolean> = {}
  ACHIEVEMENTS.forEach(a => {
    unlockedAchievements[a.id] = achievementConditions[a.id] || unlockedAchievementIds.includes(a.id)
  })
  const unlockedCount = Object.values(unlockedAchievements).filter(Boolean).length

  return {
    // State
    isLoading,
    isAuthenticated,
    isBlocked,
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
  }
}

// Keyboard shortcuts hook
export function useKeyboardShortcuts(
  state: ReturnType<typeof usePlatformState>
) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if typing in input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return

      // Escape to close any modal
      if (e.key === 'Escape') {
        if (state.showNotesModal) state.setShowNotesModal(false)
        if (state.showKeyboardModal) state.setShowKeyboardModal(false)
        if (state.showSettingsModal) state.setShowSettingsModal(false)
        if (state.showCertificateModal) state.setShowCertificateModal(false)
        if (state.showLogoutConfirm) state.setShowLogoutConfirm(false)
        return
      }

      if (e.key === '?') {
        state.setShowKeyboardModal(true)
        return
      }

      if (e.key.toLowerCase() === 'd' && !e.metaKey && !e.ctrlKey) {
        state.setDarkMode(d => !d)
        return
      }

      if (e.key.toLowerCase() === 'n' && !e.metaKey && !e.ctrlKey) {
        if (state.activeSectionRef.current === 'course') {
          state.setShowNotesModal(true)
        }
        return
      }

      if (e.key.toLowerCase() === 'b' && !e.metaKey && !e.ctrlKey) {
        if (state.activeSectionRef.current === 'course') {
          state.toggleBookmark(state.currentModule.id)
        }
        return
      }

      if (e.key.toLowerCase() === 'm' && !e.metaKey && !e.ctrlKey) {
        if (state.activeSectionRef.current === 'course') {
          state.markComplete()
        }
        return
      }

      if (state.activeSectionRef.current === 'course') {
        const idx = state.currentModuleIndexRef.current
        if (e.key === 'ArrowRight' && idx < COURSE_MODULES.length - 1 && !COURSE_MODULES[idx + 1]?.comingSoon) {
          state.setCurrentModuleIndex(idx + 1)
        } else if (e.key === 'ArrowLeft' && idx > 0) {
          state.setCurrentModuleIndex(idx - 1)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [state])
}
