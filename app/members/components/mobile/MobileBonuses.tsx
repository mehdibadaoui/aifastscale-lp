'use client'

import { memo, useState, useMemo } from 'react'
import {
  Gift, Download, ExternalLink, Search, Filter, X, ChevronRight,
  Star, Lock, Sparkles, CheckCircle2, FileText, Video, Folder,
  Zap, Crown
} from 'lucide-react'
import { BottomSheet, HorizontalScroll, MobileAnimatedNumber, useHapticFeedback } from './MobileNavigation'

// ============================================
// MOBILE BONUSES PAGE
// ============================================

interface Bonus {
  id: string
  name: string  // Config uses 'name' not 'title'
  description: string
  value: number
  category?: string
  url?: string
  type?: 'link' | 'file' | 'video' | 'folder'
  isNew?: boolean
  isPremium?: boolean
  image?: string
  icon?: any
}

interface MobileBonusesProps {
  state: {
    config: {
      bonuses: Bonus[]
    }
    downloadedBonuses: string[]
    handleBonusDownload: (bonusId: string) => void
  }
}

export const MobileBonuses = memo(function MobileBonuses({ state }: MobileBonusesProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [selectedBonus, setSelectedBonus] = useState<Bonus | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const haptic = useHapticFeedback()

  // Extract categories
  const categories = useMemo((): string[] => {
    const categorySet = new Set<string>()
    state.config.bonuses.forEach((b: Bonus) => {
      if (b.category) categorySet.add(b.category)
    })
    return ['All', ...Array.from(categorySet)]
  }, [state.config.bonuses])

  // Calculate total value
  const totalValue = useMemo(() => {
    return state.config.bonuses.reduce((sum, b) => sum + (b.value || 0), 0)
  }, [state.config.bonuses])

  // Filter bonuses
  const filteredBonuses = useMemo(() => {
    return state.config.bonuses.filter(bonus => {
      const matchesSearch = !searchQuery ||
        bonus.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bonus.description?.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = activeCategory === 'All' || bonus.category === activeCategory
      return matchesSearch && matchesCategory
    })
  }, [state.config.bonuses, searchQuery, activeCategory])

  // Group by new vs regular
  const newBonuses = filteredBonuses.filter(b => b.isNew)
  const regularBonuses = filteredBonuses.filter(b => !b.isNew)

  const getBonusIcon = (type?: string) => {
    switch (type) {
      case 'video': return Video
      case 'file': return FileText
      case 'folder': return Folder
      default: return ExternalLink
    }
  }

  return (
    <div className="min-h-screen pb-24 bg-zinc-950" style={{ backgroundColor: '#09090b', minHeight: '100dvh', overscrollBehavior: 'none' }}>
      {/* HEADER */}
      <div className="px-4 py-6 space-y-4">
        {/* Title & Search */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-black text-white">Digital Vault</h1>
          <button
            onClick={() => {
              haptic.trigger('light')
              setShowFilters(true)
            }}
            className="p-2 rounded-xl bg-white/5 border border-white/10"
          >
            <Filter className="w-5 h-5 text-white/60" />
          </button>
        </div>

        {/* Search bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search bonuses..."
            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-amber-500/50"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2"
            >
              <X className="w-5 h-5 text-white/40" />
            </button>
          )}
        </div>

        {/* Total Value Card */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500/15 to-yellow-500/5 border border-amber-500/20 p-4">
          <div className="absolute -top-5 -right-5 w-20 h-20 bg-amber-500/20 rounded-full blur-2xl" />
          <div className="relative flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center shadow-lg">
              <Gift className="w-7 h-7 text-black" />
            </div>
            <div>
              <p className="text-white/50 text-sm">Total Bonus Value</p>
              <p className="text-2xl font-black text-amber-400">
                $<MobileAnimatedNumber value={totalValue} />
              </p>
            </div>
            <div className="ml-auto text-right">
              <p className="text-white/50 text-sm">Resources</p>
              <p className="text-xl font-bold text-white">{state.config.bonuses.length}</p>
            </div>
          </div>
        </div>

        {/* Category pills - horizontal scroll */}
        <HorizontalScroll>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                haptic.trigger('light')
                setActiveCategory(cat)
              }}
              className={`flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-bold transition-all snap-start ${
                activeCategory === cat
                  ? 'bg-amber-500 text-black'
                  : 'bg-white/5 text-white/60 border border-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </HorizontalScroll>
      </div>

      {/* NEW BONUSES SECTION */}
      {newBonuses.length > 0 && (
        <div className="px-4 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider">
              New Additions
            </h3>
          </div>
          <HorizontalScroll>
            {newBonuses.map((bonus) => (
              <NewBonusCard
                key={bonus.id}
                bonus={bonus}
                onSelect={() => {
                  haptic.trigger('medium')
                  setSelectedBonus(bonus)
                }}
              />
            ))}
          </HorizontalScroll>
        </div>
      )}

      {/* ALL BONUSES */}
      <div className="px-4">
        <h3 className="text-sm font-bold text-white/50 uppercase tracking-wider mb-3">
          {activeCategory === 'All' ? 'All Resources' : activeCategory} ({filteredBonuses.length})
        </h3>

        {filteredBonuses.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center mx-auto mb-4">
              <Gift className="w-10 h-10 text-white/20" />
            </div>
            <p className="text-white/40 mb-2">No bonuses found</p>
            <p className="text-sm text-white/30">
              {searchQuery ? 'Try a different search term' : 'Check back soon for new additions'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {regularBonuses.map((bonus) => {
              const Icon = getBonusIcon(bonus.type)
              return (
                <button
                  key={bonus.id}
                  onClick={() => {
                    haptic.trigger('light')
                    setSelectedBonus(bonus)
                  }}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 active:bg-white/10 transition-all"
                >
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    bonus.isPremium
                      ? 'bg-gradient-to-br from-amber-500/20 to-yellow-500/10'
                      : 'bg-white/10'
                  }`}>
                    {bonus.isPremium ? (
                      <Crown className="w-6 h-6 text-amber-400" />
                    ) : (
                      <Icon className="w-6 h-6 text-white/60" />
                    )}
                  </div>

                  <div className="flex-1 text-left min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-white truncate">{bonus.name}</p>
                      {bonus.isNew && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                          NEW
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-white/40 truncate">{bonus.description}</p>
                    {bonus.value > 0 && (
                      <p className="text-sm text-amber-400 font-bold mt-1">
                        Value: ${bonus.value}
                      </p>
                    )}
                  </div>

                  <ChevronRight className="w-5 h-5 text-white/30 flex-shrink-0" />
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* BONUS DETAIL SHEET */}
      <BonusDetailSheet
        bonus={selectedBonus}
        onClose={() => setSelectedBonus(null)}
        isDownloaded={selectedBonus ? state.downloadedBonuses.includes(selectedBonus.id) : false}
        onDownload={(id) => state.handleBonusDownload(id)}
      />

      {/* FILTERS SHEET */}
      <BottomSheet
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        title="Filter Bonuses"
      >
        <div className="px-4 pb-6 space-y-4">
          <p className="text-sm text-white/50 mb-2">Category</p>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  haptic.trigger('light')
                  setActiveCategory(cat)
                }}
                className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  activeCategory === cat
                    ? 'bg-amber-500 text-black'
                    : 'bg-white/5 text-white/60 border border-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              haptic.trigger('medium')
              setActiveCategory('All')
              setSearchQuery('')
              setShowFilters(false)
            }}
            className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold active:scale-[0.98] transition-transform"
          >
            Clear Filters
          </button>
        </div>
      </BottomSheet>
    </div>
  )
})

// ============================================
// NEW BONUS CARD (HORIZONTAL SCROLL)
// ============================================

const NewBonusCard = memo(function NewBonusCard({
  bonus,
  onSelect
}: {
  bonus: Bonus
  onSelect: () => void
}) {
  return (
    <button
      onClick={onSelect}
      className="flex-shrink-0 w-64 snap-start rounded-2xl bg-gradient-to-br from-amber-500/10 to-transparent border border-amber-500/20 p-4 active:scale-[0.98] transition-transform text-left"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center">
          <Sparkles className="w-6 h-6 text-black" />
        </div>
        <span className="px-2 py-1 rounded-full bg-emerald-500 text-black text-[10px] font-bold">
          NEW
        </span>
      </div>
      <p className="font-bold text-white mb-1 line-clamp-2">{bonus.name}</p>
      <p className="text-sm text-white/40 line-clamp-2">{bonus.description}</p>
      {bonus.value > 0 && (
        <div className="flex items-center gap-2 mt-3">
          <span className="text-lg font-black text-amber-400">${bonus.value}</span>
          <span className="text-sm text-white/30 line-through">${Math.round(bonus.value * 1.5)}</span>
          <span className="text-emerald-400 text-sm font-bold">FREE</span>
        </div>
      )}
    </button>
  )
})

// ============================================
// BONUS DETAIL SHEET
// ============================================

const BonusDetailSheet = memo(function BonusDetailSheet({
  bonus,
  onClose,
  isDownloaded,
  onDownload
}: {
  bonus: Bonus | null
  onClose: () => void
  isDownloaded: boolean
  onDownload: (bonusId: string) => void
}) {
  const haptic = useHapticFeedback()

  if (!bonus) return null

  const handleAccess = () => {
    haptic.trigger('heavy')
    if (bonus.url) {
      // Track download
      if (!isDownloaded) {
        onDownload(bonus.id)
      }
      window.open(bonus.url, '_blank')
    }
  }

  return (
    <BottomSheet isOpen={!!bonus} onClose={onClose} title="Bonus Details" height="auto">
      <div className="px-4 pb-6">
        {/* Header */}
        <div className="flex items-start gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center flex-shrink-0">
            <Gift className="w-8 h-8 text-black" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              {bonus.isNew && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-black text-[10px] font-bold">
                  NEW
                </span>
              )}
              {bonus.isPremium && (
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-bold">
                  PREMIUM
                </span>
              )}
            </div>
            <h3 className="text-xl font-black text-white">{bonus.name}</h3>
          </div>
        </div>

        {/* Value display */}
        {bonus.value > 0 && (
          <div className="flex items-center justify-center gap-3 py-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 mb-6">
            <span className="text-white/40 text-lg line-through">${Math.round(bonus.value * 1.5)}</span>
            <span className="text-3xl font-black text-amber-400">${bonus.value}</span>
            <span className="px-3 py-1 rounded-full bg-emerald-500 text-black text-sm font-bold">
              INCLUDED FREE
            </span>
          </div>
        )}

        {/* Description */}
        <div className="mb-6">
          <h4 className="text-sm font-bold text-white/50 uppercase tracking-wider mb-2">
            Description
          </h4>
          <p className="text-white/80 leading-relaxed">{bonus.description}</p>
        </div>

        {/* Category badge */}
        {bonus.category && (
          <div className="flex items-center gap-2 mb-6">
            <span className="text-sm text-white/50">Category:</span>
            <span className="px-3 py-1 rounded-full bg-white/10 text-white text-sm font-medium">
              {bonus.category}
            </span>
          </div>
        )}

        {/* Access button */}
        {bonus.url && (
          <button
            onClick={handleAccess}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-bold shadow-lg shadow-amber-500/30 active:scale-[0.98] transition-transform"
          >
            {bonus.type === 'file' ? (
              <>
                <Download className="w-5 h-5" />
                Download Now
              </>
            ) : (
              <>
                <ExternalLink className="w-5 h-5" />
                Access Now
              </>
            )}
          </button>
        )}
      </div>
    </BottomSheet>
  )
})

export default MobileBonuses
