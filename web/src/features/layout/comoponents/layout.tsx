import { Link, type ReactNode, useLocation } from '@tanstack/react-router'
import { Coins } from 'lucide-react'
import { useMemo } from 'react'

import { useIsMobile } from '@/components/hooks/use-mobile'
import { UserAvatar } from '@/components/user-avatar'
import { rotues } from '@/constants/routes'
import { MobileNavbar } from '@/features/layout/comoponents/mobile-navbar'
import { ThemeSwitcher } from '@/features/layout/comoponents/theme-switcher'
import { UserDropdown } from '@/features/layout/comoponents/user-dropdown'
import { cn } from '@/lib/utils'

export function Layout({ children }: { children: ReactNode }) {
  const isMobile = useIsMobile()
  const location = useLocation()

  const isVerifyEmailPage = useMemo(
    () => location.pathname.startsWith('/auth/verify-email'),
    [location.pathname],
  )

  return (
    <div className={cn(!isMobile && 'flex', 'bg-background')}>
      <div className={cn('flex w-full flex-col')}>
        <header className="bg-background/60 sticky top-0 z-50 flex h-16 w-full items-center justify-start gap-4 border-b px-4 backdrop-blur-md md:gap-1 lg:gap-12 lg:px-10">
          {isVerifyEmailPage ? (
            <Link to="/">
              <h1 className="flex items-center gap-2 text-xl font-semibold">
                <Coins />
                CoinControl
              </h1>
            </Link>
          ) : (
            <>
              <MobileNavbar />
              {isMobile ? (
                <h1 className="mx-auto flex gap-2">
                  <Coins />
                  CoinControl
                </h1>
              ) : (
                <>
                  <Link to="/">
                    <h1 className="hidden items-center gap-2 text-xl font-semibold md:flex">
                      <Coins />
                      CoinControl
                    </h1>
                  </Link>
                  <nav className="text-muted-foreground ml-2 hidden gap-0 text-sm md:ml-6 md:flex lg:ml-8 lg:gap-10">
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
                                className:
                                  'text-foreground bg-muted border shadow',
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
            </>
          )}

          {isMobile && isVerifyEmailPage ? (
            <div className="ml-auto flex items-center gap-4">
              <ThemeSwitcher />
              <UserDropdown
                side="bottom"
                triggerComponent={
                  <button type="button">
                    <UserAvatar userId="" />
                  </button>
                }
              />
            </div>
          ) : null}

          <div
            className={cn(
              'flex items-center gap-4 md:ml-auto',
              isVerifyEmailPage && isMobile && 'hidden',
            )}>
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
        <main className="min-h-[calc(100dvh-4rem)] w-full p-4 md:rounded-tl-2xl md:p-10">
          {children}
        </main>
      </div>
    </div>
  )
}
