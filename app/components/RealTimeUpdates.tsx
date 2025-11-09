'use client'

import { useState, useEffect, useRef } from 'react'
import { Zap, DollarSign, Bell, X } from 'lucide-react'

interface SaleNotification {
  id: string
  customerName: string
  amount: number
  product: string
  timestamp: number
}

export default function RealTimeUpdates({ onNewSale }: { onNewSale?: () => void }) {
  const [notifications, setNotifications] = useState<SaleNotification[]>([])
  const [showNotification, setShowNotification] = useState(false)
  const [latestSale, setLatestSale] = useState<SaleNotification | null>(null)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const lastCheckRef = useRef<number>(Date.now())
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Poll for new sales every 30 seconds
  useEffect(() => {
    // Create cash register sound
    if (typeof window !== 'undefined' && !audioRef.current) {
      audioRef.current = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIGGS77eebUhALUKXh8LZjHAU5kdj=')
    }

    const checkForNewSales = async () => {
      try {
        const response = await fetch('/api/get-sales')
        const data = await response.json()

        if (data.allSales && data.allSales.length > 0) {
          const latestSaleData = data.allSales[0]
          const saleTime = latestSaleData.timestamp * 1000

          // If this sale is newer than our last check
          if (saleTime > lastCheckRef.current) {
            const notification: SaleNotification = {
              id: latestSaleData.id,
              customerName: latestSaleData.customerName,
              amount: latestSaleData.amount / 100,
              product: latestSaleData.product,
              timestamp: saleTime,
            }

            // Show notification
            setLatestSale(notification)
            setShowNotification(true)
            setNotifications(prev => [notification, ...prev.slice(0, 9)]) // Keep last 10

            // Play sound
            if (soundEnabled && audioRef.current) {
              audioRef.current.play().catch(e => console.log('Audio play failed:', e))
            }

            // Call callback
            onNewSale?.()

            // Hide after 5 seconds
            setTimeout(() => setShowNotification(false), 5000)
          }

          lastCheckRef.current = Date.now()
        }
      } catch (error) {
        console.error('Error checking for new sales:', error)
      }
    }

    // Initial check
    checkForNewSales()

    // Poll every 30 seconds
    const interval = setInterval(checkForNewSales, 30000)

    return () => clearInterval(interval)
  }, [soundEnabled, onNewSale])

  const formatTimeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000)
    if (seconds < 60) return `${seconds}s ago`
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    return `${Math.floor(hours / 24)}d ago`
  }

  return (
    <>
      {/* Floating notification */}
      {showNotification && latestSale && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-2xl p-4 min-w-[320px] border-2 border-green-400 relative overflow-hidden">
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>

            {/* Content */}
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="bg-white/20 p-2 rounded-lg">
                    <Zap className="w-5 h-5 text-white animate-pulse" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white">New Sale! 🎉</h4>
                    <p className="text-white/80 text-sm">{formatTimeAgo(latestSale.timestamp)}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowNotification(false)}
                  className="text-white/80 hover:text-white transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-white/90 text-sm">Customer:</span>
                  <span className="text-white font-semibold">{latestSale.customerName}</span>
                </div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-white/90 text-sm">Product:</span>
                  <span className="text-white text-sm">{latestSale.product}</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-white/20">
                  <span className="text-white/90 text-sm">Amount:</span>
                  <span className="text-white font-bold text-lg">${latestSale.amount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Confetti effect */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 animate-pulse"></div>
          </div>
        </div>
      )}

      {/* Sound toggle */}
      <button
        onClick={() => setSoundEnabled(!soundEnabled)}
        className={`fixed bottom-4 right-4 p-3 rounded-full shadow-lg transition z-40 ${
          soundEnabled
            ? 'bg-gradient-to-br from-purple-500 to-blue-500 text-white'
            : 'bg-gray-700 text-gray-400'
        }`}
        title={soundEnabled ? 'Sound notifications ON' : 'Sound notifications OFF'}
      >
        <Bell className="w-5 h-5" />
      </button>

      {/* Notification history (optional sidebar) */}
      {notifications.length > 0 && (
        <div className="mt-6 bg-white/5 rounded-xl p-4">
          <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-400" />
            Recent Sales
          </h4>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className="bg-white/5 rounded-lg p-3 border border-white/10 hover:border-purple-500/50 transition"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-white font-medium text-sm">{notification.customerName}</span>
                  <span className="text-white/60 text-xs">{formatTimeAgo(notification.timestamp)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/70 text-xs">{notification.product}</span>
                  <span className="text-green-400 font-semibold">${notification.amount.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slide-in-right {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        .animate-slide-in-right {
          animation: slide-in-right 0.5s ease-out;
        }

        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </>
  )
}
