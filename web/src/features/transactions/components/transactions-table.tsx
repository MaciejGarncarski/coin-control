import { useQueryClient } from '@tanstack/react-query'
import { useNavigate, useSearch } from '@tanstack/react-router'
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useMemo } from 'react'

import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  getTransactionQueryOptions,
  useGetTransactions,
} from '@/features/transactions/api/get-transaction'
import { transactionsTableColumns } from '@/features/transactions/components/transactions-table-columns'
import { cn } from '@/lib/utils'

export const TransactionsTable = () => {
  const transactions = useGetTransactions()
  const search = useSearch({ from: '/_authenticated/transactions' })
  const navigate = useNavigate({ from: '/transactions' })
  const queryClient = useQueryClient()

  const tableData = useMemo(
    () =>
      transactions.isLoading
        ? Array(10).fill({})
        : (transactions.data?.transactions ?? []),
    [transactions.isLoading, transactions.data?.transactions],
  )

  const columnsMemo = useMemo(
    () =>
      transactions.isLoading
        ? transactionsTableColumns.map((column) => ({
            ...column,
            cell: () => <Skeleton className="h-8" />,
          }))
        : transactionsTableColumns,
    [transactions.isLoading],
  )

  const table = useReactTable({
    columns: columnsMemo,
    data: tableData,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div>
      <div className="flex flex-col rounded-lg border">
        <Table className="table-fixed">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      className={cn(
                        'w-32 p-4',
                        header.column.columnDef.meta?.isWide && 'md:w-[20rem]',
                      )}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="w-auto overflow-x-auto">
            {table.getRowModel().rows.map((row) => {
              return (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <TableCell key={cell.id} className={'px-4 py-1'}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    )
                  })}
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
      <div className="mt-4 flex justify-center">
        <div className="flex items-center justify-center gap-8 p-4">
          <Button
            variant="outline"
            size="sm"
            disabled={Number(search.page) - 1 < 1}
            onClick={() =>
              navigate({
                search: {
                  page: Number(search.page) - 1,
                  dateFrom: search.dateFrom,
                  dateTo: search.dateTo,
                  search: search.search,
                },
                viewTransition: false,
              })
            }>
            <ChevronLeft />
            Previous
          </Button>
          <p className="text-muted-foreground text-sm">
            Page <span className="font-medium">{search.page}</span> of{' '}
            <span className="font-medium">
              {transactions.data?.maxPages || 1}
            </span>
          </p>
          <Button
            variant="outline"
            size="sm"
            onMouseOver={() => {
              queryClient.prefetchQuery(
                getTransactionQueryOptions({
                  dateFrom: search.dateFrom || null,
                  dateTo: search.dateTo || null,
                  page: (Number(search.page) + 1).toString(),
                  search: search.search || null,
                }),
              )
            }}
            disabled={
              Number(search.page) - 1 >= (transactions.data?.maxPages || 1) - 1
            }
            onClick={() =>
              navigate({
                search: {
                  page: Number(search.page) + 1,
                  dateFrom: search.dateFrom,
                  dateTo: search.dateTo,
                  search: search.search,
                },
                viewTransition: false,
              })
            }>
            Next
            <ChevronRight />
          </Button>
        </div>
      </div>
    </div>
  )
}
