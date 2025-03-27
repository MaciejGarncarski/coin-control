import { Link } from '@tanstack/react-router'
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
        <DropdownMenuLabel className="font-semibold">Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link to="/account">Profile</Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <LogoutButton
              variant="ghost"
              size="sm"
              className="w-full justify-start text-left font-normal"
            />
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
