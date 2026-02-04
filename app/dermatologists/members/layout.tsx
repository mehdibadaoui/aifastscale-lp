export default function DermatologistMembersLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {/* Script to set dark class immediately before render */}
      <script dangerouslySetInnerHTML={{ __html: `
        (function() {
          try {
            var darkMode = localStorage.getItem('dermatologist_v4_dark_mode');
            // Default to dark mode if not set
            if (darkMode === null || darkMode === 'true') {
              document.documentElement.classList.add('dark');
            } else {
              document.documentElement.classList.remove('dark');
            }
          } catch(e) {
            // Default to dark mode on error
            document.documentElement.classList.add('dark');
          }
        })();
      `}} />
      <style dangerouslySetInnerHTML={{ __html: `
        /* Dark mode body background */
        html.dark body { background: #0a0f1a !important; }
        /* Light mode body background */
        html:not(.dark) body { background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #f1f5f9 100%) !important; }
        /* Smooth transition for theme changes */
        body { transition: background-color 0.3s ease; }
      `}} />
      {children}
    </>
  )
}
