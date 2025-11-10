'use client'

import { useState, useEffect } from 'react'
import { X, Clock, Zap, ArrowRight } from 'lucide-react'

export default function ExitIntentPopup() {
  const [showPopup, setShowPopup] = useState(false)
  const [hasShown, setHasShown] = useState(false)

  useEffect(() => {
    // Check if popup was already shown in this session
    const popupShown = sessionStorage.getItem('exitPopupShown')
    if (popupShown) {
      setHasShown(true)
      return
    }

    let mouseLeaveTimeout: NodeJS.Timeout

    const handleMouseLeave = (e: MouseEvent) => {
      // Only trigger if mouse leaves from top (navigation away intent)
      if (e.clientY <= 0 && !hasShown) {
        mouseLeaveTimeout = setTimeout(() => {
          setShowPopup(true)
          setHasShown(true)
          sessionStorage.setItem('exitPopupShown', 'true')
        }, 100)
      }
    }

    const handleMouseEnter = () => {
      clearTimeout(mouseLeaveTimeout)
    }

    document.addEventListener('mouseleave', handleMouseLeave)
    document.addEventListener('mouseenter', handleMouseEnter)

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave)
      document.removeEventListener('mouseenter', handleMouseEnter)
      clearTimeout(mouseLeaveTimeout)
    }
  }, [hasShown])

  const handleClose = () => {
    setShowPopup(false)
  }

  const handleCTA = () => {
    // Scroll to pricing section or trigger checkout
    const pricingSection = document.getElementById('pricing')
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: 'smooth' })
    }
    setShowPopup(false)
  }

  if (!showPopup) return null

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="relative mx-4 max-w-lg animate-in fade-in zoom-in-95 duration-200">
        {/* Close button - Clean & Subtle */}
        <button
          onClick={handleClose}
          className="absolute -right-3 -top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-gray-800 text-gray-400 shadow-lg transition-all hover:bg-gray-700 hover:text-white hover:scale-110"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Popup content - Black & Gold Card */}
        <div className="relative overflow-hidden rounded-2xl bg-black border border-yellow-500/20 p-8 shadow-2xl md:p-10">
          {/* Content */}
          <div className="text-center">
            {/* Icon - Gold Gradient Circle */}
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-yellow-500 to-orange-500">
              <Zap className="h-8 w-8 text-black" />
            </div>

            {/* Headline - Professional */}
            <h2 className="mb-3 text-2xl font-black text-white md:text-3xl">
              Before You Go...
            </h2>

            {/* Subheadline - Clear Value */}
            <p className="mb-8 text-base text-gray-300 md:text-lg">
              Join 500+ agents creating AI videos that generate qualified leads on autopilot
            </p>

            {/* Simple 3 Benefits */}
            <div className="mb-8 space-y-3 text-left">
              <div className="flex items-center gap-3">
                <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-yellow-500 to-orange-500">
                  <span className="text-xs font-bold text-black">✓</span>
                </div>
                <p className="text-sm text-gray-300">7-minute setup, lifetime access</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-yellow-500 to-orange-500">
                  <span className="text-xs font-bold text-black">✓</span>
                </div>
                <p className="text-sm text-gray-300">30-day money-back guarantee</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-yellow-500 to-orange-500">
                  <span className="text-xs font-bold text-black">✓</span>
                </div>
                <p className="text-sm text-gray-300">Instant download after purchase</p>
              </div>
            </div>

            {/* CTA Button - Gold Gradient */}
            <button
              onClick={handleCTA}
              className="group mb-4 w-full rounded-lg bg-gradient-to-r from-yellow-500 to-orange-500 px-6 py-4 text-lg font-bold text-black shadow-lg transition-all hover:from-yellow-400 hover:to-orange-400 hover:shadow-xl"
            >
              <div className="flex items-center justify-center gap-2">
                <span>Get Instant Access — $37</span>
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </div>
            </button>

            {/* No thanks - Subtle */}
            <button
              onClick={handleClose}
              className="text-sm text-gray-500 underline transition-colors hover:text-gray-400"
            >
              Continue browsing
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
