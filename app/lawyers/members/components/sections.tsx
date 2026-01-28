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
// DASHBOARD SECTION - PREMIUM LP THEME
// ============================================

interface DashboardProps {
  state: PlatformStateType
}

export const DashboardSection = memo(function DashboardSection({ state }: DashboardProps) {
  const [showWelcomeVideo, setShowWelcomeVideo] = useState(false)
  const [memberStats, setMemberStats] = useState(getMemberStats())

  useEffect(() => {
    const interval = setInterval(() => {
      setMemberStats(getMemberStats())
    }, 30000) // Update every 30 seconds for live feel
    return () => clearInterval(interval)
  }, [])

  const nextModuleProgress = state.nextIncompleteModule ? state.videoProgress[state.nextIncompleteModule.id] : null
  const resumeSeconds = nextModuleProgress?.seconds || 0

  if (state.isLoading) return <DashboardSkeleton />

  return (
    <div className="space-y-4 sm:space-y-8 animate-fade-in">
      {/* MOBILE: Hero Progress Card - LP Premium Style */}
      <div className="sm:hidden relative overflow-hidden rounded-3xl bg-gradient-premium p-5 border border-amber-500/20 noise-overlay section-premium">
        {/* Floating Gradient Orbs - LP Style */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-amber-500/20 to-yellow-500/10 rounded-full blur-3xl floating" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-br from-yellow-500/15 to-amber-500/5 rounded-full blur-3xl floating-slow" style={{ animationDelay: '2s' }} />

        <div className="relative z-10">
          {/* Greeting */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">Welcome back</p>
              <h1 className="text-2xl font-black text-white drop-shadow-lg">
                {state.studentName || 'Student'}
              </h1>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center shadow-glow-gold">
              <span className="text-2xl font-black text-white">{Math.round(state.progressPercent)}%</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-xs mb-2">
              <span className="text-slate-400">{state.completedCount} of {state.totalModules} modules</span>
              <span className="text-amber-400 font-bold">{state.timeRemaining} min left</span>
            </div>
            <div className="h-2.5 bg-black/30 rounded-full overflow-hidden backdrop-blur-sm">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full transition-all duration-500"
                style={{ width: `${state.progressPercent}%` }}
              />
            </div>
          </div>

          {/* Continue Button - LP btn-premium style */}
          <button
            onClick={() => {
              state.setCurrentModuleIndex(state.nextIncompleteModuleIndex)
              state.setActiveSection('course')
            }}
            className="btn-premium w-full py-4 rounded-2xl text-white font-bold text-base flex items-center justify-center gap-2 shadow-glow-gold animate-pulse-glow"
          >
            <Play className="w-5 h-5" fill="white" />
            {state.progressPercent > 0 ? 'Continue Learning' : 'Start Course'}
          </button>
        </div>
      </div>

      {/* DESKTOP: Welcome Header - LP Style */}
      <div className="hidden sm:block relative overflow-hidden rounded-3xl bg-gradient-hero p-8 text-white section-premium noise-overlay border border-amber-500/20">
        {/* Floating Gradient Orbs */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-amber-500/15 to-yellow-500/5 rounded-full blur-3xl floating-slow" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-br from-yellow-500/10 to-amber-500/5 rounded-full blur-3xl floating" style={{ animationDelay: '2s' }} />
        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl font-black mb-2 drop-shadow-lg">
            {state.studentName ? `Welcome, ${state.studentName}!` : 'Welcome Back!'}
          </h1>
          <p className="text-amber-300 text-lg mb-6">
            {state.progressPercent >= 100 ? "Congratulations! You've completed the course!" : `${state.timeRemaining} min remaining`}
          </p>
          <div className="bg-black/30 backdrop-blur-sm rounded-full h-4 mb-2 overflow-hidden border border-amber-500/20">
            <div className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full transition-all duration-500" style={{ width: `${state.progressPercent}%` }} />
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-300">{state.completedCount}/{state.totalModules} modules</span>
            <span className="font-bold text-amber-400">{Math.round(state.progressPercent)}%</span>
          </div>
        </div>
      </div>

      {/* MOBILE: Quick Stats Grid - LP Glass Style */}
      <div className="sm:hidden grid grid-cols-2 gap-3">
        {[
          { icon: Clock, label: 'Watch Time', value: `${state.totalWatchTimeMinutes}m`, color: 'from-amber-500 to-yellow-500', iconColor: '#d4af37' },
          { icon: Star, label: 'Points', value: state.totalPoints.toString(), color: 'from-amber-500 to-orange-500', iconColor: '#f59e0b' },
          { icon: Flame, label: 'Day Streak', value: `${state.streak}`, color: 'from-orange-500 to-amber-500', iconColor: '#f43f5e' },
          { icon: Trophy, label: 'Badges', value: `${state.unlockedCount}/${ACHIEVEMENTS.length}`, color: 'from-emerald-500 to-amber-500', iconColor: '#10b981' },
        ].map((stat, i) => (
          <div key={i} className="relative overflow-hidden rounded-2xl glass-gold p-4 hover-lift">
            <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${stat.color} opacity-10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2`} />
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-2 shadow-lg`}>
              <stat.icon className="w-5 h-5 text-white" />
            </div>
            <p className="text-2xl font-black text-white">{stat.value}</p>
            <p className="text-xs text-slate-400 font-medium">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* DESKTOP: Stats Grid - LP Glass Style */}
      <div className="hidden sm:grid grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="glass-premium rounded-2xl p-6 hover-lift col-span-1 border border-amber-500/20">
          <div className="flex items-center gap-4">
            <ProgressRing progress={state.progressPercent} size={48} strokeWidth={4} showLabel={false} />
            <div>
              <div className="text-sm text-slate-400">Progress</div>
              <div className="text-2xl font-black text-white">{Math.round(state.progressPercent)}%</div>
            </div>
          </div>
        </div>
        {[
          { icon: Clock, label: 'Watched', value: `${state.totalWatchTimeMinutes}m`, color: 'from-amber-500 to-yellow-500' },
          { icon: Star, label: 'Points', value: state.totalPoints, color: 'from-amber-500 to-orange-500' },
          { icon: Flame, label: 'Streak', value: `${state.streak}d`, color: 'from-orange-500 to-red-500' },
          { icon: Trophy, label: 'Badges', value: `${state.unlockedCount}/${ACHIEVEMENTS.length}`, color: 'from-emerald-500 to-amber-500' },
        ].map((stat, i) => (
          <div key={i} className="glass-premium rounded-2xl p-6 hover-lift border border-amber-500/10">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-sm text-slate-400">{stat.label}</div>
                <div className="text-2xl font-black text-white">{stat.value}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MOBILE: Next Module Card - LP Glass Style */}
      {state.progressPercent < 100 && (
        <div className="sm:hidden">
          <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider mb-3 px-1">Up Next</h3>
          <button
            onClick={() => {
              state.setCurrentModuleIndex(state.nextIncompleteModuleIndex)
              state.setActiveSection('course')
            }}
            className="w-full relative overflow-hidden rounded-2xl glass-gold p-4 text-left active:scale-[0.99] transition-transform hover-lift"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center shadow-glow-gold flex-shrink-0">
                <Play className="w-7 h-7 text-white" fill="white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-amber-400 mb-0.5">
                  Module {state.nextIncompleteModule?.number}
                  {resumeSeconds > 0 && (
                    <span className="ml-2 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[10px] border border-amber-500/30">
                      Resume {Math.floor(resumeSeconds / 60)}:{String(Math.floor(resumeSeconds % 60)).padStart(2, '0')}
                    </span>
                  )}
                </p>
                <p className="text-base font-bold text-white truncate">{state.nextIncompleteModule?.title}</p>
                <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                  <Clock className="w-3 h-3" />
                  {state.nextIncompleteModule?.duration}
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-amber-400 flex-shrink-0" />
            </div>
          </button>
        </div>
      )}

      {/* MOBILE: Alex Morgan Welcome - LP Glass Style */}
      {state.completedCount === 0 && !showWelcomeVideo && (
        <div className="sm:hidden">
          <div className="rounded-2xl glass-premium p-4 border border-amber-500/20">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 ring-2 ring-amber-500/50 shadow-lg">
                <Image
                  src={COURSE_CONFIG.expert?.image || '/images/lawyer/alex-morgan.webp'}
                  alt={COURSE_CONFIG.expert?.name || 'Alex Morgan'}
                  width={64}
                  height={64}
                  className="object-cover object-top w-full h-full"
                />
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Start Here</p>
                <p className="text-sm font-bold text-white">Message from Alex Morgan</p>
                <button
                  onClick={() => setShowWelcomeVideo(true)}
                  className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg font-bold text-xs bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg active:scale-95 transition-transform"
                >
                  <Play className="w-3.5 h-3.5" fill="white" /> Watch
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DESKTOP: Alex Morgan Welcome - LP Glass Style */}
      {state.completedCount === 0 && !showWelcomeVideo && (
        <div className="hidden sm:block glass-premium rounded-3xl p-6 border border-amber-500/20">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 shadow-xl ring-4 ring-amber-500/30">
              <Image
                src={COURSE_CONFIG.expert?.image || '/images/lawyer/alex-morgan.webp'}
                alt={COURSE_CONFIG.expert?.name || 'Alex Morgan'}
                width={96}
                height={96}
                className="object-cover object-top w-full h-full"
              />
            </div>
            <div className="flex-1">
              <div className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">Start Here</div>
              <h3 className="text-xl font-black text-white mb-2">Welcome from {COURSE_CONFIG.expert?.name?.split(' ')[0] || 'Alex Morgan'}</h3>
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

      {/* Welcome Video Modal - LP Glass Style */}
      {showWelcomeVideo && (
        <div className="glass-premium rounded-3xl shadow-2xl border border-amber-500/20 overflow-hidden">
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl overflow-hidden">
                <Image
                  src={COURSE_CONFIG.expert?.image || '/images/lawyer/alex-morgan.webp'}
                  alt={COURSE_CONFIG.expert?.name || 'Alex Morgan'}
                  width={40}
                  height={40}
                  className="object-cover object-top w-full h-full"
                />
              </div>
              <div>
                <div className="font-bold text-white">{COURSE_CONFIG.expert?.name}</div>
                <div className="text-sm text-slate-400">{COURSE_CONFIG.expert?.title}</div>
              </div>
            </div>
            <button onClick={() => setShowWelcomeVideo(false)} className="p-2 rounded-xl hover:bg-white/10 transition-all">
              <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <WistiaPlayer wistiaId={COURSE_CONFIG.welcomeVideo?.wistiaId || 'fnjt6devuy'} showSpeedControls={false} />
        </div>
      )}

      {/* MOBILE: Quick Actions - LP Glass Style */}
      <div className="sm:hidden">
        <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider mb-3 px-1">Quick Actions</h3>
        <div className="flex gap-3">
          {[
            { icon: Gift, label: 'Bonuses', color: 'from-yellow-500 to-orange-500', section: 'bonuses' as const },
            { icon: Trophy, label: 'Badges', color: 'from-amber-500 to-orange-500', section: 'achievements' as const },
            { icon: MessageCircle, label: 'Support', color: 'from-emerald-500 to-amber-500', section: null },
          ].map((item, i) => (
            item.section ? (
              <button
                key={i}
                onClick={() => state.setActiveSection(item.section)}
                className="flex-1 relative overflow-hidden rounded-2xl glass-gold p-4 text-center active:scale-95 transition-transform hover-lift"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mx-auto mb-2 shadow-lg`}>
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <p className="text-xs font-bold text-white">{item.label}</p>
              </button>
            ) : (
              <a
                key={i}
                href={`mailto:${COURSE_CONFIG.supportEmail}`}
                className="flex-1 relative overflow-hidden rounded-2xl glass-gold p-4 text-center active:scale-95 transition-transform hover-lift"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mx-auto mb-2 shadow-lg`}>
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <p className="text-xs font-bold text-white">{item.label}</p>
              </a>
            )
          ))}
        </div>
      </div>

      {/* DESKTOP: Continue Learning & Quick Actions - LP Glass Style */}
      <div className="hidden sm:grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-premium rounded-2xl p-6 border border-amber-500/20">
          <h2 className="text-xl font-black text-white mb-4">
            {state.progressPercent >= 100 ? 'Course Complete!' : 'Continue Learning'}
          </h2>
          {state.progressPercent >= 100 ? (
            <div className="text-center py-6">
              <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-emerald-400 to-amber-500 flex items-center justify-center shadow-glow-gold mb-4">
                <Trophy className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-black text-white mb-2">Congratulations!</h3>
              <p className="text-slate-400 mb-4">You've completed all available modules!</p>
              <button
                onClick={() => state.setShowCertificateModal(true)}
                className="btn-premium inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white shadow-glow-gold"
              >
                <Award className="w-5 h-5" /> Get Certificate
              </button>
            </div>
          ) : (
            <button
              className="w-full flex items-center gap-4 p-4 rounded-xl glass-gold hover-lift text-left"
              onClick={() => {
                state.setCurrentModuleIndex(state.nextIncompleteModuleIndex)
                state.setActiveSection('course')
              }}
            >
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center shadow-glow-gold relative flex-shrink-0">
                <Play className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm text-amber-400 font-medium mb-1">
                  Module {state.nextIncompleteModule?.number}
                </div>
                <div className="font-bold text-white truncate">
                  {state.nextIncompleteModule?.title || state.currentModule.title}
                </div>
                <div className="text-sm text-slate-400 flex items-center gap-2">
                  <Clock className="w-3 h-3" />
                  {state.nextIncompleteModule?.duration || state.currentModule.duration}
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-amber-400 flex-shrink-0" />
            </button>
          )}
        </div>

        <div className="glass-premium rounded-2xl p-6 border border-amber-500/20">
          <h2 className="text-xl font-black text-white mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button
              onClick={() => state.setActiveSection('bonuses')}
              className="w-full flex items-center gap-3 p-4 rounded-xl glass-gold hover:border-yellow-400/50 transition-all hover-lift"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center shadow-lg">
                <Gift className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-white">View Bonuses</span>
            </button>
            <button
              onClick={() => state.setActiveSection('achievements')}
              className="w-full flex items-center gap-3 p-4 rounded-xl glass-gold hover:border-amber-400/50 transition-all hover-lift"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-white">View Achievements</span>
            </button>
            <a
              href={`mailto:${COURSE_CONFIG.supportEmail}`}
              className="w-full flex items-center gap-3 p-4 rounded-xl glass-gold hover:border-emerald-400/50 transition-all hover-lift"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-amber-500 flex items-center justify-center shadow-lg">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-white">Get Support</span>
            </a>
          </div>
        </div>
      </div>

      {/* MOBILE: Social Proof - LP Glass Style */}
      <div className="sm:hidden rounded-2xl glass-premium p-4 border border-amber-500/20">
        <div className="grid grid-cols-4 gap-2 text-center">
          {[
            { icon: Users, value: `${(memberStats.totalMembers / 1000).toFixed(1)}k`, label: 'Students', color: 'text-amber-400' },
            { icon: null, value: memberStats.activeNow.toLocaleString(), label: 'Active', color: 'text-emerald-400', pulse: true },
            { icon: Star, value: '4.9', label: 'Rating', color: 'text-amber-400' },
            { icon: Globe, value: '23', label: 'Countries', color: 'text-blue-400' },
          ].map((stat, i) => (
            <div key={i} className="py-2">
              {stat.pulse ? (
                <div className="flex items-center justify-center gap-1 mb-1">
                  <div className="relative">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    <div className="absolute inset-0 w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
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

      {/* DESKTOP: Social Proof Banner - LP Glass Style */}
      <div className="hidden sm:block glass-premium rounded-2xl p-5 border border-amber-500/20">
        <div className="grid grid-cols-4 gap-4 text-center">
          <div className="flex flex-row items-center justify-center gap-2 p-2 rounded-lg glass-gold">
            <Users className="w-5 h-5 text-amber-400" />
            <div className="flex items-center gap-1">
              <span className="font-black text-white">{memberStats.totalMembers.toLocaleString()}+</span>
              <span className="text-slate-400 text-sm">enrolled</span>
            </div>
          </div>
          <div className="flex flex-row items-center justify-center gap-2 p-2 rounded-lg glass-gold">
            <div className="relative">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <div className="absolute inset-0 w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
            </div>
            <div className="flex items-center gap-1">
              <span className="font-black text-emerald-400">{memberStats.activeNow.toLocaleString()}</span>
              <span className="text-slate-400 text-sm">active</span>
            </div>
          </div>
          <div className="flex flex-row items-center justify-center gap-2 p-2 rounded-lg glass-gold">
            <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
            <div className="flex items-center gap-1">
              <span className="font-black text-white">4.9</span>
              <span className="text-slate-400 text-sm">rating</span>
            </div>
          </div>
          <div className="flex flex-row items-center justify-center gap-2 p-2 rounded-lg glass-gold">
            <Globe className="w-5 h-5 text-blue-400" />
            <div className="flex items-center gap-1">
              <span className="font-black text-white">23</span>
              <span className="text-slate-400 text-sm">countries</span>
            </div>
          </div>
        </div>
      </div>

      {/* Coming Soon Courses - LP Premium Style */}
      <div className="hidden sm:block relative overflow-hidden rounded-2xl bg-gradient-hero p-8 section-premium noise-overlay border border-amber-500/20">
        {/* Floating Gradient Orbs */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-amber-500/10 to-yellow-500/5 rounded-full blur-3xl floating-slow" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-br from-yellow-500/10 to-amber-500/5 rounded-full blur-3xl floating" style={{ animationDelay: '2s' }} />

        <div className="relative z-10">
          <div className="flex items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-black text-white flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-amber-400" />
                Coming Soon
              </h2>
              <p className="text-slate-400 mt-1">New courses for lawyers. Join the waitlist!</p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full glass-gold border border-amber-500/30">
              <Bell className="w-4 h-4 text-amber-400" />
              <span className="text-amber-400 text-sm font-bold">{state.waitlistedCourses.length} on list</span>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {COMING_SOON_COURSES.map((course) => {
              const isWaitlisted = state.waitlistedCourses.includes(course.id)
              const IconComponent = course.icon
              return (
                <div key={course.id} className="relative group glass-premium rounded-xl p-5 border border-amber-500/20 hover:border-amber-400/40 transition-all duration-300 hover-lift">
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
                      <span key={i} className="px-2 py-1 rounded-md glass-gold text-slate-300 text-xs">{feature}</span>
                    ))}
                    {course.features.length > 2 && (
                      <span className="px-2 py-1 rounded-md glass-gold text-slate-400 text-xs">+{course.features.length - 2} more</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between text-sm mb-4">
                    <span className="text-slate-400"><span className="text-amber-400 font-bold">{course.waitlistCount.toLocaleString()}</span> waiting</span>
                    <span className="text-slate-500">{course.estimatedLaunch}</span>
                  </div>
                  <button
                    onClick={() => state.toggleWaitlist(course.id)}
                    className={`w-full py-3 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
                      isWaitlisted
                        ? 'glass-gold text-amber-400 border border-amber-500/30'
                        : 'btn-premium text-white shadow-glow-gold'
                    }`}
                  >
                    {isWaitlisted ? <><Check className="w-4 h-4" /> On Your Waitlist</> : <><Bell className="w-4 h-4" /> Notify Me</>}
                  </button>
                  <div className="absolute top-4 right-4 px-2 py-1 rounded-md glass-dark border border-slate-600/50">
                    <span className="text-slate-400 text-xs line-through mr-1">${course.price}</span>
                    <span className="text-emerald-400 text-xs font-bold">FREE</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
})

// ============================================
// COURSE SECTION - PREMIUM LP THEME
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
      {/* MOBILE: Compact Header - LP Glass Style */}
      <div className="sm:hidden flex items-center justify-between">
        <button
          onClick={() => state.setActiveSection('dashboard')}
          className="p-2 -ml-2 rounded-xl text-slate-400 hover:bg-white/10 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="text-center">
          <p className="text-xs text-amber-400 font-bold">Module {currentModule.number}</p>
          <p className="text-[10px] text-slate-500">{state.completedCount}/{state.totalModules} complete</p>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => state.toggleBookmark(currentModule.id)}
            className={`p-2 rounded-xl transition-all ${isBookmarked ? 'text-amber-400 glass-gold' : 'text-slate-400'}`}
          >
            {isBookmarked ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Video Player - LP Premium Shadow */}
      <div className="rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl shadow-amber-500/10 glass-premium border border-amber-500/20">
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
          <div className="aspect-video bg-gradient-hero flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl glass-premium flex items-center justify-center mx-auto mb-4 border border-amber-500/20">
                <Lock className="w-8 h-8 text-slate-400" />
              </div>
              <p className="text-xl font-bold text-white mb-1">Coming Soon</p>
              <p className="text-sm text-slate-400">This module is not yet available</p>
            </div>
          </div>
        )}
      </div>

      {/* MOBILE: Module Info Card - LP Glass Style */}
      <div className="sm:hidden glass-premium rounded-2xl p-4 border border-amber-500/20">
        {/* Module badges */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-amber-500 to-yellow-500 text-white shadow-lg">
            Module {currentModule.number}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-medium glass-gold text-slate-300">
            {currentModule.duration}
          </span>
          {isCompleted && (
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 flex items-center gap-1 border border-emerald-500/30">
              <CheckCircle className="w-3 h-3" /> Done
            </span>
          )}
        </div>

        {/* Title & Description */}
        <h1 className="text-lg font-black text-white mb-2">{currentModule.title}</h1>
        <p className="text-sm text-slate-400 mb-4">{currentModule.description}</p>

        {/* Mark Complete / Navigation */}
        <div className="flex items-center gap-3">
          {!currentModule.comingSoon && (
            <button
              onClick={state.markComplete}
              disabled={isCompleted}
              className={`flex-1 py-3.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                isCompleted
                  ? 'glass-gold text-emerald-400 border border-emerald-500/30'
                  : 'btn-premium text-white shadow-glow-gold active:scale-[0.98]'
              }`}
            >
              {isCompleted ? <><CheckCircle className="w-4 h-4" /> Completed</> : <><CheckCircle className="w-4 h-4" /> Mark Complete</>}
            </button>
          )}
          <div className="flex items-center gap-2">
            <button
              onClick={state.prevModule}
              disabled={!canGoPrev}
              className={`p-3 rounded-xl transition-all ${canGoPrev ? 'glass-gold text-slate-300 active:scale-95' : 'opacity-40 glass-dark'}`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={state.nextModule}
              disabled={!canGoNext}
              className={`p-3 rounded-xl transition-all ${canGoNext ? 'btn-premium text-white shadow-glow-gold active:scale-95' : 'opacity-40 glass-dark'}`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* DESKTOP: Module Info - LP Glass Style */}
      <div className="hidden sm:grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-premium rounded-2xl p-6 border border-amber-500/20">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-amber-500 to-yellow-500 text-white shadow-lg">
                MODULE {currentModule.number}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-medium glass-gold text-slate-300">
                {currentModule.duration}
              </span>
              {isCompleted && state.showCompletedBadge && (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 flex items-center gap-1 border border-emerald-500/30">
                  <CheckCircle className="w-3 h-3" /> Done
                </span>
              )}
              <button
                onClick={() => state.toggleBookmark(currentModule.id)}
                className={`ml-auto p-2 rounded-lg transition-all ${
                  isBookmarked
                    ? 'glass-gold text-amber-400'
                    : 'glass-dark text-slate-400 hover:text-amber-400'
                }`}
              >
                {isBookmarked ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
              </button>
              <button
                onClick={() => state.setShowNotesModal(true)}
                className={`p-2 rounded-lg transition-all ${
                  hasNotes
                    ? 'glass-gold text-amber-400'
                    : 'glass-dark text-slate-400 hover:text-amber-400'
                }`}
              >
                <StickyNote className="w-5 h-5" />
              </button>
            </div>
            <h1 className="text-2xl font-black text-white mb-3">{currentModule.title}</h1>
            <p className="text-slate-400 mb-6">{currentModule.description}</p>
            {!currentModule.comingSoon && (
              <button
                onClick={state.markComplete}
                disabled={isCompleted}
                className={`w-full py-4 rounded-xl font-bold transition-all ${
                  isCompleted
                    ? 'glass-gold text-emerald-400 border border-emerald-500/30'
                    : 'btn-premium text-white shadow-glow-gold'
                }`}
              >
                {isCompleted ? <><CheckCircle className="w-5 h-5 inline mr-2" /> Completed</> : <><CheckCircle className="w-5 h-5 inline mr-2" /> Mark Complete</>}
              </button>
            )}
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/10">
              <button
                onClick={state.prevModule}
                disabled={!canGoPrev}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all ${
                  canGoPrev ? 'text-slate-300 hover:bg-white/10' : 'opacity-40'
                }`}
              >
                <ChevronLeft className="w-5 h-5" /> Prev
              </button>
              <span className="text-sm text-slate-500 font-medium">{state.currentModuleIndex + 1}/{state.totalModules}</span>
              <button
                onClick={state.nextModule}
                disabled={!canGoNext}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-white transition-all ${
                  canGoNext ? 'btn-premium shadow-glow-gold' : 'opacity-40 glass-dark'
                }`}
              >
                Next <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* What You'll Learn - LP Glass Style */}
          <div className="glass-premium rounded-2xl p-6 border border-amber-500/20">
            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-400" /> What You'll Learn
            </h3>
            <div className="space-y-3">
              {currentModule.lessons.map((lesson, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl glass-gold">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                  </div>
                  <span className="text-slate-200 font-medium">{lesson}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Resources - LP Glass Style */}
          {currentModule.resources.length > 0 && (
            <div className="glass-premium rounded-2xl p-6 border border-amber-500/20">
              <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                <Download className="w-5 h-5 text-amber-400" /> Resources
              </h3>
              <div className="space-y-3">
                {currentModule.resources.map((resource, i) => (
                  <a
                    key={i}
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 rounded-xl glass-gold hover:border-amber-400/50 transition-all hover-lift"
                  >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center flex-shrink-0 shadow-lg">
                      {resource.type === 'link' ? <ExternalLink className="w-5 h-5 text-white" /> : <FileDown className="w-5 h-5 text-white" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-white truncate">{resource.name}</div>
                      <div className="text-sm text-slate-400">{resource.type === 'link' ? 'Open Link' : 'Download'}</div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-amber-400 flex-shrink-0" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Module List Sidebar - Premium Cards */}
        <div className="space-y-4">
          <div className="glass-premium rounded-2xl p-5 border border-amber-500/20">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-black text-white">All Modules</h2>
              <span className="text-xs text-slate-400 font-medium">{state.completedCount}/{COURSE_MODULES.filter(m => !m.comingSoon).length}</span>
            </div>
            <div className="space-y-3">
              {COURSE_MODULES.filter(m => !m.comingSoon).map((module, index) => {
                const moduleCompleted = state.completedModules.includes(module.id)
                const moduleIndex = COURSE_MODULES.findIndex(m => m.id === module.id)
                const isCurrent = state.currentModuleIndex === moduleIndex
                const savedProgress = state.videoProgress[module.id]
                const watchPercent = savedProgress?.percent || 0

                const gradients = [
                  'from-amber-500 to-yellow-600',
                  'from-amber-500 to-slate-600',
                  'from-amber-500 to-pink-600',
                  'from-amber-500 to-orange-600',
                  'from-emerald-500 to-amber-600',
                ]
                const gradientClass = gradients[index % gradients.length]

                return (
                  <button
                    key={module.id}
                    onClick={() => state.setCurrentModuleIndex(moduleIndex)}
                    className={`w-full text-left transition-all duration-300 group rounded-xl overflow-hidden ${
                      isCurrent
                        ? 'ring-2 ring-amber-400 shadow-lg shadow-amber-500/20'
                        : 'hover:ring-1 hover:ring-amber-500/30'
                    }`}
                  >
                    <div className={`relative ${
                      isCurrent
                        ? 'glass-premium border-transparent'
                        : moduleCompleted
                          ? 'glass-dark border border-emerald-500/20'
                          : 'glass-dark border border-transparent hover:border-amber-500/20'
                    }`}>
                      {/* Mini thumbnail header */}
                      <div className={`relative aspect-video bg-gradient-to-br ${gradientClass} overflow-hidden`}>
                        {/* Actual thumbnail image */}
                        {module.thumbnail && (
                          <Image
                            src={module.thumbnail}
                            alt={module.title}
                            fill
                            className="object-contain"
                          />
                        )}

                        {/* Gradient overlay for readability */}
                        <div className="absolute inset-0 bg-black/30" />

                        {/* Module number watermark */}
                        <div className="absolute top-1 left-2 text-3xl font-black text-white/30 leading-none">
                          {module.number}
                        </div>

                        {/* Play button */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                            isCurrent ? 'bg-white' : 'bg-white/80 group-hover:bg-white'
                          }`}>
                            {moduleCompleted ? (
                              <CheckCircle className="w-5 h-5 text-emerald-500" />
                            ) : (
                              <Play className={`w-5 h-5 ${isCurrent ? 'text-amber-500' : 'text-slate-600'}`} fill={isCurrent ? '#d4af37' : '#475569'} />
                            )}
                          </div>
                        </div>

                        {/* Duration */}
                        <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-black/40 backdrop-blur-sm">
                          <span className="text-[10px] font-bold text-white">{module.duration}</span>
                        </div>

                        {/* Progress bar */}
                        {watchPercent > 0 && watchPercent < 100 && (
                          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black/30">
                            <div className="h-full bg-white" style={{ width: `${watchPercent}%` }} />
                          </div>
                        )}

                        {/* Status badge */}
                        {moduleCompleted && (
                          <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-emerald-500 text-[10px] font-bold text-white">
                            Done
                          </div>
                        )}
                        {isCurrent && !moduleCompleted && (
                          <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-amber-500 text-[10px] font-bold text-white animate-pulse">
                            Playing
                          </div>
                        )}
                      </div>

                      {/* Title */}
                      <div className="p-3">
                        <h4 className={`text-sm font-bold leading-tight line-clamp-2 ${
                          isCurrent ? 'text-amber-400' : 'text-white'
                        }`}>
                          {module.title}
                        </h4>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE: Premium Module Cards - Full Redesign */}
      <div className="sm:hidden space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-black text-white">Up Next</h3>
          <span className="text-xs text-slate-400">{state.completedCount}/{COURSE_MODULES.filter(m => !m.comingSoon).length} completed</span>
        </div>

        <div className="space-y-4">
          {/* Show all modules EXCEPT the current one, including coming soon */}
          {COURSE_MODULES.filter(m => {
            const moduleIndex = COURSE_MODULES.findIndex(mod => mod.id === m.id)
            return moduleIndex !== state.currentModuleIndex // Exclude current module
          }).map((module, index) => {
            const moduleCompleted = state.completedModules.includes(module.id)
            const moduleIndex = COURSE_MODULES.findIndex(m => m.id === module.id)
            const savedProgress = state.videoProgress[module.id]
            const watchPercent = savedProgress?.percent || 0
            const isComingSoon = module.comingSoon

            return (
              <button
                key={module.id}
                onClick={() => {
                  if (!isComingSoon) {
                    state.setCurrentModuleIndex(moduleIndex)
                    state.setActiveSection('course')
                  }
                }}
                disabled={isComingSoon}
                className={`w-full text-left transition-all duration-300 group ${
                  isComingSoon ? 'opacity-80' : 'hover:scale-[1.01]'
                }`}
              >
                <div className={`relative overflow-hidden rounded-2xl border transition-all duration-300 ${
                  isComingSoon
                    ? 'glass-dark border-slate-700/50'
                    : moduleCompleted
                      ? 'glass-premium border-emerald-500/30'
                      : 'glass-dark border-slate-700/50 hover:border-amber-500/30'
                }`}>
                  {/* Thumbnail/Visual Header - Now with actual image */}
                  <div className="relative h-32 overflow-hidden">
                    {/* Actual thumbnail image */}
                    {module.thumbnail ? (
                      <Image
                        src={module.thumbnail}
                        alt={module.title}
                        fill
                        className={`object-cover ${isComingSoon ? 'grayscale opacity-50' : ''}`}
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-amber-500 to-yellow-600" />
                    )}

                    {/* Dark overlay for readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                    {/* Module number - large watermark */}
                    <div className="absolute top-2 left-3 text-[4rem] font-black text-white/30 leading-none">
                      {module.number}
                    </div>

                    {/* Play button overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 ${
                        isComingSoon
                          ? 'bg-slate-800/80'
                          : 'bg-white/90 group-hover:bg-white group-hover:scale-110'
                      }`}>
                        {isComingSoon ? (
                          <Lock className="w-6 h-6 text-slate-400" />
                        ) : moduleCompleted ? (
                          <CheckCircle className="w-7 h-7 text-emerald-500" />
                        ) : (
                          <Play className="w-7 h-7 text-slate-700" fill="#334155" />
                        )}
                      </div>
                    </div>

                    {/* Duration badge */}
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-black/40 backdrop-blur-sm">
                      <span className="text-xs font-bold text-white flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {module.duration}
                      </span>
                    </div>

                    {/* Progress bar at bottom of thumbnail */}
                    {watchPercent > 0 && watchPercent < 100 && !isComingSoon && (
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/30">
                        <div
                          className="h-full bg-amber-400 transition-all duration-300"
                          style={{ width: `${watchPercent}%` }}
                        />
                      </div>
                    )}

                    {/* Completed overlay */}
                    {moduleCompleted && !isComingSoon && (
                      <div className="absolute top-3 left-3 px-2 py-1 rounded-lg bg-emerald-500 shadow-lg">
                        <span className="text-xs font-bold text-white flex items-center gap-1">
                          <Check className="w-3 h-3" /> Done
                        </span>
                      </div>
                    )}

                    {/* Coming soon badge */}
                    {isComingSoon && (
                      <div className="absolute top-3 left-3 px-2 py-1 rounded-lg bg-amber-500/90 shadow-lg">
                        <span className="text-xs font-bold text-white flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Coming Soon
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    {/* Title */}
                    <h4 className={`font-bold text-base mb-2 leading-tight ${
                      isComingSoon ? 'text-slate-400' : 'text-white'
                    }`}>
                      {module.title}
                    </h4>

                    {/* What you'll learn - show first 2 lessons */}
                    <div className="space-y-1.5">
                      {module.lessons.slice(0, 2).map((lesson, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                            moduleCompleted ? 'bg-emerald-400' : 'bg-amber-400'
                          }`} />
                          <span className="text-xs text-slate-400 line-clamp-1">{lesson}</span>
                        </div>
                      ))}
                      {module.lessons.length > 2 && (
                        <span className="text-xs text-slate-500">+{module.lessons.length - 2} more</span>
                      )}
                    </div>

                    {/* Resume indicator */}
                    {savedProgress?.seconds > 0 && !moduleCompleted && (
                      <div className="mt-3 pt-3 border-t border-white/10">
                        <span className="text-xs text-amber-400 font-medium flex items-center gap-1">
                          <Play className="w-3 h-3" />
                          Resume at {Math.floor(savedProgress.seconds / 60)}:{String(Math.floor(savedProgress.seconds % 60)).padStart(2, '0')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
})

// ============================================
// BONUSES SECTION - PREMIUM LP THEME
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
      {/* MOBILE: Header - LP Style */}
      <div className="sm:hidden">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-black text-white">Bonuses</h1>
          <div className="px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 text-white text-xs font-bold shadow-glow-gold">
            ${TOTAL_BONUS_VALUE} Value
          </div>
        </div>
        <p className="text-sm text-slate-400">{BONUSES.length} premium resources included</p>
      </div>

      {/* DESKTOP: Header - LP Style */}
      <div className="hidden sm:flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center gap-3">
            <Gift className="w-8 h-8 text-amber-400" /> Bonus Resources
          </h1>
          <p className="text-slate-400 mt-1">Resources worth <span className="font-bold text-amber-400">${TOTAL_BONUS_VALUE}</span></p>
        </div>
        <div className="text-right">
          <p className="text-slate-500 text-sm">{state.downloadedBonuses.length}/{BONUSES.length} downloaded</p>
        </div>
      </div>

      {/* MOBILE: Category Pills - LP Glass Style */}
      <div className="sm:hidden flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
        {BONUS_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => { setCategoryFilter(cat); haptic.light() }}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              categoryFilter === cat
                ? 'btn-premium text-white shadow-glow-gold'
                : 'glass-dark text-slate-300'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* DESKTOP: Search & Filters - LP Glass Style */}
      <div className="hidden sm:block space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search bonuses..."
            className="w-full pl-12 pr-4 py-3 rounded-xl glass-premium border border-amber-500/20 text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none focus:ring-4 focus:ring-amber-400/10 transition-all"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {BONUS_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                categoryFilter === cat
                  ? 'btn-premium text-white shadow-glow-gold'
                  : 'glass-dark text-slate-300 hover:border-amber-500/50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Bonuses Grid - LP Glass Style */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBonuses.map((bonus) => {
          const Icon = bonus.icon
          const isDownloaded = state.downloadedBonuses.includes(bonus.id)
          return (
            <div key={bonus.id} className="glass-premium rounded-2xl border border-amber-500/20 overflow-hidden hover-lift group">
              {/* Bonus Image */}
              <div className="relative aspect-[16/10] bg-gradient-hero overflow-hidden">
                <Image
                  src={bonus.image}
                  alt={bonus.name}
                  fill
                  className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 right-2 px-2 py-1 rounded-lg glass-dark border border-amber-500/30">
                  <span className="text-emerald-400 text-xs font-bold">${bonus.value}</span>
                </div>
              </div>

              {/* Bonus Info */}
              <div className="p-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center shadow-glow-gold flex-shrink-0">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-white text-sm leading-tight">{bonus.name}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{bonus.category}</p>
                  </div>
                </div>
                <p className="text-xs text-slate-400 mb-4 line-clamp-2">{bonus.description}</p>
                <a
                  href={bonus.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => { if (!isDownloaded) state.handleBonusDownload(bonus.id); haptic.success() }}
                  className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                    isDownloaded
                      ? 'glass-gold text-emerald-400 border border-emerald-500/30'
                      : 'btn-premium text-white shadow-glow-gold active:scale-[0.98]'
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
// ACHIEVEMENTS SECTION - PREMIUM LP THEME
// ============================================

interface AchievementsProps {
  state: PlatformStateType
}

export const AchievementsSection = memo(function AchievementsSection({ state }: AchievementsProps) {
  const haptic = useHaptic()

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      {/* MOBILE: Header with Progress - LP Style */}
      <div className="sm:hidden">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-black text-white">Achievements</h1>
          <div className="px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold shadow-lg">
            {state.unlockedCount}/{ACHIEVEMENTS.length}
          </div>
        </div>
        <p className="text-sm text-slate-400">{state.totalPoints} total points earned</p>
      </div>

      {/* DESKTOP: Header - LP Style */}
      <div className="hidden sm:flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center gap-3">
            <Trophy className="w-8 h-8 text-amber-400" /> Achievements
          </h1>
          <p className="text-slate-400 mt-1">{state.unlockedCount} of {ACHIEVEMENTS.length} unlocked • {state.totalPoints} points</p>
        </div>
      </div>

      {/* MOBILE: Stats Cards - LP Glass Style */}
      <div className="sm:hidden grid grid-cols-3 gap-3">
        {[
          { label: 'Unlocked', value: state.unlockedCount, color: 'from-amber-500 to-orange-500' },
          { label: 'Points', value: state.totalPoints, color: 'from-amber-500 to-yellow-500' },
          { label: 'Streak', value: `${state.streak}d`, color: 'from-orange-500 to-amber-500' },
        ].map((stat, i) => (
          <div key={i} className="glass-premium rounded-2xl p-4 text-center border border-amber-500/20">
            <p className={`text-2xl font-black bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>{stat.value}</p>
            <p className="text-xs text-slate-500 font-medium">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Achievements Grid - Premium Redesign */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {ACHIEVEMENTS.map((achievement) => {
          const isUnlocked = state.unlockedAchievements[achievement.id]
          const Icon = achievement.icon

          // Tier colors
          const tierColors = {
            gold: { bg: 'from-amber-500 to-orange-500', text: 'text-amber-400', border: 'border-amber-500/30', badge: 'bg-amber-500/20' },
            silver: { bg: 'from-slate-400 to-slate-500', text: 'text-slate-300', border: 'border-slate-500/30', badge: 'bg-slate-500/20' },
            bronze: { bg: 'from-orange-600 to-amber-700', text: 'text-orange-400', border: 'border-orange-500/30', badge: 'bg-orange-500/20' },
          }
          const tierStyle = tierColors[achievement.tier as keyof typeof tierColors] || tierColors.bronze

          return (
            <div
              key={achievement.id}
              className={`relative overflow-hidden rounded-2xl border p-5 transition-all duration-300 ${
                isUnlocked
                  ? `glass-premium ${tierStyle.border} hover-lift`
                  : 'glass-premium border-slate-700/30 hover:border-slate-600/50'
              }`}
            >
              {/* Glow for unlocked */}
              {isUnlocked && (
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${tierStyle.bg} opacity-20 rounded-full blur-3xl`} />
              )}

              <div className="relative z-10">
                {/* Header with icon and lock status */}
                <div className="flex items-start gap-4 mb-3">
                  <div className={`relative w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                    isUnlocked
                      ? `bg-gradient-to-br ${tierStyle.bg} shadow-lg`
                      : 'bg-slate-800/80 border border-slate-700'
                  }`}>
                    <Icon className={`w-7 h-7 ${isUnlocked ? 'text-white' : 'text-slate-500'}`} />
                    {!isUnlocked && (
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-slate-700 border-2 border-slate-800 flex items-center justify-center">
                        <Lock className="w-2.5 h-2.5 text-slate-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-bold text-base leading-tight ${isUnlocked ? 'text-white' : 'text-slate-300'}`}>
                      {achievement.name}
                    </h3>
                    <p className={`text-xs mt-1 line-clamp-2 ${isUnlocked ? 'text-slate-400' : 'text-slate-500'}`}>
                      {achievement.description}
                    </p>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-white/10">
                  <span className={`text-xs font-bold uppercase px-2.5 py-1 rounded-full ${tierStyle.badge} ${tierStyle.text} border ${tierStyle.border}`}>
                    {achievement.tier}
                  </span>
                  <span className={`text-sm font-bold ${isUnlocked ? 'text-amber-400' : 'text-slate-500'}`}>
                    +{achievement.points} pts
                  </span>
                </div>

                {/* Unlocked checkmark */}
                {isUnlocked && (
                  <div className="absolute top-3 right-3">
                    <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Share Section - LP Premium Style */}
      {state.progressPercent >= 100 && (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-hero p-6 sm:p-8 text-center border border-amber-500/20 section-premium noise-overlay">
          {/* Floating Gradient Orbs */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-amber-500/20 to-yellow-500/10 rounded-full blur-3xl floating" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-br from-yellow-500/15 to-amber-500/5 rounded-full blur-3xl floating-slow" />

          <div className="relative z-10">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center shadow-glow-gold">
              <Award className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-black text-white mb-2">AI Video Master!</h3>
            <p className="text-slate-400 mb-6">Share your achievement</p>
            <button
              onClick={() => state.setShowCertificateModal(true)}
              className="btn-premium inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white shadow-glow-gold"
            >
              <Award className="w-5 h-5" /> Get Certificate
            </button>
          </div>
        </div>
      )}
    </div>
  )
})
