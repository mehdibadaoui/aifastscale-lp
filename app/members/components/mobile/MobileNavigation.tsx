'use client'

import { memo, useState, useEffect } from 'react'
import {
  Home, Video, PiggyBank, Gift, User, MoreHorizontal,
  Settings, HelpCircle, LogOut, Trophy, X
} from 'lucide-react'

// ============================================
// HAPTIC FEEDBACK SIMULATION
// ============================================

export function useHapticFeedback() {
  const trigger = (type: 'light' | 'medium' | 'heavy' = 'light') => {
    // Use Vibration API if available
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      const patterns = {
        light: 10,
        medium: 20,
        heavy: 30
      }
      navigator.vibrate(patterns[type])
    }
  }

  return { trigger }
}

// ============================================
// BOTTOM NAVIGATION BAR
// ============================================

type TabId = 'dashboard' | 'course' | 'tracker' | 'bonuses' | 'more'

interface MobileNavProps {
  activeTab: string
  onTabChange: (tab: any) => void
  unlockedBadges?: number
  totalBadges?: number
}

export const MobileBottomNav = memo(function MobileBottomNav({
  activeTab,
  onTabChange,
  unlockedBadges = 0,
  totalBadges = 0
}: MobileNavProps) {
  const [showMore, setShowMore] = useState(false)
  const [pressedTab, setPressedTab] = useState<string | null>(null)
  const haptic = useHapticFeedback()

  const tabs: { id: TabId; icon: any; label: string; section?: string }[] = [
    { id: 'dashboard', icon: Home, label: 'Home', section: 'dashboard' },
    { id: 'course', icon: Video, label: 'Course', section: 'course' },
    { id: 'tracker', icon: PiggyBank, label: 'Tracker', section: 'tracker' },
    { id: 'bonuses', icon: Gift, label: 'Bonuses', section: 'bonuses' },
    { id: 'more', icon: MoreHorizontal, label: 'More' },
  ]

  const handleTabPress = (tab: typeof tabs[0]) => {
    haptic.trigger('light')
    setPressedTab(tab.id)

    if (tab.id === 'more') {
      setShowMore(true)
    } else if (tab.section) {
      onTabChange(tab.section)
    }

    // Reset press state after animation
    setTimeout(() => setPressedTab(null), 150)
  }

  const isActive = (tabId: TabId) => {
    if (tabId === 'more') return showMore
    return activeTab === tabs.find(t => t.id === tabId)?.section
  }

  return (
    <>
      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-zinc-900/95 backdrop-blur-xl border-t border-white/10 pb-safe">
        <div className="flex items-center justify-around px-2 py-2">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const active = isActive(tab.id)
            const pressed = pressedTab === tab.id

            return (
              <button
                key={tab.id}
                onClick={() => handleTabPress(tab)}
                className={`relative flex flex-col items-center justify-center w-16 h-14 rounded-2xl transition-all duration-200 ${
                  pressed ? 'scale-90' : 'scale-100'
                } ${
                  active
                    ? 'bg-amber-500/20'
                    : 'bg-transparent active:bg-white/5'
                }`}
              >
                {/* Glow effect for active tab */}
                {active && (
                  <div className="absolute inset-0 rounded-2xl bg-amber-500/20 blur-lg" />
                )}

                <div className="relative">
                  <Icon
                    className={`w-6 h-6 transition-colors duration-200 ${
                      active ? 'text-amber-400' : 'text-white/50'
                    }`}
                  />

                  {/* Badge indicator for bonuses */}
                  {tab.id === 'bonuses' && unlockedBadges > 0 && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 flex items-center justify-center">
                      <span className="text-[10px] font-bold text-black">
                        {unlockedBadges > 9 ? '9+' : unlockedBadges}
                      </span>
                    </div>
                  )}
                </div>

                <span
                  className={`text-[10px] font-medium mt-1 transition-colors duration-200 ${
                    active ? 'text-amber-400' : 'text-white/50'
                  }`}
                >
                  {tab.label}
                </span>
              </button>
            )
          })}
        </div>
      </nav>

      {/* More Menu (Bottom Sheet) */}
      <MoreMenuSheet
        isOpen={showMore}
        onClose={() => setShowMore(false)}
        onNavigate={(section) => {
          onTabChange(section)
          setShowMore(false)
        }}
        unlockedBadges={unlockedBadges}
        totalBadges={totalBadges}
      />
    </>
  )
})

// ============================================
// MORE MENU BOTTOM SHEET
// ============================================

const MoreMenuSheet = memo(function MoreMenuSheet({
  isOpen,
  onClose,
  onNavigate,
  unlockedBadges,
  totalBadges
}: {
  isOpen: boolean
  onClose: () => void
  onNavigate: (section: string) => void
  unlockedBadges: number
  totalBadges: number
}) {
  const haptic = useHapticFeedback()

  const menuItems = [
    { icon: Trophy, label: 'Achievements', section: 'achievements', badge: `${unlockedBadges}/${totalBadges}` },
    { icon: Settings, label: 'Settings', section: 'settings' },
    { icon: HelpCircle, label: 'Help & Support', section: 'support' },
  ]

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[60]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Sheet */}
      <div className="absolute bottom-0 left-0 right-0 bg-zinc-900 rounded-t-3xl border-t border-white/10 animate-slide-up pb-safe">
        {/* Handle */}
        <div className="flex justify-center py-3">
          <div className="w-10 h-1 rounded-full bg-white/20" />
        </div>

        {/* Menu Items */}
        <div className="px-4 pb-6 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.section}
                onClick={() => {
                  haptic.trigger('light')
                  onNavigate(item.section)
                }}
                className="w-full flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 active:bg-white/10 active:scale-[0.98] transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-yellow-500/10 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-amber-400" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-bold text-white">{item.label}</p>
                </div>
                {item.badge && (
                  <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-sm font-bold">
                    {item.badge}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* Close Button */}
        <div className="px-4 pb-4">
          <button
            onClick={onClose}
            className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-white/70 font-bold active:bg-white/10 transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
})

// ============================================
// BOTTOM SHEET COMPONENT
// ============================================

interface BottomSheetProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  height?: 'auto' | 'half' | 'full'
}

export const BottomSheet = memo(function BottomSheet({
  isOpen,
  onClose,
  title,
  children,
  height = 'auto'
}: BottomSheetProps) {
  const [startY, setStartY] = useState(0)
  const [currentY, setCurrentY] = useState(0)
  const [isDragging, setIsDragging] = useState(false)

  const heightClasses = {
    auto: 'max-h-[85vh]',
    half: 'h-[50vh]',
    full: 'h-[90vh]'
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartY(e.touches[0].clientY)
    setIsDragging(true)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return
    const diff = e.touches[0].clientY - startY
    if (diff > 0) {
      setCurrentY(diff)
    }
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
    if (currentY > 100) {
      onClose()
    }
    setCurrentY(0)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[70]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Sheet */}
      <div
        className={`absolute bottom-0 left-0 right-0 bg-zinc-900 rounded-t-3xl border-t border-white/10 animate-slide-up ${heightClasses[height]} overflow-hidden pb-safe`}
        style={{
          transform: `translateY(${currentY}px)`,
          transition: isDragging ? 'none' : 'transform 0.3s ease-out'
        }}
      >
        {/* Handle */}
        <div
          className="flex justify-center py-3 cursor-grab active:cursor-grabbing"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="w-10 h-1 rounded-full bg-white/20" />
        </div>

        {/* Header */}
        {title && (
          <div className="flex items-center justify-between px-5 pb-4 border-b border-white/10">
            <h3 className="text-lg font-bold text-white">{title}</h3>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5 text-white/50" />
            </button>
          </div>
        )}

        {/* Content */}
        <div className="overflow-y-auto" style={{ maxHeight: 'calc(85vh - 80px)' }}>
          {children}
        </div>
      </div>
    </div>
  )
})

// ============================================
// MOBILE PAGE WRAPPER
// ============================================

export const MobilePageWrapper = memo(function MobilePageWrapper({
  children,
  hasBottomNav = true
}: {
  children: React.ReactNode
  hasBottomNav?: boolean
}) {
  return (
    <div
      className={`min-h-screen bg-zinc-950 ${hasBottomNav ? 'pb-24' : ''}`}
      style={{
        backgroundColor: '#09090b',
        minHeight: '100dvh',
        // Prevent iOS Safari overscroll white flash
        overscrollBehavior: 'none',
      }}
    >
      {children}
    </div>
  )
})

// ============================================
// SWIPEABLE HORIZONTAL SCROLL
// ============================================

export const HorizontalScroll = memo(function HorizontalScroll({
  children,
  className = ''
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={`flex gap-3 overflow-x-auto scrollbar-hide snap-x snap-mandatory -mx-4 px-4 ${className}`}
      style={{ WebkitOverflowScrolling: 'touch' }}
    >
      {children}
    </div>
  )
})

// ============================================
// TOUCH FEEDBACK BUTTON
// ============================================

export const TouchButton = memo(function TouchButton({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false
}: {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  disabled?: boolean
}) {
  const [isPressed, setIsPressed] = useState(false)
  const haptic = useHapticFeedback()

  const handlePress = () => {
    if (disabled) return
    haptic.trigger('light')
    setIsPressed(true)
    setTimeout(() => setIsPressed(false), 150)
    onClick?.()
  }

  const variants = {
    primary: 'bg-gradient-to-r from-amber-500 to-yellow-500 text-black shadow-lg shadow-amber-500/25',
    secondary: 'bg-white/5 border border-white/10 text-white',
    ghost: 'bg-transparent text-white/70'
  }

  const sizes = {
    sm: 'px-4 py-2 text-sm rounded-xl',
    md: 'px-5 py-3 text-base rounded-xl',
    lg: 'px-6 py-4 text-lg rounded-2xl',
    xl: 'px-8 py-5 text-xl rounded-2xl'
  }

  return (
    <button
      onClick={handlePress}
      disabled={disabled}
      className={`font-bold transition-all duration-150 ${variants[variant]} ${sizes[size]} ${
        isPressed ? 'scale-95 opacity-90' : 'scale-100 opacity-100'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'} ${className}`}
    >
      {children}
    </button>
  )
})

// ============================================
// ANIMATED NUMBER (MOBILE OPTIMIZED)
// ============================================

export const MobileAnimatedNumber = memo(function MobileAnimatedNumber({
  value,
  prefix = '',
  suffix = '',
  className = ''
}: {
  value: number
  prefix?: string
  suffix?: string
  className?: string
}) {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    const duration = 800
    const startTime = performance.now()
    const startValue = displayValue

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplayValue(Math.round(startValue + (value - startValue) * eased))

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [value])

  return (
    <span className={className}>
      {prefix}{displayValue.toLocaleString()}{suffix}
    </span>
  )
})

// ============================================
// COACH TIP (FIRST-TIME HINTS)
// ============================================

export const CoachTip = memo(function CoachTip({
  text,
  position = 'bottom',
  onDismiss
}: {
  text: string
  position?: 'top' | 'bottom'
  onDismiss?: () => void
}) {
  const positionClasses = {
    top: 'bottom-full mb-2',
    bottom: 'top-full mt-2'
  }

  return (
    <div className={`absolute left-1/2 -translate-x-1/2 z-50 ${positionClasses[position]} animate-fade-in`}>
      <div className="relative bg-amber-500 text-black px-4 py-2 rounded-xl shadow-lg max-w-[200px]">
        <p className="text-sm font-medium text-center">{text}</p>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-black flex items-center justify-center"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        )}
        {/* Arrow */}
        <div
          className={`absolute left-1/2 -translate-x-1/2 w-3 h-3 bg-amber-500 rotate-45 ${
            position === 'bottom' ? '-top-1.5' : '-bottom-1.5'
          }`}
        />
      </div>
    </div>
  )
})

export default MobileBottomNav
