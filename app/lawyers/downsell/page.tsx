'use client'

import { useState, useEffect } from 'react'
import { ArrowRight, Gift, AlertTriangle } from 'lucide-react'
import Image from 'next/image'
import { getLawyerUpsellBonuses } from '../../config/lawyer-bonus-products'

// Whop checkout link for Downsell (redirects to members after purchase)
const CHECKOUT_LINK = 'https://whop.com/checkout/plan_sdONQXGabaCd0?d=https://aifastscale.com/lawyers/members'

export default function LawyerDownsellPage() {
  const [timeLeft, setTimeLeft] = useState(3 * 60) // 3 minutes - ultra urgency

  // Capture user info from URL params for thank-you page
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const email = params.get('email')
    const userId = params.get('user_id') || params.get('whop_user_id')

    if (email) {
      sessionStorage.setItem('lawyer_purchase_email', email.toLowerCase().trim())
    }
    if (userId) {
      sessionStorage.setItem('lawyer_purchase_user_id', userId)
    }
  }, [])

  // Get the 5 downsell products (same as upsell - user declined those)
  const downsellProducts = getLawyerUpsellBonuses()
  const totalOriginalValue = downsellProducts.reduce((sum, b) => sum + b.value, 0)
  const downsellPrice = 4.95
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
    window.location.href = "/lawyers/thank-you"
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
              60% OFF - FINAL OFFER
            </div>
            <h1 className="text-lg md:text-xl font-black text-white mb-0.5 md:mb-1">
              Wait! Here's a Better Deal
            </h1>
            <p className="text-white/60 text-xs md:text-sm">
              Get all 5 tools for just <span className="text-orange-400 font-black">${pricePerItem} each</span> - over half off!
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
                SAVE 60%
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
          <div className="space-y-2 md:space-y-3">
            <a
              href={CHECKOUT_LINK}
              className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white py-4 md:py-5 rounded-xl font-black text-base md:text-lg flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-lg shadow-orange-500/30"
            >
              Yes, Add to My Order - ${downsellPrice}
            </a>

            <button
              onClick={handleFinalDecline}
              className="w-full bg-white/10 border border-white/20 text-white/80 py-3 md:py-4 rounded-xl font-bold text-sm md:text-base hover:bg-white/20 transition-colors"
            >
              No Thanks, Go to Members Area
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
