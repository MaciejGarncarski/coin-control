import { Link } from '@tanstack/react-router'
import { Plus } from 'lucide-react'

export const TooFewTransactions = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20">
      <h3 className="text-center text-lg">
        Not enough data. <br /> Click on button below to add one.
      </h3>
      <Link
        to="/transactions"
        className="border-reflect bg-primary/30 flex w-fit items-center rounded-md px-3 py-1"
        viewTransition={false}
        search={{
          addTransaction: true,
          page: 1,
        }}>
        <Plus /> Add transaction
      </Link>
    </div>
  )
}
