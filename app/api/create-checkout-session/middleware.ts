import { NextRequest, NextResponse } from 'next/server'

// Simple in-memory rate limiter (for production, use Redis or Upstash)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

const RATE_LIMIT = 3 // Max 3 checkout attempts (prevents spam/bots)
const WINDOW_MS = 15 * 60 * 1000 // 15 minutes

export function rateLimit(req: NextRequest): NextResponse | null {
  const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'
  const now = Date.now()

  const userLimit = rateLimitMap.get(ip)

  if (!userLimit || now > userLimit.resetTime) {
    // First request or window expired - reset
    rateLimitMap.set(ip, { count: 1, resetTime: now + WINDOW_MS })
    return null // Allow request
  }

  if (userLimit.count >= RATE_LIMIT) {
    // Rate limit exceeded
    return NextResponse.json(
      { error: 'Too many checkout attempts. Please try again in 15 minutes.' },
      { status: 429 }
    )
  }

  // Increment count
  userLimit.count++
  return null // Allow request
}

// Cleanup old entries every hour
setInterval(() => {
  const now = Date.now()
  for (const [ip, data] of rateLimitMap.entries()) {
    if (now > data.resetTime) {
      rateLimitMap.delete(ip)
    }
  }
}, 60 * 60 * 1000)
