'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export interface CookieConsentState {
  essential: boolean
  analytics: boolean
  marketing: boolean
  timestamp: number
}

const CONSENT_KEY = 'cookie_consent'

export function getCookieConsent(): CookieConsentState | null {
  if (typeof window === 'undefined') return null
  const stored = localStorage.getItem(CONSENT_KEY)
  if (!stored) return null
  try {
    return JSON.parse(stored) as CookieConsentState
  } catch {
    return null
  }
}

export function hasMarketingConsent(): boolean {
  const consent = getCookieConsent()
  return consent?.marketing === true
}

export function hasAnalyticsConsent(): boolean {
  const consent = getCookieConsent()
  return consent?.analytics === true
}

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    // Check if consent already given
    const consent = getCookieConsent()
    if (!consent) {
      // Small delay to avoid layout shift on initial load
      const timer = setTimeout(() => setShowBanner(true), 1000)
      return () => clearTimeout(timer)
    }
  }, [])

  const saveConsent = (consent: CookieConsentState) => {
    localStorage.setItem(CONSENT_KEY, JSON.stringify(consent))
    setShowBanner(false)

    // Dispatch custom event so tracking scripts can react
    window.dispatchEvent(new CustomEvent('cookieConsentUpdated', { detail: consent }))
  }

  const handleAccept = () => {
    saveConsent({
      essential: true,
      analytics: true,
      marketing: true,
      timestamp: Date.now(),
    })
  }

  const handleDecline = () => {
    saveConsent({
      essential: true,
      analytics: false,
      marketing: false,
      timestamp: Date.now(),
    })
  }

  if (!showBanner) return null

  return (
    <div
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-sm z-[9999] bg-black/95 backdrop-blur-sm border border-white/10 rounded-2xl shadow-2xl p-4"
      role="dialog"
      aria-label="Cookie consent"
    >
      <p className="text-white/90 text-sm leading-relaxed mb-3">
        We use cookies to improve your experience.{' '}
        <Link href="/privacy-policy" className="text-amber-400 hover:text-amber-300 underline">
          Learn more
        </Link>
      </p>
      <div className="flex gap-2">
        <button
          onClick={handleAccept}
          className="flex-1 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold rounded-xl hover:from-amber-600 hover:to-amber-700 transition-all text-sm active:scale-[0.98]"
        >
          Accept
        </button>
        <button
          onClick={handleDecline}
          className="px-4 py-2.5 border border-white/20 text-white/70 font-medium rounded-xl hover:bg-white/5 hover:text-white transition-all text-sm active:scale-[0.98]"
        >
          Decline
        </button>
      </div>
    </div>
  )
}
