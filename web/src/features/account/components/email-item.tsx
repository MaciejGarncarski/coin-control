import { MoreHorizontal } from 'lucide-react'
import { useState } from 'react'

import { useIsMobile } from '@/components/hooks/use-mobile'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { DeleteEmailButton } from '@/features/account/components/delete-email-button'
import { ResendEmailVerificationButton } from '@/features/account/components/resend-verification-button'
import { SetPrimaryEmailButton } from '@/features/account/components/set-primary-email-button'

type Props = {
  email: string
  emailID: string
  isPrimary: boolean
  isVerified: boolean
}

export const EmailItem = ({ email, emailID, isPrimary, isVerified }: Props) => {
  const isMobile = useIsMobile()
  const [isOpen, setIsOpen] = useState(false)

  const closeMenu = () => setIsOpen(false)

  return (
    <li
      className="bg-muted relative flex h-22 flex-col gap-4 rounded-lg border p-4 text-sm shadow md:h-16 md:flex-row md:items-center"
      key={emailID}>
      <span>{email}</span>
      <div className="flex w-full flex-row items-center gap-4">
        {isVerified ? (
          <Badge className="bg-blue-500/30 text-blue-800 dark:bg-blue-500/10 dark:text-blue-500">
            Verified
          </Badge>
        ) : (
          <Badge className="opacity-80" variant={'outline'}>
            Unverified
          </Badge>
        )}
        {isPrimary ? (
          <Badge
            variant={'default'}
            className="bg-green-500/30 text-green-800 dark:bg-green-500/10 dark:text-green-500">
            Primary
          </Badge>
        ) : null}
        {!isMobile ? (
          <div className="ml-auto flex items-center gap-4">
            {!isPrimary && !isVerified ? (
              <ResendEmailVerificationButton
                email={email}
                closeMenu={closeMenu}
              />
            ) : null}

            <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
              <DropdownMenuTrigger asChild>
                <Button type="button" size="sm" variant={'outline'}>
                  <MoreHorizontal />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-32">
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild>
                    <DeleteEmailButton email={email} closeMenu={closeMenu} />
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                {isVerified && !isPrimary ? (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem asChild>
                        <SetPrimaryEmailButton
                          email={email}
                          closeMenu={closeMenu}
                        />
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </>
                ) : null}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                type="button"
                size="sm"
                variant={'ghost'}
                className="absolute right-2 bottom-2">
                <MoreHorizontal />
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom">
              <SheetHeader>
                <SheetTitle>Options</SheetTitle>
                <SheetDescription>{email}</SheetDescription>
                <div className="mt-4 flex flex-col gap-4">
                  {!isPrimary && !isVerified ? (
                    <ResendEmailVerificationButton
                      email={email}
                      closeMenu={closeMenu}
                    />
                  ) : null}
                  <SetPrimaryEmailButton email={email} closeMenu={closeMenu} />
                  <DeleteEmailButton email={email} closeMenu={closeMenu} />
                </div>
              </SheetHeader>
            </SheetContent>
          </Sheet>
        )}
      </div>
    </li>
  )
}
