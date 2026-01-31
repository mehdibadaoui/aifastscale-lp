'use client'

import { memo, useState, useEffect } from 'react'
import { MobileBottomNav, MobilePageWrapper } from './MobileNavigation'
import { MobileDashboard } from './MobileDashboard'
import { MobileCourse } from './MobileCourse'
import { MobileTracker } from './MobileTracker'
import { MobileBonuses } from './MobileBonuses'
import { Trophy, Settings, HelpCircle, ArrowLeft } from 'lucide-react'

// ============================================
// MOBILE PLATFORM WRAPPER
// ============================================

type MobileSection = 'dashboard' | 'course' | 'tracker' | 'bonuses' | 'achievements' | 'settings' | 'support'

interface MobilePlatformProps {
  state: {
    // User info
    studentName: string | null

    // Progress
    progressPercent: number
    completedCount: number
    totalModules: number
    timeRemaining: number
    totalWatchTimeMinutes: number
    totalPoints: number
    streak: number
    unlockedCount: number

    // Modules
    modules: any[]
    currentModuleIndex: number
    setCurrentModuleIndex: (index: number) => void
    nextIncompleteModule: any
    nextIncompleteModuleIndex: number

    // Video progress
    videoProgress: Record<string, any>
    completedModules: string[]
    markModuleComplete: (id: string) => void

    // Tracker
    transactions: any[]
    addTransaction: (t: any) => void
    deleteTransaction: (id: string) => void
    updateTransaction: (id: string, t: any) => void
    monthlyGoal?: number
    setMonthlyGoal?: (goal: number) => void

    // Config
    config: any

    // Bonuses
    downloadedBonuses: string[]
    handleBonusDownload: (bonusId: string) => void

    // Section
    activeSection: string
    setActiveSection: (section: any) => void

    // Achievements
    achievements: any[]
  }
}

export const MobilePlatform = memo(function MobilePlatform({ state }: MobilePlatformProps) {
  const [mobileSection, setMobileSection] = useState<MobileSection>(
    (state.activeSection as MobileSection) || 'dashboard'
  )

  // Set dark background on body to prevent white flash on scroll
  // Using useLayoutEffect alternative pattern - runs synchronously
  if (typeof window !== 'undefined') {
    // Apply immediately on first render (before paint)
    document.documentElement.classList.add('members-dark')
    document.body.classList.add('members-dark')
    document.documentElement.style.backgroundColor = '#09090b'
    document.body.style.backgroundColor = '#09090b'
    // Prevent iOS Safari overscroll bounce
    document.body.style.overscrollBehavior = 'none'
    document.documentElement.style.overscrollBehavior = 'none'
  }

  useEffect(() => {
    // Ensure dark mode is applied (backup)
    document.documentElement.classList.add('members-dark')
    document.body.classList.add('members-dark')
    document.documentElement.style.backgroundColor = '#09090b'
    document.body.style.backgroundColor = '#09090b'
    document.body.style.overscrollBehavior = 'none'
    document.documentElement.style.overscrollBehavior = 'none'

    return () => {
      document.documentElement.classList.remove('members-dark')
      document.body.classList.remove('members-dark')
      document.documentElement.style.backgroundColor = ''
      document.body.style.backgroundColor = ''
      document.body.style.overscrollBehavior = ''
      document.documentElement.style.overscrollBehavior = ''
    }
  }, [])

  // Sync with parent state
  useEffect(() => {
    if (state.activeSection) {
      setMobileSection(state.activeSection as MobileSection)
    }
  }, [state.activeSection])

  const handleSectionChange = (section: MobileSection) => {
    setMobileSection(section)
    state.setActiveSection(section)
  }

  // Calculate unlocked achievements
  const unlockedAchievements = state.achievements?.filter(a => a.unlocked) || []

  return (
    <div
      className="min-h-screen bg-zinc-950"
      style={{
        backgroundColor: '#09090b',
        minHeight: '100dvh',
        overscrollBehavior: 'none',
      }}
    >
      <MobilePageWrapper hasBottomNav={true}>
        {/* Main content based on section */}
        {mobileSection === 'dashboard' && (
          <MobileDashboard
            state={{
              studentName: state.studentName,
              progressPercent: state.progressPercent,
              completedCount: state.completedCount,
              totalModules: state.totalModules,
              timeRemaining: state.timeRemaining,
              totalWatchTimeMinutes: state.totalWatchTimeMinutes,
              totalPoints: state.totalPoints,
              streak: state.streak,
              unlockedCount: state.unlockedCount,
              nextIncompleteModule: state.nextIncompleteModule,
              nextIncompleteModuleIndex: state.nextIncompleteModuleIndex,
              videoProgress: state.videoProgress,
              setCurrentModuleIndex: state.setCurrentModuleIndex,
              setActiveSection: handleSectionChange,
              config: state.config
            }}
          />
        )}

        {mobileSection === 'course' && (
          <MobileCourse
            state={{
              modules: state.modules,
              currentModuleIndex: state.currentModuleIndex,
              setCurrentModuleIndex: state.setCurrentModuleIndex,
              videoProgress: state.videoProgress,
              completedModules: state.completedModules,
              markModuleComplete: state.markModuleComplete,
              config: state.config
            }}
          />
        )}

        {mobileSection === 'tracker' && (
          <MobileTracker
            state={{
              transactions: state.transactions,
              addTransaction: state.addTransaction,
              deleteTransaction: state.deleteTransaction,
              updateTransaction: state.updateTransaction,
              monthlyGoal: state.monthlyGoal,
              setMonthlyGoal: state.setMonthlyGoal
            }}
          />
        )}

        {mobileSection === 'bonuses' && (
          <MobileBonuses
            state={{
              config: state.config,
              downloadedBonuses: state.downloadedBonuses,
              handleBonusDownload: state.handleBonusDownload
            }}
          />
        )}

        {mobileSection === 'achievements' && (
          <MobileAchievements
            achievements={state.achievements || []}
            onBack={() => handleSectionChange('dashboard')}
          />
        )}

        {mobileSection === 'settings' && (
          <MobileSettings
            onBack={() => handleSectionChange('dashboard')}
          />
        )}

        {mobileSection === 'support' && (
          <MobileSupport
            onBack={() => handleSectionChange('dashboard')}
          />
        )}
      </MobilePageWrapper>

      {/* Bottom Navigation */}
      <MobileBottomNav
        activeTab={mobileSection}
        onTabChange={handleSectionChange}
        unlockedBadges={unlockedAchievements.length}
        totalBadges={state.achievements?.length || 0}
      />
    </div>
  )
})

// ============================================
// MOBILE ACHIEVEMENTS PAGE
// ============================================

const MobileAchievements = memo(function MobileAchievements({
  achievements,
  onBack
}: {
  achievements: any[]
  onBack: () => void
}) {
  const unlockedCount = achievements.filter(a => a.unlocked).length

  return (
    <div className="min-h-screen pb-24 bg-zinc-950" style={{ backgroundColor: '#09090b', minHeight: '100dvh', overscrollBehavior: 'none' }}>
      {/* Header */}
      <div className="sticky top-0 z-40 bg-zinc-950/95 backdrop-blur-xl border-b border-white/10 px-4 py-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-white/5 border border-white/10 active:bg-white/10 transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div>
            <h1 className="text-xl font-black text-white">Achievements</h1>
            <p className="text-sm text-white/50">{unlockedCount} of {achievements.length} unlocked</p>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="px-4 py-6">
        <div className="h-3 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full transition-all duration-1000"
            style={{ width: `${(unlockedCount / achievements.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Achievement grid */}
      <div className="px-4 grid grid-cols-2 gap-3">
        {achievements.map((achievement) => (
          <div
            key={achievement.id}
            className={`relative p-4 rounded-2xl border transition-all ${
              achievement.unlocked
                ? 'bg-amber-500/10 border-amber-500/30'
                : 'bg-white/5 border-white/10 opacity-50'
            }`}
          >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-3 ${
              achievement.unlocked
                ? 'bg-gradient-to-br from-amber-500 to-yellow-500'
                : 'bg-white/10'
            }`}>
              <Trophy className={`w-7 h-7 ${achievement.unlocked ? 'text-black' : 'text-white/30'}`} />
            </div>
            <p className={`font-bold mb-1 ${achievement.unlocked ? 'text-white' : 'text-white/50'}`}>
              {achievement.title}
            </p>
            <p className="text-xs text-white/40">{achievement.description}</p>
            {achievement.unlocked && (
              <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
                <span className="text-black text-xs">✓</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
})

// ============================================
// MOBILE SETTINGS PAGE
// ============================================

const MobileSettings = memo(function MobileSettings({
  onBack
}: {
  onBack: () => void
}) {
  return (
    <div className="min-h-screen pb-24 bg-zinc-950" style={{ backgroundColor: '#09090b', minHeight: '100dvh', overscrollBehavior: 'none' }}>
      {/* Header */}
      <div className="sticky top-0 z-40 bg-zinc-950/95 backdrop-blur-xl border-b border-white/10 px-4 py-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-white/5 border border-white/10 active:bg-white/10 transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="text-xl font-black text-white">Settings</h1>
        </div>
      </div>

      <div className="px-4 py-6 space-y-4">
        {/* Settings items */}
        {[
          { label: 'Account Settings', desc: 'Manage your account' },
          { label: 'Notifications', desc: 'Control notifications' },
          { label: 'Appearance', desc: 'Theme and display' },
          { label: 'Privacy', desc: 'Privacy settings' },
        ].map((item, i) => (
          <button
            key={i}
            className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 active:bg-white/10 transition-all"
          >
            <div className="text-left">
              <p className="font-bold text-white">{item.label}</p>
              <p className="text-sm text-white/40">{item.desc}</p>
            </div>
            <ArrowLeft className="w-5 h-5 text-white/30 rotate-180" />
          </button>
        ))}
      </div>
    </div>
  )
})

// ============================================
// MOBILE SUPPORT PAGE
// ============================================

const MobileSupport = memo(function MobileSupport({
  onBack
}: {
  onBack: () => void
}) {
  return (
    <div className="min-h-screen pb-24 bg-zinc-950" style={{ backgroundColor: '#09090b', minHeight: '100dvh', overscrollBehavior: 'none' }}>
      {/* Header */}
      <div className="sticky top-0 z-40 bg-zinc-950/95 backdrop-blur-xl border-b border-white/10 px-4 py-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-white/5 border border-white/10 active:bg-white/10 transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="text-xl font-black text-white">Help & Support</h1>
        </div>
      </div>

      <div className="px-4 py-6 space-y-4">
        {/* Support items */}
        {[
          { label: 'FAQs', desc: 'Common questions answered' },
          { label: 'Contact Support', desc: 'Get help from our team' },
          { label: 'Video Tutorials', desc: 'Learn how to use the platform' },
          { label: 'Community', desc: 'Connect with other students' },
        ].map((item, i) => (
          <button
            key={i}
            className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 active:bg-white/10 transition-all"
          >
            <div className="text-left">
              <p className="font-bold text-white">{item.label}</p>
              <p className="text-sm text-white/40">{item.desc}</p>
            </div>
            <ArrowLeft className="w-5 h-5 text-white/30 rotate-180" />
          </button>
        ))}
      </div>
    </div>
  )
})

export default MobilePlatform
