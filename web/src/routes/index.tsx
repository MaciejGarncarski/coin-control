import { LogoutButton } from '@/components/logout-button'
import { userQueryOptions } from '@/lib/auth'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, Link, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: App,
  beforeLoad: async ({ context }) => {
    const isLoggedIn = context.auth?.status === 'loggedIn'

    if (!isLoggedIn) {
      throw redirect({
        to: '/auth/login',
        viewTransition: true,
      })
    }
  },
})

function App() {
  const user = useQuery(userQueryOptions)

  if (!user.data?.id) {
    return null
  }

  return (
    <div className="animate-in fade-in text-center">
      home
      <LogoutButton />
      <br />
      Moje id: {user.data.id}
      <Link to="/account">Account</Link>
    </div>
  )
}
