'use client'

import { memo, useState, useMemo, useEffect, useCallback } from 'react'
import {
  Plus, Minus, TrendingUp, TrendingDown, DollarSign, Calendar,
  ChevronRight, Trash2, Edit2, X, Check, PiggyBank, Target,
  ArrowUpRight, ArrowDownRight, MoreVertical, Settings, AlertTriangle,
  Sparkles, BarChart3, PieChart, Zap, Award, Flame, ChevronLeft,
  Download, Upload, RefreshCw, HelpCircle, BookOpen, Lightbulb,
  TrendingUp as Growth, Wallet, CreditCard, ShoppingBag, Users,
  Building, Car, Utensils, Smartphone, Wifi, Home, Heart,
  GraduationCap, Plane, Gift, Coffee, Music, Film, Gamepad2,
  Search, Filter, RotateCcw, Share2, Clock, CalendarDays,
  ChevronDown, Eye, EyeOff, Info, CheckCircle2, XCircle,
  ArrowRight, Star, Trophy, Medal, Crown, Gem, CircleDollarSign,
  Receipt, Calculator, LineChart, Activity, Percent
} from 'lucide-react'
import { BottomSheet, MobileAnimatedNumber, useHapticFeedback } from './MobileNavigation'

// ============================================
// TYPES & CONSTANTS
// ============================================

interface Transaction {
  id: string
  type: 'income' | 'expense'
  amount: number
  description: string
  date: string
  category?: string
  isRecurring?: boolean
}

interface MobileTrackerProps {
  state?: {
    transactions: Transaction[]
    addTransaction: (t: Omit<Transaction, 'id'>) => void
    deleteTransaction: (id: string) => void
    updateTransaction: (id: string, t: Partial<Transaction>) => void
    monthlyGoal?: number
    setMonthlyGoal?: (goal: number) => void
  }
}

// ============================================
// LOCAL STORAGE HOOK FOR STANDALONE MODE
// ============================================

const STORAGE_KEY = 'premium_profit_tracker'

interface StoredData {
  transactions: Transaction[]
  monthlyGoal: number
}

// Generate realistic demo data for video ads
function generateDemoData(): StoredData {
  const transactions: Transaction[] = []
  const now = new Date()

  // Helper to create date string
  const getDate = (monthsAgo: number, day: number) => {
    const d = new Date(now.getFullYear(), now.getMonth() - monthsAgo, day)
    return d.toISOString().split('T')[0]
  }

  // FEBRUARY 2026 (Current month) - Strong month
  transactions.push(
    { id: 'tx_1', type: 'income', amount: 2500, description: 'Client retainer - Johnson Law Firm', date: getDate(0, 3), category: 'client' },
    { id: 'tx_2', type: 'income', amount: 1800, description: 'Website project - Local Bakery', date: getDate(0, 7), category: 'client' },
    { id: 'tx_3', type: 'income', amount: 497, description: 'Online course sale', date: getDate(0, 10), category: 'sale' },
    { id: 'tx_4', type: 'income', amount: 750, description: 'Consulting call - Tech startup', date: getDate(0, 15), category: 'consulting' },
    { id: 'tx_5', type: 'income', amount: 320, description: 'Affiliate commission - Software', date: getDate(0, 18), category: 'affiliate' },
    { id: 'tx_6', type: 'expense', amount: 99, description: 'ChatGPT Plus subscription', date: getDate(0, 1), category: 'software' },
    { id: 'tx_7', type: 'expense', amount: 250, description: 'Facebook Ads - Lead gen', date: getDate(0, 5), category: 'ads' },
    { id: 'tx_8', type: 'expense', amount: 49, description: 'Canva Pro', date: getDate(0, 8), category: 'tools' },
    { id: 'tx_9', type: 'expense', amount: 29, description: 'Calendly subscription', date: getDate(0, 12), category: 'software' },
    { id: 'tx_10', type: 'expense', amount: 150, description: 'Google Ads campaign', date: getDate(0, 20), category: 'ads' },
  )

  // JANUARY 2026
  transactions.push(
    { id: 'tx_11', type: 'income', amount: 3200, description: 'Client project - E-commerce site', date: getDate(1, 5), category: 'client' },
    { id: 'tx_12', type: 'income', amount: 1500, description: 'Freelance design work', date: getDate(1, 12), category: 'freelance' },
    { id: 'tx_13', type: 'income', amount: 997, description: 'Course bundle sale', date: getDate(1, 18), category: 'sale' },
    { id: 'tx_14', type: 'income', amount: 450, description: 'Affiliate payout', date: getDate(1, 25), category: 'affiliate' },
    { id: 'tx_15', type: 'expense', amount: 99, description: 'ChatGPT Plus', date: getDate(1, 1), category: 'software' },
    { id: 'tx_16', type: 'expense', amount: 500, description: 'Facebook Ads', date: getDate(1, 10), category: 'ads' },
    { id: 'tx_17', type: 'expense', amount: 197, description: 'Course platform fee', date: getDate(1, 15), category: 'services' },
    { id: 'tx_18', type: 'expense', amount: 79, description: 'Email marketing tool', date: getDate(1, 20), category: 'software' },
  )

  // DECEMBER 2025
  transactions.push(
    { id: 'tx_19', type: 'income', amount: 4500, description: 'Year-end client bonus project', date: getDate(2, 8), category: 'client' },
    { id: 'tx_20', type: 'income', amount: 2200, description: 'Holiday sale - Digital products', date: getDate(2, 15), category: 'sale' },
    { id: 'tx_21', type: 'income', amount: 800, description: 'Consulting - Business strategy', date: getDate(2, 22), category: 'consulting' },
    { id: 'tx_22', type: 'expense', amount: 99, description: 'ChatGPT Plus', date: getDate(2, 1), category: 'software' },
    { id: 'tx_23', type: 'expense', amount: 350, description: 'Holiday ad campaign', date: getDate(2, 5), category: 'ads' },
    { id: 'tx_24', type: 'expense', amount: 299, description: 'Annual domain renewals', date: getDate(2, 10), category: 'services' },
  )

  // NOVEMBER 2025
  transactions.push(
    { id: 'tx_25', type: 'income', amount: 2800, description: 'Client website redesign', date: getDate(3, 4), category: 'client' },
    { id: 'tx_26', type: 'income', amount: 1200, description: 'Freelance project', date: getDate(3, 14), category: 'freelance' },
    { id: 'tx_27', type: 'income', amount: 650, description: 'Black Friday course sales', date: getDate(3, 25), category: 'sale' },
    { id: 'tx_28', type: 'expense', amount: 99, description: 'ChatGPT Plus', date: getDate(3, 1), category: 'software' },
    { id: 'tx_29', type: 'expense', amount: 400, description: 'Black Friday ads', date: getDate(3, 20), category: 'ads' },
    { id: 'tx_30', type: 'expense', amount: 149, description: 'Design software annual', date: getDate(3, 12), category: 'tools' },
  )

  // OCTOBER 2025
  transactions.push(
    { id: 'tx_31', type: 'income', amount: 1900, description: 'Client monthly retainer', date: getDate(4, 5), category: 'client' },
    { id: 'tx_32', type: 'income', amount: 1100, description: 'Freelance consulting', date: getDate(4, 18), category: 'freelance' },
    { id: 'tx_33', type: 'income', amount: 380, description: 'Affiliate sales', date: getDate(4, 28), category: 'affiliate' },
    { id: 'tx_34', type: 'expense', amount: 99, description: 'ChatGPT Plus', date: getDate(4, 1), category: 'software' },
    { id: 'tx_35', type: 'expense', amount: 200, description: 'Google Ads', date: getDate(4, 15), category: 'ads' },
    { id: 'tx_36', type: 'expense', amount: 59, description: 'Project management tool', date: getDate(4, 8), category: 'software' },
  )

  // SEPTEMBER 2025
  transactions.push(
    { id: 'tx_37', type: 'income', amount: 2100, description: 'New client onboarding', date: getDate(5, 10), category: 'client' },
    { id: 'tx_38', type: 'income', amount: 900, description: 'Quick freelance gig', date: getDate(5, 20), category: 'freelance' },
    { id: 'tx_39', type: 'income', amount: 275, description: 'Course sale', date: getDate(5, 27), category: 'sale' },
    { id: 'tx_40', type: 'expense', amount: 99, description: 'ChatGPT Plus', date: getDate(5, 1), category: 'software' },
    { id: 'tx_41', type: 'expense', amount: 180, description: 'Social media ads', date: getDate(5, 12), category: 'ads' },
    { id: 'tx_42', type: 'expense', amount: 49, description: 'Stock photos', date: getDate(5, 5), category: 'tools' },
  )

  return {
    transactions,
    monthlyGoal: 5000 // Realistic goal
  }
}

function useLocalTrackerState() {
  const [data, setData] = useState<StoredData>({ transactions: [], monthlyGoal: 0 })
  const [isLoaded, setIsLoaded] = useState(false)

  // Load from localStorage on mount, or load demo data if URL has ?demo=true
  useEffect(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search)
      const isDemo = urlParams.get('demo') === 'true'

      if (isDemo) {
        // Load demo data for video recording
        const demoData = generateDemoData()
        setData(demoData)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(demoData))
      } else {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) {
          setData(JSON.parse(stored))
        }
      }
    } catch (e) {
      console.error('Error loading tracker data:', e)
    }
    setIsLoaded(true)
  }, [])

  // Save to localStorage on change
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
      } catch (e) {
        console.error('Error saving tracker data:', e)
      }
    }
  }, [data, isLoaded])

  const addTransaction = useCallback((t: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...t,
      id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    }
    setData(prev => ({ ...prev, transactions: [...prev.transactions, newTransaction] }))
  }, [])

  const deleteTransaction = useCallback((id: string) => {
    setData(prev => ({ ...prev, transactions: prev.transactions.filter(t => t.id !== id) }))
  }, [])

  const updateTransaction = useCallback((id: string, updates: Partial<Transaction>) => {
    setData(prev => ({
      ...prev,
      transactions: prev.transactions.map(t => t.id === id ? { ...t, ...updates } : t)
    }))
  }, [])

  const setMonthlyGoal = useCallback((goal: number) => {
    setData(prev => ({ ...prev, monthlyGoal: goal }))
  }, [])

  const loadDemoData = useCallback(() => {
    const demoData = generateDemoData()
    setData(demoData)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(demoData))
  }, [])

  return {
    transactions: data.transactions,
    monthlyGoal: data.monthlyGoal,
    addTransaction,
    deleteTransaction,
    updateTransaction,
    setMonthlyGoal,
    loadDemoData,
    isLoaded
  }
}

const CURRENCY = '$'

// Income Categories with icons and colors
const INCOME_CATEGORIES = [
  { id: 'client', label: 'Client Payment', icon: Users, color: 'emerald' },
  { id: 'sale', label: 'Product Sale', icon: ShoppingBag, color: 'blue' },
  { id: 'freelance', label: 'Freelance', icon: Wallet, color: 'violet' },
  { id: 'affiliate', label: 'Affiliate', icon: Share2, color: 'pink' },
  { id: 'consulting', label: 'Consulting', icon: Lightbulb, color: 'amber' },
  { id: 'investment', label: 'Investment', icon: Growth, color: 'cyan' },
  { id: 'refund', label: 'Refund', icon: RotateCcw, color: 'orange' },
  { id: 'other', label: 'Other', icon: CircleDollarSign, color: 'zinc' },
]

const EXPENSE_CATEGORIES = [
  { id: 'software', label: 'Software', icon: Smartphone, color: 'blue' },
  { id: 'ads', label: 'Advertising', icon: Zap, color: 'red' },
  { id: 'tools', label: 'Tools', icon: Settings, color: 'violet' },
  { id: 'services', label: 'Services', icon: Users, color: 'cyan' },
  { id: 'subscription', label: 'Subscription', icon: RefreshCw, color: 'pink' },
  { id: 'education', label: 'Education', icon: GraduationCap, color: 'emerald' },
  { id: 'office', label: 'Office', icon: Building, color: 'amber' },
  { id: 'travel', label: 'Travel', icon: Plane, color: 'sky' },
  { id: 'food', label: 'Food', icon: Coffee, color: 'orange' },
  { id: 'other', label: 'Other', icon: Receipt, color: 'zinc' },
]

// ============================================
// UTILITY FUNCTIONS
// ============================================

const formatCurrency = (amount: number, showSign = false) => {
  const formatted = Math.abs(amount).toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })
  if (showSign) {
    return amount >= 0 ? `+${CURRENCY}${formatted}` : `-${CURRENCY}${formatted}`
  }
  return `${CURRENCY}${formatted}`
}

const formatCompactCurrency = (amount: number) => {
  if (Math.abs(amount) >= 1000000) {
    return `${CURRENCY}${(amount / 1000000).toFixed(1)}M`
  }
  if (Math.abs(amount) >= 1000) {
    return `${CURRENCY}${(amount / 1000).toFixed(1)}K`
  }
  return formatCurrency(amount)
}

const getMonthName = (dateStr: string) => {
  const [year, month] = dateStr.split('-')
  const date = new Date(parseInt(year), parseInt(month) - 1)
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

const getShortMonthName = (dateStr: string) => {
  const [year, month] = dateStr.split('-')
  const date = new Date(parseInt(year), parseInt(month) - 1)
  return date.toLocaleDateString('en-US', { month: 'short' })
}

const getCategoryInfo = (categoryId: string, type: 'income' | 'expense') => {
  const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES
  return categories.find(c => c.id === categoryId) || categories[categories.length - 1]
}

const getCategoryColor = (color: string) => {
  const colors: Record<string, { bg: string; text: string; border: string; glow: string }> = {
    emerald: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/30', glow: 'shadow-emerald-500/20' },
    blue: { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30', glow: 'shadow-blue-500/20' },
    violet: { bg: 'bg-violet-500/20', text: 'text-violet-400', border: 'border-violet-500/30', glow: 'shadow-violet-500/20' },
    pink: { bg: 'bg-pink-500/20', text: 'text-pink-400', border: 'border-pink-500/30', glow: 'shadow-pink-500/20' },
    amber: { bg: 'bg-amber-500/20', text: 'text-amber-400', border: 'border-amber-500/30', glow: 'shadow-amber-500/20' },
    cyan: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/30', glow: 'shadow-yellow-500/20' },
    orange: { bg: 'bg-orange-500/20', text: 'text-orange-400', border: 'border-orange-500/30', glow: 'shadow-orange-500/20' },
    red: { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30', glow: 'shadow-red-500/20' },
    sky: { bg: 'bg-sky-500/20', text: 'text-sky-400', border: 'border-sky-500/30', glow: 'shadow-sky-500/20' },
    zinc: { bg: 'bg-zinc-500/20', text: 'text-zinc-400', border: 'border-zinc-500/30', glow: 'shadow-zinc-500/20' },
  }
  return colors[color] || colors.zinc
}

// ============================================
// MAIN TRACKER COMPONENT
// ============================================

type TrackerTab = 'overview' | 'income' | 'expenses' | 'analytics' | 'guide'

export const MobileTracker = memo(function MobileTracker({ state: propState }: MobileTrackerProps) {
  // Use local state if no props provided (standalone/desktop mode)
  const localState = useLocalTrackerState()

  // Determine which state to use
  const state = propState || {
    transactions: localState.transactions,
    addTransaction: localState.addTransaction,
    deleteTransaction: localState.deleteTransaction,
    updateTransaction: localState.updateTransaction,
    monthlyGoal: localState.monthlyGoal,
    setMonthlyGoal: localState.setMonthlyGoal
  }

  // Demo data loader (only available in standalone mode)
  const loadDemoData = localState.loadDemoData

  const [activeTab, setActiveTab] = useState<TrackerTab>('overview')
  const [showAddSheet, setShowAddSheet] = useState(false)
  const [addType, setAddType] = useState<'income' | 'expense'>('income')
  const [showTransactionDetail, setShowTransactionDetail] = useState<Transaction | null>(null)
  const [showGoalSheet, setShowGoalSheet] = useState(false)
  const [showSettingsSheet, setShowSettingsSheet] = useState(false)
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  })
  const [showMonthPicker, setShowMonthPicker] = useState(false)
  const [hideAmounts, setHideAmounts] = useState(false)
  const haptic = useHapticFeedback()

  // Calculate all stats
  const stats = useMemo(() => {
    const monthlyTx = state.transactions.filter(t => t.date.startsWith(selectedMonth))
    const income = monthlyTx.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0)
    const expenses = monthlyTx.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0)
    const profit = income - expenses
    const profitMargin = income > 0 ? (profit / income) * 100 : 0

    // Previous month comparison
    const [year, month] = selectedMonth.split('-').map(Number)
    const prevDate = new Date(year, month - 2)
    const prevMonth = `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, '0')}`
    const prevTx = state.transactions.filter(t => t.date.startsWith(prevMonth))
    const prevIncome = prevTx.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0)
    const prevExpenses = prevTx.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0)
    const prevProfit = prevIncome - prevExpenses

    const incomeChange = prevIncome > 0 ? ((income - prevIncome) / prevIncome) * 100 : income > 0 ? 100 : 0
    const expenseChange = prevExpenses > 0 ? ((expenses - prevExpenses) / prevExpenses) * 100 : expenses > 0 ? 100 : 0
    const profitChange = prevProfit !== 0 ? ((profit - prevProfit) / Math.abs(prevProfit)) * 100 : profit !== 0 ? 100 : 0

    // Category breakdown
    const incomeByCategory: Record<string, number> = {}
    const expensesByCategory: Record<string, number> = {}
    monthlyTx.forEach(t => {
      const cat = t.category || 'other'
      if (t.type === 'income') {
        incomeByCategory[cat] = (incomeByCategory[cat] || 0) + t.amount
      } else {
        expensesByCategory[cat] = (expensesByCategory[cat] || 0) + t.amount
      }
    })

    // Trend data (last 6 months)
    const trendData: { month: string; income: number; expenses: number; profit: number }[] = []
    for (let i = 5; i >= 0; i--) {
      const d = new Date(year, month - 1 - i)
      const m = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      const mTx = state.transactions.filter(t => t.date.startsWith(m))
      const mIncome = mTx.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0)
      const mExpenses = mTx.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0)
      trendData.push({ month: m, income: mIncome, expenses: mExpenses, profit: mIncome - mExpenses })
    }

    // Smart insights
    const insights: { type: 'success' | 'warning' | 'info'; message: string }[] = []
    if (profit > 0 && profit > prevProfit) {
      insights.push({ type: 'success', message: `Profit increased by ${formatCurrency(profit - prevProfit)} from last month!` })
    }
    if (expenses > income * 0.8 && income > 0) {
      insights.push({ type: 'warning', message: 'Expenses are over 80% of your income this month.' })
    }
    if (profitMargin > 50) {
      insights.push({ type: 'success', message: `Excellent ${Math.round(profitMargin)}% profit margin!` })
    }
    const topExpenseCat = Object.entries(expensesByCategory).sort((a, b) => b[1] - a[1])[0]
    if (topExpenseCat && topExpenseCat[1] > expenses * 0.4) {
      const catInfo = getCategoryInfo(topExpenseCat[0], 'expense')
      insights.push({ type: 'info', message: `${catInfo.label} is your biggest expense (${Math.round((topExpenseCat[1] / expenses) * 100)}%)` })
    }

    // Streak calculation
    let profitStreak = 0
    for (let i = 0; i < 12; i++) {
      const d = new Date(year, month - 1 - i)
      const m = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      const mTx = state.transactions.filter(t => t.date.startsWith(m))
      const mProfit = mTx.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0) -
                      mTx.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
      if (mProfit > 0) profitStreak++
      else break
    }

    return {
      income,
      expenses,
      profit,
      profitMargin,
      incomeChange,
      expenseChange,
      profitChange,
      incomeByCategory,
      expensesByCategory,
      trendData,
      insights,
      profitStreak,
      monthlyTransactions: monthlyTx.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
      totalTransactions: monthlyTx.length,
    }
  }, [state.transactions, selectedMonth])

  // Goal progress
  const goalProgress = state.monthlyGoal && state.monthlyGoal > 0
    ? Math.min((stats.profit / state.monthlyGoal) * 100, 150)
    : 0
  const goalReached = goalProgress >= 100

  const openAddSheet = (type: 'income' | 'expense') => {
    haptic.trigger('medium')
    setAddType(type)
    setShowAddSheet(true)
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    haptic.trigger('light')
    const [year, month] = selectedMonth.split('-').map(Number)
    const newDate = new Date(year, direction === 'prev' ? month - 2 : month)
    setSelectedMonth(`${newDate.getFullYear()}-${String(newDate.getMonth() + 1).padStart(2, '0')}`)
  }

  return (
    <div className="min-h-screen pb-40 lg:pb-8 overflow-y-auto">
      {/* PREMIUM HEADER */}
      <header className="sticky top-0 z-40 backdrop-blur-xl border-b border-amber-500/10 bg-gradient-to-b from-black/40 to-transparent">
        <div className="max-w-4xl mx-auto">
          {/* Top Bar */}
          <div className="flex items-center justify-between px-4 lg:px-6 py-3 lg:py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center shadow-lg shadow-amber-500/25">
                <Wallet className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg lg:text-xl font-black text-white">Profit Tracker</h1>
                <p className="text-xs lg:text-sm text-emerald-400/70 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Auto-saved
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setHideAmounts(!hideAmounts)}
              className="p-2.5 rounded-xl bg-white/5 border border-white/10 active:bg-white/10"
            >
              {hideAmounts ? <EyeOff className="w-4 h-4 text-white/50" /> : <Eye className="w-4 h-4 text-white/50" />}
            </button>
            <button
              onClick={() => { haptic.trigger('light'); setShowSettingsSheet(true) }}
              className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 active:bg-white/10 transition-colors"
            >
              <Settings className="w-4 h-4 text-amber-400" />
            </button>
          </div>
        </div>

          {/* Month Navigator */}
          <div className="flex items-center justify-center gap-2 px-4 lg:px-6 pb-3">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 active:bg-white/10 transition-all"
            >
              <ChevronLeft className="w-5 h-5 text-white/60" />
            </button>
            <button
              onClick={() => { haptic.trigger('light'); setShowMonthPicker(true) }}
              className="flex-1 max-w-[200px] lg:max-w-[250px] py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500/10 to-yellow-500/5 border border-amber-500/20 hover:border-amber-500/40 active:scale-[0.98] transition-all cursor-pointer"
            >
              <span className="text-white font-bold">{getMonthName(selectedMonth)}</span>
            </button>
            <button
              onClick={() => navigateMonth('next')}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 active:bg-white/10 transition-all"
            >
              <ChevronRight className="w-5 h-5 text-white/60" />
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-1 lg:gap-2 px-4 lg:px-6 pb-3 overflow-x-auto scrollbar-none lg:justify-center">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'income', label: 'Income', icon: TrendingUp },
              { id: 'expenses', label: 'Expenses', icon: TrendingDown },
              { id: 'analytics', label: 'Analytics', icon: LineChart },
              { id: 'guide', label: 'Guide', icon: BookOpen },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => { haptic.trigger('light'); setActiveTab(tab.id as TrackerTab) }}
                className={`flex items-center gap-1.5 px-3 lg:px-4 py-2 lg:py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    : 'text-white/50 hover:bg-white/5 active:bg-white/5'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* CONTENT */}
      <div className="max-w-4xl mx-auto px-4 lg:px-6 py-4 lg:py-6">
        {activeTab === 'overview' && (
          <OverviewTab
            stats={stats}
            goalProgress={goalProgress}
            goalReached={goalReached}
            monthlyGoal={state.monthlyGoal}
            hideAmounts={hideAmounts}
            onSetGoal={() => { haptic.trigger('light'); setShowGoalSheet(true) }}
            onViewTransaction={(t) => { haptic.trigger('light'); setShowTransactionDetail(t) }}
          />
        )}
        {activeTab === 'income' && (
          <TransactionsTab
            type="income"
            transactions={stats.monthlyTransactions.filter(t => t.type === 'income')}
            categoryBreakdown={stats.incomeByCategory}
            total={stats.income}
            hideAmounts={hideAmounts}
            onViewTransaction={(t) => { haptic.trigger('light'); setShowTransactionDetail(t) }}
            onAdd={() => openAddSheet('income')}
          />
        )}
        {activeTab === 'expenses' && (
          <TransactionsTab
            type="expense"
            transactions={stats.monthlyTransactions.filter(t => t.type === 'expense')}
            categoryBreakdown={stats.expensesByCategory}
            total={stats.expenses}
            hideAmounts={hideAmounts}
            onViewTransaction={(t) => { haptic.trigger('light'); setShowTransactionDetail(t) }}
            onAdd={() => openAddSheet('expense')}
          />
        )}
        {activeTab === 'analytics' && (
          <AnalyticsTab
            stats={stats}
            trendData={stats.trendData}
            hideAmounts={hideAmounts}
            profitStreak={stats.profitStreak}
          />
        )}
        {activeTab === 'guide' && <GuideTab />}
      </div>

      {/* FLOATING ACTION BUTTONS */}
      {activeTab !== 'guide' && (
        <div className="fixed bottom-20 lg:bottom-8 left-0 right-0 px-4 pb-4 pointer-events-none">
          <div className="max-w-4xl mx-auto flex gap-3 pointer-events-auto">
            <button
              onClick={() => openAddSheet('income')}
              className="flex-1 lg:flex-none lg:px-8 flex items-center justify-center gap-2 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 active:scale-[0.97] transition-all cursor-pointer"
            >
              <Plus className="w-5 h-5" />
              Add Income
            </button>
            <button
              onClick={() => openAddSheet('expense')}
              className="flex-1 lg:flex-none lg:px-8 flex items-center justify-center gap-2 py-4 rounded-2xl bg-gradient-to-r from-red-500 to-rose-600 text-white font-bold shadow-lg shadow-red-500/30 hover:shadow-red-500/50 active:scale-[0.97] transition-all cursor-pointer"
            >
              <Minus className="w-5 h-5" />
              Add Expense
            </button>
          </div>
        </div>
      )}

      {/* SHEETS */}
      <AddTransactionSheet
        isOpen={showAddSheet}
        onClose={() => setShowAddSheet(false)}
        type={addType}
        onAdd={(t) => {
          state.addTransaction(t)
          setShowAddSheet(false)
          haptic.trigger('heavy')
        }}
      />

      <TransactionDetailSheet
        transaction={showTransactionDetail}
        onClose={() => setShowTransactionDetail(null)}
        onDelete={(id) => {
          state.deleteTransaction(id)
          setShowTransactionDetail(null)
          haptic.trigger('medium')
        }}
        onUpdate={(id, updates) => {
          state.updateTransaction(id, updates)
          setShowTransactionDetail(null)
          haptic.trigger('medium')
        }}
      />

      <GoalSheet
        isOpen={showGoalSheet}
        onClose={() => setShowGoalSheet(false)}
        currentGoal={state.monthlyGoal}
        currentProfit={stats.profit}
        onSave={(goal) => {
          if (state.setMonthlyGoal) state.setMonthlyGoal(goal)
          setShowGoalSheet(false)
          haptic.trigger('heavy')
        }}
      />

      <MonthPickerSheet
        isOpen={showMonthPicker}
        onClose={() => setShowMonthPicker(false)}
        selectedMonth={selectedMonth}
        onSelect={(month) => {
          setSelectedMonth(month)
          setShowMonthPicker(false)
          haptic.trigger('light')
        }}
      />

      <SettingsSheet
        isOpen={showSettingsSheet}
        onClose={() => setShowSettingsSheet(false)}
        onClearData={() => {
          // Clear all transactions for selected month
          stats.monthlyTransactions.forEach(t => state.deleteTransaction(t.id))
          setShowSettingsSheet(false)
          haptic.trigger('heavy')
        }}
        onClearAll={() => {
          // Clear ALL transactions
          state.transactions.forEach(t => state.deleteTransaction(t.id))
          if (state.setMonthlyGoal) state.setMonthlyGoal(0)
          setShowSettingsSheet(false)
          haptic.trigger('heavy')
        }}
        onExport={() => {
          const data = JSON.stringify({ transactions: state.transactions, goal: state.monthlyGoal }, null, 2)
          const blob = new Blob([data], { type: 'application/json' })
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = `profit-tracker-backup-${new Date().toISOString().split('T')[0]}.json`
          a.click()
          haptic.trigger('heavy')
        }}
        onLoadDemo={() => {
          loadDemoData()
          haptic.trigger('heavy')
        }}
      />
    </div>
  )
})

// ============================================
// MINI TREND CHART COMPONENT
// ============================================

const MiniTrendChart = memo(function MiniTrendChart({
  data,
  hideAmounts
}: {
  data: { month: string; income: number; expenses: number; profit: number }[]
  hideAmounts: boolean
}) {
  const maxValue = Math.max(...data.map(d => Math.max(d.income, d.expenses)), 1)
  const lastIndex = data.length - 1

  return (
    <div className="space-y-2">
      {/* Reading guide */}
      <div className="flex justify-between text-[10px] text-white/30 mb-1 px-1">
        <span>← Oldest</span>
        <span>Latest →</span>
      </div>
      {data.map((month, i) => {
        const incomeWidth = (month.income / maxValue) * 100
        const expenseWidth = (month.expenses / maxValue) * 100
        const isProfit = month.profit >= 0
        const isLatest = i === lastIndex

        return (
          <div key={month.month} className={`group ${isLatest ? 'bg-white/5 -mx-2 px-2 py-1.5 rounded-lg' : ''}`}>
            <div className="flex items-center gap-3">
              <span className={`text-xs w-10 font-medium ${isLatest ? 'text-amber-400' : 'text-white/40'}`}>
                {getShortMonthName(month.month)}
                {isLatest && <span className="text-[8px] block text-amber-400/60">NOW</span>}
              </span>
              <div className="flex-1 space-y-1">
                {/* Income bar */}
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-500"
                    style={{ width: `${incomeWidth}%` }}
                  />
                </div>
                {/* Expense bar */}
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-red-500 to-red-400 rounded-full transition-all duration-500"
                    style={{ width: `${expenseWidth}%` }}
                  />
                </div>
              </div>
              <span className={`text-xs font-bold w-16 text-right ${isProfit ? 'text-emerald-400' : 'text-red-400'}`}>
                {hideAmounts ? '••••' : formatCompactCurrency(month.profit)}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
})

// ============================================
// OVERVIEW TAB
// ============================================

const OverviewTab = memo(function OverviewTab({
  stats,
  goalProgress,
  goalReached,
  monthlyGoal,
  hideAmounts,
  onSetGoal,
  onViewTransaction,
}: {
  stats: any
  goalProgress: number
  goalReached: boolean
  monthlyGoal?: number
  hideAmounts: boolean
  onSetGoal: () => void
  onViewTransaction: (t: Transaction) => void
}) {
  return (
    <div className="space-y-4">
      {/* HERO PROFIT CARD */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-sm border border-white/10 p-6 shadow-xl">
        {/* Background Glow */}
        <div className={`absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl ${
          stats.profit >= 0 ? 'bg-emerald-500/30' : 'bg-red-500/30'
        }`} />

        <div className="relative">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-white/50 text-sm font-medium mb-1">Net Profit</p>
              <div className={`text-4xl font-black ${stats.profit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {hideAmounts ? '••••••' : (
                  <>
                    {stats.profit >= 0 ? '+' : '-'}{CURRENCY}
                    <MobileAnimatedNumber value={Math.abs(stats.profit)} />
                  </>
                )}
              </div>
            </div>
            {/* Profit Change Badge */}
            {stats.profitChange !== 0 && (
              <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                stats.profitChange > 0
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : 'bg-red-500/20 text-red-400'
              }`}>
                {stats.profitChange > 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {Math.abs(Math.round(stats.profitChange))}%
              </div>
            )}
          </div>

          {/* Goal Progress */}
          {monthlyGoal && monthlyGoal > 0 ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/50">Goal: {hideAmounts ? '••••' : formatCurrency(monthlyGoal)}</span>
                <span className={`font-bold ${goalReached ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {Math.round(Math.min(goalProgress, 100))}%
                </span>
              </div>
              <div className="h-2.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ease-out ${
                    goalReached
                      ? 'bg-gradient-to-r from-emerald-500 to-emerald-400'
                      : 'bg-gradient-to-r from-amber-500 to-yellow-400'
                  }`}
                  style={{ width: `${Math.min(goalProgress, 100)}%` }}
                />
              </div>
              {goalReached && (
                <div className="flex items-center gap-2 mt-2">
                  <Trophy className="w-4 h-4 text-amber-400" />
                  <span className="text-amber-400 text-sm font-bold">Goal Reached!</span>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onSetGoal}
              className="flex items-center gap-2 mt-2 px-4 py-2 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400 text-sm font-bold active:scale-[0.98] transition-transform"
            >
              <Target className="w-4 h-4" />
              Set Monthly Goal
            </button>
          )}
        </div>
      </div>

      {/* STATS ROW */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          label="Income"
          value={stats.income}
          change={stats.incomeChange}
          type="income"
          hideAmounts={hideAmounts}
        />
        <StatCard
          label="Expenses"
          value={stats.expenses}
          change={stats.expenseChange}
          type="expense"
          hideAmounts={hideAmounts}
        />
      </div>

      {/* PROFIT MARGIN & STREAK */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 rounded-2xl bg-white/[0.05] backdrop-blur-sm border border-white/[0.08] group relative">
          <div className="flex items-center gap-2 mb-2">
            <Percent className="w-4 h-4 text-violet-400" />
            <span className="text-xs text-white/50 font-medium">Profit Margin</span>
            <div className="relative">
              <HelpCircle className="w-3.5 h-3.5 text-white/30 cursor-help" />
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-zinc-800 rounded-lg text-xs text-white/80 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 shadow-xl border border-white/10">
                <p className="font-medium text-white mb-1">What is Profit Margin?</p>
                <p>The % of income you keep as profit after expenses. Higher = better efficiency.</p>
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-zinc-800"></div>
              </div>
            </div>
          </div>
          <p className={`text-2xl font-black ${stats.profitMargin >= 0 ? 'text-violet-400' : 'text-red-400'}`}>
            {hideAmounts ? '••' : Math.round(stats.profitMargin)}%
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-white/[0.05] backdrop-blur-sm border border-white/[0.08] group relative">
          <div className="flex items-center gap-2 mb-2">
            <Flame className="w-4 h-4 text-orange-400" />
            <span className="text-xs text-white/50 font-medium">Profit Streak</span>
            <div className="relative">
              <HelpCircle className="w-3.5 h-3.5 text-white/30 cursor-help" />
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-zinc-800 rounded-lg text-xs text-white/80 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 shadow-xl border border-white/10">
                <p className="font-medium text-white mb-1">What is Profit Streak?</p>
                <p>Consecutive months where you made a profit. Keep it going!</p>
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-zinc-800"></div>
              </div>
            </div>
          </div>
          <p className="text-2xl font-black text-orange-400">
            {stats.profitStreak} <span className="text-sm font-medium text-white/30">months</span>
          </p>
        </div>
      </div>

      {/* MINI TREND CHART */}
      {stats.trendData && stats.trendData.length > 0 && (
        <div className="p-4 rounded-2xl bg-white/[0.05] backdrop-blur-sm border border-white/[0.08]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <LineChart className="w-4 h-4 text-amber-400" />
              <span className="text-sm font-semibold text-white">6-Month Trend</span>
            </div>
            <div className="flex items-center gap-4 text-xs text-white">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Income</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-500"></span> Expenses</span>
            </div>
          </div>
          <MiniTrendChart data={stats.trendData} hideAmounts={hideAmounts} />
        </div>
      )}

      {/* INSIGHTS */}
      {stats.insights.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-white/40 uppercase tracking-wider">Smart Insights</h3>
          {stats.insights.map((insight: any, i: number) => (
            <div
              key={i}
              className={`flex items-start gap-3 p-3 rounded-xl ${
                insight.type === 'success' ? 'bg-emerald-500/10 border border-emerald-500/20' :
                insight.type === 'warning' ? 'bg-amber-500/10 border border-amber-500/20' :
                'bg-blue-500/10 border border-blue-500/20'
              }`}
            >
              {insight.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" /> :
               insight.type === 'warning' ? <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" /> :
               <Lightbulb className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />}
              <p className="text-sm text-white/70">{insight.message}</p>
            </div>
          ))}
        </div>
      )}

      {/* RECENT TRANSACTIONS */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-white/40 uppercase tracking-wider">Recent Transactions</h3>
          <span className="text-xs text-white/30">{stats.totalTransactions} total</span>
        </div>

        {stats.monthlyTransactions.length === 0 ? (
          <EmptyState message="No transactions this month" />
        ) : (
          <div className="space-y-2">
            {stats.monthlyTransactions.slice(0, 5).map((t: Transaction) => (
              <TransactionRow
                key={t.id}
                transaction={t}
                hideAmounts={hideAmounts}
                onTap={() => onViewTransaction(t)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
})

// ============================================
// TRANSACTIONS TAB
// ============================================

const TransactionsTab = memo(function TransactionsTab({
  type,
  transactions,
  categoryBreakdown,
  total,
  hideAmounts,
  onViewTransaction,
  onAdd,
}: {
  type: 'income' | 'expense'
  transactions: Transaction[]
  categoryBreakdown: Record<string, number>
  total: number
  hideAmounts: boolean
  onViewTransaction: (t: Transaction) => void
  onAdd: () => void
}) {
  const isIncome = type === 'income'
  const categories = isIncome ? INCOME_CATEGORIES : EXPENSE_CATEGORIES
  const sortedCategories = Object.entries(categoryBreakdown)
    .sort((a, b) => b[1] - a[1])
    .map(([id, amount]) => ({ ...getCategoryInfo(id, type), amount }))

  return (
    <div className="space-y-4">
      {/* TOTAL CARD */}
      <div className={`p-5 rounded-2xl border ${
        isIncome
          ? 'bg-gradient-to-br from-emerald-500/15 to-emerald-500/5 border-emerald-500/20'
          : 'bg-gradient-to-br from-red-500/15 to-red-500/5 border-red-500/20'
      }`}>
        <p className={`text-sm font-medium mb-1 ${isIncome ? 'text-emerald-400' : 'text-red-400'}`}>
          Total {isIncome ? 'Income' : 'Expenses'}
        </p>
        <p className={`text-3xl font-black ${isIncome ? 'text-emerald-400' : 'text-red-400'}`}>
          {hideAmounts ? '••••••' : formatCurrency(total)}
        </p>
        <p className="text-xs text-white/40 mt-1">{transactions.length} transactions</p>
      </div>

      {/* CATEGORY BREAKDOWN */}
      {sortedCategories.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-white/40 uppercase tracking-wider">By Category</h3>
          <div className="space-y-2">
            {sortedCategories.map((cat) => {
              const Icon = cat.icon
              const colors = getCategoryColor(cat.color)
              const percent = total > 0 ? (cat.amount / total) * 100 : 0
              return (
                <div key={cat.id} className={`p-3 rounded-xl ${colors.bg} border ${colors.border}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Icon className={`w-4 h-4 ${colors.text}`} />
                      <span className="text-white text-sm font-medium">{cat.label}</span>
                    </div>
                    <span className={`font-bold ${colors.text}`}>
                      {hideAmounts ? '••••' : formatCurrency(cat.amount)}
                    </span>
                  </div>
                  <div className="h-1.5 bg-black/20 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${isIncome ? 'bg-emerald-500' : 'bg-red-500'}`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <p className="text-xs text-white/40 mt-1">{Math.round(percent)}% of total</p>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* TRANSACTIONS LIST */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-white/40 uppercase tracking-wider">All Transactions</h3>
        {transactions.length === 0 ? (
          <EmptyState
            message={`No ${type} this month`}
            action={
              <button
                onClick={onAdd}
                className={`mt-3 px-4 py-2 rounded-xl text-sm font-bold ${
                  isIncome
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-red-500/20 text-red-400 border border-red-500/30'
                }`}
              >
                Add {isIncome ? 'Income' : 'Expense'}
              </button>
            }
          />
        ) : (
          <div className="space-y-2">
            {transactions.map((t) => (
              <TransactionRow
                key={t.id}
                transaction={t}
                hideAmounts={hideAmounts}
                onTap={() => onViewTransaction(t)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
})

// ============================================
// ANALYTICS TAB
// ============================================

const AnalyticsTab = memo(function AnalyticsTab({
  stats,
  trendData,
  hideAmounts,
  profitStreak,
}: {
  stats: any
  trendData: any[]
  hideAmounts: boolean
  profitStreak: number
}) {
  const maxValue = Math.max(...trendData.map(d => Math.max(d.income, d.expenses)))

  return (
    <div className="space-y-4">
      {/* 6 MONTH TREND CHART */}
      <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
        <h3 className="text-sm font-bold text-white mb-4">6-Month Trend</h3>

        {/* Chart */}
        <div className="space-y-3">
          {trendData.map((month, i) => (
            <div key={month.month} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-white/50 w-12">{getShortMonthName(month.month)}</span>
                <span className={`font-bold ${month.profit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {hideAmounts ? '••••' : formatCompactCurrency(month.profit)}
                </span>
              </div>
              <div className="flex gap-1 h-4">
                {/* Income bar */}
                <div className="flex-1 h-full bg-white/5 rounded overflow-hidden">
                  <div
                    className="h-full bg-emerald-500/60 rounded"
                    style={{ width: maxValue > 0 ? `${(month.income / maxValue) * 100}%` : '0%' }}
                  />
                </div>
                {/* Expense bar */}
                <div className="flex-1 h-full bg-white/5 rounded overflow-hidden">
                  <div
                    className="h-full bg-red-500/60 rounded"
                    style={{ width: maxValue > 0 ? `${(month.expenses / maxValue) * 100}%` : '0%' }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-white/[0.06]">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-emerald-500/60" />
            <span className="text-xs text-white/50">Income</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-red-500/60" />
            <span className="text-xs text-white/50">Expenses</span>
          </div>
        </div>
      </div>

      {/* KEY METRICS */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 rounded-2xl bg-gradient-to-br from-violet-500/10 to-violet-500/5 border border-violet-500/20">
          <Calculator className="w-5 h-5 text-violet-400 mb-2" />
          <p className="text-xs text-white/50 mb-1">Avg Monthly Profit</p>
          <p className="text-xl font-black text-violet-400">
            {hideAmounts ? '••••' : formatCompactCurrency(
              trendData.reduce((sum, m) => sum + m.profit, 0) / trendData.length
            )}
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 border border-yellow-500/20">
          <Activity className="w-5 h-5 text-yellow-400 mb-2" />
          <p className="text-xs text-white/50 mb-1">Best Month</p>
          <p className="text-xl font-black text-yellow-400">
            {hideAmounts ? '••••' : formatCompactCurrency(
              Math.max(...trendData.map(m => m.profit))
            )}
          </p>
        </div>
      </div>

      {/* ACHIEVEMENTS */}
      <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
        <h3 className="text-sm font-bold text-white mb-3">Achievements</h3>
        <div className="space-y-3">
          <AchievementBadge
            icon={Flame}
            title={`${profitStreak} Month Streak`}
            description="Consecutive profitable months"
            unlocked={profitStreak >= 1}
            color="orange"
          />
          <AchievementBadge
            icon={Trophy}
            title="First $1K Profit"
            description="Hit $1,000 profit in a month"
            unlocked={trendData.some(m => m.profit >= 1000)}
            color="amber"
          />
          <AchievementBadge
            icon={Crown}
            title="Consistent Tracker"
            description="Track for 3+ months"
            unlocked={trendData.filter(m => m.income > 0 || m.expenses > 0).length >= 3}
            color="violet"
          />
        </div>
      </div>
    </div>
  )
})

// ============================================
// GUIDE TAB
// ============================================

const GuideTab = memo(function GuideTab() {
  const [expandedSection, setExpandedSection] = useState<string | null>('what')

  const sections = [
    {
      id: 'what',
      title: 'What is the Profit Tracker?',
      icon: HelpCircle,
      content: `The Profit Tracker is your personal financial dashboard designed specifically for entrepreneurs, freelancers, and business owners.

It helps you:
• Track all income from clients, sales, and other sources
• Monitor your expenses across different categories
• Calculate your real profit (income - expenses)
• Set monthly goals and track progress
• Visualize trends to see if your business is growing
• Make smarter financial decisions based on data`
    },
    {
      id: 'income',
      title: 'How to Add Income',
      icon: TrendingUp,
      content: `Adding income is simple:

1. Tap the green "Income" button at the bottom
2. Enter the amount you received
3. Add a description (e.g., "Client payment - John")
4. Select a category (Client, Sale, Freelance, etc.)
5. Choose the date
6. Tap "Add Income"

Categories help you understand WHERE your money comes from. If most income is from "Clients", you know your service business is strong!`
    },
    {
      id: 'expense',
      title: 'How to Add Expenses',
      icon: TrendingDown,
      content: `Track every business expense:

1. Tap the red "Expense" button at the bottom
2. Enter how much you spent
3. Describe what you paid for
4. Pick a category (Software, Ads, Tools, etc.)
5. Select the date
6. Tap "Add Expense"

Tracking expenses shows you where money is going. If "Ads" is your biggest expense, make sure they're bringing results!`
    },
    {
      id: 'dashboard',
      title: 'Understanding the Dashboard',
      icon: BarChart3,
      content: `The Overview tab shows everything at a glance:

• Net Profit - Your real earnings (income - expenses)
• Profit Change % - How you compare to last month
• Goal Progress - Visual bar showing progress to your target
• Income & Expenses - Quick totals with change indicators
• Profit Margin - What % of income you keep as profit
• Profit Streak - How many months in a row you've been profitable
• Smart Insights - AI-like tips about your finances
• Recent Transactions - Your latest entries`
    },
    {
      id: 'goal',
      title: 'Setting Monthly Goals',
      icon: Target,
      content: `Goals keep you motivated:

1. Tap "Set Monthly Goal" on the Overview
2. Enter your target profit for the month
3. Watch the progress bar fill as you earn

Tips for setting goals:
• Start realistic - base it on your average profit
• Increase by 10-20% each month as you grow
• Celebrate when you hit your goal!`
    },
    {
      id: 'analytics',
      title: 'Reading Your Analytics',
      icon: LineChart,
      content: `The Analytics tab helps you see the big picture:

• 6-Month Trend - Visual chart of income vs expenses
• Avg Monthly Profit - Your typical monthly earnings
• Best Month - Your highest profit month
• Achievements - Badges you unlock as you grow

Use this to:
• Spot seasonal patterns
• See if you're growing over time
• Identify your best performing months`
    },
    {
      id: 'tips',
      title: 'Pro Tips for Success',
      icon: Lightbulb,
      content: `Make the most of your tracker:

1. Track Daily - Add transactions as they happen
2. Be Specific - Write clear descriptions
3. Use Categories - Makes analysis meaningful
4. Review Weekly - Check your progress regularly
5. Export Backups - Protect your data
6. Set Realistic Goals - Then push to beat them

The most successful users track EVERYTHING - even small expenses add up!`
    },
    {
      id: 'reset',
      title: 'Resetting & Exporting Data',
      icon: RotateCcw,
      content: `Need a fresh start?

To Reset This Month:
Settings → Clear This Month's Data

To Reset Everything:
Settings → Clear All Data (this cannot be undone!)

To Export Backup:
Settings → Export Data
This downloads a JSON file with all your data.

We recommend exporting a backup before clearing any data!`
    },
  ]

  return (
    <div className="space-y-3">
      <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/15 to-yellow-500/5 border border-amber-500/20">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-black text-white">Getting Started Guide</h2>
            <p className="text-sm text-white/50">Learn how to use your Profit Tracker</p>
          </div>
        </div>
      </div>

      {sections.map((section) => {
        const Icon = section.icon
        const isExpanded = expandedSection === section.id
        return (
          <div
            key={section.id}
            className="rounded-2xl bg-white/[0.03] border border-white/[0.06] overflow-hidden"
          >
            <button
              onClick={() => setExpandedSection(isExpanded ? null : section.id)}
              className="w-full flex items-center gap-3 p-4 active:bg-white/5"
            >
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                <Icon className="w-5 h-5 text-amber-400" />
              </div>
              <span className="flex-1 text-left font-semibold text-white">{section.title}</span>
              <ChevronDown className={`w-5 h-5 text-white/30 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
            </button>
            {isExpanded && (
              <div className="px-4 pb-4">
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                  <p className="text-sm text-white/70 whitespace-pre-line leading-relaxed">
                    {section.content}
                  </p>
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
})

// ============================================
// REUSABLE COMPONENTS
// ============================================

const StatCard = memo(function StatCard({
  label,
  value,
  change,
  type,
  hideAmounts,
}: {
  label: string
  value: number
  change: number
  type: 'income' | 'expense'
  hideAmounts: boolean
}) {
  const isIncome = type === 'income'
  return (
    <div className={`p-4 rounded-2xl border ${
      isIncome
        ? 'bg-emerald-500/10 border-emerald-500/20'
        : 'bg-red-500/10 border-red-500/20'
    }`}>
      <div className="flex items-center gap-1.5 mb-1">
        {isIncome ? <ArrowUpRight className="w-4 h-4 text-emerald-400" /> : <ArrowDownRight className="w-4 h-4 text-red-400" />}
        <span className={`text-xs font-medium ${isIncome ? 'text-emerald-400' : 'text-red-400'}`}>{label}</span>
      </div>
      <p className={`text-xl font-black ${isIncome ? 'text-emerald-400' : 'text-red-400'}`}>
        {hideAmounts ? '••••••' : formatCurrency(value)}
      </p>
      {change !== 0 && (
        <p className={`text-xs mt-1 ${change > 0 ? 'text-emerald-400/70' : 'text-red-400/70'}`}>
          {change > 0 ? '+' : ''}{Math.round(change)}% from last month
        </p>
      )}
    </div>
  )
})

const TransactionRow = memo(function TransactionRow({
  transaction,
  hideAmounts,
  onTap,
}: {
  transaction: Transaction
  hideAmounts: boolean
  onTap: () => void
}) {
  const isIncome = transaction.type === 'income'
  const catInfo = getCategoryInfo(transaction.category || 'other', transaction.type)
  const colors = getCategoryColor(catInfo.color)
  const Icon = catInfo.icon

  return (
    <button
      onClick={onTap}
      className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] active:bg-white/[0.05] transition-all"
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colors.bg}`}>
        <Icon className={`w-5 h-5 ${colors.text}`} />
      </div>
      <div className="flex-1 text-left min-w-0">
        <p className="font-semibold text-white text-sm truncate">{transaction.description}</p>
        <p className="text-[11px] text-white/40">
          {new Date(transaction.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          {' · '}{catInfo.label}
        </p>
      </div>
      <span className={`text-base font-bold ${isIncome ? 'text-emerald-400' : 'text-red-400'}`}>
        {hideAmounts ? '••••' : (
          <>{isIncome ? '+' : '-'}{CURRENCY}{transaction.amount.toLocaleString()}</>
        )}
      </span>
    </button>
  )
})

const EmptyState = memo(function EmptyState({
  message,
  action,
}: {
  message: string
  action?: React.ReactNode
}) {
  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
        <PiggyBank className="w-8 h-8 text-white/20" />
      </div>
      <p className="text-white/40 mb-1">{message}</p>
      {action}
    </div>
  )
})

const AchievementBadge = memo(function AchievementBadge({
  icon: Icon,
  title,
  description,
  unlocked,
  color,
}: {
  icon: any
  title: string
  description: string
  unlocked: boolean
  color: string
}) {
  const colors = getCategoryColor(color)
  return (
    <div className={`flex items-center gap-3 p-3 rounded-xl ${
      unlocked ? colors.bg : 'bg-white/[0.02]'
    } border ${unlocked ? colors.border : 'border-white/[0.04]'}`}>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
        unlocked ? colors.bg : 'bg-white/5'
      }`}>
        <Icon className={`w-5 h-5 ${unlocked ? colors.text : 'text-white/20'}`} />
      </div>
      <div className="flex-1">
        <p className={`font-semibold text-sm ${unlocked ? 'text-white' : 'text-white/30'}`}>{title}</p>
        <p className={`text-xs ${unlocked ? 'text-white/50' : 'text-white/20'}`}>{description}</p>
      </div>
      {unlocked && <CheckCircle2 className={`w-5 h-5 ${colors.text}`} />}
    </div>
  )
})

// ============================================
// SHEETS / MODALS
// ============================================

const AddTransactionSheet = memo(function AddTransactionSheet({
  isOpen,
  onClose,
  type,
  onAdd,
}: {
  isOpen: boolean
  onClose: () => void
  type: 'income' | 'expense'
  onAdd: (t: Omit<Transaction, 'id'>) => void
}) {
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [category, setCategory] = useState('')
  const haptic = useHapticFeedback()

  const isIncome = type === 'income'
  const categories = isIncome ? INCOME_CATEGORIES : EXPENSE_CATEGORIES

  const handleSubmit = () => {
    const numAmount = parseFloat(amount)
    if (!numAmount || numAmount <= 0 || !description.trim()) return

    haptic.trigger('heavy')
    onAdd({
      type,
      amount: numAmount,
      description: description.trim(),
      date,
      category: category || 'other',
    })

    setAmount('')
    setDescription('')
    setDate(new Date().toISOString().split('T')[0])
    setCategory('')
  }

  const isValid = amount && parseFloat(amount) > 0 && description.trim()

  // Quick amounts
  const quickAmounts = isIncome ? [100, 500, 1000, 2500] : [10, 25, 50, 100]

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title={`Add ${isIncome ? 'Income' : 'Expense'}`}>
      <div className="px-4 pb-6 space-y-4">
        {/* Amount Input */}
        <div className={`p-5 rounded-2xl border ${
          isIncome ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-red-500/10 border-red-500/20'
        }`}>
          <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${
            isIncome ? 'text-emerald-400' : 'text-red-400'
          }`}>
            Amount
          </label>
          <div className="flex items-center gap-2">
            <span className={`text-4xl font-black ${isIncome ? 'text-emerald-400' : 'text-red-400'}`}>
              {CURRENCY}
            </span>
            <input
              type="number"
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              autoFocus
              className="flex-1 bg-transparent text-4xl font-black text-white placeholder-white/20 focus:outline-none"
            />
          </div>
        </div>

        {/* Quick Amounts */}
        <div className="flex gap-2">
          {quickAmounts.map((q) => (
            <button
              key={q}
              onClick={() => { haptic.trigger('light'); setAmount(q.toString()) }}
              className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${
                amount === q.toString()
                  ? isIncome ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
                  : 'bg-white/5 text-white/60 border border-white/10'
              }`}
            >
              {CURRENCY}{q}
            </button>
          ))}
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-bold text-white/40 uppercase tracking-wider mb-2">
            Description
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={isIncome ? 'e.g., Client payment from John' : 'e.g., Monthly Notion subscription'}
            className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-amber-500/50 text-base"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-xs font-bold text-white/40 uppercase tracking-wider mb-2">
            Category
          </label>
          <div className="grid grid-cols-4 gap-2">
            {categories.map((cat) => {
              const Icon = cat.icon
              const colors = getCategoryColor(cat.color)
              const selected = category === cat.id
              return (
                <button
                  key={cat.id}
                  onClick={() => { haptic.trigger('light'); setCategory(cat.id) }}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all ${
                    selected
                      ? `${colors.bg} ${colors.border} border`
                      : 'bg-white/[0.03] border border-white/[0.06]'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${selected ? colors.text : 'text-white/40'}`} />
                  <span className={`text-[10px] font-medium ${selected ? colors.text : 'text-white/40'}`}>
                    {cat.label}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Date */}
        <div>
          <label className="block text-xs font-bold text-white/40 uppercase tracking-wider mb-2">
            Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-amber-500/50"
          />
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={!isValid}
          className={`w-full py-4 rounded-2xl font-bold text-lg transition-all ${
            isValid
              ? isIncome
                ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/30 active:scale-[0.98]'
                : 'bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-lg shadow-red-500/30 active:scale-[0.98]'
              : 'bg-white/10 text-white/30 cursor-not-allowed'
          }`}
        >
          {isValid
            ? `Add ${CURRENCY}${parseFloat(amount).toLocaleString()} ${isIncome ? 'Income' : 'Expense'}`
            : `Add ${isIncome ? 'Income' : 'Expense'}`
          }
        </button>
      </div>
    </BottomSheet>
  )
})

const TransactionDetailSheet = memo(function TransactionDetailSheet({
  transaction,
  onClose,
  onDelete,
  onUpdate,
}: {
  transaction: Transaction | null
  onClose: () => void
  onDelete: (id: string) => void
  onUpdate: (id: string, updates: Partial<Transaction>) => void
}) {
  const [mode, setMode] = useState<'view' | 'edit' | 'delete'>('view')
  const [editAmount, setEditAmount] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [editDate, setEditDate] = useState('')
  const [editCategory, setEditCategory] = useState('')
  const haptic = useHapticFeedback()

  useEffect(() => {
    if (transaction) {
      setMode('view')
    }
  }, [transaction])

  if (!transaction) return null

  const isIncome = transaction.type === 'income'
  const categories = isIncome ? INCOME_CATEGORIES : EXPENSE_CATEGORIES
  const catInfo = getCategoryInfo(transaction.category || 'other', transaction.type)
  const colors = getCategoryColor(catInfo.color)

  const handleStartEdit = () => {
    haptic.trigger('light')
    setEditAmount(transaction.amount.toString())
    setEditDescription(transaction.description)
    setEditDate(transaction.date)
    setEditCategory(transaction.category || 'other')
    setMode('edit')
  }

  const handleSaveEdit = () => {
    const numAmount = parseFloat(editAmount)
    if (!numAmount || numAmount <= 0 || !editDescription.trim()) return

    haptic.trigger('medium')
    onUpdate(transaction.id, {
      amount: numAmount,
      description: editDescription.trim(),
      date: editDate,
      category: editCategory,
    })
  }

  const handleConfirmDelete = () => {
    haptic.trigger('heavy')
    onDelete(transaction.id)
  }

  return (
    <BottomSheet
      isOpen={!!transaction}
      onClose={() => { setMode('view'); onClose() }}
      title={mode === 'delete' ? 'Delete Transaction?' : mode === 'edit' ? 'Edit Transaction' : 'Transaction Details'}
    >
      <div className="px-4 pb-6">
        {mode === 'delete' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center gap-3">
              <AlertTriangle className="w-8 h-8 text-red-400 flex-shrink-0" />
              <div>
                <p className="font-bold text-white">This cannot be undone</p>
                <p className="text-sm text-white/50">The transaction will be permanently deleted.</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <p className="text-sm text-white/50 mb-1">{transaction.description}</p>
              <p className={`text-xl font-bold ${isIncome ? 'text-emerald-400' : 'text-red-400'}`}>
                {isIncome ? '+' : '-'}{CURRENCY}{transaction.amount.toLocaleString()}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setMode('view')}
                className="flex-1 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 py-4 rounded-xl bg-red-500 text-white font-bold"
              >
                Delete
              </button>
            </div>
          </div>
        )}

        {mode === 'edit' && (
          <div className="space-y-4">
            <div className={`p-4 rounded-2xl border ${
              isIncome ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-red-500/10 border-red-500/20'
            }`}>
              <label className={`block text-xs font-bold uppercase mb-2 ${
                isIncome ? 'text-emerald-400' : 'text-red-400'
              }`}>Amount</label>
              <div className="flex items-center gap-2">
                <span className={`text-2xl font-black ${isIncome ? 'text-emerald-400' : 'text-red-400'}`}>{CURRENCY}</span>
                <input
                  type="number"
                  value={editAmount}
                  onChange={(e) => setEditAmount(e.target.value)}
                  className="flex-1 bg-transparent text-2xl font-black text-white focus:outline-none"
                />
              </div>
            </div>

            <input
              type="text"
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none"
            />

            <div className="grid grid-cols-4 gap-2">
              {categories.map((cat) => {
                const Icon = cat.icon
                const catColors = getCategoryColor(cat.color)
                const selected = editCategory === cat.id
                return (
                  <button
                    key={cat.id}
                    onClick={() => setEditCategory(cat.id)}
                    className={`flex flex-col items-center gap-1 p-2 rounded-xl ${
                      selected ? `${catColors.bg} ${catColors.border} border` : 'bg-white/5 border border-white/10'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${selected ? catColors.text : 'text-white/40'}`} />
                    <span className={`text-[9px] ${selected ? catColors.text : 'text-white/40'}`}>{cat.label}</span>
                  </button>
                )
              })}
            </div>

            <input
              type="date"
              value={editDate}
              onChange={(e) => setEditDate(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none"
            />

            <div className="flex gap-3">
              <button onClick={() => setMode('view')} className="flex-1 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-bold">
                Cancel
              </button>
              <button onClick={handleSaveEdit} className="flex-1 py-4 rounded-xl bg-amber-500 text-black font-bold">
                Save
              </button>
            </div>
          </div>
        )}

        {mode === 'view' && (
          <>
            <div className={`text-center py-6 rounded-2xl mb-4 ${isIncome ? 'bg-emerald-500/10' : 'bg-red-500/10'}`}>
              <p className={`text-4xl font-black ${isIncome ? 'text-emerald-400' : 'text-red-400'}`}>
                {isIncome ? '+' : '-'}{CURRENCY}{transaction.amount.toLocaleString()}
              </p>
            </div>

            <div className="space-y-0 mb-6 rounded-xl bg-white/[0.02] border border-white/[0.06] overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
                <span className="text-white/50 text-sm">Description</span>
                <span className="text-white font-medium text-sm">{transaction.description}</span>
              </div>
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
                <span className="text-white/50 text-sm">Category</span>
                <span className={`font-medium text-sm ${colors.text}`}>{catInfo.label}</span>
              </div>
              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-white/50 text-sm">Date</span>
                <span className="text-white font-medium text-sm">
                  {new Date(transaction.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleStartEdit}
                className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-bold"
              >
                <Edit2 className="w-4 h-4" />
                Edit
              </button>
              <button
                onClick={() => { haptic.trigger('light'); setMode('delete') }}
                className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 font-bold"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </>
        )}
      </div>
    </BottomSheet>
  )
})

const GoalSheet = memo(function GoalSheet({
  isOpen,
  onClose,
  currentGoal,
  currentProfit,
  onSave,
}: {
  isOpen: boolean
  onClose: () => void
  currentGoal?: number
  currentProfit: number
  onSave: (goal: number) => void
}) {
  const [goal, setGoal] = useState(currentGoal?.toString() || '')
  const haptic = useHapticFeedback()

  const presets = [500, 1000, 2500, 5000, 10000, 25000]
  const suggestedGoal = Math.ceil((currentProfit * 1.2) / 100) * 100 // 20% more than current, rounded

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Set Monthly Goal">
      <div className="px-4 pb-6 space-y-4">
        <p className="text-sm text-white/50">
          Setting a profit goal helps you stay focused and motivated. Track your progress throughout the month.
        </p>

        <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20">
          <label className="block text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">
            Target Profit
          </label>
          <div className="flex items-center gap-2">
            <span className="text-4xl font-black text-amber-400">{CURRENCY}</span>
            <input
              type="number"
              inputMode="decimal"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="0"
              className="flex-1 bg-transparent text-4xl font-black text-white placeholder-white/20 focus:outline-none"
            />
          </div>
        </div>

        {suggestedGoal > 0 && (
          <button
            onClick={() => { haptic.trigger('light'); setGoal(suggestedGoal.toString()) }}
            className="w-full p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-left"
          >
            <p className="text-xs text-emerald-400 font-bold mb-1">Suggested Goal</p>
            <p className="text-white font-bold">{CURRENCY}{suggestedGoal.toLocaleString()}</p>
            <p className="text-xs text-white/50">20% more than your current profit</p>
          </button>
        )}

        <div>
          <p className="text-xs font-bold text-white/40 uppercase tracking-wider mb-2">Quick Select</p>
          <div className="grid grid-cols-3 gap-2">
            {presets.map((preset) => (
              <button
                key={preset}
                onClick={() => { haptic.trigger('light'); setGoal(preset.toString()) }}
                className={`py-2.5 rounded-xl text-sm font-bold transition-all ${
                  goal === preset.toString()
                    ? 'bg-amber-500 text-black'
                    : 'bg-white/5 text-white/60 border border-white/10'
                }`}
              >
                {CURRENCY}{preset.toLocaleString()}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => { if (goal && parseFloat(goal) > 0) { haptic.trigger('medium'); onSave(parseFloat(goal)) } }}
          disabled={!goal || parseFloat(goal) <= 0}
          className={`w-full py-4 rounded-2xl font-bold text-lg transition-all ${
            goal && parseFloat(goal) > 0
              ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-black shadow-lg shadow-amber-500/30 active:scale-[0.98]'
              : 'bg-white/10 text-white/30 cursor-not-allowed'
          }`}
        >
          {goal && parseFloat(goal) > 0 ? `Set Goal: ${CURRENCY}${parseFloat(goal).toLocaleString()}` : 'Enter a goal amount'}
        </button>

        {currentGoal && currentGoal > 0 && (
          <button
            onClick={() => { haptic.trigger('light'); onSave(0) }}
            className="w-full py-3 text-red-400 text-sm font-medium"
          >
            Remove Goal
          </button>
        )}
      </div>
    </BottomSheet>
  )
})

const MonthPickerSheet = memo(function MonthPickerSheet({
  isOpen,
  onClose,
  selectedMonth,
  onSelect,
}: {
  isOpen: boolean
  onClose: () => void
  selectedMonth: string
  onSelect: (month: string) => void
}) {
  const now = new Date()
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`

  const months = useMemo(() => {
    const result = []
    for (let i = 0; i < 12; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - i)
      result.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`)
    }
    return result
  }, [])

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Select Month to View">
      <div className="px-4 pb-6">
        {/* Current selection indicator */}
        <div className="mb-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
          <p className="text-xs text-amber-400 font-medium mb-1">Currently Viewing</p>
          <p className="text-white font-bold">{getMonthName(selectedMonth)}</p>
        </div>

        <p className="text-xs text-white/40 mb-3 font-medium">Select a different month:</p>

        <div className="space-y-2">
          {months.map((month, index) => {
            const isSelected = month === selectedMonth
            const isCurrent = month === currentMonth

            return (
              <button
                key={month}
                onClick={() => onSelect(month)}
                className={`w-full py-3.5 px-4 rounded-xl font-semibold transition-all flex items-center justify-between ${
                  isSelected
                    ? 'bg-amber-500 text-black'
                    : 'bg-white/5 text-white border border-white/10 hover:bg-white/10 active:bg-white/10'
                }`}
              >
                <span className="flex items-center gap-2">
                  {getMonthName(month)}
                  {isCurrent && !isSelected && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 font-medium">NOW</span>
                  )}
                </span>
                {isSelected && <Check className="w-5 h-5" />}
              </button>
            )
          })}
        </div>
      </div>
    </BottomSheet>
  )
})

const SettingsSheet = memo(function SettingsSheet({
  isOpen,
  onClose,
  onClearData,
  onClearAll,
  onExport,
  onLoadDemo,
}: {
  isOpen: boolean
  onClose: () => void
  onClearData: () => void
  onClearAll: () => void
  onExport: () => void
  onLoadDemo: () => void
}) {
  const [showClearConfirm, setShowClearConfirm] = useState<'month' | 'all' | null>(null)

  return (
    <BottomSheet isOpen={isOpen} onClose={() => { setShowClearConfirm(null); onClose() }} title="Settings">
      <div className="px-4 pb-6 space-y-3">
        {showClearConfirm ? (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20">
              <AlertTriangle className="w-8 h-8 text-red-400 mb-2" />
              <p className="font-bold text-white mb-1">
                {showClearConfirm === 'all' ? 'Clear ALL data?' : "Clear this month's data?"}
              </p>
              <p className="text-sm text-white/50">
                {showClearConfirm === 'all'
                  ? 'This will permanently delete all your transactions and goals. This cannot be undone.'
                  : 'This will delete all transactions for the current month.'}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowClearConfirm(null)}
                className="flex-1 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-bold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  showClearConfirm === 'all' ? onClearAll() : onClearData()
                  setShowClearConfirm(null)
                }}
                className="flex-1 py-4 rounded-xl bg-red-500 text-white font-bold"
              >
                Delete
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Load Demo Data - for video recording */}
            <button
              onClick={() => { onLoadDemo(); onClose() }}
              className="w-full flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-amber-500/20 to-yellow-500/10 border border-amber-500/30 active:bg-amber-500/30"
            >
              <Sparkles className="w-5 h-5 text-amber-400" />
              <div className="text-left">
                <p className="font-semibold text-amber-400">Load Demo Data</p>
                <p className="text-xs text-white/50">Fill tracker with sample data for preview</p>
              </div>
            </button>

            <button
              onClick={onExport}
              className="w-full flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10 active:bg-white/10"
            >
              <Download className="w-5 h-5 text-emerald-400" />
              <div className="text-left">
                <p className="font-semibold text-white">Export Data</p>
                <p className="text-xs text-white/50">Download a backup of all your data</p>
              </div>
            </button>

            <button
              onClick={() => setShowClearConfirm('month')}
              className="w-full flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10 active:bg-white/10"
            >
              <RotateCcw className="w-5 h-5 text-amber-400" />
              <div className="text-left">
                <p className="font-semibold text-white">Clear This Month</p>
                <p className="text-xs text-white/50">Reset only the current month's data</p>
              </div>
            </button>

            <button
              onClick={() => setShowClearConfirm('all')}
              className="w-full flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 active:bg-red-500/20"
            >
              <Trash2 className="w-5 h-5 text-red-400" />
              <div className="text-left">
                <p className="font-semibold text-red-400">Clear All Data</p>
                <p className="text-xs text-red-400/50">Start completely fresh</p>
              </div>
            </button>
          </>
        )}
      </div>
    </BottomSheet>
  )
})

export default MobileTracker
