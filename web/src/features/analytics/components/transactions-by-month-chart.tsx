import type { ReactNode } from '@tanstack/react-router'
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts'

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
import { useTransactionsOverview } from '@/features/homepage/api/get-overview'
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

const mockedData = [
  {
    month: 'January',
    income: 4500,
    expense: 3800,
  },
  {
    month: 'February',
    income: 4800,
    expense: 4100,
  },
  {
    month: 'March',
    income: 5100,
    expense: 4000,
  },
  {
    month: 'April',
    income: 4950,
    expense: 4250,
  },
  {
    month: 'May',
    income: 5300,
    expense: 4500,
  },
  {
    month: 'June',
    income: 5500,
    expense: 4800,
  },
  {
    month: 'July',
    income: 5200,
    expense: 4900, // Summer vacation costs?
  },
  {
    month: 'August',
    income: 5400,
    expense: 4700,
  },
  {
    month: 'September',
    income: 5000,
    expense: 4300,
  },
  {
    month: 'October',
    income: 5150,
    expense: 4450,
  },
  {
    month: 'November',
    income: 5600, // Holiday bonus?
    expense: 4600,
  },
  {
    month: 'December',
    income: 6000, // Holiday bonus/gifts?
    expense: 5500, // Holiday spending?
  },
]

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
    <Card className="border-reflect border-none md:h-[30rem] lg:h-[35rem]">
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
  const overview = useTransactionsOverview()

  if (overview.isLoading) {
    return (
      <ChartCardContainer isLoading>
        <Skeleton className="h-80 w-full" />
      </ChartCardContainer>
    )
  }

  if (overview.error) {
    return (
      <ChartCardContainer isError>
        <p className="text-muted-foreground flex h-full items-center justify-center text-center">
          Error occured, try again later.
        </p>
      </ChartCardContainer>
    )
  }

  if (overview.data?.length === 0) {
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
        className="aspect-auto h-[95%] w-full">
        <AreaChart
          margin={{
            top: 0,
            bottom: 0,
            left: 50,
            right: 50,
          }}
          data={mockedData}>
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
            tickMargin={8}
            minTickGap={32}
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
