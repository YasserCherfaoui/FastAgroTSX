import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'

import { authKeys } from '../lib/auth-queries'
import { subscribeAuth } from '../lib/auth-session'

/** Keeps React Query auth cache in sync with localStorage (tabs + login/logout). */
export default function AuthSync() {
  const queryClient = useQueryClient()

  useEffect(() => {
    return subscribeAuth(() => {
      void queryClient.invalidateQueries({ queryKey: authKeys.session })
    })
  }, [queryClient])

  return null
}
