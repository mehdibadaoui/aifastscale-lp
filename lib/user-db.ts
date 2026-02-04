/**
 * User Database - Personalized Login System
 * Uses Upstash Redis to store user credentials
 *
 * IMPORTANT: This is a critical system. Handle errors gracefully.
 */

import { Redis } from '@upstash/redis'

// Initialize Redis client
const getRedis = () => {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN

  if (!url || !token) {
    console.error('Redis credentials not found')
    return null
  }

  return new Redis({ url, token })
}

// User type definition
export interface User {
  email: string
  password: string
  name: string
  purchaseDate: string
  planId: string
  product: 'dentist' | 'plastic-surgeon' | 'psychologist' | 'lawyer' | 'dermatologist'
  lastLogin?: string
  loginCount?: number
  // Extended fields for admin
  notes?: string
  tags?: string[]
  loginHistory?: string[] // Array of ISO date strings
  revenue?: {
    main: number
    upsell?: number
    oto?: number
    total: number
  }
  refunded?: boolean
  refundDate?: string
  source?: string // utm_source or referrer
}

// Generate a unique, readable password
// Format: clone-random6chars (e.g., "clone-x7k9m2") - UNIVERSAL for all products
export function generateUniquePassword(product: 'dentist' | 'plastic-surgeon' | 'psychologist' | 'lawyer' | 'dermatologist' = 'dentist'): string {
  const prefix = 'clone' // Universal prefix for all products
  const chars = 'abcdefghjkmnpqrstuvwxyz23456789' // No confusing chars (0,o,1,l,i)
  let randomPart = ''

  for (let i = 0; i < 6; i++) {
    randomPart += chars.charAt(Math.floor(Math.random() * chars.length))
  }

  return `${prefix}-${randomPart}`
}

// Create a new user in the database
export async function createUser(userData: {
  email: string
  name: string
  planId: string
  product: 'dentist' | 'plastic-surgeon' | 'psychologist' | 'lawyer' | 'dermatologist'
}): Promise<{ success: boolean; password?: string; error?: string }> {
  try {
    const redis = getRedis()
    if (!redis) {
      return { success: false, error: 'Database not available' }
    }

    const email = userData.email.toLowerCase().trim()
    const userKey = `user:${email}`

    // Check if user already exists
    const existingUser = await redis.get<User>(userKey)
    if (existingUser) {
      // User exists - return their existing password
      console.log(`User ${email} already exists, returning existing credentials`)
      return { success: true, password: existingUser.password }
    }

    // Generate unique password
    const password = generateUniquePassword(userData.product)

    // Create user object
    const user: User = {
      email,
      password,
      name: userData.name || '',
      purchaseDate: new Date().toISOString(),
      planId: userData.planId,
      product: userData.product,
      loginCount: 0,
    }

    // Save to Redis
    await redis.set(userKey, user)

    // Also add to users list for admin purposes
    await redis.sadd('users:all', email)
    await redis.sadd(`users:${userData.product}`, email)

    console.log(`Created new user: ${email} for ${userData.product}`)
    return { success: true, password }

  } catch (error) {
    console.error('Error creating user:', error)
    return { success: false, error: 'Failed to create user' }
  }
}

// Verify user credentials
export async function verifyUser(email: string, password: string): Promise<{
  success: boolean
  user?: User
  error?: string
}> {
  try {
    const redis = getRedis()
    if (!redis) {
      return { success: false, error: 'Database not available' }
    }

    const userKey = `user:${email.toLowerCase().trim()}`
    const user = await redis.get<User>(userKey)

    if (!user) {
      return { success: false, error: 'User not found' }
    }

    // Check password (case-insensitive for user convenience)
    if (user.password.toLowerCase() !== password.toLowerCase().trim()) {
      return { success: false, error: 'Invalid password' }
    }

    // Update last login, login count, and login history
    const now = new Date().toISOString()
    user.lastLogin = now
    user.loginCount = (user.loginCount || 0) + 1
    // Keep last 50 logins in history
    user.loginHistory = user.loginHistory || []
    user.loginHistory.unshift(now)
    if (user.loginHistory.length > 50) {
      user.loginHistory = user.loginHistory.slice(0, 50)
    }
    await redis.set(userKey, user)

    return { success: true, user }

  } catch (error) {
    console.error('Error verifying user:', error)
    return { success: false, error: 'Verification failed' }
  }
}

// Get user by email (for admin/support purposes)
export async function getUser(email: string): Promise<User | null> {
  try {
    const redis = getRedis()
    if (!redis) return null

    const userKey = `user:${email.toLowerCase().trim()}`
    return await redis.get<User>(userKey)

  } catch (error) {
    console.error('Error getting user:', error)
    return null
  }
}

// Check if user exists
export async function userExists(email: string): Promise<boolean> {
  try {
    const redis = getRedis()
    if (!redis) return false

    const userKey = `user:${email.toLowerCase().trim()}`
    const exists = await redis.exists(userKey)
    return exists === 1

  } catch (error) {
    console.error('Error checking user:', error)
    return false
  }
}

// Get all users count (for admin)
export async function getUsersCount(product?: 'dentist' | 'plastic-surgeon' | 'psychologist' | 'lawyer'): Promise<number> {
  try {
    const redis = getRedis()
    if (!redis) return 0

    const key = product ? `users:${product}` : 'users:all'
    return await redis.scard(key)

  } catch (error) {
    console.error('Error getting users count:', error)
    return 0
  }
}

// Get all users (for admin dashboard)
export async function getAllUsers(product?: 'dentist' | 'plastic-surgeon' | 'psychologist' | 'lawyer'): Promise<User[]> {
  try {
    const redis = getRedis()
    if (!redis) return []

    const key = product ? `users:${product}` : 'users:all'
    const emails = await redis.smembers(key)

    if (!emails || emails.length === 0) return []

    // Fetch all user data
    const users: User[] = []
    for (const email of emails) {
      const user = await redis.get<User>(`user:${email}`)
      if (user) {
        users.push(user)
      }
    }

    // Sort by purchase date (newest first)
    users.sort((a, b) => new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime())

    return users

  } catch (error) {
    console.error('Error getting all users:', error)
    return []
  }
}

// Update user (for admin)
export async function updateUser(email: string, updates: Partial<User>): Promise<{ success: boolean; error?: string }> {
  try {
    const redis = getRedis()
    if (!redis) {
      return { success: false, error: 'Database not available' }
    }

    const normalizedEmail = email.toLowerCase().trim()
    const userKey = `user:${normalizedEmail}`

    const user = await redis.get<User>(userKey)
    if (!user) {
      return { success: false, error: 'User not found' }
    }

    // Merge updates
    const updatedUser = { ...user, ...updates }
    await redis.set(userKey, updatedUser)

    return { success: true }

  } catch (error) {
    console.error('Error updating user:', error)
    return { success: false, error: 'Failed to update user' }
  }
}

// Record a purchase for a user (main, upsell, or downsell)
export async function recordPurchase(
  email: string,
  purchaseType: 'main' | 'upsell' | 'downsell',
  amount: number,
  planId?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const redis = getRedis()
    if (!redis) {
      return { success: false, error: 'Database not available' }
    }

    const normalizedEmail = email.toLowerCase().trim()
    const userKey = `user:${normalizedEmail}`

    const user = await redis.get<User>(userKey)
    if (!user) {
      // User doesn't exist yet - they might be buying upsell before main course is processed
      console.log(`User ${email} not found for ${purchaseType} purchase - will be linked later`)
      return { success: false, error: 'User not found' }
    }

    // Initialize revenue object if not exists
    const revenue = user.revenue || { main: 0, total: 0 }

    if (purchaseType === 'main') {
      revenue.main = amount
    } else if (purchaseType === 'upsell') {
      revenue.upsell = (revenue.upsell || 0) + amount
    } else if (purchaseType === 'downsell') {
      // Store downsell in oto field (upsell and downsell are mutually exclusive offers)
      revenue.oto = (revenue.oto || 0) + amount
    }

    // Recalculate total
    revenue.total = revenue.main + (revenue.upsell || 0) + (revenue.oto || 0)

    // Update user
    user.revenue = revenue
    if (planId) {
      user.planId = planId
    }

    await redis.set(userKey, user)
    console.log(`Recorded ${purchaseType} purchase ($${amount}) for ${email}`)

    return { success: true }

  } catch (error) {
    console.error('Error recording purchase:', error)
    return { success: false, error: 'Failed to record purchase' }
  }
}

// Delete user (for admin)
export async function deleteUser(email: string): Promise<{ success: boolean; error?: string }> {
  try {
    const redis = getRedis()
    if (!redis) {
      return { success: false, error: 'Database not available' }
    }

    const normalizedEmail = email.toLowerCase().trim()
    const userKey = `user:${normalizedEmail}`

    // Get user first to know which product set to remove from
    const user = await redis.get<User>(userKey)
    if (!user) {
      return { success: false, error: 'User not found' }
    }

    // Remove from Redis
    await redis.del(userKey)
    await redis.srem('users:all', normalizedEmail)
    await redis.srem(`users:${user.product}`, normalizedEmail)

    console.log(`Deleted user: ${normalizedEmail}`)
    return { success: true }

  } catch (error) {
    console.error('Error deleting user:', error)
    return { success: false, error: 'Failed to delete user' }
  }
}
