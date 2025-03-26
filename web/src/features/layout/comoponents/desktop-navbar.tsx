import { Link } from '@tanstack/react-router'

import { useIsMobile } from '@/components/hooks/use-mobile'
import { LogoutButton } from '@/components/logout-button'

export function DesktopNavbar() {
  const isMobile = useIsMobile()

  if (isMobile) return null

  return (
    <nav className="bg-background flex h-[calc(100dvh_-_4rem)] w-64 flex-col p-4">
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/account">account</Link>
        </li>
      </ul>

      <div className="mt-auto">
        <LogoutButton />
      </div>
    </nav>
  )
}
