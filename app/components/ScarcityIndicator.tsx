'use client'

import { useState, useEffect } from 'react'
import { AlertCircle } from 'lucide-react'

export default function ScarcityIndicator() {
  const [spotsRemaining, setSpotsRemaining] = useState(7)

  useEffect(() => {
    // Randomly decrease spots every 2-5 minutes
    const interval = setInterval(
      () => {
        setSpotsRemaining((prev) => {
          if (prev <= 3) return prev // Don't go below 3
          return Math.max(3, prev - 1)
        })
      },
      Math.random() * 180000 + 120000
    ) // 2-5 minutes

    return () => clearInterval(interval)
  }, [])

  // Color coding based on urgency
  const getColorClasses = () => {
    if (spotsRemaining <= 3) {
      return {
        bg: 'bg-red-500/20',
        border: 'border-red-400',
        text: 'text-red-400',
        pulse: 'bg-red-500',
      }
    }
    if (spotsRemaining <= 5) {
      return {
        bg: 'bg-amber-500/20',
        border: 'border-amber-400',
        text: 'text-amber-400',
        pulse: 'bg-amber-500',
      }
    }
    return {
      bg: 'bg-amber-500/20',
      border: 'border-amber-400',
      text: 'text-amber-300',
      pulse: 'bg-amber-400',
    }
  }

  const colors = getColorClasses()

  return (
    <div
      className={`fixed right-6 top-24 z-40 max-w-xs animate-in slide-in-from-right-5 fade-in duration-500`}
    >
      <div
        className={`flex items-center gap-3 rounded-2xl border-2 ${colors.border} ${colors.bg} p-4 shadow-2xl backdrop-blur-md`}
      >
        {/* Pulsing alert icon */}
        <div className="relative flex h-10 w-10 flex-shrink-0 items-center justify-center">
          <span
            className={`absolute inline-flex h-full w-full animate-ping rounded-full ${colors.pulse} opacity-75`}
          ></span>
          <div className={`relative flex h-10 w-10 items-center justify-center rounded-full ${colors.pulse}`}>
            <AlertCircle className="h-5 w-5 text-white" />
          </div>
        </div>

        {/* Message */}
        <div className="flex-1">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-white/80">
            Limited Availability
          </p>
          <p className={`text-sm font-black ${colors.text}`}>
            Only {spotsRemaining} spots left at $37
          </p>
          <p className="mt-1 text-xs text-white/60">Price increases to $97 soon</p>
        </div>
      </div>
    </div>
  )
}
