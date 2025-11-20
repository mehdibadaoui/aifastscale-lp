'use client'

import { useState, useEffect, useRef } from 'react'
import { Check, X, Clock, Crown, Zap, Shield, Star, MessageCircle, PlayCircle } from 'lucide-react'
import { WHOP } from '../config/constants'

export default function OTOPage() {
  const [timeLeft, setTimeLeft] = useState(10 * 60) // 10 minutes in seconds
  const [isLoading, setIsLoading] = useState(false)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  // 10-MINUTE COUNTDOWN TIMER
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
      // Create Whop checkout for OTO
      const response = await fetch('/api/checkout/whop', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId: WHOP.plans.oto,
          metadata: {
            type: 'oto',
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
    // Redirect to downsell page
    window.location.href = '/downsell'
  }

  const handlePlayVideo = () => {
    if (videoRef.current) {
      videoRef.current.play()
      setIsVideoPlaying(true)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-deep via-navy-rich to-black text-white overflow-x-hidden">
      <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        {/* REFINED TIMER - STICKY */}
        <div className="sticky top-0 z-50 mb-6">
          <div className="bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-lg rounded-xl p-4 shadow-xl border border-white/20">
            <div className="flex items-center justify-center gap-3">
              <Clock className="w-6 h-6 text-gold-premium" />
              <div className="text-center">
                <p className="text-white/70 text-xs md:text-sm font-semibold uppercase tracking-wide">
                  Special Offer Expires In
                </p>
                <div className="text-3xl md:text-4xl font-black text-gold-premium tabular-nums">
                  {formatTime(timeLeft)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* HEADLINE - CONSULTATIVE APPROACH */}
        <div className="text-center mb-8 space-y-4">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 backdrop-blur-sm border border-emerald-400/30 rounded-full px-6 py-2">
            <MessageCircle className="w-4 h-4 text-emerald-400" />
            <span className="text-emerald-400 font-bold text-sm uppercase tracking-widest">Quick Question...</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-black text-white leading-tight">
            Want Me To Create Your<br />
            <span className="text-gradient-gold">First AI Video For You?</span>
          </h1>

          <p className="text-xl md:text-2xl text-white/90 leading-relaxed">
            So you can <span className="text-emerald-400 font-bold">see exactly how it looks</span><br className="hidden md:block" />
            before you spend hours learning to do it yourself
          </p>

          <p className="text-base md:text-lg text-white/70 max-w-2xl mx-auto">
            I noticed most agents get stuck on their first video. They spend 3-4 hours trying different tools, getting frustrated with the editing, and often give up.
            <br /><br />
            What if I just created it for you in 24 hours instead?
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
              <div className="text-white/50 text-xs mt-1">Under 24hr guarantee</div>
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
              <span className="font-black text-gold-premium">Think about it:</span> While you're learning editing software and fighting with AI tools,
              <br className="hidden md:block" />
              <span className="text-emerald-400 font-bold">other agents are already booking appointments with videos like this.</span>
            </p>
          </div>
        </div>

        {/* MAIN OFFER CARD - VALUE FIRST */}
        <div className="bg-gradient-to-br from-navy-rich to-black rounded-2xl p-6 md:p-8 border-2 border-gold-premium shadow-2xl mb-6">
          {/* Empathy Section - Show Understanding */}
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Here's What You Get:
            </h2>
            <p className="text-white/70 text-base md:text-lg max-w-2xl mx-auto">
              Think of this as a <span className="text-emerald-400 font-bold">"test drive"</span> - you'll see exactly what your AI video looks like before investing time learning the system yourself.
            </p>
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
                  title: '24-Hour Delivery',
                  description: 'Or 100% refund + keep everything'
                },
                {
                  icon: <MessageCircle className="w-6 h-6 text-emerald-400" />,
                  title: 'Direct Support With Me',
                  description: 'Personal help from the founder (not support staff)'
                },
                {
                  icon: <Crown className="w-6 h-6 text-emerald-400" />,
                  title: 'Premium Editing',
                  description: 'Captions, effects, music - all included'
                },
                {
                  icon: <Zap className="w-6 h-6 text-emerald-400" />,
                  title: 'Unlimited Revisions',
                  description: 'Until you\'re 100% satisfied'
                },
                {
                  icon: <Shield className="w-6 h-6 text-emerald-400" />,
                  title: 'Money-Back Guarantee',
                  description: 'Not happy? Full refund, no questions'
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

          {/* GUARANTEE BOX */}
          <div className="bg-gradient-to-r from-emerald-500/20 to-green-500/20 border-2 border-emerald-400 rounded-xl p-6 mb-6">
            <div className="flex items-start gap-4">
              <Shield className="w-12 h-12 text-emerald-400 flex-shrink-0" />
              <div>
                <h4 className="text-xl font-black text-white mb-2">
                  🏆 24-Hour Guarantee
                </h4>
                <p className="text-white/90 text-sm leading-relaxed">
                  If I don't deliver your video within 24 hours, you get a <span className="text-emerald-400 font-bold">100% refund</span>
                  {' '}+ you keep all the bonuses and course materials. Zero risk for you.
                </p>
              </div>
            </div>
          </div>

          {/* PRICE REVEAL - AT THE END AFTER VALUE */}
          <div className="bg-gradient-to-br from-emerald-500/10 via-emerald-600/10 to-emerald-500/10 border-2 border-emerald-400/50 rounded-xl p-6 md:p-8 mb-6">
            <div className="text-center mb-4">
              <h3 className="text-2xl font-black text-white mb-3">
                So What's The Investment?
              </h3>
              <p className="text-white/80 text-base mb-6">
                Most agencies charge $150-300 for one custom video.<br />
                You could hire a freelancer on Fiverr for $75-120.<br />
                <span className="text-emerald-400 font-bold">Or you could try learning it yourself (3-4 hours + frustration)</span>
              </p>
            </div>

            <div className="flex items-center justify-center gap-6 mb-6">
              <div className="text-center">
                <p className="text-white/50 text-xs font-semibold uppercase mb-1">Normally</p>
                <p className="text-3xl md:text-4xl font-black text-white/30 line-through">$149</p>
              </div>
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-400/30">
                <Zap className="w-6 h-6 text-emerald-400" />
              </div>
              <div className="text-center">
                <p className="text-emerald-400 text-xs font-bold uppercase mb-1">
                  One-Time Offer Today
                </p>
                <p className="text-5xl md:text-6xl font-black text-emerald-400">$63</p>
              </div>
            </div>

            <div className="text-center pt-4 border-t border-emerald-400/20">
              <p className="text-white/90 text-sm mb-2">
                That's <span className="text-emerald-400 font-bold">58% off</span> - you save $86
              </p>
              <p className="text-white/70 text-xs">
                Plus you get direct access to me (the founder) for support<br />
                No middlemen, no support tickets - just message me directly
              </p>
            </div>
          </div>

          {/* TESTIMONIAL/SOCIAL PROOF */}
          <div className="bg-gold-premium/10 border-2 border-gold-premium/50 rounded-xl p-6 mb-6">
            <div className="flex gap-1 mb-3 justify-center">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-gold-premium text-gold-premium" />
              ))}
            </div>
            <p className="text-white/90 text-center italic mb-3">
              "I was skeptical, but they delivered my video in 18 hours and it got me 3 listing appointments in the first week. Best $63 I ever spent!"
            </p>
            <p className="text-gold-premium font-bold text-center">
              - Sarah M., Real Estate Agent
            </p>
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
              <span>{isLoading ? 'Processing...' : 'Yes! I Want Results Like Mr. Lucas - $63'}</span>
              <Check className="w-7 h-7" />
            </span>
          </button>

          {/* DECLINE BUTTON */}
          <button
            onClick={handleDecline}
            className="w-full bg-transparent border-2 border-white/30 text-white/70 hover:text-white hover:border-white/50 px-6 py-4 rounded-xl font-bold text-lg transition-all"
          >
            No thanks, I'll create it myself
          </button>
        </div>

        {/* REFINED URGENCY REMINDER */}
        <div className="text-center space-y-2">
          <p className="text-white/70 font-medium text-base flex items-center justify-center gap-2">
            <Clock className="w-4 h-4 text-gold-premium" />
            <span>{formatTime(timeLeft)} remaining at this price</span>
          </p>
          <p className="text-white/50 text-sm">
            This price is only available on this page, right now. Once you leave, it's gone forever.
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
