import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'

import { authKeys } from '../lib/auth-queries'
import { AUTH_TOKEN_KEY, AUTH_USER_KEY } from '../lib/auth-session'

/**
 * Cross-tab only: `localStorage` updates from another tab fire `storage` here.
 * Same-tab updates are handled by mutations (`setQueryData`) or `/me` persistence
 * without firing a custom event, so we avoid invalidate → refetch → save loops.
 */
export default function AuthSync() {
  const queryClient = useQueryClient()

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== AUTH_TOKEN_KEY && e.key !== AUTH_USER_KEY) return
      void queryClient.invalidateQueries({ queryKey: authKeys.session })
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [queryClient])

  return null
}
