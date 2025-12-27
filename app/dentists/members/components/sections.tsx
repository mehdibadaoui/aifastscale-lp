'use client'

import { memo, useState, useEffect } from 'react'
import {
  Play, CheckCircle, Lock, Trophy, Gift, Star, Zap,
  ChevronRight, ChevronLeft, Clock, Download,
  Target, Flame, ArrowRight, Lightbulb,
  ExternalLink, BarChart3, Video,
  FileDown, Check, Bookmark, Search,
  StickyNote, BookmarkCheck, Home, MessageCircle, Award,
  Users, Globe, Bell, Sparkles
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
// DASHBOARD SECTION
// ============================================

interface DashboardProps {
  state: PlatformStateType
}

export const DashboardSection = memo(function DashboardSection({ state }: DashboardProps) {
  const [showWelcomeVideo, setShowWelcomeVideo] = useState(false)
  const [globalSearch, setGlobalSearch] = useState('')
  const [memberStats, setMemberStats] = useState(getMemberStats())

  // Update member stats every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setMemberStats(getMemberStats())
    }, 60000) // Update every minute
    return () => clearInterval(interval)
  }, [])

  // Calculate resume time for continue watching
  const nextModuleProgress = state.nextIncompleteModule ? state.videoProgress[state.nextIncompleteModule.id] : null
  const resumeSeconds = nextModuleProgress?.seconds || 0

  if (state.isLoading) return <DashboardSkeleton />

  return (
    <div className="space-y-5 sm:space-y-8 animate-fade-in">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-teal-500 via-cyan-500 to-teal-400 rounded-2xl sm:rounded-3xl p-5 sm:p-8 text-white relative overflow-hidden card-lift shadow-2xl shadow-teal-500/30">
        <div className="absolute top-0 right-0 w-32 sm:w-64 h-32 sm:h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 animate-pulse" aria-hidden="true" />
        <div className="absolute bottom-0 left-0 w-24 sm:w-48 h-24 sm:h-48 bg-cyan-300/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4" aria-hidden="true" />
        <div className="relative z-10">
          <h1 className="text-xl sm:text-3xl md:text-4xl font-black mb-1 sm:mb-2">
            {state.studentName ? `Welcome, ${state.studentName}!` : 'Welcome Back!'}
          </h1>
          <p className="text-teal-200 text-sm sm:text-lg mb-4 sm:mb-6">
            {state.progressPercent >= 100
              ? "Congratulations! You've completed the course!"
              : `${state.timeRemaining} min remaining`}
          </p>

          {/* Progress Bar */}
          <div className="bg-white/20 rounded-full h-3 sm:h-4 mb-2 overflow-hidden" role="progressbar" aria-valuenow={state.progressPercent} aria-valuemin={0} aria-valuemax={100}>
            <div
              className="h-full bg-white rounded-full transition-all duration-500"
              style={{ width: `${state.progressPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-xs sm:text-sm">
            <span>{state.completedCount}/{state.totalModules} modules</span>
            <span className="font-bold">{Math.round(state.progressPercent)}%</span>
          </div>
        </div>
      </div>

      {/* Global Search */}
      <div className="relative">
        <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
        <input
          type="text"
          value={globalSearch}
          onChange={(e) => setGlobalSearch(e.target.value)}
          placeholder="Search modules, bonuses..."
          className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 text-sm sm:text-base rounded-xl sm:rounded-2xl bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-teal-500/20 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-teal-400 focus:outline-none focus:ring-4 focus:ring-teal-400/20 transition-all shadow-lg shadow-teal-400/5"
        />
        {globalSearch && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-xl sm:rounded-2xl shadow-2xl border border-slate-200/50 dark:border-teal-500/20 z-50 max-h-64 sm:max-h-80 overflow-auto">
            {/* Module Results */}
            {COURSE_MODULES.filter(m => m.title.toLowerCase().includes(globalSearch.toLowerCase()) || m.description.toLowerCase().includes(globalSearch.toLowerCase())).map((module) => (
              <button
                key={module.id}
                onClick={() => { state.setCurrentModuleIndex(COURSE_MODULES.findIndex(m => m.id === module.id)); state.setActiveSection('course'); setGlobalSearch('') }}
                className="w-full p-3 sm:p-4 text-left hover:bg-slate-50 dark:hover:bg-slate-800 active:bg-slate-100 dark:active:bg-slate-700 transition-all flex items-center gap-2.5 sm:gap-3 touch-manipulation"
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-teal-100 dark:bg-teal-800/30 flex items-center justify-center flex-shrink-0">
                  <Video className="w-4 h-4 sm:w-5 sm:h-5 text-teal-500" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-sm sm:text-base text-slate-900 dark:text-white truncate">M{module.number}: {module.title}</div>
                  <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 truncate">{module.description}</div>
                </div>
              </button>
            ))}
            {/* Bonus Results */}
            {BONUSES.filter(b => b.name.toLowerCase().includes(globalSearch.toLowerCase()) || b.description.toLowerCase().includes(globalSearch.toLowerCase())).map((bonus) => (
              <button
                key={bonus.id}
                onClick={() => { state.setActiveSection('bonuses'); setGlobalSearch('') }}
                className="w-full p-3 sm:p-4 text-left hover:bg-slate-50 dark:hover:bg-slate-800 active:bg-slate-100 dark:active:bg-slate-700 transition-all flex items-center gap-2.5 sm:gap-3 touch-manipulation"
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-cyan-100 dark:bg-cyan-800/30 flex items-center justify-center flex-shrink-0">
                  <Gift className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-500" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-sm sm:text-base text-slate-900 dark:text-white truncate">{bonus.name}</div>
                  <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">{bonus.category} - ${bonus.value}</div>
                </div>
              </button>
            ))}
            {COURSE_MODULES.filter(m => m.title.toLowerCase().includes(globalSearch.toLowerCase())).length === 0 && BONUSES.filter(b => b.name.toLowerCase().includes(globalSearch.toLowerCase())).length === 0 && (
              <div className="p-4 text-center text-sm text-slate-500 dark:text-slate-400">No results found</div>
            )}
          </div>
        )}
      </div>

      {/* Dr. Voss Welcome Video Section */}
      {state.completedCount === 0 && !showWelcomeVideo && (
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl sm:rounded-3xl p-4 sm:p-6 border border-amber-200 dark:border-amber-800">
          <div className="flex items-center gap-3 sm:gap-6">
            <div className="w-14 h-14 sm:w-24 sm:h-24 rounded-xl sm:rounded-2xl overflow-hidden flex-shrink-0 shadow-xl ring-2 sm:ring-4 ring-amber-200 dark:ring-amber-800">
              <Image
                src={COURSE_CONFIG.drVoss?.image || '/images/dentist/dr-voss.webp'}
                alt={COURSE_CONFIG.drVoss?.name || 'Dr. Voss'}
                width={96}
                height={96}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] sm:text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-0.5 sm:mb-1">Start Here</div>
              <h3 className="text-sm sm:text-xl font-black text-slate-900 dark:text-white mb-1 sm:mb-2 leading-tight">Welcome from {COURSE_CONFIG.drVoss?.name?.split(' ')[0] || 'Dr. Voss'}</h3>
              <button
                onClick={() => setShowWelcomeVideo(true)}
                className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-bold text-xs sm:text-base bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:shadow-lg transition-all btn-press touch-manipulation"
              >
                <Play className="w-3.5 h-3.5 sm:w-5 sm:h-5" /> Watch Video
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
            <button
              onClick={() => setShowWelcomeVideo(false)}
              className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
            >
              <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <WistiaPlayer
            wistiaId={COURSE_CONFIG.welcomeVideo?.wistiaId || 'myh13ayp9d'}
            showSpeedControls={false}
          />
        </div>
      )}

      {/* Quick Stats with Progress Ring */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {/* Progress Ring Card */}
        <div className="bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg shadow-teal-400/5 border border-slate-100 dark:border-slate-800 card-lift col-span-2 sm:col-span-1">
          <div className="flex items-center justify-center sm:justify-start gap-3 sm:gap-4">
            <ProgressRing
              progress={state.progressPercent}
              size={48}
              strokeWidth={4}
            />
            <div>
              <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Progress</div>
              <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">{Math.round(state.progressPercent)}%</div>
            </div>
          </div>
        </div>

        {/* Other Stats */}
        {[
          { icon: Clock, label: 'Watched', value: `${state.totalWatchTimeMinutes}m`, color: 'indigo' },
          { icon: Star, label: 'Points', value: state.totalPoints, color: 'amber' },
          { icon: Flame, label: 'Streak', value: `${state.streak}d`, color: 'orange' },
          { icon: Trophy, label: 'Badges', value: `${state.unlockedCount}/${ACHIEVEMENTS.length}`, color: 'emerald' },
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl p-3 sm:p-6 shadow-lg shadow-teal-400/5 border border-slate-100 dark:border-slate-800 card-lift">
            <div className="flex flex-col sm:flex-row items-center sm:items-center gap-2 sm:gap-4 text-center sm:text-left">
              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-${stat.color}-100 dark:bg-${stat.color}-900/30 flex items-center justify-center flex-shrink-0`}>
                <stat.icon className={`w-5 h-5 sm:w-6 sm:h-6 text-${stat.color}-600`} />
              </div>
              <div>
                <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">{stat.label}</div>
                <div className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white">{stat.value}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Continue Learning & Quick Actions */}
      <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Continue Learning */}
        <div className="lg:col-span-2 bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg shadow-teal-400/10 border border-slate-200/50 dark:border-teal-500/10 neon-glow-hover transition-all duration-300">
          <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mb-3 sm:mb-4">
            {state.progressPercent >= 100 ? 'Course Complete!' : 'Continue Learning'}
          </h2>
          {state.progressPercent >= 100 ? (
            <div className="text-center py-4 sm:py-6">
              <div className={`w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-xl sm:rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-xl shadow-emerald-500/30 mb-3 sm:mb-4 ${state.reducedMotion ? '' : 'animate-pulse-glow'}`}>
                <Trophy className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mb-2">Congratulations!</h3>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mb-4">You've completed all available modules!</p>
              <button
                onClick={() => state.setShowCertificateModal(true)}
                className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold text-sm sm:text-base bg-gradient-to-r from-teal-500 to-cyan-500 text-white hover:shadow-lg transition-all btn-press focus-ring touch-manipulation"
              >
                <Award className="w-4 h-4 sm:w-5 sm:h-5" /> Get Certificate
              </button>
            </div>
          ) : (
            <button
              className="w-full flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-800/20 dark:to-cyan-800/20 border border-teal-100 dark:border-teal-700 hover:shadow-md transition-all card-lift text-left focus-ring touch-manipulation"
              onClick={() => {
                state.setCurrentModuleIndex(state.nextIncompleteModuleIndex)
                state.setActiveSection('course')
              }}
            >
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg sm:rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-teal-400/30 relative flex-shrink-0">
                <Play className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                {resumeSeconds > 0 && (
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-amber-500 flex items-center justify-center">
                    <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs sm:text-sm text-teal-500 dark:text-teal-300 font-medium mb-0.5 sm:mb-1 flex flex-wrap items-center gap-1 sm:gap-2">
                  <span>{state.nextIncompleteModule ? `Module ${state.nextIncompleteModule.number}` : 'Next Up'}</span>
                  {resumeSeconds > 0 && (
                    <span className="px-1.5 sm:px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 text-[10px] sm:text-xs font-bold">
                      Resume {Math.floor(resumeSeconds / 60)}:{String(Math.floor(resumeSeconds % 60)).padStart(2, '0')}
                    </span>
                  )}
                </div>
                <div className="font-bold text-sm sm:text-base text-slate-900 dark:text-white truncate">
                  {state.nextIncompleteModule?.title || state.currentModule.title}
                </div>
                <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1 sm:gap-2">
                  <Clock className="w-3 h-3 flex-shrink-0" />
                  <span>{state.nextIncompleteModule?.duration || state.currentModule.duration}</span>
                  {nextModuleProgress && nextModuleProgress.percent > 0 && (
                    <span className="text-teal-500 hidden sm:inline">• {Math.round(nextModuleProgress.percent)}% watched</span>
                  )}
                </div>
              </div>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-teal-500 flex-shrink-0" />
            </button>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg shadow-teal-400/10 border border-slate-200/50 dark:border-teal-500/10 neon-glow-hover transition-all duration-300">
          <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mb-3 sm:mb-4">Quick Actions</h2>
          <div className="grid grid-cols-3 sm:grid-cols-1 gap-2 sm:gap-3">
            <button
              onClick={() => state.setActiveSection('bonuses')}
              className="flex flex-col sm:flex-row items-center gap-1.5 sm:gap-3 p-3 sm:p-4 min-h-[48px] rounded-xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-600 hover:bg-cyan-50 dark:hover:bg-slate-700 hover:border-cyan-300 dark:hover:border-cyan-500/50 active:bg-cyan-100 dark:active:bg-slate-600 transition-all text-center sm:text-left focus-ring touch-manipulation shadow-sm"
            >
              <div className="w-8 h-8 sm:w-auto sm:h-auto rounded-lg sm:rounded-none bg-cyan-500/10 sm:bg-transparent flex items-center justify-center">
                <Gift className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-500" />
              </div>
              <span className="font-bold text-[11px] sm:text-base text-slate-700 dark:text-slate-200">Bonuses</span>
            </button>
            <button
              onClick={() => state.setActiveSection('achievements')}
              className="flex flex-col sm:flex-row items-center gap-1.5 sm:gap-3 p-3 sm:p-4 min-h-[48px] rounded-xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-600 hover:bg-amber-50 dark:hover:bg-slate-700 hover:border-amber-300 dark:hover:border-amber-500/50 active:bg-amber-100 dark:active:bg-slate-600 transition-all text-center sm:text-left focus-ring touch-manipulation shadow-sm"
            >
              <div className="w-8 h-8 sm:w-auto sm:h-auto rounded-lg sm:rounded-none bg-amber-500/10 sm:bg-transparent flex items-center justify-center">
                <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />
              </div>
              <span className="font-bold text-[11px] sm:text-base text-slate-700 dark:text-slate-200">Badges</span>
            </button>
            <a
              href={`mailto:${COURSE_CONFIG.supportEmail}`}
              className="flex flex-col sm:flex-row items-center gap-1.5 sm:gap-3 p-3 sm:p-4 min-h-[48px] rounded-xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-600 hover:bg-emerald-50 dark:hover:bg-slate-700 hover:border-emerald-300 dark:hover:border-emerald-500/50 active:bg-emerald-100 dark:active:bg-slate-600 transition-all text-center sm:text-left focus-ring touch-manipulation shadow-sm"
            >
              <div className="w-8 h-8 sm:w-auto sm:h-auto rounded-lg sm:rounded-none bg-emerald-500/10 sm:bg-transparent flex items-center justify-center">
                <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500" />
              </div>
              <span className="font-bold text-[11px] sm:text-base text-slate-700 dark:text-slate-200">Support</span>
            </a>
          </div>
        </div>
      </div>

      {/* Bookmarked Modules */}
      {state.bookmarkedModules.length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg shadow-teal-400/5 border border-slate-100 dark:border-slate-800">
          <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mb-3 sm:mb-4 flex items-center gap-2">
            <Bookmark className="w-4 h-4 sm:w-5 sm:h-5 text-teal-500" /> Bookmarks
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4">
            {state.bookmarkedModules.map(id => {
              const module = COURSE_MODULES.find(m => m.id === id)
              if (!module) return null
              return (
                <button
                  key={id}
                  onClick={() => {
                    state.setCurrentModuleIndex(COURSE_MODULES.findIndex(m => m.id === id))
                    state.setActiveSection('course')
                  }}
                  className="p-3 sm:p-4 rounded-lg sm:rounded-xl bg-white dark:bg-slate-800/90 hover:bg-teal-50 dark:hover:bg-teal-800/30 active:bg-teal-100 dark:active:bg-teal-800/40 border border-slate-200 dark:border-slate-600 hover:border-teal-300 dark:hover:border-teal-500/50 text-left transition-all card-lift focus-ring touch-manipulation shadow-sm"
                >
                  <div className="text-[10px] sm:text-sm text-teal-500 dark:text-teal-300 font-medium">Module {module.number}</div>
                  <div className="font-bold text-xs sm:text-base text-slate-900 dark:text-white truncate">{module.title}</div>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Social Proof Banner */}
      <div
        className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-lg border border-slate-200/50 dark:border-teal-500/10"
        role="complementary"
        aria-label="Course statistics"
      >
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 text-center">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 p-2 rounded-lg bg-slate-50/50 dark:bg-slate-800/30">
            <Users className="w-4 h-4 sm:w-5 sm:h-5 text-teal-500" aria-hidden="true" />
            <div className="flex flex-col sm:flex-row items-center gap-0.5 sm:gap-1">
              <span className="font-black text-sm sm:text-base text-slate-900 dark:text-white">{memberStats.totalMembers.toLocaleString()}+</span>
              <span className="text-slate-500 dark:text-slate-400 text-[10px] sm:text-sm">enrolled</span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 p-2 rounded-lg bg-emerald-50/50 dark:bg-emerald-900/20">
            <div className="relative">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <div className="absolute inset-0 w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-0.5 sm:gap-1">
              <span className="font-black text-sm sm:text-base text-emerald-600 dark:text-emerald-400">{memberStats.activeNow.toLocaleString()}</span>
              <span className="text-slate-500 dark:text-slate-400 text-[10px] sm:text-sm">active</span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 p-2 rounded-lg bg-amber-50/50 dark:bg-amber-900/20">
            <Star className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 fill-amber-500" aria-hidden="true" />
            <div className="flex flex-col sm:flex-row items-center gap-0.5 sm:gap-1">
              <span className="font-black text-sm sm:text-base text-slate-900 dark:text-white">{COURSE_CONFIG.socialProof?.rating || '4.9'}</span>
              <span className="text-slate-500 dark:text-slate-400 text-[10px] sm:text-sm">rating</span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 p-2 rounded-lg bg-blue-50/50 dark:bg-blue-900/20">
            <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" aria-hidden="true" />
            <div className="flex flex-col sm:flex-row items-center gap-0.5 sm:gap-1">
              <span className="font-black text-sm sm:text-base text-slate-900 dark:text-white">{COURSE_CONFIG.socialProof?.countriesServed || '23'}</span>
              <span className="text-slate-500 dark:text-slate-400 text-[10px] sm:text-sm">countries</span>
            </div>
          </div>
        </div>
      </div>

      {/* Coming Soon Courses */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-2xl border border-slate-700/50">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 sm:mb-6">
          <div>
            <h2 className="text-lg sm:text-2xl font-black text-white flex items-center gap-2 sm:gap-3">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400" />
              Coming Soon
            </h2>
            <p className="text-slate-400 text-xs sm:text-base mt-0.5 sm:mt-1">New courses for dentists. Join the waitlist!</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/30 self-start sm:self-auto">
            <Bell className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
            <span className="text-amber-400 text-xs sm:text-sm font-bold">{state.waitlistedCourses.length} on list</span>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {COMING_SOON_COURSES.map((course) => {
            const isWaitlisted = state.waitlistedCourses.includes(course.id)
            const IconComponent = course.icon

            return (
              <div
                key={course.id}
                className="relative group bg-slate-800/50 hover:bg-slate-800 rounded-lg sm:rounded-xl p-4 sm:p-5 border border-slate-700/50 hover:border-slate-600 transition-all duration-300"
              >
                {/* Course Icon & Title */}
                <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br ${course.color} flex items-center justify-center shadow-lg flex-shrink-0`}>
                    <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0 pr-12 sm:pr-16">
                    <h3 className="font-bold text-white text-sm sm:text-lg leading-tight">{course.title}</h3>
                    <p className="text-slate-400 text-xs sm:text-sm truncate">{course.subtitle}</p>
                  </div>
                </div>

                {/* Description - Hidden on mobile */}
                <p className="hidden sm:block text-slate-300 text-sm mb-4 line-clamp-2">{course.description}</p>

                {/* Features - Show fewer on mobile */}
                <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                  {course.features.slice(0, 1).map((feature, i) => (
                    <span key={i} className="px-2 py-0.5 sm:py-1 rounded-md bg-slate-700/50 text-slate-300 text-[10px] sm:text-xs">
                      {feature}
                    </span>
                  ))}
                  <span className="sm:hidden px-2 py-0.5 rounded-md bg-slate-700/50 text-slate-400 text-[10px]">
                    +{course.features.length - 1} more
                  </span>
                  {course.features.slice(1, 2).map((feature, i) => (
                    <span key={i} className="hidden sm:inline px-2 py-1 rounded-md bg-slate-700/50 text-slate-300 text-xs">
                      {feature}
                    </span>
                  ))}
                  {course.features.length > 2 && (
                    <span className="hidden sm:inline px-2 py-1 rounded-md bg-slate-700/50 text-slate-400 text-xs">
                      +{course.features.length - 2} more
                    </span>
                  )}
                </div>

                {/* Meta Info */}
                <div className="flex items-center justify-between text-xs sm:text-sm mb-3 sm:mb-4">
                  <span className="text-slate-400">
                    <span className="text-teal-400 font-bold">{course.waitlistCount.toLocaleString()}</span> waiting
                  </span>
                  <span className="text-slate-500 text-[10px] sm:text-sm">{course.estimatedLaunch}</span>
                </div>

                {/* Waitlist Button */}
                <button
                  onClick={() => state.toggleWaitlist(course.id)}
                  className={`w-full py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-bold text-xs sm:text-sm transition-all duration-300 flex items-center justify-center gap-1.5 sm:gap-2 touch-manipulation ${
                    isWaitlisted
                      ? 'bg-teal-500/20 text-teal-400 border border-teal-500/30 hover:bg-teal-500/30'
                      : 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white hover:shadow-lg hover:shadow-teal-500/25'
                  }`}
                >
                  {isWaitlisted ? (
                    <>
                      <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span className="hidden sm:inline">On Your Waitlist</span>
                      <span className="sm:hidden">On List</span>
                    </>
                  ) : (
                    <>
                      <Bell className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      Notify Me
                    </>
                  )}
                </button>

                {/* Price Tag */}
                <div className="absolute top-3 sm:top-4 right-3 sm:right-4 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md bg-slate-900/80 border border-slate-600/50">
                  <span className="text-slate-400 text-[10px] sm:text-xs line-through mr-0.5 sm:mr-1">${course.price}</span>
                  <span className="text-emerald-400 text-[10px] sm:text-xs font-bold">FREE</span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Early Access Banner */}
        <div className="mt-4 sm:mt-6 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
              <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-amber-400 font-bold text-sm sm:text-base">Early Access Perk</p>
              <p className="text-slate-400 text-xs sm:text-sm">Complete the course to unlock early access to new courses!</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile FAB for Quick Actions */}
      <FloatingActionButton
        actions={[
          { icon: <Video className="w-5 h-5" />, label: 'Continue Course', onClick: () => { state.setCurrentModuleIndex(state.nextIncompleteModuleIndex); state.setActiveSection('course') } },
          { icon: <Gift className="w-5 h-5" />, label: 'Bonuses', onClick: () => state.setActiveSection('bonuses') },
          { icon: <Trophy className="w-5 h-5" />, label: 'Achievements', onClick: () => state.setActiveSection('achievements') },
        ]}
      />
    </div>
  )
})

// ============================================
// COURSE SECTION
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

  // Swipe navigation for mobile
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
    <div {...swipeHandlers} className="space-y-4 sm:space-y-6 animate-fade-in touch-pan-y pb-4 sm:pb-0">
      {/* Breadcrumbs & Progress Indicator */}
      <nav aria-label="Breadcrumb" className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
        {/* Mobile: Simplified breadcrumb + progress */}
        <div className="flex items-center justify-between sm:hidden">
          <div className="flex items-center gap-2">
            <button
              onClick={() => state.setActiveSection('dashboard')}
              className="p-2 -ml-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus-ring"
              aria-label="Back to Dashboard"
            >
              <Home className="w-4 h-4" />
            </button>
            <span className="text-teal-500 dark:text-teal-400 font-bold text-sm">
              Module {currentModule.number}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {state.completedCount}/{state.totalModules}
            </span>
            <div className="w-16 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full" style={{ width: `${state.progressPercent}%` }} />
            </div>
          </div>
        </div>

        {/* Desktop: Full breadcrumb */}
        <ol className="hidden sm:flex items-center gap-2 text-sm" role="list">
          <li>
            <button
              onClick={() => state.setActiveSection('dashboard')}
              className="text-slate-500 dark:text-slate-400 hover:text-teal-500 dark:hover:text-teal-400 transition-colors focus-ring rounded px-1"
            >
              Dashboard
            </button>
          </li>
          <li aria-hidden="true" className="text-slate-300 dark:text-slate-600">/</li>
          <li>
            <span className="text-slate-700 dark:text-slate-300 font-medium">Course</span>
          </li>
          <li aria-hidden="true" className="text-slate-300 dark:text-slate-600">/</li>
          <li>
            <span className="text-teal-500 dark:text-teal-400 font-semibold" aria-current="page">
              Module {currentModule.number}
            </span>
          </li>
        </ol>
        <div className="hidden sm:flex items-center gap-3 text-sm">
          <span className="text-slate-500 dark:text-slate-400">
            <span className="font-bold text-teal-500">{state.completedCount}</span> of {state.totalModules} completed
          </span>
          <div className="w-24 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden" role="progressbar" aria-valuenow={state.progressPercent} aria-valuemin={0} aria-valuemax={100}>
            <div className="h-full bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full transition-all duration-500" style={{ width: `${state.progressPercent}%` }} />
          </div>
        </div>
      </nav>

      <div className="grid lg:grid-cols-3 gap-8">
      {/* Video Player & Module Info */}
      <div className="lg:col-span-2 space-y-6">
        {/* Video Player */}
        {currentModule.wistiaId ? (
          <WistiaPlayer
            wistiaId={currentModule.wistiaId}
            onVideoEnd={state.markComplete}
            onProgress={state.handleVideoProgress}
            resumeTime={savedProgress?.seconds || 0}
            reducedMotion={state.reducedMotion}
          />
        ) : (
          <div className="aspect-video rounded-2xl bg-slate-100 dark:bg-slate-700/80 flex items-center justify-center border border-slate-200/50 dark:border-slate-600">
            <div className="text-center">
              <Lock className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
              <p className="text-xl font-bold text-slate-500 dark:text-slate-400">Coming Soon</p>
            </div>
          </div>
        )}

        {/* Video Progress Bar */}
        {savedProgress && (
          <div className="bg-white dark:bg-slate-900 rounded-xl p-3 shadow border border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400 mb-1">
              <span>Video Progress</span>
              <span>{Math.round(savedProgress.percent)}%</span>
            </div>
            <div className="bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-teal-500 rounded-full transition-all"
                style={{ width: `${savedProgress.percent}%` }}
              />
            </div>
          </div>
        )}

        {/* Module Info */}
        <div className="bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg shadow-teal-400/5 border border-slate-100 dark:border-slate-800">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-3 sm:mb-4">
            <span className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold bg-teal-100 dark:bg-teal-800/30 text-teal-600 dark:text-teal-300">
              MODULE {currentModule.number}
            </span>
            <span className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium bg-slate-100 dark:bg-slate-700/80 text-slate-600 dark:text-slate-300 border border-slate-200/50 dark:border-slate-600">
              {currentModule.duration}
            </span>
            {isCompleted && state.showCompletedBadge && (
              <span className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 flex items-center gap-0.5 sm:gap-1">
                <CheckCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> Done
              </span>
            )}

            {/* Bookmark button */}
            <button
              onClick={() => state.toggleBookmark(currentModule.id)}
              className={`ml-auto p-1.5 sm:p-2 rounded-lg transition-all focus-ring touch-manipulation border ${
                isBookmarked
                  ? 'bg-teal-100 dark:bg-teal-800/30 text-teal-500 border-teal-200 dark:border-teal-700'
                  : 'bg-white dark:bg-slate-700/80 text-slate-400 dark:text-slate-300 border-slate-200 dark:border-slate-600 hover:text-teal-500 hover:border-teal-300 active:bg-slate-100 dark:active:bg-slate-600'
              }`}
              aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
              aria-pressed={isBookmarked}
            >
              {isBookmarked ? <BookmarkCheck className="w-4 h-4 sm:w-5 sm:h-5" /> : <Bookmark className="w-4 h-4 sm:w-5 sm:h-5" />}
            </button>

            {/* Notes button */}
            <button
              onClick={() => state.setShowNotesModal(true)}
              className={`p-1.5 sm:p-2 rounded-lg transition-all focus-ring touch-manipulation border ${
                hasNotes
                  ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 border-amber-200 dark:border-amber-700'
                  : 'bg-white dark:bg-slate-700/80 text-slate-400 dark:text-slate-300 border-slate-200 dark:border-slate-600 hover:text-amber-600 hover:border-amber-300 active:bg-slate-100 dark:active:bg-slate-600'
              }`}
              aria-label="Module notes"
            >
              <StickyNote className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          <h1 className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white mb-2 sm:mb-3">{currentModule.title}</h1>
          <p className="text-xs sm:text-base text-slate-600 dark:text-slate-400 mb-4 sm:mb-6">{currentModule.description}</p>

          {/* Mark Complete Button */}
          {!currentModule.comingSoon && (
            <button
              onClick={state.markComplete}
              disabled={isCompleted}
              className={`w-full py-3 sm:py-4 rounded-xl font-bold text-sm sm:text-base transition-all focus-ring touch-manipulation ${
                isCompleted
                  ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 cursor-default'
                  : 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white hover:shadow-lg hover:shadow-teal-400/30 btn-press active:scale-[0.98]'
              }`}
            >
              <span className="flex items-center justify-center gap-1.5 sm:gap-2">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                {isCompleted ? 'Completed!' : 'Mark Complete'}
              </span>
            </button>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 gap-2">
            <button
              onClick={state.prevModule}
              disabled={state.currentModuleIndex === 0}
              className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-2 min-h-[44px] rounded-xl transition-all focus-ring touch-manipulation ${
                state.currentModuleIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-100 dark:hover:bg-slate-800 active:bg-slate-200 dark:active:bg-slate-700'
              } text-slate-700 dark:text-slate-300`}
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Previous</span>
            </button>
            <span className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">{state.currentModuleIndex + 1}/{state.totalModules}</span>
            <button
              onClick={state.nextModule}
              disabled={state.currentModuleIndex >= state.totalModules - 1 || COURSE_MODULES[state.currentModuleIndex + 1]?.comingSoon}
              className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-2 min-h-[44px] rounded-xl bg-teal-500 text-white transition-all focus-ring btn-press touch-manipulation ${
                state.currentModuleIndex >= state.totalModules - 1 || COURSE_MODULES[state.currentModuleIndex + 1]?.comingSoon
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-teal-600 active:bg-teal-700'
              }`}
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* What You'll Learn */}
        <div className="bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg shadow-teal-400/5 border border-slate-100 dark:border-slate-800">
          <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white mb-3 sm:mb-4 flex items-center gap-2">
            <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" /> What You'll Learn
          </h3>
          <div className="space-y-2 sm:space-y-3">
            {currentModule.lessons.map((lesson, i) => (
              <div key={i} className="flex items-start sm:items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-lg sm:rounded-xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-600 shadow-sm">
                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-500" />
                </div>
                <span className="text-xs sm:text-base text-slate-700 dark:text-slate-200 font-medium">{lesson}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Resources */}
        {currentModule.resources.length > 0 && (
          <div className="bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg shadow-teal-400/5 border border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white mb-3 sm:mb-4 flex items-center gap-2">
              <Download className="w-4 h-4 sm:w-5 sm:h-5 text-teal-500" /> Resources
            </h3>
            <div className="space-y-2 sm:space-y-3">
              {currentModule.resources.map((resource, i) => (
                <a
                  key={i}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg sm:rounded-xl border border-slate-200 dark:border-slate-700 hover:border-teal-300 dark:hover:border-teal-500 hover:bg-teal-50 dark:hover:bg-teal-800/20 active:bg-teal-100 dark:active:bg-teal-800/30 transition-all card-lift focus-ring touch-manipulation"
                >
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-teal-100 dark:bg-teal-800/30 flex items-center justify-center flex-shrink-0">
                    {resource.type === 'link' ? <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5 text-teal-500" /> : <FileDown className="w-4 h-4 sm:w-5 sm:h-5 text-teal-500" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm sm:text-base text-slate-900 dark:text-white truncate">{resource.name}</div>
                    <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">{resource.type === 'link' ? 'Open Link' : 'Download'}</div>
                  </div>
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 flex-shrink-0" />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Notes Section */}
        {hasNotes && (
          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-amber-200 dark:border-amber-800">
            <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white mb-2 sm:mb-3 flex items-center gap-2">
              <StickyNote className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" /> Your Notes
            </h3>
            <p className="text-xs sm:text-base text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{state.moduleNotes[currentModule.id]}</p>
            <button
              onClick={() => state.setShowNotesModal(true)}
              className="mt-3 sm:mt-4 text-xs sm:text-sm text-amber-600 hover:underline focus-ring touch-manipulation"
            >
              Edit notes
            </button>
          </div>
        )}
      </div>

      {/* Module List Sidebar */}
      <div className="space-y-4">
        <div className="bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg shadow-teal-400/5 border border-slate-100 dark:border-slate-800">
          <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mb-3 sm:mb-4">All Modules</h2>
          <div className="space-y-2">
            {COURSE_MODULES.filter(m => !m.comingSoon).map((module, idx) => {
              const moduleCompleted = state.completedModules.includes(module.id)
              const isCurrent = state.currentModuleIndex === COURSE_MODULES.findIndex(m => m.id === module.id)
              const moduleBookmarked = state.bookmarkedModules.includes(module.id)
              const moduleHasNotes = !!state.moduleNotes[module.id]

              return (
                <button
                  key={module.id}
                  onClick={() => state.setCurrentModuleIndex(COURSE_MODULES.findIndex(m => m.id === module.id))}
                  className={`w-full p-4 min-h-[56px] rounded-xl text-left transition-all focus-ring touch-manipulation ${
                    isCurrent
                      ? 'bg-teal-100 dark:bg-teal-800/30 border-2 border-teal-400'
                      : moduleCompleted
                        ? 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 hover:border-emerald-300'
                        : 'bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-600 hover:border-teal-300 dark:hover:border-teal-500 hover:bg-teal-50 dark:hover:bg-teal-800/30 shadow-sm'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                      moduleCompleted
                        ? 'bg-emerald-500 text-white'
                        : isCurrent
                          ? 'bg-teal-500 text-white'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                    }`}>
                      {moduleCompleted ? <Check className="w-4 h-4" /> : module.number}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`text-sm font-bold truncate ${isCurrent ? 'text-teal-600 dark:text-teal-300' : 'text-slate-900 dark:text-white'}`}>
                        {module.title}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
                        {module.duration}
                        {moduleBookmarked && <Bookmark className="w-3 h-3 text-teal-400" />}
                        {moduleHasNotes && <StickyNote className="w-3 h-3 text-amber-500" />}
                      </div>
                    </div>
                  </div>
                </button>
              )
            })}

            {/* Coming Soon Module */}
            {COURSE_MODULES.filter(m => m.comingSoon).map((module) => (
              <div
                key={module.id}
                className="w-full p-4 min-h-[56px] rounded-xl bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800/80 dark:to-slate-800/60 border border-slate-200 dark:border-slate-600 opacity-70"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400">
                    <Lock className="w-3 h-3" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold truncate text-slate-900 dark:text-white">{module.title}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">{module.duration}</div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400">SOON</span>
                </div>
              </div>
            ))}

            {/* Upcoming Courses Divider */}
            <div className="flex items-center gap-2 pt-4 pb-2">
              <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Upcoming Courses</span>
              <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
            </div>

            {/* Coming Soon Courses */}
            {COMING_SOON_COURSES.map((course, idx) => {
              const CourseIcon = course.icon
              return (
                <div
                  key={course.id}
                  className="w-full p-3 sm:p-4 min-h-[56px] rounded-xl bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-800 border border-slate-200 dark:border-slate-700 opacity-70"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br ${course.color}`}>
                      <CourseIcon className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold truncate text-slate-900 dark:text-white">{course.title}</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">{course.subtitle} • {course.estimatedLaunch}</div>
                    </div>
                    <div className="flex flex-col items-end gap-0.5">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400">FREE</span>
                      <span className="text-[9px] text-slate-400 line-through">${course.price}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Course Progress */}
        <div className="bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white">
          <h3 className="font-bold text-sm sm:text-base mb-2 sm:mb-4">Your Progress</h3>
          <div className="text-2xl sm:text-4xl font-black mb-1 sm:mb-2">{Math.round(state.progressPercent)}%</div>
          <div className="bg-white/20 rounded-full h-1.5 sm:h-2 mb-1.5 sm:mb-2 overflow-hidden" role="progressbar" aria-valuenow={state.progressPercent} aria-valuemin={0} aria-valuemax={100} aria-label="Course progress">
            <div className="h-full bg-white rounded-full transition-all duration-500" style={{ width: `${state.progressPercent}%` }} />
          </div>
          <div className="text-xs sm:text-sm text-teal-200">{state.completedCount}/{state.totalModules} modules done</div>
          {state.timeRemaining > 0 && (
            <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-white/20 text-xs sm:text-sm text-teal-200">
              <Clock className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" aria-hidden="true" /> {state.timeRemaining} min left
            </div>
          )}
        </div>
      </div>
      </div>
    </div>
  )
})

// ============================================
// BONUSES SECTION
// ============================================

interface BonusesProps {
  state: PlatformStateType
}

export const BonusesSection = memo(function BonusesSection({ state }: BonusesProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')

  const filteredBonuses = BONUSES.filter(bonus => {
    const matchesSearch = bonus.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bonus.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === 'All' || bonus.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  return (
    <div className="space-y-5 sm:space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center">
        <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto rounded-xl sm:rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center shadow-xl shadow-teal-400/30 mb-3 sm:mb-4">
          <Gift className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-1 sm:mb-2">Your Bonus Vault</h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-lg">Resources worth <span className="font-bold text-teal-500">${TOTAL_BONUS_VALUE}</span></p>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col gap-3 sm:gap-4">
        <div className="relative">
          <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-slate-400" aria-hidden="true" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search bonuses..."
            className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 rounded-xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-600 text-sm sm:text-base text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-teal-400 dark:focus:border-teal-400 focus:outline-none focus:ring-4 focus:ring-teal-400/10 transition-all shadow-sm"
            aria-label="Search bonuses"
          />
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide" role="tablist">
          {BONUS_CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-all focus-ring touch-manipulation ${
                categoryFilter === cat
                  ? 'bg-teal-500 text-white'
                  : 'bg-white dark:bg-slate-700/80 text-slate-600 dark:text-slate-200 border border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500 active:bg-slate-100 dark:active:bg-slate-600'
              }`}
              role="tab"
              aria-selected={categoryFilter === cat}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Bonuses Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filteredBonuses.map((bonus) => {
          const Icon = bonus.icon
          const isDownloaded = state.downloadedBonuses.includes(bonus.id)
          return (
            <div key={bonus.id} className="bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl shadow-lg shadow-teal-400/5 border border-slate-100 dark:border-slate-800 hover:shadow-xl hover:border-teal-200 dark:hover:border-teal-600 transition-all overflow-hidden group card-lift">
              {/* Bonus Image */}
              <div className="relative aspect-[16/10] bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-900 overflow-hidden">
                <Image
                  src={bonus.image}
                  alt={bonus.name}
                  fill
                  className="object-contain p-3 sm:p-4 group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 right-2 sm:top-3 sm:right-3">
                  {(bonus as any).isFreeBonus ? (
                    <span className="px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-bold bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg animate-pulse">
                      FREE
                    </span>
                  ) : (
                    <span className="px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-bold bg-emerald-500 text-white shadow-lg">
                      ${bonus.value}
                    </span>
                  )}
                </div>
              </div>

              {/* Bonus Content */}
              <div className="p-3 sm:p-5">
                <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-teal-100 to-cyan-100 dark:from-teal-800/30 dark:to-cyan-800/30 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-teal-500" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-tight truncate">{bonus.name}</h3>
                    <span className="text-[10px] sm:text-xs text-teal-500 dark:text-teal-300 font-medium">{bonus.category}</span>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-3 sm:mb-4 line-clamp-2">{bonus.description}</p>
                {(() => {
                  const isExternalLink = bonus.url.startsWith('http')
                  return (
                    <a
                      href={bonus.url}
                      {...(isExternalLink ? { target: '_blank', rel: 'noopener noreferrer' } : { download: true })}
                      onClick={() => state.handleBonusDownload(bonus.id)}
                      className={`w-full flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-bold text-sm transition-all focus-ring touch-manipulation ${
                        isDownloaded
                          ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                          : 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white hover:shadow-lg hover:shadow-teal-400/30 btn-press active:scale-95'
                      }`}
                    >
                      {isDownloaded ? (
                        <>
                          <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                          <span className="hidden sm:inline">{isExternalLink ? 'Accessed' : 'Downloaded'}</span>
                          <span className="sm:hidden">Done</span>
                        </>
                      ) : (
                        <>
                          {isExternalLink ? <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5" /> : <Download className="w-4 h-4 sm:w-5 sm:h-5" />}
                          {isExternalLink ? 'Access' : 'Download'}
                        </>
                      )}
                    </a>
                  )
                })()}
              </div>
            </div>
          )
        })}
      </div>

      {filteredBonuses.length === 0 && (
        <div className="text-center py-12">
          <Search className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
          <p className="text-slate-500 dark:text-slate-400">No bonuses found matching your search</p>
        </div>
      )}

      {/* Total Value Banner */}
      <div className="bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl sm:rounded-2xl p-5 sm:p-8 text-center text-white">
        <div className="text-3xl sm:text-5xl font-black mb-1 sm:mb-2">${TOTAL_BONUS_VALUE}</div>
        <div className="text-base sm:text-xl text-teal-200">Total Value of Your Bonuses</div>
        <div className="text-xs sm:text-sm text-teal-200 mt-1 sm:mt-2">
          {state.downloadedBonuses.length} of {BONUSES.length} downloaded
        </div>
      </div>
    </div>
  )
})


// ============================================
// ACHIEVEMENTS SECTION
// ============================================

interface AchievementsProps {
  state: PlatformStateType
}

export const AchievementsSection = memo(function AchievementsSection({ state }: AchievementsProps) {
  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center">
        <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto rounded-xl sm:rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-xl shadow-amber-500/30 mb-3 sm:mb-4">
          <Trophy className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-1 sm:mb-2">Your Achievements</h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-lg">
          <span className="font-bold text-amber-600">{state.unlockedCount}</span> of {ACHIEVEMENTS.length} badges unlocked
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl p-3 sm:p-6 shadow-lg shadow-teal-400/5 border border-slate-100 dark:border-slate-800 text-center card-lift">
          <Star className="w-6 h-6 sm:w-8 sm:h-8 text-amber-500 mx-auto mb-1 sm:mb-2" />
          <div className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white">{state.totalPoints}</div>
          <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Points</div>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl p-3 sm:p-6 shadow-lg shadow-teal-400/5 border border-slate-100 dark:border-slate-800 text-center card-lift">
          <Flame className="w-6 h-6 sm:w-8 sm:h-8 text-orange-500 mx-auto mb-1 sm:mb-2" />
          <div className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white">{state.streak}</div>
          <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Streak</div>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl p-3 sm:p-6 shadow-lg shadow-teal-400/5 border border-slate-100 dark:border-slate-800 text-center card-lift">
          <Trophy className="w-6 h-6 sm:w-8 sm:h-8 text-teal-500 mx-auto mb-1 sm:mb-2" />
          <div className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white">{state.unlockedCount}</div>
          <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Badges</div>
        </div>
      </div>

      {/* Achievements Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {ACHIEVEMENTS.map((achievement) => {
          const Icon = achievement.icon
          const isUnlocked = state.unlockedAchievements[achievement.id]
          const tierColors: Record<string, string> = {
            bronze: 'from-amber-600 to-orange-700',
            silver: 'from-slate-400 to-slate-500',
            gold: 'from-amber-400 to-yellow-500'
          }

          return (
            <div key={achievement.id} className={`bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border transition-all card-lift ${
              isUnlocked
                ? 'shadow-amber-500/10 border-amber-200 dark:border-amber-800'
                : 'shadow-teal-400/5 border-slate-100 dark:border-slate-800 opacity-60'
            }`}>
              <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                <div className={`w-11 h-11 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0 ${
                  isUnlocked
                    ? `bg-gradient-to-br ${tierColors[achievement.tier] || tierColors.bronze} shadow-lg`
                    : 'bg-slate-200 dark:bg-slate-700'
                }`}>
                  <Icon className={`w-5 h-5 sm:w-7 sm:h-7 ${isUnlocked ? 'text-white' : 'text-slate-400'}`} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white truncate">{achievement.name}</h3>
                    {isUnlocked && <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-500 flex-shrink-0" />}
                  </div>
                  <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 line-clamp-2">{achievement.description}</div>
                </div>
              </div>
              <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-slate-100 dark:border-slate-800">
                <span className={`text-[10px] sm:text-xs font-bold uppercase px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full ${
                  achievement.tier === 'gold' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' :
                  achievement.tier === 'silver' ? 'bg-slate-100 dark:bg-slate-700/80 text-slate-600 dark:text-slate-300 border border-slate-200/50 dark:border-slate-600' :
                  'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400'
                }`}>
                  {achievement.tier}
                </span>
                <span className="text-xs sm:text-sm font-bold text-teal-500 dark:text-teal-300">+{achievement.points} pts</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Share Section */}
      {state.progressPercent >= 100 && (
        <div className="bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl sm:rounded-2xl p-5 sm:p-8 text-center text-white">
          <Award className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4" />
          <h3 className="text-xl sm:text-2xl font-black mb-1 sm:mb-2">AI Video Master!</h3>
          <p className="text-teal-200 text-sm sm:text-base mb-4 sm:mb-6">Share your achievement</p>
          <button
            onClick={() => state.setShowCertificateModal(true)}
            className="inline-flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold text-sm sm:text-base bg-white text-teal-500 hover:bg-teal-50 active:bg-teal-100 transition-all btn-press focus-ring touch-manipulation"
          >
            <Award className="w-4 h-4 sm:w-5 sm:h-5" /> Get Certificate
          </button>
        </div>
      )}
    </div>
  )
})
