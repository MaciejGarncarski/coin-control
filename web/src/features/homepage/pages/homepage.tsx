import { useQuery } from '@tanstack/react-query'
import { formatRelative } from 'date-fns'
import { DollarSign, type LucideIcon } from 'lucide-react'
import { useMemo } from 'react'

import { TransactionBadge } from '@/components/transactions/transaction-badge'
import { TransactionCategoryIcon } from '@/components/transactions/transaction-category-icon'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { useRecentTransactions } from '@/features/homepage/api/get-recent-transactions'
import { useStatistics } from '@/features/homepage/api/get-statistics'
import { userQueryOptions } from '@/lib/auth'
import { cn } from '@/lib/utils'
import { formatTransactionCategory } from '@/utils/format-transaction-category'

type HomepageTiles = Array<{
  title: string
  icon: LucideIcon
  value: number | string
}>

export const HomePage = () => {
  const user = useQuery(userQueryOptions)
  const stats = useStatistics()
  const recentTransactions = useRecentTransactions()

  const homepageTilesData: HomepageTiles = useMemo(
    () => [
      {
        icon: DollarSign,
        title: 'TOTAL BALANCE',
        value: stats.data?.totalBalance.value || 0,
      },
      {
        icon: DollarSign,
        title: 'MONTHLY INCOME',
        value: stats.data?.thisMonthIncome.value || 0,
      },
      {
        icon: DollarSign,
        title: 'MONTHLY SPENDING',
        value: stats.data?.thisMonthSpending.value || 0,
      },
    ],
    [
      stats.data?.thisMonthIncome.value,
      stats.data?.thisMonthSpending.value,
      stats.data?.totalBalance.value,
    ],
  )

  if (!user.data?.id) {
    return null
  }

  return (
    <div className="flex flex-col gap-10">
      <div className="bg-card flex flex-col rounded-xl border py-2 shadow-xs md:h-32 md:flex-row md:py-4">
        {homepageTilesData.map(({ icon: Icon, title, value }) => {
          return (
            <>
              <div className="flex grow items-center gap-4 p-6">
                <span className="bg-primary/20 border-primary text-primary flex h-10 w-10 items-center justify-center rounded-full border p-2 md:hidden xl:flex">
                  <Icon />
                </span>
                <div className="flex flex-col gap-0">
                  <span className="text-muted-foreground spacing text-sm font-semibold tracking-wide lg:tracking-widest">
                    {title}
                  </span>
                  <span className="spacing text-xl font-bold tracking-widest">
                    {value}
                  </span>
                </div>
              </div>
              <Separator orientation="horizontal" className="md:hidden" />
              <Separator orientation="vertical" className="hidden md:block" />
            </>
          )
        })}
        <div className="flex grow items-center gap-4 p-6">
          <span className="bg-primary/20 border-primary text-primary flex h-10 w-10 items-center justify-center rounded-full border p-2 md:hidden xl:flex">
            <TransactionCategoryIcon
              variant="big"
              category={stats.data?.mostCommonCategoryThisMonth || 'other'}
            />
          </span>
          <div className="flex flex-col gap-0">
            <span className="text-muted-foreground spacing text-sm font-semibold tracking-wide lg:tracking-widest">
              COMMON CATEGORY
            </span>
            <span className="spacing text-xl font-bold tracking-widest">
              {formatTransactionCategory(
                stats.data?.mostCommonCategoryThisMonth || 'other',
              )}
            </span>
          </div>
        </div>
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
                        <TransactionCategoryIcon
                          category={category}
                          tooltipEnabled
                        />
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
