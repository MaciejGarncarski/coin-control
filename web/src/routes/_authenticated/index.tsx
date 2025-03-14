import { userQueryOptions } from '@/lib/auth'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/')({
  component: App,
})

function App() {
  const user = useQuery(userQueryOptions)

  if (!user.data?.id) {
    return null
  }

  return <div>home</div>
}
