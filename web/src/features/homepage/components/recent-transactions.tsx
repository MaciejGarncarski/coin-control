import { formatRelative } from 'date-fns'
import type { ReactNode } from 'react'

import { TransactionBadge } from '@/components/transactions/transaction-badge'
import { TransactionCategoryIcon } from '@/components/transactions/transaction-category-icon'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useRecentTransactions } from '@/features/homepage/api/get-recent-transactions'
import { NoTransactions } from '@/features/homepage/components/no-transactions'
import { cn } from '@/lib/utils'

const RecentTransactionsCard = ({ children }: { children: ReactNode }) => {
  const recentTransactions = useRecentTransactions()

  return (
    <Card className="border-reflect border-none md:h-[58dvh]">
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
        {!recentTransactions.isError && (
          <span className="text-muted-foreground text-sm">
            You have made{' '}
            {recentTransactions.data?.transactionCountThisMonth || 0}{' '}
            transactions this month.
          </span>
        )}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}

export const RecentTransactions = () => {
  const recentTransactions = useRecentTransactions()

  if (recentTransactions.isLoading) {
    return (
      <RecentTransactionsCard>
        <ul className="flex flex-col gap-4">
          {Array.from({ length: 6 })
            .map((_, i) => i + 1)
            .map((i) => {
              return (
                <li key={i}>
                  <Skeleton className="h-10" />
                </li>
              )
            })}
        </ul>
      </RecentTransactionsCard>
    )
  }

  if (recentTransactions.error) {
    return (
      <RecentTransactionsCard>
        Error occured, try again later.
      </RecentTransactionsCard>
    )
  }

  if (recentTransactions.data?.recentTransactions.length === 0) {
    return (
      <RecentTransactionsCard>
        <NoTransactions />
      </RecentTransactionsCard>
    )
  }

  return (
    <RecentTransactionsCard>
      <ul className="flex flex-col gap-4">
        {recentTransactions.data?.recentTransactions.map(
          ({ transactionId, category, description, amount, date }) => {
            return (
              <li className="flex items-center gap-4" key={transactionId}>
                <TransactionCategoryIcon category={category} tooltipEnabled />
                <div className="flex flex-col">
                  <h3 className="inline max-w-[10ch] truncate overflow-hidden text-sm font-semibold xl:max-w-[28ch]">
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
    </RecentTransactionsCard>
  )
}
