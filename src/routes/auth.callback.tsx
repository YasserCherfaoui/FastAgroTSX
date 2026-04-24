import { useQueryClient } from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

import { fetchMe } from '../lib/api'
import { authKeys } from '../lib/auth-queries'
import { AUTH_TOKEN_KEY, clearAuthSession, saveAuthSession } from '../lib/auth-session'

function sanitizeRedirectPath(path: string | undefined): string {
  if (typeof path !== 'string') return '/'
  const p = path.trim()
  if (p === '' || !p.startsWith('/') || p.startsWith('//')) {
    return '/'
  }
  return p
}

const oauthErrorMessages: Record<string, string> = {
  invalid_oauth_state: 'Session de connexion expirée. Réessayez.',
  missing_code: 'Réponse Google incomplète. Réessayez.',
  token_exchange_failed: 'Impossible de finaliser la connexion avec Google.',
  userinfo_failed: 'Impossible de récupérer votre profil Google.',
  invalid_profile: 'Profil Google invalide.',
  account_failed: 'Impossible de créer ou lier le compte.',
  google_sign_in_disabled: 'La connexion Google n’est pas configurée sur le serveur.',
}

export const Route = createFileRoute('/auth/callback')({
  ssr: false as const,
  validateSearch: (search: Record<string, unknown>) => ({
    token: typeof search.token === 'string' ? search.token : undefined,
    error: typeof search.error === 'string' ? search.error : undefined,
    redirect: typeof search.redirect === 'string' ? search.redirect : undefined,
  }),
  component: AuthCallbackPage,
})

function AuthCallbackPage() {
  const { token, error, redirect } = Route.useSearch()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [status, setStatus] = useState<'working' | 'done'>('working')

  useEffect(() => {
    if (error) {
      setStatus('done')
      return
    }
    const accessToken = token
    if (!accessToken) {
      void navigate({ to: '/login', replace: true })
      setStatus('done')
      return
    }

    let cancelled = false

    async function complete() {
      try {
        window.localStorage.setItem(AUTH_TOKEN_KEY, accessToken)
        const user = await fetchMe()
        if (cancelled) return
        saveAuthSession(accessToken, user)
        queryClient.setQueryData(authKeys.session, user)
        await navigate({ to: sanitizeRedirectPath(redirect), replace: true })
      } catch {
        clearAuthSession()
        if (!cancelled) {
          await navigate({ to: '/login', replace: true })
        }
      } finally {
        if (!cancelled) setStatus('done')
      }
    }

    void complete()
    return () => {
      cancelled = true
    }
  }, [error, token, redirect, navigate, queryClient])

  if (error) {
    const msg = oauthErrorMessages[error] ?? decodeURIComponent(error.replace(/\+/g, ' '))
    return (
      <main className="bg-(--surface) text-(--on-surface) flex min-h-screen items-center justify-center p-8 font-sans">
        <div className="max-w-md space-y-4 text-center">
          <h1 className="font-headline text-xl font-bold">Connexion Google</h1>
          <p className="text-(--error) text-sm">{msg}</p>
          <button
            type="button"
            className="text-(--primary-container) font-semibold underline"
            onClick={() => void navigate({ to: '/login', replace: true })}
          >
            Retour à la connexion
          </button>
        </div>
      </main>
    )
  }

  if (!token) {
    return null
  }

  return (
    <main className="bg-(--surface) text-(--on-surface) flex min-h-screen items-center justify-center p-8 font-sans">
      <p className="text-(--on-surface-variant) text-sm">
        {status === 'working' ? 'Connexion en cours…' : 'Redirection…'}
      </p>
    </main>
  )
}
