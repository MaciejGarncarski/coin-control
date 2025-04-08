import { Download } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { TransactionsForm } from '@/features/transactions/components/transactions-form'
import { TransactionsTable } from '@/features/transactions/components/transactions-table'

export const TransactionsPage = () => {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-row items-center justify-start">
        <div>
          <h2 className="text-3xl font-bold">Transactions</h2>
          <p>View and manage all your financial transactions.</p>
        </div>

        <div className="ml-auto flex gap-4">
          <Button type="button" variant={'secondary'}>
            <Download /> Export
          </Button>
          <TransactionsForm />
        </div>
      </div>

      <TransactionsTable />
    </div>
  )
}
