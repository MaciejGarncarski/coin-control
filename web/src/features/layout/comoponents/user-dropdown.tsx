import { Link } from '@tanstack/react-router'
import { User } from 'lucide-react'
import type { ReactNode } from 'react'

import { LogoutButton } from '@/components/logout-button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
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
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link to="/account">
              <User />
              Account
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <LogoutButton
              withIcon
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
