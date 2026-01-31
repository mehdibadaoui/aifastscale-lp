import { NextRequest, NextResponse } from 'next/server'
import { verifyUser } from '@/lib/user-db'
import { universalConfig, acceptedProductIds } from '@/app/members/config/universal'

/**
 * Universal Members Authentication API
 *
 * ONE platform for all users - accepts logins from:
 * - New universal product: clone-yourself-pro
 * - Old products: clone-yourself-lawyers, clone-yourself-dentists, etc.
 *
 * Supports three login modes:
 * 1. Email + Password (personalized login)
 * 2. Password only (VIP guests)
 * 3. Legacy shared password (backward compatibility)
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    const config = universalConfig

    // Validate password input
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
      // Try to verify against user database
      const result = await verifyUser(trimmedEmail, trimmedPassword)

      if (result.success && result.user) {
        // Check if user's product is in the accepted list
        if (!acceptedProductIds.includes(result.user.product)) {
          console.log(`[members] User ${trimmedEmail} tried to access but has ${result.user.product} product (not in accepted list)`)
          return NextResponse.json({
            success: false,
            error: 'This login is for a different product. Please check your email for the correct members area link.'
          }, { status: 401 })
        }

        console.log(`[members] User logged in: ${trimmedEmail} (product: ${result.user.product})`)
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

      // Check VIP guest password
      const vipGuestMatch = config.auth.vipGuests.find(
        g => g.password.toLowerCase() === trimmedPassword.toLowerCase()
      )
      if (vipGuestMatch) {
        console.log(`[members] VIP Guest logged in: ${vipGuestMatch.name}`)
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
      if (config.auth.legacyEnabled && trimmedPassword.toLowerCase() === config.auth.legacyPassword.toLowerCase()) {
        console.log(`[members] Legacy password login with email: ${trimmedEmail}`)
        return NextResponse.json({
          success: true,
          isVip: false,
          isLegacy: true,
          message: 'Access granted.'
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
    const vipGuestMatch = config.auth.vipGuests.find(
      g => g.password.toLowerCase() === trimmedPassword.toLowerCase()
    )

    if (vipGuestMatch) {
      console.log(`[members] VIP Guest logged in: ${vipGuestMatch.name}`)
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
    if (config.auth.legacyEnabled && trimmedPassword.toLowerCase() === config.auth.legacyPassword.toLowerCase()) {
      console.log(`[members] Legacy password login used (no email)`)
      return NextResponse.json({
        success: true,
        isVip: false,
        isLegacy: true,
        message: 'Access granted.'
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
    console.error('Members auth error:', error)
    return NextResponse.json(
      { success: false, error: 'Authentication failed. Please try again.' },
      { status: 500 }
    )
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    status: 'Universal members auth endpoint active',
    version: '3.0-universal',
    acceptedProducts: acceptedProductIds,
    modes: ['email+password', 'vip-guest', 'legacy'],
    timestamp: new Date().toISOString()
  })
}
