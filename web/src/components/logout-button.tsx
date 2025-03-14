import { Button } from '@/components/ui/button'
import { useLogoutMutation } from '@/lib/auth'

type Props = {
  size?: 'sm' | 'default' | 'lg' | 'icon'
}

export const LogoutButton = ({ size }: Props) => {
  const logoutMutation = useLogoutMutation()

  return (
    <Button
      size={size || 'default'}
      type="button"
      onClick={() => logoutMutation.mutate()}>
      Logout
    </Button>
  )
}
