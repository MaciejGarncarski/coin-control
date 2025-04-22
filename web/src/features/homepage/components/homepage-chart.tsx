import type { ReactNode } from '@tanstack/react-router'
import { Info } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts'

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
  transactions: {
    label: 'Transactions',
    color: 'var(--color-primary)',
    icon: Info,
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
    <Card className="border-reflect border-none md:h-[30rem] lg:h-[58dvh]">
      <CardHeader>
        <CardTitle>Transactions Overview</CardTitle>
        <CardDescription>Your transactions from this week</CardDescription>
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

export function ChartHomepage() {
  const overview = useTransactionsOverview()

  if (overview.isLoading) {
    return (
      <ChartCardContainer isLoading>
        <Skeleton className="h-64" />
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
      <ChartContainer config={chartConfig} className="w-full">
        <BarChart
          accessibilityLayer
          data={overview.data || []}
          margin={{
            top: 20,
            bottom: 20,
            left: 25,
            right: 25,
          }}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="day"
            tickLine={false}
            axisLine={false}
            tickMargin={5}
            tickFormatter={(value) => value.slice(0, 3)}
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          <defs>
            <linearGradient id="fillTransactions" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="20%"
                stopColor="var(--color-primary)"
                stopOpacity={0.8}
              />
              <stop
                offset="90%"
                stopColor="var(--color-primary)"
                stopOpacity={0.2}
              />
            </linearGradient>
          </defs>
          <Bar
            dataKey="transactions"
            type="natural"
            fill="url(#fillTransactions)"
            fillOpacity={0.4}
            radius={8}
            stroke="var(--color-desktop)"
          />
        </BarChart>
      </ChartContainer>
    </ChartCardContainer>
  )
}
