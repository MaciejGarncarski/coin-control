import { Link } from '@tanstack/react-router'
import { User } from 'lucide-react'
import type { ReactNode } from 'react'

import { LogoutButton } from '@/components/logout-button'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { AccentSwitcher } from '@/features/layout/comoponents/accent-switcher'
import { ViewTransitionsCheckbox } from '@/features/layout/comoponents/view-transitions-checkbox'

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
            <Button
              variant={'ghost'}
              asChild
              size={'sm'}
              className="w-full justify-start text-left font-normal">
              <Link
                to="/account"
                viewTransition={{ types: ['main-transition'] }}>
                <User />
                Account
              </Link>
            </Button>
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
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <AccentSwitcher />
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <ViewTransitionsCheckbox />
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
