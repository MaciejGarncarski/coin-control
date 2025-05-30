import { useQuery } from '@tanstack/react-query'
import {
  DollarSign,
  type LucideIcon,
  TrendingDown,
  TrendingUp,
} from 'lucide-react'
import { Fragment, useMemo } from 'react'

import { TransactionCategoryIcon } from '@/components/transactions/transaction-category-icon'
import { Separator } from '@/components/ui/separator'
import { useStatistics } from '@/features/homepage/api/get-statistics'
import { RecentTransactions } from '@/features/homepage/components/recent-transactions'
import { WeeklyTransactionCountChart } from '@/features/homepage/components/weekly-transaction-count-chart'
import { userQueryOptions } from '@/lib/auth'
import { formatTransactionCategory } from '@/utils/format-transaction-category'

type HomepageTiles = Array<{
  title: string
  icon: LucideIcon
  value: number | string
}>

export const HomePage = () => {
  const user = useQuery(userQueryOptions)
  const stats = useStatistics()

  const homepageTilesData: HomepageTiles = useMemo(
    () => [
      {
        icon: DollarSign,
        title: 'TOTAL BALANCE',
        value: stats.data?.totalBalance.value || 0,
      },
      {
        icon: TrendingUp,
        title: 'MONTHLY INCOME',
        value: stats.data?.thisMonthIncome.value || 0,
      },
      {
        icon: TrendingDown,
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

  if (!user.data) {
    return null
  }

  return (
    <div className="flex flex-col gap-10 md:gap-12" data-testid="homepage">
      <div className="bg-card border-reflect flex flex-col rounded-xl py-2 shadow-xs md:h-40 md:flex-row md:px-4 md:py-4">
        {homepageTilesData.map(({ icon: Icon, title, value }) => {
          return (
            <Fragment key={title}>
              <div className="flex grow items-center gap-4 p-6 md:gap-6">
                <span className="bg-primary/10 border-reflect text-primary flex h-10 w-10 items-center justify-center rounded-full p-2 md:hidden xl:flex">
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
              <Separator
                orientation="horizontal"
                className="bg-primary/30 md:hidden"
              />
              <Separator
                orientation="vertical"
                className="from-primary/10 via-primary/50 to-primary/10 hidden bg-gradient-to-b md:block"
              />
            </Fragment>
          )
        })}
        <div className="flex grow items-center gap-4 p-6 md:gap-6">
          <span className="bg-primary/10 border-reflect text-primary flex h-10 w-10 items-center justify-center rounded-full p-2 md:hidden xl:flex">
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

      <div className="flex grid-cols-7 flex-col gap-12 md:grid">
        <div className="col-start-1 col-end-5">
          <WeeklyTransactionCountChart />
        </div>
        <div className="col-start-5 col-end-8 flex flex-col gap-4">
          <RecentTransactions />
        </div>
      </div>
    </div>
  )
}
