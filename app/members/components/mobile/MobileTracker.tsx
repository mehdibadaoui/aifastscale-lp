'use client'

import { memo, useState, useMemo } from 'react'
import {
  Plus, Minus, TrendingUp, TrendingDown, DollarSign, Calendar,
  ChevronRight, Trash2, Edit2, X, Check, PiggyBank, Target,
  ArrowUpRight, ArrowDownRight, MoreVertical, Settings, AlertTriangle
} from 'lucide-react'
import { BottomSheet, MobileAnimatedNumber, useHapticFeedback } from './MobileNavigation'

// ============================================
// TYPES
// ============================================

interface Transaction {
  id: string
  type: 'income' | 'expense'
  amount: number
  description: string
  date: string
  category?: string
}

interface MobileTrackerProps {
  state: {
    transactions: Transaction[]
    addTransaction: (t: Omit<Transaction, 'id'>) => void
    deleteTransaction: (id: string) => void
    updateTransaction: (id: string, t: Partial<Transaction>) => void
    monthlyGoal?: number
    setMonthlyGoal?: (goal: number) => void
  }
}

// Currency symbol - consistent throughout
const CURRENCY = '$'

// ============================================
// MAIN COMPONENT
// ============================================

export const MobileTracker = memo(function MobileTracker({ state }: MobileTrackerProps) {
  const [showAddSheet, setShowAddSheet] = useState(false)
  const [addType, setAddType] = useState<'income' | 'expense'>('income')
  const [showTransactionDetail, setShowTransactionDetail] = useState<Transaction | null>(null)
  const [showGoalSheet, setShowGoalSheet] = useState(false)
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7))
  const haptic = useHapticFeedback()

  // Calculate totals
  const { totalIncome, totalExpenses, netProfit, monthlyTransactions } = useMemo(() => {
    const filtered = state.transactions.filter(t => t.date.startsWith(selectedMonth))
    const income = filtered.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0)
    const expenses = filtered.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0)
    return {
      totalIncome: income,
      totalExpenses: expenses,
      netProfit: income - expenses,
      monthlyTransactions: filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    }
  }, [state.transactions, selectedMonth])

  // Category breakdown
  const categoryBreakdown = useMemo(() => {
    const breakdown: Record<string, { income: number; expense: number }> = {}
    monthlyTransactions.forEach(t => {
      const cat = t.category || 'Uncategorized'
      if (!breakdown[cat]) breakdown[cat] = { income: 0, expense: 0 }
      if (t.type === 'income') breakdown[cat].income += t.amount
      else breakdown[cat].expense += t.amount
    })
    return Object.entries(breakdown)
      .map(([name, data]) => ({ name, ...data, total: data.income - data.expense }))
      .sort((a, b) => Math.abs(b.total) - Math.abs(a.total))
  }, [monthlyTransactions])

  // Goal progress
  const goalProgress = state.monthlyGoal && state.monthlyGoal > 0
    ? Math.min((netProfit / state.monthlyGoal) * 100, 100)
    : 0

  const openAddSheet = (type: 'income' | 'expense') => {
    haptic.trigger('medium')
    setAddType(type)
    setShowAddSheet(true)
  }

  return (
    <div
      className="min-h-screen pb-32 bg-[#09090b]"
      style={{ backgroundColor: '#09090b', minHeight: '100dvh', overscrollBehavior: 'none' }}
    >
      {/* HEADER */}
      <header className="sticky top-0 z-30 bg-[#09090b]/95 backdrop-blur-xl border-b border-white/[0.06] px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold text-white">Profit Tracker</h1>
          <div className="flex items-center gap-2">
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-white text-xs focus:outline-none focus:border-amber-500/50"
            />
            <button
              onClick={() => {
                haptic.trigger('light')
                setShowGoalSheet(true)
              }}
              className="p-2 rounded-lg bg-white/5 border border-white/10 active:bg-white/10 transition-colors"
            >
              <Target className="w-4 h-4 text-amber-400" />
            </button>
          </div>
        </div>
      </header>

      {/* STATS */}
      <section className="px-4 py-4 space-y-3">
        {/* Net Profit Card */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500/15 via-amber-500/5 to-transparent border border-amber-500/20 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-400 text-xs font-bold uppercase tracking-wider mb-0.5">Net Profit</p>
              <span className={`text-3xl font-black ${netProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {netProfit >= 0 ? '+' : '-'}{CURRENCY}<MobileAnimatedNumber value={Math.abs(netProfit)} />
              </span>
            </div>
            {state.monthlyGoal && state.monthlyGoal > 0 ? (
              <div className="text-right">
                <p className="text-xs text-white/50">Goal: {CURRENCY}{state.monthlyGoal.toLocaleString()}</p>
                <p className={`text-sm font-bold ${goalProgress >= 100 ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {Math.round(goalProgress)}%
                </p>
              </div>
            ) : (
              <button
                onClick={() => {
                  haptic.trigger('light')
                  setShowGoalSheet(true)
                }}
                className="px-3 py-1.5 rounded-lg bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-bold"
              >
                Set Goal
              </button>
            )}
          </div>
          {state.monthlyGoal && state.monthlyGoal > 0 && (
            <div className="mt-3 h-2 bg-black/30 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  goalProgress >= 100 ? 'bg-emerald-500' : 'bg-gradient-to-r from-amber-500 to-yellow-400'
                }`}
                style={{ width: `${Math.max(0, goalProgress)}%` }}
              />
            </div>
          )}
        </div>

        {/* Income / Expenses Row */}
        <div className="grid grid-cols-2 gap-2">
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <div className="flex items-center gap-1.5 mb-1">
              <ArrowUpRight className="w-4 h-4 text-emerald-400" />
              <span className="text-xs text-emerald-400 font-medium">Income</span>
            </div>
            <p className="text-xl font-black text-emerald-400">
              {CURRENCY}<MobileAnimatedNumber value={totalIncome} />
            </p>
          </div>
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20">
            <div className="flex items-center gap-1.5 mb-1">
              <ArrowDownRight className="w-4 h-4 text-red-400" />
              <span className="text-xs text-red-400 font-medium">Expenses</span>
            </div>
            <p className="text-xl font-black text-red-400">
              {CURRENCY}<MobileAnimatedNumber value={totalExpenses} />
            </p>
          </div>
        </div>

        {/* Category Breakdown - only show if there are transactions */}
        {categoryBreakdown.length > 0 && (
          <div className="rounded-xl bg-white/[0.02] border border-white/[0.06] p-3">
            <p className="text-xs font-bold text-white/40 uppercase tracking-wider mb-2">By Category</p>
            <div className="space-y-1.5">
              {categoryBreakdown.slice(0, 3).map((cat) => (
                <div key={cat.name} className="flex items-center justify-between">
                  <span className="text-sm text-white/70">{cat.name}</span>
                  <span className={`text-sm font-bold ${cat.total >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {cat.total >= 0 ? '+' : '-'}{CURRENCY}{Math.abs(cat.total).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* TRANSACTIONS LIST */}
      <section className="px-4">
        <h3 className="text-xs font-bold text-white/40 uppercase tracking-wider mb-3">
          Transactions ({monthlyTransactions.length})
        </h3>

        {monthlyTransactions.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
              <PiggyBank className="w-8 h-8 text-white/20" />
            </div>
            <p className="text-white/40 mb-1">No transactions yet</p>
            <p className="text-sm text-white/30">
              Tap below to add income or expenses
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {monthlyTransactions.map((transaction) => (
              <button
                key={transaction.id}
                onClick={() => {
                  haptic.trigger('light')
                  setShowTransactionDetail(transaction)
                }}
                className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] active:bg-white/[0.06] transition-all"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  transaction.type === 'income' ? 'bg-emerald-500/20' : 'bg-red-500/20'
                }`}>
                  {transaction.type === 'income' ? (
                    <ArrowUpRight className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <ArrowDownRight className="w-5 h-5 text-red-400" />
                  )}
                </div>

                <div className="flex-1 text-left min-w-0">
                  <p className="font-semibold text-white text-sm truncate">{transaction.description}</p>
                  <p className="text-[11px] text-white/40">
                    {new Date(transaction.date).toLocaleDateString('en-GB', {
                      month: 'short',
                      day: 'numeric'
                    })}
                    {transaction.category && ` · ${transaction.category}`}
                  </p>
                </div>

                <span className={`text-base font-bold ${
                  transaction.type === 'income' ? 'text-emerald-400' : 'text-red-400'
                }`}>
                  {transaction.type === 'income' ? '+' : '-'}{CURRENCY}{transaction.amount.toLocaleString()}
                </span>
              </button>
            ))}
          </div>
        )}
      </section>

      {/* BOTTOM ACTION BAR */}
      <div className="fixed bottom-20 left-0 right-0 px-4 pb-4 pt-6 bg-gradient-to-t from-[#09090b] via-[#09090b]/95 to-transparent">
        <div className="flex gap-2">
          <button
            onClick={() => openAddSheet('income')}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold shadow-lg shadow-emerald-500/25 active:scale-[0.98] transition-transform"
          >
            <Plus className="w-5 h-5" />
            Income
          </button>
          <button
            onClick={() => openAddSheet('expense')}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white font-bold shadow-lg shadow-red-500/25 active:scale-[0.98] transition-transform"
          >
            <Minus className="w-5 h-5" />
            Expense
          </button>
        </div>
      </div>

      {/* SHEETS */}
      <AddTransactionSheet
        isOpen={showAddSheet}
        onClose={() => setShowAddSheet(false)}
        type={addType}
        onAdd={(t) => {
          state.addTransaction(t)
          setShowAddSheet(false)
        }}
      />

      <TransactionDetailSheet
        transaction={showTransactionDetail}
        onClose={() => setShowTransactionDetail(null)}
        onDelete={(id) => {
          state.deleteTransaction(id)
          setShowTransactionDetail(null)
        }}
        onUpdate={(id, updates) => {
          state.updateTransaction(id, updates)
          setShowTransactionDetail(null)
        }}
      />

      <GoalSheet
        isOpen={showGoalSheet}
        onClose={() => setShowGoalSheet(false)}
        currentGoal={state.monthlyGoal}
        onSave={(goal) => {
          if (state.setMonthlyGoal) {
            state.setMonthlyGoal(goal)
          }
          setShowGoalSheet(false)
        }}
      />
    </div>
  )
})

// ============================================
// GOAL SHEET
// ============================================

const GoalSheet = memo(function GoalSheet({
  isOpen,
  onClose,
  currentGoal,
  onSave
}: {
  isOpen: boolean
  onClose: () => void
  currentGoal?: number
  onSave: (goal: number) => void
}) {
  const [goal, setGoal] = useState(currentGoal?.toString() || '')
  const haptic = useHapticFeedback()

  const handleSave = () => {
    const numGoal = parseFloat(goal)
    if (numGoal > 0) {
      haptic.trigger('medium')
      onSave(numGoal)
    }
  }

  const presets = [500, 1000, 2500, 5000, 10000]

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Monthly Goal">
      <div className="px-4 pb-6 space-y-4">
        <p className="text-sm text-white/50">
          Set a monthly profit goal to track your progress.
        </p>

        {/* Goal input */}
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20">
          <label className="block text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">
            Target Profit
          </label>
          <div className="flex items-center gap-2">
            <span className="text-3xl font-black text-amber-400">{CURRENCY}</span>
            <input
              type="number"
              inputMode="decimal"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="0"
              className="flex-1 bg-transparent text-3xl font-black text-white placeholder-white/20 focus:outline-none"
            />
          </div>
        </div>

        {/* Presets */}
        <div>
          <p className="text-xs font-bold text-white/40 uppercase tracking-wider mb-2">Quick Select</p>
          <div className="flex flex-wrap gap-2">
            {presets.map((preset) => (
              <button
                key={preset}
                onClick={() => {
                  haptic.trigger('light')
                  setGoal(preset.toString())
                }}
                className={`px-3 py-2 rounded-lg text-sm font-bold transition-all ${
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

        {/* Save button */}
        <button
          onClick={handleSave}
          disabled={!goal || parseFloat(goal) <= 0}
          className={`w-full py-4 rounded-xl font-bold text-base transition-all ${
            goal && parseFloat(goal) > 0
              ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-black shadow-lg shadow-amber-500/25 active:scale-[0.98]'
              : 'bg-white/10 text-white/30 cursor-not-allowed'
          }`}
        >
          {goal && parseFloat(goal) > 0
            ? `Set Goal: ${CURRENCY}${parseFloat(goal).toLocaleString()}`
            : 'Enter a goal amount'
          }
        </button>

        {/* Clear goal option */}
        {currentGoal && currentGoal > 0 && (
          <button
            onClick={() => {
              haptic.trigger('light')
              onSave(0)
            }}
            className="w-full py-3 text-red-400 text-sm font-medium"
          >
            Remove Goal
          </button>
        )}
      </div>
    </BottomSheet>
  )
})

// ============================================
// ADD TRANSACTION SHEET
// ============================================

const AddTransactionSheet = memo(function AddTransactionSheet({
  isOpen,
  onClose,
  type,
  onAdd
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

  const incomeCategories = ['Client', 'Sale', 'Consulting', 'Affiliate', 'Other']
  const expenseCategories = ['Software', 'Ads', 'Tools', 'Services', 'Other']
  const categories = type === 'income' ? incomeCategories : expenseCategories

  const handleSubmit = () => {
    const numAmount = parseFloat(amount)
    if (!numAmount || numAmount <= 0 || !description.trim()) return

    haptic.trigger('heavy')
    onAdd({
      type,
      amount: numAmount,
      description: description.trim(),
      date,
      category: category || undefined
    })

    // Reset form
    setAmount('')
    setDescription('')
    setDate(new Date().toISOString().split('T')[0])
    setCategory('')
  }

  const isValid = amount && parseFloat(amount) > 0 && description.trim()

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title={`Add ${type === 'income' ? 'Income' : 'Expense'}`}
    >
      <div className="px-4 pb-6 space-y-3">
        {/* Amount */}
        <div className={`p-4 rounded-2xl border ${
          type === 'income'
            ? 'bg-emerald-500/10 border-emerald-500/20'
            : 'bg-red-500/10 border-red-500/20'
        }`}>
          <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${
            type === 'income' ? 'text-emerald-400' : 'text-red-400'
          }`}>
            Amount
          </label>
          <div className="flex items-center gap-2">
            <span className={`text-3xl font-black ${
              type === 'income' ? 'text-emerald-400' : 'text-red-400'
            }`}>
              {CURRENCY}
            </span>
            <input
              type="number"
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              autoFocus
              className="flex-1 bg-transparent text-3xl font-black text-white placeholder-white/20 focus:outline-none"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-bold text-white/40 uppercase tracking-wider mb-1.5">
            Description
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={type === 'income' ? 'e.g., Client payment' : 'e.g., Software subscription'}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-amber-500/50"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-xs font-bold text-white/40 uppercase tracking-wider mb-1.5">
            Category
          </label>
          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  haptic.trigger('light')
                  setCategory(category === cat ? '' : cat)
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  category === cat
                    ? type === 'income'
                      ? 'bg-emerald-500 text-white'
                      : 'bg-red-500 text-white'
                    : 'bg-white/5 text-white/60 border border-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Date */}
        <div>
          <label className="block text-xs font-bold text-white/40 uppercase tracking-wider mb-1.5">
            Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-amber-500/50"
          />
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={!isValid}
          className={`w-full py-4 rounded-xl font-bold text-base transition-all mt-2 ${
            isValid
              ? type === 'income'
                ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/25 active:scale-[0.98]'
                : 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/25 active:scale-[0.98]'
              : 'bg-white/10 text-white/30 cursor-not-allowed'
          }`}
        >
          {isValid
            ? `Add ${CURRENCY}${parseFloat(amount).toLocaleString()} ${type === 'income' ? 'Income' : 'Expense'}`
            : `Add ${type === 'income' ? 'Income' : 'Expense'}`
          }
        </button>
      </div>
    </BottomSheet>
  )
})

// ============================================
// TRANSACTION DETAIL SHEET
// ============================================

const TransactionDetailSheet = memo(function TransactionDetailSheet({
  transaction,
  onClose,
  onDelete,
  onUpdate
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

  // Reset mode when transaction changes
  if (!transaction && mode !== 'view') {
    setMode('view')
  }

  if (!transaction) return null

  const categories = transaction.type === 'income'
    ? ['Client', 'Sale', 'Consulting', 'Affiliate', 'Other']
    : ['Software', 'Ads', 'Tools', 'Services', 'Other']

  const handleStartEdit = () => {
    haptic.trigger('light')
    setEditAmount(transaction.amount.toString())
    setEditDescription(transaction.description)
    setEditDate(transaction.date)
    setEditCategory(transaction.category || '')
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
      category: editCategory || undefined
    })
    setMode('view')
  }

  const handleConfirmDelete = () => {
    haptic.trigger('heavy')
    onDelete(transaction.id)
    setMode('view')
  }

  return (
    <BottomSheet
      isOpen={!!transaction}
      onClose={() => {
        setMode('view')
        onClose()
      }}
      title={mode === 'delete' ? 'Confirm Delete' : mode === 'edit' ? 'Edit Transaction' : 'Transaction'}
    >
      <div className="px-4 pb-6">
        {/* DELETE CONFIRMATION */}
        {mode === 'delete' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-red-500/10 border border-red-500/20">
              <AlertTriangle className="w-8 h-8 text-red-400 flex-shrink-0" />
              <div>
                <p className="font-bold text-white">Delete this transaction?</p>
                <p className="text-sm text-white/50">This action cannot be undone.</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <p className="text-sm text-white/50 mb-1">{transaction.description}</p>
              <p className={`text-xl font-bold ${
                transaction.type === 'income' ? 'text-emerald-400' : 'text-red-400'
              }`}>
                {transaction.type === 'income' ? '+' : '-'}{CURRENCY}{transaction.amount.toLocaleString()}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setMode('view')}
                className="flex-1 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-bold active:scale-[0.98] transition-transform"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 py-4 rounded-xl bg-red-500 text-white font-bold active:scale-[0.98] transition-transform"
              >
                Delete
              </button>
            </div>
          </div>
        )}

        {/* EDIT MODE */}
        {mode === 'edit' && (
          <div className="space-y-3">
            {/* Amount */}
            <div className={`p-4 rounded-2xl border ${
              transaction.type === 'income'
                ? 'bg-emerald-500/10 border-emerald-500/20'
                : 'bg-red-500/10 border-red-500/20'
            }`}>
              <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${
                transaction.type === 'income' ? 'text-emerald-400' : 'text-red-400'
              }`}>
                Amount
              </label>
              <div className="flex items-center gap-2">
                <span className={`text-2xl font-black ${
                  transaction.type === 'income' ? 'text-emerald-400' : 'text-red-400'
                }`}>
                  {CURRENCY}
                </span>
                <input
                  type="number"
                  inputMode="decimal"
                  value={editAmount}
                  onChange={(e) => setEditAmount(e.target.value)}
                  className="flex-1 bg-transparent text-2xl font-black text-white focus:outline-none"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-white/40 uppercase tracking-wider mb-1.5">
                Description
              </label>
              <input
                type="text"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-amber-500/50"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-bold text-white/40 uppercase tracking-wider mb-1.5">
                Category
              </label>
              <div className="flex flex-wrap gap-1.5">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      haptic.trigger('light')
                      setEditCategory(editCategory === cat ? '' : cat)
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      editCategory === cat
                        ? transaction.type === 'income'
                          ? 'bg-emerald-500 text-white'
                          : 'bg-red-500 text-white'
                        : 'bg-white/5 text-white/60 border border-white/10'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Date */}
            <div>
              <label className="block text-xs font-bold text-white/40 uppercase tracking-wider mb-1.5">
                Date
              </label>
              <input
                type="date"
                value={editDate}
                onChange={(e) => setEditDate(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-amber-500/50"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setMode('view')}
                className="flex-1 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-bold active:scale-[0.98] transition-transform"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="flex-1 py-4 rounded-xl bg-amber-500 text-black font-bold active:scale-[0.98] transition-transform"
              >
                Save
              </button>
            </div>
          </div>
        )}

        {/* VIEW MODE */}
        {mode === 'view' && (
          <>
            {/* Amount display */}
            <div className={`text-center py-6 rounded-2xl mb-4 ${
              transaction.type === 'income' ? 'bg-emerald-500/10' : 'bg-red-500/10'
            }`}>
              <p className={`text-4xl font-black ${
                transaction.type === 'income' ? 'text-emerald-400' : 'text-red-400'
              }`}>
                {transaction.type === 'income' ? '+' : '-'}{CURRENCY}{transaction.amount.toLocaleString()}
              </p>
            </div>

            {/* Details */}
            <div className="space-y-0 mb-6 rounded-xl bg-white/[0.02] border border-white/[0.06] overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
                <span className="text-white/50 text-sm">Description</span>
                <span className="text-white font-medium text-sm">{transaction.description}</span>
              </div>
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
                <span className="text-white/50 text-sm">Date</span>
                <span className="text-white font-medium text-sm">
                  {new Date(transaction.date).toLocaleDateString('en-GB', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
              {transaction.category && (
                <div className="flex items-center justify-between px-4 py-3">
                  <span className="text-white/50 text-sm">Category</span>
                  <span className="text-white font-medium text-sm">{transaction.category}</span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={handleStartEdit}
                className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-bold active:scale-[0.98] transition-transform"
              >
                <Edit2 className="w-4 h-4" />
                Edit
              </button>
              <button
                onClick={() => {
                  haptic.trigger('light')
                  setMode('delete')
                }}
                className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 font-bold active:scale-[0.98] transition-transform"
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

export default MobileTracker
