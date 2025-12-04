'use client'

import { useEffect, useRef, useState } from 'react'
import { WHOP_CONFIG } from '../config/whop'

interface WhopEmbeddedCheckoutProps {
  isOpen: boolean
  onClose: () => void
  planId?: string
}

export default function WhopEmbeddedCheckout({
  isOpen,
  onClose,
  planId = WHOP_CONFIG.plans.mainCourse.id,
}: WhopEmbeddedCheckoutProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (isOpen && containerRef.current) {
      // Clear any previous checkout
      containerRef.current.innerHTML = ''
      setIsLoading(true)

      // Create the checkout div with data attributes
      const checkoutDiv = document.createElement('div')
      checkoutDiv.id = 'whop-embedded-checkout'
      checkoutDiv.setAttribute('data-whop-checkout-plan-id', planId)
      checkoutDiv.setAttribute('data-whop-checkout-theme', 'light')
      checkoutDiv.setAttribute('data-whop-checkout-hide-address', 'true')
      checkoutDiv.style.cssText = 'height: fit-content; overflow: hidden; width: 100%;'

      containerRef.current.appendChild(checkoutDiv)

      // Wait for Whop loader script to be ready, then initialize
      const initCheckout = () => {
        if ((window as any).WhopCheckout) {
          (window as any).WhopCheckout.init()
          setIsLoading(false)
        } else {
          // Script not loaded yet, wait and retry
          setTimeout(initCheckout, 100)
        }
      }

      // Give script time to load, then init
      setTimeout(initCheckout, 300)

      // Fallback: hide loading after 3s regardless
      const fallbackTimer = setTimeout(() => setIsLoading(false), 3000)
      return () => clearTimeout(fallbackTimer)
    }
  }, [isOpen, planId])

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 overflow-hidden touch-none"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
      onTouchMove={(e) => e.stopPropagation()}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto overscroll-contain animate-scale-in"
        onTouchMove={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          aria-label="Close checkout"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Loading state */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white rounded-2xl z-5">
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-4 border-gold-premium border-t-transparent rounded-full animate-spin" />
              <p className="text-gray-600 text-sm">Loading checkout...</p>
            </div>
          </div>
        )}

        {/* Checkout container */}
        <div
          ref={containerRef}
          className="p-4 min-h-[400px]"
        />
      </div>
    </div>
  )
}
