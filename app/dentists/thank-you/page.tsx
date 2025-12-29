'use client'

import { CheckCircle, Copy, Star } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense, useState, useEffect } from 'react'

function ThankYouContent() {
  const searchParams = useSearchParams()
  const purchased = searchParams.get('purchased')
  const [copied, setCopied] = useState(false)
  const [hasCopied, setHasCopied] = useState(false)
  const [showCopyWarning, setShowCopyWarning] = useState(false)

  const password = "dentist2026"

  // PURCHASE TRACKING MOVED TO OTO PAGE
  // Main course Purchase is now tracked when user lands on /dentists/oto after Whop checkout
  // This prevents the issue where upsell/downsell buyers would skip tracking
  // DO NOT track Purchase here - it would cause duplicates
  useEffect(() => {
    // Log for debugging
    console.log('Thank-you page loaded. purchased param:', purchased)
    console.log('Purchase tracking happens on OTO page, not here.')
  }, [purchased])

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
    <div className="bg-gradient-to-br from-[#0a0a0a] via-[#0f1f1f] to-[#1a2a2e]" style={{ minHeight: '100vh' }}>
      <div className="container mx-auto px-3 md:px-4 py-6 md:py-16" style={{ paddingBottom: 'max(8rem, calc(2rem + env(safe-area-inset-bottom)))' }}>
        <div className="mx-auto max-w-2xl">
          {/* Success Icon - Smaller on mobile */}
          <div className="mb-4 md:mb-8 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-teal-500/20 blur-xl"></div>
              <CheckCircle className="relative h-14 w-14 md:h-20 md:w-20 text-teal-500" />
            </div>
          </div>

          {/* Thank You Message - Compact on mobile */}
          <div className="mb-5 md:mb-8 text-center">
            <h1 className="mb-2 md:mb-4 text-2xl md:text-5xl font-black text-white">
              🎉 Payment Successful! 🎉
            </h1>
            <p className="text-base md:text-xl font-bold text-white">
              Welcome to CloneYourself for Dentists!
            </p>
            <p className="text-gray-400 text-xs md:text-base mt-1">
              Check your email for details (arriving within 60 seconds)
            </p>
          </div>

          {/* PASSWORD & MEMBERS ACCESS - Optimized for mobile */}
          <div className="mb-5 md:mb-8 rounded-xl md:rounded-2xl bg-gradient-to-br from-teal-500/20 via-teal-500/10 to-transparent border border-teal-500 p-4 md:p-8 backdrop-blur-sm">
            <h2 className="text-lg md:text-2xl font-black text-white text-center mb-4 md:mb-6">
              🔐 YOUR MEMBERS AREA ACCESS
            </h2>

            {/* Password Display - Compact */}
            <div className="bg-[#0a0a0a]/60 backdrop-blur-sm rounded-lg p-3 md:p-5 mb-4 md:mb-6 border border-white/20">
              <p className="text-center text-teal-500 text-[10px] md:text-sm font-bold uppercase tracking-wide mb-2">
                Your Password:
              </p>

              <div className="bg-gradient-to-r from-[#0a1128] to-[#1a2a2e] rounded-lg p-2.5 md:p-4 border border-teal-500 mb-2 md:mb-3">
                <p className="text-center text-teal-500 text-sm md:text-xl font-black">
                  {password}
                </p>
              </div>

              {/* COPY Button */}
              <button
                onClick={copyPassword}
                className="w-full bg-white/10 hover:bg-white/20 border border-teal-500 text-teal-500 px-4 py-2 md:py-3 rounded-lg font-bold text-xs md:text-sm transition-all duration-200 flex items-center justify-center gap-2"
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

            {/* Members Area Button - Links to DENTIST members area */}
            <Link
              href={hasCopied ? "/dentists/members" : "#"}
              onClick={handleEnterClick}
              className="block w-full"
            >
              <div className={`w-full px-4 py-4 md:py-5 rounded-xl font-black text-base md:text-xl transition-all duration-200 shadow-lg text-center ${
                hasCopied
                  ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-teal-500/20 hover:scale-[1.02] active:scale-[0.98]'
                  : 'bg-gradient-to-r from-teal-500/60 to-cyan-500/60 text-white/70'
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
                <div className="flex h-7 w-7 md:h-9 md:w-9 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 text-xs md:text-base font-black text-white">
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
                <div className="flex h-7 w-7 md:h-9 md:w-9 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 text-xs md:text-base font-black text-white">
                  2
                </div>
                <div>
                  <h4 className="text-sm md:text-base font-bold text-white">
                    Enter Members Area
                  </h4>
                  <p className="text-gray-400 text-[10px] md:text-sm">
                    Click the teal button to access all your bonuses
                  </p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <div className="flex h-7 w-7 md:h-9 md:w-9 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 text-xs md:text-base font-black text-white">
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

export default function DentistThankYouPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#0f1f1f] to-[#1a2a2e]" />}>
      <ThankYouContent />
    </Suspense>
  )
}
