import { Link } from '@tanstack/react-router'

import { useAuthSession, useLogoutMutation } from '../lib/auth-queries'
import { getAuthToken } from '../lib/auth-session'

type AuthNavActionsProps = {
  loginClassName?: string
  logoutClassName?: string
  nameClassName?: string
}

export default function AuthNavActions({
  loginClassName = 'text-primary text-sm font-bold no-underline transition hover:underline',
  logoutClassName = 'text-(--on-surface-variant) hover:text-primary text-sm font-bold transition',
  nameClassName = 'text-(--on-surface) max-w-[140px] truncate text-sm font-semibold',
}: AuthNavActionsProps) {
  const { data: user } = useAuthSession()
  const logout = useLogoutMutation()
  const token = typeof window !== 'undefined' ? getAuthToken() : null

  if (!token && !user) {
    return (
      <Link to="/login" className={loginClassName}>
        Se connecter
      </Link>
    )
  }

  if (user) {
    return (
      <div className="flex items-center gap-3">
        <span className={nameClassName} title={user.email}>
          {user.full_name || user.email}
        </span>
        <button
          type="button"
          onClick={() => logout.mutate()}
          disabled={logout.isPending}
          className={logoutClassName}
        >
          Déconnexion
        </button>
      </div>
    )
  }

  return (
    <span className="text-(--on-surface-variant) text-sm" aria-busy="true">
      …
    </span>
  )
}
