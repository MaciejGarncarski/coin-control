import {
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu'
import { useThemeStore } from '@/features/layout/comoponents/theme-state'
import { cn } from '@/lib/utils'

export const AccentSwitcher = () => {
  const accent = useThemeStore((s) => s.accent)
  const setAccent = useThemeStore((s) => s.setAccent)

  return (
    <DropdownMenuGroup>
      <DropdownMenuSub>
        <DropdownMenuSubTrigger className="gap-2 px-2">
          Accent
        </DropdownMenuSubTrigger>
        <DropdownMenuPortal>
          <DropdownMenuSubContent>
            <DropdownMenuItem
              onClick={() => setAccent('green')}
              className={cn(accent === 'green' && 'bg-primary/20')}>
              <div className="flex items-center gap-2">
                <div className="size-3 rounded-full border bg-[var(--primary-green)]" />
                <span>Green</span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setAccent('blue')}
              className={cn(accent === 'blue' && 'bg-primary/20')}>
              <div className="flex items-center gap-2">
                <div className="size-3 rounded-full border bg-[var(--primary-blue)]" />
                <span>Blue</span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setAccent('pink')}
              className={cn(accent === 'pink' && 'bg-primary/20')}>
              <div className="flex items-center gap-2">
                <div className="size-3 rounded-full border bg-[var(--primary-pink)]" />
                <span>Pink</span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setAccent('red')}
              className={cn(accent === 'red' && 'bg-primary/20')}>
              <div className="flex items-center gap-2">
                <div className="size-3 rounded-full border bg-[var(--primary-red)]" />
                <span>Red</span>
              </div>
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuPortal>
      </DropdownMenuSub>
    </DropdownMenuGroup>
  )
}
