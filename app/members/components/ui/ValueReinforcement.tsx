'use client'

import { memo, useState, useEffect } from 'react'
import { DollarSign, Users, TrendingUp, Sparkles, Crown, CheckCircle } from 'lucide-react'
import { getMemberStats, computeDerivedConfig, NicheConfig } from '../../config'

interface ValueReinforcementProps {
  config: NicheConfig
  compact?: boolean
}

// Shows total value included
export const TotalValueBadge = memo(function TotalValueBadge({ config, compact = false }: ValueReinforcementProps) {
  const derived = computeDerivedConfig(config)
  const isPrimaryAmber = config.theme.primary.includes('amber')
  const primaryColorClass = isPrimaryAmber ? 'amber' : 'teal'

  if (compact) {
    return (
      <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-${primaryColorClass}-500/20 border border-${primaryColorClass}-500/30`}>
        <DollarSign className={`w-4 h-4 text-${primaryColorClass}-400`} />
        <span className={`text-sm font-bold text-${primaryColorClass}-400`}>${derived.totalBonusValue} Value Included</span>
      </div>
    )
  }

  return (
    <div className={`glass-premium rounded-2xl p-4 border border-${primaryColorClass}-500/20`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${config.theme.btnGradient} flex items-center justify-center`}>
            <DollarSign className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-sm text-slate-400">Total Value Included</p>
            <p className="text-2xl font-black text-white">${derived.totalBonusValue}</p>
          </div>
        </div>
        <div className="text-right">
          <p className={`text-sm font-bold text-${primaryColorClass}-400`}>You're saving</p>
          <p className="text-xl font-black text-green-400">${derived.totalBonusValue - 47}</p>
        </div>
      </div>
    </div>
  )
})

// Shows members online now
export const MembersOnlineBadge = memo(function MembersOnlineBadge({ config }: ValueReinforcementProps) {
  const [stats, setStats] = useState(() => getMemberStats(config.memberStats))
  const isPrimaryAmber = config.theme.primary.includes('amber')
  const primaryColorClass = isPrimaryAmber ? 'amber' : 'teal'

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(getMemberStats(config.memberStats))
    }, 30000)
    return () => clearInterval(interval)
  }, [config.memberStats])

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-premium border border-${primaryColorClass}-500/20`}>
      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
      <span className="text-sm text-slate-300">
        <span className={`font-bold text-${primaryColorClass}-400`}>{stats.activeNow}</span> members online now
      </span>
    </div>
  )
})

// Shows daily new members counter
export const NewMembersTodayBadge = memo(function NewMembersTodayBadge({ config }: ValueReinforcementProps) {
  const [stats, setStats] = useState(() => getMemberStats(config.memberStats))
  const isPrimaryAmber = config.theme.primary.includes('amber')
  const primaryColorClass = isPrimaryAmber ? 'amber' : 'teal'

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(getMemberStats(config.memberStats))
    }, 60000)
    return () => clearInterval(interval)
  }, [config.memberStats])

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-premium border border-${primaryColorClass}-500/20`}>
      <TrendingUp className={`w-4 h-4 text-${primaryColorClass}-400`} />
      <span className="text-sm text-slate-300">
        <span className={`font-bold text-${primaryColorClass}-400`}>{stats.todayNewMembers}</span> joined today
      </span>
    </div>
  )
})

// Progress investment tracker
interface ProgressInvestmentProps {
  config: NicheConfig
  completedModules: string[]
  downloadedBonuses: string[]
}

export const ProgressInvestment = memo(function ProgressInvestment({
  config,
  completedModules,
  downloadedBonuses,
}: ProgressInvestmentProps) {
  const derived = computeDerivedConfig(config)
  const isPrimaryAmber = config.theme.primary.includes('amber')
  const primaryColorClass = isPrimaryAmber ? 'amber' : 'teal'

  // Calculate value consumed
  const moduleValuePerModule = 100 // $100 per module
  const bonusesDownloaded = config.bonuses.filter(b => downloadedBonuses.includes(b.id))
  const bonusValue = bonusesDownloaded.reduce((sum, b) => sum + b.value, 0)
  const moduleValue = completedModules.length * moduleValuePerModule
  const totalConsumed = bonusValue + moduleValue

  if (totalConsumed === 0) return null

  return (
    <div className={`glass-premium rounded-xl p-4 border border-${primaryColorClass}-500/20`}>
      <div className="flex items-center gap-2 mb-2">
        <CheckCircle className={`w-5 h-5 text-${primaryColorClass}-400`} />
        <span className="text-sm font-semibold text-slate-300">Your Progress Investment</span>
      </div>
      <p className="text-2xl font-black text-white">
        <span className={`text-${primaryColorClass}-400`}>${totalConsumed.toLocaleString()}</span>
        <span className="text-slate-400 text-sm font-normal ml-2">worth of training completed</span>
      </p>
      <div className="mt-2 flex items-center gap-4 text-xs text-slate-400">
        <span>{completedModules.length} modules completed</span>
        <span>{downloadedBonuses.length} bonuses downloaded</span>
      </div>
    </div>
  )
})

// Bonus with crossed-out price
interface BonusValueProps {
  originalValue: number
  name: string
  isPrimaryAmber?: boolean
}

export const BonusValueDisplay = memo(function BonusValueDisplay({
  originalValue,
  name,
  isPrimaryAmber = true,
}: BonusValueProps) {
  const primaryColorClass = isPrimaryAmber ? 'amber' : 'teal'

  return (
    <div className="flex items-center gap-2">
      <span className="text-slate-500 line-through text-sm">${originalValue}</span>
      <span className={`px-2 py-0.5 rounded text-xs font-bold bg-green-500/20 text-green-400 border border-green-500/30`}>
        INCLUDED FREE
      </span>
    </div>
  )
})

// Leaderboard rank
interface LeaderboardRankProps {
  totalPoints: number
  totalMembers: number
  config: NicheConfig
}

export const LeaderboardRank = memo(function LeaderboardRank({
  totalPoints,
  totalMembers,
  config,
}: LeaderboardRankProps) {
  const isPrimaryAmber = config.theme.primary.includes('amber')
  const primaryColorClass = isPrimaryAmber ? 'amber' : 'teal'

  // Calculate approximate rank based on points
  // Assume points distribution is exponential
  const maxPoints = 1000 // Max expected points
  const percentile = Math.min(99, Math.max(1, Math.round((totalPoints / maxPoints) * 100)))
  const rank = Math.max(1, Math.round(totalMembers * (1 - percentile / 100)))

  return (
    <div className={`glass-premium rounded-xl p-4 border border-${primaryColorClass}-500/20`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${config.theme.btnGradient} flex items-center justify-center`}>
            <Crown className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-sm text-slate-400">Your Rank</p>
            <p className="text-xl font-black text-white">Top {100 - percentile}%</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-slate-400">Among</p>
          <p className={`text-lg font-bold text-${primaryColorClass}-400`}>{totalMembers.toLocaleString()} members</p>
        </div>
      </div>
    </div>
  )
})
