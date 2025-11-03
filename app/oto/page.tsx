'use client'

import { useState } from 'react'
import Image from 'next/image'
import {
  Shield,
  CheckCircle,
  ArrowRight,
  Clock,
  Download,
  Sparkles,
  Star,
  Zap,
} from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function OTOPage() {
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)

  const handleAcceptOffer = async () => {
    setIsProcessing(true)

    try {
      const response = await fetch('/api/create-oto-payment', {
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
    router.push('/downsell')
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Subtle animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-1/4 top-1/4 h-96 w-96 animate-pulse rounded-full bg-yellow-500/5 blur-3xl"></div>
        <div className="delay-1000 absolute bottom-1/4 right-1/4 h-96 w-96 animate-pulse rounded-full bg-orange-500/5 blur-3xl"></div>
      </div>

      <div className="relative mx-auto max-w-5xl px-4 py-8 md:px-6 md:py-16">
        {/* Urgency Badge */}
        <div className="mb-6 text-center md:mb-8">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-yellow-500/30 bg-yellow-500/10 px-4 py-2 backdrop-blur-sm md:mb-6 md:px-6 md:py-2.5">
            <Clock className="h-4 w-4 animate-pulse text-yellow-400 md:h-5 md:w-5" />
            <span className="text-xs font-bold uppercase tracking-wider text-yellow-400 md:text-sm">
              One-Time Offer - This Page Only
            </span>
          </div>

          <h1 className="mb-3 text-3xl font-black text-white md:mb-4 md:text-5xl">
            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              WAIT!
            </span>{' '}
            You're Missing One Thing...
          </h1>

          <p className="text-lg font-semibold text-gray-300 md:text-xl">
            Your AgentClone is confirmed, but{' '}
            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text font-bold text-transparent">
              without strategy, it won't reach $10M
            </span>
          </p>
        </div>

        {/* Main Content Card */}
        <div className="mb-8 rounded-2xl border border-yellow-500/20 bg-gradient-to-br from-gray-900 to-black p-6 shadow-2xl backdrop-blur-sm md:p-10">
          {/* Success Badge */}
          <div className="mb-8 text-center">
            <div className="inline-flex items-center gap-2 rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-2 backdrop-blur-sm">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <span className="text-sm font-semibold text-green-400">
                AgentClone System Confirmed
              </span>
            </div>
          </div>

          {/* Premium Product Mockup */}
          <div className="mb-8">
            <div className="relative mx-auto max-w-2xl">
              {/* VIP Badge */}
              <div className="absolute -right-4 -top-4 z-10 rotate-12 md:-right-8 md:-top-6">
                <div className="flex items-center gap-1 rounded-full border-2 border-yellow-500 bg-gradient-to-r from-yellow-400 to-orange-500 px-3 py-1 shadow-2xl md:gap-2 md:px-4 md:py-2">
                  <Star className="h-4 w-4 fill-black text-black md:h-5 md:w-5" />
                  <span className="text-xs font-black uppercase text-black md:text-sm">
                    VIP ACCESS
                  </span>
                  <Star className="h-4 w-4 fill-black text-black md:h-5 md:w-5" />
                </div>
              </div>

              {/* Product Image with Premium Glow */}
              <div className="group relative overflow-hidden rounded-2xl border-2 border-yellow-500/30 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 p-2 backdrop-blur-sm md:p-4">
                <div className="absolute -inset-1 animate-pulse rounded-2xl bg-gradient-to-r from-yellow-400 to-orange-500 opacity-20 blur-xl transition group-hover:opacity-30"></div>
                <div className="relative overflow-hidden rounded-xl">
                  <Image
                    src="/images/P5_result.webp"
                    alt="$10M Personal Brand Blueprint 2026 Edition"
                    width={800}
                    height={600}
                    className="w-full"
                    priority
                  />
                </div>
              </div>

              {/* Edition Badge */}
              <div className="absolute -bottom-3 left-1/2 z-10 -translate-x-1/2 md:-bottom-4">
                <div className="rounded-full border-2 border-yellow-500/50 bg-gradient-to-r from-yellow-500/90 to-orange-500/90 px-4 py-2 backdrop-blur-sm md:px-6 md:py-3">
                  <p className="text-xs font-black uppercase text-black md:text-sm">
                    2026 Edition
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Killer Value Proposition */}
          <div className="mb-8 space-y-6">
            <h2 className="text-center text-2xl font-black text-white md:text-3xl">
              The{' '}
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                $10M Personal Brand Blueprint
              </span>
            </h2>

            <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-6 backdrop-blur-sm md:p-8">
              <p className="mb-4 text-center text-lg font-semibold text-white md:text-xl">
                Here's the harsh truth most agents won't tell you:
              </p>
              <p className="mb-6 text-center text-base text-gray-300 md:text-lg">
                You can have the best AI tools in the world, but{' '}
                <span className="font-bold text-yellow-400">
                  without a proven positioning strategy
                </span>
                , you'll just be another faceless agent posting content that
                gets ignored. This blueprint contains the exact 5-week system
                that separates the{' '}
                <span className="font-bold text-yellow-400">
                  top 1% earning $10M+
                </span>{' '}
                from everyone else struggling to get noticed.
              </p>

              {/* Value Bullets */}
              <div className="space-y-3">
                {[
                  'The psychology-backed hook formulas that make high-net-worth clients actually stop scrolling and DM you first',
                  'The personal brand positioning framework that positions you as THE authority (not just another agent)',
                  'Copy-paste AI prompts worth $5,000+ that create client-attracting content in 60 seconds',
                  'The exact content-to-client conversion system used by agents closing $2M+ deals from social media',
                  'Weekly action plans that eliminate guesswork and get you results in days, not months',
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 rounded-lg border border-yellow-500/20 bg-black/30 p-3 backdrop-blur-sm"
                  >
                    <Zap className="mt-0.5 h-5 w-5 flex-shrink-0 text-yellow-400" />
                    <p className="text-sm font-medium text-gray-200 md:text-base">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Insane Value Stack */}
            <div className="rounded-xl border border-yellow-500/30 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 p-6 backdrop-blur-sm md:p-8">
              <h3 className="mb-4 text-center text-xl font-black text-white md:text-2xl">
                What You're Actually Getting:
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between border-b border-gray-700 pb-2">
                  <span className="text-sm text-gray-300 md:text-base">
                    5-Week Brand Positioning System
                  </span>
                  <span className="text-sm font-bold text-white md:text-base">
                    $997
                  </span>
                </div>
                <div className="flex justify-between border-b border-gray-700 pb-2">
                  <span className="text-sm text-gray-300 md:text-base">
                    AI Prompt Library (120+ Prompts)
                  </span>
                  <span className="text-sm font-bold text-white md:text-base">
                    $497
                  </span>
                </div>
                <div className="flex justify-between border-b border-gray-700 pb-2">
                  <span className="text-sm text-gray-300 md:text-base">
                    Hook Psychology Framework
                  </span>
                  <span className="text-sm font-bold text-white md:text-base">
                    $297
                  </span>
                </div>
                <div className="flex justify-between border-b border-gray-700 pb-2">
                  <span className="text-sm text-gray-300 md:text-base">
                    Content-to-Client Conversion System
                  </span>
                  <span className="text-sm font-bold text-white md:text-base">
                    $397
                  </span>
                </div>
                <div className="flex justify-between pt-3">
                  <span className="text-base font-black text-white md:text-lg">
                    TOTAL VALUE:
                  </span>
                  <span className="text-base font-black text-white md:text-lg">
                    $2,188
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Price */}
          <div className="mb-8 text-center">
            <p className="mb-4 text-base text-gray-400 md:text-lg">
              Everyone else pays $2,188. But right now...
            </p>
            <div className="mb-6 flex flex-col items-center justify-center gap-4 md:flex-row md:gap-6">
              <div className="text-center">
                <p className="mb-1 text-sm text-gray-500">Total Value</p>
                <span className="text-3xl font-black text-gray-600 line-through md:text-4xl">
                  $2,188
                </span>
              </div>
              <ArrowRight className="h-6 w-6 rotate-90 text-yellow-400 md:h-8 md:w-8 md:rotate-0" />
              <div className="rounded-2xl border-4 border-yellow-500/50 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 px-8 py-5 backdrop-blur-sm md:px-12 md:py-6">
                <p className="mb-2 text-xs font-bold uppercase tracking-wider text-yellow-400 md:text-sm">
                  Your Price Today
                </p>
                <p className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-5xl font-black text-transparent md:text-6xl">
                  $17
                </p>
              </div>
            </div>
            <div className="inline-block rounded-xl border-2 border-yellow-500/50 bg-yellow-500/20 px-6 py-3 backdrop-blur-sm md:px-8 md:py-4">
              <p className="text-xl font-black text-yellow-400 md:text-2xl">
                That's 99.2% OFF - Only $17 for $2,188 Worth of Value
              </p>
            </div>
          </div>

          {/* Urgency */}
          <div className="mb-8 rounded-xl border border-yellow-500/30 bg-yellow-500/5 p-5 text-center backdrop-blur-sm md:p-6">
            <div className="mb-2 flex items-center justify-center gap-2">
              <Clock className="h-5 w-5 animate-pulse text-yellow-400 md:h-6 md:w-6" />
              <h3 className="text-base font-black text-yellow-400 md:text-lg">
                This Offer Disappears When You Leave This Page
              </h3>
            </div>
            <p className="text-sm text-gray-300 md:text-base">
              Click "No thanks" and pay $2,188 later... or get it for just $17
              right now
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
              <div className="relative flex items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 px-8 py-5 md:py-6">
                {isProcessing ? (
                  <>
                    <div className="h-5 w-5 animate-spin rounded-full border-3 border-black border-t-transparent"></div>
                    <span className="text-lg font-black text-black md:text-xl">
                      Processing...
                    </span>
                  </>
                ) : (
                  <>
                    <Download className="h-6 w-6 text-black md:h-7 md:w-7" />
                    <span className="text-lg font-black text-black md:text-xl">
                      YES! Give Me $2,188 Worth for Just $17
                    </span>
                    <ArrowRight className="h-6 w-6 text-black transition-transform group-hover:translate-x-1 md:h-7 md:w-7" />
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
                No thanks, I'll pay $2,188 later
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
