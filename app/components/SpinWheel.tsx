'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Image from 'next/image'
import {
  Gift, X, Crown, Check, Sparkles, Zap, Clock, Star,
  ClipboardList, Calendar, Smartphone, Video, MessageSquare,
  Bot, Briefcase, PenTool, Presentation, Mail, Smile,
  Shield, Lock, RefreshCw, Loader
} from 'lucide-react'
import confetti from 'canvas-confetti'
import { markUserAsSpun } from '../utils/fingerprint'
import { WHOP } from '../config/constants'
import { BONUS_PRODUCTS, BonusProduct } from '../config/bonus-products'
import WhopCheckoutModal from './WhopCheckoutModal'

// Icon mapping for dynamic rendering
const iconMap: Record<string, any> = {
  ClipboardList,
  Calendar,
  Smartphone,
  Video,
  Sparkles,
  Presentation,
  MessageSquare,
  Bot,
  Briefcase,
  PenTool,
  Mail,
  Smile,
}

// Helper component to render dynamic icon
const ProductIcon = ({ product, size }: { product: BonusProduct; size?: string }) => {
  const IconComponent = iconMap[product.icon] || Gift
  const sizeClass = size || 'w-8 h-8'
  return <IconComponent className={sizeClass} style={{ color: product.iconColor }} />
}

// 3-TIER PREMIUM GIFTS SYSTEM - PSYCHOLOGICAL MANIPULATION OPTIMIZED
// EVERYONE WINS PLATINUM (3% shown, 100% actual) - Maximum Dopamine!
// TIER COLORS: PLATINUM (Red #FF0040) | GOLD (Yellow #FDB813) | SILVER (Silver #C0C0C0)

// PAID ADD-ONS REMOVED - Simplified to $37 base price only
// Focus on backend upsells (OTO + Downsell) for higher conversion
const GIFTS = [
  // 🏆 PLATINUM TIER (3% displayed, 100% actual) - EVERYONE GETS THIS!
  {
    id: 'ultimate-custom-builder',
    name: '🎯 BUILD YOUR DREAM BUNDLE + 🎁 MYSTERY VIP BOX',
    shortName: 'Ultimate Custom Bundle',
    description: 'Choose ANY 5 bonuses you want + Exclusive Mystery Box (Worth $500+)',
    value: '$1,847',
    color: '#FF0040', // RED for PLATINUM - Ultra Rare!
    tier: 'PLATINUM',
    tierColor: 'from-red-electric via-gold-premium to-white',
    probability: 1.0, // EVERYONE GETS THIS (100%)
    percentage: 'Everyone wins!', // Honest messaging
    message: '🎉 Congratulations! You\'ve Unlocked Premium Bonuses!',
    subMessage: 'Here\'s everything you\'re getting today',
    emoji: '💎',
    image: '/images/VIP Access Pass_result.webp',
    winnerCount: Math.floor(Math.random() * 30) + 18, // Show 18-47 "winners today"
    isUltraRare: true,
    customizable: true, // They can build their own pack!
  },

  // 🥇 GOLD TIER (32% shown) - BEST 3 Products (But they never actually get these)
  {
    id: 'video-sales-mastery',
    name: '🎬 Video Sales Script Mastery',
    shortName: 'Sales Scripts',
    description: 'Proven scripts that close 7-figure deals',
    value: '$497',
    color: '#FDB813', // Yellow for GOLD
    tier: 'GOLD',
    tierColor: 'from-gold-premium to-yellow-400',
    probability: 0.00, // Never actually wins
    percentage: '12%',
    message: '🎬 AMAZING! Elite sales scripts unlocked!',
    subMessage: 'Scripts used by top 1% agents!',
    emoji: '🎬',
    image: '/images/Video Templates_result.webp',
  },
  {
    id: 'luxury-listing-presentation',
    name: '💼 Luxury Listing Presentation',
    shortName: 'Luxury Template',
    description: 'Million-dollar listing pitch template',
    value: '$597',
    color: '#FDB813', // Yellow for GOLD
    tier: 'GOLD',
    tierColor: 'from-gold-premium to-yellow-400',
    probability: 0.00, // Never actually wins
    percentage: '10%',
    message: '💼 INCREDIBLE! Luxury template is yours!',
    subMessage: 'Win million-dollar listings with confidence!',
    emoji: '💼',
    image: '/images/Choose Your Own_result.webp',
  },
  {
    id: 'ai-voice-clone',
    name: '🤖 AI Voice Clone Add-On',
    shortName: 'Voice Clone',
    description: 'Clone your voice for unlimited videos',
    value: '$397',
    color: '#FDB813', // Yellow for GOLD
    tier: 'GOLD',
    tierColor: 'from-gold-premium to-yellow-400',
    probability: 0.00, // Never actually wins
    percentage: '10%',
    message: '🤖 YES! Voice cloning unlocked!',
    subMessage: 'Never record your voice again!',
    emoji: '🤖',
    image: '/images/AI Prompts_result.webp',
  },

  // 🥈 SILVER TIER (60% shown) - 5 Normal Products (But they never actually get these)
  {
    id: 'social-media-templates',
    name: '📱 Social Media Templates Pack',
    shortName: 'SM Templates',
    description: '100+ Instagram/TikTok/Facebook templates',
    value: '$197',
    color: '#C0C0C0', // Silver for SILVER
    tier: 'SILVER',
    tierColor: 'from-gray-400 to-gray-300',
    probability: 0.00, // Never actually wins
    percentage: '12%',
    message: '📱 NICE! Social templates secured!',
    subMessage: '100+ ready-to-use templates!',
    emoji: '📱',
    image: '/images/SM Hooks_result.webp',
  },
  {
    id: 'listing-script-bundle',
    name: '📝 Property Listing Script Bundle',
    shortName: 'Listing Scripts',
    description: '50+ proven listing description templates',
    value: '$147',
    color: '#C0C0C0', // Silver for SILVER
    tier: 'SILVER',
    tierColor: 'from-gray-400 to-gray-300',
    probability: 0.00, // Never actually wins
    percentage: '12%',
    message: '📝 GREAT! Listing scripts unlocked!',
    subMessage: 'Write compelling listings in minutes!',
    emoji: '📝',
    image: '/images/Canva Design Pack_result.webp',
  },
  {
    id: 'email-followup-sequences',
    name: '✉️ Email Follow-Up Sequences',
    shortName: 'Email Sequences',
    description: '30+ automated email campaigns',
    value: '$127',
    color: '#C0C0C0', // Silver for SILVER
    tier: 'SILVER',
    tierColor: 'from-gray-400 to-gray-300',
    probability: 0.00, // Never actually wins
    percentage: '12%',
    message: '✉️ AWESOME! Email sequences ready!',
    subMessage: 'Never lose a lead again!',
    emoji: '✉️',
    image: '/images/Brand Blueprint_result.webp',
  },
  {
    id: 'open-house-marketing',
    name: '🏡 Open House Marketing Kit',
    shortName: 'Open House Kit',
    description: 'Complete open house promotion system',
    value: '$167',
    color: '#C0C0C0', // Silver for SILVER
    tier: 'SILVER',
    tierColor: 'from-gray-400 to-gray-300',
    probability: 0.00, // Never actually wins
    percentage: '12%',
    message: '🏡 CONGRATS! Open house kit unlocked!',
    subMessage: 'Fill your open houses with buyers!',
    emoji: '🏡',
    image: '/images/Canva Design Pack_result.webp',
  },
  {
    id: 'buyer-seller-guides',
    name: '📚 Buyer/Seller Guides Collection',
    shortName: 'Guides Pack',
    description: 'Professional PDF guides for clients',
    value: '$97',
    color: '#C0C0C0', // Silver for SILVER
    tier: 'SILVER',
    tierColor: 'from-gray-400 to-gray-300',
    probability: 0.00, // Never actually wins
    percentage: '12%',
    message: '📚 NICE! Guide collection secured!',
    subMessage: 'Become the trusted expert!',
    emoji: '📚',
    image: '/images/Brand Blueprint_result.webp',
  },
]

// TIER DISTRIBUTION (DISPLAYED): PLATINUM 3% | GOLD 32% | SILVER 60% = 95%
// ACTUAL DISTRIBUTION: PLATINUM 100% (Everyone wins the "impossible"!)

// AUTO-SELECTED BONUSES - Best 3 from BONUS_PRODUCTS
// Automatically included with purchase - no choice paralysis!
const AUTO_SELECTED_BONUSES = [
  BONUS_PRODUCTS[0], // $10M Personal Brand Masterclass
  BONUS_PRODUCTS[2], // 327 Instagram Story Templates
  BONUS_PRODUCTS[6], // 89 Instagram DM Scripts
]

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
  // Removed: showProductExplanation, showBundleBuilder, selectedBonuses (simplified to 2-step flow)
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
  // Removed: bundleBuilderRef, productExplanationRef (no longer needed with 2-step flow)
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

  // Check if user has already spun
  useEffect(() => {
    const spunGift = localStorage.getItem('blackFridayGift')
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

  // Removed: Scroll to top when 5 bonuses selected (no longer needed with auto-selection)

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
    ctx.shadowColor = '#d4af37'
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
    centerGradient.addColorStop(0.5, '#d4af37')
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
        localStorage.setItem('blackFridayGift', selectedGift.id)
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

  // RESET FUNCTION FOR TESTING - Clears all spin state
  const handleReset = useCallback(() => {
    console.log('🔄 Resetting spin wheel for testing...')

    // Clear localStorage
    localStorage.removeItem('blackFridayGift')
    localStorage.removeItem('spinTimestamp')
    localStorage.removeItem('visitorFingerprint')

    // Reset all state variables
    setIsSpinning(false)
    setRotation(0)
    setSelectedGift(null)
    setHasSpun(false)
    setShowResult(false)
    // Removed: setShowProductExplanation, setShowBundleBuilder, setSelectedBonuses (no longer exist)
    setTimeLeft(19 * 60)
    setIsCheckoutLoading(false)
    setShowCheckoutModal(false)

    // Reset the ref guard
    hasSpunRef.current = false

    // Cancel any animations
    if (animationRef.current !== null) {
      cancelAnimationFrame(animationRef.current)
      animationRef.current = null
    }

    console.log('✅ Reset complete - ready to spin again!')
  }, [])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 overflow-y-auto"
      style={{ pointerEvents: 'auto' }}
    >
      <div
        className="bg-gradient-to-br from-navy-deep via-navy-rich to-black rounded-2xl shadow-2xl w-full max-w-full md:max-w-3xl relative border-2 border-gold-premium my-4 md:my-16 mx-2 md:mx-auto"
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
              <div className="inline-block bg-gradient-to-r from-red-electric to-orange-500 text-white px-6 py-2 rounded-full text-sm font-bold mb-3 animate-pulse shadow-lg">
                🎁 WIN UP TO $1,634 IN BONUSES!
              </div>

              {/* PRE-FRAME HEADLINE */}
              <h2 className="text-3xl md:text-5xl font-extrabold text-gold-premium mb-2 leading-tight">
                You've Unlocked a<br />FREE Bonus Gift! 🎉
              </h2>

              {/* SOCIAL PROOF */}
              <p className="text-white/80 text-sm md:text-base mb-1">
                ✅ <span className="text-green-400 font-bold">2,847 students</span> won their bonus today
              </p>

              {/* RISK REVERSAL */}
              <p className="text-gold-light text-xs md:text-sm font-semibold">
                100% Win Guarantee • Everyone Gets a Premium Bonus
              </p>
            </>
          )}

          {isSpinning && !showResult && (
            <p className="text-3xl font-bold text-gold-premium animate-pulse">
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
                <div className="w-full mb-6 bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-4">
                  <p className="text-white/80 text-xs uppercase tracking-wide font-bold mb-3 text-center">Prize Tiers</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-red-electric border-2 border-white" />
                        <span className="text-white font-semibold text-sm">PLATINUM</span>
                      </div>
                      <span className="text-gold-light font-bold text-sm">3% - Ultra Rare</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-yellow-400 border-2 border-white" />
                        <span className="text-white font-semibold text-sm">GOLD</span>
                      </div>
                      <span className="text-gold-light font-bold text-sm">32% - Premium</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-gray-300 border-2 border-white" />
                        <span className="text-white font-semibold text-sm">SILVER</span>
                      </div>
                      <span className="text-gold-light font-bold text-sm">60% - Guaranteed</span>
                    </div>
                  </div>

                  {/* HONEST MESSAGING */}
                  <div className="mt-3 pt-3 border-t border-white/10">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                      <p className="text-emerald-400 font-bold text-xs uppercase tracking-wide">
                        Spin to unlock your bonuses!
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="relative mb-6 flex items-center justify-center">
                {/* Simple Pointer */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-8 z-10">
                  <div className="w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-t-[40px] border-t-red-electric" />
                </div>

                {/* Wheel Canvas */}
                <div className="relative w-full max-w-full md:max-w-[450px] min-h-[300px] md:min-h-[450px]">
                  <canvas
                    ref={canvasRef}
                    width={450}
                    height={450}
                    className="w-full h-auto"
                    style={{ display: 'block', margin: '0 auto', minHeight: '300px' }}
                  />
                </div>
              </div>

              {!isSpinning && !hasSpun && (
                <div className="text-center mt-8 animate-fade-in-up space-y-3">
                  {/* High-Converting CTA Button with Super Attractive Animations */}
                  <div className="relative">
                    {/* Animated Pulsing Rings */}
                    <div className="absolute inset-0 -z-10">
                      <div className="absolute inset-0 rounded-xl bg-gold-premium opacity-50" style={{ animationDuration: '2s' }}></div>
                      <div className="absolute inset-0 rounded-xl bg-gold-premium opacity-30" style={{ animationDuration: '3s', animationDelay: '0.5s' }}></div>
                    </div>

                    {/* Main Button with Multiple Animations */}
                    <button
                      onClick={handleSpin}
                      disabled={isSpinning || hasSpun}
                      className="group w-full bg-gradient-to-r from-gold-premium via-yellow-400 to-gold-premium text-navy-deep px-12 py-6 rounded-xl text-2xl md:text-3xl font-black hover:scale-110 active:scale-95 transition-all shadow-2xl border-4 border-white/50 relative overflow-hidden animate-bounce-subtle disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                      style={{
                        animation: 'bounce-subtle 2s ease-in-out infinite, pulse 2s ease-in-out infinite',
                        boxShadow: '0 0 30px rgba(212, 175, 55, 0.8), 0 0 60px rgba(212, 175, 55, 0.4), 0 10px 40px rgba(0, 0, 0, 0.3)'
                      }}
                    >
                      {/* Shimmer Effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />

                      {/* Glowing Border Animation */}
                      <div className="absolute inset-0 rounded-xl border-2 border-white/80 animate-pulse"></div>

                      {/* Button Text with Bounce */}
                      <span className="relative inline-block group-hover:animate-pulse">
                        🎁 CLAIM MY FREE BONUS →
                      </span>
                    </button>
                  </div>

                  {/* Encouragement */}
                  <p className="text-white/70 text-xs">
                    🎁 <span className="text-emerald-400 font-bold">Everyone wins premium bonuses</span>
                  </p>
                </div>
              )}
            </div>
          ) : (
            // 🏆 STREAMLINED WIN SCREEN - TRUST & CLARITY (2-STEP FLOW)
            <div ref={resultScreenRef} className="relative">
              <div className="relative z-10 px-3 md:px-8 py-4 md:py-8 space-y-4 md:space-y-6 max-h-[85vh] overflow-y-auto">

                {/* Simple Success Header */}
                <div className="text-center space-y-3">
                  <div className="text-6xl">🎉</div>
                  <h2 className="text-3xl md:text-4xl font-black text-white">
                    You've Unlocked Premium Bonuses!
                  </h2>
                  <p className="text-lg text-white/80">
                    Here's everything you're getting today
                  </p>
                </div>

                {/* VALUE STACK - Clear & Organized */}
                <div className="space-y-4">

                  {/* Main Product */}
                  <div className="bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border-2 border-emerald-400 rounded-xl p-5">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-16 h-16 bg-emerald-500 rounded-lg flex items-center justify-center">
                        <Video className="w-8 h-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white mb-1">
                          AI Video Mastery Course
                        </h3>
                        <p className="text-white/70 text-sm mb-2">
                          Turn your photos into professional AI videos in minutes
                        </p>
                        <div className="flex items-center gap-3">
                          <span className="text-white/50 line-through">$97</span>
                          <span className="text-2xl font-black text-emerald-400">$37</span>
                          <span className="text-emerald-400 text-sm font-bold">Save $60</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Auto-Selected Bonuses */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-gold-premium font-bold">
                      <Gift className="w-5 h-5" />
                      <span>+ Your Free Bonus Pack (${AUTO_SELECTED_BONUSES.reduce((sum, b) => sum + b.value, 0)} value)</span>
                    </div>

                    {/* List the 3 auto-selected bonuses with checkmarks */}
                    {AUTO_SELECTED_BONUSES.map(bonus => (
                      <div key={bonus.id} className="bg-white/5 border border-white/20 rounded-lg p-4 flex items-start gap-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                          <Check className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-white font-bold">{bonus.title}</h4>
                          <p className="text-white/60 text-sm">{bonus.description}</p>
                          <span className="text-emerald-400 text-sm font-bold">${bonus.value} value</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Trust Signals */}
                <div className="bg-white/5 border border-white/20 rounded-lg p-4 space-y-2">
                  <div className="flex items-center gap-2 text-white/80">
                    <Shield className="w-5 h-5 text-emerald-400" />
                    <span className="text-sm">30-day money-back guarantee</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/80">
                    <Star className="w-5 h-5 text-emerald-400" />
                    <span className="text-sm">1,247 students joined this week</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/80">
                    <Lock className="w-5 h-5 text-emerald-400" />
                    <span className="text-sm">Instant access • Lifetime updates</span>
                  </div>
                </div>

                {/* ONE CLEAR CTA */}
                <button
                  ref={checkoutButtonRef}
                  onMouseEnter={prefetchCheckout}
                  onClick={() => {
                    // Facebook Pixel - InitiateCheckout event
                    if (typeof window !== 'undefined' && window.fbq) {
                      window.fbq('track', 'InitiateCheckout', {
                        content_name: 'AI Video Mastery Course',
                        content_category: 'Main Product',
                        value: 37.0,
                        currency: 'USD',
                        num_items: AUTO_SELECTED_BONUSES.length + 1,
                      })
                    }

                    // Open embedded checkout modal (keeps user on-site!)
                    setShowCheckoutModal(true)
                  }}
                  className="w-full bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-500 text-white px-8 py-6 rounded-xl font-black text-2xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-2xl shadow-emerald-500/30"
                >
                  <div className="text-center">
                    <div>Get Complete Package - $37</div>
                    <div className="text-sm font-normal mt-1">Course + 3 Premium Bonuses</div>
                  </div>
                </button>

                {/* Honest urgency - with timer */}
                <p className="text-center text-white/60 text-sm">
                  Special price ends in <span className="text-gold-premium font-bold tabular-nums">{formatTime(timeLeft)}</span>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* EMBEDDED CHECKOUT MODAL - Keeps users on-site! */}
      <WhopCheckoutModal
        planId={WHOP.plans.main}
        isOpen={showCheckoutModal}
        onClose={() => setShowCheckoutModal(false)}
        onComplete={async () => {
          // Track bonus selections to analytics - ONLY AFTER SUCCESSFUL PAYMENT!
          try {
            await fetch('/api/track-purchase', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                selectedBonuses: AUTO_SELECTED_BONUSES.map(b => ({ id: b.id, title: b.title })),
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
          window.location.href = '/thank-you-confirmed?purchased=main'
        }}
      />
    </div>
  )
}
