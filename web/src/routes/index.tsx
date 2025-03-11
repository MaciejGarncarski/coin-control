import { LogoutButton } from '@/components/logout-button'
import { userQueryOptions } from '@/lib/auth'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: App,
  beforeLoad: async ({ context: { queryClient } }) => {
    const isLoggedIn = await queryClient.ensureQueryData(userQueryOptions)
    if (!isLoggedIn) {
      throw redirect({
        to: '/auth/login',
      })
    }
  },
})

function App() {
  return (
    <div className="animate-in fade-in text-center">
      home
      <LogoutButton />
    </div>
  )
}
