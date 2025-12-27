import { NextRequest, NextResponse } from 'next/server'
import { getLeads, getStats } from '@/lib/db'
import { Redis } from '@upstash/redis'

// Simple password protection
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'agentclone2024'

function getRedis(): Redis {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN
  if (!url || !token) throw new Error('Redis not configured')
  return new Redis({ url, token })
}

export async function GET(request: NextRequest) {
  // Check password from header or query
  const authHeader = request.headers.get('authorization')
  const url = new URL(request.url)
  const queryPassword = url.searchParams.get('password')

  const password = authHeader?.replace('Bearer ', '') || queryPassword

  if (password !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const stats = await getStats()
    const leads = await getLeads(50)

    // Fetch videos one by one to avoid size limit
    // Only get metadata, not the large base64 video data
    const redis = getRedis()
    const videoCount = await redis.llen('videos')
    const limit = Math.min(videoCount, 20)

    const videos: any[] = []
    for (let i = 0; i < limit; i++) {
      try {
        const video: any = await redis.lindex('videos', i)
        if (video) {
          // Only include metadata, not the large videoUrl
          videos.push({
            id: video.id,
            email: video.email,
            createdAt: video.createdAt,
            agentName: video.agentName,
            listingAddress: video.listingAddress,
            hasVideo: !!video.videoUrl
          })
        }
      } catch (e) {
        // Skip if individual fetch fails
      }
    }

    return NextResponse.json({
      success: true,
      stats,
      leads,
      videos,
    })
  } catch (error: any) {
    console.error('Admin API error:', error)
    return NextResponse.json(
      { error: `Database error: ${error.message}` },
      { status: 500 }
    )
  }
}
