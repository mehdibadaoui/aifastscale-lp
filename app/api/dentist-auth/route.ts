import { NextRequest, NextResponse } from 'next/server'
import { verifyUser } from '@/lib/user-db'

/**
 * Dentist Members Authentication API
 *
 * Supports two login modes:
 * 1. Email + Password (personalized login - new users)
 * 2. Password only (legacy VIP guests)
 *
 * IMPORTANT: This is a critical system for customer access.
 * Handle errors gracefully and provide clear feedback.
 */

// Legacy shared password (for backward compatibility during transition)
// TODO: Remove this after all users have personalized logins
const LEGACY_PASSWORD = 'dentist2026'
const LEGACY_ENABLED = true // Set to false to disable legacy login

// VIP Guest accounts (manual special access)
const VIP_GUESTS = [
  {
    id: 'matias-gaete',
    name: 'Matías Gaete',
    password: 'matias-vip-2025',
    welcomeMessage: 'Welcome back, Dr. Matías! Enjoy your exclusive access.',
    badge: 'VIP Guest',
  },
]

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Validate input
    if (!password || typeof password !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Password is required' },
        { status: 400 }
      )
    }

    const trimmedPassword = password.trim()
    const trimmedEmail = email?.trim()?.toLowerCase() || ''

    // ========================================
    // MODE 1: Email + Password (Personalized)
    // ========================================
    if (trimmedEmail) {
      // First, try to verify against user database
      const result = await verifyUser(trimmedEmail, trimmedPassword)

      if (result.success && result.user) {
        console.log(`✅ User logged in: ${trimmedEmail}`)
        return NextResponse.json({
          success: true,
          isVip: false,
          user: {
            email: result.user.email,
            name: result.user.name,
            product: result.user.product,
          }
        })
      }

      // User found but wrong password - don't allow legacy fallback
      if (result.error === 'Invalid password') {
        return NextResponse.json({
          success: false,
          error: 'Invalid password. Check your welcome email for your password.'
        }, { status: 401 })
      }

      // User not found OR database unavailable - check VIP/legacy passwords
      // This handles: old customers, database issues, or new customers not yet in DB

      // Check VIP guest password
      const vipGuestMatch = VIP_GUESTS.find(
        g => g.password.toLowerCase() === trimmedPassword.toLowerCase()
      )
      if (vipGuestMatch) {
        console.log(`✅ VIP Guest logged in: ${vipGuestMatch.name}`)
        return NextResponse.json({
          success: true,
          isVip: true,
          vipGuest: {
            id: vipGuestMatch.id,
            name: vipGuestMatch.name,
            badge: vipGuestMatch.badge,
            welcomeMessage: vipGuestMatch.welcomeMessage,
          }
        })
      }

      // Check legacy password for old customers
      if (LEGACY_ENABLED && trimmedPassword.toLowerCase() === LEGACY_PASSWORD.toLowerCase()) {
        console.log(`⚠️ Legacy password login with email: ${trimmedEmail}`)
        return NextResponse.json({
          success: true,
          isVip: false,
          isLegacy: true,
          message: 'Access granted. Your personalized login will be set up soon.'
        })
      }

      // Truly not found and not using legacy password
      return NextResponse.json({
        success: false,
        error: 'No account found with this email. Please use the email you purchased with, or check your welcome email for your password.'
      }, { status: 401 })
    }

    // ========================================
    // MODE 2: Password Only (VIP Guests)
    // ========================================

    // Check VIP guest login
    const vipGuestMatch = VIP_GUESTS.find(
      g => g.password.toLowerCase() === trimmedPassword.toLowerCase()
    )

    if (vipGuestMatch) {
      console.log(`✅ VIP Guest logged in: ${vipGuestMatch.name}`)
      return NextResponse.json({
        success: true,
        isVip: true,
        vipGuest: {
          id: vipGuestMatch.id,
          name: vipGuestMatch.name,
          badge: vipGuestMatch.badge,
          welcomeMessage: vipGuestMatch.welcomeMessage,
        }
      })
    }

    // ========================================
    // MODE 3: Legacy Password (Temporary)
    // ========================================
    if (LEGACY_ENABLED && trimmedPassword.toLowerCase() === LEGACY_PASSWORD.toLowerCase()) {
      console.log('⚠️ Legacy password login used (no email)')
      return NextResponse.json({
        success: true,
        isVip: false,
        isLegacy: true,
        message: 'Access granted. Your personalized login will be set up soon.'
      })
    }

    // ========================================
    // Failed Login
    // ========================================
    return NextResponse.json({
      success: false,
      error: 'Invalid credentials. Please enter your email and password from your welcome email.'
    }, { status: 401 })

  } catch (error: any) {
    console.error('Auth error:', error)
    return NextResponse.json(
      { success: false, error: 'Authentication failed. Please try again.' },
      { status: 500 }
    )
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    status: 'Dentist auth endpoint active',
    version: '2.0-personalized',
    modes: ['email+password', 'vip-guest', 'legacy'],
    timestamp: new Date().toISOString()
  })
}
