// Dermatologist Members Page
// Redirects to universal /members platform (all niches share one members area)

import { redirect } from 'next/navigation'

export default function DermatologistMembersPage() {
  redirect('/members')
}
