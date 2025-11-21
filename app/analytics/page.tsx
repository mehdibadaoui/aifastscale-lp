'use client'

import { useEffect, useState } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts'
import { TrendingUp, Package, Gift, Users, ArrowUpRight } from 'lucide-react'

interface Purchase {
  id: string
  timestamp: string
  sessionId: string | null
  productType: string
  spinGift: any
  selectedBonuses: Array<{
    id: string
    title: string
    category: string
  }>
}

interface Analytics {
  totalPurchases: number
  topBonuses: Array<{ title: string; count: number }>
  topGifts: Array<{ title: string; count: number }>
  categoryCounts: Record<string, number>
  averageBonusesPerPurchase: number
}

const COLORS = [
  '#7c3aed', // Purple
  '#ec4899', // Pink
  '#f59e0b', // Amber
  '#10b981', // Green
  '#3b82f6', // Blue
  '#ef4444', // Red
  '#8b5cf6', // Violet
  '#14b8a6', // Teal
  '#f97316', // Orange
  '#06b6d4', // Cyan
]

export default function AnalyticsPage() {
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [totalCount, setTotalCount] = useState(0)

  useEffect(() => {
    fetchAnalytics()
    // Refresh every 30 seconds
    const interval = setInterval(fetchAnalytics, 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/track-purchase')
      const data = await response.json()
      setPurchases(data.purchases || [])
      setAnalytics(data.analytics)
      setTotalCount(data.totalCount || 0)
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-black flex items-center justify-center">
        <div className="text-white text-2xl">Loading analytics...</div>
      </div>
    )
  }

  // Prepare data for category pie chart
  const categoryData = analytics?.categoryCounts
    ? Object.entries(analytics.categoryCounts).map(([name, value]) => ({
        name,
        value,
      }))
    : []

  // Time series data for purchases (group by date)
  const purchasesByDate = purchases.reduce((acc, purchase) => {
    const date = new Date(purchase.timestamp).toLocaleDateString()
    acc[date] = (acc[date] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const timeSeriesData = Object.entries(purchasesByDate).map(([date, count]) => ({
    date,
    purchases: count,
  }))

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-black p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <TrendingUp className="w-10 h-10 text-purple-400" />
            Analytics Dashboard
          </h1>
          <p className="text-purple-200">
            Real-time insights into your top-selling bonuses and customer preferences
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-200 text-sm mb-1">Total Purchases</p>
                <p className="text-white text-3xl font-bold">{totalCount}</p>
              </div>
              <Users className="w-12 h-12 text-purple-400 opacity-50" />
            </div>
            <div className="mt-2 flex items-center text-green-400 text-sm">
              <ArrowUpRight className="w-4 h-4 mr-1" />
              Live tracking
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-200 text-sm mb-1">Avg Bonuses/Sale</p>
                <p className="text-white text-3xl font-bold">
                  {(analytics?.averageBonusesPerPurchase ?? 0).toFixed(1)}
                </p>
              </div>
              <Package className="w-12 h-12 text-pink-400 opacity-50" />
            </div>
            <div className="mt-2 text-purple-200 text-sm">Per customer</div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-200 text-sm mb-1">Unique Bonuses</p>
                <p className="text-white text-3xl font-bold">
                  {analytics?.topBonuses.length || 0}
                </p>
              </div>
              <Gift className="w-12 h-12 text-amber-400 opacity-50" />
            </div>
            <div className="mt-2 text-purple-200 text-sm">Different products</div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-200 text-sm mb-1">Top Gift</p>
                <p className="text-white text-lg font-bold truncate">
                  {analytics?.topGifts?.[0]?.title || 'N/A'}
                </p>
              </div>
              <Gift className="w-12 h-12 text-green-400 opacity-50" />
            </div>
            <div className="mt-2 text-purple-200 text-sm">
              {analytics?.topGifts?.[0]?.count || 0} times
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Top Bonuses Bar Chart */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-purple-400" />
              Top Selling Bonuses
            </h2>
            {analytics?.topBonuses && analytics.topBonuses.length > 0 ? (
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={analytics.topBonuses}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis
                    dataKey="title"
                    angle={-45}
                    textAnchor="end"
                    height={120}
                    tick={{ fill: '#fff', fontSize: 12 }}
                  />
                  <YAxis tick={{ fill: '#fff' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(0,0,0,0.9)',
                      border: '1px solid rgba(124,58,237,0.5)',
                      borderRadius: '8px',
                    }}
                    labelStyle={{ color: '#fff' }}
                  />
                  <Legend wrapperStyle={{ color: '#fff' }} />
                  <Bar dataKey="count" fill="#7c3aed" radius={[8, 8, 0, 0]}>
                    {analytics.topBonuses.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[400px] flex items-center justify-center text-purple-200">
                No data yet. Start getting sales to see analytics!
              </div>
            )}
          </div>

          {/* Category Distribution Pie Chart */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <Package className="w-6 h-6 text-pink-400" />
              Category Distribution
            </h2>
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, percent }: any) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(0,0,0,0.9)',
                      border: '1px solid rgba(124,58,237,0.5)',
                      borderRadius: '8px',
                      color: '#fff',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[400px] flex items-center justify-center text-purple-200">
                No category data available
              </div>
            )}
          </div>
        </div>

        {/* Purchase Timeline */}
        {timeSeriesData.length > 0 && (
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 mb-8">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-green-400" />
              Purchase Timeline
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={timeSeriesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="date" tick={{ fill: '#fff', fontSize: 12 }} />
                <YAxis tick={{ fill: '#fff' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(0,0,0,0.9)',
                    border: '1px solid rgba(124,58,237,0.5)',
                    borderRadius: '8px',
                  }}
                  labelStyle={{ color: '#fff' }}
                />
                <Legend wrapperStyle={{ color: '#fff' }} />
                <Line
                  type="monotone"
                  dataKey="purchases"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ fill: '#10b981', r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Recent Purchases Table */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-400" />
            Recent Purchases ({purchases.length} shown)
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="pb-3 text-purple-200 font-semibold">Timestamp</th>
                  <th className="pb-3 text-purple-200 font-semibold">Spin Gift</th>
                  <th className="pb-3 text-purple-200 font-semibold">Bonuses Selected</th>
                  <th className="pb-3 text-purple-200 font-semibold text-center"># Bonuses</th>
                </tr>
              </thead>
              <tbody>
                {purchases.length > 0 ? (
                  purchases.map((purchase) => (
                    <tr key={purchase.id} className="border-b border-white/10">
                      <td className="py-3 text-white text-sm">
                        {new Date(purchase.timestamp).toLocaleString()}
                      </td>
                      <td className="py-3 text-purple-200 text-sm">
                        {purchase.spinGift?.title || purchase.spinGift || 'N/A'}
                      </td>
                      <td className="py-3 text-purple-200 text-sm">
                        <div className="flex flex-wrap gap-1">
                          {purchase.selectedBonuses.map((bonus, idx) => (
                            <span
                              key={idx}
                              className="bg-purple-500/30 px-2 py-1 rounded text-xs"
                            >
                              {bonus.title}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 text-white text-center font-semibold">
                        {purchase.selectedBonuses.length}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-purple-200">
                      No purchases yet. Data will appear here once customers start buying.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-purple-200 text-sm">
          <p>
            Last updated: {new Date().toLocaleString()} • Auto-refreshes every 30 seconds
          </p>
        </div>
      </div>
    </div>
  )
}
