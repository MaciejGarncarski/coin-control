import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

import { userQueryOptions } from '@/lib/auth'

export const Route = createFileRoute('/_authenticated/')({
  component: App,
})

function App() {
  const user = useQuery(userQueryOptions)

  if (!user.data?.id) {
    return null
  }

  return (
    <div>
      <div className="grid grid-cols-4"></div>
    </div>
  )
}
