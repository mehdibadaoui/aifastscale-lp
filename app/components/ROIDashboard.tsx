'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, DollarSign, Target, Zap, AlertCircle } from 'lucide-react'

interface ChannelData {
  channel: string
  sales: number
  revenue: number
  spend: number
  profit: number
  roi: number
  roas: number
  cpa: number
  customers: number
}

interface ROIData {
  channels: ChannelData[]
  totals: any
  adSpendConfigured: {
    facebook: boolean
    google: boolean
  }
}

export default function ROIDashboard({ days = 30 }: { days?: number }) {
  const [data, setData] = useState<ROIData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchROIData()
  }, [days])

  const fetchROIData = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/analytics-roi?days=${days}`)
      const result = await response.json()
      if (result.success) {
        setData(result)
      } else {
        setError(result.error || 'Failed to fetch ROI data')
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 rounded-2xl p-8 border border-purple-500/20">
        <div className="animate-pulse">
          <div className="h-8 bg-white/10 rounded w-1/3 mb-6"></div>
          <div className="space-y-4">
            <div className="h-20 bg-white/10 rounded"></div>
            <div className="h-20 bg-white/10 rounded"></div>
            <div className="h-20 bg-white/10 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-900/20 rounded-2xl p-8 border border-red-500/20">
        <div className="flex items-center gap-3 mb-4">
          <AlertCircle className="w-6 h-6 text-red-400" />
          <h3 className="text-xl font-bold text-white">Error Loading ROI Data</h3>
        </div>
        <p className="text-red-200">{error}</p>
        <button
          onClick={fetchROIData}
          className="mt-4 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition"
        >
          Retry
        </button>
      </div>
    )
  }

  if (!data) return null

  const getROIColor = (roi: number) => {
    if (roi >= 200) return 'text-green-400'
    if (roi >= 100) return 'text-yellow-400'
    if (roi >= 0) return 'text-orange-400'
    return 'text-red-400'
  }

  const getROIBgColor = (roi: number) => {
    if (roi >= 200) return 'bg-green-500/10 border-green-500/30'
    if (roi >= 100) return 'bg-yellow-500/10 border-yellow-500/30'
    if (roi >= 0) return 'bg-orange-500/10 border-orange-500/30'
    return 'bg-red-500/10 border-red-500/30'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <Target className="w-7 h-7 text-purple-400" />
            Traffic Source ROI
          </h2>
          <p className="text-white/60 mt-1">Revenue, profit, and ROI by marketing channel</p>
        </div>
        <button
          onClick={fetchROIData}
          className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition flex items-center gap-2"
        >
          <Zap className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Ad Spend Configuration Status */}
      {(!data.adSpendConfigured.facebook && !data.adSpendConfigured.google) ? (
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-yellow-200">Ad Spend Not Configured</h4>
              <p className="text-yellow-200/80 text-sm mt-1">
                Facebook Ads and Google Ads APIs not set up. ROI calculations will only include Stripe fees.
              </p>
              <p className="text-yellow-200/60 text-xs mt-2">
                See <span className="font-mono bg-yellow-500/20 px-1 rounded">AD_TRACKING_SETUP_GUIDE.md</span> for setup instructions.
              </p>
            </div>
          </div>
        </div>
      ) : (!data.adSpendConfigured.facebook || !data.adSpendConfigured.google) && (
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-200">
                ✅ {data.adSpendConfigured.facebook && 'Facebook Ads Connected'}{data.adSpendConfigured.google && 'Google Ads Connected'}
              </h4>
              <p className="text-blue-200/80 text-sm mt-1">
                {data.adSpendConfigured.facebook && '✓ Facebook Ads API active. '}
                {data.adSpendConfigured.google && '✓ Google Ads API active. '}
                {!data.adSpendConfigured.facebook && '• Facebook Ads not configured. '}
                {!data.adSpendConfigured.google && '• Google Ads not configured. '}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Overall Totals */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl p-6 border border-blue-500/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-blue-200 text-sm">Total Revenue</span>
            <DollarSign className="w-5 h-5 text-blue-400" />
          </div>
          <div className="text-3xl font-bold text-white">${data.totals.revenue.toFixed(2)}</div>
        </div>

        <div className="bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-xl p-6 border border-red-500/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-red-200 text-sm">Total Ad Spend</span>
            <TrendingUp className="w-5 h-5 text-red-400" />
          </div>
          <div className="text-3xl font-bold text-white">${data.totals.spend.toFixed(2)}</div>
        </div>

        <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl p-6 border border-green-500/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-green-200 text-sm">Net Profit</span>
            <Target className="w-5 h-5 text-green-400" />
          </div>
          <div className="text-3xl font-bold text-white">${data.totals.profit.toFixed(2)}</div>
        </div>

        <div className={`rounded-xl p-6 border ${getROIBgColor(data.totals.roi)}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/80 text-sm">Overall ROI</span>
            <Zap className="w-5 h-5" />
          </div>
          <div className={`text-3xl font-bold ${getROIColor(data.totals.roi)}`}>
            {data.totals.roi.toFixed(0)}%
          </div>
        </div>
      </div>

      {/* Channel Breakdown */}
      <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 rounded-2xl border border-purple-500/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-purple-500/10 border-b border-purple-500/20">
              <tr>
                <th className="text-left p-4 text-purple-200 font-semibold">Channel</th>
                <th className="text-right p-4 text-purple-200 font-semibold">Sales</th>
                <th className="text-right p-4 text-purple-200 font-semibold">Revenue</th>
                <th className="text-right p-4 text-purple-200 font-semibold">Ad Spend</th>
                <th className="text-right p-4 text-purple-200 font-semibold">Profit</th>
                <th className="text-right p-4 text-purple-200 font-semibold">ROI</th>
                <th className="text-right p-4 text-purple-200 font-semibold">ROAS</th>
                <th className="text-right p-4 text-purple-200 font-semibold">CPA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {data.channels.map((channel, index) => (
                <tr key={index} className="hover:bg-white/5 transition">
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${
                        channel.channel === 'Facebook Ads' ? 'bg-blue-500' :
                        channel.channel === 'Google Ads' ? 'bg-red-500' :
                        channel.channel === 'TikTok Ads' ? 'bg-pink-500' :
                        channel.channel === 'Instagram Ads' ? 'bg-purple-500' :
                        'bg-gray-500'
                      }`}></div>
                      <span className="text-white font-medium">{channel.channel}</span>
                    </div>
                  </td>
                  <td className="p-4 text-right text-white">{channel.sales}</td>
                  <td className="p-4 text-right text-white font-semibold">${channel.revenue.toFixed(2)}</td>
                  <td className="p-4 text-right text-red-300">${channel.spend.toFixed(2)}</td>
                  <td className="p-4 text-right text-green-300 font-semibold">${channel.profit.toFixed(2)}</td>
                  <td className="p-4 text-right">
                    <span className={`font-bold ${getROIColor(channel.roi)}`}>
                      {channel.roi.toFixed(0)}%
                    </span>
                  </td>
                  <td className="p-4 text-right text-white">{channel.roas.toFixed(2)}x</td>
                  <td className="p-4 text-right text-white/70">${channel.cpa.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Legend */}
      <div className="bg-white/5 rounded-xl p-4 text-sm">
        <h4 className="text-white font-semibold mb-2">Metrics Explained:</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-white/60">
          <div><span className="font-semibold text-white">ROI:</span> Return on Investment = (Profit / Spend) × 100%</div>
          <div><span className="font-semibold text-white">ROAS:</span> Return on Ad Spend = Revenue / Spend</div>
          <div><span className="font-semibold text-white">CPA:</span> Cost Per Acquisition = Spend / Sales</div>
          <div><span className="font-semibold text-white">Profit:</span> Revenue - Ad Spend - Stripe Fees (2.9% + $0.30)</div>
        </div>
      </div>
    </div>
  )
}
