'use client'

import { useEffect } from 'react'

export default function MicrosoftClarity() {
  const clarityId = process.env.NEXT_PUBLIC_CLARITY_ID

  if (!clarityId) {
    return null
  }

  useEffect(() => {
    if (typeof window !== 'undefined' && !(window as any).clarity) {
      const clarity: any = ((window as any).clarity = function () {
        ;(clarity.q = clarity.q || []).push(arguments)
      })

      // Load external script
      const script = document.createElement('script')
      script.async = true
      script.src = 'https://www.clarity.ms/tag/' + clarityId
      const firstScript = document.getElementsByTagName('script')[0]
      if (firstScript && firstScript.parentNode) {
        firstScript.parentNode.insertBefore(script, firstScript)
      }
    }
  }, [clarityId])

  return null
}
