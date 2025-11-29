'use client'

import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { WhopCheckoutEmbed, useCheckoutEmbedControls } from '@whop/checkout/react'
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
  X,
  Award,
  Target,
  TrendingDown,
  Sparkles,
  ArrowRight,
  Mail,
  Instagram,
  Package,
  AlertCircle,
  Video,
  DollarSign,
  Eye,
  Phone,
} from 'lucide-react'
import Image from 'next/image'
import { BONUS_PRODUCTS } from './config/bonus-products'
import type { BonusProduct } from './config/bonus-products'

// Top 4 pre-selected bonuses
const TOP_4_BONUSES = ['90-day-blueprint', 'instagram-stories-templates', 'hooks-impossible-to-skip', 'instagram-dm-scripts']

export default function LuxuryLanding() {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 })
  const [spotsLeft] = useState(7) // Lower number = more urgency
  const [liveViewers] = useState(23) // Simulated live viewers
  const [selectedMode, setSelectedMode] = useState<'expert' | 'custom' | null>(null)
  const [selectedBonuses, setSelectedBonuses] = useState<string[]>(TOP_4_BONUSES)
  const [showMrLucasVideo, setShowMrLucasVideo] = useState(false)
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [showAllReviews, setShowAllReviews] = useState(false)
  const bonusGridRef = useRef<HTMLDivElement>(null)
  const checkoutRef = useCheckoutEmbedControls()

  // Track client-side mount for portal
  useEffect(() => {
    setIsMounted(true)
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

  // NO LAZY LOADING - All content loads immediately for better mobile UX

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

  // Toggle bonus
  const toggleBonus = (id: string) => {
    if (selectedMode === 'expert' && TOP_4_BONUSES.includes(id)) return
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

  // BRAND NEW MODAL HANDLERS - Built from scratch
  const openModal = () => {
    if (selectedBonuses.length === 5) {
      setIsModalOpen(true)
      document.body.style.overflow = 'hidden' // Prevent background scroll
    } else {
      alert('Please select exactly 5 bonuses first!')
    }
  }

  const closeModal = () => {
    setIsModalOpen(false)
    document.body.style.overflow = '' // Restore scroll
  }

  // CLEANUP EFFECT - Forcefully restore scroll when modal closes or component unmounts
  useEffect(() => {
    if (!isModalOpen) {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = '' // Always restore on unmount
    }
  }, [isModalOpen])

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

  return (
    <div className="min-h-screen bg-luxury-black font-dm-sans text-white luxury-page-enter">
      {/* ELEGANT STICKY HEADER */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-luxury-black/95 backdrop-blur-md border-b border-luxury-gold/10">
        <div className="w-full px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="text-xl sm:text-2xl font-dm-serif italic">
              <span className="luxury-text-gradient">AgentClone</span>
            </div>
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="hidden sm:flex items-center gap-2 text-luxury-gold-light text-sm">
                <Clock className="w-4 h-4" />
                <span className="font-mono">
                  {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
                </span>
              </div>
              <button
                onClick={openModal}
                className="luxury-button bg-luxury-gold text-luxury-black px-4 sm:px-6 py-2 rounded-md font-bold text-xs sm:text-sm hover:bg-luxury-gold-light transition-all"
              >
                Lock In $37 Price - {spotsLeft} Left
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Spacer */}
      <div className="h-16" />

      {/* HERO SECTION - Outcome-Focused Dream Copy */}
      <section className="relative py-8 sm:py-12 md:py-16 bg-gradient-to-b from-[#0a0a0a] via-[#0f0f0f] to-[#0a0a0a] overflow-hidden">
        <div className="w-full px-3 sm:px-6 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">

              {/* LEFT: Copy */}
              <div className="text-center lg:text-left order-1 lg:order-1">
                {/* Minimalist Social Proof */}
                <div className="mb-6 sm:mb-8 flex items-center justify-center lg:justify-start gap-3 text-white/60 text-xs sm:text-sm">
                  <div className="flex items-center gap-1.5">
                    <div className="flex -space-x-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-luxury-gold to-luxury-gold-light border border-white/20"></div>
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 border border-white/20"></div>
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 border border-white/20"></div>
                    </div>
                    <span className="font-medium">847+ Agents</span>
                  </div>
                  <span className="text-white/20">|</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-luxury-gold fill-luxury-gold" />
                    <span className="font-medium">4.9/5</span>
                  </div>
                </div>

                {/* Dream-Outcome Headline */}
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-4 sm:mb-6 leading-[1.05] tracking-tight">
                  <span className="text-white/90">Never Film Again.</span>
                  <br />
                  <span className="bg-gradient-to-r from-luxury-gold via-luxury-gold-light to-luxury-gold bg-clip-text text-transparent">Still Close More.</span>
                </h1>

                {/* Transformation Story - Selling the Dream */}
                <p className="text-base sm:text-lg md:text-xl text-white/70 max-w-2xl mx-auto lg:mx-0 mb-8 sm:mb-10 leading-relaxed">
                  Wake up to qualified buyer leads. <span className="text-white font-bold">Build a 7-figure brand</span> from your couch. No filming, no editing, no awkward videos—just <span className="text-luxury-gold font-bold">results while you sleep.</span>
                </p>

                {/* Primary CTA - Outcome Focused */}
                <div className="mb-6 sm:mb-8">
                  <button
                    onClick={openModal}
                    className="group inline-flex items-center gap-3 bg-gradient-to-r from-luxury-gold via-luxury-gold-light to-luxury-gold hover:shadow-2xl hover:shadow-luxury-gold/40 text-luxury-black px-8 py-4 sm:px-10 sm:py-5 rounded-xl text-lg sm:text-xl font-black transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-xl"
                  >
                    <span>Start Your Transformation</span>
                    <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:translate-x-1" />
                  </button>
                  <p className="text-xs sm:text-sm text-white/40 mt-3 sm:mt-4 font-medium">
                    Only {spotsLeft} spots left at <span className="text-white/60 font-bold">$37</span> <span className="line-through">$97</span>
                  </p>
                </div>

                {/* Outcome Benefits - What They'll Experience */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-2 text-xs sm:text-sm text-white/50">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span>5-15 leads this week</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span>Camera-shy approved</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span>Works in 7 minutes</span>
                  </div>
                </div>
              </div>

              {/* RIGHT: Hero Image - Lifestyle/Success/Freedom */}
              <div className="order-2 lg:order-2">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  {/* Success/Freedom Image */}
                  <div className="relative aspect-[4/3] sm:aspect-[16/10]">
                    <Image
                      src="/images/P1_result.webp"
                      alt="Successful real estate agent living the dream"
                      fill
                      className="object-cover"
                      priority
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      quality={90}
                    />
                    {/* Gradient overlay for better text contrast */}
                    <div className="absolute inset-0 bg-gradient-to-t from-luxury-black/60 via-luxury-black/20 to-transparent"></div>

                    {/* Floating success metric */}
                    <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6">
                      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-3 sm:p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-luxury-gold to-luxury-gold-dark rounded-xl flex items-center justify-center shadow-lg">
                            <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-luxury-black" />
                          </div>
                          <div>
                            <div className="text-white text-lg sm:text-xl font-black">$127M+ Closed</div>
                            <div className="text-white/70 text-xs sm:text-sm">Without filming once</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-luxury-gold/5 to-transparent opacity-30 pointer-events-none"></div>
      </section>

      {/* SARA'S IRONCLAD GUARANTEE */}
      <section className="py-8 sm:py-10 md:py-16 bg-white">
        <div className="w-full px-3 sm:px-6">
          <div className="max-w-5xl mx-auto">
            {/* Main Guarantee Card */}
            <div className="relative bg-gradient-to-br from-luxury-gold-pale via-white to-luxury-pearl rounded-3xl shadow-2xl border-2 border-luxury-gold overflow-hidden">
              {/* Verified Badge */}
              <div className="absolute top-6 right-6">
                <div className="bg-green-600 text-white px-4 py-2 rounded-full flex items-center gap-2 shadow-lg animate-pulse">
                  <Shield className="w-4 h-4" />
                  <span className="text-xs font-black tracking-wider">VERIFIED RESULT - 100% REAL</span>
                </div>
              </div>

              <div className="p-5 sm:p-8 md:p-10">
                <div className="flex flex-col md:flex-row gap-5 sm:gap-7 items-start">
                  {/* Sara's Image */}
                  <div className="relative flex-shrink-0">
                    <div className="absolute inset-0 bg-luxury-gold rounded-2xl blur-xl opacity-30 animate-pulse"></div>
                    <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-2xl overflow-hidden border-4 border-luxury-gold shadow-2xl">
                      <Image
                        src="/images/Sara 61kb.webp"
                        alt="Sara Cohen"
                        fill
                        className="object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-black shadow-lg">
                      VERIFIED ✓
                    </div>
                  </div>

                  {/* Guarantee Content */}
                  <div className="flex-1">
                    <div className="mb-4 sm:mb-5">
                      <h2 className="text-2xl sm:text-3xl md:text-4xl font-league-spartan font-black text-luxury-black mb-2 sm:mb-3">
                        My Personal <span className="luxury-text-gradient">No-Risk Promise</span>
                      </h2>
                      <p className="text-base sm:text-lg md:text-xl text-gray-700 font-semibold">
                        I'm so confident this works, I'll pay YOU $50 if it doesn't.
                      </p>
                    </div>

                    {/* Quote Box */}
                    <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-lg border-l-4 border-luxury-gold mb-4 sm:mb-5">
                      <p className="text-gray-800 text-base sm:text-lg leading-relaxed mb-4 italic">
                        "Here's my promise to you: Try AgentClone for 30 days. If you don't get at least ONE new listing lead from your AI videos, I'll refund every penny — <span className="font-black text-luxury-gold">PLUS send you $50 for wasting your time.</span>"
                      </p>
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-luxury-gold">
                          <Image
                            src="/images/Sara 61kb.webp"
                            alt="Sara signature"
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-black text-luxury-black">Sara Cohen</p>
                          <p className="text-sm text-gray-600">$127M in Career Sales</p>
                        </div>
                      </div>
                    </div>

                    {/* Guarantee Breakdown */}
                    <div className="grid sm:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-5">
                      <div className="bg-green-50 rounded-xl p-4 border-2 border-green-200">
                        <div className="text-3xl font-black text-green-600 mb-1">30 Days</div>
                        <p className="text-sm text-gray-700 font-semibold">Full money-back guarantee</p>
                      </div>
                      <div className="bg-luxury-gold-pale rounded-xl p-4 border-2 border-luxury-gold">
                        <div className="text-3xl font-black text-luxury-gold mb-1">+ $50</div>
                        <p className="text-sm text-gray-700 font-semibold">Bonus if it doesn't work</p>
                      </div>
                      <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-200">
                        <div className="text-3xl font-black text-blue-600 mb-1">0 Risk</div>
                        <p className="text-sm text-gray-700 font-semibold">No questions asked</p>
                      </div>
                    </div>

                    {/* Why This Works */}
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                        <p className="text-gray-700 font-semibold">You literally can't lose money — worst case, you PROFIT $50</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                        <p className="text-gray-700 font-semibold">No hoops to jump through — if you're not happy, you get refunded + $50</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                        <p className="text-gray-700 font-semibold">I've helped 847+ agents — I know this works, so I can offer this guarantee</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom CTA */}
                <div className="mt-5 sm:mt-6 pt-5 sm:pt-6 border-t-2 border-luxury-gold/20">
                  <div className="text-center">
                    <p className="text-xl sm:text-2xl font-black text-luxury-black mb-3">
                      The Only Question Is: <span className="luxury-text-gradient">What Do You Have To Lose?</span>
                    </p>
                    <p className="text-base sm:text-lg text-gray-600 mb-4">
                      (Literally nothing. In fact, worst case scenario, you profit $50.)
                    </p>
                    <button
                      onClick={openModal}
                      className="inline-flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-luxury-gold to-luxury-gold-light hover:from-luxury-gold-light hover:to-luxury-gold text-luxury-black px-6 py-3 sm:px-8 sm:py-4 rounded-xl sm:rounded-2xl font-league-spartan font-black text-base sm:text-lg shadow-2xl hover:scale-105 active:scale-100 transition-all"
                    >
                      <Shield className="w-5 h-5 sm:w-6 sm:h-6" />
                      <span>Get Started Risk-Free</span>
                      <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>
                    <p className="text-xs sm:text-sm text-gray-500 mt-3">
                      <CheckCircle className="w-4 h-4 text-green-500 inline" /> Black Friday Special: Only {spotsLeft} spots left at $37 (was $97)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BONUS MODE SELECTOR - PREMIUM REDESIGN */}
      <section className="relative py-8 sm:py-16 md:py-20 bg-luxury-black overflow-hidden">
        {/* Premium Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-luxury-black via-luxury-graphite to-luxury-black opacity-90"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-luxury-gold/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-luxury-gold/5 rounded-full blur-3xl"></div>

        <div className="w-full px-3 sm:px-6 relative z-10">
          <div className="max-w-7xl mx-auto">
            {/* Premium Header */}
            <div className="text-center mb-6 sm:mb-10">
              <div className="inline-block mb-4 sm:mb-5">
                <div className="flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-luxury-gold/20 via-luxury-gold/10 to-luxury-gold/20 backdrop-blur-sm border border-luxury-gold/30 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-luxury-gold rounded-full animate-pulse"></div>
                  <Gift className="w-4 h-4 sm:w-5 sm:h-5 text-luxury-gold" />
                  <span className="text-luxury-gold font-black text-xs sm:text-sm tracking-widest">BUILD YOUR EXCLUSIVE BUNDLE</span>
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-luxury-gold rounded-full animate-pulse"></div>
                </div>
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-league-spartan font-black mb-4 sm:mb-5 leading-tight px-4">
                <span className="text-white">Choose Your </span>
                <span className="block mt-1 sm:mt-2 bg-gradient-to-r from-luxury-gold via-luxury-gold-light to-luxury-gold bg-clip-text text-transparent">
                  5 Premium Bonuses
                </span>
              </h2>

              <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 px-4">
                <div className="h-px w-8 sm:w-12 bg-gradient-to-r from-transparent to-luxury-gold"></div>
                <p className="text-lg sm:text-xl md:text-2xl text-gray-300 font-semibold">
                  Worth up to <span className="text-luxury-gold font-black text-2xl sm:text-3xl">$325</span>
                </p>
                <div className="h-px w-8 sm:w-12 bg-gradient-to-l from-transparent to-luxury-gold"></div>
              </div>
              <p className="text-base sm:text-lg text-gray-400">100% FREE when you join today</p>
            </div>

            {/* Premium Cards Grid */}
            <div className="grid lg:grid-cols-2 gap-5 sm:gap-7 max-w-6xl mx-auto">
              {/* SARA'S EXPERT SELECTION - Premium Card */}
              <div className="group relative">
                {/* Premium Badge */}
                <div className="absolute -top-3 sm:-top-4 left-1/2 transform -translate-x-1/2 z-20">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-luxury-gold to-luxury-gold-dark rounded-full blur-lg opacity-75 animate-pulse"></div>
                    <div className="relative bg-gradient-to-r from-luxury-gold via-luxury-gold-light to-luxury-gold px-4 py-2 sm:px-6 sm:py-2.5 rounded-full shadow-2xl flex items-center gap-2">
                      <Award className="w-4 h-4 sm:w-5 sm:h-5 text-luxury-black" />
                      <span className="text-luxury-black font-black text-xs sm:text-sm tracking-wider">SARA'S RECOMMENDATION</span>
                      <Award className="w-4 h-4 sm:w-5 sm:h-5 text-luxury-black" />
                    </div>
                  </div>
                </div>

                {/* Main Card */}
                <div className="relative mt-6 sm:mt-7 bg-gradient-to-br from-white via-luxury-pearl to-luxury-gold-pale rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border-2 border-luxury-gold/50 hover:border-luxury-gold transition-all duration-500 hover:shadow-luxury-gold/20 hover:shadow-3xl hover:-translate-y-2">
                  {/* Decorative Corner */}
                  <div className="absolute top-0 right-0 w-20 h-20 sm:w-32 sm:h-32 bg-gradient-to-br from-luxury-gold/20 to-transparent rounded-bl-full"></div>
                  <div className="absolute bottom-0 left-0 w-20 h-20 sm:w-32 sm:h-32 bg-gradient-to-tr from-luxury-gold/20 to-transparent rounded-tr-full"></div>

                  <div className="relative p-5 sm:p-7 md:p-8">
                    {/* Premium Icon */}
                    <div className="mb-5 sm:mb-6">
                      <div className="relative inline-block">
                        <div className="absolute inset-0 bg-luxury-gold rounded-2xl sm:rounded-3xl blur-xl opacity-30 animate-pulse"></div>
                        <div className="relative w-14 h-14 sm:w-16 sm:h-16 md:w-18 md:h-18 bg-gradient-to-br from-luxury-gold via-luxury-gold-light to-luxury-gold-dark rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-2xl border-3 sm:border-4 border-white">
                          <Gift className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 text-white" strokeWidth={2.5} />
                        </div>
                      </div>
                    </div>

                    {/* Title & Description */}
                    <h3 className="text-2xl sm:text-3xl md:text-4xl font-league-spartan font-black mb-3 sm:mb-4 text-luxury-black leading-tight">
                      Sara's Expert<br />Selection
                    </h3>

                    <p className="text-base sm:text-lg text-gray-700 mb-5 sm:mb-6 leading-relaxed">
                      I've personally curated the <span className="font-black text-luxury-gold">top 4 highest-performing</span> resources — you simply choose your 5th bonus
                    </p>

                    {/* Premium Benefits */}
                    <div className="space-y-2.5 sm:space-y-3 mb-6 sm:mb-8">
                      <div className="flex items-start gap-3 p-3 sm:p-3.5 bg-white/60 rounded-xl sm:rounded-2xl backdrop-blur-sm border border-luxury-gold/20">
                        <div className="w-6 h-6 sm:w-7 sm:h-7 bg-gradient-to-br from-luxury-gold to-luxury-gold-dark rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                          <Check className="w-4 h-4 sm:w-5 sm:h-5 text-white" strokeWidth={3} />
                        </div>
                        <span className="text-sm sm:text-base font-bold text-luxury-black leading-snug">Top 4 resources pre-selected based on 847+ success stories</span>
                      </div>
                      <div className="flex items-start gap-3 p-3 sm:p-3.5 bg-white/60 rounded-xl sm:rounded-2xl backdrop-blur-sm border border-luxury-gold/20">
                        <div className="w-6 h-6 sm:w-7 sm:h-7 bg-gradient-to-br from-luxury-gold to-luxury-gold-dark rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                          <Check className="w-4 h-4 sm:w-5 sm:h-5 text-white" strokeWidth={3} />
                        </div>
                        <span className="text-sm sm:text-base font-bold text-luxury-black leading-snug">You pick your 5th from remaining premium options</span>
                      </div>
                      <div className="flex items-start gap-3 p-3 sm:p-3.5 bg-white/60 rounded-xl sm:rounded-2xl backdrop-blur-sm border border-luxury-gold/20">
                        <div className="w-6 h-6 sm:w-7 sm:h-7 bg-gradient-to-br from-luxury-gold to-luxury-gold-dark rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                          <Check className="w-4 h-4 sm:w-5 sm:h-5 text-white" strokeWidth={3} />
                        </div>
                        <span className="text-sm sm:text-base font-bold text-luxury-black leading-snug">Complete in 30 seconds — zero decision fatigue</span>
                      </div>
                    </div>

                    {/* Premium CTA */}
                    <button
                      onClick={() => {
                        setSelectedMode('expert')
                        setSelectedBonuses(TOP_4_BONUSES)
                      }}
                      className="group/btn relative w-full overflow-hidden rounded-xl sm:rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:-translate-y-1"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-luxury-gold via-luxury-gold-light to-luxury-gold"></div>
                      <div className="absolute inset-0 bg-gradient-to-r from-luxury-gold-dark via-luxury-gold to-luxury-gold-light opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative px-6 py-3.5 sm:px-7 sm:py-4 md:px-8 md:py-4.5 flex items-center justify-center gap-2 sm:gap-3">
                        <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-luxury-black" />
                        <span className="font-league-spartan font-black text-lg sm:text-xl text-luxury-black">Let Sara Choose</span>
                        <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 text-luxury-black group-hover/btn:translate-x-1 transition-transform" />
                      </div>
                    </button>

                    <p className="text-center text-xs sm:text-sm text-gray-600 mt-3 sm:mt-4 font-semibold">
                      ⭐ Most popular choice • 89% of agents select this
                    </p>
                  </div>
                </div>
              </div>

              {/* CUSTOM SELECTION - Premium Dark Card */}
              <div className="group relative">
                {/* Premium Badge */}
                <div className="absolute -top-3 sm:-top-4 left-1/2 transform -translate-x-1/2 z-20">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-700 to-gray-600 rounded-full blur-lg opacity-75"></div>
                    <div className="relative bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 px-4 py-2 sm:px-6 sm:py-2.5 rounded-full shadow-2xl border border-gray-600 flex items-center gap-2">
                      <Target className="w-4 h-4 sm:w-5 sm:h-5 text-luxury-gold" />
                      <span className="text-white font-black text-xs sm:text-sm tracking-wider">FULL CONTROL</span>
                    </div>
                  </div>
                </div>

                {/* Main Card */}
                <div className="relative mt-6 sm:mt-7 bg-gradient-to-br from-luxury-black via-luxury-graphite to-gray-900 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border-2 border-gray-700 hover:border-luxury-gold/50 transition-all duration-500 hover:shadow-luxury-gold/10 hover:shadow-3xl hover:-translate-y-2">
                  {/* Decorative Elements */}
                  <div className="absolute top-0 right-0 w-40 h-40 sm:w-64 sm:h-64 bg-luxury-gold/5 rounded-full blur-3xl"></div>
                  <div className="absolute bottom-0 left-0 w-40 h-40 sm:w-64 sm:h-64 bg-luxury-gold/5 rounded-full blur-3xl"></div>

                  <div className="relative p-5 sm:p-7 md:p-8">
                    {/* Premium Icon */}
                    <div className="mb-5 sm:mb-6">
                      <div className="relative inline-block">
                        <div className="absolute inset-0 bg-luxury-gold/30 rounded-2xl sm:rounded-3xl blur-xl animate-pulse"></div>
                        <div className="relative w-14 h-14 sm:w-16 sm:h-16 md:w-18 md:h-18 bg-gradient-to-br from-gray-800 to-luxury-black rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-2xl border-3 sm:border-4 border-luxury-gold">
                          <Sparkles className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 text-luxury-gold" strokeWidth={2.5} />
                        </div>
                      </div>
                    </div>

                    {/* Title & Description */}
                    <h3 className="text-2xl sm:text-3xl md:text-4xl font-league-spartan font-black mb-3 sm:mb-4 text-white leading-tight">
                      Custom<br />Selection
                    </h3>

                    <p className="text-base sm:text-lg text-gray-300 mb-5 sm:mb-6 leading-relaxed">
                      Browse all 10 premium resources and build a <span className="font-black text-luxury-gold">personalized bundle</span> based on your exact needs
                    </p>

                    {/* Premium Benefits */}
                    <div className="space-y-2.5 sm:space-y-3 mb-6 sm:mb-8">
                      <div className="flex items-start gap-3 p-3 sm:p-3.5 bg-white/5 rounded-xl sm:rounded-2xl backdrop-blur-sm border border-luxury-gold/20">
                        <div className="w-6 h-6 sm:w-7 sm:h-7 bg-gradient-to-br from-luxury-gold to-luxury-gold-dark rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                          <Check className="w-4 h-4 sm:w-5 sm:h-5 text-white" strokeWidth={3} />
                        </div>
                        <span className="text-sm sm:text-base font-bold text-white leading-snug">View all 10 premium resources in the vault</span>
                      </div>
                      <div className="flex items-start gap-3 p-3 sm:p-3.5 bg-white/5 rounded-xl sm:rounded-2xl backdrop-blur-sm border border-luxury-gold/20">
                        <div className="w-6 h-6 sm:w-7 sm:h-7 bg-gradient-to-br from-luxury-gold to-luxury-gold-dark rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                          <Check className="w-4 h-4 sm:w-5 sm:h-5 text-white" strokeWidth={3} />
                        </div>
                        <span className="text-sm sm:text-base font-bold text-white leading-snug">Mix content, tools & training categories freely</span>
                      </div>
                      <div className="flex items-start gap-3 p-3 sm:p-3.5 bg-white/5 rounded-xl sm:rounded-2xl backdrop-blur-sm border border-luxury-gold/20">
                        <div className="w-6 h-6 sm:w-7 sm:h-7 bg-gradient-to-br from-luxury-gold to-luxury-gold-dark rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                          <Check className="w-4 h-4 sm:w-5 sm:h-5 text-white" strokeWidth={3} />
                        </div>
                        <span className="text-sm sm:text-base font-bold text-white leading-snug">100% control over your personalized bundle</span>
                      </div>
                    </div>

                    {/* Premium CTA */}
                    <button
                      onClick={() => {
                        setSelectedMode('custom')
                        setSelectedBonuses([])
                      }}
                      className="group/btn relative w-full overflow-hidden rounded-xl sm:rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:-translate-y-1"
                    >
                      <div className="absolute inset-0 bg-white"></div>
                      <div className="absolute inset-0 bg-gradient-to-r from-luxury-gold-light via-white to-luxury-gold-light opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative px-6 py-3.5 sm:px-7 sm:py-4 md:px-8 md:py-4.5 flex items-center justify-center gap-2 sm:gap-3">
                        <Eye className="w-5 h-5 sm:w-6 sm:h-6 text-luxury-black" />
                        <span className="font-league-spartan font-black text-lg sm:text-xl text-luxury-black">Browse All Options</span>
                        <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 text-luxury-black group-hover/btn:translate-x-1 transition-transform" />
                      </div>
                    </button>

                    <p className="text-center text-xs sm:text-sm text-gray-400 mt-3 sm:mt-4 font-semibold">
                      🎯 Perfect for agents who know exactly what they need
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Inline Bonus Grid - Shows when mode is selected */}
            {selectedMode && (
              <div className="max-w-6xl mx-auto mt-8 sm:mt-12 animate-fade-in">
                {/* Selection Counter */}
                <div className="bg-white/10 backdrop-blur-sm border-2 border-luxury-gold/30 rounded-xl p-4 sm:p-6 mb-6 sm:mb-8 shadow-lg">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-4">
                      <span className="text-white font-bold text-sm sm:text-base">Your Selection:</span>
                      <div className="flex gap-2">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl border-2 flex items-center justify-center transition-all duration-300 ${
                              i < selectedBonuses.length
                                ? 'bg-luxury-gold border-luxury-gold-light scale-110'
                                : 'bg-white/20 border-luxury-gold/30'
                            }`}
                          >
                            {i < selectedBonuses.length && <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-luxury-black" strokeWidth={3} />}
                          </div>
                        ))}
                      </div>
                      <span className="text-white font-black text-lg sm:text-xl">{selectedBonuses.length}/5</span>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedMode(null)
                        setSelectedBonuses([])
                      }}
                      className="text-gray-300 hover:text-luxury-gold text-xs font-semibold flex items-center gap-2 bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg transition-all"
                    >
                      <X className="w-3 h-3" />
                      Change Mode
                    </button>
                  </div>
                </div>

                {/* Bonus Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
                  {BONUS_PRODUCTS.map((bonus) => {
                    const isSelected = selectedBonuses.includes(bonus.id)
                    const isTopPick = selectedMode === 'expert' && TOP_4_BONUSES.includes(bonus.id)
                    const isDisabled = !isSelected && selectedBonuses.length >= 5

                    return (
                      <button
                        key={bonus.id}
                        onClick={() => toggleBonus(bonus.id)}
                        disabled={isDisabled && !isSelected}
                        className={`relative bg-white rounded-xl p-4 text-left transition-all border-2 shadow-md ${
                          isSelected
                            ? 'border-luxury-gold scale-105 shadow-xl shadow-luxury-gold/20'
                            : isDisabled
                            ? 'border-gray-300 opacity-50 cursor-not-allowed'
                            : 'border-gray-200 hover:border-luxury-gold/50 hover:scale-105 active:scale-100'
                        }`}
                      >
                        {isSelected && (
                          <div className="absolute top-3 left-3 w-6 h-6 sm:w-7 sm:h-7 bg-luxury-gold rounded-full flex items-center justify-center z-10">
                            {isTopPick ? (
                              <Award className="w-3 h-3 sm:w-4 sm:h-4 text-luxury-black" />
                            ) : (
                              <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-luxury-black" />
                            )}
                          </div>
                        )}

                        <div className="aspect-video bg-luxury-black rounded-lg mb-3 overflow-hidden relative border border-luxury-gold/20">
                          {bonus.image && (
                            <Image src={bonus.image} alt={bonus.title} fill sizes="100vw" className="object-cover" loading="lazy" />
                          )}
                        </div>

                        <div>
                          <div className="text-xs text-luxury-gold uppercase mb-1 font-bold">{bonus.category}</div>
                          <h5 className="font-bold text-xs sm:text-sm mb-2 line-clamp-2 text-luxury-black">{bonus.title}</h5>
                          <p className="text-gray-600 text-xs mb-3 line-clamp-2">{bonus.subtitle}</p>

                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-gray-500 line-through text-sm font-semibold">${bonus.value}</span>
                            <div className="bg-luxury-gold/20 text-luxury-gold px-2 py-1 rounded-full text-xs font-black">
                              INCLUDED
                            </div>
                          </div>
                        </div>

                        {isTopPick && (
                          <div className="mt-2 bg-luxury-gold/10 border border-luxury-gold/30 rounded px-2 py-1 text-xs text-luxury-gold font-bold text-center">
                            ⭐ Top Pick - Pre-selected
                          </div>
                        )}
                      </button>
                    )
                  })}
                </div>

                {/* Checkout CTA */}
                {selectedBonuses.length === 5 && (
                  <div className="bg-gradient-to-br from-luxury-gold/10 to-luxury-gold-pale border-2 border-luxury-gold rounded-xl p-4 sm:p-6 shadow-2xl">
                    <div className="text-center">
                      <p className="text-luxury-black text-sm sm:text-base font-bold mb-3 sm:mb-4">
                        ✓ Perfect! You've selected 5 bonuses worth ${totalValue}
                      </p>
                      <button
                        onClick={openModal}
                        className="w-full bg-luxury-gold hover:bg-luxury-gold-light text-luxury-black px-6 py-4 sm:py-5 rounded-xl font-league-spartan font-black text-base sm:text-lg transition-all shadow-xl flex items-center justify-center gap-2 hover:scale-105 active:scale-100 cursor-pointer"
                      >
                        <span>Continue To Checkout — Black Friday Price: $37 (Was $97)</span>
                        <ArrowRight className="w-5 h-5" />
                      </button>
                      <p className="text-gray-600 text-sm sm:text-base mt-3 flex items-center justify-center gap-2">
                        <Shield className="w-3 h-3" /> 30-Day Money-Back Guarantee
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* PROOF SECTION - MR LUCAS */}
      <section id="proof" className="py-4 sm:py-6 md:py-10 bg-luxury-pearl">
        <div className="w-full px-3 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            {/* Verified Badge */}
            <div className="text-center mb-3 sm:mb-4">
              <div className="inline-flex items-center gap-1.5 bg-green-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full font-black text-xs shadow-lg">
                <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                VERIFIED RESULT - 100% REAL
              </div>
            </div>

            {/* Headline */}
            <h2 className="text-xl sm:text-2xl md:text-3xl font-league-spartan font-black text-center mb-2 sm:mb-2.5 text-luxury-black">
              This 47-Second AI Video Made{' '}
              <span className="luxury-text-gradient">$12,000 in One Week</span>
            </h2>
            <p className="text-center text-sm sm:text-base text-gray-600 mb-3 sm:mb-5">
              Mr. Lucas never touched a camera. He used 1 selfie from his phone. Here's what happened:
            </p>

            <div className="luxury-card bg-white rounded-2xl overflow-hidden border border-luxury-gold/20 shadow-2xl">
              <div className="grid md:grid-cols-2 gap-4 sm:gap-6 p-4 sm:p-6">
                {/* Video */}
                <div className="relative aspect-[9/16] max-w-sm mx-auto bg-black rounded-xl overflow-hidden">
                  {!showMrLucasVideo ? (
                    <>
                      <Image src="/images/mr-lucas-thumbnail.webp" alt="Success Story" fill sizes="100vw" className="object-cover" loading="lazy" />
                      <button
                        onClick={() => setShowMrLucasVideo(true)}
                        className="absolute inset-0 flex items-center justify-center bg-black/40 group hover:bg-black/30 transition-colors"
                      >
                        <div className="w-16 sm:w-20 h-16 sm:h-20 bg-luxury-gold rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Play className="w-7 sm:w-8 h-7 sm:h-8 text-luxury-black fill-luxury-black ml-1" />
                        </div>
                      </button>
                    </>
                  ) : (
                    <video src="/videos/mr-lucas-case-study.mp4" controls autoPlay className="w-full h-full" />
                  )}
                </div>

                {/* Results */}
                <div className="flex flex-col justify-center space-y-3 sm:space-y-4">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 text-luxury-black">
                      $12,000 in Commission
                      <br />
                      <span className="text-gray-600 text-base sm:text-lg">From One 47-Second Video</span>
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                    <div className="bg-luxury-gold/10 rounded-lg p-3 sm:p-4 text-center border border-luxury-gold/20">
                      <div className="text-2xl sm:text-3xl font-black luxury-text-gradient">3</div>
                      <div className="text-xs sm:text-sm text-gray-600 mt-1">New Clients</div>
                    </div>
                    <div className="bg-luxury-gold/10 rounded-lg p-3 sm:p-4 text-center border border-luxury-gold/20">
                      <div className="text-2xl sm:text-3xl font-black luxury-text-gradient">7 Days</div>
                      <div className="text-xs sm:text-sm text-gray-600 mt-1">To Close</div>
                    </div>
                  </div>

                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                    "I uploaded one selfie. The AI did everything else. Three clients reached out within a week. All three closed."
                  </p>
                  <div className="pt-3 sm:pt-4 border-t border-luxury-gold/20">
                    <p className="font-semibold text-sm sm:text-base text-luxury-black">Mr. Lucas</p>
                    <p className="text-xs sm:text-sm text-gray-600">Dubai Marina • Luxury Specialist</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-4 sm:py-6 md:py-10 bg-luxury-black">
        <div className="w-full px-3 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-league-spartan font-black mb-3 sm:mb-4 px-4">
                So Simple It's Almost <span className="luxury-text-gradient">Embarrassing</span>
              </h2>
              <p className="text-base sm:text-lg text-gray-400 px-4">3 steps. 7 minutes. 50 videos ready to dominate Instagram, TikTok, and Facebook.</p>
            </div>

            <div className="space-y-5 sm:space-y-8">
              {[
                { num: "01", title: "Upload One Photo", desc: "Any professional headshot. That's all we need.", time: "1 min" },
                { num: "02", title: "Type Your Script", desc: "Your message. Or use our proven templates.", time: "2 min" },
                { num: "03", title: "Deploy & Dominate", desc: "AI creates 50 videos. You download and post.", time: "4 min" }
              ].map((step, i) => (
                <div key={i} className="flex gap-4 sm:gap-8 items-start group">
                  <div className="text-4xl sm:text-5xl md:text-6xl font-black text-luxury-gold/20 group-hover:text-luxury-gold/40 transition-colors">
                    {step.num}
                  </div>
                  <div className="flex-1 pt-1 sm:pt-2">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl sm:text-2xl font-bold">{step.title}</h3>
                      <span className="text-xs sm:text-sm text-luxury-gold bg-luxury-gold/10 px-2 sm:px-3 py-1 rounded-full">{step.time}</span>
                    </div>
                    <p className="text-sm sm:text-base md:text-lg text-gray-400">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 sm:mt-8 text-center">
              <div className="inline-block bg-luxury-graphite/30 border border-luxury-gold/20 rounded-xl px-5 sm:px-7 py-3 sm:py-4">
                <div className="text-xs sm:text-sm text-luxury-gold uppercase tracking-wider mb-1.5">Total Time</div>
                <div className="text-2xl sm:text-3xl md:text-4xl font-black luxury-text-gradient">7 Minutes</div>
              </div>
            </div>

            {/* Inline CTA */}
            <div className="mt-6 sm:mt-10 text-center">
              <div className="bg-luxury-graphite/50 border-2 border-luxury-gold/30 rounded-2xl p-4 sm:p-6 max-w-2xl mx-auto">
                <p className="text-white text-base sm:text-lg md:text-xl font-bold mb-3">
                  While Your Competitors Film & Edit for <span className="luxury-text-gradient">Hours</span>...
                </p>
                <p className="text-gray-400 text-sm sm:text-base mb-4">
                  You'll upload 1 photo, grab coffee, and have 50 professional videos ready to dominate every platform.
                </p>
                <button
                  onClick={openModal}
                  className="inline-flex items-center gap-2 bg-luxury-gold hover:bg-luxury-gold-light text-luxury-black px-6 py-3 sm:px-7 sm:py-3.5 rounded-xl text-base sm:text-lg font-black shadow-2xl hover:scale-105 active:scale-100 transition-all smooth-transform ease-out-expo"
                >
                  <span>Start Your 7-Minute System</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
                <p className="text-sm sm:text-base text-gray-500 mt-3">
                  <CheckCircle className="w-3 h-3 text-green-400 inline" /> 30-day guarantee • <CheckCircle className="w-3 h-3 text-green-400 inline" /> Only {spotsLeft} spots left
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHO THIS IS FOR */}
      <section className="py-4 sm:py-6 md:py-10 bg-white">
        <div className="w-full px-3 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-6 sm:mb-10">
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-league-spartan font-black mb-3 px-4 text-luxury-black">
                Is This <span className="luxury-text-gradient">For You?</span>
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
              {/* Perfect For - Light Design FIXED FOR VISIBILITY */}
              <div className="bg-gradient-to-br from-luxury-gold/5 to-luxury-gold/10 border-2 border-luxury-gold/30 rounded-2xl p-4 sm:p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
                <div className="flex items-center gap-3 mb-4 sm:mb-6">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-luxury-gold to-luxury-gold-dark rounded-xl flex items-center justify-center shadow-lg">
                    <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-luxury-black" strokeWidth={3} />
                  </div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-black text-luxury-black">Perfect For</h3>
                </div>
                <ul className="space-y-3 sm:space-y-4">
                  {[
                    "Camera-shy agents who avoid video",
                    "Busy agents with ZERO time to film or edit",
                    "Luxury agents competing for high-end clients",
                    "New agents who need to look professional FAST",
                    "Agents worldwide (all major languages)"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-luxury-gold/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-luxury-gold-dark" strokeWidth={3} />
                      </div>
                      <span className="text-sm sm:text-base text-gray-700 leading-relaxed font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* NOT For - Premium Dark Design */}
              <div className="bg-gradient-to-br from-[#0a0a0a] via-[#151515] to-[#0a0a0a] border border-white/10 rounded-2xl p-4 sm:p-6 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300">
                <div className="flex items-center gap-3 mb-4 sm:mb-6">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/10 rounded-xl flex items-center justify-center border border-white/20">
                    <X className="w-5 h-5 sm:w-6 sm:h-6 text-white/60" strokeWidth={3} />
                  </div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-black text-white/60">NOT For</h3>
                </div>
                <ul className="space-y-3 sm:space-y-4">
                  {[
                    "Agents already crushing it with video",
                    "Get-rich-quick seekers with zero effort",
                    "Agents who won't post content",
                    "People who refuse to adapt"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <X className="w-3 h-3 text-white/40" strokeWidth={3} />
                      </div>
                      <span className="text-sm sm:text-base text-white/50 leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS - Redesigned with Worldwide Diversity & Human Psychology */}
      <section className="py-4 sm:py-6 md:py-10 bg-luxury-black">
        <div className="w-full px-3 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-6 sm:mb-10">
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-league-spartan font-black mb-3 px-4">
                Don't Take My Word For It — <span className="luxury-text-gradient">Take Theirs</span>
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-gray-400 px-4">
                Real agents. Real results. From London to Sydney to Toronto.
              </p>
            </div>

            {/* Top 3 Verified Testimonials - Always Visible */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-5 sm:mb-8">
              {[
                {
                  name: "James Mitchell",
                  role: "Realtor • Manchester, UK",
                  result: "First Listing in 9 Days",
                  quote: "Honestly? I was skeptical as hell. Thought this was another gimmick. Made my first video on a Tuesday night after the kids went to bed. Got a DM Thursday morning from someone asking about a £780k property. Had it listed by Friday. Still can't quite believe it."
                },
                {
                  name: "Sophie Chen",
                  role: "Agent • Toronto, Canada",
                  result: "83% Engagement Jump",
                  quote: "The Instagram algorithm finally loves me lol. My stories went from maybe 200 views to averaging 1,600+. What's crazy is clients keep telling me my videos feel 'authentic' — which is hilarious because I literally hate being on camera. This saved my sanity."
                },
                {
                  name: "Marcus Reynolds",
                  role: "Broker • Melbourne, Australia",
                  result: "$22K in Week 1",
                  quote: "Mate, I'll be straight with you — spent $37 on a Friday, made my first video Saturday morning while nursing a coffee, and by the following Thursday I'd locked in a buyer worth $22K commission. Thought I'd stuffed up the video but apparently looking slightly awkward makes you more trustworthy?"
                }
              ].map((testimonial, i) => (
                <div key={i} className="luxury-testimonial bg-white rounded-xl p-4 sm:p-6 relative shadow-xl">
                  <div className="absolute -top-2 -right-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-1.5 rounded-full text-[10px] font-black shadow-lg flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>VERIFIED</span>
                  </div>
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className="w-3 h-3 sm:w-4 sm:h-4 text-luxury-gold fill-luxury-gold" />
                    ))}
                  </div>
                  <p className="text-sm sm:text-base text-luxury-black leading-relaxed mb-6">"{testimonial.quote}"</p>
                  <div className="pt-6 border-t border-luxury-gold/20">
                    <p className="font-black text-sm sm:text-base text-luxury-black">{testimonial.name}</p>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1">{testimonial.role}</p>
                    <p className="text-xs sm:text-sm text-luxury-gold mt-2 font-bold">✓ {testimonial.result}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Additional Reviews - Hidden by Default */}
            {showAllReviews && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
                {[
                  {
                    name: "Priya Sharma",
                    role: "Agent • Singapore",
                    result: "Weekend Breakthrough",
                    quote: "I'm the person who avoided video for 3 years. THREE YEARS. Finally caved, made 4 videos in one weekend. Monday morning, my phone wouldn't stop buzzing. Had 7 serious inquiries by Tuesday. Wish I'd done this ages ago instead of overthinking it."
                  },
                  {
                    name: "Carlos Herrera",
                    role: "Realtor • Miami, USA",
                    result: "Client Magnet",
                    quote: "People keep asking if I hired a marketing team lmao. Nah bro, it's literally just me and this course. The wild part? My best-performing video was one I made in my car before a showing. No script, just vibes. Got me 3 clients from that one post."
                  },
                  {
                    name: "Emma Johansson",
                    role: "Broker • Stockholm, Sweden",
                    result: "Non-Native Speaker Win",
                    quote: "English isn't my first language and I was terrified my accent would be a problem. Turns out people LOVE it? One client told me it made me seem more genuine. I've done 11 videos now and each one gets easier. My teenage daughter helps me pick the music 😊"
                  },
                  {
                    name: "David O'Connor",
                    role: "Agent • Dublin, Ireland",
                    result: "Sold Me in 48hrs",
                    quote: "Right, I'll admit I only bought this because my mate wouldn't shut up about it. Figured I'd watch one module and bin it. Ended up staying up till 2am making videos. Wife thought I'd lost the plot. But here's the thing — it works. Simple as."
                  },
                  {
                    name: "Rachel Goldstein",
                    role: "Realtor • Tel Aviv, Israel",
                    result: "Time Saver",
                    quote: "Before: spending 4 hours writing posts nobody read. After: 7-minute videos that get shared. The ROI on my time alone is insane. Plus I can batch-create a week's worth of content in one afternoon while my toddler naps. Game changer for working parents."
                  },
                  {
                    name: "Alejandro Ruiz",
                    role: "Agent • Barcelona, Spain",
                    result: "Tourist Turned Buyer",
                    quote: "A couple visiting from Germany saw one of my beach property videos. They weren't even looking to buy! But the video made them curious. Long story short, closed a €950k sale. They literally flew back to Barcelona just to work with me. This stuff is wild."
                  }
                ].map((testimonial, i) => (
                  <div key={i} className="luxury-testimonial bg-luxury-graphite/30 border border-luxury-gold/10 rounded-xl p-4 sm:p-5">
                    <div className="flex gap-1 mb-3">
                      {[...Array(5)].map((_, j) => (
                        <Star key={j} className="w-3 h-3 text-luxury-gold fill-luxury-gold" />
                      ))}
                    </div>
                    <p className="text-white text-sm mb-3">"{testimonial.quote}"</p>
                    <div className="border-t border-luxury-gold/20 pt-3">
                      <p className="font-bold text-white text-sm">{testimonial.name}</p>
                      <p className="text-xs text-gray-400 mt-1">{testimonial.role}</p>
                      <p className="text-xs text-luxury-gold font-bold mt-2">✓ {testimonial.result}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* See More Button */}
            <div className="text-center mb-6 sm:mb-8">
              <button
                onClick={() => setShowAllReviews(!showAllReviews)}
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 px-6 py-3 rounded-xl font-bold text-sm transition-all hover:scale-105 active:scale-95"
              >
                <span>{showAllReviews ? 'Show Less' : 'See More Reviews'}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showAllReviews ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {/* Overall Stats */}
            <div className="text-center">
              <div className="inline-block bg-luxury-graphite/50 border border-luxury-gold/20 rounded-xl px-6 sm:px-8 py-4 sm:py-6">
                <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8">
                  <div>
                    <div className="text-2xl sm:text-3xl font-black luxury-text-gradient">847+</div>
                    <div className="text-xs sm:text-sm text-gray-400 mt-1">Agents Transformed</div>
                  </div>
                  <div className="w-px h-12 bg-luxury-gold/20"></div>
                  <div>
                    <div className="text-2xl sm:text-3xl font-black luxury-text-gradient">10,000+</div>
                    <div className="text-xs sm:text-sm text-gray-400 mt-1">Videos Created</div>
                  </div>
                  <div className="w-px h-12 bg-luxury-gold/20"></div>
                  <div>
                    <div className="text-2xl sm:text-3xl font-black luxury-text-gradient">4.9/5</div>
                    <div className="text-xs sm:text-sm text-gray-400 mt-1">Average Rating</div>
                  </div>
                </div>
              </div>
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

            <h2 className="text-xl sm:text-2xl md:text-3xl font-league-spartan font-black text-luxury-black mb-3">
              847 Agents Got Their First Listing
              <br />
              <span className="luxury-text-gradient">Within 14 Days of Posting</span>
            </h2>

            <p className="text-base sm:text-lg text-gray-700 mb-5 sm:mb-6">
              They didn't have special skills. They weren't tech experts.
              <br className="hidden sm:block" />
              They just uploaded 1 photo and let AI do the rest.
            </p>

            <div className="bg-gradient-to-br from-luxury-black via-gray-900 to-luxury-black border-2 border-luxury-gold/30 rounded-2xl p-4 sm:p-6 mb-5 sm:mb-6">
              {/* Black Friday Banner */}
              <div className="mb-4 pb-4 border-b border-luxury-gold/20">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-luxury-gold to-luxury-gold-light px-5 py-2 rounded-full animate-pulse">
                  <Sparkles className="w-4 h-4 text-luxury-black" />
                  <span className="text-luxury-black font-black text-sm tracking-wider">BLACK FRIDAY EXCLUSIVE OFFER</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 mb-4 sm:mb-5">
                <div>
                  <div className="flex items-center gap-3 justify-center mb-1">
                    <span className="text-2xl text-gray-500 line-through">$97</span>
                    <span className="text-4xl sm:text-5xl font-black luxury-text-gradient">$37</span>
                  </div>
                  <div className="text-sm text-gray-400">One-time payment</div>
                  <div className="inline-block bg-green-600 text-white px-2 py-1 rounded text-xs font-black mt-1">62% OFF</div>
                </div>
                <div className="w-px h-12 bg-luxury-gold/20 hidden sm:block"></div>
                <div>
                  <div className="text-4xl sm:text-5xl font-black text-green-500">$863</div>
                  <div className="text-sm text-gray-400">You save today</div>
                </div>
                <div className="w-px h-12 bg-luxury-gold/20 hidden sm:block"></div>
                <div>
                  <div className="text-4xl sm:text-5xl font-black text-white">{spotsLeft}</div>
                  <div className="text-sm text-gray-400">Spots remaining</div>
                </div>
              </div>

              <button
                onClick={openModal}
                className="inline-flex items-center gap-2 bg-luxury-gold hover:bg-luxury-gold-light text-luxury-black px-6 py-3 sm:px-8 sm:py-4 rounded-xl text-base sm:text-lg font-black shadow-2xl hover:scale-105 active:scale-100 transition-all smooth-transform ease-out-expo mb-2.5 sm:mb-3"
              >
                <span>Claim Black Friday Deal Now</span>
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
                <Clock className="w-4 h-4 text-luxury-gold" />
                <span>Instant Access</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BONUS SELECTOR - LUXURY VERSION */}
      <section id="bonuses" className="py-4 sm:py-6 md:py-10 bg-luxury-pearl relative overflow-hidden scroll-mt-20">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-72 h-72 bg-luxury-gold rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-luxury-gold rounded-full blur-3xl"></div>
        </div>

        <div className="w-full px-3 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-5xl mx-auto text-center mb-5 sm:mb-6">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-luxury-gold via-luxury-gold-light to-luxury-gold px-4 py-1.5 rounded-full mb-3 shadow-lg animate-pulse">
              <Gift className="w-4 h-4 text-luxury-black" />
              <span className="text-luxury-black font-black text-xs tracking-wider">BUILD YOUR FREE BUNDLE</span>
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-league-spartan font-black mb-3 text-luxury-black leading-tight">
              Pick Your <span className="bg-gradient-to-r from-luxury-gold to-luxury-gold-dark bg-clip-text text-transparent">5 FREE Bonuses</span>
            </h2>
            <p className="text-sm sm:text-base text-gray-700">
              Choose 5 premium resources worth up to <span className="text-luxury-gold font-black">${Math.max(...BONUS_PRODUCTS.map(b => b.value)) * 5}</span> — all FREE when you join today
            </p>
          </div>

          {/* Choice Cards - Redesigned with Impossible-to-Skip Hooks */}
          {!selectedMode && (
            <div className="max-w-6xl mx-auto mb-5 sm:mb-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">

                {/* LIGHT THEME - Sara's Choice (Recommended) */}
                <button
                  onClick={() => handleModeSelect('expert')}
                  className="group relative bg-gradient-to-br from-white via-luxury-gold-pale to-white rounded-xl sm:rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-2xl hover:shadow-luxury-gold/30 border-2 border-luxury-gold/30"
                >
                  {/* Recommended Badge */}
                  <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 z-10">
                    <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-2 py-1 sm:px-4 sm:py-1.5 rounded-full text-[8px] sm:text-[10px] font-black uppercase shadow-lg animate-pulse flex items-center gap-1">
                      <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-white" />
                      <span className="hidden sm:inline">BEST CHOICE</span>
                      <span className="sm:hidden">BEST</span>
                    </div>
                  </div>

                  <div className="relative p-3 sm:p-4 md:p-6 text-left">
                    {/* Icon + Title - HORIZONTAL LAYOUT */}
                    <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-luxury-gold to-luxury-gold-dark rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                        <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-luxury-black" />
                      </div>
                      <h4 className="text-base sm:text-xl md:text-2xl font-black text-luxury-black leading-tight">
                        Skip the Guesswork
                      </h4>
                    </div>

                    {/* Hook Badge */}
                    <div className="inline-block bg-luxury-gold/20 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full mb-1.5 sm:mb-2">
                      <span className="text-[9px] sm:text-xs font-black text-luxury-black uppercase tracking-wide">30 sec. Done.</span>
                    </div>

                    {/* Description */}
                    <p className="text-xs sm:text-sm md:text-base text-gray-700 font-semibold mb-2 sm:mb-3">
                      I pick the <span className="text-luxury-gold font-black">top 4</span> that generated $127M. You pick #5.
                    </p>

                    {/* Benefits - Compact */}
                    <div className="space-y-1 sm:space-y-1.5 mb-3 sm:mb-4">
                      <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs md:text-sm text-gray-800 font-medium">
                        <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-luxury-gold flex items-center justify-center flex-shrink-0">
                          <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-luxury-black" strokeWidth={3} />
                        </div>
                        <span>Proven winners</span>
                      </div>
                      <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs md:text-sm text-gray-800 font-medium">
                        <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-luxury-gold flex items-center justify-center flex-shrink-0">
                          <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-luxury-black" strokeWidth={3} />
                        </div>
                        <span>Zero fatigue</span>
                      </div>
                    </div>

                    {/* CTA - Compact */}
                    <div className="bg-gradient-to-r from-luxury-gold via-luxury-gold-light to-luxury-gold text-luxury-black px-3 py-2 sm:px-4 sm:py-3 md:px-6 md:py-4 rounded-lg sm:rounded-xl font-black text-xs sm:text-sm md:text-base text-center group-hover:shadow-xl transition-all whitespace-nowrap">
                      Pick →
                    </div>
                  </div>
                </button>

                {/* DARK THEME - Full Control */}
                <button
                  onClick={() => handleModeSelect('custom')}
                  className="group relative bg-gradient-to-br from-[#0a0a0a] via-[#151515] to-[#0a0a0a] rounded-xl sm:rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-2xl hover:shadow-luxury-gold/20 border-2 border-white/10"
                >
                  <div className="relative p-3 sm:p-4 md:p-6 text-left">
                    {/* Icon + Title - HORIZONTAL LAYOUT */}
                    <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-white/10 to-white/5 rounded-xl flex items-center justify-center flex-shrink-0 border border-white/20">
                        <Target className="w-5 h-5 sm:w-6 sm:h-6 text-luxury-gold" />
                      </div>
                      <h4 className="text-base sm:text-xl md:text-2xl font-black text-white leading-tight">
                        Full Control
                      </h4>
                    </div>

                    {/* Hook Badge */}
                    <div className="inline-block bg-white/10 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full mb-1.5 sm:mb-2">
                      <span className="text-[9px] sm:text-xs font-black text-white uppercase tracking-wide">Power User</span>
                    </div>

                    {/* Description */}
                    <p className="text-xs sm:text-sm md:text-base text-white/70 font-semibold mb-2 sm:mb-3">
                      Pick all 5 from <span className="text-luxury-gold font-black">10 resources</span>. Your call.
                    </p>

                    {/* Benefits - Compact */}
                    <div className="space-y-1 sm:space-y-1.5 mb-3 sm:mb-4">
                      <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs md:text-sm text-white/80 font-medium">
                        <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                          <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-luxury-gold" strokeWidth={3} />
                        </div>
                        <span>All 10 resources</span>
                      </div>
                      <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs md:text-sm text-white/80 font-medium">
                        <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                          <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-luxury-gold" strokeWidth={3} />
                        </div>
                        <span>100% custom</span>
                      </div>
                    </div>

                    {/* CTA - Compact */}
                    <div className="bg-gradient-to-r from-white/10 to-white/5 hover:from-white/20 hover:to-white/10 text-white px-3 py-2 sm:px-4 sm:py-3 md:px-6 md:py-4 rounded-lg sm:rounded-xl font-black text-xs sm:text-sm md:text-base text-center border border-white/20 transition-all whitespace-nowrap">
                      Choose →
                    </div>
                  </div>
                </button>

              </div>
            </div>
          )}

          {/* Bonus Grid */}
          {selectedMode && (
            <div ref={bonusGridRef} className="max-w-6xl mx-auto">
              {/* Selection Counter */}
              <div className="bg-white border-2 border-luxury-gold/30 rounded-xl p-4 sm:p-6 mb-6 sm:mb-8 shadow-lg">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-4">
                    <span className="text-luxury-black font-bold text-sm sm:text-base">Your Selection:</span>
                    <div className="flex gap-2">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl border-2 flex items-center justify-center transition-all duration-300 ${
                            i < selectedBonuses.length
                              ? 'bg-luxury-gold border-luxury-gold-light scale-110'
                              : 'bg-luxury-black/50 border-luxury-gold/20'
                          }`}
                        >
                          {i < selectedBonuses.length && <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-luxury-black" strokeWidth={3} />}
                        </div>
                      ))}
                    </div>
                    <span className="text-luxury-black font-black text-lg sm:text-xl">{selectedBonuses.length}/5</span>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedMode(null)
                      setSelectedBonuses([])
                    }}
                    className="text-gray-600 hover:text-luxury-gold text-xs font-semibold flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg transition-all"
                  >
                    <X className="w-3 h-3" />
                    Change Mode
                  </button>
                </div>
              </div>

              {/* Bonus Grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
                {BONUS_PRODUCTS.map((bonus) => {
                  const isSelected = selectedBonuses.includes(bonus.id)
                  const isTopPick = selectedMode === 'expert' && TOP_4_BONUSES.includes(bonus.id)
                  const isDisabled = !isSelected && selectedBonuses.length >= 5

                  return (
                    <button
                      key={bonus.id}
                      onClick={() => toggleBonus(bonus.id)}
                      disabled={isDisabled && !isSelected}
                      className={`relative bg-white rounded-xl p-4 text-left transition-all border-2 shadow-md ${
                        isSelected
                          ? 'border-luxury-gold scale-105 shadow-xl shadow-luxury-gold/20'
                          : isDisabled
                          ? 'border-gray-300 opacity-50 cursor-not-allowed'
                          : 'border-gray-200 hover:border-luxury-gold/50 hover:scale-105 active:scale-100'
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute top-3 left-3 w-6 h-6 sm:w-7 sm:h-7 bg-luxury-gold rounded-full flex items-center justify-center z-10">
                          {isTopPick ? (
                            <Award className="w-3 h-3 sm:w-4 sm:h-4 text-luxury-black" />
                          ) : (
                            <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-luxury-black" />
                          )}
                        </div>
                      )}

                      <div className="aspect-video bg-luxury-black rounded-lg mb-3 overflow-hidden relative border border-luxury-gold/20">
                        {bonus.image && (
                          <Image src={bonus.image} alt={bonus.title} fill sizes="100vw" className="object-cover" loading="lazy" />
                        )}
                      </div>

                      <div>
                        <div className="text-xs text-luxury-gold uppercase mb-1 font-bold">{bonus.category}</div>
                        <h5 className="font-bold text-xs sm:text-sm mb-2 line-clamp-2 text-luxury-black">{bonus.title}</h5>
                        <p className="text-gray-600 text-xs mb-3 line-clamp-2">{bonus.subtitle}</p>

                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-gray-500 line-through text-sm font-semibold">${bonus.value}</span>
                          <div className="bg-luxury-gold/20 text-luxury-gold px-2 py-1 rounded-full text-xs font-black">
                            INCLUDED
                          </div>
                        </div>
                      </div>

                      {isTopPick && (
                        <div className="mt-2 bg-luxury-gold/10 border border-luxury-gold/30 rounded px-2 py-1 text-xs text-luxury-gold font-bold text-center">
                          ⭐ Top Pick - Pre-selected
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>

              {/* Checkout CTA */}
              {selectedBonuses.length === 5 && (
                <div className="sticky bottom-0 bg-gradient-to-t from-luxury-pearl via-luxury-pearl to-transparent pt-6 pb-4">
                  <div className="bg-white border-2 border-luxury-gold rounded-xl p-4 sm:p-6 shadow-2xl">
                    <div className="text-center">
                      <p className="text-luxury-black text-sm sm:text-base font-bold mb-3 sm:mb-4">
                        ✓ Perfect! You've selected 5 bonuses worth ${totalValue}
                      </p>
                      <button
                        onClick={openModal}
                        className="w-full bg-luxury-gold hover:bg-luxury-gold-light text-luxury-black px-6 py-4 sm:py-5 rounded-xl font-league-spartan font-black text-base sm:text-lg transition-all shadow-xl flex items-center justify-center gap-2 hover:scale-105 active:scale-100 cursor-pointer"
                      >
                        <span>Continue To Checkout — Black Friday Price: $37 (Was $97)</span>
                        <ArrowRight className="w-5 h-5" />
                      </button>
                      <p className="text-gray-400 text-sm sm:text-base mt-3 flex items-center justify-center gap-2">
                        <Shield className="w-3 h-3" /> 30-Day Money-Back Guarantee
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* VALUE STACK - MOBILE OPTIMIZED */}
      <section className="relative py-8 sm:py-16 md:py-20 bg-white overflow-hidden">
        {/* Simplified Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-white via-luxury-pearl/30 to-white"></div>

        <div className="relative w-full px-3 sm:px-6">
          <div className="max-w-6xl mx-auto">
            {/* Compact Header */}
            <div className="text-center mb-6 sm:mb-12">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-luxury-gold via-luxury-gold-light to-luxury-gold px-4 sm:px-6 py-2 rounded-full mb-4 shadow-lg">
                <Package className="w-4 h-4 text-luxury-black" />
                <span className="text-luxury-black font-black text-xs sm:text-sm tracking-wider">COMPLETE PACKAGE</span>
              </div>

              <h2 className="text-2xl sm:text-4xl md:text-5xl font-league-spartan font-black mb-4 leading-tight">
                <span className="text-luxury-black">Everything You Get</span>
                <span className="block mt-1 bg-gradient-to-r from-luxury-gold via-luxury-gold-light to-luxury-gold bg-clip-text text-transparent">
                  For Just $37
                </span>
              </h2>

              <div className="inline-flex items-center gap-2 sm:gap-3 bg-luxury-black/5 border border-luxury-gold/20 px-3 sm:px-6 py-2 rounded-xl mb-4">
                <span className="text-sm sm:text-base text-gray-500 line-through">$97</span>
                <div className="w-px h-4 bg-luxury-gold/30"></div>
                <span className="text-lg sm:text-xl font-black text-luxury-gold">62% OFF</span>
              </div>

              <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto font-dm-sans">
                No upsells. No hidden fees. <span className="font-bold text-luxury-black">One payment, lifetime access.</span>
              </p>
            </div>

            {/* Compact Value Cards */}
            <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-10">
              {/* Main Product - Compact */}
              <div className="group relative">
                <div className="relative bg-gradient-to-br from-white via-luxury-pearl/50 to-luxury-gold-pale/30 rounded-2xl border-2 border-luxury-gold/40 shadow-lg overflow-hidden hover:border-luxury-gold transition-all">
                  <div className="p-4 sm:p-6">
                    <div className="flex flex-col md:flex-row gap-4 items-start">
                      {/* Compact Product Image */}
                      <div className="relative w-48 h-48 sm:w-52 sm:h-52 md:w-44 md:h-44 flex-shrink-0 mx-auto md:mx-0">
                        <div className="relative w-full h-full rounded-xl overflow-hidden shadow-lg border-2 border-white">
                          <Image
                            src="/images/VD-Course-demo.webp"
                            alt="AgentClone System"
                            fill
                            className="object-cover"
                            loading="lazy"
                          />
                          <div className="absolute bottom-3 left-3 bg-gradient-to-r from-luxury-gold to-luxury-gold-dark text-luxury-black px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[10px] sm:text-xs font-black shadow-lg">
                            MAIN PRODUCT
                          </div>
                        </div>
                      </div>

                      <div className="flex-1">
                        <h3 className="text-lg sm:text-xl md:text-2xl font-league-spartan font-black mb-2 sm:mb-3 text-luxury-black leading-tight">
                          AgentClone™ 7-Minute System
                        </h3>
                        <p className="text-sm sm:text-base text-gray-700 mb-3 sm:mb-4 leading-relaxed font-dm-sans">
                          Turn <span className="font-black text-luxury-gold">1 photo into 50 AI videos</span> in 7 minutes.
                        </p>

                        {/* Compact Features */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3 sm:mb-4">
                          <div className="flex items-center gap-2 bg-white/60 p-2 rounded-lg border border-luxury-gold/10">
                            <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" strokeWidth={2.5} />
                            <span className="text-xs sm:text-sm text-luxury-black font-bold">Video training</span>
                          </div>
                          <div className="flex items-center gap-2 bg-white/60 p-2 rounded-lg border border-luxury-gold/10">
                            <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" strokeWidth={2.5} />
                            <span className="text-xs sm:text-sm text-luxury-black font-bold">50+ scripts</span>
                          </div>
                          <div className="flex items-center gap-2 bg-white/60 p-2 rounded-lg border border-luxury-gold/10">
                            <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" strokeWidth={2.5} />
                            <span className="text-xs sm:text-sm text-luxury-black font-bold">AI templates</span>
                          </div>
                          <div className="flex items-center gap-2 bg-white/60 p-2 rounded-lg border border-luxury-gold/10">
                            <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" strokeWidth={2.5} />
                            <span className="text-xs sm:text-sm text-luxury-black font-bold">Lifetime access</span>
                          </div>
                        </div>

                        {/* Compact Value Badge */}
                        <div className="inline-flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-luxury-gold/10 to-luxury-gold-light/10 border border-luxury-gold px-3 sm:px-4 py-2 rounded-xl shadow-md">
                          <div className="text-center">
                            <div className="text-[10px] text-gray-600 font-bold">VALUE</div>
                            <div className="text-xl sm:text-2xl font-black bg-gradient-to-r from-luxury-gold to-luxury-gold-dark bg-clip-text text-transparent">$697</div>
                          </div>
                          <div className="w-px h-8 bg-luxury-gold/30"></div>
                          <div className="text-xs sm:text-sm font-bold text-luxury-black">
                            Training + lifetime updates
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 5 Bonuses - PREMIUM */}
              <div className="group relative">
                {/* Glow effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-green-500 via-green-400 to-green-500 rounded-3xl blur-xl opacity-20 group-hover:opacity-40 transition-all duration-500"></div>

                <div className="relative bg-gradient-to-br from-white via-green-50/30 to-white rounded-3xl border-2 border-green-600/50 shadow-2xl overflow-hidden transform transition-all duration-500 hover:scale-[1.02] hover:border-green-600 hover:shadow-green-500/20">
                  <div className="p-6 md:p-8">
                    <div className="flex flex-col sm:flex-row items-start gap-6">
                      {/* Premium Icon with Glow */}
                      <div className="relative flex-shrink-0 mx-auto sm:mx-0">
                        <div className="absolute inset-0 bg-green-500/30 rounded-3xl blur-2xl"></div>
                        <div className="relative w-20 h-20 bg-gradient-to-br from-green-500 via-green-600 to-green-700 rounded-3xl flex items-center justify-center shadow-2xl border-4 border-white transform group-hover:rotate-6 group-hover:scale-110 transition-all duration-500">
                          <Gift className="w-10 h-10 text-white" strokeWidth={2.5} />
                        </div>
                      </div>

                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-4">
                          <h3 className="text-2xl md:text-3xl font-league-spartan font-black text-luxury-black">
                            5 Premium Bonuses <span className="text-green-600">(You Choose)</span>
                          </h3>
                          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-500 text-white px-4 py-2 rounded-full shadow-lg shadow-green-500/50 animate-pulse">
                            <Sparkles className="w-4 h-4" />
                            <span className="text-xs font-black">100% FREE</span>
                          </div>
                        </div>

                        <p className="text-base md:text-lg text-gray-700 mb-6 leading-relaxed font-dm-sans">
                          Choose <span className="font-black text-green-600">ANY 5 resources</span> from our vault of 10 premium tools, templates, and training materials worth up to $325.
                        </p>

                        {/* Premium Value Badge */}
                        <div className="inline-flex items-center gap-4 bg-gradient-to-r from-green-50 via-green-100/50 to-green-50 backdrop-blur-sm border-2 border-green-600 px-6 py-4 rounded-2xl shadow-xl">
                          <div className="text-center">
                            <div className="text-xs text-gray-600 font-bold mb-1">VALUE</div>
                            <div className="text-3xl md:text-4xl font-black bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">
                              ${totalValue || '200-325'}
                            </div>
                          </div>
                          <div className="w-px h-12 bg-green-600/30"></div>
                          <div className="text-sm font-bold text-green-600">
                            100% FREE — Just pick your favorites
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sara's Support - PREMIUM */}
              <div className="group relative">
                {/* Glow effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-luxury-black via-luxury-graphite to-luxury-black rounded-3xl blur-xl opacity-10 group-hover:opacity-20 transition-all duration-500"></div>

                <div className="relative bg-gradient-to-br from-white via-gray-50 to-white rounded-3xl border-2 border-luxury-black/30 shadow-2xl overflow-hidden transform transition-all duration-500 hover:scale-[1.02] hover:border-luxury-black hover:shadow-luxury-black/10">
                  <div className="p-6 md:p-8">
                    <div className="flex flex-col sm:flex-row items-start gap-6">
                      {/* Sara's Image - Premium Frame */}
                      <div className="relative flex-shrink-0 mx-auto sm:mx-0">
                        <div className="absolute inset-0 bg-luxury-gold/30 rounded-2xl blur-2xl animate-pulse"></div>
                        <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-4 border-luxury-gold shadow-2xl transform group-hover:scale-110 transition-all duration-500">
                          <Image
                            src="/images/Sara 61kb.webp"
                            alt="Sara Cohen"
                            fill
                            className="object-cover"
                            loading="lazy"
                          />
                        </div>
                        <div className="absolute -bottom-2 -right-2 w-7 h-7 bg-green-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        </div>
                      </div>

                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-4">
                          <h3 className="text-2xl md:text-3xl font-league-spartan font-black text-luxury-black">
                            Direct Line To Sara
                          </h3>
                          <div className="inline-flex items-center gap-2 bg-green-100 text-green-600 px-4 py-2 rounded-full border-2 border-green-200">
                            <CheckCircle className="w-4 h-4" />
                            <span className="text-xs font-black">INCLUDED FREE</span>
                          </div>
                        </div>

                        <p className="text-base md:text-lg text-gray-700 mb-6 leading-relaxed font-dm-sans">
                          DM me on Instagram (@sara.theagent) or email — <span className="font-black text-luxury-black">I respond to every message, usually same day.</span>
                        </p>

                        {/* Contact Methods */}
                        <div className="flex flex-wrap items-center gap-4">
                          <div className="flex items-center gap-3 bg-white/60 backdrop-blur-sm px-4 py-3 rounded-xl border border-luxury-gold/20">
                            <div className="w-8 h-8 bg-gradient-to-br from-luxury-gold to-luxury-gold-dark rounded-lg flex items-center justify-center">
                              <Mail className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-sm font-bold text-luxury-black">Email support</span>
                          </div>
                          <div className="flex items-center gap-3 bg-white/60 backdrop-blur-sm px-4 py-3 rounded-xl border border-luxury-gold/20">
                            <div className="w-8 h-8 bg-gradient-to-br from-luxury-gold to-luxury-gold-dark rounded-lg flex items-center justify-center">
                              <Instagram className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-sm font-bold text-luxury-black">Instagram DMs</span>
                          </div>
                          <div className="flex items-center gap-3 bg-white/60 backdrop-blur-sm px-4 py-3 rounded-xl border border-green-600/20">
                            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                              <Clock className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-sm font-bold text-green-600">Same-day response</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Premium CTA */}
            <div className="relative">
              {/* Glow effects */}
              <div className="absolute -inset-2 bg-gradient-to-r from-luxury-gold via-purple-600 to-luxury-gold rounded-3xl blur-2xl opacity-20 animate-pulse"></div>

              <div className="relative bg-gradient-to-br from-luxury-black via-gray-900 to-luxury-black rounded-3xl shadow-2xl overflow-hidden border border-luxury-gold/30">
                <div className="absolute inset-0 bg-gradient-to-r from-luxury-gold/10 via-transparent to-purple-600/10"></div>

                <div className="relative p-8 md:p-10 text-center">
                  {/* Premium Price Display */}
                  <div className="mb-6">
                    <p className="text-gray-400 text-sm mb-3 font-dm-sans">Your Black Friday Price Today:</p>
                    <div className="inline-block relative">
                      <div className="absolute inset-0 bg-luxury-gold/20 blur-2xl"></div>
                      <div className="relative bg-gradient-to-r from-luxury-gold via-luxury-gold-light to-luxury-gold p-1 rounded-2xl">
                        <div className="bg-luxury-black px-10 py-6 rounded-xl">
                          <div className="text-6xl md:text-7xl font-black bg-gradient-to-r from-white via-luxury-gold-light to-white bg-clip-text text-transparent">
                            $37
                          </div>
                          <div className="flex items-center justify-center gap-3 mt-2">
                            <span className="text-gray-400 line-through text-lg">$97</span>
                            <div className="w-1 h-4 bg-luxury-gold/50"></div>
                            <span className="text-luxury-gold font-black text-sm">SAVE $863</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-400 text-sm mb-8 font-dm-sans">
                    Price increases at midnight — <span className="text-luxury-gold font-black">Limited Time Only</span>
                  </p>

                  {/* Premium CTA Button */}
                  <button
                    onClick={openModal}
                    className="group inline-flex items-center gap-4 bg-gradient-to-r from-luxury-gold via-luxury-gold-light to-luxury-gold text-luxury-black px-12 py-5 rounded-2xl font-league-spartan font-black text-lg shadow-2xl hover:shadow-luxury-gold/50 transform hover:scale-105 active:scale-100 transition-all duration-300 mb-6"
                  >
                    <span>Secure Your Access Now</span>
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                  </button>

                  <div className="flex items-center justify-center gap-4 text-gray-400 text-sm">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-green-400" />
                      <span>30-Day Money-Back Guarantee</span>
                    </div>
                    <div className="w-1 h-4 bg-gray-700"></div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span>+ $50 if it doesn't work</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SARA'S GUARANTEE - Premium Dark Design */}
      <section className="py-6 sm:py-8 md:py-10 bg-gradient-to-b from-luxury-black via-[#0f0f0f] to-luxury-black">
        <div className="w-full px-3 sm:px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-4 sm:mb-5">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-4 sm:px-5 py-2 rounded-full font-black text-xs shadow-2xl shadow-emerald-500/30">
                <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                ZERO-RISK GUARANTEE
              </div>
            </div>

            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-league-spartan font-black text-center mb-2 sm:mb-3 text-white">
              Try It Free For <span className="luxury-text-gradient">30 Days</span>
            </h2>
            <p className="text-center text-sm sm:text-base text-white/70 mb-6 sm:mb-8 max-w-3xl mx-auto">
              If this doesn't work exactly like I promised, I'll refund you + pay you <span className="font-black text-emerald-400">$50</span> for your time
            </p>

            {/* Sara's Promise Card - Premium Design */}
            <div className="bg-gradient-to-br from-white/5 to-white/10 rounded-2xl shadow-2xl border border-white/20 backdrop-blur-sm p-4 sm:p-6 md:p-8 mb-4 sm:mb-5">
              <div className="flex flex-col md:flex-row gap-4 sm:gap-5 items-start">
                <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto md:mx-0 flex-shrink-0 relative">
                  <div className="absolute inset-0 bg-luxury-gold rounded-full animate-pulse opacity-20" />
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-luxury-gold shadow-xl">
                    <Image
                      src="/images/Sara 61kb.webp"
                      alt="Sara Cohen"
                      fill
                      className="object-cover"
                      loading="lazy"
                      sizes="(max-width: 640px) 80px, 96px"
                    />
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-full w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center border-2 border-white shadow-lg">
                    <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                </div>

                <div className="flex-1">
                  <div className="mb-3 sm:mb-4">
                    <p className="text-base sm:text-lg font-bold text-white mb-3 italic leading-relaxed">
                      "If you can't create professional videos in 7 minutes or less,
                      I'll refund every penny AND send you $50 for wasting your time."
                    </p>
                    <p className="text-sm sm:text-base text-white/70 mb-2 sm:mb-3">
                      That's right. <span className="font-bold text-emerald-400">Full refund</span> PLUS I'll literally
                      pay YOU $50. Zero risk. Pure upside.
                    </p>
                    <p className="text-xs sm:text-sm text-white/60">
                      847 agents are already using this. I've seen what happens when agents actually use it. The only way you lose is by not trying.
                    </p>
                  </div>
                  <div className="border-t border-white/20 pt-3">
                    <p className="font-black text-white text-sm sm:text-base">— Sara Cohen</p>
                    <p className="text-xs text-white/60">Top 1% Agent • $127M+ Sold</p>
                  </div>
                </div>
              </div>
            </div>

            {/* How to Get Refund - Premium Design */}
            <div className="bg-gradient-to-br from-white/5 to-white/10 border border-white/20 rounded-2xl p-4 sm:p-5 backdrop-blur-sm shadow-xl">
              <h3 className="text-base sm:text-lg font-league-spartan font-black text-center mb-2 text-white">
                How To Get Your Money Back <span className="text-emerald-400">(Takes 30 Seconds)</span>
              </h3>
              <p className="text-center text-white/60 mb-4 sm:mb-5 text-xs sm:text-sm">
                No forms. No hoops. No waiting. Just pick one:
              </p>

              <div className="grid md:grid-cols-2 gap-3 sm:gap-4">
                <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-xl p-3 sm:p-4 border border-emerald-500/30 hover:border-emerald-500/50 transition-all shadow-lg">
                  <div className="flex items-center gap-2 mb-2 sm:mb-3">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                      <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-black text-white text-xs sm:text-sm">Email Us</h4>
                      <p className="text-[10px] sm:text-xs text-emerald-400">24-hour response</p>
                    </div>
                  </div>
                  <p className="text-[10px] sm:text-xs text-white/60 mb-2">
                    Send to: <span className="font-bold text-white/80">support@aifastscale.com</span>
                  </p>
                  <div className="bg-white/5 rounded-lg p-2 border border-white/10">
                    <p className="text-[10px] sm:text-xs font-mono text-white/70">
                      "Hi, I'd like my refund. My email is [your email]"
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-xl p-3 sm:p-4 border border-luxury-gold/30 hover:border-luxury-gold/50 transition-all shadow-lg">
                  <div className="flex items-center gap-2 mb-2 sm:mb-3">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-luxury-gold to-luxury-gold-dark rounded-xl flex items-center justify-center shadow-lg">
                      <Instagram className="w-4 h-4 sm:w-5 sm:h-5 text-luxury-black" />
                    </div>
                    <div>
                      <h4 className="font-black text-white text-xs sm:text-sm">Instagram DM</h4>
                      <p className="text-[10px] sm:text-xs text-luxury-gold">DM Sara directly</p>
                    </div>
                  </div>
                  <p className="text-[10px] sm:text-xs text-white/60 mb-2">
                    Message: <span className="font-bold text-white/80">@sara.theagent</span>
                  </p>
                  <div className="bg-white/5 rounded-lg p-2 border border-white/10">
                    <p className="text-[10px] sm:text-xs font-mono text-white/70">
                      "Hey Sara! Refund please 🙏"
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL URGENCY CTA */}
      <section className="py-8 sm:py-10 bg-white">
        <div className="w-full px-3">
          <div className="max-w-3xl mx-auto">
            <div className="bg-gradient-to-br from-luxury-gold/10 to-luxury-gold-pale border-4 border-luxury-gold rounded-3xl p-5 sm:p-7 text-center shadow-2xl">
              <div className="inline-flex items-center gap-2 bg-luxury-gold text-luxury-black px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-black mb-4">
                <Clock className="w-4 h-4" />
                <span>Price Increases in {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}</span>
              </div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-league-spartan font-black mb-3 text-luxury-black">
                Zero Risk. Pure Upside.
              </h2>

              <p className="text-base sm:text-lg text-gray-700 mb-4 sm:mb-5 leading-relaxed">
                You're protected by a 30-day guarantee <span className="font-bold">PLUS</span> I'll pay you $50 if this doesn't work.
                <br className="hidden sm:block" />
                The only way you lose is by not trying.
              </p>

              <div className="bg-white rounded-2xl p-4 sm:p-5 mb-4 sm:mb-5 shadow-inner border-2 border-luxury-gold/30">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-3xl sm:text-4xl font-black luxury-text-gradient mb-1">$900</div>
                    <div className="text-xs text-gray-600">Regular Price</div>
                  </div>
                  <div>
                    <div className="text-3xl sm:text-4xl font-black text-green-600 mb-1">$37</div>
                    <div className="text-xs text-gray-600">Today Only</div>
                  </div>
                  <div>
                    <div className="text-3xl sm:text-4xl font-black text-luxury-gold mb-1">96%</div>
                    <div className="text-xs text-gray-600">You Save</div>
                  </div>
                </div>
              </div>

              <button
                onClick={openModal}
                className="inline-flex items-center gap-2 bg-luxury-gold hover:bg-luxury-gold-dark text-luxury-black px-6 py-3 sm:px-10 sm:py-5 rounded-xl sm:rounded-2xl text-base sm:text-lg font-black shadow-2xl hover:scale-105 active:scale-100 transition-all smooth-transform ease-out-expo mb-3 sm:mb-4"
              >
                <span>Get Instant Access Now</span>
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

      {/* WHO IS SARA */}
      <section className="py-4 sm:py-6 md:py-10 bg-luxury-black">
        <div className="w-full px-3 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-6 sm:mb-10">
              <div className="inline-flex items-center gap-2 bg-luxury-gold/10 border border-luxury-gold/30 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full mb-3 sm:mb-4">
                <Award className="w-4 h-4 text-luxury-gold" />
                <span className="text-luxury-gold font-bold text-xs tracking-wider">MEET YOUR INSTRUCTOR</span>
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-league-spartan font-black mb-3 px-4">
                Who Am I & <span className="luxury-text-gradient">Why Should You Listen?</span>
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-5 sm:gap-8 mb-6 sm:mb-8">
              <div className="relative aspect-square max-w-md mx-auto rounded-2xl overflow-hidden border-2 border-luxury-gold/30">
                <Image src="/images/Sara 61kb.webp" alt="Sara" fill sizes="100vw" className="object-cover" loading="lazy" />
              </div>

              <div className="space-y-4 sm:space-y-5">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold mb-3 text-luxury-gold">I Was You</h3>
                  <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
                    8 years grinding as a luxury agent in Dubai. $127M+ in sales. But I was exhausted. Filming content felt like a second job. I looked for a better way.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl sm:text-2xl font-bold mb-3 text-luxury-gold">Then I Found AI Video</h3>
                  <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
                    One photo. 50 videos. In minutes. My social media exploded. More leads. More listings. More commissions. All while working LESS.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl sm:text-2xl font-bold mb-3 text-luxury-gold">Now I'm Sharing Everything</h3>
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
                <div key={i} className="bg-luxury-graphite/30 border border-luxury-gold/20 rounded-xl p-3 sm:p-4 text-center">
                  <div className="text-2xl sm:text-3xl font-black luxury-text-gradient mb-2">{stat.value}</div>
                  <div className="text-xs sm:text-sm text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-4 sm:py-6 md:py-10 bg-luxury-pearl">
        <div className="w-full px-3 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-6 sm:mb-10">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-league-spartan font-black mb-3 px-4 text-luxury-black">
                Common <span className="luxury-text-gradient">Questions</span>
              </h2>
              <p className="text-sm sm:text-base text-gray-600 px-4">Everything you need to know</p>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <div
                  key={i}
                  className="bg-white border border-gray-200 hover:border-luxury-gold/40 rounded-xl overflow-hidden transition-all shadow-md"
                >
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-3 sm:p-4 text-left"
                  >
                    <span className="font-semibold text-sm sm:text-base pr-3 text-luxury-black">{faq.q}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-luxury-gold flex-shrink-0 transition-transform ${
                        expandedFaq === i ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {expandedFaq === i && (
                    <div className="px-3 sm:px-4 pb-3 sm:pb-4">
                      <p className="text-sm text-gray-700 leading-relaxed">{faq.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA - MOBILE OPTIMIZED */}
      <section className="py-4 sm:py-6 md:py-10 bg-luxury-black">
        <div className="w-full px-3 sm:px-4">
          <div className="max-w-2xl mx-auto text-center">
            {/* Compact Countdown */}
            <div className="inline-flex items-center gap-2 bg-luxury-graphite/50 border border-luxury-gold/30 rounded-lg px-3 py-1.5 sm:px-4 sm:py-2 mb-3 sm:mb-4">
              <Clock className="w-4 h-4 text-luxury-gold" />
              <div className="flex gap-1.5 font-mono text-white">
                <span className="text-lg sm:text-xl font-black">{String(timeLeft.hours).padStart(2, '0')}</span>
                <span className="text-lg sm:text-xl">:</span>
                <span className="text-lg sm:text-xl font-black">{String(timeLeft.minutes).padStart(2, '0')}</span>
                <span className="text-lg sm:text-xl">:</span>
                <span className="text-lg sm:text-xl font-black">{String(timeLeft.seconds).padStart(2, '0')}</span>
              </div>
            </div>

            <h2 className="text-xl sm:text-2xl md:text-3xl font-league-spartan font-black mb-2 sm:mb-3">
              Price Increases <span className="luxury-text-gradient">At Midnight</span>
            </h2>

            <p className="text-sm sm:text-base text-gray-400 mb-3 sm:mb-5">
              Secure lifetime access at $37 before it goes to $97
            </p>

            {/* Compact Price Box */}
            <div className="bg-luxury-graphite/50 border-2 border-luxury-gold/30 rounded-xl p-3 sm:p-5 mb-3 sm:mb-5">
              <div className="text-center">
                <div className="text-xs text-gray-500 uppercase mb-1">Regular Price</div>
                <div className="text-2xl sm:text-3xl font-black text-gray-500 line-through mb-2">$900+</div>
                <div className="text-xs text-gray-400 mb-1">Your Price Today</div>
                <div className="text-5xl sm:text-6xl font-black luxury-text-gradient mb-3">$37</div>
                <div className="inline-block bg-luxury-gold/20 text-luxury-gold px-4 py-2 rounded-full text-sm font-black">
                  Save $863+ (96% OFF)
                </div>
              </div>
            </div>

            <button
              onClick={openModal}
              className="inline-flex items-center gap-2 bg-luxury-gold text-luxury-black px-5 py-2.5 sm:px-7 sm:py-3.5 rounded-xl font-black text-base hover:bg-luxury-gold-light transition-all shadow-2xl hover:scale-105 active:scale-100"
            >
              <span>Secure Access at $37</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <p className="text-xs text-gray-400 mt-3">
              30-day money-back guarantee + $50
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 sm:py-10 bg-luxury-black border-t border-luxury-gold/10">
        <div className="w-full px-3 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-4 gap-5 sm:gap-6 mb-5 sm:mb-6">
              <div className="md:col-span-2">
                <div className="text-2xl font-dm-serif italic mb-4">
                  <span className="luxury-text-gradient">AgentClone</span>
                </div>
                <p className="text-sm text-gray-400 mb-4">
                  The AI video system helping camera-shy real estate agents dominate social media without filming themselves.
                </p>
              </div>

              <div>
                <h4 className="text-sm font-bold text-white mb-4">Legal</h4>
                <div className="space-y-2">
                  <a href="/terms-of-service" className="block text-sm text-gray-400 hover:text-luxury-gold transition-colors">Terms of Service</a>
                  <a href="/privacy-policy" className="block text-sm text-gray-400 hover:text-luxury-gold transition-colors">Privacy Policy</a>
                  <a href="/refund-policy" className="block text-sm text-gray-400 hover:text-luxury-gold transition-colors">Refund Policy</a>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-white mb-4">Support</h4>
                <div className="space-y-2">
                  <a href="mailto:support@aifastscale.com" className="block text-sm text-gray-400 hover:text-luxury-gold transition-colors">Email Support</a>
                  <a href="https://instagram.com/sara.theagent" target="_blank" rel="noopener noreferrer" className="block text-sm text-gray-400 hover:text-luxury-gold transition-colors">Instagram DM</a>
                </div>
              </div>
            </div>

            <div className="border-t border-luxury-gold/10 pt-5 sm:pt-6">
              <p className="text-xs text-gray-500 text-center leading-relaxed mb-4">
                EARNINGS DISCLAIMER: Results shown are not typical. Individual results vary based on effort, market conditions, and implementation. Past performance does not guarantee future results.
              </p>
              <p className="text-xs text-gray-500 text-center">
                © 2025 AIFastScale. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* BRAND NEW MODAL - Built from scratch with VIP luxury design - RENDERED VIA PORTAL */}
      {isMounted && isModalOpen && createPortal(
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-3 bg-black/95 backdrop-blur-sm"
          onClick={closeModal}
        >
          <div
            className="relative w-full max-w-xl bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a] rounded-2xl sm:rounded-3xl border border-[#D4AF37]/40 shadow-2xl shadow-[#D4AF37]/20 max-h-[92vh] sm:max-h-[95vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 sm:top-3 sm:right-3 z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center text-white/50 hover:text-white transition-all"
            >
              <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>

            {/* Black Friday Header */}
            <div className="bg-gradient-to-r from-red-600 via-red-500 to-red-600 p-1.5 sm:p-2 text-center rounded-t-2xl sm:rounded-t-3xl">
              <p className="text-white text-[10px] sm:text-xs font-black tracking-wide animate-pulse">
                🔥 BLACK FRIDAY - Only 7 Spots Left
              </p>
            </div>

            {/* Content */}
            <div className="p-3 sm:p-5 space-y-2.5 sm:space-y-4">
              {/* VIP Badge */}
              <div className="text-center">
                <div className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30">
                  <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#D4AF37]" />
                  <span className="text-[9px] sm:text-[10px] font-bold text-[#D4AF37] tracking-widest">VIP PACKAGE</span>
                </div>
              </div>

              {/* Main Course with Image */}
              <div className="bg-gradient-to-br from-[#D4AF37]/10 to-[#D4AF37]/5 rounded-lg sm:rounded-xl p-2.5 sm:p-4 border sm:border-2 border-[#D4AF37]/40">
                <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <div className="relative w-14 h-14 sm:w-20 sm:h-20 rounded-md sm:rounded-lg overflow-hidden flex-shrink-0 border sm:border-2 border-[#D4AF37]/30 shadow-lg shadow-[#D4AF37]/20">
                    <Image
                      src="/images/VD-Course-demo.webp"
                      alt="AI Video Course"
                      fill
                      sizes="(max-width: 640px) 56px, 80px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm sm:text-base font-black text-white leading-tight">7-Min AgentClone™</h3>
                    <p className="text-[9px] sm:text-[10px] text-white/50 mt-0.5">Complete System + Lifetime Access</p>
                  </div>
                </div>
                <div className="bg-black/30 rounded-md sm:rounded-lg p-1.5 sm:p-2 border border-white/10">
                  <div className="flex items-center justify-between mb-0.5 sm:mb-1">
                    <span className="text-[9px] sm:text-[10px] text-white/50">Original:</span>
                    <span className="text-sm sm:text-base text-white/40 line-through font-bold">$97</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-black text-white">Today:</span>
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <span className="text-2xl sm:text-3xl font-black text-[#D4AF37]">$37</span>
                      <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-green-600/20 border border-green-500 text-green-400 text-[9px] sm:text-[10px] font-black rounded">62% OFF</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Selected Bonuses with Images */}
              <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 rounded-lg sm:rounded-xl p-2.5 sm:p-4 border border-emerald-500/30">
                <h4 className="text-xs sm:text-sm font-black text-white mb-1.5 sm:mb-2 flex items-center gap-1 sm:gap-1.5">
                  <Gift className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-400" />
                  Your 5 FREE Bonuses
                  <span className="text-emerald-400 text-[10px] sm:text-xs">(${totalValue})</span>
                </h4>
                <div className="space-y-1.5 sm:space-y-2">
                  {selectedBonuses.map((bonusId) => {
                    const bonus = BONUS_PRODUCTS.find((b) => b.id === bonusId)
                    if (!bonus) return null
                    return (
                      <div key={bonus.id} className="flex items-center gap-1.5 sm:gap-2 bg-black/30 rounded-md sm:rounded-lg p-1.5 sm:p-2 border border-emerald-500/20">
                        {bonus.image && (
                          <div className="relative w-9 h-9 sm:w-12 sm:h-12 rounded overflow-hidden flex-shrink-0 bg-white/5 border border-white/10">
                            <Image
                              src={bonus.image}
                              alt={bonus.title}
                              fill
                              sizes="(max-width: 640px) 36px, 48px"
                              className="object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] sm:text-[11px] font-bold text-white/90 leading-tight truncate">{bonus.title}</p>
                          <div className="flex items-center gap-1 sm:gap-1.5 mt-0.5">
                            <span className="text-[8px] sm:text-[9px] text-white/40">Was:</span>
                            <span className="text-[10px] sm:text-[11px] text-white/50 line-through font-bold">${bonus.value}</span>
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                          <div className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-emerald-500/20 border border-emerald-500 rounded">
                            <div className="text-[10px] sm:text-xs font-black text-emerald-400">FREE</div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Mystery Box - More Exciting */}
              <div className="relative bg-gradient-to-br from-purple-600/20 via-pink-500/20 to-purple-600/20 rounded-lg sm:rounded-xl p-2.5 sm:p-4 border sm:border-2 border-purple-500/50 text-center overflow-hidden shadow-lg shadow-purple-500/20">
                {/* Animated sparkle effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse"></div>

                {/* Content */}
                <div className="relative z-10">
                  <div className="flex items-center justify-center gap-0.5 sm:gap-1 mb-1.5 sm:mb-2">
                    <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 animate-pulse" />
                    <div className="text-3xl sm:text-4xl">🎁</div>
                    <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 animate-pulse" />
                  </div>
                  <p className="text-xs sm:text-sm font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 mb-1">
                    + MYSTERY VIP BONUS
                  </p>
                  <div className="bg-black/30 rounded-md sm:rounded-lg px-2 sm:px-3 py-1 sm:py-1.5 border border-purple-500/30 inline-block">
                    <p className="text-[9px] sm:text-[10px] text-white/70">
                      🔒 <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">Worth $500-$1,500</span> • Unlocked after
                    </p>
                  </div>
                  <p className="text-[8px] sm:text-[9px] text-purple-400/80 mt-1 sm:mt-1.5 italic">
                    (Hint: 847+ agents are obsessed with this...)
                  </p>
                </div>
              </div>

              {/* Sara's Irresistible Guarantee */}
              <div className="bg-gradient-to-br from-emerald-500/10 to-blue-500/10 rounded-lg sm:rounded-xl p-2.5 sm:p-4 border sm:border-2 border-emerald-500/40">
                {/* Header with Sara */}
                <div className="flex items-start gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                  <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden flex-shrink-0 border sm:border-2 border-emerald-400 shadow-lg shadow-emerald-500/20">
                    <Image
                      src="/images/Sara 61kb.webp"
                      alt="Sara Cohen"
                      fill
                      sizes="(max-width: 640px) 40px, 48px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1 sm:gap-1.5 mb-0.5">
                      <p className="text-[10px] sm:text-sm font-black text-white flex-shrink-0">Sara Cohen</p>
                      <div className="flex items-center gap-0.5 px-1.5 sm:px-2 py-0.5 sm:py-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-md border border-blue-400/50 shadow-lg shadow-blue-500/30 flex-shrink-0">
                        <svg className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-white flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-[7px] sm:text-[9px] text-white font-black tracking-wide whitespace-nowrap">VERIFIED</span>
                      </div>
                    </div>
                    <p className="text-[9px] sm:text-[10px] text-emerald-400 font-bold">$127M in Career Sales</p>
                  </div>
                </div>

                {/* Personal Promise */}
                <div className="bg-white/5 rounded-md sm:rounded-lg p-2 sm:p-3 mb-2 sm:mb-3 border border-white/10">
                  <p className="text-[10px] sm:text-xs font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400 mb-1.5 sm:mb-2">
                    My Personal No-Risk Promise:
                  </p>
                  <p className="text-[10px] sm:text-[11px] text-white/90 leading-relaxed italic">
                    "I'm so confident this works, <span className="font-black text-white">I'll pay YOU $50</span> if it doesn't. Try AgentClone for 30 days. If you don't get at least ONE new listing lead, I'll refund every penny — <span className="font-black text-[#D4AF37]">PLUS send you $50</span> for wasting your time."
                  </p>
                </div>

                {/* 3-Box Guarantee */}
                <div className="grid grid-cols-3 gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                  <div className="bg-emerald-500/10 rounded-md sm:rounded-lg p-1.5 sm:p-2 border border-emerald-500/30 text-center">
                    <p className="text-sm sm:text-base font-black text-emerald-400">30 Days</p>
                    <p className="text-[7px] sm:text-[8px] text-white/60 mt-0.5">Full refund</p>
                  </div>
                  <div className="bg-[#D4AF37]/10 rounded-md sm:rounded-lg p-1.5 sm:p-2 border border-[#D4AF37]/30 text-center">
                    <p className="text-sm sm:text-base font-black text-[#D4AF37]">+ $50</p>
                    <p className="text-[7px] sm:text-[8px] text-white/60 mt-0.5">Bonus</p>
                  </div>
                  <div className="bg-blue-500/10 rounded-md sm:rounded-lg p-1.5 sm:p-2 border border-blue-500/30 text-center">
                    <p className="text-sm sm:text-base font-black text-blue-400">0 Risk</p>
                    <p className="text-[7px] sm:text-[8px] text-white/60 mt-0.5">No questions</p>
                  </div>
                </div>

                {/* Checkmarks */}
                <div className="space-y-1 sm:space-y-1.5 mb-2 sm:mb-3">
                  <div className="flex items-start gap-1 sm:gap-1.5">
                    <CheckCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <p className="text-[9px] sm:text-[10px] text-white/80 leading-snug">
                      You literally can't lose money — worst case, you <span className="font-black text-emerald-400">PROFIT $50</span>
                    </p>
                  </div>
                  <div className="flex items-start gap-1 sm:gap-1.5">
                    <CheckCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <p className="text-[9px] sm:text-[10px] text-white/80 leading-snug">
                      No hoops to jump through — if you're not happy, you get refunded + $50
                    </p>
                  </div>
                </div>

                {/* Bottom CTA Text */}
                <div className="text-center bg-black/20 rounded-md sm:rounded-lg p-1.5 sm:p-2 border border-white/5">
                  <p className="text-[10px] sm:text-[11px] text-white/80">
                    <span className="font-black text-white">What Do You Have To Lose?</span>
                  </p>
                  <p className="text-[8px] sm:text-[9px] text-white/50 mt-0.5">
                    (Literally nothing. Worst case, you profit $50.)
                  </p>
                </div>
              </div>

              {/* CTA */}
              <div className="space-y-1.5 sm:space-y-2 pt-0.5 sm:pt-1">
                <div className="flex items-center justify-between px-0.5 sm:px-1">
                  <span className="text-[10px] sm:text-xs text-white/50">Total Value:</span>
                  <span className="text-xs sm:text-sm text-white/30 line-through">${97 + totalValue}</span>
                </div>
                <div className="flex items-center justify-between px-0.5 sm:px-1 mb-2 sm:mb-3">
                  <span className="text-base sm:text-lg font-black text-white">Today Only:</span>
                  <span className="text-2xl sm:text-3xl font-black text-[#D4AF37]">$37</span>
                </div>
                <div>
                  <div style={{ display: 'none' }}>
                    <WhopCheckoutEmbed
                      ref={checkoutRef}
                      planId={process.env.NEXT_PUBLIC_WHOP_PLAN_MAIN!}
                      onComplete={(planId, receiptId) => {
                        localStorage.setItem('selectedBonuses', JSON.stringify(selectedBonuses))
                        if (receiptId) localStorage.setItem('whop_receipt', receiptId)
                        window.location.href = '/upsell'
                      }}
                    />
                  </div>
                  <button
                    onClick={() => checkoutRef.current?.submit()}
                    className="w-full bg-gradient-to-r from-[#D4AF37] via-[#FFE17B] to-[#D4AF37] hover:from-[#FFE17B] hover:via-[#D4AF37] hover:to-[#FFE17B] text-black font-black text-sm sm:text-base py-3 sm:py-4 rounded-lg sm:rounded-xl transition-all transform hover:scale-[1.01] active:scale-[0.99] shadow-lg shadow-[#D4AF37]/40"
                  >
                    Complete My Order - $37
                  </button>
                </div>
                <p className="text-[9px] sm:text-[10px] text-center text-white/40 flex items-center justify-center gap-1">
                  <Shield className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  Secure SSL Encrypted
                </p>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}
