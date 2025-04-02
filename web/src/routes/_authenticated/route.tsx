import { useQuery } from '@tanstack/react-query'
import {
  createFileRoute,
  Outlet,
  redirect,
  useRouteContext,
} from '@tanstack/react-router'

import { VerifyAccountPage } from '@/features/auth/pages/verify-account'
import { Layout } from '@/features/layout/comoponents/layout'
import { CookieBanner } from '@/features/privacy-policy/comopnents/cookie-banner'
import { userQueryOptions } from '@/lib/auth'

export const Route = createFileRoute('/_authenticated')({
  component: App,
  beforeLoad: async ({ context }) => {
    if (!context.auth?.status) {
      return
    }

    const isLoggedIn = context.auth?.status === 'loggedIn'

    if (!isLoggedIn) {
      throw redirect({
        to: '/auth/login',
        viewTransition: true,
      })
    }
  },
})

function App() {
  const user = useQuery(userQueryOptions)
  const routeContext = useRouteContext({ from: '/_authenticated' })

  if (!routeContext.auth) {
    return null
  }

  if (!user.data) {
    return null
  }

  if (!user.data?.id) {
    return null
  }

  if (routeContext.auth.isEmailVerified === false) {
    return <VerifyAccountPage />
  }

  return (
    <Layout>
      <Outlet />
      <CookieBanner />
    </Layout>
  )
}
