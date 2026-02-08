'use client'

import { useState, useEffect, useMemo } from 'react'
import {
  Shield, Users, DollarSign, TrendingUp, RefreshCw, Eye, EyeOff,
  Download, Mail, Clock, UserPlus, Trash2, Copy, Search, Activity,
  CheckCircle, AlertCircle, X, LogIn, Zap, UserCheck, UserX,
  Calendar, BarChart3, ArrowUpRight, ArrowDownRight, Sparkles,
  Tag, StickyNote, ChevronLeft, ChevronRight, Check, MoreHorizontal,
  Filter, History, HelpCircle, ShoppingCart, Package, Info
} from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts'

interface Member {
  email: string
  password: string
  name: string
  purchaseDate: string
  planId: string
  product: 'dentist' | 'plastic-surgeon' | 'psychologist' | 'lawyer'
  lastLogin?: string
  loginCount?: number
  notes?: string
  tags?: string[]
  loginHistory?: string[]
  revenue?: { main: number; upsell?: number; oto?: number; total: number }
  refunded?: boolean
}

interface Stats {
  totalMembers: number
  activeMembers24h: number
  activeMembers7d: number
  activeMembers30d: number
  neverLoggedIn: number
  loggedInOnce: number
  regularUsers: number
  powerUsers: number
  newMembersToday: number
  newMembersYesterday: number
  newMembersThisWeek: number
  newMembersThisMonth: number
  newMembersLastWeek: number
  newMembersLastMonth: number
  weekOverWeekGrowth: number
  monthOverMonthGrowth: number
  revenueToday: number
  revenueYesterday: number
  revenueThisWeek: number
  revenueThisMonth: number
  revenueLastWeek: number
  revenueLastMonth: number
  totalRevenue: number
  mainRevenue: number
  upsellRevenue: number
  otoRevenue: number
  engagementRate: number
  avgLoginsPerMember: string
  totalLogins: number
  refundedMembers: number
  tagCounts: Record<string, number>
  upsellConversionRate: number
  membersWithUpsell: number
}

interface ChartData {
  date: string
  label: string
  newSignups: number
  activeUsers: number
  totalMembers: number
  revenue: number
}

const ITEMS_PER_PAGE = 15
const PRESET_TAGS = ['VIP', 'Refunded', 'Support', 'Upsell', 'OTO', 'Manual', 'Problem']
const COLORS = ['#d4af37', '#f59e0b', '#b8960c', '#fbbf24', '#ef4444', '#eab308', '#ca8a04']

// ============================================
// TOOLTIP COMPONENT - Explains every metric
// ============================================
function Tooltip({ text }: { text: string }) {
  const [show, setShow] = useState(false)
  return (
    <span className="relative inline-block ml-1">
      <HelpCircle
        className="w-3.5 h-3.5 text-slate-500 hover:text-slate-300 cursor-help inline"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
      />
      {show && (
        <span className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 text-xs text-white bg-slate-800 border border-slate-600 rounded-lg shadow-xl w-56 text-left whitespace-normal">
          {text}
          <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></span>
        </span>
      )}
    </span>
  )
}

export default function LawyerAdminPage() {
  const [password, setPassword] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [members, setMembers] = useState<Member[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [chartData, setChartData] = useState<ChartData[]>([])

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'newest' | 'lastLogin' | 'logins' | 'revenue'>('newest')
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive' | 'never'>('all')
  const [filterTag, setFilterTag] = useState<string>('')
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d')

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)

  // Selection for bulk actions
  const [selectedMembers, setSelectedMembers] = useState<Set<string>>(new Set())
  const [showBulkActions, setShowBulkActions] = useState(false)

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState<Member | null>(null)
  const [showNotesModal, setShowNotesModal] = useState<Member | null>(null)
  const [showLoginHistoryModal, setShowLoginHistoryModal] = useState<Member | null>(null)
  const [showTagModal, setShowTagModal] = useState<Member | null>(null)
  const [showBulkModal, setShowBulkModal] = useState(false)

  // Create form
  const [newEmail, setNewEmail] = useState('')
  const [newName, setNewName] = useState('')
  const [noteText, setNoteText] = useState('')

  // Check stored auth on mount
  useEffect(() => {
    const stored = localStorage.getItem('lawyer_admin_auth')
    if (stored) {
      setIsAuthenticated(true)
      setPassword(stored)
      fetchData(stored)
    }
  }, [])

  const fetchData = async (pwd: string) => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/lawyer-admin', {
        headers: { 'Authorization': `Bearer ${pwd}` }
      })
      const data = await res.json()
      if (data.error) {
        setError(data.error)
        if (data.error === 'Unauthorized') {
          localStorage.removeItem('lawyer_admin_auth')
          setIsAuthenticated(false)
        }
      } else {
        setMembers(data.members || [])
        setStats(data.stats || null)
        setChartData(data.chartData || [])
      }
    } catch (e: any) {
      setError(e.message)
    }
    setLoading(false)
  }

  const handleLogin = async () => {
    if (!password.trim()) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/lawyer-admin', {
        headers: { 'Authorization': `Bearer ${password}` }
      })
      const data = await res.json()
      if (data.error === 'Unauthorized') {
        setError('Invalid password')
      } else if (data.error) {
        setError(data.error)
      } else {
        setIsAuthenticated(true)
        localStorage.setItem('lawyer_admin_auth', password)
        setMembers(data.members || [])
        setStats(data.stats || null)
        setChartData(data.chartData || [])
      }
    } catch (e: any) {
      setError(e.message)
    }
    setLoading(false)
  }

  const handleAction = async (action: string, email?: string, extra?: any) => {
    setLoading(true)
    setError('')
    setSuccess('')
    try {
      const res = await fetch('/api/lawyer-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, action, email, ...extra })
      })
      const data = await res.json()
      if (data.error) {
        setError(data.error)
      } else {
        setSuccess(data.message || 'Action completed')
        setTimeout(() => setSuccess(''), 3000)
        fetchData(password)
      }
    } catch (e: any) {
      setError(e.message)
    }
    setLoading(false)
  }

  const handleBulkAction = async (action: 'resend' | 'delete' | 'addTag', tag?: string) => {
    if (selectedMembers.size === 0) return
    setLoading(true)
    const emails = Array.from(selectedMembers)
    try {
      const res = await fetch('/api/lawyer-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          password,
          action: action === 'resend' ? 'bulkResend' : action === 'delete' ? 'bulkDelete' : 'bulkAddTag',
          emails,
          tag
        })
      })
      const data = await res.json()
      if (data.error) {
        setError(data.error)
      } else {
        setSuccess(`${action} completed for ${emails.length} members`)
        setSelectedMembers(new Set())
        setShowBulkModal(false)
        setTimeout(() => setSuccess(''), 3000)
        fetchData(password)
      }
    } catch (e: any) {
      setError(e.message)
    }
    setLoading(false)
  }

  // Filtering and sorting
  const filteredMembers = useMemo(() => {
    let filtered = [...members]

    // Search
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(m => m.email.toLowerCase().includes(term) || m.name?.toLowerCase().includes(term))
    }

    // Date range filter
    if (dateRange !== 'all') {
      const days = dateRange === '7d' ? 7 : dateRange === '30d' ? 30 : 90
      const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
      filtered = filtered.filter(m => new Date(m.purchaseDate) >= cutoff)
    }

    // Status filter
    if (filterStatus === 'active') filtered = filtered.filter(m => m.loginCount && m.loginCount > 0)
    else if (filterStatus === 'inactive') filtered = filtered.filter(m => m.loginCount && m.loginCount > 0 && (!m.lastLogin || new Date(m.lastLogin) < new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)))
    else if (filterStatus === 'never') filtered = filtered.filter(m => !m.loginCount || m.loginCount === 0)

    // Tag filter
    if (filterTag) filtered = filtered.filter(m => m.tags?.includes(filterTag))

    // Sort
    if (sortBy === 'newest') filtered.sort((a, b) => new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime())
    else if (sortBy === 'lastLogin') filtered.sort((a, b) => (b.lastLogin ? new Date(b.lastLogin).getTime() : 0) - (a.lastLogin ? new Date(a.lastLogin).getTime() : 0))
    else if (sortBy === 'logins') filtered.sort((a, b) => (b.loginCount || 0) - (a.loginCount || 0))
    else if (sortBy === 'revenue') filtered.sort((a, b) => (b.revenue?.total || 0) - (a.revenue?.total || 0))

    return filtered
  }, [members, searchTerm, filterStatus, filterTag, sortBy, dateRange])

  // Pagination
  const totalPages = Math.ceil(filteredMembers.length / ITEMS_PER_PAGE)
  const paginatedMembers = filteredMembers.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  useEffect(() => { setCurrentPage(1) }, [searchTerm, filterStatus, filterTag, dateRange])

  // Helper functions
  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  const formatRelative = (d: string) => {
    if (!d) return 'Never'
    const diff = Date.now() - new Date(d).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 60) return `${mins}m ago`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    if (days < 7) return `${days}d ago`
    return formatDate(d)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setSuccess('Copied!')
    setTimeout(() => setSuccess(''), 1500)
  }

  const toggleSelect = (email: string) => {
    const newSet = new Set(selectedMembers)
    if (newSet.has(email)) newSet.delete(email)
    else newSet.add(email)
    setSelectedMembers(newSet)
  }

  const toggleSelectAll = () => {
    if (selectedMembers.size === paginatedMembers.length) setSelectedMembers(new Set())
    else setSelectedMembers(new Set(paginatedMembers.map(m => m.email)))
  }

  // Revenue pie data
  const revenuePieData = stats ? [
    { name: 'Main Course ($47)', value: stats.mainRevenue },
    { name: 'Upsell ($9.95)', value: stats.upsellRevenue },
    { name: 'Downsell ($4.95)', value: stats.otoRevenue }
  ].filter(d => d.value > 0) : []

  // Get purchase type for a member
  const getPurchaseType = (m: Member) => {
    if (!m.revenue) return { label: 'Main Only ($47)', color: 'text-slate-400', icon: Package }
    const hasUpsell = m.revenue.upsell && m.revenue.upsell > 0
    const hasDownsell = m.revenue.oto && m.revenue.oto > 0
    if (hasUpsell) return { label: `Main + Upsell ($${(m.revenue.total || 56.95).toFixed(2)})`, color: 'text-emerald-400', icon: Sparkles }
    if (hasDownsell) return { label: `Main + Downsell ($${(m.revenue.total || 51.95).toFixed(2)})`, color: 'text-amber-400', icon: Sparkles }
    return { label: 'Main Only ($47)', color: 'text-slate-400', icon: Package }
  }

  // Calculate % change
  const calcChange = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0
    return Math.round(((current - previous) / previous) * 100)
  }

  // ========== LOGIN SCREEN ==========
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 w-full max-w-sm backdrop-blur-xl">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Shield className="w-8 h-8 text-amber-500" />
            <h1 className="text-2xl font-bold text-white">Admin Login</h1>
          </div>
          <p className="text-slate-400 text-sm text-center mb-6">Lawyer Members Dashboard</p>
          <div className="space-y-4">
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
                placeholder="Enter admin password"
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 pr-10"
              />
              <button onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {error && <p className="text-red-400 text-sm text-center">{error}</p>}
            <button onClick={handleLogin} disabled={loading} className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-xl transition-colors disabled:opacity-50">
              {loading ? 'Checking...' : 'Login'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ========== MAIN DASHBOARD ==========
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500/10 rounded-xl">
                <Users className="w-6 h-6 text-amber-500" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Lawyer Members</h1>
                <p className="text-xs text-slate-400">CloneYourself Admin Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => { const csv = ['Email,Name,Password,Purchased,LastLogin,Logins,Revenue'].concat(members.map(m => `${m.email},${m.name || ''},${m.password},${m.purchaseDate},${m.lastLogin || ''},${m.loginCount || 0},${m.revenue?.total || 47}`)).join('\n'); const blob = new Blob([csv], { type: 'text/csv' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'lawyer-members.csv'; a.click() }} className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl transition text-sm">
                <Download className="w-4 h-4" /> Export
              </button>
              <button onClick={() => setShowCreateModal(true)} className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-500 rounded-xl transition text-sm font-semibold">
                <UserPlus className="w-4 h-4" /> Add
              </button>
              <button onClick={() => fetchData(password)} disabled={loading} className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl transition">
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Alerts */}
        {error && <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 flex items-center gap-2"><AlertCircle className="w-5 h-5" /> {error}</div>}
        {success && <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 flex items-center gap-2"><CheckCircle className="w-5 h-5" /> {success}</div>}

        {/* TODAY vs YESTERDAY */}
        {stats && (
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Calendar className="w-5 h-5 text-amber-400" />
                Today
                <Tooltip text="Real-time comparison between today and yesterday. Updates automatically when new purchases come in." />
              </h2>
              <span className="text-sm text-slate-500">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Today's Revenue */}
              <div className="bg-slate-800/50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-400 flex items-center gap-1">
                    Revenue
                    <Tooltip text="Total money earned today from all purchases (main course + upsells)." />
                  </span>
                  {stats.revenueYesterday > 0 && (
                    <span className={`text-xs px-2 py-0.5 rounded-full ${calcChange(stats.revenueToday, stats.revenueYesterday) >= 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                      {calcChange(stats.revenueToday, stats.revenueYesterday) >= 0 ? '+' : ''}{calcChange(stats.revenueToday, stats.revenueYesterday)}%
                    </span>
                  )}
                </div>
                <p className="text-2xl font-bold text-white">${stats.revenueToday.toLocaleString()}</p>
                <p className="text-xs text-slate-500 mt-1">Yesterday: ${stats.revenueYesterday.toLocaleString()}</p>
              </div>

              {/* Today's New Members */}
              <div className="bg-slate-800/50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-400 flex items-center gap-1">
                    New Members
                    <Tooltip text="Number of people who purchased today and got their login credentials." />
                  </span>
                  {stats.newMembersYesterday > 0 && (
                    <span className={`text-xs px-2 py-0.5 rounded-full ${calcChange(stats.newMembersToday, stats.newMembersYesterday) >= 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                      {calcChange(stats.newMembersToday, stats.newMembersYesterday) >= 0 ? '+' : ''}{calcChange(stats.newMembersToday, stats.newMembersYesterday)}%
                    </span>
                  )}
                </div>
                <p className="text-2xl font-bold text-white">{stats.newMembersToday}</p>
                <p className="text-xs text-slate-500 mt-1">Yesterday: {stats.newMembersYesterday}</p>
              </div>

              {/* Active Now (24h) */}
              <div className="bg-slate-800/50 rounded-xl p-4">
                <span className="text-sm text-slate-400 flex items-center gap-1 mb-2">
                  Active (24h)
                  <Tooltip text="Members who logged into the members area in the last 24 hours." />
                </span>
                <p className="text-2xl font-bold text-white">{stats.activeMembers24h}</p>
                <p className="text-xs text-slate-500 mt-1">of {stats.totalMembers} total</p>
              </div>

              {/* Upsell/Downsell Rate */}
              <div className="bg-slate-800/50 rounded-xl p-4">
                <span className="text-sm text-slate-400 flex items-center gap-1 mb-2">
                  Add-on Rate
                  <Tooltip text="Percentage of members who bought an additional product (upsell $9.95 or downsell $4.95) after the main course. Higher = better funnel." />
                </span>
                <p className="text-2xl font-bold text-white">{stats.upsellConversionRate || 0}%</p>
                <p className="text-xs text-slate-500 mt-1">{stats.membersWithUpsell || 0} with add-on</p>
              </div>
            </div>
          </div>
        )}

        {/* Date Range Selector */}
        <div className="flex items-center gap-2">
          {(['7d', '30d', '90d', 'all'] as const).map(r => (
            <button key={r} onClick={() => setDateRange(r)} className={`px-4 py-2 rounded-xl text-sm font-medium transition ${dateRange === r ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>
              {r === '7d' ? 'Last 7 Days' : r === '30d' ? 'Last 30 Days' : r === '90d' ? 'Last 90 Days' : 'All Time'}
            </button>
          ))}
        </div>

        {/* MAIN STATS CARDS */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <Users className="w-5 h-5 text-amber-400" />
                <Tooltip text="Total number of members who have purchased and have login credentials. This is your customer count." />
              </div>
              <p className="text-3xl font-bold">{stats.totalMembers}</p>
              <p className="text-sm text-slate-400 mt-1">Total Members</p>
              <p className="text-xs text-emerald-400 mt-2">+{stats.newMembersThisMonth} this month</p>
            </div>

            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <DollarSign className="w-5 h-5 text-emerald-400" />
                <Tooltip text="Total revenue tracked in this dashboard. NOTE: Only includes purchases since tracking started. For complete revenue, check your Stripe dashboard." />
              </div>
              <p className="text-3xl font-bold">${stats.totalRevenue.toLocaleString()}</p>
              <p className="text-sm text-slate-400 mt-1">Total Revenue</p>
              <p className="text-xs text-emerald-400 mt-2">+${stats.revenueThisMonth.toLocaleString()} this month</p>
            </div>

            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <Activity className="w-5 h-5 text-amber-400" />
                {stats.weekOverWeekGrowth !== 0 && (
                  <span className={`text-xs px-2 py-1 rounded-full ${stats.weekOverWeekGrowth >= 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                    {stats.weekOverWeekGrowth >= 0 ? '+' : ''}{stats.weekOverWeekGrowth}%
                  </span>
                )}
              </div>
              <p className="text-3xl font-bold">{stats.activeMembers7d}</p>
              <p className="text-sm text-slate-400 mt-1 flex items-center gap-1">
                Active (7d)
                <Tooltip text="Members who logged in at least once in the last 7 days. Shows platform engagement." />
              </p>
              <p className="text-xs text-slate-500 mt-2">{stats.avgLoginsPerMember} avg logins</p>
            </div>

            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <BarChart3 className="w-5 h-5 text-amber-400" />
                <Tooltip text="Percentage of total members who have logged in at least once. Higher = members are using your product." />
              </div>
              <p className="text-3xl font-bold">{stats.engagementRate}%</p>
              <p className="text-sm text-slate-400 mt-1">Engagement</p>
              <p className="text-xs text-slate-500 mt-2">{stats.totalLogins} total logins</p>
            </div>
          </div>
        )}

        {/* CHARTS SECTION */}
        {stats && (
          <div className="grid md:grid-cols-3 gap-4">
            {/* Growth Chart */}
            <div className="md:col-span-2 bg-slate-900/50 border border-slate-800 rounded-2xl p-5">
              <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-amber-400" />
                Member Growth & Activity
                <Tooltip text="Shows new signups (bars) and active users (line) over time. Helps you see growth trends." />
              </h3>
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorSignups" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#d4af37" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#d4af37" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="label" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                    <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
                    <RechartsTooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }} />
                    <Area type="monotone" dataKey="newSignups" stroke="#d4af37" strokeWidth={2} fill="url(#colorSignups)" name="New Signups" />
                    <Area type="monotone" dataKey="activeUsers" stroke="#f59e0b" strokeWidth={2} fill="transparent" name="Active Users" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : <div className="h-[220px] flex items-center justify-center text-slate-500">No data yet</div>}
            </div>

            {/* Revenue Breakdown Pie */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5">
              <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-400" />
                Revenue Breakdown
                <Tooltip text="Shows where your revenue comes from. Main course is $47, Upsell is $9.95. Higher upsell % = better funnel." />
              </h3>
              {revenuePieData.length > 0 ? (
                <>
                  <ResponsiveContainer width="100%" height={160}>
                    <PieChart>
                      <Pie data={revenuePieData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={5} dataKey="value" label={({ percent }: any) => `${((percent || 0) * 100).toFixed(0)}%`}>
                        {revenuePieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Pie>
                      <RechartsTooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }} formatter={(value: number) => `$${value.toLocaleString()}`} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-2 mt-2 text-sm">
                    <div className="flex justify-between"><span className="text-slate-400 flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500"></span>Main ($47)</span><span className="text-white font-medium">${stats.mainRevenue.toLocaleString()}</span></div>
                    {stats.upsellRevenue > 0 && <div className="flex justify-between"><span className="text-slate-400 flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-500"></span>Upsell ($9.95)</span><span className="text-white font-medium">${stats.upsellRevenue.toLocaleString()}</span></div>}
                    {stats.otoRevenue > 0 && <div className="flex justify-between"><span className="text-slate-400 flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-500"></span>Downsell ($4.95)</span><span className="text-white font-medium">${stats.otoRevenue.toLocaleString()}</span></div>}
                  </div>
                </>
              ) : (
                <div className="h-[200px] flex flex-col items-center justify-center text-slate-500 text-sm">
                  <Info className="w-8 h-8 mb-2" />
                  <p>Revenue tracking started recently.</p>
                  <p className="text-xs mt-1">New purchases will show here.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* CONVERSION FUNNEL */}
        {stats && (
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5">
            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-amber-400" />
              Conversion Funnel
              <Tooltip text="Shows how many customers bought additional products. Use this to optimize your upsell page and increase average order value." />
            </h3>
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center p-4 bg-slate-800/50 rounded-xl">
                <p className="text-2xl font-bold text-amber-400">{stats.totalMembers}</p>
                <p className="text-xs text-slate-400 mt-1">Main Course</p>
                <p className="text-xs text-slate-500">100%</p>
              </div>
              <div className="text-center p-4 bg-slate-800/50 rounded-xl">
                <p className="text-2xl font-bold text-yellow-400">{stats.membersWithUpsell || 0}</p>
                <p className="text-xs text-slate-400 mt-1">+ Upsell</p>
                <p className="text-xs text-slate-500">{stats.upsellConversionRate || 0}%</p>
              </div>
              <div className="text-center p-4 bg-slate-800/50 rounded-xl">
                <p className="text-2xl font-bold text-emerald-400">{stats.totalMembers - stats.neverLoggedIn}</p>
                <p className="text-xs text-slate-400 mt-1">Logged In</p>
                <p className="text-xs text-slate-500">{stats.engagementRate}%</p>
              </div>
              <div className="text-center p-4 bg-slate-800/50 rounded-xl">
                <p className="text-2xl font-bold text-orange-400">{stats.powerUsers}</p>
                <p className="text-xs text-slate-400 mt-1 flex items-center justify-center gap-1">
                  Power Users
                  <Tooltip text="Members with 5+ logins. These are your most engaged customers." />
                </p>
                <p className="text-xs text-slate-500">{stats.totalMembers > 0 ? Math.round((stats.powerUsers / stats.totalMembers) * 100) : 0}%</p>
              </div>
            </div>
          </div>
        )}

        {/* QUICK STATS ROW */}
        {stats && (
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {[
              { label: 'Today', value: stats.newMembersToday, color: 'text-amber-400', icon: Zap, tip: 'Members who joined today.' },
              { label: 'This Week', value: stats.newMembersThisWeek, color: 'text-yellow-400', icon: Calendar, tip: 'Members who joined in the last 7 days.', change: stats.weekOverWeekGrowth },
              { label: 'This Month', value: stats.newMembersThisMonth, color: 'text-orange-400', icon: TrendingUp, tip: 'Members who joined in the last 30 days.', change: stats.monthOverMonthGrowth },
              { label: 'Never Logged', value: stats.neverLoggedIn, color: 'text-amber-400', icon: UserX, tip: 'Members who bought but never logged into the platform. Consider sending them a reminder email.' },
              { label: 'Power Users', value: stats.powerUsers, color: 'text-yellow-400', icon: Sparkles, tip: 'Members with 5+ logins. Your most engaged customers.' },
              { label: 'Refunded', value: stats.refundedMembers, color: 'text-red-400', icon: AlertCircle, tip: 'Members marked as refunded.' }
            ].map((item, i) => (
              <div key={i} className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
                <div className="flex items-center gap-1 mb-2">
                  <item.icon className={`w-4 h-4 ${item.color}`} />
                  <span className="text-xs text-slate-400">{item.label}</span>
                  <Tooltip text={item.tip} />
                </div>
                <p className={`text-xl font-bold ${item.color}`}>{item.value}</p>
                {item.change !== undefined && item.change !== 0 && (
                  <p className={`text-xs mt-1 ${item.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {item.change >= 0 ? '+' : ''}{item.change}% vs last
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* DATA NOTE */}
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex items-start gap-3">
          <Info className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-amber-300">
            <p className="font-medium mb-1">About this data</p>
            <p className="text-amber-400/80">Revenue shown here is tracked from purchases since this system was set up. For complete revenue history, check your Stripe dashboard. New purchases (including upsells) are tracked automatically.</p>
          </div>
        </div>

        {/* MEMBERS TABLE */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
          {/* Search & Filters */}
          <div className="p-4 border-b border-slate-800">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  placeholder="Search by email or name..."
                  className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-sm"
                />
              </div>
              <div className="flex items-center gap-2">
                {(['all', 'active', 'inactive', 'never'] as const).map(s => (
                  <button key={s} onClick={() => setFilterStatus(s)} className={`px-3 py-1.5 rounded-lg text-sm transition ${filterStatus === s ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>
                    {s === 'all' ? 'All' : s === 'active' ? 'Active' : s === 'inactive' ? 'Inactive' : 'Never'}
                  </button>
                ))}
              </div>
              <select value={filterTag} onChange={e => setFilterTag(e.target.value)} className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-300">
                <option value="">All Tags</option>
                {PRESET_TAGS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <select value={sortBy} onChange={e => setSortBy(e.target.value as any)} className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-300">
                <option value="newest">Newest</option>
                <option value="lastLogin">Last Login</option>
                <option value="logins">Most Logins</option>
                <option value="revenue">Highest Revenue</option>
              </select>
            </div>
          </div>

          {/* Bulk Actions Bar */}
          {selectedMembers.size > 0 && (
            <div className="px-4 py-3 bg-amber-500/10 border-b border-amber-500/20 flex items-center justify-between">
              <span className="text-amber-400 text-sm font-medium">{selectedMembers.size} selected</span>
              <div className="flex items-center gap-2">
                <button onClick={() => handleBulkAction('resend')} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm flex items-center gap-1">
                  <Mail className="w-4 h-4" /> Resend Email
                </button>
                <button onClick={() => setShowBulkModal(true)} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm flex items-center gap-1">
                  <Tag className="w-4 h-4" /> Add Tag
                </button>
                <button onClick={() => { if (confirm(`Delete ${selectedMembers.size} members?`)) handleBulkAction('delete') }} className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-sm flex items-center gap-1">
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
                <button onClick={() => setSelectedMembers(new Set())} className="px-3 py-1.5 text-slate-400 hover:text-white text-sm">
                  Clear
                </button>
              </div>
            </div>
          )}

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800 text-left text-slate-400">
                  <th className="p-4 w-10">
                    <input type="checkbox" checked={selectedMembers.size === paginatedMembers.length && paginatedMembers.length > 0} onChange={toggleSelectAll} className="rounded bg-slate-700 border-slate-600" />
                  </th>
                  <th className="p-4">Member</th>
                  <th className="p-4">Password</th>
                  <th className="p-4">
                    <span className="flex items-center gap-1">
                      Purchase
                      <Tooltip text="What products this member bought. Main = $47 course. Upsell = $9.95 additional videos." />
                    </span>
                  </th>
                  <th className="p-4">Tags</th>
                  <th className="p-4">Activity</th>
                  <th className="p-4">
                    <span className="flex items-center gap-1">
                      Status
                      <Tooltip text="Green = logged in recently. Yellow = inactive 30+ days. Red = never logged in." />
                    </span>
                  </th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedMembers.map(m => {
                  const purchase = getPurchaseType(m)
                  const isActive = m.lastLogin && new Date(m.lastLogin) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                  const neverLogged = !m.loginCount || m.loginCount === 0

                  return (
                    <tr key={m.email} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition">
                      <td className="p-4">
                        <input type="checkbox" checked={selectedMembers.has(m.email)} onChange={() => toggleSelect(m.email)} className="rounded bg-slate-700 border-slate-600" />
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="font-medium text-white">{m.email}</p>
                          {m.name && <p className="text-xs text-slate-500">{m.name}</p>}
                          <p className="text-xs text-slate-600 mt-1">Joined {formatDate(m.purchaseDate)}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <code className="px-2 py-1 bg-slate-800 rounded text-amber-400 text-xs">{m.password}</code>
                          <button onClick={() => copyToClipboard(m.password)} className="text-slate-500 hover:text-white">
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <purchase.icon className={`w-4 h-4 ${purchase.color}`} />
                          <span className={`text-xs ${purchase.color}`}>{purchase.label}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1">
                          {m.tags?.map(t => (
                            <span key={t} className="px-2 py-0.5 bg-slate-700 rounded-full text-xs text-slate-300">{t}</span>
                          ))}
                          {m.refunded && <span className="px-2 py-0.5 bg-red-500/20 text-red-400 rounded-full text-xs">Refunded</span>}
                          <button onClick={() => setShowTagModal(m)} className="px-1.5 py-0.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-500 hover:text-white">
                            <Tag className="w-3 h-3" />
                          </button>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-xs">
                          <p className="text-slate-300">{m.loginCount || 0} logins</p>
                          <p className="text-slate-500">{formatRelative(m.lastLogin || '')}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        {neverLogged ? (
                          <span className="flex items-center gap-1 text-xs text-red-400"><UserX className="w-3.5 h-3.5" /> Never</span>
                        ) : isActive ? (
                          <span className="flex items-center gap-1 text-xs text-emerald-400"><UserCheck className="w-3.5 h-3.5" /> Active</span>
                        ) : (
                          <span className="flex items-center gap-1 text-xs text-amber-400"><Clock className="w-3.5 h-3.5" /> Inactive</span>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => setShowDetailModal(m)} title="View Details" className="p-1.5 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button onClick={() => setShowNotesModal(m)} title="Notes" className="p-1.5 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white">
                            <StickyNote className="w-4 h-4" />
                          </button>
                          <button onClick={() => setShowLoginHistoryModal(m)} title="Login History" className="p-1.5 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white">
                            <History className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleAction('resend', m.email)} title="Resend Email" className="p-1.5 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white">
                            <Mail className="w-4 h-4" />
                          </button>
                          <button onClick={() => { if (confirm(`Delete ${m.email}?`)) handleAction('delete', m.email) }} title="Delete" className="p-1.5 hover:bg-red-500/20 rounded-lg text-slate-400 hover:text-red-400">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-slate-800 flex items-center justify-between">
              <p className="text-sm text-slate-500">
                Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, filteredMembers.length)} of {filteredMembers.length}
              </p>
              <div className="flex items-center gap-2">
                <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg disabled:opacity-50">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let page = i + 1
                  if (totalPages > 5) {
                    if (currentPage > 3) page = currentPage - 2 + i
                    if (currentPage > totalPages - 2) page = totalPages - 4 + i
                  }
                  return (
                    <button key={page} onClick={() => setCurrentPage(page)} className={`w-8 h-8 rounded-lg text-sm ${currentPage === page ? 'bg-amber-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-400'}`}>
                      {page}
                    </button>
                  )
                })}
                <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg disabled:opacity-50">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MODALS */}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-amber-400" /> Create Member
              </h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-500 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Email *</label>
                <input type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)} placeholder="customer@email.com" className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white" />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Name (optional)</label>
                <input type="text" value={newName} onChange={e => setNewName(e.target.value)} placeholder="John Doe" className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white" />
              </div>
              <p className="text-xs text-slate-500">A unique password will be generated automatically.</p>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowCreateModal(false)} className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl">Cancel</button>
                <button onClick={async () => { await handleAction('create', newEmail, { name: newName }); setShowCreateModal(false); setNewEmail(''); setNewName('') }} disabled={!newEmail || loading} className="flex-1 py-2 bg-amber-600 hover:bg-amber-500 rounded-xl font-semibold disabled:opacity-50">
                  {loading ? 'Creating...' : 'Create'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-lg">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold">Member Details</h3>
              <button onClick={() => setShowDetailModal(null)} className="text-slate-500 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-500 mb-1">Email</p>
                  <p className="text-white font-medium">{showDetailModal.email}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Name</p>
                  <p className="text-white">{showDetailModal.name || '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Password</p>
                  <div className="flex items-center gap-2">
                    <code className="text-amber-400">{showDetailModal.password}</code>
                    <button onClick={() => copyToClipboard(showDetailModal.password)}><Copy className="w-4 h-4 text-slate-500" /></button>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Joined</p>
                  <p className="text-white">{formatDate(showDetailModal.purchaseDate)}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Total Logins</p>
                  <p className="text-white">{showDetailModal.loginCount || 0}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Last Login</p>
                  <p className="text-white">{showDetailModal.lastLogin ? formatDate(showDetailModal.lastLogin) : 'Never'}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Purchase</p>
                  <p className={getPurchaseType(showDetailModal).color}>{getPurchaseType(showDetailModal).label}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Total Revenue</p>
                  <p className="text-emerald-400 font-bold">${showDetailModal.revenue?.total || 47}</p>
                </div>
              </div>
              {showDetailModal.notes && (
                <div>
                  <p className="text-xs text-slate-500 mb-1">Notes</p>
                  <p className="text-slate-300 text-sm bg-slate-800 p-3 rounded-lg">{showDetailModal.notes}</p>
                </div>
              )}
              <div className="flex gap-3 pt-2">
                <button onClick={() => { handleAction('resend', showDetailModal.email); setShowDetailModal(null) }} className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl flex items-center justify-center gap-2">
                  <Mail className="w-4 h-4" /> Resend Email
                </button>
                <button onClick={() => setShowDetailModal(null)} className="flex-1 py-2 bg-amber-600 hover:bg-amber-500 rounded-xl font-semibold">Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notes Modal */}
      {showNotesModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold flex items-center gap-2"><StickyNote className="w-5 h-5 text-amber-400" /> Notes</h3>
              <button onClick={() => setShowNotesModal(null)} className="text-slate-500 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <p className="text-sm text-slate-400 mb-3">{showNotesModal.email}</p>
            <textarea
              value={noteText || showNotesModal.notes || ''}
              onChange={e => setNoteText(e.target.value)}
              placeholder="Add notes about this member..."
              className="w-full h-32 px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white resize-none"
            />
            <div className="flex gap-3 mt-4">
              <button onClick={() => { setShowNotesModal(null); setNoteText('') }} className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl">Cancel</button>
              <button onClick={() => { handleAction('update', showNotesModal.email, { notes: noteText }); setShowNotesModal(null); setNoteText('') }} className="flex-1 py-2 bg-amber-600 hover:bg-amber-500 rounded-xl font-semibold">Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Login History Modal */}
      {showLoginHistoryModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-md max-h-[80vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold flex items-center gap-2"><History className="w-5 h-5 text-amber-400" /> Login History</h3>
              <button onClick={() => setShowLoginHistoryModal(null)} className="text-slate-500 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <p className="text-sm text-slate-400 mb-3">{showLoginHistoryModal.email}</p>
            <div className="flex-1 overflow-y-auto space-y-2">
              {showLoginHistoryModal.loginHistory && showLoginHistoryModal.loginHistory.length > 0 ? (
                showLoginHistoryModal.loginHistory.map((login, i) => (
                  <div key={i} className="flex items-center gap-3 p-2 bg-slate-800/50 rounded-lg text-sm">
                    <LogIn className="w-4 h-4 text-emerald-400" />
                    <span className="text-slate-300">{new Date(login).toLocaleString()}</span>
                  </div>
                ))
              ) : (
                <p className="text-slate-500 text-center py-8">No login history yet</p>
              )}
            </div>
            <button onClick={() => setShowLoginHistoryModal(null)} className="mt-4 w-full py-2 bg-slate-800 hover:bg-slate-700 rounded-xl">Close</button>
          </div>
        </div>
      )}

      {/* Tag Modal */}
      {showTagModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold flex items-center gap-2"><Tag className="w-5 h-5 text-amber-400" /> Manage Tags</h3>
              <button onClick={() => setShowTagModal(null)} className="text-slate-500 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <p className="text-sm text-slate-400 mb-4">{showTagModal.email}</p>
            <div className="flex flex-wrap gap-2">
              {PRESET_TAGS.map(tag => {
                const hasTag = showTagModal.tags?.includes(tag)
                return (
                  <button
                    key={tag}
                    onClick={() => handleAction(hasTag ? 'removeTag' : 'addTag', showTagModal.email, { tag })}
                    className={`px-3 py-1.5 rounded-full text-sm transition ${hasTag ? 'bg-amber-500/20 text-amber-400 border border-amber-500/50' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
                  >
                    {hasTag && <Check className="w-3 h-3 inline mr-1" />}{tag}
                  </button>
                )
              })}
            </div>
            <button onClick={() => setShowTagModal(null)} className="mt-6 w-full py-2 bg-slate-800 hover:bg-slate-700 rounded-xl">Done</button>
          </div>
        </div>
      )}

      {/* Bulk Tag Modal */}
      {showBulkModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Add Tag to {selectedMembers.size} Members</h3>
              <button onClick={() => setShowBulkModal(false)} className="text-slate-500 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="flex flex-wrap gap-2">
              {PRESET_TAGS.map(tag => (
                <button key={tag} onClick={() => handleBulkAction('addTag', tag)} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-full text-sm text-slate-300">
                  {tag}
                </button>
              ))}
            </div>
            <button onClick={() => setShowBulkModal(false)} className="mt-6 w-full py-2 bg-slate-800 hover:bg-slate-700 rounded-xl">Cancel</button>
          </div>
        </div>
      )}
    </div>
  )
}
