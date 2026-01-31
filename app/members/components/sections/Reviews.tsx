'use client'

import { memo } from 'react'
import { Target, Zap, Video, TrendingUp, CheckCircle } from 'lucide-react'
import type { PlatformStateType } from '../../hooks'

interface ReviewsProps {
  state: PlatformStateType
}

export const ReviewsSection = memo(function ReviewsSection({ state }: ReviewsProps) {
  const { config } = state
  const isPrimaryAmber = config.theme.primary.includes('amber')
  const primaryColorClass = isPrimaryAmber ? 'amber' : 'teal'

  const outcomes = [
    {
      icon: Video,
      title: 'Create AI Videos',
      description: 'Learn to produce professional AI-powered videos in minutes, not hours',
    },
    {
      icon: Zap,
      title: 'Save Time',
      description: 'Automate your content creation with proven scripts and templates',
    },
    {
      icon: TrendingUp,
      title: 'Grow Your Reach',
      description: 'Use video to stand out and attract more clients to your practice',
    },
    {
      icon: Target,
      title: 'Stay Consistent',
      description: 'Follow our content calendar to post regularly without burnout',
    },
  ]

  return (
    <div className="space-y-6">
      {/* What You'll Achieve */}
      <div className={`glass-premium rounded-2xl p-6 border border-${primaryColorClass}-500/20`}>
        <div className="flex items-center gap-2 mb-4">
          <Target className={`w-5 h-5 text-${primaryColorClass}-400`} />
          <h3 className="text-lg font-bold text-white">What You'll Achieve</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {outcomes.map((outcome, i) => {
            const Icon = outcome.icon
            return (
              <div
                key={i}
                className="flex items-start gap-3 p-3 rounded-xl glass-dark"
              >
                <div className={`w-10 h-10 rounded-lg bg-${primaryColorClass}-500/20 flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`w-5 h-5 text-${primaryColorClass}-400`} />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">{outcome.title}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">{outcome.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Course Includes */}
      <div className={`glass-premium rounded-2xl p-4 border border-${primaryColorClass}-500/20`}>
        <div className="flex items-center gap-2 mb-3">
          <CheckCircle className={`w-4 h-4 text-green-500`} />
          <span className="text-sm font-medium text-slate-400">This Course Includes</span>
        </div>
        <div className="space-y-2">
          {[
            '5 Video Modules (23 minutes total)',
            '10 Premium Bonus Resources',
            'Lifetime Access',
            'Mobile Friendly',
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-slate-300">
              <CheckCircle className="w-3.5 h-3.5 text-green-500" />
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
})
