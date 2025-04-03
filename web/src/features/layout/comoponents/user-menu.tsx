import { Settings } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { UserAvatar } from '@/components/user-avatar'
import { UserDropdown } from '@/features/layout/comoponents/user-dropdown'
import { useUser } from '@/lib/auth'
import { cn } from '@/lib/utils'

export const UserMenu = () => {
  const user = useUser()

  if (!user.data) {
    return null
  }

  return (
    <div
      className={cn(
        'bg-muted flex max-h-20 min-h-14 items-center gap-3 overflow-hidden rounded-md border px-3 py-2 shadow',
      )}>
      <UserAvatar />

      <div className="text-xs">
        <p className="font-semibold">{user.data.name}</p>
        <p className="text-muted-foreground max-w-[16ch] overflow-hidden text-xs overflow-ellipsis">
          {user.data.email}
        </p>
      </div>

      <div className="ml-auto">
        <UserDropdown
          side="top"
          triggerComponent={
            <Button type="button" variant={'outline'} size={'icon'}>
              <Settings />
            </Button>
          }
        />
      </div>
    </div>
  )
}
