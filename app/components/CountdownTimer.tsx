'use client'

import { useState, useEffect } from 'react'
import { Clock } from 'lucide-react'

interface CountdownTimerProps {
  endDate: Date
  urgencyText?: string
}

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export default function CountdownTimer({
  endDate,
  urgencyText = 'BLACK FRIDAY ENDS IN:',
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })
  const [isExpired, setIsExpired] = useState(false)

  useEffect(() => {
    const calculateTimeLeft = (): TimeLeft => {
      const difference = endDate.getTime() - new Date().getTime()

      if (difference <= 0) {
        setIsExpired(true)
        return { days: 0, hours: 0, minutes: 0, seconds: 0 }
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      }
    }

    // Initial calculation
    setTimeLeft(calculateTimeLeft())

    // Update every second
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
  }, [endDate])

  if (isExpired) {
    return (
      <div className="bg-red-gradient text-white py-4 px-6 rounded-xl text-center shadow-lg">
        <p className="text-xl font-bold">
          ⚠️ Black Friday Deal Has Ended
        </p>
        <p className="text-sm mt-1">Regular price now applies: $97</p>
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Urgency Text */}
      <div className="flex items-center justify-center gap-2 mb-4">
        <Clock className="w-6 h-6 text-red-electric animate-pulse" />
        <p className="text-lg font-bold text-gray-800 uppercase tracking-wide">
          {urgencyText}
        </p>
      </div>

      {/* Countdown Display */}
      <div className="flex justify-center gap-3 flex-wrap">
        {/* Days */}
        {timeLeft.days > 0 && (
          <div className="countdown-item">
            <div className="countdown-number">{String(timeLeft.days).padStart(2, '0')}</div>
            <div className="countdown-label">Days</div>
          </div>
        )}

        {/* Hours */}
        <div className="countdown-item">
          <div className="countdown-number">{String(timeLeft.hours).padStart(2, '0')}</div>
          <div className="countdown-label">Hours</div>
        </div>

        {/* Minutes */}
        <div className="countdown-item">
          <div className="countdown-number">{String(timeLeft.minutes).padStart(2, '0')}</div>
          <div className="countdown-label">Minutes</div>
        </div>

        {/* Seconds */}
        <div className="countdown-item">
          <div className="countdown-number">{String(timeLeft.seconds).padStart(2, '0')}</div>
          <div className="countdown-label">Seconds</div>
        </div>
      </div>

      {/* Price Increase Warning */}
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          ⚡ Price increases to{' '}
          <span className="font-bold text-red-electric line-through">$1,691</span>{' '}
          <span className="font-bold text-red-electric">$97</span> after timer expires
        </p>
      </div>
    </div>
  )
}
