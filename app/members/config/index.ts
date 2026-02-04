// ============================================
// UNIFIED MEMBERS PLATFORM - CONFIG LOADER
// ============================================

import { NicheConfig, NicheSlug } from './types'
import { lawyersConfig } from './niches/lawyers'
import { dentistsConfig } from './niches/dentists'
import { psychologistsConfig } from './niches/psychologists'
import { plasticSurgeonsConfig } from './niches/plastic-surgeons'
import { dermatologistsConfig } from './niches/dermatologists'

// All available niche configurations
const configs: Record<NicheSlug, NicheConfig> = {
  lawyers: lawyersConfig,
  dentists: dentistsConfig,
  psychologists: psychologistsConfig,
  'plastic-surgeons': plasticSurgeonsConfig,
  dermatologists: dermatologistsConfig,
}

// Valid niche slugs for route validation
export const validNicheSlugs: NicheSlug[] = ['lawyers', 'dentists', 'psychologists', 'plastic-surgeons', 'dermatologists']

/**
 * Check if a string is a valid niche slug
 */
export function isValidNiche(slug: string): slug is NicheSlug {
  return validNicheSlugs.includes(slug as NicheSlug)
}

/**
 * Get configuration for a specific niche
 * @param slug - The niche identifier (lawyers, dentists, psychologists, plastic-surgeons)
 * @returns The niche configuration or null if not found
 */
export function getNicheConfig(slug: string): NicheConfig | null {
  if (!isValidNiche(slug)) {
    return null
  }
  return configs[slug]
}

/**
 * Get all available niche configurations
 */
export function getAllConfigs(): Record<NicheSlug, NicheConfig> {
  return configs
}

/**
 * Map old route paths to new niche slugs
 * Handles backward compatibility for old URL structure
 */
export function mapOldPathToNiche(path: string): NicheSlug | null {
  const pathMap: Record<string, NicheSlug> = {
    '/lawyers/members': 'lawyers',
    '/dentists/members': 'dentists',
    '/psychologists/members': 'psychologists',
    '/plastic-surgeons/members': 'plastic-surgeons',
    '/dermatologists/members': 'dermatologists',
  }
  return pathMap[path] || null
}

// Re-export types
export * from './types'

// Export individual configs for direct import if needed
export { lawyersConfig } from './niches/lawyers'
export { dentistsConfig } from './niches/dentists'
export { psychologistsConfig } from './niches/psychologists'
export { plasticSurgeonsConfig } from './niches/plastic-surgeons'
export { dermatologistsConfig } from './niches/dermatologists'
