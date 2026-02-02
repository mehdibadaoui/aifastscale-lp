import { NextRequest, NextResponse } from 'next/server'
import { Redis } from '@upstash/redis'

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'cloneyourself2024'

function getRedis(): Redis {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN
  if (!url || !token) throw new Error('Redis not configured')
  return new Redis({ url, token })
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const password = url.searchParams.get('password')
  const videoId = url.searchParams.get('id')

  if (password !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!videoId) {
    return NextResponse.json({ error: 'Video ID required' }, { status: 400 })
  }

  try {
    const redis = getRedis()
    const videoCount = await redis.llen('videos')

    // Search for the video by ID
    for (let i = 0; i < videoCount; i++) {
      const video: any = await redis.lindex('videos', i)
      if (video && video.id === videoId) {
        return NextResponse.json({
          success: true,
          video: {
            id: video.id,
            email: video.email,
            videoUrl: video.videoUrl,
            createdAt: video.createdAt,
            agentName: video.agentName,
            listingAddress: video.listingAddress
          }
        })
      }
    }

    return NextResponse.json({ error: 'Video not found' }, { status: 404 })
  } catch (error: any) {
    console.error('Video fetch error:', error)
    return NextResponse.json(
      { error: `Database error: ${error.message}` },
      { status: 500 }
    )
  }
}
