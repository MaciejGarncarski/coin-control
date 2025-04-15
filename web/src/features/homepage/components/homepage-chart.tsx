import type { ReactNode } from '@tanstack/react-router'
import { Info } from 'lucide-react'
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
  transactions: {
    label: 'Transactions',
    color: 'var(--color-primary)',
    icon: Info,
  },
} satisfies ChartConfig

const ChartCardContainer = ({
  children,
  isLoading = false,
}: {
  children: ReactNode
  isLoading?: boolean
}) => {
  return (
    <Card className="border-reflect border-none md:h-[30rem] lg:h-[58dvh]">
      <CardHeader>
        <CardTitle>Transactions Overview</CardTitle>
        <CardDescription>Your transactions from last week</CardDescription>
      </CardHeader>
      <CardContent className={cn(!isLoading && 'px-0')}>{children}</CardContent>
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
      <ChartCardContainer>Error occured, try again later.</ChartCardContainer>
    )
  }

  if (overview.data?.data.length === 0) {
    return (
      <ChartCardContainer>
        <NoTransactions />
      </ChartCardContainer>
    )
  }

  return (
    <ChartCardContainer>
      <ChartContainer config={chartConfig}>
        <AreaChart
          accessibilityLayer
          data={overview.data?.data || []}
          margin={{
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
          <Area
            dataKey="transactions"
            type="natural"
            fill="url(#fillTransactions)"
            fillOpacity={0.4}
            stroke="var(--color-desktop)"
            stackId="a"
          />
        </AreaChart>
      </ChartContainer>
    </ChartCardContainer>
  )
}
