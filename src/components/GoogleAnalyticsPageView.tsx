import { useRouterState } from '@tanstack/react-router'
import { useEffect, useRef } from 'react'

import { isGoogleAnalyticsEnabled, trackPageView } from '../lib/google-analytics'

/**
 * Fires `page_view` on client-side navigations (initial load is handled by
 * the gtag bootstrap in `__root.tsx`).
 */
export default function GoogleAnalyticsPageView() {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const skipFirst = useRef(true)

  useEffect(() => {
    if (!isGoogleAnalyticsEnabled()) return
    if (skipFirst.current) {
      skipFirst.current = false
      return
    }
    trackPageView(pathname)
  }, [pathname])

  return null
}
