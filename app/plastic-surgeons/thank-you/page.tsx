'use client'

import { CheckCircle, Copy, ArrowRight, Mail, Loader2, Gift, Lock, Zap, Users, Sparkles, Crown, Star, Shield, Rocket } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Suspense, useEffect, useState, useCallback } from 'react'

interface Credentials {
  email: string
  password: string
  name: string
}

// Track Purchase (fires once per session)
const trackPurchase = () => {
  if (typeof window === 'undefined') return
  if (sessionStorage.getItem('ps_purchase_tracked')) return

  if ((window as any).fbq) {
    (window as any).fbq('track', 'Purchase', {
      content_name: 'CloneYourself for Plastic Surgeons',
      content_type: 'product',
      value: 47.82,
      currency: 'USD',
    })
    sessionStorage.setItem('ps_purchase_tracked', '1')
  }
}

// Confetti Component - Optimized for mobile (fewer particles)
const Confetti = () => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setIsMobile(window.innerWidth < 768)
  }, [])

  const particleCount = isMobile ? 25 : 50

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {[...Array(particleCount)].map((_, i) => (
        <div
          key={i}
          className="absolute animate-confetti"
          style={{
            left: `${Math.random() * 100}%`,
            top: '-10px',
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${3 + Math.random() * 2}s`,
          }}
        >
          <div
            className="w-2 h-2 sm:w-3 sm:h-3 rotate-45"
            style={{
              backgroundColor: ['#F59E0B', '#FBBF24', '#FDE68A', '#10B981', '#6366F1', '#EC4899'][Math.floor(Math.random() * 6)],
            }}
          />
        </div>
      ))}
    </div>
  )
}

// Animated Success Icon - Mobile optimized
const SuccessIcon = () => (
  <div className="relative">
    {/* Outer glow rings - reduced blur on mobile for performance */}
    <div className="absolute inset-0 animate-ping-slow">
      <div className="w-28 h-28 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-r from-amber-500/20 to-emerald-500/20 blur-lg sm:blur-xl" />
    </div>
    <div className="absolute inset-0 animate-pulse">
      <div className="w-28 h-28 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-r from-amber-500/30 to-emerald-500/30 blur-md sm:blur-lg" />
    </div>

    {/* Main icon */}
    <div className="relative w-28 h-28 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-emerald-400 via-emerald-500 to-emerald-600 flex items-center justify-center shadow-2xl shadow-emerald-500/50 animate-bounce-gentle">
      <div className="absolute inset-2 rounded-full bg-gradient-to-br from-white/20 to-transparent" />
      <CheckCircle className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 text-white drop-shadow-lg" strokeWidth={2.5} />
    </div>

    {/* Sparkles around - hidden on very small screens */}
    <Sparkles className="hidden sm:block absolute -top-2 -right-2 w-6 h-6 sm:w-8 sm:h-8 text-amber-400 animate-pulse" />
    <Star className="hidden sm:block absolute -bottom-1 -left-3 w-5 h-5 sm:w-6 sm:h-6 text-amber-400 animate-pulse" style={{ animationDelay: '0.5s' }} />
    <Sparkles className="hidden md:block absolute top-1/2 -right-6 w-5 h-5 text-emerald-400 animate-pulse" style={{ animationDelay: '1s' }} />
  </div>
)

function ThankYouContent() {
  const router = useRouter()
  const [copiedPassword, setCopiedPassword] = useState(false)
  const [credentials, setCredentials] = useState<Credentials | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showFallback, setShowFallback] = useState(false)
  const [hasVisited, setHasVisited] = useState(false)
  const [showConfetti, setShowConfetti] = useState(true)

  // Hide confetti after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 5000)
    return () => clearTimeout(timer)
  }, [])

  // Check if already visited (prevent double view)
  useEffect(() => {
    const visited = sessionStorage.getItem('plastic_surgeon_thankyou_visited')
    if (visited) {
      setHasVisited(true)
    }
  }, [])

  // Track Purchase on page load (once per session)
  useEffect(() => {
    const timer = setTimeout(() => trackPurchase(), 500)
    return () => clearTimeout(timer)
  }, [])

  const fetchCredentials = useCallback(async (email?: string, userId?: string) => {
    try {
      const params = new URLSearchParams()
      if (email) params.set('email', email)
      if (userId) params.set('user_id', userId)

      const response = await fetch(`/api/plastic-surgeon-credentials?${params.toString()}`)
      const data = await response.json()

      if (data.found) {
        setCredentials({ email: data.email, password: data.password, name: data.name || '' })
        setIsLoading(false)
        return true
      }
      return false
    } catch (error) {
      console.error('Error fetching credentials:', error)
      return false
    }
  }, [])

  useEffect(() => {
    const startPolling = async () => {
      const storedEmail = sessionStorage.getItem('plastic_surgeon_purchase_email')
      const storedUserId = sessionStorage.getItem('plastic_surgeon_purchase_user_id')
      const params = new URLSearchParams(window.location.search)
      const urlEmail = params.get('email')?.toLowerCase()
      const urlUserId = params.get('user_id') || params.get('whop_user_id')

      const email = urlEmail || storedEmail
      const userId = urlUserId || storedUserId

      if (!email && !userId) {
        setIsLoading(false)
        setShowFallback(true)
        return
      }

      const maxPolls = 15
      let currentPoll = 0

      const poll = async () => {
        currentPoll++
        const found = await fetchCredentials(email || undefined, userId || undefined)
        if (found) return

        if (currentPoll < maxPolls) {
          setTimeout(poll, 2000)
        } else {
          setIsLoading(false)
          setShowFallback(true)
        }
      }

      poll()
    }

    startPolling()
  }, [fetchCredentials])

  const copyPassword = () => {
    if (credentials) {
      navigator.clipboard.writeText(credentials.password)
      setCopiedPassword(true)
    }
  }

  const handleLoginClick = () => {
    if (!copiedPassword) return

    // Mark as visited to prevent coming back
    sessionStorage.setItem('plastic_surgeon_thankyou_visited', 'true')

    // Replace current history entry so user can't go back to thank-you
    window.history.replaceState(null, '', '/plastic-surgeons/members')

    // Navigate to members page
    router.push('/plastic-surgeons/members')
  }

  // If user already visited and tries to come back, redirect to members
  useEffect(() => {
    if (hasVisited) {
      router.replace('/plastic-surgeons/members')
    }
  }, [hasVisited, router])


  if (hasVisited) {
    return (
      <div className="min-h-screen bg-[#030303] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#030303] relative overflow-x-hidden">
      {/* Confetti */}
      {showConfetti && <Confetti />}

      {/* Animated Background - Optimized for mobile */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient orbs - smaller and less blur on mobile */}
        <div className="absolute top-0 left-1/4 w-[300px] sm:w-[400px] md:w-[600px] h-[300px] sm:h-[400px] md:h-[600px] bg-amber-500/10 rounded-full blur-[80px] sm:blur-[100px] md:blur-[150px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[250px] sm:w-[350px] md:w-[500px] h-[250px] sm:h-[350px] md:h-[500px] bg-emerald-500/10 rounded-full blur-[60px] sm:blur-[80px] md:blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />

        {/* Grid pattern - hidden on mobile for performance */}
        <div
          className="hidden sm:block absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-6 sm:py-8 md:py-16 max-w-2xl">

        {/* SUCCESS HEADER */}
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          {/* Success Icon */}
          <div className="flex justify-center mb-6 sm:mb-8">
            <SuccessIcon />
          </div>

          {/* Congratulations Text */}
          <div className="space-y-3 sm:space-y-4">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500/20 to-amber-500/20 border border-emerald-500/30 mb-2 sm:mb-4">
              <Crown className="w-4 h-4 text-amber-400" />
              <span className="text-xs sm:text-sm font-bold text-amber-300 uppercase tracking-wider">Welcome to the Family</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-6xl font-black">
              <span className="bg-gradient-to-r from-white via-white to-white/80 bg-clip-text text-transparent">
                Congratulations!
              </span>
            </h1>

            <p className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-emerald-400 to-amber-400 bg-clip-text text-transparent">
              Your Purchase is Complete
            </p>

            <p className="text-base sm:text-lg text-white/60 max-w-md mx-auto px-2">
              You've made an incredible decision. Get ready to transform your practice with AI-powered video content.
            </p>
          </div>

          {/* Social Proof - Stack on mobile */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 mt-6 sm:mt-8">
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
              <Users className="w-4 h-4 text-amber-400" />
              <span className="text-white text-sm font-medium">
                Joined <span className="text-amber-400 font-bold">850+</span> surgeons
              </span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span className="text-white text-sm font-medium">
                Lifetime Access
              </span>
            </div>
          </div>
        </div>

        {/* LOADING STATE */}
        {isLoading && (
          <div className="rounded-2xl sm:rounded-3xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/10 p-6 sm:p-8 md:p-10 backdrop-blur-xl text-center">
            <div className="relative inline-block mb-4 sm:mb-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-500/10 flex items-center justify-center">
                <Loader2 className="w-8 h-8 sm:w-10 sm:h-10 text-amber-400 animate-spin" />
              </div>
            </div>
            <p className="text-white text-xl sm:text-2xl font-bold mb-2">Setting Up Your Account</p>
            <p className="text-white/50 text-sm sm:text-base">This only takes a moment...</p>

            {/* Progress dots */}
            <div className="flex items-center justify-center gap-2 mt-4 sm:mt-6">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>
          </div>
        )}

        {/* CREDENTIALS DISPLAY */}
        {credentials && !isLoading && (
          <>
            {/* Main Card */}
            <div className="rounded-2xl sm:rounded-3xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/10 overflow-hidden backdrop-blur-xl mb-4 sm:mb-6">
              {/* Card Header */}
              <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border-b border-white/10 px-4 sm:px-6 py-4 sm:py-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/30 flex-shrink-0">
                    <Rocket className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-white">Your Access Credentials</h2>
                    <p className="text-white/50 text-xs sm:text-sm">Save these to login anytime</p>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 sm:p-6 md:p-8">
                {/* Credentials */}
                <div className="space-y-4 mb-6 sm:mb-8">
                  {/* Email */}
                  <div>
                    <label className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
                      <Mail className="w-3.5 h-3.5" />
                      Your Email
                    </label>
                    <div className="bg-black/40 rounded-lg sm:rounded-xl px-4 sm:px-5 py-3 sm:py-4 border border-white/10">
                      <p className="text-white text-sm sm:text-base md:text-lg font-medium break-all">{credentials.email}</p>
                    </div>
                  </div>

                  {/* Password - Stack button on mobile */}
                  <div>
                    <label className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
                      <Lock className="w-3.5 h-3.5" />
                      Your Password
                    </label>
                    <div className="bg-black/40 rounded-lg sm:rounded-xl px-4 sm:px-5 py-3 sm:py-4 border border-amber-500/30">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <p className="text-white text-base sm:text-lg font-mono font-medium tracking-wider">{credentials.password}</p>
                        <button
                          onClick={copyPassword}
                          className={`flex items-center justify-center gap-2 px-5 py-3 sm:py-2.5 rounded-lg sm:rounded-xl font-bold text-sm transition-all min-h-[44px] ${
                            copiedPassword
                              ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                              : 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/30 active:scale-95 sm:hover:shadow-amber-500/50 sm:hover:scale-105'
                          }`}
                        >
                          {copiedPassword ? (
                            <><CheckCircle className="w-5 h-5" /> Copied!</>
                          ) : (
                            <><Copy className="w-5 h-5" /> Copy Password</>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Login Button */}
                <button
                  onClick={handleLoginClick}
                  disabled={!copiedPassword}
                  className={`group w-full font-bold text-base sm:text-lg py-4 sm:py-5 rounded-xl sm:rounded-2xl transition-all flex items-center justify-center gap-2 sm:gap-3 min-h-[56px] ${
                    copiedPassword
                      ? 'bg-gradient-to-r from-amber-500 via-amber-500 to-amber-600 text-white shadow-xl shadow-amber-500/30 active:scale-[0.98] sm:hover:shadow-amber-500/50 sm:hover:scale-[1.02]'
                      : 'bg-white/5 text-white/30 cursor-not-allowed border border-white/10'
                  }`}
                >
                  {copiedPassword ? (
                    <>
                      <Zap className="w-5 h-5 sm:w-6 sm:h-6" />
                      <span>Access Members Area</span>
                      <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-1 transition-transform" />
                    </>
                  ) : (
                    <>
                      <Lock className="w-5 h-5" />
                      <span>Copy Password First</span>
                    </>
                  )}
                </button>

                {!copiedPassword && (
                  <p className="text-center text-white/40 text-xs sm:text-sm mt-3 sm:mt-4 flex items-center justify-center gap-2">
                    <ArrowRight className="w-4 h-4 -rotate-90" />
                    Tap "Copy Password" above to continue
                  </p>
                )}
              </div>
            </div>

            {/* What's Included */}
            <div className="rounded-xl sm:rounded-2xl bg-white/[0.03] border border-white/10 p-4 sm:p-6 mb-4 sm:mb-6">
              <h3 className="text-base sm:text-lg font-bold text-white mb-4 sm:mb-5 flex items-center gap-2">
                <Gift className="w-5 h-5 text-amber-400" />
                What's Waiting For You
              </h3>

              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                {[
                  { icon: '🎬', text: 'AI Video Training' },
                  { icon: '📝', text: '100+ Viral Scripts' },
                  { icon: '🤖', text: 'AI Content Generator' },
                  { icon: '📅', text: '365-Day Content' },
                  { icon: '⭐', text: 'Review System' },
                  { icon: '📞', text: 'Phone Scripts' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-lg sm:rounded-xl bg-white/[0.03] border border-white/5">
                    <span className="text-lg sm:text-xl">{item.icon}</span>
                    <span className="text-white/80 text-xs sm:text-sm font-medium">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Info Cards - Stack on mobile */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
              {/* Email Backup */}
              <div className="rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20 p-4 sm:p-5">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm sm:text-base mb-1">Email Backup Sent</p>
                    <p className="text-white/50 text-xs sm:text-sm">
                      Login details sent to your email too.
                    </p>
                  </div>
                </div>
              </div>

              {/* Free Updates */}
              <div className="rounded-xl sm:rounded-2xl bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20 p-4 sm:p-5">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm sm:text-base mb-1">Free Forever Updates</p>
                    <p className="text-white/50 text-xs sm:text-sm">
                      New content added monthly. No fees.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Lifetime Badge */}
            <div className="rounded-xl sm:rounded-2xl bg-gradient-to-r from-emerald-500/20 via-emerald-500/10 to-amber-500/20 border border-emerald-500/30 p-4 sm:p-5 text-center">
              <div className="flex items-center justify-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 fill-amber-400" />
                ))}
              </div>
              <p className="text-white font-bold text-base sm:text-lg mt-2 sm:mt-3 flex items-center justify-center gap-2">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
                Lifetime Access Activated
              </p>
              <p className="text-emerald-300/70 text-xs sm:text-sm mt-1">
                One-time payment · Free updates forever
              </p>
            </div>
          </>
        )}

        {/* FALLBACK - Check Email */}
        {showFallback && !credentials && !isLoading && (
          <>
            <div className="rounded-2xl sm:rounded-3xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/10 p-6 sm:p-8 md:p-10 backdrop-blur-xl mb-4 sm:mb-6 text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-xl shadow-amber-500/30">
                <Mail className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>

              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2 sm:mb-3">
                Check Your Email
              </h2>
              <p className="text-white/60 text-base sm:text-lg mb-6 sm:mb-8">
                Your login credentials have been sent to your inbox.
              </p>

              <div className="bg-black/40 rounded-lg sm:rounded-xl p-4 sm:p-5 border border-white/10 mb-6 sm:mb-8 text-left max-w-sm mx-auto">
                <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Look for email from:</p>
                <p className="text-white font-bold text-base sm:text-lg">hello@mail.aifastscale.com</p>
                <p className="text-amber-400 text-xs sm:text-sm mt-3 flex items-center gap-2">
                  <span>💡</span> Check spam/promotions if not in inbox
                </p>
              </div>

              <button
                onClick={() => {
                  sessionStorage.setItem('plastic_surgeon_thankyou_visited', 'true')
                  window.history.replaceState(null, '', '/plastic-surgeons/members')
                  router.push('/plastic-surgeons/members')
                }}
                className="w-full max-w-sm mx-auto bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold text-base sm:text-lg py-4 sm:py-5 rounded-xl sm:rounded-2xl flex items-center justify-center gap-2 sm:gap-3 shadow-xl shadow-amber-500/30 active:scale-[0.98] sm:hover:shadow-amber-500/50 sm:hover:scale-[1.02] transition-all min-h-[56px]"
              >
                <Zap className="w-5 h-5 sm:w-6 sm:h-6" />
                Go to Login Page
                <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            {/* 3 Quick Steps */}
            <div className="rounded-xl sm:rounded-2xl bg-white/[0.03] border border-white/10 p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-bold text-white mb-4 sm:mb-5 text-center">
                3 Quick Steps to Get Started
              </h3>
              <div className="flex items-center justify-between gap-2 sm:gap-4">
                {[
                  { icon: Mail, text: 'Check email' },
                  { icon: Copy, text: 'Copy password' },
                  { icon: Rocket, text: 'Start creating' },
                ].map((step, i) => (
                  <div key={i} className="flex flex-col items-center text-center flex-1">
                    <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center mb-2 sm:mb-3 ${
                      i === 0
                        ? 'bg-gradient-to-br from-amber-500 to-amber-600 shadow-lg shadow-amber-500/30'
                        : 'bg-white/10'
                    }`}>
                      <step.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <span className="text-xs sm:text-sm text-white/70 font-medium">{step.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Support */}
        <p className="text-center text-white/30 text-xs sm:text-sm mt-8 sm:mt-10 px-4">
          Need help? Email us at{' '}
          <a href="mailto:support@aifastscale.com" className="text-amber-400 hover:text-amber-300 transition-colors">
            support@aifastscale.com
          </a>
        </p>

      </div>

      {/* CSS for animations and browser compatibility */}
      <style jsx global>{`
        /* Fallback for browsers without backdrop-filter */
        @supports not (backdrop-filter: blur(1px)) {
          .backdrop-blur-sm, .backdrop-blur-xl {
            background-color: rgba(0, 0, 0, 0.8) !important;
          }
        }

        @keyframes confetti {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        .animate-confetti {
          animation: confetti linear forwards;
        }
        @keyframes ping-slow {
          0%, 100% {
            transform: scale(1);
            opacity: 0.5;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.3;
          }
        }
        .animate-ping-slow {
          animation: ping-slow 2s ease-in-out infinite;
        }
        @keyframes bounce-gentle {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }
        .animate-bounce-gentle {
          animation: bounce-gentle 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}

export default function PlasticSurgeonThankYouPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#030303] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
      </div>
    }>
      <ThankYouContent />
    </Suspense>
  )
}
