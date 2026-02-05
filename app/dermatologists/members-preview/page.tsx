// Preview page redirects to universal /members platform
// All niches share one members area

import { redirect } from 'next/navigation'

export default function MembersPreviewPage() {
  redirect('/members')
}
