import { TZDate } from '@date-fns/tz'
import { db } from '@shared/database'
import type {
  CategoriesAnalytics,
  Category,
  Month,
  TransactionsByMonth,
} from '@shared/schemas'
import { format } from 'date-fns'
import type { Request, Response } from 'express'
import status from 'http-status'
import ms from 'ms'

import { decimalToNumber } from '../../utils/decimal-to-number.js'
import { decrypt } from '../../utils/encryption.js'
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

export async function getLargestExpenseIncomeHandler(
  req: Request,
  res: Response,
) {
  const userId = req.session.userId

  const largestIncomeRequest = db.transactions.findFirst({
    where: {
      user_id: userId,
      amount: {
        gt: 0,
      },
    },
    orderBy: {
      amount: 'desc',
    },
    select: {
      amount: true,
      description: true,
    },
  })

  const largestExpenseRequest = db.transactions.findFirst({
    where: {
      user_id: userId,
      amount: {
        lt: 0,
      },
    },
    orderBy: {
      amount: 'asc',
    },
    select: {
      amount: true,
      description: true,
    },
  })

  const [largestExpense, largestIncome] = await Promise.all([
    largestExpenseRequest,
    largestIncomeRequest,
  ])

  res.status(status.OK).send({
    income: {
      value: largestIncome?.amount
        ? decimalToNumber(largestIncome.amount)
        : null,
      description: largestIncome?.description
        ? decrypt(largestIncome.description)
        : null,
    },
    expense: {
      value: largestExpense?.amount
        ? decimalToNumber(largestExpense.amount)
        : null,
      description: largestExpense?.description
        ? decrypt(largestExpense.description)
        : null,
    },
  })
  return
}

export async function getTransactionsByMonthHandler(
  req: Request,
  res: Response,
) {
  const userId = req.session.userId

  const transactions = await db.transactions.findMany({
    where: {
      user_id: userId,
      transaction_date: {
        gte: new Date(Date.now() - ms('1 year')),
      },
    },
    select: {
      transaction_date: true,
      amount: true,
    },
  })

  const defaultValue = {
    January: { income: 0, expense: 0 },
    February: { income: 0, expense: 0 },
    March: { income: 0, expense: 0 },
    April: { income: 0, expense: 0 },
    May: { income: 0, expense: 0 },
    June: { income: 0, expense: 0 },
    July: { income: 0, expense: 0 },
    August: { income: 0, expense: 0 },
    September: { income: 0, expense: 0 },
    October: { income: 0, expense: 0 },
    November: { income: 0, expense: 0 },
    December: { income: 0, expense: 0 },
  } satisfies Record<
    Month,
    {
      income: number
      expense: number
    }
  >

  const transactionsData = transactions.reduce((acc, el) => {
    const monthName = format(el.transaction_date, 'LLLL') as Month

    const prevExpense = acc[monthName].expense || 0
    const prevIncome = acc[monthName].income || 0

    const currentValue = decimalToNumber(el.amount || 0)

    if (currentValue > 0) {
      return {
        ...acc,
        [monthName]: {
          income: prevIncome + decimalToNumber(el.amount),
          expense: acc[monthName].expense,
        },
      }
    }

    return {
      ...acc,
      [monthName]: {
        income: acc[monthName].income,
        expense: prevExpense + Math.abs(decimalToNumber(el.amount)),
      },
    }
  }, defaultValue)

  const resposneDto = Object.entries(transactionsData).map(([key, val]) => {
    return { month: key as Month, income: val.income, expense: val.expense }
  })

  const responseData = { data: resposneDto } satisfies TransactionsByMonth

  res.status(status.OK).send(responseData)
  return
}
