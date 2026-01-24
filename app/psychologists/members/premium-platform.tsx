'use client'

import React, { memo, useCallback } from 'react'
import {
  GraduationCap, Home, Video, Gift, Trophy, Star, Flame, Moon, Sun,
  Settings, LogOut, Sparkles, ArrowRight, HelpCircle, Crown, ChevronUp,
  Eye, EyeOff, Mail
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
  onLogin: (email: string, password: string, rememberMe: boolean) => Promise<boolean>
  isLoggingIn: boolean
  loginError: string | null
}

const LoginScreen = memo(function LoginScreen({ onLogin, isLoggingIn, loginError }: LoginScreenProps) {
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [showPassword, setShowPassword] = React.useState(false)
  const [rememberMe, setRememberMe] = React.useState(true)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onLogin(email.trim(), password, rememberMe)
  }

  // Pre-filled support email for password help
  const supportEmail = COURSE_CONFIG.supportEmail || 'hello@aifastscale.com'
  const forgotPasswordMailto = `mailto:${supportEmail}?subject=Password%20Help%20-%20CloneYourself%20for%20Plastic Surgeons&body=Hi%2C%0A%0AI%20need%20help%20with%20my%20login.%0A%0AMy%20email%3A%20${encodeURIComponent(email || '[your email]')}%0A%0APlease%20resend%20my%20password.%0A%0AThank%20you!`

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gradient-premium">
      {/* Floating Gradient Orbs - LP Style */}
      <div className="absolute top-20 right-10 w-80 h-80 bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 rounded-full blur-3xl floating-slow" />
      <div className="absolute bottom-20 left-10 w-64 h-64 bg-gradient-to-br from-cyan-500/8 to-cyan-500/5 rounded-full blur-3xl floating" style={{ animationDelay: '2s' }} />

      <div className="relative z-10 w-full max-w-md">
        {/* VIP Badge */}
        <div className="flex justify-center mb-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-premium border border-cyan-500/30 shadow-lg shadow-cyan-500/10">
            <Star className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-bold text-cyan-400 tracking-wider uppercase">VIP Member Access</span>
            <Star className="w-4 h-4 text-cyan-400" />
          </div>
        </div>

        <div className="glass-premium backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl shadow-cyan-500/20 border border-cyan-500/20 p-6 sm:p-8">
          <div className="text-center mb-6 sm:mb-8">
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-xl sm:rounded-2xl bg-gradient-to-br from-cyan-500 to-cyan-500 flex items-center justify-center shadow-glow-teal mb-4 sm:mb-6">
              <GraduationCap className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">{COURSE_CONFIG.title}</h1>
            <p className="text-cyan-400 font-bold text-base sm:text-lg">{COURSE_CONFIG.subtitle}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-slate-300 text-sm font-semibold mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                autoComplete="email"
                className="w-full px-4 sm:px-5 py-3.5 sm:py-4 rounded-xl glass-dark border-2 border-cyan-500/30 text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-4 focus:ring-cyan-500/20 transition-all text-base"
              />
            </div>

            {/* Password Field with Show/Hide Toggle */}
            <div>
              <label htmlFor="password" className="block text-slate-300 text-sm font-semibold mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="From your welcome email"
                  autoComplete="current-password"
                  className="w-full px-4 sm:px-5 py-3.5 sm:py-4 pr-12 rounded-xl glass-dark border-2 border-cyan-500/30 text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-4 focus:ring-cyan-500/20 transition-all text-base"
                  aria-describedby={loginError ? 'login-error' : undefined}
                />
                {/* Eye Toggle Button */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-cyan-400 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {/* Paste hint */}
              <p className="mt-1.5 text-slate-500 text-xs">
                Tip: Paste your password and click the eye to verify it
              </p>
            </div>

            {/* Remember Me Checkbox */}
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-5 h-5 rounded border-2 border-cyan-500/40 bg-transparent peer-checked:bg-cyan-500 peer-checked:border-cyan-500 transition-all flex items-center justify-center">
                  {rememberMe && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
              <span className="text-sm text-slate-300 group-hover:text-white transition-colors">
                Remember me for 30 days
              </span>
            </label>

            {loginError && (
              <div id="login-error" className="p-3 sm:p-4 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 text-sm text-center font-medium" role="alert">
                {loginError}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoggingIn || !password}
              className="btn-premium w-full py-3.5 sm:py-4 rounded-xl font-bold text-base sm:text-lg text-white shadow-glow-teal animate-pulse-glow focus-ring touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed disabled:animate-none"
            >
              {isLoggingIn ? 'Verifying...' : 'Access My Course'}
            </button>
          </form>

          {/* Help Text */}
          <p className="mt-5 sm:mt-6 text-center text-slate-300 text-xs sm:text-sm">
            Tip: Paste your password and click the eye to verify it
          </p>

          {/* Forgot Password Link - Opens Email */}
          <a
            href={forgotPasswordMailto}
            className="mt-3 flex items-center justify-center gap-1.5 text-cyan-400/80 text-xs hover:text-purple-300 transition-colors"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Forgot password? Check your welcome email or contact support</span>
          </a>
        </div>
      </div>
    </div>
  )
})

// ============================================
// BLOCKED/PAYMENT REQUIRED SCREEN
// ============================================

const WHOP_CHECKOUT_LINK = 'https://whop.com/checkout/plan_9AqdDmQnJC2J5'

const BlockedScreen = memo(function BlockedScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gradient-premium">
      {/* Floating Gradient Orbs - LP Style */}
      <div className="absolute top-20 right-10 w-80 h-80 bg-gradient-to-br from-red-500/10 to-orange-500/5 rounded-full blur-3xl floating-slow" />
      <div className="absolute bottom-20 left-10 w-64 h-64 bg-gradient-to-br from-orange-500/8 to-red-500/5 rounded-full blur-3xl floating" style={{ animationDelay: '2s' }} />

      <div className="relative z-10 w-full max-w-lg">
        <div className="glass-premium backdrop-blur-xl rounded-3xl shadow-2xl border border-red-500/20 p-8 text-center">
          {/* Icon */}
          <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shadow-lg shadow-red-500/30 mb-6">
            <LogOut className="w-10 h-10 text-white" />
          </div>

          {/* Title */}
          <h1 className="text-3xl font-black text-white mb-3">
            Access Expired
          </h1>
          <p className="text-slate-400 text-lg mb-8">
            Your subscription has been cancelled or refunded. To regain full access to the course and all bonuses, please purchase again.
          </p>

          {/* CTA Button */}
          <a
            href={WHOP_CHECKOUT_LINK}
            className="btn-premium inline-flex items-center justify-center gap-2 w-full py-4 rounded-xl font-bold text-lg text-white shadow-glow-teal focus-ring"
          >
            <Sparkles className="w-5 h-5" />
            Get Access Now - $47
            <ArrowRight className="w-5 h-5" />
          </a>

          {/* Support link */}
          <p className="mt-6 text-slate-500 text-sm">
            Need help? Contact{' '}
            <a href={`mailto:${COURSE_CONFIG.supportEmail}`} className="text-cyan-400 hover:underline">
              {COURSE_CONFIG.supportEmail}
            </a>
          </p>
        </div>
      </div>
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
    { icon: Video, label: 'HD Modules', value: COURSE_MODULES.filter(m => !m.comingSoon).length, gradient: 'from-cyan-500 to-cyan-500' },
    { icon: Gift, label: 'Bonuses', value: BONUSES.length, gradient: 'from-cyan-500 to-blue-500' },
    { icon: Star, label: 'Total Value', value: `$${BONUSES.reduce((acc, b) => acc + b.value, 0)}`, gradient: 'from-emerald-500 to-cyan-500' },
    { icon: Trophy, label: 'Achievements', value: ACHIEVEMENTS.length, gradient: 'from-cyan-500 to-orange-500' },
  ]

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 sm:p-4 bg-gradient-premium relative overflow-hidden">
      {/* Floating Gradient Orbs - LP Style */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className={`absolute top-1/4 right-0 w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] bg-gradient-to-br from-cyan-500/15 to-cyan-500/10 rounded-full blur-3xl ${reducedMotion ? '' : 'floating-slow'}`} />
        <div className={`absolute bottom-1/4 left-0 w-[250px] sm:w-[500px] h-[250px] sm:h-[500px] bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 rounded-full blur-3xl ${reducedMotion ? '' : 'floating'}`} style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 text-center max-w-4xl mx-auto w-full">
        <div className="mb-6 sm:mb-8">
          <div className={`w-16 h-16 sm:w-24 sm:h-24 mx-auto rounded-2xl sm:rounded-3xl bg-gradient-to-br from-cyan-500 to-cyan-500 flex items-center justify-center shadow-glow-teal ${reducedMotion ? '' : 'animate-bounce-slow'}`}>
            <Sparkles className="w-8 h-8 sm:w-12 sm:h-12 text-white" />
          </div>
        </div>

        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black mb-4 sm:mb-6 text-white leading-tight drop-shadow-lg">
          Welcome to Your <span className={`text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-cyan-400 ${reducedMotion ? '' : 'gradient-text-animated'}`}>Premium Course</span>
        </h1>

        <p className="text-base sm:text-xl text-slate-300 mb-6 sm:mb-8 max-w-2xl mx-auto px-2">
          Transform your aesthetic surgery practice with AI video marketing.
        </p>

        {/* Student Name Input - LP Glass Style */}
        <div className="max-w-md mx-auto mb-6 sm:mb-8">
          <label htmlFor="student-name" className="sr-only">Enter your name for your certificate</label>
          <input
            id="student-name"
            type="text"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            placeholder="Enter your name for your certificate"
            className="w-full px-4 sm:px-5 py-3.5 sm:py-4 rounded-xl glass-premium border-2 border-cyan-500/30 text-white placeholder-slate-500 text-center text-sm sm:text-base focus:border-cyan-400 focus:outline-none focus:ring-4 focus:ring-cyan-500/20 transition-all"
          />
        </div>

        {/* Welcome Stats - LP Glass Cards */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-8 sm:mb-12 max-w-2xl mx-auto">
          {statCards.map((stat, i) => (
            <div
              key={i}
              className="glass-premium backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-cyan-500/20 animate-fade-in hover-lift"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br ${stat.gradient} rounded-xl flex items-center justify-center mx-auto mb-2 sm:mb-3 shadow-lg`}>
                <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white">{stat.value}</div>
              <div className="text-slate-400 text-xs sm:text-sm font-medium">{stat.label}</div>
            </div>
          ))}
        </div>

        <button
          onClick={onStart}
          className="btn-premium group inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-10 py-4 sm:py-5 rounded-xl sm:rounded-2xl font-bold text-base sm:text-xl text-white shadow-glow-teal animate-pulse-glow focus-ring touch-manipulation"
        >
          Enter My Dashboard
          <ArrowRight className={`w-5 h-5 sm:w-6 sm:h-6 ${reducedMotion ? '' : 'group-hover:translate-x-1 transition-transform'}`} />
        </button>

        <p className="mt-6 sm:mt-8 text-slate-500 text-xs sm:text-sm">{TOTAL_RUNTIME} minutes of premium training</p>
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
    <nav className="sticky top-0 z-40 glass-premium backdrop-blur-2xl border-b border-cyan-500/20 shadow-lg shadow-purple-900/20" role="navigation" aria-label="Main navigation">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-500 flex items-center justify-center shadow-glow-teal">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <div className="font-bold text-white">{COURSE_CONFIG.title}</div>
              <div className="text-xs text-cyan-400 font-medium">{COURSE_CONFIG.subtitle}</div>
            </div>
          </div>

          {/* Desktop Navigation Tabs - LP Glass Style */}
          <div className="hidden md:flex items-center glass-dark backdrop-blur-sm rounded-full p-1.5 border border-cyan-500/20" role="tablist">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 focus-ring ${
                  activeSection === tab.id
                    ? 'btn-premium text-white shadow-glow-teal scale-105'
                    : 'text-slate-400 hover:text-cyan-400 hover:bg-white/5'
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
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 glass-teal rounded-full">
              <Star className="w-4 h-4 text-cyan-400" aria-hidden="true" />
              <span className="text-sm font-bold text-cyan-400" aria-label={`${totalPoints} points`}>{totalPoints}</span>
            </div>

            {/* Streak */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 glass-teal rounded-full">
              <Flame className="w-4 h-4 text-orange-400" aria-hidden="true" />
              <span className="text-sm font-bold text-orange-400" aria-label={`${streak} day streak`}>{streak}</span>
            </div>

            {/* VIP Badge */}
            {vipGuest && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 glass-teal rounded-full border border-cyan-500/30">
                <Crown className="w-4 h-4 text-cyan-400" aria-hidden="true" />
                <span className="text-sm font-bold text-cyan-400">{vipGuest.badge}</span>
              </div>
            )}

            {/* Settings */}
            <button
              onClick={() => setShowSettingsModal(true)}
              className="p-2 rounded-xl hover:bg-white/10 transition-all text-slate-400 focus-ring"
              aria-label="Open settings"
            >
              <Settings className="w-5 h-5" />
            </button>

            {/* Keyboard shortcuts */}
            <button
              onClick={() => setShowKeyboardModal(true)}
              className="hidden md:block p-2 rounded-xl hover:bg-white/10 transition-all text-slate-400 focus-ring"
              aria-label="Show keyboard shortcuts"
            >
              <HelpCircle className="w-5 h-5" />
            </button>

            {/* Logout */}
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="p-2 rounded-xl hover:bg-white/10 transition-all text-slate-400 focus-ring"
              aria-label="Log out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation - LP Glass Style */}
      <div className="flex md:hidden border-t border-cyan-500/20" role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSection(tab.id)}
            className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-2 min-h-[48px] text-[10px] font-semibold transition-all touch-manipulation ${
              activeSection === tab.id
                ? 'text-cyan-400 bg-cyan-500/10 border-b-2 border-cyan-400'
                : 'text-slate-500 active:bg-white/5'
            }`}
            role="tab"
            aria-selected={activeSection === tab.id}
          >
            <tab.icon className="w-5 h-5" />
            {tab.label}
          </button>
        ))}

        {/* Integrated mini stats in nav */}
        <div className="flex items-center justify-center gap-2 px-2 border-l border-cyan-500/20">
          <div className="flex items-center gap-0.5">
            <Star className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[10px] font-bold text-cyan-400">{totalPoints}</span>
          </div>
          <div className="flex items-center gap-0.5">
            <Flame className="w-3.5 h-3.5 text-orange-400" />
            <span className="text-[10px] font-bold text-orange-400">{streak}</span>
          </div>
          {vipGuest && (
            <Crown className="w-3.5 h-3.5 text-cyan-400" />
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div className="glass-premium rounded-2xl shadow-2xl p-6 max-w-sm w-full border border-cyan-500/20" onClick={e => e.stopPropagation()}>
        <h3 className="text-xl font-black text-white mb-2">Log Out?</h3>
        <p className="text-slate-400 mb-6">Your progress is saved and will be here when you return.</p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 rounded-xl font-bold glass-dark text-slate-300 border border-cyan-500/20 hover:bg-white/10 transition-all focus-ring">
            Cancel
          </button>
          <button onClick={onConfirm} className="flex-1 py-3 rounded-xl font-bold bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg hover:shadow-red-500/30 transition-all focus-ring">
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

// Simple achievement sound using Web Audio API
function playAchievementSound() {
  try {
    const audioContext = new (window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()

    // Create a pleasant chime/bell sound
    const frequencies = [523.25, 659.25, 783.99] // C5, E5, G5 - major chord

    frequencies.forEach((freq, index) => {
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.frequency.value = freq
      oscillator.type = 'sine'

      const startTime = audioContext.currentTime + (index * 0.1)
      const duration = 0.3

      gainNode.gain.setValueAtTime(0, startTime)
      gainNode.gain.linearRampToValueAtTime(0.15, startTime + 0.02)
      gainNode.gain.linearRampToValueAtTime(0, startTime + duration)

      oscillator.start(startTime)
      oscillator.stop(startTime + duration)
    })
  } catch (e) {
    // Audio not supported, silently fail
  }
}

function PremiumCoursePlatformInner() {
  const state = usePlatformState()
  useKeyboardShortcuts(state)

  // Memoized sound callback that respects user settings
  const handleAchievementSound = useCallback(() => {
    if (state.soundEnabled) {
      playAchievementSound()
    }
  }, [state.soundEnabled])

  // Blocked user screen (refunded users)
  if (state.isBlocked) {
    return (
      <>
        <ThemeStyles />
        <BlockedScreen />
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
          isLoggingIn={state.isLoggingIn}
          loginError={state.loginError}
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

  // Main platform - LP Premium Theme
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-premium transition-colors duration-300">
      <ThemeStyles />

      {/* Floating Gradient Orbs - LP Style */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className={`absolute top-1/4 right-0 w-[400px] h-[400px] bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 rounded-full blur-3xl ${state.reducedMotion ? '' : 'floating-slow'}`} />
        <div className={`absolute bottom-1/4 left-0 w-[300px] h-[300px] bg-gradient-to-br from-cyan-500/8 to-cyan-500/5 rounded-full blur-3xl ${state.reducedMotion ? '' : 'floating'}`} style={{ animationDelay: '2s' }} />
        <div className={`absolute top-1/2 left-1/3 w-[200px] h-[200px] bg-gradient-to-br from-cyan-500/5 to-transparent rounded-full blur-3xl ${state.reducedMotion ? '' : 'floating'}`} style={{ animationDelay: '4s' }} />
      </div>

      {/* Skip to main content link */}
      <a href="#main-content" className="skip-link focus-ring">
        Skip to main content
      </a>

      {/* Effects */}
      <Confetti active={state.showConfetti} reducedMotion={state.reducedMotion} />
      <AchievementToast name={state.showAchievementToast} onPlaySound={handleAchievementSound} />

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

