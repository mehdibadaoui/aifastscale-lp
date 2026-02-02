'use client'

// ============================================================================
// SKELETON LOADER COMPONENTS
// For loading states before content appears
// ============================================================================

interface SkeletonProps {
  className?: string
}

// Base skeleton with shimmer effect
export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 bg-[length:200%_100%] animate-shimmer rounded ${className}`}
    />
  )
}

// Card skeleton for bonus/feature cards
export function CardSkeleton() {
  return (
    <div className="animate-pulse rounded-xl bg-gray-800/50 border border-gray-700/50 overflow-hidden">
      <div className="aspect-[16/9] bg-gray-700" />
      <div className="p-4 space-y-3">
        <div className="h-5 w-3/4 bg-gray-700 rounded" />
        <div className="h-4 w-1/2 bg-gray-700 rounded" />
        <div className="space-y-2">
          <div className="h-3 w-full bg-gray-700 rounded" />
          <div className="h-3 w-5/6 bg-gray-700 rounded" />
        </div>
      </div>
    </div>
  )
}

// Testimonial skeleton
export function TestimonialSkeleton() {
  return (
    <div className="animate-pulse p-6 rounded-xl bg-gray-800/50 border border-gray-700/50">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 rounded-full bg-gray-700" />
        <div className="space-y-2">
          <div className="h-4 w-24 bg-gray-700 rounded" />
          <div className="h-3 w-32 bg-gray-700 rounded" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 w-full bg-gray-700 rounded" />
        <div className="h-3 w-5/6 bg-gray-700 rounded" />
        <div className="h-3 w-4/6 bg-gray-700 rounded" />
      </div>
    </div>
  )
}

// Image skeleton with proper aspect ratio
interface ImageSkeletonProps {
  aspectRatio?: string
  className?: string
}

export function ImageSkeleton({
  aspectRatio = 'aspect-[16/9]',
  className = ''
}: ImageSkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 bg-[length:200%_100%] animate-shimmer rounded-lg ${aspectRatio} ${className}`}
    />
  )
}

// Hero skeleton for main hero section loading
export function HeroSkeleton() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl w-full space-y-6 animate-pulse">
        {/* Badge */}
        <div className="h-8 w-48 bg-gray-800 rounded-full mx-auto" />

        {/* Headline */}
        <div className="space-y-3 text-center">
          <div className="h-10 w-4/5 bg-gray-800 rounded mx-auto" />
          <div className="h-10 w-3/5 bg-gray-800 rounded mx-auto" />
        </div>

        {/* Subheadline */}
        <div className="h-6 w-2/3 bg-gray-800 rounded mx-auto" />

        {/* Hero image */}
        <div className="aspect-[16/9] max-w-2xl mx-auto bg-gray-800 rounded-2xl" />

        {/* CTA button */}
        <div className="h-14 w-64 bg-gray-800 rounded-xl mx-auto" />

        {/* Trust badges */}
        <div className="flex justify-center gap-4">
          <div className="h-6 w-32 bg-gray-800 rounded" />
          <div className="h-6 w-32 bg-gray-800 rounded" />
          <div className="h-6 w-32 bg-gray-800 rounded" />
        </div>
      </div>
    </div>
  )
}

// Section skeleton for lazy-loaded sections
export function SectionSkeleton() {
  return (
    <div className="py-16 animate-pulse">
      <div className="max-w-4xl mx-auto px-4 space-y-8">
        {/* Section header */}
        <div className="text-center space-y-3">
          <div className="h-8 w-64 bg-gray-800 rounded mx-auto" />
          <div className="h-5 w-96 bg-gray-800 rounded mx-auto" />
        </div>

        {/* Grid of cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    </div>
  )
}

// Video player skeleton
export function VideoSkeleton() {
  return (
    <div className="relative aspect-video bg-gray-800 rounded-xl animate-pulse">
      {/* Play button */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-16 h-16 bg-gray-700 rounded-full" />
      </div>
    </div>
  )
}

// FAQ skeleton
export function FAQSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="p-4 bg-gray-800/50 rounded-xl border border-gray-700/50">
          <div className="flex items-center justify-between">
            <div className="h-5 w-3/4 bg-gray-700 rounded" />
            <div className="w-6 h-6 bg-gray-700 rounded" />
          </div>
        </div>
      ))}
    </div>
  )
}
