'use client'

import { memo, useState, useRef, useEffect } from 'react'
import {
  LayoutDashboard, TrendingUp, TrendingDown, PiggyBank, FileText,
  Plus, ChevronLeft, ChevronRight, Settings, Download, X, Check,
  Trash2, Edit3, Calendar, Sparkles, ArrowUp, ArrowDown,
  Globe, Coins, Undo2, Search, RefreshCw, Target,
  AlertTriangle, Shield, Upload, Wallet, BarChart3, CircleDollarSign,
  ChevronDown, Copy, Users, ShoppingBag, Briefcase, Laptop,
  MessageSquare, Link, Play, MoreHorizontal, Monitor, Megaphone,
  CreditCard, Cpu, GraduationCap, Building, Plane, Scale, Receipt,
  CheckCircle2, Lightbulb, ArrowRight, Zap, HelpCircle
} from 'lucide-react'
import { useProfitTracker } from './useProfitTracker'
import {
  TrackerView, IncomeEntry, ExpenseEntry, CURRENCIES, getCurrency,
  getMonthName, getShortMonthName,
  INCOME_CATEGORIES, EXPENSE_CATEGORIES, IncomeCategoryId, ExpenseCategoryId,
  getIncomeCategory, getExpenseCategory
} from './types'
import { LANGUAGES } from './i18n'
import { AnimatedCurrency, HelpIcon, Tooltip, ConfettiBurst, Toast } from './animations'
import {
  useOnboarding, OnboardingWelcome, ProgressChecklist, AchievementToast,
  HELP_CONTENT
} from './onboarding'

// ============================================
// ICON MAP FOR CATEGORIES
// ============================================

const ICON_MAP: Record<string, typeof Users> = {
  Users, ShoppingBag, Briefcase, Laptop, MessageSquare, Link, Play,
  TrendingUp, MoreHorizontal, Monitor, Megaphone, CreditCard, Cpu,
  GraduationCap, Building, Plane, Target, Scale, Receipt
}

function getCategoryIcon(iconName: string) {
  return ICON_MAP[iconName] || MoreHorizontal
}

// ============================================
// SUCCESS TOAST COMPONENT
// ============================================

const SuccessToast = memo(function SuccessToast({
  message,
  onClose
}: {
  message: string
  onClose: () => void
}) {
  useEffect(() => {
    const timer = setTimeout(onClose, 2500)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className="fixed top-6 right-6 z-50 animate-slide-down">
      <div className="bg-emerald-500 text-white px-5 py-3 rounded-xl shadow-lg shadow-emerald-500/30 flex items-center gap-3">
        <CheckCircle2 className="w-5 h-5" />
        <span className="font-semibold">{message}</span>
      </div>
    </div>
  )
})


// ============================================
// LUXURY PROFIT TRACKER
// ============================================

export const ProfitTracker = memo(function ProfitTracker() {
  const state = useProfitTracker()
  const onboarding = useOnboarding()
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [achievement, setAchievement] = useState<{ title: string; description: string; xp: number } | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)

  // Track onboarding progress
  const hasAnyData = state.data.income.length > 0 || state.data.expenses.length > 0
  const hasIncome = state.data.income.length > 0
  const hasExpense = state.data.expenses.length > 0

  // Wrap add functions to show success toast and track onboarding
  const handleAddIncome = (data: Parameters<typeof state.addIncome>[0]) => {
    state.addIncome(data)
    setSuccessMessage('Income added successfully!')

    // Track first income achievement
    if (!onboarding.state.hasAddedIncome) {
      onboarding.completeStep('income')
      setAchievement({
        title: 'First Income Logged!',
        description: "You're tracking your earnings now",
        xp: 25
      })
    }
  }

  const handleAddExpense = (data: Parameters<typeof state.addExpense>[0]) => {
    state.addExpense(data)
    setSuccessMessage('Expense added successfully!')

    // Track first expense achievement
    if (!onboarding.state.hasAddedExpense) {
      onboarding.completeStep('expense')
      setAchievement({
        title: 'First Expense Tracked!',
        description: "Now you see where money goes",
        xp: 25
      })
    }

    // Check if onboarding is complete (both income and expense added)
    if (onboarding.state.hasAddedIncome && !onboarding.state.isComplete) {
      setTimeout(() => {
        setShowConfetti(true)
        setAchievement({
          title: 'Setup Complete!',
          description: "You're ready to track your profits",
          xp: 50
        })
        onboarding.completeStep('dashboard')
        setTimeout(() => setShowConfetti(false), 3000)
      }, 500)
    }
  }

  // Handle onboarding start
  const handleStartOnboarding = () => {
    state.setShowAddModal('income')
  }

  if (state.isLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="relative">
          <div className="w-16 h-16 border-2 border-amber-500/20 rounded-full" />
          <div className="absolute inset-0 w-16 h-16 border-2 border-transparent border-t-amber-500 rounded-full animate-spin" />
          <div className="absolute inset-2 w-12 h-12 border-2 border-transparent border-t-amber-400/50 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
        </div>
      </div>
    )
  }

  // Show onboarding welcome for brand new users
  const showWelcome = !hasAnyData && !onboarding.state.isComplete && state.activeView === 'dashboard'

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Confetti Effect */}
      <ConfettiBurst active={showConfetti} />

      {/* Achievement Toast */}
      {achievement && (
        <AchievementToast
          title={achievement.title}
          description={achievement.description}
          xp={achievement.xp}
          onClose={() => setAchievement(null)}
        />
      )}

      {/* Success Toast */}
      {successMessage && !achievement && (
        <SuccessToast message={successMessage} onClose={() => setSuccessMessage(null)} />
      )}

      {/* Backup Reminder */}
      {state.showBackupReminder && <BackupReminder state={state} />}

      {/* Budget Alerts */}
      {state.budgetAlerts.length > 0 && <BudgetAlerts state={state} />}

      {/* Show welcome onboarding for brand new users */}
      {showWelcome ? (
        <OnboardingWelcome
          onStart={handleStartOnboarding}
          onSkip={() => onboarding.skipTour()}
        />
      ) : (
        <>
          {/* Premium Header */}
          <TrackerHeader state={state} />

          {/* Luxury Navigation */}
          <TrackerNav state={state} />

          {/* Progress Checklist for users still onboarding */}
          {!onboarding.state.isComplete && state.activeView === 'dashboard' && (
            <ProgressChecklist
              hasAddedIncome={hasIncome}
              hasAddedExpense={hasExpense}
              hasSeenProfit={hasIncome && hasExpense}
              onAddIncome={() => state.setShowAddModal('income')}
              onAddExpense={() => state.setShowAddModal('expense')}
            />
          )}

          {/* Content */}
          <div className="space-y-8">
            {state.activeView === 'dashboard' && <DashboardView state={state} onboarding={onboarding} />}
            {state.activeView === 'income' && <IncomeView state={state} onSuccess={setSuccessMessage} />}
            {state.activeView === 'expenses' && <ExpensesView state={state} onSuccess={setSuccessMessage} />}
            {state.activeView === 'summary' && <SummaryView state={state} />}
            {state.activeView === 'notes' && <NotesView state={state} />}
          </div>
        </>
      )}

      {/* Modals */}
      {state.showAddModal && (
        <AddEntryModal
          state={state}
          onAddIncome={handleAddIncome}
          onAddExpense={handleAddExpense}
        />
      )}
      {state.editingEntry && <EditEntryModal state={state} onSuccess={setSuccessMessage} />}
      {state.showSettings && <SettingsModal state={state} />}
      {state.showRecurringModal && <RecurringModal state={state} onSuccess={setSuccessMessage} />}
      {state.showBudgetModal && <BudgetModal state={state} onSuccess={setSuccessMessage} />}

      {/* Undo Toast */}
      {state.undoEntry && <UndoToast state={state} />}
    </div>
  )
})

// ============================================
// BACKUP REMINDER
// ============================================

const BackupReminder = memo(function BackupReminder({ state }: { state: ReturnType<typeof useProfitTracker> }) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500/10 via-yellow-500/5 to-amber-500/10 border border-amber-500/20 p-5 backdrop-blur-sm">
      <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-transparent" />
      <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center shadow-lg shadow-amber-500/25">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-white font-semibold text-lg">Protect Your Data</p>
            <p className="text-amber-200/70 text-sm">Export a backup to keep your records safe</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={state.exportBackup}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-bold hover:from-amber-400 hover:to-yellow-400 transition-all shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-105 active:scale-95"
            aria-label="Export backup now"
          >
            Backup Now
          </button>
          <button
            onClick={state.dismissBackupReminder}
            className="p-2.5 rounded-xl hover:bg-white/10 transition-all"
            aria-label="Dismiss reminder"
          >
            <X className="w-5 h-5 text-amber-200/50" />
          </button>
        </div>
      </div>
    </div>
  )
})

// ============================================
// BUDGET ALERTS
// ============================================

const BudgetAlerts = memo(function BudgetAlerts({ state }: { state: ReturnType<typeof useProfitTracker> }) {
  const { budgetAlerts, formatAmount } = state

  return (
    <div className="space-y-3">
      {budgetAlerts.map((alert, i) => {
        const isOver = alert.percent >= 100
        return (
          <div
            key={i}
            className={`relative overflow-hidden rounded-xl p-4 flex items-center gap-4 backdrop-blur-sm ${
              isOver
                ? 'bg-gradient-to-r from-red-500/15 to-red-500/5 border border-red-500/30'
                : 'bg-gradient-to-r from-amber-500/15 to-amber-500/5 border border-amber-500/30'
            }`}
            role="alert"
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              isOver ? 'bg-red-500/20' : 'bg-amber-500/20'
            }`}>
              <AlertTriangle className={`w-5 h-5 ${isOver ? 'text-red-400' : 'text-amber-400'}`} />
            </div>
            <div className="flex-1">
              <p className={`font-semibold ${isOver ? 'text-red-300' : 'text-amber-300'}`}>
                {alert.category} {isOver ? 'exceeded!' : 'approaching limit'}
              </p>
              <p className="text-white/60 text-sm">
                {formatAmount(alert.spent)} / {formatAmount(alert.limit)} ({Math.round(alert.percent)}%)
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
})

// ============================================
// HEADER
// ============================================

const TrackerHeader = memo(function TrackerHeader({ state }: { state: ReturnType<typeof useProfitTracker> }) {
  const { selectedMonth, availableMonths, setSelectedMonth, setShowSettings, setShowRecurringModal, setShowBudgetModal } = state

  const currentIndex = availableMonths.indexOf(selectedMonth)

  const goToPrevMonth = () => {
    if (currentIndex < availableMonths.length - 1) {
      setSelectedMonth(availableMonths[currentIndex + 1])
    }
  }

  const goToNextMonth = () => {
    if (currentIndex > 0) {
      setSelectedMonth(availableMonths[currentIndex - 1])
    }
  }

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      {/* Month Selector */}
      <div className="flex items-center gap-1">
        <button
          onClick={goToPrevMonth}
          disabled={currentIndex >= availableMonths.length - 1}
          className="p-3 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all border border-white/10 hover:border-amber-500/30"
          aria-label="Previous month"
        >
          <ChevronLeft className="w-5 h-5 text-white/70" />
        </button>
        <div className="min-w-[180px] text-center px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500/10 to-yellow-500/5 border border-amber-500/20">
          <span className="text-white font-bold text-xl tracking-tight">{getMonthName(selectedMonth)}</span>
        </div>
        <button
          onClick={goToNextMonth}
          disabled={currentIndex <= 0}
          className="p-3 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all border border-white/10 hover:border-amber-500/30"
          aria-label="Next month"
        >
          <ChevronRight className="w-5 h-5 text-white/70" />
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setShowRecurringModal(true)}
          className="group flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-violet-500/30 transition-all"
          aria-label="Manage recurring entries"
        >
          <RefreshCw className="w-4 h-4 text-violet-400" />
          <span className="text-white/70 text-sm font-medium hidden sm:inline">Recurring</span>
        </button>
        <button
          onClick={() => setShowBudgetModal(true)}
          className="group flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-emerald-500/30 transition-all"
          aria-label="Manage budget goals"
        >
          <Target className="w-4 h-4 text-emerald-400" />
          <span className="text-white/70 text-sm font-medium hidden sm:inline">Budget</span>
        </button>
        <button
          onClick={() => setShowSettings(true)}
          className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-amber-500/30 transition-all"
          aria-label="Open settings"
        >
          <Settings className="w-5 h-5 text-amber-400" />
        </button>
      </div>
    </div>
  )
})

// ============================================
// NAVIGATION - FIXED TAILWIND CLASSES
// ============================================

const TrackerNav = memo(function TrackerNav({ state }: { state: ReturnType<typeof useProfitTracker> }) {
  const { t, activeView, setActiveView } = state

  const navItems: { id: TrackerView; icon: typeof LayoutDashboard; label: string }[] = [
    { id: 'dashboard', icon: LayoutDashboard, label: t.nav.dashboard },
    { id: 'income', icon: TrendingUp, label: t.nav.income },
    { id: 'expenses', icon: TrendingDown, label: t.nav.expenses },
    { id: 'summary', icon: BarChart3, label: t.nav.summary },
    { id: 'notes', icon: FileText, label: t.nav.notes },
  ]

  const getActiveStyles = (id: TrackerView) => {
    if (activeView !== id) return 'text-white/50 hover:text-white/80 hover:bg-white/5'

    switch (id) {
      case 'dashboard':
        return 'bg-gradient-to-r from-amber-500/20 to-amber-500/10 text-white border border-amber-500/30 shadow-lg shadow-amber-500/10'
      case 'income':
        return 'bg-gradient-to-r from-emerald-500/20 to-emerald-500/10 text-white border border-emerald-500/30 shadow-lg shadow-emerald-500/10'
      case 'expenses':
        return 'bg-gradient-to-r from-rose-500/20 to-rose-500/10 text-white border border-rose-500/30 shadow-lg shadow-rose-500/10'
      case 'summary':
        return 'bg-gradient-to-r from-violet-500/20 to-violet-500/10 text-white border border-violet-500/30 shadow-lg shadow-violet-500/10'
      case 'notes':
        return 'bg-gradient-to-r from-sky-500/20 to-sky-500/10 text-white border border-sky-500/30 shadow-lg shadow-sky-500/10'
      default:
        return ''
    }
  }

  const getIconColor = (id: TrackerView) => {
    if (activeView !== id) return ''

    switch (id) {
      case 'dashboard': return 'text-amber-400'
      case 'income': return 'text-emerald-400'
      case 'expenses': return 'text-rose-400'
      case 'summary': return 'text-violet-400'
      case 'notes': return 'text-sky-400'
      default: return ''
    }
  }

  return (
    <div className="relative">
      <div className="flex gap-2 p-1.5 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-sm overflow-x-auto scrollbar-none" role="tablist">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id)}
            className={`relative flex-1 min-w-[80px] flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-300 ${getActiveStyles(item.id)}`}
            role="tab"
            aria-selected={activeView === item.id}
          >
            <item.icon className={`w-4 h-4 ${getIconColor(item.id)}`} />
            <span className="hidden sm:inline">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
})

// ============================================
// INTERACTIVE TREND CHART WITH TOOLTIPS
// ============================================

const TrendChart = memo(function TrendChart({ state }: { state: ReturnType<typeof useProfitTracker> }) {
  const { trendData, formatAmount } = state
  const [hoveredPoint, setHoveredPoint] = useState<{ index: number; type: 'income' | 'expense' } | null>(null)

  if (trendData.every(d => d.income === 0 && d.expenses === 0)) {
    return null
  }

  const maxValue = Math.max(...trendData.map(d => Math.max(d.income, d.expenses, Math.abs(d.profit))))
  const height = 160
  const width = 100
  const padding = { top: 20, right: 10, bottom: 30, left: 10 }

  const getY = (value: number) => {
    if (maxValue === 0) return height - padding.bottom
    return padding.top + ((1 - value / maxValue) * (height - padding.top - padding.bottom))
  }

  const getX = (index: number) => {
    return padding.left + (index / (trendData.length - 1)) * (width - padding.left - padding.right)
  }

  const createPath = (data: number[]) => {
    if (data.length < 2) return ''
    let path = `M ${getX(0)} ${getY(data[0])}`
    for (let i = 1; i < data.length; i++) {
      const x = getX(i)
      const y = getY(data[i])
      const prevX = getX(i - 1)
      const prevY = getY(data[i - 1])
      const cpX = (prevX + x) / 2
      path += ` C ${cpX} ${prevY}, ${cpX} ${y}, ${x} ${y}`
    }
    return path
  }

  const incomePath = createPath(trendData.map(d => d.income))
  const expensePath = createPath(trendData.map(d => d.expenses))

  const createAreaPath = (data: number[]) => {
    const linePath = createPath(data)
    return `${linePath} L ${getX(data.length - 1)} ${height - padding.bottom} L ${getX(0)} ${height - padding.bottom} Z`
  }

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/[0.05] to-transparent border border-white/10 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-white font-bold text-lg">6-Month Overview</h3>
          <p className="text-white/40 text-sm">Hover over points for details</p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-emerald-400 to-green-500 shadow-lg shadow-emerald-500/30" />
            <span className="text-xs text-white/50 font-medium">Income</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-rose-400 to-red-500 shadow-lg shadow-rose-500/30" />
            <span className="text-xs text-white/50 font-medium">Expenses</span>
          </div>
        </div>
      </div>

      <div className="relative">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-48" preserveAspectRatio="none">
          <defs>
            <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgb(16 185 129)" stopOpacity="0.3" />
              <stop offset="100%" stopColor="rgb(16 185 129)" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgb(244 63 94)" stopOpacity="0.2" />
              <stop offset="100%" stopColor="rgb(244 63 94)" stopOpacity="0" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Grid */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
            <line
              key={i}
              x1={padding.left}
              y1={padding.top + ratio * (height - padding.top - padding.bottom)}
              x2={width - padding.right}
              y2={padding.top + ratio * (height - padding.top - padding.bottom)}
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="0.5"
            />
          ))}

          {/* Areas */}
          <path d={createAreaPath(trendData.map(d => d.income))} fill="url(#incomeGradient)" />
          <path d={createAreaPath(trendData.map(d => d.expenses))} fill="url(#expenseGradient)" />

          {/* Lines */}
          <path d={incomePath} fill="none" stroke="rgb(16 185 129)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" filter="url(#glow)" />
          <path d={expensePath} fill="none" stroke="rgb(244 63 94)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" filter="url(#glow)" />

          {/* Interactive Points */}
          {trendData.map((d, i) => (
            <g key={i}>
              {/* Income point */}
              <circle
                cx={getX(i)}
                cy={getY(d.income)}
                r={hoveredPoint?.index === i && hoveredPoint?.type === 'income' ? 6 : 4}
                fill="rgb(16 185 129)"
                filter="url(#glow)"
                className="cursor-pointer transition-all"
                onMouseEnter={() => setHoveredPoint({ index: i, type: 'income' })}
                onMouseLeave={() => setHoveredPoint(null)}
              />
              {/* Expense point */}
              <circle
                cx={getX(i)}
                cy={getY(d.expenses)}
                r={hoveredPoint?.index === i && hoveredPoint?.type === 'expense' ? 6 : 4}
                fill="rgb(244 63 94)"
                filter="url(#glow)"
                className="cursor-pointer transition-all"
                onMouseEnter={() => setHoveredPoint({ index: i, type: 'expense' })}
                onMouseLeave={() => setHoveredPoint(null)}
              />
            </g>
          ))}
        </svg>

        {/* Tooltip */}
        {hoveredPoint && (
          <div
            className="absolute z-10 px-3 py-2 rounded-lg bg-zinc-900 border border-white/20 shadow-xl pointer-events-none"
            style={{
              left: `${(getX(hoveredPoint.index) / width) * 100}%`,
              top: `${(getY(hoveredPoint.type === 'income' ? trendData[hoveredPoint.index].income : trendData[hoveredPoint.index].expenses) / height) * 100}%`,
              transform: 'translate(-50%, -120%)'
            }}
          >
            <p className="text-xs text-white/60">{getShortMonthName(trendData[hoveredPoint.index].month)}</p>
            <p className={`font-bold ${hoveredPoint.type === 'income' ? 'text-emerald-400' : 'text-rose-400'}`}>
              {formatAmount(hoveredPoint.type === 'income' ? trendData[hoveredPoint.index].income : trendData[hoveredPoint.index].expenses)}
            </p>
          </div>
        )}

        {/* X-axis */}
        <div className="flex justify-between px-2 mt-2">
          {trendData.map((d, i) => (
            <span key={i} className="text-[11px] text-white/30 font-medium">{getShortMonthName(d.month)}</span>
          ))}
        </div>
      </div>
    </div>
  )
})

// ============================================
// CATEGORY BREAKDOWN WITH ICONS
// ============================================

const CategoryBreakdown = memo(function CategoryBreakdown({
  data,
  type,
  total,
  formatAmount
}: {
  data: Record<string, number>
  type: 'income' | 'expense'
  total: number
  formatAmount: (n: number, compact?: boolean) => string
}) {
  const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES
  const sortedCategories = Object.entries(data)
    .filter(([_, amount]) => amount > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  if (sortedCategories.length === 0) {
    return null
  }

  return (
    <div className={`relative overflow-hidden rounded-2xl border border-white/10 p-6 ${
      type === 'income'
        ? 'bg-gradient-to-br from-emerald-500/10 to-green-500/5'
        : 'bg-gradient-to-br from-rose-500/10 to-red-500/5'
    }`}>
      <div className="mb-5">
        <h3 className="text-white font-bold text-lg">
          {type === 'income' ? 'Top Income Sources' : 'Where Money Goes'}
        </h3>
        <p className="text-white/40 text-sm">By category this month</p>
      </div>
      <div className="space-y-4">
        {sortedCategories.map(([catId, amount]) => {
          const cat = categories.find(c => c.id === catId)
          const percent = total > 0 ? (amount / total) * 100 : 0
          const IconComponent = cat ? getCategoryIcon(cat.icon) : MoreHorizontal

          return (
            <div key={catId}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-md flex items-center justify-center ${
                    type === 'income' ? 'bg-emerald-500/20' : 'bg-rose-500/20'
                  }`}>
                    <IconComponent className={`w-3.5 h-3.5 ${type === 'income' ? 'text-emerald-400' : 'text-rose-400'}`} />
                  </div>
                  <span className="text-sm text-white/80 font-medium">{cat?.label || catId}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-white/40">{percent.toFixed(0)}%</span>
                  <span className="text-sm font-bold text-white">{formatAmount(amount, true)}</span>
                </div>
              </div>
              <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    type === 'income'
                      ? 'bg-gradient-to-r from-emerald-500 to-green-400'
                      : 'bg-gradient-to-r from-rose-500 to-red-400'
                  }`}
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
})

// ============================================
// DASHBOARD VIEW WITH ANIMATED NUMBERS
// ============================================

const DashboardView = memo(function DashboardView({
  state,
  onboarding
}: {
  state: ReturnType<typeof useProfitTracker>
  onboarding?: ReturnType<typeof useOnboarding>
}) {
  const { t, currentStats, dashboardMessage, formatAmount, setShowAddModal, currency } = state
  const { totalIncome, totalExpenses, netProfit, incomeChange, expenseChange, profitMargin, incomeByCategory, expensesByCategory } = currentStats

  const isProfitable = netProfit >= 0
  const hasData = totalIncome > 0 || totalExpenses > 0

  return (
    <div className="space-y-8">
      {/* Hero Profit Card with Animated Number */}
      <div className="relative overflow-hidden rounded-3xl">
        <div className={`absolute inset-0 ${isProfitable ? 'bg-gradient-to-br from-emerald-900/40 via-emerald-900/20 to-transparent' : 'bg-gradient-to-br from-rose-900/40 via-rose-900/20 to-transparent'}`} />
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent" />
        <div className={`absolute -top-20 -right-20 w-60 h-60 rounded-full blur-3xl ${isProfitable ? 'bg-emerald-500/20' : 'bg-rose-500/20'}`} />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full blur-2xl bg-amber-500/10" />

        <div className="relative border border-white/10 rounded-3xl p-8 sm:p-10">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
              <Wallet className="w-4 h-4 text-amber-400" />
              <span className="text-sm font-medium text-white/70">{t.dashboard.netProfit}</span>
              <HelpIcon content={HELP_CONTENT.netProfit} position="bottom" />
            </div>

            {/* Animated Net Profit Number */}
            <h2 className={`text-5xl sm:text-7xl font-black mb-4 tracking-tight ${isProfitable ? 'text-white' : 'text-rose-400'}`}>
              {hasData ? (
                <AnimatedCurrency
                  value={netProfit}
                  currency={currency}
                  duration={1200}
                  showSign={netProfit !== 0}
                />
              ) : (
                formatAmount(0)
              )}
            </h2>

            <p className="text-white/50 text-lg max-w-md mx-auto leading-relaxed">
              {dashboardMessage}
            </p>

            {profitMargin !== 0 && hasData && (
              <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5">
                <span className="text-white/50 text-sm">Profit Margin:</span>
                <span className={`font-bold ${profitMargin >= 20 ? 'text-emerald-400' : profitMargin >= 0 ? 'text-amber-400' : 'text-rose-400'}`}>
                  {profitMargin.toFixed(1)}%
                </span>
                <HelpIcon content={HELP_CONTENT.profitMargin} position="bottom" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats Grid with Animated Numbers */}
      <div className="grid grid-cols-2 gap-4 sm:gap-6">
        {/* Income Card */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent border border-emerald-500/20 p-5 sm:p-6">
          <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full blur-2xl bg-emerald-500/20" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-lg shadow-emerald-500/25">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <span className="text-white/60 text-sm font-medium flex-1">{t.dashboard.totalIncome}</span>
              <HelpIcon content={HELP_CONTENT.totalIncome} position="left" />
            </div>
            <p className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              <AnimatedCurrency value={totalIncome} currency={currency} duration={1000} />
            </p>
            {incomeChange !== 0 && (
              <div className={`mt-2 inline-flex items-center gap-1 text-sm ${incomeChange > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {incomeChange > 0 ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                <span className="font-semibold">{Math.abs(incomeChange).toFixed(0)}%</span>
                <span className="text-white/40">{t.dashboard.vsLastMonth}</span>
              </div>
            )}
          </div>
        </div>

        {/* Expenses Card */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-rose-500/10 via-rose-500/5 to-transparent border border-rose-500/20 p-5 sm:p-6">
          <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full blur-2xl bg-rose-500/20" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-red-600 flex items-center justify-center shadow-lg shadow-rose-500/25">
                <TrendingDown className="w-5 h-5 text-white" />
              </div>
              <span className="text-white/60 text-sm font-medium flex-1">{t.dashboard.totalExpenses}</span>
              <HelpIcon content={HELP_CONTENT.totalExpenses} position="left" />
            </div>
            <p className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              <AnimatedCurrency value={totalExpenses} currency={currency} duration={1000} />
            </p>
            {expenseChange !== 0 && (
              <div className={`mt-2 inline-flex items-center gap-1 text-sm ${expenseChange < 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                {expenseChange > 0 ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                <span className="font-semibold">{Math.abs(expenseChange).toFixed(0)}%</span>
                <span className="text-white/40">{t.dashboard.vsLastMonth}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Trend Chart */}
      <TrendChart state={state} />

      {/* Category Breakdowns */}
      {hasData && (
        <div className="grid sm:grid-cols-2 gap-6">
          <CategoryBreakdown data={incomeByCategory} type="income" total={totalIncome} formatAmount={formatAmount} />
          <CategoryBreakdown data={expensesByCategory} type="expense" total={totalExpenses} formatAmount={formatAmount} />
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => setShowAddModal('income')}
          className="group relative overflow-hidden flex items-center justify-center gap-3 p-5 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-green-500/5 border border-emerald-500/30 transition-all hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/10 active:scale-[0.98]"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/10 to-emerald-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
            <Plus className="w-5 h-5 text-emerald-400" />
          </div>
          <span className="text-emerald-400 font-bold text-lg">{t.income.add}</span>
        </button>

        <button
          onClick={() => setShowAddModal('expense')}
          className="group relative overflow-hidden flex items-center justify-center gap-3 p-5 rounded-2xl bg-gradient-to-br from-rose-500/10 to-red-500/5 border border-rose-500/30 transition-all hover:border-rose-500/50 hover:shadow-lg hover:shadow-rose-500/10 active:scale-[0.98]"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-rose-500/0 via-rose-500/10 to-rose-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
          <div className="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center">
            <Plus className="w-5 h-5 text-rose-400" />
          </div>
          <span className="text-rose-400 font-bold text-lg">{t.expenses.add}</span>
        </button>
      </div>
    </div>
  )
})

// ============================================
// INCOME VIEW WITH DUPLICATE
// ============================================

const IncomeView = memo(function IncomeView({
  state,
  onSuccess
}: {
  state: ReturnType<typeof useProfitTracker>
  onSuccess: (msg: string) => void
}) {
  const { t, filteredIncome, formatAmount, setShowAddModal, setEditingEntry, deleteIncome, searchQuery, setSearchQuery, currentStats, addIncome, currency } = state

  const entries = filteredIncome.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const handleDuplicate = (entry: IncomeEntry) => {
    addIncome({
      amount: entry.amount,
      currency: entry.currency,
      source: entry.source,
      category: entry.category,
      date: new Date().toISOString().split('T')[0]
    })
    onSuccess('Entry duplicated!')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">{t.income.title}</h2>
          <p className="text-white/40 text-sm">{t.income.subtitle}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <span className="text-emerald-400 font-bold text-lg">{formatAmount(currentStats.totalIncome)}</span>
          </div>
          <button
            onClick={() => setShowAddModal('income')}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 text-white font-bold shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-105 transition-all active:scale-95"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">{t.income.add}</span>
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search income entries..."
          className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-white/30 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all"
          aria-label="Search income entries"
        />
      </div>

      {/* Entries */}
      {entries.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-20 h-20 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-6">
            <CircleDollarSign className="w-10 h-10 text-emerald-400/50" />
          </div>
          <p className="text-white/50 text-lg mb-2">{searchQuery ? 'No matching entries' : t.income.empty}</p>
          <p className="text-white/30 text-sm">{t.income.emptyHint}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {entries.map(entry => (
            <EntryCard
              key={entry.id}
              entry={entry}
              type="income"
              formatAmount={formatAmount}
              onEdit={() => setEditingEntry(entry)}
              onDelete={() => deleteIncome(entry.id)}
              onDuplicate={() => handleDuplicate(entry)}
              t={t}
            />
          ))}
        </div>
      )}
    </div>
  )
})

// ============================================
// EXPENSES VIEW WITH DUPLICATE
// ============================================

const ExpensesView = memo(function ExpensesView({
  state,
  onSuccess
}: {
  state: ReturnType<typeof useProfitTracker>
  onSuccess: (msg: string) => void
}) {
  const { t, filteredExpenses, formatAmount, setShowAddModal, setEditingEntry, deleteExpense, searchQuery, setSearchQuery, currentStats, addExpense } = state

  const entries = filteredExpenses.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const handleDuplicate = (entry: ExpenseEntry) => {
    addExpense({
      amount: entry.amount,
      currency: entry.currency,
      reason: entry.reason,
      category: entry.category,
      date: new Date().toISOString().split('T')[0]
    })
    onSuccess('Entry duplicated!')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">{t.expenses.title}</h2>
          <p className="text-white/40 text-sm">{t.expenses.subtitle}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-rose-500/10 border border-rose-500/20">
            <span className="text-rose-400 font-bold text-lg">{formatAmount(currentStats.totalExpenses)}</span>
          </div>
          <button
            onClick={() => setShowAddModal('expense')}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-red-500 text-white font-bold shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40 hover:scale-105 transition-all active:scale-95"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">{t.expenses.add}</span>
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search expenses..."
          className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-white/30 focus:outline-none focus:border-rose-500/50 focus:ring-2 focus:ring-rose-500/20 transition-all"
          aria-label="Search expenses"
        />
      </div>

      {/* Entries */}
      {entries.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-20 h-20 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mx-auto mb-6">
            <TrendingDown className="w-10 h-10 text-rose-400/50" />
          </div>
          <p className="text-white/50 text-lg mb-2">{searchQuery ? 'No matching entries' : t.expenses.empty}</p>
          <p className="text-white/30 text-sm">{t.expenses.emptyHint}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {entries.map(entry => (
            <EntryCard
              key={entry.id}
              entry={entry}
              type="expense"
              formatAmount={formatAmount}
              onEdit={() => setEditingEntry(entry)}
              onDelete={() => deleteExpense(entry.id)}
              onDuplicate={() => handleDuplicate(entry)}
              t={t}
            />
          ))}
        </div>
      )}
    </div>
  )
})

// ============================================
// ENTRY CARD WITH DUPLICATE & ICONS
// ============================================

interface EntryCardProps {
  entry: IncomeEntry | ExpenseEntry
  type: 'income' | 'expense'
  formatAmount: (amount: number) => string
  onEdit: () => void
  onDelete: () => void
  onDuplicate: () => void
  t: ReturnType<typeof useProfitTracker>['t']
}

const EntryCard = memo(function EntryCard({ entry, type, formatAmount, onEdit, onDelete, onDuplicate, t }: EntryCardProps) {
  const [expanded, setExpanded] = useState(false)
  const description = type === 'income' ? (entry as IncomeEntry).source : (entry as ExpenseEntry).reason
  const isIncome = type === 'income'

  const category = isIncome
    ? getIncomeCategory((entry as IncomeEntry).category)
    : getExpenseCategory((entry as ExpenseEntry).category)

  const IconComponent = getCategoryIcon(category.icon)

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border p-4 sm:p-5 transition-all duration-300 cursor-pointer hover:shadow-lg ${
        isIncome
          ? 'bg-gradient-to-r from-emerald-500/10 to-green-500/5 border-emerald-500/20 hover:border-emerald-500/40'
          : 'bg-gradient-to-r from-rose-500/10 to-red-500/5 border-rose-500/20 hover:border-rose-500/40'
      }`}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
            isIncome ? 'bg-emerald-500/20' : 'bg-rose-500/20'
          }`}>
            <IconComponent className={`w-6 h-6 ${isIncome ? 'text-emerald-400' : 'text-rose-400'}`} />
          </div>
          <div>
            <p className="text-white font-semibold text-lg">{description || category.label}</p>
            <div className="flex items-center gap-3 mt-1">
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                isIncome ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
              }`}>
                {category.label}
              </span>
              <span className="text-white/40 text-xs flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {new Date(entry.date).toLocaleDateString()}
              </span>
              {entry.isRecurring && (
                <RefreshCw className="w-3 h-3 text-violet-400" />
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <p className={`text-xl sm:text-2xl font-black ${isIncome ? 'text-emerald-400' : 'text-rose-400'}`}>
            {isIncome ? '+' : '-'}{formatAmount(entry.amount)}
          </p>
          <ChevronDown className={`w-5 h-5 text-white/30 transition-transform ${expanded ? 'rotate-180' : ''}`} />
        </div>
      </div>

      {expanded && (
        <div className="flex gap-2 mt-5 pt-5 border-t border-white/10">
          <button
            onClick={(e) => { e.stopPropagation(); onEdit() }}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white font-medium transition-all"
            aria-label="Edit entry"
          >
            <Edit3 className="w-4 h-4" />
            {t.common.edit}
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDuplicate() }}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white font-medium transition-all"
            aria-label="Duplicate entry"
          >
            <Copy className="w-4 h-4" />
            Duplicate
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete() }}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-medium transition-all"
            aria-label="Delete entry"
          >
            <Trash2 className="w-4 h-4" />
            {t.common.delete}
          </button>
        </div>
      )}
    </div>
  )
})

// ============================================
// SUMMARY VIEW
// ============================================

const SummaryView = memo(function SummaryView({ state }: { state: ReturnType<typeof useProfitTracker> }) {
  const { t, currentStats, previousStats, formatAmount, insights, currency } = state
  const { totalIncome, totalExpenses, netProfit, profitMargin, profitChange } = currentStats

  const hasData = totalIncome > 0 || totalExpenses > 0
  const hasPrevData = previousStats.totalIncome > 0 || previousStats.totalExpenses > 0

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl sm:text-3xl font-black text-white">{t.summary.title}</h2>
        <p className="text-white/40 text-sm">{t.summary.subtitle}</p>
      </div>

      {!hasData ? (
        <div className="text-center py-20">
          <div className="w-20 h-20 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-6">
            <BarChart3 className="w-10 h-10 text-amber-400/50" />
          </div>
          <p className="text-white/50 text-lg">{t.summary.noData}</p>
        </div>
      ) : (
        <>
          {/* Main Card with Animated Number */}
          <div className={`relative overflow-hidden rounded-3xl p-8 border ${
            netProfit >= 0
              ? 'bg-gradient-to-br from-emerald-500/15 to-green-500/5 border-emerald-500/30'
              : 'bg-gradient-to-br from-rose-500/15 to-red-500/5 border-rose-500/30'
          }`}>
            <div className={`absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl ${
              netProfit >= 0 ? 'bg-emerald-500/20' : 'bg-rose-500/20'
            }`} />
            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <p className="text-white/60 text-sm font-medium">{t.summary.thisMonth}</p>
                <HelpIcon content={HELP_CONTENT.netProfit} position="right" />
              </div>
              <p className={`text-5xl sm:text-6xl font-black mb-3 ${netProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                <AnimatedCurrency value={netProfit} currency={currency} duration={1200} showSign={netProfit !== 0} />
              </p>
              <p className="text-white/50">{netProfit >= 0 ? t.summary.positive : t.summary.negative}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
              <div className="flex items-center gap-2 mb-2">
                <p className="text-white/50 text-sm">{t.summary.profitMargin}</p>
                <HelpIcon content={HELP_CONTENT.profitMargin} position="right" />
              </div>
              <p className={`text-3xl font-black ${profitMargin >= 20 ? 'text-emerald-400' : profitMargin >= 0 ? 'text-amber-400' : 'text-rose-400'}`}>
                {profitMargin.toFixed(1)}%
              </p>
              <div className="h-2 rounded-full bg-white/10 mt-3">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${profitMargin >= 20 ? 'bg-emerald-500' : profitMargin >= 0 ? 'bg-amber-500' : 'bg-rose-500'}`}
                  style={{ width: `${Math.min(Math.max(profitMargin, 0), 100)}%` }}
                />
              </div>
            </div>

            {hasPrevData && (
              <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
                <p className="text-white/50 text-sm mb-2">{t.summary.change}</p>
                <div className="flex items-center gap-2">
                  <p className={`text-3xl font-black ${profitChange >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {profitChange >= 0 ? '+' : ''}{profitChange.toFixed(0)}%
                  </p>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${profitChange >= 0 ? 'bg-emerald-500/20' : 'bg-rose-500/20'}`}>
                    {profitChange >= 0 ? <ArrowUp className="w-4 h-4 text-emerald-400" /> : <ArrowDown className="w-4 h-4 text-rose-400" />}
                  </div>
                </div>
              </div>
            )}

            <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
              <p className="text-white/50 text-sm mb-2">Transactions</p>
              <p className="text-3xl font-black text-white">
                {state.data.income.length + state.data.expenses.length}
              </p>
            </div>
          </div>

          <TrendChart state={state} />

          {/* Insights with Help Tooltip */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500/10 via-yellow-500/5 to-amber-500/10 border border-amber-500/20 p-6">
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl bg-amber-500/10" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center shadow-lg shadow-amber-500/25">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-white text-lg flex-1">{t.notes.insights}</h3>
                <HelpIcon content={HELP_CONTENT.insights} position="left" />
              </div>
              <div className="space-y-3">
                {insights.map((insight, i) => (
                  <p key={i} className="text-white/70 flex items-start gap-3">
                    <span className="text-amber-400 mt-1">•</span>
                    <span>{insight}</span>
                  </p>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
})

// ============================================
// NOTES VIEW
// ============================================

const NotesView = memo(function NotesView({ state }: { state: ReturnType<typeof useProfitTracker> }) {
  const { t, data, selectedMonth, insights, updateNote } = state
  const note = data.notes[selectedMonth] || {}

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl sm:text-3xl font-black text-white">{t.notes.title}</h2>
        <p className="text-white/40 text-sm">{t.notes.subtitle}</p>
      </div>

      {/* Insights with Help Tooltip */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500/10 via-yellow-500/5 to-amber-500/10 border border-amber-500/20 p-6">
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl bg-amber-500/10" />
        <div className="relative">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center shadow-lg shadow-amber-500/25">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-bold text-white text-lg flex-1">{t.notes.insights}</h3>
            <HelpIcon content={HELP_CONTENT.insights} position="left" />
          </div>
          <div className="space-y-3">
            {insights.map((insight, i) => (
              <p key={i} className="text-white/70 flex items-start gap-3">
                <span className="text-amber-400 mt-1">•</span>
                <span>{insight}</span>
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* Reflection */}
      <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-6">
        <div className="flex items-center gap-2 mb-6">
          <h3 className="font-bold text-white text-lg">{t.notes.reflection}</h3>
          <HelpIcon content={HELP_CONTENT.notes} position="right" />
        </div>

        <div className="space-y-6">
          <div>
            <label className="text-white/60 text-sm block mb-3">{t.notes.question1}</label>
            <textarea
              value={note.reflection || ''}
              onChange={(e) => updateNote('reflection', e.target.value)}
              placeholder={t.notes.placeholder1}
              className="w-full h-28 bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-white/30 resize-none focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition-all"
            />
          </div>

          <div>
            <label className="text-white/60 text-sm block mb-3">{t.notes.question2}</label>
            <textarea
              value={note.decisions || ''}
              onChange={(e) => updateNote('decisions', e.target.value)}
              placeholder={t.notes.placeholder2}
              className="w-full h-28 bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-white/30 resize-none focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition-all"
            />
          </div>

          <div>
            <label className="text-white/60 text-sm block mb-3">{t.notes.question3}</label>
            <textarea
              value={note.nextMonth || ''}
              onChange={(e) => updateNote('nextMonth', e.target.value)}
              placeholder={t.notes.placeholder3}
              className="w-full h-28 bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-white/30 resize-none focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition-all"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 mt-6 text-white/40 text-sm">
          <Check className="w-4 h-4" />
          {t.notes.saved}
        </div>
      </div>
    </div>
  )
})

// ============================================
// ADD ENTRY MODAL WITH ICONS
// ============================================

const AddEntryModal = memo(function AddEntryModal({
  state,
  onAddIncome,
  onAddExpense
}: {
  state: ReturnType<typeof useProfitTracker>
  onAddIncome: (data: Parameters<typeof state.addIncome>[0]) => void
  onAddExpense: (data: Parameters<typeof state.addExpense>[0]) => void
}) {
  const { t, showAddModal, setShowAddModal, currency } = state
  const isIncome = showAddModal === 'income'

  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState<string>(isIncome ? 'clients' : 'software')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])

  const categories = isIncome ? INCOME_CATEGORIES : EXPENSE_CATEGORIES

  const handleSubmit = () => {
    const numAmount = parseFloat(amount)
    if (isNaN(numAmount) || numAmount <= 0) return

    if (isIncome) {
      onAddIncome({
        amount: numAmount,
        currency,
        source: description,
        category: category as IncomeCategoryId,
        date
      })
    } else {
      onAddExpense({
        amount: numAmount,
        currency,
        reason: description,
        category: category as ExpenseCategoryId,
        date
      })
    }
    setShowAddModal(null)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in" onClick={() => setShowAddModal(null)}>
      <div
        className="w-full max-w-lg bg-[#0a0a0f] rounded-t-3xl sm:rounded-3xl border border-white/10 overflow-hidden max-h-[90vh] overflow-y-auto shadow-2xl animate-slide-up"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`relative overflow-hidden p-6 ${isIncome ? 'bg-gradient-to-r from-emerald-500/20 to-green-500/10' : 'bg-gradient-to-r from-rose-500/20 to-red-500/10'}`}>
          <div className={`absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl ${isIncome ? 'bg-emerald-500/20' : 'bg-rose-500/20'}`} />
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isIncome ? 'bg-emerald-500/20' : 'bg-rose-500/20'}`}>
                {isIncome ? <TrendingUp className="w-6 h-6 text-emerald-400" /> : <TrendingDown className="w-6 h-6 text-rose-400" />}
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">{isIncome ? t.income.add : t.expenses.add}</h3>
                <p className="text-white/50 text-sm">Track your finances</p>
              </div>
            </div>
            <button onClick={() => setShowAddModal(null)} className="p-2 rounded-xl hover:bg-white/10 transition-all" aria-label="Close modal">
              <X className="w-6 h-6 text-white/50" />
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="p-6 space-y-5">
          {/* Amount */}
          <div>
            <label className="text-white/60 text-sm block mb-2">{isIncome ? t.income.amount : t.expenses.amount}</label>
            <div className="relative">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-white/40 text-2xl font-bold">{getCurrency(currency).symbol}</span>
              <input
                type="number"
                inputMode="decimal"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                autoFocus
                className={`w-full bg-white/5 border border-white/10 rounded-xl py-5 pl-14 pr-5 text-3xl font-black text-white placeholder-white/20 focus:outline-none transition-all ${
                  isIncome ? 'focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20' : 'focus:border-rose-500/50 focus:ring-2 focus:ring-rose-500/20'
                }`}
              />
            </div>
          </div>

          {/* Category with Icons */}
          <div>
            <label className="text-white/60 text-sm block mb-3">Category</label>
            <div className="grid grid-cols-3 gap-2 max-h-[200px] overflow-y-auto p-1">
              {categories.map(cat => {
                const isSelected = category === cat.id
                const IconComponent = getCategoryIcon(cat.icon)
                return (
                  <button
                    key={cat.id}
                    onClick={() => setCategory(cat.id)}
                    className={`p-3 rounded-xl text-xs font-semibold transition-all flex flex-col items-center gap-1.5 ${
                      isSelected
                        ? isIncome
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-lg shadow-emerald-500/10'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-lg shadow-rose-500/10'
                        : 'bg-white/5 text-white/50 border border-transparent hover:bg-white/10 hover:text-white/80'
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span className="text-center leading-tight">{cat.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-white/60 text-sm block mb-2">{isIncome ? t.income.source : t.expenses.reason}</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={isIncome ? t.income.sourcePlaceholder : t.expenses.reasonPlaceholder}
              className={`w-full bg-white/5 border border-white/10 rounded-xl py-4 px-5 text-white placeholder-white/30 focus:outline-none transition-all ${
                isIncome ? 'focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20' : 'focus:border-rose-500/50 focus:ring-2 focus:ring-rose-500/20'
              }`}
            />
          </div>

          {/* Date */}
          <div>
            <label className="text-white/60 text-sm block mb-2">{t.income.date}</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={`w-full bg-white/5 border border-white/10 rounded-xl py-4 px-5 text-white focus:outline-none transition-all ${
                isIncome ? 'focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20' : 'focus:border-rose-500/50 focus:ring-2 focus:ring-rose-500/20'
              }`}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 pt-0 flex gap-4">
          <button
            onClick={() => setShowAddModal(null)}
            className="flex-1 py-4 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 font-bold transition-all border border-white/10"
          >
            {t.common.cancel}
          </button>
          <button
            onClick={handleSubmit}
            disabled={!amount || parseFloat(amount) <= 0}
            className={`flex-1 py-4 rounded-xl font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg ${
              isIncome
                ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-emerald-500/25 hover:shadow-emerald-500/40'
                : 'bg-gradient-to-r from-rose-500 to-red-500 text-white shadow-rose-500/25 hover:shadow-rose-500/40'
            }`}
          >
            {t.common.save}
          </button>
        </div>
      </div>
    </div>
  )
})

// ============================================
// EDIT ENTRY MODAL
// ============================================

const EditEntryModal = memo(function EditEntryModal({
  state,
  onSuccess
}: {
  state: ReturnType<typeof useProfitTracker>
  onSuccess: (msg: string) => void
}) {
  const { t, editingEntry, setEditingEntry, updateIncome, updateExpense, currency, data } = state

  const isIncome = data.income.some(e => e.id === editingEntry?.id)
  const entry = editingEntry!

  const [amount, setAmount] = useState(entry.amount.toString())
  const [description, setDescription] = useState(isIncome ? (entry as IncomeEntry).source : (entry as ExpenseEntry).reason)
  const [category, setCategory] = useState<string>(isIncome ? (entry as IncomeEntry).category : (entry as ExpenseEntry).category)
  const [date, setDate] = useState(entry.date)

  const categories = isIncome ? INCOME_CATEGORIES : EXPENSE_CATEGORIES

  const handleSubmit = () => {
    const numAmount = parseFloat(amount)
    if (isNaN(numAmount) || numAmount <= 0) return

    if (isIncome) {
      updateIncome(entry.id, {
        amount: numAmount,
        source: description,
        category: category as IncomeCategoryId,
        date
      })
    } else {
      updateExpense(entry.id, {
        amount: numAmount,
        reason: description,
        category: category as ExpenseCategoryId,
        date
      })
    }
    onSuccess('Entry updated!')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in" onClick={() => setEditingEntry(null)}>
      <div className="w-full max-w-lg bg-[#0a0a0f] rounded-t-3xl sm:rounded-3xl border border-white/10 overflow-hidden max-h-[90vh] overflow-y-auto shadow-2xl animate-slide-up" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-amber-500/10 to-yellow-500/5 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
                <Edit3 className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">{t.common.edit}</h3>
                <p className="text-white/50 text-sm">Update entry details</p>
              </div>
            </div>
            <button onClick={() => setEditingEntry(null)} className="p-2 rounded-xl hover:bg-white/10 transition-all" aria-label="Close modal">
              <X className="w-6 h-6 text-white/50" />
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="p-6 space-y-5">
          <div>
            <label className="text-white/60 text-sm block mb-2">{isIncome ? t.income.amount : t.expenses.amount}</label>
            <div className="relative">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-white/40 text-2xl font-bold">{getCurrency(currency).symbol}</span>
              <input
                type="number"
                inputMode="decimal"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-5 pl-14 pr-5 text-3xl font-black text-white focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="text-white/60 text-sm block mb-3">Category</label>
            <div className="grid grid-cols-3 gap-2 max-h-[200px] overflow-y-auto p-1">
              {categories.map(cat => {
                const isSelected = category === cat.id
                const IconComponent = getCategoryIcon(cat.icon)
                return (
                  <button
                    key={cat.id}
                    onClick={() => setCategory(cat.id)}
                    className={`p-3 rounded-xl text-xs font-semibold transition-all flex flex-col items-center gap-1.5 ${
                      isSelected
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-white/5 text-white/50 border border-transparent hover:bg-white/10'
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span className="text-center leading-tight">{cat.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <div>
            <label className="text-white/60 text-sm block mb-2">{isIncome ? t.income.source : t.expenses.reason}</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-5 text-white focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition-all"
            />
          </div>

          <div>
            <label className="text-white/60 text-sm block mb-2">{t.income.date}</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-5 text-white focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition-all"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 pt-0 flex gap-4">
          <button onClick={() => setEditingEntry(null)} className="flex-1 py-4 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 font-bold transition-all border border-white/10">
            {t.common.cancel}
          </button>
          <button onClick={handleSubmit} className="flex-1 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-bold shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all">
            {t.common.save}
          </button>
        </div>
      </div>
    </div>
  )
})

// ============================================
// RECURRING MODAL
// ============================================

const RecurringModal = memo(function RecurringModal({
  state,
  onSuccess
}: {
  state: ReturnType<typeof useProfitTracker>
  onSuccess: (msg: string) => void
}) {
  const { data, setShowRecurringModal, addRecurring, deleteRecurring, toggleRecurring, currency, formatAmount } = state

  const [showAdd, setShowAdd] = useState(false)
  const [type, setType] = useState<'income' | 'expense'>('expense')
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState<string>('software')
  const [dayOfMonth, setDayOfMonth] = useState('1')

  const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES

  const handleAdd = () => {
    const numAmount = parseFloat(amount)
    if (isNaN(numAmount) || numAmount <= 0) return

    addRecurring({
      type,
      amount: numAmount,
      currency,
      description,
      category: category as any,
      dayOfMonth: parseInt(dayOfMonth),
      isActive: true
    })
    setShowAdd(false)
    setAmount('')
    setDescription('')
    onSuccess('Recurring entry added!')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in" onClick={() => setShowRecurringModal(false)}>
      <div className="w-full max-w-lg bg-[#0a0a0f] rounded-t-3xl sm:rounded-3xl border border-white/10 overflow-hidden max-h-[85vh] overflow-y-auto shadow-2xl animate-slide-up" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="sticky top-0 z-10 p-6 bg-gradient-to-r from-violet-500/10 to-purple-500/5 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center">
                <RefreshCw className="w-6 h-6 text-violet-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Recurring Entries</h3>
                <p className="text-white/50 text-sm">Automate monthly transactions</p>
              </div>
            </div>
            <button onClick={() => setShowRecurringModal(false)} className="p-2 rounded-xl hover:bg-white/10 transition-all" aria-label="Close modal">
              <X className="w-6 h-6 text-white/50" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {data.recurring.length > 0 && (
            <div className="space-y-3">
              {data.recurring.map(rec => {
                const cat = rec.type === 'income'
                  ? INCOME_CATEGORIES.find(c => c.id === rec.category)
                  : EXPENSE_CATEGORIES.find(c => c.id === rec.category)
                const IconComponent = cat ? getCategoryIcon(cat.icon) : MoreHorizontal

                return (
                  <div key={rec.id} className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                    rec.isActive ? 'bg-white/5 border-white/10' : 'bg-white/[0.02] border-white/5 opacity-60'
                  }`}>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => toggleRecurring(rec.id)}
                        className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                          rec.isActive ? 'bg-violet-500 border-violet-500' : 'border-white/20 hover:border-white/40'
                        }`}
                        aria-label={rec.isActive ? 'Disable recurring' : 'Enable recurring'}
                      >
                        {rec.isActive && <Check className="w-4 h-4 text-white" />}
                      </button>
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${rec.type === 'income' ? 'bg-emerald-500/20' : 'bg-rose-500/20'}`}>
                        <IconComponent className={`w-4 h-4 ${rec.type === 'income' ? 'text-emerald-400' : 'text-rose-400'}`} />
                      </div>
                      <div>
                        <p className="font-semibold text-white">{rec.description || cat?.label}</p>
                        <p className="text-xs text-white/40">Day {rec.dayOfMonth} • {cat?.label}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`font-bold ${rec.type === 'income' ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {rec.type === 'income' ? '+' : '-'}{formatAmount(rec.amount)}
                      </span>
                      <button onClick={() => deleteRecurring(rec.id)} className="p-2 rounded-lg hover:bg-white/10 transition-all" aria-label="Delete recurring">
                        <Trash2 className="w-4 h-4 text-white/40 hover:text-rose-400" />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {!showAdd ? (
            <button
              onClick={() => setShowAdd(true)}
              className="w-full py-4 rounded-xl border-2 border-dashed border-white/10 text-white/40 hover:border-violet-500/50 hover:text-violet-400 transition-all flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Recurring Entry
            </button>
          ) : (
            <div className="space-y-4 p-5 rounded-xl bg-white/5 border border-white/10">
              <div className="flex gap-2">
                <button
                  onClick={() => { setType('income'); setCategory('clients') }}
                  className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                    type === 'income' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/5 text-white/40 border border-transparent hover:bg-white/10'
                  }`}
                >
                  Income
                </button>
                <button
                  onClick={() => { setType('expense'); setCategory('software') }}
                  className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                    type === 'expense' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-white/5 text-white/40 border border-transparent hover:bg-white/10'
                  }`}
                >
                  Expense
                </button>
              </div>

              <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount" className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-5 text-white placeholder-white/30 focus:outline-none focus:border-violet-500/50 transition-all" />
              <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description (e.g., Netflix)" className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-5 text-white placeholder-white/30 focus:outline-none focus:border-violet-500/50 transition-all" />

              <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-5 text-white focus:outline-none focus:border-violet-500/50 transition-all appearance-none cursor-pointer">
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id} className="bg-zinc-900">{cat.label}</option>
                ))}
              </select>

              <div>
                <label className="text-white/50 text-xs block mb-2">Day of month (1-28)</label>
                <input type="number" min="1" max="28" value={dayOfMonth} onChange={(e) => setDayOfMonth(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-5 text-white focus:outline-none focus:border-violet-500/50 transition-all" />
              </div>

              <div className="flex gap-3">
                <button onClick={() => setShowAdd(false)} className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 font-semibold border border-white/10 transition-all">Cancel</button>
                <button onClick={handleAdd} disabled={!amount} className="flex-1 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-purple-500 text-white font-semibold shadow-lg shadow-violet-500/25 disabled:opacity-40 transition-all">Add</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
})

// ============================================
// BUDGET MODAL
// ============================================

const BudgetModal = memo(function BudgetModal({
  state,
  onSuccess
}: {
  state: ReturnType<typeof useProfitTracker>
  onSuccess: (msg: string) => void
}) {
  const { data, setShowBudgetModal, addBudget, deleteBudget, formatAmount, currentStats } = state

  const [showAdd, setShowAdd] = useState(false)
  const [category, setCategory] = useState<string>('total')
  const [limit, setLimit] = useState('')

  const handleAdd = () => {
    const numLimit = parseFloat(limit)
    if (isNaN(numLimit) || numLimit <= 0) return

    addBudget({ category: category as any, monthlyLimit: numLimit })
    setShowAdd(false)
    setLimit('')
    onSuccess('Budget goal added!')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in" onClick={() => setShowBudgetModal(false)}>
      <div className="w-full max-w-lg bg-[#0a0a0f] rounded-t-3xl sm:rounded-3xl border border-white/10 overflow-hidden max-h-[85vh] overflow-y-auto shadow-2xl animate-slide-up" onClick={e => e.stopPropagation()}>
        <div className="sticky top-0 z-10 p-6 bg-gradient-to-r from-emerald-500/10 to-green-500/5 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <Target className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Budget Goals</h3>
                <p className="text-white/50 text-sm">Set spending limits</p>
              </div>
            </div>
            <button onClick={() => setShowBudgetModal(false)} className="p-2 rounded-xl hover:bg-white/10 transition-all" aria-label="Close modal">
              <X className="w-6 h-6 text-white/50" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {data.budgets.length > 0 && (
            <div className="space-y-4">
              {data.budgets.map(budget => {
                const cat = budget.category === 'total' ? { label: 'Total Expenses' } : EXPENSE_CATEGORIES.find(c => c.id === budget.category)
                const spent = budget.category === 'total' ? currentStats.totalExpenses : currentStats.expensesByCategory[budget.category] || 0
                const percent = (spent / budget.monthlyLimit) * 100

                return (
                  <div key={budget.id} className="p-5 rounded-xl bg-white/5 border border-white/10">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-white font-semibold">{cat?.label}</span>
                      <button onClick={() => deleteBudget(budget.id)} className="p-1.5 rounded-lg hover:bg-white/10 transition-all" aria-label="Delete budget">
                        <Trash2 className="w-4 h-4 text-white/40 hover:text-rose-400" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-white/60">{formatAmount(spent)} / {formatAmount(budget.monthlyLimit)}</span>
                      <span className={`font-semibold ${percent >= 100 ? 'text-rose-400' : percent >= 80 ? 'text-amber-400' : 'text-emerald-400'}`}>{percent.toFixed(0)}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-500 ${percent >= 100 ? 'bg-rose-500' : percent >= 80 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${Math.min(percent, 100)}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {!showAdd ? (
            <button onClick={() => setShowAdd(true)} className="w-full py-4 rounded-xl border-2 border-dashed border-white/10 text-white/40 hover:border-emerald-500/50 hover:text-emerald-400 transition-all flex items-center justify-center gap-2">
              <Plus className="w-5 h-5" />
              Add Budget Goal
            </button>
          ) : (
            <div className="space-y-4 p-5 rounded-xl bg-white/5 border border-white/10">
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-5 text-white focus:outline-none focus:border-emerald-500/50 transition-all appearance-none cursor-pointer">
                <option value="total" className="bg-zinc-900">Total Expenses</option>
                {EXPENSE_CATEGORIES.map(cat => (
                  <option key={cat.id} value={cat.id} className="bg-zinc-900">{cat.label}</option>
                ))}
              </select>

              <input type="number" value={limit} onChange={(e) => setLimit(e.target.value)} placeholder="Monthly limit" className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-5 text-white placeholder-white/30 focus:outline-none focus:border-emerald-500/50 transition-all" />

              <div className="flex gap-3">
                <button onClick={() => setShowAdd(false)} className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 font-semibold border border-white/10 transition-all">Cancel</button>
                <button onClick={handleAdd} disabled={!limit} className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 text-white font-semibold shadow-lg shadow-emerald-500/25 disabled:opacity-40 transition-all">Add</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
})

// ============================================
// SETTINGS MODAL
// ============================================

const SettingsModal = memo(function SettingsModal({ state }: { state: ReturnType<typeof useProfitTracker> }) {
  const { t, setShowSettings, currency, setCurrency, language, setLanguage, exportCSV, exportBackup, importBackup } = state
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      if (importBackup(content)) {
        alert('Backup restored successfully!')
        setShowSettings(false)
      } else {
        alert('Invalid backup file')
      }
    }
    reader.readAsText(file)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in" onClick={() => setShowSettings(false)}>
      <div className="w-full max-w-lg bg-[#0a0a0f] rounded-t-3xl sm:rounded-3xl border border-white/10 overflow-hidden max-h-[85vh] overflow-y-auto shadow-2xl animate-slide-up" onClick={e => e.stopPropagation()}>
        <div className="sticky top-0 z-10 p-6 bg-gradient-to-r from-amber-500/10 to-yellow-500/5 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
                <Settings className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">{t.common.settings}</h3>
                <p className="text-white/50 text-sm">Customize your experience</p>
              </div>
            </div>
            <button onClick={() => setShowSettings(false)} className="p-2 rounded-xl hover:bg-white/10 transition-all" aria-label="Close settings">
              <X className="w-6 h-6 text-white/50" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="text-white/60 text-sm block mb-3 flex items-center gap-2">
              <Coins className="w-4 h-4" />
              {t.common.currency}
            </label>
            <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-5 text-white focus:outline-none focus:border-amber-500/50 transition-all appearance-none cursor-pointer">
              {CURRENCIES.map(c => (
                <option key={c.code} value={c.code} className="bg-zinc-900">{c.symbol} {c.name} ({c.code})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-white/60 text-sm block mb-3 flex items-center gap-2">
              <Globe className="w-4 h-4" />
              {t.common.language}
            </label>
            <select value={language} onChange={(e) => setLanguage(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-5 text-white focus:outline-none focus:border-amber-500/50 transition-all appearance-none cursor-pointer">
              {LANGUAGES.map(l => (
                <option key={l.code} value={l.code} className="bg-zinc-900">{l.flag} {l.name}</option>
              ))}
            </select>
          </div>

          <div className="border-t border-white/10" />

          <div>
            <label className="text-white/60 text-sm block mb-3 flex items-center gap-2">
              <Download className="w-4 h-4" />
              {t.common.export}
            </label>
            <div className="space-y-3">
              <button onClick={exportCSV} className="w-full py-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium transition-all flex items-center justify-center gap-3">
                <Download className="w-5 h-5 text-white/50" />
                {t.common.exportCSV} (This Month)
              </button>
              <button onClick={exportBackup} className="w-full py-4 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 font-medium transition-all flex items-center justify-center gap-3">
                <Shield className="w-5 h-5" />
                Full Backup (JSON)
              </button>
            </div>
          </div>

          <div>
            <label className="text-white/60 text-sm block mb-3 flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Restore Backup
            </label>
            <input ref={fileInputRef} type="file" accept=".json" onChange={handleImport} className="hidden" />
            <button onClick={() => fileInputRef.current?.click()} className="w-full py-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium transition-all flex items-center justify-center gap-3">
              <Upload className="w-5 h-5 text-white/50" />
              Import Backup File
            </button>
            <p className="text-white/30 text-xs mt-3">This will replace all your current data.</p>
          </div>
        </div>
      </div>
    </div>
  )
})

// ============================================
// UNDO TOAST
// ============================================

const UndoToast = memo(function UndoToast({ state }: { state: ReturnType<typeof useProfitTracker> }) {
  const { t, handleUndo } = state

  return (
    <div className="fixed bottom-6 left-6 right-6 sm:left-auto sm:right-6 sm:w-auto z-50 animate-slide-up">
      <div className="bg-[#0a0a0f] border border-white/10 rounded-2xl p-4 flex items-center justify-between gap-6 shadow-2xl shadow-black/50 backdrop-blur-md">
        <p className="text-white font-medium">{t.common.undoDelete}</p>
        <button onClick={handleUndo} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/20 text-amber-400 font-semibold hover:bg-amber-500/30 transition-all">
          <Undo2 className="w-4 h-4" />
          {t.common.undo}
        </button>
      </div>
    </div>
  )
})

export default ProfitTracker
