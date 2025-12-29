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
  product: 'dentist' | 'realestate'
  lastLogin?: string
  loginCount?: number
}

// Generate a unique, readable password
// Format: product-random6chars (e.g., "dental-x7k9m2")
export function generateUniquePassword(product: 'dentist' | 'realestate' = 'dentist'): string {
  const prefix = product === 'dentist' ? 'dental' : 'agent'
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
  product: 'dentist' | 'realestate'
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

    // Update last login and login count
    user.lastLogin = new Date().toISOString()
    user.loginCount = (user.loginCount || 0) + 1
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
export async function getUsersCount(product?: 'dentist' | 'realestate'): Promise<number> {
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
