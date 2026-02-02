'use client'

import { WhopCheckoutEmbed } from '@whop/checkout/react'
import { Shield, Lock, CheckCircle, ArrowLeft, Gift, Zap, Star } from 'lucide-react'
import Link from 'next/link'

export default function PlasticSurgeonCheckout() {
  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/plastic-surgeons"
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back to offer</span>
          </Link>
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <Lock className="w-4 h-4 text-green-500" />
            <span>Secure Checkout</span>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        {/* Compact Header - Mobile */}
        <div className="text-center mb-4 lg:mb-8">
          <p className="text-gray-400 text-sm">
            CloneYourself for Plastic Surgeons - <span className="text-white font-semibold">$47.82</span>
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Checkout Form - Takes 2 columns on desktop */}
          <div className="lg:col-span-2 order-1 lg:order-1">
            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
              <WhopCheckoutEmbed
                planId="plan_OGprA4gd4Lr7N"
                theme="light"
                returnUrl="https://aifastscale.com/plastic-surgeons/thank-you"
                hideAddressForm
              />
            </div>
          </div>

          {/* Trust Sidebar */}
          <div className="lg:col-span-1 space-y-4 order-2 lg:order-2">
            {/* "One Step Away" - Shows after checkout on mobile */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/30 px-3 py-1 rounded-full mb-2">
                <Zap className="w-3 h-3 text-green-400" />
                <span className="text-green-400 text-xs font-semibold">INSTANT ACCESS</span>
              </div>
              <h2 className="text-xl font-bold text-white mb-1">
                You're One Step Away...
              </h2>
              <p className="text-gray-400 text-sm">
                Complete your order to get instant access
              </p>
            </div>

            {/* What You Get - REWRITTEN */}
            <div className="bg-gradient-to-br from-amber-500/10 to-amber-500/5 border border-amber-500/30 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Gift className="w-5 h-5 text-amber-400" />
                <h3 className="text-white font-bold">Everything You Get Today:</h3>
              </div>

              <ul className="space-y-3">
                {/* Core System */}
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-white font-medium">CloneYourself AI System</span>
                    <span className="text-amber-400 text-xs ml-1">($997 value)</span>
                    <p className="text-gray-500 text-xs">Create unlimited AI videos of yourself</p>
                  </div>
                </li>

                {/* Scripts */}
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-white font-medium">100+ Done-For-You Scripts</span>
                    <span className="text-amber-400 text-xs ml-1">($497 value)</span>
                    <p className="text-gray-500 text-xs">Copy-paste scripts that convert patients</p>
                  </div>
                </li>

                {/* Website Templates */}
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-white font-medium">2 Premium Website Templates</span>
                    <span className="text-amber-400 text-xs ml-1">($497 value)</span>
                    <p className="text-gray-500 text-xs">Ready-to-use, just add your info</p>
                  </div>
                </li>

                {/* Profit Tracker */}
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-white font-medium">Patient Profit Tracker</span>
                    <span className="text-amber-400 text-xs ml-1">($397 value)</span>
                    <p className="text-gray-500 text-xs">Track ROI on every video you post</p>
                  </div>
                </li>

                {/* Community */}
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-white font-medium">Private Surgeon Community</span>
                    <span className="text-amber-400 text-xs ml-1">($997 value)</span>
                    <p className="text-gray-500 text-xs">Network with 500+ successful surgeons</p>
                  </div>
                </li>

                {/* Bonuses */}
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-white font-medium">+10 Premium Bonuses</span>
                    <span className="text-amber-400 text-xs ml-1">($2,530 value)</span>
                    <p className="text-gray-500 text-xs">Ad templates, hooks, viral strategies...</p>
                  </div>
                </li>
              </ul>

              {/* Total Value */}
              <div className="mt-4 pt-4 border-t border-amber-500/20">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Total Value:</span>
                  <span className="text-gray-400 line-through text-sm">$5,915</span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-white font-bold">You Pay Today:</span>
                  <span className="text-green-400 font-black text-xl">$47.82</span>
                </div>
              </div>
            </div>

            {/* Guarantee - REWRITTEN TO BE IRRESISTIBLE */}
            <div className="bg-gradient-to-br from-green-500/15 to-green-500/5 border-2 border-green-500/40 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                  <Shield className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">Try It RISK-FREE</h3>
                  <p className="text-green-400 text-sm font-semibold">30-Day "Love It or Leave It" Guarantee</p>
                </div>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed mb-3">
                Use the entire system for <span className="text-white font-semibold">30 full days</span>. Create videos. Post content. Get patients.
              </p>
              <p className="text-gray-300 text-sm leading-relaxed mb-3">
                If you don't <span className="text-white font-semibold">absolutely love it</span> — or for ANY reason at all — just email us and we'll refund every penny. <span className="text-green-400 font-semibold">No questions. No hassle. No hard feelings.</span>
              </p>
              <p className="text-white text-sm font-medium">
                You literally can't lose. The only risk is missing out.
              </p>
            </div>

            {/* Urgency/Social Proof */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-gray-400 text-xs">
                Trusted by <span className="text-white font-semibold">500+ plastic surgeons</span> worldwide
              </p>
            </div>

            {/* Security Badges */}
            <div className="flex flex-wrap justify-center gap-4 text-gray-500 text-xs">
              <div className="flex items-center gap-1">
                <Lock className="w-3 h-3" />
                <span>256-bit SSL</span>
              </div>
              <div className="flex items-center gap-1">
                <Shield className="w-3 h-3" />
                <span>Secure Payment</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Trust Bar */}
        <div className="mt-8 pt-6 border-t border-white/10 text-center">
          <p className="text-gray-500 text-xs">
            Processed securely by Whop. Your payment information is encrypted and secure.
          </p>
          <p className="text-gray-600 text-xs mt-2">
            Velon LLC, a Wyoming Limited Liability Company | 30 N Gould St Ste R, Sheridan, WY 82801
          </p>
        </div>
      </div>
    </main>
  )
}
