import { useQuery } from '@tanstack/react-query'
import {
  createFileRoute,
  Outlet,
  redirect,
  useRouteContext,
} from '@tanstack/react-router'

import { VerifyEmailPage } from '@/features/auth/verify-email/pages/verify-email'
import { CookieBanner } from '@/features/cookie-banner/comopnents/cookie-banner'
import { Layout } from '@/features/layout/comoponents/layout'
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

  if (!user.data?.id) {
    return null
  }

  if (!routeContext.auth?.isEmailVerified) {
    return <VerifyEmailPage />
  }

  return (
    <Layout>
      <Outlet />
      <CookieBanner />
    </Layout>
  )
}
