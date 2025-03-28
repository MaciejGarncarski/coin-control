import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { DollarSign, TrendingDown, TrendingUp } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { userQueryOptions } from '@/lib/auth'

export const Route = createFileRoute('/_authenticated/')({
  component: App,
})

function App() {
  const user = useQuery(userQueryOptions)

  if (!user.data?.id) {
    return null
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-4 xl:grid-cols-4 xl:gap-10">
        <Card className="gap-3">
          <CardHeader className="flex flex-row items-center justify-between">
            <h2 className="text-sm font-semibold">Total balance</h2>
            <DollarSign className="text-muted-foreground size-5" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">$5,231.89</p>
            <p className="text-muted-foreground text-xs">
              +10% from last month
            </p>
          </CardContent>
        </Card>
        <Card className="gap-3">
          <CardHeader className="flex flex-row items-center justify-between">
            <h2 className="text-sm font-semibold">Monthly Spending</h2>
            <TrendingUp className="text-muted-foreground size-5" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">$5,231.89</p>
            <p className="text-muted-foreground text-xs">
              +10% from last month
            </p>
          </CardContent>
        </Card>
        <Card className="gap-3">
          <CardHeader className="flex flex-row items-center justify-between">
            <h2 className="text-sm font-semibold">Monthly Income</h2>
            <TrendingDown className="text-muted-foreground size-5" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">$5,231.89</p>
            <p className="text-muted-foreground text-xs">
              +10% from last month
            </p>
          </CardContent>
        </Card>
        <Card className="gap-3">
          <CardHeader className="flex flex-row items-center justify-between">
            <h2 className="text-sm font-semibold">Total balance</h2>
            <DollarSign className="text-muted-foreground size-5" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">$5,231.89</p>
            <p className="text-muted-foreground text-xs">
              +10% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-7 gap-4">
        <Tabs
          defaultValue="overview"
          className="col-start-1 col-end-5 flex flex-col gap-4">
          <TabsList className="md:w-[25rem]">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <Card>
              <CardHeader>Spending Overview</CardHeader>
            </Card>
          </TabsContent>
          <TabsContent value="analytics">
            Change your password here.
          </TabsContent>
        </Tabs>

        <div className="col-start-5 col-end-8 flex flex-col gap-4">
          <Button className="ml-auto" type="button">
            Export data
          </Button>
          <Card>
            <CardHeader>Spending Overview</CardHeader>
          </Card>
        </div>
      </div>
    </div>
  )
}
