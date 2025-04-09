import { useNavigate } from '@tanstack/react-router'
import { Download } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { DatePickerWithRange } from '@/components/ui/date-range-picker'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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

      <Tabs defaultValue="all" className="flex flex-col gap-4">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <TabsList className="md:w-[22rem]">
            <TabsTrigger value="all">All transactions</TabsTrigger>
            <TabsTrigger value="income">Income</TabsTrigger>
            <TabsTrigger value="expenses">Expenses</TabsTrigger>
          </TabsList>
          <div className="flex flex-col items-center justify-between gap-2 md:flex-row">
            <div>
              <Button type="button" size={'sm'} onClick={resetFilters}>
                Reset filters
              </Button>
            </div>
            <div>
              <DatePickerWithRange />
            </div>
            <div className="w-52">
              <Input placeholder="Search transactions..." type="search" />
            </div>
          </div>
        </div>
        <TabsContent value="all">
          <TransactionsTable />
        </TabsContent>
        <TabsContent value="income">
          <TransactionsTable />
        </TabsContent>
        <TabsContent value="expenses">
          <TransactionsTable />
        </TabsContent>
      </Tabs>
    </div>
  )
}
