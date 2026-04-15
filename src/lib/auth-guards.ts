import { redirect } from '@tanstack/react-router'

import { getAuthToken } from './auth-session'

/** If already signed in, skip login / register screens. */
export function redirectIfAuthenticated(): void {
  if (typeof window !== 'undefined' && getAuthToken()) {
    throw redirect({ to: '/' })
  }
}
