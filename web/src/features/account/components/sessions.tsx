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
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { useMySessions } from '@/features/account/api/get-my-sessions'
import { useDeleteAllSessions } from '@/features/account/api/use-delete-all-sessions'
import { SessionItem } from '@/features/account/components/session-item'

export const Sessions = () => {
  const mySessions = useMySessions()
  const deleteAllSessions = useDeleteAllSessions()

  if (mySessions.isLoading) {
    return 'NULL'
  }

  return (
    <section>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <h2 className="text-3xl font-semibold">Sessions</h2>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button type="button" variant="destructive" size={'sm'}>
                Log out all devices
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  You will be logged out on every device.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => deleteAllSessions.mutate()}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardHeader>
        <CardContent>
          <ul className="flex flex-col gap-4">
            {mySessions.data?.map((session) => {
              return <SessionItem session={session} key={session.sid} />
            })}
          </ul>
        </CardContent>
      </Card>
    </section>
  )
}
