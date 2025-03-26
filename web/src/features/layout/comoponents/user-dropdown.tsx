import type { ReactNode } from 'react'

import { LogoutButton } from '@/components/logout-button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

type Props = {
  side?: 'top' | 'right' | 'bottom' | 'left'
  triggerComponent: ReactNode
}

export function UserDropdown({ triggerComponent, side = 'right' }: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{triggerComponent}</DropdownMenuTrigger>
      <DropdownMenuContent className="w-32" side={side} sideOffset={10}>
        <DropdownMenuLabel className="font-semibold">
          My account
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>Profile</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem className="p-0">
            <LogoutButton
              variant="ghost"
              size="sm"
              className="h-full w-full justify-start p-0 px-2 py-1.5 text-left hover:bg-transparent"
            />
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
