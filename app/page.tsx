'use client'

import { useState, useEffect, useRef } from 'react'
import {
  Gift,
  Users,
  Star,
  Clock,
  TrendingUp,
  Zap,
  CheckCircle,
  Play,
  Shield,
  ChevronDown,
  X,
  Award,
  Target,
  AlertCircle,
  TrendingDown,
  Sparkles,
  ArrowRight,
  Mail,
  Instagram,
  Phone,
  Package,
} from 'lucide-react'
import Image from 'next/image'
import { WHOP } from './config/constants'
import { BONUS_PRODUCTS } from './config/bonus-products'
import type { BonusProduct } from './config/bonus-products'

// Top 4 pre-selected bonuses (highest value + most relevant)
const TOP_4_BONUSES = ['90-day-blueprint', 'instagram-stories-templates', 'hooks-impossible-to-skip', 'instagram-dm-scripts']

export default function Home() {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 })
  const [selectedMode, setSelectedMode] = useState<'expert' | 'custom' | null>(null)
  const [selectedBonuses, setSelectedBonuses] = useState<string[]>(TOP_4_BONUSES)
  const [showOrderModal, setShowOrderModal] = useState(false)
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)
  const [showAllTestimonials, setShowAllTestimonials] = useState(false)
  const [spotsLeft] = useState(13)
  const bonusGridRef = useRef<HTMLDivElement>(null)
  const orderModalRef = useRef<HTMLDivElement>(null)

  // Real midnight countdown timer
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

    // Set initial time
    setTimeLeft(calculateTimeToMidnight())

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeToMidnight())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Handle mode selection
  const handleModeSelect = (mode: 'expert' | 'custom') => {
    setSelectedMode(mode)
    if (mode === 'expert') {
      // Keep top 4, let user pick 5th
      setSelectedBonuses(TOP_4_BONUSES)
    } else {
      // Full control - start fresh
      setSelectedBonuses([])
    }
    // Scroll to bonus grid
    setTimeout(() => {
      bonusGridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 300)
  }

  // Toggle bonus selection
  const toggleBonus = (id: string) => {
    // In expert mode, top 4 are locked
    if (selectedMode === 'expert' && TOP_4_BONUSES.includes(id)) {
      return
    }

    if (selectedBonuses.includes(id)) {
      setSelectedBonuses(selectedBonuses.filter((b) => b !== id))
    } else if (selectedBonuses.length < 5) {
      setSelectedBonuses([...selectedBonuses, id])
    }
  }

  // Calculate total value
  const totalValue = selectedBonuses.reduce((sum, id) => {
    const bonus = BONUS_PRODUCTS.find((b) => b.id === id)
    return sum + (bonus?.value || 0)
  }, 0)

  // Show order summary modal before checkout
  const handleCheckout = () => {
    if (selectedBonuses.length === 5) {
      setShowOrderModal(true)
    }
  }

  // Confirm order and proceed to Whop checkout
  const confirmOrder = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('selectedBonuses', JSON.stringify(selectedBonuses))
      window.location.href = WHOP.checkoutUrls.main
    }
  }

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (orderModalRef.current && !orderModalRef.current.contains(event.target as Node)) {
        setShowOrderModal(false)
      }
    }

    if (showOrderModal) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showOrderModal])

  return (
    <main className="min-h-screen bg-white font-dm-sans">
      {/* ===== STICKY HEADER ===== */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-entrepedia-red shadow-lg">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between flex-wrap gap-3">
            {/* Countdown Timer */}
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-white" />
              <div className="flex gap-2 text-white font-bold">
                <span>{String(timeLeft.hours).padStart(2, '0')}</span>
                <span>:</span>
                <span>{String(timeLeft.minutes).padStart(2, '0')}</span>
                <span>:</span>
                <span>{String(timeLeft.seconds).padStart(2, '0')}</span>
              </div>
              <span className="text-white text-sm hidden sm:inline">Ends Tonight at MIDNIGHT</span>
            </div>

            {/* CTA Button */}
            <a
              href="#choose-path"
              className="bg-entrepedia-dark text-white px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-black transition-colors shadow-lg"
            >
              Get Started - Only {spotsLeft} Left!
            </a>
          </div>
        </div>
      </header>

      {/* Spacer for fixed header */}
      <div className="h-16" />

      {/* ===== HERO SECTION ===== */}
      <section className="relative py-16 md:py-24 bg-entrepedia-dark">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto">
            {/* Social Proof Badges */}
            <div className="flex items-center justify-center gap-3 md:gap-4 mb-8 flex-wrap">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                <Users className="w-4 h-4 text-entrepedia-red" />
                <span className="text-white text-sm font-semibold">847+ Agents</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="text-white text-sm font-semibold">4.9/5 Rating</span>
              </div>
              <div className="flex items-center gap-2 bg-entrepedia-red/30 backdrop-blur-sm px-4 py-2 rounded-full border border-entrepedia-red">
                <TrendingUp className="w-4 h-4 text-white" />
                <span className="text-white text-sm font-bold">92% OFF Today</span>
              </div>
            </div>

            {/* Main Headline */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-league-spartan font-black mb-6 leading-tight text-white">
                Turn 1 Photo Into{' '}
                <span className="text-entrepedia-red">50 Personalized Videos</span>
                <br />
                In Just <span className="text-entrepedia-red">7 Minutes</span>
              </h1>

              {/* Subheadline */}
              <p className="text-xl md:text-2xl text-entrepedia-gray-100 mb-3">
                No camera. No editing. No tech skills.
              </p>
              <p className="text-xl md:text-2xl text-white font-bold">
                Real estate agents are using AI to get{' '}
                <span className="text-entrepedia-red">3x more luxury listings</span>
              </p>

              {/* Value Prop Bullets */}
              <div className="mt-8 flex flex-wrap justify-center gap-4 md:gap-6 text-base">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-entrepedia-red flex-shrink-0" />
                  <span className="text-white">Works in 7 minutes</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-entrepedia-red flex-shrink-0" />
                  <span className="text-white">No filming required</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-entrepedia-red flex-shrink-0" />
                  <span className="text-white">$1,865 in bonuses FREE</span>
                </div>
              </div>
            </div>

            {/* Photo-to-Video Transformation Image */}
            <div className="relative max-w-3xl mx-auto mb-8">
              <div className="aspect-video bg-black rounded-xl overflow-hidden border-2 border-entrepedia-gray-400 relative">
                <Image
                  src="/images/P1_result.webp"
                  alt="Transform 1 Photo Into 50 AI Videos"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Primary CTA */}
            <div className="text-center">
              <a
                href="#choose-path"
                className="inline-flex items-center gap-3 bg-entrepedia-red hover:bg-entrepedia-red-hover text-white px-10 py-5 rounded-lg font-league-spartan font-black text-xl md:text-2xl transition-all shadow-xl group"
              >
                <span>Get Started Now - Only {spotsLeft} Left!</span>
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </a>
              <p className="text-entrepedia-gray-100 text-sm mt-4">
                <Shield className="w-4 h-4 inline mr-1 text-green-500" />
                30-Day Money-Back Guarantee • Instant Access
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SARA'S IRRESISTIBLE GUARANTEE - DIRECTLY AFTER HERO ===== */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-green-50 to-white relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-green-600/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-entrepedia-red/5 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto">
            {/* Top Badge */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-full font-black text-sm shadow-lg animate-pulse">
                <Shield className="w-5 h-5" />
                100% RISK-FREE GUARANTEE
              </div>
            </div>

            {/* Main Headline */}
            <h2 className="text-3xl md:text-5xl font-league-spartan font-black text-center mb-4 text-entrepedia-dark">
              My <span className="text-entrepedia-red">Iron-Clad Promise</span> To You
            </h2>
            <p className="text-center text-xl text-entrepedia-gray-600 mb-12 max-w-3xl mx-auto">
              I'm so confident AgentClone will transform your business that I'm putting MY reputation on the line
            </p>

            {/* Sara's Personal Promise Card */}
            <div className="bg-white rounded-2xl shadow-2xl border-4 border-green-600 p-8 md:p-12 mb-8">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                {/* Sara's Photo */}
                <div className="w-32 h-32 mx-auto md:mx-0 flex-shrink-0 relative">
                  <div className="absolute inset-0 bg-green-600 rounded-full animate-ping opacity-20" />
                  <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-green-600">
                    <Image
                      src="/images/Sara 61kb.webp"
                      alt="Sara Cohen - Creator of AgentClone"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-green-600 text-white rounded-full w-10 h-10 flex items-center justify-center border-4 border-white">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                </div>

                {/* Promise Text */}
                <div className="flex-1">
                  <div className="mb-6">
                    <p className="text-2xl font-bold text-entrepedia-dark mb-4 italic leading-relaxed">
                      "If AgentClone doesn't help you create professional AI videos in 7 minutes or less,
                      I'll refund every penny + send you $50 for wasting your time."
                    </p>
                    <p className="text-lg text-entrepedia-gray-600 mb-4">
                      That's right. Not only will I give you a <span className="font-bold text-green-600">full refund</span>
                      —I'll actually PAY YOU $50 to try AgentClone risk-free.
                    </p>
                    <p className="text-base text-entrepedia-gray-600">
                      Why? Because I've seen this system work for 847+ agents. I KNOW it works.
                      The only way you lose is if you don't try it.
                    </p>
                  </div>
                  <div className="border-t-2 border-entrepedia-gray-200 pt-4">
                    <p className="font-black text-entrepedia-dark text-lg">— Sara Cohen</p>
                    <p className="text-sm text-entrepedia-gray-600">Former Top 1% Agent • $127M+ in Sales</p>
                  </div>
                </div>
              </div>
            </div>

            {/* How to Get Your Refund */}
            <div className="bg-gradient-to-r from-entrepedia-red/10 to-green-50 border-2 border-green-600 rounded-2xl p-8 mb-8">
              <h3 className="text-2xl font-league-spartan font-black text-center mb-2 text-entrepedia-dark">
                Getting Your Refund is <span className="text-green-600">Stupidly Easy</span>
              </h3>
              <p className="text-center text-entrepedia-gray-600 mb-8">
                Seriously. No forms, no waiting, no runaround. Just 2 simple options:
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Email Option */}
                <div className="bg-white rounded-xl p-6 border-2 border-green-600 hover:shadow-xl transition-all">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                      <Mail className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-black text-entrepedia-dark">Option 1: Email</h4>
                      <p className="text-xs text-green-600">Response in 24 hours</p>
                    </div>
                  </div>
                  <p className="text-sm text-entrepedia-gray-600 mb-3">
                    Send to: <span className="font-bold text-entrepedia-dark">support@aifastscale.com</span>
                  </p>
                  <div className="bg-entrepedia-gray-50 rounded-lg p-4 border-2 border-dashed border-green-600 relative">
                    <p className="text-sm font-mono text-entrepedia-dark pr-12">
                      "Hi Sara, I'd like my refund. My email is [your email]"
                    </p>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText("Hi Sara, I'd like my refund. My email is [your email]")
                        alert("✓ Copied to clipboard!")
                      }}
                      className="absolute top-2 right-2 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs font-bold transition-all"
                    >
                      Copy
                    </button>
                  </div>
                  <p className="text-xs text-green-600 mt-3 font-bold">✓ Copy, paste, send. Done in 30 seconds.</p>
                </div>

                {/* Instagram DM Option */}
                <div className="bg-white rounded-xl p-6 border-2 border-entrepedia-red hover:shadow-xl transition-all">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-entrepedia-red rounded-full flex items-center justify-center">
                      <Instagram className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-black text-entrepedia-dark">Option 2: Instagram DM</h4>
                      <p className="text-xs text-entrepedia-red">DM Sara directly</p>
                    </div>
                  </div>
                  <p className="text-sm text-entrepedia-gray-600 mb-3">
                    Message: <span className="font-bold text-entrepedia-dark">@sara.theagent</span>
                  </p>
                  <div className="bg-entrepedia-gray-50 rounded-lg p-4 border-2 border-dashed border-entrepedia-red relative">
                    <p className="text-sm font-mono text-entrepedia-dark pr-12">
                      "Hey Sara! I'd like my AgentClone refund please 🙏"
                    </p>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText("Hey Sara! I'd like my AgentClone refund please 🙏")
                        alert("✓ Copied to clipboard!")
                      }}
                      className="absolute top-2 right-2 bg-entrepedia-red hover:bg-entrepedia-red-hover text-white px-3 py-1 rounded text-xs font-bold transition-all"
                    >
                      Copy
                    </button>
                  </div>
                  <a
                    href="https://instagram.com/sara.theagent"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-3 text-entrepedia-red hover:text-entrepedia-red-hover font-bold text-sm"
                  >
                    → Open Instagram Now
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>

            {/* Bottom Guarantee Badges */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 text-center border-2 border-green-600 shadow-lg">
                <Clock className="w-12 h-12 text-green-600 mx-auto mb-3" />
                <h4 className="font-bold text-entrepedia-dark mb-2">24-Hour Processing</h4>
                <p className="text-sm text-entrepedia-gray-600">
                  Request today, money back tomorrow
                </p>
              </div>
              <div className="bg-white rounded-xl p-6 text-center border-2 border-green-600 shadow-lg">
                <Shield className="w-12 h-12 text-green-600 mx-auto mb-3" />
                <h4 className="font-bold text-entrepedia-dark mb-2">No Questions Asked</h4>
                <p className="text-sm text-entrepedia-gray-600">
                  Don't like it? That's reason enough
                </p>
              </div>
              <div className="bg-white rounded-xl p-6 text-center border-2 border-green-600 shadow-lg">
                <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
                <h4 className="font-bold text-entrepedia-dark mb-2">Full 30 Days</h4>
                <p className="text-sm text-entrepedia-gray-600">
                  Try it, test it, keep it or return it
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== PROBLEM AGITATION SECTION ===== */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-league-spartan font-black mb-4 text-entrepedia-dark">
                Are You <span className="text-entrepedia-red">Losing Listings</span> To Agents With Better Marketing?
              </h2>
              <p className="text-xl text-entrepedia-gray-600">
                While you're stuck posting the same boring photos...
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="bg-entrepedia-gray-50 border-2 border-entrepedia-red/20 rounded-xl p-6 text-center">
                <TrendingDown className="w-12 h-12 text-entrepedia-red mx-auto mb-4" />
                <h3 className="text-lg font-bold mb-2 text-entrepedia-dark">Ignored on Social Media</h3>
                <p className="text-entrepedia-gray-600 text-sm">
                  Your posts get 10 likes while competitors get 1000s of views with AI videos
                </p>
              </div>
              <div className="bg-entrepedia-gray-50 border-2 border-entrepedia-red/20 rounded-xl p-6 text-center">
                <AlertCircle className="w-12 h-12 text-entrepedia-red mx-auto mb-4" />
                <h3 className="text-lg font-bold mb-2 text-entrepedia-dark">No Time To Create Content</h3>
                <p className="text-entrepedia-gray-600 text-sm">
                  Spending hours filming and editing videos instead of closing deals
                </p>
              </div>
              <div className="bg-entrepedia-gray-50 border-2 border-entrepedia-red/20 rounded-xl p-6 text-center">
                <Target className="w-12 h-12 text-entrepedia-red mx-auto mb-4" />
                <h3 className="text-lg font-bold mb-2 text-entrepedia-dark">Missing Out On Leads</h3>
                <p className="text-entrepedia-gray-600 text-sm">
                  Luxury buyers expect professional video content - static photos don't cut it anymore
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CASE STUDY - MR. LUCAS ===== */}
      <section className="py-16 md:py-24 bg-entrepedia-dark">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Badge */}
            <div className="text-center mb-6">
              <div className="inline-block bg-green-600 text-white px-4 py-2 rounded-full font-bold text-sm">
                ✓ VERIFIED CASE STUDY
              </div>
            </div>

            {/* Headline */}
            <h2 className="text-3xl md:text-4xl font-league-spartan font-black text-center mb-8 text-white">
              Watch The Exact Video We Created That Got Mr. Lucas{' '}
              <span className="text-entrepedia-red">3 Paid Clients In 7 Days</span>
            </h2>

            {/* Vertical Reel Video (9:16 aspect ratio - Instagram/TikTok style) */}
            <div className="max-w-sm mx-auto mb-8">
              <div className="aspect-[9/16] bg-black rounded-2xl overflow-hidden relative shadow-2xl border-4 border-entrepedia-gray-400">
                <Image
                  src="/images/mr-lucas-thumbnail.webp"
                  alt="Mr. Lucas Case Study Reel"
                  fill
                  className="object-contain"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <button className="w-20 h-20 bg-entrepedia-red hover:bg-entrepedia-red-hover rounded-full flex items-center justify-center transition-all hover:scale-110">
                    <Play className="w-8 h-8 text-white ml-1" fill="white" />
                  </button>
                </div>
                {/* Instagram-style UI hints */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                  <div className="text-white text-sm font-bold drop-shadow-lg">@sara.theagent</div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-entrepedia-gray-50 border-2 border-entrepedia-dark rounded-xl p-6 text-center">
                <div className="text-4xl font-black text-entrepedia-red mb-2">3</div>
                <div className="text-entrepedia-dark text-sm font-bold">Listing Appointments</div>
              </div>
              <div className="bg-entrepedia-gray-50 border-2 border-entrepedia-dark rounded-xl p-6 text-center">
                <div className="text-4xl font-black text-entrepedia-red mb-2">18hrs</div>
                <div className="text-entrepedia-dark text-sm font-bold">Delivery Time</div>
              </div>
              <div className="bg-entrepedia-gray-50 border-2 border-entrepedia-dark rounded-xl p-6 text-center">
                <div className="text-4xl font-black text-entrepedia-red mb-2">$12K+</div>
                <div className="text-entrepedia-dark text-sm font-bold">Commission Generated</div>
              </div>
            </div>

            {/* Psychology Message */}
            <div className="bg-entrepedia-red/10 border-2 border-entrepedia-red rounded-xl p-6 text-center">
              <p className="text-entrepedia-dark text-lg italic">
                "Think about it: While you're learning editing software, your competitors are already posting videos and getting leads.
                The cost of <span className="text-entrepedia-red font-bold">waiting</span> is far greater than the cost of getting started."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-league-spartan font-black mb-4 text-entrepedia-dark">
                How It Works: <span className="text-entrepedia-red">3 Simple Steps</span>
              </h2>
              <p className="text-xl text-entrepedia-gray-600">
                From photo to 50 videos in just 7 minutes
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="relative">
                <div className="bg-entrepedia-gray-50 border-2 border-entrepedia-dark rounded-2xl p-8 h-full">
                  <div className="absolute -top-4 -left-4 w-12 h-12 bg-entrepedia-red rounded-full flex items-center justify-center text-2xl font-black text-white">
                    1
                  </div>
                  <div className="mb-6 mt-4">
                    <div className="w-16 h-16 bg-entrepedia-red/20 rounded-lg flex items-center justify-center">
                      <Sparkles className="w-8 h-8 text-entrepedia-red" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-league-spartan font-bold mb-3 text-entrepedia-dark">Upload 1 Photo</h3>
                  <p className="text-entrepedia-gray-600">
                    Just upload a single professional headshot. The AI does the rest.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative">
                <div className="bg-entrepedia-gray-50 border-2 border-entrepedia-dark rounded-2xl p-8 h-full">
                  <div className="absolute -top-4 -left-4 w-12 h-12 bg-entrepedia-red rounded-full flex items-center justify-center text-2xl font-black text-white">
                    2
                  </div>
                  <div className="mb-6 mt-4">
                    <div className="w-16 h-16 bg-entrepedia-red/20 rounded-lg flex items-center justify-center">
                      <Zap className="w-8 h-8 text-entrepedia-red" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-league-spartan font-bold mb-3 text-entrepedia-dark">Type Your Script</h3>
                  <p className="text-entrepedia-gray-600">
                    Write what you want to say about each listing. Or use our templates.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative">
                <div className="bg-entrepedia-gray-50 border-2 border-entrepedia-dark rounded-2xl p-8 h-full">
                  <div className="absolute -top-4 -left-4 w-12 h-12 bg-entrepedia-red rounded-full flex items-center justify-center text-2xl font-black text-white">
                    3
                  </div>
                  <div className="mb-6 mt-4">
                    <div className="w-16 h-16 bg-entrepedia-red/20 rounded-lg flex items-center justify-center">
                      <ArrowRight className="w-8 h-8 text-entrepedia-red" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-league-spartan font-bold mb-3 text-entrepedia-dark">Download & Post</h3>
                  <p className="text-entrepedia-gray-600">
                    Download your videos and post to social media. Watch the leads roll in.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-12 text-center">
              <div className="inline-flex items-center gap-2 bg-green-100 border-2 border-green-500 px-6 py-3 rounded-lg">
                <Clock className="w-5 h-5 text-green-600" />
                <span className="text-green-600 font-bold">Total Time: 7 Minutes</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CHOOSE YOUR PATH + BONUS SELECTION ===== */}
      <section id="choose-path" className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          {/* Urgency Banner */}
          <div className="max-w-4xl mx-auto text-center mb-12">
            <div className="inline-flex items-center gap-4 bg-entrepedia-red/5 border-2 border-entrepedia-red rounded-xl px-6 py-6 mb-8">
              <Clock className="w-6 h-6 text-entrepedia-red" />
              <div className="flex gap-3">
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-black text-entrepedia-dark">{String(timeLeft.hours).padStart(2, '0')}</div>
                  <div className="text-xs text-entrepedia-gray-600 uppercase">Hours</div>
                </div>
                <div className="text-2xl md:text-3xl font-black text-entrepedia-dark self-center">:</div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-black text-entrepedia-dark">{String(timeLeft.minutes).padStart(2, '0')}</div>
                  <div className="text-xs text-entrepedia-gray-600 uppercase">Mins</div>
                </div>
                <div className="text-2xl md:text-3xl font-black text-entrepedia-dark self-center">:</div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-black text-entrepedia-dark">{String(timeLeft.seconds).padStart(2, '0')}</div>
                  <div className="text-xs text-entrepedia-gray-600 uppercase">Secs</div>
                </div>
              </div>
            </div>

            <h2 className="text-3xl md:text-5xl font-league-spartan font-black mb-4 text-entrepedia-dark">
              Choose Your Path
            </h2>
            <p className="text-xl text-entrepedia-gray-600 mb-4">
              Select 5 high-value bonuses worth $1,865+ — included FREE with your purchase
            </p>
          </div>

          {/* Choose Your Path Cards */}
          {!selectedMode && (
            <div className="max-w-5xl mx-auto">
              <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                {/* Expert Selection Card */}
                <button
                  onClick={() => handleModeSelect('expert')}
                  className="relative bg-white rounded-2xl p-8 text-left transition-all hover:scale-105 border-4 border-entrepedia-red group"
                >
                  {/* Recommended Badge */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-entrepedia-red text-white px-4 py-1 rounded-full text-xs font-bold uppercase">
                    RECOMMENDED
                  </div>

                  {/* Icon */}
                  <div className="mb-6">
                    <div className="w-12 h-12 bg-entrepedia-red/20 rounded-lg flex items-center justify-center">
                      <Gift className="w-6 h-6 text-entrepedia-red" />
                    </div>
                  </div>

                  {/* Title */}
                  <h4 className="text-2xl font-league-spartan font-bold mb-2 text-entrepedia-dark">Expert Selection</h4>
                  <p className="text-entrepedia-gray-600 text-sm mb-6">Sara's top 5 picks for maximum results</p>

                  {/* Features */}
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-start gap-2 text-sm text-entrepedia-dark">
                      <CheckCircle className="w-5 h-5 text-entrepedia-red mt-0.5 flex-shrink-0" />
                      <span>Most popular bonuses pre-selected</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-entrepedia-dark">
                      <CheckCircle className="w-5 h-5 text-entrepedia-red mt-0.5 flex-shrink-0" />
                      <span>Highest combined value ($122)</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-entrepedia-dark">
                      <CheckCircle className="w-5 h-5 text-entrepedia-red mt-0.5 flex-shrink-0" />
                      <span>Perfect for busy agents</span>
                    </li>
                  </ul>

                  {/* Continue Link */}
                  <div className="mt-4 text-entrepedia-red text-sm flex items-center gap-2 font-bold">
                    <span>Continue</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </button>

                {/* Full Control Card */}
                <button
                  onClick={() => handleModeSelect('custom')}
                  className="relative bg-white rounded-2xl p-8 text-left transition-all hover:scale-105 border-2 border-entrepedia-gray-400 hover:border-entrepedia-dark group"
                >
                  {/* Icon */}
                  <div className="mb-6">
                    <div className="w-12 h-12 bg-entrepedia-gray-100 rounded-lg flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-entrepedia-dark" />
                    </div>
                  </div>

                  {/* Title */}
                  <h4 className="text-2xl font-league-spartan font-bold mb-2 text-entrepedia-dark">Full Control</h4>
                  <p className="text-entrepedia-gray-600 text-sm mb-6">Handpick all 5 bonuses yourself</p>

                  {/* Features */}
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-start gap-2 text-sm text-entrepedia-dark">
                      <CheckCircle className="w-5 h-5 text-entrepedia-gray-600 mt-0.5 flex-shrink-0" />
                      <span>Browse 10 premium options</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-entrepedia-dark">
                      <CheckCircle className="w-5 h-5 text-entrepedia-gray-600 mt-0.5 flex-shrink-0" />
                      <span>Mix multiple categories</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-entrepedia-dark">
                      <CheckCircle className="w-5 h-5 text-entrepedia-gray-600 mt-0.5 flex-shrink-0" />
                      <span>Tailored to your goals</span>
                    </li>
                  </ul>

                  {/* Continue Link */}
                  <div className="mt-4 text-entrepedia-dark text-sm flex items-center gap-2 font-bold group-hover:text-entrepedia-red">
                    <span>Continue</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Bonus Selection Grid */}
          {selectedMode && (
            <div ref={bonusGridRef} className="max-w-6xl mx-auto mt-12">
              {/* Selection Counter */}
              <div className="bg-white/10 border border-white/20 rounded-xl p-4 mb-8">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-4">
                    <span className="text-white">Selected:</span>
                    <div className="flex gap-2">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center ${
                            i < selectedBonuses.length
                              ? 'bg-entrepedia-red border-entrepedia-red'
                              : 'bg-white/5 border-white/20'
                          }`}
                        >
                          {i < selectedBonuses.length && <CheckCircle className="w-5 h-5 text-white" />}
                        </div>
                      ))}
                    </div>
                    <span className="text-white font-bold">{selectedBonuses.length}/5</span>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedMode(null)
                      setSelectedBonuses([])
                    }}
                    className="text-entrepedia-gray-100 hover:text-white text-sm flex items-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    Change Selection Mode
                  </button>
                </div>
              </div>

              {/* Bonus Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {BONUS_PRODUCTS.map((bonus) => {
                  const isSelected = selectedBonuses.includes(bonus.id)
                  const isTopPick = selectedMode === 'expert' && TOP_4_BONUSES.includes(bonus.id)
                  const isDisabled = !isSelected && selectedBonuses.length >= 5

                  return (
                    <button
                      key={bonus.id}
                      onClick={() => toggleBonus(bonus.id)}
                      disabled={isDisabled && !isSelected}
                      className={`relative bg-white rounded-xl p-4 text-left transition-all border-2 ${
                        isSelected
                          ? 'border-entrepedia-red scale-105'
                          : isDisabled
                          ? 'border-entrepedia-gray-100 opacity-50 cursor-not-allowed'
                          : 'border-entrepedia-gray-100 hover:border-entrepedia-dark hover:scale-105'
                      }`}
                    >
                      {/* Selected Badge */}
                      {isSelected && (
                        <div className="absolute top-3 left-3 w-8 h-8 bg-entrepedia-red rounded-full flex items-center justify-center z-10">
                          {isTopPick ? (
                            <Award className="w-5 h-5 text-white" />
                          ) : (
                            <CheckCircle className="w-5 h-5 text-white" />
                          )}
                        </div>
                      )}

                      {/* Image */}
                      <div className="aspect-video bg-entrepedia-gray-50 rounded-lg mb-4 overflow-hidden relative">
                        {bonus.image && (
                          <Image
                            src={bonus.image}
                            alt={bonus.title}
                            fill
                            className="object-cover"
                          />
                        )}
                      </div>

                      {/* Content */}
                      <div>
                        <div className="text-xs text-entrepedia-gray-600 uppercase mb-1 font-bold">{bonus.category}</div>
                        <h5 className="font-bold text-sm mb-2 line-clamp-2 text-entrepedia-dark">{bonus.title}</h5>
                        <p className="text-entrepedia-gray-600 text-xs mb-3 line-clamp-2">{bonus.subtitle}</p>
                        <div className="text-entrepedia-red font-black text-lg">${bonus.value}</div>
                      </div>

                      {/* Top Pick Label */}
                      {isTopPick && (
                        <div className="mt-3 bg-entrepedia-red/20 border border-entrepedia-red rounded px-2 py-1 text-xs text-entrepedia-red font-bold text-center">
                          Top Pick - Pre-selected
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>

              {/* Checkout CTA */}
              {selectedBonuses.length === 5 && (
                <div className="sticky bottom-0 bg-gradient-to-t from-entrepedia-dark via-entrepedia-dark to-transparent pt-8 pb-4">
                  <div className="bg-white border-4 border-entrepedia-red rounded-xl p-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                      <div>
                        <p className="text-entrepedia-gray-600 text-sm mb-1">Your Bundle Value</p>
                        <div className="flex items-baseline gap-3">
                          <span className="text-4xl font-black text-entrepedia-red">${totalValue}</span>
                          <span className="text-entrepedia-gray-400 line-through text-lg">Worth ${totalValue}</span>
                        </div>
                        <p className="text-green-600 text-sm font-bold mt-1">
                          Included FREE with your $37 purchase
                        </p>
                      </div>
                      <button
                        onClick={handleCheckout}
                        className="w-full md:w-auto bg-entrepedia-red hover:bg-entrepedia-red-hover text-white px-8 py-4 rounded-lg font-league-spartan font-black text-xl transition-all shadow-xl flex items-center justify-center gap-2"
                      >
                        <span>Claim My Bundle - $37</span>
                        <ArrowRight className="w-6 h-6" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ===== VALUE STACK ===== */}
      <section className="py-16 md:py-24 bg-entrepedia-dark">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <div className="inline-block bg-entrepedia-red px-6 py-2 rounded font-bold text-sm text-white mb-6">
                EVERYTHING INCLUDED
              </div>
              <h2 className="text-3xl md:text-5xl font-league-spartan font-black mb-4 text-white">
                What You're <span className="text-entrepedia-red">Really Getting</span>
              </h2>
              <p className="text-xl text-entrepedia-gray-100 mb-6">Complete package for just $37</p>
              <div className="inline-flex items-center gap-2 bg-green-600 px-6 py-3 rounded-lg font-black text-white text-lg">
                <CheckCircle className="w-5 h-5" />
                Save $2,519+ Today Only
              </div>
            </div>

            <div className="space-y-6 mb-10">
              {/* 1. Main Course - Premium Card */}
              <div className="bg-white rounded-lg border-4 border-entrepedia-red shadow-xl overflow-hidden">
                <div className="bg-entrepedia-red px-6 py-3">
                  <p className="text-white font-black text-sm">MAIN PRODUCT</p>
                </div>
                <div className="p-6">
                  <div className="flex gap-6 items-start">
                    <div className="relative w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-entrepedia-gray-50 border-2 border-entrepedia-gray-200">
                      <Image
                        src="/images/VD-Course-demo.webp"
                        alt="AgentClone Course"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-league-spartan font-black mb-2 text-entrepedia-dark">
                        7-Minute AgentClone™ Video Course
                      </h3>
                      <p className="text-entrepedia-gray-600 mb-4">
                        Complete step-by-step system to create 50 personalized AI videos from 1 photo
                      </p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-black text-entrepedia-red">$697</span>
                        <span className="text-entrepedia-gray-600">Value</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. 5 Premium Bonuses */}
              <div className="bg-white rounded-lg border-4 border-green-600 shadow-xl overflow-hidden">
                <div className="bg-green-600 px-6 py-3 flex items-center justify-between">
                  <p className="text-white font-black text-sm">5 PREMIUM BONUSES (YOUR CHOICE)</p>
                  <span className="bg-white text-green-600 px-3 py-1 rounded-full font-black text-xs">100% FREE</span>
                </div>
                <div className="p-6">
                  <div className="flex gap-4 items-center mb-4">
                    <Gift className="w-12 h-12 text-green-600 flex-shrink-0" />
                    <p className="text-entrepedia-gray-600">
                      {selectedBonuses.length === 5
                        ? `You've selected ${selectedBonuses.length} premium bonuses worth $${totalValue}`
                        : 'Pick ANY 5 from 10 high-value real estate marketing tools'}
                    </p>
                  </div>
                  <div className="bg-green-50 border-2 border-green-600 rounded-lg p-4 mb-4">
                    <p className="text-green-600 font-black text-center">
                      ✓ Custom-picked bonuses tailored to YOUR business goals
                    </p>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-green-600">$1,865</span>
                    <span className="text-entrepedia-gray-600">Total Value -</span>
                    <span className="text-green-600 font-black">FREE!</span>
                  </div>
                </div>
              </div>

              {/* 3. Mystery VIP Box */}
              <div className="bg-white rounded-lg border-4 border-purple-600 shadow-xl overflow-hidden relative">
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 flex items-center justify-between">
                  <p className="text-white font-black text-sm">MYSTERY VIP BOX</p>
                  <span className="bg-white text-purple-600 px-3 py-1 rounded-full font-black text-xs animate-pulse">SURPRISE!</span>
                </div>
                <div className="p-6">
                  <div className="flex gap-4 items-start">
                    <div className="w-16 h-16 flex-shrink-0">
                      <Package className="w-full h-full text-purple-600" strokeWidth={1.5} />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-bold mb-2 text-entrepedia-dark">Ultra-Premium Surprise Bonus</h4>
                      <p className="text-entrepedia-gray-600 mb-4">
                        Could be 1-on-1 coaching with Sara, exclusive templates, VIP community access, or other premium surprises
                      </p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-black text-purple-600">$500-$1,500</span>
                        <span className="text-entrepedia-gray-600">Value -</span>
                        <span className="text-purple-600 font-black">FREE!</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 4. Sara's Support */}
              <div className="bg-white rounded-lg border-4 border-entrepedia-dark shadow-xl overflow-hidden">
                <div className="bg-entrepedia-dark px-6 py-3">
                  <p className="text-white font-black text-sm">SARA'S PERSONAL SUPPORT</p>
                </div>
                <div className="p-6">
                  <div className="flex gap-4 items-center">
                    <div className="relative w-20 h-20 flex-shrink-0 rounded-full overflow-hidden border-4 border-entrepedia-red">
                      <Image
                        src="/images/Sara 61kb.webp"
                        alt="Sara Cohen"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-bold mb-2 text-entrepedia-dark">Direct Access to Sara</h4>
                      <p className="text-entrepedia-gray-600 mb-2">
                        Instagram DM access (@sara.theagent) + priority email support
                      </p>
                      <span className="inline-block bg-green-100 text-green-600 px-3 py-1 rounded font-black text-sm">
                        FREE - INCLUDED
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* TOTAL VALUE BOX */}
            <div className="bg-white rounded-lg border-4 border-entrepedia-red shadow-2xl p-8 md:p-10">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <p className="text-entrepedia-gray-600 text-sm mb-2">Total Package Value:</p>
                  <div className="text-5xl md:text-6xl font-black text-entrepedia-gray-400 line-through mb-4">
                    $2,556+
                  </div>
                  <div className="flex items-baseline gap-3 mb-3">
                    <span className="text-entrepedia-dark text-2xl font-bold">You Pay:</span>
                    <span className="text-6xl md:text-7xl font-black text-entrepedia-red">$37</span>
                  </div>
                  <div className="inline-flex items-center gap-2 bg-green-100 border-2 border-green-600 px-4 py-2 rounded-lg">
                    <Sparkles className="w-5 h-5 text-green-600" />
                    <span className="text-green-600 font-black">Save $2,519+ (98% OFF!)</span>
                  </div>
                </div>
                <div className="text-center md:text-right">
                  <a
                    href="#choose-path"
                    className="inline-flex items-center gap-3 bg-entrepedia-red hover:bg-entrepedia-red-hover text-white px-10 py-5 rounded-lg font-league-spartan font-black text-2xl transition-all shadow-xl w-full justify-center"
                  >
                    <span>Claim This Deal</span>
                    <ArrowRight className="w-6 h-6" />
                  </a>
                  <div className="flex items-center justify-center gap-2 mt-4 text-white">
                    <Shield className="w-4 h-4 text-green-600" />
                    <span className="text-sm">30-Day Money-Back Guarantee</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== GUARANTEE #1 - SARA'S PERSONAL PROMISE ===== */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Sara's Promise */}
            <div className="text-center mb-12">
              <div className="inline-block bg-green-600 text-white px-4 py-2 rounded-full font-bold text-sm mb-6">
                GUARANTEE #1
              </div>
              <h2 className="text-3xl md:text-4xl font-league-spartan font-black mb-8 text-entrepedia-dark">
                Sara's Personal <span className="text-entrepedia-red">Refund Promise</span>
              </h2>
            </div>

            {/* Sara's Quote */}
            <div className="bg-white rounded-xl p-8 mb-8">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="w-24 h-24 bg-entrepedia-gray-50 rounded-full flex-shrink-0 relative overflow-hidden">
                  <Image
                    src="/images/Sara 61kb.webp"
                    alt="Sara Cohen"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="text-entrepedia-dark text-lg italic mb-4">
                    "I've been in your shoes. I know what it's like to invest in something and wonder if it'll work.
                    That's why I'm making you this promise: If you don't love AgentClone, just ask for a refund.
                    No questions. No hassle. I'll process it within 24 hours."
                  </p>
                  <p className="font-bold text-entrepedia-dark">— Sara Cohen</p>
                  <p className="text-sm text-entrepedia-gray-600">Creator of AgentClone</p>
                </div>
              </div>
            </div>

            {/* How to Get Refund */}
            <div className="bg-entrepedia-gray-50 border-2 border-entrepedia-dark rounded-xl p-8">
              <h3 className="text-2xl font-league-spartan font-bold mb-6 text-entrepedia-dark text-center">
                How to Get Your Refund (Takes 30 Seconds)
              </h3>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Email Option */}
                <div className="bg-white border-2 border-entrepedia-dark rounded-xl p-6">
                  <Mail className="w-8 h-8 text-entrepedia-red mb-4" />
                  <h4 className="font-bold text-entrepedia-dark mb-3">Email Us</h4>
                  <p className="text-entrepedia-gray-600 text-sm mb-4">
                    Send this message to support@aifastscale.com:
                  </p>
                  <div className="bg-entrepedia-gray-100 border-2 border-entrepedia-dark rounded p-3 text-sm text-entrepedia-dark font-mono">
                    "Hi, I'd like a refund for my AgentClone purchase. My email is [your email]"
                  </div>
                </div>

                {/* Instagram Option */}
                <div className="bg-white border-2 border-entrepedia-dark rounded-xl p-6">
                  <Instagram className="w-8 h-8 text-entrepedia-red mb-4" />
                  <h4 className="font-bold text-entrepedia-dark mb-3">DM Sara on Instagram</h4>
                  <p className="text-entrepedia-gray-600 text-sm mb-4">
                    Send a DM to @sara.theagent:
                  </p>
                  <div className="bg-entrepedia-gray-100 border-2 border-entrepedia-dark rounded p-3 text-sm text-entrepedia-dark font-mono">
                    "Hey Sara, I'd like a refund for AgentClone"
                  </div>
                  <a
                    href="https://instagram.com/sara.theagent"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-4 text-entrepedia-red hover:text-entrepedia-red-hover transition-colors text-sm font-bold"
                  >
                    → Open Instagram
                  </a>
                </div>
              </div>

              {/* Same-Day Badge */}
              <div className="mt-8 text-center">
                <div className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-full font-bold">
                  <Shield className="w-5 h-5" />
                  Same-Day Refund Guarantee
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== WHO IS SARA? ===== */}
      <section className="py-16 md:py-24 bg-entrepedia-dark">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            {/* Badge */}
            <div className="text-center mb-6">
              <div className="inline-block bg-entrepedia-red text-white px-4 py-2 rounded-full font-bold text-sm">
                MEET YOUR INSTRUCTOR
              </div>
            </div>

            {/* Headline */}
            <h2 className="text-3xl md:text-4xl font-league-spartan font-black text-center mb-12 text-white">
              Who is <span className="text-entrepedia-red">Sara Cohen?</span>
            </h2>

            {/* Two Columns */}
            <div className="grid md:grid-cols-2 gap-12 mb-12">
              {/* Image */}
              <div className="relative aspect-square rounded-xl overflow-hidden bg-entrepedia-gray-50 border-4 border-entrepedia-red">
                <Image
                  src="/images/Sara 61kb.webp"
                  alt="Sara Cohen"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Content */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold mb-2 text-white">Former Top 1% Real Estate Agent</h3>
                  <p className="text-entrepedia-gray-100">
                    I spent 8 years as a luxury real estate agent in Dubai, closing $127M+ in property sales.
                    I know firsthand how hard it is to stand out in a crowded market.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-2 text-white">AI Marketing Pioneer</h3>
                  <p className="text-entrepedia-gray-100">
                    When I discovered AI video technology, everything changed. I went from spending 4 hours per video
                    to creating 50 videos in 7 minutes. My listings got 10x more views.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-2 text-white">Your Personal Success Partner</h3>
                  <p className="text-entrepedia-gray-100">
                    Now I help agents like you leverage AI to get more listings, more leads, and more freedom.
                    I'm personally available via Instagram DM if you ever need help.
                  </p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
              <div className="bg-entrepedia-gray-50 border-2 border-entrepedia-dark rounded-xl p-6 text-center">
                <div className="text-3xl font-black text-entrepedia-red mb-2">$127M+</div>
                <div className="text-sm text-entrepedia-gray-600">Properties Sold</div>
              </div>
              <div className="bg-entrepedia-gray-50 border-2 border-entrepedia-dark rounded-xl p-6 text-center">
                <div className="text-3xl font-black text-entrepedia-red mb-2">8 Years</div>
                <div className="text-sm text-entrepedia-gray-600">Experience</div>
              </div>
              <div className="bg-entrepedia-gray-50 border-2 border-entrepedia-dark rounded-xl p-6 text-center">
                <div className="text-3xl font-black text-entrepedia-red mb-2">500+</div>
                <div className="text-sm text-entrepedia-gray-600">Agents Helped</div>
              </div>
              <div className="bg-entrepedia-gray-50 border-2 border-entrepedia-dark rounded-xl p-6 text-center">
                <div className="text-3xl font-black text-entrepedia-red mb-2">4.9/5</div>
                <div className="text-sm text-entrepedia-gray-600">Rating</div>
              </div>
            </div>

            {/* Testimonial */}
            <div className="bg-white border-2 border-entrepedia-red rounded-xl p-8 text-center">
              <p className="text-xl italic text-entrepedia-dark mb-4">
                "The agents who succeed with AgentClone aren't special or tech-savvy.
                They're just regular agents who decided to stop waiting and start posting.
                That could be you tomorrow."
              </p>
              <p className="font-bold text-entrepedia-dark">— Sara Cohen</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="py-16 md:py-24 bg-entrepedia-dark">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-league-spartan font-black mb-4 text-white">
                See What Real Agents Are <span className="text-entrepedia-red">Saying</span>
              </h2>
              <p className="text-xl text-entrepedia-gray-100">
                Join 847+ agents who transformed their business
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {/* Testimonial 1 */}
              <div className="bg-white rounded-xl p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-entrepedia-dark mb-4 italic">
                  "I closed 3 luxury listings in 2 weeks using these AI videos. My social media engagement increased by 500%.
                  This is a complete game-changer for real estate marketing."
                </p>
                <div className="border-t border-entrepedia-gray-100 pt-4">
                  <p className="font-bold text-entrepedia-dark">Michael Rodriguez</p>
                  <p className="text-sm text-entrepedia-gray-600">Luxury Agent, Dubai Marina</p>
                  <p className="text-sm text-entrepedia-red font-bold mt-1">Result: 3 Listings in 14 Days</p>
                </div>
              </div>

              {/* Testimonial 2 */}
              <div className="bg-white rounded-xl p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-entrepedia-dark mb-4 italic">
                  "I was skeptical about AI, but after seeing my videos get 50,000+ views, I'm a believer.
                  I went from 10 leads per month to 40+ leads. Worth every penny."
                </p>
                <div className="border-t border-entrepedia-gray-100 pt-4">
                  <p className="font-bold text-entrepedia-dark">Fatima Al-Nasser</p>
                  <p className="text-sm text-entrepedia-gray-600">Real Estate Agent, Abu Dhabi</p>
                  <p className="text-sm text-entrepedia-red font-bold mt-1">Result: 4x More Leads</p>
                </div>
              </div>

              {/* Testimonial 3 */}
              <div className="bg-white rounded-xl p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-entrepedia-dark mb-4 italic">
                  "As a new agent, I needed to compete with established agents. AgentClone leveled the playing field.
                  I look just as professional as agents with 20 years experience."
                </p>
                <div className="border-t border-entrepedia-gray-100 pt-4">
                  <p className="font-bold text-entrepedia-dark">James Wilson</p>
                  <p className="text-sm text-entrepedia-gray-600">New Agent, Sharjah</p>
                  <p className="text-sm text-entrepedia-red font-bold mt-1">Result: First Listing in 3 Weeks</p>
                </div>
              </div>

              {/* Additional Testimonials - Show when expanded */}
              {showAllTestimonials && (
                <>
                  {/* Testimonial 4 */}
                  <div className="bg-white rounded-xl p-6">
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>
                    <p className="text-entrepedia-dark mb-4 italic">
                      "My Instagram following grew from 2K to 15K in just 3 months. These videos are pure gold for building authority in the luxury market."
                    </p>
                    <div className="border-t border-entrepedia-gray-100 pt-4">
                      <p className="font-bold text-entrepedia-dark">Ahmed Hassan</p>
                      <p className="text-sm text-entrepedia-gray-600">Luxury Agent, Downtown Dubai</p>
                      <p className="text-sm text-entrepedia-red font-bold mt-1">Result: 650% Follower Growth</p>
                    </div>
                  </div>

                  {/* Testimonial 5 */}
                  <div className="bg-white rounded-xl p-6">
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>
                    <p className="text-entrepedia-dark mb-4 italic">
                      "I landed a $2.5M listing from a client who found me on Instagram. They said my videos made me look like the most professional agent they'd seen."
                    </p>
                    <div className="border-t border-entrepedia-gray-100 pt-4">
                      <p className="font-bold text-entrepedia-dark">Jennifer Park</p>
                      <p className="text-sm text-entrepedia-gray-600">Luxury Realtor, Palm Jumeirah</p>
                      <p className="text-sm text-entrepedia-red font-bold mt-1">Result: $2.5M Listing</p>
                    </div>
                  </div>

                  {/* Testimonial 6 */}
                  <div className="bg-white rounded-xl p-6">
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>
                    <p className="text-entrepedia-dark mb-4 italic">
                      "Best investment I've made in my real estate career. The time savings alone are worth 10x the price. I can create content while driving between showings!"
                    </p>
                    <div className="border-t border-entrepedia-gray-100 pt-4">
                      <p className="font-bold text-entrepedia-dark">Omar Al-Farsi</p>
                      <p className="text-sm text-entrepedia-gray-600">Commercial Agent, Business Bay</p>
                      <p className="text-sm text-entrepedia-red font-bold mt-1">Result: 15 Hours Saved/Week</p>
                    </div>
                  </div>

                  {/* Testimonial 7 */}
                  <div className="bg-white rounded-xl p-6">
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>
                    <p className="text-entrepedia-dark mb-4 italic">
                      "My listing presentations are 100% better now. I show clients my marketing videos and they're blown away. I've won 8 out of my last 10 pitches."
                    </p>
                    <div className="border-t border-entrepedia-gray-100 pt-4">
                      <p className="font-bold text-entrepedia-dark">Sarah Martinez</p>
                      <p className="text-sm text-entrepedia-gray-600">Agent, Arabian Ranches</p>
                      <p className="text-sm text-entrepedia-red font-bold mt-1">Result: 80% Win Rate</p>
                    </div>
                  </div>

                  {/* Testimonial 8 */}
                  <div className="bg-white rounded-xl p-6">
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>
                    <p className="text-entrepedia-dark mb-4 italic">
                      "I was spending $500/month on a videographer. Now I create better videos myself in minutes. This has already saved me thousands."
                    </p>
                    <div className="border-t border-entrepedia-gray-100 pt-4">
                      <p className="font-bold text-entrepedia-dark">David Chen</p>
                      <p className="text-sm text-entrepedia-gray-600">Agent, Jumeirah Lakes Towers</p>
                      <p className="text-sm text-entrepedia-red font-bold mt-1">Result: $6,000 Saved</p>
                    </div>
                  </div>

                  {/* Testimonial 9 */}
                  <div className="bg-white rounded-xl p-6">
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>
                    <p className="text-entrepedia-dark mb-4 italic">
                      "My broker asked me to train the entire office on video marketing after seeing my results. AgentClone made me the go-to expert on our team."
                    </p>
                    <div className="border-t border-entrepedia-gray-100 pt-4">
                      <p className="font-bold text-entrepedia-dark">Aisha Mohammed</p>
                      <p className="text-sm text-entrepedia-gray-600">Senior Agent, Al Barsha</p>
                      <p className="text-sm text-entrepedia-red font-bold mt-1">Result: Team Leader Promotion</p>
                    </div>
                  </div>

                  {/* Testimonial 10 */}
                  <div className="bg-white rounded-xl p-6">
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>
                    <p className="text-entrepedia-dark mb-4 italic">
                      "The bonuses alone are worth more than the price. The Instagram templates saved me hours of work and my engagement is through the roof!"
                    </p>
                    <div className="border-t border-entrepedia-gray-100 pt-4">
                      <p className="font-bold text-entrepedia-dark">Robert Thompson</p>
                      <p className="text-sm text-entrepedia-gray-600">Agent, The Greens</p>
                      <p className="text-sm text-entrepedia-red font-bold mt-1">Result: 3x Engagement Rate</p>
                    </div>
                  </div>

                  {/* Testimonial 11 */}
                  <div className="bg-white rounded-xl p-6">
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>
                    <p className="text-entrepedia-dark mb-4 italic">
                      "I got my first international buyer through my AI videos. They saw my content from London and flew to Dubai specifically to work with me!"
                    </p>
                    <div className="border-t border-entrepedia-gray-100 pt-4">
                      <p className="font-bold text-entrepedia-dark">Layla Khalid</p>
                      <p className="text-sm text-entrepedia-gray-600">Luxury Agent, Emirates Hills</p>
                      <p className="text-sm text-entrepedia-red font-bold mt-1">Result: International Client</p>
                    </div>
                  </div>

                  {/* Testimonial 12 */}
                  <div className="bg-white rounded-xl p-6">
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>
                    <p className="text-entrepedia-dark mb-4 italic">
                      "Sara's support is incredible. She personally helped me when I got stuck and I was creating videos within 30 minutes. The guarantee is real!"
                    </p>
                    <div className="border-t border-entrepedia-gray-100 pt-4">
                      <p className="font-bold text-entrepedia-dark">Marcus Johnson</p>
                      <p className="text-sm text-entrepedia-gray-600">New Agent, Dubai Sports City</p>
                      <p className="text-sm text-entrepedia-red font-bold mt-1">Result: Up & Running in 30 Min</p>
                    </div>
                  </div>

                  {/* Testimonial 13 */}
                  <div className="bg-white rounded-xl p-6">
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>
                    <p className="text-entrepedia-dark mb-4 italic">
                      "My wife couldn't believe the videos were AI. Even my tech-savvy clients think I'm filming these myself. The quality is unbelievable."
                    </p>
                    <div className="border-t border-entrepedia-gray-100 pt-4">
                      <p className="font-bold text-entrepedia-dark">Tariq Al-Rashid</p>
                      <p className="text-sm text-entrepedia-gray-600">Agent, Dubai Silicon Oasis</p>
                      <p className="text-sm text-entrepedia-red font-bold mt-1">Result: Ultra-Realistic Videos</p>
                    </div>
                  </div>

                  {/* Testimonial 14 */}
                  <div className="bg-white rounded-xl p-6">
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>
                    <p className="text-entrepedia-dark mb-4 italic">
                      "I'm not tech-savvy AT ALL. If I can do this, literally anyone can. The training is so simple my 70-year-old dad could follow it."
                    </p>
                    <div className="border-t border-entrepedia-gray-100 pt-4">
                      <p className="font-bold text-entrepedia-dark">Nina Patel</p>
                      <p className="text-sm text-entrepedia-gray-600">Agent, International City</p>
                      <p className="text-sm text-entrepedia-red font-bold mt-1">Result: Non-Tech Success</p>
                    </div>
                  </div>

                  {/* Testimonial 15 */}
                  <div className="bg-white rounded-xl p-6">
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>
                    <p className="text-entrepedia-dark mb-4 italic">
                      "ROI in 48 hours. I got a listing worth $18K commission two days after posting my first video. This is the best $37 I've ever spent."
                    </p>
                    <div className="border-t border-entrepedia-gray-100 pt-4">
                      <p className="font-bold text-entrepedia-dark">Carlos Rivera</p>
                      <p className="text-sm text-entrepedia-gray-600">Agent, Jumeirah Village Circle</p>
                      <p className="text-sm text-entrepedia-red font-bold mt-1">Result: $18K Commission in 48hrs</p>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* See All Reviews Button */}
            {!showAllTestimonials && (
              <div className="text-center mb-12">
                <button
                  onClick={() => setShowAllTestimonials(true)}
                  className="inline-flex items-center gap-2 bg-white hover:bg-entrepedia-gray-50 text-entrepedia-dark px-8 py-4 rounded-lg font-bold text-lg transition-all border-2 border-white"
                >
                  <span>See All 15 Reviews</span>
                  <ChevronDown className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* Overall Stats */}
            <div className="bg-white/10 border border-white/20 rounded-xl p-8">
              <div className="grid grid-cols-3 gap-8 text-center">
                <div>
                  <div className="text-4xl font-black text-entrepedia-red mb-2">847+</div>
                  <div className="text-white text-sm">Agents Transformed</div>
                </div>
                <div>
                  <div className="text-4xl font-black text-entrepedia-red mb-2">10,000+</div>
                  <div className="text-white text-sm">Videos Created</div>
                </div>
                <div>
                  <div className="text-4xl font-black text-entrepedia-red mb-2">4.9/5</div>
                  <div className="text-white text-sm">Average Rating</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== GUARANTEE #2 - TRIPLE GUARANTEE ===== */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Shield Icon */}
            <div className="text-center mb-8">
              <Shield className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <div className="inline-block bg-green-100 border-2 border-green-600 text-green-600 px-4 py-2 rounded-full font-bold text-sm mb-6">
                GUARANTEE #2
              </div>
              <h2 className="text-3xl md:text-4xl font-league-spartan font-black mb-4 text-entrepedia-dark">
                Our Iron-Clad <span className="text-entrepedia-red">Triple Guarantee</span>
              </h2>
            </div>

            {/* Three Guarantees */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-green-50 border-2 border-green-600 rounded-xl p-6 text-center">
                <Clock className="w-10 h-10 text-green-600 mx-auto mb-4" />
                <h3 className="font-bold mb-2 text-entrepedia-dark">7-Minute Guarantee</h3>
                <p className="text-sm text-entrepedia-gray-600">
                  If it takes longer than 7 minutes to create your first video, we'll refund you in full.
                </p>
              </div>

              <div className="bg-green-50 border-2 border-green-600 rounded-xl p-6 text-center">
                <Award className="w-10 h-10 text-green-600 mx-auto mb-4" />
                <h3 className="font-bold mb-2 text-entrepedia-dark">Quality Guarantee</h3>
                <p className="text-sm text-entrepedia-gray-600">
                  If your videos don't look professional, we'll work with you until they do - or refund you.
                </p>
              </div>

              <div className="bg-green-50 border-2 border-green-600 rounded-xl p-6 text-center">
                <Shield className="w-10 h-10 text-green-600 mx-auto mb-4" />
                <h3 className="font-bold mb-2 text-entrepedia-dark">30-Day Money-Back</h3>
                <p className="text-sm text-entrepedia-gray-600">
                  For any reason, anytime within 30 days, just ask for a refund. No questions asked.
                </p>
              </div>
            </div>

            {/* Why Can We Offer This */}
            <div className="bg-green-600 text-white rounded-xl p-8 text-center">
              <h3 className="text-2xl font-league-spartan font-bold mb-4">Why Can We Offer This Guarantee?</h3>
              <p className="text-lg">
                Simple: We have a 97% satisfaction rate. Out of 847 agents, only 26 have asked for refunds.
                And all of them got their money back same-day. We're confident you'll love AgentClone.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="py-16 md:py-24 bg-entrepedia-dark">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-league-spartan font-black mb-4 text-white">
                Frequently Asked <span className="text-entrepedia-red">Questions</span>
              </h2>
            </div>

            <div className="space-y-4">
              {[
                {
                  q: 'How long does it really take to create videos?',
                  a: 'Exactly 7 minutes. Upload your photo (1 min), type your script (2 min), AI generates video (3 min), download (1 min). That\'s it. No editing required.',
                },
                {
                  q: 'Will this work for UAE/Dubai real estate specifically?',
                  a: 'Absolutely! 847+ UAE agents are already using this. Works perfectly for Dubai, Abu Dhabi, Sharjah, and all Emirates. The AI supports multiple languages including English and Arabic.',
                },
                {
                  q: 'Do I need to film myself or be on camera?',
                  a: 'No! Just upload ONE professional headshot. The AI creates realistic talking videos - you never need to film yourself again. No camera, no lighting, no video equipment needed.',
                },
                {
                  q: 'Can people tell it\'s AI? Will it look fake?',
                  a: 'The videos look so real that most people can\'t tell. The AI uses advanced lip-sync technology. Your clients will focus on your message, not the technology.',
                },
                {
                  q: 'What if I\'m not tech-savvy?',
                  a: 'Perfect! This is designed for non-technical agents. If you can upload a photo and type text, you can do this. Plus, Sara provides step-by-step video training and personal support via Instagram.',
                },
                {
                  q: 'What\'s your refund policy?',
                  a: '100% money-back guarantee for 30 days. Just email support@aifastscale.com or DM Sara on Instagram (@sara.theagent). We process refunds within 24 hours, no questions asked.',
                },
              ].map((faq, i) => (
                <div
                  key={i}
                  className="bg-white/10 border border-white/20 rounded-xl overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                    className="flex items-center justify-between p-6 w-full text-left hover:bg-white/5 transition-colors"
                  >
                    <h4 className="font-bold text-lg pr-4 text-white">{faq.q}</h4>
                    <ChevronDown
                      className={`w-5 h-5 text-entrepedia-gray-100 flex-shrink-0 transition-transform ${
                        expandedFaq === i ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {expandedFaq === i && (
                    <div className="px-6 pb-6">
                      <p className="text-entrepedia-gray-100">{faq.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-entrepedia-red via-entrepedia-red-hover to-entrepedia-red">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            {/* Countdown */}
            <div className="inline-flex items-center gap-4 bg-black/30 border-2 border-white rounded-xl px-6 py-6 mb-8">
              <Clock className="w-6 h-6 text-white" />
              <div className="flex gap-3">
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-black text-white">{String(timeLeft.hours).padStart(2, '0')}</div>
                  <div className="text-xs text-white/70 uppercase">Hours</div>
                </div>
                <div className="text-2xl md:text-3xl font-black text-white self-center">:</div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-black text-white">{String(timeLeft.minutes).padStart(2, '0')}</div>
                  <div className="text-xs text-white/70 uppercase">Mins</div>
                </div>
                <div className="text-2xl md:text-3xl font-black text-white self-center">:</div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-black text-white">{String(timeLeft.seconds).padStart(2, '0')}</div>
                  <div className="text-xs text-white/70 uppercase">Secs</div>
                </div>
              </div>
            </div>

            <h2 className="text-3xl md:text-5xl font-league-spartan font-black mb-6 text-white">
              Don't Let This 92% Discount Slip Away
            </h2>

            <p className="text-xl text-white/90 mb-8">
              In {timeLeft.hours}h {timeLeft.minutes}m, the price jumps from $37 to $97.
              <br />
              Don't let your competitors get ahead while you wait.
            </p>

            {/* Pricing Box */}
            <div className="inline-block bg-white rounded-xl p-8 mb-8">
              <div className="flex items-baseline justify-center gap-3 mb-2">
                <span className="text-5xl font-black text-entrepedia-dark line-through opacity-50">$2,556</span>
                <span className="text-7xl font-black text-entrepedia-red">$37</span>
              </div>
              <p className="text-green-600 font-bold text-lg">98% OFF - Black Friday Only</p>
            </div>

            {/* CTA Button */}
            <div className="mb-8">
              <a
                href="#choose-path"
                className="inline-flex items-center gap-3 bg-entrepedia-dark hover:bg-black text-white px-12 py-6 rounded-lg font-league-spartan font-black text-2xl transition-all shadow-2xl"
              >
                <span>Claim Your Spot Now - $37</span>
                <ArrowRight className="w-6 h-6" />
              </a>
            </div>

            {/* Final Psychology */}
            <div className="bg-black/20 border border-white/30 rounded-xl p-6">
              <p className="text-white text-lg">
                <span className="font-bold">Here's the reality:</span> While you're thinking about it,
                another agent just created their first video and posted it. They're getting views, engagement,
                and leads right now. The question isn't "Should I do this?" - it's "How fast can I get started?"
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="py-12 bg-entrepedia-dark border-t border-white/10">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              {/* Brand */}
              <div className="md:col-span-2">
                <h3 className="text-2xl font-league-spartan font-black mb-3 text-entrepedia-red">AIFastScale</h3>
                <p className="text-entrepedia-gray-100 text-sm mb-4">
                  The #1 AI video platform for real estate agents. Turn 1 photo into 50 personalized videos in 7 minutes.
                </p>
                <div className="flex items-center gap-2 text-sm text-entrepedia-gray-400">
                  <Shield className="w-4 h-4" />
                  <span>SSL Secure Checkout</span>
                </div>
              </div>

              {/* Legal */}
              <div>
                <h4 className="font-bold mb-3 text-white">Legal</h4>
                <ul className="space-y-2 text-sm text-entrepedia-gray-100">
                  <li>
                    <a href="/terms-of-service" className="hover:text-white transition-colors">
                      Terms of Service
                    </a>
                  </li>
                  <li>
                    <a href="/privacy-policy" className="hover:text-white transition-colors">
                      Privacy Policy
                    </a>
                  </li>
                  <li>
                    <a href="/refund-policy" className="hover:text-white transition-colors">
                      Refund Policy
                    </a>
                  </li>
                  <li>
                    <a href="/disclaimer" className="hover:text-white transition-colors">
                      Disclaimer
                    </a>
                  </li>
                </ul>
              </div>

              {/* Support */}
              <div>
                <h4 className="font-bold mb-3 text-white">Support</h4>
                <ul className="space-y-2 text-sm text-entrepedia-gray-100">
                  <li className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <a href="mailto:support@aifastscale.com" className="hover:text-white transition-colors">
                      support@aifastscale.com
                    </a>
                  </li>
                  <li className="flex items-center gap-2">
                    <Instagram className="w-4 h-4" />
                    <a href="https://instagram.com/sara.theagent" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                      @sara.theagent
                    </a>
                  </li>
                  <li className="text-entrepedia-gray-400 text-xs mt-2">
                    Response time: &lt;24 hours
                  </li>
                </ul>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="border-t border-white/10 pt-8 mb-8">
              <div className="flex flex-wrap justify-center gap-6 text-sm text-entrepedia-gray-400">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span>30-Day Money-Back Guarantee</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Instant Access</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-green-500" />
                  <span>847+ Happy Agents</span>
                </div>
              </div>
            </div>

            {/* Earnings Disclaimer */}
            <div className="border-t border-white/10 pt-8 text-center text-xs text-entrepedia-gray-400">
              <p className="mb-2">
                <strong>EARNINGS DISCLAIMER:</strong> Results shown are not typical. Your success depends on your effort,
                market conditions, and implementation. We make no guarantee of specific results.
              </p>
              <p>© 2025 AIFastScale. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>

      {/* ===== ORDER SUMMARY MODAL ===== */}
      {showOrderModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div
            ref={orderModalRef}
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 md:p-8">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl md:text-3xl font-league-spartan font-black text-entrepedia-dark">
                  Your Complete Package
                </h3>
                <button
                  onClick={() => setShowOrderModal(false)}
                  className="text-entrepedia-gray-600 hover:text-entrepedia-dark transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Course */}
              <div className="mb-6">
                <div className="bg-entrepedia-red/10 border-2 border-entrepedia-red rounded-xl p-4">
                  <div className="flex items-start gap-4">
                    <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
                      <Image
                        src="/images/VD-Course-demo.webp"
                        alt="AgentClone Course"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-entrepedia-dark mb-1">7-Minute AgentClone™ Course</h4>
                      <p className="text-sm text-entrepedia-gray-600 mb-2">Complete system to create 50 AI videos</p>
                      <span className="text-lg font-black text-entrepedia-red">$697 Value</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Selected Bonuses */}
              <div className="mb-6">
                <h4 className="font-bold text-entrepedia-dark mb-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  Your 5 Selected Bonuses (100% FREE)
                </h4>
                <div className="space-y-2">
                  {BONUS_PRODUCTS.filter((b) => selectedBonuses.includes(b.id)).map((bonus) => (
                    <div key={bonus.id} className="bg-green-50 border border-green-600 rounded-lg p-3 flex items-center gap-3">
                      {bonus.image && (
                        <div className="relative w-12 h-12 flex-shrink-0 rounded overflow-hidden">
                          <Image
                            src={bonus.image}
                            alt={bonus.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="font-bold text-sm text-entrepedia-dark">{bonus.title}</p>
                        <p className="text-xs text-entrepedia-gray-600">${bonus.value} value</p>
                      </div>
                      <span className="text-green-600 font-black text-sm">FREE</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mystery VIP Box */}
              <div className="mb-6">
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-600 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <Package className="w-12 h-12 text-purple-600 flex-shrink-0" strokeWidth={1.5} />
                    <div className="flex-1">
                      <h4 className="font-bold text-entrepedia-dark mb-1">Mystery VIP Box</h4>
                      <p className="text-sm text-entrepedia-gray-600 mb-1">
                        Surprise ultra-premium bonus
                      </p>
                      <span className="text-lg font-black text-purple-600">$500-$1,500 Value - FREE!</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Total Value Breakdown */}
              <div className="bg-entrepedia-gray-50 rounded-xl p-6 mb-6">
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-entrepedia-gray-600">AgentClone Course</span>
                    <span className="font-bold text-entrepedia-dark">$697</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-entrepedia-gray-600">5 Premium Bonuses</span>
                    <span className="font-bold text-entrepedia-dark">${totalValue}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-entrepedia-gray-600">Mystery VIP Box</span>
                    <span className="font-bold text-entrepedia-dark">$500-$1,500</span>
                  </div>
                  <div className="border-t-2 border-entrepedia-gray-400 pt-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-lg font-bold text-entrepedia-dark">Total Value</span>
                      <span className="text-2xl font-black text-entrepedia-gray-400 line-through">$3,062+</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-black text-entrepedia-dark">You Pay Today</span>
                      <span className="text-4xl font-black text-entrepedia-red">$37</span>
                    </div>
                  </div>
                </div>
                <div className="bg-green-100 border-2 border-green-600 rounded-lg p-3 text-center">
                  <span className="text-green-600 font-black text-lg">You Save $3,025+ (98% OFF!)</span>
                </div>
              </div>

              {/* Guarantee Badge */}
              <div className="bg-green-50 border border-green-600 rounded-lg p-4 mb-6 text-center">
                <Shield className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-sm font-bold text-green-600">30-Day Money-Back Guarantee</p>
                <p className="text-xs text-entrepedia-gray-600 mt-1">100% Risk-Free - Full Refund if Not Satisfied</p>
              </div>

              {/* Confirm Button */}
              <button
                onClick={confirmOrder}
                className="w-full bg-entrepedia-red hover:bg-entrepedia-red-hover text-white px-8 py-5 rounded-xl font-league-spartan font-black text-xl transition-all shadow-xl flex items-center justify-center gap-3"
              >
                <span>Claim This Deal - $37</span>
                <ArrowRight className="w-6 h-6" />
              </button>

              <p className="text-center text-sm text-entrepedia-gray-600 mt-4">
                Secure checkout powered by Whop • Instant access
              </p>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
