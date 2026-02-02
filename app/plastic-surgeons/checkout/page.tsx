'use client'

import { WhopCheckoutEmbed } from '@whop/checkout/react'
import { Shield, Lock, CheckCircle, ArrowLeft } from 'lucide-react'
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
        {/* Trust Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Complete Your Order
          </h1>
          <p className="text-gray-400">
            CloneYourself for Plastic Surgeons - One-time payment of <span className="text-white font-semibold">$47.82</span>
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form - Takes 2 columns on desktop */}
          <div className="lg:col-span-2">
            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
              <WhopCheckoutEmbed
                planId="plan_OGprA4gd4Lr7N"
                theme="dark"
                returnUrl="https://aifastscale.com/plastic-surgeons/thank-you"
                hideAddressForm
              />
            </div>
          </div>

          {/* Trust Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* What You Get */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-5">
              <h3 className="text-white font-semibold mb-4">What You Get:</h3>
              <ul className="space-y-3">
                {[
                  'Full CloneYourself AI System',
                  '100+ Done-For-You Scripts',
                  'Video Training Library',
                  'Private Community Access',
                  '12+ Premium Bonuses ($4,915 value)',
                  'Lifetime Updates',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-gray-300 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Guarantee */}
            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <Shield className="w-8 h-8 text-green-500" />
                <div>
                  <h3 className="text-white font-semibold">30-Day Guarantee</h3>
                  <p className="text-green-400 text-sm">100% Money-Back</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm">
                If you're not completely satisfied, email us within 30 days for a full refund. No questions asked.
              </p>
            </div>

            {/* Security Badges */}
            <div className="flex flex-wrap justify-center gap-4 text-gray-500 text-xs">
              <div className="flex items-center gap-1">
                <Lock className="w-3 h-3" />
                <span>SSL Encrypted</span>
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
