'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import {
  Check,
  Shield,
  Star,
  ArrowRight,
  Video,
  FileText,
  Wand2,
  RefreshCw,
  AlertTriangle,
  Clock,
  Gift,
  X,
} from 'lucide-react'
import { trackTikTokInitiateCheckout } from '../components/TikTokPixel'
import { trackMetaEvent } from '../components/MetaPixel'

// Whop payment link for 3-month downsell
const WHOP_DOWNSELL_LINK = 'https://whop.com/checkout/plan_kBs0C47hTeNS7'

export default function DownsellPage() {
  const [timeLeft, setTimeLeft] = useState(5 * 60) // 5 minutes

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleCheckout = () => {
    // Track TikTok InitiateCheckout event
    trackTikTokInitiateCheckout('downsell-3month', 195)
    // Track Meta Pixel InitiateCheckout event
    trackMetaEvent('InitiateCheckout', {
      content_ids: ['downsell-3month'],
      content_name: '3-Month Content Package',
      content_type: 'product',
      value: 195,
      currency: 'USD'
    })
    window.location.href = WHOP_DOWNSELL_LINK
  }

  const handleDecline = () => {
    window.location.href = '/thank-you-confirmed'
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black text-white">
      {/* Timer Header */}
      <div className="bg-gradient-to-r from-amber-600 to-amber-500 py-2.5 px-4 sticky top-0 z-50">
        <div className="flex items-center justify-center gap-2">
          <Clock className="w-4 h-4 text-black" />
          <span className="text-black font-bold text-sm">
            SPECIAL OFFER EXPIRES IN: <span className="font-black">{formatTime(timeLeft)}</span>
          </span>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12">
        {/* Wait Message */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-500/40 px-4 py-2 rounded-full mb-5">
            <Gift className="w-4 h-4 text-amber-400" />
            <span className="text-amber-400 font-bold text-sm">ONE-TIME OFFER</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black mb-4 leading-tight">
            Wait! Before You Go...
          </h1>

          <p className="text-gray-400 text-lg mb-2">
            I understand 6 months is a big commitment.
          </p>
          <p className="text-white text-xl font-bold">
            What about <span className="text-gold-premium">just 3 months</span> at a special price?
          </p>
        </div>

        {/* Sara's Message */}
        <div className="bg-gradient-to-br from-gold-premium/10 to-gold-premium/5 border border-gold-premium/30 rounded-2xl p-5 sm:p-6 mb-8">
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-gold-premium">
                <Image src="/images/Sara 61kb.webp" alt="Sara" width={56} height={56} className="object-cover" />
              </div>
            </div>
            <div>
              <p className="text-white text-sm sm:text-base leading-relaxed">
                <span className="text-gold-premium font-bold">"Look, I get it.</span> The 6-month package is an investment.
                But I really want to help you succeed with content. So here's what I'll do...
              </p>
              <p className="text-white text-sm sm:text-base leading-relaxed mt-2">
                I'll give you <span className="text-gold-premium font-bold">3 months of content (24 videos)</span> at a
                <span className="text-green-400 font-bold"> 34% discount</span> - just $195 instead of $295."
              </p>
            </div>
          </div>
        </div>

        {/* The Offer Card */}
        <div className="bg-zinc-900 border-2 border-gold-premium/50 rounded-2xl overflow-hidden mb-8">
          {/* Header */}
          <div className="bg-gradient-to-r from-gold-premium/20 to-gold-premium/10 p-4 border-b border-gold-premium/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gold-premium font-bold text-sm uppercase">Limited Downsell Offer</p>
                <p className="text-white font-black text-xl">3-Month Content Package</p>
              </div>
              <div className="text-right">
                <p className="text-gray-400 line-through text-sm">$295</p>
                <p className="text-gold-premium font-black text-3xl">$195</p>
              </div>
            </div>
          </div>

          {/* What's included */}
          <div className="p-5 space-y-4">
            <p className="text-gray-400 text-sm font-medium uppercase tracking-wide">What you get:</p>

            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Video, label: '24 AI Videos', desc: 'Ready to post' },
                { icon: FileText, label: 'Custom Scripts', desc: 'Your voice' },
                { icon: Wand2, label: 'Pro Editing', desc: 'Polished look' },
                { icon: RefreshCw, label: '3 Revisions', desc: 'Per video' },
              ].map((item, i) => (
                <div key={i} className="bg-white/5 rounded-xl p-3 border border-white/10">
                  <item.icon className="w-5 h-5 text-gold-premium mb-1.5" />
                  <p className="text-white text-sm font-bold">{item.label}</p>
                  <p className="text-gray-500 text-xs">{item.desc}</p>
                </div>
              ))}
            </div>

            {/* Delivery schedule */}
            <div className="bg-gold-premium/10 border border-gold-premium/30 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-300 text-sm">Videos per week:</span>
                <span className="text-white font-bold">2 videos</span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-300 text-sm">Duration:</span>
                <span className="text-white font-bold">3 months</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300 text-sm">Price per video:</span>
                <span className="text-gold-premium font-bold">$8.13</span>
              </div>
            </div>

            {/* Savings callout */}
            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                <Check className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-green-400 font-bold">You save $100</p>
                <p className="text-gray-400 text-sm">34% off the regular 3-month price</p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="p-5 pt-0">
            <button
              onClick={handleCheckout}
              className="w-full bg-gradient-to-r from-gold-premium to-gold-dark text-black py-4 rounded-xl font-black text-lg hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg flex items-center justify-center gap-2 mb-3"
            >
              Yes! Give Me 24 Videos for $195
              <ArrowRight className="w-5 h-5" />
            </button>

            <div className="flex items-center justify-center gap-4 text-xs text-gray-500 mb-4">
              <span className="flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-green-500" />
                Risk-free guarantee
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                First video in 5 days
              </span>
            </div>
          </div>
        </div>

        {/* Guarantee */}
        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 mb-8">
          <div className="flex items-start gap-3">
            <Shield className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-green-400 font-bold mb-1">Same Guarantee Applies</p>
              <p className="text-gray-300 text-sm">
                If you don't love the first video, I'll refund every penny. No questions asked.
              </p>
            </div>
          </div>
        </div>

        {/* Compare */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-5 mb-8">
          <p className="text-gray-400 text-sm font-medium mb-4 text-center">Quick Comparison:</p>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="bg-white/5 rounded-lg p-3">
              <p className="text-gray-400 text-xs mb-1">Do It Yourself</p>
              <p className="text-white font-bold">3+ hours/video</p>
              <p className="text-red-400 text-xs mt-1">72+ hours of work</p>
            </div>
            <div className="bg-gold-premium/10 rounded-lg p-3 border border-gold-premium/30">
              <p className="text-gold-premium text-xs mb-1">Done-For-You</p>
              <p className="text-white font-bold">0 minutes</p>
              <p className="text-green-400 text-xs mt-1">Just review & post</p>
            </div>
          </div>
        </div>

        {/* No Thanks */}
        <div className="text-center">
          <button
            onClick={handleDecline}
            className="text-gray-500 hover:text-gray-300 text-sm transition-colors flex items-center gap-2 mx-auto"
          >
            <X className="w-4 h-4" />
            No thanks, I'll create my own content
          </button>
        </div>
      </div>

    </main>
  )
}
