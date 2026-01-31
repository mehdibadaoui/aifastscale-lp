'use client'

import { universalConfig } from './config/universal'
import PremiumPlatform from './components/PremiumPlatform'

export default function MembersPage() {
  return <PremiumPlatform config={universalConfig} />
}
