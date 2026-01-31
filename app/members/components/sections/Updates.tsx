'use client'

import { memo } from 'react'
import { Bell, Sparkles, Zap, Clock, Gift, ArrowRight } from 'lucide-react'
import { getUpdatesForNiche, upcomingTeasers, Update } from '../../data/updates'
import type { PlatformStateType } from '../../hooks'

interface UpdatesProps {
  state: PlatformStateType
}

export const UpdatesSection = memo(function UpdatesSection({ state }: UpdatesProps) {
  const { config } = state
  const updates = getUpdatesForNiche(config.slug)
  const teasers = upcomingTeasers[config.slug] || []
  const isPrimaryAmber = config.theme.primary.includes('amber')
  const primaryColorClass = isPrimaryAmber ? 'amber' : 'teal'

  const getUpdateIcon = (type: Update['type']) => {
    switch (type) {
      case 'new':
        return <Sparkles className="w-4 h-4" />
      case 'improvement':
        return <Zap className="w-4 h-4" />
      case 'coming-soon':
        return <Clock className="w-4 h-4" />
      case 'bonus':
        return <Gift className="w-4 h-4" />
      default:
        return <Bell className="w-4 h-4" />
    }
  }

  const getBadgeColor = (type: Update['type']) => {
    switch (type) {
      case 'new':
        return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'improvement':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'coming-soon':
        return `bg-${primaryColorClass}-500/20 text-${primaryColorClass}-400 border-${primaryColorClass}-500/30`
      case 'bonus':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30'
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30'
    }
  }

  return (
    <div className="space-y-4">
      {/* What's New Widget */}
      <div className={`glass-premium rounded-2xl p-5 border border-${primaryColorClass}-500/20`}>
        <div className="flex items-center gap-2 mb-4">
          <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${config.theme.btnGradient} flex items-center justify-center`}>
            <Bell className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-white">What's New</h3>
            <p className="text-xs text-slate-400">Recent updates & additions</p>
          </div>
        </div>

        <div className="space-y-3">
          {updates.map((update) => (
            <div
              key={update.id}
              className={`p-3 rounded-xl glass-dark border border-transparent hover:border-${primaryColorClass}-500/20 transition-all group cursor-pointer`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getBadgeColor(update.type)} border`}>
                  {getUpdateIcon(update.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-white text-sm truncate">{update.title}</h4>
                    {update.badge && (
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getBadgeColor(update.type)} border`}>
                        {update.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-2">{update.description}</p>
                  <span className="text-[10px] text-slate-500 mt-1 block">{update.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Coming This Week */}
      <div className={`glass-premium rounded-2xl p-5 border border-${primaryColorClass}-500/20`}>
        <div className="flex items-center gap-2 mb-4">
          <Clock className={`w-5 h-5 text-${primaryColorClass}-400`} />
          <h3 className="font-bold text-white">Coming This Week</h3>
        </div>

        <div className="space-y-2">
          {teasers.map((teaser, i) => (
            <div
              key={i}
              className={`flex items-center gap-3 p-3 rounded-xl glass-dark border border-transparent hover:border-${primaryColorClass}-500/20 transition-all`}
            >
              <div className={`w-6 h-6 rounded-full bg-${primaryColorClass}-500/20 flex items-center justify-center flex-shrink-0`}>
                <ArrowRight className={`w-3 h-3 text-${primaryColorClass}-400`} />
              </div>
              <span className="text-sm text-slate-300">{teaser}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
})
