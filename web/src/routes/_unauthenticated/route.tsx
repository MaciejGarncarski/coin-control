import {
  createFileRoute,
  Outlet,
  redirect,
  useRouteContext,
} from '@tanstack/react-router'

import { LogoLoading } from '@/components/logo-loading'
import { ThemeSwitcher } from '@/features/layout/comoponents/theme-switcher'
import { CookieBanner } from '@/features/privacy-policy/comopnents/cookie-banner'

export const Route = createFileRoute('/_unauthenticated')({
  beforeLoad: async ({ context }) => {
    let shouldRedirect = false

    if (context.auth.status === 'PENDING') {
      const data = await context.auth.ensureSession()

      if (!data) {
        shouldRedirect = false
      }
    }

    if (context.auth.status === 'AUTHENTICATED') {
      shouldRedirect = true
    }

    if (shouldRedirect) {
      throw redirect({
        to: '/',
      })
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const routeContext = useRouteContext({ from: '/_unauthenticated' })

  if (routeContext.auth.status === 'PENDING') {
    return <LogoLoading />
  }

  return (
    <div className="bg-primary/3 h-screen w-full py-4">
      <main className="mx-auto -mt-8 flex h-full w-[20rem] flex-col items-center justify-center gap-2 md:w-[25rem]">
        <div className="flex w-full justify-end">
          <ThemeSwitcher withText />
        </div>
        <Outlet />
        <CookieBanner />
      </main>
    </div>
  )
}
