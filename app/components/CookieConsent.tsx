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
  const [showPreferences, setShowPreferences] = useState(false)
  const [preferences, setPreferences] = useState({
    analytics: true,
    marketing: true,
  })

  useEffect(() => {
    // Check if consent already given
    const consent = getCookieConsent()
    if (!consent) {
      // Small delay to avoid layout shift on initial load
      const timer = setTimeout(() => setShowBanner(true), 500)
      return () => clearTimeout(timer)
    }
  }, [])

  const saveConsent = (consent: CookieConsentState) => {
    localStorage.setItem(CONSENT_KEY, JSON.stringify(consent))
    setShowBanner(false)
    setShowPreferences(false)

    // Dispatch custom event so tracking scripts can react
    window.dispatchEvent(new CustomEvent('cookieConsentUpdated', { detail: consent }))
  }

  const handleAcceptAll = () => {
    saveConsent({
      essential: true,
      analytics: true,
      marketing: true,
      timestamp: Date.now(),
    })
  }

  const handleRejectNonEssential = () => {
    saveConsent({
      essential: true,
      analytics: false,
      marketing: false,
      timestamp: Date.now(),
    })
  }

  const handleSavePreferences = () => {
    saveConsent({
      essential: true,
      analytics: preferences.analytics,
      marketing: preferences.marketing,
      timestamp: Date.now(),
    })
  }

  if (!showBanner) return null

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[9999] bg-[#1a1a2e] border-t border-gray-700 shadow-2xl"
      role="dialog"
      aria-label="Cookie consent"
    >
      {!showPreferences ? (
        // Main Banner
        <div className="max-w-7xl mx-auto px-4 py-4 md:py-5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-1">
              <p className="text-white text-sm md:text-base leading-relaxed">
                <span className="mr-2">🍪</span>
                We use cookies to enhance your experience and analyze site traffic.
                By clicking &quot;Accept All,&quot; you consent to our use of cookies.{' '}
                <Link
                  href="/privacy-policy"
                  className="text-violet-400 hover:text-violet-300 underline"
                >
                  Privacy Policy
                </Link>
              </p>
            </div>
            <div className="flex flex-wrap gap-2 md:gap-3">
              <button
                onClick={handleAcceptAll}
                className="px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-violet-700 hover:to-indigo-700 transition-all text-sm md:text-base"
              >
                Accept All
              </button>
              <button
                onClick={() => setShowPreferences(true)}
                className="px-4 py-2 border border-gray-500 text-gray-300 font-medium rounded-lg hover:bg-gray-800 hover:border-gray-400 transition-all text-sm md:text-base"
              >
                Manage Preferences
              </button>
              <button
                onClick={handleRejectNonEssential}
                className="px-4 py-2 border border-gray-600 text-gray-400 font-medium rounded-lg hover:bg-gray-800 hover:text-gray-300 transition-all text-sm md:text-base"
              >
                Reject Non-Essential
              </button>
            </div>
          </div>
        </div>
      ) : (
        // Preferences Panel
        <div className="max-w-7xl mx-auto px-4 py-5">
          <h3 className="text-white font-bold text-lg mb-4">Cookie Preferences</h3>

          <div className="space-y-4 mb-5">
            {/* Essential Cookies - Always on */}
            <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
              <div>
                <p className="text-white font-medium">Essential Cookies</p>
                <p className="text-gray-400 text-sm">Required for website functionality (checkout, authentication)</p>
              </div>
              <div className="bg-green-600 text-white text-xs px-2 py-1 rounded">Always On</div>
            </div>

            {/* Analytics Cookies */}
            <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
              <div>
                <p className="text-white font-medium">Analytics Cookies</p>
                <p className="text-gray-400 text-sm">Help us understand how visitors interact with our website</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.analytics}
                  onChange={(e) => setPreferences(p => ({ ...p, analytics: e.target.checked }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-600"></div>
              </label>
            </div>

            {/* Marketing Cookies */}
            <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
              <div>
                <p className="text-white font-medium">Marketing Cookies</p>
                <p className="text-gray-400 text-sm">Used for targeted advertising (Meta Pixel, TikTok Pixel)</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.marketing}
                  onChange={(e) => setPreferences(p => ({ ...p, marketing: e.target.checked }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-600"></div>
              </label>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleSavePreferences}
              className="px-5 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-violet-700 hover:to-indigo-700 transition-all"
            >
              Save Preferences
            </button>
            <button
              onClick={() => setShowPreferences(false)}
              className="px-5 py-2 border border-gray-500 text-gray-300 font-medium rounded-lg hover:bg-gray-800 transition-all"
            >
              Back
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
