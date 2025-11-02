'use client'

import { useState } from 'react'
import {
  Shield,
  AlertTriangle,
  Clock,
  ArrowRight,
  Download,
  Sparkles,
  TrendingDown,
} from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function DownsellPage() {
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)

  const handleAcceptOffer = async () => {
    setIsProcessing(true)

    try {
      const response = await fetch('/api/create-downsell-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })

      const data = await response.json()

      if (data.url) {
        // Redirect to Stripe checkout
        window.location.href = data.url
      } else {
        setIsProcessing(false)
        alert('Error creating payment. Please try again.')
      }
    } catch (err) {
      console.error('Error:', err)
      setIsProcessing(false)
      alert('Error creating payment. Please try again.')
    }
  }

  const handleDeclineOffer = () => {
    router.push('/thank-you-confirmed')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Animated background - more intense */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-1/4 top-1/4 h-96 w-96 animate-pulse rounded-full bg-red-500/20 blur-3xl"></div>
        <div className="delay-1000 absolute bottom-1/4 right-1/4 h-96 w-96 animate-pulse rounded-full bg-yellow-500/20 blur-3xl"></div>
      </div>

      <div className="relative mx-auto max-w-4xl px-4 py-12 md:px-6 md:py-20">
        {/* Extreme Urgency Header */}
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex animate-pulse items-center gap-2 rounded-full border-2 border-red-500 bg-red-500/30 px-4 py-2 md:mb-6 md:px-6 md:py-3">
            <AlertTriangle className="h-6 w-6 text-red-400 md:h-7 md:w-7" />
            <span className="text-base font-black uppercase tracking-wider text-red-400 md:text-lg">
              🚨 LAST CHANCE - FINAL OFFER
            </span>
            <AlertTriangle className="h-6 w-6 text-red-400 md:h-7 md:w-7" />
          </div>

          <h1 className="mb-4 text-3xl font-black uppercase text-white md:mb-6 md:text-5xl lg:text-6xl">
            <span className="text-red-400">WAIT!</span> Before You Go...
          </h1>

          <p className="text-xl font-bold text-gray-300 md:text-2xl lg:text-3xl">
            I Understand $17 Might Feel Like Too Much Right Now
          </p>
        </div>

        {/* Main Content */}
        <div className="mb-8 rounded-2xl border-2 border-red-500/50 bg-gradient-to-br from-gray-800 to-gray-900 p-6 shadow-2xl md:p-10">
          {/* The Mistake */}
          <div className="mb-8 rounded-xl border-2 border-yellow-500 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 p-6 text-center md:p-8">
            <h2 className="mb-4 text-2xl font-black text-white md:text-3xl lg:text-4xl">
              But Here's What You're About to Miss...
            </h2>
            <p className="mb-4 text-lg text-gray-300 md:text-xl">
              Without the <strong>$10M Personal Brand Blueprint</strong>, you'll
              have:
            </p>
            <div className="space-y-3 text-left">
              <div className="flex items-start gap-3">
                <TrendingDown className="mt-1 h-6 w-6 flex-shrink-0 text-red-400" />
                <p className="text-base text-gray-300 md:text-lg">
                  <strong className="text-red-400">
                    The AgentClone tool...
                  </strong>{' '}
                  but no strategy to turn AI videos into $10M
                </p>
              </div>
              <div className="flex items-start gap-3">
                <TrendingDown className="mt-1 h-6 w-6 flex-shrink-0 text-red-400" />
                <p className="text-base text-gray-300 md:text-lg">
                  <strong className="text-red-400">
                    Content that gets views...
                  </strong>{' '}
                  but zero qualified leads or high-value clients
                </p>
              </div>
              <div className="flex items-start gap-3">
                <TrendingDown className="mt-1 h-6 w-6 flex-shrink-0 text-red-400" />
                <p className="text-base text-gray-300 md:text-lg">
                  <strong className="text-red-400">
                    Months of trial & error...
                  </strong>{' '}
                  instead of a proven 5-week system
                </p>
              </div>
            </div>
          </div>

          {/* Reality Check */}
          <div className="mb-8 rounded-xl border border-gray-700 bg-gray-800/50 p-6">
            <h3 className="mb-4 text-center text-xl font-black text-white md:text-2xl">
              💔 The Harsh Truth:
            </h3>
            <p className="mb-4 text-center text-base text-gray-300 md:text-lg">
              Most agents who buy AI tools <strong>never</strong> become the #1
              authority in their market because they're missing the{' '}
              <span className="text-yellow-400">positioning & strategy</span>.
            </p>
            <p className="text-center text-base font-bold text-yellow-400 md:text-lg">
              Don't let that be you.
            </p>
          </div>

          {/* The Offer */}
          <div className="mb-8 text-center">
            <h2 className="mb-4 text-2xl font-black text-white md:text-3xl lg:text-4xl">
              So I'm Doing Something CRAZY...
            </h2>
            <p className="mb-6 text-lg text-gray-300 md:text-xl">
              I'm giving you a{' '}
              <span className="text-green-400">59% INSTANT DISCOUNT</span> right
              now.
            </p>

            {/* Price Comparison */}
            <div className="mb-6 flex flex-col items-center justify-center gap-4 md:flex-row">
              <div className="rounded-lg bg-gray-900/50 px-6 py-4">
                <p className="mb-2 text-sm text-gray-400">Regular Price</p>
                <p className="text-3xl font-black text-gray-500 line-through md:text-4xl">
                  $197
                </p>
              </div>
              <ArrowRight className="h-6 w-6 rotate-90 text-gray-500 md:rotate-0 md:h-8 md:w-8" />
              <div className="rounded-lg bg-gray-900/50 px-6 py-4">
                <p className="mb-2 text-sm text-gray-400">Previous Offer</p>
                <p className="text-3xl font-black text-gray-500 line-through md:text-4xl">
                  $17
                </p>
              </div>
              <ArrowRight className="h-6 w-6 rotate-90 text-green-400 md:rotate-0 md:h-8 md:w-8" />
              <div className="rounded-xl border-4 border-green-500 bg-gradient-to-r from-green-500/20 to-green-600/20 px-8 py-6">
                <p className="mb-2 text-sm font-bold uppercase tracking-wider text-green-400">
                  FINAL PRICE
                </p>
                <p className="text-5xl font-black text-green-400 md:text-6xl">
                  $7
                </p>
              </div>
            </div>

            <div className="inline-block rounded-xl border-2 border-yellow-500 bg-yellow-500/20 px-6 py-4">
              <p className="text-xl font-black text-yellow-400 md:text-2xl">
                🎉 That's 96% OFF The Original Price!
              </p>
            </div>
          </div>

          {/* What They Get */}
          <div className="mb-8 rounded-xl border border-green-500/50 bg-green-500/10 p-6">
            <h3 className="mb-4 text-center text-xl font-black text-white md:text-2xl">
              For Just $7, You Get The Complete System:
            </h3>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 flex-shrink-0 text-green-400" />
                <span className="text-sm text-gray-300 md:text-base">
                  5-Week $10M Brand Blueprint
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 flex-shrink-0 text-green-400" />
                <span className="text-sm text-gray-300 md:text-base">
                  AI Prompt Library (Copy-Paste)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 flex-shrink-0 text-green-400" />
                <span className="text-sm text-gray-300 md:text-base">
                  Hook Psychology Framework
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 flex-shrink-0 text-green-400" />
                <span className="text-sm text-gray-300 md:text-base">
                  Content-to-Client System
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 flex-shrink-0 text-green-400" />
                <span className="text-sm text-gray-300 md:text-base">
                  Weekly Worksheets & Action Plans
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 flex-shrink-0 text-green-400" />
                <span className="text-sm text-gray-300 md:text-base">
                  Instant PDF Download
                </span>
              </div>
            </div>
          </div>

          {/* EXTREME Urgency */}
          <div className="mb-8 rounded-xl border-2 border-red-500 bg-red-500/20 p-6 text-center">
            <div className="mb-3 flex items-center justify-center gap-2">
              <Clock className="h-7 w-7 animate-pulse text-red-400 md:h-8 md:w-8" />
              <h3 className="text-xl font-black text-red-400 md:text-2xl">
                ⚠️ THIS IS YOUR ABSOLUTE LAST CHANCE
              </h3>
            </div>
            <p className="mb-3 text-base text-gray-300 md:text-lg">
              If you click "No thanks" below, this offer{' '}
              <strong className="text-red-400">
                disappears FOREVER
              </strong>
              .
            </p>
            <p className="text-base font-bold text-yellow-400 md:text-lg">
              The blueprint goes back to $197 and you'll{' '}
              <strong>NEVER</strong> get this $7 price again.
            </p>
          </div>

          {/* Final Push */}
          <div className="mb-8 rounded-xl bg-gradient-to-r from-yellow-500/10 to-amber-500/10 p-6 text-center">
            <p className="text-lg font-bold text-white md:text-xl">
              Think about it:{' '}
              <span className="text-yellow-400">$7 for a $10M strategy</span> is
              less than:
            </p>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <div className="rounded-lg bg-gray-900/50 p-3">
                <p className="text-sm text-gray-400">☕ 2 Starbucks coffees</p>
              </div>
              <div className="rounded-lg bg-gray-900/50 p-3">
                <p className="text-sm text-gray-400">🍔 1 Fast food meal</p>
              </div>
              <div className="rounded-lg bg-gray-900/50 p-3">
                <p className="text-sm text-gray-400">🎬 1 Movie ticket</p>
              </div>
            </div>
            <p className="mt-4 text-base font-bold text-green-400 md:text-lg">
              But it could be worth $10M to your career.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="space-y-4">
            {/* YES Button - MASSIVE */}
            <button
              onClick={handleAcceptOffer}
              disabled={isProcessing}
              className="group flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-green-500 to-green-600 px-8 py-8 text-xl font-black uppercase text-white shadow-2xl transition-all hover:scale-105 hover:from-green-600 hover:to-green-700 hover:shadow-green-500/50 disabled:cursor-not-allowed disabled:opacity-50 md:py-10 md:text-2xl lg:text-3xl"
            >
              {isProcessing ? (
                <>
                  <div className="h-6 w-6 animate-spin rounded-full border-4 border-white border-t-transparent"></div>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Download className="h-8 w-8 md:h-9 md:w-9" />
                  <span className="leading-tight">
                    Yes! I Want The $10M Blueprint for Just $7
                  </span>
                  <ArrowRight className="h-8 w-8 transition-transform group-hover:translate-x-1 md:h-9 md:w-9" />
                </>
              )}
            </button>

            {/* Guarantee */}
            <div className="flex items-center justify-center gap-2 py-2">
              <Shield className="h-5 w-5 text-green-400" />
              <span className="text-sm font-semibold text-gray-300 md:text-base">
                Still Protected by 30-Day Money-Back Guarantee
              </span>
            </div>

            {/* NO Link - TINY */}
            <div className="text-center">
              <button
                onClick={handleDeclineOffer}
                className="text-xs text-gray-600 underline transition-colors hover:text-gray-500"
              >
                No thanks, I don't want to build a $10M brand for $7
              </button>
            </div>
          </div>
        </div>

        {/* Final Reminder */}
        <div className="text-center">
          <p className="text-sm italic text-gray-400">
            Remember: This $7 offer will NEVER be available again after you leave
            this page.
          </p>
        </div>
      </div>
    </div>
  )
}
