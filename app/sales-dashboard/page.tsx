'use client'

import { useEffect, useState } from 'react'

interface Sale {
  id: string
  email: string
  amount: number
  product: string
  date: string
  status: string
}

interface DashboardData {
  todaySales: number
  todayRevenue: number
  allSales: Sale[]
  loading: boolean
}

export default function SalesDashboard() {
  const [data, setData] = useState<DashboardData>({
    todaySales: 0,
    todayRevenue: 0,
    allSales: [],
    loading: true
  })
  const [password, setPassword] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const handleLogin = () => {
    // Simple password protection - change this password!
    if (password === 'mysales2024') {
      setIsAuthenticated(true)
      fetchSales()
    } else {
      alert('Wrong password!')
    }
  }

  const fetchSales = async () => {
    try {
      const response = await fetch('/api/get-sales')
      const result = await response.json()
      setData({
        todaySales: result.todaySales,
        todayRevenue: result.todayRevenue,
        allSales: result.allSales,
        loading: false
      })
    } catch (error) {
      console.error('Error fetching sales:', error)
      setData(prev => ({ ...prev, loading: false }))
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-md w-full border border-white/20">
          <h1 className="text-3xl font-bold text-white mb-6 text-center">
            🔒 Sales Dashboard
          </h1>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
            className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 mb-4"
          />
          <button
            onClick={handleLogin}
            className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition"
          >
            Login
          </button>
          <p className="text-white/50 text-sm mt-4 text-center">
            Default password: mysales2024
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">💰 Sales Dashboard</h1>
          <p className="text-white/70">Track your daily sales in real-time</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm font-medium mb-1">Today's Sales</p>
                <p className="text-5xl font-bold text-white">{data.todaySales}</p>
              </div>
              <div className="text-6xl">📊</div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm font-medium mb-1">Today's Revenue</p>
                <p className="text-5xl font-bold text-white">${(data.todayRevenue / 100).toFixed(2)}</p>
              </div>
              <div className="text-6xl">💵</div>
            </div>
          </div>
        </div>

        {/* Refresh Button */}
        <div className="mb-4 flex justify-end">
          <button
            onClick={fetchSales}
            className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-lg font-medium transition backdrop-blur-lg border border-white/20"
          >
            🔄 Refresh
          </button>
        </div>

        {/* Sales Table */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 overflow-hidden">
          <div className="p-6 border-b border-white/20">
            <h2 className="text-2xl font-bold text-white">Recent Sales</h2>
          </div>

          {data.loading ? (
            <div className="p-12 text-center text-white/50">
              <div className="animate-spin text-4xl mb-4">⏳</div>
              <p>Loading sales...</p>
            </div>
          ) : data.allSales.length === 0 ? (
            <div className="p-12 text-center text-white/50">
              <div className="text-4xl mb-4">📭</div>
              <p>No sales yet. Sales will appear here automatically!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white/80">Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white/80">Customer</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white/80">Product</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white/80">Amount</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white/80">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {data.allSales.map((sale) => (
                    <tr key={sale.id} className="hover:bg-white/5 transition">
                      <td className="px-6 py-4 text-white/90">{sale.date}</td>
                      <td className="px-6 py-4 text-white/90">{sale.email}</td>
                      <td className="px-6 py-4 text-white/90">{sale.product}</td>
                      <td className="px-6 py-4 text-white/90 font-semibold">${(sale.amount / 100).toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          sale.status === 'paid'
                            ? 'bg-green-500/20 text-green-300'
                            : 'bg-yellow-500/20 text-yellow-300'
                        }`}>
                          {sale.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
