import { Button } from '@/components/ui/button'
import { useLogoutMutation } from '@/lib/auth'

type Props = {
  size?: 'sm' | 'default' | 'lg' | 'icon'
  variant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link'
}

export const LogoutButton = ({
  size = 'default',
  variant = 'default',
}: Props) => {
  const logoutMutation = useLogoutMutation()

  return (
    <Button
      variant={variant}
      size={size}
      type="button"
      onClick={() => logoutMutation.mutate()}>
      Logout
    </Button>
  )
}
