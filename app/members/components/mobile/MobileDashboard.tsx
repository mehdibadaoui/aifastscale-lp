'use client'

import { memo, useState, useEffect } from 'react'
import {
  Play, Clock, Star, Flame, Trophy, Gift, ChevronRight,
  ChevronDown, ChevronUp, Sparkles, TrendingUp, Shield, Zap
} from 'lucide-react'
import {
  HorizontalScroll,
  TouchButton,
  MobileAnimatedNumber,
  CoachTip,
  useHapticFeedback
} from './MobileNavigation'

// ============================================
// MOBILE DASHBOARD
// ============================================

interface MobileDashboardProps {
  state: {
    studentName: string | null
    progressPercent: number
    completedCount: number
    totalModules: number
    timeRemaining: number
    totalWatchTimeMinutes: number
    totalPoints: number
    streak: number
    unlockedCount: number
    nextIncompleteModule: any
    nextIncompleteModuleIndex: number
    videoProgress: Record<string, any>
    setCurrentModuleIndex: (index: number) => void
    setActiveSection: (section: any) => void
    config: any
  }
}

export const MobileDashboard = memo(function MobileDashboard({ state }: MobileDashboardProps) {
  const [showWhatsNew, setShowWhatsNew] = useState(false)
  const [showFirstTimeTip, setShowFirstTimeTip] = useState(false)
  const haptic = useHapticFeedback()

  // Calculate total bonus value
  const totalBonusValue = state.config.bonuses?.reduce((sum: number, b: any) => sum + (b.value || 0), 0) || 0

  // Check if first time (no progress)
  const isFirstTime = state.progressPercent === 0

  // Show first-time tip after delay
  useEffect(() => {
    if (isFirstTime) {
      const timer = setTimeout(() => setShowFirstTimeTip(true), 1500)
      return () => clearTimeout(timer)
    }
  }, [isFirstTime])

  const resumeSeconds = state.nextIncompleteModule
    ? state.videoProgress[state.nextIncompleteModule.id]?.seconds || 0
    : 0

  const handleContinueLearning = () => {
    haptic.trigger('medium')
    state.setCurrentModuleIndex(state.nextIncompleteModuleIndex)
    state.setActiveSection('course')
  }

  return (
    <div className="px-4 py-6 space-y-6 animate-fade-in">
      {/* WELCOME CARD */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500/15 via-amber-500/5 to-transparent border border-amber-500/20 p-5">
        {/* Glow orbs */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-500/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-5 -left-5 w-20 h-20 bg-yellow-500/20 rounded-full blur-2xl" />

        <div className="relative">
          {/* Greeting */}
          <p className="text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
            Welcome back
          </p>
          <h1 className="text-2xl font-black text-white mb-4">
            {state.studentName || 'Student'}
          </h1>

          {/* Progress */}
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-white/50">
              {state.completedCount} of {state.totalModules} modules
            </span>
            <span className="text-amber-400 font-bold">
              {state.timeRemaining} min left
            </span>
          </div>

          {/* Progress bar */}
          <div className="h-3 bg-black/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full transition-all duration-1000"
              style={{ width: `${state.progressPercent}%` }}
            />
          </div>

          {/* Progress percentage */}
          <div className="flex justify-end mt-2">
            <span className="text-2xl font-black text-white">
              <MobileAnimatedNumber value={Math.round(state.progressPercent)} suffix="%" />
            </span>
          </div>
        </div>
      </div>

      {/* PRIMARY CTA - CONTINUE LEARNING */}
      <div className="relative">
        {showFirstTimeTip && (
          <CoachTip
            text="Tap here to start your first lesson!"
            position="top"
            onDismiss={() => setShowFirstTimeTip(false)}
          />
        )}

        <button
          onClick={handleContinueLearning}
          className="w-full relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 p-5 shadow-lg shadow-amber-500/30 active:scale-[0.98] transition-transform"
        >
          {/* Shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shine" />

          <div className="relative flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-black/20 flex items-center justify-center">
              <Play className="w-8 h-8 text-white" fill="white" />
            </div>
            <div className="flex-1 text-left">
              {state.progressPercent > 0 ? (
                <>
                  <p className="text-black/60 text-xs font-bold uppercase tracking-wider">
                    Module {state.nextIncompleteModule?.number}
                  </p>
                  <p className="text-black text-lg font-black leading-tight truncate">
                    {state.nextIncompleteModule?.title || 'Continue Learning'}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="w-3.5 h-3.5 text-black/60" />
                    <span className="text-black/60 text-sm">
                      {state.nextIncompleteModule?.duration}
                    </span>
                    {resumeSeconds > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-black/20 text-black text-xs font-bold">
                        Resume {Math.floor(resumeSeconds / 60)}:{String(Math.floor(resumeSeconds % 60)).padStart(2, '0')}
                      </span>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <p className="text-black/60 text-xs font-bold uppercase tracking-wider">
                    Get Started
                  </p>
                  <p className="text-black text-lg font-black">
                    Start First Lesson
                  </p>
                  <p className="text-black/60 text-sm mt-1">
                    It only takes a few minutes
                  </p>
                </>
              )}
            </div>
            <ChevronRight className="w-6 h-6 text-black/60" />
          </div>
        </button>
      </div>

      {/* QUICK STATS - HORIZONTAL SCROLL */}
      <div>
        <h3 className="text-sm font-bold text-white/50 uppercase tracking-wider mb-3 px-1">
          Your Progress
        </h3>
        <HorizontalScroll>
          {[
            {
              icon: TrendingUp,
              value: state.progressPercent,
              suffix: '%',
              label: 'Complete',
              gradient: 'from-amber-500 to-yellow-500'
            },
            {
              icon: Flame,
              value: state.streak,
              suffix: 'd',
              label: 'Streak',
              gradient: 'from-orange-500 to-red-500'
            },
            {
              icon: Star,
              value: state.totalPoints,
              suffix: '',
              label: 'Points',
              gradient: 'from-amber-500 to-orange-500'
            },
            {
              icon: Trophy,
              value: state.unlockedCount,
              suffix: `/${state.config.achievements?.length || 0}`,
              label: 'Badges',
              gradient: 'from-emerald-500 to-teal-500'
            },
            {
              icon: Clock,
              value: state.totalWatchTimeMinutes,
              suffix: 'm',
              label: 'Watched',
              gradient: 'from-blue-500 to-cyan-500'
            },
          ].map((stat, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-28 snap-start rounded-2xl bg-white/5 border border-white/10 p-4"
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center mb-3`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <p className="text-xl font-black text-white">
                <MobileAnimatedNumber value={stat.value} suffix={stat.suffix} />
              </p>
              <p className="text-xs text-white/40 font-medium">{stat.label}</p>
            </div>
          ))}
        </HorizontalScroll>
      </div>

      {/* VALUE REMINDER */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-500/10 to-transparent border border-emerald-500/20 p-4">
        <div className="absolute -top-5 -right-5 w-20 h-20 bg-emerald-500/20 rounded-full blur-2xl" />

        <div className="relative flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-white/50 text-xs font-medium">Value Unlocked</p>
            <p className="text-xl font-black text-emerald-400">
              $<MobileAnimatedNumber value={totalBonusValue + 997} />
            </p>
          </div>
          <button
            onClick={() => {
              haptic.trigger('light')
              state.setActiveSection('bonuses')
            }}
            className="px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-400 text-sm font-bold active:scale-95 transition-transform"
          >
            View
          </button>
        </div>
      </div>

      {/* QUICK ACTIONS */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => {
            haptic.trigger('light')
            state.setActiveSection('bonuses')
          }}
          className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/5 border border-white/10 active:bg-white/10 active:scale-[0.98] transition-all"
        >
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center shadow-lg">
            <Gift className="w-6 h-6 text-white" />
          </div>
          <span className="text-sm font-bold text-white">Bonuses</span>
          <span className="text-xs text-white/40">{state.config.bonuses?.length || 0} resources</span>
        </button>

        <button
          onClick={() => {
            haptic.trigger('light')
            state.setActiveSection('achievements')
          }}
          className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/5 border border-white/10 active:bg-white/10 active:scale-[0.98] transition-all"
        >
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <span className="text-sm font-bold text-white">Achievements</span>
          <span className="text-xs text-white/40">{state.unlockedCount} unlocked</span>
        </button>
      </div>

      {/* WHAT'S NEW - COLLAPSIBLE */}
      <div className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
        <button
          onClick={() => {
            haptic.trigger('light')
            setShowWhatsNew(!showWhatsNew)
          }}
          className="w-full flex items-center justify-between p-4 active:bg-white/5 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-yellow-500/10 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-amber-400" />
            </div>
            <div className="text-left">
              <p className="font-bold text-white">What's New</p>
              <p className="text-xs text-white/40">Latest updates & features</p>
            </div>
          </div>
          {showWhatsNew ? (
            <ChevronUp className="w-5 h-5 text-white/40" />
          ) : (
            <ChevronDown className="w-5 h-5 text-white/40" />
          )}
        </button>

        {showWhatsNew && (
          <div className="px-4 pb-4 space-y-3 animate-fade-in">
            {[
              { type: 'new', title: 'New AI Image Tool', desc: 'Generate unlimited photos' },
              { type: 'coming', title: 'Script Templates', desc: 'Coming this week' },
              { type: 'update', title: 'Mobile Editing Guide', desc: 'Updated for 2026' },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-3 rounded-xl bg-white/5"
              >
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold text-white ${
                  item.type === 'new' ? 'bg-emerald-500' :
                  item.type === 'coming' ? 'bg-amber-500' : 'bg-blue-500'
                }`}>
                  {item.type === 'new' ? 'New' : item.type === 'coming' ? 'Soon' : 'Update'}
                </span>
                <div>
                  <p className="text-sm font-medium text-white">{item.title}</p>
                  <p className="text-xs text-white/40">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
})

// Add shine animation to global CSS or tailwind config
// @keyframes shine {
//   to { transform: translateX(100%); }
// }
// .animate-shine { animation: shine 2s infinite; }

export default MobileDashboard
