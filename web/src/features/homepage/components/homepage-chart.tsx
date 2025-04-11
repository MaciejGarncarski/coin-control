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
const chartData = [
  { day: 'Monday', transactions: 186 },
  { day: 'Tuesday', transactions: 305 },
  { day: 'Wendsay', transactions: 237 },
  { day: 'Thursday', transactions: 73 },
  { day: 'Friday', transactions: 209 },
  { day: 'Saturday', transactions: 214 },
  { day: 'Sunday', transactions: 214 },
]

const chartConfig = {
  transactions: {
    label: 'Transactions',
    color: 'var(--color-primary)',
    icon: Info,
  },
} satisfies ChartConfig

export function ChartHomepage() {
  return (
    <Card className="border-reflect border-none md:h-[58dvh]">
      <CardHeader>
        <CardTitle>Transactions Overview</CardTitle>
        <CardDescription>Your transactions from last week</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
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
      </CardContent>
    </Card>
  )
}
