import { type ReactNode } from '@tanstack/react-router'
import { SidebarClose } from 'lucide-react'

import { useIsMobile } from '@/components/hooks/use-mobile'
import { Button } from '@/components/ui/button'
import { DesktopNavbar } from '@/features/layout/comoponents/desktop-navbar'
import { MobileNavbar } from '@/features/layout/comoponents/mobile-navbar'
import { useSidebarStore } from '@/features/layout/comoponents/sidebar-provider'
import { ThemeSwitcher } from '@/features/layout/comoponents/theme-switcher'
import { cn } from '@/lib/utils'

export function Layout({ children }: { children: ReactNode }) {
  const toggleSidebarOpen = useSidebarStore((s) => s.toggleOpen)
  const isMobile = useIsMobile()

  return (
    <div className={cn(!isMobile && 'flex')}>
      <DesktopNavbar />
      <div className={cn('flex h-screen w-full flex-col')}>
        <header className="bg-background flex h-20 w-full items-center justify-start gap-4 px-4 md:px-10">
          <MobileNavbar />
          {isMobile ? null : (
            <Button
              type="button"
              size={'icon'}
              variant={'ghost'}
              onClick={toggleSidebarOpen}>
              <SidebarClose />
            </Button>
          )}

          <div className="ml-auto">
            <ThemeSwitcher />
          </div>
        </header>
        <div className="bg-background flex">
          <main className="w-full p-8 md:rounded-tl-2xl">{children}</main>
        </div>
      </div>
    </div>
  )
}
