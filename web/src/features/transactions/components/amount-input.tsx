import { Minus, Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type AdditionalProps = {
  onReduce: () => void
  onIncrease: () => void
}

export function AmountInput({
  className,
  type,
  onIncrease,
  onReduce,
  value,
  ...props
}: React.ComponentProps<'input'> & AdditionalProps) {
  const inputVal = Number(value || 0) as number

  return (
    <div className="bg-primary/5 border-reflect flex rounded-lg">
      <Button type="button" className="w-12 rounded-r-none" onClick={onReduce}>
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
        className="w-16 rounded-l-none"
        onClick={onIncrease}>
        <Plus className="size-5" />
      </Button>
    </div>
  )
}
