import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Members Area | CloneYourself Video System',
  description: 'Access your AI video training and bonuses',
  // Dark theme color for Safari UI
  themeColor: '#09090b',
}

export default function MembersLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div
      className="members-layout"
      style={{
        backgroundColor: '#09090b',
        minHeight: '100dvh',
      }}
    >
      {children}
    </div>
  )
}
