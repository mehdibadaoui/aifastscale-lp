'use client'

import { useEffect, useState, useCallback } from 'react'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

// Import all new dashboard components
import ROIDashboard from '../components/ROIDashboard'
import ComparisonMode from '../components/ComparisonMode'
import RealTimeUpdates from '../components/RealTimeUpdates'
import { SalesHeatmap, CLVTracker, SmartAlerts, GamificationPanel } from '../components/AdvancedAnalytics'
import { RevenueForecast, ConversionFunnel, GeographicInsights, QuickStatsTicker, RefundTracker, ThemeSwitcher } from '../components/FinalDashboardFeatures'

interface Sale {
  id: string
  sessionId: string
  email: string
  customerName: string
  amount: number
  product: string
  productType: string
  date: string
  time: string
  fullDate: string
  status: string
  paymentMethod: string
  timestamp: number
}

interface ChartDataPoint {
  date: string
  sales: number
  revenue: number
}

interface DashboardData {
  totalSales: number
  totalRevenue: number
  avgOrderValue: number
  today: { sales: number; revenue: number }
  yesterday: { sales: number; revenue: number }
  week: { sales: number; revenue: number }
  lastWeek: { sales: number; revenue: number }
  month: { sales: number; revenue: number }
  products: {
    main: { sales: number; revenue: number }
    upsell: { sales: number; revenue: number }
    downsell: { sales: number; revenue: number }
  }
  chartData: ChartDataPoint[]
  allSales: Sale[]
  loading: boolean
}

export default function SalesDashboard() {
  const [data, setData] = useState<DashboardData>({
    totalSales: 0,
    totalRevenue: 0,
    avgOrderValue: 0,
    today: { sales: 0, revenue: 0 },
    yesterday: { sales: 0, revenue: 0 },
    week: { sales: 0, revenue: 0 },
    lastWeek: { sales: 0, revenue: 0 },
    month: { sales: 0, revenue: 0 },
    products: {
      main: { sales: 0, revenue: 0 },
      upsell: { sales: 0, revenue: 0 },
      downsell: { sales: 0, revenue: 0 },
    },
    chartData: [],
    allSales: [],
    loading: true,
  })

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterProduct, setFilterProduct] = useState<string>('all')
  const [timePeriod, setTimePeriod] = useState<'today' | 'yesterday' | 'week' | 'month' | 'custom'>('today')
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
  const [customDateRange, setCustomDateRange] = useState({ start: '', end: '' })
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [revenueGoal, setRevenueGoal] = useState(500) // $500 default daily goal
  const [showStickyBar, setShowStickyBar] = useState(true)
  const [visibleColumns, setVisibleColumns] = useState({
    date: true,
    customer: true,
    email: true,
    product: true,
    amount: true,
    payment: true,
    status: true,
  })
  const [showColumnSettings, setShowColumnSettings] = useState(false)
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const [activeTab, setActiveTab] = useState<'overview' | 'sales' | 'analytics' | 'customers' | 'insights'>('overview')
  const [timezone, setTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone)
  const [notificationEmail, setNotificationEmail] = useState('')
  const [emailNotificationsEnabled, setEmailNotificationsEnabled] = useState(false)
  const [showNotificationSettings, setShowNotificationSettings] = useState(false)
  const [telegramBotToken, setTelegramBotToken] = useState('')
  const [telegramChatId, setTelegramChatId] = useState('')
  const [telegramNotificationsEnabled, setTelegramNotificationsEnabled] = useState(false)

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem('dashboardAuth')
    setEmail('')
    setPassword('')
  }

  const formatDateWithTimezone = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString('en-US', {
      timeZone: timezone,
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const handleLogin = () => {
    // Simple authentication - in production, use proper auth service
    const validCredentials = [
      { email: 'admin@aifastscale.com', password: 'mysales2024' },
      { email: 'demo@example.com', password: 'demo123' },
    ]

    const isValid = validCredentials.some(
      (cred) => cred.email === email && cred.password === password
    )

    if (isValid) {
      setIsAuthenticated(true)
      if (rememberMe) {
        localStorage.setItem('dashboardAuth', JSON.stringify({ email, timestamp: Date.now() }))
      }
      fetchSales()
    } else {
      alert('❌ Invalid email or password!')
    }
  }

  // Check for saved auth on mount
  useEffect(() => {
    const savedAuth = localStorage.getItem('dashboardAuth')
    if (savedAuth) {
      const { email: savedEmail, timestamp } = JSON.parse(savedAuth)
      const daysSince = (Date.now() - timestamp) / (1000 * 60 * 60 * 24)

      // Auto-login if saved within 7 days
      if (daysSince < 7) {
        setEmail(savedEmail)
        setIsAuthenticated(true)
        fetchSales()
      } else {
        localStorage.removeItem('dashboardAuth')
      }
    }
  }, [])

  const fetchSales = useCallback(async (startDate?: string, endDate?: string) => {
    setData((prev) => ({ ...prev, loading: true }))
    try {
      let url = '/api/get-sales'
      if (startDate && endDate) {
        url += `?startDate=${startDate}&endDate=${endDate}`
      }
      const response = await fetch(url)
      const result = await response.json()
      setData({
        ...result,
        loading: false,
      })
      setLastUpdated(new Date())
    } catch (error) {
      console.error('Error fetching sales:', error)
      setData((prev) => ({ ...prev, loading: false }))
    }
  }, [])

  const applyCustomDateRange = () => {
    if (customDateRange.start && customDateRange.end) {
      fetchSales(customDateRange.start, customDateRange.end)
      setShowDatePicker(false)
      setTimePeriod('custom')
    } else {
      alert('⚠️ Please select both start and end dates')
    }
  }

  // Register Service Worker for PWA
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registered:', registration)
        })
        .catch((error) => {
          console.log('Service Worker registration failed:', error)
        })
    }
  }, [])

  // Auto-refresh every 5 minutes
  useEffect(() => {
    if (!isAuthenticated) return

    const interval = setInterval(() => {
      if (timePeriod === 'custom' && customDateRange.start && customDateRange.end) {
        fetchSales(customDateRange.start, customDateRange.end)
      } else {
        fetchSales()
      }
    }, 5 * 60 * 1000) // 5 minutes

    return () => clearInterval(interval)
  }, [isAuthenticated, timePeriod, customDateRange, fetchSales])

  const exportToCSV = () => {
    const csv = [
      ['Date', 'Time', 'Customer Name', 'Email', 'Product', 'Amount', 'Payment Method'],
      ...filteredSales.map((sale) => [
        sale.date,
        sale.time,
        sale.customerName,
        sale.email,
        sale.product,
        `$${(sale.amount / 100).toFixed(2)}`,
        sale.paymentMethod,
      ]),
    ]
      .map((row) => row.join(','))
      .join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `sales-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  const exportToPDF = async () => {
    // Dynamic import to avoid SSR issues
    const { jsPDF } = await import('jspdf')
    const html2canvas = (await import('html2canvas')).default

    const pdf = new jsPDF('p', 'mm', 'a4')
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()

    // Add header
    pdf.setFontSize(20)
    pdf.text('📊 Sales Dashboard Report', 15, 20)
    pdf.setFontSize(10)
    pdf.text(`Generated: ${new Date().toLocaleString()}`, 15, 28)
    pdf.text(`Period: ${timePeriod === 'today' ? 'Today' : timePeriod === 'yesterday' ? 'Yesterday' : timePeriod === 'week' ? 'Last 7 Days' : timePeriod === 'month' ? 'Last 30 Days' : 'Custom Range'}`, 15, 33)

    // Add stats
    let yPos = 45
    pdf.setFontSize(14)
    pdf.text('Key Metrics', 15, yPos)
    yPos += 8

    pdf.setFontSize(10)
    const currentData = data[timePeriod === 'custom' ? 'month' : timePeriod]
    pdf.text(`Sales: ${currentData.sales}`, 20, yPos)
    pdf.text(`Revenue: $${(currentData.revenue / 100).toFixed(2)}`, 70, yPos)
    pdf.text(`Avg Order: $${(data.avgOrderValue / 100).toFixed(2)}`, 120, yPos)
    yPos += 8

    // Product breakdown
    pdf.setFontSize(12)
    pdf.text('Product Breakdown', 15, yPos)
    yPos += 7
    pdf.setFontSize(10)
    pdf.text(`Main Course: ${data.products.main.sales} sales - $${(data.products.main.revenue / 100).toFixed(2)}`, 20, yPos)
    yPos += 6
    pdf.text(`Upsell: ${data.products.upsell.sales} sales - $${(data.products.upsell.revenue / 100).toFixed(2)}`, 20, yPos)
    yPos += 6
    pdf.text(`Downsell: ${data.products.downsell.sales} sales - $${(data.products.downsell.revenue / 100).toFixed(2)}`, 20, yPos)
    yPos += 12

    // Add sales table
    pdf.setFontSize(12)
    pdf.text('Recent Sales', 15, yPos)
    yPos += 7

    // Table headers
    pdf.setFontSize(8)
    pdf.text('Date', 15, yPos)
    pdf.text('Customer', 40, yPos)
    pdf.text('Product', 80, yPos)
    pdf.text('Amount', 120, yPos)
    yPos += 5

    // Table rows (max 20)
    pdf.setFontSize(7)
    filteredSales.slice(0, 20).forEach((sale) => {
      if (yPos > pageHeight - 20) {
        pdf.addPage()
        yPos = 20
      }
      pdf.text(sale.date, 15, yPos)
      pdf.text(sale.customerName.substring(0, 20), 40, yPos)
      pdf.text(sale.product.substring(0, 20), 80, yPos)
      pdf.text(`$${(sale.amount / 100).toFixed(2)}`, 120, yPos)
      yPos += 5
    })

    // Save PDF
    pdf.save(`sales-report-${new Date().toISOString().split('T')[0]}.pdf`)
  }

  // Filter sales
  const filteredSales = data.allSales.filter((sale) => {
    const matchesSearch =
      sale.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.product.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesProduct = filterProduct === 'all' || sale.productType === filterProduct
    return matchesSearch && matchesProduct
  })

  // Calculate comparison percentages
  const todayVsYesterday =
    data.yesterday.revenue > 0
      ? ((data.today.revenue - data.yesterday.revenue) / data.yesterday.revenue) * 100
      : data.today.revenue > 0 ? 100 : 0

  const weekVsLastWeek =
    data.lastWeek.revenue > 0
      ? ((data.week.revenue - data.lastWeek.revenue) / data.lastWeek.revenue) * 100
      : data.week.revenue > 0 ? 100 : 0

  // Time since last update
  const getTimeSinceUpdate = () => {
    const seconds = Math.floor((new Date().getTime() - lastUpdated.getTime()) / 1000)
    if (seconds < 60) return `${seconds}s ago`
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    return `${hours}h ago`
  }

  // Product distribution for pie chart
  const productDistribution = [
    { name: 'Main Course', value: data.products.main.sales, revenue: data.products.main.revenue, color: '#3B82F6' },
    { name: 'Upsell', value: data.products.upsell.sales, revenue: data.products.upsell.revenue, color: '#A855F7' },
    { name: 'Downsell', value: data.products.downsell.sales, revenue: data.products.downsell.revenue, color: '#F97316' },
  ].filter(p => p.value > 0)

  // Customer insights
  const customerInsights = () => {
    const customerMap = new Map<string, { sales: number; revenue: number; purchases: Sale[] }>()

    data.allSales.forEach((sale) => {
      const email = sale.email
      if (!customerMap.has(email)) {
        customerMap.set(email, { sales: 0, revenue: 0, purchases: [] })
      }
      const customer = customerMap.get(email)!
      customer.sales += 1
      customer.revenue += sale.amount
      customer.purchases.push(sale)
    })

    const repeatCustomers = Array.from(customerMap.values()).filter(c => c.sales > 1).length
    const topCustomers = Array.from(customerMap.entries())
      .map(([email, data]) => ({ email, ...data }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5)

    return { repeatCustomers, topCustomers, totalUniqueCustomers: customerMap.size }
  }

  const insights = customerInsights()

  // Revenue goal progress
  const currentRevenue = data[timePeriod === 'custom' ? 'month' : timePeriod].revenue / 100
  const goalProgress = (currentRevenue / revenueGoal) * 100

  // Get last sale time
  const getLastSaleTime = () => {
    if (data.allSales.length === 0) return 'No sales yet'
    const lastSale = data.allSales[0]
    const saleTime = lastSale.timestamp * 1000
    const now = Date.now()
    const diff = Math.floor((now - saleTime) / 1000)

    if (diff < 60) return `${diff}s ago`
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
    return `${Math.floor(diff / 86400)}d ago`
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 max-w-md w-full border border-white/20 shadow-2xl">
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl mx-auto mb-4 flex items-center justify-center text-4xl">
              📊
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Sales Dashboard</h1>
            <p className="text-white/60">Analytics & Revenue Tracking</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-white/70 text-sm mb-2 block">Email Address</label>
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="text-white/70 text-sm mb-2 block">Password</label>
              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="remember-me"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded accent-purple-600"
              />
              <label htmlFor="remember-me" className="text-white/70 text-sm cursor-pointer">
                Remember me for 7 days
              </label>
            </div>

            <button
              onClick={handleLogin}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition shadow-lg"
            >
              🔐 Sign In
            </button>
          </div>

          <div className="mt-6 pt-6 border-t border-white/20">
            <p className="text-white/40 text-sm text-center mb-2">Demo Credentials:</p>
            <div className="bg-white/5 rounded-lg p-3 text-xs text-white/60 space-y-1">
              <p>📧 admin@aifastscale.com</p>
              <p>🔑 mysales2024</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen p-4 md:p-8 transition-colors ${
      theme === 'dark'
        ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900'
        : 'bg-gradient-to-br from-gray-100 via-blue-50 to-gray-100'
    }`}>
      {/* Sticky Top Stats Bar */}
      {showStickyBar && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 border-b border-white/20 shadow-2xl backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-6 flex-wrap text-sm">
              <div className="flex items-center gap-2 text-white font-semibold">
                <span className="text-lg">📊</span>
                <span>TODAY:</span>
              </div>
              <div className="flex items-center gap-2 text-white/90">
                <span className="font-bold text-lg">{data.today.sales}</span>
                <span>sales</span>
              </div>
              <div className="flex items-center gap-2 text-white/90">
                <span className="text-lg">💰</span>
                <span className="font-bold text-lg">${(data.today.revenue / 100).toFixed(2)}</span>
              </div>
              {todayVsYesterday !== 0 && (
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${todayVsYesterday > 0 ? 'bg-green-500/20 text-green-200' : 'bg-red-500/20 text-red-200'}`}>
                  <span>{todayVsYesterday > 0 ? '📈' : '📉'}</span>
                  <span className="font-semibold">{todayVsYesterday > 0 ? '+' : ''}{todayVsYesterday.toFixed(1)}%</span>
                  <span className="text-xs">vs yesterday</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-white/80 text-xs">
                <span>⏰</span>
                <span>Last sale: {getLastSaleTime()}</span>
              </div>
            </div>
            <button
              onClick={() => setShowStickyBar(false)}
              className="text-white/60 hover:text-white transition px-2"
              title="Hide sticky bar"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <div className={`max-w-7xl mx-auto ${showStickyBar ? 'mt-16' : ''}`}>
        {/* Header with last updated */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className={`text-4xl font-bold mb-2 flex items-center gap-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              📊 Sales Dashboard
              <span className={`text-sm font-normal ml-2 ${theme === 'dark' ? 'text-white/40' : 'text-gray-500'}`}>
                Updated {getTimeSinceUpdate()}
              </span>
            </h1>
            <p className={theme === 'dark' ? 'text-white/70' : 'text-gray-600'}>Real-time analytics for AI Fast Scale products</p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={handleLogout}
              className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition shadow-lg flex items-center gap-2"
              title="Sign out"
            >
              🚪 Logout
            </button>
            <button
              onClick={() => setShowNotificationSettings(!showNotificationSettings)}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition shadow-lg flex items-center gap-2"
              title="Email notification settings"
            >
              🔔 Alerts
            </button>
            <button
              onClick={toggleTheme}
              className={`px-6 py-2.5 rounded-xl font-medium transition shadow-lg flex items-center gap-2 ${
                theme === 'dark'
                  ? 'bg-yellow-500 hover:bg-yellow-600 text-gray-900'
                  : 'bg-slate-800 hover:bg-slate-900 text-white'
              }`}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
            <button
              onClick={exportToCSV}
              className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition shadow-lg flex items-center gap-2"
            >
              📥 CSV
            </button>
            <button
              onClick={exportToPDF}
              className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition shadow-lg flex items-center gap-2"
            >
              📄 PDF
            </button>
            <button
              onClick={() => fetchSales(timePeriod === 'custom' ? customDateRange.start : undefined, timePeriod === 'custom' ? customDateRange.end : undefined)}
              className={`px-6 py-2.5 rounded-xl font-medium transition backdrop-blur-lg border flex items-center gap-2 ${
                theme === 'dark'
                  ? 'bg-white/10 hover:bg-white/20 text-white border-white/20'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-900 border-gray-300'
              }`}
            >
              🔄 Refresh
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="flex gap-2 overflow-x-auto pb-2 border-b border-white/10">
            {[
              { key: 'overview', label: 'Overview', icon: '📊', desc: 'Key metrics & goals' },
              { key: 'sales', label: 'Sales', icon: '💰', desc: 'Detailed transactions' },
              { key: 'analytics', label: 'Analytics', icon: '📈', desc: 'ROI & traffic' },
              { key: 'customers', label: 'Customers', icon: '👥', desc: 'Demographics' },
              { key: 'insights', label: 'Insights', icon: '💡', desc: 'Forecasts & tips' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`px-6 py-3 rounded-t-xl font-medium transition flex-shrink-0 ${
                  activeTab === tab.key
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                    : theme === 'dark'
                    ? 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
              >
                <div className="flex flex-col items-center gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{tab.icon}</span>
                    <span>{tab.label}</span>
                  </div>
                  {activeTab === tab.key && (
                    <span className="text-xs text-white/80">{tab.desc}</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Time Period Selector and Timezone */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between mb-3">
            <div className="flex gap-3 overflow-x-auto pb-2 flex-wrap">
          {[
            { key: 'today', label: 'Today', icon: '📅' },
            { key: 'yesterday', label: 'Yesterday', icon: '📆' },
            { key: 'week', label: 'Last 7 Days', icon: '📊' },
            { key: 'month', label: 'Last 30 Days', icon: '📈' },
          ].map((period) => (
            <button
              key={period.key}
              onClick={() => {
                setTimePeriod(period.key as any)
                fetchSales()
              }}
              className={`px-6 py-3 rounded-xl font-medium transition whitespace-nowrap ${
                timePeriod === period.key
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                  : 'bg-white/10 text-white/80 hover:bg-white/20 border border-white/20'
              }`}
            >
              {period.icon} {period.label}
            </button>
          ))}
          <button
            onClick={() => setShowDatePicker(!showDatePicker)}
            className={`px-6 py-3 rounded-xl font-medium transition whitespace-nowrap ${
              timePeriod === 'custom'
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                : 'bg-white/10 text-white/80 hover:bg-white/20 border border-white/20'
            }`}
          >
            📅 Custom Range
          </button>
            </div>

            {/* Timezone Selector */}
            <div className="flex items-center gap-2">
              <label className="text-white/70 text-sm whitespace-nowrap">🌍 Timezone:</label>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                style={{ colorScheme: 'dark' }}
              >
                <option value="America/New_York" style={{ backgroundColor: '#1e293b', color: '#fff' }}>Eastern (ET)</option>
                <option value="America/Chicago" style={{ backgroundColor: '#1e293b', color: '#fff' }}>Central (CT)</option>
                <option value="America/Denver" style={{ backgroundColor: '#1e293b', color: '#fff' }}>Mountain (MT)</option>
                <option value="America/Los_Angeles" style={{ backgroundColor: '#1e293b', color: '#fff' }}>Pacific (PT)</option>
                <option value="Europe/London" style={{ backgroundColor: '#1e293b', color: '#fff' }}>London (GMT)</option>
                <option value="Europe/Paris" style={{ backgroundColor: '#1e293b', color: '#fff' }}>Paris (CET)</option>
                <option value="Asia/Dubai" style={{ backgroundColor: '#1e293b', color: '#fff' }}>Dubai (GST)</option>
                <option value="Asia/Tokyo" style={{ backgroundColor: '#1e293b', color: '#fff' }}>Tokyo (JST)</option>
                <option value="Australia/Sydney" style={{ backgroundColor: '#1e293b', color: '#fff' }}>Sydney (AEST)</option>
                <option value="UTC" style={{ backgroundColor: '#1e293b', color: '#fff' }}>UTC</option>
              </select>
            </div>
          </div>
        </div>

        {/* Custom Date Picker */}
        {showDatePicker && (
          <div className="mb-6 bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
            <h3 className="text-white font-semibold mb-4">📅 Select Custom Date Range</h3>
            <div className="flex gap-4 flex-wrap items-end">
              <div className="flex-1 min-w-[200px]">
                <label className="text-white/70 text-sm mb-2 block">Start Date</label>
                <input
                  type="date"
                  value={customDateRange.start}
                  onChange={(e) => setCustomDateRange({ ...customDateRange, start: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div className="flex-1 min-w-[200px]">
                <label className="text-white/70 text-sm mb-2 block">End Date</label>
                <input
                  type="date"
                  value={customDateRange.end}
                  onChange={(e) => setCustomDateRange({ ...customDateRange, end: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <button
                onClick={applyCustomDateRange}
                className="px-8 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-medium hover:from-purple-700 hover:to-blue-700 transition shadow-lg"
              >
                ✓ Apply
              </button>
            </div>
          </div>
        )}

        {/* Notification Settings */}
        {showNotificationSettings && (
          <div className="mb-6 bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold text-lg flex items-center gap-2">
                🔔 Notification Settings
              </h3>
              <button
                onClick={() => setShowNotificationSettings(false)}
                className="text-white/60 hover:text-white transition"
              >
                ✕
              </button>
            </div>
            <p className="text-white/60 text-sm mb-6">
              Get instant alerts when you make a sale. Choose between email or Telegram (or both!) 🚀
            </p>

            <div className="space-y-6">
              {/* Telegram Notifications */}
              <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl p-5 border border-blue-500/30">
                <div className="flex items-center gap-3 mb-4">
                  <input
                    type="checkbox"
                    checked={telegramNotificationsEnabled}
                    onChange={(e) => setTelegramNotificationsEnabled(e.target.checked)}
                    className="w-5 h-5 rounded accent-blue-600"
                    id="telegram-notifications-toggle"
                  />
                  <label htmlFor="telegram-notifications-toggle" className="text-white cursor-pointer font-semibold flex items-center gap-2">
                    <span className="text-xl">📱</span>
                    Enable Telegram notifications (RECOMMENDED!)
                  </label>
                </div>

                {telegramNotificationsEnabled && (
                  <div className="pl-8 space-y-4">
                    <div className="bg-blue-500/20 rounded-lg p-4 mb-4">
                      <p className="text-blue-200 text-sm font-semibold mb-2">🚀 Quick Setup Guide:</p>
                      <ol className="text-blue-100 text-xs space-y-1 list-decimal list-inside">
                        <li>Open Telegram and search for <span className="font-mono bg-blue-900/50 px-1 rounded">@BotFather</span></li>
                        <li>Send <span className="font-mono bg-blue-900/50 px-1 rounded">/newbot</span> and follow instructions to create your bot</li>
                        <li>Copy the Bot Token (looks like: 123456:ABC-DEF...)</li>
                        <li>Search for <span className="font-mono bg-blue-900/50 px-1 rounded">@userinfobot</span> on Telegram</li>
                        <li>Send any message to get your Chat ID (looks like: 123456789)</li>
                      </ol>
                    </div>

                    <div>
                      <label className="text-white/70 text-sm block mb-2">
                        Bot Token:
                      </label>
                      <input
                        type="text"
                        value={telegramBotToken}
                        onChange={(e) => setTelegramBotToken(e.target.value)}
                        placeholder="123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11"
                        className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                      />
                    </div>

                    <div>
                      <label className="text-white/70 text-sm block mb-2">
                        Your Chat ID:
                      </label>
                      <input
                        type="text"
                        value={telegramChatId}
                        onChange={(e) => setTelegramChatId(e.target.value)}
                        placeholder="123456789"
                        className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                      />
                    </div>

                    <button
                      onClick={() => {
                        if (telegramBotToken && telegramChatId) {
                          localStorage.setItem('telegramBotToken', telegramBotToken)
                          localStorage.setItem('telegramChatId', telegramChatId)
                          localStorage.setItem('telegramNotificationsEnabled', 'true')
                          alert('✅ Telegram notifications saved! Configure your Stripe webhook to start receiving alerts.')
                        } else {
                          alert('⚠️ Please enter both Bot Token and Chat ID')
                        }
                      }}
                      className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition shadow-lg"
                    >
                      💾 Save Telegram Settings
                    </button>
                  </div>
                )}
              </div>

              {/* Email Notifications */}
              <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl p-5 border border-purple-500/30">
                <div className="flex items-center gap-3 mb-4">
                  <input
                    type="checkbox"
                    checked={emailNotificationsEnabled}
                    onChange={(e) => setEmailNotificationsEnabled(e.target.checked)}
                    className="w-5 h-5 rounded accent-purple-600"
                    id="email-notifications-toggle"
                  />
                  <label htmlFor="email-notifications-toggle" className="text-white cursor-pointer font-semibold flex items-center gap-2">
                    <span className="text-xl">📧</span>
                    Enable email notifications
                  </label>
                </div>

                {emailNotificationsEnabled && (
                  <div className="pl-8 space-y-4">
                    <div>
                      <label className="text-white/70 text-sm block mb-2">
                        Notification Email:
                      </label>
                      <input
                        type="email"
                        value={notificationEmail}
                        onChange={(e) => setNotificationEmail(e.target.value)}
                        placeholder="your@email.com"
                        className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <p className="text-white/50 text-xs">
                      💡 Configure Stripe webhook to call an email service (Resend, SendGrid, Postmark)
                    </p>
                    <button
                      onClick={() => {
                        if (notificationEmail) {
                          localStorage.setItem('notificationEmail', notificationEmail)
                          localStorage.setItem('emailNotificationsEnabled', 'true')
                          alert('✅ Email notifications saved!')
                        }
                      }}
                      className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium transition shadow-lg"
                    >
                      💾 Save Email Settings
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Revenue Goal */}
        <div className="mb-6 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-xl rounded-2xl p-6 border border-yellow-500/30">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-white font-semibold text-lg">🎯 Revenue Goal ({timePeriod === 'today' || timePeriod === 'yesterday' ? 'Daily' : timePeriod === 'week' ? 'Weekly' : 'Monthly'})</h3>
              <p className="text-white/60 text-sm mt-1">
                ${currentRevenue.toFixed(2)} / ${revenueGoal.toFixed(2)}
                {goalProgress >= 100 ? ' 🎉 Goal Achieved!' : ` (${Math.floor((revenueGoal - currentRevenue) / (data.avgOrderValue / 100))} more sales needed)`}
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-white">{Math.min(goalProgress, 100).toFixed(0)}%</div>
              <input
                type="number"
                value={revenueGoal}
                onChange={(e) => setRevenueGoal(Number(e.target.value))}
                className="mt-2 px-3 py-1 rounded-lg bg-white/10 border border-white/20 text-white text-sm w-24 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                placeholder="Goal"
              />
            </div>
          </div>
          <div className="h-4 bg-white/10 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                goalProgress >= 100 ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gradient-to-r from-yellow-500 to-orange-500'
              }`}
              style={{ width: `${Math.min(goalProgress, 100)}%` }}
            />
          </div>
        </div>

        {/* Main Stats with Comparisons */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Sales */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 shadow-xl border border-white/20">
            <div className="flex items-center justify-between mb-2">
              <p className="text-blue-100 text-sm font-medium">
                {timePeriod === 'today' ? "Today's Sales" : timePeriod === 'yesterday' ? "Yesterday's Sales" : timePeriod === 'week' ? 'Week Sales' : timePeriod === 'month' ? 'Month Sales' : 'Custom Range Sales'}
              </p>
              <span className="text-3xl">🛒</span>
            </div>
            <p className="text-4xl font-bold text-white mb-1">
              {data[timePeriod === 'custom' ? 'month' : timePeriod].sales}
            </p>
            {timePeriod === 'today' && todayVsYesterday !== 0 && (
              <div className={`flex items-center gap-1 text-sm ${todayVsYesterday > 0 ? 'text-green-300' : 'text-red-300'}`}>
                <span>{todayVsYesterday > 0 ? '📈' : '📉'}</span>
                <span>{todayVsYesterday > 0 ? '+' : ''}{todayVsYesterday.toFixed(1)}% vs yesterday</span>
              </div>
            )}
          </div>

          {/* Revenue */}
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 shadow-xl border border-white/20">
            <div className="flex items-center justify-between mb-2">
              <p className="text-green-100 text-sm font-medium">
                {timePeriod === 'today' ? "Today's Revenue" : timePeriod === 'yesterday' ? "Yesterday's Revenue" : timePeriod === 'week' ? 'Week Revenue' : timePeriod === 'month' ? 'Month Revenue' : 'Custom Revenue'}
              </p>
              <span className="text-3xl">💰</span>
            </div>
            <p className="text-4xl font-bold text-white mb-1">
              ${(data[timePeriod === 'custom' ? 'month' : timePeriod].revenue / 100).toFixed(2)}
            </p>
            <p className="text-green-100 text-sm">Gross revenue</p>
          </div>

          {/* Average Order Value */}
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 shadow-xl border border-white/20">
            <div className="flex items-center justify-between mb-2">
              <p className="text-purple-100 text-sm font-medium">Avg Order Value</p>
              <span className="text-3xl">💳</span>
            </div>
            <p className="text-4xl font-bold text-white mb-1">
              ${(data.avgOrderValue / 100).toFixed(2)}
            </p>
            <p className="text-purple-100 text-sm">Per transaction</p>
          </div>

          {/* Total Sales (30 days) */}
          <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-6 shadow-xl border border-white/20">
            <div className="flex items-center justify-between mb-2">
              <p className="text-orange-100 text-sm font-medium">Total Sales (30d)</p>
              <span className="text-3xl">📦</span>
            </div>
            <p className="text-4xl font-bold text-white mb-1">{data.totalSales}</p>
            <p className="text-orange-100 text-sm">Last 30 days</p>
          </div>
        </div>

        {/* Week vs Last Week Comparison */}
        <div className="mb-8 bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            📊 Week vs Last Week Comparison
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* This Week */}
            <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl p-6 border border-blue-500/30">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold text-lg">This Week (Last 7 Days)</h3>
                <span className="text-3xl">📈</span>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-white/60 text-sm">Sales</p>
                  <p className="text-4xl font-bold text-white">{data.week.sales}</p>
                </div>
                <div>
                  <p className="text-white/60 text-sm">Revenue</p>
                  <p className="text-3xl font-bold text-white">${(data.week.revenue / 100).toFixed(2)}</p>
                </div>
              </div>
            </div>

            {/* Last Week */}
            <div className="bg-gradient-to-br from-gray-500/20 to-gray-600/20 rounded-xl p-6 border border-gray-500/30">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold text-lg">Previous Week</h3>
                <span className="text-3xl">📉</span>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-white/60 text-sm">Sales</p>
                  <p className="text-4xl font-bold text-white">{data.lastWeek.sales}</p>
                </div>
                <div>
                  <p className="text-white/60 text-sm">Revenue</p>
                  <p className="text-3xl font-bold text-white">${(data.lastWeek.revenue / 100).toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Comparison Stats */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/5 rounded-xl p-4 text-center">
              <p className="text-white/60 text-sm mb-2">Sales Change</p>
              <div className={`text-2xl font-bold ${data.week.sales - data.lastWeek.sales >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {data.week.sales - data.lastWeek.sales >= 0 ? '+' : ''}{data.week.sales - data.lastWeek.sales}
              </div>
            </div>
            <div className="bg-white/5 rounded-xl p-4 text-center">
              <p className="text-white/60 text-sm mb-2">Revenue Change</p>
              <div className={`text-2xl font-bold ${weekVsLastWeek >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {weekVsLastWeek >= 0 ? '+' : ''}{weekVsLastWeek.toFixed(1)}%
              </div>
            </div>
            <div className="bg-white/5 rounded-xl p-4 text-center">
              <p className="text-white/60 text-sm mb-2">Trend</p>
              <div className="text-3xl">
                {weekVsLastWeek > 10 ? '🚀' : weekVsLastWeek > 0 ? '📈' : weekVsLastWeek === 0 ? '➡️' : '📉'}
              </div>
            </div>
          </div>
        </div>

        {/* Real-Time Sale Notifications - Always visible */}
        <RealTimeUpdates onNewSale={() => fetchSales()} />

        {/* ═══════════════════════════════════════════ */}
        {/* OVERVIEW TAB */}
        {/* ═══════════════════════════════════════════ */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Gamification Panel */}
            <GamificationPanel
              todayRevenue={data.today.revenue / 100}
              todaySales={data.today.sales}
            />

            {/* Comparison Mode */}
            <ComparisonMode
              currentPeriod={timePeriod}
              onPeriodChange={(period) => setTimePeriod(period as any)}
            />

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Revenue Chart */}
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  📈 Revenue Trend (Last 7 Days)
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={data.chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="date" stroke="#fff" fontSize={12} />
                    <YAxis stroke="#fff" fontSize={12} />
                    <Tooltip
                      contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px' }}
                      labelStyle={{ color: '#fff' }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={3} name="Revenue ($)" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Sales Chart */}
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  📊 Sales Count (Last 7 Days)
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={data.chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="date" stroke="#fff" fontSize={12} />
                    <YAxis stroke="#fff" fontSize={12} />
                    <Tooltip
                      contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px' }}
                      labelStyle={{ color: '#fff' }}
                    />
                    <Legend />
                    <Bar dataKey="sales" fill="#3B82F6" name="Sales" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Product Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Pie Chart */}
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  🥧 Product Distribution
                </h2>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={productDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) => `${entry.name}: ${entry.value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {productDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px' }}
                      labelStyle={{ color: '#fff' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Product Stats Cards */}
              <div className="lg:col-span-2">
                <h2 className="text-2xl font-bold text-white mb-6">💼 Product Breakdown</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Main Product */}
                  <div className="bg-white/5 rounded-xl p-5 border border-white/10 hover:bg-white/10 transition">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-2xl">
                        🎯
                      </div>
                      <div>
                        <p className="text-white/60 text-sm">Main Course ($37)</p>
                        <p className="text-white font-bold text-xl">{data.products.main.sales} sales</p>
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-white mb-2">
                      ${(data.products.main.revenue / 100).toFixed(2)}
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 transition-all duration-500"
                        style={{
                          width: `${data.totalRevenue > 0 ? (data.products.main.revenue / data.totalRevenue) * 100 : 0}%`,
                        }}
                      />
                    </div>
                    <p className="text-white/50 text-xs mt-2">
                      {data.totalRevenue > 0 ? ((data.products.main.revenue / data.totalRevenue) * 100).toFixed(0) : 0}% of total revenue
                    </p>
                  </div>

                  {/* Upsell */}
                  <div className="bg-white/5 rounded-xl p-5 border border-white/10 hover:bg-white/10 transition">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center text-2xl">
                        ⬆️
                      </div>
                      <div>
                        <p className="text-white/60 text-sm">Upsell ($17)</p>
                        <p className="text-white font-bold text-xl">{data.products.upsell.sales} sales</p>
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-white mb-2">
                      ${(data.products.upsell.revenue / 100).toFixed(2)}
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-purple-500 transition-all duration-500"
                        style={{
                          width: `${data.totalRevenue > 0 ? (data.products.upsell.revenue / data.totalRevenue) * 100 : 0}%`,
                        }}
                      />
                    </div>
                    <p className="text-white/50 text-xs mt-2">
                      {data.totalRevenue > 0 ? ((data.products.upsell.revenue / data.totalRevenue) * 100).toFixed(0) : 0}% of total revenue
                    </p>
                  </div>

                  {/* Downsell */}
                  <div className="bg-white/5 rounded-xl p-5 border border-white/10 hover:bg-white/10 transition">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center text-2xl">
                        ⬇️
                      </div>
                      <div>
                        <p className="text-white/60 text-sm">Downsell ($7)</p>
                        <p className="text-white font-bold text-xl">{data.products.downsell.sales} sales</p>
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-white mb-2">
                      ${(data.products.downsell.revenue / 100).toFixed(2)}
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-orange-500 transition-all duration-500"
                        style={{
                          width: `${data.totalRevenue > 0 ? (data.products.downsell.revenue / data.totalRevenue) * 100 : 0}%`,
                        }}
                      />
                    </div>
                    <p className="text-white/50 text-xs mt-2">
                      {data.totalRevenue > 0 ? ((data.products.downsell.revenue / data.totalRevenue) * 100).toFixed(0) : 0}% of total revenue
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════ */}
        {/* SALES TAB */}
        {/* ═══════════════════════════════════════════ */}
        {activeTab === 'sales' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="🔍 Search by email, name, or product..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <select
                  value={filterProduct}
                  onChange={(e) => setFilterProduct(e.target.value)}
                  className="px-6 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  style={{ colorScheme: 'dark' }}
                >
                  <option value="all" style={{ backgroundColor: '#1e293b', color: '#fff' }}>All Products</option>
                  <option value="main" style={{ backgroundColor: '#1e293b', color: '#fff' }}>Main Course Only</option>
                  <option value="upsell" style={{ backgroundColor: '#1e293b', color: '#fff' }}>Upsell Only</option>
                  <option value="downsell" style={{ backgroundColor: '#1e293b', color: '#fff' }}>Downsell Only</option>
                </select>
              </div>
            </div>

            {/* Sales Table will be added here from below */}
          </div>
        )}

        {/* ═══════════════════════════════════════════ */}
        {/* ANALYTICS TAB */}
        {/* ═══════════════════════════════════════════ */}
        {activeTab === 'analytics' && (
          <div className="space-y-8">
            {/* ROI Dashboard */}
            <ROIDashboard days={30} />

            {/* Conversion Funnel */}
            <ConversionFunnel
              data={{
                landingPageViews: 1000,
                addToCart: 300,
                checkoutStarted: 200,
                mainSales: data.products.main.sales,
                upsellsAccepted: data.products.upsell.sales + data.products.downsell.sales,
              }}
            />
          </div>
        )}

        {/* ═══════════════════════════════════════════ */}
        {/* CUSTOMERS TAB */}
        {/* ═══════════════════════════════════════════ */}
        {activeTab === 'customers' && (
          <div className="space-y-8">
            {/* CLV Tracker */}
            <CLVTracker sales={data.allSales} />

            {/* Geographic Insights */}
            <GeographicInsights sales={data.allSales} />

            {/* Refund Tracker */}
            <RefundTracker refunds={[]} />
          </div>
        )}

        {/* ═══════════════════════════════════════════ */}
        {/* INSIGHTS TAB */}
        {/* ═══════════════════════════════════════════ */}
        {activeTab === 'insights' && (
          <div className="space-y-8">
            {/* Smart Alerts & Insights */}
            <SmartAlerts
              sales={data.allSales}
              todaySales={data.today.sales}
              yesterdaySales={data.yesterday.sales}
            />

            {/* Revenue Forecast */}
            <RevenueForecast dailySales={data.chartData} />

            {/* Sales Heatmap */}
            <SalesHeatmap sales={data.allSales} />
          </div>
        )}

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Revenue Chart */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              📈 Revenue Trend (Last 7 Days)
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="date" stroke="#fff" fontSize={12} />
                <YAxis stroke="#fff" fontSize={12} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px' }}
                  labelStyle={{ color: '#fff' }}
                />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={3} name="Revenue ($)" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Sales Chart */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              📊 Sales Count (Last 7 Days)
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="date" stroke="#fff" fontSize={12} />
                <YAxis stroke="#fff" fontSize={12} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px' }}
                  labelStyle={{ color: '#fff' }}
                />
                <Legend />
                <Bar dataKey="sales" fill="#3B82F6" name="Sales" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Product Breakdown with Pie Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Pie Chart */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              🥧 Product Distribution
            </h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={productDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: ${entry.value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {productDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Product Stats Cards */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-white mb-6">💼 Product Breakdown</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Main Product */}
              <div className="bg-white/5 rounded-xl p-5 border border-white/10 hover:bg-white/10 transition">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-2xl">
                    🎯
                  </div>
                  <div>
                    <p className="text-white/60 text-sm">Main Course ($37)</p>
                    <p className="text-white font-bold text-xl">{data.products.main.sales} sales</p>
                  </div>
                </div>
                <div className="text-3xl font-bold text-white mb-2">
                  ${(data.products.main.revenue / 100).toFixed(2)}
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 transition-all duration-500"
                    style={{
                      width: `${data.totalRevenue > 0 ? (data.products.main.revenue / data.totalRevenue) * 100 : 0}%`,
                    }}
                  />
                </div>
                <p className="text-white/50 text-xs mt-2">
                  {data.totalRevenue > 0 ? ((data.products.main.revenue / data.totalRevenue) * 100).toFixed(0) : 0}% of total revenue
                </p>
              </div>

              {/* Upsell */}
              <div className="bg-white/5 rounded-xl p-5 border border-white/10 hover:bg-white/10 transition">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center text-2xl">
                    ⬆️
                  </div>
                  <div>
                    <p className="text-white/60 text-sm">Upsell ($17)</p>
                    <p className="text-white font-bold text-xl">{data.products.upsell.sales} sales</p>
                  </div>
                </div>
                <div className="text-3xl font-bold text-white mb-2">
                  ${(data.products.upsell.revenue / 100).toFixed(2)}
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-500 transition-all duration-500"
                    style={{
                      width: `${data.totalRevenue > 0 ? (data.products.upsell.revenue / data.totalRevenue) * 100 : 0}%`,
                    }}
                  />
                </div>
                <p className="text-white/50 text-xs mt-2">
                  {data.totalRevenue > 0 ? ((data.products.upsell.revenue / data.totalRevenue) * 100).toFixed(0) : 0}% of total revenue
                </p>
              </div>

              {/* Downsell */}
              <div className="bg-white/5 rounded-xl p-5 border border-white/10 hover:bg-white/10 transition">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center text-2xl">
                    ⬇️
                  </div>
                  <div>
                    <p className="text-white/60 text-sm">Downsell ($7)</p>
                    <p className="text-white font-bold text-xl">{data.products.downsell.sales} sales</p>
                  </div>
                </div>
                <div className="text-3xl font-bold text-white mb-2">
                  ${(data.products.downsell.revenue / 100).toFixed(2)}
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-orange-500 transition-all duration-500"
                    style={{
                      width: `${data.totalRevenue > 0 ? (data.products.downsell.revenue / data.totalRevenue) * 100 : 0}%`,
                    }}
                  />
                </div>
                <p className="text-white/50 text-xs mt-2">
                  {data.totalRevenue > 0 ? ((data.products.downsell.revenue / data.totalRevenue) * 100).toFixed(0) : 0}% of total revenue
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Insights */}
        <div className="mb-8 bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            👥 Customer Insights
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Total Unique Customers */}
            <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl p-5 border border-blue-500/30">
              <div className="flex items-center justify-between mb-3">
                <p className="text-white/70 text-sm">Unique Customers</p>
                <span className="text-2xl">👤</span>
              </div>
              <p className="text-4xl font-bold text-white">{insights.totalUniqueCustomers}</p>
              <p className="text-white/50 text-xs mt-2">Total unique buyers</p>
            </div>

            {/* Repeat Customers */}
            <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl p-5 border border-purple-500/30">
              <div className="flex items-center justify-between mb-3">
                <p className="text-white/70 text-sm">Repeat Customers</p>
                <span className="text-2xl">🔄</span>
              </div>
              <p className="text-4xl font-bold text-white">{insights.repeatCustomers}</p>
              <p className="text-white/50 text-xs mt-2">
                {insights.totalUniqueCustomers > 0 ? ((insights.repeatCustomers / insights.totalUniqueCustomers) * 100).toFixed(1) : 0}% return rate
              </p>
            </div>

            {/* Average Sales Per Customer */}
            <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl p-5 border border-green-500/30">
              <div className="flex items-center justify-between mb-3">
                <p className="text-white/70 text-sm">Avg Sales/Customer</p>
                <span className="text-2xl">📊</span>
              </div>
              <p className="text-4xl font-bold text-white">
                {insights.totalUniqueCustomers > 0 ? (data.totalSales / insights.totalUniqueCustomers).toFixed(1) : '0'}
              </p>
              <p className="text-white/50 text-xs mt-2">Sales per unique customer</p>
            </div>
          </div>

          {/* Top Customers */}
          {insights.topCustomers.length > 0 && (
            <div>
              <h3 className="text-white font-semibold mb-4">🏆 Top 5 Customers by Revenue</h3>
              <div className="space-y-3">
                {insights.topCustomers.map((customer, index) => (
                  <div
                    key={customer.email}
                    className="bg-white/5 rounded-xl p-4 flex items-center justify-between hover:bg-white/10 transition"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center font-bold text-white">
                        #{index + 1}
                      </div>
                      <div>
                        <p className="text-white font-medium">{customer.email}</p>
                        <p className="text-white/60 text-sm">{customer.sales} purchase{customer.sales > 1 ? 's' : ''}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-white">${(customer.revenue / 100).toFixed(2)}</p>
                      <p className="text-white/50 text-xs">Total revenue</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="🔍 Search by email, name, or product..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <select
              value={filterProduct}
              onChange={(e) => setFilterProduct(e.target.value)}
              className="px-6 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              style={{ colorScheme: 'dark' }}
            >
              <option value="all" style={{ backgroundColor: '#1e293b', color: '#fff' }}>All Products</option>
              <option value="main" style={{ backgroundColor: '#1e293b', color: '#fff' }}>Main Course Only</option>
              <option value="upsell" style={{ backgroundColor: '#1e293b', color: '#fff' }}>Upsell Only</option>
              <option value="downsell" style={{ backgroundColor: '#1e293b', color: '#fff' }}>Downsell Only</option>
            </select>
          </div>
        </div>

        {/* Sales Table */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 overflow-hidden">
          <div className="p-6 border-b border-white/20 flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                📋 All Sales
              </h2>
              <p className="text-white/60 text-sm mt-1">
                Showing {filteredSales.length} of {data.allSales.length} sales
              </p>
            </div>

            {/* Column Settings */}
            <div className="relative">
              <button
                onClick={() => setShowColumnSettings(!showColumnSettings)}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition backdrop-blur-lg border border-white/20 flex items-center gap-2"
              >
                ⚙️ Columns
              </button>

              {showColumnSettings && (
                <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-white/20 rounded-xl shadow-2xl p-4 z-10">
                  <h3 className="text-white font-semibold mb-3 text-sm">Show/Hide Columns</h3>
                  <div className="space-y-2">
                    {Object.keys(visibleColumns).map((col) => (
                      <label key={col} className="flex items-center gap-2 cursor-pointer hover:bg-white/5 p-2 rounded-lg transition">
                        <input
                          type="checkbox"
                          checked={visibleColumns[col as keyof typeof visibleColumns]}
                          onChange={(e) =>
                            setVisibleColumns({ ...visibleColumns, [col]: e.target.checked })
                          }
                          className="w-4 h-4 rounded accent-purple-600"
                        />
                        <span className="text-white/80 text-sm capitalize">{col === 'date' ? 'Date & Time' : col}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {data.loading ? (
            <div className="p-12 text-center text-white/50">
              <div className="animate-spin text-5xl mb-4">⏳</div>
              <p className="text-lg">Loading sales data...</p>
            </div>
          ) : filteredSales.length === 0 ? (
            <div className="p-12 text-center text-white/50">
              <div className="text-5xl mb-4">📭</div>
              <p className="text-lg">
                {searchTerm || filterProduct !== 'all'
                  ? 'No sales match your filters'
                  : 'No sales yet. Sales will appear here automatically!'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5">
                  <tr>
                    {visibleColumns.date && <th className="px-6 py-4 text-left text-sm font-semibold text-white/80">Date & Time</th>}
                    {visibleColumns.customer && <th className="px-6 py-4 text-left text-sm font-semibold text-white/80">Customer</th>}
                    {visibleColumns.email && <th className="px-6 py-4 text-left text-sm font-semibold text-white/80">Email</th>}
                    {visibleColumns.product && <th className="px-6 py-4 text-left text-sm font-semibold text-white/80">Product</th>}
                    {visibleColumns.amount && <th className="px-6 py-4 text-left text-sm font-semibold text-white/80">Amount</th>}
                    {visibleColumns.payment && <th className="px-6 py-4 text-left text-sm font-semibold text-white/80">Payment</th>}
                    {visibleColumns.status && <th className="px-6 py-4 text-left text-sm font-semibold text-white/80">Status</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {filteredSales.map((sale) => (
                    <tr key={sale.id} className="hover:bg-white/5 transition">
                      {visibleColumns.date && (
                        <td className="px-6 py-4 text-white/90">
                          <div className="text-sm">
                            <div className="font-medium">{sale.date}</div>
                            <div className="text-white/60">{sale.time}</div>
                          </div>
                        </td>
                      )}
                      {visibleColumns.customer && <td className="px-6 py-4 text-white/90 font-medium">{sale.customerName}</td>}
                      {visibleColumns.email && <td className="px-6 py-4 text-white/70 text-sm">{sale.email}</td>}
                      {visibleColumns.product && (
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              sale.productType === 'main'
                                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                                : sale.productType === 'upsell'
                                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                                : 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                            }`}
                          >
                            {sale.product}
                          </span>
                        </td>
                      )}
                      {visibleColumns.amount && (
                        <td className="px-6 py-4 text-white/90 font-bold text-lg">
                          ${(sale.amount / 100).toFixed(2)}
                        </td>
                      )}
                      {visibleColumns.payment && <td className="px-6 py-4 text-white/70 text-sm capitalize">{sale.paymentMethod}</td>}
                      {visibleColumns.status && (
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-300 border border-green-500/30">
                            ✓ Paid
                          </span>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer Stats */}
        <div className="mt-8 text-center text-white/40 text-sm">
          <p>Last updated: {lastUpdated.toLocaleString()} • Auto-refresh every 5 minutes</p>
        </div>
      </div>
    </div>
  )
}
