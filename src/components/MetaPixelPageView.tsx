import { useRouterState } from '@tanstack/react-router'
import { useEffect, useRef } from 'react'

import { isMetaPixelEnabled, trackPageView } from '../lib/meta-pixel'

/**
 * Fires `PageView` on client-side navigations (initial load is handled by the
 * bootstrap snippet in `__root.tsx`).
 */
export default function MetaPixelPageView() {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const skipFirst = useRef(true)

  useEffect(() => {
    if (!isMetaPixelEnabled()) return
    if (skipFirst.current) {
      skipFirst.current = false
      return
    }
    trackPageView()
  }, [pathname])

  return null
}
