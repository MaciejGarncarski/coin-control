import { Link } from '@tanstack/react-router'
import { Coins, Menu } from 'lucide-react'
import { useState } from 'react'

import { useIsMobile } from '@/components/hooks/use-mobile'
import { Button } from '@/components/ui/button'
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
        <Button type="button" size="icon" variant={'outline'}>
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" aria-describedby={undefined} className="gap-4">
        <SheetHeader>
          <SheetTitle>
            <p className="flex gap-2 px-4 py-4">
              <Coins />
              CoinControl
            </p>
          </SheetTitle>
        </SheetHeader>
        <nav className="text-muted-foreground mx-4 flex flex-col gap-10 py-4 text-lg">
          {rotues.map(({ icon: Icon, text, url }) => {
            return (
              <ul key={text}>
                <li>
                  <Link
                    to={url}
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
              </ul>
            )
          })}
        </nav>
        <div className="mt-auto p-2">
          <UserMenu />
        </div>
      </SheetContent>
    </Sheet>
  )
}
