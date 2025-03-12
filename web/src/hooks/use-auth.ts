import { userQueryOptions } from '@/lib/auth'
import { useQuery } from '@tanstack/react-query'
import { useRouteContext, useRouter } from '@tanstack/react-router'
import { useEffect } from 'react'

export function useAuth() {
  const userAuthenticated = useQuery(userQueryOptions)
  const router = useRouter()
  const routeContext = useRouteContext({ from: '__root__' })

  useEffect(() => {
    if (userAuthenticated.isLoading) return

    routeContext.auth.status = userAuthenticated.data?.id
      ? 'loggedIn'
      : 'loggedOut'
    router.invalidate()
  }, [
    routeContext,
    router,
    userAuthenticated.data,
    userAuthenticated.isLoading,
  ])
}
