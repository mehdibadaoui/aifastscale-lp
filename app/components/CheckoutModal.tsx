'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
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
  const [mounted, setMounted] = useState(false)

  // Ensure we're mounted on client
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (isOpen) {
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden'
      document.body.style.position = 'fixed'
      document.body.style.width = '100%'
      document.body.style.top = `-${window.scrollY}px`
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
      // Restore scroll position
      const scrollY = document.body.style.top
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.width = ''
      document.body.style.top = ''
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0', 10) * -1)
      }
    }

    return () => {
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.width = ''
      document.body.style.top = ''
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

  if (!isOpen || !mounted) return null

  const modalContent = (
    <div
      className="checkout-modal-overlay"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 999999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        backdropFilter: 'blur(8px)',
      }}
      onClick={onClose}
    >
      {/* Modal Container - Centered */}
      <div
        className="checkout-modal-content"
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '480px',
          maxHeight: '90vh',
          overflowY: 'auto',
          borderRadius: '16px',
          backgroundColor: '#0d0d0d',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            zIndex: 10,
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background-color 0.2s',
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
          aria-label="Close checkout"
        >
          <X className="w-5 h-5 text-white" />
        </button>

        {/* Header */}
        <div style={{
          background: 'linear-gradient(to right, rgba(212, 175, 55, 0.2), rgba(212, 175, 55, 0.1))',
          borderBottom: '1px solid rgba(212, 175, 55, 0.2)',
          padding: '16px 20px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ color: 'white', fontWeight: 900, fontSize: '18px', margin: 0 }}>{planName}</h3>
              <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '14px', margin: '4px 0 0 0' }}>Secure checkout</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '28px', fontWeight: 900, color: '#D4AF37' }}>{price}</div>
              <p style={{ color: 'rgba(255, 255, 255, 0.4)', fontSize: '12px', margin: 0 }}>One-time payment</p>
            </div>
          </div>
        </div>

        {/* Whop Checkout Embed */}
        <div style={{ position: 'relative', minHeight: '450px' }}>
          {isLoading && (
            <div style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#1a1a1a',
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  border: '3px solid rgba(212, 175, 55, 0.3)',
                  borderTopColor: '#D4AF37',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  margin: '0 auto 12px',
                }} />
                <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '14px', margin: 0 }}>Loading secure checkout...</p>
              </div>
            </div>
          )}
          <div
            data-whop-checkout-plan-id={planId}
            data-whop-checkout-theme="dark"
            style={{ width: '100%', minHeight: '450px' }}
          />
        </div>

        {/* Footer - Trust Badges */}
        <div style={{
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          padding: '12px 16px',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '20px',
            color: 'rgba(255, 255, 255, 0.5)',
            fontSize: '11px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Lock className="w-3.5 h-3.5" style={{ color: '#10b981' }} />
              <span>256-bit SSL</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Shield className="w-3.5 h-3.5" style={{ color: '#10b981' }} />
              <span>PCI Compliant</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CreditCard className="w-3.5 h-3.5" style={{ color: '#10b981' }} />
              <span>Apple/Google Pay</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )

  // Use portal to render at document.body level
  return createPortal(modalContent, document.body)
}
