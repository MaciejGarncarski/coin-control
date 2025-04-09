import type { Category } from '@shared/schemas'
import {
  ArrowUp,
  Car,
  Coffee,
  House,
  ShoppingBag,
  ShoppingCart,
  Zap,
} from 'lucide-react'
import type { ReactNode } from 'react'

const categoryIcons: Record<Category, ReactNode> = {
  foodAndDrink: <Coffee className="h-4 w-4 text-orange-600" />,
  groceries: <ShoppingCart className="h-4 w-4 text-green-600" />,
  income: <ArrowUp className="h-4 w-4 text-green-600" />,
  utilities: <Zap className="h-4 w-4 text-blue-600" />,
  housing: <House className="h-4 w-4 text-green-600" />,
  shopping: <ShoppingBag className="h-4 w-4 text-green-600" />,
  transportation: <Car className="h-4 w-4" />,
}

type Props = {
  category: Category
}

export const TransactionCategoryIcon = ({ category }: Props) => {
  return (
    <div className="bg-muted flex h-8 w-8 items-center justify-center rounded-full">
      {categoryIcons[category]}
    </div>
  )
}
