'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, Globe, RefreshCw, Palette, Layout } from 'lucide-react'

// Revenue Forecasting Component
export function RevenueForecast({ dailySales }: { dailySales: Array<{ date: string; revenue: number }> }) {
  const [forecast, setForecast] = useState({ weekly: 0, monthly: 0, trend: 'up' as 'up' | 'down' | 'stable' })

  useEffect(() => {
    if (dailySales.length < 7) return

    // Calculate 7-day average
    const last7Days = dailySales.slice(0, 7)
    const avgDaily = last7Days.reduce((sum, day) => sum + day.revenue, 0) / 7

    // Project weekly and monthly
    const weeklyForecast = avgDaily * 7
    const monthlyForecast = avgDaily * 30

    // Detect trend
    const firstHalf = last7Days.slice(0, 3).reduce((sum, day) => sum + day.revenue, 0) / 3
    const secondHalf = last7Days.slice(4, 7).reduce((sum, day) => sum + day.revenue, 0) / 3
    const trend = secondHalf > firstHalf * 1.1 ? 'up' : secondHalf < firstHalf * 0.9 ? 'down' : 'stable'

    setForecast({ weekly: weeklyForecast, monthly: monthlyForecast, trend })
  }, [dailySales])

  return (
    <div className="bg-gradient-to-br from-cyan-900/20 to-blue-900/20 rounded-2xl p-6 border border-cyan-500/20">
      <div className="flex items-center gap-3 mb-6">
        <TrendingUp className="w-6 h-6 text-cyan-400" />
        <h3 className="text-xl font-bold text-white">Revenue Forecast</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white/5 rounded-lg p-4">
          <div className="text-white/60 text-sm mb-1">7-Day Projection</div>
          <div className="text-3xl font-bold text-white">${forecast.weekly.toFixed(2)}</div>
          <div className={`text-sm mt-2 flex items-center gap-2 ${
            forecast.trend === 'up' ? 'text-green-400' : forecast.trend === 'down' ? 'text-red-400' : 'text-yellow-400'
          }`}>
            {forecast.trend === 'up' ? '↗ Trending up' : forecast.trend === 'down' ? '↘ Trending down' : '→ Stable'}
          </div>
        </div>

        <div className="bg-white/5 rounded-lg p-4">
          <div className="text-white/60 text-sm mb-1">30-Day Projection</div>
          <div className="text-3xl font-bold text-white">${forecast.monthly.toFixed(2)}</div>
          <div className="text-white/60 text-xs mt-2">
            Based on last 7 days average
          </div>
        </div>
      </div>

      <div className="mt-4 bg-white/5 rounded-lg p-3 text-sm text-white/70">
        💡 <strong>Pro tip:</strong> {forecast.trend === 'up' ? 'Your sales are growing! Consider scaling your ads.' : forecast.trend === 'down' ? 'Sales are declining. Review your traffic sources and consider promotions.' : 'Sales are stable. Test new strategies to boost growth.'}
      </div>
    </div>
  )
}

// Conversion Funnel Component
export function ConversionFunnel({ data }: { data: {
  landingPageViews: number
  addToCart: number
  checkoutStarted: number
  mainSales: number
  upsellsAccepted: number
}}) {
  const stages = [
    { name: 'Landing Page Views', value: data.landingPageViews, icon: '👁️' },
    { name: 'Add to Cart', value: data.addToCart, icon: '🛒' },
    { name: 'Checkout Started', value: data.checkoutStarted, icon: '💳' },
    { name: 'Main Sale', value: data.mainSales, icon: '💰' },
    { name: 'Upsell Accepted', value: data.upsellsAccepted, icon: '🚀' },
  ]

  const getConversionRate = (current: number, previous: number) => {
    if (previous === 0) return 0
    return ((current / previous) * 100).toFixed(1)
  }

  return (
    <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 rounded-2xl p-6 border border-purple-500/20">
      <div className="flex items-center gap-3 mb-6">
        <TrendingUp className="w-6 h-6 text-purple-400" />
        <h3 className="text-xl font-bold text-white">Conversion Funnel</h3>
      </div>

      <div className="space-y-4">
        {stages.map((stage, index) => {
          const prevStage = index > 0 ? stages[index - 1] : null
          const conversionRate = prevStage ? getConversionRate(stage.value, prevStage.value) : 100
          const width = ((stage.value / stages[0].value) * 100).toFixed(0)

          return (
            <div key={stage.name}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{stage.icon}</span>
                  <span className="text-white font-medium">{stage.name}</span>
                </div>
                <div className="text-right">
                  <div className="text-white font-bold">{stage.value.toLocaleString()}</div>
                  {prevStage && (
                    <div className="text-xs text-white/60">{conversionRate}% conversion</div>
                  )}
                </div>
              </div>
              <div className="h-8 bg-white/5 rounded-lg overflow-hidden relative">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500 flex items-center justify-center"
                  style={{ width: `${width}%` }}
                >
                  <span className="text-white text-sm font-semibold">{width}%</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
        <div className="bg-green-500/10 rounded-lg p-3 border border-green-500/30">
          <div className="text-green-400 font-semibold">Overall Conversion</div>
          <div className="text-white text-2xl font-bold">
            {((data.mainSales / data.landingPageViews) * 100).toFixed(2)}%
          </div>
        </div>
        <div className="bg-blue-500/10 rounded-lg p-3 border border-blue-500/30">
          <div className="text-blue-400 font-semibold">Upsell Rate</div>
          <div className="text-white text-2xl font-bold">
            {data.mainSales > 0 ? ((data.upsellsAccepted / data.mainSales) * 100).toFixed(0) : 0}%
          </div>
        </div>
      </div>
    </div>
  )
}

// Geographic Data Component
export function GeographicInsights({ sales }: { sales: any[] }) {
  const [geoData, setGeoData] = useState<Array<{ country: string; sales: number; revenue: number }>>([])

  useEffect(() => {
    // Group by country from Stripe customer data
    const countryMap = new Map<string, { sales: number; revenue: number }>()

    sales.forEach(sale => {
      const country = sale.country || 'Unknown'
      if (!countryMap.has(country)) {
        countryMap.set(country, { sales: 0, revenue: 0 })
      }
      const data = countryMap.get(country)!
      data.sales += 1
      data.revenue += sale.amount / 100
    })

    const sorted = Array.from(countryMap.entries())
      .map(([country, data]) => ({ country, ...data }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10)

    setGeoData(sorted)
  }, [sales])

  // Country code to flag emoji mapping
  const countryFlags: Record<string, string> = {
    'US': '🇺🇸', 'GB': '🇬🇧', 'CA': '🇨🇦', 'AU': '🇦🇺',
    'AE': '🇦🇪', 'SA': '🇸🇦', 'IN': '🇮🇳', 'DE': '🇩🇪',
    'FR': '🇫🇷', 'ES': '🇪🇸', 'IT': '🇮🇹', 'NL': '🇳🇱',
    'SE': '🇸🇪', 'NO': '🇳🇴', 'DK': '🇩🇰', 'FI': '🇫🇮',
    'SG': '🇸🇬', 'MY': '🇲🇾', 'TH': '🇹🇭', 'PH': '🇵🇭',
    'ID': '🇮🇩', 'JP': '🇯🇵', 'KR': '🇰🇷', 'CN': '🇨🇳',
    'BR': '🇧🇷', 'MX': '🇲🇽', 'AR': '🇦🇷', 'EG': '🇪🇬',
    'ZA': '🇿🇦', 'NG': '🇳🇬', 'KE': '🇰🇪', 'Unknown': '🌍',
  }

  // Country code to name mapping
  const countryNames: Record<string, string> = {
    'US': 'United States', 'GB': 'United Kingdom', 'CA': 'Canada',
    'AU': 'Australia', 'AE': 'United Arab Emirates', 'SA': 'Saudi Arabia',
    'IN': 'India', 'DE': 'Germany', 'FR': 'France', 'ES': 'Spain',
    'IT': 'Italy', 'NL': 'Netherlands', 'SE': 'Sweden', 'NO': 'Norway',
    'DK': 'Denmark', 'FI': 'Finland', 'SG': 'Singapore', 'MY': 'Malaysia',
    'TH': 'Thailand', 'PH': 'Philippines', 'ID': 'Indonesia', 'JP': 'Japan',
    'KR': 'South Korea', 'CN': 'China', 'BR': 'Brazil', 'MX': 'Mexico',
    'AR': 'Argentina', 'EG': 'Egypt', 'ZA': 'South Africa', 'NG': 'Nigeria',
    'KE': 'Kenya', 'Unknown': 'Unknown',
  }

  return (
    <div className="bg-gradient-to-br from-green-900/20 to-teal-900/20 rounded-2xl p-6 border border-green-500/20">
      <div className="flex items-center gap-3 mb-6">
        <Globe className="w-6 h-6 text-green-400" />
        <h3 className="text-xl font-bold text-white">Geographic Distribution</h3>
      </div>

      <div className="space-y-3">
        {geoData.length > 0 ? (
          geoData.map((item, index) => {
            const countryCode = item.country
            const countryName = countryNames[countryCode] || countryCode
            const flagEmoji = countryFlags[countryCode] || '🌍'

            return (
              <div key={countryCode + index} className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{flagEmoji}</span>
                    <div>
                      <div className="text-white font-medium">{countryName}</div>
                      <div className="text-white/60 text-sm">{item.sales} sales</div>
                    </div>
                  </div>
                  <div className="text-green-400 font-bold text-lg">${item.revenue.toFixed(2)}</div>
                </div>
              </div>
            )
          })
        ) : (
          <div className="text-white/60 text-center py-8">
            Geographic data will appear here once you have sales
          </div>
        )}
      </div>
    </div>
  )
}

// Quick Stats Ticker
export function QuickStatsTicker({ stats }: {
  stats: {
    todaySales: number
    todayRevenue: number
    lastSaleTime: string
    activePromotion?: string
  }
}) {
  return (
    <div className="fixed top-0 left-0 right-0 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white py-2 px-4 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between text-sm overflow-hidden">
        <div className="animate-scroll-left flex items-center gap-8 whitespace-nowrap">
          <span>📊 Today's Sales: <strong>{stats.todaySales}</strong></span>
          <span>💰 Today's Revenue: <strong>${stats.todayRevenue.toFixed(2)}</strong></span>
          <span>🕐 Last Sale: <strong>{stats.lastSaleTime}</strong></span>
          {stats.activePromotion && <span>🔥 {stats.activePromotion}</span>}
          {/* Duplicate for seamless loop */}
          <span>📊 Today's Sales: <strong>{stats.todaySales}</strong></span>
          <span>💰 Today's Revenue: <strong>${stats.todayRevenue.toFixed(2)}</strong></span>
        </div>
      </div>
      <style jsx>{`
        @keyframes scroll-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll-left {
          animation: scroll-left 20s linear infinite;
        }
      `}</style>
    </div>
  )
}

// Refund Tracker Component
export function RefundTracker({ refunds }: { refunds: any[] }) {
  const totalRefunded = refunds.reduce((sum, r) => sum + r.amount / 100, 0)
  const refundRate = refunds.length // Would calculate properly with total sales

  return (
    <div className="bg-gradient-to-br from-red-900/20 to-orange-900/20 rounded-2xl p-6 border border-red-500/20">
      <div className="flex items-center gap-3 mb-6">
        <RefreshCw className="w-6 h-6 text-red-400" />
        <h3 className="text-xl font-bold text-white">Refunds</h3>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white/5 rounded-lg p-4">
          <div className="text-white/60 text-sm mb-1">Total Refunded</div>
          <div className="text-2xl font-bold text-red-400">${totalRefunded.toFixed(2)}</div>
        </div>
        <div className="bg-white/5 rounded-lg p-4">
          <div className="text-white/60 text-sm mb-1">Refund Count</div>
          <div className="text-2xl font-bold text-white">{refunds.length}</div>
        </div>
      </div>

      {refunds.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-white font-semibold text-sm mb-2">Recent Refunds</h4>
          {refunds.slice(0, 5).map((refund, index) => (
            <div key={index} className="bg-white/5 rounded-lg p-3 border border-white/10 text-sm">
              <div className="flex justify-between">
                <span className="text-white/80">{refund.customerEmail}</span>
                <span className="text-red-400 font-semibold">${(refund.amount / 100).toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Theme Switcher
export function ThemeSwitcher({ currentTheme, onThemeChange }: {
  currentTheme: string
  onThemeChange: (theme: string) => void
}) {
  const themes = [
    { name: 'Dark Purple', value: 'purple', gradient: 'from-purple-900 to-blue-900' },
    { name: 'Dark Blue', value: 'blue', gradient: 'from-blue-900 to-cyan-900' },
    { name: 'Dark Green', value: 'green', gradient: 'from-green-900 to-teal-900' },
    { name: 'Dark Red', value: 'red', gradient: 'from-red-900 to-orange-900' },
    { name: 'Cyberpunk', value: 'cyber', gradient: 'from-pink-900 via-purple-900 to-indigo-900' },
  ]

  return (
    <div className="bg-white/5 rounded-xl p-6 border border-white/10">
      <div className="flex items-center gap-3 mb-4">
        <Palette className="w-6 h-6 text-purple-400" />
        <h3 className="text-white font-semibold">Theme</h3>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {themes.map(theme => (
          <button
            key={theme.value}
            onClick={() => onThemeChange(theme.value)}
            className={`p-4 rounded-lg transition ${
              currentTheme === theme.value
                ? 'ring-2 ring-purple-500'
                : 'hover:ring-2 hover:ring-white/30'
            }`}
          >
            <div className={`h-12 rounded bg-gradient-to-br ${theme.gradient} mb-2`}></div>
            <div className="text-white text-xs font-medium">{theme.name}</div>
          </button>
        ))}
      </div>
    </div>
  )
}
