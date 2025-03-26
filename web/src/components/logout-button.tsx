import { Button } from '@/components/ui/button'
import { useLogoutMutation } from '@/lib/auth'

type Props = {
  size?: 'sm' | 'default' | 'lg' | 'icon'
  className?: string
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
  className,
}: Props) => {
  const logoutMutation = useLogoutMutation()

  return (
    <Button
      variant={variant}
      size={size}
      type="button"
      className={className}
      onClick={() => logoutMutation.mutate()}>
      Logout
    </Button>
  )
}
