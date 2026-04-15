import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import {
  clearAuthSession,
  getAuthToken,
  getAuthUser,
  saveAuthSession,
  type AuthUser,
} from './auth-session'
import { fetchMe, loginRequest, registerRequest, type LoginRequest, type RegisterRequest } from './api'

export const authKeys = {
  session: ['auth', 'session'] as const,
}

export function useAuthSession() {
  const hasToken = typeof window !== 'undefined' && !!getAuthToken()

  return useQuery({
    queryKey: authKeys.session,
    queryFn: async (): Promise<AuthUser | null> => {
      const token = getAuthToken()
      if (!token) return null
      try {
        const user = await fetchMe()
        saveAuthSession(token, user)
        return user
      } catch {
        clearAuthSession()
        return null
      }
    },
    enabled: hasToken,
    initialData: hasToken ? getAuthUser() ?? undefined : undefined,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
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
