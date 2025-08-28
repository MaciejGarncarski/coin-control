import { Minus, Plus } from 'lucide-react'
import type { ComponentProps } from 'react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type Props = {
  onReduce: () => void
  onIncrease: () => void
}

export function AmountInput({
  className,
  onIncrease,
  onReduce,
  value,
  ...props
}: ComponentProps<'input'> & Props) {
  const inputVal = Number(value || 0) as number

  return (
    <div className="bg-primary/5 border-reflect flex rounded-lg">
      <Button
        type="button"
        className="w-16 touch-manipulation rounded-r-none"
        onClick={onReduce}>
        <Minus className="size-5" />
      </Button>
      <input
        type={'number'}
        data-slot="input"
        value={value}
        className={cn(
          'm-0 w-full text-center font-semibold',
          inputVal < 0 && 'text-red-700',
          inputVal > 0 && 'text-green-700',
          className,
        )}
        {...props}
      />
      <Button
        type="button"
        className="w-16 touch-manipulation rounded-l-none"
        onClick={onIncrease}>
        <Plus className="size-5" />
      </Button>
    </div>
  )
}
