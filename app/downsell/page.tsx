'use client'

import { useState } from 'react'
import {
  Shield,
  Clock,
  ArrowRight,
  Download,
  Sparkles,
  AlertCircle,
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
    <div className="min-h-screen bg-black">
      {/* Subtle animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-1/4 top-1/4 h-96 w-96 animate-pulse rounded-full bg-yellow-500/10 blur-3xl"></div>
        <div className="delay-1000 absolute bottom-1/4 right-1/4 h-96 w-96 animate-pulse rounded-full bg-orange-500/10 blur-3xl"></div>
      </div>

      <div className="relative mx-auto max-w-4xl px-4 py-8 md:px-6 md:py-16">
        {/* Urgency Badge */}
        <div className="mb-6 text-center md:mb-8">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-yellow-500/50 bg-yellow-500/20 px-4 py-2 backdrop-blur-sm md:mb-6 md:px-6 md:py-3">
            <Clock className="h-5 w-5 animate-pulse text-yellow-400 md:h-6 md:w-6" />
            <span className="text-sm font-black uppercase tracking-wider text-yellow-400 md:text-base">
              Final Offer - Last Chance
            </span>
            <Clock className="h-5 w-5 animate-pulse text-yellow-400 md:h-6 md:w-6" />
          </div>

          <h1 className="mb-3 text-3xl font-black text-white md:mb-4 md:text-5xl">
            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              WAIT!
            </span>{' '}
            I Understand...
          </h1>

          <p className="text-lg font-semibold text-gray-300 md:text-xl">
            $17 might feel like a stretch right now. So let me make this{' '}
            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text font-bold text-transparent">
              ridiculously easy...
            </span>
          </p>
        </div>

        {/* Main Content Card */}
        <div className="mb-8 rounded-2xl border border-yellow-500/30 bg-gradient-to-br from-gray-900 to-black p-6 shadow-2xl backdrop-blur-sm md:p-10">
          {/* What You're Missing */}
          <div className="mb-8 rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-6 backdrop-blur-sm md:p-8">
            <h2 className="mb-4 text-center text-2xl font-black text-white md:text-3xl">
              Without The Blueprint:
            </h2>
            <div className="space-y-3">
              {[
                'Tool without strategy = No $10M results',
                'Views without qualified leads = Wasted time',
                'Months of trial & error = Lost opportunity',
              ].map((text, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2 rounded-lg border border-yellow-500/10 bg-black/30 p-3 backdrop-blur-sm"
                >
                  <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-yellow-400" />
                  <p className="text-sm text-gray-300 md:text-base">{text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Special Offer */}
          <div className="mb-8 text-center">
            <h2 className="mb-4 text-2xl font-black text-white md:text-3xl">
              So Here's My{' '}
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Final Offer
              </span>
            </h2>
            <p className="mb-6 text-lg text-gray-300 md:text-xl">
              I'm dropping it to just{' '}
              <span className="font-bold text-yellow-400">$7</span>
            </p>

            {/* Price Flow */}
            <div className="mb-6 flex flex-wrap items-center justify-center gap-3 md:gap-4">
              <div className="rounded-lg border border-gray-700 bg-gray-900/50 px-4 py-3 backdrop-blur-sm">
                <p className="mb-1 text-xs text-gray-500">Regular</p>
                <p className="text-2xl font-black text-gray-600 line-through md:text-3xl">
                  $197
                </p>
              </div>
              <ArrowRight className="h-5 w-5 text-gray-600 md:h-6 md:w-6" />
              <div className="rounded-lg border border-gray-700 bg-gray-900/50 px-4 py-3 backdrop-blur-sm">
                <p className="mb-1 text-xs text-gray-500">Previous</p>
                <p className="text-2xl font-black text-gray-600 line-through md:text-3xl">
                  $17
                </p>
              </div>
              <ArrowRight className="h-5 w-5 text-yellow-400 md:h-6 md:w-6" />
              <div className="rounded-xl border-2 border-yellow-500/50 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 px-6 py-4 backdrop-blur-sm md:px-8 md:py-5">
                <p className="mb-1 text-xs font-bold uppercase tracking-wider text-yellow-400">
                  Final Price
                </p>
                <p className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-4xl font-black text-transparent md:text-5xl">
                  $7
                </p>
              </div>
            </div>

            <div className="inline-block rounded-lg border border-yellow-500/30 bg-yellow-500/10 px-4 py-2 backdrop-blur-sm md:px-6 md:py-3">
              <p className="text-lg font-black text-yellow-400 md:text-xl">
                96% OFF - Never Available Again
              </p>
            </div>
          </div>

          {/* What's Included */}
          <div className="mb-8 rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-5 backdrop-blur-sm md:p-6">
            <h3 className="mb-4 text-center text-lg font-bold text-white md:text-xl">
              Complete $10M Blueprint Included:
            </h3>
            <div className="grid gap-2 md:grid-cols-2">
              {[
                '5-Week Brand System',
                'AI Prompt Library',
                'Hook Psychology',
                'Client Conversion',
                'Weekly Worksheets',
                'Instant PDF Access',
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 rounded-lg border border-yellow-500/10 bg-black/20 p-2 backdrop-blur-sm"
                >
                  <Sparkles className="h-4 w-4 flex-shrink-0 text-yellow-400" />
                  <span className="text-sm text-gray-300">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Value Comparison */}
          <div className="mb-8 rounded-xl border border-yellow-500/20 bg-gradient-to-r from-yellow-500/5 to-orange-500/5 p-5 backdrop-blur-sm md:p-6">
            <p className="mb-4 text-center text-base font-semibold text-white md:text-lg">
              $7 is less than:
            </p>
            <div className="grid gap-2 md:grid-cols-3">
              {['2 Starbucks coffees', '1 Fast food meal', '1 Movie ticket'].map(
                (item, i) => (
                  <div
                    key={i}
                    className="rounded-lg border border-yellow-500/10 bg-black/30 p-3 text-center backdrop-blur-sm"
                  >
                    <p className="text-sm text-gray-400">{item}</p>
                  </div>
                )
              )}
            </div>
            <p className="mt-4 text-center text-base font-bold text-yellow-400 md:text-lg">
              But could be worth $10M to your career
            </p>
          </div>

          {/* Final Urgency */}
          <div className="mb-8 rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-5 text-center backdrop-blur-sm md:p-6">
            <div className="mb-2 flex items-center justify-center gap-2">
              <Clock className="h-6 w-6 animate-pulse text-yellow-400" />
              <h3 className="text-lg font-black text-yellow-400 md:text-xl">
                This is Your Last Chance
              </h3>
            </div>
            <p className="text-sm text-gray-300 md:text-base">
              Click "No thanks" and this $7 offer{' '}
              <span className="font-bold text-yellow-400">
                disappears forever
              </span>
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="space-y-4">
            {/* YES Button */}
            <button
              onClick={handleAcceptOffer}
              disabled={isProcessing}
              className="group relative w-full overflow-hidden rounded-xl p-0.5 transition-all hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
            >
              <div className="absolute -inset-1 animate-pulse rounded-xl bg-gradient-to-r from-yellow-400 to-orange-500 opacity-75 blur transition group-hover:opacity-100"></div>
              <div className="relative flex items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 px-8 py-6 md:py-7">
                {isProcessing ? (
                  <>
                    <div className="h-5 w-5 animate-spin rounded-full border-3 border-black border-t-transparent"></div>
                    <span className="text-lg font-black text-black md:text-xl">
                      Processing...
                    </span>
                  </>
                ) : (
                  <>
                    <Download className="h-7 w-7 text-black md:h-8 md:w-8" />
                    <span className="text-lg font-black text-black md:text-xl">
                      YES! Get The Blueprint for $7
                    </span>
                    <ArrowRight className="h-7 w-7 text-black transition-transform group-hover:translate-x-1 md:h-8 md:w-8" />
                  </>
                )}
              </div>
            </button>

            {/* Guarantee */}
            <div className="flex items-center justify-center gap-2 py-2">
              <Shield className="h-4 w-4 text-green-400 md:h-5 md:w-5" />
              <span className="text-xs font-semibold text-gray-400 md:text-sm">
                30-Day Money-Back Guarantee
              </span>
            </div>

            {/* NO Link */}
            <div className="text-center">
              <button
                onClick={handleDeclineOffer}
                className="text-xs text-gray-600 underline transition-colors hover:text-gray-500"
              >
                No thanks, I'll pass
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
