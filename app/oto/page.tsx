'use client'

import { useState } from 'react'
import {
  Shield,
  CheckCircle,
  ArrowRight,
  Clock,
  BookOpen,
  Download,
  Sparkles,
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

      <div className="relative mx-auto max-w-4xl px-4 py-8 md:px-6 md:py-16">
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

          {/* Product Showcase */}
          <div className="mb-8 text-center">
            <div className="inline-flex items-center gap-4 rounded-xl border border-yellow-500/30 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 px-6 py-5 backdrop-blur-sm md:px-8 md:py-6">
              <BookOpen className="h-10 w-10 text-yellow-400 md:h-14 md:w-14" />
              <div className="text-left">
                <div className="mb-1 inline-block rounded bg-gradient-to-r from-yellow-400 to-orange-500 px-2 py-0.5 text-xs font-black uppercase text-black">
                  2026 Edition
                </div>
                <h3 className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-2xl font-black text-transparent md:text-3xl">
                  $10M Personal Brand Blueprint
                </h3>
                <p className="text-sm text-gray-400">
                  The Missing Piece to Reach $10M
                </p>
              </div>
            </div>
          </div>

          {/* What's Inside */}
          <div className="mb-8 space-y-3">
            <h3 className="mb-4 text-center text-xl font-bold text-white md:text-2xl">
              The Exact 5-Week System:
            </h3>
            <div className="grid gap-3 md:grid-cols-2">
              {[
                { title: 'Week 1', desc: 'Identity & Positioning Strategy' },
                {
                  title: 'Week 2',
                  desc: 'Authority & Hook Psychology',
                },
                { title: 'Week 3', desc: 'Magnetic Social Proof' },
                {
                  title: 'Week 4',
                  desc: 'AI Systems & Monetization',
                },
                { title: 'Week 5', desc: '$10M Daily Discipline' },
                {
                  title: 'BONUS',
                  desc: 'Copy-Paste AI Prompt Library',
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2 rounded-lg border border-yellow-500/20 bg-yellow-500/5 p-3 backdrop-blur-sm transition-all hover:border-yellow-500/40"
                >
                  <Sparkles className="mt-0.5 h-4 w-4 flex-shrink-0 text-yellow-400" />
                  <div>
                    <p className="text-sm font-bold text-white">{item.title}</p>
                    <p className="text-xs text-gray-400">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Price */}
          <div className="mb-8 text-center">
            <p className="mb-3 text-base text-gray-400">Regular Price:</p>
            <div className="mb-4 flex items-center justify-center gap-3 md:gap-4">
              <span className="text-3xl font-black text-gray-600 line-through md:text-4xl">
                $197
              </span>
              <ArrowRight className="h-6 w-6 text-yellow-400 md:h-7 md:w-7" />
              <div className="rounded-xl border-2 border-yellow-500/50 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 px-6 py-3 backdrop-blur-sm md:px-8 md:py-4">
                <p className="mb-1 text-xs font-bold uppercase tracking-wider text-yellow-400">
                  Your Price Today
                </p>
                <p className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-4xl font-black text-transparent md:text-5xl">
                  $17
                </p>
              </div>
            </div>
            <p className="text-lg font-bold text-yellow-400">
              91% OFF - This Page Only
            </p>
          </div>

          {/* Urgency */}
          <div className="mb-8 rounded-xl border border-yellow-500/30 bg-yellow-500/5 p-5 text-center backdrop-blur-sm">
            <div className="mb-2 flex items-center justify-center gap-2">
              <Clock className="h-5 w-5 animate-pulse text-yellow-400" />
              <h3 className="text-base font-black text-yellow-400 md:text-lg">
                This Offer Expires When You Leave
              </h3>
            </div>
            <p className="text-sm text-gray-300 md:text-base">
              Click "No thanks" below and this goes back to $197 forever
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
                      YES! Add $10M Blueprint for $17
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
                No thanks, I'll pass on this offer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
