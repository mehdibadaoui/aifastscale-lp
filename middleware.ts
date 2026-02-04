import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Middleware for handling redirects to the universal /members platform
 *
 * ALL old routes redirect to /members:
 * - /lawyers/members → /members
 * - /dentists/members → /members
 * - /members/lawyers → /members
 * - etc.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // All routes that should redirect to /members
  const redirectToMembers = [
    // Old niche-specific routes
    '/lawyers/members',
    '/dentists/members',
    '/psychologists/members',
    '/plastic-surgeons/members',
    '/dermatologists/members',
    // Old unified routes (from previous implementation)
    '/members/lawyers',
    '/members/dentists',
    '/members/psychologists',
    '/members/plastic-surgeons',
    '/members/dermatologists',
  ]

  // Check if this route should redirect to /members
  if (redirectToMembers.includes(pathname)) {
    const url = request.nextUrl.clone()
    url.pathname = '/members'
    return NextResponse.redirect(url, 308) // 308 = Permanent Redirect
  }

  // Case-insensitive fallback: /Dermatologists/* → /dermatologists/*
  if (pathname.startsWith('/Dermatologists')) {
    const url = request.nextUrl.clone()
    url.pathname = pathname.replace('/Dermatologists', '/dermatologists')
    return NextResponse.redirect(url, 308)
  }

  return NextResponse.next()
}

// Configure which paths the middleware runs on
export const config = {
  matcher: [
    '/lawyers/members',
    '/dentists/members',
    '/psychologists/members',
    '/plastic-surgeons/members',
    '/dermatologists/members',
    '/members/lawyers',
    '/members/dentists',
    '/members/psychologists',
    '/members/plastic-surgeons',
    '/members/dermatologists',
    '/Dermatologists/:path*',
  ],
}
