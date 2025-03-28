import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

import { CookieBanner } from '@/features/cookies/comopnents/cookie-banner'
import { ThemeSwitcher } from '@/features/layout/comoponents/theme-switcher'

export const Route = createFileRoute('/_unauthenticated')({
  beforeLoad: async ({ context }) => {
    if (!context.auth?.status) {
      return
    }

    const isLoggedIn = context.auth?.status === 'loggedIn'

    if (isLoggedIn) {
      throw redirect({
        to: '/',
        viewTransition: true,
      })
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <main className="mx-auto -mt-8 flex h-screen w-[20rem] flex-col items-center justify-center gap-2 md:w-[25rem]">
      <div className="flex w-full justify-end">
        <ThemeSwitcher withText />
      </div>
      <Outlet />
      <CookieBanner />
    </main>
  )
}
