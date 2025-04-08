import { MoreHorizontal } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const invoices = [
  {
    date: new Date().toISOString(),
    description: 'coffee store',
    category: 'grocery',
    amount: -10,
  },
  {
    date: new Date(new Date().getTime() - 86400000).toISOString(), // Yesterday
    description: 'salary',
    category: 'income',
    amount: 2000,
  },
  {
    date: new Date(new Date().getTime() - 172800000).toISOString(), // Two days ago
    description: 'online course',
    category: 'education',
    amount: -50,
  },
  {
    date: new Date(new Date().getTime() - 259200000).toISOString(), // Three days ago
    description: 'gas station',
    category: 'transport',
    amount: -30,
  },
  {
    date: new Date(new Date().getTime() - 345600000).toISOString(), // Four days ago
    description: 'restaurant dinner',
    category: 'food',
    amount: -75,
  },
  {
    date: new Date(new Date().getTime() - 432000000).toISOString(), // Five days ago
    description: 'online store purchase',
    category: 'shopping',
    amount: -120,
  },
  {
    date: new Date(new Date().getTime() - 518400000).toISOString(), // Six days ago
    description: 'rent payment',
    category: 'housing',
    amount: -800,
  },
  {
    date: new Date(new Date().getTime() - 604800000).toISOString(), // Seven days ago.
    description: 'Interest Income',
    category: 'income',
    amount: 15,
  },
  {
    date: new Date(new Date().getTime() - 691200000).toISOString(), // Eight days ago.
    description: 'Streaming service',
    category: 'entertainment',
    amount: -12,
  },
  {
    date: new Date(new Date().getTime() - 777600000).toISOString(), // Nine days ago.
    description: 'Phone bill',
    category: 'utilities',
    amount: -60,
  },
]

export const TransactionsTable = () => {
  return (
    <div className="flex flex-col rounded-lg border p-2">
      <div className="p-4 text-2xl font-semibold">
        <h3>All transactions</h3>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-muted-foreground w-[100px] p-4 text-sm">
              Date
            </TableHead>
            <TableHead className="text-muted-foreground p-4 text-sm">
              Description
            </TableHead>
            <TableHead className="text-muted-foreground p-4 text-sm">
              Category
            </TableHead>
            <TableHead className="text-muted-foreground p-4 text-right text-sm">
              Amount
            </TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow key={invoice.description}>
              <TableCell className="p-4 font-medium">
                {new Date(invoice.date).toLocaleString()}
              </TableCell>
              <TableCell className="p-4">{invoice.description}</TableCell>
              <TableCell className="p-4">{invoice.category}</TableCell>
              <TableCell className="p-4 text-right">{invoice.amount}</TableCell>
              <TableCell className="p-4 text-right">
                <Button type="button" size={'sm'} variant={'outline'}>
                  <MoreHorizontal />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
