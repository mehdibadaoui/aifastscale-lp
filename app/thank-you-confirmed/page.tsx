'use client'

import { CheckCircle, Mail, Download, Video, Gift, Sparkles, Shield, Star, FileText } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { GOOGLE_DRIVE, SITE_CONFIG } from '../config/constants'

function ThankYouContent() {
  const searchParams = useSearchParams()
  const purchased = searchParams.get('purchased') // 'oto' or 'downsell' or null

  const hasDFY = purchased === 'oto' || purchased === 'downsell'
  const dfyPrice = purchased === 'oto' ? 63 : purchased === 'downsell' ? 39 : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-deep via-navy-rich to-navy-medium">
      {/* Success Container */}
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="mx-auto max-w-3xl">
          {/* Success Icon */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-gold-premium/20 blur-xl"></div>
              <CheckCircle className="relative h-20 w-20 text-gold-premium md:h-24 md:w-24" />
            </div>
          </div>

          {/* Thank You Message */}
          <div className="mb-8 text-center">
            <h1 className="mb-4 text-gradient-gold text-4xl font-black md:mb-6 md:text-6xl">
              🎉 Payment Successful! 🎉
            </h1>
            <p className="text-xl font-bold text-white md:text-2xl">
              Welcome to AI FastScale - You're In!
            </p>
            <p className="text-gray-300 mt-2">
              Check your email for your login details (arriving within 60 seconds)
            </p>
          </div>

          {/* Black Friday Bonus */}
          <div className="mb-8 rounded-2xl bg-gradient-to-r from-gold-premium/20 to-gold-dark/20 border-2 border-gold-premium p-6 shadow-gold-glow-lg backdrop-blur-sm md:p-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Gift className="w-8 h-8 text-gold-premium" />
              <h2 className="text-2xl font-black text-white md:text-3xl">
                YOUR BLACK FRIDAY BONUS
              </h2>
              <Sparkles className="w-8 h-8 text-gold-premium" />
            </div>
            <p className="text-center text-lg font-semibold text-gray-200 mb-3">
              Don't forget - you unlocked a FREE bonus from the spin wheel!
            </p>
            <p className="text-center text-gold-light">
              It's included in your course materials below ↓
            </p>
          </div>

          {/* Lifetime Access Notice - REDESIGNED */}
          <div className="mb-8 rounded-2xl bg-gradient-to-br from-emerald-500/20 via-green-500/10 to-emerald-600/20 backdrop-blur-md border-2 border-emerald-400 p-6 md:p-8 shadow-2xl shadow-emerald-500/20">
            {/* Header */}
            <div className="flex items-center justify-center gap-3 mb-6">
              <Star className="w-8 h-8 text-emerald-400 fill-emerald-400 animate-pulse" />
              <h2 className="text-2xl font-black text-white md:text-3xl">
                LIFETIME ACCESS ACTIVATED
              </h2>
              <Star className="w-8 h-8 text-emerald-400 fill-emerald-400 animate-pulse" />
            </div>

            {/* Main Benefits */}
            <div className="space-y-4 mb-6">
              {/* Lifetime Access */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-black text-white mb-1">
                      Lifetime Access - Yours Forever
                    </h3>
                    <p className="text-white/80 text-sm">
                      Access all course materials, templates, and bonuses <span className="text-emerald-400 font-bold">forever</span>. No expiration date.
                    </p>
                  </div>
                </div>
              </div>

              {/* Monthly Updates */}
              <div className="bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-xl p-4 border-2 border-emerald-400/50 shadow-lg">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-emerald-500/30 border border-emerald-400/70 flex items-center justify-center animate-pulse">
                    <Sparkles className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-black text-emerald-400 mb-1">
                      🔄 Free Monthly Updates Forever
                    </h3>
                    <p className="text-white text-sm font-semibold mb-2">
                      We update the course <span className="text-emerald-300">every month</span> with:
                    </p>
                    <ul className="space-y-1 text-white/90 text-sm">
                      <li className="flex items-center gap-2">
                        <span className="text-emerald-400">✓</span>
                        New AI tools & features
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-emerald-400">✓</span>
                        Fresh video templates
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-emerald-400">✓</span>
                        Updated strategies & techniques
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-emerald-400">✓</span>
                        Bonus content & resources
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* No Hidden Fees */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-black text-white mb-1">
                      Zero Hidden Fees
                    </h3>
                    <p className="text-white/80 text-sm">
                      <span className="text-emerald-400 font-bold">$37 one-time</span> - that's it. No subscriptions, no upsells, no recurring charges. Ever.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Summary */}
            <div className="bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-emerald-400/30 rounded-lg p-4 text-center">
              <p className="text-white font-bold text-base">
                🎉 You're part of the <span className="text-emerald-400">elite 500+ agents</span> who will stay ahead of the curve with fresh content every month!
              </p>
            </div>
          </div>

          {/* DFY VIDEO SERVICE SECTION - Only show if they purchased OTO or Downsell */}
          {hasDFY && (
            <div className="mb-8 rounded-2xl bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-2 border-gold-premium p-6 shadow-2xl backdrop-blur-sm md:p-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <FileText className="w-8 h-8 text-gold-premium" />
                <h2 className="text-2xl font-black text-white md:text-3xl">
                  🎬 DONE-FOR-YOU VIDEO SERVICE
                </h2>
                <Sparkles className="w-8 h-8 text-gold-premium" />
              </div>

              <div className="bg-white/10 rounded-xl p-6 mb-4">
                <p className="text-center text-lg font-bold text-white mb-3">
                  Thank you for upgrading to Done-For-You! 🎉
                </p>
                <p className="text-center text-gray-200 mb-4">
                  We'll personally create amazing AI videos for you and deliver within{' '}
                  <span className="text-gold-premium font-bold">{purchased === 'oto' ? '24 hours' : '48 hours'}</span>.
                </p>

                <div className="bg-gradient-to-r from-purple-600/30 to-pink-600/30 border-2 border-gold-premium rounded-lg p-5 mb-4">
                  <p className="text-white font-black text-center mb-3 text-lg">
                    📧 We Will Contact You Via Email
                  </p>
                  <p className="text-white/90 text-center mb-4">
                    <strong>Please stay in touch and check your email inbox!</strong><br />
                    We'll reach out shortly to get your video details.
                  </p>

                  <div className="bg-white/10 rounded-lg p-4 mb-3">
                    <p className="text-emerald-400 font-bold text-center mb-2">
                      What We Need From You:
                    </p>
                    <div className="space-y-2 text-sm text-white/90">
                      <p className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        <span><strong>Video Script:</strong> Your talking points or message (max 60 seconds)</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        <span><strong>2-3 Images:</strong> Photos of you, property, or branding</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        <span><strong>Footage (Optional):</strong> Any video clips you want included</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        <span><strong>Special Requests:</strong> Any specific style or preferences</span>
                      </p>
                    </div>
                  </div>

                  <a
                    href="/dfy-submit"
                    className="block w-full bg-gradient-to-r from-emerald-500 to-green-success text-white px-6 py-4 rounded-lg font-black text-center hover:scale-105 transition-transform shadow-lg"
                  >
                    🎬 SUBMIT YOUR DETAILS NOW →
                  </a>
                </div>

                <div className="bg-emerald-500/10 border border-emerald-400/50 rounded-lg p-4">
                  <p className="text-white text-sm text-center">
                    <strong className="text-emerald-400">💌 Check Your Email:</strong> We'll send you a personal message with instructions and the submission link. Reply directly if you have any questions!
                  </p>
                </div>
              </div>

              <div className="bg-gold-premium/10 border border-gold-premium/50 rounded-lg p-4">
                <p className="text-white/90 text-sm text-center">
                  <strong className="text-gold-premium">💬 Direct Support:</strong> You also get personal support from me (the founder) - not a support team.
                  <br />
                  Reply to the email or reach out anytime!
                </p>
              </div>
            </div>
          )}

          {/* Download Button - Primary CTA */}
          <div className="mb-8 text-center">
            <a
              href={GOOGLE_DRIVE.courseMaterialsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-block"
            >
              <div className="absolute -inset-1 rounded-2xl bg-emerald-gradient opacity-75 blur-lg transition duration-300 group-hover:opacity-100"></div>
              <div className="relative flex items-center gap-3 rounded-2xl bg-emerald-gradient px-8 py-5 text-xl font-black uppercase tracking-wider text-white shadow-emerald-glow transition-all duration-300 group-hover:scale-105 md:px-12 md:py-6 md:text-2xl">
                <Download className="h-6 w-6 md:h-8 md:w-8" />
                <span>Access Course Materials Now →</span>
              </div>
            </a>
            <p className="mt-4 text-sm font-semibold text-gray-300">
              ✨ Everything you need to create your first video in 7 minutes
            </p>
          </div>

          {/* Next Steps */}
          <div className="mb-8 rounded-2xl bg-white/10 backdrop-blur-sm p-6 md:p-8 border border-navy-medium">
            <h3 className="mb-6 text-center text-2xl font-black text-white md:text-3xl">
              Quick Start Guide (3 Steps):
            </h3>
            <div className="space-y-6">
              {/* Step 1 */}
              <div className="flex gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gold-gradient text-lg font-black text-navy-deep">
                  1
                </div>
                <div>
                  <h4 className="mb-2 text-xl font-bold text-white">
                    <Download className="mb-1 mr-2 inline h-5 w-5" />
                    Download Everything
                  </h4>
                  <p className="text-gray-300">
                    Click the green button above to access all course materials, templates, prompts, and bonuses from Google Drive.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gold-gradient text-lg font-black text-navy-deep">
                  2
                </div>
                <div>
                  <h4 className="mb-2 text-xl font-bold text-white">
                    <Video className="mb-1 mr-2 inline h-5 w-5" />
                    Watch the Training
                  </h4>
                  <p className="text-gray-300">
                    Start with Module 1: "Your First AI Video in 7 Minutes". Follow along step-by-step (it's easier than you think!)
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-emerald-gradient text-lg font-black text-white">
                  3
                </div>
                <div>
                  <h4 className="mb-2 text-xl font-bold text-white">
                    <Sparkles className="mb-1 mr-2 inline h-5 w-5" />
                    Create & Share
                  </h4>
                  <p className="text-gray-300">
                    Upload 1 photo, generate your video, and post it on social media. Watch the engagement roll in! 🚀
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Money-Back Guarantee */}
          <div className="mb-8 rounded-2xl border-2 border-green-emerald bg-green-emerald/10 p-6 text-center backdrop-blur-sm">
            <Shield className="w-12 h-12 mx-auto mb-3 text-green-emerald" />
            <p className="text-lg font-bold text-white mb-2">
              🛡️ 30-Day Money-Back Guarantee 🛡️
            </p>
            <p className="text-sm text-gray-300">
              Not satisfied? Email{' '}
              <a
                href={`mailto:${SITE_CONFIG.supportEmail}`}
                className="text-green-emerald font-bold underline"
              >
                {SITE_CONFIG.supportEmail}
              </a>
              {' '}within 30 days for a full refund.
              <br />
              No questions asked. Keep the bonuses anyway.
            </p>
          </div>

          {/* Support Section */}
          <div className="rounded-2xl bg-white/5 backdrop-blur-sm p-6 text-center border border-gold-premium/30 md:p-8">
            <h3 className="mb-4 text-xl font-bold text-white md:text-2xl">
              Need Help Getting Started?
            </h3>
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-2 text-gold-premium">
                <Mail className="h-5 w-5" />
                <a
                  href={`mailto:${SITE_CONFIG.supportEmail}`}
                  className="text-lg font-semibold hover:underline"
                >
                  {SITE_CONFIG.supportEmail}
                </a>
              </div>
              <p className="text-sm text-gray-400">
                We typically respond within 24 hours (usually much faster!)
              </p>
            </div>
          </div>

          {/* Back to Home */}
          <div className="mt-8 text-center">
            <Link
              href="/"
              className="inline-block text-lg font-semibold text-gold-premium transition-colors hover:text-gold-light"
            >
              ← Back to Home
            </Link>
          </div>

          {/* Celebration Footer */}
          <div className="mt-12 text-center">
            <p className="text-gray-400 text-sm mb-2">
              Welcome to the 500+ agents already dominating their markets with AI video!
            </p>
            <p className="text-2xl">
              🎉 ✨ 🚀
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ThankYouConfirmed() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-navy-deep via-navy-rich to-navy-medium flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    }>
      <ThankYouContent />
    </Suspense>
  )
}
