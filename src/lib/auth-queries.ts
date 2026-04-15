import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import {
  clearAuthSession,
  getAuthToken,
  getAuthUser,
  persistSessionFromServer,
  saveAuthSession,
  type AuthUser,
} from './auth-session'
import {
  ApiHttpError,
  fetchMe,
  loginRequest,
  registerRequest,
  type LoginRequest,
  type RegisterRequest,
} from './api'

export const authKeys = {
  session: ['auth', 'session'] as const,
}

export function useAuthSession() {
  const hasToken = typeof window !== 'undefined' && !!getAuthToken()
  const cachedUser = hasToken ? getAuthUser() : null

  return useQuery({
    queryKey: authKeys.session,
    queryFn: async (): Promise<AuthUser | null> => {
      const token = getAuthToken()
      if (!token) return null
      try {
        const user = await fetchMe()
        persistSessionFromServer(token, user)
        return user
      } catch (err) {
        if (err instanceof ApiHttpError && err.status === 401) {
          clearAuthSession()
          return null
        }
        throw err
      }
    },
    enabled: hasToken,
    // Show stored profile while validating; real `data` replaces after fetch.
    placeholderData: cachedUser ?? undefined,
    staleTime: 5 * 60 * 1000,
    gcTime: 24 * 60 * 60 * 1000,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    retry: (failureCount, err) =>
      err instanceof ApiHttpError && err.status === 401 ? false : failureCount < 2,
  })
}

export function useLoginMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: LoginRequest) => loginRequest(body),
    onSuccess: (data) => {
      saveAuthSession(data.token, data.user)
      queryClient.setQueryData(authKeys.session, data.user)
    },
  })
}

export function useRegisterMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: RegisterRequest) => registerRequest(body),
    onSuccess: (data) => {
      saveAuthSession(data.token, data.user)
      queryClient.setQueryData(authKeys.session, data.user)
    },
  })
}

export function useLogoutMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async () => {
      clearAuthSession()
    },
    onSuccess: () => {
      queryClient.setQueryData(authKeys.session, null)
    },
  })
}
