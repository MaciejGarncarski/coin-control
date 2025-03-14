import { userQueryOptions } from '@/lib/auth'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/account')({
  component: RouteComponent,
})

function RouteComponent() {
  const user = useQuery(userQueryOptions)
  return <div>UserID: {user.data?.id}</div>
}
