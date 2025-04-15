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
  pendingMinMs: 0,
  pendingMs: 0,
  beforeLoad: async ({ context }) => {
    let shouldRedirect = false

    if (context.auth.status === 'PENDING') {
      const data = await context.auth.ensureSession()

      if (!data) {
        shouldRedirect = true
      }
    }

    if (!context.auth?.status) {
      return
    }

    if (shouldRedirect) {
      throw redirect({
        to: '/auth/login',
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
