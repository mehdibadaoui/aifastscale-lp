'use client'

import { useEffect, useState, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { X, Shield, Lock, CreditCard, Loader2 } from 'lucide-react'

interface CheckoutModalProps {
  isOpen: boolean
  onClose: () => void
  onDecline?: () => void
  planId: string
  planName: string
  price: string
  declineText?: string
}

/**
 * CheckoutModal Component
 *
 * This is a clean shell ready for payment integration.
 * Add your payment provider's checkout embed component here.
 *
 * Example integrations:
 * - Stripe Elements
 * - Paddle
 * - LemonSqueezy
 * - PayPal
 * - etc.
 */
export default function CheckoutModal({
  isOpen,
  onClose,
  onDecline,
  planId,
  planName,
  price,
  declineText,
}: CheckoutModalProps) {
  const [mounted, setMounted] = useState(false)

  // Ensure we're mounted on client
  useEffect(() => {
    setMounted(true)
  }, [])

  // Lock body scroll when modal is open
  useEffect(() => {
    if (!isOpen) return

    const scrollY = window.scrollY
    document.body.style.position = 'fixed'
    document.body.style.top = `-${scrollY}px`
    document.body.style.width = '100%'
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.width = ''
      document.body.style.overflow = ''
      window.scrollTo(0, scrollY)
    }
  }, [isOpen])

  // Handle escape key
  useEffect(() => {
    if (!isOpen) return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  // Handle click outside
  const handleOverlayClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        onClose()
      }
    },
    [onClose]
  )

  if (!mounted || !isOpen) return null

  const modalContent = (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={handleOverlayClick}
    >
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 px-6 py-4 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
          <h2 className="text-xl font-bold">{planName}</h2>
          <p className="text-emerald-100 text-sm">Complete your order</p>
        </div>

        {/* Content Area - Add your payment integration here */}
        <div className="p-6">
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-500 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">Payment integration needed</p>
            <p className="text-sm text-gray-400">
              Plan ID: {planId}
              <br />
              Price: {price}
            </p>

            {/* TODO: Add your payment provider's checkout component here */}
            {/*
            Examples:
            - <StripeElements planId={planId} />
            - <PaddleCheckout planId={planId} />
            - <LemonSqueezyCheckout planId={planId} />
            */}
          </div>

          {/* Trust Badges */}
          <div className="flex items-center justify-center gap-4 text-xs text-gray-500 border-t pt-4">
            <div className="flex items-center gap-1">
              <Shield className="w-4 h-4" />
              <span>30-Day Guarantee</span>
            </div>
            <div className="flex items-center gap-1">
              <Lock className="w-4 h-4" />
              <span>SSL Secured</span>
            </div>
            <div className="flex items-center gap-1">
              <CreditCard className="w-4 h-4" />
              <span>Secure Payment</span>
            </div>
          </div>

          {/* Decline Option */}
          {onDecline && declineText && (
            <button
              onClick={onDecline}
              className="w-full mt-4 text-sm text-gray-400 hover:text-gray-600 transition-colors"
            >
              {declineText}
            </button>
          )}
        </div>
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}
