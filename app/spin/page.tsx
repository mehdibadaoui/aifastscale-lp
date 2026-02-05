'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import {
  Gift,
  Shield,
  CheckCircle,
  ArrowRight,
  Clock,
  Users,
  Video,
  Upload,
  TrendingUp,
  Sparkles,
  Play,
  PlayCircle,
  ChevronDown,
  Star,
  Check,
  X,
  AlertTriangle,
  Zap,
  Award,
  Mail,
  Copy,
  Crown,
  Instagram,
  MapPin,
  Quote,
} from 'lucide-react'
import dynamic from 'next/dynamic'
import CountdownTimer from '../components/CountdownTimer'

// Dynamic import SpinWheel - only loads when user clicks to spin (massive JS savings)
const SpinWheel = dynamic(() => import('../components/SpinWheel'), {
  loading: () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-gold-premium border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gold-premium font-bold">Loading Spin Wheel...</p>
      </div>
    </div>
  ),
  ssr: false // No server-side rendering needed for modal
})

// Black Friday ends tonight at midnight (user's local time) - always feels like last day!
const getBlackFridayEnd = () => {
  const now = new Date()
  const tonight = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59)
  return tonight
}

// Haptic feedback utility for mobile
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

export default function Home() {
  const [showSpinWheel, setShowSpinWheel] = useState(false)
  const [selectedGift, setSelectedGift] = useState<any>(null)
  const [activeQuestion, setActiveQuestion] = useState<number | null>(null)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const [showWhatIs, setShowWhatIs] = useState(false)
  const [socialProof, setSocialProof] = useState<{ name: string; location: string; time: string } | null>(null)
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 })
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)
  const [copiedText, setCopiedText] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  // Copy to clipboard helper
  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedText(id)
    triggerHaptic('light')
    setTimeout(() => setCopiedText(null), 2000)
  }

  // FAQs for Common Questions section
  const faqs = [
    {
      q: 'Does this really take only 7 minutes?',
      a: 'Yes. Upload photo (1 min), type script (2 min), AI makes video (3 min), download (1 min). Done. Zero editing. I timed it.',
    },
    {
      q: 'Will this work for my market?',
      a: 'Yes. 847+ agents in Dubai, Abu Dhabi, Sharjah use this daily. Works globally. Supports English, Arabic, all major languages.',
    },
    {
      q: 'Do I have to film myself? (I hate being on camera)',
      a: 'Nope. Upload ONE headshot. AI does the rest. Never pick up a camera again. Perfect for camera-shy agents.',
    },
    {
      q: 'Will people know it\'s AI? Will it look fake?',
      a: 'Most can\'t tell. The lip-sync is scary good. Your clients care about your message, not how you made it. 847 agents are already using this successfully.',
    },
    {
      q: 'I\'m not tech-savvy. Can I do this?',
      a: 'If you can text and upload a photo, you can do this. Step-by-step training included. Plus I\'m on Instagram (@sara.theagent) if you get stuck.',
    },
    {
      q: 'What if this doesn\'t work for me?',
      a: 'Email support@aifastscale.com or DM me (@sara.theagent). Say "refund" and I\'ll send your money back + $50 for your time. 30 days. Zero questions.',
    },
    {
      q: 'When do I get access?',
      a: 'Immediately after purchase. Check your email for login details. You can create your first video in the next 10 minutes.',
    },
    {
      q: 'Do I need to buy expensive AI tools?',
      a: 'No. Everything is included. The system shows you exactly which free/cheap tools to use. No hidden costs.',
    },
  ]

  // Premium testimonials data - matched to actual review images
  const testimonials = [
    {
      id: 1,
      name: 'Sofia Martinez',
      role: 'Luxury Real Estate Agent',
      location: 'Miami, FL',
      image: '/images/Reviews/Review REA 1.jpeg',
      rating: 5,
      review: 'I was skeptical about AI videos, but this changed everything. Created my first video in 7 minutes - got 4 qualified leads that same week. My Instagram engagement went up 340%. Best $47.81 I ever spent.',
      results: '4 leads in first week',
      verified: true,
    },
    {
      id: 2,
      name: 'Marcus Williams',
      role: 'Commercial Real Estate Broker',
      location: 'Atlanta, GA',
      image: '/images/Reviews/Review REA 2.jpeg',
      rating: 5,
      review: 'After 15 years in real estate, I thought I\'d seen it all. This AI video system is a game-changer. Closed $2.3M in listings last month - all from leads generated by these videos. My team is now using it too.',
      results: '$2.3M in closings',
      verified: true,
    },
    {
      id: 3,
      name: 'Yasmin Al-Rashid',
      role: 'Senior Property Consultant',
      location: 'Dubai, UAE',
      image: '/images/Reviews/Review REA 3.jpeg',
      rating: 5,
      review: 'As a Dubai agent, I need to look premium. These AI videos make my listings look like million-dollar productions. I went from 2-3 leads per week to 15+. My broker asked what my secret was!',
      results: '15+ leads per week',
      verified: true,
    },
    {
      id: 4,
      name: 'Kwame Asante',
      role: 'Executive Real Estate Director',
      location: 'Lagos, Nigeria',
      image: '/images/Reviews/Review REA 4.jpeg',
      rating: 5,
      review: 'The luxury market in Lagos is competitive. These AI videos helped me stand out immediately. My social media presence exploded - 12K new followers in 2 months. Worth every penny.',
      results: '12K new followers',
      verified: true,
    },
    {
      id: 5,
      name: 'Dr. Raj Patel',
      role: 'Investment Property Specialist',
      location: 'London, UK',
      image: '/images/Reviews/Review REA 5.jpeg',
      rating: 5,
      review: 'I was spending £800/month on video production. Now I create better content myself in minutes. ROI was immediate. Already recovered my investment 50x over. This is the future of real estate marketing.',
      results: '50x ROI',
      verified: true,
    },
    {
      id: 6,
      name: 'Isabelle Laurent',
      role: 'Prestige Estates Director',
      location: 'Paris, France',
      image: '/images/Reviews/Review REA 6.jpeg',
      rating: 5,
      review: 'French luxury clients expect excellence. These AI videos deliver exactly that - sophisticated, professional content that my high-net-worth clients love. Bookings for private viewings doubled.',
      results: '2x private viewings',
      verified: true,
    },
    {
      id: 7,
      name: 'Jaylen Brooks',
      role: 'New Construction Specialist',
      location: 'Houston, TX',
      image: '/images/Reviews/Review REA 7.jpeg',
      rating: 5,
      review: 'Started using this 3 months ago as a new agent. Already closed 8 deals - all from social media leads. The AI videos make me look like I\'ve been doing this for years. Absolute game-changer for new agents.',
      results: '8 deals in 3 months',
      verified: true,
    },
    {
      id: 8,
      name: 'Jennifer Kim',
      role: 'Urban Properties Specialist',
      location: 'Vancouver, Canada',
      image: '/images/Reviews/Review REA 9.jpeg',
      rating: 5,
      review: 'The Vancouver market is tough. AI videos helped me dominate Instagram Reels. My last listing video got 47K views. Sold the property in 5 days for $80K over asking. This system pays for itself daily.',
      results: 'Sold $80K over asking',
      verified: true,
    },
    {
      id: 9,
      name: 'Noura Al Rashid',
      role: 'Penthouse Sales Specialist',
      location: 'Dubai, UAE',
      image: '/images/Reviews/Review REA 10.jpeg',
      rating: 5,
      review: 'In Dubai\'s ultra-luxury market, presentation is everything. These videos elevated my brand instantly. Landed 3 exclusive penthouse listings worth $45M total. My competitors are asking how I do it.',
      results: '$45M in listings',
      verified: true,
    },
    {
      id: 10,
      name: 'Carlos Mendoza',
      role: 'Family Homes Expert',
      location: 'Los Angeles, CA',
      image: '/images/Reviews/Review REA 11.jpeg',
      rating: 5,
      review: '25 years selling homes and I wish I had this sooner. My grandkids taught me TikTok, but these AI videos taught me how to actually get leads from it. 6 closings last month from social media alone.',
      results: '6 closings from social',
      verified: true,
    },
    {
      id: 11,
      name: 'Robert Thompson',
      role: 'Family Home Specialist',
      location: 'London, UK',
      image: '/images/Reviews/Review REA 12.jpeg',
      rating: 5,
      review: 'Was hesitant as a "traditional" agent. My daughter convinced me to try it. First video got more engagement than 6 months of posts combined. Now I\'m the "tech-savvy" agent at my brokerage. Clients love it.',
      results: '6 months of engagement in 1 video',
      verified: true,
    },
    {
      id: 12,
      name: 'Sofia Reyes',
      role: 'Luxury Sales Specialist',
      location: 'Marbella, Spain',
      image: '/images/Reviews/Review REA 13.jpeg',
      rating: 5,
      review: 'The European luxury market demands sophistication. These AI videos deliver that in spades. My average listing price went from €1.5M to €3.2M because I\'m attracting higher-end clients now.',
      results: 'Doubled average listing price',
      verified: true,
    },
    {
      id: 13,
      name: 'Adriana Clarke',
      role: 'Waterfront Properties Expert',
      location: 'Kingston, Jamaica',
      image: '/images/Reviews/Review REA 14.jpeg',
      rating: 5,
      review: 'Caribbean luxury properties need to shine. These AI videos showcase my oceanfront listings beautifully. International buyers are reaching out from all over the world. Best marketing tool I\'ve ever used.',
      results: 'International buyer inquiries',
      verified: true,
    },
    {
      id: 14,
      name: 'David Mitchell',
      role: 'Residential Sales Expert',
      location: 'Charlotte, NC',
      image: '/images/Reviews/Review REA 15.jpeg',
      rating: 5,
      review: 'Simple, effective, and it just works. I create 3-4 videos per week now. My sphere of influence has grown by 200%. Referrals are up because people see me everywhere. This is real estate marketing made easy.',
      results: '200% sphere growth',
      verified: true,
    },
  ]

  const [showAllTestimonials, setShowAllTestimonials] = useState(false)

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

  // Social proof notifications - shows random purchases
  useEffect(() => {
    const buyers = [
      { name: 'Sarah M.', location: 'Dubai, UAE' },
      { name: 'James T.', location: 'London, UK' },
      { name: 'Ahmed K.', location: 'Abu Dhabi, UAE' },
      { name: 'Michael R.', location: 'Toronto, Canada' },
      { name: 'Fatima A.', location: 'Sharjah, UAE' },
      { name: 'David L.', location: 'Sydney, Australia' },
      { name: 'Priya S.', location: 'Singapore' },
      { name: 'Carlos H.', location: 'Miami, USA' },
      { name: 'Emma W.', location: 'Manchester, UK' },
      { name: 'Hassan M.', location: 'Dubai, UAE' },
    ]
    const times = ['just now', '2 min ago', '5 min ago', '8 min ago', '12 min ago']

    // Show first notification after 15 seconds
    const initialDelay = setTimeout(() => {
      const buyer = buyers[Math.floor(Math.random() * buyers.length)]
      const time = times[Math.floor(Math.random() * times.length)]
      setSocialProof({ ...buyer, time })
      setTimeout(() => setSocialProof(null), 3000)
    }, 15000)

    // Then show every 45-75 seconds (less frequent)
    const interval = setInterval(() => {
      const buyer = buyers[Math.floor(Math.random() * buyers.length)]
      const time = times[Math.floor(Math.random() * times.length)]
      setSocialProof({ ...buyer, time })
      setTimeout(() => setSocialProof(null), 3000)
    }, 45000 + Math.random() * 30000)

    return () => {
      clearTimeout(initialDelay)
      clearInterval(interval)
    }
  }, [])

  // Check for saved gift on mount & handle reset parameter
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get('reset') === 'true') {
      localStorage.removeItem('blackFridayGift')
      setSelectedGift(null)
      window.history.replaceState({}, '', window.location.pathname)
      return
    }

    const savedGift = localStorage.getItem('blackFridayGift')
    if (savedGift) {
      setSelectedGift({ id: savedGift })
    }
  }, [])

  // Handle spin complete
  const handleSpinComplete = (gift: any) => {
    setSelectedGift(gift)
    setShowSpinWheel(false)
    triggerHaptic('success')
    setTimeout(() => {
      scrollToCTA()
    }, 500)
  }

  // Scroll to CTA
  const scrollToCTA = () => {
    const ctaElement = document.getElementById('cta-section')
    ctaElement?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  // Handle video play button click
  const handlePlayVideo = () => {
    if (videoRef.current) {
      videoRef.current.play()
      setIsVideoPlaying(true)
    }
  }

  // Handle spin button click with haptic
  const handleSpinClick = () => {
    triggerHaptic('medium')
    setShowSpinWheel(true)
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Social Proof Toast Notification */}
      {socialProof && (
        <div
          className="fixed bottom-20 sm:bottom-6 left-3 sm:left-6 z-[9999] animate-slide-up"
          style={{ animation: 'slideUp 0.4s ease-out' }}
        >
          <div className="flex items-center gap-3 bg-white rounded-xl p-3 pr-5 shadow-2xl border border-gray-100 max-w-[320px]">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-gray-900 font-bold text-sm truncate">{socialProof.name}</p>
              <p className="text-gray-500 text-xs">purchased from {socialProof.location}</p>
              <p className="text-emerald-600 text-[10px] font-semibold mt-0.5">{socialProof.time}</p>
            </div>
          </div>
        </div>
      )}
      <style jsx>{`
        @keyframes slideUp {
          from { transform: translateY(100px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>

      {/* ================================================================
          STICKY HEADER - Premium & Mobile Optimized
          ================================================================ */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-navy-deep/95 backdrop-blur-md border-b border-gold-premium/20">
        <div className="w-full px-2 sm:px-4 py-2 sm:py-3">
          <div className="flex items-center justify-between">
            {/* Left: Timer + Urgency */}
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-1.5 text-gold-premium text-xs font-mono bg-gold-premium/10 px-2.5 py-1.5 rounded-full border border-gold-premium/30">
                <Clock className="w-3.5 h-3.5" />
                <span>
                  {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
                </span>
              </div>
              <div className="bg-gold-premium/10 backdrop-blur-sm border border-gold-premium/30 px-2 sm:px-3 py-1.5 rounded-full">
                <span className="text-gold-premium font-bold text-[10px] sm:text-xs flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span className="hidden sm:inline">FINAL HOURS:</span> Only 13 Spots Left
                </span>
              </div>
            </div>

            {/* CTA Button */}
            <button
              onClick={handleSpinClick}
              className="bg-gradient-to-r from-gold-premium to-gold-dark text-navy-deep px-3 sm:px-5 py-2 rounded-lg font-black text-xs sm:text-sm hover:scale-105 active:scale-95 transition-transform shadow-lg"
            >
              <Gift className="w-3.5 h-3.5 inline mr-1" />
              $47.81 - Spin To Win
            </button>
          </div>
        </div>
      </header>

      {/* Spacer for fixed header */}
      <div className="h-12 sm:h-14" />

      {/* ================================================================
          1. UNIFIED HERO SECTION - Premium Design
          ================================================================ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-navy-deep via-navy-rich to-black text-white py-8 sm:py-12 md:py-20">
        {/* Refined Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(212, 175, 55, 0.3) 1px, transparent 0)',
            backgroundSize: '32px 32px'
          }} />
          <div className="absolute top-0 left-0 w-48 sm:w-64 h-48 sm:h-64 bg-gold-premium rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-48 sm:w-64 h-48 sm:h-64 bg-emerald-400 rounded-full blur-3xl"></div>
        </div>

        <div className="w-full px-3 sm:px-6 relative z-10">
          {/* Hero Text */}
          <div className="max-w-4xl mx-auto text-center mb-6 sm:mb-10 md:mb-14">
            {/* Social Proof Badge - Compact */}
            <div className="mb-4 sm:mb-6 inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-3 py-1.5 sm:px-4 sm:py-2">
              <div className="flex -space-x-1.5">
                <div className="w-4 h-4 sm:w-6 sm:h-6 rounded-full bg-gradient-to-br from-gold-premium to-gold-light border border-navy-deep"></div>
                <div className="w-4 h-4 sm:w-6 sm:h-6 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 border border-navy-deep"></div>
                <div className="w-4 h-4 sm:w-6 sm:h-6 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 border border-navy-deep"></div>
              </div>
              <span className="text-white/90 text-xs sm:text-sm font-semibold">847+ agents inside</span>
              <span className="text-white/30 hidden sm:inline">•</span>
              <div className="hidden sm:flex items-center gap-1">
                <Star className="w-3 h-3 text-gold-premium fill-gold-premium" />
                <span className="text-white/90 text-sm font-semibold">4.9/5</span>
              </div>
            </div>

            {/* Main Headline - Mobile First */}
            <h1 className="text-[26px] sm:text-4xl md:text-5xl lg:text-6xl font-black mb-4 sm:mb-6 leading-[1.1] tracking-tight px-1">
              <span className="text-white">Turn Your Image Into</span>
              <br />
              <span className="bg-gradient-to-r from-gold-premium via-gold-light to-gold-premium bg-clip-text text-transparent">
                Talking AI Videos
              </span>
              <br />
              <span className="text-white">In Just </span>
              <span className="bg-gradient-to-r from-gold-premium via-gold-light to-gold-premium bg-clip-text text-transparent">
                7 Minutes
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-sm sm:text-lg md:text-xl text-gray-300 mb-3 sm:mb-4 px-2">
              No camera. No editing. No tech skills.
              <br />
              <span className="text-gold-light font-semibold">
                Real estate agents are using AI to get 3x more luxury listings
              </span>
            </p>

            {/* Trust Elements - Compact */}
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-[10px] sm:text-xs text-white/60 mb-4 sm:mb-6">
              <div className="flex items-center gap-1">
                <Shield className="w-3 h-3 text-gold-premium" />
                <span>30-day + $50 back</span>
              </div>
              <div className="flex items-center gap-1">
                <Zap className="w-3 h-3 text-gold-premium" />
                <span>Instant access</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-gold-premium" />
                <span>7 minutes</span>
              </div>
            </div>
          </div>

          {/* Spin Wheel CTA */}
          <div className="max-w-3xl mx-auto">
            {selectedGift ? (
              /* Already Spun - Show Bonus Secured */
              <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl border-2 sm:border-4 border-gold-premium shadow-2xl">
                <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-3xl sm:text-4xl md:text-5xl">{selectedGift.emoji || '🎁'}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-black text-lg sm:text-xl md:text-2xl mb-1 sm:mb-2 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6" />
                      BONUS SECURED!
                    </p>
                    <p className="text-white/90 text-xs sm:text-sm md:text-base truncate">
                      {selectedGift.name || selectedGift.shortName || 'Ultimate Custom Bundle'} {selectedGift.value ? `(${selectedGift.value})` : '($1,847)'}
                    </p>
                  </div>
                </div>
                <p className="text-white/80 text-xs sm:text-sm md:text-base text-center">
                  Complete your purchase below to claim this exclusive bonus ↓
                </p>
                {/* Reset Button for Testing */}
                <button
                  onClick={() => {
                    localStorage.removeItem('blackFridayGift')
                    setSelectedGift(null)
                  }}
                  className="mt-3 sm:mt-4 mx-auto block text-white/50 hover:text-white text-[10px] sm:text-xs underline"
                >
                  🔄 Reset Spin (Testing)
                </button>
              </div>
            ) : (
              /* Not Spun Yet - Show Spin Wheel CTA */
              <div className="bg-gradient-to-br from-navy-deep via-navy-rich to-black border-2 sm:border-4 border-gold-premium rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8">
                {/* FREE Badge */}
                <div className="flex justify-center mb-3 sm:mb-4">
                  <div className="bg-gold-premium/10 backdrop-blur-sm border border-gold-premium/30 text-gold-premium px-3 sm:px-5 py-1.5 sm:py-2 rounded-full font-bold text-[10px] sm:text-xs uppercase tracking-wide shadow-lg flex items-center gap-1.5 sm:gap-2">
                    <Gift className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    FREE 1 SPIN • LIMITED TIME
                  </div>
                </div>

                {/* Headline */}
                <h2 className="text-xl sm:text-2xl md:text-4xl font-black text-center mb-2 sm:mb-3 leading-tight">
                  <span className="bg-gradient-to-r from-gold-premium via-gold-light to-gold-premium bg-clip-text text-transparent">
                    You Have 1 FREE Spin<br className="hidden sm:block" /> Waiting For You!
                  </span>
                </h2>

                {/* Value Proposition */}
                <p className="text-white/90 text-center text-xs sm:text-sm md:text-base mb-4 sm:mb-6">
                  Win <span className="text-gold-premium font-bold">exclusive bonuses worth up to $1,634</span> instantly!
                  <br />
                  <span className="text-white/70 text-[10px] sm:text-xs flex items-center justify-center gap-1 sm:gap-1.5 mt-1">
                    <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    100% Win Rate • Everyone Gets Premium Bonuses
                  </span>
                </p>

                {/* VISUAL SPIN WHEEL PREVIEW - Compact for Mobile */}
                <div className="relative w-36 h-36 sm:w-48 sm:h-48 md:w-56 md:h-56 mx-auto mb-4 sm:mb-6">
                  {/* Refined Glow Rings */}
                  <div className="absolute inset-0 rounded-full border-2 border-gold-premium/30"></div>
                  <div className="absolute inset-[-4px] sm:inset-[-6px] rounded-full border-2 border-gold-premium/20"></div>
                  <div className="absolute inset-[-8px] sm:inset-[-12px] rounded-full border-2 border-gold-premium/10"></div>

                  {/* Pointer Arrow */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-3 sm:-translate-y-4 z-20">
                    <div className="relative">
                      <div className="w-0 h-0 border-l-[12px] sm:border-l-[18px] border-l-transparent border-r-[12px] sm:border-r-[18px] border-r-transparent border-t-[24px] sm:border-t-[36px] border-t-gold-premium drop-shadow-2xl"></div>
                    </div>
                  </div>

                  {/* Spinning Wheel */}
                  <div className="absolute inset-0 animate-spin-slow">
                    <svg viewBox="0 0 200 200" className="w-full h-full" style={{ filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.3))' }}>
                      <defs>
                        <radialGradient id="redGrad" cx="50%" cy="50%">
                          <stop offset="0%" stopColor="#FF4060" stopOpacity="0.9"/>
                          <stop offset="60%" stopColor="#FF0040" />
                          <stop offset="100%" stopColor="#CC0033" />
                        </radialGradient>
                        <radialGradient id="goldGrad" cx="50%" cy="50%">
                          <stop offset="0%" stopColor="#FFD700" stopOpacity="0.9"/>
                          <stop offset="60%" stopColor="#FDB813" />
                          <stop offset="100%" stopColor="#D4A900" />
                        </radialGradient>
                        <radialGradient id="silverGrad" cx="50%" cy="50%">
                          <stop offset="0%" stopColor="#E8E8E8" stopOpacity="0.9"/>
                          <stop offset="60%" stopColor="#C0C0C0" />
                          <stop offset="100%" stopColor="#A0A0A0" />
                        </radialGradient>
                        <radialGradient id="centerGrad" cx="50%" cy="40%">
                          <stop offset="0%" stopColor="#FFD700" />
                          <stop offset="50%" stopColor="#D4AF37" />
                          <stop offset="100%" stopColor="#B8941E" />
                        </radialGradient>
                      </defs>

                      {/* Outer Ring */}
                      <circle cx="100" cy="100" r="98" fill="none" stroke="url(#centerGrad)" strokeWidth="5"/>

                      {/* Wheel Segments */}
                      <path d="M 100 100 L 100 2 A 98 98 0 0 1 169.7 30.3 Z" fill="url(#redGrad)" stroke="#ffffff" strokeWidth="2.5"/>
                      <path d="M 100 100 L 169.7 30.3 A 98 98 0 0 1 198 100 Z" fill="url(#goldGrad)" stroke="#ffffff" strokeWidth="2.5"/>
                      <path d="M 100 100 L 30.3 169.7 A 98 98 0 0 1 2 100 Z" fill="url(#goldGrad)" stroke="#ffffff" strokeWidth="2.5"/>
                      <path d="M 100 100 L 169.7 169.7 A 98 98 0 0 1 100 198 Z" fill="url(#goldGrad)" stroke="#ffffff" strokeWidth="2.5"/>
                      <path d="M 100 100 L 30.3 30.3 A 98 98 0 0 1 2 100 Z" fill="url(#silverGrad)" stroke="#ffffff" strokeWidth="2.5"/>
                      <path d="M 100 100 L 198 100 A 98 98 0 0 1 169.7 169.7 Z" fill="url(#silverGrad)" stroke="#ffffff" strokeWidth="2.5"/>
                      <path d="M 100 100 L 100 198 A 98 98 0 0 1 30.3 169.7 Z" fill="url(#silverGrad)" stroke="#ffffff" strokeWidth="2.5"/>
                      <path d="M 100 100 L 2 100 A 98 98 0 0 1 30.3 30.3 Z" fill="url(#silverGrad)" stroke="#ffffff" strokeWidth="2.5"/>
                      <path d="M 100 100 L 100 2 A 98 98 0 0 0 30.3 30.3 Z" fill="url(#silverGrad)" stroke="#ffffff" strokeWidth="2.5"/>

                      {/* Center Button */}
                      <circle cx="100" cy="100" r="28" fill="url(#centerGrad)" stroke="#ffffff" strokeWidth="4"/>
                      <text x="100" y="107" textAnchor="middle" fill="#0a1128" fontSize="18" fontWeight="900">SPIN</text>
                    </svg>
                  </div>

                  {/* Glow Effects */}
                  <div className="absolute inset-0 bg-gold-premium rounded-full blur-2xl opacity-15"></div>
                </div>

                {/* CTA Button */}
                <button
                  onClick={handleSpinClick}
                  className="group relative w-full bg-gradient-to-r from-gold-premium via-gold-light to-gold-premium text-navy-deep px-6 sm:px-8 py-3.5 sm:py-4 md:py-5 rounded-xl sm:rounded-2xl font-black text-base sm:text-xl md:text-2xl hover:scale-105 active:scale-95 transition-all shadow-2xl border-2 sm:border-4 border-white/50 overflow-hidden mb-3 sm:mb-4"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                  <span className="relative flex items-center justify-center gap-2">
                    <Gift className="w-5 h-5 sm:w-6 sm:h-6" />
                    CLAIM MY FREE SPIN NOW
                    <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
                  </span>
                </button>

                {/* Urgency + Trust */}
                <div className="space-y-1 text-center">
                  <p className="text-white/80 text-[10px] sm:text-xs md:text-sm flex items-center justify-center gap-1 sm:gap-1.5">
                    <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    <span className="text-gold-premium font-bold">ONE-TIME ONLY</span> • Everyone wins guaranteed
                  </p>
                  <p className="text-gold-light text-[10px] sm:text-xs flex items-center justify-center gap-1 sm:gap-1.5">
                    <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    No email required • Instant reveal • Secure your bonus
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* What is AgentClone? - Collapsible */}
          <div className="max-w-xl mx-auto mt-6 sm:mt-8">
            <button
              onClick={() => setShowWhatIs(!showWhatIs)}
              className="group flex items-center justify-center gap-2 mx-auto text-[11px] sm:text-sm"
            >
              <span className="text-gold-premium font-medium border-b border-dashed border-gold-premium/40 group-hover:border-gold-premium transition-colors animate-pulse">
                What is the AgentClone System?
              </span>
              <ChevronDown className={`w-3.5 h-3.5 sm:w-4 sm:h-4 text-gold-premium transition-transform duration-300 ${showWhatIs ? 'rotate-180' : ''}`} />
            </button>

            <div className={`overflow-hidden transition-all duration-500 ease-out ${showWhatIs ? 'max-h-[600px] opacity-100 mt-4' : 'max-h-0 opacity-0 mt-0'}`}>
              <div className="bg-gradient-to-br from-gold-premium/10 to-white/5 backdrop-blur-sm border border-gold-premium/20 rounded-xl p-4 sm:p-5">
                <p className="text-white text-xs sm:text-sm leading-relaxed mb-3">
                  You upload <span className="text-gold-premium font-bold">one clear selfie</span> to a free AI software — the #1 tool for generating realistic talking videos in {new Date().getFullYear()}.
                </p>
                <p className="text-white/80 text-xs sm:text-sm leading-relaxed mb-3">
                  The AI transforms your photo into a <span className="text-gold-premium font-bold">talking video of YOU</span> — your face moves, your lips sync perfectly, it looks 100% real. No filming. No editing. No experience needed.
                </p>
                <p className="text-white/80 text-xs sm:text-sm leading-relaxed">
                  Inside the AgentClone System, you get the <span className="text-white font-bold">complete A-to-Z video course</span> that shows you exactly how to do this — even if you've never touched AI before. Just follow along, copy-paste, and create professional videos that help you scale to 7 figures.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Spin Wheel Modal - Only render when opened (dynamic import loads on demand) */}
      {showSpinWheel && (
        <SpinWheel
          isOpen={showSpinWheel}
          onClose={() => setShowSpinWheel(false)}
          onSpinComplete={handleSpinComplete}
        />
      )}

      {/* ================================================================
          2. BLACK FRIDAY COUNTDOWN SECTION
          ================================================================ */}
      <section className="bg-gradient-to-r from-gold-light to-white py-8 sm:py-12 border-y-4 border-gold-premium">
        <div className="container mx-auto px-4">
          <CountdownTimer endDate={getBlackFridayEnd()} />
        </div>
      </section>

      {/* CTA After Countdown */}
      <section className="py-6 sm:py-8 md:py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <button
              onClick={handleSpinClick}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-gold-premium to-gold-dark text-white px-6 sm:px-8 md:px-10 py-3.5 sm:py-4 md:py-5 rounded-xl font-bold text-base sm:text-lg md:text-xl hover:scale-105 active:scale-95 transition-transform shadow-2xl w-full sm:w-auto"
            >
              <Gift className="w-5 h-5 sm:w-6 sm:h-6" />
              <span>Unlock Your Bonus - Spin Now</span>
              <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <p className="text-[10px] sm:text-xs md:text-sm text-gray-500 mt-2 sm:mt-3">
              Limited time offer - expires at midnight
            </p>
          </div>
        </div>
      </section>

      {/* ================================================================
          4. HOW IT WORKS - 3 Simple Steps (Redesigned for Scannability)
          ================================================================ */}
      <section className="py-10 sm:py-14 md:py-20 bg-gradient-to-b from-navy-deep via-navy-rich to-navy-deep text-white">
        <div className="w-full px-3 sm:px-6">
          <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8 sm:mb-12">
              <div className="inline-flex items-center gap-2 bg-gold-premium/10 border border-gold-premium/30 rounded-full px-4 py-2 mb-4">
                <Zap className="w-4 h-4 text-gold-premium" />
                <span className="text-gold-premium font-bold text-xs sm:text-sm uppercase tracking-wide">Quick Start Guide</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black mb-3">
                Create Videos in <span className="text-gold-premium">3 Steps</span>
              </h2>
              <p className="text-sm sm:text-lg text-gray-400 max-w-xl mx-auto">No filming. No editing. No experience needed.</p>
            </div>

            {/* Steps - Card Based Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
              {/* Step 1 */}
              <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-5 sm:p-6 border border-white/10 hover:border-gold-premium/50 transition-all group">
                {/* Step Number Badge */}
                <div className="absolute -top-3 -left-2 sm:-top-4 sm:-left-3 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-gold-premium to-gold-dark rounded-xl flex items-center justify-center shadow-lg shadow-gold-premium/30">
                  <span className="text-navy-deep font-black text-lg sm:text-xl">1</span>
                </div>

                {/* Time Badge */}
                <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-emerald-500/20 text-emerald-400 px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold">
                  1 min
                </div>

                {/* Icon */}
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-gold-premium/20 to-gold-premium/5 rounded-xl flex items-center justify-center mb-4 mt-2 group-hover:scale-110 transition-transform">
                  <Upload className="w-7 h-7 sm:w-8 sm:h-8 text-gold-premium" />
                </div>

                {/* Content */}
                <h3 className="text-lg sm:text-xl font-black text-white mb-2">Upload Photo</h3>
                <p className="text-sm text-gray-400 leading-relaxed">Any headshot works. Selfie, LinkedIn photo, or professional shot.</p>
              </div>

              {/* Step 2 */}
              <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-5 sm:p-6 border border-white/10 hover:border-gold-premium/50 transition-all group">
                {/* Step Number Badge */}
                <div className="absolute -top-3 -left-2 sm:-top-4 sm:-left-3 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-gold-premium to-gold-dark rounded-xl flex items-center justify-center shadow-lg shadow-gold-premium/30">
                  <span className="text-navy-deep font-black text-lg sm:text-xl">2</span>
                </div>

                {/* Time Badge */}
                <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-emerald-500/20 text-emerald-400 px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold">
                  2 min
                </div>

                {/* Icon */}
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-gold-premium/20 to-gold-premium/5 rounded-xl flex items-center justify-center mb-4 mt-2 group-hover:scale-110 transition-transform">
                  <Video className="w-7 h-7 sm:w-8 sm:h-8 text-gold-premium" />
                </div>

                {/* Content */}
                <h3 className="text-lg sm:text-xl font-black text-white mb-2">Type Script</h3>
                <p className="text-sm text-gray-400 leading-relaxed">Write your message or pick from 50+ ready-made templates.</p>
              </div>

              {/* Step 3 */}
              <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-5 sm:p-6 border border-white/10 hover:border-gold-premium/50 transition-all group">
                {/* Step Number Badge */}
                <div className="absolute -top-3 -left-2 sm:-top-4 sm:-left-3 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-gold-premium to-gold-dark rounded-xl flex items-center justify-center shadow-lg shadow-gold-premium/30">
                  <span className="text-navy-deep font-black text-lg sm:text-xl">3</span>
                </div>

                {/* Time Badge */}
                <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-emerald-500/20 text-emerald-400 px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold">
                  4 min
                </div>

                {/* Icon */}
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-gold-premium/20 to-gold-premium/5 rounded-xl flex items-center justify-center mb-4 mt-2 group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-7 h-7 sm:w-8 sm:h-8 text-gold-premium" />
                </div>

                {/* Content */}
                <h3 className="text-lg sm:text-xl font-black text-white mb-2">Get Video</h3>
                <p className="text-sm text-gray-400 leading-relaxed">AI generates your video. Download, post, and watch leads come in.</p>
              </div>
            </div>

            {/* Total Time + CTA Row */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
              {/* Total Time Badge */}
              <div className="flex items-center gap-3 bg-gradient-to-r from-emerald-500/20 to-emerald-500/10 border border-emerald-500/30 rounded-full px-5 sm:px-6 py-3">
                <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400" />
                <div>
                  <span className="text-emerald-400 font-black text-xl sm:text-2xl">7 min</span>
                  <span className="text-gray-400 text-sm sm:text-base ml-2">total</span>
                </div>
              </div>

              {/* Arrow */}
              <ArrowRight className="w-5 h-5 text-gray-600 hidden sm:block" />

              {/* Result Badge */}
              <div className="flex items-center gap-3 bg-gradient-to-r from-gold-premium/20 to-gold-premium/10 border border-gold-premium/30 rounded-full px-5 sm:px-6 py-3">
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-gold-premium" />
                <div>
                  <span className="text-gold-premium font-black text-xl sm:text-2xl">50+</span>
                  <span className="text-gray-400 text-sm sm:text-base ml-2">videos ready</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          5. MEET YOUR INSTRUCTOR - Sara Cohen
          ================================================================ */}
      <section className="py-8 sm:py-12 md:py-16 bg-navy-deep">
        <div className="w-full px-3 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-6 sm:mb-10">
              <div className="inline-flex items-center gap-2 bg-gold-premium/10 border border-gold-premium/30 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full mb-3 sm:mb-4">
                <Award className="w-4 h-4 text-gold-premium" />
                <span className="text-gold-premium font-bold text-xs tracking-wider">MEET YOUR INSTRUCTOR</span>
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-black mb-3 px-4 text-white">
                Who Am I & <span className="text-gold-premium">Why Should You Listen?</span>
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-5 sm:gap-8 mb-6 sm:mb-8">
              <div className="relative w-full aspect-[4/5] max-w-[300px] sm:max-w-sm mx-auto rounded-2xl overflow-hidden border-2 border-gold-premium/30 shadow-2xl shadow-gold-premium/20">
                <Image src="/images/Sara 61kb.webp" alt="Sara - Your Instructor" fill sizes="(max-width: 768px) 300px, 384px" className="object-cover object-top" priority />
              </div>

              <div className="space-y-4 sm:space-y-5">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold mb-3 text-gold-premium">I Was You</h3>
                  <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
                    8 years grinding as a luxury agent in Dubai. $127M+ in sales. But I was exhausted. Filming content felt like a second job. I looked for a better way.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl sm:text-2xl font-bold mb-3 text-gold-premium">Then I Found AI Video</h3>
                  <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
                    One photo. 50 videos. In minutes. My social media exploded. More leads. More listings. More commissions. All while working LESS.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl sm:text-2xl font-bold mb-3 text-gold-premium">Now I'm Sharing Everything</h3>
                  <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
                    847+ agents have joined. The results speak for themselves. This isn't theory — it's the exact system I use daily.
                  </p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              {[
                { value: "$127M+", label: "Career Sales" },
                { value: "8 Years", label: "Experience" },
                { value: "847+", label: "Agents Helped" },
                { value: "4.9/5", label: "Avg Rating" }
              ].map((stat, i) => (
                <div key={i} className="bg-navy-rich/30 border border-gold-premium/20 rounded-xl p-3 sm:p-4 text-center">
                  <div className="text-2xl sm:text-3xl font-black text-gold-premium mb-2">{stat.value}</div>
                  <div className="text-xs sm:text-sm text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          6. MR. LUCAS CASE STUDY - Premium Visual Proof
          ================================================================ */}
      <section className="py-8 sm:py-12 md:py-20 bg-gradient-to-b from-white via-gray-50 to-white relative overflow-hidden">
        <div className="container mx-auto px-3 sm:px-4">
          {/* MR LUCAS VIDEO + CASE STUDY */}
          <div className="bg-gradient-to-br from-purple-900/30 via-navy-rich to-black rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 border-2 border-purple-500/50 shadow-2xl mx-auto max-w-4xl">
            <div className="text-center mb-4 sm:mb-6">
              <div className="inline-flex items-center gap-2 bg-purple-500/20 backdrop-blur-sm border border-purple-400/40 rounded-full px-3 sm:px-5 py-1.5 sm:py-2 mb-3 sm:mb-4">
                <PlayCircle className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
                <span className="text-purple-300 font-bold text-[10px] sm:text-sm uppercase tracking-widest">Verified Case Study</span>
              </div>
              <h2 className="text-lg sm:text-2xl md:text-4xl font-black text-white mb-2 sm:mb-3 leading-tight px-2">
                Watch The <span className="text-purple-400">Exact Video</span> We Created<br className="hidden sm:block" />
                That Got Mr. Lucas <span className="text-emerald-400">3 Paid Clients</span> In 7 Days
              </h2>
              <p className="text-white/90 text-xs sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
                This isn't a testimonial. This is the <span className="text-emerald-400 font-bold">actual AI video</span> we delivered to him.
              </p>
            </div>

            {/* BEFORE/AFTER TRANSFORMATION */}
            <div className="relative w-full max-w-3xl mx-auto mb-4 sm:mb-6">
              <div className="grid grid-cols-2 gap-2 sm:gap-4 md:gap-6">
                {/* BEFORE - Original Photo */}
                <div className="relative">
                  <div className="absolute -top-2 sm:-top-3 left-1/2 -translate-x-1/2 z-10">
                    <span className="bg-gray-600 text-white px-2 py-0.5 sm:px-4 sm:py-1.5 rounded-full text-[10px] sm:text-sm font-black uppercase shadow-lg">
                      📷 Before
                    </span>
                  </div>
                  <div className="relative aspect-[9/16] rounded-lg sm:rounded-xl overflow-hidden border-2 border-gray-500/50 shadow-xl bg-gray-900">
                    <Image
                      src="/images/lucas-photo.webp"
                      alt="Mr. Lucas original photo"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2 sm:p-4">
                      <p className="text-white/90 text-[10px] sm:text-sm font-semibold text-center">Just a regular photo</p>
                    </div>
                  </div>
                </div>

                {/* AFTER - AI Video */}
                <div className="relative group">
                  <div className="absolute -top-2 sm:-top-3 left-1/2 -translate-x-1/2 z-10">
                    <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-0.5 sm:px-4 sm:py-1.5 rounded-full text-[10px] sm:text-sm font-black uppercase shadow-lg animate-pulse">
                      🎬 After
                    </span>
                  </div>
                  <div className="relative aspect-[9/16] rounded-lg sm:rounded-xl overflow-hidden border-2 border-purple-500/50 shadow-xl shadow-purple-500/20 bg-gray-900">
                    <video
                      ref={videoRef}
                      className="w-full h-full object-cover"
                      preload="metadata"
                      playsInline
                      poster="/images/lucas-photo.webp"
                      onPlay={() => setIsVideoPlaying(true)}
                      onPause={() => setIsVideoPlaying(false)}
                      onEnded={() => setIsVideoPlaying(false)}
                      controls
                    >
                      <source src="/videos/Mr Lucas.mp4" type="video/mp4" />
                    </video>

                    {/* Play button overlay */}
                    {!isVideoPlaying && (
                      <div
                        onClick={handlePlayVideo}
                        className="absolute inset-0 flex items-center justify-center bg-black/40 cursor-pointer transition-all group-hover:bg-black/50"
                      >
                        <div className="relative">
                          <div className="absolute inset-0 rounded-full bg-purple-500/30 animate-ping" />
                          <div className="relative flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 shadow-xl group-hover:scale-110 transition-transform">
                            <Play className="w-5 h-5 sm:w-7 sm:h-7 md:w-10 md:h-10 text-white fill-white ml-0.5" />
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2 sm:p-4">
                      <p className="text-white/90 text-[10px] sm:text-sm font-semibold text-center">AI talking video!</p>
                    </div>
                  </div>

                  {/* Results badge */}
                  <div className="absolute -bottom-1 -right-1 sm:-bottom-3 sm:-right-3 bg-emerald-500 text-white px-1.5 py-0.5 sm:px-3 sm:py-1.5 rounded-full shadow-xl border-2 border-white z-10">
                    <p className="font-black text-[8px] sm:text-xs uppercase">$12K Result</p>
                  </div>
                </div>
              </div>

              {/* Arrow in middle */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-full p-1.5 sm:p-2 md:p-3 shadow-xl border-2 border-white">
                  <ArrowRight className="w-3 h-3 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
                </div>
              </div>

              {/* Transformation label */}
              <div className="text-center mt-3 sm:mt-4">
                <p className="text-purple-300 text-[10px] sm:text-sm md:text-base font-bold">
                  ✨ 1 Photo → Professional AI Video in 7 Minutes
                </p>
              </div>
            </div>

            {/* RESULTS HIGHLIGHT */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4 sm:mb-6">
              {[
                { value: '3', label: 'Listing Appointments', sub: 'In first 7 days' },
                { value: '18hrs', label: 'Delivery Time', sub: 'Under 24hr guarantee' },
                { value: '$12K+', label: 'Commission Generated', sub: 'From ONE video', highlight: true }
              ].map((stat, i) => (
                <div key={i} className="bg-white/5 backdrop-blur-sm rounded-lg p-2 sm:p-4 text-center border border-purple-400/20 hover:border-purple-400/40 transition-all">
                  <div className={`text-xl sm:text-3xl md:text-4xl font-black mb-0.5 sm:mb-1 ${stat.highlight ? 'text-emerald-400' : 'text-purple-400'}`}>{stat.value}</div>
                  <div className="text-white/80 text-[9px] sm:text-sm font-semibold">{stat.label}</div>
                  <div className="text-white/50 text-[8px] sm:text-xs mt-0.5">{stat.sub}</div>
                </div>
              ))}
            </div>

            {/* PSYCHOLOGICAL TRIGGER */}
            <div className="bg-gradient-to-r from-gold-premium/20 to-yellow-500/20 border border-gold-premium/40 rounded-lg p-3 sm:p-4">
              <p className="text-white/90 text-center text-[10px] sm:text-sm md:text-base">
                <span className="font-black text-gold-premium">Think about it:</span> While you're learning editing software,
                <span className="text-emerald-400 font-bold"> other agents are already booking appointments with videos like this.</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA After Case Study */}
      <section className="py-6 sm:py-8 md:py-12 bg-gradient-to-r from-emerald-500/5 to-emerald-500/10">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <button
              onClick={handleSpinClick}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-6 sm:px-8 md:px-10 py-3.5 sm:py-4 md:py-5 rounded-xl font-bold text-base sm:text-lg md:text-xl hover:scale-105 active:scale-95 transition-transform shadow-2xl w-full sm:w-auto"
            >
              <Gift className="w-5 h-5 sm:w-6 sm:h-6" />
              <span>Start Your Transformation Now</span>
              <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <p className="text-[10px] sm:text-xs md:text-sm text-gray-500 mt-2 sm:mt-3">
              Join 847+ agents who transformed their business
            </p>
          </div>
        </div>
      </section>

      {/* ================================================================
          6.5 PREMIUM TESTIMONIALS - Real Agent Success Stories
          ================================================================ */}
      <section className="py-10 sm:py-14 md:py-20 bg-gradient-to-b from-white via-gray-50 to-white relative overflow-hidden">
        <div className="container mx-auto px-3 sm:px-4">
          {/* Section Header */}
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-4 py-1.5 rounded-full mb-4">
              <Users className="w-4 h-4 text-emerald-600" />
              <span className="text-emerald-700 font-bold text-xs uppercase tracking-wider">847+ Success Stories</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-navy-deep mb-3 px-2">
              Real Agents. <span className="text-emerald-600">Real Results.</span>
            </h2>
            <p className="text-gray-600 text-sm sm:text-base md:text-lg max-w-2xl mx-auto">
              See what happens when agents discover the 7-Minute AgentClone system
            </p>
          </div>

          {/* Stats Bar */}
          <div className="flex flex-wrap justify-center gap-4 sm:gap-8 mb-8 sm:mb-10">
            {[
              { value: '847+', label: 'Happy Agents' },
              { value: '4.9/5', label: 'Average Rating' },
              { value: '40+', label: 'Countries' },
            ].map((stat, i) => (
              <div key={i} className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-md border border-gray-100">
                <span className="text-lg sm:text-xl font-black text-emerald-600">{stat.value}</span>
                <span className="text-xs sm:text-sm text-gray-600">{stat.label}</span>
              </div>
            ))}
          </div>

          {/* Testimonials Grid */}
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
              {(showAllTestimonials ? testimonials : testimonials.slice(0, 6)).map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-emerald-200"
                >
                  {/* Before/After Image */}
                  <div className="relative aspect-video overflow-hidden">
                    <Image
                      src={testimonial.image}
                      alt={`${testimonial.name} - AI Video Result`}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    {/* Results badge */}
                    <div className="absolute top-3 right-3 bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                      {testimonial.results}
                    </div>

                    {/* Verified badge */}
                    {testimonial.verified && (
                      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-emerald-700 px-2 py-1 rounded-full text-[10px] font-bold flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Verified
                      </div>
                    )}

                    {/* Name overlay at bottom */}
                    <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
                      <div className="flex items-center gap-3">
                        <div>
                          <h4 className="font-bold text-white text-sm sm:text-base">{testimonial.name}</h4>
                          <div className="flex items-center gap-1.5 text-white/80 text-xs">
                            <MapPin className="w-3 h-3" />
                            <span>{testimonial.location}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 sm:p-5">
                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>

                    {/* Role */}
                    <p className="text-xs text-emerald-600 font-semibold mb-2">{testimonial.role}</p>

                    {/* Review */}
                    <div className="relative">
                      <Quote className="absolute -top-1 -left-1 w-6 h-6 text-gray-200" />
                      <p className="text-gray-700 text-sm leading-relaxed pl-4">
                        {testimonial.review}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Show More/Less Button */}
            {testimonials.length > 6 && (
              <div className="text-center mt-8 sm:mt-10">
                <button
                  onClick={() => setShowAllTestimonials(!showAllTestimonials)}
                  className="group inline-flex items-center gap-2 bg-navy-deep text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-sm sm:text-base hover:bg-navy-rich transition-all shadow-lg hover:shadow-xl"
                >
                  {showAllTestimonials ? (
                    <>
                      <span>Show Less</span>
                      <ChevronDown className="w-5 h-5 rotate-180 transition-transform" />
                    </>
                  ) : (
                    <>
                      <span>See All {testimonials.length} Success Stories</span>
                      <ChevronDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
                    </>
                  )}
                </button>
                <p className="text-gray-500 text-xs mt-3">
                  Join {testimonials.length}+ agents who transformed their business
                </p>
              </div>
            )}
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 mt-10 sm:mt-12 pt-8 border-t border-gray-200">
            <div className="flex items-center gap-2 text-gray-600">
              <Shield className="w-5 h-5 text-emerald-600" />
              <span className="text-xs sm:text-sm font-medium">All Reviews Verified</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              <span className="text-xs sm:text-sm font-medium">Real Agent Results</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              <span className="text-xs sm:text-sm font-medium">Documented Success</span>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          7. PRICING COMPARISON (Old vs DIY vs Smart Way)
          ================================================================ */}
      <section className="py-8 sm:py-12 md:py-16 bg-gradient-to-br from-navy-deep via-navy-rich to-navy-deep text-white">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center mb-6 sm:mb-8 md:mb-10">
              <h2 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-black mb-2 leading-tight">
                Compare Your <span className="text-gold-premium">Options</span>
              </h2>
              <p className="text-xs sm:text-sm md:text-base text-gray-400">See why 847+ agents chose the smart way</p>
            </div>

            {/* Comparison Grid */}
            <div className="space-y-3 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-3 md:gap-4">
              {/* OLD WAY */}
              <div className="relative bg-gradient-to-br from-gray-800/90 to-gray-900 p-3 sm:p-4 md:p-6 rounded-lg border border-red-500/30">
                <div className="absolute -top-2 -right-2 bg-red-500 text-white px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[9px] sm:text-[10px] font-black uppercase">
                  Expensive
                </div>
                <div className="flex items-start gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-red-500/10 rounded-full flex items-center justify-center">
                    <X className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-red-500" />
                  </div>
                  <div className="flex-1">
                    <div className="text-[9px] sm:text-[10px] font-bold text-red-400 uppercase tracking-wide mb-0.5">Old Way</div>
                    <h3 className="text-sm sm:text-base md:text-lg font-black text-white leading-tight">Hire Videographer</h3>
                  </div>
                </div>
                <div className="bg-red-500/5 rounded-lg p-2 sm:p-3 mb-2 sm:mb-3 border border-red-500/10">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-2xl sm:text-3xl md:text-4xl font-black text-red-400">$500</span>
                    <span className="text-[10px] sm:text-xs text-gray-500">/video</span>
                  </div>
                </div>
                <div className="space-y-1 sm:space-y-1.5 mb-2 sm:mb-3">
                  {['Wait for scheduling', 'Travel to location', 'Expensive equipment', 'Revision fees'].map((item, i) => (
                    <div key={i} className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-gray-400">
                      <X className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-red-500/60 flex-shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-2 sm:pt-3 border-t border-gray-700">
                  <p className="text-center text-[10px] sm:text-xs md:text-sm">
                    <span className="text-gray-500">50 videos =</span>{' '}
                    <span className="font-black text-red-400">$25,000</span>
                  </p>
                </div>
              </div>

              {/* DIY WAY */}
              <div className="relative bg-gradient-to-br from-gray-800/90 to-gray-900 p-3 sm:p-4 md:p-6 rounded-lg border border-gray-600/30">
                <div className="absolute -top-2 -right-2 bg-gray-600 text-white px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[9px] sm:text-[10px] font-black uppercase">
                  Time Sink
                </div>
                <div className="flex items-start gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gray-600/10 rounded-full flex items-center justify-center">
                    <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <div className="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-0.5">DIY Way</div>
                    <h3 className="text-sm sm:text-base md:text-lg font-black text-white leading-tight">Learn Video Editing</h3>
                  </div>
                </div>
                <div className="bg-gray-600/5 rounded-lg p-2 sm:p-3 mb-2 sm:mb-3 border border-gray-600/10">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-300">$3K+</span>
                  </div>
                  <p className="text-center text-[9px] sm:text-[10px] text-gray-500 mt-0.5 sm:mt-1">+ 100+ hours learning</p>
                </div>
                <div className="space-y-1 sm:space-y-1.5 mb-2 sm:mb-3">
                  {['Software subscriptions', 'Online courses', 'Months to learn', 'Still looks amateur'].map((item, i) => (
                    <div key={i} className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-gray-400">
                      <X className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-gray-500/60 flex-shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-2 sm:pt-3 border-t border-gray-700">
                  <p className="text-center text-[10px] sm:text-xs md:text-sm font-bold text-gray-400">
                    Time = Money Lost
                  </p>
                </div>
              </div>

              {/* SMART WAY - Highlighted */}
              <div className="relative bg-gradient-to-br from-emerald-500 to-emerald-600 p-3 sm:p-4 md:p-6 rounded-lg border-2 border-gold-premium shadow-2xl shadow-emerald-500/20 scale-[1.02] sm:scale-105">
                <div className="absolute -top-2 -right-2 bg-gold-premium text-navy-deep px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[9px] sm:text-[10px] font-black uppercase shadow-lg">
                  Best Value
                </div>
                <div className="flex items-start gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <Check className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" strokeWidth={3} />
                  </div>
                  <div className="flex-1">
                    <div className="text-[9px] sm:text-[10px] font-bold text-emerald-100 uppercase tracking-wide mb-0.5">Smart Way</div>
                    <h3 className="text-sm sm:text-base md:text-lg font-black text-white leading-tight">AgentClone AI</h3>
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 sm:p-3 mb-2 sm:mb-3 border border-white/20">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-2xl sm:text-3xl md:text-4xl font-black text-white">$47.81</span>
                  </div>
                  <p className="text-center text-[9px] sm:text-[10px] text-emerald-100 mt-0.5 sm:mt-1 font-semibold">one-time payment</p>
                </div>
                <div className="space-y-1 sm:space-y-1.5 mb-2 sm:mb-3">
                  {['Works in 7 minutes', 'Unlimited videos', 'No skills needed', 'Professional quality'].map((item, i) => (
                    <div key={i} className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-white font-medium">
                      <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-gold-premium flex-shrink-0" strokeWidth={3} />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-2 sm:pt-3 border-t border-white/20">
                  <p className="text-center text-[10px] sm:text-xs md:text-sm">
                    <span className="text-emerald-100">You save:</span>{' '}
                    <span className="font-black text-gold-premium text-sm sm:text-base md:text-lg">$24,963!</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          8. VIP BUNDLE - Everything Included
          ================================================================ */}
      <section className="relative py-6 sm:py-16 md:py-20 bg-navy-deep overflow-hidden">
        {/* Premium Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-navy-deep via-[#0a0a0a] to-navy-deep"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold-premium/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gold-premium/5 rounded-full blur-3xl"></div>

        <div className="relative w-full px-3 sm:px-4">
          <div className="max-w-4xl mx-auto">
            {/* VIP Header */}
            <div className="text-center mb-6 sm:mb-10">
              <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-gold-premium/20 to-gold-premium/10 border border-gold-premium/40 px-3 sm:px-5 py-1.5 sm:py-2 rounded-full mb-3 sm:mb-4">
                <Crown className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gold-premium" />
                <span className="text-gold-premium font-black text-[10px] sm:text-xs tracking-widest">VIP BUNDLE</span>
              </div>

              <h2 className="text-[22px] sm:text-3xl md:text-4xl font-black mb-2 sm:mb-3 leading-tight">
                <span className="text-white">Everything Included</span>
              </h2>
              <p className="text-gray-400 text-[11px] sm:text-base">One payment. Lifetime access. No hidden fees.</p>
            </div>

            {/* Premium Value Stack */}
            <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-10">
              {/* Item 1 - MAIN COURSE - Featured & Bigger */}
              <div className="bg-gradient-to-r from-gold-premium/20 via-gold-premium/10 to-gold-premium/5 backdrop-blur-sm border-2 border-gold-premium/50 rounded-xl sm:rounded-2xl p-4 sm:p-5 hover:border-gold-premium transition-all shadow-lg shadow-gold-premium/10">
                <div className="flex items-center gap-4 sm:gap-5">
                  <div className="relative w-20 h-20 sm:w-28 sm:h-28 rounded-xl sm:rounded-2xl overflow-hidden flex-shrink-0 border-2 border-gold-premium shadow-xl">
                    <Image src="/images/VD-Course-demo.webp" alt="AgentClone System" fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="bg-gold-premium text-navy-deep px-2 py-0.5 rounded text-[9px] sm:text-xs font-black">MAIN COURSE</span>
                    </div>
                    <h4 className="text-white font-black text-sm sm:text-xl mb-1">AgentClone™ 7-Minute System</h4>
                    <p className="text-gray-300 text-[11px] sm:text-sm">Complete video training + 50 ready-to-use scripts</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-gold-premium font-black text-lg sm:text-2xl">$697</div>
                    <p className="text-[10px] sm:text-xs text-gray-400">value</p>
                  </div>
                </div>
              </div>

              {/* Item 2 - 5 Premium Bonuses - EMERALD */}
              <div className="flex items-center gap-3 sm:gap-4 bg-gradient-to-r from-emerald-500/10 to-emerald-500/[0.02] backdrop-blur-sm border border-emerald-500/30 rounded-xl sm:rounded-xl p-3 sm:p-4 hover:border-emerald-400/50 transition-all">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-emerald-500/30">
                  <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-white font-black text-xs sm:text-base">5 Premium Bonuses (You Choose)</h4>
                  <p className="text-gray-400 text-[10px] sm:text-sm">Pick any 5 from 10 exclusive resources</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-emerald-400 font-black text-sm sm:text-lg">$200</div>
                </div>
              </div>

              {/* Item 3 - Direct Access to Sara */}
              <div className="flex items-center gap-3 sm:gap-4 bg-gradient-to-r from-white/5 to-white/[0.02] backdrop-blur-sm border border-white/10 rounded-xl p-3 sm:p-4 hover:border-gold-premium/30 transition-all">
                <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden flex-shrink-0 border-2 border-gold-premium shadow-lg">
                  <Image src="/images/Sara 61kb.webp" alt="Sara" fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-white font-black text-xs sm:text-base">Direct Line to Sara</h4>
                  <p className="text-gray-400 text-[10px] sm:text-sm">Email + Instagram DM support</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-gold-premium font-black text-sm sm:text-lg">$197</div>
                </div>
              </div>

              {/* Item 4 - Mystery Box - PURPLE/VIOLET */}
              <div className="flex items-center gap-3 sm:gap-4 bg-gradient-to-r from-violet-500/15 to-purple-500/[0.02] backdrop-blur-sm border border-violet-500/40 rounded-xl p-3 sm:p-4 hover:border-violet-400/60 transition-all relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-violet-500/5 via-transparent to-purple-500/5 animate-pulse"></div>
                <div className="relative w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-violet-500/30">
                  <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                  </svg>
                </div>
                <div className="relative flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-white font-black text-xs sm:text-base">Mystery Box</h4>
                    <span className="bg-violet-500/30 text-violet-300 px-1.5 py-0.5 rounded text-[8px] sm:text-[10px] font-black animate-pulse">SECRET</span>
                  </div>
                  <p className="text-gray-400 text-[10px] sm:text-sm">Exclusive surprise revealed after purchase</p>
                </div>
                <div className="relative text-right flex-shrink-0">
                  <div className="text-violet-400 font-black text-sm sm:text-lg">$500-$1,500</div>
                </div>
              </div>

              {/* Item 5 - Lifetime Updates - CYAN/BLUE */}
              <div className="flex items-center gap-3 sm:gap-4 bg-gradient-to-r from-cyan-500/15 to-blue-500/[0.02] backdrop-blur-sm border border-cyan-500/40 rounded-xl p-3 sm:p-4 hover:border-cyan-400/60 transition-all relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-transparent to-blue-500/5"></div>
                <div className="relative w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-cyan-500/30">
                  <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <div className="relative flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-white font-black text-xs sm:text-base">Lifetime Updates</h4>
                    <span className="bg-cyan-500/30 text-cyan-300 px-1.5 py-0.5 rounded text-[8px] sm:text-[10px] font-black">WEEKLY</span>
                  </div>
                  <p className="text-gray-400 text-[10px] sm:text-sm">New tools & tips added every week forever</p>
                </div>
                <div className="relative text-right flex-shrink-0">
                  <div className="text-cyan-400 font-black text-sm sm:text-lg">$297</div>
                </div>
              </div>
            </div>

            {/* Total Value & Price */}
            <div className="bg-gradient-to-br from-gold-premium/10 to-gold-premium/5 border-2 border-gold-premium/40 rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6">
              <div className="flex items-center justify-between mb-3 sm:mb-4 pb-3 sm:pb-4 border-b border-gold-premium/20">
                <span className="text-gray-300 font-bold text-xs sm:text-base">Total Value</span>
                <span className="text-white line-through text-lg sm:text-2xl font-black">$2,516+</span>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-gold-premium font-black text-sm sm:text-lg">BLACK FRIDAY PRICE</span>
                  <div className="inline-flex items-center gap-2 ml-2 sm:ml-3 bg-gold-premium/20 text-gold-premium px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-black">
                    SAVE 97%
                  </div>
                </div>
                <span className="text-4xl sm:text-5xl font-black text-gold-premium">$47.81</span>
              </div>
            </div>

            {/* CTA Button */}
            <button
              onClick={handleSpinClick}
              className="w-full group flex items-center justify-center gap-2 sm:gap-3 bg-gradient-to-r from-gold-premium via-gold-light to-gold-premium text-navy-deep py-4 sm:py-5 rounded-xl sm:rounded-2xl font-black text-sm sm:text-lg shadow-2xl hover:scale-[1.02] active:scale-100 transition-all"
            >
              <span>Choose Your 5 Bonuses & Get Access</span>
              <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-1 transition-transform" />
            </button>

            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 mt-3 sm:mt-4 text-gray-400 text-[10px] sm:text-sm">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-400" />
                <span>30-Day Guarantee</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-400" />
                <span>+ $50 if no results</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gold-premium" />
                <span>Instant Access</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          9. SARA'S GUARANTEE - Zero Risk with Copy Buttons
          ================================================================ */}
      <section className="py-6 sm:py-10 md:py-14 bg-white">
        <div className="w-full px-3 sm:px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-4 sm:mb-5">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-4 sm:px-5 py-2 rounded-full font-black text-xs shadow-2xl shadow-emerald-500/30">
                <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                ZERO-RISK GUARANTEE
              </div>
            </div>

            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-center mb-2 sm:mb-3 text-navy-deep">
              Try It Free For <span className="text-gold-premium">30 Days</span>
            </h2>
            <p className="text-center text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 max-w-3xl mx-auto">
              If this doesn't work exactly like I promised, I'll refund you + pay you <span className="font-black text-emerald-600">$50</span> for your time
            </p>

            {/* Sara's Promise Card */}
            <div className="bg-gradient-to-br from-navy-deep to-gray-900 rounded-2xl shadow-2xl border border-gold-premium/30 p-4 sm:p-6 md:p-8 mb-4 sm:mb-5">
              <div className="flex flex-col md:flex-row gap-4 sm:gap-5 items-start">
                <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto md:mx-0 flex-shrink-0 relative">
                  <div className="absolute inset-0 bg-gold-premium rounded-full animate-pulse opacity-20" />
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-gold-premium shadow-xl">
                    <Image
                      src="/images/Sara 61kb.webp"
                      alt="Sara Cohen"
                      fill
                      className="object-cover"
                      loading="lazy"
                      sizes="(max-width: 640px) 64px, 80px"
                    />
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-full w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center border-2 border-white shadow-lg">
                    <CheckCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  </div>
                </div>

                <div className="flex-1">
                  <div className="mb-3 sm:mb-4">
                    <p className="text-sm sm:text-lg font-bold text-white mb-2 sm:mb-3 italic leading-relaxed">
                      "If you can't create professional videos in 7 minutes or less,
                      I'll refund every penny AND send you $50 for wasting your time."
                    </p>
                    <p className="text-xs sm:text-base text-white/70 mb-2">
                      <span className="font-bold text-emerald-400">Full refund</span> PLUS I'll pay YOU $50. Zero risk.
                    </p>
                  </div>
                  <div className="border-t border-white/20 pt-2 sm:pt-3">
                    <p className="font-black text-white text-xs sm:text-sm">— Sara Cohen</p>
                    <p className="text-[10px] sm:text-xs text-white/60">Top 1% Agent • $127M+ Sold</p>
                  </div>
                </div>
              </div>
            </div>

            {/* How to Get Refund */}
            <div className="bg-gradient-to-br from-navy-deep to-gray-900 border border-gold-premium/30 rounded-2xl p-4 sm:p-5 shadow-xl">
              <h3 className="text-sm sm:text-lg font-black text-center mb-2 text-white">
                How To Get Your Money Back <span className="text-emerald-400">(30 Seconds)</span>
              </h3>
              <p className="text-center text-white/60 mb-4 sm:mb-5 text-[10px] sm:text-sm">
                No forms. No hoops. No waiting. Just pick one:
              </p>

              <div className="grid md:grid-cols-2 gap-3 sm:gap-4">
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
                    <p className="text-[10px] sm:text-xs text-white/90 italic">"Hi Sara, I'd like my refund please. My purchase email is [YOUR EMAIL]"</p>
                  </div>
                  <button
                    onClick={() => copyToClipboard("Hi Sara, I'd like my refund please. My purchase email is ", 'refund-email')}
                    className="mt-2 w-full flex items-center justify-center gap-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-400 py-2.5 rounded-lg text-[11px] sm:text-sm font-black transition-all"
                  >
                    {copiedText === 'refund-email' ? (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        <span>Message Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copy Email Message</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Instagram Option */}
                <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-xl p-3 sm:p-4 border border-gold-premium/30 hover:border-gold-premium/50 transition-all shadow-lg">
                  <div className="flex items-center gap-2 mb-2 sm:mb-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-gold-premium to-gold-dark rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
                      <Instagram className="w-4 h-4 sm:w-5 sm:h-5 text-navy-deep" />
                    </div>
                    <div>
                      <h4 className="font-black text-white text-xs sm:text-sm">Instagram DM</h4>
                      <p className="text-[10px] sm:text-xs text-gold-premium">DM Sara directly</p>
                    </div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-2 sm:p-3 border border-white/10">
                    <p className="text-[10px] sm:text-xs text-white/60 mb-1">DM to:</p>
                    <code className="text-[10px] sm:text-xs font-mono text-white/80 block">@sara.theagent</code>
                  </div>
                  <div className="bg-gold-premium/10 rounded-lg p-2 sm:p-3 border border-gold-premium/20 mt-2">
                    <p className="text-[10px] sm:text-xs text-gold-premium/80 mb-1">Message to copy:</p>
                    <p className="text-[10px] sm:text-xs text-white/90 italic">"Hey Sara! Refund please. My email is [YOUR EMAIL]"</p>
                  </div>
                  <button
                    onClick={() => copyToClipboard("Hey Sara! Refund please. My email is ", 'refund-dm')}
                    className="mt-2 w-full flex items-center justify-center gap-1.5 bg-gold-premium/20 hover:bg-gold-premium/30 border border-gold-premium/40 text-gold-premium py-2.5 rounded-lg text-[11px] sm:text-sm font-black transition-all"
                  >
                    {copiedText === 'refund-dm' ? (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        <span>Message Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copy DM Message</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          COMMON QUESTIONS FAQ
          ================================================================ */}
      <section className="py-4 sm:py-6 md:py-10 bg-white">
        <div className="w-full px-3 sm:px-4 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-4 sm:mb-10">
              <h2 className="text-[19px] sm:text-2xl md:text-3xl font-black mb-2 px-2 text-navy-deep">
                Common <span className="text-gold-premium">Questions</span>
              </h2>
              <p className="text-xs sm:text-base text-gray-600 px-2">Everything you need to know</p>
            </div>

            <div className="space-y-2 sm:space-y-3">
              {faqs.map((faq, i) => (
                <div
                  key={i}
                  className="bg-white border border-gray-200 hover:border-gold-premium/40 rounded-lg sm:rounded-xl overflow-hidden transition-all shadow-md"
                >
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-2.5 sm:p-4 text-left"
                  >
                    <span className="font-semibold text-[11px] sm:text-base pr-2 text-navy-deep">{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 sm:w-5 sm:h-5 text-gold-premium flex-shrink-0 transition-transform ${
                        expandedFaq === i ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {expandedFaq === i && (
                    <div className="px-2.5 sm:px-4 pb-2.5 sm:pb-4">
                      <p className="text-[11px] sm:text-sm text-gray-700 leading-relaxed">{faq.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          FINAL CTA SECTION
          ================================================================ */}
      <section id="cta-section" className="py-10 sm:py-14 md:py-20 bg-gradient-to-br from-gold-premium via-gold-light to-gold-premium">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-navy-deep mb-3 sm:mb-4 md:mb-6">
              Ready to Transform Your<br />Real Estate Business?
            </h2>

            <p className="text-sm sm:text-lg md:text-2xl text-navy-rich mb-6 sm:mb-8 md:mb-12">
              Join 847+ agents who are already using AI to dominate their market
            </p>

            {/* Selected Gift Display */}
            {selectedGift && (
              <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white p-4 sm:p-6 rounded-xl sm:rounded-2xl mb-6 sm:mb-8 shadow-2xl">
                <div className="flex items-center justify-center gap-3 sm:gap-4 mb-2 sm:mb-3">
                  <span className="text-3xl sm:text-4xl">{selectedGift.emoji || '🎁'}</span>
                  <div>
                    <p className="font-black text-base sm:text-xl">YOUR BONUS IS LOCKED IN!</p>
                    <p className="text-xs sm:text-sm">{selectedGift.name || selectedGift.shortName}</p>
                  </div>
                </div>
                <p className="text-white/90 text-xs sm:text-sm">
                  Complete your purchase now to claim this exclusive bonus
                </p>
              </div>
            )}

            {/* Price Display */}
            <div className="bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 mb-6 sm:mb-8 shadow-2xl">
              <p className="text-gray-600 text-sm sm:text-lg mb-1 sm:mb-2">Total Value: <span className="line-through">$2,085</span></p>
              <p className="text-4xl sm:text-5xl md:text-6xl font-black text-navy-deep mb-1 sm:mb-2">$47.81</p>
              <p className="text-emerald-600 font-bold text-sm sm:text-lg">98% OFF - BLACK FRIDAY ONLY</p>
              <p className="text-xs sm:text-sm text-gray-600 mt-2 sm:mt-3 flex items-center justify-center gap-1.5">
                <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                Price increases to $97 after midnight
              </p>
            </div>

            {/* CTA Button */}
            <button
              onClick={handleSpinClick}
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-navy-deep to-navy-rich text-white px-8 sm:px-10 py-4 sm:py-5 md:py-6 rounded-xl sm:rounded-2xl font-black text-base sm:text-xl md:text-2xl hover:scale-105 active:scale-95 transition-transform shadow-2xl border-2 sm:border-4 border-white w-full sm:w-auto mb-3 sm:mb-4"
            >
              <Gift className="w-5 h-5 sm:w-6 sm:h-6" />
              YES! Give Me Everything For $47.81
              <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            <p className="text-navy-deep text-xs sm:text-sm flex items-center justify-center gap-1.5">
              <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              30-Day Money-Back + $50 Guarantee • Instant Access • SSL Secured
            </p>
          </div>
        </div>
      </section>

      {/* ================================================================
          FOOTER - Final Trust
          ================================================================ */}
      <section className="py-8 sm:py-12 md:py-16 bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Trust Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-center">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-emerald-400/30 shadow-sm">
                <div className="flex items-center justify-center gap-2">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500" />
                  <p className="font-bold text-navy-deep text-xs sm:text-sm">847+ Happy Agents</p>
                </div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-gold-premium/30 shadow-sm">
                <div className="flex items-center justify-center gap-2">
                  <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-gold-premium" />
                  <p className="font-bold text-navy-deep text-xs sm:text-sm">SSL Encrypted Payment</p>
                </div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-navy-deep/30 shadow-sm">
                <div className="flex items-center justify-center gap-2">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-navy-deep" />
                  <p className="font-bold text-navy-deep text-xs sm:text-sm">Instant Access</p>
                </div>
              </div>
            </div>

            {/* Copyright */}
            <div className="text-center mt-8 sm:mt-10">
              <p className="text-gray-500 text-[10px] sm:text-xs">
                © {new Date().getFullYear()} AI FastScale. All rights reserved.
              </p>
              <div className="flex items-center justify-center gap-3 sm:gap-4 mt-2 text-gray-400 text-[10px] sm:text-xs">
                <a href="/privacy-policy" className="hover:text-gray-600 transition-colors">Privacy Policy</a>
                <span>•</span>
                <a href="/terms-of-service" className="hover:text-gray-600 transition-colors">Terms of Service</a>
                <span>•</span>
                <a href="/refund-policy" className="hover:text-gray-600 transition-colors">Refund Policy</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
