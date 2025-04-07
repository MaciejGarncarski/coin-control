import { Link, type ReactNode, useLocation } from '@tanstack/react-router'
import { useMemo } from 'react'

import { useIsMobile } from '@/components/hooks/use-mobile'
import { Logo } from '@/components/logo'
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
        <header className="bg-background/60 sticky top-0 z-50 flex h-16 w-full items-center justify-between gap-4 border-b px-4 backdrop-blur-md md:justify-start md:gap-1 lg:gap-12 lg:px-10">
          {isVerifyEmailPage ? (
            <Link to="/">
              <Logo />
            </Link>
          ) : (
            <>
              <MobileNavbar />
              {isMobile ? (
                <div className="flex w-full items-center justify-center">
                  <Logo />
                </div>
              ) : (
                <>
                  <Link to="/">
                    <Logo />
                  </Link>
                  <nav className="text-muted-foreground hidden w-full text-sm md:ml-6 md:block lg:ml-10">
                    <ul className="flex items-center justify-center gap-2 lg:justify-start lg:gap-10">
                      {rotues.map(({ text, url, icon: Icon }) => {
                        return (
                          <li key={text}>
                            <Link
                              to={url}
                              viewTransition={{ types: ['main-transition'] }}
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
                        )
                      })}
                    </ul>
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
                    <UserAvatar />
                  </button>
                }
              />
            </div>
          ) : null}

          <div
            className={cn(
              'flex items-center gap-4 [view-transition-name:logos] md:ml-auto',
              isVerifyEmailPage && isMobile && 'hidden',
            )}>
            <ThemeSwitcher />
            {!isMobile && (
              <UserDropdown
                side="bottom"
                triggerComponent={
                  <button type="button">
                    <UserAvatar />
                  </button>
                }
              />
            )}
          </div>
        </header>
        <main className="mx-auto min-h-[calc(100dvh-4rem)] w-full p-6 [view-transition-name:content] md:container md:rounded-tl-2xl lg:p-10">
          {children}
        </main>
      </div>
    </div>
  )
}
