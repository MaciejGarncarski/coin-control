import { LogoutButton } from '@/components/logout-button'
import { userQueryOptions } from '@/lib/auth'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: App,
  beforeLoad: async ({ context }) => {
    const isLoggedIn = context.auth.status === 'loggedIn'

    if (!isLoggedIn) {
      throw redirect({
        to: '/auth/login',
      })
    }
  },
})

function App() {
  const query = useQuery(userQueryOptions)

  return (
    <div className="animate-in fade-in text-center">
      home
      <LogoutButton />
      ---
      {query.data?.id || 'brak id'}
    </div>
  )
}
