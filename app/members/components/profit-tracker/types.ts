// ============================================
// PROFIT TRACKER - TYPE DEFINITIONS (V2)
// ============================================

// Income Categories
export const INCOME_CATEGORIES = [
  { id: 'clients', label: 'Client Payments', icon: 'Users', color: 'emerald' },
  { id: 'sales', label: 'Product Sales', icon: 'ShoppingBag', color: 'blue' },
  { id: 'services', label: 'Services', icon: 'Briefcase', color: 'violet' },
  { id: 'freelance', label: 'Freelance', icon: 'Laptop', color: 'cyan' },
  { id: 'consulting', label: 'Consulting', icon: 'MessageSquare', color: 'amber' },
  { id: 'affiliate', label: 'Affiliate/Referral', icon: 'Link', color: 'pink' },
  { id: 'ads', label: 'Ad Revenue', icon: 'Play', color: 'red' },
  { id: 'investments', label: 'Investments', icon: 'TrendingUp', color: 'green' },
  { id: 'other', label: 'Other', icon: 'MoreHorizontal', color: 'zinc' },
] as const

// Expense Categories
export const EXPENSE_CATEGORIES = [
  { id: 'software', label: 'Software & Tools', icon: 'Monitor', color: 'blue' },
  { id: 'ads', label: 'Advertising', icon: 'Megaphone', color: 'red' },
  { id: 'contractors', label: 'Contractors', icon: 'Users', color: 'violet' },
  { id: 'subscriptions', label: 'Subscriptions', icon: 'CreditCard', color: 'amber' },
  { id: 'equipment', label: 'Equipment', icon: 'Cpu', color: 'cyan' },
  { id: 'education', label: 'Education', icon: 'GraduationCap', color: 'emerald' },
  { id: 'office', label: 'Office/Rent', icon: 'Building', color: 'orange' },
  { id: 'travel', label: 'Travel', icon: 'Plane', color: 'sky' },
  { id: 'marketing', label: 'Marketing', icon: 'Target', color: 'pink' },
  { id: 'legal', label: 'Legal & Professional', icon: 'Scale', color: 'slate' },
  { id: 'taxes', label: 'Taxes & Fees', icon: 'Receipt', color: 'rose' },
  { id: 'other', label: 'Other', icon: 'MoreHorizontal', color: 'zinc' },
] as const

export type IncomeCategoryId = typeof INCOME_CATEGORIES[number]['id']
export type ExpenseCategoryId = typeof EXPENSE_CATEGORIES[number]['id']

export interface IncomeEntry {
  id: string
  amount: number
  currency: string
  source: string
  category: IncomeCategoryId
  date: string
  createdAt: string
  isRecurring?: boolean
  recurringId?: string
}

export interface ExpenseEntry {
  id: string
  amount: number
  currency: string
  reason: string
  category: ExpenseCategoryId
  date: string
  createdAt: string
  isRecurring?: boolean
  recurringId?: string
}

export interface RecurringEntry {
  id: string
  type: 'income' | 'expense'
  amount: number
  currency: string
  description: string
  category: IncomeCategoryId | ExpenseCategoryId
  dayOfMonth: number // 1-28 (safe for all months)
  isActive: boolean
  createdAt: string
  lastProcessed?: string
}

export interface BudgetGoal {
  id: string
  category: ExpenseCategoryId | 'total'
  monthlyLimit: number
  createdAt: string
}

export interface MonthlyNote {
  month: string // YYYY-MM format
  reflection: string
  decisions: string
  nextMonth: string
  updatedAt: string
}

export interface ProfitTrackerState {
  income: IncomeEntry[]
  expenses: ExpenseEntry[]
  recurring: RecurringEntry[]
  budgets: BudgetGoal[]
  notes: Record<string, MonthlyNote>
  mainCurrency: string
  language: string
}

export interface MonthlyStats {
  totalIncome: number
  totalExpenses: number
  netProfit: number
  profitMargin: number
  incomeChange: number // vs last month
  expenseChange: number
  profitChange: number
  incomeByCategory: Record<IncomeCategoryId, number>
  expensesByCategory: Record<ExpenseCategoryId, number>
}

export interface MonthlyTrend {
  month: string
  income: number
  expenses: number
  profit: number
}

export type TrackerView = 'dashboard' | 'income' | 'expenses' | 'summary' | 'notes'

// Supported currencies
export const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'BRL', symbol: 'R$', name: 'Brazilian Real' },
  { code: 'MXN', symbol: '$', name: 'Mexican Peso' },
  { code: 'CHF', symbol: 'Fr', name: 'Swiss Franc' },
  { code: 'SEK', symbol: 'kr', name: 'Swedish Krona' },
  { code: 'NOK', symbol: 'kr', name: 'Norwegian Krone' },
  { code: 'DKK', symbol: 'kr', name: 'Danish Krone' },
  { code: 'PLN', symbol: 'zł', name: 'Polish Zloty' },
  { code: 'THB', symbol: '฿', name: 'Thai Baht' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar' },
  { code: 'HKD', symbol: 'HK$', name: 'Hong Kong Dollar' },
  { code: 'NZD', symbol: 'NZ$', name: 'New Zealand Dollar' },
  { code: 'ZAR', symbol: 'R', name: 'South African Rand' },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham' },
  { code: 'SAR', symbol: '﷼', name: 'Saudi Riyal' },
  { code: 'KRW', symbol: '₩', name: 'South Korean Won' },
  { code: 'TWD', symbol: 'NT$', name: 'Taiwan Dollar' },
  { code: 'PHP', symbol: '₱', name: 'Philippine Peso' },
  { code: 'IDR', symbol: 'Rp', name: 'Indonesian Rupiah' },
  { code: 'MYR', symbol: 'RM', name: 'Malaysian Ringgit' },
  { code: 'VND', symbol: '₫', name: 'Vietnamese Dong' },
  { code: 'TRY', symbol: '₺', name: 'Turkish Lira' },
  { code: 'RUB', symbol: '₽', name: 'Russian Ruble' },
] as const

export type CurrencyCode = typeof CURRENCIES[number]['code']

// Get currency info
export function getCurrency(code: string) {
  return CURRENCIES.find(c => c.code === code) || CURRENCIES[0]
}

// Get category info
export function getIncomeCategory(id: IncomeCategoryId) {
  return INCOME_CATEGORIES.find(c => c.id === id) || INCOME_CATEGORIES[INCOME_CATEGORIES.length - 1]
}

export function getExpenseCategory(id: ExpenseCategoryId) {
  return EXPENSE_CATEGORIES.find(c => c.id === id) || EXPENSE_CATEGORIES[EXPENSE_CATEGORIES.length - 1]
}

// Format currency
export function formatCurrency(amount: number, currency: string, compact = false): string {
  const curr = getCurrency(currency)

  if (compact && Math.abs(amount) >= 1000) {
    const formatted = new Intl.NumberFormat('en-US', {
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(amount)
    return `${curr.symbol}${formatted}`
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: curr.code,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)
}

// Generate unique ID
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

// Get current month in YYYY-MM format
export function getCurrentMonth(): string {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

// Get month display name
export function getMonthName(monthStr: string): string {
  const [year, month] = monthStr.split('-')
  const date = new Date(parseInt(year), parseInt(month) - 1)
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

// Get short month name
export function getShortMonthName(monthStr: string): string {
  const [year, month] = monthStr.split('-')
  const date = new Date(parseInt(year), parseInt(month) - 1)
  return date.toLocaleDateString('en-US', { month: 'short' })
}

// Get previous month
export function getPreviousMonth(monthStr: string): string {
  const [year, month] = monthStr.split('-')
  const date = new Date(parseInt(year), parseInt(month) - 1)
  date.setMonth(date.getMonth() - 1)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

// Get last N months
export function getLastNMonths(n: number): string[] {
  const months: string[] = []
  const now = new Date()
  for (let i = 0; i < n; i++) {
    const date = new Date(now.getFullYear(), now.getMonth() - i)
    months.push(`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`)
  }
  return months
}

// Detect user's currency from locale
export function detectCurrency(): string {
  if (typeof navigator === 'undefined') return 'USD'

  const locale = navigator.language || 'en-US'
  const region = locale.split('-')[1]?.toUpperCase()

  const regionToCurrency: Record<string, string> = {
    US: 'USD', GB: 'GBP', EU: 'EUR', DE: 'EUR', FR: 'EUR', IT: 'EUR', ES: 'EUR',
    CA: 'CAD', AU: 'AUD', JP: 'JPY', CN: 'CNY', IN: 'INR', BR: 'BRL', MX: 'MXN',
    CH: 'CHF', SE: 'SEK', NO: 'NOK', DK: 'DKK', PL: 'PLN', TH: 'THB', SG: 'SGD',
    HK: 'HKD', NZ: 'NZD', ZA: 'ZAR', AE: 'AED', SA: 'SAR', KR: 'KRW', TW: 'TWD',
    PH: 'PHP', ID: 'IDR', MY: 'MYR', VN: 'VND', TR: 'TRY', RU: 'RUB',
  }

  return regionToCurrency[region] || 'USD'
}

// Category color classes
export function getCategoryColorClasses(color: string) {
  const colors: Record<string, { bg: string; text: string; border: string }> = {
    emerald: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/30' },
    blue: { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30' },
    violet: { bg: 'bg-violet-500/20', text: 'text-violet-400', border: 'border-violet-500/30' },
    cyan: { bg: 'bg-cyan-500/20', text: 'text-cyan-400', border: 'border-cyan-500/30' },
    amber: { bg: 'bg-amber-500/20', text: 'text-amber-400', border: 'border-amber-500/30' },
    pink: { bg: 'bg-pink-500/20', text: 'text-pink-400', border: 'border-pink-500/30' },
    red: { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30' },
    green: { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/30' },
    zinc: { bg: 'bg-zinc-500/20', text: 'text-zinc-400', border: 'border-zinc-500/30' },
    orange: { bg: 'bg-orange-500/20', text: 'text-orange-400', border: 'border-orange-500/30' },
    sky: { bg: 'bg-sky-500/20', text: 'text-sky-400', border: 'border-sky-500/30' },
    slate: { bg: 'bg-slate-500/20', text: 'text-slate-400', border: 'border-slate-500/30' },
    rose: { bg: 'bg-rose-500/20', text: 'text-rose-400', border: 'border-rose-500/30' },
  }
  return colors[color] || colors.zinc
}
