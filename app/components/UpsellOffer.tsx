'use client'

import React, { useState } from 'react'
import { Sparkles, CheckCircle, Loader, X, Crown, Zap } from 'lucide-react'

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
  const [showDownsell, setShowDownsell] = useState(false) // Track if showing downsell

  const handleDismiss = () => {
    // If showing OTO ($17) and they dismiss, show downsell ($7)
    if (!showDownsell) {
      setShowDownsell(true)
      setError('') // Clear any errors
      return
    }

    // If showing downsell ($7) and they dismiss, close completely
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

      console.log('✅ Upsell purchase successful!', data)

      // Track the upsell conversion
      if (typeof window !== 'undefined') {
        // Google Analytics
        if ((window as any).gtag) {
          ;(window as any).gtag('event', 'purchase', {
            transaction_id: data.paymentIntentId,
            value: data.amount,
            currency: 'USD',
            items: [
              {
                item_name: upsellType === 'blueprint17' ? '$17 Blueprint' : '$7 Blueprint',
                price: data.amount,
                quantity: 1,
              },
            ],
          })
        }

        // Meta Pixel
        if ((window as any).fbq) {
          ;(window as any).fbq('track', 'Purchase', {
            value: data.amount,
            currency: 'USD',
            content_type: 'product',
            content_name: upsellType === 'blueprint17' ? '$17 Blueprint Upsell' : '$7 Blueprint Upsell',
          })
        }

        // TikTok Pixel
        if ((window as any).ttq) {
          ;(window as any).ttq.track('CompletePayment', {
            value: data.amount,
            currency: 'USD',
            content_type: 'product',
            content_name: upsellType === 'blueprint17' ? '$17 Blueprint Upsell' : '$7 Blueprint Upsell',
          })
        }
      }

      // Notify parent component
      onUpsellPurchased(upsellType)

      // Redirect to thank-you page with upsell parameter
      window.location.href = `/thank-you-confirmed?upsell=${upsellType}`
    } catch (err: any) {
      console.error('Upsell purchase error:', err)
      setError(err.message || 'Payment failed. Please try again.')
      setIsProcessing(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
      {/* Upsell Offer Card */}
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl border-2 border-yellow-500/50 bg-gradient-to-br from-gray-900 via-black to-gray-900 p-6 shadow-2xl md:p-10">
        {/* Close Button */}
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 rounded-full bg-gray-800 p-2 text-gray-400 transition-colors hover:bg-gray-700 hover:text-white"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="mb-6 text-center md:mb-8">
          <div className="mb-3 flex items-center justify-center gap-2 md:mb-4">
            <Zap className="h-8 w-8 animate-pulse text-yellow-400 md:h-10 md:w-10" />
            <Sparkles className="h-8 w-8 animate-bounce text-yellow-400 md:h-10 md:w-10" />
          </div>
          <h2 className="mb-3 bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-400 bg-clip-text text-3xl font-black text-transparent md:mb-4 md:text-5xl">
            {showDownsell ? 'LAST CHANCE - FINAL OFFER!' : 'WAIT! ONE-TIME OFFER'}
          </h2>
          <p className="mx-auto max-w-3xl text-lg font-bold text-gray-200 md:text-2xl">
            Add The <span className="text-yellow-400">$10M Creator Blueprint</span> For Just ONE CLICK
          </p>
          <p className="mt-2 text-base text-gray-400 md:mt-3 md:text-lg">
            No need to re-enter your card - we'll use your saved payment method
          </p>
        </div>

        {/* Single Offer (OTO or Downsell) */}
        <div className="mb-6 flex justify-center md:mb-8">
          {!showDownsell ? (
            /* $17 Premium Offer (OTO) */
            <div className="relative overflow-hidden rounded-xl border-2 border-yellow-500/50 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 p-6 max-w-md w-full">
            <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-yellow-500/20 blur-2xl"></div>
            <div className="relative">
              <div className="mb-3 flex items-center gap-2">
                <Crown className="h-6 w-6 text-yellow-400" />
                <h3 className="text-xl font-black text-yellow-400 md:text-2xl">
                  PREMIUM BLUEPRINT
                </h3>
              </div>
              <p className="mb-4 text-4xl font-black text-white md:text-5xl">
                $17
              </p>
              <ul className="mb-6 space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-400" />
                  <span className="text-sm text-gray-300 md:text-base">
                    <strong className="text-white">Complete video scripts</strong> for 50+ winning formats
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-400" />
                  <span className="text-sm text-gray-300 md:text-base">
                    <strong className="text-white">Hook formulas</strong> that get 80% watch time
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-400" />
                  <span className="text-sm text-gray-300 md:text-base">
                    <strong className="text-white">Viral thumbnail templates</strong> (PSD + Canva files)
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-400" />
                  <span className="text-sm text-gray-300 md:text-base">
                    <strong className="text-white">Content calendar system</strong> for 90 days
                  </span>
                </li>
              </ul>
              <button
                onClick={() => handleUpsellPurchase('blueprint17')}
                disabled={isProcessing}
                className="group relative w-full overflow-hidden rounded-xl p-0.5 transition-all hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <div className="absolute -inset-1 animate-pulse rounded-xl bg-gradient-to-r from-yellow-400 to-orange-500 opacity-75 blur transition group-hover:opacity-100"></div>
                <div className="relative flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 px-6 py-4 text-lg font-black text-black">
                  {isProcessing ? (
                    <>
                      <Loader className="h-5 w-5 animate-spin" />
                      <span>PROCESSING...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="h-5 w-5" />
                      <span>YES! ADD FOR $17</span>
                    </>
                  )}
                </div>
              </button>
            </div>
          </div>
          ) : (
            /* $7 Starter Offer (Downsell) */
            <div className="relative overflow-hidden rounded-xl border-2 border-blue-500/50 bg-gradient-to-br from-blue-500/10 to-purple-500/10 p-6 max-w-md w-full">
            <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-blue-500/20 blur-2xl"></div>
            <div className="relative">
              <div className="mb-3 flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-blue-400" />
                <h3 className="text-xl font-black text-blue-400 md:text-2xl">
                  STARTER BLUEPRINT
                </h3>
              </div>
              <p className="mb-4 text-4xl font-black text-white md:text-5xl">
                $7
              </p>
              <ul className="mb-6 space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-400" />
                  <span className="text-sm text-gray-300 md:text-base">
                    <strong className="text-white">20 proven video scripts</strong> to start today
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-400" />
                  <span className="text-sm text-gray-300 md:text-base">
                    <strong className="text-white">Hook formulas</strong> collection
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-400" />
                  <span className="text-sm text-gray-300 md:text-base">
                    <strong className="text-white">Quick-start guide</strong> (PDF)
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-400" />
                  <span className="text-sm text-gray-300 md:text-base">
                    Perfect if you're just starting out
                  </span>
                </li>
              </ul>
              <button
                onClick={() => handleUpsellPurchase('blueprint7')}
                disabled={isProcessing}
                className="group relative w-full overflow-hidden rounded-xl p-0.5 transition-all hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <div className="absolute -inset-1 animate-pulse rounded-xl bg-gradient-to-r from-blue-400 to-purple-500 opacity-75 blur transition group-hover:opacity-100"></div>
                <div className="relative flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 px-6 py-4 text-lg font-black text-white">
                  {isProcessing ? (
                    <>
                      <Loader className="h-5 w-5 animate-spin" />
                      <span>PROCESSING...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="h-5 w-5" />
                      <span>YES! ADD FOR $7</span>
                    </>
                  )}
                </div>
              </button>
            </div>
          </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 rounded-lg border border-red-500/50 bg-red-500/10 p-3 text-center">
            <p className="text-sm font-semibold text-red-400">{error}</p>
          </div>
        )}

        {/* Guarantee */}
        <div className="mb-4 rounded-xl border border-green-500/30 bg-green-500/10 p-4 text-center">
          <p className="text-sm font-bold text-green-400 md:text-base">
            🔒 Same 30-Day Money-Back Guarantee Applies - Zero Risk!
          </p>
        </div>

        {/* Skip Button */}
        <button
          onClick={handleDismiss}
          disabled={isProcessing}
          className="w-full rounded-lg border-2 border-gray-600 bg-transparent px-6 py-3 text-base font-semibold text-gray-400 transition-all hover:border-gray-500 hover:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {showDownsell ? "No thanks, I don't want this final offer" : "No thanks, show me a lower price option"}
        </button>
      </div>
    </div>
  )
}
