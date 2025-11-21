'use client'

import { X } from 'lucide-react'
import dynamic from 'next/dynamic'

// Dynamically import Whop checkout to avoid SSR issues
const WhopCheckoutEmbed = dynamic(
  () => import('@whop/checkout/react').then((mod) => mod.WhopCheckoutEmbed),
  { ssr: false }
)

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
  if (!isOpen) return null

  const handleComplete = () => {
    console.log('✅ Whop checkout completed!')
    if (onComplete) {
      onComplete()
    }
  }

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
          <WhopCheckoutEmbed
            planId={planId}
            theme="light"
            skipRedirect={true}
            onComplete={handleComplete}
          />
        </div>
      </div>
    </div>
  )
}
