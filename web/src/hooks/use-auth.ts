import { userQueryOptions } from '@/lib/auth'
import { auth } from '@/routes/__root'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useRouteContext, useRouter } from '@tanstack/react-router'
import { useEffect } from 'react'

export function useAuth() {
  const router = useRouter()
  const routeContext = useRouteContext({ from: '__root__' })
  const userAuthenticated = useSuspenseQuery(userQueryOptions)

  useEffect(() => {
    router.invalidate()
    routeContext.auth = {
      ...auth,
      status: userAuthenticated.data?.id ? 'loggedIn' : 'loggedOut',
    }
  }, [routeContext, router, userAuthenticated.data])
}
