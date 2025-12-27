'use client'

import React, { useState } from 'react'
import { Mail, Sparkles, Loader, Shield, Lock, ArrowRight, Check } from 'lucide-react'

interface DemoEmailCaptureModalProps {
  isOpen: boolean
  onEmailSubmit: (email: string) => void
}

export default function DemoEmailCaptureModal({ isOpen, onEmailSubmit }: DemoEmailCaptureModalProps) {
  const [email, setEmail] = useState('')
  const [isSubscribed, setIsSubscribed] = useState(true)
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

    if (!email.trim()) {
      setError('Please enter your email address')
      return
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/subscribe-demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit email')
      }

      onEmailSubmit(email)
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-md">
      <div className="relative w-full max-w-[420px] animate-modal-in overflow-hidden rounded-2xl bg-white shadow-2xl">

        {/* Top gradient accent */}
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-violet-500 via-indigo-500 to-purple-500" />

        {/* Decorative background pattern */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-gradient-to-br from-violet-100 to-indigo-100 opacity-60 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-gradient-to-tr from-indigo-100 to-purple-100 opacity-60 blur-3xl" />

        <div className="relative p-6 sm:p-8">
          {/* Icon */}
          <div className="mb-5 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 animate-pulse rounded-2xl bg-gradient-to-br from-violet-400 to-indigo-400 opacity-20 blur-xl" />
              <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-200">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>

          {/* Heading */}
          <div className="mb-6 text-center">
            <h2 className="mb-1.5 text-xl font-bold text-slate-900 sm:text-2xl">
              Your Video is Ready
            </h2>
            <p className="text-sm text-slate-500">
              Enter your email to unlock access
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Input - Modern floating label style */}
            <div className="group relative">
              <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 transition-all">
                <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-violet-500" />
              </div>
              <input
                type="email"
                name="email"
                id="demo-email"
                autoComplete="email"
                inputMode="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl border-2 border-slate-200 bg-white py-3.5 pl-12 pr-4 text-base text-slate-900 placeholder-slate-400 transition-all focus:border-violet-500 focus:outline-none focus:ring-4 focus:ring-violet-100"
                disabled={isSubmitting}
                autoFocus
              />
            </div>

            {/* Minimal checkbox - pre-checked */}
            <label className="flex cursor-pointer items-center gap-3 px-1">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={isSubscribed}
                  onChange={(e) => setIsSubscribed(e.target.checked)}
                  className="peer sr-only"
                  disabled={isSubmitting}
                />
                <div className="flex h-5 w-5 items-center justify-center rounded-md border-2 border-slate-300 bg-white transition-all peer-checked:border-violet-500 peer-checked:bg-violet-500 peer-focus:ring-2 peer-focus:ring-violet-200">
                  <Check className="h-3 w-3 text-white opacity-0 transition-opacity peer-checked:opacity-100" style={{ opacity: isSubscribed ? 1 : 0 }} />
                </div>
              </div>
              <span className="text-sm text-slate-600">
                Send me free AI marketing tips
              </span>
            </label>

            {/* Error Message */}
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-center text-sm text-red-600">
                {error}
              </div>
            )}

            {/* Submit Button - Modern with hover effect */}
            <button
              type="submit"
              disabled={isSubmitting || !email.trim()}
              className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 py-3.5 text-base font-semibold text-white shadow-lg shadow-violet-200/50 transition-all hover:shadow-xl hover:shadow-violet-300/50 disabled:opacity-60 disabled:shadow-none"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isSubmitting ? (
                  <>
                    <Loader className="h-5 w-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Unlock My Video
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </span>
              {/* Shine effect on hover */}
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            </button>
          </form>

          {/* Trust badges - Minimal */}
          <div className="mt-5 flex items-center justify-center gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5" />
              Secure
            </span>
            <span className="h-3 w-px bg-slate-200" />
            <span className="flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5" />
              No spam
            </span>
          </div>
        </div>
      </div>

      {/* Animation styles */}
      <style jsx>{`
        @keyframes modal-in {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        .animate-modal-in {
          animation: modal-in 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </div>
  )
}
