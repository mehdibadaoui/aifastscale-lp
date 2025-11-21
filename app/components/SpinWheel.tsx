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
    percentage: '3%', // But we SHOW 3% to make them feel lucky!
    message: '🚨 STOP... DID YOU JUST WIN THE IMPOSSIBLE?!',
    subMessage: 'Only 3 OUT OF 100 people unlock this! You\'re ONE OF THE LUCKY FEW! 🍀',
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
  // selectedAddons state removed - simplified to $37 base price only
  const [timeLeft, setTimeLeft] = useState(19 * 60) // 19 minutes in seconds
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false) // Loading state for checkout button
  const [totalSpinsToday] = useState(Math.floor(Math.random() * 50) + 130) // 130-180 spins today
  const [totalSaved, setTotalSaved] = useState(0)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const spinAudioRef = useRef<HTMLAudioElement | null>(null)
  const winAudioRef = useRef<HTMLAudioElement | null>(null)
  const tickAudioRef = useRef<HTMLAudioElement | null>(null)
  const animationRef = useRef<number | null>(null) // Prevent multiple animations
  const hasSpunRef = useRef<boolean>(false) // Ultimate guard - never reset!
  const productExplanationRef = useRef<HTMLDivElement>(null) // Ref for product explanation scroll container

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
        }, 800)
      }
    }

    // Start animation (ref check already done at function start)
    animationRef.current = requestAnimationFrame(animate)
  }, [isSpinning, hasSpun, rotation])

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

                  {/* URGENCY/SCARCITY */}
                  <div className="mt-3 pt-3 border-t border-white/10">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-2 h-2 bg-red-electric rounded-full animate-pulse" />
                      <p className="text-red-electric font-bold text-xs uppercase tracking-wide">
                        Only 3 PLATINUM prizes left today!
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

                  {/* Additional Urgency */}
                  <p className="text-white/70 text-xs animate-pulse">
                    ⏰ <span className="text-red-electric font-bold">Limited time only</span> • Spin now before prizes run out
                  </p>
                </div>
              )}
            </div>
          ) : !showBundleBuilder && !showProductExplanation ? (
            // 🏆 PREMIUM WIN SCREEN - MODERN & SOPHISTICATED
            <div className="relative">
              <div className="relative z-10 px-3 md:px-8 py-4 md:py-8 space-y-4 md:space-y-6 max-h-[85vh] overflow-y-auto">

                {/* 🎉 ELEGANT VICTORY HEADER */}
                <div className="text-center space-y-4">
                  {/* Subtle Badge */}
                  <div className="inline-flex items-center gap-2 bg-gradient-to-r from-gold-premium/10 via-gold-premium/5 to-gold-premium/10 backdrop-blur-sm border border-gold-premium/30 rounded-full px-6 py-2">
                    <Crown className="w-4 h-4 text-gold-premium" />
                    <span className="text-gold-premium font-bold text-sm uppercase tracking-widest">Platinum Winner</span>
                    <Crown className="w-4 h-4 text-gold-premium" />
                  </div>

                  {/* Modern Title */}
                  <div className="space-y-2">
                    <h2 className="text-3xl md:text-4xl font-black text-white leading-tight">
                      Congratulations!
                    </h2>
                    <p className="text-lg md:text-xl text-gray-300 font-medium">
                      You've Unlocked the <span className="text-gold-premium font-bold">Elite Bundle</span>
                    </p>
                  </div>

                  {/* Refined Stats */}
                  <div className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl px-6 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-white/80 text-sm">Top</span>
                      <span className="text-emerald-400 font-black text-lg">3%</span>
                    </div>
                    <div className="w-px h-6 bg-white/20" />
                    <div className="text-white/60 text-sm">
                      <span className="text-gold-premium font-bold">#{selectedGift?.winnerCount || 23}</span> of {totalSpinsToday} today
                    </div>
                  </div>
                </div>

                {/* 💎 PREMIUM PRODUCT CARD */}
                <div className="relative">
                  {/* Elegant Image Container */}
                  <div className="relative flex items-center justify-center mb-6">
                    <div className="relative w-40 md:w-56">
                      {/* Subtle Glow Effect */}
                      <div className="absolute inset-0 bg-gold-premium/20 rounded-2xl blur-2xl" />
                      {selectedGift?.image ? (
                        <img
                          src={selectedGift.image}
                          alt={selectedGift.name}
                          className="relative z-10 w-full h-auto rounded-2xl shadow-2xl border border-white/10"
                        />
                      ) : (
                        <div className="relative z-10 text-7xl md:text-9xl text-center">
                          {selectedGift?.emoji}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Refined Prize Card */}
                  <div className="bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/20 rounded-2xl p-6 md:p-8 shadow-2xl">
                    <div className="space-y-5">
                      {/* Title Section */}
                      <div className="text-center space-y-3 pb-5 border-b border-white/10">
                        <div className="flex items-center justify-center gap-2 text-gold-premium/80 text-xs font-semibold uppercase tracking-wider">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>VIP Exclusive</span>
                          <Sparkles className="w-3.5 h-3.5" />
                        </div>

                        {/* BIG CLEAR TITLE */}
                        <div className="space-y-2">
                          <h3 className="text-3xl md:text-4xl font-black leading-tight">
                            <span className="text-emerald-400">🎁 Choose Your 5 FREE</span>
                            <br />
                            <span className="text-white">Bonus Gifts!</span>
                          </h3>

                          <p className="text-lg md:text-xl font-bold text-gold-premium">
                            Pick Any 5 Premium Tools + Mystery VIP Box
                          </p>
                        </div>

                        <p className="text-gray-300 text-sm font-medium">
                          Million-Dollar Agent Arsenal (Worth $3,671)
                        </p>
                      </div>

                      {/* Benefits List */}
                      <div className="space-y-3">
                        <p className="text-gold-premium/80 text-sm font-bold uppercase tracking-wide text-center">
                          What Top 1% Agents Use To:
                        </p>
                        <div className="grid gap-2">
                          {[
                            'Create viral Instagram & TikTok content in minutes',
                            'Close 73% of seller appointments (vs 31% industry avg)',
                            'Get qualified leads from Instagram DMs daily',
                            'Plan your path to $1M+ with proven frameworks',
                            'Build a luxury brand that attracts high-end clients'
                          ].map((benefit, idx) => (
                            <div key={idx} className="flex items-start gap-3 bg-white/5 rounded-lg p-3 border border-white/5">
                              <Check className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                              <span className="text-gray-200 text-sm font-medium leading-snug">{benefit}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Value Display */}
                      <div className="flex items-center justify-center gap-6 pt-5 border-t border-white/10">
                        <div className="text-center">
                          <p className="text-white/50 text-xs font-semibold uppercase tracking-wide mb-1">Valued At</p>
                          <p className="text-3xl md:text-4xl font-black text-white/40 line-through">
                            {selectedGift?.value}
                          </p>
                        </div>
                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gold-premium/10 border border-gold-premium/30">
                          <Zap className="w-6 h-6 text-gold-premium" />
                        </div>
                        <div className="text-center">
                          <p className="text-emerald-400 text-xs font-bold uppercase tracking-wide mb-1">Your Price</p>
                          <p className="text-3xl md:text-4xl font-black text-emerald-400">
                            FREE
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 🎯 REFINED CTA BUTTON */}
                <div className="space-y-4">
                  <button
                    onClick={() => setShowBundleBuilder(true)}
                    className="group relative w-full bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-500 text-white px-8 py-5 md:py-6 rounded-xl font-black text-lg md:text-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-xl shadow-emerald-500/25 border border-emerald-400/20 overflow-hidden"
                  >
                    {/* Shimmer Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />

                    <span className="relative flex items-center justify-center gap-3">
                      <Crown className="w-6 h-6" />
                      <span>Build My Custom Bundle</span>
                      <Crown className="w-6 h-6" />
                    </span>
                  </button>

                  {/* Elegant Timer */}
                  <div className="flex items-center justify-center gap-3 text-white/60 text-sm">
                    <Clock className="w-4 h-4" />
                    <span className="font-medium">
                      Offer expires in <span className="text-gold-premium font-bold tabular-nums">{formatTime(timeLeft)}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : showBundleBuilder && !showProductExplanation ? (
            // 💼 BUNDLE BUILDER - MODERN & REFINED
            <div className="relative">
              <div className="relative z-10 px-2 md:px-4 py-3 md:py-4 space-y-3 md:space-y-4 max-h-[90vh] overflow-y-auto">
                {/* ⏰ REFINED COUNTDOWN - STICKY */}
                <div className="sticky top-0 bg-gradient-to-b from-navy-deep via-navy-deep to-transparent pb-2 z-30">
                  <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-xl p-3 shadow-lg border border-white/20 mb-2">
                    <div className="flex items-center justify-center gap-2">
                      <Clock className="w-4 h-4 text-gold-premium" />
                      <p className="text-white/90 text-xs md:text-sm font-semibold">
                        Offer expires in <span className="text-gold-premium font-black text-base md:text-xl tabular-nums">{formatTime(timeLeft)}</span>
                      </p>
                    </div>
                  </div>

                  {/* Header - ELEGANT */}
                  <div className="text-center space-y-1.5">
                    <div className="inline-flex items-center gap-2 bg-gold-premium/10 backdrop-blur-sm border border-gold-premium/30 rounded-full px-4 py-1.5">
                      <Crown className="w-3.5 h-3.5 text-gold-premium" />
                      <span className="text-gold-premium font-bold text-[10px] uppercase tracking-widest">Platinum Member</span>
                    </div>
                    <h2 className="text-lg md:text-2xl font-black text-white">
                      Build Your Custom Bundle
                    </h2>

                    {/* Savings - REFINED */}
                    {selectedBonuses.length > 0 && (
                      <div className="bg-emerald-500/10 border border-emerald-400/30 rounded-lg p-2 backdrop-blur-sm">
                        <p className="text-emerald-400 text-sm md:text-base font-bold">
                          You're Saving ${BONUS_PRODUCTS.filter(b => selectedBonuses.includes(b.id)).reduce((sum, b) => sum + b.value, 0)}
                        </p>
                      </div>
                    )}

                    <p className="text-white/70 font-medium text-sm md:text-base">
                      <span className="text-gold-premium font-black">{selectedBonuses.length}</span>/5 Tools Selected
                    </p>
                  </div>
                </div>

                {/* FREE Bonuses */}
                <div className="space-y-2">
                  <h3 className="text-base md:text-lg font-black text-white text-center">
                    Choose 5 FREE Bonuses
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {BONUS_PRODUCTS.map((bonus, index) => {
                      const isSelected = selectedBonuses.includes(bonus.id)
                      const isDisabled = selectedBonuses.length >= 5 && !isSelected

                      return (
                        <button
                          key={bonus.id}
                          onClick={() => {
                            if (isSelected) {
                              setSelectedBonuses(selectedBonuses.filter(id => id !== bonus.id))
                            } else if (selectedBonuses.length < 5) {
                              setSelectedBonuses([...selectedBonuses, bonus.id])

                              // DOPAMINE SOUND - Victory beep
                              if (typeof window !== 'undefined') {
                                const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
                                const playTone = (frequency: number) => {
                                  const oscillator = audioContext.createOscillator()
                                  const gainNode = audioContext.createGain()
                                  oscillator.connect(gainNode)
                                  gainNode.connect(audioContext.destination)
                                  oscillator.frequency.value = frequency
                                  oscillator.type = 'sine'
                                  gainNode.gain.setValueAtTime(0.25, audioContext.currentTime)
                                  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15)
                                  oscillator.start(audioContext.currentTime)
                                  oscillator.stop(audioContext.currentTime + 0.15)
                                }
                                // Happy chord
                                playTone(659.25)
                                setTimeout(() => playTone(783.99), 50)
                              }
                            }
                          }}
                          disabled={isDisabled}
                          className={`relative text-left p-5 rounded-xl transition-all duration-200 border-2 min-h-[120px] ${
                            isSelected
                              ? 'bg-gradient-to-br from-emerald-500 to-green-success border-white shadow-2xl scale-[1.02]'
                              : isDisabled
                              ? 'bg-white/5 border-white/10 opacity-30 cursor-not-allowed'
                              : 'bg-gradient-to-br from-white/10 to-white/5 border-gold-premium/30 hover:border-gold-premium hover:bg-white/20 hover:scale-[1.02] hover:shadow-gold-glow'
                          }`}
                        >
                          {/* Checkmark */}
                          {isSelected && (
                            <div className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg animate-scale-in">
                              <Check className="w-5 h-5 text-emerald-500" strokeWidth={4} />
                            </div>
                          )}

                          {/* Most Popular Badge */}
                          {index < 3 && !isSelected && (
                            <div className="absolute top-2 right-2 bg-gold-premium text-navy-deep px-2 py-1 rounded text-[9px] font-black">
                              TOP PICK
                            </div>
                          )}

                          <div className="space-y-3">
                            {/* Product Image - PROMINENT */}
                            {bonus.image && (
                              <div className={`relative w-full h-40 rounded-xl overflow-hidden shadow-lg ${
                                isSelected
                                  ? 'border-2 border-white/30 ring-2 ring-emerald-400'
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

                            {/* Product Details */}
                            <div className="flex items-start gap-3">
                              <div className={`inline-flex p-3 rounded-xl ${
                                isSelected
                                  ? 'bg-white/20 shadow-lg'
                                  : 'bg-white/10 shadow-md'
                              }`}>
                                <ProductIcon product={bonus} size="w-8 h-8" />
                              </div>
                              <div className="flex-1">
                                <h4 className={`font-bold text-base mb-1 ${isSelected ? 'text-white' : 'text-white'}`}>
                                  {bonus.title}
                                </h4>
                                <p className={`text-xs mb-2 ${isSelected ? 'text-white/90' : 'text-white/60'}`}>
                                  {bonus.description}
                                </p>

                                {/* Price Display - DOPAMINE TRIGGER */}
                                <div className="flex items-center gap-2">
                                  {isSelected ? (
                                    <>
                                      <span className="text-white/50 line-through text-sm">${bonus.value}</span>
                                      <span className="text-white font-black text-lg">FREE!</span>
                                      <span className="text-emerald-300 text-xs font-bold animate-pulse">Saved!</span>
                                    </>
                                  ) : (
                                    <>
                                      <span className="text-white/50 line-through text-sm">${bonus.value}</span>
                                      <span className="text-emerald-400 font-black text-base">FREE</span>
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
                </div>


                {/* REFINED BOTTOM CTA */}
                {selectedBonuses.length === 5 && (
                  <div className="sticky bottom-0 bg-gradient-to-t from-navy-deep via-navy-deep to-transparent pt-6 pb-2 z-30">
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
                      className="group w-full bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-500 text-white px-8 py-5 md:py-6 rounded-xl font-black text-xl md:text-2xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-xl shadow-emerald-500/25 relative overflow-hidden border border-emerald-400/30"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                      <span className="relative flex items-center justify-center gap-3">
                        <Check className="w-6 h-6" />
                        <span>Continue to Review</span>
                        <Check className="w-6 h-6" />
                      </span>
                    </button>

                    <div className="text-center mt-3 space-y-1">
                      <p className="text-emerald-400 font-bold text-sm md:text-base">
                        Saving ${BONUS_PRODUCTS.filter(b => selectedBonuses.includes(b.id)).reduce((sum, b) => sum + b.value, 0)} with your selection
                      </p>
                      <p className="text-white/60 font-medium text-xs md:text-sm">
                        <Clock className="w-3.5 h-3.5 inline mr-1" />
                        {formatTime(timeLeft)} remaining
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            // 🎯 PRODUCT EXPLANATION SCREEN - ELEGANT & REFINED
            <div className="relative">
              <div ref={productExplanationRef} className="relative z-10 px-4 md:px-6 py-4 md:py-6 space-y-4 md:space-y-5 max-h-[85vh] overflow-y-auto">

                {/* REFINED TIMER BANNER */}
                <div className="bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-lg rounded-xl p-3 shadow-lg border border-white/20">
                  <div className="flex items-center justify-center gap-3">
                    <Clock className="w-5 h-5 text-gold-premium" />
                    <div className="text-center">
                      <p className="text-white/70 font-semibold text-xs uppercase tracking-wide">
                        Limited Time Offer
                      </p>
                      <div className="text-xl md:text-2xl font-black text-gold-premium tabular-nums">
                        {formatTime(timeLeft)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* ELEGANT HEADER */}
                <div className="text-center space-y-3">
                  <div className="inline-flex items-center gap-2 bg-gold-premium/10 backdrop-blur-sm border border-gold-premium/30 rounded-full px-5 py-2">
                    <Sparkles className="w-4 h-4 text-gold-premium" />
                    <span className="text-gold-premium font-bold text-sm uppercase tracking-widest">Your Complete Package</span>
                    <Sparkles className="w-4 h-4 text-gold-premium" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-black text-white leading-tight">
                    Everything You're Getting Today
                  </h2>
                  <p className="text-base md:text-lg font-medium text-gray-300">
                    Premium course + Your custom bonus bundle
                  </p>
                </div>

                {/* 1️⃣ MAIN PRODUCT - AI VIDEO COURSE (FIRST) */}
                <div className="bg-gradient-to-br from-navy-rich to-black rounded-xl p-5 md:p-6 border-2 border-gold-premium shadow-2xl">
                  {/* Product Image */}
                  <div className="relative mb-4 rounded-lg overflow-hidden shadow-xl">
                    <img
                      src="/images/VD-Course.webp"
                      alt="AI Video Mastery Course"
                      className="w-full h-auto"
                    />
                  </div>

                  {/* Product Title */}
                  <h3 className="text-2xl md:text-3xl font-black text-gold-premium mb-3 text-center">
                    AI Video Mastery Course
                  </h3>

                  {/* Refined Price Comparison */}
                  <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-xl p-4 mb-4 border border-white/10">
                    <div className="flex items-center justify-center gap-6">
                      <div className="text-center">
                        <p className="text-white/50 text-xs font-semibold uppercase mb-1">Regular</p>
                        <p className="text-2xl md:text-3xl font-black text-white/30 line-through">$97</p>
                      </div>
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gold-premium/10 border border-gold-premium/30">
                        <Zap className="w-5 h-5 text-gold-premium" />
                      </div>
                      <div className="text-center">
                        <p className="text-gold-premium text-xs font-bold uppercase mb-1">Today Only</p>
                        <p className="text-4xl md:text-5xl font-black text-emerald-400">$37</p>
                      </div>
                    </div>
                    <div className="text-center mt-3 pt-3 border-t border-white/10">
                      <p className="text-emerald-400 font-bold text-sm">
                        Save $60 (62% discount)
                      </p>
                    </div>
                  </div>

                  {/* What's Included */}
                  <div className="space-y-2">
                    <p className="text-gold-premium font-black text-sm uppercase text-center mb-3">
                      ⚡ What You Get:
                    </p>
                    <div className="space-y-2">
                      {[
                        'Turn Your Photo into a Talking AI Video (Step-by-Step)',
                        'All Free AI Tools Included (No Paid Software Required)',
                        'Edit Videos on Your Phone in Minutes (Zero Experience Needed)',
                        'Clone Your Exact Voice (Sound Just Like You)',
                        'Create Custom AI Avatars (Look Like You or Anyone)',
                        'Real Estate Video Examples (Done-for-You Templates)',
                        'Lifetime Access + Monthly Updates (Forever)'
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-start gap-2 bg-white/5 rounded-lg p-2">
                          <span className="text-emerald-400 flex-shrink-0">✓</span>
                          <span className="text-white text-sm">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 2️⃣ YOUR CUSTOM BONUS BUNDLE (AFTER COURSE) */}
                <div className="bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-lg border-2 border-gold-premium/30 rounded-2xl p-5 md:p-6 shadow-2xl">
                  {/* Section Header */}
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center gap-2 bg-gold-premium/10 backdrop-blur-sm border border-gold-premium/30 rounded-full px-5 py-2 mb-3">
                      <Gift className="w-5 h-5 text-gold-premium" />
                      <span className="text-gold-premium font-bold text-sm uppercase tracking-wider">Plus Your Spin Prize</span>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-black text-white mb-2">
                      Your Custom Bonus Bundle
                    </h3>
                    <p className="text-base text-white/70">
                      5 Premium Tools + Mystery VIP Box
                    </p>
                  </div>

                  {/* Bundle Visualization Image */}
                  <div className="relative rounded-xl overflow-hidden shadow-xl mb-6">
                    <img
                      src="/images/5P + MB_result.webp"
                      alt="5 Premium Products + Mystery Box Bundle"
                      className="w-full h-auto"
                    />
                  </div>

                  {/* Selected Products Breakdown */}
                  <div className="space-y-3 mb-4">
                    <p className="text-gold-premium font-bold text-sm uppercase text-center mb-3 flex items-center justify-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      What's In Your Bundle:
                    </p>

                    {/* Map through selected bonuses */}
                    {selectedBonuses.map((bonusId, index) => {
                      const bonus = BONUS_PRODUCTS.find(b => b.id === bonusId)
                      if (!bonus) return null

                      return (
                        <div key={bonusId} className="flex items-start gap-3 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-3 md:p-4">
                          {/* Product Image */}
                          {bonus.image && (
                            <div className="flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden shadow-lg">
                              <img
                                src={bonus.image}
                                alt={bonus.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          {!bonus.image && (
                            <div className="flex items-center justify-center p-2 flex-shrink-0 bg-gradient-to-br from-white/10 to-white/5 rounded-xl shadow-md w-16 h-16 md:w-20 md:h-20">
                              <ProductIcon product={bonus} size="w-6 h-6 md:w-8 md:h-8" />
                            </div>
                          )}
                          <div className="flex-1">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <h4 className="font-bold text-white text-sm md:text-base">{bonus.title}</h4>
                              <span className="text-emerald-400 font-bold text-xs md:text-sm whitespace-nowrap">${bonus.value}</span>
                            </div>
                            <p className="text-white/70 text-xs md:text-sm">{bonus.description}</p>
                          </div>
                        </div>
                      )
                    })}

                    {/* Mystery VIP Box - PREMIUM */}
                    <div className="relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-gold-premium/10 via-gold-premium/20 to-gold-premium/10 animate-pulse"></div>
                      <div className="relative flex items-start gap-3 bg-gradient-to-br from-gold-premium/30 via-purple-600/20 to-pink-600/20 backdrop-blur-sm border-2 border-gold-premium shadow-lg shadow-gold-premium/20 rounded-lg p-4 md:p-5">
                        <div className="flex items-center justify-center w-12 h-12 flex-shrink-0 bg-gradient-to-br from-gold-premium to-yellow-600 rounded-full shadow-lg">
                          <Gift className="w-7 h-7 text-navy-deep" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div>
                              <h4 className="font-black text-gold-premium text-base md:text-lg flex items-center gap-2">
                                <Sparkles className="w-5 h-5" />
                                Mystery VIP Box
                                <Sparkles className="w-5 h-5" />
                              </h4>
                              <p className="text-xs text-gold-light font-bold">PREMIUM SURPRISE UNLOCK</p>
                            </div>
                            <span className="text-gold-premium font-black text-lg md:text-xl whitespace-nowrap">$???</span>
                          </div>
                          <p className="text-white font-semibold text-sm md:text-base mb-1 flex items-center gap-1">
                            <Lock className="w-4 h-4 inline-block" />
                            Ultra-Premium Bonus (Worth $500-$1,500+)
                          </p>
                          <p className="text-white/70 text-xs">
                            Could be: Private coaching call, advanced templates, exclusive software access, or other high-value resources!
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bundle Value Summary - REDESIGNED TO EMPHASIZE FREE */}
                  <div className="text-center pt-6 border-t border-white/10">
                    {/* 🎁 SUPER PROMINENT "FREE" CALLOUT */}
                    <div className="mb-4">
                      <div className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-500/20 via-emerald-400/30 to-emerald-500/20 border-2 border-emerald-400 rounded-full px-8 py-3 shadow-lg shadow-emerald-500/30 animate-pulse">
                        <Gift className="w-6 h-6 text-emerald-400" />
                        <span className="text-4xl md:text-5xl font-black text-emerald-400">
                          100% FREE
                        </span>
                        <Gift className="w-6 h-6 text-emerald-400" />
                      </div>
                    </div>

                    {/* Value Display - Clear it's BONUS VALUE, not price */}
                    <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                      <p className="text-white/60 text-xs font-semibold uppercase tracking-wide mb-2">
                        <Sparkles className="w-4 h-4 inline-block mr-1" />
                        Bonus Value You're Getting
                      </p>
                      <div className="flex items-center justify-center gap-3">
                        {/* Crossed Out Value - Dynamically calculated */}
                        <div className="relative">
                          <p className="text-3xl md:text-4xl font-black text-red-500/60 line-through decoration-red-500 decoration-4">
                            ${selectedBonuses.reduce((total, bonusId) => {
                              const bonus = BONUS_PRODUCTS.find(b => b.id === bonusId)
                              return total + (bonus?.value || 0)
                            }, 0).toLocaleString()}+
                          </p>
                          <div className="absolute -top-2 -right-8 bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded rotate-12">
                            WAIVED
                          </div>
                        </div>

                        {/* Arrow */}
                        <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>

                        {/* FREE in huge emerald */}
                        <p className="text-4xl md:text-5xl font-black text-emerald-400">
                          $0
                        </p>
                      </div>

                      <div className="mt-3 pt-3 border-t border-white/10">
                        <p className="text-emerald-300 font-bold text-sm">
                          ✨ Added FREE to your $37 purchase
                        </p>
                        <p className="text-white/50 text-xs mt-1">
                          (5 Premium Tools + Mystery VIP Box included at no extra cost)
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* REFINED TOTAL VALUE */}
                <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 border border-emerald-400/30 rounded-xl p-5 backdrop-blur-sm">
                  <div className="text-center space-y-2">
                    <p className="text-white/60 text-xs font-semibold uppercase tracking-wide">Complete Package Value</p>
                    <p className="text-3xl md:text-4xl font-black text-white/30 line-through">$484</p>
                    <div className="w-16 h-px bg-white/20 mx-auto my-2" />
                    <p className="text-emerald-400/80 text-xs font-bold uppercase">Your Price Today</p>
                    <p className="text-5xl md:text-6xl font-black text-emerald-400">$37</p>
                    <p className="text-emerald-300 font-bold text-base">
                      92% savings ($447 off)
                    </p>
                  </div>
                </div>

                {/* SOCIAL PROOF + SCARCITY (Refined) */}
                <div className="space-y-3">
                  {/* Combined Live Activity + Scarcity */}
                  <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4">
                    <div className="flex flex-col gap-3">
                      {/* Live viewers */}
                      <div className="flex items-center justify-center gap-2 text-sm">
                        <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                        <span className="text-white/80">{Math.floor(Math.random() * 8) + 12} people viewing • {Math.floor(Math.random() * 5) + 3} spots left at $37</span>
                      </div>

                      {/* Timer */}
                      <div className="text-center pt-2 border-t border-white/10">
                        <p className="text-white/60 text-xs">
                          <Clock className="w-3 h-3 inline mr-1" />
                          Offer expires in {formatTime(timeLeft)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Recent Purchase - More Subtle */}
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
                        <Check className="w-4 h-4 text-emerald-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-white/80 text-xs">
                          <span className="font-semibold">{['Sarah M.', 'Mike T.', 'Jessica R.', 'David L.', 'Amanda K.'][Math.floor(Math.random() * 5)]}</span> from {['CA', 'TX', 'FL', 'NY', 'AZ'][Math.floor(Math.random() * 5)]} purchased {Math.floor(Math.random() * 8) + 2}m ago
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 🛡️ IRRESISTIBLE GUARANTEE - REMOVES ALL RISK */}
                <div className="bg-gradient-to-br from-emerald-500/30 via-green-600/20 to-emerald-500/30 border-4 border-emerald-400 rounded-2xl p-6 md:p-8 backdrop-blur-sm shadow-2xl shadow-emerald-500/20">
                  {/* Header */}
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-400/50 rounded-full px-5 py-2 mb-3">
                      <Sparkles className="w-5 h-5 text-emerald-400" />
                      <span className="text-emerald-400 font-bold text-sm uppercase tracking-wider">Triple Guarantee Protection</span>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-black text-white mb-3 flex items-center justify-center gap-3">
                      <Shield className="w-8 h-8 text-emerald-400" />
                      You're 100% Protected
                      <Shield className="w-8 h-8 text-emerald-400" />
                    </h3>
                    <p className="text-emerald-300 font-bold text-lg">
                      We remove ALL risk from your decision
                    </p>
                  </div>

                  {/* Guarantees Grid */}
                  <div className="grid md:grid-cols-3 gap-4 mb-6">
                    {/* Guarantee 1 */}
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-emerald-400/30">
                      <div className="text-center">
                        <div className="flex justify-center mb-3">
                          <RefreshCw className="w-12 h-12 text-emerald-400" />
                        </div>
                        <h4 className="font-black text-white text-sm mb-2">30-Day Money Back</h4>
                        <p className="text-white/80 text-xs">
                          Don't like it? Full refund. No questions. No hassle.
                        </p>
                      </div>
                    </div>

                    {/* Guarantee 2 */}
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-emerald-400/30">
                      <div className="text-center">
                        <div className="flex justify-center mb-3">
                          <Gift className="w-12 h-12 text-emerald-400" />
                        </div>
                        <h4 className="font-black text-white text-sm mb-2">Keep The Bonuses</h4>
                        <p className="text-white/80 text-xs">
                          Even if you refund, you keep ALL bonuses (${selectedBonuses.reduce((total, bonusId) => {
                            const bonus = BONUS_PRODUCTS.find(b => b.id === bonusId)
                            return total + (bonus?.value || 0)
                          }, 0).toLocaleString()}+ value)
                        </p>
                      </div>
                    </div>

                    {/* Guarantee 3 */}
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-emerald-400/30">
                      <div className="text-center">
                        <div className="flex justify-center mb-3">
                          <Zap className="w-12 h-12 text-emerald-400" />
                        </div>
                        <h4 className="font-black text-white text-sm mb-2">Instant Access</h4>
                        <p className="text-white/80 text-xs">
                          Start in 60 seconds. Lifetime updates included free.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Main Promise */}
                  <div className="bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-emerald-400/30 rounded-lg p-5">
                    <p className="text-white text-center text-base md:text-lg leading-relaxed">
                      <span className="font-black text-emerald-400">Here's my promise:</span> If this doesn't help you create stunning AI videos in 7 minutes or less,
                      <span className="font-bold"> I'll personally refund every penny within 24 hours</span> - and you still keep everything.
                      <span className="text-emerald-300 font-bold">You literally can't lose.</span>
                    </p>
                  </div>

                  {/* Trust Badge */}
                  <div className="text-center mt-4 pt-4 border-t border-emerald-400/20">
                    <p className="text-white/60 text-xs">
                      ✓ Secure checkout • ✓ Instant delivery • ✓ No recurring fees • ✓ Support included
                    </p>
                  </div>
                </div>

                {/* ⭐ TESTIMONIAL SNIPPET (SOCIAL PROOF) */}
                <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-gold-premium/30 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold-premium to-yellow-600 flex items-center justify-center text-xl">
                        👨‍💼
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-1 mb-2">
                        {[1,2,3,4,5].map(i => (
                          <Star key={i} className="w-4 h-4 fill-gold-premium text-gold-premium" />
                        ))}
                      </div>
                      <p className="text-white/90 text-sm italic mb-2">
                        "Made my first video in 7 minutes. Got 3 leads within 24 hours. This is insane."
                      </p>
                      <p className="text-gold-premium text-xs font-bold">
                        - Marcus J., Real Estate Agent, Miami FL
                      </p>
                    </div>
                  </div>
                </div>

                {/* MEGA CTA BUTTON - OPTIMIZED FOR FAST CHECKOUT */}
                <button
                  onClick={async () => {
                    if (isCheckoutLoading) return // Prevent double-clicks

                    // Facebook Pixel - InitiateCheckout event
                    if (typeof window !== 'undefined' && window.fbq) {
                      window.fbq('track', 'InitiateCheckout', {
                        content_name: 'AI Video Mastery Course',
                        content_category: 'Main Product',
                        value: 37.0,
                        currency: 'USD',
                        num_items: selectedBonuses.length + 1,
                      })
                    }

                    setIsCheckoutLoading(true) // Show loading state immediately
                    try {
                      // Create Whop checkout
                      const response = await fetch('/api/checkout/whop', {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                          planId: WHOP.plans.main,
                          metadata: {
                            type: 'main',
                            selectedBonuses: selectedBonuses,
                            tier: selectedGift?.tier || 'PLATINUM',
                          },
                        }),
                      })

                      const data = await response.json()

                      if (data.success && data.checkoutUrl) {
                        // Redirect to Whop checkout - keep loading state during redirect
                        window.location.href = data.checkoutUrl
                      } else {
                        console.error('Checkout error:', data.error)
                        alert('Something went wrong. Please try again or contact support.')
                        setIsCheckoutLoading(false) // Reset on error
                      }
                    } catch (error) {
                      console.error('Checkout error:', error)
                      alert('Something went wrong. Please try again or contact support.')
                      setIsCheckoutLoading(false) // Reset on error
                    }
                  }}
                  disabled={isCheckoutLoading}
                  className={`group w-full bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-500 text-white px-8 py-7 rounded-xl font-black text-xl md:text-2xl transition-all duration-300 shadow-2xl shadow-emerald-500/40 relative overflow-hidden border-2 border-emerald-400/30 ${
                    isCheckoutLoading
                      ? 'opacity-90 cursor-wait'
                      : 'hover:scale-[1.03] active:scale-[0.98] cursor-pointer'
                  }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                  <span className="relative flex flex-col items-center justify-center gap-2">
                    {isCheckoutLoading ? (
                      <span className="flex items-center gap-3">
                        <Loader className="w-7 h-7 animate-spin" />
                        <span>Redirecting to Secure Checkout...</span>
                        <Loader className="w-7 h-7 animate-spin" />
                      </span>
                    ) : (
                      <>
                        <span className="flex items-center gap-3">
                          <Zap className="w-7 h-7" />
                          <span>YES! Give Me Instant Access</span>
                          <Zap className="w-7 h-7" />
                        </span>
                        <span className="text-sm font-bold text-emerald-200">
                          Only $37 Today • Save $447 (92% Off)
                        </span>
                      </>
                    )}
                  </span>
                </button>

                {/* URGENCY + COUNTDOWN */}
                <div className="text-center space-y-2">
                  <div className="inline-flex items-center gap-2 bg-red-500/20 border border-red-400/50 rounded-full px-4 py-2">
                    <Clock className="w-4 h-4 text-red-400" />
                    <span className="text-white font-bold text-sm">
                      Offer expires in {formatTime(timeLeft)}
                    </span>
                  </div>
                  <p className="text-white/60 text-xs">
                    ⏰ Price jumps to $97 when timer hits zero
                  </p>
                </div>

                {/* WHAT HAPPENS NEXT (REMOVES FRICTION) */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4">
                  <p className="text-center text-white/80 font-semibold text-sm mb-3">
                    What happens after you click?
                  </p>
                  <div className="space-y-2 text-xs text-white/70">
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-400">1.</span>
                      <span>Secure checkout (Apple Pay, Card, PayPal accepted)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-400">2.</span>
                      <span>Instant access link sent to your email (within 60 seconds)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-400">3.</span>
                      <span>Start creating your first AI video in under 7 minutes</span>
                    </div>
                  </div>
                </div>

                {/* ENHANCED TRUST BADGES */}
                <div className="flex flex-wrap items-center justify-center gap-4 text-white/60 text-xs">
                  <span className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
                      <Check className="w-3 h-3 text-emerald-400" />
                    </div>
                    <span>SSL Encrypted</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
                      <Check className="w-3 h-3 text-emerald-400" />
                    </div>
                    <span>Instant Access</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
                      <Check className="w-3 h-3 text-emerald-400" />
                    </div>
                    <span>30-Day Refund</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
                      <Check className="w-3 h-3 text-emerald-400" />
                    </div>
                    <span>24/7 Support</span>
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
