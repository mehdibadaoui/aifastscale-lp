'use client'

import { useState, useEffect, useRef } from 'react'
import { Check, X, Clock, Crown, Zap, Shield, Star, MessageCircle, PlayCircle } from 'lucide-react'
import { WHOP } from '../config/constants'

export default function DownsellPage() {
  const [timeLeft, setTimeLeft] = useState(5 * 60) // 5 minutes in seconds
  const [isLoading, setIsLoading] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  // Page transition animation - fade in on load
  useEffect(() => {
    // Smooth scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' })
    // Trigger fade-in animation
    setTimeout(() => setIsVisible(true), 100)
  }, [])

  // 5-MINUTE COUNTDOWN TIMER
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

  // Format countdown timer
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleAccept = async () => {
    setIsLoading(true)

    try {
      // Create Whop checkout for Downsell
      const response = await fetch('/api/checkout/whop', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId: WHOP.plans.downsell,
          metadata: {
            type: 'downsell',
          },
        }),
      })

      const data = await response.json()

      if (data.success && data.checkoutUrl) {
        // Redirect to Whop checkout
        window.location.href = data.checkoutUrl
      } else {
        console.error('Checkout error:', data.error)
        alert('Something went wrong. Please try again or contact support.')
        setIsLoading(false)
      }
    } catch (error) {
      console.error('Checkout error:', error)
      alert('Something went wrong. Please try again or contact support.')
      setIsLoading(false)
    }
  }

  const handleDecline = () => {
    // Redirect to thank you page
    window.location.href = '/thank-you-confirmed'
  }

  const handlePlayVideo = () => {
    if (videoRef.current) {
      videoRef.current.play()
      setIsVideoPlaying(true)
    }
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-purple-900/20 via-navy-deep to-black text-white overflow-x-hidden transition-opacity duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        {/* NEW OFFER BADGE - Shows this is different page */}
        <div className="text-center mb-4 animate-bounce">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-red-500 to-orange-500 px-6 py-3 rounded-full shadow-2xl border-2 border-white/30">
            <Zap className="w-5 h-5 text-white animate-pulse" />
            <span className="text-white font-black text-sm md:text-base uppercase tracking-widest">⚡ New Lower Price! Last Chance ⚡</span>
          </div>
        </div>
        {/* REFINED TIMER - STICKY */}
        <div className="sticky top-0 z-50 mb-6">
          <div className="bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-lg rounded-xl p-4 shadow-xl border border-white/20">
            <div className="flex items-center justify-center gap-3">
              <Clock className="w-6 h-6 text-gold-premium" />
              <div className="text-center">
                <p className="text-white/70 text-xs md:text-sm font-semibold uppercase tracking-wide">
                  Final Offer Expires In
                </p>
                <div className="text-3xl md:text-4xl font-black text-gold-premium tabular-nums">
                  {formatTime(timeLeft)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* REFINED HEADLINE */}
        <div className="text-center mb-8 space-y-4">
          <div className="inline-flex items-center gap-2 bg-gold-premium/10 backdrop-blur-sm border border-gold-premium/30 rounded-full px-6 py-2">
            <Zap className="w-4 h-4 text-gold-premium" />
            <span className="text-gold-premium font-bold text-sm uppercase tracking-widest">Last Chance - Final Offer</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-white leading-tight">
            Okay, One More Thing...
          </h1>

          <p className="text-2xl md:text-3xl font-bold text-white">
            I'll Drop The Price To
            <br />
            <span className="text-emerald-400 text-5xl">$39</span>
          </p>

          <p className="text-lg md:text-xl text-white/80">
            This is my absolute <span className="text-gold-premium font-bold">lowest price ever</span> for Done-For-You video creation.
            <br className="hidden md:block" />
            After you leave this page, this offer is gone forever.
          </p>
        </div>

        {/* MR LUCAS VIDEO + CASE STUDY - PSYCHOLOGICAL PROOF */}
        <div className="bg-gradient-to-br from-purple-900/30 via-navy-rich to-black rounded-2xl p-6 md:p-8 border-2 border-purple-500/50 shadow-2xl mb-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 bg-purple-500/20 backdrop-blur-sm border border-purple-400/40 rounded-full px-5 py-2 mb-4">
              <PlayCircle className="w-5 h-5 text-purple-400" />
              <span className="text-purple-300 font-bold text-sm uppercase tracking-widest">Verified Case Study</span>
            </div>
            <h2 className="text-2xl md:text-4xl font-black text-white mb-3 leading-tight">
              Watch The <span className="text-purple-400">Exact Video</span> We Created<br className="hidden md:block" />
              That Got Mr. Lucas <span className="text-emerald-400">3 Paid Clients</span> In 7 Days
            </h2>
            <p className="text-white/90 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
              This isn't a testimonial. This is the <span className="text-emerald-400 font-bold">actual AI video</span> we delivered to him.
              <br className="hidden md:block" />
              <span className="text-white/70">He posted it once. Got 3 appointments. Closed deals worth $12,000+ in commission.</span>
            </p>
          </div>

          {/* VIDEO PLAYER WITH CUSTOM PLAY BUTTON - VERTICAL REEL FORMAT */}
          <div className="relative w-full max-w-md mx-auto mb-6 group">
            <div className="relative aspect-[9/16] rounded-xl overflow-hidden shadow-2xl border-2 border-purple-400/30">
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                preload="metadata"
                playsInline
                poster="/images/mr-lucas-thumbnail.jpg"
                onPlay={() => setIsVideoPlaying(true)}
                onPause={() => setIsVideoPlaying(false)}
                onEnded={() => setIsVideoPlaying(false)}
                controls
              >
                <source src="/videos/Mr Lucas.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>

              {/* CUSTOM PROFESSIONAL PLAY BUTTON OVERLAY */}
              {!isVideoPlaying && (
                <div
                  onClick={handlePlayVideo}
                  className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm cursor-pointer transition-all duration-300 group-hover:bg-black/50"
                >
                  <div className="relative">
                    {/* Pulsing ring animation */}
                    <div className="absolute inset-0 rounded-full bg-purple-500/30 animate-ping" />
                    {/* Play button */}
                    <div className="relative flex items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-purple-500 via-purple-600 to-pink-500 shadow-2xl shadow-purple-500/50 group-hover:scale-110 transition-transform duration-300 border-4 border-white/20">
                      <PlayCircle className="w-10 h-10 md:w-12 md:h-12 text-white fill-white" />
                    </div>
                  </div>
                  <div className="absolute bottom-6 left-0 right-0 text-center">
                    <p className="text-white font-bold text-sm md:text-base drop-shadow-lg">
                      Click to see Mr. Lucas's results
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* SOCIAL PROOF STAMP */}
            <div className="absolute -top-3 -right-3 bg-emerald-500 text-white px-4 py-2 rounded-full shadow-xl border-2 border-white transform rotate-12 z-10">
              <p className="font-black text-xs md:text-sm uppercase">Real Results</p>
            </div>
          </div>

          {/* RESULTS HIGHLIGHT - SPECIFIC & CREDIBLE */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 text-center border border-purple-400/20 hover:border-purple-400/40 transition-all">
              <div className="text-3xl md:text-4xl font-black text-purple-400 mb-1">3</div>
              <div className="text-white/80 text-sm font-semibold">Listing Appointments</div>
              <div className="text-white/50 text-xs mt-1">In first 7 days</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 text-center border border-purple-400/20 hover:border-purple-400/40 transition-all">
              <div className="text-3xl md:text-4xl font-black text-purple-400 mb-1">18hrs</div>
              <div className="text-white/80 text-sm font-semibold">Delivery Time</div>
              <div className="text-white/50 text-xs mt-1">Under 48hr guarantee</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 text-center border border-purple-400/20 hover:border-purple-400/40 transition-all">
              <div className="text-3xl md:text-4xl font-black text-emerald-400 mb-1">$12K+</div>
              <div className="text-white/80 text-sm font-semibold">Commission Generated</div>
              <div className="text-white/50 text-xs mt-1">From ONE video</div>
            </div>
          </div>

          {/* PSYCHOLOGICAL TRIGGER: FEAR OF MISSING OUT */}
          <div className="bg-gradient-to-r from-gold-premium/20 to-yellow-500/20 border border-gold-premium/40 rounded-lg p-4">
            <p className="text-white/90 text-center text-sm md:text-base">
              <span className="font-black text-gold-premium">Last chance:</span> For just $39, you could have a proven video like this tomorrow.
              <br className="hidden md:block" />
              <span className="text-emerald-400 font-bold">Or spend the next month trying to figure it out yourself.</span>
            </p>
          </div>
        </div>

        {/* MAIN OFFER CARD */}
        <div className="bg-gradient-to-br from-navy-rich to-black rounded-2xl p-6 md:p-8 border-2 border-gold-premium shadow-2xl mb-6">
          {/* Product Title */}
          <div className="text-center mb-6">
            <h2 className="text-3xl md:text-4xl font-black text-gold-premium mb-2">
              Done-For-You AI Video
            </h2>
            <p className="text-lg text-white/80">
              I'll create your video + provide support
            </p>
          </div>

          {/* Refined Price Comparison */}
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-xl p-6 mb-6 border border-white/10">
            <div className="flex items-center justify-center gap-6">
              <div className="text-center">
                <p className="text-white/50 text-xs font-semibold uppercase mb-1">Original OTO</p>
                <p className="text-3xl md:text-4xl font-black text-white/30 line-through">$63</p>
              </div>
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gold-premium/10 border border-gold-premium/30">
                <Zap className="w-6 h-6 text-gold-premium" />
              </div>
              <div className="text-center">
                <p className="text-gold-premium text-xs font-bold uppercase mb-1">
                  Final Price
                </p>
                <p className="text-5xl md:text-6xl font-black text-emerald-400">$39</p>
              </div>
            </div>
            <div className="text-center mt-4 pt-4 border-t border-white/10">
              <p className="text-emerald-400 font-bold text-base">
                Save $24 (38% discount)
              </p>
            </div>
          </div>

          {/* What You Get */}
          <div className="space-y-4 mb-6">
            <h3 className="text-2xl font-black text-gold-premium text-center mb-4">
              What's Included:
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  icon: <Check className="w-6 h-6 text-emerald-400" />,
                  title: '1 Fully Edited AI Video',
                  description: 'Professional quality, ready to post'
                },
                {
                  icon: <Clock className="w-6 h-6 text-emerald-400" />,
                  title: '48-Hour Delivery',
                  description: 'Fast turnaround guaranteed'
                },
                {
                  icon: <MessageCircle className="w-6 h-6 text-emerald-400" />,
                  title: 'Email Support',
                  description: 'Get help when you need it'
                },
                {
                  icon: <Crown className="w-6 h-6 text-emerald-400" />,
                  title: 'Professional Editing',
                  description: 'Captions, effects, music included'
                },
                {
                  icon: <Zap className="w-6 h-6 text-emerald-400" />,
                  title: '1 Free Revision',
                  description: 'One round of changes included'
                },
                {
                  icon: <Shield className="w-6 h-6 text-emerald-400" />,
                  title: 'Money-Back Guarantee',
                  description: 'Not happy? Full refund'
                }
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 bg-white/5 rounded-lg p-4">
                  {item.icon}
                  <div>
                    <h4 className="font-bold text-white mb-1">{item.title}</h4>
                    <p className="text-white/70 text-sm">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* VALUE COMPARISON */}
          <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-2 border-purple-400 rounded-xl p-6 mb-6">
            <h4 className="text-xl font-black text-white mb-3 text-center">
              Why This Is Still A Steal:
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-white/80">Professional video editor:</span>
                <span className="text-white font-bold">$150-300</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/80">AI software subscriptions:</span>
                <span className="text-white font-bold">$50-100/mo</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/80">Your time to learn:</span>
                <span className="text-white font-bold">10+ hours</span>
              </div>
              <div className="border-t border-white/20 pt-2 mt-2 flex justify-between items-center">
                <span className="text-emerald-400 font-bold text-lg">Your price today:</span>
                <span className="text-emerald-400 font-black text-2xl">$39</span>
              </div>
            </div>
          </div>

          {/* GUARANTEE BOX */}
          <div className="bg-gradient-to-r from-emerald-500/20 to-green-500/20 border-2 border-emerald-400 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <Shield className="w-12 h-12 text-emerald-400 flex-shrink-0" />
              <div>
                <h4 className="text-xl font-black text-white mb-2">
                  🏆 100% Money-Back Guarantee
                </h4>
                <p className="text-white/90 text-sm leading-relaxed">
                  Don't like the video? Get a <span className="text-emerald-400 font-bold">full refund</span>
                  {' '}within 30 days. No questions asked. You have nothing to lose.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA BUTTONS */}
        <div className="space-y-4 mb-6">
          {/* REFINED ACCEPT BUTTON */}
          <button
            onClick={handleAccept}
            disabled={isLoading}
            className="group w-full bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-500 text-white px-8 py-6 rounded-xl font-black text-xl md:text-2xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-xl shadow-emerald-500/25 relative overflow-hidden border border-emerald-400/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            <span className="relative flex items-center justify-center gap-3">
              <Check className="w-7 h-7" />
              <span>{isLoading ? 'Processing...' : "Yes! I Want Results Like Mr. Lucas - $39"}</span>
              <Check className="w-7 h-7" />
            </span>
          </button>

          {/* DECLINE BUTTON */}
          <button
            onClick={handleDecline}
            className="w-full bg-transparent border-2 border-white/30 text-white/70 hover:text-white hover:border-white/50 px-6 py-4 rounded-xl font-bold text-lg transition-all"
          >
            No thanks, I'll pass on this offer
          </button>
        </div>

        {/* REFINED URGENCY */}
        <div className="text-center space-y-2">
          <p className="text-white/70 font-medium text-base flex items-center justify-center gap-2">
            <Clock className="w-4 h-4 text-gold-premium" />
            <span>{formatTime(timeLeft)} remaining at this price</span>
          </p>
          <p className="text-white/50 text-sm">
            This $39 price will never be offered again. It's now or never.
          </p>
        </div>

        {/* REFINED SCARCITY */}
        <div className="mt-6 bg-gold-premium/10 border border-gold-premium/30 backdrop-blur-sm rounded-xl p-4">
          <p className="text-center text-white/80 font-semibold text-sm">
            <Zap className="w-4 h-4 inline text-gold-premium mr-1" />
            <span className="text-gold-premium">Limited:</span> Only 3 DFY slots left today at this price
          </p>
        </div>

        {/* TRUST BADGES */}
        <div className="flex items-center justify-center gap-6 mt-8 text-white/60 text-sm">
          <span className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Secure Checkout
          </span>
          <span className="flex items-center gap-2">
            <Check className="w-4 h-4" />
            Money-Back Guarantee
          </span>
        </div>
      </div>
    </div>
  )
}
