'use client'

import { memo, useState, useMemo } from 'react'
import {
  Plus, Minus, TrendingUp, TrendingDown, DollarSign, Calendar,
  ChevronRight, Trash2, Edit2, X, Check, PiggyBank, Target,
  ArrowUpRight, ArrowDownRight, MoreVertical
} from 'lucide-react'
import { BottomSheet, TouchButton, MobileAnimatedNumber, useHapticFeedback } from './MobileNavigation'

// ============================================
// MOBILE PROFIT TRACKER
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

export const MobileTracker = memo(function MobileTracker({ state }: MobileTrackerProps) {
  const [showAddSheet, setShowAddSheet] = useState(false)
  const [addType, setAddType] = useState<'income' | 'expense'>('income')
  const [showTransactionDetail, setShowTransactionDetail] = useState<Transaction | null>(null)
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

  // Goal progress
  const goalProgress = state.monthlyGoal ? Math.min((netProfit / state.monthlyGoal) * 100, 100) : 0

  const openAddSheet = (type: 'income' | 'expense') => {
    haptic.trigger('medium')
    setAddType(type)
    setShowAddSheet(true)
  }

  return (
    <div className="min-h-screen pb-32">
      {/* HEADER STATS */}
      <div className="px-4 py-6 space-y-4">
        {/* Month selector */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-black text-white">Profit Tracker</h1>
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-500/50"
          />
        </div>

        {/* Net Profit Card */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500/15 via-amber-500/5 to-transparent border border-amber-500/20 p-5">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-500/30 rounded-full blur-3xl" />
          <div className="relative">
            <p className="text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
              Net Profit
            </p>
            <div className="flex items-baseline gap-2">
              <span className={`text-4xl font-black ${netProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {netProfit >= 0 ? '+' : ''}$<MobileAnimatedNumber value={Math.abs(netProfit)} />
              </span>
            </div>

            {/* Goal progress */}
            {state.monthlyGoal && state.monthlyGoal > 0 && (
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-white/50">Monthly Goal</span>
                  <span className="text-amber-400 font-bold">
                    {Math.round(goalProgress)}% of ${state.monthlyGoal.toLocaleString()}
                  </span>
                </div>
                <div className="h-2 bg-black/30 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ${
                      goalProgress >= 100 ? 'bg-emerald-500' : 'bg-gradient-to-r from-amber-500 to-yellow-400'
                    }`}
                    style={{ width: `${goalProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Income / Expenses Row */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
            <div className="flex items-center gap-2 mb-2">
              <ArrowUpRight className="w-5 h-5 text-emerald-400" />
              <span className="text-sm text-emerald-400 font-medium">Income</span>
            </div>
            <p className="text-2xl font-black text-emerald-400">
              $<MobileAnimatedNumber value={totalIncome} />
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20">
            <div className="flex items-center gap-2 mb-2">
              <ArrowDownRight className="w-5 h-5 text-red-400" />
              <span className="text-sm text-red-400 font-medium">Expenses</span>
            </div>
            <p className="text-2xl font-black text-red-400">
              $<MobileAnimatedNumber value={totalExpenses} />
            </p>
          </div>
        </div>
      </div>

      {/* TRANSACTIONS LIST */}
      <div className="px-4">
        <h3 className="text-sm font-bold text-white/50 uppercase tracking-wider mb-3">
          Transactions ({monthlyTransactions.length})
        </h3>

        {monthlyTransactions.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center mx-auto mb-4">
              <PiggyBank className="w-10 h-10 text-white/20" />
            </div>
            <p className="text-white/40 mb-2">No transactions yet</p>
            <p className="text-sm text-white/30">
              Tap the buttons below to add income or expenses
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
                className="w-full flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10 active:bg-white/10 transition-all"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  transaction.type === 'income' ? 'bg-emerald-500/20' : 'bg-red-500/20'
                }`}>
                  {transaction.type === 'income' ? (
                    <ArrowUpRight className="w-6 h-6 text-emerald-400" />
                  ) : (
                    <ArrowDownRight className="w-6 h-6 text-red-400" />
                  )}
                </div>

                <div className="flex-1 text-left min-w-0">
                  <p className="font-bold text-white truncate">{transaction.description}</p>
                  <p className="text-xs text-white/40">
                    {new Date(transaction.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric'
                    })}
                    {transaction.category && ` • ${transaction.category}`}
                  </p>
                </div>

                <span className={`text-lg font-bold ${
                  transaction.type === 'income' ? 'text-emerald-400' : 'text-red-400'
                }`}>
                  {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toLocaleString()}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* BOTTOM ACTION BAR */}
      <div className="fixed bottom-20 left-0 right-0 px-4 pb-4 pt-2 bg-gradient-to-t from-zinc-950 via-zinc-950/95 to-transparent">
        <div className="flex gap-3">
          <button
            onClick={() => openAddSheet('income')}
            className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold shadow-lg shadow-emerald-500/30 active:scale-[0.98] transition-transform"
          >
            <Plus className="w-5 h-5" />
            Income
          </button>
          <button
            onClick={() => openAddSheet('expense')}
            className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl bg-gradient-to-r from-red-500 to-red-600 text-white font-bold shadow-lg shadow-red-500/30 active:scale-[0.98] transition-transform"
          >
            <Minus className="w-5 h-5" />
            Expense
          </button>
        </div>
      </div>

      {/* ADD TRANSACTION SHEET */}
      <AddTransactionSheet
        isOpen={showAddSheet}
        onClose={() => setShowAddSheet(false)}
        type={addType}
        onAdd={(t) => {
          state.addTransaction(t)
          setShowAddSheet(false)
        }}
      />

      {/* TRANSACTION DETAIL SHEET */}
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
    </div>
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

  const incomeCategories = ['Client Work', 'Consulting', 'Products', 'Ads', 'Affiliate', 'Other']
  const expenseCategories = ['Software', 'Ads', 'Equipment', 'Services', 'Education', 'Other']
  const categories = type === 'income' ? incomeCategories : expenseCategories

  const handleSubmit = () => {
    if (!amount || !description) return
    haptic.trigger('heavy')
    onAdd({
      type,
      amount: parseFloat(amount),
      description,
      date,
      category: category || undefined
    })
    // Reset
    setAmount('')
    setDescription('')
    setDate(new Date().toISOString().split('T')[0])
    setCategory('')
  }

  const isValid = amount && parseFloat(amount) > 0 && description.trim()

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title={`Add ${type === 'income' ? 'Income' : 'Expense'}`}>
      <div className="px-4 pb-6 space-y-4">
        {/* Amount */}
        <div>
          <label className="block text-sm font-bold text-white/50 mb-2">Amount</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-white/40">$</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full pl-10 pr-4 py-4 rounded-2xl bg-white/5 border border-white/10 text-2xl font-bold text-white placeholder-white/30 focus:outline-none focus:border-amber-500/50"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-bold text-white/50 mb-2">Description</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What was this for?"
            className="w-full px-4 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-amber-500/50"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-bold text-white/50 mb-2">Category</label>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  haptic.trigger('light')
                  setCategory(category === cat ? '' : cat)
                }}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                  category === cat
                    ? type === 'income'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-red-500/20 text-red-400 border border-red-500/30'
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
          <label className="block text-sm font-bold text-white/50 mb-2">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-4 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-amber-500/50"
          />
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={!isValid}
          className={`w-full py-4 rounded-2xl font-bold transition-all ${
            isValid
              ? type === 'income'
                ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/30 active:scale-[0.98]'
                : 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/30 active:scale-[0.98]'
              : 'bg-white/10 text-white/30 cursor-not-allowed'
          }`}
        >
          Add {type === 'income' ? 'Income' : 'Expense'}
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
  const [isEditing, setIsEditing] = useState(false)
  const [editAmount, setEditAmount] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const haptic = useHapticFeedback()

  if (!transaction) return null

  const handleStartEdit = () => {
    haptic.trigger('light')
    setEditAmount(transaction.amount.toString())
    setEditDescription(transaction.description)
    setIsEditing(true)
  }

  const handleSaveEdit = () => {
    haptic.trigger('medium')
    onUpdate(transaction.id, {
      amount: parseFloat(editAmount),
      description: editDescription
    })
    setIsEditing(false)
  }

  const handleDelete = () => {
    haptic.trigger('heavy')
    onDelete(transaction.id)
  }

  return (
    <BottomSheet isOpen={!!transaction} onClose={onClose} title="Transaction Details">
      <div className="px-4 pb-6">
        {isEditing ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-white/50 mb-2">Amount</label>
              <input
                type="number"
                value={editAmount}
                onChange={(e) => setEditAmount(e.target.value)}
                className="w-full px-4 py-4 rounded-2xl bg-white/5 border border-white/10 text-xl font-bold text-white focus:outline-none focus:border-amber-500/50"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-white/50 mb-2">Description</label>
              <input
                type="text"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="w-full px-4 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-amber-500/50"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setIsEditing(false)}
                className="flex-1 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold active:scale-[0.98] transition-transform"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="flex-1 py-4 rounded-2xl bg-amber-500 text-black font-bold active:scale-[0.98] transition-transform"
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Amount display */}
            <div className={`text-center py-6 rounded-2xl mb-4 ${
              transaction.type === 'income' ? 'bg-emerald-500/10' : 'bg-red-500/10'
            }`}>
              <p className={`text-4xl font-black ${
                transaction.type === 'income' ? 'text-emerald-400' : 'text-red-400'
              }`}>
                {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toLocaleString()}
              </p>
            </div>

            {/* Details */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-between py-3 border-b border-white/10">
                <span className="text-white/50">Description</span>
                <span className="text-white font-medium">{transaction.description}</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-white/10">
                <span className="text-white/50">Date</span>
                <span className="text-white font-medium">
                  {new Date(transaction.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
              {transaction.category && (
                <div className="flex items-center justify-between py-3 border-b border-white/10">
                  <span className="text-white/50">Category</span>
                  <span className="text-white font-medium">{transaction.category}</span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={handleStartEdit}
                className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold active:scale-[0.98] transition-transform"
              >
                <Edit2 className="w-5 h-5" />
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 font-bold active:scale-[0.98] transition-transform"
              >
                <Trash2 className="w-5 h-5" />
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
