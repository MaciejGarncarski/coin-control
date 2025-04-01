import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { useDeleteEmail } from '@/features/account/api/use-delete-email'
import { useUser } from '@/lib/auth'

type Props = {
  email: string
  closeMenu: () => void
}

export const DeleteEmailButton = ({ email, closeMenu }: Props) => {
  const userData = useUser({})
  const deleteEmailMutation = useDeleteEmail()

  const isDisabled = userData.data?.email === email

  const handleDelete = () => {
    deleteEmailMutation.mutate(
      { email },
      {
        onSettled: () => {
          closeMenu()
        },
      },
    )
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          type="button"
          disabled={isDisabled}
          variant={'destructive'}
          className="w-full"
          size={'sm'}>
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete email</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure to delete email {email} from your account?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
