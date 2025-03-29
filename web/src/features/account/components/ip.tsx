import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type Props = {
  ip: string
}

export const SessionIP = ({ ip }: Props) => {
  const [isShown, setIsShown] = useState(false)

  return (
    <div className="flex items-center justify-center gap-2 md:justify-start">
      <span className="text-foreground">IP:</span>
      <span
        className={cn(
          isShown ? 'text-red-500' : 'text-muted-foreground opacity-80',
          'bg-background flex h-6 w-30 items-center justify-center rounded shadow transition-opacity',
        )}>
        {isShown ? ip : 'hidden'}
      </span>
      <Button
        type="button"
        variant={'ghost'}
        size="sm"
        onClick={() => setIsShown((prev) => !prev)}>
        {isShown ? <EyeOff /> : <Eye />}
      </Button>
    </div>
  )
}
