'use client'

import { useState } from 'react'
import {
  Shield,
  CheckCircle,
  Sparkles,
  ArrowRight,
  Clock,
  BookOpen,
  Zap,
  TrendingUp,
  Users,
  Download,
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
    router.push('/downsell')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-1/4 top-1/4 h-96 w-96 animate-pulse rounded-full bg-yellow-500/10 blur-3xl"></div>
        <div className="delay-1000 absolute bottom-1/4 right-1/4 h-96 w-96 animate-pulse rounded-full bg-green-500/10 blur-3xl"></div>
      </div>

      <div className="relative mx-auto max-w-5xl px-4 py-12 md:px-6 md:py-20">
        {/* Header - Urgency Badge */}
        <div className="mb-6 text-center md:mb-8">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border-2 border-red-500 bg-red-500/20 px-4 py-2 md:mb-6 md:px-6 md:py-3">
            <Clock className="h-5 w-5 animate-pulse text-red-400 md:h-6 md:w-6" />
            <span className="text-sm font-black uppercase tracking-wider text-red-400 md:text-base">
              ⚡ One-Time Offer - This Page Only
            </span>
          </div>

          <h1 className="mb-4 text-3xl font-black text-white md:mb-6 md:text-5xl lg:text-6xl">
            <span className="text-yellow-400">WAIT!</span> Don't Leave Yet...
          </h1>

          <p className="text-xl font-bold text-gray-300 md:text-2xl lg:text-3xl">
            Your Order is Confirmed! But You're Missing{' '}
            <span className="text-yellow-400">One Critical Piece...</span>
          </p>
        </div>

        {/* Main Content */}
        <div className="mb-8 rounded-2xl border-2 border-yellow-500/50 bg-gradient-to-br from-gray-800 to-gray-900 p-6 shadow-2xl md:mb-12 md:p-10">
          {/* Congratulations */}
          <div className="mb-8 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-lg bg-green-500/20 px-4 py-2">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <span className="font-bold text-green-400">
                Congrats! You now have the AgentClone™ System
              </span>
            </div>
          </div>

          {/* The Problem */}
          <div className="mb-8 rounded-xl border-l-4 border-red-500 bg-red-500/10 p-6">
            <h2 className="mb-4 text-2xl font-black text-white md:text-3xl">
              But Here's The Problem Most Agents Face...
            </h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-red-400"></div>
                <p className="text-base text-gray-300 md:text-lg">
                  They have the <strong>TOOL</strong> to create AI videos...{' '}
                  <span className="text-red-400">
                    but no STRATEGY to turn them into $10M
                  </span>
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-red-400"></div>
                <p className="text-base text-gray-300 md:text-lg">
                  They post content that gets views...{' '}
                  <span className="text-red-400">
                    but ZERO qualified leads or clients
                  </span>
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-red-400"></div>
                <p className="text-base text-gray-300 md:text-lg">
                  They look like everyone else...{' '}
                  <span className="text-red-400">
                    and get ignored by high-value clients
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* The Solution */}
          <div className="mb-8 text-center">
            <h2 className="mb-4 text-3xl font-black text-white md:text-4xl lg:text-5xl">
              That's Why I Created The...
            </h2>
            <div className="inline-flex items-center gap-3 rounded-xl border-2 border-yellow-500 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 px-6 py-4 md:px-8 md:py-6">
              <BookOpen className="h-8 w-8 text-yellow-400 md:h-12 md:w-12" />
              <div className="text-left">
                <div className="mb-1 inline-block rounded bg-yellow-500 px-2 py-0.5 text-xs font-black uppercase text-black">
                  2026 Edition
                </div>
                <h3 className="text-2xl font-black text-yellow-400 md:text-3xl lg:text-4xl">
                  $10M Personal Brand Blueprint
                </h3>
                <p className="text-sm text-gray-300 md:text-base">
                  For Real Estate Agents Who Want to Dominate
                </p>
              </div>
            </div>
          </div>

          {/* What's Inside */}
          <div className="mb-8 rounded-xl border border-gray-700 bg-gray-800/50 p-6 md:p-8">
            <h3 className="mb-6 text-center text-2xl font-black text-white md:text-3xl">
              The Exact 5-Week System I Used to Help 500+ Agents:
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-start gap-3 rounded-lg border border-green-500/30 bg-green-500/10 p-4">
                <CheckCircle className="mt-1 h-6 w-6 flex-shrink-0 text-green-400" />
                <div>
                  <h4 className="mb-1 font-bold text-white">
                    Week 1: Identity & Story
                  </h4>
                  <p className="text-sm text-gray-300">
                    Craft your unforgettable positioning & signature one-liner
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-lg border border-green-500/30 bg-green-500/10 p-4">
                <CheckCircle className="mt-1 h-6 w-6 flex-shrink-0 text-green-400" />
                <div>
                  <h4 className="mb-1 font-bold text-white">
                    Week 2: Authority & Communication
                  </h4>
                  <p className="text-sm text-gray-300">
                    Become the trusted voice using hook psychology
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-lg border border-green-500/30 bg-green-500/10 p-4">
                <CheckCircle className="mt-1 h-6 w-6 flex-shrink-0 text-green-400" />
                <div>
                  <h4 className="mb-1 font-bold text-white">
                    Week 3: Magnetic Proof
                  </h4>
                  <p className="text-sm text-gray-300">
                    Document outcomes that make strangers trust you
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-lg border border-green-500/30 bg-green-500/10 p-4">
                <CheckCircle className="mt-1 h-6 w-6 flex-shrink-0 text-green-400" />
                <div>
                  <h4 className="mb-1 font-bold text-white">
                    Week 4: AI Systems & Monetization
                  </h4>
                  <p className="text-sm text-gray-300">
                    Scale with leverage using ChatGPT, Flow & ElevenLabs
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-lg border border-green-500/30 bg-green-500/10 p-4">
                <CheckCircle className="mt-1 h-6 w-6 flex-shrink-0 text-green-400" />
                <div>
                  <h4 className="mb-1 font-bold text-white">
                    Week 5: $10M Discipline
                  </h4>
                  <p className="text-sm text-gray-300">
                    Rituals that compound into a 7-figure brand
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-lg border border-green-500/30 bg-green-500/10 p-4">
                <CheckCircle className="mt-1 h-6 w-6 flex-shrink-0 text-green-400" />
                <div>
                  <h4 className="mb-1 font-bold text-white">
                    BONUS: AI Prompt Library
                  </h4>
                  <p className="text-sm text-gray-300">
                    Copy-paste prompts for hooks, DMs, content & more
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Social Proof */}
          <div className="mb-8 rounded-xl border border-gray-700 bg-gray-800/50 p-6">
            <h3 className="mb-4 text-center text-xl font-black text-white md:text-2xl">
              Real Results from Real Agents:
            </h3>
            <div className="space-y-4">
              <div className="rounded-lg border-l-4 border-yellow-500 bg-gray-900/50 p-4">
                <p className="mb-2 italic text-gray-300">
                  "I got 12 buyer consults in 10 days using the Week 2 hook
                  psychology. This blueprint is the missing piece."
                </p>
                <p className="text-sm font-bold text-yellow-400">
                  - Sarah M., Luxury Agent
                </p>
              </div>
              <div className="rounded-lg border-l-4 border-yellow-500 bg-gray-900/50 p-4">
                <p className="mb-2 italic text-gray-300">
                  "Closed a $2M deal while traveling using the AI systems from
                  Week 4. Game changer!"
                </p>
                <p className="text-sm font-bold text-yellow-400">
                  - Michael T., Top Producer
                </p>
              </div>
            </div>
          </div>

          {/* Price Reveal */}
          <div className="mb-8 text-center">
            <p className="mb-4 text-lg text-gray-300 md:text-xl">
              This blueprint is normally sold for:
            </p>
            <div className="mb-6 flex items-center justify-center gap-4">
              <span className="text-4xl font-black text-gray-500 line-through md:text-5xl">
                $197
              </span>
              <ArrowRight className="h-8 w-8 text-gray-500" />
              <div className="rounded-xl border-4 border-green-500 bg-gradient-to-r from-green-500/20 to-green-600/20 px-6 py-4">
                <p className="mb-1 text-sm font-bold uppercase tracking-wider text-green-400">
                  Your Price Today
                </p>
                <p className="text-5xl font-black text-green-400 md:text-6xl">
                  $17
                </p>
              </div>
            </div>
            <p className="text-xl font-bold text-yellow-400 md:text-2xl">
              That's 91% OFF - But Only On This Page!
            </p>
          </div>

          {/* Urgency */}
          <div className="mb-8 rounded-xl border-2 border-red-500 bg-red-500/10 p-6 text-center">
            <div className="mb-3 flex items-center justify-center gap-2">
              <Clock className="h-6 w-6 animate-pulse text-red-400" />
              <h3 className="text-xl font-black text-red-400 md:text-2xl">
                ⚠️ IMPORTANT: This Offer Expires When You Leave This Page
              </h3>
            </div>
            <p className="text-base text-gray-300 md:text-lg">
              You'll NEVER see this $17 price again. If you click "No thanks"
              below, this blueprint goes back to $197 forever.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="space-y-4">
            {/* YES Button - BIG */}
            <button
              onClick={handleAcceptOffer}
              disabled={isProcessing}
              className="group flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-green-500 to-green-600 px-8 py-6 text-xl font-black text-white shadow-2xl transition-all hover:scale-105 hover:from-green-600 hover:to-green-700 hover:shadow-green-500/50 disabled:cursor-not-allowed disabled:opacity-50 md:py-8 md:text-2xl lg:text-3xl"
            >
              {isProcessing ? (
                <>
                  <div className="h-6 w-6 animate-spin rounded-full border-4 border-white border-t-transparent"></div>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Download className="h-7 w-7 md:h-8 md:w-8" />
                  <span>
                    YES! Add $10M Blueprint for Just $17
                  </span>
                  <ArrowRight className="h-7 w-7 transition-transform group-hover:translate-x-1 md:h-8 md:w-8" />
                </>
              )}
            </button>

            {/* Guarantee */}
            <div className="flex items-center justify-center gap-2 py-2">
              <Shield className="h-5 w-5 text-green-400" />
              <span className="text-sm font-semibold text-gray-300 md:text-base">
                Protected by 30-Day Money-Back Guarantee
              </span>
            </div>

            {/* NO Link - Small */}
            <div className="text-center">
              <button
                onClick={handleDeclineOffer}
                className="text-sm text-gray-500 underline transition-colors hover:text-gray-400"
              >
                No thanks, I'll pass on this limited offer
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Trust Bar */}
        <div className="text-center">
          <div className="inline-flex flex-col items-center gap-3 rounded-2xl border border-gray-700 bg-gray-800/50 px-5 py-3 sm:flex-row sm:gap-6 sm:rounded-full md:px-8 md:py-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-green-400 md:h-5 md:w-5" />
              <span className="text-xs font-semibold text-gray-300 md:text-sm">
                500+ Agents Transformed
              </span>
            </div>
            <div className="hidden h-6 w-px bg-gray-700 sm:block"></div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-400 md:h-5 md:w-5" />
              <span className="text-xs font-semibold text-gray-300 md:text-sm">
                Proven $10M Strategy
              </span>
            </div>
            <div className="hidden h-6 w-px bg-gray-700 sm:block"></div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-green-400 md:h-5 md:w-5" />
              <span className="text-xs font-semibold text-gray-300 md:text-sm">
                Instant Download
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
