import { Link, type ReactNode } from '@tanstack/react-router'
import { DollarSign } from 'lucide-react'

import { useIsMobile } from '@/components/hooks/use-mobile'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
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
        <header className="bg-background/30 sticky top-0 flex h-16 w-full items-center justify-start gap-4 border-b px-4 backdrop-blur-md md:px-12">
          <MobileNavbar />
          {isMobile ? null : (
            <>
              <Link to="/">
                <h1 className="flex items-center gap-2 text-xl font-semibold">
                  <DollarSign />
                  CoinControl
                </h1>
              </Link>
              <nav className="text-muted-foreground ml-8 flex gap-8 text-sm">
                {rotues.map(({ text, url }) => {
                  return (
                    <ul key={text}>
                      <li>
                        <Link
                          to={url}
                          activeProps={{
                            className: 'text-foreground',
                          }}>
                          {text}
                        </Link>
                      </li>
                    </ul>
                  )
                })}
              </nav>
            </>
          )}

          <div className="ml-auto flex items-center gap-4">
            <ThemeSwitcher />
            {!isMobile && (
              <UserDropdown
                side="bottom"
                triggerComponent={
                  <button type="button">
                    <Avatar>
                      <AvatarImage
                        src="https://github.com/shadcn.png"
                        alt="You"
                      />
                    </Avatar>
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
