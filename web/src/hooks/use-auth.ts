import { userQueryOptions } from '@/lib/auth'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useRouteContext, useRouter } from '@tanstack/react-router'
import { useEffect } from 'react'

export function useAuth() {
  const router = useRouter()
  const routeContext = useRouteContext({ from: '__root__' })
  const userAuthenticated = useSuspenseQuery(userQueryOptions)

  useEffect(() => {
    router.invalidate()
    routeContext.auth.status = userAuthenticated.data?.id
      ? 'loggedIn'
      : 'loggedOut'
    console.log(routeContext.auth.status)
  }, [routeContext, router, userAuthenticated.data])
}
