'use client'

import { useState, useEffect, Suspense } from 'react'
import { Clock, Zap, AlertTriangle, CheckCircle } from 'lucide-react'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { WHOP } from '../config/constants'
import { BONUS_PRODUCTS } from '../config/bonus-products'

// PERFORMANCE: Dynamic import with no SSR for instant client-side loading
const WhopCheckoutEmbed = dynamic(
  () => import('@whop/checkout/react').then((mod) => mod.WhopCheckoutEmbed),
  {
    ssr: false,
    loading: () => <CheckoutSkeleton />
  }
)

// Checkout loading skeleton for instant perceived performance
function CheckoutSkeleton() {
  return (
    <div className="p-8 space-y-6 animate-pulse bg-white/5 rounded-xl border border-white/10">
      <div className="space-y-2">
        <div className="h-4 w-16 bg-white/10 rounded"></div>
        <div className="h-12 bg-white/10 rounded-lg"></div>
      </div>
      <div className="space-y-2">
        <div className="h-4 w-24 bg-white/10 rounded"></div>
        <div className="h-12 bg-white/10 rounded-lg"></div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="h-4 w-24 bg-white/10 rounded"></div>
          <div className="h-12 bg-white/10 rounded-lg"></div>
        </div>
        <div className="space-y-2">
          <div className="h-4 w-20 bg-white/10 rounded"></div>
          <div className="h-12 bg-white/10 rounded-lg"></div>
        </div>
      </div>
      <div className="flex items-center justify-center gap-2 text-white/60 mt-4">
        <svg className="animate-spin h-5 w-5 text-[#d4af37]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span className="text-sm font-medium">Loading secure checkout...</span>
      </div>
    </div>
  )
}

export default function DownsellFinalPage() {
  const [timeLeft, setTimeLeft] = useState(5 * 60) // 5 minutes
  const [selectedBonuses, setSelectedBonuses] = useState<string[]>([])
  const [remainingBonuses, setRemainingBonuses] = useState<typeof BONUS_PRODUCTS>([])
  const [chosenBonuses, setChosenBonuses] = useState<typeof BONUS_PRODUCTS>([])

  // Load selected bonuses
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('selectedBonuses')
      if (saved) {
        const parsed = JSON.parse(saved)
        setSelectedBonuses(parsed)
        const chosen = BONUS_PRODUCTS.filter(b => parsed.includes(b.id))
        const remaining = BONUS_PRODUCTS.filter(b => !parsed.includes(b.id))
        setChosenBonuses(chosen)
        setRemainingBonuses(remaining)
      } else {
        // Default: first 5 are free, last 5 are paid (for testing)
        setChosenBonuses(BONUS_PRODUCTS.slice(0, 5))
        setRemainingBonuses(BONUS_PRODUCTS.slice(5, 10))
      }
    }
  }, [])

  // PERFORMANCE: Prefetch Facebook Pixel on mount for instant tracking
  useEffect(() => {
    if (typeof window !== 'undefined' && window.fbq) {
      // Warm up the pixel
      window.fbq('track', 'PageView')
    }
  }, [])

  const totalValue = remainingBonuses.reduce((sum, b) => sum + b.value, 0)

  // Timer - auto redirect when expires
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          window.location.href = WHOP.redirects.afterDownsellDecline
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleComplete = (planId: string, receiptId?: string) => {
    console.log('✅ Downsell purchase complete:', { planId, receiptId })

    // Fire Facebook Purchase event
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'Purchase', {
        content_name: 'Downsell - Remaining 5 Bonuses',
        value: 4.95,
        currency: 'USD',
      })
    }

    // Redirect to thank you page
    window.location.href = WHOP.redirects.afterDownsellAccept
  }

  const handleDecline = () => {
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'CustomizeProduct', {
        content_name: 'Downsell Declined',
        value: 0,
        currency: 'USD',
      })
    }
    window.location.href = WHOP.redirects.afterDownsellDecline
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-[#151515] via-[#1a0a0a] to-[#0a0a0a] safe-top safe-bottom">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* URGENT Timer */}
        <div className="bg-gradient-to-r from-[#da2b35] to-[#da2b35]/80 border-2 border-[#da2b35] rounded-xl p-4 mb-6 text-center shadow-2xl">
          <div className="flex items-center justify-center gap-3">
            <AlertTriangle className="w-6 h-6 text-white animate-pulse" />
            <div>
              <div className="text-white text-sm font-bold">🚨 FINAL WARNING - PAGE CLOSES IN</div>
              <div className="text-white text-3xl font-black tabular-nums">{formatTime(timeLeft)}</div>
            </div>
            <AlertTriangle className="w-6 h-6 text-white animate-pulse" />
          </div>
        </div>

        {/* Main Content Box */}
        <div className="bg-gradient-to-br from-white/5 to-white/10 rounded-2xl p-6 md:p-8 border border-white/20 backdrop-blur-sm">
          {/* Headline */}
          <div className="text-center mb-4">
            <h1 className="text-3xl md:text-4xl font-black text-white mb-2 leading-tight">
              WAIT! Last Chance
            </h1>
            <p className="text-base text-gray-300 mb-4">
              You got <span className="text-emerald-400 font-bold">{chosenBonuses.length} bonuses FREE</span> with your purchase
            </p>

            {/* Price - TOP */}
            <div className="bg-[#da2b35]/20 rounded-xl p-4 border-2 border-[#da2b35] inline-block">
              <div className="text-white/80 text-xs mb-1">Get the remaining {remainingBonuses.length} tools</div>
              <div className="flex items-center justify-center gap-3">
                <div className="text-white/40 line-through text-lg">${totalValue}</div>
                <div className="text-4xl font-black text-[#da2b35]">$4.95</div>
              </div>
              <div className="text-green-400 text-sm font-bold mt-1">Just $0.99 each!</div>
            </div>
          </div>

          {/* FREE Bonuses Section */}
          <div className="mb-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3">
            <h3 className="text-sm font-black text-emerald-400 mb-2 text-center flex items-center justify-center gap-2">
              <CheckCircle className="w-4 h-4" />
              ✅ Already Included FREE:
            </h3>
            <div className="grid gap-2">
              {chosenBonuses.map((bonus) => (
                <div key={bonus.id} className="flex items-center gap-2 bg-white/5 rounded-lg p-2 border border-white/10">
                  {bonus.image && (
                    <div className="relative w-8 h-8 flex-shrink-0 rounded overflow-hidden bg-white/10">
                      <Image
                        src={bonus.image}
                        alt={bonus.title}
                        fill
                        className="object-cover"
                        sizes="32px"
                        loading="lazy"
                        quality={75}
                      />
                    </div>
                  )}
                  <div className="flex-1 text-white text-xs font-bold">{bonus.title}</div>
                  <div className="text-emerald-400 font-black text-xs">FREE</div>
                </div>
              ))}
            </div>
          </div>

          {/* DOWNSELL Products */}
          <div className="mb-6">
            <h3 className="text-sm font-black text-white mb-2 text-center">
              🎁 Add {remainingBonuses.length} More Tools:
            </h3>
            <div className="grid gap-2">
              {remainingBonuses.map((bonus) => (
                <div key={bonus.id} className="flex items-center gap-2 bg-white/5 rounded-lg p-2 border border-white/10">
                  {bonus.image && (
                    <div className="relative w-8 h-8 flex-shrink-0 rounded overflow-hidden bg-white/10">
                      <Image
                        src={bonus.image}
                        alt={bonus.title}
                        fill
                        className="object-cover"
                        sizes="32px"
                        loading="lazy"
                        quality={75}
                      />
                    </div>
                  )}
                  <div className="flex-1 text-white text-xs font-bold">{bonus.title}</div>
                  <div className="text-right">
                    <div className="text-white/40 line-through text-xs">${bonus.value}</div>
                    <div className="text-[#da2b35] font-black text-xs">$0.99</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Embedded Checkout - Visible & Mobile Optimized */}
          <div className="mt-4 sm:mt-6 -mx-4 sm:mx-0">
            <div className="w-full overflow-hidden rounded-none sm:rounded-xl">
              <WhopCheckoutEmbed
                planId={WHOP.plans.downsell}
                setupFutureUsage="off_session"
                theme="dark"
                onComplete={handleComplete}
              />
            </div>
          </div>

          {/* Decline Button */}
          <div className="mt-4">
            <button
              onClick={handleDecline}
              className="w-full bg-white/10 hover:bg-white/20 text-white px-6 py-4 rounded-xl font-bold text-base transition-all duration-200 border border-white/20"
            >
              No thanks, I'll skip this offer
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
