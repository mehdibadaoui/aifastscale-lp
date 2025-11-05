'use client'

import React, { useEffect, useState } from 'react'
import {
  CheckCircle,
  Download,
  Play,
  ArrowRight,
  Sparkles,
  Shield,
} from 'lucide-react'
import { trackPurchase, trackCompleteRegistration } from '../utils/tracking'
import EmailOptInModal from '../components/EmailOptInModal'
import UpsellOffer from '../components/UpsellOffer'

export default function ThankYouPage() {
  const [orderTracked, setOrderTracked] = useState(false)
  const [upsellPurchase, setUpsellPurchase] = useState<string | null>(null)
  const [showEmailModal, setShowEmailModal] = useState(false) // Start false, will show after upsell
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [showUpsell, setShowUpsell] = useState(false)

  useEffect(() => {
    // Check if they purchased the upsell
    const urlParams = new URLSearchParams(window.location.search)
    const upsell = urlParams.get('upsell')
    const session = urlParams.get('session_id')

    setUpsellPurchase(upsell)
    setSessionId(session)

    // Determine if we should show upsell offer
    // Show upsell if: has session_id AND no upsell purchased yet
    if (session && !upsell) {
      setShowUpsell(true)
      setShowEmailModal(false)
    } else {
      // If they already purchased upsell OR no session_id, show email modal
      setShowUpsell(false)
      setShowEmailModal(true)
    }

    // Only track once per page load
    if (!orderTracked) {
      const orderId = session || `order_${Date.now()}`

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
          send_to: 'AW-17695777512/4w-dCPm-0rkbEOjFgPZB',
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
    <div className="min-h-screen bg-black text-white">
      {/* Celebration background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/4 top-1/4 h-96 w-96 animate-pulse rounded-full bg-yellow-500/10 blur-3xl" />
        <div className="delay-500 absolute right-1/4 bottom-1/4 h-96 w-96 animate-pulse rounded-full bg-orange-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-4xl px-4 py-8 md:py-16">
        {/* Success Icon */}
        <div className="mb-6 flex justify-center md:mb-8">
          <div className="relative">
            <div className="flex h-24 w-24 animate-bounce items-center justify-center rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 shadow-2xl md:h-32 md:w-32">
              <CheckCircle className="h-12 w-12 text-black md:h-16 md:w-16" />
            </div>
            <div className="absolute inset-0 animate-pulse rounded-full bg-yellow-400 opacity-50 blur-xl" />
          </div>
        </div>

        {/* Main Heading */}
        <h1 className="mb-4 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-center text-4xl font-black text-transparent md:mb-6 md:text-6xl">
          Welcome to AI FastScale!
        </h1>

        <p className="mx-auto mb-8 max-w-2xl text-center text-lg font-semibold text-gray-300 md:mb-12 md:text-xl">
          Your payment was successful! Get ready to create your first{' '}
          <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text font-black text-transparent">
            7-Minute AgentClone™
          </span>{' '}
          video.
        </p>

        {/* Order Confirmation */}
        <div className="mb-8 rounded-2xl border border-yellow-500/20 bg-gradient-to-br from-gray-900 to-black p-6 shadow-2xl backdrop-blur-sm md:mb-12 md:p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 md:h-12 md:w-12">
              <CheckCircle className="h-5 w-5 text-black md:h-6 md:w-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white md:text-2xl">
                Order Confirmed
              </h2>
              <p className="text-sm text-gray-400 md:text-base">
                Receipt sent to your email
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between border-b border-gray-700 pb-3">
              <span className="text-sm text-gray-400 md:text-base">
                Product
              </span>
              <div className="text-right">
                <p className="text-sm font-bold text-white md:text-base">
                  7 Minute AgentClone™ Course
                </p>
                {upsellPurchase && (
                  <p className="mt-1 text-sm font-bold text-yellow-400 md:text-base">
                    + $10M Personal Brand Blueprint
                  </p>
                )}
              </div>
            </div>
            <div className="flex justify-between border-b border-gray-700 pb-3">
              <span className="text-sm text-gray-400 md:text-base">
                Amount Paid
              </span>
              <div className="text-right">
                {upsellPurchase ? (
                  <>
                    <p className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-lg font-black text-transparent md:text-xl">
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
                  <p className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-lg font-black text-transparent md:text-xl">
                    $37.00 USD
                  </p>
                )}
              </div>
            </div>
            <div className="flex justify-between pt-3">
              <span className="text-sm text-gray-400 md:text-base">Status</span>
              <span className="flex items-center gap-2 text-sm font-bold text-green-400 md:text-base">
                <CheckCircle className="h-4 w-4" /> Completed
              </span>
            </div>
          </div>
        </div>

        {/* Lifetime Access Notice */}
        <div className="mb-8 rounded-2xl border border-yellow-500/30 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 p-6 text-center backdrop-blur-sm md:mb-12 md:p-8">
          <div className="mb-3 flex items-center justify-center gap-2 md:mb-4">
            <Sparkles className="h-6 w-6 animate-pulse text-yellow-400 md:h-8 md:w-8" />
            <h2 className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-2xl font-black text-transparent md:text-3xl">
              Lifetime Access + Free Updates!
            </h2>
            <Sparkles className="h-6 w-6 animate-pulse text-yellow-400 md:h-8 md:w-8" />
          </div>
          <p className="mb-4 text-base font-semibold text-gray-200 md:text-lg">
            You now have{' '}
            <span className="font-black text-yellow-400">LIFETIME ACCESS</span>{' '}
            to all course materials!
          </p>
          <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-4 backdrop-blur-sm md:p-5">
            <p className="mb-2 text-sm text-gray-300 md:text-base">
              <span className="font-bold text-white">Free monthly updates</span>{' '}
              with new templates, prompts, and AI workflows
            </p>
            <p className="text-sm font-semibold text-yellow-400">
              Check back every month - Always FREE!
            </p>
          </div>
        </div>

        {/* Download Button */}
        <div className="mb-8 rounded-2xl border border-yellow-500/30 bg-gradient-to-br from-yellow-500/5 to-orange-500/5 p-6 text-center backdrop-blur-sm md:mb-12 md:p-8">
          <h2 className="mb-4 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-2xl font-black text-transparent md:mb-6 md:text-3xl">
            Download Your Course Materials Now!
          </h2>
          <p className="mx-auto mb-6 max-w-2xl text-sm text-gray-300 md:mb-8 md:text-base">
            All templates, system prompts, video workflows, and training
            materials are ready for instant download.
          </p>
          <a
            href="https://drive.google.com/drive/folders/1YLkKPgtU_q1BV6PVISO4VEru1UkAldw1?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center gap-3 overflow-hidden rounded-xl p-0.5 transition-all hover:scale-105 md:gap-4"
          >
            <div className="absolute -inset-1 animate-pulse rounded-xl bg-gradient-to-r from-yellow-400 to-orange-500 opacity-75 blur transition group-hover:opacity-100"></div>
            <div className="relative flex items-center gap-3 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 px-8 py-4 text-lg font-black text-black md:gap-4 md:px-10 md:py-5 md:text-xl">
              <Download className="h-6 w-6 md:h-7 md:w-7" />
              DOWNLOAD AGENTCLONE COURSE
              <ArrowRight className="h-6 w-6 transition-transform group-hover:translate-x-1 md:h-7 md:w-7" />
            </div>
          </a>
          <p className="mt-3 text-xs text-gray-400 md:mt-4 md:text-sm">
            Opens in Google Drive • All files included
          </p>
        </div>

        {/* Blueprint Download - Only if purchased */}
        {upsellPurchase && (
          <div className="mb-8 rounded-2xl border border-yellow-500/30 bg-gradient-to-br from-yellow-500/5 to-orange-500/5 p-6 text-center backdrop-blur-sm md:mb-12 md:p-8">
            <div className="mb-4 flex items-center justify-center gap-2 md:mb-5">
              <Sparkles className="h-6 w-6 animate-pulse text-yellow-400 md:h-7 md:w-7" />
              <h2 className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-2xl font-black text-transparent md:text-3xl">
                BONUS: Your $10M Blueprint!
              </h2>
              <Sparkles className="h-6 w-6 animate-pulse text-yellow-400 md:h-7 md:w-7" />
            </div>
            <p className="mx-auto mb-6 max-w-2xl text-sm text-gray-300 md:mb-8 md:text-base">
              You also purchased the complete{' '}
              <span className="font-black text-yellow-400">
                $10M Personal Brand Blueprint (2026 Edition)
              </span>
              . Download it now and start building your authority brand!
            </p>
            <a
              href="/downloads/10m-personal-brand-blueprint-2026.pdf"
              download="10M-Personal-Brand-Blueprint-2026.pdf"
              className="group relative inline-flex items-center gap-3 overflow-hidden rounded-xl p-0.5 transition-all hover:scale-105 md:gap-4"
            >
              <div className="absolute -inset-1 animate-pulse rounded-xl bg-gradient-to-r from-yellow-400 to-orange-500 opacity-75 blur transition group-hover:opacity-100"></div>
              <div className="relative flex items-center gap-3 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 px-8 py-4 text-lg font-black text-black md:gap-4 md:px-10 md:py-5 md:text-xl">
                <Download className="h-6 w-6 md:h-7 md:w-7" />
                DOWNLOAD $10M BLUEPRINT PDF
                <ArrowRight className="h-6 w-6 transition-transform group-hover:translate-x-1 md:h-7 md:w-7" />
              </div>
            </a>
            <p className="mt-3 text-xs text-gray-400 md:mt-4 md:text-sm">
              Instant PDF Download • 641KB
            </p>
            <div className="mt-5 rounded-xl border border-yellow-500/20 bg-yellow-500/10 p-3 backdrop-blur-sm md:mt-6 md:p-4">
              <p className="text-sm font-semibold text-yellow-400 md:text-base">
                You saved {upsellPurchase === 'blueprint17' ? '$180' : '$190'}{' '}
                today! ({upsellPurchase === 'blueprint17' ? '91%' : '96%'} OFF)
              </p>
            </div>
          </div>
        )}

        {/* Next Steps */}
        <div className="mb-8 rounded-2xl border border-yellow-500/20 bg-gradient-to-br from-gray-900 to-black p-6 backdrop-blur-sm md:mb-12 md:p-8">
          <h2 className="mb-6 text-center text-2xl font-black text-white md:mb-8 md:text-3xl">
            What Happens Next?
          </h2>

          <div className="space-y-5 md:space-y-6">
            {/* Step 1 */}
            <div className="flex gap-3 md:gap-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-lg font-black text-black md:h-12 md:w-12 md:text-xl">
                1
              </div>
              <div>
                <h3 className="mb-2 flex items-center gap-2 text-lg font-bold text-white md:text-xl">
                  <Download className="h-5 w-5 text-yellow-400" />
                  Download All Course Materials
                </h3>
                <p className="text-sm text-gray-300 md:text-base">
                  Click the big button above to access your Google Drive folder
                  with all templates, prompts, and training videos.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-3 md:gap-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-lg font-black text-black md:h-12 md:w-12 md:text-xl">
                2
              </div>
              <div>
                <h3 className="mb-2 flex items-center gap-2 text-lg font-bold text-white md:text-xl">
                  <Play className="h-5 w-5 text-yellow-400" />
                  Create Your First Video (7 Minutes!)
                </h3>
                <p className="text-sm text-gray-300 md:text-base">
                  Follow the step-by-step blueprint to turn a photo into your
                  first talking AI video. Takes only 7 minutes!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Guarantee */}
        <div className="mb-8 rounded-2xl border border-green-500/30 bg-green-500/10 p-6 text-center backdrop-blur-sm md:mb-12 md:p-8">
          <div className="mb-3 flex items-center justify-center gap-2 md:mb-4">
            <Shield className="h-6 w-6 text-green-400 md:h-7 md:w-7" />
            <h3 className="text-xl font-black text-green-400 md:text-2xl">
              30-Day Money-Back Guarantee
            </h3>
          </div>
          <p className="mx-auto max-w-2xl text-sm text-gray-300 md:text-base">
            If you don't generate quality leads within 30 days, email us at{' '}
            <a
              href="mailto:support@aifastscale.com"
              className="font-bold text-yellow-400 hover:text-yellow-300"
            >
              support@aifastscale.com
            </a>{' '}
            for a full refund. No questions asked.
          </p>
        </div>

        {/* Support Button */}
        <div className="text-center">
          <a
            href="mailto:support@aifastscale.com?subject=Course%20Access"
            className="inline-flex items-center gap-3 rounded-xl border border-yellow-500/30 bg-yellow-500/10 px-6 py-3 text-base font-bold text-yellow-400 backdrop-blur-sm transition-all hover:scale-105 hover:border-yellow-500/50 hover:bg-yellow-500/20 md:px-8 md:py-4 md:text-lg"
          >
            Need Help? Contact Support
            <ArrowRight className="h-5 w-5 md:h-6 md:w-6" />
          </a>
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-xs text-gray-500 md:mt-12 md:text-sm">
          Questions? Email{' '}
          <a
            href="mailto:support@aifastscale.com"
            className="text-yellow-400 hover:text-yellow-300"
          >
            support@aifastscale.com
          </a>
        </p>
      </div>

      {/* Upsell Offer - Shows first if they just purchased course */}
      {showUpsell && (
        <UpsellOffer
          sessionId={sessionId}
          onUpsellPurchased={(upsellType) => {
            console.log('Upsell purchased:', upsellType)
            // Page will reload with ?upsell= parameter, so email modal will show automatically
          }}
          onDismiss={() => {
            console.log('Upsell dismissed - showing email modal')
            setShowUpsell(false)
            setShowEmailModal(true)
          }}
        />
      )}

      {/* Email Opt-In Modal - Shows after upsell is dismissed or purchased */}
      <EmailOptInModal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
      />
    </div>
  )
}
