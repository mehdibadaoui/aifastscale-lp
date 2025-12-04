'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import {
  Gift,
  Users,
  Star,
  Clock,
  Check,
  TrendingUp,
  Zap,
  CheckCircle,
  Play,
  Shield,
  ChevronDown,
  ChevronUp,
  X,
  Award,
  Target,
  TrendingDown,
  Sparkles,
  ArrowRight,
  Mail,
  Package,
  AlertCircle,
  Video,
  DollarSign,
  Eye,
  Phone,
  Crown,
  Stethoscope,
  Heart,
  Calendar,
  FileText,
  Smile,
  Layout,
  Instagram,
  Copy,
  Globe,
  Camera,
  MapPin,
} from 'lucide-react'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { DENTIST_BONUS_PRODUCTS, DENTIST_PLAN_IDS, getDentistTotalBonusValue } from '../config/dentist-bonus-products'
import type { DentistBonusProduct } from '../config/dentist-bonus-products'
import CheckoutModal from '../components/CheckoutModal'

// Dynamic import DentistSpinWheel - only loads when user clicks to spin (massive JS savings)
const DentistSpinWheel = dynamic(() => import('../components/DentistSpinWheel'), {
  loading: () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-teal-500 font-bold">Loading Spin Wheel...</p>
      </div>
    </div>
  ),
  ssr: false // No server-side rendering needed for modal
})

// Top 4 pre-selected bonuses for dentists
const TOP_4_BONUSES = ['patient-reactivation-system', 'google-review-machine', 'case-acceptance-playbook', 'dental-social-media-bundle']

// Haptic feedback utility
const triggerHaptic = (type: 'light' | 'medium' | 'heavy' | 'success') => {
  if (typeof window !== 'undefined' && 'vibrate' in navigator) {
    const patterns = {
      light: [10],
      medium: [20],
      heavy: [30],
      success: [10, 50, 10, 50, 30],
    }
    navigator.vibrate(patterns[type])
  }
}

// Confetti explosion component
const ConfettiExplosion = ({ active }: { active: boolean }) => {
  if (!active) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      {[...Array(50)].map((_, i) => (
        <div
          key={i}
          className="absolute animate-confetti"
          style={{
            left: `${Math.random() * 100}%`,
            top: '-10px',
            width: `${8 + Math.random() * 8}px`,
            height: `${8 + Math.random() * 8}px`,
            backgroundColor: ['#10b981', '#f59e0b', '#3b82f6', '#ef4444', '#8b5cf6', '#ec4899'][Math.floor(Math.random() * 6)],
            borderRadius: Math.random() > 0.5 ? '50%' : '0',
            animationDelay: `${Math.random() * 0.5}s`,
            animationDuration: `${2 + Math.random() * 2}s`,
          }}
        />
      ))}
    </div>
  )
}

// Icon mapping for dynamic icons
const iconMap: { [key: string]: React.ComponentType<{ className?: string }> } = {
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
  Video,
  Globe,
  Camera,
}

export default function DentistLanding() {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 })
  const [spotsLeft] = useState(11) // Limited spots
  const [liveViewers] = useState(19) // Simulated live viewers
  const [selectedMode, setSelectedMode] = useState<'expert' | 'custom' | null>('custom')
  const [selectedBonuses, setSelectedBonuses] = useState<string[]>(TOP_4_BONUSES)
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showCheckoutModal, setShowCheckoutModal] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [showAllReviews, setShowAllReviews] = useState(false)
  const [copiedText, setCopiedText] = useState<string | null>(null)
  const [showWhatIs, setShowWhatIs] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [justSelected, setJustSelected] = useState<string | null>(null)
  const [animatedValue, setAnimatedValue] = useState(0)
  const [socialProof, setSocialProof] = useState<{ name: string; location: string; time: string } | null>(null)
  const [showDrMarcusVideo, setShowDrMarcusVideo] = useState(false)
  const [showSpinWheel, setShowSpinWheel] = useState(false)
  const [selectedGift, setSelectedGift] = useState<any>(null)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const bonusGridRef = useRef<HTMLDivElement>(null)
  const checkoutButtonRef = useRef<HTMLDivElement>(null)

  // Track client-side mount
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Show/hide scroll-to-top button based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 600)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Countdown timer to midnight
  useEffect(() => {
    const calculateTimeToMidnight = () => {
      const now = new Date()
      const midnight = new Date(now)
      midnight.setHours(24, 0, 0, 0)
      const diff = midnight.getTime() - now.getTime()
      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)
      return { hours, minutes, seconds }
    }
    setTimeLeft(calculateTimeToMidnight())
    const timer = setInterval(() => setTimeLeft(calculateTimeToMidnight()), 1000)
    return () => clearInterval(timer)
  }, [])

  // Social proof notifications
  useEffect(() => {
    const buyers = [
      { name: 'Dr. Sarah M.', location: 'Houston, TX' },
      { name: 'Dr. James K.', location: 'Los Angeles, CA' },
      { name: 'Dr. Emily R.', location: 'Chicago, IL' },
      { name: 'Dr. Michael T.', location: 'Miami, FL' },
      { name: 'Dr. Jennifer L.', location: 'New York, NY' },
      { name: 'Dr. David W.', location: 'Seattle, WA' },
      { name: 'Dr. Lisa P.', location: 'Phoenix, AZ' },
      { name: 'Dr. Robert H.', location: 'Denver, CO' },
      { name: 'Dr. Amanda C.', location: 'Atlanta, GA' },
      { name: 'Dr. Kevin S.', location: 'Boston, MA' },
    ]
    const times = ['just now', '2 min ago', '5 min ago', '8 min ago', '12 min ago']

    const initialDelay = setTimeout(() => {
      const buyer = buyers[Math.floor(Math.random() * buyers.length)]
      const time = times[Math.floor(Math.random() * times.length)]
      setSocialProof({ ...buyer, time })
      setTimeout(() => setSocialProof(null), 4000)
    }, 15000)

    const interval = setInterval(() => {
      const buyer = buyers[Math.floor(Math.random() * buyers.length)]
      const time = times[Math.floor(Math.random() * times.length)]
      setSocialProof({ ...buyer, time })
      setTimeout(() => setSocialProof(null), 4000)
    }, 90000 + Math.random() * 60000)

    return () => {
      clearTimeout(initialDelay)
      clearInterval(interval)
    }
  }, [])

  // Check for saved gift on mount & handle reset parameter
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get('reset') === 'true') {
      localStorage.removeItem('dentistSpinGift')
      setSelectedGift(null)
      window.history.replaceState({}, '', window.location.pathname)
      return
    }

    const savedGift = localStorage.getItem('dentistSpinGift')
    if (savedGift) {
      setSelectedGift({ id: savedGift })
    }
  }, [])

  // Handle spin complete
  const handleSpinComplete = (gift: any) => {
    setSelectedGift(gift)
    setShowSpinWheel(false)
    triggerHaptic('success')
  }

  // Handle spin button click with haptic
  const handleSpinClick = () => {
    triggerHaptic('medium')
    setShowSpinWheel(true)
  }

  // Handle mode selection
  const handleModeSelect = (mode: 'expert' | 'custom') => {
    setSelectedMode(mode)
    if (mode === 'expert') {
      setSelectedBonuses(TOP_4_BONUSES)
    } else {
      setSelectedBonuses([])
    }
    setTimeout(() => {
      bonusGridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 300)
  }

  // Calculate total value of selected bonuses
  const calculateSelectedValue = () => {
    return selectedBonuses.reduce((total, id) => {
      const product = DENTIST_BONUS_PRODUCTS.find(p => p.id === id)
      return total + (product?.value || 0)
    }, 0)
  }

  // Animate value when bonuses change
  useEffect(() => {
    const targetValue = calculateSelectedValue()
    const startValue = animatedValue
    const duration = 500
    const startTime = Date.now()

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const easeOut = 1 - Math.pow(1 - progress, 3)
      setAnimatedValue(Math.round(startValue + (targetValue - startValue) * easeOut))

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }
    requestAnimationFrame(animate)
  }, [selectedBonuses])

  // Handle bonus selection
  const handleBonusToggle = (bonusId: string) => {
    triggerHaptic('medium')

    if (selectedBonuses.includes(bonusId)) {
      setSelectedBonuses(selectedBonuses.filter(id => id !== bonusId))
    } else if (selectedBonuses.length < 5) {
      setSelectedBonuses([...selectedBonuses, bonusId])
      setJustSelected(bonusId)
      setTimeout(() => setJustSelected(null), 600)

      if (selectedBonuses.length === 4) {
        triggerHaptic('success')
        setShowConfetti(true)
        setTimeout(() => setShowConfetti(false), 3000)
      }
    }
  }

  // Scroll to bonuses
  const scrollToBonuses = () => {
    bonusGridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  // Modal handlers for Order Summary
  const openModal = () => {
    if (selectedBonuses.length === 5) {
      setIsModalOpen(true)
      document.body.style.overflow = 'hidden'
    } else {
      alert('Please select exactly 5 bonuses first!')
    }
  }

  const closeModal = () => {
    setIsModalOpen(false)
    document.body.style.overflow = ''
  }

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isModalOpen])

  // FAQs for dentists
  const faqs = [
    {
      q: 'Does this really take only 7 minutes?',
      a: 'Yes. Upload photo (1 min), type script (3 min), AI makes video (2 min), download (1 min). Done. Zero editing. I timed it myself.',
    },
    {
      q: 'Will patients know it\'s AI? Will it look fake?',
      a: 'Most can\'t tell. The lip-sync is incredibly realistic. Your patients care about your message and expertise, not how you made the video. 340+ dentists are already using this successfully.',
    },
    {
      q: 'I\'m not tech-savvy. Can I do this?',
      a: 'If you can text and upload a photo, you can do this. Step-by-step training included. Plus I\'m on email (support@aifastscale.com) if you get stuck.',
    },
    {
      q: 'What if this doesn\'t work for me?',
      a: 'Email support@aifastscale.com. Say "refund" and I\'ll send your money back + $50 for your time. 30 days. Zero questions.',
    },
    {
      q: 'When do I get access?',
      a: 'Immediately after purchase. Check your email for login details. You can create your first patient video in the next 10 minutes.',
    },
    {
      q: 'Do I need expensive video equipment?',
      a: 'No. Just ONE professional headshot photo. The AI does everything else. No camera, no lighting, no editing software. Zero hidden costs.',
    },
    {
      q: 'Is this HIPAA compliant?',
      a: 'The system itself doesn\'t store patient data. You create educational content about procedures, not patient records. Many dentists use it for patient education and marketing.',
    },
    {
      q: 'Can I use this for my dental practice social media?',
      a: 'Absolutely! That\'s the primary use case. Create Invisalign explainers, whitening education, new patient welcomes, procedure breakdowns — all without filming.',
    },
  ]

  return (
    <div className="min-h-screen bg-[#0a0a0a] font-sans text-white">
      {/* Confetti */}
      <ConfettiExplosion active={showConfetti} />

      {/* Social Proof Toast */}
      {socialProof && (
        <div
          className="fixed bottom-20 sm:bottom-6 left-3 sm:left-6 z-[9999]"
          style={{ animation: 'slideUp 0.4s ease-out' }}
        >
          <div className="flex items-center gap-3 bg-white rounded-xl p-3 pr-5 shadow-2xl border border-gray-100 max-w-[320px]">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-teal-400-dark rounded-full flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-gray-900 font-bold text-sm truncate">{socialProof.name}</p>
              <p className="text-gray-500 text-xs">purchased from {socialProof.location}</p>
              <p className="text-teal-400 text-[10px] font-semibold mt-0.5">{socialProof.time}</p>
            </div>
          </div>
        </div>
      )}
      <style jsx>{`
        @keyframes slideUp {
          from { transform: translateY(100px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes confetti {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        .animate-confetti {
          animation: confetti 3s ease-out forwards;
        }
      `}</style>


      {/* HERO SECTION WITH SPIN WHEEL */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0a0a0a] via-[#0f1f1f] to-black text-white py-8 sm:py-12 md:py-20">
        {/* Refined Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(20, 184, 166, 0.3) 1px, transparent 0)',
            backgroundSize: '32px 32px'
          }} />
          <div className="absolute top-0 left-0 w-48 sm:w-64 h-48 sm:h-64 bg-teal-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-48 sm:w-64 h-48 sm:h-64 bg-cyan-400 rounded-full blur-3xl"></div>
        </div>

        <div className="w-full px-3 sm:px-6 relative z-10">
          {/* Hero Text */}
          <div className="max-w-4xl mx-auto text-center mb-6 sm:mb-10 md:mb-14">
            {/* Social Proof Badge - Compact */}
            <div className="mb-4 sm:mb-6 inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-3 py-1.5 sm:px-4 sm:py-2">
              <div className="flex -space-x-1.5">
                <div className="w-4 h-4 sm:w-6 sm:h-6 rounded-full bg-gradient-to-br from-teal-500 to-cyan-400 border border-[#0a0a0a]"></div>
                <div className="w-4 h-4 sm:w-6 sm:h-6 rounded-full bg-gradient-to-br from-cyan-500 to-teal-600 border border-[#0a0a0a]"></div>
                <div className="w-4 h-4 sm:w-6 sm:h-6 rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 border border-[#0a0a0a]"></div>
              </div>
              <span className="text-white/90 text-xs sm:text-sm font-semibold">340+ dentists inside</span>
              <span className="text-white/30 hidden sm:inline">•</span>
              <div className="hidden sm:flex items-center gap-1">
                <Star className="w-3 h-3 text-teal-500 fill-teal-500" />
                <span className="text-white/90 text-sm font-semibold">4.9/5</span>
              </div>
            </div>

            {/* Main Headline - Mobile First */}
            <h1 className="text-[26px] sm:text-4xl md:text-5xl lg:text-6xl font-black mb-4 sm:mb-6 leading-[1.1] tracking-tight px-1">
              <span className="text-white">Turn Your Headshot Into</span>
              <br />
              <span className="bg-gradient-to-r from-teal-500 via-cyan-400 to-teal-500 bg-clip-text text-transparent">
                Talking Patient Videos
              </span>
              <br />
              <span className="text-white">In Just </span>
              <span className="bg-gradient-to-r from-teal-500 via-cyan-400 to-teal-500 bg-clip-text text-transparent">
                7 Minutes
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-sm sm:text-lg md:text-xl text-gray-300 mb-3 sm:mb-4 px-2">
              No camera. No editing. No tech skills.
              <br />
              <span className="text-teal-400 font-semibold">
                340+ dentists are using AI to fill more chairs & boost case acceptance
              </span>
            </p>

            {/* Trust Elements - Compact */}
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-[10px] sm:text-xs text-white/60 mb-4 sm:mb-6">
              <div className="flex items-center gap-1">
                <Shield className="w-3 h-3 text-teal-500" />
                <span>30-day + $50 back</span>
              </div>
              <div className="flex items-center gap-1">
                <Zap className="w-3 h-3 text-teal-500" />
                <span>Instant access</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-teal-500" />
                <span>7 minutes</span>
              </div>
            </div>
          </div>

          {/* Spin Wheel CTA */}
          <div className="max-w-3xl mx-auto">
            {selectedGift ? (
              /* Already Spun - Show Bonus Secured */
              <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl border-2 sm:border-4 border-teal-400 shadow-2xl">
                <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-3xl sm:text-4xl md:text-5xl">🦷</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-black text-lg sm:text-xl md:text-2xl mb-1 sm:mb-2 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6" />
                      BONUS SECURED!
                    </p>
                    <p className="text-white/90 text-xs sm:text-sm md:text-base truncate">
                      Ultimate Custom Bundle ($1,623 value)
                    </p>
                  </div>
                </div>
                <p className="text-white/80 text-xs sm:text-sm md:text-base text-center">
                  Complete your purchase below to claim this exclusive bonus ↓
                </p>
                {/* Reset Button for Testing */}
                <button
                  onClick={() => {
                    localStorage.removeItem('dentistSpinGift')
                    setSelectedGift(null)
                  }}
                  className="mt-3 sm:mt-4 mx-auto block text-white/50 hover:text-white text-[10px] sm:text-xs underline"
                >
                  🔄 Reset Spin (Testing)
                </button>
              </div>
            ) : (
              /* Not Spun Yet - Show Spin Wheel CTA */
              <div className="bg-gradient-to-br from-[#0a0a0a] via-[#0f1f1f] to-black border-2 sm:border-4 border-teal-500 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8">
                {/* FREE Badge */}
                <div className="flex justify-center mb-3 sm:mb-4">
                  <div className="bg-teal-500/10 backdrop-blur-sm border border-teal-500/30 text-teal-500 px-3 sm:px-5 py-1.5 sm:py-2 rounded-full font-bold text-[10px] sm:text-xs uppercase tracking-wide shadow-lg flex items-center gap-1.5 sm:gap-2">
                    <Gift className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    FREE 1 SPIN • LIMITED TIME
                  </div>
                </div>

                {/* Headline */}
                <h2 className="text-xl sm:text-2xl md:text-4xl font-black text-center mb-2 sm:mb-3 leading-tight">
                  <span className="bg-gradient-to-r from-teal-500 via-cyan-400 to-teal-500 bg-clip-text text-transparent">
                    You Have 1 FREE Spin<br className="hidden sm:block" /> Waiting For You!
                  </span>
                </h2>

                {/* Value Proposition */}
                <p className="text-white/90 text-center text-xs sm:text-sm md:text-base mb-4 sm:mb-6">
                  Win <span className="text-teal-500 font-bold">exclusive bonuses worth up to $1,623</span> instantly!
                  <br />
                  <span className="text-white/70 text-[10px] sm:text-xs flex items-center justify-center gap-1 sm:gap-1.5 mt-1">
                    <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    100% Win Rate • Everyone Gets Premium Bonuses
                  </span>
                </p>

                {/* VISUAL SPIN WHEEL PREVIEW - Compact for Mobile */}
                <div className="relative w-36 h-36 sm:w-48 sm:h-48 md:w-56 md:h-56 mx-auto mb-4 sm:mb-6">
                  {/* Refined Glow Rings */}
                  <div className="absolute inset-0 rounded-full border-2 border-teal-500/30"></div>
                  <div className="absolute inset-[-4px] sm:inset-[-6px] rounded-full border-2 border-teal-500/20"></div>
                  <div className="absolute inset-[-8px] sm:inset-[-12px] rounded-full border-2 border-teal-500/10"></div>

                  {/* Pointer Arrow */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-3 sm:-translate-y-4 z-20">
                    <div className="relative">
                      <div className="w-0 h-0 border-l-[12px] sm:border-l-[18px] border-l-transparent border-r-[12px] sm:border-r-[18px] border-r-transparent border-t-[24px] sm:border-t-[36px] border-t-teal-500 drop-shadow-2xl"></div>
                    </div>
                  </div>

                  {/* Spinning Wheel */}
                  <div className="absolute inset-0 animate-spin-slow">
                    <svg viewBox="0 0 200 200" className="w-full h-full" style={{ filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.3))' }}>
                      <defs>
                        <radialGradient id="tealGrad" cx="50%" cy="50%">
                          <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.9"/>
                          <stop offset="60%" stopColor="#0d9488" />
                          <stop offset="100%" stopColor="#0f766e" />
                        </radialGradient>
                        <radialGradient id="cyanGrad" cx="50%" cy="50%">
                          <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.9"/>
                          <stop offset="60%" stopColor="#0891b2" />
                          <stop offset="100%" stopColor="#0e7490" />
                        </radialGradient>
                        <radialGradient id="grayGrad" cx="50%" cy="50%">
                          <stop offset="0%" stopColor="#E8E8E8" stopOpacity="0.9"/>
                          <stop offset="60%" stopColor="#C0C0C0" />
                          <stop offset="100%" stopColor="#A0A0A0" />
                        </radialGradient>
                        <radialGradient id="centerTealGrad" cx="50%" cy="40%">
                          <stop offset="0%" stopColor="#14b8a6" />
                          <stop offset="50%" stopColor="#0d9488" />
                          <stop offset="100%" stopColor="#0f766e" />
                        </radialGradient>
                      </defs>

                      {/* Outer Ring */}
                      <circle cx="100" cy="100" r="98" fill="none" stroke="url(#centerTealGrad)" strokeWidth="5"/>

                      {/* Wheel Segments */}
                      <path d="M 100 100 L 100 2 A 98 98 0 0 1 169.7 30.3 Z" fill="url(#tealGrad)" stroke="#ffffff" strokeWidth="2.5"/>
                      <path d="M 100 100 L 169.7 30.3 A 98 98 0 0 1 198 100 Z" fill="url(#cyanGrad)" stroke="#ffffff" strokeWidth="2.5"/>
                      <path d="M 100 100 L 30.3 169.7 A 98 98 0 0 1 2 100 Z" fill="url(#cyanGrad)" stroke="#ffffff" strokeWidth="2.5"/>
                      <path d="M 100 100 L 169.7 169.7 A 98 98 0 0 1 100 198 Z" fill="url(#cyanGrad)" stroke="#ffffff" strokeWidth="2.5"/>
                      <path d="M 100 100 L 30.3 30.3 A 98 98 0 0 1 2 100 Z" fill="url(#grayGrad)" stroke="#ffffff" strokeWidth="2.5"/>
                      <path d="M 100 100 L 198 100 A 98 98 0 0 1 169.7 169.7 Z" fill="url(#grayGrad)" stroke="#ffffff" strokeWidth="2.5"/>
                      <path d="M 100 100 L 100 198 A 98 98 0 0 1 30.3 169.7 Z" fill="url(#grayGrad)" stroke="#ffffff" strokeWidth="2.5"/>
                      <path d="M 100 100 L 2 100 A 98 98 0 0 1 30.3 30.3 Z" fill="url(#grayGrad)" stroke="#ffffff" strokeWidth="2.5"/>
                      <path d="M 100 100 L 100 2 A 98 98 0 0 0 30.3 30.3 Z" fill="url(#grayGrad)" stroke="#ffffff" strokeWidth="2.5"/>

                      {/* Center Button */}
                      <circle cx="100" cy="100" r="28" fill="url(#centerTealGrad)" stroke="#ffffff" strokeWidth="4"/>
                      <text x="100" y="107" textAnchor="middle" fill="#ffffff" fontSize="18" fontWeight="900">SPIN</text>
                    </svg>
                  </div>

                  {/* Glow Effects */}
                  <div className="absolute inset-0 bg-teal-500 rounded-full blur-2xl opacity-15"></div>
                </div>

                {/* CTA Button */}
                <button
                  onClick={handleSpinClick}
                  className="group relative w-full bg-gradient-to-r from-teal-500 via-cyan-400 to-teal-500 text-white px-6 sm:px-8 py-3.5 sm:py-4 md:py-5 rounded-xl sm:rounded-2xl font-black text-base sm:text-xl md:text-2xl hover:scale-105 active:scale-95 transition-all shadow-2xl border-2 sm:border-4 border-white/50 overflow-hidden mb-3 sm:mb-4"
                >
                  <span className="relative flex items-center justify-center gap-2">
                    <Gift className="w-5 h-5 sm:w-6 sm:h-6" />
                    🎁 SPIN NOW - WIN $1,623 IN BONUSES
                    <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
                  </span>
                </button>

                {/* Social Proof */}
                <p className="text-center text-white/60 text-[10px] sm:text-xs">
                  🔥 <span className="text-teal-400 font-semibold">47 dentists</span> spun in the last hour • Your bonus is waiting!
                </p>
              </div>
            )}
          </div>

          {/* What is CloneYourself? - Collapsible */}
          <div className="mt-6 sm:mt-8 max-w-xl mx-auto text-center">
            <button
              onClick={() => setShowWhatIs(!showWhatIs)}
              className="group flex items-center justify-center gap-2 mx-auto text-[11px] sm:text-sm"
            >
              <span className="text-teal-400 font-medium border-b border-dashed border-teal-500/40 group-hover:border-teal-500 transition-colors animate-pulse">
                What is CloneYourself for Dentists?
              </span>
              <ChevronDown className={`w-3.5 h-3.5 sm:w-4 sm:h-4 text-teal-400 transition-transform duration-300 ${showWhatIs ? 'rotate-180' : ''}`} />
            </button>

            <div className={`overflow-hidden transition-all duration-500 ease-out ${showWhatIs ? 'max-h-[600px] opacity-100 mt-4' : 'max-h-0 opacity-0 mt-0'}`}>
              <div className="bg-gradient-to-br from-teal-400/10 to-white/5 backdrop-blur-sm border border-teal-500/20 rounded-xl p-4 sm:p-5">
                <p className="text-white text-xs sm:text-sm leading-relaxed mb-3">
                  You upload <span className="text-teal-400 font-bold">one professional headshot</span> to a free AI software — the #1 tool for generating realistic talking videos in {new Date().getFullYear()}.
                </p>
                <p className="text-white/80 text-xs sm:text-sm leading-relaxed mb-3">
                  The AI transforms your photo into a <span className="text-teal-400 font-bold">talking video of YOU</span> — your face moves, your lips sync perfectly, it looks 100% real. No filming. No editing. No experience needed.
                </p>
                <p className="text-white/80 text-xs sm:text-sm leading-relaxed">
                  Inside CloneYourself, you get the <span className="text-white font-bold">complete A-to-Z training</span> that shows you exactly how to do this — even if you've never touched AI before. Create patient education videos, social media content, and more.
                </p>
              </div>
            </div>
          </div>

          {/* Course Demo Image - Visual Showcase */}
          <div className="mt-6 sm:mt-10 max-w-4xl mx-auto">
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl shadow-teal-500/20 border-2 border-teal-500/30">
              <Image
                src="/images/dentist/course-demo.webp"
                alt="CloneYourself for Dentists - Course Platform"
                width={1365}
                height={768}
                className="w-full h-auto"
                priority
              />
              {/* Overlay badge */}
              <div className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-teal-500/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-black flex items-center gap-1.5 shadow-lg">
                <Play className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                INSIDE THE COURSE
              </div>
              {/* Bottom CTA overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="text-center sm:text-left">
                    <p className="text-white font-black text-sm sm:text-lg">Get Instant Access Today</p>
                    <p className="text-white/70 text-xs sm:text-sm">Step-by-step training + 5 FREE bonuses</p>
                  </div>
                  <button
                    onClick={handleSpinClick}
                    className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-5 py-2.5 rounded-lg font-black text-sm hover:scale-105 active:scale-95 transition-transform shadow-lg flex items-center gap-2"
                  >
                    <Gift className="w-4 h-4" />
                    Spin To Win - $58
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS - Redesigned Visual Section */}
      <section className="py-8 sm:py-12 md:py-16 bg-gradient-to-b from-[#0a0a0a] via-[#0f1f1f] to-[#0a0a0a]">
        <div className="w-full px-3 sm:px-6">
          <div className="max-w-5xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-8 sm:mb-14">
              <div className="inline-flex items-center gap-2 bg-teal-500/10 border border-teal-500/30 px-4 py-2 rounded-full mb-4">
                <Zap className="w-4 h-4 text-teal-400" />
                <span className="text-teal-400 text-sm font-bold">Dead Simple Process</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mb-3 sm:mb-4 px-2">
                <span className="text-white">So Simple It's</span>{' '}
                <span className="bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">Embarrassing</span>
              </h2>
              <p className="text-sm sm:text-lg text-white/60 px-2">3 steps. 7 minutes. Unlimited patient videos ready to post.</p>
            </div>

            {/* Steps Grid - Visual Cards */}
            <div className="grid md:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
              {[
                {
                  num: "01",
                  title: "Upload Photo",
                  desc: "Drop in your professional headshot. That's literally it.",
                  time: "1 min",
                  icon: Camera,
                  gradient: "from-teal-500/20 to-cyan-500/10",
                  borderColor: "border-teal-500/40"
                },
                {
                  num: "02",
                  title: "Add Your Script",
                  desc: "Type your message or use our 100+ ready-made templates.",
                  time: "2 min",
                  icon: FileText,
                  gradient: "from-cyan-500/20 to-teal-500/10",
                  borderColor: "border-cyan-500/40"
                },
                {
                  num: "03",
                  title: "Watch AI Work",
                  desc: "AI creates a talking video of YOU. Download. Post. Get patients.",
                  time: "4 min",
                  icon: Sparkles,
                  gradient: "from-teal-400/20 to-emerald-500/10",
                  borderColor: "border-teal-400/40"
                }
              ].map((step, i) => (
                <div
                  key={i}
                  className={`relative bg-gradient-to-br ${step.gradient} rounded-2xl sm:rounded-3xl p-5 sm:p-7 border-2 ${step.borderColor} group hover:scale-[1.02] transition-transform`}
                >
                  {/* Step Number */}
                  <div className="absolute top-4 right-4 sm:top-5 sm:right-5 text-5xl sm:text-7xl font-black text-white/5 group-hover:text-white/10 transition-colors">
                    {step.num}
                  </div>

                  {/* Icon */}
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg shadow-teal-500/30 mb-4 sm:mb-5">
                    <step.icon className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl sm:text-2xl font-black text-white mb-2">{step.title}</h3>
                  <p className="text-white/70 text-sm sm:text-base mb-4 leading-relaxed">{step.desc}</p>

                  {/* Time Badge */}
                  <div className="inline-flex items-center gap-2 bg-teal-500/20 border border-teal-500/40 px-3 py-1.5 rounded-full">
                    <Clock className="w-4 h-4 text-teal-400" />
                    <span className="text-teal-400 font-bold text-sm">{step.time}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Connecting Line + Total Time - Desktop */}
            <div className="hidden md:flex items-center justify-center gap-6 mb-8">
              <div className="h-1 w-20 bg-gradient-to-r from-transparent via-teal-500/50 to-transparent rounded-full"></div>
              <div className="bg-gradient-to-br from-teal-500 to-cyan-500 rounded-2xl px-8 py-5 shadow-2xl shadow-teal-500/30">
                <div className="text-center">
                  <div className="text-white/70 text-sm font-bold uppercase tracking-wider mb-1">Total Time</div>
                  <div className="text-4xl font-black text-white flex items-center gap-2">
                    <Clock className="w-8 h-8" />
                    7 Minutes
                  </div>
                </div>
              </div>
              <div className="h-1 w-20 bg-gradient-to-r from-transparent via-teal-500/50 to-transparent rounded-full"></div>
            </div>

            {/* Mobile Total Time */}
            <div className="md:hidden text-center mb-6">
              <div className="inline-flex items-center gap-3 bg-gradient-to-r from-teal-500 to-cyan-500 px-6 py-3 rounded-xl shadow-lg">
                <Clock className="w-6 h-6 text-white" />
                <span className="text-white font-black text-xl">Total: 7 Minutes</span>
              </div>
            </div>

            {/* CTA Card */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border-2 border-teal-500/30 rounded-2xl sm:rounded-3xl p-5 sm:p-8 text-center">
              <p className="text-white text-lg sm:text-2xl font-black mb-2 sm:mb-3">
                While Other Dentists Spend <span className="text-teal-400">Hours</span> Filming...
              </p>
              <p className="text-white/60 text-sm sm:text-lg mb-5 max-w-xl mx-auto">
                You'll have 50+ professional patient videos ready to post. No camera. No editing. No stress.
              </p>
              <button
                onClick={handleSpinClick}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-8 py-4 rounded-xl text-base sm:text-lg font-black shadow-xl shadow-teal-500/30 hover:scale-105 active:scale-95 transition-transform"
              >
                <Gift className="w-5 h-5" />
                <span>Spin To Win + Get Access</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <div className="flex items-center justify-center gap-4 mt-4 text-white/50 text-xs sm:text-sm">
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-4 h-4 text-teal-400" />
                  <span>30-day guarantee</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4 text-teal-400" />
                  <span>{spotsLeft} spots left</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DR. MARCUS'S GUARANTEE - White Section */}
      <section className="py-5 sm:py-10 md:py-14 bg-white">
        <div className="w-full px-2 sm:px-6">
          <div className="max-w-5xl mx-auto">
            {/* Main Guarantee Card */}
            <div className="relative bg-gradient-to-br from-teal-400/5 via-white to-teal-400/10 rounded-xl sm:rounded-2xl shadow-xl border border-teal-500/50 overflow-hidden">
              {/* Verified Badge */}
              <div className="hidden sm:block absolute top-4 right-4">
                <div className="bg-teal-500 text-white px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
                  <Shield className="w-3 h-3" />
                  <span className="text-[10px] font-black tracking-wider">VERIFIED - 100% REAL</span>
                </div>
              </div>

              <div className="p-3 sm:p-6 md:p-8">
                <div className="flex flex-col md:flex-row gap-3 sm:gap-5 items-start">
                  {/* Dr. Marcus's Image */}
                  <div className="relative flex-shrink-0 flex items-center gap-3 sm:block">
                    <div className="relative w-16 h-16 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-teal-500 shadow-xl">
                      <Image src="/images/dentist/dr-marcus.webp" alt="Dr. Marcus Chen" fill className="object-cover" />
                    </div>
                    {/* Mobile: Show name inline */}
                    <div className="sm:hidden">
                      <p className="font-black text-gray-900 text-sm">Dr. Marcus Chen</p>
                      <p className="text-[10px] text-gray-600">Cosmetic Dentist • Austin, TX</p>
                    </div>
                    {/* Desktop badge */}
                    <div className="hidden sm:block absolute -bottom-2 -right-2 bg-gradient-to-r from-teal-400 to-teal-400-light text-white px-2.5 py-1 rounded-full text-[9px] font-black shadow-lg">
                      15+ YEARS
                    </div>
                  </div>

                  {/* Guarantee Content */}
                  <div className="flex-1">
                    <div className="hidden sm:block mb-2 sm:mb-4">
                      <h2 className="text-lg sm:text-2xl font-black text-gray-900">Dr. Marcus Chen</h2>
                      <p className="text-xs sm:text-sm text-gray-600 font-medium">Cosmetic Dentist • Practice Owner • AI Video Pioneer</p>
                    </div>

                    {/* Quote Box */}
                    <div className="bg-teal-500/10 border-l-4 border-teal-500 rounded-r-lg p-2.5 sm:p-4 mb-3 sm:mb-5">
                      <p className="text-gray-800 text-[11px] sm:text-base italic leading-relaxed">
                        "I created this system because I was tired of watching competitors dominate social media while I hid from the camera. Now I create 30+ patient videos per month without filming a single one. My case acceptance went from 42% to 78%. If it doesn't work for you, I'll refund every penny AND pay you $50 for your time."
                      </p>
                    </div>

                    {/* Guarantee Breakdown */}
                    <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-3 sm:mb-5">
                      <div className="bg-white rounded-lg p-2 sm:p-3 text-center border border-teal-500/20 shadow-sm">
                        <div className="text-lg sm:text-2xl font-black text-teal-400">30</div>
                        <div className="text-[9px] sm:text-xs text-gray-600 font-medium">Day Refund</div>
                      </div>
                      <div className="bg-white rounded-lg p-2 sm:p-3 text-center border border-teal-500/20 shadow-sm">
                        <div className="text-lg sm:text-2xl font-black text-teal-400">$50</div>
                        <div className="text-[9px] sm:text-xs text-gray-600 font-medium">If It Fails</div>
                      </div>
                      <div className="bg-white rounded-lg p-2 sm:p-3 text-center border border-teal-500/20 shadow-sm">
                        <div className="text-lg sm:text-2xl font-black text-teal-400">0</div>
                        <div className="text-[9px] sm:text-xs text-gray-600 font-medium">Questions Asked</div>
                      </div>
                    </div>

                    {/* Why This Works */}
                    <div className="bg-white/60 rounded-lg p-2.5 sm:p-4 mb-3 sm:mb-4">
                      <p className="text-gray-700 text-[10px] sm:text-sm leading-relaxed">
                        <span className="font-bold text-gray-900">Why this guarantee?</span> Because I know this works. 340+ dentists have used this exact system. If you follow the training and it doesn't help your practice, something went wrong on my end — and I'll make it right.
                      </p>
                    </div>

                    {/* Bottom CTA */}
                    <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                      <button
                        onClick={scrollToBonuses}
                        className="flex-1 sm:flex-none bg-gradient-to-r from-teal-400 to-teal-400-light text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg font-bold text-xs sm:text-sm hover:bg-teal-500-light transition-all shadow-lg"
                      >
                        I'm Ready to Start →
                      </button>
                      <p className="text-[10px] sm:text-xs text-gray-500 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3 text-green-500 inline" /> {spotsLeft} spots left at $58
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-6 sm:py-10 md:py-14 bg-gray-50">
        <div className="w-full px-3 sm:px-4 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-6 sm:mb-10">
              <p className="text-teal-600 text-xs sm:text-sm font-semibold mb-2 uppercase tracking-wide">From Our Community</p>
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-gray-900 mb-2 px-2">
                What Dentists Are Saying
              </h2>
              <p className="text-sm sm:text-base text-gray-500 px-2 max-w-2xl mx-auto">
                Honest feedback from dentists who tried the system
              </p>
            </div>

            {/* Testimonials Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {[
                {
                  name: "Dr. Sarah M.",
                  location: "Phoenix, AZ",
                  role: "General Dentist • 12 years",
                  image: "/images/dentist/review-1.webp",
                  quote: "I was paying a marketing company $1,800/month and honestly wasn't seeing much return. This cost me less than one month of that, and I've already made 3 videos my front desk plays for new patients. Nothing fancy, but it works.",
                  verified: true
                },
                {
                  name: "Dr. Kevin P.",
                  location: "Austin, TX",
                  role: "Cosmetic Dentist • 8 years",
                  image: "/images/dentist/review-2.webp",
                  quote: "Look, I'm not tech-savvy at all. My 14-year-old had to help me set up my Instagram. But this was surprisingly simple. Made my first video in about 20 minutes. Patients actually comment on it now.",
                  verified: true
                },
                {
                  name: "Dr. Amanda T.",
                  location: "Miami, FL",
                  role: "Pediatric Dentist • 6 years",
                  image: "/images/dentist/review-3.webp",
                  quote: "The review request templates are what sold me. I went from maybe 2-3 new Google reviews per month to about 8-10. Parents seem more comfortable leaving reviews when you make it easy for them.",
                  verified: true
                },
                {
                  name: "Dr. James L.",
                  location: "Seattle, WA",
                  role: "Orthodontist • 15 years",
                  image: "/images/dentist/review-4.webp",
                  quote: "I'll be honest - I was skeptical. Another 'marketing solution' promising the world. But for $58, I figured why not. The Invisalign templates alone have helped me explain treatment better. Patients seem to get it faster now.",
                  verified: true
                },
                {
                  name: "Dr. Lisa R.",
                  location: "Denver, CO",
                  role: "Periodontist • 10 years",
                  image: "/images/dentist/review-5.webp",
                  quote: "My case acceptance on implants improved. Not overnight, but over a few months I noticed patients coming in more prepared. They'd already watched my explanation video. Makes consultations smoother.",
                  verified: true
                },
                {
                  name: "Dr. Michael C.",
                  location: "Chicago, IL",
                  role: "General Dentist • 4 years",
                  image: "/images/dentist/review-6.webp",
                  quote: "As a newer practice owner, I couldn't afford the marketing agencies everyone recommended. This gave me something to work with. Is it perfect? No. But it's 10x better than what I was doing before, which was nothing.",
                  verified: true
                },
                {
                  name: "Dr. Jennifer W.",
                  location: "Boston, MA",
                  role: "General Dentist • 9 years",
                  image: "/images/dentist/review-7.webp",
                  quote: "The patient reactivation emails are gold. Sent them to patients who hadn't been in for 18+ months. Got 12 appointments booked that week. Some of those patients I thought we'd lost forever.",
                  verified: true
                },
                {
                  name: "Dr. David K.",
                  location: "San Diego, CA",
                  role: "Endodontist • 11 years",
                  image: "/images/dentist/review-8.webp",
                  quote: "I mainly use it for the referral system templates. Started sending them to GPs in my area. Getting a few more referrals each month now. Nothing crazy, but steady growth.",
                  verified: true
                },
                {
                  name: "Dr. Emily H.",
                  location: "Las Vegas, NV",
                  role: "Cosmetic Dentist • 7 years",
                  image: "/images/dentist/review-9.webp",
                  quote: "The before/after post templates helped me finally start posting consistently. I was always too busy to think about social media. Now I batch create a month's worth in one afternoon.",
                  verified: true
                }
              ].map((testimonial, i) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  {/* Clean Image - No overlays */}
                  <div className="relative h-48 sm:h-56">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {/* Content */}
                  <div className="p-4 sm:p-5">
                    {/* Rating */}
                    <div className="flex gap-0.5 mb-3">
                      {[...Array(5)].map((_, j) => (
                        <Star key={j} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>
                    {/* Quote */}
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">"{testimonial.quote}"</p>
                    {/* Author */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-900 font-semibold text-sm">{testimonial.name}</p>
                        <p className="text-gray-400 text-xs">{testimonial.role}</p>
                        <p className="text-gray-400 text-xs">{testimonial.location}</p>
                      </div>
                      {testimonial.verified && (
                        <div className="flex items-center gap-1 text-green-600 text-xs">
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Verified</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Simple Trust Indicator */}
            <div className="mt-8 sm:mt-12 text-center">
              <p className="text-gray-400 text-sm mb-4">Join 340+ dentists already using the system</p>
              <button
                onClick={handleSpinClick}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-sm sm:text-base font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <Gift className="w-5 h-5" />
                <span>Get Started - $58</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF CTA */}
      <section className="py-4 sm:py-6 md:py-10 bg-white">
        <div className="w-full px-3">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-green-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs font-black mb-4 sm:mb-5 animate-pulse">
              <Users className="w-4 h-4" />
              <span>{liveViewers} watching this page right now</span>
            </div>

            <h2 className="text-xl sm:text-2xl md:text-3xl font-league-spartan font-black text-white mb-3">
              340+ Dentists Got New Patients
              <br />
              <span className="text-teal-400">Within 14 Days of Posting</span>
            </h2>

            <p className="text-base sm:text-lg text-gray-700 mb-5 sm:mb-6">
              They didn't have special skills. They weren't tech experts.
              <br className="hidden sm:block" />
              They just uploaded 1 photo and let AI do the rest.
            </p>

            <div className="bg-gradient-to-br from-luxury-black via-gray-900 to-luxury-black border-2 border-teal-500/30 rounded-2xl p-4 sm:p-6 mb-5 sm:mb-6">
              {/* Offer Banner */}
              <div className="mb-4 pb-4 border-b border-teal-500/20">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-400 to-teal-400-light px-5 py-2 rounded-full animate-pulse">
                  <Sparkles className="w-4 h-4 text-white" />
                  <span className="text-white font-black text-sm tracking-wider">LIMITED TIME OFFER</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 mb-4 sm:mb-5">
                <div>
                  <div className="flex items-center gap-3 justify-center mb-1">
                    <span className="text-2xl text-gray-500 line-through">$197</span>
                    <span className="text-4xl sm:text-5xl font-black text-teal-400">$58</span>
                  </div>
                  <div className="text-sm text-gray-400">One-time payment</div>
                  <div className="inline-block bg-green-600 text-white px-2 py-1 rounded text-xs font-black mt-1">71% OFF</div>
                </div>
                <div className="w-px h-12 bg-teal-500/20 hidden sm:block"></div>
                <div>
                  <div className="text-4xl sm:text-5xl font-black text-green-500">$1,623</div>
                  <div className="text-sm text-gray-400">You save today</div>
                </div>
                <div className="w-px h-12 bg-teal-500/20 hidden sm:block"></div>
                <div>
                  <div className="text-4xl sm:text-5xl font-black text-white">{spotsLeft}</div>
                  <div className="text-sm text-gray-400">Spots remaining</div>
                </div>
              </div>

              <button
                onClick={scrollToBonuses}
                className="inline-flex items-center gap-2 bg-teal-500 hover:bg-teal-500-light text-white px-6 py-3 sm:px-8 sm:py-4 rounded-xl text-base sm:text-lg font-black shadow-2xl hover:scale-105 active:scale-100 transition-all smooth-transform ease-out-expo mb-2.5 sm:mb-3"
              >
                <span>Claim Your Spot Now</span>
                <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>

              <p className="text-sm sm:text-base text-gray-500">
                <CheckCircle className="w-3 h-3 text-green-400 inline" /> 30-day money-back guarantee • <CheckCircle className="w-3 h-3 text-green-400 inline" /> Plus $50 if it doesn't work
              </p>
            </div>

            <div className="flex items-center justify-center gap-6 text-gray-400 text-sm">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-400" />
                <span>Secure Checkout</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-teal-400" />
                <span>Instant Access</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHO THIS IS FOR - Redesigned Visual Section */}
      <section className="py-6 sm:py-10 md:py-14 bg-[#0a0a0a]">
        <div className="w-full px-3 sm:px-6">
          <div className="max-w-5xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-6 sm:mb-10">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white mb-2">
                Is This <span className="text-teal-400">Right For You?</span>
              </h2>
              <p className="text-white/60 text-sm sm:text-base">Quick check to see if CloneYourself fits your practice</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
              {/* Perfect For - Green/Teal Card */}
              <div className="bg-gradient-to-br from-teal-500/10 via-teal-500/5 to-transparent rounded-2xl sm:rounded-3xl p-5 sm:p-8 border-2 border-teal-500/40 relative overflow-hidden">
                {/* Background glow */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-teal-500/10 rounded-full blur-3xl"></div>

                {/* Header */}
                <div className="flex items-center gap-3 mb-5 sm:mb-6 relative z-10">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg shadow-teal-500/30">
                    <CheckCircle className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-white">Perfect For</h3>
                    <p className="text-teal-400 text-xs sm:text-sm font-bold">You'll love this if...</p>
                  </div>
                </div>

                {/* Items with icons */}
                <div className="space-y-3 sm:space-y-4 relative z-10">
                  {[
                    { icon: Camera, text: "Camera-shy? You never have to film again", highlight: "never film" },
                    { icon: Clock, text: "Zero time to create content? 7 minutes max", highlight: "7 minutes" },
                    { icon: TrendingUp, text: "Want higher case acceptance? Most see 30%+ increase", highlight: "30%+ increase" },
                    { icon: Users, text: "Competing for patients? Stand out instantly", highlight: "Stand out" },
                    { icon: Star, text: "Need more reviews? Automated system included", highlight: "Automated" },
                    { icon: Zap, text: "Ready to grow in 2025? Start today", highlight: "Start today" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 bg-white/5 rounded-xl p-3 sm:p-4 border border-teal-500/20 hover:border-teal-500/40 transition-colors group">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-teal-500/20 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-teal-500/30 transition-colors">
                        <item.icon className="w-5 h-5 sm:w-6 sm:h-6 text-teal-400" />
                      </div>
                      <p className="text-white text-sm sm:text-base">
                        {item.text.split(item.highlight)[0]}
                        <span className="text-teal-400 font-bold">{item.highlight}</span>
                        {item.text.split(item.highlight)[1]}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* NOT For - Red/Dark Card */}
              <div className="bg-gradient-to-br from-red-500/10 via-slate-900 to-slate-950 rounded-2xl sm:rounded-3xl p-5 sm:p-8 border-2 border-red-500/30 relative overflow-hidden">
                {/* Background glow */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-red-500/10 rounded-full blur-3xl"></div>

                {/* Header */}
                <div className="flex items-center gap-3 mb-5 sm:mb-6 relative z-10">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/30">
                    <X className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-white">NOT For</h3>
                    <p className="text-red-400 text-xs sm:text-sm font-bold">Skip this if...</p>
                  </div>
                </div>

                {/* Items */}
                <div className="space-y-3 sm:space-y-4 relative z-10">
                  {[
                    { icon: AlertCircle, text: "You won't follow the simple step-by-step training" },
                    { icon: Clock, text: "You expect instant overnight success with no effort" },
                    { icon: Shield, text: "You want magic results without doing any work" },
                    { icon: TrendingDown, text: "You're not open to trying new marketing methods" },
                    { icon: Users, text: "You're happy with declining patient numbers" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 bg-white/5 rounded-xl p-3 sm:p-4 border border-red-500/20 group">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-500/10 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                        <item.icon className="w-5 h-5 sm:w-6 sm:h-6 text-red-400" />
                      </div>
                      <p className="text-white/70 text-sm sm:text-base">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom CTA */}
            <div className="mt-6 sm:mt-8 text-center">
              <p className="text-white/60 text-sm sm:text-base mb-4">Sound like a fit? Join 340+ dentists already inside</p>
              <button
                onClick={handleSpinClick}
                className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-8 py-4 rounded-xl font-black text-base sm:text-lg hover:scale-105 active:scale-95 transition-transform shadow-xl shadow-teal-500/30 flex items-center gap-2 mx-auto"
              >
                <Gift className="w-5 h-5" />
                Spin To Win Your Bonuses
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* VALUE STACK */}
      <section className="py-6 sm:py-10 md:py-14 bg-white">
        <div className="w-full px-3 sm:px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-center mb-6 sm:mb-8 text-gray-900">
              Everything You Get <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-teal-400-light">Today</span>
            </h2>

            <div className="space-y-3 sm:space-y-4">
              {/* Main Course */}
              <div className="bg-gradient-to-r from-teal-400 to-teal-400-light rounded-xl p-4 sm:p-5 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-lg flex items-center justify-center">
                      <Video className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div>
                      <h3 className="font-black text-sm sm:text-lg">CloneYourself AI Video System</h3>
                      <p className="text-white/80 text-xs sm:text-sm">Complete A-to-Z training course</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl sm:text-2xl font-black">$197</p>
                    <p className="text-white/60 text-xs line-through">value</p>
                  </div>
                </div>
              </div>

              {/* 5 Bonuses */}
              <div className="bg-teal-500/5 border border-teal-500/20 rounded-xl p-4 sm:p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-teal-500/20 rounded-lg flex items-center justify-center">
                      <Gift className="w-5 h-5 sm:w-6 sm:h-6 text-teal-400" />
                    </div>
                    <div>
                      <h3 className="font-black text-gray-900 text-sm sm:text-lg">5 Premium Bonuses (Your Choice)</h3>
                      <p className="text-gray-600 text-xs sm:text-sm">Practice growth tools & templates</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl sm:text-2xl font-black text-teal-400">${getDentistTotalBonusValue()}</p>
                    <p className="text-gray-400 text-xs line-through">value</p>
                  </div>
                </div>
              </div>

              {/* Direct Access */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 sm:p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                      <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="font-black text-gray-900 text-sm sm:text-lg">Direct Email Support</h3>
                      <p className="text-gray-600 text-xs sm:text-sm">Get answers when you need them</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl sm:text-2xl font-black text-gray-700">$97</p>
                    <p className="text-gray-400 text-xs line-through">value</p>
                  </div>
                </div>
              </div>

              {/* Mystery Box */}
              <div className="bg-gradient-to-r from-violet-100 to-purple-100 border border-violet-300 rounded-xl p-4 sm:p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-black text-gray-900 text-sm sm:text-lg">Mystery Box</h3>
                      <p className="text-gray-600 text-xs sm:text-sm">Secret surprise after purchase</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl sm:text-2xl font-black text-violet-600">$500+</p>
                    <p className="text-gray-400 text-xs line-through">value</p>
                  </div>
                </div>
              </div>

              {/* Lifetime Updates */}
              <div className="bg-gradient-to-r from-teal-400/10 to-teal-400/5 border border-teal-500/30 rounded-xl p-4 sm:p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-teal-400 to-teal-400-dark rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-black text-gray-900 text-sm sm:text-lg">Lifetime Updates</h3>
                      <p className="text-gray-600 text-xs sm:text-sm">New content added weekly</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl sm:text-2xl font-black text-teal-400">$297</p>
                    <p className="text-gray-400 text-xs line-through">value</p>
                  </div>
                </div>
              </div>

              {/* Total */}
              <div className="bg-gray-900 rounded-xl p-4 sm:p-6 mt-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-white/60 text-sm sm:text-base">Total Value:</span>
                  <span className="text-white/40 line-through text-lg sm:text-xl">${197 + getDentistTotalBonusValue() + 97 + 500 + 297}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white font-bold text-lg sm:text-xl">Today Only:</span>
                  <span className="text-3xl sm:text-4xl font-black text-teal-400">$58</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECOND GUARANTEE - Try It Free 30 Days */}
      <section className="py-6 sm:py-10 md:py-14 bg-white">
        <div className="w-full px-3 sm:px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-4 sm:mb-5">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-4 sm:px-5 py-2 rounded-full font-black text-xs shadow-2xl shadow-emerald-500/30">
                <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                ZERO-RISK GUARANTEE
              </div>
            </div>

            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-league-spartan font-black text-center mb-2 sm:mb-3 text-white">
              Try It Free For <span className="text-teal-400">30 Days</span>
            </h2>
            <p className="text-center text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 max-w-3xl mx-auto">
              If this doesn't work exactly like I promised, I'll refund you + pay you <span className="font-black text-emerald-600">$50</span> for your time
            </p>

            {/* Dr. Marcus's Promise Card - Premium Design */}
            <div className="bg-gradient-to-br from-luxury-black to-gray-900 rounded-2xl shadow-2xl border border-teal-500/30 p-4 sm:p-6 md:p-8 mb-4 sm:mb-5">
              <div className="flex flex-col md:flex-row gap-4 sm:gap-5 items-start">
                <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto md:mx-0 flex-shrink-0 relative">
                  <div className="absolute inset-0 bg-teal-500 rounded-full animate-pulse opacity-20" />
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-teal-500 shadow-xl">
                    <Image src="/images/dentist/dr-marcus.webp" alt="Dr. Marcus Chen" fill className="object-cover" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-full w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center border-2 border-white shadow-lg">
                    <CheckCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  </div>
                </div>

                <div className="flex-1">
                  <div className="mb-3 sm:mb-4">
                    <p className="text-sm sm:text-lg font-bold text-white mb-2 sm:mb-3 italic leading-relaxed">
                      "If you can't create professional patient videos in 7 minutes or less,
                      I'll refund every penny AND send you $50 for wasting your time."
                    </p>
                    <p className="text-xs sm:text-base text-white/70 mb-2">
                      <span className="font-bold text-emerald-400">Full refund</span> PLUS I'll pay YOU $50. Zero risk.
                    </p>
                  </div>
                  <div className="border-t border-white/20 pt-2 sm:pt-3">
                    <p className="font-black text-white text-xs sm:text-sm">— Dr. Marcus Chen</p>
                    <p className="text-[10px] sm:text-xs text-white/60">Cosmetic Dentist • Austin, TX</p>
                  </div>
                </div>
              </div>
            </div>

            {/* How to Get Refund - Premium Design */}
            <div className="bg-gradient-to-br from-luxury-black to-gray-900 border border-teal-500/30 rounded-2xl p-4 sm:p-5 shadow-xl">
              <h3 className="text-sm sm:text-lg font-league-spartan font-black text-center mb-2 text-white">
                How To Get Your Money Back <span className="text-emerald-400">(30 Seconds)</span>
              </h3>
              <p className="text-center text-white/60 mb-4 sm:mb-5 text-[10px] sm:text-sm">
                No forms. No hoops. No waiting. Just email us:
              </p>

              <div className="max-w-md mx-auto">
                {/* Email Option */}
                <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-xl p-3 sm:p-4 border border-emerald-500/30 hover:border-emerald-500/50 transition-all shadow-lg">
                  <div className="flex items-center justify-between mb-2 sm:mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
                        <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-black text-white text-xs sm:text-sm">Email Us</h4>
                        <p className="text-[10px] sm:text-xs text-emerald-400">24-hour response</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-2 sm:p-3 border border-white/10">
                    <p className="text-[10px] sm:text-xs text-white/60 mb-1">Send to:</p>
                    <code className="text-[10px] sm:text-xs font-mono text-white/80 block">support@aifastscale.com</code>
                  </div>
                  <div className="bg-emerald-500/10 rounded-lg p-2 sm:p-3 border border-emerald-500/20 mt-2">
                    <p className="text-[10px] sm:text-xs text-emerald-400/80 mb-1">Message to copy:</p>
                    <p className="text-[10px] sm:text-xs text-white/90 italic">"Hi, I'd like my refund please. My purchase email is [YOUR EMAIL]"</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHO IS DR. MARCUS */}
      <section className="py-4 sm:py-6 md:py-10 bg-luxury-black">
        <div className="w-full px-3 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-6 sm:mb-10">
              <div className="inline-flex items-center gap-2 bg-teal-500/10 border border-teal-500/30 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full mb-3 sm:mb-4">
                <Award className="w-4 h-4 text-teal-400" />
                <span className="text-teal-400 font-bold text-xs tracking-wider">MEET YOUR INSTRUCTOR</span>
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-league-spartan font-black mb-3 px-4">
                Who Am I & <span className="text-teal-400">Why Should You Listen?</span>
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-5 sm:gap-8 mb-6 sm:mb-8">
              <div className="relative w-full aspect-[4/3] max-w-[320px] sm:max-w-md mx-auto rounded-2xl overflow-hidden border-2 border-teal-500/30 shadow-xl shadow-teal-500/20">
                <Image
                  src="/images/dentist/dr-marcus.webp"
                  alt="Dr. Marcus Chen"
                  fill
                  className="object-cover"
                />
              </div>

              <div className="space-y-4 sm:space-y-5">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold mb-3 text-teal-400">I Was You</h3>
                  <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
                    15 years running my cosmetic practice in Austin. Watching competitors dominate social media while I hid from the camera. I knew video worked — I just couldn't bring myself to film.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl sm:text-2xl font-bold mb-3 text-teal-400">Then I Found AI Video</h3>
                  <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
                    One headshot. 30+ patient education videos. In minutes. My case acceptance jumped from 42% to 78%. Patients understood procedures before they even sat in my chair.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl sm:text-2xl font-bold mb-3 text-teal-400">Now I'm Sharing Everything</h3>
                  <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
                    340+ dentists have joined. The results speak for themselves. This isn't theory — it's the exact system that transformed my practice.
                  </p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              {[
                { value: "$2.1M+", label: "Revenue Generated" },
                { value: "15 Years", label: "Experience" },
                { value: "340+", label: "Dentists Helped" },
                { value: "4.9/5", label: "Avg Rating" }
              ].map((stat, i) => (
                <div key={i} className="bg-luxury-graphite/30 border border-teal-500/20 rounded-xl p-3 sm:p-4 text-center">
                  <div className="text-2xl sm:text-3xl font-black text-teal-400 mb-2">{stat.value}</div>
                  <div className="text-xs sm:text-sm text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-8 sm:py-10 bg-[#0a0a0a]">
        <div className="w-full px-3 sm:px-6">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-xl sm:text-2xl font-black text-center mb-6 sm:mb-8 text-white">
              Frequently Asked Questions
            </h2>

            <div className="space-y-2 sm:space-y-3">
              {faqs.map((faq, i) => (
                <div key={i} className="bg-white rounded-xl overflow-hidden">
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-3 sm:p-4 text-left"
                  >
                    <span className="font-semibold text-[13px] sm:text-base pr-2 text-gray-900">{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0 transition-transform ${expandedFaq === i ? 'rotate-180' : ''}`} />
                  </button>
                  {expandedFaq === i && (
                    <div className="px-3 sm:px-4 pb-3 sm:pb-4 pt-0">
                      <p className="text-[13px] sm:text-sm text-gray-700 leading-relaxed">{faq.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* CTA After FAQ */}
            <div className="mt-8 sm:mt-10 text-center">
              <p className="text-white/70 text-sm sm:text-base mb-4">Still have questions? Email support@aifastscale.com</p>
              <button
                onClick={handleSpinClick}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-8 py-4 rounded-xl text-base sm:text-lg font-black shadow-xl shadow-teal-500/30 hover:scale-105 active:scale-95 transition-transform"
              >
                <Gift className="w-5 h-5" />
                <span>Spin To Win Your Bonuses</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL URGENCY CTA */}
      <section className="py-8 sm:py-10 bg-white">
        <div className="w-full px-3">
          <div className="max-w-3xl mx-auto">
            <div className="bg-gradient-to-br from-teal-400/10 to-teal-400-pale border-4 border-teal-500 rounded-3xl p-5 sm:p-7 text-center shadow-2xl">
              <div className="inline-flex items-center gap-2 bg-teal-500 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-black mb-4">
                <Clock className="w-4 h-4" />
                <span>Price Increases in {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}</span>
              </div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-league-spartan font-black mb-3 text-white">
                Zero Risk. Pure Upside.
              </h2>

              <p className="text-base sm:text-lg text-gray-700 mb-4 sm:mb-5 leading-relaxed">
                You're protected by a 30-day guarantee <span className="font-bold">PLUS</span> I'll pay you $50 if this doesn't work.
                <br className="hidden sm:block" />
                The only way you lose is by not trying.
              </p>

              <div className="bg-white rounded-2xl p-4 sm:p-5 mb-4 sm:mb-5 shadow-inner border-2 border-teal-500/30">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-3xl sm:text-4xl font-black text-teal-400 mb-1">$197</div>
                    <div className="text-xs text-gray-600">Regular Price</div>
                  </div>
                  <div>
                    <div className="text-3xl sm:text-4xl font-black text-green-600 mb-1">$58</div>
                    <div className="text-xs text-gray-600">Today Only</div>
                  </div>
                  <div>
                    <div className="text-3xl sm:text-4xl font-black text-teal-400 mb-1">71%</div>
                    <div className="text-xs text-gray-600">You Save</div>
                  </div>
                </div>
              </div>

              <button
                onClick={handleSpinClick}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-8 py-4 sm:px-12 sm:py-5 rounded-xl sm:rounded-2xl text-lg sm:text-xl font-black shadow-2xl shadow-teal-500/30 hover:scale-105 active:scale-95 transition-all mb-3 sm:mb-4"
              >
                <Gift className="w-6 h-6" />
                <span>Spin To Win + Get Access</span>
                <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>

              <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-green-600" />
                  <span>30-Day Guarantee</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Instant Delivery</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* FOOTER */}
      <footer className="py-8 sm:py-10 bg-[#0a0a0a] border-t border-teal-500/10">
        <div className="w-full px-4 sm:px-6">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-center sm:text-left">
                <div className="text-lg font-bold text-teal-400 mb-1">
                  CloneYourself
                </div>
                <p className="text-white/40 text-xs">
                  The AI video system for dentists
                </p>
              </div>
              <div className="flex items-center gap-4 text-white/40 text-xs">
                <a href="/privacy-policy" className="hover:text-white/60 transition-colors">Privacy</a>
                <a href="/terms-of-service" className="hover:text-white/60 transition-colors">Terms</a>
                <a href="/refund-policy" className="hover:text-white/60 transition-colors">Refund</a>
                <a href="mailto:support@aifastscale.com" className="hover:text-white/60 transition-colors">Contact</a>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-white/5 text-center">
              <p className="text-white/30 text-xs">
                © {new Date().getFullYear()} CloneYourself. All rights reserved. Results may vary. This is not medical advice.
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* ORDER SUMMARY MODAL - Compact Design like Upsell/Downsell */}
      {isMounted && isModalOpen && createPortal(
        <div
          className="fixed inset-0 z-[9999] bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-y-auto overscroll-contain"
          onClick={closeModal}
        >
          <div className="min-h-screen flex items-center justify-center p-2 md:p-3">
            <div
              className="w-full max-w-md bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl md:rounded-2xl border border-teal-500/30 shadow-2xl shadow-teal-500/10 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header - Timer */}
              <div className="bg-gradient-to-r from-teal-500 to-cyan-500 px-3 md:px-4 py-2 md:py-2.5">
                <div className="flex items-center justify-center gap-1.5 md:gap-2">
                  <Clock className="w-3 h-3 md:w-4 md:h-4 text-white animate-pulse" />
                  <span className="text-white/90 text-[10px] md:text-xs font-bold">LIMITED TIME OFFER</span>
                  <span className="text-white text-sm md:text-lg font-black tabular-nums">
                    {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
                  </span>
                </div>
              </div>

              {/* All Content - Scrollable */}
              <div className="p-3 md:p-4 max-h-[85vh] overflow-y-auto">
                {/* Close Button */}
                <button
                  onClick={closeModal}
                  className="absolute top-12 right-3 z-10 w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/60 hover:text-white transition-all"
                >
                  <X className="w-3.5 h-3.5" />
                </button>

                {/* Title */}
                <div className="text-center mb-3 md:mb-4">
                  <h1 className="text-lg md:text-xl font-black text-white mb-0.5 md:mb-1">
                    Your Order Summary
                  </h1>
                  <p className="text-white/60 text-xs md:text-sm">
                    Everything you're getting for just <span className="text-teal-400 font-black">$58</span>
                  </p>
                </div>

                {/* Main Course Card */}
                <div className="bg-gradient-to-br from-teal-500/15 to-cyan-500/10 rounded-lg md:rounded-xl p-2.5 md:p-3 border border-teal-500/40 mb-3 md:mb-4">
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className="w-14 h-10 md:w-16 md:h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gradient-to-br from-teal-500/30 to-cyan-500/20 flex items-center justify-center">
                      <Play className="w-6 h-6 md:w-7 md:h-7 text-teal-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-white text-xs md:text-sm font-black">CloneYourself™ AI Video System</div>
                      <p className="text-white/50 text-[9px] md:text-[10px]">Complete System + Lifetime Access</p>
                    </div>
                    <div className="flex flex-col items-end flex-shrink-0">
                      <span className="text-white/40 line-through text-[10px] md:text-xs">$197</span>
                      <span className="text-teal-400 font-black text-sm md:text-base">$58</span>
                    </div>
                  </div>
                </div>

                {/* Selected Bonuses Card */}
                <div className="bg-white/5 rounded-lg md:rounded-xl border border-teal-500/30 mb-3 md:mb-4">
                  <div className="px-2.5 md:px-3 py-1.5 md:py-2 border-b border-white/10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 md:gap-2">
                        <Gift className="w-3 h-3 md:w-4 md:h-4 text-teal-400" />
                        <span className="text-white font-bold text-xs md:text-sm">Your 5 FREE Bonuses</span>
                      </div>
                      <span className="text-teal-400 font-black text-xs md:text-sm">${getDentistTotalBonusValue()} value</span>
                    </div>
                  </div>

                  <div className="p-1.5 md:p-2 space-y-1 md:space-y-1.5">
                    {selectedBonuses.map((bonusId) => {
                      const bonus = DENTIST_BONUS_PRODUCTS.find((b) => b.id === bonusId)
                      if (!bonus) return null
                      return (
                        <div
                          key={bonus.id}
                          className="flex items-center gap-1.5 md:gap-2 bg-white/5 rounded-lg p-1.5 md:p-2"
                        >
                          <div className="w-12 h-8 md:w-14 md:h-9 flex-shrink-0 rounded-lg overflow-hidden">
                            {bonus.image ? (
                              <img
                                src={bonus.image}
                                alt={bonus.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-teal-500/20 flex items-center justify-center">
                                <Gift className="w-4 h-4 text-teal-400" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-white text-[10px] md:text-xs font-bold truncate">{bonus.title}</div>
                          </div>
                          <div className="flex items-center gap-1 md:gap-1.5 flex-shrink-0">
                            <span className="text-red-400 line-through text-[9px] md:text-[10px]">${bonus.value}</span>
                            <span className="text-teal-400 font-black text-[10px] md:text-xs bg-teal-500/20 px-1 md:px-1.5 py-0.5 rounded">FREE</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Mystery Box */}
                <div className="bg-gradient-to-r from-violet-600/20 to-purple-600/20 rounded-lg md:rounded-xl p-2.5 md:p-3 border border-violet-500/40 mb-2.5 md:mb-3">
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-violet-500/30 flex-shrink-0">
                      <Gift className="w-4 h-4 md:w-5 md:h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-1.5 md:gap-2">
                        <span className="text-white font-black text-xs md:text-sm">Mystery Box</span>
                        <span className="bg-violet-500/30 text-violet-300 px-1 md:px-1.5 py-0.5 rounded text-[8px] md:text-[9px] font-black">SECRET</span>
                      </div>
                      <p className="text-white/50 text-[9px] md:text-[10px]">Exclusive surprise revealed after purchase</p>
                    </div>
                    <span className="text-violet-400 font-black text-xs md:text-sm">$500-$1.5k</span>
                  </div>
                </div>

                {/* Lifetime Updates */}
                <div className="bg-gradient-to-r from-teal-500/15 to-cyan-500/15 rounded-lg md:rounded-xl p-2.5 md:p-3 border border-teal-500/40 mb-3 md:mb-4">
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-lg flex items-center justify-center shadow-lg shadow-teal-500/30 flex-shrink-0">
                      <svg className="w-4 h-4 md:w-5 md:h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-1.5 md:gap-2">
                        <span className="text-white font-black text-xs md:text-sm">Lifetime Updates</span>
                        <span className="bg-teal-500/30 text-teal-300 px-1 md:px-1.5 py-0.5 rounded text-[8px] md:text-[9px] font-black">WEEKLY</span>
                      </div>
                      <p className="text-white/50 text-[9px] md:text-[10px]">New tools & templates added weekly forever</p>
                    </div>
                    <span className="text-teal-400 font-black text-xs md:text-sm">$297</span>
                  </div>
                </div>

                {/* Guarantee */}
                <div className="bg-gradient-to-r from-teal-500/10 to-cyan-500/10 border border-teal-500/30 rounded-lg md:rounded-xl p-2.5 md:p-3 mb-3 md:mb-4">
                  <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
                    <div className="relative w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden border-2 border-teal-400 flex-shrink-0">
                      <Image src="/images/dentist/dr-marcus.webp" alt="Dr. Marcus" fill className="object-cover" />
                    </div>
                    <div>
                      <p className="text-white font-black text-xs md:text-sm">"You Win Either Way" Guarantee</p>
                      <div className="inline-flex items-center gap-1 bg-teal-500 rounded px-1 md:px-1.5 py-0.5 mt-0.5 md:mt-1">
                        <CheckCircle className="w-2 h-2 md:w-2.5 md:h-2.5 text-white" />
                        <span className="text-white text-[8px] md:text-[9px] font-bold">VERIFIED</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1.5 md:space-y-2 text-xs md:text-sm">
                    <div className="flex items-start gap-1.5 md:gap-2">
                      <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-teal-400 flex-shrink-0 mt-0.5" />
                      <p className="text-white/80 text-[10px] md:text-sm"><span className="text-white font-bold">30-Day Money-Back:</span> Full refund, no questions.</p>
                    </div>
                    <div className="flex items-start gap-1.5 md:gap-2">
                      <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-teal-400 flex-shrink-0 mt-0.5" />
                      <p className="text-white/80 text-[10px] md:text-sm"><span className="text-white font-bold">PLUS $50 Bonus:</span> If it doesn't help, I'll Venmo you $50.</p>
                    </div>
                    <div className="flex items-start gap-1.5 md:gap-2">
                      <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-teal-400 flex-shrink-0 mt-0.5" />
                      <p className="text-white/80 text-[10px] md:text-sm"><span className="text-white font-bold">Keep Everything:</span> Even if you refund, keep all bonuses.</p>
                    </div>
                  </div>
                  <div className="mt-2 md:mt-3 bg-teal-500/10 rounded-lg p-1.5 md:p-2 text-center">
                    <p className="text-teal-400 text-[10px] md:text-xs font-bold">You literally CANNOT lose. Either profit or get paid to try it.</p>
                  </div>
                </div>

                {/* Price Section */}
                <div className="bg-white/5 rounded-lg md:rounded-xl p-3 md:p-4 mb-3 md:mb-4">
                  <div className="flex items-center justify-between mb-1.5 md:mb-2">
                    <span className="text-white/50 text-xs md:text-sm">Total Value:</span>
                    <span className="text-white/40 line-through text-xs md:text-sm">${197 + getDentistTotalBonusValue() + 297 + 500}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white font-bold text-sm md:text-lg">Today Only:</span>
                    <div className="flex items-center gap-1.5 md:gap-2">
                      <span className="text-2xl md:text-3xl font-black text-teal-400">$58</span>
                      <span className="bg-teal-500/20 text-teal-400 text-[10px] md:text-xs px-1.5 md:px-2 py-0.5 md:py-1 rounded font-black">
                        70% OFF
                      </span>
                    </div>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="space-y-1.5 md:space-y-2">
                  <button
                    onClick={() => {
                      if (selectedBonuses.length !== 5) {
                        alert('Please select exactly 5 bonuses first!')
                        return
                      }
                      localStorage.setItem('selectedDentistBonuses', JSON.stringify(selectedBonuses))
                      setIsModalOpen(false)
                      setShowCheckoutModal(true)
                    }}
                    className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white py-3 md:py-4 rounded-lg md:rounded-xl font-black text-sm md:text-base flex items-center justify-center gap-1.5 md:gap-2 hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-lg shadow-teal-500/30"
                  >
                    <Gift className="w-4 h-4 md:w-5 md:h-5" />
                    Complete My Order - $58
                    <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                  </button>

                  <button
                    onClick={closeModal}
                    className="w-full text-white/70 text-xs md:text-sm py-2.5 md:py-3 hover:text-white transition-colors underline underline-offset-2"
                  >
                    Go back and review →
                  </button>
                </div>

                {/* Trust badges */}
                <div className="flex items-center justify-center gap-1.5 md:gap-2 text-white/30 text-[9px] md:text-[10px] mt-2 md:mt-3">
                  <svg className="w-2.5 h-2.5 md:w-3 md:h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span>SSL Encrypted</span>
                  <span>•</span>
                  <span>Instant Access</span>
                </div>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* GLOBAL STICKY CHECKOUT - Only when 5 bonuses selected */}
      {selectedBonuses.length === 5 && !isModalOpen && isMounted && createPortal(
        <div
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 999999,
            padding: '12px 16px',
            paddingBottom: 'max(12px, env(safe-area-inset-bottom))',
            background: 'linear-gradient(to top, rgba(10,10,10,0.98), rgba(10,10,10,0.9), transparent)',
          }}
        >
          <div style={{ maxWidth: '400px', margin: '0 auto' }}>
            <div
              style={{
                background: 'linear-gradient(145deg, #0f172a, #1e293b)',
                border: '2px solid rgba(20, 184, 166, 0.5)',
                borderRadius: '20px',
                padding: '16px',
                boxShadow: '0 -8px 40px rgba(20, 184, 166, 0.15)',
              }}
            >
              {/* Status Badge */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: 'rgba(20, 184, 166, 0.15)',
                    border: '1px solid rgba(20, 184, 166, 0.4)',
                    borderRadius: '100px',
                    padding: '8px 16px',
                  }}
                >
                  <CheckCircle style={{ width: '18px', height: '18px', color: '#14b8a6' }} />
                  <span style={{ color: '#14b8a6', fontWeight: 800, fontSize: '13px' }}>5/5 SELECTED</span>
                  <span style={{ color: '#06b6d4', fontWeight: 700, fontSize: '12px', marginLeft: '4px' }}>${animatedValue} VALUE</span>
                </div>
              </div>

              {/* CTA Button */}
              <button
                onClick={() => {
                  localStorage.setItem('selectedDentistBonuses', JSON.stringify(selectedBonuses))
                  setIsModalOpen(true)
                }}
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #14b8a6 0%, #06b6d4 50%, #14b8a6 100%)',
                  color: 'black',
                  padding: '16px 24px',
                  borderRadius: '14px',
                  fontWeight: 900,
                  fontSize: '17px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 20px rgba(20, 184, 166, 0.4)',
                }}
              >
                <Zap style={{ width: '20px', height: '20px' }} />
                <span>Complete Order - $58</span>
              </button>

              {/* Trust Line */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                marginTop: '10px',
                color: 'rgba(255,255,255,0.5)',
                fontSize: '10px',
              }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Shield style={{ width: '12px', height: '12px', color: '#14b8a6' }} />
                  SSL Secure
                </span>
                <span style={{ color: 'rgba(255,255,255,0.3)' }}>•</span>
                <span>30-Day Guarantee</span>
                <span style={{ color: 'rgba(255,255,255,0.3)' }}>•</span>
                <span>Instant Access</span>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}


      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={showCheckoutModal}
        onClose={() => setShowCheckoutModal(false)}
        planId={DENTIST_PLAN_IDS.main}
        planName="CloneYourself for Dentists"
        price="$58"
      />

      {/* Spin Wheel Modal */}
      {showSpinWheel && (
        <DentistSpinWheel
          isOpen={showSpinWheel}
          onClose={() => setShowSpinWheel(false)}
        />
      )}
    </div>
  )
}
