import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useMemo } from 'react'

import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useGetTransactions } from '@/features/transactions/api/get-transaction'
import { TransactionTablePagination } from '@/features/transactions/components/transaction-table-pagination'
import { transactionsTableColumns } from '@/features/transactions/components/transactions-table-columns'
import { cn } from '@/lib/utils'

export const TransactionsTable = () => {
  const transactions = useGetTransactions()

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

  if (transactions.error) {
    return (
      <div className="text-foreground my-10 flex flex-col items-center justify-center gap-1 text-center">
        <h2 className="text-muted-foreground text-3xl font-semibold">
          Failed to load data
        </h2>
        <p className="text-muted-foreground">Try again later.</p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex flex-col">
        <Table className="table-fixed border-separate border-spacing-0">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      className={cn(
                        'bg-card relative h-9 w-[10rem] border-y px-4 py-2 select-none first:rounded-l-lg first:border-l last:rounded-r-lg last:border-r',
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
          <TableBody className="table-row h-1" />
          <TableBody className="w-auto overflow-x-auto">
            {table.getRowModel().rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={5}>
                  <p className="text-muted-foreground px-10 py-4 text-center text-lg">
                    No data.
                  </p>
                </TableCell>
              </TableRow>
            )}
            {table.getRowModel().rows.map((row) => {
              return (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <TableCell
                        key={cell.id}
                        className="relative h-9 border-b px-4 py-1">
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
      <TransactionTablePagination />
    </div>
  )
}
