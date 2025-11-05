'use client'

import { useState, useEffect } from 'react'
import {
  Shield,
  Lock,
  CreditCard,
  CheckCircle,
  Star,
  Loader,
} from 'lucide-react'
import { loadStripe } from '@stripe/stripe-js'
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js'
import { premiumStripeAppearance } from '@/app/utils/stripeAppearance'

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
)

function CheckoutForm() {
  const stripe = useStripe()
  const elements = useElements()
  const [email, setEmail] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements || !email) {
      return
    }

    setIsProcessing(true)
    setErrorMessage('')

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/oto`,
          receipt_email: email,
        },
      })

      if (error) {
        setErrorMessage(error.message || 'Payment failed. Please try again.')
        setIsProcessing(false)
      }
    } catch (err) {
      setErrorMessage('An unexpected error occurred. Please try again.')
      setIsProcessing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Step 1: Email - BRAND COLORS */}
      <div>
        <label
          htmlFor="email"
          className="mb-3 block text-base font-bold text-white md:text-lg"
        >
          <span className="mr-2 inline-block h-7 w-7 rounded-full bg-gradient-to-r from-[#E7B93E] via-[#F4D77E] to-[#D4A62E] text-center leading-7 font-black text-black md:h-8 md:w-8 md:leading-8">
            1
          </span>
          Enter Your Email Address
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="your@email.com"
          className="w-full rounded-lg border-2 border-gray-600 bg-gray-900 px-4 py-4 text-base text-white placeholder-gray-500 transition-all focus:border-[#E7B93E] focus:ring-2 focus:ring-[#E7B93E] focus:outline-none md:py-5 md:text-lg"
        />
      </div>

      {/* Step 2: Payment Method - BRAND COLORS */}
      <div>
        <label className="mb-3 block text-base font-bold text-white md:text-lg">
          <span className="mr-2 inline-block h-7 w-7 rounded-full bg-gradient-to-r from-[#E7B93E] via-[#F4D77E] to-[#D4A62E] text-center leading-7 font-black text-black md:h-8 md:w-8 md:leading-8">
            2
          </span>
          Choose Payment Method
        </label>
        <PaymentElement
          options={{
            layout: {
              type: 'tabs',
              defaultCollapsed: false,
              radios: false,
              spacedAccordionItems: true,
            },
            wallets: {
              applePay: 'auto', // Show Apple Pay if available
              googlePay: 'auto', // Show Google Pay if available
            },
            // CARD FIRST for familiarity, then wallet options
            paymentMethodOrder: ['card', 'apple_pay', 'google_pay', 'link'],
            fields: {
              billingDetails: {
                address: 'auto', // Only show if needed
              },
            },
            terms: {
              card: 'never', // Remove terms text for cleaner look
            },
          }}
        />
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-3">
          <p className="text-sm text-red-400">{errorMessage}</p>
        </div>
      )}

      {/* Step 3: Complete Order - BRAND COLORS */}
      <div className="space-y-4">
        <label className="mb-3 block text-base font-bold text-white md:text-lg">
          <span className="mr-2 inline-block h-7 w-7 rounded-full bg-gradient-to-r from-[#E7B93E] via-[#F4D77E] to-[#D4A62E] text-center leading-7 font-black text-black md:h-8 md:w-8 md:leading-8">
            3
          </span>
          Complete Your Order
        </label>

        {/* Guarantee Badge - BIGGER and clearer */}
        <div className="flex items-center justify-center gap-3 rounded-lg border-2 border-green-500/30 bg-green-500/10 px-5 py-4">
          <Shield className="h-5 w-5 flex-shrink-0 text-green-400 md:h-6 md:w-6" />
          <p className="text-sm font-bold text-green-400 md:text-base">
            Protected by 30-Day Money-Back Guarantee
          </p>
        </div>

        {/* Submit Button - BIGGER and clearer */}
        <button
          type="submit"
          disabled={isProcessing || !stripe || !elements || !email}
          className="flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-green-500 to-green-600 px-8 py-5 text-xl font-black text-white shadow-2xl transition-all hover:from-green-600 hover:to-green-700 hover:shadow-green-500/50 disabled:cursor-not-allowed disabled:bg-gray-600 md:py-6 md:text-2xl"
        >
          {isProcessing ? (
            <>
              <Loader className="h-6 w-6 animate-spin md:h-7 md:w-7" />
              <span>Processing Securely...</span>
            </>
          ) : (
            <>
              <Lock className="h-6 w-6 md:h-7 md:w-7" />
              <span>Complete Order - $37</span>
            </>
          )}
        </button>
      </div>

      {/* Security Badge - BIGGER for readability */}
      <div className="flex items-center justify-center gap-2 pt-2 text-sm text-gray-400 md:text-base">
        <Lock className="h-4 w-4 md:h-5 md:w-5" />
        <span>
          Powered by <span className="font-semibold">Stripe</span> • Bank-Level
          Encryption
        </span>
      </div>
    </form>
  )
}

export default function EmbeddedCheckout() {
  const [clientSecret, setClientSecret] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Create PaymentIntent on component mount
    const createPaymentIntent = async () => {
      try {
        const response = await fetch('/api/create-payment-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: 'customer@example.com' }), // Placeholder
        })

        const data = await response.json()

        if (data.clientSecret) {
          setClientSecret(data.clientSecret)
        }
        setIsLoading(false)
      } catch (err) {
        console.error('Error creating payment intent:', err)
        setIsLoading(false)
      }
    }

    createPaymentIntent()
  }, [])

  return (
    <section
      id="checkout"
      className="relative bg-gradient-to-br from-gray-900 via-black to-gray-900 py-12 md:py-20"
    >
      {/* Animated background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 h-96 w-96 animate-pulse rounded-full bg-[#E7B93E]/10 blur-3xl"></div>
        <div className="absolute right-1/4 bottom-1/4 h-96 w-96 animate-pulse rounded-full bg-[#D4A62E]/10 blur-3xl delay-1000"></div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 md:px-6">
        {/* Header - SIMPLIFIED for clarity */}
        <div className="mb-8 text-center md:mb-12">
          {/* Simple Discount Badge - No pulsing animation */}
          <div className="mb-4 inline-block rounded-lg border-2 border-green-500/50 bg-green-500/20 px-4 py-2 md:mb-6 md:px-6 md:py-3">
            <span className="text-sm font-bold text-green-400 md:text-lg">
              ✓ $60 OFF Applied – Today Only $37
            </span>
          </div>
          <h2 className="mb-3 px-4 text-3xl font-black font-serif text-white md:mb-4 md:text-5xl lg:text-6xl">
            Secure Checkout
          </h2>
          <p className="px-4 text-lg text-gray-300 md:text-xl lg:text-2xl">
            Complete your order in 3 simple steps
          </p>
        </div>

        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:gap-8 lg:grid-cols-2">
          {/* Left: Order Summary */}
          <div className="space-y-4 md:space-y-6">
            {/* Product Card */}
            <div className="rounded-xl border-2 border-[#E7B93E]/30 bg-gradient-to-br from-gray-800 to-gray-900 p-4 shadow-2xl md:rounded-2xl md:p-6">
              <div className="mb-4 flex items-start gap-3 md:mb-6 md:gap-4">
                <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#E7B93E] via-[#F4D77E] to-[#D4A62E] md:h-20 md:w-20 md:rounded-xl">
                  <Star className="h-8 w-8 text-black md:h-10 md:w-10" />
                </div>
                <div>
                  <h3 className="mb-1 text-lg font-black font-serif text-white md:text-xl">
                    7-Minute AgentClone™ System
                  </h3>
                  <p className="text-xs text-gray-400 md:text-sm">
                    Complete AI Video Course + System Prompts
                  </p>
                </div>
              </div>

              {/* What's Included */}
              <div className="mb-4 space-y-2 md:mb-6 md:space-y-3">
                <div className="flex items-center gap-2 text-xs text-gray-300 md:text-sm">
                  <CheckCircle className="h-4 w-4 flex-shrink-0 text-green-400 md:h-5 md:w-5" />
                  <span>7-minute step-by-step video training</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-300 md:text-sm">
                  <CheckCircle className="h-4 w-4 flex-shrink-0 text-green-400 md:h-5 md:w-5" />
                  <span>AI system prompts & workflows</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-300 md:text-sm">
                  <CheckCircle className="h-4 w-4 flex-shrink-0 text-green-400 md:h-5 md:w-5" />
                  <span>Real estate scripts & templates</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-300 md:text-sm">
                  <CheckCircle className="h-4 w-4 flex-shrink-0 text-green-400 md:h-5 md:w-5" />
                  <span>Lifetime access + free updates</span>
                </div>
              </div>

              {/* Price */}
              <div className="border-t border-gray-700 pt-3 md:pt-4">
                <div className="mb-1.5 flex items-center justify-between md:mb-2">
                  <span className="text-sm text-gray-400 md:text-base">
                    Regular Price
                  </span>
                  <span className="text-sm text-gray-500 line-through md:text-base">
                    $97.00
                  </span>
                </div>
                <div className="mb-1.5 flex items-center justify-between md:mb-2">
                  <span className="text-sm text-gray-400 md:text-base">
                    Today's Discount
                  </span>
                  <span className="text-sm font-bold text-green-400 md:text-base">
                    -$60.00
                  </span>
                </div>
                <div className="mt-3 border-t border-gray-700 pt-3 md:mt-4 md:pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-white md:text-xl">
                      Total
                    </span>
                    <span className="text-2xl font-black text-[#E7B93E] md:text-3xl">
                      $37.00
                    </span>
                  </div>
                  <p className="mt-1 text-right text-xs text-gray-500">
                    One-time payment • USD
                  </p>
                </div>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="rounded-lg border border-gray-700 bg-gray-800/50 p-4 md:rounded-xl md:p-6">
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                <div className="flex items-center gap-1.5 md:gap-2">
                  <Shield className="h-4 w-4 flex-shrink-0 text-green-400 md:h-5 md:w-5" />
                  <span className="text-xs text-gray-300 md:text-sm">
                    SSL Secured
                  </span>
                </div>
                <div className="flex items-center gap-1.5 md:gap-2">
                  <Lock className="h-4 w-4 flex-shrink-0 text-green-400 md:h-5 md:w-5" />
                  <span className="text-xs text-gray-300 md:text-sm">
                    256-bit Encryption
                  </span>
                </div>
                <div className="flex items-center gap-1.5 md:gap-2">
                  <CheckCircle className="h-4 w-4 flex-shrink-0 text-green-400 md:h-5 md:w-5" />
                  <span className="text-xs text-gray-300 md:text-sm">
                    30-Day Guarantee
                  </span>
                </div>
                <div className="flex items-center gap-1.5 md:gap-2">
                  <CreditCard className="h-4 w-4 flex-shrink-0 text-green-400 md:h-5 md:w-5" />
                  <span className="text-xs text-gray-300 md:text-sm">
                    Secure Payment
                  </span>
                </div>
              </div>
            </div>

            {/* Money-back guarantee */}
            <div className="rounded-lg border border-green-500/30 bg-gradient-to-r from-green-500/10 to-green-600/10 p-3 md:rounded-xl md:p-4">
              <div className="flex items-start gap-2 md:gap-3">
                <Shield className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-400 md:mt-1 md:h-6 md:w-6" />
                <div>
                  <h4 className="mb-1 text-sm font-bold text-white md:text-base">
                    30-Day Money-Back Guarantee
                  </h4>
                  <p className="text-xs text-gray-300 md:text-sm">
                    If you don't get 5-15 leads in your first week, we'll refund
                    every penny. No questions asked.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Payment Form - SIMPLIFIED */}
          <div className="rounded-xl border-2 border-green-500/50 bg-gradient-to-br from-gray-800 to-gray-900 p-6 shadow-2xl md:rounded-2xl md:p-10">
            <div className="mb-6 md:mb-8">
              <div className="mb-4 flex items-center justify-center gap-3">
                <Lock className="h-6 w-6 text-green-400 md:h-7 md:w-7" />
                <span className="text-lg font-bold tracking-wide text-green-400 uppercase md:text-xl">
                  Secure Payment
                </span>
              </div>
              <p className="text-center text-base font-semibold text-gray-300 md:text-lg">
                Safe & Encrypted Checkout
              </p>
            </div>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader className="mb-4 h-8 w-8 animate-spin text-[#E7B93E]" />
                <p className="text-sm text-gray-400">
                  Loading secure checkout...
                </p>
              </div>
            ) : clientSecret ? (
              <Elements
                stripe={stripePromise}
                options={{
                  clientSecret,
                  appearance: premiumStripeAppearance, // 🎨 Premium luxury branding
                }}
              >
                <CheckoutForm />
              </Elements>
            ) : (
              <div className="py-12 text-center text-red-400">
                <p>Failed to load checkout. Please refresh the page.</p>
              </div>
            )}

            {/* Testimonial Snippet */}
            <div className="mt-6 border-t border-gray-700 pt-5 md:mt-8 md:pt-6">
              <div className="flex items-center gap-2.5 md:gap-3">
                <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-br from-[#E7B93E] via-[#F4D77E] to-[#D4A62E] md:h-12 md:w-12"></div>
                <div>
                  <div className="mb-1 flex gap-0.5 md:gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-3 w-3 fill-[#E7B93E] text-[#E7B93E] md:h-4 md:w-4"
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray-300 italic md:text-sm">
                    "Got 8 leads in my first 3 days!"
                  </p>
                  <p className="text-xs text-gray-500">
                    - Sarah M., Real Estate Agent
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Trust Bar */}
        <div className="mt-8 px-4 text-center md:mt-12">
          <div className="inline-flex flex-col items-center gap-3 rounded-2xl border border-gray-700 bg-gray-800/50 px-5 py-3 sm:flex-row sm:gap-6 sm:rounded-full md:px-8 md:py-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-400 md:h-5 md:w-5" />
              <span className="text-xs font-semibold text-gray-300 md:text-sm">
                500+ Happy Customers
              </span>
            </div>
            <div className="hidden h-6 w-px bg-gray-700 sm:block"></div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-green-400 md:h-5 md:w-5" />
              <span className="text-xs font-semibold text-gray-300 md:text-sm">
                100% Secure Payment
              </span>
            </div>
            <div className="hidden h-6 w-px bg-gray-700 sm:block"></div>
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-green-400 md:h-5 md:w-5" />
              <span className="text-xs font-semibold text-gray-300 md:text-sm">
                256-bit Encryption
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
