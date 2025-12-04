'use client'

import { X } from 'lucide-react'
import { Suspense, lazy, useEffect, useState } from 'react'

// PERFORMANCE: Lazy load Whop checkout - only loads when modal opens (saves ~50-100KB on initial load)
const WhopCheckoutEmbed = lazy(() =>
  import('@whop/checkout/react').then((mod) => ({ default: mod.WhopCheckoutEmbed }))
)

interface WhopCheckoutModalProps {
  planId: string
  isOpen: boolean
  onClose: () => void
  onComplete?: () => void
  onPrefetch?: () => void
}

export default function WhopCheckoutModal({
  planId,
  isOpen,
  onClose,
  onComplete,
  onPrefetch,
}: WhopCheckoutModalProps) {
  const [isPrefetched, setIsPrefetched] = useState(false)

  // Prefetch Whop checkout when modal might open (hover, intersection)
  useEffect(() => {
    if (onPrefetch && !isPrefetched) {
      onPrefetch()
      setIsPrefetched(true)
    }
  }, [onPrefetch, isPrefetched])

  if (!isOpen) return null

  // Handle checkout completion
  const handleComplete = (planId: string, receiptId?: string) => {
    console.log('✅ Checkout completed!', { planId, receiptId })
    if (onComplete) {
      onComplete()
    }
  }

  // Skeleton loader component
  const SkeletonLoader = () => (
    <div className="p-8 space-y-6 animate-pulse">
      {/* Email field skeleton */}
      <div className="space-y-2">
        <div className="h-4 w-16 bg-gray-200 rounded"></div>
        <div className="h-12 bg-gray-200 rounded-lg"></div>
      </div>

      {/* Card field skeleton */}
      <div className="space-y-2">
        <div className="h-4 w-24 bg-gray-200 rounded"></div>
        <div className="h-12 bg-gray-200 rounded-lg"></div>
      </div>

      {/* Expiry and CVV skeleton */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="h-4 w-24 bg-gray-200 rounded"></div>
          <div className="h-12 bg-gray-200 rounded-lg"></div>
        </div>
        <div className="space-y-2">
          <div className="h-4 w-20 bg-gray-200 rounded"></div>
          <div className="h-12 bg-gray-200 rounded-lg"></div>
        </div>
      </div>

      {/* Name field skeleton */}
      <div className="space-y-2">
        <div className="h-4 w-16 bg-gray-200 rounded"></div>
        <div className="h-12 bg-gray-200 rounded-lg"></div>
      </div>

      {/* Country field skeleton */}
      <div className="space-y-2">
        <div className="h-4 w-20 bg-gray-200 rounded"></div>
        <div className="h-12 bg-gray-200 rounded-lg"></div>
      </div>

      {/* Address field skeleton */}
      <div className="space-y-2">
        <div className="h-4 w-28 bg-gray-200 rounded"></div>
        <div className="h-12 bg-gray-200 rounded-lg"></div>
      </div>

      {/* Loading text */}
      <div className="flex items-center justify-center gap-2 text-gray-500 mt-8">
        <svg className="animate-spin h-5 w-5 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span className="text-sm font-medium">Loading secure checkout...</span>
      </div>
    </div>
  )

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all duration-200 hover:scale-110"
          aria-label="Close checkout"
        >
          <X className="w-5 h-5 text-gray-700" />
        </button>

        {/* Whop Official Embedded Checkout - Stays on your site! */}
        <div className="w-full h-[80vh] overflow-auto">
          <Suspense fallback={<SkeletonLoader />}>
            <WhopCheckoutEmbed
              planId={planId}
              skipRedirect={true}
              onComplete={handleComplete}
              theme="light"
            />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
