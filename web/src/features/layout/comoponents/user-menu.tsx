import { Settings } from 'lucide-react'

import { useIsMobile } from '@/components/hooks/use-mobile'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { useSidebarStore } from '@/features/layout/comoponents/sidebar-provider'
import { UserDropdown } from '@/features/layout/comoponents/user-dropdown'
import { useUser } from '@/lib/auth'
import { cn } from '@/lib/utils'

export const UserMenu = () => {
  const isMobile = useIsMobile()
  const user = useUser({})
  const sidebarOpen = useSidebarStore((s) => s.open)

  const sidebarOpenDesktop = sidebarOpen && !isMobile

  if (!user.data) {
    return null
  }

  return (
    <div
      className={cn(
        'bg-background flex h-14 items-center gap-3 overflow-hidden rounded-md border px-3 py-2 shadow',
      )}>
      {sidebarOpenDesktop ? (
        <UserDropdown
          triggerComponent={
            <button type="button">
              <Avatar>
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="@shadcn"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </button>
          }
        />
      ) : (
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      )}
      <div className="text-sm">
        <p>{user.data.name}</p>
        <p className="text-muted-foreground text-xs">{user.data.email}</p>
      </div>
      {sidebarOpenDesktop ? null : (
        <div className="ml-auto">
          <UserDropdown
            triggerComponent={
              <Button type="button" variant={'outline'} size={'icon'}>
                <Settings />
              </Button>
            }
          />
        </div>
      )}
    </div>
  )
}
