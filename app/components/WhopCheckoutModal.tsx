'use client'

import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'

interface WhopCheckoutModalProps {
  planId: string
  isOpen: boolean
  onClose: () => void
  onComplete?: () => void
}

export default function WhopCheckoutModal({
  planId,
  isOpen,
  onClose,
  onComplete,
}: WhopCheckoutModalProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const scriptLoadedRef = useRef(false)

  useEffect(() => {
    if (!isOpen) return

    // Load Whop script if not already loaded
    if (!scriptLoadedRef.current && !document.querySelector('script[src*="whop.com/static/checkout/loader.js"]')) {
      const script = document.createElement('script')
      script.src = 'https://js.whop.com/static/checkout/loader.js'
      script.async = true
      script.defer = true

      script.onload = () => {
        console.log('✅ Whop checkout script loaded')
        scriptLoadedRef.current = true
      }

      script.onerror = () => {
        console.error('❌ Failed to load Whop checkout script')
      }

      document.head.appendChild(script)
    }

    // Cleanup function
    return () => {
      // Don't remove script as it might be needed for subsequent checkouts
    }
  }, [isOpen])

  // Handle checkout completion event
  useEffect(() => {
    if (!isOpen) return

    const handleCheckoutComplete = (event: Event) => {
      console.log('✅ Whop checkout completed!', event)
      if (onComplete) {
        onComplete()
      }
    }

    // Listen for custom Whop completion event
    window.addEventListener('whop-checkout-complete', handleCheckoutComplete)

    return () => {
      window.removeEventListener('whop-checkout-complete', handleCheckoutComplete)
    }
  }, [isOpen, onComplete])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all duration-200 hover:scale-110"
          aria-label="Close checkout"
        >
          <X className="w-5 h-5 text-gray-700" />
        </button>

        {/* Checkout container */}
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          <div
            ref={containerRef}
            data-whop-checkout-plan-id={planId}
            data-whop-checkout-theme="light"
            data-whop-checkout-skip-redirect="true"
          />
        </div>
      </div>
    </div>
  )
}
