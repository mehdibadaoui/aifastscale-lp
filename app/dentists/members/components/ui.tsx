'use client'

import { useState, useEffect, useRef, ReactNode, useCallback } from 'react'
import { X, Trophy, Loader2, AlertCircle, StickyNote, Keyboard, Settings, Moon, Sun, SkipForward, CheckCircle, Twitter, Linkedin, Printer, Award, Volume2, VolumeX } from 'lucide-react'
import { COURSE_CONFIG, KEYBOARD_SHORTCUTS, TOTAL_RUNTIME, COURSE_MODULES } from './config'

// ============================================
// CSS VARIABLES & PREMIUM ANIMATIONS
// ============================================

export function ThemeStyles() {
  return (
    <style dangerouslySetInnerHTML={{ __html: `
      :root {
        --color-primary: 20 184 166;
        --color-primary-light: 45 212 191;
        --color-accent: 6 182 212;
        --color-success: 16 185 129;
        --color-warning: 245 158 11;
        --color-error: 239 68 68;
        --transition-base: 200ms cubic-bezier(0.4, 0, 0.2, 1);
        --transition-spring: 500ms cubic-bezier(0.34, 1.56, 0.64, 1);
        --shadow-glow: 0 0 20px rgba(20, 184, 166, 0.3);
        --shadow-glow-lg: 0 0 40px rgba(20, 184, 166, 0.4);
      }

      .dark {
        --color-primary: 45 212 191;
        --color-primary-light: 94 234 212;
        --bg-dark: #0a0f1a;
        --bg-dark-card: rgba(15, 23, 42, 0.8);
      }

      /* Premium Dark Mode Background */
      .dark-premium-bg {
        background: linear-gradient(135deg, #0a0f1a 0%, #0d1525 25%, #0f172a 50%, #0d1525 75%, #0a0f1a 100%);
        background-size: 400% 400%;
        animation: gradient-shift-bg 15s ease infinite;
      }

      @keyframes gradient-shift-bg {
        0%, 100% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
      }

      /* Floating Orbs Animation */
      .floating-orb {
        position: absolute;
        border-radius: 50%;
        filter: blur(80px);
        opacity: 0.5;
        animation: float-orb 20s ease-in-out infinite;
        pointer-events: none;
      }

      .floating-orb-1 {
        width: 600px;
        height: 600px;
        background: radial-gradient(circle, rgba(20, 184, 166, 0.4) 0%, transparent 70%);
        top: -200px;
        right: -200px;
        animation-delay: 0s;
      }

      .floating-orb-2 {
        width: 500px;
        height: 500px;
        background: radial-gradient(circle, rgba(6, 182, 212, 0.3) 0%, transparent 70%);
        bottom: -150px;
        left: -150px;
        animation-delay: -5s;
      }

      .floating-orb-3 {
        width: 400px;
        height: 400px;
        background: radial-gradient(circle, rgba(139, 92, 246, 0.25) 0%, transparent 70%);
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        animation-delay: -10s;
      }

      @keyframes float-orb {
        0%, 100% { transform: translate(0, 0) scale(1); }
        25% { transform: translate(30px, -30px) scale(1.05); }
        50% { transform: translate(-20px, 20px) scale(0.95); }
        75% { transform: translate(20px, 30px) scale(1.02); }
      }

      /* Particle Animation */
      .particle {
        position: absolute;
        width: 4px;
        height: 4px;
        background: rgba(20, 184, 166, 0.6);
        border-radius: 50%;
        animation: particle-float 10s ease-in-out infinite;
        pointer-events: none;
      }

      @keyframes particle-float {
        0%, 100% { transform: translateY(0) translateX(0); opacity: 0; }
        10% { opacity: 1; }
        90% { opacity: 1; }
        100% { transform: translateY(-100vh) translateX(50px); opacity: 0; }
      }

      /* Premium Glass Card */
      .glass-premium {
        background: rgba(255, 255, 255, 0.05);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1);
      }

      .dark .glass-premium {
        background: rgba(15, 23, 42, 0.6);
        border: 1px solid rgba(45, 212, 191, 0.1);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.05);
      }

      /* Neon Glow Effect */
      .neon-glow {
        box-shadow: 0 0 20px rgba(20, 184, 166, 0.3), 0 0 40px rgba(20, 184, 166, 0.1);
      }

      .neon-glow-hover:hover {
        box-shadow: 0 0 30px rgba(20, 184, 166, 0.5), 0 0 60px rgba(20, 184, 166, 0.2);
      }

      /* Gradient Text Premium */
      .gradient-text-premium {
        background: linear-gradient(135deg, #14b8a6 0%, #06b6d4 50%, #8b5cf6 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      .gradient-text-animated-premium {
        background: linear-gradient(90deg, #14b8a6, #06b6d4, #8b5cf6, #06b6d4, #14b8a6);
        background-size: 300% 100%;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        animation: gradient-shift 4s ease infinite;
      }

      /* Aurora Background */
      .aurora-bg {
        position: relative;
        overflow: hidden;
      }

      .aurora-bg::before {
        content: '';
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        background: conic-gradient(from 0deg at 50% 50%,
          transparent 0deg,
          rgba(20, 184, 166, 0.1) 60deg,
          transparent 120deg,
          rgba(6, 182, 212, 0.1) 180deg,
          transparent 240deg,
          rgba(139, 92, 246, 0.1) 300deg,
          transparent 360deg
        );
        animation: aurora-rotate 30s linear infinite;
        pointer-events: none;
      }

      @keyframes aurora-rotate {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }

      /* Mesh Gradient */
      .mesh-gradient {
        background:
          radial-gradient(at 40% 20%, rgba(20, 184, 166, 0.15) 0px, transparent 50%),
          radial-gradient(at 80% 0%, rgba(6, 182, 212, 0.1) 0px, transparent 50%),
          radial-gradient(at 0% 50%, rgba(139, 92, 246, 0.1) 0px, transparent 50%),
          radial-gradient(at 80% 50%, rgba(20, 184, 166, 0.1) 0px, transparent 50%),
          radial-gradient(at 0% 100%, rgba(6, 182, 212, 0.15) 0px, transparent 50%);
      }

      /* Premium micro-interactions */
      .btn-press {
        transition: transform var(--transition-spring), box-shadow var(--transition-base);
        will-change: transform;
      }
      .btn-press:hover {
        transform: translateY(-3px) scale(1.02);
        box-shadow: var(--shadow-glow-lg);
      }
      .btn-press:active {
        transform: translateY(0) scale(0.98);
        box-shadow: var(--shadow-glow);
      }

      .card-lift {
        transition: transform var(--transition-spring), box-shadow var(--transition-base);
        will-change: transform;
      }
      .card-lift:hover {
        transform: translateY(-6px) scale(1.01);
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
      }

      /* Glow hover effect */
      .glow-hover {
        position: relative;
        overflow: hidden;
      }
      .glow-hover::before {
        content: '';
        position: absolute;
        inset: -2px;
        background: linear-gradient(45deg, #14b8a6, #06b6d4, #14b8a6);
        border-radius: inherit;
        opacity: 0;
        transition: opacity 0.3s;
        z-index: -1;
      }
      .glow-hover:hover::before {
        opacity: 1;
        animation: rotate-glow 3s linear infinite;
      }

      @keyframes rotate-glow {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }

      /* Gradient text animation */
      .gradient-text-animated {
        background: linear-gradient(90deg, #14b8a6, #06b6d4, #0ea5e9, #14b8a6);
        background-size: 300% 100%;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        animation: gradient-shift 4s ease infinite;
      }

      @keyframes gradient-shift {
        0%, 100% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
      }

      /* Shimmer loading effect */
      .shimmer {
        background: linear-gradient(90deg,
          rgba(255,255,255,0) 0%,
          rgba(255,255,255,0.3) 50%,
          rgba(255,255,255,0) 100%
        );
        background-size: 200% 100%;
        animation: shimmer 1.5s infinite;
      }

      .dark .shimmer {
        background: linear-gradient(90deg,
          rgba(255,255,255,0) 0%,
          rgba(255,255,255,0.1) 50%,
          rgba(255,255,255,0) 100%
        );
        background-size: 200% 100%;
      }

      @keyframes shimmer {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
      }

      /* Confetti */
      @keyframes confetti {
        0% { transform: translateY(0) rotate(0deg); opacity: 1; }
        100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
      }
      .animate-confetti { animation: confetti 4s ease-out forwards; }

      /* Star confetti variant */
      @keyframes confetti-star {
        0% { transform: translateY(0) rotate(0deg) scale(1); opacity: 1; }
        50% { transform: translateY(50vh) rotate(360deg) scale(1.2); opacity: 0.8; }
        100% { transform: translateY(100vh) rotate(720deg) scale(0.5); opacity: 0; }
      }
      .animate-confetti-star { animation: confetti-star 3s ease-out forwards; }

      /* Bounce slow */
      @keyframes bounce-slow {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
      }
      .animate-bounce-slow { animation: bounce-slow 2s ease-in-out infinite; }

      /* Float animation */
      @keyframes float {
        0%, 100% { transform: translateY(0) rotate(0deg); }
        25% { transform: translateY(-5px) rotate(1deg); }
        75% { transform: translateY(5px) rotate(-1deg); }
      }
      .animate-float { animation: float 6s ease-in-out infinite; }

      /* Slide down toast */
      @keyframes slide-down {
        0% { transform: translate(-50%, -100px); opacity: 0; }
        10% { transform: translate(-50%, 0); opacity: 1; }
        90% { transform: translate(-50%, 0); opacity: 1; }
        100% { transform: translate(-50%, -100px); opacity: 0; }
      }
      .animate-slide-down { animation: slide-down 5s ease-out forwards; }

      /* Pulse glow */
      @keyframes pulse-glow {
        0%, 100% { box-shadow: 0 0 20px rgba(251, 191, 36, 0.4); }
        50% { box-shadow: 0 0 40px rgba(251, 191, 36, 0.8); }
      }
      .animate-pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }

      /* Fade in */
      @keyframes fade-in {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }

      /* Scale in */
      @keyframes scale-in {
        from { opacity: 0; transform: scale(0.9); }
        to { opacity: 1; transform: scale(1); }
      }
      .animate-scale-in { animation: scale-in 0.3s var(--transition-spring) forwards; }

      /* Slide up (for mobile bottom sheets) */
      @keyframes slide-up {
        from { opacity: 0; transform: translateY(100%); }
        to { opacity: 1; transform: translateY(0); }
      }
      .animate-slide-up { animation: slide-up 0.3s ease-out forwards; }

      /* iOS Safe Areas */
      .pb-safe { padding-bottom: env(safe-area-inset-bottom, 0); }
      .pt-safe { padding-top: env(safe-area-inset-top, 0); }
      .px-safe {
        padding-left: env(safe-area-inset-left, 0);
        padding-right: env(safe-area-inset-right, 0);
      }

      /* Hide scrollbar but keep scrollable */
      .scrollbar-hide {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
      .scrollbar-hide::-webkit-scrollbar {
        display: none;
      }

      /* Skeleton pulse */
      @keyframes skeleton-pulse {
        0%, 100% { opacity: 0.4; }
        50% { opacity: 0.7; }
      }
      .animate-skeleton { animation: skeleton-pulse 1.5s ease-in-out infinite; }

      /* Progress ring animation */
      @keyframes progress-ring {
        from { stroke-dashoffset: 283; }
      }
      .animate-progress-ring {
        animation: progress-ring 1.5s ease-out forwards;
      }

      /* Celebration animation */
      @keyframes celebrate {
        0% { transform: scale(1); }
        25% { transform: scale(1.1) rotate(-5deg); }
        50% { transform: scale(1.2) rotate(5deg); }
        75% { transform: scale(1.1) rotate(-5deg); }
        100% { transform: scale(1) rotate(0deg); }
      }
      .animate-celebrate { animation: celebrate 0.6s ease-in-out; }

      /* Parallax layers */
      .parallax-slow { transform: translateY(calc(var(--scroll) * 0.1px)); }
      .parallax-medium { transform: translateY(calc(var(--scroll) * 0.3px)); }
      .parallax-fast { transform: translateY(calc(var(--scroll) * 0.5px)); }

      /* Glassmorphism depth */
      .glass-1 {
        background: rgba(255, 255, 255, 0.7);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.3);
      }
      .glass-2 {
        background: rgba(255, 255, 255, 0.5);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.2);
      }
      .glass-3 {
        background: rgba(255, 255, 255, 0.3);
        backdrop-filter: blur(30px);
        border: 1px solid rgba(255, 255, 255, 0.1);
      }
      .dark .glass-1 {
        background: rgba(15, 23, 42, 0.95);
        border-color: rgba(255, 255, 255, 0.15);
      }
      .dark .glass-2 {
        background: rgba(15, 23, 42, 0.9);
        border-color: rgba(255, 255, 255, 0.1);
      }
      .dark .glass-3 {
        background: rgba(15, 23, 42, 0.85);
        border-color: rgba(255, 255, 255, 0.08);
      }

      /* Section transitions */
      .section-enter {
        animation: fade-in 0.4s ease-out, scale-in 0.4s var(--transition-spring);
      }

      /* Reduced motion */
      @media (prefers-reduced-motion: reduce) {
        *, *::before, *::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }
      }

      /* Print styles */
      @media print {
        body * { visibility: hidden; }
        .print-area, .print-area * { visibility: visible; }
        .print-area { position: absolute; left: 0; top: 0; width: 100%; }
      }

      /* Focus styles */
      .focus-ring:focus-visible {
        outline: 2px solid rgb(var(--color-primary));
        outline-offset: 2px;
      }

      /* Skip link */
      .skip-link {
        position: absolute;
        top: -40px;
        left: 0;
        background: rgb(var(--color-primary));
        color: white;
        padding: 8px 16px;
        z-index: 100;
        transition: top 0.3s;
        border-radius: 0 0 8px 0;
      }
      .skip-link:focus {
        top: 0;
      }

      /* Touch feedback */
      @media (hover: none) {
        .btn-press:active {
          transform: scale(0.95);
          opacity: 0.9;
        }
      }
    `}} />
  )
}

// ============================================
// HAPTIC FEEDBACK HOOK
// ============================================

export function useHaptic() {
  const vibrate = useCallback((pattern: number | number[] = 10) => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(pattern)
    }
  }, [])

  return {
    light: () => vibrate(10),
    medium: () => vibrate(20),
    heavy: () => vibrate([30, 10, 30]),
    success: () => vibrate([10, 50, 10]),
    error: () => vibrate([50, 30, 50]),
  }
}

// ============================================
// SWIPE GESTURE HOOK
// ============================================

interface SwipeHandlers {
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeUp?: () => void
  onSwipeDown?: () => void
}

export function useSwipeGesture(handlers: SwipeHandlers, threshold = 50) {
  const touchStart = useRef<{ x: number; y: number } | null>(null)
  const touchEnd = useRef<{ x: number; y: number } | null>(null)

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    touchEnd.current = null
    touchStart.current = {
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    }
  }, [])

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    touchEnd.current = {
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    }
  }, [])

  const onTouchEnd = useCallback(() => {
    if (!touchStart.current || !touchEnd.current) return

    const deltaX = touchStart.current.x - touchEnd.current.x
    const deltaY = touchStart.current.y - touchEnd.current.y
    const absX = Math.abs(deltaX)
    const absY = Math.abs(deltaY)

    if (absX > absY && absX > threshold) {
      if (deltaX > 0) {
        handlers.onSwipeLeft?.()
      } else {
        handlers.onSwipeRight?.()
      }
    } else if (absY > absX && absY > threshold) {
      if (deltaY > 0) {
        handlers.onSwipeUp?.()
      } else {
        handlers.onSwipeDown?.()
      }
    }
  }, [handlers, threshold])

  return { onTouchStart, onTouchMove, onTouchEnd }
}

// ============================================
// PROGRESS RING COMPONENT
// ============================================

interface ProgressRingProps {
  progress: number
  size?: number
  strokeWidth?: number
  className?: string
}

export function ProgressRing({ progress, size = 120, strokeWidth = 8, className = '' }: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (progress / 100) * circumference

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-slate-200 dark:text-slate-700"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#progress-gradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="animate-progress-ring"
          style={{ transition: 'stroke-dashoffset 1s ease-out' }}
        />
        <defs>
          <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#14b8a6" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-black text-slate-900 dark:text-white">{Math.round(progress)}%</span>
      </div>
    </div>
  )
}

// ============================================
// SKELETON LOADER
// ============================================

export function Skeleton({ className = '', variant = 'rect' }: { className?: string; variant?: 'rect' | 'circle' | 'text' }) {
  const baseClass = 'bg-slate-200 dark:bg-slate-700 animate-skeleton relative overflow-hidden'
  const variantClass = variant === 'circle' ? 'rounded-full' : variant === 'text' ? 'rounded h-4' : 'rounded-xl'
  return (
    <div className={`${baseClass} ${variantClass} ${className}`} aria-hidden="true">
      <div className="absolute inset-0 shimmer" />
    </div>
  )
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-fade-in">
      <Skeleton className="h-48 w-full" />
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-24" />)}
      </div>
      <div className="grid lg:grid-cols-3 gap-6">
        <Skeleton className="lg:col-span-2 h-40" />
        <Skeleton className="h-40" />
      </div>
    </div>
  )
}

// ============================================
// MODAL WITH FOCUS TRAP
// ============================================

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  icon?: ReactNode
  children: ReactNode
  size?: 'sm' | 'md' | 'lg'
  showPrint?: boolean
}

export function Modal({ isOpen, onClose, title, icon, children, size = 'md', showPrint }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const previousFocus = useRef<HTMLElement | null>(null)
  const haptic = useHaptic()

  useEffect(() => {
    if (isOpen) {
      previousFocus.current = document.activeElement as HTMLElement
      haptic.light()
      setTimeout(() => {
        const firstFocusable = modalRef.current?.querySelector<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
        firstFocusable?.focus()
      }, 100)
    } else {
      previousFocus.current?.focus()
    }
  }, [isOpen, haptic])

  // Focus trap
  useEffect(() => {
    if (!isOpen) return

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || !modalRef.current) return

      const focusableEls = modalRef.current.querySelectorAll<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
      const firstEl = focusableEls[0]
      const lastEl = focusableEls[focusableEls.length - 1]

      if (e.shiftKey && document.activeElement === firstEl) {
        lastEl?.focus()
        e.preventDefault()
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        firstEl?.focus()
        e.preventDefault()
      }
    }

    window.addEventListener('keydown', handleTab)
    return () => window.removeEventListener('keydown', handleTab)
  }, [isOpen])

  if (!isOpen) return null

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-3xl',
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/50 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        ref={modalRef}
        className={`bg-white dark:bg-slate-900 rounded-t-2xl sm:rounded-2xl shadow-2xl w-full ${sizeClasses[size]} max-h-[85vh] sm:max-h-[90vh] overflow-auto animate-slide-up sm:animate-scale-in glass-1 pb-safe`}
        onClick={e => e.stopPropagation()}
      >
        {/* Mobile drag handle */}
        <div className="sm:hidden flex justify-center pt-2 pb-1">
          <div className="w-10 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
        </div>
        <div className="p-3 sm:p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm z-10">
          <h2 id="modal-title" className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            {icon} {title}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 active:bg-slate-200 dark:active:bg-slate-700 transition-all focus-ring touch-manipulation"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>
        <div className={showPrint ? 'print-area' : ''}>
          {children}
        </div>
      </div>
    </div>
  )
}

// ============================================
// WISTIA PLAYER WITH SPEED CONTROLS
// ============================================

interface WistiaPlayerProps {
  wistiaId: string
  onVideoEnd?: () => void
  onProgress?: (percent: number, seconds: number) => void
  resumeTime?: number
  reducedMotion?: boolean
  showSpeedControls?: boolean
}

const PLAYBACK_SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2]

export function WistiaPlayer({ wistiaId, onVideoEnd, onProgress, resumeTime = 0, reducedMotion, showSpeedControls = true }: WistiaPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [playbackSpeed, setPlaybackSpeed] = useState(1)
  const [showSpeedMenu, setShowSpeedMenu] = useState(false)
  const videoRef = useRef<any>(null)

  useEffect(() => {
    if (!containerRef.current || !wistiaId) return
    setIsLoading(true)
    setHasError(false)
    containerRef.current.innerHTML = ''

    const wistiaDiv = document.createElement('div')
    wistiaDiv.className = 'wistia_responsive_padding'
    wistiaDiv.style.padding = '56.25% 0 0 0'
    wistiaDiv.style.position = 'relative'

    const wistiaWrapper = document.createElement('div')
    wistiaWrapper.className = 'wistia_responsive_wrapper'
    wistiaWrapper.style.cssText = 'height:100%;left:0;position:absolute;top:0;width:100%'

    const wistiaEmbed = document.createElement('div')
    wistiaEmbed.className = `wistia_embed wistia_async_${wistiaId} seo=true videoFoam=true`
    wistiaEmbed.style.cssText = 'height:100%;position:relative;width:100%'

    wistiaWrapper.appendChild(wistiaEmbed)
    wistiaDiv.appendChild(wistiaWrapper)
    containerRef.current.appendChild(wistiaDiv)

    if (!document.querySelector('script[src*="wistia.com/assets/external/E-v1.js"]')) {
      const script = document.createElement('script')
      script.src = 'https://fast.wistia.com/assets/external/E-v1.js'
      script.async = true
      script.onerror = () => setHasError(true)
      document.head.appendChild(script)
    }

    const checkWistia = setInterval(() => {
      if ((window as any).Wistia) {
        const video = (window as any).Wistia.api(wistiaId)
        if (video) {
          clearInterval(checkWistia)
          setIsLoading(false)
          videoRef.current = video

          if (resumeTime > 0) {
            video.time(resumeTime)
          }

          video.bind('end', () => {
            if (onVideoEnd) onVideoEnd()
          })

          video.bind('secondchange', (s: number) => {
            if (onProgress && s % 5 === 0) {
              const duration = video.duration()
              const percent = duration > 0 ? (s / duration) * 100 : 0
              onProgress(percent, s)
            }
          })
        }
      }
    }, 100)

    const timeout = setTimeout(() => { clearInterval(checkWistia); setIsLoading(false) }, 10000)
    return () => { clearInterval(checkWistia); clearTimeout(timeout); if (containerRef.current) containerRef.current.innerHTML = '' }
  }, [wistiaId, resumeTime])

  // Handle speed change
  const changeSpeed = useCallback((speed: number) => {
    setPlaybackSpeed(speed)
    setShowSpeedMenu(false)
    if (videoRef.current) {
      videoRef.current.playbackRate(speed)
    }
  }, [])

  if (hasError) {
    return (
      <div className="aspect-video rounded-2xl bg-slate-100 dark:bg-slate-700/80 flex items-center justify-center glass-2 border border-slate-200/50 dark:border-slate-600" role="alert">
        <div className="text-center p-6">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
          <p className="text-slate-900 dark:text-white font-bold mb-2">Video failed to load</p>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Please refresh the page</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-teal-400/20 ring-1 ring-black/5 glow-hover">
      {isLoading && (
        <div className="absolute inset-0 bg-slate-100 dark:bg-slate-700/80 flex items-center justify-center z-10 rounded-2xl">
          <div className="text-center">
            <Loader2 className={`w-10 h-10 text-teal-500 mx-auto mb-3 ${reducedMotion ? '' : 'animate-spin'}`} />
            <p className="text-slate-500 dark:text-slate-400 text-sm">Loading video...</p>
            {resumeTime > 0 && (
              <p className="text-teal-500 text-xs mt-2">Resuming from {Math.floor(resumeTime / 60)}:{String(Math.floor(resumeTime % 60)).padStart(2, '0')}</p>
            )}
          </div>
        </div>
      )}
      <div ref={containerRef} />

      {/* Speed Controls */}
      {showSpeedControls && !isLoading && (
        <div className="absolute bottom-4 right-4 z-20">
          <div className="relative">
            <button
              onClick={() => setShowSpeedMenu(!showSpeedMenu)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/70 hover:bg-black/80 text-white text-sm font-medium transition-all backdrop-blur-sm"
              aria-label="Playback speed"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              {playbackSpeed}x
            </button>

            {showSpeedMenu && (
              <div className="absolute bottom-full right-0 mb-2 bg-white dark:bg-slate-700/95 rounded-xl shadow-xl border border-slate-200 dark:border-slate-600 overflow-hidden animate-scale-in">
                {PLAYBACK_SPEEDS.map((speed) => (
                  <button
                    key={speed}
                    onClick={() => changeSpeed(speed)}
                    className={`w-full px-4 py-2 text-sm font-medium text-left transition-all hover:bg-slate-100 dark:hover:bg-slate-700 ${
                      playbackSpeed === speed
                        ? 'bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400'
                        : 'text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {speed}x {speed === 1 && '(Normal)'}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// ============================================
// PREMIUM CONFETTI WITH VARIANTS
// ============================================

interface ConfettiProps {
  active: boolean
  reducedMotion?: boolean
  variant?: 'default' | 'stars' | 'celebration'
}

export function Confetti({ active, reducedMotion, variant = 'default' }: ConfettiProps) {
  if (!active || reducedMotion) return null

  const colors = ['#14b8a6', '#06b6d4', '#f59e0b', '#10b981', '#0ea5e9', '#22d3ee']

  if (variant === 'stars') {
    return (
      <div className="fixed inset-0 pointer-events-none z-50" aria-hidden="true">
        {[...Array(40)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-confetti-star"
            style={{
              left: `${Math.random() * 100}%`,
              top: '-20px',
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2.5 + Math.random() * 1.5}s`,
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill={colors[Math.floor(Math.random() * colors.length)]}>
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </div>
        ))}
      </div>
    )
  }

  if (variant === 'celebration') {
    return (
      <div className="fixed inset-0 pointer-events-none z-50" aria-hidden="true">
        {/* Confetti squares */}
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-confetti"
            style={{
              left: `${Math.random() * 100}%`,
              top: '-10px',
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          >
            <div
              className="w-3 h-3"
              style={{
                backgroundColor: colors[Math.floor(Math.random() * colors.length)],
                transform: `rotate(${Math.random() * 360}deg)`,
                borderRadius: Math.random() > 0.5 ? '50%' : '2px',
              }}
            />
          </div>
        ))}
        {/* Sparkle stars */}
        {[...Array(20)].map((_, i) => (
          <div
            key={`star-${i}`}
            className="absolute animate-confetti-star"
            style={{
              left: `${Math.random() * 100}%`,
              top: '-20px',
              animationDelay: `${Math.random() * 2}s`,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill={colors[Math.floor(Math.random() * colors.length)]}>
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </div>
        ))}
      </div>
    )
  }

  // Default confetti
  return (
    <div className="fixed inset-0 pointer-events-none z-50" aria-hidden="true">
      {[...Array(60)].map((_, i) => (
        <div
          key={i}
          className="absolute animate-confetti"
          style={{
            left: `${Math.random() * 100}%`,
            top: '-10px',
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${3 + Math.random() * 2}s`,
          }}
        >
          <div className="w-3 h-3 rotate-45" style={{ backgroundColor: colors[Math.floor(Math.random() * colors.length)] }} />
        </div>
      ))}
    </div>
  )
}

// ============================================
// ACHIEVEMENT TOAST
// ============================================

export function AchievementToast({ name, onPlaySound }: { name: string | null; onPlaySound?: () => void }) {
  useEffect(() => {
    if (name && onPlaySound) {
      onPlaySound()
    }
  }, [name, onPlaySound])

  if (!name) return null

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-slide-down" role="alert" aria-live="polite">
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-4 rounded-2xl shadow-2xl shadow-amber-500/30 flex items-center gap-4 glass-2">
        <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center animate-celebrate">
          <Trophy className="w-6 h-6" />
        </div>
        <div>
          <div className="text-xs font-medium text-amber-100 uppercase tracking-wide">Achievement Unlocked!</div>
          <div className="text-lg font-black">{name}</div>
        </div>
      </div>
    </div>
  )
}

// ============================================
// FLOATING ACTION BUTTON (Mobile)
// ============================================

interface FABProps {
  actions: { icon: ReactNode; label: string; onClick: () => void }[]
}

export function FloatingActionButton({ actions }: FABProps) {
  const [isOpen, setIsOpen] = useState(false)
  const haptic = useHaptic()

  const toggleOpen = () => {
    haptic.light()
    setIsOpen(!isOpen)
  }

  return (
    <div className="fixed bottom-20 right-4 z-40 md:hidden pb-safe">
      {/* Action buttons */}
      <div className={`absolute bottom-16 right-0 flex flex-col gap-2 transition-all duration-300 ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
        {actions.map((action, i) => (
          <button
            key={i}
            onClick={() => { action.onClick(); setIsOpen(false); haptic.medium(); }}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-slate-700/90 shadow-lg border border-slate-200 dark:border-slate-600 text-sm font-medium text-slate-700 dark:text-slate-200 whitespace-nowrap animate-scale-in"
            style={{ animationDelay: `${i * 50}ms` }}
          >
            {action.icon}
            {action.label}
          </button>
        ))}
      </div>

      {/* Main FAB */}
      <button
        onClick={toggleOpen}
        className={`w-14 h-14 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg shadow-teal-400/30 flex items-center justify-center transition-all duration-300 ${isOpen ? 'rotate-45 scale-110' : ''}`}
        aria-label="Quick actions"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>
  )
}

// ============================================
// NOTES MODAL
// ============================================

interface NotesModalProps {
  isOpen: boolean
  onClose: () => void
  moduleId: string
  moduleTitle: string
  notes: string
  onSave: (notes: string) => void
}

export function NotesModal({ isOpen, onClose, moduleId, moduleTitle, notes, onSave }: NotesModalProps) {
  const [noteText, setNoteText] = useState(notes)
  const haptic = useHaptic()

  useEffect(() => {
    setNoteText(notes)
  }, [notes, moduleId])

  const handleSave = () => {
    onSave(noteText)
    haptic.success()
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Notes" icon={<StickyNote className="w-5 h-5 text-amber-500" />}>
      <div className="p-4">
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{moduleTitle}</p>
        <textarea
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          placeholder="Write your notes here... What did you learn? Key takeaways?"
          className="w-full h-48 p-4 rounded-xl bg-white dark:bg-slate-800/90 border-2 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-teal-500 dark:focus:border-teal-400 focus:outline-none focus:ring-4 focus:ring-teal-500/20 transition-all resize-none"
          aria-label="Module notes"
        />
      </div>
      <div className="p-4 border-t border-slate-200 dark:border-slate-700 flex gap-3 justify-end">
        <button onClick={onClose} className="px-4 py-2 rounded-xl font-bold bg-white dark:bg-slate-700/80 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600 transition-all focus-ring">
          Cancel
        </button>
        <button onClick={handleSave} className="px-4 py-2 rounded-xl font-bold bg-teal-500 text-white hover:bg-teal-600 transition-all btn-press focus-ring">
          Save Notes
        </button>
      </div>
    </Modal>
  )
}

// ============================================
// KEYBOARD SHORTCUTS MODAL
// ============================================

export function KeyboardShortcutsModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Keyboard Shortcuts" icon={<Keyboard className="w-5 h-5 text-teal-500" />} size="sm">
      <div className="p-4 space-y-2">
        {KEYBOARD_SHORTCUTS.map((shortcut, i) => (
          <div key={i} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
            <span className="text-slate-600 dark:text-slate-400">{shortcut.action}</span>
            <kbd className="px-3 py-1 rounded-lg bg-white dark:bg-slate-700/80 text-slate-900 dark:text-white font-mono text-sm border border-slate-200 dark:border-slate-600 shadow-sm">
              {shortcut.key}
            </kbd>
          </div>
        ))}
      </div>
    </Modal>
  )
}

// ============================================
// SETTINGS MODAL (Auto-save)
// ============================================

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
  darkMode: boolean
  autoPlayNext: boolean
  showCompletedBadge: boolean
  soundEnabled: boolean
  onUpdate: (settings: { darkMode?: boolean; autoPlayNext?: boolean; showCompletedBadge?: boolean; soundEnabled?: boolean }) => void
}

export function SettingsModal({ isOpen, onClose, darkMode, autoPlayNext, showCompletedBadge, soundEnabled, onUpdate }: SettingsModalProps) {
  const haptic = useHaptic()

  const toggle = (key: string, value: boolean) => {
    haptic.light()
    onUpdate({ [key]: !value })
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Settings" icon={<Settings className="w-5 h-5 text-teal-500" />} size="sm">
      <div className="p-4 space-y-3">
        {/* Dark Mode */}
        <button
          onClick={() => toggle('darkMode', darkMode)}
          className="w-full flex items-center justify-between p-4 rounded-xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-500 transition-all focus-ring shadow-sm"
          role="switch"
          aria-checked={darkMode}
        >
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${darkMode ? 'bg-teal-500/10' : 'bg-amber-500/10'}`}>
              {darkMode ? <Moon className="w-5 h-5 text-teal-500" /> : <Sun className="w-5 h-5 text-amber-500" />}
            </div>
            <div className="text-left">
              <p className="font-bold text-slate-900 dark:text-white">Dark Mode</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Easier on the eyes</p>
            </div>
          </div>
          <div className={`w-12 h-6 rounded-full transition-all ${darkMode ? 'bg-teal-500' : 'bg-slate-300 dark:bg-slate-600'}`}>
            <div className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-all mt-0.5 ${darkMode ? 'translate-x-6' : 'translate-x-0.5'}`} />
          </div>
        </button>

        {/* Auto-play Next */}
        <button
          onClick={() => toggle('autoPlayNext', autoPlayNext)}
          className="w-full flex items-center justify-between p-4 rounded-xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-500 transition-all focus-ring shadow-sm"
          role="switch"
          aria-checked={autoPlayNext}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-teal-500/10">
              <SkipForward className="w-5 h-5 text-teal-500" />
            </div>
            <div className="text-left">
              <p className="font-bold text-slate-900 dark:text-white">Auto-play Next</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Play next module automatically</p>
            </div>
          </div>
          <div className={`w-12 h-6 rounded-full transition-all ${autoPlayNext ? 'bg-teal-500' : 'bg-slate-300 dark:bg-slate-600'}`}>
            <div className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-all mt-0.5 ${autoPlayNext ? 'translate-x-6' : 'translate-x-0.5'}`} />
          </div>
        </button>

        {/* Sound Effects */}
        <button
          onClick={() => toggle('soundEnabled', soundEnabled)}
          className="w-full flex items-center justify-between p-4 rounded-xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-500 transition-all focus-ring shadow-sm"
          role="switch"
          aria-checked={soundEnabled}
        >
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${soundEnabled ? 'bg-emerald-500/10' : 'bg-slate-200 dark:bg-slate-700'}`}>
              {soundEnabled ? <Volume2 className="w-5 h-5 text-emerald-500" /> : <VolumeX className="w-5 h-5 text-slate-400" />}
            </div>
            <div className="text-left">
              <p className="font-bold text-slate-900 dark:text-white">Sound Effects</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Play sounds for achievements</p>
            </div>
          </div>
          <div className={`w-12 h-6 rounded-full transition-all ${soundEnabled ? 'bg-teal-500' : 'bg-slate-300 dark:bg-slate-600'}`}>
            <div className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-all mt-0.5 ${soundEnabled ? 'translate-x-6' : 'translate-x-0.5'}`} />
          </div>
        </button>

        {/* Show Completed Badge */}
        <button
          onClick={() => toggle('showCompletedBadge', showCompletedBadge)}
          className="w-full flex items-center justify-between p-4 rounded-xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-500 transition-all focus-ring shadow-sm"
          role="switch"
          aria-checked={showCompletedBadge}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-emerald-500/10">
              <CheckCircle className="w-5 h-5 text-emerald-500" />
            </div>
            <div className="text-left">
              <p className="font-bold text-slate-900 dark:text-white">Completed Badges</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Show completion status</p>
            </div>
          </div>
          <div className={`w-12 h-6 rounded-full transition-all ${showCompletedBadge ? 'bg-teal-500' : 'bg-slate-300 dark:bg-slate-600'}`}>
            <div className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-all mt-0.5 ${showCompletedBadge ? 'translate-x-6' : 'translate-x-0.5'}`} />
          </div>
        </button>
      </div>
      <div className="p-4 border-t border-slate-200 dark:border-slate-700 text-center text-sm text-slate-500 dark:text-slate-400">
        Settings auto-save when changed
      </div>
    </Modal>
  )
}

// ============================================
// CERTIFICATE MODAL
// ============================================

interface CertificateModalProps {
  isOpen: boolean
  onClose: () => void
  studentName: string
  completionDate: string
}

export function CertificateModal({ isOpen, onClose, studentName, completionDate }: CertificateModalProps) {
  const handlePrint = () => window.print()

  const handleShare = (platform: 'twitter' | 'linkedin') => {
    const text = `I just completed the ${COURSE_CONFIG.title} ${COURSE_CONFIG.subtitle} course! 🎓`
    const url = 'https://aifastscale.com/dentists'

    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
    }

    window.open(urls[platform], '_blank', 'width=600,height=400')
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Your Certificate" size="lg" showPrint>
      <div className="p-8">
        <div className="bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-800/20 dark:to-cyan-800/20 rounded-2xl p-8 border-4 border-teal-200 dark:border-teal-600 text-center relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-teal-200/50 to-transparent rounded-br-full" />
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-cyan-200/50 to-transparent rounded-tl-full" />
          <div className="absolute top-1/2 left-0 w-4 h-20 bg-gradient-to-r from-teal-300/30 to-transparent -translate-y-1/2" />
          <div className="absolute top-1/2 right-0 w-4 h-20 bg-gradient-to-l from-cyan-300/30 to-transparent -translate-y-1/2" />

          <div className="relative z-10">
            <Trophy className="w-16 h-16 text-amber-500 mx-auto mb-4 animate-float" />
            <h3 className="text-lg font-medium text-teal-500 dark:text-teal-300 mb-2">Certificate of Completion</h3>
            <h1 className="text-4xl font-black gradient-text-animated mb-2">{COURSE_CONFIG.title}</h1>
            <p className="text-xl text-teal-500 dark:text-teal-300 font-bold mb-8">{COURSE_CONFIG.subtitle}</p>

            <div className="bg-white/50 dark:bg-white/10 rounded-xl p-6 mb-6 inline-block glass-2">
              <p className="text-slate-600 dark:text-slate-300 mb-2">This certifies that</p>
              <p className="text-3xl font-black text-slate-900 dark:text-white">{studentName || 'Student'}</p>
              <p className="text-slate-600 dark:text-slate-300 mt-2">has successfully completed all modules</p>
            </div>

            <div className="flex items-center justify-center gap-8 text-sm text-slate-600 dark:text-slate-400">
              <div>
                <p className="font-bold">Date Completed</p>
                <p>{completionDate}</p>
              </div>
              <div>
                <p className="font-bold">Total Duration</p>
                <p>{TOTAL_RUNTIME} minutes</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 border-t border-slate-200 dark:border-slate-700 flex flex-wrap gap-3 justify-center">
        <button onClick={handlePrint} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-500 text-white font-bold hover:bg-teal-600 transition-all btn-press focus-ring">
          <Printer className="w-4 h-4" /> Print
        </button>
        <button onClick={() => handleShare('twitter')} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1DA1F2] text-white font-bold hover:opacity-90 transition-all btn-press focus-ring">
          <Twitter className="w-4 h-4" /> Tweet
        </button>
        <button onClick={() => handleShare('linkedin')} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0A66C2] text-white font-bold hover:opacity-90 transition-all btn-press focus-ring">
          <Linkedin className="w-4 h-4" /> Share
        </button>
      </div>
    </Modal>
  )
}

// ============================================
// ONBOARDING TOUR
// ============================================

interface OnboardingProps {
  isOpen: boolean
  onComplete: () => void
}

export function OnboardingTour({ isOpen, onComplete }: OnboardingProps) {
  const [step, setStep] = useState(0)
  const haptic = useHaptic()

  const steps = [
    { title: "Welcome!", description: "Let's take a quick tour to help you get started.", icon: "🎉", color: 'from-teal-500 to-cyan-500' },
    { title: "Video Lessons", description: "Watch training videos in the Course tab. Progress saves automatically.", icon: "🎬", color: 'from-blue-500 to-indigo-500' },
    { title: "Download Bonuses", description: "Access $2,000+ in exclusive resources in the Bonuses tab.", icon: "🎁", color: 'from-cyan-500 to-teal-500' },
    { title: "Earn Badges", description: "Complete modules and collect achievements to track progress.", icon: "🏆", color: 'from-amber-500 to-orange-500' },
    { title: "Pro Tips", description: "Press '?' for shortcuts. Use arrows to navigate modules.", icon: "⌨️", color: 'from-purple-500 to-pink-500' },
  ]

  const handleNext = () => {
    haptic.light()
    if (step < steps.length - 1) {
      setStep(step + 1)
    } else {
      haptic.success()
      onComplete()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-t-2xl sm:rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8 text-center animate-slide-up sm:animate-scale-in border-t sm:border border-slate-200 dark:border-slate-700 pb-safe">
        {/* Mobile drag handle */}
        <div className="sm:hidden flex justify-center mb-4">
          <div className="w-10 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
        </div>

        {/* Icon with gradient background */}
        <div className={`w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-2xl bg-gradient-to-br ${steps[step].color} flex items-center justify-center shadow-lg mb-4 sm:mb-6`}>
          <span className="text-3xl sm:text-4xl">{steps[step].icon}</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mb-2 sm:mb-3">{steps[step].title}</h2>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mb-6 sm:mb-8 leading-relaxed">{steps[step].description}</p>

        {/* Progress dots */}
        <div className="flex justify-center gap-1.5 sm:gap-2 mb-5 sm:mb-6">
          {steps.map((_, i) => (
            <button
              key={i}
              onClick={() => setStep(i)}
              className={`h-2 rounded-full transition-all duration-300 touch-manipulation ${i === step ? 'w-6 sm:w-8 bg-teal-500' : 'w-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600'}`}
              aria-label={`Go to step ${i + 1}`}
            />
          ))}
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => { haptic.light(); onComplete(); }}
            className="flex-1 py-3 sm:py-3.5 rounded-xl font-bold text-sm sm:text-base bg-white dark:bg-slate-700/80 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600 active:scale-[0.98] transition-all focus-ring touch-manipulation border border-slate-200 dark:border-slate-600"
          >
            Skip
          </button>
          <button
            onClick={handleNext}
            className="flex-1 py-3 sm:py-3.5 rounded-xl font-bold text-sm sm:text-base bg-gradient-to-r from-teal-500 to-cyan-500 text-white hover:shadow-lg active:scale-[0.98] transition-all btn-press focus-ring touch-manipulation"
          >
            {step < steps.length - 1 ? 'Next' : "Let's Go!"}
          </button>
        </div>
      </div>
    </div>
  )
}

// ============================================
// ERROR BOUNDARY
// ============================================

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-950">
          <div className="text-center max-w-md animate-fade-in">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Something went wrong</h1>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Please refresh the page to try again. If the problem persists, contact support.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 rounded-xl font-bold bg-teal-500 text-white hover:bg-teal-600 transition-all btn-press"
            >
              Refresh Page
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

// ============================================
// ANIMATED BACKGROUND
// ============================================

interface AnimatedBackgroundProps {
  darkMode?: boolean
  reducedMotion?: boolean
}

export function AnimatedBackground({ darkMode = false, reducedMotion = false }: AnimatedBackgroundProps) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  if (reducedMotion) return null

  // Simplified background for mobile - better performance
  if (isMobile) {
    return (
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">
        {/* Single subtle gradient orb for mobile */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-teal-500/10 to-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-cyan-500/10 to-teal-500/10 rounded-full blur-3xl" />
      </div>
    )
  }

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">
      {/* Floating Orbs - Desktop only */}
      <div className="floating-orb floating-orb-1" />
      <div className="floating-orb floating-orb-2" />
      <div className="floating-orb floating-orb-3" />

      {/* Particles - Reduced count for better performance */}
      {[...Array(10)].map((_, i) => (
        <div
          key={i}
          className="particle"
          style={{
            left: `${Math.random() * 100}%`,
            bottom: '-10px',
            animationDelay: `${Math.random() * 10}s`,
            animationDuration: `${8 + Math.random() * 6}s`,
            width: `${2 + Math.random() * 4}px`,
            height: `${2 + Math.random() * 4}px`,
            background: darkMode
              ? `rgba(${Math.random() > 0.5 ? '45, 212, 191' : '139, 92, 246'}, ${0.3 + Math.random() * 0.4})`
              : `rgba(20, 184, 166, ${0.3 + Math.random() * 0.4})`,
          }}
        />
      ))}

      {/* Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(20, 184, 166, 0.5) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(20, 184, 166, 0.5) 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
        }}
      />
    </div>
  )
}

// ============================================
// PREMIUM NAV TABS
// ============================================

interface NavTab {
  id: string
  label: string
  icon: React.ReactNode
}

interface PremiumNavProps {
  tabs: NavTab[]
  activeTab: string
  onTabChange: (id: string) => void
  darkMode?: boolean
}

export function PremiumNav({ tabs, activeTab, onTabChange, darkMode }: PremiumNavProps) {
  return (
    <nav className="flex items-center gap-1 p-1 rounded-2xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 shadow-lg">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-300 ${
            activeTab === tab.id
              ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg shadow-teal-500/30 scale-105'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50 hover:text-teal-500'
          }`}
        >
          {tab.icon}
          <span className="hidden sm:inline">{tab.label}</span>
        </button>
      ))}
    </nav>
  )
}

import React from 'react'
