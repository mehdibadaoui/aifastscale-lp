'use client'

import { useEffect, useState } from 'react'
import { X, Shield, Lock, CreditCard } from 'lucide-react'

interface CheckoutModalProps {
  isOpen: boolean
  onClose: () => void
  planId: string
  planName: string
  price: string
}

export default function CheckoutModal({ isOpen, onClose, planId, planName, price }: CheckoutModalProps) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (isOpen) {
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden'
      setIsLoading(true)

      // Load Whop checkout script
      const existingScript = document.querySelector('script[src*="whop.com/static/checkout"]')
      if (!existingScript) {
        const script = document.createElement('script')
        script.src = 'https://js.whop.com/static/checkout/loader.js'
        script.async = true
        script.defer = true
        document.body.appendChild(script)
      }

      // Give iframe time to load
      const timer = setTimeout(() => setIsLoading(false), 1500)
      return () => clearTimeout(timer)
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      window.addEventListener('keydown', handleEscape)
      return () => window.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-lg mx-4 animate-scale-in">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 sm:-top-4 sm:-right-4 z-10 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all group"
          aria-label="Close checkout"
        >
          <X className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
        </button>

        {/* Modal Content */}
        <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-luxury-gold/20 to-luxury-gold/10 border-b border-luxury-gold/20 p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white font-black text-lg sm:text-xl">{planName}</h3>
                <p className="text-white/60 text-sm">Secure checkout</p>
              </div>
              <div className="text-right">
                <div className="text-2xl sm:text-3xl font-black text-luxury-gold">{price}</div>
                <p className="text-white/40 text-xs">One-time payment</p>
              </div>
            </div>
          </div>

          {/* Whop Checkout Embed */}
          <div className="relative min-h-[450px] sm:min-h-[500px]">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-[#1a1a1a]">
                <div className="text-center">
                  <div className="w-10 h-10 border-3 border-luxury-gold/30 border-t-luxury-gold rounded-full animate-spin mx-auto mb-3"></div>
                  <p className="text-white/60 text-sm">Loading secure checkout...</p>
                </div>
              </div>
            )}
            <div
              data-whop-checkout-plan-id={planId}
              data-whop-checkout-theme="dark"
              className="w-full h-full min-h-[450px] sm:min-h-[500px]"
            />
          </div>

          {/* Footer - Trust Badges */}
          <div className="bg-black/40 border-t border-white/5 p-3 sm:p-4">
            <div className="flex items-center justify-center gap-4 sm:gap-6 text-white/50 text-[10px] sm:text-xs">
              <div className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                <span>256-bit SSL</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span>PCI Compliant</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
                <span>Apple Pay & Google Pay</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}
