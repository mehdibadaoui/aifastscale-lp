'use client'

import React, { useEffect, useState } from 'react'
import {
  CheckCircle,
  Download,
  Play,
  ArrowRight,
  Shield,
} from 'lucide-react'
import { trackPurchase, trackCompleteRegistration } from '../utils/tracking'
import EmailOptInModal from '../components/EmailOptInModal'
import UpsellOffer from '../components/UpsellOffer'

export default function ThankYouPage() {
  const [orderTracked, setOrderTracked] = useState(false)
  const [upsellPurchase, setUpsellPurchase] = useState<string | null>(null)
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [showUpsell, setShowUpsell] = useState(false)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const upsell = urlParams.get('upsell')
    const session = urlParams.get('session_id')

    setUpsellPurchase(upsell)
    setSessionId(session)

    // TEMPORARY: Disable upsell while using Whop (no 1-click upsells available)
    // To restore Stripe upsell/downsell: See /BACKUP-ORIGINAL-STRIPE-SETUP.md
    if (session && !upsell) {
      setShowUpsell(false) // CHANGED: was true, now false to hide upsell
      setShowEmailModal(true) // CHANGED: was false, now true to show email modal instead
    } else {
      setShowUpsell(false)
      setShowEmailModal(true)
    }

    if (!orderTracked) {
      const orderId = session || `order_${Date.now()}`

      let totalAmount = 37.0
      if (upsell === 'blueprint17') {
        totalAmount = 37.0 + 17.0
      } else if (upsell === 'blueprint7') {
        totalAmount = 37.0 + 7.0
      }

      trackPurchase(orderId, totalAmount)
      trackCompleteRegistration(orderId)

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
      console.log('✅ Purchase tracking fired:', orderId, 'Total:', totalAmount)
    }
  }, [orderTracked])

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-4xl px-4 py-12 md:py-20">
        {/* Success Icon - Gold & Black Branding */}
        <div className="mb-8 flex justify-center md:mb-10">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 shadow-lg md:h-24 md:w-24">
            <CheckCircle className="h-10 w-10 text-black md:h-12 md:w-12" />
          </div>
        </div>

        {/* Main Heading - Professional */}
        <h1 className="mb-4 text-center text-3xl font-bold text-gray-900 md:mb-5 md:text-5xl">
          Your Order is Confirmed
        </h1>

        <p className="mx-auto mb-10 max-w-2xl text-center text-lg text-gray-600 md:mb-12 md:text-xl">
          Thank you for your purchase. Your course materials are ready for immediate access.
        </p>

        {/* Order Confirmation - Clean White Card */}
        <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm md:mb-10 md:p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 md:h-12 md:w-12">
              <CheckCircle className="h-5 w-5 text-black md:h-6 md:w-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 md:text-xl">
                Order Confirmed
              </h2>
              <p className="text-sm text-gray-500 md:text-base">
                Receipt sent to your email
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between border-b border-gray-200 pb-3">
              <span className="text-sm text-gray-600 md:text-base">
                Product
              </span>
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900 md:text-base">
                  7 Minute AgentClone™ Course
                </p>
                {upsellPurchase && (
                  <p className="mt-1 text-sm font-semibold text-orange-600 md:text-base">
                    + $10M Personal Brand Blueprint
                  </p>
                )}
              </div>
            </div>
            <div className="flex justify-between border-b border-gray-200 pb-3">
              <span className="text-sm text-gray-600 md:text-base">
                Amount Paid
              </span>
              <div className="text-right">
                {upsellPurchase ? (
                  <>
                    <p className="text-lg font-bold text-gray-900 md:text-xl">
                      $
                      {upsellPurchase === 'blueprint17'
                        ? '54.00'
                        : upsellPurchase === 'blueprint7'
                          ? '44.00'
                          : '37.00'}{' '}
                      USD
                    </p>
                    <p className="text-xs text-gray-500">
                      ($37 + ${upsellPurchase === 'blueprint17' ? '17' : '7'})
                    </p>
                  </>
                ) : (
                  <p className="text-lg font-bold text-gray-900 md:text-xl">
                    $37.00 USD
                  </p>
                )}
              </div>
            </div>
            <div className="flex justify-between pt-3">
              <span className="text-sm text-gray-600 md:text-base">Status</span>
              <span className="flex items-center gap-2 text-sm font-semibold text-green-600 md:text-base">
                <CheckCircle className="h-4 w-4" /> Completed
              </span>
            </div>
          </div>
        </div>

        {/* Lifetime Access Notice - Subtle Professional */}
        <div className="mb-8 rounded-lg border border-orange-200 bg-orange-50 p-6 text-center md:mb-10 md:p-8">
          <h2 className="mb-3 text-2xl font-bold text-gray-900 md:mb-4 md:text-3xl">
            Lifetime Access Included
          </h2>
          <p className="mb-4 text-base text-gray-700 md:text-lg">
            You now have permanent access to all course materials, including future updates.
          </p>
          <div className="rounded-lg border border-orange-300 bg-white p-4 md:p-5">
            <p className="mb-2 text-sm text-gray-700 md:text-base">
              <span className="font-semibold text-gray-900">Complimentary monthly updates</span> with new templates, prompts, and workflows
            </p>
            <p className="text-sm font-semibold text-orange-600">
              No additional fees — ever.
            </p>
          </div>
        </div>

        {/* Download Button - Professional Navy */}
        <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 text-center shadow-sm md:mb-10 md:p-8">
          <h2 className="mb-4 text-2xl font-bold text-gray-900 md:mb-5 md:text-3xl">
            Access Your Course Materials
          </h2>
          <p className="mx-auto mb-6 max-w-2xl text-sm text-gray-600 md:mb-8 md:text-base">
            All templates, system prompts, video workflows, and training materials are ready for instant access.
          </p>
          <a
            href="https://drive.google.com/drive/folders/1YLkKPgtU_q1BV6PVISO4VEru1UkAldw1?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 rounded-lg bg-gradient-to-r from-yellow-500 to-orange-500 px-8 py-4 text-lg font-bold text-black shadow-lg transition-all hover:from-yellow-400 hover:to-orange-400 hover:shadow-xl md:gap-4 md:px-10 md:py-5 md:text-xl"
          >
            <Download className="h-6 w-6 md:h-7 md:w-7" />
            Download Course Materials
            <ArrowRight className="h-6 w-6 transition-transform group-hover:translate-x-1 md:h-7 md:w-7" />
          </a>
          <p className="mt-4 text-xs text-gray-500 md:text-sm">
            Opens in Google Drive • All files included
          </p>
        </div>

        {/* Blueprint Download - Only if purchased */}
        {upsellPurchase && (
          <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 text-center shadow-sm md:mb-10 md:p-8">
            <h2 className="mb-4 text-2xl font-bold text-gray-900 md:mb-5 md:text-3xl">
              Bonus: $10M Personal Brand Blueprint
            </h2>
            <p className="mx-auto mb-6 max-w-2xl text-sm text-gray-600 md:mb-8 md:text-base">
              You also purchased the complete{' '}
              <span className="font-semibold text-orange-600">
                $10M Personal Brand Blueprint (2026 Edition)
              </span>
              . Download it now and start building your authority brand.
            </p>
            <a
              href="/downloads/10m-personal-brand-blueprint-2026.pdf"
              download="10M-Personal-Brand-Blueprint-2026.pdf"
              className="group inline-flex items-center gap-3 rounded-lg bg-gradient-to-r from-yellow-500 to-orange-500 px-8 py-4 text-lg font-bold text-black shadow-lg transition-all hover:from-yellow-400 hover:to-orange-400 hover:shadow-xl md:gap-4 md:px-10 md:py-5 md:text-xl"
            >
              <Download className="h-6 w-6 md:h-7 md:w-7" />
              Download Blueprint PDF
              <ArrowRight className="h-6 w-6 transition-transform group-hover:translate-x-1 md:h-7 md:w-7" />
            </a>
            <p className="mt-4 text-xs text-gray-500 md:text-sm">
              Instant PDF Download • 641KB
            </p>
            <div className="mt-5 rounded-lg border border-orange-200 bg-orange-50 p-3 md:mt-6 md:p-4">
              <p className="text-sm font-semibold text-orange-600 md:text-base">
                You saved {upsellPurchase === 'blueprint17' ? '$180' : '$190'} today ({upsellPurchase === 'blueprint17' ? '91%' : '96%'} off)
              </p>
            </div>
          </div>
        )}

        {/* Next Steps - Clean Professional */}
        <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm md:mb-10 md:p-8">
          <h2 className="mb-6 text-center text-2xl font-bold text-gray-900 md:mb-8 md:text-3xl">
            Getting Started
          </h2>

          <div className="space-y-5 md:space-y-6">
            {/* Step 1 */}
            <div className="flex gap-3 md:gap-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 text-lg font-bold text-black md:h-12 md:w-12 md:text-xl">
                1
              </div>
              <div>
                <h3 className="mb-2 flex items-center gap-2 text-lg font-semibold text-gray-900 md:text-xl">
                  <Download className="h-5 w-5 text-orange-600" />
                  Download Course Materials
                </h3>
                <p className="text-sm text-gray-600 md:text-base">
                  Access your Google Drive folder with all templates, prompts, and training videos using the download button above.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-3 md:gap-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 text-lg font-bold text-black md:h-12 md:w-12 md:text-xl">
                2
              </div>
              <div>
                <h3 className="mb-2 flex items-center gap-2 text-lg font-semibold text-gray-900 md:text-xl">
                  <Play className="h-5 w-5 text-orange-600" />
                  Create Your First Video
                </h3>
                <p className="text-sm text-gray-600 md:text-base">
                  Follow the step-by-step blueprint to create your first AI-powered video in approximately 7 minutes.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Guarantee - Professional */}
        <div className="mb-8 rounded-lg border border-gray-200 bg-gray-50 p-6 text-center md:mb-10 md:p-8">
          <div className="mb-3 flex items-center justify-center gap-2 md:mb-4">
            <Shield className="h-6 w-6 text-orange-600 md:h-7 md:w-7" />
            <h3 className="text-xl font-bold text-gray-900 md:text-2xl">
              30-Day Money-Back Guarantee
            </h3>
          </div>
          <p className="mx-auto max-w-2xl text-sm text-gray-600 md:text-base">
            If you don't achieve your desired results within 30 days, contact us at{' '}
            <a
              href="mailto:support@aifastscale.com"
              className="font-semibold text-orange-600 hover:text-orange-700"
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
            className="inline-flex items-center gap-3 rounded-lg border border-gray-300 bg-white px-6 py-3 text-base font-semibold text-gray-700 shadow-sm transition-all hover:border-gray-400 hover:bg-gray-50 md:px-8 md:py-4 md:text-lg"
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
            className="text-orange-600 hover:text-orange-700"
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
