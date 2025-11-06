'use client'

import React, { useState, useEffect } from 'react'
import { Sparkles, CheckCircle, Loader, X, Crown, Zap, Clock, Users, Shield, TrendingUp, Star, Gift } from 'lucide-react'
import Image from 'next/image'

interface UpsellOfferProps {
  sessionId: string | null
  onUpsellPurchased: (upsellType: string) => void
  onDismiss?: () => void
}

export default function UpsellOffer({
  sessionId,
  onUpsellPurchased,
  onDismiss,
}: UpsellOfferProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState('')
  const [isDismissed, setIsDismissed] = useState(false)
  const [showDownsell, setShowDownsell] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [timeLeft, setTimeLeft] = useState(180) // 3 minutes countdown

  // Countdown timer
  useEffect(() => {
    if (isDismissed) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          handleDismiss()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isDismissed, showDownsell])

  // Reset timer when switching to downsell
  useEffect(() => {
    if (showDownsell) {
      setTimeLeft(120) // 2 minutes for downsell
    }
  }, [showDownsell])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleDismiss = () => {
    if (!showDownsell) {
      // Transition to downsell with loading effect
      setIsTransitioning(true)
      setTimeout(() => {
        setShowDownsell(true)
        setIsTransitioning(false)
        setError('')
      }, 800)
      return
    }

    setIsDismissed(true)
    if (onDismiss) {
      onDismiss()
    }
  }

  if (isDismissed || !sessionId) return null

  const handleUpsellPurchase = async (upsellType: 'blueprint17' | 'blueprint7') => {
    setIsProcessing(true)
    setError('')

    try {
      const response = await fetch('/api/upsell-purchase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          upsellType,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Payment failed')
      }

      // Track the upsell conversion
      if (typeof window !== 'undefined') {
        if ((window as any).gtag) {
          ;(window as any).gtag('event', 'purchase', {
            transaction_id: data.paymentIntentId,
            value: data.amount,
            currency: 'USD',
            items: [{
              item_name: upsellType === 'blueprint17' ? '$17 Blueprint' : '$7 Blueprint',
              price: data.amount,
              quantity: 1,
            }],
          })
        }

        if ((window as any).fbq) {
          ;(window as any).fbq('track', 'Purchase', {
            value: data.amount,
            currency: 'USD',
            content_type: 'product',
            content_name: upsellType === 'blueprint17' ? '$17 Blueprint Upsell' : '$7 Blueprint Upsell',
          })
        }

        if ((window as any).ttq) {
          ;(window as any).ttq.track('CompletePayment', {
            value: data.amount,
            currency: 'USD',
            content_type: 'product',
            content_name: upsellType === 'blueprint17' ? '$17 Blueprint Upsell' : '$7 Blueprint Upsell',
          })
        }
      }

      onUpsellPurchased(upsellType)
      window.location.href = `/thank-you-confirmed?upsell=${upsellType}`
    } catch (err: any) {
      console.error('Upsell purchase error:', err)
      setError(err.message || 'Payment failed. Please try again.')
      setIsProcessing(false)
    }
  }

  // Loading transition
  if (isTransitioning) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm">
        <div className="text-center">
          <Loader className="h-16 w-16 animate-spin text-yellow-400 mx-auto mb-4" />
          <p className="text-2xl font-bold text-white">Loading Your Special Offer...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-5xl max-h-[95vh] overflow-y-auto rounded-3xl border-4 border-yellow-500 bg-gradient-to-br from-gray-900 via-black to-gray-900 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 z-10 rounded-full bg-gray-800 p-2 text-gray-400 transition-colors hover:bg-gray-700 hover:text-white"
          aria-label="Close"
        >
          <X className="h-6 w-6" />
        </button>

        {!showDownsell ? (
          /* ========== OTO $17 OFFER ========== */
          <div className="p-6 md:p-10">
            {/* Urgent Badge */}
            <div className="mb-4 flex justify-center">
              <div className="animate-pulse rounded-full bg-red-600 px-6 py-2 text-sm font-black text-white">
                ⚡ LIMITED TIME - VIP UPGRADE UNLOCKED ⚡
              </div>
            </div>

            {/* Countdown Timer */}
            <div className="mb-6 flex items-center justify-center gap-2">
              <Clock className="h-6 w-6 text-red-500 animate-pulse" />
              <span className="text-2xl font-black text-red-500">
                This Page Closes In: {formatTime(timeLeft)}
              </span>
            </div>

            {/* Main Headline */}
            <div className="mb-6 text-center">
              <h2 className="mb-3 bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-400 bg-clip-text text-4xl font-black text-transparent md:text-6xl leading-tight">
                WAIT! DON'T LEAVE YET...
              </h2>
              <p className="mx-auto max-w-3xl text-xl font-bold text-yellow-400 md:text-3xl mb-3">
                You're One Of The 3% Who Get This VIP Offer
              </p>
              <p className="mx-auto max-w-2xl text-lg text-gray-300 md:text-xl">
                Since you just invested in AgentClone, I want to give you something <span className="text-yellow-400 font-bold">absolutely insane...</span>
              </p>
            </div>

            {/* Social Proof */}
            <div className="mb-8 flex items-center justify-center gap-2 text-green-400">
              <Users className="h-5 w-5" />
              <span className="font-semibold">🔥 147 agents grabbed this in the last 24 hours</span>
            </div>

            {/* Main Offer Section */}
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              {/* Left: Image */}
              <div className="relative rounded-2xl overflow-hidden border-4 border-yellow-500/50 shadow-2xl">
                <Image
                  src="/images/P5_result-original.webp"
                  alt="$10M Creator Blueprint"
                  width={600}
                  height={600}
                  className="w-full h-full object-cover"
                  priority
                />
                <div className="absolute top-4 right-4 bg-red-600 text-white px-4 py-2 rounded-full font-black text-sm animate-bounce">
                  96% OFF TODAY!
                </div>
              </div>

              {/* Right: Offer Details */}
              <div>
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Crown className="h-8 w-8 text-yellow-400" />
                    <h3 className="text-3xl font-black text-yellow-400">
                      $10M CREATOR BLUEPRINT
                    </h3>
                  </div>
                  <p className="text-gray-300 text-lg mb-4">
                    The <span className="text-white font-bold">EXACT system</span> used by 6-figure creators to build massive personal brands...
                  </p>

                  {/* Price */}
                  <div className="mb-6">
                    <div className="flex items-baseline gap-3 mb-2">
                      <span className="text-gray-500 line-through text-2xl">$497</span>
                      <span className="text-white text-5xl font-black">$17</span>
                      <span className="text-green-400 font-bold text-xl">ONLY</span>
                    </div>
                    <p className="text-red-500 font-bold text-sm">
                      ⏰ This Price Will Never Be Available Again After Today
                    </p>
                  </div>

                  {/* Value Stack */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-6 w-6 flex-shrink-0 text-green-400 mt-1" />
                      <div>
                        <p className="text-white font-bold">5-Week $10M Brand Masterclass</p>
                        <p className="text-gray-400 text-sm">Complete system: Identity, Authority, Content, AI, Mindset ($197 value)</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-6 w-6 flex-shrink-0 text-green-400 mt-1" />
                      <div>
                        <p className="text-white font-bold">AI Prompt Library (Copy-Paste Ready)</p>
                        <p className="text-gray-400 text-sm">Hook Generator, DM Scripts, Weekly Planner + more ($147 value)</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-6 w-6 flex-shrink-0 text-green-400 mt-1" />
                      <div>
                        <p className="text-white font-bold">Hook Psychology System</p>
                        <p className="text-gray-400 text-sm">Expectation → Reality → Belief formula + templates ($97 value)</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-6 w-6 flex-shrink-0 text-green-400 mt-1" />
                      <div>
                        <p className="text-white font-bold">Brand Score & Content Tracker</p>
                        <p className="text-gray-400 text-sm">Worksheets to measure authority & track results ($56 value)</p>
                      </div>
                    </div>
                  </div>

                  {/* Total Value */}
                  <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-2 border-yellow-500 rounded-xl p-4 mb-6">
                    <p className="text-center text-sm text-gray-400 mb-1">TOTAL VALUE:</p>
                    <p className="text-center text-4xl font-black text-white mb-1">
                      <span className="line-through text-gray-500 text-2xl mr-2">$497</span>
                      $17
                    </p>
                    <p className="text-center text-green-400 font-bold">
                      You Save $480 (96% OFF)
                    </p>
                  </div>

                  {/* CTA Button */}
                  <button
                    onClick={() => handleUpsellPurchase('blueprint17')}
                    disabled={isProcessing}
                    className="group relative w-full overflow-hidden rounded-2xl p-1 transition-all hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50 mb-4"
                  >
                    <div className="absolute -inset-1 animate-pulse rounded-2xl bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 opacity-75 blur-lg transition group-hover:opacity-100"></div>
                    <div className="relative flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-yellow-500 via-orange-500 to-yellow-600 px-8 py-6 text-2xl font-black text-black shadow-xl">
                      {isProcessing ? (
                        <>
                          <Loader className="h-7 w-7 animate-spin" />
                          <span>PROCESSING...</span>
                        </>
                      ) : (
                        <>
                          <Zap className="h-7 w-7" />
                          <span>YES! ADD FOR JUST $17</span>
                          <Zap className="h-7 w-7" />
                        </>
                      )}
                    </div>
                  </button>

                  <p className="text-center text-sm text-gray-400">
                    ✨ No re-entering card info - 1-Click Instant Access
                  </p>
                </div>
              </div>
            </div>

            {/* Guarantee */}
            <div className="mb-6 rounded-2xl border-4 border-green-500 bg-gradient-to-br from-green-500/20 to-emerald-500/20 p-6">
              <div className="flex items-start gap-4">
                <Shield className="h-12 w-12 flex-shrink-0 text-green-400" />
                <div>
                  <h4 className="text-2xl font-black text-green-400 mb-2">
                    100% MONEY-BACK GUARANTEE + KEEP EVERYTHING
                  </h4>
                  <p className="text-white text-lg mb-2">
                    If you don't make back at least <span className="font-bold text-green-400">10X your investment</span> in the next 30 days, I'll refund every penny... and you keep the entire Blueprint.
                  </p>
                  <p className="text-gray-300">
                    That's how confident I am this will transform your business. <span className="text-yellow-400 font-bold">Zero risk, all reward.</span>
                  </p>
                </div>
              </div>
            </div>

            {/* FOMO Section */}
            <div className="mb-6 rounded-xl bg-red-500/10 border-2 border-red-500 p-4">
              <p className="text-center text-red-500 font-bold text-lg">
                ⚠️ WARNING: This offer is ONLY available on this page. Once you leave, it's gone forever at this price.
              </p>
            </div>

            {/* Decline Button */}
            <button
              onClick={handleDismiss}
              disabled={isProcessing}
              className="mx-auto block text-xs text-gray-600 underline hover:text-gray-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-3"
            >
              No thanks, just let me download my 7-Minute AgentClone
            </button>

            {/* Error Message */}
            {error && (
              <div className="mt-4 rounded-lg border border-red-500/50 bg-red-500/10 p-3 text-center">
                <p className="text-sm font-semibold text-red-400">{error}</p>
              </div>
            )}
          </div>
        ) : (
          /* ========== DOWNSELL $7 OFFER ========== */
          <div className="p-6 md:p-10">
            {/* Urgent Badge */}
            <div className="mb-4 flex justify-center">
              <div className="animate-pulse rounded-full bg-red-600 px-6 py-2 text-sm font-black text-white">
                🔥 LAST CHANCE - FINAL OFFER - NEVER AGAIN 🔥
              </div>
            </div>

            {/* Countdown Timer */}
            <div className="mb-6 flex items-center justify-center gap-2">
              <Clock className="h-6 w-6 text-red-500 animate-pulse" />
              <span className="text-2xl font-black text-red-500">
                Offer Expires In: {formatTime(timeLeft)}
              </span>
            </div>

            {/* Main Headline */}
            <div className="mb-6 text-center">
              <h2 className="mb-3 bg-gradient-to-r from-blue-400 via-purple-500 to-blue-400 bg-clip-text text-4xl font-black text-transparent md:text-6xl leading-tight">
                OKAY, HERE'S MY BEST DEAL
              </h2>
              <p className="mx-auto max-w-3xl text-xl font-bold text-blue-400 md:text-3xl mb-3">
                (You Won't See This Price Again... Ever)
              </p>
              <p className="mx-auto max-w-2xl text-lg text-gray-300 md:text-xl">
                I can see you're serious, so let me make this <span className="text-blue-400 font-bold">brain-dead easy...</span>
              </p>
            </div>

            {/* Social Proof */}
            <div className="mb-8 flex items-center justify-center gap-2 text-green-400">
              <TrendingUp className="h-5 w-5" />
              <span className="font-semibold">💰 89 smart agents took this deal in the past hour</span>
            </div>

            {/* Main Offer Section */}
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              {/* Left: Image */}
              <div className="relative rounded-2xl overflow-hidden border-4 border-blue-500/50 shadow-2xl">
                <Image
                  src="/images/P5_result-original.webp"
                  alt="$10M Creator Blueprint Starter"
                  width={600}
                  height={600}
                  className="w-full h-full object-cover"
                  priority
                />
                <div className="absolute top-4 right-4 bg-red-600 text-white px-4 py-2 rounded-full font-black text-sm animate-bounce">
                  98% OFF - INSANE!
                </div>
              </div>

              {/* Right: Offer Details */}
              <div>
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Star className="h-8 w-8 text-blue-400" />
                    <h3 className="text-3xl font-black text-blue-400">
                      STARTER BLUEPRINT
                    </h3>
                  </div>
                  <p className="text-gray-300 text-lg mb-4">
                    Get the <span className="text-white font-bold">most profitable scripts & hooks</span> that will 10X your results...
                  </p>

                  {/* Price */}
                  <div className="mb-6">
                    <div className="flex items-baseline gap-3 mb-2">
                      <span className="text-gray-500 line-through text-2xl">$297</span>
                      <span className="text-white text-5xl font-black">$7</span>
                      <span className="text-green-400 font-bold text-xl">FINAL PRICE</span>
                    </div>
                    <p className="text-red-500 font-bold text-sm">
                      ⏰ This Is Your Last Chance - Page Closes In {formatTime(timeLeft)}
                    </p>
                  </div>

                  {/* Value Stack */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-6 w-6 flex-shrink-0 text-green-400 mt-1" />
                      <div>
                        <p className="text-white font-bold">Weeks 1-3: Foundation Blueprint</p>
                        <p className="text-gray-400 text-sm">Identity, Authority & Content systems ($147 value)</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-6 w-6 flex-shrink-0 text-green-400 mt-1" />
                      <div>
                        <p className="text-white font-bold">Essential AI Prompts</p>
                        <p className="text-gray-400 text-sm">Hook Generator + DM Scripts (ready to use) ($97 value)</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-6 w-6 flex-shrink-0 text-green-400 mt-1" />
                      <div>
                        <p className="text-white font-bold">Quick-Start Brand Worksheets</p>
                        <p className="text-gray-400 text-sm">Get your first content live in 24 hours ($53 value)</p>
                      </div>
                    </div>
                  </div>

                  {/* Total Value */}
                  <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-2 border-blue-500 rounded-xl p-4 mb-6">
                    <p className="text-center text-sm text-gray-400 mb-1">TOTAL VALUE:</p>
                    <p className="text-center text-4xl font-black text-white mb-1">
                      <span className="line-through text-gray-500 text-2xl mr-2">$297</span>
                      $7
                    </p>
                    <p className="text-center text-green-400 font-bold">
                      You Save $290 (98% OFF)
                    </p>
                  </div>

                  {/* CTA Button */}
                  <button
                    onClick={() => handleUpsellPurchase('blueprint7')}
                    disabled={isProcessing}
                    className="group relative w-full overflow-hidden rounded-2xl p-1 transition-all hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50 mb-4"
                  >
                    <div className="absolute -inset-1 animate-pulse rounded-2xl bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600 opacity-75 blur-lg transition group-hover:opacity-100"></div>
                    <div className="relative flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600 px-8 py-6 text-2xl font-black text-white shadow-xl">
                      {isProcessing ? (
                        <>
                          <Loader className="h-7 w-7 animate-spin" />
                          <span>PROCESSING...</span>
                        </>
                      ) : (
                        <>
                          <Gift className="h-7 w-7" />
                          <span>YES! GIVE ME THIS FOR $7</span>
                          <Gift className="h-7 w-7" />
                        </>
                      )}
                    </div>
                  </button>

                  <p className="text-center text-sm text-gray-400">
                    ✨ 1-Click Checkout - Instant Access In 30 Seconds
                  </p>
                </div>
              </div>
            </div>

            {/* Guarantee */}
            <div className="mb-6 rounded-2xl border-4 border-green-500 bg-gradient-to-br from-green-500/20 to-emerald-500/20 p-6">
              <div className="flex items-start gap-4">
                <Shield className="h-12 w-12 flex-shrink-0 text-green-400" />
                <div>
                  <h4 className="text-2xl font-black text-green-400 mb-2">
                    TRIPLE GUARANTEE - YOU LITERALLY CAN'T LOSE
                  </h4>
                  <div className="space-y-2 text-white text-lg">
                    <p><span className="text-green-400 font-bold">1.</span> Make 10X your $7 back or full refund</p>
                    <p><span className="text-green-400 font-bold">2.</span> Keep everything even if you refund</p>
                    <p><span className="text-green-400 font-bold">3.</span> 60-day guarantee (double the standard)</p>
                  </div>
                  <p className="text-gray-300 mt-3">
                    For just $7, you're getting $297 of value with <span className="text-yellow-400 font-bold">ZERO risk.</span> This is the definition of a no-brainer.
                  </p>
                </div>
              </div>
            </div>

            {/* FOMO Section */}
            <div className="mb-6 rounded-xl bg-red-500/10 border-2 border-red-500 p-4">
              <p className="text-center text-red-500 font-bold text-lg">
                🚨 FINAL WARNING: After you close this page, this offer is GONE FOREVER. No exceptions. No second chances.
              </p>
            </div>

            {/* Decline Button */}
            <button
              onClick={handleDismiss}
              disabled={isProcessing}
              className="mx-auto block text-xs text-gray-600 underline hover:text-gray-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-3"
            >
              No thanks, take me to my AgentClone download
            </button>

            {/* Error Message */}
            {error && (
              <div className="mt-4 rounded-lg border border-red-500/50 bg-red-500/10 p-3 text-center">
                <p className="text-sm font-semibold text-red-400">{error}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
