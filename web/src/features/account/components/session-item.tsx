import type { MySession } from '@shared/schemas'
import { ChevronsUpDown, Laptop, Smartphone } from 'lucide-react'

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
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { useDeleteOneSession } from '@/features/account/api/use-delete-session'
import { SessionIP } from '@/features/account/components/ip'

type Props = {
  session: MySession
}

const dateFormatter = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'CET',
  dateStyle: 'medium',
  timeStyle: 'long',
  hour12: false,
})

export const SessionItem = ({ session }: Props) => {
  const deleteSession = useDeleteOneSession()

  const handleSessionDelete = () => {
    deleteSession.mutate(session.id)
  }

  return (
    <li className="bg-muted relative rounded-lg border p-4 shadow">
      <Collapsible className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-start">
            <span className="bg-background text-muted-foreground rounded-full border p-2 shadow">
              {session.deviceType === 'mobile' ? <Smartphone /> : <Laptop />}
            </span>
          </div>
          <div className="flex flex-col md:flex-row md:items-center md:gap-4">
            <span className="flex flex-col">
              {!session.browser && !session.os ? (
                <span className="text-sm md:text-base">Unknown device</span>
              ) : (
                <span className="text-sm md:text-base">
                  {session.browser || 'Unknown browser'} on{' '}
                  {session.os || 'unknown OS'}
                </span>
              )}
              <span className="text-muted-foreground text-xs">
                {session.location || 'Location not found'}
              </span>
            </span>

            {session.current ? (
              <Badge className="absolute -top-3 -right-1 md:static">
                current
              </Badge>
            ) : null}
          </div>

          <CollapsibleTrigger asChild>
            <Button variant="outline" size="sm" className="ml-auto">
              <ChevronsUpDown className="h-4 w-4" />
              <span className="sr-only">Toggle</span>
            </Button>
          </CollapsibleTrigger>
        </div>

        <CollapsibleContent className="flex flex-col items-center justify-center gap-4 md:flex-row md:justify-between md:gap-2">
          <div className="text-muted-foreground flex flex-col gap-2 text-sm">
            <p className="flex flex-col items-center justify-center md:block">
              <span className="text-foreground">Last access: </span>
              <span className="text-xs md:text-sm">
                {session.lastAccess
                  ? dateFormatter.format(session.lastAccess)
                  : null}
              </span>
            </p>
            <SessionIP ip={session.ip || 'failed to load'} />
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button type="button" variant="destructive" size={'sm'}>
                Log out the device shown
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  You will have to sign in manually in {session.browser} on{' '}
                  {session.os}.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleSessionDelete}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CollapsibleContent>
      </Collapsible>
    </li>
  )
}
