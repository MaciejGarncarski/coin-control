import { db } from '@shared/database'
import type { Category, GetStatistics } from '@shared/schemas'
import type { Request, Response } from 'express'
import status from 'http-status'
import ms from 'ms'

import { decimalToNumber } from '../../utils/decimal-to-number.js'

export async function getStatisticsHandler(req: Request, res: Response) {
  const userId = req.session.userId

  const transactions = await db.transactions.findMany({
    where: {
      user_id: userId,
    },
    select: {
      amount: true,
      transaction_date: true,
      category: true,
    },
  })

  const totalBalance = parseFloat(
    transactions
      .reduce((result, el) => {
        return result + decimalToNumber(el.amount)
      }, 0)
      .toFixed(2),
  )

  const thisMonthSpending = parseFloat(
    transactions
      .filter(({ amount, transaction_date }) => {
        return (
          Number(amount) < 0 &&
          transaction_date.getTime() >= Date.now() - ms('30 days')
        )
      })
      .reduce((result, el) => {
        return result + decimalToNumber(el.amount)
      }, 0)
      .toFixed(2),
  )

  const thisMonthIncome = parseFloat(
    transactions
      .filter(({ amount, transaction_date }) => {
        return (
          Number(amount) > 0 &&
          transaction_date.getTime() >= Date.now() - ms('30 days')
        )
      })
      .reduce((result, el) => {
        return result + decimalToNumber(el.amount)
      }, 0)
      .toFixed(2),
  )

  const commonCategories = new Map<Category, number>()

  const thisMonthCategory = transactions.filter(({ transaction_date }) => {
    return transaction_date.getTime() >= Date.now() - ms('30 days')
  })

  thisMonthCategory.forEach(({ category }) =>
    commonCategories.set(
      category || 'other',
      (commonCategories.get(category || 'other') || 0) + 1,
    ),
  )

  const mostCommonCategory = findKeyWithHighestValue(commonCategories)

  const response: GetStatistics = {
    totalBalance: {
      changeFromLastMonth: 10,
      value: totalBalance,
    },
    thisMonthIncome: {
      changeFromLastMonth: 10,
      value: thisMonthIncome,
    },
    thisMonthSpending: {
      changeFromLastMonth: 10,
      value: Math.abs(thisMonthSpending),
    },
    mostCommonCategoryThisMonth: mostCommonCategory || 'other',
  }

  res.status(status.OK).json(response)
  return
}

function findKeyWithHighestValue(map: Map<Category, number>) {
  if (!map || map.size === 0) {
    return undefined // Handle empty map case
  }

  let highestValue = -Infinity
  let highestKey = undefined

  for (const [key, value] of map) {
    if (value > highestValue) {
      highestValue = value
      highestKey = key
    }
  }

  return highestKey
}
