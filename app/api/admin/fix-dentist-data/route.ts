import { NextRequest, NextResponse } from 'next/server'
import { Redis } from '@upstash/redis'

interface User {
  email: string
  password: string
  name: string
  purchaseDate: string
  planId: string
  product: 'dentist' | 'plastic-surgeon' | 'psychologist' | 'lawyer'
  lastLogin?: string
  loginCount?: number
  notes?: string
  tags?: string[]
  loginHistory?: string[]
  revenue?: {
    main: number
    upsell?: number
    oto?: number
    total: number
  }
}

interface FixData {
  email: string
  name: string
  purchaseDate: string
  revenue: {
    main: number
    upsell: number
    total: number
  }
}

function getRedis(): Redis {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN
  if (!url || !token) throw new Error('Redis not configured')
  return new Redis({ url, token })
}

export async function POST(request: NextRequest) {
  try {
    const { data, dryRun = true } = await request.json() as { data: FixData[], dryRun: boolean }

    if (!data || !Array.isArray(data)) {
      return NextResponse.json({ error: 'data array required' }, { status: 400 })
    }

    const redis = getRedis()
    const results = {
      total: data.length,
      updated: 0,
      notFound: [] as string[],
      errors: [] as string[]
    }

    for (const fix of data) {
      const email = fix.email.toLowerCase().trim()
      const userKey = `user:${email}`

      try {
        const user = await redis.get<User>(userKey)

        if (!user) {
          results.notFound.push(email)
          continue
        }

        if (dryRun) {
          console.log(`[DRY RUN] Would update ${email}: date=${fix.purchaseDate}, revenue=${JSON.stringify(fix.revenue)}`)
          results.updated++
          continue
        }

        // Update with correct data
        user.purchaseDate = fix.purchaseDate
        user.revenue = {
          main: fix.revenue.main,
          upsell: fix.revenue.upsell > 0 ? fix.revenue.upsell : undefined,
          total: fix.revenue.total
        }

        await redis.set(userKey, user)
        results.updated++
        console.log(`✅ Updated ${email}`)

      } catch (err: any) {
        results.errors.push(`${email}: ${err.message}`)
      }
    }

    return NextResponse.json({
      success: true,
      dryRun,
      results
    })

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
