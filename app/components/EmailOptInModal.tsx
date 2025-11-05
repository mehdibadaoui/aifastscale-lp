'use client'

import React, { useState, useEffect } from 'react'
import { Mail, Sparkles, CheckCircle, Loader, Gift, X } from 'lucide-react'

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

      // Prepare data to send
      const data = {
        email: email.trim().toLowerCase(),
        name: name.trim() || 'Not provided',
        source: 'Thank You Page - VIP List Popup',
        ip: '',
        userAgent: navigator.userAgent,
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

      {/* Modal */}
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-yellow-500/30 bg-gradient-to-br from-gray-900 to-black p-6 shadow-2xl md:p-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rounded-full bg-gray-800 p-2 text-gray-400 transition-colors hover:bg-gray-700 hover:text-white"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        {isSubscribed ? (
          // Success State
          <div className="text-center">
            <div className="mb-4 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500 md:h-20 md:w-20">
                <CheckCircle className="h-8 w-8 text-white md:h-10 md:w-10" />
              </div>
            </div>
            <h3 className="mb-3 text-2xl font-black text-green-400 md:text-3xl">
              You&apos;re On The VIP List! 🎉
            </h3>
            <p className="mx-auto max-w-2xl text-base text-gray-300 md:text-lg">
              Check your inbox - we just sent you the{' '}
              <span className="font-bold text-green-400">
                50 AI Prompts PDF (worth $47)
              </span>
              !
            </p>
            <p className="mt-3 text-sm text-gray-400">
              Redirecting to your download in 2 seconds...
            </p>
          </div>
        ) : (
          // Form State
          <>
            {/* Header */}
            <div className="mb-6 text-center md:mb-8">
              <div className="mb-3 flex items-center justify-center gap-2 md:mb-4">
                <Gift className="h-6 w-6 animate-bounce text-yellow-400 md:h-7 md:w-7" />
                <Sparkles className="h-6 w-6 animate-pulse text-yellow-400 md:h-7 md:w-7" />
              </div>
              <h2 className="mb-3 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-2xl font-black text-transparent md:mb-4 md:text-3xl">
                Get FREE AI Training Every Month
              </h2>
              <p className="mx-auto max-w-2xl text-base font-semibold text-gray-200 md:text-lg">
                Join 500+ agents receiving exclusive AI prompts, video scripts,
                and course updates
              </p>
            </div>

            {/* Benefits */}
            <div className="mb-6 space-y-3 md:mb-8">
              <div className="flex items-start gap-3">
                <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-400" />
                <p className="text-sm text-gray-300 md:text-base">
                  <span className="font-bold text-white">
                    Monthly AI prompts & real estate scripts
                  </span>{' '}
                  (worth $47/month)
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-400" />
                <p className="text-sm text-gray-300 md:text-base">
                  <span className="font-bold text-white">
                    First to know when we add new training modules
                  </span>
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-400" />
                <p className="text-sm text-gray-300 md:text-base">
                  <span className="font-bold text-white">
                    Exclusive tips & strategies
                  </span>{' '}
                  not shared anywhere else
                </p>
              </div>
            </div>

            {/* Bonus Badge */}
            <div className="mb-6 rounded-xl border border-green-500/30 bg-green-500/10 p-3 text-center md:mb-8 md:p-4">
              <p className="text-sm font-bold text-green-400 md:text-base">
                🎁 INSTANT BONUS: Get 50 AI Prompts PDF (Worth $47) When You
                Subscribe
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Input (Optional) */}
              <div>
                <label
                  htmlFor="modal-name"
                  className="mb-2 block text-sm font-semibold text-gray-300"
                >
                  Your Name (Optional)
                </label>
                <input
                  type="text"
                  id="modal-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full rounded-lg border-2 border-gray-600 bg-gray-900 px-4 py-3 text-base text-white placeholder-gray-500 transition-all focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>

              {/* Email Input (Required) */}
              <div>
                <label
                  htmlFor="modal-email"
                  className="mb-2 block text-sm font-semibold text-gray-300"
                >
                  Email Address <span className="text-yellow-400">*</span>
                </label>
                <input
                  type="email"
                  id="modal-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="your@email.com"
                  className="w-full rounded-lg border-2 border-gray-600 bg-gray-900 px-4 py-3 text-base text-white placeholder-gray-500 transition-all focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-3">
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="group relative w-full overflow-hidden rounded-xl p-0.5 transition-all hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <div className="absolute -inset-1 animate-pulse rounded-xl bg-gradient-to-r from-yellow-400 to-orange-500 opacity-75 blur transition group-hover:opacity-100"></div>
                <div className="relative flex items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 px-8 py-4 text-lg font-black text-black">
                  {isSubmitting ? (
                    <>
                      <Loader className="h-5 w-5 animate-spin" />
                      <span>Subscribing...</span>
                    </>
                  ) : (
                    <>
                      <Mail className="h-5 w-5" />
                      <span>YES, SEND ME FREE TRAINING</span>
                    </>
                  )}
                </div>
              </button>

              {/* Skip Button */}
              <button
                type="button"
                onClick={onClose}
                className="w-full rounded-lg border-2 border-gray-600 bg-transparent px-8 py-3 text-base font-semibold text-gray-400 transition-all hover:border-gray-500 hover:text-gray-300"
              >
                No thanks, just let me download
              </button>

              {/* Privacy Note */}
              <p className="text-center text-xs text-gray-500">
                Unsubscribe anytime. We respect your inbox and never spam.
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
