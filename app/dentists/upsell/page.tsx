'use client'

import { useState, useEffect } from 'react'
import { Clock, Gift } from 'lucide-react'
import Image from 'next/image'
import { DENTIST_BONUS_PRODUCTS } from '../../config/dentist-bonus-products'
import { trackTikTokInitiateCheckout } from '../../components/TikTokPixel'
import { trackMetaEvent } from '../../components/MetaPixel'

// Whop checkout link for Upsell
const WHOP_UPSELL_LINK = 'https://whop.com/checkout/plan_IbsV5qrvMPBgb'

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

export default function DentistUpsellPage() {
  const [timeLeft, setTimeLeft] = useState(10 * 60) // 10 minutes

  // Track page view
  useEffect(() => {
    // Track ViewContent when page loads
    trackMetaEvent('ViewContent', {
      content_ids: ['dentist-upsell'],
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
          <div className="space-y-2 md:space-y-3">
            <button
              onClick={() => {
                trackInitiateCheckout('dentist-upsell', 'CloneYourself Dentist - Premium Bundle', upsellPrice)
                window.location.href = WHOP_UPSELL_LINK
              }}
              className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white py-4 md:py-5 rounded-xl font-black text-base md:text-lg flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-lg shadow-teal-500/30"
            >
              Yes, Add to My Order - ${upsellPrice}
            </button>

            <button
              onClick={handleDecline}
              className="w-full bg-white/10 border border-white/20 text-white/80 py-3 md:py-4 rounded-xl font-bold text-sm md:text-base hover:bg-white/20 transition-colors"
            >
              No Thanks
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
