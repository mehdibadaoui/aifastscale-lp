'use client'

import React, { useState } from 'react'
import { Mail, Sparkles, CheckCircle, Loader, Gift } from 'lucide-react'

export default function EmailOptIn() {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [error, setError] = useState('')

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
        source: 'Thank You Page - VIP List',
        ip: '', // Optional: Add IP detection if needed
        userAgent: navigator.userAgent,
      }

      // Submit to Google Sheets via webhook
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        mode: 'no-cors', // Required for Google Apps Script
      })

      // Note: With no-cors mode, we can't read the response
      // So we assume success if no error is thrown
      setIsSubscribed(true)

      // Track conversion (optional)
      if (typeof window !== 'undefined' && (window as any).gtag) {
        ;(window as any).gtag('event', 'subscribe', {
          event_category: 'engagement',
          event_label: 'VIP Email List',
          value: 1,
        })
      }

      if (typeof window !== 'undefined' && (window as any).fbq) {
        ;(window as any).fbq('track', 'Lead', {
          content_name: 'VIP Email List',
          content_category: 'Email Subscribe',
          value: 0,
          currency: 'USD',
        })
      }
    } catch (err) {
      console.error('Email subscription error:', err)
      setError('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubscribed) {
    return (
      <div className="rounded-2xl border border-green-500/30 bg-gradient-to-br from-green-500/10 to-green-600/10 p-6 text-center backdrop-blur-sm md:p-8">
        <div className="mb-4 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500 md:h-20 md:w-20">
            <CheckCircle className="h-8 w-8 text-white md:h-10 md:w-10" />
          </div>
        </div>
        <h3 className="mb-3 text-2xl font-black text-green-400 md:text-3xl">
          You're On The VIP List! 🎉
        </h3>
        <p className="mx-auto max-w-2xl text-base text-gray-300 md:text-lg">
          Check your inbox - we just sent you the{' '}
          <span className="font-bold text-green-400">
            50 AI Prompts PDF (worth $47)
          </span>
          !
        </p>
        <p className="mt-3 text-sm text-gray-400">
          You'll get exclusive AI training, prompts, and course updates every
          month.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-yellow-500/30 bg-gradient-to-br from-yellow-500/5 to-orange-500/5 p-6 backdrop-blur-sm md:p-8">
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
          Join 500+ agents receiving exclusive AI prompts, video scripts, and
          course updates
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
          🎁 INSTANT BONUS: Get 50 AI Prompts PDF (Worth $47) When You Subscribe
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Input (Optional) */}
        <div>
          <label
            htmlFor="name"
            className="mb-2 block text-sm font-semibold text-gray-300"
          >
            Your Name (Optional)
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            className="w-full rounded-lg border-2 border-gray-600 bg-gray-900 px-4 py-3 text-base text-white placeholder-gray-500 transition-all focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>

        {/* Email Input (Required) */}
        <div>
          <label
            htmlFor="vip-email"
            className="mb-2 block text-sm font-semibold text-gray-300"
          >
            Email Address <span className="text-yellow-400">*</span>
          </label>
          <input
            type="email"
            id="vip-email"
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

        {/* Privacy Note */}
        <p className="text-center text-xs text-gray-500">
          Unsubscribe anytime. We respect your inbox and never spam.
        </p>
      </form>
    </div>
  )
}
