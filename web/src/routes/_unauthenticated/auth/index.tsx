import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_unauthenticated/auth/')({
  beforeLoad: () => {
    throw redirect({
      to: '/auth/login',
      viewTransition: true,
    })
  },

  component: RouteComponent,
})

function RouteComponent() {
  return null
}
