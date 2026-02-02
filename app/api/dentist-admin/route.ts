import { NextRequest, NextResponse } from 'next/server'
import { Redis } from '@upstash/redis'
import { Resend } from 'resend'

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'cloneyourself2024'

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
  refunded?: boolean
  refundDate?: string
  source?: string
}

function getRedis(): Redis {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN
  if (!url || !token) throw new Error('Redis not configured')
  return new Redis({ url, token })
}

const getResend = () => new Resend(process.env.RESEND_API_KEY)

// Helper to generate chart data for last N days
function generateChartData(members: User[], days: number = 30) {
  const data = []
  const now = new Date()

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    date.setHours(0, 0, 0, 0)
    const nextDate = new Date(date)
    nextDate.setDate(nextDate.getDate() + 1)

    const dateStr = date.toISOString().split('T')[0]
    const displayDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

    // New signups on this day
    const newSignups = members.filter(m => {
      const pd = new Date(m.purchaseDate)
      return pd >= date && pd < nextDate
    }).length

    // Active users (logged in on this day)
    const activeUsers = members.filter(m => {
      if (!m.loginHistory) return false
      return m.loginHistory.some(login => {
        const ld = new Date(login)
        return ld >= date && ld < nextDate
      })
    }).length

    // Cumulative members up to this day
    const totalMembers = members.filter(m => new Date(m.purchaseDate) <= nextDate).length

    // Revenue for this day
    const dayRevenue = members
      .filter(m => {
        const pd = new Date(m.purchaseDate)
        return pd >= date && pd < nextDate
      })
      .reduce((sum, m) => sum + (m.revenue?.total || 47), 0)

    data.push({
      date: dateStr,
      label: displayDate,
      newSignups,
      activeUsers,
      totalMembers,
      revenue: dayRevenue
    })
  }

  return data
}

// GET - Fetch all dentist members data
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  const url = new URL(request.url)
  const queryPassword = url.searchParams.get('password')
  const password = authHeader?.replace('Bearer ', '') || queryPassword

  if (password !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const redis = getRedis()
    const dentistEmails = await redis.smembers('users:dentist')

    const members: User[] = []
    for (const email of dentistEmails) {
      const user = await redis.get<User>(`user:${email}`)
      if (user && user.product === 'dentist') {
        // Set default revenue if not present
        if (!user.revenue) {
          user.revenue = { main: 47, total: 47 }
        }
        members.push(user)
      }
    }

    members.sort((a, b) => new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime())

    // Time calculations
    const now = new Date()
    const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000)
    const last7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const last30d = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000)
    const dayBeforeYesterday = new Date(yesterday.getTime() - 24 * 60 * 60 * 1000)
    const thisWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const lastWeek = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000)
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0)

    // Activity stats
    const activeMembers24h = members.filter(m => m.lastLogin && new Date(m.lastLogin) > last24h).length
    const activeMembers7d = members.filter(m => m.lastLogin && new Date(m.lastLogin) > last7d).length
    const activeMembers30d = members.filter(m => m.lastLogin && new Date(m.lastLogin) > last30d).length
    const neverLoggedIn = members.filter(m => !m.lastLogin || m.loginCount === 0).length
    const loggedInOnce = members.filter(m => m.loginCount === 1).length
    const regularUsers = members.filter(m => (m.loginCount || 0) >= 3).length
    const powerUsers = members.filter(m => (m.loginCount || 0) >= 10).length

    // New members
    const newMembersToday = members.filter(m => new Date(m.purchaseDate) >= today).length
    const newMembersYesterday = members.filter(m => {
      const pd = new Date(m.purchaseDate)
      return pd >= yesterday && pd < today
    }).length
    const newMembersThisWeek = members.filter(m => new Date(m.purchaseDate) >= thisWeek).length
    const newMembersThisMonth = members.filter(m => new Date(m.purchaseDate) >= thisMonth).length
    const newMembersLastWeek = members.filter(m => {
      const pd = new Date(m.purchaseDate)
      return pd >= lastWeek && pd < thisWeek
    }).length
    const newMembersLastMonth = members.filter(m => {
      const pd = new Date(m.purchaseDate)
      return pd >= lastMonth && pd <= lastMonthEnd
    }).length

    // Revenue calculations
    const calcRevenue = (memberList: User[]) => memberList.reduce((sum, m) => sum + (m.revenue?.total || 47), 0)
    const calcMainRevenue = (memberList: User[]) => memberList.reduce((sum, m) => sum + (m.revenue?.main || 47), 0)
    const calcUpsellRevenue = (memberList: User[]) => memberList.reduce((sum, m) => sum + (m.revenue?.upsell || 0), 0)
    const calcOtoRevenue = (memberList: User[]) => memberList.reduce((sum, m) => sum + (m.revenue?.oto || 0), 0)

    const membersToday = members.filter(m => new Date(m.purchaseDate) >= today)
    const membersYesterday = members.filter(m => {
      const pd = new Date(m.purchaseDate)
      return pd >= yesterday && pd < today
    })
    const membersThisWeek = members.filter(m => new Date(m.purchaseDate) >= thisWeek)
    const membersThisMonth = members.filter(m => new Date(m.purchaseDate) >= thisMonth)
    const membersLastWeek = members.filter(m => {
      const pd = new Date(m.purchaseDate)
      return pd >= lastWeek && pd < thisWeek
    })
    const membersLastMonth = members.filter(m => {
      const pd = new Date(m.purchaseDate)
      return pd >= lastMonth && pd <= lastMonthEnd
    })

    // Upsell/Downsell tracking (additional purchases after main course)
    const membersWithUpsell = members.filter(m => (m.revenue?.upsell && m.revenue.upsell > 0) || (m.revenue?.oto && m.revenue.oto > 0)).length
    const upsellConversionRate = members.length > 0 ? Math.round((membersWithUpsell / members.length) * 100) : 0

    // Comparison calculations
    const weekOverWeekGrowth = newMembersLastWeek > 0
      ? Math.round(((newMembersThisWeek - newMembersLastWeek) / newMembersLastWeek) * 100)
      : newMembersThisWeek > 0 ? 100 : 0
    const monthOverMonthGrowth = newMembersLastMonth > 0
      ? Math.round(((newMembersThisMonth - newMembersLastMonth) / newMembersLastMonth) * 100)
      : newMembersThisMonth > 0 ? 100 : 0

    // Engagement
    const engagementRate = members.length > 0 ? Math.round((activeMembers7d / members.length) * 100) : 0
    const totalLogins = members.reduce((sum, m) => sum + (m.loginCount || 0), 0)
    const avgLoginsPerMember = members.length > 0 ? (totalLogins / members.length).toFixed(1) : '0'

    // Refunds
    const refundedMembers = members.filter(m => m.refunded).length

    // Tags distribution
    const tagCounts: Record<string, number> = {}
    members.forEach(m => {
      (m.tags || []).forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1
      })
    })

    // Chart data
    const chartData = generateChartData(members, 30)

    const stats = {
      // Core stats
      totalMembers: members.length,
      activeMembers24h,
      activeMembers7d,
      activeMembers30d,
      neverLoggedIn,
      loggedInOnce,
      regularUsers,
      powerUsers,

      // Growth
      newMembersToday,
      newMembersYesterday,
      newMembersThisWeek,
      newMembersThisMonth,
      newMembersLastWeek,
      newMembersLastMonth,
      weekOverWeekGrowth,
      monthOverMonthGrowth,

      // Revenue
      revenueToday: calcRevenue(membersToday),
      revenueYesterday: calcRevenue(membersYesterday),
      revenueThisWeek: calcRevenue(membersThisWeek),
      revenueThisMonth: calcRevenue(membersThisMonth),
      revenueLastWeek: calcRevenue(membersLastWeek),
      revenueLastMonth: calcRevenue(membersLastMonth),
      totalRevenue: calcRevenue(members),

      // Revenue breakdown
      mainRevenue: calcMainRevenue(members),
      upsellRevenue: calcUpsellRevenue(members),
      otoRevenue: calcOtoRevenue(members),

      // Upsell conversion
      membersWithUpsell,
      upsellConversionRate,

      // Engagement
      engagementRate,
      avgLoginsPerMember,
      totalLogins,

      // Other
      refundedMembers,
      tagCounts,
    }

    return NextResponse.json({
      success: true,
      members,
      stats,
      chartData,
    })
  } catch (error: any) {
    console.error('Dentist Admin API error:', error)
    return NextResponse.json({ error: `Database error: ${error.message}` }, { status: 500 })
  }
}

// POST - Member management actions
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { password, action, email, name, notes, tags, revenue } = body

    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const redis = getRedis()

    // Action: check
    if (action === 'check') {
      if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 })
      const user = await redis.get<User>(`user:${email.toLowerCase().trim()}`)
      if (user && user.product === 'dentist') {
        return NextResponse.json({ success: true, exists: true, member: user })
      }
      return NextResponse.json({ success: true, exists: false })
    }

    // Action: create
    if (action === 'create') {
      if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 })

      const normalizedEmail = email.toLowerCase().trim()
      const userKey = `user:${normalizedEmail}`

      const existing = await redis.get<User>(userKey)
      if (existing) {
        return NextResponse.json({
          success: true,
          password: existing.password,
          message: 'User already exists'
        })
      }

      const chars = 'abcdefghjkmnpqrstuvwxyz23456789'
      let randomPart = ''
      for (let i = 0; i < 6; i++) {
        randomPart += chars.charAt(Math.floor(Math.random() * chars.length))
      }
      const newPassword = `dental-${randomPart}`

      const newUser: User = {
        email: normalizedEmail,
        password: newPassword,
        name: name || '',
        purchaseDate: new Date().toISOString(),
        planId: 'manual',
        product: 'dentist',
        loginCount: 0,
        loginHistory: [],
        revenue: revenue || { main: 47, total: 47 },
        tags: tags || [],
        notes: notes || '',
      }

      await redis.set(userKey, newUser)
      await redis.sadd('users:all', normalizedEmail)
      await redis.sadd('users:dentist', normalizedEmail)

      return NextResponse.json({
        success: true,
        password: newPassword,
        message: `Member created: ${newPassword}`
      })
    }

    // Action: update (notes, tags, revenue)
    if (action === 'update') {
      if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 })

      const normalizedEmail = email.toLowerCase().trim()
      const userKey = `user:${normalizedEmail}`
      const user = await redis.get<User>(userKey)

      if (!user) return NextResponse.json({ error: 'Member not found' }, { status: 404 })

      // Update fields
      if (notes !== undefined) user.notes = notes
      if (tags !== undefined) user.tags = tags
      if (revenue !== undefined) user.revenue = revenue

      await redis.set(userKey, user)

      return NextResponse.json({ success: true, message: 'Member updated', member: user })
    }

    // Action: addTag
    if (action === 'addTag') {
      if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 })
      const tag = body.tag
      if (!tag) return NextResponse.json({ error: 'Tag required' }, { status: 400 })

      const normalizedEmail = email.toLowerCase().trim()
      const userKey = `user:${normalizedEmail}`
      const user = await redis.get<User>(userKey)

      if (!user) return NextResponse.json({ error: 'Member not found' }, { status: 404 })

      user.tags = user.tags || []
      if (!user.tags.includes(tag)) {
        user.tags.push(tag)
      }
      await redis.set(userKey, user)

      return NextResponse.json({ success: true, message: `Tag "${tag}" added` })
    }

    // Action: removeTag
    if (action === 'removeTag') {
      if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 })
      const tag = body.tag
      if (!tag) return NextResponse.json({ error: 'Tag required' }, { status: 400 })

      const normalizedEmail = email.toLowerCase().trim()
      const userKey = `user:${normalizedEmail}`
      const user = await redis.get<User>(userKey)

      if (!user) return NextResponse.json({ error: 'Member not found' }, { status: 404 })

      user.tags = (user.tags || []).filter(t => t !== tag)
      await redis.set(userKey, user)

      return NextResponse.json({ success: true, message: `Tag "${tag}" removed` })
    }

    // Action: resend
    if (action === 'resend') {
      if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 })

      const user = await redis.get<User>(`user:${email.toLowerCase().trim()}`)
      if (!user) return NextResponse.json({ error: 'Member not found' }, { status: 404 })

      const resend = getResend()
      await resend.emails.send({
        from: 'CloneYourself <hello@mail.aifastscale.com>',
        replyTo: 'support@aifastscale.com',
        to: email,
        subject: '🔑 Your Login Details (Resent) - CloneYourself for Dentists',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #14b8a6;">Your Login Credentials</h2>
            <p>Here are your login details for CloneYourself for Dentists:</p>
            <div style="background: #f0fdfa; padding: 20px; border-radius: 12px; margin: 20px 0; border: 1px solid #14b8a6;">
              <p style="margin: 8px 0;"><strong>Email:</strong> ${user.email}</p>
              <p style="margin: 8px 0;"><strong>Password:</strong> <code style="background: #ccfbf1; padding: 4px 8px; border-radius: 4px; font-size: 16px;">${user.password}</code></p>
            </div>
            <p><a href="https://aifastscale.com/dentists/members" style="background: #14b8a6; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">Login to Members Area</a></p>
            <p style="color: #666; font-size: 14px; margin-top: 24px;">If you have any issues, reply to this email.</p>
          </div>
        `
      })

      return NextResponse.json({ success: true, message: `Email resent to ${email}` })
    }

    // Action: bulkResend
    if (action === 'bulkResend') {
      const emails = body.emails as string[]
      if (!emails || emails.length === 0) return NextResponse.json({ error: 'Emails required' }, { status: 400 })

      const resend = getResend()
      let sent = 0
      let failed = 0

      for (const em of emails) {
        try {
          const user = await redis.get<User>(`user:${em.toLowerCase().trim()}`)
          if (user) {
            await resend.emails.send({
              from: 'CloneYourself <hello@mail.aifastscale.com>',
              replyTo: 'support@aifastscale.com',
              to: em,
              subject: '🔑 Your Login Details - CloneYourself for Dentists',
              html: `
                <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
                  <h2 style="color: #14b8a6;">Your Login Credentials</h2>
                  <div style="background: #f0fdfa; padding: 20px; border-radius: 12px; margin: 20px 0; border: 1px solid #14b8a6;">
                    <p style="margin: 8px 0;"><strong>Email:</strong> ${user.email}</p>
                    <p style="margin: 8px 0;"><strong>Password:</strong> <code style="background: #ccfbf1; padding: 4px 8px; border-radius: 4px;">${user.password}</code></p>
                  </div>
                  <p><a href="https://aifastscale.com/dentists/members" style="background: #14b8a6; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">Login to Members Area</a></p>
                </div>
              `
            })
            sent++
          } else {
            failed++
          }
        } catch {
          failed++
        }
      }

      return NextResponse.json({ success: true, message: `Sent: ${sent}, Failed: ${failed}` })
    }

    // Action: bulkDelete
    if (action === 'bulkDelete') {
      const emails = body.emails as string[]
      if (!emails || emails.length === 0) return NextResponse.json({ error: 'Emails required' }, { status: 400 })

      let deleted = 0
      for (const em of emails) {
        const normalizedEmail = em.toLowerCase().trim()
        const userKey = `user:${normalizedEmail}`
        const user = await redis.get<User>(userKey)
        if (user) {
          await redis.del(userKey)
          await redis.srem('users:all', normalizedEmail)
          await redis.srem('users:dentist', normalizedEmail)
          deleted++
        }
      }

      return NextResponse.json({ success: true, message: `Deleted ${deleted} members` })
    }

    // Action: bulkAddTag
    if (action === 'bulkAddTag') {
      const emails = body.emails as string[]
      const tag = body.tag
      if (!emails || emails.length === 0) return NextResponse.json({ error: 'Emails required' }, { status: 400 })
      if (!tag) return NextResponse.json({ error: 'Tag required' }, { status: 400 })

      let updated = 0
      for (const em of emails) {
        const normalizedEmail = em.toLowerCase().trim()
        const userKey = `user:${normalizedEmail}`
        const user = await redis.get<User>(userKey)
        if (user) {
          user.tags = user.tags || []
          if (!user.tags.includes(tag)) {
            user.tags.push(tag)
            await redis.set(userKey, user)
            updated++
          }
        }
      }

      return NextResponse.json({ success: true, message: `Added tag to ${updated} members` })
    }

    // Action: delete
    if (action === 'delete') {
      if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 })

      const normalizedEmail = email.toLowerCase().trim()
      const userKey = `user:${normalizedEmail}`

      const user = await redis.get<User>(userKey)
      if (!user) return NextResponse.json({ error: 'Member not found' }, { status: 404 })

      await redis.del(userKey)
      await redis.srem('users:all', normalizedEmail)
      await redis.srem('users:dentist', normalizedEmail)

      return NextResponse.json({ success: true, message: `Deleted ${email}` })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })

  } catch (error: any) {
    console.error('Dentist Admin POST error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
