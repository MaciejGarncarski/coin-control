'use client'

import { useNavigate, useSearch } from '@tanstack/react-router'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import * as React from 'react'
import type { DateRange, SelectRangeEventHandler } from 'react-day-picker'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'

export function DatePickerWithRange({
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  const search = useSearch({ from: '/_authenticated/transactions' })

  const [date, setDate] = React.useState<DateRange | undefined>({
    from: search.dateFrom ? new Date(search.dateFrom) : undefined,
    to: search.dateTo ? new Date(search.dateTo) : undefined,
  })
  const navigate = useNavigate({ from: '/transactions' })

  const onSelect: SelectRangeEventHandler = (range) => {
    setDate(range)
    navigate({
      viewTransition: false,
      search: {
        page: search.page,
        dateFrom: range?.from ? format(range.from, 'yyyy-MM-dd') : undefined,
        dateTo: range?.to ? format(range.to, 'yyyy-MM-dd') : undefined,
      },
    })
  }

  return (
    <div className={cn('grid gap-2', className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={'outline'}
            className={cn(
              'w-[15rem] justify-start text-left font-normal',
              !date && 'text-muted-foreground',
            )}>
            <CalendarIcon />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, 'LLL dd, y')} -{' '}
                  {format(date.to, 'LLL dd, y')}
                </>
              ) : (
                format(date.from, 'LLL dd, y')
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={onSelect}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
