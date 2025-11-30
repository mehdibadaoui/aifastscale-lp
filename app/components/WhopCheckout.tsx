'use client'

import { WhopCheckoutEmbed } from '@whop/checkout/react'
import { WHOP_CONFIG, PlanType } from '../config/whop'
import { Loader2 } from 'lucide-react'

interface WhopCheckoutProps {
  planType: PlanType
  onComplete?: (planId: string, receiptId: string) => void
  className?: string
}

export default function WhopCheckout({ planType, onComplete, className }: WhopCheckoutProps) {
  const plan = WHOP_CONFIG.plans[planType]

  return (
    <div className={className}>
      <WhopCheckoutEmbed
        planId={plan.id}
        theme={WHOP_CONFIG.theme.mode}
        onComplete={onComplete}
        fallback={
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-luxury-gold" />
            <span className="ml-3 text-gray-400">Loading secure checkout...</span>
          </div>
        }
      />
    </div>
  )
}
