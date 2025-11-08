'use client'

import { useEffect, useState } from 'react'

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
}

interface DashboardData {
  totalSales: number
  totalRevenue: number
  avgOrderValue: number
  today: { sales: number; revenue: number }
  yesterday: { sales: number; revenue: number }
  week: { sales: number; revenue: number }
  month: { sales: number; revenue: number }
  products: {
    main: { sales: number; revenue: number }
    upsell: { sales: number; revenue: number }
    downsell: { sales: number; revenue: number }
  }
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
    month: { sales: 0, revenue: 0 },
    products: {
      main: { sales: 0, revenue: 0 },
      upsell: { sales: 0, revenue: 0 },
      downsell: { sales: 0, revenue: 0 },
    },
    allSales: [],
    loading: true,
  })

  const [password, setPassword] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterProduct, setFilterProduct] = useState<string>('all')
  const [timePeriod, setTimePeriod] = useState<'today' | 'week' | 'month'>('today')

  const handleLogin = () => {
    if (password === 'mysales2024') {
      setIsAuthenticated(true)
      fetchSales()
    } else {
      alert('Wrong password!')
    }
  }

  const fetchSales = async () => {
    setData((prev) => ({ ...prev, loading: true }))
    try {
      const response = await fetch('/api/get-sales')
      const result = await response.json()
      setData({
        ...result,
        loading: false,
      })
    } catch (error) {
      console.error('Error fetching sales:', error)
      setData((prev) => ({ ...prev, loading: false }))
    }
  }

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

  // Filter sales
  const filteredSales = data.allSales.filter((sale) => {
    const matchesSearch =
      sale.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.product.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesProduct = filterProduct === 'all' || sale.productType === filterProduct
    return matchesSearch && matchesProduct
  })

  // Calculate comparison
  const todayVsYesterday =
    data.yesterday.revenue > 0
      ? ((data.today.revenue - data.yesterday.revenue) / data.yesterday.revenue) * 100
      : 0

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
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            onClick={handleLogin}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition shadow-lg"
          >
            Access Dashboard
          </button>
          <p className="text-white/40 text-sm mt-4 text-center">
            Default password: mysales2024
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Sales Dashboard</h1>
            <p className="text-white/70">Real-time analytics for your AI Fast Scale products</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={exportToCSV}
              className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition shadow-lg flex items-center gap-2"
            >
              <span>📥</span> Export CSV
            </button>
            <button
              onClick={fetchSales}
              className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition backdrop-blur-lg border border-white/20 flex items-center gap-2"
            >
              <span>🔄</span> Refresh
            </button>
          </div>
        </div>

        {/* Time Period Selector */}
        <div className="mb-6 flex gap-3 overflow-x-auto pb-2">
          {[
            { key: 'today', label: 'Today', icon: '📅' },
            { key: 'week', label: 'Last 7 Days', icon: '📊' },
            { key: 'month', label: 'Last 30 Days', icon: '📈' },
          ].map((period) => (
            <button
              key={period.key}
              onClick={() => setTimePeriod(period.key as any)}
              className={`px-6 py-3 rounded-xl font-medium transition whitespace-nowrap ${
                timePeriod === period.key
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                  : 'bg-white/10 text-white/80 hover:bg-white/20 border border-white/20'
              }`}
            >
              {period.icon} {period.label}
            </button>
          ))}
        </div>

        {/* Main Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Today's Sales */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 shadow-xl border border-white/20">
            <div className="flex items-center justify-between mb-2">
              <p className="text-blue-100 text-sm font-medium">
                {timePeriod === 'today' ? "Today's Sales" : timePeriod === 'week' ? 'Week Sales' : 'Month Sales'}
              </p>
              <span className="text-3xl">🛍️</span>
            </div>
            <p className="text-4xl font-bold text-white mb-1">
              {data[timePeriod].sales}
            </p>
            <p className="text-blue-100 text-sm">
              {timePeriod === 'today' && todayVsYesterday !== 0 && (
                <span className={todayVsYesterday > 0 ? 'text-green-300' : 'text-red-300'}>
                  {todayVsYesterday > 0 ? '↗' : '↘'} {Math.abs(todayVsYesterday).toFixed(1)}% vs yesterday
                </span>
              )}
            </p>
          </div>

          {/* Today's Revenue */}
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 shadow-xl border border-white/20">
            <div className="flex items-center justify-between mb-2">
              <p className="text-green-100 text-sm font-medium">
                {timePeriod === 'today' ? "Today's Revenue" : timePeriod === 'week' ? 'Week Revenue' : 'Month Revenue'}
              </p>
              <span className="text-3xl">💰</span>
            </div>
            <p className="text-4xl font-bold text-white mb-1">
              ${(data[timePeriod].revenue / 100).toFixed(2)}
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

        {/* Product Breakdown */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Product Breakdown</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Main Product */}
            <div className="bg-white/5 rounded-xl p-5 border border-white/10">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-2xl">
                  🎯
                </div>
                <div>
                  <p className="text-white/60 text-sm">Main Course ($37)</p>
                  <p className="text-white font-bold text-xl">{data.products.main.sales} sales</p>
                </div>
              </div>
              <div className="text-3xl font-bold text-white">
                ${(data.products.main.revenue / 100).toFixed(2)}
              </div>
              <div className="mt-2 h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500"
                  style={{
                    width: `${data.totalRevenue > 0 ? (data.products.main.revenue / data.totalRevenue) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>

            {/* Upsell */}
            <div className="bg-white/5 rounded-xl p-5 border border-white/10">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center text-2xl">
                  ⬆️
                </div>
                <div>
                  <p className="text-white/60 text-sm">Upsell ($17)</p>
                  <p className="text-white font-bold text-xl">{data.products.upsell.sales} sales</p>
                </div>
              </div>
              <div className="text-3xl font-bold text-white">
                ${(data.products.upsell.revenue / 100).toFixed(2)}
              </div>
              <div className="mt-2 h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-500"
                  style={{
                    width: `${data.totalRevenue > 0 ? (data.products.upsell.revenue / data.totalRevenue) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>

            {/* Downsell */}
            <div className="bg-white/5 rounded-xl p-5 border border-white/10">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center text-2xl">
                  ⬇️
                </div>
                <div>
                  <p className="text-white/60 text-sm">Downsell ($7)</p>
                  <p className="text-white font-bold text-xl">{data.products.downsell.sales} sales</p>
                </div>
              </div>
              <div className="text-3xl font-bold text-white">
                ${(data.products.downsell.revenue / 100).toFixed(2)}
              </div>
              <div className="mt-2 h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-orange-500"
                  style={{
                    width: `${data.totalRevenue > 0 ? (data.products.downsell.revenue / data.totalRevenue) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>
          </div>
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
            >
              <option value="all">All Products</option>
              <option value="main">Main Course Only</option>
              <option value="upsell">Upsell Only</option>
              <option value="downsell">Downsell Only</option>
            </select>
          </div>
        </div>

        {/* Sales Table */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 overflow-hidden">
          <div className="p-6 border-b border-white/20 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">All Sales</h2>
              <p className="text-white/60 text-sm mt-1">
                Showing {filteredSales.length} of {data.allSales.length} sales
              </p>
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
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white/80">Date & Time</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white/80">Customer</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white/80">Email</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white/80">Product</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white/80">Amount</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white/80">Payment</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white/80">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {filteredSales.map((sale) => (
                    <tr key={sale.id} className="hover:bg-white/5 transition">
                      <td className="px-6 py-4 text-white/90">
                        <div className="text-sm">
                          <div className="font-medium">{sale.date}</div>
                          <div className="text-white/60">{sale.time}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-white/90 font-medium">{sale.customerName}</td>
                      <td className="px-6 py-4 text-white/70 text-sm">{sale.email}</td>
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
                      <td className="px-6 py-4 text-white/90 font-bold text-lg">
                        ${(sale.amount / 100).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-white/70 text-sm capitalize">{sale.paymentMethod}</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-300 border border-green-500/30">
                          ✓ Paid
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer Stats */}
        <div className="mt-8 text-center text-white/40 text-sm">
          <p>Last updated: {new Date().toLocaleString()}</p>
        </div>
      </div>
    </div>
  )
}
