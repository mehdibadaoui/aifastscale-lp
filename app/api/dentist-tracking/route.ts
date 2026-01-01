import { NextRequest, NextResponse } from 'next/server'
import { Redis } from '@upstash/redis'

// Redis connection
function getRedis(): Redis {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN
  if (!url || !token) throw new Error('Redis not configured')
  return new Redis({ url, token })
}

interface TrackingData {
  fbclid?: string
  fbc?: string
  fbp?: string
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_content?: string
  utm_term?: string
  external_id?: string
  client_user_agent?: string
  stored_at: string
}

// POST: Store tracking data by email
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, trackingData } = body

    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 })
    }

    const redis = getRedis()
    const key = `dentist:tracking:${email.toLowerCase().trim()}`

    // Add timestamp and user agent
    const dataToStore: TrackingData = {
      ...trackingData,
      client_user_agent: request.headers.get('user-agent') || '',
      stored_at: new Date().toISOString()
    }

    // Store with 24 hour TTL (more than enough for checkout flow)
    await redis.set(key, JSON.stringify(dataToStore), { ex: 86400 })

    console.log(`📝 Stored tracking data for ${email}:`, {
      hasFbc: !!dataToStore.fbc,
      hasFbp: !!dataToStore.fbp,
      hasFbclid: !!dataToStore.fbclid
    })

    return NextResponse.json({ success: true, stored: true })
  } catch (error) {
    console.error('Tracking storage error:', error)
    return NextResponse.json({ error: 'Storage failed' }, { status: 500 })
  }
}

// GET: Retrieve tracking data by email
export async function GET(request: NextRequest) {
  try {
    const email = request.nextUrl.searchParams.get('email')

    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 })
    }

    const redis = getRedis()
    const key = `dentist:tracking:${email.toLowerCase().trim()}`
    const data = await redis.get<string>(key)

    if (!data) {
      return NextResponse.json({ found: false, data: null })
    }

    const trackingData: TrackingData = typeof data === 'string' ? JSON.parse(data) : data

    console.log(`✅ Retrieved tracking data for ${email}:`, {
      hasFbc: !!trackingData.fbc,
      hasFbp: !!trackingData.fbp
    })

    return NextResponse.json({ found: true, data: trackingData })
  } catch (error) {
    console.error('Tracking retrieval error:', error)
    return NextResponse.json({ error: 'Retrieval failed' }, { status: 500 })
  }
}
