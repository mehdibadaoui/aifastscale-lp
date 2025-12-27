'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

// Real Estate Meta Pixels - Only loads on non-dentist pages
export default function RootLayoutPixels() {
  const pathname = usePathname()
  const [shouldLoad, setShouldLoad] = useState(false)

  useEffect(() => {
    // Only load on non-dentist pages
    const isDentistPage = pathname?.startsWith('/dentists')
    if (!isDentistPage) {
      setShouldLoad(true)
    }
  }, [pathname])

  useEffect(() => {
    if (!shouldLoad) return

    // Load Meta Pixel after 2 seconds
    const timeout = setTimeout(() => {
      // Check if fbq already exists (don't reinitialize)
      if (typeof window !== 'undefined' && !(window as any).fbq) {
        const script = document.createElement('script')
        script.innerHTML = `
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '806502898408304');
          fbq('init', '1897880187469286');
          fbq('track', 'PageView');
        `
        document.head.appendChild(script)
      }
    }, 2000)

    return () => clearTimeout(timeout)
  }, [shouldLoad])

  // No visual output - just handles script loading
  return null
}
