import { LogoutButton } from '@/components/logout-button'
import { userQueryOptions } from '@/lib/auth'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/')({
  component: App,
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
