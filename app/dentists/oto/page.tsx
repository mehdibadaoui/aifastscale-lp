'use client'

import { useState, useEffect } from 'react'
import { Clock, CheckCircle, ArrowRight, Gift } from 'lucide-react'
import Image from 'next/image'
import { DENTIST_BONUS_PRODUCTS } from '../../config/dentist-bonus-products'
import { trackTikTokInitiateCheckout } from '../../components/TikTokPixel'
import { trackMetaEvent } from '../../components/MetaPixel'

// Whop checkout link for OTO - REPLACE WITH YOUR ACTUAL PLAN LINK
const WHOP_OTO_LINK = 'https://whop.com/checkout/plan_DENTIST_OTO_10'

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

export default function DentistOtoPage() {
  const [timeLeft, setTimeLeft] = useState(10 * 60) // 10 minutes

  // Track page view
  useEffect(() => {
    // Track ViewContent when page loads
    trackMetaEvent('ViewContent', {
      content_ids: ['dentist-oto'],
      content_name: 'CloneYourself Dentist - Premium Bundle',
      content_type: 'product',
      value: 9.95,
      currency: 'USD'
    })
  }, [])

  // Get the 5 upsell products (last 5 from bonus products)
  const upsellProducts = DENTIST_BONUS_PRODUCTS.slice(5, 10)
  const totalOriginalValue = upsellProducts.reduce((sum, b) => sum + b.value, 0)
  const upsellPrice = 9.95
  const pricePerItem = 1.99

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

  const handleDecline = () => {
    window.location.href = "/dentists/downsell"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-2 md:p-3">
      {/* Modal-style container */}
      <div className="w-full max-w-md bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl md:rounded-2xl border border-teal-500/30 shadow-2xl shadow-teal-500/10 overflow-hidden">

        {/* Header - Timer */}
        <div className="bg-gradient-to-r from-teal-500 to-cyan-500 px-3 md:px-4 py-2 md:py-2.5">
          <div className="flex items-center justify-center gap-1.5 md:gap-2">
            <Clock className="w-3 h-3 md:w-4 md:h-4 text-white animate-pulse" />
            <span className="text-white/90 text-[10px] md:text-xs font-bold">ONE-TIME OFFER - EXPIRES IN</span>
            <span className="text-white text-sm md:text-lg font-black tabular-nums">{formatTime(timeLeft)}</span>
          </div>
        </div>

        {/* All Content - Scrollable */}
        <div className="p-3 md:p-4 max-h-[85vh] overflow-y-auto">

          {/* Title */}
          <div className="text-center mb-3 md:mb-4">
            <h1 className="text-lg md:text-xl font-black text-white mb-0.5 md:mb-1">
              Complete Your Bundle
            </h1>
            <p className="text-white/60 text-xs md:text-sm">
              Add 5 more premium tools for just <span className="text-teal-400 font-black">${pricePerItem} each</span>
            </p>
          </div>

          {/* Products Card */}
          <div className="bg-white/5 rounded-lg md:rounded-xl border border-teal-500/30 mb-3 md:mb-4">
            <div className="px-2.5 md:px-3 py-1.5 md:py-2 border-b border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 md:gap-2">
                  <Gift className="w-3 h-3 md:w-4 md:h-4 text-teal-400" />
                  <span className="text-white font-bold text-xs md:text-sm">5 Premium Tools</span>
                </div>
                <span className="text-teal-400 font-black text-xs md:text-sm">${pricePerItem}/each</span>
              </div>
            </div>

            <div className="p-1.5 md:p-2 space-y-1 md:space-y-1.5">
              {upsellProducts.map((product) => {
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
                        <div className="w-full h-full bg-teal-500/20 flex items-center justify-center">
                          <Gift className="w-4 h-4 md:w-5 md:h-5 text-teal-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-white text-[10px] md:text-xs font-bold truncate">{product.title}</div>
                    </div>
                    <div className="flex items-center gap-1 md:gap-1.5 flex-shrink-0">
                      <span className="text-red-400 line-through text-[9px] md:text-[10px]">${product.value}</span>
                      <span className="text-teal-400 font-black text-[10px] md:text-xs bg-teal-500/20 px-1 md:px-1.5 py-0.5 rounded">FREE</span>
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
          <div className="bg-gradient-to-r from-teal-500/15 to-cyan-500/15 rounded-lg md:rounded-xl p-2.5 md:p-3 border border-teal-500/40 mb-3 md:mb-4">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-lg flex items-center justify-center shadow-lg shadow-teal-500/30 flex-shrink-0">
                <svg className="w-4 h-4 md:w-5 md:h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-1.5 md:gap-2">
                  <span className="text-white font-black text-xs md:text-sm">Lifetime Updates</span>
                  <span className="bg-teal-500/30 text-teal-300 px-1 md:px-1.5 py-0.5 rounded text-[8px] md:text-[9px] font-black">WEEKLY</span>
                </div>
                <p className="text-white/50 text-[9px] md:text-[10px]">New tools & templates added weekly forever</p>
              </div>
              <span className="text-teal-400 font-black text-xs md:text-sm">$297</span>
            </div>
          </div>

          {/* Dr. Marcus's Guarantee */}
          <div className="bg-gradient-to-r from-teal-500/10 to-cyan-500/10 border border-teal-500/30 rounded-lg md:rounded-xl p-2.5 md:p-3 mb-3 md:mb-4">
            <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
              <div className="relative w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden border-2 border-teal-400 flex-shrink-0">
                <Image src="/images/dentist/dr-marcus.webp" alt="Dr. Marcus" fill className="object-cover" />
              </div>
              <div>
                <p className="text-white font-black text-xs md:text-sm">Dr. Marcus's "You Win Either Way" Guarantee</p>
                <div className="inline-flex items-center gap-1 bg-teal-500 rounded px-1 md:px-1.5 py-0.5 mt-0.5 md:mt-1">
                  <CheckCircle className="w-2 h-2 md:w-2.5 md:h-2.5 text-white" />
                  <span className="text-white text-[8px] md:text-[9px] font-bold">VERIFIED</span>
                </div>
              </div>
            </div>
            <div className="space-y-1.5 md:space-y-2 text-xs md:text-sm">
              <div className="flex items-start gap-1.5 md:gap-2">
                <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-teal-400 flex-shrink-0 mt-0.5" />
                <p className="text-white/80 text-[10px] md:text-sm"><span className="text-white font-bold">30-Day Money-Back:</span> Don't like it? Full refund.</p>
              </div>
              <div className="flex items-start gap-1.5 md:gap-2">
                <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-teal-400 flex-shrink-0 mt-0.5" />
                <p className="text-white/80 text-[10px] md:text-sm"><span className="text-white font-bold">PLUS $50 Bonus:</span> If these don't help, I'll Venmo you $50.</p>
              </div>
              <div className="flex items-start gap-1.5 md:gap-2">
                <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-teal-400 flex-shrink-0 mt-0.5" />
                <p className="text-white/80 text-[10px] md:text-sm"><span className="text-white font-bold">Keep Everything:</span> Even if you refund, keep all bonuses.</p>
              </div>
            </div>
            <div className="mt-2 md:mt-3 bg-teal-500/10 rounded-lg p-1.5 md:p-2 text-center">
              <p className="text-teal-400 text-[10px] md:text-xs font-bold">You literally CANNOT lose. Either profit or get paid to try it.</p>
            </div>
          </div>

          {/* Price Section */}
          <div className="bg-white/5 rounded-lg md:rounded-xl p-3 md:p-4 mb-3 md:mb-4">
            <div className="flex items-center justify-between mb-1.5 md:mb-2">
              <span className="text-white/50 text-xs md:text-sm">Total Value:</span>
              <span className="text-white/40 line-through text-xs md:text-sm">${totalOriginalValue}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white font-bold text-sm md:text-lg">Today Only:</span>
              <div className="flex items-center gap-1.5 md:gap-2">
                <span className="text-2xl md:text-3xl font-black text-teal-400">${upsellPrice}</span>
                <span className="bg-teal-500/20 text-teal-400 text-[10px] md:text-xs px-1.5 md:px-2 py-0.5 md:py-1 rounded font-black">
                  ${pricePerItem}/tool
                </span>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="space-y-1.5 md:space-y-2">
            <button
              onClick={() => {
                trackInitiateCheckout('dentist-oto', 'CloneYourself Dentist - Premium Bundle', upsellPrice)
                window.location.href = WHOP_OTO_LINK
              }}
              className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white py-3 md:py-4 rounded-lg md:rounded-xl font-black text-sm md:text-base flex items-center justify-center gap-1.5 md:gap-2 hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-lg shadow-teal-500/30"
            >
              <Gift className="w-4 h-4 md:w-5 md:h-5" />
              YES! Add All 5 for ${upsellPrice}
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
            </button>

            <button
              onClick={handleDecline}
              className="w-full text-white/70 text-xs md:text-sm py-2.5 md:py-3 hover:text-white transition-colors underline underline-offset-2"
            >
              No thanks, take me to my purchase →
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
