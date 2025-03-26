import { createFileRoute } from '@tanstack/react-router'

import { useUser } from '@/lib/auth'

export const Route = createFileRoute('/_authenticated/account')({
  component: RouteComponent,
  pendingComponent: () => <p>Loading</p>,
})

function RouteComponent() {
  const user = useUser({})
  return <div>UserID: {user.data?.id}</div>
}
