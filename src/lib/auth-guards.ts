import { redirect } from '@tanstack/react-router'

import { getAuthToken } from './auth-session'

/** If already signed in, send them to the home page. */
export function redirectIfAuthenticated(): void {
  if (typeof window !== 'undefined' && getAuthToken()) {
    throw redirect({ to: '/', replace: true })
  }
}

/**
 * Shared options for `/login`, `/register`, and similar public auth routes.
 * `ssr: false` ensures `beforeLoad` runs in the browser where `localStorage` exists.
 */
export const authPageRouteOptions = {
  ssr: false as const,
  beforeLoad: () => redirectIfAuthenticated(),
}

export function requireAuthentication(redirectTo: string): void {
  if (typeof window !== 'undefined' && !getAuthToken()) {
    throw redirect({
      to: '/login',
      search: { redirect: redirectTo },
      replace: true,
    })
  }
}
