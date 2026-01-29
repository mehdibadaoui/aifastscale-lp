'use client'

import { useState, useEffect, useCallback } from 'react'
import { X, Gift, ArrowRight, Loader2 } from 'lucide-react'
import CheckoutModal from './CheckoutModal'
import { PAYMENT_CONFIG } from '../config/payment'

interface SpinWheelProps {
  isOpen: boolean
  onClose: () => void
  onWin?: (prize: any) => void
  onSpinComplete?: (prize: any) => void
}

// Prize segments for the wheel
const PRIZES = [
  { id: 1, label: '50% OFF', discount: 50, color: '#d4af37' },
  { id: 2, label: '30% OFF', discount: 30, color: '#1a1a2e' },
  { id: 3, label: '40% OFF', discount: 40, color: '#d4af37' },
  { id: 4, label: '20% OFF', discount: 20, color: '#1a1a2e' },
  { id: 5, label: '60% OFF', discount: 60, color: '#d4af37' },
  { id: 6, label: '25% OFF', discount: 25, color: '#1a1a2e' },
  { id: 7, label: '45% OFF', discount: 45, color: '#d4af37' },
  { id: 8, label: '35% OFF', discount: 35, color: '#1a1a2e' },
]

export default function SpinWheel({ isOpen, onClose, onWin, onSpinComplete }: SpinWheelProps) {
  const [isSpinning, setIsSpinning] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [prize, setPrize] = useState<typeof PRIZES[0] | null>(null)
  const [showCheckout, setShowCheckout] = useState(false)
  const [hasSpun, setHasSpun] = useState(false)

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setPrize(null)
      setShowCheckout(false)
    }
  }, [isOpen])

  const spin = useCallback(() => {
    if (isSpinning || hasSpun) return

    setIsSpinning(true)

    // Determine winning prize (can be configured)
    const winningIndex = Math.floor(Math.random() * PRIZES.length)
    const segmentAngle = 360 / PRIZES.length
    const targetRotation = 360 * 5 + (winningIndex * segmentAngle) + (segmentAngle / 2)

    setRotation(targetRotation)

    // After spin completes
    setTimeout(() => {
      setIsSpinning(false)
      setHasSpun(true)
      setPrize(PRIZES[winningIndex])
      onWin?.(PRIZES[winningIndex])
      onSpinComplete?.(PRIZES[winningIndex])
    }, 4000)
  }, [isSpinning, hasSpun, onWin, onSpinComplete])

  const handleClaim = () => {
    setShowCheckout(true)
  }

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
        <div className="relative w-full max-w-md bg-gradient-to-br from-[#0a0a0a] via-[#0a1128] to-[#1a1a2e] rounded-2xl border border-[#d4af37]/30 p-6 shadow-2xl">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Title */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 bg-[#d4af37]/20 px-4 py-2 rounded-full mb-4">
              <Gift className="w-5 h-5 text-[#d4af37]" />
              <span className="text-[#d4af37] font-bold text-sm">SPIN TO WIN</span>
            </div>
            <h2 className="text-2xl font-black text-white">
              {prize ? 'You Won!' : 'Spin the Wheel!'}
            </h2>
            <p className="text-gray-400 text-sm mt-2">
              {prize
                ? `You got ${prize.label}! Claim your discount now.`
                : 'Try your luck for an exclusive discount'}
            </p>
          </div>

          {/* Wheel */}
          <div className="relative w-64 h-64 mx-auto mb-6">
            {/* Wheel segments - simplified visual */}
            <div
              className="w-full h-full rounded-full border-4 border-[#d4af37] relative overflow-hidden transition-transform duration-[4000ms] ease-out"
              style={{ transform: `rotate(${rotation}deg)` }}
            >
              {PRIZES.map((segment, i) => {
                const angle = (360 / PRIZES.length) * i
                return (
                  <div
                    key={segment.id}
                    className="absolute w-full h-full"
                    style={{
                      transform: `rotate(${angle}deg)`,
                      clipPath: 'polygon(50% 50%, 50% 0%, 100% 0%, 100% 50%)',
                      backgroundColor: segment.color,
                    }}
                  >
                    <span
                      className="absolute text-xs font-bold"
                      style={{
                        top: '20%',
                        left: '60%',
                        transform: 'rotate(22.5deg)',
                        color: segment.color === '#d4af37' ? '#0a0a0a' : '#d4af37',
                      }}
                    >
                      {segment.label}
                    </span>
                  </div>
                )
              })}
            </div>

            {/* Center button */}
            <button
              onClick={spin}
              disabled={isSpinning || hasSpun}
              className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full font-black text-sm transition-all ${
                isSpinning || hasSpun
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-br from-[#d4af37] to-[#b8962d] text-black hover:scale-105 shadow-lg shadow-[#d4af37]/30'
              }`}
            >
              {isSpinning ? (
                <Loader2 className="w-6 h-6 mx-auto animate-spin" />
              ) : hasSpun ? (
                'DONE'
              ) : (
                'SPIN!'
              )}
            </button>

            {/* Pointer */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 w-0 h-0 border-l-[12px] border-r-[12px] border-b-[20px] border-l-transparent border-r-transparent border-b-[#d4af37]" />
          </div>

          {/* Prize Result */}
          {prize && (
            <div className="text-center">
              <div className="bg-[#d4af37]/20 border border-[#d4af37] rounded-xl p-4 mb-4">
                <p className="text-[#d4af37] font-black text-3xl">{prize.label}</p>
                <p className="text-gray-300 text-sm mt-1">Your exclusive discount!</p>
              </div>

              <button
                onClick={handleClaim}
                className="w-full bg-gradient-to-r from-[#d4af37] to-[#f4d03f] text-black py-4 rounded-xl font-black text-lg flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-lg shadow-[#d4af37]/30"
              >
                CLAIM MY {prize.label} NOW
                <ArrowRight className="w-5 h-5" />
              </button>

              <p className="text-gray-500 text-xs mt-3">
                Limited time offer - claim before it expires!
              </p>
            </div>
          )}

          {/* Spin instruction */}
          {!prize && !isSpinning && (
            <p className="text-center text-gray-400 text-sm">
              Click the center button to spin!
            </p>
          )}
        </div>
      </div>

      {/* Checkout Modal - Add your payment integration */}
      <CheckoutModal
        isOpen={showCheckout}
        onClose={() => setShowCheckout(false)}
        planId={PAYMENT_CONFIG.plans.mainCourse.id}
        planName={`7-Minute AgentClone (${prize?.label})`}
        price={prize ? `$${(47.82 * (1 - prize.discount / 100)).toFixed(2)}` : '$47.82'}
      />
    </>
  )
}
