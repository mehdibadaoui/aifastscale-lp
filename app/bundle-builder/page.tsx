'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Check, Sparkles, Clock, TrendingUp, Gift, Zap } from 'lucide-react'
import confetti from 'canvas-confetti'

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

// Recommended bundle (top 3 most popular/high-value) - user picks remaining 2
const RECOMMENDED_BUNDLE = BONUSES.filter((b) => b.popular).slice(0, 3).map((b) => b.id)

export default function BundleBuilderPage() {
  const [mode, setMode] = useState<'choice' | 'quick' | 'custom'>('choice')
  const [selected, setSelected] = useState<string[]>([])
  const [timeLeft, setTimeLeft] = useState({ hours: 23, minutes: 45, seconds: 12 })
  const [showConfetti, setShowConfetti] = useState(false)

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
        colors: ['#FF6B35', '#F7931E', '#FDC830'],
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
    // Redirect to Whop checkout
    window.location.href = '/checkout'
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative pt-20 pb-12 px-4 bg-gradient-to-b from-red-950/30 to-black border-b border-red-900/20">
        <div className="max-w-5xl mx-auto text-center">
          {/* Black Friday Badge */}
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold mb-6 animate-pulse">
            <Sparkles className="w-4 h-4" />
            BLACK FRIDAY EXCLUSIVE
            <Sparkles className="w-4 h-4" />
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-6xl font-black mb-4 bg-gradient-to-r from-white via-orange-200 to-red-400 bg-clip-text text-transparent">
            Build Your FREE AI Video Bundle
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-6">
            Choose 5 Premium Bonuses Worth ${BONUSES.slice(0, 5).reduce((sum, b) => sum + b.value, 0)}+
            <span className="text-red-400 font-bold"> - Absolutely FREE</span>
          </p>

          {/* Countdown Timer */}
          <div className="inline-flex items-center gap-3 bg-red-900/30 border-2 border-red-500 rounded-xl px-6 py-4 mb-8">
            <Clock className="w-6 h-6 text-red-400 animate-pulse" />
            <div className="flex gap-4 text-white">
              <div>
                <div className="text-3xl font-black">{String(timeLeft.hours).padStart(2, '0')}</div>
                <div className="text-xs text-gray-400">HOURS</div>
              </div>
              <div className="text-3xl font-black">:</div>
              <div>
                <div className="text-3xl font-black">{String(timeLeft.minutes).padStart(2, '0')}</div>
                <div className="text-xs text-gray-400">MINS</div>
              </div>
              <div className="text-3xl font-black">:</div>
              <div>
                <div className="text-3xl font-black">{String(timeLeft.seconds).padStart(2, '0')}</div>
                <div className="text-xs text-gray-400">SECS</div>
              </div>
            </div>
          </div>

          {/* Social Proof */}
          <div className="flex items-center justify-center gap-6 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-400" />
              1,247 bundles claimed today
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-400" />
              47 left at this price
            </div>
          </div>
        </div>
      </section>

      {/* Choice Section */}
      {mode === 'choice' && (
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Choose Your Path</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {/* Quick Pick */}
              <button
                onClick={handleQuickPick}
                className="group relative bg-gradient-to-br from-orange-600 to-red-600 rounded-2xl p-8 text-left transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/50 border-2 border-orange-400"
              >
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-400 text-black px-4 py-1 rounded-full text-sm font-bold">
                  RECOMMENDED
                </div>
                <Gift className="w-12 h-12 mb-4 text-white" />
                <h3 className="text-2xl font-bold mb-2">🎯 Recommended</h3>
                <p className="text-white/90 mb-4">We select 3 best bonuses, you pick 2 more</p>
                <ul className="space-y-2 mb-6">
                  {BONUSES.filter((b) => b.popular)
                    .slice(0, 3)
                    .map((bonus) => (
                      <li key={bonus.id} className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 flex-shrink-0" />
                        <span>{bonus.title}</span>
                      </li>
                    ))}
                </ul>
                <div className="flex items-center justify-between pt-4 border-t border-white/20">
                  <span className="text-sm">Top 3 Value:</span>
                  <span className="text-2xl font-black">${BONUSES.filter((b) => b.popular).slice(0, 3).reduce((sum, b) => sum + b.value, 0)}</span>
                </div>
              </button>

              {/* Build Custom */}
              <button
                onClick={handleCustom}
                className="group relative bg-gradient-to-br from-purple-900 to-blue-900 rounded-2xl p-8 text-left transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/50 border-2 border-purple-400"
              >
                <Sparkles className="w-12 h-12 mb-4 text-white" />
                <h3 className="text-2xl font-bold mb-2">🎨 Build Custom</h3>
                <p className="text-white/90 mb-4">Pick exactly what you want</p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 flex-shrink-0" />
                    <span>Choose from {BONUSES.length} premium bonuses</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 flex-shrink-0" />
                    <span>Mix and match categories</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 flex-shrink-0" />
                    <span>Customize to your needs</span>
                  </li>
                </ul>
                <div className="flex items-center justify-between pt-4 border-t border-white/20">
                  <span className="text-sm">Your Choice</span>
                  <span className="text-2xl font-black">5 Bonuses</span>
                </div>
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Selection Grid */}
      {mode !== 'choice' && (
        <section id="selection-grid" className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            {/* Selection Counter */}
            <div className="mb-12 text-center">
              <div className="inline-flex items-center gap-2 bg-gray-900 rounded-full px-6 py-3 border border-gray-700">
                <span className="text-gray-400">Selected:</span>
                <div className="flex gap-2">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${
                        i < selected.length
                          ? 'bg-gradient-to-br from-orange-500 to-red-500'
                          : 'bg-gray-800'
                      }`}
                    >
                      {i < selected.length && <Check className="w-5 h-5" />}
                    </div>
                  ))}
                </div>
                <span className="text-white font-bold">{selected.length}/5</span>
              </div>
              {selected.length === 5 && (
                <div className="mt-4 text-green-400 font-bold animate-bounce">
                  ✨ Perfect! Your bundle is ready!
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
                    className={`relative group rounded-xl p-6 text-left transition-all duration-300 border-2 ${
                      isSelected
                        ? 'bg-gradient-to-br from-orange-600 to-red-600 border-orange-400 scale-105 shadow-2xl shadow-orange-500/50'
                        : isDisabled
                        ? 'bg-gray-900/50 border-gray-800 opacity-50 cursor-not-allowed'
                        : 'bg-gray-900 border-gray-700 hover:border-orange-500 hover:scale-105 hover:shadow-xl'
                    }`}
                  >
                    {/* Popular Badge */}
                    {bonus.popular && !isDisabled && (
                      <div className="absolute -top-3 right-4 bg-yellow-400 text-black px-3 py-1 rounded-full text-xs font-bold">
                        🔥 POPULAR
                      </div>
                    )}

                    {/* Checkmark */}
                    {isSelected && (
                      <div className="absolute top-4 right-4 w-8 h-8 bg-white rounded-full flex items-center justify-center">
                        <Check className="w-5 h-5 text-green-600" />
                      </div>
                    )}

                    {/* Product Image */}
                    <div className="relative w-full h-32 mb-4 rounded-lg overflow-hidden bg-gray-800">
                      <Image
                        src={bonus.image}
                        alt={bonus.title}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold mb-2">{bonus.title}</h3>

                    {/* Description */}
                    <p className="text-sm text-gray-300 mb-4">{bonus.description}</p>

                    {/* Value */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                      <span className="text-xs text-gray-400">{bonus.category}</span>
                      <span className="text-lg font-black text-orange-400">${bonus.value}</span>
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Value Counter */}
            {selected.length > 0 && (
              <div className="mt-12 text-center bg-gradient-to-r from-orange-900/30 to-red-900/30 border border-orange-500 rounded-2xl p-8">
                <div className="text-gray-400 mb-2">Your Bundle Worth:</div>
                <div className="text-5xl font-black bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                  ${totalValue}
                </div>
                <div className="text-green-400 mt-2">+ You Get It ALL FREE with Your Purchase!</div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Sticky CTA */}
      {mode !== 'choice' && (
        <div className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-lg border-t border-red-900/50 p-4 z-50">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-400">
                {selected.length}/5 bonuses selected
              </div>
              <div className="text-lg font-bold">
                Total Value: <span className="text-orange-400">${totalValue}</span>
              </div>
            </div>
            <button
              onClick={handleClaim}
              disabled={selected.length !== 5}
              className={`px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
                selected.length === 5
                  ? 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 hover:scale-105 shadow-2xl shadow-orange-500/50 animate-pulse'
                  : 'bg-gray-700 text-gray-400 cursor-not-allowed'
              }`}
            >
              {selected.length === 5 ? (
                <>Claim My Bundle ($37) 🎁</>
              ) : (
                <>Select {5 - selected.length} More...</>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
