'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Image from 'next/image'
import {
  Gift, X, Crown, Check, Sparkles, Zap, Clock, Star,
  Users, Target, Layout, Phone, TrendingUp, FileText,
  Shield, Lock, RefreshCw, Loader, Mail, Smile, Stethoscope,
  Video, Globe, Camera
} from 'lucide-react'
import confetti from 'canvas-confetti'
import { markUserAsSpun } from '../utils/fingerprint'
import { DENTIST_BONUS_PRODUCTS, DentistBonusProduct, DENTIST_PLAN_IDS } from '../config/dentist-bonus-products'
import WhopCheckoutModal from './WhopCheckoutModal'
import { trackInitiateCheckout, trackAddToCart } from '../utils/meta-tracking'

// Icon mapping for dynamic rendering - DENTIST ICONS
const iconMap: Record<string, any> = {
  Users,
  Star,
  Target,
  Layout,
  Phone,
  Smile,
  TrendingUp,
  FileText,
  Mail,
  Sparkles,
  Stethoscope,
  Video,
  Globe,
  Camera,
}

// Helper component to render dynamic icon
const ProductIcon = ({ product, size }: { product: DentistBonusProduct; size?: string }) => {
  const IconComponent = iconMap[product.icon] || Gift
  const sizeClass = size || 'w-8 h-8'
  return <IconComponent className={sizeClass} style={{ color: product.iconColor }} />
}

// 3-TIER PREMIUM GIFTS SYSTEM FOR DENTISTS
// EVERYONE WINS PLATINUM (3% shown, 100% actual) - Maximum Dopamine!
// TIER COLORS: PLATINUM (Teal #14b8a6) | GOLD (Cyan #06b6d4) | SILVER (Gray #9ca3af)

const GIFTS = [
  // 🏆 PLATINUM TIER (3% displayed, 100% actual) - EVERYONE GETS THIS!
  {
    id: 'ultimate-dental-bundle',
    name: '🦷 BUILD YOUR DREAM BUNDLE + 🎁 MYSTERY VIP BOX',
    shortName: 'Ultimate Dental Bundle',
    description: 'Choose ANY 5 dental practice bonuses + Exclusive Mystery Box (Worth $500+)',
    value: '$1,623',
    color: '#14b8a6', // TEAL for PLATINUM - Ultra Rare!
    tier: 'PLATINUM',
    tierColor: 'from-teal-500 via-cyan-400 to-white',
    probability: 1.0, // EVERYONE GETS THIS (100%)
    percentage: '3%', // But we SHOW 3% to make them feel lucky!
    message: '🚨 STOP... DID YOU JUST WIN THE IMPOSSIBLE?!',
    subMessage: 'Only 3 OUT OF 100 dentists unlock this! You\'re ONE OF THE LUCKY FEW! 🍀',
    emoji: '🦷',
    image: '/images/dentist/vip-bundle.webp',
    winnerCount: Math.floor(Math.random() * 30) + 18,
    isUltraRare: true,
    customizable: true,
  },

  // 🥇 GOLD TIER (32% shown) - BEST 3 Products (But they never actually get these)
  {
    id: 'case-acceptance-mastery',
    name: '🎯 Case Acceptance Mastery',
    shortName: 'Case Acceptance',
    description: 'Close 80%+ of treatment plans',
    value: '$497',
    color: '#06b6d4', // Cyan for GOLD
    tier: 'GOLD',
    tierColor: 'from-cyan-500 to-teal-400',
    probability: 0.00,
    percentage: '12%',
    message: '🎯 AMAZING! Case acceptance system unlocked!',
    subMessage: 'Used by top 1% dental practices!',
    emoji: '🎯',
    image: '/images/dentist/case-acceptance.webp',
  },
  {
    id: 'patient-reactivation-pro',
    name: '👥 Patient Reactivation Pro',
    shortName: 'Reactivation',
    description: '$50K+ in reactivated patients',
    value: '$397',
    color: '#06b6d4',
    tier: 'GOLD',
    tierColor: 'from-cyan-500 to-teal-400',
    probability: 0.00,
    percentage: '10%',
    message: '👥 INCREDIBLE! Reactivation system unlocked!',
    subMessage: 'Bring back inactive patients on autopilot!',
    emoji: '👥',
    image: '/images/dentist/patient-reactivation.webp',
  },
  {
    id: 'invisalign-domination',
    name: '😁 Invisalign Domination Kit',
    shortName: 'Invisalign Kit',
    description: 'Become THE Invisalign provider',
    value: '$397',
    color: '#06b6d4',
    tier: 'GOLD',
    tierColor: 'from-cyan-500 to-teal-400',
    probability: 0.00,
    percentage: '10%',
    message: '😁 YES! Invisalign marketing unlocked!',
    subMessage: 'Close $100K+ in Invisalign cases!',
    emoji: '😁',
    image: '/images/dentist/invisalign-kit.webp',
  },

  // 🥈 SILVER TIER (60% shown) - 5 Normal Products (But they never actually get these)
  {
    id: 'review-machine',
    name: '⭐ 5-Star Review Machine',
    shortName: 'Review System',
    description: 'Get 3+ Google reviews per week',
    value: '$197',
    color: '#9ca3af',
    tier: 'SILVER',
    tierColor: 'from-gray-400 to-gray-300',
    probability: 0.00,
    percentage: '12%',
    message: '⭐ NICE! Review machine secured!',
    subMessage: 'Dominate local search rankings!',
    emoji: '⭐',
    image: '/images/dentist/review-machine.webp',
  },
  {
    id: 'social-media-bundle',
    name: '📱 450+ Social Templates',
    shortName: 'Social Bundle',
    description: '1 year of dental content',
    value: '$147',
    color: '#9ca3af',
    tier: 'SILVER',
    tierColor: 'from-gray-400 to-gray-300',
    probability: 0.00,
    percentage: '12%',
    message: '📱 GREAT! Social templates unlocked!',
    subMessage: 'Never stare at a blank screen again!',
    emoji: '📱',
    image: '/images/dentist/social-media-bundle.webp',
  },
  {
    id: 'phone-scripts',
    name: '📞 Phone Conversion Scripts',
    shortName: 'Phone Scripts',
    description: 'Turn 80% of callers into bookings',
    value: '$127',
    color: '#9ca3af',
    tier: 'SILVER',
    tierColor: 'from-gray-400 to-gray-300',
    probability: 0.00,
    percentage: '12%',
    message: '📞 AWESOME! Phone scripts ready!',
    subMessage: 'Convert more callers into patients!',
    emoji: '📞',
    image: '/images/dentist/phone-scripts.webp',
  },
  {
    id: 'email-system',
    name: '✉️ Email Marketing System',
    shortName: 'Email System',
    description: '52 weeks of patient emails',
    value: '$127',
    color: '#9ca3af',
    tier: 'SILVER',
    tierColor: 'from-gray-400 to-gray-300',
    probability: 0.00,
    percentage: '12%',
    message: '✉️ CONGRATS! Email system unlocked!',
    subMessage: 'Keep your chairs full year-round!',
    emoji: '✉️',
    image: '/images/dentist/email-system.webp',
  },
  {
    id: 'patient-forms',
    name: '📋 Professional Forms Bundle',
    shortName: 'Forms Pack',
    description: 'Every form your practice needs',
    value: '$97',
    color: '#9ca3af',
    tier: 'SILVER',
    tierColor: 'from-gray-400 to-gray-300',
    probability: 0.00,
    percentage: '12%',
    message: '📋 NICE! Forms bundle secured!',
    subMessage: 'HIPAA compliant, professionally designed!',
    emoji: '📋',
    image: '/images/dentist/patient-forms.webp',
  },
]

// TIER DISTRIBUTION (DISPLAYED): PLATINUM 3% | GOLD 32% | SILVER 60% = 95%
// ACTUAL DISTRIBUTION: PLATINUM 100% (Everyone wins the "impossible"!)

interface SpinWheelProps {
  onSpinComplete?: (gift: typeof GIFTS[0]) => void
  isOpen: boolean
  onClose: () => void
}

export default function SpinWheel({ onSpinComplete, isOpen, onClose }: SpinWheelProps) {
  const [isSpinning, setIsSpinning] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [selectedGift, setSelectedGift] = useState<typeof GIFTS[0] | null>(null)
  const [hasSpun, setHasSpun] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [showProductExplanation, setShowProductExplanation] = useState(false)
  const [showBundleBuilder, setShowBundleBuilder] = useState(false)
  const [selectedBonuses, setSelectedBonuses] = useState<string[]>([])
  // selectedAddons state removed - simplified to $58.22 base price only
  const [timeLeft, setTimeLeft] = useState(19 * 60) // 19 minutes in seconds
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false) // Loading state for checkout button
  const [showCheckoutModal, setShowCheckoutModal] = useState(false) // Embedded checkout modal state
  const [totalSpinsToday] = useState(Math.floor(Math.random() * 50) + 130) // 130-180 spins today
  const [totalSaved, setTotalSaved] = useState(0)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const spinAudioRef = useRef<HTMLAudioElement | null>(null)
  const winAudioRef = useRef<HTMLAudioElement | null>(null)
  const tickAudioRef = useRef<HTMLAudioElement | null>(null)
  const animationRef = useRef<number | null>(null) // Prevent multiple animations
  const hasSpunRef = useRef<boolean>(false) // Ultimate guard - never reset!
  const resultScreenRef = useRef<HTMLDivElement>(null) // UX: Ref for result screen scroll
  const bundleBuilderRef = useRef<HTMLDivElement>(null) // UX: Ref for bundle builder scroll
  const productExplanationRef = useRef<HTMLDivElement>(null) // UX: Ref for product explanation scroll
  const checkoutButtonRef = useRef<HTMLButtonElement>(null) // PERFORMANCE: Ref for checkout button
  const [isPrefetched, setIsPrefetched] = useState(false) // PERFORMANCE: Track if we've prefetched

  // PERFORMANCE: Prefetch Whop checkout resources (on hover or when button visible)
  const prefetchCheckout = useCallback(() => {
    if (isPrefetched) return
    setIsPrefetched(true)

    const link = document.createElement('link')
    link.rel = 'prefetch'
    link.as = 'script'
    link.href = 'https://whop.com/checkout.js'
    document.head.appendChild(link)

    console.log('🚀 Prefetching Whop checkout resources...')
  }, [isPrefetched])

  // PERFORMANCE: Intersection Observer - prefetch when button scrolls into view
  useEffect(() => {
    const button = checkoutButtonRef.current
    if (!button) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isPrefetched) {
            prefetchCheckout()
          }
        })
      },
      { rootMargin: '50px' }
    )

    observer.observe(button)
    return () => observer.disconnect()
  }, [prefetchCheckout, isPrefetched])

  // LOCK BODY SCROLL when modal is open
  useEffect(() => {
    if (!isOpen) return

    // Save current scroll position and lock body
    const scrollY = window.scrollY
    const scrollX = window.scrollX

    // Apply scroll lock styles
    document.body.style.position = 'fixed'
    document.body.style.top = `-${scrollY}px`
    document.body.style.left = `-${scrollX}px`
    document.body.style.right = '0'
    document.body.style.width = '100%'
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'

    // Prevent touchmove on body (for iOS)
    const preventTouchMove = (e: TouchEvent) => {
      const target = e.target as HTMLElement
      // Allow scrolling inside the modal content
      if (target.closest('.spin-wheel-scroll-container')) {
        return
      }
      e.preventDefault()
    }

    document.body.addEventListener('touchmove', preventTouchMove, { passive: false })

    return () => {
      // Restore scroll position
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.left = ''
      document.body.style.right = ''
      document.body.style.width = ''
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
      window.scrollTo(scrollX, scrollY)

      document.body.removeEventListener('touchmove', preventTouchMove)
    }
  }, [isOpen])

  // Check if user has already spun
  useEffect(() => {
    const spunGift = localStorage.getItem('dentistSpinGift')
    if (spunGift) {
      const gift = GIFTS.find((g) => g.id === spunGift)
      if (gift) {
        setSelectedGift(gift)
        setHasSpun(true)
        setShowResult(true)
      }
    }
  }, [])

  // Cleanup animation on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current)
        animationRef.current = null
      }
    }
  }, [])

  // Scroll to top when 5 bonuses are selected (show checkout section)
  useEffect(() => {
    if (selectedBonuses.length === 5) {
      // Small delay to ensure DOM has updated, then scroll to top
      setTimeout(() => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        })
        // Backup instant scroll in case smooth doesn't work
        setTimeout(() => {
          if (window.scrollY > 100) {
            window.scrollTo(0, 0)
          }
        }, 100)
      }, 100)
    }
  }, [selectedBonuses.length])

  // 19-MINUTE COUNTDOWN TIMER
  useEffect(() => {
    if (!showResult) return // Only start timer after they win

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [showResult])

  // Format countdown timer
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Draw the premium wheel with gradients
  useEffect(() => {
    if (!isOpen) return // Don't draw if modal is closed

    const canvas = canvasRef.current
    if (!canvas) {
      console.log('Canvas ref not available')
      return
    }

    const ctx = canvas.getContext('2d')
    if (!ctx) {
      console.log('Canvas context not available')
      return
    }

    try {
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2
      const radius = canvas.width / 2 - 10

      const segmentAngle = (2 * Math.PI) / GIFTS.length

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

    // MODERN LUXURY DESIGN - 2025

    // Outer glow rings - Multi-layer for depth
    ctx.shadowColor = '#14b8a6'
    ctx.shadowBlur = 30

    // Triple ring glow effect
    for (let i = 3; i >= 1; i--) {
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius + (i * 3), 0, 2 * Math.PI)
      ctx.strokeStyle = `rgba(212, 175, 55, ${0.3 / i})`
      ctx.lineWidth = 2
      ctx.stroke()
    }
    ctx.shadowBlur = 0

    // Draw segments with modern gradients
    GIFTS.forEach((gift, index) => {
      const startAngle = index * segmentAngle - Math.PI / 2 + (rotation * Math.PI) / 180
      const endAngle = startAngle + segmentAngle

      // Radial gradient for each segment (center to edge)
      const gradient = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, radius
      )

      // Premium gradient based on tier
      if (gift.color) {
        gradient.addColorStop(0, gift.color + '40') // Lighter at center
        gradient.addColorStop(0.6, gift.color) // Full color
        gradient.addColorStop(1, gift.color + 'CC') // Slightly darker at edge
      }

      // Draw segment
      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.arc(centerX, centerY, radius, startAngle, endAngle)
      ctx.closePath()
      ctx.fillStyle = gradient
      ctx.fill()

      // Premium white borders
      ctx.strokeStyle = '#ffffff'
      ctx.lineWidth = 3
      ctx.stroke()

      // Glossy overlay effect
      ctx.globalAlpha = 0.15
      const glossGradient = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, radius
      )
      glossGradient.addColorStop(0, '#ffffff')
      glossGradient.addColorStop(1, 'transparent')
      ctx.fillStyle = glossGradient
      ctx.fill()
      ctx.globalAlpha = 1

      // PROFESSIONAL TEXT LAYOUT - Clean & Readable
      ctx.save()
      ctx.translate(centerX, centerY)
      ctx.rotate(startAngle + segmentAngle / 2 + Math.PI / 2)

      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'

      // Text shadow for readability
      ctx.shadowColor = 'rgba(0,0,0,0.8)'
      ctx.shadowBlur = 3
      ctx.shadowOffsetY = 2

      // Emoji at top - LARGER
      const emoji = gift.emoji || gift.name.split(' ')[0]
      ctx.font = 'bold 28px Arial'
      ctx.fillStyle = '#ffffff'
      ctx.fillText(emoji, 0, -radius * 0.6)

      // Percentage in middle - PROFESSIONAL BADGE STYLE (Only show on first segment of each tier)
      const shouldShowPercentage =
        (gift.tier === 'PLATINUM') || // Always show on platinum
        (gift.tier === 'GOLD' && index === 1) || // Only first gold segment
        (gift.tier === 'SILVER' && index === 4) // Only first silver segment

      if (shouldShowPercentage) {
        // Show total percentage for tier
        const totalPercentage = gift.tier === 'PLATINUM' ? '3%' :
                               gift.tier === 'GOLD' ? '32%' : '60%'

        const badgeY = -radius * 0.35
        const badgeWidth = 70
        const badgeHeight = 32

        // Draw badge background with gradient
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)'
        ctx.shadowBlur = 8
        ctx.shadowOffsetY = 3

        // Background badge - rounded rectangle
        const x = -badgeWidth / 2
        const y = badgeY - badgeHeight / 2
        const cornerRadius = 16

        // Create gradient for badge
        const gradient = ctx.createLinearGradient(x, y, x, y + badgeHeight)

        if (gift.tier === 'PLATINUM') {
          gradient.addColorStop(0, 'rgba(255, 0, 64, 0.95)')
          gradient.addColorStop(1, 'rgba(200, 0, 50, 0.95)')
        } else if (gift.tier === 'GOLD') {
          gradient.addColorStop(0, 'rgba(253, 184, 19, 0.95)')
          gradient.addColorStop(1, 'rgba(234, 158, 0, 0.95)')
        } else {
          gradient.addColorStop(0, 'rgba(220, 220, 220, 0.95)')
          gradient.addColorStop(1, 'rgba(180, 180, 180, 0.95)')
        }

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.moveTo(x + cornerRadius, y)
        ctx.lineTo(x + badgeWidth - cornerRadius, y)
        ctx.quadraticCurveTo(x + badgeWidth, y, x + badgeWidth, y + cornerRadius)
        ctx.lineTo(x + badgeWidth, y + badgeHeight - cornerRadius)
        ctx.quadraticCurveTo(x + badgeWidth, y + badgeHeight, x + badgeWidth - cornerRadius, y + badgeHeight)
        ctx.lineTo(x + cornerRadius, y + badgeHeight)
        ctx.quadraticCurveTo(x, y + badgeHeight, x, y + badgeHeight - cornerRadius)
        ctx.lineTo(x, y + cornerRadius)
        ctx.quadraticCurveTo(x, y, x + cornerRadius, y)
        ctx.closePath()
        ctx.fill()

        // Badge border/highlight
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)'
        ctx.lineWidth = 2
        ctx.stroke()

        // Reset shadow for text
        ctx.shadowColor = 'rgba(0, 0, 0, 0.8)'
        ctx.shadowBlur = 2
        ctx.shadowOffsetY = 1

        // Draw percentage text
        ctx.font = 'bold 20px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
        ctx.fillStyle = '#FFFFFF'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(totalPercentage, 0, badgeY)
      }

      ctx.shadowBlur = 0
      ctx.restore()
    })

    // Center button - Premium 3D effect
    const centerGradient = ctx.createRadialGradient(centerX, centerY - 5, 0, centerX, centerY, 55)
    centerGradient.addColorStop(0, '#ffd700')
    centerGradient.addColorStop(0.5, '#14b8a6')
    centerGradient.addColorStop(1, '#b8941e')

    // Outer shadow for 3D depth
    ctx.shadowColor = 'rgba(0,0,0,0.4)'
    ctx.shadowBlur = 15
    ctx.shadowOffsetY = 5

    ctx.beginPath()
    ctx.arc(centerX, centerY, 55, 0, 2 * Math.PI)
    ctx.fillStyle = centerGradient
    ctx.fill()

    // White border
    ctx.shadowBlur = 0
    ctx.strokeStyle = '#ffffff'
    ctx.lineWidth = 4
    ctx.stroke()

    // Inner highlight (glossy effect)
    ctx.globalAlpha = 0.3
    const highlight = ctx.createRadialGradient(centerX, centerY - 15, 0, centerX, centerY, 40)
    highlight.addColorStop(0, '#ffffff')
    highlight.addColorStop(1, 'transparent')
    ctx.fillStyle = highlight
    ctx.fill()
    ctx.globalAlpha = 1

    // Pulsing ring when spinning
    if (isSpinning) {
      ctx.beginPath()
      ctx.arc(centerX, centerY, 60, 0, 2 * Math.PI)
      ctx.strokeStyle = '#ff0040'
      ctx.lineWidth = 4
      ctx.shadowColor = '#ff0040'
      ctx.shadowBlur = 15
      ctx.stroke()
      ctx.shadowBlur = 0
    }

    // Center text with 3D effect
    ctx.fillStyle = '#0a1128'
    ctx.font = 'bold 22px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.shadowColor = 'rgba(255,255,255,0.5)'
    ctx.shadowBlur = 2
    ctx.shadowOffsetY = 1
    ctx.fillText(isSpinning ? 'GO!' : 'SPIN', centerX, centerY)
    ctx.shadowBlur = 0
    } catch (error) {
      console.error('Canvas drawing error:', error)
    }
  }, [rotation, isSpinning, isOpen])

  const fireConfetti = () => {
    const duration = 3000
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 }

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min
    }

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        return clearInterval(interval)
      }

      const particleCount = 50 * (timeLeft / duration)

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      })
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      })
    }, 250)
  }

  const handleSpin = useCallback(() => {
    // ULTIMATE GUARD: Check ref first (synchronous, can't be bypassed)
    if (hasSpunRef.current) {
      console.log('❌ Spin blocked - hasSpunRef is true')
      return
    }

    // CRITICAL: Prevent multiple spins using both state AND ref
    if (isSpinning || hasSpun || animationRef.current !== null) {
      console.log('❌ Spin blocked - already spinning or has spun')
      return
    }

    console.log('✅ Starting spin...')

    // AGGRESSIVE CANCELLATION: Cancel any existing animation frames
    if (animationRef.current !== null) {
      console.log('⚠️ Cancelling existing animation frame:', animationRef.current)
      cancelAnimationFrame(animationRef.current)
      animationRef.current = null
    }

    hasSpunRef.current = true // Lock IMMEDIATELY and FOREVER
    setIsSpinning(true)
    setHasSpun(true) // Lock immediately

    // ALWAYS select Platinum (index 0) - everyone wins!
    const selectedIndex = 0
    const selectedGift = GIFTS[selectedIndex]

    // Professional UI sound - Start spin
    if (typeof window !== 'undefined') {
      const startSound = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBzOJ0fPTgjMGHm7A7+OZURE=')
      startSound.volume = 0.5
      startSound.play().catch(() => {})
    }

    // CORRECTED LANDING CALCULATION - Land on RED (segment 0) at RIGHT EDGE
    const segmentAngle = 360 / GIFTS.length // 40° per segment
    const startRotation = rotation
    const extraSpins = 8

    // MATH EXPLANATION:
    // - Pointer is at top of wheel (-90° in canvas coordinates, or 270° standard)
    // - Segment 0 when rotation=0: spans from -90° to -50°
    // - We want pointer to point at 85% through segment 0 (the RIGHT edge)
    // - 85% point is at: -90° + (40° * 0.85) = -56°
    // - To move -56° to pointer position -90°: rotation = -90° - (-56°) = -34°
    // - Normalize to positive: -34° + 360° = 326°
    const targetAngle = 326 // This makes it land on RED at the right edge!
    const totalRotation = 360 * extraSpins + targetAngle
    const finalRotation = startRotation + totalRotation

    // 10 second spin with SUSPENSE
    const duration = 10000
    const startTime = Date.now()

    let lastTickTime = 0
    let lastRotation = startRotation
    let hasPlayedNearMiss = false
    let hasPlayedFinalSlowdown = false

    const animate = () => {
      const elapsed = Date.now() - startTime
      let progress = Math.min(elapsed / duration, 1)

      // SMOOTH EASE-OUT ANIMATION (cubic) - NO JUMPS!
      const easeProgress = 1 - Math.pow(1 - progress, 3)

      // Play tension sound at 70%
      if (progress >= 0.7 && !hasPlayedNearMiss && typeof window !== 'undefined') {
        const tensionSound = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBzOJ0fPTgjMGHm7A7+OZURE=')
        tensionSound.volume = 0.6
        tensionSound.play().catch(() => {})
        hasPlayedNearMiss = true
      }

      // Play final anticipation sound at 90%
      if (progress >= 0.9 && !hasPlayedFinalSlowdown && typeof window !== 'undefined') {
        const anticipationSound = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBzOJ0fPTgjMGHm7A7+OZURE=')
        anticipationSound.volume = 0.7
        anticipationSound.play().catch(() => {})
        hasPlayedFinalSlowdown = true
      }

      const currentRotation = startRotation + (finalRotation - startRotation) * easeProgress

      if (progress < 1) {
        // During animation - update rotation smoothly
        setRotation(currentRotation % 360)

        // Professional tick sounds - variable pitch based on speed
        const rotationDelta = Math.abs(currentRotation - lastRotation)
        const timeSinceLastTick = elapsed - lastTickTime
        const speed = rotationDelta / Math.max(timeSinceLastTick, 1)
        const tickInterval = Math.max(30, Math.min(250, 150 - speed * 15))

        if (timeSinceLastTick >= tickInterval && rotationDelta > 0.5) {
          if (typeof window !== 'undefined') {
            // Create professional tick sound with pitch variation
            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
            const oscillator = audioContext.createOscillator()
            const gainNode = audioContext.createGain()

            oscillator.connect(gainNode)
            gainNode.connect(audioContext.destination)

            // Pitch varies with speed - higher when fast, lower when slow
            oscillator.frequency.value = 800 + (speed * 100)
            oscillator.type = 'sine'

            gainNode.gain.setValueAtTime(0.15, audioContext.currentTime)
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05)

            oscillator.start(audioContext.currentTime)
            oscillator.stop(audioContext.currentTime + 0.05)
          }
          lastTickTime = elapsed
        }

        lastRotation = currentRotation
        animationRef.current = requestAnimationFrame(animate)
      } else {
        // LANDED ON PLATINUM - Set exact final rotation to prevent glitch!
        console.log('🎯 Animation complete! Final rotation:', finalRotation % 360)
        setRotation(finalRotation % 360)

        console.log('🔒 Clearing animation ref')
        animationRef.current = null // Clear animation ref

        // DO NOT set isSpinning to false - keep it locked forever to prevent re-spins!
        console.log('💾 Saving win state')
        setSelectedGift(selectedGift)
        localStorage.setItem('dentistSpinGift', selectedGift.id)
        markUserAsSpun()

        // EPIC CONFETTI EXPLOSION
        fireConfetti()

        // PROFESSIONAL VICTORY SOUND - Emotional & Dopamine-triggering
        console.log('🔊 Playing victory sound...')
        if (typeof window !== 'undefined') {
          try {
            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
            console.log('✅ AudioContext created:', audioContext)

            // Victory chord progression - Major 7th chord (C-E-G-B)
            const playTone = (frequency: number, startTime: number, duration: number, volume: number = 0.15) => {
            const oscillator = audioContext.createOscillator()
            const gainNode = audioContext.createGain()

            oscillator.connect(gainNode)
            gainNode.connect(audioContext.destination)

            oscillator.frequency.value = frequency
            oscillator.type = 'sine'

            gainNode.gain.setValueAtTime(volume, startTime)
            gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration)

            oscillator.start(startTime)
            oscillator.stop(startTime + duration)
          }

          const now = audioContext.currentTime

          // 🎊 EPIC VICTORY SOUND - Dopamine-triggering chord progression 🎊
          // Major 7th chord (C-E-G-B) = Joy + Triumph
          playTone(261.63, now, 1.2, 0.35) // C4 - Deep foundation (LOUDER)
          playTone(329.63, now + 0.05, 1.1, 0.32) // E4 - Major third (happiness)
          playTone(392.00, now + 0.1, 1.0, 0.30) // G4 - Perfect fifth (power)
          playTone(493.88, now + 0.15, 0.9, 0.28) // B4 - Major seventh (magic!)

          // Octave jump for excitement
          playTone(523.25, now + 0.25, 0.8, 0.35) // C5 - Victory! (LOUDER)
          playTone(659.25, now + 0.35, 0.7, 0.32) // E5 - Celebration
          playTone(783.99, now + 0.45, 0.6, 0.28) // G5 - Triumph

          // Final sparkle
          playTone(1046.50, now + 0.6, 0.5, 0.25) // C6 - Peak dopamine! (LOUDER)
          playTone(1318.51, now + 0.7, 0.4, 0.22) // E6 - Sparkle finish

          // 🔔 BONUS: Extra celebration bells! 🔔
          playTone(1568.00, now + 0.8, 0.3, 0.18) // G6 - Super sparkle!
          playTone(2093.00, now + 0.9, 0.2, 0.15) // C7 - ULTIMATE HIGH!

            console.log('🎵 Victory sound playing! 11 tones scheduled.')
          } catch (error) {
            console.error('❌ Victory sound error:', error)
          }
        } else {
          console.warn('⚠️ Window object not available for audio')
        }

        // Quick celebration - optimized for faster checkout (was 2500ms)
        setTimeout(() => {
          setShowResult(true)
          // SMOOTH SCROLL TO TOP of result screen
          setTimeout(() => {
            resultScreenRef.current?.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            })
          }, 50)
        }, 800)
      }
    }

    // Start animation (ref check already done at function start)
    animationRef.current = requestAnimationFrame(animate)
  }, [isSpinning, hasSpun, rotation])

  if (!isOpen) return null

  return (
    <div
      className="spin-wheel-scroll-container fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 overflow-y-auto"
      style={{ pointerEvents: 'auto', touchAction: 'pan-y' }}
    >
      <div
        className="bg-gradient-to-br from-navy-deep via-navy-rich to-black rounded-2xl shadow-2xl w-full max-w-full md:max-w-3xl relative border-2 border-teal-500 my-4 md:my-16 mx-2 md:mx-auto"
        style={{ pointerEvents: 'auto' }}
      >
        {/* Close button - only show after result */}
        {showResult && !isSpinning && (
          <button
            onClick={onClose}
            className="absolute top-6 right-6 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md transition-all duration-300 border-2 border-white/30"
            aria-label="Close"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        )}

        {/* Header - High-Converting Copy */}
        <div className="relative text-white p-6 pb-2 text-center">
          {!showResult && !isSpinning && (
            <>
              {/* VALUE AMPLIFICATION */}
              <div className="inline-block bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-4 md:px-6 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-bold mb-2 md:mb-3 animate-pulse shadow-lg shadow-teal-500/30">
                🎁 WIN UP TO $1,634 IN BONUSES!
              </div>

              {/* PRE-FRAME HEADLINE */}
              <h2 className="text-2xl md:text-5xl font-extrabold text-teal-500 mb-2 leading-tight">
                You've Unlocked a<br />FREE Bonus Gift! 🎉
              </h2>

              {/* SOCIAL PROOF */}
              <p className="text-white/80 text-sm md:text-base mb-1">
                ✅ <span className="text-green-400 font-bold">347 dentists</span> won their bonus today
              </p>

              {/* RISK REVERSAL */}
              <p className="text-cyan-400 text-xs md:text-sm font-semibold">
                100% Win Guarantee • Everyone Gets a Premium Bonus
              </p>
            </>
          )}

          {isSpinning && !showResult && (
            <p className="text-3xl font-bold text-teal-500 animate-pulse">
              Spinning...
            </p>
          )}
        </div>

        {/* Content */}
        <div className="p-8 relative">
          {!showResult ? (
            // Spin Wheel
            <div className="flex flex-col items-center">
              {/* Color Guide Legend */}
              {!isSpinning && !hasSpun && (
                <div className="w-full mb-4 md:mb-6 bg-white/5 backdrop-blur-sm border border-teal-500/30 rounded-xl p-3 md:p-4">
                  <p className="text-white/80 text-[10px] md:text-xs uppercase tracking-wide font-bold mb-2 md:mb-3 text-center">Prize Tiers</p>
                  <div className="space-y-1.5 md:space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-teal-500 border-2 border-white" />
                        <span className="text-white font-semibold text-xs md:text-sm">PLATINUM</span>
                      </div>
                      <span className="text-teal-400 font-bold text-xs md:text-sm">3% - Ultra Rare</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-cyan-400 border-2 border-white" />
                        <span className="text-white font-semibold text-xs md:text-sm">GOLD</span>
                      </div>
                      <span className="text-teal-400 font-bold text-xs md:text-sm">32% - Premium</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-gray-300 border-2 border-white" />
                        <span className="text-white font-semibold text-xs md:text-sm">SILVER</span>
                      </div>
                      <span className="text-teal-400 font-bold text-xs md:text-sm">60% - Guaranteed</span>
                    </div>
                  </div>

                  {/* URGENCY/SCARCITY */}
                  <div className="mt-2 md:mt-3 pt-2 md:pt-3 border-t border-white/10">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse" />
                      <p className="text-teal-400 font-bold text-[10px] md:text-xs uppercase tracking-wide">
                        Only 3 PLATINUM prizes left today!
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="relative mb-4 md:mb-6 flex items-center justify-center">
                {/* Simple Pointer - Teal branded */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-6 md:-translate-y-8 z-10">
                  <div className="w-0 h-0 border-l-[16px] md:border-l-[20px] border-l-transparent border-r-[16px] md:border-r-[20px] border-r-transparent border-t-[32px] md:border-t-[40px] border-t-teal-500 drop-shadow-lg" />
                </div>

                {/* Wheel Canvas - Mobile optimized */}
                <div className="relative w-full max-w-[280px] md:max-w-[450px] min-h-[280px] md:min-h-[450px]">
                  <canvas
                    ref={canvasRef}
                    width={450}
                    height={450}
                    className="w-full h-auto"
                    style={{ display: 'block', margin: '0 auto', minHeight: '280px' }}
                  />
                </div>
              </div>

              {!isSpinning && !hasSpun && (
                <div className="text-center mt-4 md:mt-8 animate-fade-in-up space-y-2 md:space-y-3 px-2">
                  {/* High-Converting CTA Button - Mobile Optimized */}
                  <div className="relative">
                    {/* Animated Pulsing Rings */}
                    <div className="absolute inset-0 -z-10">
                      <div className="absolute inset-0 rounded-xl bg-teal-500 opacity-50" style={{ animationDuration: '2s' }}></div>
                      <div className="absolute inset-0 rounded-xl bg-teal-500 opacity-30" style={{ animationDuration: '3s', animationDelay: '0.5s' }}></div>
                    </div>

                    {/* Main Button - Teal Branded */}
                    <button
                      onClick={handleSpin}
                      disabled={isSpinning || hasSpun}
                      className="group w-full bg-gradient-to-r from-teal-500 via-cyan-400 to-teal-500 text-white px-6 md:px-12 py-4 md:py-6 rounded-xl text-lg md:text-3xl font-black hover:scale-105 active:scale-95 transition-all shadow-2xl border-4 border-white/50 relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                      style={{
                        animation: 'bounce-subtle 2s ease-in-out infinite, pulse 2s ease-in-out infinite',
                        boxShadow: '0 0 30px rgba(20, 184, 166, 0.8), 0 0 60px rgba(20, 184, 166, 0.4), 0 10px 40px rgba(0, 0, 0, 0.3)'
                      }}
                    >
                      {/* Shimmer Effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />

                      {/* Glowing Border Animation */}
                      <div className="absolute inset-0 rounded-xl border-2 border-white/80 animate-pulse"></div>

                      {/* Button Text */}
                      <span className="relative inline-block group-hover:animate-pulse">
                        🎁 CLAIM MY FREE BONUS →
                      </span>
                    </button>
                  </div>

                  {/* Additional Urgency - Teal branded */}
                  <p className="text-white/70 text-[10px] md:text-xs animate-pulse">
                    ⏰ <span className="text-teal-400 font-bold">Limited time only</span> • Spin now before prizes run out
                  </p>
                </div>
              )}
            </div>
          ) : !showProductExplanation ? (
            // 🏆 CLEAN & COMPACT WIN SCREEN - MOBILE FIRST
            <div ref={resultScreenRef} className="relative">
              <div className="relative z-10 px-2 md:px-4 py-2 md:py-4 space-y-2 md:space-y-3 max-h-[85vh] overflow-y-auto">

                {/* ⏰ COUNTDOWN TIMER - STICKY TOP - Mobile Optimized */}
                <div className="sticky top-0 bg-gradient-to-b from-navy-deep via-navy-deep to-transparent pb-1 md:pb-2 z-30">
                  <div className="bg-gradient-to-br from-teal-500/20 to-cyan-500/10 backdrop-blur-lg rounded-lg md:rounded-xl p-2 md:p-3 shadow-lg border border-teal-500/30 mb-1 md:mb-2">
                    <div className="flex items-center justify-center gap-2">
                      <Clock className="w-3.5 h-3.5 md:w-4 md:h-4 text-teal-400" />
                      <p className="text-white/90 text-[11px] md:text-sm font-semibold">
                        Offer expires in <span className="text-teal-400 font-black text-sm md:text-xl tabular-nums">{formatTime(timeLeft)}</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* 🎉 SIMPLE CONGRATULATIONS HEADER - Mobile Compact */}
                <div className="text-center space-y-2 md:space-y-3 mb-2 md:mb-4">
                  <div className="inline-flex items-center gap-1.5 md:gap-2 bg-teal-500/10 border border-teal-500/30 rounded-full px-3 md:px-4 py-1 md:py-1.5">
                    <Crown className="w-3 h-3 md:w-3.5 md:h-3.5 text-teal-400" />
                    <span className="text-teal-400 font-bold text-[10px] md:text-xs uppercase tracking-widest">Platinum Winner</span>
                  </div>

                  <h2 className="text-xl md:text-3xl font-black text-white">
                    🎁 Choose Your 5 FREE Bonuses!
                  </h2>

                  <p className="text-xs md:text-base text-cyan-200">
                    Pick Any 5 Premium Tools Worth <span className="text-teal-400 font-bold">$3,671</span>
                  </p>
                </div>

                {/* SELECTION PROGRESS - Mobile Compact */}
                <div className="text-center space-y-1 md:space-y-2 mb-2 md:mb-4">
                  <p className="text-white/70 font-medium text-xs md:text-base">
                    <span className="text-teal-400 font-black text-lg md:text-xl">{selectedBonuses.length}</span>/5 Tools Selected
                  </p>

                  {selectedBonuses.length > 0 && (
                    <p className="text-emerald-400 text-xs md:text-sm font-bold">
                      Saving ${DENTIST_BONUS_PRODUCTS.filter(b => selectedBonuses.includes(b.id)).reduce((sum, b) => sum + b.value, 0)}!
                    </p>
                  )}
                </div>

                {/* BONUS SELECTION GRID - Mobile Optimized */}
                <div className="grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-3">
                    {DENTIST_BONUS_PRODUCTS.map((bonus, index) => {
                      const isSelected = selectedBonuses.includes(bonus.id)
                      const isDisabled = selectedBonuses.length >= 5 && !isSelected

                      return (
                        <button
                          key={bonus.id}
                          onClick={() => {
                            if (isSelected) {
                              setSelectedBonuses(selectedBonuses.filter(id => id !== bonus.id))
                              // 🔊 Soft deselect sound
                              if (typeof window !== 'undefined') {
                                try {
                                  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
                                  const now = audioContext.currentTime
                                  const osc = audioContext.createOscillator()
                                  const gain = audioContext.createGain()
                                  osc.connect(gain)
                                  gain.connect(audioContext.destination)
                                  osc.frequency.setValueAtTime(600, now)
                                  osc.frequency.exponentialRampToValueAtTime(300, now + 0.1)
                                  osc.type = 'sine'
                                  gain.gain.setValueAtTime(0.15, now)
                                  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1)
                                  osc.start(now)
                                  osc.stop(now + 0.1)
                                } catch (e) {}
                              }
                            } else if (selectedBonuses.length < 5) {
                              setSelectedBonuses([...selectedBonuses, bonus.id])

                              // Track AddToCart when user selects a bonus
                              trackAddToCart(bonus.title, bonus.value)

                              // 🎵 MODERN DOPAMINE SOUND - Satisfying selection pop
                              if (typeof window !== 'undefined') {
                                try {
                                  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
                                  const now = audioContext.currentTime

                                  // Create a rich, layered "pop" sound with harmonic overtones
                                  const playNote = (freq: number, start: number, duration: number, vol: number, type: OscillatorType = 'sine') => {
                                    const osc = audioContext.createOscillator()
                                    const gain = audioContext.createGain()
                                    osc.connect(gain)
                                    gain.connect(audioContext.destination)
                                    osc.frequency.value = freq
                                    osc.type = type
                                    // Snappy attack, smooth decay (satisfying feel)
                                    gain.gain.setValueAtTime(0, now + start)
                                    gain.gain.linearRampToValueAtTime(vol, now + start + 0.015)
                                    gain.gain.exponentialRampToValueAtTime(0.001, now + start + duration)
                                    osc.start(now + start)
                                    osc.stop(now + start + duration)
                                  }

                                  // Layer 1: Punchy bass pop (gives weight)
                                  playNote(180, 0, 0.12, 0.4, 'sine')

                                  // Layer 2: Bright "ding" - rising pitch (dopamine trigger)
                                  playNote(880, 0.01, 0.15, 0.25, 'sine')
                                  playNote(1100, 0.03, 0.12, 0.2, 'sine')
                                  playNote(1320, 0.05, 0.1, 0.15, 'triangle')

                                  // Layer 3: Sparkle overtones (modern feel)
                                  playNote(2200, 0.02, 0.08, 0.08, 'sine')
                                  playNote(2640, 0.04, 0.06, 0.05, 'sine')

                                  // Progress indicator: higher pitch for each selection
                                  const progressPitch = 800 + (selectedBonuses.length * 80)
                                  playNote(progressPitch, 0.08, 0.2, 0.12, 'triangle')
                                } catch (e) {
                                  // Silent fail - audio not critical
                                }
                              }
                            }
                          }}
                          disabled={isDisabled}
                          className={`relative text-left p-3 md:p-5 rounded-lg md:rounded-xl transition-all duration-200 border-2 ${
                            isSelected
                              ? 'bg-gradient-to-br from-teal-500 to-cyan-600 border-white shadow-2xl scale-[1.01] md:scale-[1.02]'
                              : isDisabled
                              ? 'bg-white/5 border-white/10 opacity-30 cursor-not-allowed'
                              : 'bg-gradient-to-br from-white/10 to-white/5 border-teal-500/30 hover:border-teal-500 hover:bg-white/20 hover:scale-[1.01] md:hover:scale-[1.02] hover:shadow-teal-glow'
                          }`}
                        >
                          {/* Checkmark */}
                          {isSelected && (
                            <div className="absolute top-1.5 right-1.5 md:top-2 md:right-2 w-6 h-6 md:w-8 md:h-8 bg-white rounded-full flex items-center justify-center shadow-lg animate-scale-in">
                              <Check className="w-4 h-4 md:w-5 md:h-5 text-teal-600" strokeWidth={4} />
                            </div>
                          )}

                          {/* Most Popular Badge */}
                          {index < 3 && !isSelected && (
                            <div className="absolute top-1.5 right-1.5 md:top-2 md:right-2 bg-teal-500 text-white px-1.5 md:px-2 py-0.5 md:py-1 rounded text-[8px] md:text-[9px] font-black">
                              TOP PICK
                            </div>
                          )}

                          <div className="space-y-2 md:space-y-3">
                            {/* Product Image - Mobile Compact */}
                            {bonus.image && (
                              <div className={`relative w-full h-28 md:h-40 rounded-lg md:rounded-xl overflow-hidden shadow-lg ${
                                isSelected
                                  ? 'border-2 border-white/30 ring-2 ring-teal-400'
                                  : 'border-2 border-white/20'
                              }`}>
                                <Image
                                  src={bonus.image}
                                  alt={bonus.title}
                                  fill
                                  className="object-cover"
                                  sizes="(max-width: 768px) 100vw, 50vw"
                                  priority={index < 3}
                                />
                                {/* Subtle gradient overlay for depth */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                              </div>
                            )}

                            {/* Product Details - Mobile Compact */}
                            <div className="flex items-start gap-2 md:gap-3">
                              <div className={`inline-flex p-2 md:p-3 rounded-lg md:rounded-xl ${
                                isSelected
                                  ? 'bg-white/20 shadow-lg'
                                  : 'bg-white/10 shadow-md'
                              }`}>
                                <ProductIcon product={bonus} size="w-5 h-5 md:w-8 md:h-8" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className={`font-bold text-xs md:text-base mb-1 md:mb-2 ${isSelected ? 'text-white' : 'text-white'}`}>
                                  {bonus.title}
                                </h4>
                                <p className={`text-[10px] md:text-sm mb-2 md:mb-3 leading-relaxed ${isSelected ? 'text-white/90' : 'text-white/70'}`}>
                                  {bonus.description}
                                </p>

                                {/* Price Display - Mobile Compact */}
                                <div className="flex items-center gap-1.5 md:gap-2">
                                  {isSelected ? (
                                    <>
                                      <span className="text-white/50 line-through text-[10px] md:text-sm">${bonus.value}</span>
                                      <span className="text-white font-black text-sm md:text-lg">FREE!</span>
                                      <span className="text-cyan-200 text-[9px] md:text-xs font-bold animate-pulse">Saved!</span>
                                    </>
                                  ) : (
                                    <>
                                      <span className="text-white/50 line-through text-[10px] md:text-sm">${bonus.value}</span>
                                      <span className="text-teal-400 font-black text-xs md:text-base">FREE</span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </button>
                      )
                    })}
                </div>

                {/* REFINED BOTTOM CTA - Mobile Optimized */}
                {selectedBonuses.length === 5 && (
                  <div className="sticky bottom-0 bg-gradient-to-t from-navy-deep via-navy-deep to-transparent pt-3 md:pt-6 pb-2 z-30">
                    <button
                      onClick={() => {
                        // Play success sound
                        if (typeof window !== 'undefined') {
                          const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
                          const playTone = (frequency: number, startTime: number) => {
                            const oscillator = audioContext.createOscillator()
                            const gainNode = audioContext.createGain()
                            oscillator.connect(gainNode)
                            gainNode.connect(audioContext.destination)
                            oscillator.frequency.value = frequency
                            oscillator.type = 'sine'
                            gainNode.gain.setValueAtTime(0.2, startTime)
                            gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3)
                            oscillator.start(startTime)
                            oscillator.stop(startTime + 0.3)
                          }
                          const now = audioContext.currentTime
                          playTone(523.25, now)
                          playTone(659.25, now + 0.1)
                          playTone(783.99, now + 0.2)
                        }

                        // Go to Product Explanation screen
                        setShowBundleBuilder(false)
                        setShowProductExplanation(true)

                        // Smooth scroll to top of the next screen
                        setTimeout(() => {
                          productExplanationRef.current?.scrollTo({
                            top: 0,
                            behavior: 'smooth'
                          })
                        }, 100)
                      }}
                      className="group w-full bg-gradient-to-r from-teal-500 via-cyan-500 to-teal-500 text-white px-4 md:px-8 py-4 md:py-6 rounded-lg md:rounded-xl font-black text-base md:text-2xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-xl shadow-teal-500/25 relative overflow-hidden border border-teal-400/30"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                      <span className="relative flex items-center justify-center gap-2 md:gap-3">
                        <Check className="w-5 h-5 md:w-6 md:h-6" />
                        <span>Continue to Review</span>
                        <Check className="w-5 h-5 md:w-6 md:h-6" />
                      </span>
                    </button>

                    <div className="text-center mt-2 md:mt-3 space-y-0.5 md:space-y-1">
                      <p className="text-teal-400 font-bold text-xs md:text-base">
                        Saving ${DENTIST_BONUS_PRODUCTS.filter(b => selectedBonuses.includes(b.id)).reduce((sum, b) => sum + b.value, 0)} with your selection
                      </p>
                      <p className="text-white/60 font-medium text-[10px] md:text-sm">
                        <Clock className="w-3 h-3 md:w-3.5 md:h-3.5 inline mr-1" />
                        {formatTime(timeLeft)} remaining
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            // 🎯 PRODUCT EXPLANATION SCREEN - MOBILE FIRST
            <div className="relative">
              <div ref={productExplanationRef} className="relative z-10 px-2 md:px-6 py-2 md:py-6 space-y-2 md:space-y-5 max-h-[85vh] overflow-y-auto">

                {/* REFINED TIMER BANNER - Mobile Compact */}
                <div className="bg-gradient-to-br from-teal-500/20 to-cyan-500/10 backdrop-blur-lg rounded-lg md:rounded-xl p-2 md:p-3 shadow-lg border border-teal-500/30">
                  <div className="flex items-center justify-center gap-2 md:gap-3">
                    <Clock className="w-4 h-4 md:w-5 md:h-5 text-teal-400" />
                    <div className="text-center">
                      <p className="text-white/70 font-semibold text-[10px] md:text-xs uppercase tracking-wide">
                        Limited Time Offer
                      </p>
                      <div className="text-lg md:text-2xl font-black text-teal-400 tabular-nums">
                        {formatTime(timeLeft)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* ELEGANT HEADER - Mobile Compact */}
                <div className="text-center space-y-2 md:space-y-3">
                  <div className="inline-flex items-center gap-1.5 md:gap-2 bg-teal-500/10 backdrop-blur-sm border border-teal-500/30 rounded-full px-3 md:px-5 py-1 md:py-2">
                    <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-teal-400" />
                    <span className="text-teal-400 font-bold text-[10px] md:text-sm uppercase tracking-widest">Your Complete Package</span>
                    <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-teal-400" />
                  </div>
                  <h2 className="text-xl md:text-3xl font-black text-white leading-tight">
                    Everything You're Getting Today
                  </h2>
                  <p className="text-xs md:text-lg font-medium text-cyan-200">
                    Premium course + Your custom bonus bundle
                  </p>
                </div>

                {/* 1️⃣ MAIN PRODUCT - AI VIDEO COURSE - Mobile Optimized */}
                <div className="bg-gradient-to-br from-navy-rich to-black rounded-lg md:rounded-xl p-3 md:p-6 border-2 border-teal-500 shadow-2xl">
                  {/* Product Image */}
                  <div className="relative mb-3 md:mb-4 rounded-lg overflow-hidden shadow-xl">
                    <Image
                      src="/images/People/Demo Image.jpeg"
                      alt="AI Video Mastery Course"
                      width={800}
                      height={450}
                      className="w-full h-auto"
                      priority
                      quality={90}
                    />
                  </div>

                  {/* Product Title */}
                  <h3 className="text-lg md:text-3xl font-black text-teal-400 mb-2 md:mb-3 text-center">
                    AI Video Mastery Course
                  </h3>

                  {/* Refined Price Comparison - Mobile Compact */}
                  <div className="bg-gradient-to-br from-teal-500/10 to-cyan-500/5 backdrop-blur-sm rounded-lg md:rounded-xl p-3 md:p-4 mb-3 md:mb-4 border border-teal-500/30">
                    <div className="flex items-center justify-center gap-4 md:gap-6">
                      <div className="text-center">
                        <p className="text-white/50 text-[10px] md:text-xs font-semibold uppercase mb-0.5 md:mb-1">Regular</p>
                        <p className="text-xl md:text-3xl font-black text-white/30 line-through">$197</p>
                      </div>
                      <div className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full bg-teal-500/10 border border-teal-500/30">
                        <Zap className="w-4 h-4 md:w-5 md:h-5 text-teal-400" />
                      </div>
                      <div className="text-center">
                        <p className="text-teal-400 text-[10px] md:text-xs font-bold uppercase mb-0.5 md:mb-1">Today Only</p>
                        <p className="text-3xl md:text-5xl font-black text-teal-400">$58.22</p>
                      </div>
                    </div>
                    <div className="text-center mt-2 md:mt-3 pt-2 md:pt-3 border-t border-white/10">
                      <p className="text-teal-300 font-bold text-xs md:text-sm">
                        Save $139 (70% discount)
                      </p>
                    </div>
                  </div>

                  {/* What's Included - Mobile Compact */}
                  <div className="space-y-1.5 md:space-y-2">
                    <p className="text-teal-400 font-black text-[10px] md:text-sm uppercase text-center mb-2 md:mb-3">
                      ⚡ What You Get:
                    </p>
                    <div className="space-y-1 md:space-y-2">
                      {[
                        'Turn Your Photo into a Talking AI Video (Step-by-Step)',
                        'All Free AI Tools Included (No Paid Software Required)',
                        'Edit Videos on Your Phone in Minutes (Zero Experience Needed)',
                        'Clone Your Exact Voice (Sound Just Like You)',
                        'Create Custom AI Avatars (Look Like You or Anyone)',
                        'Dental Video Examples (Done-for-You Templates)',
                        'Lifetime Access + Monthly Updates (Forever)'
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-start gap-1.5 md:gap-2 bg-white/5 rounded-lg p-1.5 md:p-2">
                          <span className="text-teal-400 flex-shrink-0 text-xs md:text-base">✓</span>
                          <span className="text-white text-[10px] md:text-sm">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 2️⃣ YOUR CUSTOM BONUS BUNDLE - Mobile Optimized */}
                <div className="bg-gradient-to-br from-teal-500/10 via-cyan-500/5 to-transparent backdrop-blur-lg border-2 border-teal-500/30 rounded-xl md:rounded-2xl p-3 md:p-6 shadow-2xl">
                  {/* Section Header */}
                  <div className="text-center mb-3 md:mb-6">
                    <div className="inline-flex items-center gap-1.5 md:gap-2 bg-teal-500/10 backdrop-blur-sm border border-teal-500/30 rounded-full px-3 md:px-5 py-1 md:py-2 mb-2 md:mb-3">
                      <Gift className="w-4 h-4 md:w-5 md:h-5 text-teal-400" />
                      <span className="text-teal-400 font-bold text-[10px] md:text-sm uppercase tracking-wider">Plus Your Spin Prize</span>
                    </div>
                    <h3 className="text-lg md:text-3xl font-black text-white mb-1 md:mb-2">
                      Your Custom Bonus Bundle
                    </h3>
                    <p className="text-xs md:text-base text-cyan-200">
                      5 Premium Tools + Mystery VIP Box
                    </p>
                  </div>

                  {/* Bundle Visualization - Mobile Optimized Grid */}
                  <div className="relative rounded-lg md:rounded-xl overflow-hidden shadow-2xl mb-3 md:mb-6 bg-gradient-to-br from-teal-900/40 via-navy-rich to-cyan-900/30 border-2 border-teal-500/30 p-1.5 md:p-4">
                    {/* 5 Products + Mystery Box Grid */}
                    <div className="grid grid-cols-3 gap-1.5 md:gap-2 mb-2 md:mb-3">
                      {selectedBonuses.slice(0, 5).map((bonusId, idx) => {
                        const bonus = DENTIST_BONUS_PRODUCTS.find(b => b.id === bonusId)
                        return (
                          <div key={idx} className="relative aspect-square rounded-md md:rounded-lg overflow-hidden border border-teal-500/30 bg-white/5">
                            {bonus?.image ? (
                              <Image src={bonus.image} alt={bonus.title} fill className="object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <ProductIcon product={bonus!} size="w-5 h-5 md:w-8 md:h-8" />
                              </div>
                            )}
                          </div>
                        )
                      })}
                      {/* Mystery Box */}
                      <div className="relative aspect-square rounded-md md:rounded-lg overflow-hidden border-2 border-teal-500">
                        <Image src="/images/products/Mystery Box.jpeg" alt="Mystery VIP Box" fill className="object-cover" />
                      </div>
                    </div>
                    <p className="text-center text-teal-400/80 text-[10px] md:text-xs font-semibold">5 Premium Products + Mystery VIP Box</p>
                  </div>

                  {/* Selected Products Breakdown - Mobile Compact */}
                  <div className="space-y-1.5 md:space-y-3 mb-2 md:mb-4">
                    <p className="text-teal-400 font-bold text-[10px] md:text-sm uppercase text-center mb-1.5 md:mb-3 flex items-center justify-center gap-1.5 md:gap-2">
                      <Sparkles className="w-3 h-3 md:w-4 md:h-4" />
                      What's In Your Bundle:
                    </p>

                    {/* Map through selected bonuses - Mobile Compact */}
                    {selectedBonuses.map((bonusId, index) => {
                      const bonus = DENTIST_BONUS_PRODUCTS.find(b => b.id === bonusId)
                      if (!bonus) return null

                      return (
                        <div key={bonusId} className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-teal-500/20 rounded-lg p-2 md:p-4">
                          <div className="flex items-center gap-2 md:gap-3 mb-1 md:mb-2">
                            {/* Product Image - smaller on mobile */}
                            {bonus.image && (
                              <div className="flex-shrink-0 w-10 h-10 md:w-16 md:h-16 rounded-lg overflow-hidden shadow-lg">
                                <Image
                                  src={bonus.image}
                                  alt={bonus.title}
                                  width={64}
                                  height={64}
                                  className="w-full h-full object-cover"
                                  loading="lazy"
                                  quality={85}
                                />
                              </div>
                            )}
                            {!bonus.image && (
                              <div className="flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-white/10 to-white/5 rounded-lg shadow-md w-10 h-10 md:w-16 md:h-16">
                                <ProductIcon product={bonus} size="w-4 h-4 md:w-7 md:h-7" />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-1">
                                <h4 className="font-bold text-white text-[11px] md:text-sm leading-tight line-clamp-2">{bonus.title}</h4>
                                <span className="text-teal-400 font-bold text-[10px] md:text-sm whitespace-nowrap">${bonus.value}</span>
                              </div>
                            </div>
                          </div>
                          <p className="text-white/60 text-[9px] md:text-xs leading-relaxed line-clamp-2 md:line-clamp-none">{bonus.description}</p>
                        </div>
                      )
                    })}

                    {/* Mystery VIP Box - Mobile Optimized */}
                    <div className="relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 via-teal-500/20 to-teal-500/10 animate-pulse"></div>
                      <div className="relative flex items-start gap-2 md:gap-3 bg-gradient-to-br from-teal-500/30 via-cyan-600/20 to-teal-600/20 backdrop-blur-sm border-2 border-teal-500 shadow-lg shadow-teal-500/20 rounded-lg p-2.5 md:p-5">
                        <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 flex-shrink-0 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-full shadow-lg">
                          <Gift className="w-5 h-5 md:w-7 md:h-7 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-1 mb-1 md:mb-2">
                            <div>
                              <h4 className="font-black text-teal-400 text-xs md:text-lg flex items-center gap-1 md:gap-2">
                                <Sparkles className="w-3 h-3 md:w-5 md:h-5" />
                                Mystery VIP Box
                                <Sparkles className="w-3 h-3 md:w-5 md:h-5" />
                              </h4>
                              <p className="text-[9px] md:text-xs text-cyan-300 font-bold">PREMIUM SURPRISE UNLOCK</p>
                            </div>
                            <span className="text-teal-400 font-black text-sm md:text-xl whitespace-nowrap">$???</span>
                          </div>
                          <p className="text-white font-semibold text-[10px] md:text-base mb-0.5 md:mb-1 flex items-center gap-1">
                            <Lock className="w-3 h-3 md:w-4 md:h-4 inline-block" />
                            Ultra-Premium Bonus (Worth $500-$1,500+)
                          </p>
                          <p className="text-white/70 text-[9px] md:text-xs line-clamp-2 md:line-clamp-none">
                            Could be: Private coaching call, advanced templates, exclusive software access, or other high-value resources!
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bundle Value Summary - Mobile Optimized with Teal Branding */}
                  <div className="text-center pt-3 md:pt-6 border-t border-white/10">
                    {/* 🎁 SUPER PROMINENT "FREE" CALLOUT */}
                    <div className="mb-2 md:mb-4">
                      <div className="inline-flex items-center gap-2 md:gap-3 bg-gradient-to-r from-teal-500/20 via-cyan-400/30 to-teal-500/20 border-2 border-teal-400 rounded-full px-4 md:px-8 py-2 md:py-3 shadow-lg shadow-teal-500/30 animate-pulse">
                        <Gift className="w-4 h-4 md:w-6 md:h-6 text-teal-400" />
                        <span className="text-2xl md:text-5xl font-black text-teal-400">
                          100% FREE
                        </span>
                        <Gift className="w-4 h-4 md:w-6 md:h-6 text-teal-400" />
                      </div>
                    </div>

                    {/* Value Display - Clear it's BONUS VALUE, not price */}
                    <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 md:p-4 border border-teal-500/20">
                      <p className="text-white/60 text-[10px] md:text-xs font-semibold uppercase tracking-wide mb-1.5 md:mb-2">
                        <Sparkles className="w-3 h-3 md:w-4 md:h-4 inline-block mr-1" />
                        Bonus Value You're Getting
                      </p>
                      <div className="flex items-center justify-center gap-2 md:gap-3">
                        {/* Crossed Out Value - Dynamically calculated */}
                        <div className="relative">
                          <p className="text-xl md:text-4xl font-black text-red-500/60 line-through decoration-red-500 decoration-2 md:decoration-4">
                            ${selectedBonuses.reduce((total, bonusId) => {
                              const bonus = DENTIST_BONUS_PRODUCTS.find(b => b.id === bonusId)
                              return total + (bonus?.value || 0)
                            }, 0).toLocaleString()}+
                          </p>
                          <div className="absolute -top-1 md:-top-2 -right-6 md:-right-8 bg-red-500 text-white text-[8px] md:text-[10px] font-black px-1.5 md:px-2 py-0.5 rounded rotate-12">
                            WAIVED
                          </div>
                        </div>

                        {/* Arrow */}
                        <svg className="w-4 h-4 md:w-6 md:h-6 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>

                        {/* FREE in huge teal */}
                        <p className="text-3xl md:text-5xl font-black text-teal-400">
                          $0
                        </p>
                      </div>

                      <div className="mt-2 md:mt-3 pt-2 md:pt-3 border-t border-white/10">
                        <p className="text-teal-300 font-bold text-[10px] md:text-sm">
                          ✨ Added FREE to your $58.22 purchase
                        </p>
                        <p className="text-white/50 text-[9px] md:text-xs mt-0.5 md:mt-1">
                          (5 Premium Tools + Mystery VIP Box included at no extra cost)
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* REFINED TOTAL VALUE */}
                <div className="bg-gradient-to-br from-teal-500/10 to-cyan-600/10 border border-teal-400/30 rounded-xl p-3 md:p-5 backdrop-blur-sm">
                  <div className="text-center space-y-1.5 md:space-y-2">
                    <p className="text-white/60 text-[10px] md:text-xs font-semibold uppercase tracking-wide">Complete Package Value</p>
                    <p className="text-2xl md:text-4xl font-black text-white/30 line-through">$1,623</p>
                    <div className="w-12 md:w-16 h-px bg-white/20 mx-auto my-1.5 md:my-2" />
                    <p className="text-teal-400/80 text-[10px] md:text-xs font-bold uppercase">Your Price Today</p>
                    <p className="text-4xl md:text-6xl font-black text-teal-400">$58.22</p>
                    <p className="text-teal-300 font-bold text-sm md:text-base">
                      96% savings ($1,564 off)
                    </p>
                  </div>
                </div>

                {/* SOCIAL PROOF + SCARCITY (Refined) */}
                <div className="space-y-2 md:space-y-3">
                  {/* Combined Live Activity + Scarcity */}
                  <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-2.5 md:p-4">
                    <div className="flex flex-col gap-2 md:gap-3">
                      {/* Live viewers */}
                      <div className="flex items-center justify-center gap-2 text-[10px] md:text-sm">
                        <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-teal-400 animate-pulse"></div>
                        <span className="text-white/80">{Math.floor(Math.random() * 8) + 12} people viewing • {Math.floor(Math.random() * 5) + 3} spots left at $58.22</span>
                      </div>

                      {/* Timer */}
                      <div className="text-center pt-1.5 md:pt-2 border-t border-white/10">
                        <p className="text-white/60 text-[10px] md:text-xs">
                          <Clock className="w-2.5 h-2.5 md:w-3 md:h-3 inline mr-1" />
                          Offer expires in {formatTime(timeLeft)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Recent Purchase - More Subtle */}
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-2.5 md:p-3">
                    <div className="flex items-center gap-2 md:gap-3">
                      <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-teal-500/20 border border-teal-500/30 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 md:w-4 md:h-4 text-teal-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-white/80 text-[10px] md:text-xs">
                          <span className="font-semibold">{['Sarah M.', 'Mike T.', 'Jessica R.', 'David L.', 'Amanda K.'][Math.floor(Math.random() * 5)]}</span> from {['CA', 'TX', 'FL', 'NY', 'AZ'][Math.floor(Math.random() * 5)]} purchased {Math.floor(Math.random() * 8) + 2}m ago
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 🛡️ MODERN GUARANTEE CARD - Compact with Sara's Image */}
                <div className="bg-gradient-to-br from-teal-500/20 to-cyan-600/10 border-2 border-teal-400/50 rounded-xl md:rounded-2xl p-3 md:p-5 backdrop-blur-sm">
                  {/* Header with Badge */}
                  <div className="text-center mb-3 md:mb-4">
                    <div className="inline-flex items-center gap-1.5 md:gap-2 bg-teal-500/20 border border-teal-400/40 rounded-full px-3 md:px-4 py-1 md:py-1.5 mb-2">
                      <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-teal-400" />
                      <span className="text-teal-400 font-bold text-[10px] md:text-xs uppercase tracking-wider">Triple Guarantee Protection</span>
                    </div>
                    <h3 className="text-lg md:text-2xl font-black text-white flex items-center justify-center gap-1.5 md:gap-2">
                      <Shield className="w-5 h-5 md:w-6 md:h-6 text-teal-400" />
                      You're 100% Protected
                      <Shield className="w-5 h-5 md:w-6 md:h-6 text-teal-400" />
                    </h3>
                    <p className="text-teal-300/80 text-xs md:text-sm mt-1">We remove ALL risk from your decision</p>
                  </div>

                  {/* Compact 3-Column Guarantees */}
                  <div className="grid grid-cols-3 gap-1.5 md:gap-2 mb-3 md:mb-4">
                    <div className="bg-white/5 rounded-lg p-2 md:p-3 text-center border border-white/10">
                      <RefreshCw className="w-5 h-5 md:w-7 md:h-7 text-teal-400 mx-auto mb-1" />
                      <p className="font-bold text-white text-[9px] md:text-xs">30-Day Money Back</p>
                      <p className="text-white/60 text-[8px] md:text-[10px] mt-0.5 hidden md:block">Don't like it? Full refund. No questions.</p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-2 md:p-3 text-center border border-white/10">
                      <Gift className="w-5 h-5 md:w-7 md:h-7 text-teal-400 mx-auto mb-1" />
                      <p className="font-bold text-white text-[9px] md:text-xs">Keep Bonuses</p>
                      <p className="text-white/60 text-[8px] md:text-[10px] mt-0.5 hidden md:block">Even if refund, keep ALL bonuses</p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-2 md:p-3 text-center border border-white/10">
                      <Zap className="w-5 h-5 md:w-7 md:h-7 text-teal-400 mx-auto mb-1" />
                      <p className="font-bold text-white text-[9px] md:text-xs">Instant Access</p>
                      <p className="text-white/60 text-[8px] md:text-[10px] mt-0.5 hidden md:block">Start in 60 seconds. Lifetime updates.</p>
                    </div>
                  </div>

                  {/* Sara's Promise - Modern Card with Image */}
                  <div className="bg-gradient-to-r from-teal-500/10 to-cyan-500/5 border border-teal-500/30 rounded-lg md:rounded-xl p-2.5 md:p-4">
                    <div className="flex items-center gap-2 md:gap-3">
                      {/* Sara's Image */}
                      <div className="relative w-10 h-10 md:w-16 md:h-16 rounded-full overflow-hidden border-2 border-teal-500 flex-shrink-0">
                        <Image src="/images/Sara 61kb.webp" alt="Sara" fill className="object-cover object-top" />
                      </div>
                      <div className="flex-1">
                        <p className="text-white text-[10px] md:text-sm leading-relaxed">
                          <span className="font-black text-teal-500">My promise:</span> If this doesn't help you create AI videos in 7 min,
                          <span className="font-bold"> full refund within 24h</span> - keep everything.
                          <span className="text-teal-300 font-bold"> You can't lose.</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Trust Badges - Single Line */}
                  <div className="flex items-center justify-center flex-wrap gap-x-2 md:gap-x-3 gap-y-1 mt-2 md:mt-3 pt-2 md:pt-3 border-t border-white/10 text-white/50 text-[9px] md:text-[10px]">
                    <span className="flex items-center gap-1"><Check className="w-2.5 h-2.5 md:w-3 md:h-3 text-teal-400" /> Secure</span>
                    <span className="flex items-center gap-1"><Check className="w-2.5 h-2.5 md:w-3 md:h-3 text-teal-400" /> Instant</span>
                    <span className="flex items-center gap-1"><Check className="w-2.5 h-2.5 md:w-3 md:h-3 text-teal-400" /> No fees</span>
                    <span className="flex items-center gap-1"><Check className="w-2.5 h-2.5 md:w-3 md:h-3 text-teal-400" /> Support</span>
                  </div>
                </div>

                {/* ⭐ COMPACT TESTIMONIAL */}
                <div className="bg-white/5 backdrop-blur-sm border border-teal-500/20 rounded-lg md:rounded-xl p-2.5 md:p-3">
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center text-sm md:text-lg">
                      👨‍💼
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-0.5 md:gap-1 mb-0.5">
                        {[1,2,3,4,5].map(i => (
                          <Star key={i} className="w-2.5 h-2.5 md:w-3 md:h-3 fill-teal-500 text-teal-500" />
                        ))}
                      </div>
                      <p className="text-white/90 text-[10px] md:text-xs italic line-clamp-2 md:line-clamp-none">
                        "Made my first video in 7 minutes. Got 3 new patient calls within 24 hours. This is insane."
                      </p>
                      <p className="text-teal-500 text-[9px] md:text-[10px] font-bold">- Dr. Sarah M., Dentist, Austin TX</p>
                    </div>
                  </div>
                </div>

                {/* MEGA CTA BUTTON - OPTIMIZED FOR FAST CHECKOUT */}
                <button
                  onClick={() => {
                    // Fire unified InitiateCheckout (Pixel + CAPI)
                    trackInitiateCheckout('CloneYourself Dentist - Main Course', 58.22)

                    // Open embedded checkout modal (keeps user on-site!)
                    setShowCheckoutModal(true)
                  }}
                  disabled={false}
                  className="group w-full bg-gradient-to-r from-teal-500 via-cyan-500 to-teal-500 text-white px-4 md:px-8 py-5 md:py-7 rounded-xl font-black text-lg md:text-2xl transition-all duration-300 shadow-2xl shadow-teal-500/40 relative overflow-hidden border-2 border-teal-400/30 hover:scale-[1.03] active:scale-[0.98] cursor-pointer"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                  <span className="relative flex flex-col items-center justify-center gap-1.5 md:gap-2">
                    <span className="flex items-center gap-2 md:gap-3">
                      <Zap className="w-5 h-5 md:w-7 md:h-7" />
                      <span>YES! Give Me Instant Access</span>
                      <Zap className="w-5 h-5 md:w-7 md:h-7" />
                    </span>
                    <span className="text-xs md:text-sm font-bold text-teal-200">
                      Only $58.22 Today • Save $1,100+ (94% Off)
                    </span>
                  </span>
                </button>

                {/* URGENCY + COUNTDOWN */}
                <div className="text-center space-y-1.5 md:space-y-2">
                  <div className="inline-flex items-center gap-1.5 md:gap-2 bg-teal-500/20 border border-teal-400/50 rounded-full px-3 md:px-4 py-1.5 md:py-2">
                    <Clock className="w-3 h-3 md:w-4 md:h-4 text-teal-400" />
                    <span className="text-white font-bold text-xs md:text-sm">
                      Offer expires in {formatTime(timeLeft)}
                    </span>
                  </div>
                  <p className="text-white/60 text-[10px] md:text-xs">
                    ⏰ Price jumps to $197 when timer hits zero
                  </p>
                </div>

                {/* WHAT HAPPENS NEXT (REMOVES FRICTION) */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-3 md:p-4">
                  <p className="text-center text-white/80 font-semibold text-xs md:text-sm mb-2 md:mb-3">
                    What happens after you click?
                  </p>
                  <div className="space-y-1.5 md:space-y-2 text-[10px] md:text-xs text-white/70">
                    <div className="flex items-center gap-2">
                      <span className="text-teal-400">1.</span>
                      <span>Secure checkout (Apple Pay, Card, PayPal)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-teal-400">2.</span>
                      <span>Instant access link sent to email (60 sec)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-teal-400">3.</span>
                      <span>Create your first AI video in under 7 min</span>
                    </div>
                  </div>
                </div>

                {/* ENHANCED TRUST BADGES */}
                <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 text-white/60 text-[10px] md:text-xs">
                  <span className="flex items-center gap-1 md:gap-1.5">
                    <div className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-teal-500/20 flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 md:w-3 md:h-3 text-teal-400" />
                    </div>
                    <span>SSL</span>
                  </span>
                  <span className="flex items-center gap-1 md:gap-1.5">
                    <div className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-teal-500/20 flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 md:w-3 md:h-3 text-teal-400" />
                    </div>
                    <span>Instant</span>
                  </span>
                  <span className="flex items-center gap-1 md:gap-1.5">
                    <div className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-teal-500/20 flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 md:w-3 md:h-3 text-teal-400" />
                    </div>
                    <span>30-Day</span>
                  </span>
                  <span className="flex items-center gap-1 md:gap-1.5">
                    <div className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-teal-500/20 flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 md:w-3 md:h-3 text-teal-400" />
                    </div>
                    <span>Support</span>
                  </span>
                </div>

              </div>
            </div>
          )}
        </div>
      </div>

      {/* EMBEDDED CHECKOUT MODAL - Keeps users on-site! */}
      <WhopCheckoutModal
        planId={DENTIST_PLAN_IDS.main}
        isOpen={showCheckoutModal}
        onClose={() => setShowCheckoutModal(false)}
        onComplete={async () => {
          // Track bonus selections to analytics - ONLY AFTER SUCCESSFUL PAYMENT!
          try {
            await fetch('/api/track-purchase', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                selectedBonuses: selectedBonuses.map(id => ({ id, title: id })),
                spinGift: selectedGift,
                timestamp: new Date().toISOString(),
                sessionId: typeof window !== 'undefined' ? localStorage.getItem('visitorFingerprint') : null,
                productType: 'main',
              }),
            })
            console.log('✅ Purchase tracked with bonus selections!')
          } catch (error) {
            console.log('⚠️ Purchase tracking failed (non-critical):', error)
          }

          // Redirect to thank you page after successful purchase
          window.location.href = '/dentists/thank-you?purchased=main'
        }}
      />
    </div>
  )
}
