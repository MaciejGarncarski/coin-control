import { BiggestTransactionCard } from '@/features/analytics/components/biggest-transaction-card'
import { CategoriesChart } from '@/features/analytics/components/categories-chart'
import { TransactionsByMonthChart } from '@/features/analytics/components/transactions-by-month-chart'

export const AnalyticsPage = () => {
  return (
    <div className="flex grid-cols-2 flex-col gap-4 md:grid md:gap-10">
      <CategoriesChart />
      <BiggestTransactionCard />
      <div className="col-start-1 col-end-3">
        <TransactionsByMonthChart />
      </div>
    </div>
  )
}
