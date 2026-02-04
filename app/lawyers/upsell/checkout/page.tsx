'use client'

import { WhopCheckoutEmbed } from '@whop/checkout/react'
import { Loader2 } from 'lucide-react'

export default function LawyerUpsellCheckout() {
  return (
    <main className="min-h-screen bg-white">
      <WhopCheckoutEmbed
        planId="plan_97EdLFRTEConC"
        returnUrl="https://aifastscale.com/lawyers/thank-you"
        hideAddressForm
        theme="system"
        fallback={
          <div className="flex flex-col items-center justify-center min-h-screen">
            <Loader2 className="w-8 h-8 text-gray-400 animate-spin mb-3" />
            <p className="text-gray-500 text-sm">Loading checkout...</p>
          </div>
        }
      />
    </main>
  )
}
