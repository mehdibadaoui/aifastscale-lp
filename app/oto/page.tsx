'use client'

import { useState } from 'react'
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
  Users,
  Zap,
  AlertTriangle,
  Send,
  Play,
  Crown,
} from 'lucide-react'
import { trackTikTokInitiateCheckout } from '../components/TikTokPixel'

// Whop payment links
const WHOP_LINKS = {
  premium: 'https://whop.com/checkout/plan_0fbyyZAq8n1yI', // 6 months
  starter: 'https://whop.com/checkout/plan_gdD4gop6sejQG', // 3 months
}

export default function DoneForYouOTO() {
  const [selectedPackage, setSelectedPackage] = useState<'premium' | 'starter'>('premium')
  const [spotsLeft] = useState(2)
  const [showReviews, setShowReviews] = useState(false)

  const packages = {
    premium: {
      name: '6-Month Content Partner',
      totalVideos: 72,
      months: 6,
      pricePerVideo: 7.85,
      totalPrice: 565.20,
      videosPerWeek: 3,
    },
    starter: {
      name: '3-Month Quick Start',
      totalVideos: 24,
      months: 3,
      pricePerVideo: 12.29,
      totalPrice: 295,
      videosPerWeek: 2,
    },
  }

  const currentPackage = packages[selectedPackage]

  const proofImages = [
    '/images/Reviews/Review REA 1.jpeg',
    '/images/Reviews/Review REA 2.jpeg',
    '/images/Reviews/Review REA 3.jpeg',
    '/images/Reviews/Review REA 5.jpeg',
    '/images/Reviews/Review REA 9.jpeg',
    '/images/Reviews/Review REA 11.jpeg',
  ]

  const handleCheckout = () => {
    // Track TikTok InitiateCheckout event
    trackTikTokInitiateCheckout(
      `oto-${selectedPackage}`,
      currentPackage.totalPrice
    )
    window.location.href = WHOP_LINKS[selectedPackage]
  }

  const handleDecline = () => {
    window.location.href = '/downsell'
  }

  return (
    <main className="min-h-screen bg-black text-white pb-24 sm:pb-6">
      {/* Urgency Header */}
      <div className="bg-red-600 py-2 px-3 sm:py-2.5 sm:px-4 sticky top-0 z-50">
        <p className="text-center font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 sm:gap-2">
          <AlertTriangle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span className="hidden sm:inline">WAIT! This offer disappears when you leave this page</span>
          <span className="sm:hidden">WAIT! Offer disappears when you leave</span>
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 sm:py-10">
        {/* Hero */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-red-500/20 border border-red-500/50 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-4 sm:mb-5">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span className="text-red-400 font-bold text-xs sm:text-sm">Only {spotsLeft} spots left (8/10 taken)</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black mb-3 sm:mb-4 leading-tight px-2">
            Want Me To Create <span className="text-gold-premium">6 Months of Content</span>
            <br className="hidden sm:block" />
            <span className="sm:hidden"> </span>
            <span className="text-gold-premium">For Just $7.85 Per Video?</span>
          </h1>

          <p className="text-base sm:text-xl text-gray-300 max-w-2xl mx-auto">
            You learned the system. Now let me <span className="text-white font-bold">do it all for you</span>.
          </p>
        </div>

        {/* Sara Message - Compact but Personal */}
        <div className="bg-gradient-to-br from-gold-premium/10 to-gold-premium/5 border border-gold-premium/30 rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex gap-3 sm:gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden border-2 border-gold-premium">
                <Image src="/images/Sara 61kb.webp" alt="Sara" width={56} height={56} className="object-cover" />
              </div>
            </div>
            <div>
              <p className="text-white text-sm sm:text-base leading-relaxed mb-2">
                <span className="text-gold-premium font-bold">"Hey, it's Sara.</span> I know you're busy showing houses and closing deals.
                So let me handle your content - I'll write the scripts, generate the AI videos, edit everything, and deliver
                <span className="text-gold-premium font-bold"> ready-to-post videos</span> straight to your inbox."
              </p>
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-gold-premium text-gold-premium" />
                  ))}
                </div>
                <span className="text-gray-500 text-xs sm:text-sm">847+ agents helped</span>
              </div>
            </div>
          </div>
        </div>

        {/* What's Included - Clean Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-6 sm:mb-8">
          {[
            { icon: FileText, label: 'Script Writing', desc: 'Proven hooks' },
            { icon: Wand2, label: 'AI Generation', desc: 'Perfect lip-sync' },
            { icon: Video, label: 'Pro Editing', desc: 'Ready to post' },
            { icon: RefreshCw, label: '3 Revisions', desc: 'Per video' },
          ].map((item, i) => (
            <div key={i} className="bg-white/5 rounded-lg sm:rounded-xl p-3 sm:p-4 text-center border border-white/10">
              <item.icon className="w-5 h-5 sm:w-7 sm:h-7 text-gold-premium mx-auto mb-1.5 sm:mb-2" />
              <p className="text-white text-xs sm:text-sm font-bold">{item.label}</p>
              <p className="text-gray-500 text-[10px] sm:text-xs">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Proof Section - Professional Cards like LP */}
        <div className="mb-6 sm:mb-8">
          <p className="text-center text-gray-400 text-sm mb-4">Agents I've created Done-For-You content for:</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            {[
              {
                name: 'Sofia Martinez',
                location: 'Miami, FL',
                role: 'Luxury Real Estate Agent',
                result: 'Delivered in 5 days',
                quote: 'Sara delivered my first batch in 5 days. Quality was incredible - followers thought I hired a production team.',
                image: proofImages[0],
              },
              {
                name: 'Marcus Williams',
                location: 'Atlanta, GA',
                role: 'Commercial Broker',
                result: '72 videos done',
                quote: 'I was posting inconsistently for years. Now I have 6 months of content ready. Best investment I\'ve made.',
                image: proofImages[1],
              },
              {
                name: 'Yasmin Al-Rashid',
                location: 'Dubai, UAE',
                role: 'Property Consultant',
                result: '3 months content',
                quote: 'The scripts Sara writes actually sound like me. My clients say they feel like they know me before we meet.',
                image: proofImages[2],
              },
            ].map((testimonial, i) => (
              <div key={i} className="bg-zinc-900 rounded-xl overflow-hidden border border-white/10">
                {/* Video Preview */}
                <div className="relative aspect-video">
                  <Image src={testimonial.image} alt={testimonial.name} fill className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />

                  {/* Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-gold-premium/90 flex items-center justify-center">
                      <Play className="w-4 h-4 text-black fill-black ml-0.5" />
                    </div>
                  </div>

                  {/* Verified Badge */}
                  <div className="absolute top-2 left-2 flex items-center gap-1 bg-green-500/20 backdrop-blur-sm text-green-400 text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                    <Check className="w-2.5 h-2.5" />
                    Verified
                  </div>

                  {/* Result Badge */}
                  <div className="absolute top-2 right-2 bg-gold-premium text-black text-[9px] font-black px-1.5 py-0.5 rounded">
                    {testimonial.result}
                  </div>

                  {/* Name & Location */}
                  <div className="absolute bottom-2 left-2">
                    <p className="text-white font-bold text-sm">{testimonial.name}</p>
                    <p className="text-gray-400 text-[10px]">📍 {testimonial.location}</p>
                  </div>
                </div>

                {/* Content */}
                <div className="p-3">
                  <div className="flex gap-0.5 mb-1.5">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className="w-3 h-3 fill-gold-premium text-gold-premium" />
                    ))}
                  </div>
                  <p className="text-gold-premium text-[10px] font-medium mb-1.5">{testimonial.role}</p>
                  <p className="text-gray-300 text-xs leading-relaxed">"{testimonial.quote}"</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews Section - Collapsible */}
        <div className="mb-6 sm:mb-8">
          <button
            onClick={() => setShowReviews(!showReviews)}
            className="w-full flex items-center justify-center gap-2 text-gray-400 hover:text-white transition-colors py-2 sm:py-3 border border-white/10 rounded-lg"
          >
            <Users className="w-4 h-4" />
            <span className="text-xs sm:text-sm">{showReviews ? 'Hide' : 'See'} reviews from Done-For-You clients</span>
            <ArrowRight className={`w-4 h-4 transition-transform ${showReviews ? 'rotate-90' : ''}`} />
          </button>

          {showReviews && (
            <div className="mt-4 space-y-3">
              {[
                {
                  name: 'Rachel T.',
                  time: '2 weeks ago',
                  text: 'Honestly I was nervous paying upfront. But Sara sent me sample scripts first. First batch came in 5 days. Quality is solid - way better than I could do myself.',
                },
                {
                  name: 'David M.',
                  time: '1 month ago',
                  text: 'The revision process is smooth. Asked for changes on 2 videos, got them back in 24 hours. Just be responsive with feedback.',
                },
                {
                  name: 'Linda K.',
                  time: '3 weeks ago',
                  text: 'Went with 3-month package to test it. Happy with what I got. The scripts sound like me. Will probably do 6 months next.',
                },
              ].map((review, i) => (
                <div key={i} className="bg-white/5 rounded-xl p-3 sm:p-4 border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gold-premium/20 flex items-center justify-center text-gold-premium font-bold text-xs sm:text-sm">
                        {review.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-white text-xs sm:text-sm font-medium">{review.name}</p>
                        <p className="text-gray-500 text-[10px] sm:text-xs">{review.time}</p>
                      </div>
                    </div>
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, j) => (
                        <Star key={j} className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-gold-premium text-gold-premium" />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-300 text-xs sm:text-sm">{review.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Package Selection */}
        <div className="mb-6">
          <h3 className="text-center text-white font-bold text-xl mb-6">Choose Your Package</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            {/* PREMIUM - 6 MONTH - THE HERO CARD */}
            <div
              onClick={() => setSelectedPackage('premium')}
              className={`relative cursor-pointer rounded-2xl overflow-hidden transition-all duration-300 ${
                selectedPackage === 'premium'
                  ? 'scale-[1.02] shadow-2xl shadow-gold-premium/30'
                  : 'hover:scale-[1.01] opacity-90 hover:opacity-100'
              }`}
            >
              {/* Gold gradient border effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-gold-premium via-gold-dark to-gold-premium rounded-2xl" />
              <div className="absolute inset-[2px] bg-zinc-900 rounded-2xl" />

              {/* Glow effect */}
              <div className="absolute -inset-1 bg-gold-premium/20 rounded-3xl blur-xl opacity-50" />

              <div className="relative p-5">
                {/* Recommended Ribbon */}
                <div className="absolute -top-0 -right-8 bg-gold-premium text-black text-[10px] font-black py-1 px-10 rotate-45 transform origin-center">
                  RECOMMENDED
                </div>

                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                    selectedPackage === 'premium'
                      ? 'bg-gold-premium shadow-lg shadow-gold-premium/50'
                      : 'border-2 border-gold-premium/50'
                  }`}>
                    {selectedPackage === 'premium' && <Check className="w-4 h-4 text-black" />}
                  </div>
                  <div>
                    <span className="text-white font-black text-lg">6-Month Package</span>
                    <p className="text-gold-premium text-xs font-medium">Most Popular Choice</p>
                  </div>
                </div>

                {/* What you get */}
                <div className="bg-gold-premium/10 border border-gold-premium/30 rounded-xl p-4 mb-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-300">Videos included:</span>
                    <span className="text-gold-premium font-black text-lg">72 videos</span>
                  </div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-300">Delivery:</span>
                    <span className="text-white font-bold">3 per week</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-300">Duration:</span>
                    <span className="text-white font-bold">6 months</span>
                  </div>
                </div>

                {/* Price breakdown - DRAMATIC */}
                <div className="text-center bg-black/50 rounded-xl p-4">
                  <div className="flex items-center justify-center gap-3 mb-2">
                    <span className="text-gray-400 line-through text-xl">$1,350</span>
                    <span className="bg-green-500 text-white text-sm font-black px-2 py-0.5 rounded animate-pulse">SAVE 58%</span>
                  </div>
                  <p className="text-gold-premium font-black text-5xl mb-1">${packages.premium.totalPrice}</p>
                  <p className="text-gray-400 text-sm">Only <span className="text-gold-premium font-bold">${packages.premium.pricePerVideo}</span> per video</p>
                </div>
              </div>
            </div>

            {/* STARTER - 3 MONTH - BASIC OPTION */}
            <div
              onClick={() => setSelectedPackage('starter')}
              className={`relative cursor-pointer rounded-2xl overflow-hidden transition-all duration-300 ${
                selectedPackage === 'starter'
                  ? 'ring-2 ring-white/50 scale-[1.02]'
                  : 'ring-1 ring-white/10 opacity-70 hover:opacity-90'
              }`}
            >
              <div className="absolute inset-0 bg-zinc-950" />

              <div className="relative p-5">
                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                    selectedPackage === 'starter'
                      ? 'bg-white'
                      : 'border-2 border-gray-600'
                  }`}>
                    {selectedPackage === 'starter' && <Check className="w-4 h-4 text-black" />}
                  </div>
                  <div>
                    <span className="text-gray-300 font-bold text-lg">3-Month Package</span>
                    <p className="text-gray-500 text-xs">Starter Option</p>
                  </div>
                </div>

                {/* What you get */}
                <div className="bg-white/5 rounded-xl p-4 mb-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-500">Videos included:</span>
                    <span className="text-gray-300 font-bold">24 videos</span>
                  </div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-500">Delivery:</span>
                    <span className="text-gray-300">2 per week</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Duration:</span>
                    <span className="text-gray-300">3 months</span>
                  </div>
                </div>

                {/* Price */}
                <div className="text-center">
                  <p className="text-gray-300 font-black text-4xl mb-1">${packages.starter.totalPrice}</p>
                  <p className="text-gray-500 text-sm">${packages.starter.pricePerVideo} per video</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scarcity Bar */}
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm flex items-center gap-2">
              <Users className="w-4 h-4 text-red-400" />
              Monthly spots
            </span>
            <span className="text-red-400 font-bold">8/10 taken</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2.5">
            <div className="bg-red-500 h-2.5 rounded-full" style={{ width: '80%' }} />
          </div>
          <p className="text-gray-500 text-xs mt-2">Only {spotsLeft} spots left for quality control</p>
        </div>

        {/* Sara's Guarantee - Personal & Irresistible */}
        <div className="bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/30 rounded-xl sm:rounded-2xl p-4 sm:p-5 mb-6">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="flex items-center gap-3 sm:block sm:flex-shrink-0">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden border-2 border-green-500">
                <Image src="/images/Sara 61kb.webp" alt="Sara" width={56} height={56} className="object-cover" />
              </div>
              <p className="text-green-400 font-bold sm:hidden">My Personal Guarantee</p>
            </div>
            <div>
              <p className="text-green-400 font-bold mb-2 hidden sm:block">My Personal Guarantee</p>
              <p className="text-gray-300 text-sm leading-relaxed mb-2">
                "I'll send you the first video within 5 days. <span className="text-white font-bold">Watch it. Show it to friends. Post it.</span>
              </p>
              <p className="text-gray-300 text-sm leading-relaxed mb-2">
                Don't love it? <span className="text-green-400 font-bold">Full refund. No questions.</span>
              </p>
              <p className="text-gray-300 text-sm leading-relaxed">
                You risk nothing. I take all the risk."
              </p>
              <p className="text-green-400 font-medium text-sm mt-2">— Sara</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6 mb-6">
          <p className="text-center text-gray-400 text-sm mb-3">Your selection:</p>
          <p className="text-center text-white font-bold text-2xl mb-5">
            {currentPackage.totalVideos} videos for <span className="text-gold-premium">${currentPackage.totalPrice}</span>
          </p>

          <button
            onClick={handleCheckout}
            className="w-full bg-gradient-to-r from-gold-premium to-gold-dark text-black py-4 rounded-xl font-black text-lg hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg flex items-center justify-center gap-2 mb-4"
          >
            <Zap className="w-5 h-5" />
            Yes! Create My {currentPackage.totalVideos} Videos
            <ArrowRight className="w-5 h-5" />
          </button>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-gray-500 mb-5">
            <span className="flex items-center gap-1">
              <Send className="w-3.5 h-3.5" />
              Delivered to inbox
            </span>
            <span className="flex items-center gap-1">
              <RefreshCw className="w-3.5 h-3.5" />
              3 revisions/video
            </span>
            <span className="flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-green-500" />
              Risk-free guarantee
            </span>
          </div>

          {/* No Thanks Button - Very Clear */}
          <div className="border-t border-white/10 pt-5">
            <button
              onClick={handleDecline}
              className="w-full text-gray-500 hover:text-gray-300 text-sm py-3 transition-colors"
            >
              No thanks, I prefer to create my own content
            </button>
          </div>
        </div>
      </div>

      {/* Sticky Mobile CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-sm border-t border-white/10 p-3 sm:hidden z-50">
        <div className="flex items-center justify-between gap-3">
          <div className="flex-1">
            <p className="text-white font-bold text-sm">{currentPackage.totalVideos} videos</p>
            <p className="text-gold-premium font-black text-lg">${currentPackage.totalPrice}</p>
          </div>
          <button
            onClick={handleCheckout}
            className="bg-gradient-to-r from-gold-premium to-gold-dark text-black px-5 py-3 rounded-xl font-black text-sm flex items-center gap-1.5"
          >
            Get Started
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </main>
  )
}
