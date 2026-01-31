'use client'

import { memo, useState, useEffect } from 'react'
import { Star, Quote, ChevronLeft, ChevronRight, Users, TrendingUp } from 'lucide-react'
import { getReviewsForNiche, generateActivityFeed, Review } from '../../data/reviews'
import type { PlatformStateType } from '../../hooks'

interface ReviewsProps {
  state: PlatformStateType
}

export const ReviewsSection = memo(function ReviewsSection({ state }: ReviewsProps) {
  const { config } = state
  const reviews = getReviewsForNiche(config.slug)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [activityFeed, setActivityFeed] = useState<string[]>([])

  useEffect(() => {
    // Generate activity feed on mount
    setActivityFeed(generateActivityFeed(config.slug))

    // Rotate activity feed every 5 seconds
    const interval = setInterval(() => {
      setActivityFeed(prev => {
        const newFeed = [...prev]
        // Move first item to end and shuffle slightly
        const first = newFeed.shift()
        if (first) newFeed.push(first)
        return newFeed
      })
    }, 5000)

    return () => clearInterval(interval)
  }, [config.slug])

  const nextReview = () => {
    setCurrentIndex((prev) => (prev + 1) % reviews.length)
  }

  const prevReview = () => {
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length)
  }

  // Auto-advance reviews
  useEffect(() => {
    const timer = setInterval(nextReview, 8000)
    return () => clearInterval(timer)
  }, [reviews.length])

  const currentReview = reviews[currentIndex]
  const isPrimaryAmber = config.theme.primary.includes('amber')
  const primaryColorClass = isPrimaryAmber ? 'amber' : 'teal'

  return (
    <div className="space-y-6">
      {/* Reviews Carousel */}
      <div className={`glass-premium rounded-2xl p-6 border border-${primaryColorClass}-500/20`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Quote className={`w-5 h-5 text-${primaryColorClass}-400`} />
            <h3 className="text-lg font-bold text-white">Member Success Stories</h3>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={prevReview}
              className={`p-2 rounded-lg glass-dark hover:bg-white/10 transition-all text-slate-400 hover:text-${primaryColorClass}-400`}
              aria-label="Previous review"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextReview}
              className={`p-2 rounded-lg glass-dark hover:bg-white/10 transition-all text-slate-400 hover:text-${primaryColorClass}-400`}
              aria-label="Next review"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {currentReview && (
          <div className="animate-fade-in">
            {/* Stars */}
            <div className="flex items-center gap-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${i < currentReview.rating ? `text-${primaryColorClass}-400 fill-${primaryColorClass}-400` : 'text-slate-600'}`}
                />
              ))}
            </div>

            {/* Quote */}
            <p className="text-slate-300 text-lg leading-relaxed mb-4">
              "{currentReview.text}"
            </p>

            {/* Result badge */}
            {currentReview.result && (
              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-${primaryColorClass}-500/20 border border-${primaryColorClass}-500/30 mb-4`}>
                <TrendingUp className={`w-4 h-4 text-${primaryColorClass}-400`} />
                <span className={`text-sm font-bold text-${primaryColorClass}-400`}>{currentReview.result}</span>
              </div>
            )}

            {/* Author */}
            <div className="flex items-center justify-between">
              <div>
                <div className="font-bold text-white">{currentReview.name}</div>
                <div className="text-sm text-slate-400">{currentReview.profession} • {currentReview.location}</div>
              </div>
              <span className="text-xs text-slate-500">{currentReview.date}</span>
            </div>
          </div>
        )}

        {/* Pagination dots */}
        <div className="flex items-center justify-center gap-2 mt-4">
          {reviews.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`w-2 h-2 rounded-full transition-all ${
                i === currentIndex
                  ? `bg-${primaryColorClass}-400 w-4`
                  : 'bg-slate-600 hover:bg-slate-500'
              }`}
              aria-label={`Go to review ${i + 1}`}
            />
          ))}
        </div>

        {/* FTC Disclaimer */}
        <p className="text-xs text-slate-500 text-center mt-4 italic">
          *Results may vary. These are representative examples of what's possible with dedicated implementation.
        </p>
      </div>

      {/* Live Activity Feed */}
      <div className={`glass-premium rounded-2xl p-4 border border-${primaryColorClass}-500/20`}>
        <div className="flex items-center gap-2 mb-3">
          <div className={`w-2 h-2 rounded-full bg-green-500 animate-pulse`} />
          <span className="text-sm font-medium text-slate-400">Live Activity</span>
        </div>
        <div className="space-y-2 max-h-32 overflow-hidden">
          {activityFeed.slice(0, 4).map((activity, i) => (
            <div
              key={i}
              className={`text-sm text-slate-300 py-1 transition-all duration-500 ${i === 0 ? 'animate-fade-in' : ''}`}
              style={{ opacity: 1 - i * 0.2 }}
            >
              <span className={`text-${primaryColorClass}-400`}>{activity.split(' ')[0]}</span>
              {' '}{activity.split(' ').slice(1).join(' ')}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
})
