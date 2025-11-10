'use client'

import React, { useState, useEffect } from 'react'
import { Mail, Sparkles, CheckCircle, Loader, Gift, X } from 'lucide-react'

// Helper function to get country from timezone
function getCountryFromTimezone(timezone: string): string {
  // Map common timezones to countries
  const timezoneMap: { [key: string]: string } = {
    // Middle East / GCC
    'Asia/Dubai': 'UAE',
    'Asia/Riyadh': 'Saudi Arabia',
    'Asia/Kuwait': 'Kuwait',
    'Asia/Qatar': 'Qatar',
    'Asia/Bahrain': 'Bahrain',
    'Asia/Muscat': 'Oman',
    'Asia/Doha': 'Qatar',
    'Asia/Baghdad': 'Iraq',
    'Asia/Amman': 'Jordan',
    'Asia/Beirut': 'Lebanon',
    'Asia/Damascus': 'Syria',
    'Asia/Jerusalem': 'Israel',

    // Southeast Asia
    'Asia/Bangkok': 'Thailand',
    'Asia/Singapore': 'Singapore',
    'Asia/Kuala_Lumpur': 'Malaysia',
    'Asia/Jakarta': 'Indonesia',
    'Asia/Manila': 'Philippines',
    'Asia/Ho_Chi_Minh': 'Vietnam',
    'Asia/Yangon': 'Myanmar',
    'Asia/Phnom_Penh': 'Cambodia',
    'Asia/Vientiane': 'Laos',

    // East Asia
    'Asia/Tokyo': 'Japan',
    'Asia/Shanghai': 'China',
    'Asia/Hong_Kong': 'Hong Kong',
    'Asia/Taipei': 'Taiwan',
    'Asia/Seoul': 'South Korea',
    'Asia/Macau': 'Macau',

    // South Asia
    'Asia/Kolkata': 'India',
    'Asia/Karachi': 'Pakistan',
    'Asia/Dhaka': 'Bangladesh',
    'Asia/Kathmandu': 'Nepal',
    'Asia/Colombo': 'Sri Lanka',

    // Europe
    'Europe/London': 'UK',
    'Europe/Paris': 'France',
    'Europe/Berlin': 'Germany',
    'Europe/Madrid': 'Spain',
    'Europe/Rome': 'Italy',
    'Europe/Amsterdam': 'Netherlands',
    'Europe/Brussels': 'Belgium',
    'Europe/Vienna': 'Austria',
    'Europe/Zurich': 'Switzerland',
    'Europe/Stockholm': 'Sweden',
    'Europe/Oslo': 'Norway',
    'Europe/Copenhagen': 'Denmark',
    'Europe/Helsinki': 'Finland',
    'Europe/Warsaw': 'Poland',
    'Europe/Prague': 'Czech Republic',
    'Europe/Athens': 'Greece',
    'Europe/Lisbon': 'Portugal',
    'Europe/Dublin': 'Ireland',
    'Europe/Istanbul': 'Turkey',
    'Europe/Moscow': 'Russia',

    // Americas - USA
    'America/New_York': 'USA',
    'America/Los_Angeles': 'USA',
    'America/Chicago': 'USA',
    'America/Denver': 'USA',
    'America/Phoenix': 'USA',
    'America/Detroit': 'USA',
    'America/Anchorage': 'USA',
    'America/Honolulu': 'USA',
    'Pacific/Honolulu': 'USA',

    // Americas - Other
    'America/Toronto': 'Canada',
    'America/Vancouver': 'Canada',
    'America/Mexico_City': 'Mexico',
    'America/Sao_Paulo': 'Brazil',
    'America/Buenos_Aires': 'Argentina',
    'America/Bogota': 'Colombia',
    'America/Lima': 'Peru',
    'America/Santiago': 'Chile',

    // Africa
    'Africa/Cairo': 'Egypt',
    'Africa/Johannesburg': 'South Africa',
    'Africa/Lagos': 'Nigeria',
    'Africa/Nairobi': 'Kenya',
    'Africa/Casablanca': 'Morocco',
    'Africa/Algiers': 'Algeria',

    // Oceania
    'Australia/Sydney': 'Australia',
    'Australia/Melbourne': 'Australia',
    'Australia/Brisbane': 'Australia',
    'Australia/Perth': 'Australia',
    'Pacific/Auckland': 'New Zealand',
  }

  // Check if we have a direct match
  if (timezoneMap[timezone]) {
    return timezoneMap[timezone]
  }

  // Extract region from timezone (e.g., "Europe" from "Europe/Madrid")
  const region = timezone.split('/')[0]
  return region || 'Unknown'
}

interface EmailOptInModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function EmailOptInModal({
  isOpen,
  onClose,
}: EmailOptInModalProps) {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [error, setError] = useState('')

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email) {
      setError('Please enter your email address')
      return
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address')
      return
    }

    setIsSubmitting(true)

    try {
      const webhookUrl = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_WEBHOOK_URL

      if (!webhookUrl) {
        throw new Error('Webhook URL not configured')
      }

      // Get upsell info from URL params (passed from thank-you page)
      const urlParams = new URLSearchParams(window.location.search)
      const upsell = urlParams.get('upsell')

      // Determine product purchased and upsell info
      let productPurchased = 'Course Only'
      let upsellPurchased = 'None'

      if (upsell === 'blueprint17') {
        productPurchased = 'Course + $17 Blueprint'
        upsellPurchased = '$17 Blueprint'
      } else if (upsell === 'blueprint7') {
        productPurchased = 'Course + $7 Blueprint'
        upsellPurchased = '$7 Blueprint'
      }

      // Get country from browser (approximate via timezone)
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
      const country = getCountryFromTimezone(timezone)

      // Prepare data to send
      const data = {
        email: email.trim().toLowerCase(),
        name: name.trim() || 'Not provided',
        country: country,
        productPurchased: productPurchased,
        upsellPurchased: upsellPurchased,
        paymentMethod: 'Card', // Default to Card (Stripe doesn't expose this easily)
      }

      // Log for debugging
      console.log('📧 Submitting email to webhook:', webhookUrl)
      console.log('📊 Data:', data)

      // Submit to Google Sheets via webhook
      // Note: Google Apps Script requires 'no-cors' mode
      // This means we can't read the response, but the request will work
      await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: JSON.stringify(data),
        mode: 'no-cors', // Required for Google Apps Script
      })

      console.log('✅ Email submitted successfully!')
      console.log('📋 Check your Google Sheet to verify it was added')

      setIsSubscribed(true)

      // Track conversion
      if (typeof window !== 'undefined' && (window as any).gtag) {
        ;(window as any).gtag('event', 'subscribe', {
          event_category: 'engagement',
          event_label: 'VIP Email List Popup',
          value: 1,
        })
      }

      if (typeof window !== 'undefined' && (window as any).fbq) {
        ;(window as any).fbq('track', 'Lead', {
          content_name: 'VIP Email List Popup',
          content_category: 'Email Subscribe',
          value: 0,
          currency: 'USD',
        })
      }

      // Auto-close after 2 seconds on success
      setTimeout(() => {
        onClose()
      }, 2000)
    } catch (err) {
      console.error('Email subscription error:', err)
      setError('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal - Compact for mobile */}
      <div className="relative w-full max-w-md rounded-2xl border border-yellow-500/30 bg-gradient-to-br from-gray-900 to-black p-6 shadow-2xl">

        {isSubscribed ? (
          // Success State - Compact
          <div className="text-center">
            <div className="mb-4 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
            </div>
            <h3 className="mb-2 text-xl font-black text-green-400">
              You&apos;re In! 🎉
            </h3>
            <p className="text-sm text-gray-300">
              Check your inbox for the bonus PDF!
            </p>
          </div>
        ) : (
          // Form State - Minimal & Clean
          <>
            {/* Header - Compact */}
            <div className="mb-5 text-center">
              <div className="mb-2 flex items-center justify-center gap-2">
                <Gift className="h-5 w-5 text-yellow-400" />
                <Sparkles className="h-5 w-5 text-yellow-400" />
              </div>
              <h2 className="mb-2 text-xl font-black text-yellow-400">
                Get FREE AI Training Every Month
              </h2>
              <p className="text-sm text-gray-300">
                Join 500+ agents getting exclusive updates
              </p>
            </div>

            {/* Form - Minimal */}
            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Name Input */}
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your Name (Optional)"
                className="w-full rounded-lg border-2 border-gray-700 bg-gray-900 px-4 py-2.5 text-sm text-white placeholder-gray-500 transition-all focus:border-yellow-400 focus:outline-none"
              />

              {/* Email Input */}
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Email Address *"
                className="w-full rounded-lg border-2 border-gray-700 bg-gray-900 px-4 py-2.5 text-sm text-white placeholder-gray-500 transition-all focus:border-yellow-400 focus:outline-none"
              />

              {/* Error Message */}
              {error && (
                <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-2">
                  <p className="text-xs text-red-400">{error}</p>
                </div>
              )}

              {/* Submit Button - Compact */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 px-6 py-3 text-base font-black text-black shadow-lg transition-all hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader className="h-4 w-4 animate-spin" />
                    Subscribing...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Mail className="h-4 w-4" />
                    YES, SEND ME FREE TRAINING
                  </span>
                )}
              </button>

              {/* Skip Button - Small text */}
              <button
                type="button"
                onClick={onClose}
                className="w-full text-xs text-gray-500 hover:text-gray-400 transition-colors underline"
              >
                No thanks, just let me download
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
