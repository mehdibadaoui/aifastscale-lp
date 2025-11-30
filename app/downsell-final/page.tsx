'use client'

import { useState, useEffect } from 'react'
import { X, CheckCircle, Shield, ArrowRight, Sparkles, Gift, Clock } from 'lucide-react'
import Image from 'next/image'
import { BONUS_PRODUCTS } from '../config/bonus-products'

export default function DownsellFinalPage() {
  const [timeLeft, setTimeLeft] = useState(3 * 60) // 3 minutes - ultra urgency

  // Get the 5 products user DIDN'T choose (first 5 products)
  const downsellProducts = BONUS_PRODUCTS.slice(0, 5)
  const totalOriginalValue = downsellProducts.reduce((sum, b) => sum + b.value, 0)
  const downsellPrice = 4.97 // $0.99 per product

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
    console.log('All offers declined')
    window.location.href = "/thank-you-confirmed"
  }

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-md z-[9999] overflow-y-auto">
      <div className="min-h-screen flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-4xl">

          {/* Premium Modal Card */}
          <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-3xl border border-white/20 shadow-2xl backdrop-blur-xl overflow-hidden">

            {/* Header with Timer */}
            <div className="relative bg-gradient-to-r from-red-500/20 via-red-600/20 to-red-500/20 border-b border-red-500/30 p-4 sm:p-6">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-500 rounded-xl flex items-center justify-center animate-pulse shadow-lg shadow-red-500/50">
                    <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-white text-sm sm:text-base font-black">FINAL OFFER EXPIRES</div>
                    <div className="text-red-400 text-2xl sm:text-3xl font-black tabular-nums">{formatTime(timeLeft)}</div>
                  </div>
                </div>
                <button
                  onClick={handleFinalDecline}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all group"
                >
                  <X className="w-5 h-5 text-white/60 group-hover:text-white" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 sm:p-8 lg:p-10">

              {/* Headline */}
              <div className="text-center mb-6 sm:mb-8">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-luxury-gold/20 to-luxury-gold-light/20 border border-luxury-gold/30 rounded-full px-4 py-2 mb-4">
                  <Sparkles className="w-4 h-4 text-luxury-gold" />
                  <span className="text-luxury-gold text-xs sm:text-sm font-black uppercase tracking-wide">
                    Last Chance Offer
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white mb-3 sm:mb-4 leading-tight">
                  Wait! Grab The Other <span className="text-luxury-gold">5 Tools</span>
                </h1>

                <p className="text-base sm:text-lg text-white/70 max-w-2xl mx-auto leading-relaxed">
                  Complete your arsenal. These are the 5 resources you didn't select—
                  <span className="text-white font-bold"> now at 97% OFF</span> before this page closes forever.
                </p>
              </div>

              {/* Insane Price Display */}
              <div className="bg-gradient-to-br from-luxury-gold/20 to-luxury-gold/10 border-2 border-luxury-gold/30 rounded-2xl p-6 sm:p-8 mb-6 sm:mb-8 text-center">
                <div className="text-white/60 text-sm sm:text-base mb-3">Complete Collection (5 Premium Tools)</div>
                <div className="flex items-center justify-center gap-4 mb-4">
                  <div className="text-white/40 line-through text-3xl sm:text-4xl font-bold">${totalOriginalValue}</div>
                  <ArrowRight className="w-6 h-6 text-white/40" />
                  <div className="text-5xl sm:text-6xl font-black bg-gradient-to-r from-luxury-gold via-luxury-gold-light to-luxury-gold bg-clip-text text-transparent">
                    ${downsellPrice}
                  </div>
                </div>
                <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/40 rounded-xl px-4 sm:px-6 py-3 mb-3">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                  <span className="text-emerald-400 text-base sm:text-lg font-black">
                    SAVE ${(totalOriginalValue - downsellPrice).toFixed(2)} (97% OFF)
                  </span>
                </div>
                <p className="text-white/50 text-sm sm:text-base font-medium">
                  Just <span className="text-luxury-gold font-black">${(downsellPrice / 5).toFixed(2)}</span> per premium resource
                </p>
              </div>

              {/* Products Grid - Premium Layout */}
              <div className="mb-6 sm:mb-8">
                <h3 className="text-lg sm:text-xl font-black text-white mb-4 flex items-center gap-2">
                  <Gift className="w-5 h-5 sm:w-6 sm:h-6 text-luxury-gold" />
                  Your Missing 5 Tools:
                </h3>
                <div className="space-y-3">
                  {downsellProducts.map((product, index) => (
                    <div
                      key={product.id}
                      className="group bg-gradient-to-r from-white/5 to-white/10 hover:from-white/10 hover:to-white/15 rounded-xl p-4 border border-white/10 hover:border-luxury-gold/30 transition-all duration-300"
                    >
                      <div className="flex items-center gap-4">
                        {/* Number Badge */}
                        <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-luxury-gold to-luxury-gold-dark rounded-xl flex items-center justify-center shadow-lg">
                          <span className="text-luxury-black text-base font-black">{index + 1}</span>
                        </div>

                        {/* Image */}
                        {product.image && (
                          <div className="relative w-14 h-14 flex-shrink-0 rounded-lg overflow-hidden bg-white/10 border border-white/20">
                            <Image
                              src={product.image}
                              alt={product.title}
                              fill
                              className="object-cover"
                              sizes="56px"
                              loading="lazy"
                              quality={75}
                            />
                          </div>
                        )}

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="text-white text-base sm:text-lg font-bold mb-1">{product.title}</div>
                          <div className="text-white/60 text-sm">{product.subtitle}</div>
                        </div>

                        {/* Price */}
                        <div className="flex-shrink-0 text-right">
                          <div className="text-white/40 line-through text-sm">${product.value}</div>
                          <div className="text-luxury-gold font-black text-lg">${(downsellPrice / 5).toFixed(2)}</div>
                        </div>

                        {/* Checkmark */}
                        <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sara's Guarantee - Compact Version */}
              <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20 rounded-2xl p-4 sm:p-6 mb-6">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="relative flex-shrink-0">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden border-2 border-blue-400 shadow-lg">
                      <Image
                        src="/images/Sara 61kb.webp"
                        alt="Sara Cohen"
                        fill
                        className="object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="text-base sm:text-lg font-black text-white">Triple-Lock Guarantee</h4>
                      <div className="inline-flex items-center gap-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full px-2 py-0.5">
                        <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-white text-[10px] font-black">VERIFIED</span>
                      </div>
                    </div>
                    <div className="text-sm sm:text-base text-white/70 space-y-1.5">
                      <p><span className="text-white font-bold">✓ 30-Day Refund</span> + <span className="text-emerald-400 font-bold">$50 Sorry Gift</span> + <span className="text-white font-bold">Keep Forever</span></p>
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="space-y-3">
                {/* Accept Button */}
                <button
                  onClick={() => {
                    // TODO: Add new payment gateway checkout URL here
                    alert('Payment gateway not configured. Please contact support.')
                  }}
                  className="group w-full bg-gradient-to-r from-luxury-gold via-luxury-gold-light to-luxury-gold hover:shadow-2xl hover:shadow-luxury-gold/50 text-luxury-black px-6 sm:px-8 py-5 sm:py-6 rounded-2xl text-lg sm:text-xl font-black transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-xl flex items-center justify-center gap-3"
                >
                  <Gift className="w-6 h-6" />
                  <span>YES! Add These 5 for ${downsellPrice}</span>
                  <ArrowRight className="w-6 h-6 transition-transform group-hover:translate-x-1" />
                </button>

                <div className="text-center">
                  <div className="flex items-center justify-center gap-4 text-xs sm:text-sm text-white/50 mb-3">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Instant Access</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                      <span>30-Day Guarantee + $50</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Keep Forever</span>
                    </div>
                  </div>
                </div>

                {/* Decline Button */}
                <button
                  onClick={handleFinalDecline}
                  className="w-full bg-transparent hover:bg-white/5 text-white/40 hover:text-white/60 px-6 py-3 rounded-xl text-sm font-medium transition-all"
                >
                  No thanks, I'll skip saving ${(totalOriginalValue - downsellPrice).toFixed(2)}
                </button>
              </div>

              {/* Final FOMO */}
              <div className="mt-6 text-center">
                <p className="text-red-400 text-xs sm:text-sm font-black animate-pulse">
                  🔥 Timer hits 0:00 = This offer disappears forever
                </p>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
