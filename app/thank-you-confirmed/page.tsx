'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import {
  CheckCircle,
  Mail,
  Download,
  Play,
  ArrowRight,
  Sparkles,
} from 'lucide-react'
import { trackPurchase, trackCompleteRegistration } from '../utils/tracking'

export default function ThankYouPage() {
  const [orderTracked, setOrderTracked] = useState(false)
  const [upsellPurchase, setUpsellPurchase] = useState<string | null>(null)

  useEffect(() => {
    // Check if they purchased the upsell
    const urlParams = new URLSearchParams(window.location.search)
    const upsell = urlParams.get('upsell')
    setUpsellPurchase(upsell)

    // Only track once per page load
    if (!orderTracked) {
      const orderId = urlParams.get('session_id') || `order_${Date.now()}`

      // Calculate total amount based on upsell purchase
      let totalAmount = 37.0
      if (upsell === 'blueprint17') {
        totalAmount = 37.0 + 17.0 // $54 total
      } else if (upsell === 'blueprint7') {
        totalAmount = 37.0 + 7.0 // $44 total
      }

      // Fire both Purchase and CompleteRegistration events
      trackPurchase(orderId, totalAmount)
      trackCompleteRegistration(orderId)

      // Fire Google Ads conversion event
      if (typeof window !== 'undefined' && (window as any).gtag) {
        ;(window as any).gtag('event', 'conversion', {
          send_to: 'AW-17695777512/SvceCMjX-7cbEOjFgPZB',
          value: totalAmount,
          currency: 'USD',
          transaction_id: orderId,
        })
        console.log('✅ Google Ads conversion fired:', orderId, totalAmount)
      }

      setOrderTracked(true)

      // Log for debugging
      console.log('✅ Purchase tracking fired:', orderId, 'Total:', totalAmount)
    }
  }, [orderTracked])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      {/* Confetti/Celebration Effect */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 h-96 w-96 animate-pulse rounded-full bg-yellow-500/20 blur-3xl" />
        <div className="absolute right-1/4 bottom-1/4 h-96 w-96 animate-pulse rounded-full bg-green-500/20 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-4xl px-4 py-12 md:py-20">
        {/* Success Icon */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="flex h-32 w-32 animate-bounce items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-green-600 shadow-2xl">
              <CheckCircle className="h-16 w-16 text-white" />
            </div>
            <div className="absolute inset-0 animate-pulse rounded-full bg-green-500 opacity-50 blur-xl" />
          </div>
        </div>

        {/* Main Heading */}
        <h1 className="mb-6 bg-gradient-to-r from-yellow-400 via-green-400 to-yellow-400 bg-clip-text text-center text-4xl font-black text-transparent md:text-6xl">
          🎉 Welcome to AI FastScale!
        </h1>

        <p className="mx-auto mb-12 max-w-2xl text-center text-xl text-gray-300 md:text-2xl">
          Your payment was successful! Get ready to create your first{' '}
          <span className="font-black text-yellow-400">
            7-Minute AgentClone™
          </span>{' '}
          video.
        </p>

        {/* Order Confirmation */}
        <div className="mb-12 rounded-2xl border border-green-500/30 bg-gradient-to-br from-gray-800 to-gray-900 p-8 shadow-2xl">
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white">
                Order Confirmed
              </h2>
              <p className="text-gray-400">Receipt sent to your email</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between border-b border-gray-700 py-3">
              <span className="text-gray-400">Product</span>
              <div className="text-right">
                <p className="font-bold text-white">
                  7 Minute AgentClone™ Course
                </p>
                {upsellPurchase && (
                  <p className="mt-1 font-bold text-yellow-400">
                    + $10M Personal Brand Blueprint ⭐
                  </p>
                )}
              </div>
            </div>
            <div className="flex justify-between border-b border-gray-700 py-3">
              <span className="text-gray-400">Amount Paid</span>
              <div className="text-right">
                {upsellPurchase ? (
                  <>
                    <p className="font-bold text-green-400">
                      $
                      {upsellPurchase === 'blueprint17'
                        ? '54.00'
                        : upsellPurchase === 'blueprint7'
                          ? '44.00'
                          : '37.00'}{' '}
                      USD
                    </p>
                    <p className="text-xs text-gray-400">
                      ($37 + ${upsellPurchase === 'blueprint17' ? '17' : '7'})
                    </p>
                  </>
                ) : (
                  <p className="font-bold text-green-400">$37.00 USD</p>
                )}
              </div>
            </div>
            <div className="flex justify-between py-3">
              <span className="text-gray-400">Status</span>
              <span className="flex items-center gap-2 font-bold text-green-400">
                <CheckCircle className="h-4 w-4" /> Completed
              </span>
            </div>
          </div>
        </div>

        {/* Lifetime Access Notice - PROMINENT */}
        <div className="mb-12 rounded-2xl border-2 border-purple-500/50 bg-gradient-to-br from-purple-900/30 to-blue-900/30 p-8 shadow-2xl">
          <div className="mb-4 flex items-center justify-center gap-3">
            <Sparkles className="h-8 w-8 animate-pulse text-purple-400" />
            <h2 className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-center text-3xl font-black text-transparent">
              🎁 Lifetime Access + Free Updates!
            </h2>
            <Sparkles className="h-8 w-8 animate-pulse text-purple-400" />
          </div>
          <p className="mb-4 text-center text-xl font-semibold text-gray-200">
            You now have{' '}
            <span className="font-black text-purple-400">LIFETIME ACCESS</span>{' '}
            to all course materials!
          </p>
          <div className="rounded-xl border border-purple-500/30 bg-purple-500/10 p-6 text-center">
            <p className="mb-2 text-lg text-gray-300">
              ✨{' '}
              <span className="font-bold text-white">Free monthly updates</span>{' '}
              with new templates, prompts, and AI workflows
            </p>
            <p className="text-base font-semibold text-purple-300">
              📅 Check back every month for the latest updates - Always FREE!
            </p>
          </div>
        </div>

        {/* Download Button - BIG AND PROMINENT */}
        <div className="mb-12 rounded-2xl border-2 border-yellow-500/50 bg-gradient-to-br from-yellow-900/20 to-orange-900/20 p-8 text-center">
          <h2 className="mb-6 text-3xl font-black text-yellow-400 md:text-4xl">
            📥 Download Your Course Materials Now!
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-300">
            All templates, system prompts, video workflows, and training
            materials are ready for instant download.
          </p>
          <a
            href="https://drive.google.com/drive/folders/1YLkKPgtU_q1BV6PVISO4VEru1UkAldw1?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-4 rounded-2xl bg-gradient-to-r from-green-500 to-green-600 px-12 py-6 text-2xl font-black text-white shadow-2xl transition-all duration-300 hover:scale-105 hover:from-green-600 hover:to-green-700 hover:shadow-green-500/50"
          >
            <Download className="h-8 w-8" />
            DOWNLOAD AGENTCLONE COURSE
            <ArrowRight className="h-8 w-8" />
          </a>
          <p className="mt-4 text-sm text-gray-400">
            Opens in Google Drive • All files included
          </p>
        </div>

        {/* Blueprint Download - Only show if they bought the upsell */}
        {upsellPurchase && (
          <div className="mb-12 rounded-2xl border-2 border-purple-500/50 bg-gradient-to-br from-purple-900/30 to-blue-900/30 p-8 text-center shadow-2xl">
            <div className="mb-4 flex items-center justify-center gap-2">
              <Sparkles className="h-8 w-8 animate-pulse text-purple-400" />
              <h2 className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-3xl font-black text-transparent md:text-4xl">
                🎁 BONUS: Your $10M Blueprint is Ready!
              </h2>
              <Sparkles className="h-8 w-8 animate-pulse text-purple-400" />
            </div>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-300">
              Congratulations! You also purchased the complete{' '}
              <span className="font-black text-purple-400">
                $10M Personal Brand Blueprint (2026 Edition)
              </span>
              . Download it now and start building your authority brand today!
            </p>
            <a
              href="/downloads/10m-personal-brand-blueprint-2026.pdf"
              download="10M-Personal-Brand-Blueprint-2026.pdf"
              className="inline-flex items-center gap-4 rounded-2xl bg-gradient-to-r from-purple-500 to-blue-500 px-12 py-6 text-2xl font-black text-white shadow-2xl transition-all duration-300 hover:scale-105 hover:from-purple-600 hover:to-blue-600 hover:shadow-purple-500/50"
            >
              <Download className="h-8 w-8" />
              DOWNLOAD $10M BLUEPRINT PDF
              <ArrowRight className="h-8 w-8" />
            </a>
            <p className="mt-4 text-sm text-gray-400">
              Instant PDF Download • 641KB • Keep Forever
            </p>
            <div className="mt-6 rounded-xl border border-purple-500/30 bg-purple-500/10 p-4">
              <p className="text-base font-semibold text-purple-300">
                ⭐ You saved{' '}
                {upsellPurchase === 'blueprint17' ? '$180' : '$190'} today! (
                {upsellPurchase === 'blueprint17' ? '91%' : '96%'} OFF)
              </p>
            </div>
          </div>
        )}

        {/* Next Steps */}
        <div className="mb-12 rounded-2xl border border-gray-700/30 bg-gradient-to-br from-gray-800/50 to-gray-900/50 p-8">
          <h2 className="mb-8 text-center text-3xl font-black text-white">
            What Happens Next?
          </h2>

          <div className="space-y-6">
            {/* Step 1 */}
            <div className="flex gap-4">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 text-xl font-black text-black">
                1
              </div>
              <div>
                <h3 className="mb-2 flex items-center gap-2 text-xl font-bold text-white">
                  <Download className="h-5 w-5 text-yellow-400" />
                  Download All Course Materials
                </h3>
                <p className="text-gray-300">
                  Click the big green button above to access your Google Drive
                  folder with all templates, prompts, and training videos.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-4">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 text-xl font-black text-black">
                2
              </div>
              <div>
                <h3 className="mb-2 flex items-center gap-2 text-xl font-bold text-white">
                  <Play className="h-5 w-5 text-yellow-400" />
                  Create Your First Video (7 Minutes!)
                </h3>
                <p className="text-gray-300">
                  Follow the step-by-step blueprint to turn a photo into your
                  first talking AI video. Takes only 7 minutes!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Important Reminder */}
        <div className="mb-12 rounded-2xl border-2 border-green-500/50 bg-gradient-to-br from-green-900/20 to-green-800/20 p-8">
          <h3 className="mb-4 text-center text-2xl font-black text-green-400">
            💚 Protected by Our 30-Day Money-Back Guarantee
          </h3>
          <p className="mx-auto max-w-2xl text-center text-gray-300">
            If you don't generate quality leads within 30 days, simply email us
            at{' '}
            <a
              href="mailto:support@aifastscale.com"
              className="font-bold text-yellow-400 hover:text-yellow-300"
            >
              support@aifastscale.com
            </a>{' '}
            for a full refund. No questions asked.
          </p>
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <a
            href="mailto:support@aifastscale.com?subject=Course%20Access%20-%20Thank%20You%20Page"
            className="inline-flex items-center gap-3 rounded-xl bg-gradient-to-r from-yellow-400 to-orange-500 px-8 py-4 text-xl font-black text-black shadow-2xl transition-transform duration-300 hover:scale-105"
          >
            Need Help? Contact Support
            <ArrowRight className="h-6 w-6" />
          </a>
        </div>

        {/* Footer Message */}
        <p className="mt-12 text-center text-sm text-gray-500">
          Questions? Email us at{' '}
          <a
            href="mailto:support@aifastscale.com"
            className="text-yellow-400 hover:text-yellow-300"
          >
            support@aifastscale.com
          </a>
        </p>
      </div>
    </div>
  )
}
