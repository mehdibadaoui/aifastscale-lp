import { NextRequest, NextResponse } from 'next/server'
import { Redis } from '@upstash/redis'

function getRedis(): Redis {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN
  if (!url || !token) throw new Error('Redis not configured')
  return new Redis({ url, token })
}

// Rate limiting: Track requests by IP
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const limit = rateLimitMap.get(ip)

  if (!limit || now > limit.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + 60000 }) // 1 minute window
    return true
  }

  if (limit.count >= 20) { // Max 20 requests per minute
    return false
  }

  limit.count++
  return true
}

interface CredentialsData {
  email: string
  password: string
  name: string
  product: string
  created: number
}

// GET /api/dentist-credentials?email=xxx
// Returns user credentials for thank-you page display
export async function GET(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ||
               request.headers.get('x-real-ip') ||
               'unknown'

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { found: false, error: 'Too many requests. Please wait a moment.' },
        { status: 429 }
      )
    }

    const url = new URL(request.url)
    const email = url.searchParams.get('email')?.toLowerCase().trim()
    const userId = url.searchParams.get('user_id')

    if (!email && !userId) {
      return NextResponse.json(
        { found: false, error: 'Email or user_id required' },
        { status: 400 }
      )
    }

    const redis = getRedis()
    let credentialsJson: string | null = null

    // Try to find by email first
    if (email) {
      credentialsJson = await redis.get<string>(`thankyou:${email}`)
    }

    // If not found and we have user_id, try that
    if (!credentialsJson && userId) {
      credentialsJson = await redis.get<string>(`thankyou:user:${userId}`)
    }

    if (!credentialsJson) {
      return NextResponse.json({ found: false })
    }

    // Parse credentials
    let credentials: CredentialsData
    try {
      credentials = typeof credentialsJson === 'string'
        ? JSON.parse(credentialsJson)
        : credentialsJson as CredentialsData
    } catch {
      return NextResponse.json({ found: false })
    }

    // Security: Only return credentials created in the last 2 hours
    const twoHoursAgo = Date.now() - (2 * 60 * 60 * 1000)
    if (credentials.created < twoHoursAgo) {
      return NextResponse.json({ found: false, expired: true })
    }

    // Security: Only return dentist credentials
    if (credentials.product !== 'dentist') {
      return NextResponse.json({ found: false })
    }

    // Return credentials
    return NextResponse.json({
      found: true,
      email: credentials.email,
      password: credentials.password,
      name: credentials.name || ''
    })

  } catch (error: any) {
    console.error('Credentials lookup error:', error)
    return NextResponse.json(
      { found: false, error: 'Lookup failed' },
      { status: 500 }
    )
  }
}
