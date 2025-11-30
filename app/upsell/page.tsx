'use client'

import { useState, useEffect } from 'react'
import { Clock, Zap, CheckCircle, Shield, X, ArrowRight, AlertCircle } from 'lucide-react'
import Image from 'next/image'
import { BONUS_PRODUCTS } from '../config/bonus-products'

export default function UpsellPage() {
  const [timeLeft, setTimeLeft] = useState(10 * 60) // 10 minutes

  // Get the 5 upsell products (last 5 from bonus products)
  const upsellProducts = BONUS_PRODUCTS.slice(5, 10)
  const totalOriginalValue = upsellProducts.reduce((sum, b) => sum + b.value, 0)
  const upsellPrice = 9.95

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
    console.log('Upsell declined')
    window.location.href = "/downsell-final"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#151515] to-[#0a0a0a]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8">

        {/* FOMO Timer - Urgent Red */}
        <div className="bg-gradient-to-r from-[#da2b35] to-[#da2b35]/80 border-2 border-[#da2b35] rounded-xl p-3 sm:p-4 mb-4 sm:mb-6 text-center shadow-2xl">
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white animate-pulse" />
            <span className="text-white text-xs sm:text-sm font-bold">THIS PAGE CLOSES IN</span>
            <span className="text-white text-lg sm:text-2xl font-black tabular-nums">{formatTime(timeLeft)}</span>
          </div>
          <p className="text-white/90 text-xs sm:text-sm mt-1 font-medium">
            This offer will NEVER appear again • Miss it = Gone forever
          </p>
        </div>

        {/* Main Card - Premium Design */}
        <div className="bg-gradient-to-br from-white/5 to-white/10 rounded-2xl p-6 sm:p-8 border border-white/20 backdrop-blur-sm shadow-2xl">

          {/* Headline - Urgency + FOMO */}
          <div className="text-center mb-6">
            <div className="inline-block bg-[#da2b35]/20 border border-[#da2b35] rounded-full px-4 py-1.5 mb-4">
              <span className="text-[#da2b35] text-xs sm:text-sm font-black uppercase tracking-wide">
                ⚡ ONE-TIME OFFER ⚡
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-3 leading-tight">
              Wait! You're Leaving ${totalOriginalValue.toFixed(0)} on the Table
            </h1>

            <p className="text-base sm:text-lg text-white/80 mb-4 max-w-xl mx-auto">
              Before you go... grab these 5 remaining tools for <span className="text-[#d4af37] font-black">95% OFF</span>.
              This page disappears in {Math.floor(timeLeft / 60)} minutes.
            </p>
          </div>

          {/* Price Comparison - Make Them Feel They're Winning */}
          <div className="bg-gradient-to-br from-[#d4af37]/20 to-[#d4af37]/10 border-2 border-[#d4af37]/30 rounded-xl p-4 sm:p-6 mb-6 text-center">
            <div className="text-white/70 text-sm sm:text-base mb-2">Complete Your Bundle:</div>
            <div className="flex items-center justify-center gap-3 sm:gap-4 mb-3">
              <div className="text-white/40 line-through text-2xl sm:text-3xl font-bold">${totalOriginalValue}</div>
              <div className="text-4xl sm:text-5xl font-black text-[#d4af37]">${upsellPrice}</div>
            </div>
            <div className="bg-green-500/20 border border-green-500/40 rounded-lg py-2 px-4 inline-block">
              <span className="text-green-400 text-sm sm:text-base font-black">
                YOU SAVE ${(totalOriginalValue - upsellPrice).toFixed(2)} (95% OFF)
              </span>
            </div>
            <p className="text-white/60 text-xs sm:text-sm mt-3 font-medium">
              Just $1.99 per premium resource • Normally $37+ each
            </p>
          </div>

          {/* Products List - Compact & Clean */}
          <div className="mb-6">
            <h3 className="text-base sm:text-lg font-black text-white mb-3 text-center">
              🎁 Add These 5 Premium Tools:
            </h3>
            <div className="space-y-2">
              {upsellProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center gap-3 bg-white/5 rounded-lg p-3 border border-white/10 hover:bg-white/10 transition-all"
                >
                  {product.image && (
                    <div className="relative w-10 h-10 flex-shrink-0 rounded overflow-hidden bg-white/10">
                      <Image
                        src={product.image}
                        alt={product.title}
                        fill
                        className="object-cover"
                        sizes="40px"
                        loading="lazy"
                        quality={75}
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="text-white text-sm sm:text-base font-bold truncate">{product.title}</div>
                    <div className="text-white/60 text-xs sm:text-sm">{product.subtitle}</div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-white/40 line-through text-xs sm:text-sm">${product.value}</div>
                    <div className="text-[#d4af37] font-black text-sm sm:text-base">$1.99</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sara's Irresistible Guarantee */}
          <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/30 rounded-xl p-4 sm:p-6 mb-6">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="relative flex-shrink-0">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 border-blue-400 shadow-lg">
                  <Image
                    src="/images/Sara 61kb.webp"
                    alt="Sara Cohen"
                    fill
                    className="object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              </div>
              <div className="flex-1">
                <h4 className="text-lg sm:text-xl font-black text-white mb-2 flex items-center gap-2">
                  Sara's "You Win Either Way" Guarantee
                  <div className="flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-white text-xs font-black">VERIFIED</span>
                  </div>
                </h4>
                <div className="space-y-2 text-sm sm:text-base text-white/80">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <p className="font-medium">
                      <span className="text-white font-bold">30-Day Money-Back:</span> Don't like it? Full refund. No questions.
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <p className="font-medium">
                      <span className="text-white font-bold">PLUS $50 Bonus:</span> If these don't help, I'll personally Venmo you $50 for wasting your time.
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <p className="font-medium">
                      <span className="text-white font-bold">Keep Everything:</span> Even if you refund, keep all 5 bonuses. My gift to you.
                    </p>
                  </div>
                </div>
                <div className="mt-3 bg-green-500/20 border border-green-500/40 rounded-lg p-3">
                  <p className="text-green-400 text-xs sm:text-sm font-black text-center">
                    Translation: You literally CANNOT lose. Either profit or get paid to try it.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Checkout Button - Prominent */}
          <div className="mb-4">
            <button
              onClick={() => {
                // Redirect to Whop checkout for upsell
                window.location.href = 'https://whop.com/checkout/plan_R3FywBSQynds0'
              }}
              className="group w-full bg-gradient-to-r from-[#d4af37] via-[#f4d03f] to-[#d4af37] hover:shadow-2xl hover:shadow-[#d4af37]/40 text-[#0a0a0a] px-8 py-5 rounded-xl text-lg sm:text-xl font-black transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-xl flex items-center justify-center gap-3"
            >
              <span>YES! Add These 5 Tools for $9.95</span>
              <ArrowRight className="w-6 h-6 transition-transform group-hover:translate-x-1" />
            </button>
            <p className="text-center text-xs sm:text-sm text-white/60 mt-3 font-medium">
              <CheckCircle className="w-3 h-3 text-green-400 inline" /> Instant access • <CheckCircle className="w-3 h-3 text-green-400 inline" /> 30-day guarantee + $50
            </p>
          </div>

          {/* FOMO Warning */}
          <div className="bg-[#da2b35]/10 border border-[#da2b35]/30 rounded-lg p-3 mb-4 text-center">
            <p className="text-white/90 text-xs sm:text-sm font-bold">
              ⚠️ This 95% discount disappears when the timer hits 0:00
            </p>
            <p className="text-white/70 text-xs mt-1">
              Standard price returns to ${totalOriginalValue} after this page closes
            </p>
          </div>

          {/* Decline Button - Less Prominent */}
          <button
            onClick={handleDecline}
            className="w-full bg-transparent hover:bg-white/5 text-white/60 hover:text-white/80 px-6 py-3 rounded-lg font-medium text-sm transition-all duration-200 border border-white/10"
          >
            No thanks, I'll pass on saving ${(totalOriginalValue - upsellPrice).toFixed(2)}
          </button>
        </div>

        {/* Extra FOMO - Below Card */}
        <div className="mt-4 text-center">
          <p className="text-white/50 text-xs sm:text-sm font-medium">
            847 agents grabbed this offer • You're 1 of 23 seeing it right now
          </p>
        </div>
      </div>
    </div>
  )
}
