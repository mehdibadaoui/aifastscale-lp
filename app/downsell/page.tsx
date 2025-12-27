'use client'

import { Shield, Clock, Gift, CheckCircle, Sparkles, Star, Heart } from 'lucide-react'
import { trackTikTokInitiateCheckout } from '../components/TikTokPixel'
import { trackMetaEvent } from '../components/MetaPixel'

// Whop payment link for Downsell - $19
const WHOP_DOWNSELL_LINK = 'https://whop.com/checkout/plan_WsTHXLDJ3nJRo'

// Save tracking params to localStorage before Whop redirect
const saveTrackingParams = () => {
  if (typeof window === 'undefined') return

  const params = new URLSearchParams(window.location.search)
  const trackingData: Record<string, string> = {}

  const fbclid = params.get('fbclid')
  if (fbclid) trackingData.fbclid = fbclid

  const ttclid = params.get('ttclid')
  if (ttclid) trackingData.ttclid = ttclid

  const utmParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']
  utmParams.forEach(param => {
    const value = params.get(param)
    if (value) trackingData[param] = value
  })

  const fbc = document.cookie.split('; ').find(row => row.startsWith('_fbc='))?.split('=')[1]
  const fbp = document.cookie.split('; ').find(row => row.startsWith('_fbp='))?.split('=')[1]
  if (fbc) trackingData._fbc = fbc
  if (fbp) trackingData._fbp = fbp

  trackingData.checkout_started = new Date().toISOString()
  localStorage.setItem('aifastscale_tracking', JSON.stringify(trackingData))
}

export default function DownsellPage() {
  const handleCheckout = () => {
    saveTrackingParams()
    trackTikTokInitiateCheckout('downsell-dfy', 19)
    trackMetaEvent('InitiateCheckout', {
      content_ids: ['downsell-dfy'],
      content_name: '24h AI Video (Done For You)',
      content_type: 'product',
      value: 19,
      currency: 'USD'
    })
    window.location.href = WHOP_DOWNSELL_LINK
  }

  const handleDecline = () => {
    window.location.href = '/thank-you-confirmed'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-teal-900 to-cyan-950">
      {/* Animated Background Effects */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        {/* Glowing orbs */}
        <div className="absolute -right-40 -top-40 h-[600px] w-[600px] animate-pulse rounded-full bg-emerald-500/20 blur-[120px]" />
        <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] animate-pulse rounded-full bg-teal-500/20 blur-[100px]" style={{ animationDelay: '1s' }} />
        <div className="absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full bg-cyan-500/10 blur-[80px]" style={{ animationDelay: '2s' }} />

        {/* Stars/sparkles pattern */}
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/10 bg-black/20 backdrop-blur-xl">
        <div className="mx-auto max-w-4xl px-4 py-3">
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/30">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">AgentClone</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 mx-auto max-w-xl px-4 py-8 sm:py-12">
        {/* Special Deal Badge */}
        <div className="mb-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-rose-500/20 to-pink-500/20 border border-rose-400/30 px-5 py-2.5 shadow-lg shadow-rose-500/10">
            <Heart className="h-5 w-5 text-rose-400 fill-rose-400" />
            <span className="text-sm font-bold text-rose-300 uppercase tracking-wide">Last Chance Deal</span>
          </div>
        </div>

        {/* Headline */}
        <div className="mb-8 text-center">
          <h1 className="mb-4 text-3xl font-black text-white sm:text-4xl leading-tight">
            Wait! Special Price
            <span className="block bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
              Just For You - $19
            </span>
          </h1>
          <p className="text-lg text-emerald-200/80">
            I'll create your video. You just review & post.
          </p>
        </div>

        {/* Offer Card */}
        <div className="mb-6 overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl">
          {/* Card Header with shine effect */}
          <div className="relative bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 p-5">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shine" />
            <div className="flex items-center justify-center gap-3">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="font-bold text-white">Done-For-You Service</span>
            </div>
          </div>

          <div className="p-6">
            {/* Price */}
            <div className="mb-6 text-center">
              <div className="mb-2 text-sm text-emerald-300/70 uppercase tracking-wide">Exclusive reduced price</div>
              <div className="flex items-center justify-center gap-4">
                <span className="text-2xl text-white/40 line-through">$29</span>
                <span className="text-5xl font-black text-white">$19</span>
                <div className="rounded-full bg-gradient-to-r from-rose-500 to-pink-500 px-4 py-1.5 shadow-lg shadow-rose-500/30">
                  <span className="text-sm font-black text-white">SAVE $10</span>
                </div>
              </div>
            </div>

            {/* What's Included */}
            <div className="mb-6 space-y-3">
              {[
                'I create your AI video for you',
                'Professional quality guaranteed',
                'Delivered within 24 hours',
                '100% satisfaction or refund',
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 rounded-xl bg-white/5 p-3">
                  <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/30">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-white/90">{item}</span>
                </div>
              ))}
            </div>

            {/* Guarantee */}
            <div className="mb-6 flex items-center gap-3 rounded-2xl bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border border-amber-400/20 p-4">
              <Shield className="h-8 w-8 flex-shrink-0 text-amber-400" />
              <p className="text-sm text-amber-300">
                <span className="font-bold">100% Guarantee:</span> Not happy with your video? Full refund, no questions.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="space-y-3">
              {/* Buy Button */}
              <button
                onClick={handleCheckout}
                className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-500 py-4 font-bold text-white shadow-xl shadow-emerald-500/30 transition-all hover:scale-[1.02] hover:shadow-2xl hover:shadow-emerald-500/40 active:scale-[0.98]"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <Gift className="h-5 w-5" />
                <span className="relative">Yes! Done-For-You - $19</span>
              </button>

              {/* Reject Button */}
              <button
                onClick={handleDecline}
                className="flex w-full items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/5 py-4 font-semibold text-white/70 transition-all hover:bg-white/10 hover:text-white active:scale-[0.98]"
              >
                No thanks, I'll do it myself
              </button>
            </div>
          </div>
        </div>

        {/* Trust badges */}
        <div className="flex items-center justify-center gap-6 text-sm text-emerald-300/60">
          <span className="flex items-center gap-1.5">
            <Shield className="h-4 w-4" />
            Secure
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            24h Delivery
          </span>
          <span className="flex items-center gap-1.5">
            <Gift className="h-4 w-4" />
            Best Deal
          </span>
        </div>
      </main>

      <style jsx global>{`
        @keyframes shine {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shine {
          animation: shine 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
