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
import { UserMenu } from '@/features/layout/comoponents/user-menu'

export function MobileNavbar() {
  const [isOpen, setIsOpen] = useState(false)
  const isMobile = useIsMobile()

  if (!isMobile) return null

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button type="button" size="icon">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" aria-describedby={undefined}>
        <SheetHeader>
          <SheetTitle>
            <p className="flex gap-2">
              <Coins />
              CoinControl
            </p>
          </SheetTitle>
        </SheetHeader>
        <nav className="flex h-full flex-col p-4">
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/account">account</Link>
            </li>
          </ul>
          <div className="mt-auto">
            <UserMenu />
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  )
}
