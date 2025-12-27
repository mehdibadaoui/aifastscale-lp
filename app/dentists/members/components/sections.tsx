'use client'

import { memo, useState, useEffect } from 'react'
import {
  Play, CheckCircle, Lock, Trophy, Gift, Star, Zap,
  ChevronRight, ChevronLeft, Clock, Download,
  Target, Flame, ArrowRight, Lightbulb,
  ExternalLink, BarChart3, Video,
  FileDown, Check, Bookmark, Search,
  StickyNote, BookmarkCheck, Home, MessageCircle, Award,
  Users, Globe, Bell, Sparkles, Crown, TrendingUp
} from 'lucide-react'
import {
  COURSE_CONFIG, COURSE_MODULES, BONUSES, BONUS_CATEGORIES, ACHIEVEMENTS,
  TOTAL_BONUS_VALUE, TOTAL_RUNTIME, CourseModule, COMING_SOON_COURSES, getMemberStats,
  ComingSoonCourse
} from './config'
import Image from 'next/image'
import { WistiaPlayer, Skeleton, DashboardSkeleton, ProgressRing, useSwipeGesture, useHaptic, FloatingActionButton } from './ui'
import { usePlatformState } from './hooks'

type PlatformStateType = ReturnType<typeof usePlatformState>

// ============================================
// DASHBOARD SECTION - REDESIGNED FOR MOBILE
// ============================================

interface DashboardProps {
  state: PlatformStateType
}

export const DashboardSection = memo(function DashboardSection({ state }: DashboardProps) {
  const [showWelcomeVideo, setShowWelcomeVideo] = useState(false)
  const [globalSearch, setGlobalSearch] = useState('')
  const [memberStats, setMemberStats] = useState(getMemberStats())

  useEffect(() => {
    const interval = setInterval(() => {
      setMemberStats(getMemberStats())
    }, 60000)
    return () => clearInterval(interval)
  }, [])

  const nextModuleProgress = state.nextIncompleteModule ? state.videoProgress[state.nextIncompleteModule.id] : null
  const resumeSeconds = nextModuleProgress?.seconds || 0

  if (state.isLoading) return <DashboardSkeleton />

  return (
    <div className="space-y-4 sm:space-y-8 animate-fade-in">
      {/* MOBILE: Hero Progress Card - Dark Premium Style */}
      <div className="sm:hidden relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-5 border border-slate-700/50">
        {/* Gradient Orbs */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-teal-500/30 to-cyan-500/10 rounded-full blur-2xl" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-cyan-500/20 to-teal-500/5 rounded-full blur-2xl" />

        <div className="relative z-10">
          {/* Greeting */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-teal-400 text-xs font-bold uppercase tracking-wider mb-1">Welcome back</p>
              <h1 className="text-2xl font-black text-white">
                {state.studentName || 'Student'}
              </h1>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-teal-500/30">
              <span className="text-2xl font-black text-white">{Math.round(state.progressPercent)}%</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-xs mb-2">
              <span className="text-slate-400">{state.completedCount} of {state.totalModules} modules</span>
              <span className="text-teal-400 font-bold">{state.timeRemaining} min left</span>
            </div>
            <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-teal-500 to-cyan-400 rounded-full transition-all duration-500"
                style={{ width: `${state.progressPercent}%` }}
              />
            </div>
          </div>

          {/* Continue Button */}
          <button
            onClick={() => {
              state.setCurrentModuleIndex(state.nextIncompleteModuleIndex)
              state.setActiveSection('course')
            }}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-bold text-base flex items-center justify-center gap-2 shadow-lg shadow-teal-500/30 active:scale-[0.98] transition-transform"
          >
            <Play className="w-5 h-5" fill="white" />
            {state.progressPercent > 0 ? 'Continue Learning' : 'Start Course'}
          </button>
        </div>
      </div>

      {/* DESKTOP: Original Welcome Header */}
      <div className="hidden sm:block bg-gradient-to-r from-teal-500 via-cyan-500 to-teal-400 rounded-3xl p-8 text-white relative overflow-hidden card-lift shadow-2xl shadow-teal-500/30">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-cyan-300/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4" />
        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl font-black mb-2">
            {state.studentName ? `Welcome, ${state.studentName}!` : 'Welcome Back!'}
          </h1>
          <p className="text-teal-200 text-lg mb-6">
            {state.progressPercent >= 100 ? "Congratulations! You've completed the course!" : `${state.timeRemaining} min remaining`}
          </p>
          <div className="bg-white/20 rounded-full h-4 mb-2 overflow-hidden">
            <div className="h-full bg-white rounded-full transition-all duration-500" style={{ width: `${state.progressPercent}%` }} />
          </div>
          <div className="flex justify-between text-sm">
            <span>{state.completedCount}/{state.totalModules} modules</span>
            <span className="font-bold">{Math.round(state.progressPercent)}%</span>
          </div>
        </div>
      </div>

      {/* MOBILE: Quick Stats Grid - Modern Cards */}
      <div className="sm:hidden grid grid-cols-2 gap-3">
        {[
          { icon: Clock, label: 'Watch Time', value: `${state.totalWatchTimeMinutes}m`, color: 'from-violet-500 to-purple-600', iconBg: 'bg-violet-500/20' },
          { icon: Star, label: 'Points', value: state.totalPoints.toString(), color: 'from-amber-500 to-orange-500', iconBg: 'bg-amber-500/20' },
          { icon: Flame, label: 'Day Streak', value: `${state.streak}`, color: 'from-rose-500 to-pink-500', iconBg: 'bg-rose-500/20' },
          { icon: Trophy, label: 'Badges', value: `${state.unlockedCount}/${ACHIEVEMENTS.length}`, color: 'from-emerald-500 to-teal-500', iconBg: 'bg-emerald-500/20' },
        ].map((stat, i) => (
          <div key={i} className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-800/80 p-4 border border-slate-200/50 dark:border-slate-700/50 shadow-sm">
            <div className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-br ${stat.color} opacity-10 rounded-full blur-xl -translate-y-1/2 translate-x-1/2`} />
            <div className={`w-10 h-10 rounded-xl ${stat.iconBg} flex items-center justify-center mb-2`}>
              <stat.icon className={`w-5 h-5 bg-gradient-to-r ${stat.color} bg-clip-text`} style={{ color: i === 0 ? '#8b5cf6' : i === 1 ? '#f59e0b' : i === 2 ? '#f43f5e' : '#10b981' }} />
            </div>
            <p className="text-2xl font-black text-slate-900 dark:text-white">{stat.value}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* DESKTOP: Original Stats Grid */}
      <div className="hidden sm:grid grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-lg border border-slate-100 dark:border-slate-800 card-lift col-span-1">
          <div className="flex items-center gap-4">
            <ProgressRing progress={state.progressPercent} size={48} strokeWidth={4} />
            <div>
              <div className="text-sm text-slate-500 dark:text-slate-400">Progress</div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">{Math.round(state.progressPercent)}%</div>
            </div>
          </div>
        </div>
        {[
          { icon: Clock, label: 'Watched', value: `${state.totalWatchTimeMinutes}m`, color: 'indigo' },
          { icon: Star, label: 'Points', value: state.totalPoints, color: 'amber' },
          { icon: Flame, label: 'Streak', value: `${state.streak}d`, color: 'orange' },
          { icon: Trophy, label: 'Badges', value: `${state.unlockedCount}/${ACHIEVEMENTS.length}`, color: 'emerald' },
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-lg border border-slate-100 dark:border-slate-800 card-lift">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl bg-${stat.color}-100 dark:bg-${stat.color}-900/30 flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
              </div>
              <div>
                <div className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</div>
                <div className="text-2xl font-black text-slate-900 dark:text-white">{stat.value}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MOBILE: Next Module Card */}
      {state.progressPercent < 100 && (
        <div className="sm:hidden">
          <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 px-1">Up Next</h3>
          <button
            onClick={() => {
              state.setCurrentModuleIndex(state.nextIncompleteModuleIndex)
              state.setActiveSection('course')
            }}
            className="w-full relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/30 dark:to-cyan-900/20 border border-teal-200/50 dark:border-teal-500/30 p-4 text-left active:scale-[0.99] transition-transform"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-teal-500/30 flex-shrink-0">
                <Play className="w-7 h-7 text-white" fill="white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-teal-600 dark:text-teal-400 mb-0.5">
                  Module {state.nextIncompleteModule?.number}
                  {resumeSeconds > 0 && (
                    <span className="ml-2 px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 text-[10px]">
                      Resume {Math.floor(resumeSeconds / 60)}:{String(Math.floor(resumeSeconds % 60)).padStart(2, '0')}
                    </span>
                  )}
                </p>
                <p className="text-base font-bold text-slate-900 dark:text-white truncate">{state.nextIncompleteModule?.title}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                  <Clock className="w-3 h-3" />
                  {state.nextIncompleteModule?.duration}
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-teal-500 flex-shrink-0" />
            </div>
          </button>
        </div>
      )}

      {/* MOBILE: Dr. Voss Welcome - Compact */}
      {state.completedCount === 0 && !showWelcomeVideo && (
        <div className="sm:hidden">
          <div className="rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/10 border border-amber-200/50 dark:border-amber-500/30 p-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 ring-2 ring-amber-300 dark:ring-amber-500/50 shadow-lg">
                <Image
                  src={COURSE_CONFIG.drVoss?.image || '/images/dentist/dr-voss.webp'}
                  alt={COURSE_CONFIG.drVoss?.name || 'Dr. Voss'}
                  width={64}
                  height={64}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">Start Here</p>
                <p className="text-sm font-bold text-slate-900 dark:text-white">Message from Dr. Voss</p>
                <button
                  onClick={() => setShowWelcomeVideo(true)}
                  className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg font-bold text-xs bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md active:scale-95 transition-transform"
                >
                  <Play className="w-3.5 h-3.5" fill="white" /> Watch
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DESKTOP: Dr. Voss Welcome - Full */}
      {state.completedCount === 0 && !showWelcomeVideo && (
        <div className="hidden sm:block bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-3xl p-6 border border-amber-200 dark:border-amber-800">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 shadow-xl ring-4 ring-amber-200 dark:ring-amber-800">
              <Image
                src={COURSE_CONFIG.drVoss?.image || '/images/dentist/dr-voss.webp'}
                alt={COURSE_CONFIG.drVoss?.name || 'Dr. Voss'}
                width={96}
                height={96}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="flex-1">
              <div className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-1">Start Here</div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">Welcome from {COURSE_CONFIG.drVoss?.name?.split(' ')[0] || 'Dr. Voss'}</h3>
              <button
                onClick={() => setShowWelcomeVideo(true)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:shadow-lg transition-all btn-press"
              >
                <Play className="w-5 h-5" /> Watch Video
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Welcome Video Modal */}
      {showWelcomeVideo && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl overflow-hidden">
                <Image
                  src={COURSE_CONFIG.drVoss?.image || '/images/dentist/dr-voss.webp'}
                  alt={COURSE_CONFIG.drVoss?.name || 'Dr. Voss'}
                  width={40}
                  height={40}
                  className="object-cover w-full h-full"
                />
              </div>
              <div>
                <div className="font-bold text-slate-900 dark:text-white">{COURSE_CONFIG.drVoss?.name}</div>
                <div className="text-sm text-slate-500 dark:text-slate-400">{COURSE_CONFIG.drVoss?.title}</div>
              </div>
            </div>
            <button onClick={() => setShowWelcomeVideo(false)} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
              <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <WistiaPlayer wistiaId={COURSE_CONFIG.welcomeVideo?.wistiaId || 'myh13ayp9d'} showSpeedControls={false} />
        </div>
      )}

      {/* MOBILE: Quick Actions - Compact Row */}
      <div className="sm:hidden">
        <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 px-1">Quick Actions</h3>
        <div className="flex gap-3">
          {[
            { icon: Gift, label: 'Bonuses', color: 'from-cyan-500 to-blue-500', section: 'bonuses' as const },
            { icon: Trophy, label: 'Badges', color: 'from-amber-500 to-orange-500', section: 'achievements' as const },
            { icon: MessageCircle, label: 'Support', color: 'from-emerald-500 to-teal-500', section: null },
          ].map((item, i) => (
            item.section ? (
              <button
                key={i}
                onClick={() => state.setActiveSection(item.section)}
                className="flex-1 relative overflow-hidden rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/50 dark:border-slate-700/50 p-4 text-center active:scale-95 transition-transform shadow-sm"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-5`} />
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mx-auto mb-2 shadow-lg`}>
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <p className="text-xs font-bold text-slate-700 dark:text-slate-200">{item.label}</p>
              </button>
            ) : (
              <a
                key={i}
                href={`mailto:${COURSE_CONFIG.supportEmail}`}
                className="flex-1 relative overflow-hidden rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/50 dark:border-slate-700/50 p-4 text-center active:scale-95 transition-transform shadow-sm"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-5`} />
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mx-auto mb-2 shadow-lg`}>
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <p className="text-xs font-bold text-slate-700 dark:text-slate-200">{item.label}</p>
              </a>
            )
          ))}
        </div>
      </div>

      {/* DESKTOP: Continue Learning & Quick Actions */}
      <div className="hidden sm:grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-slate-200/50 dark:border-teal-500/10">
          <h2 className="text-xl font-black text-slate-900 dark:text-white mb-4">
            {state.progressPercent >= 100 ? 'Course Complete!' : 'Continue Learning'}
          </h2>
          {state.progressPercent >= 100 ? (
            <div className="text-center py-6">
              <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-xl shadow-emerald-500/30 mb-4">
                <Trophy className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">Congratulations!</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-4">You've completed all available modules!</p>
              <button
                onClick={() => state.setShowCertificateModal(true)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold bg-gradient-to-r from-teal-500 to-cyan-500 text-white hover:shadow-lg transition-all btn-press"
              >
                <Award className="w-5 h-5" /> Get Certificate
              </button>
            </div>
          ) : (
            <button
              className="w-full flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-800/20 dark:to-cyan-800/20 border border-teal-100 dark:border-teal-700 hover:shadow-md transition-all card-lift text-left"
              onClick={() => {
                state.setCurrentModuleIndex(state.nextIncompleteModuleIndex)
                state.setActiveSection('course')
              }}
            >
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-teal-400/30 relative flex-shrink-0">
                <Play className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm text-teal-500 dark:text-teal-300 font-medium mb-1">
                  Module {state.nextIncompleteModule?.number}
                </div>
                <div className="font-bold text-slate-900 dark:text-white truncate">
                  {state.nextIncompleteModule?.title || state.currentModule.title}
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  <Clock className="w-3 h-3" />
                  {state.nextIncompleteModule?.duration || state.currentModule.duration}
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-teal-500 flex-shrink-0" />
            </button>
          )}
        </div>

        <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-slate-200/50 dark:border-teal-500/10">
          <h2 className="text-xl font-black text-slate-900 dark:text-white mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button
              onClick={() => state.setActiveSection('bonuses')}
              className="w-full flex items-center gap-3 p-4 rounded-xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-600 hover:border-cyan-300 dark:hover:border-cyan-500/50 transition-all shadow-sm"
            >
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                <Gift className="w-5 h-5 text-cyan-500" />
              </div>
              <span className="font-bold text-slate-700 dark:text-slate-200">View Bonuses</span>
            </button>
            <button
              onClick={() => state.setActiveSection('achievements')}
              className="w-full flex items-center gap-3 p-4 rounded-xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-600 hover:border-amber-300 dark:hover:border-amber-500/50 transition-all shadow-sm"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <Trophy className="w-5 h-5 text-amber-500" />
              </div>
              <span className="font-bold text-slate-700 dark:text-slate-200">View Achievements</span>
            </button>
            <a
              href={`mailto:${COURSE_CONFIG.supportEmail}`}
              className="w-full flex items-center gap-3 p-4 rounded-xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-600 hover:border-emerald-300 dark:hover:border-emerald-500/50 transition-all shadow-sm"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-emerald-500" />
              </div>
              <span className="font-bold text-slate-700 dark:text-slate-200">Get Support</span>
            </a>
          </div>
        </div>
      </div>

      {/* MOBILE: Social Proof - Compact */}
      <div className="sm:hidden rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700/50 p-4">
        <div className="grid grid-cols-4 gap-2 text-center">
          {[
            { icon: Users, value: `${(memberStats.totalMembers / 1000).toFixed(1)}k`, label: 'Students', color: 'text-teal-400' },
            { icon: null, value: memberStats.activeNow.toLocaleString(), label: 'Active', color: 'text-emerald-400', pulse: true },
            { icon: Star, value: '4.9', label: 'Rating', color: 'text-amber-400' },
            { icon: Globe, value: '23', label: 'Countries', color: 'text-blue-400' },
          ].map((stat, i) => (
            <div key={i} className="py-2">
              {stat.pulse ? (
                <div className="flex items-center justify-center gap-1 mb-1">
                  <div className="relative">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  </div>
                  <span className={`text-lg font-black ${stat.color}`}>{stat.value}</span>
                </div>
              ) : (
                <p className={`text-lg font-black ${stat.color}`}>{stat.value}</p>
              )}
              <p className="text-[10px] text-slate-400">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* DESKTOP: Social Proof Banner */}
      <div className="hidden sm:block bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl rounded-2xl p-5 shadow-lg border border-slate-200/50 dark:border-teal-500/10">
        <div className="grid grid-cols-4 gap-4 text-center">
          <div className="flex flex-row items-center justify-center gap-2 p-2 rounded-lg bg-slate-50/50 dark:bg-slate-800/30">
            <Users className="w-5 h-5 text-teal-500" />
            <div className="flex items-center gap-1">
              <span className="font-black text-slate-900 dark:text-white">{memberStats.totalMembers.toLocaleString()}+</span>
              <span className="text-slate-500 dark:text-slate-400 text-sm">enrolled</span>
            </div>
          </div>
          <div className="flex flex-row items-center justify-center gap-2 p-2 rounded-lg bg-emerald-50/50 dark:bg-emerald-900/20">
            <div className="relative">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            </div>
            <div className="flex items-center gap-1">
              <span className="font-black text-emerald-600 dark:text-emerald-400">{memberStats.activeNow.toLocaleString()}</span>
              <span className="text-slate-500 dark:text-slate-400 text-sm">active</span>
            </div>
          </div>
          <div className="flex flex-row items-center justify-center gap-2 p-2 rounded-lg bg-amber-50/50 dark:bg-amber-900/20">
            <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
            <div className="flex items-center gap-1">
              <span className="font-black text-slate-900 dark:text-white">4.9</span>
              <span className="text-slate-500 dark:text-slate-400 text-sm">rating</span>
            </div>
          </div>
          <div className="flex flex-row items-center justify-center gap-2 p-2 rounded-lg bg-blue-50/50 dark:bg-blue-900/20">
            <Globe className="w-5 h-5 text-blue-500" />
            <div className="flex items-center gap-1">
              <span className="font-black text-slate-900 dark:text-white">23</span>
              <span className="text-slate-500 dark:text-slate-400 text-sm">countries</span>
            </div>
          </div>
        </div>
      </div>

      {/* Coming Soon Courses - Hidden on mobile, show on desktop */}
      <div className="hidden sm:block bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 rounded-2xl p-8 shadow-2xl border border-slate-700/50">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-black text-white flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-amber-400" />
              Coming Soon
            </h2>
            <p className="text-slate-400 mt-1">New courses for dentists. Join the waitlist!</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/30">
            <Bell className="w-4 h-4 text-amber-400" />
            <span className="text-amber-400 text-sm font-bold">{state.waitlistedCourses.length} on list</span>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {COMING_SOON_COURSES.map((course) => {
            const isWaitlisted = state.waitlistedCourses.includes(course.id)
            const IconComponent = course.icon
            return (
              <div key={course.id} className="relative group bg-slate-800/50 hover:bg-slate-800 rounded-xl p-5 border border-slate-700/50 hover:border-slate-600 transition-all duration-300">
                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${course.color} flex items-center justify-center shadow-lg flex-shrink-0`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0 pr-16">
                    <h3 className="font-bold text-white text-lg leading-tight">{course.title}</h3>
                    <p className="text-slate-400 text-sm truncate">{course.subtitle}</p>
                  </div>
                </div>
                <p className="text-slate-300 text-sm mb-4 line-clamp-2">{course.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {course.features.slice(0, 2).map((feature, i) => (
                    <span key={i} className="px-2 py-1 rounded-md bg-slate-700/50 text-slate-300 text-xs">{feature}</span>
                  ))}
                  {course.features.length > 2 && (
                    <span className="px-2 py-1 rounded-md bg-slate-700/50 text-slate-400 text-xs">+{course.features.length - 2} more</span>
                  )}
                </div>
                <div className="flex items-center justify-between text-sm mb-4">
                  <span className="text-slate-400"><span className="text-teal-400 font-bold">{course.waitlistCount.toLocaleString()}</span> waiting</span>
                  <span className="text-slate-500">{course.estimatedLaunch}</span>
                </div>
                <button
                  onClick={() => state.toggleWaitlist(course.id)}
                  className={`w-full py-3 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
                    isWaitlisted
                      ? 'bg-teal-500/20 text-teal-400 border border-teal-500/30'
                      : 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white hover:shadow-lg hover:shadow-teal-500/25'
                  }`}
                >
                  {isWaitlisted ? <><Check className="w-4 h-4" /> On Your Waitlist</> : <><Bell className="w-4 h-4" /> Notify Me</>}
                </button>
                <div className="absolute top-4 right-4 px-2 py-1 rounded-md bg-slate-900/80 border border-slate-600/50">
                  <span className="text-slate-400 text-xs line-through mr-1">${course.price}</span>
                  <span className="text-emerald-400 text-xs font-bold">FREE</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
})

// ============================================
// COURSE SECTION - REDESIGNED FOR MOBILE
// ============================================

interface CourseProps {
  state: PlatformStateType
}

export const CourseSection = memo(function CourseSection({ state }: CourseProps) {
  const currentModule = state.currentModule
  const isCompleted = state.completedModules.includes(currentModule.id)
  const isBookmarked = state.bookmarkedModules.includes(currentModule.id)
  const hasNotes = !!state.moduleNotes[currentModule.id]
  const savedProgress = state.videoProgress[currentModule.id]
  const haptic = useHaptic()

  const canGoNext = state.currentModuleIndex < state.totalModules - 1 && !COURSE_MODULES[state.currentModuleIndex + 1]?.comingSoon
  const canGoPrev = state.currentModuleIndex > 0

  const handleSwipe = (direction: 'left' | 'right') => {
    if (direction === 'left' && canGoNext) {
      haptic.light()
      state.nextModule()
    } else if (direction === 'right' && canGoPrev) {
      haptic.light()
      state.prevModule()
    }
  }

  const swipeHandlers = useSwipeGesture({
    onSwipeLeft: () => handleSwipe('left'),
    onSwipeRight: () => handleSwipe('right'),
  }, 80)

  return (
    <div {...swipeHandlers} className="space-y-4 sm:space-y-6 animate-fade-in touch-pan-y">
      {/* MOBILE: Compact Header */}
      <div className="sm:hidden flex items-center justify-between">
        <button
          onClick={() => state.setActiveSection('dashboard')}
          className="p-2 -ml-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="text-center">
          <p className="text-xs text-teal-500 dark:text-teal-400 font-bold">Module {currentModule.number}</p>
          <p className="text-[10px] text-slate-500 dark:text-slate-400">{state.completedCount}/{state.totalModules} complete</p>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => state.toggleBookmark(currentModule.id)}
            className={`p-2 rounded-xl transition-all ${isBookmarked ? 'text-teal-500 bg-teal-50 dark:bg-teal-900/30' : 'text-slate-400'}`}
          >
            {isBookmarked ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Video Player */}
      <div className="rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl">
        {!currentModule.comingSoon && currentModule.wistiaId ? (
          <WistiaPlayer
            wistiaId={currentModule.wistiaId}
            onVideoEnd={() => { if (!isCompleted) state.markComplete() }}
            showSpeedControls
            onProgress={(percent, seconds) => state.handleVideoProgress(percent, seconds)}
            resumeTime={savedProgress?.seconds || 0}
            reducedMotion={state.reducedMotion}
          />
        ) : (
          <div className="aspect-video rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center border border-slate-700">
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-slate-700/50 flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-slate-500" />
              </div>
              <p className="text-xl font-bold text-white mb-1">Coming Soon</p>
              <p className="text-sm text-slate-400">This module is not yet available</p>
            </div>
          </div>
        )}
      </div>

      {/* MOBILE: Module Info Card */}
      <div className="sm:hidden bg-white dark:bg-slate-800/80 rounded-2xl p-4 border border-slate-200/50 dark:border-slate-700/50 shadow-sm">
        {/* Module badges */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-teal-500 to-cyan-500 text-white">
            Module {currentModule.number}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
            {currentModule.duration}
          </span>
          {isCompleted && (
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <CheckCircle className="w-3 h-3" /> Done
            </span>
          )}
        </div>

        {/* Title & Description */}
        <h1 className="text-lg font-black text-slate-900 dark:text-white mb-2">{currentModule.title}</h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">{currentModule.description}</p>

        {/* Mark Complete / Navigation */}
        <div className="flex items-center gap-3">
          {!currentModule.comingSoon && (
            <button
              onClick={state.markComplete}
              disabled={isCompleted}
              className={`flex-1 py-3.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                isCompleted
                  ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
                  : 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg shadow-teal-500/30 active:scale-[0.98]'
              }`}
            >
              {isCompleted ? <><CheckCircle className="w-4 h-4" /> Completed</> : <><CheckCircle className="w-4 h-4" /> Mark Complete</>}
            </button>
          )}
          <div className="flex items-center gap-2">
            <button
              onClick={state.prevModule}
              disabled={!canGoPrev}
              className={`p-3 rounded-xl border transition-all ${canGoPrev ? 'border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 active:scale-95' : 'opacity-40 border-slate-200 dark:border-slate-700'}`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={state.nextModule}
              disabled={!canGoNext}
              className={`p-3 rounded-xl transition-all ${canGoNext ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-md active:scale-95' : 'opacity-40 bg-slate-200 dark:bg-slate-700'}`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* DESKTOP: Module Info */}
      <div className="hidden sm:grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-lg border border-slate-100 dark:border-slate-800">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-100 dark:bg-teal-800/30 text-teal-600 dark:text-teal-300">
                MODULE {currentModule.number}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-700/80 text-slate-600 dark:text-slate-300 border border-slate-200/50 dark:border-slate-600">
                {currentModule.duration}
              </span>
              {isCompleted && state.showCompletedBadge && (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Done
                </span>
              )}
              <button
                onClick={() => state.toggleBookmark(currentModule.id)}
                className={`ml-auto p-2 rounded-lg transition-all border ${
                  isBookmarked
                    ? 'bg-teal-100 dark:bg-teal-800/30 text-teal-500 border-teal-200 dark:border-teal-700'
                    : 'bg-white dark:bg-slate-700/80 text-slate-400 dark:text-slate-300 border-slate-200 dark:border-slate-600 hover:text-teal-500'
                }`}
              >
                {isBookmarked ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
              </button>
              <button
                onClick={() => state.setShowNotesModal(true)}
                className={`p-2 rounded-lg transition-all border ${
                  hasNotes
                    ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 border-amber-200 dark:border-amber-700'
                    : 'bg-white dark:bg-slate-700/80 text-slate-400 dark:text-slate-300 border-slate-200 dark:border-slate-600 hover:text-amber-600'
                }`}
              >
                <StickyNote className="w-5 h-5" />
              </button>
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-3">{currentModule.title}</h1>
            <p className="text-slate-600 dark:text-slate-400 mb-6">{currentModule.description}</p>
            {!currentModule.comingSoon && (
              <button
                onClick={state.markComplete}
                disabled={isCompleted}
                className={`w-full py-4 rounded-xl font-bold transition-all ${
                  isCompleted
                    ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
                    : 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white hover:shadow-lg btn-press'
                }`}
              >
                {isCompleted ? <><CheckCircle className="w-5 h-5 inline mr-2" /> Completed</> : <><CheckCircle className="w-5 h-5 inline mr-2" /> Mark Complete</>}
              </button>
            )}
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
              <button
                onClick={state.prevModule}
                disabled={!canGoPrev}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all ${
                  canGoPrev ? 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800' : 'opacity-40'
                }`}
              >
                <ChevronLeft className="w-5 h-5" /> Prev
              </button>
              <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">{state.currentModuleIndex + 1}/{state.totalModules}</span>
              <button
                onClick={state.nextModule}
                disabled={!canGoNext}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-white transition-all ${
                  canGoNext ? 'bg-teal-500 hover:bg-teal-600' : 'opacity-40 bg-slate-300'
                }`}
              >
                Next <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* What You'll Learn */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-lg border border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-500" /> What You'll Learn
            </h3>
            <div className="space-y-3">
              {currentModule.lessons.map((lesson, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-600 shadow-sm">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                  </div>
                  <span className="text-slate-700 dark:text-slate-200 font-medium">{lesson}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Resources */}
          {currentModule.resources.length > 0 && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-lg border border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <Download className="w-5 h-5 text-teal-500" /> Resources
              </h3>
              <div className="space-y-3">
                {currentModule.resources.map((resource, i) => (
                  <a
                    key={i}
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-teal-300 dark:hover:border-teal-500 hover:bg-teal-50 dark:hover:bg-teal-800/20 transition-all"
                  >
                    <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-800/30 flex items-center justify-center flex-shrink-0">
                      {resource.type === 'link' ? <ExternalLink className="w-5 h-5 text-teal-500" /> : <FileDown className="w-5 h-5 text-teal-500" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-slate-900 dark:text-white truncate">{resource.name}</div>
                      <div className="text-sm text-slate-500 dark:text-slate-400">{resource.type === 'link' ? 'Open Link' : 'Download'}</div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-slate-400 flex-shrink-0" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Module List Sidebar */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-lg border border-slate-100 dark:border-slate-800">
            <h2 className="text-xl font-black text-slate-900 dark:text-white mb-4">All Modules</h2>
            <div className="space-y-2">
              {COURSE_MODULES.filter(m => !m.comingSoon).map((module) => {
                const moduleCompleted = state.completedModules.includes(module.id)
                const isCurrent = state.currentModuleIndex === COURSE_MODULES.findIndex(m => m.id === module.id)
                return (
                  <button
                    key={module.id}
                    onClick={() => state.setCurrentModuleIndex(COURSE_MODULES.findIndex(m => m.id === module.id))}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isCurrent
                        ? 'bg-teal-100 dark:bg-teal-800/30 border-2 border-teal-400'
                        : moduleCompleted
                          ? 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800'
                          : 'bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-600 hover:border-teal-300 dark:hover:border-teal-500 shadow-sm'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                        moduleCompleted ? 'bg-emerald-500 text-white' : isCurrent ? 'bg-teal-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                      }`}>
                        {moduleCompleted ? <Check className="w-4 h-4" /> : module.number}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`text-sm font-bold truncate ${isCurrent ? 'text-teal-600 dark:text-teal-300' : 'text-slate-900 dark:text-white'}`}>
                          {module.title}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">{module.duration}</div>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE: Module List (collapsible) */}
      <div className="sm:hidden">
        <details className="group">
          <summary className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/50 dark:border-slate-700/50 cursor-pointer list-none">
            <span className="font-bold text-slate-900 dark:text-white">All Modules</span>
            <ChevronRight className="w-5 h-5 text-slate-400 transition-transform group-open:rotate-90" />
          </summary>
          <div className="mt-2 space-y-2">
            {COURSE_MODULES.filter(m => !m.comingSoon).map((module) => {
              const moduleCompleted = state.completedModules.includes(module.id)
              const isCurrent = state.currentModuleIndex === COURSE_MODULES.findIndex(m => m.id === module.id)
              return (
                <button
                  key={module.id}
                  onClick={() => state.setCurrentModuleIndex(COURSE_MODULES.findIndex(m => m.id === module.id))}
                  className={`w-full p-4 rounded-xl text-left transition-all ${
                    isCurrent
                      ? 'bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/30 dark:to-cyan-900/20 border-2 border-teal-400'
                      : moduleCompleted
                        ? 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800'
                        : 'bg-white dark:bg-slate-800/80 border border-slate-200/50 dark:border-slate-700/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold ${
                      moduleCompleted ? 'bg-emerald-500 text-white' : isCurrent ? 'bg-gradient-to-br from-teal-500 to-cyan-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                    }`}>
                      {moduleCompleted ? <Check className="w-5 h-5" /> : module.number}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`text-sm font-bold ${isCurrent ? 'text-teal-600 dark:text-teal-300' : 'text-slate-900 dark:text-white'}`}>
                        {module.title}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">{module.duration}</div>
                    </div>
                    {isCurrent && <Play className="w-4 h-4 text-teal-500" />}
                  </div>
                </button>
              )
            })}
          </div>
        </details>
      </div>
    </div>
  )
})

// ============================================
// BONUSES SECTION - REDESIGNED FOR MOBILE
// ============================================

interface BonusesProps {
  state: PlatformStateType
}

export const BonusesSection = memo(function BonusesSection({ state }: BonusesProps) {
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const haptic = useHaptic()

  const filteredBonuses = BONUSES.filter(bonus => {
    const matchesCategory = categoryFilter === 'All' || bonus.category === categoryFilter
    const matchesSearch = bonus.name.toLowerCase().includes(searchQuery.toLowerCase()) || bonus.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      {/* MOBILE: Header */}
      <div className="sm:hidden">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Bonuses</h1>
          <div className="px-3 py-1.5 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white text-xs font-bold">
            ${TOTAL_BONUS_VALUE} Value
          </div>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400">{BONUSES.length} premium resources included</p>
      </div>

      {/* DESKTOP: Header */}
      <div className="hidden sm:flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3">
            <Gift className="w-8 h-8 text-cyan-500" /> Bonus Resources
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">Resources worth <span className="font-bold text-teal-500">${TOTAL_BONUS_VALUE}</span></p>
        </div>
        <div className="text-right">
          <p className="text-slate-500 dark:text-slate-400 text-sm">{state.downloadedBonuses.length}/{BONUSES.length} downloaded</p>
        </div>
      </div>

      {/* MOBILE: Category Pills - Horizontal Scroll */}
      <div className="sm:hidden flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
        {['All', ...BONUS_CATEGORIES].map((cat) => (
          <button
            key={cat}
            onClick={() => { setCategoryFilter(cat); haptic.light() }}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              categoryFilter === cat
                ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-md'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* DESKTOP: Search & Filters */}
      <div className="hidden sm:block space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search bonuses..."
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-teal-400 focus:outline-none focus:ring-4 focus:ring-teal-400/10 transition-all shadow-sm"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {['All', ...BONUS_CATEGORIES].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                categoryFilter === cat
                  ? 'bg-teal-500 text-white'
                  : 'bg-white dark:bg-slate-700/80 text-slate-600 dark:text-slate-200 border border-slate-200 dark:border-slate-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Bonuses Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBonuses.map((bonus) => {
          const Icon = bonus.icon
          const isDownloaded = state.downloadedBonuses.includes(bonus.id)
          return (
            <div key={bonus.id} className="bg-white dark:bg-slate-800/80 rounded-2xl sm:rounded-2xl border border-slate-200/50 dark:border-slate-700/50 overflow-hidden shadow-sm hover:shadow-lg transition-all group">
              {/* Bonus Image */}
              <div className="relative aspect-[16/10] bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-900 overflow-hidden">
                <Image
                  src={bonus.image}
                  alt={bonus.name}
                  fill
                  className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 right-2 px-2 py-1 rounded-lg bg-slate-900/80 backdrop-blur-sm border border-slate-700/50">
                  <span className="text-emerald-400 text-xs font-bold">${bonus.value}</span>
                </div>
              </div>

              {/* Bonus Info */}
              <div className="p-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center shadow-lg flex-shrink-0">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm leading-tight">{bonus.name}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{bonus.category}</p>
                  </div>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">{bonus.description}</p>
                <a
                  href={bonus.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => { if (!isDownloaded) state.handleBonusDownload(bonus.id); haptic.success() }}
                  className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                    isDownloaded
                      ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
                      : 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-md active:scale-[0.98]'
                  }`}
                >
                  {isDownloaded ? <><Check className="w-4 h-4" /> Downloaded</> : <><Download className="w-4 h-4" /> Get Bonus</>}
                </a>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
})

// ============================================
// ACHIEVEMENTS SECTION - REDESIGNED FOR MOBILE
// ============================================

interface AchievementsProps {
  state: PlatformStateType
}

export const AchievementsSection = memo(function AchievementsSection({ state }: AchievementsProps) {
  const haptic = useHaptic()

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      {/* MOBILE: Header with Progress */}
      <div className="sm:hidden">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Achievements</h1>
          <div className="px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold">
            {state.unlockedCount}/{ACHIEVEMENTS.length}
          </div>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400">{state.totalPoints} total points earned</p>
      </div>

      {/* DESKTOP: Header */}
      <div className="hidden sm:flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3">
            <Trophy className="w-8 h-8 text-amber-500" /> Achievements
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">{state.unlockedCount} of {ACHIEVEMENTS.length} unlocked • {state.totalPoints} points</p>
        </div>
      </div>

      {/* MOBILE: Stats Cards */}
      <div className="sm:hidden grid grid-cols-3 gap-3">
        {[
          { label: 'Unlocked', value: state.unlockedCount, color: 'from-amber-500 to-orange-500' },
          { label: 'Points', value: state.totalPoints, color: 'from-violet-500 to-purple-500' },
          { label: 'Streak', value: `${state.streak}d`, color: 'from-rose-500 to-pink-500' },
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-slate-800/80 rounded-2xl p-4 text-center border border-slate-200/50 dark:border-slate-700/50">
            <p className={`text-2xl font-black bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>{stat.value}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Achievements Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {ACHIEVEMENTS.map((achievement) => {
          const isUnlocked = state.unlockedAchievements[achievement.id]
          const Icon = achievement.icon
          return (
            <div
              key={achievement.id}
              className={`relative overflow-hidden rounded-2xl border p-4 transition-all ${
                isUnlocked
                  ? 'bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/10 border-amber-200 dark:border-amber-500/30'
                  : 'bg-white dark:bg-slate-800/80 border-slate-200/50 dark:border-slate-700/50 opacity-60'
              }`}
            >
              {/* Glow for unlocked */}
              {isUnlocked && (
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-amber-500/20 to-transparent rounded-full blur-2xl" />
              )}

              <div className="relative z-10">
                <div className="flex items-start gap-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                    isUnlocked
                      ? 'bg-gradient-to-br from-amber-500 to-orange-500 shadow-lg shadow-amber-500/30'
                      : 'bg-slate-200 dark:bg-slate-700'
                  }`}>
                    <Icon className={`w-7 h-7 ${isUnlocked ? 'text-white' : 'text-slate-400 dark:text-slate-500'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-bold text-base ${isUnlocked ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>
                      {achievement.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">{achievement.description}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-200/50 dark:border-slate-700/50">
                  <span className={`text-xs font-bold uppercase px-2 py-1 rounded-full ${
                    achievement.tier === 'gold' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' :
                    achievement.tier === 'silver' ? 'bg-slate-100 dark:bg-slate-700/80 text-slate-600 dark:text-slate-300' :
                    'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400'
                  }`}>
                    {achievement.tier}
                  </span>
                  <span className={`text-sm font-bold ${isUnlocked ? 'text-teal-500 dark:text-teal-300' : 'text-slate-400'}`}>
                    +{achievement.points} pts
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Share Section */}
      {state.progressPercent >= 100 && (
        <div className="bg-gradient-to-r from-teal-500 to-cyan-500 rounded-2xl p-6 sm:p-8 text-center text-white">
          <Award className="w-12 h-12 mx-auto mb-4" />
          <h3 className="text-2xl font-black mb-2">AI Video Master!</h3>
          <p className="text-teal-200 mb-6">Share your achievement</p>
          <button
            onClick={() => state.setShowCertificateModal(true)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold bg-white text-teal-500 hover:bg-teal-50 active:scale-95 transition-all"
          >
            <Award className="w-5 h-5" /> Get Certificate
          </button>
        </div>
      )}
    </div>
  )
})
