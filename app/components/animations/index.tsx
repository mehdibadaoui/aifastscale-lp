'use client'

import { motion, useInView, useMotionValue, useSpring } from 'framer-motion'
import { useRef, useEffect, ReactNode } from 'react'

// ============================================================================
// FADE IN WHEN VISIBLE
// ============================================================================
interface FadeInWhenVisibleProps {
  children: ReactNode
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'
  className?: string
}

export function FadeInWhenVisible({
  children,
  delay = 0,
  direction = 'up',
  className = ''
}: FadeInWhenVisibleProps) {
  const directionOffset = {
    up: { y: 30 },
    down: { y: -30 },
    left: { x: 30 },
    right: { x: -30 },
    none: {}
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, ...directionOffset[direction] }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.5,
        delay,
        ease: [0.25, 0.1, 0.25, 1]
      }}
    >
      {children}
    </motion.div>
  )
}

// ============================================================================
// SCALE ON HOVER
// ============================================================================
interface ScaleOnHoverProps {
  children: ReactNode
  scale?: number
  className?: string
}

export function ScaleOnHover({
  children,
  scale = 1.02,
  className = ''
}: ScaleOnHoverProps) {
  return (
    <motion.div
      className={className}
      whileHover={{ scale }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      {children}
    </motion.div>
  )
}

// ============================================================================
// STAGGER CONTAINER & ITEM
// ============================================================================
interface StaggerContainerProps {
  children: ReactNode
  staggerDelay?: number
  className?: string
}

export function StaggerContainer({
  children,
  staggerDelay = 0.1,
  className = ''
}: StaggerContainerProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={{
        visible: {
          transition: {
            staggerChildren: staggerDelay
          }
        }
      }}
    >
      {children}
    </motion.div>
  )
}

interface StaggerItemProps {
  children: ReactNode
  className?: string
}

export function StaggerItem({ children, className = '' }: StaggerItemProps) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.5,
            ease: [0.25, 0.1, 0.25, 1]
          }
        }
      }}
    >
      {children}
    </motion.div>
  )
}

// ============================================================================
// COUNT UP ANIMATION
// ============================================================================
interface CountUpProps {
  target: number
  duration?: number
  prefix?: string
  suffix?: string
  className?: string
}

export function CountUp({
  target,
  duration = 2,
  prefix = '',
  suffix = '',
  className = ''
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const motionValue = useMotionValue(0)
  const springValue = useSpring(motionValue, {
    duration: duration * 1000,
    bounce: 0
  })

  useEffect(() => {
    if (isInView) {
      motionValue.set(target)
    }
  }, [isInView, motionValue, target])

  useEffect(() => {
    const unsubscribe = springValue.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = `${prefix}${Math.round(latest).toLocaleString()}${suffix}`
      }
    })
    return unsubscribe
  }, [springValue, prefix, suffix])

  return <span ref={ref} className={className}>{prefix}0{suffix}</span>
}

// ============================================================================
// ANIMATED BUTTON
// ============================================================================
interface AnimatedButtonProps {
  children: ReactNode
  className?: string
  onClick?: () => void
  href?: string
  type?: 'button' | 'submit'
}

export function AnimatedButton({
  children,
  className = '',
  onClick,
  href,
  type = 'button'
}: AnimatedButtonProps) {
  const Component = href ? motion.a : motion.button

  return (
    <Component
      href={href}
      type={href ? undefined : type}
      onClick={onClick}
      className={className}
      whileHover={{
        scale: 1.03,
        boxShadow: "0 10px 40px rgba(245, 158, 11, 0.3)"
      }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      {children}
    </Component>
  )
}

// ============================================================================
// FLOATING ANIMATION
// ============================================================================
interface FloatingProps {
  children: ReactNode
  className?: string
  duration?: number
  distance?: number
}

export function Floating({
  children,
  className = '',
  duration = 3,
  distance = 10
}: FloatingProps) {
  return (
    <motion.div
      className={className}
      animate={{
        y: [0, -distance, 0],
      }}
      transition={{
        repeat: Infinity,
        duration,
        ease: "easeInOut"
      }}
    >
      {children}
    </motion.div>
  )
}

// ============================================================================
// HERO ANIMATION (for initial page load)
// ============================================================================
interface HeroAnimationProps {
  children: ReactNode
  delay?: number
  className?: string
}

export function HeroAnimation({
  children,
  delay = 0,
  className = ''
}: HeroAnimationProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.25, 0.1, 0.25, 1]
      }}
    >
      {children}
    </motion.div>
  )
}

// ============================================================================
// SLIDE IN STICKY BAR
// ============================================================================
interface SlideInBarProps {
  children: ReactNode
  className?: string
  showAfterScroll?: number
}

export function SlideInBar({
  children,
  className = '',
  showAfterScroll = 500
}: SlideInBarProps) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShow(window.scrollY > showAfterScroll)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [showAfterScroll])

  return (
    <motion.div
      className={className}
      initial={{ y: 100, opacity: 0 }}
      animate={{
        y: show ? 0 : 100,
        opacity: show ? 1 : 0
      }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
    >
      {children}
    </motion.div>
  )
}

import { useState } from 'react'
