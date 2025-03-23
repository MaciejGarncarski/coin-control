import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_not_authenticated')({
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
    <main className="flex h-screen flex-col items-center justify-center gap-4">
      <Outlet />
    </main>
  )
}
