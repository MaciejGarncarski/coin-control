import type { ReactNode } from 'react'
import { Pie, PieChart } from 'recharts'

import { TransactionCategoryIcon } from '@/components/transactions/transaction-category-icon'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { Skeleton } from '@/components/ui/skeleton'
import { useCategoriesAnalytics } from '@/features/analytics/api/get-categories'
import { formatTransactionCategory } from '@/utils/format-transaction-category'

const chartConfig = {
  foodAndDrink: {
    label: formatTransactionCategory('foodAndDrink'),
    icon: () => (
      <TransactionCategoryIcon category="foodAndDrink" variant="small" />
    ),
  },
  groceries: {
    label: formatTransactionCategory('groceries'),
    icon: () => (
      <TransactionCategoryIcon category="groceries" variant="small" />
    ),
  },
  housing: {
    label: formatTransactionCategory('housing'),
    icon: () => <TransactionCategoryIcon category="housing" variant="small" />,
  },
  transportation: {
    label: formatTransactionCategory('transportation'),
    icon: () => (
      <TransactionCategoryIcon category="transportation" variant="small" />
    ),
  },
  utilities: {
    label: formatTransactionCategory('utilities'),
    icon: () => (
      <TransactionCategoryIcon category="utilities" variant="small" />
    ),
  },
  other: {
    label: formatTransactionCategory('other'),
    icon: () => <TransactionCategoryIcon category="other" variant="small" />,
  },
  income: {
    label: formatTransactionCategory('income'),
    icon: () => <TransactionCategoryIcon category="income" variant="small" />,
  },
  shopping: {
    label: formatTransactionCategory('shopping'),
    icon: () => <TransactionCategoryIcon category="shopping" variant="small" />,
  },
} satisfies ChartConfig

const CategoriesChartContainer = ({ children }: { children: ReactNode }) => {
  return (
    <Card className="border-reflect border-0">
      <CardHeader className="items-start">
        <CardTitle>Category Comparison</CardTitle>
        <CardDescription>
          Chart for checking out categories of transactions.
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-0">{children}</CardContent>
    </Card>
  )
}

export const CategoriesChart = () => {
  const categories = useCategoriesAnalytics()

  if (categories.isLoading) {
    return (
      <CategoriesChartContainer>
        <Skeleton className="h-50" />
      </CategoriesChartContainer>
    )
  }

  if (categories.isError) {
    return (
      <CategoriesChartContainer>
        <p className="text-muted-foreground flex h-50 items-center justify-center text-center">
          Error occured. Try again later.
        </p>
      </CategoriesChartContainer>
    )
  }

  if (categories.data?.length === 0) {
    return (
      <CategoriesChartContainer>
        <p className="text-muted-foreground flex h-50 items-center justify-center text-center">
          Not enough data.
        </p>
      </CategoriesChartContainer>
    )
  }

  return (
    <CategoriesChartContainer>
      <ChartContainer config={chartConfig} className="mx-auto max-h-[200px]">
        <PieChart>
          <ChartTooltip content={<ChartTooltipContent hideLabel />} />
          <defs>
            <linearGradient id="fill" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="var(--color-primary)"
                stopOpacity={0.5}
              />
            </linearGradient>
          </defs>
          <Pie
            fill="url(#fill)"
            stroke="var(--color-accent)"
            data={categories.data || []}
            dataKey="value"
            label
            nameKey="category"
          />
        </PieChart>
      </ChartContainer>
    </CategoriesChartContainer>
  )
}
