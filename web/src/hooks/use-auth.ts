import { userQueryOptions } from '@/lib/auth'
import type { AppRouter } from '@/main'
import { auth, type Auth } from '@/routes/__root'
import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'

export function useAuth(router: AppRouter): Auth {
  const userAuthenticated = useQuery(userQueryOptions)

  useEffect(() => {
    router.invalidate()
  }, [router, userAuthenticated.data])

  return {
    ...auth,
    status: userAuthenticated.data?.id ? 'loggedIn' : 'loggedOut',
  }
}
