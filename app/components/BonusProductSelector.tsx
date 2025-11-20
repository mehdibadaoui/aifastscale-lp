'use client'

import { useState, useEffect } from 'react'
import { Check, Sparkles, TrendingUp, Zap, Gift } from 'lucide-react'
import { BONUS_PRODUCTS, BONUS_PRICING, getBundleSavings } from '../config/bonus-products'

interface BonusProductSelectorProps {
  onProceedToCheckout: (selectedProducts: string[], isBundleDeal: boolean) => void
}

export default function BonusProductSelector({ onProceedToCheckout }: BonusProductSelectorProps) {
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [bundleMode, setBundleMode] = useState(false)
  const [showSavings, setShowSavings] = useState(false)

  const individualTotal = selectedProducts.length * BONUS_PRICING.individualPrice
  const bundleTotal = BONUS_PRICING.bundlePrice
  const bundleSavings = getBundleSavings()
  const currentSavings = bundleMode ? bundleSavings : 0

  // Auto-suggest bundle when 5+ products selected
  useEffect(() => {
    if (selectedProducts.length >= 5 && !bundleMode) {
      setShowSavings(true)
    }
  }, [selectedProducts.length, bundleMode])

  const toggleProduct = (productId: string) => {
    if (bundleMode) return // Can't toggle in bundle mode

    setSelectedProducts(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }

  const activateBundleDeal = () => {
    setBundleMode(true)
    setSelectedProducts(BONUS_PRODUCTS.map(p => p.id))
    setShowSavings(false)
  }

  const deactivateBundleDeal = () => {
    setBundleMode(false)
    setSelectedProducts([])
  }

  const handleProceedToCheckout = () => {
    onProceedToCheckout(selectedProducts, bundleMode)
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-block bg-gradient-to-r from-gold-premium to-gold-dark text-white px-4 py-2 rounded-full text-sm font-bold mb-4">
          <Sparkles className="w-4 h-4 inline mr-2" />
          ONE-TIME EXCLUSIVE OFFER
        </div>
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Complete Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-premium to-gold-dark">Transformation Toolkit</span>
        </h2>
        <p className="text-lg text-gray-600">
          Add these proven bonuses to accelerate your success
        </p>
      </div>

      {/* Bundle Deal Hero Card - Positioned at Top */}
      {!bundleMode && (
        <div className="mb-8 relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 via-green-success to-gold-premium rounded-2xl blur opacity-75 animate-pulse"></div>
          <div className="relative bg-white rounded-2xl p-6 md:p-8 border-2 border-emerald-500 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Gift className="w-6 h-6 text-emerald-500" />
                  <span className="bg-red-electric text-white px-3 py-1 rounded-full text-xs font-bold uppercase">
                    BEST VALUE - SAVE 50%
                  </span>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold mb-2">
                  🎁 Complete Collection Bundle
                </h3>
                <p className="text-gray-600 mb-4">
                  Get ALL 10 Bonuses for just <span className="font-bold text-emerald-500">$9.90</span> instead of $19.90
                </p>
                <div className="flex flex-wrap items-center gap-4 mb-4">
                  <div className="text-3xl font-bold text-emerald-500">
                    ${BONUS_PRICING.bundlePrice}
                  </div>
                  <div className="text-xl text-gray-400 line-through">
                    ${BONUS_PRODUCTS.length * BONUS_PRICING.individualPrice}
                  </div>
                  <div className="bg-emerald-500 text-white px-3 py-1 rounded-lg font-bold">
                    SAVE ${bundleSavings.toFixed(2)}
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-sm">
                  {BONUS_PRODUCTS.map((product, idx) => (
                    <div key={product.id} className="flex items-center gap-1 text-gray-600">
                      <Check className="w-4 h-4 text-emerald-500" />
                      <span className="truncate">{product.icon} {product.title.split(' ')[0]}</span>
                    </div>
                  ))}
                </div>
              </div>
              <button
                onClick={activateBundleDeal}
                className="bg-gradient-to-r from-emerald-500 to-green-success text-white px-8 py-4 rounded-xl font-bold text-lg hover:scale-105 transition-transform shadow-lg whitespace-nowrap"
              >
                Grab Bundle →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bundle Mode Active Banner */}
      {bundleMode && (
        <div className="mb-6 bg-gradient-to-r from-emerald-500 to-green-success text-white rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Check className="w-6 h-6" />
            <div>
              <div className="font-bold">Bundle Deal Activated!</div>
              <div className="text-sm opacity-90">You're getting all 10 bonuses for just $9.90</div>
            </div>
          </div>
          <button
            onClick={deactivateBundleDeal}
            className="bg-white text-emerald-500 px-4 py-2 rounded-lg font-bold hover:bg-gray-100 transition-colors text-sm"
          >
            Select Individual Instead
          </button>
        </div>
      )}

      {/* Savings Suggestion Banner */}
      {showSavings && !bundleMode && selectedProducts.length >= 5 && (
        <div className="mb-6 bg-gradient-to-r from-gold-premium/10 to-gold-dark/10 border-2 border-gold-premium rounded-xl p-4 flex items-center justify-between animate-pulse">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-6 h-6 text-gold-premium" />
            <div>
              <div className="font-bold text-gray-900">Wait! Get a Better Deal 💰</div>
              <div className="text-sm text-gray-600">
                You've selected {selectedProducts.length} products. Get ALL 10 for just ${(BONUS_PRICING.bundlePrice - individualTotal).toFixed(2)} more!
              </div>
            </div>
          </div>
          <button
            onClick={activateBundleDeal}
            className="bg-gradient-to-r from-gold-premium to-gold-dark text-white px-4 py-2 rounded-lg font-bold hover:scale-105 transition-transform text-sm whitespace-nowrap"
          >
            Upgrade to Bundle
          </button>
        </div>
      )}

      {/* Divider */}
      {!bundleMode && (
        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="text-gray-500 font-semibold">OR SELECT INDIVIDUAL BONUSES</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>
      )}

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {BONUS_PRODUCTS.map((product) => {
          const isSelected = selectedProducts.includes(product.id)

          return (
            <div
              key={product.id}
              onClick={() => toggleProduct(product.id)}
              className={`
                relative rounded-xl p-6 border-2 transition-all cursor-pointer
                ${bundleMode ? 'bg-emerald-50 border-emerald-500' : ''}
                ${isSelected && !bundleMode ? 'bg-gold-light/20 border-gold-premium shadow-lg scale-[1.02]' : ''}
                ${!isSelected && !bundleMode ? 'bg-white border-gray-200 hover:border-gold-premium hover:shadow-md' : ''}
              `}
            >
              {/* Checkbox */}
              <div className="absolute top-4 right-4">
                <div className={`
                  w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all
                  ${isSelected ? 'bg-emerald-500 border-emerald-500' : 'bg-white border-gray-300'}
                `}>
                  {isSelected && <Check className="w-4 h-4 text-white" />}
                </div>
              </div>

              {/* Product Info */}
              <div className="text-4xl mb-3">{product.icon}</div>
              <h3 className="font-bold text-lg mb-1">{product.title}</h3>
              <p className="text-sm text-emerald-600 font-semibold mb-2">{product.subtitle}</p>
              <p className="text-sm text-gray-600 mb-4">{product.description}</p>

              {/* Value & Price */}
              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-500">
                  Value: <span className="line-through">${product.value}</span>
                </div>
                {!bundleMode && (
                  <div className="text-lg font-bold text-emerald-500">
                    +${BONUS_PRICING.individualPrice}
                  </div>
                )}
                {bundleMode && (
                  <div className="text-sm font-bold text-emerald-500">
                    ✓ Included
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Bottom Sticky CTA */}
      <div className="sticky bottom-0 bg-white border-t-4 border-gold-premium shadow-2xl rounded-t-2xl p-6 -mx-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Pricing Info */}
            <div>
              <div className="text-sm text-gray-600 mb-1">
                {bundleMode ? 'Bundle Total:' : `${selectedProducts.length} Bonus${selectedProducts.length !== 1 ? 'es' : ''} Selected:`}
              </div>
              <div className="flex items-center gap-3">
                <div className="text-3xl font-bold text-navy-deep">
                  ${bundleMode ? bundleTotal.toFixed(2) : individualTotal.toFixed(2)}
                </div>
                {bundleMode && (
                  <div className="bg-emerald-500 text-white px-3 py-1 rounded-lg font-bold text-sm">
                    SAVE ${bundleSavings.toFixed(2)}
                  </div>
                )}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {bundleMode
                  ? `All 10 bonuses (normally $${(BONUS_PRODUCTS.length * BONUS_PRICING.individualPrice).toFixed(2)})`
                  : 'Select more to unlock bundle savings'}
              </div>
            </div>

            {/* CTA Button */}
            <button
              onClick={handleProceedToCheckout}
              disabled={selectedProducts.length === 0}
              className={`
                px-8 py-4 rounded-xl font-bold text-lg transition-all
                ${selectedProducts.length > 0
                  ? 'bg-gradient-to-r from-gold-premium to-gold-dark text-white hover:scale-105 shadow-lg'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }
              `}
            >
              {selectedProducts.length > 0 ? (
                <>
                  <Zap className="w-5 h-5 inline mr-2" />
                  Add to Order & Continue →
                </>
              ) : (
                'Select Bonuses to Continue'
              )}
            </button>
          </div>

          {/* No Thanks Option */}
          <div className="text-center mt-4">
            <button
              onClick={() => onProceedToCheckout([], false)}
              className="text-sm text-gray-500 hover:text-gray-700 underline"
            >
              No thanks, I'll skip the bonuses
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
