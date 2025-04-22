import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from 'recharts'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { useCategoriesAnalytics } from '@/features/analytics/api/get-categories'

const chartConfig = {
  category: {
    label: 'Category',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig

export const CategoriesChart = () => {
  const categories = useCategoriesAnalytics()

  return (
    <Card className="border-reflect border-0">
      <CardHeader className="items-center">
        <CardTitle>Category Comparison</CardTitle>
      </CardHeader>
      <CardContent className="pb-0">
        <ChartContainer config={chartConfig} className="mx-auto max-h-[200px]">
          <RadarChart
            data={categories.data || []}
            margin={{
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
            }}>
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <PolarAngleAxis dataKey="category" />
            <PolarGrid />
            <Radar
              dataKey="value"
              fill="var(--color-primary)"
              fillOpacity={0.6}
              dot={{
                r: 5,
                fillOpacity: 1,
              }}
            />
          </RadarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
