import { Button } from '@/components/ui/button'
import { useLogoutMutation } from '@/lib/auth'

export const LogoutButton = () => {
  const logoutMutation = useLogoutMutation()

  return (
    <Button type="button" onClick={() => logoutMutation.mutate()}>
      Logout
    </Button>
  )
}
