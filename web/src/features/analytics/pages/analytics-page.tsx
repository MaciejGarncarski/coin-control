import { CategoriesChart } from '@/features/analytics/components/categories-chart'
import { TransactionsByMonthChart } from '@/features/analytics/components/transactions-by-month-chart'

export const AnalyticsPage = () => {
  return (
    <div className="flex grid-cols-2 flex-col gap-4 md:grid md:gap-10">
      <CategoriesChart />
      <CategoriesChart />
      <div className="col-start-1 col-end-3">
        <TransactionsByMonthChart />
      </div>
    </div>
  )
}
