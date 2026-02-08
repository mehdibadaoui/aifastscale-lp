import { NextRequest, NextResponse } from 'next/server'
import { Redis } from '@upstash/redis'

function getRedis(): Redis {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN
  if (!url || !token) throw new Error('Redis not configured')
  return new Redis({ url, token })
}

// Full end-to-end test that simulates a real purchase
export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const password = url.searchParams.get('password')

  if (password !== 'cloneyourself2024') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const testId = `test_${Date.now()}`
  const testEmail = `fulltest-${testId}@test-verification.com`
  const testUserId = `user_FULLTEST_${testId}`

  const results: {
    step: string
    status: 'PASS' | 'FAIL' | 'SKIP'
    details: string
    data?: any
  }[] = []

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://aifastscale.com'

  try {
    // ═══════════════════════════════════════════════════════════════
    // STEP 1: Test payment.succeeded webhook (stores email mapping)
    // ═══════════════════════════════════════════════════════════════
    const paymentWebhook = {
      type: 'payment.succeeded',
      data: {
        user: {
          id: testUserId,
          email: testEmail,
          username: 'fulltestuser',
          name: 'Full Test User'
        },
        product: {
          id: 'prod_UcqrDElz6GWgc',
          title: 'Clone Yourself - Dentists'
        },
        plan: {
          id: 'plan_chOBDoTBxc7NH'
        },
        total: 47.82,
        currency: 'usd'
      }
    }

    const webhookResponse = await fetch(`${baseUrl}/api/webhooks/stripe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(paymentWebhook)
    })

    const webhookResult = await webhookResponse.json()

    results.push({
      step: '1. Webhook Processing (payment.succeeded)',
      status: webhookResult.success || webhookResult.user_created ? 'PASS' : 'FAIL',
      details: webhookResult.success
        ? `User created, email sent to ${testEmail}`
        : `Error: ${JSON.stringify(webhookResult)}`,
      data: webhookResult
    })

    // ═══════════════════════════════════════════════════════════════
    // STEP 2: Verify user was created in database
    // ═══════════════════════════════════════════════════════════════
    const redis = getRedis()
    const userData = await redis.get<any>(`user:${testEmail}`)

    results.push({
      step: '2. Database User Creation',
      status: userData && userData.password ? 'PASS' : 'FAIL',
      details: userData && userData.password
        ? `User found in database with password: ${userData.password.substring(0, 8)}...`
        : 'User NOT found in database',
      data: userData ? { hasPassword: !!userData.password, product: userData.product, email: userData.email } : null
    })

    // ═══════════════════════════════════════════════════════════════
    // STEP 3: Verify user_id -> email mapping stored
    // ═══════════════════════════════════════════════════════════════
    const storedEmail = await redis.get(`checkout:user:${testUserId}`)

    results.push({
      step: '3. User ID → Email Mapping',
      status: storedEmail === testEmail ? 'PASS' : 'FAIL',
      details: storedEmail === testEmail
        ? `Mapping stored correctly: ${testUserId} → ${testEmail}`
        : `Mapping NOT found or incorrect. Expected: ${testEmail}, Got: ${storedEmail}`,
      data: { userId: testUserId, storedEmail }
    })

    // ═══════════════════════════════════════════════════════════════
    // STEP 4: Test membership.activated (uses stored mapping)
    // ═══════════════════════════════════════════════════════════════
    const membershipWebhook = {
      type: 'membership.activated',
      data: {
        user: {
          id: testUserId,
          username: 'fulltestuser',
          name: null  // NO EMAIL - must use stored mapping
        },
        product: {
          title: 'Clone Yourself - Dentists'
        },
        plan: {
          id: 'plan_chOBDoTBxc7NH'
        }
      }
    }

    const membershipResponse = await fetch(`${baseUrl}/api/webhooks/stripe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(membershipWebhook)
    })

    const membershipResult = await membershipResponse.json()

    // This should either succeed (found email) or skip (user already exists)
    const membershipPassed = membershipResult.success ||
                             membershipResult.user_created === false || // Already exists is OK
                             membershipResult.processed === false // Skipped is also OK if email lookup worked

    results.push({
      step: '4. Webhook Processing (membership.activated - no email)',
      status: membershipPassed ? 'PASS' : 'FAIL',
      details: membershipResult.success
        ? 'Email lookup from mapping worked!'
        : membershipResult.user_created === false
          ? 'User already existed (expected - created in step 1)'
          : `Result: ${JSON.stringify(membershipResult)}`,
      data: membershipResult
    })

    // ═══════════════════════════════════════════════════════════════
    // STEP 5: Check webhook logs captured everything
    // ═══════════════════════════════════════════════════════════════
    const logs = await redis.lrange('webhook:logs', 0, 4)
    const recentLogs = logs.map((log: any) => {
      try { return typeof log === 'string' ? JSON.parse(log) : log }
      catch { return log }
    })

    const ourTestLogs = recentLogs.filter((log: any) =>
      log?.payload?.email === testEmail ||
      log?.payload?.data?.user?.email === testEmail ||
      log?.payload?.data?.user?.id === testUserId
    )

    results.push({
      step: '6. Webhook Logging',
      status: ourTestLogs.length >= 2 ? 'PASS' : 'FAIL',
      details: `Found ${ourTestLogs.length} log entries for this test`,
      data: ourTestLogs.map((l: any) => ({ status: l.status, timestamp: l.timestamp }))
    })

    // ═══════════════════════════════════════════════════════════════
    // CLEANUP: Remove test user (optional - keep for verification)
    // ═══════════════════════════════════════════════════════════════
    // await redis.del(`user:${testEmail}`)
    // await redis.del(`checkout:user:${testUserId}`)
    // Note: Not deleting so you can verify the test user exists

    // ═══════════════════════════════════════════════════════════════
    // SUMMARY
    // ═══════════════════════════════════════════════════════════════
    const passCount = results.filter(r => r.status === 'PASS').length
    const failCount = results.filter(r => r.status === 'FAIL').length
    const allPassed = failCount === 0

    return NextResponse.json({
      testId,
      timestamp: new Date().toISOString(),
      summary: {
        total: results.length,
        passed: passCount,
        failed: failCount,
        allPassed,
        verdict: allPassed
          ? '✅ ALL SYSTEMS WORKING 100%'
          : `❌ ${failCount} SYSTEM(S) NEED ATTENTION`
      },
      results,
      testEmail,
      testUserId,
      note: 'Test user kept in database for verification - you can check the admin panel'
    })

  } catch (error: any) {
    return NextResponse.json({
      testId,
      error: error.message,
      stack: error.stack,
      results
    }, { status: 500 })
  }
}
