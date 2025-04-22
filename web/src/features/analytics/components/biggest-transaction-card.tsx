import { Link } from '@tanstack/react-router'
import type { ReactNode } from 'react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useLargestIncomeExpense } from '@/features/analytics/api/get-largest-income-expense'

const BiggestTransactionCardContainer = ({
  children,
}: {
  children: ReactNode
}) => {
  return (
    <Card className="border-reflect border-0">
      <CardHeader className="items-start">
        <CardTitle>Your biggest expense and income</CardTitle>
      </CardHeader>
      <CardContent className="h-full pb-0">{children}</CardContent>
    </Card>
  )
}

export const BiggestTransactionCard = () => {
  const transactions = useLargestIncomeExpense()

  if (transactions.isLoading) {
    return (
      <BiggestTransactionCardContainer>
        <Skeleton className="h-50" />
      </BiggestTransactionCardContainer>
    )
  }

  if (transactions.isError) {
    return (
      <BiggestTransactionCardContainer>
        <p className="text-muted-foreground flex h-50 items-center justify-center text-center">
          Error occured. Try again later.
        </p>
      </BiggestTransactionCardContainer>
    )
  }

  if (
    transactions.data?.expense === null &&
    transactions.data.income === null
  ) {
    return (
      <BiggestTransactionCardContainer>
        <p className="text-muted-foreground flex h-50 items-center justify-center text-center">
          Not enough data.
        </p>
      </BiggestTransactionCardContainer>
    )
  }

  return (
    <BiggestTransactionCardContainer>
      <div className="flex h-full flex-col items-center justify-center gap-6 text-center md:flex-row xl:gap-20">
        <div className="flex flex-col gap-1">
          <h2 className="text-muted-foreground">Largest income</h2>
          <Link
            to={'/transactions'}
            search={{
              page: 1,
              search: transactions.data?.income.description
                ? transactions.data?.income.description.slice(0, 10)
                : undefined,
            }}
            className="hover:underline">
            <div className="flex flex-col gap-1">
              {transactions.data?.income.description ? (
                <p>&quot;{transactions.data?.income.description}&quot;</p>
              ) : null}
              <p className="text-3xl font-semibold text-green-700">
                {transactions.data?.income.value
                  ? `+${transactions.data.income.value}`
                  : 0}
              </p>
            </div>
          </Link>
        </div>

        <div className="flex flex-col gap-1">
          <h2 className="text-muted-foreground">Largest expense</h2>
          <Link
            to={'/transactions'}
            search={{
              page: 1,
              search: transactions.data?.expense.description
                ? transactions.data?.expense.description.slice(0, 10)
                : undefined,
            }}
            className="hover:underline">
            <div className="flex flex-col gap-1">
              {transactions.data?.expense.description ? (
                <p>&quot;{transactions.data?.expense.description}&quot;</p>
              ) : null}
              <p className="text-3xl font-semibold text-red-700">
                {transactions.data?.expense.value || 0}
              </p>
            </div>
          </Link>
        </div>
      </div>
    </BiggestTransactionCardContainer>
  )
}
