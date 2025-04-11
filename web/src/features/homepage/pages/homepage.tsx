import { useQuery } from '@tanstack/react-query'
import { DollarSign, type LucideIcon } from 'lucide-react'
import { useMemo } from 'react'

import { TransactionCategoryIcon } from '@/components/transactions/transaction-category-icon'
import { Separator } from '@/components/ui/separator'
import { useStatistics } from '@/features/homepage/api/get-statistics'
import { ChartHomepage } from '@/features/homepage/components/homepage-chart'
import { RecentTransactions } from '@/features/homepage/components/recent-transactions'
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
    <div className="flex flex-col gap-10 md:gap-12">
      <div className="bg-card border-reflect flex flex-col rounded-xl py-2 shadow-xs md:h-32 md:flex-row md:py-4">
        {homepageTilesData.map(({ icon: Icon, title, value }) => {
          return (
            <>
              <div className="flex grow items-center gap-4 p-6">
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
              <Separator orientation="horizontal" className="md:hidden" />
              <Separator orientation="vertical" className="hidden md:block" />
            </>
          )
        })}
        <div className="flex grow items-center gap-4 p-6">
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
          <ChartHomepage />
        </div>
        <div className="col-start-5 col-end-8 flex flex-col gap-4">
          <RecentTransactions />
        </div>
      </div>
    </div>
  )
}
