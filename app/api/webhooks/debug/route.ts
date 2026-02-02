import { NextRequest, NextResponse } from 'next/server'
import { Redis } from '@upstash/redis'

function getRedis(): Redis {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN
  if (!url || !token) throw new Error('Redis not configured')
  return new Redis({ url, token })
}

// GET - View recent webhook logs
export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const password = url.searchParams.get('password')

  if (password !== 'cloneyourself2024') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const redis = getRedis()
    const logs = await redis.lrange('webhook:logs', 0, 19) // Last 20 logs

    return NextResponse.json({
      success: true,
      count: logs.length,
      logs: logs
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST - Log incoming webhook (called from main webhook)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const redis = getRedis()

    const logEntry = {
      timestamp: new Date().toISOString(),
      payload: body
    }

    // Store in list, keep last 50
    await redis.lpush('webhook:logs', JSON.stringify(logEntry))
    await redis.ltrim('webhook:logs', 0, 49)

    return NextResponse.json({ logged: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
