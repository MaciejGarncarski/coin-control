import type { ReactNode } from '@tanstack/react-router'
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts'

import { useIsMobile } from '@/components/hooks/use-mobile'
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
import { useTransactionsByMonth } from '@/features/analytics/api/get-transactions-by-month'
import { NoTransactions } from '@/features/homepage/components/no-transactions'
import { cn } from '@/lib/utils'

const chartConfig = {
  income: {
    label: 'Income',
    color: 'hsl(var(--chart-1))',
  },
  expense: {
    label: 'Expense',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig

const ChartCardContainer = ({
  children,
  isLoading = false,
  isError = false,
}: {
  children: ReactNode
  isLoading?: boolean
  isError?: boolean
}) => {
  return (
    <Card className="border-reflect border-none md:h-[30rem] lg:h-[30rem]">
      <CardHeader>
        <CardTitle>Transactions by month</CardTitle>
        <CardDescription>Entire year of your transactions</CardDescription>
      </CardHeader>
      <CardContent
        className={cn(
          !isLoading && !isError && 'px-0',
          'flex h-full w-full items-center justify-center',
        )}>
        {children}
      </CardContent>
    </Card>
  )
}

export function TransactionsByMonthChart() {
  const transactions = useTransactionsByMonth()
  const isMobile = useIsMobile()

  if (transactions.isLoading) {
    return (
      <ChartCardContainer isLoading>
        <Skeleton className="h-80 w-full" />
      </ChartCardContainer>
    )
  }

  if (transactions.error) {
    return (
      <ChartCardContainer isError>
        <p className="text-muted-foreground flex h-full items-center justify-center text-center">
          Error occured, try again later.
        </p>
      </ChartCardContainer>
    )
  }

  if (transactions.data?.data.length === 0) {
    return (
      <ChartCardContainer>
        <NoTransactions />
      </ChartCardContainer>
    )
  }

  return (
    <ChartCardContainer>
      <ChartContainer
        config={chartConfig}
        className="aspect-auto h-[10rem] w-full md:h-[95%]">
        <AreaChart
          margin={
            isMobile
              ? {
                  left: 10,
                  right: 10,
                }
              : {
                  top: 0,
                  bottom: 0,
                  left: 50,
                  right: 50,
                }
          }
          data={transactions.data?.data}>
          <defs>
            <linearGradient id="incomeFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--chart-2)" stopOpacity={0.8} />
              <stop offset="95%" stopColor="var(--chart-2)" stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="fill" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="var(--color-primary)"
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor="var(--color-primary)"
                stopOpacity={0.1}
              />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            minTickGap={32}
            tickMargin={isMobile ? 5 : 8}
            tickFormatter={(value) => value.slice(0, 3)}
          />
          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
          <Area
            dataKey="expense"
            type="natural"
            fill="url(#fill)"
            stroke="var(--color-primary)"
            stackId="a"
          />
          <Area
            dataKey="income"
            type="natural"
            fill="url(#incomeFill)"
            stroke="var(--chart-2)"
            stackId="a"
          />
        </AreaChart>
      </ChartContainer>
    </ChartCardContainer>
  )
}
