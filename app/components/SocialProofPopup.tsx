'use client'

import { useState, useEffect } from 'react'
import { CheckCircle, X } from 'lucide-react'

const notifications = [
  { name: 'Michael R.', location: 'Florida', time: '2 minutes ago' },
  { name: 'Sarah K.', location: 'Texas', time: '5 minutes ago' },
  { name: 'David L.', location: 'California', time: '8 minutes ago' },
  { name: 'Jennifer M.', location: 'New York', time: '12 minutes ago' },
  { name: 'Robert T.', location: 'Arizona', time: '15 minutes ago' },
  { name: 'Lisa W.', location: 'Georgia', time: '18 minutes ago' },
  { name: 'James H.', location: 'Nevada', time: '22 minutes ago' },
  { name: 'Patricia D.', location: 'Illinois', time: '25 minutes ago' },
]

export default function SocialProofPopup() {
  const [showPopup, setShowPopup] = useState(false)
  const [currentNotification, setCurrentNotification] = useState(0)

  useEffect(() => {
    // Show first popup after 5 seconds
    const initialTimer = setTimeout(() => {
      setShowPopup(true)
    }, 5000)

    return () => clearTimeout(initialTimer)
  }, [])

  useEffect(() => {
    if (!showPopup) return

    // Auto-hide after 5 seconds
    const hideTimer = setTimeout(() => {
      setShowPopup(false)

      // Show next notification after 15-30 seconds
      const nextTimer = setTimeout(() => {
        setCurrentNotification((prev) => (prev + 1) % notifications.length)
        setShowPopup(true)
      }, Math.random() * 15000 + 15000) // Random between 15-30 seconds

      return () => clearTimeout(nextTimer)
    }, 5000)

    return () => clearTimeout(hideTimer)
  }, [showPopup])

  const notification = notifications[currentNotification]

  if (!showPopup) return null

  return (
    <div className="fixed bottom-4 left-4 z-50 animate-in slide-in-from-left duration-500 md:bottom-6 md:left-6">
      <div className="relative w-80 max-w-[calc(100vw-2rem)] rounded-xl border border-green-500/30 bg-white p-4 shadow-2xl">
        {/* Close button */}
        <button
          onClick={() => setShowPopup(false)}
          className="absolute right-2 top-2 rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-emerald-500">
            <CheckCircle className="h-5 w-5 text-white" />
          </div>

          {/* Content */}
          <div className="flex-1">
            <p className="mb-1 text-sm font-bold text-gray-900">
              {notification.name} from {notification.location}
            </p>
            <p className="mb-1 text-xs text-gray-600">
              Just purchased AgentClone™
            </p>
            <p className="text-xs text-gray-400">{notification.time}</p>
          </div>
        </div>

        {/* Subtle pulse animation on border */}
        <div className="absolute inset-0 -z-10 rounded-xl bg-gradient-to-r from-green-500/20 to-emerald-500/20 blur-sm"></div>
      </div>
    </div>
  )
}
