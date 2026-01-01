'use client'

import { CheckCircle, Copy, Star } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense, useState, useEffect, useRef } from 'react'
import { trackTikTokEvent } from '../components/TikTokPixel'

// Declare gtag and fbq for TypeScript
declare global {
  interface Window {
    gtag?: (...args: any[]) => void
    fbq?: (...args: any[]) => void
  }
}

// Generate unique event ID for deduplication between browser pixel and CAPI
function generateEventId(eventName: string): string {
  return `${eventName}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// CRITICAL: Track Meta Purchase with retry logic and EVENT_ID for deduplication
function trackMetaPurchase(params: {
  content_ids: string[]
  content_name: string
  content_type: string
  value: number
  currency: string
  eventID: string  // REQUIRED for deduplication with CAPI
}) {
  const attemptTrack = (retries: number) => {
    if (typeof window !== 'undefined' && window.fbq) {
      // Pass eventID as 4th parameter for deduplication
      window.fbq('track', 'Purchase', {
        content_ids: params.content_ids,
        content_name: params.content_name,
        content_type: params.content_type,
        value: params.value,
        currency: params.currency
      }, { eventID: params.eventID })
      console.log('Meta Purchase tracked with eventID:', params.eventID)
    } else if (retries > 0) {
      // Retry after 500ms if fbq not ready
      setTimeout(() => attemptTrack(retries - 1), 500)
    } else {
      console.warn('Meta fbq not available after retries')
    }
  }
  attemptTrack(5) // Try up to 5 times (2.5 seconds total)
}

function ThankYouContent() {
  const searchParams = useSearchParams()
  const purchased = searchParams.get('purchased')
  const [copied, setCopied] = useState(false)
  const [hasCopied, setHasCopied] = useState(false)
  const [showCopyWarning, setShowCopyWarning] = useState(false)

  // CRITICAL: Prevent double-firing from React StrictMode
  const hasTrackedPurchase = useRef(false)

  const password = "im the best agent in the world"

  // Fire purchase tracking for TikTok
  useEffect(() => {
    if (hasTrackedPurchase.current) return
    hasTrackedPurchase.current = true

    // Determine product and value based on purchase type
    let productName = '7 Minute AgentClone'
    let value = 37

    if (purchased === 'oto-premium') {
      productName = '6-Month Content Partner'
      value = 565
    } else if (purchased === 'oto-starter') {
      productName = '3-Month Quick Start'
      value = 295
    } else if (purchased === 'downsell') {
      productName = '3-Month Content Package'
      value = 195
    }

    // Track TikTok CompletePayment (browser pixel)
    trackTikTokEvent('CompletePayment', {
      content_id: purchased || 'main',
      content_name: productName,
      value: value,
      currency: 'USD'
    })

    // Track GA4 Purchase Event (for Google Ads conversions)
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'purchase', {
        transaction_id: `order_${Date.now()}`,
        value: value,
        currency: 'USD',
        items: [{
          item_id: purchased || 'main',
          item_name: productName,
          price: value,
          quantity: 1
        }]
      })
    }

    // CRITICAL: Generate ONE event ID for DEDUPLICATION
    // Same ID goes to browser pixel AND both CAPI endpoints so Meta deduplicates them
    const eventId = generateEventId('Purchase')

    // Track Meta Pixel Purchase Event (for Facebook Ads conversions)
    // Uses retry logic and eventID for deduplication with CAPI
    trackMetaPurchase({
      content_ids: [purchased || 'main'],
      content_name: productName,
      content_type: 'product',
      value: value,
      currency: 'USD',
      eventID: eventId  // SAME ID as CAPI
    })

    // Retrieve saved tracking params from localStorage (saved before Whop redirect)
    let savedTracking: Record<string, string> = {}
    try {
      const stored = localStorage.getItem('aifastscale_tracking')
      if (stored) {
        savedTracking = JSON.parse(stored)
        // Clear after reading to prevent duplicate attributions
        localStorage.removeItem('aifastscale_tracking')
      }
    } catch (e) {
      console.error('Error reading tracking data:', e)
    }

    // Get ttclid from URL params OR localStorage
    const ttclid = searchParams.get('ttclid') || savedTracking.ttclid || ''

    // Send server-side event via TikTok CAPI
    fetch('/api/tiktok-capi', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event_name: 'CompletePayment',
        content_id: purchased || 'main',
        content_name: productName,
        value: value,
        currency: 'USD',
        ttclid: ttclid,
        url: window.location.href,
        referrer: document.referrer
      })
    }).catch(console.error)

    // Get fbc/fbp from cookies OR localStorage (localStorage has pre-redirect values)
    const fbc = document.cookie.split('; ').find(row => row.startsWith('_fbc='))?.split('=')[1] || savedTracking._fbc || ''
    const fbp = document.cookie.split('; ').find(row => row.startsWith('_fbp='))?.split('=')[1] || savedTracking._fbp || ''

    // Send server-side event via Meta CAPI (for better iOS 14.5+ tracking)
    // PIXEL 1: Original Real Estate pixel - uses SAME eventId for deduplication
    fetch('/api/meta-capi', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventName: 'Purchase',
        eventId: eventId,  // SAME ID as browser pixel - CRITICAL for dedup
        sourceUrl: window.location.href,
        fbc: fbc,
        fbp: fbp,
        value: value,
        currency: 'USD',
        contentName: productName,
        contentType: 'product',
        contentIds: [purchased || 'main']
      })
    }).catch(console.error)

    // PIXEL 2: Real Estate 2 from Dentists Clone account - uses SAME eventId
    fetch('/api/realestate2-meta-capi', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventName: 'Purchase',
        eventId: eventId,  // SAME ID as browser pixel - CRITICAL for dedup
        sourceUrl: window.location.href,
        fbc: fbc,
        fbp: fbp,
        value: value,
        currency: 'USD',
        contentName: productName,
        contentType: 'product',
        contentIds: [purchased || 'main']
      })
    }).catch(console.error)

    console.log('Purchase tracked with eventId:', eventId)
  }, [purchased, searchParams])

  const copyPassword = () => {
    navigator.clipboard.writeText(password)
    setCopied(true)
    setHasCopied(true)
    setShowCopyWarning(false)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleEnterClick = (e: React.MouseEvent) => {
    if (!hasCopied) {
      e.preventDefault()
      setShowCopyWarning(true)
      // Auto-hide warning after 3 seconds
      setTimeout(() => setShowCopyWarning(false), 3000)
    }
  }

  // Force body to allow scroll on this page
  useEffect(() => {
    document.body.style.height = 'auto'
    document.body.style.overflow = 'auto'
    document.documentElement.style.height = 'auto'
    document.documentElement.style.overflow = 'auto'
    return () => {
      document.body.style.height = ''
      document.body.style.overflow = ''
      document.documentElement.style.height = ''
      document.documentElement.style.overflow = ''
    }
  }, [])

  return (
    <div className="bg-gradient-to-br from-[#0a0a0a] via-[#0a1128] to-[#1a1a2e]" style={{ minHeight: '100vh' }}>
      <div className="container mx-auto px-3 md:px-4 py-6 md:py-16" style={{ paddingBottom: 'max(8rem, calc(2rem + env(safe-area-inset-bottom)))' }}>
        <div className="mx-auto max-w-2xl">
          {/* Success Icon - Smaller on mobile */}
          <div className="mb-4 md:mb-8 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-[#d4af37]/20 blur-xl"></div>
              <CheckCircle className="relative h-14 w-14 md:h-20 md:w-20 text-[#d4af37]" />
            </div>
          </div>

          {/* Thank You Message - Compact on mobile */}
          <div className="mb-5 md:mb-8 text-center">
            <h1 className="mb-2 md:mb-4 text-2xl md:text-5xl font-black text-white">
              🎉 Payment Successful! 🎉
            </h1>
            <p className="text-base md:text-xl font-bold text-white">
              Welcome to AI FastScale!
            </p>
            <p className="text-gray-400 text-xs md:text-base mt-1">
              Check your email for details (arriving within 60 seconds)
            </p>
          </div>

          {/* PASSWORD & MEMBERS ACCESS - Optimized for mobile */}
          <div className="mb-5 md:mb-8 rounded-xl md:rounded-2xl bg-gradient-to-br from-[#d4af37]/20 via-[#d4af37]/10 to-transparent border border-[#d4af37] p-4 md:p-8 backdrop-blur-sm">
            <h2 className="text-lg md:text-2xl font-black text-white text-center mb-4 md:mb-6">
              🔐 YOUR MEMBERS AREA ACCESS
            </h2>

            {/* Password Display - Compact */}
            <div className="bg-[#0a0a0a]/60 backdrop-blur-sm rounded-lg p-3 md:p-5 mb-4 md:mb-6 border border-white/20">
              <p className="text-center text-[#d4af37] text-[10px] md:text-sm font-bold uppercase tracking-wide mb-2">
                Your Password:
              </p>

              <div className="bg-gradient-to-r from-[#0a1128] to-[#1a1a2e] rounded-lg p-2.5 md:p-4 border border-[#d4af37] mb-2 md:mb-3">
                <p className="text-center text-[#d4af37] text-sm md:text-xl font-black">
                  {password}
                </p>
              </div>

              {/* COPY Button */}
              <button
                onClick={copyPassword}
                className="w-full bg-white/10 hover:bg-white/20 border border-[#d4af37] text-[#d4af37] px-4 py-2 md:py-3 rounded-lg font-bold text-xs md:text-sm transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Copy className="w-3.5 h-3.5 md:w-4 md:h-4" />
                {copied ? '✓ Copied!' : 'Click to Copy Password'}
              </button>
            </div>

            {/* Warning Message - Show when user tries to enter without copying */}
            {showCopyWarning && (
              <div className="mb-3 bg-red-500/20 border border-red-500 rounded-lg p-3 text-center animate-pulse">
                <p className="text-red-400 font-bold text-xs md:text-sm">
                  ⚠️ Please copy your password first!
                </p>
                <p className="text-red-300/80 text-[10px] md:text-xs mt-1">
                  You'll need it to access the members area
                </p>
              </div>
            )}

            {/* Members Area Button */}
            <Link
              href={hasCopied ? "/members" : "#"}
              onClick={handleEnterClick}
              className="block w-full"
            >
              <div className={`w-full px-4 py-4 md:py-5 rounded-xl font-black text-base md:text-xl transition-all duration-200 shadow-lg text-center ${
                hasCopied
                  ? 'bg-gradient-to-r from-[#d4af37] to-[#f4d03f] text-[#0a0a0a] shadow-[#d4af37]/20 hover:scale-[1.02] active:scale-[0.98]'
                  : 'bg-gradient-to-r from-[#d4af37]/60 to-[#f4d03f]/60 text-[#0a0a0a]/70'
              }`}>
                <span className="flex items-center justify-center gap-2">
                  <Star className="w-4 h-4 md:w-5 md:h-5" />
                  {hasCopied ? 'ENTER MEMBERS AREA →' : '⬆️ COPY PASSWORD FIRST'}
                  <Star className="w-4 h-4 md:w-5 md:h-5" />
                </span>
              </div>
            </Link>
            <p className="mt-2 md:mt-3 text-[10px] md:text-sm font-medium text-gray-400 text-center">
              {hasCopied ? '🎁 Access all your bonuses and course materials' : '👆 Click "Copy Password" above first'}
            </p>
          </div>

          {/* Quick Steps - Compact on mobile */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-white/10 mb-5 md:mb-8">
            <h3 className="text-base md:text-xl font-black text-white mb-3 md:mb-5 text-center">
              Quick Start (3 Steps):
            </h3>

            <div className="space-y-3 md:space-y-4">
              <div className="flex gap-3 items-start">
                <div className="flex h-7 w-7 md:h-9 md:w-9 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-[#d4af37] to-[#f4d03f] text-xs md:text-base font-black text-[#0a0a0a]">
                  1
                </div>
                <div>
                  <h4 className="text-sm md:text-base font-bold text-white">
                    Copy Your Password
                  </h4>
                  <p className="text-gray-400 text-[10px] md:text-sm">
                    Click the copy button above to save your password
                  </p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <div className="flex h-7 w-7 md:h-9 md:w-9 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-[#d4af37] to-[#f4d03f] text-xs md:text-base font-black text-[#0a0a0a]">
                  2
                </div>
                <div>
                  <h4 className="text-sm md:text-base font-bold text-white">
                    Enter Members Area
                  </h4>
                  <p className="text-gray-400 text-[10px] md:text-sm">
                    Click the gold button to access all your bonuses
                  </p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <div className="flex h-7 w-7 md:h-9 md:w-9 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-[#d4af37] to-[#f4d03f] text-xs md:text-base font-black text-[#0a0a0a]">
                  3
                </div>
                <div>
                  <h4 className="text-sm md:text-base font-bold text-white">
                    Start Creating Videos
                  </h4>
                  <p className="text-gray-400 text-[10px] md:text-sm">
                    Follow the training to create your first AI video in 7 minutes
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Lifetime Access Notice - Compact */}
          <div className="rounded-lg md:rounded-xl bg-emerald-500/20 border border-emerald-400/50 p-3 md:p-5 text-center">
            <p className="text-white font-bold text-sm md:text-base mb-1">
              ✅ Lifetime Access Activated
            </p>
            <p className="text-white/70 text-[10px] md:text-sm">
              You get lifetime access + all future updates FREE forever
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ThankYouPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#0a1128] to-[#1a1a2e]" />}>
      <ThankYouContent />
    </Suspense>
  )
}
