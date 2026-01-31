'use client'

import { useState, useEffect, useRef, memo } from 'react'

// ============================================
// ANIMATED COUNTER - Count up effect
// ============================================

interface AnimatedCounterProps {
  value: number
  duration?: number
  prefix?: string
  suffix?: string
  decimals?: number
  className?: string
}

export const AnimatedCounter = memo(function AnimatedCounter({
  value,
  duration = 1500,
  prefix = '',
  suffix = '',
  decimals = 0,
  className = ''
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(0)
  const previousValue = useRef(0)
  const animationRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    const startValue = previousValue.current
    const endValue = value
    const startTime = performance.now()

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Easing function (ease-out-expo)
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)

      const current = startValue + (endValue - startValue) * eased
      setDisplayValue(current)

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate)
      } else {
        previousValue.current = endValue
      }
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [value, duration])

  const formatted = displayValue.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  })

  return (
    <span className={className}>
      {prefix}{formatted}{suffix}
    </span>
  )
})

// ============================================
// ANIMATED CURRENCY - With symbol
// ============================================

interface AnimatedCurrencyProps {
  value: number
  currency: string
  duration?: number
  className?: string
  showSign?: boolean
}

export const AnimatedCurrency = memo(function AnimatedCurrency({
  value,
  currency,
  duration = 1500,
  className = '',
  showSign = false
}: AnimatedCurrencyProps) {
  const [displayValue, setDisplayValue] = useState(0)
  const previousValue = useRef(0)
  const animationRef = useRef<number | undefined>(undefined)

  const getCurrencySymbol = (code: string) => {
    const symbols: Record<string, string> = {
      USD: '$', EUR: '€', GBP: '£', JPY: '¥', CNY: '¥',
      INR: '₹', BRL: 'R$', CAD: 'C$', AUD: 'A$', CHF: 'Fr',
      MXN: '$', KRW: '₩', THB: '฿', SGD: 'S$', HKD: 'HK$'
    }
    return symbols[code] || '$'
  }

  useEffect(() => {
    const startValue = previousValue.current
    const endValue = value
    const startTime = performance.now()

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
      const current = startValue + (endValue - startValue) * eased
      setDisplayValue(current)

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate)
      } else {
        previousValue.current = endValue
      }
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [value, duration])

  const symbol = getCurrencySymbol(currency)
  const sign = showSign ? (value >= 0 ? '+' : '') : ''
  const absValue = Math.abs(displayValue)

  const formatted = absValue.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: absValue >= 1000 ? 0 : 2
  })

  return (
    <span className={className}>
      {sign}{displayValue < 0 ? '-' : ''}{symbol}{formatted}
    </span>
  )
})

// ============================================
// PROGRESS RING - Circular progress
// ============================================

interface ProgressRingProps {
  progress: number
  size?: number
  strokeWidth?: number
  color?: string
  bgColor?: string
  className?: string
  children?: React.ReactNode
}

export const ProgressRing = memo(function ProgressRing({
  progress,
  size = 120,
  strokeWidth = 8,
  color = 'rgb(245 158 11)',
  bgColor = 'rgba(255,255,255,0.1)',
  className = '',
  children
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (Math.min(Math.max(progress, 0), 100) / 100) * circumference

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={bgColor}
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      {children && (
        <div className="absolute inset-0 flex items-center justify-center">
          {children}
        </div>
      )}
    </div>
  )
})

// ============================================
// GLOW EFFECT - Ambient glow
// ============================================

interface GlowEffectProps {
  color?: string
  intensity?: 'low' | 'medium' | 'high'
  className?: string
}

export const GlowEffect = memo(function GlowEffect({
  color = 'amber',
  intensity = 'medium',
  className = ''
}: GlowEffectProps) {
  const intensityMap = {
    low: 'opacity-20',
    medium: 'opacity-30',
    high: 'opacity-50'
  }

  const colorMap: Record<string, string> = {
    amber: 'bg-amber-500',
    emerald: 'bg-emerald-500',
    rose: 'bg-rose-500',
    violet: 'bg-violet-500',
    blue: 'bg-blue-500'
  }

  return (
    <div
      className={`absolute rounded-full blur-3xl ${colorMap[color] || colorMap.amber} ${intensityMap[intensity]} ${className}`}
      aria-hidden="true"
    />
  )
})

// ============================================
// SHIMMER EFFECT - Loading shimmer
// ============================================

export const Shimmer = memo(function Shimmer({ className = '' }: { className?: string }) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </div>
  )
})

// ============================================
// PULSE DOT - Status indicator
// ============================================

interface PulseDotProps {
  color?: 'green' | 'amber' | 'red'
  size?: 'sm' | 'md' | 'lg'
}

export const PulseDot = memo(function PulseDot({
  color = 'green',
  size = 'md'
}: PulseDotProps) {
  const colorClasses = {
    green: 'bg-emerald-500',
    amber: 'bg-amber-500',
    red: 'bg-rose-500'
  }

  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4'
  }

  return (
    <span className="relative flex">
      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${colorClasses[color]} opacity-75`} />
      <span className={`relative inline-flex rounded-full ${sizeClasses[size]} ${colorClasses[color]}`} />
    </span>
  )
})

// ============================================
// FADE IN - Animation wrapper
// ============================================

interface FadeInProps {
  children: React.ReactNode
  delay?: number
  duration?: number
  className?: string
}

export const FadeIn = memo(function FadeIn({
  children,
  delay = 0,
  duration = 500,
  className = ''
}: FadeInProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay)
    return () => clearTimeout(timer)
  }, [delay])

  return (
    <div
      className={`transition-all ${className}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(10px)',
        transitionDuration: `${duration}ms`
      }}
    >
      {children}
    </div>
  )
})

// ============================================
// STAGGER CHILDREN - Staggered animation
// ============================================

interface StaggerChildrenProps {
  children: React.ReactNode[]
  staggerDelay?: number
  className?: string
}

export const StaggerChildren = memo(function StaggerChildren({
  children,
  staggerDelay = 100,
  className = ''
}: StaggerChildrenProps) {
  return (
    <div className={className}>
      {children.map((child, index) => (
        <FadeIn key={index} delay={index * staggerDelay}>
          {child}
        </FadeIn>
      ))}
    </div>
  )
})

// ============================================
// TOOLTIP - Help tooltip
// ============================================

interface TooltipProps {
  content: string
  children: React.ReactNode
  position?: 'top' | 'bottom' | 'left' | 'right'
}

export const Tooltip = memo(function Tooltip({
  content,
  children,
  position = 'top'
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false)

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2'
  }

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div
          className={`absolute z-50 px-3 py-2 text-sm text-white bg-zinc-900 border border-white/10 rounded-lg shadow-xl whitespace-nowrap ${positionClasses[position]}`}
          role="tooltip"
        >
          {content}
          <div
            className={`absolute w-2 h-2 bg-zinc-900 border-white/10 transform rotate-45 ${
              position === 'top' ? 'top-full -mt-1 left-1/2 -translate-x-1/2 border-r border-b' :
              position === 'bottom' ? 'bottom-full -mb-1 left-1/2 -translate-x-1/2 border-l border-t' :
              position === 'left' ? 'left-full -ml-1 top-1/2 -translate-y-1/2 border-t border-r' :
              'right-full -mr-1 top-1/2 -translate-y-1/2 border-b border-l'
            }`}
          />
        </div>
      )}
    </div>
  )
})

// ============================================
// HELP ICON - ? with tooltip
// ============================================

interface HelpIconProps {
  content: string
  position?: 'top' | 'bottom' | 'left' | 'right'
}

export const HelpIcon = memo(function HelpIcon({
  content,
  position = 'top'
}: HelpIconProps) {
  return (
    <Tooltip content={content} position={position}>
      <button
        className="w-5 h-5 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/50 hover:text-white/80 text-xs font-medium transition-all"
        aria-label="Help"
      >
        ?
      </button>
    </Tooltip>
  )
})

// ============================================
// CONFETTI BURST - Celebration effect
// ============================================

export const ConfettiBurst = memo(function ConfettiBurst({
  active,
  duration = 3000
}: {
  active: boolean
  duration?: number
}) {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; color: string }>>([])

  useEffect(() => {
    if (active) {
      const newParticles = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        color: ['#f59e0b', '#10b981', '#ec4899', '#8b5cf6', '#3b82f6'][Math.floor(Math.random() * 5)]
      }))
      setParticles(newParticles)

      const timer = setTimeout(() => setParticles([]), duration)
      return () => clearTimeout(timer)
    }
  }, [active, duration])

  if (particles.length === 0) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute w-3 h-3 rounded-full animate-confetti"
          style={{
            left: `${p.x}%`,
            backgroundColor: p.color,
            animationDelay: `${Math.random() * 0.5}s`
          }}
        />
      ))}
    </div>
  )
})

// ============================================
// TOAST NOTIFICATION
// ============================================

interface ToastProps {
  message: string
  type?: 'success' | 'error' | 'info' | 'achievement'
  icon?: React.ReactNode
  onClose: () => void
  duration?: number
}

export const Toast = memo(function Toast({
  message,
  type = 'success',
  icon,
  onClose,
  duration = 3000
}: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration)
    return () => clearTimeout(timer)
  }, [onClose, duration])

  const typeStyles = {
    success: 'bg-emerald-500 text-white',
    error: 'bg-rose-500 text-white',
    info: 'bg-blue-500 text-white',
    achievement: 'bg-gradient-to-r from-amber-500 to-yellow-500 text-black'
  }

  return (
    <div className={`fixed top-6 right-6 z-50 animate-slide-down ${typeStyles[type]} px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3`}>
      {icon}
      <span className="font-semibold">{message}</span>
    </div>
  )
})
