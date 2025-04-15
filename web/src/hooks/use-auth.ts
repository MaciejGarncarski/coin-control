import type { User } from '@shared/schemas'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'

import { userQueryOptions } from '@/lib/auth'
import { router } from '@/main'

export const auth: Auth = {
  status: 'PENDING',
  isEmailVerified: false,
  login: () => {
    auth.status = 'AUTHENTICATED'
  },
  logout: () => {
    auth.status = 'UNAUTHENTICATED'
  },
}

export type Auth = {
  login: () => void
  logout: () => void
  status: 'UNAUTHENTICATED' | 'AUTHENTICATED' | 'PENDING'
  isEmailVerified: boolean
}

export type AuthUtils = {
  ensureSession: () => Promise<User | null>
}

export const useAuth = (): Auth & AuthUtils => {
  const userAuthenticated = useQuery(userQueryOptions)
  const queryClient = useQueryClient()

  useEffect(() => {
    router.invalidate()
  }, [userAuthenticated.data])

  const utils: AuthUtils = {
    ensureSession: () => {
      return queryClient.ensureQueryData(userQueryOptions)
    },
  }

  if (userAuthenticated.isPending) {
    return {
      ...utils,
      ...auth,
      status: 'PENDING',
    }
  }

  if (!userAuthenticated.data) {
    return {
      ...utils,
      ...auth,
      status: 'UNAUTHENTICATED',
    }
  }

  return {
    ...utils,
    ...auth,
    isEmailVerified: userAuthenticated.data.isEmailVerified,
    status: 'AUTHENTICATED',
  }
}
