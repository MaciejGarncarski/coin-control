import { Link } from '@tanstack/react-router'
import { Plus } from 'lucide-react'

export const NoTransactions = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20">
      <h3 className="text-center text-lg">
        No transactions yet. <br /> Click on button below to add one.
      </h3>
      <Link
        to="/transactions"
        className="border-reflect bg-primary/30 flex w-fit items-center rounded-md px-3 py-1"
        viewTransition={false}
        search={{
          page: 1,
          addTransaction: true,
        }}>
        <Plus /> Add transaction
      </Link>
    </div>
  )
}
