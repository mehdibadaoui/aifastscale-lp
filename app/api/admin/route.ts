import { NextRequest, NextResponse } from 'next/server'
import { getLeads, getStats } from '@/lib/db'
import { Redis } from '@upstash/redis'
import { getUser, createUser, getAllUsers, deleteUser, getUsersCount } from '@/lib/user-db'
import { Resend } from 'resend'

// Simple password protection
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'cloneyourself2024'

function getRedis(): Redis {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN
  if (!url || !token) throw new Error('Redis not configured')
  return new Redis({ url, token })
}

// Resend for sending emails
const getResend = () => new Resend(process.env.RESEND_API_KEY)

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

    // Fetch all users for admin dashboard
    const allUsers = await getAllUsers()
    const dentistUsers = await getAllUsers('dentist')
    const lawyerUsers = await getAllUsers('lawyer')
    const psychologistUsers = await getAllUsers('psychologist')
    const plasticSurgeonUsers = await getAllUsers('plastic-surgeon')

    // Calculate user stats
    const now = new Date()
    const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000)
    const last7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const last30d = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

    const activeUsersLast24h = allUsers.filter(u => u.lastLogin && new Date(u.lastLogin) > last24h).length
    const activeUsersLast7d = allUsers.filter(u => u.lastLogin && new Date(u.lastLogin) > last7d).length
    const activeUsersLast30d = allUsers.filter(u => u.lastLogin && new Date(u.lastLogin) > last30d).length
    const usersNeverLoggedIn = allUsers.filter(u => !u.lastLogin || u.loginCount === 0).length

    const userStats = {
      total: allUsers.length,
      dentist: dentistUsers.length,
      lawyer: lawyerUsers.length,
      psychologist: psychologistUsers.length,
      plasticSurgeon: plasticSurgeonUsers.length,
      activeUsersLast24h,
      activeUsersLast7d,
      activeUsersLast30d,
      usersNeverLoggedIn,
    }

    return NextResponse.json({
      success: true,
      stats,
      leads,
      videos,
      users: allUsers,
      userStats,
    })
  } catch (error: any) {
    console.error('Admin API error:', error)
    return NextResponse.json(
      { error: `Database error: ${error.message}` },
      { status: 500 }
    )
  }
}

// POST handler for user management (check user, resend email, create user)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { password, action, email, name, product } = body

    // Check password
    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Action: check - Check if user exists and get their credentials
    if (action === 'check') {
      if (!email) {
        return NextResponse.json({ error: 'Email required' }, { status: 400 })
      }
      const user = await getUser(email)
      if (user) {
        return NextResponse.json({
          success: true,
          exists: true,
          user: {
            email: user.email,
            password: user.password,
            name: user.name,
            product: user.product,
            purchaseDate: user.purchaseDate,
            lastLogin: user.lastLogin,
            loginCount: user.loginCount
          }
        })
      } else {
        return NextResponse.json({
          success: true,
          exists: false,
          message: 'User not found in database'
        })
      }
    }

    // Action: create - Create a new user manually
    if (action === 'create') {
      if (!email) {
        return NextResponse.json({ error: 'Email required' }, { status: 400 })
      }
      const result = await createUser({
        email,
        name: name || '',
        planId: 'manual',
        product: product || 'dentist'
      })
      if (result.success) {
        return NextResponse.json({
          success: true,
          password: result.password,
          message: `User created with password: ${result.password}`
        })
      } else {
        return NextResponse.json({ error: result.error }, { status: 500 })
      }
    }

    // Action: resend - Resend welcome email to existing user
    if (action === 'resend') {
      if (!email) {
        return NextResponse.json({ error: 'Email required' }, { status: 400 })
      }
      const user = await getUser(email)
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
      }

      const resend = getResend()
      const productConfigs: Record<string, { membersUrl: string; productName: string }> = {
        dentist: { membersUrl: 'https://aifastscale.com/members', productName: 'CloneYourself for Dentists' },
        lawyer: { membersUrl: 'https://aifastscale.com/members', productName: 'CloneYourself for Lawyers' },
        psychologist: { membersUrl: 'https://aifastscale.com/members', productName: 'CloneYourself for Psychologists' },
        'plastic-surgeon': { membersUrl: 'https://aifastscale.com/members', productName: 'CloneYourself for Plastic Surgeons' },
      }
      const productConfig = productConfigs[user.product] || productConfigs.dentist

      // Simple email template
      await resend.emails.send({
        from: 'CloneYourself <hello@mail.aifastscale.com>',
        to: email,
        subject: `🔑 Your Login Details (Resent) - ${productConfig.productName}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
            <h2>Your Login Credentials</h2>
            <p>Here are your login details:</p>
            <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Email:</strong> ${user.email}</p>
              <p><strong>Password:</strong> <code style="background: #e0e0e0; padding: 4px 8px; border-radius: 4px;">${user.password}</code></p>
            </div>
            <p><a href="${productConfig.membersUrl}" style="background: #14b8a6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">Login to Members Area</a></p>
            <p style="color: #666; font-size: 14px; margin-top: 20px;">If you have any issues, reply to this email.</p>
          </div>
        `
      })

      return NextResponse.json({
        success: true,
        message: `Welcome email resent to ${email}`
      })
    }

    // Action: delete - Delete user from database
    if (action === 'delete') {
      if (!email) {
        return NextResponse.json({ error: 'Email required' }, { status: 400 })
      }
      const result = await deleteUser(email)
      if (result.success) {
        return NextResponse.json({
          success: true,
          message: `User ${email} deleted successfully`
        })
      } else {
        return NextResponse.json({ error: result.error }, { status: 500 })
      }
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })

  } catch (error: any) {
    console.error('Admin POST error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
