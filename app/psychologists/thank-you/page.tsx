'use client'

import { CheckCircle, Copy, ArrowRight, Mail, Loader2, Gift, Lock, Zap, Users } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Suspense, useEffect, useState, useCallback } from 'react'

interface Credentials {
  email: string
  password: string
  name: string
}

// ===========================================
// PURCHASE TRACKING - Browser Pixel + CAPI
// ===========================================
const trackPurchase = (email?: string) => {
  if (typeof window === 'undefined') return

  // Prevent duplicate tracking
  if (sessionStorage.getItem('psychologist_purchase_tracked')) {
    console.log('📊 Purchase already tracked, skipping duplicate')
    return
  }

  const purchaseValue = 47.82 // Main course price
  const eventId = `Purchase_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

  // 1. Browser Pixel
  if ((window as any).fbq) {
    (window as any).fbq('track', 'Purchase', {
      value: purchaseValue,
      currency: 'USD',
      content_name: 'CloneYourself for Psychologists',
      content_type: 'product',
      content_ids: ['psychologist-main'],
    }, { eventID: eventId })
    console.log('📊 Purchase pixel fired:', purchaseValue)
  }

  // Mark as tracked IMMEDIATELY to prevent duplicates
  sessionStorage.setItem('psychologist_purchase_tracked', 'true')

  // 2. Server-side CAPI (backup - can't be blocked)
  const getCookie = (name: string) => {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
    return match ? match[2] : undefined
  }

  fetch('/api/psychologist-meta-capi', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      eventName: 'Purchase',
      value: purchaseValue,
      currency: 'USD',
      contentName: 'CloneYourself for Psychologists',
      contentIds: ['psychologist-main'],
      sourceUrl: window.location.href,
      eventId: eventId,
      email: email,
      fbc: getCookie('_fbc') || sessionStorage.getItem('psychologist_fbc'),
      fbp: getCookie('_fbp'),
      userAgent: navigator.userAgent,
    }),
  }).then(res => res.json())
    .then(data => console.log('📊 Purchase CAPI response:', data))
    .catch(err => console.error('📊 Purchase CAPI error:', err))
}

function ThankYouContent() {
  const router = useRouter()
  const [copiedPassword, setCopiedPassword] = useState(false)
  const [credentials, setCredentials] = useState<Credentials | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showFallback, setShowFallback] = useState(false)
  const [hasVisited, setHasVisited] = useState(false)

  // Check if already visited (prevent double view)
  useEffect(() => {
    const visited = sessionStorage.getItem('psychologist_thankyou_visited')
    if (visited) {
      setHasVisited(true)
    }
  }, [])

  const fetchCredentials = useCallback(async (email?: string, userId?: string) => {
    try {
      const params = new URLSearchParams()
      if (email) params.set('email', email)
      if (userId) params.set('user_id', userId)

      const response = await fetch(`/api/psychologist-credentials?${params.toString()}`)
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
      const storedEmail = sessionStorage.getItem('psychologist_purchase_email')
      const storedUserId = sessionStorage.getItem('psychologist_purchase_user_id')
      const params = new URLSearchParams(window.location.search)
      const urlEmail = params.get('email')?.toLowerCase()
      const urlUserId = params.get('user_id') || params.get('whop_user_id')

      const email = urlEmail || storedEmail
      const userId = urlUserId || storedUserId

      if (!email && !userId) {
        setIsLoading(false)
        setShowFallback(true)
        // Still track purchase even without email (they completed checkout)
        setTimeout(() => trackPurchase(), 500)
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
    sessionStorage.setItem('psychologist_thankyou_visited', 'true')

    // Replace current history entry so user can't go back to thank-you
    window.history.replaceState(null, '', '/psychologists/members')

    // Navigate to members page
    router.push('/psychologists/members')
  }

  // If user already visited and tries to come back, redirect to members
  useEffect(() => {
    if (hasVisited) {
      router.replace('/psychologists/members')
    }
  }, [hasVisited, router])

  // Track Purchase when credentials are confirmed
  useEffect(() => {
    if (credentials && credentials.email) {
      // Small delay to ensure page is fully loaded
      setTimeout(() => trackPurchase(credentials.email), 500)
    }
  }, [credentials])

  if (hasVisited) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#0a1a2e] to-[#1a2a3e] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-teal-500 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#0a1a2e] to-[#1a2a3e]">
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-2xl">

        {/* SUCCESS HEADER */}
        <div className="text-center mb-8">
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 rounded-full bg-teal-500/30 blur-xl animate-pulse"></div>
            <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-teal-500/30">
              <CheckCircle className="w-10 h-10 md:w-12 md:h-12 text-white" strokeWidth={2.5} />
            </div>
          </div>

          <h1 className="text-3xl md:text-5xl font-black text-white mb-3">
            You're In!
          </h1>
          <p className="text-xl md:text-2xl font-bold text-teal-400 mb-4">
            Payment Successful
          </p>

          {/* Social Proof */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
            <Users className="w-4 h-4 text-teal-400" />
            <span className="text-white text-sm font-medium">
              You joined <span className="text-teal-400 font-bold">750+</span> psychologists & therapists
            </span>
          </div>
        </div>

        {/* LOADING STATE */}
        {isLoading && (
          <div className="rounded-2xl bg-gradient-to-br from-teal-500/20 via-teal-500/10 to-transparent border border-teal-500/30 p-8 backdrop-blur-sm text-center">
            <Loader2 className="w-12 h-12 text-teal-400 animate-spin mx-auto mb-4" />
            <p className="text-white text-xl font-bold">Setting up your account...</p>
            <p className="text-white/60 mt-2">This only takes a few seconds</p>
          </div>
        )}

        {/* CREDENTIALS DISPLAY */}
        {credentials && !isLoading && (
          <>
            {/* Login Card */}
            <div className="rounded-2xl bg-gradient-to-br from-teal-500/20 via-teal-500/10 to-transparent border border-teal-500 p-6 md:p-8 backdrop-blur-sm mb-6">

              <h2 className="text-xl md:text-2xl font-bold text-white text-center mb-6">
                Your Login Details
              </h2>

              {/* Credentials Box */}
              <div className="bg-[#0a0a0a]/80 rounded-xl p-5 mb-6 border border-teal-500/30">

                {/* Email */}
                <div className="mb-4">
                  <p className="text-teal-400 text-xs font-semibold uppercase tracking-wider mb-2">Email</p>
                  <div className="bg-white/5 rounded-lg px-4 py-3 border border-white/10">
                    <p className="text-white text-base font-medium">{credentials.email}</p>
                  </div>
                </div>

                {/* Password */}
                <div>
                  <p className="text-teal-400 text-xs font-semibold uppercase tracking-wider mb-2">Password</p>
                  <div className="bg-white/5 rounded-lg px-4 py-3 border border-teal-500/50 flex items-center justify-between gap-3">
                    <p className="text-white text-base font-medium">{credentials.password}</p>
                    <button
                      onClick={copyPassword}
                      className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all flex items-center gap-2 ${
                        copiedPassword
                          ? 'bg-emerald-500 text-white'
                          : 'bg-teal-500 hover:bg-teal-400 text-white'
                      }`}
                    >
                      {copiedPassword ? (
                        <><CheckCircle className="w-4 h-4" /> Copied</>
                      ) : (
                        <><Copy className="w-4 h-4" /> Copy</>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Login Button - Disabled until password copied */}
              <button
                onClick={handleLoginClick}
                disabled={!copiedPassword}
                className={`w-full font-bold text-lg py-4 rounded-xl transition-all flex items-center justify-center gap-2 ${
                  copiedPassword
                    ? 'bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-white shadow-lg shadow-teal-500/30 cursor-pointer'
                    : 'bg-white/10 text-white/40 cursor-not-allowed border border-white/10'
                }`}
              >
                {copiedPassword ? (
                  <>
                    <Zap className="w-5 h-5" />
                    Login to Members Area
                    <ArrowRight className="w-5 h-5" />
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5" />
                    Copy Password First
                  </>
                )}
              </button>

              {!copiedPassword && (
                <p className="text-center text-white/50 text-sm mt-3">
                  Click "Copy" above to enable login
                </p>
              )}
            </div>

            {/* 3 QUICK STEPS */}
            <div className="bg-white/5 rounded-xl p-5 border border-white/10 mb-6">
              <h3 className="text-base font-bold text-white mb-4 text-center">
                3 Quick Steps to Get Started
              </h3>

              <div className="flex items-center justify-between gap-2">
                {[
                  { num: '1', icon: Copy, text: 'Copy password', active: !copiedPassword },
                  { num: '2', icon: ArrowRight, text: 'Login above', active: copiedPassword },
                  { num: '3', icon: Zap, text: 'Create videos', active: false },
                ].map((step, i) => (
                  <div key={i} className="flex flex-col items-center text-center flex-1">
                    <div className={`w-11 h-11 rounded-full flex items-center justify-center mb-2 transition-all ${
                      step.active
                        ? 'bg-teal-500 shadow-lg shadow-teal-500/30'
                        : i < (copiedPassword ? 2 : 1) ? 'bg-teal-500/70' : 'bg-white/10'
                    }`}>
                      <step.icon className={`w-5 h-5 ${step.active ? 'text-white' : 'text-white/70'}`} />
                    </div>
                    <span className="text-xs text-white/70 font-medium">{step.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* INFO CARDS */}
            <div className="space-y-4">
              {/* Email Backup */}
              <div className="bg-white/5 rounded-xl p-4 border border-white/10 flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-teal-500/20 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-teal-400" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">Login Saved to Your Email</p>
                  <p className="text-white/60 text-sm">
                    We sent the same login details to your email. Access them anytime you need.
                  </p>
                </div>
              </div>

              {/* Free Updates */}
              <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-xl p-4 border border-amber-500/20 flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                  <Gift className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">Stay Tuned — Free Updates</p>
                  <p className="text-white/60 text-sm">
                    We add new courses & bonuses every month. 100% free forever. No subscriptions. No hidden fees.
                  </p>
                </div>
              </div>
            </div>

            {/* Lifetime Access Badge */}
            <div className="mt-6 rounded-xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 p-4 text-center">
              <p className="text-white font-semibold flex items-center justify-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                Lifetime Access Activated
              </p>
              <p className="text-emerald-300/70 text-sm mt-1">
                One-time payment. Free updates forever.
              </p>
            </div>
          </>
        )}

        {/* FALLBACK - Check Email */}
        {showFallback && !credentials && !isLoading && (
          <>
            <div className="rounded-2xl bg-gradient-to-br from-teal-500/20 via-teal-500/10 to-transparent border border-teal-500 p-6 md:p-8 backdrop-blur-sm mb-6 text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-white" />
              </div>

              <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
                Check Your Email
              </h2>
              <p className="text-white/70 mb-6">
                Your login details have been sent to your email.
              </p>

              <div className="bg-white/5 rounded-lg p-4 border border-white/10 mb-6 text-left">
                <p className="text-white/50 text-xs mb-1">Look for email from:</p>
                <p className="text-white font-semibold">hello@mail.aifastscale.com</p>
                <p className="text-amber-400 text-sm mt-2">Check spam/promotions if not in inbox</p>
              </div>

              <button
                onClick={() => {
                  sessionStorage.setItem('psychologist_thankyou_visited', 'true')
                  window.history.replaceState(null, '', '/psychologists/members')
                  router.push('/psychologists/members')
                }}
                className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-bold text-lg py-4 rounded-xl flex items-center justify-center gap-2"
              >
                <Zap className="w-5 h-5" />
                Go to Login Page
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            {/* 3 Quick Steps for Fallback */}
            <div className="bg-white/5 rounded-xl p-5 border border-white/10">
              <h3 className="text-base font-bold text-white mb-4 text-center">
                3 Quick Steps
              </h3>
              <div className="flex items-center justify-between gap-2">
                {[
                  { num: '1', icon: Mail, text: 'Check email' },
                  { num: '2', icon: Copy, text: 'Copy password' },
                  { num: '3', icon: Zap, text: 'Login & create' },
                ].map((step, i) => (
                  <div key={i} className="flex flex-col items-center text-center flex-1">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-1 ${
                      i === 0 ? 'bg-teal-500' : i === 1 ? 'bg-teal-500/60' : 'bg-teal-500/30'
                    }`}>
                      <step.icon className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-xs text-white/70 font-medium">{step.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Support */}
        <p className="text-center text-white/40 text-sm mt-8">
          Need help? Email us at{' '}
          <a href="mailto:support@aifastscale.com" className="text-teal-400 hover:underline">
            support@aifastscale.com
          </a>
        </p>

      </div>
    </div>
  )
}

export default function PsychologistThankYouPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#0a1a2e] to-[#1a2a3e] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-teal-500 animate-spin" />
      </div>
    }>
      <ThankYouContent />
    </Suspense>
  )
}
