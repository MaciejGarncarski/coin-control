import { Link } from '@tanstack/react-router'
import { Coins } from 'lucide-react'

import { useIsMobile } from '@/components/hooks/use-mobile'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useSidebarStore } from '@/features/layout/comoponents/sidebar-provider'
import { UserMenu } from '@/features/layout/comoponents/user-menu'
import { cn } from '@/lib/utils'

export function DesktopNavbar() {
  const isMobile = useIsMobile()
  const sidebarOpen = useSidebarStore((s) => s.open)

  if (isMobile) return null

  return (
    <nav
      className={cn(
        sidebarOpen ? 'w-22' : 'w-96',
        'bg-muted flex h-screen flex-col gap-8 border-r p-4 transition-all duration-300',
      )}>
      <h1 className="bg-background hidden gap-2 overflow-hidden rounded-md border px-4 py-3 shadow md:flex">
        <span className="inline-block w-10 shrink-0">
          <Coins />
        </span>
        CoinControl
      </h1>
      <ScrollArea>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/account">account</Link>
          </li>
        </ul>
      </ScrollArea>

      <div className="mt-auto">
        <UserMenu />
      </div>
    </nav>
  )
}
