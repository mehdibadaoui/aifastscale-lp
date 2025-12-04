'use client'

import { useEffect, useState, useCallback, Suspense, lazy } from 'react'
import { createPortal } from 'react-dom'
import { X, Shield, Lock, CreditCard, Loader2 } from 'lucide-react'

// PERFORMANCE: Lazy load Whop checkout - only loads when modal is open (saves ~50-100KB)
const WhopCheckoutEmbed = lazy(() =>
  import('@whop/checkout/react').then((mod) => ({ default: mod.WhopCheckoutEmbed }))
)

interface CheckoutModalProps {
  isOpen: boolean
  onClose: () => void
  onDecline?: () => void
  planId: string
  planName: string
  price: string
  declineText?: string
}

export default function CheckoutModal({ isOpen, onClose, onDecline, planId, planName, price, declineText }: CheckoutModalProps) {
  const [mounted, setMounted] = useState(false)
  const [checkoutReady, setCheckoutReady] = useState(false)

  // Ensure we're mounted on client
  useEffect(() => {
    setMounted(true)
  }, [])

  // Preload checkout when modal opens - show after brief delay for smoother UX
  useEffect(() => {
    if (isOpen) {
      setCheckoutReady(false)
      // Short delay to allow embed to initialize
      const timer = setTimeout(() => setCheckoutReady(true), 800)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  // Lock body scroll completely when modal is open
  useEffect(() => {
    if (!isOpen) return

    // Save current scroll position and lock body
    const scrollY = window.scrollY
    const scrollX = window.scrollX

    // Apply scroll lock styles
    document.body.style.position = 'fixed'
    document.body.style.top = `-${scrollY}px`
    document.body.style.left = `-${scrollX}px`
    document.body.style.right = '0'
    document.body.style.width = '100%'
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'

    // Prevent touchmove on body (for iOS)
    const preventTouchMove = (e: TouchEvent) => {
      // Allow scrolling inside the modal content
      const target = e.target as HTMLElement
      if (target.closest('.checkout-scroll-container')) {
        return
      }
      e.preventDefault()
    }

    document.body.addEventListener('touchmove', preventTouchMove, { passive: false })

    return () => {
      // Restore scroll position
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.left = ''
      document.body.style.right = ''
      document.body.style.width = ''
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
      window.scrollTo(scrollX, scrollY)

      document.body.removeEventListener('touchmove', preventTouchMove)
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
  const handleOverlayClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }, [onClose])

  if (!isOpen || !mounted) return null

  const modalContent = (
    <div
      className="checkout-modal-overlay"
      onClick={handleOverlayClick}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: '100%',
        zIndex: 999999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '8px',
        backgroundColor: 'rgba(0, 0, 0, 0.95)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        touchAction: 'none',
      }}
    >
      {/* Modal Container */}
      <div
        className="checkout-modal-content"
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '440px',
          height: '90vh',
          maxHeight: '700px',
          borderRadius: '16px',
          backgroundColor: '#0d0d0d',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            zIndex: 100,
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          aria-label="Close checkout"
        >
          <X className="w-4 h-4 text-white" />
        </button>

        {/* Header - Compact */}
        <div style={{
          background: 'linear-gradient(to right, rgba(212, 175, 55, 0.15), rgba(212, 175, 55, 0.05))',
          borderBottom: '1px solid rgba(212, 175, 55, 0.2)',
          padding: '12px 16px',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ color: 'white', fontWeight: 800, fontSize: '14px', margin: 0 }}>{planName}</h3>
              <p style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '11px', margin: '2px 0 0 0' }}>Secure checkout</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '20px', fontWeight: 900, color: '#D4AF37' }}>{price}</div>
              <p style={{ color: 'rgba(255, 255, 255, 0.4)', fontSize: '10px', margin: 0 }}>One-time</p>
            </div>
          </div>
        </div>

        {/* Checkout Container - Scrollable */}
        <div
          className="checkout-scroll-container"
          style={{
            flex: 1,
            overflow: 'auto',
            WebkitOverflowScrolling: 'touch',
            overscrollBehavior: 'contain',
            position: 'relative',
            touchAction: 'pan-y',
          }}
        >
          {/* Loading State */}
          {!checkoutReady && (
            <div style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#0a0a0a',
              zIndex: 10,
            }}>
              <div style={{ textAlign: 'center' }}>
                <Loader2
                  className="animate-spin"
                  style={{
                    width: '32px',
                    height: '32px',
                    color: '#D4AF37',
                    margin: '0 auto 8px',
                  }}
                />
                <p style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '12px', margin: 0 }}>
                  Loading checkout...
                </p>
              </div>
            </div>
          )}

          {/* Whop Checkout Embed - Lazy loaded */}
          <div style={{
            width: '100%',
            minHeight: '100%',
            opacity: checkoutReady ? 1 : 0,
            transition: 'opacity 0.2s ease',
          }}>
            <Suspense fallback={null}>
              <WhopCheckoutEmbed planId={planId} hideAddressForm={true} />
            </Suspense>
          </div>
        </div>

        {/* Footer - Trust Badges + No Thanks */}
        <div style={{
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          padding: '8px 12px',
          flexShrink: 0,
        }}>
          {/* 30-Day Guarantee Reminder */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            marginBottom: '8px',
            padding: '6px 10px',
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(16, 185, 129, 0.05))',
            borderRadius: '8px',
            border: '1px solid rgba(16, 185, 129, 0.3)',
          }}>
            <Shield className="w-3.5 h-3.5" style={{ color: '#10b981' }} />
            <span style={{ color: '#10b981', fontSize: '11px', fontWeight: 700 }}>
              30-Day Money-Back Guarantee
            </span>
          </div>
          {/* No Thanks Button - Only show if onDecline is provided */}
          {onDecline && (
            <button
              onClick={onDecline}
              style={{
                width: '100%',
                background: 'none',
                border: 'none',
                color: 'rgba(255, 255, 255, 0.4)',
                fontSize: '12px',
                fontWeight: 500,
                padding: '8px',
                marginBottom: '6px',
                cursor: 'pointer',
                transition: 'color 0.2s',
              }}
              onMouseOver={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)'}
              onMouseOut={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.4)'}
            >
              {declineText || 'No thanks, skip this offer →'}
            </button>
          )}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            color: 'rgba(255, 255, 255, 0.4)',
            fontSize: '9px',
            flexWrap: 'wrap',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
              <Lock className="w-2.5 h-2.5" style={{ color: '#10b981' }} />
              <span>SSL</span>
            </div>
            <span style={{ color: 'rgba(255,255,255,0.2)' }}>•</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
              <CreditCard className="w-2.5 h-2.5" style={{ color: '#10b981' }} />
              <span>Apple Pay</span>
            </div>
            <span style={{ color: 'rgba(255,255,255,0.2)' }}>•</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
              <CreditCard className="w-2.5 h-2.5" style={{ color: '#10b981' }} />
              <span>Google Pay</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}
