import { LogOut } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useLogoutMutation } from '@/lib/auth'

type Props = {
  size?: 'sm' | 'default' | 'lg' | 'icon'
  className?: string
  withIcon?: boolean
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
  withIcon = false,
}: Props) => {
  const logoutMutation = useLogoutMutation()

  return (
    <Button
      variant={variant}
      size={size}
      type="button"
      className={className}
      onClick={() => logoutMutation.mutate()}>
      {withIcon ? <LogOut /> : null}
      Logout
    </Button>
  )
}
