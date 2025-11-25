'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Check, Sparkles, Clock, TrendingUp, Gift, Zap, ArrowRight } from 'lucide-react'
import confetti from 'canvas-confetti'
import WhopCheckoutModal from './WhopCheckoutModal'
import { WHOP } from '../config/constants'

// Real bonus products from your current spin wheel
const BONUSES = [
  {
    id: '90-day-blueprint',
    title: 'The $10M Personal Brand Masterclass',
    description: 'Build a 7-Figure Brand Using AI in 90 Days',
    value: 997,
    category: 'Training',
    popular: true,
    image: '/images/products/personal-brand.webp',
  },
  {
    id: 'business-planner-2026',
    title: '2026 Business Planner "Million Dollar Roadmap"',
    description: 'The 12-Month Blueprint Top 1% Agents Use',
    value: 297,
    category: 'Tools',
    popular: false,
    image: '/images/products/business-planner.webp',
  },
  {
    id: 'instagram-stories-templates',
    title: '327 Instagram Story Templates',
    description: 'Pre-Designed Stories That Drive DMs & Listing Inquiries',
    value: 247,
    category: 'Content',
    popular: true,
    image: '/images/products/instagram-stories.webp',
  },
  {
    id: 'viral-reel-templates',
    title: '25 Fall Reels Template Pack',
    description: 'Seasonal Content That Converts During Peak Buying Season',
    value: 197,
    category: 'Content',
    popular: false,
    image: '/images/products/viral-reels.webp',
  },
  {
    id: 'listing-presentation',
    title: '30 Funny Real Estate Social Media Posts',
    description: 'Humor That Humanizes & Drives 3X More Engagement',
    value: 127,
    category: 'Content',
    popular: false,
    image: '/images/products/funny-posts.webp',
  },
  {
    id: 'hooks-impossible-to-skip',
    title: '45 Real Estate Hooks Impossible to Skip',
    description: 'Scroll-Stopping First 3 Seconds for Real Estate',
    value: 247,
    category: 'Content',
    popular: true,
    image: '/images/products/hooks-impossible-to-skip.webp',
  },
  {
    id: 'instagram-dm-scripts',
    title: '89 Instagram DM Scripts That Convert',
    description: 'Copy-Paste Messages That Book Appointments',
    value: 197,
    category: 'Content',
    popular: true,
    image: '/images/products/instagram-dm-scripts.webp',
  },
  {
    id: 'chatgpt-ai-mentor',
    title: 'Custom ChatGPT AI Mentor',
    description: 'Your 50-Year Veteran Coach Available 24/7 (Lifetime Access)',
    value: 497,
    category: 'Tools',
    popular: true,
    image: '/images/products/chatgpt-mentor.webp',
  },
  {
    id: 'luxury-brand-kit',
    title: 'The Luxury Agent\'s Brand Kit',
    description: 'Premium Design Assets Worth $1,200+',
    value: 597,
    category: 'Tools',
    popular: false,
    image: '/images/products/brand-kit.webp',
  },
  {
    id: 'email-signature-professional',
    title: 'Professional Realtor Email Signature Templates',
    description: 'Make Every Email a Marketing Opportunity',
    value: 97,
    category: 'Tools',
    popular: false,
    image: '/images/products/email-signature-professional.webp',
  },
]

// Recommended bundle (FIRST 3 products) - user picks remaining 2
const RECOMMENDED_BUNDLE = BONUSES.slice(0, 3).map((b) => b.id)

export default function BundleBuilder() {
  const [mode, setMode] = useState<'choice' | 'quick' | 'custom'>('choice')
  const [selected, setSelected] = useState<string[]>([])
  const [timeLeft, setTimeLeft] = useState({ hours: 23, minutes: 45, seconds: 12 })
  const [showConfetti, setShowConfetti] = useState(false)
  const [showBonusPopup, setShowBonusPopup] = useState(false)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 }
        } else if (prev.minutes > 0) {
          return { hours: prev.hours, minutes: prev.minutes - 1, seconds: 59 }
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 }
        }
        return prev
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Confetti when 5 selected
  useEffect(() => {
    if (selected.length === 5 && !showConfetti) {
      setShowConfetti(true)
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#da2b35', '#ff4757', '#ffffff'],
      })
    }
  }, [selected, showConfetti])

  const toggleBonus = (id: string) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((s) => s !== id))
    } else if (selected.length < 5) {
      setSelected([...selected, id])
    }
  }

  const totalValue = selected.reduce((sum, id) => {
    const bonus = BONUSES.find((b) => b.id === id)
    return sum + (bonus?.value || 0)
  }, 0)

  const handleQuickPick = () => {
    setSelected(RECOMMENDED_BUNDLE)
    setMode('custom')
    window.scrollTo({ top: document.getElementById('selection-grid')?.offsetTop, behavior: 'smooth' })
  }

  const handleCustom = () => {
    setMode('custom')
    window.scrollTo({ top: document.getElementById('selection-grid')?.offsetTop, behavior: 'smooth' })
  }

  const handleClaim = () => {
    // Show bonus popup instead of directly redirecting
    setShowBonusPopup(true)
  }

  const handleAcceptAllBonuses = () => {
    // Select all 10 bonuses
    const allBonusIds = BONUSES.map((b) => b.id)
    setSelected(allBonusIds)

    // Trigger confetti celebration
    confetti({
      particleCount: 200,
      spread: 100,
      origin: { y: 0.6 },
      colors: ['#da2b35', '#ff4757', '#ffffff'],
    })

    // Close popup and open Whop checkout
    setTimeout(() => {
      setShowBonusPopup(false)
      setIsCheckoutOpen(true)
    }, 1500)
  }

  const handleKeepFiveBonuses = () => {
    // Keep the 5 selected bonuses and open checkout
    setShowBonusPopup(false)
    setIsCheckoutOpen(true)
  }

  return (
    <div className="bg-[#0a0a0a] overflow-x-hidden min-h-screen">
      {/* Choice Section */}
      {mode === 'choice' && (
        <section className="py-16 px-4 bg-gradient-to-b from-[#151515] to-[#0a0a0a]">
          <div className="max-w-6xl mx-auto">
            {/* Black Friday Badge */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-black via-[#da2b35] to-black text-white px-8 py-3 rounded-full text-sm font-black shadow-2xl shadow-[#da2b35]/40 border-2 border-yellow-400 animate-pulse">
                <Sparkles className="w-5 h-5 text-yellow-400" />
                🔥 BLACK FRIDAY — FREE BONUS BLOWOUT 🔥
                <Sparkles className="w-5 h-5 text-yellow-400" />
              </div>
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl md:text-7xl font-black text-center mb-6 text-white leading-tight">
              Build Your Real Estate<br />
              <span className="text-[#da2b35]">Empire Box</span> — 100% FREE
            </h1>

            <p className="text-center text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Pick ANY 5 premium products worth{' '}
              <span className="text-white font-bold">${BONUSES.slice(0, 5).reduce((sum, b) => sum + b.value, 0)}+</span>
              {' '}— <span className="text-[#da2b35] font-black text-3xl">YOURS FREE</span> when you grab AgentClone today
            </p>

            {/* Countdown Timer */}
            <div className="flex justify-center mb-12">
              <div className="inline-flex items-center gap-4 bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl px-8 py-6 shadow-xl">
                <Clock className="w-6 h-6 text-[#da2b35]" />
                <div className="flex gap-6 text-white">
                  <div className="text-center">
                    <div className="text-4xl font-black tabular-nums">{String(timeLeft.hours).padStart(2, '0')}</div>
                    <div className="text-xs text-gray-500 font-semibold tracking-wider mt-1">HOURS</div>
                  </div>
                  <div className="text-4xl font-black text-gray-600">:</div>
                  <div className="text-center">
                    <div className="text-4xl font-black tabular-nums">{String(timeLeft.minutes).padStart(2, '0')}</div>
                    <div className="text-xs text-gray-500 font-semibold tracking-wider mt-1">MINS</div>
                  </div>
                  <div className="text-4xl font-black text-gray-600">:</div>
                  <div className="text-center">
                    <div className="text-4xl font-black tabular-nums">{String(timeLeft.seconds).padStart(2, '0')}</div>
                    <div className="text-xs text-gray-500 font-semibold tracking-wider mt-1">SECS</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Proof */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 text-sm mb-16">
              <div className="flex items-center gap-2 bg-green-500/20 px-4 py-2 rounded-full border border-green-500/30">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-400 font-bold">1,247 agents claimed today</span>
              </div>
              <div className="flex items-center gap-2 bg-[#da2b35]/20 px-4 py-2 rounded-full border border-[#da2b35]/30 animate-pulse">
                <Zap className="w-4 h-4 text-[#da2b35]" />
                <span className="text-[#da2b35] font-black">ONLY 47 BUNDLES LEFT</span>
              </div>
            </div>

            {/* How Do You Want Section */}
            <h2 className="text-4xl md:text-5xl font-black text-center mb-6 text-white">
              How Do You Want Your <span className="text-[#da2b35]">FREE Bonuses</span>?
            </h2>
            <p className="text-center text-gray-400 text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
              Either way, you're getting <span className="text-white font-bold">$2,000+ worth of premium products</span> at ZERO cost 🎁
            </p>
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {/* OPTION 1: Quick & Easy (Red Card) */}
              <button
                onClick={handleQuickPick}
                className="group relative bg-gradient-to-br from-[#da2b35] via-[#c12431] to-[#b01e2a] rounded-3xl p-8 text-center transition-all duration-300 hover:scale-[1.03] border-4 border-yellow-400 shadow-2xl shadow-[#da2b35]/50"
              >
                {/* Badge */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-400 text-black px-6 py-2 rounded-full text-sm font-black shadow-xl animate-pulse">
                  ⚡ MOST POPULAR
                </div>

                {/* Icon */}
                <div className="bg-yellow-400/20 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Gift className="w-12 h-12 text-yellow-300" />
                </div>

                {/* Title */}
                <h3 className="text-4xl md:text-5xl font-black mb-4 text-white">
                  Quick & Easy
                </h3>

                {/* FREE Badge - PROMINENT */}
                <div className="bg-yellow-400 text-black px-8 py-3 rounded-full text-2xl font-black mb-6 inline-block shadow-lg">
                  100% FREE
                </div>

                {/* Simple Description */}
                <p className="text-white text-xl font-bold mb-8 leading-relaxed">
                  We pick 3 best products.<br />
                  You pick 2 more.<br />
                  Done in 30 seconds!
                </p>

                {/* Value */}
                <div className="bg-black/30 rounded-2xl py-6 px-4 mb-6">
                  <div className="text-yellow-300 text-sm font-black mb-2">YOU GET</div>
                  <div className="text-6xl font-black text-white">${BONUSES.slice(0, 5).reduce((sum, b) => sum + b.value, 0)}</div>
                  <div className="text-yellow-300 text-xl font-black mt-2">100% FREE</div>
                </div>

                {/* CTA Button */}
                <div className="bg-yellow-400 text-black py-5 px-8 rounded-2xl text-2xl font-black hover:bg-yellow-300 transition-all shadow-xl">
                  START HERE →
                </div>
              </button>

              {/* OPTION 2: Browse All (Purple Card) */}
              <button
                onClick={handleCustom}
                className="group relative bg-gradient-to-br from-[#1a1a1a] via-[#2a1a2a] to-[#1a1a2a] rounded-3xl p-8 text-center transition-all duration-300 hover:scale-[1.03] border-4 border-purple-500 shadow-2xl shadow-purple-600/30"
              >
                {/* Badge */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-purple-600 text-white px-6 py-2 rounded-full text-sm font-black shadow-xl">
                  🎯 FULL CONTROL
                </div>

                {/* Icon */}
                <div className="bg-purple-600/20 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Sparkles className="w-12 h-12 text-purple-400" />
                </div>

                {/* Title */}
                <h3 className="text-4xl md:text-5xl font-black mb-4 text-white">
                  Browse All
                </h3>

                {/* FREE Badge - PROMINENT */}
                <div className="bg-purple-600 text-white px-8 py-3 rounded-full text-2xl font-black mb-6 inline-block shadow-lg">
                  100% FREE
                </div>

                {/* Simple Description */}
                <p className="text-gray-300 text-xl font-bold mb-8 leading-relaxed">
                  See all 10 products.<br />
                  Choose your favorite 5.<br />
                  Takes 2 minutes!
                </p>

                {/* Value */}
                <div className="bg-white/5 border-2 border-purple-600/30 rounded-2xl py-6 px-4 mb-6">
                  <div className="text-purple-400 text-sm font-black mb-2">YOU GET</div>
                  <div className="text-6xl font-black text-white">$2,000+</div>
                  <div className="text-purple-400 text-xl font-black mt-2">100% FREE</div>
                </div>

                {/* CTA Button */}
                <div className="bg-purple-600 text-white py-5 px-8 rounded-2xl text-2xl font-black hover:bg-purple-500 transition-all shadow-xl">
                  BROWSE ALL →
                </div>
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Selection Grid */}
      {mode !== 'choice' && (
        <section id="selection-grid" className="py-20 px-4 bg-[#0a0a0a]">
          <div className="max-w-7xl mx-auto">
            {/* Selection Counter */}
            <div className="mb-16 text-center">
              <div className="inline-flex items-center gap-4 bg-[#1a1a1a] rounded-2xl px-8 py-4 border border-[#2a2a2a] shadow-xl">
                <span className="text-gray-400 text-sm font-semibold">SELECTED</span>
                <div className="flex gap-2">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                        i < selected.length
                          ? 'bg-[#da2b35] text-white shadow-lg shadow-[#da2b35]/30'
                          : 'bg-[#2a2a2a]'
                      }`}
                    >
                      {i < selected.length && <Check className="w-5 h-5" />}
                    </div>
                  ))}
                </div>
                <span className="text-white font-black text-lg">{selected.length}/5</span>
              </div>
              {selected.length === 5 && (
                <div className="mt-6 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-3 rounded-full inline-block font-black text-lg shadow-xl animate-pulse">
                  🎉 BOOM! ${totalValue} Bundle Ready — 100% FREE!
                </div>
              )}
            </div>

            {/* Product Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {BONUSES.map((bonus) => {
                const isSelected = selected.includes(bonus.id)
                const isDisabled = !isSelected && selected.length >= 5

                return (
                  <button
                    key={bonus.id}
                    onClick={() => !isDisabled && toggleBonus(bonus.id)}
                    disabled={isDisabled}
                    className={`relative group rounded-2xl p-6 text-left transition-all duration-500 border-2 ${
                      isSelected
                        ? 'bg-gradient-to-br from-[#1a1a1a] to-[#151515] border-[#da2b35] scale-[1.02] shadow-2xl shadow-[#da2b35]/20'
                        : isDisabled
                        ? 'bg-[#151515] border-[#1a1a1a] opacity-40 cursor-not-allowed'
                        : 'bg-gradient-to-br from-[#1a1a1a] to-[#151515] border-[#2a2a2a] hover:border-[#da2b35]/50 hover:scale-[1.02] hover:shadow-xl'
                    }`}
                  >
                    {/* Popular Badge */}
                    {bonus.popular && !isDisabled && (
                      <div className="absolute -top-3 right-4 bg-[#da2b35] text-white px-3 py-1 rounded-full text-xs font-black shadow-lg">
                        POPULAR
                      </div>
                    )}

                    {/* Checkmark */}
                    {isSelected && (
                      <div className="absolute top-4 right-4 w-10 h-10 bg-[#da2b35] rounded-xl flex items-center justify-center shadow-lg shadow-[#da2b35]/30">
                        <Check className="w-6 h-6 text-white" />
                      </div>
                    )}

                    {/* Product Image */}
                    <div className="relative w-full h-36 mb-5 rounded-xl overflow-hidden bg-[#0a0a0a] border border-[#2a2a2a]">
                      <Image
                        src={bonus.image}
                        alt={bonus.title}
                        fill
                        className="object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                      />
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-black mb-2 text-white leading-tight">{bonus.title}</h3>

                    {/* Description */}
                    <p className="text-sm text-gray-400 mb-5 leading-relaxed">{bonus.description}</p>

                    {/* Value */}
                    <div className="flex items-center justify-between pt-5 border-t border-[#2a2a2a]">
                      <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">{bonus.category}</span>
                      <span className="text-2xl font-black text-[#da2b35]">${bonus.value}</span>
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Value Counter */}
            {selected.length > 0 && (
              <div className="mt-16 text-center bg-gradient-to-br from-[#da2b35] via-[#c12431] to-[#b01e2a] border-4 border-yellow-400 rounded-3xl p-10 shadow-2xl shadow-[#da2b35]/40 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 to-orange-400/10 animate-pulse"></div>
                <div className="relative z-10">
                  <div className="text-yellow-300 mb-3 text-sm font-black uppercase tracking-wider">🎁 YOUR FREE BUNDLE VALUE 🎁</div>
                  <div className="text-7xl md:text-8xl font-black text-white mb-4 drop-shadow-2xl">
                    ${totalValue}
                  </div>
                  <div className="bg-yellow-400 text-black px-8 py-4 rounded-2xl inline-block font-black text-2xl shadow-xl mb-4">
                    100% FREE — YOURS TO KEEP
                  </div>
                  <p className="text-white/90 text-base max-w-md mx-auto mt-4">
                    This entire collection is yours at <span className="font-black text-yellow-300">ZERO cost</span> when you grab AgentClone for just $37 today
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Sticky CTA */}
      {mode !== 'choice' && (
        <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-black via-[#1a1a1a] to-black backdrop-blur-xl border-t-4 border-yellow-400 p-6 z-50 shadow-2xl">
          <div className="max-w-6xl mx-auto">
            {/* Progress Indicator */}
            <div className="flex items-center justify-center gap-3 mb-4">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-black transition-all duration-300 ${
                    i < selected.length
                      ? 'bg-yellow-400 text-black scale-110 shadow-lg shadow-yellow-400/50'
                      : 'bg-[#2a2a2a] text-gray-600'
                  }`}
                >
                  {i < selected.length ? '✓' : i + 1}
                </div>
              ))}
            </div>

            {/* Main CTA Button */}
            {selected.length === 5 ? (
              <button
                onClick={handleClaim}
                className="w-full bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 text-black py-7 px-8 rounded-2xl font-black text-2xl md:text-3xl hover:scale-[1.02] transition-all duration-300 shadow-2xl shadow-yellow-400/50 animate-pulse"
              >
                <div className="flex flex-col md:flex-row items-center justify-center gap-3">
                  <span>🎁 CLAIM ${totalValue} FREE</span>
                  <span className="hidden md:inline">+</span>
                  <span>GET AGENTCLONE $37</span>
                  <ArrowRight className="w-8 h-8" />
                </div>
              </button>
            ) : (
              <div className="text-center py-7">
                <div className="text-3xl font-black text-white mb-2">
                  Pick {5 - selected.length} More FREE {5 - selected.length === 1 ? 'Product' : 'Products'}
                </div>
                <div className="text-yellow-400 text-xl font-bold">
                  👆 Scroll up and select {5 - selected.length} more
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Bonus Upgrade Popup */}
      {showBonusPopup && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-2 border-[#da2b35] rounded-3xl max-w-2xl w-full p-8 md:p-12 relative animate-in zoom-in duration-300 shadow-2xl shadow-[#da2b35]/20">
            {/* Sparkles decoration */}
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-6xl">
              🎁
            </div>

            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-[#da2b35] text-white px-5 py-2.5 rounded-full text-xs font-black mb-8 shadow-lg shadow-[#da2b35]/30">
              <Sparkles className="w-4 h-4" />
              EXCLUSIVE ONE-TIME OFFER
              <Sparkles className="w-4 h-4" />
            </div>

            {/* Headline */}
            <h2 className="text-4xl md:text-5xl font-black mb-5 text-white leading-tight">
              Wait! You Deserve<br />
              <span className="text-[#da2b35]">Everything...</span>
            </h2>

            {/* Description */}
            <p className="text-lg text-gray-300 mb-8 leading-relaxed">
              Because you're taking action <span className="font-black text-[#da2b35]">right now</span>, we want to give you the complete collection.
            </p>

            {/* The offer */}
            <div className="bg-gradient-to-br from-[#da2b35]/10 to-[#da2b35]/5 border-2 border-[#da2b35]/30 rounded-2xl p-8 mb-8">
              <div className="text-center mb-6">
                <div className="text-xs text-gray-400 font-black uppercase tracking-wider mb-3">Special Upgrade</div>
                <div className="text-6xl font-black text-[#da2b35] mb-3">ALL 10</div>
                <div className="text-3xl font-black text-white">
                  BONUSES FREE
                </div>
              </div>

              <div className="border-t-2 border-[#da2b35]/20 pt-6 mt-6">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="text-gray-400">Your selection:</div>
                  <div className="text-right font-black text-white">${totalValue}</div>
                  <div className="text-gray-400">Full collection:</div>
                  <div className="text-right font-black text-[#da2b35]">
                    ${BONUSES.reduce((sum, b) => sum + b.value, 0)}
                  </div>
                </div>
              </div>
            </div>

            {/* Urgency */}
            <div className="bg-[#da2b35]/10 border border-[#da2b35]/30 rounded-2xl p-5 mb-8 flex items-start gap-3">
              <Clock className="w-5 h-5 text-[#da2b35] flex-shrink-0 mt-0.5" />
              <div className="text-sm text-gray-300 leading-relaxed">
                <span className="font-black text-white">Limited:</span> Only 47 spots available. This popup won't appear again once you close it.
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="space-y-4">
              <button
                onClick={handleAcceptAllBonuses}
                className="w-full bg-[#da2b35] text-white py-6 rounded-xl font-black text-lg hover:bg-[#c12431] transition-all duration-300 hover:scale-105 shadow-2xl shadow-[#da2b35]/40 flex items-center justify-center gap-3"
              >
                <Gift className="w-6 h-6" />
                YES! Upgrade to All 10 FREE
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                onClick={handleKeepFiveBonuses}
                className="w-full bg-[#2a2a2a] text-gray-400 py-4 rounded-xl font-semibold text-sm hover:bg-[#333] transition-all duration-300"
              >
                No thanks, continue with 5
              </button>
            </div>

            {/* Trust element */}
            <p className="text-center text-xs text-gray-500 mt-8 font-semibold uppercase tracking-wider">
              Same $37 price • 2x the value
            </p>
          </div>
        </div>
      )}

      {/* Whop Checkout Modal */}
      <WhopCheckoutModal
        planId={WHOP.plans.main}
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onComplete={() => {
          // Track conversion and redirect to OTO page
          console.log('✅ Payment completed! Redirecting to OTO...')
          window.location.href = WHOP.redirects.afterMainCheckout
        }}
      />
    </div>
  )
}
