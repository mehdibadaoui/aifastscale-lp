'use client'

import { useState, useEffect } from 'react'
import { Eye, ShoppingCart, MapPin } from 'lucide-react'

interface Notification {
  id: number
  type: 'viewing' | 'purchase' | 'location'
  message: string
  icon: React.ReactNode
}

export default function SocialProofNotifications() {
  const [currentNotification, setCurrentNotification] = useState<Notification | null>(null)
  const [viewerCount, setViewerCount] = useState(0)

  // Viewer count that fluctuates realistically
  useEffect(() => {
    // Initial count between 15-35
    const initialCount = Math.floor(Math.random() * 20) + 15
    setViewerCount(initialCount)

    // Update viewer count every 10-20 seconds with small changes
    const interval = setInterval(() => {
      setViewerCount((prev) => {
        const change = Math.floor(Math.random() * 7) - 3 // -3 to +3
        const newCount = prev + change
        // Keep between 10-40
        return Math.max(10, Math.min(40, newCount))
      })
    }, 15000)

    return () => clearInterval(interval)
  }, [])

  // Social proof notifications
  useEffect(() => {
    const notifications: Omit<Notification, 'id'>[] = [
      {
        type: 'viewing',
        message: `${viewerCount} people viewing this page right now`,
        icon: <Eye className="h-4 w-4" />,
      },
      {
        type: 'purchase',
        message: 'Ahmed from Dubai just purchased (2 min ago)',
        icon: <ShoppingCart className="h-4 w-4" />,
      },
      {
        type: 'purchase',
        message: 'Sarah from Abu Dhabi just purchased (5 min ago)',
        icon: <ShoppingCart className="h-4 w-4" />,
      },
      {
        type: 'location',
        message: 'Someone from Sharjah is viewing this page',
        icon: <MapPin className="h-4 w-4" />,
      },
      {
        type: 'purchase',
        message: 'Mohammed from Dubai just purchased (8 min ago)',
        icon: <ShoppingCart className="h-4 w-4" />,
      },
      {
        type: 'location',
        message: 'Someone from Dubai is viewing this page',
        icon: <MapPin className="h-4 w-4" />,
      },
    ]

    let currentIndex = 0

    // Show first notification after 3 seconds
    const initialTimeout = setTimeout(() => {
      setCurrentNotification({ ...notifications[0], id: Date.now() })
      currentIndex = 1
    }, 3000)

    // Show subsequent notifications every 12 seconds
    const interval = setInterval(() => {
      setCurrentNotification({ ...notifications[currentIndex], id: Date.now() })
      currentIndex = (currentIndex + 1) % notifications.length
    }, 12000)

    return () => {
      clearTimeout(initialTimeout)
      clearInterval(interval)
    }
  }, [viewerCount])

  if (!currentNotification) return null

  return (
    <div className="pointer-events-none fixed bottom-6 left-6 z-50 max-w-sm">
      <div
        key={currentNotification.id}
        className="pointer-events-auto animate-in slide-in-from-left-5 fade-in duration-500"
      >
        <div className="flex items-center gap-3 rounded-2xl border-2 border-green-400/30 bg-gradient-to-r from-green-500/10 via-green-400/5 to-transparent p-4 shadow-2xl backdrop-blur-md">
          {/* Icon */}
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-green-500">
            {currentNotification.icon}
          </div>

          {/* Message */}
          <div className="flex-1">
            <p className="text-sm font-semibold text-white">
              {currentNotification.message}
            </p>
          </div>

          {/* Pulse indicator */}
          {currentNotification.type === 'viewing' && (
            <div className="relative flex h-3 w-3 flex-shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex h-3 w-3 rounded-full bg-green-500"></span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
