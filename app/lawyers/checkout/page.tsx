'use client'

import { useEffect } from 'react'
import { Loader2, Lock } from 'lucide-react'

// Whop checkout URL - redirects to UPSELL after main purchase
const WHOP_CHECKOUT_URL = 'https://whop.com/checkout/plan_GpUjd1q7kN6pj?d=https://aifastscale.com/lawyers/upsell'

// Track InitiateCheckout before redirect
const trackInitiateCheckout = () => {
  if (typeof window === 'undefined') return

  if ((window as any).fbq) {
    (window as any).fbq('track', 'InitiateCheckout', {
      content_name: 'CloneYourself for Lawyers',
      content_type: 'product',
      value: 47.82,
      currency: 'USD',
    })
  }
}

export default function LawyerCheckout() {
  useEffect(() => {
    // Track the checkout initiation
    trackInitiateCheckout()

    // Redirect to Whop checkout after a brief delay for tracking
    const timer = setTimeout(() => {
      window.location.href = WHOP_CHECKOUT_URL
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <main className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 text-gray-400 mb-6">
          <Lock className="w-5 h-5 text-green-500" />
          <span>Secure Checkout</span>
        </div>

        <Loader2 className="w-12 h-12 text-amber-500 animate-spin mx-auto mb-4" />

        <h1 className="text-white text-xl font-bold mb-2">
          Redirecting to Secure Checkout...
        </h1>
        <p className="text-gray-400 text-sm">
          Please wait while we redirect you to complete your purchase.
        </p>

        <p className="text-gray-600 text-xs mt-8">
          If you're not redirected automatically,{' '}
          <a href={WHOP_CHECKOUT_URL} className="text-amber-500 hover:underline">
            click here
          </a>
        </p>
      </div>
    </main>
  )
}
