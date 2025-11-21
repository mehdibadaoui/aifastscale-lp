'use client'

import { X } from 'lucide-react'
import { WhopCheckoutEmbed } from '@whop/checkout/react'

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

  // Handle checkout completion
  const handleComplete = (planId: string, receiptId?: string) => {
    console.log('✅ Checkout completed!', { planId, receiptId })
    if (onComplete) {
      onComplete()
    }
  }

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
          <WhopCheckoutEmbed
            planId={planId}
            skipRedirect={true}
            onComplete={handleComplete}
            theme="light"
            fallback={
              <div className="flex items-center justify-center h-full">
                <div className="text-gray-600">Loading checkout...</div>
              </div>
            }
          />
        </div>
      </div>
    </div>
  )
}
