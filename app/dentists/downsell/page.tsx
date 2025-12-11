'use client'

import { useState, useEffect } from 'react'
import { Clock, CheckCircle, ArrowRight, Gift, AlertTriangle } from 'lucide-react'
import Image from 'next/image'
import { DENTIST_BONUS_PRODUCTS } from '../../config/dentist-bonus-products'
import { trackTikTokInitiateCheckout } from '../../components/TikTokPixel'
import { trackMetaEvent } from '../../components/MetaPixel'

// Whop checkout link for Downsell - REPLACE WITH YOUR ACTUAL PLAN LINK
const WHOP_DOWNSELL_LINK = 'https://whop.com/checkout/plan_DENTIST_DS_5'

// Save tracking params to localStorage before Whop redirect
const saveTrackingParams = () => {
  if (typeof window === 'undefined') return

  const params = new URLSearchParams(window.location.search)
  const trackingData: Record<string, string> = {}

  // Capture Meta fbclid
  const fbclid = params.get('fbclid')
  if (fbclid) trackingData.fbclid = fbclid

  // Capture TikTok ttclid
  const ttclid = params.get('ttclid')
  if (ttclid) trackingData.ttclid = ttclid

  // Capture UTM params
  const utmParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']
  utmParams.forEach(param => {
    const value = params.get(param)
    if (value) trackingData[param] = value
  })

  // Capture Meta cookies (_fbc, _fbp) if they exist
  const fbc = document.cookie.split('; ').find(row => row.startsWith('_fbc='))?.split('=')[1]
  const fbp = document.cookie.split('; ').find(row => row.startsWith('_fbp='))?.split('=')[1]
  if (fbc) trackingData._fbc = fbc
  if (fbp) trackingData._fbp = fbp

  // Save timestamp
  trackingData.checkout_started = new Date().toISOString()

  // Store in localStorage (persists across redirect to Whop and back)
  localStorage.setItem('aifastscale_tracking', JSON.stringify(trackingData))
}

// Combined tracking function for all platforms
const trackInitiateCheckout = (contentId: string, contentName: string, value: number) => {
  // Save tracking params BEFORE redirect
  saveTrackingParams()

  // TikTok tracking
  trackTikTokInitiateCheckout(contentId, value)
  // Meta Pixel tracking
  trackMetaEvent('InitiateCheckout', {
    content_ids: [contentId],
    content_name: contentName,
    content_type: 'product',
    value: value,
    currency: 'USD'
  })
}

export default function DentistDownsellPage() {
  const [timeLeft, setTimeLeft] = useState(3 * 60) // 3 minutes - ultra urgency

  // Track page view
  useEffect(() => {
    // Track ViewContent when page loads
    trackMetaEvent('ViewContent', {
      content_ids: ['dentist-downsell'],
      content_name: 'CloneYourself Dentist - Value Bundle',
      content_type: 'product',
      value: 4.97,
      currency: 'USD'
    })
  }, [])

  // Get the 5 upsell products (same as upsell - user declined those)
  const downsellProducts = DENTIST_BONUS_PRODUCTS.slice(5, 10)
  const totalOriginalValue = downsellProducts.reduce((sum, b) => sum + b.value, 0)
  const downsellPrice = 4.97
  const pricePerItem = 0.99

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
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

  const handleFinalDecline = () => {
    window.location.href = "/dentists/thank-you"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-orange-950/20 to-slate-950 flex items-center justify-center p-2 md:p-3">
      {/* Modal-style container */}
      <div className="w-full max-w-md bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl md:rounded-2xl border border-orange-500/40 shadow-2xl shadow-orange-500/10 overflow-hidden">

        {/* Header - Timer - Orange/Red for urgency */}
        <div className="bg-gradient-to-r from-orange-600 to-red-600 px-3 md:px-4 py-2 md:py-2.5">
          <div className="flex items-center justify-center gap-1.5 md:gap-2">
            <AlertTriangle className="w-3 h-3 md:w-4 md:h-4 text-white animate-pulse" />
            <span className="text-white/90 text-[10px] md:text-xs font-bold">WAIT! PRICE DROP - EXPIRES IN</span>
            <span className="text-white text-sm md:text-lg font-black tabular-nums">{formatTime(timeLeft)}</span>
          </div>
        </div>

        {/* All Content - Scrollable */}
        <div className="p-3 md:p-4 max-h-[85vh] overflow-y-auto">

          {/* Title */}
          <div className="text-center mb-3 md:mb-4">
            <div className="inline-flex items-center gap-1.5 bg-orange-500/20 text-orange-400 px-3 py-1 rounded-full text-[10px] md:text-xs font-bold mb-2">
              <Gift className="w-3 h-3" />
              50% OFF - FINAL OFFER
            </div>
            <h1 className="text-lg md:text-xl font-black text-white mb-0.5 md:mb-1">
              Wait! Here's a Better Deal
            </h1>
            <p className="text-white/60 text-xs md:text-sm">
              Get all 5 tools for just <span className="text-orange-400 font-black">${pricePerItem} each</span> - half the price!
            </p>
          </div>

          {/* Price Comparison Banner */}
          <div className="bg-gradient-to-r from-orange-500/20 to-amber-500/20 rounded-lg md:rounded-xl p-2.5 md:p-3 border border-orange-500/40 mb-3 md:mb-4">
            <div className="flex items-center justify-center gap-3 md:gap-4">
              <div className="text-center">
                <p className="text-white/50 text-[9px] md:text-[10px]">Was</p>
                <p className="text-white/40 line-through text-sm md:text-base">$9.95</p>
              </div>
              <ArrowRight className="w-4 h-4 text-orange-400" />
              <div className="text-center">
                <p className="text-orange-400 text-[9px] md:text-[10px] font-bold">NOW</p>
                <p className="text-orange-400 font-black text-xl md:text-2xl">${downsellPrice}</p>
              </div>
              <div className="bg-red-500 text-white px-2 py-1 rounded-lg text-[10px] md:text-xs font-black">
                SAVE 50%
              </div>
            </div>
          </div>

          {/* Products Card */}
          <div className="bg-white/5 rounded-lg md:rounded-xl border border-orange-500/30 mb-3 md:mb-4">
            <div className="px-2.5 md:px-3 py-1.5 md:py-2 border-b border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 md:gap-2">
                  <Gift className="w-3 h-3 md:w-4 md:h-4 text-orange-400" />
                  <span className="text-white font-bold text-xs md:text-sm">5 Premium Tools</span>
                </div>
                <span className="text-orange-400 font-black text-xs md:text-sm">${pricePerItem}/each</span>
              </div>
            </div>

            <div className="p-1.5 md:p-2 space-y-1 md:space-y-1.5">
              {downsellProducts.map((product) => {
                return (
                  <div
                    key={product.id}
                    className="flex items-center gap-1.5 md:gap-2 bg-white/5 rounded-lg p-1.5 md:p-2"
                  >
                    <div className="w-12 h-8 md:w-16 md:h-10 flex-shrink-0 rounded-lg overflow-hidden relative">
                      {product.image ? (
                        <Image
                          src={product.image}
                          alt={product.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-orange-500/20 flex items-center justify-center">
                          <Gift className="w-4 h-4 md:w-5 md:h-5 text-orange-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-white text-[10px] md:text-xs font-bold truncate">{product.title}</div>
                    </div>
                    <div className="flex items-center gap-1 md:gap-1.5 flex-shrink-0">
                      <span className="text-red-400 line-through text-[9px] md:text-[10px]">${product.value}</span>
                      <span className="text-orange-400 font-black text-[10px] md:text-xs bg-orange-500/20 px-1 md:px-1.5 py-0.5 rounded">${pricePerItem}</span>
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
          <div className="bg-gradient-to-r from-orange-500/15 to-amber-500/15 rounded-lg md:rounded-xl p-2.5 md:p-3 border border-orange-500/40 mb-3 md:mb-4">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-orange-500 to-amber-600 rounded-lg flex items-center justify-center shadow-lg shadow-orange-500/30 flex-shrink-0">
                <svg className="w-4 h-4 md:w-5 md:h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-1.5 md:gap-2">
                  <span className="text-white font-black text-xs md:text-sm">Lifetime Updates</span>
                  <span className="bg-orange-500/30 text-orange-300 px-1 md:px-1.5 py-0.5 rounded text-[8px] md:text-[9px] font-black">WEEKLY</span>
                </div>
                <p className="text-white/50 text-[9px] md:text-[10px]">New tools & templates added weekly forever</p>
              </div>
              <span className="text-orange-400 font-black text-xs md:text-sm">$297</span>
            </div>
          </div>

          {/* Dr. Marcus's Guarantee */}
          <div className="bg-gradient-to-r from-orange-500/10 to-amber-500/10 border border-orange-500/30 rounded-lg md:rounded-xl p-2.5 md:p-3 mb-3 md:mb-4">
            <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
              <div className="relative w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden border-2 border-orange-400 flex-shrink-0">
                <Image src="/images/dentist/dr-marcus.webp" alt="Dr. Marcus" fill className="object-cover" />
              </div>
              <div>
                <p className="text-white font-black text-xs md:text-sm">Dr. Marcus's "You Win Either Way" Guarantee</p>
                <div className="inline-flex items-center gap-1 bg-orange-500 rounded px-1 md:px-1.5 py-0.5 mt-0.5 md:mt-1">
                  <CheckCircle className="w-2 h-2 md:w-2.5 md:h-2.5 text-white" />
                  <span className="text-white text-[8px] md:text-[9px] font-bold">VERIFIED</span>
                </div>
              </div>
            </div>
            <div className="space-y-1.5 md:space-y-2 text-xs md:text-sm">
              <div className="flex items-start gap-1.5 md:gap-2">
                <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-orange-400 flex-shrink-0 mt-0.5" />
                <p className="text-white/80 text-[10px] md:text-sm"><span className="text-white font-bold">30-Day Money-Back:</span> Don't like it? Full refund.</p>
              </div>
              <div className="flex items-start gap-1.5 md:gap-2">
                <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-orange-400 flex-shrink-0 mt-0.5" />
                <p className="text-white/80 text-[10px] md:text-sm"><span className="text-white font-bold">PLUS $50 Bonus:</span> If these don't help, I'll Venmo you $50.</p>
              </div>
              <div className="flex items-start gap-1.5 md:gap-2">
                <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-orange-400 flex-shrink-0 mt-0.5" />
                <p className="text-white/80 text-[10px] md:text-sm"><span className="text-white font-bold">Keep Everything:</span> Even if you refund, keep all bonuses.</p>
              </div>
            </div>
            <div className="mt-2 md:mt-3 bg-orange-500/10 rounded-lg p-1.5 md:p-2 text-center">
              <p className="text-orange-400 text-[10px] md:text-xs font-bold">You literally CANNOT lose. Either profit or get paid to try it.</p>
            </div>
          </div>

          {/* Price Section */}
          <div className="bg-gradient-to-r from-orange-500/10 to-amber-500/10 rounded-lg md:rounded-xl p-3 md:p-4 mb-3 md:mb-4 border border-orange-500/30">
            <div className="flex items-center justify-between mb-1.5 md:mb-2">
              <span className="text-white/50 text-xs md:text-sm">Total Value:</span>
              <span className="text-white/40 line-through text-xs md:text-sm">${totalOriginalValue}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white font-bold text-sm md:text-lg">Final Price:</span>
              <div className="flex items-center gap-1.5 md:gap-2">
                <span className="text-2xl md:text-3xl font-black text-orange-400">${downsellPrice}</span>
                <span className="bg-orange-500/20 text-orange-400 text-[10px] md:text-xs px-1.5 md:px-2 py-0.5 md:py-1 rounded font-black">
                  ${pricePerItem}/tool
                </span>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="space-y-1.5 md:space-y-2">
            <button
              onClick={() => {
                trackInitiateCheckout('dentist-downsell', 'CloneYourself Dentist - Value Bundle', downsellPrice)
                window.location.href = WHOP_DOWNSELL_LINK
              }}
              className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white py-3 md:py-4 rounded-lg md:rounded-xl font-black text-sm md:text-base flex items-center justify-center gap-1.5 md:gap-2 hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-lg shadow-orange-500/30 animate-pulse"
            >
              <Gift className="w-4 h-4 md:w-5 md:h-5" />
              YES! Grab All 5 for Only ${downsellPrice}
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
            </button>

            <button
              onClick={handleFinalDecline}
              className="w-full text-white/50 text-[10px] md:text-xs py-2 md:py-2.5 hover:text-white/70 transition-colors"
            >
              No thanks, I don't want 50% off →
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
  )
}
