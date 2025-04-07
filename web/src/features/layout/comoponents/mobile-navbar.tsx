import { Link } from '@tanstack/react-router'
import { Menu } from 'lucide-react'
import { useState } from 'react'

import { useIsMobile } from '@/components/hooks/use-mobile'
import { Logo } from '@/components/logo'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { rotues } from '@/constants/routes'
import { UserMenu } from '@/features/layout/comoponents/user-menu'

export function MobileNavbar() {
  const [isOpen, setIsOpen] = useState(false)
  const isMobile = useIsMobile()

  if (!isMobile) return null

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          type="button"
          size="icon"
          className="md:hidden"
          variant={'outline'}>
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        aria-describedby={undefined}
        className="gap-4 [view-transition-name:sheet-content]">
        <SheetHeader>
          <SheetTitle>
            <div className="block">
              <Logo />
            </div>
          </SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100dvh-14rem)]">
          <nav className="text-muted-foreground mx-4 py-4 text-lg">
            <ul className="flex flex-col gap-10">
              {rotues.map(({ icon: Icon, text, url }) => {
                return (
                  <li key={text}>
                    <Link
                      to={url}
                      viewTransition={{ types: ['main-transition'] }}
                      className="flex gap-4 rounded-md px-4 py-3"
                      inactiveProps={{
                        className: 'border border-transparent',
                      }}
                      activeProps={{
                        className: 'text-foreground bg-muted border shadow',
                      }}>
                      <Icon />
                      {text}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>
        </ScrollArea>
        <div className="mx-4 mt-auto mb-4">
          <UserMenu />
        </div>
      </SheetContent>
    </Sheet>
  )
}
