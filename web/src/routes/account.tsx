import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/account')({
  beforeLoad: ({ context }) => {
    if (context.auth?.status !== 'loggedIn') {
      throw redirect({
        to: '/auth/login',
      })
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello </div>
}
