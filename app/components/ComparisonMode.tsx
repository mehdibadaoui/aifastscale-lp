'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react'

interface PeriodData {
  sales: number
  revenue: number
  avgOrderValue: number
}

interface ComparisonData {
  current: PeriodData
  previous: PeriodData
  changes: {
    sales: { value: number; percentage: number }
    revenue: { value: number; percentage: number }
    avgOrderValue: { value: number; percentage: number }
  }
}

export default function ComparisonMode({
  currentPeriod = 'today',
  onPeriodChange
}: {
  currentPeriod?: string
  onPeriodChange?: (period: string) => void
}) {
  const [comparison, setComparison] = useState<ComparisonData | null>(null)
  const [loading, setLoading] = useState(true)

  const periods = [
    { value: 'today', label: 'Today vs Yesterday', current: 'Today', previous: 'Yesterday' },
    { value: 'week', label: 'This Week vs Last Week', current: 'This Week', previous: 'Last Week' },
    { value: 'month', label: 'This Month vs Last Month', current: 'This Month', previous: 'Last Month' },
  ]

  const currentPeriodData = periods.find(p => p.value === currentPeriod) || periods[0]

  useEffect(() => {
    fetchComparison()
  }, [currentPeriod])

  const fetchComparison = async () => {
    setLoading(true)
    try {
      // This would fetch from your sales API
      const response = await fetch('/api/get-sales')
      const data = await response.json()

      // Calculate current and previous period
      const current = currentPeriod === 'today' ? data.today :
                      currentPeriod === 'week' ? data.week : data.month
      const previous = currentPeriod === 'today' ? data.yesterday :
                       currentPeriod === 'week' ? data.lastWeek : data.month // You'd need lastMonth

      const currentData: PeriodData = {
        sales: current.sales,
        revenue: current.revenue / 100,
        avgOrderValue: current.sales > 0 ? (current.revenue / 100) / current.sales : 0,
      }

      const previousData: PeriodData = {
        sales: previous.sales,
        revenue: previous.revenue / 100,
        avgOrderValue: previous.sales > 0 ? (previous.revenue / 100) / previous.sales : 0,
      }

      const calculateChange = (current: number, previous: number) => {
        const value = current - previous
        const percentage = previous > 0 ? ((value / previous) * 100) : (current > 0 ? 100 : 0)
        return { value, percentage }
      }

      setComparison({
        current: currentData,
        previous: previousData,
        changes: {
          sales: calculateChange(currentData.sales, previousData.sales),
          revenue: calculateChange(currentData.revenue, previousData.revenue),
          avgOrderValue: calculateChange(currentData.avgOrderValue, previousData.avgOrderValue),
        },
      })
    } catch (error) {
      console.error('Error fetching comparison:', error)
    } finally {
      setLoading(false)
    }
  }

  const renderChangeIndicator = (change: { value: number; percentage: number }, isRevenue = false) => {
    const isPositive = change.value > 0
    const isNeutral = change.value === 0

    if (isNeutral) {
      return (
        <div className="flex items-center gap-2 text-gray-400">
          <Minus className="w-4 h-4" />
          <span className="font-semibold">No change</span>
        </div>
      )
    }

    return (
      <div className={`flex items-center gap-2 ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
        {isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
        <span className="font-semibold">
          {isPositive ? '+' : ''}{isRevenue ? '$' : ''}{Math.abs(change.value).toFixed(isRevenue ? 2 : 0)}
        </span>
        <span className="text-sm opacity-80">
          ({isPositive ? '+' : ''}{change.percentage.toFixed(1)}%)
        </span>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 rounded-2xl p-8 border border-blue-500/20 animate-pulse">
        <div className="h-8 bg-white/10 rounded w-1/3 mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="h-32 bg-white/10 rounded"></div>
          <div className="h-32 bg-white/10 rounded"></div>
          <div className="h-32 bg-white/10 rounded"></div>
        </div>
      </div>
    )
  }

  if (!comparison) return null

  return (
    <div className="space-y-4">
      {/* Period Selector */}
      <div className="flex items-center gap-3 flex-wrap">
        {periods.map((period) => (
          <button
            key={period.value}
            onClick={() => onPeriodChange?.(period.value)}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              currentPeriod === period.value
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
            }`}
          >
            {period.label}
          </button>
        ))}
      </div>

      {/* Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Sales Comparison */}
        <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl p-6 border border-blue-500/30">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white/80 text-sm font-medium">Sales</h3>
            <TrendingUp className="w-5 h-5 text-blue-400" />
          </div>

          <div className="space-y-3">
            <div>
              <div className="text-sm text-white/60">{currentPeriodData.current}</div>
              <div className="text-3xl font-bold text-white">{comparison.current.sales}</div>
            </div>

            <div>
              <div className="text-sm text-white/60">{currentPeriodData.previous}</div>
              <div className="text-xl text-white/80">{comparison.previous.sales}</div>
            </div>

            <div className="pt-3 border-t border-white/10">
              {renderChangeIndicator(comparison.changes.sales)}
            </div>
          </div>
        </div>

        {/* Revenue Comparison */}
        <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl p-6 border border-green-500/30">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white/80 text-sm font-medium">Revenue</h3>
            <TrendingUp className="w-5 h-5 text-green-400" />
          </div>

          <div className="space-y-3">
            <div>
              <div className="text-sm text-white/60">{currentPeriodData.current}</div>
              <div className="text-3xl font-bold text-white">${comparison.current.revenue.toFixed(2)}</div>
            </div>

            <div>
              <div className="text-sm text-white/60">{currentPeriodData.previous}</div>
              <div className="text-xl text-white/80">${comparison.previous.revenue.toFixed(2)}</div>
            </div>

            <div className="pt-3 border-t border-white/10">
              {renderChangeIndicator(comparison.changes.revenue, true)}
            </div>
          </div>
        </div>

        {/* Avg Order Value Comparison */}
        <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl p-6 border border-purple-500/30">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white/80 text-sm font-medium">Avg Order Value</h3>
            <TrendingUp className="w-5 h-5 text-purple-400" />
          </div>

          <div className="space-y-3">
            <div>
              <div className="text-sm text-white/60">{currentPeriodData.current}</div>
              <div className="text-3xl font-bold text-white">${comparison.current.avgOrderValue.toFixed(2)}</div>
            </div>

            <div>
              <div className="text-sm text-white/60">{currentPeriodData.previous}</div>
              <div className="text-xl text-white/80">${comparison.previous.avgOrderValue.toFixed(2)}</div>
            </div>

            <div className="pt-3 border-t border-white/10">
              {renderChangeIndicator(comparison.changes.avgOrderValue, true)}
            </div>
          </div>
        </div>
      </div>

      {/* Performance Summary */}
      <div className="bg-white/5 rounded-xl p-4">
        <h4 className="text-white font-semibold mb-2">Performance Summary</h4>
        <p className="text-white/70 text-sm">
          {comparison.changes.revenue.value >= 0 ? (
            <>
              <span className="text-green-400 font-semibold">Great job!</span> You're up{' '}
              <span className="text-white font-semibold">${Math.abs(comparison.changes.revenue.value).toFixed(2)}</span>{' '}
              ({comparison.changes.revenue.percentage.toFixed(1)}%) compared to {currentPeriodData.previous.toLowerCase()}.
              {comparison.changes.sales.value > 0 && ` You've made ${comparison.changes.sales.value} more sales!`}
            </>
          ) : (
            <>
              Revenue is down{' '}
              <span className="text-red-400 font-semibold">${Math.abs(comparison.changes.revenue.value).toFixed(2)}</span>{' '}
              ({Math.abs(comparison.changes.revenue.percentage).toFixed(1)}%) compared to {currentPeriodData.previous.toLowerCase()}.
              {' '}Consider reviewing your traffic sources and ad campaigns.
            </>
          )}
        </p>
      </div>
    </div>
  )
}
