import { useNavigate } from '@tanstack/react-router'
import { Download, X } from 'lucide-react'
import { useState } from 'react'
import { useDebouncedCallback } from 'use-debounce'

import { Button } from '@/components/ui/button'
import { DatePickerWithRange } from '@/components/ui/date-range-picker'
import { Input } from '@/components/ui/input'
import { TransactionCategoryFilter } from '@/features/transactions/components/transaction-category-filter'
import { TransactionsForm } from '@/features/transactions/components/transactions-form'
import { TransactionsTable } from '@/features/transactions/components/transactions-table'

export const TransactionsPage = () => {
  const [inputVal, setInputVal] = useState<string>('')

  const debounced = useDebouncedCallback(
    (value) => {
      if (value.trim() === '') {
        navigate({
          viewTransition: false,
          search: (prev) => ({
            page: prev.page,
            dateFrom: prev.dateFrom,
            dateTo: prev.dateTo,
          }),
        })
        return
      }

      navigate({
        viewTransition: false,
        search: (prev) => ({
          ...prev,
          page: 1,
          search: value,
        }),
      })
    },
    500,
    { maxWait: 2000 },
  )

  const navigate = useNavigate({ from: '/transactions' })

  const resetFilters = () => {
    navigate({
      viewTransition: false,
      search: {
        page: 1,
      },
    })
    setInputVal('')
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col items-center justify-start gap-4 md:flex-row">
        <div className="text-center md:text-left">
          <h2 className="text-2xl font-bold md:text-3xl">Transactions</h2>
          <p className="text-muted-foreground">
            View and manage all your financial transactions.
          </p>
        </div>

        <div className="flex gap-4 md:ml-auto">
          <Button type="button" variant={'outline'}>
            <Download /> Export
          </Button>
          <TransactionsForm />
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex flex-col items-center justify-center gap-4 md:flex-row md:justify-start">
            <div className="flex flex-row gap-4">
              <Input
                placeholder="Search transactions..."
                type="search"
                value={inputVal}
                onChange={(e) => {
                  debounced(e.target.value)
                  setInputVal(e.target.value)
                }}
                className="h-8 w-52"
              />
              <Button
                type="button"
                size={'sm'}
                variant={'outline'}
                onClick={resetFilters}>
                <X />
                Reset
              </Button>
            </div>
            <div>
              <DatePickerWithRange />
            </div>
            <div>
              <TransactionCategoryFilter />
            </div>
          </div>
        </div>

        <TransactionsTable />
      </div>
    </div>
  )
}
