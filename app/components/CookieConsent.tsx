'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Cookie, Shield, BarChart3, Settings, X } from 'lucide-react'

export interface CookieConsentState {
  essential: boolean
  analytics: boolean
  marketing: boolean
  timestamp: number
}

const CONSENT_KEY = 'cookie_consent'
const CONSENT_EXPIRY_DAYS = 365

export function getCookieConsent(): CookieConsentState | null {
  if (typeof window === 'undefined') return null
  const stored = localStorage.getItem(CONSENT_KEY)
  if (!stored) return null
  try {
    const consent = JSON.parse(stored) as CookieConsentState
    // Check if consent has expired (365 days)
    const expiryMs = CONSENT_EXPIRY_DAYS * 24 * 60 * 60 * 1000
    if (Date.now() - consent.timestamp > expiryMs) {
      localStorage.removeItem(CONSENT_KEY)
      return null
    }
    return consent
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

// Function to check if Meta Pixel should load
export function shouldLoadMetaPixel(): boolean {
  const consent = getCookieConsent()
  return consent?.marketing === true
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
      const timer = setTimeout(() => setShowBanner(true), 1000)
      return () => clearTimeout(timer)
    }
  }, [])

  const saveConsent = (consent: CookieConsentState) => {
    localStorage.setItem(CONSENT_KEY, JSON.stringify(consent))
    // Also set a cookie for server-side checking (365 days)
    document.cookie = `cookie_consent=${JSON.stringify(consent)};max-age=${CONSENT_EXPIRY_DAYS * 24 * 60 * 60};path=/;SameSite=Lax`
    setShowBanner(false)
    setShowPreferences(false)

    // Dispatch custom event so tracking scripts can react
    window.dispatchEvent(new CustomEvent('cookieConsentUpdated', { detail: consent }))

    // If marketing consent given, trigger Meta Pixel load
    if (consent.marketing) {
      window.dispatchEvent(new CustomEvent('loadMetaPixel'))
    }
  }

  const handleAcceptAll = () => {
    saveConsent({
      essential: true,
      analytics: true,
      marketing: true,
      timestamp: Date.now(),
    })
  }

  const handleEssentialOnly = () => {
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
    <>
      {/* Main Banner */}
      {!showPreferences && (
        <div
          className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-md z-[9999] bg-black/95 backdrop-blur-sm border border-white/10 rounded-2xl shadow-2xl p-5"
          role="dialog"
          aria-label="Cookie consent"
          aria-describedby="cookie-description"
        >
          <div className="flex items-start gap-3 mb-4">
            <div className="flex-shrink-0 w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center">
              <Cookie className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="text-white font-bold text-base mb-1">Cookie Notice</h3>
              <p id="cookie-description" className="text-white/70 text-sm leading-relaxed">
                We use cookies to enhance your experience.{' '}
                <Link href="/privacy-policy" className="text-amber-400 hover:text-amber-300 underline">
                  Privacy Policy
                </Link>
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={handleAcceptAll}
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold rounded-xl hover:from-amber-600 hover:to-amber-700 transition-all text-sm active:scale-[0.98]"
            >
              Accept All
            </button>
            <button
              onClick={handleEssentialOnly}
              className="flex-1 px-4 py-2.5 border border-white/20 text-white/80 font-medium rounded-xl hover:bg-white/5 hover:text-white transition-all text-sm active:scale-[0.98]"
            >
              Essential Only
            </button>
            <button
              onClick={() => setShowPreferences(true)}
              className="px-4 py-2.5 text-white/60 font-medium rounded-xl hover:bg-white/5 hover:text-white/90 transition-all text-sm active:scale-[0.98] flex items-center justify-center gap-1.5"
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Manage</span>
            </button>
          </div>
        </div>
      )}

      {/* Preferences Modal */}
      {showPreferences && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div
            className="w-full max-w-lg bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
            role="dialog"
            aria-label="Cookie preferences"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center">
                  <Settings className="w-5 h-5 text-amber-400" />
                </div>
                <h3 className="text-white font-bold text-lg">Cookie Preferences</h3>
              </div>
              <button
                onClick={() => setShowPreferences(false)}
                className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-5 space-y-4 max-h-[60vh] overflow-y-auto">
              {/* Essential Cookies */}
              <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-green-400" />
                    <span className="text-white font-semibold">Essential Cookies</span>
                  </div>
                  <span className="text-xs text-green-400 bg-green-400/10 px-2 py-1 rounded-full">Always On</span>
                </div>
                <p className="text-white/60 text-sm">
                  Required for site functionality including authentication, shopping cart, and security features. Cannot be disabled.
                </p>
              </div>

              {/* Analytics Cookies */}
              <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-blue-400" />
                    <span className="text-white font-semibold">Analytics Cookies</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.analytics}
                      onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                  </label>
                </div>
                <p className="text-white/60 text-sm">
                  Help us understand how visitors interact with our website to improve user experience.
                </p>
              </div>

              {/* Marketing Cookies */}
              <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Cookie className="w-5 h-5 text-amber-400" />
                    <span className="text-white font-semibold">Marketing Cookies</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.marketing}
                      onChange={(e) => setPreferences({ ...preferences, marketing: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                  </label>
                </div>
                <p className="text-white/60 text-sm">
                  Used by Meta Pixel to deliver relevant advertisements and measure ad campaign effectiveness.
                </p>
              </div>

              <p className="text-white/50 text-xs">
                Your preferences are stored for 365 days. You can change them anytime by clearing your browser cookies.{' '}
                <Link href="/privacy-policy" className="text-amber-400 hover:text-amber-300 underline">
                  Learn more
                </Link>
              </p>
            </div>

            {/* Footer */}
            <div className="flex gap-3 p-5 border-t border-white/10 bg-black/20">
              <button
                onClick={handleEssentialOnly}
                className="flex-1 px-4 py-2.5 border border-white/20 text-white/80 font-medium rounded-xl hover:bg-white/5 transition-all text-sm"
              >
                Essential Only
              </button>
              <button
                onClick={handleSavePreferences}
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold rounded-xl hover:from-amber-600 hover:to-amber-700 transition-all text-sm"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
