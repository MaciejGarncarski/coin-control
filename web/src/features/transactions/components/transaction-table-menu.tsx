import type { Category } from '@shared/schemas'
import { Edit, MoreHorizontal, Trash } from 'lucide-react'
import { useState } from 'react'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useDeleteTransaction } from '@/features/transactions/api/delete-transaction'
import { EditTransactionForm } from '@/features/transactions/components/edit-transaction-form'

type Props = {
  transactionId: string
  amount: number
  category: Category
  description: string
  date: Date
}

export const TransactionTableMenu = ({
  transactionId,
  amount,
  category,
  description,
  date,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)

  const deleteMutation = useDeleteTransaction()

  const deleteTransaction = () => {
    deleteMutation.mutate(transactionId, {
      onSuccess: () => {
        setIsOpen(false)
      },
    })
  }

  const openEdit = () => {
    setEditOpen(true)
  }
  const openDelete = () => {
    setDeleteOpen(true)
  }

  return (
    <>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <Button
                variant={'ghost'}
                size={'sm'}
                onClick={openEdit}
                disabled={deleteMutation.isPending}
                className="w-full justify-start text-left font-normal">
                <Edit className="text-muted-foreground" />
                Edit
              </Button>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <Button
                variant={'ghost'}
                size={'sm'}
                onClick={openDelete}
                className="w-full justify-start text-left font-normal">
                <Trash className="text-muted-foreground" />
                Delete
              </Button>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <EditTransactionForm
        isOpen={editOpen}
        date={date}
        setIsOpen={setEditOpen}
        amount={amount}
        category={category}
        description={description}
        transactionId={transactionId}
      />
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will delete your transaction
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={deleteTransaction}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
