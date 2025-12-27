import { Redis } from '@upstash/redis'

// Lazy initialization to avoid build-time errors
let redis: Redis | null = null

function getRedis(): Redis {
  if (!redis) {
    // Support both naming conventions
    const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL
    const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN

    if (!url || !token) {
      throw new Error('Redis not configured. Please set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN')
    }

    redis = new Redis({ url, token })
  }
  return redis
}

export interface Lead {
  id: string
  email: string
  createdAt: string
  videoUrl?: string
  videoGeneratedAt?: string
  source: 'demo' | 'dfy' | 'other'
}

export interface VideoRecord {
  id: string
  email: string
  videoUrl: string
  createdAt: string
  agentName?: string
  listingAddress?: string
}

export interface Stats {
  totalLeads: number
  totalVideos: number
  todayLeads: number
  todayVideos: number
}

// Generate unique ID
const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

// ============ LEADS ============

export async function saveLead(email: string, source: 'demo' | 'dfy' | 'other' = 'demo'): Promise<Lead> {
  const lead: Lead = {
    id: generateId(),
    email,
    createdAt: new Date().toISOString(),
    source,
  }

  // Save to leads list
  await getRedis().lpush('leads', JSON.stringify(lead))

  // Also save by email for quick lookup
  await getRedis().set(`lead:${email}`, JSON.stringify(lead))

  // Increment counters
  await getRedis().incr('stats:totalLeads')
  const today = new Date().toISOString().split('T')[0]
  await getRedis().incr(`stats:leads:${today}`)

  return lead
}

export async function getLeads(limit = 100): Promise<Lead[]> {
  const leads = await getRedis().lrange('leads', 0, limit - 1)
  // Upstash auto-deserializes JSON, so handle both cases
  return leads.map((l: any) => typeof l === 'string' ? JSON.parse(l) : l)
}

export async function getLeadByEmail(email: string): Promise<Lead | null> {
  const lead = await getRedis().get(`lead:${email}`)
  if (!lead) return null
  // Upstash auto-deserializes JSON, so handle both cases
  return typeof lead === 'string' ? JSON.parse(lead) : lead as Lead
}

// ============ VIDEOS ============

export async function saveVideo(email: string, videoUrl: string, agentName?: string, listingAddress?: string): Promise<VideoRecord> {
  const video: VideoRecord = {
    id: generateId(),
    email,
    videoUrl,
    createdAt: new Date().toISOString(),
    agentName,
    listingAddress,
  }

  // Save to videos list
  await getRedis().lpush('videos', JSON.stringify(video))

  // Update lead with video info
  const existingLead = await getLeadByEmail(email)
  if (existingLead) {
    existingLead.videoUrl = videoUrl
    existingLead.videoGeneratedAt = video.createdAt
    await getRedis().set(`lead:${email}`, JSON.stringify(existingLead))
  }

  // Increment counters
  await getRedis().incr('stats:totalVideos')
  const today = new Date().toISOString().split('T')[0]
  await getRedis().incr(`stats:videos:${today}`)

  return video
}

export async function getVideos(limit = 100): Promise<VideoRecord[]> {
  const videos = await getRedis().lrange('videos', 0, limit - 1)
  // Upstash auto-deserializes JSON, so handle both cases
  return videos.map((v: any) => typeof v === 'string' ? JSON.parse(v) : v)
}

// Get videos without the large base64 video data (for admin panel)
export async function getVideosMetadata(limit = 100): Promise<Omit<VideoRecord, 'videoUrl'>[]> {
  const videos = await getRedis().lrange('videos', 0, limit - 1)
  return videos.map((v: any) => {
    const video = typeof v === 'string' ? JSON.parse(v) : v
    // Return metadata only, exclude the large videoUrl
    return {
      id: video.id,
      email: video.email,
      createdAt: video.createdAt,
      agentName: video.agentName,
      listingAddress: video.listingAddress,
      hasVideo: !!video.videoUrl
    }
  })
}

// Update the most recent anonymous video with user's email
export async function updateLatestAnonymousVideoWithEmail(email: string): Promise<boolean> {
  const videos = await getVideos(10) // Get recent videos

  // Find the most recent anonymous video
  const anonymousVideo = videos.find(v => v.email === 'anonymous')

  if (anonymousVideo) {
    // Update the video with the email
    anonymousVideo.email = email

    // We need to update it in the list - remove old and add updated
    // Since Redis lists don't support direct update, we'll update via the lead
    const existingLead = await getLeadByEmail(email)
    if (existingLead) {
      existingLead.videoUrl = anonymousVideo.videoUrl
      existingLead.videoGeneratedAt = anonymousVideo.createdAt
      await getRedis().set(`lead:${email}`, JSON.stringify(existingLead))
    }

    return true
  }

  return false
}

// ============ STATS ============

export async function getStats(): Promise<Stats> {
  const today = new Date().toISOString().split('T')[0]
  const r = getRedis()

  const [totalLeads, totalVideos, todayLeads, todayVideos] = await Promise.all([
    r.get('stats:totalLeads'),
    r.get('stats:totalVideos'),
    r.get(`stats:leads:${today}`),
    r.get(`stats:videos:${today}`),
  ])

  return {
    totalLeads: Number(totalLeads) || 0,
    totalVideos: Number(totalVideos) || 0,
    todayLeads: Number(todayLeads) || 0,
    todayVideos: Number(todayVideos) || 0,
  }
}

export default getRedis
