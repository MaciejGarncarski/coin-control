import { Button } from '@/components/ui/button'
import { useSetPrimaryEmail } from '@/features/account/api/use-set-primary-email'

type Props = {
  email: string
  closeMenu: () => void
}

export const SetPrimaryEmailButton = ({ email, closeMenu }: Props) => {
  const setPrimaryMutation = useSetPrimaryEmail()

  const setPrimary = () => {
    setPrimaryMutation.mutate({ email })
    closeMenu()
  }

  return (
    <Button size={'sm'} type="button" variant="ghost" onClick={setPrimary}>
      Set as primary
    </Button>
  )
}
