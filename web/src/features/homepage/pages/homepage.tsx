import { useQuery } from '@tanstack/react-query'
import { formatRelative } from 'date-fns'
import { DollarSign, Folder, TrendingDown, TrendingUp } from 'lucide-react'

import { TransactionBadge } from '@/components/transactions/transaction-badge'
import { TransactionCategoryIcon } from '@/components/transactions/transaction-category-icon'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useRecentTransactions } from '@/features/homepage/api/get-recent-transactions'
import { useStatistics } from '@/features/homepage/api/get-statistics'
import { userQueryOptions } from '@/lib/auth'
import { cn } from '@/lib/utils'

export const HomePage = () => {
  const user = useQuery(userQueryOptions)
  const stats = useStatistics()
  const recentTransactions = useRecentTransactions()

  if (!user.data?.id) {
    return null
  }

  return (
    <div className="flex flex-col gap-10">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-4 xl:grid-cols-4 xl:gap-10">
        <Card className="gap-3">
          <CardHeader className="flex flex-row items-center justify-between">
            <h2 className="text-sm font-semibold">Total balance</h2>
            <DollarSign className="text-muted-foreground size-5" />
          </CardHeader>
          <CardContent>
            {stats.isLoading ? (
              <Skeleton className="h-12" />
            ) : (
              <>
                <p className="text-2xl font-bold">
                  {stats.data?.totalBalance.value}
                </p>
              </>
            )}
          </CardContent>
        </Card>
        <Card className="gap-3">
          <CardHeader className="flex flex-row items-center justify-between">
            <h2 className="text-sm font-semibold">Monthly Spending</h2>
            <TrendingUp className="text-muted-foreground size-5" />
          </CardHeader>
          <CardContent>
            {stats.isLoading ? (
              <Skeleton className="h-12" />
            ) : (
              <>
                <p className="text-2xl font-bold">
                  {stats.data?.thisMonthSpending.value}
                </p>
                <p className="text-muted-foreground text-xs">
                  {stats.data?.totalBalance.changeFromLastMonth}% from last
                  month
                </p>
              </>
            )}
          </CardContent>
        </Card>
        <Card className="gap-3">
          <CardHeader className="flex flex-row items-center justify-between">
            <h2 className="text-sm font-semibold">Monthly Income</h2>
            <TrendingDown className="text-muted-foreground size-5" />
          </CardHeader>
          <CardContent>
            {stats.isLoading ? (
              <Skeleton className="h-12" />
            ) : (
              <>
                <p className="text-2xl font-bold">
                  {stats.data?.thisMonthIncome.value}
                </p>
                <p className="text-muted-foreground text-xs">
                  {stats.data?.totalBalance.changeFromLastMonth}% from last
                  month
                </p>
              </>
            )}
          </CardContent>
        </Card>
        <Card className="gap-3">
          <CardHeader className="flex flex-row items-center justify-between">
            <h2 className="text-sm font-semibold">Most common category</h2>
            <Folder className="text-muted-foreground size-5" />
          </CardHeader>
          <CardContent>
            {stats.isLoading ? (
              <Skeleton className="h-12" />
            ) : (
              <div className="flex items-center gap-4">
                <TransactionCategoryIcon
                  category={stats.data?.mostCommonCategoryThisMonth || 'other'}
                />
                <p className="text-2xl font-semibold capitalize">
                  {stats.data?.mostCommonCategoryThisMonth || 'other'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="flex grid-cols-7 flex-col gap-10 md:grid">
        <Card className="col-start-1 col-end-5">
          <CardHeader>Spending Overview</CardHeader>
        </Card>

        <div className="col-start-5 col-end-8 flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent transactions</CardTitle>
              <span className="text-muted-foreground text-sm">
                You have made{' '}
                {recentTransactions.data?.transactionCountThisMonth || 0}{' '}
                transactions this month.
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
                      <li
                        className="flex items-center gap-4"
                        key={transactionId}>
                        <TransactionCategoryIcon category={category} />
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
        </div>
      </div>
    </div>
  )
}
