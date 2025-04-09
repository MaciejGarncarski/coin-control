import { useNavigate } from '@tanstack/react-router'
import { Download, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { DatePickerWithRange } from '@/components/ui/date-range-picker'
import { Input } from '@/components/ui/input'
import { TransactionsForm } from '@/features/transactions/components/transactions-form'
import { TransactionsTable } from '@/features/transactions/components/transactions-table'

export const TransactionsPage = () => {
  const navigate = useNavigate({ from: '/transactions' })

  const resetFilters = () => {
    navigate({
      search: {
        page: 1,
      },
    })
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
          <div className="flex flex-row gap-4">
            <Input
              placeholder="Search transactions..."
              type="search"
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
            <div>
              <DatePickerWithRange />
            </div>
          </div>
        </div>

        <TransactionsTable />
      </div>
    </div>
  )
}
