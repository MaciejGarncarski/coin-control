import { Link, type ReactNode } from '@tanstack/react-router'
import { Coins } from 'lucide-react'

import { useIsMobile } from '@/components/hooks/use-mobile'
import { UserAvatar } from '@/components/user-avatar'
import { rotues } from '@/constants/routes'
import { MobileNavbar } from '@/features/layout/comoponents/mobile-navbar'
import { ThemeSwitcher } from '@/features/layout/comoponents/theme-switcher'
import { UserDropdown } from '@/features/layout/comoponents/user-dropdown'
import { cn } from '@/lib/utils'

export function Layout({ children }: { children: ReactNode }) {
  const isMobile = useIsMobile()

  return (
    <div className={cn(!isMobile && 'flex', 'bg-background')}>
      <div className={cn('flex w-full flex-col')}>
        <header className="bg-background/40 sticky top-0 flex h-16 w-full items-center justify-start gap-4 border-b px-4 backdrop-blur md:gap-1 lg:gap-12 lg:px-12">
          <MobileNavbar />
          {isMobile ? (
            <h1 className="mx-auto flex gap-2">
              <Coins />
              CoinControl
            </h1>
          ) : (
            <>
              <Link to="/">
                <h1 className="flex items-center gap-2 text-xl font-semibold">
                  <Coins />
                  CoinControl
                </h1>
              </Link>
              <nav className="text-muted-foreground ml-2 flex gap-0 text-sm lg:ml-8 lg:gap-10">
                {rotues.map(({ text, url, icon: Icon }) => {
                  return (
                    <ul key={text}>
                      <li>
                        <Link
                          to={url}
                          className="flex items-center gap-2 rounded-md px-3 py-1 transition-all"
                          inactiveProps={{
                            className: 'border border-transparent',
                          }}
                          activeProps={{
                            className: 'text-foreground bg-muted border shadow',
                          }}>
                          <Icon className="size-4" />
                          {text}
                        </Link>
                      </li>
                    </ul>
                  )
                })}
              </nav>
            </>
          )}

          <div className="flex items-center gap-4 md:ml-auto">
            <ThemeSwitcher />
            {!isMobile && (
              <UserDropdown
                side="bottom"
                triggerComponent={
                  <button type="button">
                    <UserAvatar userId="" />
                  </button>
                }
              />
            )}
          </div>
        </header>
        <div className="bg-background flex">
          <main className="w-full p-12 md:rounded-tl-2xl">{children}</main>
          <div className="mt-[100rem]">usun to</div>
        </div>
      </div>
    </div>
  )
}
