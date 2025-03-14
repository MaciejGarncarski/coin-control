import { DesktopNavbar } from '@/features/layout/comoponents/desktop-navbar'
import { MobileNavbar } from '@/features/layout/comoponents/mobile-navbar'
import { ThemeSwitcher } from '@/features/layout/comoponents/theme-switcher'
import { type ReactNode } from '@tanstack/react-router'
import { Coins } from 'lucide-react'

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div>
      <header className="bg-background flex h-16 w-full items-center justify-start gap-4 px-4 md:px-10 md:pl-64">
        <MobileNavbar />

        <h1 className="hidden gap-2 md:flex">
          <Coins />
          CoinControl
        </h1>

        <div className="ml-auto">
          <ThemeSwitcher />
        </div>
      </header>
      <div className="bg-background flex">
        <DesktopNavbar />
        <main className="bg-muted h-[calc(100vh_-_8rem)] w-full md:rounded-l-2xl md:border">
          {children}
        </main>
      </div>
      <footer className="bg-background">
        <p>test </p>
      </footer>
    </div>
  )
}
