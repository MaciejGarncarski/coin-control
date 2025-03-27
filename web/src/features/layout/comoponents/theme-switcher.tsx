import { Moon, Sun, SunMoon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useThemeStore } from '@/features/layout/comoponents/theme-state'

type ThemeSwitcherProps = {
  withText?: boolean
}

export function ThemeSwitcher({ withText = false }: ThemeSwitcherProps) {
  const theme = useThemeStore((s) => s.theme)
  const setTheme = useThemeStore((s) => s.setTheme)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size={withText ? 'sm' : 'icon'}>
          {withText ? <span>Theme</span> : null}

          {theme === 'light' && <Sun className="h-[1.2rem] w-[1.2rem]" />}
          {theme === 'dark' && <Moon className="h-[1.2rem] w-[1.2rem]" />}
          {theme === 'system' && <SunMoon className="h-[1.2rem] w-[1.2rem]" />}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme('light')}>
          <div className="flex items-center gap-2">
            <Sun className="h-[1.2rem] w-[1.2rem]" />
            <span>Light</span>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>
          <div className="flex items-center gap-2">
            <Moon className="h-[1.2rem] w-[1.2rem]" />
            <span>Dark</span>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')}>
          <div className="flex items-center gap-2">
            <SunMoon className="h-[1.2rem] w-[1.2rem]" />
            <span>System</span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
