'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import {
  IncomeEntry, ExpenseEntry, MonthlyNote, MonthlyStats, TrackerView, MonthlyTrend,
  RecurringEntry, BudgetGoal, IncomeCategoryId, ExpenseCategoryId,
  INCOME_CATEGORIES, EXPENSE_CATEGORIES,
  generateId, getCurrentMonth, getPreviousMonth, getLastNMonths, detectCurrency, formatCurrency
} from './types'
import { getTranslations, detectLanguage, Language, TranslationKey } from './i18n'

const STORAGE_KEY = 'profit_tracker_v2'

interface StoredData {
  income: IncomeEntry[]
  expenses: ExpenseEntry[]
  recurring: RecurringEntry[]
  budgets: BudgetGoal[]
  notes: Record<string, MonthlyNote>
  mainCurrency: string
  language: string
}

// Custom localStorage hook with SSR safety
function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(initialValue)

  useEffect(() => {
    try {
      const item = localStorage.getItem(key)
      if (item) {
        setStoredValue(JSON.parse(item))
      }
    } catch (error) {
      console.error('Error reading from localStorage:', error)
    }
  }, [key])

  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    setStoredValue(prev => {
      const newValue = value instanceof Function ? value(prev) : value
      try {
        localStorage.setItem(key, JSON.stringify(newValue))
      } catch (error) {
        console.error('Error writing to localStorage:', error)
      }
      return newValue
    })
  }, [key])

  return [storedValue, setValue]
}

export function useProfitTracker() {
  // View state
  const [activeView, setActiveView] = useState<TrackerView>('dashboard')
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth())
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  // Data state
  const [data, setData] = useLocalStorage<StoredData>(STORAGE_KEY, {
    income: [],
    expenses: [],
    recurring: [],
    budgets: [],
    notes: {},
    mainCurrency: 'USD',
    language: 'en',
  })

  // UI state
  const [showAddModal, setShowAddModal] = useState<'income' | 'expense' | null>(null)
  const [editingEntry, setEditingEntry] = useState<IncomeEntry | ExpenseEntry | null>(null)
  const [undoEntry, setUndoEntry] = useState<{ type: 'income' | 'expense', entry: IncomeEntry | ExpenseEntry } | null>(null)
  const [showSettings, setShowSettings] = useState(false)
  const [showRecurringModal, setShowRecurringModal] = useState(false)
  const [showBudgetModal, setShowBudgetModal] = useState(false)
  const [showBackupReminder, setShowBackupReminder] = useState(false)

  // Initialize with detected language and currency
  useEffect(() => {
    const detectedCurrency = detectCurrency()
    const detectedLanguage = detectLanguage()

    setData(prev => ({
      ...prev,
      mainCurrency: prev.mainCurrency === 'USD' && !localStorage.getItem(STORAGE_KEY)
        ? detectedCurrency
        : prev.mainCurrency,
      language: prev.language === 'en' && !localStorage.getItem(STORAGE_KEY)
        ? detectedLanguage
        : prev.language,
    }))

    // Check if backup reminder should show (every 7 days)
    const lastBackup = localStorage.getItem('profit_tracker_last_backup')
    if (lastBackup) {
      const daysSince = (Date.now() - parseInt(lastBackup)) / (1000 * 60 * 60 * 24)
      if (daysSince > 7 && data.income.length + data.expenses.length > 5) {
        setShowBackupReminder(true)
      }
    } else if (data.income.length + data.expenses.length > 5) {
      setShowBackupReminder(true)
    }

    // Process recurring entries
    processRecurringEntries()

    setIsLoading(false)
  }, [])

  // Process recurring entries for current month
  const processRecurringEntries = useCallback(() => {
    const currentMonth = getCurrentMonth()
    const today = new Date()

    setData(prev => {
      let updated = false
      const newIncome = [...prev.income]
      const newExpenses = [...prev.expenses]
      const updatedRecurring = prev.recurring.map(rec => {
        if (!rec.isActive) return rec

        // Check if already processed this month
        if (rec.lastProcessed?.startsWith(currentMonth)) return rec

        // Check if the day has passed this month
        if (today.getDate() >= rec.dayOfMonth) {
          const entryDate = `${currentMonth}-${String(rec.dayOfMonth).padStart(2, '0')}`

          if (rec.type === 'income') {
            newIncome.push({
              id: generateId(),
              amount: rec.amount,
              currency: rec.currency,
              source: rec.description,
              category: rec.category as IncomeCategoryId,
              date: entryDate,
              createdAt: new Date().toISOString(),
              isRecurring: true,
              recurringId: rec.id,
            })
          } else {
            newExpenses.push({
              id: generateId(),
              amount: rec.amount,
              currency: rec.currency,
              reason: rec.description,
              category: rec.category as ExpenseCategoryId,
              date: entryDate,
              createdAt: new Date().toISOString(),
              isRecurring: true,
              recurringId: rec.id,
            })
          }
          updated = true
          return { ...rec, lastProcessed: currentMonth }
        }
        return rec
      })

      if (updated) {
        return { ...prev, income: newIncome, expenses: newExpenses, recurring: updatedRecurring }
      }
      return prev
    })
  }, [setData])

  // Get translations
  const t = useMemo(() => getTranslations(data.language), [data.language])

  // Filter entries by month
  const getEntriesForMonth = useCallback((entries: (IncomeEntry | ExpenseEntry)[], month: string) => {
    return entries.filter(entry => entry.date.startsWith(month))
  }, [])

  // Calculate stats for a month with category breakdown
  const calculateMonthStats = useCallback((month: string): MonthlyStats => {
    const monthIncome = data.income.filter(e => e.date.startsWith(month))
    const monthExpenses = data.expenses.filter(e => e.date.startsWith(month))

    const totalIncome = monthIncome.reduce((sum, e) => sum + e.amount, 0)
    const totalExpenses = monthExpenses.reduce((sum, e) => sum + e.amount, 0)
    const netProfit = totalIncome - totalExpenses
    const profitMargin = totalIncome > 0 ? (netProfit / totalIncome) * 100 : 0

    // Calculate by category
    const incomeByCategory = {} as Record<IncomeCategoryId, number>
    INCOME_CATEGORIES.forEach(cat => { incomeByCategory[cat.id] = 0 })
    monthIncome.forEach(e => {
      incomeByCategory[e.category] = (incomeByCategory[e.category] || 0) + e.amount
    })

    const expensesByCategory = {} as Record<ExpenseCategoryId, number>
    EXPENSE_CATEGORIES.forEach(cat => { expensesByCategory[cat.id] = 0 })
    monthExpenses.forEach(e => {
      expensesByCategory[e.category] = (expensesByCategory[e.category] || 0) + e.amount
    })

    // Compare with previous month
    const prevMonth = getPreviousMonth(month)
    const prevIncome = data.income.filter(e => e.date.startsWith(prevMonth))
    const prevExpenses = data.expenses.filter(e => e.date.startsWith(prevMonth))

    const prevTotalIncome = prevIncome.reduce((sum, e) => sum + e.amount, 0)
    const prevTotalExpenses = prevExpenses.reduce((sum, e) => sum + e.amount, 0)
    const prevNetProfit = prevTotalIncome - prevTotalExpenses

    const incomeChange = prevTotalIncome > 0 ? ((totalIncome - prevTotalIncome) / prevTotalIncome) * 100 : 0
    const expenseChange = prevTotalExpenses > 0 ? ((totalExpenses - prevTotalExpenses) / prevTotalExpenses) * 100 : 0
    const profitChange = prevNetProfit !== 0 ? ((netProfit - prevNetProfit) / Math.abs(prevNetProfit)) * 100 : 0

    return {
      totalIncome,
      totalExpenses,
      netProfit,
      profitMargin,
      incomeChange,
      expenseChange,
      profitChange,
      incomeByCategory,
      expensesByCategory,
    }
  }, [data.income, data.expenses])

  // Current month stats
  const currentStats = useMemo(() => calculateMonthStats(selectedMonth), [calculateMonthStats, selectedMonth])

  // Previous month stats
  const previousStats = useMemo(() => calculateMonthStats(getPreviousMonth(selectedMonth)), [calculateMonthStats, selectedMonth])

  // Trend data for last 6 months
  const trendData = useMemo((): MonthlyTrend[] => {
    const months = getLastNMonths(6).reverse()
    return months.map(month => {
      const income = data.income.filter(e => e.date.startsWith(month)).reduce((s, e) => s + e.amount, 0)
      const expenses = data.expenses.filter(e => e.date.startsWith(month)).reduce((s, e) => s + e.amount, 0)
      return { month, income, expenses, profit: income - expenses }
    })
  }, [data.income, data.expenses])

  // Budget alerts
  const budgetAlerts = useMemo(() => {
    const alerts: { category: string; spent: number; limit: number; percent: number }[] = []
    data.budgets.forEach(budget => {
      if (budget.category === 'total') {
        const spent = currentStats.totalExpenses
        const percent = (spent / budget.monthlyLimit) * 100
        if (percent >= 80) {
          alerts.push({ category: 'Total', spent, limit: budget.monthlyLimit, percent })
        }
      } else {
        const spent = currentStats.expensesByCategory[budget.category] || 0
        const percent = (spent / budget.monthlyLimit) * 100
        if (percent >= 80) {
          const cat = EXPENSE_CATEGORIES.find(c => c.id === budget.category)
          alerts.push({ category: cat?.label || budget.category, spent, limit: budget.monthlyLimit, percent })
        }
      }
    })
    return alerts.sort((a, b) => b.percent - a.percent)
  }, [data.budgets, currentStats])

  // Generate smart insights with categories
  const insights = useMemo(() => {
    const result: string[] = []
    const { totalIncome, totalExpenses, netProfit, incomeChange, expenseChange, profitMargin, expensesByCategory, incomeByCategory } = currentStats

    // No data yet
    if (totalIncome === 0 && totalExpenses === 0) {
      return [t.messages.noEntries]
    }

    // Check if we have previous month data
    const hasPrevData = previousStats.totalIncome > 0 || previousStats.totalExpenses > 0

    // Find top expense category
    const topExpenseCategory = Object.entries(expensesByCategory)
      .filter(([_, amount]) => amount > 0)
      .sort((a, b) => b[1] - a[1])[0]

    if (topExpenseCategory && totalExpenses > 0) {
      const cat = EXPENSE_CATEGORIES.find(c => c.id === topExpenseCategory[0])
      const percent = Math.round((topExpenseCategory[1] / totalExpenses) * 100)
      if (percent >= 30) {
        result.push(`${cat?.label || topExpenseCategory[0]} is your biggest expense (${percent}% of total).`)
      }
    }

    // Find top income category
    const topIncomeCategory = Object.entries(incomeByCategory)
      .filter(([_, amount]) => amount > 0)
      .sort((a, b) => b[1] - a[1])[0]

    if (topIncomeCategory && totalIncome > 0) {
      const cat = INCOME_CATEGORIES.find(c => c.id === topIncomeCategory[0])
      const percent = Math.round((topIncomeCategory[1] / totalIncome) * 100)
      if (percent >= 50) {
        result.push(`${cat?.label || topIncomeCategory[0]} drives ${percent}% of your income.`)
      }
    }

    if (!hasPrevData) {
      result.push(t.insights.noComparison)
    } else {
      // Income insights
      if (incomeChange > 10) {
        result.push(t.insights.incomeUp)
      } else if (incomeChange < -10) {
        result.push(t.insights.incomeDown)
      }

      // Expense insights
      if (expenseChange > 15) {
        result.push(t.insights.expensesUp)
      } else if (expenseChange < -10) {
        result.push(t.insights.expensesDown)
      }

      // Profit insights
      if (currentStats.profitChange > 10) {
        result.push(t.insights.profitUp)
      } else if (currentStats.profitChange < -10) {
        result.push(t.insights.profitDown)
      }
    }

    // Margin insights
    if (profitMargin > 30) {
      result.push(t.insights.goodMargin)
    } else if (profitMargin < 10 && profitMargin > 0) {
      result.push(t.insights.lowMargin)
    }

    // Budget warnings
    budgetAlerts.forEach(alert => {
      if (alert.percent >= 100) {
        result.push(`Warning: ${alert.category} exceeded budget by ${Math.round(alert.percent - 100)}%`)
      } else if (alert.percent >= 90) {
        result.push(`${alert.category} is at ${Math.round(alert.percent)}% of budget limit.`)
      }
    })

    return result.length > 0 ? result : [t.messages.firstMonth]
  }, [currentStats, previousStats, budgetAlerts, t])

  // Get dynamic message for dashboard
  const dashboardMessage = useMemo(() => {
    const { totalIncome, totalExpenses, netProfit, incomeChange, expenseChange } = currentStats

    if (totalIncome === 0 && totalExpenses === 0) {
      return t.messages.firstMonth
    }

    if (netProfit > 0) {
      if (incomeChange > expenseChange && incomeChange > 10) {
        return t.messages.growing
      }
      if (expenseChange > incomeChange && expenseChange > 15) {
        return t.messages.shrinking
      }
      return t.messages.profitable
    }

    if (netProfit === 0) {
      return t.messages.breakeven
    }

    if (netProfit < 0 && expenseChange > 20) {
      return t.messages.warning
    }

    return t.messages.negative
  }, [currentStats, t])

  // Search/filter entries
  const filteredIncome = useMemo(() => {
    if (!searchQuery) return data.income.filter(e => e.date.startsWith(selectedMonth))
    const query = searchQuery.toLowerCase()
    return data.income.filter(e =>
      e.date.startsWith(selectedMonth) &&
      (e.source.toLowerCase().includes(query) ||
        e.amount.toString().includes(query) ||
        INCOME_CATEGORIES.find(c => c.id === e.category)?.label.toLowerCase().includes(query))
    )
  }, [data.income, selectedMonth, searchQuery])

  const filteredExpenses = useMemo(() => {
    if (!searchQuery) return data.expenses.filter(e => e.date.startsWith(selectedMonth))
    const query = searchQuery.toLowerCase()
    return data.expenses.filter(e =>
      e.date.startsWith(selectedMonth) &&
      (e.reason.toLowerCase().includes(query) ||
        e.amount.toString().includes(query) ||
        EXPENSE_CATEGORIES.find(c => c.id === e.category)?.label.toLowerCase().includes(query))
    )
  }, [data.expenses, selectedMonth, searchQuery])

  // Add income entry
  const addIncome = useCallback((entry: Omit<IncomeEntry, 'id' | 'createdAt'>) => {
    const newEntry: IncomeEntry = {
      ...entry,
      id: generateId(),
      createdAt: new Date().toISOString(),
    }
    setData(prev => ({
      ...prev,
      income: [...prev.income, newEntry],
    }))
    setShowAddModal(null)
  }, [setData])

  // Add expense entry
  const addExpense = useCallback((entry: Omit<ExpenseEntry, 'id' | 'createdAt'>) => {
    const newEntry: ExpenseEntry = {
      ...entry,
      id: generateId(),
      createdAt: new Date().toISOString(),
    }
    setData(prev => ({
      ...prev,
      expenses: [...prev.expenses, newEntry],
    }))
    setShowAddModal(null)
  }, [setData])

  // Update income entry
  const updateIncome = useCallback((id: string, updates: Partial<IncomeEntry>) => {
    setData(prev => ({
      ...prev,
      income: prev.income.map(e => e.id === id ? { ...e, ...updates } : e),
    }))
    setEditingEntry(null)
  }, [setData])

  // Update expense entry
  const updateExpense = useCallback((id: string, updates: Partial<ExpenseEntry>) => {
    setData(prev => ({
      ...prev,
      expenses: prev.expenses.map(e => e.id === id ? { ...e, ...updates } : e),
    }))
    setEditingEntry(null)
  }, [setData])

  // Delete income entry (with undo)
  const deleteIncome = useCallback((id: string) => {
    const entry = data.income.find(e => e.id === id)
    if (entry) {
      setUndoEntry({ type: 'income', entry })
      setData(prev => ({
        ...prev,
        income: prev.income.filter(e => e.id !== id),
      }))
      setTimeout(() => setUndoEntry(null), 5000)
    }
  }, [data.income, setData])

  // Delete expense entry (with undo)
  const deleteExpense = useCallback((id: string) => {
    const entry = data.expenses.find(e => e.id === id)
    if (entry) {
      setUndoEntry({ type: 'expense', entry })
      setData(prev => ({
        ...prev,
        expenses: prev.expenses.filter(e => e.id !== id),
      }))
      setTimeout(() => setUndoEntry(null), 5000)
    }
  }, [data.expenses, setData])

  // Undo delete
  const handleUndo = useCallback(() => {
    if (undoEntry) {
      if (undoEntry.type === 'income') {
        setData(prev => ({
          ...prev,
          income: [...prev.income, undoEntry.entry as IncomeEntry],
        }))
      } else {
        setData(prev => ({
          ...prev,
          expenses: [...prev.expenses, undoEntry.entry as ExpenseEntry],
        }))
      }
      setUndoEntry(null)
    }
  }, [undoEntry, setData])

  // Add recurring entry
  const addRecurring = useCallback((entry: Omit<RecurringEntry, 'id' | 'createdAt'>) => {
    const newEntry: RecurringEntry = {
      ...entry,
      id: generateId(),
      createdAt: new Date().toISOString(),
    }
    setData(prev => ({
      ...prev,
      recurring: [...prev.recurring, newEntry],
    }))
    setShowRecurringModal(false)
  }, [setData])

  // Delete recurring entry
  const deleteRecurring = useCallback((id: string) => {
    setData(prev => ({
      ...prev,
      recurring: prev.recurring.filter(e => e.id !== id),
    }))
  }, [setData])

  // Toggle recurring entry active state
  const toggleRecurring = useCallback((id: string) => {
    setData(prev => ({
      ...prev,
      recurring: prev.recurring.map(e => e.id === id ? { ...e, isActive: !e.isActive } : e),
    }))
  }, [setData])

  // Add budget goal
  const addBudget = useCallback((budget: Omit<BudgetGoal, 'id' | 'createdAt'>) => {
    const newBudget: BudgetGoal = {
      ...budget,
      id: generateId(),
      createdAt: new Date().toISOString(),
    }
    setData(prev => ({
      ...prev,
      budgets: [...prev.budgets.filter(b => b.category !== budget.category), newBudget],
    }))
    setShowBudgetModal(false)
  }, [setData])

  // Delete budget
  const deleteBudget = useCallback((id: string) => {
    setData(prev => ({
      ...prev,
      budgets: prev.budgets.filter(b => b.id !== id),
    }))
  }, [setData])

  // Update monthly note
  const updateNote = useCallback((field: keyof MonthlyNote, value: string) => {
    setData(prev => ({
      ...prev,
      notes: {
        ...prev.notes,
        [selectedMonth]: {
          ...prev.notes[selectedMonth],
          month: selectedMonth,
          [field]: value,
          updatedAt: new Date().toISOString(),
        },
      },
    }))
  }, [selectedMonth, setData])

  // Change currency
  const setCurrency = useCallback((currency: string) => {
    setData(prev => ({ ...prev, mainCurrency: currency }))
  }, [setData])

  // Change language
  const setLanguage = useCallback((language: string) => {
    setData(prev => ({ ...prev, language }))
  }, [setData])

  // Get all available months (for month selector)
  const availableMonths = useMemo(() => {
    const months = new Set<string>()
    months.add(getCurrentMonth()) // Always include current month

    data.income.forEach(e => months.add(e.date.substring(0, 7)))
    data.expenses.forEach(e => months.add(e.date.substring(0, 7)))

    return Array.from(months).sort().reverse()
  }, [data.income, data.expenses])

  // Export to CSV
  const exportCSV = useCallback(() => {
    const monthIncome = data.income.filter(e => e.date.startsWith(selectedMonth))
    const monthExpenses = data.expenses.filter(e => e.date.startsWith(selectedMonth))

    let csv = 'Type,Amount,Currency,Category,Description,Date\n'

    monthIncome.forEach(e => {
      const cat = INCOME_CATEGORIES.find(c => c.id === e.category)?.label || e.category
      csv += `Income,${e.amount},${e.currency},"${cat}","${e.source}",${e.date}\n`
    })

    monthExpenses.forEach(e => {
      const cat = EXPENSE_CATEGORIES.find(c => c.id === e.category)?.label || e.category
      csv += `Expense,${e.amount},${e.currency},"${cat}","${e.reason}",${e.date}\n`
    })

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `profit-tracker-${selectedMonth}.csv`
    a.click()
    URL.revokeObjectURL(url)
    localStorage.setItem('profit_tracker_last_backup', Date.now().toString())
    setShowBackupReminder(false)
  }, [data.income, data.expenses, selectedMonth])

  // Export full backup
  const exportBackup = useCallback(() => {
    const backup = JSON.stringify(data, null, 2)
    const blob = new Blob([backup], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `profit-tracker-backup-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
    localStorage.setItem('profit_tracker_last_backup', Date.now().toString())
    setShowBackupReminder(false)
  }, [data])

  // Import backup
  const importBackup = useCallback((jsonString: string) => {
    try {
      const imported = JSON.parse(jsonString) as StoredData
      if (imported.income && imported.expenses) {
        setData(imported)
        return true
      }
    } catch (e) {
      console.error('Import error:', e)
    }
    return false
  }, [setData])

  // Format amount with currency
  const formatAmount = useCallback((amount: number, compact = false) => {
    return formatCurrency(amount, data.mainCurrency, compact)
  }, [data.mainCurrency])

  // Dismiss backup reminder
  const dismissBackupReminder = useCallback(() => {
    setShowBackupReminder(false)
    localStorage.setItem('profit_tracker_last_backup', Date.now().toString())
  }, [])

  return {
    // State
    isLoading,
    activeView,
    selectedMonth,
    data,
    currentStats,
    previousStats,
    trendData,
    insights,
    dashboardMessage,
    availableMonths,
    undoEntry,
    showAddModal,
    editingEntry,
    showSettings,
    showRecurringModal,
    showBudgetModal,
    showBackupReminder,
    searchQuery,
    filteredIncome,
    filteredExpenses,
    budgetAlerts,

    // Translations
    t,
    language: data.language as Language,
    currency: data.mainCurrency,

    // Actions
    setActiveView,
    setSelectedMonth,
    setShowAddModal,
    setEditingEntry,
    setShowSettings,
    setShowRecurringModal,
    setShowBudgetModal,
    setSearchQuery,
    addIncome,
    addExpense,
    updateIncome,
    updateExpense,
    deleteIncome,
    deleteExpense,
    handleUndo,
    addRecurring,
    deleteRecurring,
    toggleRecurring,
    addBudget,
    deleteBudget,
    updateNote,
    setCurrency,
    setLanguage,
    exportCSV,
    exportBackup,
    importBackup,
    formatAmount,
    getEntriesForMonth,
    dismissBackupReminder,
  }
}

export type ProfitTrackerState = ReturnType<typeof useProfitTracker>
