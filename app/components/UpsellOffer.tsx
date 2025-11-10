'use client'

import React, { useState } from 'react'
import { CheckCircle, Loader, X, Shield } from 'lucide-react'
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

  const handleDismiss = () => {
    if (!showDownsell) {
      // Transition to downsell
      setIsTransitioning(true)
      setTimeout(() => {
        setShowDownsell(true)
        setIsTransitioning(false)
        setError('')
      }, 400)
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

      // Track conversion
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
            content_name: upsellType === 'blueprint17' ? '$17 Blueprint' : '$7 Blueprint',
          })
        }

        if ((window as any).ttq) {
          ;(window as any).ttq.track('CompletePayment', {
            value: data.amount,
            currency: 'USD',
            content_type: 'product',
            content_name: upsellType === 'blueprint17' ? '$17 Blueprint' : '$7 Blueprint',
          })
        }
      }

      onUpsellPurchased(upsellType)
      window.location.href = `/thank-you-confirmed?upsell=${upsellType}`
    } catch (err: any) {
      console.error('Upsell error:', err)
      setError(err.message || 'Payment failed. Please try again.')
      setIsProcessing(false)
    }
  }

  // Loading transition
  if (isTransitioning) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <Loader className="h-12 w-12 animate-spin text-orange-500" />
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-2xl max-h-[95vh] overflow-y-auto bg-black rounded-2xl shadow-2xl border border-yellow-500/20">
        {/* Close Button */}
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 z-10 rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-800 hover:text-white"
          aria-label="Close"
        >
          <X className="h-6 w-6" />
        </button>

        {!showDownsell ? (
          /* ========== UPSELL $17 ========== */
          <div className="px-6 py-10 md:px-12 md:py-14">
            {/* Badge */}
            <div className="mb-6 text-center">
              <span className="inline-block rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 px-4 py-1.5 text-sm font-bold uppercase text-black">
                One-Time Offer
              </span>
            </div>

            {/* Headline */}
            <h2 className="mb-3 text-center text-2xl font-black text-white md:text-4xl">
              Your Videos Are Ready...
              <br />
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                But Without Strategy, They Won't Close Deals
              </span>
            </h2>
            <p className="mx-auto mb-8 max-w-xl text-center text-base text-gray-300 md:text-lg">
              The $10M Personal Brand Masterclass — The 5-week system top 1% agents use to build authority and attract high-value clients
            </p>

            {/* Product Image */}
            <div className="relative mx-auto mb-8 max-w-md">
              <div className="absolute inset-0 animate-pulse rounded-2xl bg-gradient-to-r from-yellow-400/20 to-orange-500/20 blur-xl"></div>
              <Image
                src="/images/P5_result-original.webp"
                alt="$10M Personal Brand Blueprint"
                width={500}
                height={500}
                className="relative w-full rounded-xl border border-yellow-500/30"
                priority
              />
            </div>

            {/* Quick Benefits */}
            <div className="mb-8 space-y-3">
              {[
                'Real agent closed $2M deal using AI-clone video tours while traveling',
                'Another got 12 buyer consults in 10 days from 4 short explainers',
                '5-week proven system • AI prompts • Hook psychology • No fluff',
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 mt-0.5 flex-shrink-0 text-yellow-400" />
                  <p className="text-sm text-gray-300 md:text-base">{item}</p>
                </div>
              ))}
            </div>

            {/* Price */}
            <div className="mb-8 text-center">
              <div className="mb-4 flex items-baseline justify-center gap-3">
                <span className="text-4xl font-black text-white md:text-5xl">$17</span>
                <span className="text-2xl text-gray-500 line-through">$497</span>
              </div>
              <p className="text-sm text-gray-400">96% off • Only available on this page</p>
            </div>

            {/* CTA */}
            <button
              onClick={() => handleUpsellPurchase('blueprint17')}
              disabled={isProcessing}
              className="group relative mb-4 w-full overflow-hidden rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 p-0.5 transition-all hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <div className="absolute -inset-1 animate-pulse rounded-xl bg-gradient-to-r from-yellow-400 to-orange-500 opacity-75 blur transition group-hover:opacity-100"></div>
              <div className="relative flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 px-8 py-5 text-xl font-black text-black">
                {isProcessing ? (
                  <>
                    <Loader className="h-5 w-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Add Blueprint for $17
                  </>
                )}
              </div>
            </button>

            {/* Guarantee */}
            <div className="mb-4 flex items-center justify-center gap-2">
              <Shield className="h-4 w-4 text-green-400" />
              <span className="text-xs text-gray-400 md:text-sm">
                30-Day Money-Back Guarantee
              </span>
            </div>

            {/* Decline */}
            <button
              onClick={handleDismiss}
              disabled={isProcessing}
              className="mx-auto block text-sm text-gray-500 underline hover:text-gray-400"
            >
              No thanks, I'll build my brand the slow way
            </button>

            {error && (
              <div className="mt-4 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-center">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}
          </div>
        ) : (
          /* ========== DOWNSELL $7 ========== */
          <div className="px-6 py-10 md:px-12 md:py-14">
            {/* Badge */}
            <div className="mb-6 text-center">
              <span className="inline-block rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 px-4 py-1.5 text-sm font-bold uppercase text-black">
                Final Offer
              </span>
            </div>

            {/* Headline */}
            <h2 className="mb-3 text-center text-2xl font-black text-white md:text-4xl">
              I Get It...
              <br />
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Let's Make This Easier
              </span>
            </h2>
            <p className="mx-auto mb-8 max-w-xl text-center text-base text-gray-300 md:text-lg">
              Get the core branding foundations for less than 2 coffees
            </p>

            {/* Product Image */}
            <div className="relative mx-auto mb-8 max-w-md">
              <div className="absolute inset-0 animate-pulse rounded-2xl bg-gradient-to-r from-yellow-400/20 to-orange-500/20 blur-xl"></div>
              <Image
                src="/images/P5_result-original.webp"
                alt="Essential Brand Blueprint"
                width={500}
                height={500}
                className="relative w-full rounded-xl border border-yellow-500/30"
                priority
              />
            </div>

            {/* Quick Benefits */}
            <div className="mb-8 space-y-3">
              {[
                'Foundation Blueprint (Weeks 1-3) — Identity, authority, content frameworks',
                'Essential AI Prompts — Hook generator and DM scripts ready to use',
                'Quick-Start Worksheets — Launch your first content in 24 hours',
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 mt-0.5 flex-shrink-0 text-yellow-400" />
                  <p className="text-sm text-gray-300 md:text-base">{item}</p>
                </div>
              ))}
            </div>

            {/* Price */}
            <div className="mb-8 text-center">
              <div className="mb-4 flex items-baseline justify-center gap-3">
                <span className="text-4xl font-black text-white md:text-5xl">$7</span>
                <span className="text-2xl text-gray-500 line-through">$297</span>
              </div>
              <p className="text-sm text-gray-400">98% off • Disappears when you close this</p>
            </div>

            {/* CTA */}
            <button
              onClick={() => handleUpsellPurchase('blueprint7')}
              disabled={isProcessing}
              className="group relative mb-4 w-full overflow-hidden rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 p-0.5 transition-all hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <div className="absolute -inset-1 animate-pulse rounded-xl bg-gradient-to-r from-yellow-400 to-orange-500 opacity-75 blur transition group-hover:opacity-100"></div>
              <div className="relative flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 px-8 py-5 text-xl font-black text-black">
                {isProcessing ? (
                  <>
                    <Loader className="h-5 w-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Add Blueprint for $7
                  </>
                )}
              </div>
            </button>

            {/* Guarantee */}
            <div className="mb-4 flex items-center justify-center gap-2">
              <Shield className="h-4 w-4 text-green-400" />
              <span className="text-xs text-gray-400 md:text-sm">
                60-Day Money-Back Guarantee
              </span>
            </div>

            {/* Decline */}
            <button
              onClick={handleDismiss}
              disabled={isProcessing}
              className="mx-auto block text-sm text-gray-500 underline hover:text-gray-400"
            >
              Continue without blueprint
            </button>

            {error && (
              <div className="mt-4 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-center">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
