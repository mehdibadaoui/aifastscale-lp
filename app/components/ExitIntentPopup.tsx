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
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative mx-4 max-w-lg animate-in fade-in zoom-in-95 duration-200">

        {/* Popup content - Clean White Card */}
        <div className="relative overflow-hidden rounded-2xl bg-white p-8 shadow-2xl md:p-10">
          {/* Content */}
          <div className="text-center">
            {/* Icon - Simple Blue Circle */}
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-900">
              <Zap className="h-8 w-8 text-white" />
            </div>

            {/* Headline - Professional */}
            <h2 className="mb-3 text-2xl font-bold text-gray-900 md:text-3xl">
              Before You Go...
            </h2>

            {/* Subheadline - Clear Value */}
            <p className="mb-8 text-base text-gray-600 md:text-lg">
              Join 500+ agents creating AI videos that generate qualified leads on autopilot
            </p>

            {/* Simple 3 Benefits */}
            <div className="mb-8 space-y-3 text-left">
              <div className="flex items-center gap-3">
                <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-green-500">
                  <span className="text-xs font-bold text-white">✓</span>
                </div>
                <p className="text-sm text-gray-700">7-minute setup, lifetime access</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-green-500">
                  <span className="text-xs font-bold text-white">✓</span>
                </div>
                <p className="text-sm text-gray-700">30-day money-back guarantee</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-green-500">
                  <span className="text-xs font-bold text-white">✓</span>
                </div>
                <p className="text-sm text-gray-700">Instant download after purchase</p>
              </div>
            </div>

            {/* CTA Button - Clean Blue */}
            <button
              onClick={handleCTA}
              className="group mb-4 w-full rounded-lg bg-blue-900 px-6 py-4 text-lg font-semibold text-white shadow-lg transition-all hover:bg-blue-800 hover:shadow-xl"
            >
              <div className="flex items-center justify-center gap-2">
                <span>Get Instant Access — $37</span>
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </div>
            </button>

            {/* No thanks - Tiny */}
            <button
              onClick={handleClose}
              className="text-xs text-gray-400 underline transition-colors hover:text-gray-600"
            >
              Continue browsing
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
