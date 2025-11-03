'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface LuxuryButtonProps {
  children: ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  disabled?: boolean
}

export default function LuxuryButton({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
}: LuxuryButtonProps) {
  const baseClasses =
    'relative overflow-hidden rounded-xl font-semibold transition-all duration-300 ease-out disabled:opacity-50 disabled:cursor-not-allowed'

  const variantClasses = {
    primary:
      'bg-gradient-to-r from-gold via-gold-light to-gold text-black hover:shadow-[0_0_30px_rgba(231,185,62,0.5)] hover:scale-105',
    secondary:
      'border-2 border-gold text-gold hover:bg-gold hover:text-black hover:shadow-[0_0_20px_rgba(231,185,62,0.3)]',
  }

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base md:px-8 md:py-4 md:text-lg',
    lg: 'px-8 py-4 text-lg md:px-10 md:py-5 md:text-xl',
  }

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      transition={{ duration: 0.2 }}
    >
      {/* Shimmer effect on hover */}
      <motion.div
        className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
        whileHover={{ translateX: '200%' }}
        transition={{ duration: 0.6 }}
      />
      <span className="relative z-10">{children}</span>
    </motion.button>
  )
}
