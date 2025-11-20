'use client'

import { useState } from 'react'
import BonusProductSelector from '../components/BonusProductSelector'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function BonusSelectorDemo() {
  const [checkoutData, setCheckoutData] = useState<{
    products: string[]
    isBundle: boolean
    total: number
  } | null>(null)

  const handleProceedToCheckout = (selectedProducts: string[], isBundleDeal: boolean) => {
    const total = isBundleDeal ? 9.90 : selectedProducts.length * 1.99
    setCheckoutData({
      products: selectedProducts,
      isBundle: isBundleDeal,
      total,
    })

    // In production, this would redirect to actual Whop checkout
    console.log('Proceeding to checkout with:', {
      selectedProducts,
      isBundleDeal,
      total,
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-cream-luxury to-gold-light/20">
      {/* Header */}
      <div className="bg-navy-deep text-white py-4 px-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:text-gold-premium transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </Link>
          <div className="text-sm opacity-75">DEMO MODE - Bonus Product Selector</div>
        </div>
      </div>

      {/* Main Purchase Summary */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border-2 border-emerald-500">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500 mb-1">Your Purchase</div>
              <h1 className="text-2xl font-bold mb-2">AgentClone™ - Complete Video Course + Done-For-You Setup</h1>
              <p className="text-gray-600">The 7-Minute AI That Builds Your Real Estate Empire</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500 mb-1">Price</div>
              <div className="text-3xl font-bold text-emerald-500">$37</div>
              <div className="text-xs text-gray-500 mt-1">One-time payment</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bonus Product Selector */}
      <BonusProductSelector onProceedToCheckout={handleProceedToCheckout} />

      {/* Debug Panel (only in demo) */}
      {checkoutData && (
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="bg-navy-deep text-white rounded-xl p-6">
            <h3 className="text-xl font-bold mb-4">Checkout Data (Demo)</h3>
            <div className="space-y-2 font-mono text-sm">
              <div>Selected Products: {checkoutData.products.length}</div>
              <div>Is Bundle Deal: {checkoutData.isBundle ? 'Yes' : 'No'}</div>
              <div>Bonus Total: ${checkoutData.total.toFixed(2)}</div>
              <div>Grand Total: ${(37 + checkoutData.total).toFixed(2)}</div>
              <div className="mt-4 pt-4 border-t border-white/20">
                <div>Selected Product IDs:</div>
                <div className="text-xs opacity-75 mt-2">
                  {checkoutData.products.join(', ') || 'None'}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Strategy Explanation */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-gold-premium">
          <h3 className="text-2xl font-bold mb-6 text-center">
            Why This Pricing Strategy <span className="text-emerald-500">Makes More Money</span> 💰
          </h3>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Psychology Points */}
            <div className="space-y-4">
              <h4 className="font-bold text-lg flex items-center gap-2">
                <span className="text-2xl">🧠</span> Psychology Behind It:
              </h4>
              <ul className="space-y-3 text-sm">
                <li className="flex gap-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span><strong>Bundle Anchoring:</strong> $19.90 vs $9.90 creates instant perceived value</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span><strong>FOMO:</strong> "One-time offer" creates urgency to grab bundle</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span><strong>Simplicity:</strong> One decision (bundle) vs 10 decisions (which products)</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span><strong>Completion:</strong> "Complete Collection" satisfies completionist psychology</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span><strong>No Regret:</strong> They won't wonder "what if I needed that product?"</span>
                </li>
              </ul>
            </div>

            {/* Revenue Projections */}
            <div className="space-y-4">
              <h4 className="font-bold text-lg flex items-center gap-2">
                <span className="text-2xl">📊</span> Expected Results:
              </h4>
              <div className="bg-emerald-50 rounded-lg p-4 border-2 border-emerald-200">
                <div className="text-sm text-gray-600 mb-2">Bundle Conversion Rate (Expected):</div>
                <div className="text-3xl font-bold text-emerald-500 mb-1">30-35%</div>
                <div className="text-xs text-gray-500">vs 15-20% for individual add-ons</div>
              </div>
              <div className="bg-gold-light/20 rounded-lg p-4 border-2 border-gold-premium">
                <div className="text-sm text-gray-600 mb-2">Average Order Value:</div>
                <div className="text-3xl font-bold text-gold-dark mb-1">$40-42</div>
                <div className="text-xs text-gray-500">$37 base + $3-5 average upsell</div>
              </div>
              <div className="text-sm space-y-1 text-gray-600">
                <div>• 100 customers = ~$4,000-4,200</div>
                <div>• 30-35 bundle purchases @ $9.90</div>
                <div>• 10-15 individual purchases @ $1.99-7.96</div>
              </div>
            </div>
          </div>

          {/* Alex Hormozi Framework */}
          <div className="mt-6 pt-6 border-t-2 border-gray-200">
            <h4 className="font-bold text-lg mb-3 flex items-center gap-2">
              <span className="text-2xl">💎</span> Alex Hormozi's Value Equation Applied:
            </h4>
            <div className="grid md:grid-cols-4 gap-4 text-sm">
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="font-bold text-emerald-500 mb-1">Dream Outcome</div>
                <div className="text-xs text-gray-600">Complete transformation toolkit = maximum results</div>
              </div>
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="font-bold text-emerald-500 mb-1">Perceived Likelihood</div>
                <div className="text-xs text-gray-600">All 10 bonuses = nothing missing, guaranteed success</div>
              </div>
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="font-bold text-emerald-500 mb-1">Time Delay</div>
                <div className="text-xs text-gray-600">Instant access to everything = zero waiting</div>
              </div>
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="font-bold text-emerald-500 mb-1">Effort & Sacrifice</div>
                <div className="text-xs text-gray-600">$10 for $3,671 value = minimal sacrifice, obvious choice</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
