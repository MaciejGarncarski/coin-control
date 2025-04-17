import { db, Prisma } from '@shared/database'
import {
  type AddTransactionMutation,
  type Category,
  type DeleteTransactionParams,
  type EditTransactionMutation,
  type EditTransactionParams,
  type GetRecentTransactions,
  type GetTransactionOverview,
  type GetTransactionsQuery,
  type GetTransactionsResponse,
  type RecentTransaction,
} from '@shared/schemas'
import { fromZonedTime } from 'date-fns-tz'
import { type Request, type Response } from 'express'
import status from 'http-status'
import ms from 'ms'
import { v7 } from 'uuid'

import { decrypt, encrypt } from '../../utils/encryption.js'
import type {
  TypedRequestBody,
  TypedRequestParams,
  TypedRequestQuery,
} from '../../utils/typed-request.js'

const TRANSACTIONS_PER_PAGE = 10

type Query = {
  dateFrom: string
  dateTo: string
  page?: string
  search?: string
  category?: Category
  tz?: string
}

export async function getTransactionsHandler(
  req: TypedRequestQuery<Query>,
  res: Response,
) {
  const userId = req.session.userId
  const currPage = req.query.page || 1
  const timeZone = req.query.tz || 'Europe/Warsaw'

  const dateFrom = req.query.dateFrom
    ? fromZonedTime(new Date(req.query.dateFrom).setHours(0, 0, 0, 0), timeZone)
    : undefined
  const dateTo = req.query.dateTo
    ? fromZonedTime(
        new Date(req.query.dateTo).setHours(23, 59, 59, 999),
        timeZone,
      )
    : undefined

  const category = req.query.category
    ? req.query.category.trim() === ''
      ? undefined
      : req.query.category
    : undefined

  const search = req.query.search
    ? req.query.search.trim() === ''
      ? undefined
      : req.query.search
    : undefined

  const whereClause: Prisma.transactionsWhereInput = search
    ? {
        OR: [
          {
            description: {
              contains: search,
              mode: 'insensitive',
            },
          },
        ],
        category: category,
        user_id: userId,
        transaction_date: {
          gte: dateFrom,
          lte: dateTo,
        },
      }
    : {
        category: category,
        user_id: userId,
        transaction_date: {
          gte: dateFrom,
          lte: dateTo,
        },
      }

  const skipBase = (Number(currPage || 1) - 1) * TRANSACTIONS_PER_PAGE
  const skipValue = skipBase < 0 ? 0 : skipBase

  const transactions = await db.transactions.findMany({
    where: whereClause,
    orderBy: {
      transaction_date: 'desc',
    },
    take: TRANSACTIONS_PER_PAGE,
    skip: skipValue,
  })

  const transactionsCount = await db.transactions.count({
    where: whereClause,
  })

  const maxPages = Math.ceil(transactionsCount / TRANSACTIONS_PER_PAGE)
  const currentPage = Number(currPage || 1)

  const transactionsDTO = transactions.map((t): GetTransactionsQuery => {
    const decryptedDescription = t.description
      ? decrypt(t.description)
      : undefined

    return {
      transactionId: t.transaction_id,
      description: decryptedDescription || null,
      category: t.category ?? 'other',
      amount: parseFloat(parseFloat(t.amount.toString()).toFixed(2)),
      date: t.transaction_date,
    }
  })

  const took =
    transactions.length === TRANSACTIONS_PER_PAGE
      ? transactions.length * Number(currPage || 1)
      : TRANSACTIONS_PER_PAGE * Number(currPage || 1) + transactions.length

  const returnValue: GetTransactionsResponse = {
    transactions: transactionsDTO,
    total: transactionsCount,
    took,
    currentPage,
    maxPages,
  }

  res.status(status.OK).json(returnValue)
  return
}

export async function addTransactionHandler(
  req: TypedRequestBody<AddTransactionMutation>,
  res: Response,
) {
  const userId = req.session.userId
  const { description, category, amount } = req.body

  const encryptedDescription = description ? encrypt(description) : undefined

  try {
    const transaction = await db.transactions.create({
      data: {
        user_id: userId,
        description: encryptedDescription,
        transaction_id: v7(),
        category,
        amount,
        transaction_date: new Date(),
      },
    })

    const transactionDTO: GetTransactionsQuery = {
      transactionId: transaction.transaction_id,
      description: transaction.description,
      category: transaction.category ?? 'other',
      amount: parseFloat(parseFloat(transaction.amount.toString()).toFixed(2)),
      date: transaction.transaction_date,
    }

    res.status(status.CREATED).json({ transaction: transactionDTO })
    return
  } catch (error) {
    res.status(status.BAD_REQUEST).json({ message: 'Invalid data' })
  }
}

export async function deleteTransactionHandler(
  req: TypedRequestParams<DeleteTransactionParams>,
  res: Response,
) {
  const userId = req.session.userId
  const transactionId = req.params.transactionId

  await db.transactions.delete({
    where: {
      transaction_id: transactionId,
      user_id: userId,
    },
  })

  res.status(status.OK).json({ message: 'ok' })
  return
}

const RECENT_TRANSACTIONS = 6

export async function getRecentTransactionsHandler(
  req: Request,
  res: Response,
) {
  const userId = req.session.userId

  const transactionCountThisMonth = await db.transactions.count({
    where: {
      user_id: userId,
      transaction_date: {
        gte: new Date(Date.now() - ms('30 days')),
      },
    },
  })

  const recentTransactions = await db.transactions.findMany({
    where: {
      user_id: userId,
    },
    orderBy: {
      transaction_date: 'desc',
    },
    take: RECENT_TRANSACTIONS,
  })

  const transactionsDto = recentTransactions.map(
    ({
      amount,
      category,
      description,
      transaction_id,
      transaction_date,
    }): RecentTransaction => {
      const decryptedDescription = description
        ? decrypt(description)
        : undefined

      return {
        amount: parseFloat(parseFloat(amount.toString()).toFixed(2)),
        category: category || 'other',
        description: decryptedDescription || null,
        date: transaction_date,
        transactionId: transaction_id,
      }
    },
  )

  const response: GetRecentTransactions = {
    recentTransactions: transactionsDto,
    transactionCountThisMonth,
  }

  res.status(status.OK).send(response)
  return
}

type OverviewQuery = {
  tz?: string
  currDate?: string
}

export async function getTransactionOverviewHandler(
  req: TypedRequestQuery<OverviewQuery>,
  res: Response,
) {
  const userId = req.session.userId
  const timeZone = req.query.tz || 'Europe/Warsaw'
  const currDate = new Date(req.query.currDate || new Date())

  const formattedDate = fromZonedTime(
    new Date(currDate).setHours(23, 59, 59, 999),
    timeZone,
  )

  const userTransactions = await db.transactions.findMany({
    where: {
      user_id: userId,
      transaction_date: {
        gte: new Date(formattedDate.getTime() - ms('7 days')),
      },
    },
    orderBy: {
      transaction_date: 'asc',
    },
    select: {
      transaction_date: true,
      transaction_id: true,
    },
  })

  const response: GetTransactionOverview = {
    data: userTransactions.map((tr) => {
      return {
        transactionDate: tr.transaction_date.toString(),
        transactionId: tr.transaction_id,
      }
    }),
  }

  res.status(status.OK).send(response)
  return
}

export async function editTransactionHandler(
  req: TypedRequestBody<EditTransactionMutation> &
    TypedRequestParams<EditTransactionParams>,
  res: Response,
) {
  const transactionId = req.params.transactionId
  const body = req.body
  const userId = req.session.userId

  const encryptedDescription = body.description
    ? encrypt(body.description)
    : undefined

  const updated = await db.transactions.update({
    where: {
      transaction_id: transactionId,
      user_id: userId,
    },
    data: {
      amount: body.amount,
      category: body.category,
      description: encryptedDescription,
    },
  })

  res.status(status.OK).send(updated)
  return
}
