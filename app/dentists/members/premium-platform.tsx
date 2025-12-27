'use client'

import { memo } from 'react'
import {
  GraduationCap, Home, Video, Gift, Trophy, Star, Flame, Moon, Sun,
  Settings, LogOut, Sparkles, ArrowRight, HelpCircle, Crown, ChevronUp
} from 'lucide-react'
import {
  COURSE_CONFIG, COURSE_MODULES, ACHIEVEMENTS, BONUSES, TOTAL_RUNTIME
} from './components/config'
import { usePlatformState, useKeyboardShortcuts } from './components/hooks'
import {
  ThemeStyles, Confetti, AchievementToast, Modal, NotesModal,
  KeyboardShortcutsModal, SettingsModal, CertificateModal, OnboardingTour,
  ErrorBoundary, AnimatedBackground
} from './components/ui'
import { DashboardSection, CourseSection, BonusesSection, AchievementsSection } from './components/sections'

// ============================================
// LOGIN SCREEN
// ============================================

interface LoginScreenProps {
  onLogin: (password: string) => boolean
  darkMode: boolean
  setDarkMode: (v: boolean | ((prev: boolean) => boolean)) => void
}

const LoginScreen = memo(function LoginScreen({ onLogin, darkMode, setDarkMode }: LoginScreenProps) {
  const [password, setPassword] = React.useState('')
  const [error, setError] = React.useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!onLogin(password)) {
      setError('Incorrect password. Check your thank-you page or contact support.')
    }
  }

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 relative overflow-hidden ${darkMode ? 'dark dark-premium-bg' : 'bg-gradient-to-br from-slate-50 via-white to-teal-50 mesh-gradient'}`}>
      {/* Animated Background */}
      <AnimatedBackground darkMode={darkMode} reducedMotion={false} />

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white dark:bg-slate-900 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl shadow-teal-500/20 dark:shadow-teal-500/10 border border-slate-200 dark:border-slate-700 p-6 sm:p-8">
          <div className="text-center mb-6 sm:mb-8">
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-xl sm:rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center shadow-xl shadow-teal-400/30 mb-4 sm:mb-6">
              <GraduationCap className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">{COURSE_CONFIG.title}</h1>
            <p className="text-teal-500 font-bold text-base sm:text-lg">{COURSE_CONFIG.subtitle}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            <div>
              <label htmlFor="password" className="block text-slate-700 dark:text-slate-300 text-sm font-semibold mb-2">
                Enter Your Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 sm:px-5 py-3.5 sm:py-4 rounded-xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-teal-500 dark:focus:border-teal-400 focus:outline-none focus:ring-4 focus:ring-teal-500/20 transition-all text-base"
                aria-describedby={error ? 'password-error' : undefined}
              />
            </div>
            {error && (
              <div id="password-error" className="p-3 sm:p-4 rounded-xl bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm text-center font-medium" role="alert">
                {error}
              </div>
            )}
            <button
              type="submit"
              className="w-full py-3.5 sm:py-4 rounded-xl font-bold text-base sm:text-lg text-white bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 active:scale-[0.98] transition-all shadow-lg shadow-teal-500/30 hover:shadow-xl hover:shadow-teal-500/40 btn-press focus-ring touch-manipulation"
            >
              Access My Course
            </button>
          </form>

          <p className="mt-5 sm:mt-6 text-center text-slate-500 dark:text-slate-400 text-xs sm:text-sm">
            Your password was shown on the thank-you page after purchase
          </p>
        </div>
      </div>

      {/* Dark mode toggle */}
      <button
        onClick={() => setDarkMode(d => !d)}
        className="fixed bottom-6 right-4 p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg hover:scale-105 active:scale-95 transition-all focus-ring touch-manipulation"
        aria-label="Toggle dark mode"
      >
        {darkMode ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5 text-slate-600" />}
      </button>
    </div>
  )
})

// ============================================
// BLOCKED/PAYMENT REQUIRED SCREEN
// ============================================

const WHOP_CHECKOUT_LINK = 'https://whop.com/checkout/plan_SxMS4HqFxJKNT'

interface BlockedScreenProps {
  darkMode: boolean
  setDarkMode: (v: boolean | ((prev: boolean) => boolean)) => void
}

const BlockedScreen = memo(function BlockedScreen({ darkMode, setDarkMode }: BlockedScreenProps) {
  return (
    <div className={`min-h-screen flex items-center justify-center p-4 relative overflow-hidden ${darkMode ? 'dark dark-premium-bg' : 'bg-gradient-to-br from-slate-50 via-white to-teal-50 mesh-gradient'}`}>
      {/* Animated Background */}
      <AnimatedBackground darkMode={darkMode} reducedMotion={false} />

      <div className="relative z-10 w-full max-w-lg">
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-red-400/10 border border-white/50 dark:border-slate-700/50 p-8 text-center">
          {/* Icon */}
          <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shadow-xl shadow-red-400/30 mb-6">
            <LogOut className="w-10 h-10 text-white" />
          </div>

          {/* Title */}
          <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-3">
            Access Expired
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg mb-8">
            Your subscription has been cancelled or refunded. To regain full access to the course and all bonuses, please purchase again.
          </p>

          {/* CTA Button */}
          <a
            href={WHOP_CHECKOUT_LINK}
            className="inline-flex items-center justify-center gap-2 w-full py-4 rounded-xl font-bold text-lg text-white bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 transition-all shadow-lg shadow-teal-400/30 hover:shadow-xl hover:shadow-teal-400/40 btn-press focus-ring"
          >
            <Sparkles className="w-5 h-5" />
            Get Access Now - $47
            <ArrowRight className="w-5 h-5" />
          </a>

          {/* Support link */}
          <p className="mt-6 text-slate-500 dark:text-slate-400 text-sm">
            Need help? Contact{' '}
            <a href={`mailto:${COURSE_CONFIG.supportEmail}`} className="text-teal-500 hover:underline">
              {COURSE_CONFIG.supportEmail}
            </a>
          </p>
        </div>
      </div>

      {/* Dark mode toggle */}
      <button
        onClick={() => setDarkMode(d => !d)}
        className="fixed bottom-4 right-4 p-3 rounded-xl bg-white dark:bg-slate-700/90 shadow-lg border border-slate-200 dark:border-slate-600 hover:scale-105 transition-all focus-ring"
        aria-label="Toggle dark mode"
      >
        {darkMode ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5 text-slate-600" />}
      </button>
    </div>
  )
})

// ============================================
// WELCOME SCREEN
// ============================================

interface WelcomeScreenProps {
  onStart: () => void
  studentName: string
  setStudentName: (name: string) => void
  darkMode: boolean
  reducedMotion: boolean
}

const WelcomeScreen = memo(function WelcomeScreen({ onStart, studentName, setStudentName, darkMode, reducedMotion }: WelcomeScreenProps) {
  const statCards = [
    { icon: Video, label: 'HD Modules', value: COURSE_MODULES.filter(m => !m.comingSoon).length, gradient: 'from-teal-500 to-cyan-500', iconBg: 'bg-teal-500/10', iconColor: 'text-teal-500' },
    { icon: Gift, label: 'Bonuses', value: BONUSES.length, gradient: 'from-cyan-500 to-blue-500', iconBg: 'bg-cyan-500/10', iconColor: 'text-cyan-500' },
    { icon: Star, label: 'Total Value', value: `$${BONUSES.reduce((acc, b) => acc + b.value, 0)}`, gradient: 'from-emerald-500 to-teal-500', iconBg: 'bg-emerald-500/10', iconColor: 'text-emerald-500' },
    { icon: Trophy, label: 'Achievements', value: ACHIEVEMENTS.length, gradient: 'from-amber-500 to-orange-500', iconBg: 'bg-amber-500/10', iconColor: 'text-amber-500' },
  ]

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 py-8 sm:p-4 ${darkMode ? 'dark bg-slate-950' : 'bg-gradient-to-br from-slate-100 via-white to-teal-50'}`}>
      {/* Enhanced Parallax Background */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        {/* Primary gradient orbs - smaller on mobile */}
        <div className={`absolute top-1/4 right-0 w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] bg-gradient-to-br from-teal-300/40 to-cyan-300/40 dark:from-teal-800/30 dark:to-cyan-800/30 rounded-full blur-3xl ${reducedMotion ? '' : 'animate-float'}`} />
        <div className={`absolute bottom-1/4 left-0 w-[250px] sm:w-[500px] h-[250px] sm:h-[500px] bg-gradient-to-br from-cyan-300/30 to-teal-300/30 dark:from-cyan-800/20 dark:to-teal-900/20 rounded-full blur-3xl ${reducedMotion ? '' : 'animate-float'}`} style={{ animationDelay: '2s' }} />

        {/* Floating particles - hidden on mobile for performance */}
        {!reducedMotion && (
          <div className="hidden sm:block">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 rounded-full bg-teal-400/50 dark:bg-teal-400/40 animate-float"
                style={{
                  left: `${15 + i * 15}%`,
                  top: `${20 + (i % 3) * 25}%`,
                  animationDelay: `${i * 0.5}s`,
                  animationDuration: `${4 + i}s`,
                }}
              />
            ))}
          </div>
        )}
      </div>

      <div className="relative z-10 text-center max-w-4xl mx-auto w-full">
        <div className="mb-6 sm:mb-8">
          <div className={`w-16 h-16 sm:w-24 sm:h-24 mx-auto rounded-2xl sm:rounded-3xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center shadow-2xl shadow-teal-500/40 ${reducedMotion ? '' : 'animate-bounce-slow'}`}>
            <Sparkles className="w-8 h-8 sm:w-12 sm:h-12 text-white" />
          </div>
        </div>

        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black mb-4 sm:mb-6 text-slate-900 dark:text-white leading-tight">
          Welcome to Your <span className={`text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-cyan-500 ${reducedMotion ? '' : 'gradient-text-animated'}`}>Premium Course</span>
        </h1>

        <p className="text-base sm:text-xl text-slate-600 dark:text-slate-300 mb-6 sm:mb-8 max-w-2xl mx-auto px-2">
          Transform your dental practice with AI video marketing.
        </p>

        {/* Student Name Input - Modern Design */}
        <div className="max-w-md mx-auto mb-6 sm:mb-8">
          <label htmlFor="student-name" className="sr-only">Enter your name for your certificate</label>
          <input
            id="student-name"
            type="text"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            placeholder="Enter your name for your certificate"
            className="w-full px-4 sm:px-5 py-3.5 sm:py-4 rounded-xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-center text-sm sm:text-base focus:border-teal-500 dark:focus:border-teal-400 focus:outline-none focus:ring-4 focus:ring-teal-500/20 transition-all shadow-lg shadow-slate-200/50 dark:shadow-none"
          />
        </div>

        {/* Welcome Stats - Modern Glass Cards */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-8 sm:mb-12 max-w-2xl mx-auto">
          {statCards.map((stat, i) => (
            <div
              key={i}
              className="bg-white dark:bg-slate-800/90 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 border border-slate-100 dark:border-slate-700 animate-fade-in hover:scale-[1.02] transition-transform"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className={`w-10 h-10 sm:w-12 sm:h-12 ${stat.iconBg} rounded-xl flex items-center justify-center mx-auto mb-2 sm:mb-3`}>
                <stat.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${stat.iconColor}`} />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">{stat.value}</div>
              <div className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-medium">{stat.label}</div>
            </div>
          ))}
        </div>

        <button
          onClick={onStart}
          className="group inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-10 py-4 sm:py-5 rounded-xl sm:rounded-2xl font-bold text-base sm:text-xl text-white bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 active:scale-[0.98] transition-all shadow-xl shadow-teal-500/30 hover:shadow-2xl hover:shadow-teal-500/40 btn-press focus-ring touch-manipulation"
        >
          Enter My Dashboard
          <ArrowRight className={`w-5 h-5 sm:w-6 sm:h-6 ${reducedMotion ? '' : 'group-hover:translate-x-1 transition-transform'}`} />
        </button>

        <p className="mt-6 sm:mt-8 text-slate-400 text-xs sm:text-sm">{TOTAL_RUNTIME} minutes of premium training</p>
      </div>
    </div>
  )
})

// ============================================
// MAIN NAVIGATION
// ============================================

interface NavigationProps {
  activeSection: 'dashboard' | 'course' | 'bonuses' | 'achievements'
  setActiveSection: (section: 'dashboard' | 'course' | 'bonuses' | 'achievements') => void
  totalPoints: number
  streak: number
  darkMode: boolean
  setDarkMode: (v: boolean | ((prev: boolean) => boolean)) => void
  setShowSettingsModal: (v: boolean) => void
  setShowKeyboardModal: (v: boolean) => void
  setShowLogoutConfirm: (v: boolean) => void
  vipGuest: { id: string; name: string; badge: string; welcomeMessage: string } | null
}

const Navigation = memo(function Navigation({
  activeSection, setActiveSection, totalPoints, streak, darkMode, setDarkMode,
  setShowSettingsModal, setShowKeyboardModal, setShowLogoutConfirm, vipGuest
}: NavigationProps) {
  const tabs = [
    { id: 'dashboard' as const, label: 'Dashboard', icon: Home },
    { id: 'course' as const, label: 'Course', icon: Video },
    { id: 'bonuses' as const, label: 'Bonuses', icon: Gift },
    { id: 'achievements' as const, label: 'Achievements', icon: Trophy },
  ]

  return (
    <nav className="sticky top-0 z-40 bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl border-b border-slate-200/30 dark:border-teal-500/10 shadow-lg shadow-slate-200/20 dark:shadow-teal-900/30" role="navigation" aria-label="Main navigation">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-teal-400/20">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <div className="font-bold text-slate-900 dark:text-white">{COURSE_CONFIG.title}</div>
              <div className="text-xs text-teal-500 font-medium">{COURSE_CONFIG.subtitle}</div>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <div className="hidden md:flex items-center bg-slate-100/80 dark:bg-slate-800/50 backdrop-blur-sm rounded-full p-1.5 border border-slate-200/50 dark:border-slate-700/50" role="tablist">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 focus-ring ${
                  activeSection === tab.id
                    ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg shadow-teal-500/30 scale-105'
                    : 'text-slate-600 dark:text-slate-400 hover:text-teal-500 dark:hover:text-teal-300 hover:bg-white/50 dark:hover:bg-slate-700/50'
                }`}
                role="tab"
                aria-selected={activeSection === tab.id}
                aria-controls={`${tab.id}-panel`}
              >
                <tab.icon className="w-4 h-4" aria-hidden="true" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-2">
            {/* Points */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-amber-50 dark:bg-amber-900/30 rounded-full">
              <Star className="w-4 h-4 text-amber-500" aria-hidden="true" />
              <span className="text-sm font-bold text-amber-700 dark:text-amber-400" aria-label={`${totalPoints} points`}>{totalPoints}</span>
            </div>

            {/* Streak */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-orange-50 dark:bg-orange-900/30 rounded-full">
              <Flame className="w-4 h-4 text-orange-500" aria-hidden="true" />
              <span className="text-sm font-bold text-orange-700 dark:text-orange-400" aria-label={`${streak} day streak`}>{streak}</span>
            </div>

            {/* VIP Badge */}
            {vipGuest && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-purple-500/20 to-pink-500/20 dark:from-purple-500/30 dark:to-pink-500/30 rounded-full border border-purple-400/30">
                <Crown className="w-4 h-4 text-purple-500" aria-hidden="true" />
                <span className="text-sm font-bold text-purple-700 dark:text-purple-300">{vipGuest.badge}</span>
              </div>
            )}

            {/* Dark mode toggle */}
            <button
              onClick={() => setDarkMode(d => !d)}
              className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-slate-500 dark:text-slate-400 focus-ring"
              aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Settings */}
            <button
              onClick={() => setShowSettingsModal(true)}
              className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-slate-500 dark:text-slate-400 focus-ring"
              aria-label="Open settings"
            >
              <Settings className="w-5 h-5" />
            </button>

            {/* Keyboard shortcuts */}
            <button
              onClick={() => setShowKeyboardModal(true)}
              className="hidden md:block p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-slate-500 dark:text-slate-400 focus-ring"
              aria-label="Show keyboard shortcuts"
            >
              <HelpCircle className="w-5 h-5" />
            </button>

            {/* Logout */}
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-slate-500 dark:text-slate-400 focus-ring"
              aria-label="Log out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation - Compact with integrated stats */}
      <div className="flex md:hidden border-t border-slate-200/50 dark:border-slate-700/50" role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSection(tab.id)}
            className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-2 min-h-[48px] text-[10px] font-semibold transition-all touch-manipulation ${
              activeSection === tab.id
                ? 'text-teal-500 dark:text-teal-300 bg-teal-50/50 dark:bg-teal-900/20 border-b-2 border-teal-500'
                : 'text-slate-500 dark:text-slate-400 active:bg-slate-100 dark:active:bg-slate-800'
            }`}
            role="tab"
            aria-selected={activeSection === tab.id}
          >
            <tab.icon className="w-5 h-5" />
            {tab.label}
          </button>
        ))}

        {/* Integrated mini stats in nav */}
        <div className="flex items-center justify-center gap-2 px-2 border-l border-slate-200/50 dark:border-slate-700/50">
          <div className="flex items-center gap-0.5">
            <Star className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400">{totalPoints}</span>
          </div>
          <div className="flex items-center gap-0.5">
            <Flame className="w-3.5 h-3.5 text-orange-500" />
            <span className="text-[10px] font-bold text-orange-700 dark:text-orange-400">{streak}</span>
          </div>
          {vipGuest && (
            <Crown className="w-3.5 h-3.5 text-purple-500" />
          )}
        </div>
      </div>
    </nav>
  )
})

// ============================================
// LOGOUT CONFIRM MODAL
// ============================================

interface LogoutModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
}

const LogoutModal = memo(function LogoutModal({ isOpen, onClose, onConfirm }: LogoutModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-6 max-w-sm w-full" onClick={e => e.stopPropagation()}>
        <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">Log Out?</h3>
        <p className="text-slate-600 dark:text-slate-400 mb-6">Your progress is saved and will be here when you return.</p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 rounded-xl font-bold bg-white dark:bg-slate-700/80 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600 transition-all focus-ring">
            Cancel
          </button>
          <button onClick={onConfirm} className="flex-1 py-3 rounded-xl font-bold bg-red-500 text-white hover:bg-red-600 transition-all focus-ring">
            Log Out
          </button>
        </div>
      </div>
    </div>
  )
})

// ============================================
// MAIN PLATFORM COMPONENT
// ============================================

function PremiumCoursePlatformInner() {
  const state = usePlatformState()
  useKeyboardShortcuts(state)

  // Blocked user screen (refunded users)
  if (state.isBlocked) {
    return (
      <>
        <ThemeStyles />
        <BlockedScreen
          darkMode={state.darkMode}
          setDarkMode={state.setDarkMode}
        />
      </>
    )
  }

  // Login screen
  if (!state.isAuthenticated) {
    return (
      <>
        <ThemeStyles />
        <LoginScreen
          onLogin={state.handleLogin}
          darkMode={state.darkMode}
          setDarkMode={state.setDarkMode}
        />
      </>
    )
  }

  // Welcome screen
  if (state.showWelcome) {
    return (
      <>
        <ThemeStyles />
        <WelcomeScreen
          onStart={state.startCourse}
          studentName={state.studentName}
          setStudentName={state.setStudentName}
          darkMode={state.darkMode}
          reducedMotion={state.reducedMotion}
        />
      </>
    )
  }

  // Main platform
  return (
    <div className={`min-h-screen relative overflow-hidden ${state.darkMode ? 'dark dark-premium-bg' : 'bg-gradient-to-br from-slate-50 via-white to-teal-50 mesh-gradient'}`}>
      <ThemeStyles />

      {/* Premium Animated Background */}
      <AnimatedBackground darkMode={state.darkMode} reducedMotion={state.reducedMotion} />

      {/* Skip to main content link */}
      <a href="#main-content" className="skip-link focus-ring">
        Skip to main content
      </a>

      {/* Effects */}
      <Confetti active={state.showConfetti} reducedMotion={state.reducedMotion} />
      <AchievementToast name={state.showAchievementToast} />

      {/* Modals */}
      <OnboardingTour isOpen={state.showOnboarding} onComplete={state.completeOnboarding} />
      <LogoutModal isOpen={state.showLogoutConfirm} onClose={() => state.setShowLogoutConfirm(false)} onConfirm={state.handleLogout} />
      <NotesModal
        isOpen={state.showNotesModal}
        onClose={() => state.setShowNotesModal(false)}
        moduleId={state.currentModule.id}
        moduleTitle={state.currentModule.title}
        notes={state.moduleNotes[state.currentModule.id] || ''}
        onSave={(note) => state.saveNote(state.currentModule.id, note)}
      />
      <KeyboardShortcutsModal isOpen={state.showKeyboardModal} onClose={() => state.setShowKeyboardModal(false)} />
      <SettingsModal
        isOpen={state.showSettingsModal}
        onClose={() => state.setShowSettingsModal(false)}
        darkMode={state.darkMode}
        autoPlayNext={state.autoPlayNext}
        showCompletedBadge={state.showCompletedBadge}
        soundEnabled={state.soundEnabled}
        onUpdate={state.updateSettings}
      />
      <CertificateModal
        isOpen={state.showCertificateModal}
        onClose={() => state.setShowCertificateModal(false)}
        studentName={state.studentName}
        completionDate={state.courseCompletionDate}
      />

      {/* Navigation */}
      <Navigation
        activeSection={state.activeSection}
        setActiveSection={state.setActiveSection}
        totalPoints={state.totalPoints}
        streak={state.streak}
        darkMode={state.darkMode}
        setDarkMode={state.setDarkMode}
        setShowSettingsModal={state.setShowSettingsModal}
        setShowKeyboardModal={state.setShowKeyboardModal}
        setShowLogoutConfirm={state.setShowLogoutConfirm}
        vipGuest={state.vipGuest}
      />

      {/* Main Content */}
      <main id="main-content" className="relative z-10 max-w-7xl mx-auto px-4 lg:px-8 py-4 sm:py-8 pb-20 sm:pb-8" role="main">
        {state.activeSection === 'dashboard' && <DashboardSection state={state} />}
        {state.activeSection === 'course' && <CourseSection state={state} />}
        {state.activeSection === 'bonuses' && <BonusesSection state={state} />}
        {state.activeSection === 'achievements' && <AchievementsSection state={state} />}
      </main>
    </div>
  )
}

// Wrap with error boundary
export default function PremiumCoursePlatform() {
  return (
    <ErrorBoundary>
      <PremiumCoursePlatformInner />
    </ErrorBoundary>
  )
}

// Need React for useState in LoginScreen
import React from 'react'
