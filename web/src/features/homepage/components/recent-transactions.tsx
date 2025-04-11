import { formatRelative } from 'date-fns'

import { TransactionBadge } from '@/components/transactions/transaction-badge'
import { TransactionCategoryIcon } from '@/components/transactions/transaction-category-icon'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useRecentTransactions } from '@/features/homepage/api/get-recent-transactions'
import { cn } from '@/lib/utils'

export const RecentTransactions = () => {
  const recentTransactions = useRecentTransactions()

  return (
    <Card className="border-reflect border-none md:h-[58dvh]">
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
        <span className="text-muted-foreground text-sm">
          You have made{' '}
          {recentTransactions.data?.transactionCountThisMonth || 0} transactions
          this month.
        </span>
      </CardHeader>
      <CardContent>
        <ul className="flex flex-col gap-4">
          {recentTransactions.isLoading
            ? Array.from({ length: 6 })
                .map((_, i) => i + 1)
                .map((i) => {
                  return (
                    <li key={i}>
                      <Skeleton className="h-10" />
                    </li>
                  )
                })
            : null}

          {recentTransactions.data?.recentTransactions.map(
            ({ transactionId, category, description, amount, date }) => {
              return (
                <li className="flex items-center gap-4" key={transactionId}>
                  <TransactionCategoryIcon category={category} tooltipEnabled />
                  <div className="flex flex-col">
                    <h3 className="max-w-[20ch] overflow-hidden text-sm font-semibold overflow-ellipsis">
                      {description}
                    </h3>
                    <p className="text-muted-foreground text-xs">
                      {formatRelative(date, new Date())}
                    </p>
                  </div>

                  <div className="ml-auto flex flex-col items-end">
                    <p
                      className={cn(
                        amount > 0 ? 'text-green-600' : 'text-red-600',
                      )}>
                      {amount > 0 ? `+${amount}` : amount}
                    </p>

                    <TransactionBadge category={category} />
                  </div>
                </li>
              )
            },
          )}
        </ul>
      </CardContent>
    </Card>
  )
}
