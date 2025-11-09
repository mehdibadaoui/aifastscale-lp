'use client'

import { useState, useEffect } from 'react'
import { Calendar, TrendingUp, Users, Award, Bell, Flame, Target, Sparkles } from 'lucide-react'

// Sales Heatmap Component
export function SalesHeatmap({ sales }: { sales: any[] }) {
  const [heatmapData, setHeatmapData] = useState<Record<string, number>>({})

  useEffect(() => {
    const data: Record<string, number> = {}
    sales.forEach(sale => {
      const date = new Date(sale.timestamp * 1000)
      const dayOfWeek = date.getDay() // 0-6 (Sunday-Saturday)
      const hour = date.getHours() // 0-23
      const key = `${dayOfWeek}-${hour}`
      data[key] = (data[key] || 0) + 1
    })
    setHeatmapData(data)
  }, [sales])

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const hours = Array.from({ length: 24 }, (_, i) => i)
  const maxValue = Math.max(...Object.values(heatmapData), 1)

  const getColor = (value: number) => {
    if (value === 0) return 'bg-white/5'
    const intensity = (value / maxValue) * 100
    if (intensity > 75) return 'bg-green-500'
    if (intensity > 50) return 'bg-yellow-500'
    if (intensity > 25) return 'bg-orange-500'
    return 'bg-red-500/50'
  }

  return (
    <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 rounded-2xl p-6 border border-purple-500/20">
      <div className="flex items-center gap-3 mb-6">
        <Calendar className="w-6 h-6 text-purple-400" />
        <h3 className="text-xl font-bold text-white">Sales Heatmap</h3>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[600px]">
          <div className="grid grid-cols-[60px_repeat(24,1fr)] gap-1">
            <div></div>
            {hours.map(hour => (
              <div key={hour} className="text-xs text-white/60 text-center">
                {hour}h
              </div>
            ))}

            {days.map((day, dayIndex) => (
              <>
                <div key={`label-${day}`} className="text-sm text-white/80 flex items-center">
                  {day}
                </div>
                {hours.map(hour => {
                  const value = heatmapData[`${dayIndex}-${hour}`] || 0
                  return (
                    <div
                      key={`${dayIndex}-${hour}`}
                      className={`aspect-square rounded ${getColor(value)} transition-colors cursor-pointer hover:ring-2 hover:ring-white/50`}
                      title={`${day} ${hour}:00 - ${value} sales`}
                    />
                  )
                })}
              </>
            ))}
          </div>

          <div className="mt-4 flex items-center gap-4 text-sm">
            <span className="text-white/60">Less</span>
            <div className="flex gap-1">
              <div className="w-4 h-4 rounded bg-white/5"></div>
              <div className="w-4 h-4 rounded bg-red-500/50"></div>
              <div className="w-4 h-4 rounded bg-orange-500"></div>
              <div className="w-4 h-4 rounded bg-yellow-500"></div>
              <div className="w-4 h-4 rounded bg-green-500"></div>
            </div>
            <span className="text-white/60">More</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// Customer Lifetime Value Component
export function CLVTracker({ sales }: { sales: any[] }) {
  const [clvData, setClvData] = useState<{
    totalCustomers: number
    repeatCustomers: number
    avgClv: number
    topCustomers: Array<{ email: string; totalSpent: number; purchases: number }>
  }>({ totalCustomers: 0, repeatCustomers: 0, avgClv: 0, topCustomers: [] })

  useEffect(() => {
    const customerMap = new Map<string, { totalSpent: number; purchases: number }>()

    sales.forEach(sale => {
      const email = sale.email
      if (!customerMap.has(email)) {
        customerMap.set(email, { totalSpent: 0, purchases: 0 })
      }
      const customer = customerMap.get(email)!
      customer.totalSpent += sale.amount / 100
      customer.purchases += 1
    })

    const repeatCustomers = Array.from(customerMap.values()).filter(c => c.purchases > 1).length
    const totalRevenue = sales.reduce((sum, s) => sum + s.amount / 100, 0)
    const avgClv = customerMap.size > 0 ? totalRevenue / customerMap.size : 0

    const topCustomers = Array.from(customerMap.entries())
      .map(([email, data]) => ({ email, ...data }))
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, 5)

    setClvData({
      totalCustomers: customerMap.size,
      repeatCustomers,
      avgClv,
      topCustomers,
    })
  }, [sales])

  return (
    <div className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 rounded-2xl p-6 border border-blue-500/20">
      <div className="flex items-center gap-3 mb-6">
        <Users className="w-6 h-6 text-blue-400" />
        <h3 className="text-xl font-bold text-white">Customer Lifetime Value</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white/5 rounded-lg p-4">
          <div className="text-white/60 text-sm mb-1">Total Customers</div>
          <div className="text-2xl font-bold text-white">{clvData.totalCustomers}</div>
        </div>
        <div className="bg-white/5 rounded-lg p-4">
          <div className="text-white/60 text-sm mb-1">Repeat Customers</div>
          <div className="text-2xl font-bold text-green-400">{clvData.repeatCustomers}</div>
          <div className="text-xs text-white/60 mt-1">
            {clvData.totalCustomers > 0 ? ((clvData.repeatCustomers / clvData.totalCustomers) * 100).toFixed(1) : 0}% retention
          </div>
        </div>
        <div className="bg-white/5 rounded-lg p-4">
          <div className="text-white/60 text-sm mb-1">Avg CLV</div>
          <div className="text-2xl font-bold text-purple-400">${clvData.avgClv.toFixed(2)}</div>
        </div>
      </div>

      <div>
        <h4 className="text-white font-semibold mb-3">Top Customers 🏆</h4>
        <div className="space-y-2">
          {clvData.topCustomers.map((customer, index) => (
            <div key={customer.email} className="bg-white/5 rounded-lg p-3 border border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '🏅'}</span>
                  <div>
                    <div className="text-white font-medium text-sm">{customer.email}</div>
                    <div className="text-white/60 text-xs">{customer.purchases} purchases</div>
                  </div>
                </div>
                <div className="text-green-400 font-bold">${customer.totalSpent.toFixed(2)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Smart Alerts & Insights Component
export function SmartAlerts({ sales, todaySales, yesterdaySales }: {
  sales: any[]
  todaySales: number
  yesterdaySales: number
}) {
  const [insights, setInsights] = useState<string[]>([])

  useEffect(() => {
    const newInsights: string[] = []

    // Compare today vs yesterday
    if (todaySales > yesterdaySales) {
      const increase = ((todaySales - yesterdaySales) / Math.max(yesterdaySales, 1)) * 100
      newInsights.push(`🔥 You're on fire! Sales are up ${increase.toFixed(0)}% compared to yesterday!`)
    } else if (todaySales < yesterdaySales && yesterdaySales > 0) {
      newInsights.push(`📉 Sales are down today. Consider boosting ad spend or running a promotion.`)
    }

    // Check for sales streaks
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - i)
      date.setHours(0, 0, 0, 0)
      const dayStart = date.getTime() / 1000
      const dayEnd = dayStart + 86400
      return sales.filter(s => s.timestamp >= dayStart && s.timestamp < dayEnd).length
    })

    if (last7Days.every(day => day > 0)) {
      newInsights.push(`🎯 Amazing! You've made sales every day this week!`)
    }

    // Peak hour detection
    const hourCounts: Record<number, number> = {}
    sales.slice(0, 100).forEach(sale => {
      const hour = new Date(sale.timestamp * 1000).getHours()
      hourCounts[hour] = (hourCounts[hour] || 0) + 1
    })
    const peakHour = Object.entries(hourCounts).sort(([, a], [, b]) => b - a)[0]
    if (peakHour) {
      newInsights.push(`⏰ Peak sales hour: ${peakHour[0]}:00 - ${peakHour[1]} sales`)
    }

    // Weekend vs weekday
    const weekendSales = sales.filter(s => {
      const day = new Date(s.timestamp * 1000).getDay()
      return day === 0 || day === 6
    }).length
    const weekdaySales = sales.length - weekendSales
    if (weekendSales > weekdaySales * 0.5) {
      newInsights.push(`📅 Weekends perform well! Consider increasing weekend ad spend.`)
    }

    setInsights(newInsights)
  }, [sales, todaySales, yesterdaySales])

  if (insights.length === 0) return null

  return (
    <div className="bg-gradient-to-br from-yellow-900/20 to-orange-900/20 rounded-2xl p-6 border border-yellow-500/20">
      <div className="flex items-center gap-3 mb-4">
        <Sparkles className="w-6 h-6 text-yellow-400" />
        <h3 className="text-xl font-bold text-white">Smart Insights</h3>
      </div>

      <div className="space-y-3">
        {insights.map((insight, index) => (
          <div
            key={index}
            className="bg-yellow-500/10 rounded-lg p-4 border border-yellow-500/30 text-white"
          >
            {insight}
          </div>
        ))}
      </div>
    </div>
  )
}

// Gamification Component
export function GamificationPanel({ todayRevenue, goalRevenue = 500 }: {
  todayRevenue: number
  goalRevenue?: number
}) {
  const progress = Math.min((todayRevenue / goalRevenue) * 100, 100)
  const isGoalMet = todayRevenue >= goalRevenue

  const badges = [
    { name: 'First Sale', emoji: '🎉', unlocked: todayRevenue > 0 },
    { name: '$100 Day', emoji: '💯', unlocked: todayRevenue >= 100 },
    { name: '$500 Day', emoji: '🚀', unlocked: todayRevenue >= 500 },
    { name: '$1000 Day', emoji: '🏆', unlocked: todayRevenue >= 1000 },
  ]

  return (
    <div className="bg-gradient-to-br from-pink-900/20 to-purple-900/20 rounded-2xl p-6 border border-pink-500/20">
      <div className="flex items-center gap-3 mb-6">
        <Target className="w-6 h-6 text-pink-400" />
        <h3 className="text-xl font-bold text-white">Daily Goal</h3>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-white font-medium">${todayRevenue.toFixed(2)} / ${goalRevenue}</span>
          <span className="text-white/60 text-sm">{progress.toFixed(0)}%</span>
        </div>
        <div className="h-4 bg-white/10 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ${
              isGoalMet ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gradient-to-r from-pink-500 to-purple-500'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
        {isGoalMet && (
          <div className="mt-3 text-center">
            <span className="text-green-400 font-bold text-lg">🎉 Goal reached! Congratulations! 🎉</span>
          </div>
        )}
      </div>

      <div>
        <h4 className="text-white font-semibold mb-3">Achievements</h4>
        <div className="grid grid-cols-2 gap-2">
          {badges.map((badge) => (
            <div
              key={badge.name}
              className={`rounded-lg p-3 text-center transition ${
                badge.unlocked
                  ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/30'
                  : 'bg-white/5 border border-white/10 opacity-50'
              }`}
            >
              <div className="text-3xl mb-1">{badge.emoji}</div>
              <div className="text-white text-sm font-medium">{badge.name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
