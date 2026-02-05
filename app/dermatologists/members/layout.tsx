// Layout for dermatologist members - redirects to universal /members
// Minimal layout since page.tsx immediately redirects

export default function DermatologistMembersLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
