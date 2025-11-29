'use client'

import { CheckCircle, Copy, Star } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense, useState, useEffect } from 'react'

// Declare fbq for TypeScript
declare global {
  interface Window {
    fbq?: (...args: any[]) => void
  }
}

function ThankYouContent() {
  const searchParams = useSearchParams()
  const purchased = searchParams.get('purchased')
  const [copied, setCopied] = useState(false)

  const password = "im the best agent in the world"

  // Fire Facebook Pixel Purchase event
  useEffect(() => {
    if (typeof window !== 'undefined' && window.fbq) {
      // Determine purchase value based on what was purchased
      let value = 37.00
      let contentName = '7 Minute AgentClone - Main Product'

      if (purchased === 'upsell') {
        value = 9.95
        contentName = '5 Premium Tools Upsell'
      } else if (purchased === 'downsell') {
        value = 4.97
        contentName = '5 Premium Tools Downsell'
      }

      // Fire the Purchase event
      window.fbq('track', 'Purchase', {
        value: value,
        currency: 'USD',
        content_name: contentName,
        content_type: 'product',
        content_category: 'AI Video Course'
      })

      console.log('Facebook Pixel Purchase event fired:', { value, contentName })
    }
  }, [purchased])

  const copyPassword = () => {
    navigator.clipboard.writeText(password)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#0a1128] to-[#1a1a2e]">
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="mx-auto max-w-3xl">
          {/* Success Icon */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-[#d4af37]/20 blur-xl"></div>
              <CheckCircle className="relative h-20 w-20 text-[#d4af37] md:h-24 md:w-24" />
            </div>
          </div>

          {/* Thank You Message */}
          <div className="mb-8 text-center">
            <h1 className="mb-4 text-4xl font-black text-white md:mb-6 md:text-6xl">
              🎉 Payment Successful! 🎉
            </h1>
            <p className="text-xl font-bold text-white md:text-2xl">
              Welcome to AI FastScale!
            </p>
            <p className="text-gray-300 mt-2">
              Check your email for details (arriving within 60 seconds)
            </p>
          </div>

          {/* PASSWORD & MEMBERS ACCESS - MAIN FOCUS */}
          <div className="mb-8 rounded-2xl bg-gradient-to-br from-[#d4af37]/20 via-[#d4af37]/10 to-transparent border-2 border-[#d4af37] p-6 md:p-8 backdrop-blur-sm">
            <div className="flex items-center justify-center gap-3 mb-6">
              <h2 className="text-2xl font-black text-white md:text-3xl text-center">
                🔐 YOUR MEMBERS AREA ACCESS
              </h2>
            </div>

            {/* Password Display with COPY button */}
            <div className="bg-[#0a0a0a]/60 backdrop-blur-sm rounded-xl p-6 mb-6 border border-white/20">
              <p className="text-center text-[#d4af37] text-sm font-bold uppercase tracking-wide mb-3">
                Your Password:
              </p>

              <div className="bg-gradient-to-r from-[#0a1128] to-[#1a1a2e] rounded-lg p-4 border-2 border-[#d4af37] mb-3">
                <p className="text-center text-[#d4af37] text-xl md:text-2xl font-black break-all">
                  {password}
                </p>
              </div>

              {/* COPY Button - VERY VISIBLE */}
              <button
                onClick={copyPassword}
                className="w-full bg-white/10 hover:bg-white/20 border-2 border-[#d4af37] text-[#d4af37] px-6 py-3 rounded-lg font-bold text-base transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Copy className="w-5 h-5" />
                {copied ? '✓ Copied!' : 'Click to Copy Password'}
              </button>
            </div>

            {/* Members Area Button - HUGE GOLD */}
            <Link
              href="/members"
              className="block w-full"
            >
              <div className="w-full bg-gradient-to-r from-[#d4af37] to-[#f4d03f] text-[#0a0a0a] px-8 py-6 rounded-xl font-black text-xl md:text-2xl transition-all duration-200 shadow-2xl shadow-[#d4af37]/30 hover:scale-[1.02] active:scale-[0.98] text-center">
                <span className="flex items-center justify-center gap-3">
                  <Star className="w-6 h-6" />
                  ENTER MEMBERS AREA →
                  <Star className="w-6 h-6" />
                </span>
              </div>
            </Link>
            <p className="mt-4 text-sm font-semibold text-gray-300 text-center">
              🎁 Access all your bonuses and course materials
            </p>
          </div>

          {/* Quick Steps - Simple */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-white/10">
            <h3 className="text-2xl font-black text-white mb-6 text-center">
              Quick Start (3 Steps):
            </h3>

            <div className="space-y-4">
              <div className="flex gap-4 items-start">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-[#d4af37] to-[#f4d03f] text-lg font-black text-[#0a0a0a]">
                  1
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white mb-1">
                    Copy Your Password
                  </h4>
                  <p className="text-gray-300 text-sm">
                    Click the copy button above to save your password
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-[#d4af37] to-[#f4d03f] text-lg font-black text-[#0a0a0a]">
                  2
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white mb-1">
                    Enter Members Area
                  </h4>
                  <p className="text-gray-300 text-sm">
                    Click the gold button to access all your bonuses
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-[#d4af37] to-[#f4d03f] text-lg font-black text-[#0a0a0a]">
                  3
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white mb-1">
                    Start Creating Videos
                  </h4>
                  <p className="text-gray-300 text-sm">
                    Follow the training to create your first AI video in 7 minutes
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Lifetime Access Notice - Compact */}
          <div className="mt-8 rounded-xl bg-emerald-500/20 border border-emerald-400 p-6 text-center">
            <p className="text-white font-bold text-lg mb-2">
              ✅ Lifetime Access Activated
            </p>
            <p className="text-white/80 text-sm">
              You get lifetime access + all future updates FREE forever
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ThankYouPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#0a1128] to-[#1a1a2e]" />}>
      <ThankYouContent />
    </Suspense>
  )
}
