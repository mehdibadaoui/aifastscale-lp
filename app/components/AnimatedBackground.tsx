'use client'

import { useEffect, useState, memo } from 'react'

// Performance-optimized animated background using CSS animations
// Uses GPU-accelerated properties (transform, opacity) for 60fps performance
// Memoized to prevent unnecessary re-renders

interface AnimatedBackgroundProps {
  variant?: 'dentist' | 'plastic-surgeon' | 'psychologist' | 'default'
}

// Memoize the component to prevent re-renders
export const AnimatedBackground = memo(function AnimatedBackground({ variant = 'default' }: AnimatedBackgroundProps) {
  const [mounted, setMounted] = useState(false)
  const [isLowPowerMode, setIsLowPowerMode] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Check for reduced motion preference or low power mode
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setIsLowPowerMode(prefersReducedMotion)
  }, [])

  // Don't render on server or if user prefers reduced motion
  if (!mounted || isLowPowerMode) return null

  // Color schemes based on variant
  const colors = variant === 'plastic-surgeon'
    ? { orb1: '#9333ea', orb2: '#f59e0b', orb3: '#a855f7', grid: 'rgba(147, 51, 234, 0.3)', particles: ['purple', 'amber', 'violet', 'fuchsia'] }
    : variant === 'psychologist'
    ? { orb1: '#14b8a6', orb2: '#06b6d4', orb3: '#10b981', grid: 'rgba(20, 184, 166, 0.3)', particles: ['teal', 'cyan', 'teal', 'emerald'] }
    : { orb1: '#14b8a6', orb2: '#06b6d4', orb3: '#10b981', grid: 'rgba(20, 184, 166, 0.3)', particles: ['teal', 'cyan', 'teal', 'emerald'] }

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden z-0"
      aria-hidden="true"
      style={{
        contain: 'strict',
        willChange: 'auto'
      }}
    >
      {/* Gradient orbs - GPU accelerated with will-change */}
      <div
        className="absolute w-[600px] h-[600px] rounded-full opacity-[0.03] blur-[100px]"
        style={{
          background: `radial-gradient(circle, ${colors.orb1} 0%, transparent 70%)`,
          top: '-10%',
          left: '-10%',
          animation: 'floatOrb1 25s ease-in-out infinite',
          transform: 'translateZ(0)',
        }}
      />
      <div
        className="absolute w-[500px] h-[500px] rounded-full opacity-[0.04] blur-[80px]"
        style={{
          background: `radial-gradient(circle, ${colors.orb2} 0%, transparent 70%)`,
          top: '30%',
          right: '-5%',
          animation: 'floatOrb2 30s ease-in-out infinite',
          transform: 'translateZ(0)',
        }}
      />
      <div
        className="absolute w-[400px] h-[400px] rounded-full opacity-[0.03] blur-[60px]"
        style={{
          background: `radial-gradient(circle, ${colors.orb3} 0%, transparent 70%)`,
          bottom: '10%',
          left: '20%',
          animation: 'floatOrb3 20s ease-in-out infinite',
          transform: 'translateZ(0)',
        }}
      />

      {/* Subtle grid pattern overlay - static, no animation */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `linear-gradient(${colors.grid} 1px, transparent 1px), linear-gradient(90deg, ${colors.grid} 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Animated particles - minimal count for performance */}
      <div className={`absolute top-[20%] left-[10%] w-1 h-1 bg-${colors.particles[0]}-500/30 rounded-full`} style={{ animation: 'particleFloat 8s ease-in-out infinite', transform: 'translateZ(0)' }} />
      <div className={`absolute top-[40%] right-[15%] w-1.5 h-1.5 bg-${colors.particles[1]}-500/20 rounded-full`} style={{ animation: 'particleFloat 10s ease-in-out infinite 1s', transform: 'translateZ(0)' }} />
      <div className={`absolute top-[60%] left-[5%] w-1 h-1 bg-${colors.particles[2]}-400/25 rounded-full`} style={{ animation: 'particleFloat 12s ease-in-out infinite 2s', transform: 'translateZ(0)' }} />
      <div className={`absolute top-[80%] right-[25%] w-1 h-1 bg-${colors.particles[3]}-500/20 rounded-full`} style={{ animation: 'particleFloat 9s ease-in-out infinite 0.5s', transform: 'translateZ(0)' }} />
    </div>
  )
})

// Scroll reveal hook for performance-optimized animations
export function useScrollReveal() {
  useEffect(() => {
    // Use native CSS scroll animations where supported
    if ('animate' in document.documentElement) {
      const style = document.createElement('style')
      style.textContent = `
        [data-scroll-reveal] {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1),
                      transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
          will-change: opacity, transform;
        }
        [data-scroll-reveal].revealed {
          opacity: 1;
          transform: translateY(0);
        }
        [data-scroll-reveal="left"] {
          transform: translateX(-30px);
        }
        [data-scroll-reveal="left"].revealed {
          transform: translateX(0);
        }
        [data-scroll-reveal="right"] {
          transform: translateX(30px);
        }
        [data-scroll-reveal="right"].revealed {
          transform: translateX(0);
        }
        [data-scroll-reveal="scale"] {
          transform: scale(0.95);
        }
        [data-scroll-reveal="scale"].revealed {
          transform: scale(1);
        }
        [data-scroll-delay="100"] { transition-delay: 100ms; }
        [data-scroll-delay="200"] { transition-delay: 200ms; }
        [data-scroll-delay="300"] { transition-delay: 300ms; }
        [data-scroll-delay="400"] { transition-delay: 400ms; }
        [data-scroll-delay="500"] { transition-delay: 500ms; }
      `
      document.head.appendChild(style)

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('revealed')
            }
          })
        },
        {
          threshold: 0.1,
          rootMargin: '0px 0px -50px 0px'
        }
      )

      const elements = document.querySelectorAll('[data-scroll-reveal]')
      elements.forEach((el) => observer.observe(el))

      return () => {
        observer.disconnect()
        style.remove()
      }
    }
  }, [])
}

export default AnimatedBackground
