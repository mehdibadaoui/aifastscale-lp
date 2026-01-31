'use client'

import { memo, useState, useEffect } from 'react'
import {
  TrendingUp, TrendingDown, Sparkles, ArrowRight, Check,
  DollarSign, PiggyBank, Target, BarChart3, X, ChevronRight
} from 'lucide-react'

// ============================================
// HELP CONTENT - Human-readable explanations
// ============================================

export const HELP_CONTENT = {
  netProfit: "Net profit = income minus expenses. This is what you actually keep after paying for everything.",
  totalIncome: "All the money coming into your business this month - from clients, sales, or any other source.",
  totalExpenses: "Everything you spent this month - software, ads, contractors, and other business costs.",
  profitMargin: "What percentage of your income you keep as profit. Higher is better. 20%+ is healthy for most businesses.",
  recurring: "Transactions that repeat every month - like subscriptions or retainer clients. Set them once, they auto-add.",
  budget: "Set spending limits for categories. We'll warn you when you're getting close to exceeding them.",
  currency: "We convert everything to your main currency so you can see the real picture. Exchange rates update daily.",
  insights: "Smart observations about your finances based on your data. These help you spot trends and make better decisions.",
  categories: "Group your income and expenses into types. This helps you see where money comes from and where it goes.",
  notes: "Your private financial journal. Reflect on what went well, what didn't, and what to change. No one else sees this."
}

// ============================================
// ONBOARDING STATE HOOK
// ============================================

export interface OnboardingState {
  isComplete: boolean
  currentStep: number
  hasAddedIncome: boolean
  hasAddedExpense: boolean
  hasSeenDashboard: boolean
  showTour: boolean
  tourStep: number
}

const ONBOARDING_KEY = 'profit_tracker_onboarding_v1'

export function useOnboarding() {
  const [state, setState] = useState<OnboardingState>({
    isComplete: false,
    currentStep: 0,
    hasAddedIncome: false,
    hasAddedExpense: false,
    hasSeenDashboard: false,
    showTour: false,
    tourStep: 0
  })

  useEffect(() => {
    const saved = localStorage.getItem(ONBOARDING_KEY)
    if (saved) {
      try {
        setState(JSON.parse(saved))
      } catch {
        // Invalid data, use defaults
      }
    }
  }, [])

  const updateState = (updates: Partial<OnboardingState>) => {
    setState(prev => {
      const next = { ...prev, ...updates }
      localStorage.setItem(ONBOARDING_KEY, JSON.stringify(next))
      return next
    })
  }

  const completeStep = (step: 'income' | 'expense' | 'dashboard') => {
    const updates: Partial<OnboardingState> = {}

    if (step === 'income') updates.hasAddedIncome = true
    if (step === 'expense') updates.hasAddedExpense = true
    if (step === 'dashboard') updates.hasSeenDashboard = true

    // Check if all steps complete
    const newState = { ...state, ...updates }
    if (newState.hasAddedIncome && newState.hasAddedExpense && newState.hasSeenDashboard) {
      updates.isComplete = true
    }

    updateState(updates)
  }

  const startTour = () => updateState({ showTour: true, tourStep: 0 })
  const nextTourStep = () => updateState({ tourStep: state.tourStep + 1 })
  const skipTour = () => updateState({ showTour: false, isComplete: true })
  const completeTour = () => updateState({ showTour: false, isComplete: true })

  const reset = () => {
    localStorage.removeItem(ONBOARDING_KEY)
    setState({
      isComplete: false,
      currentStep: 0,
      hasAddedIncome: false,
      hasAddedExpense: false,
      hasSeenDashboard: false,
      showTour: false,
      tourStep: 0
    })
  }

  return {
    state,
    completeStep,
    startTour,
    nextTourStep,
    skipTour,
    completeTour,
    reset
  }
}

// ============================================
// ONBOARDING WELCOME SCREEN
// ============================================

interface WelcomeScreenProps {
  onStart: () => void
  onSkip: () => void
}

export const OnboardingWelcome = memo(function OnboardingWelcome({
  onStart,
  onSkip
}: WelcomeScreenProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-amber-500/20">
      {/* Premium gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-900/30 via-amber-900/10 to-black" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-500/20 via-transparent to-transparent" />

      {/* Animated glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl" />

      <div className="relative p-8 sm:p-12 lg:p-16">
        <div className="max-w-2xl mx-auto text-center">
          {/* Icon */}
          <div className="mb-8">
            <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center shadow-2xl shadow-amber-500/30 animate-float">
              <PiggyBank className="w-12 h-12 text-white" />
            </div>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-4 tracking-tight">
            Your Money,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-300">
              Crystal Clear
            </span>
          </h1>

          <p className="text-xl text-white/60 mb-10 max-w-lg mx-auto leading-relaxed">
            Finally understand your business finances. Track income, expenses, and see your real profit in seconds.
          </p>

          {/* 3-Step Preview */}
          <div className="grid sm:grid-cols-3 gap-4 mb-10">
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-6 h-6 text-emerald-400" />
              </div>
              <p className="text-white font-semibold mb-1">Step 1</p>
              <p className="text-white/50 text-sm">Add your income</p>
            </div>

            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="w-12 h-12 rounded-xl bg-rose-500/20 flex items-center justify-center mx-auto mb-3">
                <TrendingDown className="w-6 h-6 text-rose-400" />
              </div>
              <p className="text-white font-semibold mb-1">Step 2</p>
              <p className="text-white/50 text-sm">Add your expenses</p>
            </div>

            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center mx-auto mb-3">
                <Sparkles className="w-6 h-6 text-amber-400" />
              </div>
              <p className="text-white font-semibold mb-1">Step 3</p>
              <p className="text-white/50 text-sm">See your real profit</p>
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={onStart}
            className="group inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-bold text-lg shadow-2xl shadow-amber-500/30 hover:shadow-amber-500/50 hover:scale-105 transition-all"
          >
            Start with your first income
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={onSkip}
            className="block mx-auto mt-4 text-white/40 hover:text-white/60 text-sm transition-colors"
          >
            I know what I'm doing, skip intro
          </button>
        </div>
      </div>
    </div>
  )
})

// ============================================
// PROGRESS CHECKLIST
// ============================================

interface ProgressChecklistProps {
  hasAddedIncome: boolean
  hasAddedExpense: boolean
  hasSeenProfit: boolean
  onAddIncome: () => void
  onAddExpense: () => void
}

export const ProgressChecklist = memo(function ProgressChecklist({
  hasAddedIncome,
  hasAddedExpense,
  hasSeenProfit,
  onAddIncome,
  onAddExpense
}: ProgressChecklistProps) {
  const steps = [
    {
      id: 'income',
      label: 'Add your first income',
      description: 'Where does your money come from?',
      icon: TrendingUp,
      complete: hasAddedIncome,
      action: onAddIncome,
      color: 'emerald'
    },
    {
      id: 'expense',
      label: 'Add your first expense',
      description: 'What are you spending on?',
      icon: TrendingDown,
      complete: hasAddedExpense,
      action: onAddExpense,
      color: 'rose'
    },
    {
      id: 'profit',
      label: 'See your real profit',
      description: 'The number that actually matters',
      icon: Sparkles,
      complete: hasSeenProfit,
      action: () => {},
      color: 'amber'
    }
  ]

  const completedCount = steps.filter(s => s.complete).length
  const progress = (completedCount / steps.length) * 100

  return (
    <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-white font-bold text-lg">Getting Started</h3>
          <p className="text-white/40 text-sm">{completedCount} of {steps.length} complete</p>
        </div>
        <div className="w-16 h-16 relative">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="32"
              cy="32"
              r="28"
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="4"
            />
            <circle
              cx="32"
              cy="32"
              r="28"
              fill="none"
              stroke="rgb(245 158 11)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={175.9}
              strokeDashoffset={175.9 - (progress / 100) * 175.9}
              className="transition-all duration-500"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-amber-400 font-bold">{Math.round(progress)}%</span>
          </div>
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-3">
        {steps.map((step, index) => {
          const Icon = step.icon
          const isNext = !step.complete && steps.slice(0, index).every(s => s.complete)

          return (
            <button
              key={step.id}
              onClick={step.complete ? undefined : step.action}
              disabled={step.complete || step.id === 'profit'}
              className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all text-left ${
                step.complete
                  ? 'bg-white/5 opacity-60'
                  : isNext
                  ? `bg-${step.color}-500/10 border border-${step.color}-500/30 hover:border-${step.color}-500/50`
                  : 'bg-white/[0.02] opacity-50'
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                step.complete
                  ? 'bg-emerald-500'
                  : `bg-${step.color}-500/20`
              }`}>
                {step.complete ? (
                  <Check className="w-5 h-5 text-white" />
                ) : (
                  <Icon className={`w-5 h-5 text-${step.color}-400`} />
                )}
              </div>
              <div className="flex-1">
                <p className={`font-semibold ${step.complete ? 'text-white/50 line-through' : 'text-white'}`}>
                  {step.label}
                </p>
                <p className="text-white/40 text-sm">{step.description}</p>
              </div>
              {isNext && step.id !== 'profit' && (
                <ChevronRight className={`w-5 h-5 text-${step.color}-400`} />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
})

// ============================================
// PRODUCT TOUR
// ============================================

interface TourStep {
  target: string
  title: string
  content: string
  position: 'top' | 'bottom' | 'left' | 'right'
}

const TOUR_STEPS: TourStep[] = [
  {
    target: 'net-profit',
    title: 'Your Net Profit',
    content: 'This is the most important number - what you actually keep after all expenses. We update it in real-time.',
    position: 'bottom'
  },
  {
    target: 'quick-actions',
    title: 'Quick Add',
    content: 'Add income and expenses in seconds. The simpler, the better - you can always add details later.',
    position: 'top'
  },
  {
    target: 'navigation',
    title: 'Explore More',
    content: 'Check your trends, set budgets, and reflect on your finances. Everything you need, nothing you don\'t.',
    position: 'bottom'
  }
]

interface ProductTourProps {
  currentStep: number
  onNext: () => void
  onSkip: () => void
  onComplete: () => void
}

export const ProductTour = memo(function ProductTour({
  currentStep,
  onNext,
  onSkip,
  onComplete
}: ProductTourProps) {
  const step = TOUR_STEPS[currentStep]
  const isLast = currentStep === TOUR_STEPS.length - 1

  if (!step) return null

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/60 z-40" onClick={onSkip} />

      {/* Tooltip */}
      <div className="fixed z-50 w-80 animate-fade-in" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
        <div className="bg-zinc-900 border border-amber-500/30 rounded-2xl shadow-2xl shadow-amber-500/20 overflow-hidden">
          {/* Progress */}
          <div className="h-1 bg-white/10">
            <div
              className="h-full bg-amber-500 transition-all duration-300"
              style={{ width: `${((currentStep + 1) / TOUR_STEPS.length) * 100}%` }}
            />
          </div>

          <div className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-amber-400" />
              </div>
              <span className="text-amber-400 text-sm font-medium">
                Tip {currentStep + 1} of {TOUR_STEPS.length}
              </span>
            </div>

            <h3 className="text-white font-bold text-xl mb-2">{step.title}</h3>
            <p className="text-white/60 leading-relaxed mb-6">{step.content}</p>

            <div className="flex items-center justify-between">
              <button
                onClick={onSkip}
                className="text-white/40 hover:text-white/60 text-sm transition-colors"
              >
                Skip tour
              </button>
              <button
                onClick={isLast ? onComplete : onNext}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 text-black font-semibold hover:bg-amber-400 transition-all"
              >
                {isLast ? 'Got it!' : 'Next'}
                {!isLast && <ArrowRight className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
})

// ============================================
// EMPTY STATE COMPONENT
// ============================================

interface EmptyStateProps {
  icon: typeof TrendingUp
  title: string
  description: string
  example?: string
  actionLabel: string
  onAction: () => void
  color?: 'emerald' | 'rose' | 'amber' | 'violet'
}

export const EmptyState = memo(function EmptyState({
  icon: Icon,
  title,
  description,
  example,
  actionLabel,
  onAction,
  color = 'amber'
}: EmptyStateProps) {
  const colorClasses = {
    emerald: {
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
      icon: 'text-emerald-400',
      button: 'from-emerald-500 to-green-500 shadow-emerald-500/25 hover:shadow-emerald-500/40'
    },
    rose: {
      bg: 'bg-rose-500/10',
      border: 'border-rose-500/20',
      icon: 'text-rose-400',
      button: 'from-rose-500 to-red-500 shadow-rose-500/25 hover:shadow-rose-500/40'
    },
    amber: {
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
      icon: 'text-amber-400',
      button: 'from-amber-500 to-yellow-500 shadow-amber-500/25 hover:shadow-amber-500/40'
    },
    violet: {
      bg: 'bg-violet-500/10',
      border: 'border-violet-500/20',
      icon: 'text-violet-400',
      button: 'from-violet-500 to-purple-500 shadow-violet-500/25 hover:shadow-violet-500/40'
    }
  }

  const classes = colorClasses[color]

  return (
    <div className="text-center py-16 px-6">
      <div className={`w-20 h-20 rounded-2xl ${classes.bg} border ${classes.border} flex items-center justify-center mx-auto mb-6`}>
        <Icon className={`w-10 h-10 ${classes.icon} opacity-60`} />
      </div>

      <h3 className="text-white font-bold text-xl mb-2">{title}</h3>
      <p className="text-white/50 max-w-sm mx-auto mb-4">{description}</p>

      {example && (
        <div className="inline-block px-4 py-2 rounded-lg bg-white/5 border border-white/10 mb-6">
          <p className="text-white/40 text-sm italic">"{example}"</p>
        </div>
      )}

      <button
        onClick={onAction}
        className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r ${classes.button} text-white font-bold shadow-lg hover:scale-105 transition-all`}
      >
        {actionLabel}
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  )
})

// ============================================
// ACHIEVEMENT TOAST
// ============================================

interface AchievementToastProps {
  title: string
  description: string
  xp?: number
  onClose: () => void
}

export const AchievementToast = memo(function AchievementToast({
  title,
  description,
  xp = 10,
  onClose
}: AchievementToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className="fixed top-6 right-6 z-50 animate-slide-down">
      <div className="bg-gradient-to-r from-amber-500 to-yellow-500 p-[1px] rounded-2xl shadow-2xl shadow-amber-500/30">
        <div className="bg-zinc-900 rounded-2xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-amber-400" />
          </div>
          <div className="flex-1">
            <p className="text-amber-400 font-bold">{title}</p>
            <p className="text-white/60 text-sm">{description}</p>
          </div>
          <div className="px-3 py-1 rounded-full bg-amber-500/20">
            <span className="text-amber-400 font-bold text-sm">+{xp} XP</span>
          </div>
        </div>
      </div>
    </div>
  )
})
