'use client'

import { useNavigate, useSearch } from '@tanstack/react-router'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import * as React from 'react'
import type { SelectRangeEventHandler } from 'react-day-picker'

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
  const navigate = useNavigate({ from: '/transactions' })
  const from = search.dateFrom ? new Date(search.dateFrom) : undefined
  const to = search.dateTo ? new Date(search.dateTo) : undefined

  const date = {
    from,
    to,
  }

  const onSelect: SelectRangeEventHandler = (range) => {
    navigate({
      viewTransition: false,
      search: {
        page: 1,
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
            size={'sm'}
            className={cn(
              'justify-start text-left font-normal transition-all duration-150',
              !date && 'text-muted-foreground',
              date?.from ? (date.to ? 'w-58' : 'w-32') : 'w-32',
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
            disabled={{
              after: new Date(),
            }}
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={onSelect}
            numberOfMonths={1}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
