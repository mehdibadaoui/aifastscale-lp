// Blocklist for abusive users who spam the demo
// Block by email AND IP address for maximum protection

export const BLOCKED_EMAILS: string[] = [
  'velvetstone090@gmail.com',
]

// Block specific IP addresses
export const BLOCKED_IPS: string[] = [
  // IPs will be logged and can be added here
]

// Helper function to check if email is blocked
export function isEmailBlocked(email: string): boolean {
  if (!email) return false
  const normalizedEmail = email.toLowerCase().trim()
  return BLOCKED_EMAILS.includes(normalizedEmail)
}

// Helper function to check if IP is blocked
export function isIpBlocked(ip: string): boolean {
  if (!ip) return false
  // Normalize IP (remove ::ffff: prefix for IPv4-mapped IPv6)
  const normalizedIp = ip.replace(/^::ffff:/, '')
  return BLOCKED_IPS.includes(normalizedIp)
}

// Optional: Block certain email domains entirely
export const BLOCKED_DOMAINS: string[] = [
  // Example: 'tempmail.com',
]

export function isEmailDomainBlocked(email: string): boolean {
  if (!email) return false
  const domain = email.toLowerCase().split('@')[1]
  if (!domain) return false
  return BLOCKED_DOMAINS.includes(domain)
}

// Combined check for email
export function shouldBlockEmail(email: string): boolean {
  return isEmailBlocked(email) || isEmailDomainBlocked(email)
}

// Combined check for IP + email
export function shouldBlock(email: string | null, ip: string | null): boolean {
  if (ip && isIpBlocked(ip)) return true
  if (email && shouldBlockEmail(email)) return true
  return false
}
