'use client'

import React, { useState } from 'react'
import { X, Mail, Sparkles, CheckCircle, Loader } from 'lucide-react'

interface DemoEmailCaptureModalProps {
  isOpen: boolean
  onEmailSubmit: (email: string) => void
}

export default function DemoEmailCaptureModal({ isOpen, onEmailSubmit }: DemoEmailCaptureModalProps) {
  const [email, setEmail] = useState('')
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  if (!isOpen) return null

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validate email
    if (!email.trim()) {
      setError('Please enter your email address')
      return
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address')
      return
    }

    if (!isSubscribed) {
      setError('Please check the box to receive your video')
      return
    }

    setIsSubmitting(true)

    try {
      // Submit email to your email service (Mailchimp, ConvertKit, etc.)
      const response = await fetch('/api/subscribe-demo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit email')
      }

      // Success - call parent callback to show video
      onEmailSubmit(email)
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg rounded-2xl border border-yellow-500/30 bg-gradient-to-br from-gray-900 to-black p-8 shadow-2xl">
        {/* Success Icon */}
        <div className="mb-6 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-yellow-500 to-orange-500">
            <CheckCircle className="h-8 w-8 text-black" />
          </div>
        </div>

        {/* Heading */}
        <h2 className="mb-3 text-center text-3xl font-black text-white">
          Your Video is Ready! 🎉
        </h2>
        <p className="mb-6 text-center text-lg text-gray-300">
          Enter your email to watch your AI-generated video
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Input */}
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-semibold text-gray-300">
              Email Address <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full rounded-lg border border-gray-700 bg-gray-800 py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:border-yellow-500 focus:outline-none"
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Subscribe Checkbox */}
          <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/5 p-4">
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={isSubscribed}
                onChange={(e) => setIsSubscribed(e.target.checked)}
                className="mt-1 h-5 w-5 cursor-pointer rounded border-gray-600 bg-gray-700 text-yellow-500 focus:ring-2 focus:ring-yellow-500"
                disabled={isSubmitting}
              />
              <div className="flex-1">
                <p className="text-sm font-semibold text-white">
                  Yes, send me my video + free AI marketing tips
                </p>
                <p className="mt-1 text-xs text-gray-400">
                  Get weekly templates, prompts, and strategies to grow your business with AI. Unsubscribe anytime.
                </p>
              </div>
            </label>
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
            className="group relative w-full overflow-hidden rounded-xl p-[2px] transition-all hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 via-orange-500 to-yellow-500 opacity-75 blur transition-opacity group-hover:opacity-100"></div>
            <div className="relative flex items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 px-8 py-4 text-lg font-black text-black">
              {isSubmitting ? (
                <>
                  <Loader className="h-5 w-5 animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5" />
                  <span>Show Me My Video</span>
                </>
              )}
            </div>
          </button>
        </form>

        {/* Privacy Note */}
        <p className="mt-4 text-center text-xs text-gray-500">
          🔒 We respect your privacy. No spam, ever.
        </p>
      </div>
    </div>
  )
}
