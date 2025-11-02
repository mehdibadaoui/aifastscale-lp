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
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="relative mx-4 max-w-2xl animate-in fade-in zoom-in duration-300">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute -right-4 -top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-gray-800 text-white transition-colors hover:bg-gray-700"
          aria-label="Close popup"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Popup content */}
        <div className="relative overflow-hidden rounded-3xl border-4 border-yellow-400 bg-gradient-to-br from-gray-900 via-black to-gray-900 p-8 shadow-2xl md:p-12">
          {/* Glow effect */}
          <div className="absolute -left-20 -top-20 h-40 w-40 rounded-full bg-yellow-400/20 blur-3xl"></div>
          <div className="absolute -bottom-20 -right-20 h-40 w-40 rounded-full bg-purple-400/20 blur-3xl"></div>

          {/* Content */}
          <div className="relative text-center">
            {/* Icon */}
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-orange-500">
              <Zap className="h-10 w-10 text-black" />
            </div>

            {/* Headline */}
            <h2 className="mb-4 text-3xl font-black text-white md:text-5xl">
              WAIT! Don't Miss This...
            </h2>

            {/* Subheadline */}
            <p className="mb-6 text-lg text-gray-300 md:text-xl">
              You're <span className="font-black text-yellow-400">one step away</span> from generating{' '}
              <span className="font-black text-green-400">100+ leads this month</span>
            </p>

            {/* Offer box */}
            <div className="mb-8 rounded-2xl border-2 border-yellow-400/30 bg-yellow-400/10 p-6">
              <div className="mb-3 flex items-center justify-center gap-2 text-yellow-400">
                <Clock className="h-5 w-5" />
                <span className="text-sm font-bold uppercase tracking-wider">
                  Special One-Time Offer
                </span>
              </div>
              <p className="mb-2 text-2xl font-black text-white md:text-3xl">
                Get Started for Just $37
              </p>
              <p className="text-sm text-gray-400">
                + 30-Day Money-Back Guarantee
              </p>
            </div>

            {/* Bullet points */}
            <div className="mb-8 space-y-3 text-left">
              <div className="flex items-start gap-3">
                <div className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-green-500">
                  <span className="text-xs font-black text-white">✓</span>
                </div>
                <p className="text-base text-gray-300">
                  Create unlimited AI talking videos in 7 minutes
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-green-500">
                  <span className="text-xs font-black text-white">✓</span>
                </div>
                <p className="text-base text-gray-300">
                  500+ real estate agents already using this system
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-green-500">
                  <span className="text-xs font-black text-white">✓</span>
                </div>
                <p className="text-base text-gray-300">
                  Lifetime access + free monthly updates
                </p>
              </div>
            </div>

            {/* CTA Button */}
            <button
              onClick={handleCTA}
              className="group relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 px-8 py-5 text-xl font-black uppercase text-black shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-yellow-400/50"
            >
              <div className="flex items-center justify-center gap-3">
                <span>Yes! I Want 100+ Leads</span>
                <ArrowRight className="h-6 w-6 transition-transform group-hover:translate-x-2" />
              </div>
            </button>

            {/* No thanks */}
            <button
              onClick={handleClose}
              className="mt-4 text-sm text-gray-500 underline transition-colors hover:text-gray-400"
            >
              No thanks, I don't want more leads
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
