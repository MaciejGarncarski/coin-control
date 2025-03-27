import { useCanGoBack, useNavigate, useRouter } from '@tanstack/react-router'

import { Button } from '@/components/ui/button'

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

export const GoBackButton = ({
  size = 'default',
  variant = 'default',
  className,
}: Props) => {
  const canGoBack = useCanGoBack()
  const navigate = useNavigate()
  const router = useRouter()

  const goBack = () => {
    if (!canGoBack) {
      navigate({
        to: '/',
        viewTransition: true,
      })
      return
    }

    router.history.back()
  }

  return (
    <Button
      variant={variant}
      size={size}
      type="button"
      className={className}
      onClick={goBack}>
      Go back
    </Button>
  )
}
