'use client'

import { memo, useState, useEffect, useMemo } from 'react'
import Image from 'next/image'
import {
  Gift, Search, Download, Check, ExternalLink, X,
  Sparkles, Star, ChevronRight, Filter, Grid3X3, List,
  FileText, Video, Folder, Link2, Zap, Target, Crown,
  CheckCircle, ArrowRight, Info, Clock, Users, Shield
} from 'lucide-react'

// ============================================
// ANIMATED COUNTER
// ============================================

const AnimatedNumber = memo(function AnimatedNumber({
  value,
  duration = 1000,
  prefix = ''
}: {
  value: number
  duration?: number
  prefix?: string
}) {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    const startTime = performance.now()
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
      setDisplayValue(Math.round(value * eased))
      if (progress < 1) requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
  }, [value, duration])

  return <span>{prefix}{displayValue.toLocaleString()}</span>
})

// ============================================
// PROGRESS RING
// ============================================

const ProgressRing = memo(function ProgressRing({
  progress,
  size = 48,
  strokeWidth = 4
}: {
  progress: number
  size?: number
  strokeWidth?: number
}) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (progress / 100) * circumference

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="rgba(255,255,255,0.1)"
        strokeWidth={strokeWidth}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="url(#bonusGradient)"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        className="transition-all duration-700"
      />
      <defs>
        <linearGradient id="bonusGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#eab308" />
        </linearGradient>
      </defs>
    </svg>
  )
})

// ============================================
// CATEGORY PILL
// ============================================

const CategoryPill = memo(function CategoryPill({
  category,
  isActive,
  count,
  onClick
}: {
  category: string
  isActive: boolean
  count?: number
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
        isActive
          ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-black shadow-lg shadow-amber-500/25'
          : 'bg-white/5 text-white/70 border border-white/10 hover:border-amber-500/30 hover:text-white'
      }`}
    >
      {category}
      {count !== undefined && (
        <span className={`text-xs ${isActive ? 'text-black/60' : 'text-white/40'}`}>
          {count}
        </span>
      )}
    </button>
  )
})

// ============================================
// BONUS CARD
// ============================================

const BonusCard = memo(function BonusCard({
  bonus,
  isDownloaded,
  isRecommended,
  onDownload,
  onViewDetails
}: {
  bonus: any
  isDownloaded: boolean
  isRecommended?: boolean
  onDownload: () => void
  onViewDetails: () => void
}) {
  const Icon = bonus.icon || Gift

  return (
    <div className={`group relative overflow-hidden rounded-2xl border transition-all duration-300 hover:scale-[1.02] ${
      isDownloaded
        ? 'bg-emerald-500/5 border-emerald-500/20'
        : 'bg-white/[0.03] border-white/10 hover:border-amber-500/30'
    }`}>
      {/* Recommended badge */}
      {isRecommended && !isDownloaded && (
        <div className="absolute top-3 left-3 z-10 flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-500 text-black text-xs font-bold">
          <Zap className="w-3 h-3" />
          Start Here
        </div>
      )}

      {/* Downloaded badge */}
      {isDownloaded && (
        <div className="absolute top-3 left-3 z-10 flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-500 text-white text-xs font-bold">
          <Check className="w-3 h-3" />
          Downloaded
        </div>
      )}

      {/* Value badge */}
      <div className="absolute top-3 right-3 z-10 px-2 py-1 rounded-lg bg-black/60 backdrop-blur-sm border border-white/10">
        <span className="text-emerald-400 text-xs font-bold">${bonus.value} value</span>
      </div>

      {/* Thumbnail */}
      <div className="relative aspect-[16/10] bg-gradient-to-br from-amber-500/20 to-yellow-500/10 overflow-hidden">
        {bonus.image && (
          <Image
            src={bonus.image}
            alt={bonus.name}
            fill
            className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start gap-3 mb-3">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0 ${
            isDownloaded
              ? 'bg-emerald-500/20 border border-emerald-500/30'
              : 'bg-gradient-to-br from-amber-500 to-yellow-500 shadow-amber-500/25'
          }`}>
            <Icon className={`w-5 h-5 ${isDownloaded ? 'text-emerald-400' : 'text-white'}`} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-white text-base leading-tight group-hover:text-amber-400 transition-colors">
              {bonus.name}
            </h3>
            <p className="text-xs text-white/40 mt-0.5">{bonus.category}</p>
          </div>
        </div>

        <p className="text-sm text-white/60 mb-4 line-clamp-2 leading-relaxed">
          {bonus.description}
        </p>

        {/* Actions */}
        <div className="flex gap-2">
          <a
            href={bonus.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onDownload}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${
              isDownloaded
                ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                : 'bg-gradient-to-r from-amber-500 to-yellow-500 text-black shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40'
            }`}
          >
            {isDownloaded ? (
              <>
                <ExternalLink className="w-4 h-4" />
                Open Again
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Get Bonus
              </>
            )}
          </a>
          <button
            onClick={onViewDetails}
            className="p-3 rounded-xl bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-white/10 transition-all"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
})

// ============================================
// BONUS DETAIL PANEL
// ============================================

const BonusDetailPanel = memo(function BonusDetailPanel({
  bonus,
  isOpen,
  isDownloaded,
  onClose,
  onDownload
}: {
  bonus: any
  isOpen: boolean
  isDownloaded: boolean
  onClose: () => void
  onDownload: () => void
}) {
  if (!isOpen || !bonus) return null

  const Icon = bonus.icon || Gift

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-lg bg-zinc-900 rounded-3xl border border-amber-500/20 overflow-hidden shadow-2xl animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative p-6 bg-gradient-to-r from-amber-500/10 to-transparent border-b border-white/10">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-500/20 rounded-full blur-3xl" />

          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5 text-white/50" />
          </button>

          <div className="relative flex items-center gap-4">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg ${
              isDownloaded
                ? 'bg-emerald-500/20 border border-emerald-500/30'
                : 'bg-gradient-to-br from-amber-500 to-yellow-500 shadow-amber-500/25'
            }`}>
              <Icon className={`w-8 h-8 ${isDownloaded ? 'text-emerald-400' : 'text-white'}`} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded text-xs font-bold bg-white/10 text-white/70">
                  {bonus.category}
                </span>
                <span className="text-emerald-400 text-sm font-bold">${bonus.value} value</span>
              </div>
              <h2 className="text-xl font-black text-white">{bonus.name}</h2>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* What this helps you achieve */}
          <div>
            <h3 className="flex items-center gap-2 text-sm font-bold text-white mb-3">
              <Target className="w-4 h-4 text-amber-400" />
              What This Helps You Achieve
            </h3>
            <p className="text-white/70 text-sm leading-relaxed">{bonus.description}</p>
          </div>

          {/* Who it's for */}
          <div>
            <h3 className="flex items-center gap-2 text-sm font-bold text-white mb-3">
              <Users className="w-4 h-4 text-amber-400" />
              Who It's For
            </h3>
            <p className="text-white/60 text-sm">
              Perfect for anyone who wants to save time and get professional results faster.
            </p>
          </div>

          {/* What's included */}
          <div>
            <h3 className="flex items-center gap-2 text-sm font-bold text-white mb-3">
              <FileText className="w-4 h-4 text-amber-400" />
              What's Included
            </h3>
            <div className="space-y-2">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span className="text-white/70 text-sm">Instant access to all files</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span className="text-white/70 text-sm">Step-by-step instructions</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span className="text-white/70 text-sm">Free lifetime updates</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 pt-0">
          <a
            href={bonus.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => { onDownload(); onClose(); }}
            className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold transition-all ${
              isDownloaded
                ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                : 'bg-gradient-to-r from-amber-500 to-yellow-500 text-black shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-[1.02]'
            }`}
          >
            {isDownloaded ? (
              <>
                <ExternalLink className="w-5 h-5" />
                Open Resource
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                Download Now
              </>
            )}
          </a>
        </div>
      </div>
    </div>
  )
})

// ============================================
// MAIN PREMIUM BONUSES
// ============================================

interface BonusesState {
  downloadedBonuses: string[]
  handleBonusDownload: (id: string) => void
  config: any
}

export const PremiumBonuses = memo(function PremiumBonuses({
  state
}: {
  state: BonusesState
}) {
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedBonus, setSelectedBonus] = useState<any>(null)

  // Derive categories and total value
  const categories = useMemo((): string[] => {
    const categorySet = new Set<string>()
    state.config.bonuses.forEach((b: any) => {
      if (b.category) categorySet.add(String(b.category))
    })
    return ['All', ...Array.from(categorySet)]
  }, [state.config.bonuses])

  const totalValue = useMemo(() => {
    return state.config.bonuses.reduce((sum: number, b: any) => sum + (b.value || 0), 0)
  }, [state.config.bonuses])

  const downloadedCount = state.downloadedBonuses.length
  const totalBonuses = state.config.bonuses.length
  const downloadPercent = totalBonuses > 0 ? (downloadedCount / totalBonuses) * 100 : 0

  // Filter bonuses
  const filteredBonuses = useMemo(() => {
    return state.config.bonuses.filter((bonus: any) => {
      const matchesCategory = categoryFilter === 'All' || bonus.category === categoryFilter
      const matchesSearch = searchQuery === '' ||
        bonus.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bonus.description.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesCategory && matchesSearch
    })
  }, [state.config.bonuses, categoryFilter, searchQuery])

  // Get category counts
  const getCategoryCount = (cat: string) => {
    if (cat === 'All') return state.config.bonuses.length
    return state.config.bonuses.filter((b: any) => b.category === cat).length
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Detail Panel */}
      <BonusDetailPanel
        bonus={selectedBonus}
        isOpen={!!selectedBonus}
        isDownloaded={selectedBonus ? state.downloadedBonuses.includes(selectedBonus.id) : false}
        onClose={() => setSelectedBonus(null)}
        onDownload={() => {
          if (selectedBonus && !state.downloadedBonuses.includes(selectedBonus.id)) {
            state.handleBonusDownload(selectedBonus.id)
          }
        }}
      />

      {/* HERO HEADER */}
      <div className="relative overflow-hidden rounded-3xl border border-amber-500/20 bg-gradient-to-br from-amber-500/10 via-black to-amber-500/5 p-6 sm:p-8">
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-amber-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-yellow-500/10 rounded-full blur-2xl" />

        <div className="relative flex flex-col sm:flex-row items-center gap-6">
          {/* Progress Ring */}
          <div className="relative flex-shrink-0">
            <ProgressRing progress={downloadPercent} size={100} strokeWidth={6} />
            <div className="absolute inset-0 flex items-center justify-center">
              <Gift className="w-8 h-8 text-amber-400" />
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">Bonus Resources</h1>
            <p className="text-white/60 text-lg mb-4">
              Everything included to help you win faster.
            </p>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-bold shadow-lg shadow-amber-500/25">
                <Sparkles className="w-4 h-4" />
                $<AnimatedNumber value={totalValue} /> Total Value
              </div>
              <div className="text-white/50 text-sm">
                {downloadedCount}/{totalBonuses} accessed
              </div>
            </div>
          </div>
        </div>

        {/* Anti-overwhelm message */}
        <p className="relative mt-6 text-white/40 text-sm text-center sm:text-left">
          You don't need everything at once. Start with what matches your current goal.
        </p>
      </div>

      {/* SEARCH & FILTERS */}
      <div className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search bonuses..."
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4 text-white/50" />
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((cat) => (
            <CategoryPill
              key={cat}
              category={cat}
              isActive={categoryFilter === cat}
              count={getCategoryCount(cat)}
              onClick={() => setCategoryFilter(cat)}
            />
          ))}
        </div>
      </div>

      {/* RECOMMENDED SECTION */}
      {categoryFilter === 'All' && searchQuery === '' && downloadedCount === 0 && (
        <div className="relative overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 to-transparent p-5">
          <div className="absolute -top-5 -right-5 w-20 h-20 bg-amber-500/20 rounded-full blur-2xl" />

          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-5 h-5 text-amber-400" />
              <h3 className="font-bold text-white">Recommended to Start</h3>
            </div>
            <p className="text-white/50 text-sm mb-4">
              Not sure where to begin? These bonuses will give you the fastest results.
            </p>

            {/* Show first 2 bonuses as recommended */}
            <div className="grid sm:grid-cols-2 gap-4">
              {state.config.bonuses.slice(0, 2).map((bonus: any) => {
                const Icon = bonus.icon || Gift
                return (
                  <button
                    key={bonus.id}
                    onClick={() => setSelectedBonus(bonus)}
                    className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-amber-500/30 transition-all text-left group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-white truncate group-hover:text-amber-400 transition-colors">
                        {bonus.name}
                      </p>
                      <p className="text-xs text-white/40">{bonus.category}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-white/30 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* BONUSES GRID */}
      {filteredBonuses.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredBonuses.map((bonus: any, index: number) => (
            <BonusCard
              key={bonus.id}
              bonus={bonus}
              isDownloaded={state.downloadedBonuses.includes(bonus.id)}
              isRecommended={index < 2 && downloadedCount === 0 && categoryFilter === 'All'}
              onDownload={() => {
                if (!state.downloadedBonuses.includes(bonus.id)) {
                  state.handleBonusDownload(bonus.id)
                }
              }}
              onViewDetails={() => setSelectedBonus(bonus)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-white/30" />
          </div>
          <p className="text-white/50 text-lg mb-2">No bonuses found</p>
          <p className="text-white/30 text-sm">Try a different search term or category</p>
          <button
            onClick={() => { setSearchQuery(''); setCategoryFilter('All'); }}
            className="mt-4 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:text-white transition-colors"
          >
            Clear filters
          </button>
        </div>
      )}

      {/* FOOTER MESSAGE */}
      <div className="text-center py-6">
        <p className="text-white/30 text-sm">
          All bonuses are included with your membership. No additional purchase required.
        </p>
      </div>
    </div>
  )
})

export default PremiumBonuses
