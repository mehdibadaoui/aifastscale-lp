'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { WHOP_CONFIG } from '../config/whop'

interface WhopEmbeddedCheckoutProps {
  isOpen: boolean
  onClose: () => void
  planId?: string
}

// Track if Whop script is already loaded globally
let whopScriptLoaded = false
let whopScriptLoading = false

export default function WhopEmbeddedCheckout({
  isOpen,
  onClose,
  planId = WHOP_CONFIG.plans.mainCourse.id,
}: WhopEmbeddedCheckoutProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const scrollYRef = useRef(0)
  const [isLoading, setIsLoading] = useState(true)

  // Lazy load Whop script only when checkout opens
  const loadWhopScript = useCallback(() => {
    return new Promise<void>((resolve) => {
      // Already loaded
      if (whopScriptLoaded && (window as any).WhopCheckout) {
        resolve()
        return
      }

      // Currently loading, wait for it
      if (whopScriptLoading) {
        const checkReady = () => {
          if ((window as any).WhopCheckout) {
            resolve()
          } else {
            setTimeout(checkReady, 50)
          }
        }
        checkReady()
        return
      }

      // Start loading
      whopScriptLoading = true
      const script = document.createElement('script')
      script.src = 'https://js.whop.com/static/checkout/loader.js'
      script.async = true
      script.onload = () => {
        whopScriptLoaded = true
        whopScriptLoading = false
        resolve()
      }
      script.onerror = () => {
        whopScriptLoading = false
        resolve() // Resolve anyway to not block UI
      }
      document.head.appendChild(script)
    })
  }, [])

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

      // Load script lazily then initialize
      loadWhopScript().then(() => {
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
        initCheckout()
      })

      // Fallback: hide loading after 4s regardless
      const fallbackTimer = setTimeout(() => setIsLoading(false), 4000)
      return () => clearTimeout(fallbackTimer)
    }
  }, [isOpen, planId, loadWhopScript])

  // Handle escape key and body scroll lock
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    if (isOpen) {
      // Save scroll position before locking
      scrollYRef.current = window.scrollY

      document.addEventListener('keydown', handleEscape)

      // Lock body scroll - iOS fix using position:fixed
      document.body.style.position = 'fixed'
      document.body.style.top = `-${scrollYRef.current}px`
      document.body.style.left = '0'
      document.body.style.right = '0'
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)

      // Only restore if we were open
      if (document.body.style.position === 'fixed') {
        // Restore body styles
        document.body.style.position = ''
        document.body.style.top = ''
        document.body.style.left = ''
        document.body.style.right = ''
        document.body.style.overflow = ''

        // Restore scroll position
        window.scrollTo(0, scrollYRef.current)
      }
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
