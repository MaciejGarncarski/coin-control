import { Link } from '@tanstack/react-router'
import { Plus } from 'lucide-react'

type Props = {
  title?: string
}

export const NoTransactions = ({ title = 'No transactions yet.' }: Props) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20">
      <h3 className="text-muted-foreground text-center text-lg">
        {title} <br /> Click on button below to add one.
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
