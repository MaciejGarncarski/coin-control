import { TZDate } from '@date-fns/tz'
import { db } from '@shared/database'
import type { CategoriesAnalytics, Category } from '@shared/schemas'
import type { Response } from 'express'
import status from 'http-status'
import ms from 'ms'

import type { TypedRequestQuery } from '../../utils/typed-request.js'

type GetCategoriesQuery = {
  tz?: string
}

export async function getCategoriesHandler(
  req: TypedRequestQuery<GetCategoriesQuery>,
  res: Response,
) {
  const userId = req.session.userId
  const timeZone = req.query.tz || 'Europe/Warsaw'
  const currDate = new Date()

  const formattedDate = new TZDate(
    new Date(currDate).setHours(23, 59, 59, 999),
    timeZone,
  )

  const transactionsLastMonth = await db.transactions.findMany({
    where: {
      user_id: userId,
      transaction_date: {
        gte: new Date(formattedDate.getTime() - ms('30 days')),
      },
    },
    select: {
      transaction_date: true,
      category: true,
    },
  })

  const groupedTransactionsByCategory = transactionsLastMonth.reduce(
    (acc, el) => {
      const prevVal = acc[el.category || 'other']

      return {
        ...acc,
        [el.category || 'other']: prevVal + 1,
      }
    },
    {
      foodAndDrink: 0,
      groceries: 0,
      housing: 0,
      income: 0,
      other: 0,
      shopping: 0,
      transportation: 0,
      utilities: 0,
    } as Record<Category, number>,
  )

  const responseData = {
    categories: Object.entries(groupedTransactionsByCategory)
      .map(([key, val]) => {
        return { category: key as Category, value: val }
      })
      .filter(({ value }) => value > 0),
  } satisfies CategoriesAnalytics

  res.status(status.OK).send(responseData)
}
