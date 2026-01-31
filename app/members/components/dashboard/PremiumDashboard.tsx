'use client'

import { memo, useState, useEffect, useMemo, useRef } from 'react'
import Image from 'next/image'
import {
  Play, Clock, Star, Flame, Trophy, Gift, ChevronRight,
  ArrowRight, Sparkles, MessageCircle, Award, Users, Globe,
  TrendingUp, Target, Zap, CheckCircle, Calendar, BarChart3,
  Heart, ThumbsUp, Quote, Bell, ExternalLink, BookOpen,
  Video, FileText, Lightbulb, Crown, Shield, Rocket
} from 'lucide-react'

// ============================================
// ANIMATED COUNTER
// ============================================

const AnimatedNumber = memo(function AnimatedNumber({
  value,
  duration = 1000,
  suffix = '',
  prefix = ''
}: {
  value: number
  duration?: number
  suffix?: string
  prefix?: string
}) {
  const [displayValue, setDisplayValue] = useState(0)
  const previousValue = useRef(0)

  useEffect(() => {
    const startValue = previousValue.current
    const endValue = value
    const startTime = performance.now()

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
      const current = Math.round(startValue + (endValue - startValue) * eased)
      setDisplayValue(current)

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        previousValue.current = endValue
      }
    }

    requestAnimationFrame(animate)
  }, [value, duration])

  return <span>{prefix}{displayValue.toLocaleString()}{suffix}</span>
})

// ============================================
// PROGRESS RING
// ============================================

const ProgressRing = memo(function ProgressRing({
  progress,
  size = 120,
  strokeWidth = 8,
  children
}: {
  progress: number
  size?: number
  strokeWidth?: number
  children?: React.ReactNode
}) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (Math.min(Math.max(progress, 0), 100) / 100) * circumference

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#goldGradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
        />
        <defs>
          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#eab308" />
          </linearGradient>
        </defs>
      </svg>
      {children && (
        <div className="absolute inset-0 flex items-center justify-center">
          {children}
        </div>
      )}
    </div>
  )
})

// ============================================
// STAT CARD
// ============================================

const StatCard = memo(function StatCard({
  icon: Icon,
  label,
  value,
  suffix = '',
  gradient,
  delay = 0
}: {
  icon: any
  label: string
  value: number | string
  suffix?: string
  gradient: string
  delay?: number
}) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay)
    return () => clearTimeout(timer)
  }, [delay])

  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-white/[0.03] border border-white/10 p-5 transition-all duration-500 hover:border-amber-500/30 hover:bg-white/[0.05] group ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <div className={`absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br ${gradient} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity`} />

      <div className="relative flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div>
          <p className="text-sm text-white/50 font-medium">{label}</p>
          <p className="text-2xl font-black text-white">
            {typeof value === 'number' ? (
              <AnimatedNumber value={value} suffix={suffix} duration={1200} />
            ) : (
              value
            )}
          </p>
        </div>
      </div>
    </div>
  )
})

// ============================================
// QUICK ACTION CARD
// ============================================

const QuickActionCard = memo(function QuickActionCard({
  icon: Icon,
  title,
  description,
  gradient,
  onClick
}: {
  icon: any
  title: string
  description: string
  gradient: string
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left relative overflow-hidden rounded-2xl bg-white/[0.03] border border-white/10 p-5 transition-all duration-300 hover:border-amber-500/30 hover:bg-white/[0.05] hover:scale-[1.02] group"
    >
      <div className={`absolute -top-6 -right-6 w-20 h-20 bg-gradient-to-br ${gradient} opacity-0 rounded-full blur-2xl group-hover:opacity-20 transition-opacity`} />

      <div className="relative flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-white group-hover:text-amber-400 transition-colors">{title}</p>
          <p className="text-sm text-white/50">{description}</p>
        </div>
        <ChevronRight className="w-5 h-5 text-white/30 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
      </div>
    </button>
  )
})

// ============================================
// VALUE REINFORCEMENT CARD
// ============================================

const ValueReinforcementCard = memo(function ValueReinforcementCard({
  totalValue,
  paidPrice
}: {
  totalValue: number
  paidPrice: number
}) {
  const savings = totalValue - paidPrice

  return (
    <div className="relative overflow-hidden rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-500/10 via-yellow-500/5 to-transparent p-6">
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-500/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-yellow-500/10 rounded-full blur-2xl" />

      <div className="relative">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center shadow-lg shadow-amber-500/25">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-amber-400 font-bold">Your Membership Value</p>
            <p className="text-white/50 text-sm">Everything included in your plan</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <p className="text-white/50 text-xs mb-1">Total Value</p>
            <p className="text-2xl font-black text-white">
              $<AnimatedNumber value={totalValue} duration={1500} />
            </p>
          </div>
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <p className="text-emerald-400/70 text-xs mb-1">You're Saving</p>
            <p className="text-2xl font-black text-emerald-400">
              $<AnimatedNumber value={savings} duration={1500} />
            </p>
          </div>
        </div>

        <p className="text-white/40 text-xs text-center">
          Access to all current and future updates included
        </p>
      </div>
    </div>
  )
})

// ============================================
// SOCIAL PROOF ROW
// ============================================

const SocialProofRow = memo(function SocialProofRow({
  memberCount,
  activeNow,
  rating,
  countries
}: {
  memberCount: number
  activeNow: number
  rating: number
  countries: number
}) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {[
        { icon: Users, value: memberCount, suffix: '+', label: 'Students', color: 'text-amber-400' },
        { icon: null, value: activeNow, label: 'Active Now', color: 'text-emerald-400', pulse: true },
        { icon: Star, value: rating, label: 'Rating', color: 'text-amber-400', decimals: 1 },
        { icon: Globe, value: countries, label: 'Countries', color: 'text-blue-400' },
      ].map((stat, i) => (
        <div key={i} className="flex items-center justify-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/10">
          {stat.pulse ? (
            <div className="relative">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <div className="absolute inset-0 w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
            </div>
          ) : stat.icon ? (
            <stat.icon className={`w-4 h-4 ${stat.color}`} />
          ) : null}
          <div className="flex items-center gap-1">
            <span className={`font-black ${stat.color}`}>
              {stat.decimals ? stat.value.toFixed(stat.decimals) : stat.value.toLocaleString()}{stat.suffix || ''}
            </span>
            <span className="text-white/40 text-xs">{stat.label}</span>
          </div>
        </div>
      ))}
    </div>
  )
})

// ============================================
// TESTIMONIAL CARD
// ============================================

const TestimonialCard = memo(function TestimonialCard({
  name,
  role,
  content,
  avatar,
  rating
}: {
  name: string
  role: string
  content: string
  avatar?: string
  rating: number
}) {
  return (
    <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center text-white font-bold">
          {name.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-white text-sm truncate">{name}</p>
          <p className="text-white/40 text-xs">{role}</p>
        </div>
        <div className="flex gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className={`w-3 h-3 ${i < rating ? 'text-amber-400 fill-amber-400' : 'text-white/20'}`} />
          ))}
        </div>
      </div>
      <p className="text-white/60 text-sm leading-relaxed line-clamp-3">{content}</p>
    </div>
  )
})

// ============================================
// UPDATE ITEM
// ============================================

const UpdateItem = memo(function UpdateItem({
  title,
  description,
  type,
  date
}: {
  title: string
  description: string
  type: 'new' | 'coming' | 'update'
  date: string
}) {
  const typeConfig = {
    new: { color: 'bg-emerald-500', label: 'New' },
    coming: { color: 'bg-amber-500', label: 'Soon' },
    update: { color: 'bg-blue-500', label: 'Update' }
  }

  const config = typeConfig[type]

  return (
    <div className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors">
      <div className={`px-2 py-0.5 rounded text-[10px] font-bold text-white ${config.color}`}>
        {config.label}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-white text-sm">{title}</p>
        <p className="text-white/40 text-xs mt-0.5">{description}</p>
      </div>
      <span className="text-white/30 text-xs">{date}</span>
    </div>
  )
})

// ============================================
// MAIN PREMIUM DASHBOARD
// ============================================

interface DashboardState {
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
  setShowCertificateModal: (show: boolean) => void
  config: any
}

export const PremiumDashboard = memo(function PremiumDashboard({
  state
}: {
  state: DashboardState
}) {
  const nextModuleProgress = state.nextIncompleteModule
    ? state.videoProgress[state.nextIncompleteModule.id]
    : null
  const resumeSeconds = nextModuleProgress?.seconds || 0

  // Calculate total value
  const totalBonusValue = state.config.bonuses.reduce((sum: number, b: any) => sum + (b.value || 0), 0)
  const totalValue = totalBonusValue + 997 // Course value

  // Sample testimonials (would come from config in real implementation)
  const testimonials = [
    { name: 'Sarah M.', role: 'Marketing Consultant', content: 'Created my first AI video in under 30 minutes. The quality is incredible!', rating: 5 },
    { name: 'David L.', role: 'Real Estate Agent', content: 'My engagement on social media increased 3x after using these techniques.', rating: 5 },
    { name: 'Jennifer K.', role: 'Coach', content: "Finally a course that actually delivers. The AI mentor is a game changer.", rating: 5 },
  ]

  // Sample updates
  const updates = [
    { title: 'New AI Image Tool', description: 'Generate unlimited professional photos', type: 'new' as const, date: 'Today' },
    { title: 'Script Templates Pack', description: '50+ ready-to-use video scripts', type: 'coming' as const, date: 'This week' },
    { title: 'Mobile Editing Guide', description: 'Updated for CapCut 2026', type: 'update' as const, date: '2 days ago' },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      {/* HERO: Welcome & Progress */}
      <div className="relative overflow-hidden rounded-3xl border border-amber-500/20 bg-gradient-to-br from-amber-500/10 via-black to-amber-500/5">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-amber-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-yellow-500/10 rounded-full blur-3xl" />

        <div className="relative p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Progress Ring */}
            <div className="flex-shrink-0">
              <ProgressRing progress={state.progressPercent} size={140} strokeWidth={10}>
                <div className="text-center">
                  <p className="text-3xl font-black text-white">
                    <AnimatedNumber value={Math.round(state.progressPercent)} suffix="%" />
                  </p>
                  <p className="text-xs text-white/50">Complete</p>
                </div>
              </ProgressRing>
            </div>

            {/* Welcome Text */}
            <div className="flex-1 text-center sm:text-left">
              <p className="text-amber-400 text-sm font-bold uppercase tracking-wider mb-1">Welcome back</p>
              <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">
                {state.studentName || 'Student'}
              </h1>
              <p className="text-white/60 mb-4">
                {state.progressPercent >= 100
                  ? "Congratulations! You've completed the course."
                  : state.progressPercent > 0
                  ? "You're building momentum. Keep going."
                  : "Your AI journey starts now."
                }
              </p>

              {/* Progress bar */}
              <div className="max-w-md mx-auto sm:mx-0">
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-white/50">{state.completedCount} of {state.totalModules} modules</span>
                  <span className="text-amber-400 font-bold">{state.timeRemaining} min left</span>
                </div>
                <div className="h-2.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full transition-all duration-1000"
                    style={{ width: `${state.progressPercent}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* QUICK STATS ROW */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          icon={Clock}
          label="Watch Time"
          value={state.totalWatchTimeMinutes}
          suffix="m"
          gradient="from-amber-500 to-yellow-500"
          delay={0}
        />
        <StatCard
          icon={Star}
          label="Points"
          value={state.totalPoints}
          gradient="from-amber-500 to-orange-500"
          delay={100}
        />
        <StatCard
          icon={Flame}
          label="Day Streak"
          value={state.streak}
          suffix="d"
          gradient="from-orange-500 to-red-500"
          delay={200}
        />
        <StatCard
          icon={Trophy}
          label="Badges"
          value={`${state.unlockedCount}/${state.config.achievements.length}`}
          gradient="from-emerald-500 to-amber-500"
          delay={300}
        />
      </div>

      {/* CONTINUE LEARNING - PRIMARY CTA */}
      {state.progressPercent < 100 ? (
        <div className="relative overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 to-transparent p-6">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-500/20 rounded-full blur-3xl" />

          <div className="relative">
            <h2 className="text-lg font-bold text-white mb-4">Continue Learning</h2>

            <button
              onClick={() => {
                state.setCurrentModuleIndex(state.nextIncompleteModuleIndex)
                state.setActiveSection('course')
              }}
              className="w-full flex items-center gap-5 p-5 rounded-xl bg-white/5 border border-white/10 hover:border-amber-500/30 hover:bg-amber-500/5 transition-all group"
            >
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center shadow-lg shadow-amber-500/25 group-hover:scale-110 transition-transform">
                <Play className="w-8 h-8 text-white" fill="white" />
              </div>
              <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-amber-400 text-sm font-bold">
                    Module {state.nextIncompleteModule?.number}
                  </span>
                  {resumeSeconds > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-xs border border-amber-500/30">
                      Resume {Math.floor(resumeSeconds / 60)}:{String(Math.floor(resumeSeconds % 60)).padStart(2, '0')}
                    </span>
                  )}
                </div>
                <p className="font-bold text-white text-lg truncate group-hover:text-amber-400 transition-colors">
                  {state.nextIncompleteModule?.title}
                </p>
                <div className="flex items-center gap-2 text-white/50 text-sm mt-1">
                  <Clock className="w-4 h-4" />
                  {state.nextIncompleteModule?.duration}
                </div>
              </div>
              <ArrowRight className="w-6 h-6 text-amber-400 group-hover:translate-x-2 transition-transform" />
            </button>

            <p className="text-white/40 text-sm text-center mt-4">
              {state.progressPercent > 0
                ? "Pick up right where you left off"
                : "Start your first lesson. It only takes a few minutes."
              }
            </p>
          </div>
        </div>
      ) : (
        <div className="relative overflow-hidden rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-500/10 to-transparent p-8 text-center">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/20 rounded-full blur-3xl" />

          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-amber-500 flex items-center justify-center shadow-lg mx-auto mb-4">
              <Trophy className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-black text-white mb-2">Course Complete!</h2>
            <p className="text-white/60 mb-6">Congratulations on completing all modules!</p>
            <button
              onClick={() => state.setShowCertificateModal(true)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-bold shadow-lg shadow-amber-500/25 hover:scale-105 transition-transform"
            >
              <Award className="w-5 h-5" />
              Get Your Certificate
            </button>
          </div>
        </div>
      )}

      {/* QUICK ACTIONS GRID */}
      <div className="grid sm:grid-cols-3 gap-4">
        <QuickActionCard
          icon={Gift}
          title="View Bonuses"
          description={`${state.config.bonuses.length} premium resources`}
          gradient="from-yellow-500 to-orange-500"
          onClick={() => state.setActiveSection('bonuses')}
        />
        <QuickActionCard
          icon={Trophy}
          title="Achievements"
          description={`${state.unlockedCount} badges unlocked`}
          gradient="from-amber-500 to-orange-500"
          onClick={() => state.setActiveSection('achievements')}
        />
        <QuickActionCard
          icon={MessageCircle}
          title="Get Support"
          description="We're here to help"
          gradient="from-emerald-500 to-teal-500"
          onClick={() => window.location.href = `mailto:${state.config.supportEmail}`}
        />
      </div>

      {/* VALUE & SOCIAL PROOF */}
      <div className="grid lg:grid-cols-2 gap-6">
        <ValueReinforcementCard
          totalValue={totalValue}
          paidPrice={47}
        />

        <div className="space-y-4">
          <SocialProofRow
            memberCount={state.config.memberStats?.totalMembers || 1247}
            activeNow={state.config.memberStats?.activeNow || 42}
            rating={4.9}
            countries={23}
          />

          <p className="text-white/30 text-xs text-center">
            Join thousands of professionals creating AI videos
          </p>
        </div>
      </div>

      {/* ACTIVITY & UPDATES */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Member Success Stories */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-white">Member Success</h3>
              <p className="text-white/40 text-xs">What our students say</p>
            </div>
          </div>

          <div className="space-y-3">
            {testimonials.map((t, i) => (
              <TestimonialCard key={i} {...t} />
            ))}
          </div>

          <p className="text-white/30 text-[10px] text-center mt-4">
            *Individual results may vary. These are representative examples.
          </p>
        </div>

        {/* What's New */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-white">What's New</h3>
              <p className="text-white/40 text-xs">Latest updates & coming soon</p>
            </div>
          </div>

          <div className="space-y-2">
            {updates.map((u, i) => (
              <UpdateItem key={i} {...u} />
            ))}
          </div>

          <button className="w-full mt-4 py-2 text-center text-amber-400 text-sm font-medium hover:text-amber-300 transition-colors">
            View all updates
          </button>
        </div>
      </div>
    </div>
  )
})

export default PremiumDashboard
