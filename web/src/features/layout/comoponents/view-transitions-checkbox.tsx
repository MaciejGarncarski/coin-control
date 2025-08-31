import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { usePreferencesStore } from '@/features/layout/stores/preferences-store'

export const ViewTransitionsCheckbox = () => {
  const transitionsEnabled = usePreferencesStore((s) => s.transitionsEnabled)
  const setTransitionsEnabled = usePreferencesStore(
    (s) => s.setTransitionsEnabled,
  )

  return (
    <Button asChild variant={'ghost'} size="sm">
      <Label className="flex justify-between gap-2 px-2 font-normal">
        Transitions
        <Checkbox
          checked={transitionsEnabled}
          onCheckedChange={(data) => setTransitionsEnabled(Boolean(data))}
        />
      </Label>
    </Button>
  )
}
