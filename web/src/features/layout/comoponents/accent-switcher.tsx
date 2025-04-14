import {
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu'
import { useThemeStore } from '@/features/layout/comoponents/theme-state'

export const AccentSwitcher = () => {
  const setAccent = useThemeStore((s) => s.setAccent)

  return (
    <DropdownMenuGroup>
      <DropdownMenuSub>
        <DropdownMenuSubTrigger className="gap-2 px-2">
          Accent
        </DropdownMenuSubTrigger>
        <DropdownMenuPortal>
          <DropdownMenuSubContent>
            <DropdownMenuItem onClick={() => setAccent('green')}>
              <div className="flex items-center gap-2">
                <div className="border-reflect size-3 rounded-full bg-[var(--primary-green)]" />
                <span>Green</span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setAccent('blue')}>
              <div className="flex items-center gap-2">
                <div className="border-reflect size-3 rounded-full bg-[var(--primary-blue)]" />
                <span>Blue</span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setAccent('pink')}>
              <div className="flex items-center gap-2">
                <div className="border-reflect size-3 rounded-full bg-[var(--primary-pink)]" />
                <span>Pink</span>
              </div>
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuPortal>
      </DropdownMenuSub>
    </DropdownMenuGroup>
  )
}
